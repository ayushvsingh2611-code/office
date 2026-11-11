# Hospital Management System (HMS) – Integration & API Specification  
**Prepared by:** Brook – Integrations & Content Specialist  

---  

## 1. System Overview  

| Module | Primary Actors | Core Functions |
|--------|----------------|----------------|
| **Patient Portal** | Patients, Care‑givers | Register / login, view personal profile, book appointments, view lab results, request ICU admission, receive notifications (SMS/Email). |
| **Doctor Desk** | Physicians, Nurses | View daily schedule, patient history, write progress notes, order labs, discharge summaries, update ICU occupancy. |
| **ICU Vacancy Service** | ICU Manager, Bed‑allocation Engine | Real‑time ICU bed availability, admit/discharge flow, occupancy analytics. |
| **Lab Reports** | Lab Technicians, Pathologists | Receive lab orders, upload results (PDF/structured data), trigger alerts for critical values. |
| **Appointment Booking** | Patients, Receptionists | Search doctors/slots, book, reschedule, cancel, send confirmations. |

The HMS is **micro‑service based** and exposes a **RESTful HTTP API** for each functional domain. External services that the HMS must integrate with are:

| External Service | Purpose | Integration Type |
|------------------|---------|------------------|
| **Identity Provider (IdP)** (e.g., Keycloak, Azure AD) | SSO, token issuance, role‑based access | OAuth 2.0 / OpenID Connect |
| **SMS Gateway** (Twilio, Vonage) | OTP, appointment reminders, ICU alerts | HTTP webhook / REST |
| **Email Service** (SendGrid, SES) | Confirmation & report delivery | SMTP / REST API |
| **Payment Gateway** (Stripe, Razorpay) | Co‑pay & service fees | Webhook + REST |
| **Insurance Verification** (Third‑party insurer API) | Eligibility & coverage checks | REST |
| **Laboratory Information System (LIS)** | Lab order & result exchange | HL7 v2 over MLLP **or** FHIR‑R4 (JSON) |
| **Electronic Health Record (EHR) / EMR** | Long‑term patient record sync | FHIR‑R4 (REST) |
| **Analytics / BI** (Power BI, Looker) | Dashboards for ICU occupancy, appointments | Data‑warehouse ETL (Kafka/REST) |

---

## 2. Non‑Functional & Cross‑Cutting Requirements  

| Category | Requirement | Detail |
|----------|-------------|--------|
| **Security** | OAuth 2.0 + JWT | Access tokens (`aud: hms.api`, `iss: idp.company.com`). Refresh tokens via `POST /auth/refresh`. |
| | Scope‑based authorization | `patient.read`, `patient.write`, `doctor.read`, `icu.manage`, `lab.write`, `appointment.book`. |
| | Data encryption | TLS 1.2+ for all traffic; at‑rest AES‑256. |
| **Performance** | Latency | ≤ 200 ms for read‑only endpoints; ≤ 500 ms for write (incl. downstream calls). |
| | Rate limiting | 100 req/min per consumer (soft limit), 500 req/min burst. |
| **Reliability** | Idempotency | All `POST`/`PUT` that change state must be idempotent via `Idempotency-Key` header. |
| | Retries & back‑off | 3 retries with exponential back‑off for external calls (SMS, Email, Payment). |
| **Versioning** | URL versioning | `/v1/...` – major version in path. |
| **Observability** | Structured logging (JSON), tracing (OpenTelemetry), health‑check endpoint (`GET /health`). |
| **Compliance** | HIPAA / GDPR | Audit logs, data‑subject access requests, consent management. |

---

## 3. API Contracts  

> **All request/response bodies are JSON** unless otherwise noted.  
> **Common Headers**  

| Header | Required? | Value |
|--------|-----------|-------|
| `Authorization` | Yes | `Bearer <JWT>` |
| `Content-Type` | Yes (for bodies) | `application/json` |
| `Accept` | Yes | `application/json` |
| `Idempotency-Key` | Optional (writes) | UUID v4 |

### 3.1 Authentication  

| Endpoint | Method | Path | Description |
|----------|--------|------|-------------|
| **Token issuance** | `POST` | `/v1/auth/token` | Username/password or client‑credentials flow. |
| **Refresh token** | `POST` | `/v1/auth/refresh` | Returns new access token. |

**Request – `/v1/auth/token`**  

```json
{
  "grant_type": "password",
  "username": "john.doe@example.com",
  "password": "P@ssw0rd!",
  "client_id": "hms-frontend",
  "client_secret": "********"
}
```

**Response (200)**  

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4=",
  "expires_in": 3600,
  "token_type": "Bearer",
  "scope": "patient.read patient.write appointment.book"
}
```

---

### 3.2 Patient Portal  

| Endpoint | Method | Path | Scope | Description |
|----------|--------|------|-------|-------------|
| Register patient | `POST` | `/v1/patients` | `patient.write` | Create a new patient record. |
| Get patient profile | `GET` | `/v1/patients/{patientId}` | `patient.read` | Retrieve patient details. |
| Update profile | `PUT` | `/v1/patients/{patientId}` | `patient.write` | Edit personal data, consent. |
| List lab reports | `GET` | `/v1/patients/{patientId}/lab-reports` | `patient.read` | Paginated list of reports. |
| Download a report | `GET` | `/v1/patients/{patientId}/lab-reports/{reportId}` | `patient.read` | Returns PDF (binary) with `Content-Type: application/pdf`. |
| Request ICU admission | `POST` | `/v1/patients/{patientId}/icu-requests` | `patient.write` | Create a priority ICU admission request. |
| Get ICU request status | `GET` | `/v1/patients/{patientId}/icu-requests/{requestId}` | `patient.read` | Current status (pending, approved, rejected). |

#### Example – Register Patient (`POST /v1/patients`)  

**Request**  

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "date_of_birth": "1985-04-12",
  "gender": "M",
  "email": "john.doe@example.com",
  "phone": "+1-555-123-4567",
  "address": {
    "line1": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "postal_code": "62704",
    "country": "US"
  },
  "emergency_contact": {
    "name": "Jane Doe",
    "relation": "Spouse",
    "phone": "+1-555-987-6543"
  },
  "insurance": {
    "provider": "HealthFirst",
    "policy_number": "HF-987654321"
  },
  "consent": {
    "privacy_policy": true,
    "email_notifications": true,
    "sms_notifications": false
  }
}
```

**Response (201 Created)**  

```json
{
  "patient_id": "P-2023110001",
  "created_at": "2026-11-04T09:15:23Z",
  "status": "ACTIVE"
}
```

---

### 3.3 Doctor Desk  

| Endpoint | Method | Path | Scope | Description |
|----------|--------|------|-------|-------------|
| Get doctor schedule | `GET` | `/v1/doctors/{doctorId}/schedule` | `doctor.read` | Returns daily/weekly slots. |
| Update availability | `PUT` | `/v1/doctors/{doctorId}/availability` | `doctor.write` | Block/unblock slots (e.g., vacation). |
| Retrieve patient chart | `GET` | `/v1/doctors/{doctorId}/patients/{patientId}` | `doctor.read` | Full EHR view (FHIR). |
| Add progress note | `POST` | `/v1/doctors/{doctorId}/patients/{patientId}/notes` | `doctor.write` | Clinical note entry. |
| Order lab test | `POST` | `/v1/doctors/{doctorId}/patients/{patientId}/lab-orders` | `lab.write` | Sends order to LIS. |
| Discharge summary | `POST` | `/v1/doctors/{doctorId}/patients/{patientId}/discharge` | `doctor.write` | Generates PDF, updates status. |

#### Example – Order Lab Test (`POST /v1/doctors/{doctorId}/patients/{patientId}/lab-orders`)  

**Request**  

```json
{
  "order_id": "LO-202311-0005",
  "requested_at": "2026-11-04T10:02:00Z",
  "tests": [
    {
      "code": "CBC",
      "display": "Complete Blood Count",
      "priority": "ROUTINE"
    },
    {
      "code": "BMP",
      "display": "Basic Metabolic Panel",
      "priority": "STAT"
    }
  ],
  "clinical_indication": "Pre‑operative assessment",
  "specimen_type": "VENOUS_BLOOD",
  "fasting_required": true
}
```

**Response (202 Accepted)**  

```json
{
  "order_id": "LO-202311-0005",
  "status": "SUBMITTED",
  "lis_reference": "LIS-987654321",
  "estimated_completion": "2026-11-04T14:00:00Z"
}
```

---

### 3.4 ICU Vacancy Service  

| Endpoint | Method | Path | Scope | Description |
|----------|--------|------|-------|-------------|
| Get current ICU occupancy | `GET` | `/v1/icu/occupancy` | `icu.read` | Returns bed count per unit. |
| Admit patient to ICU | `POST` | `/v1/icu/admissions` | `icu.manage` | Creates an ICU admission record. |
| Discharge from ICU | `POST` | `/v1/icu/discharges` | `icu.manage` | Frees a bed, logs discharge. |
| Subscribe to occupancy events | `GET` | `/v1/icu/occupancy/stream` | `icu.read` | Server‑Sent Events (SSE) for real‑time UI. |

#### Example – Get Occupancy (`GET /v1/icu/occupancy`)  

**Response (200)**  

```json
{
  "hospital_id": "H-001",
  "timestamp": "2026-11-04T11:30:00Z",
  "units": [
    {
      "unit_id": "ICU-01",
      "total_beds": 12,
      "occupied_beds": 9,
      "available_beds": 3,
      "isolation_beds": 2,
      "available_isolation": 1
    },
    {
      "unit_id": "ICU-02",
      "total_beds": 8,
      "occupied_beds": 8,
      "available_beds": 0,
      "isolation_beds": 0,
      "available_isolation": 0
    }
  ]
}
```

---

### 3.5 Lab Reports  

| Endpoint | Method | Path | Scope | Description |
|----------|--------|------|-------|-------------|
| Receive lab order (LIS → HMS) | `POST` | `/v1/lab/orders` | `lab.write` | HL7‑to‑FHIR translation endpoint (internal). |
| Upload lab result | `POST` | `/v1/lab/reports` | `lab.write` | Stores structured data + PDF. |
| Get report summary | `GET` | `/v1/lab/reports/{reportId}` | `lab.read` | JSON metadata (no PDF). |
| List pending orders | `GET` | `/v1/lab/orders?status=PENDING` | `lab.read` | For dashboard. |

#### Example – Upload Lab Result (`POST /v1/lab/reports`)  

**Request (multipart/form-data)**  

| Part | Content-Type | Description |
|------|--------------|-------------|
| `metadata` | `application/json` | Structured result data (see schema). |
| `pdf` | `application/pdf` | Signed PDF report. |

**`metadata` JSON**  

```json
{
  "report_id": "LR-202311-0012",
  "order_id": "LO-202311-0005",
  "patient_id": "P-2023110001",
  "performed_at": "2026-11-04T13:45:00Z",
  "results": [
    {
      "code": "WBC",
      "value": 7.2,
      "unit": "10^3/uL",
      "reference_range": "4.0-11.0"
    },
    {
      "code": "GLU",
      "value": 92,
      "unit": "mg/dL",
      "reference_range": "70-99"
    }
  ],
  "interpretation": "Normal",
  "critical_flags": []
}
```

**Response (201 Created)**  

```json
{
  "report_id": "LR-202311-0012",
  "status": "AVAILABLE",
  "pdf_url": "https://cdn.hms.com/reports/LR-202311-0012.pdf",
  "created_at": "2026-11-04T14:00:12Z"
}
```

---

### 3.6 Appointment Booking  

| Endpoint | Method | Path | Scope | Description |
|----------|--------|------|-------|-------------|
| Search available slots | `GET` | `/v1/appointments/slots` | `appointment.book` | Filters: `doctorId`, `specialty`, `date`, `type` (in‑person/tele). |
| Book appointment | `POST` | `/v1/appointments` | `appointment.book` | Creates a booking, triggers SMS/Email. |
| Reschedule | `PUT` | `/v1/appointments/{appointmentId}` | `appointment.book` | Change slot. |
| Cancel | `DELETE` | `/v1/appointments/{appointmentId}` | `appointment.book` | Cancellation policy enforced. |
| Get patient’s appointments | `GET` | `/v1/patients/{patientId}/appointments` | `patient.read` | List upcoming & past. |

#### Example – Search Slots (`GET /v1/appointments/slots?doctorId=D-1001&date=2026-11-10`)  

**Response (200)**  

```json
{
  "doctor_id": "D-1001",
  "date": "2026-11-10",
  "slots": [
    {
      "slot_id": "S-20231110-001",
      "start_time": "2026-11-10T09:00:00Z",
      "end_time": "2026-11-10T09:30:00Z",
      "type": "IN_PERSON",
      "available": true
    },
    {
      "slot_id": "S-20231110-002",
      "start_time": "2026-11-10T09:30:00Z",
      "end_time": "2026-11-10T10:00:00Z",
      "type": "IN_PERSON",
      "available": false,
      "reason": "Already booked"
    }
  ]
}
```

#### Example – Book Appointment (`POST /v1/appointments`)  

**Request**  

```json
{
  "patient_id": "P-2023110001",
  "doctor_id": "D-1001",
  "slot_id": "S-20231110-001",
  "reason": "Routine follow‑up",
  "visit_type": "IN_PERSON",
  "payment_method": {
    "type": "CREDIT_CARD",
    "token": "tok_1Gq2V2..."
  },
  "consent_to_tele": false
}
```

**Response (201 Created)**  

```json
{
  "appointment_id": "A-202311-0007",
  "status": "CONFIRMED",
  "scheduled_at": "2026-11-10T09:00:00Z",
  "confirmation": {
    "sms_sent": true,
    "email_sent": true,
    "message_id": "msg-202311-0007"
  }
}
```

---

## 4. Data Models (JSON Schema Snippets)  

Below are the **canonical schemas** used across the APIs. All schemas are versioned (`$schema: http://json-schema.org/draft-07/schema#`) and stored in the internal schema registry (`/schemas/v1/...`).

### 4.1 Patient  

```json
{
  "$id": "https://api.hms.com/schemas/v1/patient.json",
  "type": "object",
  "required": ["first_name", "last_name", "date_of_birth", "gender", "email"],
  "properties": {
    "patient_id": { "type": "string", "pattern": "^P-\\d{10}$" },
    "first_name": { "type": "string", "max