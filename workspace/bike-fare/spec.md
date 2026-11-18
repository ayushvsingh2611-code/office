# System Architecture & Technical Contract: Apex MotoVault
**Project:** Premium Motorcycle Marketplace & Dealership Experience Platform  
**Architect:** Robin (Group 2 - Architect)  
**Target Builder:** Shanks (Group 2 - Builder)  
**Status:** Approved & Frozen for Implementation  

---

## 1. Executive Summary & Brand Blueprint

### 1.1 Brand Identity & Real-World Precedents
Apex MotoVault is a high-fidelity replica and synthesis of premier motorcycle marketplaces and digital showrooms (modeled on **CycleTrader**, **RevZilla**, and the direct digital showrooms of **Ducati** and **BMW Motorrad**).

The application delivers an end-to-end, zero-friction motorcycle buying and selling experience featuring:
- Live faceted filtering and multi-attribute search across new and certified pre-owned bikes.
- Full vehicle detail modal with multi-angle galleries, key performance metrics, and equipment lists.
- **Synthesized Engine Exhaust Sound Simulator** (Web Audio API) letting users hear the distinct exhaust signature (Inline-4, 90° V-Twin, Triple, or Boxer Twin) of each bike before purchase.
- **Side-by-side 3-bike comparison matrix** with highlighted spec differences.
- **Real-time Financing / Loan EMI Calculator** with interactive sliders for down payment, interest rates, and loan terms.
- **"Sell Your Bike" Instant Trade-in Valuation Estimator** with instant appraisal logic.
- **Test Ride Booking Modal & Direct Deposit Reservation Checkout** with mock payment verification.
- **Wishlist & Cart Management** with persistent storage (`localStorage`) and dynamic notification badges.

---

## 2. Design System & Theme Tokens

### 2.1 Color Palette
```css
:root {
  /* Brand Accents */
  --color-primary: #FF3E1D;         /* High-octane Apex Red */
  --color-primary-hover: #E02F10;   /* Deep Throttle Red */
  --color-primary-glow: rgba(255, 62, 29, 0.25);
  --color-accent: #F59E0B;          /* Amber Gold Indicator */
  --color-success: #10B981;         /* Emerald verified/in-stock */
  --color-info: #3B82F6;            /* Tech Blue */
  --color-danger: #EF4444;

  /* Surfaces & Backgrounds */
  --bg-canvas: #0A0C10;             /* Ultra-deep Asphalt Black */
  --bg-surface-1: #12161F;          /* Primary Card & Navigation Surface */
  --bg-surface-2: #1B212D;          /* Secondary Card / Nested Containers */
  --bg-surface-3: #242C3B;          /* Elevated Modals / Dropdowns */
  --bg-surface-hover: #2D3748;

  /* Borders & Dividers */
  --border-subtle: #1F2836;
  --border-active: #374151;
  --border-focus: #FF3E1D;

  /* Typography */
  --text-main: #F3F4F6;             /* Cool White */
  --text-muted: #9CA3AF;            /* Neutral Slate */
  --text-dim: #6B7280;              /* Muted Carbon */
  --text-inverse: #0A0C10;

  /* Typography Families */
  --font-heading: 'Cabinet Grotesk', 'Teko', 'Montserrat', sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Elevation Shadows */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.6);
  --shadow-lg: 0 8px 30px rgba(0, 0, 0, 0.8);
  --shadow-neon: 0 0 20px rgba(255, 62, 29, 0.35);

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;
}
```

---

## 3. High-Fidelity Pre-loaded Dataset

The application initializes with 10 production-grade motorcycle models covering all major categories: Sport, Cruiser, Adventure/Touring, Cafe Racer/Naked, and Dirt/Dual-Sport.

```javascript
const INITIAL_BIKES_DATA = [
  {
    id: "bike-001",
    make: "Ducati",
    model: "Panigale V4 S",
    year: 2024,
    condition: "New",
    category: "Sportbike",
    price: 31995,
    originalPrice: 32995,
    monthlyPayment: 489,
    mileage: 12,
    engine: "Desmosedici Stradale 90° V4",
    displacement: "1,103 cc",
    displacementNumber: 1103,
    horsepower: 215.5,
    torque: "91.2 lb-ft @ 10,000 RPM",
    weight: "431 lbs (wet)",
    seatHeight: '32.9 in',
    fuelCapacity: "4.49 gal",
    topSpeed: "186+ mph",
    transmission: "6-speed w/ DQS EVO 2 Quickshifter",
    color: "Ducati Red with Dark Stealth Wheels",
    audioProfile: "v4-screamer", // Web Audio type
    badge: "Track Ready",
    featured: true,
    rating: 4.9,
    reviewsCount: 38,
    location: "Miami Flagship Vault, FL",
    dealerName: "Apex Performance Vault",
    images: [
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1200&q=80"
    ],
    features: ["Öhlins Smart EC 2.0 Suspension", "Brembo Stylema Calipers", "Cornering ABS EVO", "Ducati Traction Control (DTC) EVO 3", "Riding Modes: Race A/Race B/Sport/Street", "5-inch Full TFT Display"]
  },
  {
    id: "bike-002",
    make: "Yamaha",
    model: "YZF-R1 World GP 60th Anniversary",
    year: 2024,
    condition: "New",
    category: "Sportbike",
    price: 18699,
    originalPrice: 19199,
    monthlyPayment: 295,
    mileage: 5,
    engine: "Crossplane Inline-4 (CP4)",
    displacement: "998 cc",
    displacementNumber: 998,
    horsepower: 198.0,
    torque: "83.1 lb-ft @ 11,500 RPM",
    weight: "448 lbs",
    seatHeight: '33.7 in',
    fuelCapacity: "4.50 gal",
    topSpeed: "186 mph",
    transmission: "6-speed with QSS (Up & Down)",
    color: "Historic White & Red Chain Block",
    audioProfile: "inline4-crossplane",
    badge: "Limited Edition",
    featured: true,
    rating: 4.8,
    reviewsCount: 52,
    location: "Austin Supercenter, TX",
    dealerName: "Apex Southwest",
    images: [
      "https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80"
    ],
    features: ["MotoGP-Derived Crossplane Crankshaft", "Cable-less Ride-by-Wire (APSG)", "Titanium Intake Valves", "KYB Fully Adjustable Suspension", "Lean-Sensitive Traction Control", "Slide Control System (SCS)"]
  },
  {
    id: "bike-003",
    make: "Harley-Davidson",
    model: "Street Glide ST Special",
    year: 2023,
    condition: "Certified Pre-Owned",
    category: "Cruiser",
    price: 24999,
    originalPrice: 29990,
    monthlyPayment: 382,
    mileage: 3450,
    engine: "Milwaukee-Eight 117 V-Twin",
    displacement: "1,923 cc",
    displacementNumber: 1923,
    horsepower: 106.0,
    torque: "127.0 lb-ft @ 3,750 RPM",
    weight: "814 lbs",
    seatHeight: '26.8 in',
    fuelCapacity: "6.00 gal",
    topSpeed: "115 mph",
    transmission: "6-Speed Cruise Drive",
    color: "Gunship Gray with Bronze Trim",
    audioProfile: "vtwin-heavy",
    badge: "Certified Pre-Owned",
    featured: true,
    rating: 4.9,
    reviewsCount: 44,
    location: "Nashville Moto Hub, TN",
    dealerName: "Apex Heritage Motors",
    images: [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558981420-87aa92103a5a?auto=format&fit=crop&w=1200&q=80"
    ],
    features: ["Boom! Box GTS Infotainment Touchscreen", "Reflex Defensive Rider Systems (RDRS)", "Screamin' Eagle Heavy Breather Intake", "Stretched Saddlebags with Keyless Lock", "Daymaker LED Headlamp", "Cruise Control"]
  },
  {
    id: "bike-004",
    make: "BMW",
    model: "R 1250 GS Adventure Trophy",
    year: 2024,
    condition: "New",
    category: "Adventure",
    price: 24895,
    originalPrice: 25495,
    monthlyPayment: 375,
    mileage: 0,
    engine: "Boxer Twin w/ BMW ShiftCam",
    displacement: "1,254 cc",
    displacementNumber: 1254,
    horsepower: 136.0,
    torque: "105.0 lb-ft @ 6,250 RPM",
    weight: "591 lbs",
    seatHeight: '35.0 in',
    fuelCapacity: "7.90 gal (Long Range)",
    topSpeed: "135 mph",
    transmission: "6-speed w/ Gear Shift Assist Pro",
    color: "Gravity Blue Metallic Matt",
    audioProfile: "boxer-twin",
    badge: "Globe Trotter",
    featured: true,
    rating: 5.0,
    reviewsCount: 61,
    location: "Denver Mountain Hub, CO",
    dealerName: "Apex Alpine Adventure",
    images: [
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80"
    ],
    features: ["Dynamic Electronic Suspension Adjustment (ESA)", "Enduro Pro Ride Mode", "Aluminum Hard Pannier Mounts", "TFT Connectivity with Turn-by-Turn GPS", "Full LED Adaptive Headlight with Swivel", "Heated Grips & Hill Start Assist"]
  },
  {
    id: "bike-005",
    make: "Kawasaki",
    model: "Ninja ZX-10R KRT Edition",
    year: 2024,
    condition: "New",
    category: "Sportbike",
    price: 17399,
    originalPrice: 17899,
    monthlyPayment: 265,
    mileage: 18,
    engine: "Liquid-Cooled 16-Valve Inline-4",
    displacement: "998 cc",
    displacementNumber: 998,
    horsepower: 203.0,
    torque: "84.6 lb-ft @ 11,300 RPM",
    weight: "456 lbs",
    seatHeight: '32.9 in',
    fuelCapacity: "4.50 gal",
    topSpeed: "186 mph",
    transmission: "Cassette 6-speed with KQS",
    color: "Lime Green / Ebony",
    audioProfile: "inline4-screamer",
    badge: "WSBK Champion",
    featured: false,
    rating: 4.7,
    reviewsCount: 29,
    location: "Los Angeles Flagship, CA",
    dealerName: "Apex West Coast",
    images: [
      "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?auto=format&fit=crop&w=1200&q=80"
    ],
    features: ["Integrated Aerodynamic Winglets", "Öhlins Electronic Steering Damper", "Kawasaki Launch Control Mode (KLCM)", "Sport-Kawasaki Traction Control (S-KTRC)", "Integrated Cruise Control", "Full TFT Instrument Panel"]
  },
  {
    id: "bike-006",
    make: "Triumph",
    model: "Speed Triple 1200 RS",
    year: 2024,
    condition: "New",
    category: "Naked",
    price: 18895,
    originalPrice: 19495,
    monthlyPayment: 288,
    mileage: 4,
    engine: "Liquid-Cooled 12-Valve DOHC Inline 3-Cylinder",
    displacement: "1,160 cc",
    displacementNumber: 1160,
    horsepower: 177.5,
    torque: "92.0 lb-ft @ 9,000 RPM",
    weight: "437 lbs",
    seatHeight: '32.7 in',
    fuelCapacity: "4.10 gal",
    topSpeed: "165 mph",
    transmission: "6-speed with Triumph Shift Assist",
    color: "Matt Silver Ice & Yellow Accents",
    audioProfile: "triple-growl",
    badge: "Street Fighter",
    featured: true,
    rating: 4.9,
    reviewsCount: 33,
    location: "Chicago Metro Vault, IL",
    dealerName: "Apex Midwest",
    images: [
      "https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80"
    ],
    features: ["Öhlins NIX30 Forks & TTX36 Shock", "Brembo Stylema Monobloc Calipers", "Keyless Ignition & Fuel Filler Cap", "5 Ride Modes (Rain/Road/Sport/Track/Rider)", "Carbon Fiber Front Mudguard", "My Triumph Connectivity System"]
  },
  {
    id: "bike-007",
    make: "Honda",
    model: "CBR1000RR-R Fireblade SP",
    year: 2023,
    condition: "Certified Pre-Owned",
    category: "Sportbike",
    price: 26500,
    originalPrice: 28900,
    monthlyPayment: 399,
    mileage: 1820,
    engine: "16-Valve DOHC Inline-4",
    displacement: "999 cc",
    displacementNumber: 999,
    horsepower: 214.0,
    torque: "83.0 lb-ft @ 12,500 RPM",
    weight: "443 lbs",
    seatHeight: '32.7 in',
    fuelCapacity: "4.25 gal",
    topSpeed: "186+ mph",
    transmission: "6-speed w/ Quickshifter",
    color: "Grand Prix Red HRC Tricolor",
    audioProfile: "inline4-screamer",
    badge: "HRC Certified",
    featured: false,
    rating: 4.8,
    reviewsCount: 19,
    location: "Austin Supercenter, TX",
    dealerName: "Apex Southwest",
    images: [
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=1200&q=80"
    ],
    features: ["MotoGP Winglet Aero Downforce", "Öhlins NPX Smart-EC Fork", "Akrapovič Titanium Factory Muffler", "Brembo Stylema Master Cylinder", "Honda Selectable Torque Control (HSTC)", "Wheelie & Launch Control"]
  },
  {
    id: "bike-008",
    make: "KTM",
    model: "1290 Super Duke R Evo 'The Beast'",
    year: 2024,
    condition: "New",
    category: "Naked",
    price: 20499,
    originalPrice: 20999,
    monthlyPayment: 312,
    mileage: 8,
    engine: "LC8 75° V-Twin DOHC",
    displacement: "1,301 cc",
    displacementNumber: 1301,
    horsepower: 180.0,
    torque: "103.0 lb-ft @ 8,000 RPM",
    weight: "441 lbs (dry)",
    seatHeight: '32.8 in',
    fuelCapacity: "4.20 gal",
    topSpeed: "180 mph",
    transmission: "PANKL 6-speed w/ Quickshifter+",
    color: "Signature KTM Orange / Stealth Black",
    audioProfile: "vtwin-heavy",
    badge: "The Beast",
    featured: true,
    rating: 4.9,
    reviewsCount: 41,
    location: "Miami Flagship Vault, FL",
    dealerName: "Apex Performance Vault",
    images: [
      "https://images.unsplash.com/photo-1558981420-87aa92103a5a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1200&q=80"
    ],
    features: ["WP Semi-Active Technology (SAT) Suspension", "Anti-Dive Function", "Track Mode with 9-Level Spin Adjust", "Supermoto ABS Mode", "Cruise Control & TPMS", "Ultralight Trellis Frame"]
  },
  {
    id: "bike-009",
    make: "Indian Motorcycle",
    model: "Scout Bobber Twenty",
    year: 2024,
    condition: "New",
    category: "Cruiser",
    price: 13249,
    originalPrice: 13999,
    monthlyPayment: 215,
    mileage: 0,
    engine: "Liquid-Cooled 60° V-Twin",
    displacement: "1,133 cc",
    displacementNumber: 1133,
    horsepower: 100.0,
    torque: "72.0 lb-ft @ 5,900 RPM",
    weight: "553 lbs",
    seatHeight: '25.6 in',
    fuelCapacity: "3.30 gal",
    topSpeed: "125 mph",
    transmission: "6-Speed Manual",
    color: "Stealth Smoke / Chrome Spoke Wheels",
    audioProfile: "vtwin-heavy",
    badge: "Heritage Bobber",
    featured: false,
    rating: 4.7,
    reviewsCount: 37,
    location: "Nashville Moto Hub, TN",
    dealerName: "Apex Heritage Motors",
    images: [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558981420-87aa92103a5a?auto=format&fit=crop&w=1200&q=80"
    ],
    features: ["Mini-Ape Hanger Handlebars", "Wire Spoke Wheels", "Floating Solo Leather Saddle", "Blacked-Out Dual Exhaust", "Low-Slung Stance", "USB Charging Port"]
  },
  {
    id: "bike-010",
    make: "Suzuki",
    model: "Hayabusa 25th Anniversary Edition",
    year: 2024,
    condition: "New",
    category: "Sportbike",
    price: 19599,
    originalPrice: 20199,
    monthlyPayment: 299,
    mileage: 2,
    engine: "1,340 cc DOHC 4-Cylinder",
    displacement: "1,340 cc",
    displacementNumber: 1340,
    horsepower: 190.0,
    torque: "110.6 lb-ft @ 7,000 RPM",
    weight: "582 lbs",
    seatHeight: '31.5 in',
    fuelCapacity: "5.30 gal",
    topSpeed: "186 mph (restricted)",
    transmission: "6-speed Bi-Directional Quick Shift",
    color: "Glass Blaze Orange & Glass Sparkle Black",
    audioProfile: "inline4-screamer",
    badge: "Hypersport Legend",
    featured: true,
    rating: 5.0,
    reviewsCount: 74,
    location: "Los Angeles Flagship, CA",
    dealerName: "Apex West Coast",
    images: [
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?auto=format&fit=crop&w=1200&q=80"
    ],
    features: ["Suzuki Intelligent Ride System (S.I.R.S.)", "Launch Control System (3 Modes)", "Motion Track Brake System (Cornering ABS)", "Active Speed Limiter", "Brembo Stylema Brake Calipers", "Anniversary Tank Emblem & Gold Anodizing"]
  }
];
```

---

## 4. DOM Element ID Dictionary & Hierarchy Contract

Every single HTML element interacting with JavaScript MUST use the exact IDs declared below. Shanks will use these direct IDs without divergence.

### 4.1 Top Announcement & Global Navigation Bar
| DOM Element ID | Tag | Purpose |
|---|---|---|
| `#top-bar` | `div` | Top utility row (dealership hotline, zip code changer, finance fast-link) |
| `#top-zip-btn` | `button` | Toggle zip code / location selector modal |
| `#current-zip-display` | `span` | Displays active zip code (Default: "33101 - Miami, FL") |
| `#top-hotline-btn` | `a` | Dealer VIP concierge direct phone trigger |
| `#top-trade-in-link` | `button` | Direct shortcut to trade-in calculator |
| `#main-navbar` | `header` | Sticky main navigation bar |
| `#nav-logo-btn` | `a` | Logo click resets filter and scrolls to top |
| `#nav-search-input` | `input` | Live keyword input for instant search dropdown |
| `#nav-search-clear-btn`| `button` | Clear keyword button inside search box |
| `#nav-search-dropdown` | `div` | Instant autocomplete search results container |
| `#nav-category-links` | `nav` | Quick navigation links (`All`, `Sportbike`, `Cruiser`, `Adventure`, `Naked`) |
| `#nav-compare-btn` | `button` | Opens Compare Drawer |
| `#nav-compare-count` | `span` | Badge displaying count of items in compare drawer (0-3) |
| `#nav-wishlist-btn` | `button` | Opens Wishlist Drawer / Modal |
| `#nav-wishlist-count`| `span` | Badge displaying count of saved wishlist bikes |
| `#nav-cart-btn` | `button` | Opens Cart / Deposit Reservations Drawer |
| `#nav-cart-count` | `span` | Badge displaying count of reservations in cart |
| `#nav-sell-btn` | `button` | Opens "Sell Your Bike / Instant Trade-In" Modal |

### 4.2 Hero Banner & Quick Filter Strip
| DOM Element ID | Tag | Purpose |
|---|---|---|
| `#hero-section` | `section`| Premium dark hero with moto video/image backdrop & headline |
| `#hero-cta-explore` | `button` | Smooth scrolls to `#inventory-section` |
| `#hero-cta-sell` | `button` | Opens Trade-In Modal |
| `#quick-filter-strip` | `div` | High-impact quick filter card floating above fold |
| `#quick-make-select` | `select` | Quick dropdown: "All Makes", "Ducati", "Yamaha", etc. |
| `#quick-category-select`| `select`| Quick dropdown: "All Categories", "Sportbike", "Cruiser", etc. |
| `#quick-budget-select` | `select` | Quick dropdown: "Any Price", "< $15k", "$15k-$25k", "> $25k" |
| `#quick-condition-select`| `select`| Quick dropdown: "Any Condition", "New", "Certified Pre-Owned" |
| `#quick-filter-submit`| `button` | Applies quick filters and scrolls smoothly to inventory grid |

### 4.3 Inventory Section & Faceted Sidebar
| DOM Element ID | Tag | Purpose |
|---|---|---|
| `#inventory-section` | `section`| Main listing section container |
| `#category-pills-bar` | `div` | Horizontal scrollable category pill buttons |
| `#sidebar-filters` | `aside` | Desktop & collapsible mobile sidebar filter panel |
| `#filter-search-input`| `input` | Keyword search in sidebar |
| `#filter-make-container`| `div` | Checkbox list for makes (Ducati, Yamaha, BMW, etc.) |
| `#filter-condition-container`| `div` | Radio or checkboxes for New / Certified Pre-Owned |
| `#filter-price-min` | `input` | Min price number input |
| `#filter-price-max` | `input` | Max price number input |
| `#filter-price-slider` | `input` (range) | Range slider for maximum price cap |
| `#filter-price-display`| `span` | Dynamic label showing slider current value |
| `#filter-engine-min` | `input` | Minimum engine displacement cc (e.g. 500, 1000, 1500) |
| `#filter-transmission`| `select`| Transmission filter (All, 6-Speed, Quickshifter equipped) |
| `#reset-all-filters-btn`| `button`| Resets all filters back to default state |
| `#inventory-header` | `div` | Header above grid showing results counter & sorting |
| `#results-counter` | `span` | Displays `Showing X of Y Motorcycles` |
| `#active-filter-chips`| `div` | Container of removable tags for active filters |
| `#sort-select` | `select` | Dropdown: Price Low-High, Price High-Low, HP High-Low, Year Newest |
| `#bikes-grid` | `div` | CSS Grid container rendering bike cards |
| `#no-results-state` | `div` | Empty state when no bikes match criteria with reset CTA |

### 4.4 Bike Card Interactive Elements (Inside Card Template)
Every bike card generated inside `#bikes-grid` must use uniform data-attributes and target classes:
- `.bike-card` with `data-id="bike-001"`
- `.card-wishlist-toggle` with `data-id="bike-001"` (Heart icon toggle)
- `.card-compare-toggle` with `data-id="bike-001"` (Checkbox / Compare toggle)
- `.card-detail-btn` with `data-id="bike-001"` (Opens Detail Modal)
- `.card-exhaust-sound-btn` with `data-id="bike-001"` (Triggers Engine Audio Preview)
- `.card-reserve-btn` with `data-id="bike-001"` (Adds bike deposit to cart or opens checkout)

### 4.5 Modals & Drawers
| DOM Element ID | Purpose |
|---|---|
| `#bike-detail-modal` | Main vehicle details modal (gallery, specs, finance, contact) |
| `#detail-modal-close` | Closes detail modal |
| `#detail-modal-body` | Dynamic content container for vehicle details |
| `#exhaust-audio-modal` | Interactive Exhaust & Throttle Simulator Modal |
| `#audio-modal-close` | Closes sound simulator modal |
| `#throttle-rev-btn` | Button / Slider to rev engine and synthesize sound |
| `#sound-wave-canvas` | Canvas element rendering live dynamic audio visualizer waveforms |
| `#compare-drawer` | Bottom or side drawer displaying side-by-side spec comparison |
| `#compare-drawer-close` | Closes comparison drawer |
| `#compare-bikes-content` | Container where compared bikes (up to 3) are rendered side-by-side |
| `#compare-clear-all-btn`| Clears all items in comparison |
| `#wishlist-drawer` | Drawer showing all saved favorite bikes |
| `#wishlist-drawer-close`| Closes wishlist drawer |
| `#wishlist-items-container`| Container for saved wishlist cards |
| `#cart-drawer` | Drawer showing reserved motorcycles / refundable deposits ($500 down) |
| `#cart-drawer-close` | Closes cart drawer |
| `#cart-items-container`| Container for cart items |
| `#cart-subtotal-price` | Displays subtotal reservation deposit amount |
| `#cart-checkout-btn` | Proceeds to Checkout / Reservation Finalization Modal |
| `#checkout-modal` | Deposit checkout modal with billing & DL verification |
| `#checkout-modal-close`| Closes checkout modal |
| `#checkout-form` | Form submission for bike reservation deposit |
| `#checkout-success-view`| Success confirmation with reservation ID and pickup instructions |
| `#sell-bike-modal` | "Sell Your Bike / Instant Valuation" multi-step modal |
| `#sell-modal-close` | Closes sell modal |
| `#sell-bike-form` | Form with Make, Model, Year, Mileage, Condition fields |
| `#sell-valuation-result`| Dynamic container displaying instant cash offer range & trade-in value |
| `#test-ride-modal` | Modal to schedule in-person test ride |
| `#test-ride-modal-close`| Closes test ride modal |
| `#test-ride-form` | Form with Dealer selection, Date/Time picker, License status |
| `#finance-calc-modal` | Fullscreen / popover interactive loan calculator |
| `#finance-calc-close` | Closes finance calculator modal |
| `#calc-price-input` | Vehicle price input |
| `#calc-down-input` | Down payment input & slider |
| `#calc-term-select` | Loan duration (24, 36, 48, 60, 72 months) |
| `#calc-rate-input` | Interest rate APR % slider/input |
| `#calc-monthly-result` | Recalculated monthly payment figure |
| `#toast-container` | Floating notification stack for real-time feedback |

---

## 5. Application State Architecture

All state is centralized in a single reactive `AppState` object:

```javascript
const AppState = {
  bikes: [...INITIAL_BIKES_DATA],
  filteredBikes: [...INITIAL_BIKES_DATA],
  
  // Active Filters
  filters: {
    searchQuery: "",
    category: "All", // "All", "Sportbike", "Cruiser", "Adventure", "Naked"
    selectedMakes: [], // e.g. ["Ducati", "Yamaha"]
    condition: "All", // "All", "New", "Certified Pre-Owned"
    maxPrice: 35000,
    minDisplacement: 0,
    transmission: "All" // "All", "Quickshifter"
  },

  // Active Sorting
  sortBy: "featured", // "featured", "price-low", "price-high", "hp-high", "year-newest"

  // User Collections (persisted via localStorage)
  wishlist: [], // Array of bike IDs: ["bike-001", "bike-003"]
  compareList: [], // Array of bike IDs (max 3): ["bike-001", "bike-002"]
  cart: [], // Array of deposit items: [{ bikeId: "bike-001", depositAmount: 500, date: "..." }]

  // UI Transient State
  activeModalBikeId: null, // ID of bike currently viewed in Detail Modal
  audioSimulatorState: {
    activeBike: null,
    isPlaying: false,
    rpmLevel: 1000 // 1000 (idle) to 14000 (redline)
  },

  // Location / Preferences
  userZipCode: "33101",
  userLocationName: "Miami, FL"
};
```

---

## 6. Functional Event Handler Signatures & Logic Contracts

Shanks must implement the following exact JavaScript handler functions:

### 6.1 Filter & Search Handlers
```javascript
function applyFiltersAndRender()
// 1. Clones AppState.bikes.
// 2. Filters by filters.searchQuery (checks make, model, category, engine specs, tags).
// 3. Filters by filters.category (if not 'All').
// 4. Filters by filters.selectedMakes (if selectedMakes.length > 0).
// 5. Filters by filters.condition (if not 'All').
// 6. Filters by price <= filters.maxPrice.
// 7. Filters by displacementNumber >= filters.minDisplacement.
// 8. Filters by transmission (if 'Quickshifter', checks bike.features or transmission string).
// 9. Applies active sort:
//    - 'price-low': a.price - b.price
//    - 'price-high': b.price - a.price
//    - 'hp-high': b.horsepower - a.horsepower
//    - 'year-newest': b.year - a.year
//    - 'featured': b.featured - a.featured
// 10. Updates #results-counter and renders cards into #bikes-grid.
// 11. If 0 results, shows #no-results-state and hides #bikes-grid.
// 12. Updates #active-filter-chips with dismissible badge buttons.

function handleQuickFilterSubmit(e)
// Reads #quick-make-select, #quick-category-select, #quick-budget-select, #quick-condition-select.
// Updates AppState.filters and calls applyFiltersAndRender().
// Smooth scrolls window to #inventory-section.

function handleCategoryPillClick(categoryName)
// Updates AppState.filters.category, updates active UI class on pill buttons, calls applyFiltersAndRender().

function handleNavSearchInput(e)
// Debounced input handler (150ms).
// Searches bike makes, models, categories.
// Populates #nav-search-dropdown with top 5 matching items with thumbnails, prices, and direct click handlers.

function clearAllFilters()
// Resets AppState.filters to default values.
// Syncs all input fields, checkboxes, and sliders.
// Calls applyFiltersAndRender().
// Shows toast: "Filters reset to show all inventory".
```

### 6.2 Wishlist, Compare & Cart Handlers
```javascript
function toggleWishlist(bikeId)
// If bikeId in AppState.wishlist -> remove it, show toast "Removed from Saved Bikes".
// Else -> add it, show toast "Saved to your Wishlist!".
// Persists AppState.wishlist to localStorage.
// Updates #nav-wishlist-count badge and all heart icons matching bikeId.
// Re-renders #wishlist-items-container if drawer is open.

function toggleCompare(bikeId)
// If bikeId in AppState.compareList -> remove it.
// Else:
//   If AppState.compareList.length >= 3 -> show error toast "Maximum 3 bikes can be compared simultaneously."
//   Else -> add bikeId, show toast "Added to comparison matrix".
// Persists AppState.compareList to localStorage.
// Updates #nav-compare-count badge and all compare checkboxes.
// Updates #compare-drawer preview. If count > 0, shows compare floating bar / badge.

function openCompareDrawer()
// Populates #compare-bikes-content with side-by-side comparison table of the 1 to 3 bikes in AppState.compareList.
// Specs compared: Price, Engine, HP, Torque, Weight, Seat Height, Fuel, Top Speed, Quickshifter, Suspension, Dealer.
// Shows #compare-drawer.

function removeCompareBike(bikeId)
// Removes specific bike from compare list, updates UI.

function clearAllCompare()
// Clears AppState.compareList, updates badges, closes drawer.

function addBikeToCart(bikeId)
// Adds deposit item ($500 refundable reservation) for bikeId into AppState.cart.
// Persists to localStorage.
// Updates #nav-cart-count.
// Shows toast "Reservation deposit added to cart!".
// Opens #cart-drawer.

function removeBikeFromCart(bikeId)
// Removes bike reservation from cart, updates UI and subtotal.
```

### 6.3 Vehicle Detail & 360 Gallery Modal
```javascript
function openBikeDetailModal(bikeId)
// Finds bike in AppState.bikes.
// Sets AppState.activeModalBikeId = bikeId.
// Renders rich detail modal:
//   - Main image gallery with thumbnail carousel switcher
//   - Quick spec badges: Horsepower, Torque, Weight, Displacement
//   - Full spec breakdown table
//   - Factory features checklist
//   - Dynamic monthly payment estimation based on current price
//   - Action buttons: "Schedule Test Ride", "Reserve with $500 Deposit", "Listen to Exhaust", "Compare"
// Shows #bike-detail-modal with smooth entrance animation.

function closeBikeDetailModal()
// Hides #bike-detail-modal.
```

### 6.4 Web Audio API Exhaust Sound Synthesizer
Motorcycle enthusiasts love hearing the exhaust roar. Instead of broken external audio files, this platform features an authentic procedural Web Audio API synthesizer that generates realistic engine acoustics!

```javascript
class EngineSoundSimulator {
  // Uses AudioContext to synthesize engine idle, acceleration, and revs.
  // Generates dual oscillators (harmonic pulse + low-end rumble) filtered through a resonant bandpass.
  // Profiles:
  // - "v4-screamer": Fast high-pitched rasp (Desmosedici / R1)
  // - "vtwin-heavy": Low thumping rumble (Harley / Scout)
  // - "triple-growl": Distinctive howling harmonic (Speed Triple)
  // - "boxer-twin": Steady mechanical boxer drone (BMW GS)
  start(profileType)
  setRPM(rpmValue) // Dynamic frequency modulation (1000 RPM idle to 14000 RPM redline)
  revThrottle()    // Simulates an aggressive throttle blip with decay
  stop()
}

function openExhaustSimulatorModal(bikeId)
// Finds bike, initializes EngineSoundSimulator with bike.audioProfile.
// Shows modal with bike photo, rev tachometer dial (canvas/SVG), "Hold Throttle to Rev" button, and audio waveform visualizer.

function closeExhaustSimulatorModal()
// Stops audio context, resets tachometer, hides modal.
```

### 6.5 Loan & EMI Financing Calculator
```javascript
function calculateLoanEMI(principal, downPayment, termMonths, aprPercent)
// Loan amount = principal - downPayment
// Monthly interest rate r = (aprPercent / 100) / 12
// Formula: EMI = [P * r * (1 + r)^n] / [(1 + r)^n - 1]
// Returns rounded integer.

function initFinanceCalculatorListeners()
// Live updates #calc-monthly-result whenever #calc-price-input, #calc-down-input, #calc-term-select, or #calc-rate-input changes.
```

### 6.6 "Sell Your Bike" Instant Valuation Estimator
```javascript
function handleSellBikeValuationSubmit(e)
// Reads make, model, year, current mileage, and condition (Excellent, Good, Fair).
// Algorithmic pricing estimator:
// Base MSRP lookup + depreciation formula:
// depreciation = (2025 - year) * 0.08 + (mileage / 10000) * 0.05
// Condition multiplier: Excellent (1.0), Good (0.9), Fair (0.8).
// Computes Estimated Instant Cash Offer and Estimated Private Sale Value.
// Displays attractive valuation breakdown in #sell-valuation-result with "Accept Offer & Book Inspection" button.
```

### 6.7 Test Ride & Reservation Checkout Flows
```javascript
function handleTestRideBookingSubmit(e)
// Validates dealership location, requested date/time, rider motorcycle license toggle.
// Generates random confirmation ID (e.g., "TR-89412").
// Displays success state with calendar add option and notification toast.

function handleReservationCheckoutSubmit(e)
// Validates deposit checkout form (Name, Email, Phone, Mock Card Details).
// Clears AppState.cart.
// Displays #checkout-success-view with unique Reservation Receipt, VIN allocation status, and next steps for paperwork.
```

### 6.8 Toast Notification System
```javascript
function showToast(message, type = "info")
// Appends animated toast card to #toast-container.
// Supported types: "success" (green), "info" (blue/accent), "warning" (amber), "danger" (red).
// Auto-dismisses after 3500ms with smooth fade-out.
```

---

## 7. Responsive Layout & Screen Viewports

- **Desktop (>= 1024px)**: Full sticky navbar with instant search autocomplete, 3-column inventory grid with permanent left faceted filter sidebar, floating compare badge, side drawers for Cart and Wishlist.
- **Tablet (768px - 1023px)**: 2-column inventory grid, collapsible filter drawer button `#mobile-filter-toggle`, streamlined header.
- **Mobile (< 768px)**: 1-column responsive card layout, full-width category pill bar with momentum horizontal scrolling, bottom dock for quick actions (`Search`, `Filter`, `Wishlist`, `Compare`, `Cart`).

---

## 8. Shanks (Builder) Implementation Instructions

1. **Self-Contained Architecture**: Build the complete solution cleanly in standard web technologies (`index.html`, `styles.css`, `app.js`).
2. **Audio & Graphics**: The Web Audio engine simulation must be cleanly initialized upon user click (handling browser autoplay policies gracefully).
3. **Persisted State**: Wishlist, Cart, and Compare selections must persist across browser refreshes via `localStorage`.
4. **Rich Visual Feedback**: Every interactive card must have smooth hover micro-interactions, badge glows, and immediate UI feedback on filter adjustments.
5. **Zero Dead Buttons**: Ensure every button in headers, cards, footers, and modals connects directly to its respective event handler specified above.

---
*Contract signed & documented by Robin (System & Data Architect).*
