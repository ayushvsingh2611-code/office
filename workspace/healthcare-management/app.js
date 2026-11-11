// app.js - MediCore HMS Backend & Application Logic Engine
// Author: Usopp (Backend & Application Logic Engineer)

document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. DEMO DATA & LOCALSTORAGE STATE ENGINE
    // ---------------------------------------------------------
    const STORAGE_KEY = 'MEDICORE_HMS_STATE_V2';

    const defaultSeedState = {
        patients: [
            { id: 'PAT-1001', name: 'Eleanor Vance', age: 42, gender: 'Female', bloodGroup: 'A+', condition: 'Stable', phone: '+1 (555) 234-5678', lastVisit: '2023-10-12', notes: 'Mild hypertension, prescribed ACE inhibitors.' },
            { id: 'PAT-1002', name: 'Marcus Brody', age: 58, gender: 'Male', bloodGroup: 'O-', condition: 'Critical', phone: '+1 (555) 876-5432', lastVisit: '2023-10-14', notes: 'Post-myocardial infarction monitoring. Requires strict rest.' },
            { id: 'PAT-1003', name: 'Sophia Chen', age: 29, gender: 'Female', bloodGroup: 'B+', condition: 'Recovering', phone: '+1 (555) 345-6789', lastVisit: '2023-10-10', notes: 'Post-op knee arthroscopy recovery normal.' },
            { id: 'PAT-1004', name: 'Arthur Pendelton', age: 71, gender: 'Male', bloodGroup: 'AB+', condition: 'Observation', phone: '+1 (555) 901-2345', lastVisit: '2023-10-15', notes: 'Memory lapses and geriatric cognitive screening.' }
        ],
        doctors: [
            { id: 'DOC-201', name: 'Dr. Sarah Jenkins', specialty: 'Cardiology', department: 'Cardiology', availability: 'Mon, Wed, Fri', rating: 4.9, patientsCount: 142, image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150' },
            { id: 'DOC-202', name: 'Dr. Robert Thorne', specialty: 'Neurology', department: 'Neurology', availability: 'Tue, Thu', rating: 4.8, patientsCount: 98, image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150' },
            { id: 'DOC-203', name: 'Dr. Emily Watson', specialty: 'Pediatrics', department: 'Pediatrics', availability: 'Mon - Fri', rating: 5.0, patientsCount: 215, image: 'https://images.unsplash.com/photo-1594824813568-a40058e57f5c?auto=format&fit=crop&q=80&w=150' },
            { id: 'DOC-204', name: 'Dr. Liam Montgomery', specialty: 'Orthopedics', department: 'Orthopedics', availability: 'Wed, Fri', rating: 4.7, patientsCount: 130, image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=150' },
            { id: 'DOC-205', name: 'Dr. Chloe Alvarez', specialty: 'Dermatology', department: 'Dermatology', availability: 'Mon, Tue, Thu', rating: 4.9, patientsCount: 165, image: 'https://images.unsplash.com/photo-1527613426441-2da1747cb766?auto=format&fit=crop&q=80&w=150' }
        ],
        appointments: [
            { id: 'APT-501', patientId: 'PAT-1001', patientName: 'Eleanor Vance', doctorId: 'DOC-201', doctorName: 'Dr. Sarah Jenkins', department: 'Cardiology', date: '2023-10-18', time: '09:30 AM', status: 'Confirmed' },
            { id: 'APT-502', patientId: 'PAT-1002', patientName: 'Marcus Brody', doctorId: 'DOC-201', doctorName: 'Dr. Sarah Jenkins', department: 'Cardiology', date: '2023-10-18', time: '11:00 AM', status: 'Pending' },
            { id: 'APT-503', patientId: 'PAT-1003', patientName: 'Sophia Chen', doctorId: 'DOC-204', doctorName: 'Dr. Liam Montgomery', department: 'Orthopedics', date: '2023-10-19', time: '02:15 PM', status: 'Confirmed' },
            { id: 'APT-504', patientId: 'PAT-1004', patientName: 'Arthur Pendelton', doctorId: 'DOC-202', doctorName: 'Dr. Robert Thorne', department: 'Neurology', date: '2023-10-20', time: '10:00 AM', status: 'Cancelled' }
        ]
    };

    let appState = loadState();

    function loadState() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSeedState));
                return JSON.parse(JSON.stringify(defaultSeedState));
            }
            return JSON.parse(stored);
        } catch (e) {
            console.error('LocalStorage read error:', e);
            return JSON.parse(JSON.stringify(defaultSeedState));
        }
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
        } catch (e) {
            console.error('LocalStorage write error:', e);
            window.phToast('Storage quota exceeded or error occurred!', 'error');
        }
    }

    // ---------------------------------------------------------
    // 2. TOAST NOTIFICATION SYSTEM
    // ---------------------------------------------------------
    window.phToast = function(message, type = 'success') {
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'fixed bottom-5 right-5 z-50 flex flex-col space-y-3 pointer-events-none';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `pointer-events-auto flex items-center space-x-3 px-4 py-3 rounded-xl shadow-xl text-white text-sm font-medium transform translate-y-2 opacity-0 transition-all duration-300 ${
            type === 'success' ? 'bg-emerald-600 shadow-emerald-500/20' : 
            type === 'error' ? 'bg-rose-600 shadow-rose-500/20' : 'bg-brand-600 shadow-brand-500/20'
        }`;

        const icon = document.createElement('i');
        icon.className = type === 'success' ? 'fa-solid fa-circle-check text-base' : 
                       type === 'error' ? 'fa-solid fa-circle-exclamation text-base' : 'fa-solid fa-circle-info text-base';
        
        const text = document.createElement('span');
        text.textContent = message;

        toast.appendChild(icon);
        toast.appendChild(text);
        container.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-2', 'opacity-0');
        });

        setTimeout(() => {
            toast.classList.add('translate-y-2', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    };

    // ---------------------------------------------------------
    // 3. REACTIVE RENDERING & DOM UPDATES
    // ---------------------------------------------------------
    function renderApp() {
        renderDashboard();
        renderPatients();
        renderDoctors();
        renderAppointments();
        populateModalDropdowns();
    }

    function renderDashboard() {
        const kpiPat = document.getElementById('kpiTotalPatients');
        const kpiDoc = document.getElementById('kpiTotalDoctors');
        const kpiApt = document.getElementById('kpiTotalAppointments');
        const kpiCrit = document.getElementById('kpiCriticalCases');

        if (kpiPat) kpiPat.textContent = appState.patients.length;
        if (kpiDoc) kpiDoc.textContent = appState.doctors.length;
        if (kpiApt) kpiApt.textContent = appState.appointments.filter(a => a.status !== 'Cancelled').length;
        if (kpiCrit) kpiCrit.textContent = appState.patients.filter(p => p.condition === 'Critical').length;

        const tbody = document.getElementById('dashboardAppointmentsTable');
        if (!tbody) return;
        tbody.innerHTML = '';

        const activeAppts = appState.appointments.slice(0, 5);
        if (activeAppts.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="py-4 px-4 text-center text-slate-400">No scheduled appointments found.</td></tr>`;
            return;
        }

        activeAppts.forEach(apt => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-slate-50 transition-colors';
            tr.innerHTML = `
                <td class="py-3 px-4 font-semibold text-slate-800">${escapeHtml(apt.patientName)}</td>
                <td class="py-3 px-4 text-slate-600">${escapeHtml(apt.doctorName)}</td>
                <td class="py-3 px-4 text-slate-600">${escapeHtml(apt.date)} at ${escapeHtml(apt.time)}</td>
                <td class="py-3 px-4">
                    <span class="px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(apt.status)}">
                        ${escapeHtml(apt.status)}
                    </span>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function renderPatients(filteredList = null) {
        const tbody = document.getElementById('patientsTableBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        const patients = filteredList || appState.patients;
        if (patients.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="py-6 px-6 text-center text-slate-400">No patient records found.</td></tr>`;
            return;
        }

        patients.forEach(pat => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-slate-50 transition-colors';
            tr.innerHTML = `
                <td class="py-4 px-6">
                    <div class="flex items-center space-x-3">
                        <div class="h-9 w-9 rounded-full bg-brand-50 text-brand-600 font-bold flex items-center justify-center text-xs">
                            ${pat.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                        </div>
                        <div>
                            <p class="font-semibold text-slate-900">${escapeHtml(pat.name)}</p>
                            <p class="text-xs text-slate-500">${escapeHtml(pat.id)} • ${escapeHtml(pat.phone)}</p>
                        </div>
                    </div>
                </td>
                <td class="py-4 px-6 text-slate-600">${pat.age} yrs / ${escapeHtml(pat.gender)}</td>
                <td class="py-4 px-6 font-medium text-slate-700"><span class="px-2 py-0.5 bg-slate-100 rounded text-xs font-bold">${escapeHtml(pat.bloodGroup)}</span></td>
                <td class="py-4 px-6">
                    <span class="px-2.5 py-1 text-xs font-semibold rounded-full ${getConditionBadgeClass(pat.condition)}">
                        ${escapeHtml(pat.condition)}
                    </span>
                </td>
                <td class="py-4 px-6 text-slate-600">${escapeHtml(pat.lastVisit)}</td>
                <td class="py-4 px-6 text-right space-x-2">
                    <button onclick="editPatient('${pat.id}')" class="p-1.5 bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-600 rounded-lg transition-colors" title="Edit Patient"><i class="fa-solid fa-pen text-xs"></i></button>
                    <button onclick="deletePatient('${pat.id}')" class="p-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-lg transition-colors" title="Delete Patient"><i class="fa-solid fa-trash text-xs"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function renderDoctors(filteredList = null) {
        const grid = document.getElementById('doctorsGrid');
        if (!grid) return;
        grid.innerHTML = '';

        const docs = filteredList || appState.doctors;
        if (docs.length === 0) {
            grid.innerHTML = `<div class="col-span-full py-10 text-center text-slate-400">No doctors match your criteria.</div>`;
            return;
        }

        docs.forEach(doc => {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-all';
            card.innerHTML = `
                <div>
                    <div class="flex items-start justify-between">
                        <div class="flex items-center space-x-3">
                            <img src="${doc.image}" alt="${escapeHtml(doc.name)}" class="h-14 w-14 rounded-full object-cover ring-2 ring-slate-100">
                            <div>
                                <h3 class="font-bold text-slate-900">${escapeHtml(doc.name)}</h3>
                                <span class="inline-block px-2.5 py-0.5 text-xs font-semibold bg-brand-50 text-brand-600 rounded-full mt-1">${escapeHtml(doc.specialty)}</span>
                            </div>
                        </div>
                        <div class="flex items-center space-x-1 text-amber-500 text-xs font-bold bg-amber-50 px-2 py-1 rounded-lg">
                            <i class="fa-solid fa-star"></i>
                            <span>${doc.rating}</span>
                        </div>
                    </div>
                    <div class="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                        <div class="flex justify-between">
                            <span class="text-slate-400">Department:</span>
                            <span class="font-medium text-slate-800">${escapeHtml(doc.department)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400">Availability:</span>
                            <span class="font-medium text-slate-800">${escapeHtml(doc.availability)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400">Total Patients:</span>
                            <span class="font-medium text-slate-800">${doc.patientsCount} treated</span>
                        </div>
                    </div>
                </div>
                <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button onclick="bookWithDoctor('${doc.id}')" class="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all text-center">
                        <i class="fa-solid fa-calendar-plus mr-1.5"></i> Book Consultation
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    function renderAppointments(filteredList = null) {
        const tbody = document.getElementById('appointmentsTableBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        const appts = filteredList || appState.appointments;
        if (appts.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="py-6 px-6 text-center text-slate-400">No appointments scheduled.</td></tr>`;
            return;
        }

        appts.forEach(apt => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-slate-50 transition-colors';
            tr.innerHTML = `
                <td class="py-4 px-6 font-semibold text-slate-900">${escapeHtml(apt.patientName)}</td>
                <td class="py-4 px-6 text-slate-700">${escapeHtml(apt.doctorName)}</td>
                <td class="py-4 px-6 text-slate-600 font-medium">${escapeHtml(apt.date)} <span class="text-xs text-slate-400 block">${escapeHtml(apt.time)}</span></td>
                <td class="py-4 px-6 text-slate-600">${escapeHtml(apt.department)}</td>
                <td class="py-4 px-6">
                    <span class="px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(apt.status)}">
                        ${escapeHtml(apt.status)}
                    </span>
                </td>
                <td class="py-4 px-6 text-right space-x-2">
                    <select onchange="updateAppointmentStatus('${apt.id}', this.value)" class="text-xs bg-slate-100 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-brand-500 text-slate-700 font-medium">
                        <option value="" disabled selected>Change Status</option>
                        <option value="Confirmed">Confirm</option>
                        <option value="Completed">Complete</option>
                        <option value="Cancelled">Cancel</option>
                    </select>
                    <button onclick="deleteAppointment('${apt.id}')" class="p-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-lg transition-colors" title="Delete Appointment"><i class="fa-solid fa-trash text-xs"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function populateModalDropdowns() {
        const patSelect = document.getElementById('appointmentPatient');
        if (patSelect) {
            patSelect.innerHTML = '<option value="" disabled selected>Choose patient...</option>';
            appState.patients.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.id;
                opt.textContent = `${p.name} (${p.id})`;
                patSelect.appendChild(opt);
            });
        }

        const docSelect = document.getElementById('appointmentDoctor');
        if (docSelect) {
            docSelect.innerHTML = '<option value="" disabled selected>Choose doctor...</option>';
            appState.doctors.forEach(d => {
                const opt = document.createElement('option');
                opt.value = d.id;
                opt.textContent = `${d.name} - ${d.specialty}`;
                docSelect.appendChild(opt);
            });
        }
    }

    function getConditionBadgeClass(condition) {
        switch (condition) {
            case 'Stable': return 'bg-emerald-50 text-emerald-600';
            case 'Critical': return 'bg-rose-50 text-rose-600';
            case 'Recovering': return 'bg-blue-50 text-blue-600';
            case 'Observation': return 'bg-amber-50 text-amber-600';
            default: return 'bg-slate-100 text-slate-600';
        }
    }

    function getStatusBadgeClass(status) {
        switch (status) {
            case 'Confirmed': return 'bg-emerald-50 text-emerald-600';
            case 'Completed': return 'bg-blue-50 text-blue-600';
            case 'Pending': return 'bg-amber-50 text-amber-600';
            case 'Cancelled': return 'bg-rose-50 text-rose-600';
            default: return 'bg-slate-100 text-slate-600';
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // ---------------------------------------------------------
    // 4. NAVIGATION & TAB SWITCHING
    // ---------------------------------------------------------
    window.switchTab = function(tabName) {
        document.querySelectorAll('.tab-content').forEach(section => {
            section.classList.add('hidden');
        });

        const activeSection = document.getElementById(`tab-${tabName}`);
        if (activeSection) {
            activeSection.classList.remove('hidden');
        }

        document.querySelectorAll('.sidebar-tab').forEach(btn => {
            btn.classList.remove('active', 'bg-brand-50', 'text-brand-600');
            btn.classList.add('text-slate-600', 'hover:bg-slate-50', 'hover:text-slate-900');
            if (btn.getAttribute('data-tab') === tabName) {
                btn.classList.add('active', 'bg-brand-50', 'text-brand-600');
                btn.classList.remove('text-slate-600', 'hover:bg-slate-50', 'hover:text-slate-900');
            }
        });

        if (tabName === 'dashboard') renderDashboard();
        if (tabName === 'patients') renderPatients();
        if (tabName === 'doctors') renderDoctors();
        if (tabName === 'appointments') renderAppointments();
    };

    document.querySelectorAll('.sidebar-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            switchTab(tab);
        });
    });

    // ---------------------------------------------------------
    // 5. MODAL SYNCHRONIZATION ENGINE
    // ---------------------------------------------------------
    window.openModal = function(modalId, editData = null) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        if (modalId === 'patientModal' && !editData) {
            const form = document.getElementById('patientForm');
            if (form) form.reset();
            const pId = document.getElementById('patientId');
            if (pId) pId.value = '';
            const pTitle = document.getElementById('patientModalTitle');
            if (pTitle) pTitle.textContent = 'Register New Patient';
        } else if (modalId === 'appointmentModal') {
            const form = document.getElementById('appointmentForm');
            if (form) form.reset();
            populateModalDropdowns();
        }

        modal.classList.remove('hidden');
        requestAnimationFrame(() => {
            modal.classList.remove('opacity-0', 'pointer-events-none');
            modal.classList.add('flex', 'opacity-100', 'pointer-events-auto');

            const dialog = modal.querySelector('.modal-dialog');
            if (dialog) {
                dialog.classList.remove('scale-95');
                dialog.classList.add('scale-100');
            }
        });
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        const dialog = modal.querySelector('.modal-dialog');
        if (dialog) {
            dialog.classList.remove('scale-100');
            dialog.classList.add('scale-95');
        }

        modal.classList.remove('opacity-100', 'pointer-events-auto');
        modal.classList.add('opacity-0', 'pointer-events-none');

        setTimeout(() => {
            modal.classList.remove('flex');
            modal.classList.add('hidden');
        }, 300);
    };

    const openApptBtn = document.getElementById('openAppointmentModalBtn');
    if (openApptBtn) {
        openApptBtn.addEventListener('click', () => openModal('appointmentModal'));
    }

    const resetBtn = document.getElementById('resetDataBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all data to default demo state?')) {
                localStorage.removeItem(STORAGE_KEY);
                appState = loadState();
                renderApp();
                window.phToast('Demo data successfully restored!', 'success');
            }
        });
    }

    // ---------------------------------------------------------
    // 6. FORM HANDLING & CRUD OPERATIONS
    // ---------------------------------------------------------
    const patientForm = document.getElementById('patientForm');
    if (patientForm) {
        patientForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const idInput = document.getElementById('patientId').value;
            const name = document.getElementById('patientName').value.trim();
            const age = parseInt(document.getElementById('patientAge').value);
            const gender = document.getElementById('patientGender').value;
            const bloodGroup = document.getElementById('patientBlood').value;
            const condition = document.getElementById('patientCondition').value;
            const phone = document.getElementById('patientPhone').value.trim();
            const notes = document.getElementById('patientNotes').value.trim();

            if (!name || isNaN(age) || !phone) {
                window.phToast('Please fill out all required patient fields correctly.', 'error');
                return;
            }

            const todayStr = new Date().toISOString().split('T')[0];

            if (idInput) {
                const patient = appState.patients.find(p => p.id === idInput);
                if (patient) {
                    patient.name = name;
                    patient.age = age;
                    patient.gender = gender;
                    patient.bloodGroup = bloodGroup;
                    patient.condition = condition;
                    patient.phone = phone;
                    patient.notes = notes;
                    window.phToast(`Patient ${name} successfully updated!`, 'success');
                }
            } else {
                const newId = `PAT-${Math.floor(1000 + Math.random() * 9000)}`;
                const newPatient = {
                    id: newId,
                    name,
                    age,
                    gender,
                    bloodGroup,
                    condition,
                    phone,
                    lastVisit: todayStr,
                    notes
                };
                appState.patients.unshift(newPatient);
                window.phToast(`Patient ${name} registered successfully!`, 'success');
            }

            saveState();
            renderApp();
            closeModal('patientModal');
        });
    }

    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const patientId = document.getElementById('appointmentPatient').value;
            const doctorId = document.getElementById('appointmentDoctor').value;
            const date = document.getElementById('appointmentDate').value;
            const time = document.getElementById('appointmentTime').value;

            if (!patientId || !doctorId || !date || !time) {
                window.phToast('Please complete all appointment booking fields.', 'error');
                return;
            }

            const patient = appState.patients.find(p => p.id === patientId);
            const doctor = appState.doctors.find(d => d.id === doctorId);

            if (!patient || !doctor) {
                window.phToast('Selected patient or doctor not found.', 'error');
                return;
            }

            const newApt = {
                id: `APT-${Math.floor(100 + Math.random() * 900)}`,
                patientId: patient.id,
                patientName: patient.name,
                doctorId: doctor.id,
                doctorName: doctor.name,
                department: doctor.department,
                date,
                time,
                status: 'Confirmed'
            };

            appState.appointments.unshift(newApt);
            saveState();
            renderApp();
            closeModal('appointmentModal');
            window.phToast(`Appointment booked with ${doctor.name} for ${patient.name}!`, 'success');
        });
    }

    window.editPatient = function(patientId) {
        const patient = appState.patients.find(p => p.id === patientId);
        if (!patient) return;

        document.getElementById('patientId').value = patient.id;
        document.getElementById('patientName').value = patient.name;
        document.getElementById('patientAge').value = patient.age;
        document.getElementById('patientGender').value = patient.gender;
        document.getElementById('patientBlood').value = patient.bloodGroup;
        document.getElementById('patientCondition').value = patient.condition;
        document.getElementById('patientPhone').value = patient.phone;
        document.getElementById('patientNotes').value = patient.notes || '';
        document.getElementById('patientModalTitle').textContent = `Edit Patient: ${patient.name}`;

        openModal('patientModal', patient);
    };

    window.deletePatient = function(patientId) {
        if (confirm('Are you sure you want to delete this patient record?')) {
            appState.patients = appState.patients.filter(p => p.id !== patientId);
            saveState();
            renderApp();
            window.phToast('Patient record deleted successfully.', 'success');
        }
    };

    window.updateAppointmentStatus = function(aptId, newStatus) {
        const apt = appState.appointments.find(a => a.id === aptId);
        if (apt) {
            apt.status = newStatus;
            saveState();
            renderApp();
            window.phToast(`Appointment status updated to ${newStatus}.`, 'success');
        }
    };

    window.deleteAppointment = function(aptId) {
        if (confirm('Cancel and remove this appointment?')) {
            appState.appointments = appState.appointments.filter(a => a.id !== aptId);
            saveState();
            renderApp();
            window.phToast('Appointment removed successfully.', 'success');
        }
    };

    window.bookWithDoctor = function(doctorId) {
        switchTab('appointments');
        openModal('appointmentModal');
        const docSelect = document.getElementById('appointmentDoctor');
        if (docSelect) {
            docSelect.value = doctorId;
        }
    };

    // ---------------------------------------------------------
    // 7. REAL-TIME SEARCH & FILTERING
    // ---------------------------------------------------------
    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) {
        globalSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (!query) {
                renderApp();
                return;
            }

            const matchedPatients = appState.patients.filter(p => p.name.toLowerCase().includes(query) || p.id.toLowerCase().includes(query) || p.phone.includes(query));
            const matchedDoctors = appState.doctors.filter(d => d.name.toLowerCase().includes(query) || d.specialty.toLowerCase().includes(query));
            
            if (matchedPatients.length > 0) {
                switchTab('patients');
                renderPatients(matchedPatients);
            } else if (matchedDoctors.length > 0) {
                switchTab('doctors');
                renderDoctors(matchedDoctors);
            }
        });
    }

    const patientSearchInput = document.getElementById('patientSearchInput');
    const patientConditionFilter = document.getElementById('patientConditionFilter');

    function filterPatientsList() {
        const query = patientSearchInput ? patientSearchInput.value.toLowerCase().trim() : '';
        const condition = patientConditionFilter ? patientConditionFilter.value : '';

        const filtered = appState.patients.filter(p => {
            const matchesQuery = !query || p.name.toLowerCase().includes(query) || p.id.toLowerCase().includes(query) || p.phone.includes(query);
            const matchesCondition = !condition || p.condition === condition;
            return matchesQuery && matchesCondition;
        });

        renderPatients(filtered);
    }

});