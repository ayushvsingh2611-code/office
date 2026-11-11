# System Architecture & Technical Contract: Canvas LMS Web Application Replica
**Author:** Nami (System & Data Architect, Straw Hat Crew Group 1)  
**Target Builder:** Zoro (Group 1 - Builder)  
**Document Version:** 1.0.0  
**Status:** Approved for Implementation

---

## 1. System Overview & Mission
The goal is to build an authentic, pixel-accurate, fully interactive web replica of **Instructure Canvas LMS** (the gold standard Higher Education Learning Management System). 

The application delivers:
1. **Global Navigation Shell**: Canvas signature left vertical navigation bar with active indicators, breadcrumbs, user profile avatar, and responsive drawer.
2. **Dashboard View**: Dynamic course cards with colored header banners, quick-action indicator badges (announcements, assignments, discussions), and right-hand utility sidebar (To Do list, Recent Feedback, and Coming Up events).
3. **Course Workspace**: Dual-pane navigation with Modules accordion, Searchable Assignments index, Announcements feed, and Syllabus outline.
4. **Assignment Submission System**: Interactive submission modal supporting text entry, simulated file uploads, and website URL submissions, with live status updates, confetti celebration, and persistence.
5. **Interactive Gradebook**: Weighted grade calculation, dynamic assignment scoring, and real-time **"What-If" score calculator** with instant GPA/letter grade updates.
6. **Academic Calendar**: Monthly calendar grid highlighting assignment due dates color-coded by course, with month-navigation and day event drawers.
7. **Local Persistence**: State preserved in `localStorage` across page reloads (submissions, what-if grades, to-do dismissals).

---

## 2. Layout & View Architecture

The interface uses a 3-layer responsive architecture:
1. `#global-nav` (Fixed left toolbar on desktop, bottom bar on mobile)
2. `#main-content-wrapper`
   - `#top-header-bar` (Breadcrumb navigation, current view label, course title, mobile toggle)
   - `#active-view-container` (Dynamic mount point for the selected view: `view-dashboard`, `view-course`, `view-grades`, `view-calendar`)
3. Overlay Modals (`#assignment-modal`, `#toast-notification`, `#submission-confetti-canvas`)

```
+----------------------------------------------------------------------------------------------------+
|  #global-nav   |  #top-header-bar (Breadcrumbs, Student Profile, Mobile Hamburger)                 |
|  [Logo]        +-----------------------------------------------------------------------------------+
|  [Account]     |  #active-view-container                                                           |
|  [Dashboard]*  |  +-------------------------------------------------------+---------------------+  |
|  [Courses]     |  | #view-dashboard                                       | #dashboard-sidebar  |  |
|  [Calendar]    |  |   - #courses-grid                                     |   - #todo-list      |  |
|  [Grades]      |  |     [Course Card] [Course Card] [Course Card]         |   - #feedback-list  |  |
|  [Inbox]       |  |                                                       |   - #coming-up-list |  |
|                |  +-------------------------------------------------------+---------------------+  |
+----------------+-----------------------------------------------------------------------------------+
```

---

## 3. DOM Element ID Master Directory (Zero Mismatch Contract)

Zoro **must** use the exact element IDs specified below. No ID name alterations, typos, or omissions.

### 3.1 Global Shell & Navigation
| Element ID | Tag | Description |
|---|---|---|
| `#app-container` | `div` | Root wrapper enclosing the entire application |
| `#global-nav` | `nav` | Main dark-charcoal Canvas left navigation sidebar |
| `#nav-logo` | `a` / `div` | Canvas red spiral logo icon & brand label |
| `#nav-account` | `button` | Account / User profile button with avatar |
| `#nav-dashboard` | `button` | Dashboard navigation item (default active) |
| `#nav-courses` | `button` | Courses navigation item (opens course view/picker) |
| `#nav-calendar` | `button` | Academic Calendar view switch button |
| `#nav-grades` | `button` | All Grades / Gradebook view switch button |
| `#nav-inbox` | `button` | Inbox notification button with message count badge |
| `#inbox-badge-count` | `span` | Unread badge counter inside Inbox icon |
| `#top-header-bar` | `header` | Sticky top navigation bar containing breadcrumbs |
| `#btn-mobile-nav-toggle` | `button` | Mobile menu toggle button (visible on screens < 768px) |
| `#breadcrumb-nav` | `nav` | Breadcrumb container showing hierarchy (e.g. `Home > CS 101 > Modules`) |
| `#breadcrumb-current` | `span` | Active breadcrumb terminal text node |
| `#user-avatar-badge` | `img` / `div` | Top right student profile avatar badge |
| `#active-view-container` | `main` | Dynamic container where individual views render |
| `#toast-notification` | `div` | Transient toast message banner for actions and errors |

---

### 3.2 Dashboard View (`#view-dashboard`)
| Element ID | Tag | Description |
|---|---|---|
| `#view-dashboard` | `section` | Container wrapper for the dashboard view |
| `#dashboard-header` | `header` | Dashboard title row ("Dashboard") |
| `#dashboard-title` | `h1` | Heading containing text "Dashboard" |
| `#dashboard-main-area` | `div` | Flex/grid split containing `#courses-grid` and `#dashboard-sidebar` |
| `#courses-grid` | `div` | Responsive grid container rendering Course Cards |
| `#dashboard-sidebar` | `aside` | Right-side column containing To-Do, Feedback, and Coming Up |
| `#todo-section` | `div` | To-Do list widget container |
| `#todo-list` | `ul` | Unordered list of pending student action items with dismiss buttons |
| `#recent-feedback-section` | `div` | Recent instructor feedback widget container |
| `#recent-feedback-list` | `ul` | Unordered list of graded assignments with score badges |
| `#coming-up-section` | `div` | Coming Up events widget container |
| `#coming-up-list` | `ul` | Unordered list of upcoming deadlines across all courses |
| `#btn-view-all-grades` | `button` | Button at bottom of sidebar navigating to `#view-grades` |

---

### 3.3 Course Workspace View (`#view-course`)
| Element ID | Tag | Description |
|---|---|---|
| `#view-course` | `section` | Container wrapper for active course detail view |
| `#course-header-banner` | `div` | Course title bar displaying course code, full title, and term |
| `#course-banner-code` | `span` | Short course code (e.g. "CS 101") |
| `#course-banner-name` | `h2` | Course name (e.g. "Introduction to Computer Science") |
| `#course-banner-term` | `span` | Term/Semester string (e.g. "Fall 2025") |
| `#course-inner-layout` | `div` | Layout container dividing Course Subnav and Course Main Panel |
| `#course-subnav` | `nav` | Course-level sidebar navigation (Home/Modules, Assignments, Grades, Announcements, Syllabus) |
| `#course-nav-modules` | `button` | Course subnav link: Modules view |
| `#course-nav-assignments` | `button` | Course subnav link: Assignments index |
| `#course-nav-grades` | `button` | Course subnav link: Course Gradebook |
| `#course-nav-announcements` | `button` | Course subnav link: Announcements list |
| `#course-nav-syllabus` | `button` | Course subnav link: Syllabus summary |
| `#course-content-pane` | `div` | Dynamic right pane rendering active course sub-view |

#### Course Sub-Panels (Nested inside `#course-content-pane`):
| Element ID | Tag | Description |
|---|---|---|
| `#panel-modules` | `div` | Collapsible modules view container |
| `#modules-control-bar` | `div` | Bar holding collapse/expand all and module filters |
| `#btn-toggle-all-modules` | `button` | Button to expand or collapse all module accordions |
| `#modules-list` | `div` | Container rendering module accordions and item rows |
| `#panel-assignments` | `div` | Course assignments index panel |
| `#assignment-search-input` | `input` | Live search input filtering assignments by title |
| `#assignment-filter-select`| `select`| Dropdown filter (All, Overdue, Upcoming, Completed) |
| `#assignments-table` | `div` / `table`| List container of assignment rows for current course |
| `#panel-announcements` | `div` | Course announcements feed panel |
| `#announcements-list` | `div` | Container for announcement cards with author & dates |
| `#panel-syllabus` | `div` | Course syllabus and weighted grade distribution summary |
| `#syllabus-content` | `div` | Text overview, course policy, and weighted grade breakdown table |

---

### 3.4 Assignment Details & Submission Modal (`#assignment-modal`)
| Element ID | Tag | Description |
|---|---|---|
| `#assignment-modal` | `div` | Full-screen modal overlay container (hidden by default) |
| `#assignment-modal-backdrop` | `div` | Semi-transparent dark backdrop (clicking dismisses modal) |
| `#assignment-modal-card` | `div` | Centered dialog card container |
| `#modal-btn-close` | `button` | Top-right "X" close modal button |
| `#modal-assignment-title` | `h3` | Header displaying assignment title |
| `#modal-assignment-course` | `span` | Course code and badge |
| `#modal-meta-due` | `span` | Due date timestamp string |
| `#modal-meta-points` | `span` | Total available points (e.g. "100 pts") |
| `#modal-meta-status` | `span` | Submission status badge ("Submitted", "Not Submitted", "Late", "Graded") |
| `#modal-assignment-body` | `div` | Rich HTML description, instructions, and prompt |
| `#modal-submission-section` | `section` | Container holding the submission tabs and entry forms |
| `#submission-tab-nav` | `div` | Tab buttons row (`Text Entry`, `File Upload`, `Website URL`) |
| `#tab-btn-text` | `button` | Switch to text submission panel |
| `#tab-btn-file` | `button` | Switch to file upload submission panel |
| `#tab-btn-url` | `button` | Switch to website URL submission panel |
| `#tab-content-text` | `div` | Text area form pane |
| `#input-submission-text` | `textarea` | Text input for rich-text assignment answers |
| `#tab-content-file` | `div` | Drag-and-drop file upload pane |
| `#input-submission-file` | `input[type="file"]` | Hidden file input element |
| `#drop-zone-area` | `div` | Clickable/droppable drag-and-drop target |
| `#file-selected-name` | `span` | Displays chosen filename and size |
| `#tab-content-url` | `div` | Website URL submission pane |
| `#input-submission-url` | `input[type="url"]` | Input field for repository/website URL |
| `#input-submission-comments` | `textarea` | Comments to instructor textarea |
| `#btn-modal-cancel` | `button` | Cancel submission button |
| `#btn-modal-submit` | `button` | Primary action button ("Submit Assignment") |
| `#submission-confetti-canvas` | `canvas` | Overlay canvas for canvas particle celebration on submit |

---

### 3.5 Gradebook & "What-If" Calculator View (`#view-grades`)
| Element ID | Tag | Description |
|---|---|---|
| `#view-grades` | `section` | Container wrapper for the Gradebook view |
| `#grades-header` | `header` | Header row with title and course selector |
| `#grades-course-select` | `select` | Dropdown to switch between enrolled courses |
| `#grades-sorting-select` | `select` | Dropdown to sort table by Due Date, Title, or Module |
| `#grades-table-wrapper` | `div` | Responsive scrollable container for the grade table |
| `#grades-table` | `table` | Core table containing all course assignments and scores |
| `#grades-tbody` | `tbody` | Dynamic table body rendering assignment rows |
| `#grades-summary-sidebar` | `aside` | Floating card computing total course percentage |
| `#summary-percentage-display` | `div` | Large text score display (e.g. "94.5%") |
| `#summary-letter-grade` | `span` | Letter grade badge (e.g. "A", "B+", "C") |
| `#what-if-badge-indicator` | `div` | Amber pill badge shown whenever what-if mode is active |
| `#btn-reset-what-if` | `button` | Button to reset all what-if scores back to actual grades |

---

### 3.6 Calendar View (`#view-calendar`)
| Element ID | Tag | Description |
|---|---|---|
| `#view-calendar` | `section` | Container wrapper for Academic Calendar view |
| `#calendar-controls` | `header` | Month switcher controls & today button |
| `#calendar-btn-prev` | `button` | Previous month button (`<`) |
| `#calendar-btn-next` | `button` | Next month button (`>`) |
| `#calendar-btn-today` | `button` | Jump to current month button ("Today") |
| `#calendar-current-month` | `h2` | Month & Year display label (e.g. "October 2025") |
| `#calendar-view-type-select` | `select` | View selector ("Month", "Agenda") |
| `#calendar-course-filters` | `div` | Course color legend & checkbox toggles to filter courses |
| `#calendar-grid-container` | `div` | 7-column calendar grid container (Sun - Sat) |
| `#calendar-grid-header` | `div` | Day headers row (Sun, Mon, Tue, Wed, Thu, Fri, Sat) |
| `#calendar-days-grid` | `div` | 35 or 42 calendar day cells rendering assignment event chips |
| `#calendar-day-drawer` | `div` | Slide-in drawer showing full day schedule when day clicked |
| `#drawer-day-title` | `h3` | Date title in drawer (e.g. "October 14, 2025") |
| `#drawer-events-list` | `ul` | Detailed event items list with direct "Open Assignment" buttons |
| `#drawer-btn-close` | `button` | Drawer close button |

---

## 4. Visual Identity & Canvas Design System

Zoro must replicate the signature Canvas LMS aesthetic:
- **Palette Tokens**:
  - Global Nav Background: `#2D3B45` (Canvas deep navy charcoal)
  - Global Nav Active/Hover: `#1E272E`
  - Global Nav Accent Red: `#E02424` or `#CC0000` (Canvas Instructure Red)
  - Course Header Banner Colors:
    - CS 101: `#008EE2` (Canvas Sky Blue)
    - CS 220: `#E02424` (Canvas Crimson)
    - MATH 240: `#00857C` (Teal Pine)
    - HIST 105: `#8A3FFC` (Royal Violet)
  - Background Neutral: `#F5F6F8` (Canvas Light Canvas Gray)
  - Card & Modal Background: `#FFFFFF`
  - Borders: `#C7CDD1` / `#E5E7EB`
  - Text Primary: `#2D3B45` / Text Secondary: `#6C757D`
  - Success Green: `#008A00` / Warning Amber: `#F59E0B`
- **Typography**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
- **Badges**:
  - Unread/Due count: Pill shape, red background `#E02424`, white bold font.
  - Status badges: Rounded pills with border & light background (`status-submitted`: `#DEF7EC`, `#03543F`; `status-missing`: `#FDE8E8`, `#9B1C1C`; `status-graded`: `#E1EFFE`, `#1E429F`).

---

## 5. Data Structures & State Model

### 5.1 Type Definitions (Data Contracts)

```javascript
/**
 * @typedef {'text' | 'file' | 'url'} SubmissionType
 * @typedef {'submitted' | 'unsubmitted' | 'graded' | 'late' | 'missing'} AssignmentStatus
 * @typedef {'dashboard' | 'course' | 'grades' | 'calendar'} ViewName
 * @typedef {'modules' | 'assignments' | 'grades' | 'announcements' | 'syllabus'} CourseTabName
 */

/**
 * @typedef {Object} Course
 * @property {string} id - Unique course slug (e.g., 'cs-101')
 * @property {string} code - Course catalog code (e.g., 'CS 101')
 * @property {string} name - Full title (e.g., 'Introduction to Computer Science')
 * @property {string} term - Academic term (e.g., 'Fall 2025')
 * @property {string} color - Hex color code for badges & cards
 * @property {string} instructor - Instructor full name
 * @property {number} unreadAnnouncements - Count for card badge
 */

/**
 * @typedef {Object} Assignment
 * @property {string} id - Unique assignment ID (e.g., 'asg-cs101-1')
 * @property {string} courseId - Foreign key referencing Course.id
 * @property {string} moduleId - Foreign key referencing Module.id
 * @property {string} title - Assignment title
 * @property {string} dueDate - ISO date string (YYYY-MM-DDTHH:MM:SS)
 * @property {number} pointsPossible - Maximum points
 * @property {number|null} actualScore - Graded points or null if unassigned
 * @property {number|null} whatIfScore - Simulated user score (for what-if calculator)
 * @property {AssignmentStatus} status - Submission and grade state
 * @property {string} description - Rich text / HTML description prompt
 * @property {SubmissionType[]} allowedTypes - Accepted submission formats
 * @property {SubmissionRecord|null} submission - Latest submission data or null
 */

/**
 * @typedef {Object} SubmissionRecord
 * @property {string} submittedAt - ISO date string of submission
 * @property {SubmissionType} type - Selected type
 * @property {string} payload - Text body, uploaded filename, or web URL
 * @property {string} comments - Optional comments to instructor
 */

/**
 * @typedef {Object} ModuleItem
 * @property {string} id - Unique item ID
 * @property {'assignment' | 'page' | 'file' | 'quiz'} type - Canvas module item type
 * @property {string} title - Item title
 * @property {string|null} assignmentId - Ref to assignment if type === 'assignment'
 * @property {boolean} isCompleted - Student completion check
 */

/**
 * @typedef {Object} CourseModule
 * @property {string} id - Unique module ID
 * @property {string} courseId - Course foreign key
 * @property {string} title - Module title (e.g., 'Week 1: Foundations of Algorithms')
 * @property {boolean} isExpanded - Accordion expanded state
 * @property {ModuleItem[]} items - Ordered items inside this module
 */

/**
 * @typedef {Object} Announcement
 * @property {string} id - Unique announcement ID
 * @property {string} courseId - Course foreign key
 * @property {string} title - Announcement subject
 * @property {string} author - Instructor name
 * @property {string} date - Display date string (e.g. 'Oct 12 at 4:30pm')
 * @property {string} preview - Short preview content
 */

/**
 * @typedef {Object} TodoItem
 * @property {string} id - Unique todo ID
 * @property {string} assignmentId - Ref to Assignment.id
 * @property {string} courseId - Ref to Course.id
 * @property {string} title - Assignment title
 * @property {string} dueFormatted - Formatted date/time (e.g. 'Tomorrow at 11:59pm')
 * @property {number} points - Total points
 * @property {boolean} dismissed - Whether user clicked "X" to dismiss
 */
```

### 5.2 Global Application State (`AppState`)
The single source of truth stored in `window.CanvasApp`:

```javascript
window.CanvasApp = {
  // Navigation State
  activeView: 'dashboard',         // 'dashboard' | 'course' | 'grades' | 'calendar'
  activeCourseId: 'cs-101',        // Current course viewed in 'course' view
  activeCourseTab: 'modules',      // 'modules' | 'assignments' | 'grades' | 'announcements' | 'syllabus'
  
  // Modal State
  selectedAssignmentId: null,      // Active assignment displayed in #assignment-modal
  activeSubmissionTab: 'text',     // 'text' | 'file' | 'url'
  
  // Calendar State
  calendarDate: new Date(2025, 9, 1), // Defaults to October 2025
  selectedCalendarDay: null,          // Date string clicked for Day Drawer
  activeCourseFilter: 'all',          // 'all' or courseId
  
  // Data Repositories
  courses: [],                     // Array of Course objects
  assignments: [],                 // Array of Assignment objects
  modules: [],                     // Array of CourseModule objects
  announcements: [],               // Array of Announcement objects
  todos: [],                       // Array of TodoItem objects
  
  // User Profile
  currentUser: {
    name: 'Monkey D. Luffy',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    role: 'Student',
    unreadMessages: 3
  }
};
```

---

## 6. Initial Seed Data Specification

Zoro must seed the app with these exact 4 realistic college courses and associated data (fallback to default if `localStorage` is empty):

1. **Course 1: CS 101 - Introduction to Computer Science**
   - ID: `cs-101`, Color: `#008EE2`, Term: `Fall 2025`, Instructor: `Dr. Vegapunk`
   - Unread Announcements: `2`
   - Assignments:
     - `asg-cs101-1`: "Problem Set 1: Computational Thinking", Due: `2025-10-05T23:59:00`, Points: `50`, Score: `48`, Status: `graded`
     - `asg-cs101-2`: "Lab 2: Python Functions & Recursion", Due: `2025-10-14T23:59:00`, Points: `100`, Score: null, Status: `unsubmitted`
     - `asg-cs101-3`: "Midterm Project: Interactive CLI Engine", Due: `2025-10-24T23:59:00`, Points: `150`, Score: null, Status: `unsubmitted`
     - `asg-cs101-4`: "Problem Set 2: Algorithmic Complexity", Due: `2025-11-02T23:59:00`, Points: `50`, Score: null, Status: `unsubmitted`

2. **Course 2: CS 220 - Data Structures & Algorithms**
   - ID: `cs-220`, Color: `#E02424`, Term: `Fall 2025`, Instructor: `Prof. Nico Robin`
   - Unread Announcements: `1`
   - Assignments:
     - `asg-cs220-1`: "Assignment 1: Linked Lists & Benchmarking", Due: `2025-10-08T23:59:00`, Points: `100`, Score: `96`, Status: `graded`
     - `asg-cs220-2`: "Assignment 2: Binary Search Trees & AVL", Due: `2025-10-18T23:59:00`, Points: `100`, Score: null, Status: `unsubmitted`
     - `asg-cs220-3`: "Assignment 3: Graphs & Dijkstra's Algorithm", Due: `2025-10-28T23:59:00`, Points: `120`, Score: null, Status: `unsubmitted`

3. **Course 3: MATH 240 - Discrete Mathematics**
   - ID: `math-240`, Color: `#00857C`, Term: `Fall 2025`, Instructor: `Prof. Trafalgar Law`
   - Unread Announcements: `0`
   - Assignments:
     - `asg-math240-1`: "Homework 1: Propositional Logic", Due: `2025-10-03T23:59:00`, Points: `30`, Score: `29`, Status: `graded`
     - `asg-math240-2`: "Homework 2: Proof by Induction", Due: `2025-10-16T23:59:00`, Points: `30`, Score: null, Status: `unsubmitted`
     - `asg-math240-3`: "Homework 3: Graph Theory & Combinatorics", Due: `2025-10-30T23:59:00`, Points: `40`, Score: null, Status: `unsubmitted`

4. **Course 4: HIST 105 - Modern World History**
   - ID: `hist-105`, Color: `#8A3FFC`, Term: `Fall 2025`, Instructor: `Dr. Clover`
   - Unread Announcements: `1`
   - Assignments:
     - `asg-hist105-1`: "Source Analysis: The Void Century Paradox", Due: `2025-10-11T23:59:00`, Points: `75`, Score: `72`, Status: `graded`
     - `asg-hist105-2`: "Essay Proposal: Industrial Revolution Impacts", Due: `2025-10-22T23:59:00`, Points: `50`, Score: null, Status: `unsubmitted`

---

## 7. Event Handler Signatures & Interaction Contract

Zoro must implement the following core handlers with exact naming and signatures:

```javascript
/**
 * Switch global application view.
 * Updates navigation indicator, displays active view, updates breadcrumbs, and persists state.
 * @param {ViewName} targetView - 'dashboard' | 'course' | 'grades' | 'calendar'
 * @param {string|null} [courseId=null] - Course ID if transitioning into a course view
 */
function switchGlobalView(targetView, courseId = null)

/**
 * Switch course sub-tab in Course Workspace.
 * @param {CourseTabName} tabName - 'modules' | 'assignments' | 'grades' | 'announcements' | 'syllabus'
 */
function switchCourseTab(tabName)

/**
 * Open assignment detail modal.
 * Populates all fields (#modal-assignment-title, #modal-meta-due, #modal-assignment-body),
 * sets selectedAssignmentId, displays submission status, and shows #assignment-modal.
 * @param {string} assignmentId - ID of assignment to display
 */
function openAssignmentModal(assignmentId)

/**
 * Close assignment detail modal.
 */
function closeAssignmentModal()

/**
 * Switch submission form tab inside assignment modal.
 * @param {SubmissionType} submissionType - 'text' | 'file' | 'url'
 */
function switchSubmissionTab(submissionType)

/**
 * Handles assignment submission submission form submit.
 * Validates inputs, creates SubmissionRecord, updates assignment status to 'submitted',
 * triggers confetti animation on #submission-confetti-canvas, shows toast notification,
 * re-renders affected views, and persists to localStorage.
 * @param {Event} event - Form submission event
 */
function handleAssignmentSubmit(event)

/**
 * Updates What-If score for an assignment and recomputes total grade.
 * @param {string} assignmentId - ID of assignment
 * @param {number|null} newScore - Hypothetical score entered by student
 */
function handleWhatIfScoreChange(assignmentId, newScore)

/**
 * Resets all What-If scores back to actual grades.
 */
function handleResetWhatIfScores()

/**
 * Filter assignments list by search query and status filter dropdown.
 */
function handleFilterAssignments()

/**
 * Navigate calendar forward or backward by one month.
 * @param {number} deltaMonths - +1 for next month, -1 for previous month
 */
function handleNavigateCalendar(deltaMonths)

/**
 * Open day drawer showing assignment deadlines for the clicked date.
 * @param {string} dateString - YYYY-MM-DD
 */
function handleOpenDayDrawer(dateString)

/**
 * Dismiss a Todo item from the dashboard sidebar list.
 * @param {string} todoId - ID of todo item to dismiss
 */
function handleDismissTodo(todoId)

/**
 * Display non-blocking transient toast notification.
 * @param {string} message - Text message
 * @param {'success' | 'info' | 'warning' | 'error'} type - Message style
 */
function showToast(message, type = 'info')
```

---

## 8. Gradebook Calculation Contract

### Calculation Logic:
1. **Assignment Score**:
   - If an assignment has a `whatIfScore` (not null), use `whatIfScore`.
   - Else if it has an `actualScore` (not null), use `actualScore`.
   - Otherwise, if unsubmitted/ungraded, it is excluded from graded percentage (standard Canvas behavior) or counted as 0 if marked missing.
2. **Total Percentage Formula**:
   $$\text{Total \%} = \left( \frac{\sum \text{Earned Points (Actual or What-If)}}{\sum \text{Points Possible of Graded Assignments}} \right) \times 100$$
3. **Letter Grade Mapping**:
   - $\ge 93.0\% \rightarrow \mathbf{A}$
   - $90.0\% - 92.9\% \rightarrow \mathbf{A-}$
   - $87.0\% - 89.9\% \rightarrow \mathbf{B+}$
   - $83.0\% - 86.9\% \rightarrow \mathbf{B}$
   - $80.0\% - 82.9\% \rightarrow \mathbf{B-}$
   - $77.0\% - 79.9\% \rightarrow \mathbf{C+}$
   - $70.0\% - 76.9\% \rightarrow \mathbf{C}$
   - $< 70.0\% \rightarrow \mathbf{D / F}$
4. **What-If Indicators**:
   - If any assignment currently has a `whatIfScore !== null`, display `#what-if-badge-indicator` ("What-If Score Active") and show the `#btn-reset-what-if` button.

---

## 9. Submission Confetti Celebration Contract

Upon successful assignment submission:
1. Read dimensions of `#submission-confetti-canvas`.
2. Generate 80+ dynamic colored confetti particles (Canvas Red, Blue, Gold, Green) shooting upwards from the bottom-center and falling under gravity.
3. Animate for 2.5 seconds using `requestAnimationFrame`.
4. Transition modal status badge to "Submitted" with timestamp and checkmark.

---

## 10. Local Storage Persistence Schema

Key name: `canvas_replica_state_v1`
Storage object:
```json
{
  "assignments": [ /* array of assignments with current actualScore, whatIfScore, submission, status */ ],
  "dismissedTodos": [ "todo-1", "todo-3" ],
  "activeCourseId": "cs-101",
  "activeView": "dashboard"
}
```

---

## 11. Builder (Zoro) Execution Checklist

- [ ] **HTML Structure (`index.html`)**:
  - Implement full layout with `#global-nav`, `#top-header-bar`, `#active-view-container`.
  - Include views: `#view-dashboard`, `#view-course`, `#view-grades`, `#view-calendar`.
  - Include modal: `#assignment-modal` with tabs and canvas `#submission-confetti-canvas`.
  - Include `#toast-notification`.
- [ ] **Styles (`style.css`)**:
  - Implement Canvas color theme, typography, navigation sidebar, card grids, tables, and modal animations.
  - Implement mobile responsive layout (nav collapsible into `#btn-mobile-nav-toggle`).
- [ ] **JavaScript Logic (`app.js`)**:
  - Instantiate `window.CanvasApp` state model.
  - Populate initial seed data with 4 courses and realistic assignments.
  - Bind all event listeners to specified IDs.
  - Implement "What-If" score calculator with reactive summary update.
  - Implement Interactive Month Calendar with color-coded assignment chips.
  - Implement Assignment Submission with tabs (text, file, URL) and Confetti effect.
  - Implement `localStorage` auto-saving and re-hydration on reload.

---
*Contract ratified by Nami (System Architect). Handed off to Zoro for coding.*
