```javascript
// app.js - Usopp's Backend & Application Logic Engine
// Straw Hat Dev Crew - Clinical Health & Hospital Management ERP System

(function () {
  'use strict';

  // --- 1. TOAST NOTIFICATION SYSTEM ---
  function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    const bg = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
    toast.style.cssText = `background: ${bg}; color: #fff; padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 600; opacity: 0; transition: opacity 0.3s ease;`;
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => { toast.style.opacity = '1'; });
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
  window.phToast = showToast;

  // --- 2. INITIAL SEED DATA & STATE MANAGEMENT ---
  const STORAGE_KEY = 'strawhat_hospital_erp_state_v1';

  const defaultState = {
    searchQuery: '',
    activeCategory: 'all',
    appointments: [
      { id: 1, patientName: 'Roronoa Zoro', doctor: 'Dr. T. Law (Cardiothoracic)', date: '2025-05-12', time: '10:00 AM', status: 'Confirmed', service: 'consultation' },
      { id: 2, patientName: 'Nami Swan', doctor: 'Dr. C. Chopper (Pediatrics & General)', date: '2025-05-12', time: '11:30 AM', status: 'Pending', service: 'consultation' },
      { id: 3, patientName: 'Vinsmoke Sanji', doctor: 'Dr. K. Kure (Internal Medicine)', date: '2025-05-13', time: '02:00 PM', status: 'Confirmed', service: 'consultation' }
    ],
    doctors: [
      { id: 101, name: 'Dr. Tony Tony Chopper', spec: 'Pediatrics & General Medicine', dept: 'consultation', status: 'On Duty', room: 'Room 302' },
      { id: 102, name: 'Dr. Trafalgar Law', spec: 'Cardiothoracic Surgery', dept: 'consultation', status: 'In Surgery', room: 'OR 04' },
      { id: 103, name: 'Dr. Kureha', spec: 'Internal Medicine & Pharmacology', dept: 'pharmacy', status: 'On Duty', room: 'Room 108' },
      { id: 104, name: 'Dr. Hogback', spec: 'Neurology & Diagnostics', dept: 'diagnostics', status: 'Off Duty', room: 'Lab 02' }
    ],
    icuBeds: [
      { bedNo: 'ICU-01', status: 'Occupied', patient: 'Edward Newgate', vitals: 'BP: 110/70, HR: 78' },
      { bedNo: 'ICU-02', status: 'Available', patient: '-', vitals: '-' },
      { bedNo: 'ICU-03', status: 'Occupied', patient: 'Silvers Rayleigh', vitals: 'BP: 120/80, HR: 72' },
      { bedNo: 'ICU-04', status: 'Available', patient: '-', vitals: '-' },
      { bedNo: 'ICU-05', status: 'Available', patient: '-', vitals: '-' },
      { bedNo: 'ICU-06', status: 'Occupied', patient: 'Marshall D. Teach', vitals: 'BP: 140/95, HR: 88' }
    ],
    labReports: [
      { id: 'LAB-501', patient: 'Monkey D. Luffy', test: 'Complete Blood Count (CBC)', status: 'Completed', result: 'Normal', date: '2025-05-10' },
      { id: 'LAB-502', patient: 'Nico Robin', test: 'MRI Brain Scan', status: 'Pending', result: 'Awaiting Radiology', date: '2025-05-11' },
      { id: 'LAB-503', patient: 'Franky', test: 'Lipid Profile & Serum Creatinine', status: 'Completed', result: 'Optimal', date: '2025-05-11' }
    ],
    patients: [
      { id: 201, name: 'Monkey D. Luffy', age: 19, gender: 'Male', blood: 'O+', condition: 'Hyperactivity / Appetite Surge' },
      { id: 202, name: 'Roronoa Zoro', age: 21, gender: 'Male', blood: 'AB+', condition: 'Severe Lacerations & Recovery' },
      { id: 203, name: 'Nami', age: 20, gender: 'Female', blood: 'X', condition: 'Fatigue / Weather Stress' }
    ]
  };

  let appState = loadState();

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('State load error:', e);
    }
    return JSON.parse(JSON.stringify(defaultState));
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
      console.error('State save error:', e);
    }
  }

  // --- 3. DOM & UI RENDERING ENGINE ---
  function initApp() {
    bindGlobalEvents();
    renderDynamicDashboard();
    updateAppointmentBadge();
    showToast('Hospital Management ERP Engine Active!', 'success');
  }

  function updateAppointmentBadge() {
    const badge = document.getElementById('cart-count');
    if (badge) {
      badge.textContent = appState.appointments.length;
    }
  }

  function renderDynamicDashboard() {
    // If dynamic container exists, update it, otherwise inject custom UI dashboard panels into main content
    let mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    // Check if dynamic workspace container already exists
    let dynamicArea = document.getElementById('dynamic-erp-workspace');
    if (!dynamicArea) {
      dynamicArea = document.createElement('div');
      dynamicArea.id = 'dynamic-erp-workspace';
      dynamicArea.className = 'mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6';
      mainContent.appendChild(dynamicArea);
    }

    // Filter appointments and doctors based on active search & category
    const query = (appState.searchQuery || '').toLowerCase();
    
    const filteredAppts = appState.appointments.filter(a => 
      a.patientName.toLowerCase().includes(query) || a.doctor.toLowerCase().includes(query) || a.status.toLowerCase().includes(query)
    );

    const filteredDocs = appState.doctors.filter(d => 
      d.name.toLowerCase().includes(query) || d.spec.toLowerCase().includes(query)
    );

    const filteredLabs = appState.labReports.filter(l => 
      l.patient.toLowerCase().includes(query) || l.test.toLowerCase().includes(query) || l.id.toLowerCase().includes(query)
    );

    dynamicArea.innerHTML = `
      <!-- Column 1: Appointments & Booking Desk -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <i class="fa-solid fa-calendar-check text-emerald-400"></i> Appointment Desk
            </h3>
            <button type="button" id="open-book-modal" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition">+ Book New</button>
          </div>
          <div class="space-y-3 max-h-72 overflow-y-auto pr-1">
            ${filteredAppts.length === 0 ? '<p class="text-slate-400 text-sm py-4 text-center">No appointments found.</p>' : 
              filteredAppts.map(apt => `
                <div class="p-3 bg-slate-800/80 border border-slate-700/60 rounded-xl flex items-center justify-between text-sm">
                  <div>
                    <div class="font-bold text-white">${apt.patientName}</div>
                    <div class="text-xs text-slate-400">${apt.doctor} • ${apt.date} at ${apt.time}</div>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 text-[10px] font-bold rounded-full ${apt.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}">${apt.status}</span>
                    <button type="button" data-action="cancel-apt" data-id="${apt.id}" class="text-slate-400 hover:text-red-400 transition p-1" title="Cancel Appointment"><i class="fa-solid fa-trash-can text-xs"></i></button>
                  </div>
                </div>
              `).join('')}
          </div>
        </div>
        <div class="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 flex justify-between items-center">
          <span>Total Bookings: <strong class="text-white">${appState.appointments.length}</strong></span>
          <span class="text-emerald-400">Sync Active</span>
        </div>
      </div>

      <!-- Column 2: ICU Vacancy Telemetry & Doctor Desk -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <i class="fa-solid fa-bed-pulse text-cyan-400"></i> ICU & Doctor Roster
            </h3>
            <span class="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-bold rounded-lg border border-cyan-500/30">14 Beds Free</span>
          </div>
          <div class="space-y-3 max-h-72 overflow-y-auto pr-1">
            <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">ICU Telemetry Status</div>
            <div class="grid grid-cols-3 gap-2 mb-4">
              ${appState.icuBeds.map(bed => `
                <div class="p-2 bg-slate-800 border ${bed.status === 'Available' ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-rose-500/40 bg-rose-950/20'} rounded-lg text-center">
                  <div class="text-[11px] font-bold text-white">${bed.bedNo}</div>
                  <div class="text-[10px] ${bed.status === 'Available' ? 'text-emerald-400' : 'text-rose-400'}">${bed.status}</div>
                </div>
              `).join('')}
            </div>
            <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">On-Duty Specialists</div>
            ${filteredDocs.map(doc => `
              <div class="p-2.5 bg-slate-800/60 border border-slate-700/60 rounded-xl flex items-center justify-between text-sm">
                <div>
                  <div class="font-bold text-white">${doc.name}</div>
                  <div class="text-xs text-slate-400">${doc.spec} • ${doc.room}</div>
                </div>
                <span class="text-xs font-semibold text-emerald-400">${doc.status}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 flex justify-between items-center">
          <span>Active Doctors: <strong class="text-white">${appState.doctors.length}</strong></span>
          <button type="button" id="open-doc-modal" class="text-cyan-400 hover:underline font-semibold">+ Add Doctor</button>
        </div>
      </div>

      <!-- Column 3: Lab Reports & Patient EHR -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <i class="fa-solid fa-microscope text-amber-400"></i> Lab Diagnostics & EHR
            </h3>
            <button type="button" id="open-lab-modal" class="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition">+ New Test</button>
          </div>
          <div class="space-y-3 max-h-72 overflow-y-auto pr-1">
            ${filteredLabs.map(lab => `
              <div class="p-3 bg-slate-800/80 border border-slate-700/60 rounded-xl flex items-center justify-between text-sm">
                <div>
                  <div class="font-bold text-white">${lab.patient} <span class="text-xs font-normal text-slate-400">(${lab.id})</span></div>
                  <div class="text-xs text-slate-300 mt-0.5">${lab.test}</div>
                  <div class="text-[11px] text-amber-400 mt-1">Result: ${lab.result}</div>
                </div>
                <span class="px-2 py-1 text-xs rounded-lg ${lab.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}">${lab.status}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 flex justify-between items-center">
          <span>Registered Patients: <strong class="text-white">${appState.patients.length}</strong></span>
          <button type="button" id="open-patient-modal" class="text-amber-400 hover:underline font-semibold">+ Patient EHR</button>
        </div>
      </div>
    `;

    bindDynamicActions();
  }

  // --- 4. MODAL DIALOG ENGINE ---
  function openModal(modalId, htmlContent) {
    let backdrop = document.getElementById('erp-modal-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'erp-modal-backdrop';
      backdrop.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 10000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px);';
      document.body.appendChild(backdrop);
    }
    backdrop.innerHTML = `
      <div class="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative text-slate-100 font-['Plus_Jakarta_Sans']" id="erp-modal-box">
        <button type="button" id="close-modal-btn" class="absolute top-4 right-4 text-slate-400 hover:text-white text-lg"><i class="fa-solid fa-xmark"></i></button>
        ${htmlContent}
      </div>
    `;
    backdrop.style.display = 'flex';

    document.getElementById('close-modal-btn').onclick = closeModal;
    backdrop.onclick = (e) => {
      if (e.target === backdrop) closeModal();
    };
  }

  function closeModal() {
    const backdrop = document.getElementById('erp-modal-backdrop');
    if (backdrop) backdrop.style.display = 'none';
  }

  // --- 5. EVENT BINDINGS & USER ACTIONS ---
  function bindGlobalEvents() {
    // Search Form submission & live input
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('site-search');

    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (searchInput) {
          appState.searchQuery = searchInput.value.trim();
          renderDynamicDashboard();
          showToast(`Filtered results for: "${appState.searchQuery}"`, 'info');
        }
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        appState.searchQuery = e.target.value.trim();
        renderDynamicDashboard();
      });
    }

    // Header Emergency Button
    const emergencyBtn = document.querySelector('.emergency-btn');
    if (emergencyBtn) {
      emergencyBtn.addEventListener('click', () => {
        openModal('emergency-modal', `
          <h3 class="text-xl font-bold text-rose-500 mb-3 flex items-center gap-2"><i class="fa-solid fa-truck-medical"></i> Emergency Response Activated</h3>
          <p class="text-sm text-slate-300 mb-4">Trauma team has been paged. Ambulance dispatched to priority sector.</p>
          <div class="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-2 text-sm">
            <div><strong>Hotline:</strong> 108 / +91 800-CARE-911</div>
            <div><strong>ICU Status:</strong> 14 Beds Ready</div>
            <div><strong>Trauma Surgeon On-Call:</strong> Dr. T. Law</div>
          </div>
          <button type="button" onclick="document.getElementById('close-modal-btn').click()" class="mt-5 w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition">Acknowledge Alert</button>
        `);
      });
    }

    // Appointments Header Button / Cart Button
    const cartButton = document.getElementById('cart-button');
    if (cartButton) {
      cartButton.addEventListener('click', () => {
        renderDynamicDashboard();
        showToast('Viewing Appointments & Patient Schedule', 'info');
      });
    }

    // Department Filter Buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        appState.activeCategory = btn.getAttribute('data-category') || 'all';
        showToast(`Filtered Department: ${btn.textContent.trim()}`, 'info');
        renderDynamicDashboard();
      });
    });

    // Global click delegate for dynamically rendered buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      if (btn.id === 'open-book-modal') {
        openBookAppointmentModal();
      } else if (btn.id === 'open-doc-modal') {
        openAddDoctorModal();
      } else if (btn.id === 'open-lab-modal') {
        openAddLabModal();
      } else if (btn.id === 'open-patient-modal') {
        openAddPatientModal();
      }

      const action = btn.getAttribute('data-action');
      const id = btn.getAttribute('data-id');

      if (action === 'cancel-apt' && id) {
        appState.appointments = appState.appointments.filter(a => a.id != id);
        saveState();
        renderDynamicDashboard();
        updateAppointmentBadge();
        showToast('Appointment canceled successfully', 'error');
      }
    });
  }

  function bindDynamicActions() {
    // Handled inside global delegate
  }

  // --- 6. MODAL FORMS & CRUD OPERATIONS ---
  function openBookAppointmentModal() {
    openModal('book-apt', `
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2"><i class="fa-solid fa-calendar-plus text-emerald-400"></i> Book New Appointment</h3>
      <form id="book-apt-form" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Patient Full Name</label>
          <input type="text" id="apt-patient" required class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" placeholder="e.g. Jinbe">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Select Specialist Doctor</label>
          <select id="apt-doctor" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500">
            ${appState.doctors.map(d => `<option value="${d.name} (${d.spec})">${d.name} — ${d.spec}</option>`).join('')}
          </select>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Date</label>
            <input type="date" id="apt-date" required class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" value="2025-05-15">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Time Slot</label>
            <input type="text" id="apt-time" required class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" value="11:00 AM">
          </div>
        </div>
        <button type="submit" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-lg">Confirm & Schedule</button>
      </form>
    `);

    document.getElementById('book-apt-form').onsubmit = (e) => {
      e.preventDefault();
      const newApt = {
        id: Date.now(),
        patientName: document.getElementById('apt-patient').value.trim(),
        doctor: document.getElementById('apt-doctor').value,
        date: document.getElementById('apt-date').value,
        time: document.getElementById('apt-time').value,
        status: 'Confirmed',
        service: 'consultation'
      };
      appState.appointments.push(newApt);
      saveState();
      renderDynamicDashboard();
      updateAppointmentBadge();
      closeModal();
      showToast(`Appointment successfully booked for ${newApt.patientName}!`, 'success');
    };
  }

  function openAddDoctorModal() {
    openModal('add-doc', `
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2"><i class="fa-solid fa-user-doctor text-cyan-400"></i> Register New Specialist</h3>
      <form id="add-doc-form" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Doctor Name</label>
          <input type="text" id="doc-name" required class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white" placeholder="Dr. Vegapunk">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Specialization</label>
          <input type="text" id="doc-spec" required class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white" placeholder="Advanced Cybernetics & Neurology">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Assigned Room / Ward</label>
          <input type="text" id="doc-room" required class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white" placeholder="Lab 09">
        </div>
        <button type="submit" class="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition">Register Doctor</button>
      </form>
    `);

    document.getElementById('add-doc-form').onsubmit = (e) => {
      e.preventDefault();
      const newDoc = {
        id: Date.now(),
        name: document.getElementById('doc-name').value.trim(),
        spec: document.getElementById('doc-spec').value.trim(),
        dept: 'consultation',
        status: 'On Duty',
        room: document.getElementById('doc-room').value.trim()
      };
      appState.doctors.push(newDoc);
      saveState();
      renderDynamicDashboard();
      closeModal();
      showToast(`Specialist ${newDoc.name} added to roster!`, 'success');
    };
  }

  function openAddLabModal() {
    openModal('add-lab', `
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2"><i class="fa-solid fa-microscope text-amber-400"></i> Order Lab Diagnostics</h3>
      <form id="add-lab-form" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Patient Name</label>
          <input type="text" id="lab-patient" required class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white" placeholder="Brook">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Diagnostic Test</label>
          <input type="text" id="lab-test" required class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white" placeholder="Bone Density & Calcium Analysis">
        </div>
        <button type="submit" class="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition">Submit Test Order</button>
      </form>
    `);

    document.getElementById('add-lab-form').onsubmit = (e) => {
      e.preventDefault();
      const newLab = {
        id: 'LAB-' + Math.floor(100 + Math.random() * 900),
        patient: document.getElementById('lab-patient').value.trim(),
        test: document.getElementById('lab-test').value.trim(),
        status: 'Pending',
        result: 'Processing in Lab',
        date: new Date().toISOString().split('T')[0]
      };
      appState.labReports.unshift(newLab);
      saveState();
      renderDynamicDashboard();
      closeModal();
      showToast(`Lab test ${newLab.id} ordered successfully!`, 'success');
    };
  }

  function openAddPatientModal() {
    openModal('add-patient', `
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2"><i class="fa-solid fa-file-medical text-amber-400"></i> New Patient EHR Record</h3>
      <form id="add-patient-form" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Patient Full Name</label>
          <input type="text" id="p-name" required class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white" placeholder="Tony Chopper">
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Age</label>
            <input type="number" id="p-age" required class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white" value="17">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Blood Group</label>
            <input type="text" id="p-blood" required class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white" value="S Rh-">
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Initial Condition / Diagnosis</label>
          <input type="text" id="p-cond" required class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white" placeholder="Routine Clinical Checkup">
        </div>
        <button type="submit" class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition">Create EHR Profile</button>
      </form>
    `);

    document.getElementById('add-patient-form').onsubmit = (e) => {
      e.preventDefault();
      const newP = {
        id: Date.now(),
        name: document.getElementById('p-name').value.trim(),
        age: document.getElementById('p-age').value,
        blood: document.getElementById('p-blood').value.trim(),
        condition: document.getElementById('p-cond').value.trim()
      };
      appState.patients.push(newP);
      saveState();
      renderDynamicDashboard();
      closeModal();
      showToast(`Patient EHR profile created for ${newP.name}!`, 'success');
    };
  }

  // --- INITIALIZE APPLICATION UPON DOM READY ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
```