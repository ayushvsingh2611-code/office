## Smart‑Pantry‑Chef Integration & Content Specification  
*Integrations & Content – Brook*  

---

### 1️⃣ Project Overview  

| Feature | Description |
|---------|-------------|
| **Ingredient Inventory Tracker** | CRUD operations on pantry items (quantity, unit, expiry, location). |
| **Recipe Suggestion Engine** | Returns recipes that can be prepared with the current pantry stock. |
| **Dietary Preference Filters** | Supports allergies, vegan/vegetarian, low‑carb, keto, gluten‑free, etc. |
| **Meal‑Prep Calendar Scheduler** | Modal UI that writes a planned meal (recipe + date + servings) to a user’s calendar (Google/Outlook or internal calendar). |

The system is **frontend‑heavy** (React/Next.js) but requires **four external services** to stay stateless and scalable:

1. **Pantry Service** – Persistent ingredient store (CRUD).  
2. **Recipe Service** – Search & filter recipes (external public API or custom DB).  
3. **Nutrition / Dietary Service** – Validate dietary constraints and provide nutrition facts.  
4. **Calendar Service** – Create, read, update, delete meal‑prep events (Google Calendar API wrapper).  

Below you’ll find **API contracts**, **mock fall‑backs**, **payload typing**, **database schema**, and **realistic seed data** for each component.

---

## 2️⃣ External Service Integration Requirements  

| Service | Base URL (prod) | Mock URL (offline) | Auth Mechanism | Primary Responsibility |
|---------|----------------|--------------------|----------------|------------------------|
| **Pantry Service** | `https://api.smartpantry.io/v1` | `http://localhost:4000/mock/pantry` | Bearer JWT (`Authorization: Bearer <token>`) | Store & retrieve user pantry items. |
| **Recipe Service** | `https://api.recipes.io/v2` | `http://localhost:4001/mock/recipes` | API‑Key (`x-api-key: <key>`) | Search recipes, filter by ingredients, diet. |
| **Nutrition Service** | `https://api.nutri.io/v1` | `http://localhost:4002/mock/nutri` | Bearer JWT | Provide nutrition facts & diet validation. |
| **Calendar Service** | `https://api.calendar.io/v3` | `http://localhost:4003/mock/calendar` | OAuth2 (access‑token) | Persist meal‑prep events. |

All services must expose **CORS** with `Access‑Control‑Allow‑Origin: *` for the web client and must **return JSON** with `Content‑Type: application/json`.

---

## 3️⃣ RESTful API Contracts  

### 3.1 Pantry Service  

| Method | Endpoint | Query / Path | Request Body | Success Response | Errors |
|--------|----------|--------------|--------------|------------------|--------|
| **GET** | `/pantry/items` | `?includeExpired=[bool]` | – | `200 OK` – array of `PantryItem` | `401`, `500` |
| **POST** | `/pantry/items` | – | `PantryItemCreate` | `201 Created` – created `PantryItem` | `400`, `401`, `409`, `500` |
| **PUT** | `/pantry/items/{itemId}` | – | `PantryItemUpdate` | `200 OK` – updated `PantryItem` | `400`, `401`, `404`, `500` |
| **DELETE** | `/pantry/items/{itemId}` | – | – | `204 No Content` | `401`, `404`, `500` |

#### Payload Schemas  

```jsonc
// PantryItem (read)
{
  "id": "c1a2b3d4-5678-90ab-cdef-1234567890ab",   // UUID v4
  "name": "Organic Extra‑Virgin Olive Oil",
  "category": "oil",
  "quantity": 0.75,                               // numeric
  "unit": "liter",                                // enum: liter, ml, gram, kg, piece, pack
  "expiryDate": "2025-04-30",                     // ISO‑8601 (date only)
  "location": "Upper Shelf – A3",                // free‑text
  "createdAt": "2024-09-12T14:23:00Z",            // ISO‑8601 timestamp
  "updatedAt": "2024-09-18T09:10:45Z"
}
```

```jsonc
// PantryItemCreate (write)
{
  "name": "Brown Rice",
  "category": "grain",
  "quantity": 2,
  "unit": "kg",
  "expiryDate": "2026-01-01",
  "location": "Pantry Bin 2"
}
```

```jsonc
// PantryItemUpdate (partial)
{
  "quantity": 1.5,
  "location": "Pantry Bin 1"
}
```

**Validation Rules**

| Field | Constraint |
|-------|------------|
| `name` | 2‑100 chars, regex `^[A-Za-z0-9\s\-\.,']+$` |
| `category` | Enum from **IngredientCategory** (see DB schema). |
| `quantity` | `> 0` and ≤ `9999`. |
| `unit` | Must match allowed units for the category. |
| `expiryDate` | ISO‑8601 date, must be ≥ today (or allow past for “expired” flag). |
| `location` | ≤ 50 chars. |

---

### 3.2 Recipe Service  

| Method | Endpoint | Query | Request Body | Success Response | Errors |
|--------|----------|-------|--------------|------------------|--------|
| **GET** | `/recipes/search` | `ingredients=comma,sep,list&diet=enum&maxPrepMins=int&limit=int` | – | `200 OK` – `RecipeSearchResult` | `400`, `401`, `429`, `500` |
| **GET** | `/recipes/{recipeId}` | – | – | `200 OK` – `RecipeDetail` | `401`, `404`, `500` |

#### Example Query  

```
GET /recipes/search?ingredients=tomato,garlic,olive%20oil&diet=vegetarian&maxPrepMins=30&limit=10
```

#### Response Schemas  

```jsonc
// RecipeSearchResult (array)
[
  {
    "id": "r-9f8e7d6c-5b4a-3210-9abc-def123456789",
    "title": "Mediterranean Tomato Pasta",
    "imageUrl": "https://images.recipes.io/med-pasta.jpg",
    "missingIngredients": ["basil"],          // items not in pantry
    "estimatedPrepMins": 25,
    "dietTags": ["vegetarian", "low‑fat"]
  }
  // …more
]
```

```jsonc
// RecipeDetail
{
  "id": "r-9f8e7d6c-5b4a-3210-9abc-def123456789",
  "title": "Mediterranean Tomato Pasta",
  "imageUrl": "https://images.recipes.io/med-pasta.jpg",
  "ingredients": [
    { "name": "spaghetti", "quantity": 200, "unit": "gram" },
    { "name": "tomato", "quantity": 3, "unit": "piece" },
    { "name": "olive oil", "quantity": 2, "unit": "tablespoon" },
    { "name": "basil", "quantity": 5, "unit": "leaf" }
  ],
  "steps": [
    "Boil water, add salt, cook spaghetti al dente.",
    "Sauté garlic in olive oil, add tomatoes, simmer 10 min.",
    "Combine pasta with sauce, garnish with basil."
  ],
  "nutrition": {
    "calories": 420,
    "protein_g": 12,
    "carbs_g": 68,
    "fat_g": 10,
    "sodium_mg": 350
  },
  "dietTags": ["vegetarian", "low‑fat"],
  "prepTimeMins": 25,
  "cookTimeMins": 15,
  "servings": 2
}
```

**Diet Tags Enum**: `vegetarian`, `vegan`, `keto`, `paleo`, `glutenFree`, `dairyFree`, `lowCarb`, `lowFat`, `nutFree`.

---

### 3.3 Nutrition / Dietary Service  

| Method | Endpoint | Request Body | Success Response | Errors |
|--------|----------|--------------|------------------|--------|
| **POST** | `/diet/validate` | `DietValidationRequest` | `200 OK` – `DietValidationResult` | `400`, `401`, `500` |
| **GET** | `/nutrition/{ingredientId}` | – | `200 OK` – `IngredientNutrition` | `401`, `404`, `500` |

```jsonc
// DietValidationRequest
{
  "dietPreferences": ["vegan", "glutenFree"],
  "ingredients": [
    { "name": "egg", "quantity": 2, "unit": "piece" },
    { "name": "milk", "quantity": 250, "unit": "ml" }
  ]
}
```

```jsonc
// DietValidationResult
{
  "isCompliant": false,
  "violations": [
    { "ingredient": "egg", "reason": "contains animal protein" },
    { "ingredient": "milk", "reason": "contains dairy" }
  ]
}
```

```jsonc
// IngredientNutrition
{
  "id": "i-1234abcd",
  "name": "Brown Rice",
  "servingSize": { "quantity": 100, "unit": "gram" },
  "calories": 112,
  "protein_g": 2.6,
  "carbs_g": 23,
  "fat_g": 0.9,
  "fiber_g": 1.8,
  "sodium_mg": 5
}
```

---

### 3.4 Calendar Service (Meal‑Prep Scheduler)  

| Method | Endpoint | Request Body | Success Response | Errors |
|--------|----------|--------------|------------------|--------|
| **POST** | `/events` | `MealPrepEventCreate` | `201 Created` – `MealPrepEvent` | `400`, `401`, `409`, `500` |
| **GET** | `/events?date=YYYY-MM-DD` | – | `200 OK` – array of `MealPrepEvent` | `401`, `500` |
| **PUT** | `/events/{eventId}` | `MealPrepEventUpdate` | `200 OK` – updated `MealPrepEvent` | `400`, `401`, `404`, `500` |
| **DELETE** | `/events/{eventId}` | – | `204 No Content` | `401`, `404`, `500` |

```jsonc
// MealPrepEventCreate
{
  "recipeId": "r-9f8e7d6c-5b4a-3210-9abc-def123456789",
  "title": "Mediterranean Tomato Pasta",
  "date": "2024-12-03",                // ISO‑8601 date (no time)
  "servings": 2,
  "notes": "Prep extra sauce for lunch tomorrow."
}
```

```jsonc
// MealPrepEvent (read)
{
  "id": "e-7c6b5a4d-3e2f-1a0b-9c8d-7e6f5a4b3c2d",
  "recipeId": "r-9f8e7d6c-5b4a-3210-9abc-def123456789",
  "title": "Mediterranean Tomato Pasta",
  "date": "2024-12-03",
  "servings": 2,
  "notes": "Prep extra sauce for lunch tomorrow.",
  "createdAt": "2024-09-20T12:05:00Z",
  "updatedAt": "2024-09-20T12:05:00Z"
}
```

---

## 4️⃣ Realistic Mock Fallbacks & Offline Resilience  

| Service | Mock Latency | Example Mock Payload | Failure Mode |
|---------|--------------|----------------------|--------------|
| **Pantry** | `~120 ms` | Returns a static list of 10 pantry items (see seed data below). | If live API times‑out (> 3 s) the client falls back to the mock endpoint and shows a toast *“Operating in offline mode – changes will sync when back online.”* |
| **Recipe** | `~250 ms` | Returns 5 recipes that match a hard‑coded ingredient list (`tomato`, `garlic`, `olive oil`). | On 429 (rate‑limit) or network error, the UI shows *“Showing cached suggestions.”* |
| **Nutrition** | `~80 ms` | Returns nutrition for the requested ingredient from an in‑memory map. | If validation fails, UI disables “Add to Meal Plan” button. |
| **Calendar** | `~150 ms` | Echoes back the posted event with a generated UUID. | If OAuth token expired, client triggers silent refresh; if that fails, UI prompts user to re‑authenticate. |

**Mock Implementation Tips**

* Use **Service Worker** (`msw`) in the frontend to intercept fetches and return the mock JSON.  
* Simulate latency with `await new Promise(r => setTimeout(r, latency));`.  
* Randomly inject a `500` error 5 % of the time to test retry logic.

---

## 5️⃣ Data Sanitization & Payload Typing  

| Field | Type | Constraints | Sanitization |
|-------|------|-------------|--------------|
| `id` | `string` (UUID v4) | Must match `/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i` | Trim, lower‑case. |
| `name` | `string` | 2‑100 chars, allowed chars `A‑Z a‑z 0‑9 - , . ' ` | Escape HTML entities before rendering. |
| `quantity` | `number` (float) | `> 0`, max 4 decimal places. | Round to 4 decimals server‑side. |
| `unit` | `enum` | Pre‑defined list per category. | Validate against whitelist. |
| `expiryDate` | `string` (ISO‑8601 date) | Must be a valid date; optional past dates allowed with `includeExpired=true`. | Parse with `Date.parse`, reject NaN. |
| `dietTags` | `string[]` | Must be from `DietTagEnum`. | Deduplicate, lower‑case. |
| `date` (calendar) | `string` (ISO‑8601 date) | Must be ≥ today for future planning. | Convert to UTC midnight. |
| `notes` | `string` | Max 500 chars. | Strip script tags (`<script>`). |

All **incoming JSON** is validated against the above schemas using **AJV** (or equivalent) before any DB write.

---

## 6️⃣ Database Schema & Seed Data  

### 6.1 Entity Relationship Diagram (simplified)

```
User (1) ──< owns >── PantryItem
User (1) ──< owns >── MealPrepEvent
Recipe (0..*) ──< referenced by >── MealPrepEvent
Ingredient (0..*) ──< used in >── RecipeIngredient (junction)
```

### 6.2 Tables  

| Table | Columns (type) | Constraints |
|-------|----------------|-------------|
| **users** | `id PK string UUID`, `email string UNIQUE`, `passwordHash string`, `createdAt ts`, `updatedAt ts` | `email` regex, password length ≥ 8 |
| **pantry_items** | `id PK string UUID`, `userId FK → users.id ON DELETE CASCADE`, `name string`, `category enum`, `quantity numeric(10,4)`, `unit enum`, `expiryDate date`, `location string`, `createdAt ts`, `updatedAt ts` | `quantity > 0` |
| **recipes** | `id PK string UUID`, `title string`, `imageUrl string`, `prepTimeMins int`, `cookTimeMins int`, `servings int`, `dietTags jsonb`, `createdAt ts`, `updatedAt ts` | `title` unique |
| **recipe_ingredients** | `recipeId FK → recipes.id`, `ingredientName string`, `quantity numeric`, `unit enum`, `PRIMARY KEY (recipeId, ingredientName)` | – |
| **meal_prep_events** | `id PK string UUID`, `userId FK → users.id ON DELETE CASCADE`, `recipeId FK → recipes.id`, `date date`, `servings int`, `notes string`, `createdAt ts`, `updatedAt ts` | `date` NOT NULL |
| **dietary_rules** (optional) | `id PK string UUID`, `name string`, `type enum (allergy|restriction)`, `pattern regex` | – |

### 6.3 Realistic Seed Data  

#### Users  

```json
{
  "id": "u-1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
  "email": "jane.doe@example.com",
  "passwordHash": "$2b$12$K9e5V1h8uR4zj3L9Y5t9XeB8t0uHcJgRZ3p5k6w9a1B2c3D4e5F6G", // bcrypt
  "createdAt": "2024-09-01T08:00