---
name: frontend-design
description: Production-grade frontend design engineering, distinctive aesthetics, responsive layout systems, typography, and anti-generic visual polish.
license: MIT
---

# Frontend Design Engineering Skill

## Purpose
Build memorable, high-fidelity, production-grade frontend interfaces with intentional aesthetics, modern typography, balanced contrast, and responsive fluidity. Avoid bland, templated, cookie-cutter defaults.

## Core Directives
1. **Intentional Aesthetics:**
   - Establish a bold, coherent design hierarchy (primary accent, secondary tint, rich dark/light surface tokens).
   - Use subtle layered shadows (`box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)`).
   - Provide micro-interactions: smooth transitions (`transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1)`), hover transforms (`transform: translateY(-2px)`), and active button presses.

2. **Typography & Hierarchy:**
   - Always load high-quality web fonts via Google Fonts CDN: `Plus Jakarta Sans`, `Inter`, `Outfit`, or `Space Grotesk`.
   - Never use unstyled raw browser fonts (`Times New Roman`).
   - Distinct heading styles with tight line-heights (`line-height: 1.15`) and letter spacing (`letter-spacing: -0.02em`).

3. **High-Contrast Readability (Zero Eye-Strain):**
   - Ensure WCAG AA contrast ratio (minimum 4.5:1 for body text, 3:1 for large headings).
   - On dark themes, use deep dark slate backgrounds (`#0a0f1d`, `#0f172a`) with crisp light text (`#f8fafc`, `#e2e8f0`). Never put bright cyan or low-contrast neon on light white backgrounds.

4. **Component Patterns:**
   - **Modern Cards:** Rounded corners (`border-radius: 12px` to `16px`), 1px translucent borders (`border: 1px solid rgba(255, 255, 255, 0.1)` or `rgba(0, 0, 0, 0.08)`).
   - **Glassmorphism:** `backdrop-filter: blur(12px); background: rgba(15, 23, 42, 0.85);`
   - **Floating Drawers & Modals:** Always default to hidden state (`display: none;` or class `hidden`) with `pointer-events-none` on backdrop, transitioning to visible on open.
