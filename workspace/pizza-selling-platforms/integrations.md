## Pizza‑Selling Platform – Integration & Content Blueprint  
*Prepared by **Brook – Integrations & Content Specialist***  

---  

## 1. Integration Requirements  

| External Service | Purpose | Primary Interaction | Authentication | SLA / Resilience |
|------------------|---------|---------------------|----------------|------------------|
| **Payment Gateway** (e.g., Stripe, PayPal) | Capture & settle payments | `POST /payments/intent` → create payment intent, `GET /payments/status/:id` | API‑Key / OAuth‑Client‑Credentials | Retry on 5xx, fallback mock intent (0 USD) for offline dev |
| **Delivery / Logistics** (e.g., DoorDash, UberEats) | Create delivery jobs, track status | `POST /delivery/jobs` → schedule, `GET /delivery/jobs/:id` | Bearer token | Exponential back‑off, mock “In‑Transit” after 2 s |
| **SMS / Email Notification** (Twilio, SendGrid) | Order confirmations, status updates | `POST /notifications` | API‑Key | Queue & retry, mock 200 OK with `messageId: "mock‑123"` |
| **Identity Provider** (Auth0, Cognito) | Customer login / JWT issuance | `POST /auth/login`, `POST /auth/refresh` | Client‑Secret | Offline mock JWT (HS256, 1 h) |
| **Analytics / Event Hub** (Segment, Azure Event Grid) | Capture behavioural events | `POST /analytics/events` | API‑Key | Buffer locally if offline, replay on reconnect |

*All external calls must be wrapped in a **service‑layer** that provides:*

1. **Circuit‑breaker** – open after 3 consecutive failures, close after 30 s.  
2. **Timeout** – 5 s for payment, 3 s for delivery, 2 s for notifications.  
3. **Latency Simulation** – dev mode adds 200‑800 ms random delay to mimic cloud latency.  

---  

## 2. RESTful API Contracts  

### 2.1 Authentication  

| Method | Path | Query | Request Body | Success Response | Errors |
|--------|------|-------|--------------|------------------|--------|
| `POST` | `/auth/login` | – | `{ "email": "string", "password": "string" }` | `200 OK` <br> `{ "accessToken": "jwt", "refreshToken": "jwt", "expiresIn": 3600 }` | `400`, `401`, `429`, `500` |
| `POST` | `/auth/refresh` | – | `{ "refreshToken": "jwt" }` | `200 OK` <br> `{ "accessToken": "jwt", "expiresIn": 3600 }` | `401`, `403`, `500` |

### 2.2 Pizza Catalog  

| Method | Path | Query | Request Body | Success Response | Errors |
|--------|------|-------|--------------|------------------|--------|
| `GET` | `/pizzas` | `?category=string&available=true` | – | `200 OK` <br> `[{Pizza}]` | `400`, `500` |
| `GET` | `/pizzas/{pizzaId}` | – | – | `200 OK` <br> `{Pizza}` | `404`, `500` |
| `POST` | `/pizzas` *(admin)* | – | `{PizzaCreate}` | `201 Created` <br> `{Pizza}` | `400`, `401`, `409`, `500` |
| `PUT` | `/pizzas/{pizzaId}` *(admin)* | – | `{PizzaUpdate}` | `200 OK` <br> `{Pizza}` | `400`, `401`, `404`, `500` |
| `DELETE` | `/pizzas/{pizzaId}` *(admin)* | – | – | `204 No Content` | `401`, `404`, `500` |

**`Pizza` schema (response)**  

```json
{
  "id": "uuid",
  "name": "Margherita",
  "description": "Classic tomato, mozzarella & basil",
  "category": "Vegetarian",
  "priceCents": 1299,
  "imageUrl": "https://cdn.example.com/pizzas/margherita.png",
  "toppings": [
    { "id": "uuid", "name": "Mozzarella", "extraCostCents": 0 }
  ],
  "available": true,
  "createdAt": "2024-09-01T12:34:56.000Z",
  "updatedAt": "2024-09-10T08:22:11.000Z"
}
```

**`PizzaCreate` request**  

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `name` | string | ✅ | 3‑50 chars |
| `description` | string | ✅ | ≤ 200 chars |
| `category` | enum(`Vegetarian`, `Meat`, `Vegan`, `Special`) | ✅ | — |
| `priceCents` | integer | ✅ | ≥ 500 (≥ $5.00) |
| `imageUrl` | string (URL) | ✅ | Must be HTTPS |
| `toppings` | array of `{ id: uuid, extraCostCents?: integer }` | optional | `extraCostCents` ≥ 0 |
| `available` | boolean | ✅ | — |

### 2.3 Customer Management  

| Method | Path | Query | Request Body | Success Response | Errors |
|--------|------|-------|--------------|------------------|--------|
| `GET` | `/customers/me` | – | – | `200 OK` <br> `{Customer}` | `401`, `500` |
| `POST` | `/customers` | – | `{CustomerCreate}` | `201 Created` <br> `{Customer}` | `400`, `409`, `500` |
| `PUT` | `/customers/me` | – | `{CustomerUpdate}` | `200 OK` <br> `{Customer}` | `400`, `401`, `500` |

**`Customer` schema**  

```json
{
  "id": "uuid",
  "firstName": "Lara",
  "lastName": "Croft",
  "email": "lara@example.com",
  "phone": "+1-555-0123",
  "address": {
    "line1": "123 Main St",
    "line2": "",
    "city": "Seattle",
    "state": "WA",
    "postalCode": "98101",
    "country": "US"
  },
  "createdAt": "2024-08-15T09:12:45.000Z",
  "updatedAt": "2024-09-12T14:05:22.000Z"
}
```

### 2.4 Order Lifecycle  

| Method | Path | Query | Request Body | Success Response | Errors |
|--------|------|-------|--------------|------------------|--------|
| `POST` | `/orders` | – | `{OrderCreate}` | `201 Created` <br> `{Order}` | `400`, `401`, `402 (payment)`, `500` |
| `GET` | `/orders/{orderId}` | – | – | `200 OK` <br> `{Order}` | `401`, `404`, `500` |
| `GET` | `/orders` | `?status=string` | – | `200 OK` <br> `[{Order}]` | `401`, `500` |
| `PATCH` | `/orders/{orderId}/status` *(admin)* | – | `{ "status": "enum" }` | `200 OK` <br> `{Order}` | `400`, `401`, `404`, `500` |

**`OrderCreate` request**  

```json
{
  "customerId": "uuid",
  "items": [
    {
      "pizzaId": "uuid",
      "quantity": 2,
      "extraToppings": [
        { "toppingId": "uuid", "extraCostCents": 150 }
      ]
    }
  ],
  "deliveryAddress": {
    "line1": "456 Oak Ave",
    "city": "Portland",
    "state": "OR",
    "postalCode": "97035",
    "country": "US"
  },
  "paymentMethod": "card",          // enum: card | wallet | cash_on_delivery
  "promoCode": "WELCOME10"          // optional
}
```

**`Order` response schema**  

```json
{
  "id": "uuid",
  "customerId": "uuid",
  "items": [
    {
      "pizzaId": "uuid",
      "name": "Pepperoni",
      "quantity": 1,
      "basePriceCents": 1499,
      "extraToppings": [
        { "toppingId": "uuid", "name": "Extra Cheese", "extraCostCents": 150 }
      ],
      "totalItemCents": 1649
    }
  ],
  "subtotalCents": 1649,
  "discountCents": 165,
  "taxCents": 124,
  "totalCents": 1608,
  "currency": "USD",
  "status": "pending",                 // enum: pending, paid, preparing, out_for_delivery, delivered, cancelled
  "paymentIntentId": "pi_1ABCxyz",     // from payment gateway
  "deliveryJobId": "dj_9kLmN",         // from delivery service
  "createdAt": "2024-09-14T18:03:21.000Z",
  "updatedAt": "2024-09-14T18:05:12.000Z"
}
```

### 2.5 Payment Intent (Gateway Proxy)  

| Method | Path | Query | Request Body | Success Response |
|--------|------|-------|--------------|------------------|
| `POST` | `/payments/intent` | – | `{ amountCents, currency, customerId, orderId }` | `201 Created` <br> `{ "clientSecret": "string", "paymentIntentId": "string" }` |
| `GET` | `/payments/status/:intentId` | – | – | `200 OK` <br> `{ "status": "succeeded|requires_action|failed", "amountCents": 1608 }` |

**Mock offline payload** (used when gateway unreachable):

```json
{
  "clientSecret": "mock_secret_123",
  "paymentIntentId": "mock_intent_001"
}
```

---  

## 3. Data Sanitization & Payload Typing  

| Field | Type | Format / Constraints | Sanitization |
|-------|------|----------------------|--------------|
| `id` | string | UUID v4 | Validate with regex `^[0-9a-fA-F]{8}-...$` |
| `email` | string | RFC‑5322 email | Lower‑case, trim whitespace |
| `phone` | string | E.164 (`+1XXXXXXXXXX`) | Strip non‑digits, prepend `+` if missing |
| `priceCents`, `extraCostCents` | integer | ≥ 0 | Clamp to 0 if negative (reject otherwise) |
| `timestamp` fields | string | ISO‑8601 UTC (`YYYY-MM-DDTHH:mm:ss.sssZ`) | Parse with `Date.parse` and re‑serialize |
| `imageUrl` | string | HTTPS URL | Validate with URL constructor, enforce `https:` |
| `status` enums | string | Fixed list (see tables) | Reject unknown values |
| `promoCode` | string | Upper‑case alphanumeric, 3‑12 chars | Upper‑case, trim |

All incoming JSON bodies are **schema‑validated** (e.g., using AJV or Zod) before any business logic runs.  

---  

## 4. Database Schema (Relational)  

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────────┐
│   customers     │      │    pizzas       │      │   toppings           │
├─────────────────┤      ├─────────────────┤      ├─────────────────────┤
│ id PK (UUID)    │◄─────│ id PK (UUID)    │◄─────│ id PK (UUID)         │
│ first_name      │      │ name            │      │ name                 │
│ last_name       │      │ description     │      │ extra_cost_cents    │
│ email UNIQUE    │      │ category ENUM   │      └─────────────────────┘
│ phone           │      │ price_cents     │
│ address_json    │      │ image_url       │
│ created_at      │      │ available BOOL  │
│ updated_at      │      │ created_at      │
└─────────────────┘      │ updated_at      │
                         └─────────────────┘

┌─────────────────────┐      ┌───────────────────────┐
│   order_items       │      │      orders           │
├─────────────────────┤      ├───────────────────────┤
│ id PK (UUID)        │      │ id PK (UUID)          │
│ order_id FK → orders│─────►│ customer_id FK → cust │
│ pizza_id FK → pizzas│      │ status ENUM           │
│ quantity INT        │      │ subtotal_cents        │
│ extra_toppings_json │      │ discount_cents        │
│ total_item_cents    │      │ tax_cents             │
│ created_at          │      │ total_cents           │
│ updated_at          │      │ currency VARCHAR(3)   │
└─────────────────────┘      │ payment_intent_id    │
                             │ delivery_job_id      │
                             │ created_at           │
                             │ updated_at           │
                             └───────────────────────┘
```

*Notes*  

- `address_json` stores a JSON object (line1, line2, city, …).  
- `extra_toppings_json` is an array of `{toppingId, extraCostCents}`.  
- Cascades: `ON DELETE CASCADE` for `order_items` when an `order` is removed; **no cascade** on `pizzas` → `order_items` (historical data kept).  

---  

## 5. Realistic Seed Data  

### 5.1 Toppings  

| id (UUID) | name | extraCostCents |
|-----------|------|----------------|
| `c1a2b3d4-1111-4eaa-9b1f-1234567890ab` | Mozzarella | 0 |
| `c1a2b3d4-2222-4eaa-9b1f-1234567890ab` | Pepperoni | 150 |
| `c1a2b3d4-3333-4eaa-9b1f-1234567890ab` | Mushrooms | 100 |
| `c1a2b3d4-4444-4eaa-9b1f-1234567890ab` | Extra Cheese | 150 |
| `c1a2b3d4-5555-4eaa-9b1f-1234567890ab` | Pineapple | 120 |
| `c1a2b3d4-6666-4eaa-9b1f-1234567890ab` | Jalapeño | 80 |

### 5.2 Pizzas  

```json
[
  {
    "id": "d2f9e1c0-7a5b-4d1e-9c33-0a1b2c3d4e5f",
    "name": "Margherita",
    "description": "Tomato sauce, fresh mozzarella, basil, and olive oil.",
    "category": "Vegetarian",
    "priceCents": 1299,
    "imageUrl": "https://cdn.pizzashop.com/pizzas/margherita.png",
    "toppings": [{ "id": "c1a2b3d4-1111-4eaa-9b1f-1234567890ab", "extraCostCents": 0 }],
    "available": true,
    "createdAt": "2024-08-01T10:00:00.000Z",
    "updatedAt": "2024-08-01T10:00:00.000Z"
  },
  {
    "id": "e3a4b5c6-8d9e-4f0a-b1c2-1d2e3f4a5b6c",
    "name": "Pepperoni Classic",
    "description": "Spicy pepperoni, mozzarella, and house tomato sauce.",
    "category": "Meat",
    "priceCents": 1499,
    "imageUrl": "https://cdn.pizzashop.com/pizzas/pepperoni.png",
    "toppings": [
      { "id": "c1a2b3d4-1111-4eaa-9b1f-1234567890ab", "extraCostCents": 0 },
      { "id": "c1a2b3d4-2222-4eaa-9b1f-1234567890ab", "extraCostCents": 150 }
    ],
    "available": true,
    "createdAt": "2024