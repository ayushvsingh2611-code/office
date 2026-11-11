---
name: browser-testing-with-devtools
version: 1.0.0
license: MIT
description: Real browser automated testing, Playwright CDP headless execution, DOM structure inspection, interaction verification, and honest QA reporting.
author: Addy Osmani (addyosmani/agent-skills)
copyright: Copyright (c) 2025 Addy Osmani
notice: skills/NOTICE.md
source: https://github.com/addyosmani/agent-skills/tree/main/skills/browser-testing-with-devtools
tags:
  - testing
  - qa
  - playwright
  - browser
  - dom
  - verification
  - audit
  - bugs
allowed-tools:
  - BrowserTest
  - ReadFile
  - WriteFile
---

# Browser Testing & QA Diagnostics Protocol

When executing QA verification and browser interaction tests:

## 1. Static & Runtime Inspection
- **JavaScript Syntax Validation:** Ensure zero V8 parser errors in client scripts.
- **Static DOM Inspection:** Verify semantic HTML elements (`button`, `form`, `input`, `nav`) are rendered and attached to the DOM tree on initial load.
- **Pointer-Events & Stacking Check:** Confirm closed modals do not intercept clicks intended for underlying page elements.

## 2. Real Browser Interaction Execution
- Execute real headless browser clicks on interactive targets:
  * Filter pills, navigation tabs, view toggles.
  * Modal open and close triggers.
  * Form inputs and submission buttons.
- Test LocalStorage persistence across page reload events.

## 3. Honest Status Reporting
- Report observed findings truthfully (PASS / FAIL / REJECTED) with zero fabrication.
- If interactive elements fail or DOM lacks buttons, immediately record FAIL and route defects to responsible specialists.

