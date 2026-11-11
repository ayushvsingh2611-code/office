# 📊 Clinical Data Models & Schema Contract — CarePulse Health Management
**Lead Database & State Architect:** Nami (Navigator of Data & State)
**Schema Version:** `2.0.0`
**Storage Key:** `carepulse_hospital_db_v2`

---

## 1. Entity Relationship Overview

```
┌──────────────────┐            ┌──────────────────┐
│     Doctor       │ 1        * │   Appointment    │
│ (Consultant Spec)├───────────►│ (Outpatient Pass)│
└──────────────────┘            └─────────┬────────┘
                                          │ 1
                                          │
                                          ▼ *
┌──────────────────┐            ┌──────────────────┐
│    Prescription  │ *        1 │     Patient      │
│  (Digital Rx)    │◄───────────┤   (EHR Record)   │
└──────────────────┘            └─────────┬────────┘
                                          │ 1
                                          │
                                          ▼ 1 (optional)
┌──────────────────┐            ┌──────────────────┐
│  Pharmacy Stock  │            │     ICU Bed      │
│ (Drug Formulary) │            │ (14-Bed Matrix)  │
└──────────────────┘            └──────────────────┘
```

---

## 2. Entity Schemas

### 2.1 Doctor Entity (`Doctor`)
```typescript
interface Doctor {
  id: string;               // Unique ID: 'doc-1' to 'doc-6'
  name: string;             // e.g. "Dr. Sarah Jenkins"
  degrees: string;          // e.g. "MD, DM (Cardiology)"
  department: string;       // "Cardiology" | "Neurology" | "Pediatrics" | "Orthopedics" | "Dermatology" | "Oncology"
  experience: string;       // e.g. "16 Yrs Exp"
  roleTitle: string;        // e.g. "Senior Consultant Cardiologist"
  rating: number;           // e.g. 4.9 (out of 5.0)
  reviewsCount: number;     // e.g. 840
  fee: number;              // Consultation Fee in INR (e.g. 800)
  room: string;             // Clinic location: "Room 302 (Cardio Wing)"
  schedule: string;         // Working hours: "Mon - Fri (09:00 - 15:30)"
  slotsAvailable: number;   // Daily available slots (e.g. 6)
  avatar: string;           // Verified Unsplash physician portrait URL
  bio: string;              // Clinical sub-specialty biography
}
```

### 2.2 Appointment Entity (`Appointment`)
```typescript
interface Appointment {
  id: string;               // e.g. "APT-8821"
  token: string;            // Daily sequential token: "CP-01", "CP-02"
  patientName: string;      // Full name: "Arjun Mehta"
  patientPhone: string;     // E.164 phone: "+91 98450 11223"
  patientAge: number;       // e.g. 42
  patientGender: 'Male' | 'Female' | 'Other';
  doctorId: string;         // Foreign key referencing Doctor.id
  doctorName: string;       // e.g. "Dr. Sarah Jenkins"
  department: string;       // e.g. "Cardiology"
  date: string;             // YYYY-MM-DD
  timeSlot: string;         // e.g. "11:00 AM"
  symptoms: string;         // Chief clinical complaints
  priority: boolean;        // High priority / triage flag
  status: 'Confirmed' | 'In-Progress' | 'Completed' | 'Cancelled';
}
```

### 2.3 Electronic Health Record (`EHRRecord`)
```typescript
interface EHRParameter {
  name: string;             // e.g. "Fasting Blood Glucose"
  value: string;            // e.g. "92"
  unit: string;             // e.g. "mg/dL"
  refRange: string;         // Biological reference interval: "70 - 99"
  flag: 'Normal' | 'High' | 'Low';
}

interface EHRRecord {
  id: string;               // e.g. "EHR-101"
  labId: string;            // e.g. "LAB-9921"
  title: string;            // e.g. "Comprehensive Metabolic & Lipid Diagnostic Panel"
  department: string;       // Central Clinical Pathology / Radiodiagnostics
  date: string;             // Date collected: YYYY-MM-DD
  orderingDoctor: string;   // e.g. "Dr. Sarah Jenkins, MD"
  patientName: string;      // e.g. "Arjun Mehta (42y / M)"
  specimenType: string;     // e.g. "Fasting Venous Whole Blood & Serum"
  findingsSummary: string;  // Detailed pathologist interpretation
  status: 'Normal' | 'Abnormal Flagged' | 'Mild Degenerative';
  parameters: EHRParameter[];
  pathologist: string;      // Verified certifying pathologist credentials
}
```

### 2.4 Digital Prescription Entity (`Prescription`)
```typescript
interface Prescription {
  id: string;               // e.g. "RX-701"
  rxNumber: string;         // e.g. "CARE-RX-9081"
  medicine: string;         // e.g. "Atorvastatin Calcium Tablets"
  strength: string;         // e.g. "20 mg"
  instructions: string;     // Directions: "Take 1 tablet daily at bedtime"
  duration: string;         // e.g. "30 Days (30 Tablets)"
  doctor: string;           // Prescribing doctor
  prescribedDate: string;   // YYYY-MM-DD
  refillsRemaining: number; // e.g. 2 (decrements on refill request)
  status: 'Active' | 'Completed';
}
```

### 2.5 ICU Bed Entity (`ICUBed`)
```typescript
interface ICUBed {
  id: string;               // e.g. "bed-101"
  bedNumber: string;        // e.g. "ICU-101"
  status: 'Occupied' | 'Available';
  patientName: string;      // Patient name or "Unassigned"
  condition: string;        // Clinical indication: "Acute Coronary Syndrome"
  ventilator: string;       // e.g. "EV300 Active", "High-Flow O2", "Standby"
  admitDate: string;        // YYYY-MM-DD or "-"
}
```

### 2.6 Pharmacy Formulary Entity (`PharmacyItem`)
```typescript
interface PharmacyItem {
  code: string;             // Drug code: "PH-101"
  name: string;             // Generic & Brand trade name
  category: string;         // Pharmacological class
  form: string;             // Formulation: "Oral Tablet (10x10)"
  stock: number;            // Current inventory count
  price: number;            // Unit cost in INR
  rxReq: boolean;           // Prescription mandatory flag
}
```

---

## 3. Data Integrity & Validation Constraints

1. **Appointment Uniqueness & Slot Concurrency:**
   - No patient can double-book the same doctor in the identical time slot.
   - Doctor available slots are decremented upon booking and restored upon cancellation.

2. **Temporal Validity:**
   - Appointment dates must be $\ge$ Current Date ($T_{\text{today}}$). Historical dates are blocked by form constraints.

3. **Prescription Refill Floor:**
   - Refills remaining cannot decrement below zero ($R \ge 0$). When $R = 0$, action button transitions to disabled state.

4. **ICU Bed Capacity Ceiling:**
   - The ICU unit has exactly 14 Class-A physical beds. Total occupied + total vacant beds strictly equals 14.

---

*Data Schema Approved by Nami (Lead Database & State Architect).*
