# System Architecture & Data Design: Healthcare Management System
**Architect:** Nami (Data Architect)  
**Project:** HMS (Healthcare Management System)

---

## 1. Database Entities & ER Schema (Relational Mapping for LocalStorage)

Since we are utilizing `localStorage`, our data model mimics a normalized relational database using JSON structures with foreign key references.

### **Entity-Relationship Diagram (Conceptual)**
```text
[Patients] 1 ---- * [Appointments] * ---- 1 [Doctors]
[Patients] 1 ---- * [MedicalRecords] 
[Doctors]  1 ---- * [MedicalRecords]
[Users]    1 ---- 1 [Patients / Doctors] (Auth/Role layer)
```

### **Entity Definitions**

#### **1. Patient Entity**
```json
{
  "id": "pat_uuid_v4",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-0199",
  "dateOfBirth": "1985-06-15",
  "gender": "Male",
  "bloodGroup": "O+",
  "address": "123 Health St, Wellness City",
  "emergencyContact": {
    "name": "Jane Doe",
    "relation": "Spouse",
    "phone": "+1-555-0198"
  },
  "createdAt": "2023-10-01T08:00:00Z",
  "updatedAt": "2023-10-01T08:00:00Z"
}
```

#### **2. Doctor Entity**
```json
{
  "id": "doc_uuid_v4",
  "firstName": "Sarah",
  "lastName": "Jenkins",
  "email": "dr.jenkins@hms.com",
  "phone": "+1-555-0144",
  "specialization": "Cardiology",
  "qualification": "MD, FACC",
  "experienceYears": 12,
  "consultationFee": 150.00,
  "availability": {
    "days": ["Mon", "Tue", "Wed", "Thu", "Fri"],
    "timeSlots": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
  },
  "rating": 4.8,
  "profileImage": "/images/doctors/sarah-jenkins.jpg",
  "createdAt": "2023-01-15T00:00:00Z"
}
```

#### **3. Appointment Entity**
```json
{
  "id": "apt_uuid_v4",
  "patientId": "pat_uuid_v4",
  "doctorId": "doc_uuid_v4",
  "appointmentDate": "2023-11-10",
  "timeSlot": "10:00",
  "status": "Scheduled", 
  "type": "In-Person", 
  "symptoms": "Chest tightness and mild shortness of breath.",
  "notes": "",
  "createdAt": "2023-10-25T14:32:00Z",
  "updatedAt": "2023-10-25T14:32:00Z"
}
```

#### **4. Medical Record Entity**
```json
{
  "id": "med_uuid_v4",
  "patientId": "pat_uuid_v4",
  "doctorId": "doc_uuid_v4",
  "appointmentId": "apt_uuid_v4",
  "diagnosis": "Essential Hypertension",
  "prescription": [
    {
      "medicine": "Lisinopril",
      "dosage": "10mg",
      "frequency": "Once daily",
      "duration": "30 days"
    }
  ],
  "labReports": [
    {
      "testName": "Lipid Profile",
      "resultUrl": "#",
      "status": "Normal"
    }
  ],
  "doctorNotes": "Patient advised to reduce sodium intake and monitor BP twice daily.",
  "visitDate": "2023-10-20T10:30:00Z"
}
```

---

## 2. State Management Architecture (Frontend Store)

We will use a centralized state management pattern (React Context + Redux-like reducer pattern or Zustand) to manage application state and sync with `localStorage`.

### **Global State Shape**
```typescript
interface RootState {
  auth: {
    currentUser: Patient | Doctor | null;
    role: 'patient' | 'doctor' | 'admin' | null;
    isAuthenticated: boolean;
  };
  patients: {
    entities: Record<string, Patient>;
    selectedPatientId: string | null;
  };
  doctors: {
    entities: Record<string, Doctor>;
    filters: {
      specialization: string;
      searchQuery: string;
    };
  };
  appointments: {
    entities: Record<string, Appointment>;
    loading: boolean;
    error: string | null;
  };
  medicalRecords: {
    entities: Record<string, MedicalRecord>;
  };
  ui: {
    activeModal: 'BOOK_APPOINTMENT' | 'VIEW_RECORD' | 'EDIT_PROFILE' | null;
    modalData: any;
    notifications: Array<{ id: string; type: 'success' | 'error'; message: string }>;
  };
}
```

---

## 3. API Contracts (Mock Service Layer)

To keep the application modular, we will define an asynchronous Service Layer that mimics REST API calls while executing read/write operations against `localStorage`.

| Endpoint / Method | Description | Request Payload | Response / Return |
| :--- | :--- | :--- | :--- |
| `GET /api/doctors` | Fetch all doctors (supports query filters) | `Query: ?specialization=Cardiology&q=Sarah` | `Doctor[]` |
| `GET /api/doctors/:id` | Fetch doctor profile & available slots | None | `Doctor` |
| `GET /api/patients/:id/appointments` | Get patient appointment history | None | `Appointment[]` |
| `POST /api/appointments` | Book a new appointment | `AppointmentCreateDTO` | `Appointment` (Status: `Scheduled`) |
| `PATCH /api/appointments/:id` | Cancel/Reschedule appointment | `{ status: 'Cancelled' \| 'Rescheduled', timeSlot? }` | `Appointment` |
| `GET /api/patients/:id/records` | Fetch medical records/history | None | `MedicalRecord[]` |

---

## 4. Data Validation Rules & Integrity (Zod Schemas)

To maintain data integrity before persisting to `localStorage`, the following validation rules apply.

```typescript
import { z } from 'zod';

export const AppointmentSchema = z.object({
  patientId: z.string().uuid({ message: "Invalid Patient ID" }),
  doctorId: z.string().uuid({ message: "Invalid Doctor ID" }),
  appointmentDate: z.string().refine((date) => new Date(date) > new Date(), {
    message: "Appointment date must be in the future",
  }),
  timeSlot: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Time slot must be in HH:MM format",
  }),
  type: z.enum(['In-Person', 'Telehealth']),
  symptoms: z.string().min(5, "Please provide a brief description of symptoms (min 5 chars)").max(500),
});

export const PatientProfileSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  dateOfBirth: z.string().refine((dob) => new Date(dob) < new Date(), {
    message: "Date of birth must be in the past",
  }),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
});
```

---

## 5. LocalStorage Initialization & Persistence Strategy

1. **Hydration on Boot:** On application load, a seed function checks if `hms_initialized` exists in `localStorage`. If not, it populates default demo data for Doctors, Patients, and initial Appointments.
2. **Persistence Middleware:** Every state-mutating action (e.g., booking an appointment) updates the React state *and* serializes the affected entity slice back to `localStorage`.

```typescript
const STORAGE_KEYS = {
  PATIENTS: 'hms_patients',
  DOCTORS: 'hms_doctors',
  APPOINTMENTS: 'hms_appointments',
  RECORDS: 'hms_medical_records',
};

// Example Storage Service Helper
export const db = {
  getCollection: <T>(key: string): T[] => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },
  saveCollection: <T>(key: string, data: T[]): void => {
    localStorage.setItem(key, JSON.stringify(data));
  }
};
```