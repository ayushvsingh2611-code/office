# Healthcare Management System – Integration & Content Specification  
*Prepared by: **Brook – Integrations & Content Specialist***  

---

## 1️⃣ Overview  

The system is a **single‑page web application (SPA)** that provides:

| Feature | Description |
|---------|-------------|
| **Patient Dashboard** | Overview of upcoming appointments, recent medical records, and quick actions. |
| **Doctor Directory** | searchable / filterable list of doctors with profiles. |
| **Appointment Booking Simulation** | Create, update, cancel appointments (no real‑time calendar integration). |
| **Patient Records (Demo)** | Read‑only access to synthetic health records (lab results, diagnoses, prescriptions). |
| **Search & Filtering** | Full‑text search on doctors, patients, and records. |
| **Responsive UI** | Mobile‑first layout using CSS Grid / Flexbox. |
| **Interactive Modals** | CRUD forms, detail view, confirmation dialogs. |
| **LocalStorage Persistence** | Cache of user preferences, last‑viewed patient, and unsynced draft appointments. |

All data is **mocked** for demo / training purposes but follows realistic schemas so the front‑end can be swapped to a real back‑end with minimal changes.

---  

## 2️⃣ External Service Integration Requirements  

| Service | Purpose | Required Capabilities | Authentication | Rate Limits | SLA (demo) |
|--------|---------|-----------------------|----------------|------------|------------|
| **Auth Service** | Issue JWTs for UI login & protect APIs. | `POST /auth/login`, `POST /auth/refresh`, `GET /auth/me` | **Bearer JWT** (HS256) – 15‑min expiry, 7‑day refresh token. | 100 req/s per IP | 99.9 % |
| **Patient Service** | CRUD for patient profiles & dashboard data. | `GET /patients/:id`, `GET /patients`, `PATCH /patients/:id` | JWT (role: `patient`/`admin`) | 200 req/s | 99.9 % |
| **Doctor Service** | Directory & profile data. | `GET /doctors`, `GET /doctors/:id`, `GET /doctors/search` | JWT (role: `public` or `admin`) | 200 req/s | 99.9 % |
| **Appointment Service** | Booking simulation, status updates. | `GET /appointments`, `POST /appointments`, `PATCH /appointments/:id`, `DELETE /appointments/:id` | JWT (role: `patient`/`admin`) | 150 req/s | 99.9 % |
| **Medical‑Record Service** | Read‑only demo health records. | `GET /records/:patientId`, `GET /records/search` | JWT (role: `patient`/`admin`) | 150 req/s | 99.9 % |
| **Search Service** *(optional)* | Full‑text search across doctors, patients, records. | `GET /search?q=...&type=doctor|patient|record` | JWT (any role) | 300 req/s | 99.9 % |

> **Note:** All services are versioned (`/v1/…`) and return **JSON**. The SPA can be configured to point at a **mock server** (e.g., `json-server`, `msw`, or `miragejs`) for local development.

---  

## 3️⃣ API Contracts  

### 3.1 Common Conventions  

| Item | Convention |
|------|------------|
| **Base URL** | `https://api.demo-healthcare.com/v1` (configurable via env var `REACT_APP_API_URL`). |
| **Headers** | `Content-Type: application/json` <br> `Authorization: Bearer <jwt>` |
| **Pagination** | `?page=1&limit=20` – response includes `meta: { total, page, limit }`. |
| **Error Format** | ```json { "error": { "code": "ERR_CODE", "message": "Human readable", "details": {...} } }``` |
| **Date/Time** | ISO‑8601 UTC (`2024-09-15T14:30:00Z`). |
| **IDs** | UUID v4 strings (`"c3f5e2a1-9b6d-4a5e-8c1f-2d9c5e1b7f9a"`). |

---

### 3.2 Auth Service  

| Method | Endpoint | Request | Success Response | Errors |
|--------|----------|---------|------------------|--------|
| **POST** | `/auth/login` | ```json { "email": "john.doe@example.com", "password": "P@ssw0rd!" }``` | ```json { "accessToken": "<jwt>", "refreshToken": "<jwt>", "expiresIn": 900, "user": { "id": "...", "role": "patient", "name": "John Doe" } }``` | `401` – Invalid credentials, `429` – Too many attempts |
| **POST** | `/auth/refresh` | ```json { "refreshToken": "<jwt>" }``` | Same payload as login (new `accessToken`). | `401` – Invalid/expired refresh token |
| **GET** | `/auth/me` | *no body* | ```json { "id": "...", "role": "...", "email": "...", "name": "..." }``` | `401` – Missing/invalid token |

---

### 3.3 Patient Service  

| Method | Endpoint | Request | Success Response | Errors |
|--------|----------|---------|------------------|--------|
| **GET** | `/patients/:id` | – | ```json { "id":"...", "name":"John Doe", "dob":"1985-04-12", "gender":"male", "email":"john.doe@example.com", "phone":"+1-555-0123", "address":{...}, "preferences":{ "theme":"dark", "language":"en" } }``` | `404` – Not found, `403` – Forbidden |
| **GET** | `/patients` | `?page=&limit=` | `{ "data": [...], "meta": {...} }` | `403` |
| **PATCH** | `/patients/:id` | ```json { "phone": "+1-555-9999", "preferences": { "theme": "light" } }``` | Updated patient object (same shape as GET). | `400` – Validation, `403` |

---

### 3.4 Doctor Service  

| Method | Endpoint | Request | Success Response | Errors |
|--------|----------|---------|------------------|--------|
| **GET** | `/doctors` | `?page=&limit=&specialty=&location=` | `{ "data": [ { doctorObj }, … ], "meta": {...} }` | `403` |
| **GET** | `/doctors/:id` | – | ```json { "id":"...", "name":"Dr. Alice Smith", "specialty":"Cardiology", "location":"New York, NY", "rating":4.7, "bio":"…", "availableSlots":[ "2024-10-01T09:00:00Z", … ] }``` | `404` |
| **GET** | `/doctors/search` | `?q=alice&specialty=cardio` | Same shape as `/doctors`. | `400` |

---

### 3.5 Appointment Service  

| Method | Endpoint | Request | Success Response | Errors |
|--------|----------|---------|------------------|--------|
| **GET** | `/appointments` | `?patientId=&doctorId=&status=&page=&limit=` | `{ "data": [ { appointmentObj }, … ], "meta": {...} }` | `403` |
| **POST** | `/appointments` | ```json { "patientId":"...", "doctorId":"...", "slot":"2024-10-15T14:00:00Z", "reason":"Routine check‑up" }``` | ```json { "id":"...", "status":"pending", "createdAt":"...", "updatedAt":"...", ... }``` | `400` – Validation, `409` – Slot already booked |
| **PATCH** | `/appointments/:id` | ```json { "status":"canceled", "cancellationReason":"Patient request" }``` | Updated appointment object. | `400`, `403`, `404` |
| **DELETE** | `/appointments/:id` | – | `204 No Content` | `403`, `404` |

---

### 3.6 Medical‑Record Service  

| Method | Endpoint | Request | Success Response | Errors |
|--------|----------|---------|------------------|--------|
| **GET** | `/records/:patientId` | – | `{ "patientId":"...", "records": [ { "type":"lab", "date":"2024-08-20", "details":{...} }, … ] }` | `403`, `404` |
| **GET** | `/records/search` | `?q=diabetes&patientId=` | Same shape as above (filtered). | `400` |

---

### 3.7 Search Service (Optional)  

| Method | Endpoint | Request | Success Response | Errors |
|--------|----------|---------|------------------|--------|
| **GET** | `/search` | `?q=cardio&type=doctor` | `{ "type":"doctor", "results": [ doctorObj, … ] }` | `400` |

---  

## 4️⃣ Data Formats & Schemas  

Below are **JSON Schema** snippets (simplified) that each service must obey. They can be used for validation in mock servers or real back‑ends.

### 4.1 Patient Schema  

```json
{
  "$id": "https://api.demo-healthcare.com/schemas/patient.json",
  "type": "object",
  "required": ["id", "name", "dob", "gender", "email"],
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "name": { "type": "string" },
    "dob": { "type": "string", "format": "date" },
    "gender": { "enum": ["male", "female", "other"] },
    "email": { "type": "string", "format": "email" },
    "phone": { "type": "string" },
    "address": {
      "type": "object",
      "properties": {
        "line1": { "type": "string" },
        "line2": { "type": "string" },
        "city": { "type": "string" },
        "state": { "type": "string" },
        "zip": { "type": "string" },
        "country": { "type": "string" }
      },
      "required": ["line1", "city", "state", "zip", "country"]
    },
    "preferences": {
      "type": "object",
      "properties": {
        "theme": { "enum": ["light", "dark"] },
        "language": { "type": "string", "default": "en" }
      }
    }
  }
}
```

### 4.2 Doctor Schema  

```json
{
  "$id": "https://api.demo-healthcare.com/schemas/doctor.json",
  "type": "object",
  "required": ["id", "name", "specialty", "location", "rating"],
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "name": { "type": "string" },
    "specialty": { "type": "string" },
    "location": { "type": "string" },
    "rating": { "type": "number", "minimum": 0, "maximum": 5 },
    "bio": { "type": "string" },
    "availableSlots": {
      "type": "array",
      "items": { "type": "string", "format": "date-time" }
    }
  }
}
```

### 4.3 Appointment Schema  

```json
{
  "$id": "https://api.demo-healthcare.com/schemas/appointment.json",
  "type": "object",
  "required": ["id", "patientId", "doctorId", "slot", "status"],
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "patientId": { "type": "string", "format": "uuid" },
    "doctorId": { "type": "string", "format": "uuid" },
    "slot": { "type": "string", "format": "date-time" },
    "reason": { "type": "string" },
    "status": { "enum": ["pending", "confirmed", "canceled", "completed"] },
    "cancellationReason": { "type": "string" },
    "createdAt": { "type": "string", "format": "date-time" },
    "updatedAt": { "type": "string", "format": "date-time" }
  }
}
```

### 4.4 Medical Record Schema  

```json
{
  "$id": "https://api.demo-healthcare.com/schemas/medical-record.json",
  "type": "object",
  "required": ["patientId", "records"],
  "properties": {
    "patientId": { "type": "string", "format": "uuid" },
    "records": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["type", "date", "details"],
        "properties": {
          "type": { "enum": ["lab", "diagnosis", "prescription", "imaging"] },
          "date": { "type": "string", "format": "date" },
          "details": { "type": "object" }
        }
      }
    }
  }
}
```

---  

## 5️⃣ Realistic Sample Data  

> **Tip:** Store these JSON files under `mock-data/` and serve them via `json-server` or `msw`.  

### 5.1 Patients (`patients.json`)

```json
[
  {
    "id": "a1b2c3d4-1111-2222-3333-444455556666",
    "name": "John Doe",
    "dob": "1985-04-12",
    "gender": "male",
    "email": "john.doe@example.com",
    "phone": "+1-555-0123",
    "address": {
      "line1": "123 Main St",
      "line2": "Apt 4B",
      "city": "Springfield",
      "state": "IL",
      "zip": "62704",
      "country": "USA"
    },
    "preferences": { "theme": "dark", "language": "en" }
  },
  {
    "id": "b2c3d4e5-7777-8888-9999-0000aaaa1111",
    "name": "Maria Garcia",
    "dob": "1990-09-23",
    "gender": "female",
    "email": "m.garcia@example.com",
    "phone": "+1-555-0456",
    "address": {
      "line1": "456 Oak Avenue",
      "line2": "",
      "city": "Austin",
      "state": "TX",
      "zip": "73301",
      "country": "USA"
    },
    "preferences": { "theme": "light", "language": "es" }
  }
]
```

### 5.2 Doctors (`doctors.json`)

```json
[
  {
    "id": "d1e2f3g4-1234-5678-90ab-cdef12345678",
    "name": "Dr. Alice Smith",
    "specialty": "Cardiology",
    "location": "New York, NY",
    "rating": 4.8,
    "bio": "Board‑certified cardiologist with 15 years of experience in interventional procedures.",
    "availableSlots": [
      "2024-10-15T09:00:00Z",
      "2024-10-15T10:30:00Z",
      "2024-10-16T14:00:00Z"
    ]
  },
  {
    "id": "h5i6j7k8-9abc-def0-1234-56789abcde01",
    "name": "Dr. Benjamin Lee",
    "specialty": "Dermatology",
    "location": "San Francisco, CA",
    "rating": 4.5,
    "bio": "Specialist in skin health, laser therapy and cosmetic dermatology.",
    "availableSlots": [
      "2024-10-18T08:30:00Z",
      "2024-10-18T11:00:00Z",
      "2024-10-19T13:30:00Z"
    ]
  }
]
```

### 5.3 Appointments (`appointments.json`)

```json
[
  {
    "id": "appt-001-aaaa-bbbb-cccc-dddd",
    "patientId": "a1b2c3d4-1111-2222-3333-444455556666",
    "doctorId": "d1e2f3g4-1234-5678-90ab-cdef12345678",
    "slot": "2024-10-15T09:00:00Z",
    "reason": "Annual heart health check",
    "status": "confirmed",
    "createdAt": "2024-