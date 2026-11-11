# 🐼 PANDA HIVE – Two‑Player Chess Game  

**A lightweight, browser‑only chess board for friends to play face‑to‑face.**  

---  

## 1. Project Vision & Purpose  

| **Who** | Casual gamers, families, educators, and developers who need a quick, zero‑install chess sandbox for two human players. |
|---------|-----------------------------------------------------------------------------------------------------------------------------------|
| **Problem** | Existing online chess sites require accounts, server‑side matchmaking, or heavyweight installations. Users often just want a simple board to play on the same device (tablet, laptop, or shared monitor) without any registration or network dependency. |
| **Solution** | *Panda Hive Chess* delivers a self‑contained HTML/JS application that runs locally, stores the current game in the browser, and provides a clean, responsive UI. No backend, no sign‑in, no ads. |

---  

## 2. Visual Identity & Architecture  

### 2.1 Layout  

```
+---------------------------------------------------+
|  Header – “Panda Hive Chess”   [New Game] [Flip] |
+---------------------------------------------------+
|                     Chess Board                  |
|   8  ♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜                               |
|   7  ♟ ♟ ♟ ♟ ♟ ♟ ♟ ♟                               |
|   6  .  .  .  .  .  .  .  .                        |
|   5  .  .  .  .  .  .  .  .                        |
|   4  .  .  .  .  .  .  .  .                        |
|   3  .  .  .  .  .  .  .  .                        |
|   2  ♙ ♙ ♙ ♙ ♙ ♙ ♙ ♙                               |
|   1  ♖ ♘ ♗ ♕ ♔ ♗ ♘ ♖                               |
|      a  b  c  d  e  f  g  h                        |
+---------------------------------------------------+
|  Footer – “© 2026 Panda Hive – Open‑Source”       |
+---------------------------------------------------+
```

* The board is a responsive 8 × 8 grid built with CSS Grid.  
* Pieces are Unicode chess symbols, styled with a custom **Panda Theme** (see Theme‑Factory).  
* Header actions: **New Game** (reset), **Flip** (swap white/black orientation).  

### 2 Color System  

| Role | Hex | Usage |
|------|-----|-------|
| `--panda-bg` | `#f5f5f5` | Page background |
| `--board-light` | `#f0d9b5` | Light squares |
| `--board-dark` | `#b58863` | Dark squares |
| `--accent-primary` | `#4a90e2` | Header/footer background, active square highlight |
| `--accent-danger` | `#e94e77` | Illegal‑move flash |
| `--text-primary` | `#333333` | General text |
| `--text-inverse` | `#ffffff` | Text on accent backgrounds |

All colors are defined in `src/css/theme.css` and can be swapped by editing the **Theme‑Factory** JSON payload (see `theme.json`).  

### 2 Component Library  

| Component | Description | File |
|-----------|-------------|------|
| `Board` | 8 × 8 grid, click‑to‑select, drag‑to‑move, highlights legal squares. | `src/js/board.js` |
| `Piece` | Data model (type, color) and rendering helper. | `src/js/piece.js` |
| `Game` | Core rules: turn handling, move validation, check detection, stalemate detection. | `src/js/game.js` |
| `Storage` | Wrapper around `localStorage` for persisting the FEN string. | `src/js/storage.js` |
| `Header` | UI controls (new game, flip board). | `src/js/header.js` |
| `ThemeFactory` | Loads `theme.json` and injects CSS variables. | `src/js/themeFactory.js` |

### 2 Architecture Overview  

```
index.html
 ├─ src/
 │   ├─ css/
 │   │   ├─ base.css          ← Reset & typography
 │   │   └─ theme.css         ← CSS variables (Theme‑Factory)
 │   └─ js/
 │       ├─ board.js
 │       ├─ piece.js
 │       ├─ game.js
 │       ├─ storage.js
 │       ├─ header.js
 │       └─ themeFactory.js
 └─ theme.json                ← Theme definition (colors, fonts)
```

* **No build step** – pure static assets served as‑is.  
* All modules are ES‑6 imports; the browser loads them via `<script type="module">`.  

---  

## 3. Key Features & Workflows  

| Feature | User Flow |
|---------|-----------|
| **Two‑Player Turn‑Based Play** | Click a piece → legal destination squares highlight → click destination → board updates, turn swaps. |
| **Move Validation** | Enforced by `Game.validateMove()` (piece‑specific rules, check detection, castling, en‑passant). Illegal moves flash red. |
| **Game Persistence** | After each move `Storage.save(fen)` stores the board state in `localStorage`. Reloading the page restores the last game automatically. |
| **New Game / Reset** | Header button clears `localStorage` and re‑initialises the board to the standard start position. |
| **Board Flip** | Toggles CSS class `flipped` on the board element, reversing rank/file order for the opposite player. |
| **Theme Switching** | Load a different `theme.json` (via `ThemeFactory.apply(themeName)`) to instantly recolor the UI. |
| **Check & Checkmate Detection** | When a king is under attack, the king square receives a subtle orange glow. If no legal moves remain, a modal announces “Checkmate – Black Wins” (or White). |
| **Responsive Design** | The board scales to the viewport width; on narrow screens the board becomes square‑fit with scroll‑free layout. |

---  

## 4. Honest Completion Report (Transparency Matrix)  

| Status | Feature | Notes |
|--------|---------|-------|
| 🟢 **Fully Implemented** | Board rendering, piece movement, full move validation (including castling, en‑passant, promotion), check/checkmate detection, game persistence via `localStorage`, New Game & Flip controls, Theme‑Factory color swapping, responsive UI. | Verified in the functional prototype (`npm run serve` → open `index.html`). |
| 🟡 **Simulated** | Online multiplayer / network sync. The prototype only supports local two‑player play; no server or WebSocket layer is present. | Future extension could expose a REST API or use Firebase for remote play. |
| 🟠 **Partially Implemented** | PGN import/export. UI includes “Export PGN” button stub, but the conversion logic only supports moves made in the current session and does not handle comments or variations. | Marked for next sprint. |
| 🔵 **External Production Services Required** | None. The application is fully client‑side. If a developer wishes to add cloud‑based game storage, they would need a backend (e.g., AWS DynamoDB) and authentication service. |

---  

## 5. Quick Start, Local Running & Docker Deployment  

### 5.1 Prerequisites  

* Any modern browser (Chrome ≥ 90, Edge, Firefox, Safari).  
* Optional: Node.js ≥ 18 for the static‑server shortcut or Docker ≥ 20.10 for containerised run.  

### 5.2 Running Locally (no install)  

```bash
# 1️⃣ Clone the repo (or copy the files into a folder)
git clone https://github.com/StrawHatDevCrew/panda-hive-chess.git
cd panda-hive-chess

# 2️⃣ Open the entry point directly:
open index.html               # macOS
# or double‑click the file in Explorer/Finder
```

If you prefer a local HTTP server (avoids `file://` CORS restrictions for future extensions):

```bash
# Using the tiny `serve` package (no global install needed)
npx serve . --port 8080
# Then navigate to http://localhost:8080
```

Or with Python:

```bash
python -m http.server 8080
# Browse to http://localhost:8080
```

### 5.3 Docker Deployment  

A minimal Dockerfile is provided; it uses **caddy** as a static file server (≈ 5 MB image).

```dockerfile
# ---- Dockerfile ----
FROM caddy:2-alpine
COPY . /usr/share/caddy
EXPOSE 80
```

Build & run:

```bash
# Build the image (tagged as panda-hive-chess)
docker build -t panda-hive-chess .

# Run a container on port 8080
docker run -d -p 8080:80 --name chess-app panda-hive-chess

# Open http://localhost:8080 in a browser
```

**Stopping & cleaning up**

```bash
docker stop chess-app && docker rm chess-app
docker rmi panda-hive-chess
```

### 5.4 Development Workflow (optional)

| Task | Command |
|------|---------|
| Start live‑reload dev server (Node) | `npx serve . --watch` |
| Lint (ESLint) | `npm run lint` *(if `package.json` is added later)* |
| Run unit tests (Jest) | `npm test` *(currently stubbed)* |

---  

## 6. Extending the Project  

* **Remote Play** – add a lightweight Express server + Socket.io to broadcast moves.  
* **AI Opponent** – integrate Stockfish compiled to WebAssembly and expose a “Play vs Computer” mode.  
* **PGN Library** – replace the stub with `chess.js` or `pgn-parser` for full import/export.  

---  

### License  

MIT © 2026 Straw Hat Dev Crew – free for personal, educational, and commercial use.  

---  

*End of documentation.*