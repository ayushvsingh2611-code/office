# SPECIFICATION CONTRACT: "ICHIRAKU ROASTERY - THE HIDDEN LEAF COFFEE & TEA"
**Architect:** Nami (Group 1 - System & Data Architect)  
**Target Builder:** Zoro (Group 1 - Builder)  
**Project:** Premium Anime Naruto-Themed Specialty Coffee Shop Web Application  
**Version:** 1.0.0 Production Blueprint  
**Status:** Approved & Ready for Implementation  

---

## 1. PRODUCT OVERVIEW & AUTHENTIC BRAND FIDELITY

### 1.1 Brand Identity & Concept
- **Brand Name:** *Ichiraku Roastery & Tea Haven* (一楽 焙煎所 - 木ノ葉隠れの里)
- **Concept:** High-fidelity e-commerce & cafe portal blending the artisanal minimalism of premium coffee roasteries (*Starbucks Reserve meets % Arabica*) with deep, authentic *Naruto: Shippuden* lore (Konoha Leaf Village, Chakra roasting affinities, Shinobi mission orders, Ninja rank loyalty system).
- **Core Visual Palette:**
  - **Konoha Forest Green / Jade:** `#1E3F20` / `#2D5A27` (Primary Accent & Herbal Notes)
  - **Uzumaki Orange:** `#FF6B00` / `#FA8231` (Action & Energy Highlights)
  - **Hokage Crimson / Vermilion:** `#C0392B` / `#E74C3C` (Special Edition / Urgency)
  - **Chakra Cyan / Rasengan Glow:** `#00E5FF` / `#00B4D8` (Special FX & Siphon/Cold Brews)
  - **Parchment / Ninja Scroll Ivory:** `#FDFBF7` / `#F4EBD9` (Background Canvas)
  - **Charcoal / Anbu Dark Navy:** `#1A1D20` / `#121416` (Deep Containers & Dark Theme Contrast)
  - **Gold / Sun Seal:** `#F59E0B` / `#D97706` (Rating & Hokage Gold Rewards)

### 1.2 Layout Hierarchy & Key Modules
1. **Top Notice Bar (Village Broadcast):** Live marquee with Ninja village news, weather in Konoha, flash discount banner with copyable coupon code.
2. **Global Navigation Bar:**
   - Brand logo with Konoha Leaf Crest and steaming coffee cup icon.
   - Nav links: Menu (`#nav-menu`), Jutsu Brew Lab (`#nav-lab`), Hokage Club & Loyalty (`#nav-rewards`), Ninja Reviews (`#nav-reviews`), Village Map (`#nav-location`).
   - Quick search trigger, Jutsu Sound FX toggle, Wishlist badge with counter, Cart badge with counter & subtotal.
3. **Hero Banner Section:**
   - Cinematic hero with dual badge ("Hokage Selection 2025" & "Rank S Roasted Beans").
   - Headline: *"Awaken Your Inner Chakra with Konoha's Finest Roast"*.
   - Interactive CTA buttons: "Explore Shinobi Menu", "Brew Your Custom Jutsu", "Claim Genin Welcome Scroll (20% Off)".
   - Real-time "Chakra Aroma Gauge" interactive meter.
4. **Interactive Jutsu Filter & Search Bar:**
   - Category Pills: All (`all`), Hokage Roasts (`hokage-roast`), Rasengan Cold Brews (`rasengan-brew`), Sage Mode Teas & Matcha (`sage-matcha`), Uchiha Dark Espressos (`uchiha-dark`), Shinobi Pastries & Dango (`shinobi-pastry`).
   - Chakra Nature Quick Filter: Fire (Katon), Water (Suiton), Wind (Fuuton), Lightning (Raiton), Earth (Doton).
   - Search bar with instant fuzzy search by name, flavor profile, or ninja character.
   - Sort dropdown: Recommended, Price Low to High, Price High to Low, Chakra Potency, Customer Rating.
5. **Dynamic Coffee & Pastry Product Grid:**
   - 12 pre-loaded artisanal items with high-res imagery, chakra badge tags, flavor notes, roast level indicator (1 to 5 Shuriken), price in Ryo & USD, quick order (+/-), instant add-to-cart, and "Quick Inspect" modal trigger.
6. **"Jutsu Brew Builder" (Interactive Customization Lab):**
   - Step-by-step interactive drink crafter: Base Liquid (Espresso, Matcha, Pour-over, Cold Drip) -> Milk Jutsu (Oat, Almond, Whole, Shadow Clone Cream) -> Chakra Infusion (Nine-Tails Cinnamon, Senjutsu Vanilla, Amaterasu Chili Spice) -> Topping (Ramen Dango Crumb, Gold Leaf, Kurama Foam).
   - Live visual drink simulator updating in real-time with calculated price and Chakra Power score.
7. **Shinobi Passport & Loyalty Card System:**
   - Interactive digital Shinobi ID card with user's name, custom ninja head-band village selector, rank progression bar (Genin -> Chunin -> Jonin -> Hokage) calculating unlocked discounts and points per purchase.
8. **Interactive Shinobi Cart Drawer (`#cart-drawer`):**
   - Slide-in side drawer displaying itemized drinks, quantity counters, grind/temperature modifiers, promo code input field, Chakra tax calculation, and instant checkout button.
9. **Interactive Scroll Checkout & Order Tracking Modal (`#checkout-modal` & `#order-tracking-modal`):**
   - Konoha Delivery Dispatch scroll with animated Kunai courier route progress, estimated summon time, and download receipt scroll button.
10. **Quick View Drink Modal (`#quick-view-modal`):**
    - High-detail modal with ingredient breakdown, lore backstory, brewing gear specs, and one-click add to cart.
11. **Toast Notification System (`#toast-container`):**
    - Stylized scroll alerts for Add to Cart, Discount Applied, Shinobi Rank Up, Audio SFX toggle.

---

## 2. PRE-LOADED RICH DEMO DATA CONTRACT

The application MUST ship pre-loaded with these exact 12 items inside an array `window.ICHIRAKU_MENU_DATA`. No empty states on launch.

```javascript
window.ICHIRAKU_MENU_DATA = [
  {
    id: "item-01",
    name: "Rasengan Spiraling Cold Brew",
    japaneseName: "螺旋丸 コールドブリュー",
    category: "rasengan-brew",
    chakraNature: "Wind",
    roastLevel: 3,
    chakraPower: 95,
    priceRyo: 450,
    priceUSD: 5.75,
    calories: "120 kcal",
    prepTime: "18h Slow Drip",
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80",
    description: "Cold-extracted single-origin Ethiopian Yirgacheffe spun at high centrifugal velocity. Topped with micro-foamed blue curaçao cold foam that mimics Naruto's swirling chakra sphere.",
    notes: ["Bergamot", "Jasmine", "Citrus Zest", "Blueberry Whirl"],
    featured: true,
    badges: ["Best Seller", "Wind Release"],
    rating: 4.9,
    reviewsCount: 184
  },
  {
    id: "item-02",
    name: "Amaterasu Black Fire Espresso",
    japaneseName: "天照 黒炎 エスプレッソ",
    category: "uchiha-dark",
    chakraNature: "Fire",
    roastLevel: 5,
    chakraPower: 99,
    priceRyo: 380,
    priceUSD: 4.50,
    calories: "15 kcal",
    prepTime: "30s Extraction",
    image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=800&q=80",
    description: "An unquenchable dark roast pulled from volcanic Sumatran Mandheling beans. Infused with black cocoa nibs and smoked chipotle essence. Strong enough to awaken the Mangekyo Sharingan.",
    notes: ["Dark Chocolate 85%", "Smoked Wood", "Black Truffle", "Chili Spark"],
    featured: true,
    badges: ["Staff Pick", "Fire Release"],
    rating: 4.8,
    reviewsCount: 210
  },
  {
    id: "item-03",
    name: "Sage Mode Mount Myoboku Matcha",
    japaneseName: "仙人モード 妙木山 宇治抹茶",
    category: "sage-matcha",
    chakraNature: "Earth",
    roastLevel: 1,
    chakraPower: 92,
    priceRyo: 520,
    priceUSD: 6.25,
    calories: "160 kcal",
    prepTime: "4m Ceremonial Whisk",
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80",
    description: "Ceremonial Grade Uji Matcha sourced from Mount Myoboku's sacred stone valleys. Layered with velvety oat milk, organic lavender syrup, and dusted with golden toad-oil pollen.",
    notes: ["Stone-ground Green Tea", "Lavender", "Fresh Umami", "Oat Silk"],
    featured: true,
    badges: ["Pure Natural Energy", "Senjutsu Blend"],
    rating: 5.0,
    reviewsCount: 342
  },
  {
    id: "item-04",
    name: "Seventh Hokage Orange Spiced Cortado",
    japaneseName: "七代目火影 オレンジ スパイス コルタード",
    category: "hokage-roast",
    chakraNature: "Wind",
    roastLevel: 4,
    chakraPower: 96,
    priceRyo: 420,
    priceUSD: 5.25,
    calories: "110 kcal",
    prepTime: "3m Dual Shot",
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80",
    description: "Equal parts bold Colombian Huila espresso and steamed milk, infused with bitter Seville orange peel, cinnamon stick shavings, and finished with a Hokage Leaf latte art etching.",
    notes: ["Candied Blood Orange", "Cinnamon", "Brown Sugar", "Velvety Cream"],
    featured: true,
    badges: ["Hokage Choice", "Konoha Special"],
    rating: 4.9,
    reviewsCount: 156
  },
  {
    id: "item-05",
    name: "Chidori Thousand Birds Siphon Brew",
    japaneseName: "千鳥 一千羽 サイフォン 珈琲",
    category: "rasengan-brew",
    chakraNature: "Lightning",
    roastLevel: 3,
    chakraPower: 98,
    priceRyo: 550,
    priceUSD: 6.75,
    calories: "5 kcal",
    prepTime: "6m Halogen Siphon",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
    description: "Vacuum siphon extracted Kenyan AA beans that crackle on the tongue with high malic acidity. Served in an electrified glass beaker with popping rock sugar crystals.",
    notes: ["Crisp Green Apple", "Blackcurrant", "Electric Fizz", "Sparkling Honey"],
    featured: false,
    badges: ["Lightning Release", "Precision Brew"],
    rating: 4.7,
    reviewsCount: 98
  },
  {
    id: "item-06",
    name: "Tsunade 100 Healings Golden Turmeric Latte",
    japaneseName: "綱手 創造再生 ゴールデン ラテ",
    category: "sage-matcha",
    chakraNature: "Water",
    roastLevel: 1,
    chakraPower: 94,
    priceRyo: 480,
    priceUSD: 5.95,
    calories: "140 kcal",
    prepTime: "4m Steamed Foam",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
    description: "Ayurvedic roasted turmeric, Ceylon cinnamon, fresh ginger root, and organic blossom honey frothed with almond milk. Formulated to regenerate ninja stamina in seconds.",
    notes: ["Golden Turmeric", "Wild Ginger", "Cardamom", "Vanilla Blossom"],
    featured: false,
    badges: ["Healing Jutsu", "Caffeine Free"],
    rating: 4.8,
    reviewsCount: 122
  },
  {
    id: "item-07",
    name: "Shadow Possession Dark Roast Nitro",
    japaneseName: "影真似 漆黒 ナイトロ コールド",
    category: "uchiha-dark",
    chakraNature: "Earth",
    roastLevel: 5,
    chakraPower: 91,
    priceRyo: 470,
    priceUSD: 5.60,
    calories: "8 kcal",
    prepTime: "Nitro Tap Pour",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80",
    description: "Deep Brazilian Cerrado coffee infused with pure nitrogen gas, cascading like Shikamaru's tactical shadow tendrils. Ultra creamy head without dairy.",
    notes: ["Molasses", "Roasted Walnut", "Stout Malt", "Silky Smoke"],
    featured: false,
    badges: ["Nara Clan Secret", "Nitro Cascade"],
    rating: 4.9,
    reviewsCount: 89
  },
  {
    id: "item-08",
    name: "Byakugan White Mocha Mist",
    japaneseName: "白眼 純白 モカ ミスト",
    category: "hokage-roast",
    chakraNature: "Water",
    roastLevel: 2,
    chakraPower: 90,
    priceRyo: 460,
    priceUSD: 5.50,
    calories: "280 kcal",
    prepTime: "3m Steamed Microfoam",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80",
    description: "Valrhona white chocolate ganache blended with blonde espresso and whole milk, garnished with edible silver pearl mist and a Hyuga Gentle Fist swirl pattern.",
    notes: ["Ivory Cocoa", "Madagascar Vanilla", "Sweet Cream", "Almond Nougat"],
    featured: false,
    badges: ["Hyuga Clan", "Sweet Balance"],
    rating: 4.8,
    reviewsCount: 167
  },
  {
    id: "item-09",
    name: "Anbu Black Ops Triple Ristretto",
    japaneseName: "暗部 特務 リストレット",
    category: "uchiha-dark",
    chakraNature: "Fire",
    roastLevel: 5,
    chakraPower: 100,
    priceRyo: 360,
    priceUSD: 4.25,
    calories: "5 kcal",
    prepTime: "25s High Pressure",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    description: "For undercover shinobi on nocturnal patrol. Triple-shot restricted extraction yielding syrupy density with zero bitterness. Maximum caffeine payload.",
    notes: ["Dark Cacao", "Burnt Sugar", "Cinnamon Bark", "Black Cherry"],
    featured: false,
    badges: ["Anbu Spec Ops", "High Velocity"],
    rating: 4.9,
    reviewsCount: 145
  },
  {
    id: "item-10",
    name: "Mitarashi Dango Trio & Espresso Dip",
    japaneseName: "みたらし団子 エスプレッソ ディップ",
    category: "shinobi-pastry",
    chakraNature: "Earth",
    roastLevel: 2,
    chakraPower: 86,
    priceRyo: 390,
    priceUSD: 4.80,
    calories: "240 kcal",
    prepTime: "Fresh Skewered Daily",
    image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80",
    description: "Traditional chewy rice skewers fire-charred to perfection, glazed with sweet soy-dashi sauce and served with a miniature dipping bowl of rich espresso glaze. Anko Mitarashi's staple.",
    notes: ["Chewy Mochi", "Caramelized Soy", "Smoky Sweetness", "Espresso Reduction"],
    featured: true,
    badges: ["Anko's Favorite", "Village Classic"],
    rating: 4.9,
    reviewsCount: 310
  },
  {
    id: "item-11",
    name: "Nine-Tails Cinnamon Flame Roll",
    japaneseName: "九尾 焔 シナモン ロール",
    category: "shinobi-pastry",
    chakraNature: "Fire",
    roastLevel: 4,
    chakraPower: 97,
    priceRyo: 440,
    priceUSD: 5.20,
    calories: "410 kcal",
    prepTime: "Brick Oven Baked",
    image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=800&q=80",
    description: "Fluffy Japanese milk bread dough coiled with Saigon cinnamon and ginger, drenched in red-orange Kurama cream cheese frosting with spicy cayenne heat.",
    notes: ["Saigon Cinnamon", "Candied Pecans", "Tangy Cream Cheese", "Kurama Heat"],
    featured: false,
    badges: ["Spicy Sweet", "Kurama Oven"],
    rating: 5.0,
    reviewsCount: 228
  },
  {
    id: "item-12",
    name: "Kakashi Icha Icha Lavender Croissant",
    japaneseName: "カカシ イチャイチャ ラベンダー クロワッサン",
    category: "shinobi-pastry",
    chakraNature: "Wind",
    roastLevel: 1,
    chakraPower: 88,
    priceRyo: 410,
    priceUSD: 4.95,
    calories: "320 kcal",
    prepTime: "72h Laminated Dough",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
    description: "Flaky 81-layer French butter croissant with French culinary lavender infusion, filled with white chocolate mascarpone cream. Best savored while reading your favorite novel under a Konoha tree.",
    notes: ["Normandy Butter", "Lavender Infusion", "Mascarpone", "Flaky Crunch"],
    featured: false,
    badges: ["Team 7 Nostalgia", "Buttery Masterpiece"],
    rating: 4.9,
    reviewsCount: 195
  }
];
```

### 2.2 Coupon Codes Table
| Code | Discount | Minimum Order | Description |
|---|---|---|---|
| `DATTEBAYO` | 20% OFF | 0 Ryo | Genin Welcome Scroll for first-time visitors |
| `HOKAGE50` | 50% OFF | 1500 Ryo | Hokage Summit VIP feast discount |
| `CHIDORI10` | 10% OFF | 0 Ryo | Sasuke Lightning speed instant cut |
| `RAMENCOFFEE` | 15% OFF | 500 Ryo | Teuchi's secret combo discount |

---

## 3. EXACT DOM ELEMENT IDS & HIERARCHY CONTRACT

To ensure absolute zero ID mismatches between HTML and JavaScript, Zoro MUST use the exact IDs defined below.

### 3.1 Header, Announcements & Global Nav
- `#village-alert-bar`: Container for the scrolling Konoha emergency/deal banner.
- `#coupon-promo-pill`: Clickable coupon copy trigger inside the top bar.
- `#chakra-audio-toggle`: Sound toggle button (Mute/Unmute ninja Jutsu audio cues).
- `#audio-status-label`: Text inside button showing "Sound: ON" / "Sound: OFF".
- `#brand-logo`: Clickable brand link redirecting to top.
- `#nav-menu`: Smooth scroll anchor to `#menu-section`.
- `#nav-lab`: Smooth scroll anchor to `#brew-lab-section`.
- `#nav-rewards`: Smooth scroll anchor to `#rewards-section`.
- `#nav-reviews`: Smooth scroll anchor to `#reviews-section`.
- `#nav-location`: Smooth scroll anchor to `#location-section`.
- `#global-search-btn`: Opens or focuses the search bar `#menu-search-input`.
- `#wishlist-btn`: Opens the saved shinobi favorites modal `#wishlist-modal`.
- `#wishlist-count`: Number badge displaying total saved favorites.
- `#cart-btn`: Opens the sliding cart drawer `#cart-drawer`.
- `#cart-count`: Badge displaying total item count in cart.
- `#cart-total-badge`: Displays live subtotal formatted (e.g. `1,250 Ryo ($15.60)`).

### 3.2 Hero Banner & Chakra Aroma Meter
- `#hero-section`: Main hero container.
- `#hero-cta-menu`: Button scrolling down to `#menu-section`.
- `#hero-cta-custom`: Button scrolling down to `#brew-lab-section`.
- `#hero-cta-coupon`: Button copying `DATTEBAYO` and opening cart.
- `#chakra-gauge-btn`: Interactive aroma meter trigger.
- `#chakra-gauge-fill`: Animated visual meter bar (0% - 100%).
- `#chakra-gauge-value`: Text percentage display (e.g., "Chakra Level: 92% - S-Rank Aroma").

### 3.3 Menu Controls & Interactive Grid
- `#menu-section`: Menu container section.
- `#menu-search-input`: Text input for instant search filter.
- `#menu-search-clear`: "X" button to clear search input.
- `#category-filter-container`: Pill buttons container:
  - `#filter-all`: Shows all items.
  - `#filter-hokage-roast`: Filter for Hokage Roasts.
  - `#filter-rasengan-brew`: Filter for Cold Brews & Siphons.
  - `#filter-sage-matcha`: Filter for Matcha & Health Tonics.
  - `#filter-uchiha-dark`: Filter for Dark Roasts & Espressos.
  - `#filter-shinobi-pastry`: Filter for Pastries & Dango.
- `#chakra-nature-select`: Dropdown `<select>` for Wind, Fire, Lightning, Earth, Water, or All.
- `#menu-sort-select`: Dropdown `<select>` for sorting:
  - `recommended`
  - `price-asc` (Low to High)
  - `price-desc` (High to Low)
  - `chakra-desc` (Highest Chakra Power)
  - `rating-desc` (Highest Rated)
- `#menu-items-count`: Text displaying "Showing X shinobi creations".
- `#menu-grid`: Grid container where product cards are dynamically rendered.
- `#menu-empty-state`: Hidden container shown when no items match search query, with `#btn-reset-filters`.

### 3.4 Product Card Sub-Element Standard (Dynamic Template)
Every card rendered inside `#menu-grid` must have:
- `data-item-id`: e.g. `item-01`.
- `.item-card`: Outer card container.
- `.item-badge-list`: Tags container.
- `.item-image-wrapper`: Image container with hover zoom.
- `.item-quick-view-btn`: Inspect modal trigger with `data-item-id`.
- `.item-wishlist-toggle`: Heart icon toggle with `data-item-id`.
- `.item-title`: Drink name.
- `.item-subtitle`: Japanese name.
- `.item-roast-meter`: Graphic shurikens (1-5) representing roast strength.
- `.item-notes`: Flavor pills.
- `.item-price-ryo`: Ryo price.
- `.item-price-usd`: USD price.
- `.item-qty-minus`: Decrease card quantity.
- `.item-qty-input`: Quantity input field.
- `.item-qty-plus`: Increase card quantity.
- `.item-add-btn`: Add to cart button with `data-item-id`.

### 3.5 "Jutsu Brew Builder" (Interactive Customization Lab)
- `#brew-lab-section`: Lab container.
- `#brew-base-select`: Radio/pill group for base (Espresso, Cold Drip, Ceremonial Matcha, Pour-Over).
- `#brew-milk-select`: Radio/pill group for dairy/plant milk (None/Black, Konoha Fresh Whole, Steamed Oat, Almond Mist).
- `#brew-infusion-select`: Checkbox/toggle options for Chakra infusions (Nine-Tails Cinnamon +50 Ryo, Mount Myoboku Honey +40 Ryo, Amaterasu Chili Sparks +30 Ryo).
- `#brew-topping-select`: Radio/pill group for toppings (None, Rasengan Azure Foam, Crushed Dango Crumbs, 24K Leaf Village Gold Flakes).
- `#brew-sweetness-slider`: Range slider for sweetness (0% - 100% in 25% steps).
- `#brew-ice-slider`: Range slider for ice/temperature (Hot Flame, Warm, Chilled, Ice Seal).
- `#brew-preview-cup`: Animated visual drink preview cup reflecting selected colors.
- `#brew-chakra-power-badge`: Calculated chakra power score based on components.
- `#brew-calculated-price`: Dynamic price calculation in Ryo and USD.
- `#brew-add-to-cart-btn`: Button adding the custom potion directly into cart.
- `#brew-reset-btn`: Reset custom builder to default configuration.

### 3.6 Shinobi Passport & Loyalty Card
- `#rewards-section`: Loyalty section container.
- `#ninja-name-input`: Text input allowing customer to customize their Ninja ID name.
- `#ninja-village-select`: Dropdown for Shinobi Village emblem (Leaf, Sand, Mist, Cloud, Stone).
- `#ninja-card-name-display`: Live rendering of the customer name on the ID card.
- `#ninja-card-emblem`: SVG badge rendering the village symbol.
- `#ninja-rank-badge`: Displays current rank: *Genin*, *Chunin*, *Jonin*, *Hokage*.
- `#ninja-points-display`: Real-time points counter earned from orders (1 Ryo = 1 Shinobi Point).
- `#ninja-progress-bar`: Visual percentage bar to next rank level.
- `#ninja-progress-text`: Text indicator: e.g., "320 / 500 Points to Chunin (Unlocks 5% Lifetime Discount)".
- `#ninja-card-download-btn`: Visual print/save action trigger.

### 3.7 Ninja Customer Reviews Section
- `#reviews-section`: Reviews container.
- `#reviews-carousel`: Carousel or grid of pre-loaded quotes from famous Shinobi (Naruto, Sasuke, Kakashi, Shikamaru, Jiraiya).
- `#btn-open-review-modal`: Opens `#add-review-modal`.
- `#add-review-modal`: Modal to submit a custom Shinobi review.
- `#review-form`: Form element with inputs `#review-author`, `#review-rating`, `#review-fav-drink`, `#review-comment`, `#btn-submit-review`, `#btn-close-review-modal`.

### 3.8 Cart Drawer (`#cart-drawer`)
- `#cart-overlay`: Darkened backdrop overlay closing the drawer when clicked.
- `#cart-drawer`: Main slide-over container.
- `#cart-close-btn`: "X" button closing the drawer.
- `#cart-items-container`: Dynamic container rendering all items in cart.
- `#cart-empty-msg`: Friendly ninja empty illustration shown when cart is empty.
- `#cart-promo-input`: Input field for discount coupons (`DATTEBAYO`, `HOKAGE50`, `CHIDORI10`).
- `#cart-apply-promo-btn`: Button to validate and apply promo.
- `#cart-promo-feedback`: Success/error message display under promo code.
- `#cart-subtotal-ryo`: Subtotal in Ryo.
- `#cart-discount-ryo`: Discount subtracted.
- `#cart-chakra-tax`: Leaf Village council duty (5% tax calculation).
- `#cart-final-total-ryo`: Grand total in Ryo.
- `#cart-final-total-usd`: Grand total in USD equivalent.
- `#cart-checkout-btn`: Button proceeding to `#checkout-modal`.
- `#cart-clear-btn`: Clear entire cart button with confirmation.

### 3.9 Quick View Drink Modal (`#quick-view-modal`)
- `#quick-view-modal`: Modal backdrop and dialog container.
- `#quick-view-close-btn`: "X" close button.
- `#quick-view-image`: Image preview.
- `#quick-view-title`: Drink name.
- `#quick-view-jap-title`: Japanese title.
- `#quick-view-badge`: Badge tag.
- `#quick-view-nature`: Chakra nature tag.
- `#quick-view-desc`: Lore & sensory description.
- `#quick-view-notes-list`: Flavor notes container.
- `#quick-view-calories`: Calorie count badge.
- `#quick-view-prep`: Preparation time badge.
- `#quick-view-price-ryo`: Price in Ryo.
- `#quick-view-price-usd`: Price in USD.
- `#quick-view-qty-minus`: Minus button.
- `#quick-view-qty-input`: Quantity number input.
- `#quick-view-qty-plus`: Plus button.
- `#quick-view-add-btn`: Add to cart with chosen quantity.

### 3.10 Scroll Checkout & Order Tracking Modal (`#checkout-modal` & `#order-tracking-modal`)
- `#checkout-modal`: Ninja Delivery Mission Scroll modal.
- `#checkout-close-btn`: Close checkout button.
- `#checkout-form`: Form container.
  - `#checkout-ninja-name`: Recipient shinobi name.
  - `#checkout-address`: Village sector (e.g. Sector 7, Hokage Monument Rd).
  - `#checkout-delivery-method`: Dispatch summon option (Summoning Hawk Express, Anbu Courier, Genin Runner).
  - `#checkout-payment-method`: Payment selection (Ryo Pouch Cash, Ninja Credit Scroll, Leaf Village Pay).
  - `#checkout-order-summary-list`: Condensed order list.
  - `#checkout-submit-btn`: "Seal Delivery Scroll & Dispatch Mission".
- `#order-tracking-modal`: Mission Execution Status modal.
  - `#order-mission-rank`: Mission classification (Rank D, C, B, A, or S).
  - `#tracking-kunai-progress`: Animated progress bar with Kunai icon traversing the trail.
  - `#tracking-status-step-1`: "Scroll Sealed & Beans Ground" (Active/Done).
  - `#tracking-status-step-2`: "Chakra Boiling & Extraction" (Active/Done).
  - `#tracking-status-step-3`: "Summoning Courier in Transit" (Active/Done).
  - `#tracking-status-step-4`: "Delivered to Shinobi Post" (Active/Done).
  - `#btn-tracking-complete`: "Receive Order & Claim Shinobi XP".

### 3.11 Wishlist Drawer / Modal (`#wishlist-modal`)
- `#wishlist-modal`: Modal container for saved items.
- `#wishlist-close-btn`: Close wishlist button.
- `#wishlist-items-container`: Dynamic list of favorited items with fast "Move to Cart" button.
- `#wishlist-empty-msg`: Message displayed when no items are saved.

### 3.12 Global Notification Toast (`#toast-container`)
- `#toast-container`: Floating container anchored in the bottom-right for instant scroll-styled toast messages with auto-dismiss (3.5s).

---

## 4. JAVASCRIPT STATE MODEL & FUNCTION CONTRACT

Zoro must implement a centralized, reactive state architecture in clean vanilla JavaScript (or ES Modules) with zero reliance on missing dependencies.

### 4.1 Global Application State (`window.ShinobiApp`)
```javascript
const ShinobiState = {
  // Inventory
  items: [...window.ICHIRAKU_MENU_DATA],
  filteredItems: [...window.ICHIRAKU_MENU_DATA],
  
  // Filters & Search
  filters: {
    category: "all",
    chakraNature: "all",
    searchQuery: "",
    sortBy: "recommended"
  },
  
  // Cart: Array of { id, name, priceRyo, priceUSD, qty, image, notes, isCustomBrew, customOptions }
  cart: [],
  appliedPromo: null, // { code: 'DATTEBAYO', discountPercent: 20 }
  chakraDutyRate: 0.05, // 5% village tax
  
  // Wishlist: Array of item IDs ['item-01', 'item-03']
  wishlist: ["item-01", "item-04"],
  
  // Shinobi Loyalty Profile
  profile: {
    ninjaName: "Naruto Uzumaki",
    village: "leaf",
    totalPoints: 340,
    rank: "Genin", // Genin (0-499), Chunin (500-1499), Jonin (1500-2999), Hokage (3000+)
    rankDiscountPercent: 0
  },
  
  // Jutsu Custom Brew Lab Temporary State
  customBrew: {
    base: "espresso",
    baseName: "Twin Rasengan Dual Espresso",
    basePrice: 380,
    milk: "oat",
    milkName: "Steamed Oat Silk",
    milkPrice: 40,
    infusions: ["Nine-Tails Cinnamon"],
    infusionsCost: 50,
    topping: "azure-foam",
    toppingName: "Rasengan Azure Microfoam",
    toppingPrice: 50,
    sweetness: 50,
    temperature: "chilled",
    chakraPower: 94
  },
  
  // Audio Settings
  soundEnabled: true,
  
  // Active Modals Tracker
  activeQuickViewItem: null,
  activeOrder: null
};
```

### 4.2 Function Signatures & Event Handlers Contract
Zoro MUST implement and wire up these exact function signatures:

```javascript
/* ==========================================================
   1. CORE INITIALIZATION & EVENT BINDINGS
   ========================================================== */
function initShinobiApp();
function bindGlobalEvents();
function loadPersistedData();
function savePersistedData();

/* ==========================================================
   2. SOUND SYNTHESIZER / SFX (Web Audio API - Zero External Audio Files)
   Synthesizes authentic ninja sounds (Chakra hum, Kunai click, Scroll open)
   ========================================================== */
function playNinjaSound(soundType); 
// soundType: 'jutsu-click' | 'chakra-charge' | 'cart-add' | 'scroll-open' | 'success-chime' | 'error-buzz'
function toggleAudioMute();

/* ==========================================================
   3. MENU RENDERING & FILTERING
   ========================================================== */
function renderMenuGrid();
function handleCategoryFilter(categorySlug);
function handleChakraNatureFilter(natureType);
function handleSearchInput(query);
function handleSortChange(sortCriterion);
function resetAllFilters();

/* ==========================================================
   4. PRODUCT INTERACTION & QUANTITY
   ========================================================== */
function changeCardQty(itemId, delta);
function handleQuickAddToCart(itemId, quantity);
function openQuickViewModal(itemId);
function closeQuickViewModal();
function toggleWishlist(itemId);
function renderWishlist();

/* ==========================================================
   5. CART MANAGEMENT & DRAWER
   ========================================================== */
function openCartDrawer();
function closeCartDrawer();
function renderCartItems();
function updateCartItemQty(cartIndex, delta);
function removeCartItem(cartIndex);
function clearCart();
function calculateCartTotals();
// Returns { subtotalRyo, subtotalUSD, discountRyo, taxRyo, grandTotalRyo, grandTotalUSD }
function applyPromoCode(code);
function removePromoCode();

/* ==========================================================
   6. JUTSU CUSTOM BREW LAB
   ========================================================== */
function initBrewLab();
function updateBrewLabSelection(type, value);
function recalculateBrewLab();
function renderBrewLabPreview();
function addCustomBrewToCart();
function resetBrewLab();

/* ==========================================================
   7. SHINOBI REWARDS & LOYALTY PASSPORT
   ========================================================== */
function updateShinobiProfileName(newName);
function updateShinobiVillage(newVillage);
function calculateShinobiRank(points);
function renderShinobiPassport();
function awardShinobiPoints(ryoSpent);

/* ==========================================================
   8. CHECKOUT & MISSION ORDER TRACKING
   ========================================================== */
function openCheckoutModal();
function closeCheckoutModal();
function handleCheckoutFormSubmit(event);
function startOrderMissionTracking(orderData);
function closeOrderTrackingModal();

/* ==========================================================
   9. REVIEWS & COMMUNITY FEEDBACK
   ========================================================== */
function openAddReviewModal();
function closeAddReviewModal();
function handleReviewSubmit(event);
function renderReviewsList();

/* ==========================================================
   10. CHAKRA AROMA GAUGE & HERO INTERACTIVITY
   ========================================================== */
function triggerChakraGaugeCharge();
function copyCouponToClipboard(code);
function showToast(message, type); // type: 'success' | 'info' | 'warning'
```

---

## 5. UI/UX DESIGN SYSTEM & CSS TOKENS CONTRACT

Zoro must apply the following CSS variable tokens in the main stylesheet (`styles.css`):

```css
:root {
  /* Brand Palettes */
  --color-leaf-deep: #162c18;
  --color-leaf-primary: #1e3f20;
  --color-leaf-light: #2d5a27;
  --color-leaf-accent: #4ade80;
  
  --color-uzumaki-orange: #ff6b00;
  --color-uzumaki-bright: #fa8231;
  --color-uzumaki-glow: rgba(255, 107, 0, 0.35);
  
  --color-chakra-blue: #00d2d3;
  --color-rasengan-cyan: #00e5ff;
  --color-rasengan-glow: rgba(0, 229, 255, 0.4);
  
  --color-sharingan-red: #c0392b;
  --color-amaterasu-black: #111215;
  
  --color-parchment-bg: #f8f6f0;
  --color-parchment-card: #ffffff;
  --color-parchment-border: #e6dfcf;
  
  --color-ninja-text-main: #1e232a;
  --color-ninja-text-muted: #64748b;
  
  /* Typography */
  --font-family-ninja: 'Cinzel', 'Noto Serif JP', Georgia, serif;
  --font-family-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  
  /* Shadow & Depth */
  --shadow-scroll: 0 10px 25px -5px rgba(22, 44, 24, 0.1), 0 8px 10px -6px rgba(22, 44, 24, 0.08);
  --shadow-glow-orange: 0 0 20px rgba(255, 107, 0, 0.3);
  --shadow-glow-cyan: 0 0 20px rgba(0, 229, 255, 0.35);
  
  /* Border Radius */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-full: 9999px;
  
  /* Transitions */
  --transition-fast: 0.15s ease-in-out;
  --transition-normal: 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## 6. COMPLETE FUNCTIONALITY MATRIX (ZERO DEAD BUTTONS)

| Feature / UI Element | Target DOM ID | Trigger Action | Required Responsive Behavior |
|---|---|---|---|
| **Emergency Bar Coupon Copy** | `#coupon-promo-pill` | `click` | Copies `DATTEBAYO` to clipboard, fires Jutsu click SFX, and pops toast confirmation. |
| **Chakra Audio Synthesizer Toggle** | `#chakra-audio-toggle` | `click` | Toggles Web Audio synthesized ninja sound effects on/off, updating `#audio-status-label`. |
| **Search Bar Instant Filtering** | `#menu-search-input` | `input` | Live debounced filter on title, Japanese name, notes, and description. Shows empty state if 0 results. |
| **Search Input Clear Button** | `#menu-search-clear` | `click` | Empties search box, restores filtered list, focuses input. |
| **Category Filter Pills** | `#category-filter-container button` | `click` | Switches active pill state, filters `#menu-grid` with smooth fade-in transition. |
| **Chakra Nature Dropdown** | `#chakra-nature-select` | `change` | Filters cards by Fire, Wind, Water, Lightning, or Earth. |
| **Menu Sort Dropdown** | `#menu-sort-select` | `change` | Re-orders cards by price, chakra rating, or review count. |
| **Card Quantity +/-** | `.item-qty-minus`, `.item-qty-plus` | `click` | Updates internal card count without exceeding [1, 99]. |
| **Card Add to Cart** | `.item-add-btn` | `click` | Adds selected quantity of product to cart, updates `#cart-count` & `#cart-total-badge`, animates cart icon, plays sound. |
| **Card Quick View Modal** | `.item-quick-view-btn` | `click` | Opens `#quick-view-modal` populated with specific drink lore, shuriken rating, and large preview. |
| **Card Wishlist Toggle** | `.item-wishlist-toggle` | `click` | Toggles heart active state, updates `#wishlist-count`, persists in localStorage. |
| **Chakra Aroma Gauge Meter** | `#chakra-gauge-btn` | `click` | Charges gauge up to 100% with animated pulses, displays randomized S-Rank sensory reading. |
| **Jutsu Brew Base Selection** | `#brew-lab-section [name="brew-base"]` | `change` | Updates drink graphic color, recalculates chakra score & price. |
| **Jutsu Brew Milk Selection** | `#brew-lab-section [name="brew-milk"]` | `change` | Updates foam layer visualization in `#brew-preview-cup`. |
| **Jutsu Brew Infusion Checks** | `#brew-lab-section .infusion-checkbox`| `change` | Adds/subtracts infusion items and dynamically adds Ryo cost. |
| **Jutsu Brew Topping Selection**| `#brew-lab-section [name="brew-topping"]`| `change` | Adds visual toppings (gold dust, blue foam, or dango) on `#brew-preview-cup`. |
| **Jutsu Brew Add to Cart** | `#brew-add-to-cart-btn` | `click` | Creates unique custom cart item with selected formula, adds to cart, and triggers toast. |
| **Jutsu Brew Reset** | `#brew-reset-btn` | `click` | Restores builder to defaults. |
| **Cart Drawer Open** | `#cart-btn` | `click` | Slides `#cart-drawer` from right, darkens `#cart-overlay`, updates calculation. |
| **Cart Drawer Close** | `#cart-close-btn`, `#cart-overlay` | `click` | Slides `#cart-drawer` out of viewport. |
| **Cart Qty +/- & Remove** | `.cart-qty-minus`, `.cart-qty-plus`, `.cart-item-remove` | `click` | Updates quantity, re-computes subtotal, tax, and discount instantly. |
| **Cart Clear All** | `#cart-clear-btn` | `click` | Empties cart and displays `#cart-empty-msg`. |
| **Cart Promo Apply** | `#cart-apply-promo-btn` | `click` | Validates against `DATTEBAYO`, `HOKAGE50`, `CHIDORI10`, updates discount line. |
| **Proceed to Checkout** | `#cart-checkout-btn` | `click` | Closes cart drawer and opens `#checkout-modal` scroll. |
| **Checkout Submit Mission** | `#checkout-form` | `submit` | Validates delivery address, awards loyalty points, closes checkout, opens `#order-tracking-modal`. |
| **Mission Kunai Tracking** | `#order-tracking-modal` | automatic/interval | Advances Kunai across 4 delivery stages with visual checkmarks and sound chimes. |
| **Shinobi Passport Name Edit** | `#ninja-name-input` | `input` | Live re-renders name on digital headband passport. |
| **Shinobi Village Emblem Change**| `#ninja-village-select` | `change` | Swaps SVG village crest (Leaf, Sand, Mist, Cloud, Stone) on passport. |
| **Ninja Review Modal Open** | `#btn-open-review-modal` | `click` | Opens review submission form `#add-review-modal`. |
| **Ninja Review Submit** | `#review-form` | `submit` | Adds review to live carousel, awards 50 Shinobi bonus points, shows toast. |

---

## 7. FILE ARCHITECTURE FOR ZORO (THE BUILDER)

Zoro MUST structure the application cleanly with the following files:
1. `index.html`: The complete single-page application structure housing all sections, SVG icons, modals, and drawers.
2. `styles.css`: Complete styling, layout grids, animations (Kunai glide, Rasengan spin, Chakra glow), responsive media queries.
3. `app.js`: Complete JavaScript business logic, state handling, Web Audio sound effects generator, modal managers, cart calculations, and reactive event bindings.

---

## 8. ARCHITECTURAL SIGN-OFF & MANDATE
- **Zero dead links, zero empty button handlers, zero placeholders.**
- **No external server required:** All data, promo codes, cart state, sound synthesis, and mission tracking operate smoothly client-side with optional `localStorage` persistence.
- **Contract Ready:** This document stands as the single source of truth for Zoro (Builder) to build the Naruto Anime Coffee Shop Web Application immediately.

*Signed with Leaf Village Chakra Seal by Nami (Architect).*