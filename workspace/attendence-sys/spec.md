# ChronosPulse Enterprise™ — Attendance & Workforce Intelligence Suite
## System Architecture & Technical Specification Contract
**Document Version:** 1.0.0-PROD  
**Author:** Nami (Group 1 - Architect), System & Data Architect  
**Target Implementer:** Zoro (Group 1 - Builder)  
**Status:** Frozen & Approved for Direct Implementation  

---

## 1. Executive Identity, Brand Essence & Visual Hierarchy

### 1.1 Brand Identity & Design System
- **Product Title:** `ChronosPulse Enterprise™ v4.2`
- **Sub-headline:** High-Precision Biometric, Geolocation & Workforce Time-Tracking Intelligence Platform
- **Design Metaphor:** Silicon Valley NextGen Executive Ops (Linear + Vercel + Stripe Dark Glassmorphism)
- **Palette Tokens:**
  - `Void Canvas`: `#06080F` (Base background)
  - `Surface Obsidian`: `#0D111D` (Sidebar and card background)
  - `Surface Elevated`: `#161D2F` (Dropdowns, modals, floating panels)
  - `Border Subtle`: `#1E293B` (1px clean outlines)
  - `Border Glow`: `#334155` (Hover / focus rings)
  - `Primary Neon Indigo`: `#6366F1` (Buttons, active states, key focus)
  - `Primary Glow`: `rgba(99, 102, 241, 0.25)`
  - `Emerald Presence`: `#10B981` (Clocked In / Present / Approved)
  - `Amber Tardy`: `#F59E0B` (Late / On Break / Pending Approval)
  - `Rose Absent`: `#EF4444` (Absent / Rejected / Overdue)
  - `Sky Info`: `#0EA5E9` (Remote / Field / Shift notes)
  - `Text Primary`: `#F8FAFC` (Headings, primary values)
  - `Text Muted`: `#94A3B8` (Captions, timestamps, inactive states)
  - `Font Stacks`: `'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif`
  - `Monospace Stacks`: `'JetBrains Mono', 'Fira Code', monospace`

### 1.2 Layout Blueprint
- **Header (`#header-container`):**
  - Brand Logo + Pulsing live telemetry orb (`#live-status-orb`).
  - High-precision live clock (`#live-digital-clock`) displaying `HH:MM:SS AM/PM` with millisecond ticks (`#clock-millis`).
  - Active Working Profile Quick-Switcher (`#current-user-select`).
  - Quick Punch Action Bar (`#btn-quick-punch-in`, `#btn-quick-break`, `#btn-quick-punch-out`).
  - Global Search input (`#global-search-input`).
  - Notification Bell (`#btn-notification-trigger`) with unread badge (`#notification-badge`).
- **Main Viewport split into Left Sidebar (`#sidebar-nav`) + Main Stage (`#main-stage-content`):**
  - **Tab 1: Punch Terminal & Kiosk (`#view-punch-kiosk`)**: Live simulated biometric scanner, webcam feed preview simulation with facial bounding box, real-time geolocation simulator (IP & Lat/Lng), active shift timer, break countdown, and personal punch timeline.
  - **Tab 2: Workforce Roster & Daily Attendance (`#view-roster`)**: Real-time presence matrix with instant filtering (Department, Presence Status, Shift), search bar, Quick Check-in/Check-out manual overrides, employee profile drawer trigger, and batch actions.
  - **Tab 3: Leaves & Absence Management (`#view-leaves`)**: Leave balance cards (Casual, Medical, Earned, Unpaid), New Leave Request modal form, and real-time Interactive Approval/Rejection inbox.
  - **Tab 4: Detailed Timesheets & Audit Log (`#view-timesheets`)**: Date-range query filter, daily work duration calculation, automatic overtime tally, break time deduction, CSV/JSON export, and printable audit trail.
  - **Tab 5: Analytics & Algorithmic Heatmap (`#view-analytics`)**: Dynamic HTML5 Canvas 52-week attendance activity matrix, Department punctuality comparison chart, on-time percentage meter, and peak arrival time curves.
  - **Tab 6: Shift Policy & System Config (`#view-settings`)**: Standard working hours (9:00 AM - 5:00 PM), late threshold tolerance (15 min grace period), biometric camera simulation toggles, and seed data reset controls.

---

## 2. Core Data Models & Schemas

### 2.1 Types & Interfaces

```typescript
export type AttendanceStatus = 'present' | 'late' | 'break' | 'remote' | 'absent' | 'leave';

export type Department = 'Engineering' | 'Product' | 'People Ops' | 'Design' | 'Finance' | 'DevOps';

export interface Employee {
  id: string;               // e.g. "EMP-1001"
  name: string;             // e.g. "Elena Rostova"
  role: string;             // e.g. "VP of Engineering"
  department: Department;
  email: string;
  avatar: string;           // HTTPS avatar URL
  shiftStart: string;       // e.g. "09:00"
  shiftEnd: string;         // e.g. "17:30"
  workType: 'Office' | 'Remote' | 'Hybrid';
  status: AttendanceStatus;
  currentSession: {
    punchIn: string | null;       // ISO Timestamp or null
    lastBreakStart: string | null;
    totalBreakMinutes: number;
    punchOut: string | null;
    ipAddress: string;
    locationName: string;
    verifiedBiometric: boolean;
  };
  leaveBalances: {
    paidAnnual: number;     // e.g. 14
    medical: number;        // e.g. 8
    casual: number;         // e.g. 4
  };
  weeklyStats: {
    daysPresent: number;
    totalHours: number;
    punctualityRate: number; // percentage e.g. 96
  };
}

export interface PunchRecord {
  id: string;               // "PUNCH-xxxx"
  employeeId: string;
  employeeName: string;
  department: Department;
  timestamp: string;        // ISO 8601 string
  type: 'CLOCK_IN' | 'CLOCK_OUT' | 'BREAK_START' | 'BREAK_END';
  device: string;           // "Biometric Face ID Terminal 01" | "Web Portal"
  ipAddress: string;
  latitude: number;
  longitude: number;
  statusTag: AttendanceStatus;
  notes?: string;
}

export interface LeaveRequest {
  id: string;               // "LV-9041"
  employeeId: string;
  employeeName: string;
  department: Department;
  leaveType: 'Annual' | 'Medical' | 'Casual' | 'Unpaid';
  startDate: string;        // "YYYY-MM-DD"
  endDate: string;          // "YYYY-MM-DD"
  daysCount: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedAt: string;        // ISO timestamp
  reviewerNote?: string;
}

export interface SystemSettings {
  gracePeriodMinutes: number;   // default: 15
  standardWorkHours: number;    // default: 8.0
  autoOvertimeTriggerHours: number; // default: 8.5
  companyName: string;          // "ChronosPulse Systems Inc."
  officeCoordinates: { lat: number; lng: number; radiusMeters: number };
}
```

---

## 3. Mandatory Pre-loaded Seed Data (10 Realistic Enterprise Records)

This dataset must be loaded into `localStorage` under key `'CHRONOSPULSE_APP_STATE'` if no existing data is found.

```javascript
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
```

---

## 4. Exact DOM Element IDs & Structure

To ensure zero ID mismatches between HTML and JS, all element IDs are strictly frozen as follows:

### 4.1 Global Header & Navigation
- `#header-container`: Top navigation bar
- `#live-status-orb`: Breathing animated green/amber radar pulse dot
- `#live-digital-clock`: Text container displaying formatted local time (`HH:MM:SS`)
- `#clock-millis`: Monospace millisecond readout (`.842`)
- `#current-user-select`: Dropdown `<select>` containing all employees to toggle active logged-in employee context
- `#global-search-input`: Universal quick-filter text input
- `#btn-notification-trigger`: Top right bell icon button
- `#notification-badge`: Unread counter pill (e.g. `2`)
- `#notifications-drawer`: Slide-over panel listing recent audit punches and approvals
- `#btn-close-notifications`: Button inside drawer to close notifications panel
- `#notifications-list`: Container where audit notifications render
- `#btn-reset-demo-data`: Emergency factory reset button to reload default seed dataset
- `#sidebar-nav`: Left vertical menu container
- `#nav-tab-kiosk`: Nav item for Punch Terminal / Kiosk
- `#nav-tab-roster`: Nav item for Workforce Roster & Attendance Grid
- `#nav-tab-leaves`: Nav item for Leaves Management
- `#nav-tab-timesheets`: Nav item for Timesheets & Audit Log
- `#nav-tab-analytics`: Nav item for Analytics & Heatmap
- `#nav-tab-settings`: Nav item for Policy & System Rules

### 4.2 Tab 1: Live Punchpad & Biometric Kiosk (`#view-punch-kiosk`)
- `#kiosk-user-card`: Visual display of currently selected employee (photo, name, role, department tag)
- `#kiosk-avatar`: Selected employee's image tag `<img>`
- `#kiosk-name`: Employee name element
- `#kiosk-role-badge`: Role and department badge
- `#kiosk-current-status-badge`: Dynamic badge (`ONLINE / CLOCKED IN`, `ON BREAK`, `CLOCKED OUT`)
- `#kiosk-live-stopwatch`: Big stopwatch showing elapsed working time today (`04:32:18`)
- `#kiosk-break-stopwatch`: Secondary stopwatch showing break time today (`00:18:04`)
- `#biometric-video-container`: Simulated webcam feed container with scanning grid overlay
- `#biometric-camera-canvas`: HTML5 canvas rendering simulated facial geometry wireframe mesh & scanning laser line
- `#btn-toggle-camera`: Toggle simulated live camera preview
- `#biometric-match-indicator`: Green HUD badge `"FACIAL IDENTITY VERIFIED: 99.4% MATCH"`
- `#geo-coordinates-text`: Real-time simulated geolocation coords (e.g. `Lat: 37.7749° N, Lng: 122.4194° W (Within HQ Geofence)`)
- `#btn-kiosk-clock-in`: Big primary punch in button (`[CLOCK IN]`)
- `#btn-kiosk-break`: Secondary break toggle button (`[TAKE BREAK]` / `[RESUME WORK]`)
- `#btn-kiosk-clock-out`: Red punch out button (`[CLOCK OUT]`)
- `#kiosk-recent-activity-list`: List of last 5 punch actions for current session
- `#kiosk-notes-input`: Optional quick note input before punching (e.g. "Work from client office")

### 4.3 Tab 2: Workforce Roster & Presence Matrix (`#view-roster`)
- `#roster-stat-total`: Count pill for Total Active Staff (e.g. `10`)
- `#roster-stat-present`: Count pill for Present (`7`)
- `#roster-stat-late`: Count pill for Late (`1`)
- `#roster-stat-break`: Count pill for On Break (`1`)
- `#roster-stat-absent`: Count pill for Absent / Leave (`2`)
- `#roster-search-input`: Search employees by name, role, or ID
- `#roster-filter-department`: Department filter dropdown (`All`, `Engineering`, `Product`, `People Ops`, `Design`, `Finance`, `DevOps`)
- `#roster-filter-status`: Attendance status dropdown (`All`, `present`, `late`, `break`, `remote`, `absent`, `leave`)
- `#roster-table-body`: `<tbody>` where employee rows are dynamically injected
- `#roster-view-grid-btn`: Toggle button to switch from Table view to Card Grid view
- `#roster-view-table-btn`: Toggle button to switch to Table view
- `#roster-cards-container`: Grid container for Card view mode
- `#btn-open-manual-punch-modal`: Button to trigger manual attendance override modal

### 4.4 Tab 3: Leaves & Absence Management (`#view-leaves`)
- `#btn-request-leave-modal`: Button to open the "Submit Leave Application" modal
- `#leave-balance-annual`: Display counter for Annual leaves remaining
- `#leave-balance-medical`: Display counter for Medical leaves remaining
- `#leave-balance-casual`: Display counter for Casual leaves remaining
- `#leave-requests-table-body`: Table body rendering all leave tickets
- `#leave-filter-status`: Filter dropdown (`ALL`, `PENDING`, `APPROVED`, `REJECTED`)
- Modal `#modal-request-leave`:
  - `#input-leave-type`: Select (`Annual`, `Medical`, `Casual`, `Unpaid`)
  - `#input-leave-start`: Date input
  - `#input-leave-end`: Date input
  - `#input-leave-reason`: Textarea for reason
  - `#calculated-leave-days`: Readout badge showing calculated business days
  - `#btn-submit-leave`: Submit button
  - `#btn-cancel-leave`: Cancel / Close modal button

### 4.5 Tab 4: Timesheets & Detailed Audit Trail (`#view-timesheets`)
- `#timesheet-date-filter`: Date picker / period selector (`Today`, `This Week`, `This Month`, `Custom`)
- `#timesheet-department-filter`: Department filter select
- `#timesheet-table-body`: Table body rendering full punch log history (Employee, Date, In Time, Break Duration, Out Time, Total Effective Hours, Overtime Hours, Compliance Badge)
- `#timesheet-total-hours`: Summary metric for aggregated fleet working hours
- `#timesheet-overtime-hours`: Summary metric for aggregated overtime
- `#btn-export-csv`: Primary export button to download `.csv`
- `#btn-export-json`: Secondary export button to download `.json`
- `#btn-print-timesheet`: Print-ready stylized workforce attendance report

### 4.6 Tab 5: Analytics & Algorithmic Heatmap (`#view-analytics`)
- `#attendance-heatmap-canvas`: High-performance Algorithmic Canvas rendering 52-week activity commit-style heatmap for the workforce
- `#metric-punctuality-score`: Fleet on-time percentage dial/stat (e.g. `93.4%`)
- `#metric-avg-workhours`: Average daily hours worked (e.g. `7.8 hrs`)
- `#metric-absenteeism-rate`: Unplanned absence rate (e.g. `3.2%`)
- `#department-breakdown-canvas`: Canvas bar chart / radial visualizing attendance rates across departments
- `#arrival-curve-canvas`: Distribution of check-in times (8:00 AM to 10:30 AM curve)

### 4.7 Tab 6: Policy & Shift Rules (`#view-settings`)
- `#setting-work-start`: Shift start time input (Default: `09:00`)
- `#setting-work-end`: Shift end time input (Default: `17:30`)
- `#setting-grace-period`: Grace period input in minutes (Default: `15`)
- `#setting-overtime-threshold`: Daily hours overtime trigger (Default: `8.5`)
- `#setting-toggle-biometric`: Checkbox switch to enforce simulated biometric face scan before punch-in
- `#btn-save-settings`: Save settings to local storage with toast feedback
- `#btn-factory-reset`: Complete storage wipe and re-seed button

### 4.8 Shared Modals, Drawers & Toast Feedback
- `#employee-detail-modal`: Modal displaying in-depth employee timesheet, weekly punch timeline, leave quotas, and biometric hash
- `#btn-close-employee-modal`: Close button for detail modal
- `#manual-override-modal`: Modal for HR manual punch entry
  - `#override-employee-select`: Dropdown of employees
  - `#override-punch-type`: Type select (`CLOCK_IN`, `CLOCK_OUT`)
  - `#override-timestamp`: Datetime input
  - `#override-reason`: Reason text input
  - `#btn-save-override`: Save button
  - `#btn-close-override`: Close modal button
- `#toast-container`: Floating container in bottom-right for responsive alert toasts
- `#audio-punch-success`: Web Audio API synthetic synthesis or audio chime handler

---

## 5. Event Handlers & State Management Contract

### 5.1 Application State Object

```javascript
const AppState = {
  currentUser: "EMP-1001",           // Current active profile ID
  activeTab: "kiosk",                // "kiosk" | "roster" | "leaves" | "timesheets" | "analytics" | "settings"
  employees: [],                     // Array of Employee objects
  punchHistory: [],                  // Array of PunchRecord objects
  leaveRequests: [],                 // Array of LeaveRequest objects
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
    rosterViewMode: "table",         // "table" | "grid"
    timesheetDate: "all",
    leaveStatus: "ALL"
  },
  sessionTimers: {
    workIntervalId: null,
    breakIntervalId: null
  }
};
```

### 5.2 Interactive Event Function Signatures

Every button and interactive element must connect to an explicit JavaScript handler. No empty anchors (`href="#"`) or unhandled clicks:

1. **`initApp(): void`**
   - Hydrates `AppState` from `localStorage` or initial fallback seeds (`SEED_EMPLOYEES`, `SEED_LEAVE_REQUESTS`).
   - Starts millisecond clock ticker `startClockTicker()`.
   - Starts biometric camera simulation canvas loop.
   - Populates `#current-user-select`.
   - Renders active tab view.
   - Updates all header pills and summary counters.

2. **`handleTabSwitch(tabName: string): void`**
   - Active state classes applied to `#nav-tab-${tabName}`.
   - Toggles visibility (`display: none` / `display: block` with fade-in CSS transition) for `#view-${tabName}`.
   - If switching to `analytics`, triggers `#attendance-heatmap-canvas` and `#department-breakdown-canvas` redraws.

3. **`handleUserChange(employeeId: string): void`**
   - Updates `AppState.currentUser = employeeId`.
   - Refreshes `#kiosk-user-card`, `#kiosk-avatar`, `#kiosk-name`, `#kiosk-role-badge`, and `#kiosk-current-status-badge`.
   - Re-calculates and binds live session timers (`#kiosk-live-stopwatch`, `#kiosk-break-stopwatch`).
   - Updates punch action buttons (enabling/disabling based on current user status).

4. **`handleClockIn(employeeId?: string, isManual?: boolean): void`**
   - Validates user is not already clocked in.
   - Determines status: calculates if current time exceeds `shiftStart + gracePeriodMinutes` -> marks as `'late'`, otherwise `'present'`.
   - Creates a new `PunchRecord` with timestamp, simulated IP, GPS, and push to `AppState.punchHistory`.
   - Updates employee `currentSession.punchIn = new Date().toISOString()`, `status = calculatedStatus`.
   - Persists state to `localStorage`.
   - Plays pleasant synthesizer success chord using Web Audio API.
   - Shows Toast: `"Elena Rostova clocked in successfully at 09:02 AM (On Time)"`.
   - Refreshes Kiosk, Roster table, and Timesheet views synchronously.

5. **`handleBreakToggle(employeeId?: string): void`**
   - If user is currently `'present'` or `'late'`:
     - Updates status to `'break'`.
     - Sets `currentSession.lastBreakStart = new Date().toISOString()`.
     - Logs `BREAK_START` PunchRecord.
     - Updates button label to `"RESUME WORK"`.
     - Toast: `"Break started. Shift timer paused."`
   - If user is currently `'break'`:
     - Computes elapsed break minutes and adds to `currentSession.totalBreakMinutes`.
     - Resets `currentSession.lastBreakStart = null`.
     - Returns status to `'present'` (or `'late'`).
     - Logs `BREAK_END` PunchRecord.
     - Updates button label to `"TAKE BREAK"`.
     - Toast: `"Break ended. Welcome back!"`
   - Syncs DOM and storage.

6. **`handleClockOut(employeeId?: string): void`**
   - Validates user is currently clocked in or on break.
   - Sets `currentSession.punchOut = new Date().toISOString()`.
   - Logs `CLOCK_OUT` PunchRecord.
   - Calculates total daily net hours = `(punchOut - punchIn) - totalBreakMinutes`.
   - Updates employee status to `'absent'` (clocked out for the day) or historical logged state.
   - Resets active session pointers.
   - Shows summary modal/toast with total hours logged today and overtime accrued.
   - Syncs DOM and storage.

7. **`handleLeaveSubmit(event: Event): void`**
   - Prevents default form submit.
   - Reads `#input-leave-type`, `#input-leave-start`, `#input-leave-end`, `#input-leave-reason`.
   - Validates date order (`startDate <= endDate`).
   - Generates unique ID (`LV-` + 3 random digits).
   - Adds record to `AppState.leaveRequests` with status `'PENDING'`.
   - Closes `#modal-request-leave`.
   - Renders new row in `#leave-requests-table-body`.
   - Triggers notification badge counter update.
   - Shows Toast: `"Leave application submitted for approval."`

8. **`handleLeaveDecision(leaveId: string, decision: 'APPROVED' | 'REJECTED'): void`**
   - Finds request in `AppState.leaveRequests`.
   - Sets status to `decision`.
   - If approved, deducts corresponding leave days from employee's `leaveBalances`.
   - If current date falls within leave dates, updates employee status to `'leave'`.
   - Re-renders leave table and employee roster.
   - Shows Toast: `"Leave request LV-xxx has been ${decision}."`

9. **`handleExportCSV(): void`**
   - Compiles all punch history and timesheet records into standard RFC 4180 CSV string with headers:
     `Employee ID, Name, Department, Date, Punch In, Punch Out, Break Minutes, Net Hours, Overtime, Status`.
   - Creates dynamic `Blob`, triggers browser download `chronospulse_timesheet_export.csv`.
   - Shows Toast: `"CSV export downloaded successfully."`

10. **`handleExportJSON(): void`**
    - Serializes complete system state into formatted JSON.
    - Triggers browser download `chronospulse_backup_state.json`.

11. **`handleFilterChange(type: string, value: string): void`**
    - Updates corresponding `AppState.filters` field.
    - Synchronously filters table without reloading page. Zero latency DOM update.

12. **`handleResetDemoData(): void`**
    - Prompts user confirmation.
    - Clears `localStorage` key `'CHRONOSPULSE_APP_STATE'`.
    - Re-seeds with default 10 employees and 4 leave records.
    - Shows confirmation Toast and re-renders entire UI.

---

## 6. Algorithmic Canvas Graphics & Dynamic Visualizations

### 6.1 Attendance Activity Heatmap (`#attendance-heatmap-canvas`)
- Modeled after GitHub's 52-week commit contribution matrix, scaled for 10-person enterprise attendance activity over the past 12 weeks:
  - Canvas dimension: `800px x 140px` (HiDPI 2x retina scaled).
  - Cell size: `12px x 12px` with `3px` corner radius and `3px` cell spacing.
  - Colors:
    - Level 0 (Weekend / No Activity): `#1E293B`
    - Level 1 (Under 7 hrs): `#064E3B`
    - Level 2 (7 to 8 hrs - Standard): `#059669`
    - Level 3 (8 to 9 hrs - Optimal): `#10B981`
    - Level 4 (Over 9 hrs - Overtime): `#34D399`
  - Interactive tooltip on canvas hover showing exact date and attendance rate for that day.

### 6.2 Simulated Biometric Mesh Canvas (`#biometric-camera-canvas`)
- Renders an ultra-modern cybernetic face recognition HUD:
  - Video placeholder gradient with scanning grid line oscillating vertically (`Math.sin(time)`).
  - Four targeting corner brackets (`[ ]`) framing the user face silhouette.
  - 8-12 animated facial landmark feature points (`(x, y)` dots connected by faint cyan lines).
  - Real-time confidence score counter updating dynamically (`98.8% -> 99.4%`).
  - Toggle button `#btn-toggle-camera` allows switching between active biometric scan and offline mode.

### 6.3 Department Presence Radial & Distribution Canvas (`#department-breakdown-canvas`)
- HTML5 Canvas drawing horizontal or donut attendance bars:
  - Shows each department: Engineering, Design, DevOps, People Ops, Finance, Product.
  - Displays percentage present today with colored pill bars.

---

## 7. Performance & Optimization Standards

1. **Zero-Lag Dynamic Updates:**
   - Table filtering (`#roster-search-input`, `#roster-filter-department`) must use efficient DOM fragment updates or `hidden` attribute toggles to maintain 60 FPS even with extensive logs.
2. **Web Audio Synthetic Sound Effects:**
   - Use standard `AudioContext` with synthesized gentle sine/triangle waves (no external audio files to avoid CORS or 404 network failures):
     - Clock-In Chime: 2-tone rising arpeggio (523Hz `C5` -> 659Hz `E5`).
     - Clock-Out Chime: 2-tone descending tone (659Hz `E5` -> 440Hz `A4`).
     - Error/Late Alert: Subtle low dual buzz (220Hz).
3. **HiDPI Retina Canvas Rendering:**
   - All Canvas elements must scale by `window.devicePixelRatio` to prevent blurry text on Apple Retina and 4K displays.
4. **Resilient Local Storage Fallback:**
   - Every state change triggers a debounced (150ms) write to `localStorage`.
   - If `localStorage` is disabled or fails quota, app falls back to in-memory state seamlessly without throwing unhandled exceptions.

---

## 8. File Structure Contract for Zoro (Builder)

The implementation must be delivered as clean, modular, and self-contained code:

```
workspace/
├── index.html        # Complete semantic HTML5 structure with exact IDs specified in Section 4
├── styles.css        # Premium Tailwind/Dark glassmorphic styling, animations & responsive grid
├── app.js            # Fully working JavaScript application logic, state manager, audio synth & canvas renderers
└── spec.md           # This architecture contract document
```

---

## 9. Verification Checklist (Builder Must Meet 100%)

- [x] **No dead buttons**: Every single button (`Clock In`, `Take Break`, `Clock Out`, `Filter`, `Export CSV`, `Export JSON`, `Approve`, `Reject`, `Submit Leave`, `Reset Demo`) has a working event listener.
- [x] **10 Rich Seed Employees**: Fully populated with real avatars, titles, departments, and active statuses on initial load.
- [x] **Synchronous Initialization**: Never displays an empty table or "No Data" on initial launch.
- [x] **Live Clock & Stopwatch**: Clock ticks in real-time with milliseconds and hours elapsed update every second.
- [x] **Functional Attendance Workflow**: Punching In immediately updates the employee's badge, starts their live timer, logs an audit entry, updates the workforce roster table, and reflects in the timesheets.
- [x] **Leave Management Workflow**: Leave applications calculate business days, appear in the pending list, and can be Approved/Rejected with immediate balance deductions.
- [x] **Real-world Export Capabilities**: Real `.csv` and `.json` files are generated and triggered for direct browser download.
- [x] **Modern Aesthetics**: High-end Obsidian/Neon Indigo/Emerald enterprise interface matching top Silicon Valley dev tools.

---
*Signed & Certified,*  
**Nami, System & Data Architect (Straw Hat Crew Group 1)**
