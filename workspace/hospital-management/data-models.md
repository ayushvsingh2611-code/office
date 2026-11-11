Namaste! Nami here, your Data Architect. 

A complex system like a **Hospital Management System (HMS)** requires absolute structural integrity, fast real-time synchronization (especially for ICU and doctor desks), and strict compliance (HIPAA/GDPR for patient data). 

Here is the complete architectural blueprint covering Database Entities, Relationships, State Management, API Contracts, and Validation Rules.

---

### 1. Database Entities & Relationships (ER Design)

We will use a relational database (PostgreSQL) for transactional data (ACID compliance for billing/appointments) and a document store (MongoDB) for unstructured data like lab report JSONs and clinical notes.

#### Core Entities:
1. **User**: Base entity for authentication & role management (Patient, Doctor, Nurse, Admin, LabTech).
2. **Patient**: Extends User; holds demographic and emergency contact details.
3. **Doctor**: Extends User; holds specialization, department, and schedule rules.
4. **Appointment**: Tracks patient-doctor bookings and consultation statuses.
5. **ICU_Bed**: Real-time tracking of ICU units, ventilators, and occupancy status.
6. **Lab_Report**: Test requisitions, results, and pathologist remarks.
7. **Billing**: Invoices, insurance claims, and payment status.

#### Entity-Relationship Diagram (Textual Representation)
```text
User (1) <---> (0..1) Patient
User (1) <---> (0..1) Doctor
Patient (1) ---> (0..N) Appointment
Doctor (1) ---> (0..N) Appointment
Patient (1) ---> (0..N) Lab_Report
Doctor (1) ---> (0..N) Lab_Report (Ordered by)
ICU_Bed (1) ---> (0..1) Patient (Occupied by)
```

#### SQL Schema Definition (PostgreSQL)
```sql
CREATE TYPE user_role AS ENUM ('ADMIN', 'PATIENT', 'DOCTOR', 'NURSE', 'LAB_TECH');
CREATE TYPE appointment_status AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'IN_PROGRESS');
CREATE TYPE bed_status AS ENUM ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE patients (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    blood_group VARCHAR(5),
    address TEXT,
    emergency_contact_json JSONB
);

CREATE TABLE doctors (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    specialization VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    consultation_fee DECIMAL(10, 2) NOT NULL,
    available_days VARCHAR(50[] -- e.g., ['MON', 'TUE', 'WED']
);

CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) NOT NULL,
    doctor_id UUID REFERENCES doctors(id) NOT NULL,
    appointment_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status appointment_status DEFAULT 'SCHEDULED',
    symptoms TEXT,
    prescription TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE icu_beds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bed_number VARCHAR(20) UNIQUE NOT NULL,
    ward_name VARCHAR(50) NOT NULL,
    status bed_status DEFAULT 'AVAILABLE',
    current_patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
    has_ventilator BOOLEAN DEFAULT FALSE,
    last_sanitized_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE lab_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) NOT NULL,
    doctor_id UUID REFERENCES doctors(id) NOT NULL,
    test_name VARCHAR(150) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, COMPLETED, REVIEWED
    result_data JSONB, -- Flexible schema for diverse lab tests
    pdf_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

### 2. State Management Structure (Frontend / Client-Side)

For a real-time reactive UI (Doctor Desk & ICU Vacancy), we will use **Redux Toolkit + WebSockets (Socket.io)**.

#### Global Store Architecture
```typescript
interface RootState {
  auth: AuthState;
  appointments: AppointmentState;
  icuTracker: ICUState;
  doctorDesk: DoctorDeskState;
  labReports: LabReportState;
}

// ICU Real-Time Slice (High Priority Sync)
interface ICUState {
  beds: Record<string, {
    id: string;
    bedNumber: string;
    status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
    patientId: string | null;
    hasVentilator: boolean;
  }>;
  totalAvailable: number;
  totalOccupied: number;
  loading: boolean;
  error: string | null;
}

// Doctor Desk Slice
interface DoctorDeskState {
  activeQueue: Array<{
    appointmentId: string;
    patientId: string;
    patientName: string;
    symptoms: string;
    scheduledTime: string;
  }>;
  currentPatientId: string | null;
  consultationNotes: string;
}
```

---

### 3. API Contracts (REST & WebSockets)

#### A. Appointment Booking API
* **Endpoint:** `POST /api/v1/appointments`
* **Request Payload:**
```json
{
  "patientId": "d3b07384-d113-4ec7-a765-1bb13d8cd63e",
  "doctorId": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
  "appointmentTime": "2023-11-20T10:30:00Z",
  "symptoms": "Persistent headache and mild fever"
}
```
* **Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "appointmentId": "f8e7d6c5-b4a3-2109-8765-43210fedcba9",
    "status": "SCHEDULED",
    "appointmentTime": "2023-11-20T10:30:00Z"
  }
}
```

#### B. ICU Vacancy Stream (WebSocket)
* **Event:** `subscribe_icu_feed`
* **Server Push (`icu_update`):**
```json
{
  "bedId": "c9d8e7f6-a5b4-3210-9876-543210fedcba",
  "bedNumber": "ICU-04",
  "status": "AVAILABLE",
  "hasVentilator": true,
  "updatedAt": "2023-10-25T08:15:00Z"
}
```

#### C. Lab Report Upload API
* **Endpoint:** `POST /api/v1/lab-reports` (Multipart Form-Data)
* **Request:**
  * `patientId`: UUID
  * `doctorId`: UUID
  * `testName`: "Complete Blood Count (CBC)"
  * `reportFile`: Binary PDF
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Lab report uploaded and parsed successfully.",
  "reportId": "b1a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"
}
```

---

### 4. Data Validation Rules & Integrity (JOD / Zod Schema)

To validate incoming requests at the API gateway level, we use **Zod**.

```typescript
import { z } from 'zod';

export const AppointmentBookingSchema = z.object({
  patientId: z.string().uuid({ message: "Invalid Patient ID format" }),
  doctorId: z.string().uuid({ message: "Invalid Doctor ID format" }),
  appointmentTime: z.string().refine((val) => !isNaN(Date.parse(val)) && new Date(val) > new Date(), {
    message: "Appointment time must be in the future",
  }),
  symptoms: z.string().min(5, { message: "Please provide detailed symptoms (min 5 characters)" }).max(500),
});

export const ICUStatusUpdateSchema = z.object({
  bedId: z.string().uuid(),
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED']),
  currentPatientId: z.string().uuid().nullable(),
}).refine(data => {
  if (data.status === 'OCCUPIED' && !data.currentPatientId) {
    return false;
  }
  return true;
}, {
  message: "Patient ID is required when marking an ICU bed as OCCUPIED",
  path: ["currentPatientId"],
});
```

### Database Integrity Constraints (Enforced via Triggers/Constraints):
1. **No Double Booking:** A `EXCLUDE` constraint or application-level locking must ensure a doctor cannot have two `SCHEDULED` appointments within the same 30-minute block.
2. **ICU Consistency:** When `icu_beds.status` is updated to `AVAILABLE`, trigger an automatic nullification of `current_patient_id`.

---
*Nami signing off. The database architecture is locked, scalable, and ready for deployment. Pass it on to the Backend/Frontend squad!*