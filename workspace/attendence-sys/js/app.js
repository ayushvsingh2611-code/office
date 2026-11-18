/**
 * ChronosPulse Enterprise™ v4.2 — Main Application Engine
 * Straw Hat Crew GROUP 1 (Architect: Nami | Builder: Zoro)
 */

const STORAGE_KEY = 'CHRONOSPULSE_APP_STATE';

const SEED_EMPLOYEES = [
  {
    id: "EMP-1001",
    name: "Elena Rostova",
    role: "VP of Engineering",
    department: "Engineering",
    email: "elena.rostova@chronospulse.io",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    shiftStart: "09:00",
    shiftEnd: "17:30",
    workType: "Hybrid",
    status: "present",
    currentSession: {
      punchIn: new Date(Date.now() - 4.5 * 3600000).toISOString(),
      lastBreakStart: null,
      totalBreakMinutes: 30,
      punchOut: null,
      ipAddress: "192.168.1.104",
      locationName: "San Francisco HQ - Floor 4",
      verifiedBiometric: true
    },
    leaveBalances: { paidAnnual: 18, medical: 10, casual: 5 },
    weeklyStats: { daysPresent: 5, totalHours: 39.5, punctualityRate: 98 }
  },
  {
    id: "EMP-1002",
    name: "Marcus Vance",
    role: "Lead Security Architect",
    department: "Engineering",
    email: "marcus.vance@chronospulse.io",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    shiftStart: "08:30",
    shiftEnd: "17:00",
    workType: "Office",
    status: "present",
    currentSession: {
      punchIn: new Date(Date.now() - 5.1 * 3600000).toISOString(),
      lastBreakStart: null,
      totalBreakMinutes: 45,
      punchOut: null,
      ipAddress: "192.168.1.112",
      locationName: "San Francisco HQ - Server Core",
      verifiedBiometric: true
    },
    leaveBalances: { paidAnnual: 12, medical: 8, casual: 3 },
    weeklyStats: { daysPresent: 5, totalHours: 41.2, punctualityRate: 100 }
  },
  {
    id: "EMP-1003",
    name: "Aisha Al-Mansoor",
    role: "Principal Product Designer",
    department: "Design",
    email: "aisha.mansoor@chronospulse.io",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    shiftStart: "09:30",
    shiftEnd: "18:00",
    workType: "Hybrid",
    status: "late",
    currentSession: {
      punchIn: new Date(Date.now() - 2.8 * 3600000).toISOString(),
      lastBreakStart: null,
      totalBreakMinutes: 15,
      punchOut: null,
      ipAddress: "192.168.1.88",
      locationName: "San Francisco HQ - Studio A",
      verifiedBiometric: true
    },
    leaveBalances: { paidAnnual: 15, medical: 12, casual: 4 },
    weeklyStats: { daysPresent: 4, totalHours: 34.0, punctualityRate: 85 }
  },
  {
    id: "EMP-1004",
    name: "Julian Chen",
    role: "Senior Staff DevOps",
    department: "DevOps",
    email: "julian.chen@chronospulse.io",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    shiftStart: "10:00",
    shiftEnd: "18:30",
    workType: "Remote",
    status: "remote",
    currentSession: {
      punchIn: new Date(Date.now() - 3.7 * 3600000).toISOString(),
      lastBreakStart: null,
      totalBreakMinutes: 20,
      punchOut: null,
      ipAddress: "73.189.44.201",
      locationName: "Remote - Seattle Gateway",
      verifiedBiometric: false
    },
    leaveBalances: { paidAnnual: 9, medical: 6, casual: 2 },
    weeklyStats: { daysPresent: 5, totalHours: 42.0, punctualityRate: 94 }
  },
  {
    id: "EMP-1005",
    name: "Sarah Jenkins",
    role: "People Operations Director",
    department: "People Ops",
    email: "sarah.jenkins@chronospulse.io",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    shiftStart: "09:00",
    shiftEnd: "17:00",
    workType: "Office",
    status: "break",
    currentSession: {
      punchIn: new Date(Date.now() - 4.2 * 3600000).toISOString(),
      lastBreakStart: new Date(Date.now() - 0.3 * 3600000).toISOString(),
      totalBreakMinutes: 18,
      punchOut: null,
      ipAddress: "192.168.1.15",
      locationName: "Cafeteria Lounge",
      verifiedBiometric: true
    },
    leaveBalances: { paidAnnual: 20, medical: 14, casual: 6 },
    weeklyStats: { daysPresent: 5, totalHours: 37.5, punctualityRate: 99 }
  },
  {
    id: "EMP-1006",
    name: "Carlos Mendoza",
    role: "Fullstack Platform Engineer",
    department: "Engineering",
    email: "carlos.m@chronospulse.io",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    shiftStart: "09:00",
    shiftEnd: "17:30",
    workType: "Office",
    status: "present",
    currentSession: {
      punchIn: new Date(Date.now() - 4.8 * 3600000).toISOString(),
      lastBreakStart: null,
      totalBreakMinutes: 35,
      punchOut: null,
      ipAddress: "192.168.1.142",
      locationName: "San Francisco HQ - Pod B",
      verifiedBiometric: true
    },
    leaveBalances: { paidAnnual: 11, medical: 7, casual: 3 },
    weeklyStats: { daysPresent: 4, totalHours: 36.8, punctualityRate: 92 }
  },
  {
    id: "EMP-1007",
    name: "Priya Sharma",
    role: "Data Analytics Lead",
    department: "Product",
    email: "priya.sharma@chronospulse.io",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    shiftStart: "09:00",
    shiftEnd: "17:30",
    workType: "Hybrid",
    status: "leave",
    currentSession: {
      punchIn: null,
      lastBreakStart: null,
      totalBreakMinutes: 0,
      punchOut: null,
      ipAddress: "N/A",
      locationName: "Scheduled Medical Leave",
      verifiedBiometric: false
    },
    leaveBalances: { paidAnnual: 14, medical: 3, casual: 5 },
    weeklyStats: { daysPresent: 3, totalHours: 24.0, punctualityRate: 95 }
  },
  {
    id: "EMP-1008",
    name: "Tyler Brooks",
    role: "Junior Frontend Engineer",
    department: "Engineering",
    email: "tyler.brooks@chronospulse.io",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    shiftStart: "09:30",
    shiftEnd: "18:00",
    workType: "Office",
    status: "absent",
    currentSession: {
      punchIn: null,
      lastBreakStart: null,
      totalBreakMinutes: 0,
      punchOut: null,
      ipAddress: "N/A",
      locationName: "Unexcused Absence",
      verifiedBiometric: false
    },
    leaveBalances: { paidAnnual: 8, medical: 5, casual: 1 },
    weeklyStats: { daysPresent: 3, totalHours: 22.5, punctualityRate: 72 }
  },
  {
    id: "EMP-1009",
    name: "Fatima Zahra",
    role: "Finance & Payroll Manager",
    department: "Finance",
    email: "fatima.z@chronospulse.io",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80",
    shiftStart: "08:30",
    shiftEnd: "17:00",
    workType: "Office",
    status: "present",
    currentSession: {
      punchIn: new Date(Date.now() - 5.5 * 3600000).toISOString(),
      lastBreakStart: null,
      totalBreakMinutes: 40,
      punchOut: null,
      ipAddress: "192.168.1.30",
      locationName: "Executive Tower - Suite 800",
      verifiedBiometric: true
    },
    leaveBalances: { paidAnnual: 16, medical: 10, casual: 4 },
    weeklyStats: { daysPresent: 5, totalHours: 40.0, punctualityRate: 100 }
  },
  {
    id: "EMP-1010",
    name: "Liam O'Connor",
    role: "Customer Success Director",
    department: "Product",
    email: "liam.oc@chronospulse.io",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    shiftStart: "09:00",
    shiftEnd: "17:30",
    workType: "Hybrid",
    status: "present",
    currentSession: {
      punchIn: new Date(Date.now() - 3.9 * 3600000).toISOString(),
      lastBreakStart: null,
      totalBreakMinutes: 20,
      punchOut: null,
      ipAddress: "192.168.1.95",
      locationName: "Client Relations Hub",
      verifiedBiometric: true
    },
    leaveBalances: { paidAnnual: 13, medical: 9, casual: 3 },
    weeklyStats: { daysPresent: 4, totalHours: 32.5, punctualityRate: 91 }
  }
];

const SEED_LEAVE_REQUESTS = [
  {
    id: "LV-801",
    employeeId: "EMP-1007",
    employeeName: "Priya Sharma",
    department: "Product",
    leaveType: "Medical",
    startDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    daysCount: 2,
    reason: "Post-surgery recovery and specialist checkup.",
    status: "APPROVED",
    appliedAt: new Date(Date.now() - 259200000).toISOString(),
    reviewerNote: "Approved by Medical Liaison & Dept Head."
  },
  {
    id: "LV-802",
    employeeId: "EMP-1003",
    employeeName: "Aisha Al-Mansoor",
    department: "Design",
    leaveType: "Annual",
    startDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 9 * 86400000).toISOString().split('T')[0],
    daysCount: 5,
    reason: "Annual family retreat in Kyoto.",
    status: "PENDING",
    appliedAt: new Date(Date.now() - 43200000).toISOString(),
    reviewerNote: null
  },
  {
    id: "LV-803",
    employeeId: "EMP-1006",
    employeeName: "Carlos Mendoza",
    department: "Engineering",
    leaveType: "Casual",
    startDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    daysCount: 1,
    reason: "Renewing driving license and administrative appointments.",
    status: "PENDING",
    appliedAt: new Date(Date.now() - 14400000).toISOString(),
    reviewerNote: null
  },
  {
    id: "LV-804",
    employeeId: "EMP-1008",
    employeeName: "Tyler Brooks",
    department: "Engineering",
    leaveType: "Casual",
    startDate: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    endDate: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    daysCount: 1,
    reason: "Personal family event.",
    status: "REJECTED",
    appliedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    reviewerNote: "Critical sprint deployment clash; rescheduled to next week."
  }
];

const SEED_PUNCH_HISTORY = [
  {
    id: "PUNCH-9001",
    employeeId: "EMP-1001",
    employeeName: "Elena Rostova",
    department: "Engineering",
    timestamp: new Date(Date.now() - 4.5 * 3600000).toISOString(),
    type: "CLOCK_IN",
    device: "Biometric Face ID Terminal 01",
    ipAddress: "192.168.1.104",
    latitude: 37.7749,
    longitude: -122.4194,
    statusTag: "present",
    notes: "Arrived for sprint planning."
  },
  {
    id: "PUNCH-9002",
    employeeId: "EMP-1002",
    employeeName: "Marcus Vance",
    department: "Engineering",
    timestamp: new Date(Date.now() - 5.1 * 3600000).toISOString(),
    type: "CLOCK_IN",
    device: "Biometric Face ID Terminal 01",
    ipAddress: "192.168.1.112",
    latitude: 37.7749,
    longitude: -122.4194,
    statusTag: "present",
    notes: "Early server audit check."
  }
];

let AppState = {
  currentUser: "EMP-1001",
  activeTab: "kiosk",
  employees: [],
  punchHistory: [],
  leaveRequests: [],
  settings: {
    gracePeriodMinutes: 15,
    standardWorkHours: 8.0,
    overtimeThresholdHours: 8.5,
    cameraSimulation: true
  },
  filters: {
    rosterSearch: "",
    rosterDept: "All",
    rosterStatus: "All",
    rosterViewMode: "table",
    timesheetDate: "week",
    timesheetDept: "All",
    leaveStatus: "ALL"
  }
};

// Web Audio API Sound Synthesizer
const playAudioChime = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(180, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch (e) {
    console.warn("Audio Context restricted:", e);
  }
};

// Toast Notification Manager
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bgClass = type === 'success' ? 'bg-emeraldPresence/90 text-void' : type === 'error' ? 'bg-roseAbsent/90 text-white' : 'bg-indigoPrimary/90 text-white';
  const icon = type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-info';

  toast.className = `pointer-events-auto flex items-center space-x-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md text-xs font-semibold ${bgClass} transform translate-y-4 opacity-0 transition-all duration-300`;
  toast.innerHTML = `
    <i class="fa-solid ${icon} text-sm"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('translate-y-4', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Initialization & Storage Hydration
function initApp() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      AppState.employees = parsed.employees || SEED_EMPLOYEES;
      AppState.punchHistory = parsed.punchHistory || SEED_PUNCH_HISTORY;
      AppState.leaveRequests = parsed.leaveRequests || SEED_LEAVE_REQUESTS;
      AppState.settings = parsed.settings || AppState.settings;
      AppState.currentUser = parsed.currentUser || "EMP-1001";
    } catch (e) {
      console.error("Failed to parse saved state, loading seed data", e);
      loadSeedData();
    }
  } else {
    loadSeedData();
  }

  populateUserSelects();
  bindEventListeners();
  startClockTicker();
  initBiometricCameraCanvas();
  renderRosterView();
  renderLeavesView();
  renderTimesheetsView();
  renderActiveView();
  updateHeaderBadges();
}

function loadSeedData() {
  AppState.employees = JSON.parse(JSON.stringify(SEED_EMPLOYEES));
  AppState.punchHistory = JSON.parse(JSON.stringify(SEED_PUNCH_HISTORY));
  AppState.leaveRequests = JSON.parse(JSON.stringify(SEED_LEAVE_REQUESTS));
  saveState();
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      employees: AppState.employees,
      punchHistory: AppState.punchHistory,
      leaveRequests: AppState.leaveRequests,
      settings: AppState.settings,
      currentUser: AppState.currentUser
    }));
  } catch (e) {
    console.error("Local storage quota exceeded or unavailable", e);
  }
}

// Live Clock Ticker
function startClockTicker() {
  setInterval(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    const millis = '.' + String(now.getMilliseconds()).padStart(3, '0');

    const clockEl = document.getElementById('live-digital-clock');
    const millisEl = document.getElementById('clock-millis');
    if (clockEl) clockEl.textContent = timeStr;
    if (millisEl) millisEl.textContent = millis;

    // Update session stopwatches if active user is clocked in
    updateStopwatches();
  }, 100);
}

function updateStopwatches() {
  const emp = AppState.employees.find(e => e.id === AppState.currentUser);
  if (!emp) return;

  const workStopwatch = document.getElementById('kiosk-live-stopwatch');
  const breakStopwatch = document.getElementById('kiosk-break-stopwatch');

  if (emp.currentSession.punchIn && !emp.currentSession.punchOut) {
    const elapsedMs = Date.now() - new Date(emp.currentSession.punchIn).getTime();
    const totalSec = Math.floor(elapsedMs / 1000);
    const hrs = String(Math.floor(totalSec / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSec % 60).padStart(2, '0');
    if (workStopwatch) workStopwatch.textContent = `${hrs}:${mins}:${secs}`;
  } else {
    if (workStopwatch) workStopwatch.textContent = '00:00:00';
  }

  const breakMins = emp.currentSession.totalBreakMinutes || 0;
  const bHrs = String(Math.floor(breakMins / 60)).padStart(2, '0');
  const bMins = String(breakMins % 60).padStart(2, '0');
  if (breakStopwatch) breakStopwatch.textContent = `${bHrs}:${bMins}:00`;
}

// Populate Dropdowns
function populateUserSelects() {
  const select = document.getElementById('current-user-select');
  const overrideSelect = document.getElementById('override-employee-select');
  if (!select) return;

  select.innerHTML = '';
  if (overrideSelect) overrideSelect.innerHTML = '';

  AppState.employees.forEach(emp => {
    const opt = document.createElement('option');
    opt.value = emp.id;
    opt.textContent = `${emp.name} (${emp.role})`;
    if (emp.id === AppState.currentUser) opt.selected = true;
    select.appendChild(opt);

    if (overrideSelect) {
      const opt2 = opt.cloneNode(true);
      overrideSelect.appendChild(opt2);
    }
  });

  select.onchange = (e) => {
    handleUserChange(e.target.value);
  };
}

function handleUserChange(employeeId) {
  AppState.currentUser = employeeId;
  saveState();
  renderKioskView();
  showToast(`Switched active profile to ${AppState.employees.find(e => e.id === employeeId)?.name}`, 'info');
}

// Biometric Camera Canvas Loop
function initBiometricCameraCanvas() {
  const canvas = document.getElementById('biometric-camera-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let angle = 0;

  function draw() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw cyber grid
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
    ctx.lineWidth = 1;
    const gridSize = 30;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Scanning laser line
    angle += 0.03;
    const scanY = (Math.sin(angle) + 1) * 0.5 * canvas.height;
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, scanY);
    ctx.lineTo(canvas.width, scanY);
    ctx.stroke();

    // Facial landmark mesh simulation
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    ctx.fillStyle = 'rgba(99, 102, 241, 0.8)';
    const points = [
      [cx, cy - 40], [cx - 20, cy - 20], [cx + 20, cy - 20],
      [cx - 35, cy], [cx + 35, cy], [cx, cy + 20],
      [cx - 15, cy + 40], [cx + 15, cy + 40]
    ];

    points.forEach(([px, py]) => {
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
}

// Tab Switching
function handleTabSwitch(tabName) {
  AppState.activeTab = tabName;
  document.querySelectorAll('.app-view').forEach(v => v.classList.add('hidden'));
  const target = document.getElementById(`view-${tabName}`);
  if (target) target.classList.remove('hidden');

  // Update mobile tab styling
  document.querySelectorAll('.mobile-tab-btn').forEach(btn => {
    btn.classList.remove('border-indigoPrimary', 'text-textPrimary');
    btn.classList.add('border-subtle', 'text-textMuted');
    if (btn.textContent.toLowerCase().includes(tabName.substring(0, 3))) {
      btn.classList.add('border-indigoPrimary', 'text-textPrimary');
    }
  });

  renderActiveView();
}

function renderActiveView() {
  if (AppState.activeTab === 'kiosk') renderKioskView();
  else if (AppState.activeTab === 'roster') renderRosterView();
  else if (AppState.activeTab === 'leaves') renderLeavesView();
  else if (AppState.activeTab === 'timesheets') renderTimesheetsView();
  else if (AppState.activeTab === 'analytics') renderAnalyticsView();
  else if (AppState.activeTab === 'settings') renderSettingsView();
}

// Render Kiosk View
function renderKioskView() {
  const emp = AppState.employees.find(e => e.id === AppState.currentUser);
  if (!emp) return;

  document.getElementById('kiosk-avatar').src = emp.avatar;
  document.getElementById('kiosk-name').textContent = emp.name;
  document.getElementById('kiosk-role-badge').textContent = `${emp.department} • ${emp.role}`;

  const statusBadge = document.getElementById('kiosk-current-status-badge');
  statusBadge.textContent = emp.status.toUpperCase();
  statusBadge.className = `px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
    emp.status === 'present' ? 'bg-emeraldPresence/20 text-emeraldPresence border-emeraldPresence/30' :
    emp.status === 'late' ? 'bg-amberTardy/20 text-amberTardy border-amberTardy/40' :
    emp.status === 'break' ? 'bg-skyInfo/20 text-skyInfo border-skyInfo/30' :
    'bg-roseAbsent/20 text-roseAbsent border-roseAbsent/30'
  }`;

  // Recent activity list
  const list = document.getElementById('kiosk-recent-activity-list');
  const userPunches = AppState.punchHistory.filter(p => p.employeeId === emp.id).slice(-4).reverse();
  if (userPunches.length === 0) {
    list.innerHTML = `<span class="text-textMuted italic">No recent punches recorded today.</span>`;
  } else {
    list.innerHTML = userPunches.map(p => `
      <div class="flex items-center justify-between bg-void p-2.5 rounded-xl border border-subtle">
        <span class="text-indigo-400 font-semibold">${p.type}</span>
        <span class="text-textMuted">${new Date(p.timestamp).toLocaleTimeString()}</span>
      </div>
    `).join('');
  }
}

// Attendance Punch Handlers
function handleClockIn(employeeId, isManual = false) {
  const id = employeeId || AppState.currentUser;
  const emp = AppState.employees.find(e => e.id === id);
  if (!emp) return;

  if (emp.currentSession.punchIn && !emp.currentSession.punchOut) {
    showToast(`${emp.name} is already clocked in!`, 'error');
    playAudioChime('error');
    return;
  }

  const now = new Date();
  const [sHour, sMin] = emp.shiftStart.split(':').map(Number);
  const shiftStartTime = new Date(now);
  shiftStartTime.setHours(sHour, sMin + AppState.settings.gracePeriodMinutes, 0, 0);

  const status = now > shiftStartTime ? 'late' : 'present';

  emp.currentSession.punchIn = now.toISOString();
  emp.currentSession.punchOut = null;
  emp.currentSession.totalBreakMinutes = 0;
  emp.status = status;

  const notes = document.getElementById('kiosk-notes-input')?.value || 'Terminal Biometric Scan';

  const record = {
    id: `PUNCH-${Date.now().toString().slice(-4)}`,
    employeeId: emp.id,
    employeeName: emp.name,
    department: emp.department,
    timestamp: now.toISOString(),
    type: 'CLOCK_IN',
    device: isManual ? 'HR Manual Override' : 'Biometric Face ID Terminal 01',
    ipAddress: emp.currentSession.ipAddress,
    latitude: 37.7749,
    longitude: -122.4194,
    statusTag: status,
    notes: notes
  };

  AppState.punchHistory.push(record);
  saveState();
  playAudioChime('success');
  showToast(`${emp.name} clocked in successfully at ${now.toLocaleTimeString()} (${status.toUpperCase()})`, 'success');

  if (document.getElementById('kiosk-notes-input')) document.getElementById('kiosk-notes-input').value = '';
  renderActiveView();
  updateHeaderBadges();
}

function handleBreakToggle(employeeId) {
  const id = employeeId || AppState.currentUser;
  const emp = AppState.employees.find(e => e.id === id);
  if (!emp || !emp.currentSession.punchIn || emp.currentSession.punchOut) {
    showToast(`Active shift required to toggle break.`, 'error');
    playAudioChime('error');
    return;
  }

  const now = new Date();
  if (emp.status === 'break') {
    // Resume work
    const breakStart = new Date(emp.currentSession.lastBreakStart || now);
    const diffMins = Math.round((now - breakStart) / 60000);
    emp.currentSession.totalBreakMinutes += diffMins;
    emp.currentSession.lastBreakStart = null;
    emp.status = 'present';

    AppState.punchHistory.push({
      id: `PUNCH-${Date.now().toString().slice(-4)}`,
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      timestamp: now.toISOString(),
      type: 'BREAK_END',
      device: 'Biometric Terminal 01',
      ipAddress: emp.currentSession.ipAddress,
      latitude: 37.7749,
      longitude: -122.4194,
      statusTag: 'present'
    });

    playAudioChime('success');
    showToast(`Break ended. Welcome back, ${emp.name}!`, 'success');
  } else {
    // Take break
    emp.currentSession.lastBreakStart = now.toISOString();
    emp.status = 'break';

    AppState.punchHistory.push({
      id: `PUNCH-${Date.now().toString().slice(-4)}`,
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      timestamp: now.toISOString(),
      type: 'BREAK_START',
      device: 'Biometric Terminal 01',
      ipAddress: emp.currentSession.ipAddress,
      latitude: 37.7749,
      longitude: -122.4194,
      statusTag: 'break'
    });

    playAudioChime('success');
    showToast(`Break started. Shift timer paused.`, 'info');
  }

  saveState();
  renderActiveView();
}

function handleClockOut(employeeId) {
  const id = employeeId || AppState.currentUser;
  const emp = AppState.employees.find(e => e.id === id);
  if (!emp || !emp.currentSession.punchIn || emp.currentSession.punchOut) {
    showToast(`No active shift found to clock out.`, 'error');
    playAudioChime('error');
    return;
  }

  const now = new Date();
  emp.currentSession.punchOut = now.toISOString();
  emp.status = 'absent';

  const punchInTime = new Date(emp.currentSession.punchIn);
  const totalMs = now - punchInTime;
  const netHours = Math.max(0, (totalMs / 3600000) - (emp.currentSession.totalBreakMinutes / 60)).toFixed(1);

  emp.weeklyStats.totalHours += parseFloat(netHours);
  emp.weeklyStats.daysPresent += 1;

  AppState.punchHistory.push({
    id: `PUNCH-${Date.now().toString().slice(-4)}`,
    employeeId: emp.id,
    employeeName: emp.name,
    department: emp.department,
    timestamp: now.toISOString(),
    type: 'CLOCK_OUT',
    device: 'Biometric Face ID Terminal 01',
    ipAddress: emp.currentSession.ipAddress,
    latitude: 37.7749,
    longitude: -122.4194,
    statusTag: 'absent',
    notes: `Shift ended. Net hours: ${netHours}h`
  });

  saveState();
  playAudioChime('success');
  showToast(`${emp.name} clocked out successfully. Net hours today: ${netHours} hrs`, 'success');
  renderActiveView();
  updateHeaderBadges();
}

// Render Roster View
function renderRosterView() {
  const tbody = document.getElementById('roster-table-body');
  const cardsContainer = document.getElementById('roster-cards-container');
  if (!tbody) return;

  const search = AppState.filters.rosterSearch.toLowerCase();
  const dept = AppState.filters.rosterDept;
  const status = AppState.filters.rosterStatus;

  const filtered = AppState.employees.filter(emp => {
    const matchSearch = emp.name.toLowerCase().includes(search) || emp.role.toLowerCase().includes(search) || emp.id.toLowerCase().includes(search);
    const matchDept = dept === 'All' || emp.department === dept;
    const matchStatus = status === 'All' || emp.status === status;
    return matchSearch && matchDept && matchStatus;
  });

  // Update stat pills
  document.getElementById('roster-stat-total').textContent = AppState.employees.length;
  document.getElementById('roster-stat-present').textContent = AppState.employees.filter(e => e.status === 'present').length;
  document.getElementById('roster-stat-late').textContent = AppState.employees.filter(e => e.status === 'late').length;
  document.getElementById('roster-stat-break').textContent = AppState.employees.filter(e => e.status === 'break').length;
  document.getElementById('roster-stat-absent').textContent = AppState.employees.filter(e => e.status === 'absent' || e.status === 'leave').length;

  tbody.innerHTML = filtered.map(emp => `
    <tr class="hover:bg-elevated/40 transition-all cursor-pointer" onclick="openEmployeeDetail('${emp.id}')">
      <td class="p-4 flex items-center space-x-3">
        <img src="${emp.avatar}" class="w-10 h-10 rounded-xl object-cover border border-subtle">
        <div>
          <span class="font-bold text-textPrimary block">${emp.name}</span>
          <span class="text-[10px] font-mono text-textMuted">${emp.id}</span>
        </div>
      </td>
      <td class="p-4">
        <span class="text-textPrimary font-medium block">${emp.role}</span>
        <span class="text-[10px] text-indigo-400 font-mono">${emp.department}</span>
      </td>
      <td class="p-4">
        <span class="px-2 py-0.5 rounded bg-subtle text-[10px] font-mono text-textMuted">${emp.workType}</span>
      </td>
      <td class="p-4">
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
          emp.status === 'present' ? 'bg-emeraldPresence/20 text-emeraldPresence' :
          emp.status === 'late' ? 'bg-amberTardy/20 text-amberTardy' :
          emp.status === 'break' ? 'bg-skyInfo/20 text-skyInfo' :
          'bg-roseAbsent/20 text-roseAbsent'
        }">${emp.status}</span>
      </td>
      <td class="p-4 font-mono text-textMuted">
        ${emp.currentSession.punchIn ? new Date(emp.currentSession.punchIn).toLocaleTimeString() : 'N/A'}
      </td>
      <td class="p-4 font-mono text-[11px] text-textMuted">
        ${emp.currentSession.locationName}
      </td>
      <td class="p-4 text-right space-x-2" onclick="event.stopPropagation()">
        <button onclick="handleClockIn('${emp.id}')" title="Force Clock In" class="p-2 rounded-lg bg-emeraldPresence/20 text-emeraldPresence hover:bg-emeraldPresence hover:text-void transition-all">
          <i class="fa-solid fa-right-to-bracket text-xs"></i>
        </button>
        <button onclick="handleClockOut('${emp.id}')" title="Force Clock Out" class="p-2 rounded-lg bg-roseAbsent/20 text-roseAbsent hover:bg-roseAbsent hover:text-white transition-all">
          <i class="fa-solid fa-right-from-bracket text-xs"></i>
        </button>
      </td>
    </tr>
  `).join('');

  cardsContainer.innerHTML = filtered.map(emp => `
    <div class="bg-obsidian border border-subtle rounded-2xl p-5 flex flex-col justify-between shadow-xl">
      <div class="flex items-center space-x-3 mb-4">
        <img src="${emp.avatar}" class="w-12 h-12 rounded-xl object-cover border border-indigoPrimary">
        <div>
          <h4 class="font-bold text-textPrimary text-sm">${emp.name}</h4>
          <p class="text-xs text-indigo-400">${emp.role}</p>
        </div>
      </div>
      <div class="space-y-2 text-xs font-mono text-textMuted mb-4">
        <div class="flex justify-between"><span>Dept:</span> <span class="text-textPrimary">${emp.department}</span></div>
        <div class="flex justify-between"><span>Status:</span> <span class="text-emeraldPresence">${emp.status}</span></div>
        <div class="flex justify-between"><span>Punctuality:</span> <span class="text-indigo-400">${emp.weeklyStats.punctualityRate}%</span></div>
      </div>
      <div class="flex space-x-2">
        <button onclick="handleClockIn('${emp.id}')" class="flex-1 py-2 rounded-xl bg-emeraldPresence/20 text-emeraldPresence font-bold text-xs hover:bg-emeraldPresence hover:text-void transition-all">Clock In</button>
        <button onclick="handleClockOut('${emp.id}')" class="flex-1 py-2 rounded-xl bg-roseAbsent/20 text-roseAbsent font-bold text-xs hover:bg-roseAbsent hover:text-white transition-all">Clock Out</button>
      </div>
    </div>
  `).join('');
}

// Render Leaves View
function renderLeavesView() {
  const tbody = document.getElementById('leave-requests-table-body');
  if (!tbody) return;

  const statusFilter = AppState.filters.leaveStatus;
  const filtered = AppState.leaveRequests.filter(req => statusFilter === 'ALL' || req.status === statusFilter);

  document.getElementById('leave-pending-count').textContent = AppState.leaveRequests.filter(r => r.status === 'PENDING').length;

  tbody.innerHTML = filtered.map(req => `
    <tr class="hover:bg-elevated/40 transition-all">
      <td class="p-4">
        <span class="font-bold text-textPrimary block">${req.employeeName}</span>
        <span class="text-[10px] font-mono text-indigo-400">${req.id} • ${req.department}</span>
      </td>
      <td class="p-4 font-semibold text-textPrimary">${req.leaveType} Leave</td>
      <td class="p-4 font-mono text-textMuted">
        ${req.startDate} to ${req.endDate} <span class="text-indigo-400">(${req.daysCount}d)</span>
      </td>
      <td class="p-4 text-textMuted italic max-w-xs truncate">${req.reason}</td>
      <td class="p-4">
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
          req.status === 'APPROVED' ? 'bg-emeraldPresence/20 text-emeraldPresence' :
          req.status === 'REJECTED' ? 'bg-roseAbsent/20 text-roseAbsent' :
          'bg-amberTardy/20 text-amberTardy'
        }">${req.status}</span>
      </td>
      <td class="p-4 text-right space-x-2">
        ${req.status === 'PENDING' ? `
          <button onclick="handleLeaveDecision('${req.id}', 'APPROVED')" class="px-3 py-1.5 rounded-lg bg-emeraldPresence/20 text-emeraldPresence hover:bg-emeraldPresence hover:text-void text-xs font-bold transition-all">Approve</button>
          <button onclick="handleLeaveDecision('${req.id}', 'REJECTED')" class="px-3 py-1.5 rounded-lg bg-roseAbsent/20 text-roseAbsent hover:bg-roseAbsent hover:text-white text-xs font-bold transition-all">Reject</button>
        ` : `<span class="text-textMuted text-xs font-mono">Completed</span>`}
      </td>
    </tr>
  `).join('');
}

function handleLeaveDecision(leaveId, decision) {
  const req = AppState.leaveRequests.find(r => r.id === leaveId);
  if (!req) return;

  req.status = decision;
  if (decision === 'APPROVED') {
    const emp = AppState.employees.find(e => e.id === req.employeeId);
    if (emp) {
      if (req.leaveType === 'Annual') emp.leaveBalances.paidAnnual = Math.max(0, emp.leaveBalances.paidAnnual - req.daysCount);
      if (req.leaveType === 'Medical') emp.leaveBalances.medical = Math.max(0, emp.leaveBalances.medical - req.daysCount);
      if (req.leaveType === 'Casual') emp.leaveBalances.casual = Math.max(0, emp.leaveBalances.casual - req.daysCount);
      emp.status = 'leave';
    }
  }

  saveState();
  playAudioChime('success');
  showToast(`Leave application ${req.id} has been ${decision.toLowerCase()}.`, 'success');
  renderActiveView();
}

// Render Timesheets View
function renderTimesheetsView() {
  const tbody = document.getElementById('timesheet-table-body');
  if (!tbody) return;

  const logs = AppState.punchHistory.slice().reverse();

  tbody.innerHTML = logs.map(p => `
    <tr class="hover:bg-elevated/40 transition-all">
      <td class="p-4 text-textPrimary font-semibold">${p.employeeName}</td>
      <td class="p-4 text-indigo-400">${p.department}</td>
      <td class="p-4 text-textMuted">${new Date(p.timestamp).toLocaleDateString()}</td>
      <td class="p-4 text-emeraldPresence">${new Date(p.timestamp).toLocaleTimeString()}</td>
      <td class="p-4 text-amberTardy">15m</td>
      <td class="p-4 text-textPrimary">7.8h</td>
      <td class="p-4 text-indigo-400">0.5h</td>
      <td class="p-4 text-right">
        <span class="px-2 py-0.5 rounded bg-emeraldPresence/20 text-emeraldPresence text-[10px]">Verified</span>
      </td>
    </tr>
  `).join('');
}

// Render Analytics & Heatmap Canvas
function renderAnalyticsView() {
  const canvas = document.getElementById('attendance-heatmap-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = 140;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cols = 52;
  const rows = 7;
  const size = 12;
  const gap = 4;
  const startX = 20;
  const startY = 15;

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const x = startX + c * (size + gap);
      const y = startY + r * (size + gap);
      
      const rand = Math.random();
      let color = '#1E293B';
      if (rand > 0.75) color = '#10B981';
      else if (rand > 0.5) color = '#059669';
      else if (rand > 0.3) color = '#064E3B';

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, 3);
      ctx.fill();
    }
  }

  // Render Department Breakdown Canvas
  const deptCanvas = document.getElementById('department-breakdown-canvas');
  if (deptCanvas) {
    const dCtx = deptCanvas.getContext('2d');
    deptCanvas.width = deptCanvas.parentElement.clientWidth;
    deptCanvas.height = 250;
    dCtx.clearRect(0, 0, deptCanvas.width, deptCanvas.height);

    const depts = ['Engineering', 'Product', 'Design', 'DevOps', 'Finance', 'People Ops'];
    const rates = [98, 92, 88, 95, 100, 96];

    depts.forEach((dept, i) => {
      const y = 25 + i * 38;
      dCtx.fillStyle = '#94A3B8';
      dCtx.font = '11px Plus Jakarta Sans';
      dCtx.fillText(dept, 10, y + 12);

      // Bar background
      dCtx.fillStyle = '#1E293B';
      dCtx.beginPath();
      dCtx.roundRect(120, y, 200, 14, 7);
      dCtx.fill();

      // Bar fill
      dCtx.fillStyle = '#6366F1';
      dCtx.beginPath();
      dCtx.roundRect(120, y, 200 * (rates[i] / 100), 14, 7);
      dCtx.fill();

      dCtx.fillStyle = '#F8FAFC';
      dCtx.fillText(`${rates[i]}%`, 330, y + 12);
    });
  }

  // Render Arrival Curve Canvas
  const arrivalCanvas = document.getElementById('arrival-curve-canvas');
  if (arrivalCanvas) {
    const aCtx = arrivalCanvas.getContext('2d');
    arrivalCanvas.width = arrivalCanvas.parentElement.clientWidth;
    arrivalCanvas.height = 250;
    aCtx.clearRect(0, 0, arrivalCanvas.width, arrivalCanvas.height);

    aCtx.strokeStyle = '#10B981';
    aCtx.lineWidth = 3;
    aCtx.beginPath();
    const points = [
      [20, 200], [70, 180], [120, 130], [170, 50], [220, 90], [270, 160], [320, 210]
    ];

    aCtx.moveTo(points[0][0], points[0][1]);
    points.forEach(([px, py]) => aCtx.lineTo(px, py));
    aCtx.stroke();
  }
}

// Render Settings View
function renderSettingsView() {
  document.getElementById('setting-grace-period').value = AppState.settings.gracePeriodMinutes;
  document.getElementById('setting-overtime-threshold').value = AppState.settings.overtimeThresholdHours;
  document.getElementById('setting-toggle-biometric').checked = AppState.settings.cameraSimulation;
}

// Global Exports
function handleExportCSV() {
  let csv = 'Employee ID,Name,Department,Date,Type,Device,Status\n';
  AppState.punchHistory.forEach(p => {
    csv += `"${p.employeeId}","${p.employeeName}","${p.department}","${p.timestamp}","${p.type}","${p.device}","${p.statusTag}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'chronospulse_timesheet_export.csv';
  a.click();
  showToast('CSV export downloaded successfully.', 'success');
}

function handleExportJSON() {
  const json = JSON.stringify(AppState, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'chronospulse_backup_state.json';
  a.click();
  showToast('JSON system backup downloaded successfully.', 'success');
}

function handleResetDemoData() {
  if (confirm('Are you sure you want to reset all demo data and restore initial seed records?')) {
    localStorage.removeItem(STORAGE_KEY);
    loadSeedData();
    initApp();
    showToast('Factory reset successful. Demo data reloaded.', 'success');
  }
}

function updateHeaderBadges() {
  const badge = document.getElementById('notification-badge');
  if (badge) {
    const pendingCount = AppState.leaveRequests.filter(r => r.status === 'PENDING').length;
    badge.textContent = pendingCount;
  }
}

// Event Listeners Binding
function bindEventListeners() {
  // Quick Punch Actions
  document.getElementById('btn-quick-punch-in')?.addEventListener('click', () => handleClockIn());
  document.getElementById('btn-quick-break')?.addEventListener('click', () => handleBreakToggle());
  document.getElementById('btn-quick-punch-out')?.addEventListener('click', () => handleClockOut());

  // Global Search
  document.getElementById('global-search-input')?.addEventListener('input', (e) => {
    AppState.filters.rosterSearch = e.target.value;
    handleTabSwitch('roster');
  });

  // Notifications Drawer
  const drawer = document.getElementById('notifications-drawer');
  document.getElementById('btn-notification-trigger')?.addEventListener('click', () => {
    drawer.classList.toggle('translate-x-full');
    renderNotificationsDrawer();
  });
  document.getElementById('btn-close-notifications')?.addEventListener('click', () => {
    drawer.classList.add('translate-x-full');
  });

  // Leave Modal
  const leaveModal = document.getElementById('modal-request-leave');
  document.getElementById('btn-request-leave-modal')?.addEventListener('click', () => leaveModal.classList.remove('hidden'));
  document.getElementById('btn-cancel-leave')?.addEventListener('click', () => leaveModal.classList.add('hidden'));
  document.getElementById('btn-cancel-leave-2')?.addEventListener('click', () => leaveModal.classList.add('hidden'));

  document.getElementById('leave-request-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.getElementById('input-leave-type').value;
    const start = document.getElementById('input-leave-start').value;
    const end = document.getElementById('input-leave-end').value;
    const reason = document.getElementById('input-leave-reason').value;

    if (!start || !end || !reason) {
      showToast('Please complete all leave application fields.', 'error');
      return;
    }

    const emp = AppState.employees.find(e => e.id === AppState.currentUser);
    const newReq = {
      id: `LV-${Math.floor(100 + Math.random() * 900)}`,
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      leaveType: type,
      startDate: start,
      endDate: end,
      daysCount: 2,
      reason: reason,
      status: 'PENDING',
      appliedAt: new Date().toISOString()
    };

    AppState.leaveRequests.unshift(newReq);
    saveState();
    leaveModal.classList.add('hidden');
    playAudioChime('success');
    showToast('Leave application submitted for HR approval.', 'success');
    renderActiveView();
    updateHeaderBadges();
  });

  // Manual Override Modal
  const overrideModal = document.getElementById('manual-override-modal');
  document.getElementById('btn-open-manual-punch-modal')?.addEventListener('click', () => overrideModal.classList.remove('hidden'));
  document.getElementById('btn-close-override')?.addEventListener('click', () => overrideModal.classList.add('hidden'));
  document.getElementById('btn-close-override-2')?.addEventListener('click', () => overrideModal.classList.add('hidden'));

  document.getElementById('btn-save-override')?.addEventListener('click', () => {
    const empId = document.getElementById('override-employee-select').value;
    const type = document.getElementById('override-punch-type').value;
    const reason = document.getElementById('override-reason').value;

    if (type === 'CLOCK_IN') handleClockIn(empId, true);
    else handleClockOut(empId);

    overrideModal.classList.add('hidden');
    showToast(`Manual override executed successfully for ${empId}`, 'success');
  });

  // Employee Detail Modal
  document.getElementById('btn-close-employee-modal')?.addEventListener('click', () => {
    document.getElementById('employee-detail-modal').classList.add('hidden');
  });

  // Roster Filters
  document.getElementById('roster-filter-department')?.addEventListener('change', (e) => {
    AppState.filters.rosterDept = e.target.value;
    renderRosterView();
  });
  document.getElementById('roster-filter-status')?.addEventListener('change', (e) => {
    AppState.filters.rosterStatus = e.target.value;
    renderRosterView();
  });

  document.getElementById('roster-search-input')?.addEventListener('input', (e) => {
    AppState.filters.rosterSearch = e.target.value;
    renderRosterView();
  });

  // View mode toggles
  document.getElementById('roster-view-table-btn')?.addEventListener('click', () => {
    document.getElementById('roster-table-container').classList.remove('hidden');
    document.getElementById('roster-cards-container').classList.add('hidden');
  });
  document.getElementById('roster-view-grid-btn')?.addEventListener('click', () => {
    document.getElementById('roster-table-container').classList.add('hidden');
    document.getElementById('roster-cards-container').classList.remove('hidden');
  });

  // Leave filter
  document.getElementById('leave-filter-status')?.addEventListener('change', (e) => {
    AppState.filters.leaveStatus = e.target.value;
    renderLeavesView();
  });

  // Settings Save
  document.getElementById('btn-save-settings')?.addEventListener('click', () => {
    AppState.settings.gracePeriodMinutes = parseInt(document.getElementById('setting-grace-period').value) || 15;
    AppState.settings.overtimeThresholdHours = parseFloat(document.getElementById('setting-overtime-threshold').value) || 8.5;
    AppState.settings.cameraSimulation = document.getElementById('setting-toggle-biometric').checked;
    saveState();
    playAudioChime('success');
    showToast('Global shift policies and rules updated successfully.', 'success');
  });
}

function renderNotificationsDrawer() {
  const list = document.getElementById('notifications-list');
  if (!list) return;

  const logs = AppState.punchHistory.slice(-10).reverse();
  list.innerHTML = logs.map(p => `
    <div class="p-3 rounded-xl bg-elevated border border-subtle space-y-1">
      <div class="flex items-center justify-between">
        <span class="font-bold text-textPrimary">${p.employeeName}</span>
        <span class="text-[10px] font-mono text-indigo-400">${p.type}</span>
      </div>
      <p class="text-[11px] text-textMuted">${p.device} • ${p.notes || 'Verified'}</p>
      <span class="text-[9px] font-mono text-textMuted">${new Date(p.timestamp).toLocaleTimeString()}</span>
    </div>
  `).join('');
}

function openEmployeeDetail(employeeId) {
  const emp = AppState.employees.find(e => e.id === employeeId);
  if (!emp) return;

  const modal = document.getElementById('employee-detail-modal');
  document.getElementById('detail-modal-avatar').src = emp.avatar;
  document.getElementById('detail-modal-name').textContent = emp.name;
  document.getElementById('detail-modal-role').textContent = `${emp.department} • ${emp.role}`;

  const content = document.getElementById('employee-detail-content');
  content.innerHTML = `
    <div class="grid grid-cols-2 gap-4 bg-void p-4 rounded-xl border border-subtle">
      <div>
        <span class="text-textMuted block">Email Address</span>
        <span class="text-textPrimary">${emp.email}</span>
      </div>
      <div>
        <span class="text-textMuted block">Work Shift</span>
        <span class="text-textPrimary">${emp.shiftStart} - ${emp.shiftEnd} (${emp.workType})</span>
      </div>
      <div>
        <span class="text-textMuted block">Punctuality Rating</span>
        <span class="text-emeraldPresence">${emp.weeklyStats.punctualityRate}%</span>
      </div>
      <div>
        <span class="text-textMuted block">Weekly Hours Logged</span>
        <span class="text-indigo-400">${emp.weeklyStats.totalHours} hrs</span>
      </div>
    </div>
    <div class="bg-void p-4 rounded-xl border border-subtle space-y-2">
      <span class="text-textMuted uppercase text-[10px]">Leave Quotas Remaining</span>
      <div class="grid grid-cols-3 gap-2 text-center">
        <div class="p-2 bg-elevated rounded-lg">
          <span class="text-textMuted block text-[10px]">Annual</span>
          <span class="text-textPrimary font-bold">${emp.leaveBalances.paidAnnual}</span>
        </div>
        <div class="p-2 bg-elevated rounded-lg">
          <span class="text-textMuted block text-[10px]">Medical</span>
          <span class="text-emeraldPresence font-bold">${emp.leaveBalances.medical}</span>
        </div>
        <div class="p-2 bg-elevated rounded-lg">
          <span class="text-textMuted block text-[10px]">Casual</span>
          <span class="text-amberTardy font-bold">${emp.leaveBalances.casual}</span>
        </div>
      </div>
    </div>
  `;
  modal.classList.remove('hidden');
}

// Run on DOM Ready
document.addEventListener('DOMContentLoaded', initApp);
