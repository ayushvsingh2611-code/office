---
name: stitch
description: >
  Google Stitch AI UI/UX Design & Prototyping Engine (stitch.withgoogle.com).
  Use whenever generating, designing, or refactoring web interfaces, landing pages,
  dashboards, e-commerce storefronts, or component libraries. Produces high-fidelity,
  responsive HTML5, modern CSS, and Tailwind-ready layouts with custom brand palettes,
  interactive states, and zero generic boilerplate.
license: Apache-2.0
---

# Google Stitch — AI-Native UI/UX Design Engine

Google Stitch (`stitch.withgoogle.com`) is an AI-native interface design, vibe-design, and rapid prototyping platform. It bridges natural-language product visions and production-grade frontend layouts.

## Capabilities & Workflows
1. **Bespoke Aesthetic Generation:** Transforms vague ideas (e.g. *"Zepto quick commerce store"*, *"Linear-style dark dashboard"*, *"Scientific calculator with neon glassmorphism"*) into custom, authentic color schemes, typography scales, and layouts.
2. **Component-Driven Architecture:** Generates semantic, accessible HTML5 with clean class names and scoped CSS / Tailwind utilities.
3. **Responsive Grid & Flexbox:** Mobile-first layouts with horizontal scrollers, responsive card grids, sticky glassmorphic navigation headers, and floating action pills.
4. **Developer Handoff:** Clean separation of concerns between visual markup (`index.html`), design tokens (`style.css`), and dynamic behavior (`app.js`).

## Golden Rules for Stitch UI Generation
1. **Never Output Watermarks or Agent Meta:** Do not include bot names, autonomous team labels, or generation disclaimers in the UI. The application must look 100% like a standalone commercial product.
2. **Brand-Specific Identity:**
   - **Quick Commerce (Zepto / Blinkit / Instamart):** Deep Violet (`#3c006b`), Action Green (`#00d06c`), Highlight Pink (`#ff3269`), 10-Minute Delivery ticker, category strip, product cards with weight, strike-through MRP, and "+ ADD" button.
   - **Modern SaaS / Tech:** Dark slate background (`#090d16`), subtle glassmorphism (`backdrop-filter: blur(12px)`), blue/violet accents, clean metric cards.
   - **Utility / Calculators:** Sleek hardware or glass housing, high-contrast digital display, distinct number vs operator key styling.
3. **Always Include Interactive Hooks:** Include semantic IDs and data attributes for backend binding:
   - Search inputs: `id="site-search"`
   - Cart triggers: `id="cart-button"`, `id="cart-count"`
   - Wishlist triggers: `id="wishlist-button"`
   - Action buttons: `.btn-add-cart`, `.card-action-btn`, `[data-key]`

