# System & Architecture Specification: "ATELIER & CO." (High-Street & Luxury Fashion E-Commerce Flagship)
**Architect:** Nami (Group 1 - Architect), System & Data Architect of Straw Hat Crew GROUP1  
**Target Builder:** Zoro (Group 1 - Builder)  
**Status:** APPROVED & LOCKED FOR BUILD  
**Version:** 1.0.0-PROD  

---

## 1. Executive Blueprint & Real-World Brand Benchmark

### 1.1 Authentic Brand Inspiration: ZARA x ASOS x SSENSE Hybrid
The application is engineered as **"ATELIER & CO."**, a high-fidelity replica of modern global fashion flagships (blending the editorial minimalism and sharp typography of **ZARA**, the comprehensive filtering, sizing, and multi-category accessibility of **ASOS**, and the premium elevated aesthetics of **SSENSE**).

### 1.2 Hallmark Features & Design Philosophy
1. **Editorial High-Fashion Aesthetics:** Clean monochrome palette, bold editorial serif/sans headings, high-contrast imagery, smooth micro-interactions, sticky ultra-sleek navigation, marquee announcement ticker.
2. **Interactive 2-Way Product Presentation:** Toggle between 2-column editorial lookbook view and 4-column compact browsing grid.
3. **Multi-Attribute Product Engine:** Live size selection (XS to XL), live swatch color selection, stock availability indicator, instant quick-add, and interactive Quick View modal.
4. **Slide-Over Cart Drawer & Instant Checkout Flow:** Zero-redirect AJAX-style sliding bag with live subtotal calculation, free shipping progress bar ($150 threshold), coupon code validation, item quantity controls, and full multi-step modal checkout (Shipping -> Payment -> Order Confirmed).
5. **Dynamic Wishlist System:** Global favorites counter, real-time toggle with heart animation, dedicated interactive wishlist slide-out panel with "Move all to Bag" capability.
6. **Instant Search & Real-Time Faceted Filter System:** Instant fuzzy search with keyboard shortcut (`/`), category tabs (All, Outerwear, Tailoring, Essentials, Dresses, Knitwear), price range slider, sort dropdown (Featured, Price: Low-High, Price: High-Low, Highest Rated), and stock status filter.
7. **Size Guide & Review Modals:** Interactive interactive measurement guide (Imperial/Metric toggle) and product reviews breakdown.
8. **Toast Notification System:** Non-intrusive floating feedback for cart adds, wishlist toggles, promo code applications, and validation errors.

---

## 2. Visual Hierarchy & Design System Tokens

### 2.1 Color Palette
```css
:root {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F8F8F7;
  --bg-accent: #111111;
  --bg-subtle: #F1F1EF;
  --text-primary: #0F0F0F;
  --text-secondary: #5E5E5E;
  --text-muted: #8E8E93;
  --text-inverted: #FFFFFF;
  --border-light: #E5E5E5;
  --border-dark: #1A1A1A;
  --badge-sale: #D9381E;
  --badge-new: #0F0F0F;
  --badge-limited: #B45309;
  --badge-bestseller: #15803D;
  --accent-gold: #C5A059;
  --accent-surface: #FAF9F6;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 16px 40px rgba(0, 0, 0, 0.14);
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 250ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-drawer: 350ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

### 2.2 Typography
- **Headings & Editorial Display:** `"Cinzel"`, `"Playfair Display"`, or `"Didot"`, serif, font-weight 500-700, letter-spacing: -0.02em to +0.05em.
- **Body & Controls:** `"Inter"`, `system-ui`, -apple-system, sans-serif, letter-spacing: 0.01em.
- **Micro-labels / Eyebrows / SKUs:** Monospace or uppercase tracked sans-serif (`font-size: 11px; letter-spacing: 0.12em; font-weight: 600;`).

---

## 3. Architecture & File Structure

```
├── index.html          # High-fashion semantic markup, modals, drawers, templates
├── styles.css          # Editorial styling, grid system, responsive drawer & modal animations
├── app.js              # State engine, event dispatchers, mock catalog, cart/checkout logic
└── spec.md             # This comprehensive architecture contract
```

---

## 4. Complete Data Models & State Schema

### 4.1 Product Model
```typescript
interface Product {
  id: string;               // e.g. "prod-001"
  sku: string;              // e.g. "ATL-7821-BLK"
  name: string;             // e.g. "Double-Breasted Wool Trench Coat"
  category: "outerwear" | "tailoring" | "essentials" | "dresses" | "knitwear" | "accessories";
  gender: "women" | "men" | "unisex";
  price: number;            // Current sale price in USD (e.g. 245.00)
  originalPrice: number;    // Original MSRP (e.g. 310.00)
  badge: "NEW" | "SALE" | "BESTSELLER" | "LIMITED" | null;
  rating: number;           // 4.5 to 5.0
  reviewCount: number;      // e.g. 42
  images: string[];         // High-res product images (primary + hover/detail)
  sizes: string[];          // ["XS", "S", "M", "L", "XL"]
  colors: { name: string; hex: string }[];
  description: string;
  details: string[];        // Composition, care, country of origin
  stock: number;            // Inventory level for low-stock warning
  isFeatured: boolean;
}
```

### 4.2 Cart Item Model
```typescript
interface CartItem {
  cartItemId: string;       // `${productId}-${selectedSize}-${selectedColor}`
  productId: string;
  name: string;
  price: number;
  originalPrice: number;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
  image: string;
  quantity: number;
}
```

### 4.3 Wishlist Item Model
```typescript
interface WishlistItem {
  productId: string;
  addedAt: number;          // timestamp
}
```

### 4.4 App Global State Contract
```javascript
const AppState = {
  products: [],             // 12 pre-loaded items
  filteredProducts: [],     // currently displayed
  cart: [],                 // array of CartItem
  wishlist: new Set(),      // Set of productIds
  activeFilters: {
    category: "all",        // "all" | category string
    searchQuery: "",
    priceMax: 500,
    sortBy: "featured",     // "featured" | "price-asc" | "price-desc" | "rating"
    inStockOnly: false
  },
  layoutView: "grid-4",     // "grid-4" | "grid-2"
  promoCode: null,          // { code: "VOGUE20", discountPercent: 20 }
  freeShippingThreshold: 150,
  activeQuickViewProduct: null,
  activeSizeGuideCategory: "outerwear",
  currentCheckoutStep: 1    // 1: Shipping, 2: Payment, 3: Confirmation
};
```

---

## 5. Mandatory Pre-Loaded Fashion Catalog (12 Authentic Items)

```javascript
const MOCK_PRODUCTS = [
  {
    id: "prod-001",
    sku: "ATL-9011-CAM",
    name: "Architectural Double-Breasted Wool Coat",
    category: "outerwear",
    gender: "unisex",
    price: 285.00,
    originalPrice: 340.00,
    badge: "BESTSELLER",
    rating: 4.9,
    reviewCount: 68,
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Camel", hex: "#C19A6B" },
      { name: "Obsidian Black", hex: "#171717" },
      { name: "Oatmeal", hex: "#D6CFC7" }
    ],
    description: "Masterfully tailored from heavyweight double-faced Italian wool blend. Features a structured peak lapel, horn-effect buttons, and a clean column silhouette designed for effortless winter layering.",
    details: ["75% Recycled Wool, 20% Polyamide, 5% Cashmere", "Fully lined in cupro silk", "Dry clean only", "Crafted in Porto, Portugal"],
    stock: 7,
    isFeatured: true
  },
  {
    id: "prod-002",
    sku: "ATL-4420-CHR",
    name: "Pleated Wide-Leg Tailored Trousers",
    category: "tailoring",
    gender: "women",
    price: 145.00,
    originalPrice: 175.00,
    badge: "NEW",
    rating: 4.8,
    reviewCount: 34,
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Charcoal Grey", hex: "#36454F" },
      { name: "Ecru", hex: "#F3EFE0" },
      { name: "Deep Navy", hex: "#1A2433" }
    ],
    description: "Relaxed high-waisted trousers with razor-sharp front pleats and a sweeping fluid drape. Engineered to transition seamlessly from boardroom to evening gallery receptions.",
    details: ["68% Polyester, 28% Viscose, 4% Elastane", "Concealed hook & zip fastening", "Machine wash cold gentle", "Made in Istanbul, Turkey"],
    stock: 14,
    isFeatured: true
  },
  {
    id: "prod-003",
    sku: "ATL-1182-RAW",
    name: "Heavyweight Boxy French Terry Hoodie",
    category: "essentials",
    gender: "unisex",
    price: 110.00,
    originalPrice: 110.00,
    badge: null,
    rating: 4.9,
    reviewCount: 112,
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=900&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Washed Sage", hex: "#7E8C76" },
      { name: "Vintage White", hex: "#F5F5F0" },
      { name: "Washed Carbon", hex: "#2C2C2C" }
    ],
    description: "Cut from 480 GSM organic cotton french terry. Custom drop-shoulder block, double-layered drawstringless hood, and hidden seam pouch pockets for a minimalist silhouette.",
    details: ["100% GOTS Certified Organic Cotton (480 GSM)", "Pre-shrunk custom garment dye", "Ribbed side gussets", "Made in Los Angeles, USA"],
    stock: 22,
    isFeatured: true
  },
  {
    id: "prod-004",
    sku: "ATL-8820-SLK",
    name: "Liquid Satin Bias-Cut Slip Dress",
    category: "dresses",
    gender: "women",
    price: 195.00,
    originalPrice: 240.00,
    badge: "SALE",
    rating: 4.7,
    reviewCount: 45,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Champagne Pearl", hex: "#EADDC7" },
      { name: "Midnight Black", hex: "#0D0D0D" },
      { name: "Bordeaux", hex: "#5C0618" }
    ],
    description: "A timeless 90s homage cut on the bias to caress every contour. Spun from high-density heavy mulberry silk with delicate spaghetti straps and a low scoop back.",
    details: ["100% 22 Momme Mulberry Silk", "Adjustable strap hardware", "French seam finishing", "Hand wash cold or dry clean"],
    stock: 5,
    isFeatured: true
  },
  {
    id: "prod-005",
    sku: "ATL-7104-CSH",
    name: "Chunky Ribbed Cashmere Turtleneck",
    category: "knitwear",
    gender: "unisex",
    price: 260.00,
    originalPrice: 320.00,
    badge: "LIMITED",
    rating: 5.0,
    reviewCount: 29,
    images: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Alabaster Cream", hex: "#F3ECE1" },
      { name: "Heather Grey", hex: "#9E9E9E" },
      { name: "Espresso", hex: "#3B2F2F" }
    ],
    description: "7-gauge fisherman rib knit from Grade-A Mongolian cashmere yarns. Boasts an opulent roll neck, raglan sleeves, and substantial tactile warmth without excessive bulk.",
    details: ["100% Pure Mongolian Cashmere", "Pilling-resistant 2-ply yarns", "Store folded, never hung", "Dry clean or gentle cold wool wash"],
    stock: 4,
    isFeatured: true
  },
  {
    id: "prod-006",
    sku: "ATL-3309-DNM",
    name: "Selvedge Denim Oversized Trucker Jacket",
    category: "outerwear",
    gender: "men",
    price: 180.00,
    originalPrice: 180.00,
    badge: "NEW",
    rating: 4.8,
    reviewCount: 51,
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=900&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Raw Indigo", hex: "#1C2841" },
      { name: "Washed Vintage Stone", hex: "#7B8B9B" }
    ],
    description: "14oz Japanese shuttle-loomed red-line selvedge denim. Boxy cropped torso, dropped shoulders, matte silver shank buttons, and interior selvedge edge reveal on front placket.",
    details: ["100% Kuroki Mills Cotton Denim (14oz)", "Raw unwashed ring-spun yarn", "Copper reinforced rivet points", "Handcrafted in Okayama, Japan"],
    stock: 11,
    isFeatured: false
  },
  {
    id: "prod-007",
    sku: "ATL-5512-BLZ",
    name: "Sculptural Hourglass Single-Breasted Blazer",
    category: "tailoring",
    gender: "women",
    price: 230.00,
    originalPrice: 290.00,
    badge: "BESTSELLER",
    rating: 4.9,
    reviewCount: 74,
    images: [
      "https://images.unsplash.com/photo-1548624149-f9b1859aa9d0?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Pure Raven", hex: "#121212" },
      { name: "Sandstone", hex: "#D2B48C" }
    ],
    description: "Architectural precision tailoring with sharp padded shoulders and a nipped-in waist. Welt breast pocket, jetted flap hip pockets, and statement custom tortoiseshell buttons.",
    details: ["Virgin Wool 55%, Recycled Poly 40%, Spandex 5%", "Full structured canvas chest piece", "Dual back vent", "Dry clean only"],
    stock: 9,
    isFeatured: true
  },
  {
    id: "prod-008",
    sku: "ATL-6619-KNT",
    name: "Open-Stitch Mohair Blend Cardigan",
    category: "knitwear",
    gender: "unisex",
    price: 170.00,
    originalPrice: 210.00,
    badge: "SALE",
    rating: 4.6,
    reviewCount: 38,
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Moss Green", hex: "#4A5D4E" },
      { name: "Terracotta Clay", hex: "#B85D43" },
      { name: "Soft Charcoal", hex: "#3A3A3A" }
    ],
    description: "Hazy, brushed South African mohair knitted in a breathable open gauge. Deep V-neckline with oversized organic genuine horn buttons and exaggerated dropped sleeves.",
    details: ["40% Mohair, 35% Wool, 25% Recycled Nylon", "Naturally brushed fuzzy texture", "Anti-stretch ribbed cuffs and hem", "Dry clean only"],
    stock: 6,
    isFeatured: false
  },
  {
    id: "prod-009",
    sku: "ATL-2041-TEE",
    name: "Heavyweight Relaxed Interlock Supima Tee",
    category: "essentials",
    gender: "unisex",
    price: 55.00,
    originalPrice: 55.00,
    badge: null,
    rating: 4.9,
    reviewCount: 160,
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Optic White", hex: "#FFFFFF" },
      { name: "Washed Slate", hex: "#475569" },
      { name: "Pitch Black", hex: "#111111" },
      { name: "Warm Olive", hex: "#556B2F" }
    ],
    description: "The definitive everyday t-shirt. Knitted from 260 GSM long-staple California Supima cotton interlock jersey. Features a thick bound collar that maintains its shape after countless washes.",
    details: ["100% Extra-Long Staple Supima Cotton", "Twin needle coverstitching", "Mercerized finish for silky feel", "Machine wash 30°C"],
    stock: 40,
    isFeatured: true
  },
  {
    id: "prod-010",
    sku: "ATL-9932-PLT",
    name: "Asymmetrical Draped Halter Gown",
    category: "dresses",
    gender: "women",
    price: 320.00,
    originalPrice: 390.00,
    badge: "LIMITED",
    rating: 4.9,
    reviewCount: 22,
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1518049362301-447a1ffb2f29?auto=format&fit=crop&w=900&q=80"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Emerald Glaze", hex: "#046307" },
      { name: "Monochrome Black", hex: "#080808" }
    ],
    description: "Sculpted high neck with waterfall cascading drapery down the spine. Floor-sweeping length with a subtly concealed side slit and invisible zipper fastening.",
    details: ["92% Viscose Rayon, 8% Silk Crepe", "Integrated boning bustier support", "Dry clean only", "Specialist eveningwear finish"],
    stock: 3,
    isFeatured: false
  },
  {
    id: "prod-011",
    sku: "ATL-1090-BAG",
    name: "Minimalist Soft Puddle Leather Tote",
    category: "accessories",
    gender: "unisex",
    price: 210.00,
    originalPrice: 260.00,
    badge: "NEW",
    rating: 4.8,
    reviewCount: 41,
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80"
    ],
    sizes: ["ONE SIZE"],
    colors: [
      { name: "Cognac Tan", hex: "#9E4714" },
      { name: "Jet Nappa", hex: "#1A1A1A" }
    ],
    description: "Deconstructed slouchy silhouette crafted from vegetable-tanned full-grain calf leather. Holds a 16\" laptop comfortably with an interior zippered pouch and magnetic closure.",
    details: ["100% Full Grain Italian Calf Leather", "Suede lining with internal organizer", "Silver stamped serial number", "Includes cotton dustbag"],
    stock: 12,
    isFeatured: false
  },
  {
    id: "prod-012",
    sku: "ATL-7801-LTR",
    name: "Cropped Lambskin Boxy Biker Jacket",
    category: "outerwear",
    gender: "women",
    price: 360.00,
    originalPrice: 450.00,
    badge: "SALE",
    rating: 5.0,
    reviewCount: 33,
    images: [
      "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Vintage Distressed Black", hex: "#1C1C1C" },
      { name: "Dark Chocolate", hex: "#2B1D16" }
    ],
    description: "Buttery soft New Zealand lambskin with custom oxidized hardware. Cropped straight hem, wide notched collar with snap down lapels, and quilted cupro lining.",
    details: ["100% Genuine New Zealand Lamb Nappa Leather", "Heavy duty YKK double-ended zippers", "Interior chest pocket", "Specialist leather dry clean"],
    stock: 5,
    isFeatured: true
  }
];
```

---

## 6. Strict DOM Element ID & Class Specification

To ensure ZERO mismatches between HTML and JavaScript, every interactive control must use the exact element IDs specified below.

### 6.1 Announcement Bar & Top Navigation
| ID | Tag / Element | Purpose / Behavior |
| :--- | :--- | :--- |
| `#announcement-bar` | `<div id="announcement-bar">` | Sticky top ticker with promo alert & toggle |
| `#promo-copy` | `<span>` | Displays "COMPLIMENTARY GLOBAL COURIER ON ORDERS OVER $150 • CODE: VOGUE20 FOR 20% OFF" |
| `#site-header` | `<header id="site-header">` | Sticky header with scroll-reactive shadow & blur |
| `#nav-brand-logo` | `<a id="nav-brand-logo">` | Brand logo "ATELIER & CO." (resets all filters to home) |
| `#category-nav-list` | `<ul id="category-nav-list">` | Desktop category links (`data-cat="all"`, `outerwear`, etc.) |
| `#search-toggle-btn` | `<button id="search-toggle-btn">` | Opens quick search bar / focuses input |
| `#search-bar-container`| `<div id="search-bar-container">` | Collapsible/expandable search drawer or header bar |
| `#search-input` | `<input id="search-input">` | Live instant search query input |
| `#search-clear-btn` | `<button id="search-clear-btn">` | Clears active search input |
| `#wishlist-toggle-btn` | `<button id="wishlist-toggle-btn">`| Opens Wishlist drawer/modal |
| `#wishlist-badge-count`| `<span id="wishlist-badge-count">` | Dynamic pill showing wishlist count |
| `#cart-toggle-btn` | `<button id="cart-toggle-btn">` | Opens Slide-over Cart Drawer |
| `#cart-badge-count` | `<span id="cart-badge-count">` | Dynamic badge displaying total items in cart |
| `#mobile-menu-btn` | `<button id="mobile-menu-btn">` | Mobile hamburger menu toggle |
| `#mobile-nav-drawer` | `<div id="mobile-nav-drawer">` | Mobile navigation slide-out |

### 6.2 Hero Banner & Editorial Collection Highlight
| ID | Tag / Element | Purpose / Behavior |
| :--- | :--- | :--- |
| `#hero-section` | `<section id="hero-section">` | Full-width editorial hero banner |
| `#hero-cta-shop` | `<button id="hero-cta-shop">` | Smooth scrolls to `#catalog-section` & sets active tab |
| `#hero-cta-lookbook`| `<button id="hero-cta-lookbook">`| Switches layout to 2-column lookbook mode |
| `#ticker-category-chips`| `<div id="ticker-category-chips">` | Quick-filter horizontal chip scroll on mobile |

### 6.3 Catalog Controls & Toolbar
| ID | Tag / Element | Purpose / Behavior |
| :--- | :--- | :--- |
| `#catalog-section` | `<section id="catalog-section">` | Main shopping catalog container |
| `#filter-category-pills` | `<div id="filter-category-pills">` | Tab buttons for each category: `All`, `Outerwear`, `Tailoring`, `Essentials`, `Dresses`, `Knitwear`, `Accessories` |
| `#sort-select` | `<select id="sort-select">` | Sort options: `featured`, `price-asc`, `price-desc`, `rating` |
| `#price-range-slider` | `<input type="range" id="price-range-slider">` | Real-time price ceiling filter ($50 - $500) |
| `#price-range-value` | `<span id="price-range-value">` | Live label showing "$500" ceiling |
| `#instock-filter-check` | `<input type="checkbox" id="instock-filter-check">` | Toggle for in-stock items only |
| `#reset-filters-btn` | `<button id="reset-filters-btn">` | Resets search, price, category, and sorting |
| `#grid-toggle-2` | `<button id="grid-toggle-2">` | Switches grid to 2-column Editorial view |
| `#grid-toggle-4` | `<button id="grid-toggle-4">` | Switches grid to 4-column Compact grid view |
| `#catalog-count-label` | `<span id="catalog-count-label">` | Shows "Showing 12 pieces" |
| `#products-grid` | `<div id="products-grid">` | Dynamic product grid container (populated by JS) |
| `#empty-catalog-state` | `<div id="empty-catalog-state">` | Displayed when filters match 0 products with reset action |

### 6.4 Product Card Element Structure (Repeated in `#products-grid`)
Every product card rendered dynamically must follow this contract:
- Card Root: `<article class="product-card" data-product-id="${p.id}">`
- Visual Area: `<div class="product-card-media">`
  - Badges: `<span class="badge badge-${badge.toLowerCase()}">${badge}</span>`
  - Image Swap: `<img class="product-img primary" src="${p.images[0]}" alt="${p.name}">` + `<img class="product-img secondary" src="${p.images[1]}">`
  - Quick Action Overlay:
    - `<button class="card-btn-wishlist" data-product-id="${p.id}" title="Add to Wishlist"><svg>...</svg></button>`
    - `<button class="card-btn-quickview" data-product-id="${p.id}">QUICK VIEW</button>`
- Info Area: `<div class="product-card-info">`
  - Category / SKU: `<span class="product-card-category">${p.category.toUpperCase()} • ${p.sku}</span>`
  - Title: `<h3 class="product-card-title">${p.name}</h3>`
  - Rating: `<div class="product-rating">★ ${p.rating} (${p.reviewCount})</div>`
  - Price Block: `<div class="product-price-row"><span class="price-current">$${p.price.toFixed(2)}</span> ${originalPrice ? `<span class="price-original">$${p.originalPrice.toFixed(2)}</span>` : ''}</div>`
  - Swatch Preview: `<div class="product-swatches">${p.colors.map(...)}</div>`
  - Quick Add Sizes: `<div class="product-quick-sizes"><button class="quick-size-btn" data-size="S">S</button>...</div>`

### 6.5 Quick View Modal
| ID | Tag / Element | Purpose / Behavior |
| :--- | :--- | :--- |
| `#quickview-modal` | `<div id="quickview-modal" class="modal-backdrop">` | Modal backdrop overlay |
| `#quickview-close-btn` | `<button id="quickview-close-btn">` | Closes modal |
| `#quickview-image-main` | `<img id="quickview-image-main">` | High-res main product photo |
| `#quickview-thumbnails` | `<div id="quickview-thumbnails">` | Clickable image thumbnails |
| `#quickview-badge` | `<span id="quickview-badge">` | Product badge pill |
| `#quickview-title` | `<h2 id="quickview-title">` | Product title |
| `#quickview-price` | `<div id="quickview-price">` | Current price + original strikethrough |
| `#quickview-desc` | `<p id="quickview-desc">` | Full editorial description |
| `#quickview-details-list` | `<ul id="quickview-details-list">` | Composition, care, fabrication bullet points |
| `#quickview-colors-list` | `<div id="quickview-colors-list">` | Interactive color swatch buttons |
| `#quickview-color-label` | `<span id="quickview-color-label">` | Displays currently selected color name |
| `#quickview-sizes-list` | `<div id="quickview-sizes-list">` | Interactive size pills (XS, S, M, L, XL) |
| `#quickview-size-guide-btn`| `<button id="quickview-size-guide-btn">`| Opens Size Guide modal |
| `#quickview-qty-input` | `<input id="quickview-qty-input" type="number" value="1">` | Stepper quantity |
| `#quickview-qty-minus` | `<button id="quickview-qty-minus">` | Decrement qty |
| `#quickview-qty-plus` | `<button id="quickview-qty-plus">` | Increment qty |
| `#quickview-add-cart-btn` | `<button id="quickview-add-cart-btn">` | Adds selected size/color to cart drawer |
| `#quickview-stock-alert` | `<div id="quickview-stock-alert">` | "Only X items remaining" dynamic alert |

### 6.6 Slide-Over Cart Drawer
| ID | Tag / Element | Purpose / Behavior |
| :--- | :--- | :--- |
| `#cart-drawer` | `<aside id="cart-drawer" class="drawer">` | Slide-over cart container |
| `#cart-drawer-overlay` | `<div id="cart-drawer-overlay">` | Backdrop for cart drawer (click outside closes) |
| `#cart-close-btn` | `<button id="cart-close-btn">` | Top "✕" close button |
| `#cart-items-container` | `<div id="cart-items-container">` | Scrollable container for cart items |
| `#cart-empty-view` | `<div id="cart-empty-view">` | Shown when cart.length === 0 with "Start Shopping" button |
| `#cart-shipping-bar` | `<div id="cart-shipping-bar">` | Dynamic progress bar towards $150 free shipping |
| `#cart-shipping-msg` | `<span id="cart-shipping-msg">` | "Add $X more for FREE Global Express" or "Eligible for FREE Express" |
| `#promo-input` | `<input id="promo-input">` | Voucher entry input (e.g. "VOGUE20") |
| `#promo-apply-btn` | `<button id="promo-apply-btn">` | Validates and applies discount |
| `#promo-status-msg` | `<span id="promo-status-msg">` | Promo code feedback message |
| `#cart-subtotal` | `<span id="cart-subtotal">` | Pre-discount sum |
| `#cart-discount-row` | `<div id="cart-discount-row">` | Hidden until discount active |
| `#cart-discount-val` | `<span id="cart-discount-val">` | Discount amount in USD |
| `#cart-shipping-fee` | `<span id="cart-shipping-fee">` | "$0.00" or "$15.00" |
| `#cart-total` | `<span id="cart-total">` | Net total payable |
| `#cart-checkout-btn` | `<button id="cart-checkout-btn">` | Opens multi-step checkout modal |
| `#cart-clear-btn` | `<button id="cart-clear-btn">` | Empties cart |

### 6.7 Wishlist Slide-Over / Modal
| ID | Tag / Element | Purpose / Behavior |
| :--- | :--- | :--- |
| `#wishlist-drawer` | `<aside id="wishlist-drawer" class="drawer">` | Slide-over wishlist container |
| `#wishlist-close-btn` | `<button id="wishlist-close-btn">` | Closes wishlist drawer |
| `#wishlist-drawer-overlay`| `<div id="wishlist-drawer-overlay">` | Backdrop |
| `#wishlist-items-container`| `<div id="wishlist-items-container">` | Rendered wishlist items with move-to-bag / remove |
| `#wishlist-move-all-btn` | `<button id="wishlist-move-all-btn">` | Moves all wishlist items into cart in one click |
| `#wishlist-empty-view` | `<div id="wishlist-empty-view">` | Shown when wishlist is empty |

### 6.8 Multi-Step Checkout Modal
| ID | Tag / Element | Purpose / Behavior |
| :--- | :--- | :--- |
| `#checkout-modal` | `<div id="checkout-modal" class="modal-backdrop">` | Modal backdrop |
| `#checkout-close-btn` | `<button id="checkout-close-btn">` | Dismiss modal |
| `#checkout-step-1` | `<div id="checkout-step-1" class="checkout-step active">` | Step 1: Shipping Address |
| `#checkout-step-2` | `<div id="checkout-step-2" class="checkout-step">` | Step 2: Payment Details (Simulated Gateway) |
| `#checkout-step-3` | `<div id="checkout-step-3" class="checkout-step">` | Step 3: Order Confirmation & Receipt |
| `#checkout-step-indicator`| `<div id="checkout-step-indicator">` | Visual step 1 -> 2 -> 3 breadcrumb |
| `#shipping-form` | `<form id="shipping-form">` | Form with inputs: `#ship-name`, `#ship-email`, `#ship-address`, `#ship-city`, `#ship-zip`, `#ship-country` |
| `#to-step2-btn` | `<button id="to-step2-btn">` | Validates step 1 and advances to step 2 |
| `#payment-form` | `<form id="payment-form">` | Form with inputs: `#card-number`, `#card-exp`, `#card-cvv`, `#card-holder` |
| `#back-to-step1-btn` | `<button id="back-to-step1-btn">` | Return to shipping form |
| `#complete-order-btn` | `<button id="complete-order-btn">` | Submits payment, triggers simulated processing animation |
| `#order-confirmation-box`| `<div id="order-confirmation-box">` | Success checkmark, generated Order ID (e.g. `ATL-83921`), order items summary, delivery estimation |
| `#finish-shopping-btn` | `<button id="finish-shopping-btn">` | Closes checkout, empties cart, returns to catalog |

### 6.9 Size Guide Modal
| ID | Tag / Element | Purpose / Behavior |
| :--- | :--- | :--- |
| `#sizeguide-modal` | `<div id="sizeguide-modal" class="modal-backdrop">` | Modal backdrop |
| `#sizeguide-close-btn` | `<button id="sizeguide-close-btn">` | Closes size guide modal |
| `#unit-toggle-cm` | `<button id="unit-toggle-cm">` | Switches table to Metric (cm) |
| `#unit-toggle-in` | `<button id="unit-toggle-in">` | Switches table to Imperial (inches) |
| `#sizeguide-table-body` | `<tbody id="sizeguide-table-body">` | Populated with accurate measurements for XS-XL |

### 6.10 Toast Notification System
| ID | Tag / Element | Purpose / Behavior |
| :--- | :--- | :--- |
| `#toast-container` | `<div id="toast-container">` | Fixed bottom-right toast message container |

---

## 7. Event Handlers & State Management Contract

### 7.1 Initialization
```javascript
function initApp(): void
// 1. Load MOCK_PRODUCTS into AppState.products
// 2. Load cart & wishlist from localStorage (fallback to empty)
// 3. Render catalog with AppState.products
// 4. Update cart and wishlist badge counts
// 5. Attach all event listeners
// 6. Preload size guide data
```

### 7.2 Catalog Filtering & Search
```javascript
function filterCatalog(): void
// Reads:
// - AppState.activeFilters.category
// - AppState.activeFilters.searchQuery
// - AppState.activeFilters.priceMax
// - AppState.activeFilters.sortBy
// - AppState.activeFilters.inStockOnly
// Updates AppState.filteredProducts and calls renderProducts(AppState.filteredProducts)

function handleCategoryChange(category: string): void
// Sets activeFilters.category, updates active UI class on pill buttons, triggers filterCatalog()

function handleSearchInput(e: Event): void
// Debounced (100ms) or immediate live filter on AppState.activeFilters.searchQuery

function handlePriceSlider(val: number): void
// Updates activeFilters.priceMax, updates #price-range-value label, calls filterCatalog()

function handleSortChange(sortMode: string): void
// Sets activeFilters.sortBy ('featured', 'price-asc', 'price-desc', 'rating') and re-renders

function handleGridToggle(columns: 2 | 4): void
// Toggles #products-grid class 'columns-2' vs 'columns-4', updates button active styles
```

### 7.3 Cart Management Functions
```javascript
function addToCart(productId: string, size?: string, colorName?: string, quantity: number = 1): void
// - Validates size and color selection (defaults to product.sizes[0] and product.colors[0] if not supplied via quick-add)
// - Constructs unique cartItemId: `${productId}-${size}-${colorName}`
// - Checks if already in cart; increments quantity or appends new CartItem
// - Saves to localStorage
// - Triggers updateCartUI()
// - Opens cart drawer automatically
// - Triggers showToast(`${product.name} added to bag`)

function removeFromCart(cartItemId: string): void
// - Removes item matching cartItemId
// - Updates state, recalculates totals, updates localStorage & UI

function updateCartQuantity(cartItemId: string, delta: number): void
// - Adjusts item.quantity by delta (+1 or -1)
// - If quantity reaches 0, prompts or automatically removes item
// - Recalculates totals and re-renders cart

function applyPromoCode(code: string): boolean
// - Checks against valid codes (e.g. "VOGUE20" for 20% off, "WELCOME10" for 10% off)
// - Applies discount to AppState.promoCode
// - Recalculates summary, updates UI feedback, triggers showToast

function calculateCartTotals(): { subtotal: number; discount: number; shipping: number; total: number }
// - Computes subtotal
// - Computes discount if promoCode active
// - Free shipping if subtotal >= 150, else $15.00
// - Computes final total
```

### 7.4 Wishlist Functions
```javascript
function toggleWishlist(productId: string): void
// - If AppState.wishlist has product: remove it, show toast "Removed from wishlist"
// - Else: add it, show toast "Saved to wishlist" with heart pop animation
// - Updates localStorage, updates badge count and heart button states
// - If wishlist drawer is open, re-renders wishlist items

function moveWishlistToCart(productId: string): void
// - Adds product with default size/color to cart, removes from wishlist
// - Updates both drawers

function moveAllWishlistToCart(): void
// - Loops over all items in AppState.wishlist, adds them to cart, clears wishlist
```

### 7.5 Quick View & Modal Controllers
```javascript
function openQuickView(productId: string): void
// - Sets AppState.activeQuickViewProduct
// - Injects images, details, swatches, and size selectors into #quickview-modal
// - Resets quantity to 1
// - Opens modal with CSS class 'active'
// - Prevents background body scroll

function closeQuickView(): void
// - Closes modal, restores body scroll

function openSizeGuide(category?: string): void
// - Populates #sizeguide-table-body with measurements for category
// - Opens #sizeguide-modal

function openCheckout(): void
// - Validates cart has >= 1 item
// - Closes cart drawer, resets to step 1
// - Injects order summary into checkout sidebar
// - Opens #checkout-modal

function submitCheckoutStep1(shippingData: object): void
// - Validates name, address, email, zip
// - Advances to Step 2 (Payment)

function submitCheckoutStep2(paymentData: object): void
// - Validates 16-digit card and CVV
// - Displays simulated processing spinner (1.2s)
// - Generates random order ID (e.g. "ATL-98431")
// - Empties cart, clears localStorage
// - Advances to Step 3 (Order Confirmation)
```

### 7.6 Toast Notification System
```javascript
function showToast(message: string, type: 'success' | 'info' | 'alert' = 'success'): void
// - Creates toast element with icon and message
// - Appends to #toast-container
// - Automatically fades out and unmounts after 3000ms
```

---

## 8. Zero-Dead-Button Interactive Feature Map & Action Matrix

Every single interactive element on the page MUST have an active event listener and immediate feedback:

| Control Element | Trigger / Event | Action Executed & DOM Feedback |
| :--- | :--- | :--- |
| Announcement Promo Code | Click / Copy | Copies `"VOGUE20"` to clipboard & shows toast `"Promo code copied!"` |
| Brand Logo `#nav-brand-logo` | Click | Resets all filters, clears search, smooth scrolls to top of catalog |
| Category Nav Links (`#category-nav-list a`) | Click | Filters catalog to chosen category, updates pill styles, scrolls to catalog |
| Search Toggle Button `#search-toggle-btn` | Click | Toggles visibility of `#search-bar-container` and focuses `#search-input` |
| Search Input `#search-input` | `input` | Live filters product list by title/description matching query |
| Search Clear Button `#search-clear-btn` | Click | Empties search input, restores catalog display |
| Wishlist Nav Button `#wishlist-toggle-btn`| Click | Opens `#wishlist-drawer` slide-over |
| Cart Nav Button `#cart-toggle-btn` | Click | Opens `#cart-drawer` slide-over |
| Hero "EXPLORE COLLECTION" `#hero-cta-shop`| Click | Smooth scrolls to `#catalog-section` |
| Hero "VIEW LOOKBOOK" `#hero-cta-lookbook`| Click | Smooth scrolls to catalog & automatically switches to 2-column view |
| Category Pills (`.cat-pill`) | Click | Sets category filter, highlights clicked pill, re-renders products |
| Sort Dropdown `#sort-select` | `change` | Re-orders cards by price, rating, or novelty |
| Price Slider `#price-range-slider` | `input` | Live updates `#price-range-value` and filters cards |
| In-Stock Checkbox `#instock-filter-check`| `change` | Filters out out-of-stock items |
| Reset Filters `#reset-filters-btn` | Click | Resets all filter controls to initial default values |
| Grid Toggle 2-Col `#grid-toggle-2` | Click | Sets grid to 2-column large editorial layout |
| Grid Toggle 4-Col `#grid-toggle-4` | Click | Sets grid to 4-column standard e-commerce layout |
| Card Wishlist Heart Button | Click | Toggles item in wishlist, triggers heart pop animation, updates badge & toast |
| Card Quick View Button | Click | Opens `#quickview-modal` with clicked product's complete data |
| Card Quick Size Button | Click | Instantly adds clicked size of that product into the cart |
| QuickView Swatches | Click | Selects active color swatch, updates color label and main image |
| QuickView Sizes | Click | Highlights chosen size, clears validation warning |
| QuickView Qty Stepper (+ / -) | Click | Increments/decrements quantity (minimum 1) |
| QuickView Add to Bag Button | Click | Adds item with selected attributes to cart, closes modal, opens cart drawer |
| QuickView Size Guide Button | Click | Opens `#sizeguide-modal` |
| Cart Item Quantity (+ / -) | Click | Updates quantity and recalculates shipping/total instantly |
| Cart Item Remove Button | Click | Removes line item from cart drawer with fade-out animation |
| Cart Promo Code Apply `#promo-apply-btn`| Click | Validates promo code, recalculates discount, displays success feedback |
| Cart Shipping Progress Bar | Dynamic | Automatically animates towards $150 based on subtotal |
| Cart Clear Button `#cart-clear-btn` | Click | Confirms and empties the entire cart |
| Cart Checkout Button `#cart-checkout-btn`| Click | Opens `#checkout-modal` Step 1 |
| Wishlist Item "Move to Bag" | Click | Transfers item from wishlist to cart |
| Wishlist "Move All to Bag" | Click | Transfers all saved items to cart at once |
| Wishlist Item Remove | Click | Removes item from wishlist |
| Checkout Step 1 Next `#to-step2-btn` | Click | Validates address inputs; advances to Step 2 |
| Checkout Step 2 Back `#back-to-step1-btn` | Click | Returns to Step 1 without losing form inputs |
| Checkout Step 2 Pay `#complete-order-btn` | Click | Simulates payment processing (loader), advances to Step 3 |
| Checkout Step 3 Finish `#finish-shopping-btn`| Click | Closes modal, resets cart, redirects to catalog top |
| Size Guide Unit Switcher (cm / in) | Click | Toggles size measurements between metric and imperial |
| All Modal & Drawer Overlay Backdrops | Click | Closes active modal or drawer |
| All Close "✕" Buttons | Click | Closes respective modal or drawer |
| ESC Keydown Listener | `keydown` (Escape)| Closes any currently active modal or drawer |

---

## 9. Quality Assurance & Verification Contract for Zoro

When Zoro (Builder) implements this specification, the implementation must be validated against the following tests:
1. **Zero Dead Buttons Verification:**
   - Every button, input, anchor, tab, and icon must have an active handler. There are NO dummy `href="#"` or dead clickable divs.
2. **Catalog Integrity:**
   - All 12 items from `MOCK_PRODUCTS` must render on page load with valid images, badges, prices, and interactive buttons.
3. **Responsive Grid Layout:**
   - Grid toggle must switch between 2-column lookbook mode and 4-column compact mode smoothly.
4. **Attribute Selection in Quick View:**
   - Changing swatches changes color name; selecting size enables adding to bag.
5. **Cart Math Accuracy:**
   - `Subtotal = sum(item.price * qty)`
   - `Shipping = subtotal >= 150 ? 0 : 15`
   - `Discount = (promoCode === 'VOGUE20') ? subtotal * 0.20 : 0`
   - `Total = subtotal - discount + shipping`
6. **Multi-Step Checkout State Machine:**
   - Step 1 requires non-empty inputs for Name, Email, Address.
   - Step 2 requires valid card format.
   - Step 3 renders realistic order confirmation number, estimated delivery date (5 business days from today), and cleared cart badge.
7. **Storage Persistence:**
   - Cart and wishlist state must persist across browser tab refreshes using `localStorage`.

---

*Architected by Nami (Group 1 - Architect) — Straw Hat Crew GROUP1. Specification is complete, concrete, and locked for Zoro.*