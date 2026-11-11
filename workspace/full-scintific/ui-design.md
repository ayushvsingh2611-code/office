SUUUUPER! Franky here, your UI Engineer! I've built a high-performance, fully responsive **Scientific Calculator & Constants Lab** interface. It combines a precision scientific keypad layout with an interactive quick-formula library and expression storage panel ("Saved Sheet").

Here is the clean, modular HTML and CSS implementation.

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SUPER-CALC PRO | Advanced Scientific Calculator</title>
  <!-- Google Fonts for crisp display typography -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- App Header Bar -->
  <header class="app-header">
    <div class="header-container">
      <div class="brand">
        <span class="brand-badge">PRO</span>
        <h1 class="brand-title">SUPER-CALC</h1>
      </div>

      <!-- Dynamic Search Input -->
      <div class="search-box">
        <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" class="search-input" id="search-input" placeholder="Search functions, physics constants, formulas...">
      </div>

      <!-- Cart / Saved Memory Trigger Button -->
      <button id="cart-button" class="cart-trigger-btn" aria-label="Open saved formulas sheet">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
        <span class="btn-text">Saved Sheet</span>
        <span id="cart-count" class="cart-badge">4</span>
      </button>
    </div>
  </header>

  <!-- Main Application Workspace -->
  <main class="app-workspace">
    
    <!-- Left Column: Primary Scientific Calculator -->
    <section class="calculator-card">
      <div class="calculator-header">
        <div class="mode-toggles">
          <button class="mode-btn active">DEG</button>
          <button class="mode-btn">RAD</button>
          <button class="mode-btn">GRAD</button>
        </div>
        <div class="status-indicators">
          <span class="indicator active">FIX: 4</span>
          <span class="indicator">M1: ACTIVE</span>
        </div>
      </div>

      <!-- Calculator Screen Display -->
      <div class="calc-display">
        <div class="calc-history-line" id="calc-history">sin(45°) × √(144) + log(100)</div>
        <div class="calc-main-line" id="calc-output">10.48528137</div>
      </div>

      <!-- Keypad Function Mode Tabs / Filters -->
      <div class="keypad-tabs">
        <button class="keypad-tab active">Standard</button>
        <button class="keypad-tab">Trigonometry</button>
        <button class="keypad-tab">Hyperbolic</button>
        <button class="keypad-tab">Statistics</button>
      </div>

      <!-- Scientific Calculator Keypad Grid -->
      <div class="calc-keypad">
        <!-- Row 1: Scientific Functions -->
        <button class="btn btn-func">2nd</button>
        <button class="btn btn-func">x!</button>
        <button class="btn btn-func">1/x</button>
        <button class="btn btn-func">|</button>
        <button class="btn btn-action btn-clear">AC</button>
        <button class="btn btn-action btn-del">DEL</button>

        <!-- Row 2: Powers & Logs -->
        <button class="btn btn-func">sin</button>
        <button class="btn btn-func">cos</button>
        <button class="btn btn-func">tan</button>
        <button class="btn btn-func">x²</button>
        <button class="btn btn-func">xⁿ</button>
        <button class="btn btn-op">÷</button>

        <!-- Row 3: Advanced Math -->
        <button class="btn btn-func">asin</button>
        <button class="btn btn-func">acos</button>
        <button class="btn btn-func">atan</button>
        <button class="btn btn-func">√x</button>
        <button class="btn btn-func">ⁿ√x</button>
        <button class="btn btn-op">×</button>

        <!-- Row 4: Digits & Logarithms -->
        <button class="btn btn-func">ln</button>
        <button class="btn btn-func">log</button>
        <button class="btn btn-num">7</button>
        <button class="btn btn-num">8</button>
        <button class="btn btn-num">9</button>
        <button class="btn btn-op">-</button>

        <!-- Row 5: Constants & Numbers -->
        <button class="btn btn-func">π</button>
        <button class="btn btn-func">e</button>
        <button class="btn btn-num">4</button>
        <button class="btn btn-num">5</button>
        <button class="btn btn-num">6</button>
        <button class="btn btn-op">+</button>

        <!-- Row 6: Memory & Operations -->
        <button class="btn btn-func">STO</button>
        <button class="btn btn-func">RCL</button>
        <button class="btn btn-num">1</button>
        <button class="btn btn-num">2</button>
        <button class="btn btn-num">3</button>
        <button class="btn btn-equals" rowspan="2">=</button>

        <!-- Row 7: Base Numbers & Decimal -->
        <button class="btn btn-func">( )</button>
        <button class="btn btn-func">±</button>
        <button class="btn btn-num btn-zero">0</button>
        <button class="btn btn-num">.</button>
        <button class="btn btn-func">EXP</button>
      </div>
    </section>

    <!-- Right Column: Scientific Constants & Quick Reference Cards -->
    <section class="reference-section">
      <div class="reference-header">
        <h2>Scientific Constants & Formulas</h2>
        <p>Quickly insert preset constants or save calculation presets</p>
      </div>

      <!-- Category Filter Buttons -->
      <div class="category-filters">
        <button class="filter-chip active">All</button>
        <button class="filter-chip">Physics</button>
        <button class="filter-chip">Astrophysics</button>
        <button class="filter-chip">Mathematics</button>
        <button class="filter-chip">Chemistry</button>
      </div>

      <!-- Product / Item Cards Grid -->
      <div class="cards-grid">
        
        <!-- Constant Card 1 -->
        <article class="item-card">
          <div class="card-badge">Physics</div>
          <h3 class="card-title">Speed of Light in Vacuum</h3>
          <p class="card-symbol">c = 2.99792458 × 10⁸ m/s</p>
          <div class="card-footer">
            <span class="card-tag">Exact Constant</span>
            <button class="card-action-btn">
              <span>Insert</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
        </article>

        <!-- Constant Card 2 -->
        <article class="item-card">
          <div class="card-badge">Quantum</div>
          <h3 class="card-title">Planck's Constant</h3>
          <p class="card-symbol">h = 6.62607015 × 10⁻³⁴ J·s</p>
          <div class="card-footer">
            <span class="card-tag">SI Unit</span>
            <button class="card-action-btn">
              <span>Insert</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
        </article>

        <!-- Constant Card 3 -->
        <article class="item-card">
          <div class="card-badge">Math</div>
          <h3 class="card-title">Golden Ratio</h3>
          <p class="card-symbol">φ = 1.6180339887...</p>
          <div class="card-footer">
            <span class="card-tag">(1 + √5) / 2</span>
            <button class="card-action-btn">
              <span>Insert</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
        </article>

        <!-- Constant Card 4 -->
        <article class="item-card">
          <div class="card-badge">Chemistry</div>
          <h3 class="card-title">Avogadro's Constant</h3>
          <p class="card-symbol">Nₐ = 6.02214076 × 10²³ mol⁻¹</p>
          <div class="card-footer">
            <span class="card-tag">Standard</span>
            <button class="card-action-btn">
              <span>Insert</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
        </article>

        <!-- Constant Card 5 -->
        <article class="item-card">
          <div class="card-badge">Astrophysics</div>
          <h3 class="card-title">Gravitational Constant</h3>
          <p class="card-symbol">G = 6.67430 × 10⁻¹¹ m³·kg⁻¹·s⁻²</p>
          <div class="card-footer">
            <span class="card-tag">Newtonian</span>
            <button class="card-action-btn">
              <span>Insert</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
        </article>

        <!-- Constant Card 6 -->
        <article class="item-card">
          <div class="card-badge">Physics</div>
          <h3 class="card-title">Elementary Charge</h3>
          <p class="card-symbol">e = 1.602176634 × 10⁻¹⁹ C</p>
          <div class="card-footer">
            <span class="card-tag">Coulombs</span>
            <button class="card-action-btn">
              <span>Insert</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
        </article>

      </div>
    </section>
  </main>

  <script src="app.js" defer></script>
</body>
</html>
```

```css
/* style.css */

/* --- CSS Variables & Design System --- */
:root {
  --bg-main: #0b0f19;
  --bg-card: #151c2c;
  --bg-card-hover: #1e283d;
  --bg-display: #090d14;
  
  --primary-cyan: #00f2fe;
  --primary-blue: #4facfe;
  --accent-purple: #7f53ac;
  --accent-orange: #ffab00;
  --accent-red: #ff5252;
  --accent-green: #00e676;

  --btn-num-bg: #1c2538;
  --btn-num-hover: #28344d;
  --btn-func-bg: #131a29;
  --btn-func-hover: #1d273c;
  --btn-op-bg: #222e47;
  --btn-op-hover: #2e3e5f;

  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;

  --border-color: rgba(255, 255, 255, 0.08);
  --border-focus: rgba(0, 242, 254, 0.5);

  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 18px;

  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'Fira Code', monospace;

  --shadow-glow: 0 0 20px rgba(0, 242, 254, 0.15);
  --shadow-card: 0 10px 30px rgba(0, 0, 0, 0.35);
}

/* --- Core Reset & Base Styles --- */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--bg-main);
  color: var(--text-primary);
  font-family: var(--font-sans);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  line-height: 1.5;
  overflow-x: hidden;
}

/* --- Header & Navigation Bar --- */
.app-header {
  background-color: rgba(21, 28, 44, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0.8rem 1.5rem;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.brand-badge {
  background: linear-gradient(135deg, var(--primary-cyan), var(--primary-blue));
  color: #000;
  font-weight: 800;
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  letter-spacing: 0.5px;
}

.brand-title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  background: linear-gradient(90deg, #fff, var(--text-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* --- Search Bar Input --- */
.search-box {
  flex: 1;
  max-width: 450px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.6rem 1rem 0.6rem 2.5rem;
  background-color: var(--bg-display);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: var(--primary-cyan);
  box-shadow: 0 0 0 3px rgba(0, 242, 254, 0.15);
}

/* --- Cart Trigger Button & Counter Badge --- */
.cart-trigger-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.6rem 1rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.cart-trigger-btn:hover {
  background-color: var(--bg-card-hover);
  border-color: var(--primary-cyan);
  box-shadow: var(--shadow-glow);
}

.cart-badge {
  background: linear-gradient(135deg, var(--accent-purple), var(--primary-blue));
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

/* --- Main Layout Workspace --- */
.app-workspace {
  max-width: 1400px;
  width: 100%;
  margin: 1.5rem auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: 500px 1fr;
  gap: 1.5rem;
  flex: 1;
}

/* --- Scientific Calculator Main Panel --- */
.calculator-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.calculator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mode-toggles {
  display: flex;
  background: var(--bg-display);
  padding: 3px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
}

.mode-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  padding: 0.25rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-btn.active {
  background-color: var(--btn-num-hover);
  color: var(--primary-cyan);
}

.status-indicators {
  display: flex;
  gap: 0.5rem;
  font-size: 0.7rem;
  font-family: var(--font-mono);
}

.indicator {
  color: var(--text-muted);
}

.indicator.active {
  color: var(--accent-green);
}

/* Screen Display */
.calc-display {
  background-color: var(--bg-display);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 110px;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.5);
}

.calc-history-line {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--text-secondary);
  min-height: 1.25rem;
  overflow-x: auto;
  white-space: nowrap;
}

.calc-main-line {
  font-family: var(--font-mono);
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-cyan);
  letter-spacing: 1px;
  overflow-x: auto;
  white-space: nowrap;
}

/* Keypad Function Tabs */
.keypad-tabs {
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.keypad-tab {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
}

.keypad-tab:hover {
  color: var(--text-primary);
}

.keypad-tab.active {
  background-color: rgba(0, 242, 254, 0.1);
  color: var(--primary-cyan);
}

/* Keypad Grid */
.calc-keypad {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
}

.btn {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.8rem 0.2rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
  user-select: none;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn:active {
  transform: scale(0.96);
}

/* Button Variants */
.btn-num {
  background-color: var(--btn-num-bg);
  color: var(--text-primary);
  font-size: 1rem;
}

.btn-num:hover {
  background-color: var(--btn-num-hover);
  border-color: rgba(255, 255, 255, 0.2);
}

.btn-func {
  background-color: var(--btn-func-bg);
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.btn-func:hover {
  background-color: var(--btn-func-hover);
  color: var(--text-primary);
}

.btn-op {
  background-color: var(--btn-op-bg);
  color: var(--primary-blue);
  font-size: 1.1rem;
}

.btn-op:hover {
  background-color: var(--btn-op-hover);
  color: var(--primary-cyan);
}

.btn-action {
  background-color: rgba(255, 82, 82, 0.15);
  color: var(--accent-red);
}

.btn-action:hover {
  background-color: rgba(255, 82, 82, 0.3);
}

.btn-equals {
  background: linear-gradient(135deg, var(--primary-cyan), var(--primary-blue));
  color: #0b0f19;
  font-weight: 700;
  font-size: 1.2rem;
  grid-column: span 1;
  grid-row: span 2;
}

.btn-equals:hover {
  box-shadow: var(--shadow-glow);
  opacity: 0.95;
}

.btn-zero {
  grid-column: span 1;
}

/* --- Formula Library Section & Product Cards --- */
.reference-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.reference-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
}

.reference-header p {
  font-size: 0.875rem;
  color: var(--text-muted);
}

/* Category Filter Chips */
.category-filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-chip {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-chip:hover {
  border-color: var(--primary-cyan);
  color: var(--text-primary);
}

.filter-chip.active {
  background: linear-gradient(135deg, var(--primary-cyan), var(--primary-blue));
  color: #000;
  border-color: transparent;
}

/* Cards Grid Layout */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
}

.item-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.8rem;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}

.item-card:hover {
  transform: translateY(-3px);
  border-color: rgba(0, 242, 254, 0.4);
  box-shadow: var(--shadow-card);
  background-color: var(--bg-card-hover);
}

.card-badge {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--primary-cyan);
  letter-spacing: 0.5px;
}

.card-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
}

.card-symbol {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--accent-orange);
  background-color: var(--bg-display);
  padding: 0.4rem 0.6rem;
  border-radius: var(--radius-sm);
  border: 1px dashed rgba(255, 171, 0, 0.3);
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.2rem;
}

.card-tag {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.card-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background-color: rgba(0, 242, 254, 0.1);
  color: var(--primary-cyan);
  border: 1px solid rgba(0, 242, 254, 0.3);
  padding: 0.35rem 0.7rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.card-action-btn:hover {
  background-color: var(--primary-cyan);
  color: #000;
  border-color: var(--primary-cyan);
}

/* --- Responsive Breakpoints --- */

/* Laptop / Medium Displays */
@media (max-width: 1024px) {
  .app-workspace {
    grid-template-columns: 1fr;
  }

  .calculator-card {
    max-width: 600px;
    margin: 0 auto;
    width: 100%;
  }
}

/* Tablet & Mobile Displays */
@media (max-width: 640px) {
  .header-container {
    flex-wrap: wrap;
  }

  .search-box {
    order: 3;
    max-width: 100%;
    width: 100%;
  }

  .calc-keypad {
    grid-template-columns: repeat(5, 1fr);
  }

  .btn-equals {
    grid-column: span 1;
    grid-row: span 1;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }
}
```

### Highlights of the Specs:
1. **HTML & CSS Linking**: `<link rel="stylesheet" href="style.css">` is placed inside `<head>`, and `<script src="app.js" defer></script>` is attached right before `</body>`.
2. **Interactive UI Elements**:
   - Dynamic search input box in the top navigation header.
   - Filter category chips for mathematical domains (`All`, `Physics`, `Astrophysics`, `Mathematics`, `Chemistry`).
   - Interactive item cards with "Insert" action buttons for mathematical and scientific constants.
   - Saved Sheet / Memory trigger button with dynamic cart count badge (`id="cart-button"` and `id="cart-count"`).
3. **Keypad Architecture**: Fully responsive 6-column grid with styled operator states, functional triggers, and multi-line precision display.