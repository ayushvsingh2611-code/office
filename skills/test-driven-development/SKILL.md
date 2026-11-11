---
name: test-driven-development
version: 1.0.0
license: MIT
description: Strict Red-Green-Refactor test-driven development protocol. Enforces authoring and watching a test fail before writing implementation code. Use when adding features, contracts, or regression tests.
author: Jesse Vincent (obra/superpowers)
copyright: Copyright (c) 2025 Jesse Vincent
notice: skills/NOTICE.md
source: https://github.com/obra/superpowers/tree/main/skills/test-driven-development
tags:
  - testing
  - tdd
  - red-green-refactor
  - unit-testing
  - regression
  - qa
allowed-tools:
  - ReadFile
  - WriteFile
  - EditFile
---

# Test-Driven Development (TDD) Protocol

When authoring new features, services, or bug repairs, adhere to the Iron Law of TDD:

> **NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST.**
> If you did not watch the test fail, you do not know if it is testing the right behavior.

## The Red-Green-Refactor Cycle

### 1. RED: Write a Minimal Failing Test
- Write a single, focused test that asserts the exact expected behavior or API contract.
- Keep the test isolated, readable, and free of over-mocking.
- The test must clearly state the business requirement being tested.

### 2. Verify RED: Watch the Test Fail
- Execute the test runner (e.g. `node --test`, `npm test`).
- Confirm that the test fails for the expected reason (e.g. function missing, wrong return value, exception thrown).
- If the test passes immediately without code changes, the test is invalid or redundant.

### 3. GREEN: Write Minimal Implementation Code
- Write the minimum amount of production code needed to make the test pass.
- Do not write speculative future features during the green phase.
- Run the test suite and confirm all tests pass cleanly.

### 4. REFACTOR: Clean & Optimize
- Refactor for readability, eliminate duplication, and simplify logic while keeping tests green.
- Verify that architectural boundaries and typing contracts are satisfied.
- Commit the test and implementation together with a descriptive commit message.

