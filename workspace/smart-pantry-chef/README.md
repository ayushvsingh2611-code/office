# Smart‑Pantry‑Chef  
**Ingredients inventory tracker • Recipe suggestions based on what’s in the pantry • Dietary‑preference filters • Meal‑prep calendar scheduling (modal)**  

---  

## 1. Project Vision & Purpose  

| **Who** | **What problem are we solving?** |
|---------|-----------------------------------|
| **Home cooks & busy families** who want to waste‑less meals, keep track of what they already own, and discover recipes that fit their diet without endless grocery trips. | **Food waste** – forgetting about perishable items leads to spoilage. <br> **Decision fatigue** – “What’s for dinner?” consumes mental bandwidth. <br> **Dietary constraints** – gluten‑free, vegan, low‑carb, etc., require filtering. <br> **Meal‑prep planning** – coordinating dishes across a week is cumbersome. |

**Mission statement** – *Smart‑Pantry‑Chef empowers anyone with a kitchen to turn their pantry into a smart, searchable inventory, instantly surface recipes that match what they have, respect their dietary needs, and schedule meals on a calendar, all from a single responsive web app.*  

---

## 2. Visual Identity & Architecture  

### 2.1 Layout & Information Hierarchy  

```
+-----------------------------------------------------------+
| Header (logo, user avatar, global nav)                    |
+-----------------------------------------------------------+
| Sidebar (collapsed on mobile)  |  Main Content Area       |
| - Dashboard                    |  • Overview cards        |
| - Inventory                    |  • Ingredient list       |
| - Recipes                      |  • Suggested recipes     |
| - Calendar                     |  • Calendar view (modal) |
+-----------------------------------------------------------+
| Footer (links, version, copyright)                        |
+-----------------------------------------------------------+
```

*Responsive breakpoints* – Mobile (< 640 px): sidebar collapses into a hamburger drawer; Main content stacks vertically. Tablet (< 1024 px): two‑column layout. Desktop (> 1024 px): persistent sidebar + wide main panel.

### 2.2 Design Tokens (CSS‑custom properties)  

```css
:root {
  /* Brand palette */
  --color-primary:   #2C7A7B;   /* teal‑700 */
  --color-primary‑light: #81E6D9; /* teal‑300 */
  --color-primary‑dark:  #285E61; /* teal‑900 */
  --color-accent:    #F6AD55;   /* orange‑400 */
  --color-bg:        #F7FAFC;   /* gray‑50 */
  --color-surface:   #FFFFFF;  /* white */
  --color-text-primary: #2D3748; /* gray‑800 */
  --color-text-muted:   #718096; /* gray‑600 */

  /* Typography */
  --font-family-sans: "Inter", system-ui, sans-serif;
  --font-size-base: 1rem;          /* 16px */
  --font-size-sm:   0.875rem;      /* 14px */
  --font-size-lg:   1.125rem;      /* 18px */
  --line-height-base: 1.5;

  /* Spacing */
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.5rem;    /* 24px */

  /* Elevation */
  --shadow-sm: 0 1px 2px rgba(0,0,0,.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,.15);

  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
}
```

### 2.3 Core UI Components  

| Component | Description | Accessibility notes |
|-----------|-------------|----------------------|
| **Header** | Logo, app name, avatar dropdown, global search. | `role="banner"`; avatar button has `aria-label="User menu"` |
| **Sidebar Nav** | Collapsible list of sections with icons. | `aria-expanded` toggles, `role="navigation"` |
| **Ingredient Card** | Shows name, quantity, unit, expiry badge, edit/delete actions. | Buttons have `aria-label` (e.g., “Edit Apple”); colour contrast meets AA |
| **Recipe Tile** | Thumbnail, title, required‑ingredients list, “Add to calendar” button. | `role="article"`; alt text for image; focus-visible outlines |
| **Filter Panel** | Checkboxes / toggles for diet (vegan, keto, gluten‑free), allergens, calorie range. | Each checkbox has associated `<label>` |
| **Calendar Modal** | Full‑screen overlay with week view, drag‑and‑drop scheduling, “Save” CTA. | Modal starts hidden (`display:none; pointer-events:none;`); when opened, focus is trapped inside, `aria-modal="true"` |
| **Toast Notification** | Auto‑dismissable feedback (e.g., “Ingredient added”). | `role="status"` and `aria-live="polite"` |

All interactive elements provide hover, focus‑visible, and active states using the design tokens above.

---

## 3. Key Features & Workflows  

### 3.1 Inventory Management  

1. **Add Ingredient** → Click **+** → Fill name, quantity, unit, optional expiry → *Save* (writes to `localStorage`).  
2. **Edit / Delete** → Inline actions on each card.  
3. **Expiry Alerts** → Items within 3 days of expiry get a red badge.  

### 3.2 Smart Recipe Suggestion  

1. User opens **Recipes** tab → System scans `localStorage` inventory.  
2. Matching algorithm returns recipes where **≥ 80 %** of required ingredients are present.  
3. UI shows **“You have X of Y ingredients”** badge on each tile.  

### 3.3 Dietary Preference Filters  

- Multi‑select checkboxes for **Vegan, Vegetarian, Gluten‑Free, Nut‑Free, Low‑Carb, Paleo**.  
- Slider for **max calories**.  
- Filters apply instantly to the recipe list (client‑side).  

### 3.4 Meal‑Prep Calendar Scheduling  

1. Click **“Add to Calendar”** on a recipe tile → opens **Calendar Modal** (full‑screen overlay).  
2. Calendar displays current week; user drags recipe card onto a day slot.  
3. Optionally set **servings** and **prep notes** per slot.  
4. **Save** → data persisted to `localStorage` under `calendarEvents`.  

### 3.5 Export / Import (Future)  

- JSON export of inventory & calendar for backup.  
- Import restores state (currently **simulated**).  

---

## 4. Honest Completion Report (Transparency Matrix)  

| Status | Feature | Description | Prototype verification |
|--------|---------|-------------|------------------------|
| 🟢 **Fully Implemented** | Ingredient CRUD (Add / Edit / Delete) | UI, validation, LocalStorage persistence, expiry badge logic. | Tested in functional prototype; changes survive page reload. |
| 🟢 **Fully Implemented** | Recipe suggestion engine (client‑side matching) | Scans inventory, calculates match percentage, displays tiles. | Verified with mock recipe JSON (≈ 30 recipes). |
| 🟢 **Fully Implemented** | Dietary filters UI & live filtering | Checkbox & slider controls, filter logic applied instantly. | Works with the mock recipe set. |
| 🟢 **Fully Implemented** | Calendar scheduling modal (drag‑drop) | Full‑screen overlay, day slots, drag‑drop, save to LocalStorage. | Drag‑drop tested; events persist after reload. |
| 🟢 **Fully Implemented** | Toast notifications & accessibility focus handling | Consistent feedback for all actions, WCAG‑AA compliant. | Confirmed with screen‑reader testing (NVDA). |
| 🟡 **Simulated** | Backend‑like ingredient expiry notifications (email/SMS) | Currently shows in‑app toast; real email/SMS would require external service. | Mocked via setTimeout. |
| 🟡 **Simulated** | User authentication & multi‑user sync | UI for login/logout present; data stored locally only. | No real auth provider; uses dummy user object. |
| 🟡 **Simulated** | Recipe data source (API) | Static JSON file used; in production would call a recipe API. | Fetch from `public/recipes.json`. |
| 🟠 **Partially Implemented** | Shopping‑list generation | UI stub exists; logic to auto‑populate missing ingredients not finished. | Button shows placeholder modal. |
| 🟠 **Partially Implemented** | Nutrition facts overlay per recipe | Layout ready; calculations from a nutrition API pending. | Shows static dummy values. |
| 🔵 **External Production Required** | Cloud database (e.g., DynamoDB, Firestore) for cross‑device sync | Current app is client‑only. | Would need backend + auth. |
| 🔵 **External Production Required** | Email / SMS reminder service (e.g., Twilio, SendGrid) for expiry alerts | Only in‑app toast now. | Integration pending. |
| 🔵 **External Production Required** | Payment gateway for premium features (e.g., premium recipes) | No payment flow yet. | Stripe / PayPal integration required. |

---

## 5. Quick Start, Local Running & Docker Deployment  

### 5.1 Prerequisites  

| Tool | Minimum version |
|------|-----------------|
| **Node.js** (optional, only for static server) | 18.x |
| **Docker** | 24.x |
| Modern browser (Chrome, Edge, Firefox, Safari) | – |

> The app is a pure static front‑end; no build step is required unless you want to serve it via a local dev server.

### 5.2 Running Locally (no server)  

1. Clone the repository  

   ```bash
   git clone https://github.com/StrawHatDevCrew/smart-pantry-chef.git
   cd smart-pantry-chef
   ```

2. Open `index.html` in your browser  

   - Double‑click the file, **or**  
   - Right‑click → *Open With* → *Your Browser*  

   All features work directly from the file system because the app only uses `localStorage`.

### 5.3 Running via a Lightweight Static Server  

#### Option A – `npx serve` (Node)  

```bash
npx serve .
# → http://localhost:3000
```

#### Option B – Python HTTP server  

```bash
python -m http.server 8080
# → http://localhost:8080
```

> Using a server avoids CORS warnings that can appear when loading JSON assets via `fetch`.

### 5.4 Docker Container  

A minimal **nginx** image serves the static files.

1. Build the image  

   ```bash
   docker build -t smart-pantry-chef:latest .
   ```

   **Dockerfile** (included in repo):

   ```Dockerfile
   # -------------------------------------------------
   # Multi‑stage static build (no compilation needed)
   # -------------------------------------------------
   FROM nginx:alpine
   COPY ./dist /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

   *Note:* `dist` is the folder containing `index.html`, `assets/`, etc. If you cloned the repo directly, copy the root folder (or run `npm run build` if a bundler is added later).

2. Run the container  

   ```bash
   docker run -d -p 8080:80 --name pantry-chef smart-pantry-chef:latest
   ```

   Open <http://localhost:8080> in a browser.

3. Stop / remove  

   ```bash
   docker stop pantry-chef && docker rm pantry-chef
   ```

### 5.5 Development Tips  

| Task | Command (if you add a bundler later) |
|------|--------------------------------------|
| Watch files & auto‑reload (Vite/Parcel) | `npm run dev` |
| Lint (ESLint) | `npm run lint` |
| Format (Prettier) | `npm run format` |

> At present the project is **framework‑agnostic**; you can drop it into any static‑site host (GitHub Pages, Netlify, Vercel) without modification.

---

## 6. Contributing & License  

- **Contributions** are welcome! Fork the repo, create a feature branch, and submit a PR.  
- Follow the **code‑style guide** (Airbnb JavaScript, Prettier).  
- **Issue tracker** – label bugs with `bug`, enhancements with `enhancement`.  

**License:** MIT – see `LICENSE` file for full text.  

---  

*Prepared by **Robin**, Documentation Specialist – Straw Hat Dev Crew*