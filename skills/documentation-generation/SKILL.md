---
name: documentation-generation
version: 1.0.0
license: MIT
description: Authors clear, comprehensive technical documentation, project READMEs, architecture summaries, and honest feature completion matrices.
author: Panda Hive Internal Engineering
copyright: Copyright (c) 2026 Ayush Singh
source: internal://panda-hive/skills/documentation-generation
tags:
  - documentation
  - readme
  - user-guide
  - technical-writing
  - markdown
  - docs
allowed-tools:
  - ReadFile
  - WriteFile
---

# Technical Documentation & README Protocol

When authoring project documentation and technical README files:

## 1. Project Vision & Architecture
- Outline the project purpose, core user personas, and problem statement.
- Document the visual design system, typography, and component hierarchy.

## 2. Honest Feature Completion Matrix (Mandatory Transparency)
Provide a clear status table distinguishing prototype fidelity from production requirements:
- 🟢 **Fully Implemented:** Verified interactive features working in the functional prototype.
- 🟡 **Simulated / Mock:** LocalStorage persistence, simulated backend delays, sample JSON records.
- 🟠 **Partially Implemented:** Scaffolding or UI present without complete dynamic backend binding.
- 🔵 **External Production Required:** Third-party gateways (live Stripe/PayPal, Twilio SMS, Cloud DB).

## 3. Quick Start & Deployment Guide
- Step-by-step local running instructions:
  * Open `index.html` directly in any modern browser.
  * Run via lightweight static server: `npx serve .` or Python `python -m http.server 8080`.
  * Containerized deployment: `docker build` and `docker run` commands.

