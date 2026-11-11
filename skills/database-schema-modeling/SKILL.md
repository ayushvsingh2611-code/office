---
name: database-schema-modeling
version: 1.0.0
license: MIT
description: Designs relational and document data models, entity schemas, field validation rules, and realistic mock seed datasets. Use for data architecture and state modeling.
author: Panda Hive Internal Engineering
copyright: Copyright (c) 2026 Ayush Singh
source: internal://panda-hive/skills/database-schema-modeling
tags:
  - data
  - schema
  - models
  - database
  - entity
  - state-management
  - validation
  - data-models
allowed-tools:
  - ReadFile
  - WriteFile
---

# Database Schema & Data Modeling Protocol

When designing data schemas and seed data:

## 1. Entity Relational Design
- Define each primary entity with explicit field names, data types, constraints, and relationships:
  * Primary keys (e.g. `id: string (UUID or slug)`)
  * Foreign key relationships and cascade behavior
  * Timestamps (`createdAt`, `updatedAt`)

## 2. Validation & Integrity Rules
- Specify required vs optional fields.
- Document range checks, regex patterns (e.g. email, phone), and enum constraints.

## 3. Realistic Mock Seed Data
- Provide diverse, realistic seed records rather than generic `Item 1`, `Item 2` placeholders.
- Mirror domain-specific realistic pricing, timestamps, names, categories, and image URLs.
- Include state persistence schema for client-side storage (e.g., LocalStorage keys).

