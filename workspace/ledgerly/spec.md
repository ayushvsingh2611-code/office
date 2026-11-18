# LEDGERLY — SYSTEM & DATA ARCHITECTURE CONTRACT (SPEC.MD)
**Group 1 - Architect:** Nami (System & Data Architect)  
**Target Builder:** Zoro (Group 1 - Builder)  
**Product:** Ledgerly — Clean Modern Personal Finance, Expense Tracker & Smart Budget Web Application  
**Design Influence:** Stripe Financial Dashboard, Revolut 10, Apple Wallet (Crisp, High-Precision Light Minimalist Canvas — ZERO Dark Mode, ZERO Cyberpunk/Neon)

---

## 1. DESIGN SYSTEM & VISUAL IDENTITY

### 1.1 Color Palette & Tokens
Ledgerly employs a clean, high-contrast, institutional light design system built for maximum legibility and financial trust:

| Token Name | Hex Code | Usage |
|---|---|---|
| `--bg-canvas` | `#F8FAFC` | Main application background (Slate-50) |
| `--bg-surface` | `#FFFFFF` | Cards, modals, sidebars, elevated surfaces |
| `--border-subtle` | `#E2E8F0` | Card borders, dividers, subtle separators (Slate-200) |
| `--border-strong` | `#CBD5E1` | Input borders, active tab borders (Slate-300) |
| `--text-primary` | `#0F172A` | Primary typography, headers, main numerals (Slate-900) |
| `--text-secondary` | `#475569` | Subheaders, table header titles, captions (Slate-600) |
| `--text-muted` | `#94A3B8` | Hints, timestamps, placeholders (Slate-400) |
| `--primary-blue` | `#2563EB` | Primary CTA, active nav indicators, focus rings (Blue-600) |
| `--primary-blue-hover` | `#1D4ED8` | Primary button hover state (Blue-700) |
| `--primary-blue-light` | `#EFF6FF` | Soft active badge backgrounds (Blue-50) |
| `--income-emerald` | `#10B981` | Positive cashflow, credits, savings badges (Emerald-500) |
| `--income-emerald-bg` | `#ECFDF5` | Income pill background (Emerald-50) |
| `--expense-coral` | `#EF4444` | Negative cashflow, debits, budget over-limit (Red-500) |
| `--expense-coral-bg` | `#FEF2F2` | Expense pill background (Red-50) |
| `--warning-amber` | `#F59E0B` | Budget warning threshold (>= 80%) (Amber-500) |
| `--warning-amber-bg` | `#FFFBEB` | Warning pill background (Amber-50) |
| `--badge-upi` | `#7C3AED` | UPI badge purple (Violet-600) |
| `--badge-card` | `#0284C7` | Credit card badge cyan/blue (Sky-600) |
| `--badge-bank` | `#0D9488` | Bank Transfer badge teal (Teal-600) |

### 1.2 Typography & Shadows
- **Font Stack:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- **Tabular Figures:** Numbers formatted with `font-variant-numeric: tabular-nums;` to guarantee crisp alignment across financial ledgers and KPI counters.
- **Card Shadows:** `box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05);`
- **Modal / Flyout Shadows:** `box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.06);`
- **Border Radii:** `10px` for cards/inputs, `8px` for buttons/badges, `9999px` for pills.

---

## 2. APPLICATION SHELL & LAYOUT ARCHITECTURE

```
+----------------------------------------------------------------------------------------------------+
|  LEDGERLY TOP BAR (#top-bar)                                                                       |
|  [Logo: ❖ Ledgerly]   | Live Rate: [🟢 Live Online INR/USD/EUR] | Currency: [₹ INR ▾] | [+ Add Tx] |
+-----------------------+----------------------------------------------------------------------------+
| SIDEBAR (#app-sidebar)| MAIN CONTENT AREA (#main-content)                                          |
|                       |                                                                            |
| [⊞ Overview]          |  VIEW 1: #view-overview                                                    |
| [⇄ Transactions]      |  - 4 KPI Cards (#kpi-balance, #kpi-income, #kpi-expenses, #kpi-savings)   |
| [◎ Budgets & Goals]   |  - 2 HTML5 Canvas Charts (#cashflow-canvas, #donut-canvas)                 |
| [◷ Subscriptions]     |  - Recent Activity Mini Table (#recent-activity-list)                      |
|                       |----------------------------------------------------------------------------|
| -----------------     |  VIEW 2: #view-transactions                                                |
| Quick Storage Status  |  - Filters: Search, Type (All/Inc/Exp), Category, Sort Order               |
| [↺ Reset Demo Data]   |  - Export to CSV (#btn-export-csv)                                          |
|                       |  - Ledger Table (#tx-table-body) with Edit & Delete actions                |
|                       |----------------------------------------------------------------------------|
|                       |  VIEW 3: #view-budgets                                                     |
|                       |  - Category Monthly Budgets (Progress bars: Slate -> Amber >=80% -> Red)  |
|                       |  - Savings Goals Cards (Target vs Saved, "+ Add Money" quick action)       |
|                       |----------------------------------------------------------------------------|
|                       |  VIEW 4: #view-subscriptions                                               |
|                       |  - Recurring Subscriptions Table with working "Mark Paid" trigger          |
+-----------------------+----------------------------------------------------------------------------+
| TOAST NOTIFICATIONS CONTAINER (#toast-container)                                                   |
+----------------------------------------------------------------------------------------------------+
```

---

## 3. DOM ELEMENT IDS & SEMANTIC CONTRACT

Zoro (Builder) MUST use these **exact** element IDs. No renamed IDs, no deviations.

### 3.1 Header & Navigation Controls
- `#top-bar`: Header container
- `#currency-select`: Dropdown `<select>` with options `"INR"`, `"USD"`, `"EUR"`
- `#rate-status-badge`: Span indicator badge displaying live online API status (e.g., `🟢 Online: 1 USD = 83.50 INR` or fallback `🟡 Offline Rates Cached`)
- `#btn-open-add-modal`: Primary button in the top bar to open Add Transaction modal
- `#nav-overview`: Sidebar tab button for Overview View
- `#nav-transactions`: Sidebar tab button for Transactions View
- `#nav-budgets`: Sidebar tab button for Budgets & Goals View
- `#nav-subscriptions`: Sidebar tab button for Subscriptions & Bills View
- `#btn-reset-data`: Sidebar button to restore original rich demo seed data
- `#toast-container`: Floating container at top-right for notifications

### 3.2 View Containers
- `#view-overview`: Section container for Overview view (Default: active)
- `#view-transactions`: Section container for Transactions ledger view (Hidden unless active)
- `#view-budgets`: Section container for Budgets & Savings Goals view (Hidden unless active)
- `#view-subscriptions`: Section container for Recurring Subscriptions view (Hidden unless active)

### 3.3 Overview View (`#view-overview`)
- `#kpi-balance-amount`: Primary balance display (e.g., `₹2,48,500.00`)
- `#kpi-balance-sub`: Subtitle showing net difference or status
- `#kpi-income-amount`: Monthly income KPI total
- `#kpi-income-count`: Badge showing transaction count (e.g., `3 deposits`)
- `#kpi-expense-amount`: Monthly expenses KPI total
- `#kpi-expense-count`: Badge showing transaction count (e.g., `9 expenses`)
- `#kpi-savings-rate`: Monthly savings rate formatted as percentage (e.g., `42.5%`)
- `#kpi-savings-progress`: Mini visual progress bar for savings rate
- `#cashflow-canvas`: `<canvas>` element for 6-Month Income vs Expense Bar Chart
- `#donut-canvas`: `<canvas>` element for Category Spending Donut Chart
- `#donut-legend`: Container for category spending breakdown color tags & percentages
- `#canvas-tooltip`: Absolute positioned div overlay for interactive hover telemetry on both charts
- `#recent-tx-preview-list`: Quick 5-item preview list of most recent transactions on Overview

### 3.4 Transactions View (`#view-transactions`)
- `#tx-search-input`: Text input for live filtering by title/notes
- `#tx-filter-type`: Select dropdown: `all`, `income`, `expense`
- `#tx-filter-category`: Select dropdown: `all`, `Salary`, `Freelance`, `Rent`, `Food`, `Shopping`, `Travel`, `Bills`, `Entertainment`, `Health`
- `#tx-sort-select`: Select dropdown: `date-desc` (Newest first), `date-asc` (Oldest first), `amount-desc` (Highest first), `amount-asc` (Lowest first)
- `#btn-export-csv`: Primary action button that generates and downloads `ledgerly_transactions.csv`
- `#tx-table`: Ledger `<table>`
- `#tx-table-body`: `<tbody>` receiving dynamically rendered transactions
- `#tx-count-indicator`: Label displaying `Showing X of Y transactions`
- `#tx-empty-state`: Empty illustration & message when search/filter returns 0 results

### 3.5 Budgets & Goals View (`#view-budgets`)
- `#budget-cards-grid`: Grid container for category budget cards
- `#btn-edit-budget-modal`: Quick action button to adjust category budget limits
- `#goals-cards-grid`: Grid container for savings goals (Emergency Fund, MacBook Pro, Goa Trip, etc.)
- `#modal-add-goal-money`: Modal to deposit money into a chosen savings goal
- `#goal-money-form`: Form inside modal to specify goal and deposit amount
- `#goal-select-input`: Select dropdown inside goal deposit modal
- `#goal-amount-input`: Numeric input for deposit amount
- `#btn-goal-submit`: Confirm button for goal deposit
- `#btn-goal-cancel`: Cancel button for goal deposit

### 3.6 Subscriptions View (`#view-subscriptions`)
- `#subs-table-body`: `<tbody>` for subscriptions list
- `#subs-monthly-total`: Metric card showing aggregate monthly recurring commitment
- `#subs-active-count`: Metric card showing active active subscriptions count
- `#subs-next-due`: Metric card showing next upcoming subscription & date

### 3.7 Transaction Add / Edit Modal
- `#modal-transaction`: Outer backdrop & modal container
- `#modal-transaction-title`: Header text (`"Add New Transaction"` or `"Edit Transaction"`)
- `#form-transaction`: `<form>` element
- `#tx-edit-id`: Hidden `<input type="hidden">` holding transaction ID if in edit mode (empty for new)
- `#tx-type-income`: Radio/button toggle for "Income"
- `#tx-type-expense`: Radio/button toggle for "Expense"
- `#tx-input-title`: Text `<input>` for Title (e.g., "Whole Foods Groceries")
- `#tx-input-amount`: Number `<input step="0.01">` for Amount (always stored in Base Currency INR)
- `#tx-input-category`: Select dropdown populated with available categories
- `#tx-input-payment`: Select dropdown: `UPI`, `Credit Card`, `Bank Transfer`, `Cash`
- `#tx-input-date`: Date picker `<input type="date">`
- `#tx-input-notes`: Text `<input>` or `<textarea>` for optional notes
- `#btn-tx-submit`: Submit button (`"Save Transaction"`)
- `#btn-tx-cancel`: Cancel / Close button
- `#btn-modal-close-x`: Top-right "×" close icon button

### 3.8 Budget Edit Modal
- `#modal-edit-budget`: Modal to update monthly category budget ceilings
- `#form-edit-budget`: Budget form
- `#budget-input-category`: Readonly or select category
- `#budget-input-limit`: Number input for new monthly limit
- `#btn-budget-submit`: Save budget limit button
- `#btn-budget-cancel`: Close budget modal button

---

## 4. DATA MODELS & SCHEMA SPECIFICATIONS

All currency amounts in internal state are stored in the **Base Currency: INR (`₹`)**.  
When displayed, any figure is multiplied by the active rate for the selected currency (`INR = 1`, `USD = rates.USD`, `EUR = rates.EUR`).

### 4.1 Transaction Object Schema
```typescript
interface Transaction {
  id: string;               // e.g. "tx_101"
  title: string;            // e.g. "Swiggy Gourmet"
  amount: number;           // In base currency INR, e.g. 1450.00 (positive number)
  type: "income" | "expense";
  category: "Salary" | "Freelance" | "Rent" | "Food" | "Shopping" | "Travel" | "Bills" | "Entertainment" | "Health";
  paymentMethod: "UPI" | "Credit Card" | "Bank Transfer" | "Cash";
  date: string;             // ISO Format "YYYY-MM-DD", e.g. "2025-05-18"
  notes?: string;           // Optional note
}
```

### 4.2 Category Budget Object Schema
```typescript
interface CategoryBudget {
  category: string;         // Matches transaction category (e.g. "Food", "Shopping", "Rent", "Travel", "Bills")
  monthlyLimit: number;     // In INR base, e.g. 25000
  icon: string;             // Lucide/SVG icon identifier
}
```

### 4.3 Savings Goal Object Schema
```typescript
interface SavingsGoal {
  id: string;               // e.g. "goal_1"
  title: string;            // e.g. "Emergency Fund (6 Months)"
  targetAmount: number;     // In INR base, e.g. 500000
  currentAmount: number;    // In INR base, e.g. 320000
  targetDate: string;       // e.g. "2025-12-31"
  categoryTag: string;      // e.g. "Security" | "Gadget" | "Travel"
  icon: string;
}
```

### 4.4 Recurring Subscription Object Schema
```typescript
interface Subscription {
  id: string;               // e.g. "sub_1"
  name: string;             // e.g. "Netflix Premium 4K"
  amount: number;           // In INR base, e.g. 649
  billingCycle: "Monthly" | "Annual";
  dueDay: number;           // Day of month (e.g. 22)
  nextDueDate: string;      // "2025-05-22"
  category: "Entertainment" | "Utilities" | "Fitness" | "Software";
  paymentMethod: "UPI" | "Credit Card" | "Bank Transfer";
  autoPay: boolean;         // true = Active Auto-Pay
  isPaidThisMonth: boolean; // toggle state
  logoIcon: string;         // Brand glyph or SVG
}
```

### 4.5 Currency Rates State Schema
```typescript
interface CurrencyState {
  current: "INR" | "USD" | "EUR";
  symbols: {
    INR: "₹",
    USD: "$",
    EUR: "€"
  };
  rates: {
    INR: 1,
    USD: 0.010694,  // 1 INR ~ 0.010694 USD ($1 = ~83.50 INR)
    EUR: 0.009728   // 1 INR ~ 0.009728 EUR (€1 = ~92.50 INR)
  };
  lastUpdated: string;
  isOnline: boolean;
}
```

---

## 5. SEED DATA CONTRACT (MANDATORY IMMEDIATE RENDER)

The application MUST ship with the following rich seed dataset and populate immediately on `DOMContentLoaded`:

### 5.1 12 Seed Transactions (Indian & Global Mix)
```javascript
const SEED_TRANSACTIONS = [
  {
    id: "tx_01",
    title: "Apex Tech Corp - Monthly Salary",
    amount: 185000,
    type: "income",
    category: "Salary",
    paymentMethod: "Bank Transfer",
    date: "2025-05-01",
    notes: "Direct deposit monthly compensation"
  },
  {
    id: "tx_02",
    title: "Prestige Cyber Towers - Apartment Rent",
    amount: 42000,
    type: "expense",
    category: "Rent",
    paymentMethod: "Bank Transfer",
    date: "2025-05-03",
    notes: "Monthly flat maintenance & rent"
  },
  {
    id: "tx_03",
    title: "Nature's Basket Organic Groceries",
    amount: 6850,
    type: "expense",
    category: "Food",
    paymentMethod: "UPI",
    date: "2025-05-05",
    notes: "Weekly kitchen restock"
  },
  {
    id: "tx_04",
    title: "Fintech Client - UX Architecture Sprint",
    amount: 65000,
    type: "income",
    category: "Freelance",
    paymentMethod: "Bank Transfer",
    date: "2025-05-07",
    notes: "Milestone 2 deliverable payment"
  },
  {
    id: "tx_05",
    title: "IndiGo Airlines - Delhi Flight Tickets",
    amount: 11400,
    type: "expense",
    category: "Travel",
    paymentMethod: "Credit Card",
    date: "2025-05-09",
    notes: "Round-trip conference transit"
  },
  {
    id: "tx_06",
    title: "Apple Store BKC - Magic Keyboard",
    amount: 14900,
    type: "expense",
    category: "Shopping",
    paymentMethod: "Credit Card",
    date: "2025-05-11",
    notes: "Ergonomic desk accessories"
  },
  {
    id: "tx_07",
    title: "Blue Tokai Coffee Roasters",
    amount: 880,
    type: "expense",
    category: "Food",
    paymentMethod: "UPI",
    date: "2025-05-12",
    notes: "Cold brew beans & artisan snack"
  },
  {
    id: "tx_08",
    title: "Tata Power - Electricity Bill",
    amount: 3420,
    type: "expense",
    category: "Bills",
    paymentMethod: "UPI",
    date: "2025-05-13",
    notes: "AC usage summer billing"
  },
  {
    id: "tx_09",
    title: "Cult.Fit Platinum Annual Renewal",
    amount: 16500,
    type: "expense",
    category: "Health",
    paymentMethod: "Credit Card",
    date: "2025-05-14",
    notes: "Fitness gym & swimming membership"
  },
  {
    id: "tx_10",
    title: "Swiggy Gourmet Dinner Party",
    amount: 3120,
    type: "expense",
    category: "Food",
    paymentMethod: "UPI",
    date: "2025-05-15",
    notes: "Weekend team dinner treats"
  },
  {
    id: "tx_11",
    title: "Amazon Web Services Cloud Hosting",
    amount: 4890,
    type: "expense",
    category: "Bills",
    paymentMethod: "Credit Card",
    date: "2025-05-16",
    notes: "Production server infrastructure"
  },
  {
    id: "tx_12",
    title: "BookMyShow - IMAX Interstellar Re-Release",
    amount: 1600,
    type: "expense",
    category: "Entertainment",
    paymentMethod: "UPI",
    date: "2025-05-17",
    notes: "Dual ticket weekend screening"
  }
];
```

### 5.2 Category Monthly Budgets (Base Limits in INR)
```javascript
const SEED_BUDGETS = [
  { category: "Rent", monthlyLimit: 45000, icon: "home" },
  { category: "Food", monthlyLimit: 20000, icon: "utensils" },
  { category: "Shopping", monthlyLimit: 25000, icon: "shopping-bag" },
  { category: "Travel", monthlyLimit: 18000, icon: "plane" },
  { category: "Bills", monthlyLimit: 12000, icon: "zap" },
  { category: "Entertainment", monthlyLimit: 8000, icon: "film" }
];
```

### 5.3 Savings Goals Seed Data
```javascript
const SEED_GOALS = [
  {
    id: "goal_1",
    title: "Emergency Fund (6 Months Runway)",
    targetAmount: 500000,
    currentAmount: 345000,
    targetDate: "2025-12-31",
    categoryTag: "Safety Reserve",
    icon: "shield"
  },
  {
    id: "goal_2",
    title: "Apple MacBook Pro M3 Max (36GB)",
    targetAmount: 249000,
    currentAmount: 185000,
    targetDate: "2025-08-30",
    categoryTag: "Workstation",
    icon: "laptop"
  },
  {
    id: "goal_3",
    title: "South Goa Monsoon Retreat",
    targetAmount: 75000,
    currentAmount: 48000,
    targetDate: "2025-07-15",
    categoryTag: "Travel",
    icon: "compass"
  }
];
```

### 5.4 Subscriptions & Recurring Bills Seed Data
```javascript
const SEED_SUBSCRIPTIONS = [
  {
    id: "sub_1",
    name: "Netflix Premium 4K Family",
    amount: 649,
    billingCycle: "Monthly",
    dueDay: 5,
    nextDueDate: "2025-06-05",
    category: "Entertainment",
    paymentMethod: "Credit Card",
    autoPay: true,
    isPaidThisMonth: true,
    logoIcon: "netflix"
  },
  {
    id: "sub_2",
    name: "Spotify Premium Duo",
    amount: 149,
    billingCycle: "Monthly",
    dueDay: 12,
    nextDueDate: "2025-06-12",
    category: "Entertainment",
    paymentMethod: "UPI",
    autoPay: true,
    isPaidThisMonth: true,
    logoIcon: "spotify"
  },
  {
    id: "sub_3",
    name: "Airtel Xstream Fiber 300 Mbps",
    amount: 1179,
    billingCycle: "Monthly",
    dueDay: 18,
    nextDueDate: "2025-05-18",
    category: "Utilities",
    paymentMethod: "UPI",
    autoPay: true,
    isPaidThisMonth: false,
    logoIcon: "wifi"
  },
  {
    id: "sub_4",
    name: "Cult.Fit Elite Pass Auto-Debit",
    amount: 1999,
    billingCycle: "Monthly",
    dueDay: 20,
    nextDueDate: "2025-05-20",
    category: "Fitness",
    paymentMethod: "Credit Card",
    autoPay: true,
    isPaidThisMonth: false,
    logoIcon: "activity"
  },
  {
    id: "sub_5",
    name: "Google One 2TB + AI Premium",
    amount: 1950,
    billingCycle: "Monthly",
    dueDay: 25,
    nextDueDate: "2025-05-25",
    category: "Software",
    paymentMethod: "Credit Card",
    autoPay: true,
    isPaidThisMonth: false,
    logoIcon: "cloud"
  },
  {
    id: "sub_6",
    name: "Adani Electricity Apartment Grid",
    amount: 3200,
    billingCycle: "Monthly",
    dueDay: 28,
    nextDueDate: "2025-05-28",
    category: "Utilities",
    paymentMethod: "Bank Transfer",
    autoPay: false,
    isPaidThisMonth: false,
    logoIcon: "zap"
  }
];
```

---

## 6. LIVE FOREX API INTEGRATION CONTRACT

### 6.1 Endpoint Details
- **Verified URL:** `https://open.er-api.com/v6/latest/INR`
- **Method:** `GET`
- **Auth:** None (Public Open Access, CORS Enabled)
- **Timeout Budget:** `5000ms` via `AbortSignal.timeout(5000)`

### 6.2 Resilient Hybrid Implementation Pattern
```javascript
const FOREX_CONFIG = {
  endpoint: 'https://open.er-api.com/v6/latest/INR',
  timeoutMs: 5000,
  fallbackRates: {
    INR: 1,
    USD: 0.010694, // 1 USD ~ 83.50 INR
    EUR: 0.009728  // 1 EUR ~ 92.50 INR
  }
};

async function fetchLiveForexRates() {
  const badge = document.getElementById('rate-status-badge');
  try {
    const response = await fetch(FOREX_CONFIG.endpoint, {
      signal: AbortSignal.timeout(FOREX_CONFIG.timeoutMs)
    });
    if (!response.ok) throw new Error('Forex HTTP Error ' + response.status);
    const data = await response.json();
    if (data && data.rates) {
      state.currency.rates.USD = data.rates.USD || FOREX_CONFIG.fallbackRates.USD;
      state.currency.rates.EUR = data.rates.EUR || FOREX_CONFIG.fallbackRates.EUR;
      state.currency.rates.INR = 1;
      state.currency.isOnline = true;
      state.currency.lastUpdated = new Date().toLocaleTimeString();
      saveStateToLocalStorage();
      
      const usdInr = (1 / state.currency.rates.USD).toFixed(2);
      badge.className = "status-badge online";
      badge.innerHTML = `🟢 Live Rates · $1 = ₹${usdInr}`;
      renderAllViews();
    }
  } catch (err) {
    console.warn('Forex fetch failed or timed out, maintaining seed rates:', err.message);
    state.currency.isOnline = false;
    const usdInr = (1 / state.currency.rates.USD).toFixed(2);
    badge.className = "status-badge fallback";
    badge.innerHTML = `🟡 Seed Rates · $1 = ₹${usdInr}`;
  }
}
```

### 6.3 Currency Conversion & Formatting Utilities
```javascript
function convertAmount(amountInBaseINR, targetCurrency) {
  const rate = state.currency.rates[targetCurrency] || 1;
  return amountInBaseINR * rate;
}

function formatCurrency(amountInBaseINR, currencyOverride = null) {
  const curr = currencyOverride || state.currency.current;
  const converted = convertAmount(amountInBaseINR, curr);
  const symbol = state.currency.symbols[curr] || "₹";
  
  // Format with commas based on locale
  const locale = curr === "INR" ? "en-IN" : "en-US";
  const formattedNumber = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(converted);
  
  return `${symbol}${formattedNumber}`;
}
```

---

## 7. HTML5 CANVAS CHART ENGINE ARCHITECTURE

To strictly satisfy the **CANVAS-DESIGN** standard, charts are built cleanly on native HTML5 `<canvas>` with crisp Retina/High-DPI scaling (`window.devicePixelRatio`), elegant tooltips, and smooth responsive resizing.

### 7.1 Canvas 1: 6-Month Income vs Expense Bar Chart (`#cashflow-canvas`)
- **Dimensions:** Container responsive width × `260px` height.
- **DPI Scaling:** Canvas physical width/height multiplied by `window.devicePixelRatio`, CSS scaled with 100% width.
- **Data Series:** Last 6 Months (e.g. Dec, Jan, Feb, Mar, Apr, May 2025).
  - Income Bar: Clean Emerald `#10B981` with rounded top corners (radius = 4px).
  - Expense Bar: Soft Coral `#EF4444` with rounded top corners (radius = 4px).
- **Grid Lines:** Subtle `#F1F5F9` horizontal lines with tabular Y-axis values.
- **Hover Telemetry:**
  - `mousemove` listener tracks mouse coordinates relative to canvas.
  - Detects if mouse X is within bar bounding boxes.
  - Renders sleek floating tooltip `#canvas-tooltip` displaying Month, Exact Income, Exact Expense, and Net Savings.

### 7.2 Canvas 2: Category Spending Donut Chart (`#donut-canvas`)
- **Dimensions:** `260px` × `260px` crisp circular chart.
- **Visual Design:**
  - Donut ring thickness: Outer radius `95px`, Inner hole radius `62px`.
  - Subtle `2px` white gap between slices.
  - Slice colors:
    - Rent: `#3B82F6` (Blue)
    - Food: `#F59E0B` (Amber)
    - Shopping: `#EC4899` (Pink)
    - Travel: `#8B5CF6` (Purple)
    - Bills: `#06B6D4` (Cyan)
    - Health: `#10B981` (Emerald)
    - Entertainment: `#6366F1` (Indigo)
- **Center Metric:**
  - Displays Total Monthly Spend in active currency (e.g. `₹90,260`) and subtext `"Total Spend"` directly on canvas.
- **Hover Slice Detection:**
  - Polar coordinates calculation: `Math.atan2(y, x)` and `Math.hypot(x, y)` to calculate angle and radial distance.
  - Hovered slice pops out slightly (`scale` + 4px offset).
  - Shows category name, spent amount, and percentage in `#canvas-tooltip`.

---

## 8. FULL FEATURE SPECIFICATIONS & BUSINESS LOGIC

### 8.1 4 KPI Card Calculation Engine
1. **Total Balance (`#kpi-balance-amount`):**
   $$\text{Total Balance} = \sum \text{Income Amounts} - \sum \text{Expense Amounts}$$
2. **Monthly Income (`#kpi-income-amount`):**
   $$\sum \text{Income within the current active month (May 2025)}$$
3. **Monthly Expenses (`#kpi-expense-amount`):**
   $$\sum \text{Expenses within the current active month (May 2025)}$$
4. **Net Savings Rate (`#kpi-savings-rate`):**
   $$\text{Savings Rate} = \left(\frac{\text{Monthly Income} - \text{Monthly Expenses}}{\text{Monthly Income}}\right) \times 100\%$$
   *(Clamped between 0% and 100% for progress visual)*

### 8.2 Transactions View: Table, Search, Filters & CSV Export
1. **Search & Filters:**
   - Filter transactions where `tx.title.toLowerCase().includes(query) || tx.notes.toLowerCase().includes(query)`.
   - Filter by type (`all`, `income`, `expense`).
   - Filter by category (`all` or specific category).
   - Sort by Date (Descending/Ascending) or Amount (Highest/Lowest).
2. **Export to CSV (`#btn-export-csv`):**
   - Extracts current filtered transactions array.
   - Formats headers: `ID,Date,Title,Type,Category,PaymentMethod,Amount(INR),ConvertedAmount,Currency,Notes`.
   - Creates a `Blob([csvContent], { type: 'text/csv;charset=utf-8;' })`.
   - Triggers programmatic `<a>` download named `ledgerly_export_YYYY-MM-DD.csv`.
   - Fires a toast notification: `"✅ Exported [N] transactions to CSV"`.

### 8.3 Budgets & Goals Calculations
1. **Category Budgets:**
   - Compute actual sum of expenses for that category in current month:
     $$\text{Spent} = \sum_{\text{category}} \text{Expense Amount}$$
     $$\text{Percent} = \frac{\text{Spent}}{\text{Budget Limit}} \times 100\%$$
   - Bar Styling Rules:
     - If $\text{Percent} < 80\% \rightarrow$ Royal Blue (`#2563EB`) or Emerald (`#10B981`)
     - If $80\% \le \text{Percent} \le 100\% \rightarrow$ Amber Warning (`#F59E0B`) with `"Nearing Limit"` badge
     - If $\text{Percent} > 100\% \rightarrow$ Coral Red (`#EF4444`) with `"Exceeded by [Amount]"` alert badge
   - Clicking `"Edit Limit"` opens `#modal-edit-budget` where user can change limit.
2. **Savings Goals:**
   - Progress: $\frac{\text{currentAmount}}{\text{targetAmount}} \times 100\%$
   - Clicking `"+ Add Money"` opens a prompt or `#modal-add-goal-money`.
   - User enters amount $\Delta$ (e.g., ₹5,000).
   - System updates `goal.currentAmount += \Delta`, smoothly animates the bar, and optionally creates a paired transaction or simply logs progress.
   - Toast: `"🎯 Added ₹5,000 to Emergency Fund!"`.

### 8.4 Subscriptions & "Mark Paid" Workflow
1. Each subscription row shows:
   - Service name & icon
   - Category
   - Billing cycle & Next Due Date (e.g., `Due in 4 days`)
   - Payment method badge
   - Monthly Amount in active currency
   - Status toggle:
     - If `isPaidThisMonth === true`: Green pill `"Paid"`
     - If `isPaidThisMonth === false`: Amber/Gray pill `"Due"` + clickable button `"Mark as Paid"`
2. **"Mark as Paid" Interaction:**
   - When clicked, flips `sub.isPaidThisMonth = true`.
   - Automatically injects an expense into the Ledger:
     - `title`: `sub.name + " (Subscription)"`
     - `amount`: `sub.amount`
     - `type`: `"expense"`
     - `category`: `sub.category === "Utilities" ? "Bills" : sub.category`
     - `paymentMethod`: `sub.paymentMethod`
     - `date`: Today's ISO date string
   - Re-runs all KPI and Chart renders immediately.
   - Toast: `"💳 Marked [Service] as paid & logged in transactions!"`.

### 8.5 Modal Form Validation & Persistence
- Adding/Editing transaction enforces:
  - Non-empty Title (`title.trim().length > 0`)
  - Valid Amount (`amount > 0`)
  - Valid Date (`date` is a valid date string)
- On Submit:
  - Updates/Inserts transaction in state array.
  - Closes modal.
  - Persists state to `localStorage` under key `ledgerly_store_v1`.
  - Shows success toast.
- **"Reset Demo Data" button (`#btn-reset-data`):**
  - Confirms action via custom modal or dialog.
  - Flushes `localStorage`.
  - Re-seeds all 12 transactions, 6 budgets, 3 goals, and 6 subscriptions.
  - Shows toast: `"✨ Reset to default demo data"`.

---

## 9. STEP-BY-STEP IMPLEMENTATION CONTRACT FOR ZORO (BUILDER)

Zoro (Builder) will construct the single-page application inside `index.html` (or `index.html`, `styles.css`, `app.js`):

1. **Structure `index.html`:**
   - Load clean Google Fonts (Inter / Plus Jakarta Sans) or modern system font stack.
   - Embed Feather/Lucide SVG icons cleanly.
   - Build sidebar `#app-sidebar` with the 4 navigation tabs and `#btn-reset-data`.
   - Build top bar `#top-bar` with currency selector `#currency-select`, `#rate-status-badge`, and `#btn-open-add-modal`.
   - Create the 4 view containers: `#view-overview`, `#view-transactions`, `#view-budgets`, `#view-subscriptions`.
   - Implement Add/Edit modal `#modal-transaction`, Budget modal `#modal-edit-budget`, Goal Deposit modal `#modal-add-goal-money`.
   - Add `#toast-container` and `#canvas-tooltip`.

2. **Styling `styles.css`:**
   - Adhere strictly to the light palette: `#F8FAFC` canvas, `#FFFFFF` cards, `#0F172A` text, `#E2E8F0` borders.
   - Create crisp tabular ledger rows with hover highlights.
   - Implement smooth CSS transitions on progress bars and modals.
   - Ensure responsive layout (collapsible sidebar / mobile header toggles).

3. **Core Controller `app.js`:**
   - State management with `localStorage` fallback to initial seed objects.
   - Immediate seed render on `DOMContentLoaded` (zero blank screen delay).
   - Async forex fetch to `https://open.er-api.com/v6/latest/INR` with 5s timeout.
   - Interactive Canvas chart drawing functions with DPI scaling and mousemove tooltips.
   - CSV export generator.
   - Full CRUD event handlers for transactions, budgets, goals, and subscriptions.

---

*Contract signed and verified by Nami (Group 1 - Architect).*