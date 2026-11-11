# Artisan Coffee E‑Commerce Store – External Service Integration Blueprint  
**Prepared by:** Brook – Integrations & Content Specialist  

---

## Table of Contents
1. [High‑Level Architecture Overview](#high-level-architecture-overview)  
2. [Service Catalogue & Integration Points](#service-catalogue--integration-points)  
3. [API Contracts (OpenAPI‑style Summary)](#api-contracts-openapi-style-summary)  
   - 3.1. Authentication & Authorization  
   - 3.2. Product Catalog Service  
   - 3.3. Cart Service (Drawer)  
   - 3.4. Checkout Service (Modal)  
   - 3.5. Review Service  
   - 3.6. Category & Filtering Service  
4. [Data Formats & JSON Schemas](#data-formats--json-schemas)  
5. [Realistic Sample Data (Mock Payloads)](#realistic-sample-data-mock-payloads)  
6. [Error Handling & Status Codes](#error-handling--status-codes)  
7. [Non‑Functional Requirements (NFRs)](#non-functional-requirements-nfrs)  
8. [Versioning & Change Management](#versioning--change-management)  

---

## 1. High‑Level Architecture Overview
```
+----------------+      +----------------+      +----------------+      +----------------+
|   Front‑End    | <--->|   API Gateway  | <--->|   Micro‑Services| <--->|   Third‑Party   |
| (React/Next.js)|      | (Auth, Rate‑  |      |                |      |   (Payment,    |
|                |      | Limiting, TLS) |      |  - Catalog      |      |   Shipping)    |
+----------------+      +----------------+      |  - Cart         |      +----------------+
                                           |  - Checkout      |
                                           |  - Reviews       |
                                           |  - Categories    |
                                           +------------------+
```

*All communication is over **HTTPS** with **OAuth 2.0** (Client Credentials + JWT).*

---

## 2. Service Catalogue & Integration Points  

| Service | Responsibility | Primary Endpoints | External Dependencies |
|---------|----------------|-------------------|-----------------------|
| **Auth Service** | Issue/validate JWTs, manage client scopes | `POST /auth/token` | Identity Provider (IdP) |
| **Product Catalog** | Store & serve coffee beans, blends, equipment | `GET /products`, `GET /products/{id}` | CDN for images |
| **Cart Service** | Maintain per‑session cart, calculate line totals | `GET /carts/{cartId}`, `POST /carts`, `PATCH /carts/{cartId}` | Catalog (price lookup) |
| **Checkout Service** | Order creation, payment intent, inventory lock | `POST /checkout`, `GET /checkout/{orderId}` | Payment Gateway, Shipping Provider |
| **Review Service** | CRUD for product/customer reviews | `GET /reviews`, `POST /reviews` | None (internal) |
| **Category Service** | Hierarchical categories & filter metadata | `GET /categories`, `GET /categories/{id}/filters` | Catalog (product ↔ category mapping) |

---

## 3. API Contracts (OpenAPI‑style Summary)

> **Note:** All request/response bodies are JSON.  
> **Base URL:** `https://api.artisancoffee.com/v1`  
> **Common Headers**  

| Header | Description |
|--------|-------------|
| `Authorization: Bearer <jwt>` | Required for all endpoints except public product reads |
| `Content-Type: application/json` | Sent on every request with a body |
| `Accept: application/json` | Expected response format |

### 3.1 Authentication & Authorization
```yaml
POST /auth/token
Request:
  {
    "grant_type": "client_credentials",
    "client_id": "frontend-web",
    "client_secret": "••••••"
  }
Response (200):
  {
    "access_token": "<jwt>",
    "token_type": "Bearer",
    "expires_in": 3600,
    "scope": "catalog cart checkout reviews"
  }
```

### 3.2 Product Catalog Service
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/products` | List products with pagination, optional filters (`category`, `price_min`, `price_max`, `roast`) |
| `GET` | `/products/{id}` | Retrieve detailed product info |
| `GET` | `/products/{id}/availability` | Current stock & back‑order flag |

**Sample contract for `/products`**  

```yaml
GET /products
Query Parameters:
  page: integer (default 1)
  limit: integer (max 50, default 20)
  category: string (slug)
  roast: enum[light, medium, dark]
  price_min: number
  price_max: number
Response (200):
  {
    "page": 1,
    "limit": 20,
    "total": 124,
    "items": [ Product[] ]
  }
```

### 3.3 Cart Service (Drawer)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/carts` | Create a new cart (returns `cartId`) |
| `GET` | `/carts/{cartId}` | Get current cart state |
| `PATCH` | `/carts/{cartId}` | Add / update / remove line items |
| `DELETE` | `/carts/{cartId}` | Empty cart / delete |

**Patch payload example**  

```json
{
  "operations": [
    { "op": "add", "path": "/items/-", "value": { "productId": "pr_001", "quantity": 2 } },
    { "op": "replace", "path": "/items/0/quantity", "value": 3 },
    { "op": "remove", "path": "/items/1" }
  ]
}
```

### 3.4 Checkout Service (Modal)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/checkout` | Create an order, lock inventory, generate payment intent |
| `GET` | `/checkout/{orderId}` | Retrieve order status (pending, paid, failed, shipped) |
| `POST` | `/checkout/{orderId}/confirm` | Confirm payment (webhook‑driven) |

**Create order payload**  

```json
{
  "cartId": "ca_abc123",
  "customer": {
    "email": "jane.doe@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "phone": "+1-555-0199"
  },
  "shippingAddress": {
    "line1": "123 Bean St",
    "line2": "",
    "city": "Portland",
    "state": "OR",
    "postalCode": "97201",
    "country": "US"
  },
  "billingAddress": { "...same as shipping..." },
  "paymentMethod": "card",
  "metadata": { "promoCode": "WELCOME10" }
}
```

### 3.5 Review Service
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/reviews?productId={id}&page=1&limit=10` | Paginated list of reviews for a product |
| `POST` | `/reviews` | Submit a new review (authenticated) |
| `PATCH` | `/reviews/{reviewId}` | Edit own review |
| `DELETE` | `/reviews/{reviewId}` | Delete own review |

**Create review payload**  

```json
{
  "productId": "pr_001",
  "rating": 5,
  "title": "Morning bliss!",
  "body": "The Ethiopian beans have a bright citrus note that wakes me up perfectly.",
  "verifiedPurchase": true
}
```

### 3.6 Category & Filtering Service
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/categories` | Tree of all categories (e.g., “Beans → Single Origin → Ethiopia”) |
| `GET` | `/categories/{slug}/filters` | Returns filter metadata for the category (available roasts, price ranges, etc.) |

**Category list response**  

```json
[
  {
    "id": "cat_beans",
    "name": "Coffee Beans",
    "slug": "beans",
    "children": [
      {
        "id": "cat_single_origin",
        "name": "Single Origin",
        "slug": "single-origin",
        "children": [
          { "id": "cat_ethiopia", "name": "Ethiopia", "slug": "ethiopia", "children": [] }
        ]
      },
      { "id": "cat_blends", "name": "Blends", "slug": "blends", "children": [] }
    ]
  },
  { "id": "cat_equipment", "name": "Equipment", "slug": "equipment", "children": [] }
]
```

---

## 4. Data Formats & JSON Schemas  

Below are reusable JSON‑Schema definitions (draft‑07) that can be imported into OpenAPI components.

### 4.1 Product
```json
{
  "$id": "https://api.artisancoffee.com/schemas/product.json",
  "type": "object",
  "required": ["id", "name", "slug", "price", "currency", "roast", "origin", "description", "images"],
  "properties": {
    "id": { "type": "string", "example": "pr_001" },
    "name": { "type": "string", "example": "Ethiopian Yirgacheffe – Light Roast" },
    "slug": { "type": "string", "example": "ethiopian-yirgacheffe-light" },
    "price": { "type": "number", "format": "float", "example": 19.99 },
    "currency": { "type": "string", "enum": ["USD"], "example": "USD" },
    "roast": { "type": "string", "enum": ["light", "medium", "dark"], "example": "light" },
    "origin": { "type": "string", "example": "Ethiopia – Yirgacheffe" },
    "description": { "type": "string", "example": "Floral, citrusy, and tea‑like..." },
    "weight": { "type": "string", "example": "250g" },
    "sku": { "type": "string", "example": "COF-ETH-YIR-250" },
    "images": {
      "type": "array",
      "items": { "type": "string", "format": "uri", "example": "https://cdn.artisancoffee.com/img/pr_001_main.jpg" }
    },
    "categoryIds": {
      "type": "array",
      "items": { "type": "string", "example": "cat_ethiopia" }
    },
    "availability": {
      "type": "object",
      "properties": {
        "inStock": { "type": "boolean", "example": true },
        "quantity": { "type": "integer", "minimum": 0, "example": 42 },
        "estimatedRestock": { "type": ["string","null"], "format": "date-time", "example": null }
      }
    }
  }
}
```

### 4.2 Cart
```json
{
  "$id": "https://api.artisancoffee.com/schemas/cart.json",
  "type": "object",
  "required": ["id", "items", "subtotal", "currency"],
  "properties": {
    "id": { "type": "string", "example": "ca_abc123" },
    "items": {
      "type": "array",
      "items": { "$ref": "cart-item.json#" }
    },
    "subtotal": { "type": "number", "format": "float", "example": 39.98 },
    "discount": { "type": "number", "format": "float", "example": 4.00 },
    "total": { "type": "number", "format": "float", "example": 35.98 },
    "currency": { "type": "string", "example": "USD" }
  }
}
```

### 4.3 Cart Item
```json
{
  "$id": "https://api.artisancoffee.com/schemas/cart-item.json",
  "type": "object",
  "required": ["productId", "quantity", "unitPrice", "totalPrice"],
  "properties": {
    "productId": { "type": "string", "example": "pr_001" },
    "name": { "type": "string", "example": "Ethiopian Yirgacheffe – Light Roast" },
    "quantity": { "type": "integer", "minimum": 1, "example": 2 },
    "unitPrice": { "type": "number", "format": "float", "example": 19.99 },
    "totalPrice": { "type": "number", "format": "float", "example": 39.98 },
    "image": { "type": "string", "format": "uri", "example": "https://cdn.artisancoffee.com/img/pr_001_thumb.jpg" }
  }
}
```

### 4.4 Order (Checkout)
```json
{
  "$id": "https://api.artisancoffee.com/schemas/order.json",
  "type": "object",
  "required": ["id", "status", "total", "currency", "customer", "shippingAddress", "items"],
  "properties": {
    "id": { "type": "string", "example": "or_7f9b2c" },
    "status": { "type": "string", "enum": ["pending","paid","failed","shipped","cancelled"], "example": "pending" },
    "total": { "type": "number", "format": "float", "example": 35.98 },
    "currency": { "type": "string", "example": "USD" },
    "customer": { "$ref": "customer.json#" },
    "shippingAddress": { "$ref": "address.json#" },
    "billingAddress": { "$ref": "address.json#" },
    "items": {
      "type": "array",
      "items": { "$ref": "order-item.json#" }
    },
    "paymentIntentId": { "type": "string", "example": "pi_1GqIC8..." },
    "createdAt": { "type": "string", "format": "date-time", "example": "2026-10-15T14:23:00Z" },
    "metadata": { "type": "object", "additionalProperties": true }
  }
}
```

### 4.5 Review
```json
{
  "$id": "https://api.artisancoffee.com/schemas/review.json",
  "type": "object",
  "required": ["id", "productId", "rating", "title", "body", "author", "createdAt"],
  "properties": {
    "id": { "type": "string", "example": "rv_9a7c3d" },
    "productId": { "type": "string", "example": "pr_001" },
    "rating": { "type": "integer", "minimum": 1, "maximum": 5, "example": 5 },
    "title": { "type": "string", "example": "Morning bliss!" },
    "body": { "type": "string", "example": "The Ethiopian beans have a bright citrus note..." },
    "author": { "type": "string", "example": "jane.doe@example.com" },
    "verifiedPurchase": { "type": "boolean", "example": true },
    "createdAt": { "type": "string", "format": "date-time", "example": "2026-09-30T08:12:44Z" },
    "updatedAt": { "type": ["string","null"], "format": "date-time", "example": null }
  }
}
```

---

## 5. Realistic Sample Data (Mock Payloads)

### 5.1 Product Catalog – Sample List (`GET /products?page=1&limit=3`)
```json
{
  "page": 1,
  "limit": 3,
  "total": 57,
  "items": [
    {
      "id": "pr_001",
      "name": "Ethiopian Yirgacheffe – Light Roast",
      "slug": "ethiopian-yirgacheffe-light",
      "price": 19.99,
      "currency": "USD",
      "roast": "light",
      "origin": "Ethiopia – Yirgacheffe",
      "description": "Floral, citrusy, and tea‑like. Ideal for pour‑over.",
      "weight": "250g",
      "sku": "COF-ETH-YIR-250",
      "images": [
        "https://cdn.artisancoffee.com/img/pr_001_main.jpg",
        "https://cdn.artisancoffee.com/img/pr_001_detail1.jpg"
      ],
      "categoryIds": ["cat_ethiopia"],
      "availability": {
        "inStock": true,
        "quantity": 42,
        "estimatedRestock": null
      }
    },
    {
      "id": "pr_002",
      "name": "Colombian Supremo – Medium Roast",
      "slug": "colombian-supremo-medium",
      "price": 17.49,
      "currency": "USD",
      "roast": "medium",
      "origin": "Colombia – Antioquia",
      "description": "Balanced body with chocolate‑nut notes.",
      "weight": "250g",
      "sku": "COF-COL-SUP-250",
      "images": [
        "https://cdn.artisancoffee.com/img/pr