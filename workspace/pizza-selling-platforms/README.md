# 🍕 **Pizza‑Hub** – A Full‑Stack Pizza‑Selling Platform  
*Documentation prepared by **Robin** (Documentation Specialist, Straw Hat Dev Crew)*  

---  

## 1. Project Vision & Purpose  

| **Target Persona** | **Problem Statement** | **Why Pizza‑Hub?** |
|--------------------|-----------------------|--------------------|
| **Independent Pizzerias & Food‑Truck Owners** | • No affordable, ready‑made online ordering system.<br>• High fees & rigid contracts with third‑party marketplaces.<br>• Difficulty managing orders, inventory, and delivery logistics in one place. | A lightweight, self‑hosted web app that lets any pizza‑maker launch a branded storefront in minutes, keep 100 % of revenue, and retain full control over the order flow. |
| **Local Customers** | • Want a fast, trustworthy way to order from nearby pizza spots without juggling multiple apps.<br>• Need real‑time order status and transparent pricing. | One‑click discovery of nearby pizzerias, instant cart experience, and live order tracking. |
| **Developers / Hobbyists** | • Looking for a reference project that showcases modern UI, state management, and integration patterns for e‑commerce. | Clean, modular codebase with best‑practice UI components, mock‑API layers, and Docker‑ready deployment. |

> **Mission:** Empower every pizza‑maker to sell online on *their* terms, while giving customers a delightful, friction‑free ordering journey.  

---  

## 2. Visual Identity & Architecture  

### 2.1 Layout & Component Hierarchy  

```
<root>
 ├─ <header>                – Brand logo, navigation, cart badge
 ├─ <main>
 │    ├─ <section class="hero">        – Hero banner, call‑to‑action
 │    ├─ <section class="menu">        – Pizza catalogue (grid)
 │    │    └─ <article class="pizza-card">
 │    │         ├─ <img> (pizza image)
 │    │         ├─ <h3> (name)
 │    │         ├─ <p> (description)
 │    │         ├─ <div class="price"> (price)
 │    │         └─ <button> (Add to cart)
 │    ├─ <section class="cart-modal">   – Modal overlay (hidden → shown)
 │    └─ <section class="checkout">     – Form wizard (address, payment)
 └─ <footer>                – Contact, social links, legal
```

*All pages are responsive via **CSS Grid** (desktop) and **Flexbox** (mobile).*

### 2.2 Design Tokens (CSS Variables)  

```css
:root {
  /* Brand palette */
  --c-primary:   #D7263D;   /* Tomato red */
  --c-primary-d: #A51B2A;   /* Darker for hover/active */
  --c-accent:    #F5A623;   /* Cheesy amber */
  --c-bg:        #FAFAFA;   /* Light page background */
  --c-surface:   #FFFFFF;   /* Cards, modals */
  --c-text:      #212529;   /* Primary text */
  --c-muted:     #6C757D;   /* Secondary/placeholder */

  /* Typography */
  --font-base:   'Inter', system-ui, sans-serif;
  --fs-base:     1rem;      /* 16 px */
  --fs-lg:       1.25rem;   /* 20 px – headings */
  --fs-sm:       .875rem;   /* 14 px – captions */

  /* Spacing & radius */
  --sp-xs: .25rem;
  --sp-sm: .5rem;
  --sp-md: 1rem;
  --sp-lg: 2rem;
  --radius-sm: .25rem;
  --radius-md: .5rem;
  --radius-lg: 1rem;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,.12);
  --shadow-md: 0 4px 6px rgba(0,0,0,.15);
}
```

### 2.3 Core UI Components  

| Component | Description | Accessibility notes |
|-----------|-------------|----------------------|
| **Header/Nav** | Fixed top bar with logo, navigation links, cart badge (ARIA‑label “shopping cart, X items”). | `role="navigation"`; focusable links. |
| **PizzaCard** | Grid card showing image, name, short description, price, “Add to Cart” button. | Button has `aria-label="Add {pizza name} to cart"`. |
| **Cart Modal** | Overlay (`display:none` + `pointer-events:none` when hidden). Shows line items, quantity controls, total, “Checkout” CTA. | Modal has `role="dialog"` and `aria-modal="true"`. |
| **Checkout Wizard** | Multi‑step form: Delivery address → Payment → Review → Confirmation. | Each input paired with `<label>`; error messages announced via `aria-live="polite"`. |
| **Toast Notification** | Small transient message (e.g., “Pizza added to cart”). | `role="status"` and `aria-live="polite"`. |
| **Button** | Primary (red), secondary (transparent), disabled states. | `:focus-visible` outline, `aria-disabled` when needed. |

---  

## 3. Key Features & Workflows  

### 3.1 Feature Overview  

| # | Feature | Brief Description |
|---|---------|-------------------|
| 1 | **Dynamic Pizza Catalogue** | Fetches pizza data (mock JSON) and renders responsive cards. |
| 2 | **Cart Management** | Add / remove / adjust quantity; persists in `localStorage`. |
| 3 | **Checkout Flow** | Address form → simulated payment → order summary. |
| 4 | **Order Confirmation** | Generates a unique order ID, displays toast, and stores order locally. |
| 5 | **Admin Dashboard (stub)** | Placeholder UI for future inventory & order management. |
| 6 | **Responsive Design** | Mobile‑first breakpoints (≤640 px, ≤1024 px, >1024 px). |
| 7 | **Theming via CSS Variables** | Easy brand recolor by editing `:root` tokens. |
| 8 | **Docker Containerization** | Single‑stage build serving static assets via **nginx**. |
| 9 | **Accessibility (WCAG 2.1 AA)** | Semantic HTML, ARIA labels, focus management, colour contrast ≥ 4.5:1. |

### 3‑step Customer Workflow  

1. **Browse** – Landing page → scroll through pizza cards.  
2. **Select** – Click “Add to Cart” → toast appears, cart badge updates.  
3. **Checkout** – Open cart modal → “Checkout” → fill address → click “Pay”.  
4. **Confirm** – Order confirmation screen with order number & estimated delivery time.  

---  

## 4. Honest Completion Report (Transparency Matrix)  

| Status | Feature | Current Implementation | Notes |
|--------|---------|------------------------|-------|
| 🟢 **Fully Implemented** | Pizza catalogue rendering (real‑time filter, responsive grid) | Verified in functional prototype – works with static JSON file. |
| 🟢 **Fully Implemented** | Cart add/remove, quantity controls, `localStorage` persistence | Cart state survives page reloads. |
| 🟢 **Fully Implemented** | Checkout wizard UI, client‑side validation, order summary | All steps navigate correctly; validation messages appear. |
| 🟢 **Fully Implemented** | Toast notifications & visual feedback on all actions | Accessible `role="status"` used. |
| 🟡 **Simulated** | Payment processing | Mock service that waits 2 s then returns success; no real gateway. |
| 🟡 **Simulated** | Order storage | Orders saved to `localStorage` only; no backend DB. |
| 🟡 **Simulated** | Email/SMS notifications | Uses `setTimeout` to simulate delivery of a “Your order is on the way” message. |
| 🟠 **Partially Implemented** | Admin Dashboard | UI skeleton present; no CRUD operations or auth. |
| 🔵 **External Production Required** | Live payment gateway (Stripe / PayPal) | Replace mock service with real SDK and server‑side webhook handling. |
| 🔵 **External Production Required** | Cloud database (e.g., DynamoDB, Firestore) | Persist orders, inventory, user profiles. |
| 🔵 **External Production Required** | Email / SMS provider (SendGrid, Twilio) | Real transactional notifications. |
| 🔵 **External Production Required** | CI/CD pipeline & TLS termination (optional) | For production‑grade deployments. |

---  

## 5. Quick Start, Local Running & Docker Deployment  

### 5.1 Prerequisites  

| Tool | Minimum version |
|------|-----------------|
| **Node.js** (optional, only for `serve` CLI) | 14.x |
| **Docker** | 20.10+ |
| **Git** | any |

> The app is pure static HTML/CSS/JS – no server‑side runtime is required.

### 5.2 Running Locally (without Docker)

1. **Clone the repo**  

   ```bash
   git clone https://github.com/StrawHatDevCrew/pizza-hub.git
   cd pizza-hub
   ```

2. **Open directly** – Double‑click `index.html` in a modern browser (Chrome, Edge, Firefox).  
   *Works for quick visual testing but some browsers block `localStorage` when opened via `file://` on certain security settings.*

3. **Serve with a lightweight static server** (recommended)

   ```bash
   # Using npm’s serve (install if missing)
   npx serve .
   # or Python’s built‑in server
   python -m http.server 8080
   ```

   Visit `http://localhost:3000` (or `http://localhost:8080` for Python) and explore the app.

### 5.3 Docker Build & Run  

> The Docker image uses **NGINX** to serve the static assets.  

```bash
# 1️⃣ Build the image (tag it as pizza-hub)
docker build -t pizza-hub:latest .

# 2️⃣ Run a container, exposing port 80
docker run -d -p 8080:80 --name pizza-hub \
  pizza-hub:latest
```

Open your browser at `http://localhost:8080`.  

#### Dockerfile (for reference)

```dockerfile
# ---- Build stage (optional, for asset minification) ----
# FROM node:20-alpine AS builder
# WORKDIR /app
# COPY . .
# RUN npm ci && npm run build   # if you have a build step

# ---- Runtime stage ----
FROM nginx:alpine
COPY ./dist /usr/share/nginx/html   # or copy the repo root if no build step
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

> **Tip:** If you edit files locally, simply rebuild (`docker build .`) and restart the container.

### 5.4 Development Tips  

| Goal | Command / Action |
|------|------------------|
| **Live reload** (if you add a bundler) | `npm run dev` (not included in the static prototype) |
| **Inspect storage** | Open DevTools → Application → Local Storage → `http://localhost` |
| **Reset app state** | `localStorage.clear()` in console or click the “Reset Demo” button (if added). |

---  

## 6. Contributing & Future Roadmap  

- **Contributions** are welcomed via pull‑requests. Follow the existing component pattern and keep the design token file (`styles/variables.css`) as the single source of truth.  
- **Roadmap (next 3‑6 months)**  
  1. Integrate Stripe Checkout (serverless function).  
  2. Replace `localStorage` with a cloud‑hosted NoSQL DB (e.g., Firebase).  
  3. Add real‑time order tracking via WebSockets.  
  4. Implement role‑based admin UI with authentication (OAuth).  
  5. CI/CD pipeline with GitHub Actions + automated security scans.  

---  

### 📚 References  

- **Design System** – Based on Material Design colour contrast guidelines.  
- **Accessibility** – WCAG 2.1 AA checklist (focus order, ARIA roles, contrast).  
- **Docker** – Official NGINX image (alpine).  

---  

*End of documentation.*