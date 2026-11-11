# System & Data Architecture Design: Ludo Game ("create ludo game")

**Author**: Nami (Group 1 - Architect), System & Data Architect  
**Project**: Ludo Game (Straw Hat Dev Crew)  
**Standard**: Open Agent Skills Specification (agentskills.io) - Database Schema & Data Modeling Protocol (v1.0.0) & API & Interface Design Protocol (v1.0.0)  

---

## 1. Executive Summary & Architecture Role

As Nami (System & Data Architect), this specification establishes the rigorous data models, database entities, state management structures, API contracts, DOM IDs, and validation rules for the **Ludo Game** project. 

This design acts as the concrete blueprint for Zoro (Builder) and Hancock (Verifier) to build and test an immutable, high-performance, responsive local multiplayer & AI Ludo game in vanilla HTML5, CSS3, and JavaScript.

---

## 2. Entity Relational Design & State Models

The application operates entirely client-side with persistent state managed via browser `LocalStorage` and reactive runtime state objects.

### A. Primary Entities & Data Models

#### 1. `GameSettings` Entity
Defines the match configuration chosen during setup.
```typescript
interface GameSettings {
  playerCount: number; // 2, 3, or 4
  players: PlayerConfig[];
}

interface PlayerConfig {
  id: 'red' | 'green' | 'yellow' | 'blue';
  name: string; // e.g. "Player 1", "Zoro", "Bot AI"
  color: string; // Hex color code e.g. "#ef4444"
  type: 'human' | 'ai';
  startTrackIndex: number; // Red: 0, Green: 13, Yellow: 26, Blue: 39
  homeApproachStartIndex: number; // Entry point to home stretch
}
```

#### 2. `Pawn` Entity
Represents an individual game token (4 pawns per player, total 16 pawns).
```typescript
interface Pawn {
  id: string; // Format: "{playerId}_{index}" e.g., "red_0", "green_3"
  player: 'red' | 'green' | 'yellow' | 'blue';
  index: number; // 0 to 3
  position: number; 
  /* 
    Position Mapping Rules:
    - -1: Yard (Home base)
    - 0 to 51: Main 52-square circular track
    - 100 to 105: Home stretch columns (100 = start of home stretch, 105 = center triangle / home)
    - 200: Fully completed / Finished in center home
  */
  state: 'YARD' | 'TRACK' | 'HOME_STRETCH' | 'FINISHED';
}
```

#### 3. `GameState` Entity
The single source of truth for the active match.
```typescript
interface GameState {
  status: 'SETUP' | 'PLAYING' | 'PAUSED' | 'WON';
  currentTurnIndex: number; // Index in players array (0 to playerCount - 1)
  diceValue: number | null; // 1 to 6, or null if unrolled
  diceRolled: boolean; // True once dice animation completes for current turn
  isAnimating: boolean; // Concurrency lock preventing double-clicks during movement/rolls
  consecutiveSixes: number; // Tracks consecutive 6s rolled (3 sixes = penalty / skip turn in standard rules)
  winner: string | null; // Player ID of winner when game concludes
  pawns: Record<string, Pawn>; // Keyed by pawn ID ("red_0", etc.)
  turnTimeLeft: number; // Optional countdown timer for turn pacing
}
```

#### 4. `Statistics` Entity (LocalStorage Persistence)
```typescript
interface GameStatistics {
  gamesPlayed: number;
  wins: {
    red: number;
    green: number;
    yellow: number;
    blue: number;
  };
  fastestWinTurns: number;
  lastPlayedAt: string; // ISO-8601 timestamp
}
```

---

## 3. DOM ID & Element Contract Specifications

For Zoro (Builder) to implement `index.html` without ambiguity, the following exact DOM element IDs and CSS selectors are specified:

| Element ID / Selector | HTML Tag | Purpose & Description |
|-----------------------|----------|------------------------|
| `#app` | `div` | Root application container |
| `#screen-setup` | `section` | Start screen / player configuration modal |
| `#player-count-select` | `select` | Dropdown or buttons to select 2, 3, or 4 players |
| `#player-config-container` | `div` | Dynamic container holding name inputs and AI toggles for each player |
| `#btn-start-game` | `button` | Triggers game initialization and transitions to game screen |
| `#screen-game` | `section` | Main game screen container |
| `#hud-turn-indicator` | `div` | Displays whose turn it is with active color badge |
| `#hud-message` | `div` | Toast / notification banner for rules, captures, or "No legal moves" |
| `#ludo-board` | `div` | 15x15 CSS Grid container representing the Ludo board |
| `.yard-red`, `.yard-green`, `.yard-yellow`, `.yard-blue` | `div` | 4 base quadrants holding yard pawns |
| `.track-square` | `div` | Individual track squares (`data-index="0"` to `"51"`) |
| `.safe-star` | `div` | Marked star squares where pawns are immune to capture |
| `.home-column` | `div` | 6-square final approach columns for each color |
| `.home-triangle` | `div` | Center winning zone |
| `.pawn` | `button`/`div` | Interactive token element (`data-pawn-id="red_0"`, `data-player="red"`) |
| `#dice-container` | `div` | Clickable 3D animated dice wrapper |
| `#dice` | `div` | Interactive dice element (`data-value="1-6"`) |
| `#btn-roll-dice` | `button` | Action button to roll dice |
| `#screen-victory` | `div` | Victory modal overlay shown when a player wins |
| `#victory-message` | `h2` | Declares the Grand Champion (`"Player Red Wins!"`) |
| `#btn-restart` | `button` | Resets game state back to setup screen |

---

## 4. API & Interface Design Contracts (Internal & LocalStorage)

Although the game operates locally without a remote backend server, all state interactions follow strict REST-like functional contracts and payload schemas.

### A. LocalStorage Persistence Contract
- **Storage Key**: `ludo_game_save_v1`
- **Read Operation**: `JSON.parse(localStorage.getItem('ludo_game_save_v1'))`
- **Write Operation**: `localStorage.setItem('ludo_game_save_v1', JSON.stringify(payload))`
- **Payload Schema**:
```json
{
  "settings": {
    "playerCount": 4,
    "players": [
      { "id": "red", "name": "Red", "color": "#ef4444", "type": "human", "startTrackIndex": 0 },
      { "id": "green", "name": "Green", "color": "#22c55e", "type": "human", "startTrackIndex": 13 },
      { "id": "yellow", "name": "Yellow", "color": "#eab308", "type": "ai", "startTrackIndex": 26 },
      { "id": "blue", "name": "Blue", "color": "#3b82f6", "type": "human", "startTrackIndex": 39 }
    ]
  },
  "state": {
    "status": "PLAYING",
    "currentTurnIndex": 0,
    "diceValue": 6,
    "diceRolled": true,
    "consecutiveSixes": 0,
    "pawns": {
      "red_0": { "id": "red_0", "player": "red", "index": 0, "position": -1, "state": "YARD" },
      "red_1": { "id": "red_1", "player": "red", "index": 1, "position": -1, "state": "YARD" },
      "red_2": { "id": "red_2", "player": "red", "index": 2, "position": 0, "state": "TRACK" },
      "red_3": { "id": "red_3", "player": "red", "index": 3, "position": 12, "state": "TRACK" }
    }
  },
  "stats": {
    "gamesPlayed": 3,
    "wins": { "red": 1, "green": 1, "yellow": 0, "blue": 1 },
    "fastestWinTurns": 42,
    "lastPlayedAt": "2025-02-26T12:00:00.000Z"
  }
}
```

### B. Core Engine Function Signatures (JavaScript Contracts)

```javascript
/**
 * Rolls a random 6-sided dice and updates state.
 * @returns {number} Value between 1 and 6
 */
function rollDice() {}

/**
 * Calculates all eligible pawns that can move for the current player given dice value.
 * @param {string} playerId - e.g., 'red'
 * @param {number} diceVal - e.g., 6
 * @returns {string[]} Array of movable pawn IDs (e.g., ['red_0', 'red_2'])
 */
function getValidMoves(playerId, diceVal) {}

/**
 * Executes a pawn movement step, checking for captures, home stretch entry, and win conditions.
 * @param {string} pawnId - e.g., 'red_0'
 * @param {number} diceVal - e.g., 6
 * @returns {Object} Result metadata { captured: boolean, extraTurn: boolean, won: boolean }
 */
function movePawn(pawnId, diceVal) {}

/**
 * Evaluates AI bot decision making when it's an AI player's turn.
 * @param {string} aiPlayerId - e.g., 'yellow'
 * @param {number} diceVal - e.g., 4
 * @returns {string|null} Selected pawn ID to move or null if no moves
 */
function calculateAIMove(aiPlayerId, diceVal) {}
```

---

## 5. Validation Rules, Integrity, & Edge-Case Handling

1. **Pawn Release Rule (`YARD` to `TRACK`)**:
   - A pawn in the yard (`position: -1`) can *only* move out onto its designated starting track index if the rolled dice value is exactly `6`.
   - If a player rolls anything other than `6` and all 4 pawns are in the yard, no legal moves exist.

2. **Safe Star Protection Rule**:
   - Safe squares (`0`, `8`, `13`, `21`, `26`, `34`, `39`, `47`) provide absolute immunity. If a pawn lands on a safe square already occupied by an opponent pawn, **no capture occurs** (both pawns coexist peacefully).

3. **Capture Mechanics & Bonus Turn**:
   - When a pawn lands on a standard track square occupied by an opponent pawn, the opponent pawn's position resets to `-1` and its state returns to `YARD`.
   - The capturing player is awarded an immediate **extra turn / bonus dice roll**.

4. **Concurrency & Input Locking (`isAnimating`)**:
   - While `gameState.isAnimating === true` (during dice shaking animations or pawn sliding transitions), all click events on pawns and dice are programmatically ignored to prevent race conditions and state corruption.

5. **No Legal Moves Auto-Skip**:
   - If `getValidMoves()` returns an empty array after rolling the dice, display a toast notification (`"No legal moves! Skipping turn..."`) and automatically advance `currentTurnIndex` after 1.5 seconds.

---

## 6. Blueprint Handover to Zoro (Builder)

Nami's Architecture Blueprint is fully completed and locked. 
- **Zoro (Builder)** can now proceed to author `index.html`, `style.css`, and `app.js` using these exact DOM IDs, data structures, and validation rules.
- **Hancock (Verifier)** will use these exact specifications to write automated Playwright tests in `e2e/ludo.spec.js`.