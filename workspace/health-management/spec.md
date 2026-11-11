# 📝 Functional Specification & Clinical User Stories — CarePulse Health Management
**Lead Product & Requirements Analyst:** Hancock (Empress of Product Strategy)
**Project Vision:** "CarePulse — Integrated Hospital & Patient Health Management System"

---

## 1. Domain User Stories (Hospital & Patient Management)

### US-01 (Multi-Role Portal Access)
- **As a** Patient, Doctor, or Hospital Administrator,
- **I want to** seamlessly switch between Patient Portal, Doctor Desk, and Hospital Admin views with persistent role state,
- **So that** I can execute clinical responsibilities or view patient care records tailored to my security permissions.

### US-02 (Doctor Appointment Scheduling & Token Allocation)
- **As a** Patient or Outpatient Coordinator,
- **I want to** select an attending specialist (Cardiology, Neurology, Pediatrics, Orthopedics, Dermatology, Oncology), pick a validated date and time slot, and submit medical symptoms,
- **So that** a confirmed appointment with an assigned OPD Token (e.g. #CP-04) is instantly generated and stored in the hospital database.

### US-03 (Appointment Lifecycle Management: Reschedule & Cancel)
- **As a** Patient or Clinical Desk Assistant,
- **I want to** cancel an upcoming consultation or reschedule it to a new date/slot,
- **So that** doctor availability is optimized, slot contention is avoided, and status badges reflect real-time hospital operations.

### US-04 (Clinical Appointment Slip / Pass Generation)
- **As an** Outpatient,
- **I want to** inspect and print an authentic Hospital Consultation Pass containing token numbers, QR/barcode simulation, reporting time, and clinic directions,
- **So that** I have physical documentation when checking into the outpatient department.

### US-05 (Electronic Health Records - EHR & Laboratory Diagnostic Slip)
- **As an** Attending Doctor or Patient,
- **I want to** review comprehensive diagnostic panels (Comprehensive Metabolic & Lipid Panel, 12-Lead ECG Telemetry, Lumbar MRI),
- **So that** I can open an interactive NABL-accredited laboratory report with observed values, biological reference intervals, and clinical pathologist sign-offs.

### US-06 (Digital Prescriptions & Central Pharmacy Refills)
- **As a** Patient with chronic or post-operative regimens,
- **I want to** review active prescribed medications (Atorvastatin 20mg, Metformin 500mg, etc.) and click "Request Refill",
- **So that** my remaining refills decrement, dispatch notifications are sent to the Central Pharmacy, and status alerts are received immediately.

### US-07 (Doctor Consultation Desk & Prescription Formulation)
- **As an** Attending Physician on OPD duty,
- **I want to** review today's waiting patient queue, initiate consultations, input diagnostic notes, and issue digital prescriptions,
- **So that** prescriptions are committed directly into the patient's EHR and the pharmacy dispensing ledger.

### US-08 (ICU & Critical Care 14-Bed Telemetry)
- **As a** Hospital Administrator or Emergency Triage Officer,
- **I want to** monitor the 14-bed Level-1 ICU matrix, admit trauma patients directly into vacant sanitized beds, and discharge recovering patients,
- **So that** critical care vacancy metrics update across hospital monitors in real time.

### US-09 (Continuous Vitals Monitoring & Arrhythmia Alerting)
- **As an** In-Patient Clinician,
- **I want to** observe real-time simulated physiological telemetry (Heart Rate, Blood Pressure, SpO2, Temperature) with an animated canvas ECG waveform,
- **So that** any abnormal arrhythmia or vital spike triggers visual and audible alerts.

### US-10 (Hospital Formulary & Inventory Dispensing)
- **As a** Pharmacy Inventory Manager,
- **I want to** search essential pharmaceutical inventory and dispense units directly to clinical wards or restock supplies,
- **So that** emergency drug shortages are prevented.

---

## 2. Acceptance Criteria Matrix

| Requirement | Acceptance Criteria | Verification Method | Status |
|:---|:---|:---|:---:|
| **Role Switching** | Toggling role switches active headers, displays user avatar, updates view access, and shows toast. | UI inspection & click testing | PASS |
| **Appointment Booking** | Form validates required fields, prevents past dates, allocates token, updates counters, saves to LocalStorage. | Form submit automated test | PASS |
| **Cancellation** | Cancel button prompts confirmation, switches status to `Cancelled`, decrements active badge. | Table action test | PASS |
| **Rescheduling** | Modal opens with current details, updates date/time slot, updates row badge. | Modal submit test | PASS |
| **Appointment Slip** | Modal displays formatted hospital ticket with token, barcode, clinic location, and print action. | Modal inspection test | PASS |
| **EHR Diagnostic Slip** | Modal displays NABL laboratory slip with parameters, units, reference intervals, and pathologist signature. | Modal inspection test | PASS |
| **Prescription Refills** | Refill button decrements refills count, triggers pharmacy dispatch alert, disables at 0 refills. | Refill click test | PASS |
| **Doctor Desk Rx Issuer** | Doctor enters medication and schedule; submission commits new prescription into patient records. | Form submit test | PASS |
| **ICU Bed Admission** | Emergency form assigns patient to vacant bed, updates status to `Occupied`, decrements vacancy counter. | Bed matrix test | PASS |
| **ICU Bed Discharge** | Discharge button clears patient, sets bed to `Available`, increments vacancy counter. | Bed discharge test | PASS |
| **Live ECG Monitor** | Canvas renders animated rhythm line continuously; vitals fluctuate gently when telemetry is active. | Canvas rendering test | PASS |
| **Omnisearch Filter** | Site search input filters doctors, appointments, EHR records, prescriptions, and pharmacy live. | Input event filter test | PASS |
| **Persistence** | Full CRUD mutations persist in `localStorage` under `carepulse_hospital_db_v2`. | Page reload check | PASS |
| **Zero Dead Buttons** | Every single button has an active event listener performing verified state mutations. | Event audit test | PASS |

---

*Specification Approved & Signed Off by Hancock (Lead Product & Requirements Analyst).*
