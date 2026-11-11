## Online Learning Platform – Integration & Content Blueprint  

**Prepared by:** Brook – Integrations & Content Specialist  

---

### 1. High‑Level Overview  

| Feature | Core Backend Services | Front‑End Responsibility |
|---------|----------------------|--------------------------|
| **Student Dashboard** | User Service, Enrollment Service, Progress Service | UI layout, LocalStorage cache of UI state |
| **Course Catalog** | Course Service, Search Service | Responsive grid, filter UI |
| **Course Details Modal** | Course Service, Instructor Service, Review Service | Modal rendering, lazy‑load assets |
| **Lesson Navigation** | Lesson Service, Content Delivery (CDN) | Navigation controls, pre‑fetch next lesson |
| **Learning Progress Tracking** | Progress Service, Analytics Service | UI progress bars, LocalStorage fallback |
| **Search & Filtering** | Search Service (full‑text + faceted) | Instant‑search UI, debounced calls |
| **Responsive UI** | – | CSS Grid/Flex, break‑point design system |
| **LocalStorage Persistence** | – | Store UI preferences, last‑viewed lesson, offline cache of static catalog data |

---

## 2. External Service Integration Requirements  

| Requirement | Description | Why It Matters |
|-------------|-------------|----------------|
| **OAuth 2.0 / OpenID Connect** | Central Auth Service (`/auth`) – Authorization Code flow with PKCE for SPA. Tokens stored in HttpOnly cookies; refresh tokens rotated. | Secure user identity, SSO across micro‑services. |
| **User Service** | CRUD for student profiles, role‑based access (student, instructor, admin). | Drives dashboard personalization and permission checks. |
| **Course Service** | Master data for courses, categories, tags, pricing, publishing status. | Powers catalog, details modal, and enrollment logic. |
| **Lesson Service** | Hierarchical lesson data (sections → lessons), media URLs, duration, order. | Enables navigation & progress tracking. |
| **Enrollment Service** | Records which user is enrolled in which course, start/end dates, access rights. | Determines what a student can view. |
| **Progress Service** | Store per‑lesson completion, timestamps, overall % per course. | Drives progress bars, resume‑lesson feature. |
| **Search Service** | ElasticSearch‑based endpoint for full‑text search + faceted filters (category, level, rating). | Real‑time search & filter UI. |
| **Analytics Service** (optional) | Event ingestion (`/track`) for page views, lesson starts, completions. | Product insights & learning outcomes. |
| **CDN / Media Service** | Secure signed URLs for video/audio assets, thumbnails. | Fast, protected streaming of lesson content. |
| **Feature‑Flag Service** (optional) | `/flags` to toggle beta features per user segment. | Controlled rollout of UI changes. |

All services expose **RESTful JSON** APIs versioned under `/api/v1/`.  

> **Note:** For rapid prototyping you can replace each micro‑service with a **Mock Server** (e.g., `json-server`, `MSW`) that respects the contracts below.

---

## 3. API Contracts  

### 3.1 Authentication  

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| `POST` | `/api/v1/auth/login` | `{ "email": "string", "password": "string" }` | `200 OK` <br>`{ "accessToken": "jwt", "refreshToken": "jwt", "expiresIn": 3600 }` |
| `POST` | `/api/v1/auth/refresh` | `{ "refreshToken": "jwt" }` | `200 OK` <br>`{ "accessToken": "...", "expiresIn": 3600 }` |
| `POST` | `/api/v1/auth/logout` | – | `204 No Content` |

*All protected endpoints require `Authorization: Bearer <accessToken>`.*

---

### 3.2 User Service  

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| `GET` | `/api/v1/users/me` | – | `200 OK` <br>`User` |
| `PATCH` | `/api/v1/users/me` | `Partial<User>` | `200 OK` <br>`User` |

```json
// User
{
  "id": "u_12345",
  "firstName": "Aisha",
  "lastName": "Khan",
  "email": "aisha.khan@example.com",
  "avatarUrl": "https://cdn.example.com/avatars/u_12345.png",
  "role": "student",
  "preferences": {
    "theme": "dark",
    "language": "en"
  }
}
```

---

### 3.3 Course Service  

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| `GET` | `/api/v1/courses` | Query: `page`, `limit`, `search`, `category`, `level`, `sort` | `200 OK` <br>`Paginated<Course>` |
| `GET` | `/api/v1/courses/:courseId` | – | `200 OK` <br>`CourseDetail` |
| `GET` | `/api/v1/categories` | – | `200 OK` <br>`Category[]` |

```json
// Paginated wrapper
{
  "items": [ /* Course[] */ ],
  "page": 1,
  "limit": 20,
  "totalItems": 342,
  "totalPages": 18
}

// Course (catalog view)
{
  "id": "c_9876",
  "title": "Full‑Stack Web Development",
  "subtitle": "From zero to hero",
  "thumbnailUrl": "https://cdn.example.com/courses/c_9876/thumb.jpg",
  "category": "Programming",
  "tags": ["JavaScript", "Node.js", "React"],
  "instructor": {
    "id": "i_1122",
    "name": "Maya Patel",
    "avatarUrl": "https://cdn.example.com/instructors/i_1122.png"
  },
  "rating": 4.7,
  "ratingCount": 1245,
  "price": 149.99,
  "isPublished": true,
  "level": "Intermediate"
}

// CourseDetail (modal payload)
{
  "id": "c_9876",
  "title": "Full‑Stack Web Development",
  "description": "A 12‑week intensive program covering front‑end and back‑end technologies...",
  "learningObjectives": [
    "Build a REST API with Node.js & Express",
    "Create a responsive SPA using React",
    "Deploy a full‑stack app on AWS"
  ],
  "curriculum": [
    {
      "sectionId": "s1",
      "title": "Getting Started",
      "lessons": [
        { "lessonId": "l101", "title": "Course Overview", "duration": 300 },
        { "lessonId": "l102", "title": "Setup Development Environment", "duration": 900 }
      ]
    },
    { /* … more sections … */ }
  ],
  "instructorBio": "Maya has 10+ years building scalable web apps...",
  "reviews": [
    {
      "userId": "u_54321",
      "rating": 5,
      "comment": "Excellent content!",
      "createdAt": "2024-09-12T08:15:30Z"
    }
  ],
  "price": 149.99,
  "discount": { "percentage": 20, "validUntil": "2024-12-31T23:59:59Z" }
}
```

---

### 3.4 Lesson Service  

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| `GET` | `/api/v1/courses/:courseId/lessons` | Query: `page`, `limit` | `200 OK` <br>`Paginated<Lesson>` |
| `GET` | `/api/v1/lessons/:lessonId` | – | `200 OK` <br>`LessonDetail` |

```json
// Lesson (list item)
{
  "id": "l101",
  "title": "Course Overview",
  "duration": 300,          // seconds
  "order": 1,
  "previewUrl": "https://cdn.example.com/lessons/l101/preview.mp4"
}

// LessonDetail
{
  "id": "l101",
  "title": "Course Overview",
  "contentHtml": "<p>Welcome to the course...</p>",
  "videoUrl": "https://cdn.example.com/lessons/l101/video.mp4?sig=...",
  "duration": 300,
  "order": 1,
  "resources": [
    {
      "type": "pdf",
      "title": "Syllabus",
      "url": "https://cdn.example.com/lessons/l101/syllabus.pdf"
    }
  ]
}
```

---

### 3.5 Enrollment Service  

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| `GET` | `/api/v1/users/me/enrollments` | – | `200 OK` <br>`Enrollment[]` |
| `POST` | `/api/v1/courses/:courseId/enroll` | – | `201 Created` <br>`Enrollment` |
| `DELETE` | `/api/v1/enrollments/:enrollmentId` | – | `204 No Content` |

```json
// Enrollment
{
  "id": "e_7788",
  "userId": "u_12345",
  "courseId": "c_9876",
  "enrolledAt": "2024-09-01T12:00:00Z",
  "expiresAt": null,
  "status": "active"
}
```

---

### 3.6 Progress Service  

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| `GET` | `/api/v1/users/me/progress?courseId={id}` | – | `200 OK` <br>`ProgressDetail` |
| `POST` | `/api/v1/progress` | `ProgressUpdate` | `200 OK` <br>`ProgressDetail` |

```json
// ProgressUpdate (client sends after lesson complete)
{
  "courseId": "c_9876",
  "lessonId": "l101",
  "completedAt": "2024-09-04T14:22:10Z",
  "percentage": 100
}

// ProgressDetail (aggregated)
{
  "courseId": "c_9876",
  "completedLessons": 4,
  "totalLessons": 24,
  "percentage": 16.7,
  "lastLessonId": "l104",
  "lastAccessedAt": "2024-09-04T14:22:10Z"
}
```

---

### 3.7 Search & Filtering Service  

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| `GET` | `/api/v1/search` | Query: `q`, `category`, `level`, `ratingMin`, `priceMax`, `page`, `limit` | `200 OK` <br>`Paginated<SearchResult>` |

```json
// SearchResult (union of courses & lessons)
{
  "type": "course",   // or "lesson"
  "id": "c_9876",
  "title": "Full‑Stack Web Development",
  "snippet": "A 12‑week intensive program ...",
  "thumbnailUrl": "...",
  "rating": 4.7,
  "price": 149.99
}
```

---

### 3.8 Analytics (Event Tracking)  

| Method | Endpoint | Request |
|--------|----------|---------|
| `POST` | `/api/v1/track` | `{ "event": "lesson_started", "userId": "...", "courseId": "...", "lessonId": "...", "timestamp": "...", "metadata": { ... } }` |

*All analytics payloads are fire‑and‑forget; response `202 Accepted`.*

---

## 4. Data Formats & Validation  

| Entity | MIME Type | Schema Language | Primary Validation |
|--------|-----------|-----------------|--------------------|
| API payloads | `application/json` | JSON Schema (draft‑07) | Server‑side schema validation + OpenAPI 3.0 spec |
| Media URLs | `string` (URL) | – | Signed URL verification (expiry ≤ 15 min) |
| Dates / Times | ISO‑8601 UTC (`YYYY‑MM‑DDTHH:mm:ssZ`) | – | `Date.parse` safe handling on client |
| Prices | `number` (two decimal places) | – | `>= 0` |
| Ratings | `number` (0‑5, step 0.1) | – | `>=0 && <=5` |

**OpenAPI Spec** – Exported as `online‑learning‑api.yaml` (not shown here) for contract‑first development.

---

## 5. Realistic Sample Data (Mock Payloads)  

Below are **ready‑to‑paste JSON files** you can serve via a mock server.

### 5.1 `users.json`

```json
[
  {
    "id": "u_12345",
    "firstName": "Aisha",
    "lastName": "Khan",
    "email": "aisha.khan@example.com",
    "avatarUrl": "https://cdn.example.com/avatars/u_12345.png",
    "role": "student",
    "preferences": { "theme": "dark", "language": "en" }
  },
  {
    "id": "i_1122",
    "firstName": "Maya",
    "lastName": "Patel",
    "email": "maya.patel@example.com",
    "avatarUrl": "https://cdn.example.com/avatars/i_1122.png",
    "role": "instructor",
    "bio": "Full‑stack engineer & mentor."
  }
]
```

### 5.2 `courses.json` (first page, 5 items)

```json
{
  "items": [
    {
      "id": "c_9876",
      "title": "Full‑Stack Web Development",
      "subtitle": "From zero to hero",
      "thumbnailUrl": "https://cdn.example.com/courses/c_9876/thumb.jpg",
      "category": "Programming",
      "tags": ["JavaScript", "Node.js", "React"],
      "instructor": { "id": "i_1122", "name": "Maya Patel", "avatarUrl": "https://cdn.example.com/instructors/i_1122.png" },
      "rating": 4.7,
      "ratingCount": 1245,
      "price": 149.99,
      "isPublished": true,
      "level": "Intermediate"
    },
    {
      "id": "c_5432",
      "title": "Data Science with Python",
      "subtitle": "Statistics, ML & AI",
      "thumbnailUrl": "https://cdn.example.com/courses/c_5432/thumb.jpg",
      "category": "Data Science",
      "tags": ["Python", "Pandas", "Scikit‑Learn"],
      "instructor": { "id": "i_3344", "name": "Liam O'Connor", "avatarUrl": "https://cdn.example.com/instructors/i_3344.png" },
      "rating": 4.5,
      "ratingCount": 987,
      "price": 129.00,
      "isPublished": true,
      "level": "Beginner"
    }
    // … 3 more courses …
  ],
  "page": 1,
  "limit": 5,
  "totalItems": 342,
  "totalPages": 69
}
```

### 5.3 `lessons_c_9876.json`

```json
{
  "items": [
    {
      "id": "l101",
      "title": "Course Overview",
      "duration": 300,
      "order": 1,
      "previewUrl": "https://cdn.example.com/lessons/l101/preview.mp4"
    },
    {
      "id": "l102",
      "title": "Setup Development Environment",
      "duration": 900,
      "order": 2,
      "previewUrl": "https://cdn.example.com/lessons/l102/preview.mp4"
    },
    {
      "id": "l103",
      "title": "HTML & CSS Refresher",
      "duration": 1200,
      "order": 3,
      "previewUrl": "https://cdn.example.com/lessons/l103/preview.mp4"
    }
    // … more lessons …
  ],
  "page": 1,
  "limit": 20,
  "totalItems": 24,
  "totalPages": 2
}
```

### 5.4 `progress_u_12345_c_9876.json`

```json
{
  "courseId": "c_9876",
  "completedLessons": 4,
  "totalLessons": 24,
  "percentage": 16.7,
  "lastLessonId": "l104",
  "lastAccessedAt": "2024-09-04T14:22:10Z"
}
```

### 5.5 `search_results_q_fullstack_page1.json`

```json
{
  "items": [
    {
      "type": "course