# ☕ Nami’s Architectural Blueprint: Coffee Selling Platform ("Panda Brew Hub")

**Role:** Nami (Group 1 - System & Data Architect)  
**Task:** Task A Architecture & Contract Design  
**Target Application:** Coffee Selling Platform with working buy, add to cart, cart management, checkout workflow, and checkout details verification.  
**Resolved Skills Integrated:** 
- `DATABASE-SCHEMA-MODELING` (Entity relations, validation rules, realistic mock seed data & LocalStorage persistence)
- `API-AND-INTERFACE-DESIGN` (RESTful contracts, mock fallback resilience, payload typing)
- `VSCODE-EXTENSION-BUILDER` / `FRONTEND-SLIDES` design patterns (Clean, modular component contracts, event-driven DOM handling for Zoro/Builder)

---

## 1. System Architecture & Component Contract Overview

This document provides the exact specifications, DOM IDs, data schemas, state management structures, and interaction contracts for **Zoro (Builder)** to implement the fully interactive Coffee Selling Platform ("Panda Brew Hub").

```
┌─────────────────────────────────────────────────────────────┐
│                 Panda Brew Hub Architecture                 │
├─────────────────────────────────────────────────────────────┤
│  [ Header Navbar ] ──► Search, Category Filter, Cart Badge  │
├─────────────────────────────────────────────────────────────┤
│  [ Catalog Grid ]  ──► Coffee Cards (Buy Now / Add to Cart) │
├─────────────────────────────────────────────────────────────┤
│  [ Cart Drawer ]   ──► Item Quantities, Subtotal, Checkout  │
├─────────────────────────────────────────────────────────────┤
│  [ Checkout Modal ]──► Shipping Details, Payment, Success   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Database Schema & Data Models

### 2.1 Entity Relationship Definitions

#### Entity 1: `CoffeeItem` (Product)
- `id` (`string`, UUID or slug): Unique identifier (e.g., `coffee-ethiopian-yirgacheffe`)
- `name` (`string`): Display name of the coffee blend
- `category` (`string`): Enum (`Single Origin`, `Espresso Roast`, `Cold Brew`, `Flavored`, `Decaf`)
- `price` (`number`): Price in USD (2 decimal precision, e.g., `18.50`)
- `rating` (`number`): Average customer rating out of 5.0 (e.g., `4.8`)
- `reviewsCount` (`number`): Total review count (e.g., `124`)
- `origin` (`string`): Geographic source (e.g., `Yirgacheffe, Ethiopia`)
- `roastLevel` (`string`): Enum (`Light`, `Medium`, `Medium-Dark`, `Dark`)
- `flavorNotes` (`array of strings`): Tasting notes (e.g., `["Jasmine", "Bergamot", "Lemon"]`)
- `weight` (`string`): Package size (e.g., `340g / 12oz`)
- `imageUrl` (`string`): Unsplash high-res coffee image URL
- `inStock` (`boolean`): Availability flag (`true` / `false`)
- `createdAt` (`string`, ISO-8601): Record creation timestamp

#### Entity 2: `CartItem`
- `cartItemId` (`string`): Unique composite key (`coffeeId-grindType`)
- `coffeeId` (`string`): Foreign key to `CoffeeItem.id`
- `name` (`string`): Cached coffee name
- `price` (`number`): Cached unit price
- `imageUrl` (`string`): Cached thumbnail URL
- `grindType` (`string`): Selected grind (`Whole Bean`, `Espresso`, `Drip / Filter`, `French Press`, `Cold Brew`)
- `quantity` (`number`): Quantity selected (integer $\ge 1$)

#### Entity 3: `Order` (Checkout Details)
- `orderId` (`string`): Unique order number (e.g., `PBH-849201`)
- `customer` (`object`):
  - `fullName` (`string`)
  - `email` (`string`, validated regex)
  - `phone` (`string`)
  - `address` (`string`)
  - `city` (`string`)
  - `postalCode` (`string`)
  - `country` (`string`)
- `items` (`array of CartItem`): Ordered products
- `paymentMethod` (`string`): Enum (`Credit Card`, `Apple Pay`, `Cash on Delivery`)
- `subtotal` (`number`)
- `shippingFee` (`number`, e.g., `4.99` or `0.00` for free shipping > $50)
- `tax` (`number`, e.g., calculated 8%)
- `totalAmount` (`number`)
- `status` (`string`): Enum (`Pending`, `Processing`, `Out for Delivery`, `Delivered`)
- `createdAt` (`string`, ISO-8601): Order timestamp

---

### 2.2 Validation & Integrity Rules

1. **Email Validation:** `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
2. **Phone Validation:** `/^\+?[\d\s\-()]{10,15}$/`
3. **Postal Code:** `/^\d{5,6}(-\d{4})?$/`
4. **Quantity Range:** $1 \le \text{quantity} \le 99$
5. **Price Range:** $\text{price} > 0$

---

### 2.3 Realistic Mock Seed Data (`coffees.json`)

```json
[
  {
    "id": "ethiopian-yirgacheffe",
    "name": "Ethiopian Yirgacheffe Organic",
    "category": "Single Origin",
    "price": 18.50,
    "rating": 4.9,
    "reviewsCount": 142,
    "origin": "Yirgacheffe, Ethiopia",
    "roastLevel": "Light",
    "flavorNotes": ["Jasmine", "Bergamot", "Wild Blueberry"],
    "weight": "340g / 12oz",
    "imageUrl": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?au,
  {
    "id": "midnight-espresso",
    "name": "Midnight Velvet Espresso Roast",
    "category": "Espresso Roast",
    "price": 17.50,
    "rating": 4.9,
    "reviewsCount": 318,
    "origin": "Blend of Sumatra & Guatemala",
    "roastLevel": "Dark",
    "flavorNotes": ["Dark Chocolate", "Molasses", "Smoky Cedar"],
    "weight": "454g / 16oz",
    "imageUrl": "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?au,
  {
    "id": "sumatra-mandheling",
    "name": "Sumatra Mandheling Dark",
    "category": "Single Origin",
    "price": 18.00,
    "rating": 4.8,
    "reviewsCount": 164,
    "origin": "Aceh, Sumatra",
    "roastLevel": "Dark",
    "flavorNotes": ["Earthy", "Cider", "Dark Caramel"],
    "weight": "340g / 12oz",
    "imageUrl": "https://images.unsplash.com/photo-1511920170033-f8396924c348?au,
  {
    "id": "vanilla-hazelnut-dream",
    "name": "French Vanilla Hazelnut Infusion",
    "category": "Flavored",
    "price": 16.50,
    "rating": 4.6,
    "reviewsCount": 112,
    "origin": "Brazil Santos",
    "roastLevel": "Medium",
    "flavorNotes": ["Toasted Hazelnut", "Creamy Vanilla", "Praline"],
    "weight": "340g / 12oz",
    "imageUrl": "https://images.unsplash.com/photo-1541167760496-1628856ab772?au
]
```

---

## 3. State Management Structure & LocalStorage Schema

The application maintains reactive state stored in memory and persisted to browser `localStorage`.

### LocalStorage Keys
- `pandabrew_cart`: JSON string of `CartItem[]`
- `pandabrew_orders`: JSON string of `Order[]`
- `pandabrew_user_prefs`: JSON string of user preferences (search filters, currency)

### State Store Object (`appState`)
```javascript
const appState = {
  coffees: [], // Loaded from seed/API
  cart: [],    // Array of CartItem
  filters: {
    search: "",
    category: "All",
    roast: "All"
  },
  isCartOpen: false,
  isCheckoutOpen: false,
  activeOrder: null
};
```

---

## 4. API & Interface Contracts (Mock Services with Offline Resilience)

### 4.1 RESTful Mock Service Layer (`apiService.js`)

```javascript
/**
 * Panda Brew Hub API Service with built-in mock latency and offline fallbacks.
 */
class ApiService {
  constructor() {
    this.latency = 300; // Simulated network delay in ms
  }

  async getCoffees() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Fallback to embedded seed if fetch fails
        resolve(window.SEED_COFFEES || []);
      }, this.latency);
    });
  }

  async submitOrder(orderData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!orderData.customer || !orderData.items.length) {
          reject(new Error("Invalid order payload: Missing customer or items."));
          return;
        }
        const orderId = `PBH-${Math.floor(100000 + Math.random() * 900000)}`;
        const confirmedOrder = {
          orderId,
          ...orderData,
          status: "Processing",
          createdAt: new Date().toISOString()
        };
        
        // Persist to LocalStorage orders
        const existingOrders = JSON.parse(localStorage.getItem("pandabrew_orders") || "[]");
        existingOrders.unshift(confirmedOrder);
        localStorage.setItem("pandabrew_orders", JSON.stringify(existingOrders));

        resolve(confirmedOrder);
      }, this.latency * 2);
    });
  }
}
```

---

## 5. Exact DOM IDs & Element Contracts for Zoro (Builder)

Zoro must implement the following DOM element IDs and classes so event listeners and state binders connect correctly.

### 5.1 Navigation & Header
- `id="search-input"` (`input[type="text"]`): Real-time coffee search input.
- `id="category-filter"` (`select` or tab container): Category selector (`All`, `Single Origin`, `Espresso Roast`, `Cold Brew`, `Flavored`, `Decaf`).
- `id="cart-btn"` (`button`): Opens the slide-over cart drawer.
- `id="cart-badge"` (`span`): Displays total quantity of items in cart.

### 5.2 Coffee Catalog Section
- `id="coffee-grid"` (`div`): Container where coffee cards are dynamically rendered.
- **Card Structure inside Grid:**
  - `data-id="{coffeeId}"` attribute on card wrapper.
  - `class="buy-now-btn"`: Triggers direct buy action (adds to cart & opens checkout instantly).
  - `class="add-to-cart-btn"`: Adds item to cart with animation and badge count update.
  - `class="grind-select"` (`select`): Allows user to choose grind type before adding.

### 5.3 Cart Drawer
- `id="cart-drawer"` (`div`): Slide-over container (`class="translate-x-full"` when closed, `class="translate-x-0"` when open).
- `id="close-cart-btn"` (`button`): Closes cart drawer.
- `id="cart-items-container"` (`div`): List of items currently in cart.
- `id="cart-subtotal"` (`span`): Subtotal price display ($).
- `id="cart-shipping"` (`span`): Shipping fee display ($).
- `id="cart-total"` (`span`): Grand total display ($).
- `id="checkout-btn"` (`button`): Transitions from cart to Checkout Modal.
- `id="empty-cart-message"` (`div`): Shown when cart is empty.

### 5.4 Checkout Modal / View
- `id="checkout-modal"` (`div`): Modal overlay (`hidden` by default).
- `id="close-checkout-btn"` (`button`): Closes checkout.
- `id="checkout-form"` (`form`): Form containing customer shipping & payment inputs:
  - `id="shipping-name"` (`input[type="text"]`, required)
  - `id="shipping-email"` (`input[type="email"]`, required)
  - `id="shipping-phone"` (`input[type="tel"]`, required)
  - `id="shipping-address"` (`textarea` or `input`, required)
  - `id="shipping-city"` (`input[type="text"]`, required)
  - `id="shipping-zip"` (`input[type="text"]`, required)
  - `id="payment-method"` (`select` or radio group: Credit Card, Apple Pay, Cash on Delivery)
- `id="order-summary-list"` (`div`): Summary of items being purchased in checkout.
- `id="place-order-btn"` (`button[type="submit"]`): Submits order.

### 5.5 Order Success Confirmation Modal
- `id="success-modal"` (`div`): Success celebration modal (`hidden` by default).
- `id="success-order-id"` (`span`): Displays generated order ID (e.g., `PBH-948210`).
- `id="success-customer-name"` (`span`): Greets the customer.
- `id="close-success-btn"` (`button`): Resets app state and closes modal.

---

## 6. Zoro Implementation Blueprint & Execution Flow

1. **Initialization:** On `DOMContentLoaded`, load seed data into `appState.coffees`, load cart from `localStorage`, and render catalog grid and cart badge.
2. **Event Delegation:** Attach listeners to `#coffee-grid` for `.add-to-cart-btn` and `.buy-now-btn`.
3. **Cart Operations:** 
   - `addToCart(coffeeId, grindType)`: Checks if item + grind exists in cart; if so, increments quantity; else pushes new `CartItem`. Updates `localStorage` and re-renders cart drawer + badge.
   - `updateQuantity(cartItemId, delta)`: Increments/decrements quantity. Removes item if quantity reaches 0.
4. **Checkout Workflow:**
   - Clicking `#checkout-btn` closes the cart drawer and opens `#checkout-modal`, populating `#order-summary-list`.
   - Submitting `#checkout-form` runs validation rules. If valid, calls `ApiService.submitOrder()`, clears the cart, and opens `#success-modal` with the order confirmation details.

---
*Nami (System & Data Architect) signing off. Blueprint complete and ready for Zoro (Builder).*