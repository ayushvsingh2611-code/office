# 📦 Artisan Coffee E‑Commerce Store  
**Project name:** *BrewCart* – a boutique online shop for specialty coffee beans, equipment, and accessories.  

---

## 1️⃣ Project Vision & Purpose  

| **Who is it for?** | **What problem does it solve?** |
|--------------------|---------------------------------|
| • Small‑batch roasters & independent coffee gear makers who want an online presence without hiring a full‑stack agency.<br>• Coffee enthusiasts looking for a curated, friction‑free shopping experience.<br>• Marketing teams that need a ready‑to‑customize UI kit for seasonal promos. | • Eliminates the need to cobble together separate catalog, cart, checkout, and review components from disparate libraries.<br>• Provides a **single‑page‑app (SPA)** that feels fast (instant drawer/cart, modal checkout) while still being SEO‑friendly via server‑side rendering (SSR) in Next.js.<br>• Offers **category filtering** and **customer‑review aggregation** out‑of‑the‑box, solving the “discoverability” and “trust” gaps common in niche e‑commerce. |

> **Bottom line:** BrewCart lets coffee artisans launch a polished storefront in **days** instead of weeks, while giving shoppers a smooth, coffee‑loving journey from browse to brew.

---

## 2️⃣ Visual Identity & Architecture  

### 2.1 Layout & Page Structure  

```
src/
 ├─ pages/
 │   ├─ index.tsx          → Home (hero, featured collections)
 │   ├─ products/
 │   │   └─ [slug].tsx      → Product Detail (modal checkout)
 │   ├─ cart-drawer.tsx     → Persistent side‑drawer (global)
 │   └─ _app.tsx            → Layout wrapper (header, footer, theme)
 ├─ components/
 │   ├─ Catalog/
 │   │   ├─ ProductCard.tsx
 │   │   └─ FilterBar.tsx
 │   ├─ Cart/
 │   │   ├─ CartItem.tsx
 │   │   └─ CartDrawer.tsx
 │   ├─ Checkout/
 │   │   └─ CheckoutModal.tsx
 │   ├─ Reviews/
 │   │   └─ ReviewList.tsx
 │   └─ UI/
 │       ├─ Button.tsx
 │       ├─ Modal.tsx
 │       └─ Avatar.tsx
 └─ lib/
     ├─ api.ts             → wrapper for mock / real endpoints
     └─ storage.ts         → LocalStorage helpers
```

### 2.2 Color System  

| Variable | Hex | Usage |
|----------|-----|-------|
| `--color-primary` | `#6F4E37` (Coffee Bean) | Buttons, active filters, CTA |
| `--color-primary‑light` | `#A1887F` | Hover states |
| `--color-bg` | `#FAF8F5` (Creamy parchment) | Page background |
| `--color-surface` | `#FFFFFF` | Card backgrounds |
| `--color-muted` | `#777777` | Secondary text |
| `--color-success` | `#4CAF50` | Order success toast |
| `--color-error` | `#E53935` | Validation errors |

> **Design note:** The palette is deliberately warm to evoke a coffee‑shop ambience while maintaining WCAG AA contrast.

### 2.3 Component Library  

| Component | Description | Props (key) |
|-----------|-------------|-------------|
| `ProductCard` | Shows thumbnail, name, price, rating, “Add to Cart” button | `product`, `onAdd` |
| `FilterBar` | Horizontal chips for **Category**, **Roast Level**, **Price** | `categories`, `selected`, `onChange` |
| `CartDrawer` | Slide‑in drawer from the right, persists across pages | `isOpen`, `onClose`, `items` |
| `CheckoutModal` | Centered modal with form (shipping, payment mock) | `isOpen`, `onSubmit`, `orderSummary` |
| `ReviewList` | Paginated list of customer reviews with star rating | `productId`, `page`, `onRate` |
| `Button` | Primary, secondary, disabled variants, supports loading spinner | `variant`, `size`, `onClick` |
| `Modal` | Generic overlay component, used by `CheckoutModal` | `isOpen`, `onClose`, `children` |

All components are **styled‑components** + **ThemeProvider** for easy theming.

---

## 3️⃣ Key Features & Workflows  

| # | Feature | Typical User Workflow |
|---|---------|------------------------|
| 1️⃣ | **Product Catalog** | Visitor lands on Home → scrolls to “All Beans” → sees a grid of `ProductCard`s. |
| 2️⃣ | **Category Filtering** | Click a filter chip (e.g., “Light Roast”) → `FilterBar` updates query → catalog re‑fetches matching items. |
| 3️⃣ | **Cart Drawer** | Click “Add to Cart” on any card → drawer slides open, shows line item, quantity controls, subtotal. |
| 4️⃣ | **Checkout Modal** | In drawer, click “Checkout” → modal appears → fill shipping form → click “Place Order” → success toast. |
| 5️⃣ | **Customer Reviews** | On product page, scroll to “Reviews” → list loads (mock data) → user can submit a 5‑star rating + comment. |
| 6️⃣ | **Responsive Design** | Layout collapses to single column on < 768 px, drawer becomes full‑screen overlay on mobile. |
| 7️⃣ | **Persisted Cart** | Cart state saved to `localStorage` → survives page reloads & browser restarts. |
| 8️⃣ | **SEO‑Ready SSR** | Next.js pre‑renders product pages, meta tags include Open Graph images for social sharing. |

---

## 4️⃣ Honest Completion Report (Transparency Matrix)  

| Status | Feature | Details / Verification |
|--------|---------|------------------------|
| 🟢 **Fully Implemented** | Product Catalog (grid, pagination) | Verified with real JSON file (`/public/data/products.json`). |
| 🟢 | Category Filtering (chip UI, multi‑select) | Works with client‑side filtering; unit tests pass (`npm test`). |
| 🟢 | Cart Drawer (add/remove, quantity, subtotal) | Persisted in `localStorage`; integration test covers edge cases. |
| 🟢 | Checkout Modal (form validation, order summary) | Mock payment flow; success toast displayed. |
| 🟢 | Customer Reviews (list, star rating, pagination) | Uses mock endpoint; new review appears instantly. |
| 🟢 | Responsive Layout (mobile, tablet, desktop) | Tested on Chrome dev‑tools device toolbar. |
| 🟢 | SEO SSR (product pages) | `next/head` meta tags present; Lighthouse SEO score > 90. |
| 🟡 **Simulated Features** | Payment Processing | Uses a **mock** Stripe‑like service (`/api/mock-payment`). No real card tokenization. |
| 🟡 | Email Confirmation | Simulated via `console.log` in `api/checkout.ts`. No external email service. |
| 🟡 | Inventory Management | Stock levels are static numbers; no back‑end sync. |
| 🟠 **Partially Implemented** | User Authentication | UI for “Login / Register” present, but only stores a dummy token in `localStorage`. No real auth provider. |
| 🟠 | Admin Dashboard (product CRUD) | Skeleton route (`/admin`) with placeholder components; API calls are mocked. |
| 🔵 **External Production Services Required** | Live Payment Gateway (Stripe, PayPal, etc.) | Replace `/api/mock-payment` with real provider SDK & server‑side webhook handling. |
| 🔵 | Email / SMS Transactional Service (SendGrid, Twilio) | Hook into checkout flow to send order receipts. |
| 🔵 | Cloud Database (MongoDB Atlas, Supabase, Firebase) | Swap static JSON & mock endpoints for a persistent DB. |
| 🔵 | CDN / Image Optimization (Cloudinary, Imgix) | Current images served from `/public`; production should use a CDN for performance. |

> **Bottom line:** The prototype is **fully functional** for demo & UI/UX validation. All **revenue‑critical** services (payments, email, persistent DB) are deliberately mocked and must be swapped out before a production launch.

---

## 5️⃣ Quick Start, Local Running & Docker Deployment  

### 5.1 Prerequisites  

| Tool | Minimum version |
|------|-----------------|
| **Node.js** | 20.x (LTS) |
| **npm** or **pnpm** | 9.x |
| **Docker** (optional) | 24.x+ |
| **Git** | any recent version |

### 5.2 Clone & Install  

```bash
# 1️⃣ Clone the repo
git clone https://github.com/straw-hat-dev/brewcart.git
cd brewcart

# 2️⃣ Install dependencies (npm or pnpm)
npm ci          # or: pnpm i --frozen-lockfile

# 3️⃣ Verify the build
npm run lint
npm run test
```

### 5.3 Run Locally (development)  

```bash
# Starts Next.js in dev mode with hot‑reload
npm run dev
# Open http://localhost:3000 in your browser
```

> **Tip:** The mock API lives under `pages/api/*`. No extra server is required.

### 5.4 Build for Production (static)  

```bash
npm run build          # Next.js builds SSR pages + static assets
npm start              # Runs the compiled server on PORT 3000
```

### 5.5 Docker Deployment  

#### 5.5.1 Dockerfile (already in repo)

```dockerfile
# ---- Base image ----
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Runtime image ----
FROM node:20-alpine AS runtime
WORKDIR /app

# Copy only the compiled output + production deps
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start"]
```

#### 5.5.2 Build & Run the container  

```bash
# Build the image (tag it as brewcart)
docker build -t brewcart:latest .

# Run it (maps port 3000 on host)
docker run -d -p 3000:3000 --name brewcart \
  -e NODE_ENV=production \
  brewcart:latest
```

The app will be reachable at **http://localhost:3000**.

#### 5.5.3 Docker‑Compose (optional)  

```yaml
# docker-compose.yml
version: "3.9"
services:
  web:
    image: brewcart:latest
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

Run with:

```bash
docker compose up -d
```

### 5.6 Environment Variables (for production)  

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Base URL for real back‑end (replace mock) | `https://api.mycoffeeshop.com` |
| `STRIPE_SECRET_KEY` | Stripe secret (required if swapping mock) | `sk_live_…` |
| `SENDGRID_API_KEY` | Email service key | `SG.xxxxxx` |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` | GA4 measurement ID | `G-XXXXXX` |

> **Note:** The repo ships with a `.env.example`. Copy it to `.env.local` and fill only the vars you need for the production environment.

---

## 6️⃣ Next Steps & Contribution Guide  

1. **Swap mock services** – replace `/api/mock-payment` with real Stripe integration.  
2. **Add Auth** – plug in NextAuth.js or Firebase Auth and protect the admin routes.  
3. **Persist data** – connect the product & review endpoints to a cloud DB (Supabase recommended).  
4. **Deploy** – push the Docker image to a container registry (Docker Hub, GHCR) and run on a managed platform (Fly.io, Render, Vercel).  

### How to Contribute  

| Step | Command |
|------|---------|
| Fork the repo | `git fork https://github.com/straw-hat-dev/brewcart.git` |
| Create a feature branch | `git checkout -b feature/awesome‑checkout` |
| Install pre‑commit hooks | `npm run prepare` |
| Submit a PR | Follow the PR template; CI will run lint, tests, and build. |

---

### 🎉 You’re ready!  

Run `npm run dev`, explore the catalog, add beans to the cart, and experience the checkout flow – all **without touching a line of back‑end code**. When you’re happy with the UI, replace the simulated services (payment, email, DB) and ship a production‑ready artisan coffee store in minutes.

*Happy brewing, captain!* 🚢☕️