/**
 * OneDignostic - Application State Management (`js/state.js`)
 * Author: Robin (Architect) & Shanks (Builder)
 */

window.AppState = {
  // Search & Filter State
  activeCategory: 'all',        // 'all' | 'blood' | 'radiology' | 'cardiac' | 'diabetes' | 'women' | 'senior'
  searchQuery: '',              // Filter test names and packages
  selectedTab: 'tests',         // 'tests' | 'packages'
  
  // Cart State (stored in localStorage under 'one_dignostic_cart')
  cart: [],
  
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
    bookingSlot: '07:00 AM - 09:00 AM',
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

// Storage helper functions
window.StorageService = {
  loadCart() {
    try {
      const stored = localStorage.getItem('one_dignostic_cart');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error loading cart from localStorage', e);
      return [];
    }
  },
  saveCart(cart) {
    try {
      localStorage.setItem('one_dignostic_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  },
  saveOrder(order) {
    try {
      const orders = JSON.parse(localStorage.getItem('one_dignostic_orders') || '[]');
      orders.push(order);
      localStorage.setItem('one_dignostic_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving order', e);
    }
  }
};
