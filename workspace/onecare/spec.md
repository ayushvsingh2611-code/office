# System & Data Architecture Specification: AuraCare Diagnostics & Pathology Portal
**Architect:** Nami (Group 1 - Architect)  
**Target Builder:** Zoro (Group 1 - Builder)  
**Product Replica Reference:** Quest Diagnostics / Labcorp / Apollo Diagnostics Hybrid Platform  
**File Target:** `index.html`, `styles.css`, `app.js`

---

## 1. Product Vision & Brand Identity

AuraCare Diagnostics is a high-fidelity, production-grade, patient-centric diagnostic laboratory portal. It replicates hallmark features from world-class diagnostic leaders (Quest Diagnostics & Labcorp):
- **Primary Color Palette:**
  - Medical Navy Blue (Primary Brand): `#0B2545`
  - Clinical Deep Teal (Accent & Trust): `#007A78` / `#009E96`
  - Active Sky Blue (Interactive & Badges): `#0066CC`
  - Clean Background: `#F4F7FB`
  - Card & Modal Surface: `#FFFFFF`
  - Border/Divider: `#E2E8F0`
  - Status Success: `#10B981` (Normal Range)
  - Status Warning: `#F59E0B` (Borderline Range)
  - Status Critical/High: `#EF4444` (Out of Range / Urgent)
  - Text Primary: `#1E293B`, Text Muted: `#64748B`
- **Typography:** Inter / System UI (`'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`)
- **Key Real-World Modules:**
  1. Top Utility Bar: Emergency helpline, 24/7 Home Sample Collection indicator, Lab Locator quick link, Language/Accessibility.
  2. Sticky Primary Navigation: Logo, Tests Directory, Health Packages, Book Home Collection, Find a Lab, Upload Prescription, Download Reports, Cart with badge, Patient Portal Avatar/Profile.
  3. Interactive Hero Section: Multi-modal quick action bar (Search 1,200+ tests, Book Home Visit, Download Reports, Upload Rx).
  4. Real-time Test Search & Category Filter System (Pathology, Radiology, Cardiac, Diabetes, Women's Health, Oncology, Full Body Packages).
  5. Test Detail & Booking Drawer / Modal: Fasting requirements, sample type, turnaround time (TAT), price, add to cart or instant book.
  6. Curated Preventive Health Checkup Packages with comparison breakdown.
  7. Home Sample Collection Multi-Step Booking Modal (Date, Time Slot, Patient Address, Phlebotomist preference).
  8. Interactive Patient Report Vault & Visual Lab Result Viewer (Simulates real Quest Diagnostics report viewer with reference range gauges, abnormal flags, and printable PDF format).
  9. Digital Prescription Upload Simulator (Drag-and-drop, automated test detector simulation, instant cart population).
  10. Diagnostic Center Locator (Interactive list & simulated map view, filter by Drive-thru, Radiology, 24/7 hours, with "Book Here" action).
  11. Cart & Seamless Checkout Modal (Home collection vs Center visit, patient details, promo codes, payment simulation).
  12. Live Appointment & Sample Tracker Drawer (Order placed -> Phlebotomist assigned -> Sample collected -> In lab processing -> Report ready).

---

## 2. Complete DOM Element ID Registry (Strict Contract)

To prevent any ID mismatches between HTML and JS, every interactive element must use the exact IDs listed below.

### 2.1 Navigation & Global Controls
- `#top-bar`: Global banner with contact `1800-AURA-LABS` and Home Collection alert.
- `#nav-brand-logo`: Clickable brand logo, resets view to home.
- `#nav-search-input`: Header quick search for tests and packages.
- `#nav-search-btn`: Search trigger button.
- `#nav-link-tests`: Link to scroll/switch to Tests Directory.
- `#nav-link-packages`: Link to Preventive Packages section.
- `#nav-link-centers`: Link to Diagnostic Center Locator.
- `#nav-link-upload-rx`: Button opening Prescription Upload Modal.
- `#nav-link-reports`: Button opening Patient Reports Vault Modal.
- `#nav-link-tracker`: Button opening Live Sample Tracker Modal.
- `#nav-cart-btn`: Header cart button showing count badge `#cart-badge`.
- `#cart-badge`: Numeric pill showing total booked tests in cart.
- `#nav-patient-profile-btn`: Patient profile toggle button showing avatar & name.

### 2.2 Hero & Instant Action Deck
- `#hero-search-input`: Hero main search input with auto-suggestions.
- `#hero-search-suggestions`: Dropdown list for auto-complete matches.
- `#hero-action-book-home`: Card/button triggering Home Sample Collection modal.
- `#hero-action-upload-rx`: Card/button triggering Upload Prescription flow.
- `#hero-action-view-reports`: Card/button triggering Lab Reports Viewer.
- `#hero-action-locate-center`: Card/button scrolling to Diagnostic Center Locator.

### 2.3 Test Catalog & Search/Filter Grid
- `#test-category-pills`: Container with category filter chips (`#pill-all`, `#pill-pathology`, `#pill-radiology`, `#pill-cardiology`, `#pill-diabetes`, `#pill-thyroid`, `#pill-women`).
- `#test-search-field`: Test filter search input inside catalog section.
- `#test-sort-select`: Dropdown for sorting (`relevance`, `price-low`, `price-high`, `tat-fast`).
- `#test-grid-container`: Grid container rendering matching test cards.
- `#test-card-count`: Text displaying "Showing X of Y diagnostic tests".
- `#empty-tests-state`: Placeholder when no test matches the search/filter.

### 2.4 Health Packages Section
- `#packages-grid-container`: Container rendering rich preventive health checkup cards.
- `#compare-packages-btn`: Button opening Package Comparison modal.

### 2.5 Diagnostic Centers Locator
- `#center-city-select`: City dropdown (`New York - Manhattan`, `Brooklyn`, `Queens`, `Jersey City`, `Philadelphia`).
- `#center-search-input`: Search branch by locality or zip code.
- `#filter-center-247`: Checkbox filter for 24/7 branches.
- `#filter-center-radiology`: Checkbox filter for advanced imaging (MRI/CT).
- `#filter-center-drivethru`: Checkbox filter for drive-thru blood draw.
- `#centers-list-container`: Container rendering list of branch cards.
- `#center-map-display`: Interactive simulated map pane with visual pins for selected centers.

### 2.6 Prescription Upload Modal & Automated Parser
- `#rx-upload-modal`: Modal backdrop and container.
- `#rx-modal-close-btn`: Close button for modal.
- `#rx-dropzone`: Drag-and-drop file upload target area.
- `#rx-file-input`: Hidden file input element.
- `#rx-preview-container`: Container showing simulated prescription thumbnail and file name.
- `#rx-patient-phone`: Input for patient contact number.
- `#rx-patient-notes`: Textarea for doctor notes or specific instructions.
- `#rx-analyze-btn`: Action button triggering "AI Test Extraction Simulation".
- `#rx-detected-tests-container`: Container listing detected lab tests with checkboxes to add to cart.
- `#rx-confirm-cart-btn`: Button adding selected detected tests to cart and closing modal.

### 2.7 Interactive Patient Lab Report Vault & Viewer
- `#reports-modal`: Modal backdrop for patient test reports.
- `#reports-modal-close-btn`: Close button.
- `#reports-patient-selector`: Dropdown to toggle demo patients ("Johnathan Vance - Male, 42", "Elena Rostova - Female, 36").
- `#reports-list-container`: Left pane list of finalized and historical diagnostic reports.
- `#report-detail-pane`: Right pane rendering the clinical lab report view.
- `#report-patient-info-header`: Header showing accession #, specimen ID, doctor, collection date.
- `#report-parameters-table-body`: Table body rendering bio-markers, observed values, reference ranges, and flags (`NORMAL`, `HIGH`, `LOW`).
- `#report-print-btn`: Button opening print window / simulated PDF download.
- `#report-share-btn`: Button to copy secure report share link with toast feedback.

### 2.8 Cart Drawer & Checkout Modal
- `#cart-drawer`: Sliding drawer component.
- `#cart-drawer-backdrop`: Darkened backdrop for drawer.
- `#cart-drawer-close-btn`: Close drawer button.
- `#cart-items-list`: Container displaying items currently in cart.
- `#cart-subtotal-price`: Subtotal currency amount.
- `#cart-home-fee`: Home collection fee (free above $50 or $15 flat).
- `#cart-discount-amount`: Promo discount deduction.
- `#cart-total-price`: Final total calculation.
- `#promo-input`: Input for promotional voucher (`HEALTH20` for 20% off).
- `#promo-apply-btn`: Apply promo code button.
- `#promo-feedback-msg`: Success/error message display.
- `#proceed-to-checkout-btn`: Button opening the multi-step checkout modal.

### 2.9 Multi-Step Checkout Modal
- `#checkout-modal`: Multi-step checkout dialog.
- `#checkout-modal-close-btn`: Close modal button.
- `#checkout-step-1-indicator`, `#checkout-step-2-indicator`, `#checkout-step-3-indicator`: Visual step wizard.
- `#service-type-home`: Radio button for Home Sample Collection.
- `#service-type-center`: Radio button for Walk-in Lab Visit.
- `#checkout-center-select-group`: Dropdown to choose branch if walk-in is selected.
- `#checkout-date-input`: Date picker for sample collection / visit.
- `#checkout-time-slot-select`: Dropdown for time slots (e.g., 07:00 AM - 08:30 AM, 08:30 AM - 10:00 AM, etc.).
- `#patient-full-name`: Input for patient name.
- `#patient-age`: Input for age.
- `#patient-gender`: Select for gender (Male, Female, Other).
- `#patient-email`: Input for email for report delivery.
- `#patient-phone`: Input for mobile number.
- `#patient-address`: Textarea for home address (auto-disabled if center visit).
- `#patient-fasting-acknowledged`: Checkbox acknowledging fasting requirement.
- `#payment-method-card`, `#payment-method-cash`, `#payment-method-insurance`: Radio options.
- `#checkout-next-btn`: Stepper navigation button.
- `#checkout-prev-btn`: Stepper previous button.
- `#checkout-submit-btn`: Final confirmation button.

### 2.10 Sample Tracker Drawer / Modal
- `#tracker-modal`: Modal displaying live status of orders.
- `#tracker-modal-close-btn`: Tracker close button.
- `#tracker-booking-id-input`: Input to enter or lookup Booking ID.
- `#tracker-search-btn`: Lookup button.
- `#tracker-stepper-container`: Visual 5-step progress track (Booked -> Phlebotomist Assigned -> Sample Collected -> Analyzing in Lab -> Report Ready).
- `#tracker-phlebotomist-card`: Phlebotomist name, vaccination badge, live temperature, ETA.
- `#tracker-action-view-report`: Button dynamically enabled if status is "Report Ready".

### 2.11 Global Toasts & Notification Container
- `#toast-container`: Floating container for non-blocking feedback notifications.

---

## 3. Data Structures & Pre-Loaded Rich Mock Data

### 3.1 Diagnostic Test Catalog (12 Realistic Clinical Tests)
```javascript
const MOCK_TESTS = [
  {
    id: "test-cbc-01",
    code: "CBC-001",
    name: "Complete Blood Count (CBC) with Differential",
    category: "pathology",
    categoryLabel: "Pathology & Hematology",
    description: "Evaluates overall health and detects conditions such as anemia, infection, and leukemia. Measures 24 parameters including RBC, WBC, Platelets, and Hemoglobin.",
    sampleType: "Blood (EDTA Tube)",
    fastingRequired: false,
    fastingHours: 0,
    tat: "6 Hours",
    price: 28.00,
    popular: true,
    badges: ["Same Day Report", "Standard Vital"]
  },
  {
    id: "test-lipid-02",
    code: "LIP-002",
    name: "Lipid Profile Panel (Cardiac Risk Assessment)",
    category: "cardiology",
    categoryLabel: "Cardiology",
    description: "Measures Total Cholesterol, HDL, LDL, VLDL, and Triglycerides to evaluate cardiovascular disease risk.",
    sampleType: "Blood (Serum Gel Tube)",
    fastingRequired: true,
    fastingHours: 12,
    tat: "8 Hours",
    price: 38.00,
    popular: true,
    badges: ["Fasting 12h", "Cardiac Risk"]
  },
  {
    id: "test-hba1c-03",
    code: "DIA-003",
    name: "HbA1c (Glycated Hemoglobin) Diabetes Monitor",
    category: "diabetes",
    categoryLabel: "Diabetes Monitoring",
    description: "Reflects average blood sugar levels over the past 2 to 3 months using HPLC gold standard method.",
    sampleType: "Blood (Whole Blood)",
    fastingRequired: false,
    fastingHours: 0,
    tat: "4 Hours",
    price: 24.00,
    popular: true,
    badges: ["HPLC Method", "Quick Results"]
  },
  {
    id: "test-tft-04",
    code: "THY-004",
    name: "Thyroid Profile Total (T3, T4, TSH Ultra)",
    category: "thyroid",
    categoryLabel: "Thyroid & Endocrine",
    description: "Assesses thyroid gland activity and screens for hyperthyroidism and hypothyroidism via Chemiluminescence (CLIA).",
    sampleType: "Blood (Serum)",
    fastingRequired: true,
    fastingHours: 8,
    tat: "12 Hours",
    price: 32.00,
    popular: true,
    badges: ["CLIA Certified", "Hormonal Panel"]
  },
  {
    id: "test-lft-05",
    code: "HEP-005",
    name: "Liver Function Test (LFT) Extended 11 Parameters",
    category: "pathology",
    categoryLabel: "Liver & Digestive",
    description: "Screening of SGOT/AST, SGPT/ALT, Alkaline Phosphatase, Bilirubin Total/Direct, and Total Proteins.",
    sampleType: "Blood (Serum)",
    fastingRequired: true,
    fastingHours: 10,
    tat: "8 Hours",
    price: 35.00,
    popular: false,
    badges: ["Comprehensive Liver"]
  },
  {
    id: "test-kft-06",
    code: "REN-006",
    name: "Kidney / Renal Function Panel (KFT + Electrolytes)",
    category: "pathology",
    categoryLabel: "Kidney & Renal",
    description: "Evaluates renal filtration, Serum Creatinine, Blood Urea Nitrogen (BUN), Uric Acid, Sodium, Potassium, and Chloride.",
    sampleType: "Blood (Serum)",
    fastingRequired: false,
    fastingHours: 0,
    tat: "6 Hours",
    price: 42.00,
    popular: false,
    badges: ["Electrolytes Included"]
  },
  {
    id: "test-vit-07",
    code: "VIT-007",
    name: "Vitamin D (25-Hydroxy) & Vitamin B12 Duo",
    category: "pathology",
    categoryLabel: "Vitamins & Deficiencies",
    description: "Essential combo to assess bone density risk, fatigue, muscle weakness, and neurological health.",
    sampleType: "Blood (Serum)",
    fastingRequired: true,
    fastingHours: 8,
    tat: "24 Hours",
    price: 65.00,
    popular: true,
    badges: ["Best Seller", "Fatigue Panel"]
  },
  {
    id: "test-xray-08",
    code: "RAD-008",
    name: "Digital Chest X-Ray (PA & Lateral Views)",
    category: "radiology",
    categoryLabel: "Radiology & Imaging",
    description: "High-resolution digital radiography assessing lungs, heart outline, and thoracic cage with radiologist review.",
    sampleType: "On-site Imaging",
    fastingRequired: false,
    fastingHours: 0,
    tat: "2 Hours",
    price: 45.00,
    popular: false,
    badges: ["Digital HD", "Center Visit Only"]
  },
  {
    id: "test-usg-09",
    code: "RAD-009",
    name: "Ultrasound Whole Abdomen & Pelvis (USG)",
    category: "radiology",
    categoryLabel: "Radiology & Imaging",
    description: "Comprehensive non-invasive sound wave evaluation of liver, gall bladder, kidneys, pancreas, spleen, and pelvic organs.",
    sampleType: "On-site Imaging",
    fastingRequired: true,
    fastingHours: 6,
    tat: "3 Hours",
    price: 85.00,
    popular: false,
    badges: ["Full Bladder Req.", "Radiologist MD"]
  },
  {
    id: "test-psa-10",
    code: "ONC-010",
    name: "PSA (Prostate Specific Antigen) Total",
    category: "pathology",
    categoryLabel: "Men's Health",
    description: "Screening marker for benign prostatic hyperplasia (BPH), inflammation, or prostate malignancies.",
    sampleType: "Blood (Serum)",
    fastingRequired: false,
    fastingHours: 0,
    tat: "12 Hours",
    price: 40.00,
    popular: false,
    badges: ["Men 45+ Screen"]
  },
  {
    id: "test-pap-11",
    code: "GYN-011",
    name: "Cervical Liquid-Based Cytology (LBC Pap Smear)",
    category: "women",
    categoryLabel: "Women's Health",
    description: "Advanced liquid-based cytology screening for precancerous lesions and cervical dysplasia.",
    sampleType: "Cervical Swab (Clinical)",
    fastingRequired: false,
    fastingHours: 0,
    tat: "48 Hours",
    price: 55.00,
    popular: true,
    badges: ["Liquid Based ThinPrep"]
  },
  {
    id: "test-ecg-12",
    code: "CAR-012",
    name: "12-Lead Resting Electrocardiogram (ECG)",
    category: "cardiology",
    categoryLabel: "Cardiology",
    description: "Record of electrical cardiac rhythm, conduction abnormalities, ischemia, and arrhythmias.",
    sampleType: "On-site or Home ECG",
    fastingRequired: false,
    fastingHours: 0,
    tat: "Instant (1 Hour Review)",
    price: 30.00,
    popular: true,
    badges: ["Instant Digital Trace"]
  }
];
```

### 3.2 Preventive Health Checkup Packages (6 Curated Bundles)
```javascript
const MOCK_PACKAGES = [
  {
    id: "pkg-basic",
    name: "Essential Health Shield",
    tagline: "Recommended for annual routine screening (Ages 18-35)",
    testCount: 38,
    includedCategories: ["CBC Complete", "Lipid Profile", "Liver Screen", "Kidney Screen", "Blood Glucose"],
    originalPrice: 110.00,
    discountedPrice: 49.00,
    recommendedFor: "General Well-being",
    fasting: "10-12 hours fasting required",
    popular: false
  },
  {
    id: "pkg-executive",
    name: "Comprehensive Executive Body Check",
    tagline: "Our most trusted full-body health audit for working professionals",
    testCount: 74,
    includedCategories: ["CBC (24 Params)", "Lipid Comprehensive", "Full LFT & KFT", "Thyroid Profile", "HbA1c & Blood Sugar", "Vitamin D3 & B12", "Urine Routine", "Cardiac Markers"],
    originalPrice: 220.00,
    discountedPrice: 89.00,
    recommendedFor: "Men & Women 30+",
    fasting: "12 hours fasting required",
    popular: true
  },
  {
    id: "pkg-cardiac",
    name: "Advanced Cardio-Metabolic Care",
    tagline: "Targeted heart, lipid, vascular and metabolic risk analysis",
    testCount: 52,
    includedCategories: ["Lipid Subfractions", "High-Sensitivity CRP (hs-CRP)", "Apo-A1 & Apo-B", "Homocysteine", "HbA1c", "12-Lead ECG", "Renal Screen"],
    originalPrice: 240.00,
    discountedPrice: 119.00,
    recommendedFor: "Heart Health & Family History",
    fasting: "12 hours fasting required",
    popular: false
  },
  {
    id: "pkg-women-care",
    name: "Women’s Platinum Wellness Package",
    tagline: "Specialized hormonal balance, bone density, and cancer screening",
    testCount: 68,
    includedCategories: ["Thyroid Full Panel", "Iron Studies & Ferritin", "Vitamin D3 & Calcium", "LH/FSH/Prolactin", "Liquid Pap Smear", "CBC & Lipid", "Breast Ultrasound Screening"],
    originalPrice: 280.00,
    discountedPrice: 139.00,
    recommendedFor: "Women 25+",
    fasting: "10 hours fasting required",
    popular: true
  },
  {
    id: "pkg-senior",
    name: "Senior Citizen Gold Care (60+)",
    tagline: "Holistic geriatric wellness, joints, renal, and diabetic stability",
    testCount: 82,
    includedCategories: ["Comprehensive Metabolic Panel", "Rheumatoid Factor & Uric Acid", "PSA (for Men) / CA-125 (for Women)", "Extended Electrolytes", "HbA1c & Microalbuminuria", "Complete Vitamins", "ECG"],
    originalPrice: 310.00,
    discountedPrice: 149.00,
    recommendedFor: "Seniors 60+",
    fasting: "12 hours fasting required",
    popular: false
  },
  {
    id: "pkg-diabetes-mgmt",
    name: "Diabetic Total Care & Complication Scan",
    tagline: "Track insulin sensitivity, target organ protection and glycemic curve",
    testCount: 45,
    includedCategories: ["Fasting & Post-Prandial Blood Sugar", "HbA1c with Average Glucose", "Urine Albumin-to-Creatinine Ratio (UACR)", "Serum Creatinine & eGFR", "Lipid Profile"],
    originalPrice: 150.00,
    discountedPrice: 69.00,
    recommendedFor: "Pre-diabetic & Diabetic Patients",
    fasting: "Fasting + PP testing required",
    popular: false
  }
];
```

### 3.3 Diagnostic Center Locations (5 Centers with Real-World Specs)
```javascript
const MOCK_CENTERS = [
  {
    id: "ctr-manhattan-midtown",
    name: "AuraCare Flagship Diagnostic & Imaging Hub",
    city: "New York - Manhattan",
    address: "450 Lexington Ave, 4th Floor, New York, NY 10017",
    phone: "(212) 555-0192",
    hours: "Open 24/7 (Emergency & Routine)",
    isOpen247: true,
    hasRadiology: true,
    hasDriveThru: false,
    services: ["Blood Draw & Pathology", "3T MRI & 128-Slice CT", "Ultrasound", "Digital X-Ray", "Cardiology ECG/Echo"],
    distance: "0.8 miles away",
    coordinates: { lat: 40.7533, lng: -73.9749 }
  },
  {
    id: "ctr-brooklyn-heights",
    name: "AuraCare Clinical Lab & Drive-Thru Phlebotomy",
    city: "Brooklyn",
    address: "185 Montague St, Brooklyn, NY 11201",
    phone: "(718) 555-0144",
    hours: "Mon - Sat: 6:30 AM - 8:00 PM | Sun: 7:00 AM - 3:00 PM",
    isOpen247: false,
    hasRadiology: true,
    hasDriveThru: true,
    services: ["Drive-Thru Phlebotomy", "Ultrasound & Mammography", "Digital X-Ray", "Routine & Express Blood Draw"],
    distance: "2.4 miles away",
    coordinates: { lat: 40.6934, lng: -73.9912 }
  },
  {
    id: "ctr-queens-astoria",
    name: "AuraCare Astoria Community Pathology Center",
    city: "Queens",
    address: "31-18 Broadway, Astoria, NY 11106",
    phone: "(718) 555-0188",
    hours: "Mon - Fri: 7:00 AM - 7:00 PM | Sat: 8:00 AM - 4:00 PM",
    isOpen247: false,
    hasRadiology: false,
    hasDriveThru: false,
    services: ["Routine Blood Collection", "Pediatric Phlebotomy", "COVID-19 & Flu Rapid RT-PCR", "Urine Drug Screening"],
    distance: "4.1 miles away",
    coordinates: { lat: 40.7619, lng: -73.9248 }
  },
  {
    id: "ctr-jersey-exchange",
    name: "AuraCare Jersey City Waterfront Lab & MRI",
    city: "Jersey City",
    address: "10 Exchange Place, Suite 300, Jersey City, NJ 07302",
    phone: "(201) 555-0165",
    hours: "Open 24/7",
    isOpen247: true,
    hasRadiology: true,
    hasDriveThru: true,
    services: ["24/7 Stat Lab Testing", "Open MRI Suite", "4D Ultrasound", "Corporate Pre-employment Screen"],
    distance: "3.7 miles away",
    coordinates: { lat: 40.7168, lng: -74.0324 }
  },
  {
    id: "ctr-philly-center",
    name: "AuraCare Philadelphia Regional Reference Center",
    city: "Philadelphia",
    address: "1601 Market St, Suite 105, Philadelphia, PA 19103",
    phone: "(215) 555-0110",
    hours: "Mon - Sat: 6:00 AM - 9:00 PM | Sun: 8:00 AM - 2:00 PM",
    isOpen247: false,
    hasRadiology: true,
    hasDriveThru: false,
    services: ["High Complexity Molecular Diagnostics", "Genetic Sequencing Panels", "Radiology Suite", "Blood & Allergy Testing"],
    distance: "88 miles away",
    coordinates: { lat: 39.9531, lng: -75.1683 }
  }
];
```

### 3.4 Patient Lab Reports Vault (Real-World Parameter Breakdown with Range Visualizer)
```javascript
const MOCK_PATIENT_REPORTS = [
  {
    accessionNumber: "AC-2025-889410",
    patientName: "Johnathan Vance",
    patientAge: 42,
    patientGender: "Male",
    orderDate: "2025-02-12",
    reportedDate: "2025-02-13 09:45 AM",
    referringDoctor: "Dr. Robert Marcus, MD (Internal Medicine)",
    testTitle: "Comprehensive Executive Health & Lipid Profile",
    status: "Final - Doctor Reviewed",
    overallSummary: "Elevated LDL Cholesterol and mild Vitamin D deficiency. Glycemic parameters within optimal range.",
    parameters: [
      { name: "Fasting Blood Glucose", value: 94.0, unit: "mg/dL", normalMin: 70.0, normalMax: 99.0, status: "NORMAL" },
      { name: "HbA1c (Glycated Hemoglobin)", value: 5.4, unit: "%", normalMin: 4.0, normalMax: 5.6, status: "NORMAL" },
      { name: "Total Cholesterol", value: 218.0, unit: "mg/dL", normalMin: 125.0, normalMax: 200.0, status: "HIGH" },
      { name: "HDL Cholesterol (Good)", value: 44.0, unit: "mg/dL", normalMin: 40.0, normalMax: 60.0, status: "NORMAL" },
      { name: "LDL Cholesterol (Bad)", value: 142.0, unit: "mg/dL", normalMin: 0.0, normalMax: 100.0, status: "HIGH" },
      { name: "Triglycerides", value: 160.0, unit: "mg/dL", normalMin: 35.0, normalMax: 150.0, status: "HIGH" },
      { name: "Serum Creatinine", value: 0.95, unit: "mg/dL", normalMin: 0.70, normalMax: 1.30, status: "NORMAL" },
      { name: "eGFR (Estimated Filtration)", value: 98.0, unit: "mL/min/1.73m2", normalMin: 90.0, normalMax: 120.0, status: "NORMAL" },
      { name: "SGPT / ALT (Liver)", value: 28.0, unit: "U/L", normalMin: 7.0, normalMax: 45.0, status: "NORMAL" },
      { name: "Vitamin D 25-Hydroxy", value: 22.4, unit: "ng/mL", normalMin: 30.0, normalMax: 100.0, status: "LOW" },
      { name: "Vitamin B12", value: 420.0, unit: "pg/mL", normalMin: 211.0, normalMax: 911.0, status: "NORMAL" }
    ]
  },
  {
    accessionNumber: "AC-2025-773120",
    patientName: "Elena Rostova",
    patientAge: 36,
    patientGender: "Female",
    orderDate: "2025-02-08",
    reportedDate: "2025-02-08 05:15 PM",
    referringDoctor: "Dr. Claire Sterling, MD (Endocrinology)",
    testTitle: "Thyroid Profile Total & Complete Hemogram (CBC)",
    status: "Final - Doctor Reviewed",
    overallSummary: "Mild microcytic anemia detected with borderline low Ferritin. Thyroid stimulating hormone (TSH) within normal physiological target.",
    parameters: [
      { name: "Hemoglobin (Hb)", value: 11.2, unit: "g/dL", normalMin: 12.0, normalMax: 15.5, status: "LOW" },
      { name: "Total Leucocyte Count (WBC)", value: 6800, unit: "/cumm", normalMin: 4000, normalMax: 11000, status: "NORMAL" },
      { name: "Platelet Count", value: 245000, unit: "/cumm", normalMin: 150000, normalMax: 450000, status: "NORMAL" },
      { name: "TSH (Ultrasensitive)", value: 2.15, unit: "uIU/mL", normalMin: 0.40, normalMax: 4.20, status: "NORMAL" },
      { name: "Free T3 (Triiodothyronine)", value: 3.1, unit: "pg/mL", normalMin: 2.0, normalMax: 4.4, status: "NORMAL" },
      { name: "Free T4 (Thyroxine)", value: 1.22, unit: "ng/dL", normalMin: 0.93, normalMax: 1.70, status: "NORMAL" }
    ]
  }
];
```

### 3.5 Live Active Orders & Sample Tracking Mock
```javascript
const MOCK_ACTIVE_TRACKING = {
  bookingId: "AUR-89241",
  patientName: "Johnathan Vance",
  testsBooked: ["Complete Blood Count (CBC)", "Lipid Profile Panel"],
  scheduledDate: "Today, Feb 18, 2025",
  scheduledSlot: "08:00 AM - 09:30 AM",
  serviceType: "Home Sample Collection",
  address: "742 Evergreen Terrace, Apt 4B, New York, NY",
  currentStepIndex: 3, // Steps: 0: Booked, 1: Phlebotomist Assigned, 2: Sample Collected, 3: Processing in Lab, 4: Report Published
  phlebotomist: {
    name: "Marcus Green, CPT-II",
    badge: "Certified Senior Phlebotomist",
    rating: "4.98 / 5.0 (640+ draws)",
    temperature: "98.4 °F (Normal)",
    vaccinated: "Fully Vaccinated (Triple Dose)",
    phone: "(555) 019-8822"
  },
  timeline: [
    { title: "Booking Confirmed", time: "Feb 17, 07:15 PM", status: "completed" },
    { title: "Phlebotomist Assigned (Marcus Green)", time: "Feb 18, 06:30 AM", status: "completed" },
    { title: "Sample Collected at Home (Cold Chain Secured)", time: "Feb 18, 08:25 AM", status: "completed" },
    { title: "Sample Received & Barcoded at Central Lab", time: "Feb 18, 09:40 AM", status: "in-progress" },
    { title: "Doctor Review & Verified Report Ready", time: "Est. Today, 02:00 PM", status: "pending" }
  ]
};
```

---

## 4. State Architecture & LocalStorage Contract

```javascript
const AppState = {
  cart: [], // Array of { id, title, price, type: 'test'|'package', fasting: boolean }
  promoCode: null,
  discountMultiplier: 0.0,
  activeCategoryFilter: 'all',
  testSearchQuery: '',
  selectedCenterId: 'ctr-manhattan-midtown',
  selectedReportIndex: 0,
  currentTrackingId: 'AUR-89241',
  checkoutData: {
    serviceType: 'home', // 'home' | 'center'
    centerId: 'ctr-manhattan-midtown',
    date: '',
    timeSlot: '07:30 AM - 09:00 AM',
    patient: {
      name: '',
      age: '',
      gender: 'Male',
      email: '',
      phone: '',
      address: '',
      fastingAcknowledged: false
    },
    paymentMethod: 'card'
  }
};
```
- **Persistence:** Synchronize `cart` and `activeBooking` to `localStorage.getItem('auracare_cart')` and `localStorage.getItem('auracare_tracking')`.

---

## 5. Event Handling & Interaction Workflows (No Dead Buttons)

### 5.1 Test Search, Filter & Quick Cart Add
- **Typing in `#hero-search-input` or `#test-search-field`:**
  - Performs case-insensitive matching on test name, code, category, and keywords.
  - Updates `#test-grid-container` and `#test-card-count` dynamically.
- **Clicking Category Pills (`#pill-all`, `#pill-pathology`, etc.):**
  - Removes active class from previous pill, adds to target.
  - Filters cards with smooth fade/re-render.
- **Card "Add to Cart" button (`.btn-add-test`):**
  - Appends item to `AppState.cart`.
  - Animates `#nav-cart-btn` with a quick bounce effect.
  - Updates `#cart-badge` count.
  - Fires toast notification: *"Complete Blood Count added to your health cart"*.
  - Changes button state to "In Cart ✓" with distinct styling.

### 5.2 Cart Drawer & Financial Calculation
- **Clicking `#nav-cart-btn`:**
  - Removes `hidden` from `#cart-drawer` and `#cart-drawer-backdrop`.
  - Renders all cart items with delete triggers (`.cart-item-remove-btn`).
  - Calculates subtotal: `sum(prices)`.
  - Calculates home collection fee: $0 if subtotal >= $50, else $15.
  - Calculates discount: `subtotal * AppState.discountMultiplier`.
  - Displays total: `subtotal - discount + fee`.
- **Applying Promo Code (`#promo-apply-btn`):**
  - If code is `HEALTH20`, applies 20% discount; fires success toast.
  - If invalid, shows red helper text: *"Invalid code. Try HEALTH20"*.
- **Clicking `#proceed-to-checkout-btn`:**
  - Closes cart drawer, opens `#checkout-modal` on Step 1.

### 5.3 Multi-Step Checkout Modal
- **Step 1 (Service & Schedule):**
  - User chooses Home Collection vs Walk-in Center.
  - Address input toggles disabled state when Walk-in is selected.
  - Validates date picker (cannot select past dates).
- **Step 2 (Patient Clinical Info):**
  - Validates name, phone (10 digits), email, and fasting acknowledgment checkbox.
- **Step 3 (Payment & Confirmation):**
  - Summary review of patient and total amount.
  - Clicking `#checkout-submit-btn` triggers simulated loading spinner for 1.2s.
  - Creates new Booking record in `AppState` and `localStorage`.
  - Clears cart, displays instant confirmation screen with new Booking ID (e.g. `AUR-90142`).
  - Provides direct button: *"Track Sample Phlebotomist Now"*.

### 5.4 Prescription Upload & AI Detection Simulator
- **Triggered via `#hero-action-upload-rx` or `#nav-link-upload-rx`:**
  - Opens `#rx-upload-modal`.
  - Dragging file into `#rx-dropzone` or selecting file simulates scan.
  - Shows simulated uploaded medical prescription thumbnail.
  - User clicks `#rx-analyze-btn`:
    - Shows progress animation: *"Scanning doctor handwriting & matching ICD-10 lab codes..."*.
    - After 1 second, displays detected tests:
      1. [x] Complete Blood Count (CBC) - $28.00
      2. [x] Lipid Profile Panel - $38.00
      3. [x] Thyroid Profile (TSH) - $32.00
  - User can uncheck/check items and click `#rx-confirm-cart-btn`:
    - Automatically adds chosen tests to cart and triggers checkout or cart drawer.

### 5.5 Interactive Clinical Lab Report Vault
- **Triggered via `#hero-action-view-reports` or `#nav-link-reports`:**
  - Opens `#reports-modal`.
  - Displays report list on left pane. Clicking any report changes right pane view.
  - Visual Range Bar for each parameter:
    - Normal range indicated by green visual bar.
    - If value < normalMin, tagged with orange/yellow pill "LOW" and marker on the left.
    - If value > normalMax, tagged with bold red badge "HIGH" with warning icon.
  - **Print / PDF button (`#report-print-btn`):**
    - Triggers clean print view formatted specifically as an official diagnostic report with clinic header, NABL/CAP accreditation logos, barcode, and digital medical director signature.
  - **Share button (`#report-share-btn`):**
    - Copies simulated secure link to clipboard and pops toast: *"Secure doctor share link copied to clipboard"*.

### 5.6 Diagnostic Center Locator & Map Simulation
- **City Dropdown (`#center-city-select`) & Search (`#center-search-input`):**
  - Dynamically filters the 5 locations.
  - Checkboxes for `24/7 Hours`, `Radiology (MRI/CT)`, and `Drive-thru`.
  - Clicking any location card:
    - Highlights corresponding pin on simulated SVG/Canvas interactive map.
    - Shows branch details: Operating hours, phone, phlebotomy wait time (e.g. "Current walk-in wait: ~8 mins").
    - Has "Book Visit Here" button which pre-selects this branch in checkout.

### 5.7 Live Phlebotomist Sample Tracker
- **Triggered via `#nav-link-tracker`:**
  - Opens `#tracker-modal` displaying real-time stepper.
  - Shows assigned phlebotomist card with temperature reading, vaccination badge, call button, and ETA.
  - Dynamic status bar showing progression.

---

## 6. Zoro Implementation Instructions

1. **Self-Contained Clean Architecture:**
   - Write semantic HTML in `index.html`.
   - Write production-grade styles in `styles.css` using modern CSS variables, flexbox, grid, and polished medical SaaS UI aesthetics.
   - Write all business logic and interactivity in `app.js` with structured modules.
2. **Icons:**
   - Use clean, embedded SVGs or Feather/Lucide styled SVGs (no broken external font dependencies).
3. **Responsive Design:**
   - 100% mobile, tablet, and desktop responsive with collapsible drawer menus and intuitive touch targets.
4. **Zero Placeholders:**
   - All 12 tests, 6 packages, 5 centers, and 2 full clinical reports must be fully functional with zero dummy `#` links.

---
*Ready for Builder execution by Zoro.*