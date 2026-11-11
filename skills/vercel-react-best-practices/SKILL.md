---
name: vercel-react-best-practices
version: 1.0.0
license: MIT
description: Performance optimization and architectural best practices for modern React applications. Eliminates re-renders, waterfalls, hook misuse, and bundle bloat. Activate only when working on React projects.
author: Vercel Labs (vercel-labs/agent-skills)
copyright: Copyright (c) 2025 Vercel, Inc.
notice: skills/NOTICE.md
source: https://github.com/vercel-labs/agent-skills/tree/main/skills/vercel-react-best-practices
tags:
  - react
  - performance
  - hooks
  - re-render
  - frontend
  - state-management
allowed-tools:
  - ReadFile
  - WriteFile
  - EditFile
---

# Vercel React Best Practices & Performance Guidelines

When developing or refactoring React applications, apply these production performance rules:

## 1. Eliminating Request & Async Waterfalls
- Avoid sequential `await` statements for independent async operations. Use `Promise.all` or `Promise.allSettled`.
- Defer `await` calls as close as possible to the component tree or branch where the data is rendered.

## 2. Rendering & State Hygiene
- Compute derived state directly during render cycles rather than syncing with `useEffect` and secondary `useState`.
- Avoid placing expensive computations inside the render path; wrap with `useMemo` only when measuring actual rendering bottlenecks.
- Keep state local to the components that require it. Avoid lifting state globally when only a sub-tree needs updates.

## 3. Hook & Effect Best Practices
- Never use `useEffect` for data transformation or event handling that belongs in event listeners.
- Keep hook dependencies strictly exhaustive. Do not suppress ESLint `react-hooks/exhaustive-deps`.
- Clean up subscriptions, intervals, and event listeners in the `useEffect` return function.

## 4. Component Structure & Bundle Optimization
- Split large components into focused, atomic presentational components.
- Avoid large monolithic bundle imports; import directly from modular sub-paths.
- Use stable keys for lists derived from unique entity IDs, never array indices when items can reorder or filter.

