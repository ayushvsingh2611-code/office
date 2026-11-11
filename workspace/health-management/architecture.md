# 📐 System Topology & Clinical Architecture Spec — CarePulse Health Management
**System Architect:** Shanks (Lead System Architect)
**System Scope:** "Enterprise Hospital Operations, EHR, Telemetry & Scheduling Suite"

---

## 1. High-Level Architecture Topology

The application is architected as an ultra-reliable, high-performance, event-driven Single Page Clinical Application (SPCA) engineered with decoupled tiers:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION TIER                               │
│  - Semantic HTML5 Clinical Shell (Accessible, ARIA Roles, High-Contrast)│
│  - Responsive Clinical CSS System (Dark Mode Navy #070d19, Slate #0f172a)│
│  - Real-Time HTML5 Canvas ECG Electrocardiogram Telemetry Waveform     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ DOM Events & User Interactions
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        APPLICATION LOGIC TIER                          │
│  - Global Event Bus & Action Delegation Router                         │
│  - Role State Controller (Patient Portal, Doctor Desk, Hospital Admin) │
│  - Appointment Scheduling & Token Allocation Engine                    │
│  - Electronic Health Records (EHR) & Diagnostic Lab Serializer         │
│  - ICU Bed Allocation & Critical Care Telemetry Controller             │
│  - Pharmacotherapy Refill & Ward Requisitioning Engine                 │
│  - Omnisearch Live Tokenizer & Substring Multi-Table Filter            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Synchronous Reactive State Mutation
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       PERSISTENCE & STORAGE TIER                       │
│  - CarePulse LocalStorage Reactive Cache (`carepulse_hospital_db_v2`)  │
│  - Snapshot Rehydration & Default Seed Healing                         │
│  - Offline-first ACID-like JSON Persistence                            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Containerized Deployment
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       DEPLOYMENT & HOSTING TIER                        │
│  - Multi-stage Nginx Alpine Container (Port 80)                        │
│  - HTTP Caching, Gzip/Brotli Compression, Zero-Leak Security Headers   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Hierarchy & Interface Contracts

1. **Emergency Telemetry Ticker:**
   - Visual banner broadcasting 24/7 National Emergency Hotline, Live ICU Vacancy count, and On-Duty Specialist headcount.

2. **Primary Navigation Bar:**
   - Brand identity with animated heartbeat pulse.
   - Tri-role switcher buttons (`patient` / `doctor` / `admin`).
   - Omnisearch input with live substring matching across all datasets.
   - Header action pills: Quick Emergency Admit, Appointments counter badge, and Active User context pill.

3. **Navigation Tab Bar:**
   - 8 synchronized functional tabs with animated active indicators and real-time badge counters:
     1. `tab-overview`: KPI stats, live vitals monitor with canvas ECG, and specialist doctor directory.
     2. `tab-book`: Validated outpatient consultation booking form.
     3. `tab-appointments`: Comprehensive appointment table with status badges (`Confirmed`, `In-Progress`, `Completed`, `Cancelled`) and actions.
     4. `tab-records`: Patient EHR lab diagnostic panels with NABL report inspection modal.
     5. `tab-prescriptions`: Digital prescriptions list with instant pharmacy refill triggers.
     6. `tab-doctor-desk`: Attending clinician consultation queue and prescription formulation form.
     7. `tab-icu`: 14-bed Level-1 ICU bed matrix with emergency patient admission and discharge controls.
     8. `tab-pharmacy`: Central hospital drug formulary with dispense and restock actions.

4. **Modals Management Layer:**
   - `modal-booking`: Fast doctor consultation scheduler.
   - `modal-report`: NABL laboratory slip viewer with reference intervals and pathologist signature.
   - `modal-slip`: Formatted hospital appointment pass with simulated barcode.
   - `modal-reschedule`: Date & time slot adjustment modal.
   - `modal-admit`: Emergency trauma patient bed allocation modal.

5. **Toast Notification System (`phToast`):**
   - Fixed overlay rendering accessible, animated status toasts with auto-dismiss and queue management.

---

## 3. Data Flow & State Lifecycle

```
[User Action: Book Appointment]
              │
              ▼
[Validation: Check Doctor, Name, Phone, Future Date, Slot, Symptoms]
              │ (Pass)
              ▼
[State Mutation: Prepend to state.appointments with Token CP-XX]
              │
              ▼
[Storage Sync: localStorage.setItem('carepulse_hospital_db_v2', JSON.stringify(state))]
              │
              ▼
[UI Reflow: Update Appointments Table, Refresh Doctor Slots, Update Badge Counters]
              │
              ▼
[Feedback: Trigger phToast('Appointment confirmed with Dr. Sarah Jenkins!', '🎉')]
              │
              ▼
[Tab Navigation: Switch to tab-appointments]
```

---

*Architecture Approved by Shanks (Lead System Architect).*
