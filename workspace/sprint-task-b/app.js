/**
 * OneDignostic - Core Application Controller (`js/app.js`)
 * Author: Shanks (Group 2 - Builder)
 * Strictly compliant with Robin's Architecture & DOM Contract
 */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // 1. Load cart from localStorage
    AppState.cart = StorageService.loadCart();
    recalculateCartTotals();
    updateCartUI();

    // 2. Set minimum date on booking date picker to today
    const datePicker = document.getElementById('booking-date-picker');
    if (datePicker) {
        const today = new Date().toISOString().split('T')[0];
        datePicker.min = today;
        datePicker.value = today;
        AppState.booking.bookingDate = today;
    }

    // 3. Render Initial Data
    renderCategoryFilters();
    renderTests();
    renderPackages();
    renderBranches();
    populateCenterDropdown();

    // 4. Attach Event Listeners
    attachEventListeners();
}

/**
 * Attaches all required DOM event listeners across header, search, modals, and drawers
 */
function attachEventListeners() {
    // Nav links & tabs
    const tabTests = document.getElementById('view-tab-tests');
    const tabPackages = document.getElementById('view-tab-packages');
    if (tabTests) tabTests.addEventListener('click', () => switchCatalogTab('tests'));
    if (tabPackages) tabPackages.addEventListener('click', () => switchCatalogTab('packages'));

    const navLinkTests = document.getElementById('nav-link-tests');
    const navLinkPackages = document.getElementById('nav-link-packages');
    if (navLinkTests) navLinkTests.addEventListener('click', () => switchCatalogTab('tests'));
    if (navLinkPackages) navLinkPackages.addEventListener('click', () => switchCatalogTab('packages'));

    // Cart Drawer triggers
    const cartBtnDesktop = document.getElementById('cart-btn-desktop');
    const cartBtnMobile = document.getElementById('cart-btn-mobile');
    const cartCloseBtn = document.getElementById('cart-drawer-close-btn');
    const cartOverlay = document.getElementById('cart-drawer-overlay');

    if (cartBtnDesktop) cartBtnDesktop.addEventListener('click', openCartDrawer);
    if (cartBtnMobile) cartBtnMobile.addEventListener('click', openCartDrawer);
    if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartDrawer);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

    // Hero buttons
    const heroBtnHome = document.getElementById('hero-btn-book-home');
    if (heroBtnHome) {
        heroBtnHome.addEventListener('click', () => {
            const homeRadio = document.getElementById('collection-type-home');
            if (homeRadio) {
                homeRadio.checked = true;
                handleServiceTypeChange('home_collection');
            }
            const catalogSec = document.getElementById('tests-packages-section');
            if (catalogSec) catalogSec.scrollIntoView({ behavior: 'smooth' });
        });
    }

    const heroBtnUploadRx = document.getElementById('hero-btn-upload-rx');
    const navLinkRx = document.getElementById('nav-link-prescription');
    const mobileLinkRx = document.getElementById('mobile-link-prescription');
    if (heroBtnUploadRx) heroBtnUploadRx.addEventListener('click', openPrescriptionModal);
    if (navLinkRx) navLinkRx.addEventListener('click', openPrescriptionModal);
    if (mobileLinkRx) mobileLinkRx.addEventListener('click', openPrescriptionModal);

    const rxModalClose = document.getElementById('prescription-modal-close');
    if (rxModalClose) rxModalClose.addEventListener('click', closePrescriptionModal);

    // Report Tracker triggers
    const heroBtnReports = document.getElementById('hero-btn-check-reports');
    const navLinkReports = document.getElementById('nav-link-reports');
    const mobileLinkReports = document.getElementById('mobile-link-reports');
    if (heroBtnReports) heroBtnReports.addEventListener('click', openReportTrackerModal);
    if (navLinkReports) navLinkReports.addEventListener('click', openReportTrackerModal);
    if (mobileLinkReports) mobileLinkReports.addEventListener('click', openReportTrackerModal);

    const reportModalClose = document.getElementById('report-modal-close');
    if (reportModalClose) reportModalClose.addEventListener('click', closeReportTrackerModal);

    const reportSearchBtn = document.getElementById('report-search-btn');
    if (reportSearchBtn) reportSearchBtn.addEventListener('click', searchPatientReports);

    // Health Risk Advisor triggers
    const navLinkAdvisor = document.getElementById('nav-link-advisor');
    const mobileLinkAdvisor = document.getElementById('mobile-link-advisor');
    if (navLinkAdvisor) navLinkAdvisor.addEventListener('click', openHealthAdvisorModal);
    if (mobileLinkAdvisor) mobileLinkAdvisor.addEventListener('click', openHealthAdvisorModal);

    const advisorModalClose = document.getElementById('advisor-modal-close');
    if (advisorModalClose) advisorModalClose.addEventListener('click', closeHealthAdvisorModal);

    const advisorSubmitBtn = document.getElementById('advisor-submit-btn');
    if (advisorSubmitBtn) advisorSubmitBtn.addEventListener('click', evaluateHealthRiskAssessment);

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle-btn');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    if (mobileMenuToggle && mobileNavMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileNavMenu.classList.toggle('hidden');
        });
    }

    // Search inputs
    const testSearchInput = document.getElementById('test-search-input');
    const heroSearchInput = document.getElementById('hero-search-input');
    const heroSearchBtn = document.getElementById('hero-search-btn');
    const clearSearchBtn = document.getElementById('clear-search-btn');

    if (testSearchInput) {
        testSearchInput.addEventListener('input', (e) => {
            handleSearch(e.target.value);
            if (clearSearchBtn) {
                if (e.target.value.trim().length > 0) {
                    clearSearchBtn.classList.remove('hidden');
                } else {
                    clearSearchBtn.classList.add('hidden');
                }
            }
        });
    }

    if (heroSearchBtn && heroSearchInput) {
        heroSearchBtn.addEventListener('click', () => {
            const query = heroSearchInput.value.trim();
            if (testSearchInput) {
                testSearchInput.value = query;
                handleSearch(query);
            }
            const catalogSec = document.getElementById('tests-packages-section');
            if (catalogSec) catalogSec.scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (clearSearchBtn && testSearchInput) {
        clearSearchBtn.addEventListener('click', () => {
            testSearchInput.value = '';
            clearSearchBtn.classList.add('hidden');
            handleSearch('');
        });
    }

    // Service type radio buttons (Home vs Center)
    const homeRadio = document.getElementById('collection-type-home');
    const centerRadio = document.getElementById('collection-type-center');
    if (homeRadio) {
        homeRadio.addEventListener('change', () => handleServiceTypeChange('home_collection'));
    }
    if (centerRadio) {
        centerRadio.addEventListener('change', () => handleServiceTypeChange('center_visit'));
    }

    // Booking submit button
    const bookingSubmitBtn = document.getElementById('booking-submit-btn');
    if (bookingSubmitBtn) {
        bookingSubmitBtn.addEventListener('click', submitBooking);
    }

    // Booking success modal close
    const bookingSuccessClose = document.getElementById('booking-success-close');
    if (bookingSuccessClose) {
        bookingSuccessClose.addEventListener('click', closeBookingSuccessModal);
    }

    // Print booking slip
    const printSlipBtn = document.getElementById('print-booking-slip-btn');
    if (printSlipBtn) {
        printSlipBtn.addEventListener('click', () => window.print());
    }

    // Test detail modal close
    const testDetailClose = document.getElementById('test-detail-modal-close');
    if (testDetailClose) {
        testDetailClose.addEventListener('click', closeTestDetailModal);
    }

    // Prescription file input & dropzone
    const dropzone = document.getElementById('prescription-dropzone');
    const fileInput = document.getElementById('prescription-file-input');
    const removeRxFileBtn = document.getElementById('prescription-remove-file');
    const rxSubmitBtn = document.getElementById('rx-submit-btn');

    if (dropzone && fileInput) {
        dropzone.addEventListener('click', () => fileInput.click());
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('border-clinical-teal', 'bg-teal-50/20');
        });
        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('border-clinical-teal', 'bg-teal-50/20');
        });
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('border-clinical-teal', 'bg-teal-50/20');
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handlePrescriptionFile(e.dataTransfer.files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                handlePrescriptionFile(e.target.files[0]);
            }
        });
    }

    if (removeRxFileBtn) {
        removeRxFileBtn.addEventListener('click', () => {
            AppState.booking.prescriptionUploaded = false;
            AppState.booking.prescriptionFileName = '';
            document.getElementById('prescription-preview-area').classList.add('hidden');
            if (fileInput) fileInput.value = '';
        });
    }

    if (rxSubmitBtn) {
        rxSubmitBtn.addEventListener('click', submitPrescriptionForm);
    }

    // Center city filter
    const cityFilter = document.getElementById('center-filter-city');
    if (cityFilter) {
        cityFilter.addEventListener('change', (e) => {
            renderBranches(e.target.value);
        });
    }

    // FAQ Accordion
    const faqButtons = document.querySelectorAll('.faq-toggle');
    faqButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const icon = btn.querySelector('i');
            if (content.classList.contains('hidden')) {
                content.classList.remove('hidden');
                if (icon) icon.classList.add('rotate-180');
            } else {
                content.classList.add('hidden');
                if (icon) icon.classList.remove('rotate-180');
            }
        });
    });
}

/**
 * Catalog tab switching (Tests vs Packages)
 */
function switchCatalogTab(tab) {
    AppState.selectedTab = tab;
    const tabTests = document.getElementById('view-tab-tests');
    const tabPackages = document.getElementById('view-tab-packages');
    const testsGrid = document.getElementById('tests-grid');
    const packagesGrid = document.getElementById('packages-grid');
    const catContainer = document.getElementById('category-filters-container');

    if (tab === 'tests') {
        tabTests.className = 'px-6 py-2.5 rounded-xl font-bold text-sm bg-white text-clinical-navy shadow-sm transition-all';
        tabPackages.className = 'px-6 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:text-clinical-navy transition-all';
        testsGrid.classList.remove('hidden');
        packagesGrid.classList.add('hidden');
        if (catContainer) catContainer.classList.remove('hidden');
        renderTests();
    } else {
        tabPackages.className = 'px-6 py-2.5 rounded-xl font-bold text-sm bg-white text-clinical-navy shadow-sm transition-all';
        tabTests.className = 'px-6 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:text-clinical-navy transition-all';
        packagesGrid.classList.remove('hidden');
        testsGrid.classList.add('hidden');
        if (catContainer) catContainer.classList.add('hidden');
        renderPackages();
    }
}

window.switchViewToPackages = function() {
    switchCatalogTab('packages');
    const catalogSec = document.getElementById('tests-packages-section');
    if (catalogSec) catalogSec.scrollIntoView({ behavior: 'smooth' });
};

/**
 * Render category filter pills
 */
function renderCategoryFilters() {
    const container = document.getElementById('category-filters-container');
    if (!container) return;

    container.innerHTML = DiagnosticData.categories.map(cat => {
        const isActive = AppState.activeCategory === cat.slug;
        return `
            <button onclick="handleCategoryChange('${cat.slug}')" class="whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                isActive 
                ? 'bg-clinical-teal text-white shadow-md shadow-teal-500/20' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }">
                <i class="fa-solid ${cat.icon}"></i>
                <span>${cat.name}</span>
            </button>
        `;
    }).join('');
}

/**
 * Handle category change
 */
function handleCategoryChange(categorySlug) {
    AppState.activeCategory = categorySlug;
    renderCategoryFilters();
    renderTests();
}

/**
 * Handle search query
 */
function handleSearch(query) {
    AppState.searchQuery = query.toLowerCase().trim();
    if (AppState.selectedTab === 'tests') {
        renderTests();
    } else {
        renderPackages();
    }
}

window.resetFilters = function() {
    AppState.activeCategory = 'all';
    AppState.searchQuery = '';
    const searchInput = document.getElementById('test-search-input');
    if (searchInput) searchInput.value = '';
    const clearSearchBtn = document.getElementById('clear-search-btn');
    if (clearSearchBtn) clearSearchBtn.classList.add('hidden');
    renderCategoryFilters();
    renderTests();
    renderPackages();
};

/**
 * Render diagnostic test cards
 */
function renderTests() {
    const grid = document.getElementById('tests-grid');
    const emptyState = document.getElementById('catalog-empty-state');
    if (!grid) return;

    let filtered = DiagnosticData.tests.filter(test => {
        const matchesCategory = AppState.activeCategory === 'all' || test.category === AppState.activeCategory;
        const matchesQuery = AppState.searchQuery === '' ||
            test.name.toLowerCase().includes(AppState.searchQuery) ||
            test.description.toLowerCase().includes(AppState.searchQuery) ||
            test.parametersList.some(p => p.toLowerCase().includes(AppState.searchQuery));
        return matchesCategory && matchesQuery;
    });

    if (filtered.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    grid.innerHTML = filtered.map(test => {
        const discountPercent = Math.round(((test.originalPrice - test.price) / test.originalPrice) * 100);
        const inCart = AppState.cart.some(item => item.id === test.id);

        return `
            <div class="diagnostic-card bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div class="space-y-3">
                    <div class="flex items-center justify-between gap-2">
                        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-clinical-teal">
                            <i class="fa-solid fa-droplet text-[9px]"></i> ${test.sampleType} Sample
                        </span>
                        ${test.isPopular ? '<span class="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">POPULAR</span>' : ''}
                    </div>

                    <h3 class="text-lg font-black text-slate-900 leading-snug hover:text-clinical-navy cursor-pointer" onclick="openTestDetailModal('${test.id}')">
                        ${test.name}
                    </h3>
                    <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        ${test.description}
                    </p>

                    <div class="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                        <span class="flex items-center gap-1"><i class="fa-solid fa-clock text-clinical-teal"></i> ${test.tat}</span>
                        <button onclick="openTestDetailModal('${test.id}')" class="text-clinical-navy font-bold hover:underline flex items-center gap-1">
                            ${test.parametersCount} Parameters <i class="fa-solid fa-angle-right text-[10px]"></i>
                        </button>
                    </div>
                </div>

                <div class="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                        <div class="flex items-baseline gap-2">
                            <span class="text-2xl font-black text-slate-900">$${test.price}</span>
                            <span class="text-xs text-slate-400 line-through">$${test.originalPrice}</span>
                        </div>
                        <span class="text-[10px] font-bold text-emerald-600">${discountPercent}% OFF</span>
                    </div>

                    <button onclick="addToCart('${test.id}', 'test')" data-test-id="${test.id}" class="px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                        inCart 
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                        : 'bg-clinical-navy text-white hover:bg-opacity-90 active:scale-95 shadow-md shadow-slate-900/10'
                    }">
                        <i class="fa-solid ${inCart ? 'fa-check text-emerald-500' : 'fa-plus'}"></i>
                        <span>${inCart ? 'Added' : 'Add to Cart'}</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Render health checkup package cards
 */
function renderPackages() {
    const grid = document.getElementById('packages-grid');
    const emptyState = document.getElementById('catalog-empty-state');
    if (!grid) return;

    let filtered = DiagnosticData.packages.filter(pkg => {
        const matchesQuery = AppState.searchQuery === '' ||
            pkg.title.toLowerCase().includes(AppState.searchQuery) ||
            pkg.targetAudience.toLowerCase().includes(AppState.searchQuery) ||
            pkg.includedCategories.some(c => c.toLowerCase().includes(AppState.searchQuery));
        return matchesQuery;
    });

    if (filtered.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    grid.innerHTML = filtered.map(pkg => {
        const discountPercent = Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100);
        const inCart = AppState.cart.some(item => item.id === pkg.id);

        return `
            <div class="diagnostic-card bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <span class="bg-clinical-navy text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                            ${pkg.badge}
                        </span>
                        <span class="text-xs font-bold text-clinical-teal flex items-center gap-1">
                            <i class="fa-solid fa-vial"></i> ${pkg.totalTestsIncluded} Tests Included
                        </span>
                    </div>

                    <div>
                        <h3 class="text-xl font-black text-slate-900 leading-snug">${pkg.title}</h3>
                        <p class="text-xs text-slate-500 mt-1">${pkg.targetAudience}</p>
                    </div>

                    <div class="space-y-2 pt-2">
                        <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Includes Essential Profiles:</span>
                        <div class="flex flex-wrap gap-1.5">
                            ${pkg.includedCategories.map(cat => `
                                <span class="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                                    ${cat}
                                </span>
                            `).join('')}
                        </div>
                    </div>

                    <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                        <span><i class="fa-solid fa-mug-saucer text-clinical-teal mr-1"></i> ${pkg.fastingReq}</span>
                        <span><i class="fa-solid fa-clock text-clinical-teal mr-1"></i> TAT: ${pkg.reportTat}</span>
                    </div>
                </div>

                <div class="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                        <div class="flex items-baseline gap-2">
                            <span class="text-2xl font-black text-slate-900">$${pkg.price}</span>
                            <span class="text-xs text-slate-400 line-through">$${pkg.originalPrice}</span>
                        </div>
                        <span class="text-[10px] font-bold text-emerald-600">${discountPercent}% OFF Total Value</span>
                    </div>

                    <button onclick="addToCart('${pkg.id}', 'package')" data-pkg-id="${pkg.id}" class="px-5 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                        inCart 
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                        : 'bg-clinical-teal text-white hover:bg-teal-600 active:scale-95 shadow-md shadow-teal-500/20'
                    }">
                        <i class="fa-solid ${inCart ? 'fa-check text-emerald-500' : 'fa-box-archive'}"></i>
                        <span>${inCart ? 'Booked' : 'Book Package'}</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Render diagnostic center branches
 */
function renderBranches(cityFilter = 'all') {
    const grid = document.getElementById('branches-grid');
    if (!grid) return;

    let branches = DiagnosticData.centers;
    if (cityFilter !== 'all') {
        branches = branches.filter(b => b.city === cityFilter);
    }

    grid.innerHTML = branches.map(center => `
        <div class="bg-slate-50 rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-clinical-teal transition-all">
            <div class="flex items-start justify-between">
                <div class="w-10 h-10 rounded-xl bg-teal-50 text-clinical-teal flex items-center justify-center text-lg font-bold">
                    <i class="fa-solid fa-hospital"></i>
                </div>
                <span class="bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full">
                    ${center.city}
                </span>
            </div>

            <div>
                <h4 class="text-lg font-black text-slate-900">${center.name}</h4>
                <p class="text-xs text-slate-500 mt-1"><i class="fa-solid fa-location-dot text-clinical-teal mr-1"></i> ${center.address}</p>
            </div>

            <div class="space-y-2 text-xs text-slate-600 border-t border-slate-200 pt-3">
                <p><i class="fa-solid fa-phone text-clinical-navy mr-2"></i><strong>Helpdesk:</strong> ${center.phone}</p>
                <p><i class="fa-solid fa-clock text-clinical-navy mr-2"></i><strong>Hours:</strong> ${center.timing}</p>
            </div>

            <div class="space-y-1 pt-1">
                <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Available Facilities:</span>
                <div class="flex flex-wrap gap-1.5">
                    ${center.facilities.map(f => `
                        <span class="bg-white border border-slate-200 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                            ${f}
                        </span>
                    `).join('')}
                </div>
            </div>

            <a href="${center.mapUrl}" target="_blank" rel="noopener noreferrer" class="block w-full text-center bg-white border border-slate-200 hover:border-clinical-navy text-clinical-navy text-xs font-bold py-2.5 rounded-xl transition-all">
                <i class="fa-solid fa-map-location-dot mr-1"></i> View on Google Maps
            </a>
        </div>
    `).join('');
}

function populateCenterDropdown() {
    const select = document.getElementById('booking-center-select');
    if (!select) return;

    select.innerHTML = DiagnosticData.centers.map(c => `
        <option value="${c.id}">${c.name} (${c.city})</option>
    `).join('');
}

/**
 * ==========================================================
 * CART & CHECKOUT PIPELINE
 * ==========================================================
 */

function addToCart(itemId, itemType) {
    const existingIndex = AppState.cart.findIndex(i => i.id === itemId);
    if (existingIndex > -1) {
        showToast('Item is already in your booking list', 'info');
        openCartDrawer();
        return;
    }

    let foundItem = null;
    if (itemType === 'test') {
        foundItem = DiagnosticData.tests.find(t => t.id === itemId);
    } else {
        foundItem = DiagnosticData.packages.find(p => p.id === itemId);
    }

    if (!foundItem) return;

    AppState.cart.push({
        id: foundItem.id,
        name: foundItem.name || foundItem.title,
        price: foundItem.price,
        originalPrice: foundItem.originalPrice,
        type: itemType,
        sampleType: foundItem.sampleType || 'Multiple Tests'
    });

    StorageService.saveCart(AppState.cart);
    recalculateCartTotals();
    updateCartUI();
    renderTests();
    renderPackages();

    showToast(`${foundItem.name || foundItem.title} added to your booking list`, 'success');
}

function removeFromCart(itemId) {
    AppState.cart = AppState.cart.filter(item => item.id !== itemId);
    StorageService.saveCart(AppState.cart);
    recalculateCartTotals();
    updateCartUI();
    renderTests();
    renderPackages();
    showToast('Item removed from cart', 'info');
}

function recalculateCartTotals() {
    let subtotal = 0;
    let originalTotal = 0;

    AppState.cart.forEach(item => {
        subtotal += Number(item.price);
        originalTotal += Number(item.originalPrice);
    });

    AppState.pricing.subtotal = subtotal;
    AppState.pricing.discountAmount = Math.max(0, originalTotal - subtotal);

    // Home collection fee logic:
    // If center visit, fee is $0.
    // If home collection, fee is $15, but FREE if subtotal >= 60.
    if (AppState.booking.serviceType === 'center_visit') {
        AppState.pricing.homeCollectionFee = 0;
    } else {
        if (AppState.pricing.subtotal >= AppState.pricing.freeCollectionThreshold || AppState.pricing.subtotal === 0) {
            AppState.pricing.homeCollectionFee = 0;
        } else {
            AppState.pricing.homeCollectionFee = 15;
        }
    }

    AppState.pricing.grandTotal = AppState.pricing.subtotal + AppState.pricing.homeCollectionFee;
}

function updateCartUI() {
    // Badges
    const badgeDesktop = document.getElementById('cart-badge-desktop');
    const badgeMobile = document.getElementById('cart-badge-mobile');
    const count = AppState.cart.length;

    if (badgeDesktop) badgeDesktop.innerText = count;
    if (badgeMobile) badgeMobile.innerText = count;

    // Items container
    const itemsContainer = document.getElementById('cart-items-container');
    const emptyMsg = document.getElementById('cart-empty-message');
    const summarySec = document.getElementById('cart-summary-section');

    if (count === 0) {
        if (itemsContainer) itemsContainer.innerHTML = '';
        if (emptyMsg) emptyMsg.classList.remove('hidden');
        if (summarySec) summarySec.classList.add('hidden');
    } else {
        if (emptyMsg) emptyMsg.classList.add('hidden');
        if (summarySec) summarySec.classList.remove('hidden');

        if (itemsContainer) {
            itemsContainer.innerHTML = AppState.cart.map(item => `
                <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                        <h4 class="text-sm font-bold text-slate-800">${item.name}</h4>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="text-xs font-black text-clinical-navy">$${item.price}</span>
                            <span class="text-[10px] text-slate-400 line-through">$${item.originalPrice}</span>
                            <span class="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full capitalize">${item.type}</span>
                        </div>
                    </div>
                    <button onclick="removeFromCart('${item.id}')" class="text-slate-400 hover:text-rose-500 p-2 text-sm transition-colors">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `).join('');
        }
    }

    // Summary Prices
    const subtotalEl = document.getElementById('cart-subtotal-price');
    const collectionFeeEl = document.getElementById('cart-collection-fee');
    const grandTotalEl = document.getElementById('cart-grand-total');
    const discountRow = document.getElementById('discount-row');
    const discountVal = document.getElementById('cart-discount-value');

    if (subtotalEl) subtotalEl.innerText = `$${AppState.pricing.subtotal.toFixed(2)}`;
    
    if (collectionFeeEl) {
        if (AppState.pricing.homeCollectionFee === 0) {
            collectionFeeEl.innerHTML = '<span class="text-emerald-600 font-bold uppercase text-xs">FREE</span>';
        } else {
            collectionFeeEl.innerText = `$${AppState.pricing.homeCollectionFee.toFixed(2)}`;
        }
    }

    if (discountRow && discountVal) {
        if (AppState.pricing.discountAmount > 0) {
            discountRow.classList.remove('hidden');
            discountVal.innerText = `-$${AppState.pricing.discountAmount.toFixed(2)}`;
        } else {
            discountRow.classList.add('hidden');
        }
    }

    if (grandTotalEl) grandTotalEl.innerText = `$${AppState.pricing.grandTotal.toFixed(2)}`;
}

function handleServiceTypeChange(type) {
    AppState.booking.serviceType = type;
    const centerSelectWrapper = document.getElementById('center-select-wrapper');
    const addressWrapper = document.getElementById('address-field-wrapper');
    const pincodeWrapper = document.getElementById('pincode-field-wrapper');

    if (type === 'center_visit') {
        if (centerSelectWrapper) centerSelectWrapper.classList.remove('hidden');
        if (addressWrapper) addressWrapper.classList.add('hidden');
        if (pincodeWrapper) pincodeWrapper.classList.add('hidden');
    } else {
        if (centerSelectWrapper) centerSelectWrapper.classList.add('hidden');
        if (addressWrapper) addressWrapper.classList.remove('hidden');
        if (pincodeWrapper) pincodeWrapper.classList.remove('hidden');
    }

    recalculateCartTotals();
    updateCartUI();
}

function openCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');
    if (drawer && overlay) {
        overlay.classList.remove('hidden');
        drawer.classList.remove('translate-x-full');
        document.body.classList.add('overflow-hidden');
    }
}

function closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');
    if (drawer && overlay) {
        drawer.classList.add('translate-x-full');
        overlay.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }
}

function validateBookingForm() {
    const errorEl = document.getElementById('booking-error-msg');
    const name = document.getElementById('booking-patient-name').value.trim();
    const age = document.getElementById('booking-patient-age').value.trim();
    const phone = document.getElementById('booking-patient-phone').value.trim();
    const date = document.getElementById('booking-date-picker').value;

    if (AppState.cart.length === 0) {
        if (errorEl) {
            errorEl.innerText = 'Your booking cart is empty. Please add diagnostic tests or packages.';
            errorEl.classList.remove('hidden');
        }
        return false;
    }

    if (name.length < 3) {
        if (errorEl) {
            errorEl.innerText = 'Please enter a valid patient full name (minimum 3 characters).';
            errorEl.classList.remove('hidden');
        }
        return false;
    }

    const ageNum = parseInt(age, 10);
    if (!age || isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        if (errorEl) {
            errorEl.innerText = 'Please enter a valid age between 1 and 120.';
            errorEl.classList.remove('hidden');
        }
        return false;
    }

    if (phone.length < 10) {
        if (errorEl) {
            errorEl.innerText = 'Please enter a valid 10-digit mobile number for appointment SMS.';
            errorEl.classList.remove('hidden');
        }
        return false;
    }

    if (AppState.booking.serviceType === 'home_collection') {
        const address = document.getElementById('booking-address').value.trim();
        const pincode = document.getElementById('booking-pincode').value.trim();
        if (!address || !pincode) {
            if (errorEl) {
                errorEl.innerText = 'Please provide full address and PIN code for home sample collection.';
                errorEl.classList.remove('hidden');
            }
            return false;
        }
    }

    if (!date) {
        if (errorEl) {
            errorEl.innerText = 'Please select a preferred appointment date.';
            errorEl.classList.remove('hidden');
        }
        return false;
    }

    if (errorEl) errorEl.classList.add('hidden');
    return true;
}

function submitBooking() {
    if (!validateBookingForm()) return;

    const bookingId = `OD-${Math.floor(100000 + Math.random() * 900000)}`;
    const patientName = document.getElementById('booking-patient-name').value.trim();
    const serviceType = AppState.booking.serviceType === 'home_collection' ? 'Home Sample Collection' : 'Diagnostic Center Visit';
    const date = document.getElementById('booking-date-picker').value;
    const slot = document.getElementById('booking-slot-select').value;
    const totalPaid = `$${AppState.pricing.grandTotal.toFixed(2)}`;

    const confirmedOrder = {
        bookingId,
        patientName,
        serviceType,
        dateSlot: `${date} | ${slot}`,
        totalPaid,
        items: [...AppState.cart],
        timestamp: new Date().toISOString()
    };

    StorageService.saveOrder(confirmedOrder);
    AppState.lastConfirmedBooking = confirmedOrder;

    // Populate Success Modal
    document.getElementById('confirmed-booking-id').innerText = bookingId;
    document.getElementById('confirmed-patient-name').innerText = patientName;
    document.getElementById('confirmed-service-type').innerText = serviceType;
    document.getElementById('confirmed-date-slot').innerText = `${date} | ${slot}`;
    document.getElementById('confirmed-total-paid').innerText = totalPaid;

    // Reset Cart
    AppState.cart = [];
    StorageService.saveCart([]);
    recalculateCartTotals();
    updateCartUI();
    renderTests();
    renderPackages();

    closeCartDrawer();
    openBookingSuccessModal();
}

function openBookingSuccessModal() {
    const modal = document.getElementById('booking-success-modal');
    if (modal) modal.classList.remove('hidden');
}

window.closeBookingSuccessModal = function() {
    const modal = document.getElementById('booking-success-modal');
    if (modal) modal.classList.add('hidden');
};

/**
 * ==========================================================
 * TEST DETAIL MODAL PIPELINE
 * ==========================================================
 */

function openTestDetailModal(testId) {
    const test = DiagnosticData.tests.find(t => t.id === testId);
    if (!test) return;

    AppState.activeTestDetail = test;

    document.getElementById('test-detail-title').innerText = test.name;
    document.getElementById('test-detail-badge').innerText = test.fastingReq;
    document.getElementById('test-detail-description').innerText = test.description;
    document.getElementById('test-detail-sample').innerText = test.sampleType;
    document.getElementById('test-detail-fasting').innerText = test.fastingReq;
    document.getElementById('test-detail-tat').innerText = test.tat;
    document.getElementById('test-detail-price').innerText = `$${test.price}`;
    document.getElementById('test-detail-mrp').innerText = `$${test.originalPrice}`;

    const paramsListEl = document.getElementById('test-detail-parameters-list');
    if (paramsListEl) {
        paramsListEl.innerHTML = test.parametersList.map(param => `
            <li class="flex items-center gap-2">
                <i class="fa-solid fa-check text-clinical-teal text-[10px]"></i>
                <span>${param}</span>
            </li>
        `).join('');
    }

    const addBtn = document.getElementById('test-detail-add-btn');
    if (addBtn) {
        addBtn.onclick = () => {
            addToCart(test.id, 'test');
            closeTestDetailModal();
        };
    }

    const modal = document.getElementById('test-detail-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeTestDetailModal() {
    const modal = document.getElementById('test-detail-modal');
    if (modal) modal.classList.add('hidden');
}

/**
 * ==========================================================
 * PRESCRIPTION UPLOAD PIPELINE
 * ==========================================================
 */

function openPrescriptionModal() {
    const modal = document.getElementById('upload-prescription-modal');
    if (modal) modal.classList.remove('hidden');
}

function closePrescriptionModal() {
    const modal = document.getElementById('upload-prescription-modal');
    if (modal) modal.classList.add('hidden');
}

function handlePrescriptionFile(file) {
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowed.includes(file.type)) {
        showToast('Please upload a JPG, PNG or PDF document.', 'warning');
        return;
    }
    if (file.size > 10 * 1024 * 1024) {
        showToast('File size must be under 10MB.', 'warning');
        return;
    }

    AppState.booking.prescriptionUploaded = true;
    AppState.booking.prescriptionFileName = file.name;

    const previewArea = document.getElementById('prescription-preview-area');
    const previewName = document.getElementById('prescription-preview-name');

    if (previewArea && previewName) {
        previewName.innerText = file.name;
        previewArea.classList.remove('hidden');
    }

    showToast('Prescription attached successfully', 'success');
}

function submitPrescriptionForm() {
    const name = document.getElementById('rx-patient-name').value.trim();
    const phone = document.getElementById('rx-patient-phone').value.trim();

    if (!AppState.booking.prescriptionUploaded) {
        showToast('Please upload an image or PDF of your prescription first.', 'warning');
        return;
    }
    if (name.length < 3 || phone.length < 10) {
        showToast('Please enter valid patient name and 10-digit phone number.', 'warning');
        return;
    }

    const successState = document.getElementById('rx-success-state');
    const submitBtn = document.getElementById('rx-submit-btn');

    if (submitBtn) submitBtn.classList.add('hidden');
    if (successState) successState.classList.remove('hidden');

    showToast('Prescription submitted! Advisor callback scheduled.', 'success');
}

/**
 * ==========================================================
 * REPORT TRACKING PIPELINE
 * ==========================================================
 */

function openReportTrackerModal() {
    const modal = document.getElementById('report-tracker-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeReportTrackerModal() {
    const modal = document.getElementById('report-tracker-modal');
    if (modal) modal.classList.add('hidden');
}

function searchPatientReports() {
    const phoneInput = document.getElementById('report-search-phone');
    const idInput = document.getElementById('report-search-id');
    const errorEl = document.getElementById('report-search-error');
    const resultsContainer = document.getElementById('report-results-list');
    const detailView = document.getElementById('report-detail-view');

    const phone = phoneInput ? phoneInput.value.trim() : '';
    const reportId = idInput ? idInput.value.trim().toUpperCase() : '';

    if (!phone && !reportId) {
        showToast('Please enter your registered phone number or Report ID', 'warning');
        return;
    }

    const matchedReports = DiagnosticData.reports.filter(r => {
        const phoneMatch = phone !== '' && r.phone === phone;
        const idMatch = reportId !== '' && r.reportId.toUpperCase() === reportId;
        return phoneMatch || idMatch;
    });

    if (matchedReports.length === 0) {
        if (errorEl) errorEl.classList.remove('hidden');
        if (resultsContainer) resultsContainer.innerHTML = '';
        if (detailView) detailView.classList.add('hidden');
        return;
    }

    if (errorEl) errorEl.classList.add('hidden');
    if (detailView) detailView.classList.add('hidden');

    if (resultsContainer) {
        resultsContainer.innerHTML = matchedReports.map(rep => `
            <div class="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-slate-800">${rep.reportId}</span>
                    <span class="text-[10px] font-extrabold px-3 py-1 rounded-full ${
                        rep.status === 'Ready' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }">
                        ${rep.status.toUpperCase()}
                    </span>
                </div>

                <div>
                    <h4 class="text-base font-black text-slate-900">${rep.testName}</h4>
                    <p class="text-xs text-slate-500">Patient: <strong>${rep.patientName}</strong> | Collection: ${rep.collectionDate}</p>
                    <p class="text-[11px] text-slate-400 mt-0.5">Approved by: ${rep.doctorName}</p>
                </div>

                <div class="pt-2 flex items-center justify-between gap-2 border-t border-slate-200">
                    <button onclick="viewReportDetails('${rep.reportId}')" class="text-clinical-navy font-bold text-xs hover:underline">
                        View Complete Breakdown
                    </button>
                    ${
                        rep.status === 'Ready'
                        ? `<button onclick="downloadMockReportPDF('${rep.reportId}')" class="bg-clinical-teal text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-teal-600 transition-all flex items-center gap-1.5 shadow">
                            <i class="fa-solid fa-download"></i> Download Report PDF
                        </button>`
                        : `<span class="text-xs text-slate-400 italic">Processing in Lab...</span>`
                    }
                </div>
            </div>
        `).join('');
    }
}

window.viewReportDetails = function(reportId) {
    const report = DiagnosticData.reports.find(r => r.reportId === reportId);
    if (!report) return;

    const detailView = document.getElementById('report-detail-view');
    if (!detailView) return;

    detailView.innerHTML = `
        <div class="bg-white border-2 border-slate-200 rounded-2xl p-6 space-y-4">
            <div class="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                    <h3 class="font-black text-slate-900 text-lg">OneDignostic Laboratory Report</h3>
                    <p class="text-xs text-slate-500">Report ID: <strong>${report.reportId}</strong> | Patient: <strong>${report.patientName}</strong></p>
                </div>
                <button id="report-download-pdf-btn" onclick="downloadMockReportPDF('${report.reportId}')" class="bg-clinical-navy text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <i class="fa-solid fa-print"></i> Print / PDF
                </button>
            </div>

            <table class="w-full text-left text-xs">
                <thead>
                    <tr class="text-slate-400 border-b border-slate-100 uppercase text-[10px]">
                        <th class="pb-2">Test Parameter</th>
                        <th class="pb-2">Observed Value</th>
                        <th class="pb-2">Biological Reference</th>
                        <th class="pb-2">Status</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700">
                    ${report.results.map(res => `
                        <tr>
                            <td class="py-2.5 font-medium">${res.parameter}</td>
                            <td class="py-2.5 font-bold ${res.status === 'High' ? 'text-rose-600' : 'text-slate-900'}">${res.value}</td>
                            <td class="py-2.5 text-slate-500">${res.referenceRange}</td>
                            <td class="py-2.5">
                                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${
                                    res.status === 'Normal' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                }">${res.status}</span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between items-center">
                <span>Verified by: ${report.doctorName}</span>
                <span>NABL Quality Control Certified</span>
            </div>
        </div>
    `;

    detailView.classList.remove('hidden');
};

function downloadMockReportPDF(reportId) {
    showToast(`Generating laboratory PDF for ${reportId}...`, 'info');
    setTimeout(() => {
        window.print();
    }, 500);
}

/**
 * ==========================================================
 * HEALTH RISK ADVISOR PIPELINE
 * ==========================================================
 */

function openHealthAdvisorModal() {
    const modal = document.getElementById('health-advisor-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeHealthAdvisorModal() {
    const modal = document.getElementById('health-advisor-modal');
    if (modal) modal.classList.add('hidden');
}

function evaluateHealthRiskAssessment() {
    const age = document.getElementById('advisor-age-select').value;
    const gender = document.getElementById('advisor-gender-select').value;
    const chkFatigue = document.getElementById('advisor-chk-fatigue').checked;
    const chkDiabetes = document.getElementById('advisor-chk-diabetes').checked;
    const chkCardiac = document.getElementById('advisor-chk-cardiac').checked;
    const chkJoints = document.getElementById('advisor-chk-joints').checked;

    let recommendedPackages = [];
    let recommendedTests = [];

    if (age === 'senior') {
        recommendedPackages.push(DiagnosticData.packages.find(p => p.id === 'pkg-senior-04'));
    } else if (age === 'middle' || chkCardiac || chkDiabetes) {
        recommendedPackages.push(DiagnosticData.packages.find(p => p.id === 'pkg-gold-03'));
    } else {
        recommendedPackages.push(DiagnosticData.packages.find(p => p.id === 'pkg-active-02'));
    }

    if (chkFatigue || chkJoints) {
        recommendedTests.push(DiagnosticData.tests.find(t => t.id === 't-vitd-07'));
        recommendedTests.push(DiagnosticData.tests.find(t => t.id === 't-vitb12-08'));
    }
    if (chkDiabetes) {
        recommendedTests.push(DiagnosticData.tests.find(t => t.id === 't-hba1c-03'));
    }

    const resultsArea = document.getElementById('advisor-results-area');
    if (!resultsArea) return;

    const primaryPkg = recommendedPackages[0];

    resultsArea.innerHTML = `
        <div class="space-y-4 pt-4 border-t border-slate-200">
            <div class="bg-teal-50 border border-teal-200 p-4 rounded-2xl">
                <span class="text-[10px] font-bold text-clinical-teal uppercase tracking-wider block">Recommended Package for You:</span>
                <h4 class="text-base font-black text-slate-900 mt-1">${primaryPkg.title}</h4>
                <p class="text-xs text-slate-600 mt-1">${primaryPkg.targetAudience} • Includes ${primaryPkg.totalTestsIncluded} tests.</p>
                <div class="mt-3 flex items-center justify-between">
                    <span class="text-xl font-black text-slate-900">$${primaryPkg.price}</span>
                    <button id="advisor-add-all-btn" onclick="addToCart('${primaryPkg.id}', 'package'); closeHealthAdvisorModal();" class="bg-clinical-teal text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-teal-600">
                        Add to Cart & Schedule
                    </button>
                </div>
            </div>

            ${recommendedTests.length > 0 ? `
                <div class="space-y-2">
                    <span class="text-xs font-bold text-slate-700">Complementary Recommended Blood Tests:</span>
                    <div class="space-y-2">
                        ${recommendedTests.map(t => `
                            <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                                <div>
                                    <span class="font-bold text-slate-800">${t.name}</span>
                                    <span class="text-slate-500 block text-[10px]">$${t.price}</span>
                                </div>
                                <button onclick="addToCart('${t.id}', 'test')" class="text-clinical-navy font-bold hover:underline">
                                    + Add
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;

    resultsArea.classList.remove('hidden');
}

/**
 * ==========================================================
 * TOAST NOTIFICATION UTILITY
 * ==========================================================
 */

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast-notification');
    const toastMsg = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');

    if (!toast || !toastMsg) return;

    toastMsg.innerText = message;

    if (toastIcon) {
        if (type === 'warning') {
            toastIcon.className = 'text-amber-400 text-lg';
            toastIcon.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
        } else if (type === 'info') {
            toastIcon.className = 'text-sky-400 text-lg';
            toastIcon.innerHTML = '<i class="fa-solid fa-circle-info"></i>';
        } else {
            toastIcon.className = 'text-teal-400 text-lg';
            toastIcon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        }
    }

    toast.classList.remove('translate-y-[-200%]', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-[-200%]', 'opacity-0');
    }, 3200);
}
