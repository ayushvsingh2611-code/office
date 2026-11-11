## Simple Two‑Player Chess Game – Integration & Content Spec  
*Prepared by **Brook – Integrations & Content Specialist***  

---  

### 1️⃣  Overview  

| Component | Purpose |
|-----------|---------|
| **Game Service** | Core backend that creates games, matches two players, validates moves, stores history, and serves the current board state. |
| **Auth Service** *(optional)* | Issues short‑lived JWTs for player identity. Can be swapped with any existing auth provider. |
| **Realtime Notification** *(optional)* | WebSocket / Server‑Sent Events endpoint that pushes move updates to the opponent. A mock fallback is provided for offline mode. |
| **Client** | UI (React, Vue, etc.) that calls the REST API, stores a minimal state in `localStorage`, and falls back to mock data when the backend is unreachable. |

---  

## 2️⃣  External Service Integration Requirements  

| Requirement | Detail |
|-------------|--------|
| **Transport** | HTTPS (TLS 1.2+). All endpoints must reject non‑HTTPS traffic. |
| **Authentication** | Bearer JWT (`Authorization: Bearer <token>`). Token payload must contain `sub` (player UUID) and `exp`. If no auth service is used, the API may accept a **guest** token generated on the client. |
| **Rate Limiting** | 60 requests/min per player ID. Return `429 Too Many Requests` with `Retry-After` header. |
| **CORS** | `Access‑Control‑Allow‑Origin: *` (or your domain). Allow `GET,POST,PUT,DELETE,OPTIONS`. |
| **Idempotency** | `POST /games/:gameId/moves` must support an `Idempotency-Key` header to safely retry failed move submissions. |
| **Offline Resilience** | When the backend is unreachable, the client must switch to **mock mode** (see §4) and store all actions locally until connectivity is restored. |
| **Latency Simulation** | Mock responses should simulate 150‑300 ms latency and a 2 % random timeout (5 s) to test UI handling. |
| **Data Sanitization** | All incoming payloads are validated against JSON schemas (see §3). Reject with `400 Bad Request` if any field fails validation (e.g., malformed UUID, illegal move notation). |
| **Versioning** | All URLs are prefixed with `/api/v1/`. Future versions must remain backward compatible for at least one major release. |

---  

## 3️⃣  RESTful API Contracts  

All request/response bodies are **application/json**. Timestamp fields use **ISO‑8601** (`YYYY‑MM‑DDTHH:mm:ssZ`). IDs are UUID v4 strings.

### 3.1  Create a New Game  

```
POST /api/v1/games
```

**Request Body**

```json
{
  "playerWhite": { "id": "uuid", "displayName": "Alice" },
  "playerBlack": { "id": "uuid", "displayName": "Bob" },
  "timeControl": {               // optional, default 0 = unlimited
    "initialMinutes": 5,
    "incrementSeconds": 2
  }
}
```

**Response (201 Created)**  

```json
{
  "gameId": "c3d9f2a1-6b8e-4d5a-9f3c-1e2b3c4d5e6f",
  "status": "pending",               // pending → waiting for both players to accept
  "boardFEN": "rn... w KQkq - 0 1",   // standard start position in FEN
  "createdAt": "2026-11-07T12:34:56Z",
  "players": {
    "white": { "id": "uuid", "displayName": "Alice" },
    "black": { "id": "uuid", "displayName": "Bob" }
  },
  "timeControl": { "initialMinutes": 5, "incrementSeconds": 2 }
}
```

| Status Code | Meaning |
|-------------|---------|
| 201 | Game created |
| 400 | Validation error (e.g., missing player IDs) |
| 401 | Missing/invalid JWT |
| 429 | Rate limit exceeded |

---

### 3.2  Join / Accept a Game  

```
POST /api/v1/games/{gameId}/join
```

**Request Body**

```json
{
  "playerId": "uuid",
  "color": "white" | "black"
}
```

**Response (200 OK)**  

```json
{
  "gameId": "c3d9f2a1-6b8e-4d5a-9f3c-1e2b3c4d5e6f",
  "status": "active",
  "boardFEN": "rn... w KQkq - 0 1",
  "turn": "white",
  "startedAt": "2026-11-07T12:36:01Z"
}
```

| Status | Meaning |
|--------|---------|
| 200 | Player successfully joined, game now active |
| 400 | Invalid color / player already in game |
| 404 | Game not found |
| 409 | Game already full or started |

---

### 3.3  Submit a Move  

```
POST /api/v1/games/{gameId}/moves
```

**Headers**  

- `Idempotency-Key: <unique-string>` (required for retries)  

**Request Body**

```json
{
  "playerId": "uuid",
  "from": "e2",          // algebraic notation
  "to": "e4",
  "promotion": "Q"      // optional, one of Q,R,B,N
}
```

**Response (200 OK)**  

```json
{
  "moveId": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "boardFEN": "rn... b KQkq - 1 1",
  "turn": "black",
  "moveNumber": 1,
  "timestamp": "2026-11-07T12:37:12Z",
  "gameStatus": "active"   // could be "checkmate", "draw", "stalemate"
}
```

| Status | Meaning |
|--------|---------|
| 200 | Move accepted |
| 400 | Illegal move (fails chess engine validation) |
| 401 | Not the player’s turn / JWT mismatch |
| 404 | Game not found |
| 409 | Duplicate move (idempotency) |
| 500 | Internal engine error |

---

### 3.4  Get Current Game State  

```
GET /api/v1/games/{gameId}
```

**Response (200 OK)**  

```json
{
  "gameId": "c3d9f2a1-6b8e-4d5a-9f3c-1e2b3c4d5e6f",
  "status": "active",
  "boardFEN": "rn... b KQkq - 1 1",
  "turn": "black",
  "moveHistory": [
    {
      "moveId": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
      "from": "e2",
      "to": "e4",
      "promotion": null,
      "playerId": "uuid-white",
      "timestamp": "2026-11-07T12:37:12Z"
    }
    // … more moves
  ],
  "players": {
    "white": { "id": "uuid-white", "displayName": "Alice" },
    "black": { "id": "uuid-black", "displayName": "Bob" }
  },
  "createdAt": "2026-11-07T12:34:56Z",
  "startedAt": "2026-11-07T12:36:01Z",
  "lastMoveAt": "2026-11-07T12:37:12Z"
}
```

| Status | Meaning |
|--------|---------|
| 200 | Game data returned |
| 404 | Game not found |
| 401 | Unauthorized |

---

### 3.5  List Active Games for a Player  

```
GET /api/v1/players/{playerId}/games?status=active|completed
```

**Response (200 OK)**  

```json
{
  "playerId": "uuid-white",
  "games": [
    {
      "gameId": "c3d9f2a1-6b8e-4d5a-9f3c-1e2b3c4d5e6f",
      "opponent": { "id": "uuid-black", "displayName": "Bob" },
      "status": "active",
      "turn": "black",
      "boardFEN": "rn... b KQkq - 1 1",
      "lastMoveAt": "2026-11-07T12:37:12Z"
    }
    // … other games
  ]
}
```

| Status | Meaning |
|--------|---------|
| 200 | List returned |
| 401 | Unauthorized |
| 404 | Player not found |

---

### 3.6  (Optional) Realtime Move Push – WebSocket  

**Endpoint**: `wss://chess.example.com/api/v1/games/{gameId}/ws`  

- Client sends JWT as first message: `{ "type": "auth", "token": "<jwt>" }`.  
- Server replies with `auth_ok` or `auth_error`.  
- Subsequent messages: `{ "type": "move", "payload": { …same as POST /moves… } }`.  
- Server pushes: `{ "type": "update", "payload": { "boardFEN": "...", "turn": "white", "moveNumber": 3 } }`.  

*When the WebSocket is unavailable, the client must poll `GET /games/{gameId}` every 3 seconds (fallback).*

---  

## 4️⃣  Realistic Mock Fallbacks & Offline Mode  

| Mock Endpoint | Simulated Latency | Sample Payload |
|---------------|-------------------|----------------|
| `POST /games` | 200 ms | Returns a static `gameId: "mock-game-001"` with a start‑position FEN. |
| `POST /games/:id/moves` | 150 ms | Echoes back the move, increments `moveNumber`, flips `turn`. |
| `GET /games/:id` | 120 ms | Returns the stored mock board state from `localStorage`. |
| Random Timeout | 5 s (2 % of calls) | Returns HTTP 504 with `{ "error":"Mock timeout – client should retry" }`. |

**Implementation Tips**

* Store mock games in `window.localStorage` under key `chessMockGames`.  
* On each successful real‑API call, sync the mock store so offline mode stays up‑to‑date.  
* Provide a **debug flag** (`?mock=true`) to force mock responses for QA.

---  

## 5️⃣  Data Sanitization & Payload Typing  

| Field | Type | Constraints |
|-------|------|-------------|
| `gameId`, `playerId`, `moveId` | `string` | UUID v4 regex `/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i` |
| `displayName` | `string` | 1‑30 characters, no control chars (`/^[\w\s.-]{1,30}$/`) |
| `from`, `to` | `string` | Algebraic square regex `/^[a-h][1-8]$/` |
| `promotion` | `string` (optional) | Enum `["Q","R","B","N"]` |
| `timeControl.initialMinutes` | `integer` | 0‑180 |
| `timeControl.incrementSeconds` | `integer` | 0‑60 |
| `boardFEN` | `string` | Valid FEN pattern (use chess‑engine library for server‑side validation) |
| `status` | `string` | Enum `["pending","active","completed","draw","checkmate","stalemate"]` |
| `turn` | `string` | Enum `["white","black"]` |
| `createdAt`, `startedAt`, `timestamp` | `string` | ISO‑8601 UTC (`/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/`) |

All request bodies must be **strict** (additionalProperties: false).  

---  

## 6️⃣  Database Schema (Relational)  

> **Assumption:** PostgreSQL (or any SQL DB) – schema can be ported to DynamoDB, Firestore, etc.

### 6.1  Tables  

| Table | Primary Key | Description |
|-------|-------------|-------------|
| **players** | `id` (UUID) | Stores immutable player info. |
| **games** | `id` (UUID) | Core game metadata. |
| **game_players** | `(game_id, player_id)` (composite) | Links players to a game, stores colour (`white`/`black`). |
| **moves** | `id` (UUID) | Chronological list of moves per game. |
| **game_state** | `game_id` (FK) | Cached latest FEN, turn, timestamps for quick reads. |

### 6.2  Detailed Column Definitions  

#### `players`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `UUID` | PK, generated `gen_random_uuid()` |
| `display_name` | `VARCHAR(30)` | NOT NULL |
| `created_at` | `TIMESTAMPTZ` | DEFAULT `NOW()` |

#### `games`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `UUID` | PK |
| `status` | `VARCHAR(12)` | CHECK (`status` IN ('pending','active','completed','draw','checkmate','stalemate')) |
| `initial_minutes` | `SMALLINT` | NOT NULL, DEFAULT 0 |
| `increment_seconds` | `SMALLINT` | NOT NULL, DEFAULT 0 |
| `created_at` | `TIMESTAMPTZ` | DEFAULT `NOW()` |
| `started_at` | `TIMESTAMPTZ` | NULLABLE |
| `completed_at` | `TIMESTAMPTZ` | NULLABLE |

#### `game_players`

| Column | Type | Constraints |
|--------|------|-------------|
| `game_id` | `UUID` | FK → `games.id` ON DELETE CASCADE |
| `player_id` | `UUID` | FK → `players.id` ON DELETE CASCADE |
| `color` | `VARCHAR(5)` | CHECK (`color` IN ('white','black')) |
| **PK** | `(game_id, player_id)` |  |

#### `moves`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `UUID` | PK |
| `game_id` | `UUID` | FK → `games.id` ON DELETE CASCADE |
| `player_id` | `UUID` | FK → `players.id` |
| `move_number` | `INT` | NOT NULL |
| `from_sq` | `CHAR(2)` | NOT NULL |
| `to_sq` | `CHAR(2)` | NOT NULL |
| `promotion` | `CHAR(1)` | NULLABLE, CHECK (`promotion` IN ('Q','R','B','N')) |
| `fen_after` | `TEXT` | NOT NULL |
| `created_at` | `TIMESTAMPTZ` | DEFAULT `NOW()` |
| **UNIQUE** | `(game_id, move_number)` |  |

#### `game_state` (cached)

| Column | Type | Constraints |
|--------|------|-------------|
| `game_id` | `UUID` | PK, FK → `games.id` |
| `current_fen` | `TEXT` | NOT NULL |
| `turn` | `VARCHAR(5)` | CHECK (`turn` IN ('white','black')) |
| `last_move_at` | `TIMESTAMPTZ` | NOT NULL |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT `NOW()` ON UPDATE `NOW()` |

### 6.3  Integrity Rules  

* A game cannot transition to `active` unless **exactly two** rows exist in `game_players` with distinct colours.  
* `move_number` must increment by **1** for each new move; DB trigger can enforce monotonicity.  
* `promotion` may only be supplied when the moving piece is a pawn reaching the 8th/1st rank (validated by the chess engine, not DB).  
* On game completion (`status` → `completed`/`draw`/`checkmate`/`stalemate`), `completed_at` is set automatically via trigger.

---  

## 7️⃣  Realistic Seed Data (Mock & DB)  

### 7.1  Players (JSON for mock store)

```json
[
  { "id": "1a2b3c4d-1111-2222-3333-444455556666", "displayName": "Alice",   "createdAt": "2026-10-20T09:15:00Z" },
  { "id": "7e8f9a0b-7777-8888-9999-aaaabbbbcccc", "displayName": "Bob",     "createdAt": "2026-10-21T10:20:30Z" },
  { "id": "ddee1122-5555-6666-7777-88889999aaaa", "displayName": "Carlos",  "createdAt": "2026-10-22T11:45:12Z" }
]
```

### 7.2  Games (