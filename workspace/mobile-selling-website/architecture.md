# System Architecture & Technical Design Document: Mobile Selling Website

**Author:** Shanks (System Architect)  
**Project:** Mobile Selling Website (E-commerce Platform for Mobiles & Accessories)  
**Standard:** Open Agent Skills Specification & Vercel Component Composition Patterns  

---

## 1. System Architecture Overview & Component Boundaries

The Mobile Selling Website is architected as a modular, high-performance web application designed for scalability, maintainability, and clean separation of concerns.

```mermaid
graph TD
    subgraph Client Layer [Frontend Presentation Layer]
        UI[Index.html & UI Components]
        Style[CSS Design Tokens & Tailwind-like Utility Classes]
        App[Vanilla JS SPA Controller / State Manager]
    end

    subgraph Integration & Persistence Layer
        Storage[LocalStorage / Session Cache]
        API[Mock / RESTful API Integration Layer]
    end

    subgraph Server & Database Layer (Production Target)
        Backend[Node.js / Express or Next.js API Routes]
        DB[(PostgreSQL / MongoDB Database)]
        Auth[JWT Authentication Service]
    end

    UI --> App
    Style --> UI
    App --> Storage
    App --> API
    API -.-> Backend
    Backend --> Auth
    Backend --> DB
```

### Component Boundaries & Separation of Concerns
1. **Visual Presentation Layer (`index.html`): Semantic HTML5 structure with distinct sections (Header, Hero, Product Catalog, Filters Sidebar, Cart Drawer, Checkout Modal, Order Success View, Admin Panel).**
2. **Design Token & Styling Layer (`style.css`): Modern CSS variables, responsive CSS Grid / Flexbox layouts, accessibility styling, and smooth transition animations adhering to mobile-first responsive breakpoints.**
3. **State Management & Event Orchestration (`app.js`): Centralized reactive state store managing user authentication, product catalog filters, cart items, active modals, and simulated network persistence.**
4. **Integration Mock Layer & Network Resilience (`integrations.md` / Mock API Client): Robust asynchronous service layer with simulated latency, error handling, and offline fallbacks.**

---

## 2. Component Composition Patterns (Vercel-Inspired)

To maintain a clean and scalable UI without boolean prop proliferation or monolithic conditional rendering, we adopt **Compound Component Architecture** and **Slot Patterns**:

### Card Compound Component Pattern
```html
<!-- Example of Compound Component Composition -->
<div class="product-card" data-product-id="123">
  <div class="product-card__badge-slot"></div>
  <div class="product-card__media">
    <img src="..." alt="..." />
  </div>
  <div class="product-card__body">
    <h3 class="product-card__title">Samsung Galaxy S24</h3>
    <div class="product-card__specs">8GB RAM • 256GB • New</div>
    <div class="product-card__price">$799.00</div>
  </div>
  <div class="product-card__footer">
    <button class="btn btn-primary add-to-cart-btn">Add to Cart</button>
  </div>
</div>
```

---

## 3. Recommended Tech Stack

| Tier | Technology Choice | Rationale |
| :--- | :--- | :--- |
| **Frontend** | HTML5, Vanilla JavaScript (ES6+ Modules), CSS3 | Lightweight, zero-build-step complexity for standalone prototype, lightning-fast execution. |
| **Styling** | Custom CSS Variables + Flexbox/Grid | High performance, complete control over design tokens, fully responsive. |
| **State Management** | Custom Pub/Sub Event Store (`app.js`) | Reactive updates across cart badge, product filters, and checkout without heavy framework overhead. |
| **Persistence** | Browser `localStorage` | Seamless offline cart and session persistence for prototype evaluation. |
| **Backend & API (Scale target)** | Node.js with Express / TypeScript OR Next.js API Routes | Robust middleware support, JWT authentication, easy integration with Stripe and PostgreSQL. |
| **Database (Scale target)** | PostgreSQL with Prisma ORM | Relational integrity for orders, users, inventory stock, and product categories. |

---

## 4. Communication Contracts & State Schema

### LocalStorage Schema
```json
{
  "auth_token": "eyJhbGciOiJIUzI1NiIsIn...",
  "current_user": {
    "id": "usr_948102",
    "email": "customer@example.com",
    "role": "ROLE_CUSTOMER"
  },
  "cart": {
    "items": [
      {
        "productId": "prod_s24_01",
        "name": "Samsung Galaxy S24",
        "price": 799.00,
        "quantity": 1,
        "image": "assets/s24.jpg",
        "specs": "256GB / Black"
      }
    ],
    "updatedAt": "2025-02-24T12:00:00Z"
  }
}
```

---

## 5. Scalability & Technical Risk Mitigation

| Risk Vector | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Inventory Race Conditions** | Two customers buy the last phone simultaneously. | Implement atomic database transactions (`SELECT ... FOR UPDATE`) and real-time inventory validation at checkout submission. |
| **Client-Side State Desync** | Cart or auth state mismatch between tabs. | Listen to `window.addEventListener('storage', ...)` to sync state across browser tabs instantly. |
| **Slow Catalog Searches** | Heavy filtering over large product sets lags UI. | Debounce search inputs (300ms) and index searchable columns (`brand`, `price`, `condition`) in the database. |
| **Payment Gateway Timeouts** | Stripe API hangs during checkout. | Implement idempotency keys in payment requests and show a graceful loading overlay with retry capability. |
