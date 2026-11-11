# System & Data Architecture Specification
## Project: Samsung & Electronics Flagship Store
**Architect:** Robin (Group 2 - Architect)  
**Builder:** Shanks (Group 2 - Builder)  
**Target:** Interactive High-End E-Commerce Web Application

---

## 1. Architectural Overview & Design System

The application represents an ultra-modern, Samsung-inspired digital flagship store ("Samsung Galaxy & Bespoke Electronics"). It features dark/light mode theming (Samsung One UI aesthetic), dynamic product filtering and search, product detail modal with interactive color and storage options, interactive trade-in value estimator, persistent cart drawer with coupon validation, wishlist management, multi-step checkout with Samsung Pay simulation, and printable order confirmation receipts.

### 1.1 Technology Stack & Conventions
- **Structure:** Semantic HTML5 with explicit DOM element IDs.
- **Styling:** Tailwind CSS (via CDN) + Custom Samsung-styled CSS (accents: Samsung Blue `#0381FE`, Deep Onyx `#0a0a0a`, Titanium Gray `#71717a`, Neon Glow effects).
- **Icons:** Lucide Icons (or FontAwesome 6 CDN) for crisp tech icons.
- **State Management:** Reactive JavaScript state store pattern with `localStorage` persistence for Cart, Wishlist, Theme, and Trade-in discounts.

---

## 2. Shared DOM Elements Contract (Exact IDs)

All IDs listed below must be implemented with exact character casing across `index.html` and `app.js`.

### 2.1 Navigation & Global Header
| Element ID | HTML Tag | Description / Role |
| :--- | :--- | :--- |
| `navbar-header` | `<header>` | Fixed top navigation bar |
| `brand-logo` | `<a>` or `<div>` | Samsung brand logo linking to home |
| `nav-search-input` | `<input>` | Top bar live search input field |
| `nav-search-btn` | `<button>` | Search icon trigger button |
| `nav-clear-search-btn` | `<button>` | Button to clear search input |
| `theme-toggle-btn` | `<button>` | Dark/Light mode switcher |
| `wishlist-toggle-btn` | `<button>` | Opens the wishlist slide-over drawer |
| `wishlist-badge-count`| `<span>` | Numeric indicator of items in wishlist |
| `cart-toggle-btn` | `<button>` | Opens the cart slide-over drawer |
| `cart-badge-count` | `<span>` | Numeric indicator of items in cart |

### 2.2 Hero Showcase Carousel
| Element ID | HTML Tag | Description / Role |
| :--- | :--- | :--- |
| `hero-banner-section` | `<section>` | Featured hero carousel container |
| `hero-slide-container`| `<div>` | Dynamic container rendering current slide |
| `hero-prev-btn` | `<button>` | Previous slide navigation button |
| `hero-next-btn` | `<button>` | Next slide navigation button |
| `hero-dots-container` | `<div>` | Dot pagination indicators |
| `hero-cta-btn` | `<button>` | Primary CTA (e.g., "Pre-Order S24 Ultra") |

### 2.3 Catalog Filtering, Sorting & Search Controls
| Element ID | HTML Tag | Description / Role |
| :--- | :--- | :--- |
| `category-tabs-container`| `<div>` | Container for category pills / tabs |
| `search-filter-input` | `<input>` | In-catalog secondary filter input |
| `sort-dropdown-select` | `<select>` | Sorting select (`featured`, `price-low`, `price-high`, `rating`, `newest`) |
| `price-filter-range` | `<input type="range">` | Max price slider input |
| `price-range-display` | `<span>` | Displays formatted current slider value ($0 - $X) |
| `filter-galaxy-ai-checkbox` | `<input type="checkbox">` | Filter toggle for Galaxy AI enabled items |
| `filter-in-stock-checkbox` | `<input type="checkbox">` | Filter toggle for in-stock items |
| `reset-filters-btn` | `<button>` | Resets all filter criteria to default |
| `active-filters-summary` | `<div>` | Container showing active filter tags with dismiss buttons |
| `product-count-display`| `<span>` | Total visible products matching criteria |

### 2.4 Product Grid & Empty State
| Element ID | HTML Tag | Description / Role |
| :--- | :--- | :--- |
| `product-grid-container` | `<div>` | Responsive grid container for product cards |
| `product-empty-state` | `<div>` | Shown when no products match filters |
| `empty-state-reset-btn` | `<button>` | Action button within empty state to clear filters |

### 2.5 Quick View & Product Detail Modal
| Element ID | HTML Tag | Description / Role |
| :--- | :--- | :--- |
| `quickview-modal` | `<div>` | Root modal wrapper for Quick View |
| `quickview-backdrop` | `<div>` | Dark overlay background |
| `quickview-close-btn` | `<button>` | Modal close button (X) |
| `quickview-badge-tag` | `<span>` | Badge tag (e.g., "Galaxy AI", "New") |
| `quickview-category-badge`| `<span>` | Category label |
| `quickview-title` | `<h3>` | Product full name heading |
| `quickview-rating-stars` | `<div>` | Star rating visual |
| `quickview-rating-score` | `<span>` | Numeric rating (e.g. 4.9) |
| `quickview-reviews-count`| `<span>` | Total reviews count string |
| `quickview-price-current` | `<span>` | Current calculated price |
| `quickview-price-original`| `<span>` | Strikethrough original MSRP price |
| `quickview-savings-badge`| `<span>` | Displays dollar or percentage discount |
| `quickview-main-image` | `<img>` | Main featured product preview image |
| `quickview-thumbnails-container` | `<div>` | Thumbnail gallery list |
| `quickview-color-options` | `<div>` | Swatch buttons container for color selection |
| `quickview-color-label` | `<span>` | Selected color name label |
| `quickview-storage-options` | `<div>` | Tier buttons container (128GB, 256GB, 512GB, 1TB) |
| `quickview-specs-list` | `<ul>` | Key specifications bullet list |
| `quickview-qty-decrease-btn` | `<button>` | Decrement quantity button |
| `quickview-quantity-input` | `<input>` | Number input for quantity |
| `quickview-qty-increase-btn` | `<button>` | Increment quantity button |
| `quickview-add-cart-btn` | `<button>` | Primary Add to Cart action button |
| `quickview-add-wishlist-btn` | `<button>` | Add to Wishlist toggle button |

### 2.6 Samsung Ecosystem Trade-In Estimator Widget
| Element ID | HTML Tag | Description / Role |
| :--- | :--- | :--- |
| `tradein-widget-section` | `<section>` | Trade-in promo banner/card section |
| `tradein-device-category` | `<select>` | Category select (Phone, Tablet, Watch, TV) |
| `tradein-device-brand` | `<select>` | Brand select (Samsung, Apple, Google, Other) |
| `tradein-device-model` | `<select>` | Device model select |
| `tradein-device-condition`| `<select>` | Condition select (`Good`, `Flawless`, `Cracked`) |
| `tradein-estimated-value` | `<span>` | Calculated trade-in rebate estimate ($0 - $800) |
| `tradein-apply-discount-btn` | `<button>` | Applies estimated discount into cart session |
| `tradein-status-message` | `<p>` | Feedback message on discount application |

### 2.7 Cart Slide-over Drawer
| Element ID | HTML Tag | Description / Role |
| :--- | :--- | :--- |
| `cart-drawer` | `<div>` | Slide-over drawer container |
| `cart-drawer-backdrop` | `<div>` | Drawer backdrop overlay |
| `cart-drawer-close-btn` | `<button>` | Close button for cart drawer |
| `cart-items-container` | `<div>` | Scrollable container for cart item rows |
| `cart-empty-state` | `<div>` | Message and icon shown when cart is empty |
| `cart-empty-shop-btn` | `<button>` | CTA in empty cart to explore catalog |
| `cart-coupon-input` | `<input>` | Promo voucher text field |
| `cart-coupon-apply-btn` | `<button>` | Voucher apply button |
| `cart-coupon-message` | `<p>` | Validation feedback for coupon code |
| `cart-summary-subtotal`| `<span>` | Subtotal price display |
| `cart-summary-discount`| `<span>` | Promotional coupon discount deduction |
| `cart-summary-tradein` | `<span>` | Trade-in discount deduction |
| `cart-summary-tax` | `<span>` | Estimated sales tax display |
| `cart-summary-shipping`| `<span>` | Shipping fee (`FREE` or calculated amount) |
| `cart-summary-total` | `<span>` | Final total amount |
| `cart-clear-all-btn` | `<button>` | Clears all items from cart |
| `cart-checkout-proceed-btn` | `<button>` | Proceeds to checkout modal |

### 2.8 Wishlist Slide-over Drawer
| Element ID | HTML Tag | Description / Role |
| :--- | :--- | :--- |
| `wishlist-drawer` | `<div>` | Slide-over drawer container for wishlist |
| `wishlist-drawer-backdrop`| `<div>` | Drawer backdrop overlay |
| `wishlist-drawer-close-btn`| `<button>` | Close button for wishlist drawer |
| `wishlist-items-container` | `<div>` | Container rendering wishlisted items |
| `wishlist-empty-state` | `<div>` | Shown when wishlist is empty |
| `wishlist-move-all-cart-btn` | `<button>` | Transfers all items to active cart |

### 2.9 Checkout & Payment Simulation Modal
| Element ID | HTML Tag | Description / Role |
| :--- | :--- | :--- |
| `checkout-modal` | `<div>` | Checkout container modal |
| `checkout-modal-backdrop` | `<div>` | Modal backdrop overlay |
| `checkout-modal-close-btn` | `<button>` | Modal dismiss button |
| `checkout-form` | `<form>` | Checkout data form |
| `checkout-first-name` | `<input>` | Customer first name |
| `checkout-last-name` | `<input>` | Customer last name |
| `checkout-email` | `<input>` | Contact email address |
| `checkout-phone` | `<input>` | Contact phone number |
| `checkout-address` | `<input>` | Shipping street address |
| `checkout-city` | `<input>` | Shipping city |
| `checkout-zip` | `<input>` | Postal code |
| `checkout-payment-samsungpay-btn` | `<button>` | Payment method radio/pill: Samsung Pay |
| `checkout-payment-card-btn` | `<button>` | Payment method radio/pill: Credit Card |
| `checkout-payment-card-fields` | `<div>` | Container for card inputs (shown if Card chosen) |
| `checkout-card-number` | `<input>` | Credit card number field |
| `checkout-card-expiry` | `<input>` | MM/YY expiry field |
| `checkout-card-cvv` | `<input>` | CVV security code |
| `checkout-order-summary-list` | `<div>` | Compact summary of items being purchased |
| `checkout-final-subtotal` | `<span>` | Summary subtotal |
| `checkout-final-discount` | `<span>` | Summary discount |
| `checkout-final-total` | `<span>` | Final charged price |
| `checkout-submit-btn` | `<button>` | "Pay with Samsung Pay" or "Place Order" button |

### 2.10 Order Confirmation Receipt Modal
| Element ID | HTML Tag | Description / Role |
| :--- | :--- | :--- |
| `order-success-modal` | `<div>` | Order confirmation modal |
| `order-success-backdrop` | `<div>` | Backdrop overlay |
| `order-success-close-btn`| `<button>` | Close button |
| `order-receipt-id` | `<span>` | Unique order confirmation reference (e.g. `SM-9834102`) |
| `order-receipt-date` | `<span>` | Date & timestamp of order |
| `order-receipt-customer-name` | `<span>` | Customer full name |
| `order-receipt-shipping-address`| `<span>` | Delivery destination |
| `order-receipt-payment-method` | `<span>` | Selected payment type |
| `order-receipt-items-list` | `<div>` | Itemized receipt entries |
| `order-receipt-total` | `<span>` | Paid total amount |
| `order-receipt-print-btn`| `<button>` | Triggers `window.print()` for receipt |
| `order-continue-shopping-btn` | `<button>` | Resets store view and closes modal |

### 2.11 Interactive Toast Notification System
| Element ID | HTML Tag | Description / Role |
| :--- | :--- | :--- |
| `toast-notification-container` | `<div>` | Fixed container (bottom-right / top-right) for toasts |

---

## 3. Data Structures & Schema Specification

### 3.1 Product Object (`Product`)
```typescript
interface ProductOptionColor {
  name: string;        // e.g. "Titanium Gray", "Onyx Black", "Amber Yellow"
  hex: string;         // e.g. "#4E4E50", "#1E1E1E", "#D8C596"
  image: string;       // Image URL representing this color variant
}

interface ProductOptionStorage {
  size: string;        // e.g. "256GB", "512GB", "1TB", or "65-Inch", "75-Inch"
  priceDelta: number;  // Additional price addition (e.g. 0, 150, 300)
}

interface Product {
  id: string;                      // e.g. "prod-s24-ultra"
  name: string;                    // e.g. "Galaxy S24 Ultra"
  category: "smartphones" | "tablets-laptops" | "tvs-audio" | "wearables" | "appliances" | "accessories";
  categoryLabel: string;           // e.g. "Smartphones"
  basePrice: number;               // Regular selling price (e.g. 1299.99)
  originalPrice: number;           // MSRP comparison price (e.g. 1419.99)
  rating: number;                  // Average rating (e.g. 4.9)
  reviewsCount: number;            // Total reviews (e.g. 1420)
  badge: string | null;            // e.g. "Galaxy AI", "Best Seller", "New", "Save $200"
  hasGalaxyAI: boolean;            // Galaxy AI ecosystem flag
  inStock: boolean;                // Stock availability flag
  primaryImage: string;            // Default hero image
  galleryImages: string[];         // Image array for quickview carousel
  colors: ProductOptionColor[];    // Available color variants
  storages: ProductOptionStorage[];// Available storage/dimension variants
  specs: string[];                 // List of 3-5 technical highlight specs
  description: string;             // Detailed marketing product copy
}
```

### 3.2 Product Catalog Seed Data Contract
The catalog must contain at least 10 high-profile Samsung items across all categories:
1. `prod-s24-ultra`: Galaxy S24 Ultra (Category: `smartphones`, Galaxy AI: true)
2. `prod-z-fold5`: Galaxy Z Fold5 (Category: `smartphones`, Galaxy AI: true)
3. `prod-z-flip5`: Galaxy Z Flip5 (Category: `smartphones`, Galaxy AI: true)
4. `prod-book4-ultra`: Galaxy Book4 Ultra (Category: `tablets-laptops`, Galaxy AI: true)
5. `prod-tab-s9-ultra`: Galaxy Tab S9 Ultra (Category: `tablets-laptops`, Galaxy AI: true)
6. `prod-neo-qled-8k`: 75" Neo QLED 8K QN900D (Category: `tvs-audio`, Galaxy AI: true)
7. `prod-the-frame-tv`: 65" The Frame QLED 4K (Category: `tvs-audio`, Galaxy AI: false)
8. `prod-watch6-classic`: Galaxy Watch6 Classic (Category: `wearables`, Galaxy AI: false)
9. `prod-buds2-pro`: Galaxy Buds2 Pro (Category: `wearables`, Galaxy AI: false)
10. `prod-bespoke-fridge`: Bespoke 4-Door Flex AI Refrigerator (Category: `appliances`, Galaxy AI: true)
11. `prod-bespoke-ai-laundry`: Bespoke AI Laundry Hub (Category: `appliances`, Galaxy AI: true)
12. `prod-smarttag2`: Galaxy SmartTag2 4-Pack (Category: `accessories`, Galaxy AI: false)

### 3.3 Cart Item Object (`CartItem`)
```typescript
interface CartItem {
  cartItemId: string;       // Unique composite key: `${productId}-${selectedColor}-${selectedStorage}`
  productId: string;        // Refers to Product.id
  name: string;             // Snapshot product name
  selectedColor: string;    // Name of chosen color variant
  selectedStorage: string;  // Chosen storage or size option
  unitPrice: number;        // basePrice + storage.priceDelta
  quantity: number;         // Count of items (>= 1)
  image: string;            // Variant image URL
}
```

### 3.4 Wishlist Item Object (`WishlistItem`)
```typescript
interface WishlistItem {
  productId: string;
  name: string;
  basePrice: number;
  originalPrice: number;
  image: string;
  category: string;
  inStock: boolean;
  addedAt: number;          // Timestamp (Date.now())
}
```

### 3.5 Global State Model (`AppState`)
```typescript
interface AppState {
  theme: "dark" | "light";
  activeCategory: string;             // "all" | category slug
  searchQuery: string;               // Live query filter
  sortBy: "featured" | "price-low" | "price-high" | "rating" | "newest";
  maxPriceFilter: number;            // Current upper bound filter
  filterGalaxyAIOnly: boolean;       // Filter boolean
  filterInStockOnly: boolean;        // Filter boolean
  
  cart: CartItem[];                  // List of cart items
  couponCode: string | null;         // Validated promo code
  couponDiscountPercentage: number;  // e.g. 10 for 10% off
  tradeInCredit: number;             // Deductible trade-in amount
  
  wishlist: WishlistItem[];          // List of wishlisted products
  
  activeQuickViewProduct: Product | null;
  quickViewSelectedColor: string | null;
  quickViewSelectedStorage: string | null;
  quickViewQuantity: number;
  
  heroActiveIndex: number;           // Carousel index
}
```

### 3.6 Promotional Coupons Contract
- `GALAXYAI`: 15% discount on total cart
- `SAMSUNG10`: 10% discount on total cart
- `EPP2025`: 20% Samsung employee & partner discount
- Any invalid input displays error message: `"Invalid promo code. Try 'GALAXYAI' or 'SAMSUNG10'"`

### 3.7 Trade-in Matrix Contract
- **Phone**:
  - `Galaxy S23 Ultra` -> Flawless: $650 | Good: $500 | Cracked: $250
  - `Galaxy S22 Ultra` -> Flawless: $450 | Good: $350 | Cracked: $150
  - `iPhone 15 Pro`    -> Flawless: $700 | Good: $550 | Cracked: $300
  - `iPhone 14 Pro`    -> Flawless: $500 | Good: $400 | Cracked: $200
- **Tablet**:
  - `Galaxy Tab S8`    -> Flawless: $350 | Good: $250 | Cracked: $100
  - `iPad Pro 11"`     -> Flawless: $400 | Good: $300 | Cracked: $120
- **Watch**:
  - `Galaxy Watch 5`   -> Flawless: $150 | Good: $100 | Cracked: $40
  - `Apple Watch S8`   -> Flawless: $180 | Good: $120 | Cracked: $50

---

## 4. Event Handler Signatures & Workflow Contract

Builder (Shanks) must implement the following core controller functions with exact logic flow:

### 4.1 Filter & Catalog Pipeline
- `initCatalog(): void`
  - Reads products array, establishes category pills dynamically into `#category-tabs-container`, and executes `renderProducts()`.
- `filterAndSortProducts(): Product[]`
  - Applies filters: Category match, search string against `name` & `description`, `price <= state.maxPriceFilter`, `hasGalaxyAI` flag if active, `inStock` if active.
  - Sorts by selected criteria.
  - Updates `#product-count-display`.
- `renderProducts(): void`
  - Renders filtered products inside `#product-grid-container`.
  - Toggles `#product-empty-state` visibility if result count is 0.

### 4.2 Quick View Controller
- `openQuickView(productId: string): void`
  - Finds product by ID, binds attributes to `#quickview-title`, `#quickview-price-current`, `#quickview-specs-list`, etc.
  - Sets initial color swatch and storage option.
  - Removes `hidden` / adds active classes to `#quickview-modal`.
- `closeQuickView(): void`
  - Hides `#quickview-modal`.
- `selectQuickViewColor(colorName: string): void`
  - Updates active color swatch UI, updates `#quickview-color-label`, and switches main hero image.
- `selectQuickViewStorage(storageSize: string): void`
  - Updates active storage UI and recalculates dynamic `#quickview-price-current`.
- `changeQuickViewQuantity(delta: number): void`
  - Clamps quantity between 1 and 10.
- `addQuickViewToCart(): void`
  - Constructs `CartItem` from active quick view state, calls `addToCart()`, closes quick view modal, and displays toast notification.

### 4.3 Cart & Price Calculation Controller
- `addToCart(product: Product, color: string, storage: string, quantity: number): void`
  - Generates `cartItemId` (`${product.id}-${color}-${storage}`).
  - If item exists in `state.cart`, increases quantity; otherwise appends item.
  - Calls `persistCart()`, `renderCart()`, and `showToast("Added to Cart!", "success")`.
- `updateCartQuantity(cartItemId: string, newQty: number): void`
  - If `newQty <= 0`, removes item; otherwise updates quantity.
  - Re-renders cart and recalculates totals.
- `removeFromCart(cartItemId: string): void`
  - Removes item from `state.cart`, updates badges, and updates totals.
- `applyPromoCoupon(code: string): void`
  - Validates promo against coupon list.
  - If valid, sets `state.couponDiscountPercentage`, shows success feedback in `#cart-coupon-message`, and triggers `renderCartTotals()`.
  - If invalid, shows error message.
- `applyTradeInCredit(amount: number): void`
  - Sets `state.tradeInCredit = amount`, renders `#cart-summary-tradein`, and triggers toast.
- `calculateCartTotals(): { subtotal: number, discount: number, tradein: number, tax: number, shipping: number, total: number }`
  - `subtotal = sum(unitPrice * quantity)`
  - `discount = subtotal * (couponDiscountPercentage / 100)`
  - `tradein = min(state.tradeInCredit, subtotal - discount)`
  - `tax = (subtotal - discount - tradein) * 0.0825` (8.25% standard sales tax)
  - `shipping = subtotal > 50 || subtotal === 0 ? 0 : 15.00`
  - `total = max(0, subtotal - discount - tradein + tax + shipping)`
- `renderCart(): void`
  - Renders item rows inside `#cart-items-container`.
  - Toggles `#cart-empty-state` and cart summary section.
  - Updates `#cart-badge-count`.

### 4.4 Wishlist Controller
- `toggleWishlist(productId: string): void`
  - If product in wishlist, removes it; if not, appends it.
  - Updates `#wishlist-badge-count`, updates cardiac icons on cards, and renders `#wishlist-items-container`.
  - Displays appropriate toast ("Added to Wishlist" / "Removed from Wishlist").
- `moveAllWishlistToCart(): void`
  - Iterates wishlist items, adds default variants to cart, empties wishlist, and opens cart drawer.

### 4.5 Checkout & Order Execution Controller
- `openCheckout(): void`
  - Checks if cart is empty. If not, populates `#checkout-order-summary-list`, `#checkout-final-total`, closes cart drawer, and reveals `#checkout-modal`.
- `closeCheckout(): void`
  - Dismisses `#checkout-modal`.
- `selectPaymentMethod(method: "samsung-pay" | "card"): void`
  - Toggles `#checkout-payment-card-fields` visibility and updates `#checkout-submit-btn` text (`"Pay with Samsung Pay"` vs `"Complete Order - $TOTAL"`).
- `handleCheckoutSubmit(event: Event): void`
  - Prevents default form reload.
  - Validates required inputs (name, email, address).
  - Simulates processing spinner for 1.2s.
  - Generates random Order ID (`SM-` + 7 digits).
  - Populates `#order-receipt-id`, `#order-receipt-date`, `#order-receipt-customer-name`, `#order-receipt-items-list`, `#order-receipt-total`.
  - Empties `state.cart`, clears trade-in and coupons, persists state.
  - Closes `#checkout-modal`, opens `#order-success-modal`, and fires celebration toast.

### 4.6 Theme & Notification System
- `toggleTheme(): void`
  - Toggles `'dark'` class on `document.documentElement`.
  - Stores preference in `localStorage.getItem('samsung_theme')`.
  - Updates icon on `#theme-toggle-btn`.
- `showToast(message: string, type: "success" | "info" | "warning"): void`
  - Creates an animated toast notification inside `#toast-notification-container`.
  - Auto-dismisses after 3500ms with fade-out.

---

## 5. File Structure Requirements

Group 2 Workspace layout to be implemented by Shanks:
```text
├── index.html       # Complete semantic structure with all exact IDs
├── style.css        # Samsung bespoke styles, dark mode, glowing accents, transitions
├── app.js           # Full reactive application logic following the exact contracts
└── spec.md          # Architectural contract (this file)
```

---

## 6. QA Verification Checklist for Builder (Shanks)

Before declaring completion, verify:
1. Every ID in Section 2 is verbatim identical in `index.html` and referenced in `app.js`.
2. Hero slider transitions smoothly between Galaxy S24 Ultra, Neo QLED, and Bespoke AI.
3. Category tabs filter products instantly without page reloads.
4. Galaxy AI checkbox isolates only Galaxy AI enabled devices.
5. Quick View modal color options dynamically update the displayed hardware preview.
6. Storage selectors accurately update displayed price delta.
7. Trade-in calculator dynamically calculates trade-in quote and deducts it from the cart.
8. Promotional coupons (`GALAXYAI`, `SAMSUNG10`) apply discounts accurately to the cart summary.
9. Checkout handles form validation, shows Samsung Pay simulation, and displays the complete printable receipt modal.
10. Dark mode and light mode render with flawless contrast and high-tech Samsung aesthetic.

*Architecture contract finalized by Robin. Ready for implementation by Shanks.*
