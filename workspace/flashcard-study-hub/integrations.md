## Flashcard‑Study‑Hub – Integration & Content Specification  
*Prepared by **Brook** – Integrations & Content Specialist*  

---  

### 1️⃣  Project Overview  

| Feature | Description |
|--------|-------------|
| **Deck Management** | CRUD operations for flash‑card decks (create, list, update, delete, clone). |
| **Flip‑Card Study Mode** | Retrieve a random card (or next in order) for “front → back” flipping. |
| **Mock Quiz Evaluation** | Generate a quiz from a deck, submit answers, receive scored feedback. |
| **LocalStorage Persistence** | Offline‑first UI – all user‑generated decks & progress are cached in the browser and synced when the backend is reachable. |

The front‑end (React/TS) talks to a **RESTful flashcard service** (hosted on AWS API‑Gateway + Lambda or any Node/Express API). All calls must be resilient: when the service is unavailable the UI falls back to **mock data** defined in this spec.

---  

## 2️⃣  External Service Integration Requirements  

| Requirement | Details |
|-------------|---------|
| **Authentication** | Optional – JWT Bearer token in `Authorization` header. For demo mode the token can be omitted; the API returns `401` when a protected endpoint receives an invalid token. |
| **Rate Limiting** | 60 req/min per IP. Return `429 Too Many Requests` with `Retry‑After` header. |
| **CORS** | `Access‑Control‑Allow‑Origin: *` (or specific front‑end origin). |
| **Latency Simulation** | Mock fallback must simulate **200‑400 ms** network latency; timeout handling on the client after **5 s**. |
| **Error‑Handling Conventions** | All error bodies follow `{ "error": "<code>", "message": "<human readable>" }`. |
| **Versioning** | All endpoints under `/api/v1/`. Future breaking changes must bump the version. |
| **Offline Resilience** | When the service is unreachable, the front‑end reads/writes **LocalStorage** (see § 6) and uses the **Mock API** defined below. |

---  

## 3️⃣  RESTful API Contracts  

> **Notation** – JSON schemas are expressed in **JSON‑Schema Draft‑07** style.  
> **All timestamps** are ISO‑8601 strings (UTC).  
> **All IDs** are UUID‑v4 strings.

### 3.1 Deck Endpoints  

| Method | Path | Description | Request Body | Success Response | Errors |
|--------|------|-------------|--------------|------------------|--------|
| `GET` | `/api/v1/decks` | List all decks visible to the caller. | – | `200` – `{ decks: Deck[] }` | `401`, `500` |
| `POST` | `/api/v1/decks` | Create a new deck. | `CreateDeckRequest` | `201` – `{ deck: Deck }` | `400`, `401`, `500` |
| `GET` | `/api/v1/decks/{deckId}` | Get deck details + card count. | – | `200` – `{ deck: Deck }` | `401`, `404`, `500` |
| `PUT` | `/api/v1/decks/{deckId}` | Update deck metadata (title, description, tags). | `UpdateDeckRequest` | `200` – `{ deck: Deck }` | `400`, `401`, `404`, `500` |
| `DELETE` | `/api/v1/decks/{deckId}` | Delete a deck (cascade delete cards). | – | `204 No Content` | `401`, `404`, `500` |
| `POST` | `/api/v1/decks/{deckId}/clone` | Duplicate a deck (owner becomes current user). | – | `201` – `{ deck: Deck }` | `401`, `404`, `500` |

#### Schemas  

```json
// Deck
{
  "type": "object",
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "title": { "type": "string", "minLength": 1, "maxLength": 120 },
    "description": { "type": "string", "maxLength": 500 },
    "tags": {
      "type": "array",
      "items": { "type": "string", "pattern": "^[a-zA-Z0-9_-]{1,30}$" },
      "uniqueItems": true
    },
    "cardCount": { "type": "integer", "minimum": 0 },
    "ownerId": { "type": "string", "format": "uuid" },
    "createdAt": { "type": "string", "format": "date-time" },
    "updatedAt": { "type": "string", "format": "date-time" }
  },
  "required": ["id", "title", "ownerId", "createdAt", "updatedAt"]
}
```

```json
// CreateDeckRequest
{
  "type": "object",
  "properties": {
    "title": { "type": "string", "minLength": 1, "maxLength": 120 },
    "description": { "type": "string", "maxLength": 500 },
    "tags": {
      "type": "array",
      "items": { "type": "string", "pattern": "^[a-zA-Z0-9_-]{1,30}$" },
      "uniqueItems": true
    }
  },
  "required": ["title"]
}
```

```json
// UpdateDeckRequest – same fields as CreateDeckRequest, all optional
{
  "type": "object",
  "properties": {
    "title": { "type": "string", "minLength": 1, "maxLength": 120 },
    "description": { "type": "string", "maxLength": 500 },
    "tags": {
      "type": "array",
      "items": { "type": "string", "pattern": "^[a-zA-Z0-9_-]{1,30}$" },
      "uniqueItems": true
    }
  },
  "additionalProperties": false
}
```

---

### 3.2 Card Endpoints  

| Method | Path | Description | Request Body | Success Response | Errors |
|--------|------|-------------|--------------|------------------|--------|
| `GET` | `/api/v1/decks/{deckId}/cards` | List cards (supports pagination). | – | `200` – `{ cards: Card[], pagination: Pagination }` | `401`, `404`, `500` |
| `POST` | `/api/v1/decks/{deckId}/cards` | Add a new card to a deck. | `CreateCardRequest` | `201` – `{ card: Card }` | `400`, `401`, `404`, `500` |
| `GET` | `/api/v1/cards/{cardId}` | Retrieve a single card. | – | `200` – `{ card: Card }` | `401`, `404`, `500` |
| `PUT` | `/api/v1/cards/{cardId}` | Update front/back content. | `UpdateCardRequest` | `200` – `{ card: Card }` | `400`, `401`, `404`, `500` |
| `DELETE` | `/api/v1/cards/{cardId}` | Delete a card. | – | `204 No Content` | `401`, `404`, `500` |
| `GET` | `/api/v1/decks/{deckId}/cards/random` | Return a random card (used by flip‑mode). | – | `200` – `{ card: Card }` | `401`, `404`, `500` |

#### Schemas  

```json
// Card
{
  "type": "object",
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "deckId": { "type": "string", "format": "uuid" },
    "front": { "type": "string", "minLength": 1, "maxLength": 2000 },
    "back": { "type": "string", "minLength": 1, "maxLength": 2000 },
    "imageUrl": { "type": "string", "format": "uri", "maxLength": 2083 },
    "createdAt": { "type": "string", "format": "date-time" },
    "updatedAt": { "type": "string", "format": "date-time" }
  },
  "required": ["id", "deckId", "front", "back", "createdAt", "updatedAt"]
}
```

```json
// CreateCardRequest
{
  "type": "object",
  "properties": {
    "front": { "type": "string", "minLength": 1, "maxLength": 2000 },
    "back": { "type": "string", "minLength": 1, "maxLength": 2000 },
    "imageUrl": { "type": "string", "format": "uri", "maxLength": 2083 }
  },
  "required": ["front", "back"]
}
```

```json
// UpdateCardRequest – all fields optional
{
  "type": "object",
  "properties": {
    "front": { "type": "string", "minLength": 1, "maxLength": 2000 },
    "back": { "type": "string", "minLength": 1, "maxLength": 2000 },
    "imageUrl": { "type": "string", "format": "uri", "maxLength": 2083 }
  },
  "additionalProperties": false
}
```

```json
// Pagination
{
  "type": "object",
  "properties": {
    "page": { "type": "integer", "minimum": 1 },
    "pageSize": { "type": "integer", "minimum": 1, "maximum": 100 },
    "totalItems": { "type": "integer", "minimum": 0 },
    "totalPages": { "type": "integer", "minimum": 1 }
  },
  "required": ["page", "pageSize", "totalItems", "totalPages"]
}
```

---

### 3.3 Quiz Endpoints  

| Method | Path | Description | Request Body | Success Response | Errors |
|--------|------|-------------|--------------|------------------|--------|
| `POST` | `/api/v1/decks/{deckId}/quiz` | Generate a quiz (N random cards). | `CreateQuizRequest` | `200` – `{ quizId, questions: QuizQuestion[] }` | `401`, `404`, `400`, `500` |
| `POST` | `/api/v1/quizzes/{quizId}/submit` | Submit answers → get score & feedback. | `SubmitQuizRequest` | `200` – `{ score, total, detailed: QuizResult[] }` | `401`, `404`, `400`, `500` |
| `GET` | `/api/v1/quizzes/{quizId}` | Retrieve a saved quiz (read‑only). | – | `200` – `{ quizId, deckId, questions, createdAt }` | `401`, `404`, `500` |

#### Schemas  

```json
// CreateQuizRequest
{
  "type": "object",
  "properties": {
    "questionCount": { "type": "integer", "minimum": 1, "maximum": 50 },
    "shuffle": { "type": "boolean", "default": true }
  },
  "required": ["questionCount"]
}
```

```json
// QuizQuestion (sent to client)
{
  "type": "object",
  "properties": {
    "questionId": { "type": "string", "format": "uuid" },
    "front": { "type": "string" },
    "options": {
      "type": "array",
      "items": { "type": "string" },
      "minItems": 2,
      "maxItems": 6
    } // optional multiple‑choice; if omitted client shows free‑text field
  },
  "required": ["questionId", "front"]
}
```

```json
// SubmitQuizRequest
{
  "type": "object",
  "properties": {
    "answers": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "questionId": { "type": "string", "format": "uuid" },
          "answer": { "type": "string" }
        },
        "required": ["questionId", "answer"]
      },
      "minItems": 1
    }
  },
  "required": ["answers"]
}
```

```json
// QuizResult (per question)
{
  "type": "object",
  "properties": {
    "questionId": { "type": "string", "format": "uuid" },
    "correct": { "type": "boolean" },
    "expected": { "type": "string" },
    "provided": { "type": "string" }
  },
  "required": ["questionId", "correct", "expected", "provided"]
}
```

---

### 3.4 Health & Meta  

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/health` | Returns `{ status: "ok", timestamp: "<ISO>" }`. |
| `GET` | `/api/v1/version` | Returns `{ version: "1.0.0", commit: "<sha>" }`. |

---

## 4️⃣  Realistic Mock Fallbacks & Offline Resilience  

| Endpoint | Mock Payload (example) | Simulated Latency |
|----------|------------------------|-------------------|
| `GET /decks` | ```json { "decks": [ <seedDeck1>, <seedDeck2> ] } ``` | 250 ms |
| `GET /decks/{deckId}` | Returns the matching seed deck or `404`. | 200 ms |
| `GET /decks/{deckId}/cards` | Paginated slice of **seedCards** (max 20 per page). | 300 ms |
| `GET /decks/{deckId}/cards/random` | Random card from that deck’s seed list. | 150 ms |
| `POST /decks/{deckId}/quiz` | Generates **questionCount** random cards, builds 4‑option multiple‑choice (correct + 3 distractors). | 350 ms |
| `POST /quizzes/{quizId}/submit` | Calculates score locally, returns `score`, `total`, and per‑question `correct` flag. | 200 ms |

**Timeout strategy (client side)**  

* Abort any request after **5 s**.  
* If a timeout occurs, automatically switch to the mock implementation and surface a non‑intrusive toast: “Working offline – using cached data”.  

**Cache‑first flow**  

1. Attempt live fetch.  
2. On network error / 5xx / timeout → read from **LocalStorage** (see § 6).  
3. If LocalStorage also empty → use the **static mock** defined above.

---

## 5️⃣  Data Sanitization & Payload Typing  

| Field | Constraint | Reason |
|-------|------------|--------|
| `id`, `ownerId`, `deckId`, `cardId`, `quizId`, `questionId` | UUID‑v4 format (`/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i`) | Global uniqueness, safe for DB keys. |
| `title` | 1‑120 chars, no leading/trailing whitespace. | UI‑friendly, prevents empty titles. |
| `description` | ≤ 500 chars, optional. | Keeps DB rows small. |
| `tags` | Alphanumeric + hyphen/underscore, 1‑30 chars each, max 10 tags. | Easy filter UI. |
| `front` / `back` | 1‑2000 chars, HTML‑escaped on server. | Prevent XSS, still allow rich text via markdown. |
| `imageUrl` | Valid `http(s)://` URI, max 2083 chars. | Browser limit, CDN friendly. |
| `questionCount` | 1‑50, integer. | Limits quiz payload size. |
| `answers[].answer` | Trimmed string, max 2000 chars. | Normalised for comparison. |
| `createdAt` / `updatedAt` | ISO‑8601 UTC (`YYYY‑MM‑DDTHH:mm:ss.sssZ`). | Consistent across services. |

All incoming JSON is validated **before** any DB write. Errors return **400 Bad Request** with a detailed `error` object:

```json
{
  "error": "VALIDATION_ERROR",
  "message": "front must be at least 1 character"
}
```

---

## 6️⃣  Database Schema & Realistic Seed Data  

### 6.1 Entity‑Relationship Overview  

```
User (1) ──< owns >── Deck (N) ──< contains >── Card (N)
Deck (1) ──< generates >── Quiz (N) ──< has >── QuizQuestion (N) ──< answered >── QuizAnswer (N)
```

*Cascade delete:* Deleting a **Deck** removes its **Cards** and any **Quizzes** that reference it.

### 6.2 Table Definitions (PostgreSQL‑style)

```sql
CREATE TABLE users (
    id          UUID PRIMARY KEY,
    email       TEXT NOT NULL UNIQUE CHECK (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
    name        TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at