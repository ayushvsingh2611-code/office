---
name: security-and-hardening
version: 1.0.0
license: MIT
description: Comprehensive application security review, OWASP Top 10 vulnerability mitigation, input sanitization, XSS/injection protection, and security posture auditing.
author: Addy Osmani (addyosmani/agent-skills) & OWASP Community
copyright: Copyright (c) 2025 Addy Osmani
notice: skills/NOTICE.md
source: https://github.com/addyosmani/agent-skills/tree/main/skills/security-and-hardening
tags:
  - security
  - audit
  - owasp
  - sanitization
  - xss
  - csrf
  - vulnerability
  - protection
allowed-tools:
  - ReadFile
  - WriteFile
---

# Web Application Security & Hardening Protocol

When performing security audits and architectural hardening:

## 1. OWASP Top 10 Vulnerability Audit
- Assess the application against core security risks:
  * **A01: Broken Access Control:** Ensure unauthorized users cannot perform state mutations.
  * **A02: Cryptographic Failures:** Prohibit storing raw passwords or sensitive credentials in LocalStorage or plain text.
  * **A03: Injection & XSS:** Sanitize all user inputs before rendering into the DOM tree. Never use un-escaped `innerHTML` with unsanitized user content. Prefer `textContent` or robust DOMPurify patterns.
  * **A07: Identification & Authentication Failures:** Review session and credential handling.

## 2. Content Security Policy (CSP) & Headers
- Recommend or verify secure HTTP headers: `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`.
- Restrict inline script execution and external script loading origins.

## 3. Severity Matrix & Actionable Remediation
- Classify all identified security findings by severity: Critical, High, Medium, Low, or Informational.
- Provide concrete code remediations for each vulnerability identified.

