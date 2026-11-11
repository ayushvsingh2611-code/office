# 📐 System Topology & Architecture Spec — gym-and-fitness-workout-tracker
**System Architect:** Shanks (Straw Hat System Architect)
**System Scope:** "create gym and fitness workout tracker"

---

## 1. System Topology
The application runs as a modern, decoupled Single Page Application (SPA) with containerized deployment:
- **Presentation Tier:** Semantic HTML5 + Responsive Modern CSS
- **State & Logic Tier:** Reactive Event-Driven Engine with LocalStorage Sync
- **Deployment Tier:** Multi-stage Nginx Alpine container for high availability

```
[ User Browser / Device ]
       │
       ▼
[ Nginx Alpine Web Server (Port 80) ]
       │
       ├──► index.html (Semantic Structure & Accessibility)
       ├──► style.css  (Modern Tokens, Flex/Grid, Transitions)
       └──► app.js    (Reactive Store, Live Filter, Cart Drawer, Toasts)
```

---

## 2. Component Hierarchy
- **Header:** Brand Logo, Search Bar (`#search-form`), Action Buttons (Account, Wishlist, Cart `#cart-count`)
- **Navigation:** Category filters & quick-jump anchor links
- **Hero / Showcase:** Featured banner with primary CTA
- **Catalog / Main Content Area:** Dynamic grid of interactive items/products
- **Cart Drawer & Overlay:** Slide-over modal with live quantity adjustment & checkout
- **Toast Container:** Fixed overlay for instant visual feedback on user actions
- **Footer:** Brand description, categories, policies, and copyright

---

## 3. State Schema
```json
{
  "cart": [{ "id": "string", "name": "string", "price": "number", "qty": "number" }],
  "wishlist": ["string"],
  "search": "string",
  "category": "string",
  "theme": "dark | light"
}
```

*Architecture Approved by Oscar Martinez.*
