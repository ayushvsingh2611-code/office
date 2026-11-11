---
name: systematic-debugging
version: 1.0.0
license: MIT
description: Disciplined 4-phase root-cause investigation and evidence-based debugging. Forbids guessing or symptom patching before reproducing failures and inspecting logs. Use when debugging test failures or runtime errors.
author: Jesse Vincent (obra/superpowers)
copyright: Copyright (c) 2025 Jesse Vincent
notice: skills/NOTICE.md
source: https://github.com/obra/superpowers/tree/main/skills/systematic-debugging
tags:
  - debugging
  - troubleshooting
  - root-cause
  - bug-fixing
  - diagnostics
  - errors
allowed-tools:
  - ReadFile
  - WriteFile
  - EditFile
  - SearchFiles
---

# Systematic Debugging Protocol

When diagnosing bugs, test failures, or runtime exceptions, follow the Iron Law of Debugging:

> **NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST.**
> If you have not gathered evidence and isolated the failure mechanism, do not apply speculative edits.

## Phase 1: Evidence Gathering & Reproduction
- Identify the exact failure symptom: read the stack trace, error message, or test output completely.
- Reproduce the failure consistently with a minimal test or script before modifying application code.
- Inspect logs, variable values, and network/DOM states at the point of failure.

## Phase 2: Pattern & Difference Analysis
- Compare working states with broken states: what changed between the working state and the failure?
- Inspect recent git diffs or file edits that touched the affected module.
- Formulate a single falsifiable hypothesis explaining why the error occurs.

## Phase 3: Root-Cause Fix Implementation
- Implement a targeted fix that resolves the underlying failure mechanism, not just the surface symptom.
- Avoid stacking speculative changes. Change one variable or logic branch at a time.
- Verify that the fix does not introduce side-effects or break related contracts.

## Phase 4: Validation & Regression Prevention
- Run the reproduction test to prove the fix works permanently.
- Execute the full test suite to guarantee zero regression across previously working features.
- Clean up any temporary debug logs or scaffolding.

