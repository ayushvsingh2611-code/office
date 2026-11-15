/* =========================================================================
   ATELIER & CO. — High-Street & Luxury Fashion E-Commerce Application State & Logic
   Architect: Nami (Group 1 - Architect)
   Builder: Zoro (Group 1 - Builder)
   ========================================================================== */

// 5. Mandatory Pre-Loaded Fashion Catalog (12 Authentic Items)
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

// Size guide measurements dataset
const SIZE_GUIDE_DATA = {
  metric: [
    { size: "XS", chest: "82 - 86 cm", waist: "62 - 66 cm", hips: "88 - 92 cm", sleeve: "78 cm" },
    { size: "S", chest: "86 - 90 cm", waist: "66 - 70 cm", hips: "92 - 96 cm", sleeve: "79 cm" },
    { size: "M", chest: "90 - 96 cm", waist: "70 - 76 cm", hips: "96 - 102 cm", sleeve: "80 cm" },
    { size: "L", chest: "96 - 102 cm", waist: "76 - 82 cm", hips: "102 - 108 cm", sleeve: "81.5 cm" },
    { size: "XL", chest: "102 - 108 cm", waist: "82 - 88 cm", hips: "108 - 114 cm", sleeve: "83 cm" }
  ],
  imperial: [
    { size: "XS", chest: "32 - 34 in", waist: "24 - 26 in", hips: "34 - 36 in", sleeve: "30.5 in" },
    { size: "S", chest: "34 - 35.5 in", waist: "26 - 27.5 in", hips: "36 - 38 in", sleeve: "31 in" },
    { size: "M", chest: "35.5 - 38 in", waist: "27.5 - 30 in", hips: "38 - 40 in", sleeve: "31.5 in" },
    { size: "L", chest: "38 - 40 in", waist: "30 - 32 in", hips: "40 - 42.5 in", sleeve: "32 in" },
    { size: "XL", chest: "40 - 42.5 in", waist: "32 - 34.5 in", hips: "42.5 - 45 in", sleeve: "32.5 in" }
  ]
};

// Global App State
const AppState = {
  products: [...MOCK_PRODUCTS],
  filteredProducts: [...MOCK_PRODUCTS],
  cart: JSON.parse(localStorage.getItem('atelier_cart')) || [],
  wishlist: new Set(JSON.parse(localStorage.getItem('atelier_wishlist')) || []),
  activeFilters: {
    category: "all",
    searchQuery: "",
    priceMax: 500,
    sortBy: "featured",
    inStockOnly: false
  },
  layoutView: "columns-4",
  promoCode: null, // { code: "VOGUE20", discountPercent: 20 }
  freeShippingThreshold: 150,
  activeQuickViewProduct: null,
  activeSizeUnit: "metric",
  currentCheckoutStep: 1,
  checkoutShippingData: {}
};

// 7.1 Initialization on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  // 1. Render Catalog
  filterCatalog();
  
  // 2. Update Badges
  updateWishlistUI();
  updateCartUI();

  // 3. Attach Event Listeners
  attachEventListeners();

  // 4. Populate Size Guide Table
  renderSizeGuideTable();
}

// 7.2 Catalog Filtering & Search
function filterCatalog() {
  const { category, searchQuery, priceMax, sortBy, inStockOnly } = AppState.activeFilters;

  let result = AppState.products.filter(p => {
    // Category filter
    if (category !== "all" && p.category !== category) return false;
    // Price filter
    if (p.price > priceMax) return false;
    // In-stock filter
    if (inStockOnly && p.stock <= 0) return false;
    // Search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchDesc && !matchCat) return false;
    }
    return true;
  });

  // Sorting
  if (sortBy === "price-asc") {
    result.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    result.sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    result.sort((a, b) => b.rating - a.rating);
  } else {
    // featured
    result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  AppState.filteredProducts = result;
  renderProducts(AppState.filteredProducts);
}

function renderProducts(products) {
  const grid = document.getElementById("products-grid");
  const countLabel = document.getElementById("catalog-count-label");
  const emptyState = document.getElementById("empty-catalog-state");

  countLabel.textContent = `Showing ${products.length} ${products.length === 1 ? 'piece' : 'pieces'}`;

  if (products.length === 0) {
    grid.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  grid.innerHTML = products.map(p => {
    const isWishlisted = AppState.wishlist.has(p.id);
    const badgeHtml = p.badge ? `<span class=\"badge badge-${p.badge.toLowerCase()}\">${p.badge}</span>` : '';
    const originalPriceHtml = p.originalPrice > p.price ? `<span class=\"price-original\">$${p.originalPrice.toFixed(2)}</span>` : '';
    
    const swatchesHtml = p.colors.map(c => `
      <span class=\"swatch-dot\" style=\"background-color: ${c.hex};\" title=\"${c.name}\"></span>
    `).join('');

    const sizesHtml = p.sizes.map(s => `
      <button class=\"quick-size-btn\" data-product-id=\"${p.id}\" data-size=\"${s}\">${s}</button>
    `).join('');

    return `
      <article class=\"product-card\" data-product-id=\"${p.id}\">
        <div class=\"product-card-media\">
          ${badgeHtml}
          <button class=\"card-btn-wishlist ${isWishlisted ? 'active' : ''}\" data-product-id=\"${p.id}\" title=\"Toggle Wishlist\">
            <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"${isWishlisted ? 'currentColor' : 'none'}\" stroke=\"currentColor\" stroke-width=\"1.8\"><path d=\"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\"/></svg>
          </button>
          <img class=\"product-img primary\" src=\"${p.images[0]}\" alt=\"${p.name}\" loading=\"lazy\">
          <img class=\"product-img secondary\" src=\"${p.images[1] || p.images[0]}\" alt=\"${p.name} detail\" loading=\"lazy\">
          <button class=\"card-btn-quickview\" data-product-id=\"${p.id}\">QUICK VIEW</button>
        </div>
        <div class=\"product-card-info\">
          <span class=\"product-card-category\">${p.category.toUpperCase()} &bull; ${p.sku}</span>
          <h3 class=\"product-card-title\">${p.name}</h3>
          <div class=\"product-rating\">&#9733; ${p.rating} (${p.reviewCount})</div>
          <div class=\"product-price-row\">
            <span class=\"price-current\">$${p.price.toFixed(2)}</span>
            ${originalPriceHtml}
          </div>
          <div class=\"product-swatches\">${swatchesHtml}</div>
          <div class=\"product-quick-sizes\">${sizesHtml}</div>
        </div>
      </article>
    `;
  }).join('');
}

// 7.3 Cart Management Functions
function addToCart(productId, size, colorObj, quantity = 1) {
  const product = AppState.products.find(p => p.id === productId);
  if (!product) return;

  const selectedSize = size || product.sizes[0];
  const selectedColor = colorObj || product.colors[0];
  const cartItemId = `${productId}-${selectedSize}-${selectedColor.name}`;

  const existingItemIndex = AppState.cart.findIndex(item => item.cartItemId === cartItemId);

  if (existingItemIndex > -1) {
    AppState.cart[existingItemIndex].quantity += quantity;
  } else {
    AppState.cart.push({
      cartItemId,
      productId,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      selectedSize,
      selectedColor,
      image: product.images[0],
      quantity
    });
  }

  saveCartToLocalStorage();
  updateCartUI();
  openCartDrawer();
  showToast(`Added "${product.name}" (${selectedSize}, ${selectedColor.name}) to bag.`);
}

function removeFromCart(cartItemId) {
  AppState.cart = AppState.cart.filter(item => item.cartItemId !== cartItemId);
  saveCartToLocalStorage();
  updateCartUI();
  showToast("Item removed from shopping bag.", "info");
}

function updateCartQuantity(cartItemId, delta) {
  const item = AppState.cart.find(i => i.cartItemId === cartItemId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(cartItemId);
    return;
  }

  saveCartToLocalStorage();
  updateCartUI();
}

function saveCartToLocalStorage() {
  localStorage.setItem('atelier_cart', JSON.stringify(AppState.cart));
}

function calculateCartTotals() {
  const subtotal = AppState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let discount = 0;
  if (AppState.promoCode) {
    discount = subtotal * (AppState.promoCode.discountPercent / 100);
  }

  const netSubtotal = subtotal - discount;
  const shipping = netSubtotal >= AppState.freeShippingThreshold || netSubtotal === 0 ? 0 : 15.00;
  const total = netSubtotal + shipping;

  return { subtotal, discount, shipping, total };
}

function updateCartUI() {
  const countBadge = document.getElementById("cart-badge-count");
  const drawerCount = document.getElementById("cart-drawer-count");
  const totalItemsCount = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);

  countBadge.textContent = totalItemsCount;
  drawerCount.textContent = `(${totalItemsCount})`;

  const itemsContainer = document.getElementById("cart-items-container");
  const emptyView = document.getElementById("cart-empty-view");

  if (AppState.cart.length === 0) {
    itemsContainer.innerHTML = "";
    itemsContainer.appendChild(emptyView);
    emptyView.classList.remove("hidden");
  } else {
    emptyView.classList.add("hidden");
    itemsContainer.innerHTML = AppState.cart.map(item => `
      <div class=\"cart-item-card\">
        <img class=\"cart-item-img\" src=\"${item.image}\" alt=\"${item.name}\">
        <div class=\"cart-item-info\">
          <h4 class=\"cart-item-title\">${item.name}</h4>
          <span class=\"cart-item-variant\">Size: ${item.selectedSize} &bull; Color: ${item.selectedColor.name}</span>
          <div class=\"cart-item-price\">$${item.price.toFixed(2)}</div>
          <div class=\"cart-item-controls\">
            <div class=\"mini-stepper\">
              <button class=\"cart-qty-minus\" data-cart-item-id=\"${item.cartItemId}\">-</button>
              <span>${item.quantity}</span>
              <button class=\"cart-qty-plus\" data-cart-item-id=\"${item.cartItemId}\">+</button>
            </div>
            <button class=\"cart-item-remove\" data-cart-item-id=\"${item.cartItemId}\">Remove</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Shipping progress bar calculation
  const totals = calculateCartTotals();
  const progressPercent = Math.min(100, (totals.subtotal / AppState.freeShippingThreshold) * 100);
  document.getElementById("cart-shipping-bar").style.width = `${progressPercent}%`;

  const shippingMsg = document.getElementById("cart-shipping-msg");
  if (totals.subtotal >= AppState.freeShippingThreshold) {
    shippingMsg.textContent = "Congratulations! You qualify for FREE Global Express Courier.";
  } else {
    const diff = (AppState.freeShippingThreshold - totals.subtotal).toFixed(2);
    shippingMsg.textContent = `Add $${diff} more for FREE Global Express Courier`;
  }

  // Summary totals
  document.getElementById("cart-subtotal").textContent = `$${totals.subtotal.toFixed(2)}`;
  
  const discountRow = document.getElementById("cart-discount-row");
  if (AppState.promoCode && totals.discount > 0) {
    discountRow.classList.remove("hidden");
    document.getElementById("cart-discount-val").textContent = `-$${totals.discount.toFixed(2)}`;
  } else {
    discountRow.classList.add("hidden");
  }

  document.getElementById("cart-shipping-fee").textContent = totals.shipping === 0 ? "FREE" : `$${totals.shipping.toFixed(2)}`;
  document.getElementById("cart-total").textContent = `$${totals.total.toFixed(2)}`;
}

// 7.4 Wishlist Functions
function toggleWishlist(productId) {
  const product = AppState.products.find(p => p.id === productId);
  if (!product) return;

  if (AppState.wishlist.has(productId)) {
    AppState.wishlist.delete(productId);
    showToast(`Removed "${product.name}" from wishlist.`, "info");
  } else {
    AppState.wishlist.add(productId);
    showToast(`Saved "${product.name}" to your wishlist.`);
  }

  saveWishlistToLocalStorage();
  updateWishlistUI();
  filterCatalog(); // re-render grid to update heart states
  if (document.getElementById("wishlist-drawer").classList.contains("active")) {
    renderWishlistDrawer();
  }
}

function saveWishlistToLocalStorage() {
  localStorage.setItem('atelier_wishlist', JSON.stringify(Array.from(AppState.wishlist)));
}

function updateWishlistUI() {
  const countBadge = document.getElementById("wishlist-badge-count");
  const drawerCount = document.getElementById("wishlist-drawer-count");
  const count = AppState.wishlist.size;

  countBadge.textContent = count;
  drawerCount.textContent = `(${count})`;
}

function renderWishlistDrawer() {
  const container = document.getElementById("wishlist-items-container");
  const emptyView = document.getElementById("wishlist-empty-view");

  if (AppState.wishlist.size === 0) {
    container.innerHTML = "";
    container.appendChild(emptyView);
    emptyView.classList.remove("hidden");
    return;
  }

  emptyView.classList.add("hidden");
  const items = Array.from(AppState.wishlist).map(id => AppState.products.find(p => p.id === id)).filter(Boolean);

  container.innerHTML = items.map(p => `
    <div class=\"cart-item-card\">
      <img class=\"cart-item-img\" src=\"${p.images[0]}\" alt=\"${p.name}\">
      <div class=\"cart-item-info\">
        <h4 class=\"cart-item-title\">${p.name}</h4>
        <div class=\"cart-item-price\">$${p.price.toFixed(2)}</div>
        <div class=\"cart-item-controls\">
          <button class=\"btn btn-outline\" style=\"padding: 6px 12px; font-size: 10px;\" onclick=\"moveWishlistToCart('${p.id}')\">MOVE TO BAG</button>
          <button class=\"cart-item-remove\" onclick=\"toggleWishlist('${p.id}')\">Remove</button>
        </div>
      </div>
    </div>
  `).join('');
}

function moveWishlistToCart(productId) {
  const product = AppState.products.find(p => p.id === productId);
  if (!product) return;
  addToCart(productId, product.sizes[0], product.colors[0], 1);
  toggleWishlist(productId);
  renderWishlistDrawer();
}

function moveAllWishlistToCart() {
  const ids = Array.from(AppState.wishlist);
  if (ids.length === 0) return;
  ids.forEach(id => {
    const product = AppState.products.find(p => p.id === id);
    if (product) {
      addToCart(id, product.sizes[0], product.colors[0], 1);
    }
  });
  AppState.wishlist.clear();
  saveWishlistToLocalStorage();
  updateWishlistUI();
  renderWishlistDrawer();
  filterCatalog();
  showToast("All saved wishlist pieces moved to shopping bag.");
}

// 7.5 Quick View & Modal Controllers
function openQuickView(productId) {
  const product = AppState.products.find(p => p.id === productId);
  if (!product) return;

  AppState.activeQuickViewProduct = {
    ...product,
    selectedSize: product.sizes[0],
    selectedColor: product.colors[0],
    quantity: 1
  };

  const modal = document.getElementById("quickview-modal");
  document.getElementById("quickview-sku").textContent = `${product.category.toUpperCase()} • ${product.sku}`;
  document.getElementById("quickview-title").textContent = product.name;
  document.getElementById("quickview-desc").textContent = product.description;
  
  const badgeEl = document.getElementById("quickview-badge");
  if (product.badge) {
    badgeEl.textContent = product.badge;
    badgeEl.className = `badge badge-${product.badge.toLowerCase()}`;
    badgeEl.style.display = "block";
  } else {
    badgeEl.style.display = "none";
  }

  document.getElementById("quickview-price").innerHTML = `
    <span class=\"price-current\">$${product.price.toFixed(2)}</span>
    ${product.originalPrice > product.price ? `<span class=\"price-original\">$${product.originalPrice.toFixed(2)}</span>` : ''}
  `;

  // Images
  const mainImg = document.getElementById("quickview-image-main");
  mainImg.src = product.images[0];
  const thumbsContainer = document.getElementById("quickview-thumbnails");
  thumbsContainer.innerHTML = product.images.map((img, idx) => `
    <img class=\"thumb-img ${idx === 0 ? 'active' : ''}\" src=\"${img}\" alt=\"Thumbnail ${idx}\" onclick=\"document.getElementById('quickview-image-main').src='${img}'; document.querySelectorAll('.thumb-img').forEach(el=>el.classList.remove('active')); this.classList.add('active');\">
  `).join('');

  // Colors
  document.getElementById("quickview-color-label").textContent = product.colors[0].name;
  const colorsContainer = document.getElementById("quickview-colors-list");
  colorsContainer.innerHTML = product.colors.map((c, idx) => `
    <button class=\"qv-swatch ${idx === 0 ? 'active' : ''}\" style=\"background-color: ${c.hex};\" data-color-name=\"${c.name}\" title=\"${c.name}\" onclick=\"selectQuickViewColor('${c.name}')\"></button>
  `).join('');

  // Sizes
  const sizesContainer = document.getElementById("quickview-sizes-list");
  sizesContainer.innerHTML = product.sizes.map((s, idx) => `
    <button class=\"qv-size-btn ${idx === 0 ? 'active' : ''}\" data-size=\"${s}\" onclick=\"selectQuickViewSize('${s}')\">${s}</button>
  `).join('');

  // Qty
  document.getElementById("quickview-qty-input").value = 1;

  // Stock alert
  const stockAlert = document.getElementById("quickview-stock-alert");
  if (product.stock <= 5) {
    stockAlert.textContent = `Only ${product.stock} items remaining in atelier stock`;
    stockAlert.style.display = "block";
  } else {
    stockAlert.style.display = "none";
  }

  // Details list
  document.getElementById("quickview-details-list").innerHTML = product.details.map(d => `<li>${d}</li>`).join('');

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function selectQuickViewColor(colorName) {
  if (!AppState.activeQuickViewProduct) return;
  const found = AppState.activeQuickViewProduct.colors.find(c => c.name === colorName);
  if (found) {
    AppState.activeQuickViewProduct.selectedColor = found;
    document.getElementById("quickview-color-label").textContent = found.name;
    document.querySelectorAll(".qv-swatch").forEach(el => {
      if (el.getAttribute("data-color-name") === colorName) el.classList.add("active");
      else el.classList.remove("active");
    });
  }
}

function selectQuickViewSize(size) {
  if (!AppState.activeQuickViewProduct) return;
  AppState.activeQuickViewProduct.selectedSize = size;
  document.querySelectorAll(".qv-size-btn").forEach(el => {
    if (el.getAttribute("data-size") === size) el.classList.add("active");
    else el.classList.remove("active");
  });
}

function closeQuickView() {
  document.getElementById("quickview-modal").classList.remove("active");
  document.body.style.overflow = "";
  AppState.activeQuickViewProduct = null;
}

// Drawer controls
function openCartDrawer() {
  // Close wishlist drawer first to prevent pointer event interception / overlapping active states
  closeWishlistDrawer();
  document.getElementById("cart-drawer").classList.add("active");
  document.getElementById("cart-drawer-overlay").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCartDrawer() {
  document.getElementById("cart-drawer").classList.remove("active");
  document.getElementById("cart-drawer-overlay").classList.remove("active");
  document.body.style.overflow = "";
}

function openWishlistDrawer() {
  // Close cart drawer first to prevent pointer event interception / overlapping active states
  closeCartDrawer();
  renderWishlistDrawer();
  document.getElementById("wishlist-drawer").classList.add("active");
  document.getElementById("wishlist-drawer-overlay").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeWishlistDrawer() {
  document.getElementById("wishlist-drawer").classList.remove("active");
  document.getElementById("wishlist-drawer-overlay").classList.remove("active");
  document.body.style.overflow = "";
}

function openSizeGuide() {
  renderSizeGuideTable();
  document.getElementById("sizeguide-modal").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeSizeGuide() {
  document.getElementById("sizeguide-modal").classList.remove("active");
  document.body.style.overflow = "";
}

function renderSizeGuideTable() {
  const tbody = document.getElementById("sizeguide-table-body");
  const data = SIZE_GUIDE_DATA[AppState.activeSizeUnit];
  tbody.innerHTML = data.map(row => `
    <tr>
      <td><strong>${row.size}</strong></td>
      <td>${row.chest}</td>
      <td>${row.waist}</td>
      <td>${row.hips}</td>
      <td>${row.sleeve}</td>
    </tr>
  `).join('');
}

// Checkout flow
function openCheckout() {
  if (AppState.cart.length === 0) {
    showToast("Your shopping bag is empty.", "alert");
    return;
  }
  closeCartDrawer();
  AppState.currentCheckoutStep = 1;
  updateCheckoutStepsUI();
  document.getElementById("checkout-modal").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCheckout() {
  document.getElementById("checkout-modal").classList.remove("active");
  document.body.style.overflow = "";
}

function updateCheckoutStepsUI() {
  for (let i = 1; i <= 3; i++) {
    const stepEl = document.getElementById(`checkout-step-${i}`);
    if (i === AppState.currentCheckoutStep) {
      stepEl.classList.add("active");
    } else {
      stepEl.classList.remove("active");
    }
  }

  // Dots
  const dots = document.querySelectorAll(".step-dot");
  dots.forEach(d => {
    const stepNum = parseInt(d.getAttribute("data-step"));
    if (stepNum <= AppState.currentCheckoutStep) {
      d.classList.add("active");
    } else {
      d.classList.remove("active");
    }
  });
}

// 7.6 Toast Notification System
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  let iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
  if (type === "alert") {
    iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
  } else if (type === "info") {
    iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
  }

  toast.innerHTML = `${iconSvg} <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "toastSlideOut 250ms cubic-bezier(0.4, 0, 0.2, 1) forwards";
    setTimeout(() => {
      toast.remove();
    }, 250);
  }, 3000);
}

// 8. Event Handlers & Zero-Dead-Button Mapping
function attachEventListeners() {
  // Announcement bar close
  document.getElementById("announcement-close").addEventListener("click", () => {
    document.getElementById("announcement-bar").style.display = "none";
  });

  // Copy promo code
  document.getElementById("copy-vogue-btn").addEventListener("click", () => {
    navigator.clipboard.writeText("VOGUE20").then(() => {
      showToast("Promo code VOGUE20 copied to clipboard!");
    });
  });

  // Brand logo reset
  document.getElementById("nav-brand-logo").addEventListener("click", (e) => {
    e.preventDefault();
    resetAllFilters();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Category navigation links
  document.querySelectorAll("#category-nav-list a").forEach(a => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const cat = a.getAttribute("data-cat");
      setActiveCategory(cat);
      document.querySelectorAll("#category-nav-list a").forEach(el => el.classList.remove("active"));
      a.classList.add("active");
      document.getElementById("catalog-section").scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Mobile Menu Toggle
  const mobileDrawer = document.getElementById("mobile-nav-drawer");
  document.getElementById("mobile-menu-btn").addEventListener("click", () => {
    mobileDrawer.classList.add("active");
  });
  document.getElementById("mobile-drawer-close").addEventListener("click", () => {
    mobileDrawer.classList.remove("active");
  });
  document.querySelectorAll(".mobile-cat-link").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const cat = link.getAttribute("data-cat");
      setActiveCategory(cat);
      mobileDrawer.classList.remove("active");
      document.getElementById("catalog-section").scrollIntoView({ behavior: 'smooth' });
    });
  });
  document.getElementById("mobile-size-guide-link").addEventListener("click", (e) => {
    e.preventDefault();
    mobileDrawer.classList.remove("active");
    openSizeGuide();
  });
  document.getElementById("mobile-shipping-link").addEventListener("click", (e) => {
    e.preventDefault();
    mobileDrawer.classList.remove("active");
    showToast("Complimentary express global courier on orders over $150.", "info");
  });

  // Search Toggle
  const searchDrawer = document.getElementById("search-bar-container");
  const searchInput = document.getElementById("search-input");
  document.getElementById("search-toggle-btn").addEventListener("click", () => {
    searchDrawer.classList.toggle("active");
    if (searchDrawer.classList.contains("active")) {
      searchInput.focus();
    }
  });
  document.getElementById("search-close-btn").addEventListener("click", () => {
    searchDrawer.classList.remove("active");
  });
  document.getElementById("search-clear-btn").addEventListener("click", () => {
    searchInput.value = "";
    AppState.activeFilters.searchQuery = "";
    filterCatalog();
  });
  searchInput.addEventListener("input", (e) => {
    AppState.activeFilters.searchQuery = e.target.value;
    filterCatalog();
  });

  // Keyboard shortcut '/' for search
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
      e.preventDefault();
      searchDrawer.classList.add("active");
      searchInput.focus();
    }
    if (e.key === "Escape") {
      searchDrawer.classList.remove("active");
      closeQuickView();
      closeCartDrawer();
      closeWishlistDrawer();
      closeCheckout();
      closeSizeGuide();
      mobileDrawer.classList.remove("active");
    }
  });

  // Wishlist & Cart Toggle
  document.getElementById("wishlist-toggle-btn").addEventListener("click", openWishlistDrawer);
  document.getElementById("wishlist-close-btn").addEventListener("click", closeWishlistDrawer);
  document.getElementById("wishlist-drawer-overlay").addEventListener("click", closeWishlistDrawer);
  document.querySelectorAll(".close-wishlist-action").forEach(el => el.addEventListener("click", () => {
    closeWishlistDrawer();
    document.getElementById("catalog-section").scrollIntoView({ behavior: 'smooth' });
  }));

  document.getElementById("cart-toggle-btn").addEventListener("click", openCartDrawer);
  document.getElementById("cart-close-btn").addEventListener("click", closeCartDrawer);
  document.getElementById("cart-drawer-overlay").addEventListener("click", closeCartDrawer);
  document.querySelectorAll(".close-cart-action").forEach(el => el.addEventListener("click", () => {
    closeCartDrawer();
    document.getElementById("catalog-section").scrollIntoView({ behavior: 'smooth' });
  }));

  // Hero CTAs
  document.getElementById("hero-cta-shop").addEventListener("click", () => {
    document.getElementById("catalog-section").scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById("hero-cta-lookbook").addEventListener("click", () => {
    setGridView("columns-2");
    document.getElementById("catalog-section").scrollIntoView({ behavior: 'smooth' });
  });
  document.querySelectorAll("#ticker-category-chips .chip-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const cat = btn.getAttribute("data-cat");
      setActiveCategory(cat);
      document.getElementById("catalog-section").scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Category Pills
  document.querySelectorAll(".cat-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      const cat = pill.getAttribute("data-cat");
      setActiveCategory(cat);
    });
  });

  // Sort select
  document.getElementById("sort-select").addEventListener("change", (e) => {
    AppState.activeFilters.sortBy = e.target.value;
    filterCatalog();
  });

  // Price slider
  const priceSlider = document.getElementById("price-range-slider");
  const priceValLabel = document.getElementById("price-range-value");
  priceSlider.addEventListener("input", (e) => {
    const val = parseInt(e.target.value);
    priceValLabel.textContent = val;
    AppState.activeFilters.priceMax = val;
    filterCatalog();
  });

  // In-stock checkbox
  document.getElementById("instock-filter-check").addEventListener("change", (e) => {
    AppState.activeFilters.inStockOnly = e.target.checked;
    filterCatalog();
  });

  // Reset filters
  document.getElementById("reset-filters-btn").addEventListener("click", resetAllFilters);
  document.getElementById("empty-reset-btn").addEventListener("click", resetAllFilters);

  // Grid Toggles
  document.getElementById("grid-toggle-2").addEventListener("click", () => setGridView("columns-2"));
  document.getElementById("grid-toggle-4").addEventListener("click", () => setGridView("columns-4"));

  // Products Grid delegation (Wishlist, Quickview, Quick size)
  document.getElementById("products-grid").addEventListener("click", (e) => {
    const wishlistBtn = e.target.closest(".card-btn-wishlist");
    if (wishlistBtn) {
      const productId = wishlistBtn.getAttribute("data-product-id");
      toggleWishlist(productId);
      return;
    }

    const qvBtn = e.target.closest(".card-btn-quickview");
    if (qvBtn) {
      const productId = qvBtn.getAttribute("data-product-id");
      openQuickView(productId);
      return;
    }

    const quickSizeBtn = e.target.closest(".quick-size-btn");
    if (quickSizeBtn) {
      const productId = quickSizeBtn.getAttribute("data-product-id");
      const size = quickSizeBtn.getAttribute("data-size");
      addToCart(productId, size, null, 1);
      return;
    }
  });

  // Quickview modal actions
  document.getElementById("quickview-close-btn").addEventListener("click", closeQuickView);
  document.getElementById("quickview-modal").addEventListener("click", (e) => {
    if (e.target === document.getElementById("quickview-modal")) closeQuickView();
  });
  document.getElementById("quickview-size-guide-btn").addEventListener("click", openSizeGuide);
  
  document.getElementById("quickview-qty-minus").addEventListener("click", () => {
    if (!AppState.activeQuickViewProduct) return;
    if (AppState.activeQuickViewProduct.quantity > 1) {
      AppState.activeQuickViewProduct.quantity--;
      document.getElementById("quickview-qty-input").value = AppState.activeQuickViewProduct.quantity;
    }
  });
  document.getElementById("quickview-qty-plus").addEventListener("click", () => {
    if (!AppState.activeQuickViewProduct) return;
    if (AppState.activeQuickViewProduct.quantity < 20) {
      AppState.activeQuickViewProduct.quantity++;
      document.getElementById("quickview-qty-input").value = AppState.activeQuickViewProduct.quantity;
    }
  });
  document.getElementById("quickview-add-cart-btn").addEventListener("click", () => {
    if (!AppState.activeQuickViewProduct) return;
    const p = AppState.activeQuickViewProduct;
    addToCart(p.id, p.selectedSize, p.selectedColor, p.quantity);
    closeQuickView();
  });

  // Cart Drawer Items Delegation
  document.getElementById("cart-items-container").addEventListener("click", (e) => {
    const minusBtn = e.target.closest(".cart-qty-minus");
    if (minusBtn) {
      updateCartQuantity(minusBtn.getAttribute("data-cart-item-id"), -1);
      return;
    }
    const plusBtn = e.target.closest(".cart-qty-plus");
    if (plusBtn) {
      updateCartQuantity(plusBtn.getAttribute("data-cart-item-id"), 1);
      return;
    }
    const removeBtn = e.target.closest(".cart-item-remove");
    if (removeBtn) {
      removeFromCart(removeBtn.getAttribute("data-cart-item-id"));
      return;
    }
  });

  document.getElementById("cart-clear-btn").addEventListener("click", () => {
    AppState.cart = [];
    saveCartToLocalStorage();
    updateCartUI();
    showToast("Shopping bag emptied.", "info");
  });

  // Promo apply
  document.getElementById("promo-apply-btn").addEventListener("click", () => {
    const codeInput = document.getElementById("promo-input");
    const code = codeInput.value.trim().toUpperCase();
    const statusMsg = document.getElementById("promo-status-msg");

    if (code === "VOGUE20") {
      AppState.promoCode = { code: "VOGUE20", discountPercent: 20 };
      statusMsg.textContent = "Voucher VOGUE20 applied successfully (-20%).";
      statusMsg.className = "promo-status success";
      updateCartUI();
      showToast("Promo code VOGUE20 applied!");
    } else if (code === "WELCOME10") {
      AppState.promoCode = { code: "WELCOME10", discountPercent: 10 };
      statusMsg.textContent = "Voucher WELCOME10 applied successfully (-10%).";
      statusMsg.className = "promo-status success";
      updateCartUI();
      showToast("Promo code WELCOME10 applied!");
    } else {
      statusMsg.textContent = "Invalid or expired promo code.";
      statusMsg.className = "promo-status error";
      showToast("Invalid promo code.", "alert");
    }
  });

  document.getElementById("cart-checkout-btn").addEventListener("click", openCheckout);

  // Wishlist Move All
  document.getElementById("wishlist-move-all-btn").addEventListener("click", moveAllWishlistToCart);

  // Checkout Modal
  document.getElementById("checkout-close-btn").addEventListener("click", closeCheckout);
  document.getElementById("checkout-modal").addEventListener("click", (e) => {
    if (e.target === document.getElementById("checkout-modal")) closeCheckout();
  });

  document.getElementById("shipping-form").addEventListener("submit", (e) => {
    e.preventDefault();
    AppState.checkoutShippingData = {
      name: document.getElementById("ship-name").value,
      email: document.getElementById("ship-email").value,
      address: document.getElementById("ship-address").value,
      city: document.getElementById("ship-city").value,
      state: document.getElementById("ship-state").value,
      zip: document.getElementById("ship-zip").value,
      country: document.getElementById("ship-country").value
    };
    AppState.currentCheckoutStep = 2;
    updateCheckoutStepsUI();
  });

  document.getElementById("back-to-step1-btn").addEventListener("click", () => {
    AppState.currentCheckoutStep = 1;
    updateCheckoutStepsUI();
  });

  document.getElementById("payment-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const payBtn = document.getElementById("complete-order-btn");
    payBtn.textContent = "AUTHORIZING SSL...";
    payBtn.disabled = true;

    setTimeout(() => {
      payBtn.textContent = "AUTHORIZE & PAY SECURELY";
      payBtn.disabled = false;
      
      const randomOrderId = `ATL-${Math.floor(10000 + Math.random() * 90000)}`;
      document.getElementById("confirmed-order-id").textContent = randomOrderId;
      document.getElementById("confirmed-email-sent").textContent = AppState.checkoutShippingData.email || "customer@atelier.com";

      // Clear Cart
      AppState.cart = [];
      saveCartToLocalStorage();
      updateCartUI();

      AppState.currentCheckoutStep = 3;
      updateCheckoutStepsUI();
      showToast("Order authorized and placed successfully!");
    }, 1200);
  });

  document.getElementById("finish-shopping-btn").addEventListener("click", () => {
    closeCheckout();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Size Guide Modal
  document.getElementById("sizeguide-close-btn").addEventListener("click", closeSizeGuide);
  document.getElementById("sizeguide-modal").addEventListener("click", (e) => {
    if (e.target === document.getElementById("sizeguide-modal")) closeSizeGuide();
  });
  document.getElementById("unit-toggle-cm").addEventListener("click", () => {
    AppState.activeSizeUnit = "metric";
    document.getElementById("unit-toggle-cm").classList.add("active");
    document.getElementById("unit-toggle-in").classList.remove("active");
    renderSizeGuideTable();
  });
  document.getElementById("unit-toggle-in").addEventListener("click", () => {
    AppState.activeSizeUnit = "imperial";
    document.getElementById("unit-toggle-in").classList.add("active");
    document.getElementById("unit-toggle-cm").classList.remove("active");
    renderSizeGuideTable();
  });
}

function setActiveCategory(cat) {
  AppState.activeFilters.category = cat;
  document.querySelectorAll(".cat-pill").forEach(p => {
    if (p.getAttribute("data-cat") === cat) p.classList.add("active");
    else p.classList.remove("active");
  });
  filterCatalog();
}

function setGridView(viewMode) {
  AppState.layoutView = viewMode;
  const grid = document.getElementById("products-grid");
  const btn2 = document.getElementById("grid-toggle-2");
  const btn4 = document.getElementById("grid-toggle-4");

  if (viewMode === "columns-2") {
    grid.className = "products-grid columns-2";
    btn2.classList.add("active");
    btn4.classList.remove("active");
  } else {
    grid.className = "products-grid columns-4";
    btn4.classList.add("active");
    btn2.classList.remove("active");
  }
}

function resetAllFilters() {
  AppState.activeFilters = {
    category: "all",
    searchQuery: "",
    priceMax: 500,
    sortBy: "featured",
    inStockOnly: false
  };
  document.getElementById("sort-select").value = "featured";
  document.getElementById("price-range-slider").value = 500;
  document.getElementById("price-range-value").textContent = "500";
  document.getElementById("instock-filter-check").checked = false;
  document.getElementById("search-input").value = "";
  document.getElementById("search-bar-container").classList.remove("active");

  document.querySelectorAll(".cat-pill").forEach(p => {
    if (p.getAttribute("data-cat") === "all") p.classList.add("active");
    else p.classList.remove("active");
  });

  document.querySelectorAll("#category-nav-list a").forEach(a => {
    if (a.getAttribute("data-cat") === "all") a.classList.add("active");
    else a.classList.remove("active");
  });

  filterCatalog();
  showToast("All filters reset.", "info");
}
