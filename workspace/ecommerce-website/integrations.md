# External Service Integration Blueprint  
**Project:** E‑Commerce Website (Catalog, Details Modal, Search & Category Filters, Interactive Cart, Checkout Simulation, Order Summary, Responsive UI, LocalStorage persistence)  

**Prepared by:** Brook – Integrations & Content Specialist  

---  

## 1. High‑Level Integration Overview  

| Integration | Primary Owner | Purpose | Typical Call Frequency |
|------------|---------------|---------|------------------------|
| **Product Catalog Service** | Backend / Product Team | Retrieve paginated list of products for the catalog view | On page load, on filter change, on infinite‑scroll |
| **Product Details Service** | Backend / Product Team | Pull full product data for the modal/detail page | When a user clicks a product tile |
| **Search Service** | Backend / Search Team | Full‑text search across product name, description & tags | On every keystroke (debounced) or “Search” button |
| **Category Service** | Backend / Taxonomy Team | List of top‑level & nested categories for filter UI | On app init (cached) |
| **Cart Service** *(optional – server‑side persistence)* | Backend / Order Team | Sync cart between devices / store cart for logged‑in users | On add/remove/update cart actions (client‑side fallback via LocalStorage) |
| **Checkout Service** | Backend / Payments Team | Simulate payment processing, validate stock, create order | On “Place Order” click |
| **Order Summary Service** | Backend / Order Team | Retrieve order details for the “Thank‑you” page and user order history | Immediately after checkout, on “My Orders” view |

> **Note:** For a pure front‑end demo you can mock all services locally (e.g., using JSON Server, MirageJS, or MSW). The contracts below are production‑ready and can be used by any mock framework.

---

## 2. API Contracts  

All endpoints follow **RESTful** conventions and exchange **JSON** payloads.  
Base URL (example): `https://api.example.com/v1`

### 2.1. Authentication (Optional)

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| **POST** | `/auth/login` | `{ "email": "string", "password": "string" }` | `{ "accessToken": "jwt", "refreshToken": "jwt", "expiresIn": 3600 }` |
| **POST** | `/auth/refresh` | `{ "refreshToken": "jwt" }` | Same as login response |

> **Header:** `Authorization: Bearer <accessToken>` (required for Cart, Checkout & Order endpoints). Catalog, Search & Category are public.

---

### 2.2. Product Catalog

| Method | Endpoint | Query Params | Request Body | Success Response | Errors |
|--------|----------|--------------|--------------|------------------|--------|
| **GET** | `/products` | `page=number (default=1)`<br>`limit=number (default=20)`<br>`categoryId=string`<br>`priceMin=number`<br>`priceMax=number`<br>`sort=price_asc|price_desc|name_asc|name_desc` | – | `200 OK` → `ProductListResponse` | `400 Bad Request`, `404 Not Found` |

**ProductListResponse**

```json
{
  "page": 1,
  "limit": 20,
  "total": 1245,
  "totalPages": 63,
  "products": [
    {
      "id": "prod_01",
      "name": "Ergonomic Office Chair",
      "slug": "ergonomic-office-chair",
      "shortDescription": "Mesh back, lumbar support, 5‑year warranty.",
      "price": 149.99,
      "currency": "USD",
      "thumbnailUrl": "https://cdn.example.com/products/prod_01/thumb.jpg",
      "rating": 4.5,
      "reviewCount": 87,
      "categoryIds": ["cat_furniture", "cat_office"]
    }
    /* …more items */
  ]
}
```

---

### 2.3. Product Details

| Method | Endpoint | Request Body | Success Response | Errors |
|--------|----------|--------------|------------------|--------|
| **GET** | `/products/{productId}` | – | `200 OK` → `ProductDetail` | `404 Not Found`, `400 Bad Request` |

**ProductDetail**

```json
{
  "id": "prod_01",
  "name": "Ergonomic Office Chair",
  "slug": "ergonomic-office-chair",
  "description": "Full‑size ergonomic office chair with breathable mesh back, adjustable height, tilt‑lock, and 5‑year warranty.",
  "price": 149.99,
  "currency": "USD",
  "images": [
    "https://cdn.example.com/products/prod_01/1.jpg",
    "https://cdn.example.com/products/prod_01/2.jpg",
    "https://cdn.example.com/products/prod_01/3.jpg"
  ],
  "specifications": {
    "Material": "Mesh, Steel frame",
    "WeightCapacityKg": 120,
    "DimensionsCm": { "width": 70, "depth": 70, "height": 115 },
    "ColorOptions": ["Black", "Gray"]
  },
  "stock": 42,
  "rating": 4.5,
  "reviewCount": 87,
  "categoryIds": ["cat_furniture", "cat_office"]
}
```

---

### 2.4. Search Service

| Method | Endpoint | Query Params | Request Body | Success Response | Errors |
|--------|----------|--------------|--------------|------------------|--------|
| **GET** | `/search` | `q=string (required)`<br>`page=number`<br>`limit=number` | – | `200 OK` → `ProductListResponse` (same schema as catalog) | `400 Bad Request` |

*Search is fuzzy, supports typo tolerance, and ranks by relevance + popularity.*

---

### 2.5. Category Service

| Method | Endpoint | Request Body | Success Response | Errors |
|--------|----------|--------------|------------------|--------|
| **GET** | `/categories` | – | `200 OK` → `CategoryTreeResponse` | `500 Internal Server Error` |

**CategoryTreeResponse**

```json
{
  "categories": [
    {
      "id": "cat_furniture",
      "name": "Furniture",
      "slug": "furniture",
      "children": [
        {
          "id": "cat_office",
          "name": "Office",
          "slug": "office",
          "children": []
        },
        {
          "id": "cat_living",
          "name": "Living Room",
          "slug": "living-room",
          "children": []
        }
      ]
    },
    {
      "id": "cat_electronics",
      "name": "Electronics",
      "slug": "electronics",
      "children": [
        {
          "id": "cat_computers",
          "name": "Computers",
          "slug": "computers",
          "children": []
        }
      ]
    }
  ]
}
```

---

### 2.6. Cart Service *(optional – server side)*  

> If you decide to keep the cart only in **LocalStorage**, you can skip the endpoints. The contract below enables future sync for logged‑in users.

| Method | Endpoint | Request Body | Success Response | Errors |
|--------|----------|--------------|------------------|--------|
| **GET** | `/cart` | – | `200 OK` → `{ "items": CartItem[], "subtotal": number, "currency": "USD" }` | `401 Unauthorized` |
| **POST** | `/cart/items` | `AddCartItemRequest` | `201 Created` → Updated cart | `400 Bad Request`, `401 Unauthorized` |
| **PATCH** | `/cart/items/{productId}` | `UpdateCartItemRequest` | `200 OK` → Updated cart | `400`, `404`, `401` |
| **DELETE** | `/cart/items/{productId}` | – | `204 No Content` | `404`, `401` |
| **DELETE** | `/cart` | – | `204 No Content` (clear cart) | `401` |

**AddCartItemRequest**

```json
{
  "productId": "prod_01",
  "quantity": 2
}
```

**UpdateCartItemRequest**

```json
{
  "quantity": 5
}
```

**CartItem (shared schema)**

```json
{
  "productId": "prod_01",
  "name": "Ergonomic Office Chair",
  "price": 149.99,
  "currency": "USD",
  "quantity": 2,
  "thumbnailUrl": "https://cdn.example.com/products/prod_01/thumb.jpg"
}
```

---

### 2.7. Checkout Service  

| Method | Endpoint | Request Body | Success Response | Errors |
|--------|----------|--------------|------------------|--------|
| **POST** | `/checkout` | `CheckoutRequest` | `200 OK` → `CheckoutResponse` | `400 Validation`, `402 Payment Required`, `409 Stock Conflict`, `401 Unauthorized` |

**CheckoutRequest**

```json
{
  "cartItems": [
    {
      "productId": "prod_01",
      "quantity": 2
    },
    {
      "productId": "prod_07",
      "quantity": 1
    }
  ],
  "customer": {
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "phone": "+1-555-0199"
  },
  "shippingAddress": {
    "line1": "123 Main St",
    "line2": "Apt 4B",
    "city": "San Francisco",
    "state": "CA",
    "postalCode": "94107",
    "country": "US"
  },
  "billingAddress": { /* same schema, optional if same as shipping */ },
  "paymentMethod": {
    "type": "card",
    "card": {
      "number": "4242424242424242",
      "expMonth": "12",
      "expYear": "2027",
      "cvc": "123",
      "holderName": "JANE DOE"
    }
  }
}
```

**CheckoutResponse**

```json
{
  "orderId": "ord_20231104_001",
  "status": "CONFIRMED",
  "createdAt": "2026-11-04T14:32:10Z",
  "totalAmount": 449.97,
  "currency": "USD",
  "payment": {
    "method": "card",
    "status": "APPROVED",
    "transactionId": "txn_5f8b9c2a"
  },
  "estimatedDelivery": "2026-11-10",
  "orderItems": [
    {
      "productId": "prod_01",
      "name": "Ergonomic Office Chair",
      "price": 149.99,
      "quantity": 2,
      "total": 299.98
    },
    {
      "productId": "prod_07",
      "name": "Wireless Mouse",
      "price": 49.99,
      "quantity": 1,
      "total": 49.99
    }
  ]
}
```

---

### 2.8. Order Summary Service  

| Method | Endpoint | Request Body | Success Response | Errors |
|--------|----------|--------------|------------------|--------|
| **GET** | `/orders/{orderId}` | – | `200 OK` → `OrderDetail` | `404 Not Found`, `401 Unauthorized` |
| **GET** | `/orders` | – (optional pagination) | `200 OK` → `{ "orders": OrderSummary[], "page":…, "totalPages":… }` | `401 Unauthorized` |

**OrderDetail**

```json
{
  "orderId": "ord_20231104_001",
  "status": "CONFIRMED",
  "createdAt": "2026-11-04T14:32:10Z",
  "totalAmount": 449.97,
  "currency": "USD",
  "shippingAddress": { /* same schema as checkout */ },
  "billingAddress": { /* same schema */ },
  "payment": {
    "method": "card",
    "status": "APPROVED",
    "transactionId": "txn_5f8b9c2a"
  },
  "items": [
    {
      "productId": "prod_01",
      "name": "Ergonomic Office Chair",
      "price": 149.99,
      "quantity": 2,
      "total": 299.98
    },
    {
      "productId": "prod_07",
      "name": "Wireless Mouse",
      "price": 49.99,
      "quantity": 1,
      "total": 49.99
    }
  ],
  "shippingMethod": "Standard (5‑7 business days)",
  "trackingNumber": null
}
```

---

## 3. Data Model Reference  

| Entity | Fields | Description |
|--------|--------|-------------|
| **Product** | `id`, `name`, `slug`, `shortDescription`, `description`, `price`, `currency`, `thumbnailUrl`, `images[]`, `specifications`, `stock`, `rating`, `reviewCount`, `categoryIds[]` | Core catalogue record |
| **Category** | `id`, `name`, `slug`, `children[]` | Hierarchical taxonomy |
| **CartItem** | `productId`, `name`, `price`, `currency`, `quantity`, `thumbnailUrl` | One line in the cart |
| **Order** | `orderId`, `status`, `createdAt`, `totalAmount`, `currency`, `payment`, `shippingAddress`, `billingAddress`, `items[]`, `estimatedDelivery` | Persisted order |
| **Customer** | `firstName`, `lastName`, `email`, `phone` | Checkout contact |
| **Address** | `line1`, `line2`, `city`, `state`, `postalCode`, `country` | Shipping / billing |
| **PaymentMethod** | `type` (card, paypal, etc.), `card` object (if type=card) | Simulated payment payload |

All numeric values are **float** (two‑decimal precision) unless otherwise noted. Dates are **ISO‑8601 UTC** strings.

---

## 4. Realistic Sample Data  

### 4.1. Sample Products (JSON Array)

```json
[
  {
    "id": "prod_01",
    "name": "Ergonomic Office Chair",
    "slug": "ergonomic-office-chair",
    "shortDescription": "Mesh back, lumbar support, 5‑year warranty.",
    "price": 149.99,
    "currency": "USD",
    "thumbnailUrl": "https://cdn.example.com/products/prod_01/thumb.jpg",
    "rating": 4.5,
    "reviewCount": 87,
    "categoryIds": ["cat_furniture", "cat_office"]
  },
  {
    "id": "prod_02",
    "name": "Standing Desk Converter",
    "slug": "standing-desk-converter",
    "shortDescription": "Adjustable height, sturdy aluminum frame.",
    "price": 229.00,
    "currency": "USD",
    "thumbnailUrl": "https://cdn.example.com/products/prod_02/thumb.jpg",
    "rating": 4.7,
    "reviewCount": 54,
    "categoryIds": ["cat_furniture", "cat_office"]
  },
  {
    "id": "prod_07",
    "name": "Wireless Mouse",
    "slug": "wireless-mouse",
    "shortDescription": "2.4 GHz, ergonomic, 12‑month battery life.",
    "price": 49.99,
    "currency": "USD",
    "thumbnailUrl": "https://cdn.example.com/products/prod_07/thumb.jpg",
    "rating": 4.2,
    "reviewCount": 321,
    "categoryIds": ["cat_electronics", "cat_computers"]
  },
  {
    "id": "prod_15",
    "name": "Noise‑Cancelling Headphones",
    "slug": "noise-cancelling-headphones",
    "shortDescription": "Active ANC, 30 h battery, Bluetooth 5.2.",
    "price": 199.95,
    "currency": "USD",
    "thumbnailUrl": "https://cdn.example.com/products/prod_15/thumb.jpg",
    "rating": 4.8,
    "reviewCount": 112,
    "categoryIds": ["cat_electronics", "cat_audio"]
  }
]
```

### 4.2. Sample Category Tree

```json
{
  "categories": [
    {
      "id": "cat_furniture",
      "name": "Furniture",
      "slug": "furniture",
      "children": [
        { "id": "cat_office", "name": "Office", "slug": "office", "children": [] },
        { "id": "cat_living", "name": "Living Room", "slug": "living-room", "children": [] }
      ]
    },
    {
      "id": "cat_electronics",
      "name": "Electronics",
      "slug": "electronics",