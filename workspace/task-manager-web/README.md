# 📋 Task‑Manager Web Application – Documentation  
**Project name:** *StrawHat Task‑Manager*  
**Author:** Robin – Documentation Specialist (Straw Hat Dev Crew)  
**Last updated:** 2026‑11‑04  

---  

## 1️⃣ Project Vision & Purpose  

| **Target Audience** | **Problem Solved** |
|---------------------|--------------------|
| • Freelancers, small‑team developers, students, and anyone who needs a lightweight personal or team task board. <br>• Teams that prefer a **client‑side only** solution (no backend, no subscription). | • Scattered to‑do lists across sticky notes, spreadsheets, or multiple apps. <br>• No single place to view status, priority, and progress at a glance. <br>• Lack of quick “add‑task” UI and instant persistence without a server. |

**Why this app?**  
- **Zero‑install, zero‑login** – just open the URL, start adding tasks.  
- **Full offline capability** – all data lives in the browser’s `localStorage`.  
- **Rich task lifecycle** – create, edit, delete, change status, set priority, and filter/search instantly.  
- **Insight at a glance** – simple statistics (total, by status, by priority).  
- **Responsive UI** – works on desktop, tablet, and mobile with a collapsible sidebar.  

---  

## 2️⃣ Visual Identity & Architecture  

### 2.1 Layout Overview  

```
+-----------------------------------------------------------+
|  Header (App title + global actions)                      |
+-------------------+---------------------------------------+
|  Sidebar (nav)    |  Main Content                         |
|  – Dashboard      |  • Task statistics (cards)            |
|  – All Tasks      |  • Search / filter bar                |
|  – Settings       |  • Task list (table / cards)          |
|  – …              |  • Floating “+” button → modal        |
+-------------------+---------------------------------------+
|  Footer (optional)                                      |
+-----------------------------------------------------------+
```

- **Header** – Fixed, contains the app logo, a dark‑mode toggle, and a “Clear All” button (with confirmation).  
- **Sidebar** – Collapsible (auto‑collapses on < 768 px). Uses icons from **Feather** + text labels.  
- **Main Content** – Grid of **stat cards** on top, then **search + filter row**, then the **task table**.  
- **Modal** – Centered, responsive, contains a form for *Create* / *Edit* task.  

### 2.2 Color System  

| Variable | Hex | Usage |
|----------|-----|-------|
| `--color-primary` | `#2C7BE5` | Header, active sidebar item, primary buttons |
| `--color-primary-dark` | `#1A5BB8` | Hover/focus states |
| `--color-success` | `#28A745` | “Completed” status badge |
| `--color-warning` | `#FFC107` | “In‑Progress” badge |
| `--color-danger` | `#DC3545` | “Pending” badge |
| `--color-bg` | `#F8F9FA` | Page background (light mode) |
| `--color-bg-dark` | `#212529` | Page background (dark mode) |
| `--color-text` | `#212529` | Primary text (light) |
| `--color-text-dark` | `#F8F9FA` | Primary text (dark) |

*Dark‑mode* swaps `--color-bg` ↔ `--color-bg-dark` and `--color-text` ↔ `--color-text-dark`.  

### 2.3 Component Library  

| Component | Description | Tech |
|-----------|-------------|------|
| **Header** | Fixed top bar, contains title, dark‑mode toggle, clear‑all button. | HTML + CSS (Flex) |
| **Sidebar** | Vertical navigation, collapsible, icons + labels. | HTML + CSS (Grid) + Feather icons |
| **StatCard** | Small card showing a numeric value + label (e.g., “Total Tasks”). | CSS Card + CSS variables |
| **TaskTable** | Responsive table (desktop) / stacked cards (mobile) showing tasks with columns: Title, Priority, Status, Due Date, Actions. | HTML `<table>` + CSS media queries |
| **TaskModal** | Modal dialog with form fields: Title, Description, Due Date, Priority (Low/Medium/High), Status (Pending/In‑Progress/Completed). | HTML `<dialog>` (polyfilled) + CSS |
| **SearchBar** | Input + clear button, debounced live filtering. | JavaScript (debounce 300 ms) |
| **FilterDropdown** | Multi‑select for Status & Priority. | JavaScript + CSS |
| **Toast** | Small transient notifications (Task saved, error, etc.). | CSS animation + JS |
| **DarkModeToggle** | Switch component that stores preference in `localStorage`. | JS + CSS custom properties |

### 2.4 High‑Level Architecture  

```
src/
├─ index.html                ← entry point, loads bundled assets
├─ assets/
│   ├─ css/
│   │   └─ main.css          ← global styles, CSS variables
│   └─ js/
│       ├─ app.js           ← bootstrap, event wiring
│       ├─ store.js         ← LocalStorage wrapper (CRUD)
│       ├─ ui/
│       │   ├─ sidebar.js
│       │   ├─ header.js
│       │   ├─ modal.js
│       │   └─ toast.js
│       └─ utils/
│           └─ debounce.js
└─ data/
    └─ mock-tasks.json       ← initial seed data (used on first load)
```

- **No backend** – all business logic lives in the browser.  
- **`store.js`** abstracts `localStorage` with methods `getAll()`, `save(task)`, `update(id, payload)`, `remove(id)`.  
- **`app.js`** is the single‑page “controller”: reads from the store, renders UI, attaches listeners.  

---  

## 3️⃣ Key Features & Workflows  

| # | Feature | Typical Workflow |
|---|---------|------------------|
| 1️⃣ | **Dashboard Overview** | On load, the user sees stat cards: total tasks, pending, in‑progress, completed, high‑priority count. |
| 2️⃣ | **Responsive Sidebar Navigation** | Click a sidebar item → main view updates (Dashboard, All Tasks). Sidebar auto‑collapses on small screens; a hamburger icon restores it. |
| 3️⃣ | **Create Task (Modal)** | • Click the floating “+” button.<br>• Modal opens, user fills fields (title mandatory).<br>• Press **Save** → task stored in `localStorage`, UI refreshed, toast “Task created”. |
| 4️⃣ | **Edit Task** | • In the task list, click the pencil icon.<br>• Same modal opens pre‑filled.<br>• Save updates the entry, persists, UI refreshes. |
| 5️⃣ | **Delete Task** | • Click trash icon → confirm dialog.<br>• On confirm, task removed from store, UI updates, toast “Task deleted”. |
| 6️⃣ | **Status Management** | Status dropdown in modal (Pending / In‑Progress / Completed). Changing status updates the badge color in the list and updates statistics instantly. |
| 7️⃣ | **Priority Management** | Priority selector (Low, Medium, High). High‑priority tasks get a red exclamation badge and are highlighted in the list. |
| 8️⃣ | **Search & Filtering** | • Type in the search bar → list filtered by title/description (debounced).<br>• Use filter dropdowns to limit by status and/or priority. |
| 9️⃣ | **Task Statistics** | Dashboard cards recalculate on every CRUD operation. Also a small “pie chart” (SVG) shows distribution of statuses (optional future enhancement). |
| 🔟 | **LocalStorage Persistence** | All CRUD actions call `store.js`; data survives page reloads and even browser restarts. A “Reset All” button clears the storage after user confirmation. |
| 1️⃣1️⃣ | **Dark Mode** | Toggle in header → CSS variables switch, preference saved to `localStorage`. |
| 1️⃣2️⃣ | **Responsive Design** | Layout adapts: table → stacked cards on < 576 px, sidebar collapses, modal full‑screen on mobile. |

---  

## 4️⃣ Honest Completion Report – **TRANSPARENCY MATRIX**  

| Status | Feature | Remarks / Verification |
|--------|---------|------------------------|
| 🟢 **Fully Implemented** | • Dashboard statistics cards  <br>• Responsive sidebar navigation  <br>• Modal task creation & editing  <br>• Create / Edit / Delete CRUD with `localStorage`  <br>• Status & priority badges (color coded)  <br>• Search bar (debounced)  <br>• Filter dropdowns (status & priority)  <br>• Toast notifications  <br>• Dark‑mode toggle (persisted)  <br>• Responsive layout (desktop / tablet / mobile) | Tested manually in Chrome, Firefox, Edge on Windows/macOS. All UI actions persist across reloads. |
| 🟡 **Simulated Features** | • **Task statistics chart** (pie chart) – currently a placeholder SVG with static data; real chart will be powered by Chart.js in a future sprint.  <br>• **User authentication** – not part of the MVP; a mock “Login” button exists but does not perform real auth. | UI elements present, but data is static or non‑functional. |
| 🟠 **Partially Implemented** | • **Bulk actions** (select multiple tasks → change status/delete) – UI for selection exists, but bulk‑update logic is not wired yet.  <br>• **Export/Import** (JSON file) – Export works, Import reads a file but does not validate schema fully. | Core UI is usable; back‑end logic still pending. |
| 🔵 **External Production Services Required** | • **Cloud backup** (e.g., sync to Firebase/Firestore) – would need API keys, auth, and server‑side rules.  <br>• **Email reminders** – would require a transactional email service (SendGrid, Mailgun). | Not part of the current client‑only scope. |

> **Bottom line:** The core MVP (task CRUD, UI, persistence, responsiveness) is **production‑ready** for personal or small‑team use. The “simulated” and “partial” items are clearly marked for future roadmap planning.

---  

## 5️⃣ Quick Start, Local Running & Docker Deployment  

### 5.1 Prerequisites  

| Tool | Minimum version |
|------|-----------------|
| **Node.js** (for dev scripts) | `v18.x` |
| **npm** (or `yarn`) | `8.x` |
| **Docker** (optional) | `Docker Engine 20.10+` |
| Modern browser (Chrome/Firefox/Edge/Safari) | — |

> *The app runs completely in the browser; Node is only needed for building assets and running the dev server.*  

### 5.2 Clone the repository  

```bash
git clone https://github.com/strawhat-devcrew/task-manager.git
cd task-manager
```

### 5.3 Install dependencies  

```bash
npm ci          # or `yarn install --frozen-lockfile`
```

### 5.4 Development mode (hot‑reload)  

```bash
npm run dev      # starts Vite dev server at http://localhost:5173
```

- Changes to `src/**/*.js` or `src/**/*.css` trigger automatic reload.  
- Open the URL in your browser; the app will automatically create an initial set of mock tasks (if `localStorage` is empty).  

### 5.5 Build for production  

```bash
npm run build    # outputs to `dist/`
```

- The `dist/` folder contains a fully static site (HTML + bundled CSS/JS).  

### 5.6 Serve the built files locally (optional)  

```bash
npm run preview  # Vite preview server on http://localhost:4173
```

### 5.7 Docker deployment  

A **multi‑stage Dockerfile** is provided to keep the final image tiny (≈ 30 MB).  

#### 5.7.1 Dockerfile (excerpt)

```Dockerfile
# ---- Build stage -------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Runtime stage -----------------------------------------------
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 5.7.2 Build & run container  

```bash
# Build the image (tag it as you like)
docker build -t task-manager:latest .

# Run it (maps container port 80 to host port 8080)
docker run -d -p 8080:80 --name task-manager task-manager:latest
```

Open `http://localhost:8080` → the app loads instantly, using the browser’s `localStorage` for persistence (each browser instance gets its own data).  

#### 5.7.3 Docker‑Compose (optional)

```yaml
version: "3.9"
services:
  web:
    image: task-manager:latest
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
```

Run with `docker-compose up -d`.  

### 5.8 Resetting data (development convenience)

```bash
# From browser console
localStorage.clear();   // wipes all tasks and preferences
location.reload();      // reloads app with fresh seed data
```

Or click the **Header → Clear All** button (requires confirmation).  

---  

## 📚 Appendix  

### A. Folder Structure (post‑build)  

```
dist/
├─ assets/
│   ├─ index-<hash>.js
│   └─ index-<hash>.css
└─ index.html
```

All files are static; you can host them on any static file server (GitHub Pages, Netlify, Vercel, S3, etc.).  

### B. Accessibility Notes  

- All interactive elements have `aria-label` attributes.  
- Keyboard navigation: Tab order respects visual order; modal traps focus while open.  
- Color contrast meets WCAG AA for both light and dark themes.  

### C. Future Roadmap (high‑level)  

1. **Persist to cloud** (Firebase/ Supabase) – optional sync across devices.  
2. **User authentication** (OAuth2, email/password).  
3. **Real‑time collaboration** (WebSocket, Firestore).  
4. **Advanced analytics** (burndown chart, Gantt view).  
5. **Bulk actions** (multi‑select, mass status change).  
6. **Export/Import improvements** (CSV, iCal).  

---  

**Enjoy building and tracking your tasks with StrawHat Task‑Manager!** 🎉  

*For any questions, open an issue on GitHub or reach out to the Straw Hat Dev Crew Slack channel #task‑manager.*