```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grand Line General Hospital & Medical Center | Enterprise HMS</title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
    
    <!-- FontAwesome 6 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Plus Jakarta Sans', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace'],
                    },
                    colors: {
                        clinical: {
                            50: '#f0fdfa',
                            100: '#ccfbf1',
                            500: '#14b8a6',
                            600: '#0d9488',
                            700: '#0f766e',
                            900: '#134e4a',
                        },
                        medical: {
                            50: '#f0f9ff',
                            100: '#e0f2fe',
                            500: '#0ea5e9',
                            650: '#0284c7',
                            900: '#0c4a6e'
                        }
                    }
                }
            }
        }
    </script>
    
    <link rel="stylesheet" href="style.css">
</head>
<body class="h-full bg-slate-50 text-slate-800 font-sans antialiased overflow-hidden flex flex-col">

    <!-- TOP HEADER NAVBAR -->
    <header class="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0 z-30 shadow-xs">
        <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
                    <i class="fa-solid fa-hospital text-lg"></i>
                </div>
                <div>
                    <h1 class="font-bold text-slate-900 text-base leading-tight tracking-tight">Grand Line Medical Center</h1>
                    <p class="text-xs text-slate-500 font-medium">Enterprise Hospital Information System (EHIS v4.8)</p>
                </div>
            </div>
            
            <div class="hidden md:flex items-center pl-6 border-l border-slate-200 space-x-2">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span class="w-2 h-2 mr-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Systems Operational
                </span>
                <span class="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md font-mono">ICU Occupancy: 84%</span>
            </div>
        </div>

        <div class="flex items-center space-x-4">
            <!-- Global Emergency Alert Trigger -->
            <button id="emergency-alert-btn" class="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 shadow-xs">
                <i class="fa-solid fa-triangle-exclamation text-rose-600 animate-bounce"></i>
                <span>CODE BLUE EMERGENCY</span>
            </button>

            <!-- Quick Search -->
            <div class="relative hidden lg:block w-64">
                <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400 text-xs"></i>
                <input type="text" id="global-search" placeholder="Search patients, MRN, doctors..." class="w-full bg-slate-100 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:bg-white focus:border-teal-500 transition">
            </div>

            <!-- Notifications -->
            <div class="relative">
                <button id="notif-menu-btn" class="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition relative">
                    <i class="fa-regular fa-bell text-sm"></i>
                    <span class="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
                </button>
            </div>

            <!-- User Profile Dropdown -->
            <div class="flex items-center space-x-3 pl-2 border-l border-slate-200">
                <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150" alt="Dr. Trafalgar Law" class="w-9 h-9 rounded-full object-cover border-2 border-teal-500 shadow-xs">
                <div class="hidden sm:block text-left">
                    <h4 class="text-xs font-bold text-slate-800 leading-tight">Dr. Trafalgar Law, MD</h4>
                    <p class="text-[10px] text-teal-600 font-semibold uppercase tracking-wider">Chief Surgeon & Admin</p>
                </div>
            </div>
        </div>
    </header>

    <!-- MAIN APP CONTAINER -->
    <div class="flex-1 flex overflow-hidden">

        <!-- SIDEBAR NAVIGATION -->
        <aside class="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 select-none">
            <div class="p-4 space-y-6 overflow-y-auto">
                <div class="space-y-1">
                    <p class="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Clinical Modules</p>
                    
                    <button data-view="dashboard" class="sidebar-nav-btn w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-teal-700 bg-teal-50 transition">
                        <i class="fa-solid fa-chart-pie w-5 text-center text-teal-600"></i>
                        <span>Hospital Dashboard</span>
                    </button>
                    
                    <button data-view="doctor-desk" class="sidebar-nav-btn w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition">
                        <i class="fa-solid fa-stethoscope w-5 text-center text-slate-400"></i>
                        <span>Doctor Desk (OPD)</span>
                    </button>

                    <button data-view="patient-portal" class="sidebar-nav-btn w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition">
                        <i class="fa-solid fa-bed-pulse w-5 text-center text-slate-400"></i>
                        <span>Patient Portal & EMR</span>
                    </button>

                    <button data-view="icu-vacancy" class="sidebar-nav-btn w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition">
                        <i class="fa-solid fa-heart-pulse w-5 text-center text-slate-400"></i>
                        <span>ICU & Bed Vacancy</span>
                    </button>

                    <button data-view="lab-reports" class="sidebar-nav-btn w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition">
                        <i class="fa-solid fa-flask-vial w-5 text-center text-slate-400"></i>
                        <span>Pathology & Lab Reports</span>
                    </button>

                    <button data-view="appointments" class="sidebar-nav-btn w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition">
                        <i class="fa-solid fa-calendar-check w-5 text-center text-slate-400"></i>
                        <span>Appointment Booking</span>
                    </button>
                </div>

                <div class="space-y-1 pt-4 border-t border-slate-200">
                    <p class="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Quick Actions</p>
                    <button id="new-patient-modal-btn" class="w-full flex items-center space-x-2 px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition shadow-sm">
                        <i class="fa-solid fa-user-plus text-xs"></i>
                        <span>Admit New Patient</span>
                    </button>
                </div>
            </div>

            <!-- Sidebar Footer Status -->
            <div class="p-4 border-t border-slate-200 bg-slate-50">
                <div class="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span>Server Status</span>
                    <span class="text-emerald-600 font-bold">Secure SSL</span>
                </div>
                <div class="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div class="bg-teal-500 h-1.5 rounded-full" style="width: 28%;"></div>
                </div>
                <div class="mt-2 text-[10px] text-slate-400 text-center">Franky UI Core v4.8.2</div>
            </div>
        </aside>

        <!-- DYNAMIC CONTENT AREA -->
        <main id="main-content-area" class="flex-1 bg-slate-100 overflow-y-auto p-6">
            
            <!-- VIEW 1: HOSPITAL DASHBOARD (Default) -->
            <div id="view-dashboard" class="space-y-6">
                <!-- Welcome Banner -->
                <div class="bg-gradient-to-r from-teal-900 to-slate-900 rounded-2xl p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center shadow-lg">
                    <div class="space-y-2 mb-4 md:mb-0">
                        <span class="px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                            Command Center Active
                        </span>
                        <h2 class="text-2xl font-extrabold tracking-tight">Good morning, Dr. Law.</h2>
                        <p class="text-slate-300 text-xs max-w-xl">Emergency Ward is operating at optimal capacity. 4 critical lab tests require your immediate review and sign-off.</p>
                    </div>
                    <div class="flex space-x-3">
                        <button onclick="switchView('appointment-booking')" class="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-md">
                            <i class="fa-solid fa-calendar-plus mr-2"></i> Book Appointment
                        </button>
                        <button onclick="switchView('icu-vacancy')" class="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl text-xs font-bold transition">
                            <i class="fa-solid fa-bed mr-2"></i> View ICU Status
                        </button>
                    </div>
                </div>

                <!-- KPI Metric Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                        <div>
                            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Admitted</p>
                            <h3 class="text-2xl font-extrabold text-slate-800 mt-1">248</h3>
                            <span class="text-emerald-600 text-xs font-bold flex items-center mt-1">
                                <i class="fa-solid fa-arrow-trend-up mr-1"></i> +12% from yesterday
                            </span>
                        </div>
                        <div class="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl">
                            <i class="fa-solid fa-hospital-user"></i>
                        </div>
                    </div>

                    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                        <div>
                            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">ICU Vacancy</p>
                            <h3 class="text-2xl font-extrabold text-slate-800 mt-1">4 <span class="text-sm font-medium text-slate-400">/ 25 beds</span></h3>
                            <span class="text-rose-600 text-xs font-bold flex items-center mt-1">
                                <i class="fa-solid fa-triangle-exclamation mr-1"></i> Critical Low
                            </span>
                        </div>
                        <div class="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl">
                            <i class="fa-solid fa-heart-pulse"></i>
                        </div>
                    </div>

                    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                        <div>
                            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">OPD Appointments</p>
                            <h3 class="text-2xl font-extrabold text-slate-800 mt-1">86</h3>
                            <span class="text-blue-600 text-xs font-bold flex items-center mt-1">
                                <i class="fa-solid fa-clock mr-1"></i> 14 pending check-in
                            </span>
                        </div>
                        <div class="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-xl">
                            <i class="fa-solid fa-user-doctor"></i>
                        </div>
                    </div>

                    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                        <div>
                            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Lab Reports</p>
                            <h3 class="text-2xl font-extrabold text-slate-800 mt-1">19</h3>
                            <span class="text-amber-600 text-xs font-bold flex items-center mt-1">
                                <i class="fa-solid fa-flask mr-1"></i> 4 urgent review
                            </span>
                        </div>
                        <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
                            <i class="fa-solid fa-microscope"></i>
                        </div>
                    </div>
                </div>

                <!-- Recent Patient Admissions & Critical Queue Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Left 2 Cols: Active Patients Table -->
                    <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                        <div class="flex justify-between items-center mb-4">
                            <div>
                                <h3 class="font-bold text-slate-800 text-base">Active Inpatient Roster</h3>
                                <p class="text-xs text-slate-400">Real-time status of admitted patients across wards</p>
                            </div>
                            <button onclick="switchView('patient-portal')" class="text-xs font-bold text-teal-600 hover:underline">View All Patients →</button>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-xs">
                                <thead class="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                                    <tr>
                                        <th class="py-3 px-3">Patient MRN & Name</th>
                                        <th class="py-3 px-3">Ward / Bed</th>
                                        <th class="py-3 px-3">Attending Doctor</th>
                                        <th class="py-3 px-3">Condition</th>
                                        <th class="py-3 px-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100 font-medium">
                                    <tr class="hover:bg-slate-50 transition">
                                        <td class="py-3 px-3 flex items-center space-x-3">
                                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" class="w-8 h-8 rounded-full object-cover">
                                            <div>
                                                <div class="font-bold text-slate-800">Nami Cat Burglar</div>
                                                <div class="text-[10px] text-slate-400 font-mono">MRN-982341</div>
                                            </div>
                                        </td>
                                        <td class="py-3 px-3 text-slate-600 font-semibold">ICU-02</td>
                                        <td class="py-3 px-3 text-slate-600">Dr. Trafalgar Law</td>
                                        <td class="py-3 px-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">Critical / Stable</span></td>
                                        <td class="py-3 px-3 text-right">
                                            <button onclick="switchView('patient-portal')" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold">EMR File</button>
                                        </td>
                                    </tr>
                                    <tr class="hover:bg-slate-50 transition">
                                        <td class="py-3 px-3 flex items-center space-x-3">
                                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" class="w-8 h-8 rounded-full object-cover">
                                            <div>
                                                <div class="font-bold text-slate-800">Roronoa Zoro</div>
                                                <div class="text-[10px] text-slate-400 font-mono">MRN-883492</div>
                                            </div>
                                        </td>
                                        <td class="py-3 px-3 text-slate-600 font-semibold">Surg-404</td>
                                        <td class="py-3 px-3 text-slate-600">Dr. Chopper</td>
                                        <td class="py-3 px-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Post-Op Recovery</span></td>
                                        <td class="py-3 px-3 text-right">
                                            <button onclick="switchView('patient-portal')" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold">EMR File</button>
                                        </td>
                                    </tr>
                                    <tr class="hover:bg-slate-50 transition">
                                        <td class="py-3 px-3 flex items-center space-x-3">
                                            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" class="w-8 h-8 rounded-full object-cover">
                                            <div>
                                                <div class="font-bold text-slate-800">Monkey D. Luffy</div>
                                                <div class="text-[10px] text-slate-400 font-mono">MRN-772910</div>
                                            </div>
                                        </td>
                                        <td class="py-3 px-3 text-slate-600 font-semibold">Gen-102</td>
                                        <td class="py-3 px-3 text-slate-600">Dr. Kureha</td>
                                        <td class="py-3 px-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Observation</span></td>
                                        <td class="py-3 px-3 text-right">
                                            <button onclick="switchView('patient-portal')" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold">EMR File</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Right Col: Live ICU Vacancy Quick Widget -->
                    <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                        <div>
                            <div class="flex justify-between items-center mb-3">
                                <h3 class="font-bold text-slate-800 text-base">ICU Ward Status</h3>
                                <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                            </div>
                            <p class="text-xs text-slate-400 mb-4">Real-time ventilator and trauma bay availability.</p>
                            
                            <div class="space-y-3">
                                <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                                    <div>
                                        <div class="font-bold text-xs text-slate-800">ICU Bed 01 - Ventilator</div>
                                        <div class="text-[10px] text-rose-600 font-semibold">Occupied (Patient: Nami)</div>
                                    </div>
                                    <span class="px-2 py-1 rounded bg-rose-100 text-rose-700 font-bold text-[10px]">BUSY</span>
                                </div>
                                <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                                    <div>
                                        <div class="font-bold text-xs text-slate-800">ICU Bed 02 - Trauma</div>
                                        <div class="text-[10px] text-emerald-600 font-semibold">Available & Sterilized</div>
                                    </div>
                                    <span class="px-2 py-1 rounded bg-emerald-100 text-emerald-700 font-bold text-[10px]">OPEN</span>
                                </div>
                                <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                                    <div>
                                        <div class="font-bold text-xs text-slate-800">NICU Bed 04 - Ped</div>
                                        <div class="text-[10px] text-emerald-600 font-semibold">Available & Sterilized</div>
                                    </div>
                                    <span class="px-2 py-1 rounded bg-emerald-100 text-emerald-700 font-bold text-[10px]">OPEN</span>
                                </div>
                            </div>
                        </div>

                        <button onclick="switchView('icu-vacancy')" class="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold transition shadow-xs">
                            Manage All Beds & Wards
                        </button>
                    </div>
                </div>
            </div>

            <!-- VIEW 2: DOCTOR DESK (OPD) -->
            <div id="view-doctor-desk" class="hidden space-y-6">
                <div class="bg-white p-6 rounded-2xl border border-slate-200 flex justify-between items-center shadow-xs">
                    <div>
                        <span class="text-xs font-bold text-teal-600 uppercase tracking-wider">Outpatient Department (OPD)</span>
                        <h2 class="text-xl font-extrabold text-slate-800 mt-1">Doctor's Consultation Desk</h2>
                        <p class="text-xs text-slate-500">Manage daily queue, digital prescriptions, and instant clinical notes.</p>
                    </div>
                    <div class="flex items-center space-x-3">
                        <select id="doctor-select" class="bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 focus:outline-none">
                            <option>Dr. Trafalgar Law (Cardiology)</option>
                            <option>Dr. Chopper (Pediatrics)</option>
                            <option>Dr. Kureha (Geriatrics)</option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Queue List -->
                    <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                        <h3 class="font-bold text-slate-800 text-sm flex items-center justify-between">
                            <span>Waiting Queue (Today)</span>
                            <span class="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs font-bold">5 Patients</span>
                        </h3>
                        <div class="space-y-2">
                            <div onclick="selectQueuePatient('Nami Cat Burglar', 'MRN-982341', 'Chest pain and fatigue')" class="p-3 rounded-xl border border-teal-500 bg-teal-50/50 cursor-pointer transition">
                                <div class="flex justify-between items-center mb-1">
                                    <span class="text-xs font-bold text-slate-800">1. Nami Cat Burglar</span>
                                    <span class="text-[10px] bg-teal-600 text-white px-2 py-0.5 rounded font-bold">In Room</span>
                                </div>
                                <p class="text-[11px] text-slate-500">Complaint: Chest pain & dizziness</p>
                            </div>
                            <div onclick="selectQueuePatient('Vinsmoke Sanji', 'MRN-442109', 'Wrist strain')" class="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                                <div class="flex justify-between items-center mb-1">
                                    <span class="text-xs font-bold text-slate-800">2. Vinsmoke Sanji</span>
                                    <span class="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">Waiting</span>
                                </div>
                                <p class="text-[11px] text-slate-500">Complaint: Severe wrist strain</p>
                            </div>
                            <div onclick="selectQueuePatient('Nico Robin', 'MRN-559102', 'Routine checkup')" class="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                                <div class="flex justify-between items-center mb-1">
                                    <span class="text-xs font-bold text-slate-800">3. Nico Robin</span>
                                    <span class="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">Waiting</span>
                                </div>
                                <p class="text-[11px] text-slate-500">Complaint: Annual physical checkup</p>
                            </div>
                        </div>
                    </div>

                    <!-- Consultation & Prescription Workspace -->
                    <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
                        <div class="flex justify-between items-start border-b border-slate-100 pb-4">
                            <div>
                                <h3 id="consult-patient-name" class="font-extrabold text-slate-900 text-base">Nami Cat Burglar</h3>
                                <p id="consult-patient-mrn" class="text-xs text-slate-400 font-mono">MRN: MRN-982341 | Age: 24 (Female)</p>
                            </div>
                            <button id="prescribe-save-btn" class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs">
                                <i class="fa-solid fa-floppy-disk mr-2"></i> Save & Send Prescription
                            </button>
                        </div>

                        <!-- Clinical Notes Form -->
                        <div class="space-y-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Clinical Notes & Diagnosis</label>
                                <textarea rows="3" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:bg-white focus:border-teal-500 transition" placeholder="Enter patient diagnosis, vitals, observations...">Patient presents with episodic tachycardia and mild hypertension. EKG ordered.</textarea>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Medication / Rx</label>
                                    <input type="text" value="Amlodipine 5mg - Once daily" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-teal-500">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Lab Tests Requisition</label>
                                    <input type="text" value="Complete Blood Count (CBC), Lipid Panel" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-teal-500">
                                </div>
                            </div>

                            <div class="flex items-center space-x-4 pt-2">
                                <label class="flex items-center space-