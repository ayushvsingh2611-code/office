/**
 * AegisCare Enterprise Hospital & Clinical Management System (HMS)
 * Complete Production-Grade Clinical Application Script
 */

// 1. Initial State & High-Fidelity Clinical Mock Data (ISO/HL7 Standards)
const INITIAL_DOCTORS = [
  {
    id: "DOC-101",
    name: "Dr. Alexander Hayes, MD, FACC",
    specialty: "Cardiology",
    department: "Cardiology",
    qualification: "Johns Hopkins Medicine",
    experienceYears: 16,
    rating: 4.95,
    consultationFee: 220,
    roomNumber: "C-302",
    phoneNumber: "+1 (555) 234-8801",
    status: "Available",
    patientsCount: 42,
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&h=120&fit=crop&crop=faces"
  },
  {
    id: "DOC-102",
    name: "Dr. Elena Rostova, MD, PhD",
    specialty: "Neurology",
    department: "Neurology",
    qualification: "Stanford Neuroscience",
    experienceYears: 12,
    rating: 4.90,
    consultationFee: 250,
    roomNumber: "N-108",
    phoneNumber: "+1 (555) 345-9922",
    status: "In Surgery",
    patientsCount: 29,
    avatar: "https://images.unsplash.com/photo-1594824813572-c200dd04044a?w=120&h=120&fit=crop&crop=faces"
  },
  {
    id: "DOC-103",
    name: "Dr. Marcus Vance, MD",
    specialty: "Orthopedics",
    department: "Orthopedics & Trauma",
    qualification: "Mayo Clinic College of Medicine",
    experienceYears: 14,
    rating: 4.88,
    consultationFee: 210,
    roomNumber: "O-410",
    phoneNumber: "+1 (555) 456-1183",
    status: "Available",
    patientsCount: 38,
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&h=120&fit=crop&crop=faces"
  },
  {
    id: "DOC-104",
    name: "Dr. Priya Sharma, MD, FAAP",
    specialty: "Pediatrics",
    department: "Pediatrics",
    qualification: "Boston Children's Hospital",
    experienceYears: 9,
    rating: 4.97,
    consultationFee: 160,
    roomNumber: "P-205",
    phoneNumber: "+1 (555) 567-2274",
    status: "Available",
    patientsCount: 51,
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=120&fit=crop&crop=faces"
  },
  {
    id: "DOC-105",
    name: "Dr. Julian Beaumont, MD",
    specialty: "Oncology",
    department: "Oncology & Hematology",
    qualification: "Memorial Sloan Kettering",
    experienceYears: 19,
    rating: 4.92,
    consultationFee: 275,
    roomNumber: "O-503",
    phoneNumber: "+1 (555) 678-3365",
    status: "On Leave",
    patientsCount: 34,
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=120&h=120&fit=crop&crop=faces"
  },
  {
    id: "DOC-106",
    name: "Dr. Amira Kalu, MD",
    specialty: "Emergency Medicine",
    department: "Emergency Trauma",
    qualification: "Oxford Medical Sciences",
    experienceYears: 11,
    rating: 4.91,
    consultationFee: 190,
    roomNumber: "ER-01",
    phoneNumber: "+1 (555) 789-4456",
    status: "Available",
    patientsCount: 65,
    avatar: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=120&h=120&fit=crop&crop=faces"
  },
  {
    id: "DOC-107",
    name: "Dr. Kenneth Sterling, MD",
    specialty: "Pulmonology",
    department: "Pulmonology & Critical Care",
    qualification: "Cleveland Clinic",
    experienceYears: 15,
    rating: 4.86,
    consultationFee: 230,
    roomNumber: "P-309",
    phoneNumber: "+1 (555) 890-5547",
    status: "Available",
    patientsCount: 27,
    avatar: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=120&h=120&fit=crop&crop=faces"
  },
  {
    id: "DOC-108",
    name: "Dr. Chloe Dupont, MD",
    specialty: "Dermatology",
    department: "Dermatology",
    qualification: "McGill University Health Centre",
    experienceYears: 8,
    rating: 4.89,
    consultationFee: 175,
    roomNumber: "D-112",
    phoneNumber: "+1 (555) 901-6638",
    status: "Off Duty",
    patientsCount: 31,
    avatar: "https://images.unsplash.com/photo-1594824813572-c200dd04044a?w=120&h=120&fit=crop&crop=faces"
  }
];

const INITIAL_PATIENTS = [
  {
    id: "PAT-501",
    name: "Eleanor Vance",
    age: 64,
    gender: "Female",
    bloodGroup: "O+",
    phone: "+1 (555) 101-4433",
    status: "Inpatient",
    ward: "ICU-Bed-03",
    assignedDoctorId: "DOC-101",
    assignedDoctorName: "Dr. Alexander Hayes",
    diagnosis: "Acute Coronary Syndrome post-angioplasty",
    admissionDate: "2025-05-14",
    allergies: ["Penicillin", "NSAIDs"],
    vitals: { hr: 76, bp: "128/82", temp: 98.6, spo2: 98, rr: 16 },
    history: ["Hypertension diagnosed 2018", "Stent placement (LAD) May 2025", "Daily Aspirin 81mg"]
  },
  {
    id: "PAT-502",
    name: "David Chen",
    age: 42,
    gender: "Male",
    bloodGroup: "A+",
    phone: "+1 (555) 202-5544",
    status: "Inpatient",
    ward: "GEN-Bed-08",
    assignedDoctorId: "DOC-103",
    assignedDoctorName: "Dr. Marcus Vance",
    diagnosis: "Closed tibial shaft fracture, post ORIF",
    admissionDate: "2025-05-16",
    allergies: ["None Known"],
    vitals: { hr: 82, bp: "135/88", temp: 99.1, spo2: 99, rr: 18 },
    history: ["Motorcycle trauma", "No chronic illnesses", "Tetanus toxoid booster given"]
  },
  {
    id: "PAT-503",
    name: "Aaliyah Hassan",
    age: 8,
    gender: "Female",
    bloodGroup: "B+",
    phone: "+1 (555) 303-6655",
    status: "Outpatient",
    ward: "N/A",
    assignedDoctorId: "DOC-104",
    assignedDoctorName: "Dr. Priya Sharma",
    diagnosis: "Acute bronchitis with reactive airway",
    admissionDate: "2025-05-18",
    allergies: ["Peanuts"],
    vitals: { hr: 96, bp: "102/68", temp: 100.4, spo2: 97, rr: 22 },
    history: ["Mild seasonal asthma", "Albuterol inhaler prescribed", "Full childhood immunizations"]
  },
  {
    id: "PAT-504",
    name: "Lucas Moreau",
    age: 57,
    gender: "Male",
    bloodGroup: "AB+",
    phone: "+1 (555) 404-7766",
    status: "Inpatient",
    ward: "CARD-Bed-02",
    assignedDoctorId: "DOC-102",
    assignedDoctorName: "Dr. Elena Rostova",
    diagnosis: "Transient Ischemic Attack (TIA) neurological workup",
    admissionDate: "2025-05-17",
    allergies: ["Sulfa drugs"],
    vitals: { hr: 68, bp: "142/90", temp: 98.4, spo2: 98, rr: 15 },
    history: ["Hyperlipidemia", "Carotid ultrasound scheduled", "Daily Atorvastatin 40mg"]
  },
  {
    id: "PAT-505",
    name: "Grace O'Connor",
    age: 31,
    gender: "Female",
    bloodGroup: "O-",
    phone: "+1 (555) 505-8877",
    status: "Outpatient",
    ward: "N/A",
    assignedDoctorId: "DOC-108",
    assignedDoctorName: "Dr. Chloe Dupont",
    diagnosis: "Severe atopic dermatitis exacerbation",
    admissionDate: "2025-05-18",
    allergies: ["Latex"],
    vitals: { hr: 72, bp: "115/75", temp: 98.6, spo2: 100, rr: 14 },
    history: ["Eczema since childhood", "Dupilumab biologic treatment evaluation"]
  },
  {
    id: "PAT-506",
    name: "Robert Tanaka",
    age: 70,
    gender: "Male",
    bloodGroup: "B-",
    phone: "+1 (555) 606-9988",
    status: "Inpatient",
    ward: "ONC-Bed-05",
    assignedDoctorId: "DOC-105",
    assignedDoctorName: "Dr. Julian Beaumont",
    diagnosis: "Non-Hodgkin lymphoma Cycle 3 restaging",
    admissionDate: "2025-05-15",
    allergies: ["Ciprofloxacin"],
    vitals: { hr: 78, bp: "118/76", temp: 98.9, spo2: 96, rr: 17 },
    history: ["Stage II Diffuse Large B-cell Lymphoma", "R-CHOP regimen ongoing", "CBC monitoring daily"]
  },
  {
    id: "PAT-507",
    name: "Sophia Rodriguez",
    age: 24,
    gender: "Female",
    bloodGroup: "A-",
    phone: "+1 (555) 707-1199",
    status: "Emergency",
    ward: "ER-Bed-02",
    assignedDoctorId: "DOC-106",
    assignedDoctorName: "Dr. Amira Kalu",
    diagnosis: "Acute appendicitis with localized peritonitis",
    admissionDate: "2025-05-18",
    allergies: ["Codeine"],
    vitals: { hr: 108, bp: "110/70", temp: 101.8, spo2: 99, rr: 20 },
    history: ["Acute RLQ pain onset 8h ago", "NPO status active", "Pre-op laparoscopic clearance"]
  },
  {
    id: "PAT-508",
    name: "Benjamin Miller",
    age: 51,
    gender: "Male",
    bloodGroup: "O+",
    phone: "+1 (555) 808-2200",
    status: "Outpatient",
    ward: "N/A",
    assignedDoctorId: "DOC-107",
    assignedDoctorName: "Dr. Kenneth Sterling",
    diagnosis: "Moderate persistent COPD exacerbation",
    admissionDate: "2025-05-18",
    allergies: ["Aspirin"],
    vitals: { hr: 88, bp: "132/84", temp: 98.7, spo2: 94, rr: 19 },
    history: ["30 pack-year smoking history (quit 2021)", "Nebulizer therapy at home", "Prednisone taper"]
  },
  {
    id: "PAT-509",
    name: "Maya Lin",
    age: 38,
    gender: "Female",
    bloodGroup: "AB-",
    phone: "+1 (555) 909-3311",
    status: "Outpatient",
    ward: "N/A",
    assignedDoctorId: "DOC-101",
    assignedDoctorName: "Dr. Alexander Hayes",
    diagnosis: "Supraventricular tachycardia (post-ablation check)",
    admissionDate: "2025-05-18",
    allergies: ["None Known"],
    vitals: { hr: 66, bp: "118/74", temp: 98.6, spo2: 99, rr: 14 },
    history: ["RF catheter ablation March 2025", "Holter monitor 48h clear", "No recurrent palpitations"]
  },
  {
    id: "PAT-510",
    name: "Henry Wallace",
    age: 62,
    gender: "Male",
    bloodGroup: "A+",
    phone: "+1 (555) 010-4422",
    status: "Discharged",
    ward: "N/A",
    assignedDoctorId: "DOC-103",
    assignedDoctorName: "Dr. Marcus Vance",
    diagnosis: "Total knee arthroplasty (Discharged Day 4)",
    admissionDate: "2025-05-12",
    allergies: ["Iodine contrast"],
    vitals: { hr: 72, bp: "122/80", temp: 98.5, spo2: 98, rr: 15 },
    history: ["Severe osteoarthritis right knee", "Physical therapy outpatient plan initiated"]
  }
];

const INITIAL_APPOINTMENTS = [
  { id: "APT-801", patientName: "Eleanor Vance", patientId: "PAT-501", doctorName: "Dr. Alexander Hayes", department: "Cardiology", dateTime: "2025-05-18 10:30 AM", status: "Confirmed", priority: "Urgent" },
  { id: "APT-802", patientName: "David Chen", patientId: "PAT-502", doctorName: "Dr. Marcus Vance", department: "Orthopedics & Trauma", dateTime: "2025-05-18 11:15 AM", status: "Confirmed", priority: "Normal" },
  { id: "APT-803", patientName: "Aaliyah Hassan", patientId: "PAT-503", doctorName: "Dr. Priya Sharma", department: "Pediatrics", dateTime: "2025-05-18 01:00 PM", status: "Confirmed", priority: "Normal" },
  { id: "APT-804", patientName: "Lucas Moreau", patientId: "PAT-504", doctorName: "Dr. Elena Rostova", department: "Neurology", dateTime: "2025-05-18 02:30 PM", status: "Pending", priority: "Urgent" },
  { id: "APT-805", patientName: "Grace O'Connor", patientId: "PAT-505", doctorName: "Dr. Chloe Dupont", department: "Dermatology", dateTime: "2025-05-18 03:45 PM", status: "Confirmed", priority: "Normal" },
  { id: "APT-806", patientName: "Robert Tanaka", patientId: "PAT-506", doctorName: "Dr. Julian Beaumont", department: "Oncology & Hematology", dateTime: "2025-05-19 09:30 AM", status: "Confirmed", priority: "Urgent" },
  { id: "APT-807", patientName: "Sophia Rodriguez", patientId: "PAT-507", doctorName: "Dr. Amira Kalu", department: "Emergency Trauma", dateTime: "2025-05-18 09:00 AM", status: "Completed", priority: "Critical" },
  { id: "APT-808", patientName: "Benjamin Miller", patientId: "PAT-508", doctorName: "Dr. Kenneth Sterling", department: "Pulmonology & Critical Care", dateTime: "2025-05-19 11:00 AM", status: "Confirmed", priority: "Normal" },
  { id: "APT-809", patientName: "Maya Lin", patientId: "PAT-509", doctorName: "Dr. Alexander Hayes", department: "Cardiology", dateTime: "2025-05-19 02:15 PM", status: "Confirmed", priority: "Normal" },
  { id: "APT-810", patientName: "Henry Wallace", patientId: "PAT-510", doctorName: "Dr. Marcus Vance", department: "Orthopedics & Trauma", dateTime: "2025-05-20 10:00 AM", status: "Pending", priority: "Normal" }
];

const INITIAL_WARDS = [
  { id: "WARD-ICU", name: "Intensive Care Unit (ICU)", code: "ICU", totalBeds: 12, occupiedBeds: 10, nurseInCharge: "Nurse Sarah Jenkins, BSN", floor: "Floor 4" },
  { id: "WARD-CARD", name: "Cardiology Inpatient Ward", code: "CARD", totalBeds: 24, occupiedBeds: 19, nurseInCharge: "Nurse David Ross, RN", floor: "Floor 3" },
  { id: "WARD-GEN", name: "General Medical & Surgical", code: "GEN", totalBeds: 40, occupiedBeds: 28, nurseInCharge: "Nurse Maria Lopez, RN", floor: "Floor 2" },
  { id: "WARD-ONC", name: "Oncology Care Pavilion", code: "ONC", totalBeds: 18, occupiedBeds: 14, nurseInCharge: "Nurse Kevin Vance, BSN", floor: "Floor 5" },
  { id: "WARD-ER", name: "Emergency Trauma Bays", code: "ER", totalBeds: 16, occupiedBeds: 12, nurseInCharge: "Nurse Rachel Adams, CEN", floor: "Floor 1" },
  { id: "WARD-PED", name: "Pediatrics Specialty Care", code: "PED", totalBeds: 20, occupiedBeds: 11, nurseInCharge: "Nurse Amy Cho, CPN", floor: "Floor 3" }
];

const INITIAL_PHARMACY = [
  { id: "RX-101", drugName: "Atorvastatin Calcium 40mg", category: "Cardiovascular", stock: 450, unit: "Tablets", reorderThreshold: 100, pricePerUnit: 1.25, supplier: "Pfizer Clinical Labs" },
  { id: "RX-102", drugName: "Metoprolol Succinate ER 50mg", category: "Cardiovascular", stock: 320, unit: "Tablets", reorderThreshold: 80, pricePerUnit: 0.95, supplier: "AstraZeneca Med" },
  { id: "RX-103", drugName: "Ceftriaxone Sodium 1g IV", category: "Antibiotics", stock: 180, unit: "Vials", reorderThreshold: 50, pricePerUnit: 14.50, supplier: "Roche Pharma" },
  { id: "RX-104", drugName: "Enoxaparin Sodium 40mg/0.4mL", category: "Anticoagulant", stock: 140, unit: "Syringes", reorderThreshold: 40, pricePerUnit: 18.20, supplier: "Sanofi Hospital" },
  { id: "RX-105", drugName: "Albuterol Sulfate Inhalation", category: "Respiratory", stock: 95, unit: "Canisters", reorderThreshold: 30, pricePerUnit: 22.00, supplier: "GSK Respiratory" },
  { id: "RX-106", drugName: "Morphine Sulfate 10mg/mL IV", category: "Analgesic", stock: 65, unit: "Ampoules", reorderThreshold: 25, pricePerUnit: 8.75, supplier: "Hospira ICU Supply" }
];

const INITIAL_INVOICES = [
  { id: "INV-901", patientName: "Eleanor Vance (PAT-501)", date: "2025-05-18", doctorFee: 220.00, facilityFee: 450.00, pharmacyFee: 125.00, subtotal: 795.00, tax: 63.60, total: 858.60, status: "Paid" },
  { id: "INV-902", patientName: "David Chen (PAT-502)", date: "2025-05-18", doctorFee: 210.00, facilityFee: 350.00, pharmacyFee: 85.00, subtotal: 645.00, tax: 51.60, total: 696.60, status: "Pending" },
  { id: "INV-903", patientName: "Lucas Moreau (PAT-504)", date: "2025-05-17", doctorFee: 250.00, facilityFee: 600.00, pharmacyFee: 140.00, subtotal: 990.00, tax: 79.20, total: 1069.20, status: "Pending" },
  { id: "INV-904", patientName: "Sophia Rodriguez (PAT-507)", date: "2025-05-18", doctorFee: 190.00, facilityFee: 850.00, pharmacyFee: 210.00, subtotal: 1250.00, tax: 100.00, total: 1350.00, status: "Unpaid" }
];

// 2. Global State Synchronization
const state = {
  currentTab: 'dashboard',
  searchQuery: '',
  departmentFilter: 'all',
  doctors: [...INITIAL_DOCTORS],
  patients: [...INITIAL_PATIENTS],
  appointments: [...INITIAL_APPOINTMENTS],
  wards: [...INITIAL_WARDS],
  pharmacy: [...INITIAL_PHARMACY],
  invoices: [...INITIAL_INVOICES],
  emergencyActive: false,
  selectedPatient: null,
  selectedInvoice: null
};

// Load saved local storage state if present
try {
  const saved = localStorage.getItem('AEGIS_HMS_STATE_V1');
  if (saved) {
    const parsed = JSON.parse(saved);
    if (parsed.patients && parsed.patients.length) state.patients = parsed.patients;
    if (parsed.doctors && parsed.doctors.length) state.doctors = parsed.doctors;
    if (parsed.appointments && parsed.appointments.length) state.appointments = parsed.appointments;
    if (parsed.invoices && parsed.invoices.length) state.invoices = parsed.invoices;
  }
} catch (e) { /* ignore */ }

function saveState() {
  try {
    localStorage.setItem('AEGIS_HMS_STATE_V1', JSON.stringify({
      patients: state.patients,
      doctors: state.doctors,
      appointments: state.appointments,
      invoices: state.invoices
    }));
  } catch (e) { /* ignore */ }
}

// 3. Tab Switching Architecture
function switchTab(tabName) {
  state.currentTab = tabName;
  
  // Update sidebar active buttons
  document.querySelectorAll('.sidebar-nav .nav-item').forEach((btn) => {
    btn.classList.remove('active');
  });
  const activeBtn = document.getElementById(`nav-tab-${tabName}`);
  if (activeBtn) activeBtn.classList.add('active');

  // Update views
  document.querySelectorAll('.app-view').forEach((view) => {
    view.classList.remove('active-view');
  });
  const targetView = document.getElementById(`view-${tabName}`);
  if (targetView) targetView.classList.add('active-view');

  renderCurrentView();
}

// 4. Rendering Functions for Views & Tables
function renderCurrentView() {
  renderKPIs();
  renderDashboard();
  renderDoctors();
  renderPatients();
  renderAppointments();
  renderWards();
  renderPharmacy();
  renderBilling();
}

function renderKPIs() {
  const totalPatEl = document.getElementById('kpid-total-patients');
  const totalDocEl = document.getElementById('kpid-active-doctors');
  const todayApptEl = document.getElementById('kpid-today-appointments');
  const bedCapEl = document.getElementById('kpid-bed-capacity');
  const bedText = document.getElementById('kpid-bed-text');
  const triageText = document.getElementById('kpid-triage-text');

  if (totalPatEl) totalPatEl.textContent = state.patients.length;
  if (totalDocEl) totalDocEl.textContent = state.doctors.filter(d => d.status === 'Available').length;
  if (todayApptEl) todayApptEl.textContent = state.appointments.length;
  
  const totalBeds = state.wards.reduce((acc, w) => acc + w.totalBeds, 0);
  const occupiedBeds = state.wards.reduce((acc, w) => acc + w.occupiedBeds, 0);
  const pct = Math.round((occupiedBeds / totalBeds) * 100);
  if (bedCapEl) bedCapEl.textContent = `${pct}%`;
  if (bedText) bedText.textContent = `${pct}% Occupied (${occupiedBeds}/${totalBeds})`;

  const emergencyCount = state.patients.filter(p => p.status === 'Emergency').length;
  if (triageText) triageText.textContent = `${emergencyCount} Critical Triage`;
}

function renderDashboard() {
  // Recent Appointments Table
  const tableBody = document.getElementById('dashboard-recent-appointments-table');
  if (tableBody) {
    const recent = state.appointments.slice(0, 5);
    tableBody.innerHTML = recent.map((apt) => `
      <tr>
        <td class="font-mono font-bold text-main">${apt.id}</td>
        <td>
          <div class="patient-cell-name">
            <strong>${apt.patientName}</strong>
            <span class="patient-id-sub">${apt.patientId}</span>
          </div>
        </td>
        <td>${apt.doctorName}</td>
        <td><span class="dept-badge">${apt.department}</span></td>
        <td class="font-mono">${apt.dateTime}</td>
        <td><span class="status-badge ${apt.status.toLowerCase()}">${apt.status}</span></td>
        <td>
          <button onclick="openPatientEHR('${apt.patientId}')" class="btn-action-view" title="Open EHR">View EHR</button>
        </td>
      </tr>
    `).join('');
  }

  // Critical Vitals List
  const vitalsContainer = document.getElementById('dashboard-critical-vitals-list');
  if (vitalsContainer) {
    const criticalPatients = state.patients.filter(p => p.status === 'Inpatient' || p.status === 'Emergency').slice(0, 4);
    vitalsContainer.innerHTML = criticalPatients.map((p) => `
      <div class="vital-patient-card" onclick="openPatientEHR('${p.id}')">
        <div class="vcard-header">
          <strong>${p.name}</strong>
          <span class="badge-ward font-mono">${p.ward}</span>
        </div>
        <div class="vcard-vitals-row">
          <div class="v-pill ${p.vitals.hr > 100 ? 'alert' : ''}">HR: <strong>${p.vitals.hr}</strong> bpm</div>
          <div class="v-pill">BP: <strong>${p.vitals.bp}</strong></div>
          <div class="v-pill ${p.vitals.spo2 < 95 ? 'alert' : ''}">SpO2: <strong>${p.vitals.spo2}%</strong></div>
          <div class="v-pill">Temp: <strong>${p.vitals.temp}°F</strong></div>
        </div>
      </div>
    `).join('');
  }

  // Dashboard Ward Quick Meter
  const wardMetersContainer = document.getElementById('dashboard-ward-quick-meter');
  if (wardMetersContainer) {
    wardMetersContainer.innerHTML = state.wards.slice(0, 4).map((w) => {
      const pct = Math.round((w.occupiedBeds / w.totalBeds) * 100);
      const isHigh = pct >= 80;
      return `
        <div class="ward-meter-item">
          <div class="meter-info">
            <span>${w.name}</span>
            <strong class="${isHigh ? 'text-emergency' : ''}">${w.occupiedBeds}/${w.totalBeds} (${pct}%)</strong>
          </div>
          <div class="meter-bar-track">
            <div class="meter-bar-fill ${isHigh ? 'alert' : ''}" style="width: ${pct}%"></div>
          </div>
        </div>
      `;
    }).join('');
  }
}

function renderDoctors() {
  const container = document.getElementById('doctors-grid');
  if (!container) return;

  const query = state.searchQuery.toLowerCase();
  const filtered = state.doctors.filter(d => {
    const matchesSearch = !query || d.name.toLowerCase().includes(query) || d.specialty.toLowerCase().includes(query);
    const matchesDept = state.departmentFilter === 'all' || d.department.toLowerCase().includes(state.departmentFilter.toLowerCase());
    return matchesSearch && matchesDept;
  });

  container.innerHTML = filtered.map((doc) => `
    <div class="doctor-profile-card">
      <div class="doc-card-header">
        <img src="${doc.avatar}" alt="${doc.name}" class="doc-avatar" onerror="this.src='https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop'">
        <div>
          <h3>${doc.name}</h3>
          <span class="doc-specialty">${doc.specialty}</span>
          <span class="status-dot ${doc.status.toLowerCase().replace(' ', '-')}">${doc.status}</span>
        </div>
      </div>
      <div class="doc-details-list">
        <div><span>Qualification:</span> <strong>${doc.qualification}</strong></div>
        <div><span>Experience:</span> <strong>${doc.experienceYears} Years</strong></div>
        <div><span>Consultation:</span> <strong>$${doc.consultationFee}</strong></div>
        <div><span>Room / Clinic:</span> <strong>${doc.roomNumber}</strong></div>
        <div><span>Contact:</span> <strong>${doc.phoneNumber}</strong></div>
      </div>
      <div class="doc-card-footer">
        <button onclick="openBookAppointmentForDoctor('${doc.name}', '${doc.department}')" class="btn-brand-primary w-full">Schedule Appointment</button>
      </div>
    </div>
  `).join('');
}

function renderPatients() {
  const tbody = document.getElementById('patients-table-body');
  if (!tbody) return;

  const query = state.searchQuery.toLowerCase();
  const filtered = state.patients.filter(p => {
    return !query || p.name.toLowerCase().includes(query) || p.id.toLowerCase().includes(query) || p.diagnosis.toLowerCase().includes(query);
  });

  tbody.innerHTML = filtered.map((p) => `
    <tr onclick="openPatientEHR('${p.id}')" class="clickable-row">
      <td class="font-mono font-bold text-main">${p.id}</td>
      <td>
        <strong>${p.name}</strong>
        <div class="text-xs text-muted font-mono">${p.age} yrs • ${p.gender} • Blood: ${p.bloodGroup}</div>
      </td>
      <td><span class="status-badge ${p.status.toLowerCase()}">${p.status}</span></td>
      <td class="font-mono">${p.ward}</td>
      <td>${p.assignedDoctorName}</td>
      <td class="diagnosis-truncate" title="${p.diagnosis}">${p.diagnosis}</td>
      <td>
        <div class="vitals-quick-row font-mono text-xs">
          <span>HR: ${p.vitals.hr}</span> | <span>BP: ${p.vitals.bp}</span> | <span>SpO2: ${p.vitals.spo2}%</span>
        </div>
      </td>
      <td>
        <button onclick="event.stopPropagation(); openPatientEHR('${p.id}')" class="btn-action-view">View EHR</button>
      </td>
    </tr>
  `).join('');
}

function renderAppointments() {
  const tbody = document.getElementById('appointments-table-body');
  if (!tbody) return;

  tbody.innerHTML = state.appointments.map((apt) => `
    <tr>
      <td class="font-mono font-bold text-main">${apt.id}</td>
      <td>
        <strong>${apt.patientName}</strong>
        <div class="text-xs text-muted font-mono">${apt.patientId}</div>
      </td>
      <td>${apt.doctorName}</td>
      <td><span class="dept-badge">${apt.department}</span></td>
      <td class="font-mono">${apt.dateTime}</td>
      <td><span class="priority-badge ${apt.priority.toLowerCase()}">${apt.priority}</span></td>
      <td><span class="status-badge ${apt.status.toLowerCase()}">${apt.status}</span></td>
      <td>
        <button onclick="cancelAppointment('${apt.id}')" class="btn-action-cancel text-danger">Cancel</button>
      </td>
    </tr>
  `).join('');
}

function renderWards() {
  const summaryContainer = document.getElementById('wards-summary-grid');
  const bedsContainer = document.getElementById('ward-beds-detail-container');
  if (!summaryContainer) return;

  summaryContainer.innerHTML = state.wards.map((w) => {
    const pct = Math.round((w.occupiedBeds / w.totalBeds) * 100);
    return `
      <div class="ward-card">
        <div class="ward-card-header">
          <h3>${w.name}</h3>
          <span class="badge-subtle-blue font-mono">${w.code}</span>
        </div>
        <p class="text-xs text-muted">Supervisor: ${w.nurseInCharge} • ${w.floor}</p>
        <div class="ward-stats-row">
          <div><span class="text-xs text-muted">Total Beds:</span> <strong>${w.totalBeds}</strong></div>
          <div><span class="text-xs text-muted">Occupied:</span> <strong class="${pct >= 80 ? 'text-emergency' : ''}">${w.occupiedBeds}</strong></div>
          <div><span class="text-xs text-muted">Available:</span> <strong>${w.totalBeds - w.occupiedBeds}</strong></div>
        </div>
        <div class="meter-bar-track mt-2">
          <div class="meter-bar-fill ${pct >= 80 ? 'alert' : ''}" style="width: ${pct}%"></div>
        </div>
      </div>
    `;
  }).join('');

  if (bedsContainer) {
    // Render individual bed blocks for interactive inpatient allocation
    const bedItems = [];
    state.wards.forEach(w => {
      for (let i = 1; i <= w.totalBeds; i++) {
        const isOccupied = i <= w.occupiedBeds;
        bedItems.push(`
          <div class="bed-item ${isOccupied ? 'occupied' : 'available'}" title="${w.name} Bed ${i}">
            <span class="bed-code">${w.code}-${i < 10 ? '0' + i : i}</span>
            <span class="bed-status">${isOccupied ? 'Occupied' : 'Vacant'}</span>
          </div>
        `);
      }
    });
    bedsContainer.innerHTML = bedItems.slice(0, 48).join('');
  }
}

function renderPharmacy() {
  const tbody = document.getElementById('pharmacy-table-body');
  if (!tbody) return;

  tbody.innerHTML = state.pharmacy.map((rx) => {
    const isLow = rx.stock <= rx.reorderThreshold;
    return `
      <tr>
        <td class="font-mono font-bold text-main">${rx.id}</td>
        <td><strong>${rx.drugName}</strong></td>
        <td><span class="dept-badge">${rx.category}</span></td>
        <td class="font-mono ${isLow ? 'text-emergency font-bold' : ''}">${rx.stock} ${rx.unit}</td>
        <td class="font-mono">${rx.reorderThreshold} ${rx.unit}</td>
        <td class="font-mono">$${rx.pricePerUnit.toFixed(2)}</td>
        <td>${rx.supplier}</td>
        <td>
          <button onclick="reorderStock('${rx.id}')" class="btn-action-view">Restock +100</button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderBilling() {
  const tbody = document.getElementById('billing-table-body');
  if (!tbody) return;

  tbody.innerHTML = state.invoices.map((inv) => `
    <tr>
      <td class="font-mono font-bold text-main">${inv.id}</td>
      <td><strong>${inv.patientName}</strong></td>
      <td class="font-mono">${inv.date}</td>
      <td class="font-mono font-bold text-main">$${inv.total.toFixed(2)}</td>
      <td><span class="status-badge ${inv.status.toLowerCase()}">${inv.status}</span></td>
      <td>
        <button onclick="viewInvoiceModal('${inv.id}')" class="btn-action-view">View Invoice</button>
      </td>
    </tr>
  `).join('');
}

// 5. Patient Slide-Over EHR & Live ECG Monitor
let ecgAnimationId = null;
function openPatientEHR(patientId) {
  const patient = state.patients.find(p => p.id === patientId);
  if (!patient) return;
  state.selectedPatient = patient;

  document.getElementById('detail-pat-name').textContent = patient.name;
  document.getElementById('detail-pat-id').textContent = patient.id;
  document.getElementById('detail-pat-age-gender').textContent = `${patient.age}Y, ${patient.gender}`;
  document.getElementById('detail-pat-blood').textContent = patient.bloodGroup;
  document.getElementById('detail-pat-phone').textContent = patient.phone;
  document.getElementById('detail-pat-doctor').textContent = patient.assignedDoctorName;
  document.getElementById('detail-pat-diagnosis').textContent = patient.diagnosis;
  document.getElementById('detail-ecg-bpm').textContent = `HR: ${patient.vitals.hr} BPM`;

  document.getElementById('detail-pat-vital-hr').textContent = patient.vitals.hr;
  document.getElementById('detail-pat-vital-bp').textContent = patient.vitals.bp;
  document.getElementById('detail-pat-vital-temp').textContent = patient.vitals.temp;
  document.getElementById('detail-pat-vital-spo2').textContent = patient.vitals.spo2;

  // Allergies
  const allergyContainer = document.getElementById('detail-pat-allergies');
  if (allergyContainer) {
    allergyContainer.innerHTML = patient.allergies.map(a => `<span class="allergy-tag">${a}</span>`).join('');
  }

  // History
  const historyList = document.getElementById('detail-pat-history-list');
  if (historyList) {
    historyList.innerHTML = patient.history.map(h => `<li>${h}</li>`).join('');
  }

  // Avatar
  const avatarEl = document.getElementById('detail-pat-avatar');
  if (avatarEl) {
    avatarEl.src = `https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=faces`;
  }

  // Toggle Admit/Discharge button text
  const toggleBtn = document.getElementById('btn-admit-discharge-toggle');
  if (toggleBtn) {
    toggleBtn.textContent = patient.status === 'Discharged' ? 'Admit Patient to Ward' : 'Discharge Patient';
  }

  openDrawer('modal-patient-details');
  startECGWaveform(patient.vitals.hr);
}

function startECGWaveform(bpm = 75) {
  const canvas = document.getElementById('ecg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (ecgAnimationId) cancelAnimationFrame(ecgAnimationId);

  let x = 0;
  const width = canvas.width;
  const height = canvas.height;
  const midY = height / 2;

  ctx.fillStyle = '#0F172A';
  ctx.fillRect(0, 0, width, height);

  // Grid background
  ctx.strokeStyle = 'rgba(14, 165, 233, 0.15)';
  ctx.lineWidth = 1;
  for (let gx = 0; gx < width; gx += 20) {
    ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, height); ctx.stroke();
  }
  for (let gy = 0; gy < height; gy += 20) {
    ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(width, gy); ctx.stroke();
  }

  ctx.strokeStyle = '#0EA5E9';
  ctx.lineWidth = 2;

  function renderWave() {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.08)';
    ctx.fillRect(x, 0, 15, height);

    // ECG cardiac wave generation
    let y = midY;
    const cycle = x % 120;
    if (cycle > 40 && cycle < 46) y = midY - 6; // P wave
    else if (cycle >= 46 && cycle < 52) y = midY;
    else if (cycle >= 52 && cycle < 56) y = midY + 8; // Q drop
    else if (cycle >= 56 && cycle < 62) y = midY - 38; // R spike!
    else if (cycle >= 62 && cycle < 68) y = midY + 16; // S drop
    else if (cycle >= 68 && cycle < 74) y = midY;
    else if (cycle >= 84 && cycle < 98) y = midY - 10; // T wave

    ctx.beginPath();
    ctx.arc(x, y, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = '#38BDF8';
    ctx.fill();

    x = (x + 2) % width;
    ecgAnimationId = requestAnimationFrame(renderWave);
  }
  renderWave();
}

// 6. Modal & Slide-Over Helpers
function openModal(modalId) {
  document.getElementById(modalId)?.classList.remove('hidden');
  document.getElementById('modal-backdrop')?.classList.remove('hidden');
}

function closeModal(modalId) {
  document.getElementById(modalId)?.classList.add('hidden');
  document.getElementById('modal-backdrop')?.classList.add('hidden');
}

function openDrawer(drawerId) {
  document.getElementById(drawerId)?.classList.remove('hidden');
  document.getElementById('modal-backdrop')?.classList.remove('hidden');
}

function closeDrawer(drawerId) {
  document.getElementById(drawerId)?.classList.add('hidden');
  document.getElementById('modal-backdrop')?.classList.add('hidden');
  if (ecgAnimationId) cancelAnimationFrame(ecgAnimationId);
}

function viewInvoiceModal(invId) {
  const inv = state.invoices.find(i => i.id === invId);
  if (!inv) return;
  state.selectedInvoice = inv;

  document.getElementById('inv-modal-id').textContent = inv.id;
  document.getElementById('inv-modal-date').textContent = `Date: ${inv.date}`;
  document.getElementById('inv-modal-patient').textContent = inv.patientName;
  document.getElementById('inv-modal-doc-fee').textContent = `$${inv.doctorFee.toFixed(2)}`;
  document.getElementById('inv-modal-fac-fee').textContent = `$${inv.facilityFee.toFixed(2)}`;
  document.getElementById('inv-modal-med-fee').textContent = `$${inv.pharmacyFee.toFixed(2)}`;
  document.getElementById('inv-modal-subtotal').textContent = `$${inv.subtotal.toFixed(2)}`;
  document.getElementById('inv-modal-tax').textContent = `$${inv.tax.toFixed(2)}`;
  document.getElementById('inv-modal-total').textContent = `$${inv.total.toFixed(2)}`;

  const badge = document.getElementById('inv-modal-status-badge');
  if (badge) {
    badge.textContent = inv.status;
    badge.className = `status-badge ${inv.status.toLowerCase()}`;
  }

  openModal('modal-view-invoice');
}

function openBookAppointmentForDoctor(doctorName, department) {
  switchTab('appointments');
  openModal('modal-book-appointment');
  const docSelect = document.getElementById('book-doctor-select');
  if (docSelect) {
    docSelect.value = doctorName;
  }
}

function cancelAppointment(aptId) {
  state.appointments = state.appointments.filter(a => a.id !== aptId);
  saveState();
  renderAppointments();
  renderDashboard();
  renderKPIs();
  showToast(`Appointment ${aptId} cancelled.`, 'info');
}

function reorderStock(rxId) {
  const drug = state.pharmacy.find(r => r.id === rxId);
  if (drug) {
    drug.stock += 100;
    renderPharmacy();
    showToast(`Restocked +100 units for ${drug.drugName}`, 'success');
  }
}

// 7. Toast Feedback
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast-pill ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// 8. Event Listener Bindings & Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Initial Renders
  renderCurrentView();

  // Sidebar navigation bindings
  const tabs = ['dashboard', 'doctors', 'patients', 'appointments', 'wards', 'pharmacy', 'billing'];
  tabs.forEach(tab => {
    document.getElementById(`nav-tab-${tab}`)?.addEventListener('click', () => switchTab(tab));
  });

  // Global search input
  const searchInput = document.getElementById('global-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim();
      renderCurrentView();
    });
  }

  // Quick Action Buttons
  document.getElementById('btn-quick-new-patient')?.addEventListener('click', () => openModal('modal-add-patient'));
  document.getElementById('btn-open-patient-modal')?.addEventListener('click', () => openModal('modal-add-patient'));
  document.getElementById('btn-quick-book-appointment')?.addEventListener('click', () => openModal('modal-book-appointment'));
  document.getElementById('btn-open-appointment-modal')?.addEventListener('click', () => openModal('modal-book-appointment'));
  document.getElementById('btn-quick-add-doctor')?.addEventListener('click', () => openModal('modal-add-doctor'));
  document.getElementById('btn-open-doctor-modal')?.addEventListener('click', () => openModal('modal-add-doctor'));

  // Modal Closers
  document.getElementById('btn-close-patient-modal')?.addEventListener('click', () => closeModal('modal-add-patient'));
  document.getElementById('btn-cancel-patient')?.addEventListener('click', () => closeModal('modal-add-patient'));
  document.getElementById('btn-close-appointment-modal')?.addEventListener('click', () => closeModal('modal-book-appointment'));
  document.getElementById('btn-cancel-appointment')?.addEventListener('click', () => closeModal('modal-book-appointment'));
  document.getElementById('btn-close-doctor-modal')?.addEventListener('click', () => closeModal('modal-add-doctor'));
  document.getElementById('btn-cancel-doctor')?.addEventListener('click', () => closeModal('modal-add-doctor'));
  document.getElementById('btn-close-patient-details')?.addEventListener('click', () => closeDrawer('modal-patient-details'));
  document.getElementById('btn-close-invoice-modal')?.addEventListener('click', () => closeModal('modal-view-invoice'));
  document.getElementById('modal-backdrop')?.addEventListener('click', () => {
    closeModal('modal-add-patient');
    closeModal('modal-book-appointment');
    closeModal('modal-add-doctor');
    closeModal('modal-view-invoice');
    closeDrawer('modal-patient-details');
  });

  // Form Submissions
  document.getElementById('form-add-patient')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('pat-input-name')?.value || 'New Patient';
    const age = parseInt(document.getElementById('pat-input-age')?.value, 10) || 30;
    const gender = document.getElementById('pat-input-gender')?.value || 'Other';
    const blood = document.getElementById('pat-input-blood')?.value || 'O+';
    const phone = document.getElementById('pat-input-phone')?.value || '+1 (555) 000-0000';
    const diagnosis = document.getElementById('pat-input-diagnosis')?.value || 'General Evaluation';
    const ward = document.getElementById('pat-input-ward')?.value || 'GEN-Bed-01';

    const newPat = {
      id: `PAT-${Math.floor(520 + Math.random() * 80)}`,
      name, age, gender, bloodGroup: blood, phone,
      status: ward.includes('N/A') ? 'Outpatient' : 'Inpatient',
      ward,
      assignedDoctorId: 'DOC-101',
      assignedDoctorName: 'Dr. Alexander Hayes',
      diagnosis,
      admissionDate: new Date().toISOString().split('T')[0],
      allergies: ['None Reported'],
      vitals: { hr: 75, bp: '120/80', temp: 98.6, spo2: 99, rr: 16 },
      history: ['Admitted via clinical reception']
    };

    state.patients.unshift(newPat);
    saveState();
    closeModal('modal-add-patient');
    renderCurrentView();
    showToast(`Registered patient ${newPat.name} (${newPat.id})!`, 'success');
  });

  document.getElementById('form-book-appointment')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const patName = document.getElementById('book-patient-name')?.value || 'Walk-in Patient';
    const docName = document.getElementById('book-doctor-select')?.value || 'Dr. Alexander Hayes';
    const date = document.getElementById('book-date')?.value || '2025-05-20';
    const time = document.getElementById('book-time')?.value || '10:00 AM';
    const priority = document.getElementById('book-priority')?.value || 'Normal';

    const newApt = {
      id: `APT-${Math.floor(820 + Math.random() * 80)}`,
      patientName: patName,
      patientId: `PAT-501`,
      doctorName: docName,
      department: 'Clinical Specialty',
      dateTime: `${date} ${time}`,
      status: 'Confirmed',
      priority
    };

    state.appointments.unshift(newApt);
    saveState();
    closeModal('modal-book-appointment');
    renderCurrentView();
    showToast(`Appointment scheduled for ${newApt.patientName}!`, 'success');
  });

  document.getElementById('form-add-doctor')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('doc-input-name')?.value || 'Dr. Specialist';
    const specialty = document.getElementById('doc-input-specialty')?.value || 'General Medicine';
    const qual = document.getElementById('doc-input-qual')?.value || 'MD Hospital Board';
    const room = document.getElementById('doc-input-room')?.value || 'R-101';
    const fee = parseFloat(document.getElementById('doc-input-fee')?.value) || 200;

    const newDoc = {
      id: `DOC-${Math.floor(110 + Math.random() * 90)}`,
      name, specialty, department: specialty,
      qualification: qual, experienceYears: 7, rating: 5.0,
      consultationFee: fee, roomNumber: room,
      phoneNumber: '+1 (555) 999-0011',
      status: 'Available', patientsCount: 0,
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop'
    };

    state.doctors.push(newDoc);
    saveState();
    closeModal('modal-add-doctor');
    renderCurrentView();
    showToast(`Physician ${newDoc.name} onboarded!`, 'success');
  });

  // Emergency Alert Trigger & Resolver
  const emergencyBar = document.getElementById('emergency-ticker-bar');
  document.getElementById('btn-trigger-emergency')?.addEventListener('click', () => {
    state.emergencyActive = true;
    if (emergencyBar) emergencyBar.classList.remove('hidden');
    showToast('🚨 CODE BLUE ACTIVATED: Emergency Medical Trauma Team Dispatched!', 'danger');
  });

  document.getElementById('btn-resolve-emergency')?.addEventListener('click', () => {
    state.emergencyActive = false;
    if (emergencyBar) emergencyBar.classList.add('hidden');
    showToast('Code Blue resolved. Triage logged.', 'success');
  });

  // Admit / Discharge Toggle inside Patient EHR
  document.getElementById('btn-admit-discharge-toggle')?.addEventListener('click', () => {
    if (!state.selectedPatient) return;
    if (state.selectedPatient.status === 'Discharged') {
      state.selectedPatient.status = 'Inpatient';
      state.selectedPatient.ward = 'GEN-Bed-04';
      showToast(`${state.selectedPatient.name} admitted to GEN-Bed-04.`, 'info');
    } else {
      state.selectedPatient.status = 'Discharged';
      state.selectedPatient.ward = 'N/A';
      showToast(`${state.selectedPatient.name} discharged successfully.`, 'success');
    }
    saveState();
    renderCurrentView();
    openPatientEHR(state.selectedPatient.id);
  });

  // Invoice Paid Toggle
  document.getElementById('btn-mark-invoice-paid')?.addEventListener('click', () => {
    if (!state.selectedInvoice) return;
    state.selectedInvoice.status = 'Paid';
    saveState();
    renderBilling();
    closeModal('modal-view-invoice');
    showToast(`Invoice ${state.selectedInvoice.id} marked as Paid!`, 'success');
  });

  // Online Sync Mock Data Action
  document.getElementById('btn-sync-external-patients')?.addEventListener('click', async () => {
    showToast('Syncing telemetry with HL7 FHIR Cloud...', 'info');
    setTimeout(() => {
      showToast('🟢 10 Clinical Records Synchronized from Regional Hospital Hub!', 'success');
    }, 1200);
  });
});
