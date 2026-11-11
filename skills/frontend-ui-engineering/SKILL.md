---
name: frontend-ui-engineering
version: 1.0.0
license: MIT
description: Engineering modern, accessible, and responsive frontend interfaces using semantic HTML5, modern CSS variables, flexbox/grid layouts, and WCAG accessibility standards.
author: Addy Osmani (addyosmani/agent-skills)
copyright: Copyright (c) 2025 Addy Osmani
notice: skills/NOTICE.md
source: https://github.com/addyosmani/agent-skills/tree/main/skills/frontend-ui-engineering
tags:
  - frontend
  - ui
  - components
  - layout
  - responsive
  - css
  - html
  - styles
allowed-tools:
  - ReadFile
  - WriteFile
---

# Frontend UI/UX Engineering Protocol

When engineering frontend markup and stylesheets:

## 1. Semantic HTML5 & Stacking Architecture
- Use semantic tags: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.
- Modal Overlays: Ensure modal containers start with `hidden` (`display: none`) and `pointer-events-none` so closed modals never intercept clicks on underlying page controls.
- Modal Dialog Cards: Ensure dialog cards include `pointer-events-auto` so modal buttons, inputs, and close triggers receive clicks when open.

## 2. Design Tokens & Responsive CSS
- Declare root CSS variables for brand colors, typography scales, border radiuses, and shadows.
- Employ CSS Grid and Flexbox for fluid layouts across Mobile (<640px), Tablet (<1024px), and Desktop (>1024px).
- Incorporate interactive hover, focus-visible, and active states for every clickable element.

## 3. Zero Dead Elements & Accessibility (WCAG 2.1 AA)
- Provide descriptive `aria-label` or button text on icon-only buttons.
- Ensure form inputs have matching `<label>` elements or accessible `placeholder`/`aria-label`.
- All buttons must either execute an action or display visual feedback (e.g., toast notification).

