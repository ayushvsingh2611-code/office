// app.js - ESTATEHUB Backend & Application Logic Engine
// Authored by Usopp, Lead Backend & Application Logic Engineer

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. TOAST NOTIFICATION SYSTEM
    // ==========================================
    window.phToast = function(message, type = 'success') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-3 pointer-events-none';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        const bgColors = {
            success: 'bg-slate-900 border-brand-500 text-white',
            error: 'bg-red-900 border-red-500 text-white',
            info: 'bg-blue-900 border-blue-500 text-white'
        };

        toast.className = `pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-xl transition-all duration-300 transform translate-y-4 opacity-0 ${bgColors[type] || bgColors.success}`;
        
        const icons = {
            success: '<i class="fa-solid fa-circle-check text-brand-400"></i>',
            error: '<i class="fa-solid fa-circle-exclamation text-red-400"></i>',
            info: '<i class="fa-solid fa-circle-info text-blue-400"></i>'
        };

        toast.innerHTML = `
            <span class="text-lg">${icons[type] || icons.success}</span>
            <div class="text-sm font-medium">${message}</div>
        `;

        container.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-4', 'opacity-0');
        });

        setTimeout(() => {
            toast.classList.add('translate-y-4', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    };

    // ==========================================
    // 2. SEED DATA & REACTIVE STATE ENGINE
    // ==========================================
    const DEFAULT_PROPERTIES = [
        {
            id: 1,
            title: "The Glass House Villa",
            location: "Beverly Hills, CA",
            price: 2450000,
            beds: 5,
            baths: 6,
            sqft: 4800,
            type: "villa",
            image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
            featured: true,
            agent: "Sarah Jenkins"
        },
        {
            id: 2,
            title: "Skyline Luxury Penthouse",
            location: "Manhattan, NY",
            price: 1850000,
            beds: 3,
            baths: 3.5,
            sqft: 2900,
            type: "penthouse",
            image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800",
            featured: true,
            agent: "Michael Vance"
        },
        {
            id: 3,
            title: "Modern Minimalist Loft",
            location: "Austin, TX",
            price: 750000,
            beds: 2,
            baths: 2,
            sqft: 1650,
            type: "apartment",
            image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800",
            featured: false,
            agent: "Elena Rostova"
        },
        {
            id: 4,
            title: "Suburban Family Oasis",
            location: "Naperville, IL",
            price: 520000,
            beds: 4,
            baths: 3,
            sqft: 3100,
            type: "house",
            image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800",
            featured: false,
            agent: "David Kim"
        },
        {
            id: 5,
            title: "Oceanfront Horizon Estate",
            location: "Miami Beach, FL",
            price: 3800000,
            beds: 6,
            baths: 7,
            sqft: 6200,
            type: "villa",
            image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
            featured: true,
            agent: "Sarah Jenkins"
        },
        {
            id: 6,
            title: "Urban Industrial Studio",
            location: "Seattle, WA",
            price: 430000,
            beds: 1,
            baths: 1,
            sqft: 950,
            type: "apartment",
            image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800",
            featured: false,
            agent: "Michael Vance"
        }
    ];

    const AGENTS = [
        { id: 1, name: "Sarah Jenkins", role: "Luxury Specialist", phone: "+1 (555) 234-5678", email: "sarah@estatehub.com", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" },
        { id: 2, name: "Michael Vance", role: "Penthouse & Urban Expert", phone: "+1 (555) 876-5432", email: "michael@estatehub.com", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400" },
        { id: 3, name: "Elena Rostova", role: "Investment Consultant", phone: "+1 (555) 345-6789", email: "elena@estatehub.com", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400" },
        { id: 4, name: "David Kim", role: "Suburban & Family Homes", phone: "+1 (555) 987-6543", email: "david@estatehub.com", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400" }
    ];

    // Initialize State
    let appState = {
        properties: JSON.parse(localStorage.getItem('estatehub_properties')) || DEFAULT_PROPERTIES,
        favorites: JSON.parse(localStorage.getItem('estatehub_favorites')) || [],
        consultations: JSON.parse(localStorage.getItem('estatehub_consultations')) || [],
        filters: {
            keyword: '',
            type: 'all',
            priceMax: 5000000,
            beds: 'all'
        }
    };

    function syncStorage() {
        localStorage.setItem('estatehub_properties', JSON.stringify(appState.properties));
        localStorage.setItem('estatehub_favorites', JSON.stringify(appState.favorites));
        localStorage.setItem('estatehub_consultations', JSON.stringify(appState.consultations));
    }

    // ==========================================
    // 3. DOM ELEMENT BINDINGS & RENDERING
    // ==========================================
    const propertiesGrid = document.getElementById('propertiesGrid') || createFallbackContainer('propertiesGrid', 'Properties Listing');
    const searchKeywordInput = document.getElementById('searchKeyword');
    const propertyTypeSelect = document.getElementById('propertyType');
    const priceRangeInput = document.getElementById('priceRange');
    const priceRangeLabel = document.getElementById('priceRangeLabel');
    const bedsFilterSelect = document.getElementById('bedsFilter');
    const searchForm = document.getElementById('searchForm');

    function createFallbackContainer(id, sectionName) {
        // If Franky's HTML structure is missing specific IDs, inject safe fallback containers
        const target = document.querySelector('section') || document.body;
        const div = document.createElement('div');
        div.id = id;
        div.className = 'max-w-7xl mx-auto px-4 py-12';
        div.innerHTML = `<h2 class="text-2xl font-bold mb-6 text-slate-900">${sectionName}</h2><div id="${id}-inner" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"></div>`;
        target.appendChild(div);
        return document.getElementById(`${id}-inner`) || div;
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    }

    function renderProperties() {
        const target = document.getElementById('propertiesGrid') || propertiesGrid;
        if (!target) return;

        // Apply filters
        const filtered = appState.properties.filter(prop => {
            const matchesKeyword = !appState.filters.keyword || 
                prop.title.toLowerCase().includes(appState.filters.keyword.toLowerCase()) || 
                prop.location.toLowerCase().includes(appState.filters.keyword.toLowerCase());
            
            const matchesType = appState.filters.type === 'all' || prop.type === appState.filters.type;
            const matchesPrice = prop.price <= Number(appState.filters.priceMax);
            const matchesBeds = appState.filters.beds === 'all' || prop.beds >= Number(appState.filters.beds);

            return matchesKeyword && matchesType && matchesPrice && matchesBeds;
        });

        if (filtered.length === 0) {
            target.innerHTML = `
                <div class="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
                    <div class="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                        <i class="fa-solid fa-house-chimney-crack"></i>
                    </div>
                    <h3 class="text-lg font-bold text-slate-900 mb-1">No Properties Found</h3>
                    <p class="text-slate-500 text-sm max-w-sm mx-auto mb-6">We couldn't find any properties matching your current filter criteria. Try adjusting your filters.</p>
                    <button id="resetFiltersBtn" class="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-md shadow-brand-600/20">
                        Reset Filters
                    </button>
                </div>
            `;
            const resetBtn = document.getElementById('resetFiltersBtn');
            if (resetBtn) {
                resetBtn.addEventListener('click', resetFilters);
            }
            return;
        }

        target.innerHTML = filtered.map(prop => {
            const isFav = appState.favorites.includes(prop.id);
            return `
                <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
                    <div class="relative h-64 overflow-hidden bg-slate-100">
                        <img src="${prop.image}" alt="${prop.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                        <div class="absolute top-4 left-4 flex gap-2">
                            ${prop.featured ? '<span class="bg-brand-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">Featured</span>' : ''}
                            <span class="bg-slate-900/80 backdrop-blur text-white text-xs font-semibold px-3 py-1.5 rounded-lg uppercase tracking-wider">${prop.type}</span>
                        </div>
                        <button onclick="window.toggleFavorite(${prop.id})" class="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center text-slate-700 hover:text-red-500 shadow-md transition">
                            <i class="${isFav ? 'fa-solid text-red-500' : 'fa-regular'} fa-heart text-lg"></i>
                        </button>
                        <div class="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                            <span class="text-2xl font-extrabold text-white drop-shadow-md">${formatCurrency(prop.price)}</span>
                        </div>
                    </div>
                    
                    <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1"><i class="fa-solid fa-location-dot text-brand-600 mr-1"></i> ${prop.location}</p>
                            <h3 class="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition">${prop.title}</h3>
                        </div>

                        <div class="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-slate-600 text-xs font-semibold">
                            <div class="flex items-center gap-1.5"><i class="fa-solid fa-bed text-brand-600"></i> ${prop.beds} Beds</div>
                            <div class="flex items-center gap-1.5"><i class="fa-solid fa-bath text-brand-600"></i> ${prop.baths} Baths</div>
                            <div class="flex items-center gap-1.5"><i class="fa-solid fa-ruler-combined text-brand-600"></i> ${prop.sqft} sqft</div>
                        </div>

                        <div class="flex items-center justify-between pt-2">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold">
                                    ${prop.agent.charAt(0)}
                                </div>
                                <span class="text-xs font-medium text-slate-600">Agent: ${prop.agent}</span>
                            </div>
                            <button onclick="window.openPropertyModal(${prop.id})" class="bg-brand-50 hover:bg-brand-100 text-brand-700 px-4 py-2 rounded-xl text-xs font-semibold transition">
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Global helper for inline property action
    window.toggleFavorite = function(id) {
        const index = appState.favorites.indexOf(id);
        if (index > -1) {
            appState.favorites.splice(index, 1);
            phToast('Removed property from saved favorites.', 'info');
        } else {
            appState.favorites.push(id);
            phToast('Property added to saved favorites!', 'success');
        }
        syncStorage();
        renderProperties();
    };

    function resetFilters() {
        appState.filters = { keyword: '', type: 'all', priceMax: 5000000, beds: 'all' };
        if (searchKeywordInput) searchKeywordInput.value = '';
        if (propertyTypeSelect) propertyTypeSelect.value = 'all';
        if (priceRangeInput) priceRangeInput.value = 5000000;
        if (priceRangeLabel) priceRangeLabel.textContent = formatCurrency(5000000);
        if (bedsFilterSelect) bedsFilterSelect.value = 'all';
        renderProperties();
        phToast('Filters reset successfully.', 'info');
    }

    // ==========================================
    // 4. REAL-TIME FILTERING & SEARCH
    // ==========================================
    if (searchKeywordInput) {
        searchKeywordInput.addEventListener('input', (e) => {
            appState.filters.keyword = e.target.value.trim();
            renderProperties();
        });
    }

    if (propertyTypeSelect) {
        propertyTypeSelect.addEventListener('change', (e) => {
            appState.filters.type = e.target.value;
            renderProperties();
        });
    }

    if (priceRangeInput) {
        priceRangeInput.addEventListener('input', (e) => {
            const val = Number(e.target.value);
            appState.filters.priceMax = val;
            if (priceRangeLabel) priceRangeLabel.textContent = formatCurrency(val);
            renderProperties();
        });
    }

    if (bedsFilterSelect) {
        bedsFilterSelect.addEventListener('change', (e) => {
            appState.filters.beds = e.target.value;
            renderProperties();
        });
    }

    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            renderProperties();
            phToast('Search results updated!', 'success');
        });
    }

    // ==========================================
    // 5. MORTGAGE CALCULATOR LOGIC
    // ==========================================
    const calcHomePrice = document.getElementById('calcHomePrice');
    const calcDownPayment = document.getElementById('calcDownPayment');
    const calcInterestRate = document.getElementById('calcInterestRate');
    const calcLoanTerm = document.getElementById('calcLoanTerm');
    const calculateMortgageBtn = document.getElementById('calculateMortgageBtn');
    const mortgageResultContainer = document.getElementById('mortgageResultContainer');

    function calculateMortgage() {
        const price = calcHomePrice ? parseFloat(calcHomePrice.value) || 500000 : 500000;
        const downPayment = calcDownPayment ? parseFloat(calcDownPayment.value) || 100000 : 100000;
        const annualRate = calcInterestRate ? parseFloat(calcInterestRate.value) || 6.5 : 6.5;
        const years = calcLoanTerm ? parseInt(calcLoanTerm.value) || 30 : 30;

        const principal = Math.max(0, price - downPayment);
        const monthlyRate = (annualRate / 100) / 12;
        const totalPayments = years * 12;

        let monthlyPayment = 0;
        if (monthlyRate === 0) {
            monthlyPayment = principal / totalPayments;
        } else {
            monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                             (Math.pow(1 + monthlyRate, totalPayments) - 1);
        }

        const propertyTaxMonthly = (price * 0.012) / 12;
        const homeInsuranceMonthly = 150;
        const totalMonthly = monthlyPayment + propertyTaxMonthly + homeInsuranceMonthly;

        if (mortgageResultContainer) {
            mortgageResultContainer.innerHTML = `
                <div class="bg-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-6">
                    <div class="border-b border-slate-800 pb-4">
                        <span class="text-xs font-semibold uppercase tracking-widest text-brand-400">Estimated Monthly Payment</span>
                        <div class="text-4xl font-extrabold mt-1 text-white">${formatCurrency(totalMonthly)}<span class="text-sm font-normal text-slate-400">/mo</span></div>
                    </div>
                    <div class="space-y-3 text-sm text-slate-300">
                        <div class="flex justify-between items-center">
                            <span>Principal & Interest:</span>
                            <span class="font-bold text-white">${formatCurrency(monthlyPayment)}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span>Property Tax (Est.):</span>
                            <span class="font-bold text-white">${formatCurrency(propertyTaxMonthly)}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span>Home Insurance:</span>
                            <span class="font-bold text-white">${formatCurrency(homeInsuranceMonthly)}</span>
                        </div>
                        <div class="flex justify-between items-center pt-3 border-t border-slate-800">
                            <span>Total Loan Amount:</span>
                            <span class="font-bold text-brand-400">${formatCurrency(principal)}</span>
                        </div>
                    </div>
                    <button onclick="window.phToast('Mortgage report downloaded successfully!', 'success')" class="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl transition shadow-md shadow-brand-600/30">
                        Download Detailed Breakdown
                    </button>
                </div>
            `;
        }
    }

    if (calculateMortgageBtn) {
        calculateMortgageBtn.addEventListener('click', () => {
            calculateMortgage();
            phToast('Mortgage recalculated successfully.', 'success');
        });
    }

    // Auto-calculate on input changes if available
    [calcHomePrice, calcDownPayment, calcInterestRate, calcLoanTerm].forEach(input => {
        if (input) {
            input.addEventListener('input', calculateMortgage);
        }
    });

    // Initial calculation call
    calculateMortgage();

    // ==========================================
    // 6. AGENT CONSULTATION MODAL & SYSTEM
    // ==========================================
    // Build Agent Consultation Modal dynamically
    const modalHTML = `
        <div id="consultationModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm hidden opacity-0 transition-opacity duration-300">
            <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden transform scale-95 transition-transform duration-300">
                <div class="bg-slate-900 text-white p-6 flex justify-between items-center">
                    <div>
                        <h3 class="text-xl font-bold">Schedule Agent Consultation</h3>
                        <p class="text-xs text-slate-400 mt-0.5">Connect with our top-rated real estate experts</p>
                    </div>
                    <button id="closeConsultationModal" class="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition">
                        <i class="fa-solid fa-xmark text-lg"></i>
                    </button>
                </div>
                <form id="consultationForm" class="p-6 space-y-4">
                    <div>
                        <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Full Name</label>
                        <input type="text" id="consultName" required placeholder="e.g. Alexander Hamilton" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Email Address</label>
                            <input type="email" id="consultEmail" required placeholder="alex@example.com" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Phone Number</label>
                            <input type="tel" id="consultPhone" required placeholder="+1 (555) 000-0000" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                        </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Select Agent</label>
                            <select id="consultAgent" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                                ${AGENTS.map(agent => `<option value="${agent.name}">${agent.name} — ${agent.role}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Preferred Date</label>
                            <input type="date" id="consultDate" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Message / Requirements</label>
                        <textarea id="consultMsg" rows="3" placeholder="Tell us what kind of property you are looking for..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"></textarea>
                    </div>
                    <button type="submit" class="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-xl transition shadow-md shadow-brand-600/30">
                        Confirm Consultation Booking
                    </button>
                </form>
            </div>
        </div>
    `;

    const modalWrapper = document.createElement('div');
    modalWrapper.innerHTML = modalHTML;
    document.body.appendChild(modalWrapper);

    const consultationModal = document.getElementById('consultationModal');
    const openConsultationModalBtn = document.getElementById('openConsultationModal');
    const closeConsultationModalBtn = document.getElementById('closeConsultationModal');
    const consultationForm = document.getElementById('consultationForm');

    function toggleModal(open = true) {
        if (!consultationModal) return;
        const modalContent = consultationModal.querySelector('div > div');
        if (open) {
            consultationModal.classList.remove('hidden');
            requestAnimationFrame(() => {
                consultationModal.classList.remove('opacity-0');
                if (modalContent) modalContent.classList.remove('scale-95');
            });
        } else {
            consultationModal.classList.add('opacity-0');
            if (modalContent) modalContent.classList.add('scale-95');
            setTimeout(() => {
                consultationModal.classList.add('hidden');
            }, 300);
        }
    }

    if (openConsultationModalBtn) {
        openConsultationModalBtn.addEventListener('click', () => toggleModal(true));
    }

    // Bind all elements with class or text related to agent consultation
    document.querySelectorAll('a[href="#agents"], button').forEach(el => {
        if (el.textContent && el.textContent.toLowerCase().includes('consult')) {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                toggleModal(true);
            });
        }
    });

    if (closeConsultationModalBtn) {
        closeConsultationModalBtn.addEventListener('click', () => toggleModal(false));
    }

    if (consultationModal) {
        consultationModal.addEventListener('click', (e) => {
            if (e.target === consultationModal) toggleModal(false);
        });
    }

    if (consultationForm) {
        consultationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('consultName').value.trim();
            const email = document.getElementById('consultEmail').value.trim();
            const phone = document.getElementById('consultPhone').value.trim();
            const agent = document.getElementById('consultAgent').value;
            const date = document.getElementById('consultDate').value;
            const message = document.getElementById('consultMsg').value.trim();

            if (!name || !email || !phone || !date) {
                phToast('Please fill in all required consultation fields.', 'error');
                return;
            }

            const newBooking = {
                id: Date.now(),
                name,
                email,
                phone,
                agent,
                date,
                message,
                timestamp: new Date().toISOString()
            };

            appState.consultations.push(newBooking);
            syncStorage();

            toggleModal(false);
            consultationForm.reset();
            phToast(`Consultation booked successfully with ${agent}!`, 'success');
        });
    }

    // ==========================================
    // 7. PROPERTY DETAIL & AGENTS RENDERING
    // ==========================================
});