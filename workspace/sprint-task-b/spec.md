# System Architecture & Technical Contract: OneDignostic
**Author:** Robin (Group 2 - Architect)  
**Target Implementer:** Shanks (Group 2 - Builder)  
**Project:** OneDignostic - Modern Diagnostic Center Web Application  
**Version:** 1.0.0  
**Status:** Approved & Ready for Build  

---

## 1. Executive Summary & Architecture Overview

`OneDignostic` is a client-side single-page application (SPA) with multi-view capability, designed for a modern pathology, radiology, and wellness diagnostic center. The architecture is engineered around standard, dependency-free vanilla HTML5, modern CSS3 (enhanced with Tailwind CSS CDN and custom medical UI components), and pure ES6+ JavaScript.

### Core Architectural Pillars
- **Zero-Dependency Runtime:** Fast loading, responsive on mobile and desktop, zero build-step overhead.
- **Strict DOM Contract:** Every UI component interacts through immutable, strictly declared element IDs.
- **Centralized Reactive State:** Single source of truth (`AppState`) managed by deterministic dispatcher functions.
- **Persistent Storage:** `localStorage` synchronization for Cart items, Patient Bookings, and uploaded mock prescriptions.
- **Interactive Patient Journey:**
  1. Diagnostic test & health package discovery with instant category filtering and real-time search.
  2. Test detail viewing with parameters covered, pre-test preparation (fasting rules), and turnaround time (TAT).
  3. Interactive Cart & Slot Booking with Home Sample Collection vs. Center Visit toggling.
  4. Prescription Upload modal with instant file preview and OCR/mock confirmation.
  5. Patient Report Tracker simulating patient report lookup by Patient ID / Phone.
  6. Health Risk / Package Recommendation Assistant (Interactive Quick Quiz).
  7. Center Branch Locator and FAQ Accordion.

---

## 2. Directory & File Structure

```text
/
├── index.html            # Complete semantic HTML structure, all IDs, modals, templates
├── css/
│   └── styles.css        # Custom medical styling, animations, print stylesheets for reports
├── js/
│   ├── data.js           # Tests catalog, packages, centers, doctors, FAQs mock data
│   ├── state.js          # Reactive AppState, storage sync, getter/setter contracts
│   └── app.js            # Controller, event bindings, rendering pipelines, modal managers
└── spec.md               # This architectural contract specification
```

---

## 3. Data Structures & Mock Data Contracts (`js/data.js`)

### 3.1 Test Item Schema (`DiagnosticTest`)
```javascript
/**
 * @typedef {Object} DiagnosticTest
 * @property {string} id - Unique identifier (e.g., 't-cbc-01')
 * @property {string} name - Official medical test name
 * @property {string} category - Category slug ('blood' | 'radiology' | 'cardiac' | 'diabetes' | 'women' | 'senior')
 * @property {string} description - Brief clinical description
 * @property {number} price - Selling price in USD / local currency
 * @property {number} originalPrice - MRP before discount
 * @property {string} sampleType - Sample requirement ('Blood', 'Urine', 'Swab', 'Imaging', 'Saliva')
 * @property {string} fastingReq - Fasting guidelines (e.g., '10-12 hours fasting required', 'No fasting needed')
 * @property {string} tat - Turnaround time (e.g., 'Same Day (6 hrs)', '24 Hours', '48 Hours')
 * @property {number} parametersCount - Number of test parameters analyzed
 * @property {string[]} parametersList - Array of parameter names
 * @property {boolean} isPopular - Highlights test with a badge
 * @property {boolean} homeCollectionAvailable - True if sample can be drawn at home
 */
```

### 3.2 Health Checkup Package Schema (`HealthPackage`)
```javascript
/**
 * @typedef {Object} HealthPackage
 * @property {string} id - Unique identifier (e.g., 'pkg-full-gold')
 * @property {string} title - Package name (e.g., 'Comprehensive Full Body Checkup - Gold')
 * @property {string} targetAudience - Recommended age/gender (e.g., 'Adults 30+ yrs, All genders')
 * @property {number} price - Package price
 * @property {number} originalPrice - Strikethrough price
 * @property {number} totalTestsIncluded - Total tests bundled
 * @property {string[]} includedCategories - E.g. ['CBC', 'Lipid Profile', 'Liver Function (LFT)', 'Thyroid (TSH)', 'Renal Function (KFT)', 'Vitamin D & B12']
 * @property {string} fastingReq - Fasting instruction
 * @property {string} reportTat - Report readiness TAT
 * @property {string} badge - E.g. 'BESTSELLER' | 'RECOMMENDED'
 */
```

### 3.3 Diagnostic Center Branch Schema (`CenterBranch`)
```javascript
/**
 * @typedef {Object} CenterBranch
 * @property {string} id - Branch identifier (e.g., 'branch-central')
 * @property {string} name - Branch Display Name
 * @property {string} address - Full physical street address
 * @property {string} city - City name
 * @property {string} phone - Direct helpline phone number
 * @property {string} timing - Operating hours (e.g., 'Mon - Sat: 06:30 AM - 09:00 PM, Sun: 07:00 AM - 02:00 PM')
 * @property {string[]} facilities - E.g. ['Pathology', '3.0T MRI', '128-Slice CT', 'Ultrasound', 'Digital X-Ray', 'ECHO']
 * @property {string} mapUrl - Google Maps query link
 */
```

### 3.4 Patient Report Record Schema (`PatientReport`)
```javascript
/**
 * @typedef {Object} PatientReport
 * @property {string} reportId - Identifier (e.g., 'REP-88219')
 * @property {string} patientName - Full Patient Name
 * @property {string} phone - Registered 10-digit phone
 * @property {string} testName - Test or Package undergone
 * @property {string} collectionDate - Date of collection (YYYY-MM-DD)
 * @property {string} status - 'Ready' | 'Processing' | 'Sample Collected'
 * @property {string} doctorName - Approving Pathologist
 * @property {string} downloadUrl - Mock PDF filename or simulated download action
 * @property {Array<{parameter: string, value: string, referenceRange: string, status: 'Normal'|'High'|'Low'}>} results
 */
```

### 3.5 Verified Mock Datasets to include in `data.js`
1. **At least 12 Diagnostic Tests:**
   - CBC (Complete Blood Count)
   - Lipid Profile Comprehensive
   - HbA1c (Glycated Hemoglobin)
   - Thyroid Profile (T3, T4, TSH)
   - Liver Function Test (LFT)
   - Kidney Function Test (KFT)
   - Vitamin D 25-Hydroxy
   - Vitamin B12
   - High-Resolution Chest CT Scan (HRCT)
   - Digital Chest X-Ray PA View
   - Abdomen & Pelvis Ultrasound (USG)
   - Electrocardiogram (ECG / EKG)
2. **At least 4 Health Packages:**
   - OneDignostic Basic Health Shield (45 parameters)
   - OneDignostic Active Health Executive (72 parameters)
   - OneDignostic Comprehensive Full Body Gold (95 parameters)
   - Senior Citizen Vital Care (102 parameters)
3. **At least 3 Diagnostic Center Branches:**
   - OneDignostic Flagship Super-Center (Metro Center)
   - OneDignostic West Valley Imaging & Pathology
   - OneDignostic Northside Express Sample Lab
4. **At least 3 Pre-populated Patient Reports for Demo Testing:**
   - Phone: `9876543210` / Report ID: `REP-1001` (Status: `Ready`)
   - Phone: `9876543210` / Report ID: `REP-1002` (Status: `Ready`)
   - Phone: `5551234567` / Report ID: `REP-2045` (Status: `Processing`)

---

## 4. Application State Model (`js/state.js`)

The global application state must adhere to this exact structure:

```javascript
window.AppState = {
  // Search & Filter State
  activeCategory: 'all',        // 'all' | 'blood' | 'radiology' | 'cardiac' | 'diabetes' | 'women' | 'senior'
  searchQuery: '',              // Filter test names and packages
  selectedTab: 'tests',         // 'tests' | 'packages'
  
  // Cart State (stored in localStorage under 'one_dignostic_cart')
  cart: [
    // Array of { item: DiagnosticTest | HealthPackage, type: 'test' | 'package', quantity: 1 }
  ],
  
  // Booking Form State
  booking: {
    serviceType: 'home_collection', // 'home_collection' | 'center_visit'
    patientName: '',
    patientAge: '',
    patientGender: 'male',          // 'male' | 'female' | 'other'
    patientPhone: '',
    patientEmail: '',
    address: '',
    city: '',
    pincode: '',
    selectedBranchId: 'branch-central',
    bookingDate: '',
    bookingSlot: '',                // '07:00 AM - 09:00 AM' etc.
    prescriptionUploaded: false,
    prescriptionFileName: ''
  },
  
  // Pricing & Calculations
  pricing: {
    subtotal: 0,
    homeCollectionFee: 15,          // $15 fee, free if subtotal >= $60
    freeCollectionThreshold: 60,
    discountAmount: 0,
    grandTotal: 0
  },
  
  // UI Modal Controls
  modals: {
    isCartOpen: false,
    isPrescriptionModalOpen: false,
    isReportTrackerOpen: false,
    isBookingSuccessOpen: false,
    isTestDetailModalOpen: false,
    isRiskAdvisorOpen: false
  },
  
  // Selected single test for detailed modal inspection
  activeTestDetail: null,
  
  // Recent Booking Reference (after checkout)
  lastConfirmedBooking: null
};
```

---

## 5. Exact DOM Element IDs & Attributes Contract

Every element ID in this section MUST appear in `index.html` with exact spelling and casing. Builder (Shanks) must bind event handlers and manipulate innerHTML strictly against these IDs.

### 5.1 Global Navigation & Header IDs
| Element ID | HTML Tag | Role / Event Trigger |
|---|---|---|
| `#header-navbar` | `<header>` | Sticky navigation bar |
| `#brand-logo` | `<a>` | Clicking navigates to hero / top of page |
| `#nav-link-tests` | `<a>` | Smooth scroll / switch to `#tests-packages-section` |
| `#nav-link-packages` | `<a>` | Smooth scroll to Packages tab |
| `#nav-link-prescription`| `<button>` | Opens `#upload-prescription-modal` |
| `#nav-link-reports` | `<button>` | Opens `#report-tracker-modal` |
| `#nav-link-centers` | `<a>` | Smooth scroll to `#centers-section` |
| `#nav-link-advisor` | `<button>` | Opens `#health-advisor-modal` |
| `#cart-btn-desktop` | `<button>` | Opens sliding Cart drawer |
| `#cart-badge-desktop` | `<span>` | Displays total cart item count |
| `#cart-btn-mobile` | `<button>` | Mobile drawer trigger |
| `#cart-badge-mobile` | `<span>` | Mobile cart item count badge |
| `#mobile-menu-toggle-btn`| `<button>` | Toggles `#mobile-nav-menu` |
| `#mobile-nav-menu` | `<div>` | Mobile collapsible menu drawer |

### 5.2 Hero Section & Quick Actions IDs
| Element ID | HTML Tag | Role / Event Trigger |
|---|---|---|
| `#hero-section` | `<section>` | High-impact hero container |
| `#hero-search-input` | `<input>` | Direct search input on hero (syncs with `#test-search-input`) |
| `#hero-search-btn` | `<button>` | Scrolls and filters catalog |
| `#hero-btn-book-home` | `<button>` | Opens Cart or selects Home Collection & scrolls to tests |
| `#hero-btn-upload-rx` | `<button>` | Opens `#upload-prescription-modal` |
| `#hero-btn-check-reports`| `<button>` | Opens `#report-tracker-modal` |
| `#hero-stat-accredited` | `<div>` | NABL / CAP / ISO quality accreditation badge |

### 5.3 Test & Package Discovery Section IDs
| Element ID | HTML Tag | Role / Event Trigger |
|---|---|---|
| `#tests-packages-section`| `<section>` | Catalog main wrapper |
| `#view-tab-tests` | `<button>` | Switches view to single diagnostic tests |
| `#view-tab-packages` | `<button>` | Switches view to full health packages |
| `#test-search-input` | `<input>` | Real-time search query input |
| `#clear-search-btn` | `<button>` | Clears search input |
| `#category-filters-container` | `<div>` | Category pills container (`All`, `Blood`, `Radiology`, etc.) |
| `#tests-grid` | `<div>` | Grid container where diagnostic test cards are rendered |
| `#packages-grid` | `<div>` | Grid container where health checkup packages are rendered |
| `#catalog-empty-state`| `<div>` | Shown when no tests match filter/search |

### 5.4 Test Detail Modal IDs
| Element ID | HTML Tag | Role / Event Trigger |
|---|---|---|
| `#test-detail-modal` | `<div>` | Backdrop & modal container |
| `#test-detail-modal-close` | `<button>` | Close modal button |
| `#test-detail-title` | `<h3>` | Test name |
| `#test-detail-badge` | `<span>` | Fasting / category badge |
| `#test-detail-description` | `<p>` | Clinical overview |
| `#test-detail-sample` | `<span>` | Sample type required |
| `#test-detail-fasting` | `<span>` | Fasting guidelines text |
| `#test-detail-tat` | `<span>` | Turnaround time text |
| `#test-detail-parameters-list`| `<ul>` | List of all covered parameters |
| `#test-detail-price` | `<span>` | Formatted price |
| `#test-detail-mrp` | `<span>` | Strikethrough MRP |
| `#test-detail-add-btn` | `<button>` | Add to Cart button inside modal |

### 5.5 Cart & Booking Drawer IDs (`#cart-drawer`)
| Element ID | HTML Tag | Role / Event Trigger |
|---|---|---|
| `#cart-drawer-overlay` | `<div>` | Dark backdrop overlay |
| `#cart-drawer` | `<aside>` | Sliding checkout drawer panel |
| `#cart-drawer-close-btn`| `<button>` | Closes drawer |
| `#cart-items-container`| `<div>` | Dynamic container for items in cart |
| `#cart-empty-message` | `<div>` | Empty cart placeholder |
| `#cart-summary-section`| `<div>` | Shows price breakdown when items exist |
| `#cart-subtotal-price` | `<span>` | Subtotal amount |
| `#cart-collection-fee` | `<span>` | Home collection fee ($15 or FREE) |
| `#cart-discount-value` | `<span>` | Applied package discount |
| `#cart-grand-total` | `<span>` | Total payable amount |
| `#collection-type-home`| `<input type="radio">`| Radio: Home Sample Collection |
| `#collection-type-center`| `<input type="radio">`| Radio: Diagnostic Center Visit |
| `#center-select-wrapper`| `<div>` | Shown only if Center Visit is selected |
| `#booking-center-select`| `<select>` | Dropdown to choose center branch |
| `#booking-patient-name`| `<input>` | Patient full name input |
| `#booking-patient-age` | `<input>` | Patient age input |
| `#booking-patient-gender`| `<select>` | Patient gender dropdown |
| `#booking-patient-phone`| `<input>` | 10-digit mobile phone number |
| `#booking-patient-email`| `<input>` | Email address input |
| `#booking-address` | `<textarea>` | Street address for home visit |
| `#booking-pincode` | `<input>` | Postal / PIN code |
| `#booking-date-picker` | `<input type="date">` | Selected appointment date |
| `#booking-slot-select` | `<select>` | Selected time slot |
| `#booking-submit-btn` | `<button>` | "Confirm Booking" primary CTA |
| `#booking-error-msg` | `<div>` | Form validation feedback message |

### 5.6 Upload Prescription Modal IDs (`#upload-prescription-modal`)
| Element ID | HTML Tag | Role / Event Trigger |
|---|---|---|
| `#upload-prescription-modal` | `<div>` | Modal backdrop wrapper |
| `#prescription-modal-close` | `<button>` | Closes prescription modal |
| `#prescription-dropzone` | `<div>` | Drag-and-drop file target area |
| `#prescription-file-input`| `<input type="file">`| Hidden file input for images/PDFs |
| `#prescription-preview-area`| `<div>` | Shows uploaded filename or thumbnail |
| `#prescription-preview-name`| `<span>` | Display uploaded file name |
| `#prescription-remove-file`| `<button>` | Clear selected file |
| `#rx-patient-name` | `<input>` | Patient name for prescription order |
| `#rx-patient-phone` | `<input>` | Mobile number for callback |
| `#rx-patient-notes` | `<textarea>` | Additional instructions/symptoms |
| `#rx-submit-btn` | `<button>` | Submit Prescription CTA |
| `#rx-success-state` | `<div>` | Confirmation message after upload |

### 5.7 Download / Track Report Modal IDs (`#report-tracker-modal`)
| Element ID | HTML Tag | Role / Event Trigger |
|---|---|---|
| `#report-tracker-modal` | `<div>` | Track report modal backdrop |
| `#report-modal-close` | `<button>` | Closes modal |
| `#report-search-phone` | `<input>` | Search by 10-digit registered phone |
| `#report-search-id` | `<input>` | Optional search by Report ID / Booking ID |
| `#report-search-btn` | `<button>` | Triggers report query lookup |
| `#report-search-error` | `<div>` | Shows "No report found" alert |
| `#report-results-list` | `<div>` | Container for matched patient reports |
| `#report-detail-view` | `<div>` | View single report parameter breakdown |
| `#report-download-pdf-btn`| `<button>`| Generates/Triggers simulated PDF print |

### 5.8 Health Risk Advisor / Package Finder Modal IDs (`#health-advisor-modal`)
| Element ID | HTML Tag | Role / Event Trigger |
|---|---|---|
| `#health-advisor-modal` | `<div>` | Modal wrapper |
| `#advisor-modal-close` | `<button>` | Close button |
| `#advisor-step-1` | `<div>` | Step 1: Age & Gender selection |
| `#advisor-age-select` | `<select>` | Age range dropdown |
| `#advisor-gender-select`| `<select>` | Gender dropdown |
| `#advisor-step-2` | `<div>` | Step 2: Lifestyle & Symptoms checkboxes |
| `#advisor-chk-fatigue` | `<input type="checkbox">` | Constant fatigue |
| `#advisor-chk-diabetes` | `<input type="checkbox">` | Family history of diabetes/blood sugar |
| `#advisor-chk-cardiac` | `<input type="checkbox">` | Chest discomfort / BP history |
| `#advisor-chk-smoking` | `<input type="checkbox">` | Smoking or high stress |
| `#advisor-chk-joints` | `<input type="checkbox">` | Joint pains / Vitamin D deficiency |
| `#advisor-submit-btn` | `<button>` | "Find Recommended Tests" CTA |
| `#advisor-results-area` | `<div>` | Displays personalized test recommendations |
| `#advisor-add-all-btn` | `<button>` | Add recommended package directly to Cart |

### 5.9 Booking Confirmation Modal IDs (`#booking-success-modal`)
| Element ID | HTML Tag | Role / Event Trigger |
|---|---|---|
| `#booking-success-modal`| `<div>` | Success popup backdrop |
| `#booking-success-close`| `<button>` | Close modal |
| `#confirmed-booking-id`| `<span>` | Displays generated Booking Ref (e.g. `OD-90218`) |
| `#confirmed-patient-name`| `<span>` | Patient Name |
| `#confirmed-service-type`| `<span>` | "Home Collection" or "Center Visit" |
| `#confirmed-date-slot` | `<span>` | Scheduled Date & Slot |
| `#confirmed-total-paid` | `<span>` | Total amount to pay on visit/online |
| `#print-booking-slip-btn`| `<button>`| Triggers window.print() on confirmation slip |

### 5.10 Diagnostic Center Branches & Map IDs
| Element ID | HTML Tag | Role / Event Trigger |
|---|---|---|
| `#centers-section` | `<section>` | Branch locator section |
| `#center-filter-city` | `<select>` | City dropdown filter |
| `#branches-grid` | `<div>` | Branch cards container |

### 5.11 FAQ & Testimonials IDs
| Element ID | HTML Tag | Role / Event Trigger |
|---|---|---|
| `#faq-accordion` | `<div>` | Accordion container |
| `#testimonials-carousel`| `<div>` | Verified patient reviews slider/grid |

### 5.12 Notification Toast IDs
| Element ID | HTML Tag | Role / Event Trigger |
|---|---|---|
| `#toast-notification` | `<div>` | Floating toast container (top-right) |
| `#toast-message` | `<span>` | Notification message text |
| `#toast-icon` | `<span>` | Notification status icon |

---

## 6. Event Handler Signatures & Logic Contracts (`js/app.js`)

The Builder (Shanks) must implement the following controller functions with the specified signatures and behaviors:

### 6.1 State & Initialization
```javascript
/**
 * Initializes the entire application on DOMContentLoaded.
 * - Loads persisted cart from localStorage.
 * - Sets minimum date on `#booking-date-picker` to today.
 * - Renders initial categories, tests grid, packages, and branches.
 * - Attaches all event listeners.
 */
function initApp(): void;
```

### 6.2 Catalog & Filtering Pipeline
```javascript
/**
 * Renders test cards inside `#tests-grid` based on activeCategory and searchQuery.
 * Cards must include:
 * - Test title, category badge, sample type, fasting badge.
 * - Number of parameters with "View Parameters" trigger (calls openTestDetailModal).
 * - Price & MRP with discount percentage tag.
 * - "Add to Cart" button with data-test-id attribute.
 */
function renderTests(): void;

/**
 * Renders package cards inside `#packages-grid`.
 * Cards must include:
 * - Package title, target audience, total tests badge.
 * - Key included categories tags.
 * - Price, MRP, and "Book Package" button with data-pkg-id attribute.
 */
function renderPackages(): void;

/**
 * Handles category filter button clicks.
 * @param {string} categorySlug - Slug e.g., 'all', 'blood', 'radiology'
 */
function handleCategoryChange(categorySlug: string): void;

/**
 * Handles search query input across tests & packages.
 * Debounced or real-time filter updating renderTests() and renderPackages().
 * @param {string} query
 */
function handleSearch(query: string): void;
```

### 6.3 Cart Management Pipeline
```javascript
/**
 * Adds a test or package to the cart.
 * If already in cart, show toast notice ("Item is already in your booking list").
 * Updates AppState.cart, synchronizes with localStorage, updates badges, re-renders cart drawer.
 * @param {string} itemId - ID of test or package
 * @param {'test'|'package'} itemType
 */
function addToCart(itemId: string, itemType: string): void;

/**
 * Removes an item from the cart.
 * @param {string} itemId
 */
function removeFromCart(itemId: string): void;

/**
 * Recalculates Subtotal, Home Collection Fee, Discounts, and Grand Total.
 * Rule: Home collection fee ($15) is waived ($0 / FREE) if subtotal >= AppState.pricing.freeCollectionThreshold ($60).
 * Rule: If AppState.booking.serviceType === 'center_visit', collection fee is always $0.
 */
function recalculateCartTotals(): void;

/**
 * Updates DOM for `#cart-items-container`, `#cart-subtotal-price`, `#cart-collection-fee`,
 * `#cart-grand-total`, and desktop/mobile cart badge counts.
 */
function updateCartUI(): void;

/**
 * Opens and closes sliding cart drawer `#cart-drawer` and `#cart-drawer-overlay`.
 */
function openCartDrawer(): void;
function closeCartDrawer(): void;
```

### 6.4 Test Detail Modal Pipeline
```javascript
/**
 * Populates and opens `#test-detail-modal` with complete clinical information:
 * parameters list, sample type, fasting guidelines, TAT, and direct "Add to Cart" button.
 * @param {string} testId
 */
function openTestDetailModal(testId: string): void;
function closeTestDetailModal(): void;
```

### 6.5 Booking & Checkout Pipeline
```javascript
/**
 * Validates booking form inputs inside Cart Drawer:
 * - Patient Name (min 3 chars)
 * - Patient Age (1 - 120)
 * - Patient Phone (10 digits minimum)
 * - If Home Collection: Address & Pincode required
 * - Booking Date & Time Slot selected
 * @returns {boolean} isValid
 */
function validateBookingForm(): boolean;

/**
 * Processes checkout:
 * - Generates unique Booking ID: `OD-${Math.floor(100000 + Math.random() * 900000)}`
 * - Saves booking record to localStorage (`one_dignostic_orders`)
 * - Clears cart
 * - Opens `#booking-success-modal` with populated booking summary
 * - Closes cart drawer
 */
function submitBooking(): void;
```

### 6.6 Prescription Upload Pipeline
```javascript
/**
 * Opens `#upload-prescription-modal`.
 */
function openPrescriptionModal(): void;
function closePrescriptionModal(): void;

/**
 * Handles prescription file selection/drop.
 * Validates file type (.jpg, .jpeg, .png, .pdf) and size (< 10MB).
 * Updates preview area `#prescription-preview-area`.
 * @param {File} file
 */
function handlePrescriptionFile(file: File): void;

/**
 * Submits uploaded prescription with patient contact details.
 * Shows simulated confirmation and schedule callback notification.
 */
function submitPrescriptionForm(): void;
```

### 6.7 Report Tracking Pipeline
```javascript
/**
 * Opens `#report-tracker-modal`.
 */
function openReportTrackerModal(): void;
function closeReportTrackerModal(): void;

/**
 * Queries mock data for reports matching registered Phone or Report ID.
 * Renders results inside `#report-results-list`.
 * If not found, shows `#report-search-error`.
 */
function searchPatientReports(): void;

/**
 * Simulates opening/printing a formal diagnostic laboratory report.
 * @param {string} reportId
 */
function downloadMockReportPDF(reportId: string): void;
```

### 6.8 Health Risk Advisor / Quiz Pipeline
```javascript
/**
 * Opens `#health-advisor-modal`.
 */
function openHealthAdvisorModal(): void;
function closeHealthAdvisorModal(): void;

/**
 * Computes recommended package/tests based on selected age, gender, and risk factors.
 * Renders result cards inside `#advisor-results-area`.
 */
function evaluateHealthRiskAssessment(): void;
```

### 6.9 Toast Feedback Notification
```javascript
/**
 * Shows temporary toast notification for user feedback.
 * @param {string} message - Feedback message
 * @param {'success'|'info'|'warning'} type - Visual styling type
 */
function showToast(message: string, type?: string): void;
```

---

## 7. UI/UX, Styling & Design Guidelines

### 7.1 Visual Identity & Color Palette
- **Primary Brand Color (Clinical Navy/Teal):** `#0A3981` (Deep Trust Blue) and `#00A896` (Vital Diagnostic Teal / Medical Green).
- **Secondary / Accent:** `#0284C7` (Sky Blue) & `#E0F2FE` (Soft Medical Wash).
- **Surface / Backgrounds:** `#F8FAFC` (Slate 50) and `#FFFFFF` (Pure Hospital White).
- **Text:** Primary `#0F172A` (Slate 900), Secondary `#475569` (Slate 600), Muted `#94A3B8` (Slate 400).
- **Alert / Badges:** Success `#10B981` (Emerald), Warning `#F59E0B` (Amber), Urgent `#EF4444` (Crimson).

### 7.2 Component Aesthetic Requirements
- **Cards:** Rounded `rounded-2xl`, subtle shadow `shadow-sm hover:shadow-md transition-all duration-200`, border `border border-slate-100`.
- **Badges:** Pill-shaped `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold`.
- **Primary Buttons:** High contrast, rounded `rounded-xl`, clear hover state `hover:bg-opacity-95 active:scale-95 transition-all`.
- **Drawer:** Slide-in from right on desktop and mobile (`transform translate-x-full transition-transform ease-in-out duration-300`).
- **Typography:** Sans-serif clean medical system font stack: `'Inter', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif`.

---

## 8. Business Logic & Calculations Formulae

1. **Subtotal Calculation:**  
   $$\text{Subtotal} = \sum (\text{item.price})$$
2. **MRP Total & Discount Amount:**  
   $$\text{Total MRP} = \sum (\text{item.originalPrice})$$  
   $$\text{Discount Amount} = \text{Total MRP} - \text{Subtotal}$$
3. **Home Sample Collection Fee:**  
   - If `AppState.booking.serviceType === 'center_visit'`: `Fee = $0`
   - If `AppState.booking.serviceType === 'home_collection'`:
     - If `Subtotal >= 60`: `Fee = $0` (Display: **FREE**)
     - If `Subtotal < 60`: `Fee = $15.00`
4. **Grand Total:**  
   $$\text{Grand Total} = \text{Subtotal} + \text{Home Collection Fee}$$

---

## 9. Test Verification Data Matrix for Builder (Shanks)

Shanks must ensure these test cases work seamlessly during manual and functional verification:

| Scenario | Input / Action | Expected Result |
|---|---|---|
| **Add Single Test** | Click "Add to Cart" on "Complete Blood Count (CBC)" | Cart count becomes `1`, toast "Complete Blood Count added to your booking list", item appears in cart drawer. |
| **Add Package** | Click "Book Package" on "Senior Citizen Vital Care" | Cart count increments, subtotal updates with discounted package rate. |
| **Free Collection Threshold** | Add items with Subtotal < $60 vs >= $60 | Under $60 shows "$15 Home Collection Fee". At or above $60 shows "FREE" with green badge. |
| **Toggle Center Visit** | Select "Center Visit" radio button in Cart Drawer | Collection fee becomes $0, `#center-select-wrapper` displays branch dropdown. |
| **Report Lookup (Found)** | In Report Tracker modal, enter Phone: `9876543210` | Displays 2 completed reports (`REP-1001`, `REP-1002`) with test names, doctor signature, and "Download Report" button. |
| **Report Lookup (Not Found)**| In Report Tracker modal, enter Phone: `0000000000` | Displays clean error: "No diagnostic reports found for this number. Please check the number or contact 24/7 helpdesk." |
| **Prescription Upload** | Select/Drop dummy image or PDF in `#prescription-dropzone` | Shows file name, allows removal, submits contact form and displays confirmation ticket. |
| **Health Advisor** | Select "Age: 45-60", "Gender: Female", Check "Fatigue", "Joint pains" | Recommends "Vitamin D & B12 Combo" and "Comprehensive Full Body Gold" with direct "Add All to Cart" option. |
| **Booking Submission** | Fill name, phone, age, slot, click "Confirm Booking" | Generates Order ID `OD-XXXXXX`, clears cart, opens success modal with printable summary. |

---

## 10. Architectural Hand-Off Declaration

This specification is complete, airtight, and contains **zero placeholders or TODOs**. All DOM IDs, event handler signatures, data schemas, and mathematical calculations are strictly delineated. 

Builder **Shanks (Group 2 - Builder)** is cleared to proceed with immediate code construction of `index.html`, `css/styles.css`, `js/data.js`, `js/state.js`, and `js/app.js`.
