# Sports Management Portal – External Service Integration Blueprint  
*Prepared by **Brook – Integrations & Content Specialist***  

---  

## 1. High‑Level Integration Landscape  

| External Service | Primary Purpose | Interaction Pattern | Typical Payload Size |
|------------------|----------------|---------------------|----------------------|
| **Live‑Score Feed** | Real‑time match events (goals, cards, period changes) | WebSocket / Server‑Sent Events (push) + REST fallback | ≤ 5 KB per event |
| **Arena‑Turf Booking Engine** | Calendar‑based court/field reservation & payment | REST (CRUD) + Webhooks (booking status) | 1–3 KB per request |
| **Team‑Roster & Player‑Stat DB** | Master data for clubs, squads, historical & live stats | REST (query) + GraphQL (flexible UI) | 2–10 KB per response |
| **Auth & Identity Provider** | Centralised OAuth2 / OpenID Connect for users, admins, partners | OAuth2 Authorization Code + Client‑Credentials | N/A |
| **Notification Service** (SMS/Email/Push) | Confirmation & alert messages | REST (POST) | ≤ 2 KB per message |
| **Analytics / Reporting** (optional) | Aggregate usage & performance metrics | Batch CSV/Parquet export via S3/Blob | > 1 MB per export |

> **Note:** All services must be **region‑aware** (EU, NA, APAC) and support **HTTPS‑only** traffic with **TLS 1.3**.

---

## 2. Core API Contracts  

Below are the **canonical REST contracts** that the portal will expose to external partners (e.g., third‑party apps, stadium operators). All contracts are versioned (`v1`) and documented in an OpenAPI‑3.0 spec (excerpted for brevity).

### 2.1 Authentication & Authorization  

| Endpoint | Method | Description | Request | Response |
|----------|--------|-------------|---------|----------|
| `/oauth/token` | `POST` | Obtain access token (client‑credentials) | `application/x-www-form-urlencoded` <br>`grant_type=client_credentials&client_id={id}&client_secret={secret}` | `200 OK` <br>`{ "access_token": "...", "token_type": "Bearer", "expires_in": 3600 }` |
| `/oauth/authorize` | `GET` | Authorization‑code flow for end‑users | Query params: `response_type=code&client_id=…&redirect_uri=…&scope=…&state=…` | Redirect to `redirect_uri?code=…&state=…` |
| `/oauth/userinfo` | `GET` | Retrieve user profile (OpenID Connect) | `Authorization: Bearer <token>` | `200 OK` <br>`{ "sub": "...", "email": "...", "role": "coach|player|admin" }` |

*All protected resources require the `Authorization: Bearer <access_token>` header.*  

### 2.2 Live Match Fixtures  

| Endpoint | Method | Description | Request | Response |
|----------|--------|-------------|---------|----------|
| `/api/v1/fixtures` | `GET` | List upcoming or past fixtures (filterable) | Query: `?status=upcoming|live|completed&date_from=YYYY-MM-DD&date_to=YYYY-MM-DD&team_id=` | `200 OK` <br>`{ "data": [Fixture], "meta": { "total": 124, "page":1, "size":20 } }` |
| `/api/v1/fixtures/{fixtureId}` | `GET` | Retrieve single fixture details | – | `200 OK` <br>`{ Fixture }` |
| `/api/v1/fixtures/{fixtureId}/events` | `GET` | Live event stream (fallback polling) | – | `200 OK` <br>`{ "events": [Event] }` |
| `/api/v1/fixtures/{fixtureId}/subscribe` | `POST` | Register webhook for live events | `application/json` <br>`{ "url": "https://partner.com/webhook", "events": ["goal","card","period"] }` | `202 Accepted` <br>`{ "subscription_id": "...", "expires_at": "2027-01-01T00:00:00Z" }` |

#### 2.2.1 Data Model – **Fixture**  

```json
{
  "fixture_id": "fx_20231104_001",
  "home_team": {
    "team_id": "tm_001",
    "name": "Bangalore Bulls",
    "logo_url": "https://cdn.sports.com/logos/bulls.png"
  },
  "away_team": {
    "team_id": "tm_002",
    "name": "Delhi Dynamos",
    "logo_url": "https://cdn.sports.com/logos/dynamos.png"
  },
  "venue": {
    "arena_id": "ar_10",
    "name": "Mysore Arena",
    "city": "Mysore",
    "capacity": 8500
  },
  "scheduled_start": "2023-11-04T18:30:00Z",
  "status": "upcoming",               // enum: upcoming | live | completed | cancelled
  "score": { "home": 0, "away": 0 },
  "referee": { "name": "Anita Sharma", "id": "ref_77" }
}
```

### 2.3 Arena Turf Booking  

| Endpoint | Method | Description | Request | Response |
|----------|--------|-------------|---------|----------|
| `/api/v1/arenas` | `GET` | List all rentable arenas (filter by sport, city) | `?sport=football&city=Chennai` | `200 OK` <br>`{ "data": [Arena] }` |
| `/api/v1/arenas/{arenaId}/availability` | `GET` | Calendar slots for a given date range | `?date_from=2023-11-04&date_to=2023-11-10` | `200 OK` <br>`{ "slots": [Slot] }` |
| `/api/v1/bookings` | `POST` | Create a new turf reservation | `application/json` <br>`{ BookingRequest }` | `201 Created` <br>`{ "booking_id": "...", "status": "pending_payment" }` |
| `/api/v1/bookings/{bookingId}` | `GET` | Retrieve booking details | – | `200 OK` <br>`{ Booking }` |
| `/api/v1/bookings/{bookingId}/cancel` | `POST` | Cancel a booking (if policy allows) | – | `200 OK` <br>`{ "status": "cancelled" }` |
| `/api/v1/webhooks/bookings` | `POST` | Incoming webhook from payment gateway (status updates) | – | `200 OK` |

#### 2.3.1 Data Model – **Slot**  

```json
{
  "slot_id": "slot_20231104_18_30",
  "start_time": "2023-11-04T18:30:00Z",
  "end_time": "2023-11-04T20:00:00Z",
  "price": 1200.00,
  "currency": "INR",
  "is_available": true
}
```

#### 2.3.2 Data Model – **Booking**  

```json
{
  "booking_id": "bk_20231104_001",
  "user_id": "usr_12345",
  "arena_id": "ar_10",
  "slot_id": "slot_20231104_18_30",
  "team_name": "Bangalore Bulls U‑19",
  "status": "confirmed",               // enum: pending_payment, confirmed, cancelled, no_show
  "total_amount": 1200.00,
  "currency": "INR",
  "payment_reference": "pay_9876",
  "created_at": "2023-10-28T12:15:34Z",
  "updated_at": "2023-10-28T12:16:10Z"
}
```

### 2.4 Team Rosters & Player Stats  

| Endpoint | Method | Description | Request | Response |
|----------|--------|-------------|---------|----------|
| `/api/v1/teams` | `GET` | List all clubs / academy teams | `?sport=cricket&season=2023` | `200 OK` <br>`{ "data": [Team] }` |
| `/api/v1/teams/{teamId}/roster` | `GET` | Full player roster (active + reserve) | – | `200 OK` <br>`{ "players": [Player] }` |
| `/api/v1/players/{playerId}` | `GET` | Detailed player profile & career stats | – | `200 OK` <br>`{ Player }` |
| `/api/v1/players/{playerId}/stats` | `GET` | Season‑to‑date or match‑specific stats | `?season=2023&fixture_id=fx_20231104_001` | `200 OK` <br>`{ "stats": [Stat] }` |
| `/api/v1/players/batch` | `POST` | Bulk upload/update (CSV/JSON) – used by club admin UI | `multipart/form-data` (file) | `202 Accepted` <br>`{ "job_id": "...", "status": "processing" }` |

#### 2.4.1 Data Model – **Player**  

```json
{
  "player_id": "pl_00123",
  "first_name": "Rohan",
  "last_name": "Kumar",
  "full_name": "Rohan Kumar",
  "date_of_birth": "2001-04-12",
  "nationality": "IND",
  "height_cm": 185,
  "weight_kg": 78,
  "position": "Forward",
  "preferred_foot": "Right",
  "shirt_number": 9,
  "team_id": "tm_001",
  "profile_photo": "https://cdn.sports.com/players/pl_00123.jpg",
  "contract": {
    "start_date": "2022-07-01",
    "end_date": "2025-06-30",
    "salary_usd_per_year": 85000
  },
  "status": "active",               // enum: active, injured, suspended, retired
  "social_links": {
    "instagram": "https://instagram.com/rohan_k",
    "twitter": "https://twitter.com/rohan_k"
  }
}
```

#### 2.4.2 Data Model – **Stat** (per‑match)  

```json
{
  "fixture_id": "fx_20231104_001",
  "player_id": "pl_00123",
  "team_id": "tm_001",
  "minutes_played": 90,
  "goals": 2,
  "assists": 1,
  "shots_on_target": 4,
  "passes_completed": 56,
  "pass_accuracy_pct": 89.3,
  "tackles": 3,
  "yellow_cards": 0,
  "red_cards": 0,
  "rating": 8.7
}
```

---

## 3. Integration Requirements  

| Category | Requirement | Rationale |
|----------|-------------|-----------|
| **Security** | - OAuth2 (client‑credentials for server‑to‑server, auth‑code for end‑users) <br> - JWT signed with RS256, **kid** rotation every 30 days <br> - All endpoints TLS 1.3, HSTS, CSP | Protect PII, financial data, and live scores |
| **Reliability** | - 99.5 % SLA for live‑score push (WebSocket) <br> - Retry‑with‑exponential‑backoff on 5xx <br> - Idempotency keys on `POST /bookings` and `POST /players/batch` | Prevent duplicate reservations / data corruption |
| **Performance** | - Pagination (max 100 items) <br> - Cursor‑based pagination for fixtures ( `next_cursor` ) <br> - Rate limits: 200 req/min per client‑id (burst 500) <br> - Cache‑control: `public, max‑age=30` for static arena metadata | Keep UI snappy and protect back‑ends |
| **Data Governance** | - GDPR/CCPA compliance – `DELETE /users/{id}` for user data <br> - Data retention: match events kept 2 years, bookings 5 years <br> - Versioned schemas (`v1`, `v2`) with backward‑compatible deprecation schedule (12 months) | Legal & audit readiness |
| **Observability** | - Structured JSON logs (requestId, latency, status) <br> - OpenTelemetry traces for all inbound/outbound calls <br> - Prometheus metrics: `api_requests_total`, `booking_success_rate` | Fast incident detection |
| **Testing / Staging** | - Separate sandbox environment (`sandbox.api.sports.com`) with identical contracts <br> - Mock Live‑Score feed (simulated events) <br> - Contract‑testing via **Pact** (consumer‑driven) | Safe integration for partners |
| **Internationalisation** | - ISO‑8601 timestamps, ISO‑4217 currency codes <br> - Locale header (`Accept-Language`) for venue names, team names <br> - Unicode UTF‑8 everywhere | Global rollout |

---

## 4. Realistic Sample Data Sets  

Below are ready‑to‑paste JSON files that can be imported into a mock server (e.g., **json‑server**, **WireMock**) for functional demos.

### 4.1 Fixtures (`fixtures.json`)

```json
{
  "data": [
    {
      "fixture_id": "fx_20231104_001",
      "home_team": { "team_id": "tm_001", "name": "Bangalore Bulls", "logo_url": "https://cdn.sports.com/logos/bulls.png" },
      "away_team": { "team_id": "tm_002", "name": "Delhi Dynamos", "logo_url": "https://cdn.sports.com/logos/dynamos.png" },
      "venue": { "arena_id": "ar_10", "name": "Mysore Arena", "city": "Mysore", "capacity": 8500 },
      "scheduled_start": "2023-11-04T18:30:00Z",
      "status": "upcoming",
      "score": { "home": 0, "away": 0 },
      "referee": { "name": "Anita Sharma", "id": "ref_77" }
    },
    {
      "fixture_id": "fx_20231104_002",
      "home_team": { "team_id": "tm_003", "name": "Chennai Chargers", "logo_url": "https://cdn.sports.com/logos/chargers.png" },
      "away_team": { "team_id": "tm_004", "name": "Kolkata Kings", "logo_url": "https://cdn.sports.com/logos/kings.png" },
      "venue": { "arena_id": "ar_22", "name": "Chennai Sports Complex", "city": "Chennai", "capacity": 12000 },
      "scheduled_start": "2023-11-04T20:45:00Z",
      "status": "upcoming",
      "score": { "home": 0, "away": 0 },
      "referee": { "name": "Rohit Patel", "id": "ref_88" }
    }
  ],
  "meta": { "total": 2, "page": 1, "size": 20 }
}
```

### 4.2 Arena Slots (`slots_ar_10_20231104.json`)

```json
{
  "slots": [
    {
      "slot_id": "slot_20231104_08_00",
      "start_time": "2023-11-04T08:00:00Z",
      "end_time": "2023-11-04T09:30:00Z",
      "price": 800.00,
      "currency": "INR",
      "is_available": true
    },
    {
      "slot_id": "slot_20231104_09_45",
      "start_time": "2023-11-04T09:45:00Z",
      "end_time": "2023-11-04T11:15:00Z",
      "price": 950.00,
      "currency": "INR",
      "is_available": false
    },
    {
      "slot_id": "slot_20231104_18_30",
      "start_time": "2023-11-04T18:30:00Z",
      "end_time": "2023-11-04T20:00:00Z",
      "price": 1200.00,
      "currency": "INR",
      "is_available": true
    }
  ]
}
```

### 4.3 Booking Example (`booking_created.json`)

```json
{
  "booking_id": "bk_20231104_001",
  "user_id": "usr_12345",
  "arena_id": "ar_10",
  "slot_id": "slot_20231104_18_30",
  "team_name": "Bangalore Bulls U‑19",
  "status": "confirmed",
  "total_amount": 1200.00,
  "currency": "INR",
  "payment_reference": "pay_9876",
  "created_at": "2023-10-28T12:15:34Z",
  "updated_at": "2023-10-28T12:16:10Z"
}
```

### 4.4 Team Roster (`team_tm_001_roster.json`)

```json
{
  "players": [
    {
      "player_id": "pl_00123",
      "full_name": "Rohan Kumar",
      "position