# 🍳 Smart Pantry Chef: Data Architecture & API Specification
**Author:** Nami (Data Architect)  
**Project:** Smart Pantry Chef (Ingredients Inventory Tracker, Recipe Matcher, Dietary Filters, & Meal Prep Calendar)  
**Standards:** Open Agent Skills Specification (`database-schema-modeling`, `api-and-interface-design`)

---

## 1. Entity-Relationship & Data Model Design

### 1.1 Core Entities & TypeScript Interfaces

Below is the complete type definition representing the core entities of Smart Pantry Chef, adhering to strict typing, UUID/slug identification, validation rules, and relational integrity.

```typescript
// ==========================================
// 1. INVENTORY ITEM ENTITY
// ==========================================
export type ItemCategory = 
  | 'Produce' 
  | 'Dairy & Eggs' 
  | 'Meat & Poultry' 
  | 'Seafood' 
  | 'Pantry & Dry Goods' 
  | 'Spices & Seasonings' 
  | 'Beverages' 
  | 'Condiments & Sauces' 
  | 'Bakery';

export type UnitOfMeasurement = 
  | 'g' | 'kg' | 'oz' | 'lb' 
  | 'ml' | 'l' | 'cup' | 'tbsp' | 'tsp' 
  | 'pcs' | 'can' | 'bottle' | 'packet';

export interface PantryItem {
  id: string; // UUID v4
  name: string; // e.g., "Organic Baby Spinach"
  category: ItemCategory;
  quantity: number; // > 0
  unit: UnitOfMeasurement;
  minThreshold: number; // Low stock alert trigger (e.g., 1)
  expiryDate: string; // ISO-8601 YYYY-MM-DD
  purchaseDate: string; // ISO-8601 YYYY-MM-DD
  location: 'Pantry' | 'Refrigerator' | 'Freezer';
  costPerUnit?: number; // USD, e.g., 2.99
  notes?: string;
  createdAt: string; // ISO-8601 Timestamp
  updatedAt: string; // ISO-8601 Timestamp
}

// ==========================================
// 2. RECIPE ENTITY
// ==========================================
export type DietaryTag = 
  | 'Vegetarian' 
  | 'Vegan' 
  | 'Gluten-Free' 
  | 'Dairy-Free' 
  | 'Keto' 
  | 'Paleo' 
  | 'Low-Carb' 
  | 'Nut-Free' 
  | 'Halal' 
  | 'Kosher';

export interface RecipeIngredient {
  ingredientId?: string; // Links to PantryItem if matched
  name: string; // Display name e.g., "Garlic cloves"
  amount: number;
  unit: UnitOfMeasurement;
  required: boolean; // false = optional/substitutable
}

export interface Recipe {
  id: string; // UUID v4 or slug e.g., "creamy-garlic-tuscan-chicken"
  title: string;
  description: string;
  prepTimeMinutes: number; // e.g., 15
  cookTimeMinutes: number; // e.g., 25
  servings: number; // e.g., 4
  difficulty: 'Easy' | 'Medium' | 'Hard';
  caloriesPerServing: number;
  dietaryTags: DietaryTag[];
  ingredients: RecipeIngredient[];
  instructions: string[]; // Step-by-step
  imageUrl: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 3. RECIPE MATCH RESULT (Computed)
// ==========================================
export interface RecipeMatchResult {
  recipe: Recipe;
  matchPercentage: number; // 0 to 100
  availableIngredients: { name: string; have: boolean; requiredAmount: string }[];
  missingIngredients: { name: string; amount: string }[];
  canCookNow: boolean; // matchPercentage === 100 or missing only optional
}

// ==========================================
// 4. MEAL PREP CALENDAR EVENT ENTITY
// ==========================================
export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface MealPlanEvent {
  id: string; // UUID v4
  recipeId: string; // References Recipe.id
  recipeTitle: string; // Denormalized for rapid UI rendering
  date: string; // ISO-8601 YYYY-MM-DD
  mealType: MealType;
  servings: number;
  notes?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 5. USER PREFERENCES ENTITY
// ==========================================
export interface UserPreferences {
  dietaryFilters: DietaryTag[];
  allergens: string[]; // e.g., ["Peanuts", "Shellfish"]
  servingsDefault: number; // default 2
  lowStockAlertsEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
}
```

---

## 2. Validation & Integrity Rules

| Entity / Field | Validation Rule / Constraint | Error Message / Handling |
| :--- | :--- | :--- |
| **PantryItem.name** | Required, 2-100 characters, alphanumeric + spaces/dashes. | `"Item name is required and must be between 2 and 100 characters."` |
| **PantryItem.quantity** | Numeric, strictly greater than `0`. | `"Quantity must be a positive number greater than 0."` |
| **PantryItem.expiryDate** | Valid ISO-8601 `YYYY-MM-DD`. Must be $\ge$ purchase date. | `"Expiry date cannot be prior to purchase date."` |
| **PantryItem.minThreshold**| Non-negative number ($\ge 0$). Triggers low stock alert when `quantity <= minThreshold`. | `"Minimum threshold must be 0 or greater."` |
| **Recipe.prepTimeMinutes**| Positive integer ($\ge 0$). | `"Prep time cannot be negative."` |
| **MealPlanEvent.date** | Valid ISO-8601 date string. Cannot schedule more than 1 year in advance or past. | `"Please select a valid calendar date."` |

---

## 3. Realistic Mock Seed Data

To guarantee immediate offline functionality and a delightful first-run experience, the following seed dataset is engineered.

### 3.1 Default Pantry Inventory Seed
```json
[
  {
    "id": "inv-001",
    "name": "Organic Baby Spinach",
    "category": "Produce",
    "quantity": 150,
    "unit": "g",
    "minThreshold": 50,
    "expiryDate": "2025-03-15",
    "purchaseDate": "2025-03-08",
    "location": "Refrigerator",
    "costPerUnit": 3.49,
    "notes": "Wash thoroughly before use",
    "createdAt": "2025-03-08T08:00:00Z",
    "updatedAt": "2025-03-08T08:00:00Z"
  },
  {
    "id": "inv-002",
    "name": "Extra Virgin Olive Oil",
    "category": "Pantry & Dry Goods",
    "quantity": 750,
    "unit": "ml",
    "minThreshold": 100,
    "expiryDate": "2026-12-01",
    "purchaseDate": "2024-11-15",
    "location": "Pantry",
    "costPerUnit": 12.99,
    "notes": "Cold pressed, Italian import",
    "createdAt": "2025-01-10T10:00:00Z",
    "updatedAt": "2025-01-10T10:00:00Z"
  },
  {
    "id": "inv-003",
    "name": "Free-Range Large Eggs",
    "category": "Dairy & Eggs",
    "quantity": 8,
    "unit": "pcs",
    "minThreshold": 4,
    "expiryDate": "2025-03-25",
    "purchaseDate": "2025-03-06",
    "location": "Refrigerator",
    "costPerUnit": 4.99,
    "notes": "Carton of 12",
    "createdAt": "2025-03-06T12:00:00Z",
    "updatedAt": "2025-03-08T09:30:00Z"
  },
  {
    "id": "inv-004",
    "name": "Boneless Skinless Chicken Breast",
    "category": "Meat & Poultry",
    "quantity": 2,
    "unit": "lb",
    "minThreshold": 1,
    "expiryDate": "2025-03-12",
    "purchaseDate": "2025-03-08",
    "location": "Refrigerator",
    "costPerUnit": 7.99,
    "notes": "Fresh butcher cut",
    "createdAt": "2025-03-08T08:00:00Z",
    "updatedAt": "2025-03-08T08:00:00Z"
  },
  {
    "id": "inv-005",
    "name": "Garlic Cloves",
    "category": "Produce",
    "quantity": 6,
    "unit": "pcs",
    "minThreshold": 2,
    "expiryDate": "2025-04-01",
    "purchaseDate": "2025-03-01",
    "location": "Pantry",
    "costPerUnit": 0.75,
    "createdAt": "2025-03-01T15:00:00Z",
    "updatedAt": "2025-03-01T15:00:00Z"
  },
  {
    "id": "inv-006",
    "name": "Parmesan Cheese (Reggiano)",
    "category": "Dairy & Eggs",
    "quantity": 200,
    "unit": "g",
    "minThreshold": 50,
    "expiryDate": "2025-05-10",
    "purchaseDate": "2025-02-15",
    "location": "Refrigerator",
    "costPerUnit": 6.50,
    "createdAt": "2025-02-15T09:00:00Z",
    "updatedAt": "2025-02-15T09:00:00Z"
  },
  {
    "id": "inv-007",
    "name": "Quinoa (White & Red)",
    "category": "Pantry & Dry Goods",
    "quantity": 500,
    "unit": "g",
    "minThreshold": 100,
    "expiryDate": "2027-01-01",
    "purchaseDate": "2025-01-05",
    "location": "Pantry",
    "costPerUnit": 4.25,
    "createdAt": "2025-01-05T00:00:00Z",
    "updatedAt": "2025-01-05T00:00:00Z"
  }
]
```

### 3.2 Default Recipes Seed
```json
[
  {
    "id": "rec-001",
    "title": "Garlic Parmesan Chicken & Spinach Skillet",
    "description": "A quick, one-pan 25-minute keto-friendly dinner packed with tender chicken breasts, aromatic garlic, fresh spinach, and rich parmesan cheese.",
    "prepTimeMinutes": 10,
    "cookTimeMinutes": 15,
    "servings": 2,
    "difficulty": "Easy",
    "caloriesPerServing": 420,
    "dietaryTags": ["Keto", "Gluten-Free", "Low-Carb", "Nut-Free"],
    "ingredients": [
      { "name": "Boneless Skinless Chicken Breast", "amount": 2, "unit": "lb", "required": true },
      { "name": "Extra Virgin Olive Oil", "amount": 2, "unit": "tbsp", "required": true },
      { "name": "Garlic Cloves", "amount": 4, "unit": "pcs", "required": true },
      { "name": "Organic Baby Spinach", "amount": 100, "unit": "g", "required": true },
      { "name": "Parmesan Cheese (Reggiano)", "amount": 50, "unit": "g", "required": true }
    ],
    "instructions": [
      "Season chicken breasts with salt, pepper, and garlic powder.",
      "Heat olive oil in a large skillet over medium-high heat.",
      "Sear chicken for 6-7 minutes per side until golden brown and cooked through (internal temp 165°F). Remove and set aside.",
      "In the same skillet, sauté minced garlic for 30 seconds until fragrant.",
      "Add baby spinach and toss until wilted (about 2 minutes).",
      "Sprinkle freshly grated parmesan cheese over the spinach and slice chicken back into the skillet to melt. Serve warm!"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1604908554025-69324e930517?auto=format&fit=crop&w=800&q=80",
    "author": "Chef Nami",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  },
  {
    "id": "rec-002",
    "title": "Healthy Quinoa & Spinach Power Bowl",
    "description": "Nourishing vegetarian grain bowl loaded with protein-rich quinoa, fresh baby spinach, soft-boiled eggs, and a drizzle of olive oil.",
    "prepTimeMinutes": 15,
    "cookTimeMinutes": 20,
    "servings": 2,
    "difficulty": "Easy",
    "caloriesPerServing": 380,
    "dietaryTags": ["Vegetarian", "Gluten-Free", "Nut-Free"],
    "ingredients": [
      { "name": "Quinoa (White & Red)", "amount": 1, "unit": "cup", "required": true },
      { "name": "Free-Range Large Eggs", "amount": 2, "unit": "pcs", "required": true },
      { "name": "Organic Baby Spinach", "amount": 80, "unit": "g", "required": true },
      { "name": "Extra Virgin Olive Oil", "amount": 1, "unit": "tbsp", "required": true },
      { "name": "Parmesan Cheese (Reggiano)", "amount": 20, "unit": "g", "required": false }
    ],
    "instructions": [
      "Rinse quinoa and boil in 2 cups of water for 15 minutes until fluffy.",
      "Boil eggs for 6.5 minutes for a jammy soft-boiled texture, then plunge into ice water and peel.",
      "Assemble bowls with a base of warm quinoa, fresh baby spinach, halved soft eggs, and shaved parmesan.",
      "Drizzle with extra virgin olive oil and season with flaky sea salt."
    ],
    "imageUrl": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    "author": "Chef Nami",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
]
```

### 3.3 Default Meal Plan Events Seed
```json
[
  {
    "id": "mp-001",
    "recipeId": "rec-001",
    "recipeTitle": "Garlic Parmesan Chicken & Spinach Skillet",
    "date": "2025-03-10",
    "mealType": "Dinner",
    "servings": 2,
    "notes": "Quick weeknight meal",
    "completed": false,
    "createdAt": "2025-03-08T10:00:00Z",
    "updatedAt": "2025-03-08T10:00:00Z"
  }
]
```

---

## 4. State Management Architecture (Zustand Store Design)

The application state is managed cleanly using Zustand with LocalStorage persistence (`smart-pantry-chef-storage`).

### 4.1 State Store Interface
```typescript
import { PantryItem, Recipe, MealPlanEvent, UserPreferences, DietaryTag } from './types';

export interface PantryChefState {
  // Data Slices
  inventory: PantryItem[];
  recipes: Recipe[];
  mealPlans: MealPlanEvent[];
  preferences: UserPreferences;
  
  // UI & Filter Slices
  searchQuery: string;
  selectedCategoryFilter: string | null;
  selectedDietaryFilters: DietaryTag[];
  activeModal: 'none' | 'add-item' | 'edit-item' | 'recipe-detail' | 'meal-calendar' | 'settings';
  activeRecipeId: string | null;
  activeCalendarDate: string | null;

  // Actions: Inventory
  addPantryItem: (item: Omit<PantryItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePantryItem: (id: string, updates: Partial<PantryItem>) => void;
  deletePantryItem: (id: string) => void;
  adjustQuantity: (id: string, delta: number) => void;

  // Actions: Recipes
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRecipe: (id: string, updates: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;

  // Actions: Meal Planning
  scheduleMeal: (event: Omit<MealPlanEvent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMealPlan: (id: string, updates: Partial<MealPlanEvent>) => void;
  deleteMealPlan: (id: string) => void;
  toggleMealCompleted: (id: string) => void;

  // Actions: Preferences & UI
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string | null) => void;
  toggleDietaryFilter: (tag: DietaryTag) => void;
  setActiveModal: (modal: PantryChefState['activeModal'], meta?: { recipeId?: string; date?: string }) => void;
  
  // Computed Getters / Helpers
  getLowStockItems: () => PantryItem[];
  getExpiringSoonItems: (daysThreshold?: number) => PantryItem[];
  matchRecipesWithInventory: () => { recipe: Recipe; matchPercentage: number; missing: string[] }[];
}
```

---

## 5. API Contracts & Service Specifications

Since Smart Pantry Chef is designed as a client-side progressive web application with full offline resilience, the API layer is abstracted into a service interface that can interact with LocalStorage or sync with a cloud backend (e.g., AWS DynamoDB / REST API).

### 5.1 RESTful API Endpoint Specifications

#### 1. Inventory Management
* **`GET /api/v1/inventory`**
  * *Query Params:* `category` (string, optional), `lowStock` (boolean, optional)
  * *Response `200 OK`:* Array of `PantryItem` objects.
* **`POST /api/v1/inventory`**
  * *Request Body:* `Omit<PantryItem, 'id' | 'createdAt' | 'updatedAt'>`
  * *Response `201 Created`:* Created `PantryItem` object.
* **`PUT /api/v1/inventory/:id`**
  * *Request Body:* `Partial<PantryItem>`
  * *Response `200 OK`:* Updated `PantryItem` object.
* **`DELETE /api/v1/inventory/:id`**
  * *Response `204 No Content`:* Successfully deleted.

#### 2. Recipe & Smart Matcher
* **`GET /api/v1/recipes`**
  * *Query Params:* `dietary` (comma-separated tags), `search` (string)
  * *Response `200 OK`:* Array of `Recipe` objects.
* **`POST /api/v1/recipes/match`**
  * *Request Body:* `{ inventory: PantryItem[]; dietaryFilters: DietaryTag[] }`
  * *Response `200 OK`:* Array of `RecipeMatchResult` sorted by highest `matchPercentage` descending.

#### 3. Meal Prep Calendar
* **`GET /api/v1/meal-plans`**
  * *Query Params:* `startDate` (YYYY-MM-DD), `endDate` (YYYY-MM-DD)
  * *Response `200 OK`:* Array of `MealPlanEvent` objects.
* **`POST /api/v1/meal-plans`**
  * *Request Body:* `Omit<MealPlanEvent, 'id' | 'createdAt' | 'updatedAt'>`
  * *Response `201 Created`:* Created `MealPlanEvent` object.
* **`DELETE /api/v1/meal-plans/:id`**
  * *Response `204 No Content`:* Successfully removed.

---

## 6. Offline Resilience & Mock Fallback Strategy

1. **Automatic LocalStorage Hydration:** On app boot, Zustand initializes state from `localStorage.getItem('smart-pantry-chef-storage')`. If empty, it seeds the initial mock inventory, recipes, and meal plans.
2. **Simulated Network Latency:** Async service wrappers include a configurable `setTimeout` (200-400ms) to simulate real cloud API calls, ensuring loading skeletons render properly during testing.
3. **Optimistic UI Updates:** All inventory adjustments (e.g., deducting ingredients when cooking a meal) update local state instantly and persist silently in the background.