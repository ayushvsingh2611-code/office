```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sport Management</title>
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
<body>
  <header class="site-header">
    <div class="nav-container">
      <div class="brand">
        <div class="brand-badge"><i class="fa-solid fa-shapes"></i></div>
        <h1>Sport Management</h1>
      </div>
      <form id="search-form" class="search-box" role="search">
        <i class="fa-solid fa-magnifying-glass search-icon"></i>
        <input type="search" id="site-search" name="q" placeholder="Search catalog..." autocomplete="off">
        <button type="submit" class="search-btn">Search</button>
      </form>
      <div class="header-actions">
        <button type="button" id="wishlist-button" class="action-btn" title="Saved"><i class="fa-regular fa-heart"></i> Saved</button>
        <button type="button" id="cart-button" class="action-btn cart-btn" title="View Workspace">
          <i class="fa-solid fa-layer-group"></i> Active (<span id="cart-count">1</span>)
        </button>
      </div>
    </div>
  </header>

  <main class="main-content">
    <section class="hero-section">
      <span class="hero-badge"><i class="fa-solid fa-sparkles"></i> PRODUCTION DEPLOYMENT</span>
      <h2 class="hero-title">create sport management website</h2>
      <p class="hero-desc">Interactive, responsive application tailored for high-velocity modern workflows.</p>
    </section>

    <div class="catalog-header">
      <h3>Active Modules & Endpoints</h3>
      <div class="category-filters">
        <button type="button" class="filter-btn active" data-category="all">All Modules</button>
        <button type="button" class="filter-btn" data-category="featured">Core Services</button>
        <button type="button" class="filter-btn" data-category="pro">Pro Utilities</button>
        <button type="button" class="filter-btn" data-category="essential">Essentials</button>
      </div>
    </div>

    <div class="grid" id="product-catalog">
      <div class="product-card" data-category="featured">
        <div class="module-icon"><i class="fa-solid fa-bolt text-blue-400"></i></div>
        <h4 class="product-title">Real-Time Compute Engine</h4>
        <p class="product-desc">Distributed reactive processing unit with sub-millisecond event streaming and zero-lag telemetry.</p>
        <div class="card-footer">
          <span class="price">$249.00</span>
          <button type="button" class="btn-add-cart">Deploy Module</button>
        </div>
      </div>

      <div class="product-card" data-category="pro">
        <div class="module-icon"><i class="fa-solid fa-shield-halved text-emerald-400"></i></div>
        <h4 class="product-title">Zero-Trust Security Gateway</h4>
        <p class="product-desc">Automated edge authorization, payload sanitization, token validation, and anomaly prevention.</p>
        <div class="card-footer">
          <span class="price">$399.00</span>
          <button type="button" class="btn-add-cart">Deploy Module</button>
        </div>
      </div>

      <div class="product-card" data-category="essential">
        <div class="module-icon"><i class="fa-solid fa-database text-amber-400"></i></div>
        <h4 class="product-title">Persistent State Store</h4>
        <p class="product-desc">Synchronous local storage cache with fail-safe snapshots and automated offline recovery.</p>
        <div class="card-footer">
          <span class="price">$79.00</span>
          <button type="button" class="btn-add-cart">Deploy Module</button>
        </div>
      </div>

      <div class="product-card" data-category="featured">
        <div class="module-icon"><i class="fa-solid fa-chart-line text-purple-400"></i></div>
        <h4 class="product-title">Live Telemetry Dashboard</h4>
        <p class="product-desc">Real-time throughput metrics, latency distribution percentiles, and live alerting hooks.</p>
        <div class="card-footer">
          <span class="price">$189.00</span>
          <button type="button" class="btn-add-cart">Deploy Module</button>
        </div>
      </div>
    </div>
  </main>

  <footer class="site-footer">
    <p>© 2026 Sport Management. Production-grade application runtime.</p>
  </footer>
  <script src="app.js" defer></script>
</body>
</html>
```

```css
:root {
  --bg-main: #0b0f19;
  --bg-card: #111827;
  --border: rgba(255, 255, 255, 0.08);
  --text-main: #f9fafb;
  --text-muted: #9ca3af;
  --primary: #3b82f6;
  --primary-hover: #2563eb;
  --font: "Plus Jakarta Sans", system-ui, sans-serif;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: var(--bg-main); color: var(--text-main); font-family: var(--font); min-height: 100vh; display: flex; flex-direction: column; }
.site-header { background: rgba(17, 24, 39, 0.9); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; padding: 14px 24px; }
.nav-container { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.brand { display: flex; align-items: center; gap: 10px; }
.brand-badge { background: var(--primary); color: #fff; width: 34px; height: 34px; display: grid; place-items: center; border-radius: 8px; }
.brand h1 { font-size: 18px; font-weight: 800; }
.search-box { display: flex; align-items: center; background: #1e293b; border: 1px solid var(--border); border-radius: 10px; padding: 6px 14px; flex: 1; max-width: 440px; gap: 10px; }
.search-icon { color: var(--text-muted); font-size: 14px; }
.search-box input { background: transparent; border: none; outline: none; color: #fff; width: 100%; font-size: 13.5px; }
.search-btn { background: var(--primary); color: #fff; border: none; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer; }
.header-actions { display: flex; gap: 10px; }
.action-btn { background: #1e293b; color: #fff; border: 1px solid var(--border); padding: 8px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; }
.main-content { max-width: 1200px; margin: 0 auto; padding: 36px 24px; flex: 1; width: 100%; }
.hero-section { text-align: center; margin-bottom: 30px; }
.hero-badge { display: inline-block; background: rgba(59, 130, 246, 0.15); color: #60a5fa; font-size: 12px; font-weight: 700; padding: 5px 14px; border-radius: 20px; margin-bottom: 12px; }
.hero-title { font-size: 32px; font-weight: 800; margin-bottom: 8px; }
.hero-desc { color: var(--text-muted); font-size: 15px; max-width: 600px; margin: 0 auto; }
.catalog-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.catalog-header h3 { font-size: 20px; font-weight: 700; }
.category-filters { display: flex; gap: 8px; flex-wrap: wrap; }
.filter-btn { background: #1e293b; color: var(--text-muted); border: 1px solid var(--border); padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.filter-btn:hover, .filter-btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
.product-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; padding: 24px; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s; }
.product-card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35); border-color: rgba(255, 255, 255, 0.16); }
.module-icon { font-size: 28px; margin-bottom: 14px; }
.product-title { font-size: 17px; font-weight: 700; margin-bottom: 8px; }
.product-desc { color: var(--text-muted); font-size: 13.5px; margin-bottom: 20px; flex: 1; line-height: 1.45; }
.card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 14px; border-top: 1px solid var(--border); }
.price { font-size: 18px; font-weight: 800; color: #38bdf8; }
.btn-add-cart { background: var(--primary); color: #fff; border: none; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.btn-add-cart:hover { background: var(--primary-hover); }
.site-footer { text-align: center; padding: 28px; border-top: 1px solid var(--border); color: var(--text-muted); font-size: 13px; margin-top: auto; }
```