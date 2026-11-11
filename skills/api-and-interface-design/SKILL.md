---
name: api-and-interface-design
version: 1.0.0
license: MIT
description: Designs RESTful API contracts, JSON request/response payloads, mock service endpoints, and network resilience fallbacks. Use for integration specifications.
author: Addy Osmani (addyosmani/agent-skills)
copyright: Copyright (c) 2025 Addy Osmani
notice: skills/NOTICE.md
source: https://github.com/addyosmani/agent-skills/tree/main/skills/api-and-interface-design
tags:
  - integrations
  - api
  - mock
  - sample-data
  - payload
  - contracts
  - services
allowed-tools:
  - ReadFile
  - WriteFile
---

# API & Interface Design Protocol

When engineering external service integration specifications:

## 1. RESTful API Contracts
- Define exact endpoint paths, HTTP methods (`GET`, `POST`, `PUT`, `DELETE`), and query parameters.
- Provide explicit JSON request bodies and response schemas.
- Document HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Server Error`).

## 2. Realistic Mock Fallbacks & Offline Resilience
- Specify offline mock responses so the application functions seamlessly even when disconnected from live cloud backends.
- Document simulated latency and timeout handling strategies.

## 3. Data Sanitization & Payload Typing
- Specify payload types, required fields, and format constraints (e.g. ISO-8601 timestamps, UUID identifiers).

