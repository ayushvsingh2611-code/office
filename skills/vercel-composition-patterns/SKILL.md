---
name: vercel-composition-patterns
version: 1.0.0
license: MIT
description: Component composition patterns, compound components, slot patterns, and decoupling UI structure from state. Eliminates boolean prop proliferation. Activate only when designing component architectures.
author: Vercel Labs (vercel-labs/agent-skills)
copyright: Copyright (c) 2025 Vercel, Inc.
notice: skills/NOTICE.md
source: https://github.com/vercel-labs/agent-skills/tree/main/skills/vercel-composition-patterns
tags:
  - composition
  - components
  - architecture
  - ui-patterns
  - slots
  - compound-components
allowed-tools:
  - ReadFile
  - WriteFile
  - EditFile
---

# Vercel Component Composition Patterns

When designing component architecture and reusable UI elements:

## 1. Avoid Boolean Prop Proliferation
- Do not add endless boolean flags (e.g. `hasIcon`, `isSmall`, `isHeader`, `showFooter`, `withDropdown`).
- Instead of multi-mode conditional monolithic components, use component composition with explicit child subcomponents.

## 2. Compound Component Architecture
- Structure complex related components as compound groups (e.g. `<Card>`, `<Card.Header>`, `<Card.Body>`, `<Card.Footer>`).
- Share implicit state across the compound tree using lightweight context providers rather than prop drilling.

## 3. Slot Patterns & Children over Render Props
- Prefer passing elements via `children` or named slots over nested `renderItem` functions.
- Decouple layout containers from the specific data elements they enclose.

## 4. State Decoupling & Explicit Variants
- Encapsulate interactive state inside controller/provider wrappers, leaving visual components purely presentational.
- Define explicit variant components or sub-types rather than deeply nested ternary branching.

