# Real‑Estate Property Portal – Integration & Content Specification  
*Prepared by Brook – Integrations & Content Specialist*  

---  

## 1. Overview  

The portal aggregates property listings, offers a price/bedroom filter, provides an on‑the‑fly mortgage calculator, and lets users request an agent consultation via a modal.  
To keep the UI lightweight and future‑proof, each capability is exposed as a **stand‑alone external service** with a clean, versioned HTTP API.  

| Capability | Suggested Service | Primary Responsibility |
|------------|-------------------|------------------------|
| Property Search & Details | **Property‑Catalog Service** | CRUD on listings, rich search & filter |
| Mortgage Computation | **Mortgage‑Engine Service** | Calculate payment schedules, APR, affordability |
| Agent Contact | **Agent‑Consult Service** | Capture leads, schedule callbacks, store interaction history |
| Authentication / Rate‑Limiting | **Gateway / API‑Management** | Centralised OAuth2, API‑key validation, throttling |

---

## 2. Integration Architecture  

```
+-------------------+          +-------------------+          +-------------------+
|   Front‑End UI    |  HTTPS   |   API Gateway     |  HTTPS   |   Property‑Catalog|
| (React / Next.js) |<-------> | (Auth, Rate‑Limit) |<-------> |   Service (v1)   |
+-------------------+          +-------------------+          +-------------------+
                                   |   ^   |
                                   |   |   |
                                   |   |   |
                                   v   |   v
                         +-------------------+   +-------------------+
                         | Mortgage‑Engine   |   | Agent‑Consult     |
                         | Service (v1)      |   | Service (v1)      |
                         +-------------------+   +-------------------+
```

* All services expose **RESTful JSON** endpoints.  
* API versioning is mandatory (`/v1/…`).  
* The gateway enforces **OAuth 2.0 Client‑Credentials** for server‑to‑server calls and **Bearer‑Token** for UI calls (via PKCE).  

---

## 3. API Contracts  

### 3.1 Property‑Catalog Service  

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/v1/properties` | List properties (paged, filterable) |
| `GET` | `/v1/properties/{id}` | Retrieve a single property |
| `POST` | `/v1/properties` | Create a new listing (admin only) |
| `PUT` | `/v1/properties/{id}` | Update a listing (admin only) |
| `DELETE` | `/v1/properties/{id}` | Remove a listing (admin only) |

#### 3.1.1 List Properties – Request  

```http
GET /v1/properties?page=1&pageSize=20&min_price=250000&max_price=750000&bedrooms=3&city=Seattle HTTP/1.1
Authorization: Bearer <access_token>
Accept: application/json
```

| Query Parameter | Type | Required | Description |
|-----------------|------|----------|-------------|
| `page` | integer | No (default 1) | Page number |
| `pageSize` | integer | No (default 20, max 100) | Items per page |
| `min_price` | integer | No | Minimum price (USD) |
| `max_price` | integer | No | Maximum price (USD) |
| `bedrooms` | integer | No | Exact bedroom count (or `bedrooms_min`, `bedrooms_max`) |
| `city` | string | No | City name (case‑insensitive) |
| `type` | enum(`sale`, `rent`) | No | Transaction type |

#### 3.1.2 List Properties – Response  

```json
{
  "meta": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 342,
    "totalPages": 18
  },
  "data": [
    {
      "id": "prop_00123",
      "title": "Modern 3‑Bed Townhouse",
      "address": {
        "line1": "1234 Oak St",
        "city": "Seattle",
        "state": "WA",
        "zip": "98101",
        "lat": 47.6101,
        "lon": -122.3421
      },
      "price": 620000,
      "currency": "USD",
      "bedrooms": 3,
      "bathrooms": 2.5,
      "squareFeet": 1450,
      "type": "sale",
      "images": [
        "https://cdn.example.com/props/prop_00123/img1.jpg",
        "https://cdn.example.com/props/prop_00123/img2.jpg"
      ],
      "listingAgent": {
        "id": "agent_45",
        "name": "Megan Liu",
        "phone": "+1‑206‑555‑0198",
        "email": "megan.liu@realtyco.com"
      },
      "status": "active",
      "createdAt": "2024-08-12T14:23:00Z",
      "updatedAt": "2024-10-02T09:11:45Z"
    }
    /* … more items … */
  ]
}
```

* **Standard pagination** (`meta`) + **HATEOAS** links (optional).  

#### 3.1.3 Single Property – Response  

```json
{
  "id": "prop_00123",
  "title": "Modern 3‑Bed Townhouse",
  "description": "A bright, open‑plan townhouse located in the heart of Seattle...",
  "address": { … },
  "price": 620000,
  "currency": "USD",
  "bedrooms": 3,
  "bathrooms": 2.5,
  "squareFeet": 1450,
  "lotSizeSqFt": 2000,
  "yearBuilt": 2018,
  "type": "sale",
  "features": ["Garage", "Hardwood Floors", "Stainless Steel Appliances"],
  "images": [ … ],
  "virtualTourUrl": "https://vr.example.com/prop_00123",
  "listingAgent": { … },
  "status": "active",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

### 3.2 Mortgage‑Engine Service  

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/v1/calculate` | Compute monthly payment, amortization schedule, and affordability |

#### 3.2.1 Mortgage Calculation – Request  

```http
POST /v1/calculate HTTP/1.1
Authorization: Bearer <access_token>
Content-Type: application/json
Accept: application/json
```

```json
{
  "propertyPrice": 620000,
  "downPayment": 124000,
  "interestRate": 4.25,
  "loanTermYears": 30,
  "propertyTaxRate": 1.2,
  "homeInsuranceAnnual": 1500,
  "pmiRate": 0.5,
  "startDate": "2026-12-01"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `propertyPrice` | number (USD) | ✅ | Full listing price |
| `downPayment` | number (USD) | ✅ | Cash down‑payment |
| `interestRate` | number (percent APR) | ✅ | Fixed‑rate interest |
| `loanTermYears` | integer | ✅ | Length of loan |
| `propertyTaxRate` | number (percent of property price per year) | No (default 1.0) |
| `homeInsuranceAnnual` | number (USD) | No (default 0) |
| `pmiRate` | number (percent of loan per year) | No (default 0.5) |
| `startDate` | string (ISO‑8601) | No (defaults to today) |

#### 3.2.2 Mortgage Calculation – Response  

```json
{
  "monthlyPrincipalAndInterest": 2401.12,
  "monthlyPropertyTax": 620.00,
  "monthlyHomeInsurance": 125.00,
  "monthlyPMI": 129.58,
  "totalMonthlyPayment": 3275.70,
  "totalInterestPaid": 262,394.40,
  "totalPayments": 1,182,394.40,
  "amortizationSchedule": [
    {
      "paymentNumber": 1,
      "date": "2026-12-01",
      "principal": 350.12,
      "interest": 2051.00,
      "balance": 495,649.88
    }
    /* … up to loanTermYears*12 … */
  ],
  "affordability": {
    "maxPurchasePrice": 780000,
    "maxLoanAmount": 624000
  }
}
```

*Only the first **12** rows of `amortizationSchedule` are returned by default; add `?full=true` to retrieve the whole table (subject to size limits).*

---

### 3.3 Agent‑Consult Service  

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/v1/consultations` | Submit a lead request from the modal |
| `GET` | `/v1/consultations/{id}` | Retrieve lead status (authenticated agents only) |

#### 3.3.1 Consultation Request – Payload  

```json
{
  "propertyId": "prop_00123",
  "user": {
    "firstName": "Alex",
    "lastName": "Johnson",
    "email": "alex.johnson@example.com",
    "phone": "+1‑415‑555‑0123"
  },
  "preferredContactMethod": "email",
  "preferredContactTime": {
    "from": "09:00",
    "to": "17:00",
    "timezone": "America/Los_Angeles"
  },
  "message": "I’d like to schedule a viewing next week."
}
```

| Field | Type | Required |
|-------|------|----------|
| `propertyId` | string | ✅ |
| `user.firstName` | string | ✅ |
| `user.lastName` | string | ✅ |
| `user.email` | string (email) | ✅ |
| `user.phone` | string (E.164) | No |
| `preferredContactMethod` | enum(`email`, `phone`, `sms`) | No (default email) |
| `preferredContactTime` | object | No |
| `message` | string | No |

#### 3.3.2 Consultation Response  

```json
{
  "consultationId": "cnsl_9876",
  "status": "queued",
  "estimatedResponseHours": 4,
  "createdAt": "2026-11-04T10:23:41Z",
  "propertyId": "prop_00123",
  "assignedAgentId": null
}
```

*Possible `status` values: `queued`, `assigned`, `contacted`, `closed`.  

---

## 4. Authentication & Security  

| Mechanism | Scope | Details |
|-----------|-------|---------|
| **OAuth 2.0 Client‑Credentials** | Service‑to‑service | `POST /oauth/token` → `access_token` (JWT, 1 h expiry) |
| **OAuth 2.0 PKCE (Authorization Code)** | UI → Gateway | Front‑end obtains short‑lived token for user‑specific calls |
| **HTTPS only** | All traffic | TLS 1.2+; HSTS enabled |
| **CORS** | UI | `Access-Control-Allow-Origin: https://app.example.com` |
| **Rate‑limit** | Per client‑id | `1000 requests / minute` (burst `200`) |
| **IP Allow‑list** | Optional for admin clients | Configurable via gateway UI |
| **Audit Logging** | All endpoints | Request ID, timestamps, payload hash, user/client ID |

**JWT Claims (example):**

```json
{
  "iss": "https://auth.example.com",
  "sub": "client_id_abc123",
  "aud": ["property-catalog", "mortgage-engine", "agent-consult"],
  "exp": 1730000000,
  "iat": 1729996400,
  "scope": "properties:read mortgage:calculate consult:create"
}
```

---

## 5. Error Handling  

| HTTP Code | Meaning | Response Body (JSON) |
|-----------|---------|----------------------|
| `400` | Bad request – validation error | `{ "code":"VALIDATION_ERROR", "message":"...", "details":[{ "field":"price","error":"must be >=0"}] }` |
| `401` | Unauthorized – missing/invalid token | `{ "code":"UNAUTHORIZED","message":"Invalid access token" }` |
| `403` | Forbidden – insufficient scope | `{ "code":"FORBIDDEN","message":"Missing scope mortgage:calculate" }` |
| `404` | Not found – resource does not exist | `{ "code":"NOT_FOUND","message":"Property prop_99999 not found" }` |
| `429` | Too many requests – rate‑limit exceeded | `{ "code":"TOO_MANY_REQUESTS","retryAfter":30 }` |
| `500` | Internal server error – unexpected | `{ "code":"INTERNAL_ERROR","message":"Please try again later" }` |

*All error responses include a **`requestId`** header for tracing.*

---

## 6. Data Formats & Types  

| Domain | JSON Schema (excerpt) | Notes |
|--------|-----------------------|-------|
| **Property** | `#/components/schemas/Property` (see OpenAPI snippet below) | Uses ISO‑8601 timestamps, `price` as integer (cents omitted) |
| **MortgageRequest** | `#/components/schemas/MortgageCalcRequest` | All monetary values are **USD**; percentages are **float** (e.g., `4.25`) |
| **MortgageResponse** | `#/components/schemas/MortgageCalcResponse` | `amortizationSchedule` is an array of `PaymentDetail` |
| **Consultation** | `#/components/schemas/ConsultationRequest` | Optional `phone` – validated against E.164 regex |

### 6.1 OpenAPI 3.1 Snippet (Property‑Catalog)

```yaml
openapi: 3.1.0
info:
  title: Property Catalog API
  version: 1.0.0
servers:
  - url: https://api.example.com/property-catalog
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  schemas:
    Property:
      type: object
      required: [id, title, price, currency, bedrooms, bathrooms, address, status]
      properties:
        id:
          type: string
          format: uuid
        title:
          type: string
        description:
          type: string
        address:
          $ref: '#/components/schemas/Address'
        price:
          type: integer
          description: Price in USD (no cents)
        currency:
          type: string
          enum: [USD, CAD, EUR]
        bedrooms:
          type: integer
        bathrooms:
          type: number
        squareFeet:
          type: integer
        lotSizeSqFt:
          type: integer
        yearBuilt:
          type: integer
        type:
          type: string
          enum: [sale, rent]
        features:
          type: array
          items:
            type: string
        images:
          type: array
          items:
            type: string
            format: uri
        virtualTourUrl:
          type: string
          format: uri
        listingAgent:
          $ref: '#/components/schemas/AgentSummary'
        status:
          type: string
          enum: [active, pending, sold, withdrawn]
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
    Address:
      type: object
      required: [line1, city, state, zip, lat, lon]
      properties:
        line1: {type: string}
        line2: {type: string}
        city: {type: string}
        state: {type: string}
        zip: {type: string}
        lat: {type: number, format: double}
        lon: {type: number, format: double}
    AgentSummary:
      type: object
      required: [id, name, phone, email]
      properties:
        id: {type: string}
        name: {type: string}
        phone: {type: string}
        email: {type: string, format: email}
security:
  - BearerAuth: []
paths:
  /v1/properties:
    get:
      summary: List properties with optional filters
      parameters:
        - $ref: '#/components/parameters/Page'
        - $ref: '#/components/parameters/PageSize'
        - name: min_price
          in: query
          schema: {type: integer}
        - name: max_price
          in: query
          schema: {type: integer}
        - name: bedrooms
          in: query
          schema: {type: integer}
        - name: city
          in: query
          schema: {type: string}
      responses:
        '200':
          description: Paginated list
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PropertyListResponse'
```

*(Similar snippets exist for Mortgage‑Engine and Agent‑Consult.)*

---

## 7. Realistic Sample Data  

### 7.1 Property Listings (10‑row sample)

```json
[
  {
    "id": "prop_00123",