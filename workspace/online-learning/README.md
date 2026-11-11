# 📚 Straw Hat Dev Crew – **Online Learning Platform**  
**Project Code‑Name:** *StrawHat‑Learn*  
**Documentation Lead:** Robin (Documentation Specialist)  

---  

## 1️⃣ Project Vision & Purpose  

| **Who is it for?** | **What problem does it solve?** |
|--------------------|---------------------------------|
| • **Students & Lifelong Learners** who want a clean, self‑paced learning experience without signing up for a heavy SaaS platform.  <br>• **Independent instructors / content creators** who need a lightweight, zero‑cost way to publish courses. | • Eliminates the friction of “sign‑up‑and‑pay‑first” platforms – everything runs locally (or on a simple static host) and persists data in the browser. <br>• Provides a **single‑page, responsive UI** that works on desktop, tablet, and mobile. <br>• Gives learners a **dashboard** to track progress, revisit lessons, and discover new courses via search & filtering. <br>• No backend server required for the MVP – all data lives in **LocalStorage**, making the prototype instantly deployable. |

> **Bottom‑line:** A **client‑side only** learning portal that showcases core e‑learning interactions (catalog, lesson navigation, progress tracking) while staying completely **offline‑first** and **privacy‑first**.  

---  

## 2️⃣ Visual Identity & Architecture  

### 2.1 Layout Overview  

```
+-----------------------------------------------------------+
|  Header (logo | navigation | user avatar)                |
+-------------------+---------------------------------------+
|   Sidebar (mobile hidden)   |   Main Content Area          |
|   • Dashboard link          |   • Course Catalog (grid)    |
|   • My Courses               |   • Course Details modal     |
|   • Settings                |   • Lesson view (video/text) |
|                              |   • Progress bar & nav      |
+-------------------+---------------------------------------+
|  Footer (©2026 Straw Hat Dev Crew)                        |
+-----------------------------------------------------------+
```

- **Responsive breakpoints**:  
  - `≥ 1024px` – full sidebar visible.  
  - `768‑1023px` – collapsible sidebar (hamburger).  
  - `<768px` – full‑screen modal for course details; navigation drawer slides over content.  

### 2.2 Color System  

| Variable | Hex | Usage |
|----------|-----|-------|
| `--color-primary` | `#0A74DA` | Header, primary buttons, active nav items |
| `--color-primary-dark` | `#0759A5` | Hover states, focus outlines |
| `--color-accent` | `#F9C74F` | Highlight badges, progress bar fill |
| `--color-success` | `#43AA8B` | Completed lesson checkmarks |
| `--color-warning` | `#F94144` | In‑progress warning tags |
| `--color-bg` | `#F5F7FA` | Page background |
| `--color-surface` | `#FFFFFF` | Cards, modals, sidebar |
| `--color-text-primary` | `#212529` | Body copy |
| `--color-text-muted` | `#6C757D` | Sub‑text, placeholders |

> **Design note:** All colors meet WCAG AA contrast on both light and dark mode (dark mode toggles `--color-bg` ↔ `#1E1E1E`).  

### 2.3 Component Library  

| Component | Description | Re‑usability |
|-----------|-------------|--------------|
| **Header** | Fixed top bar with logo, search field, avatar dropdown. | Shared across all routes. |
| **Sidebar** | Vertical navigation (Dashboard, My Courses, Settings). Collapsible on mobile. | Imported via `components/Sidebar.jsx`. |
| **CourseCard** | Thumbnail, title, short description, rating badge. | Rendered in catalog grid. |
| **CourseModal** | Full‑screen overlay showing course outline, enrol button, and preview. | Triggered from any `CourseCard`. |
| **LessonViewer** | Video player + markdown content + “Next / Prev” navigation. | Embedded in Dashboard “My Courses”. |
| **ProgressBar** | Horizontal bar with segment markers for each lesson. | Shows % completed per course. |
| **SearchBar** | Debounced input (300 ms) that filters the catalog by title, tag, or instructor. | Used in Header & Sidebar. |
| **FilterPanel** | Collapsible check‑list for categories, difficulty, length. | Syncs with URL query string. |
| **Toast / Snackbar** | Auto‑dismiss notifications (e.g., “Lesson saved”). | Global store. |
| **LocalStorageService** | Wrapper around `window.localStorage` with JSON handling, versioning, and migration. | Used by all stateful components. |

### 2.4 High‑Level Architecture  

```
src/
 ├─ assets/                # icons, images, fonts
 ├─ components/            # reusable UI components (Header, Sidebar, Card, Modal…)
 ├─ pages/                 # route‑level pages (Home, Dashboard, Settings)
 ├─ services/
 │    └─ storage.js        # LocalStorage wrapper + schema versioning
 ├─ store/
 │    └─ index.js          # tiny Redux‑like store (or Zustand) for UI state
 ├─ utils/
 │    └─ debounce.js
 ├─ App.jsx                # Router & layout
 └─ index.js               # bootstrap (ReactDOM.render)
```

- **Framework**: React 18 + Vite (fast dev server).  
- **Styling**: CSS‑Modules + Tailwind‑CSS utility classes (compiled by PostCSS).  
- **State Management**: **Zustand** (lightweight) + persisted slices via `LocalStorageService`.  
- **Routing**: `react-router-dom@6`.  
- **Data Model (LocalStorage)**  

```json
{
  "v1": {
    "courses": [
      {
        "id": "c-101",
        "title": "Intro to JavaScript",
        "slug": "intro-js",
        "thumbnail": "/assets/js.png",
        "description": "...",
        "lessons": [
          { "id": "l-1", "title": "Variables", "type": "video", "src": "..." },
          { "id": "l-2", "title": "Functions", "type": "markdown", "content": "..." }
        ],
        "tags": ["programming", "js"],
        "difficulty": "beginner"
      }
    ],
    "progress": {
      "c-101": {
        "completedLessonIds": ["l-1"],
        "lastVisited": "l-2",
        "percentage": 33
      }
    },
    "settings": {
      "theme": "light"
    }
  }
}
```

---  

## 3️⃣ Key Features & Workflows  

| # | Feature | Primary Workflow | UI Touch‑Points |
|---|---------|------------------|-----------------|
| 1️⃣ | **Student Dashboard** | On login (or first visit) the user lands on `/dashboard`. The dashboard lists *enrolled* courses, each showing a progress bar, “Continue” button, and last‑visited lesson. | Header → Dashboard card grid |
| 2️⃣ | **Course Catalog** | `/` displays a searchable, filterable grid of all available courses. Clicking a card opens the **Course Details Modal**. | Header search, FilterPanel, CourseCard |
| 3️⃣ | **Course Details Modal** | Shows full syllabus, instructor bio, rating, and an “Enroll” CTA. Enrolling adds the course to the dashboard and writes a progress entry to LocalStorage. | Modal overlay, “Enroll” button |
| 4️⃣ | **Lesson Navigation** | Inside a lesson view, “Prev / Next” arrows (or swipe gestures on mobile) move through the lesson array. The URL updates to `/course/:slug/lesson/:lessonId`. | LessonViewer toolbar |
| 5️⃣ | **Learning Progress Tracking** | After a lesson is marked “complete” (auto on video end or manual checkbox), the progress slice updates, recalculates % completed, and persists to LocalStorage. | ProgressBar, toast “Lesson saved!” |
| 6️⃣ | **Search & Filtering** | Header search debounces input → filters catalog in real time. FilterPanel toggles categories (e.g., “Programming”, “Design”), difficulty levels, and length ranges. URL query string reflects current filters for shareability. | SearchBar, FilterPanel |
| 7️⃣ | **Responsive UI** | CSS grid + Tailwind breakpoints adapt layout. Touch‑friendly navigation (hamburger, swipe) on < 768 px. | All pages |
| 8️⃣ | **LocalStorage Persistence** | All user data (enrollments, progress, UI preferences) survive page reloads and even browser restarts. A versioning system migrates schema if needed. | `services/storage.js` |

---  

## 4️⃣ Honest Completion Report – **Transparency Matrix**  

| Status | Feature(s) | Verification Method |
|--------|------------|----------------------|
| 🟢 **Fully Implemented** | • Student Dashboard (real time progress bar) <br>• Course Catalog with live search & filter <br>• Course Details Modal (enroll logic) <br>• Lesson Viewer (video + markdown) <br>• Prev/Next navigation (URL sync) <br>• Progress tracking (auto‑save on video end) <br>• Responsive layout (tested on Chrome, Safari, Firefox) <br>• LocalStorage persistence (schema version 1) | Verified in functional prototype (run `npm run dev`). All UI actions reflect in `localStorage` and survive reloads. |
| 🟡 **Simulated Features** (Prototype Mode) | • Backend‑like “course data API” – currently a static JSON file (`public/data/courses.json`). <br>• Authentication – a dummy “guest” session; no real login. <br>• Email notifications for course enrollment – simulated via toast. | Mock data served by Vite dev server. No network calls to external services. |
| 🟠 **Partially Implemented** | • **User Settings** (theme toggle, language) – UI present, but settings are not persisted across major version upgrades yet. <br>• **Search ranking** – basic substring match only; no fuzzy search or relevance scoring. | UI works; underlying logic still simple. |
| 🔵 **External Production Services Required** | • **Live Payment Gateway** – to monetize real courses. <br>• **Email / SMS verification** – for real user accounts. <br>• **Cloud Database (e.g., Firebase, Supabase)** – to sync progress across devices. <br>• **CDN for video streaming** – currently videos are bundled as static assets. | Not part of MVP; placeholders exist (e.g., `TODO: integrate Stripe`). |

> **Takeaway:** The core learning experience is **complete and production‑ready** for a **single‑device, offline‑first** scenario. Anything that requires a real back‑end or cross‑device sync is intentionally left as a future integration point.  

---  

## 5️⃣ Quick Start, Local Running & Docker Deployment  

### 5.1 Prerequisites  

| Tool | Minimum Version |
|------|-----------------|
| **Node.js** | `v18.0.0` (LTS) |
| **npm** | `9.x` (bundled with Node) |
| **Docker** (optional) | `20.10+` |
| **Git** | any recent version |

> **Tip:** If you use **nvm**, run `nvm use` after cloning to automatically switch to the required Node version (the repo includes an `.nvmrc`).  

### 5.2 Clone the Repository  

```bash
git clone https://github.com/strawhat-devcrew/strawhat-learn.git
cd strawhat-learn
```

### 5.3 Install Dependencies  

```bash
npm ci   # clean install based on lockfile
```

### 5.4 Run the Development Server  

```bash
npm run dev
```

- Vite starts at **http://localhost:5173** (auto‑opens in default browser).  
- Hot‑module replacement (HMR) updates instantly as you edit source files.  

### 5.5 Build for Production  

```bash
npm run build
```

- Output lands in `dist/`.  
- The build is a **static site** – can be hosted on any static file server (GitHub Pages, Netlify, Vercel, etc.).  

### 5.6 Serve the Production Build Locally (optional)  

```bash
npm run preview
```

- Serves `dist/` at **http://localhost:4173**.  

### 5.7 Docker Deployment  

A minimal Dockerfile is provided to run the built static assets via **nginx**.  

#### 5.7.1 Dockerfile (already in repo)

```dockerfile
# ---- Build Stage -------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Runtime Stage ------------------------------------------------
FROM nginx:stable-alpine
COPY --from=builder /app/dist/ /usr/share/nginx/html
# Optional: expose custom config (e.g., caching) via volume or build args
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 5.7.2 Build & Run  

```bash
# Build the image (tag it as you like)
docker build -t strawhat-learn:latest .

# Run a container (port 8080 on host)
docker run -d -p 8080:80 --name strawhat-learn strawhat-learn:latest
```

- Open **http://localhost:8080** – you’ll see the production version served by nginx.  

#### 5.7.3 Docker‑Compose (optional)

```yaml
version: "3.9"
services:
  web:
    image: strawhat-learn:latest
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
```

Run with `docker compose up -d`.  

### 5.8 Linting & Formatting  

```bash
npm run lint      # ESLint
npm run format    # Prettier (writes changes)
```

### 5.9 Testing (Future Work)  

- **Unit tests** (Jest + React Testing Library) are scaffolded but **no tests are written yet**.  
- Run placeholder suite:  

```bash
npm run test
```

> **Note:** The test command currently exits with `0` (no tests). Adding coverage is part of the next sprint.  

---  

## 6️⃣ Frequently Asked Questions (FAQ)

| Question | Answer |
|----------|--------|
| **Do I need a server to run the app?** | No. The app is a static SPA. Only a web server (or `npm run dev`) is required to serve the files. |
| **Where is my data stored?** | In the browser’s `localStorage` under the key `strawhat-learn`. Data is namespaced per‑origin, so each domain has its own sandbox. |
| **Can I sync progress across devices?** | Not in the current MVP. You would need to integrate a cloud DB (e.g., Supabase) – see the **🔵 External Production Services** section. |
| **How do I add new courses?** | Drop a new JSON entry into `public/data/courses.json` following the existing schema, or create a simple admin UI (future feature). |
| **Is there a dark‑mode toggle?** | Yes – the toggle lives in the Settings page. It writes the preference to LocalStorage (`settings.theme`). |
| **Can I use this as a template for my own brand?** | Absolutely. The repo is MIT‑licensed; just replace the logo, colors, and course data. |

---  

## 7️⃣ License  

`strawhat-learn` is released under the **MIT License** – see `LICENSE` for details.  

---  

### 📌 TL;DR Quick Commands  

```bash
# 1️⃣ Clone & enter
git clone https://github.com/strawhat-devcrew/strawhat-learn.git && cd strawhat-learn

# 2️⃣ Install
npm ci

# 3️⃣ Dev server
npm run dev   # → http://localhost:5173

# 4️⃣ Build & preview
npm run build && npm run preview

# 5️⃣ Docker (optional)
docker build -t strawhat-learn . && docker run -p 8080:80 strawhat-learn
```

Enjoy building, learning, and sailing the seas of knowledge with **StrawHat‑Learn**! 🚀