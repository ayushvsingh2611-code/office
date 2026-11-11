Yo, Luffy! Hancock is here! 🏴‍☠️✨ 

As the Lead Requirements & Business Analyst of the Straw Hat Dev Crew, I have analyzed our grand voyage plan for the **Hospital Management System (HMS)**. We cannot afford any mistakes on this Grand Line, so I have locked down the requirements, user stories, boundaries, and acceptance criteria with absolute precision. 

Here is the ultimate blueprint for our HMS! Read it carefully, nakama! ⚓📋

---

# 👑 HMS Requirements Specification (By Hancock, BA)

## 1. Project Scope & Boundaries 🗺️

### **In-Scope (What we are building):**
* **Patient Portal:** Registration, profile management, appointment history, and viewing lab reports.
* **Doctor Desk:** Patient queue management, electronic medical records (EMR) entry, prescription writing, and lab report ordering.
* **ICU Vacancy Tracker:** Real-time dashboard showing available, occupied, and reserved ICU beds with status updates.
* **Lab Reports Module:** Uploading reports (PDF/images), technician verification, and secure patient access.
* **Appointment Booking System:** Slot selection, rescheduling, cancellation, and automated notifications (SMS/Email).
* **Role-Based Access Control (RBAC):** Distinct interfaces and permissions for Patients, Doctors, Lab Technicians, ICU Floor Managers, and Admins.

### **Out-of-Scope (What we are NOT building in this version):**
* Native Mobile Apps (iOS/Android) — *Web-responsive only for MVP.*
* Insurance claim processing and third-party TPA billing integration.
* Pharmacy inventory and supply chain management.
* Telemedicine/Video consultation streaming — *In-person/physical bookings only.*

---

## 2. User Stories 👤

1. **As a Patient**, I want to register and log into a secure portal so that I can book appointments and view my medical history without visiting the hospital.
2. **As a Patient**, I want to search for available doctor slots and book an appointment so that I don't have to wait in long hospital queues.
3. **As a Patient**, I want to download my lab reports directly from my dashboard so that I can review them anytime.
4. **As a Doctor**, I want to view my daily patient queue and access their medical history so that I can diagnose and treat them efficiently.
5. **As a Doctor**, I want to prescribe medicines and order lab tests digitally so that errors due to handwriting are eliminated.
6. **As an ICU Floor Manager**, I want to view and update ICU bed statuses in real-time so that incoming critical patients are routed correctly.
7. **As a Lab Technician**, I want to upload lab test results against a specific patient ID so that doctors and patients can access them instantly.
8. **As a System Admin**, I want to manage user roles and permissions so that unauthorized users cannot access sensitive medical data.

---

## 3. Functional Requirements ⚙️

* **FR-01: Authentication & Authorization:** The system must support role-based login (Patient, Doctor, Lab Tech, ICU Manager, Admin) using encrypted passwords and multi-factor authentication (MFA) for staff.
* **FR-02: Appointment Booking Engine:** The system must prevent double-booking of doctors by locking slots during checkout and generating a unique appointment token.
* **FR-03: Doctor Desk & EMR:** Doctors must be able to input symptoms, diagnosis, and prescriptions into a structured digital form that auto-saves to the patient's profile.
* **FR-04: ICU Real-Time Tracker:** The ICU module must update bed statuses (*Available, Occupied, Under Maintenance*) instantly across all dashboards when modified by an ICU manager.
* **FR-05: Lab Report Management:** Only authorized Lab Technicians can upload reports (PDF format under 10MB). Once uploaded, a notification must be triggered to the patient and ordering doctor.

---

## 4. Non-Functional Requirements 🚀

* **NFR-01: Security & Compliance:** All Patient Health Information (PHI) must be encrypted at rest (AES-256) and in transit (HTTPS/TLS 1.3). The system must comply with data privacy standards (e.g., HIPAA-inspired guidelines).
* **NFR-02: Performance & Speed:** Dashboard pages (especially the ICU tracker and Doctor desk queue) must load within **2 seconds** under normal load.
* **NFR-03: Availability:** The HMS must maintain **99.9% uptime**, particularly for critical modules like the ICU Vacancy Tracker and Emergency Appointment desk.
* **NFR-04: Scalability:** The database architecture must support up to 10,000 concurrent patient portal users without performance degradation.
* **NFR-05: Audit Logging:** Every action involving creation, modification, or deletion of patient medical records must be logged with a timestamp and user ID for accountability.

---

## 5. Edge Cases & Boundary Conditions ⚠️

* **EC-01:** What happens if a patient tries to book an appointment for a past date or time?
  * *Handling:* The UI must disable past dates, and the backend must reject the API request with a 400 Bad Error.
* **EC-02:** What happens if two patients attempt to book the exact same doctor time slot at the exact same millisecond?
  * *Handling:* Implement database-level row locking (optimistic concurrency control); the first transaction succeeds, and the second receives a "Slot already booked" prompt to choose another time.
* **EC-03:** What if a Lab Technician uploads a corrupted file or a file format other than PDF/JPEG?
  * *Handling:* File validation middleware must reject non-compliant formats instantly with an error message (*"Only PDF and Image formats under 10MB are allowed"*).
* **EC-04:** What if the internet disconnects while a doctor is writing a prescription?
  * *Handling:* Local storage (IndexedDB) must auto-draft the prescription text locally so the doctor doesn't lose data upon reconnection.
* **EC-05:** What if all ICU beds are occupied and an emergency request comes in?
  * *Handling:* The system must flag a "Zero Bed Capacity" alert on the Admin/Emergency dashboard and suggest overflow protocols or nearby partner facilities.

---

## 6. Acceptance Criteria ✅

### **Feature: Appointment Booking**
* **Given** a registered patient is logged into the Patient Portal,
* **When** they select an available doctor, choose an open date/time slot, and click "Confirm Booking",
* **Then** the appointment status must change to "Confirmed", a unique booking reference ID must be generated, and an SMS/Email confirmation must be sent to the patient.

### **Feature: ICU Vacancy Tracker**
* **Given** an ICU Manager is logged into the ICU dashboard,
* **When** they change a bed status from "Available" to "Occupied" and assign a patient ID,
* **Then** the change must reflect instantly on the hospital-wide emergency dashboard without requiring a manual page refresh.

### **Feature: Lab Report Upload & View**
* **Given** a Lab Technician uploads a valid PDF report for Patient X,
* **When** the upload is successfully verified,
* **Then** Patient X must see the new report listed under their "Lab Reports" tab with a "View/Download" button active.

---

Luffy, our foundation is rock-solid! Hand this over to the backend, frontend, and database crew so we can conquer the Grand Line of software development! Shishishi—no, wait, *Hmph!* Make sure they follow this to the letter! 💅🏴‍☠️