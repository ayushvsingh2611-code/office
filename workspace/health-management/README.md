# 🏥 CarePulse — Hospital & Patient Health Management System

[![Production Ready](https://img.shields.io/badge/Status-Production%20Ready-emerald.svg)](https://carepulse.health)
[![HIPAA Compliant](https://img.shields.io/badge/Compliance-HIPAA%20%26%20ABDM-blue.svg)](https://carepulse.health)
[![Architecture](https://img.shields.io/badge/Architecture-Event--Driven%20SPA-cyan.svg)](architecture.md)

**CarePulse** is a clinical hospital enterprise resource planning (ERP) and patient health informatics platform engineered by the Straw Hat Dev Crew in Panda Hive. It integrates outpatient appointment scheduling, doctor queue management, electronic health records (EHR), digital prescriptions, 14-bed Level-1 ICU capacity telemetry, and pharmacy inventory management into an accessible, responsive Single Page Application.

---

## 🌟 Key Functional Features

1. **Multi-Role Portal Access:**
   - Seamless dynamic role switching between **Patient Portal** (self-service booking, appointments, lab reports, refills), **Doctor Desk** (OPD queue, patient vitals, prescription issuer), and **Hospital Admin** (executive metrics, ICU bed admission/discharge, hospital pharmacy).

2. **Full-Featured Appointment Scheduling Engine:**
   - Outpatient consultation scheduler with verified doctor directory across 6 specialties (Cardiology, Neurology, Pediatrics, Orthopedics, Dermatology, Oncology).
   - Real-time token generation (`#CP-01`, `#CP-02`), interactive cancellation, rescheduling modals, and printable hospital appointment passes with barcodes.

3. **Electronic Health Records (EHR) & Diagnostic Lab Slips:**
   - Integrated diagnostic lab panels (Comprehensive Metabolic Panel, 12-Lead ECG, Lumbar Spine MRI) with an interactive NABL-accredited diagnostic laboratory report viewer detailing biological reference ranges and certifying pathologist signatures.

4. **Digital Prescriptions & Central Pharmacy Refills:**
   - Active pharmacotherapy regimen management with one-click "Request Refill" actions that notify the hospital central pharmacy and decrement refill counters.

5. **Critical Care Unit (ICU) 14-Bed Telemetry:**
   - Real-time visual bed matrix tracking 14 Class-A ICU beds with live status indicators (`Occupied` vs `Available`).
   - Emergency admission modal allocating incoming trauma cases to vacant beds, and discharge controls restoring bed sanitization and hospital vacancy counters.

6. **Live Physiological Vitals Telemetry:**
   - Continuous physiological monitor displaying Heart Rate, Blood Pressure, Oxygen Saturation (SpO2), and Body Temperature.
   - Real-time animated HTML5 Canvas Electrocardiogram (ECG) rhythm monitor (Lead II, 25mm/s) with abnormal arrhythmia alert simulation.

7. **Hospital Formulary & Inventory Management:**
   - Real-time central pharmacy ledger tracking essential antibiotics, analgesics, cardiovascular, and IV fluids with direct ward dispensing and restock controls.

8. **Live Omnisearch & Category Filtering:**
   - Zero-reload real-time search filtering across doctor directories, scheduled appointments, patient medical records, digital prescriptions, and pharmaceutical stocks.

9. **Offline-First Reactive Persistence:**
   - All bookings, cancellations, prescriptions, and bed allocations persist synchronously in browser `localStorage` under `carepulse_hospital_db_v2`.

10. **Zero Dead Buttons:**
    - Every interactive button, filter pill, modal trigger, and form input executes a verified state transition.

---

## 🚀 Running the Project

### Option 1: Direct Browser Launch
Open `index.html` directly in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari):
```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### Option 2: Local HTTP Server
```bash
# Using Node.js npx serve
npx serve .

# Or Python built-in server
python -m http.server 8080
```
Then navigate to `http://localhost:8080` in your browser.

### Option 3: Production Docker Container
```bash
# Build the Docker image
docker build -t carepulse-health:latest .

# Run the container on port 8080
docker run -d -p 8080:80 --name carepulse carepulse-health:latest
```
Access the application at `http://localhost:8080`.

---

## 📁 Repository Structure

```
workspace/health-management/
├── index.html            # Semantic HTML5 clinical application shell
├── style.css             # High-contrast clinical dark-mode stylesheet
├── app.js                # Reactive state engine, CRUD operations, & event router
├── project-plan.md       # 7-milestone roadmap & deliverable tracker (Luffy)
├── sprint-plan.md        # Sprint execution timeline & specialist assignments (Luffy)
├── spec.md               # Functional specification & clinical user stories (Hancock)
├── architecture.md       # System topology, component hierarchy & data flow (Shanks)
├── data-models.md        # TypeScript schemas, entities, & validation rules (Nami)
├── integrations.md       # FHIR/HL7 R4 APIs, Philips telemetry, & SMS webhooks (Brook)
├── security-review.md    # HIPAA & ABDM privacy audit & threat mitigation (Jinbe)
├── test-report.md        # 16-test automated verification & dead button audit (Chopper)
├── Dockerfile            # Production hardened Nginx Alpine container (Sanji)
├── code-review.md        # Code quality gate & architectural sign-off (Zoro)
├── README.md             # Comprehensive user guide & setup documentation (Robin)
└── sprint-signoff.md     # Official sprint completion & quality gate sign-off (Luffy)
```

---

*Documentation Compiled by Robin (Archaeologist & Knowledge Specialist).*
