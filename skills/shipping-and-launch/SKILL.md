---
name: shipping-and-launch
version: 1.0.0
license: MIT
description: Production containerization, multi-stage Docker builds, Nginx static serving, lightweight packaging, and deployment release verification.
author: Addy Osmani (addyosmani/agent-skills)
copyright: Copyright (c) 2025 Addy Osmani
notice: skills/NOTICE.md
source: https://github.com/addyosmani/agent-skills/tree/main/skills/shipping-and-launch
tags:
  - devops
  - docker
  - dockerfile
  - deployment
  - container
  - nginx
  - build
allowed-tools:
  - ReadFile
  - WriteFile
---

# Shipping & Container Deployment Protocol

When containerizing and preparing web applications for deployment:

## 1. Multi-Stage Dockerfile Best Practices
- Use official, minimal base images (e.g. `nginx:alpine`).
- Copy static assets (`index.html`, `style.css`, `app.js`) to the webroot directory (`/usr/share/nginx/html`).
- Expose appropriate ports (e.g., `EXPOSE 80`).
- Use non-root daemon execution when security requires it.

## 2. Minimal Attack Surface
- Exclude development dependencies, tests, and temporary scratch files via `.dockerignore`.
- Avoid baking secrets or private keys into container layers.

## 3. Deployment & Local Run Instructions
- Provide exact docker commands for building and running the container:
  * `docker build -t <project-name> .`
  * `docker run -d -p 8080:80 <project-name>`

