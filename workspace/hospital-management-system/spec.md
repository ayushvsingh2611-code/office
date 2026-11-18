# SYSTEM ARCHITECTURE & IMPLEMENTATION SPECIFICATION
## Project: AegisCare Enterprise Hospital & Clinical Management System (HMS)
**Lead Architect:** Nami (Straw Hat Crew - Group 1)  
**Target Implementer:** Zoro (Group 1 - Builder)  
**Version:** 1.0.0-PROD-SPEC  
**Status:** Approved for Implementation  

---

## 1. Executive Summary & Brand Identity

### 1.1 Product Vision
**AegisCare HMS** is a state-of-the-art, high-reliability clinical web platform designed for acute-care hospitals, outpatient clinics, and multispecialty medical centers. The system consolidates Doctor Scheduling, Patient Electronic Health Records (EHR/EMR), Appointment Telemetry, Inpatient Ward/Bed Allocation, Pharmacy & Prescriptions, and Diagnostic Billing into a unified, zero-latency single-page application.

### 1.2 Authentic Medical Theme & Color Palette
The interface strictly adheres to ISO/HL7-grade healthcare software ergonomics—high legibility, calming clinical hues, clear visual triage coding, and strict contrast ratios (WCAG AAA).

| Token Name | Hex Code | Purpose |
|---|---|---|
| `--color-clinical-bg` | `#F8FAFC` | App canvas background (Slate 50) |
| `--color-surface` | `#FFFFFF` | Card & modal surfaces (Pure White) |
| `--color-sidebar-bg` | `#0F172A` | Primary navigation sidebar (Navy/Midnight 900) |
| `--color-sidebar-hover` | `#1E293B` | Sidebar navigation active/hover state |
| `--color-brand-primary` | `#0EA5E9` | Aegis Medical Blue (Primary CTAs, active badges) |
| `--color-brand-teal` | `#0D9488` | Surgical Teal (Health vitals, verified doctors) |
| `--color-emergency-red`| `#EF4444` | Emergency triage, critical vitals, cancellations |
| `--color-warning-amber`| `#F59E0B` | Pending status, bed near capacity, allergies |
| `--color-success-green`| `#10B981` | Discharged, confirmed, normal vitals, paid bills |
| `--color-purple-accent`| `#8B5CF6` | Specialty departments, neurology, pharmacy |
| `--color-border-subtle` | `#E2E8F0` | Structural dividers and input borders |
| `--color-text-main` | `#0F172A` | Primary heading and high-contrast text |
| `--color-text-muted` | `#64748B` | Secondary clinical labels and metadata |

### 1.3 Font Typography & Iconography
- **Primary Typography:** Inter / System UI (`system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`) with tabular numbers (`font-variant-numeric: tabular-nums`) for vitals and lab numbers.
- **Icons:** SVG vector icons embedded cleanly (Stethoscope, Calendar, Users, Bed, Pill, Receipt, Activity, ShieldPlus, Search, Plus, Filter, Download, Trash, Edit, CheckCircle).

---

## 2. Global State Model & Schemas

The application operates on an in-memory reactive state manager synchronized with `localStorage` (`key: 'AEGIS_HMS_STATE_V1'`) for complete data persistence between sessions.

### 2.1 State Data Structure
```typescript
interface AegisHMSState {
  currentTab: 'dashboard' | 'doctors' | 'patients' | 'appointments' | 'wards' | 'pharmacy' | 'billing';
  searchQuery: string;
  selectedDepartmentFilter: string; // 'all' | department name
  activeModal: string | null; // e.g., 'modal-add-patient' | 'modal-book-appointment' | 'modal-add-doctor' | 'modal-patient-details' | 'modal-prescription' | 'modal-invoice'
  selectedPatientId: string | null;
  selectedDoctorId: string | null;
  selectedAppointmentId: string | null;
  selectedInvoiceId: string | null;
  doctors: DoctorRecord[];
  patients: PatientRecord[];
  appointments: AppointmentRecord[];
  wards: WardRecord[];
  prescriptions: PrescriptionRecord[];
  invoices: InvoiceRecord[];
  emergencyAlert: {
    active: boolean;
    code: string;
    message: string;
    location: string;
  } | null;
}
```

### 2.2 Entity Schemas

#### DoctorRecord
```typescript
interface DoctorRecord {
  id: string; // e.g. "DOC-101"
  name: string; // e.g. "Dr. Sarah Lin, MD, FACC"
  specialty: string; // "Cardiology" | "Neurology" | "Pediatrics" | "Orthopedics" | "Oncology" | "Emergency Medicine"
  department: string;
  qualification: string; // "Johns Hopkins Univ / Harvard Medical"
  experienceYears: number;
  rating: number; // 4.9
  consultationFee: number; // 180
  availability: 'Available' | 'In Surgery' | 'On Leave' | 'Off Duty';
  roomNumber: string; // "B-204"
  contactPhone: string;
  contactEmail: string;
  avatarUrl: string;
  workingDays: string[]; // ["Mon", "Tue", "Thu", "Fri"]
  dailySlots: string[]; // ["09:00 AM", "10:30 AM", "02:00 PM", "04:15 PM"]
  patientsCount: number;
}
```

#### PatientRecord
```typescript
interface PatientRecord {
  id: string; // e.g. "PAT-501"
  name: string; // e.g. "Eleanor Vance"
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phone: string;
  email: string;
  avatarUrl: string;
  admissionStatus: 'Outpatient' | 'Inpatient' | 'Emergency' | 'Discharged';
  wardBed: string; // "ICU-Bed-04" or "N/A"
  assignedDoctorId: string; // "DOC-101"
  assignedDoctorName: string;
  admissionDate: string; // "2025-05-10"
  primaryDiagnosis: string;
  allergies: string[]; // ["Penicillin", "Latex"]
  vitals: {
    heartRateBpm: number; // 74
    bloodPressure: string; // "120/78"
    temperatureF: number; // 98.6
    oxygenSaturationPct: number; // 99
    respiratoryRate: number; // 16
  };
  medicalHistory: string[];
}
```

#### AppointmentRecord
```typescript
interface AppointmentRecord {
  id: string; // e.g. "APT-801"
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  dateTime: string; // "2025-05-18T10:30"
  timeSlot: string; // "10:30 AM"
  type: 'In-Person Consultation' | 'Follow-up' | 'Emergency Tele-Triage' | 'Pre-Op Evaluation' | 'Lab Review';
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  symptoms: string;
  priority: 'Routine' | 'Urgent' | 'Emergency';
  notes: string;
}
```

#### WardRecord
```typescript
interface WardRecord {
  id: string; // "WARD-ICU"
  name: string; // "Intensive Care Unit (ICU)"
  floor: string; // "3rd Floor - Wing A"
  department: string;
  totalBeds: number;
  occupiedBeds: number;
  headNurse: string;
  beds: {
    bedNumber: string;
    isOccupied: boolean;
    patientId?: string;
    patientName?: string;
    oxygenSupport: boolean;
  }[];
}
```

#### PrescriptionRecord
```typescript
interface PrescriptionRecord {
  id: string; // "RX-301"
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  issuedDate: string;
  medications: {
    medicineName: string;
    dosage: string; // "500mg"
    frequency: string; // "Twice Daily (BID)"
    duration: string; // "7 Days"
    instructions: string; // "Take after meals"
  }[];
  notes: string;
  dispensedStatus: 'Dispensed' | 'Pending Pharmacy' | 'Partial';
}
```

#### InvoiceRecord
```typescript
interface InvoiceRecord {
  id: string; // "INV-901"
  patientId: string;
  patientName: string;
  date: string;
  doctorFee: number;
  facilityCharges: number;
  medicineCharges: number;
  taxPct: number;
  totalAmount: number;
  paymentStatus: 'Paid' | 'Unpaid' | 'Insurance Pending';
  paymentMethod: 'Cash' | 'Credit Card' | 'Health Insurance' | 'Direct Debit';
}
```

---

## 3. Seed Mock Data Specification (Immediate Synchronous Load)

Builder Zoro MUST bundle this robust initial dataset so the system starts populated with rich, clinical, and diverse data without waiting for network calls:

### 3.1 Initial Doctors (8 Realistic Profiles)
1. **DOC-101**: `Dr. Alexander Hayes, MD, FACC` | Cardiology | Johns Hopkins Medicine | 16 yrs | Rating: 4.95 | Fee: $220 | Room: C-302 | Phone: +1 (555) 234-8801 | Status: Available
2. **DOC-102**: `Dr. Elena Rostova, MD, PhD` | Neurology | Stanford Neuroscience | 12 yrs | Rating: 4.90 | Fee: $250 | Room: N-108 | Phone: +1 (555) 345-9922 | Status: In Surgery
3. **DOC-103**: `Dr. Marcus Vance, MD` | Orthopedics & Trauma | Mayo Clinic | 14 yrs | Rating: 4.88 | Fee: $210 | Room: O-410 | Phone: +1 (555) 456-1183 | Status: Available
4. **DOC-104**: `Dr. Priya Sharma, MD, FAAP` | Pediatrics | Boston Children's Hospital | 9 yrs | Rating: 4.97 | Fee: $160 | Room: P-205 | Phone: +1 (555) 567-2274 | Status: Available
5. **DOC-105**: `Dr. Julian Beaumont, MD` | Oncology & Hematology | Memorial Sloan Kettering | 19 yrs | Rating: 4.92 | Fee: $275 | Room: O-503 | Phone: +1 (555) 678-3365 | Status: On Leave
6. **DOC-106**: `Dr. Amira Kalu, MD` | Emergency Medicine | Oxford Medical Sciences | 11 yrs | Rating: 4.91 | Fee: $190 | Room: ER-01 | Phone: +1 (555) 789-4456 | Status: Available
7. **DOC-107**: `Dr. Kenneth Sterling, MD` | Pulmonology & Critical Care | Cleveland Clinic | 15 yrs | Rating: 4.86 | Fee: $230 | Room: P-309 | Phone: +1 (555) 890-5547 | Status: Available
8. **DOC-108**: `Dr. Chloe Dupont, MD` | Dermatology & Laser Surgery | McGill University | 8 yrs | Rating: 4.89 | Fee: $175 | Room: D-112 | Phone: +1 (555) 901-6638 | Status: Off Duty

### 3.2 Initial Patients (10 Realistic Clinical Profiles)
1. **PAT-501**: `Eleanor Vance`, 64F, Blood: `O+`, Phone: +1 (555) 101-4433, Status: `Inpatient`, Ward: `ICU-Bed-03`, Doctor: `Dr. Alexander Hayes`, Diagnosis: `Acute Coronary Syndrome post-angioplasty`, Allergies: `Penicillin, NSAIDs`, Vitals: {HR: 76, BP: "128/82", Temp: 98.6, SpO2: 98, RR: 16}.
2. **PAT-502**: `David Chen`, 42M, Blood: `A+`, Phone: +1 (555) 202-5544, Status: `Inpatient`, Ward: `GEN-Bed-08`, Doctor: `Dr. Marcus Vance`, Diagnosis: `Closed tibial shaft fracture, scheduled ORIF`, Allergies: `None Known`, Vitals: {HR: 82, BP: "135/88", Temp: 99.1, SpO2: 99, RR: 18}.
3. **PAT-503**: `Aaliyah Hassan`, 8F, Blood: `B+`, Phone: +1 (555) 303-6655, Status: `Outpatient`, Ward: `N/A`, Doctor: `Dr. Priya Sharma`, Diagnosis: `Acute bronchitis with reactive airway`, Allergies: `Peanuts`, Vitals: {HR: 96, BP: "102/68", Temp: 100.4, SpO2: 97, RR: 22}.
4. **PAT-504**: `Lucas Moreau`, 57M, Blood: `AB+`, Phone: +1 (555) 404-7766, Status: `Inpatient`, Ward: `CARD-Bed-02`, Doctor: `Dr. Elena Rostova`, Diagnosis: `Transient Ischemic Attack (TIA) workup`, Allergies: `Sulfa drugs`, Vitals: {HR: 68, BP: "142/90", Temp: 98.4, SpO2: 98, RR: 15}.
5. **PAT-505**: `Grace O'Connor`, 31F, Blood: `O-`, Phone: +1 (555) 505-8877, Status: `Outpatient`, Ward: `N/A`, Doctor: `Dr. Chloe Dupont`, Diagnosis: `Severe atopic dermatitis exacerbation`, Allergies: `Latex`, Vitals: {HR: 72, BP: "115/75", Temp: 98.6, SpO2: 100, RR: 14}.
6. **PAT-506**: `Robert Tanaka`, 70M, Blood: `B-`, Phone: +1 (555) 606-9988, Status: `Inpatient`, Ward: `ONC-Bed-05`, Doctor: `Dr. Julian Beaumont`, Diagnosis: `Non-Hodgkin lymphoma cycle 3 restaging`, Allergies: `Ciprofloxacin`, Vitals: {HR: 78, BP: "118/76", Temp: 98.9, SpO2: 96, RR: 17}.
7. **PAT-507**: `Sophia Rodriguez`, 24F, Blood: `A-`, Phone: +1 (555) 707-1199, Status: `Emergency`, Ward: `ER-Bed-02`, Doctor: `Dr. Amira Kalu`, Diagnosis: `Acute appendicitis with localized peritonitis`, Allergies: `Codeine`, Vitals: {HR: 108, BP: "110/70", Temp: 101.8, SpO2: 99, RR: 20}.
8. **PAT-508**: `Benjamin Miller`, 51M, Blood: `O+`, Phone: +1 (555) 808-2200, Status: `Outpatient`, Ward: `N/A`, Doctor: `Dr. Kenneth Sterling`, Diagnosis: `Moderate persistent COPD exacerbation`, Allergies: `Aspirin`, Vitals: {HR: 88, BP: "132/84", Temp: 98.7, SpO2: 94, RR: 19}.
9. **PAT-509**: `Maya Lin`, 38F, Blood: `AB-`, Phone: +1 (555) 909-3311, Status: `Outpatient`, Ward: `N/A`, Doctor: `Dr. Alexander Hayes`, Diagnosis: `Supraventricular tachycardia (post-ablation check)`, Allergies: `None Known`, Vitals: {HR: 66, BP: "118/74", Temp: 98.6, SpO2: 99, RR: 14}.
10. **PAT-510**: `Henry Wallace`, 62M, Blood: `A+`, Phone: +1 (555) 010-4422, Status: `Discharged`, Ward: `N/A`, Doctor: `Dr. Marcus Vance`, Diagnosis: `Total knee arthroplasty (Discharged day 4)`, Allergies: `Iodine contrast`, Vitals: {HR: 72, BP: "122/80", Temp: 98.5, SpO2: 98, RR: 15}.

### 3.3 Initial Appointments (10 Items)
- **APT-801**: Eleanor Vance w/ Dr. Alexander Hayes | Cardiology | 2025-05-18 10:30 AM | Confirmed | Priority: Urgent
- **APT-802**: David Chen w/ Dr. Marcus Vance | Orthopedics | 2025-05-18 11:15 AM | Confirmed | Priority: Routine
- **APT-803**: Aaliyah Hassan w/ Dr. Priya Sharma | Pediatrics | 2025-05-18 02:00 PM | Confirmed | Priority: Routine
- **APT-804**: Lucas Moreau w/ Dr. Elena Rostova | Neurology | 2025-05-18 03:30 PM | Pending | Priority: Urgent
- **APT-805**: Grace O'Connor w/ Dr. Chloe Dupont | Dermatology | 2025-05-19 09:00 AM | Confirmed | Priority: Routine
- **APT-806**: Sophia Rodriguez w/ Dr. Amira Kalu | Emergency | 2025-05-19 10:00 AM | Confirmed | Priority: Emergency
- **APT-807**: Benjamin Miller w/ Dr. Kenneth Sterling | Pulmonology | 2025-05-19 11:30 AM | Pending | Priority: Routine
- **APT-808**: Maya Lin w/ Dr. Alexander Hayes | Cardiology | 2025-05-20 01:15 PM | Confirmed | Priority: Routine
- **APT-809**: Henry Wallace w/ Dr. Marcus Vance | Orthopedics | 2025-05-20 03:00 PM | Completed | Priority: Routine
- **APT-810**: Robert Tanaka w/ Dr. Julian Beaumont | Oncology | 2025-05-21 10:00 AM | Cancelled | Priority: Routine

### 3.4 Initial Wards & Bed Occupancy
- **WARD-ICU**: Intensive Care Unit (Floor 3) | 10 Total Beds | 7 Occupied (70% Occupancy)
- **WARD-GEN**: General Medicine Ward (Floor 2) | 30 Total Beds | 22 Occupied (73% Occupancy)
- **WARD-CARD**: Cardiology Care Unit (CCU) (Floor 4) | 16 Total Beds | 13 Occupied (81% Occupancy)
- **WARD-ORTHO**: Orthopedics & Trauma (Floor 2 Wing B) | 20 Total Beds | 14 Occupied (70% Occupancy)
- **WARD-PEDS**: Pediatric Wing (Floor 1 Wing C) | 15 Total Beds | 8 Occupied (53% Occupancy)
- **WARD-ER**: Emergency Observation Bay (Ground Floor) | 12 Total Beds | 9 Occupied (75% Occupancy)

---

## 4. Online Live API Integration Contract (Enrichment Directive)

In accordance with Straw Hat Crew priority specifications, the Builder must provide a live external sync mechanism that connects to `https://dummyjson.com/users?limit=6&select=firstName,lastName,image,age,gender,bloodGroup,phone,email`.

### 4.1 Sync Logic
1. When user clicks `#btn-sync-external-patients`, trigger `syncExternalPatients()`.
2. Wrap `fetch()` with `AbortSignal.timeout(5000)` inside a try/catch block.
3. Map fetched data into `PatientRecord` format:
   - `id`: `"PAT-" + (1000 + item.id)`
   - `name`: `${item.firstName} ${item.lastName}`
   - `age`: `item.age`
   - `gender`: `capitalize(item.gender)`
   - `bloodGroup`: `item.bloodGroup`
   - `phone`: `item.phone`
   - `email`: `item.email`
   - `avatarUrl`: `item.image`
   - `admissionStatus`: `"Outpatient"`
   - `vitals`: Generate realistic vitals (BP: 120/80, HR: 70-85, Temp: 98.6, SpO2: 98)
4. Append non-duplicate patients to `state.patients`.
5. Dispatch visual feedback via `#toast-container` ("Synced 6 online verified clinical patient records from global directory").
6. If the request fails or times out, gracefully preserve local seed state and notify the user with a fallback notification.

---

## 5. UI Layout, Navigation & Exact DOM Contract

The app consists of:
- **Top Emergency Alert Banner:** `#emergency-ticker-bar` (dismissible/triggerable code-blue alert)
- **Left Navigation Sidebar:** `#app-sidebar` with Brand logo, navigation tabs, quick status indicator, and live time clock.
- **Top Utility Header:** `#top-header` with global search, emergency trigger button, quick Add actions dropdown/buttons, and system operator profile.
- **Main Viewport Area:** `#main-content` containing 7 distinct views switched dynamically via class `.active-view` or `hidden` attribute.
- **Modals & Drawers Container:** `#modal-overlay` with explicit modal bodies for Patient Registration, Appointment Booking, New Doctor, Patient Details EHR Drawer, and Invoice/Prescription view.
- **Toast Notifications Container:** `#toast-container`.

### 5.1 Exact Element IDs Specification (Zoro Implementation Checklist)

#### Global Header & Controls
- `#emergency-ticker-bar`: Red clinical triage header with `#ticker-text`, `#btn-resolve-emergency`, `#btn-trigger-emergency`
- `#app-sidebar`: Sidebar container
- `#nav-tab-dashboard`: Tab button for Dashboard View
- `#nav-tab-doctors`: Tab button for Doctors View
- `#nav-tab-patients`: Tab button for Patients View
- `#nav-tab-appointments`: Tab button for Appointments View
- `#nav-tab-wards`: Tab button for Wards & Bed View
- `#nav-tab-pharmacy`: Tab button for Pharmacy & Rx View
- `#nav-tab-billing`: Tab button for Invoices & Billing View
- `#global-search-input`: Universal real-time search input
- `#btn-quick-new-patient`: Header CTA to open Add Patient Modal
- `#btn-quick-book-appointment`: Header CTA to open Book Appointment Modal
- `#btn-quick-add-doctor`: Header CTA to open Add Doctor Modal
- `#btn-sync-external-patients`: Button to pull external patient data from API
- `#system-clock-display`: Live rendering of `HH:MM:SS AM/PM | DD MMM YYYY`

#### Tab Views (Container IDs)
1. `#view-dashboard`: Main KPI summary, active charts, today's schedule, triage table.
2. `#view-doctors`: Directory of doctors with specialty filters, search, and availability badges.
3. `#view-patients`: Master patient directory with vitals overview, admission badges, filter by status.
4. `#view-appointments`: Interactive timeline/table with status filters, reschedule, cancel, and new booking.
5. `#view-wards`: Ward floor plans, occupancy meters, bed status toggles (occupied/vacant).
6. `#view-pharmacy`: Electronic prescriptions, pending/dispensed pills, new prescription form.
7. `#view-billing`: Financial ledger, unpaid invoice alerts, generate bill, printable PDF/receipt generator.

#### Dashboard KPI Element IDs
- `#kpi-total-patients`: Displays total registered patients count
- `#kpi-active-doctors`: Displays doctors currently on duty
- `#kpi-today-appointments`: Displays today's scheduled appointments count
- `#kpi-bed-occupancy`: Displays current hospital bed occupancy percentage
- `#kpi-emergency-cases`: Displays count of active emergency admissions
- `#dashboard-recent-appointments-table`: Tbody for upcoming appointments
- `#dashboard-critical-vitals-list`: Container of patients with abnormal vitals requiring triage
- `#dashboard-ward-quick-meter`: Ward occupancy progress bars

#### Doctor View Element IDs
- `#doctors-grid`: Dynamic container for doctor cards
- `#filter-doctor-dept`: `<select>` or pill container for filtering by department
- `#filter-doctor-status`: `<select>` to filter Available, In Surgery, On Leave
- `#search-doctors-input`: Text input for doctor search
- `#btn-open-doctor-modal`: Open Doctor Add Modal

#### Patients View Element IDs
- `#patients-table-body`: `<tbody>` for list of patients
- `#search-patients-input`: Search by patient name, ID, phone, or diagnosis
- `#filter-patient-status`: Filter by All, Inpatient, Outpatient, Emergency, Discharged
- `#filter-patient-blood`: Filter by blood group
- `#btn-open-patient-modal`: Open New Patient Registration Modal
- `#btn-export-patients-csv`: Export visible patient list as CSV file

#### Appointments View Element IDs
- `#appointments-table-body`: `<tbody>` for appointments list
- `#search-appointments-input`: Search appointments
- `#filter-appointment-status`: Filter Confirmed, Pending, Completed, Cancelled
- `#filter-appointment-date`: Date picker to filter specific day
- `#btn-open-appointment-modal`: Open Book Appointment Modal

#### Wards & Beds View Element IDs
- `#wards-summary-grid`: Grid displaying cards for ICU, General, Cardiology, Pediatrics, etc.
- `#ward-beds-detail-container`: Visual matrix of beds (Bed #, Patient name, Oxygen support, Vacate/Assign CTA)
- `#select-active-ward`: Dropdown to toggle which ward's bed layout is inspected

#### Pharmacy View Element IDs
- `#prescriptions-table-body`: List of electronic prescriptions
- `#search-pharmacy-input`: Search medication or patient name
- `#btn-open-prescription-modal`: Issue New Prescription CTA

#### Billing View Element IDs
- `#invoices-table-body`: Ledger of patient bills
- `#billing-total-revenue`: Metric total collected
- `#billing-pending-dues`: Metric total pending
- `#btn-open-invoice-modal`: Create New Invoice CTA

#### Shared Modals & Drawers
- `#modal-backdrop`: Overlay backdrop element (click to dismiss)
- `#modal-add-patient`: Dialog for patient registration
  - Input IDs: `#inp-pat-name`, `#inp-pat-age`, `#inp-pat-gender`, `#inp-pat-blood`, `#inp-pat-phone`, `#inp-pat-email`, `#inp-pat-doctor`, `#inp-pat-status`, `#inp-pat-diagnosis`, `#inp-pat-allergies`, `#btn-submit-patient`, `#btn-close-patient-modal`
- `#modal-book-appointment`: Dialog for appointment scheduling
  - Input IDs: `#inp-apt-patient`, `#inp-apt-doctor`, `#inp-apt-datetime`, `#inp-apt-type`, `#inp-apt-priority`, `#inp-apt-symptoms`, `#btn-submit-appointment`, `#btn-close-appointment-modal`
- `#modal-add-doctor`: Dialog for onboarding new physician
  - Input IDs: `#inp-doc-name`, `#inp-doc-specialty`, `#inp-doc-dept`, `#inp-doc-qualification`, `#inp-doc-experience`, `#inp-doc-fee`, `#inp-doc-room`, `#inp-doc-phone`, `#inp-doc-avatar`, `#btn-submit-doctor`, `#btn-close-doctor-modal`
- `#modal-patient-details`: Full EHR slide-over drawer for patient inspection
  - Element IDs: `#detail-pat-name`, `#detail-pat-id`, `#detail-pat-avatar`, `#detail-pat-age-gender`, `#detail-pat-blood`, `#detail-pat-phone`, `#detail-pat-doctor`, `#detail-pat-diagnosis`, `#detail-pat-allergies`, `#detail-pat-vital-hr`, `#detail-pat-vital-bp`, `#detail-pat-vital-temp`, `#detail-pat-vital-spo2`, `#detail-pat-history-list`, `#btn-close-patient-details`, `#btn-print-patient-summary`, `#btn-admit-discharge-toggle`
- `#modal-view-invoice`: Printable invoice receipt modal
  - Element IDs: `#inv-modal-id`, `#inv-modal-patient`, `#inv-modal-date`, `#inv-modal-doc-fee`, `#inv-modal-fac-fee`, `#inv-modal-med-fee`, `#inv-modal-tax`, `#inv-modal-total`, `#inv-modal-status-badge`, `#btn-print-invoice`, `#btn-mark-invoice-paid`, `#btn-close-invoice-modal`
- `#toast-container`: Fixed bottom-right container for notifications

---

## 6. Functional Interactions & Event Signatures

Builder Zoro must implement active, error-free event listeners for every single interactive control. No dead buttons allowed.

```javascript
// Navigation tab switching
function switchTab(targetTabId) { ... }

// Doctors filtering & search
function renderDoctors(searchQuery = '', department = 'all', status = 'all') { ... }

// Patient management
function renderPatients(query = '', status = 'all', blood = 'all') { ... }
function openPatientDetailsModal(patientId) { ... }
function handleAddPatientSubmit(event) { ... }
function togglePatientAdmissionStatus(patientId) { ... }
function exportPatientsToCSV() { ... }

// Appointment management
function renderAppointments(query = '', status = 'all', date = '') { ... }
function handleBookAppointmentSubmit(event) { ... }
function updateAppointmentStatus(appointmentId, newStatus) { ... }
function cancelAppointment(appointmentId) { ... }

// Wards management
function renderWards(wardId) { ... }
function toggleBedOccupancy(wardId, bedNumber) { ... }

// Billing management
function renderBilling() { ... }
function handleCreateInvoice(event) { ... }
function openInvoiceModal(invoiceId) { ... }
function markInvoicePaid(invoiceId) { ... }
function printInvoiceReceipt(invoiceId) { ... }

// Pharmacy & Prescriptions
function renderPharmacy() { ... }
function handleAddPrescriptionSubmit(event) { ... }
function markPrescriptionDispensed(rxId) { ... }

// Online API Synchronization
async function syncExternalPatients() { ... }

// Emergency Triage Alarm System
function toggleEmergencyCodeBlue() { ... }

// Toast messaging utility
function showToast(message, type = 'info' | 'success' | 'warning' | 'danger') { ... }
```

---

## 7. Smart Skills & Specialized Features

### 7.1 Algorithmic Real-Time ECG Vitals Monitor (Creative & Visual Canvas)
Inside the Patient Details EHR Drawer and the Dashboard Critical Triage Widget, implement a continuous HTML5 `<canvas id="ecg-canvas">` waveform generator simulating a live medical telemetry cardiac monitor (P-Q-R-S-T wave pulse with dynamic BPM adjustment according to the selected patient's heart rate).

### 7.2 DOCX & Printable Clinical Discharge Summary
Provide an export mechanism `#btn-print-patient-summary` that formats an authentic Clinical Summary document (Patient demographics, physician notes, prescription list, vitals chart, diagnostic stamp) ready for native browser printing or save-as-PDF.

### 7.3 Performance Optimization Standard
- Zero cumulative layout shift (CLS).
- Virtualized or efficient batch DOM updates via `DocumentFragment`.
- Debounced search queries (`150ms`).
- Persistent state updates safely wrapped in `try/catch` with fallback to in-memory store.

---

## 8. Verification & Acceptance Checklist for Zoro (Builder)

- [ ] All 7 tab views switch seamlessly with active styling on the corresponding sidebar button.
- [ ] No placeholder text, no "Lorem Ipsum", no "Item 1" anywhere.
- [ ] Emergency Code Blue alert can be triggered and resolved with persistent UI feedback.
- [ ] Adding a new patient immediately reflects in the Patients table, Dashboard metrics, and Doctor's patient counter.
- [ ] Booking an appointment enforces doctor availability, creates an appointment record, and updates the timeline.
- [ ] Filter pills and search bars work synergistically (e.g., searching by doctor name while cardiology department is selected).
- [ ] Online Sync button pulls 6 real patients from `https://dummyjson.com/users` with graceful error handling and toast notice.
- [ ] Patient EHR drawer shows animated ECG cardiac canvas matching patient's heart rate.
- [ ] Invoice receipt modal calculates correct subtotal, taxes, and provides a working Print function.
- [ ] All state mutations persist to `localStorage`.
- [ ] 100% responsive down to tablet and mobile screens.

---
*Ready for Builder execution. Proceed to code implementation.*
