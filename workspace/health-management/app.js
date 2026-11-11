/**
 * ==============================================================================
 * CarePulse Clinical Health & Hospital ERP — Client Runtime Engine
 * ==============================================================================
 * Features:
 *   - Reactive State & LocalStorage persistence (`carepulse_hospital_db_v2`)
 *   - Multi-role switching (Patient, Doctor Desk, Hospital Admin)
 *   - Full appointment scheduling, cancellation, rescheduling, and pass generation
 *   - Electronic Health Records (EHR) & comprehensive diagnostic lab report modals
 *   - Digital Prescriptions with instant pharmacy refill dispatch
 *   - Critical Care Unit (ICU) 14-bed occupancy telemetry (admit & discharge)
 *   - Live physiological vitals telemetry with animated canvas ECG monitor
 *   - Hospital Central Pharmacy inventory management (dispense & restock)
 *   - Omnisearch live filtering across all modules
 *   - Modern animated toast notification system
 * ==============================================================================
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'carepulse_hospital_db_v2';

  // --- Initial Seed Database ---
  const defaultDatabase = {
    activeRole: 'patient',
    activeTab: 'tab-overview',
    searchQuery: '',
    vitalsActive: true,

    doctors: [
      {
        id: 'doc-1',
        name: 'Dr. Sarah Jenkins',
        degrees: 'MD, DM (Cardiology)',
        department: 'Cardiology',
        experience: '16 Yrs Exp',
        roleTitle: 'Senior Consultant Cardiologist',
        rating: 4.9,
        reviewsCount: 840,
        fee: 800,
        room: 'Room 302 (Cardio Wing)',
        schedule: 'Mon - Fri (09:00 - 15:30)',
        slotsAvailable: 6,
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
        bio: 'Chief Interventional Cardiologist specializing in coronary interventions, cardiac pacing, and preventive cardiology.'
      },
      {
        id: 'doc-2',
        name: 'Dr. Rajesh Verma',
        degrees: 'MBBS, MCh (Neurosurgery)',
        department: 'Neurology',
        experience: '22 Yrs Exp',
        roleTitle: 'Head of Neurosciences',
        rating: 4.9,
        reviewsCount: 1150,
        fee: 950,
        room: 'Room 410 (Neuro Wing)',
        schedule: 'Mon - Sat (10:00 - 17:00)',
        slotsAvailable: 4,
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
        bio: 'Lead Neurosurgeon renowned for acute stroke management, micro-neurosurgery, spine decompression, and epilepsy care.'
      },
      {
        id: 'doc-3',
        name: 'Dr. Priya Sen',
        degrees: 'MD, DCH (Pediatrics)',
        department: 'Pediatrics',
        experience: '12 Yrs Exp',
        roleTitle: 'Lead Pediatric Specialist',
        rating: 4.8,
        reviewsCount: 620,
        fee: 650,
        room: 'Room 105 (Child Care Wing)',
        schedule: 'Mon - Fri (08:30 - 14:00)',
        slotsAvailable: 8,
        avatar: 'https://images.unsplash.com/photo-1594824813689-ee084e5a95f7?auto=format&fit=crop&w=400&q=80',
        bio: 'Dedicated pediatrician focusing on neonatal intensive care, developmental milestones, and pediatric immunizations.'
      },
      {
        id: 'doc-4',
        name: 'Dr. Vikram Patel',
        degrees: 'MS (Orthopedics), M.Ch',
        department: 'Orthopedics',
        experience: '18 Yrs Exp',
        roleTitle: 'Senior Joint Replacement Surgeon',
        rating: 4.9,
        reviewsCount: 940,
        fee: 850,
        room: 'Room 204 (Ortho Wing)',
        schedule: 'Tue - Sat (09:30 - 16:30)',
        slotsAvailable: 5,
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
        bio: 'Specialist in robotic knee and hip arthroplasty, sports ligament reconstructions, and complex fracture trauma.'
      },
      {
        id: 'doc-5',
        name: 'Dr. Aisha Khan',
        degrees: 'MD (Dermatology, Venereology)',
        department: 'Dermatology',
        experience: '10 Yrs Exp',
        roleTitle: 'Clinical Dermatologist',
        rating: 4.8,
        reviewsCount: 480,
        fee: 700,
        room: 'Room 112 (Derma Suite)',
        schedule: 'Mon - Thu (11:00 - 18:00)',
        slotsAvailable: 7,
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
        bio: 'Specialist in clinical dermatology, autoimmune dermatoses, laser surgery, and therapeutic skin resurfacing.'
      },
      {
        id: 'doc-6',
        name: 'Dr. David Ross',
        degrees: 'MD, DM (Medical Oncology)',
        department: 'Oncology',
        experience: '20 Yrs Exp',
        roleTitle: 'Senior Medical Oncologist',
        rating: 5.0,
        reviewsCount: 710,
        fee: 1200,
        room: 'Room 501 (Cancer Center)',
        schedule: 'Wed - Sun (10:00 - 15:00)',
        slotsAvailable: 3,
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
        bio: 'Expert in targeted chemotherapy, immunotherapy protocols, and multi-disciplinary solid tumor oncology.'
      }
    ],

    appointments: [
      {
        id: 'APT-8821',
        token: 'CP-01',
        patientName: 'Arjun Mehta',
        patientPhone: '+91 98450 11223',
        patientAge: 42,
        patientGender: 'Male',
        doctorId: 'doc-1',
        doctorName: 'Dr. Sarah Jenkins',
        department: 'Cardiology',
        date: '2026-11-05',
        timeSlot: '11:00 AM',
        symptoms: 'Routine cardiovascular follow-up; evaluate recent lipid panel results and exertional pressure.',
        priority: false,
        status: 'Confirmed'
      },
      {
        id: 'APT-8822',
        token: 'CP-02',
        patientName: 'Priya Sharma',
        patientPhone: '+91 98765 43210',
        patientAge: 36,
        patientGender: 'Female',
        doctorId: 'doc-2',
        doctorName: 'Dr. Rajesh Verma',
        department: 'Neurology',
        date: '2026-11-04',
        timeSlot: '02:30 PM',
        symptoms: 'Persistent migraine with visual aura and cervical tension. Inquiring about preventative therapy.',
        priority: true,
        status: 'In-Progress'
      },
      {
        id: 'APT-8823',
        token: 'CP-03',
        patientName: 'Rajesh Nair',
        patientPhone: '+91 97412 88990',
        patientAge: 58,
        patientGender: 'Male',
        doctorId: 'doc-4',
        doctorName: 'Dr. Vikram Patel',
        department: 'Orthopedics',
        date: '2026-11-08',
        timeSlot: '09:30 AM',
        symptoms: 'Bilateral knee joint pain, morning stiffness > 30 mins, reduced ambulation tolerance.',
        priority: false,
        status: 'Confirmed'
      }
    ],

    ehrRecords: [
      {
        id: 'EHR-101',
        labId: 'LAB-9921',
        title: 'Comprehensive Metabolic & Lipid Diagnostic Panel',
        department: 'Central Clinical Pathology',
        date: '2026-11-02',
        orderingDoctor: 'Dr. Sarah Jenkins, MD',
        patientName: 'Arjun Mehta (42y / M)',
        specimenType: 'Fasting Venous Whole Blood & Serum',
        findingsSummary: 'Fasting glucose within ideal limits (92 mg/dL). Total cholesterol borderline elevated (212 mg/dL) with elevated LDL-C (138 mg/dL). Renal function intact with eGFR > 90 mL/min.',
        status: 'Abnormal Flagged',
        parameters: [
          { name: 'Fasting Blood Glucose', value: '92', unit: 'mg/dL', refRange: '70 - 99', flag: 'Normal' },
          { name: 'Glycated Hemoglobin (HbA1c)', value: '5.5', unit: '%', refRange: '< 5.7', flag: 'Normal' },
          { name: 'Total Serum Cholesterol', value: '212', unit: 'mg/dL', refRange: '< 200', flag: 'High' },
          { name: 'LDL Cholesterol (Calculated)', value: '138', unit: 'mg/dL', refRange: '< 100', flag: 'High' },
          { name: 'HDL Cholesterol (Direct)', value: '44', unit: 'mg/dL', refRange: '> 40', flag: 'Normal' },
          { name: 'Serum Triglycerides', value: '150', unit: 'mg/dL', refRange: '< 150', flag: 'Normal' },
          { name: 'Serum Creatinine', value: '0.94', unit: 'mg/dL', refRange: '0.70 - 1.20', flag: 'Normal' },
          { name: 'eGFR (CKD-EPI)', value: '98', unit: 'mL/min/1.73m²', refRange: '> 90', flag: 'Normal' }
        ],
        pathologist: 'Dr. K. S. Mukherjee, MD (Pathology), Central NABL Lab'
      },
      {
        id: 'EHR-102',
        labId: 'ECG-4418',
        title: '12-Lead Electrocardiogram (ECG / EKG) Analysis',
        department: 'Cardiovascular Non-Invasive Lab',
        date: '2026-11-01',
        orderingDoctor: 'Dr. Sarah Jenkins, MD',
        patientName: 'Arjun Mehta (42y / M)',
        specimenType: 'Resting Surface 12-Lead Telemetry',
        findingsSummary: 'Normal sinus rhythm at 72 bpm. Normal PR interval (152 ms) and narrow QRS complex (88 ms). Corrected QT interval (QTc) is 418 ms. No acute ST-segment deviation or pathologic Q-waves.',
        status: 'Normal',
        parameters: [
          { name: 'Ventricular Heart Rate', value: '72', unit: 'BPM', refRange: '60 - 100', flag: 'Normal' },
          { name: 'PR Interval', value: '152', unit: 'ms', refRange: '120 - 200', flag: 'Normal' },
          { name: 'QRS Duration', value: '88', unit: 'ms', refRange: '80 - 120', flag: 'Normal' },
          { name: 'QTc Interval (Bazett)', value: '418', unit: 'ms', refRange: '< 450', flag: 'Normal' },
          { name: 'Mean QRS Axis', value: '+45', unit: 'Degrees', refRange: '-30 to +90', flag: 'Normal' }
        ],
        pathologist: 'Dr. Sarah Jenkins, Senior Consultant Cardiologist'
      },
      {
        id: 'EHR-103',
        labId: 'RAD-1104',
        title: 'Lumbar Spine Magnetic Resonance Imaging (MRI)',
        department: 'Advanced Radiodiagnostics',
        date: '2026-10-28',
        orderingDoctor: 'Dr. Rajesh Verma, MCh',
        patientName: 'Arjun Mehta (42y / M)',
        specimenType: 'Siemens 3.0T MRI Multi-planar Acquisition',
        findingsSummary: 'Mild L4-L5 disc desiccation with subtle posterior annular bulge contacting the ventral thecal sac without significant canal stenosis. Neural foramina patent bilaterally.',
        status: 'Mild Degenerative',
        parameters: [
          { name: 'L1 - L3 Intervertebral Discs', value: 'Normal', unit: 'Grade', refRange: 'Pfirrmann Grade I', flag: 'Normal' },
          { name: 'L4 - L5 Annular Bulge', value: 'Mild (1.8mm)', unit: 'Depth', refRange: 'No Displacement', flag: 'High' },
          { name: 'L5 - S1 Facet Joints', value: 'Unremarkable', unit: 'Grade', refRange: 'Grade I', flag: 'Normal' },
          { name: 'Thecal Sac Compression', value: 'Negative', unit: 'Status', refRange: 'Negative', flag: 'Normal' }
        ],
        pathologist: 'Dr. Meenakshi Sunder, DMRD, DNB (Radiodiagnosis)'
      }
    ],

    prescriptions: [
      {
        id: 'RX-701',
        rxNumber: 'CARE-RX-9081',
        medicine: 'Atorvastatin Calcium Tablets',
        strength: '20 mg',
        instructions: 'Take 1 tablet by mouth daily at bedtime after meal.',
        duration: '30 Days (30 Tablets)',
        doctor: 'Dr. Sarah Jenkins (Cardiology)',
        prescribedDate: '2026-11-02',
        refillsRemaining: 2,
        status: 'Active'
      },
      {
        id: 'RX-702',
        rxNumber: 'CARE-RX-9082',
        medicine: 'Metformin Hydrochloride (Extended Release)',
        strength: '500 mg',
        instructions: 'Take 1 tablet twice daily with morning and evening meals.',
        duration: '60 Days (120 Tablets)',
        doctor: 'Dr. Rajesh Verma (Neurology)',
        prescribedDate: '2026-10-20',
        refillsRemaining: 3,
        status: 'Active'
      },
      {
        id: 'RX-703',
        rxNumber: 'CARE-RX-9083',
        medicine: 'Amoxicillin & Potassium Clavulanate',
        strength: '625 mg',
        instructions: 'Take 1 tablet every 8 hours for 5 days. Complete full course.',
        duration: '5 Days (15 Tablets)',
        doctor: 'Dr. Priya Sen (Pediatrics)',
        prescribedDate: '2026-10-15',
        refillsRemaining: 0,
        status: 'Completed'
      },
      {
        id: 'RX-704',
        rxNumber: 'CARE-RX-9084',
        medicine: 'Paracetamol IP (Fast Release)',
        strength: '650 mg',
        instructions: 'Take 1 tablet SOS every 6 hours as needed for body ache or fever > 100°F.',
        duration: '10 Days (20 Tablets)',
        doctor: 'Dr. Vikram Patel (Orthopedics)',
        prescribedDate: '2026-11-01',
        refillsRemaining: 4,
        status: 'Active'
      }
    ],

    icuBeds: [
      { id: 'bed-101', bedNumber: 'ICU-101', status: 'Occupied', patientName: 'Sunita Rao (64y/F)', condition: 'Acute Coronary Syndrome', ventilator: 'EV300 Active', admitDate: '2026-11-03' },
      { id: 'bed-102', bedNumber: 'ICU-102', status: 'Occupied', patientName: 'David Miller (52y/M)', condition: 'Post-CABG Day 1', ventilator: 'Weaned O2 Mask', admitDate: '2026-11-02' },
      { id: 'bed-103', bedNumber: 'ICU-103', status: 'Occupied', patientName: 'Kavita Deshmukh (41y/F)', condition: 'Polytrauma / Flail Chest', ventilator: 'EV300 Active', admitDate: '2026-11-04' },
      { id: 'bed-104', bedNumber: 'ICU-104', status: 'Occupied', patientName: 'Ronald Davies (71y/M)', condition: 'Septic Shock / Inotropic Support', ventilator: 'EV300 Active', admitDate: '2026-11-01' },
      { id: 'bed-105', bedNumber: 'ICU-105', status: 'Occupied', patientName: 'Arvind Swamy (59y/M)', condition: 'Post-PCI Monitoring', ventilator: 'Room Air Nasal Prong', admitDate: '2026-11-03' },
      { id: 'bed-106', bedNumber: 'ICU-106', status: 'Occupied', patientName: 'Mary D\'Souza (68y/F)', condition: 'Severe Necrotizing Pancreatitis', ventilator: 'High-Flow Nasal', admitDate: '2026-10-31' },
      { id: 'bed-107', bedNumber: 'ICU-107', status: 'Occupied', patientName: 'Vikram Sethi (38y/M)', condition: 'Acute Subdural Evacuation', ventilator: 'EV300 Active', admitDate: '2026-11-04' },
      { id: 'bed-108', bedNumber: 'ICU-108', status: 'Occupied', patientName: 'Fatima Begum (63y/F)', condition: 'Type 2 Respiratory Failure (COPD)', ventilator: 'NIV BiPAP', admitDate: '2026-11-02' },
      { id: 'bed-109', bedNumber: 'ICU-109', status: 'Occupied', patientName: 'Charles Turner (77y/M)', condition: 'Decompensated Heart Failure', ventilator: 'Weaned Nasal', admitDate: '2026-11-01' },
      { id: 'bed-110', bedNumber: 'ICU-110', status: 'Occupied', patientName: 'Aniket Joshi (45y/M)', condition: 'Dengue Hemorrhagic Fever', ventilator: 'None (Platelet Support)', admitDate: '2026-11-03' },
      { id: 'bed-111', bedNumber: 'ICU-111', status: 'Available', patientName: 'Unassigned', condition: 'Sanitized & Negative Pressure Ready', ventilator: 'EV300 Standby', admitDate: '-' },
      { id: 'bed-112', bedNumber: 'ICU-112', status: 'Available', patientName: 'Unassigned', condition: 'Class-A Cardiac Wing Ready', ventilator: 'EV300 Standby', admitDate: '-' },
      { id: 'bed-113', bedNumber: 'ICU-113', status: 'Available', patientName: 'Unassigned', condition: 'Neuro Trauma Bed Available', ventilator: 'EV300 Standby', admitDate: '-' },
      { id: 'bed-114', bedNumber: 'ICU-114', status: 'Available', patientName: 'Unassigned', condition: 'General Isolation Ready', ventilator: 'EV300 Standby', admitDate: '-' }
    ],

    pharmacyCatalog: [
      { code: 'PH-101', name: 'Atorvastatin Calcium 20mg', category: 'Cardiovascular', form: 'Oral Tablet (10x10)', stock: 480, price: 145, rxReq: true },
      { code: 'PH-102', name: 'Telmisartan IP 40mg', category: 'Antihypertensive', form: 'Oral Tablet (10x10)', stock: 320, price: 120, rxReq: true },
      { code: 'PH-103', name: 'Metformin HCl 500mg ER', category: 'Antidiabetic', form: 'Oral Tablet (10x10)', stock: 610, price: 95, rxReq: true },
      { code: 'PH-104', name: 'Amoxicillin-Clavulanate 625mg', category: 'Antibiotic', form: 'Coated Tablet (10x6)', stock: 215, price: 210, rxReq: true },
      { code: 'PH-105', name: 'Pantoprazole Sodium 40mg', category: 'Gastrointestinal', form: 'Oral Tablet (10x10)', stock: 540, price: 85, rxReq: false },
      { code: 'PH-106', name: 'Paracetamol IP 650mg', category: 'Analgesic / Antipyretic', form: 'Oral Tablet (10x15)', stock: 890, price: 32, rxReq: false },
      { code: 'PH-107', name: 'Salbutamol Inhaler 100mcg', category: 'Respiratory', form: 'MDI 200 Actuations', stock: 140, price: 175, rxReq: true },
      { code: 'PH-108', name: 'Normal Saline (0.9% NaCl) 500ml', category: 'IV Fluids', form: 'Infusion Bottle', stock: 450, price: 42, rxReq: false }
    ]
  };

  // --- Reactive State Management ---
  let state = defaultDatabase;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      state = Object.assign({}, defaultDatabase, JSON.parse(saved));
    }
  } catch (e) {
    state = defaultDatabase;
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  // --- Animated Toast Notification System ---
  function showToast(message, icon) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'ph-toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'ph-toast';
    toast.innerHTML = '<span>' + (icon || '✨') + '</span> <span>' + message + '</span>';
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('ph-fade-out');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 250);
    }, 3200);
  }
  window.phToast = showToast;

  // --- Role Switching Manager ---
  function switchRole(role) {
    state.activeRole = role;
    saveState();

    document.querySelectorAll('.role-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-role') === role);
    });

    const nameDisplay = document.getElementById('user-name-display');
    const roleDisplay = document.getElementById('user-role-display');
    const avatarImg = document.getElementById('user-avatar');

    if (role === 'patient') {
      if (nameDisplay) nameDisplay.textContent = 'Arjun Mehta';
      if (roleDisplay) roleDisplay.textContent = 'Patient #CP-8842';
      if (avatarImg) avatarImg.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80';
      showToast('Switched to Patient Portal. Welcome, Arjun Mehta!', '👤');
    } else if (role === 'doctor') {
      if (nameDisplay) nameDisplay.textContent = 'Dr. Sarah Jenkins';
      if (roleDisplay) roleDisplay.textContent = 'Senior Consultant (Cardiology)';
      if (avatarImg) avatarImg.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80';
      showToast('Switched to Doctor Desk. Dr. Sarah Jenkins session active.', '🩺');
      switchTab('tab-doctor-desk');
    } else if (role === 'admin') {
      if (nameDisplay) nameDisplay.textContent = 'Chief of Hospital Operations';
      if (roleDisplay) roleDisplay.textContent = 'Super Administrator (All Access)';
      if (avatarImg) avatarImg.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80';
      showToast('Switched to Hospital Admin Console. Full telemetry armed.', '🛡️');
      switchTab('tab-icu');
    }
  }

  // --- Tab Navigation Manager ---
  function switchTab(tabId) {
    state.activeTab = tabId;
    saveState();

    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });

    document.querySelectorAll('.view-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === tabId);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- Render Doctors Catalog ---
  function renderDoctors(filterDept, query) {
    const container = document.getElementById('doctors-catalog');
    const selectEl = document.getElementById('book-doctor-select');
    if (!container) return;

    const filtered = (state.doctors || []).filter(doc => {
      const matchesDept = !filterDept || filterDept === 'all' || doc.department.toLowerCase() === filterDept.toLowerCase();
      const text = (doc.name + ' ' + doc.department + ' ' + doc.bio + ' ' + doc.degrees).toLowerCase();
      const matchesQuery = !query || text.includes(query.toLowerCase());
      return matchesDept && matchesQuery;
    });

    container.innerHTML = filtered.map(doc => {
      return `
        <div class="product-card" data-doctor-id="${doc.id}">
          <span class="doctor-badge">${doc.experience}</span>
          <div class="card-image-box">
            <img src="${doc.avatar}" alt="${doc.name}" class="card-img" loading="lazy">
          </div>
          <div class="card-content">
            <div class="card-meta">
              <span class="dept-tag"><i class="fa-solid fa-stethoscope"></i> ${doc.department}</span>
              <span class="exp-tag">${doc.room}</span>
            </div>
            <h4 class="product-title">${doc.name}, ${doc.degrees}</h4>
            <p class="product-desc">${doc.bio}</p>
            <div class="rating-strip">
              <span class="stars"><i class="fa-solid fa-star"></i> ${doc.rating.toFixed(1)}</span>
              <span class="patient-reviews">(${doc.reviewsCount} verified reviews)</span>
            </div>
            <div class="card-footer">
              <div class="fee-box">
                <span class="price">₹${doc.fee}</span>
                <span class="fee-label">Consultation Fee</span>
              </div>
              <button type="button" class="btn-book-action" data-action="book-doctor" data-doc-id="${doc.id}">
                <i class="fa-solid fa-calendar-plus"></i> Book Consultation
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Also populate select in booking form
    if (selectEl && selectEl.children.length <= 1) {
      selectEl.innerHTML = '<option value="">-- Choose Specialist Doctor --</option>' +
        (state.doctors || []).map(d => `<option value="${d.id}">${d.name} (${d.department}) — ₹${d.fee}</option>`).join('');
    }
  }

  // --- Render Appointments Table ---
  function renderAppointments(statusFilter, query) {
    const tbody = document.getElementById('appointments-tbody');
    if (!tbody) return;

    const list = state.appointments || [];
    const filtered = list.filter(apt => {
      const matchesStatus = !statusFilter || statusFilter === 'all' || apt.status.toLowerCase() === statusFilter.toLowerCase();
      const text = (apt.token + ' ' + apt.patientName + ' ' + apt.doctorName + ' ' + apt.department + ' ' + apt.status + ' ' + apt.symptoms).toLowerCase();
      const matchesQuery = !query || text.includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 36px; color: #64748b;">No scheduled appointments found matching criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(apt => {
      const statusClass = 'status-' + apt.status.toLowerCase();
      const isConfirmed = apt.status === 'Confirmed' || apt.status === 'In-Progress';
      return `
        <tr data-apt-id="${apt.id}">
          <td><span class="token-badge">${apt.token}</span></td>
          <td><strong>${apt.patientName}</strong><br><small class="text-muted">${apt.patientPhone || ''}</small></td>
          <td>${apt.doctorName}</td>
          <td><span class="dept-tag">${apt.department}</span></td>
          <td><strong>${apt.date}</strong><br><small class="text-cyan-400">${apt.timeSlot}</small></td>
          <td style="max-width: 220px;" class="truncate text-xs text-muted" title="${apt.symptoms}">${apt.symptoms}</td>
          <td><span class="status-chip ${statusClass}">${apt.status}</span></td>
          <td>
            <div class="table-action-btns">
              <button type="button" class="btn-table-action" data-action="view-slip" data-id="${apt.id}" title="View Clinical Pass">
                <i class="fa-solid fa-receipt"></i> Slip
              </button>
              ${isConfirmed ? `
                <button type="button" class="btn-table-action" data-action="reschedule" data-id="${apt.id}" title="Reschedule Date/Slot">
                  <i class="fa-solid fa-clock-rotate-left"></i>
                </button>
                <button type="button" class="btn-table-action btn-table-danger" data-action="cancel-apt" data-id="${apt.id}" title="Cancel Consultation">
                  <i class="fa-solid fa-ban"></i>
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');

    updateBadgeCounters();
  }

  // --- Render Electronic Health Records (EHR) ---
  function renderEHR(query) {
    const grid = document.getElementById('ehr-records-grid');
    if (!grid) return;

    const list = state.ehrRecords || [];
    const filtered = list.filter(r => {
      const text = (r.title + ' ' + r.department + ' ' + r.findingsSummary + ' ' + r.orderingDoctor).toLowerCase();
      return !query || text.includes(query.toLowerCase());
    });

    grid.innerHTML = filtered.map(rec => {
      const isAbnormal = rec.status.includes('Abnormal') || rec.status.includes('Degenerative');
      const badgeColor = isAbnormal ? 'status-warning' : 'status-stable';
      return `
        <div class="ehr-card" data-ehr-id="${rec.id}">
          <div class="ehr-header">
            <span class="ehr-dept"><i class="fa-solid fa-microscope"></i> ${rec.department}</span>
            <span class="ehr-date">${rec.date}</span>
          </div>
          <h4 class="ehr-title">${rec.title}</h4>
          <p class="ehr-doctor">Ordering Clinician: <strong>${rec.orderingDoctor}</strong></p>
          <div class="ehr-summary-box">
            <p>${rec.findingsSummary}</p>
          </div>
          <div class="card-footer">
            <span class="status-pill ${badgeColor}">${rec.status}</span>
            <button type="button" class="btn-book-action" data-action="open-report-modal" data-id="${rec.id}">
              <i class="fa-solid fa-file-waveform"></i> View Diagnostic Report
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- Render Digital Prescriptions ---
  function renderPrescriptions(query) {
    const grid = document.getElementById('prescriptions-grid');
    if (!grid) return;

    const list = state.prescriptions || [];
    const filtered = list.filter(rx => {
      const text = (rx.medicine + ' ' + rx.instructions + ' ' + rx.doctor + ' ' + rx.rxNumber).toLowerCase();
      return !query || text.includes(query.toLowerCase());
    });

    grid.innerHTML = filtered.map(rx => {
      const canRefill = rx.refillsRemaining > 0;
      return `
        <div class="prescription-card" data-rx-id="${rx.id}">
          <span class="rx-badge">${rx.rxNumber}</span>
          <h4 class="rx-med-name">${rx.medicine}</h4>
          <p class="rx-dosage">${rx.strength} • ${rx.duration}</p>
          <div class="rx-meta-list">
            <div class="rx-meta-item">
              <span>Directions:</span>
              <strong>${rx.instructions}</strong>
            </div>
            <div class="rx-meta-item">
              <span>Prescribing Physician:</span>
              <strong>${rx.doctor}</strong>
            </div>
            <div class="rx-meta-item">
              <span>Issued On:</span>
              <strong>${rx.prescribedDate}</strong>
            </div>
          </div>
          <div class="rx-footer">
            <span class="refills-left">
              <i class="fa-solid fa-rotate-right"></i> Refills Remaining: <strong>${rx.refillsRemaining}</strong>
            </span>
            <button type="button" class="btn-refill" data-action="request-refill" data-id="${rx.id}" ${canRefill ? '' : 'disabled'}>
              ${canRefill ? '<i class="fa-solid fa-truck-fast"></i> Request Refill' : 'Renewal Required'}
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- Render Doctor Queue (Doctor Desk) ---
  function renderDoctorQueue() {
    const tbody = document.getElementById('doctor-queue-tbody');
    if (!tbody) return;

    const waiting = (state.appointments || []).filter(a => a.status === 'Confirmed' || a.status === 'In-Progress');
    if (waiting.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 24px; color: #64748b;">Queue is clear. No waiting patients.</td></tr>`;
      return;
    }

    tbody.innerHTML = waiting.map((apt, idx) => {
      return `
        <tr>
          <td><span class="token-badge">#${idx + 1} (${apt.token})</span></td>
          <td><strong>${apt.patientName}</strong> (${apt.patientAge}y/${apt.patientGender})</td>
          <td><span class="status-pill status-stable">Vitals Normal</span></td>
          <td style="max-width: 220px;" class="truncate text-xs text-muted">${apt.symptoms}</td>
          <td>
            <button type="button" class="btn-primary-sm" data-action="consult-patient" data-id="${apt.id}">
              <i class="fa-solid fa-stethoscope"></i> Consult
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // --- Render ICU Beds Matrix ---
  function renderICUBeds() {
    const matrix = document.getElementById('icu-bed-matrix');
    const occupiedCountEl = document.getElementById('icu-occupied-count');
    const vacantCountEl = document.getElementById('icu-vacant-count');
    const tickerVacantEl = document.getElementById('ticker-icu-vacant');
    const statIcuBedsEl = document.getElementById('stat-icu-beds');
    const tabIcuBadge = document.getElementById('tab-icu-badge');
    if (!matrix) return;

    const beds = state.icuBeds || [];
    const occupied = beds.filter(b => b.status === 'Occupied').length;
    const vacant = beds.length - occupied;

    if (occupiedCountEl) occupiedCountEl.textContent = String(occupied);
    if (vacantCountEl) vacantCountEl.textContent = String(vacant);
    if (tickerVacantEl) tickerVacantEl.textContent = vacant + ' Beds Available';
    if (statIcuBedsEl) statIcuBedsEl.textContent = vacant + ' Beds';
    if (tabIcuBadge) tabIcuBadge.textContent = vacant + ' Vacant';

    matrix.innerHTML = beds.map(bed => {
      const isOccupied = bed.status === 'Occupied';
      return `
        <div class="bed-card ${isOccupied ? 'occupied' : 'available'}" data-bed-id="${bed.id}">
          <div class="bed-header">
            <span class="bed-num">${bed.bedNumber}</span>
            <span class="bed-status-pill ${isOccupied ? 'status-occupied' : 'status-available'}">
              ${isOccupied ? 'OCCUPIED' : 'AVAILABLE'}
            </span>
          </div>
          <div class="bed-patient-info">
            <div class="bed-patient-name">${bed.patientName}</div>
            <div class="bed-condition">${bed.condition}</div>
            <div class="bed-meta">
              <i class="fa-solid fa-lungs"></i> <span>${bed.ventilator}</span>
            </div>
          </div>
          <button type="button" class="bed-action-btn" data-action="${isOccupied ? 'discharge-bed' : 'admit-bed'}" data-id="${bed.id}">
            ${isOccupied ? '<i class="fa-solid fa-arrow-right-from-bracket"></i> Discharge Patient' : '<i class="fa-solid fa-truck-medical"></i> Admit Patient'}
          </button>
        </div>
      `;
    }).join('');
  }

  // --- Render Pharmacy Catalog ---
  function renderPharmacy(query) {
    const tbody = document.getElementById('pharmacy-tbody');
    if (!tbody) return;

    const items = (state.pharmacyCatalog || []).filter(item => {
      const text = (item.code + ' ' + item.name + ' ' + item.category).toLowerCase();
      return !query || text.includes(query.toLowerCase());
    });

    tbody.innerHTML = items.map(item => {
      return `
        <tr data-drug-code="${item.code}">
          <td><span class="token-badge">${item.code}</span></td>
          <td><strong>${item.name}</strong></td>
          <td><span class="dept-tag">${item.category}</span></td>
          <td>${item.form}</td>
          <td><strong class="${item.stock < 150 ? 'text-rose-400' : 'text-emerald-400'}">${item.stock} Units</strong></td>
          <td><strong>₹${item.price}.00</strong></td>
          <td>${item.rxReq ? '<span class="status-chip status-cancelled">Rx Required</span>' : '<span class="status-chip status-confirmed">OTC Available</span>'}</td>
          <td>
            <div class="table-action-btns">
              <button type="button" class="btn-table-action" data-action="dispense-drug" data-code="${item.code}">
                Dispense -10
              </button>
              <button type="button" class="btn-table-action" data-action="restock-drug" data-code="${item.code}">
                + Restock 50
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // --- Update Badge Counters across Headers and Tabs ---
  function updateBadgeCounters() {
    const apts = state.appointments || [];
    const activeApts = apts.filter(a => a.status === 'Confirmed' || a.status === 'In-Progress');
    const confirmed = apts.filter(a => a.status === 'Confirmed').length;
    const progress = apts.filter(a => a.status === 'In-Progress').length;
    const completed = apts.filter(a => a.status === 'Completed').length;
    const cancelled = apts.filter(a => a.status === 'Cancelled').length;

    const headerBadge = document.getElementById('header-apt-count');
    const tabBadge = document.getElementById('tab-apt-badge');
    if (headerBadge) headerBadge.textContent = String(activeApts.length);
    if (tabBadge) tabBadge.textContent = String(activeApts.length);

    const cAll = document.getElementById('count-apt-all');
    const cConf = document.getElementById('count-apt-confirmed');
    const cProg = document.getElementById('count-apt-progress');
    const cComp = document.getElementById('count-apt-completed');
    const cCanc = document.getElementById('count-apt-cancelled');

    if (cAll) cAll.textContent = String(apts.length);
    if (cConf) cConf.textContent = String(confirmed);
    if (cProg) cProg.textContent = String(progress);
    if (cComp) cComp.textContent = String(completed);
    if (cCanc) cCanc.textContent = String(cancelled);
  }

  // --- Modal Helpers ---
  function openModal(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('active');
      el.setAttribute('aria-hidden', 'false');
    }
  }

  function closeModal(el) {
    const modal = el.closest('.modal-backdrop');
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-backdrop').forEach(m => {
      m.classList.remove('active');
      m.setAttribute('aria-hidden', 'true');
    });
  }

  // --- Diagnostic Report Viewer Modal ---
  function openReportModal(reportId) {
    const rec = (state.ehrRecords || []).find(r => r.id === reportId);
    if (!rec) return;

    const container = document.getElementById('modal-report-content');
    if (!container) return;

    container.innerHTML = `
      <div class="clinical-report-slip">
        <div class="report-slip-header">
          <div class="report-lab-brand">
            <h3>CarePulse Central Diagnostic Pathology</h3>
            <p>NABL Accredited • ISO 15189:2022 Certified Reference Laboratory</p>
            <p style="margin-top: 4px;">National Accreditation Board for Testing and Calibration Laboratories</p>
          </div>
          <div style="text-align: right; font-size: 11.5px; color: #475569;">
            <p>Report ID: <strong>#${rec.labId}</strong></p>
            <p>Collected: <strong>${rec.date} 07:30 AM</strong></p>
            <p>Verified: <strong>${rec.date} 01:15 PM</strong></p>
          </div>
        </div>

        <div class="report-patient-meta">
          <div><span>Patient Name:</span><br><strong>${rec.patientName}</strong></div>
          <div><span>Referred By:</span><br><strong>${rec.orderingDoctor}</strong></div>
          <div><span>Specimen:</span><br><strong>${rec.specimenType}</strong></div>
        </div>

        <table class="report-data-table">
          <thead>
            <tr>
              <th>Investigation / Biomarker</th>
              <th>Observed Value</th>
              <th>Unit</th>
              <th>Biological Reference Interval</th>
              <th>Status Flag</th>
            </tr>
          </thead>
          <tbody>
            ${rec.parameters.map(p => `
              <tr>
                <td><strong>${p.name}</strong></td>
                <td><strong style="font-size: 13.5px;">${p.value}</strong></td>
                <td>${p.unit}</td>
                <td>${p.refRange}</td>
                <td>
                  <span class="report-flag ${p.flag === 'High' ? 'flag-high' : 'flag-normal'}">
                    ${p.flag.toUpperCase()}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="background: #f8fafc; border-left: 4px solid #0284c7; padding: 10px 14px; font-size: 12px; margin-bottom: 16px;">
          <strong>Clinical Pathologist Interpretation:</strong>
          <p style="margin-top: 4px; color: #334155;">${rec.findingsSummary}</p>
        </div>

        <div class="report-slip-footer">
          <div>
            <p>CarePulse Central Diagnostic Hub • 100 Feet Road, Indiranagar, Bengaluru 560038</p>
            <p>Electronic verification authenticated via SHA-256 digital signature.</p>
          </div>
          <div class="pathologist-sign">
            <p style="font-style: italic; color: #0284c7; font-family: cursive; font-size: 16px;">${rec.pathologist.split(',')[0]}</p>
            <p>${rec.pathologist}</p>
          </div>
        </div>
      </div>
    `;

    openModal('modal-report');
  }

  // --- Appointment Slip Viewer Modal ---
  function openSlipModal(aptId) {
    const apt = (state.appointments || []).find(a => a.id === aptId);
    if (!apt) return;

    const container = document.getElementById('modal-slip-content');
    if (!container) return;

    container.innerHTML = `
      <div class="appointment-pass-card">
        <div class="pass-header">
          <div>
            <h3 style="color: #0284c7; font-weight: 800; font-size: 18px;">CarePulse Clinical OPD Pass</h3>
            <p style="font-size: 11.5px; color: #64748b;">Hospital Outpatient Consultation Ticket</p>
          </div>
          <div style="text-align: right;">
            <div class="pass-token">${apt.token}</div>
            <span style="font-size: 10.5px; text-transform: uppercase; font-weight: 700; color: #16a34a;">${apt.status}</span>
          </div>
        </div>

        <div class="pass-details-grid">
          <div>
            <strong>Patient Name:</strong>
            <span>${apt.patientName}</span>
          </div>
          <div>
            <strong>Consultant Doctor:</strong>
            <span>${apt.doctorName}</span>
          </div>
          <div>
            <strong>Department / Clinic:</strong>
            <span>${apt.department}</span>
          </div>
          <div>
            <strong>Scheduled Slot:</strong>
            <span style="color: #0284c7;">${apt.date} • ${apt.timeSlot}</span>
          </div>
          <div>
            <strong>Contact Phone:</strong>
            <span>${apt.patientPhone || '+91 98450 11223'}</span>
          </div>
          <div>
            <strong>Appointment ID:</strong>
            <span>${apt.id}</span>
          </div>
        </div>

        <div style="background: #f1f5f9; padding: 10px 14px; border-radius: 6px; font-size: 12px; margin-bottom: 16px;">
          <strong style="color: #334155;">Clinical Note:</strong>
          <p style="color: #475569; margin-top: 2px;">${apt.symptoms}</p>
        </div>

        <div class="pass-barcode-sim">
          * ${apt.id} - TOKEN-${apt.token} *
        </div>
        <p style="text-align: center; font-size: 10.5px; color: #64748b; margin-top: 6px;">
          Please arrive 15 minutes before slot time at OPD Reception Desk, Level 2.
        </p>
      </div>
    `;

    openModal('modal-slip');
  }

  // --- Reschedule Modal ---
  function openRescheduleModal(aptId) {
    const apt = (state.appointments || []).find(a => a.id === aptId);
    if (!apt) return;

    const idInput = document.getElementById('reschedule-apt-id');
    const detailsText = document.getElementById('reschedule-details-text');
    const dateInput = document.getElementById('reschedule-new-date');

    if (idInput) idInput.value = apt.id;
    if (detailsText) detailsText.textContent = `Rescheduling consultation for ${apt.patientName} with ${apt.doctorName} (Current: ${apt.date} at ${apt.timeSlot}).`;
    if (dateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.value = tomorrow.toISOString().split('T')[0];
      dateInput.min = new Date().toISOString().split('T')[0];
    }

    openModal('modal-reschedule');
  }

  // --- Emergency Admit Modal ---
  function openAdmitModal() {
    const select = document.getElementById('admit-bed-select');
    if (select) {
      const vacantBeds = (state.icuBeds || []).filter(b => b.status === 'Available');
      if (vacantBeds.length === 0) {
        showToast('All 14 ICU Beds are currently occupied! Emergency diversion required.', '⚠️');
        return;
      }
      select.innerHTML = vacantBeds.map(b => `<option value="${b.id}">${b.bedNumber} — ${b.condition}</option>`).join('');
    }
    openModal('modal-admit');
  }

  // --- Real-Time Animated ECG Waveform Simulator ---
  function setupECGMonitor() {
    const canvas = document.getElementById('ecg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let x = 0;
    let prevY = 35;
    const height = canvas.height;
    const width = canvas.width;

    function draw() {
      if (!state.vitalsActive) {
        requestAnimationFrame(draw);
        return;
      }

      ctx.fillStyle = 'rgba(2, 9, 20, 0.08)';
      ctx.fillRect(x, 0, 4, height);

      let targetY = 35;
      const cycle = x % 70;

      if (cycle === 25) targetY = 32;       // P-wave
      else if (cycle === 32) targetY = 37;  // Q-dip
      else if (cycle === 35) targetY = 8;   // R-spike peak
      else if (cycle === 38) targetY = 56;  // S-dip
      else if (cycle === 48) targetY = 28;  // T-wave
      else targetY = 35 + (Math.random() * 2 - 1);

      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(x, prevY);
      ctx.lineTo(x + 2, targetY);
      ctx.stroke();

      prevY = targetY;
      x += 2;
      if (x >= width) {
        x = 0;
        prevY = 35;
      }

      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  // --- Live Vitals Fluctuation Loop ---
  function setupVitalsLoop() {
    setInterval(() => {
      if (!state.vitalsActive) return;

      const hrEl = document.getElementById('vital-hr');
      const bpEl = document.getElementById('vital-bp');
      const spo2El = document.getElementById('vital-spo2');
      const tempEl = document.getElementById('vital-temp');

      if (hrEl) {
        const hr = 72 + Math.floor(Math.random() * 5 - 2);
        hrEl.textContent = String(hr);
      }
      if (bpEl) {
        const sys = 120 + Math.floor(Math.random() * 4 - 2);
        const dia = 80 + Math.floor(Math.random() * 3 - 1);
        bpEl.textContent = `${sys}/${dia}`;
      }
      if (spo2El) {
        const sp = 98 + Math.floor(Math.random() * 2);
        spo2El.textContent = String(Math.min(100, sp));
      }
      if (tempEl) {
        const t = (98.4 + (Math.random() * 0.4 - 0.2)).toFixed(1);
        tempEl.textContent = String(t);
      }
    }, 2400);
  }

  // --- Form Bindings ---
  function setupFormHandlers() {
    // 1. Appointment Booking Tab Form
    const bookForm = document.getElementById('appointment-booking-form');
    if (bookForm) {
      const docSelect = document.getElementById('book-doctor-select');
      const deptDisplay = document.getElementById('book-dept-display');
      const dateInput = document.getElementById('book-date');

      if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
      }

      if (docSelect && deptDisplay) {
        docSelect.addEventListener('change', () => {
          const doc = (state.doctors || []).find(d => d.id === docSelect.value);
          deptDisplay.value = doc ? `${doc.department} (Fee: ₹${doc.fee})` : '';
        });
      }

      // Slot picker clicks
      document.querySelectorAll('#slot-picker .slot-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          document.querySelectorAll('#slot-picker .slot-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
        });
      });

      bookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const docId = (document.getElementById('book-doctor-select').value || '').trim();
        const patientName = (document.getElementById('book-patient-name').value || '').trim();
        const patientPhone = (document.getElementById('book-patient-phone').value || '').trim();
        const patientAge = parseInt(document.getElementById('book-patient-age').value, 10) || 35;
        const patientGender = document.getElementById('book-patient-gender').value;
        const date = (document.getElementById('book-date').value || '').trim();
        const activeSlot = document.querySelector('#slot-picker .slot-pill.active');
        const timeSlot = activeSlot ? activeSlot.getAttribute('data-slot') : '11:00 AM';
        const symptoms = (document.getElementById('book-symptoms').value || '').trim();
        const isPriority = document.getElementById('book-emergency-flag').checked;

        if (!docId) {
          showToast('Please select a consultant doctor from the list!', '⚠️');
          return;
        }
        if (!patientName || !patientPhone || !date || !symptoms) {
          showToast('Please complete all required fields!', '⚠️');
          return;
        }

        const doctor = (state.doctors || []).find(d => d.id === docId);
        const tokenNum = (state.appointments.length + 1);
        const token = 'CP-' + (tokenNum < 10 ? '0' + tokenNum : tokenNum);
        const newApt = {
          id: 'APT-' + Math.floor(1000 + Math.random() * 9000),
          token: token,
          patientName: patientName,
          patientPhone: patientPhone,
          patientAge: patientAge,
          patientGender: patientGender,
          doctorId: docId,
          doctorName: doctor ? doctor.name : 'Attending Specialist',
          department: doctor ? doctor.department : 'General OPD',
          date: date,
          timeSlot: timeSlot,
          symptoms: symptoms,
          priority: isPriority,
          status: 'Confirmed'
        };

        state.appointments.unshift(newApt);
        saveState();

        renderAppointments('all', state.searchQuery);
        renderDoctorQueue();
        showToast(`Appointment confirmed with ${newApt.doctorName} on ${date} at ${timeSlot}! (Token #${token})`, '🎉');

        switchTab('tab-appointments');
      });
    }

    // 2. Modal Quick Booking Form
    const modalBookForm = document.getElementById('modal-booking-form');
    if (modalBookForm) {
      modalBookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const docId = document.getElementById('modal-book-doctor-id').value;
        const doctor = (state.doctors || []).find(d => d.id === docId);
        const patientName = document.getElementById('modal-book-patient-name').value.trim();
        const phone = document.getElementById('modal-book-phone').value.trim();
        const date = document.getElementById('modal-book-date').value;
        const slot = document.getElementById('modal-book-slot').value;
        const symptoms = document.getElementById('modal-book-symptoms').value.trim();

        if (!patientName || !phone || !date || !symptoms) {
          showToast('All fields required for booking.', '⚠️');
          return;
        }

        const tokenNum = (state.appointments.length + 1);
        const token = 'CP-' + (tokenNum < 10 ? '0' + tokenNum : tokenNum);
        const newApt = {
          id: 'APT-' + Math.floor(1000 + Math.random() * 9000),
          token: token,
          patientName: patientName,
          patientPhone: phone,
          patientAge: 42,
          patientGender: 'Male',
          doctorId: docId,
          doctorName: doctor ? doctor.name : 'Specialist Doctor',
          department: doctor ? doctor.department : 'OPD',
          date: date,
          timeSlot: slot,
          symptoms: symptoms,
          priority: false,
          status: 'Confirmed'
        };

        state.appointments.unshift(newApt);
        saveState();

        renderAppointments('all', state.searchQuery);
        renderDoctorQueue();
        closeAllModals();
        showToast(`Consultation booked with ${newApt.doctorName} for ${date}! Token #${token}`, '✅');
        switchTab('tab-appointments');
      });
    }

    // 3. Reschedule Form
    const rescheduleForm = document.getElementById('modal-reschedule-form');
    if (rescheduleForm) {
      rescheduleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const aptId = document.getElementById('reschedule-apt-id').value;
        const newDate = document.getElementById('reschedule-new-date').value;
        const newSlot = document.getElementById('reschedule-new-slot').value;

        const apt = (state.appointments || []).find(a => a.id === aptId);
        if (apt) {
          apt.date = newDate;
          apt.timeSlot = newSlot;
          apt.status = 'Confirmed';
          saveState();

          renderAppointments('all', state.searchQuery);
          closeAllModals();
          showToast(`Appointment ${apt.token} successfully rescheduled to ${newDate} at ${newSlot}!`, '📅');
        }
      });
    }

    // 4. Emergency ICU Admission Form
    const admitForm = document.getElementById('emergency-admit-form');
    if (admitForm) {
      admitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const patientName = document.getElementById('admit-patient-name').value.trim();
        const ageGender = document.getElementById('admit-age-gender').value.trim();
        const bedId = document.getElementById('admit-bed-select').value;
        const triage = document.getElementById('admit-triage').value;
        const condition = document.getElementById('admit-condition').value.trim();

        if (!patientName || !bedId || !condition) {
          showToast('Please fill in complete patient admission details!', '⚠️');
          return;
        }

        const bed = (state.icuBeds || []).find(b => b.id === bedId);
        if (bed) {
          bed.status = 'Occupied';
          bed.patientName = `${patientName} (${ageGender})`;
          bed.condition = condition;
          bed.ventilator = triage.includes('Red') ? 'EV300 Active (Intubated)' : 'High-Flow O2 Ready';
          bed.admitDate = new Date().toISOString().split('T')[0];

          saveState();
          renderICUBeds();
          closeAllModals();
          showToast(`Patient ${patientName} admitted to ${bed.bedNumber} (${triage})!`, '🚨');
        }
      });
    }

    // 5. Doctor Issue Prescription Form (Doctor Desk)
    const issueRxForm = document.getElementById('doctor-issue-rx-form');
    if (issueRxForm) {
      issueRxForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const patient = document.getElementById('rx-patient-select').value;
        const diagnosis = document.getElementById('rx-diagnosis-input').value.trim();
        const medName = document.getElementById('rx-medication-name').value.trim();
        const schedule = document.getElementById('rx-dosage-schedule').value.trim();
        const duration = document.getElementById('rx-duration').value.trim() || '30 Days';
        const refills = parseInt(document.getElementById('rx-refills').value, 10) || 2;

        if (!medName || !schedule) {
          showToast('Medication and dosage schedule are mandatory.', '⚠️');
          return;
        }

        const newRx = {
          id: 'RX-' + Math.floor(700 + Math.random() * 200),
          rxNumber: 'CARE-RX-' + Math.floor(1000 + Math.random() * 9000),
          medicine: medName,
          strength: duration,
          instructions: schedule,
          duration: duration,
          doctor: 'Dr. Sarah Jenkins (Cardiology)',
          prescribedDate: new Date().toISOString().split('T')[0],
          refillsRemaining: refills,
          status: 'Active'
        };

        state.prescriptions.unshift(newRx);
        saveState();

        renderPrescriptions(state.searchQuery);
        showToast(`Digital Prescription for ${medName} signed & committed to EHR!`, '✍️');
        issueRxForm.reset();
      });
    }

    // 6. Global Omnisearch Input
    const searchInput = document.getElementById('site-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const q = (e.target.value || '').trim();
        state.searchQuery = q;
        renderDoctors('all', q);
        renderAppointments('all', q);
        renderEHR(q);
        renderPrescriptions(q);
        renderPharmacy(q);
      });
    }
  }

  // --- Global Event Delegation ---
  function setupEventDelegation() {
    document.addEventListener('click', (e) => {
      // 1. Role Buttons
      const roleBtn = e.target.closest('.role-btn');
      if (roleBtn) {
        e.preventDefault();
        const role = roleBtn.getAttribute('data-role');
        switchRole(role);
        return;
      }

      // 2. Navigation Tab Buttons
      const tabBtn = e.target.closest('.nav-tab-btn');
      if (tabBtn) {
        e.preventDefault();
        const tabId = tabBtn.getAttribute('data-tab');
        switchTab(tabId);
        return;
      }

      // 3. Quick Emergency Admit from Header
      const admitBtn = e.target.closest('#btn-quick-admit');
      if (admitBtn) {
        e.preventDefault();
        openAdmitModal();
        return;
      }

      // 4. Header Appointments button
      const hdrAptBtn = e.target.closest('#btn-header-appointments');
      if (hdrAptBtn) {
        e.preventDefault();
        switchTab('tab-appointments');
        return;
      }

      // 5. Doctor Filter Chips
      const deptChip = e.target.closest('.doctor-filter-tabs .filter-chip');
      if (deptChip) {
        e.preventDefault();
        document.querySelectorAll('.doctor-filter-tabs .filter-chip').forEach(c => c.classList.remove('active'));
        deptChip.classList.add('active');
        const dept = deptChip.getAttribute('data-dept');
        renderDoctors(dept, state.searchQuery);
        return;
      }

      // 6. Appointment Status Filter Chips
      const aptStatusChip = e.target.closest('#apt-status-filter .filter-chip');
      if (aptStatusChip) {
        e.preventDefault();
        document.querySelectorAll('#apt-status-filter .filter-chip').forEach(c => c.classList.remove('active'));
        aptStatusChip.classList.add('active');
        const status = aptStatusChip.getAttribute('data-status');
        renderAppointments(status, state.searchQuery);
        return;
      }

      // 7. Book Consultation from Doctor Card
      const bookDocBtn = e.target.closest('[data-action="book-doctor"]');
      if (bookDocBtn) {
        e.preventDefault();
        const docId = bookDocBtn.getAttribute('data-doc-id');
        const doc = (state.doctors || []).find(d => d.id === docId);
        if (doc) {
          const modalIdInput = document.getElementById('modal-book-doctor-id');
          const modalAvatar = document.getElementById('modal-doc-avatar');
          const modalName = document.getElementById('modal-doc-name');
          const modalSpec = document.getElementById('modal-doc-spec');
          const dateInput = document.getElementById('modal-book-date');

          if (modalIdInput) modalIdInput.value = doc.id;
          if (modalAvatar) modalAvatar.src = doc.avatar;
          if (modalName) modalName.textContent = doc.name;
          if (modalSpec) modalSpec.textContent = `${doc.department} • ₹${doc.fee} Consultation Fee`;
          if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
            dateInput.value = today;
          }
          openModal('modal-booking');
        }
        return;
      }

      // 8. View Diagnostic Report Modal
      const openReportBtn = e.target.closest('[data-action="open-report-modal"]');
      if (openReportBtn) {
        e.preventDefault();
        const id = openReportBtn.getAttribute('data-id');
        openReportModal(id);
        return;
      }

      // 9. View Appointment Slip
      const viewSlipBtn = e.target.closest('[data-action="view-slip"]');
      if (viewSlipBtn) {
        e.preventDefault();
        const id = viewSlipBtn.getAttribute('data-id');
        openSlipModal(id);
        return;
      }

      // 10. Cancel Appointment
      const cancelAptBtn = e.target.closest('[data-action="cancel-apt"]');
      if (cancelAptBtn) {
        e.preventDefault();
        const id = cancelAptBtn.getAttribute('data-id');
        const apt = (state.appointments || []).find(a => a.id === id);
        if (apt) {
          if (confirm(`Are you sure you want to cancel appointment ${apt.token} with ${apt.doctorName}?`)) {
            apt.status = 'Cancelled';
            saveState();
            renderAppointments('all', state.searchQuery);
            renderDoctorQueue();
            showToast(`Appointment ${apt.token} has been cancelled.`, 'ℹ️');
          }
        }
        return;
      }

      // 11. Reschedule Appointment
      const rescheduleBtn = e.target.closest('[data-action="reschedule"]');
      if (rescheduleBtn) {
        e.preventDefault();
        const id = rescheduleBtn.getAttribute('data-id');
        openRescheduleModal(id);
        return;
      }

      // 12. Request Prescription Refill
      const refillBtn = e.target.closest('[data-action="request-refill"]');
      if (refillBtn) {
        e.preventDefault();
        const id = refillBtn.getAttribute('data-id');
        const rx = (state.prescriptions || []).find(r => r.id === id);
        if (rx && rx.refillsRemaining > 0) {
          rx.refillsRemaining -= 1;
          if (rx.refillsRemaining === 0) rx.status = 'Completed';
          saveState();
          renderPrescriptions(state.searchQuery);
          showToast(`Refill request for ${rx.medicine} dispatched to Central Pharmacy! (${rx.refillsRemaining} refills left)`, '💊');
        }
        return;
      }

      // 13. ICU Bed Discharge
      const dischargeBedBtn = e.target.closest('[data-action="discharge-bed"]');
      if (dischargeBedBtn) {
        e.preventDefault();
        const id = dischargeBedBtn.getAttribute('data-id');
        const bed = (state.icuBeds || []).find(b => b.id === id);
        if (bed) {
          if (confirm(`Confirm discharge of patient ${bed.patientName} from ${bed.bedNumber}?`)) {
            const dischargedPatient = bed.patientName;
            bed.status = 'Available';
            bed.patientName = 'Unassigned';
            bed.condition = 'Sanitized & High-Flow O2 Ready';
            bed.ventilator = 'EV300 Standby';
            bed.admitDate = '-';

            saveState();
            renderICUBeds();
            showToast(`Patient ${dischargedPatient} discharged from ${bed.bedNumber}. Bed sanitized.`, '✅');
          }
        }
        return;
      }

      // 14. ICU Bed Admit
      const admitBedBtn = e.target.closest('[data-action="admit-bed"]');
      if (admitBedBtn) {
        e.preventDefault();
        const id = admitBedBtn.getAttribute('data-id');
        openAdmitModal();
        const select = document.getElementById('admit-bed-select');
        if (select) select.value = id;
        return;
      }

      // 15. Pharmacy Dispense & Restock
      const dispenseBtn = e.target.closest('[data-action="dispense-drug"]');
      if (dispenseBtn) {
        e.preventDefault();
        const code = dispenseBtn.getAttribute('data-code');
        const drug = (state.pharmacyCatalog || []).find(d => d.code === code);
        if (drug && drug.stock >= 10) {
          drug.stock -= 10;
          saveState();
          renderPharmacy(state.searchQuery);
          showToast(`Dispensed 10 units of ${drug.name} to Ward. Remaining: ${drug.stock}`, '📦');
        }
        return;
      }

      const restockBtn = e.target.closest('[data-action="restock-drug"]');
      if (restockBtn) {
        e.preventDefault();
        const code = restockBtn.getAttribute('data-code');
        const drug = (state.pharmacyCatalog || []).find(d => d.code === code);
        if (drug) {
          drug.stock += 50;
          saveState();
          renderPharmacy(state.searchQuery);
          showToast(`Restocked 50 units of ${drug.name}. Current stock: ${drug.stock}`, '📥');
        }
        return;
      }

      // 16. Consult Patient button in Doctor Queue
      const consultBtn = e.target.closest('[data-action="consult-patient"]');
      if (consultBtn) {
        e.preventDefault();
        const id = consultBtn.getAttribute('data-id');
        const apt = (state.appointments || []).find(a => a.id === id);
        if (apt) {
          apt.status = 'In-Progress';
          saveState();
          renderAppointments('all', state.searchQuery);
          renderDoctorQueue();
          showToast(`Now consulting ${apt.patientName}. Telemetry linked to Doctor Desk.`, '🩺');
        }
        return;
      }

      // 17. Modal Close Buttons and Backdrop click
      if (e.target.matches('[data-close-modal]') || e.target.classList.contains('modal-backdrop')) {
        closeAllModals();
        return;
      }

      // 18. Toggle Vitals Telemetry Button
      const toggleVitalsBtn = e.target.closest('#btn-toggle-telemetry');
      if (toggleVitalsBtn) {
        e.preventDefault();
        state.vitalsActive = !state.vitalsActive;
        toggleVitalsBtn.innerHTML = state.vitalsActive
          ? '<i class="fa-solid fa-pause"></i> <span>Pause Telemetry</span>'
          : '<i class="fa-solid fa-play"></i> <span>Resume Telemetry</span>';
        const badge = document.getElementById('vitals-status-badge');
        if (badge) {
          badge.textContent = state.vitalsActive ? 'STABLE' : 'PAUSED';
          badge.className = 'status-pill ' + (state.vitalsActive ? 'status-stable' : 'status-warning');
        }
        showToast(state.vitalsActive ? 'Real-time telemetry resumed.' : 'Telemetry monitor paused.', 'ℹ️');
        return;
      }

      // 19. Trigger Vitals Alert Simulation
      const triggerAlertBtn = e.target.closest('#btn-trigger-alert');
      if (triggerAlertBtn) {
        e.preventDefault();
        const hrEl = document.getElementById('vital-hr');
        const badge = document.getElementById('vitals-status-badge');
        if (hrEl) hrEl.textContent = '114';
        if (badge) {
          badge.textContent = 'TACHYCARDIA';
          badge.className = 'status-pill status-warning';
        }
        showToast('⚠️ Telemetry Alert: Elevated Heart Rate (114 BPM) detected for Patient #CP-8842!', '🚨');
        setTimeout(() => {
          if (hrEl) hrEl.textContent = '74';
          if (badge) {
            badge.textContent = 'STABLE';
            badge.className = 'status-pill status-stable';
          }
        }, 5000);
        return;
      }
    });
  }

  // --- Exposed Global App Controller ---
  window.CarePulseApp = {
    getState: () => state,
    switchRole: switchRole,
    switchTab: switchTab,
    openAdmitModal: openAdmitModal,
    openReportModal: openReportModal,
    openSlipModal: openSlipModal,
    printDiagnosticReport: () => {
      window.print();
    }
  };

  // --- Initialization ---
  function init() {
    renderDoctors('all', '');
    renderAppointments('all', '');
    renderEHR('');
    renderPrescriptions('');
    renderDoctorQueue();
    renderICUBeds();
    renderPharmacy('');

    setupFormHandlers();
    setupEventDelegation();
    setupECGMonitor();
    setupVitalsLoop();

    if (state.activeRole && state.activeRole !== 'patient') {
      switchRole(state.activeRole);
    }

    console.log('[CarePulse] Hospital ERP Runtime initialized. State active.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
