# 🏟️ Sports Management Portal  
**Build a complete sports‑management web‑app with live match fixtures, arena‑turf booking, team rosters, and player statistics**  

*Prepared by **Robin – Documentation Specialist** (Straw Hat Dev Crew)*  

---  

## 1️⃣ Project Vision & Purpose  

| **Who is it for?** | **What problem does it solve?** |
|--------------------|---------------------------------|
| **Sports clubs, academies, and local leagues** that need a single place to manage fixtures, bookings, rosters, and stats. | • Manual spreadsheets → data‑drift, version‑conflicts.<br>• Phone‑calls & paper forms for arena booking → double‑bookings, lost revenue.<br>• No real‑time visibility of match results → fans and sponsors stay uninformed.<br>• Disparate tools for rosters & stats → inconsistent reporting. |
| **Arena owners / facility managers** | • Centralised calendar & payment handling for turf bookings.<br>• Utilisation analytics to optimise pricing. |
| **Coaches & analysts** | • Up‑to‑date player stats & match logs for tactical decisions.<br>• Exportable CSV/JSON for deeper analysis. |
| **Fans & community** | • Live fixture feed & result notifications.<br>• Ability to view team line‑ups and player profiles. |

**Mission statement** – *“Empower community‑level sports organisations with a modern, self‑hosted portal that eliminates paperwork, prevents double‑booking, and brings live data to coaches, players, and fans.”*  

---  

## 2️⃣ Visual Identity & Architecture  

### 2.1 UI Layout & Color System  

| Component | Description | Typical Colors (Tailwind CSS) |
|-----------|-------------|--------------------------------|
| **Header** | Fixed top bar with logo, navigation, user avatar. | `bg-primary-800` (`#1E3A8A`), text `text-white` |
| **Sidebar (optional)** | Collapsible left navigation for admin users (Dashboard, Fixtures, Bookings, Teams, Stats, Settings). | `bg-gray-900`, icons `text-gray-300` |
| **Main Content** | Card‑based layout. Each page uses a grid of **cards** (fixture list, booking calendar, roster table). | Card background `bg-white` / `dark:bg-gray-800`, shadow `shadow-lg` |
| **Footer** | Minimal, links to privacy, terms, and version. | `bg-primary-900`, text `text-gray-200` |
| **Modals / Dialogs** | For create‑edit forms, confirmations. | `bg-white` with overlay `bg-black/50` |
| **Toast / Snackbar** | Success / error feedback. | Success: `bg-green-600`, Error: `bg-red-600` |

**Palette (Tailwind custom extension)**  

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e3a8a',
          900: '#172554',
        },
        accent: {
          500: '#fbbf24', // amber for call‑to‑action
        },
      },
    },
  },
};
```  

### 2.2 Component Library  

| Component | Re‑use | Props / API |
|-----------|--------|-------------|
| **`<DataTable>`** | Fixture list, roster, stats tables. | `columns`, `data`, `sortable`, `filterable`, `pagination` |
| **`<Calendar>`** | Arena booking view (month / week). | `events`, `onDateSelect`, `onEventClick` |
| **`<LiveScoreTicker>`** | Header ticker showing ongoing matches. | `matches`, `refreshInterval` |
| **`<PlayerCard>`** | Player profile thumbnail used in rosters & stats. | `player`, `showStats?` |
| **`<BookingForm>`** | Modal for creating a turf reservation. | `arenaId`, `availableSlots`, `onSubmit` |
| **`<StatsChart>`** | Bar / line charts for player performance. | `type`, `data`, `options` (uses Chart.js) |
| **`<AuthGuard>`** | HOC / wrapper to protect routes. | `requiredRoles` |

All components are built with **React 18 + TypeScript + TailwindCSS** and published under `src/components/`.  

### 2.3 High‑Level Architecture  

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (React SPA)                         │
│  ┌───────────────┐   ┌───────────────┐   ┌───────────────────────┐ │
│  │ Auth (JWT)    │   │ UI Components │   │ State (Redux Toolkit) │ │
│  └─────┬─────────┘   └─────┬─────────┘   └─────────────┬─────────┘ │
│        │                 │                       │           │
│        ▼                 ▼                       ▼           │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │               API LAYER (Axios + RTK Query)                    │ │
│  └─────┬───────────────────────┬───────────────────────┬───────┘ │
│        │                       │                       │         │
│        ▼                       ▼                       ▼         │
│  ┌───────────────┐   ┌─────────────────────┐   ┌─────────────────┐│
│  │ /auth/*       │   │ /fixtures/*         │   │ /bookings/*     ││
│  │ /teams/*      │   │ /arenas/*           │   │ /players/*      ││
│  └─────┬─────────┘   └─────┬───────────────┘   └─────┬───────────┘│
│        │                     │                       │         │
│        ▼                     ▼                       ▼         │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                     BACKEND (Node.js/Express)                 │ │
│  │  • Controllers → Services → Repositories (DAO)                │ │
│  │  • Validation (Joi)                                            │ │
│  │  • JWT Auth middleware                                          │ │
│  │  • Real‑time (Socket.io) for live scores & booking updates    │ │
│  └─────┬───────────────────────┬───────────────────────┬───────┘ │
│        │                       │                       │         │
│        ▼                       ▼                       ▼         │
│  ┌───────────────┐   ┌─────────────────────┐   ┌─────────────────┐│
│  │ PostgreSQL    │   │ Redis (cache, pub/sub)│ │ File‑store (uploads)││
│  └───────────────┘   └─────────────────────┘   └─────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

* **Real‑time** – Socket.io pushes fixture score updates and booking confirmations to connected browsers.  
* **Caching** – Redis stores “today’s fixtures” and “available slots” for sub‑second reads.  
* **File uploads** – Player avatars, arena images stored on the local filesystem (or S3 in production).  

---  

## 3️⃣ Key Features & Workflows  

| # | Feature | Core Workflow (step‑by‑step) |
|---|---------|------------------------------|
| **1** | **User Management & RBAC** | 1️⃣ Sign‑up / login (email + password).<br>2️⃣ JWT issued → stored in HttpOnly cookie.<br>3️⃣ Middleware checks `role` (admin, manager, coach, fan). |
| **2** | **Live Match Fixtures** | 1️⃣ Admin creates a fixture (teams, date, arena).<br>2️⃣ Scheduler pushes to DB.<br>3️⃣ Socket.io broadcasts `fixture:start` → LiveScoreTicker updates.<br>4️⃣ Coach can log minute‑by‑minute events (goal, card). |
| **3** | **Arena Turf Booking** | 1️⃣ User opens Calendar → selects arena & slot.<br>2️⃣ `BookingForm` validates no clash (via Redis lock).<br>3️⃣ On submit, backend writes to DB & emits `booking:confirmed`.<br>4️⃣ Email/SMS reminder (external service – see matrix). |
| **4** | **Team Rosters** | 1️⃣ Coach creates a team → adds players (search existing or create new).<br>2️⃣ Roster displayed via `<DataTable>` with filter by position.<br>3️⃣ Export → CSV/Excel. |
| **5** | **Player Statistics** | 1️⃣ During a live match, coach logs events (goal, assist, minutes).<br>2️⃣ Stats aggregated per player in DB (transactional).<br>3️⃣ Stats view shows career totals, season charts (`<StatsChart>`). |
| **6** | **Notifications** | - In‑app toast on success/failure.<br>- Real‑time push via Socket.io for booking confirmation & live scores.<br>- Optional email/SMS (external). |
| **7** | **Reporting Dashboard** | Admin can view: arena utilisation %, revenue per arena, top‑scoring players, upcoming fixtures. |
| **8** | **Responsive Design** | Mobile‑first layout; sidebar collapses; calendar swipe gestures. |
| **9** | **Internationalisation (i18n)** | Strings externalised via `react-i18next`; English & Spanish provided out‑of‑the‑box. |
| **10** | **API Documentation** | OpenAPI 3.0 spec auto‑generated (`swagger-ui`) and served at `/api-docs`. |

---  

## 4️⃣ Honest Completion Report – **Transparency Matrix**  

| Status | Feature | Notes / Verification |
|--------|---------|----------------------|
| 🟢 **Fully Implemented** | User Management (JWT, RBAC) | Tested with unit + e2e (Cypress). |
| 🟢 | Live Match Fixtures (CRUD + Socket.io live ticker) | Real‑time score updates work in dev & Docker. |
| 🟢 | Arena Turf Booking (Calendar UI, conflict detection) | Verified with concurrent booking simulation. |
| 🟢 | Team Rosters (Create/Edit, export CSV) | CSV export validated against Excel. |
| 🟢 | Player Statistics (event logging, aggregated view, charts) | Stats persist across sessions; chart updates instantly. |
| 🟢 | Notifications (in‑app toast, real‑time push) | Socket.io events received on multiple browsers. |
| 🟢 | Reporting Dashboard (utilisation, revenue) | Demo data shows correct aggregates. |
| 🟢 | Responsive Design (mobile + desktop) | Tested on Chrome dev tools (iPhone X, Pixel 4). |
| 🟢 | Internationalisation (English + Spanish) | Switching language updates all UI text. |
| 🟢 | API Documentation (OpenAPI) | Swagger UI loads spec and allows try‑out. |
| 🟡 **Simulated** | Payment processing for arena bookings | Mocked Stripe integration; data stored in DB, no real money flow. |
| 🟡 | Email / SMS notifications (reminders) | Using a **local mock service** that logs to console; real provider not wired. |
| 🟠 **Partially Implemented** | Advanced analytics (heat‑maps, predictive booking) | Basic charts present; predictive model pending (ML service). |
| 🔵 **External Production Services Required** | Cloud file storage (S3, Azure Blob) for production‑scale avatars | Current implementation uses local `uploads/` folder. |
| 🔵 | Live video streaming embed (optional) | UI placeholder only; third‑party streaming integration needed. |
| 🔵 | Production‑grade CI/CD pipeline (GitHub Actions + Docker Hub) | Repo contains workflow skeleton, not fully configured. |

> **Takeaway:** The core MVP (user management, fixtures, bookings, rosters, stats, dashboards) is **fully functional** and ready for a pilot launch. Only payment, real email/SMS, and optional advanced analytics require external services or further engineering.  

---  

## 5️⃣ Quick Start – Local Development & Docker Deployment  

### 5.1 Prerequisites  

| Tool | Minimum Version |
|------|-----------------|
| **Node.js** | `v20.14.0` (LTS) |
| **npm** | `9.x` (or `yarn` 2+) |
| **Docker** | `>= 24.0` (Docker Engine) |
| **PostgreSQL** | `13+` (if running locally, otherwise use Docker) |
| **Redis** | `6+` (optional – Docker) |

### 5.2 Clone the Repository  

```bash
git clone https://github.com/straw-hat-dev/sports‑portal.git
cd sports-portal
```

### 5.3 Environment Variables  

Create a `.env` file in the project root (copy from `.env.example`).  

```dotenv
# ------------------- Server -------------------
PORT=4000
NODE_ENV=development

# JWT
JWT_SECRET=super-secret-key
JWT_EXPIRES_IN=7d

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=portal_user
DB_PASSWORD=portal_pass
DB_NAME=portal_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Mock services (development only)
MOCK_EMAIL=true
MOCK_SMS=true
MOCK_PAYMENT=true
```

> **Tip:** When using Docker, the `.env` values are automatically injected into the containers via `docker-compose.yml`.  

### 5.4 Local Development (without Docker)  

1. **Install dependencies**  

   ```bash
   # Server
   cd server
   npm ci

   # Client
   cd ../client
   npm ci
   ```

2. **Create & migrate the database**  

   ```bash
   cd ../server
   npx prisma migrate dev --name init   # creates tables
   ```

3. **Start Redis (optional)**  

   ```bash
   docker run -d --name sports-redis -p 6379:6379 redis:6-alpine
   ```

4. **Run the API**  

   ```bash
   npm run dev   # starts at http://localhost:4000/api
   ```

5. **Run the React SPA**  

   ```bash
   cd ../client
   npm run dev   # Vite dev server at http://localhost:5173
   ```

6. **Open the app**  

   - Front‑end: <http://localhost:5173>  
   - API docs: <http://localhost:4000/api-docs>  

### 5.5 Docker‑Compose Deployment (single command)  

The repo ships a production‑ready `docker-compose.yml` that builds both front‑end and back‑end, spins up PostgreSQL and Redis, and serves the SPA via **Nginx**.

```bash
# Build images & start containers
docker compose up --build -d
```

#### What the compose file does  

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| `frontend` | `node:20-alpine` → build → static files served by `nginx:alpine` | `80` (http) | React SPA |
| `backend` | `node:20-alpine` (Express) | `4000` | API |
| `postgres` | `postgres:15-alpine` | `5432` | Relational DB |
| `redis` | `redis:7-alpine` | `6379` | Cache & pub/sub |
| `adminer` (optional) | `adminer` | `8080` | DB UI for debugging |

#### Access points  

| URL | Service |
|-----|---------|
| <http://localhost> | SPA (Nginx) |
| <http://localhost:4000/api> | API (JSON) |
| <http://localhost:4000/api-docs> | Swagger UI |
| <http://localhost:8080> | Adminer (Postgres UI) |

#### Persisted volumes  

```yaml
volumes:
  pg_data:
  redis_data:
  uploads:
```

Data survives container restarts.  

### 5.6 Running Tests  

```bash
# Backend unit + integration tests (Jest)
cd server
npm test

# Frontend component & e2e tests (Cypress)
cd ../client
npm run test:ci   # headless
```

### 5.7 Production Build (Docker)  

If you only need the **production images** (no dev tools):  

```bash
docker compose -f docker-compose.prod.yml up -d
```

*The prod compose file disables source‑maps, sets `NODE_ENV=production`, and uses a multi‑stage build to keep the final images under 120 MB.*  

### 5.8 Common Gotchas  

| Issue | Symptom | Fix |
|-------|---------|-----|
| **`Error: connect ECONNREFUSED 127.0.0.1:5432`** | Server cannot reach Postgres | Ensure `docker compose up` is running, or set `DB_HOST=host.docker.internal` when running locally on macOS/Windows. |
| **Live score not updating** | Socket.io events not received | Verify Redis is up (used as the pub/sub broker). Check browser console for CORS errors – make sure `VITE_API_URL` matches the backend URL. |
| **File uploads error** | 500 on avatar upload | In dev, `uploads/` folder must be writable (`chmod -R 777 uploads`). In prod, mount a volume (`- ./uploads:/app/uploads`). |
| **Mock email not sending** | No email in console | Set `MOCK_EMAIL=true` in `.env`. Real email service needs `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`. |

---  

## 📚 Appendix  

### A. API Endpoints (excerpt)  

| Method | Path | Description | Auth |
|--------|------|-------------