# OmniLogix Enterprise Global Cargo Fleet & Dispatch Command Terminal
## System Architecture & Technical Contract Specification
**Architect:** Nami (Group 1 - Architect)  
**Target Implementer:** Zoro (Group 1 - Builder)  
**Document Version:** 1.0.0 (Production-Ready Spec)  
**Output Path:** `spec.md`

---

## 1. Executive Summary & Design System

OmniLogix is an ultra-dense, mission-critical logistics command terminal tailored for global freight dispatchers, fleet directors, and institutional cargo traders. The interface follows an **Executive Glassmorphism Dark Suite** pattern, blending high-performance telemetry displays (Bloomberg/TradingView style) with automated fleet routing, live orderbook bidding ladders, dual 60 FPS HTML5 canvases, and resilient hybrid live-data streaming.

### 1.1 Authentic Brand Theme & Color Tokens
* **Base Void Background:** `#080b11` (Deep space void)
* **Surface Panel & Cards:** `#111622` (High-contrast obsidian card) with 1px border `#1e293b` / `#2b313a`
* **Surface Elevated:** `#181f2e` / `#1f2937`
* **Primary Neon Accent:** `#3b82f6` (Electric Blue) & `#2563eb` (Deep Blue)
* **Institutional Uptrend / Emerald:** `#10b981` / `#0ecb81` (Safe / Active / Low Burn / Bids)
* **Institutional Warning / Amber:** `#f59e0b` / `#f0b90b` (Idle / Transit Delay / Moderate)
* **Institutional Downtrend / Crimson:** `#ef4444` / `#f6465d` (Maintenance / Over-limit / Asks)
* **Text Primary:** `#f8fafc` (Ultra-white slate)
* **Text Muted:** `#94a3b8` (Sub-pixel soft gray)
* **Glass Accent:** `rgba(17, 22, 34, 0.75)` with `backdrop-filter: blur(16px)`

---

## 2. Global Component Hierarchy & Exact DOM Element ID Map

Every element ID listed below is an immutable contract. Zoro (Builder) **MUST** strictly use these exact element IDs so all UI controls, filters, modal triggers, and dynamic tables bind without mismatches.

```
+---------------------------------------------------------------------------------------------------+
| #terminal-header                                                                                  |
|   #brand-logo | #live-clock | #api-status-badge | #quick-dispatch-btn | #audio-toggle-btn         |
+---------------------------------------------------------------------------------------------------+
| #ticker-strip-container: Live Global Shipping Fuel & FX Index Ticker (Binance/Forex Stream)       |
+---------------------------------------------------------------------------------------------------+
| #kpi-banner-grid: 5 Metric Cards                                                                  |
|   #kpi-active-fleet | #kpi-tonnage | #kpi-ontime-rate | #kpi-fuel-burn | #kpi-dispatch-margin     |
+---------------------------------------------------------------------------------------------------+
| MAIN SPLIT WORKSPACE:                                                                             |
|                                                                                                   |
| [LEFT COLUMN: 70% Width]                               | [RIGHT COLUMN: 30% Width]                |
| +-----------------------------------------------------+ +----------------------------------------+ |
| | #dashboard-tabs-nav                                 | | #freight-ladder-panel                  | |
| |   #tab-btn-radar      (#tab-view-radar)             | |   #ladder-spread-header                | |
| |   #tab-btn-drivers    (#tab-view-drivers)           | |   #freight-orderbook-container         | |
| |   #tab-btn-shipments  (#tab-view-shipments)         | |     #orderbook-asks                    | |
| |   #tab-btn-audit      (#tab-view-audit)             | |     #orderbook-spread                  | |
| +-----------------------------------------------------+ |     #orderbook-bids                    | |
| | #tab-content-container                              | |   #ladder-quick-bid-form               | |
| |   (Dynamic Tab Views based on selected tab)         | +----------------------------------------+ |
| +-----------------------------------------------------+ | #telemetry-waveform-panel              | |
|                                                         |   #telemetry-canvas-container          | |
|                                                         |     #telemetry-waveform-canvas         | |
|                                                         |     #canvas-crosshair-hud              | |
|                                                         |   #waveform-stats-footer               | |
|                                                         +----------------------------------------+ |
+---------------------------------------------------------------------------------------------------+
| #toast-container (Fixed bottom-right notifications)                                               |
| #dispatch-modal (Create Dispatch Order Modal Dialog)                                              |
|   #dispatch-form, #close-modal-btn, #cancel-modal-btn, inputs...                                  |
+---------------------------------------------------------------------------------------------------+
```

### 2.1 Exact Contract IDs Table

| Component | Element ID | Role / Trigger Function |
| :--- | :--- | :--- |
| **Header Status Badge** | `#api-status-badge` | Displays live online/offline connection status |
| **Header Audio Toggle** | `#audio-toggle-btn` | Toggles Web Audio API sound effects (Sound On / Muted) |
| **New Dispatch Button** | `#quick-dispatch-btn`| Opens `#dispatch-modal` dialog |
| **Filter: Search Input** | `#global-search-input`| Instant debounced/real-time filter across active views |
| **Filter: Status Select**| `#status-filter-select`| Filters by All, On Route, Idle, Maintenance, High Priority |
| **Tab 1 Trigger** | `#tab-btn-radar` | Activates `#tab-view-radar` |
| **Tab 2 Trigger** | `#tab-btn-drivers` | Activates `#tab-view-drivers` |
| **Tab 3 Trigger** | `#tab-btn-shipments`| Activates `#tab-view-shipments` |
| **Tab 4 Trigger** | `#tab-btn-audit` | Activates `#tab-view-audit` |
| **Tab View: Radar** | `#tab-view-radar` | Hosts `#fleet-radar-canvas` & route timeline HUD |
| **Tab View: Drivers** | `#tab-view-drivers` | Hosts `#drivers-table-body` |
| **Tab View: Shipments**| `#tab-view-shipments`| Hosts `#shipments-table-body` |
| **Tab View: Audit** | `#tab-view-audit` | Hosts `#audit-table-body` |
| **Radar Canvas** | `#fleet-radar-canvas` | 60 FPS HTML5 Canvas for route navigation & vessel blips |
| **Drivers Table Body** | `#drivers-table-body` | Renders 10 workforce drivers & dynamic status toggles |
| **Shipments Table Body**| `#shipments-table-body`| Renders active cargo shipments & priority badges |
| **Audit Table Body** | `#audit-table-body` | Renders financial, fuel, and operating margin entries |
| **Freight Ladder Parent**| `#freight-orderbook-container`| Container for asks, spread, bids, and depth bars |
| **Ladder Asks List** | `#orderbook-asks` | Renders red asks depth ladder (8 levels, loop-safe) |
| **Ladder Bids List** | `#orderbook-bids` | Renders green bids depth ladder (8 levels, loop-safe) |
| **Ladder Spread Badge** | `#orderbook-spread` | Shows current ask-bid spread ($/ton) |
| **Telemetry Waveform** | `#telemetry-waveform-canvas` | 60 FPS Canvas with HiDPI, fuel burn curve, and crosshair |
| **Waveform Tooltip** | `#canvas-crosshair-hud` | Overlaid tooltip showing real-time fuel, speed, and timestamp |
| **Create Order Modal** | `#dispatch-modal` | Backdrop + modal for creating new dispatch orders |
| **Dispatch Form** | `#dispatch-form` | HTML form with submission validation |
| **Toast Container** | `#toast-container` | Floating notification stack (top-right or bottom-right) |

---

## 3. Concrete Data Schemas & Seed Dataset

### 3.1 Workforce & Vehicle Drivers Data Schema (`DriverItem`)
```typescript
interface DriverItem {
  id: string;               // e.g. "DRV-101"
  name: string;             // e.g. "Captain Marcus Vance"
  avatar: string;           // Initials badge or image avatar
  status: "On Route" | "Idle" | "Maintenance";
  vehicleModel: string;     // e.g. "Kenworth T680 Hybrid", "Volvo FH Electric"
  licensePlate: string;     // e.g. "TX-8921-HY"
  assignedRoute: string;    // e.g. "Chicago -> Rotterdam Gateway"
  rating: number;           // e.g. 4.9 (out of 5.0)
  totalTrips: number;       // e.g. 342
  fuelEfficiencyScore: string; // e.g. "94.2% A+"
}
```

#### 10 Synchronous Driver Seed Records:
1. `id`: "DRV-101", `name`: "Capt. Elena Rostova", `status`: "On Route", `vehicleModel`: "Volvo FH16 Aero Electric", `licensePlate`: "NL-742-XP", `assignedRoute`: "Rotterdam -> Antwerp Hub", `rating`: 4.95, `totalTrips`: 512, `fuelEfficiencyScore`: "97.4% A+"
2. `id`: "DRV-102", `name`: "Dmitri Volkov", `status`: "On Route", `vehicleModel`: "Scania 770S V8 Heavy-Haul", `licensePlate`: "DE-883-HQ", `assignedRoute`: "Hamburg -> Munich Express", `rating`: 4.88, `totalTrips`: 439, `fuelEfficiencyScore`: "93.1% A"
3. `id`: "DRV-103", `name`: "Sarah Jenkins", `status`: "Idle", `vehicleModel`: "Freightliner Cascadia eCascadia", `licensePlate`: "CA-104-BB", `assignedRoute`: "Long Beach Depot Standby", `rating`: 4.92, `totalTrips`: 380, `fuelEfficiencyScore`: "98.0% A+"
4. `id`: "DRV-104", `name`: "Mateo Silva", `status`: "Maintenance", `vehicleModel`: "Mercedes-Benz Actros L 630", `licensePlate`: "ES-339-ML", `assignedRoute`: "Valencia Service Bay #4", `rating`: 4.74, `totalTrips`: 290, `fuelEfficiencyScore`: "89.5% B"
5. `id`: "DRV-105", `name`: "Kenji Takahashi", `status`: "On Route", `vehicleModel`: "Hino Profia Hybrid 6x2", `licensePlate`: "JP-910-TK", `assignedRoute`: "Yokohama Port -> Osaka Terminal", `rating`: 4.99, `totalTrips`: 620, `fuelEfficiencyScore`: "99.1% A+"
6. `id`: "DRV-106", `name`: "Amara Okafor", `status`: "On Route", `vehicleModel`: "MAN TGX 18.640 Individual Lion", `licensePlate`: "FR-512-NX", `assignedRoute`: "Le Havre -> Paris Intermodal", `rating`: 4.85, `totalTrips`: 315, `fuelEfficiencyScore`: "92.8% A"
7. `id`: "DRV-107", `name`: "Gareth MacLeod", `status`: "Idle", `vehicleModel`: "DAF XG+ 530 Super Space", `licensePlate`: "UK-772-GL", `assignedRoute`: "Southampton Docks Ready", `rating`: 4.79, `totalTrips`: 410, `fuelEfficiencyScore`: "91.2% B+"
8. `id`: "DRV-108", `name`: "Hanna Lindqvist", `status`: "On Route", `vehicleModel`: "Volvo FH Electric Tri-Axle", `licensePlate`: "SE-601-LV", `assignedRoute`: "Gothenburg -> Stockholm Corridor", `rating`: 4.96, `totalTrips`: 475, `fuelEfficiencyScore`: "98.5% A+"
9. `id`: "DRV-109", `name`: "Tariq Al-Mansoor", `status`: "Maintenance", `vehicleModel`: "Iveco S-Way 570 Cursor 13", `licensePlate`: "AE-441-DX", `assignedRoute`: "Jebel Ali Drydock Maintenance", `rating`: 4.68, `totalTrips`: 220, `fuelEfficiencyScore`: "88.0% B"
10. `id`: "DRV-110", `name`: "Chloe Dubois", `status`: "On Route", `vehicleModel`: "Renault Trucks T High Turbo", `licensePlate`: "BE-205-QC", `assignedRoute`: "Zeebrugge -> Lyon Hub", `rating`: 4.91, `totalTrips`: 355, `fuelEfficiencyScore`: "95.6% A"

---

### 3.2 Active Cargo Shipments Schema (`ShipmentItem`)
```typescript
interface ShipmentItem {
  trackingId: string;       // e.g. "OMX-98214"
  cargoType: string;        // e.g. "Semiconductor Wafers", "Refrigerated Pharma"
  weightKg: number;         // e.g. 18,400
  origin: string;           // e.g. "Taipei Port (TPE)"
  destination: string;      // e.g. "Frankfurt CargoCity (FRA)"
  eta: string;              // ISO string or formatted "2h 45m"
  progressPercent: number;  // 0 - 100
  priority: "Critical" | "Standard" | "Express" | "Hazardous";
  assignedDriverId: string; // e.g. "DRV-101"
  status: "In Transit" | "Customs Clearance" | "Dispatched" | "Delivered";
}
```

#### 10 Synchronous Cargo Shipment Seed Records:
1. `trackingId`: "OMX-88201", `cargoType`: "Cryo-Pharma Vaccines", `weightKg`: 12400, `origin`: "Basel BioPark (CH)", `destination`: "Rotterdam Terminal (NL)", `eta`: "1h 45m", `progressPercent`: 78, `priority`: "Critical", `assignedDriverId`: "DRV-101", `status`: "In Transit"
2. `trackingId`: "OMX-88202", `cargoType`: "Automotive Li-Ion Cells", `weightKg`: 24500, `origin`: "Stuttgart Giga (DE)", `destination`: "Munich North (DE)", `eta`: "3h 10m", `progressPercent`: 54, `priority`: "Hazardous", `assignedDriverId`: "DRV-102", `status`: "In Transit"
3. `trackingId`: "OMX-88203", `cargoType`: "Aerospace Avionics Rig", `weightKg`: 8900, `origin`: "Toulouse Aero (FR)", `destination`: "Le Havre Port (FR)", `eta`: "5h 20m", `progressPercent`: 32, `priority`: "Express", `assignedDriverId`: "DRV-106", `status`: "In Transit"
4. `trackingId`: "OMX-88204", `cargoType`: "Photolithography Optics", `weightKg`: 14100, `origin`: "Veldhoven ASML (NL)", `destination`: "Zeebrugge Docks (BE)", `eta`: "2h 05m", `progressPercent`: 65, `priority`: "Critical", `assignedDriverId`: "DRV-110", `status`: "In Transit"
5. `trackingId`: "OMX-88205", `cargoType`: "Precision Machine Tools", `weightKg`: 21800, `origin`: "Gothenburg Hub (SE)", `destination`: "Stockholm Depot (SE)", `eta`: "4h 40m", `progressPercent`: 41, `priority`: "Standard", `assignedDriverId`: "DRV-108", `status`: "In Transit"
6. `trackingId`: "OMX-88206", `cargoType`: "Robotics Assemblies", `weightKg`: 16200, `origin`: "Yokohama Pier 4 (JP)", `destination`: "Osaka Logistics (JP)", `eta`: "2h 30m", `progressPercent`: 60, `priority`: "Express", `assignedDriverId`: "DRV-105", `status`: "In Transit"
7. `trackingId`: "OMX-88207", `cargoType`: "Solar Inverter Modules", `weightKg`: 28900, `origin`: "Valencia Gateway (ES)", `destination`: "Madrid Dry Hub (ES)", `eta`: "Pending Bay", `progressPercent`: 0, `priority`: "Standard", `assignedDriverId`: "DRV-104", `status`: "Dispatched"
8. `trackingId`: "OMX-88208", `cargoType`: "Green Hydrogen Cylinders", `weightKg`: 9800, `origin`: "Southampton Port (UK)", `destination`: "Birmingham Rail (UK)", `eta`: "On Hold", `progressPercent`: 15, `priority`: "Hazardous", `assignedDriverId`: "DRV-107", `status`: "Customs Clearance"
9. `trackingId`: "OMX-88209", `cargoType`: "Telecom Server Racks", `weightKg`: 11500, `origin`: "Long Beach Berth 55 (US)", `destination`: "Phoenix Datacenter (US)", `eta`: "Pre-Transit", `progressPercent`: 5, `priority`: "Standard", `assignedDriverId`: "DRV-103", `status`: "Dispatched"
10. `trackingId`: "OMX-88210", `cargoType`: "Industrial Turbine Castings", `weightKg`: 31200, `origin`: "Jebel Ali Gate 2 (AE)", `destination`: "Abu Dhabi Energy (AE)", `eta`: "In Bay #3", `progressPercent`: 0, `priority`: "Critical", `assignedDriverId`: "DRV-109", `status`: "Dispatched"

---

### 3.3 Financial & Fuel Dispatch Audit Schema (`AuditItem`)
```typescript
interface AuditItem {
  id: string;               // e.g. "FNA-4091"
  routeTag: string;         // e.g. "RTD-ANT-01"
  fuelConsumedLiters: number;// e.g. 182.4
  fuelCostUsd: number;      // e.g. $364.80
  tollFeesUsd: number;      // e.g. $88.50
  driverRateUsd: number;    // e.g. $420.00
  grossBillingUsd: number;  // e.g. $1,420.00
  netMarginUsd: number;     // gross - (fuel + toll + driverRate)
  marginPercent: number;    // (netMargin / grossBilling) * 100
}
```

#### 10 Synchronous Financial Audit Seed Records:
1. `id`: "FNA-9001", `routeTag`: "RTD-ANT-01", `fuelConsumedLiters`: 145.2, `fuelCostUsd`: 290.40, `tollFeesUsd`: 64.00, `driverRateUsd`: 380.00, `grossBillingUsd`: 1280.00, `netMarginUsd`: 545.60, `marginPercent`: 42.6%
2. `id`: "FNA-9002", `routeTag`: "HAM-MUC-04", `fuelConsumedLiters`: 260.8, `fuelCostUsd`: 521.60, `tollFeesUsd`: 142.50, `driverRateUsd`: 510.00, `grossBillingUsd`: 1890.00, `netMarginUsd`: 715.90, `marginPercent`: 37.9%
3. `id`: "FNA-9003", `routeTag`: "TOU-LHV-09", `fuelConsumedLiters`: 310.5, `fuelCostUsd`: 621.00, `tollFeesUsd`: 185.00, `driverRateUsd`: 620.00, `grossBillingUsd`: 2250.00, `netMarginUsd`: 824.00, `marginPercent`: 36.6%
4. `id`: "FNA-9004", `routeTag`: "VEL-ZEE-02", `fuelConsumedLiters`: 98.4, `fuelCostUsd`: 196.80, `tollFeesUsd`: 48.00, `driverRateUsd`: 290.00, `grossBillingUsd`: 950.00, `netMarginUsd`: 415.20, `marginPercent`: 43.7%
5. `id`: "FNA-9005", `routeTag`: "GOT-STO-07", `fuelConsumedLiters`: 205.1, `fuelCostUsd`: 410.20, `tollFeesUsd`: 76.00, `driverRateUsd`: 460.00, `grossBillingUsd`: 1620.00, `netMarginUsd`: 673.80, `marginPercent`: 41.6%
6. `id`: "FNA-9006", `routeTag`: "YOK-OSA-12", `fuelConsumedLiters`: 215.0, `fuelCostUsd`: 430.00, `tollFeesUsd`: 110.00, `driverRateUsd`: 490.00, `grossBillingUsd`: 1780.00, `netMarginUsd`: 750.00, `marginPercent`: 42.1%
7. `id`: "FNA-9007", `routeTag`: "VAL-MAD-03", `fuelConsumedLiters`: 178.6, `fuelCostUsd`: 357.20, `tollFeesUsd`: 52.00, `driverRateUsd`: 360.00, `grossBillingUsd`: 1320.00, `netMarginUsd`: 550.80, `marginPercent`: 41.7%
8. `id`: "FNA-9008", `routeTag`: "SOU-BIR-05", `fuelConsumedLiters`: 120.3, `fuelCostUsd`: 240.60, `tollFeesUsd`: 38.00, `driverRateUsd`: 310.00, `grossBillingUsd`: 1050.00, `netMarginUsd`: 461.40, `marginPercent`: 43.9%
9. `id`: "FNA-9009", `routeTag`: "LGB-PHX-11", `fuelConsumedLiters`: 340.0, `fuelCostUsd`: 680.00, `tollFeesUsd`: 95.00, `driverRateUsd`: 680.00, `grossBillingUsd`: 2450.00, `netMarginUsd`: 995.00, `marginPercent`: 40.6%
10. `id`: "FNA-9010", `routeTag`: "JBL-ABD-01", `fuelConsumedLiters`: 85.0, `fuelCostUsd`: 170.00, `tollFeesUsd`: 25.00, `driverRateUsd`: 220.00, `grossBillingUsd`: 780.00, `netMarginUsd`: 365.00, `marginPercent`: 46.8%

---

## 4. Dual HTML5 Canvas Engineering Specifications

### 4.1 Canvas 1: Live Fleet Radar & Telemetry HUD (`#fleet-radar-canvas`)
* **Container Element:** `#tab-view-radar`
* **Canvas ID:** `#fleet-radar-canvas`
* **Resolution & Scaling Rule:** Always multiply canvas `width` and `height` properties by `window.devicePixelRatio || 1` while constraining CSS `style.width = '100%'` and `style.height = '420px'` to eliminate fuzzy sub-pixels.
* **Canvas Render Cycle (60 FPS via `requestAnimationFrame`):**
  1. **Background & Grid:** Clear canvas with `#0b0e11`, draw concentric radial range rings (25km, 50km, 75km, 100km) with stroke `#1e293b` (dash array `[4, 4]`).
  2. **Sweep Beam:** Draw a 360° rotating gradient radar scanner line (`ctx.createRadialGradient`) rotating at ~0.02 radians/frame.
  3. **Cargo Nodes & Transit Corridors:**
     - Plot real-world corridor paths with glowing dashed blue lines (`#3b82f6`).
     - Plot active cargo nodes with pulsating emerald/amber dots (`#10b981`, `#f59e0b`).
     - Render node tags (e.g. `ROTTERDAM [NL]`, `HAMBURG [DE]`, `ZEEBRUGGE [BE]`, `VALENCIA [ES]`).
  4. **Active Fleet Vessels / Blips:**
     - Represent moving vehicles as dynamic directional triangles or pulsing circles with vehicle labels (`DRV-101 (84 km/h)`).
     - Mouse hover detection: Compute euclidean distance `hypot(mouseX - blipX, mouseY - blipY) < 12`. When matched, render an executive telemetry HUD box:
       - Vessel ID, Driver, Speed, Fuel Burn (L/100km), Heading, and Active Cargo Weight.

### 4.2 Canvas 2: Real-time Telemetry & Fuel Consumption Waveform (`#telemetry-waveform-canvas`)
* **Container Element:** `#telemetry-waveform-panel`
* **Canvas ID:** `#telemetry-waveform-canvas`
* **Dimensions:** CSS width `100%`, height `220px`, scaled by `devicePixelRatio`.
* **Visual Components:**
  1. **Dual Smooth Spline Curves:**
     - Curve A (Emerald `#0ecb81` with translucent gradient fill): Fuel Burn Efficiency (L/100km or MPG equivalent) updated at 60 FPS with micro-fluctuations.
     - Curve B (Cyan `#00f0ff` stroke): Fleet Dispatch Speed / Telemetry Velocity (km/h).
  2. **Real-time Scrolling Buffer:** Maintain an array of 60 data points (`waveformHistory`). Every 10-15 frames, push a new realistic telemetry point:
     ```javascript
     const last = waveformHistory[waveformHistory.length - 1] || 28;
     const nextFuel = Math.max(18, Math.min(42, last + (Math.random() - 0.49) * 2.2));
     waveformHistory.push(nextFuel);
     if (waveformHistory.length > 60) waveformHistory.shift();
     ```
  3. **Crosshair Hover & Interactive HUD:**
     - On `mousemove` over `#telemetry-waveform-canvas`:
       - Calculate hovered X index.
       - Draw vertical laser guide line in `#f0b90b` (dashed).
       - Draw circular snap node on both curves.
       - Render tooltip text inside `#canvas-crosshair-hud`:
         `"T-Now | Fuel: 24.6 L/100km | Speed: 88.4 km/h | Engine: 1,840 RPM"`

---

## 5. High-Density Cargo Freight Bidding Ladder Specification

Container: `#freight-orderbook-container`  
Inspired by institutional crypto/futures trading ladders, this component displays real-time asks (freight sell offers by carriers) and bids (cargo buy bids by shippers).

### 5.1 CRITICAL LOOP SAFETY CONTRACT
Zoro **MUST NEVER** use decrementing loops from 1 downwards or improper terminating conditions.
Use strictly:
```javascript
// STRICT CONTRACT: Ascending positive integer loop
for (let i = 1; i <= 8; i++) {
  // calculate depth, rate, volume
}
```

### 5.2 Orderbook Structural Layout
```
+-------------------------------------------------------------+
| FREIGHT BIDDING LADDER (EUR/TON)                            |
+-------------------------------------------------------------+
| ASKS (CARRIER RATES - SELL)                                 |
| Rate ($/T)    Capacity (Tons)   Depth %   [Depth Bar (Red)] |
| $148.50       420 T             100%      [███████████████] |
| $146.20       310 T              73%      [███████████    ] |
| $144.80       260 T              61%      [█████████      ] |
| $142.10       180 T              42%      [██████         ] |
+-------------------------------------------------------------+
| SPREAD: $2.40 / TON  (Mid-Market: $140.90 / Ton)            |
+-------------------------------------------------------------+
| BIDS (SHIPPER CONTRACTS - BUY)                              |
| Rate ($/T)    Capacity (Tons)   Depth %   [Depth Bar (Green)|
| $139.70       190 T              45%      [███████        ] |
| $138.20       280 T              66%      [██████████     ] |
| $136.50       340 T              80%      [████████████   ] |
| $134.00       425 T             100%      [███████████████] |
+-------------------------------------------------------------+
| QUICK FREIGHT BID / OFFER DESK:                             |
| [#ladder-rate-input] [#ladder-weight-input]                 |
| [#btn-post-freight-bid] [#btn-post-freight-ask]             |
+-------------------------------------------------------------+
```

### 5.3 Orderbook Behavior & Micro-Ticks
* Renders 8 ask rows in `#orderbook-asks` and 8 bid rows in `#orderbook-bids`.
* Every 2 seconds, simulate subtle institutional orderbook fluctuations (+/- $0.10 to $0.40) to give active terminal vitality without layout shifting.
* Clicking any ask or bid row automatically populates `#ladder-rate-input` and `#ladder-weight-input` for instant freight booking.

---

## 6. Zero-Blank Hybrid Data Architecture & Live Forex/Crypto Streaming

### 6.1 Guarantees:
1. **Zero Blank Render:** On `DOMContentLoaded`, the UI synchronously mounts using the local in-memory arrays for Drivers, Shipments, Audit, and Freight Ladder. The user immediately sees a rich, populated terminal with zero delay or blank state.
2. **Background Async Enrichment:** In the background, asynchronously invoke the public API to fetch cross-currency exchange rates / institutional market indices to power real-time international shipping conversion calculations.
3. **5-Second Timeout:** Use `AbortSignal.timeout(5000)` inside standard `fetch`.
4. **Resilient Fallback:** If network fails or DNS fails (as common in airgapped/sandboxed runtimes), catch the error gracefully without throwing uncaught exceptions. Update `#api-status-badge` to `"🟡 Offline Seed Mode"` while keeping all seed data operational.

### 6.2 API Specification
* **Endpoint:** `https://api.binance.com/api/v3/ticker/24hr?symbols=[%22BTCUSDT%22,%22ETHUSDT%22,%22SOLUSDT%22,%22BNBUSDT%22]`
* **Data Mapping Contract:**
  ```javascript
  interface LiveMarketRate {
    symbol: string;          // e.g. "BTCUSDT" -> mapped to "BTC Cargo FX"
    lastPrice: string;       // e.g. "86420.50"
    priceChangePercent: string; // e.g. "+3.42%"
    highPrice: string;
    lowPrice: string;
    volume: string;
  }
  ```
* **Status Badge DOM States:**
  * Success: `<span id="api-status-badge" class="px-2 py-0.5 text-xs rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 font-mono flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>🟢 Live Online Rates</span>`
  * Fallback/Offline: `<span id="api-status-badge" class="px-2 py-0.5 text-xs rounded-full bg-amber-950/80 text-amber-400 border border-amber-500/40 font-mono flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-amber-400"></span>🟡 Offline Seed Mode</span>`

---

## 7. Interactive Controls & Complete Event Handlers Contract

To guarantee **100% working functionality and zero dead buttons**, every handler must be implemented as specified below.

### 7.1 Tab Switching Architecture
Tabs:
1. `#tab-btn-radar` -> toggles `#tab-view-radar` visible (`display: block`), hides `#tab-view-drivers`, `#tab-view-shipments`, `#tab-view-audit`.
2. `#tab-btn-drivers` -> toggles `#tab-view-drivers` visible, hides others.
3. `#tab-btn-shipments` -> toggles `#tab-view-shipments` visible, hides others.
4. `#tab-btn-audit` -> toggles `#tab-view-audit` visible, hides others.

Active tab button receives Tailwind styling: `border-b-2 border-blue-500 text-blue-400 font-semibold bg-blue-500/10`. Inactive tab buttons receive `text-slate-400 hover:text-slate-200`.

### 7.2 Unified Search & Status Filter Contract
* `#global-search-input`: Listens to `input` event.
  - If Drivers tab is active: filters rows by driver name, ID, vehicle model, or route.
  - If Shipments tab is active: filters rows by tracking ID, cargo type, origin, or destination.
  - If Audit tab is active: filters rows by route tag or audit ID.
* `#status-filter-select`: Listens to `change` event.
  - Options: `All`, `On Route`, `Idle`, `Maintenance`, `Critical Priority`.
  - Filters matching records immediately and re-renders table with smooth transitions.

### 7.3 Create Dispatch Order Modal (`#dispatch-modal`)
* **Trigger:** Click `#quick-dispatch-btn` removes `hidden` from `#dispatch-modal`.
* **Close Triggers:** Click `#close-modal-btn`, click `#cancel-modal-btn`, or click modal backdrop `#modal-backdrop`.
* **Form Inputs Contract:**
  * `#input-cargo-name`: Text input (required, min 3 chars).
  * `#input-origin`: Text input (e.g. "Rotterdam Hub") (required).
  * `#input-destination`: Text input (e.g. "Munich Logistics") (required).
  * `#input-weight`: Number input (kg) (required, min 100, max 60000).
  * `#input-driver`: Select dropdown populated dynamically with drivers list (required).
  * `#input-priority`: Select dropdown (`Critical`, `Express`, `Standard`, `Hazardous`).
* **Submission Handler (`#dispatch-form` on `submit`):**
  1. Validate all inputs. If invalid, display red field border and trigger error audio buzz.
  2. If valid, construct new `ShipmentItem` with unique tracking ID (e.g. `OMX-${Math.floor(10000 + Math.random()*90000)}`).
  3. Prepend to `shipmentsData` state array.
  4. Prepend audit record to `auditData`.
  5. Close modal, reset form.
  6. Play success chime via Web Audio API.
  7. Trigger toast notification: `"Dispatch Order OMX-XXXXX created for [Driver Name]!"`.
  8. Switch active tab to `#tab-btn-shipments` and highlight newly added record.

### 7.4 Web Audio API Synthesizer Contract
Zero external MP3 dependencies. Pure inline Web Audio API synthesizer for clean, professional feedback:
* `OmniAudio.playChime(type: 'success' | 'click' | 'alert' | 'error')`
  * `'click'`: 800Hz sine wave for 0.04s.
  * `'success'`: Dual chord (523.25Hz C5 -> 659.25Hz E5) for 0.15s.
  * `'alert'`: 440Hz triangle wave oscillating with gentle decay.
  * `'error'`: 180Hz saw wave for 0.12s.
* `#audio-toggle-btn`: Mutes/unmutes audio with indicator icon change.

### 7.5 Toast Notification System (`#toast-container`)
* Function signature: `showToast(title: string, message: string, type: 'info' | 'success' | 'warning' | 'error')`
* Generates glassmorphic card inside `#toast-container` with auto-dismiss after 3500ms and smooth slide-in/fade-out animation.

### 7.6 Action Buttons Inside Tables
* In `#drivers-table-body`: Each row includes an action button `#btn-toggle-status-${driver.id}` that toggles driver between "On Route" and "Idle" with an instant audio chime and toast notification.
* In `#shipments-table-body`: Each row includes a button `#btn-complete-${shipment.trackingId}` to mark status as "Delivered", updating the progress bar to 100%.

---

## 8. Layout & Styling Blueprint (Tailwind Glassmorphic Classes)

```html
<!-- Outer Frame -->
<div class="min-h-screen bg-[#080b11] text-slate-100 font-sans flex flex-col antialiased selection:bg-blue-600 selection:text-white">
  
  <!-- Terminal Header -->
  <header id="terminal-header" class="border-b border-slate-800/80 bg-[#111622]/90 backdrop-blur-md px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50">
    <!-- Brand & Status -->
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 font-black text-white text-lg">
        Ω
      </div>
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-base font-bold tracking-wider uppercase text-white font-mono">OmniLogix <span class="text-blue-400">Terminal</span></h1>
          <span class="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono">v4.8-PRO</span>
        </div>
        <p class="text-xs text-slate-400 font-mono">Global Cargo Fleet & Telemetry Dispatch</p>
      </div>
    </div>

    <!-- Live Indices & Controls -->
    <div class="flex items-center gap-3">
      <div id="api-status-badge">...</div>
      <div id="live-clock" class="font-mono text-xs px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300">UTC 00:00:00</div>
      <button id="audio-toggle-btn" class="p-2 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition" title="Toggle Terminal Audio">🔊</button>
      <button id="quick-dispatch-btn" class="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition active:scale-95">
        <span>+</span> Create Dispatch Order
      </button>
    </div>
  </header>

  <!-- Live FX & Freight Rates Marquee Ticker -->
  <div id="ticker-strip-container" class="border-b border-slate-800/60 bg-[#0d121c] px-4 py-1.5 overflow-hidden whitespace-nowrap text-xs font-mono flex items-center gap-8">
    <!-- Populated by JS ticker -->
  </div>

  <!-- KPI Banner Grid (5 KPIs) -->
  <section class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-4">
    <!-- KPI 1: Active Fleet -->
    <!-- KPI 2: Total Tonnage -->
    <!-- KPI 3: On-Time Rate -->
    <!-- KPI 4: Fuel Efficiency -->
    <!-- KPI 5: Net Dispatch Margin -->
  </section>

  <!-- Main Split Terminal Workspace -->
  <main class="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 px-4 pb-6">
    <!-- Left Section: Multi-Tab Executive Dashboard (8 Cols) -->
    <div class="lg:col-span-8 flex flex-col gap-3">
      <!-- Tabs Nav & Search Bar Bar -->
      <div class="bg-[#111622] rounded-xl border border-slate-800 p-2 flex flex-wrap items-center justify-between gap-3">
        <!-- Navigation Buttons -->
        <nav id="dashboard-tabs-nav" class="flex items-center gap-1">
          <button id="tab-btn-radar" class="...">Radar & HUD</button>
          <button id="tab-btn-drivers" class="...">Workforce (10)</button>
          <button id="tab-btn-shipments" class="...">Active Shipments</button>
          <button id="tab-btn-audit" class="...">Financial Audit</button>
        </nav>
        <!-- Filter Controls -->
        <div class="flex items-center gap-2">
          <input id="global-search-input" type="text" placeholder="Search fleet, ID, cargo..." class="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-44" />
          <select id="status-filter-select" class="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-blue-500">
            <option value="All">All Statuses</option>
            <option value="On Route">On Route</option>
            <option value="Idle">Idle</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      <!-- Tab Content Area -->
      <div id="tab-content-container" class="bg-[#111622] rounded-xl border border-slate-800 p-4 min-h-[460px]">
        <!-- #tab-view-radar -->
        <!-- #tab-view-drivers -->
        <!-- #tab-view-shipments -->
        <!-- #tab-view-audit -->
      </div>
    </div>

    <!-- Right Section: Freight Bidding Ladder + Telemetry Waveform (4 Cols) -->
    <div class="lg:col-span-4 flex flex-col gap-4">
      <!-- High Density Cargo Bidding Ladder -->
      <div id="freight-ladder-panel" class="bg-[#111622] rounded-xl border border-slate-800 p-3.5 flex flex-col">
        <!-- Header, Asks, Spread, Bids, Quick-Bid Inputs -->
      </div>

      <!-- Real-time HTML5 Canvas Telemetry & Fuel Waveform -->
      <div id="telemetry-waveform-panel" class="bg-[#111622] rounded-xl border border-slate-800 p-3.5 flex flex-col relative">
        <!-- Canvas & Crosshair -->
      </div>
    </div>
  </main>
</div>
```

---

## 9. Strict Builder Checklist for Zoro

1. [ ] **File Output:** Build everything inside `index.html` (single-file bundle with Tailwind CDN and vanilla JS for clean pairing and instant browser execution).
2. [ ] **No Dead Buttons:** Every button (`#quick-dispatch-btn`, tab triggers, table action buttons, audio toggle, ladder order buttons, search inputs) MUST have active working listeners.
3. [ ] **Exact Element IDs:** Verify 100% adherence to the Contract IDs in Section 2.1.
4. [ ] **Loop Safety:** In the orderbook rendering and canvas drawing, strictly use incrementing loops (`for (let i = 1; i <= 8; i++)`).
5. [ ] **Sub-pixel Canvases:** Implement proper `window.devicePixelRatio` scaling on both `#fleet-radar-canvas` and `#telemetry-waveform-canvas`.
6. [ ] **Synchronous Render:** Render 10 drivers, 10 shipments, and 10 financial audit records synchronously on `DOMContentLoaded` before running background async fetches.
7. [ ] **Background API:** Fetch Binance/Forex rates with `AbortSignal.timeout(5000)`. Set badge to `"🟢 Live Online Rates"` or fallback cleanly to `"🟡 Offline Seed Mode"`.
8. [ ] **Audio & Toast:** Web Audio API sound generator is ready without external sound assets. Toast container spawns non-intrusive notifications.

---
*Signed and sealed by Nami, System Architect of Straw Hat Crew GROUP1.*
