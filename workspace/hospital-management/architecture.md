Ahoy, nakama! Shanks here. System Architect mode: **Activated**. ⚔️🗿

Hancock has laid down a pristine blueprint for our Grand Line voyage. Now, it’s my job to forge a hull strong enough to weather any New World storm. A Hospital Management System (HMS) deals with human lives, strict compliance (HIPAA/DPDP), high concurrency, and real-time critical data (like ICU vacancies). We cannot afford a single structural leak.

Here is the complete System Architecture, Component Boundaries, Tech Stack, and Scalability Contract for our HMS.

---

# ⚓ HMS System Architecture Design (By Shanks, Architect)

## 1. High-Level Architecture Pattern
We will adopt a **Modular Monolith transitioning to Microservices-ready Architecture** (or Domain-Driven Design). 
* *Why?* At MVP stage, full microservices introduce unnecessary network overhead and distributed transaction pain (2PC/Sagas). A modular monolith lets us enforce strict module boundaries within a single codebase so that when we scale, we can easily extract modules (e.g., ICU Tracking, Lab Reports) into independent microservices.

```
                              [ Cloudflare CDN / WAF ]
                                         │
                                  [ API Gateway ]
                         (Rate Limiting / JWT Auth / CORS)
                                         │
         ┌───────────────────────────────┼───────────────────────────────┐
         ▼                               ▼                               ▼
  [ Patient Portal ]              [ Doctor Desk ]                [ Admin / ICU ]
  (Next.js SSR/SSG)               (React SPA / PWA)              (React Dashboard)
         └───────────────────────────────┼───────────────────────────────┘
                                         │
                                         ▼
                        [ Backend Core (Node.js / NestJS) ]
         ┌───────────────────┬───────────────────┬───────────────────┐
         ▼                   ▼                   ▼                   ▼
  [ Appointment       [ EMR & Doctor      [ Lab & Inventory   [ Real-Time ICU &
     Module ]            Module ]            Module ]          Queue (WebSockets) ]
         │                   │                   │                   │
         └───────────────────┴───────────────────┴───────────────────┘
                                         │
                    ┌────────────────────┴────────────────────┐
                    ▼                                         ▼
         [ PostgreSQL (Primary DB) ]               [ Redis (Pub/Sub & Cache) ]
         (ACID for Appointments, EMR)              (ICU Slots, Session Store)
```

---

## 2. Tech Stack Recommendations 🛠️

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend (Patient)** | Next.js (React) | SSR/SSG for SEO, fast initial load times, and responsive mobile-first UI for patients. |
| **Frontend (Staff)** | Vite + React / Tailwind CSS | High-performance SPA for Doctors & Desk staff where SEO doesn't matter, but speed and complex UI state do. |
| **Backend Core** | Node.js with **NestJS** | Strict TypeScript support, modular architecture out-of-the-box, dependency injection, and enterprise-grade structure. |
| **Real-time Engine** | Socket.io / Redis Adapter | For live ICU vacancy updates, doctor queue tickers, and emergency notifications. |
| **Primary Database** | **PostgreSQL** | Relational integrity (ACID compliance) is mandatory for patient records, billing, and appointments. Row-Level Security (RLS) for multi-tenancy/privacy. |
| **Caching & Broker** | **Redis** | Sub-millisecond reads for fast-changing ICU bed availability and rate-limiting API requests. |
| **Storage (Files)** | AWS S3 / MinIO (Encrypted) | Secure storage for PDF lab reports, DICOM scans, and prescriptions. Presigned URLs for access. |
| **Infrastructure** | Docker & Kubernetes (K8s) | Containerization for smooth deployments across staging/production. |

---

## 3. Component Boundaries & Domain Modules (NestJS Structure)

To prevent spaghetti code, our backend will be strictly divided into bounded contexts using NestJS Modules:

```text
src/
├── auth/                 # JWT, RBAC (Role-Based Access Control)
├── patients/             # Patient Profile & Demographics
├── appointments/         # Booking, Rescheduling, Slot Management
├── doctor-desk/          # Queue, EMR, Prescriptions
├── icu-tracker/          # Real-time Bed Status & Emergency Triage
├── labs/                 # Lab Order Creation & Report Uploads
└── shared/               # Database config, logger, S3 helpers, Redis
```

### **Boundary Rules:**
1. **No Circular Dependencies:** The `Appointments` module can talk to `Patients`, but `Patients` must not depend on `Appointments`.
2. **Database Isolation:** Modules share the same PostgreSQL instance schema-wise or via logical separation, but queries must stay within their domain boundary (e.g., only `IcuModule` updates the `icu_beds` table).
3. **Event-Driven Handlers:** When a doctor orders a lab test (`Doctor Desk`), it emits an event (`lab.ordered`). The `Labs` module listens to this event and creates a pending task without tightly coupling the codebases.

---

## 4. Scalability & Performance Contracts 📈

As a System Architect, these are the non-negotiable performance SLAs we must guarantee:

* **Latency Targets:**
  * API Read operations (Patient profile, Lab report metadata): **< 200ms (p95)**
  * Appointment Slot Search: **< 100ms** (Cached in Redis)
  * Real-time ICU updates: **< 50ms propagation delay** via WebSockets.
* **Concurrency Handling:**
  * **The Double-Booking Problem:** When two patients try to book the same appointment slot simultaneously, PostgreSQL **Serializable Transactions** or **Optimistic Locking (`version` column)** must be enforced to ensure absolute atomicity.
  * **ICU Vacancy Concurrency:** ICU bed allocation updates must use Redis atomic counters/hashes (`HINCRBY` / Lua scripts) combined with DB locking to prevent ghost-allocations during emergencies.
* **Security & Compliance (The Iron Shield):**
  * **Data at Rest:** All patient data, EMRs, and lab reports must be encrypted using AES-256.
  * **Data in Transit:** TLS 1.3 enforced across all network boundaries.
  * **Authorization:** Role-Based Access Control (RBAC) enforced at the API Gateway and Guard level. A `Patient` token can *never* access `/api/v1/doctor-desk/*` endpoints.

---

## 5. Technical Risks & Mitigation Plan ⚠️

| Risk | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Database Bottleneck during Peak OPD hours** | High (System slowdown) | Read replicas for PostgreSQL for reporting/lab searches; Redis caching for doctor schedules and slot availability. |
| **WebSocket Connection Drops in ICU/Emergency** | Critical | Implement client-side auto-reconnection logic with exponential backoff and local state fallbacks. Heartbeat pings every 15s. |
| **HIPAA/Data Privacy Breach** | Critical (Legal/Ethical) | Strict masking of PII in logs, audit trails for *every* data access event (who viewed which patient record and when), and automated vulnerability scanning in CI/CD. |
| **Third-party S3/Storage Outage** | Medium | Implement circuit breakers and fallback caching for recent lab report summaries. |

---

### **Architect's Sign-Off:**
The framework is solid, Hancock. The structural integrity is locked down. 

Luffy, tell the crew: **Code execution is green light! Let's build this legendary HMS!** 🏴‍☠️🚀