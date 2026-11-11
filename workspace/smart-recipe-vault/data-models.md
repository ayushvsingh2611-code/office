# 🗄️ Nami's Data Architecture & API Design: Smart Recipe Vault

Namaste! I am **Nami**, your Data Architect. I have designed the complete data structures, entity relationships, state management interfaces, API contracts, validation rules, and realistic mock seed data for **Smart Recipe Vault**.

---

## 1. Entity-Relationship & Database Schema Design

The Smart Recipe Vault operates on 4 core entities: **Recipe**, **Ingredient**, **GroceryItem**, and **ConsultationBooking**. Below are the schema definitions with explicit types, constraints, and relationships.

### A. Recipe Entity
Represents cooking recipes with nutritional info, dietary tags, cooking steps, and ingredient mappings.
```typescript
interface Recipe {
  id: string; // UUIDv4 or slug e.g., "mediterranean-quinoa-bowl"
  title: string; // Required, 3-100 chars
  slug: string; // Unique URL-friendly identifier
  description: string; // Short summary, 10-300 chars
  prepTimeMinutes: number; // Positive integer (e.g., 15)
  cookTimeMinutes: number; // Positive integer (e.g., 25)
  totalTimeMinutes: number; // Computed: prepTimeMinutes + cookTimeMinutes
  servings: number; // Default 4, range 1-20
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string; // e.g., "Mediterranean", "Italian", "Indian"
  dietaryTags: Array<'Vegetarian' | 'Vegan' | 'Gluten-Free' | 'Dairy-Free' | 'Keto' | 'Low-Carb' | 'Halal'>;
  caloriesPerServing: number; // Positive integer
  proteinGrams: number; // Decimal/Float
  carbsGrams: number; // Decimal/Float
  fatGrams: number; // Decimal/Float
  ingredients: Array<{
    ingredientId: string; // Ref to Ingredient
    name: string; // Display name
    amount: number; // e.g., 1.5
    unit: string; // e.g., "cups", "tbsp", "grams", "cloves", "pcs"
    category: 'Produce' | 'Dairy' | 'Meat' | 'Pantry' | 'Spices' | 'Bakery';
  }>;
  instructions: Array<{
    stepNumber: number; // Sequential starting at 1
    instruction: string; // Detailed step description
    timerMinutes?: number; // Optional built-in step timer
  }>;
  imageUrl: string; // High-res Unsplash image URL
  rating: number; // 1.0 to 5.0
  reviewCount: number; // Non-negative integer
  createdAt: string; // ISO-8601 timestamp
  updatedAt: string; // ISO-8601 timestamp
}
```

### B. Ingredient Master Entity
Standardized ingredient database for grocery list generation and pantry matching.
```typescript
interface Ingredient {
  id: string; // UUID
  name: string; // Canonical name e.g., "Organic Extra Virgin Olive Oil"
  defaultCategory: 'Produce' | 'Dairy' | 'Meat' | 'Pantry' | 'Spices' | 'Bakery' | 'Frozen';
  defaultUnit: string; // Standard unit e.g., "grams", "ml", "pcs"
  averageCostUsd: number; // Estimated unit cost for grocery estimation
}
```

### C. GroceryItem Entity (Interactive Grocery List)
Generated from recipes or added manually by the user.
```typescript
interface GroceryItem {
  id: string; // UUID
  userId: string; // Owner ID (default 'local-user')
  recipeId?: string; // Source recipe ID if added via recipe generator
  recipeTitle?: string; // Display source recipe title
  name: string; // Item name e.g., "Avocado"
  amount: number; // Quantity needed
  unit: string; // Unit of measurement
  category: 'Produce' | 'Dairy' | 'Meat' | 'Pantry' | 'Spices' | 'Bakery' | 'Frozen';
  isChecked: boolean; // Checked off when bought in store
  createdAt: string; // ISO-8601
}
```

### D. ConsultationBooking Entity
Represents live 1-on-1 virtual consulting bookings with professional chefs.
```typescript
interface ConsultationBooking {
  id: string; // UUID
  userId: string; // Booking user ID
  chefId: string; // Assigned chef ID e.g., "chef-elena-rostova"
  chefName: string; // e.g., "Chef Elena Rostova"
  chefSpecialty: string; // e.g., "Plant-Based & Mediterranean Master"
  chefAvatarUrl: string; // Profile image URL
  recipeId?: string; // Associated recipe being consulted on
  recipeTitle?: string;
  scheduledAt: string; // ISO-8601 timestamp of consultation
  durationMinutes: number; // e.g., 30 or 45
  topic: string; // e.g., "Substitution advice & mastering sauce emulsion"
  status: 'Confirmed' | 'Rescheduled' | 'Completed' | 'Cancelled';
  meetingLink: string; // Virtual room URL e.g., "https://meet.recipevault.io/room-xyz"
  createdAt: string; // ISO-8601
}
```

---

## 2. State Management & LocalStorage Architecture

State management is structured around a centralized React Context or Zustand store with persistent client-side synchronization via `localStorage`.

### State Store Structure (`useRecipeVaultStore`)
```typescript
interface RecipeVaultState {
  // Discovery & Filtering
  recipes: Recipe[];
  searchQuery: string;
  selectedDiet: string | null;
  maxCookTime: number; // minutes slider (e.g. 15, 30, 60, 120)
  selectedCuisine: string | null;
  selectedDifficulty: string | null;
  sortBy: 'popular' | 'time' | 'calories' | 'rating';

  // Active Recipe Modal / Drawer
  activeRecipeId: string | null;

  // Interactive Grocery List
  groceryItems: GroceryItem[];

  // Chef Consultations
  bookings: ConsultationBooking[];
  isBookingModalOpen: boolean;
  activeConsultationRecipe: { id: string; title: string } | null;

  // Actions
  setSearchQuery: (query: string) => void;
  setDietFilter: (diet: string | null) => void;
  setMaxCookTime: (time: number) => void;
  setCuisineFilter: (cuisine: string | null) => void;
  setDifficultyFilter: (diff: string | null) => void;
  setSortBy: (sort: 'popular' | 'time' | 'calories' | 'rating') => void;
  
  setActiveRecipeId: (id: string | null) => void;

  // Grocery Actions
  addIngredientsToGroceryList: (recipe: Recipe, servingsMultiplier?: number) => void;
  toggleGroceryItem: (id: string) => void;
  removeGroceryItem: (id: string) => void;
  clearCompletedGroceryItems: () => void;
  clearAllGroceryItems: () => void;
  addCustomGroceryItem: (item: Omit<GroceryItem, 'id' | 'userId' | 'isChecked' | 'createdAt'>) => void;

  // Booking Actions
  openBookingModal: (recipe?: { id: string; title: string }) => void;
  closeBookingModal: () => void;
  createBooking: (booking: Omit<ConsultationBooking, 'id' | 'userId' | 'status' | 'meetingLink' | 'createdAt'>) => ConsultationBooking;
  cancelBooking: (id: string) => void;
}
```

### LocalStorage Persistence Keys
* `smart_recipe_vault_recipes_v1`: Cached recipes list.
* `smart_recipe_vault_grocery_v1`: User's saved grocery list.
* `smart_recipe_vault_bookings_v1`: Scheduled chef consultations.

---

## 3. RESTful API Contracts & Mock Fallback Handlers

Even though Smart Recipe Vault functions fully offline with mock seed data, we define pristine REST contracts for future backend synchronization.

### A. Recipes API
* **`GET /api/recipes`**
  * *Query Params:* `search` (string), `diet` (string), `maxTime` (number), `cuisine` (string), `difficulty` (string), `sort` (string)
  * *Response (200 OK):* `Recipe[]`
* **`GET /api/recipes/:id`**
  * *Response (200 OK):* `Recipe` | *Error (404):* `{ error: "Recipe not found" }`

### B. Grocery List API
* **`GET /api/grocery`** -> Returns `GroceryItem[]`
* **`POST /api/grocery`** -> Body: `Omit<GroceryItem, 'id' | 'userId' | 'createdAt'>` -> Returns created `GroceryItem` (201 Created)
* **`PATCH /api/grocery/:id`** -> Body: `{ isChecked?: boolean; amount?: number }` -> Returns updated `GroceryItem` (200 OK)
* **`DELETE /api/grocery/:id`** -> Returns (204 No Content)

### C. Chef Consultation Booking API
* **`GET /api/consultations`** -> Returns `ConsultationBooking[]`
* **`POST /api/consultations`** -> Body: `Omit<ConsultationBooking, 'id' | 'userId' | 'status' | 'meetingLink' | 'createdAt'>` -> Returns created `ConsultationBooking` with assigned meeting link (201 Created)
* **`DELETE /api/consultations/:id`** -> Cancel booking (200 OK)

---

## 4. Data Validation & Integrity Rules

1. **Recipe Filtering Integrity:**
   * `maxCookTime` must be between 5 and 180 minutes.
   * `dietaryTags` must strictly match the allowed enum values (`Vegetarian`, `Vegan`, `Gluten-Free`, `Dairy-Free`, `Keto`, `Low-Carb`, `Halal`).
2. **Grocery List Integrity:**
   * `amount` must be greater than 0 (`amount > 0`).
   * Duplicate ingredients from the same recipe are aggregated or uniquely keyed in the grocery list to prevent clutter.
3. **Chef Consultation Integrity:**
   * `scheduledAt` must be a future ISO-8601 timestamp.
   * `durationMinutes` must be either `30` or `45`.
   * User email/name required in booking payload if guest mode is enabled.

---

## 5. Realistic Mock Seed Data (`recipes.ts`)

Here is the rich culinary seed dataset powering the Smart Recipe Vault instantly upon load:

```typescript
export const INITIAL_RECIPES: Recipe[] = [
  {
    id: "rec-med-quinoa-bowl",
    title: "Mediterranean Roasted Chickpea & Quinoa Bowl",
    slug: "mediterranean-roasted-chickpea-quinoa-bowl",
    description: "A vibrant, protein-packed bowl featuring crispy spiced chickpeas, fluffy tricolor quinoa, crisp cucumbers, kalamata olives, and creamy homemade tahini dressing.",
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    totalTimeMinutes: 35,
    servings: 2,
    difficulty: "Easy",
    cuisine: "Mediterranean",
    dietaryTags: ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Halal"],
    caloriesPerServing: 480,
    proteinGrams: 18.5,
    carbsGrams: 62.0,
    fatGrams: 19.0,
    ingredients: [
      { ingredientId: "ing-quinoa", name: "Tricolor Quinoa", amount: 1, unit: "cup", category: "Pantry" },
      { ingredientId: "ing-chickpeas", name: "Canned Chickpeas (rinsed)", amount: 1, unit: "can (400g)", category: "Pantry" },
      { ingredientId: "ing-olive-oil", name: "Extra Virgin Olive Oil", amount: 2, unit: "tbsp", category: "Pantry" },
      { ingredientId: "ing-cumin", name: "Ground Cumin", amount: 1, unit: "tsp", category: "Spices" },
      { ingredientId: "ing-cucumber", name: "English Cucumber, diced", amount: 1, unit: "pcs", category: "Produce" },
      { ingredientId: "ing-olives", name: "Kalamata Olives, pitted", amount: 0.5, unit: "cup", category: "Pantry" },
      { ingredientId: "ing-tahini", name: "Tahini Paste", amount: 3, unit: "tbsp", category: "Pantry" },
      { ingredientId: "ing-lemon", name: "Fresh Lemon Juice", amount: 2, unit: "tbsp", category: "Produce" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Preheat oven to 200°C (400°F). Rinse and drain chickpeas thoroughly, patting dry with a kitchen towel.", timerMinutes: 5 },
      { stepNumber: 2, instruction: "Toss chickpeas with 1 tbsp olive oil, ground cumin, salt, and black pepper. Roast on a baking sheet for 20 minutes until crunchy.", timerMinutes: 20 },
      { stepNumber: 3, instruction: "In a saucepan, bring 1.5 cups water and quinoa to a boil. Reduce heat, cover, and simmer for 15 minutes, then fluff with a fork.", timerMinutes: 15 },
      { stepNumber: 4, instruction: "Whisk tahini, lemon juice, 2 tbsp warm water, and a pinch of salt together in a small bowl until smooth.", timerMinutes: 2 },
      { stepNumber: 5, instruction: "Assemble bowls: divide quinoa, roasted chickpeas, diced cucumber, and olives. Drizzle generously with tahini dressing." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80",
    rating: 4.9,
    reviewCount: 128,
    createdAt: "2024-01-15T08:00:00.000Z",
    updatedAt: "2024-02-10T12:00:00.000Z"
  },
  {
    id: "rec-avocado-lime-salmon",
    title: "Pan-Seared Salmon with Avocado Mango Salsa",
    slug: "pan-seared-salmon-avocado-mango-salsa",
    description: "Crispy skin salmon fillets topped with a refreshing, zesty dice of ripe avocado, sweet mango, red onion, cilantro, and fresh lime juice.",
    prepTimeMinutes: 10,
    cookTimeMinutes: 12,
    totalTimeMinutes: 22,
    servings: 2,
    difficulty: "Medium",
    cuisine: "Caribbean / Fusion",
    dietaryTags: ["Gluten-Free", "Dairy-Free", "Keto", "Low-Carb", "Halal"],
    caloriesPerServing: 520,
    proteinGrams: 34.0,
    carbsGrams: 14.0,
    fatGrams: 36.0,
    ingredients: [
      { ingredientId: "ing-salmon", name: "Fresh Salmon Fillets", amount: 2, unit: "pcs (200g each)", category: "Meat" },
      { ingredientId: "ing-avocado", name: "Ripe Avocado, diced", amount: 1, unit: "pcs", category: "Produce" },
      { ingredientId: "ing-mango", name: "Ripe Mango, diced", amount: 1, unit: "pcs", category: "Produce" },
      { ingredientId: "ing-red-onion", name: "Red Onion, finely diced", amount: 0.25, unit: "cup", category: "Produce" },
      { ingredientId: "ing-cilantro", name: "Fresh Cilantro, chopped", amount: 3, unit: "tbsp", category: "Produce" },
      { ingredientId: "ing-lime", name: "Lime Zest & Juice", amount: 1, unit: "pcs", category: "Produce" },
      { ingredientId: "ing-avocado-oil", name: "Avocado Oil", amount: 1, unit: "tbsp", category: "Pantry" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "In a mixing bowl, gently combine diced avocado, mango, red onion, cilantro, lime juice, and salt. Set salsa aside.", timerMinutes: 5 },
      { stepNumber: 2, instruction: "Pat salmon fillets completely dry with paper towels and season both sides with salt and pepper.", timerMinutes: 3 },
      { stepNumber: 3, instruction: "Heat avocado oil in a heavy skillet over medium-high heat until shimmering.", timerMinutes: 2 },
      { stepNumber: 4, instruction: "Place salmon skin-side down and sear undisturbed for 5-6 minutes until skin is golden and crisp. Flip and cook 3-4 more minutes.", timerMinutes: 10 },
      { stepNumber: 5, instruction: "Serve warm salmon fillets immediately topped with a generous spoonful of avocado mango salsa." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1000&q=80",
    rating: 4.8,
    reviewCount: 94,
    createdAt: "2024-01-18T10:30:00.000Z",
    updatedAt: "2024-02-12T14:15:00.000Z"
  },
  {
    id: "rec-wild-mushroom-risotto",
    title: "Creamy Truffled Wild Mushroom Risotto",
    slug: "creamy-truffled-wild-mushroom-risotto",
    description: "Arborio rice slow-cooked with aromatic shallots, white wine, rich vegetable broth, sautéed cremini and shiitake mushrooms, finished with parmesan and truffle oil.",
    prepTimeMinutes: 15,
    cookTimeMinutes: 30,
    totalTimeMinutes: 45,
    servings: 4,
    difficulty: "Hard",
    cuisine: "Italian",
    dietaryTags: ["Vegetarian", "Gluten-Free"],
    caloriesPerServing: 510,
    proteinGrams: 12.0,
    carbsGrams: 68.0,
    fatGrams: 18.0,
    ingredients: [
      { ingredientId: "ing-arborio", name: "Arborio Rice", amount: 1.5, unit: "cups", category: "Pantry" },
      { ingredientId: "ing-mushrooms", name: "Mixed Wild Mushrooms (Cremini & Shiitake)", amount: 300, unit: "grams", category: "Produce" },
      { ingredientId: "ing-broth", name: "Warm Vegetable Broth", amount: 5, unit: "cups", category: "Pantry" },
      { ingredientId: "ing-white-wine", name: "Dry White Wine", amount: 0.5, unit: "cup", category: "Pantry" },
      { ingredientId: "ing-shallots", name: "Shallots, minced", amount: 2, unit: "pcs", category: "Produce" },
      { ingredientId: "ing-parmesan", name: "Grated Parmesan Cheese", amount: 0.75, unit: "cup", category: "Dairy" },
      { ingredientId: "ing-butter", name: "Unsalted Butter", amount: 3, unit: "tbsp", category: "Dairy" },
      { ingredientId: "ing-truffle-oil", name: "White Truffle Oil", amount: 1, unit: "tsp", category: "Pantry" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Keep vegetable broth warm in a saucepan over low heat.", timerMinutes: 5 },
      { stepNumber: 2, instruction: "Sauté sliced mushrooms in 1 tbsp butter until golden brown. Season with salt and set aside.", timerMinutes: 8 },
      { stepNumber: 3, instruction: "In a heavy skillet, sauté minced shallots in remaining butter until translucent. Add arborio rice and toast for 2 minutes.", timerMinutes: 5 },
      { stepNumber: 4, instruction: "Pour in white wine and stir until completely absorbed by the rice.", timerMinutes: 3 },
      { stepNumber: 5, instruction: "Add warm broth one ladle at a time, stirring constantly until absorbed before adding the next. Continue for 20 minutes until creamy and al dente.", timerMinutes: 20 },
      { stepNumber: 6, instruction: "Fold in sautéed mushrooms, parmesan cheese, and drizzle with truffle oil just before serving." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=1000&q=80",
    rating: 4.95,
    reviewCount: 210,
    createdAt: "2024-01-20T09:00:00.000Z",
    updatedAt: "2024-02-14T16:20:00.000Z"
  },
  {
    id: "rec-thai-green-tofu-curry",
    title: "Fragrant Thai Green Coconut Tofu Curry",
    slug: "fragrant-thai-green-coconut-tofu-curry",
    description: "Crispy fried tofu cubes simmered in aromatic green curry paste, creamy coconut milk, baby bok choy, bell peppers, and fresh Thai basil over jasmine rice.",
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    totalTimeMinutes: 35,
    servings: 3,
    difficulty: "Medium",
    cuisine: "Thai",
    dietaryTags: ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Halal"],
    caloriesPerServing: 420,
    proteinGrams: 16.0,
    carbsGrams: 28.0,
    fatGrams: 27.0,
    ingredients: [
      { ingredientId: "ing-tofu", name: "Extra Firm Tofu (pressed & cubed)", amount: 1, unit: "block (400g)", category: "Produce" },
      { ingredientId: "ing-green-curry-paste", name: "Thai Green Curry Paste", amount: 3, unit: "tbsp", category: "Pantry" },
      { ingredientId: "ing-coconut-milk", name: "Full-Fat Coconut Milk", amount: 1, unit: "can (400ml)", category: "Pantry" },
      { ingredientId: "ing-bell-pepper", name: "Red Bell Pepper, sliced", amount: 1, unit: "pcs", category: "Produce" },
      { ingredientId: "ing-bok-choy", name: "Baby Bok Choy, halved", amount: 2, unit: "pcs", category: "Produce" },
      { ingredientId: "ing-tamari", name: "Gluten-Free Tamari (Soy Sauce)", amount: 2, unit: "tbsp", category: "Pantry" },
      { ingredientId: "ing-basil", name: "Fresh Thai Basil Leaves", amount: 0.5, unit: "cup", category: "Produce" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Press tofu to remove excess moisture, cut into bite-sized cubes, and pan-fry in oil until golden and crispy on all sides.", timerMinutes: 10 },
      { stepNumber: 2, instruction: "In a wok, sauté 2 tablespoons of green curry paste in coconut cream until fragrant and oil separates.", timerMinutes: 4 },
      { stepNumber: 3, instruction: "Pour in remaining coconut milk and tamari, bringing to a gentle simmer.", timerMinutes: 3 },
      { stepNumber: 4, instruction: "Add sliced bell peppers and baby bok choy, cooking for 5 minutes until tender-crisp.", timerMinutes: 5 },
      { stepNumber: 5, instruction: "Gently fold in crispy tofu and fresh Thai basil leaves. Serve hot over jasmine rice." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1000&q=80",
    rating: 4.7,
    reviewCount: 78,
    createdAt: "2024-01-22T11:00:00.000Z",
    updatedAt: "2024-02-01T09:30:00.000Z"
  },
  {
    id: "rec-lemon-herb-chicken",
    title: "Zesty Lemon Herb Grilled Chicken Skewers",
    slug: "zesty-lemon-herb-grilled-chicken-skewers",
    description: "Tender chicken breast chunks marinated in garlic, oregano, lemon zest, olive oil, and rosemary, grilled to smoky perfection with colorful bell peppers and red onion.",
    prepTimeMinutes: 20,
    cookTimeMinutes: 15,
    totalTimeMinutes: 35,
    servings: 4,
    difficulty: "Easy",
    cuisine: "Mediterranean",
    dietaryTags: ["Gluten-Free", "Dairy-Free", "Keto", "Low-Carb", "Halal"],
    caloriesPerServing: 360,
    proteinGrams: 42.0,
    carbsGrams: 6.0,
    fatGrams: 18.0,
    ingredients: [
      { ingredientId: "ing-chicken-breast", name: "Boneless Chicken Breasts, cubed", amount: 700, unit: "grams", category: "Meat" },
      { ingredientId: "ing-lemon-zest", name: "Lemon Zest & Juice", amount: 2, unit: "pcs", category: "Produce" },
      { ingredientId: "ing-garlic", name: "Garlic Cloves, minced", amount: 4, unit: "cloves", category: "Produce" },
      { ingredientId: "ing-oregano", name: "Dried Oregano", amount: 1.5, unit: "tsp", category: "Spices" },
      { ingredientId: "ing-olive-oil", name: "Extra Virgin Olive Oil", amount: 3, unit: "tbsp", category: "Pantry" },
      { ingredientId: "ing-peppers", name: "Bell Peppers & Red Onion for skewers", amount: 3, unit: "pcs", category: "Produce" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "In a bowl, mix olive oil, lemon juice, lemon zest, minced garlic, oregano, salt, and pepper to create the marinade.", timerMinutes: 5 },
      { stepNumber: 2, instruction: "Cut chicken breasts into 1.5-inch cubes and toss into marinade. Refrigerate for at least 30 minutes.", timerMinutes: 30 },
      { stepNumber: 3, instruction: "Thread marinated chicken alternately with bell peppers and red onion chunks onto skewers.", timerMinutes: 15 },
      { stepNumber: 4, instruction: "Preheat grill or grill pan to medium-high heat. Grill skewers for 12-15 minutes, turning frequently until chicken is charred and cooked through.", timerMinutes: 15 }
    ],
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80",
    rating: 4.85,
    reviewCount: 156,
    createdAt: "2024-01-25T14:00:00.000Z",
    updatedAt: "2024-02-15T11:00:00.000Z"
  },
  {
    id: "rec-berry-chia-parfait",
    title: "Vanilla Berry Chia Seed Breakfast Parfait",
    slug: "vanilla-berry-chia-seed-breakfast-parfait",
    description: "Layered organic chia pudding infused with vanilla bean and almond milk, topped with a vibrant compote of mixed wild berries and toasted coconut flakes.",
    prepTimeMinutes: 10,
    cookTimeMinutes: 0,
    totalTimeMinutes: 10,
    servings: 2,
    difficulty: "Easy",
    cuisine: "Modern Healthy",
    dietaryTags: ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Keto", "Halal"],
    caloriesPerServing: 290,
    proteinGrams: 9.0,
    carbsGrams: 24.0,
    fatGrams: 16.0,
    ingredients: [
      { ingredientId: "ing-chia", name: "Chia Seeds", amount: 0.5, unit: "cup", category: "Pantry" },
      { ingredientId: "ing-almond-milk", name: "Unsweetened Almond Milk", amount: 1.5, unit: "cups", category: "Dairy" },
      { ingredientId: "ing-vanilla", name: "Vanilla Bean Extract", amount: 1, unit: "tsp", category: "Pantry" },
      { ingredientId: "ing-maple", name: "Pure Maple Syrup", amount: 1, unit: "tbsp", category: "Pantry" },
      { ingredientId: "ing-berries", name: "Mixed Berries (Blueberries, Strawberries, Raspberries)", amount: 1, unit: "cup", category: "Produce" },
      { ingredientId: "ing-coconut", name: "Toasted Coconut Flakes", amount: 2, unit: "tbsp", category: "Bakery" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "In a mixing bowl, whisk chia seeds, almond milk, vanilla extract, and maple syrup together.", timerMinutes: 3 },
      { stepNumber: 2, instruction: "Let mixture sit for 10 minutes, whisk again to prevent clumping, then refrigerate for at least 2 hours or overnight until set.", timerMinutes: 120 },
      { stepNumber: 3, instruction: "In glasses, layer chilled vanilla chia pudding with fresh mixed berries.", timerMinutes: 5 },
      { stepNumber: 4, instruction: "Top with toasted coconut flakes and serve immediately." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1000&q=80",
    rating: 4.9,
    reviewCount: 112,
    createdAt: "2024-01-28T07:30:00.000Z",
    updatedAt: "2024-02-18T08:00:00.000Z"
  }
];

export const AVAILABLE_CHEF_CONSULTANTS = [
  {
    id: "chef-elena-rostova",
    name: "Chef Elena Rostova",
    specialty: "Plant-Based Mastery & Mediterranean Cuisine",
    avatarUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80",
    rating: 4.98,
    bio: "Former Executive Chef with 15 years in Michelin-starred Parisian kitchens, now passionate about vibrant plant-forward cooking."
  },
  {
    id: "chef-marcus-chen",
    name: "Chef Marcus Chen",
    specialty: "Asian Fusion, Spice Balancing & Quick Weeknight Dinners",
    avatarUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=300&q=80",
    rating: 4.92,
    bio: "Master of authentic Thai, Japanese, and modern fusion techniques. Loves helping home cooks master bold flavor profiles."
  },
  {
    id: "chef-sophia-vance",
    name: "Chef Sophia Vance",
    specialty: "Keto, Gluten-Free Baking & Nutritional Science",
    avatarUrl: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=300&q=80",
    rating: 4.95,
    bio: "Holistic nutritionist and pastry chef dedicated to making dietary restrictions taste like absolute luxury."
  }
];
```

---

## 👩‍💻 Summary for Developers
- All entity models are fully typed in TypeScript.
- State management supports real-time recipe discovery, faceted filtering (dietary tags + max cook time), automated grocery list aggregation with item check-off, and booking orchestration.
- Seed data provides instant out-of-the-box delight with stunning Unsplash imagery and robust nutritional values.

Let me know when you need component breakdown or state hook implementations!