```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>E Commerce — 10 Mins Superfast Delivery</title>
  <!-- Google Fonts: Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <!-- FontAwesome 6 Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="style.css">
</head>
<body class="zepto-theme">
  <!-- Top Banner / Delivery Ticker -->
  <div class="delivery-ticker">
    <div class="ticker-content">
      <span class="ticker-highlight"><i class="fa-solid fa-bolt"></i> 10 MINS SUPERFAST DELIVERY</span>
      <span class="ticker-divider">•</span>
      <span>Deliver to <strong>Indiranagar, Bengaluru (560038)</strong></span>
      <span class="ticker-divider">•</span>
      <span>Free delivery on orders above ₹149</span>
    </div>
  </div>

  <header class="site-header">
    <div class="nav-container">
      <div class="brand">
        <div class="brand-badge">
          <i class="fa-solid fa-bolt"></i>
        </div>
        <div>
          <h1>E Commerce</h1>
          <p class="delivery-sub">
            <i class="fa-solid fa-location-dot"></i> Deliver to <strong>Indiranagar, Bengaluru ▾</strong>
          </p>
        </div>
      </div>
      <form id="search-form" class="search-box" role="search">
        <i class="fa-solid fa-magnifying-glass search-icon"></i>
        <input type="search" id="site-search" name="q" placeholder="Search for 'milk', 'mango', 'chips', 'bread'..." autocomplete="off">
        <button type="submit" class="search-btn">Search</button>
      </form>
      <div class="header-actions">
        <button type="button" id="wishlist-button" class="action-btn" title="Saved Items">
          <i class="fa-regular fa-heart"></i>
          <span>Saved</span>
        </button>
        <button type="button" id="cart-button" class="action-btn cart-btn" title="View Cart">
          <i class="fa-solid fa-cart-shopping"></i>
          <span>Cart</span>
          <span id="cart-count" class="badge">1</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Horizontal Category Scroller -->
  <nav class="category-strip" aria-label="Product categories">
    <div class="category-scroll">
      <button type="button" class="filter-btn active" data-category="all">
        <i class="fa-solid fa-bolt"></i> All Items
      </button>
      <button type="button" class="filter-btn" data-category="fruits-veg">
        <i class="fa-solid fa-apple-whole"></i> Fruits & Veggies
      </button>
      <button type="button" class="filter-btn" data-category="dairy">
        <i class="fa-solid fa-cow"></i> Dairy, Bread & Eggs
      </button>
      <button type="button" class="filter-btn" data-category="snacks">
        <i class="fa-solid fa-cookie"></i> Snacks & Munchies
      </button>
      <button type="button" class="filter-btn" data-category="drinks">
        <i class="fa-solid fa-mug-hot"></i> Drinks & Cafe
      </button>
      <button type="button" class="filter-btn" data-category="sweets">
        <i class="fa-solid fa-candy-cane"></i> Sweets & Treats
      </button>
    </div>
  </nav>

  <main class="main-content">
    <section class="promo-banner">
      <div class="promo-content">
        <span class="promo-tag"><i class="fa-solid fa-bolt"></i> INSTANT 10-MIN EXPRESS</span>
        <h2>create e commerce website.</h2>
        <p>Curated farm-fresh produce, daily essentials, and chef bakes delivered in 10 minutes flat.</p>
        <div class="coupon-badge">
          <i class="fa-solid fa-tag"></i> Use code <strong>ZEPTO50</strong> for 50% OFF up to ₹100
        </div>
      </div>
    </section>

    <section class="catalog-section">
      <div class="catalog-header">
        <div>
          <h3>Express Fresh Catalog</h3>
          <p class="section-subtitle">Real-time inventory ready at your nearest dark store</p>
        </div>
        <span class="time-badge"><i class="fa-solid fa-stopwatch"></i> Delivery in 8-10 Mins</span>
      </div>

      <div class="grid" id="product-catalog">
        <!-- 1. Alphonso Mangoes -->
        <div class="product-card" data-category="fruits-veg">
          <span class="discount-pill">25% OFF</span>
          <div class="image-wrapper">
            <img src="https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=400&q=80" alt="Ratnagiri Alphonso Mangoes" class="product-img" loading="lazy">
          </div>
          <div class="card-body">
            <div class="meta-row">
              <span class="delivery-tag"><i class="fa-solid fa-stopwatch"></i> 8 MINS</span>
              <span class="item-weight">1 kg (4 Pcs)</span>
            </div>
            <h4 class="product-title">Ratnagiri Alphonso Mangoes</h4>
            <div class="rating-row">
              <span class="stars"><i class="fa-solid fa-star"></i> 4.9</span>
              <span class="reviews">(1,420)</span>
            </div>
            <div class="card-footer">
              <div class="price-box">
                <span class="price">₹149</span>
                <span class="mrp">₹199</span>
              </div>
              <button type="button" class="btn-add-cart" data-key="mangoes">+ ADD</button>
            </div>
          </div>
        </div>

        <!-- 2. Farm Fresh Milk -->
        <div class="product-card" data-category="dairy">
          <span class="discount-pill">10% OFF</span>
          <div class="image-wrapper">
            <img src="https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80" alt="Farm Fresh Toned Milk" class="product-img" loading="lazy">
          </div>
          <div class="card-body">
            <div class="meta-row">
              <span class="delivery-tag"><i class="fa-solid fa-stopwatch"></i> 7 MINS</span>
              <span class="item-weight">1 Liter Pouch</span>
            </div>
            <h4 class="product-title">Farm Fresh Toned Milk</h4>
            <div class="rating-row">
              <span class="stars"><i class="fa-solid fa-star"></i> 4.8</span>
              <span class="reviews">(2,180)</span>
            </div>
            <div class="card-footer">
              <div class="price-box">
                <span class="price">₹27</span>
                <span class="mrp">₹30</span>
              </div>
              <button type="button" class="btn-add-cart" data-key="milk">+ ADD</button>
            </div>
          </div>
        </div>

        <!-- 3. Sourdough Loaf -->
        <div class="product-card" data-category="dairy">
          <span class="discount-pill">18% OFF</span>
          <div class="image-wrapper">
            <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80" alt="Artisan Whole Wheat Sourdough" class="product-img" loading="lazy">
          </div>
          <div class="card-body">
            <div class="meta-row">
              <span class="delivery-tag"><i class="fa-solid fa-stopwatch"></i> 9 MINS</span>
              <span class="item-weight">400g Loaf</span>
            </div>
            <h4 class="product-title">Artisan Whole Wheat Sourdough</h4>
            <div class="rating-row">
              <span class="stars"><i class="fa-solid fa-star"></i> 4.9</span>
              <span class="reviews">(920)</span>
            </div>
            <div class="card-footer">
              <div class="price-box">
                <span class="price">₹65</span>
                <span class="mrp">₹80</span>
              </div>
              <button type="button" class="btn-add-cart" data-key="bread">+ ADD</button>
            </div>
          </div>
        </div>

        <!-- 4. Farm Eggs -->
        <div class="product-card" data-category="dairy">
          <span class="discount-pill">15% OFF</span>
          <div class="image-wrapper">
            <img src="https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80" alt="Farm Fresh Brown Eggs" class="product-img" loading="lazy">
          </div>
          <div class="card-body">
            <div class="meta-row">
              <span class="delivery-tag"><i class="fa-solid fa-stopwatch"></i> 8 MINS</span>
              <span class="item-weight">Pack of 6 Pcs</span>
            </div>
            <h4 class="product-title">Farm Fresh Brown Eggs</h4>
            <div class="rating-row">
              <span class="stars"><i class="fa-solid fa-star"></i> 4.7</span>
              <span class="reviews">(1,840)</span>
            </div>
            <div class="card-footer">
              <div class="price-box">
                <span class="price">₹55</span>
                <span class="mrp">₹65</span>
              </div>
              <button type="button" class="btn-add-cart" data-key="eggs">+ ADD</button>
            </div>
          </div>
        </div>

        <!-- 5. Cold Brew Coffee -->
        <div class="product-card" data-category="drinks">
          <span class="discount-pill">19% OFF</span>
          <div class="image-wrapper">
            <img src="https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400&q=80" alt="Hazelnut Cold Brew Latte" class="product-img" loading="lazy">
          </div>
          <div class="card-body">
            <div class="meta-row">
              <span class="delivery-tag"><i class="fa-solid fa-stopwatch"></i> 6 MINS</span>
              <span class="item-weight">250ml Bottle</span>
            </div>
            <h4 class="product-title">Hazelnut Cold Brew Latte</h4>
            <div class="rating-row">
              <span class="stars"><i class="fa-solid fa-star"></i> 4.8</span>
              <span class="reviews">(670)</span>
            </div>
            <div class="card-footer">
              <div class="price-box">
                <span class="price">₹89</span>
                <span class="mrp">₹110</span>
              </div>
              <button type="button" class="btn-add-cart" data-key="coffee">+ ADD</button>
            </div>
          </div>
        </div>

        <!-- 6. Imported Avocados -->
        <div class="product-card" data-category="fruits-veg">
          <span class="discount-pill">19% OFF</span>
          <div class="image-wrapper">
            <img src="https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=400&q=80" alt="Premium Hass Avocados" class="product-img" loading="lazy">
          </div>
          <div class="card-body">
            <div class="meta-row">
              <span class="delivery-tag"><i class="fa-solid fa-stopwatch"></i> 8 MINS</span>
              <span class="item-weight">2 Pcs (Approx 350g)</span>
            </div>
            <h4 class="product-title">Premium Hass Avocados</h4>
            <div class="rating-row">
              <span class="stars"><i class="fa-solid fa-star"></i> 4.9</span>
              <span class="reviews">(810)</span>
            </div>
            <div class="card-footer">
              <div class="price-box">
                <span class="price">₹129</span>
                <span class="mrp">₹160</span>
              </div>
              <button type="button" class="btn-add-cart" data-key="avocados">+ ADD</button>
            </div>
          </div>
        </div>

        <!-- 7. Potato Crisps -->
        <div class="product-card" data-category="snacks">
          <span class="discount-pill">20% OFF</span>
          <div class="image-wrapper">
            <img src="https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80" alt="Himalayan Salt Potato Crisps" class="product-img" loading="lazy">
          </div>
          <div class="card-body">
            <div class="meta-row">
              <span class="delivery-tag"><i class="fa-solid fa-stopwatch"></i> 7 MINS</span>
              <span class="item-weight">120g Pouch</span>
            </div>
            <h4 class="product-title">Himalayan Salt Potato Crisps</h4>
            <div class="rating-row">
              <span class="stars"><i class="fa-solid fa-star"></i> 4.6</span>
              <span class="reviews">(1,120)</span>
            </div>
            <div class="card-footer">
              <div class="price-box">
                <span class="price">₹40</span>
                <span class="mrp">₹50</span>
              </div>
              <button type="button" class="btn-add-cart" data-key="chips">+ ADD</button>
            </div>
          </div>
        </div>

        <!-- 8. Fresh Strawberries -->
        <div class="product-card" data-category="fruits-veg">
          <span class="discount-pill">23% OFF</span>
          <div class="image-wrapper">
            <img src="https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=400&q=80" alt="Mahabaleshwar Fresh Strawberries" class="product-img" loading="lazy">
          </div>
          <div class="card-body">
            <div class="meta-row">
              <span class="delivery-tag"><i class="fa-solid fa-stopwatch"></i> 9 MINS</span>
              <span class="item-weight">250g Box</span>
            </div>
            <h4 class="product-title">Fresh Mahabaleshwar Strawberries</h4>
            <div class="rating-row">
              <span class="stars"><i class="fa-solid fa-star"></i> 4.9</span>
              <span class="reviews">(950)</span>
            </div>
            <div class="card-footer">
              <div class="price-box">
                <span class="price">₹99</span>
                <span class="mrp">₹130</span>
              </div>
              <button type="button" class="btn-add-cart" data-key="strawberries">+ ADD</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <p class="footer-title"><strong>E Commerce Express</strong> • Quick Commerce Re-imagined</p>
      <p class="footer-sub">Lightning 10-minute doorstep delivery. 100% farm fresh, hygienic, and sanitized packaging.</p>
    </div>
  </footer>

  <script src="app.js" defer></script>
</body>
</html>
```

```css
:root {
  --bg-main: #130022;
  --bg-card: #200536;
  --bg-card-hover: #2b0849;
  --header-bg: rgba(32, 5, 54, 0.94);
  --border: rgba(255, 255, 255, 0.09);
  --border-focus: #ff3269;
  --text-main: #ffffff;
  --text-muted: #b9a8cf;
  --primary: #3c006b;
  --primary-accent: #ff3269;
  --accent-green: #00d06c;
  --font: "Plus Jakarta Sans", system-ui, -apple-system, sans-serif;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body.zepto-theme {
  background-color: var(--bg-main);
  color: var(--text-main);
  font-family: var(--font);
  line-height: 1.5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.delivery-ticker {
  background: linear-gradient(90deg, #3c006b 0%, #ff3269 50%, #3c006b 100%);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-align: center;
  padding: 6px 16px;
}

.ticker-content {
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.ticker-highlight {
  color: #ffe600;
}

.ticker-divider {
  opacity: 0.5;
}

.site-header {
  background: var(--header-bg);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 12px 24px;
}

.nav-container {
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-badge {
  background: var(--primary-accent);
  color: #fff;
  font-size: 16px;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  box-shadow: 0 4px 14px rgba(255, 50, 105, 0.4);
}

.brand h1 {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.delivery-sub {
  font-size: 11px;
  color: var(--text-muted);
}

.delivery-sub strong {
  color: var(--accent-green);
}

.search-box {
  display: flex;
  align-items: center;
  background: #2d0e49;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 6px 14px;
  flex: 1;
  max-width: 520px;
  gap: 10px;
  transition: border-color 0.2s;
}

.search-box:focus-within {
  border-color: var(--primary-accent);
}

.search-icon {
  color: var(--text-muted);
  font-size: 14px;
}

.search-box input {
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  width: 100%;
  font-size: 13.5px;
}

.search-btn {
  background: rgba(255, 50, 105, 0.2);
  color: var(--primary-accent);
  border: 1px solid var(--primary-accent);
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.search-btn:hover {
  background: var(--primary-accent);
  color: #fff;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-btn {
  background: #2d0e49;
  color: #fff;
  border: 1px solid var(--border);
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #3c1560;
  border-color: rgba(255, 255, 255, 0.2);
}

.action-btn.cart-btn {
  background: var(--accent-green);
  color: #0b2e1a;
  border-color: var(--accent-green);
}

.action-btn.cart-btn:hover {
  filter: brightness(1.1);
}

.badge {
  background: #0b2e1a;
  color: #00d06c;
  padding: 2px 7px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 800;
}

.category-strip {
  background: #19002e;
  border-bottom: 1px solid var(--border);
  padding: 10px 24px;
}

.category-scroll {
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scrollbar-width: none;
}

.filter-btn {
  background: #290a44;
  color: var(--text-muted);
  border: 1px solid var(--border);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.filter-btn:hover, .filter-btn.active {
  background: var(--primary-accent);
  color: #fff;
  border-color: var(--primary-accent);
}

.main-content {
  max-width: 1240px;
  margin: 0 auto;
  padding: 28px 24px;
  flex: 1;
  width: 100%;
}

.promo-banner {
  background: linear-gradient(135deg, #3c006b 0%, #20003b 50%, #150028 100%);
  border: 1px solid rgba(255, 50, 105, 0.35);
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 32px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.4);
}

.promo-tag {
  display: inline-block;
  background: rgba(0, 208, 108, 0.2);
  color: var(--accent-green);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
  padding: 5px 12px;
  border-radius: 8px;
  margin-bottom: 12px;
  border: 1px solid rgba(0, 208, 108, 0.3);
}

.promo-banner h2 {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.promo-banner p {
  color: var(--text-muted);
  font-size: 14px;
  max-width: 640px;
  margin-bottom: 16px;
}

.coupon-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 50, 105, 0.15);
  color: #ff94b4;
  border: 1px dashed var(--primary-accent);
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
}

.coupon-badge strong {
  color: #ffffff;
}

.catalog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
  flex-wrap: wrap;
  gap: 12px;
}

.catalog-header h3 {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.section-subtitle {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 2px;
}

.time-badge {
  font-size: 12px;
  color: var(--accent-green);
  font-weight: 800;
  background: rgba(0, 208, 108, 0.12);
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid rgba(0, 208, 108, 0.25);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 22px;
}

.product-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.5);
  border-color: rgba(255, 50, 105, 0.4);
}

.discount-pill {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
  background: var(--primary-accent);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(255, 50, 105, 0.4);
}

.image-wrapper {
  width: 100%;
  height: 190px;
  background: #170327;
  overflow: hidden;
  position: relative;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-img {
  transform: scale(1.05);
}

.card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.delivery-tag {
  font-size: 11px;
  color: var(--accent-green);
  font-weight: 800;
}

.item-weight {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 600;
}

.product-title {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 6px;
  line-height: 1.35;
  color: #fff;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  margin-bottom: 16px;
}

.stars {
  color: #ffb800;
  font-weight: 700;
}

.reviews {
  color: var(--text-muted);
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.price-box {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.price {
  font-size: 19px;
  font-weight: 800;
  color: #fff;
}

.mrp {
  font-size: 12px;
  color: var(--text-muted);
  text-decoration: line-through;
}

.btn-add-cart {
  background: rgba(0, 208, 108, 0.15);
  color: var(--accent-green);
  border: 1.5px solid var(--accent-green);
  padding: 6px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add-cart:hover {
  background: var(--accent-green);
  color: #0b2e1a;
  transform: scale(1.04);
}

.site-footer {
  padding: 36px 24px;
  text-align: center;
  color: var(--text-muted);
  font-size: 12px;
  border-top: 1px solid var(--border);
  margin-top: auto;
  background: #10001d;
}

.footer-title {
  font-size: 14px;
  color: #fff;
  margin-bottom: 6px;
}

.footer-sub {
  color: var(--text-muted);
}
```