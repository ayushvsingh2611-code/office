# Task‑Manager Web Application – Integration Specification  
**Prepared by:** Brook – Integrations & Content Specialist  

---

## 1. Overview  

| Feature | Description |
|---------|-------------|
| **User Dashboard** | Personalized view showing task list, statistics, and quick actions. |
| **CRUD Tasks** | Create, read, update and delete tasks. |
| **Task Status** | `pending`, `in‑progress`, `completed`. |
| **Priority Management** | `low`, `medium`, `high`, `critical`. |
| **Search & Filtering** | Full‑text search on title/description, filter by status, priority, due‑date range. |
| **Task Statistics** | Counts per status, average completion time, overdue tasks, etc. |
| **Responsive Sidebar Navigation** | Collapsible navigation that works on desktop & mobile. |
| **Modal Task Creation** | UI‑modal for adding/editing a task. |
| **Persistence** | Primary storage in **LocalStorage** with optional sync to a back‑end service. |

> **Goal:** Define the **external service** (REST API) that can be used for data sync, multi‑device access, and analytics while keeping the app fully functional offline via LocalStorage.

---

## 2. External Service Integration Requirements  

| Requirement | Detail |
|-------------|--------|
| **Base URL** | `https://api.taskmanager.example.com/v1` |
| **Authentication** | Bearer‑Token (JWT) in `Authorization` header. Token is obtained via `/auth/login`. |
| **Content Type** | `application/json` for both request & response bodies. |
| **CORS** | `Access‑Control‑Allow‑Origin: *` (or restricted to the app’s domain). |
| **Rate Limiting** | 120 requests/min per user. Return `429 Too Many Requests` when exceeded. |
| **Versioning** | URL version (`v1`) – future‑proof for breaking changes. |
| **Error Format** | Consistent JSON envelope: `{ "error": { "code": "ERR_CODE", "message": "Human readable", "details": {...} } }` |
| **Pagination** | `limit` (max 100) and `offset` query parameters. Include `X-Total-Count` header. |
| **Webhooks (optional)** | `POST /webhooks/tasks` – notify external systems of task changes. |
| **Analytics Endpoint** | `POST /analytics/events` – fire‑and‑forget event logging (e.g., `task_created`). |
| **Offline‑First Strategy** | Front‑end writes to LocalStorage first, then **queues** API calls. Queue is flushed when `navigator.onLine` becomes `true`. |
| **Data Validation** | Server validates all fields; returns `422 Unprocessable Entity` with field‑level errors. |

---

## 3. API Contracts  

### 3.1 Authentication  

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| **POST** | `/auth/login` | `{ "email": "user@example.com", "password": "••••••" }` | `200 OK` `{ "accessToken": "<jwt>", "expiresIn": 3600, "user": { "id": "u_123", "name": "John Doe", "email": "user@example.com" } }` |
| **POST** | `/auth/logout` | – (no body) – | `204 No Content` |

### 3.2 Users  

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| **GET** | `/users/me` | – | `200 OK` `{ "id": "u_123", "name": "John Doe", "email": "user@example.com", "createdAt": "2024-01-15T08:30:00Z" }` |

### 3.3 Tasks  

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/tasks` | List tasks (supports pagination, search, filters). |
| **POST** | `/tasks` | Create a new task. |
| **GET** | `/tasks/{taskId}` | Retrieve a single task. |
| **PATCH** | `/tasks/{taskId}` | Partial update (status, priority, etc.). |
| **PUT** | `/tasks/{taskId}` | Full replace (rarely used). |
| **DELETE** | `/tasks/{taskId}` | Delete a task. |

#### 3.3.1 Query Parameters for `GET /tasks`

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Full‑text search on `title` & `description`. |
| `status` | enum | Filter by `pending`, `in-progress`, `completed`. |
| `priority` | enum | Filter by `low`, `medium`, `high`, `critical`. |
| `dueFrom` | ISO‑8601 date | Due date ≥ value. |
| `dueTo` | ISO‑8601 date | Due date ≤ value. |
| `limit` | integer (default 20) | Page size. |
| `offset` | integer (default 0) | Pagination offset. |
| `sortBy` | enum (`createdAt`, `dueDate`, `priority`) | Field to sort. |
| `sortOrder` | enum (`asc`, `desc`) | Sort direction. |

#### 3.3.2 Task Resource Schema  

```json
{
  "id": "t_9f8c2b1e",
  "title": "Prepare quarterly report",
  "description": "Collect data from finance, marketing and sales.",
  "status": "pending",                 // enum: pending | in-progress | completed
  "priority": "high",                  // enum: low | medium | high | critical
  "dueDate": "2024-12-01T17:00:00Z",   // optional ISO‑8601
  "createdAt": "2024-10-05T09:12:45Z",
  "updatedAt": "2024-10-07T14:03:12Z",
  "ownerId": "u_123",                  // user that owns the task
  "tags": ["finance", "Q4"]            // optional array of strings
}
```

#### 3.3.3 Request / Response Examples  

**Create Task – `POST /tasks`**

_Request_

```json
{
  "title": "Design new logo",
  "description": "Iterate on concepts and deliver final SVG.",
  "status": "pending",
  "priority": "medium",
  "dueDate": "2024-11-15T12:00:00Z",
  "tags": ["design", "branding"]
}
```

_Response – `201 Created`_

```json
{
  "id": "t_a7b3c9d4",
  "title": "Design new logo",
  "description": "Iterate on concepts and deliver final SVG.",
  "status": "pending",
  "priority": "medium",
  "dueDate": "2024-11-15T12:00:00Z",
  "createdAt": "2024-10-08T10:22:31Z",
  "updatedAt": "2024-10-08T10:22:31Z",
  "ownerId": "u_123",
  "tags": ["design", "branding"]
}
```

**Update Task Status – `PATCH /tasks/t_a7b3c9d4`**

_Request_

```json
{
  "status": "in-progress"
}
```

_Response – `200 OK`_

```json
{
  "id": "t_a7b3c9d4",
  "title": "Design new logo",
  "description": "Iterate on concepts and deliver final SVG.",
  "status": "in-progress",
  "priority": "medium",
  "dueDate": "2024-11-15T12:00:00Z",
  "createdAt": "2024-10-08T10:22:31Z",
  "updatedAt": "2024-10-09T08:14:05Z",
  "ownerId": "u_123",
  "tags": ["design", "branding"]
}
```

**Delete Task – `DELETE /tasks/t_a7b3c9d4`**

_Response – `204 No Content` (empty body)

### 3.4 Statistics  

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/tasks/stats` | Returns aggregated data for the logged‑in user. |

**Response Example – `200 OK`**

```json
{
  "total": 124,
  "byStatus": {
    "pending": 45,
    "in-progress": 30,
    "completed": 49
  },
  "byPriority": {
    "low": 20,
    "medium": 55,
    "high": 40,
    "critical": 9
  },
  "overdue": 12,
  "averageCompletionTimeHours": 18.4
}
```

---

## 4. Realistic Sample Data  

### 4.1 Users  

```json
[
  {
    "id": "u_001",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "createdAt": "2023-05-12T13:45:00Z"
  },
  {
    "id": "u_002",
    "name": "Bob Martinez",
    "email": "bob@example.com",
    "createdAt": "2023-06-01T09:20:15Z"
  }
]
```

### 4.2 Tasks (sample list – 10 items)

```json
[
  {
    "id": "t_01",
    "title": "Write blog post about API design",
    "description": "Include examples for pagination and error handling.",
    "status": "in-progress",
    "priority": "high",
    "dueDate": "2024-10-20T23:59:59Z",
    "createdAt": "2024-10-01T08:15:00Z",
    "updatedAt": "2024-10-04T12:30:22Z",
    "ownerId": "u_001",
    "tags": ["content", "writing"]
  },
  {
    "id": "t_02",
    "title": "Quarterly financial review",
    "description": "",
    "status": "pending",
    "priority": "critical",
    "dueDate": "2024-11-05T09:00:00Z",
    "createdAt": "2024-09-28T14:02:10Z",
    "updatedAt": "2024-09-28T14:02:10Z",
    "ownerId": "u_001",
    "tags": ["finance", "Q4"]
  },
  {
    "id": "t_03",
    "title": "Refactor authentication module",
    "description": "Move to OAuth2 and add refresh token flow.",
    "status": "pending",
    "priority": "medium",
    "dueDate": "2024-12-01T00:00:00Z",
    "createdAt": "2024-09-30T11:45:33Z",
    "updatedAt": "2024-09-30T11:45:33Z",
    "ownerId": "u_001",
    "tags": ["backend", "security"]
  },
  {
    "id": "t_04",
    "title": "Design new landing page",
    "description": "Create responsive mockups in Figma.",
    "status": "completed",
    "priority": "high",
    "dueDate": "2024-09-15T17:00:00Z",
    "createdAt": "2024-08-20T09:10:00Z",
    "updatedAt": "2024-09-14T16:45:12Z",
    "ownerId": "u_001",
    "tags": ["design", "UI"]
  },
  {
    "id": "t_05",
    "title": "Team sprint retro",
    "description": "Gather feedback from the last sprint.",
    "status": "completed",
    "priority": "low",
    "dueDate": "2024-10-03T15:00:00Z",
    "createdAt": "2024-09-30T07:30:00Z",
    "updatedAt": "2024-10-03T15:05:00Z",
    "ownerId": "u_001",
    "tags": ["meeting"]
  },
  {
    "id": "t_06",
    "title": "Update dependencies",
    "description": "Run `npm audit` and upgrade vulnerable packages.",
    "status": "pending",
    "priority": "medium",
    "dueDate": null,
    "createdAt": "2024-10-06T12:00:00Z",
    "updatedAt": "2024-10-06T12:00:00Z",
    "ownerId": "u_001",
    "tags": ["maintenance"]
  },
  {
    "id": "t_07",
    "title": "Customer onboarding flow",
    "description": "Map out steps and create UI wireframes.",
    "status": "in-progress",
    "priority": "high",
    "dueDate": "2024-11-10T10:00:00Z",
    "createdAt": "2024-09-25T09:20:45Z",
    "updatedAt": "2024-10-05T13:11:22Z",
    "ownerId": "u_001",
    "tags": ["product", "UX"]
  },
  {
    "id": "t_08",
    "title": "Backup database",
    "description": "Schedule nightly backup and test restore.",
    "status": "pending",
    "priority": "critical",
    "dueDate": "2024-10-12T02:00:00Z",
    "createdAt": "2024-09-27T18:45:00Z",
    "updatedAt": "2024-09-27T18:45:00Z",
    "ownerId": "u_001",
    "tags": ["ops"]
  },
  {
    "id": "t_09",
    "title": "Research GraphQL vs REST",
    "description": "Prepare a short presentation for the architecture meeting.",
    "status": "pending",
    "priority": "low",
    "dueDate": "2024-11-20T09:30:00Z",
    "createdAt": "2024-10-02T10:00:00Z",
    "updatedAt": "2024-10-02T10:00:00Z",
    "ownerId": "u_001",
    "tags": ["research"]
  },
  {
    "id": "t_10",
    "title": "Implement dark mode",
    "description": "Add theme toggle, persist preference in LocalStorage.",
    "status": "in-progress",
    "priority": "medium",
    "dueDate": "2024-12-31T23:59:59Z",
    "createdAt": "2024-09-15T08:00:00Z",
    "updatedAt": "2024-10-07T11:45:00Z",
    "ownerId": "u_001",
    "tags": ["frontend", "UI"]
  }
]
```

### 4.3 Statistics (derived from the above list)

```json
{
  "total": 10,
  "byStatus": {
    "pending": 4,
    "in-progress": 3,
    "completed": 3
  },
  "byPriority": {
    "low": 2,
    "medium": 3,
    "high": 3,
    "critical": 2
  },
  "overdue": 0,
  "averageCompletionTimeHours": 22.6
}
```

---

## 5. Mock Payloads for Front‑End Development  

| Scenario | HTTP Method | URL | Request Body | Expected Response |
|----------|-------------|-----|--------------|-------------------|
| **Load Dashboard** | `GET` | `/tasks?limit=20&offset=0&sortBy=createdAt&sortOrder=desc` | – | `200` – array of tasks + `X-Total-Count` header |
| **Search “design”** | `GET` | `/tasks?search=design&status=pending` | – | `200` – filtered tasks |
| **Create via Modal** | `POST` | `/tasks` | See **Create Task** example above | `201` – newly created task |
| **Edit Title** | `PATCH` | `/tasks/t_03` | `{ "title": "Refactor auth module" }` | `200` – updated task |
| **Mark Completed** | `PATCH` | `/tasks/t_07` | `{ "status": "completed", "completedAt": "2024-10-08T14:00:00Z" }` | `200` – updated task |
| **Delete** | `DELETE` | `/tasks/t_06` | – | `204` – empty |
| **Fetch Stats** | `GET` | `/tasks/stats` | – | `200` – statistics JSON |
| **Analytics Event** | `POST` | `/analytics/events` | `{ "event": "task_created", "payload": { "taskId": "t_11", "priority": "high" } }` | `202 Accepted` – no body |

> **Tip for developers:** Use the above payloads with tools like **MSW (Mock Service Worker)** or **json-server** to simulate the API locally while building the UI.

---

## 6. Error Handling & Edge Cases  

| HTTP Code | Situation | Example Response |
|-----------|-----------|------------------|
| `400 Bad Request` | Malformed JSON or missing required query param. | `{ "error": { "code": "ERR_BAD_REQUEST", "message": "Missing required field: title" } }` |
| `