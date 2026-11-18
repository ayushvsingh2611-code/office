# 🏛️ NEXUS TRADING TERMINAL — SYSTEM & ARCHITECTURE SPECIFICATION
**Author:** Robin (Group 2 - Architect), Straw Hat Crew  
**Target Builder:** Shanks (Group 2 - Builder)  
**Status:** APPROVED & LOCKED FOR BUILD  
**Version:** 2.0.0-PRO  

---

## 1. EXECUTIVE VISION & THEME RECONNAISSANCE

### 1.1 Brand Identity & Design Theme
**Codename:** `NEXUS-PRO` (Institutional Next-Gen Trading Terminal)  
**Aesthetic:** Bloomberg Terminal meets TradingView & Binance Pro. Deep obsidian tactical dark mode with high-contrast neon accents, crisp typography, sub-pixel canvas rendering, micro-animations, and institutional density.

### 1.2 Authentic Brand Palette
- **Obsidian Canvas (Background):** `#07090E`
- **Surface Elevation 1 (Panels & Headers):** `#0D111A`
- **Surface Elevation 2 (Cards & Inputs):** `#131824`
- **Border Tactical (Subtle Gridlines):** `#1E2638`
- **Border Highlight (Active/Focused):** `#2C3852`
- **Electric Emerald (Bullish / Long / Profit):** `#00F59B` (Glow: `rgba(0, 245, 155, 0.25)`)
- **Laser Crimson (Bearish / Short / Loss):** `#FF3B69` (Glow: `rgba(255, 59, 105, 0.25)`)
- **Cyber Cyan (Active Accents / Tickers / Indicators):** `#00E5FF`
- **Solar Gold (Warning / Leverage / Margin Call):** `#FFB800`
- **Text Primary:** `#F0F4FC`
- **Text Secondary:** `#8E9CAE`
- **Text Muted:** `#4E5B70`
- **Font Stack:** `'JetBrains Mono', 'Fira Code', 'Inter', monospace, sans-serif`

---

## 2. HIGH-LEVEL SYSTEM ARCHITECTURE & DATA FLOW

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               NEXUS PRO TERMINAL SHELL                                 │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  Top Navigation Bar (Branding, Live Ticker Tape, Network Status, Demo Equity Quick-Bar) │
├──────────────┬──────────────────────────────────────────┬──────────────────────────────┤
│  WATCHLIST   │  CANVAS CHART ENGINE (TradingView Style) │  ORDER BOOK & RECENT TRADES  │
│  & MARKETS   │  - Candlestick (OHLCV) Rendering         │  - Real-time Asks & Bids     │
│  - Crypto    │  - Volume Histogram                      │  - Depth Visualization Bars  │
│  - Forex     │  - SMA/EMA Overlays & RSI Sub-chart      │  - Spread Tracker            │
│  - Stocks    │  - Timeframe Switchers & Crosshair       │  - 1-Click Order Price Fill  │
├──────────────┴──────────────────────────────────────────┼──────────────────────────────┤
│  ORDER ENTRY SYSTEM (Execution Module)                  │  BOTTOM PORTFOLIO TERMINAL   │
│  - Limit / Market / Stop-Limit Orders                   │  - Open Positions (Live PnL) │
│  - Buy Long / Sell Short toggles                        │  - Active Orders & Cancel    │
│  - Leverage Slider (1x - 100x) & Margin Calculator      │  - Trade History Ledger      │
│  - TP / SL (Take-Profit & Stop-Loss) triggers           │  - Demo Balance Deposit/Reset│
└─────────────────────────────────────────────────────────┴──────────────────────────────┘
                               ▲                                       │
                               │ Event Bus / State Engine             ▼
             ┌─────────────────┴───────────────────┐    ┌───────────────────────────────┐
             │   TICK SIMULATOR / LIVE API SYNC    │    │   LOCALSTORAGE STATE CACHE    │
             │   - Fallback Binance/CoinGecko API  │    │   - Balances, Orders, PnL     │
             │   - Deterministic Brownian Motion   │    │   - Chart Settings & Favs     │
             └─────────────────────────────────────┘    └───────────────────────────────┘
```

---

## 3. DATA PERSISTENCE & ONLINE ENRICHMENT CONTRACT

### 3.1 Pre-Loaded Seed Data (Instant Load & Zero Blank State)
12 institutional-grade instruments pre-configured with realistic starting parameters:

```javascript
const SEED_INSTRUMENTS = [
  {
    symbol: "BTC-USDT",
    name: "Bitcoin",
    category: "crypto",
    price: 64280.50,
    change24h: 2.45,
    high24h: 65120.00,
    low24h: 63100.00,
    volume24h: "1.42B",
    decimals: 2,
    tickSize: 0.1,
    minQty: 0.001,
    sparkline: [63200, 63450, 63100, 63900, 64150, 63800, 64280.5]
  },
  {
    symbol: "ETH-USDT",
    name: "Ethereum",
    category: "crypto",
    price: 3450.75,
    change24h: -1.18,
    high24h: 3520.00,
    low24h: 3390.00,
    volume24h: "892M",
    decimals: 2,
    tickSize: 0.01,
    minQty: 0.01,
    sparkline: [3510, 3490, 3420, 3460, 3430, 3445, 3450.75]
  },
  {
    symbol: "SOL-USDT",
    name: "Solana",
    category: "crypto",
    price: 154.20,
    change24h: 5.82,
    high24h: 158.40,
    low24h: 144.10,
    volume24h: "430M",
    decimals: 2,
    tickSize: 0.01,
    minQty: 0.1,
    sparkline: [145, 148, 146, 150, 152, 149, 154.20]
  },
  {
    symbol: "NVDA-USD",
    name: "NVIDIA Corp.",
    category: "stocks",
    price: 118.80,
    change24h: 3.14,
    high24h: 120.50,
    low24h: 116.20,
    volume24h: "2.1B",
    decimals: 2,
    tickSize: 0.01,
    minQty: 1,
    sparkline: [115, 116, 117.5, 116.8, 118.2, 117.9, 118.8]
  },
  {
    symbol: "TSLA-USD",
    name: "Tesla Inc.",
    category: "stocks",
    price: 248.50,
    change24h: -2.31,
    high24h: 256.00,
    low24h: 246.10,
    volume24h: "1.15B",
    decimals: 2,
    tickSize: 0.01,
    minQty: 1,
    sparkline: [255, 252, 254, 250, 247, 249, 248.5]
  },
  {
    symbol: "AAPL-USD",
    name: "Apple Inc.",
    category: "stocks",
    price: 224.20,
    change24h: 0.74,
    high24h: 226.00,
    low24h: 223.10,
    volume24h: "980M",
    decimals: 2,
    tickSize: 0.01,
    minQty: 1,
    sparkline: [222, 223, 224, 223.5, 225, 223.9, 224.2]
  },
  {
    symbol: "EUR-USD",
    name: "Euro / US Dollar",
    category: "forex",
    price: 1.0875,
    change24h: 0.12,
    high24h: 1.0910,
    low24h: 1.0850,
    volume24h: "4.8B",
    decimals: 4,
    tickSize: 0.0001,
    minQty: 100,
    sparkline: [1.086, 1.087, 1.085, 1.088, 1.0865, 1.0872, 1.0875]
  },
  {
    symbol: "GBP-USD",
    name: "British Pound / USD",
    category: "forex",
    price: 1.2980,
    change24h: -0.28,
    high24h: 1.3025,
    low24h: 1.2950,
    volume24h: "3.2B",
    decimals: 4,
    tickSize: 0.0001,
    minQty: 100,
    sparkline: [1.301, 1.299, 1.297, 1.299, 1.296, 1.2975, 1.2980]
  },
  {
    symbol: "XAU-USD",
    name: "Gold Spot",
    category: "commodities",
    price: 2415.60,
    change24h: 0.95,
    high24h: 2428.00,
    low24h: 2398.00,
    volume24h: "3.6B",
    decimals: 2,
    tickSize: 0.05,
    minQty: 0.1,
    sparkline: [2395, 2405, 2410, 2402, 2418, 2412, 2415.60]
  },
  {
    symbol: "XAG-USD",
    name: "Silver Spot",
    category: "commodities",
    price: 29.40,
    change24h: 1.84,
    high24h: 29.85,
    low24h: 28.75,
    volume24h: "820M",
    decimals: 2,
    tickSize: 0.01,
    minQty: 1,
    sparkline: [28.8, 29.1, 28.9, 29.2, 29.5, 29.25, 29.40]
  },
  {
    symbol: "BNB-USDT",
    name: "BNB Chain",
    category: "crypto",
    price: 578.30,
    change24h: 1.20,
    high24h: 585.00,
    low24h: 569.00,
    volume24h: "310M",
    decimals: 2,
    tickSize: 0.05,
    minQty: 0.05,
    sparkline: [570, 574, 571, 577, 575, 576, 578.30]
  },
  {
    symbol: "AVAX-USDT",
    name: "Avalanche",
    category: "crypto",
    price: 27.65,
    change24h: -3.42,
    high24h: 29.10,
    low24h: 26.90,
    volume24h: "185M",
    decimals: 2,
    tickSize: 0.01,
    minQty: 0.5,
    sparkline: [28.9, 28.4, 28.1, 27.8, 27.3, 27.9, 27.65]
  }
];
```

### 3.2 Live Online Price Enrichment (Non-blocking & Zero-Auth)
- **Primary Endpoint:** Binance Public Ticker (`https://api.binance.com/api/v3/ticker/price?symbols=["BTCUSDT","ETHUSDT","SOLUSDT","BNBUSDT"]`)
- **Secondary Endpoint:** CoinGecko Simple Price (`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true`)
- **Timeout Policy:** `AbortSignal.timeout(4000)` inside `try/catch`.
- **Hybrid Real-Time Engine:** When live network is reachable, update initial prices. Continuously augment with internal High-Frequency Market Simulator (Brownian random walk with volatility parameter and order book micro-ticks every 800ms) to ensure continuous realistic action even offline.

---

## 4. SYSTEM STATE MODEL & LOCAL STORAGE SPECIFICATION

### 4.1 State Tree (`AppState`)
```javascript
const AppState = {
  activeSymbol: "BTC-USDT",
  timeframe: "15m", // "1m" | "5m" | "15m" | "1h" | "4h" | "1D"
  chartType: "candles", // "candles" | "line" | "area"
  chartIndicators: {
    sma: true,
    ema: true,
    volume: true,
    rsi: true
  },
  soundEnabled: true,
  orderSide: "buy", // "buy" | "sell"
  orderType: "market", // "market" | "limit" | "stop_market"
  leverage: 10, // 1 to 100
  account: {
    equity: 50000.00,
    balance: 50000.00,
    marginUsed: 0.00,
    freeMargin: 50000.00,
    unrealizedPnL: 0.00,
    realizedPnL: 0.00,
    marginLevelPercent: 999.00
  },
  positions: [], // Active open positions
  openOrders: [], // Pending limit/stop orders
  tradeHistory: [], // Closed trades ledger
  watchlistCategory: "all", // "all" | "crypto" | "stocks" | "forex" | "commodities"
  searchQuery: ""
};
```

### 4.2 LocalStorage Schema
Key: `nexus_pro_state_v2`
- Persists: `account.balance`, `account.realizedPnL`, `positions`, `openOrders`, `tradeHistory`, `chartIndicators`, `soundEnabled`.
- Initial Seed Fallback: If localStorage is empty, automatically initialize with default $50,000.00 balance and empty orders/positions.
- Quick Reset Action: Button `#btn-reset-account` resets account to $50,000.00 clean state with confirmation toast.

---

## 5. EXACT DOM ELEMENT IDS & INTERFACE CONTRACT

Every single DOM element listed below **MUST exist** with the **exact ID** in `index.html` and be referenced directly in `app.js`.

### 5.1 Top Navigation Bar
- `#header-logo`: Branding logo badge & version.
- `#live-status-pill`: Status dot + text indicator (`CONNECTED / SIMULATING`).
- `#ticker-marquee`: Running banner ticker of top movers.
- `#account-equity-val`: Live equity value ($50,000.00).
- `#account-balance-val`: Available cash balance.
- `#account-pnl-val`: Unrealized PnL with green/red dynamic class.
- `#btn-deposit-modal`: Open "Deposit Demo Funds" modal.
- `#btn-reset-account`: Hard reset demo account with fresh balance.
- `#btn-sound-toggle`: Audio fx toggle (On/Off) with speaker icon.
- `#btn-fullscreen`: Fullscreen window toggle.

### 5.2 Market Watchlist Panel (Left Column)
- `#watchlist-search-input`: Real-time instrument search.
- `#filter-cat-all`: Filter button "All".
- `#filter-cat-crypto`: Filter button "Crypto".
- `#filter-cat-stocks`: Filter button "Stocks".
- `#filter-cat-forex`: Filter button "Forex".
- `#filter-cat-commodities`: Filter button "Commodities".
- `#watchlist-table-body`: Container for instrument list rows.
- `#market-quick-stats`: Selected symbol high/low/volume header strip.

### 5.3 TradingView-Style Chart Area (Center Column)
- `#active-symbol-badge`: Current symbol (e.g., `BTC-USDT Perpetual`).
- `#active-price-display`: Large current live price with flash animation.
- `#active-change-badge`: 24h percentage and dollar change badge.
- `#tf-1m`: Timeframe button 1 Minute.
- `#tf-5m`: Timeframe button 5 Minutes.
- `#tf-15m`: Timeframe button 15 Minutes (Default active).
- `#tf-1h`: Timeframe button 1 Hour.
- `#tf-4h`: Timeframe button 4 Hours.
- `#tf-1D`: Timeframe button 1 Day.
- `#toggle-chart-type`: Switch between Candlestick and Line mode.
- `#toggle-indicator-sma`: Toggle 20-period Simple Moving Average.
- `#toggle-indicator-ema`: Toggle 50-period Exponential Moving Average.
- `#toggle-indicator-rsi`: Toggle Relative Strength Index sub-chart.
- `#main-chart-canvas`: HTML5 Canvas element for Candlesticks & Volume.
- `#rsi-chart-canvas`: Sub-canvas for RSI oscillator.
- `#chart-crosshair-data`: Floating price/date readout on cursor hover.

### 5.4 Order Book & Depth Ladder (Right-Top Column)
- `#orderbook-precision-select`: Dropdown for tick aggregation (`0.1`, `1.0`, `10.0`).
- `#orderbook-asks-container`: Red asks ladder (Price, Size, Total, Depth Bar).
- `#orderbook-spread-value`: Live spread value ($0.50 / 0.001%).
- `#orderbook-bids-container`: Green bids ladder (Price, Size, Total, Depth Bar).
- `#tab-orderbook`: Switch to Order Book tab.
- `#tab-trades`: Switch to Recent Public Trades feed.
- `#recent-trades-container`: Live scrolling list of executed market ticks.

### 5.5 Order Entry Form (Right-Bottom Column)
- `#btn-side-buy`: Button "Buy / Long" (Green accent).
- `#btn-side-sell`: Button "Sell / Short" (Red accent).
- `#tab-order-market`: Order type tab "Market".
- `#tab-order-limit`: Order type tab "Limit".
- `#tab-order-stop`: Order type tab "Stop Market".
- `#input-order-price`: Input for Limit/Trigger price.
- `#input-order-amount`: Input for order quantity/contracts.
- `#amount-quick-25`: Quick button: 25% of available margin.
- `#amount-quick-50`: Quick button: 50% of available margin.
- `#amount-quick-75`: Quick button: 75% of available margin.
- `#amount-quick-100`: Quick button: 100% of available margin.
- `#slider-leverage`: Range slider for leverage (1x to 100x).
- `#display-leverage-val`: Text indicator showing current leverage (e.g. `10x`).
- `#checkbox-tpsl`: Toggle checkbox to reveal TP/SL inputs.
- `#container-tpsl-inputs`: Expandable container for TP/SL.
- `#input-tp-price`: Take-Profit price input.
- `#input-sl-price`: Stop-Loss price input.
- `#order-cost-calc`: Live calculated cost in USD (`Margin Required`).
- `#order-max-calc`: Live calculated max contract size.
- `#btn-execute-order`: Big Call-to-Action button (`Buy BTC-USDT Long` or `Sell BTC-USDT Short`).

### 5.6 Bottom Trading Panel (Positions, Orders & History)
- `#tab-bottom-positions`: Bottom tab "Open Positions" with count badge.
- `#tab-bottom-open-orders`: Bottom tab "Open Orders" with count badge.
- `#tab-bottom-history`: Bottom tab "Trade History".
- `#table-positions-body`: Table rows for active positions.
- `#table-orders-body`: Table rows for active pending limit/stop orders.
- `#table-history-body`: Table rows for historical realized trades.
- `#btn-close-all-positions`: Panic close all active positions at market.
- `#btn-cancel-all-orders`: Cancel all active open limit orders.

### 5.7 Modals, Toasts & Audio Feeds
- `#modal-deposit`: Modal overlay for depositing demo capital.
- `#input-deposit-amount`: Input field for deposit amount ($1,000 to $100,000).
- `#btn-confirm-deposit`: Action button to credit demo funds.
- `#btn-close-deposit`: Close modal button.
- `#toast-container`: Container for dynamic non-intrusive notification toasts (Order Placed, Order Filled, Stop Loss Hit, etc.).

---

## 6. COMPLETE EVENT HANDLER & INTERACTION CONTRACT

| Element Selector | Event | Handler Action |
|---|---|---|
| `#watchlist-search-input` | `input` | Filter instruments table by symbol or full name |
| `.cat-filter-btn` | `click` | Set `AppState.watchlistCategory`, re-render watchlist |
| `.watchlist-row` | `click` | Switch `AppState.activeSymbol`, generate historical chart candles, update order form |
| `#tf-*` buttons | `click` | Switch `AppState.timeframe`, recalculate candle periods, redraw canvas |
| `#toggle-indicator-sma` | `click` | Toggle `AppState.chartIndicators.sma`, redraw chart with SMA-20 curve |
| `#toggle-indicator-ema` | `click` | Toggle `AppState.chartIndicators.ema`, redraw chart with EMA-50 curve |
| `#toggle-indicator-rsi` | `click` | Toggle RSI sub-canvas container visibility, redraw RSI oscillator |
| `#btn-side-buy` / `#btn-side-sell`| `click` | Switch `AppState.orderSide`, update CTA button color & text |
| `#tab-order-*` | `click` | Switch `AppState.orderType`, enable/disable price input accordingly |
| `#slider-leverage` | `input` | Update `AppState.leverage`, recalculate margin required and max contract |
| `#amount-quick-*` | `click` | Calculate order quantity based on available margin * percentage / price |
| `#checkbox-tpsl` | `change`| Show/hide `#container-tpsl-inputs` |
| `#btn-execute-order` | `click` | Validate balance & parameters, create order, trigger sound & toast, update balance |
| `.btn-close-pos` | `click` | Close specific position at current market price, calculate realized PnL, play sound |
| `.btn-cancel-order` | `click` | Cancel pending limit/stop order, release reserved margin |
| `#btn-close-all-positions` | `click` | Liquidate all open positions at current market, show summary toast |
| `#btn-cancel-all-orders` | `click` | Purge all open pending orders |
| `#btn-deposit-modal` | `click` | Open `#modal-deposit` |
| `#btn-confirm-deposit` | `click` | Credit input amount to demo balance, update local storage, close modal |
| `#btn-reset-account` | `click` | Reset balance to $50,000.00, close all positions, clear orders |
| `#btn-sound-toggle` | `click` | Toggle synthesized Web Audio sound effects (fills, alerts) |
| `.orderbook-row` | `click` | Fill clicked price directly into `#input-order-price` (Trader convenience) |

---

## 7. FINANCIAL FORMULAS & CALCULATION ENGINE

The Builder must implement these deterministic mathematical financial formulas:

1. **Required Margin (Position Cost):**
   $$\text{Margin} = \frac{\text{Quantity} \times \text{Entry Price}}{\text{Leverage}}$$

2. **Unrealized PnL (Long):**
   $$\text{PnL}_{\text{Long}} = (\text{Current Price} - \text{Entry Price}) \times \text{Quantity}$$

3. **Unrealized PnL (Short):**
   $$\text{PnL}_{\text{Short}} = (\text{Entry Price} - \text{Current Price}) \times \text{Quantity}$$

4. **Return on Equity (ROE %):**
   $$\text{ROE} = \left(\frac{\text{PnL}}{\text{Margin}}\right) \times 100\%$$

5. **Liquidation Price (Estimated):**
   - For Long: $\text{Liq Price} = \text{Entry Price} \times \left(1 - \frac{1}{\text{Leverage}} + \text{Maintenance Margin Ratio (0.01)}\right)$
   - For Short: $\text{Liq Price} = \text{Entry Price} \times \left(1 + \frac{1}{\text{Leverage}} - \text{Maintenance Margin Ratio (0.01)}\right)$

6. **Account Equity:**
   $$\text{Equity} = \text{Balance} + \sum \text{Unrealized PnL}$$

7. **Free Margin:**
   $$\text{Free Margin} = \text{Equity} - \sum \text{Used Margin}$$

8. **RSI (14 Period):**
   - Relative Strength calculation using standard 14-period exponential smoothing of gains vs. losses.

---

## 8. REAL-TIME TICK SIMULATOR & WEBAUDIO DESIGN

### 8.1 Market Simulation Tick Engine
- Runs on a `setInterval(..., 800)` interval.
- Perturbs the active symbol price using a Gaussian random walk:
  $$\Delta P = P \times \mathcal{N}(0, 1) \times \text{volatility}$$
  (Crypto volatility: $0.0018$, Forex: $0.0003$, Stocks: $0.0009$).
- Automatically inspects `openOrders`:
  - If a **Limit Buy** has `limitPrice >= currentPrice`, execute order immediately at `limitPrice`.
  - If a **Limit Sell** has `limitPrice <= currentPrice`, execute order immediately at `limitPrice`.
  - If a **Stop Loss** is triggered, close position at market price.
  - If a **Take Profit** is triggered, close position at market price.
- If a position drops below its Liquidation Price, trigger an authentic **Liquidation Callout** modal/toast and close position.

### 8.2 Web Audio API Synthesizer (Zero External MP3 Assets)
Utilize the native browser `AudioContext` to generate crisp, zero-latency trading audio feedback:
- **Order Placed / Buy:** Ascending two-tone sine chime (440Hz -> 880Hz, 80ms).
- **Order Filled / Profit Closed:** Harmonic major arpeggio (523Hz -> 659Hz -> 784Hz).
- **Stop Loss / Error:** Soft low frequency saw wave pulse (220Hz -> 180Hz, 120ms).
- Toggleable via `#btn-sound-toggle`.

---

## 9. IMPLEMENTATION CHECKLIST FOR BUILDER (SHANKS)

- [ ] All DOM element IDs from Section 5 match character-for-character.
- [ ] Candlestick chart rendered on custom `<canvas>` with crisp `devicePixelRatio` scaling (no blurry lines).
- [ ] Chart displays candle wicks, candle bodies, volume bars, SMA line (cyan), EMA line (gold), and RSI sub-panel.
- [ ] Live price updates smoothly every 800ms, reflecting across Watchlist, Order Book, Header, Chart, and Open Positions.
- [ ] Margin calculation updates dynamically as the user changes leverage slider or quantity.
- [ ] Order book clicks populate the limit price field instantly.
- [ ] Positions table shows real-time ticking PnL with green/red badges and 1-click Close button.
- [ ] Account equity, margin used, free margin, and realized PnL update on every tick and order close.
- [ ] LocalStorage automatically preserves the user's trades and balance between page reloads.
- [ ] Fallback online API fetch from Binance/CoinGecko enriches live data with 4s timeout.
- [ ] ZERO dead buttons: Every tab, button, quick percentage, and filter has an attached click/change listener.

---
*End of specification. Document locked and signed by Robin.*
