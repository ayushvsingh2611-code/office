---
name: spec-driven-development
version: 1.0.0
license: MIT
description: Authors rigorous product specifications, user stories with acceptance criteria (Given/When/Then), and edge case boundaries. Use when defining feature requirements.
author: Addy Osmani (addyosmani/agent-skills)
copyright: Copyright (c) 2025 Addy Osmani
notice: skills/NOTICE.md
source: https://github.com/addyosmani/agent-skills/tree/main/skills/spec-driven-development
tags:
  - requirements
  - spec
  - user-story
  - acceptance-criteria
  - scope
  - specifications
allowed-tools:
  - ReadFile
  - WriteFile
---

# Specification-Driven Development Protocol

When engineering application specifications and user stories:

## 1. User Stories & Acceptance Criteria
- Write explicit user stories following standard agile format:
  * *As a [persona], I want [action], so that [outcome].*
- Pair each user story with unambiguous `Given/When/Then` acceptance criteria.

## 2. Scope Boundaries (In-Scope vs Out-of-Scope)
- Clearly delineate what belongs in the prototype vs what belongs in future production milestones.
- Specify simulated vs live requirements (e.g. LocalStorage persistence vs live database).

## 3. Edge Case Enumeration
- Identify boundary conditions: empty states, long text overflow, rapid multi-clicks, invalid input formats.
- Ensure the specification guides frontend error handling and input feedback.

