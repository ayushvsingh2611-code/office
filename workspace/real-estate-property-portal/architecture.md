*(Stretches arms, cracks knuckles, and steps up to the whiteboard with a fresh marker)*

Yosh! Hancock laid out a clean blueprint for our Grand Line voyage. Now it’s my turn. As your System Architect, I’m going to draw out the structural integrity of this Real-Estate Portal. No shaky foundations allowed—if a sudden wave hits us, this architecture needs to hold strong.

Here is the complete **System Architecture Design**, tech stack blueprint, component boundaries, and scalability contract for Milestone 2. ⚓⚡

---

# 🏗️ System Architecture Design: Real-Estate Property Portal
**Architect:** Shanks (System Architect)  
**Target:** High availability, low-latency search/filtering, seamless client-side financial calculations, and secure modal interactions.

---

## 1. 🛠️ Tech Stack Recommendations

To handle high-throughput property browsing and real-time interactive widgets (like the mortgage calculator and agent modal), we’ll use a modern, decoupled stack optimized for performance and SEO.

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 14+ (App Router)** | Essential for SSR/ISR (Server-Side Rendering / Incremental Static Regeneration) to ensure property listing pages rank high on search engines (SEO) while maintaining client-side interactivity. |
| **Styling & UI** | **Tailwind CSS + Shadcn/UI** | Rapid component development, accessible modal primitives (crucial for the Agent Consultation Modal), and a clean, responsive layout. |
| **Backend API** | **Node.js with Express / NestJS** *(or Next.js API Routes for Monolith)* | Handles property filtering logic, mortgage calculation auxiliary APIs (if server-side validation is needed), and agent consultation lead submissions. |
| **Database** | **PostgreSQL** | Relational data integrity is non-negotiable for properties, pricing, locations, and user inquiries. Supports robust indexing for price/bedroom filters. |
| **Caching/Search Layer**| **Redis** | Caches high-frequency queries (e.g., default filtered property searches) to drastically reduce DB load. |

---

## 2. 🧩 Component Boundaries & Directory Structure

We enforce a strict separation of concerns. UI components do not talk directly to the database; business logic is isolated, and features are modularized.

```text
/src
 ├── app/                          # Next.js App Router (Pages & Routing)
 │   ├── properties/               # US-01: Property listing page
 │   │   ├── page.tsx              # Server Component (Fetches initial properties)
 │   │   └── [id]/                 # Individual property detail view
 │   └── api/                      # Backend API Endpoints
 │       ├── properties/           # GET /api/properties (handles filters)
 │       └── leads/                # POST /api/leads (Agent consultation modal)
 │
 ├── components/                   # Shared UI Components
 │   ├── ui/                       # Design system (Buttons, Inputs, Dialogs via Shadcn)
 │   ├── PropertyCard.tsx          # US-01: Pure presentational component
 │   ├── PropertyFilterBar.tsx     # US-02: Price & Bedroom filter controls
 │   ├── MortgageCalculator.tsx    # US-03: Client-side interactive widget
 │   └── AgentConsultationModal.tsx# US-04: Form dialog component
 │
 ├── services/                     # Business Logic & API Clients
 │   ├── propertyService.ts        # Data fetching & query string builders
 │   └── mortgageUtils.ts          # Pure math functions for mortgage calculations
 │
 └── types/                        # TypeScript Interfaces
     └── property.ts               # Data contracts (Property, FilterParams, AgentLead)
```

### Component Responsibility Matrix:
1. **`PropertyFilterBar` (Client Component):** Captures user input for price ranges and bedroom counts, updating URL query parameters (`router.push`) to keep state bookmarkable and shareable.
2. **`MortgageCalculator` (Client Component):** Purely client-side state machine. Computes monthly payments dynamically on input change without hammering the server.
3. **`AgentConsultationModal` (Client Component / Dialog):** Manages local form state, client-side validation, and triggers an API POST request to store lead data.

---

## 3. 🔄 Data Flow & API Architecture

### Flow for US-01 & US-02 (Browsing & Filtering):
```text
[User Browser] 
    │ (1. Changes Filters: ?minPrice=100k&beds=3)
    ▼
[Next.js Server / API Layer] 
    │ (2. Check Redis Cache) ──(Cache Hit)──> [Return Data]
    │ (3. Cache Miss)
    ▼
[PostgreSQL Database] 
    │ (4. Indexed Query: SELECT * WHERE price >= X AND bedrooms = Y)
    ▼
[API Layer] ──(5. Save to Redis & Respond)──> [Client UI Renders Property Cards]
```

### Flow for US-04 (Agent Consultation Modal):
1. User clicks "Contact Agent" on a property card.
2. Modal opens (`AgentConsultationModal.tsx`) pre-filling the `propertyId`.
3. User submits name, email, phone, and preferred time.
4. Client sends `POST /api/leads`.
5. Backend validates payload, saves lead to PostgreSQL, and triggers an asynchronous notification event (e.g., email to agent via SendGrid/SES).
6. Modal displays a success state and closes.

---

## 4. ⚡ Scalability & Technical Risk Considerations

Every Grand Line ship hits rough waters. Here are the risks Hancock’s requirements might run into, and how we reinforce our hull to handle them:

| Risk Factor | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **DB Query Latency on Complex Filters** | As the property table grows to millions of rows, `WHERE price BETWEEN ... AND bedrooms = ...` can cause full table scans. | **Indexing:** Create composite indexes in PostgreSQL on `(price, bedrooms, status)`. Implement **Redis caching** for popular filter combinations. |
| **Heavy Client-Side Re-renders** | Rapid inputs in the mortgage calculator or filter bar can cause UI lag. | **Debouncing:** Debounce filter inputs and mortgage slider changes. Keep calculation logic lightweight and pure. |
| **Concurrent Lead Spikes** | Flash sales or high-traffic property listings can flood the `/api/leads` endpoint, risking DB locks. | **Rate Limiting:** Implement API rate-limiting (e.g., using Upstash Redis) on lead submission endpoints to prevent spam and DDoS. |
| **SEO & Performance Trade-offs** | Client-side rendering everything makes the site sluggish and invisible to search engines. | **Hybrid Rendering:** Server-render the initial property catalog (`US-01`) using Next.js Server Components, then hydrate interactive filters on the client. |

---

*(Taps whiteboard marker against the frame)*

There it is. The structural blueprint is solid, boundaries are drawn, and technical risks are mitigated. We are ready to set sail on Milestone 3. Let’s build something legendary! 🏴‍☠️