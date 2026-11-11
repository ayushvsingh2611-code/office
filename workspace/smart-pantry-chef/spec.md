# 👑 Boa Hancock's Specification & Requirements Report: Smart Pantry Chef (`smart-pantry-chef`)

As the Requirements & Business Analyst (Hancock) of the Straw Hat Dev Crew, I have established the complete functional specification, user personas, user stories with unambiguous acceptance criteria, scope boundaries, non-functional requirements, and edge case enumerations for **Smart Pantry Chef**.

---

## 👤 User Personas

1. **Aria the Home Cook (Busy Parent):**
   * *Goal:* Quickly see what ingredients are expiring in her pantry and find quick dinner recipes that use up existing items without needing an extra grocery trip.
   * *Pain Points:* Forgetting what's in the back of the pantry, wasting food due to expired items, decision fatigue after work.
2. **Marcus the Meal Prepper (Fitness Enthusiast):**
   * *Goal:* Schedule weekly meals in advance based on strict dietary macros and preferences (e.g., Keto, Gluten-Free) and automatically generate a consolidated shopping list for missing items.
   * *Pain Points:* Disorganized meal planning, difficulty tracking missing ingredients across multiple recipes for the week.
3. **Chef Yuki (Dietary-Restricted Foodie):**
   * *Goal:* Filter recipes instantly by strict dietary requirements (Vegan, Halal, Nut-Free, Dairy-Free) and ensure 0% cross-contamination or allergen exposure.
   * *Pain Points:* Recipes listing hidden allergens or failing to respect dietary tags.

---

## 📐 Scope Boundaries

### In-Scope (Milestone 4 Prototype & Core Delivery)
* **Ingredients Inventory Tracker:** Full CRUD (Create, Read, Update, Delete) for pantry ingredients with name, category, quantity, unit of measurement, and expiration date. Expiration visual color-coding (Fresh, Expiring Soon / <3 days, Expired).
* **Recipe Suggestions Engine:** Smart matching algorithm comparing available inventory against recipe ingredient lists. Calculates match percentage (0% to 100%), highlights 100% matches, and lists missing ingredients.
* **Dietary Preference Filters:** Multi-select dietary filter pills (Vegan, Vegetarian, Gluten-Free, Keto, Dairy-Free, Nut-Free, Halal, Kosher) filtering recipe suggestions in real-time.
* **Meal Prep Calendar Scheduling Modal & Shopping List:** Interactive weekly calendar grid where users can drag/assign recipes to specific days/meal slots (Breakfast, Lunch, Dinner). Automatic aggregation of missing ingredients into a consolidated Shopping List.
* **Local Persistence:** LocalStorage persistence for inventory items, meal schedule, and user preferences so data survives page reloads.

### Out-of-Scope (Future Production / Post-MVP)
* Live cloud database synchronization and multi-user accounts / authentication.
* Computer vision receipt scanning or barcode scanning via mobile camera.
* Direct API integration with grocery delivery services (Instacart / Amazon Fresh checkout).

---

## 📝 User Stories & Acceptance Criteria

### Epic 1: Ingredients Inventory Tracker

#### US-1.1: Add New Pantry Ingredient
* **As a** home cook,
* **I want to** add a new ingredient with category, quantity, unit, and expiration date to my pantry inventory,
* **So that** I can keep an accurate track of what food items I have at home.
* **Acceptance Criteria:**
  * **Given** the user is on the Pantry Inventory tab, **When** they click "Add Ingredient" and fill in Name (required), Category (dropdown), Quantity (positive number), Unit (dropdown: pcs, g, kg, ml, l, cups, tbsp, tsp), and Expiration Date, **And** click Save, **Then** the item is added to the inventory list, persisted to LocalStorage, and displayed immediately with appropriate expiration status styling.
  * **Given** the user leaves the Name field blank or inputs a negative quantity, **When** they attempt to save, **Then** inline validation errors are displayed and the modal remains open.

#### US-1.2: Edit & Delete Inventory Items
* **As a** user,
* **I want to** update or remove existing pantry items when I consume them or restock,
* **So that** my inventory stays synchronized with reality.
* **Acceptance Criteria:**
  * **Given** an existing inventory item in the list, **When** the user clicks "Edit", updates the quantity, and saves, **Then** the item reflects the updated quantity and expiration date.
  * **Given** an existing inventory item, **When** the user clicks "Delete", **Then** a confirmation prompt appears; upon confirmation, the item is permanently removed from the inventory list and LocalStorage.

---

### Epic 2: Recipe Suggestions Engine

#### US-2.1: Smart Recipe Matching & Missing Ingredient Breakdown
* **As a** user with random pantry items,
* **I want to** see recipes ranked by how many available ingredients I already have,
* **So that** I can cook meals immediately or know exactly what single items I need to buy.
* **Acceptance Criteria:**
  * **Given** the user has added items to their pantry inventory, **When** they navigate to the "Recipe Suggestions" tab, **Then** recipes are displayed with a match percentage badge (e.g., "100% Match", "75% Match").
  * **Given** a recipe has missing ingredients, **When** viewed on the recipe card, **Then** available ingredients are marked with a green check and missing ingredients are highlighted in red/orange.

---

### Epic 3: Dietary Preference Filters

#### US-3.1: Filter Recipes by Dietary Restrictions
* **As a** dietary-conscious home cook,
* **I want to** filter recipe suggestions by dietary preferences (Vegan, Keto, Gluten-Free, etc.),
* **So that** I only see recipes that match my nutritional lifestyle.
* **Acceptance Criteria:**
  * **Given** the recipe suggestions view, **When** the user toggles dietary filter pills (e.g., "Vegan", "Gluten-Free"), **Then** the recipe list instantly filters to show only recipes tagged with all selected dietary preferences.
  * **Given** no recipes match the selected filters, **When** filtering is active, **Then** a friendly empty state message is displayed with a suggestion to reset filters.

---

### Epic 4: Meal Prep Calendar Scheduling & Shopping List

#### US-4.1: Schedule Recipes into Weekly Calendar & Generate Shopping List
* **As a** meal prepper,
* **I want to** schedule recipes into a weekly calendar grid and automatically generate a shopping list for missing ingredients,
* **So that** I can plan my week effortlessly and buy only what is missing.
* **Acceptance Criteria:**
  * **Given** the user views a recipe card, **When** they click "Schedule to Calendar", a modal opens allowing them to select a day of the week (Monday - Sunday) and meal slot (Breakfast, Lunch, Dinner).
  * **Given** the user has scheduled recipes for the week, **When** they open the "Shopping List" view, **Then** all missing ingredients across all scheduled recipes are consolidated into a categorized shopping list with quantities.

---

## ⚙️ Functional Requirements

1. **FR-01 (Inventory State Management):** The application must maintain reactive state for all inventory items, supporting add, edit, delete, and search/filter by category and expiration status.
2. **FR-02 (Recipe Matching Logic):** The matching algorithm must normalize ingredient names and units case-insensitively to calculate the precise overlap between pantry inventory and recipe requirements.
3. **FR-03 (Dietary Filtering):** The filter engine must support multi-criteria AND/OR filtering across dietary tags (`vegan`, `vegetarian`, `gluten-free`, `keto`, `dairy-free`, `nut-free`, `halal`, `kosher`).
4. **FR-04 (Calendar & Shopping List Aggregation):** The calendar scheduler must persist weekly slots in LocalStorage and dynamically compute the net missing grocery items by subtracting current pantry quantities from scheduled recipe requirements.

---

## 🛡️ Non-Functional Requirements

1. **NFR-01 (Performance):** Recipe matching and inventory filtering must render in under 100ms for datasets up to 200 pantry items and 50 recipes.
2. **NFR-02 (Accessibility - WCAG AA):** All interactive elements (modals, buttons, filter pills, form inputs) must have appropriate ARIA attributes, keyboard navigation support, and high-contrast color ratios.
3. **NFR-03 (Responsive Design):** The UI must be fully responsive and optimized for mobile phones (320px+), tablets, and desktop viewports using CSS Grid/Flexbox and Tailwind CSS.
4. **NFR-04 (Data Robustness):** LocalStorage read/write operations must include try/catch error boundaries and fallback defaults to prevent app crashes on quota exhaustion or corrupted JSON.

---

## ⚠️ Edge Cases & Boundary Conditions

1. **Empty Pantry Inventory:** When the inventory is empty, recipe suggestions should display all recipes with 0% match and prompt the user to add ingredients to unlock smart matching.
2. **Expired Ingredients:** Ingredients past their expiration date should be visually flagged in red with an "Expired" badge and excluded from recipe match calculations (or marked as unusable).
3. **Date Formats & Timezones:** Expiration date inputs (`YYYY-MM-DD`) must be evaluated against local calendar dates to avoid timezone offset discrepancies.
4. **Special Characters & Long Text:** Ingredient names or custom recipe titles exceeding container widths must truncate gracefully with tooltips or wrap cleanly without breaking grid layouts.
5. **Rapid Multi-Clicks:** Save and schedule buttons must include debounce/disabled states during async state updates to prevent duplicate entries.

---

*This completes the formal Specification & Requirements document for **Smart Pantry Chef** (Milestone 2).* 🏴‍☠️