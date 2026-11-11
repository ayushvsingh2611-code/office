# Straw Hat Crew GROUP 1 - Architecture Blueprint & Contract: Library Management System (Alexandria LMS)

## 1. System Overview & Architecture

The Library Management System (**Alexandria LMS**) is an enterprise-grade, fully client-side single-page application (SPA) built with vanilla HTML5, CSS3 (Modern Flexbox/Grid, CSS custom properties, responsive design), and modular ES6 JavaScript.

The system handles book inventory cataloging, member registration and management, circulation (borrowing, returning, renewal, overdue fine tracking), reservations/holds, interactive dashboards with statistical metrics, toast notifications, search/filter/sorting, and data export/import with `localStorage` persistence.

### Module Architecture
```
/
├── index.html              # Main single-page application structure with exact contract IDs
├── css/
│   └── style.css           # Modern, responsive theme, dark/light styling, layout, modal styles
└── js/
    ├── app.js              # Application entry point, routing/view switching, global event listeners
    ├── state.js            # Centralized application state, reactive store, and persistence bridge
    ├── storage.js          # LocalStorage engine, mock seed dataset, JSON import/export
    ├── books.js            # Book catalog CRUD, search, filter, sort, modal handlers
    ├── members.js          # Member management CRUD, search, status toggles, detail view
    ├── circulation.js      # Issue book, return book, renew loan, fine calculation, reservations
    ├── dashboard.js        # Statistics calculation, KPIs, recent activity feed, analytics charts
    └── ui.js               # Modal controllers, toast system, tab navigation, DOM render helpers
```

---

## 2. DOM Element IDs Contract (CRITICAL)

Zoro (Builder) **must** strictly use these exact element IDs in `index.html` and reference them identically in JavaScript. No deviation or omission is permitted.

### 2.1 Navigation & Layout Containers
- `#app-container`: Top-level application shell
- `#sidebar`: Left navigation panel
- `#main-content`: Dynamic view area displaying current active tab/screen
- `#nav-dashboard`: Sidebar navigation link for Dashboard view
- `#nav-books`: Sidebar navigation link for Books Catalog view
- `#nav-members`: Sidebar navigation link for Members view
- `#nav-circulation`: Sidebar navigation link for Circulation/Loans view
- `#nav-reservations`: Sidebar navigation link for Book Reservations view
- `#nav-settings`: Sidebar navigation link for System Settings/Data view
- `#header-user-display`: Top header avatar and user label
- `#header-datetime`: Dynamic live clock and calendar date display
- `#btn-theme-toggle`: Dark/Light mode toggle button
- `#quick-search-input`: Top-bar global quick search input
- `#toast-container`: Floating toast notification popup stack container

### 2.2 View Sections (Only one active at a time)
- `#view-dashboard`: Dashboard section
- `#view-books`: Books catalog section
- `#view-members`: Members management section
- `#view-circulation`: Circulation (Loans & Returns) section
- `#view-reservations`: Reservations waitlist section
- `#view-settings`: System settings & backup section

---

### 2.3 Dashboard View Elements (`#view-dashboard`)
- `#kpi-total-books`: Counter display for total book titles
- `#kpi-available-copies`: Counter display for currently available book copies
- `#kpi-active-loans`: Counter display for ongoing borrowed books
- `#kpi-overdue-loans`: Counter display for overdue books
- `#kpi-total-members`: Counter display for registered members
- `#kpi-total-fines`: Counter display for accumulated unpaid fines
- `#chart-category-distribution`: Container/Canvas for category breakdown
- `#chart-monthly-loans`: Container/Canvas for monthly circulation activity
- `#recent-activity-list`: Container list rendering recent loan, return, and registration activities
- `#btn-quick-borrow`: Action button to immediately open Borrow Book modal
- `#btn-quick-add-book`: Action button to immediately open Add Book modal
- `#btn-quick-add-member`: Action button to immediately open Add Member modal

---

### 2.4 Books Catalog View Elements (`#view-books`)
- `#book-search-input`: Text input for searching title, author, ISBN
- `#book-genre-filter`: Dropdown select filter for genres (All, Fiction, Non-Fiction, Tech, Science, History, etc.)
- `#book-status-filter`: Dropdown select filter (All, Available, All Borrowed)
- `#book-sort-select`: Dropdown sort selector (`title-asc`, `title-desc`, `author-asc`, `year-desc`, `rating-desc`)
- `#btn-open-add-book`: Button to trigger `#modal-book-form` in create mode
- `#books-grid`: Container rendering book card items or table rows
- `#books-count-summary`: Text element showing "Showing X of Y books"
- `#books-pagination`: Pagination controls container
- `#books-prev-page-btn`: Pagination previous button
- `#books-next-page-btn`: Pagination next button
- `#books-page-indicator`: Text display showing "Page X of Y"

---

### 2.5 Members View Elements (`#view-members`)
- `#member-search-input`: Text input for member name, email, member ID
- `#member-status-filter`: Dropdown select (`all`, `active`, `suspended`, `expired`)
- `#member-type-filter`: Dropdown select (`all`, `student`, `faculty`, `general`)
- `#btn-open-add-member`: Button to trigger `#modal-member-form` in create mode
- `#members-table-body`: `<tbody>` container rendering member rows
- `#members-count-summary`: Text element showing "Showing X of Y members"
- `#members-pagination`: Pagination container for member list
- `#members-prev-page-btn`: Member pagination previous button
- `#members-next-page-btn`: Member pagination next button
- `#members-page-indicator`: Member pagination page text

---

### 2.6 Circulation View Elements (`#view-circulation`)
- `#circulation-tab-loans`: Tab button for Active Loans
- `#circulation-tab-history`: Tab button for Loan History / Returned Loans
- `#circulation-search-input`: Search input by Book Title, Member Name, or Loan ID
- `#circulation-status-filter`: Dropdown (`all`, `on-time`, `overdue`, `returned`)
- `#btn-open-issue-loan`: Button to trigger `#modal-issue-loan`
- `#loans-table-body`: `<tbody>` rendering active and past loans
- `#circulation-count-summary`: Text summary showing total active/overdue loans

---

### 2.7 Reservations View Elements (`#view-reservations`)
- `#reservation-search-input`: Search reservations by book title or member name
- `#reservation-status-filter`: Dropdown (`all`, `pending`, `fulfilled`, `cancelled`)
- `#btn-open-create-reservation`: Button to trigger `#modal-create-reservation`
- `#reservations-table-body`: `<tbody>` rendering reservation queue rows
- `#reservations-count-summary`: Text displaying total active reservations

---

### 2.8 Settings & Data Management View Elements (`#view-settings`)
- `#settings-library-name`: Input for library name
- `#settings-loan-period-days`: Input number for default loan period in days
- `#settings-daily-fine-rate`: Input number for fine rate per day ($)
- `#settings-max-books-limit`: Input number for default max books per member
- `#btn-save-settings`: Button to save general settings
- `#btn-export-json`: Button to export entire database to a downloadable JSON file
- `#input-import-json`: Hidden `<input type="file" accept=".json">` for uploading backup JSON
- `#btn-trigger-import`: Button to prompt file picker for JSON import
- `#btn-reset-sample-data`: Button to wipe custom data and restore rich seed dataset

---

### 2.9 Modal Overlays and Form Element IDs

#### A. Book Modal (`#modal-book-form`)
- `#modal-book-form`: Dialog/Modal wrapper for creating/editing a book
- `#modal-book-title`: Heading (e.g., "Add New Book" or "Edit Book")
- `#form-book`: `<form>` element
- `#book-id-hidden`: Hidden `<input>` holding book ID (empty for create)
- `#book-input-title`: Text `<input>` for book title
- `#book-input-author`: Text `<input>` for author name
- `#book-input-isbn`: Text `<input>` for ISBN (10 or 13 digits)
- `#book-input-genre`: `<select>` element for genre selection
- `#book-input-year`: Number `<input>` for publication year
- `#book-input-publisher`: Text `<input>` for publisher
- `#book-input-copies-total`: Number `<input>` for total owned copies
- `#book-input-shelf-location`: Text `<input>` for shelf code (e.g., "A-12")
- `#book-input-cover-url`: URL `<input>` for book cover image
- `#book-input-description`: `<textarea>` for summary/synopsis
- `#btn-cancel-book`: Button to close modal
- `#btn-save-book`: Button (`type="submit"`) to save book

#### B. Member Modal (`#modal-member-form`)
- `#modal-member-form`: Dialog/Modal wrapper for creating/editing a member
- `#modal-member-title`: Heading ("Add New Member" or "Edit Member")
- `#form-member`: `<form>` element
- `#member-id-hidden`: Hidden `<input>` holding member ID
- `#member-input-name`: Text `<input>` for full name
- `#member-input-email`: Email `<input>` for email address
- `#member-input-phone`: Phone `<input>` for phone number
- `#member-input-type`: `<select>` for membership tier (`student`, `faculty`, `general`)
- `#member-input-status`: `<select>` for status (`active`, `suspended`, `expired`)
- `#member-input-max-books`: Number `<input>` for custom max borrowing limit
- `#btn-cancel-member`: Button to close modal
- `#btn-save-member`: Button (`type="submit"`) to save member

#### C. Issue Loan Modal (`#modal-issue-loan`)
- `#modal-issue-loan`: Dialog/Modal wrapper for issuing a loan
- `#form-issue-loan`: `<form>` element
- `#loan-select-member`: Searchable `<select>` or autocomplete input for selecting member
- `#loan-select-book`: Searchable `<select>` or autocomplete input for selecting book
- `#loan-input-issue-date`: Date `<input>` (defaults to today)
- `#loan-input-due-date`: Date `<input>` (auto-calculated based on loan period)
- `#loan-member-stats-preview`: Info box displaying member's current active loans vs limit
- `#loan-book-copies-preview`: Info box displaying available copies count
- `#btn-cancel-loan`: Button to close modal
- `#btn-confirm-issue-loan`: Button (`type="submit"`) to confirm issue

#### D. Return / Renew Book Modal (`#modal-return-loan`)
- `#modal-return-loan`: Dialog/Modal wrapper for return confirmation
- `#return-loan-id-hidden`: Hidden input holding Loan ID
- `#return-book-title-display`: Text display of book title
- `#return-member-name-display`: Text display of member name
- `#return-due-date-display`: Text display of expected due date
- `#return-overdue-days-display`: Text display of overdue day count
- `#return-fine-amount-display`: Text display of calculated fine ($)
- `#return-fine-waive-checkbox`: Checkbox to waive overdue fine
- `#btn-cancel-return`: Button to dismiss modal
- `#btn-confirm-return`: Button to confirm return and update inventory
- `#btn-confirm-renew`: Button to extend loan by standard loan period

#### E. Book Detail Modal (`#modal-book-detail`)
- `#modal-book-detail`: Dialog/Modal wrapper for in-depth book view
- `#detail-book-cover`: `<img>` for cover display
- `#detail-book-title`: Text for title
- `#detail-book-author`: Text for author
- `#detail-book-isbn`: Text for ISBN
- `#detail-book-genre`: Badge for genre
- `#detail-book-shelf`: Badge for shelf location
- `#detail-book-copies`: Text for "X of Y available"
- `#detail-book-desc`: Paragraph for description
- `#detail-book-current-borrowers`: Table/List of members currently holding this book
- `#btn-detail-borrow`: Button to initiate borrow directly from detail modal
- `#btn-detail-reserve`: Button to reserve if no copies available
- `#btn-detail-edit`: Button to switch to edit modal
- `#btn-detail-close`: Button to close detail modal

#### F. Confirm Delete Modal (`#modal-confirm-delete`)
- `#modal-confirm-delete`: Dialog/Modal wrapper for delete confirmations
- `#confirm-delete-title`: Heading (e.g., "Delete Book?")
- `#confirm-delete-message`: Body text explaining consequences
- `#btn-cancel-delete`: Cancel button
- `#btn-confirm-delete`: Red confirm delete button

---

## 3. Data Structures & State Models (`state.js`)

```javascript
/**
 * @typedef {'Fiction'|'Non-Fiction'|'Science'|'Technology'|'History'|'Biography'|'Philosophy'|'Arts'} BookGenre
 * @typedef {'student'|'faculty'|'general'} MemberType
 * @typedef {'active'|'suspended'|'expired'} MemberStatus
 * @typedef {'active'|'returned'|'overdue'} LoanStatus
 * @typedef {'pending'|'fulfilled'|'cancelled'} ReservationStatus
 *
 * @typedef {Object} Book
 * @property {string} id - Unique UUID/string (e.g. "b-101")
 * @property {string} title - Title of the book
 * @property {string} author - Author name
 * @property {string} isbn - ISBN-10 or ISBN-13
 * @property {BookGenre} genre - Category
 * @property {number} publicationYear - Year published (e.g. 2021)
 * @property {string} publisher - Publishing house
 * @property {number} totalCopies - Total quantity owned by library
 * @property {number} availableCopies - Copies currently on shelves
 * @property {string} shelfLocation - Physical location tag (e.g. "B-04")
 * @property {string} coverUrl - Image URL for book cover
 * @property {string} description - Synopsis/description
 * @property {number} rating - Average rating (1.0 to 5.0)
 * @property {string} createdAt - ISO date string
 *
 * @typedef {Object} Member
 * @property {string} id - Unique UUID/string (e.g. "m-201")
 * @property {string} name - Full legal name
 * @property {string} email - Email address
 * @property {string} phone - Contact phone number
 * @property {MemberType} type - Tier/Type
 * @property {MemberStatus} status - Active, suspended, or expired
 * @property {number} maxBooksLimit - Max simultaneous loans allowed (default: 3-5)
 * @property {number} currentBorrowedCount - Active borrowed books count
 * @property {number} outstandingFines - Accumulated unpaid fines in USD
 * @property {string} joinedDate - ISO date string
 *
 * @typedef {Object} Loan
 * @property {string} id - Unique UUID/string (e.g. "l-301")
 * @property {string} bookId - Reference to Book.id
 * @property {string} bookTitle - Denormalized for rapid display
 * @property {string} memberId - Reference to Member.id
 * @property {string} memberName - Denormalized for rapid display
 * @property {string} issueDate - ISO date string (YYYY-MM-DD)
 * @property {string} dueDate - ISO date string (YYYY-MM-DD)
 * @property {string|null} returnDate - ISO date string or null if still out
 * @property {LoanStatus} status - 'active' | 'returned' | 'overdue'
 * @property {number} renewalCount - Number of times renewed
 * @property {number} fineAmount - Calculated fine if returned late
 * @property {boolean} finePaid - Whether fine was paid or waived
 *
 * @typedef {Object} Reservation
 * @property {string} id - Unique UUID/string (e.g. "r-401")
 * @property {string} bookId - Reference to Book.id
 * @property {string} bookTitle - Denormalized title
 * @property {string} memberId - Reference to Member.id
 * @property {string} memberName - Denormalized member name
 * @property {string} reservedDate - ISO date string
 * @property {ReservationStatus} status - 'pending' | 'fulfilled' | 'cancelled'
 * @property {number} queuePosition - 1-based order in waitlist
 *
 * @typedef {Object} SystemSettings
 * @property {string} libraryName - Name of the library
 * @property {number} defaultLoanPeriodDays - Default loan duration (e.g. 14 days)
 * @property {number} dailyFineRate - Late fee per day in USD (e.g. 0.50)
 * @property {number} defaultMaxBooks - Standard max books allowed
 * @property {string} theme - 'light' | 'dark'
 *
 * @typedef {Object} ActivityLog
 * @property {string} id - Unique string
 * @property {'issue'|'return'|'renew'|'reserve'|'add_book'|'add_member'} type
 * @property {string} description - Human readable message
 * @property {string} timestamp - ISO timestamp
 *
 * @typedef {Object} AppState
 * @property {string} currentView - 'dashboard' | 'books' | 'members' | 'circulation' | 'reservations' | 'settings'
 * @property {Book[]} books - Catalog of all books
 * @property {Member[]} members - Registered library members
 * @property {Loan[]} loans - All circulation records
 * @property {Reservation[]} reservations - Reservation queue
 * @property {ActivityLog[]} activities - Recent system logs
 * @property {SystemSettings} settings - Library operational configuration
 * @property {Object} filters - View-specific search and filter states
 */
```

### Initial State & Factory Structure
```javascript
export const createInitialState = () => ({
  currentView: 'dashboard',
  books: [],
  members: [],
  loans: [],
  reservations: [],
  activities: [],
  settings: {
    libraryName: 'Alexandria Central Library',
    defaultLoanPeriodDays: 14,
    dailyFineRate: 0.50,
    defaultMaxBooks: 4,
    theme: 'light'
  },
  filters: {
    books: { search: '', genre: 'all', status: 'all', sort: 'title-asc', page: 1, limit: 8 },
    members: { search: '', status: 'all', type: 'all', page: 1, limit: 10 },
    circulation: { search: '', status: 'all', tab: 'active' },
    reservations: { search: '', status: 'all' }
  }
});
```

---

## 4. Initial Seed Dataset (`storage.js`)

To ensure a functioning demo immediately upon startup without manual entry, Zoro must seed `localStorage` with:
- **At least 12 realistic books** across multiple genres (Classic, Tech, Science, Fiction, History) with valid cover URLs (via Unsplash / Wikimedia or reliable SVG placeholders), ISBNs, ratings, and copy counts.
- **At least 6 diverse members** (Students, Faculty, General) with contact emails and membership statuses.
- **At least 5 active/past loans**, including at least **1 overdue loan** to visually verify the fine calculation engine.
- **At least 2 active reservations** to demonstrate queue mechanics.

---

## 5. Module Functions & Event Handler Signatures

### 5.1 `app.js` (Lifecycle & Navigation)
- `initApp(): void` - Initializes store from localStorage/seed data, binds global navigation, renders initial view.
- `switchView(viewName: 'dashboard'|'books'|'members'|'circulation'|'reservations'|'settings'): void` - Updates active tab, toggles DOM sections, and invokes corresponding view renderers.
- `setupGlobalListeners(): void` - Binds top-bar search, quick actions, theme toggle, and keyboard shortcuts (`ESC` to close modals).

### 5.2 `state.js` (Reactive State Store)
- `getState(): AppState` - Returns deep copy or read-only snapshot of state.
- `setState(updater: Partial<AppState> | ((prev: AppState) => Partial<AppState>)): void` - Mutates state, triggers persistence to `localStorage`, and fires registered subscribers.
- `subscribe(listener: (state: AppState) => void): () => void` - Subscribes a UI render function; returns unsubscribe callback.
- `addActivity(type: string, description: string): void` - Pushes a new item to `activities` array (capped at 50 items).

### 5.3 `books.js` (Catalog Management)
- `renderBooksView(): void` - Filters, sorts, paginates, and renders books into `#books-grid`.
- `handleBookSearch(query: string): void` - Updates book search filter and triggers re-render.
- `handleGenreFilter(genre: string): void` - Updates genre filter state.
- `handleSortChange(sortBy: string): void` - Updates sorting order state.
- `openAddBookModal(): void` - Resets `#form-book` and displays `#modal-book-form` with "Add New Book" heading.
- `openEditBookModal(bookId: string): void` - Populates form with existing book data and displays modal.
- `openBookDetailModal(bookId: string): void` - Fills `#modal-book-detail` with full book data and shows it.
- `handleSaveBook(formData: FormData): boolean` - Validates inputs, creates/updates book in state, updates available copies, returns success boolean.
- `handleDeleteBook(bookId: string): void` - Checks if book has active loans (prevents deletion if loaned out) or opens `#modal-confirm-delete`.

### 5.4 `members.js` (Member Directory)
- `renderMembersView(): void` - Filters and renders members into `#members-table-body`.
- `handleMemberSearch(query: string): void` - Updates member search filter.
- `openAddMemberModal(): void` - Prepares `#modal-member-form` for new member creation.
- `openEditMemberModal(memberId: string): void` - Fills `#modal-member-form` with member record for editing.
- `handleSaveMember(formData: FormData): boolean` - Validates unique email and fields, saves to state.
- `handleDeleteMember(memberId: string): void` - Ensures member has 0 active loans before deletion.
- `toggleMemberStatus(memberId: string): void` - Cycles status between active and suspended.

### 5.5 `circulation.js` (Loans, Returns & Fines)
- `renderCirculationView(): void` - Calculates current overdue statuses, fines, and renders `#loans-table-body`.
- `openIssueLoanModal(preselectedBookId?: string): void` - Opens `#modal-issue-loan` with calculated default due date and populated member/book options.
- `handleIssueLoan(bookId: string, memberId: string, issueDate: string, dueDate: string): { success: boolean, message: string }`
  - Validates member is active (not suspended/expired).
  - Validates member has not exceeded `maxBooksLimit`.
  - Validates book has `availableCopies > 0`.
  - Decrements `book.availableCopies` by 1.
  - Increments `member.currentBorrowedCount` by 1.
  - Inserts new `Loan` object with `status: 'active'`.
  - Logs activity and saves state.
- `openReturnModal(loanId: string): void` - Computes overdue days and fine amount based on `settings.dailyFineRate`, populates `#modal-return-loan`, and displays it.
- `handleConfirmReturn(loanId: string, waiveFine: boolean): void`
  - Sets `loan.returnDate = new Date().toISOString()`.
  - Sets `loan.status = 'returned'`.
  - Increments `book.availableCopies` by 1.
  - Decrements `member.currentBorrowedCount` by 1.
  - If fine not waived, updates `member.outstandingFines`.
  - Checks if book has pending reservations; if so, notifies/advances queue.
- `handleRenewLoan(loanId: string): { success: boolean, message: string }`
  - Validates loan is not already overdue.
  - Validates book has no pending reservations.
  - Extends `loan.dueDate` by `settings.defaultLoanPeriodDays`.
  - Increments `loan.renewalCount`.
- `calculateOverdueFine(loan: Loan, dailyRate: number): { daysOverdue: number, fine: number }` - Returns days past due date and fee in dollars.

### 5.6 `dashboard.js` (KPIs & Activity Analytics)
- `renderDashboard(): void` - Computes and updates all `#kpi-*` elements and activity lists.
- `computeMetrics(state: AppState): { totalBooks: number, availableCopies: number, activeLoans: number, overdueLoans: number, totalMembers: number, totalFines: number }` - Aggregates counts.
- `renderActivityFeed(activities: ActivityLog[]): void` - Populates `#recent-activity-list`.
- `renderCharts(state: AppState): void` - Draws simple CSS/Canvas bar/donut distributions for categories and borrowing activity.

### 5.7 `ui.js` & `toast.js` (UI Utilities)
- `showToast(message: string, type: 'success'|'error'|'info'|'warning'): void` - Creates an animated toast notification inside `#toast-container`.
- `openModal(modalId: string): void` - Displays modal with backdrop and traps focus.
- `closeModal(modalId: string): void` - Closes modal and resets state.
- `closeAllModals(): void` - Safety utility to dismiss any active modal.
- `formatDate(isoString: string): string` - Formats date for display (`MMM DD, YYYY`).
- `formatCurrency(amount: number): string` - Formats number into USD (`$X.XX`).

---

## 6. Business Logic & Validation Rules

1. **Borrowing Limitations**:
   - A member whose status is `suspended` or `expired` **cannot** borrow books.
   - A member who currently has `currentBorrowedCount >= maxBooksLimit` **cannot** borrow additional books until returns are made.
   - A book with `availableCopies === 0` **cannot** be issued (can only be reserved).

2. **Fine Computation**:
   - `daysOverdue = Math.max(0, Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24)))`.
   - `fine = daysOverdue * settings.dailyFineRate`.
   - Fines are displayed with two decimal places.

3. **Inventory Consistency**:
   - `availableCopies` must never drop below `0` or exceed `totalCopies`.
   - When a book is deleted, verify `availableCopies === totalCopies` (no copies currently on loan). If not, refuse deletion with an error toast.

4. **Reservations Queue**:
   - When an unavailable book is returned, if there are `pending` reservations for that book, the earliest reservation (`queuePosition: 1`) is flagged ready for pickup, and an activity notification is dispatched.

---

## 7. Quality & Zero-Placeholder Directives for Zoro (Builder)

1. **Exact ID Match**: Every ID defined in Section 2 must exist in `index.html`. Do not rename, capitalize differently, or use classes where IDs are specified.
2. **Persistence**: Every mutation (`saveBook`, `deleteBook`, `issueLoan`, `returnLoan`, `saveMember`) must persist to `localStorage` immediately so refreshing the page maintains 100% data integrity.
3. **Seed Data Guarantee**: If `localStorage` is empty on first load, seed with rich realistic data immediately.
4. **No Empty Placeholders or Stubs**: Write complete, working implementations for all event handlers and DOM renderers.
5. **Responsive and Accessible**: Support mobile, tablet, and desktop viewports, with clean modal dialog handling and intuitive visual feedback.
