## 📄 Simple Two‑Player Chess Game – Design & Integration Blueprint  

Below is a **complete, production‑ready specification** that lets you drop‑in a tiny web‑based chess board (HTML + JavaScript) and automatically generate a **styled Word report** of the finished game using the on‑demand skills you have just resolved:

| Resolved Skill | Purpose in this solution |
|----------------|--------------------------|
| **DOCX** (anthropics/Document Skills) | Create a `.docx` file that contains the final board diagram, move list, player details and a custom theme. |
| **THEME‑FACTORY** (anthropics/Creative & Design) | Generate a visual theme (colors, fonts, header/footer) that is applied to the Word document. |

The document is generated **entirely via the skills** – no manual installation or local tooling required.

---

## 1️⃣ High‑Level Architecture  

```
+-------------------+          +-------------------+          +-------------------+
|  Browser (HTML/JS|  ↔  HTTP |  Chess‑API (REST) |  ↔  HTTP |  DOCX & THEME‑   |
|  + UI)            |          |  (game state,     |          |  FACTORY Skills) |
|                   |          |   move validation)|          |                   |
+-------------------+          +-------------------+          +-------------------+
```

* **Frontend** – static HTML + JS (no framework) that talks to the REST API.  
* **Backend** – tiny Node/Express service exposing the **Chess‑API** (see §2).  
* **Integration Layer** – after a game ends, the frontend calls the **DOCX** skill, passing a JSON payload that includes the final PGN and a theme request to **THEME‑FACTORY**. The skill returns a binary `.docx` that can be downloaded instantly.

---

## 2️⃣ Chess‑API – RESTful Contract  

| Method | Path | Description | Request Body | Success Response | Errors |
|--------|------|-------------|--------------|------------------|--------|
| **POST** | `/games` | Create a new game | `{ "white": "Alice", "black": "Bob" }` | `201 Created` <br>`{ "gameId": "uuid", "fen": "startFEN", "turn": "w", "status": "ongoing" }` | `400 Bad Request` (missing names) |
| **GET** | `/games/{gameId}` | Get current state | – | `200 OK` <br>`{ "gameId": "...", "fen": "...", "turn": "w|b", "moves": ["e4","e5",…], "status":"ongoing|finished" }` | `404 Not Found` |
| **POST** | `/games/{gameId}/move` | Submit a move | `{ "from": "e2", "to": "e4", "promotion": "q?" }` | `200 OK` <br>`{ "fen": "...", "turn":"b", "moveSAN":"e4", "status":"ongoing|checkmate|stalemate" }` | `400 Bad Request` (illegal move) <br>`404 Not Found` |
| **POST** | `/games/{gameId}/report` | Generate a DOCX report (calls DOCX + THEME‑FACTORY) | `{ "themeId": "classic‑dark" }` | `200 OK` <br>`{ "downloadUrl": "https://…/report.docx", "expiresIn": 3600 }` | `404 Not Found` <br>`500 Server Error` |

### 2.1 Payload & Data Types  

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `gameId` | `string` (UUID v4) | ✅ | Must be a valid UUID |
| `white` / `black` | `string` | ✅ | 1‑30 chars, letters, spaces only (`^[A-Za-z ]+$`) |
| `fen` | `string` | ✅ | Standard FEN format |
| `turn` | `"w"` \| `"b"` | ✅ | – |
| `moves` | `string[]` | ✅ | SAN notation (`e4`, `Nf3`, `O-O`, …) |
| `status` | `"ongoing"` \| `"checkmate"` \| `"stalemate"` \| `"draw"` | ✅ | – |
| `from` / `to` | `string` | ✅ | Square notation `a1‑h8` |
| `promotion` | `"q"` \| `"r"` \| `"b"` \| `"n"` \| `null` | optional | Only for pawn reaching last rank |
| `themeId` | `string` | ✅ | Must match a theme defined in THEME‑FACTORY (see §4) |

### 2.2 HTTP Status Summary  

| Code | Meaning |
|------|---------|
| **200** | Request succeeded (GET/POST move/report) |
| **201** | Game created |
| **400** | Validation error (illegal move, missing fields) |
| **404** | Game not found |
| **500** | Unexpected server error (e.g., DOCX skill failure) |

---

## 3️⃣ Realistic Mock Fallbacks (Offline Development)  

When the live backend is unavailable, the frontend can switch to **local mock mode**. The mock layer returns the same shape as the live API with a **simulated latency of 150‑300 ms**.

```json
// GET /games/{gameId} – mock response
{
  "gameId": "c2a1e6f3-8b44-4d9b-9e2a-7f9c4d1a5b6c",
  "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
  "turn": "b",
  "moves": ["e4"],
  "status": "ongoing"
}
```

**Timeout handling** – If a request exceeds **2 seconds**, the UI shows a toast *“Network timeout – using offline mock data”* and falls back to the mock payload.

---

## 4️⃣ THEME‑FACTORY – Theme Definition  

| Theme ID | Description | Primary Color | Secondary Color | Font |
|----------|-------------|---------------|----------------|------|
| `classic-dark` | Dark board with parchment‑style text | `#2E2E2E` | `#D4AF37` | `Georgia, serif` |
| `light‑modern` | Light, high‑contrast UI | `#FFFFFF` | `#0A84FF` | `Segoe UI, sans-serif` |

**Sample request to THEME‑FACTORY (internal to DOCX skill):**

```json
{
  "themeId": "classic-dark",
  "elements": {
    "header": "Chess Game Report",
    "footer": "Generated by Chess‑API"
  }
}
```

The skill returns a **theme package** (color palette + style XML) that the DOCX generator injects automatically.

---

## 5️⃣ DOCX Skill – Word Report Generation  

### 5.1 Expected Input Payload  

```json
{
  "template": "chess-report.docx",   // built‑in template shipped with the skill
  "data": {
    "title": "Chess Game – {{white}} vs {{black}}",
    "players": {
      "white": "{{white}}",
      "black": "{{black}}"
    },
    "date": "{{ISO8601 timestamp}}",
    "moves": [
      "1. e4 e5",
      "2. Nf3 Nc6",
      "... (full PGN) ..."
    ],
    "finalFEN": "{{fen}}",
    "outcome": "{{status}}"
  },
  "themeId": "classic-dark"
}
```

*All placeholders (`{{…}}`) are substituted by the integration layer before calling the skill.*

### 5.2 Response  

```json
{
  "docxBase64": "<base64‑encoded .docx binary>",
  "downloadUrl": "https://cdn.example.com/tmp/abcd1234.docx",
  "expiresAt": "2026-12-01T12:34:56Z"
}
```

The **downloadUrl** is a short‑lived signed URL (TTL = 1 hour).

### 5.3 Offline Mock for DOCX  

If the DOCX service cannot be reached, return a **static placeholder document** (e.g., “Report unavailable – offline mode”) encoded in base64. The UI still offers a download, letting users see the fallback.

---

## 6️⃣ Database Schema (for the Chess‑API)  

```sql
-- Table: games
CREATE TABLE games (
    id            UUID PRIMARY KEY,
    white_player  VARCHAR(30) NOT NULL,
    black_player  VARCHAR(30) NOT NULL,
    fen           TEXT NOT NULL,                -- current board FEN
    turn          CHAR(1) NOT NULL CHECK (turn IN ('w','b')),
    status        VARCHAR(12) NOT NULL
                     CHECK (status IN ('ongoing','checkmate','stalemate','draw')),
    moves         JSONB NOT NULL DEFAULT '[]',  -- array of SAN strings
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for fast lookup
CREATE INDEX idx_games_status ON games (status);
```

### 6.1 Validation Rules  

| Column | Rule |
|--------|------|
| `white_player` / `black_player` | `^[A-Za-z ]{1,30}$` |
| `fen` | Must match regex `^([rnbqkpRNBQKP1-8]+\/){7}[rnbqkpRNBQKP1-8]+ .+$` |
| `moves` | Each element must be a valid SAN token (validated server‑side with a chess engine library). |
| `status` | Enum constraint (see table). |

### 6.2 Seed Data (Realistic)  

| id (UUID) | white_player | black_player | fen (start) | turn | status | moves |
|-----------|--------------|--------------|-------------|------|--------|-------|
| `a1b2c3d4-1111-2222-3333-444455556666` | **Alice** | **Bob** | `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1` | `w` | `ongoing` | `[]` |
| `e7f8g9h0-7777-8888-9999-aaaaBBBBCCCC` | **Carol** | **Dave** | `r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 2 3` | `b` | `ongoing` | `["e4","e5","Nf3","Nc6","Bc4"]` |

*These records can be loaded into a local SQLite or Postgres dev DB for rapid prototyping.*

---

## 7️⃣ Front‑End Code (HTML + JS) – Ready to Paste  

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>🦌 Panda Hive – Simple Chess</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 2rem; }
    #board { width: 320px; margin: auto; }
    .square { width: 40px; height: 40px; float: left; line-height: 40px; text-align: center; font-size: 24px; }
    .light { background:#f0d9b5; }
    .dark  { background:#b58863; }
    #log { clear: both; margin-top: 1rem; max-height: 150px; overflow-y:auto; border:1px solid #ccc; padding: .5rem; }
    button { margin-top: .5rem; }
  </style>
</head>
<body>
<h1>Two‑Player Chess (Panda Hive Demo)</h1>

<div id="board"></div>
<div id="log"></div>
<button id="downloadReport" disabled>Download Game Report (DOCX)</button>

<script src="https://cdn.jsdelivr.net/npm/chess.js@1.0.0/chess.min.js"></script>
<script>
const apiBase = location.origin; // assumes same host, adjust if needed
let gameId = null;
let chess = new Chess();

async function createGame() {
  const res = await fetch(`${apiBase}/games`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({white:'Alice', black:'Bob'})
  });
  const data = await res.json();
  gameId = data.gameId;
  renderBoard(data.fen);
}
function renderBoard(fen) {
  const boardDiv = document.getElementById('board');
  boardDiv.innerHTML = '';
  const board = Chess().load(fen) ? Chess().load(fen).board() : chess.board();
  const files = ['a','b','c','d','e','f','g','h'];
  board.forEach((rank, rIdx) => {
    rank.forEach((piece, fIdx) => {
      const sq = document.createElement('div');
      const isLight = (rIdx + fIdx) % 2 === 0;
      sq.className = `square ${isLight ? 'light' : 'dark'}`;
      sq.dataset.square = files[fIdx] + (8 - rIdx);
      if (piece) sq.textContent = piece.type.toUpperCase().replace('P','♙').replace('N','♘')
                                   .replace('B','♗').replace('R','♖')
                                   .replace('Q','♕').replace('K','♔')
                                   .replace(/[prnbqk]/g,ch=>String.fromCharCode(ch.charCodeAt(0)-32));
      sq.onclick = () => onSquareClick(sq.dataset.square);
      boardDiv.appendChild(sq);
    });
  });
}
let selected = null;
async function onSquareClick(square) {
  if (!selected) {
    selected = square;
    document.querySelector(`[data-square="${square}"]`).style.outline = '2px solid red';
    return;
  }
  const move = { from: selected, to: square };
  // send to backend
  const res = await fetch(`${apiBase}/games/${gameId}/move`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(move)
  });
  const data = await res.json();
  if (res.ok) {
    chess.move({from: selected, to: square, promotion:'q'}); // simple promotion
    renderBoard(data.fen);
    logMove(data.moveSAN);
    if (data.status !== 'ongoing') finishGame(data.status);
  } else {
    alert('Illegal move');
  }
  document.querySelector(`[data-square="${selected}"]`).style.outline = '';
  selected = null;
}
function logMove(san) {
  const log = document.getElementById('log');
  const p = document.createElement('p');
  p.textContent = san;
  log.appendChild(p);
}
async function finishGame(status) {
  document.getElementById('downloadReport').disabled = false;
  alert(`Game finished: ${status}`);
}
document.getElementById('downloadReport').onclick = async () => {
  const res = await fetch(`${apiBase}/games/${gameId}/report`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({themeId:'classic-dark'})
  });
  const {downloadUrl}= await res.json();
  window.location = downloadUrl; // triggers download
};

createGame();
</script>
</body>
</html>
```

**What the snippet does**

1. **Creates a game** via `POST /games`.  
2. **Renders a simple board** (no piece images – Unicode symbols).  
3. **Submits moves** to `POST /games/{id}/move`. The backend validates legality using a chess engine (e.g., `chess.js`).  
4. When the game ends, **enables a button** that calls `POST /games/{id}/report`. The backend forwards a payload to the **DOCX** skill, which in turn uses **THEME‑FACTORY** to style the final document.  
5. The user receives a **downloadable `.docx`** containing the full PGN, final board diagram (FEN), player names and a nice theme.

---

## 8️⃣ Offline Development Checklist  

| Step | Action | Mock / Real |
|------|--------|--------------|
| 1️⃣ Spin up a **local Express server** that implements the API contract (use the mock responses from §3). | ✅ |
| 2️⃣ Run the HTML file in a browser (no build step needed). | ✅ |
| 3️⃣ When ready to test DOCX generation, replace the mock `/report` endpoint with a thin wrapper that **POSTs**