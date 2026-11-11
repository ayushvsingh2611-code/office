# Requirements Specification: Smart Recipe Vault (`docs/requirements.md`)

**Author:** Hancock (Requirements & Business Analyst)  
**Project:** Smart Recipe Vault (`smart-recipe-vault`)  
**Status:** Approved for Development  

---

## 1. Executive Summary & Scope Boundaries

### 1.1 In-Scope (Prototype Milestones)
- **Recipe Discovery & Search:** Real-time keyword search across recipe titles, ingredients, and tags.
- **Advanced Filtering Engine:** Multi-select dietary filters (Vegan, Keto, Gluten-Free, Vegetarian, Paleo, Dairy-Free) and cook time maximum selectors (< 15 mins, < 30 mins, < 60 mins, Any).
- **Recipe Detail View:** Comprehensive ingredient list, step-by-step cooking instructions, nutritional breakdown (calories, protein, carbs, fat), and prep/cook times.
- **Interactive Grocery List Generator:** One-click aggregation of ingredients from selected recipes into a centralized grocery list, featuring category grouping (Produce, Pantry, Dairy, Meat), quantity scaling, item check-off/strike-through, and LocalStorage persistence.
- **Chef Consultation Booking Modal:** Interactive booking wizard allowing users to select a professional chef, pick a consultation date/time slot, specify cuisine preferences or dietary goals, and receive an instant booking confirmation state with reference code.
- **Responsive UI & Design System:** Modern, accessible Tailwind CSS layout optimized for mobile, tablet, and desktop viewports.

### 1.2 Out-of-Scope (Future Production Roadmap)
- Real payment gateway integration (Stripe/PayPal) for paid chef consultations.
- Live backend database (PostgreSQL/MongoDB) and user authentication (OAuth/JWT) — simulated via React state and LocalStorage for the prototype.
- Real-time video conferencing for chef consultations.
- Multi-language localization (i18n).

---

## 2. User Personas

1. **Home Cook (Sarah, 32):** Cooks dinner for family 5 nights a week. Wants quick recipe discovery (< 30 mins) and an automated grocery list so she doesn't forget ingredients at the supermarket.
2. **Busy Professional (Marcus, 27):** Follows a strict Keto diet with limited time. Needs rapid filtering for low-carb recipes and quick meals that fit his demanding schedule.
3. **Culinary Enthusiast (Elena, 45):** Loves experimenting with gourmet dishes and wants to book 1-on-1 virtual consultation sessions with professional chefs for specialized culinary techniques.

---

## 3. User Stories & Acceptance Criteria

### US-01: Recipe Discovery & Search
> **As a** Home Cook,  
> **I want to** search for recipes by keyword and view a responsive grid of rich recipe cards,  
> **So that** I can quickly find meal ideas based on ingredients I already have.

* **AC-01.1 (Search & Display):** Given the user opens the application, when they type keywords into the search bar, then the recipe grid updates in real-time to display matching recipes by title or ingredients.
* **AC-01.2 (Recipe Card Information):** Given a recipe card is rendered, it must display the recipe title, hero image, cook time, difficulty level, dietary badges, and a "View Recipe" action button.

### US-02: Advanced Dietary & Cook Time Filtering
> **As a** Busy Professional following a Keto diet,  
> **I want to** filter recipes by dietary preference (e.g. Keto, Vegan) and maximum cook time,  
> **So that** I only see meals that match my nutritional goals and time constraints.

* **AC-02.1 (Dietary Filter):** Given the filter panel is active, when the user selects one or more dietary filters (e.g., "Keto", "Gluten-Free"), then only recipes matching all selected dietary criteria are displayed.
* **AC-02.2 (Cook Time Filter):** Given the filter panel is active, when the user selects a cook time threshold (e.g., "< 30 mins"), then recipes with prep + cook time exceeding 30 minutes are filtered out.
* **AC-02.3 (Reset Filters):** Given filters are applied, when the user clicks "Clear Filters", then all filters reset to default ("All") and the complete recipe catalog is restored.

### US-03: Interactive Grocery List Generator
> **As a** Home Cook planning weekly meals,  
> **I want to** add recipe ingredients directly to an interactive grocery list and check off items as I shop,  
> **So that** I have a consolidated, organized shopping list that persists across browser sessions.

* **AC-03.1 (Add Ingredients):** Given a user views a recipe detail modal, when they click "Add Ingredients to Grocery List", then all ingredients from that recipe are automatically merged into the active grocery list without duplicates.
* **AC-03.2 (Check-off & Persistence):** Given items exist in the grocery list, when the user clicks an item checkbox, the item is struck through and marked completed, with state persisted in browser `localStorage`.
* **AC-03.3 (Clear / Delete):** Given items in the grocery list, when the user clicks "Clear Completed" or deletes an individual item, the list updates immediately.

### US-04: Chef Consultation Booking Modal
> **As a** Culinary Enthusiast,  
> **I want to** open a booking modal to schedule a 1-on-1 consultation with a professional chef,  
> **So that** I can get expert guidance on advanced cooking techniques and custom meal planning.

* **AC-04.1 (Booking Modal Trigger):** Given the user clicks "Book Chef Consultation" in the navigation or header, when clicked, a modal dialog opens with chef profiles, date picker, time slot selector, and custom notes textarea.
* **AC-04.2 (Form Validation):** Given the user submits the booking form, if required fields (Name, Email, Chef selection, Date, Time slot) are missing or invalid, then inline error messages are displayed and submission is blocked.
* **AC-04.3 (Confirmation State):** Given valid booking details are submitted, when the user clicks "Confirm Booking", then a success state appears displaying a booking reference ID (e.g., `#SCF-8492`) and summary details.

---

## 4. Non-Functional Requirements (NFR)

- **Performance:** Initial page load time under 1.5 seconds; recipe filter and search response time under 100ms.
- **Accessibility (a11y):** WCAG 2.1 AA compliance for color contrast, keyboard navigation support for all modals and buttons, and appropriate `aria-*` attributes on interactive components.
- **Responsiveness:** Fluid adaptation across mobile viewports (320px+), tablets (768px+), and desktop screens (1024px+).
- **Reliability & Error Boundaries:** Graceful error handling for missing images, empty search states, and malformed LocalStorage data.

---

## 5. Edge Cases & Boundary Conditions

1. **Empty Search / Zero Filter Matches:** When search query or filters return zero recipes, display a clean empty state component ("No recipes found matching your criteria") with a "Reset Filters" action button.
2. **Rapid Multi-Clicks on Add to Grocery List:** Prevent duplicate ingredient spamming when users rapidly click "Add to Grocery List" multiple times.
3. **Long Text Overflow:** Recipe titles and long ingredient descriptions must wrap cleanly using CSS flex/grid and truncation (`truncate` or `line-clamp`) where appropriate to prevent layout breaking.
4. **Invalid Input Formats in Chef Booking:** Email validation checking for valid RFC 5322 format; date picker restricting past dates.
5. **LocalStorage Quota / Corruption:** Fallback to in-memory default state if `localStorage` is disabled or contains corrupted JSON data.
