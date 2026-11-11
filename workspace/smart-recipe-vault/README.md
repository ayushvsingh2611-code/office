# Smart‑Recipe‑Vault  
**Recipe discovery • Diet & cook‑time filtering • Interactive grocery‑list generator • Chef‑consultation booking modal**  

---  

## 1️⃣ Project Vision & Purpose  

| **Who?** | **What problem?** | **Why now?** |
|----------|-------------------|--------------|
| **Home cooks & food‑enthusiasts** (busy professionals, families, diet‑specific eaters) | • Scattered recipe sources → endless searching. <br>• No quick way to see which recipes fit a dietary restriction or a limited cooking window. <br>• Manual grocery‑list creation is error‑prone. <br>• Getting a one‑off chef advice normally requires phone calls or separate platforms. | • Mobile‑first web experiences are ubiquitous. <br>• Growing demand for personalized, health‑aware meal planning. <br>• AI‑driven recommendation engines make “smart” discovery feasible with only static data. |

**Mission statement** – *Smart‑Recipe‑Vault empowers anyone who cooks at home to instantly find recipes that match their diet, time constraints, and ingredient availability, then turn the chosen meals into a ready‑to‑shop grocery list and optionally book a short “chef‑consultation” session for personalized guidance.*  

---

## 2️⃣ Visual Identity & Architecture  

### 2.1 Layout & Component Hierarchy  

```
<Header>                – logo, global search, user‑menu (future)
<Nav> (sticky)          – quick links: Discover, My Lists, Book Chef
<Main>
   ├─ <section id="discover">          – recipe cards grid
   ├─ <section id="filters">           – diet, cook‑time, cuisine chips
   ├─ <section id="grocery-list">     – interactive list panel (slide‑in)
   └─ <section id="booking-modal">    – modal overlay (hidden → visible)
<Footer>                – copyright, social icons, repo link
```

### 2.2 Design Tokens (CSS‑custom properties)  

```css
:root {
  /* Brand palette */
  --color-primary:   #2A9D8F;   /* teal */
  --color-primary‑dark: #1E6F60;
  --color-accent:    #E9C46A;   /* warm gold */
  --color-bg:        #F4F4F4;
  --color-surface:   #FFFFFF;
  --color-text:      #264653;
  --color-muted:     #A8A8A8;

  /* Typography */
  --font-sans:       "Inter", system-ui, sans-serif;
  --font-size-base:  1rem;          /* 16px */
  --font-size-lg:    1.125rem;      /* 18px */
  --font-size-xl:    1.5rem;        /* 24px */

  /* Spacing & radii */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-4: 1rem;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,.12);
  --shadow-md: 0 4px 6px rgba(0,0,0,.15);
}
```

### 2.3 UI Components  

| Component | Description | Accessibility notes |
|-----------|-------------|----------------------|
| **Recipe Card** | Image, title, tags (diet, cook‑time), “Add to List” button. | `role="button"` + `aria‑pressed` toggle, focus-visible outline. |
| **Filter Chip** | Clickable pill for diet (e.g., *Vegan*), time range, cuisine. | `aria-checked` + `role="checkbox"` for multi‑select. |
| **Grocery List Panel** | Slide‑in panel (right side) with checkboxes, quantity editors, “Clear All”. | All inputs have `<label>`; panel gets `aria-modal="true"` when open. |
| **Booking Modal** | Centered dialog with date‑picker, time‑slot dropdown, “Confirm”. | `role="dialog"` + `aria-labelledby`; focus trap, ESC to close. |
| **Toast Notification** | Small transient message (e.g., “Recipe added”). | `role="status"` and `aria-live="polite"`. |

### 2.4 Responsive Breakpoints  

| Breakpoint | Width | Layout adjustments |
|------------|-------|--------------------|
| **Mobile** | < 640 px | Single‑column card stack, hamburger nav, full‑screen modal. |
| **Tablet** | 640 – 1024 px | Two‑column grid, side‑panel for grocery list (collapsible). |
| **Desktop** | > 1024 px | Three‑column grid, persistent filter sidebar, modal overlay. |

---

## 3️⃣ Key Features & Workflows  

| # | Feature | Typical User Flow |
|---|---------|-------------------|
| **1** | **Recipe Discovery** | 1️⃣ User lands on *Discover* page → 2️⃣ Global search or scroll → 3️⃣ Cards load from static JSON (or future API). |
| **2** | **Diet & Cook‑Time Filtering** | 1️⃣ Click one or more filter chips → 2️⃣ UI instantly re‑filters the visible cards (client‑side). |
| **3** | **Interactive Grocery List Generator** | 1️⃣ Click “Add to List” on a recipe → 2️⃣ Ingredients are merged into the list panel → 3️⃣ User edits quantities, checks items off, or removes them. |
| **4** | **Chef Consultation Booking Modal** | 1️⃣ Click “Book Chef” → 2️⃣ Modal appears → 3️⃣ Pick date + time slot → 4️⃣ Submit → 5️⃣ Confirmation toast. |
| **5** | **Persisted State (LocalStorage)** | All list selections, filter choices, and booking drafts survive page reloads. |
| **6** | **Responsive UI & Dark‑Mode (future)** | UI automatically adapts to screen size; dark‑mode toggle planned. |

---

## 4️⃣ Honest Completion Report (Transparency Matrix)  

| Status | Feature | Detail / Prototype Fidelity |
|--------|---------|-----------------------------|
| 🟢 **Fully Implemented** | • Recipe card UI with image, title, tags.<br>• Client‑side filtering by diet & cook‑time.<br>• “Add to List” button updates interactive grocery list panel.<br>• Grocery list panel supports check‑off, quantity edit, clear‑all.<br>• Booking modal opens/closes, date‑picker UI works, toast confirmation shown.<br>• LocalStorage persistence for list & filter state. | Verified in the functional prototype (tested in Chrome/Firefox). |
| 🟡 **Simulated / Mock** | • Recipe data source – static `recipes.json` (mocked backend).<br>• Chef availability – static time‑slot array (no real calendar integration).<br>• “Book Chef” submission – only shows a toast; no server call. | All data lives in the client bundle; no network calls. |
| 🟠 **Partially Implemented** | • Search bar – UI present, but fuzzy‑search algorithm not yet integrated (currently matches exact titles only).<br>• User profile / favorites – UI placeholder, persistence not wired. | Core UI is there; business logic pending. |
| 🔵 **External Production Required** | • Real‑time chef‑booking backend (e.g., Calendly, Google Calendar API).<br>• Cloud‑hosted recipe database (e.g., DynamoDB, Firestore).<br>• Email/SMS notifications for booking confirmations (Twilio, SendGrid).<br>• Analytics / usage tracking (Google Analytics, Segment). | Would need serverless functions, API keys, and secure env‑vars. |

---

## 5️⃣ Quick‑Start, Local Running & Docker Deployment  

### 5.1 Prerequisites  

| Tool | Minimum version |
|------|-----------------|
| **Node.js** (optional for Docker build) | v18+ |
| **Git** | any |
| **A modern browser** (Chrome, Edge, Firefox, Safari) | – |
| **Docker** (for containerised deployment) | 20.10+ |

> **Note:** The app is a pure static site – no build step is required to run locally.  

### 5.2 Clone the repo  

```bash
git clone https://github.com/StrawHatDevCrew/smart-recipe-vault.git
cd smart-recipe-vault
```

### 5.3 Run locally (three easy ways)

| Method | Command | What it does |
|--------|---------|--------------|
| **Open directly** | `open index.html` *(macOS)*<br>`start index.html` *(Windows)* | Loads the page via `file://` – works for most browsers (no CORS). |
| **Static dev server (Node)** | `npx serve .`<br>Visit `http://localhost:3000` | Serves the folder over HTTP, useful for testing Service Workers or fetches. |
| **Python simple server** | `python -m http.server 8080`<br>Visit `http://localhost:8080` | Same as above, no npm needed. |

> **Tip:** If you modify `recipes.json` or any assets, just refresh the browser – no rebuild required.

### 5.4 Dockerised Deployment  

A minimal `Dockerfile` is included. It uses an **alpine‑based Nginx** image to serve the static files.

```dockerfile
# ---- Dockerfile ----
FROM nginx:alpine
COPY ./ /usr/share/nginx/html
# Optional: expose custom port (default 80)
EXPOSE 80
```

#### Build the image  

```bash
docker build -t smart-recipe-vault:latest .
```

#### Run the container  

```bash
docker run -d -p 8080:80 --name sr-vault smart-recipe-vault:latest
```

Open `http://localhost:8080` in your browser.  

#### Clean up  

```bash
docker stop sr-vault && docker rm sr-vault
docker rmi smart-recipe-vault:latest
```

### 5.5 Development Workflow (if you want to extend)

1. **Install dependencies (optional)** – only needed if you add a build step (e.g., Sass, TypeScript).  
   ```bash
   npm install   # pulls dev deps like prettier, eslint
   ```
2. **Start a watch‑mode static server** (requires `serve`):  
   ```bash
   npx serve -l 3000 -s .
   ```
3. **Lint / format** (optional):  
   ```bash
   npx eslint . --fix
   npx prettier --write .
   ```

### 5.6 FAQ / Troubleshooting  

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| **Images not loading** | Running via `file://` on Chrome (blocked mixed content) | Use `npx serve .` or Docker. |
| **Filters not updating** | Browser cache stale after editing `recipes.json` | Hard‑refresh (`Ctrl+Shift+R`). |
| **Modal stays hidden** | `pointer-events-none` class left on modal container | Ensure `data-modal-open="true"` toggles `hidden` & `pointer-events-auto`. |
| **LocalStorage not persisting** | Private/incognito mode blocks storage | Use normal window or allow storage. |

---

## 6️⃣ Next Steps & Contribution Guide  

| Goal | How to contribute |
|------|-------------------|
| **Add real recipe API** | Fork, create a `src/api/` module, replace static fetch with `fetch('/api/recipes')`. |
| **Integrate real chef booking** | Implement a serverless function (AWS Lambda / Azure Functions) that writes to a calendar and returns a confirmation email. |
| **Improve search** | Replace exact‑match with Fuse.js fuzzy search and add debounce. |
| **Accessibility audit** | Run `axe-core` in the browser, fix any violations, update ARIA attributes. |
| **Dark‑mode** | Add `prefers-color-scheme` media query, expose a toggle in the header. |

Pull requests are welcome! Please follow the existing code style (Prettier + ESLint) and update the **Transparency Matrix** if you add or change feature status.

---  

*Documentation authored by **Robin** – Documentation Specialist, Straw Hat Dev Crew*