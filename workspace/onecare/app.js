/* ==================== APP STATE & DATA REPOSITORY ==================== */
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
    coordinates: { lat: 40.7533, lng: -73.9749, top: "35%", left: "48%" }
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
    coordinates: { lat: 40.6934, lng: -73.9912, top: "68%", left: "44%" }
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
    coordinates: { lat: 40.7619, lng: -73.9248, top: "28%", left: "65%" }
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
    coordinates: { lat: 40.7168, lng: -74.0324, top: "52%", left: "22%" }
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
    coordinates: { lat: 39.9531, lng: -75.1683, top: "82%", left: "15%" }
  }
];

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

const MOCK_ACTIVE_TRACKING = {
  bookingId: "AUR-89241",
  patientName: "Johnathan Vance",
  testsBooked: ["Complete Blood Count (CBC)", "Lipid Profile Panel"],
  scheduledDate: "Today, Feb 18, 2025",
  scheduledSlot: "08:00 AM - 09:30 AM",
  serviceType: "Home Sample Collection",
  address: "742 Evergreen Terrace, Apt 4B, New York, NY",
  currentStepIndex: 3,
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

// Global App State
const AppState = {
  cart: JSON.parse(localStorage.getItem('auracare_cart')) || [
    { id: "test-cbc-01", title: "Complete Blood Count (CBC) with Differential", price: 28.00, type: "test", fasting: false }
  ],
  promoCode: null,
  discountMultiplier: 0.0,
  activeCategoryFilter: 'all',
  testSearchQuery: '',
  selectedCenterId: 'ctr-manhattan-midtown',
  selectedReportIndex: 0,
  currentTrackingId: 'AUR-89241',
  checkoutData: {
    serviceType: 'home',
    centerId: 'ctr-manhattan-midtown',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '07:30 AM - 09:00 AM',
    patient: {
      name: 'Johnathan Vance',
      age: '42',
      gender: 'Male',
      email: 'johnathan.vance@example.com',
      phone: '(555) 492-1100',
      address: '742 Evergreen Terrace, Apt 4B, New York, NY 10025',
      fastingAcknowledged: true
    },
    paymentMethod: 'card'
  }
};

// ==================== DOM INITIALIZATION & EVENT BINDINGS ====================
document.addEventListener('DOMContentLoaded', () => {
  renderCartBadge();
  renderTestsCatalog();
  renderPackagesGrid();
  renderDiagnosticCenters();
  renderMapPins();

  // Bind Global Listeners
  bindNavigationEvents();
  bindSearchEvents();
  bindModalEvents();
  bindCheckoutEvents();
  bindTrackerEvents();
  bindPrescriptionEvents();
  bindReportsEvents();
  bindComparisonEvents();
});

// Toast Notification Helper
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast-notification ${type}`;
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Cart Persistence & Badge Update
function updateCartStorage() {
  localStorage.setItem('auracare_cart', JSON.stringify(AppState.cart));
  renderCartBadge();
}

function renderCartBadge() {
  const badge = document.getElementById('cart-badge');
  const drawerCount = document.getElementById('drawer-item-count');
  if (badge) badge.textContent = AppState.cart.length;
  if (drawerCount) drawerCount.textContent = AppState.cart.length;
}

// ==================== NAVIGATION & HERO LOGIC ====================
function bindNavigationEvents() {
  document.getElementById('nav-brand-logo').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.getElementById('nav-cart-btn').addEventListener('click', openCartDrawer);
  document.getElementById('cart-drawer-backdrop').addEventListener('click', closeCartDrawer);
  document.getElementById('cart-drawer-close-btn').addEventListener('click', closeCartDrawer);

  document.getElementById('hero-action-book-home').addEventListener('click', () => {
    AppState.checkoutData.serviceType = 'home';
    openCheckoutModal();
  });

  document.getElementById('hero-action-upload-rx').addEventListener('click', openRxModal);
  document.getElementById('nav-link-upload-rx').addEventListener('click', openRxModal);
  document.getElementById('footer-btn-upload').addEventListener('click', openRxModal);

  document.getElementById('hero-action-view-reports').addEventListener('click', openReportsModal);
  document.getElementById('nav-link-reports').addEventListener('click', openReportsModal);
  document.getElementById('footer-btn-reports').addEventListener('click', openReportsModal);

  document.getElementById('hero-action-locate-center').addEventListener('click', () => {
    document.getElementById('centers-section').scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('nav-link-tracker').addEventListener('click', openTrackerModal);
  document.getElementById('footer-btn-tracker').addEventListener('click', openTrackerModal);

  document.getElementById('top-accessibility-btn').addEventListener('click', () => {
    showToast("High contrast accessibility mode activated", "success");
    document.body.style.filter = document.body.style.filter ? '' : 'contrast(1.05)';
  });
}

// ==================== SEARCH & AUTO-SUGGESTION LOGIC ====================
function bindSearchEvents() {
  const heroSearchInput = document.getElementById('hero-search-input');
  const suggestionsBox = document.getElementById('hero-search-suggestions');
  const navSearchInput = document.getElementById('nav-search-input');
  const testSearchField = document.getElementById('test-search-field');

  heroSearchInput.addEventListener('input', (e) => {
    const val = e.target.value.trim().toLowerCase();
    if (!val) {
      suggestionsBox.classList.add('hidden');
      return;
    }
    const matches = MOCK_TESTS.filter(t => 
      t.name.toLowerCase().includes(val) || t.code.toLowerCase().includes(val) || t.categoryLabel.toLowerCase().includes(val)
    );

    if (matches.length > 0) {
      suggestionsBox.innerHTML = matches.slice(0, 5).map(m => `
        <div class="suggestion-item" onclick="selectSuggestion('${m.id}')">
          <span class="s-name">${m.name}</span>
          <span class="s-cat">${m.categoryLabel} - $${m.price.toFixed(2)}</span>
        </div>
      `).join('');
      suggestionsBox.classList.remove('hidden');
    } else {
      suggestionsBox.innerHTML = `<div class="suggestion-item"><span class="s-name">No matching tests found</span></div>`;
      suggestionsBox.classList.remove('hidden');
    }
  });

  document.addEventListener('click', (e) => {
    if (!heroSearchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
      suggestionsBox.classList.add('hidden');
    }
  });

  document.getElementById('hero-search-submit-btn').addEventListener('click', () => {
    document.getElementById('tests-section').scrollIntoView({ behavior: 'smooth' });
  });

  navSearchInput.addEventListener('input', (e) => {
    AppState.testSearchQuery = e.target.value;
    renderTestsCatalog();
    document.getElementById('tests-section').scrollIntoView({ behavior: 'smooth' });
  });

  testSearchField.addEventListener('input', (e) => {
    AppState.testSearchQuery = e.target.value;
    renderTestsCatalog();
  });

  document.getElementById('test-sort-select').addEventListener('change', renderTestsCatalog);

  // Category Pills
  document.querySelectorAll('.category-pills .pill-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.category-pills .pill-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      AppState.activeCategoryFilter = e.target.getAttribute('data-category');
      renderTestsCatalog();
    });
  });

  const resetBtn = document.getElementById('reset-filters-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      AppState.activeCategoryFilter = 'all';
      AppState.testSearchQuery = '';
      document.getElementById('test-search-field').value = '';
      document.querySelectorAll('.category-pills .pill-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('pill-all').classList.add('active');
      renderTestsCatalog();
    });
  }
}

function selectSuggestion(testId) {
  const test = MOCK_TESTS.find(t => t.id === testId);
  if (test) {
    addToCart(test.id, test.name, test.price, 'test', test.fastingRequired);
    document.getElementById('hero-search-suggestions').classList.add('hidden');
    document.getElementById('hero-search-input').value = '';
  }
}

// ==================== TEST CATALOG RENDERING ====================
function renderTestsCatalog() {
  const grid = document.getElementById('test-grid-container');
  const countText = document.getElementById('test-card-count');
  const emptyState = document.getElementById('empty-tests-state');
  const sortVal = document.getElementById('test-sort-select').value;

  let filtered = MOCK_TESTS.filter(t => {
    const matchesCat = AppState.activeCategoryFilter === 'all' || t.category === AppState.activeCategoryFilter;
    const q = AppState.testSearchQuery.toLowerCase();
    const matchesQuery = !q || t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  // Sorting
  if (sortVal === 'price-low') filtered.sort((a,b) => a.price - b.price);
  else if (sortVal === 'price-high') filtered.sort((a,b) => b.price - a.price);
  else if (sortVal === 'tat-fast') filtered.sort((a,b) => parseInt(a.tat) - parseInt(b.tat));

  countText.textContent = `Showing ${filtered.length} of ${MOCK_TESTS.length} diagnostic tests`;

  if (filtered.length === 0) {
    grid.classList.add('hidden');
    emptyState.classList.remove('hidden');
    return;
  }

  grid.classList.remove('hidden');
  emptyState.classList.add('hidden');

  grid.innerHTML = filtered.map(t => {
    const inCart = AppState.cart.some(item => item.id === t.id);
    return `
      <div class="test-card">
        <div class="test-card-top">
          <div class="test-badges-row">
            <span class="badge-tag">${t.categoryLabel}</span>
            ${t.popular ? '<span class="badge-tag popular">Most Popular</span>' : ''}
            ${t.badges.map(b => `<span class="badge-tag">${b}</span>`).join('')}
          </div>
          <h3>${t.name}</h3>
          <p class="test-desc">${t.description}</p>
          <div class="test-specs-list">
            <div class="spec-item"><span>Sample Type:</span><span>${t.sampleType}</span></div>
            <div class="spec-item"><span>Fasting Required:</span><span>${t.fastingRequired ? `Yes (${t.fastingHours}h)` : 'No Fasting'}</span></div>
            <div class="spec-item"><span>Turnaround Time (TAT):</span><span>${t.tat}</span></div>
          </div>
        </div>
        <div class="test-card-bottom">
          <div class="test-price-wrap">
            <span class="price-label">Test Price</span>
            <span class="price-amount">$${t.price.toFixed(2)}</span>
          </div>
          <button class="btn ${inCart ? 'btn-success' : 'btn-primary'} btn-sm" onclick="toggleCartItem('${t.id}', '${t.name.replace(/'/g, "\\'")}', ${t.price}, ${t.fastingRequired})">
            ${inCart ? 'In Cart ✓' : 'Add to Cart'}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function toggleCartItem(id, name, price, fasting) {
  const index = AppState.cart.findIndex(i => i.id === id);
  if (index > -1) {
    AppState.cart.splice(index, 1);
    showToast(`Removed "${name}" from cart`, 'error');
  } else {
    AppState.cart.push({ id, title: name, price, type: 'test', fasting });
    showToast(`Added "${name}" to your health cart`, 'success');
  }
  updateCartStorage();
  renderTestsCatalog();
  renderPackagesGrid();
}

function addToCart(id, name, price, type, fasting) {
  if (!AppState.cart.some(i => i.id === id)) {
    AppState.cart.push({ id, title: name, price, type, fasting });
    updateCartStorage();
    showToast(`Added "${name}" to your cart`, 'success');
    renderTestsCatalog();
  } else {
    showToast(`Item is already in your cart`, 'success');
  }
}

// ==================== PACKAGES SECTION RENDERING ====================
function renderPackagesGrid() {
  const container = document.getElementById('packages-grid-container');
  if (!container) return;

  container.innerHTML = MOCK_PACKAGES.map(pkg => {
    const inCart = AppState.cart.some(i => i.id === pkg.id);
    return `
      <div class="package-card ${pkg.popular ? 'popular' : ''}">
        ${pkg.popular ? '<div class="package-popular-ribbon">Most Popular Checkup</div>' : ''}
        <div>
          <h3>${pkg.name}</h3>
          <p class="package-tagline">${pkg.tagline}</p>
          <span class="package-test-count">${pkg.testCount} Parameters Included</span>
          <ul class="package-categories-list">
            ${pkg.includedCategories.map(c => `<li>${c}</li>`).join('')}
          </ul>
        </div>
        <div>
          <div class="package-card-bottom">
            <div class="package-pricing">
              <span class="orig-price">$${pkg.originalPrice.toFixed(2)}</span>
              <span class="disc-price">$${pkg.discountedPrice.toFixed(2)}</span>
            </div>
            <button class="btn ${inCart ? 'btn-success' : 'btn-primary'}" onclick="toggleCartItem('${pkg.id}', '${pkg.name.replace(/'/g, "\\'")}', ${pkg.discountedPrice}, true)">
              ${inCart ? 'In Cart ✓' : 'Book Package'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ==================== DIAGNOSTIC CENTERS & MAP ====================
function renderDiagnosticCenters() {
  const listContainer = document.getElementById('centers-list-container');
  const citySelect = document.getElementById('center-city-select');
  const searchInput = document.getElementById('center-search-input');
  const chk247 = document.getElementById('filter-center-247');
  const chkRadiology = document.getElementById('filter-center-radiology');
  const chkDriveThru = document.getElementById('filter-center-drivethru');

  function filterAndRender() {
    const city = citySelect.value;
    const q = searchInput.value.toLowerCase();
    const is247 = chk247.checked;
    const isRad = chkRadiology.checked;
    const isDrive = chkDriveThru.checked;

    const filtered = MOCK_CENTERS.filter(c => {
      const matchCity = city === 'all' || c.city === city;
      const matchQ = !q || c.name.toLowerCase().includes(q) || c.address.toLowerCase().includes(q);
      const match247 = !is247 || c.isOpen247;
      const matchRad = !isRad || c.hasRadiology;
      const matchDrive = !isDrive || c.hasDriveThru;
      return matchCity && matchQ && match247 && matchRad && matchDrive;
    });

    listContainer.innerHTML = filtered.map(c => `
      <div class="center-card ${AppState.selectedCenterId === c.id ? 'active' : ''}" onclick="selectDiagnosticCenter('${c.id}')">
        <div class="center-card-header">
          <h4>${c.name}</h4>
          <span class="status-pill ${c.isOpen247 ? 'normal' : 'in-progress'}">${c.hours.split('|')[0]}</span>
        </div>
        <p class="center-address">${c.address}</p>
        <div class="center-tags">
          ${c.services.map(s => `<span class="center-tag">${s}</span>`).join('')}
        </div>
        <div class="center-card-footer">
          <span>📞 ${c.phone}</span>
          <span>📍 ${c.distance}</span>
        </div>
      </div>
    `).join('');
  }

  citySelect.addEventListener('change', filterAndRender);
  searchInput.addEventListener('input', filterAndRender);
  chk247.addEventListener('change', filterAndRender);
  chkRadiology.addEventListener('change', filterAndRender);
  chkDriveThru.addEventListener('change', filterAndRender);

  filterAndRender();
}

function renderMapPins() {
  const pinsContainer = document.getElementById('map-pins-container');
  if (!pinsContainer) return;

  pinsContainer.innerHTML = MOCK_CENTERS.map((c, index) => `
    <div class="map-pin ${AppState.selectedCenterId === c.id ? 'active' : ''}" style="top: ${c.coordinates.top}; left: ${c.coordinates.left};" onclick="selectDiagnosticCenter('${c.id}')" title="${c.name}">
      ${index + 1}
    </div>
  `).join('');
}

function selectDiagnosticCenter(centerId) {
  AppState.selectedCenterId = centerId;
  renderDiagnosticCenters();
  renderMapPins();
  const center = MOCK_CENTERS.find(c => c.id === centerId);
  if (center) {
    document.getElementById('map-tip-title').textContent = center.name;
    document.getElementById('map-tip-address').textContent = center.address;
    document.getElementById('map-tip-status').textContent = center.hours;
    showToast(`Selected branch: ${center.name}`, 'success');
  }
}

// ==================== CART DRAWER & CHECKOUT ====================
function openCartDrawer() {
  renderCartDrawerItems();
  document.getElementById('cart-drawer').classList.remove('hidden');
  document.getElementById('cart-drawer-backdrop').classList.remove('hidden');
}

function closeCartDrawer() {
  document.getElementById('cart-drawer').classList.add('hidden');
  document.getElementById('cart-drawer-backdrop').classList.add('hidden');
}

function renderCartDrawerItems() {
  const list = document.getElementById('cart-items-list');
  if (!list) return;

  if (AppState.cart.length === 0) {
    list.innerHTML = `<p class="text-muted text-center py-4">Your health cart is currently empty.</p>`;
    updateCartTotals(0);
    return;
  }

  list.innerHTML = AppState.cart.map(item => `
    <div class="cart-item-card">
      <div class="cart-item-info">
        <h5>${item.title}</h5>
        <span>${item.fasting ? 'Fasting Required' : 'No Fasting'}</span>
      </div>
      <div class="cart-item-right">
        <span class="cart-item-price">$${item.price.toFixed(2)}</span>
        <button class="cart-item-remove-btn" onclick="removeCartItem('${item.id}')">&times;</button>
      </div>
    </div>
  `).join('');

  const subtotal = AppState.cart.reduce((sum, i) => sum + i.price, 0);
  updateCartTotals(subtotal);
}

function removeCartItem(id) {
  AppState.cart = AppState.cart.filter(i => i.id !== id);
  updateCartStorage();
  renderCartDrawerItems();
  renderTestsCatalog();
  renderPackagesGrid();
  showToast("Item removed from cart", "error");
}

function updateCartTotals(subtotal) {
  const fee = subtotal >= 50 || subtotal === 0 ? 0 : 15;
  const discount = subtotal * AppState.discountMultiplier;
  const total = Math.max(0, subtotal - discount + fee);

  document.getElementById('cart-subtotal-price').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('cart-home-fee').textContent = fee === 0 ? 'FREE ($0)' : `$${fee.toFixed(2)}`;
  document.getElementById('cart-discount-amount').textContent = `-$${discount.toFixed(2)}`;
  document.getElementById('cart-total-price').textContent = `$${total.toFixed(2)}`;
}

function bindModalEvents() {
  const promoApplyBtn = document.getElementById('promo-apply-btn');
  const promoInput = document.getElementById('promo-input');
  const promoMsg = document.getElementById('promo-feedback-msg');

  promoApplyBtn.addEventListener('click', () => {
    const code = promoInput.value.trim().toUpperCase();
    if (code === 'HEALTH20') {
      AppState.promoCode = 'HEALTH20';
      AppState.discountMultiplier = 0.20;
      promoMsg.textContent = 'Promo code HEALTH20 applied successfully (20% off)!';
      promoMsg.className = 'promo-feedback success hidden';
      promoMsg.classList.remove('hidden');
      const subtotal = AppState.cart.reduce((sum, i) => sum + i.price, 0);
      updateCartTotals(subtotal);
      showToast("Promo code HEALTH20 applied!", "success");
    } else {
      promoMsg.textContent = 'Invalid promo code. Try HEALTH20';
      promoMsg.className = 'promo-feedback error hidden';
      promoMsg.classList.remove('hidden');
    }
  });

  document.getElementById('proceed-to-checkout-btn').addEventListener('click', () => {
    if (AppState.cart.length === 0) {
      showToast("Your cart is empty. Add tests before checkout.", "error");
      return;
    }
    closeCartDrawer();
    openCheckoutModal();
  });
}

// ==================== CHECKOUT MULTI-STEP MODAL ====================
let currentCheckoutStep = 1;

function openCheckoutModal() {
  currentCheckoutStep = 1;
  renderCheckoutStep();
  document.getElementById('checkout-modal').classList.remove('hidden');
}

function closeCheckoutModal() {
  document.getElementById('checkout-modal').classList.add('hidden');
}

function bindCheckoutEvents() {
  document.getElementById('checkout-modal-close-btn').addEventListener('click', closeCheckoutModal);

  // Service type toggle
  const homeRadio = document.getElementById('service-type-home');
  const centerRadio = document.getElementById('service-type-center');
  const centerGroup = document.getElementById('checkout-center-select-group');
  const addressGroup = document.getElementById('patient-address-group');
  const centerDropdown = document.getElementById('checkout-center-dropdown');

  centerDropdown.innerHTML = MOCK_CENTERS.map(c => `<option value="${c.id}">${c.name} (${c.city})</option>`).join('');

  homeRadio.addEventListener('change', () => {
    if (homeRadio.checked) {
      AppState.checkoutData.serviceType = 'home';
      document.getElementById('service-type-home-label').classList.add('active');
      document.getElementById('service-type-center-label').classList.remove('active');
      centerGroup.classList.add('hidden');
      addressGroup.classList.remove('hidden');
    }
  });

  centerRadio.addEventListener('change', () => {
    if (centerRadio.checked) {
      AppState.checkoutData.serviceType = 'center';
      document.getElementById('service-type-center-label').classList.add('active');
      document.getElementById('service-type-home-label').classList.remove('active');
      centerGroup.classList.remove('hidden');
      addressGroup.classList.add('hidden');
    }
  });

  document.getElementById('checkout-next-btn').addEventListener('click', () => {
    if (currentCheckoutStep === 1) {
      currentCheckoutStep = 2;
    } else if (currentCheckoutStep === 2) {
      // Validate step 2
      const name = document.getElementById('patient-full-name').value.trim();
      const phone = document.getElementById('patient-phone').value.trim();
      if (!name || !phone) {
        showToast("Please enter patient name and mobile number", "error");
        return;
      }
      currentCheckoutStep = 3;
      prepareStep3Summary();
    }
    renderCheckoutStep();
  });

  document.getElementById('checkout-prev-btn').addEventListener('click', () => {
    if (currentCheckoutStep > 1) {
      currentCheckoutStep--;
      renderCheckoutStep();
    }
  });

  document.getElementById('checkout-submit-btn').addEventListener('click', () => {
    showToast("Processing secure payment & booking...", "success");
    setTimeout(() => {
      closeCheckoutModal();
      AppState.cart = [];
      updateCartStorage();
      showToast("Booking Confirmed! Order ID: AUR-90142", "success");
    }, 1200);
  });
}

function renderCheckoutStep() {
  const step1 = document.getElementById('checkout-step-1-content');
  const step2 = document.getElementById('checkout-step-2-content');
  const step3 = document.getElementById('checkout-step-3-content');

  const ind1 = document.getElementById('checkout-step-1-indicator');
  const ind2 = document.getElementById('checkout-step-2-indicator');
  const ind3 = document.getElementById('checkout-step-3-indicator');

  const prevBtn = document.getElementById('checkout-prev-btn');
  const nextBtn = document.getElementById('checkout-next-btn');
  const submitBtn = document.getElementById('checkout-submit-btn');

  step1.classList.add('hidden');
  step2.classList.add('hidden');
  step3.classList.add('hidden');
  ind1.classList.remove('active');
  ind2.classList.remove('active');
  ind3.classList.remove('active');

  if (currentCheckoutStep === 1) {
    step1.classList.remove('hidden');
    ind1.classList.add('active');
    prevBtn.classList.add('hidden');
    nextBtn.classList.remove('hidden');
    submitBtn.classList.add('hidden');
    nextBtn.textContent = 'Continue to Patient Details';
  } else if (currentCheckoutStep === 2) {
    step2.classList.remove('hidden');
    ind1.classList.add('active');
    ind2.classList.add('active');
    prevBtn.classList.remove('hidden');
    nextBtn.classList.remove('hidden');
    submitBtn.classList.add('hidden');
    nextBtn.textContent = 'Continue to Payment';
  } else if (currentCheckoutStep === 3) {
    step3.classList.remove('hidden');
    ind1.classList.add('active');
    ind2.classList.add('active');
    ind3.classList.add('active');
    prevBtn.classList.remove('hidden');
    nextBtn.classList.add('hidden');
    submitBtn.classList.remove('hidden');
  }
}

function prepareStep3Summary() {
  const list = document.getElementById('checkout-summary-items');
  list.innerHTML = AppState.cart.map(i => `
    <div class="summary-row"><span>${i.title}</span> <span>$${i.price.toFixed(2)}</span></div>
  `).join('');

  const sub = AppState.cart.reduce((s, i) => s + i.price, 0);
  const fee = AppState.checkoutData.serviceType === 'home' && sub < 50 ? 15 : 0;
  const disc = sub * AppState.discountMultiplier;
  const tot = Math.max(0, sub - disc + fee);

  document.getElementById('chk-sub').textContent = `$${sub.toFixed(2)}`;
  document.getElementById('chk-fee').textContent = fee === 0 ? '$0.00 (Free)' : `$${fee.toFixed(2)}`;
  document.getElementById('chk-disc').textContent = `-$${disc.toFixed(2)}`;
  document.getElementById('chk-total').textContent = `$${tot.toFixed(2)}`;
}

// ==================== PRESCRIPTION UPLOAD & AI PARSER ====================
function openRxModal() {
  document.getElementById('rx-upload-modal').classList.remove('hidden');
  document.getElementById('rx-dropzone').classList.remove('hidden');
  document.getElementById('rx-preview-container').classList.add('hidden');
  document.getElementById('rx-detected-tests-container').classList.add('hidden');
}

function closeRxModal() {
  document.getElementById('rx-upload-modal').classList.add('hidden');
}

function bindPrescriptionEvents() {
  document.getElementById('rx-modal-close-btn').addEventListener('click', closeRxModal);
  document.getElementById('browse-file-btn').addEventListener('click', () => {
    document.getElementById('rx-file-input').click();
  });

  document.getElementById('rx-file-input').addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      document.getElementById('rx-file-name').textContent = file.name;
      document.getElementById('rx-dropzone').classList.add('hidden');
      document.getElementById('rx-preview-container').classList.remove('hidden');
      showToast(`Prescription "${file.name}" uploaded successfully`, 'success');
    }
  });

  const dropzone = document.getElementById('rx-dropzone');
  dropzone.addEventListener('dragover', (e) => e.preventDefault());
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      document.getElementById('rx-file-name').textContent = file.name;
      document.getElementById('rx-dropzone').classList.add('hidden');
      document.getElementById('rx-preview-container').classList.remove('hidden');
      showToast(`Prescription "${file.name}" dropped & uploaded`, 'success');
    }
  });

  document.getElementById('rx-remove-file').addEventListener('click', () => {
    document.getElementById('rx-dropzone').classList.remove('hidden');
    document.getElementById('rx-preview-container').classList.add('hidden');
  });

  document.getElementById('rx-analyze-btn').addEventListener('click', () => {
    showToast("AI analyzing handwriting and matching ICD-10 lab codes...", "success");
    setTimeout(() => {
      document.getElementById('rx-preview-container').classList.add('hidden');
      const detectedContainer = document.getElementById('rx-detected-tests-container');
      const list = document.getElementById('rx-detected-list');

      const sampleDetected = [
        { id: 'test-cbc-01', name: 'Complete Blood Count (CBC)', price: 28.00, checked: true },
        { id: 'test-lipid-02', name: 'Lipid Profile Panel', price: 38.00, checked: true },
        { id: 'test-tft-04', name: 'Thyroid Profile Total (T3, T4, TSH)', price: 32.00, checked: true }
      ];

      list.innerHTML = sampleDetected.map(d => `
        <label class="detected-item-row">
          <div class="checkbox-label">
            <input type="checkbox" value="${d.id}" ${d.checked ? 'checked' : ''} class="rx-detect-checkbox">
            <span><strong>${d.name}</strong></span>
          </div>
          <span class="font-weight-bold">$${d.price.toFixed(2)}</span>
        </label>
      `).join('');

      detectedContainer.classList.remove('hidden');
      showToast("AI Test Extraction Complete! 3 tests matched.", "success");
    }, 1200);
  });

  document.getElementById('rx-confirm-cart-btn').addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.rx-detect-checkbox:checked');
    checkboxes.forEach(chk => {
      const test = MOCK_TESTS.find(t => t.id === chk.value);
      if (test && !AppState.cart.some(i => i.id === test.id)) {
        AppState.cart.push({ id: test.id, title: test.name, price: test.price, type: 'test', fasting: test.fastingRequired });
      }
    });
    updateCartStorage();
    closeRxModal();
    openCartDrawer();
    showToast("Selected prescription tests added to your health cart!", "success");
  });
}

// ==================== PATIENT REPORTS VAULT & VIEWER ====================
function openReportsModal() {
  renderReportsList();
  renderReportDetail(0);
  document.getElementById('reports-modal').classList.remove('hidden');
}

function closeReportsModal() {
  document.getElementById('reports-modal').classList.add('hidden');
}

function bindReportsEvents() {
  document.getElementById('reports-modal-close-btn').addEventListener('click', closeReportsModal);
  document.getElementById('reports-patient-selector').addEventListener('change', (e) => {
    const index = parseInt(e.target.value);
    AppState.selectedReportIndex = index;
    renderReportDetail(index);
  });
}

function renderReportsList() {
  const container = document.getElementById('reports-list-container');
  if (!container) return;

  container.innerHTML = MOCK_PATIENT_REPORTS.map((r, index) => `
    <div class="report-summary-card ${AppState.selectedReportIndex === index ? 'active' : ''}" onclick="selectReport(${index})">
      <span class="acc-num">${r.accessionNumber}</span>
      <h4>${r.testTitle}</h4>
      <span>Patient: ${r.patientName}</span>
    </div>
  `).join('');
}

function selectReport(index) {
  AppState.selectedReportIndex = index;
  renderReportsList();
  renderReportDetail(index);
}

function renderReportDetail(index) {
  const pane = document.getElementById('report-detail-pane');
  const rep = MOCK_PATIENT_REPORTS[index];
  if (!pane || !rep) return;

  pane.innerHTML = `
    <div class="report-meta-box">
      <div><span>Accession #</span><strong>${rep.accessionNumber}</strong></div>
      <div><span>Patient Name</span><strong>${rep.patientName} (${rep.patientAge}y/${rep.patientGender[0]})</strong></div>
      <div><span>Collection Date</span><strong>${rep.orderDate}</strong></div>
      <div><span>Referring Physician</span><strong>${rep.referringDoctor}</strong></div>
    </div>
    <div class="alert-box" style="background:#E6F4F4; padding:12px; border-radius:6px; font-size:13px; color:var(--primary);">
      <strong>Clinical Summary:</strong> ${rep.overallSummary}
    </div>
    <div class="table-responsive">
      <table class="parameters-table">
        <thead>
          <tr>
            <th>Biomarker / Parameter</th>
            <th>Observed Value</th>
            <th>Reference Range</th>
            <th>Status Flag</th>
          </tr>
        </thead>
        <tbody>
          ${rep.parameters.map(p => `
            <tr>
              <td><strong>${p.name}</strong></td>
              <td>${p.value} ${p.unit}</td>
              <td>${p.normalMin} - ${p.normalMax} ${p.unit}</td>
              <td>
                <span class="status-pill ${p.status === 'NORMAL' ? 'normal' : p.status === 'HIGH' ? 'high' : 'in-progress'}">
                  ${p.status}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div class="report-actions-row">
      <button class="btn btn-outline" id="report-share-btn">Copy Secure Share Link</button>
      <button class="btn btn-primary" id="report-print-btn">Print Official Report (PDF)</button>
    </div>
  `;

  document.getElementById('report-share-btn').addEventListener('click', () => {
    navigator.clipboard?.writeText(`https://auracare-labs.com/report/view?accession=${rep.accessionNumber}`);
    showToast("Secure doctor share link copied to clipboard", "success");
  });

  document.getElementById('report-print-btn').addEventListener('click', () => {
    window.print();
  });
}

// ==================== LIVE PHLEBOTOMIST TRACKER ====================
function openTrackerModal() {
  document.getElementById('tracker-modal').classList.remove('hidden');
}

function closeTrackerModal() {
  document.getElementById('tracker-modal').classList.add('hidden');
}

function bindTrackerEvents() {
  document.getElementById('tracker-modal-close-btn').addEventListener('click', closeTrackerModal);
  document.getElementById('tracker-search-btn').addEventListener('click', () => {
    const id = document.getElementById('tracker-booking-id-input').value.trim();
    if (id) {
      showToast(`Loaded live order tracking for ID: ${id}`, 'success');
      document.getElementById('track-display-id').textContent = `Booking ID: ${id}`;
    }
  });

  document.getElementById('tracker-action-view-report').addEventListener('click', () => {
    closeTrackerModal();
    openReportsModal();
  });
}

// ==================== PACKAGE COMPARISON MODAL ====================
function bindComparisonEvents() {
  const compareModal = document.getElementById('compare-modal');
  const compareBtn = document.getElementById('compare-packages-btn');
  const closeBtn = document.getElementById('compare-modal-close-btn');

  compareBtn.addEventListener('click', () => {
    renderComparisonTable();
    compareModal.classList.remove('hidden');
  });

  closeBtn.addEventListener('click', () => {
    compareModal.classList.add('hidden');
  });

  compareModal.addEventListener('click', (e) => {
    if (e.target === compareModal) compareModal.classList.add('hidden');
  });
}

function renderComparisonTable() {
  const table = document.getElementById('comparison-table-element');
  if (!table) return;

  table.innerHTML = `
    <thead>
      <tr>
        <th>Package Feature</th>
        ${MOCK_PACKAGES.map(p => `<th>${p.name}<br><span style="font-size:11px; color:#93C5FD;">$${p.discountedPrice.toFixed(2)}</span></th>`).join('')}
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Total Parameters</strong></td>
        ${MOCK_PACKAGES.map(p => `<td>${p.testCount} Tests</td>`).join('')}
      </tr>
      <tr>
        <td><strong>Recommended Age / Profile</strong></td>
        ${MOCK_PACKAGES.map(p => `<td>${p.recommendedFor}</td>`).join('')}
      </tr>
      <tr>
        <td><strong>Fasting Requirement</strong></td>
        ${MOCK_PACKAGES.map(p => `<td>${p.fasting}</td>`).join('')}
      </tr>
      <tr>
        <td><strong>Action</strong></td>
        ${MOCK_PACKAGES.map(p => `<td><button class="btn btn-primary btn-sm" onclick="toggleCartItem('${p.id}', '${p.name.replace(/'/g, "\\'")}', ${p.discountedPrice}, true)">Add Package</button></td>`).join('')}
      </tr>
    </tbody>
  `;
}
