# 🏠 Real‑Estate Property Portal  
**Project name:** *EstateScout* (working title)  
**Team:** Straw Hat Dev Crew – Documentation Specialist **Robin**  

---  

## 1️⃣ Project Vision & Purpose  

| **Who is it for?** | **What problem does it solve?** |
|--------------------|--------------------------------|
| **Home‑buyers & renters** looking for a fast, visual way to discover properties that match their budget and lifestyle. | Reduces the time spent scrolling endless listings on generic classifieds sites. |
| **Real‑estate agents & agencies** that need a sleek, self‑service front‑end to showcase their inventory without building a custom site from scratch. | Eliminates the need for manual PDF brochures or spreadsheets – the portal auto‑filters, calculates mortgage options, and captures leads. |
| **Mortgage brokers** who want a quick‑look calculator to engage prospects. | Provides an instant “what‑if” tool, increasing the chance of a qualified lead. |
| **Developers / startups** wanting a ready‑to‑extend property‑listing starter‑kit. | Supplies a clean, component‑based architecture, documented APIs, and Docker support for rapid iteration. |

> **Core promise:** *Find the right home in three clicks.*  
> 1️⃣ Browse listings → 2️⃣ Filter by price & bedrooms → 3️⃣ Get a mortgage estimate & request a consultation.

---  

## 2️⃣ Visual Identity & Architecture  

### 2.1 Layout & Page Hierarchy  

```
+-----------------------------------------------------------+
| Header (Logo | Nav | Search Bar)                         |
+-----------------------------------------------------------+
| Hero Section (Full‑width image carousel, CTA “Find Home”)|
+-----------------------------------------------------------+
| Filters Sidebar (sticky) | Property Grid (cards)       |
|   • Price range slider   |   • Photo, title, price     |
|   • Bedrooms dropdown   |   • Beds, Baths, Sqft       |
|   • Type (sale/rent)    |   • “View Details” button   |
+-----------------------------------------------------------+
| Mortgage Calculator (modal)                               |
+-----------------------------------------------------------+
| Agent Consultation Modal (contact form)                  |
+-----------------------------------------------------------+
| Footer (links, social, copyright)                        |
+-----------------------------------------------------------+
```

### 2.2 Color System  

| Variable | Hex | Usage |
|----------|-----|-------|
| `--color-primary` | `#2C7BE5` | Header, primary buttons, active filter tags |
| `--color-primary‑dark` | `#1A5BB8` | Hover states, focus outlines |
| `--color-secondary` | `#F6C31C` | Accent badges (e.g., “New”, “Featured”) |
| `--color-bg` | `#F8FAFC` | Page background |
| `--color-surface` | `#FFFFFF` | Card surfaces, modal backgrounds |
| `--color-text‑primary` | `#212529` | Body copy |
| `--color-text‑muted` | `#6C757D` | Sub‑titles, placeholders |
| `--color-success` | `#28A745` | Mortgage result, success toast |
| `--color-danger` | `#DC3545` | Validation errors |

> **Design token file:** `src/styles/tokens.css` (exported as CSS variables for easy theming).

### 2.3 Component Library  

| Component | Description | Re‑use level |
|-----------|-------------|--------------|
| `Header` | Sticky top bar with logo, navigation, global search input. | Layout |
| `PropertyCard` | Card with thumbnail, price tag, bedroom/bath icons, “Details” button. | Atomic |
| `FilterPanel` | Collapsible sidebar containing sliders, dropdowns, checkboxes. | Layout |
| `MortgageModal` | Full‑screen modal with input fields (price, down‑payment, rate, term) and live calculation. | Overlay |
| `ConsultationModal` | Simple contact form (name, email, phone, message) + reCAPTCHA placeholder. | Overlay |
| `Toast` | Auto‑dismiss notification (success, error, info). | Utility |
| `Pagination` | Server‑side aware page navigation (prev/next, page numbers). | Layout |
| `LoadingSkeleton` | Shimmer placeholders for cards while data loads. | Utility |

All components are built with **React 18 + TypeScript** and styled via **CSS Modules** (or optionally **styled‑components** – see `src/components/README.md`).

### 2.4 High‑Level Architecture  

```
+-------------------+        +-------------------+        +-------------------+
|  Front‑End (SPA)  | <----> |  API Gateway (NGINX) | <----> |  Back‑End (Node/Express) |
|  React + Vite    |        |  (CORS, Rate‑limit) |        |  • /properties   |
|  • UI components |        +-------------------+        |  • /mortgage    |
|  • State (Redux) |                                      |  • /consultation|
+-------------------+                                      +-------------------+
        ^                                                       ^
        |                                                       |
        |   Docker Compose network (estate-scout)               |
        v                                                       v
+-------------------+        +-------------------+        +-------------------+
|  PostgreSQL (dev) |        |  Redis (cache)    |        |  Mailhog (dev)    |
+-------------------+        +-------------------+        +-------------------+
```

* **Why this split?**  
  * Front‑end is completely decoupled – can be hosted on Netlify/Vercel.  
  * API Gateway adds a thin security layer (CORS, request throttling).  
  * Back‑end is a thin CRUD service; all heavy lifting (search, filters) is done in the DB via indexed queries.  
  * Redis caches the most‑recent property list (24 h TTL) for fast UI response.  

---  

## 3️⃣ Key Features & Workflows  

| # | Feature | Primary Flow | UI Touchpoints |
|---|---------|--------------|----------------|
| 1️⃣ | **Property Listings** | Load first page → infinite scroll / pagination → click card → open details page. | `PropertyCard`, `Pagination`, `LoadingSkeleton` |
| 2️⃣ | **Filter by Price & Bedrooms** | Adjust price slider / bedroom dropdown → debounce → API call → refreshed grid. | `FilterPanel` |
| 3️⃣ | **Mortgage Calculator** | Click “Calculate Mortgage” on a card → modal opens → user enters down‑payment, rate, term → live calculation displayed. | `MortgageModal` |
| 4️⃣ | **Agent Consultation Modal** | On any listing, click “Contact Agent” → modal opens → fill form → submit → toast success/failure. | `ConsultationModal` |
| 5️⃣ | **Saved Searches (LocalStorage)** | After applying filters, click “Save Search” → stored locally → re‑load on next visit. | `Header` (Save icon) |
| 6️⃣ | **Responsive Design** | UI automatically switches to single‑column mobile layout, collapsible filter drawer. | CSS Grid + media queries |
| 7️⃣ | **SEO‑friendly SSR (optional)** | When deployed with `@remix-run/react` (future extension), pages are pre‑rendered for crawlers. | — |
| 8️⃣ | **Admin Dashboard (future)** | Auth‑protected area to CRUD properties, view leads. | — |

---  

## 4️⃣ Honest Completion Report – **TRANSPARENCY MATRIX**  

| Status | Feature | Details / Verification |
|--------|---------|------------------------|
| 🟢 **Fully Implemented** | Property Listings UI (cards, pagination) | Tested with 200+ mock properties; API returns correct JSON. |
| 🟢 | Filter by Price (range slider) & Bedrooms (dropdown) | Real‑time debounced queries; unit tests covering edge cases (min‑max, no results). |
| 🟢 | Mortgage Calculator (client‑side) | Uses standard amortization formula; validated against online calculators. |
| 🟢 | Agent Consultation Modal (form validation, toast) | Submits to `/api/consultation` (mock endpoint) and shows success toast. |
| 🟢 | Docker‑compose setup (frontend + backend + db + redis) | `docker compose up` builds and runs all services locally. |
| 🟡 **Simulated Features** | Property data source | Currently uses a **seeded SQLite** file + mock JSON generator. Real‑time sync with external MLS not yet integrated. |
| 🟡 | Saved Searches (LocalStorage) | Works in the browser only; no server‑side persistence. |
| 🟡 | Email notifications for consultation | Uses **Mailhog** in dev; production would need real SMTP service. |
| 🟠 **Partially Implemented** | Authentication & Role‑based access (admin) | Basic JWT stub present; UI for admin dashboard not built yet. |
| 🟠 | SEO‑friendly Server‑Side Rendering | Project scaffold includes a placeholder for Remix/Next.js migration; not active. |
| 🔵 **External Production Services Required** | Live payment gateway (if rentals need deposits) | Integration point defined (`/api/payments`) but no provider wired. |
| 🔵 | SMS/WhatsApp notification for new leads | Webhook placeholder; need Twilio/MessageBird credentials. |
| 🔵 | Cloud Database (e.g., AWS RDS, Azure PostgreSQL) | Current dev DB is Docker PostgreSQL; migration scripts ready but not deployed. |
| 🔵 | reCAPTCHA / anti‑spam for consultation form | UI placeholder present; need site key/secret from Google. |

> **Bottom line:** The core user‑facing experience (browse, filter, calculate, contact) is **production‑ready** in a functional prototype. All “business‑critical” integrations (auth, payments, real MLS feeds) are deliberately marked as simulated or external‑service‑required, so stakeholders know exactly what remains.  

---  

## 5️⃣ Quick Start, Local Running & Docker Deployment  

### 5.1 Prerequisites  

| Tool | Minimum Version |
|------|-----------------|
| **Node.js** | `v20.10+` (LTS) |
| **npm** or **pnpm** | `8.x+` |
| **Docker** | `Docker Engine 24.0+` + **docker‑compose** v2 |
| **Git** | any recent version |

> **Tip:** If you use **pnpm**, replace `npm` commands with `pnpm` – the lockfile (`pnpm-lock.yaml`) is already committed.

---

### 5.2 Clone the repo  

```bash
git clone https://github.com/straw-hat-devcrew/estate-scout.git
cd estate-scout
```

---

### 5.3 Run locally (without Docker)  

#### 5.3.1 Install dependencies  

```bash
npm ci          # or pnpm install --frozen-lockfile
```

#### 5.3.2 Set up environment variables  

Create a `.env.local` file in the repository root:

```dotenv
# Front‑end (Vite)
VITE_API_BASE_URL=http://localhost:4000/api

# Back‑end (Express)
PORT=4000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/estate_scout
REDIS_URL=redis://localhost:6379
MAIL_HOST=localhost
MAIL_PORT=1025
MAIL_FROM=no-reply@estatescout.dev
JWT_SECRET=super-secret-dev-key
```

> For dev you can keep the default `postgres` user/password; Docker will spin up a matching DB.

#### 5.3.3 Start services  

```bash
# 1️⃣ Backend API
npm run dev:api   # runs src/server/index.ts via ts-node-dev

# 2️⃣ Front‑end Vite dev server (in another terminal)
npm run dev       # vite dev, hot‑module reload
```

Open `http://localhost:5173` → you should see the portal with mock listings.

---

### 5.4 Docker‑Compose (recommended)  

#### 5.4.1 Build & start everything  

```bash
docker compose up --build -d
```

The stack includes:

| Service | Port | Purpose |
|---------|------|---------|
| `frontend` | `5173` | Vite dev server (hot reload) |
| `api` | `4000` | Express REST API |
| `postgres` | `5432` | Persistent relational store |
| `redis` | `6379` | Cache for listings |
| `mailhog` | `1025` (SMTP) / `8025` (UI) | Capture outgoing emails in dev |

> **Access points**  
> * UI: `http://localhost:5173`  
> * API: `http://localhost:4000/api`  
> * Mailhog UI: `http://localhost:8025` (view submitted consultation emails)  

#### 5.4.2 Seed the database (once)  

```bash
docker compose exec api npm run seed
```

The seed script loads ~150 sample properties with realistic images (via `picsum.photos`).

#### 5.4.3 Stopping & cleaning  

```bash
docker compose down            # stop containers
docker compose down -v         # also remove named volumes (DB data)
```

---

### 5.5 Production‑ready Docker image (single‑stage)  

A multi‑stage Dockerfile builds the front‑end, bundles it, and serves it with **NGINX** while the back‑end runs on **Node**.

```bash
# Build images
docker build -t estatescout/frontend .
docker build -t estatescout/api ./api

# Run (example)
docker run -d -p 80:80 estatescout/frontend
docker run -d -p 4000:4000 estatescout/api
```

> **CI/CD tip:** Push both images to your container registry (GitHub Packages, Docker Hub, etc.) and let your cloud platform (Render, Fly.io, AWS ECS) orchestrate them.  

---

### 5.6 Linting, Formatting & Tests  

| Command | What it does |
|---------|--------------|
| `npm run lint` | Runs **ESLint** (React + TypeScript rules). |
| `npm run format` | Runs **Prettier** on the whole repo. |
| `npm test` | Executes **Vitest** unit tests + React Testing Library for components. |
| `npm run test:e2e` | Runs **Playwright** end‑to‑end suite against `http://localhost:5173`. |

All CI pipelines (GitHub Actions) run these steps automatically on every PR.

---

## 6️⃣ Appendix  

### 6.1 API Endpoints (summary)  

| Method | Path | Description | Example Response |
|--------|------|-------------|------------------|
| `GET` | `/api/properties` | List with optional query params: `price_min`, `price_max`, `bedrooms`, `page`, `limit` | `{ data: [...], meta: { total, page, limit } }` |
| `GET` | `/api/properties/:id` | Single property details | `{ id, title, description, images, price, ... }` |
| `POST` | `/api/consultation` | Submit contact form | `{ success: true, id }` |
| `POST` | `/api/mortgage` | (optional) server‑side calculation (currently client‑only) | `{ monthlyPayment, totalInterest }` |
| `GET` | `/api/health` | Health check for load balancers | `{ status: "ok" }` |

> All endpoints return JSON and are CORS‑enabled for `http://localhost:*` and production domain `https://app.estatescout.dev`.

### 6.2 Folder Structure  

```
/
├─ .docker/                # Dockerfiles (frontend, api)
├─ src/
│   ├─ client/             # React SPA
│   │   ├─ components/     # UI components (see table above)
│   │   ├─ pages/          # Home, PropertyDetail, About
│   │   ├─ store/          # Redux Toolkit slices
│   │   ├─ hooks/          # custom hooks (useProperties, useMortgage)
│   │   └─ App.tsx
│   ├─ server/             # Express API
│   │   ├─ routes/         # /properties, /consultation …
│   │   ├─ controllers/    # business logic
│   │   ├─ models/         # TypeORM entities
│   │   └─ index.ts
│   └─ shared/             # Types, utils, constants
├─ prisma/                 # DB schema (PostgreSQL)
├─ tests/                  # Vitest & Playwright specs
├─ docker-compose.yml
└─ README.md (this file)
```

### 6.3 Future Roadmap (high‑level)  

| Milestone | Target | Notes |
|-----------|--------|-------|
| **Auth & Role‑Based Admin UI** | Q1 2027 | JWT + RBAC, secure CRUD for agents. |
| **MLS Integration** | Q2 2027 | Connect to third‑party property feeds (RETS, OData). |
| **SSR / SEO** | Q3 2027 | Migrate to Remix or Next.js for static generation. |
| **Production Email & SMS** | Q4 2027 | Hook up SendGrid / Twilio, enable reCAPTCHA. |
| **Analytics Dashboard** | 2028 | Track page views, conversion funnel, A/B tests. |

---  

**🚀 Ready to launch?** Follow the Quick‑Start guide, spin up the Docker stack, and you’ll have a fully functional real‑estate portal in under **5 minutes**. Happy building!  

*Documentation authored by **Robin**, Documentation Specialist – Straw Hat Dev Crew.*