# 🏗️ System Architecture Specification — AI-Powered Job Portal & Instant Resume Tailoring Platform

**System Architect:** Shanks  
**Domain Focus:** Distributed Systems, Real-Time AI Pipeline Orchestration, Asynchronous Queue Architecture & ATS Optimization Engines  

---

## 1. Architecture Overview & High-Level Topology

To guarantee **<60-second end-to-end PDF tailoring**, high-concurrency job matching, and strict factual integrity preservation, the platform relies on an **Asynchronous Event-Driven Micro-Modular Architecture**. 

The system decouples synchronous user interactions (Job Browsing, Application Management) from heavy asynchronous workloads (LLM-based Resume Optimization, PDF Compilation, Embedding Vector Search).

```
                             +------------------------+
                             |   Next.js 14 SSR/SPA   |
                             | (Candidate/Recruiter)  |
                             +-----------+------------+
                                         | REST / WebSockets / gRPC
                                         v
                             +------------------------+
                             |   API Gateway & Edge   |
                             | (Envoy / Kong / NGINX) |
                             +-----------+------------+
                                         |
     +-----------------------------------+-----------------------------------+
     |                                   |                                   |
     v                                   v                                   v
+------------+                  +------------------+                +------------------+
| User & Auth|                  | Job Management & |                | Application &    |
| Service    |                  | Search Service   |                | Match Engine     |
+-----+------+                  +--------+---------+                +--------+---------+
      |                                  |                                   |
      +-------------------+--------------+-----------------------------------+
                          |
                          v
         +--------------------------------+
         | Main DB: PostgreSQL + pgvector |
         +--------------------------------+

                                    [Async Queue: BullMQ / Redis]
                                                 |
            +------------------------------------+------------------------------------+
            |                                                                         |
            v                                                                         v
+---------------------------------------+                              +-------------------------------+
| AI Tailoring & Parsing Service        |                              | PDF Rendering Pipeline        |
| (FastAPI + Claude API Orchestrator)   |                              | (Typst / Puppeteer Cluster)   |
+-------------------+-------------------+                              +---------------+---------------+
                    |                                                                  |
                    v                                                                  v
+---------------------------------------+                              +-------------------------------+
| Object Storage (AWS S3 / Cloudflare R2)|<-----------------------------| Storage Bucket (PDF Resumes)  |
+---------------------------------------+                              +-------------------------------+
```

---

## 2. Core Component Boundaries & Subsystems

### 2.1. User & Auth Service
* **Boundaries:** Identity Management, Auth Token Issuance (JWT/OIDC), Role-Based Access Control (RBAC: `Candidate`, `Recruiter`, `Admin`), Profile Management.
* **Responsibilities:** Manages user sessions, OAuth2 login (LinkedIn/Google), and RBAC policies enforcing API data scope boundaries.

### 2.2. Job Management & Match Engine
* **Boundaries:** Job posting lifecycle, semantic vector indexing, search/filter algorithms.
* **Responsibilities:**
  * Ingests recruiter job postings and parses required vs. preferred technical skills, experience requirements, and responsibilities.
  * Generates high-dimensional embeddings using `text-embedding-3-small` or `Claude Embeddings`.
  * Performs vector cosine similarity searches against candidate profiles to produce instant match percentage scores.

### 2.3. AI Tailoring & Optimization Pipeline (Sub-60s SLA Engine)
* **Boundaries:** LLM Orchestration, Requirement Extraction, Factual Integrity Verification, Content Tailoring.
* **Responsibilities:**
  * **Parser Module:** Converts PDF/Docx Master Resumes into structured JSON Abstract Syntax Trees (AST).
  * **Requirement Ranker:** Extracts hard skills, soft skills, and key metrics from job posts into a weighted JSON matrix.
  * **Tailoring Engine:** Employs Anthropic Claude 3.5 Sonnet to map Candidate Master AST against Job Requirements.
  * **Factual Integrity Guardrail:** Validates generated bullet points against the Master AST. Rejects unauthorized additions (e.g., non-existent degrees, hallucinated employment dates, unverified skills).

### 2.4. Document Parsing & PDF Rendering Pipeline
* **Boundaries:** Resume AST to visual PDF generation.
* **Responsibilities:**
  * Compiles tailored resume AST into ATS-compliant single/multi-page PDFs using headless HTML-to-PDF (`Puppeteer`) or native high-speed binary compilers (`Typst`).
  * Target compilation threshold: **< 3 seconds**.

### 2.5. Application Tracking & Notification System (ATS Workflow)
* **Boundaries:** State machine for application processing (Applied -> Under Review -> Interview -> Hired/Rejected), WebSocket push alerts, Email dispatch.
* **Responsibilities:** Notifies recruiters when top-matched candidates apply; pushes real-time WebSocket progress alerts to candidates during the 60-second tailoring phase.

---

## 3. Technology Stack & Rationale

| Layer | Recommended Technology | Technical Rationale |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 14 (App Router, TypeScript)** | SSR for SEO-optimized Job Listings; Client-side SPA for interactive tailoring dashboards; React Server Components for performance. |
| **UI Component