---
name: qa-testing
version: 1.0.0
license: MIT
description: Playwright headless browser testing, DOM validation, button click verification, and QA diagnostics for web applications.
tags:
  - testing
  - qa
  - playwright
  - browser
  - verification
allowed-tools:
  - BrowserTest
  - ReadFile
---

# Web Application QA & Testing Protocol

Execute comprehensive browser testing and functional validation for web applications:

## 1. Initial DOM & State Verification
- Verify initial DOM state: ensure modals are closed with `hidden` class and `pointer-events-none`.
- Confirm overlay elements do not block underlying interactive buttons or filter tabs on initial load.
- Ensure all navigation links and filter pills are rendered and clickable.

## 2. Interactive Functional Testing
- Simulate realistic user clicks across all buttons, filter tabs, and modal toggles.
- Verify form submission, input validation, and dynamic element rendering.
- Test real-time search filtering without requiring page reload.
- Verify LocalStorage data persistence across page reloads.

## 3. Honest Status Matrix
- Report actual observed test results (PASS / FAIL / REJECTED) with zero fabrication.
- Log exact selectors, interactions executed, and state mutations observed.

