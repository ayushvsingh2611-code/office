---
name: web-design-guidelines
version: 1.0.0
license: MIT
description: Professional web interface guidelines, accessibility standards (WCAG AA/AAA), typography scales, 8pt spatial grid, and contrast rules. Use when designing, building, or auditing frontend UI.
author: Vercel Labs (vercel-labs/agent-skills)
copyright: Copyright (c) 2025 Vercel, Inc.
notice: skills/NOTICE.md
source: https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines
tags:
  - web-design-guidelines
  - design-guidelines
  - design-system
  - accessibility
  - wcag
  - typography
  - visual-hierarchy
  - design-audit
allowed-tools:
  - ReadFile
  - WriteFile
  - EditFile
---

# Web Design & Interface Quality Guidelines Protocol

When engineering, styling, or auditing user interfaces, adhere to Vercel's Web Interface Guidelines:

## 1. Visual Hierarchy & Information Architecture
- Establish an unambiguous primary action per view. Do not present multiple competing primary buttons.
- Group related items together using proximity before adding explicit visual borders or backgrounds.
- Use whitespace intentionally. Default to an 8-point spatial rhythm (8px, 16px, 24px, 32px, 48px).

## 2. Accessible Color & Contrast (WCAG AA)
- Normal text must achieve a minimum contrast ratio of 4.5:1 against its background.
- Large text (18pt+ or 14pt bold) must achieve at least 3:1 contrast ratio.
- Never rely exclusively on color to convey state (e.g. error, success, selection). Always accompany with icons, text labels, or distinct shapes.
- Define theme tokens via CSS variables for colors, surface elevations, and borders.

## 3. Typography & Scannability
- Limit font families to a single coherent system font stack or well-matched serif/sans pair.
- Maintain consistent optical weight scales (400 regular, 500 medium, 600 semi-bold).
- Ensure body text line-height is at least 1.5 for scannability, with line-length capped between 45 and 75 characters.
- Use numerals for quantities and stats instead of written words for faster parsing.

## 4. Modern Component Styling
- Avoid generic, cliché AI styling (e.g. indiscriminate purple gradients, excessive border radius, ungrounded heavy drop-shadows).
- Build clean, intentional component borders with subtle opacity (e.g. `rgba(255, 255, 255, 0.1)` on dark, `rgba(0, 0, 0, 0.08)` on light).
- Ensure interactive elements feature clear `:hover`, `:focus-visible`, and `:active` states.

