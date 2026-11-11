# 📱 Mobile Selling Website ("Cashify/Swappa-style") - Data Architecture & API Design
**Designed by:** Nami (Data Architect)  
**Project:** Mobile Marketplace / Reselling Platform  
**Standards:** Open Agent Skills (Database Schema Modeling v1.0.0 & API and Interface Design v1.0.0)

---

## Table of Contents
1. [Introduction & Architectural Scope](#1-introduction--architectural-scope)
2. [Entity-Relationship & Database Schema](#2-entity-relationship--database-schema)
3. [Data Validation Rules & Integrity Constraints](#3-data-validation-rules--integrity-constraints)
4. [State Management Structure (Client & Store)](#4-state-management-structure-client--store)
5. [API Contracts & REST Endpoints](#5-api-contracts--rest-endpoints)
6. [Realistic Seed Data & Mock Fallbacks](#6-realistic-seed-data--mock-fallbacks)

---

## 1. Introduction & Architectural Scope

This specification defines the complete data model, validation rules, state architecture, and API contracts for a high-performance **Mobile Selling & Reselling Website**. The platform facilitates:
- **Instant Buyback / Trade-in Quotes:** Instant pricing algorithm based on brand, model, storage, physical condition, and functional health.
- **Peer-to-Peer (P2P) Marketplace:** Users listing their verified used phones for direct purchase.
- **Order & Transaction Processing:** Secure checkout, escrow tracking, shipping labels, and payout tracking.
- **Admin & Moderator Moderation:** Inspection verification, IMEI validation, and listing approval workflow.

---

## 2. Entity-Relationship & Database Schema

Below is the relational schema designed for relational databases (PostgreSQL/MySQL) or document stores with relational mapping (MongoDB).

### Entity Relationship Diagram (Conceptual)
```
[User] 1 --------< N [DeviceListing]
[User] 1 --------< N [BuybackOrder]
[User] 1 --------< N [Order] (Purchases)
[PhoneModel] 1 --< N [DeviceListing]
[PhoneModel] 1 --< 1 [BuybackBasePrice]
[DeviceListing] 1 --< N [Order]
[DeviceListing] 1 --< N [Review]
```

---

### A. `Users` Table
Stores customer, seller, and admin profile data.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` / UUID | **PRIMARY KEY** | Unique user identifier |
| `email` | `VARCHAR(255)` | **UNIQUE**, NOT NULL, Indexed | User email address for authentication |
| `password_hash` | `VARCHAR(255)` | NOT NULL | Bcrypt hashed password |
| `full_name` | `VARCHAR(100)` | NOT NULL | Full legal name |
| `phone_number` | `VARCHAR(20)` | NOT NULL | Verified phone number |
| `role` | `ENUM` | DEFAULT `'customer'` | `'customer'`, `'seller'`, `'admin'`, `'inspector'` |
| `kyc_status` | `ENUM` | DEFAULT `'unverified'` | `'unverified'`, `'pending'`, `'verified'`, `'rejected'` |
| `created_at` | `TIMESTAMP` | DEFAULT `CURRENT_TIMESTAMP` | Account creation timestamp |
| `updated_at` | `TIMESTAMP` | DEFAULT `CURRENT_TIMESTAMP` | Last profile update timestamp |

---

### B. `PhoneModels` Table (Catalog Master)
Master catalog of mobile phone models eligible for buyback or resale.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` / UUID | **PRIMARY KEY** | Unique model identifier |
| `brand` | `VARCHAR(50)` | NOT NULL, Indexed | e.g., Apple, Samsung, Google, OnePlus |
| `model_name` | `VARCHAR(100)` | NOT NULL, Indexed | e.g., iPhone 15 Pro Max, Galaxy S24 Ultra |
| `release_year` | `INT` | NOT NULL | Year of device release |
| `base_market_price` | `DECIMAL(10,2)` | NOT NULL | Original MSRP or current benchmark price |
| `storage_options` | `JSON` | NOT NULL | Array of supported storages e.g., `["128GB", "256GB", "512GB"]` |
| `ram_options` | `JSON` | NOT NULL | Array of supported RAM e.g., `["8GB", "12GB"]` |
| `image_url` | `VARCHAR(500)` | NOT NULL | Official product stock image |
| `is_active` | `BOOLEAN` | DEFAULT `true` | Whether model is active in catalog |
| `created_at` | `TIMESTAMP` | DEFAULT `CURRENT_TIMESTAMP` | - |

---

### C. `DeviceListings` Table (Marketplace P2P)
Listings created by sellers to sell their used phones.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` / UUID | **PRIMARY KEY** | Unique listing identifier |
| `seller_id` | `VARCHAR(36)` | **FOREIGN KEY** (`Users.id`), NOT NULL | User selling the device |
| `phone_model_id`| `VARCHAR(36)` | **FOREIGN KEY** (`PhoneModels.id`), NOT NULL | Master catalog reference |
| `title` | `VARCHAR(150)` | NOT NULL | e.g., "Mint Condition iPhone 14 Pro 256GB Deep Purple" |
| `description` | `TEXT` | NOT NULL | Detailed description of device condition |
| `storage` | `VARCHAR(20)` | NOT NULL | e.g., "256GB" |
| `color` | `VARCHAR(50)` | NOT NULL | e.g., "Deep Purple", "Phantom Black" |
| `condition_grade`| `ENUM` | NOT NULL | `'mint'`, `'good'`, `'fair'`, `'poor'` |
| `battery_health` | `INT` | NOT NULL (Range: 1-100) | Battery health percentage e.g., 92 |
| `imei_number` | `VARCHAR(30)` | **UNIQUE**, NOT NULL | Sanitized 15-digit IMEI for verification |
| `price` | `DECIMAL(10,2)` | NOT NULL, Indexed | Asking price in USD/INR |
| `status` | `ENUM` | DEFAULT `'pending_review'` | `'draft'`, `'pending_review'`, `'active'`, `'sold'`, `'rejected'` |
| `images` | `JSON` | NOT NULL | Array of image URLs uploaded by seller |
| `created_at` | `TIMESTAMP` | DEFAULT `CURRENT_TIMESTAMP` | - |
| `updated_at` | `TIMESTAMP` | DEFAULT `CURRENT_TIMESTAMP` | - |

---

### D. `BuybackOrders` Table (Instant Sell / Trade-In)
Orders created when a user sells their phone instantly to the platform.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` / UUID | **PRIMARY KEY** | Unique buyback order ID e.g., `BB-2025-9831` |
| `user_id` | `VARCHAR(36)` | **FOREIGN KEY** (`Users.id`), NOT NULL | User selling the device |
| `phone_model_id`| `VARCHAR(36)` | **FOREIGN KEY** (`PhoneModels.id`), NOT NULL | Model being sold |
| `storage` | `VARCHAR(20)` | NOT NULL | Selected storage |
| `condition_answers`| `JSON` | NOT NULL | Answers to diagnostic questionnaire (screen cracks, body scratches, boot status) |
| `quoted_price` | `DECIMAL(10,2)` | NOT NULL | Evaluated payout price |
| `pickup_address` | `JSON` | NOT NULL | Full courier pickup address |
| `status` | `ENUM` | DEFAULT `'quote_generated'` | `'quote_generated'`, `'pickup_scheduled'`, `'device_received'`, `'inspection_passed'`, `'inspection_failed'`, `'paid'`, `'cancelled'` |
| `created_at` | `TIMESTAMP` | DEFAULT `CURRENT_TIMESTAMP` | - |
| `updated_at` | `TIMESTAMP` | DEFAULT `CURRENT_TIMESTAMP` | - |

---

### E. `Orders` Table (Marketplace Purchases)
Records transactions when a buyer purchases a listing from the marketplace.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` / UUID | **PRIMARY KEY** | Unique order identifier |
| `buyer_id` | `VARCHAR(36)` | **FOREIGN KEY** (`Users.id`), NOT NULL | Purchasing user |
| `listing_id` | `VARCHAR(36)` | **FOREIGN KEY** (`DeviceListings.id`), NOT NULL | Purchased phone listing |
| `total_amount` | `DECIMAL(10,2)` | NOT NULL | Final price including shipping/taxes |
| `shipping_address`| `JSON` | NOT NULL | Delivery address |
| `payment_method` | `VARCHAR(50)` | NOT NULL | `'card'`, `'upi'`, `'net_banking'`, `'cod'` |
| `payment_status` | `ENUM` | DEFAULT `'pending'` | `'pending'`, `'paid'`, `'failed'`, `'refunded'` |
| `order_status` | `ENUM` | DEFAULT `'placed'` | `'placed'`, `'dispatched'`, `'out_for_delivery'`, `'delivered'`, `'returned'` |
| `created_at` | `TIMESTAMP` | DEFAULT `CURRENT_TIMESTAMP` | - |

---

## 3. Data Validation Rules & Integrity Constraints

### General Rules
1. **IMEI Verification:** `imei_number` must match Luhn algorithm validation and be exactly 15 numeric digits (`/^\d{15}$/`).
2. **Pricing Bounds:** `price` and `quoted_price` must be greater than zero (`> 0.00`).
3. **Battery Health:** Must be integer between `1` and `100`.
4. **Email Format:** Must adhere to RFC 5322 standard regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
5. **Enums Integrity:** All ENUM fields are strictly validated against allowed sets on both frontend form validation and backend ORM models.

---

## 4. State Management Structure (Client & Store)

For state management (Redux Toolkit, Zustand, or React Context), we partition the state into distinct slices:

### Global Store Shape (`AppStore`)
```typescript
interface AppStore {
  auth: {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  };
  catalog: {
    models: PhoneModel[];
    selectedModel: PhoneModel | null;
    filters: {
      brand: string | null;
      minPrice: number;
      maxPrice: number;
      searchQuery: string;
    };
  };
  buyback: {
    currentStep: number; // 1: Model, 2: Storage, 3: Questions, 4: Quote, 5: Checkout
    selectedModel: PhoneModel | null;
    selectedStorage: string | null;
    diagnosticAnswers: Record<string, boolean | string>;
    estimatedQuote: number | null;
    activeBuybackOrder: BuybackOrder | null;
  };
  marketplace: {
    listings: DeviceListing[];
    activeListing: DeviceListing | null;
    cart: DeviceListing[];
    pagination: { page: number; limit: number; total: number };
  };
}
```

### Client-Side Persistence (`localStorage` Keys)
- `mob_auth_token`: JWT session token.
- `mob_cart`: Array of saved listing IDs for quick checkout.
- `mob_buyback_draft`: Current progress of ongoing buyback evaluation.

---

## 5. API Contracts & REST Endpoints

Base URL: `https://api.mobilesell.com/v1`

### 1. Authentication Endpoints
- **POST `/auth/register`**
  - *Request Body:* `{ email, password, full_name, phone_number }`
  - *Response (201 Created):* `{ token, user: { id, email, full_name, role } }`
- **POST `/auth/login`**
  - *Request Body:* `{ email, password }`
  - *Response (200 OK):* `{ token, user }`

### 2. Catalog & Phone Models
- **GET `/models`**
  - *Query Parameters:* `brand` (optional), `search` (optional)
  - *Response (200 OK):* `PhoneModel[]`
- **GET `/models/{id}`**
  - *Response (200 OK):* `PhoneModel`

### 3. Instant Buyback & Valuation
- **POST `/buyback/evaluate`**
  - *Request Body:*
    ```json
    {
      "phone_model_id": "mdl_iphone14pro_256",
      "storage": "256GB",
      "battery_health": 91,
      "screen_condition": "flawless",
      "body_condition": "minor_scratches",
      "powers_on": true,
      "accessories": ["original_box"]
    }
    ```
  - *Response (200 OK):*
    ```json
    {
      "quoted_price": 650.00,
      "currency": "USD",
      "valid_until": "2025-03-01T23:59:59Z"
    }
    ```
- **POST `/buyback/orders`**
  - *Request Body:* Valuation summary + `pickup_address` + `bank_details`.
  - *Response (201 Created):* `BuybackOrder` object with tracking ID.

### 4. Marketplace Listings (P2P)
- **GET `/listings`**
  - *Query Parameters:* `page`, `limit`, `brand`, `condition_grade`, `min_price`, `max_price`
  - *Response (200 OK):* `{ data: DeviceListing[], total: number, page: number }`
- **POST `/listings`** (Seller Role Required)
  - *Request Body:*
    ```json
    {
      "phone_model_id": "mdl_iphone14pro_256",
      "title": "Mint Condition iPhone 14 Pro 256GB",
      "description": "Used with care, tempered glass applied since day 1.",
      "storage": "256GB",
      "color": "Deep Purple",
      "condition_grade": "mint",
      "battery_health": 94,
      "imei_number": "353892110482910",
      "price": 699.00,
      "images": ["https://cdn.mobilesell.com/img1.jpg"]
    }
    ```
  - *Response (201 Created):* `DeviceListing` object.

### 5. Checkout & Orders
- **POST `/orders`**
  - *Request Body:* `{ listing_id, shipping_address, payment_method }`
  - *Response (201 Created):* `Order` object with payment intent.

---

## 6. Realistic Seed Data & Mock Fallbacks

### Sample Phone Model (`PhoneModels`)
```json
{
  "id": "mdl_iphone15pro_256",
  "brand": "Apple",
  "model_name": "iPhone 15 Pro",
  "release_year": 2023,
  "base_market_price": 999.00,
  "storage_options": ["128GB", "256GB", "512GB", "1TB"],
  "ram_options": ["8GB"],
  "image_url": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600",
  "is_active": true
}
```

### Sample Device Listing (`DeviceListings`)
```json
{
  "id": "lst_8f7b2c1a-9921",
  "seller_id": "usr_robert_seller_01",
  "phone_model_id": "mdl_iphone15pro_256",
  "title": "Apple iPhone 15 Pro - 256GB - Natural Titanium (Unlocked)",
  "description": "Phone is in pristine condition. Battery health is at 96%. Includes original USB-C cable and box. No scratches on screen or camera lenses.",
  "storage": "256GB",
  "color": "Natural Titanium",
  "condition_grade": "mint",
  "battery_health": 96,
  "imei_number": "354928112345678",
  "price": 820.00,
  "status": "active",
  "images": [
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800",
    "https://images.unsplash.com/photo-1695048065061-39c4bfad1357?w=800"
  ],
  "created_at": "2025-02-15T10:30:00Z"
}
```

### Offline Mock Fallback Strategy
When the backend API is unreachable or during client-side local testing, the application falls back to a built-in mock repository (`localStorage` seeded with the above entities), simulating a 300ms network latency to ensure zero UI disruption.