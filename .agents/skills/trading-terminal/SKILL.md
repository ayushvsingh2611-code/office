---
name: trading-terminal
description: Institutional Trading Terminal architecture (Bloomberg, TradingView, Binance Pro style), HTML5 sub-pixel canvas candlestick & RSI charts, real-time orderbook ladder, live trades stream, leverage trading execution, and multi-asset telemetry.
license: MIT
---

# Institutional Trading Terminal Architecture Skill (NEXUS-PRO Standard)

## Purpose
Build hyper-realistic, zero-latency, institutional-grade financial trading terminals (Crypto, Stocks, Forex, Commodities) inspired by Bloomberg Terminal, TradingView, and Binance Pro.

## Core Architectural Blueprint

### 1. Visual Aesthetics & Design System
- **Background Obsidian Canvas:** `#07090E`
- **Surface Elevation 1 (Panels & Headers):** `#0D111A`
- **Surface Elevation 2 (Cards & Inputs):** `#131824`
- **Border Tactical (Gridlines):** `#1E2638`
- **Border Highlight (Active/Focused):** `#2C3852`
- **Electric Emerald (Bullish / Long / Profit):** `#00F59B` (Glow: `rgba(0, 245, 155, 0.25)`)
- **Laser Crimson (Bearish / Short / Loss):** `#FF3B69` (Glow: `rgba(255, 59, 105, 0.25)`)
- **Cyber Cyan (Active Accents / Tickers):** `#00E5FF`
- **Solar Gold (Warning / Leverage / Margin Call):** `#FFB800`
- **Typography:** `'JetBrains Mono', 'Fira Code', 'Inter', monospace, sans-serif`

### 2. Multi-Asset Watchlist Dataset (10 Distinct Markets)
Always initialize with at least 10 high-fidelity instruments across 4 asset classes:
1. `BTC-USDT` (Bitcoin, Crypto, ~$64,280)
2. `ETH-USDT` (Ethereum, Crypto, ~$3,450)
3. `SOL-USDT` (Solana, Crypto, ~$142.75)
4. `AAPL` (Apple Inc., Stocks, ~$178.40)
5. `TSLA` (Tesla Inc., Stocks, ~$171.50)
6. `NVDA` (NVIDIA Corp., Stocks, ~$880.20)
7. `EUR-USD` (Euro / US Dollar, Forex, ~1.0835)
8. `GBP-USD` (British Pound, Forex, ~1.2640)
9. `XAU-USD` (Gold Spot, Commodities, ~$2,335.50)
10. `WTI-OIL` (Crude Oil, Commodities, ~$85.20)

### 3. DOM Contract Dictionary (Exact ID Alignment)
- **Watchlist:**
  - Search input: `#watchlist-search-input`
  - Table body: `#watchlist-table-body`
  - Category filters: `.cat-filter-btn` (`#filter-cat-all`, `#filter-cat-crypto`, `#filter-cat-stocks`, `#filter-cat-forex`, `#filter-cat-commodities`)
- **Header Telemetry:**
  - Active symbol badge: `#active-symbol-badge`
  - Active price display: `#active-price-display`
  - 24h change badge: `#active-change-badge`
  - 24h High, Low, Vol, Spread: `#stat-high`, `#stat-low`, `#stat-vol`, `#stat-spread`
  - Top ticker marquee: `#ticker-marquee`
  - Account Equity, Balance, PnL: `#account-equity-val`, `#account-balance-val`, `#account-pnl-val`
- **Chart Area:**
  - Candlestick Canvas: `<canvas id="main-chart-canvas">`
  - RSI Canvas: `<canvas id="rsi-chart-canvas">`
  - Timeframe buttons: `.tf-btn` (`1m`, `5m`, `15m`, `1h`, `4h`, `1D`)
  - Chart type toggle: `#toggle-chart-type`
  - Indicators toggles: `#toggle-indicator-sma`, `#toggle-indicator-ema`, `#toggle-indicator-rsi`
- **Orderbook & Recent Trades:**
  - Tab buttons: `#tab-orderbook`, `#tab-trades`
  - Asks ladder container: `#orderbook-asks-container`
  - Bids ladder container: `#orderbook-bids-container`
  - Spread indicator: `#orderbook-spread-value`
  - Precision selector: `#orderbook-precision-select`
  - Recent trades container: `#recent-trades-container`
- **Order Execution Form:**
  - Side buttons: `#btn-side-buy` (Long / Green), `#btn-side-sell` (Short / Red)
  - Order type tabs: `#tab-order-market`, `#tab-order-limit`, `#tab-order-stop`
  - Amount input: `#input-order-amount`
  - Quick percentage buttons: `#amount-quick-25`, `#amount-quick-50`, `#amount-quick-75`, `#amount-quick-100`
  - Leverage slider: `#slider-leverage` (1x to 100x)
  - Execute button: `#btn-execute-order`
  - Take-Profit / Stop-Loss toggle: `#checkbox-tpsl`
- **Portfolio & Open Orders Drawer:**
  - Positions table body: `#positions-table-body`
  - Open orders table body: `#orders-table-body`
  - Trade history table body: `#history-table-body`
  - Empty positions notification: `#empty-positions-state`
- **Modals & Overlays:**
  - Deposit modal: `#modal-deposit`, `#btn-deposit-modal`, `#btn-close-deposit`, `#btn-confirm-deposit`, `#input-deposit-amount`

### 4. Critical Logic & Anti-Bug Directives
1. **Zero Infinite Loops in Orderbook:**
   - **CORRECT:** `for (let i = 1; i <= 8; i++)` for bids ladder.
   - **CORRECT:** `for (let i = 8; i >= 1; i--)` for asks ladder.
   - **FATAL ERROR TO AVOID:** Never write `for (let i = 1; i <= 8; i--)` (creates infinite loop and crashes browser memory).
2. **Sub-pixel HiDPI Canvas Rendering:**
   ```javascript
   const dpr = window.devicePixelRatio || 1;
   canvas.width = canvas.parentElement.clientWidth * dpr;
   canvas.height = (canvas.parentElement.clientHeight - 40) * dpr;
   ctx.scale(dpr, dpr);
   ```
3. **Dual-Path Synchronization:**
   Both `app.js` and `js/app.js` (and `style.css` and `css/style.css`) must be saved simultaneously so no 404 occurs.
4. **Live Price Simulation & Tick Loop:**
   Use a 2000ms `setInterval` to add realistic micro-fluctuations (±0.05% - 0.2%) to instruments, update open positions PnL, animate the ticker marquee, and redraw the latest candle.
