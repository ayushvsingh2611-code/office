---
name: system-architecture-design
version: 1.0.0
license: MIT
description: Designs system topology, component interactions, module contracts, and Mermaid architecture diagrams. Use when drafting architectural specs.
author: Panda Hive Internal Engineering
copyright: Copyright (c) 2026 Ayush Singh
source: internal://panda-hive/skills/system-architecture-design
tags:
  - architecture
  - topology
  - system-design
  - contracts
  - mermaid
  - system-architecture
allowed-tools:
  - ReadFile
  - WriteFile
---

# System Architecture & Topology Design

When authoring software architecture and system design specifications:

## 1. Component Boundaries & Decoupling
- Clearly define the separation of concerns:
  * Visual Presentation Layer (`index.html`)
  * Design Token & Styling Layer (`style.css`)
  * State Management & Event Orchestration (`app.js`)
  * Integration Mock Layer & Network Resilience (`integrations.md`)
  * Container Runtime Layer (`Dockerfile`)

## 2. Mermaid Diagramming
- Always provide valid, clean Mermaid diagrams to illustrate component relationships, data flow, and state transitions:
  * Use `graph TD` or `sequenceDiagram`.
  * Avoid raw punctuation in labels; quote labels containing special characters.

## 3. Communication Contracts
- Specify exact event channels, local storage key structures, and function interfaces between UI elements and logic engines.

