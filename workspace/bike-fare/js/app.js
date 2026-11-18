/**
 * Apex MotoVault - Flagship Motorcycle Marketplace Platform
 * Complete Production-Ready Application Script
 */

// 1. Production Motorcycle Dataset (10 Distinct Performance Models)
const INITIAL_BIKES_DATA = [
  {
    id: "bike-001",
    make: "Ducati",
    model: "Panigale V4 S",
    year: 2024,
    condition: "New",
    category: "Sportbike",
    price: 31995,
    originalPrice: 32995,
    monthlyPayment: 489,
    mileage: 12,
    engine: "Desmosedici Stradale 90° V4",
    displacement: "1,103 cc",
    displacementNumber: 1103,
    horsepower: 215.5,
    torque: "91.2 lb-ft @ 10,000 RPM",
    weight: "431 lbs (wet)",
    seatHeight: "32.9 in",
    fuelCapacity: "4.49 gal",
    topSpeed: "186+ mph",
    transmission: "6-speed w/ DQS EVO 2 Quickshifter",
    color: "Ducati Red with Dark Stealth Wheels",
    audioProfile: "v4-screamer",
    badge: "Track Ready",
    featured: true,
    rating: 4.9,
    reviewsCount: 38,
    location: "Miami Flagship Vault, FL",
    dealerName: "Apex Performance Vault",
    images: [
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80"
    ],
    features: ["Öhlins Smart EC 2.0 Suspension", "Brembo Stylema Calipers", "Cornering ABS EVO", "Ducati Traction Control (DTC) EVO 3", "Riding Modes: Race A/Race B/Sport/Street", "5-inch Full TFT Display"]
  },
  {
    id: "bike-002",
    make: "Yamaha",
    model: "YZF-R1 World GP 60th Anniversary",
    year: 2024,
    condition: "New",
    category: "Sportbike",
    price: 18699,
    originalPrice: 19199,
    monthlyPayment: 295,
    mileage: 5,
    engine: "Crossplane Inline-4 (CP4)",
    displacement: "998 cc",
    displacementNumber: 998,
    horsepower: 198.0,
    torque: "83.1 lb-ft @ 11,500 RPM",
    weight: "448 lbs",
    seatHeight: "33.7 in",
    fuelCapacity: "4.50 gal",
    topSpeed: "186 mph",
    transmission: "6-speed with QSS (Up & Down)",
    color: "Historic White & Red Chain Block",
    audioProfile: "inline4-crossplane",
    badge: "Limited Edition",
    featured: true,
    rating: 4.8,
    reviewsCount: 52,
    location: "Austin Supercenter, TX",
    dealerName: "Apex Southwest",
    images: [
      "https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80"
    ],
    features: ["MotoGP-Derived Crossplane Crankshaft", "Cable-less Ride-by-Wire (APSG)", "Titanium Intake Valves", "KYB Fully Adjustable Suspension", "Lean-Sensitive Traction Control", "Slide Control System (SCS)"]
  },
  {
    id: "bike-003",
    make: "Harley-Davidson",
    model: "Street Glide ST Special",
    year: 2023,
    condition: "Certified Pre-Owned",
    category: "Cruiser",
    price: 24999,
    originalPrice: 29990,
    monthlyPayment: 382,
    mileage: 3450,
    engine: "Milwaukee-Eight 117 V-Twin",
    displacement: "1,923 cc",
    displacementNumber: 1923,
    horsepower: 106.0,
    torque: "127.0 lb-ft @ 3,750 RPM",
    weight: "814 lbs",
    seatHeight: "26.8 in",
    fuelCapacity: "6.00 gal",
    topSpeed: "115 mph",
    transmission: "6-Speed Cruise Drive",
    color: "Gunship Gray with Bronze Trim",
    audioProfile: "vtwin-heavy",
    badge: "Certified Pre-Owned",
    featured: true,
    rating: 4.9,
    reviewsCount: 44,
    location: "Nashville Moto Hub, TN",
    dealerName: "Apex Heritage Motors",
    images: [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558981420-87aa92103a5a?auto=format&fit=crop&w=1200&q=80"
    ],
    features: ["Boom! Box GTS Infotainment Touchscreen", "Reflex Defensive Rider Systems (RDRS)", "Screamin' Eagle Heavy Breather Intake", "Stretched Saddlebags with Keyless Lock", "Daymaker LED Headlamp", "Cruise Control"]
  },
  {
    id: "bike-004",
    make: "BMW",
    model: "R 1250 GS Adventure Trophy",
    year: 2024,
    condition: "New",
    category: "Adventure",
    price: 24895,
    originalPrice: 25495,
    monthlyPayment: 375,
    mileage: 0,
    engine: "Boxer Twin w/ BMW ShiftCam",
    displacement: "1,254 cc",
    displacementNumber: 1254,
    horsepower: 136.0,
    torque: "105.0 lb-ft @ 6,250 RPM",
    weight: "591 lbs",
    seatHeight: "35.0 in",
    fuelCapacity: "7.90 gal (Long Range)",
    topSpeed: "135 mph",
    transmission: "6-speed w/ Gear Shift Assist Pro",
    color: "Gravity Blue Metallic Matt",
    audioProfile: "boxer-twin",
    badge: "Globe Trotter",
    featured: true,
    rating: 5.0,
    reviewsCount: 61,
    location: "Denver Mountain Hub, CO",
    dealerName: "Apex Alpine Adventure",
    images: [
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80"
    ],
    features: ["Dynamic Electronic Suspension Adjustment (ESA)", "Enduro Pro Ride Mode", "Aluminum Hard Pannier Mounts", "TFT Connectivity with GPS", "Adaptive Headlight with Swivel", "Heated Grips & Hill Start Assist"]
  },
  {
    id: "bike-005",
    make: "Kawasaki",
    model: "Ninja ZX-10R KRT Edition",
    year: 2024,
    condition: "New",
    category: "Sportbike",
    price: 17399,
    originalPrice: 17899,
    monthlyPayment: 265,
    mileage: 18,
    engine: "Liquid-Cooled 16-Valve Inline-4",
    displacement: "998 cc",
    displacementNumber: 998,
    horsepower: 203.0,
    torque: "84.6 lb-ft @ 11,300 RPM",
    weight: "456 lbs",
    seatHeight: "32.9 in",
    fuelCapacity: "4.50 gal",
    topSpeed: "186 mph",
    transmission: "Cassette 6-speed with KQS",
    color: "Lime Green / Ebony",
    audioProfile: "inline4-screamer",
    badge: "WSBK Champion",
    featured: false,
    rating: 4.7,
    reviewsCount: 29,
    location: "Los Angeles Flagship, CA",
    dealerName: "Apex West Coast",
    images: [
      "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?auto=format&fit=crop&w=1200&q=80"
    ],
    features: ["Integrated Aerodynamic Winglets", "Öhlins Electronic Steering Damper", "Kawasaki Launch Control Mode (KLCM)", "Sport-Kawasaki Traction Control (S-KTRC)", "Cruise Control", "Full TFT Instrument Panel"]
  },
  {
    id: "bike-006",
    make: "Triumph",
    model: "Speed Triple 1200 RS",
    year: 2024,
    condition: "New",
    category: "Naked",
    price: 18895,
    originalPrice: 19495,
    monthlyPayment: 288,
    mileage: 4,
    engine: "Liquid-Cooled 12-Valve DOHC Inline 3-Cylinder",
    displacement: "1,160 cc",
    displacementNumber: 1160,
    horsepower: 177.5,
    torque: "92.0 lb-ft @ 9,000 RPM",
    weight: "437 lbs",
    seatHeight: "32.7 in",
    fuelCapacity: "4.10 gal",
    topSpeed: "165 mph",
    transmission: "6-speed with Triumph Shift Assist",
    color: "Matt Silver Ice & Yellow Accents",
    audioProfile: "triple-growl",
    badge: "Street Fighter",
    featured: true,
    rating: 4.9,
    reviewsCount: 33,
    location: "Chicago Metro Vault, IL",
    dealerName: "Apex Midwest",
    images: [
      "https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80"
    ],
    features: ["Öhlins NIX30 Forks & TTX36 Shock", "Brembo Stylema Monobloc Calipers", "Keyless Ignition", "5 Ride Modes", "Carbon Fiber Front Mudguard", "My Triumph Connectivity System"]
  },
  {
    id: "bike-007",
    make: "Honda",
    model: "CBR1000RR-R Fireblade SP",
    year: 2023,
    condition: "Certified Pre-Owned",
    category: "Sportbike",
    price: 26500,
    originalPrice: 28900,
    monthlyPayment: 399,
    mileage: 1820,
    engine: "16-Valve DOHC Inline-4",
    displacement: "999 cc",
    displacementNumber: 999,
    horsepower: 214.0,
    torque: "83.0 lb-ft @ 12,500 RPM",
    weight: "443 lbs",
    seatHeight: "32.7 in",
    fuelCapacity: "4.25 gal",
    topSpeed: "186+ mph",
    transmission: "6-speed w/ Quickshifter",
    color: "Grand Prix Red HRC Tricolor",
    audioProfile: "inline4-screamer",
    badge: "HRC Certified",
    featured: false,
    rating: 4.8,
    reviewsCount: 19,
    location: "Austin Supercenter, TX",
    dealerName: "Apex Southwest",
    images: [
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=1200&q=80"
    ],
    features: ["MotoGP Winglet Aero Downforce", "Öhlins NPX Smart-EC Fork", "Akrapovič Titanium Factory Muffler", "Brembo Stylema Master Cylinder", "HSTC Traction Control", "Launch Control"]
  },
  {
    id: "bike-008",
    make: "KTM",
    model: "1290 Super Duke R Evo 'The Beast'",
    year: 2024,
    condition: "New",
    category: "Naked",
    price: 20499,
    originalPrice: 20999,
    monthlyPayment: 312,
    mileage: 8,
    engine: "LC8 75° V-Twin DOHC",
    displacement: "1,301 cc",
    displacementNumber: 1301,
    horsepower: 180.0,
    torque: "103.0 lb-ft @ 8,000 RPM",
    weight: "441 lbs",
    seatHeight: "32.8 in",
    fuelCapacity: "4.20 gal",
    topSpeed: "180 mph",
    transmission: "PANKL 6-speed w/ Quickshifter+",
    color: "Signature KTM Orange / Stealth Black",
    audioProfile: "vtwin-heavy",
    badge: "The Beast",
    featured: true,
    rating: 4.9,
    reviewsCount: 41,
    location: "Miami Flagship Vault, FL",
    dealerName: "Apex Performance Vault",
    images: [
      "https://images.unsplash.com/photo-1558981420-87aa92103a5a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1200&q=80"
    ],
    features: ["WP Semi-Active Technology (SAT) Suspension", "Anti-Dive Function", "Track Mode with 9-Level Spin Adjust", "Supermoto ABS Mode", "Cruise Control & TPMS", "Ultralight Trellis Frame"]
  },
  {
    id: "bike-009",
    make: "Indian Motorcycle",
    model: "Scout Bobber Twenty",
    year: 2024,
    condition: "New",
    category: "Cruiser",
    price: 13249,
    originalPrice: 13999,
    monthlyPayment: 215,
    mileage: 0,
    engine: "Liquid-Cooled 60° V-Twin",
    displacement: "1,133 cc",
    displacementNumber: 1133,
    horsepower: 100.0,
    torque: "72.0 lb-ft @ 5,900 RPM",
    weight: "553 lbs",
    seatHeight: "25.6 in",
    fuelCapacity: "3.30 gal",
    topSpeed: "125 mph",
    transmission: "6-Speed Manual",
    color: "Stealth Smoke / Chrome Spoke Wheels",
    audioProfile: "vtwin-heavy",
    badge: "Heritage Bobber",
    featured: false,
    rating: 4.7,
    reviewsCount: 37,
    location: "Nashville Moto Hub, TN",
    dealerName: "Apex Heritage Motors",
    images: [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558981420-87aa92103a5a?auto=format&fit=crop&w=1200&q=80"
    ],
    features: ["Mini-Ape Hanger Handlebars", "Wire Spoke Wheels", "Floating Solo Leather Saddle", "Blacked-Out Dual Exhaust", "Low-Slung Stance", "USB Charging Port"]
  },
  {
    id: "bike-010",
    make: "Suzuki",
    model: "Hayabusa 25th Anniversary Edition",
    year: 2024,
    condition: "New",
    category: "Sportbike",
    price: 19599,
    originalPrice: 20199,
    monthlyPayment: 299,
    mileage: 2,
    engine: "1,340 cc DOHC 4-Cylinder",
    displacement: "1,340 cc",
    displacementNumber: 1340,
    horsepower: 190.0,
    torque: "110.6 lb-ft @ 7,000 RPM",
    weight: "582 lbs",
    seatHeight: "31.5 in",
    fuelCapacity: "5.30 gal",
    topSpeed: "186 mph",
    transmission: "6-speed with Bi-Directional Quickshifter",
    color: "Glass Blaze Orange / Glass Sparkle Black",
    audioProfile: "inline4-screamer",
    badge: "Hyperbike Legend",
    featured: true,
    rating: 4.9,
    reviewsCount: 78,
    location: "Los Angeles Flagship, CA",
    dealerName: "Apex West Coast",
    images: [
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?auto=format&fit=crop&w=1200&q=80"
    ],
    features: ["Suzuki Intelligent Ride System (S.I.R.S.)", "Launch Control System (3 Modes)", "Active Speed Limiter", "Brembo Stylema Front Calipers", "Anniversary Gold Anodized Rotors & Chain Adjuster", "Motion Track Brake System"]
  }
];

// 2. Global State Management with LocalStorage Persistence
const state = {
  bikes: [...INITIAL_BIKES_DATA],
  selectedCategory: "All",
  selectedMake: "All",
  selectedCondition: "All",
  maxPrice: 35000,
  searchQuery: "",
  sortBy: "featured",
  wishlist: JSON.parse(localStorage.getItem("apex_wishlist") || "[]"),
  cart: JSON.parse(localStorage.getItem("apex_cart") || "[]"),
  compare: JSON.parse(localStorage.getItem("apex_compare") || "[]"),
  activeBikeForModal: null,
  activeAudioOscillator: null,
  audioCtx: null
};

// 3. Web Audio API Engine Exhaust Sound Synthesizer
function playExhaustSound(audioProfile, bikeTitle, engineDesc) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      showToast("Web Audio not supported in this browser.", "info");
      return;
    }

    if (!state.audioCtx) {
      state.audioCtx = new AudioContext();
    }
    const ctx = state.audioCtx;
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    // Stop previous sound if playing
    if (state.activeAudioOscillator) {
      try {
        state.activeAudioOscillator.stop();
        state.activeAudioOscillator.disconnect();
      } catch (e) { /* ignore */ }
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    let baseFreq = 65;
    let waveType = "sawtooth";
    let revFreq = 260;

    if (audioProfile === "v4-screamer") {
      baseFreq = 80;
      waveType = "sawtooth";
      revFreq = 340;
    } else if (audioProfile === "inline4-screamer") {
      baseFreq = 95;
      waveType = "sawtooth";
      revFreq = 420;
    } else if (audioProfile === "vtwin-heavy") {
      baseFreq = 45;
      waveType = "square";
      revFreq = 160;
    } else if (audioProfile === "boxer-twin") {
      baseFreq = 55;
      waveType = "triangle";
      revFreq = 210;
    } else if (audioProfile === "triple-growl") {
      baseFreq = 75;
      waveType = "sawtooth";
      revFreq = 310;
    }

    osc.type = waveType;
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    // Dynamic rev curve (idle -> acceleration rumble -> redline scream -> settle)
    osc.frequency.exponentialRampToValueAtTime(revFreq, ctx.currentTime + 1.2);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.4, ctx.currentTime + 2.5);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(3200, ctx.currentTime + 1.2);
    filter.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 2.5);

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.3);
    gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.8);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 2.8);
    state.activeAudioOscillator = osc;

    // Open Exhaust Modal
    const titleEl = document.getElementById("audio-modal-bike-title");
    const descEl = document.getElementById("audio-modal-engine-desc");
    if (titleEl) titleEl.textContent = bikeTitle || "Engine Acoustic Profile";
    if (descEl) descEl.textContent = engineDesc || "Synthesized RPM Acoustic Telemetry";
    openModal("exhaust-audio-modal");

    showToast(`🔊 Revving ${bikeTitle || "Exhaust"}!`, "success");
  } catch (err) {
    console.warn("Audio Synthesizer warning:", err);
  }
}

// 4. Core Rendering Engine
function renderBikes() {
  const grid = document.getElementById("bikes-grid");
  const counter = document.getElementById("results-counter");
  const noResults = document.getElementById("no-results-state");
  if (!grid) return;

  const filtered = state.bikes.filter((bike) => {
    const matchesCat = state.selectedCategory === "All" || bike.category.toLowerCase() === state.selectedCategory.toLowerCase();
    const matchesMake = state.selectedMake === "All" || bike.make.toLowerCase() === state.selectedMake.toLowerCase();
    const matchesCond = state.selectedCondition === "All" || bike.condition.toLowerCase().includes(state.selectedCondition.toLowerCase());
    const matchesPrice = bike.price <= state.maxPrice;
    const query = state.searchQuery.toLowerCase();
    const matchesSearch = !query ||
      bike.make.toLowerCase().includes(query) ||
      bike.model.toLowerCase().includes(query) ||
      bike.category.toLowerCase().includes(query) ||
      bike.engine.toLowerCase().includes(query);

    return matchesCat && matchesMake && matchesCond && matchesPrice && matchesSearch;
  });

  // Sort filtered bikes
  if (state.sortBy === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (state.sortBy === "power") {
    filtered.sort((a, b) => b.horsepower - a.horsepower);
  } else if (state.sortBy === "year") {
    filtered.sort((a, b) => b.year - a.year);
  }

  if (counter) {
    counter.textContent = `Showing ${filtered.length} of ${state.bikes.length} Motorcycles`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = "";
    if (noResults) noResults.classList.remove("hidden");
    return;
  }

  if (noResults) noResults.classList.add("hidden");

  grid.innerHTML = filtered.map((bike) => {
    const isWishlisted = state.wishlist.includes(bike.id);
    const isCompared = state.compare.includes(bike.id);
    const isReserved = state.cart.includes(bike.id);
    const mainImg = bike.images && bike.images[0] ? bike.images[0] : "";

    return `
      <article class="bike-card bg-surface-1 border border-subtle hover:border-primary/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col group" data-id="${bike.id}">
        <!-- Card Top & Badges -->
        <div class="relative overflow-hidden aspect-[16/10] bg-surface-2">
          <img src="${mainImg}" alt="${bike.year} ${bike.make} ${bike.model}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80'">
          <div class="absolute inset-0 bg-gradient-to-t from-surface-1 via-transparent to-black/40"></div>
          
          <!-- Badges -->
          <div class="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <span class="bg-primary/90 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-sm uppercase tracking-wider">${bike.badge}</span>
            <span class="bg-surface-3/90 text-main text-[11px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md border border-subtle">${bike.condition}</span>
          </div>

          <!-- Quick Action Buttons -->
          <div class="absolute top-3 right-3 flex flex-col gap-2 z-10">
            <button onclick="toggleWishlist('${bike.id}')" title="Save to Wishlist" class="w-8 h-8 rounded-full bg-surface-1/80 backdrop-blur-md hover:bg-primary text-${isWishlisted ? 'primary' : 'muted'} hover:text-white flex items-center justify-center transition-all border border-subtle shadow-md">
              <i class="fa-${isWishlisted ? 'solid' : 'regular'} fa-heart text-sm"></i>
            </button>
            <button onclick="toggleCompare('${bike.id}')" title="Compare Bike" class="w-8 h-8 rounded-full bg-surface-1/80 backdrop-blur-md hover:bg-surface-3 text-${isCompared ? 'accent' : 'muted'} hover:text-white flex items-center justify-center transition-all border border-subtle shadow-md">
              <i class="fa-solid fa-code-compare text-sm"></i>
            </button>
          </div>

          <!-- Sound Rev Trigger Overlay Button -->
          <button onclick="playExhaustSound('${bike.audioProfile}', '${bike.make} ${bike.model}', '${bike.engine}')" class="card-exhaust-sound-btn absolute bottom-3 right-3 bg-surface-2/90 hover:bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-xl backdrop-blur-md border border-subtle shadow-lg transition-all flex items-center gap-1.5">
            <i class="fa-solid fa-volume-high text-accent"></i>
            <span>Sound Rev</span>
          </button>
        </div>

        <!-- Card Body -->
        <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <div class="flex items-center justify-between text-xs text-muted mb-1 font-mono">
              <span>${bike.year} • ${bike.category}</span>
              <span class="text-accent flex items-center gap-1"><i class="fa-solid fa-star text-[10px]"></i> ${bike.rating} (${bike.reviewsCount})</span>
            </div>
            <h3 class="font-heading font-black text-lg text-white hover:text-primary transition-colors cursor-pointer" onclick="openBikeDetail('${bike.id}')">
              ${bike.make} ${bike.model}
            </h3>
            <p class="text-xs text-muted font-mono mt-1">${bike.engine}</p>
          </div>

          <!-- Spec Pill Grid -->
          <div class="grid grid-cols-3 gap-2 py-2 border-y border-subtle text-center text-xs">
            <div class="bg-surface-2/60 p-1.5 rounded-lg border border-subtle/50">
              <span class="text-dim text-[10px] block uppercase font-mono">Power</span>
              <strong class="text-main font-mono">${bike.horsepower} HP</strong>
            </div>
            <div class="bg-surface-2/60 p-1.5 rounded-lg border border-subtle/50">
              <span class="text-dim text-[10px] block uppercase font-mono">Displ.</span>
              <strong class="text-main font-mono">${bike.displacement}</strong>
            </div>
            <div class="bg-surface-2/60 p-1.5 rounded-lg border border-subtle/50">
              <span class="text-dim text-[10px] block uppercase font-mono">Weight</span>
              <strong class="text-main font-mono">${bike.weight.split(' ')[0]} lb</strong>
            </div>
          </div>

          <!-- Pricing & CTAs -->
          <div>
            <div class="flex items-baseline justify-between mb-3">
              <div>
                <span class="text-[10px] text-dim block uppercase font-mono">Vault Cash Price</span>
                <span class="font-heading font-black text-2xl text-white">$${bike.price.toLocaleString()}</span>
                ${bike.originalPrice > bike.price ? `<span class="text-xs text-dim line-through ml-1.5">$${bike.originalPrice.toLocaleString()}</span>` : ''}
              </div>
              <div class="text-right">
                <span class="text-[10px] text-dim block uppercase font-mono">Est. Finance</span>
                <span class="text-xs font-mono font-bold text-accent">$${bike.monthlyPayment}/mo</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <button onclick="openBikeDetail('${bike.id}')" class="w-full bg-surface-2 hover:bg-surface-3 text-white text-xs font-heading font-bold py-2.5 px-3 rounded-xl border border-subtle hover:border-border-active transition-all flex items-center justify-center gap-1.5">
                <i class="fa-solid fa-circle-info"></i>
                <span>Details</span>
              </button>
              <button onclick="reserveDeposit('${bike.id}')" class="w-full bg-${isReserved ? 'success' : 'primary'} hover:bg-${isReserved ? 'success/80' : 'primary-hover'} text-white text-xs font-heading font-bold py-2.5 px-3 rounded-xl transition-all shadow-neon flex items-center justify-center gap-1.5">
                <i class="fa-solid fa-${isReserved ? 'check' : 'cart-plus'}"></i>
                <span>${isReserved ? 'Reserved' : 'Deposit $500'}</span>
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// 5. Bike Detail Modal
function openBikeDetail(bikeId) {
  const bike = state.bikes.find((b) => b.id === bikeId);
  if (!bike) return;
  state.activeBikeForModal = bike;

  const modalBody = document.getElementById("detail-modal-body");
  if (!modalBody) return;

  const isReserved = state.cart.includes(bike.id);
  const isWishlisted = state.wishlist.includes(bike.id);

  modalBody.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Media Gallery -->
      <div class="lg:col-span-7 space-y-4">
        <div class="aspect-[16/10] rounded-2xl overflow-hidden bg-surface-2 border border-subtle relative shadow-2xl">
          <img id="detail-main-img" src="${bike.images[0]}" alt="${bike.model}" class="w-full h-full object-cover">
          <span class="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">${bike.badge}</span>
        </div>
        <div class="grid grid-cols-3 gap-3">
          ${bike.images.map((img, i) => `
            <img src="${img}" alt="Angle ${i+1}" onclick="document.getElementById('detail-main-img').src='${img}'" class="aspect-[16/10] rounded-xl object-cover border border-subtle hover:border-primary cursor-pointer transition-all">
          `).join("")}
        </div>

        <!-- Sound Simulation Widget Inside Detail Modal -->
        <div class="bg-surface-2/80 border border-subtle rounded-2xl p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center text-lg">
              <i class="fa-solid fa-volume-high"></i>
            </div>
            <div>
              <h4 class="text-sm font-bold text-white">Engine Acoustic Telemetry</h4>
              <p class="text-xs text-muted">${bike.engine}</p>
            </div>
          </div>
          <button onclick="playExhaustSound('${bike.audioProfile}', '${bike.make} ${bike.model}', '${bike.engine}')" class="bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2 px-4 rounded-xl transition-all shadow-neon flex items-center gap-2">
            <i class="fa-solid fa-play"></i>
            <span>Rev Sound</span>
          </button>
        </div>
      </div>

      <!-- Specs & Purchase Drawer -->
      <div class="lg:col-span-5 flex flex-col justify-between space-y-6">
        <div>
          <div class="flex items-center justify-between text-xs text-muted mb-2 font-mono">
            <span>${bike.year} • ${bike.condition} • ${bike.category}</span>
            <span class="text-accent"><i class="fa-solid fa-star"></i> ${bike.rating} (${bike.reviewsCount} reviews)</span>
          </div>
          <h2 class="font-heading font-black text-3xl text-white mb-1">${bike.make} ${bike.model}</h2>
          <p class="text-xs text-muted font-mono mb-4">Location: ${bike.location}</p>

          <div class="bg-surface-2 border border-border-active rounded-2xl p-4 mb-6">
            <span class="text-xs text-dim block font-mono uppercase">Vault Cash Price</span>
            <div class="flex items-baseline gap-3">
              <span class="font-heading font-black text-4xl text-primary">$${bike.price.toLocaleString()}</span>
              <span class="text-sm font-mono text-muted">Est. $${bike.monthlyPayment}/mo</span>
            </div>
          </div>

          <!-- Full Tech Specs -->
          <div class="space-y-2 text-xs font-mono">
            <div class="flex justify-between py-1.5 border-b border-subtle"><span class="text-dim">Engine:</span> <strong class="text-white">${bike.engine}</strong></div>
            <div class="flex justify-between py-1.5 border-b border-subtle"><span class="text-dim">Displacement:</span> <strong class="text-white">${bike.displacement}</strong></div>
            <div class="flex justify-between py-1.5 border-b border-subtle"><span class="text-dim">Horsepower:</span> <strong class="text-white">${bike.horsepower} HP</strong></div>
            <div class="flex justify-between py-1.5 border-b border-subtle"><span class="text-dim">Torque:</span> <strong class="text-white">${bike.torque}</strong></div>
            <div class="flex justify-between py-1.5 border-b border-subtle"><span class="text-dim">Top Speed:</span> <strong class="text-white">${bike.topSpeed}</strong></div>
            <div class="flex justify-between py-1.5 border-b border-subtle"><span class="text-dim">Wet Weight:</span> <strong class="text-white">${bike.weight}</strong></div>
            <div class="flex justify-between py-1.5 border-b border-subtle"><span class="text-dim">Seat Height:</span> <strong class="text-white">${bike.seatHeight}</strong></div>
            <div class="flex justify-between py-1.5 border-b border-subtle"><span class="text-dim">Fuel Tank:</span> <strong class="text-white">${bike.fuelCapacity}</strong></div>
            <div class="flex justify-between py-1.5"><span class="text-dim">Transmission:</span> <strong class="text-white">${bike.transmission}</strong></div>
          </div>
        </div>

        <!-- Action CTAs -->
        <div class="space-y-3 pt-4 border-t border-subtle">
          <button onclick="reserveDeposit('${bike.id}')" class="w-full bg-${isReserved ? 'success' : 'primary'} hover:bg-${isReserved ? 'success/80' : 'primary-hover'} text-white font-heading font-bold py-3.5 rounded-xl transition-all shadow-neon flex items-center justify-center gap-2">
            <i class="fa-solid fa-${isReserved ? 'check' : 'cart-shopping'}"></i>
            <span>${isReserved ? 'Refundable Deposit Locked ($500)' : 'Place $500 Refundable Deposit'}</span>
          </button>
          <div class="grid grid-cols-2 gap-3">
            <button onclick="openTestRideModal('${bike.id}')" class="w-full bg-surface-2 hover:bg-surface-3 text-white text-xs font-heading font-semibold py-3 rounded-xl border border-subtle hover:border-border-active transition-all flex items-center justify-center gap-1.5">
              <i class="fa-solid fa-calendar-check text-accent"></i>
              <span>Book Test Ride</span>
            </button>
            <button onclick="openFinanceForBike(${bike.price})" class="w-full bg-surface-2 hover:bg-surface-3 text-white text-xs font-heading font-semibold py-3 rounded-xl border border-subtle hover:border-border-active transition-all flex items-center justify-center gap-1.5">
              <i class="fa-solid fa-calculator text-primary"></i>
              <span>Calculate Loan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  openModal("bike-detail-modal");
}

// 6. Wishlist Management
function toggleWishlist(bikeId) {
  const index = state.wishlist.indexOf(bikeId);
  if (index > -1) {
    state.wishlist.splice(index, 1);
    showToast("Removed from Wishlist", "info");
  } else {
    state.wishlist.push(bikeId);
    showToast("Saved to Wishlist ❤️", "success");
  }
  localStorage.setItem("apex_wishlist", JSON.stringify(state.wishlist));
  updateBadges();
  renderBikes();
  renderWishlistDrawer();
}

function renderWishlistDrawer() {
  const container = document.getElementById("wishlist-items-container");
  const countEl = document.getElementById("wishlist-drawer-count");
  if (!container) return;

  if (countEl) countEl.textContent = state.wishlist.length;

  if (state.wishlist.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-muted">
        <i class="fa-regular fa-heart text-4xl mb-3 text-dim block"></i>
        <p class="text-sm">Your saved wishlist is empty.</p>
        <p class="text-xs text-dim mt-1">Tap the heart on any superbike to save it here.</p>
      </div>
    `;
    return;
  }

  const wishlistBikes = state.bikes.filter((b) => state.wishlist.includes(b.id));
  container.innerHTML = wishlistBikes.map((bike) => `
    <div class="bg-surface-2 border border-subtle rounded-xl p-3 flex gap-3 items-center">
      <img src="${bike.images[0]}" alt="${bike.model}" class="w-16 h-12 object-cover rounded-lg">
      <div class="flex-1 min-w-0">
        <h4 class="text-xs font-bold text-white truncate">${bike.make} ${bike.model}</h4>
        <span class="text-xs font-mono font-bold text-primary">$${bike.price.toLocaleString()}</span>
      </div>
      <button onclick="toggleWishlist('${bike.id}')" class="text-dim hover:text-danger p-2"><i class="fa-solid fa-trash-can text-xs"></i></button>
    </div>
  `).join("");
}

// 7. Cart & Refundable Deposit Reservations
function reserveDeposit(bikeId) {
  if (!state.cart.includes(bikeId)) {
    state.cart.push(bikeId);
    showToast("Motorcycle reservation added to Cart! ($500 Deposit)", "success");
  } else {
    showToast("This motorcycle is already in your reservation cart.", "info");
  }
  localStorage.setItem("apex_cart", JSON.stringify(state.cart));
  updateBadges();
  renderBikes();
  renderCartDrawer();
  openCartDrawer();
}

function removeReservation(bikeId) {
  state.cart = state.cart.filter((id) => id !== bikeId);
  localStorage.setItem("apex_cart", JSON.stringify(state.cart));
  showToast("Reservation removed from cart.", "info");
  updateBadges();
  renderBikes();
  renderCartDrawer();
}

function renderCartDrawer() {
  const container = document.getElementById("cart-items-container");
  const countEl = document.getElementById("cart-drawer-count");
  const subtotalEl = document.getElementById("cart-subtotal-price");
  if (!container) return;

  if (countEl) countEl.textContent = state.cart.length;
  const depositTotal = state.cart.length * 500;
  if (subtotalEl) subtotalEl.textContent = `$${depositTotal.toLocaleString()}`;

  if (state.cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-muted">
        <i class="fa-solid fa-cart-shopping text-4xl mb-3 text-dim block"></i>
        <p class="text-sm">No reservations in your cart.</p>
        <p class="text-xs text-dim mt-1">Lock down a VIN with a refundable $500 deposit.</p>
      </div>
    `;
    return;
  }

  const reservedBikes = state.bikes.filter((b) => state.cart.includes(b.id));
  container.innerHTML = reservedBikes.map((bike) => `
    <div class="bg-surface-2 border border-subtle rounded-xl p-3 flex gap-3 items-center">
      <img src="${bike.images[0]}" alt="${bike.model}" class="w-16 h-12 object-cover rounded-lg">
      <div class="flex-1 min-w-0">
        <h4 class="text-xs font-bold text-white truncate">${bike.make} ${bike.model}</h4>
        <span class="text-xs font-mono font-bold text-primary">$500 Refundable Deposit</span>
        <span class="block text-[10px] text-dim font-mono">Vault MSRP: $${bike.price.toLocaleString()}</span>
      </div>
      <button onclick="removeReservation('${bike.id}')" class="text-dim hover:text-danger p-2"><i class="fa-solid fa-trash-can text-xs"></i></button>
    </div>
  `).join("");
}

// 8. Side-by-Side Comparison Matrix
function toggleCompare(bikeId) {
  const index = state.compare.indexOf(bikeId);
  if (index > -1) {
    state.compare.splice(index, 1);
    showToast("Removed from Comparison Matrix", "info");
  } else {
    if (state.compare.length >= 3) {
      showToast("Comparison limit reached (Max 3 motorcycles)", "warning");
      return;
    }
    state.compare.push(bikeId);
    showToast("Added to Comparison Matrix", "success");
  }
  localStorage.setItem("apex_compare", JSON.stringify(state.compare));
  updateBadges();
  renderBikes();
  renderCompareDrawer();
}

function renderCompareDrawer() {
  const container = document.getElementById("compare-bikes-content");
  if (!container) return;

  if (state.compare.length === 0) {
    container.innerHTML = `<p class="text-xs text-muted text-center py-8">Select 2 or 3 motorcycles using the compare button on each card.</p>`;
    return;
  }

  const compareBikes = state.bikes.filter((b) => state.compare.includes(b.id));
  container.innerHTML = `
    <table class="w-full text-left text-xs text-main border-collapse">
      <thead>
        <tr class="border-b border-subtle">
          <th class="p-3 text-dim font-mono uppercase">Attribute</th>
          ${compareBikes.map((b) => `
            <th class="p-3 font-heading font-black text-sm text-white">
              <div class="flex items-center justify-between">
                <span>${b.make} ${b.model}</span>
                <button onclick="toggleCompare('${b.id}')" class="text-dim hover:text-danger text-xs"><i class="fa-solid fa-xmark"></i></button>
              </div>
            </th>
          `).join("")}
        </tr>
      </thead>
      <tbody class="divide-y divide-subtle font-mono">
        <tr><td class="p-3 text-dim">Vault Price</td>${compareBikes.map((b) => `<td class="p-3 font-bold text-primary">$${b.price.toLocaleString()}</td>`).join("")}</tr>
        <tr><td class="p-3 text-dim">Engine</td>${compareBikes.map((b) => `<td class="p-3">${b.engine}</td>`).join("")}</tr>
        <tr><td class="p-3 text-dim">Horsepower</td>${compareBikes.map((b) => `<td class="p-3 font-bold text-accent">${b.horsepower} HP</td>`).join("")}</tr>
        <tr><td class="p-3 text-dim">Torque</td>${compareBikes.map((b) => `<td class="p-3">${b.torque}</td>`).join("")}</tr>
        <tr><td class="p-3 text-dim">Displacement</td>${compareBikes.map((b) => `<td class="p-3">${b.displacement}</td>`).join("")}</tr>
        <tr><td class="p-3 text-dim">Wet Weight</td>${compareBikes.map((b) => `<td class="p-3">${b.weight}</td>`).join("")}</tr>
        <tr><td class="p-3 text-dim">Top Speed</td>${compareBikes.map((b) => `<td class="p-3 font-bold">${b.topSpeed}</td>`).join("")}</tr>
      </tbody>
    </table>
  `;
}

// 9. Loan & EMI Financing Calculator
function calculateFinanceEMI() {
  const priceInput = document.getElementById("calc-price-input");
  const downInput = document.getElementById("calc-down-input");
  const termSelect = document.getElementById("calc-term-select");
  const rateInput = document.getElementById("calc-rate-input");
  const resultEl = document.getElementById("calc-monthly-result");

  if (!priceInput || !resultEl) return;

  const price = parseFloat(priceInput.value) || 0;
  const down = parseFloat(downInput.value) || 0;
  const months = parseInt(termSelect.value, 10) || 60;
  const annualRate = parseFloat(rateInput.value) || 5.9;

  const principal = Math.max(0, price - down);
  if (principal === 0) {
    resultEl.innerHTML = `$0<span class="text-sm font-normal text-muted">/mo</span>`;
    return;
  }

  const monthlyRate = annualRate / 100 / 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);

  resultEl.innerHTML = `$${Math.round(emi)}<span class="text-sm font-normal text-muted">/mo</span>`;
}

function openFinanceForBike(price) {
  const priceInput = document.getElementById("calc-price-input");
  const downInput = document.getElementById("calc-down-input");
  if (priceInput) priceInput.value = price;
  if (downInput) downInput.value = Math.round(price * 0.2);
  calculateFinanceEMI();
  openModal("finance-calc-modal");
}

// 10. Instant Trade-In Valuation Estimator
function handleSellBikeSubmit(e) {
  e.preventDefault();
  const make = document.getElementById("sell-make")?.value || "Bike";
  const model = document.getElementById("sell-model")?.value || "Model";
  const year = parseInt(document.getElementById("sell-year")?.value, 10) || 2022;
  const mileage = parseInt(document.getElementById("sell-mileage")?.value, 10) || 5000;
  const condition = document.getElementById("sell-condition")?.value || "Good";

  const basePrice = 16000;
  const agePenalty = (2025 - year) * 1100;
  const mileagePenalty = Math.round(mileage * 0.25);
  let conditionMultiplier = 1.0;
  if (condition === "Excellent") conditionMultiplier = 1.15;
  if (condition === "Fair") conditionMultiplier = 0.85;

  const estimatedCash = Math.max(3500, Math.round((basePrice - agePenalty - mileagePenalty) * conditionMultiplier));
  const estimatedTradeIn = Math.round(estimatedCash * 1.08);

  const resultContainer = document.getElementById("sell-valuation-result");
  if (resultContainer) {
    resultContainer.classList.remove("hidden");
    resultContainer.innerHTML = `
      <div class="text-center space-y-4">
        <h4 class="font-heading font-bold text-xl text-white">${year} ${make} ${model}</h4>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-surface-3 p-4 rounded-xl border border-subtle">
            <span class="text-[11px] text-dim block font-mono uppercase">Instant Cash Offer</span>
            <span class="font-heading font-black text-2xl text-white">$${estimatedCash.toLocaleString()}</span>
          </div>
          <div class="bg-surface-3 p-4 rounded-xl border border-primary/50">
            <span class="text-[11px] text-primary block font-mono uppercase">Trade-In Vault Credit</span>
            <span class="font-heading font-black text-2xl text-primary">$${estimatedTradeIn.toLocaleString()}</span>
          </div>
        </div>
        <p class="text-xs text-muted">Estimate backed by live cycle telemetry. Valid for 7 days at any Apex Vault.</p>
        <button onclick="showToast('Appraisal lock code sent to your email!', 'success')" class="w-full bg-primary hover:bg-primary-hover text-white font-heading font-bold py-3 rounded-xl transition-all shadow-neon">
          Lock In This Appraisal Code
        </button>
      </div>
    `;
  }
}

// 11. Modal & Drawer Helpers
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }
}

function openCompareDrawer() {
  const drawer = document.getElementById("compare-drawer");
  if (drawer) drawer.classList.remove("translate-y-full");
}

function closeCompareDrawer() {
  const drawer = document.getElementById("compare-drawer");
  if (drawer) drawer.classList.add("translate-y-full");
}

function openWishlistDrawer() {
  const drawer = document.getElementById("wishlist-drawer");
  if (drawer) drawer.classList.remove("translate-x-full");
}

function closeWishlistDrawer() {
  const drawer = document.getElementById("wishlist-drawer");
  if (drawer) drawer.classList.add("translate-x-full");
}

function openCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  if (drawer) drawer.classList.remove("translate-x-full");
}

function closeCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  if (drawer) drawer.classList.add("translate-x-full");
}

// Global modal triggers hooked to HTML onclicks
window.openFinanceCalcModal = () => openModal("finance-calc-modal");
window.closeFinanceCalcModal = () => closeModal("finance-calc-modal");
window.openSellBikeModal = () => openModal("sell-bike-modal");
window.closeSellBikeModal = () => closeModal("sell-bike-modal");
window.openZipModal = () => openModal("zip-modal");
window.closeZipModal = () => closeModal("zip-modal");
window.submitZipModal = () => {
  const zipInput = document.getElementById("modal-zip-input");
  const zipDisplay = document.getElementById("current-zip-display");
  if (zipInput && zipDisplay && zipInput.value) {
    zipDisplay.textContent = `${zipInput.value} - Regional Vault`;
    showToast(`Location set to ${zipInput.value}`, "success");
  }
  closeZipModal();
};

window.closeCheckoutModalCompletely = () => {
  closeModal("checkout-modal");
  state.cart = [];
  localStorage.setItem("apex_cart", JSON.stringify(state.cart));
  updateBadges();
  renderBikes();
  renderCartDrawer();
  const formView = document.getElementById("checkout-form-view");
  const successView = document.getElementById("checkout-success-view");
  if (formView) formView.classList.remove("hidden");
  if (successView) successView.classList.add("hidden");
};

function openTestRideModal(bikeId) {
  const bike = state.bikes.find((b) => b.id === bikeId);
  const subtitle = document.getElementById("test-ride-bike-subtitle");
  if (subtitle && bike) {
    subtitle.textContent = `Schedule track & street test ride session for the ${bike.year} ${bike.make} ${bike.model}.`;
  }
  openModal("test-ride-modal");
}

function updateBadges() {
  const compareBadge = document.getElementById("nav-compare-count");
  const wishlistBadge = document.getElementById("nav-wishlist-count");
  const cartBadge = document.getElementById("nav-cart-count");

  if (compareBadge) compareBadge.textContent = state.compare.length;
  if (wishlistBadge) wishlistBadge.textContent = state.wishlist.length;
  if (cartBadge) cartBadge.textContent = state.cart.length;
}

// 12. Toast Notification Feedback
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  const bg = type === "success" ? "bg-success" : type === "warning" ? "bg-accent" : type === "danger" ? "bg-danger" : "bg-primary";
  toast.className = `${bg} text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 transform transition-all duration-300 translate-y-4 opacity-0 pointer-events-auto`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove("translate-y-4", "opacity-0");
  });

  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// 13. Application Initialization & Event Listener Bindings
document.addEventListener("DOMContentLoaded", () => {
  // Initial renders
  renderBikes();
  renderWishlistDrawer();
  renderCartDrawer();
  renderCompareDrawer();
  updateBadges();

  // Search input binding
  const searchInput = document.getElementById("nav-search-input");
  const clearSearchBtn = document.getElementById("nav-search-clear-btn");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value.trim();
      if (clearSearchBtn) {
        if (state.searchQuery.length > 0) clearSearchBtn.classList.remove("hidden");
        else clearSearchBtn.classList.add("hidden");
      }
      renderBikes();
    });
  }
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      state.searchQuery = "";
      clearSearchBtn.classList.add("hidden");
      renderBikes();
    });
  }

  // Quick Filter Bar
  const quickMake = document.getElementById("quick-make-select");
  const quickCat = document.getElementById("quick-category-select");
  const quickCond = document.getElementById("quick-condition-select");
  const quickSubmit = document.getElementById("quick-filter-submit");
  if (quickSubmit) {
    quickSubmit.addEventListener("click", () => {
      if (quickMake) state.selectedMake = quickMake.value;
      if (quickCat) state.selectedCategory = quickCat.value;
      if (quickCond) state.selectedCondition = quickCond.value;
      renderBikes();
      document.getElementById("inventory-section")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Sidebar Filter Form
  const filterCat = document.getElementById("filter-category");
  const filterMake = document.getElementById("filter-make");
  const filterCond = document.getElementById("filter-condition");
  const filterPrice = document.getElementById("filter-price");
  const priceLabel = document.getElementById("price-range-label");
  const resetBtn = document.getElementById("reset-all-filters-btn");

  if (filterCat) filterCat.addEventListener("change", (e) => { state.selectedCategory = e.target.value; renderBikes(); });
  if (filterMake) filterMake.addEventListener("change", (e) => { state.selectedMake = e.target.value; renderBikes(); });
  if (filterCond) filterCond.addEventListener("change", (e) => { state.selectedCondition = e.target.value; renderBikes(); });
  if (filterPrice) {
    filterPrice.addEventListener("input", (e) => {
      state.maxPrice = parseInt(e.target.value, 10);
      if (priceLabel) priceLabel.textContent = `$${state.maxPrice.toLocaleString()}`;
      renderBikes();
    });
  }
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      state.selectedCategory = "All";
      state.selectedMake = "All";
      state.selectedCondition = "All";
      state.maxPrice = 35000;
      state.searchQuery = "";
      if (filterCat) filterCat.value = "All";
      if (filterMake) filterMake.value = "All";
      if (filterCond) filterCond.value = "All";
      if (filterPrice) filterPrice.value = 35000;
      if (priceLabel) priceLabel.textContent = "$35,000";
      if (searchInput) searchInput.value = "";
      renderBikes();
      showToast("Filters reset to default", "info");
    });
  }

  // Category Pills
  const categoryPills = document.querySelectorAll("#category-pills-bar button");
  categoryPills.forEach((btn) => {
    btn.addEventListener("click", () => {
      categoryPills.forEach((p) => p.classList.remove("bg-primary", "text-white"));
      btn.classList.add("bg-primary", "text-white");
      state.selectedCategory = btn.textContent.trim();
      renderBikes();
    });
  });

  // Modal Closers
  document.getElementById("detail-modal-close")?.addEventListener("click", () => closeModal("bike-detail-modal"));
  document.getElementById("audio-modal-close")?.addEventListener("click", () => closeModal("exhaust-audio-modal"));
  document.getElementById("sell-modal-close")?.addEventListener("click", () => closeModal("sell-bike-modal"));
  document.getElementById("test-ride-modal-close")?.addEventListener("click", () => closeModal("test-ride-modal"));
  document.getElementById("finance-calc-close")?.addEventListener("click", () => closeModal("finance-calc-modal"));
  document.getElementById("checkout-modal-close")?.addEventListener("click", () => closeModal("checkout-modal"));

  // Drawer Triggers
  document.getElementById("nav-wishlist-btn")?.addEventListener("click", openWishlistDrawer);
  document.getElementById("wishlist-drawer-close")?.addEventListener("click", closeWishlistDrawer);
  document.getElementById("nav-cart-btn")?.addEventListener("click", openCartDrawer);
  document.getElementById("cart-drawer-close")?.addEventListener("click", closeCartDrawer);
  document.getElementById("nav-compare-btn")?.addEventListener("click", openCompareDrawer);
  document.getElementById("compare-drawer-close")?.addEventListener("click", closeCompareDrawer);
  document.getElementById("compare-clear-all-btn")?.addEventListener("click", () => {
    state.compare = [];
    localStorage.setItem("apex_compare", JSON.stringify(state.compare));
    updateBadges();
    renderBikes();
    renderCompareDrawer();
    showToast("Comparison matrix cleared", "info");
  });

  // Sell Bike Form Handler
  document.getElementById("sell-bike-form")?.addEventListener("submit", handleSellBikeSubmit);

  // Test Ride Form Handler
  document.getElementById("test-ride-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    closeModal("test-ride-modal");
    showToast("VIP Test Ride confirmed! Vault concierge will contact you.", "success");
  });

  // Checkout Form Handler
  document.getElementById("cart-checkout-btn")?.addEventListener("click", () => {
    if (state.cart.length === 0) {
      showToast("Add a motorcycle reservation to your cart first.", "warning");
      return;
    }
    closeCartDrawer();
    openModal("checkout-modal");
  });

  document.getElementById("checkout-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const formView = document.getElementById("checkout-form-view");
    const successView = document.getElementById("checkout-success-view");
    const receiptEl = document.getElementById("receipt-id");
    if (receiptEl) receiptEl.textContent = `MV-${Math.floor(10000 + Math.random() * 90000)}`;
    if (formView) formView.classList.add("hidden");
    if (successView) successView.classList.remove("hidden");
    showToast("Earnest deposit authorized! VIN assigned.", "success");
  });

  // Finance Calculator dynamic sliders/inputs
  document.getElementById("calc-price-input")?.addEventListener("input", calculateFinanceEMI);
  document.getElementById("calc-down-input")?.addEventListener("input", calculateFinanceEMI);
  document.getElementById("calc-term-select")?.addEventListener("change", calculateFinanceEMI);
  document.getElementById("calc-rate-input")?.addEventListener("input", calculateFinanceEMI);

  // Top bar shortcuts
  document.getElementById("top-zip-btn")?.addEventListener("click", openZipModal);
  document.getElementById("top-trade-in-link")?.addEventListener("click", openSellBikeModal);
  document.getElementById("hero-cta-sell")?.addEventListener("click", openSellBikeModal);
  document.getElementById("hero-cta-explore")?.addEventListener("click", () => {
    document.getElementById("inventory-section")?.scrollIntoView({ behavior: "smooth" });
  });
});
