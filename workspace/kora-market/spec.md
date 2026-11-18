# KoraMarket — Architecture Blueprint & Technical Contract (spec.md)
**System & Data Architect:** Nami (Group 1 - Architect)  
**Target Builder:** Zoro (Group 1 - Builder)  
**Version:** 1.0.0  
**Status:** Approved & Ready for Implementation  

---

## 1. Executive Summary & Brand Identity

**KoraMarket** is a modern, light-mode consumer e-commerce shopping experience inspired by the minimalist elegance of **Apple Store**, the editorial refinement of **Zara**, and the robust reliability of **Amazon**.

### 1.1 Aesthetic Directives (STRICT)
- **NO DARK MODE. NO NEON. NO CYBERPUNK.**
- Clean, breathable, editorial layout with generous whitespace and precise typography.
- **Backgrounds:** Warm Off-White (`#F7F7F5`), Pure White (`#FFFFFF`) card surfaces.
- **Typography:** Deep Charcoal (`#18181B`) for headings/body, Muted Slate (`#71717A`) for secondary metadata.
- **Borders & Dividers:** Subtle hairline borders (`#E4E4E7`).
- **Brand Accents:** Forest Teal (`#0F766E`) for primary interactive states & badges, Warm Terracotta (`#EA580C`) for promotional accents, sale tags, and callouts.
- **Soft Realistic Shadows:** `box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px -4px rgba(0,0,0,0.06);`.

---

## 2. Global State Schema & Data Models

### 2.1 Currency Model
The application supports dual currency with instant recalculation:
```typescript
type CurrencyCode = 'INR' | 'USD';

interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;         // '₹' | '$'
  rateToInr: number;      // USD to INR = 83.5 (1 USD = 83.5 INR; INR base rate = 1)
  freeShippingThreshold: number; // 999 INR or 15 USD
  standardDeliveryFee: number;   // 99 INR or 2 USD
  expressDeliveryFee: number;    // 149 INR or 3 USD
}
```

### 2.2 Product Model
```typescript
interface ProductReview {
  id: string;
  reviewerName: string;
  reviewerEmail: string;
  rating: number;         // 1 to 5
  comment: string;
  date: string;           // ISO format or 'YYYY-MM-DD'
  verifiedPurchase: boolean;
}

interface Product {
  id: string | number;
  title: string;
  brand: string;
  category: 'Electronics' | 'Fashion' | 'Home & Living' | 'Footwear' | 'Accessories';
  priceINR: number;       // Base price in INR
  discountPercentage: number; // e.g. 15 for 15% off
  originalPriceINR: number;   // Calculated or specified MRP
  rating: number;         // e.g. 4.8
  reviewCount: number;
  stock: number;          // e.g. 24
  inStock: boolean;
  description: string;
  specs: Record<string, string>; // e.g. { "Material": "100% Linen", "Warranty": "1 Year" }
  colors: Array<{ name: string; hex: string }>;
  sizes: string[];        // e.g. ['S', 'M', 'L', 'XL'] or ['Default']
  images: string[];       // Primary & gallery images
  thumbnail: string;
  isFeatured?: boolean;
  reviews: ProductReview[];
}
```

### 2.3 Cart & Wishlist Models
```typescript
interface CartItem {
  id: string;             // Composite key: `${productId}-${selectedColor}-${selectedSize}`
  productId: string | number;
  title: string;
  brand: string;
  thumbnail: string;
  selectedColor: string;
  selectedSize: string;
  unitPriceINR: number;
  quantity: number;
  maxStock: number;
}

interface WishlistItem {
  productId: string | number;
  addedAt: string;
}
```

### 2.4 Order & Checkout Models
```typescript
type OrderStatus = 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered';
type DeliveryMethod = 'standard' | 'express';
type PaymentMethod = 'upi' | 'card' | 'cod';

interface OrderTimelineStep {
  status: OrderStatus;
  date: string;
  completed: boolean;
  active: boolean;
}

interface OrderAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

interface OrderRecord {
  orderId: string;        // e.g. "KM-84291"
  placedAt: string;       // e.g. "2025-05-18 14:32"
  currency: CurrencyCode;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  deliveryFee: number;
  grandTotal: number;
  shippingAddress: OrderAddress;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  currentStatus: OrderStatus;
  estimatedDeliveryDate: string;
  timeline: OrderTimelineStep[];
}
```

### 2.5 Filter & Sort State Model
```typescript
interface FilterState {
  searchQuery: string;
  selectedCategory: string; // 'All' | 'Electronics' | 'Fashion' | 'Home & Living' | 'Footwear' | 'Accessories'
  selectedBrands: string[]; // ['Apple', 'Kora Studio', ...]
  minPrice: number;
  maxPrice: number;
  minRating: number;        // 0 or 4 (for 4★ & above)
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating-desc' | 'discount-desc';
}
```

---

## 3. Seed Mock Datasets (Instant Zero-Blank Hydration)

### 3.1 12 Curated Initial Products (Offline/Immediate)
1. **Kora Linen Relaxed Overshirt**
   - Brand: `Kora Studio` | Category: `Fashion`
   - Price INR: `3,499` (MRP: `4,999`, 30% off) | Rating: `4.9` (128 reviews) | Stock: `18`
   - Colors: `[Warm Sand: #D7C4B7, Olive Wood: #555D50, Off White: #F4F1EA]`
   - Sizes: `['S', 'M', 'L', 'XL']`
   - Specs: `Material: 100% French Flax Linen | Fit: Relaxed Fit | Origin: Portugal`
   - Image: `https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80`

2. **AcousticOne Minimalist Wireless Headphones**
   - Brand: `Sonosora` | Category: `Electronics`
   - Price INR: `12,999` (MRP: `16,999`, 23% off) | Rating: `4.8` (342 reviews) | Stock: `12`
   - Colors: `[Silver Mist: #D1D5DB, Midnight Noir: #18181B, Oat Milk: #EFECE6]`
   - Sizes: `['Standard']`
   - Specs: `Battery: 45 Hours | Noise Cancellation: Hybrid Active ANC | Drivers: 40mm Custom Dynamic`
   - Image: `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80`

3. **Handmade Stoneware Ceramic Dinner Set**
   - Brand: `Kora Living` | Category: `Home & Living`
   - Price INR: `4,250` (MRP: `5,500`, 22% off) | Rating: `4.7` (89 reviews) | Stock: `8`
   - Colors: `[Speckled Chalk: #E5E5E0, Terracotta Glaze: #C86D51, Slate Blue: #64748B]`
   - Sizes: `['16-Piece Set']`
   - Specs: `Clay Type: High-fire Stoneware | Dishwasher Safe: Yes | Microwave Safe: Yes`
   - Image: `https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80`

4. **Kora Nomad Minimal Leather Sneakers**
   - Brand: `Vanguard Footwear` | Category: `Footwear`
   - Price INR: `5,899` (MRP: `7,999`, 26% off) | Rating: `4.8` (215 reviews) | Stock: `15`
   - Colors: `[All Chalk White: #F8F9FA, Caramel Gum: #C28B53]`
   - Sizes: `['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44']`
   - Specs: `Upper: Full-grain Italian Nappa | Sole: Recycled Natural Rubber | Insole: OrthoLite Ergonomic`
   - Image: `https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80`

5. **Verona Top-Grain Leather Desk Mat & Organizer**
   - Brand: `Kora Studio` | Category: `Accessories`
   - Price INR: `2,199` (MRP: `2,999`, 26% off) | Rating: `4.6` (74 reviews) | Stock: `25`
   - Colors: `[Cognac Brown: #8B4513, Charcoal Gray: #333333, Forest Moss: #2D5A27]`
   - Sizes: `['90cm x 40cm']`
   - Specs: `Material: Vegetable-tanned Cowhide | Base: Anti-skid Felt | Stitching: Waxed Thread`
   - Image: `https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80`

6. **Kora Lumina Aluminum Mechanical Desk Lamp**
   - Brand: `Lumina Works` | Category: `Home & Living`
   - Price INR: `6,499` (MRP: `8,499`, 23% off) | Rating: `4.9` (110 reviews) | Stock: `9`
   - Colors: `[Anodized Silver: #CBD5E1, Matte Charcoal: #27272A, Warm Brass: #D4AF37]`
   - Sizes: `['Standard']`
   - Specs: `Color Temperature: 2700K - 6500K Stepless | CRI: 97+ Ra | Power: USB-C PD 20W`
   - Image: `https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80`

7. **Aeropulse Ultra-Slim Magnesium Laptop Stand**
   - Brand: `Sonosora` | Category: `Electronics`
   - Price INR: `2,850` (MRP: `3,999`, 28% off) | Rating: `4.7` (160 reviews) | Stock: `30`
   - Colors: `[Space Gray: #4B5563, Silver: #E5E7EB]`
   - Sizes: `['Universal (11"-16")']`
   - Specs: `Material: Aerospace-grade Magnesium Alloy | Weight: 240g | Folded Thickness: 4mm`
   - Image: `https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80`

8. **Japanese Waffle-Knit Organic Cotton Robe**
   - Brand: `Kora Studio` | Category: `Fashion`
   - Price INR: `4,799` (MRP: `5,999`, 20% off) | Rating: `4.9` (92 reviews) | Stock: `14`
   - Colors: `[Washed Cream: #FAF7F2, Slate Navy: #1E293B, Mineral Sage: #94A3B8]`
   - Sizes: `['S/M', 'L/XL']`
   - Specs: `Weight: 380 GSM | Certification: GOTS Organic Cotton | Weave: Honeycomb Thermal`
   - Image: `https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80`

9. **Titanium Precision Daily Watch (Automatic)**
   - Brand: `Horology One` | Category: `Accessories`
   - Price INR: `18,499` (MRP: `24,000`, 22% off) | Rating: `5.0` (67 reviews) | Stock: `5`
   - Colors: `[Matte Titanium: #64748B, Obsidian Black: #09090B]`
   - Sizes: `['39mm Case']`
   - Specs: `Movement: Japanese NH35 Automatic | Glass: Sapphire Crystal AR | Water Resistance: 100m`
   - Image: `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80`

10. **Aromatherapy Ultrasonic Marble Diffuser**
    - Brand: `Kora Living` | Category: `Home & Living`
    - Price INR: `3,199` (MRP: `3,999`, 20% off) | Rating: `4.6` (140 reviews) | Stock: `19`
    - Colors: `[Carrara White Marble: #F1F5F9, Nero Black Marble: #1E1E1E]`
    - Sizes: `['200ml Tank']`
    - Specs: `Run Time: 8 Hours Continuous | Coverage: 350 sq ft | Ambient Glow: Warm 2400K LED`
    - Image: `https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80`

11. **Minimalist Raw Canvas Weekender Duffel**
    - Brand: `Kora Studio` | Category: `Accessories`
    - Price INR: `4,990` (MRP: `6,500`, 23% off) | Rating: `4.8` (188 reviews) | Stock: `11`
    - Colors: `[Desert Ecru: #E5DCC5, Dark Olive: #3E4334, Jet Black: #18181B]`
    - Sizes: `['45 Liters']`
    - Specs: `Fabric: 18oz Waxed Heavy Cotton Duck | Trims: Brass & Full-grain Leather`
    - Image: `https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80`

12. **CloudFoam Ergonomic Lounge Slippers**
    - Brand: `Vanguard Footwear` | Category: `Footwear`
    - Price INR: `1,799` (MRP: `2,499`, 28% off) | Rating: `4.7` (310 reviews) | Stock: `40`
    - Colors: `[Mushroom: #C7BAAB, Charcoal: #3F3F46, Soft Clay: #D8A48F]`
    - Sizes: `['S (38-39)', 'M (40-41)', 'L (42-43)', 'XL (44-45)']`
    - Specs: `Material: Compression Molded EVA | Arch Support: Anatomical Deep Heel Cup`
    - Image: `https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80`

---

### 3.2 5 Realistic Pre-Populated Customer Past Orders
1. **Order #KM-91024**
   - Date: `2025-05-02 11:20` | Total: `₹7,248` | Status: `Delivered`
   - Items: `Kora Linen Relaxed Overshirt (x1, Warm Sand, M)`, `CloudFoam Ergonomic Lounge Slippers (x1, Charcoal, L)`
   - Payment: `UPI (Google Pay)` | Delivery: `Standard Free`
   - Timeline: Confirmed (May 2) → Packed (May 3) → Shipped (May 4) → Delivered (May 6)

2. **Order #KM-88412**
   - Date: `2025-04-18 16:45` | Total: `₹12,999` | Status: `Delivered`
   - Items: `AcousticOne Minimalist Wireless Headphones (x1, Silver Mist, Standard)`
   - Payment: `Credit Card (•••• 4029)` | Delivery: `Next-Day Express`
   - Timeline: Confirmed (Apr 18) → Packed (Apr 18) → Shipped (Apr 19) → Delivered (Apr 20)

3. **Order #KM-85601**
   - Date: `2025-03-29 09:12` | Total: `₹4,250` | Status: `Delivered`
   - Items: `Handmade Stoneware Ceramic Dinner Set (x1, Speckled Chalk, 16-Piece)`
   - Payment: `UPI (PhonePe)` | Delivery: `Standard Free`
   - Timeline: Confirmed (Mar 29) → Packed (Mar 30) → Shipped (Apr 1) → Delivered (Apr 4)

4. **Order #KM-92144** (Active In-Transit Order)
   - Date: `2025-05-16 19:30` | Total: `₹5,899` | Status: `Shipped`
   - Items: `Kora Nomad Minimal Leather Sneakers (x1, All Chalk White, EU 42)`
   - Payment: `Cash on Delivery` | Delivery: `Standard Free`
   - Timeline: Confirmed (May 16) → Packed (May 17) → Shipped (May 18) → Expected Delivery (May 21)

5. **Order #KM-93510** (Just Processed)
   - Date: `2025-05-18 08:15` | Total: `₹2,199` | Status: `Packed`
   - Items: `Verona Top-Grain Leather Desk Mat & Organizer (x1, Cognac Brown, 90x40cm)`
   - Payment: `UPI (Paytm)` | Delivery: `Next-Day Express`
   - Timeline: Confirmed (May 18) → Packed (May 18) → Awaiting Pickup

---

## 4. Live Public API Enrichment Pipeline

### 4.1 Verified Public Endpoint
- **URL:** `https://dummyjson.com/products?limit=16`
- **Method:** `GET` (CORS enabled, Zero authentication required)
- **Timeout Strategy:** `AbortSignal.timeout(5000)`

### 4.2 Hybrid Fetch & Mapping Algorithm
1. **Stage 1 (Sync):** On `DOMContentLoaded`, immediately inject the 12 curated seed products into state and trigger the initial grid render. Set header badge status to:
   - `<span id="api-status-badge" class="badge-seed">🟡 Curated Catalog Active</span>`
2. **Stage 2 (Async Background Fetch):**
   ```javascript
   async function syncRemoteProducts() {
     try {
       const res = await fetch('https://dummyjson.com/products?limit=16', {
         signal: AbortSignal.timeout(5000)
       });
       if (!res.ok) throw new Error(`HTTP ${res.status}`);
       const data = await res.json();
       if (data && Array.isArray(data.products) && data.products.length > 0) {
         const mappedProducts = data.products.map(transformDummyProduct);
         // Merge without replacing user-customized items, ensuring catalog richness (16+ items)
         mergeCatalogProducts(mappedProducts);
         updateApiStatusBadge('live');
         renderProductGrid();
       }
     } catch (err) {
       console.warn('Live API sync unavailable; gracefully persisting seed catalog:', err);
       updateApiStatusBadge('offline');
     }
   }
   ```
3. **Category & Field Normalization Map:**
   - DummyJSON categories mapped to KoraMarket taxonomy:
     - `beauty`, `fragrances`, `skin-care` → `Accessories`
     - `smartphones`, `laptops`, `mobile-accessories` → `Electronics`
     - `mens-shirts`, `womens-dresses`, `tops` → `Fashion`
     - `furniture`, `home-decoration`, `kitchen-accessories` → `Home & Living`
     - `mens-shoes`, `womens-shoes` → `Footwear`
   - Base Price: `Math.round(dummyItem.price * 83.5)` (Converted to INR base)
   - MRP: `Math.round(priceINR / (1 - (discountPercentage / 100)))`
   - Real photo fallbacks: DummyJSON `thumbnail` and `images` array used directly.

---

## 5. UI Architecture & Concrete DOM Contract

Every single interactive element has a strict and immutable DOM ID or data-attribute contract.

### 5.1 Sticky Header (`#site-header`)
- `#site-header`: Sticky navigation bar container
- `#logo-link`: Main brand home link ("KoraMarket")
- `#api-status-badge`: Visual indicator (`🟡 Seed Catalog Active` / `🟢 Live Online Data`)
- Category Navigation Pills (`#nav-categories`):
  - `[data-category="All"]`: Active by default
  - `[data-category="Electronics"]`
  - `[data-category="Fashion"]`
  - `[data-category="Home & Living"]`
  - `[data-category="Footwear"]`
  - `[data-category="Accessories"]`
- Search Bar:
  - `#search-input`: Real-time instant debounced text filter
  - `#search-clear-btn`: Reset search button
- Utility Actions:
  - `#currency-select`: `<select>` dropdown (`INR` / `USD`)
  - `#wishlist-toggle-btn`: Opens Wishlist Drawer/Modal
  - `#wishlist-count-badge`: Number badge of saved items
  - `#orders-modal-btn`: Opens My Orders Modal
  - `#cart-toggle-btn`: Opens Shopping Bag Drawer
  - `#cart-count-badge`: Number badge of total items in cart

### 5.2 Editorial Hero & Trust Strip
- `#hero-banner`: Split editorial hero banner
  - Left Column: Headline *"Elegance in Simplicity. Designed for Living."*, subtext, `#hero-shop-btn` (smooth scrolls to product grid).
  - Right Column: Curated hero showcase visual with quick preview badge.
- `#trust-strip`: 4-item horizontal trust bar:
  1. *Free Express Delivery over ₹999 / $15* (Truck icon)
  2. *30-Day Effortless Returns* (Refresh icon)
  3. *100% Verified Authentic Craft* (Shield Check icon)
  4. *256-Bit Encrypted Payments* (Lock icon)

### 5.3 Filter Sidebar (`#filter-sidebar`)
- `#filter-category-list`: Radio/pill group for categories
- `#filter-brand-container`: Checkbox list dynamically populated with unique brands
- `#price-slider`: `<input type="range">` with `#price-range-display` (e.g. "Up to ₹25,000 / $300")
- `#filter-rating-4plus`: `<input type="checkbox">` "4★ & above only"
- `#filter-instock-toggle`: `<input type="checkbox">` "In-Stock Only" switch
- `#filter-reset-btn`: Instant reset button for all filters
- `#filter-mobile-toggle-btn`: Mobile screen filter drawer open toggle
- `#filter-mobile-close-btn`: Close mobile filter drawer

### 5.4 Sort & Count Bar
- `#results-count-text`: Displays `"Showing 12 of 12 items"`
- `#active-filter-chips`: Horizontal pill list of active filters with individual "✕" remove tags
- `#sort-select`: `<select>` with options:
  - `featured`: Featured Curation
  - `price-asc`: Price: Low to High
  - `price-desc`: Price: High to Low
  - `rating-desc`: Highest Rated (Top Reviews)
  - `discount-desc`: Biggest Savings (% Off)

### 5.5 Product Grid Container (`#products-grid`)
- `#products-grid`: Responsive CSS Grid (`repeat(auto-fill, minmax(280px, 1fr))`)
- Dynamic Product Card Template (`.product-card` with `data-id="${item.id}"`):
  - `.product-card-img-wrap`: Image container with skeleton shimmer fallback
  - `.product-card-discount-tag`: Badge showing `-${item.discountPercentage}%`
  - `.product-card-wishlist-btn`: Heart icon toggle (`aria-label="Wishlist"`)
  - `.product-card-quickview-btn`: Hover action to trigger Quick View Modal
  - `.product-card-brand`: Secondary text (e.g. `Kora Studio`)
  - `.product-card-title`: Product headline
  - `.product-card-rating`: Star rating pill (e.g. `★ 4.8 (128)`)
  - `.product-card-pricing`: Discounted price in active currency + strikethrough original MRP
  - `.product-card-add-btn`: Clean high-contrast CTA (`Add to Bag`)

### 5.6 Product Detail / Quick View Modal (`#quickview-modal`)
- `#quickview-modal-backdrop`: Overlay with smooth fade
- `#quickview-modal-container`: Centered white dialog with subtle elevation
- `#quickview-close-btn`: Top right "✕" close button
- `#quickview-main-image`: Large preview image
- `#quickview-gallery-strip`: Thumbnails row for switching active image
- `#quickview-brand`: Brand label
- `#quickview-title`: Product full title
- `#quickview-rating-summary`: Stars + total review count link
- `#quickview-price-current`: Active currency discounted price
- `#quickview-price-original`: Strikethrough MRP
- `#quickview-discount-pill`: Highlighted percentage badge
- `#quickview-description`: Editorial paragraph description
- `#quickview-color-swatches`: Clickable round color swatches with active ring
- `#quickview-size-selector`: Size selection pill buttons
- Pincode Checker Module:
  - `#quickview-pincode-input`: 6-digit text input
  - `#quickview-pincode-check-btn`: "Check" button
  - `#quickview-pincode-result`: Estimated delivery date calculator (e.g. "Delivers by Thursday, May 22 | Free Shipping available")
- Specifications Sheet:
  - `#quickview-specs-list`: Key-value grid of technical specifications
- Verified Reviews Section:
  - `#quickview-reviews-container`: List of customer review cards with star ratings & comments
- Quick View Action Buttons:
  - `#quickview-add-cart-btn`: "Add to Bag"
  - `#quickview-buy-now-btn`: "Buy Now" (Adds to cart & opens checkout modal instantly)

### 5.7 Slide-Over Shopping Bag Drawer (`#cart-drawer`)
- `#cart-drawer-backdrop`: Dimmed overlay
- `#cart-drawer-panel`: Slide-in drawer from right (width `420px`, max-width `100vw`)
- `#cart-drawer-close-btn`: Top close button
- Free Shipping Indicator:
  - `#free-shipping-bar-fill`: Dynamic progress fill width (`0%` to `100%`)
  - `#free-shipping-status-text`: E.g., *"Add ₹249 more to unlock FREE Delivery!"* or *"🎉 You qualify for FREE Delivery!"*
- Cart Items List:
  - `#cart-items-list`: Scrollable container
  - Empty Cart State (`#cart-empty-state`): Shown when count is 0 with "Start Shopping" CTA
  - Item Template (`.cart-item-row`):
    - Thumbnail image
    - Title, variant (Color/Size), unit price
    - Quantity Controller: `.qty-minus-btn`, `.qty-value-text`, `.qty-plus-btn`
    - Remove Button: `.cart-item-remove-btn`
- Promo Code Box:
  - `#promo-input`: Input box (Placeholder: `"Try FIRST10"`)
  - `#promo-apply-btn`: "Apply" button
  - `#promo-applied-tag`: Pill showing applied coupon (e.g. `FIRST10 - 10% Off [✕ Remove]`)
- Transparent Bill Breakdown:
  - `#bill-subtotal-amount`
  - `#bill-discount-amount`
  - `#bill-tax-amount` (Calculated 5% GST)
  - `#bill-shipping-amount` (Free or Standard Fee)
  - `#bill-grand-total-amount`
- Checkout Action:
  - `#cart-checkout-btn`: "Proceed to Checkout" primary button

### 5.8 Clean Checkout Modal (`#checkout-modal`)
- `#checkout-modal-backdrop`
- `#checkout-modal-container`
- `#checkout-close-btn`
- Step 1: Customer & Shipping Details Form:
  - `#checkout-name`: Full Name
  - `#checkout-email`: Email Address
  - `#checkout-phone`: 10-Digit Mobile Phone
  - `#checkout-address`: Street Address
  - `#checkout-city`: City
  - `#checkout-state`: State / Region
  - `#checkout-pincode`: Pincode
- Step 2: Delivery Option Selector:
  - `[name="delivery-method"][value="standard"]`: Free (3–5 business days)
  - `[name="delivery-method"][value="express"]`: Express (+₹149 / +$3, Next-Day Delivery)
- Step 3: Payment Method Selector:
  - `[name="payment-method"][value="upi"]`: UPI (Shows dynamic QR code preview + VPA input `#checkout-upi-id`)
  - `[name="payment-method"][value="card"]`: Credit / Debit Card (Card number `#card-number-input`, Expiry `#card-expiry-input`, CVV `#card-cvv-input`)
  - `[name="payment-method"][value="cod"]`: Cash on Delivery (Standard verification)
- Step 4: Final Order Summary & Place Order:
  - `#checkout-summary-items-count`
  - `#checkout-summary-total`
  - `#place-order-submit-btn`: Primary high-contrast submit button
- Order Confirmation State (`#order-confirmation-view`):
  - `#confirmation-order-id`: Generated unique ID (e.g., `#KM-83921`)
  - `#confirmation-delivery-estimate`: Formatted delivery date
  - `#confirmation-total-paid`: Final amount
  - `#confirmation-view-orders-btn`: "Track in My Orders" button
  - `#confirmation-continue-shop-btn`: "Continue Shopping" button

### 5.9 Customer Account Views: Wishlist & My Orders
#### Wishlist Drawer/Modal (`#wishlist-modal`)
- `#wishlist-modal-backdrop`
- `#wishlist-modal-container`
- `#wishlist-close-btn`
- `#wishlist-items-container`: List of saved products
  - Card with thumbnail, title, price, in-stock badge
  - `.wishlist-move-to-bag-btn`: 1-click moves item into cart and removes from wishlist
  - `.wishlist-remove-btn`: Removes item from wishlist
- `#wishlist-empty-state`: Shown when wishlist is empty with "Explore Products" CTA

#### My Orders Modal (`#orders-modal`)
- `#orders-modal-backdrop`
- `#orders-modal-container`
- `#orders-close-btn`
- `#orders-search-input`: Filter past orders by ID or item name
- `#orders-list-container`:
  - Cards rendering each order from `localStorage`
  - Order Header: Order ID, Placement Date, Order Total, Payment Method badge
  - Order Timeline Visualizer:
    - 4 steps: `Confirmed` ➔ `Packed` ➔ `Shipped` ➔ `Delivered`
    - Completed steps marked with teal checkmarks; active step with animated pulse dot; pending steps muted.
  - Items breakdown with images and quantities
  - Re-order / Help button

### 5.10 Toast Notification System (`#toast-container`)
- `#toast-container`: Fixed bottom-right notification stack (`z-index: 9999`)
- Function `showToast(message, type = 'info' | 'success' | 'warning', duration = 3000)`
- Clean minimal toast pill with smooth slide-up and auto-dismiss

---

## 6. Functional Business Logic & Formulas

### 6.1 Currency Conversion
- Base amounts stored in **INR**.
- USD Conversion Rate: `1 USD = 83.5 INR`.
- Formula:
  $$\text{USD Price} = \frac{\text{INR Price}}{83.5}$$
- Formatting:
  - INR: `₹` followed by Indian number formatting (e.g., `₹12,999`)
  - USD: `$` followed by two decimals or rounded (e.g., `$155.68`)

### 6.2 Cart Totals & Taxes
1. **Subtotal ($S$):** Sum of `item.unitPrice * item.quantity`
2. **Promo Code Discount ($D$):**
   - Coupon `FIRST10`: $10\%$ off Subtotal ($S \times 0.10$)
   - Other codes show error: *"Invalid code. Use FIRST10 for 10% off."*
3. **Delivery Fee ($F$):**
   - Free shipping threshold: `₹999` (or `$15`)
   - If Subtotal $\ge$ Threshold $\rightarrow F = 0$
   - If Subtotal $<$ Threshold $\rightarrow F = 99 \text{ INR}$ (or `$2`)
   - If Express delivery selected during checkout $\rightarrow F_{\text{express}} = F + 149 \text{ INR}$ (or `+$3`)
4. **GST / Tax ($T$):**
   - Transparent $5\%$ on discounted goods:
     $$T = (S - D) \times 0.05$$
5. **Grand Total ($G$):**
   $$G = (S - D) + T + F$$

### 6.3 Pincode Delivery Estimator Logic
- Input: 6-digit number (e.g. `110001` or `560001`).
- Validates 6 digits `^\d{6}$`.
- Dynamic calculation based on current date + 3 to 5 business days:
  $$\text{EstDate} = \text{Date.now()} + 3 \times 86400000 \text{ ms}$$
- Output: *"Delivers by [Day of Week, Month Date] • Express Next-Day eligible"*

---

## 7. Performance & Resilience Architecture

1. **Zero-Lag DOM Updates:**
   - Product list renders use `DocumentFragment` to prevent layout thrashing.
   - Filter inputs (search, price slider) are debounced at `150ms`.
2. **Offline Fallback Guarantee:**
   - App loads seed items immediately (`DOMContentLoaded`).
   - If user is offline or DummyJSON fails, catalog remains 100% operational with seed data.
3. **Local Storage Persistence Keys:**
   - `koramarket_cart_v1`: JSON string of cart items
   - `koramarket_wishlist_v1`: JSON string of product IDs
   - `koramarket_orders_v1`: JSON string of order records
   - `koramarket_currency_v1`: Active currency code (`INR` or `USD`)
   - `koramarket_promo_v1`: Applied coupon code if any

---

## 8. Technical File Organization

```
/
├── index.html        # Complete semantic HTML5 structure with all defined IDs
├── css/
│   └── styles.css    # Clean Apple/Zara/Amazon light-mode typography & layout styles
├── js/
│   ├── data.js       # Curated 12 seed products, 5 seed orders, dummyjson adapter
│   ├── store.js      # Cart, Wishlist, Currency, LocalStorage persistence engine
│   └── app.js        # Event listeners, filtering engine, modals, drawer, pincode checker
└── spec.md           # This architecture blueprint
```

---

*This blueprint guarantees 100% zero dead buttons, strict light-mode editorial aesthetics, seamless live data integration, and comprehensive shopping workflows.*
