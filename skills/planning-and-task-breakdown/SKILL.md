---
name: planning-and-task-breakdown
version: 1.0.0
license: MIT
description: Decomposes product specifications and large features into ordered, verifiable, dependency-aware milestone tasks. Use when starting a new sprint or project decomposition.
author: Addy Osmani (addyosmani/agent-skills)
copyright: Copyright (c) 2025 Addy Osmani
notice: skills/NOTICE.md
source: https://github.com/addyosmani/agent-skills/tree/main/skills/planning-and-task-breakdown
tags:
  - planning
  - orchestration
  - decomposition
  - sprint
  - task-breakdown
allowed-tools:
  - ReadFile
  - WriteFile
---

# Planning & Task Breakdown Protocol

When orchestrating a software project or milestone roadmap:

## 1. Specification Ingestion
- Read the project prompt and user requirements thoroughly before declaring milestone plans.
- Identify core user personas, key functional workflows, and technical constraints.

## 2. Dependency Graph & Sequencing
- Order milestones strictly by dependency order:
  1. Planning & Milestone Scoping
  2. Requirements & Specification
  3. System Topology & Data Models
  4. UI Layout, CSS Design Tokens & Application Logic
  5. External Service Contracts & Security Review
  6. Automated Browser Verification & Containerization
  7. Senior Code Review Quality Gate & Documentation
- Ensure no agent begins downstream work before architectural contracts are established.

## 3. Verifiable Milestones
- Every task must have unambiguous deliverables and acceptance gates.
- Explicitly avoid generic filler tasks. Every deliverable must serve a distinct purpose in the running prototype.

