# APEX VELOCITY: ARCADE RACING LEAGUE
## System Architecture & Technical Contract Specification
**Architect:** Nami (Group 1 - Architect)  
**Target Builder:** Zoro (Group 1 - Builder)  
**Document Version:** 1.0.0 (Production Blueprint)  
**Deliverable Target:** `spec.md`

---

## 1. Executive Summary & Brand Identity

### 1.1 Product Concept: "APEX VELOCITY"
**APEX VELOCITY** is a high-octane, arcade-simulation hybrid car racing game built for the modern web. Inspired by arcade classics (*Ridge Racer*, *OutRun*, *TrackMania*, and *Need for Speed Underground*), APEX VELOCITY features a rich pseudo-3D / projective curvature road physics engine, real-time procedural Web Audio sound synthesis (zero external audio files needed; guarantees 100% reliability), a full garage tuning & livery customization system, 4 global circuit environments with day/sunset/night/cyber weather cycles, AI rival racers with slipstream mechanics, a dynamic drift scoring system, real-time telemetry HUD, and an interactive local leaderboard with ghost splits.

### 1.2 Visual Identity & Palette
- **Primary Brand Red / Velocity Accent:** `#FF2A54` (Apex Scarlet)
- **Secondary Nitro Cyan:** `#00F0FF` (Electric Nitro Cyan)
- **Warning / Tachometer Redline:** `#FFD700` (Tach Gold) / `#FF1744` (Over-rev Red)
- **Dark Surface Backgrounds:**
  - Base Asphalt: `#0D0E12`
  - HUD / Modal Background: `#151821` with `rgba(21, 24, 33, 0.88)` glassmorphism backdrop blur
  - Panel Border / Gridlines: `rgba(255, 255, 255, 0.12)`
  - Active Glow: `box-shadow: 0 0 16px rgba(0, 240, 255, 0.4)`
- **Typography:**
  - Display / Speedometer / Headings: `font-family: 'Rajdhani', 'Impact', sans-serif;` (bold, condensed, aggressive motorsport style)
  - UI Labels & Telemetry: `font-family: 'Chakra Petch', 'Share Tech Mono', monospace;`

---

## 2. System Architecture & Component Diagram

```
+---------------------------------------------------------------------------------------+
|                                    DOM UI LAYER                                       |
|  [Header & Nav] [Garage Drawer] [Settings Modal] [Leaderboard Modal] [Controls Bar]   |
|  [HUD Overlay: Speedometer, Gear, Tach, Nitro Bar, Lap/Pos, Minimap, Drift Banner]    |
+-------------------------------------------+-------------------------------------------+
                                            |
                                 DOM Events & State Sync
                                            |
+-------------------------------------------v-------------------------------------------+
|                                GAME ENGINE CORE (Canvas)                              |
|  +-----------------------+  +-----------------------+  +--------------------------+   |
|  |   Road Math & Curves  |  |  Vehicle Dynamics     |  | AI Competitor Logic      |   |
|  | - Projection formula  |  | - Acceleration, Grip  |  | - 5 AI racers            |   |
|  | - Elevation & Banking |  | - Drift Angle & Smoke |  | - Overtaking & Slipstream|   |
|  | - Segment Looping     |  | - Nitro Boost & Aero  |  | - Position Rank Sorting  |   |
|  +-----------------------+  +-----------------------+  +--------------------------+   |
|  +-----------------------+  +-----------------------+  +--------------------------+   |
|  | Particle System       |  | Web Audio Synthesizer |  | Camera & View System     |   |
|  | - Tire smoke puffs    |  | - Dual-Osc Engine V8  |  | - Chase, Hood, Top-down  |   |
|  | - Nitro blue flame    |  | - Tire Screech Filter |  | - Screen Shake on Impact |   |
|  | - Sparks on barrier   |  | - Turbo Blow-off valve|  | - Speed FOV warping     |   |
|  +-----------------------+  +-----------------------+  +--------------------------+   |
+---------------------------------------------------------------------------------------+
```

---

## 3. Mandatory Pre-Loaded Rich Demo Data

### 3.1 Vehicle Lineup (6 Distinct High-Spec Supercars)
Every vehicle has authentic real-world style specs, distinct physics multipliers, custom engine sound tone parameters, and unique rendering profiles:

```javascript
export const CAR_CATALOG = [
  {
    id: "apex-gtr",
    name: "Apex GT-R 'Ghostline'",
    tier: "S-CLASS",
    category: "Balanced Track Specialist",
    baseColor: "#E6ECEF",
    secondaryColor: "#FF2A54",
    specs: {
      topSpeedKmh: 318,
      accelRate: 8.8,
      handlingGrip: 8.5,
      driftFactor: 7.2,
      nitroCapacity: 100,
      nitroDrainRate: 22
    },
    audioProfile: { basePitch: 68, harmonicRatio: 2.0, revLimit: 8500 },
    description: "Twin-turbocharged all-wheel attack weapon engineered for surgical corner precision and blistering straightaways."
  },
  {
    id: "rotary-shinobi",
    name: "Shinobi RX-7 'Midnight'",
    tier: "A-CLASS",
    category: "Drift Master",
    baseColor: "#111215",
    secondaryColor: "#9D00FF",
    specs: {
      topSpeedKmh: 295,
      accelRate: 8.2,
      handlingGrip: 7.0,
      driftFactor: 9.8,
      nitroCapacity: 110,
      nitroDrainRate: 20
    },
    audioProfile: { basePitch: 84, harmonicRatio: 3.0, revLimit: 9600 },
    description: "High-revving quad-rotor legend designed for smoking sideways drifts with ultra-controllable counter-steering."
  },
  {
    id: "veloce-corsa",
    name: "Scuderia Veloce F40",
    tier: "S-CLASS",
    category: "Hyper Velocity Brawler",
    baseColor: "#E00025",
    secondaryColor: "#FFDD00",
    specs: {
      topSpeedKmh: 342,
      accelRate: 9.4,
      handlingGrip: 7.8,
      driftFactor: 6.5,
      nitroCapacity: 95,
      nitroDrainRate: 25
    },
    audioProfile: { basePitch: 60, harmonicRatio: 2.2, revLimit: 8800 },
    description: "Mid-engine Italian titanium monster boasting uncompromised top velocity and explosive straight-line acceleration."
  },
  {
    id: "cyber-hyperion",
    name: "Hyperion Volt EV-X",
    tier: "S-CLASS",
    category: "Instant Torque Prototype",
    baseColor: "#051622",
    secondaryColor: "#00F0FF",
    specs: {
      topSpeedKmh: 325,
      accelRate: 9.9,
      handlingGrip: 9.1,
      driftFactor: 6.0,
      nitroCapacity: 130,
      nitroDrainRate: 30
    },
    audioProfile: { basePitch: 120, harmonicRatio: 1.5, revLimit: 12000, isElectric: true },
    description: "Quad-motor electric titan delivering immediate instantaneous G-forces with computerized active aerodynamics."
  },
  {
    id: "muscle-brawler",
    name: "Thunder V8 'Havoc 69'",
    tier: "B-CLASS",
    category: "Raw American Muscle",
    baseColor: "#1E272C",
    secondaryColor: "#FF6200",
    specs: {
      topSpeedKmh: 305,
      accelRate: 9.0,
      handlingGrip: 6.4,
      driftFactor: 8.9,
      nitroCapacity: 120,
      nitroDrainRate: 28
    },
    audioProfile: { basePitch: 46, harmonicRatio: 1.8, revLimit: 6800 },
    description: "Supercharged 8.4-liter roaring behemoth with massive wheelspin, wide drift angles, and earth-shattering torque."
  },
  {
    id: "phantom-valkyrie",
    name: "Phantom Valkyrie LM",
    tier: "HYPER",
    category: "Le Mans Prototype",
    baseColor: "#003B46",
    secondaryColor: "#00F296",
    specs: {
      topSpeedKmh: 355,
      accelRate: 9.7,
      handlingGrip: 9.6,
      driftFactor: 6.8,
      nitroCapacity: 105,
      nitroDrainRate: 24
    },
    audioProfile: { basePitch: 72, harmonicRatio: 2.4, revLimit: 10500 },
    description: "Pure carbon monocoque endurance prototype engineered for extreme downforce and hairpin turn dominance."
  }
];
```

### 3.2 Race Circuits (4 Global Tracks with Distinct Road Profiles)
```javascript
export const TRACK_CATALOG = [
  {
    id: "tokyo-expressway",
    name: "Tokyo Night Expressway",
    location: "Tokyo, Japan",
    theme: "neon-night",
    difficulty: "Medium",
    laps: 3,
    lengthMeters: 4200,
    skyGradient: ["#050510", "#101028", "#1F1538"],
    roadColor: "#1A1C23",
    rumbleColors: ["#FF2A54", "#FFFFFF"],
    ambientLighting: "#8030FF",
    features: "Neon skyscrapers, overhead LED gantries, high-speed overpass sweepers",
    curveDifficulty: 6,
    elevationVariance: 4
  },
  {
    id: "redrock-canyon",
    name: "Red Rock Canyon Pass",
    location: "Nevada, USA",
    theme: "sunset-canyon",
    difficulty: "Hard",
    laps: 3,
    lengthMeters: 5100,
    skyGradient: ["#2B0C06", "#73240F", "#DE6B23"],
    roadColor: "#251F1E",
    rumbleColors: ["#FFD700", "#FFFFFF"],
    ambientLighting: "#FF6A00",
    features: "Steep elevation changes, double-apex canyon hairpin bends, rocky dust",
    curveDifficulty: 9,
    elevationVariance: 9
  },
  {
    id: "alpine-ridge",
    name: "Glacier Alpine Ridge",
    location: "Swiss Alps",
    theme: "snow-daylight",
    difficulty: "Expert",
    laps: 3,
    lengthMeters: 4800,
    skyGradient: ["#0C2340", "#28537C", "#8CA6C1"],
    roadColor: "#22262B",
    rumbleColors: ["#00F0FF", "#EBF5FF"],
    ambientLighting: "#60A5FA",
    features: "Snowy roadside banks, icy low-grip sections, sheer drop cliffs",
    curveDifficulty: 8,
    elevationVariance: 7
  },
  {
    id: "cyber-grid-2099",
    name: "Neo Sector 2099",
    location: "Orbital Habitat Neo-01",
    theme: "cyber-grid",
    difficulty: "Insane",
    laps: 3,
    lengthMeters: 5500,
    skyGradient: ["#000000", "#030A14", "#0C1E3A"],
    roadColor: "#080F18",
    rumbleColors: ["#00F0FF", "#FF007F"],
    ambientLighting: "#00F0FF",
    features: "Holographic barriers, magnetic speed-booster strips, zero-gravity dip",
    curveDifficulty: 10,
    elevationVariance: 10
  }
];
```

### 3.3 Default Leaderboard & Hall of Fame Data
Pre-loaded with 8 realistic ghost records:
```javascript
export const DEFAULT_LEADERBOARD = [
  { rank: 1, driver: "Hiroshi 'Kansei' Sato", carId: "rotary-shinobi", trackId: "tokyo-expressway", bestLap: "1:08.412", driftScore: 48200, date: "2025-02-14" },
  { rank: 2, driver: "Elena 'Viper' Vance", carId: "veloce-corsa", trackId: "tokyo-expressway", bestLap: "1:09.104", driftScore: 32400, date: "2025-02-13" },
  { rank: 3, driver: "Marcus 'Nitro' Cole", carId: "apex-gtr", trackId: "tokyo-expressway", bestLap: "1:09.890", driftScore: 41100, date: "2025-02-12" },
  { rank: 4, driver: "Kaelen Voss (AI)", carId: "cyber-hyperion", trackId: "tokyo-expressway", bestLap: "1:10.550", driftScore: 28900, date: "2025-02-11" },
  { rank: 5, driver: "Jax 'Iron' Cooper", carId: "muscle-brawler", trackId: "redrock-canyon", bestLap: "1:18.230", driftScore: 56300, date: "2025-02-14" },
  { rank: 6, driver: "Silvia Chevalier", carId: "phantom-valkyrie", trackId: "redrock-canyon", bestLap: "1:19.410", driftScore: 34100, date: "2025-02-10" },
  { rank: 7, driver: "Ralf 'Frost' Weber", carId: "apex-gtr", trackId: "alpine-ridge", bestLap: "1:22.180", driftScore: 39800, date: "2025-02-14" },
  { rank: 8, driver: "Nyx-09 Cybermind", carId: "cyber-hyperion", trackId: "cyber-grid-2099", bestLap: "1:14.390", driftScore: 62000, date: "2025-02-14" }
];
```

---

## 4. Complete DOM Element ID Matrix & Hierarchy

Every single interactive control, gauge, panel, button, slider, and modal MUST have the exact IDs specified below:

| DOM Element ID | HTML Tag | Role / Description | Event Handler / Functional Action |
|---|---|---|---|
| `#app-root` | `div` | Main outer container | Container frame for canvas and HUD layers |
| `#canvas-game` | `canvas` | Primary 60FPS render viewport | Mouse/touch canvas listener, resize listener |
| `#canvas-minimap` | `canvas` | Radar circuit minimap overlay | Renders player & 5 AI blips in real time |
| `#top-nav-bar` | `header` | Global brand bar and navigation | Houses logo, active car preview, mode triggers |
| `#brand-logo` | `div` | Brand clickable reset / title | Resets to main title screen / race hub |
| `#btn-quick-race` | `button` | Starts instant race with current selection | Switches game state to `COUNTDOWN` -> `RACING` |
| `#btn-open-garage` | `button` | Opens the tuning & customization drawer | Toggles `#garage-drawer` class `.open` |
| `#btn-open-tracks` | `button` | Opens circuit selector modal | Opens `#track-modal` |
| `#btn-open-leaderboard` | `button` | Opens leaderboard / hall of fame modal | Opens `#leaderboard-modal` |
| `#btn-open-settings` | `button` | Opens sound, controls & graphics modal | Opens `#settings-modal` |
| `#btn-open-help` | `button` | Shows keyboard & gamepad control map | Opens `#help-modal` |
| `#hud-container` | `div` | In-race overlay container | Displayed during racing / time attack |
| `#hud-speedometer-val` | `span` | Speed display text (e.g. `245`) | Updated on every frame from player physics |
| `#hud-speedometer-unit` | `span` | KM/H or MPH indicator | Toggled via settings unit preference |
| `#hud-tachometer-needle`| `div` | Dynamic rotating tachometer needle | Rotates 0° to 240° based on RPM |
| `#hud-tachometer-bar` | `div` | Dynamic RPM LED segmented meter | Fills proportional to `engineRpm / maxRpm` |
| `#hud-gear-val` | `span` | Current gear indicator (`1` to `6`, `R`) | Updates based on vehicle speed & ratio |
| `#hud-nitro-fill` | `div` | Nitro boost gauge bar | Scales width 0% to 100% |
| `#hud-nitro-status` | `span` | Nitro ready/depleted text badge | Shows `READY`, `BOOSTING`, or `EMPTY` |
| `#hud-drift-banner` | `div` | Floating drift combo banner | Displays when drift angle > 15° with points |
| `#hud-drift-points` | `span` | Real-time counting drift points | Counts accumulated drift points with combo mult |
| `#hud-drift-mult` | `span` | Drift multiplier text (e.g. `x2.5`) | Increments with continuous drift duration |
| `#hud-lap-counter` | `span` | Current lap indicator (`LAP 1/3`) | Increments on segment loop crossing |
| `#hud-position-rank` | `span` | Race ranking indicator (`1st`, `2nd`..)| Computed against 5 AI competitor distances |
| `#hud-timer-current` | `span` | Current active lap stopwatch | `MM:SS.mmm` formatted timer |
| `#hud-timer-best` | `span` | Best lap stopwatch | Shows track personal/session best |
| `#hud-slipstream-alert`| `div` | Slipstream drafting visual indicator | Displays `DRAFTING +15 KM/H` when behind AI |
| `#btn-hud-pause` | `button` | In-race pause toggle button | Pauses physics, opens `#pause-overlay` |
| `#btn-hud-camera` | `button` | Toggles camera mode (Chase / Hood / Cam) | Cycles `cameraMode` index |
| `#btn-hud-mute` | `button` | Audio master mute quick toggle | Mutes / unmutes Web Audio master gain node |
| `#pause-overlay` | `div` | Paused race modal dialog | Shown when game is paused |
| `#btn-pause-resume` | `button` | Resumes paused race | Restores game loop timestamp |
| `#btn-pause-restart` | `button` | Restarts current race circuit | Resets player & AI positions to start grid |
| `#btn-pause-garage` | `button` | Returns from pause to garage | Changes state to `GARAGE` |
| `#btn-pause-quit` | `button` | Quits race to Main Hub | Resets race state, returns to menu |
| `#race-finish-modal` | `div` | Finish podium & lap summary dialog | Displayed when player completes all 3 laps |
| `#finish-position-title`| `h2` | Finish placement title (`VICTORY - 1st`)| Color-coded podium heading |
| `#finish-total-time` | `span` | Total race elapsed time | Formatted finish duration |
| `#finish-best-lap` | `span` | Fastest lap record achieved | Highlighted best lap |
| `#finish-drift-score` | `span` | Total drift score accumulated | Awarded drift points sum |
| `#btn-finish-restart` | `button` | Race again button on finish modal | Restarts circuit instantly |
| `#btn-finish-next` | `button` | Advance to next circuit button | Loads next track in catalog |
| `#btn-finish-hub` | `button` | Return to main menu hub | Closes finish modal |
| `#garage-drawer` | `aside` | Sliding vehicle customization panel | Contains car carousel, stats, paint pickers |
| `#btn-garage-close` | `button` | Closes garage panel | Slides `#garage-drawer` away |
| `#garage-car-prev` | `button` | Select previous car in catalog | Updates `selectedCarIndex--` |
| `#garage-car-next` | `button` | Select next car in catalog | Updates `selectedCarIndex++` |
| `#garage-car-name` | `h3` | Selected vehicle name | Displays current car name |
| `#garage-car-category`| `span` | Selected vehicle category/tier | Displays e.g. "Drift Master - A-CLASS" |
| `#garage-car-desc` | `p` | Selected vehicle description text | Brief vehicle bio |
| `#stat-bar-speed` | `div` | Vehicle top speed progress fill | Width proportional to vehicle top speed |
| `#stat-bar-accel` | `div` | Vehicle acceleration fill | Width proportional to vehicle accel |
| `#stat-bar-handling` | `div` | Vehicle handling/grip fill | Width proportional to vehicle grip |
| `#stat-bar-drift` | `div` | Vehicle drift ability fill | Width proportional to vehicle drift factor |
| `#color-picker-primary`| `input` | HTML5 color picker for primary paint | Updates `playerCar.baseColor` & redraws 3D car |
| `#color-picker-accent` | `input` | HTML5 color picker for racing stripes | Updates `playerCar.secondaryColor` |
| `#color-picker-neon` | `input` | HTML5 color picker for underglow | Updates `playerCar.underglowColor` |
| `#select-tire-compound`| `select` | Dropdown: Grip / Drift / Balanced | Adjusts friction coefficient & drift threshold |
| `#select-nitro-boost` | `select` | Dropdown: Standard / Extended / Instant | Adjusts nitro drain vs boost intensity |
| `#track-modal` | `div` | Circuit selection modal dialog | Displays 4 track cards with previews & weather |
| `#btn-track-close` | `button` | Closes track modal | Dismisses `#track-modal` |
| `#track-cards-grid` | `div` | Grid container for 4 track cards | Click on card selects track and starts race |
| `#leaderboard-modal` | `div` | Hall of Fame modal | Displays high scores, best laps, drift scores |
| `#btn-leaderboard-close`| `button`| Closes leaderboard modal | Dismisses `#leaderboard-modal` |
| `#leaderboard-filter-track`| `select` | Filter records by track | Re-renders table filtered by trackId |
| `#leaderboard-table-body`| `tbody` | Dynamic table rows of records | Populated from `leaderboardData` |
| `#btn-leaderboard-reset`| `button` | Reset scores to factory default | Clears localStorage and restores defaults |
| `#settings-modal` | `div` | Settings dialog | Audio volume sliders, controls, quality |
| `#btn-settings-close` | `button` | Closes settings modal | Dismisses `#settings-modal` |
| `#slider-vol-master` | `input` | Master volume range slider (0 - 100) | Sets Web Audio master gain level |
| `#slider-vol-engine` | `input` | Engine synth volume range slider | Sets engine oscillator gain |
| `#slider-vol-sfx` | `input` | Tire screech, nitro & sparks volume | Sets SFX gain node |
| `#toggle-audio-mute` | `input` | Audio mute checkbox toggle | Mutes all audio if checked |
| `#select-camera-view` | `select` | Default camera view selector | Chase Cam / Hood Cam / Arcade Bird's Eye |
| `#select-unit-system` | `select` | Unit dropdown: KM/H or MPH | Sets speed conversion multiplier |
| `#select-graphics-qual`| `select` | Graphics quality: Ultra / High / Low | Toggles road draw distance & particle density |
| `#help-modal` | `div` | Controls cheatsheet dialog | Shows keyboard / touch bindings |
| `#btn-help-close` | `button` | Closes help modal | Dismisses `#help-modal` |
| `#touch-controls-bar` | `div` | Touch buttons for mobile/tablet | Visible on touch-supported screens |
| `#btn-touch-steer-left`| `button` | On-screen steer left touch button | Dispatches `steerLeft = true/false` |
| `#btn-touch-steer-right`| `button`| On-screen steer right touch button | Dispatches `steerRight = true/false` |
| `#btn-touch-accelerate`| `button` | On-screen gas pedal touch button | Dispatches `accelerate = true/false` |
| `#btn-touch-brake` | `button` | On-screen brake pedal touch button | Dispatches `brake = true/false` |
| `#btn-touch-nitro` | `button` | On-screen nitro boost button | Dispatches `nitro = true/false` |
| `#toast-notification` | `div` | Floating toast alert element | Displays unlocked records, boost messages |

---

## 5. Technical Architecture & Physics Specifications

### 5.1 Projective Road Mathematics (Lou's 2.5D Road Algorithm)
To achieve smooth, authentic arcade racing at locked 60FPS across all devices without relying on heavy external 3D libraries (Three.js/WebGL asset downloads that can fail), APEX VELOCITY uses a precision mathematical projective road system:
1. **Segment Representation:**
   The track is divided into `N` road segments (typically 1,600 to 2,200 segments). Each segment has:
   ```javascript
   interface RoadSegment {
     index: number;
     p1: { world: { x: number, y: number, z: number }, screen: { x: number, y: number, w: number, scale: number } };
     p2: { world: { x: number, y: number, z: number }, screen: { x: number, y: number, w: number, scale: number } };
     curve: number;           // Lateral curvature (-4 to +4)
     hill: number;            // Vertical elevation delta
     color: { road: string, grass: string, rumble: string, lane: string };
     sprites: Array<RoadDecoration>; // Trees, neon pylons, rock arches, distance markers
     clipY: number;           // Screen vertical occlusion clipping
   }
   ```
2. **Perspective Projection Formula:**
   For a camera positioned at `(cameraX, cameraY, cameraZ)`:
   ```javascript
   function project(point, cameraX, cameraY, cameraZ, cameraDepth, screenWidth, screenHeight, roadWidth) {
     const transX = point.x - cameraX;
     const transY = point.y - cameraY;
     const transZ = point.z - cameraZ;
     
     const scale = cameraDepth / transZ;
     const screenX = Math.round((screenWidth / 2) + (scale * transX * screenWidth / 2));
     const screenY = Math.round((screenHeight / 2) - (scale * transY * screenHeight / 2));
     const screenW = Math.round(scale * roadWidth * screenWidth / 2);
     
     return { screenX, screenY, screenW, scale };
   }
   ```
3. **Curvature & Banking:**
   When rounding curves, road segments apply a smooth lateral banking factor `tangentBanking` to simulate centrifugal force. The player vehicle is rendered with dynamic body lean (`rollAngle`), animated tire angle, and underglow reflection on the asphalt.

### 5.2 Vehicle Physics & Drift Mechanics
The vehicle dynamics model simulates realistic arcade weight transfer:
- **Forward Acceleration:**
  $$v_{t+1} = v_t + \left(a_{\text{engine}} \cdot \text{gearRatio} \cdot \Delta t\right) - \left(C_{\text{drag}} \cdot v_t^2 \cdot \Delta t\right) - \left(C_{\text{rolling}} \cdot \Delta t\right)$$
- **Braking & Reverse:**
  $$v_{t+1} = \max\left(0, v_t - d_{\text{brake}} \cdot \Delta t\right)$$
- **Drift Initiation & Dynamics:**
  When speed exceeds $70\text{ km/h}$, pressing `[Space]` (Handbrake) or executing a sharp steering reversal initiates **Drift Mode**:
  - Longitudinal tire friction drops by $35\%$.
  - Lateral tire slip angle $\theta_{\text{slip}}$ increases.
  - Car sprite rotates sideways by drift angle (up to $\pm 38^\circ$).
  - Particle engine spawns dual white tire smoke and asphalt skid marks.
  - Drift combo counter starts accumulating: $\text{Points} = \text{Points} + (\text{Speed} \cdot |\theta_{\text{slip}}| \cdot \text{Multiplier} \cdot \Delta t)$.
  - Multiplier grows from $1.0\times$ up to $4.0\times$ for continuous sustained drift without clipping road barriers.
- **Nitro Boost Injection:**
  - Pressing `[Shift]` or `[N]` injects nitro.
  - Accelerates vehicle to $125\%$ of normal top speed.
  - Draws blue twin flame particles from dual exhaust tailpipes.
  - Activates camera radial speed blur / FOV warping (camera moves closer, road FOV widens).
  - Drains `#hud-nitro-fill` at rate specified in vehicle data.
  - Recharges gradually through high-speed drafting and drift combo completions.
- **Slipstream Drafting System:**
  When the player is positioned within $\pm 0.35$ lateral road units and $50$ to $350$ meters directly behind an AI competitor, drafting activates:
  - HUD displays `#hud-slipstream-alert` with an aerodynamic wind trail effect.
  - Aerodynamic drag is reduced by $45\%$, providing an additional $+18\text{ km/h}$ overtake surge.

### 5.3 Web Audio Procedural Sound Synthesizer (Zero External Dependencies)
To guarantee audio never breaks due to 404s or network dropouts, APEX VELOCITY features an internal procedural sound synthesizer powered by the native browser `AudioContext`:
1. **Engine Synthesizer:**
   - Two `OscillatorNode`s: Primary (Sawtooth wave for harsh cylinder firing) and Secondary (Triangle wave for low-frequency exhaust rumble).
   - Dynamic frequency modulation linked directly to vehicle RPM:
     $$f_{\text{osc}} = f_{\text{base}} + \left(\frac{\text{rpm}}{\text{maxRpm}}\right) \cdot f_{\text{range}}$$
   - Lowpass `BiquadFilterNode` opening up with throttle position to simulate intake manifold breathing.
2. **Tire Screech SFX:**
   - Procedural White Noise buffer modulated through a resonant bandpass filter centered at $1,200\text{ Hz}$ to $2,400\text{ Hz}$.
   - Amplitude gain directly proportional to drift slip angle and asphalt surface friction.
3. **Turbo Blow-Off Valve (Hiss):**
   - Highpass filtered burst of white noise with exponential decay triggered whenever throttle is lifted at high RPM.
4. **Nitro Jet SFX:**
   - Low rumble noise mixed with a $440\text{ Hz}$ rising sine tone simulating pressurized nitrous oxide injection.
5. **Collision Impact SFX:**
   - Damped low-pitch sine thud combined with noise burst and screen shake.
6. **UI & Race Beeps:**
   - Countdown sequence: 3 short $440\text{ Hz}$ sine beeps followed by a high $880\text{ Hz}$ "GO!" beep.

---

## 6. Complete Data Models & State Schema

### 6.1 Game Engine State Model
```typescript
interface GameEngineState {
  mode: 'MENU' | 'COUNTDOWN' | 'RACING' | 'PAUSED' | 'FINISHED';
  selectedCarIndex: number;
  selectedTrackIndex: number;
  cameraMode: 'CHASE' | 'HOOD' | 'TOP_DOWN';
  cameraSettings: {
    fov: number;
    height: number;
    distance: number;
    shake: number;
  };
  player: {
    x: number;               // Lateral position (-1.0 to 1.0, where 0 is center)
    y: number;               // Vertical height (world space)
    z: number;               // Distance down the track (meters/units)
    speed: number;           // Current forward speed (units/frame)
    speedKmh: number;        // Formatted display speed
    rpm: number;             // 1000 to 9500 RPM
    gear: number;            // 1 to 6, or 0 (Reverse)
    driftAngle: number;      // Current slip angle in degrees
    isDrifting: boolean;     // Active drift state flag
    driftPoints: number;     // Running total drift score
    driftMultiplier: number; // 1.0x to 4.0x
    nitroFuel: number;       // 0 to 100%
    isBoosting: boolean;     // Active nitro flag
    isDrafting: boolean;     // Active slipstream flag
    currentLap: number;      // 1 to maxLaps
    lapStartTime: number;    // Epoch ms when current lap began
    bestLapTime: number | null; // Fastest lap in current race
    totalRaceTime: number;   // Cumulative race ms
    rank: number;            // Current position (1 to 6)
    offRoadPenalty: number;  // Friction slowdown factor if grass/dirt
  };
  rivals: Array<{
    id: string;
    name: string;
    carId: string;
    x: number;
    z: number;
    speed: number;
    color: string;
    laneOffset: number;
    targetSpeed: number;
    passedByPlayer: boolean;
  }>;
  audio: {
    initialized: boolean;
    isMuted: boolean;
    masterVolume: number;
    engineVolume: number;
    sfxVolume: number;
  };
  settings: {
    unitSystem: 'KMH' | 'MPH';
    graphicsQuality: 'ULTRA' | 'HIGH' | 'LOW';
  };
}
```

---

## 7. Event Handler Signatures & Control Interface

Zoro MUST implement the following precise event handlers with exact signatures to guarantee zero dead buttons:

```javascript
// --- Navigation & Modal Event Handlers ---
function handleStartQuickRace(): void;
function handleOpenGarage(): void;
function handleCloseGarage(): void;
function handleOpenTrackModal(): void;
function handleCloseTrackModal(): void;
function handleSelectTrack(trackIndex: number): void;
function handleOpenLeaderboard(): void;
function handleCloseLeaderboard(): void;
function handleFilterLeaderboard(trackId: string): void;
function handleResetLeaderboard(): void;
function handleOpenSettings(): void;
function handleCloseSettings(): void;
function handleOpenHelp(): void;
function handleCloseHelp(): void;

// --- Garage Tuning & Livery Event Handlers ---
function handleGarageNextCar(): void;
function handleGaragePrevCar(): void;
function handleSelectCarByIndex(index: number): void;
function handlePrimaryColorChange(hexColor: string): void;
function handleAccentColorChange(hexColor: string): void;
function handleNeonColorChange(hexColor: string): void;
function handleTireCompoundChange(compound: 'grip' | 'drift' | 'balanced'): void;
function handleNitroBoostTypeChange(nitroType: 'standard' | 'extended' | 'instant'): void;

// --- In-Race Control & HUD Event Handlers ---
function handlePauseRace(): void;
function handleResumeRace(): void;
function handleRestartRace(): void;
function handleQuitRaceToMenu(): void;
function handleCycleCameraView(): void;
function handleToggleAudioMute(): void;

// --- Settings Event Handlers ---
function handleMasterVolumeInput(value: number): void;
function handleEngineVolumeInput(value: number): void;
function handleSfxVolumeInput(value: number): void;
function handleUnitSystemChange(unit: 'KMH' | 'MPH'): void;
function handleGraphicsQualityChange(quality: 'ULTRA' | 'HIGH' | 'LOW'): void;

// --- Race Finish Modal Handlers ---
function handleFinishRestart(): void;
function handleFinishNextTrack(): void;
function handleFinishReturnToHub(): void;

// --- Keyboard & Touch Input Listeners ---
function handleKeyDown(event: KeyboardEvent): void;
function handleKeyUp(event: KeyboardEvent): void;
function handleTouchSteer(direction: 'left' | 'right', isPressed: boolean): void;
function handleTouchThrottle(isPressed: boolean): void;
function handleTouchBrake(isPressed: boolean): void;
function handleTouchNitro(isPressed: boolean): void;
```

---

## 8. Detailed Step-by-Step Implementation Contract for Zoro (Builder)

To ensure rapid, clean execution and 100% bug-free delivery, Zoro must follow this structured plan:

### Step 1: HTML Architecture & Layout Foundation
- Build single-page application structure with `#app-root`.
- Insert primary `<canvas id="canvas-game">` filling the viewport.
- Insert secondary `<canvas id="canvas-minimap">` anchored to top-left HUD.
- Insert the persistent `#top-nav-bar` with active car preview and menu action buttons.
- Insert comprehensive in-game `#hud-container` (speedometer, tachometer, nitro meter, lap counter, drift points, slipstream alert, quick camera and pause toggles).
- Insert `#garage-drawer` aside with car carousel, performance gauges, and interactive color pickers.
- Insert `#track-modal` with 4 circuit cards displaying stats, weather, and thumbnail diagrams.
- Insert `#leaderboard-modal`, `#settings-modal`, `#help-modal`, `#pause-overlay`, and `#race-finish-modal`.
- Insert `#touch-controls-bar` for mobile/tablet responsive touch support.
- Insert `#toast-notification` container.

### Step 2: Styling, Glassmorphism & Visual Aesthetics
- Apply dark motorsport theme with `#0D0E12` base asphalt and `#151821` translucent glass panels.
- Configure glowing neon accents (`#FF2A54` and `#00F0FF`).
- Design an analog/digital tachometer gauge with CSS rotation animations and LED RPM bars that flash red at redline (>8500 RPM).
- Style track cards with gradient backdrops reflecting Tokyo neon, Sunset Canyon, Alpine Ridge, and Cyber 2099.
- Ensure all modals have smooth backdrop blur and spring scale transitions.

### Step 3: Web Audio Procedural Engine Implementation
- Implement `SoundEngine` class initializing an `AudioContext` on user interaction.
- Create dual oscillators for vehicle engine sound (Sawtooth + Triangle) passing through a resonant lowpass filter.
- Create white noise buffer generators for tire screech (bandpass filter) and turbo blow-off valve.
- Create synthesized countdown beeps (`440 Hz`, `880 Hz`) and victory fanfare chords.
- Provide full volume sliders for Master, Engine, and SFX with mute toggle.

### Step 4: Road Mathematics & Render Loop
- Generate road segments with sinusoidal curves and hill crests/dips.
- Implement Lou's projection algorithm mapping 3D road points to 2D canvas polygons.
- Render road asphalt with alternating rumble strips, lane markings, roadside trees/streetlights, horizon hills, and dynamic sky gradient.
- Render 5 AI rival cars traveling the circuit with dynamic overtaking and collision avoidance.
- Render the player's car with high-fidelity canvas 2D vectors: body chassis, shaded rear windshield, rear spoiler, glowing taillights, dual exhaust tips with nitro flames, and dynamic tire smoke particles.

### Step 5: Vehicle Physics, Drifting, Nitro & Collisions
- Implement responsive acceleration, braking, friction, and gear shifting (1st through 6th).
- Implement handbrake drift mechanics: lateral drift angle, tire smoke particle emission, skid marks, and real-time drift score multiplier.
- Implement slipstream drafting mechanics behind AI cars with speed boost and wind streak visuals.
- Implement nitro boost mechanics with blue exhaust flames, camera FOV stretch, and fuel consumption.
- Implement collision bounds against road edges and AI vehicles with screen shake and SFX thud.

### Step 6: Circuit Minimap, Lap Timer & Leaderboards
- Render circuit path on `#canvas-minimap` with player dot (red/cyan) and 5 AI dots (white/orange).
- Track lap checkpoints, detect finish line crossings, compute sector splits, and update `#hud-lap-counter`.
- Implement race finish logic: display finish modal with placement, total time, fastest lap, and drift score.
- Save personal best records to `localStorage`, integrated with preloaded leaderboard demo data.

### Step 7: Garage Customization & Tuning Integration
- Allow live switching between all 6 supercars.
- Connect `#color-picker-primary`, `#color-picker-accent`, and `#color-picker-neon` to instantly recolor the car chassis, racing stripes, and underglow.
- Connect tire compound and nitro boost dropdowns to directly modify grip and acceleration physics constants.

### Step 8: Quality Assurance & Zero-Dead-Button Verification
- Verify every button has an active event listener and performs its intended state update.
- Verify pause, resume, restart, and quit cycles operate seamlessly without breaking audio or the canvas animation loop.
- Test keyboard controls (`W/A/S/D`, `Arrow Keys`, `Space`, `Shift`, `C`, `P`, `M`) and on-screen touch buttons.

---

## 9. Verification & Architectural Guarantee

By following this specification, the straw hat builder (Zoro) will have:
1. Exact matching IDs for all HTML elements and JavaScript listeners.
2. Complete data structures pre-loaded with authentic supercars, circuits, and leaderboard drivers.
3. Completely self-contained procedural sound synthesis eliminating broken asset dependencies.
4. An engaging, high-performance racing experience that delivers responsive physics, dynamic drifting, and slick visuals.

**Nami (Group 1 - Architect) has signed off on this specification.**
