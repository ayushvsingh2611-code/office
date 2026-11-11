/**
 * OneDignostic - Mock Data Store (`js/data.js`)
 * Author: Robin (Group 2 - Architect) & Shanks (Group 2 - Builder)
 * Version: 1.0.0
 */

window.DiagnosticData = {
  // Categories
  categories: [
    { slug: 'all', name: 'All Tests & Scans', icon: 'fa-border-all' },
    { slug: 'blood', name: 'Blood Pathology', icon: 'fa-droplet' },
    { slug: 'radiology', name: 'Radiology & Scans', icon: 'fa-x-ray' },
    { slug: 'cardiac', name: 'Cardiac Care', icon: 'fa-heart-pulse' },
    { slug: 'diabetes', name: 'Diabetes Panel', icon: 'fa-cubes' },
    { slug: 'women', name: 'Women Wellness', icon: 'fa-venus' },
    { slug: 'senior', name: 'Senior Care', icon: 'fa-user-shield' }
  ],

  // 12 Diagnostic Tests
  tests: [
    {
      id: 't-cbc-01',
      name: 'Complete Blood Count (CBC)',
      category: 'blood',
      description: 'Measures several components and features of your blood, including red blood cells, white blood cells, and platelets. Essential for overall health screening.',
      price: 25,
      originalPrice: 45,
      sampleType: 'Blood',
      fastingReq: 'No fasting required',
      tat: 'Same Day (6 hrs)',
      parametersCount: 24,
      parametersList: ['Hemoglobin (Hb)', 'Total WBC Count', 'Platelet Count', 'RBC Count', 'Hematocrit (PCV)', 'MCV, MCH, MCHC', 'Differential Leukocyte Count', 'ESR'],
      isPopular: true,
      homeCollectionAvailable: true
    },
    {
      id: 't-lipid-02',
      name: 'Lipid Profile Comprehensive',
      category: 'cardiac',
      description: 'Evaluates your risk of cardiovascular disease by measuring cholesterol and triglyceride levels in your bloodstream.',
      price: 35,
      originalPrice: 65,
      sampleType: 'Blood',
      fastingReq: '10-12 hours fasting required',
      tat: '24 Hours',
      parametersCount: 8,
      parametersList: ['Total Cholesterol', 'Triglycerides', 'HDL Cholesterol', 'LDL Cholesterol', 'VLDL Cholesterol', 'TC/HDL Ratio', 'LDL/HDL Ratio', 'Non-HDL Cholesterol'],
      isPopular: true,
      homeCollectionAvailable: true
    },
    {
      id: 't-hba1c-03',
      name: 'HbA1c (Glycated Hemoglobin)',
      category: 'diabetes',
      description: 'Provides average blood sugar levels over the past 3 months. Gold standard test for diagnosing and monitoring diabetes mellitus.',
      price: 28,
      originalPrice: 50,
      sampleType: 'Blood',
      fastingReq: 'No fasting required',
      tat: '24 Hours',
      parametersCount: 2,
      parametersList: ['Estimated Average Glucose (eAG)', 'HbA1c Percentage'],
      isPopular: true,
      homeCollectionAvailable: true
    },
    {
      id: 't-thyroid-04',
      name: 'Thyroid Profile (T3, T4, TSH)',
      category: 'blood',
      description: 'Assesses thyroid gland function to detect hypothyroidism or hyperthyroidism, regulating metabolism and energy.',
      price: 30,
      originalPrice: 60,
      sampleType: 'Blood',
      fastingReq: 'No fasting required',
      tat: '24 Hours',
      parametersCount: 3,
      parametersList: ['Triiodothyronine (T3)', 'Thyroxine (T4)', 'Thyroid Stimulating Hormone (TSH)'],
      isPopular: true,
      homeCollectionAvailable: true
    },
    {
      id: 't-lft-05',
      name: 'Liver Function Test (LFT)',
      category: 'blood',
      description: 'Checks liver health by measuring enzymes, proteins, and bilirubin levels to screen for hepatitis, liver damage, or fatty liver.',
      price: 38,
      originalPrice: 75,
      sampleType: 'Blood',
      fastingReq: '8-10 hours fasting recommended',
      tat: '24 Hours',
      parametersCount: 11,
      parametersList: ['Serum Bilirubin (Total/Direct)', 'SGOT (AST)', 'SGPT (ALT)', 'Alkaline Phosphatase (ALP)', 'Total Protein', 'Albumin', 'Globulin', 'A/G Ratio'],
      isPopular: false,
      homeCollectionAvailable: true
    },
    {
      id: 't-kft-06',
      name: 'Kidney Function Test (KFT / RFT)',
      category: 'blood',
      description: 'Evaluates renal efficiency by measuring urea, creatinine, uric acid, and key electrolytes in the bloodstream.',
      price: 35,
      originalPrice: 70,
      sampleType: 'Blood',
      fastingReq: 'No strict fasting required',
      tat: '24 Hours',
      parametersCount: 9,
      parametersList: ['Serum Creatinine', 'Blood Urea Nitrogen (BUN)', 'BUN/Creatinine Ratio', 'Uric Acid', 'Serum Calcium', 'Sodium', 'Potassium', 'Chloride'],
      isPopular: false,
      homeCollectionAvailable: true
    },
    {
      id: 't-vitd-07',
      name: 'Vitamin D 25-Hydroxy',
      category: 'senior',
      description: 'Measures vitamin D levels in blood to evaluate bone strength, immunity, fatigue causes, and calcium absorption.',
      price: 45,
      originalPrice: 90,
      sampleType: 'Blood',
      fastingReq: 'No fasting required',
      tat: '24 Hours',
      parametersCount: 1,
      parametersList: ['25-Hydroxyvitamin D Total'],
      isPopular: true,
      homeCollectionAvailable: true
    },
    {
      id: 't-vitb12-08',
      name: 'Vitamin B12 Serum',
      category: 'senior',
      description: 'Essential for nerve function, red blood cell production, and neurological health. Detects deficiency causing numbness or fatigue.',
      price: 40,
      originalPrice: 80,
      sampleType: 'Blood',
      fastingReq: 'No fasting required',
      tat: '24 Hours',
      parametersCount: 1,
      parametersList: ['Vitamin B12 Concentration'],
      isPopular: false,
      homeCollectionAvailable: true
    },
    {
      id: 't-hrct-09',
      name: 'High-Resolution Chest CT Scan (HRCT)',
      category: 'radiology',
      description: 'Detailed cross-sectional imaging of lung parenchyma, airways, and mediastinum using advanced 128-slice CT scanner.',
      price: 120,
      originalPrice: 200,
      sampleType: 'Imaging',
      fastingReq: 'No fasting required',
      tat: 'Same Day (6 hrs)',
      parametersCount: 1,
      parametersList: ['Radiologist Interpretation Report', 'DICOM Image CD/Cloud Link'],
      isPopular: false,
      homeCollectionAvailable: false
    },
    {
      id: 't-xray-10',
      name: 'Digital Chest X-Ray PA View',
      category: 'radiology',
      description: 'Low-radiation imaging to evaluate heart size, lung fields, pleura, and thoracic cage bony structures.',
      price: 30,
      originalPrice: 55,
      sampleType: 'Imaging',
      fastingReq: 'No fasting required',
      tat: 'Same Day (4 hrs)',
      parametersCount: 1,
      parametersList: ['Chest Radiograph Report', 'Digital Film'],
      isPopular: false,
      homeCollectionAvailable: false
    },
    {
      id: 't-usg-11',
      name: 'Abdomen & Pelvis Ultrasound (USG)',
      category: 'radiology',
      description: 'Non-invasive sonography examining liver, gallbladder, pancreas, spleen, kidneys, urinary bladder, and pelvic organs.',
      price: 75,
      originalPrice: 130,
      sampleType: 'Imaging',
      fastingReq: '4-6 hours fasting required',
      tat: 'Same Day (6 hrs)',
      parametersCount: 8,
      parametersList: ['Liver Echotexture', 'Gallbladder & Biliary Tree', 'Kidneys Size & Cortical Echo', 'Pancreas & Spleen', 'Pelvic Organ Assessment'],
      isPopular: true,
      homeCollectionAvailable: false
    },
    {
      id: 't-ecg-12',
      name: 'Electrocardiogram (12-Lead ECG)',
      category: 'cardiac',
      description: 'Records electrical activity of the heart over time to detect arrhythmias, ischemic heart disease, and conduction abnormalities.',
      price: 25,
      originalPrice: 45,
      sampleType: 'Imaging',
      fastingReq: 'No fasting required',
      tat: 'Same Day (2 hrs)',
      parametersCount: 5,
      parametersList: ['Heart Rate & Rhythm', 'PR Interval & QT Duration', 'ST Segment Analysis', 'Axis Deviation Report', 'Cardiologist Sign-off'],
      isPopular: false,
      homeCollectionAvailable: true
    }
  ],

  // 4 Health Packages
  packages: [
    {
      id: 'pkg-basic-01',
      title: 'OneDignostic Basic Health Shield',
      targetAudience: 'Adults 20-40 yrs, General Screening',
      price: 59,
      originalPrice: 120,
      totalTestsIncluded: 45,
      includedCategories: ['CBC', 'Lipid Profile', 'Fasting Blood Sugar', 'Liver Function (LFT)', 'Kidney Function (KFT)'],
      fastingReq: '10-12 hours fasting required',
      reportTat: '24 Hours',
      badge: 'POPULAR'
    },
    {
      id: 'pkg-active-02',
      title: 'OneDignostic Active Health Executive',
      targetAudience: 'Working Professionals 30-50 yrs',
      price: 99,
      originalPrice: 210,
      totalTestsIncluded: 72,
      includedCategories: ['CBC', 'Lipid Profile', 'HbA1c', 'Thyroid (TSH)', 'LFT', 'KFT', 'Vitamin D & B12', 'Urine Routine'],
      fastingReq: '10-12 hours fasting required',
      reportTat: '24 Hours',
      badge: 'RECOMMENDED'
    },
    {
      id: 'pkg-gold-03',
      title: 'Comprehensive Full Body Checkup - Gold',
      targetAudience: 'Adults 40+ yrs, Complete Wellness',
      price: 149,
      originalPrice: 320,
      totalTestsIncluded: 95,
      includedCategories: ['CBC', 'Lipid Profile', 'HbA1c', 'Thyroid Profile', 'LFT', 'KFT', 'Vitamin D & B12', 'Iron Profile', 'ECG', 'Abdomen USG'],
      fastingReq: '10-12 hours fasting required',
      reportTat: '24 - 36 Hours',
      badge: 'BESTSELLER'
    },
    {
      id: 'pkg-senior-04',
      title: 'Senior Citizen Vital Care',
      targetAudience: 'Senior Citizens 60+ yrs',
      price: 189,
      originalPrice: 390,
      totalTestsIncluded: 102,
      includedCategories: ['Advanced Lipid', 'Cardiac Markers (hs-CRP)', 'HbA1c', 'Thyroid Panel', 'LFT', 'KFT', 'Bone Profile (Calcium/Vit D)', 'ECG', 'Chest X-Ray'],
      fastingReq: '10-12 hours fasting required',
      reportTat: '36 Hours',
      badge: 'SPECIALIZED'
    }
  ],

  // 3 Diagnostic Center Branches
  centers: [
    {
      id: 'branch-central',
      name: 'OneDignostic Flagship Super-Center',
      address: '742 Evergreen Terrace, Medical District',
      city: 'Metro Center',
      phone: '+1 (800) 555-0199',
      timing: 'Mon - Sat: 06:30 AM - 09:00 PM, Sun: 07:00 AM - 02:00 PM',
      facilities: ['Pathology', '3.0T MRI', '128-Slice CT', 'Ultrasound', 'Digital X-Ray', 'ECHO', 'ECG'],
      mapUrl: 'https://maps.google.com/?q=Medical+District+Metro+Center'
    },
    {
      id: 'branch-west',
      name: 'OneDignostic West Valley Imaging & Lab',
      address: '1044 Sunset Boulevard, Valley Plaza',
      city: 'West Valley',
      phone: '+1 (800) 555-0244',
      timing: 'Mon - Sat: 07:00 AM - 08:00 PM, Sun: 07:30 AM - 01:00 PM',
      facilities: ['Pathology', 'Ultrasound', 'Digital X-Ray', 'ECG', 'Home Collection Hub'],
      mapUrl: 'https://maps.google.com/?q=Sunset+Boulevard+West+Valley'
    },
    {
      id: 'branch-north',
      name: 'OneDignostic Northside Express Lab',
      address: '88 Oakridge Avenue, North Commercial',
      city: 'Northside',
      phone: '+1 (800) 555-0388',
      timing: 'Mon - Sat: 07:00 AM - 07:00 PM, Sun: Closed',
      facilities: ['Pathology Specimen Collection', 'Express Sample Drop', 'Routine Blood Tests'],
      mapUrl: 'https://maps.google.com/?q=Oakridge+Avenue+Northside'
    }
  ],

  // Pre-populated Patient Reports for Demo Testing
  reports: [
    {
      reportId: 'REP-1001',
      patientName: 'John Doe',
      phone: '9876543210',
      testName: 'Complete Blood Count (CBC)',
      collectionDate: '2025-05-01',
      status: 'Ready',
      doctorName: 'Dr. Robert Chen, MD (Pathology)',
      downloadUrl: 'report-rep-1001.pdf',
      results: [
        { parameter: 'Hemoglobin (Hb)', value: '14.2 g/dL', referenceRange: '13.0 - 17.0 g/dL', status: 'Normal' },
        { parameter: 'Total WBC Count', value: '7,400 /μL', referenceRange: '4,000 - 11,000 /μL', status: 'Normal' },
        { parameter: 'Platelet Count', value: '250,000 /μL', referenceRange: '150,000 - 410,000 /μL', status: 'Normal' },
        { parameter: 'ESR (Erythrocyte Sedimentation Rate)', value: '12 mm/hr', referenceRange: '0 - 15 mm/hr', status: 'Normal' }
      ]
    },
    {
      reportId: 'REP-1002',
      patientName: 'John Doe',
      phone: '9876543210',
      testName: 'Lipid Profile Comprehensive',
      collectionDate: '2025-05-01',
      status: 'Ready',
      doctorName: 'Dr. Sarah Jenkins, MD (Biochemistry)',
      downloadUrl: 'report-rep-1002.pdf',
      results: [
        { parameter: 'Total Cholesterol', value: '195 mg/dL', referenceRange: '< 200 mg/dL', status: 'Normal' },
        { parameter: 'Triglycerides', value: '165 mg/dL', referenceRange: '< 150 mg/dL', status: 'High' },
        { parameter: 'HDL Cholesterol', value: '48 mg/dL', referenceRange: '> 40 mg/dL', status: 'Normal' },
        { parameter: 'LDL Cholesterol', value: '114 mg/dL', referenceRange: '< 100 mg/dL', status: 'High' }
      ]
    },
    {
      reportId: 'REP-2045',
      patientName: 'Emily Watson',
      phone: '5551234567',
      testName: 'Thyroid Profile (T3, T4, TSH)',
      collectionDate: '2025-05-03',
      status: 'Processing',
      doctorName: 'Dr. Robert Chen, MD (Pathology)',
      downloadUrl: '',
      results: [
        { parameter: 'Triiodothyronine (T3)', value: 'Pending', referenceRange: '0.8 - 2.0 ng/mL', status: 'Normal' },
        { parameter: 'Thyroxine (T4)', value: 'Pending', referenceRange: '5.1 - 14.1 μg/dL', status: 'Normal' },
        { parameter: 'Thyroid Stimulating Hormone (TSH)', value: 'Pending', referenceRange: '0.4 - 4.0 mIU/L', status: 'Normal' }
      ]
    }
  ]
};
