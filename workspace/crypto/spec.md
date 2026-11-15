# Technical Architecture & Specification Contract: HashPulse Mining OS (NiceHash / Kryptex High-Fidelity Replica)

**Architect**: Nami (Group 1 - System & Data Architect, Straw Hat Crew)  
**Target Builder**: Zoro (Group 1 - Builder)  
**Platform Concept**: High-Fidelity Multi-Crypto Cloud & Rig Mining Studio & Pool Manager (modeled after NiceHash + Kryptex + Binance Mining Pool)  
**Document Version**: 1.0.0 Final Architecture Contract  

---

## 1. Brand Identity & Visual Design System

### 1.1 Authentic Brand Replica
Modeled directly on the world's leading hashpower marketplace and pool management systems (**NiceHash Enterprise & Kryptex Core**). The UI delivers a high-density, cyberpunk-utilitarian fintech terminal for professional crypto miners and cloud hashrate investors.

### 1.2 Color Palette (CSS Variables)
- **Background Deep Void**: `#0a0d14` (`--bg-void`)
- **Card / Surface Dark**: `#111622` (`--bg-surface`)
- **Card / Elevated Surface**: `#182030` (`--bg-elevated`)
- **Border / Divider**: `#232d42` (`--border-color`)
- **Brand Accent 1 (NiceHash Gold/Orange)**: `#f59e0b` (`--accent-orange`)
- **Brand Accent 2 (Mining Pulse Cyan)**: `#06b6d4` (`--accent-cyan`)
- **Profit / Accepted Green**: `#10b981` (`--accent-green`)
- **Warning / Overheat Yellow**: `#eab308` (`--accent-yellow`)
- **Error / Rejected Share Red**: `#ef4444` (`--accent-red`)
- **Text Primary**: `#f8fafc` (`--text-primary`)
- **Text Secondary**: `#94a3b8` (`--text-secondary`)
- **Text Muted**: `#64748b` (`--text-muted`)
- **Font Stack**: Inter, system-ui, -apple-system, sans-serif; Monospace for Stratum logs & hashrate readouts: `JetBrains Mono`, `Courier New`, monospace.

---

## 2. Page Hierarchy & Layout Layout Structure

```
+----------------------------------------------------------------------------------------------------+
| HEADER: Logo (#brand-logo), Market Ticker (#market-ticker-bar), Wallet Balances (#header-wallet-btn)|
| Live Stratum Status Pill (#stratum-pill), Active Workers Counter (#header-workers-count), Theme/Audio|
+----------------------------------------------------------------------------------------------------+
| NAVIGATION TABS BAR:                                                                               |
| [#tab-dashboard] [#tab-rigs] [#tab-algorithms] [#tab-marketplace] [#tab-calculator] [#tab-payouts]    |
+----------------------------------------------------------------------------------------------------+
| MAIN VIEW CONTAINER (#main-content-area):                                                          |
|                                                                                                    |
| [ TAB 1: DASHBOARD & OVERVIEW ]                                                                    |
|  - Stat Cards: Total Hashrate, 24h Est. Profit ($/day & BTC), Efficiency (W/MH), Accepted/Rejected|
|  - Real-time Hashrate Live Canvas Chart (#hashrate-canvas) with time filters [1h, 6h, 24h, 7d]     |
|  - Quick Rig Summary Table & Auto-Profit Switcher Master Toggle (#auto-profit-toggle)              |
|  - Mini Stratum Terminal Feed (#mini-terminal-feed)                                               |
|                                                                                                    |
| [ TAB 2: RIG MANAGER (WORKERS HUB) ]                                                               |
|  - Filter Bar: Search (#rig-search-input), Filter status (#rig-status-filter), Sort (#rig-sort-by) |
|  - Action Buttons: Start All (#btn-start-all-rigs), Stop All (#btn-stop-all-rigs), Add Rig (#btn-add)|
|  - Worker Cards Grid (#rig-cards-grid): Per rig Temp, Fan %, Hashrate, Algo, Power, OC Profile    |
|                                                                                                    |
| [ TAB 3: MULTI-CRYPTO POOL (ALGORITHMS) ]                                                          |
|  - 8 Mineable Cryptos Grid (#coins-grid): BTC, ETC, RVN, KAS, XMR, DOGE, ALPH, ZEC                |
|  - Live Switcher: One-click "Mine This Coin" with Stratum auto-reconnect                           |
|  - Algorithm Specs: Algorithm Name, Difficulty, Network Hash, 24h Profitability, Block Reward      |
|                                                                                                    |
| [ TAB 4: CLOUD HASHRATE CONTRACT MARKETPLACE ]                                                     |
|  - Pre-packaged mining cloud power: Instant rental without hardware                               |
|  - Cloud Contract Grid (#marketplace-grid) with Duration, Hashrate, Daily Return, Price           |
|  - "Rent Hashpower" Modal (#contract-modal) with instant balance deduction & active contract tracker|
|                                                                                                    |
| [ TAB 5: MINING PROFITABILITY CALCULATOR ]                                                         |
|  - Hardware Preset Dropdown (#calc-hardware-select) (RTX 4090, Antminer S21, RX 7900 XTX, etc.)   |
|  - Custom Hashrate & Power Wattage sliders (#calc-hash-slider, #calc-power-slider)                 |
|  - Electricity Cost input ($/kWh) (#calc-power-cost-input)                                         |
|  - Net Profit Output Cards (#calc-result-usd, #calc-result-crypto, #calc-roi-days)                |
|                                                                                                    |
| [ TAB 6: PAYOUTS & WALLET MANAGER ]                                                               |
|  - Multi-Currency Balance Cards (BTC, ETC, RVN, KAS, XMR, DOGE, ALPH, ZEC, USDT)                  |
|  - Withdraw Drawer/Modal (#withdraw-modal) with Address, Amount, Fee Calculator & Send Button     |
|  - Transaction & Payout History Table (#payout-history-table) with Explorer links & status tags   |
|                                                                                                    |
| PERSISTENT BOTTOM DOCK / CONSOLE:                                                                  |
|  - Live Real-Time Stratum Protocol Console Log (#stratum-console) [Expand/Collapse, Clear, Pause]  |
+----------------------------------------------------------------------------------------------------+
| MODALS & DRAWERS (Overlay Container #modal-container):                                             |
|  1. Add Worker Rig Modal (#modal-add-rig)                                                          |
|  2. Cloud Contract Rent Modal (#modal-rent-contract)                                               |
|  3. Payout / Withdrawal Modal (#modal-withdraw)                                                    |
|  4. Rig Tune / Overclock Modal (#modal-tune-rig)                                                    |
|  5. Toast Notification System (#toast-container)                                                   |
+----------------------------------------------------------------------------------------------------+
```

---

## 3. Mandatory Pre-Loaded Demo Data

### 3.1 Supported Mineable Cryptocurrencies & Algorithms (8 Distinct Coins)
```javascript
const MOCK_COINS = [
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    algorithm: "SHA-256",
    priceUsd: 64850.25,
    change24h: 3.42,
    icon: "₿",
    color: "#f59e0b",
    difficulty: "84.23 T",
    networkHashrate: "612.4 EH/s",
    blockReward: "3.125 BTC",
    profitPerDayPerUnit: 0.082, // USD per TH/s
    hashrateUnit: "TH/s",
    currentMining: true,
    poolAddress: "stratum+tcp://btc.hashpulse-pool.com:3333"
  },
  {
    id: "etc",
    name: "Ethereum Classic",
    symbol: "ETC",
    algorithm: "Etchash",
    priceUsd: 28.45,
    change24h: -1.15,
    icon: "Ξ",
    color: "#10b981",
    difficulty: "2.41 P",
    networkHashrate: "185.2 TH/s",
    blockReward: "2.56 ETC",
    profitPerDayPerUnit: 0.045, // USD per MH/s
    hashrateUnit: "MH/s",
    currentMining: false,
    poolAddress: "stratum+tcp://etc.hashpulse-pool.com:4444"
  },
  {
    id: "rvn",
    name: "Ravencoin",
    symbol: "RVN",
    algorithm: "KawPow",
    priceUsd: 0.0278,
    change24h: 5.80,
    icon: "🦅",
    color: "#f97316",
    difficulty: "142.8 K",
    networkHashrate: "8.42 TH/s",
    blockReward: "2500 RVN",
    profitPerDayPerUnit: 0.052, // USD per MH/s
    hashrateUnit: "MH/s",
    currentMining: false,
    poolAddress: "stratum+tcp://rvn.hashpulse-pool.com:5555"
  },
  {
    id: "kas",
    name: "Kaspa",
    symbol: "KAS",
    algorithm: "kHeavyHash",
    priceUsd: 0.168,
    change24h: 8.24,
    icon: "⚡",
    color: "#06b6d4",
    difficulty: "48.2 P",
    networkHashrate: "320.1 PH/s",
    blockReward: "105 KAS",
    profitPerDayPerUnit: 0.091, // USD per GH/s
    hashrateUnit: "GH/s",
    currentMining: false,
    poolAddress: "stratum+tcp://kas.hashpulse-pool.com:6666"
  },
  {
    id: "xmr",
    name: "Monero",
    symbol: "XMR",
    algorithm: "RandomX (CPU)",
    priceUsd: 145.60,
    change24h: 0.75,
    icon: "ɱ",
    color: "#ea580c",
    difficulty: "365.1 G",
    networkHashrate: "2.98 GH/s",
    blockReward: "0.6 XMR",
    profitPerDayPerUnit: 0.038, // USD per KH/s
    hashrateUnit: "KH/s",
    currentMining: false,
    poolAddress: "stratum+tcp://xmr.hashpulse-pool.com:7777"
  },
  {
    id: "doge",
    name: "Dogecoin / Litecoin",
    symbol: "DOGE+LTC",
    algorithm: "Scrypt (Merged)",
    priceUsd: 0.142,
    change24h: 4.10,
    icon: "Ð",
    color: "#eab308",
    difficulty: "28.5 M",
    networkHashrate: "1.12 PH/s",
    blockReward: "10,000 DOGE + 6.25 LTC",
    profitPerDayPerUnit: 0.064, // USD per MH/s
    hashrateUnit: "MH/s",
    currentMining: false,
    poolAddress: "stratum+tcp://scrypt.hashpulse-pool.com:8888"
  },
  {
    id: "alph",
    name: "Alephium",
    symbol: "ALPH",
    algorithm: "Blake3",
    priceUsd: 2.15,
    change24h: 12.45,
    icon: "ℵ",
    color: "#a855f7",
    difficulty: "1.89 P",
    networkHashrate: "4.15 PH/s",
    blockReward: "3.2 ALPH",
    profitPerDayPerUnit: 0.078, // USD per GH/s
    hashrateUnit: "GH/s",
    currentMining: false,
    poolAddress: "stratum+tcp://alph.hashpulse-pool.com:9999"
  },
  {
    id: "zec",
    name: "Zcash",
    symbol: "ZEC",
    algorithm: "Equihash",
    priceUsd: 31.80,
    change24h: -0.45,
    icon: "ⓩ",
    color: "#ec4899",
    difficulty: "98.4 M",
    networkHashrate: "9.21 GS/s",
    blockReward: "3.125 ZEC",
    profitPerDayPerUnit: 0.041, // USD per kSol/s
    hashrateUnit: "kSol/s",
    currentMining: false,
    poolAddress: "stratum+tcp://zec.hashpulse-pool.com:3344"
  }
];
```

### 3.2 Pre-Loaded Active Mining Rigs (Workers) (6 Realistic Rigs)
```javascript
const MOCK_RIGS = [
  {
    id: "rig-01",
    name: "CyberRig Titan X6",
    deviceType: "GPU (6x RTX 4090 24GB)",
    status: "MINING", // MINING, IDLE, OVERHEATING, OFFLINE
    activeCoinId: "btc",
    targetAlgo: "SHA-256",
    hashrateNum: 142.5,
    hashrateUnit: "TH/s",
    powerWatts: 1850,
    tempC: 62,
    fanPercent: 74,
    efficiency: "0.077 W/GH",
    acceptedShares: 4280,
    rejectedShares: 8,
    uptimeSeconds: 846200,
    overclockProfile: "Efficiency Pro (-100 Core, +1200 Mem, 75% Power)"
  },
  {
    id: "rig-02",
    name: "Antminer S21 Hydro",
    deviceType: "ASIC Dedicated Unit",
    status: "MINING",
    activeCoinId: "btc",
    targetAlgo: "SHA-256",
    hashrateNum: 200.0,
    hashrateUnit: "TH/s",
    powerWatts: 3500,
    tempC: 58,
    fanPercent: 65,
    efficiency: "0.0175 W/GH",
    acceptedShares: 6812,
    rejectedShares: 14,
    uptimeSeconds: 1209600,
    overclockProfile: "Factory Hydro Turbo"
  },
  {
    id: "rig-03",
    name: "RavenNest 8x Octa-Rig",
    deviceType: "GPU (8x RTX 3080 10GB)",
    status: "MINING",
    activeCoinId: "rvn",
    targetAlgo: "KawPow",
    hashrateNum: 384.0,
    hashrateUnit: "MH/s",
    powerWatts: 1920,
    tempC: 68,
    fanPercent: 82,
    efficiency: "5.00 W/MH",
    acceptedShares: 1205,
    rejectedShares: 3,
    uptimeSeconds: 432000,
    overclockProfile: "KawPow HighMem Tune (+1100 Mem)"
  },
  {
    id: "rig-04",
    name: "Kaspa Blade Runner 4X",
    deviceType: "FPGA / ASIC Miner",
    status: "MINING",
    activeCoinId: "kas",
    targetAlgo: "kHeavyHash",
    hashrateNum: 4800.0,
    hashrateUnit: "GH/s",
    powerWatts: 1600,
    tempC: 64,
    fanPercent: 70,
    efficiency: "0.33 W/GH",
    acceptedShares: 9410,
    rejectedShares: 12,
    uptimeSeconds: 615000,
    overclockProfile: "Ultra Low Latency KAS"
  },
  {
    id: "rig-05",
    name: "Ryzen Threadripper 5995WX",
    deviceType: "CPU Mining Node (64 Cores)",
    status: "MINING",
    activeCoinId: "xmr",
    targetAlgo: "RandomX (CPU)",
    hashrateNum: 48.5,
    hashrateUnit: "KH/s",
    powerWatts: 280,
    tempC: 71,
    fanPercent: 88,
    efficiency: "5.77 W/kH",
    acceptedShares: 580,
    rejectedShares: 1,
    uptimeSeconds: 250000,
    overclockProfile: "All-Core 4.1GHz 1.05V"
  },
  {
    id: "rig-06",
    name: "Standby Mobile Rig (RTX 4070 Laptop)",
    deviceType: "GPU (1x RTX 4070 Mobile)",
    status: "IDLE",
    activeCoinId: "etc",
    targetAlgo: "Etchash",
    hashrateNum: 0.0,
    hashrateUnit: "MH/s",
    powerWatts: 25,
    tempC: 41,
    fanPercent: 30,
    efficiency: "N/A",
    acceptedShares: 210,
    rejectedShares: 0,
    uptimeSeconds: 15400,
    overclockProfile: "Quiet Office Profile"
  }
];
```

### 3.3 Cloud Hashrate Marketplace Contracts (6 Pre-Packaged Contracts)
```javascript
const MOCK_CONTRACTS = [
  {
    id: "contract-01",
    coinId: "btc",
    title: "Bitcoin MegaVault TH Contract",
    algorithm: "SHA-256",
    hashrate: "250 TH/s",
    durationDays: 30,
    priceUsd: 499.00,
    estDailyEarningsUsd: 20.50,
    estTotalReturnPercent: 123.2,
    availableSlots: 14,
    badge: "Bestseller"
  },
  {
    id: "contract-02",
    coinId: "kas",
    title: "Kaspa High-Speed Pulse Contract",
    algorithm: "kHeavyHash",
    hashrate: "5,000 GH/s",
    durationDays: 14,
    priceUsd: 320.00,
    estDailyEarningsUsd: 28.40,
    estTotalReturnPercent: 124.2,
    availableSlots: 8,
    badge: "Highest ROI"
  },
  {
    id: "contract-03",
    coinId: "rvn",
    title: "Raven Claw ASIC-Resistant Power",
    algorithm: "KawPow",
    hashrate: "800 MH/s",
    durationDays: 21,
    priceUsd: 210.00,
    estDailyEarningsUsd: 12.80,
    estTotalReturnPercent: 115.2,
    availableSlots: 22,
    badge: "Popular"
  },
  {
    id: "contract-04",
    coinId: "etc",
    title: "Ethereum Classic Steady Yield",
    algorithm: "Etchash",
    hashrate: "1,200 MH/s",
    durationDays: 60,
    priceUsd: 650.00,
    estDailyEarningsUsd: 14.10,
    estTotalReturnPercent: 130.1,
    availableSlots: 5,
    badge: "Long Term"
  },
  {
    id: "contract-05",
    coinId: "doge",
    title: "Doge + Litecoin Scrypt Dual-Mining",
    algorithm: "Scrypt",
    hashrate: "4,500 MH/s",
    durationDays: 30,
    priceUsd: 540.00,
    estDailyEarningsUsd: 22.10,
    estTotalReturnPercent: 122.7,
    availableSlots: 11,
    badge: "Dual Merge"
  },
  {
    id: "contract-06",
    coinId: "xmr",
    title: "Monero Stealth CPU Cluster",
    algorithm: "RandomX",
    hashrate: "120 KH/s",
    durationDays: 14,
    priceUsd: 149.00,
    estDailyEarningsUsd: 13.20,
    estTotalReturnPercent: 111.4,
    availableSlots: 19,
    badge: "Privacy"
  }
];
```

### 3.4 Payout & Wallet Data
```javascript
const MOCK_WALLET = {
  totalUsdValue: 4892.45,
  unpaidBalanceUsd: 148.20,
  fiatCurrency: "USD",
  balances: {
    btc: { amount: 0.05421000, usd: 3515.52, address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" },
    etc: { amount: 14.2800, usd: 406.26, address: "0x71C...4982a" },
    rvn: { amount: 8420.50, usd: 234.09, address: "RDog4N8...kXz8" },
    kas: { amount: 2450.00, usd: 411.60, address: "kaspa:qpm2qsz...9v2a" },
    xmr: { amount: 1.1250, usd: 163.80, address: "888tNk...9w1P" },
    doge: { amount: 1140.00, usd: 161.88, address: "D8e1Xy...7z9Q" },
    alph: { amount: 0.00, usd: 0.00, address: "194XkL...5m1a" },
    zec: { amount: 0.00, usd: 0.00, address: "t1Zc4...982p" }
  },
  history: [
    {
      id: "tx-9921",
      date: "2025-05-14 18:42",
      coin: "BTC",
      amount: "0.01250000 BTC",
      usdValue: "$810.62",
      toAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      txHash: "7a8b3f41cde90123...8842",
      status: "COMPLETED"
    },
    {
      id: "tx-9920",
      date: "2025-05-13 12:15",
      coin: "KAS",
      amount: "1,200.00 KAS",
      usdValue: "$201.60",
      toAddress: "kaspa:qpm2qszn...9v2a",
      txHash: "44b829af0129cd...3910",
      status: "COMPLETED"
    },
    {
      id: "tx-9919",
      date: "2025-05-12 04:30",
      coin: "RVN",
      amount: "4,500.00 RVN",
      usdValue: "$125.10",
      toAddress: "RDog4N8...kXz8",
      txHash: "119ca82fe...2231",
      status: "COMPLETED"
    },
    {
      id: "tx-9918",
      date: "2025-05-11 20:00",
      coin: "BTC",
      amount: "0.01000000 BTC",
      usdValue: "$648.50",
      toAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      txHash: "5f8a0021bb...9942",
      status: "COMPLETED"
    }
  ]
};
```

---

## 4. Shared DOM Element IDs Contract

Every DOM element below is binding between HTML and JS. Zoro **MUST** use these exact IDs.

### 4.1 Header & Status Elements
- `#header-total-usd`: Total portfolio USD balance in top right.
- `#header-unpaid-usd`: Total pending/unpaid mining balance.
- `#header-workers-count`: Badge showing "5 Active / 6 Total".
- `#stratum-status-pill`: Status indicator (Online / 24ms Stratum latency).
- `#btn-open-wallet`: Header button to open Wallet & Payout modal.
- `#btn-toggle-audio`: Toggle Stratum share chime / click sound.
- `#btn-quick-payout`: Direct 1-click header payout trigger.
- `#market-ticker-track`: Horizontally scrolling live coin price ticker.

### 4.2 Navigation Tabs
- `#tab-btn-dashboard`: Switch to Dashboard.
- `#tab-btn-rigs`: Switch to Rig Manager.
- `#tab-btn-algorithms`: Switch to Multi-Crypto Algorithms & Pools.
- `#tab-btn-marketplace`: Switch to Cloud Mining Contracts.
- `#tab-btn-calculator`: Switch to Profitability Calculator.
- `#tab-btn-payouts`: Switch to Payouts & Wallets.
- `#view-dashboard`, `#view-rigs`, `#view-algorithms`, `#view-marketplace`, `#view-calculator`, `#view-payouts`: Respective container sections.

### 4.3 Tab 1: Dashboard Elements
- `#stat-total-hashrate`: Aggregated hashrate display.
- `#stat-daily-est-usd`: Projected daily earnings in USD.
- `#stat-daily-est-btc`: Projected daily earnings in BTC.
- `#stat-power-consumption`: Aggregated power in Watts.
- `#stat-accepted-shares`: Total accepted shares across all rigs.
- `#stat-rejected-shares`: Total rejected shares with error percentage.
- `#auto-profit-toggle`: Master switch for automatic profit-switching algorithm.
- `#hashrate-chart-canvas`: HTML5 Canvas rendering dynamic hashrate lines.
- `#chart-timeframe-1h`, `#chart-timeframe-6h`, `#chart-timeframe-24h`, `#chart-timeframe-7d`: Timeframe selector buttons.
- `#mini-stratum-log-list`: Compact 5-item live rolling Stratum feed.

### 4.4 Tab 2: Rig Manager Elements
- `#rig-search-input`: Real-time text search filter for rigs.
- `#rig-status-filter`: Dropdown (`all`, `mining`, `idle`, `overheat`).
- `#rig-sort-select`: Sort dropdown (`name`, `hashrate`, `temp`, `power`).
- `#btn-start-all-rigs`: Start all mining workers.
- `#btn-stop-all-rigs`: Stop all mining workers.
- `#btn-open-add-rig`: Trigger modal to register a new mining rig.
- `#rig-cards-container`: Grid where rig cards are rendered.

### 4.5 Tab 3: Multi-Crypto Algorithms Elements
- `#coins-filter-search`: Search input for cryptocurrencies.
- `#coins-grid-container`: Grid of the 8 mineable cryptos with live stats.
- `#current-mined-coin-name`: Banner showing which coin is currently active in pool.
- `#btn-pool-copy-stratum`: Copy Stratum server URL to clipboard.

### 4.6 Tab 4: Cloud Hashrate Marketplace Elements
- `#marketplace-grid`: Grid of 6 cloud hashrate contract cards.
- `#active-contracts-container`: List of currently rented active cloud contracts.
- `#btn-filter-contract-all`, `#btn-filter-contract-btc`, `#btn-filter-contract-alt`: Filter buttons.

### 4.7 Tab 5: Profitability Calculator Elements
- `#calc-device-preset`: Select hardware (`rtx4090`, `s21`, `rx7900xtx`, `threadripper`, `custom`).
- `#calc-algo-select`: Select algorithm (`sha256`, `etchash`, `kawpow`, `kheavyhash`, `randomx`, `scrypt`).
- `#calc-hashrate-input`: Number input for hashrate.
- `#calc-power-input`: Number input for wattage.
- `#calc-electricity-cost`: Number input for $/kWh (default `0.08`).
- `#calc-profit-daily-usd`: Formatted daily net profit.
- `#calc-profit-monthly-usd`: Formatted monthly net profit.
- `#calc-power-cost-daily`: Formatted daily electricity cost.
- `#calc-crypto-daily-est`: Formatted coin units earned per day.

### 4.8 Tab 6: Payouts & Wallets Elements
- `#wallet-balances-grid`: Cards showing individual coin balances.
- `#btn-open-withdraw-modal`: Button to trigger withdrawal dialog.
- `#payout-history-tbody`: Table body of past transactions.
- `#payout-search-input`: Filter transaction history.

### 4.9 Modals & Overlays
- `#modal-backdrop`: Overlay background for dismissals.
- `#modal-add-rig`: Modal with `#add-rig-name`, `#add-rig-type`, `#add-rig-algo`, `#btn-confirm-add-rig`, `#btn-close-add-rig`.
- `#modal-withdraw`: Modal with `#withdraw-coin-select`, `#withdraw-address-input`, `#withdraw-amount-input`, `#withdraw-fee-display`, `#withdraw-receive-display`, `#btn-confirm-withdraw`, `#btn-close-withdraw`.
- `#modal-rent-contract`: Modal with `#rent-contract-title`, `#rent-contract-price`, `#btn-confirm-rent`, `#btn-close-rent`.
- `#modal-tune-rig`: Modal to tune overclock & fan profile with `#tune-fan-slider`, `#tune-power-slider`, `#tune-core-input`, `#btn-save-tune`, `#btn-close-tune`.
- `#toast-container`: Floating container for non-blocking feedback toasts.

### 4.10 Persistent Stratum Terminal Console (Bottom Bar)
- `#terminal-toggle-btn`: Expand / minimize terminal drawer.
- `#terminal-clear-btn`: Clear console log.
- `#terminal-pause-btn`: Pause / resume live log generation.
- `#terminal-log-output`: Pre/Code area displaying colored Stratum events.

---

## 5. State Machine & Reactive Data Architecture

```javascript
const MiningApp = {
  state: {
    activeTab: "dashboard", // "dashboard" | "rigs" | "algorithms" | "marketplace" | "calculator" | "payouts"
    autoProfitSwitch: true,
    audioEnabled: false,
    selectedCoinId: "btc",
    chartTimeframe: "24h",
    terminalPaused: false,
    terminalLines: [],
    
    // Core data stores
    coins: [...MOCK_COINS],
    rigs: [...MOCK_RIGS],
    contracts: [...MOCK_CONTRACTS],
    activeContracts: [],
    wallet: { ...MOCK_WALLET },
    
    // Filters & Search
    rigFilter: { search: "", status: "all", sortBy: "hashrate" },
    payoutFilter: { search: "" },
    
    // Calculator State
    calc: {
      preset: "rtx4090",
      algo: "sha256",
      hashrate: 142.5,
      power: 1850,
      costKwh: 0.08
    },
    
    // Live Simulation Tick
    timerId: null,
    chartData: {
      labels: [],
      hashratePoints: []
    }
  }
};
```

---

## 6. Functional Event Handler Contract (Zero Dead Buttons)

Every function signature below must be implemented with concrete logic:

### 6.1 Tab Navigation & Layout Handlers
```javascript
function switchTab(tabId)
// Hides all tab views (.view-section), activates targeted view (#view-[tabId])
// Updates active class on corresponding nav button (#tab-btn-[tabId])
// Triggers responsive chart resize if tab is 'dashboard'
```

### 6.2 Rig Manager Handlers
```javascript
function handleStartRig(rigId)
// Updates rig status to "MINING", increments overall hashrate, generates Stratum event, shows toast.

function handleStopRig(rigId)
// Updates rig status to "IDLE", sets hashrate to 0, updates power, generates Stratum event, shows toast.

function handleStartAllRigs()
// Iterates all rigs, sets status to "MINING", triggers re-render, shows success toast.

function handleStopAllRigs()
// Iterates all rigs, sets status to "IDLE", sets hashrates to 0, shows warning toast.

function handleOpenAddRigModal()
// Opens #modal-add-rig, resets input fields to defaults.

function handleSaveNewRig(event)
// Reads form data (#add-rig-name, #add-rig-type, #add-rig-algo), creates new rig object,
// pushes to state.rigs, renders cards, closes modal, shows toast.

function handleOpenTuneModal(rigId)
// Populates #modal-tune-rig with rig's current fan, power limit, and clock offsets, opens modal.

function handleSaveTuneProfile(rigId)
// Updates target rig overclock params, adjusts efficiency and temperature dynamically, closes modal.

function handleFilterRigs()
// Filters state.rigs by #rig-search-input, #rig-status-filter, and #rig-sort-select, then re-renders #rig-cards-container.
```

### 6.3 Multi-Crypto Algorithm Switcher Handlers
```javascript
function handleSwitchMiningCoin(targetCoinId)
// Disconnects rigs from old stratum, shifts active coin to targetCoinId.
// Logs "[STRATUM] Switching algorithm to [Algo] for coin [SYMBOL]..."
// Updates currentMining flags in state.coins and state.rigs.
// Emits toast "Active Pool Switched to [Coin Name]".
// Plays switch chime if audio is enabled.

function handleToggleAutoProfitSwitch()
// Toggles state.autoProfitSwitch boolean.
// When enabled, automatically selects highest profitability coin every 30 seconds and logs switch.
```

### 6.4 Cloud Marketplace Handlers
```javascript
function handleOpenRentModal(contractId)
// Finds contract by ID, displays price, estimated yield, opens #modal-rent-contract.

function handleConfirmRentContract(contractId)
// Validates wallet balance; if balance is sufficient, deducts cost; if not, performs instant demo top-up or creates contract.
// Appends to state.activeContracts with start timestamp, duration, and generated hashrate.
// Generates Stratum notification and success toast.
```

### 6.5 Profitability Calculator Handlers
```javascript
function handleHardwarePresetChange(presetKey)
// Loads pre-calibrated presets (e.g. RTX 4090, Antminer S21, RX 7900 XTX, Threadripper 5995WX).
// Sets hashrate input, power input, and algorithm selector automatically.
// Calls calculateProfitability().

function calculateProfitability()
// Reads hashrate, power watts, electricity cost $/kWh, and current coin price & difficulty.
// Calculates:
//   dailyKwh = (power * 24) / 1000
//   dailyPowerCost = dailyKwh * costKwh
//   grossDailyUsd = hashrate * coinProfitPerUnit
//   netDailyUsd = grossDailyUsd - dailyPowerCost
//   monthlyUsd = netDailyUsd * 30.4
// Updates DOM outputs (#calc-profit-daily-usd, #calc-profit-monthly-usd, #calc-power-cost-daily, etc.) with color coding (green if positive, red if negative).
```

### 6.6 Payout & Wallet Handlers
```javascript
function handleOpenWithdrawModal(defaultCoinId)
// Opens #modal-withdraw, sets coin selector to defaultCoinId, calculates network fee, updates receive preview.

function handleConfirmWithdraw(event)
// Validates destination address and minimum amount (> 0.001).
// Deducts from coin balance in state.wallet.balances.
// Adds new transaction entry to state.wallet.history with "PENDING" then auto-updates to "COMPLETED".
// Re-renders wallet grid and payout table, displays celebratory toast.

function handleCopyAddress(text)
// Uses navigator.clipboard.writeText, gives inline "Copied!" feedback badge.
```

### 6.7 Live Simulation & Stratum Terminal Loop
```javascript
function startSimulationLoop()
// Runs every 2000ms:
// 1. Slightly jitters rig hashrates (+/- 1.5%) and temps based on fan speed.
// 2. Increments accepted shares (+1 to +3 random shares).
// 3. Rare random rejected share (1 in 40 chance) for realistic simulation.
// 4. Adds accumulated mining yield to state.wallet.unpaidBalanceUsd (micropayments).
// 5. Generates realistic Stratum log line:
//    e.g. "[18:24:02] [ETH/ETC] Stratum job #9201a4 accepted in 22ms. Rig: CyberRig Titan X6"
// 6. Appends to terminal log and slides live chart point.
```

### 6.8 Chart Rendering Engine
```javascript
function renderHashrateChart()
// Native HTML5 Canvas rendering engine (zero heavy external bundle failure risk).
// Draws sleek gradient area fill under neon cyan curve.
// Draws horizontal grid lines with hashrate scale (TH/s or MH/s).
// Displays responsive hover tooltip showing exact hashrate and timestamp.
```

---

## 7. High-Fidelity UI Component Specifications

### 7.1 Rig Card Component Specification
Each worker card in `#rig-cards-container` must feature:
1. **Header**: Rig Name, Device Specs badge (GPU/ASIC/CPU), Online/Idle pulsing status dot.
2. **Current Algorithm & Coin**: Coin badge with color (`BTC / SHA-256`, `KAS / kHeavyHash`, etc.).
3. **Live Hashrate Gauge**: Large bold typography with unit (`142.50 TH/s`).
4. **Hardware Telemetry Bar**:
   - Temperature gauge with color warning (Green < 65°C, Orange 65-75°C, Red > 75°C).
   - Fan Speed indicator with rotating SVG fan icon.
   - Power consumption (Watts) & Efficiency rating (W/GH).
5. **Shares Telemetry**: Accepted / Rejected shares ratio with acceptance percentage (e.g. `99.8%`).
6. **Action Toolbar**:
   - Start / Pause Toggle Button (`#btn-toggle-rig-[id]`)
   - Tune / Overclock Button (`#btn-tune-rig-[id]`)
   - Coin Selector Dropdown to individually assign a rig to a specific coin pool.

### 7.2 Multi-Crypto Pool Card Specification
Each crypto card in `#coins-grid-container` must feature:
1. **Coin Header**: Crypto Icon (SVG/Unicode glyph), Name, Ticker Symbol, 24h Price Change badge.
2. **Algorithm Badge**: Algorithm name with tech classification (Memory-Hard, ASIC-Optimized, Merged).
3. **Network Metrics**: Difficulty, Network Hashrate, 24h Profitability rating.
4. **Mining Status**: "CURRENTLY ACTIVE" badge if selected, or "MINE THIS COIN" instant switch button.
5. **Stratum Endpoint**: Stratum URI with 1-click copy button.

### 7.3 Stratum Live Terminal Console Specification
Located at the bottom of the screen (collapsible/expandable):
- Monospace dark aesthetic reminiscent of Claymore, T-Rex Miner, or NiceHash Miner console.
- Real-time rolling messages:
  - `[INFO] Connected to stratum+tcp://btc.hashpulse-pool.com:3333`
  - `[OK] Subscribed to Stratum protocol v2`
  - `[SHARE] GPU #2: Share accepted (18 ms) [Diff: 4.29G]`
  - `[ALGO] Profit switcher: KAS profitability +12.4% vs RVN`
  - `[PAYOUT] Micro-reward 0.00000412 BTC credited to pool account`

---

## 8. File Structure Contract for Zoro (Builder)

Zoro will build the complete single-page application in the workspace with these dedicated files:

1. **`index.html`**:
   - Semantic, accessible markup.
   - All shared element IDs from Section 4.
   - Clean modular layout with modals and drawer components embedded.
2. **`style.css`**:
   - Custom Cyberpunk / Dark Fintech design system with CSS custom properties.
   - High-contrast visual hierarchy, custom scrollbars, animated pulse rings for active miners, glowing neon accents, and responsive grid layouts.
3. **`app.js`**:
   - Full implementation of `MiningApp` state machine.
   - All event handlers specified in Section 6.
   - Simulation tick loop for live hashrates, shares, temperatures, and stratum messages.
   - HTML5 Canvas real-time charting engine.
   - Audio synthesized clicks/chimes using Web Audio API (no external sound file dependencies).

---

## 9. Verification & Quality Gates

To meet Straw Hat Crew Group 1 standard:
1. **Zero Dead Buttons**: Every button (`Start All`, `Stop All`, `Tune`, `Mine Coin`, `Rent`, `Withdraw`, `Add Rig`, `Toggle Auto-Profit`, `Copy Stratum`, `Timeframes`, `Audio`) executes real state changes.
2. **Rich Pre-loaded Data**: 8 coins, 6 rigs, 6 cloud contracts, full wallet balances and transaction logs ready on load.
3. **Live Dynamism**: Hashrate chart ticks smoothly every 2 seconds, Stratum console scrolls new events, unpaid balances accumulate realistically.
4. **Complete Responsive Layout**: Desktop multi-column grid down to mobile stackable viewport.

---
*Contract approved by Nami (Group 1 - Architect). Ready for Zoro (Builder) to execute.*