# 🏴‍☠️ STRAW HAT CREW - GROUP 1: SYSTEM & DATA ARCHITECTURE SPECIFICATION
**Author:** Nami (Navigator & System/Data Architect)  
**Target Implementer:** Zoro (Builder)  
**Project:** Ludo Grand Master - Interactive Board Game with Dice Roll & Score Tracking  
**File:** `spec.md`  
**Status:** FROZEN & READY FOR IMPLEMENTATION (No placeholders, No TODOs)

---

## 1. ARCHITECTURE OVERVIEW

The application is a client-side, zero-dependency modern Ludo board game built with standard HTML5, CSS3, and ES6+ JavaScript. It features a full 15x15 classic Ludo board, 3D animated dice rolling, interactive token movement, intelligent automated AI option, multi-metric score tracking, real-time activity log, and audio-visual feedback.

### Key Pillars
1. **Grid Engine (15×15 Coordinate Space):** The board uses a strict 15×15 coordinate grid mapping yards, track tiles, safe havens, home stretches, and central victory triangle.
2. **Deterministic State Machine:** Centralized `GameState` containing turn cycle, dice values, token states, player stats, and historical move logs.
3. **Strict DOM Contract:** Every interactive and display element has a mandatory, unique ID designated below. Zoro must NOT alter these IDs.
4. **Move Validation Engine:** Automatically computes valid moves for all 4 tokens of the active player on every roll. Auto-moves if only 1 valid move exists; requires selection if multiple exist; auto-skips turn if 0 valid moves exist.

---

## 2. EXACT DOM ELEMENT ID CONTRACT

Every element below must appear in the markup with the EXACT id specified.

### 2.1 Game Shell & Header
| Element ID | Tag | Purpose |
|---|---|---|
| `#app-container` | `div` | Master flex/grid wrapper for entire application |
| `#game-header` | `header` | Header banner containing logo, title, and quick controls |
| `#game-title` | `h1` | Title text display ("LUDO GRAND MASTER") |
| `#btn-sound-toggle` | `button` | Toggle mute/unmute audio effects |
| `#btn-rules-toggle` | `button` | Open rules and scoring modal |
| `#btn-reset-game` | `button` | Quick restart current game with same player setup |
| `#btn-new-game-modal` | `button` | Open modal to reconfigure players/bot settings |

### 2.2 Game Setup & Configuration Modal
| Element ID | Tag | Purpose |
|---|---|---|
| `#setup-modal` | `div` | Overlay modal for initial game configuration |
| `#setup-player-count` | `select` | Dropdown for 2, 3, or 4 players (`2`, `3`, `4`) |
| `#p-red-type` | `select` | Player Red type: `"human"` or `"bot"` |
| `#p-green-type` | `select` | Player Green type: `"human"` or `"bot"` |
| `#p-yellow-type` | `select` | Player Yellow type: `"human"` or `"bot"` |
| `#p-blue-type` | `select` | Player Blue type: `"human"` or `"bot"` |
| `#btn-start-game` | `button` | Starts new game with selected config |

### 2.3 Turn & Dice Control Panel
| Element ID | Tag | Purpose |
|---|---|---|
| `#control-panel` | `aside` | Side/bottom panel housing turn indicator, dice, and actions |
| `#current-turn-badge` | `div` | Colored badge highlighting current active player |
| `#current-player-name` | `span` | Text displaying active player's name (e.g. "Red's Turn") |
| `#turn-timer-bar` | `div` | Visual progress bar for 15s turn countdown |
| `#dice-stage` | `div` | 3D perspective viewport for the rolling cube |
| `#dice-cube` | `div` | 3D CSS cube element containing 6 pip faces |
| `#btn-roll-dice` | `button` | Clickable button to initiate dice roll |
| `#dice-result-value` | `span` | Text readout of the rolled number (1-6) |
| `#turn-instructions` | `p` | Guidance text (e.g. "Roll the dice!", "Select token to move", "Rolled 6! Roll again") |

### 2.4 Ludo Board Container
| Element ID | Tag | Purpose |
|---|---|---|
| `#board-wrapper` | `main` | Centered responsive wrapper maintaining 1:1 aspect ratio |
| `#ludo-board` | `div` | 15×15 CSS Grid element representing the game board |
| `#home-yard-red` | `div` | Yard zone for Red player (Top-Left 6x6) |
| `#home-yard-green` | `div` | Yard zone for Green player (Top-Right 6x6) |
| `#home-yard-yellow` | `div` | Yard zone for Yellow player (Bottom-Right 6x6) |
| `#home-yard-blue` | `div` | Yard zone for Blue player (Bottom-Left 6x6) |
| `#center-goal` | `div` | Center goal zone (3x3 intersection at coordinates 6,6 to 8,8) |

#### Token DOM IDs (16 Tokens Total: 4 per color)
* Red tokens: `#token-red-0`, `#token-red-1`, `#token-red-2`, `#token-red-3`
* Green tokens: `#token-green-0`, `#token-green-1`, `#token-green-2`, `#token-green-3`
* Yellow tokens: `#token-yellow-0`, `#token-yellow-1`, `#token-yellow-2`, `#token-yellow-3`
* Blue tokens: `#token-blue-0`, `#token-blue-1`, `#token-blue-2`, `#token-blue-3`

*Each token element must also have classes: `.ludo-token`, `.token-[color]`, and data attributes `data-color="[color]"` and `data-index="[0-3]"`. When selectable, class `.token-selectable` is appended.*

### 2.5 Scoreboard & Statistics Hub
| Element ID | Tag | Purpose |
|---|---|---|
| `#scoreboard-section` | `section` | Container for live player scorecards |
| `#scorecard-red` | `div` | Player Red status card |
| `#scorecard-green` | `div` | Player Green status card |
| `#scorecard-yellow` | `div` | Player Yellow status card |
| `#scorecard-blue` | `div` | Player Blue status card |
| Score Sub-element IDs (Pattern: `#stat-[color]-[metric]`): | | |
| `#stat-red-score`, `#stat-green-score`, `#stat-yellow-score`, `#stat-blue-score` | `span` | Total calculated score |
| `#stat-red-home`, `#stat-green-home`, `#stat-yellow-home`, `#stat-blue-home` | `span` | Tokens reached home (e.g. "0/4") |
| `#stat-red-kills`, `#stat-green-kills`, `#stat-yellow-kills`, `#stat-blue-kills` | `span` | Opponent tokens knocked out (captures) |
| `#stat-red-steps`, `#stat-green-steps`, `#stat-yellow-steps`, `#stat-blue-steps` | `span` | Total distance traveled by all tokens |

### 2.6 Activity Log / Event Stream
| Element ID | Tag | Purpose |
|---|---|---|
| `#game-log-container` | `section` | Scrollable feed of match events |
| `#game-log-list` | `ul` | Unordered list of time-stamped play-by-play logs |
| `#btn-clear-log` | `button` | Clears historical entries in log feed |

### 2.7 Victory / Winner Modal
| Element ID | Tag | Purpose |
|---|---|---|
| `#winner-modal` | `div` | Celebration modal overlay when a player wins |
| `#winner-name` | `h2` | Winner declaration (e.g. "Player RED Won!") |
| `#winner-podium` | `div` | 1st, 2nd, 3rd rankings display with points |
| `#winner-final-stats` | `table` | Summary breakdown of points, kills, tokens home |
| `#btn-winner-play-again` | `button` | Triggers a fresh match rematch |
| `#btn-winner-close` | `button` | Closes modal to inspect final board |

### 2.8 Rules & Help Modal
| Element ID | Tag | Purpose |
|---|---|---|
| `#rules-modal` | `div` | Modal containing rules of Ludo & scoring guide |
| `#btn-close-rules` | `button` | Close rules modal |

---

## 3. BOARD COORDINATES & PATH SPECIFICATION

The 15×15 grid has Row `r` (0 to 14 from top to bottom) and Column `c` (0 to 14 from left to right).

### 3.1 52-Tile Common Track (Clockwise Loop)
Index `0` to `51`. Starting tiles and entry points:
* **Red Starting Tile:** Track index `0` at `(r: 6, c: 1)`. Red safe spot.
* **Red Track Entrance to Home Stretch:** Exits track at `50` to enter Red Home Path `51`.
* **Green Starting Tile:** Track index `13` at `(r: 1, c: 8)`. Green safe spot.
* **Green Track Entrance to Home Stretch:** Exits track at `11` to enter Green Home Path.
* **Yellow Starting Tile:** Track index `26` at `(r: 8, c: 13)`. Yellow safe spot.
* **Yellow Track Entrance to Home Stretch:** Exits track at `24` to enter Yellow Home Path.
* **Blue Starting Tile:** Track index `39` at `(r: 13, c: 6)`. Blue safe spot.
* **Blue Track Entrance to Home Stretch:** Exits track at `37` to enter Blue Home Path.

#### Exact (row, col) Track Coordinate Array (Length 52):
```javascript
const TRACK_COORDINATES = [
  /*  0 - Red Start */  { r: 6, c: 1 },
  /*  1 */              { r: 6, c: 2 },
  /*  2 */              { r: 6, c: 3 },
  /*  3 */              { r: 6, c: 4 },
  /*  4 */              { r: 6, c: 5 },
  /*  5 */              { r: 5, c: 6 },
  /*  6 */              { r: 4, c: 6 },
  /*  7 */              { r: 3, c: 6 },
  /*  8 */              { r: 2, c: 6 },
  /*  9 */              { r: 1, c: 6 },
  /* 10 */              { r: 0, c: 6 },
  /* 11 - Green Gate */ { r: 0, c: 7 },
  /* 12 */              { r: 0, c: 8 },
  /* 13 - Green Start */{ r: 1, c: 8 },
  /* 14 */              { r: 2, c: 8 },
  /* 15 */              { r: 3, c: 8 },
  /* 16 */              { r: 4, c: 8 },
  /* 17 */              { r: 5, c: 8 },
  /* 18 */              { r: 6, c: 9 },
  /* 19 */              { r: 6, c: 10 },
  /* 20 */              { r: 6, c: 11 },
  /* 21 */              { r: 6, c: 12 },
  /* 22 */              { r: 6, c: 13 },
  /* 23 */              { r: 6, c: 14 },
  /* 24 - Yellow Gate*/ { r: 7, c: 14 },
  /* 25 */              { r: 8, c: 14 },
  /* 26 - Yellow Start*/{ r: 8, c: 13 },
  /* 27 */              { r: 8, c: 12 },
  /* 28 */              { r: 8, c: 11 },
  /* 29 */              { r: 8, c: 10 },
  /* 30 */              { r: 8, c: 9 },
  /* 31 */              { r: 9, c: 8 },
  /* 32 */              { r: 10, c: 8 },
  /* 33 */              { r: 11, c: 8 },
  /* 34 */              { r: 12, c: 8 },
  /* 35 */              { r: 13, c: 8 },
  /* 36 */              { r: 14, c: 8 },
  /* 37 - Blue Gate */  { r: 14, c: 7 },
  /* 38 */              { r: 14, c: 6 },
  /* 39 - Blue Start */ { r: 13, c: 6 },
  /* 40 */              { r: 12, c: 6 },
  /* 41 */              { r: 11, c: 6 },
  /* 42 */              { r: 10, c: 6 },
  /* 43 */              { r: 9, c: 6 },
  /* 44 */              { r: 8, c: 5 },
  /* 45 */              { r: 8, c: 4 },
  /* 46 */              { r: 8, c: 3 },
  /* 47 */              { r: 8, c: 2 },
  /* 48 */              { r: 8, c: 1 },
  /* 49 */              { r: 8, c: 0 },
  /* 50 - Red Gate */   { r: 7, c: 0 },
  /* 51 */              { r: 6, c: 0 }
];
```

### 3.2 Safe Spot Indices (No captures allowed)
Indices on common track with shield/star protections:
* Safe indices: `0` (Red start), `8`, `13` (Green start), `21`, `26` (Yellow start), `34`, `39` (Blue start), `47`.
* Any cell in a player's private Home Column is also inherently 100% safe.

### 3.3 Home Columns (5 Steps Each + 1 Goal)
Each color has 5 private track tiles followed by index `5` which is the central Goal triangle.
```javascript
const HOME_COLUMNS = {
  red: [
    { r: 7, c: 1 }, { r: 7, c: 2 }, { r: 7, c: 3 }, { r: 7, c: 4 }, { r: 7, c: 5 },
    { r: 7, c: 6 } // Goal
  ],
  green: [
    { r: 1, c: 7 }, { r: 2, c: 7 }, { r: 3, c: 7 }, { r: 4, c: 7 }, { r: 5, c: 7 },
    { r: 6, c: 7 } // Goal
  ],
  yellow: [
    { r: 7, c: 13 }, { r: 7, c: 12 }, { r: 7, c: 11 }, { r: 7, c: 10 }, { r: 7, c: 9 },
    { r: 7, c: 8 } // Goal
  ],
  blue: [
    { r: 13, c: 7 }, { r: 12, c: 7 }, { r: 11, c: 7 }, { r: 10, c: 7 }, { r: 9, c: 7 },
    { r: 8, c: 7 } // Goal
  ]
};
```

### 3.4 Yard / Base Pocket Coordinates (4 slots per color)
```javascript
const YARD_COORDINATES = {
  red:    [{ r: 1.5, c: 1.5 }, { r: 1.5, c: 3.5 }, { r: 3.5, c: 1.5 }, { r: 3.5, c: 3.5 }],
  green:  [{ r: 1.5, c: 10.5 }, { r: 1.5, c: 12.5 }, { r: 3.5, c: 10.5 }, { r: 3.5, c: 12.5 }],
  yellow: [{ r: 10.5, c: 10.5 }, { r: 10.5, c: 12.5 }, { r: 12.5, c: 10.5 }, { r: 12.5, c: 12.5 }],
  blue:   [{ r: 10.5, c: 1.5 }, { r: 10.5, c: 3.5 }, { r: 12.5, c: 1.5 }, { r: 12.5, c: 3.5 }]
};
```

---

## 4. DATA STRUCTURES & STATE MODEL

Zoro must implement the following state contract:

### 4.1 Token State Object
```javascript
/**
 * @typedef {Object} Token
 * @property {number} id - Unique identifier (0 to 3 per player)
 * @property {'red'|'green'|'yellow'|'blue'} color - Player color
 * @property {'yard'|'track'|'home_column'|'goal'} state - Current placement
 * @property {number} stepProgress - Distance moved from start (0 to 56):
 *    - -1: in yard
 *    - 0: on start tile
 *    - 1 to 50: on common track
 *    - 51 to 55: in color home stretch (0 to 4)
 *    - 56: reached final goal
 * @property {number} trackIndex - Track tile index (0 to 51) if state === 'track', else null
 */
```

### 4.2 Player State Object
```javascript
/**
 * @typedef {Object} Player
 * @property {'red'|'green'|'yellow'|'blue'} color - Color key
 * @property {string} name - Display name (e.g. "Captain Red", "Navigator Green")
 * @property {'human'|'bot'} type - Control type
 * @property {boolean} isActive - Whether player participates in current game (for 2-3 player modes)
 * @property {Token[]} tokens - Array of 4 Token objects
 * @property {number} startTrackIndex - Track index where token spawns on 6 (Red:0, Green:13, Yellow:26, Blue:39)
 * @property {number} gateTrackIndex - Last track index before turning into home column (Red:50, Green:11, Yellow:24, Blue:37)
 * @property {number} score - Computed live score
 * @property {number} kills - Total captures made
 * @property {number} tokensHome - Count of finished tokens (0-4)
 * @property {number} totalSteps - Cumulative steps traveled by all 4 tokens
 * @property {number} rank - Final placement rank (1, 2, 3, 4) or 0 if ongoing
 */
```

### 4.3 Root Game State Object
```javascript
const GameState = {
  // Players registered in match
  players: {
    red: Player,
    green: Player,
    yellow: Player,
    blue: Player
  },
  // Turn Order Cycle: ['red', 'green', 'yellow', 'blue']
  turnOrder: ['red', 'green', 'yellow', 'blue'],
  currentTurnIndex: 0, // Index in turnOrder
  currentRollValue: null, // number 1-6 or null if waiting for roll
  hasRolled: false, // true once dice is rolled, reset when turn ends
  consecutiveSixes: 0, // roll count of 6 in single turn (max 3 allowed)
  isRollingAnimation: false, // lock input during 3D animation
  isMovingAnimation: false, // lock input during step-by-step token hop
  gameStatus: 'SETUP', // 'SETUP' | 'PLAYING' | 'PAUSED' | 'FINISHED'
  winnerOrder: [], // Array of player color strings in order of completion
  soundEnabled: true, // Audio toggle state
  turnTimer: null // Interval pointer for auto-turn timeout (15s)
};
```

### 4.4 Scoring Formula Contract
Score is strictly calculated on every state change according to this formula:
$$\text{Score} = (\text{Tokens In Goal} \times 500) + (\text{Kills} \times 150) + (\text{Total Steps Taken} \times 2) + (\text{Token Out of Yard Bonus} \times 20)$$
* Bonus for rolling a 6: $+10$ points to total score.
* Bonus for winning 1st place: $+1000$ points.
* Bonus for 2nd place: $+500$ points.

---

## 5. GAME RULES & FLOW CONTRACT

Zoro must follow these exact rule mechanics:

### 5.1 Rolling Rules
1. A player can click `#btn-roll-dice` (or board triggers) only when `hasRolled === false` and `isRollingAnimation === false`.
2. A random integer from `1` to `6` is produced.
3. If rolled value is `6`:
   - `consecutiveSixes += 1`.
   - If `consecutiveSixes === 3`: Turn is forfeited immediately! Emit log: *"Three consecutive 6s! Turn forfeited!"*, switch to next turn.
   - If `< 3`: Player earns a bonus roll after moving a token or bringing one out.
4. If rolled value is not `6`:
   - `consecutiveSixes = 0`.
   - Player does NOT get a bonus roll after their move.

### 5.2 Valid Move Determination
For the active player and `currentRollValue`:
1. **Yard Exit:** If roll is `6` and token is in `'yard'`, that token can move to `stepProgress = 0` (starting tile).
2. **Track Advancement:** If token is on `'track'`:
   - Can advance if `token.stepProgress + roll <= 56`.
3. **Exact Goal Rule:** If `token.stepProgress + roll > 56`, it CANNOT move (exact roll required to enter goal).
4. **Move Scenarios:**
   - **0 Valid Moves:** Show message "No valid moves", wait 1000ms, then switch turn automatically.
   - **1 Valid Move:** Highlight token, wait 350ms, auto-execute move.
   - **2+ Valid Moves:** Highlight all valid tokens with pulse glow (`.token-selectable`), await player click. If bot, run Bot Decision Algorithm.

### 5.3 Capturing / Knocking Out (Kills)
- If token lands on track tile `T`:
  - Check all other tokens on track tile `T`.
  - If tile `T` is in `SAFE_INDICES` (`[0, 8, 13, 21, 26, 34, 39, 47]`): Safe! Multiple tokens share tile peacefully.
  - If tile `T` is NOT safe:
    - If occupant is opponent:
      - Opponent token is captured! Its state resets to `'yard'`, `stepProgress = -1`, `trackIndex = null`.
      - Active player gains `kills += 1`, score update, sound effect, and gains an extra bonus roll!
    - If occupant is own token: Safe, tokens stack on the tile.

### 5.4 Reaching Goal & Extra Turns
- When a token reaches `stepProgress === 56`, its state becomes `'goal'`.
- Player gains `tokensHome += 1`.
- Player gets an immediate **bonus roll** for getting a token home!
- When all 4 tokens reach `'goal'`, player finishes.
  - Player is added to `winnerOrder`.
  - If 1 active player remains, game finishes (`gameStatus = 'FINISHED'`), and Victory Modal opens.

### 5.5 Bot Decision AI (Heuristic Weighting)
When active player is `'bot'`:
1. Check all valid moves.
2. Score each candidate move:
   - Reaching Goal: $+1000$ points.
   - Capturing an opponent: $+800$ points.
   - Exiting yard onto track: $+500$ points.
   - Moving onto a Safe Tile: $+300$ points.
   - Escaping danger (opponent is 1-6 tiles behind on non-safe tile): $+250$ points.
   - Advancing furthest token toward goal: $+50$ points.
3. Select highest scoring move and execute with a 600ms organic human-like delay.

---

## 6. JAVASCRIPT EVENT HANDLERS & API SIGNATURES

Zoro must implement these exact function signatures and event bindings:

### 6.1 Game Lifecycle APIs
```javascript
/**
 * Initializes DOM bindings, loads audio cues, and presents Setup Modal.
 * @signature initGame(): void
 */

/**
 * Resets state, generates board cells, configures active players, starts turn.
 * @param {Object} config - { playerCount: number, playerTypes: { red: string, green: string, yellow: string, blue: string } }
 * @signature startNewMatch(config): void
 */

/**
 * Advances to next active player in turnOrder, resets roll states, handles Bot turn auto-trigger.
 * @signature nextTurn(): void
 */

/**
 * Checks if current game has reached conclusion.
 * @signature checkGameOver(): boolean
 */
```

### 6.2 Action Handlers
```javascript
/**
 * Triggers 3D dice roll animation, generates 1-6, calls evaluatePossibleMoves.
 * @signature handleDiceRoll(): void
 */

/**
 * Evaluates valid moves for active player based on GameState.currentRollValue.
 * @param {string} playerColor
 * @param {number} rollValue
 * @returns {Token[]} Array of tokens eligible to move
 * @signature getValidMoves(playerColor, rollValue): Token[]
 */

/**
 * Executes token move step-by-step with animated hop, handles captures and goal entry.
 * @param {Token} token
 * @param {number} steps
 * @signature executeMove(token, steps): Promise<void>
 */

/**
 * Click handler for token DOM elements.
 * @param {MouseEvent} event
 * @signature onTokenClicked(event): void
 */
```

### 6.3 UI & Feedback Handlers
```javascript
/**
 * Renders tokens onto correct board grid coordinates using CSS transforms.
 * @signature renderTokenPositions(): void
 */

/**
 * Updates scoreboard cards with scores, kills, steps, tokens home.
 * @signature updateScoreboardUI(): void
 */

/**
 * Appends a formatted message with timestamp to #game-log-list.
 * @param {string} message - Activity message
 * @param {string} type - 'roll' | 'move' | 'kill' | 'goal' | 'warning'
 * @signature addLogEntry(message, type): void
 */

/**
 * Synthesizes audio cues via Web Audio API (dice roll, capture, move, cheer).
 * @param {'roll'|'step'|'capture'|'home'|'win'|'alert'} soundType
 * @signature playSound(soundType): void
 */
```

---

## 7. VISUAL DESIGN, BOARD LAYOUT & CSS CONTRACT

### 7.1 Palette & Color Theme
* Background: Deep nautical wood `#1a1612` / dark slate `#1e293b`
* Red Player: `#ef4444` (Accent: `#b91c1c`, Glow: `rgba(239, 68, 68, 0.4)`)
* Green Player: `#10b981` (Accent: `#047857`, Glow: `rgba(16, 185, 129, 0.4)`)
* Yellow Player: `#f59e0b` (Accent: `#b45309`, Glow: `rgba(245, 158, 11, 0.4)`)
* Blue Player: `#3b82f6` (Accent: `#1d4ed8`, Glow: `rgba(59, 130, 246, 0.4)`)
* Safe Spot Star Color: `#fbbf24`
* Track Tiles: `#f8fafc` with subtle borders `#cbd5e1`

### 7.2 Board Grid System
* `#ludo-board` must use `display: grid; grid-template-columns: repeat(15, 1fr); grid-template-rows: repeat(15, 1fr);`
* Dimensions: Maintain square aspect ratio (`width: min(85vw, 600px); height: min(85vw, 600px);`).
* Yards occupy:
  - Red: `grid-column: 1 / 7; grid-row: 1 / 7;`
  - Green: `grid-column: 10 / 16; grid-row: 1 / 7;`
  - Yellow: `grid-column: 10 / 16; grid-row: 10 / 16;`
  - Blue: `grid-column: 1 / 7; grid-row: 10 / 16;`
* Center Goal: `grid-column: 7 / 10; grid-row: 7 / 10;` with 4 colored triangles meeting at the center.

### 7.3 3D Dice Specification
* Cube container `#dice-cube` with `transform-style: preserve-3d` and 6 children faces (`.dice-face` with classes `.face-1` through `.face-6`).
* Face rotations:
  - 1: `rotateY(0deg)`
  - 2: `rotateY(180deg)`
  - 3: `rotateY(90deg)`
  - 4: `rotateY(-90deg)`
  - 5: `rotateX(-90deg)`
  - 6: `rotateX(90deg)`
* Random rolling animation rotates through multiple 360-degree spins using CSS `@keyframes dice-tumble`.

---

## 8. PROJECT DIRECTORY & FILE STRUCTURE

Zoro must produce clean, modular files matching this exact structure:
```
├── index.html        # Clean semantic markup containing all contract DOM IDs
├── styles.css        # Responsive styling, 15x15 board grid, 3D dice, animations
└── app.js            # Deterministic state machine, coordinates, AI, sound engine
```

---

## 9. ARCHITECT VERIFICATION CHECKLIST FOR ZORO

Before marking the task complete, verify that:
1. [ ] Every DOM element in Section 2 exists with matching IDs in `index.html`.
2. [ ] All 16 tokens (`#token-red-0` .. `#token-blue-3`) render on the board.
3. [ ] Dice rolling handles consecutive 6s (maximum 3 then forfeit).
4. [ ] Rolling a 6 allows bringing a token out of the yard.
5. [ ] Rolling a 6 or capturing an opponent token or reaching home awards an extra roll.
6. [ ] Capturing sends the opponent back to their yard and updates the kill stat.
7. [ ] Safe spots prevent captures.
8. [ ] Score formula in Section 4.4 updates dynamically in `#scoreboard-section`.
9. [ ] Bot players make automated moves without user intervention.
10. [ ] Victory modal appears when the game concludes and announces rank 1, 2, 3.

**Nami's Final Seal:**  
*"Follow this exact map and we will conquer the Grand Line without a single bug! Zoro, do not get lost!"* ⚓️🧭
