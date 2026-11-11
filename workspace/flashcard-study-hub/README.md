# 📚 Flashcard‑Study‑Hub  
**A lightweight, browser‑only flashcard app with deck management, flip‑card study mode, mock quiz evaluation, and LocalStorage persistence.**  

---  

## 1️⃣ Project Vision & Purpose  

| **Who is it for?** | **What problem does it solve?** |
|--------------------|--------------------------------|
| **Students & lifelong learners** who need a quick, offline way to create, organize, and review study decks. | • Eliminates the friction of installing heavy desktop apps or signing up for cloud services. <br>• Provides an intuitive UI for creating decks, editing cards, and tracking progress without any server‑side dependencies. <br>• Guarantees data privacy – everything lives in the browser’s LocalStorage, never leaves the user’s device. |
| **Educators & trainers** who want a share‑ready, zero‑setup study tool for classroom activities. | • Allows teachers to export/import decks as JSON files for easy distribution. <br>• Offers a mock‑quiz mode to simulate test‑like conditions without a backend. |
| **Developers & hobbyists** looking for a clean, modern front‑end codebase to learn from. | • Demonstrates best practices in semantic HTML5, responsive CSS design tokens, and component‑based UI architecture. <br>• Serves as a starter‑kit for adding real‑time sync, authentication, or analytics later. |

**Core mission** – Deliver a **fast, offline‑first** flashcard experience that feels polished, is fully accessible, and can be extended with real back‑end services when needed.

---  

## 2️⃣ Visual Identity & Architecture  

### 2.1 Layout Overview  

```
+-----------------------------------------------------------+
|  Header (logo + nav)                                      |
+-----------------------------------------------------------+
|  Sidebar (Deck list, New Deck button)   |   Main Content |
|                                         |   (Study area) |
|  • Deck A                               |   • Card view |
|  • Deck B                               |   • Controls  |
|  • + New Deck                           |                |
+-----------------------------------------------------------+
|  Footer (credits, version)                               |
+-----------------------------------------------------------+
```

* **Responsive breakpoints** – Mobile (< 640 px) collapses the sidebar into a slide‑in drawer; Tablet (< 1024 px) shows a compact vertical list; Desktop (> 1024 px) displays full‑width two‑column layout.  

### 2.2 Design Tokens (CSS :root)  

```css
:root {
  /* Brand palette */
  --color-primary:   #0066ff;   /* Electric blue – actions */
  --color-primary-d: #004bb5;   /* Darker for hover/active */
  --color-bg:        #f9fafb;   /* Light gray page background */
  --color-surface:   #ffffff;  /* Cards, modals */
  --color-muted:     #6b7280;  /* Secondary text */
  --color-success:   #10b981;  /* Quiz correct */
  --color-error:     #ef4444;  /* Quiz incorrect */

  /* Typography */
  --font-base:   'Inter', system-ui, sans-serif;
  --font-size-base: 1rem;          /* 16 px */
  --font-size-lg:   1.125rem;      /* 18 px */
  --font-size-sm:   0.875rem;      /* 14 px */
  --line-height-base: 1.5;

  /* Spacing & radius */
  --space-1: .25rem;   /* 4 px */
  --space-2: .5rem;    /* 8 px */
  --space-3: 1rem;     /* 16 px */
  --radius-sm: .25rem;
  --radius-md: .5rem;
  --radius-lg: .75rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,.1);
}
```

### 2.3 Component Hierarchy  

| Component | Description | Accessibility notes |
|-----------|-------------|----------------------|
| **Header** | App logo, global nav (Home, About). | `role="banner"`, keyboard‑focusable links. |
| **Sidebar / DeckList** | Lists all decks, “Add Deck” button, deck‑rename/delete actions. | Each deck item is a `<button>` with `aria-label="Open deck X"`. |
| **DeckEditor** | Modal form for creating/editing deck title & description. | `role="dialog"`, `aria-modal="true"`, focus trap. |
| **CardView** | Flip‑card UI – front side (question) ↔ back side (answer). | `role="region"`, `aria-live="polite"` on flip to announce side change. |
| **StudyControls** | “Flip”, “Next”, “Prev”, “Mark as Known/Unknown”. | Buttons have clear text + optional icons with `aria-label`. |
| **QuizModal** | Mock quiz – shows a question, multiple‑choice answers, instant feedback. | `role="dialog"`, each choice is a `<button>` with `aria-checked`. |
| **Toast / Snackbar** | Transient feedback (e.g., “Deck saved”). | `role="status"` and `aria-live="polite"`. |
| **Footer** | Version, credit links. | Simple text, no interactive elements. |

All interactive elements have **hover**, **focus-visible**, and **active** states defined via CSS variables for consistent branding.

---  

## 3️⃣ Key Features & Workflows  

| Feature | Primary Workflow |
|---------|------------------|
| **Deck Management** | 1️⃣ Click **+ New Deck** → DeckEditor modal opens.<br>2️⃣ Enter title/description → Save → Deck appears in Sidebar.<br>3️⃣ Click a deck → Card list loads.<br>4️⃣ Inside a deck, use **Add Card** → CardEditor modal (question/answer). |
| **Flip‑Card Study Mode** | 1️⃣ Open a deck → CardView shows the *front* (question).<br>2️⃣ Press **Flip** (or click card) → CSS 3‑D transform reveals *back* (answer).<br>3️⃣ Navigate with **Prev/Next**. |
| **Mock Quiz Evaluation** | 1️⃣ From a deck, click **Start Quiz** → QuizModal appears.<br>2️⃣ Randomly selects a card, generates 3‑option multiple‑choice (correct answer + 2 distractors).<br>3️⃣ User selects → Immediate toast “Correct!” (green) or “Incorrect” (red).<br>4️⃣ Progress bar shows # of questions answered. |
| **LocalStorage Persistence** | All decks, cards, and user‑progress flags are serialized to `localStorage` under key `flashcardStudyHub`. <br>On app load, data is hydrated; on any change, `saveToStorage()` is called. |
| **Import / Export** | Export → downloads a JSON file of the selected deck.<br>Import → file picker reads JSON and merges into existing decks (conflict resolution by title). |
| **Responsive & Accessible UI** | Layout adapts to screen size; all modals trap focus; ARIA attributes convey state changes. |

---  

## 4️⃣ Honest Completion Report (Transparency Matrix)  

| Status | Feature | Notes |
|--------|---------|-------|
| 🟢 **Fully Implemented** | Deck CRUD (create, read, update, delete) <br>Card CRUD within a deck <br>Flip‑card interaction with smooth 3‑D animation <br>Mock quiz with random distractors <br>LocalStorage persistence (auto‑save & load) <br>Responsive layout (mobile, tablet, desktop) <br>Accessibility (ARIA roles, focus trap, keyboard navigation) <br>Import / Export JSON <br>Toast notifications | Verified in functional prototype on Chrome 124, Firefox 124, Edge 124. |
| 🟡 **Simulated / Mock** | Backend‑like latency – a 300 ms `setTimeout` wrapper around LocalStorage reads/writes to mimic network delay. <br>Sample data set (pre‑populated deck) for first‑time users. | No real server; all data stays client‑side. |
| 🟠 **Partially Implemented** | **Progress Tracking** – UI shows “cards studied” but persisting per‑card mastery levels is not yet stored. <br>**Deck sharing** – UI for copy‑to‑clipboard JSON exists, but integration with a cloud‑share endpoint is pending. |
| 🔵 **External Production Required** | **Cloud Sync** – Real‑time multi‑device sync via Firebase/Amplify or custom API. <br>**User authentication** – OAuth / email‑password login for private decks. <br>**Analytics** – Integration with Google Analytics or Azure Application Insights for usage metrics. |

> **Bottom line:** The core learning loop (deck management → study → quiz) is **production‑ready** for offline use. All remaining items are optional extensions that would require external services.

---  

## 5️⃣ Quick Start, Local Running & Docker Deployment  

### 5.1 Prerequisites  

| Tool | Minimum version |
|------|-----------------|
| **Node.js** (optional, only for static‑server) | 18.x |
| **Docker** (for containerised run) | 24.x |
| **Git** (to clone repo) | any |

> The app is pure static HTML/CSS/JS; no build step is required unless you want a dev server.

### 5.2 Clone the repository  

```bash
git clone https://github.com/StrawHatDevCrew/flashcard-study-hub.git
cd flashcard-study-hub
```

### 5.3 Run locally (three simple ways)

#### 5.3.1 Open directly  

1. Open `index.html` in any modern browser (Chrome, Edge, Firefox, Safari).  
2. No server needed – **but** some browsers block `localStorage` when opened via `file://` on strict security settings. If you encounter that, use a local static server.

#### 5.3.2 Using `npx serve` (Node)

```bash
npx serve .
# → http://localhost:3000
```

#### 5.3.3 Using Python’s built‑in HTTP server  

```bash
python -m http.server 8080
# → http://localhost:8080
```

### 5.4 Docker Deployment  

A minimal Dockerfile is provided (based on **nginx:alpine**).  

#### 5.4.1 Build the image  

```bash
docker build -t flashcard-study-hub:latest .
```

#### 5.4.2 Run the container  

```bash
docker run -d -p 8080:80 --name flashcard-hub flashcard-study-hub:latest
# Open http://localhost:8080 in your browser
```

#### 5.4.3 Dockerfile (for reference)

```dockerfile
# -------------------------------------------------------------
#  Flashcard‑Study‑Hub – static site container
# -------------------------------------------------------------
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy project files into nginx root
COPY . /usr/share/nginx/html

# Expose default HTTP port
EXPOSE 80

# No CMD needed – nginx runs as default entrypoint
```

### 5.5 Development Tips  

| Tip | Command |
|-----|---------|
| **Live reload** (optional) – install `live-server` globally and run `live-server .` | `npm i -g live-server && live-server .` |
| **Lint/format** – use `prettier` (if you add a dev environment) | `npx prettier --write .` |
| **Testing** – open `tests.html` (if you add unit tests with Jest or Playwright) | — |

---  

## 6️⃣ License & Contributing  

- **License:** MIT – free to use, modify, and distribute.  
- **Contributing:** Fork the repo, create a feature branch, and submit a Pull Request. Please keep the transparency matrix up‑to‑date in `README.md`.  

---  

### 🎉 Ready to study?  

```bash
# Quick one‑liner for most users
open index.html   # macOS
# or double‑click the file in Explorer/Finder
```

Happy learning, and may your decks always be well‑organized!  

---  

*Documentation generated by **Robin – Documentation Specialist** (Straw Hat Dev Crew).*