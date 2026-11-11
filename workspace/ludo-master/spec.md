# LUDO MASTER: ARCHITECTURE SPECIFICATION & CONTRACT
**Author:** Nami (Group 1 - System & Data Architect)  
**Target Builder:** Zoro (Group 1 - Builder)  
**Project:** Fully Featured Ludo Board Game with Dice Roll & Score Tracking  
**Version:** 1.0.0  
**Status:** FROZEN CONTRACT - NO DEVIATION PERMITTED

---

## 1. System Overview & Architecture

The application is a client-side, interactive 2-to-4 player Ludo board game built with standard HTML5, CSS3, and modern Vanilla ES6+ JavaScript. The game features:
1. Standard 15x15 cell Ludo grid with authentic colored quadrants (Red, Green, Yellow, Blue), start pads, safe star cells, colored home runways, and center triangle home.
2. Animated 3D/CSS dice roller with sound synthesis (Web Audio API) and visual dot representations.
3. Complete Ludo rules engine:
   - Need a 6 to release a token from the yard.
   - Extra turn awarded upon rolling a 6, capturing an opponent token, or reaching the home triangle.
   - 3 consecutive 6s penalty: Turn immediately forfeited.
   - Safe squares (starting squares & 4 star safe cells) where tokens cannot be captured.
   - Exact roll required to enter the final home center.
   - Multiple tokens on the same cell supported via clustered mini-token styling.
4. Player modes: Local Pass & Play (2-4 players) and Solo vs Smart Bot/AI.
5. Persistent Score & Statistics Tracker stored in `localStorage`:
   - Matches played, wins per player/color, total kills (captures), tokens delivered home.
   - In-game dynamic score table (Tokens Out, Tokens Home, Captures, Current Score).
6. Audio engine using browser Web Audio API (synthesized dice rolls, token moves, capture sfx, victory fanfare) with mute toggle.

---

## 2. Master DOM Contract (Strict ID & Class Registry)

Every single ID listed below is mandatory. Zoro MUST use these exact IDs without modification.

### 2.1 Core Layout Containers
| Element ID | Tag | Purpose |
| :--- | :--- | :--- |
| `#app-container` | `<div>` | Top-level full screen wrapper |
| `#game-header` | `<header>` | Header holding title, audio toggle, reset button, and rules modal trigger |
| `#main-content` | `<main>` | Split grid container holding the board and the side control panel |
| `#board-container` | `<div>` | Wrapper around the 15x15 Ludo board canvas/grid |
| `#ludo-board` | `<div>` | The 15x15 CSS Grid element containing all 225 cells |
| `#side-panel` | `<aside>` | Sidebar containing dice controls, turn tracker, player setup, and score tracker |

### 2.2 Header Elements
| Element ID | Tag | Purpose |
| :--- | :--- | :--- |
| `#btn-sound-toggle` | `<button>` | Toggle Web Audio sound effects ON/OFF |
| `#sound-icon` | `<span>` | Icon or text indicator for sound status (`🔊` / `🔇`) |
| `#btn-how-to-play` | `<button>` | Opens the rules and instructions modal |
| `#btn-new-game` | `<button>` | Trigger to start a fresh game / reset board |

### 2.3 Side Panel Controls & Indicators
| Element ID | Tag | Purpose |
| :--- | :--- | :--- |
| `#game-status-card` | `<div>` | Current turn card displaying active player, status messages, roll prompt |
| `#active-player-badge` | `<div>` | Pill indicating current player color (e.g., Red, Green, etc.) |
| `#active-player-name` | `<span>` | Text name of current player (e.g. "Player 1 (Red)") |
| `#turn-instruction-text` | `<p>` | Guidance: "Roll the dice", "Select a token to move", "Rolled 6! Roll again" |
| `#dice-section` | `<div>` | Wrapper for 3D dice cube and roll button |
| `#dice-cube` | `<div>` | 3D visual dice element with 6 faces displaying pips |
| `#btn-roll-dice` | `<button>` | Primary action button to roll dice |
| `#dice-value-display` | `<div>` | High-contrast numeric display of current dice roll result |
| `#consecutive-sixes-indicator` | `<div>` | Warning meter for consecutive 6s (e.g., `⚡ 6 [1/3]`) |

### 2.4 Setup & Configuration Controls
| Element ID | Tag | Purpose |
| :--- | :--- | :--- |
| `#game-setup-card` | `<div>` | Collapsible or pre-game panel for selecting game mode |
| `#select-player-count` | `<select>` | Dropdown to choose 2, 3, or 4 players |
| `#select-game-mode` | `<select>` | Options: `"pass-and-play"` (Local PvP) or `"vs-bot"` (Human vs AI Bots) |
| `#btn-start-game` | `<button>` | Confirms setup and begins game |

### 2.5 Scoreboard & Analytics Table
| Element ID | Tag | Purpose |
| :--- | :--- | :--- |
| `#scoreboard-card` | `<div>` | Container for live match stats & overall scoreboard |
| `#live-scoreboard-table` | `<table>` | Active match stats: Tokens in Base, Active, Home, Captures, Score |
| `#score-row-red` | `<tr>` | Live stats row for Red player |
| `#score-row-green` | `<tr>` | Live stats row for Green player |
| `#score-row-yellow` | `<tr>` | Live stats row for Yellow player |
| `#score-row-blue` | `<tr>` | Live stats row for Blue player |
| `#lifetime-stats-container` | `<div>` | Persistent record of matches won across sessions |
| `#stat-wins-red` | `<span>` | Red lifetime win count |
| `#stat-wins-green` | `<span>` | Green lifetime win count |
| `#stat-wins-yellow` | `<span>` | Yellow lifetime win count |
| `#stat-wins-blue` | `<span>` | Blue lifetime win count |
| `#btn-reset-stats` | `<button>` | Clears `localStorage` lifetime stats |

### 2.6 Notification & Game Log Area
| Element ID | Tag | Purpose |
| :--- | :--- | :--- |
| `#game-event-log` | `<div>` | Scrollable live text commentary log of moves, captures, rolls |
| `#log-entries-list` | `<ul>` | List element holding historical log items |

### 2.7 Modals & Overlays
| Element ID | Tag | Purpose |
| :--- | :--- | :--- |
| `#modal-winner` | `<div>` | Full overlay shown upon player victory |
| `#winner-title` | `<h2>` | Victory headline ("Player 1 (Red) Wins!") |
| `#winner-stats-summary` | `<div>` | Summary of winner's performance in the match |
| `#btn-play-again` | `<button>` | Restarts match with same players |
| `#btn-modal-close` | `<button>` | Closes winner modal to inspect final board |
| `#modal-rules` | `<div>` | Overlay modal explaining Ludo rules |
| `#btn-rules-close` | `<button>` | Button to dismiss rules modal |

---

## 3. Ludo Board Coordinate System & Track Specification

The board is a 15x15 matrix indexed by row `r` (0 to 14) and column `c` (0 to 14).
Total grid cells = 225 cells.

### 3.1 Quadrants & Key Landmarks
- **Red Yard (Top-Left):** rows 0-5, cols 0-5.
- **Green Yard (Top-Right):** rows 0-5, cols 9-14.
- **Yellow Yard (Bottom-Right):** rows 9-14, cols 9-14.
- **Blue Yard (Bottom-Left):** rows 9-14, cols 0-5.
- **Center Home Triangle (Center 3x3):** rows 6-8, cols 6-8.
- **Arms / Walkways:**
  - North Arm: rows 0-5, cols 6-8 (Col 7 is Green's Home Runway; entry at (0,7)).
  - East Arm: rows 6-8, cols 9-14 (Row 7 is Yellow's Home Runway; entry at (7,14)).
  - South Arm: rows 9-14, cols 6-8 (Col 7 is Blue's Home Runway; entry at (14,7)).
  - West Arm: rows 6-8, cols 0-5 (Row 7 is Red's Home Runway; entry at (7,0)).

### 3.2 Cell Identification Scheme
Each cell in `#ludo-board` MUST have the HTML data attributes:
- `data-row="[0-14]"`
- `data-col="[0-14]"`
- `data-cell-id="cell-[r]-[c]"`
- `id="cell-[r]-[c]"`

### 3.3 The 52 Common Outer Track Path Sequence
Standard clockwise movement. The 52 track steps are numbered `0` to `51`:

| Track Step | (Row, Col) | Description |
| :--- | :--- | :--- |
| **0** | `(6, 1)` | **Red Starting Square (Safe)** |
| 1 | `(6, 2)` | Track |
| 2 | `(6, 3)` | Track |
| 3 | `(6, 4)` | Track |
| 4 | `(6, 5)` | Track |
| 5 | `(5, 6)` | Track |
| 6 | `(4, 6)` | Track |
| 7 | `(3, 6)` | Track |
| **8** | `(2, 6)` | **Star Safe Square 1** |
| 9 | `(1, 6)` | Track |
| 10 | `(0, 6)` | Track |
| 11 | `(0, 7)` | Turn |
| 12 | `(0, 8)` | Track |
| **13** | `(1, 8)` | **Green Starting Square (Safe)** |
| 14 | `(2, 8)` | Track |
| 15 | `(3, 8)` | Track |
| 16 | `(4, 8)` | Track |
| 17 | `(5, 8)` | Track |
| 18 | `(6, 9)` | Track |
| 19 | `(6, 10)` | Track |
| 20 | `(6, 11)` | Track |
| **21** | `(6, 12)` | **Star Safe Square 2** |
| 22 | `(6, 13)` | Track |
| 23 | `(6, 14)` | Track |
| 24 | `(7, 14)` | Turn |
| 25 | `(8, 14)` | Track |
| **26** | `(8, 13)` | **Yellow Starting Square (Safe)** |
| 27 | `(8, 12)` | Track |
| 28 | `(8, 11)` | Track |
| 29 | `(8, 10)` | Track |
| 30 | `(8, 9)` | Track |
| 31 | `(9, 8)` | Track |
| 32 | `(10, 8)` | Track |
| 33 | `(11, 8)` | Track |
| **34** | `(12, 8)` | **Star Safe Square 3** |
| 35 | `(13, 8)` | Track |
| 36 | `(14, 8)` | Track |
| 37 | `(14, 7)` | Turn |
| 38 | `(14, 6)` | Track |
| **39** | `(13, 6)` | **Blue Starting Square (Safe)** |
| 40 | `(12, 6)` | Track |
| 41 | `(11, 6)` | Track |
| 42 | `(10, 6)` | Track |
| 43 | `(9, 6)` | Track |
| 44 | `(8, 5)` | Track |
| 45 | `(8, 4)` | Track |
| 46 | `(8, 3)` | Track |
| **47** | `(8, 2)` | **Star Safe Square 4** |
| 48 | `(8, 1)` | Track |
| 49 | `(8, 0)` | Track |
| 50 | `(7, 0)` | Turn into Red Runway |
| 51 | `(6, 0)` | Final track before Red start / loop |

### 3.4 Color Specific Entry, Runway & Home Definitions
Each color player has:
- **`startTrackIndex`**: Index on the 52-step track where tokens emerge.
- **`lastTrackIndex`**: Index from which the token turns into its Home Runway.
- **`homeRunwayCoords`**: Array of 5 coordinates leading to the Center Home.
- **`homeTargetCoord`**: Final winning center coordinate.
- **`yardSlots`**: 4 fixed coordinates inside each color's yard home base.

#### Red (`red`):
- `startTrackIndex`: `0` -> `(6, 1)`
- `lastTrackIndex`: `50` -> `(7, 0)`
- `homeRunwayCoords`: `[(7,1), (7,2), (7,3), (7,4), (7,5)]`
- `homeTargetCoord`: `(7, 6)`
- `yardSlots`: `[(2,2), (2,3), (3,2), (3,3)]`
- Safe Star Squares: `0` (its own start), and index `8`, `21`, `34`, `47`.

#### Green (`green`):
- `startTrackIndex`: `13` -> `(1, 8)`
- `lastTrackIndex`: `11` -> `(0, 7)`
- `homeRunwayCoords`: `[(1,7), (2,7), (3,7), (4,7), (5,7)]`
- `homeTargetCoord`: `(6, 7)`
- `yardSlots`: `[(2,11), (2,12), (3,11), (3,12)]`
- Safe Star Squares: `13` (its own start), plus global stars `8`, `21`, `34`, `47`.

#### Yellow (`yellow`):
- `startTrackIndex`: `26` -> `(8, 13)`
- `lastTrackIndex`: `24` -> `(7, 14)`
- `homeRunwayCoords`: `[(7,13), (7,12), (7,11), (7,10), (7,9)]`
- `homeTargetCoord`: `(7, 8)`
- `yardSlots`: `[(11,11), (11,12), (12,11), (12,12)]`
- Safe Star Squares: `26` (its own start), plus global stars `8`, `21`, `34`, `47`.

#### Blue (`blue`):
- `startTrackIndex`: `39` -> `(13, 6)`
- `lastTrackIndex`: `37` -> `(14, 7)`
- `homeRunwayCoords`: `[(13,7), (12,7), (11,7), (10,7), (9,7)]`
- `homeTargetCoord`: `(8, 7)`
- `yardSlots`: `[(11,2), (11,3), (12,2), (12,3)]`
- Safe Star Squares: `39` (its own start), plus global stars `8`, `21`, `34`, `47`.

---

## 4. Token Specification & DOM Mapping

Every player has exactly 4 tokens. Each token has a unique ID:
`token-{color}-{tokenIndex}` where `color` ∈ `['red', 'green', 'yellow', 'blue']` and `tokenIndex` ∈ `[0, 1, 2, 3]`.

### 4.1 Token DOM Attributes
```html
<div class="ludo-token token-red"
     id="token-red-0"
     data-color="red"
     data-token-index="0"
     data-state="yard"
     tabindex="0"
     role="button"
     aria-label="Red Token 1">
     <div class="token-inner"></div>
</div>
```

### 4.2 Token State Transitions
- **`yard`**: Token rests in its yard slot `yardSlots[tokenIndex]`. Cannot move unless a 6 is rolled.
- **`track`**: Token is traversing the 52 common cells. Position is recorded as `stepIndex` (0 to 51) and `distanceTraveled` (0 to 50).
- **`runway`**: Token has turned into its home runway (positions 0 to 4 in `homeRunwayCoords`).
- **`home`**: Token has reached the home target square (`homeTargetCoord`). Reaching here increases score and triggers extra roll.

---

## 5. State Models & Data Structures

Zoro MUST implement the game state according to this schema:

```javascript
/**
 * @typedef {'red' | 'green' | 'yellow' | 'blue'} PlayerColor
 * @typedef {'yard' | 'track' | 'runway' | 'home'} TokenState
 * @typedef {'pass-and-play' | 'vs-bot'} GameMode
 * @typedef {'waiting-for-roll' | 'waiting-for-token' | 'animating' | 'game-over'} TurnPhase
 */

/**
 * @typedef {Object} TokenModel
 * @property {number} id - 0 to 3
 * @property {PlayerColor} color - Owner color
 * @property {TokenState} state - Current state
 * @property {number} yardIndex - Original yard slot index (0 to 3)
 * @property {number} trackIndex - Index on 52-cell track (if state === 'track')
 * @property {number} runwayIndex - Index on 5-cell runway (0 to 4, if state === 'runway')
 * @property {number} distanceTraveled - Steps taken from exit of yard (0 to 56 max)
 */

/**
 * @typedef {Object} PlayerModel
 * @property {PlayerColor} color
 * @property {string} name
 * @property {boolean} isBot
 * @property {boolean} isActive - Included in current game (2, 3, or 4 players)
 * @property {TokenModel[]} tokens - Array of 4 tokens
 * @property {number} tokensHome - Count of tokens that reached home (0 to 4)
 * @property {number} killsCount - Count of opponent tokens captured
 * @property {number} totalScore - Calculated live game score
 */

/**
 * @typedef {Object} GameState
 * @property {GameMode} mode - 'pass-and-play' | 'vs-bot'
 * @property {PlayerColor[]} activePlayerColors - Colors currently playing (e.g. ['red', 'yellow'])
 * @property {number} currentTurnIndex - Index in activePlayerColors array
 * @property {TurnPhase} turnPhase - Current phase of the turn
 * @property {number|null} currentRoll - Value of current dice roll (1 to 6)
 * @property {number} consecutiveSixes - Current streak of 6s rolled in this turn (0 to 3)
 * @property {number[]} moveableTokenIds - IDs of tokens capable of moving with currentRoll
 * @property {PlayerColor|null} winner - Color of winning player if game over
 * @property {boolean} soundEnabled - Mute / Unmute state
 */
```

### 5.1 Scoring Formula
For each player:
`Score = (tokensHome * 100) + (killsCount * 50) + (distanceTraveledSum * 2)`
This gives immediate dynamic feedback on the `#live-scoreboard-table`.

---

## 6. Complete Game Rules & Edge Cases Contract

1. **Releasing from Yard:**
   - A token can only move from `yard` to `track` (at `startTrackIndex`) if `currentRoll === 6`.
   - If player has no tokens on track/runway and rolls anything other than 6, turn ends immediately and passes to next player.

2. **Consecutive Sixes Rule:**
   - If a player rolls a 6, `consecutiveSixes` increments.
   - If `consecutiveSixes === 3`, the 3rd roll is voided! The player is penalized, does not get to move, and the turn automatically passes to the next player. A notification `"3 consecutive 6s! Turn forfeited!"` is logged.

3. **Bonus Extra Turn Triggers:**
   A player gets to roll again IF:
   - They rolled a 6 (and it was not their 3rd consecutive 6).
   - They captured an opponent token.
   - Their token reached the `home` target square.
   *Note: Only one bonus turn is granted per action.*

4. **Safe Squares & Capturing (Kills):**
   - Safe Squares:
     - All color starting points: Red (6,1) [0], Green (1,8) [13], Yellow (8,13) [26], Blue (13,6) [39].
     - Global Star Safe Squares: (2,6) [8], (6,12) [21], (12,8) [34], (8,2) [47].
   - If Token A lands on an un-safe square occupied by Token B (belonging to an enemy player):
     - Token B is **captured**!
     - Token B is reset to `yard` (returned to its designated `yardSlots[tokenIndex]`).
     - Player A receives +1 to `killsCount` and earns a bonus roll!
     - Sound effect `capture` is triggered.
   - Multiple tokens belonging to the **same** player on the same square: Safe from capture (they share the cell; visual stacking applies).

5. **Exact Home Entry:**
   - Total distance from start square to home target is exactly **56 steps** (51 common track steps + 5 runway steps to target).
   - A token requires an **exact roll** to land on `homeTargetCoord`.
   - If `runwayIndex + currentRoll > 5`, that token cannot be moved (roll is too high).

6. **Automatic Move Single Option:**
   - If only 1 token can legally move given the dice roll, the game auto-selects or allows instant 1-click execution.
   - If 0 tokens can legally move, play automatically passes to the next player after a 900ms visual delay.

7. **Bot AI Logic (`vs-bot` mode):**
   - When active player `isBot === true`, bot waits 500ms, triggers dice roll.
   - After roll, bot evaluates valid tokens using weighted priority:
     1. Prioritize capturing an opponent token (Weight +100).
     2. Prioritize moving a token into Home (Weight +80).
     3. Prioritize releasing a token from Yard on rolling 6 (Weight +60).
     4. Prioritize moving a token out of danger (un-safe cell with opponent behind) (Weight +40).
     5. Move the token furthest ahead (Weight +10).
   - Bot executes chosen move with smooth animation.

---

## 7. Event Handler Signatures & Flow

Zoro MUST implement these core functions with identical signatures:

```javascript
// === INITIALIZATION & SETUP ===
function initGame(): void
function setupBoardDOM(): void
function attachEventListeners(): void
function resetGame(playerCount: number, mode: GameMode): void

// === DICE CONTROLLER ===
function onDiceRollClick(): void
function rollDice(): Promise<number> // Handles 3D rotation animation, returns 1-6
function handleDiceResult(rollValue: number): void

// === TURN & MOVE MANAGEMENT ===
function determineLegalMoves(playerColor: PlayerColor, roll: number): number[] // returns token IDs
function onTokenClick(tokenColor: PlayerColor, tokenId: number): void
function executeTokenMove(tokenColor: PlayerColor, tokenId: number, steps: number): Promise<void>
function advanceTokenStepByStep(token: TokenModel, steps: number): Promise<void>
function checkCapture(targetStepTrackIndex: number, movingColor: PlayerColor): boolean
function sendTokenToYard(token: TokenModel): void
function endTurn(grantBonusTurn: boolean): void
function nextPlayer(): void

// === AI / BOT EXECUTION ===
function executeBotTurn(): Promise<void>
function chooseBestBotMove(legalTokenIds: number[], roll: number): number

// === SCORE & PERSISTENCE ===
function updateScoreboardDOM(): void
function recordGameResult(winnerColor: PlayerColor): void
function loadLifetimeStats(): LifetimeStats
function saveLifetimeStats(stats: LifetimeStats): void

// === AUDIO SYNTHESIS ===
function playSound(type: 'roll' | 'move' | 'capture' | 'home' | 'win' | 'penalty'): void
```

---

## 8. Board Visual & Color Scheme Specifications

To ensure high-end straw hat crew visual quality:
- **Red Palette:** `#E53935` (Accent), `#FFEBEE` (Light base), `#C62828` (Dark border)
- **Green Palette:** `#43A047` (Accent), `#E8F5E9` (Light base), `#2E7D32` (Dark border)
- **Yellow Palette:** `#FDD835` (Accent), `#FFFDE7` (Light base), `#F57F17` (Dark border)
- **Blue Palette:** `#1E88E5` (Accent), `#E3F2FD` (Light base), `#1565C0` (Dark border)
- **Board Outer Border:** `#37474F` with subtle wood/slate rim.
- **Star Cells:** Marked with `★` unicode character or SVG star icon with golden tone `#FFB300`.
- **Active Token Highlighting:** Glowing pulsating keyframe animation (`box-shadow: 0 0 12px 3px currentColor; cursor: pointer; transform: scale(1.15)`).

---

## 9. File Structure
Zoro will construct the game across standard clean files:
- `index.html`: Holds the exact HTML structure complying with Section 2.
- `styles.css`: Complete styling, 15x15 CSS grid, responsive board scaling, 3D dice animation, scoreboard theme.
- `app.js`: Clean, modular JavaScript implementing the models, board math, state machine, bot AI, audio synthesis, and event handlers.

---

## 10. Zoro's Verification Checklist
Before submitting, Zoro must confirm:
- [ ] All IDs in Section 2 exist verbatim in `index.html`.
- [ ] 15x15 board accurately places all 4 yards, track cells, and safe stars.
- [ ] Rolling 6 releases token from yard; roll of 1-5 cannot release yard token.
- [ ] 3 consecutive 6s triggers penalty and switches turn.
- [ ] Capturing opponent returns them to yard and gives extra roll.
- [ ] Bot AI plays smoothly in Solo vs Bot mode.
- [ ] Live scoreboard updates score and captures after every action.
- [ ] Web Audio API sounds work without external audio file dependencies.
- [ ] Responsive design functions cleanly on mobile and desktop.
- [ ] No syntax errors or undefined DOM queries in browser console.
