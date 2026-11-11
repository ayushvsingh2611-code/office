---
name: incremental-implementation
version: 1.0.0
license: MIT
description: Vertical slice implementation of application logic, reactive client state, LocalStorage synchronization, and DOM event handling. Use when writing application JavaScript.
author: Addy Osmani (addyosmani/agent-skills)
copyright: Copyright (c) 2025 Addy Osmani
notice: skills/NOTICE.md
source: https://github.com/addyosmani/agent-skills/tree/main/skills/incremental-implementation
tags:
  - backend
  - javascript
  - state
  - reactive
  - localstorage
  - crud
  - events
  - logic
allowed-tools:
  - ReadFile
  - WriteFile
---

# Incremental Implementation & JavaScript Application Logic

When implementing dynamic application logic and reactive state:

## 1. Lifecycle & Event Binding
- Wrap all initialization in `document.addEventListener('DOMContentLoaded', () => { ... })`.
- Safely check for DOM element presence before binding listeners (`el ? el.addEventListener(...) : null`).

## 2. Reactive State & Persistence
- Store master application state in a central object.
- Seed initial data if LocalStorage is empty; persist state changes to LocalStorage synchronously on mutations.
- Re-render affected DOM components whenever state transitions occur.

## 3. Modal Synchronization Lockstep
- When opening a modal:
  * Remove classes: `hidden`, `opacity-0`, `pointer-events-none`.
  * Add classes: `flex`, `opacity-100`, `pointer-events-auto`.
- When closing a modal:
  * Reverse classes in exact lockstep so background filter pills and buttons are immediately clickable.

## 4. Real-Time Search & Filtering
- Filter items on `input` or `keyup` events dynamically in memory without triggering page reloads.
- Render clean empty states when no items match the active query.

