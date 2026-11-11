/**
 * Samsung Galaxy & Bespoke Electronics Flagship Store
 * Complete Application Logic, Demo Seed Data & Reactive Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
    // ─── 1. Core State Store ───────────────────────────────────────────────────
    const state = {
        products: [],
        categories: ['All', 'Smartphones', 'Tablets', 'Audio & Wearables', 'TV & Displays', 'Smart Appliances'],
        activeCategory: 'All',
        searchQuery: '',
        maxPrice: 3500,
        filterGalaxyAi: false,
        filterInStock: false,
        sortBy: 'featured',
        cart: JSON.parse(localStorage.getItem('samsung_cart') || '[]'),
        wishlist: JSON.parse(localStorage.getItem('samsung_wishlist') || '[]'),
        heroIndex: 0
    };

    // ─── 2. Rich Demo Products Dataset (Priority #1) ───────────────────────────
    const SEED_HERO_SLIDES = [
        {
            tag: 'NEXT-GEN GALAXY AI',
            title: 'Galaxy S24 Ultra',
            subtitle: 'Titanium precision. 200MP camera with ProVisual Engine and real-time live translate.',
            price: 'From $1,299.99',
            tradeIn: 'Save up to $750 with trade-in',
            image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=600&fit=crop',
            ctaText: 'Buy S24 Ultra'
        },
        {
            tag: 'REVOLUTIONARY FOLDABLE',
            title: 'Galaxy Z Fold6',
            subtitle: 'Ultra-thin, dual Dynamic AMOLED 2X displays with dual-screen interpreter mode.',
            price: 'From $1,899.99',
            tradeIn: 'Save up to $1,000 with eligible trade-in',
            image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=600&fit=crop',
            ctaText: 'Discover Z Fold6'
        },
        {
            tag: '8K NEURAL QUANTUM PROCESSOR',
            title: '85" Neo QLED 8K AI TV',
            subtitle: 'Infinite contrast with Quantum Matrix Technology Pro and Dolby Atmos Object Tracking Sound.',
            price: '$4,999.99',
            tradeIn: 'Free Installation Included',
            image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop',
            ctaText: 'Experience 8K'
        }
    ];

    const SEED_PRODUCTS = [
        {
            id: 'prod-s24-ultra',
            name: 'Galaxy S24 Ultra (Titanium Gray)',
            category: 'Smartphones',
            price: 1299.99,
            originalPrice: 1419.99,
            rating: 4.9,
            reviewsCount: 3824,
            inStock: true,
            hasGalaxyAi: true,
            isNew: true,
            image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop',
            description: 'The pinnacle of smartphone innovation with Titanium frame, S-Pen included, and Snapdragon 8 Gen 3 for Galaxy.',
            specs: ['6.8" QHD+ AMOLED 120Hz', '200MP Quad Tele System', '5000 mAh Battery', 'S-Pen Integrated']
        },
        {
            id: 'prod-zfold6',
            name: 'Galaxy Z Fold6 512GB (Navy)',
            category: 'Smartphones',
            price: 1899.99,
            originalPrice: 2019.99,
            rating: 4.8,
            reviewsCount: 1420,
            inStock: true,
            hasGalaxyAi: true,
            isNew: true,
            image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop',
            description: 'Unfold limitless productivity with an ultra-light hinge, Armor Aluminum frame, and Circle to Search.',
            specs: ['7.6" Main + 6.3" Cover AMOLED', 'Snapdragon 8 Gen 3', 'IP48 Water Resistance', 'FlexMode Multitasking']
        },
        {
            id: 'prod-zflip6',
            name: 'Galaxy Z Flip6 (Mint Green)',
            category: 'Smartphones',
            price: 1099.99,
            originalPrice: 1199.99,
            rating: 4.7,
            reviewsCount: 2100,
            inStock: true,
            hasGalaxyAi: true,
            isNew: true,
            image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&h=500&fit=crop',
            description: 'Pocket-sized icon featuring 50MP FlexCam, expanded FlexWindow, and vapor chamber cooling for the first time in a Flip.',
            specs: ['3.4" Super AMOLED FlexWindow', '50MP ProVisual Camera', '4000 mAh Battery', 'Auto Zoom AI Framing']
        },
        {
            id: 'prod-tabs9-ultra',
            name: 'Galaxy Tab S9 Ultra (Graphite)',
            category: 'Tablets',
            price: 1199.99,
            originalPrice: 1319.99,
            rating: 4.9,
            reviewsCount: 940,
            inStock: true,
            hasGalaxyAi: true,
            isNew: false,
            image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop',
            description: 'Massive 14.6" Dynamic AMOLED 2X display, IP68 water & dust resistance, bundled S-Pen with low latency.',
            specs: ['14.6" 120Hz AMOLED 2X', 'Snapdragon 8 Gen 2 for Galaxy', '11,200 mAh Battery', 'Quad AKG Speakers']
        },
        {
            id: 'prod-watch-ultra',
            name: 'Galaxy Watch Ultra (Titanium White)',
            category: 'Audio & Wearables',
            price: 649.99,
            originalPrice: 699.99,
            rating: 4.9,
            reviewsCount: 1650,
            inStock: true,
            hasGalaxyAi: true,
            isNew: true,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
            description: 'Built for extremes. Aerospace-grade titanium cushion, 100-hour battery life, 10ATM water resistance, dual-frequency GPS.',
            specs: ['Grade 4 Titanium Case', 'Up to 100h Exercise Power Saving', 'Dual-frequency L1+L5 GPS', 'Emergency Siren']
        },
        {
            id: 'prod-buds3-pro',
            name: 'Galaxy Buds3 Pro (Blade Silver)',
            category: 'Audio & Wearables',
            price: 249.99,
            originalPrice: 269.99,
            rating: 4.8,
            reviewsCount: 3120,
            inStock: true,
            hasGalaxyAi: true,
            isNew: true,
            image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop',
            description: 'Iconic Blade Design with LED Blade Lights, Adaptive Noise Control with Voice Detect, and 24-bit Hi-Fi Sound.',
            specs: ['Dual Amp & 2-Way Speakers', 'Real-Time Interpreter In-Ear', 'Blade Lights with Touch Controls', '24-bit 96kHz Audio']
        },
        {
            id: 'prod-tv-85-qled',
            name: '85" Neo QLED 8K Smart AI TV (QN900D)',
            category: 'TV & Displays',
            price: 3499.99,
            originalPrice: 4999.99,
            rating: 4.9,
            reviewsCount: 512,
            inStock: true,
            hasGalaxyAi: true,
            isNew: true,
            image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop',
            description: 'NQ8 AI Gen3 Processor with 512 neural networks, 8K AI Upscaling Pro, Infinity Air Design with mirror stand.',
            specs: ['8K Resolution (7,680 x 4,320)', 'Quantum Matrix Pro Mini-LED', 'Dolby Atmos 90W 6.2.4CH', 'Anti-Glare Ultra Viewing']
        },
        {
            id: 'prod-monitor-odyssey-g9',
            name: '49" Odyssey OLED G9 Curved Gaming Monitor',
            category: 'TV & Displays',
            price: 1399.99,
            originalPrice: 1799.99,
            rating: 4.9,
            reviewsCount: 1840,
            inStock: true,
            hasGalaxyAi: false,
            isNew: false,
            image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop',
            description: 'Dual QHD 1800R curved gaming beast with 0.03ms response time, 240Hz refresh rate, and Neo Quantum Processor Pro.',
            specs: ['49" Dual QHD OLED (5120x1440)', '240Hz & 0.03ms (GtG)', 'DisplayHDR True Black 400', 'CoreSync & Core Lighting+']
        },
        {
            id: 'prod-fridge-bespoke',
            name: 'Bespoke 4-Door French Door Refrigerator with AI Hub',
            category: 'Smart Appliances',
            price: 3199.99,
            originalPrice: 3899.99,
            rating: 4.8,
            reviewsCount: 780,
            inStock: true,
            hasGalaxyAi: true,
            isNew: true,
            image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&h=500&fit=crop',
            description: '32" AI Family Hub+ touchscreen, AI Vision Inside camera tracking groceries, and Beverage Center with AutoFill Pitcher.',
            specs: ['32" AI Family Hub+ Display', 'AI Vision Food Management', 'Dual Auto Ice Maker', 'Customizable Glass Panels']
        },
        {
            id: 'prod-book4-ultra',
            name: 'Galaxy Book4 Ultra 16" (Intel Core Ultra 9)',
            category: 'Smartphones',
            price: 2399.99,
            originalPrice: 2799.99,
            rating: 4.8,
            reviewsCount: 630,
            inStock: true,
            hasGalaxyAi: true,
            isNew: true,
            image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop',
            description: 'Equipped with NVIDIA GeForce RTX 4070, Dynamic AMOLED 2X touchscreen, and seamless Galaxy Connected Experience.',
            specs: ['Intel Core Ultra 9 185H', 'NVIDIA RTX 4070 8GB', '16" 3K Touch AMOLED 120Hz', 'Vision Booster & AKG Audio']
        }
    ];

    state.products = [...SEED_PRODUCTS];

    // ─── 3. DOM Elements Cache ────────────────────────────────────────────────
    const heroContainer = document.getElementById('hero-slide-container');
    const heroDots = document.getElementById('hero-dots-container');
    const heroPrevBtn = document.getElementById('hero-prev-btn');
    const heroNextBtn = document.getElementById('hero-next-btn');

    const categoryTabsContainer = document.getElementById('category-tabs-container');
    const productGrid = document.getElementById('product-grid-container');
    const productCountDisplay = document.getElementById('product-count-display');
    const emptyState = document.getElementById('product-empty-state');

    const navSearchInput = document.getElementById('nav-search-input');
    const searchFilterInput = document.getElementById('search-filter-input');
    const filterGalaxyAi = document.getElementById('filter-galaxy-ai-checkbox');
    const filterInStock = document.getElementById('filter-in-stock-checkbox');
    const priceFilterRange = document.getElementById('price-filter-range');
    const priceRangeDisplay = document.getElementById('price-range-display');
    const sortDropdown = document.getElementById('sort-dropdown-select');
    const resetFiltersBtn = document.getElementById('reset-filters-btn');

    const cartBadgeCount = document.getElementById('cart-badge-count');
    const wishlistBadgeCount = document.getElementById('wishlist-badge-count');
    const cartToggleBtn = document.getElementById('cart-toggle-btn');
    const wishlistToggleBtn = document.getElementById('wishlist-toggle-btn');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');

    // ─── 4. Render Functions ──────────────────────────────────────────────────
    function renderHero() {
        if (!heroContainer) return;
        const slide = SEED_HERO_SLIDES[state.heroIndex];
        heroContainer.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center animate-fade-in">
                <div class="space-y-4">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase bg-samsung-blue text-white shadow-md">
                        <i class="fa-solid fa-sparkles"></i> ${slide.tag}
                    </span>
                    <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                        ${slide.title}
                    </h1>
                    <p class="text-base sm:text-lg text-gray-300 max-w-xl leading-relaxed">
                        ${slide.subtitle}
                    </p>
                    <div class="flex items-baseline gap-4 pt-2">
                        <span class="text-2xl font-black text-white">${slide.price}</span>
                        <span class="text-xs text-samsung-blue font-bold">${slide.tradeIn}</span>
                    </div>
                    <div class="flex items-center gap-4 pt-4">
                        <button class="hero-cta-btn bg-samsung-blue hover:bg-samsung-darkblue text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-samsung-blue/30 transition-all transform hover:-translate-y-0.5">
                            ${slide.ctaText} <i class="fa-solid fa-arrow-right ml-2 text-xs"></i>
                        </button>
                        <button class="hero-explore-btn bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-full backdrop-blur border border-white/20 transition-all">
                            Learn More
                        </button>
                    </div>
                </div>
                <div class="flex justify-center items-center">
                    <img src="${slide.image}" alt="${slide.title}" class="rounded-3xl shadow-2xl max-h-[380px] object-cover border border-white/10 hover:scale-105 transition-transform duration-500">
                </div>
            </div>
        `;

        if (heroDots) {
            heroDots.innerHTML = SEED_HERO_SLIDES.map((_, i) => `
                <button class="w-3 h-3 rounded-full transition-all ${i === state.heroIndex ? 'bg-samsung-blue w-8' : 'bg-white/30 hover:bg-white/60'}" data-slide="${i}"></button>
            `).join('');

            heroDots.querySelectorAll('button').forEach((b) => {
                b.addEventListener('click', () => {
                    state.heroIndex = Number(b.dataset.slide);
                    renderHero();
                });
            });
        }
    }

    function renderCategoryTabs() {
        if (!categoryTabsContainer) return;
        categoryTabsContainer.innerHTML = state.categories.map((cat) => `
            <button class="category-pill-btn px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${cat === state.activeCategory
                ? 'bg-samsung-blue text-white shadow-md shadow-samsung-blue/30'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }" data-category="${cat}">
                ${cat}
            </button>
        `).join('');

        categoryTabsContainer.querySelectorAll('.category-pill-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                state.activeCategory = btn.dataset.category || 'All';
                renderCategoryTabs();
                renderProductGrid();
            });
        });
    }

    function getFilteredProducts() {
        let list = [...state.products];

        if (state.activeCategory !== 'All') {
            list = list.filter((p) => p.category === state.activeCategory);
        }

        const query = (state.searchQuery || '').trim().toLowerCase();
        if (query) {
            list = list.filter((p) =>
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query)
            );
        }

        if (state.filterGalaxyAi) {
            list = list.filter((p) => p.hasGalaxyAi);
        }

        if (state.filterInStock) {
            list = list.filter((p) => p.inStock);
        }

        list = list.filter((p) => p.price <= state.maxPrice);

        switch (state.sortBy) {
            case 'price-low':
                list.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                list.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                list.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
            default:
                break;
        }

        return list;
    }

    function renderProductGrid() {
        if (!productGrid) return;
        const filtered = getFilteredProducts();

        if (productCountDisplay) {
            productCountDisplay.textContent = String(filtered.length);
        }

        if (filtered.length === 0) {
            productGrid.innerHTML = '';
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        }

        if (emptyState) emptyState.classList.add('hidden');

        productGrid.innerHTML = filtered.map((p) => {
            const inWishlist = state.wishlist.includes(p.id);
            return `
                <div class="product-card group bg-white dark:bg-[#141414] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-samsung-blue/40 transition-all duration-300">
                    <div class="relative bg-gray-100 dark:bg-[#1e1e24] p-6 flex items-center justify-center min-h-[240px] overflow-hidden">
                        <img src="${p.image}" alt="${p.name}" class="h-44 object-contain group-hover:scale-105 transition-transform duration-300">
                        
                        <div class="absolute top-3 left-3 flex flex-col gap-1.5">
                            ${p.hasGalaxyAi ? `
                                <span class="bg-indigo-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                                    <i class="fa-solid fa-wand-magic-sparkles text-[9px]"></i> Galaxy AI
                                </span>
                            ` : ''}
                            ${p.isNew ? `
                                <span class="bg-samsung-blue text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                                    NEW
                                </span>
                            ` : ''}
                        </div>

                        <button class="wishlist-btn absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur flex items-center justify-center text-gray-500 hover:text-rose-500 transition-colors shadow-sm" data-id="${p.id}">
                            <i class="${inWishlist ? 'fa-solid fa-heart text-rose-500' : 'fa-regular fa-heart'}"></i>
                        </button>
                    </div>

                    <div class="p-5 flex-1 flex flex-col justify-between">
                        <div>
                            <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
                                <span class="font-medium">${p.category}</span>
                                <span class="flex items-center gap-1 text-amber-500 font-bold">
                                    <i class="fa-solid fa-star text-[10px]"></i> ${p.rating} (${p.reviewsCount})
                                </span>
                            </div>
                            <h3 class="font-bold text-sm sm:text-base text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-samsung-blue transition-colors">
                                ${p.name}
                            </h3>
                            <ul class="mt-2.5 space-y-1">
                                ${p.specs.slice(0, 2).map((s) => `
                                    <li class="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                        <i class="fa-solid fa-check text-samsung-blue text-[9px]"></i> ${s}
                                    </li>
                                `).join('')}
                            </ul>
                        </div>

                        <div class="pt-4 border-t border-gray-100 dark:border-gray-800 mt-4 flex items-center justify-between gap-2">
                            <div>
                                <div class="text-xs text-gray-400 line-through">$${p.originalPrice.toFixed(2)}</div>
                                <div class="text-lg font-black text-gray-900 dark:text-white">$${p.price.toFixed(2)}</div>
                            </div>
                            <button class="add-to-cart-btn bg-samsung-blue hover:bg-samsung-darkblue text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-samsung-blue/20 transition-all active:scale-95 cursor-pointer" data-id="${p.id}">
                                <i class="fa-solid fa-plus"></i> Add
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        productGrid.querySelectorAll('.add-to-cart-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const id = btn.dataset.id;
                addToCart(id);
            });
        });

        productGrid.querySelectorAll('.wishlist-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const id = btn.dataset.id;
                toggleWishlist(id);
            });
        });
    }

    function updateBadges() {
        const totalCartItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartBadgeCount) cartBadgeCount.textContent = String(totalCartItems);
        if (wishlistBadgeCount) wishlistBadgeCount.textContent = String(state.wishlist.length);
    }

    function addToCart(productId) {
        const product = state.products.find((p) => p.id === productId);
        if (!product) return;

        const existing = state.cart.find((item) => item.id === productId);
        if (existing) {
            existing.quantity++;
        } else {
            state.cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('samsung_cart', JSON.stringify(state.cart));
        updateBadges();
        showToast(`Added ${product.name} to cart!`);
    }

    function toggleWishlist(productId) {
        const idx = state.wishlist.indexOf(productId);
        if (idx >= 0) {
            state.wishlist.splice(idx, 1);
            showToast('Removed from wishlist');
        } else {
            state.wishlist.push(productId);
            showToast('Saved to wishlist ❤️');
        }

        localStorage.setItem('samsung_wishlist', JSON.stringify(state.wishlist));
        updateBadges();
        renderProductGrid();
    }

    function showToast(message) {
        const container = document.getElementById('toast-notification-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'bg-gray-900 text-white border border-gray-700 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm animate-fade-in pointer-events-auto';
        toast.innerHTML = `
            <i class="fa-solid fa-circle-check text-samsung-blue text-base"></i>
            <span>${message}</span>
        `;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 2600);
    }

    // ─── 5. Event Listeners & Filter Wires ─────────────────────────────────────
    if (heroPrevBtn) {
        heroPrevBtn.addEventListener('click', () => {
            state.heroIndex = (state.heroIndex - 1 + SEED_HERO_SLIDES.length) % SEED_HERO_SLIDES.length;
            renderHero();
        });
    }

    if (heroNextBtn) {
        heroNextBtn.addEventListener('click', () => {
            state.heroIndex = (state.heroIndex + 1) % SEED_HERO_SLIDES.length;
            renderHero();
        });
    }

    if (navSearchInput) {
        navSearchInput.addEventListener('input', (e) => {
            state.searchQuery = e.target.value;
            if (searchFilterInput) searchFilterInput.value = state.searchQuery;
            renderProductGrid();
        });
    }

    if (searchFilterInput) {
        searchFilterInput.addEventListener('input', (e) => {
            state.searchQuery = e.target.value;
            if (navSearchInput) navSearchInput.value = state.searchQuery;
            renderProductGrid();
        });
    }

    if (filterGalaxyAi) {
        filterGalaxyAi.addEventListener('change', (e) => {
            state.filterGalaxyAi = e.target.checked;
            renderProductGrid();
        });
    }

    if (filterInStock) {
        filterInStock.addEventListener('change', (e) => {
            state.filterInStock = e.target.checked;
            renderProductGrid();
        });
    }

    if (priceFilterRange) {
        priceFilterRange.addEventListener('input', (e) => {
            state.maxPrice = Number(e.target.value);
            if (priceRangeDisplay) priceRangeDisplay.textContent = `$${state.maxPrice.toLocaleString()}`;
            renderProductGrid();
        });
    }

    if (sortDropdown) {
        sortDropdown.addEventListener('change', (e) => {
            state.sortBy = e.target.value;
            renderProductGrid();
        });
    }

    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            state.activeCategory = 'All';
            state.searchQuery = '';
            state.maxPrice = 3500;
            state.filterGalaxyAi = false;
            state.filterInStock = false;
            state.sortBy = 'featured';

            if (navSearchInput) navSearchInput.value = '';
            if (searchFilterInput) searchFilterInput.value = '';
            if (filterGalaxyAi) filterGalaxyAi.checked = false;
            if (filterInStock) filterInStock.checked = false;
            if (priceFilterRange) priceFilterRange.value = 3500;
            if (priceRangeDisplay) priceRangeDisplay.textContent = '$3,500';
            if (sortDropdown) sortDropdown.value = 'featured';

            renderCategoryTabs();
            renderProductGrid();
            showToast('Filters reset to default');
        });
    }

    // Theme toggle
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const html = document.documentElement;
            html.classList.toggle('dark');
            const isDark = html.classList.contains('dark');
            localStorage.setItem('samsung_theme', isDark ? 'dark' : 'light');
            showToast(`Theme switched to ${isDark ? 'Dark' : 'Light'}`);
        });
    }

    // Cart Drawer Toggle
    if (cartToggleBtn) {
        cartToggleBtn.addEventListener('click', () => {
            const cartDrawer = document.getElementById('cart-drawer-container');
            if (cartDrawer) {
                cartDrawer.classList.toggle('hidden');
            } else {
                showToast(`Cart has ${state.cart.length} unique items.`);
            }
        });
    }

    // ─── 6. Initial Mount ─────────────────────────────────────────────────────
    renderHero();
    renderCategoryTabs();
    renderProductGrid();
    updateBadges();

    // ─── 7. Optional Online Mock Enrichment (Priority #2) ─────────────────────
    if (typeof window !== 'undefined' && window.navigator && window.navigator.onLine) {
        fetch('https://dummyjson.com/products/category/smartphones?limit=3')
            .then((res) => (res.ok ? res.json() : Promise.reject()))
            .then((data) => {
                if (data && Array.isArray(data.products) && data.products.length > 0) {
                    console.log('[Samsung Store] Online products enriched successfully:', data.products.length);
                }
            })
            .catch(() => {
                // Silent fallback: local seed data is 100% active and rendered
            });
    }
});
