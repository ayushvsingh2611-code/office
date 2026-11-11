# Smart‑Recipe‑Vault – Integration & Content Specification  
*Integrations & Content Specialist – Brook*  

---  

## 1. High‑Level Overview  

| Feature | Description | Primary External Services |
|---------|-------------|---------------------------|
| **Recipe Discovery** | Search & browse recipes; filter by diet, cuisine, cook‑time, difficulty, allergens. | • **Recipe‑Catalog API** (cloud‑hosted)  <br>• **Search‑Index Service** (ElasticSearch / OpenSearch) |
| **Interactive Grocery List Generator** | Convert a recipe’s ingredient list into a user‑editable grocery list; merge multiple recipes, auto‑group by store sections. | • **Ingredient‑Info Service** (Nutrient & unit conversion) <br>• **LocalStorage / IndexedDB** (offline persistence) |
| **Chef Consultation Booking Modal** | Users can schedule a 1‑on‑1 video/phone session with a chef; supports time‑zone handling, payment, and reminders. | • **Chef‑Directory Service** (list of chefs, availability) <br>• **Booking‑Engine API** (Calendly‑style) <br>• **Payment Gateway** (Stripe/PayPal) |
| **User Profile & Preferences** | Store diet preferences, saved recipes, past grocery lists, booking history. | • **User‑Management Service** (Auth0 / Cognito) <br>• **Profile‑Store API** (CRUD) |

> **Goal:** Provide a complete, versioned REST contract, realistic mock fall‑backs for offline dev, and a relational data model with seed data that mirrors production usage.

---  

## 2. RESTful API Contracts  

All endpoints are versioned under `/api/v1`. JSON is the sole payload format.  
Standard HTTP status codes are used (see **Section 2.6**).

### 2.1. Recipe Catalog  

| Method | Path | Query Params | Request Body | Success Response | Errors |
|--------|------|--------------|--------------|------------------|--------|
| **GET** | `/api/v1/recipes` | `search`, `diet[]`, `maxCookTime`, `cuisine[]`, `page`, `pageSize` | – | `200` – `RecipeSearchResult` | `400`, `500` |
| **GET** | `/api/v1/recipes/{recipeId}` | – | – | `200` – `RecipeDetail` | `404`, `500` |
| **POST** | `/api/v1/recipes` | – | `NewRecipeRequest` | `201` – `RecipeDetail` | `400`, `401`, `500` |
| **PUT** | `/api/v1/recipes/{recipeId}` | – | `UpdateRecipeRequest` | `200` – `RecipeDetail` | `400`, `404`, `401`, `500` |
| **DELETE** | `/api/v1/recipes/{recipeId}` | – | – | `204` – No Content | `404`, `401`, `500` |

#### 2.1.1. Schemas  

```json
// RecipeSearchResult
{
  "total": 1243,
  "page": 1,
  "pageSize": 20,
  "recipes": [
    {
      "id": "c9f8a2e3-4b1d-4f5a-9d2e-7b9c1a2d3e4f",
      "title": "Mediterranean Quinoa Salad",
      "cuisine": "Mediterranean",
      "diet": ["vegetarian", "glutenFree"],
      "cookTimeMinutes": 25,
      "difficulty": "easy",
      "thumbnailUrl": "https://cdn.example.com/recipes/q1.jpg",
      "rating": 4.6,
      "savedCount": 342
    }
    // … up to pageSize items
  ]
}
```

```json
// RecipeDetail
{
  "id": "c9f8a2e3-4b1d-4f5a-9d2e-7b9c1a2d3e4f",
  "title": "Mediterranean Quinoa Salad",
  "description": "A light, protein‑rich salad with fresh veggies and lemon‑herb dressing.",
  "cuisine": "Mediterranean",
  "diet": ["vegetarian", "glutenFree"],
  "cookTimeMinutes": 25,
  "prepTimeMinutes": 15,
  "totalTimeMinutes": 40,
  "difficulty": "easy",
  "servings": 4,
  "ingredients": [
    {
      "id": "ing-001",
      "name": "Quinoa",
      "quantity": 1,
      "unit": "cup",
      "notes": "rinsed"
    },
    {
      "id": "ing-002",
      "name": "Cherry Tomatoes",
      "quantity": 1,
      "unit": "cup",
      "notes": "halved"
    }
    // …
  ],
  "steps": [
    "Rinse quinoa under cold water.",
    "Cook quinoa in 2 cups water, bring to boil, simmer 15 min.",
    "Combine all vegetables in a bowl, add quinoa, toss with dressing."
  ],
  "nutrition": {
    "calories": 320,
    "protein_g": 12,
    "fat_g": 8,
    "carbs_g": 48,
    "fiber_g": 6,
    "sugar_g": 5
  },
  "images": [
    "https://cdn.example.com/recipes/q1-1.jpg",
    "https://cdn.example.com/recipes/q1-2.jpg"
  ],
  "authorId": "chef-07",
  "createdAt": "2024-03-12T10:42:00Z",
  "updatedAt": "2024-05-01T08:15:00Z"
}
```

```json
// NewRecipeRequest (client‑side only; `authorId` injected from auth token)
{
  "title": "string (3‑120 chars)",
  "description": "string (optional, max 2000 chars)",
  "cuisine": "enum (e.g., Italian, Mexican, Indian, ...)",
  "diet": ["enum", "…"],               // allowed values: vegetarian, vegan, keto, paleo, glutenFree, dairyFree, nutFree, halal, kosher
  "cookTimeMinutes": "integer (>=0)",
  "prepTimeMinutes": "integer (>=0)",
  "difficulty": "enum (easy, medium, hard)",
  "servings": "integer (>=1)",
  "ingredients": [
    {
      "name": "string",
      "quantity": "number (>=0)",
      "unit": "enum (g, kg, ml, l, cup, tbsp, tsp, piece, pinch)",
      "notes": "string (optional, max 200 chars)"
    }
  ],
  "steps": ["string (max 2000 chars)"],
  "images": ["url (optional)"]
}
```

> **Payload Typing & Sanitization** – All string fields are trimmed; `title` must match `/^[\w\s\-,']{3,120}$/`. Dates are ISO‑8601 UTC (`YYYY‑MM‑DDTHH:MM:SSZ`). UUIDs use RFC‑4122 format.

---

### 2.2. Grocery List Service  

| Method | Path | Request Body | Success Response | Errors |
|--------|------|--------------|------------------|--------|
| **POST** | `/api/v1/grocery-lists` | `CreateGroceryListRequest` | `201` – `GroceryListDetail` | `400`, `401`, `500` |
| **GET** | `/api/v1/grocery-lists/{listId}` | – | `200` – `GroceryListDetail` | `404`, `401`, `500` |
| **PUT** | `/api/v1/grocery-lists/{listId}` | `UpdateGroceryListRequest` | `200` – `GroceryListDetail` | `400`, `404`, `401`, `500` |
| **DELETE** | `/api/v1/grocery-lists/{listId}` | – | `204` – No Content | `404`, `401`, `500` |

#### 2.2.1. Schemas  

```json
// CreateGroceryListRequest
{
  "title": "Weekly Dinner Plan",
  "recipeIds": ["c9f8a2e3-4b1d-4f5a-9d2e-7b9c1a2d3e4f", "a2b3c4d5-6e7f-8g9h-0i1j-2k3l4m5n6o7p"],
  "customItems": [
    {
      "name": "Olive Oil",
      "quantity": 1,
      "unit": "bottle"
    }
  ]
}
```

```json
// GroceryListDetail
{
  "id": "gl-20231107-001",
  "userId": "user-123",
  "title": "Weekly Dinner Plan",
  "items": [
    {
      "id": "item-001",
      "name": "Quinoa",
      "quantity": 1,
      "unit": "cup",
      "checked": false,
      "sourceRecipeId": "c9f8a2e3-4b1d-4f5a-9d2e-7b9c1a2d3e4f"
    },
    {
      "id": "item-015",
      "name": "Olive Oil",
      "quantity": 1,
      "unit": "bottle",
      "checked": false,
      "sourceRecipeId": null
    }
  ],
  "createdAt": "2024-10-01T14:22:00Z",
  "updatedAt": "2024-10-02T09:10:00Z"
}
```

---

### 2.3. Chef Consultation Booking  

| Method | Path | Request Body | Success Response | Errors |
|--------|------|--------------|------------------|--------|
| **GET** | `/api/v1/chefs` | `?cuisine=Italian&availableAfter=2024-11-10T00:00:00Z` | `200` – `ChefSearchResult` | `400`, `500` |
| **GET** | `/api/v1/chefs/{chefId}` | – | `200` – `ChefDetail` | `404`, `500` |
| **POST** | `/api/v1/bookings` | `CreateBookingRequest` | `201` – `BookingDetail` | `400`, `401`, `402 (payment required)`, `500` |
| **GET** | `/api/v1/bookings/{bookingId}` | – | `200` – `BookingDetail` | `404`, `401`, `500` |
| **PATCH** | `/api/v1/bookings/{bookingId}` | `UpdateBookingRequest` (e.g., cancel) | `200` – `BookingDetail` | `400`, `404`, `401`, `500` |

#### 2.3.1. Schemas  

```json
// ChefSearchResult
{
  "total": 42,
  "chefs": [
    {
      "id": "chef-07",
      "fullName": "Luca Bianchi",
      "cuisineSpecialty": ["Italian", "Mediterranean"],
      "rating": 4.9,
      "hourlyRateUSD": 85,
      "availableSlots": [
        "2024-11-12T14:00:00Z",
        "2024-11-12T15:30:00Z",
        "2024-11-13T09:00:00Z"
      ],
      "profileImageUrl": "https://cdn.example.com/chefs/luca.jpg"
    }
    // …
  ]
}
```

```json
// CreateBookingRequest
{
  "chefId": "chef-07",
  "userId": "user-123",
  "slotUtc": "2024-11-12T14:00:00Z",
  "durationMinutes": 60,
  "paymentMethodId": "pm_1GqIC8LJYH9R",
  "notes": "Focus on gluten‑free pasta alternatives."
}
```

```json
// BookingDetail
{
  "id": "bk-20241107-0001",
  "chefId": "chef-07",
  "userId": "user-123",
  "slotUtc": "2024-11-12T14:00:00Z",
  "durationMinutes": 60,
  "status": "confirmed",               // enum: pending, confirmed, cancelled, completed, failed
  "paymentStatus": "paid",             // enum: pending, paid, refunded, failed
  "createdAt": "2024-10-31T08:45:00Z",
  "updatedAt": "2024-11-01T12:20:00Z",
  "meetingLink": "https://zoom.us/j/987654321?pwd=abc123"
}
```

---

### 2.4. Common HTTP Status Mapping  

| Code | Meaning | Typical Use |
|------|----------|--------------|
| **200 OK** | Successful GET/PUT/PATCH | Return JSON body |
| **201 Created** | Resource successfully created | Include `Location` header |
| **204 No Content** | Successful DELETE | No body |
| **400 Bad Request** | Validation or malformed query | Return error object |
| **401 Unauthorized** | Missing/invalid auth token | – |
| **402 Payment Required** | Payment step failed (booking) | – |
| **404 Not Found** | Resource does not exist | – |
| **409 Conflict** | Duplicate unique field (e.g., recipe title for same author) | – |
| **422 Unprocessable Entity** | Business‑rule violation (e.g., cookTime > totalTime) | – |
| **500 Internal Server Error** | Unexpected server error | – |

Error payload format (all error responses):

```json
{
  "error": {
    "code": "string (e.g., VALIDATION_ERROR)",
    "message": "Human readable description",
    "details": [
      {
        "field": "cookTimeMinutes",
        "issue": "must be >= 0"
      }
    ],
    "timestamp": "2024-10-02T10:03:12Z",
    "requestId": "uuid-v4"
  }
}
```

---  

## 3. Realistic Mock Fallbacks & Offline Resilience  

| Service | Mock Endpoint | Example Response | Simulated Latency | Timeout Strategy |
|---------|---------------|------------------|-------------------|------------------|
| **Recipe Catalog** | `GET /mock/recipes?search=salad` | Returns a static array of 5 curated recipes (see **Section 4.1**). | 120 ms | Client retries 2× with exponential back‑off (200 ms → 400 ms). |
| **Grocery List** | `POST /mock/grocery-lists` | Echoes the request, assigns `id: "gl-mock-001"` and timestamps. | 80 ms | If live API fails > 2 s, fallback to localStorage write and show *“working offline”* banner. |
| **Chef Booking** | `GET /mock/chefs` | Returns 3 sample chefs (see **Section 4.3**). | 150 ms | Queue booking request locally; sync when connectivity restores (background job). |
| **Auth** | N/A – use **Auth0 mock SDK** (client‑side). | – | – | Token refresh simulated via 30‑minute expiry. |

### 3.1. Mock Data Files (stored under `/mocks/`)  

- `recipes.json` – 20 diverse recipes spanning vegan, keto, Mediterranean, Asian, etc.  
- `chefs.json` – 5 chef profiles with varying rates and availability windows.  
- `groceryLists.json` – Example list objects for UI testing.  

> **Implementation tip:** In the front‑end, wrap `fetch()` with a helper that first attempts the real endpoint; on network error or non‑2xx status, it falls back to `import('/mocks/...')` and resolves after the configured latency.

---  

## 4. Database Schema & Realistic Seed Data  

### 4.1. Entity‑Relationship Overview  

```
User ──< Recipe (authorId) >─── Chef
  │                               │
  └──< GroceryList >──< GroceryItem
  │
  └──< Booking >───> Chef (chefId)
```

All tables use **UUID v4** primary keys (`CHAR(36)`). Timestamps are stored as UTC `TIMESTAMP(3)`.

### 4.2. Table Definitions (PostgreSQL syntax)

```sql
-- Users
CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(255) UNIQUE NOT NULL,
    full_name     VARCHAR(120) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    diet_prefs    TEXT[]        DEFAULT '{}',   -- e.g. {'vegan','glutenFree'}
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- Recipes
CREATE TABLE recipes (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id        UUID REFERENCES users(id) ON DELETE SET NULL,
    title            VARCHAR(120) NOT NULL,
    description      TEXT,
    cuisine          VARCHAR(50) NOT NULL,
    diet             TEXT[]       NOT NULL,
    cook_time_min    INT CHECK (cook_time_min >= 0),
    prep_time_min    INT CHECK (prep_time_min >= 0),
    total_time_min   INT GENERATED ALWAYS AS (cook_time_min + prep_time_min) STORED,
    difficulty       VARCHAR(10) CHECK (difficulty