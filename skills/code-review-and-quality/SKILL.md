---
name: code-review-and-quality
version: 1.0.0
license: MIT
description: Rigorous multi-axis code review, architecture compliance checks, security verification, and quality gate sign-off. Use when reviewing code deliverables.
author: Addy Osmani (addyosmani/agent-skills)
copyright: Copyright (c) 2025 Addy Osmani
notice: skills/NOTICE.md
source: https://github.com/addyosmani/agent-skills/tree/main/skills/code-review-and-quality
tags:
  - review
  - code-review
  - quality-gate
  - clean-code
  - linting
  - verification
allowed-tools:
  - ReadFile
  - WriteFile
---

# Code Review & Quality Gate Protocol

When reviewing code deliverables before sprint sign-off:

## 1. Five-Axis Code Review Matrix
Evaluate all deliverables against five strict axes:
1. **Correctness & Functionality:** Does the code satisfy the functional requirements? Are edge cases handled?
2. **Architecture Compliance:** Does the code respect component boundaries and established contracts?
3. **Security Posture:** Are user inputs sanitized? Are secrets excluded?
4. **Performance & Responsiveness:** Are layout shifts prevented? Is event delegation used where appropriate?
5. **Maintainability & Readability:** Is naming semantic? Is dead code removed?

## 2. Evidence-Based Verification
- Require concrete verification evidence (syntax checks, DOM presence, passing tests) before issuing approval.
- Refuse to approve incomplete or non-functioning implementations.

## 3. Anti-Rationalization Guardrails
- Reject rationalizations such as "it's just a prototype" when foundational interactive behaviors fail.
- Clearly list any remaining technical debt or follow-up recommendations.

