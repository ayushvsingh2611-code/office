// app.js - AURA E-Commerce Application Logic
document.addEventListener('DOMContentLoaded', () => {

    // -------------------------------------------------------------
    // 0. TOAST NOTIFICATION ENGINE
    // -------------------------------------------------------------
    window.phToast = function(message, type = 'success') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-3 pointer-events-none';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        const bgColors = type === 'success' ? 'bg-black text-white' : type === 'error' ? 'bg-rose-600 text-white' : 'bg-gray-800 text-white';
        toast.className = `${bgColors} px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold flex items-center gap-3 transform translate-y-5 opacity-0 transition-all duration-300 pointer-events-auto`;
        
        const icon = type === 'success' ? 'fa-circle-check text-emerald-400' : type === 'error' ? 'fa-circle-exclamation text-rose-300' : 'fa-circle-info text-blue-300';
        toast.innerHTML = `<i class="fa-solid ${icon} text-base"></i><span>${message}</span>`;
        
        container.appendChild(toast);
        setTimeout(() => toast.classList.remove('translate-y-5', 'opacity-0'), 10);

        setTimeout(() => {
            toast.classList.add('translate-y-5', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    };

    // -------------------------------------------------------------
    // 1. STATE & SEED DATA MANAGEMENT
    // -------------------------------------------------------------
    const initialProducts = [
        {
            id: 1,
            name: "Minimalist Heavyweight Hoodie",
            category: "Apparel",
            price: 120.00,
            rating: 4.8,
            reviewsCount: 142,
            image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800",
            description: "Crafted from 500gsm organic cotton fleece, this heavyweight hoodie delivers unmatched structure, warmth, and a luxurious draped silhouette.",
            specs: ["100% Organic Cotton", "Pre-shrunk fabric", "Ribbed cuffs and hem", "Made in Portugal"],
            featured: true,
            inStock: true
        },
        {
            id: 2,
            name: "Architectural Ceramic Chronograph",
            category: "Accessories",
            price: 285.00,
            rating: 4.9,
            reviewsCount: 98,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
            description: "A masterclass in minimalist timekeeping featuring matte black high-tech ceramic, sapphire crystal glass, and Swiss quartz movement.",
            specs: ["Swiss Quartz Movement", "Matte Ceramic Case", "Sapphire Crystal Glass", "3ATM Water Resistant"],
            featured: true,
            inStock: true
        },
        {
            id: 3,
            name: "Nomad Leather Weekender Bag",
            category: "Lifestyle",
            price: 340.00,
            rating: 4.7,
            reviewsCount: 64,
            image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800",
            description: "Handcrafted full-grain vegetable-tanned leather duffel designed to fit airline overhead compartments while aging gracefully with every journey.",
            specs: ["Full-Grain Bovine Leather", "Brass Hardware", "Waterproof Cotton Lining", "Lifetime Warranty"],
            featured: true,
            inStock: true
        },
        {
            id: 4,
            name: "All-Terrain Technical Sneaker",
            category: "Footwear",
            price: 175.00,
            rating: 4.6,
            reviewsCount: 115,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
            description: "Engineered for urban exploration with responsive carbon-infused cushioning, breathable mesh upper, and high-traction rubber outsole.",
            specs: ["Carbon-infused midsole", "Breathable knit upper", "Vibram rubber outsole", "Reflective accents"],
            featured: true,
            inStock: true
        },
        {
            id: 5,
            name: "Oversized Structured Trench Coat",
            category: "Apparel",
            price: 290.00,
            rating: 4.9,
            reviewsCount: 42,
            image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800",
            description: "A contemporary take on the classic trench featuring water-resistant gabardine twill, storm flaps, and horn buttons.",
            specs: ["Water-repellent cotton blend", "Reglan sleeves", "Adjustable waist belt", "Dry clean only"],
            featured: false,
            inStock: true
        },
        {
            id: 6,
            name: "Titanium Minimalist Cardholder",
            category: "Accessories",
            price: 65.00,
            rating: 4.5,
            reviewsCount: 210,
            image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800",
            description: "Slim RFID-blocking cardholder machined from aerospace-grade titanium with an elastic cash strap and quick-access thumb slot.",
            specs: ["Aerospace Grade Titanium", "RFID Blocking Technology", "Holds up to 12 cards", "Ultra-slim 8mm profile"],
            featured: false,
            inStock: true
        },
        {
            id: 7,
            name: "Hand-Blown Glass Table Lamp",
            category: "Lifestyle",
            price: 155.00,
            rating: 4.8,
            reviewsCount: 31,
            image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800",
            description: "Sculptural ambient lighting featuring smoked translucent glass and warm dimmable LED filament core for interior sanctuaries.",
            specs: ["Hand-blown smoked glass", "Dimmable touch sensor", "Energy efficient LED", "Brass base plate"],
            featured: false,
            inStock: true
        },
        {
            id: 8,
            name: "Waterproof Performance Shell",
            category: "Apparel",
            price: 220.00,
            rating: 4.7,
            reviewsCount: 88,
            image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800",
            description: "Triple-layer seam-sealed waterproof hardshell jacket designed to withstand torrential downpours while remaining fully breathable.",
            specs: ["20k/20k Waterproof Membrane", "YKK AquaGuard Zippers", "Fully taped seams", "Packable hood"],
            featured: true,
            inStock: true
        }
    ];

    let state = {
        products: JSON.parse(localStorage.getItem('aura_products')) || initialProducts,
        cart: JSON.parse(localStorage.getItem('aura_cart')) || [],
        category: 'all',
        searchQuery: '',
        sortBy: 'featured',
        currentModalProduct: null
    };

    function persistState() {
        localStorage.setItem('aura_products', JSON.stringify(state.products));
        localStorage.setItem('aura_cart', JSON.stringify(state.cart));
        updateCartBadges();
    }

    // -------------------------------------------------------------
    // 2. DOM ELEMENT REFERENCES
    // -------------------------------------------------------------
    const productGrid = document.getElementById('product-grid');
    const productCountEl = document.getElementById('product-count').querySelector('span');
    const emptyState = document.getElementById('empty-state');
    const categoryFiltersContainer = document.getElementById('category-filters');
    const desktopSearch = document.getElementById('desktop-search');
    const mobileSearch = document.getElementById('mobile-search');
    const sortSelect = document.getElementById('sort-select');
    const resetFiltersBtn = document.getElementById('reset-filters-btn');

    // Cart Elements
    const cartToggleBtn = document.getElementById('cart-toggle-btn');
    const cartModal = document.getElementById('cart-modal');
    const cartDrawerCard = document.getElementById('cart-drawer-card');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartBackdrop = document.getElementById('cart-backdrop');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartEmptyState = document.getElementById('cart-empty-state');
    const cartFooter = document.getElementById('cart-footer');
    const cartBadge = document.getElementById('cart-badge');
    const cartCountBadge = document.getElementById('cart-count-badge');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    const startShoppingBtn = document.getElementById('start-shopping-btn');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Product Details Modal Elements
    const productModal = document.getElementById('product-modal');
    const productModalCard = document.getElementById('product-modal-card');
    const closeProductModal = document.getElementById('close-product-modal');
    const modalProductContent = document.getElementById('modal-product-content');

    // Checkout Modal Elements
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutModalCard = document.getElementById('checkout-modal-card');
    const closeCheckoutModal = document.getElementById('close-checkout-modal');
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutSummaryItems = document.getElementById('checkout-summary-items');
    const checkoutModalTotal = document.getElementById('checkout-modal-total');

    // Success Modal Elements
    const successModal = document.getElementById('success-modal');
    const successModalCard = document.getElementById('success-modal-card');

    // Newsletter
    const newsletterForm = document.getElementById('newsletter-form');

    // -------------------------------------------------------------
    // 3. CORE RENDERING ENGINE
    // -------------------------------------------------------------
    function renderCatalog() {
        if (!productGrid) return;

        let filtered = state.products.filter(item => {
            const matchesCat = state.category === 'all' || item.category === state.category;
            const matchesSearch = item.name.toLowerCase().includes(state.searchQuery.toLowerCase()) || 
                                  item.description.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                                  item.category.toLowerCase().includes(state.searchQuery.toLowerCase());
            return matchesCat && matchesSearch;
        });

        // Sorting logic
        if (state.sortBy === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (state.sortBy === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (state.sortBy === 'rating') {
            filtered.sort((a, b) => b.rating - a.rating);
        } else {
            filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        }

        productCountEl.textContent = filtered.length;

        if (filtered.length === 0) {
            productGrid.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        productGrid.innerHTML = filtered.map(product => `
            <div class="product-card group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                <div>
                    <div class="relative bg-gray-100 aspect-square overflow-hidden cursor-pointer" data-id="${product.id}" data-action="view-details">
                        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        ${product.featured ? '<span class="absolute top-3 left-3 bg-black text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">Featured</span>' : ''}
                        <button class="absolute bottom-3 right-3 w-10 h-10 bg-white/90 hover:bg-black hover:text-white text-gray-800 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0" data-id="${product.id}" data-action="quick-add" aria-label="Add to cart">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                    <div class="p-5">
                        <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span class="font-semibold uppercase tracking-wider text-gray-400">${product.category}</span>
                            <div class="flex items-center gap-1 text-amber-500 font-bold">
                                <i class="fa-solid fa-star text-xs"></i>
                                <span>${product.rating} <span class="text-gray-400 font-normal">(${product.reviewsCount})</span></span>
                            </div>
                        </div>
                        <h3 class="font-bold text-gray-900 text-base mb-2 hover:text-gray-600 transition cursor-pointer line-clamp-1" data-id="${product.id}" data-action="view-details">${product.name}</h3>
                        <p class="text-sm font-extrabold text-gray-900">$${product.price.toFixed(2)}</p>
                    </div>
                </div>
                <div class="p-5 pt-0">
                    <button class="w-full bg-gray-100 hover:bg-black hover:text-white text-gray-900 font-bold py-2.5 rounded-xl transition text-sm flex items-center justify-center gap-2" data-id="${product.id}" data-action="add-to-cart">
                        <i class="fa-solid fa-bag-shopping text-xs"></i> Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }

    function updateCartBadges() {
        const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (totalItems > 0) {
            cartBadge.textContent = totalItems;
            cartBadge.classList.remove('hidden');
        } else {
            cartBadge.classList.add('hidden');
        }

        if (cartCountBadge) {
            cartCountBadge.textContent = `${totalItems} item${totalItems === 1 ? '' : 's'}`;
        }
    }

    function renderCart() {
        updateCartBadges();
        if (!cartItemsContainer) return;

        if (state.cart.length === 0) {
            cartItemsContainer.innerHTML = '';
            cartEmptyState.classList.remove('hidden');
            cartFooter.classList.add('hidden');
            return;
        }

        cartEmptyState.classList.add('hidden');
        cartFooter.classList.remove('hidden');

        cartItemsContainer.innerHTML = state.cart.map(item => `
            <div class="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-xl border border-gray-100 bg-gray-50 flex-shrink-0">
                <div class="flex-1 min-w-0">
                    <h4 class="font-bold text-gray-900 text-sm truncate">${item.name}</h4>
                    <p class="text-xs text-gray-500 mb-2">${item.category}</p>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                            <button class="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition" data-id="${item.id}" data-action="decrease-qty">-</button>
                            <span class="px-3 text-xs font-bold text-gray-900">${item.quantity}</span>
                            <button class="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition" data-id="${item.id}" data-action="increase-qty">+</button>
                        </div>
                        <span class="font-extrabold text-gray-900 text-sm">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                </div>
                <button class="text-gray-400 hover:text-rose-600 p-2 transition" data-id="${item.id}" data-action="remove-item" aria-label="Remove item">
                    <i class="fa-solid fa-trash-can text-sm"></i>
                </button>
            </div>
        `).join('');

        const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        cartTotal.textContent = `$${subtotal.toFixed(2)}`;
    }

    // -------------------------------------------------------------
    // 4. CART BUSINESS LOGIC
    // -------------------------------------------------------------
    window.addToCart = function(productId, qty = 1) {
        const product = state.products.find(p => p.id === Number(productId));
        if (!product) return;

        const existingItem = state.cart.find(item => item.id === Number(productId));
        if (existingItem) {
            existingItem.quantity += qty;
        } else {
            state.cart.push({
                ...product,
                quantity: qty
            });
        }

        persistState();
        renderCart();
        window.phToast(`Added "${product.name}" to cart.`, 'success');
    };

    window.updateItemQuantity = function(productId, delta) {
        const item = state.cart.find(i => i.id === Number(productId));
        if (!item) return;

        item.quantity += delta;
        if (item.quantity <= 0) {
            state.cart = state.cart.filter(i => i.id !== Number(productId));
            window.phToast(`Removed item from cart.`, 'info');
        } else {
            window.phToast(`Cart updated.`, 'info');
        }

        persistState();
        renderCart();
    };

    window.removeFromCart = function(productId) {
        state.cart = state.cart.filter(i => i.id !== Number(productId));
        persistState();
        renderCart();
        window.phToast(`Item removed from cart.`, 'info');
    };

    // -------------------------------------------------------------
    // 5. MODAL SYNCHRONIZATION ENGINE
    // -------------------------------------------------------------
    function openModal(modalEl, cardEl) {
        if (!modalEl || !cardEl) return;
        modalEl.classList.remove('hidden');
        modalEl.offsetHeight; // force reflow
        modalEl.classList.remove('opacity-0', 'pointer-events-none');
        modalEl.classList.add('flex', 'opacity-100', 'pointer-events-auto');
        
        cardEl.classList.remove('scale-95', 'translate-x-full');
        cardEl.classList.add('scale-100', 'translate-x-0');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modalEl, cardEl, slideRight = false) {
        if (!modalEl || !cardEl) return;
        modalEl.classList.remove('opacity-100', 'pointer-events-auto');
        modalEl.classList.add('opacity-0', 'pointer-events-none');
        
        cardEl.classList.remove('scale-100', 'translate-x-0');
        if (slideRight) {
            cardEl.classList.add('translate-x-full');
        } else {
            cardEl.classList.add('scale-95');
        }

        setTimeout(() => {
            modalEl.classList.remove('flex');
            modalEl.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    }

    function showProductDetailsModal(productId) {
        const product = state.products.find(p => p.id === Number(productId));
        if (!product) return;

        state.currentModalProduct = product;

        modalProductContent.innerHTML = `
            <div class="bg-gray-100 rounded-xl overflow-hidden aspect-square">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
            </div>
            <div class="flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span class="font-bold uppercase tracking-wider bg-gray-100 px-3 py-1 rounded-full text-gray-800">${product.category}</span>
                        <div class="flex items-center gap-1 text-amber-500 font-bold">
                            <i class="fa-solid fa-star text-xs"></i>
                            <span>${product.rating} <span class="text-gray-400 font-normal">(${product.reviewsCount} reviews)</span></span>
                        </div>
                    </div>
                    <h2 class="text-2xl font-extrabold text-gray-900 mb-3">${product.name}</h2>
                    <p class="text-2xl font-black text-gray-900 mb-4">$${product.price.toFixed(2)}</p>
                    <p class="text-sm text-gray-600 mb-6 leading-relaxed">${product.description}</p>
                    
                    <div class="mb-6">
                        <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Specifications</h4>
                        <ul class="grid grid-cols-2 gap-2 text-xs text-gray-700">
                            ${product.specs.map(spec => `<li class="flex items-center gap-2"><i class="fa-solid fa-check text-black"></i> ${spec}</li>`).join('')}
                        </ul>
                    </div>
                </div>

                <div class="space-y-4 pt-4 border-t border-gray-200">
                    <div class="flex items-center gap-4">
                        <div class="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                            <button id="modal-qty-minus" class="w-10 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition">-</button>
                            <span id="modal-qty-val" class="w-12 text-center text-sm font-bold text-gray-900">1</span>
                            <button id="modal-qty-plus" class="w-10 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition">+</button>
                        </div>
                        <button id="modal-add-btn" data-id="${product.id}" class="flex-1 bg-black hover:bg-gray-800 text-white font-bold py-3.5 px-6 rounded-xl transition shadow-lg flex items-center justify-center gap-2 text-sm">
                            <i class="fa-solid fa-bag-shopping"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Modal Quantity Handlers
        let modalQty = 1;
        const minusBtn = document.getElementById('modal-qty-minus');
        const plusBtn = document.getElementById('modal-qty-plus');
        const qtyVal = document.getElementById('modal-qty-val');
        const addBtn = document.getElementById('modal-add-btn');

        minusBtn.addEventListener('click', () => {
            if (modalQty > 1) {
                modalQty--;
                qtyVal.textContent = modalQty;
            }
        });

        plusBtn.addEventListener('click', () => {
            modalQty++;
            qtyVal.textContent = modalQty;
        });

        addBtn.addEventListener('click', () => {
            window.addToCart(product.id, modalQty);
            closeModal(productModal, productModalCard);
        });

        openModal(productModal, productModalCard);
    }

    function openCheckoutModal() {
        if (state.cart.length === 0) {
            window.phToast('Your cart is empty.', 'error');
            return;
        }

        closeModal(cartModal, cartDrawerCard, true);

        // Populate summary
        checkoutSummaryItems.innerHTML = state.cart.map(item => `
            <div class="flex justify-between">
                <span>${item.quantity}x ${item.name}</span>
                <span class="font-semibold">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');

        const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        checkoutModalTotal.textContent = `$${total.toFixed(2)}`;

        openModal(checkoutModal, checkoutModalCard);
    }

    // -------------------------------------------------------------
    // 6. EVENT LISTENERS & INTERACTION BINDINGS
    // -------------------------------------------------------------
    
    // Catalog Grid Delegated Events
    if (productGrid) {
        productGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('button, [data-action]');
            if (!btn) return;
            const action = btn.getAttribute('data-action');
            const id = btn.getAttribute('data-id');

            if (action === 'add-to-cart' || action === 'quick-add') {
                window.addToCart(id, 1);
            } else if (action === 'view-details') {
                showProductDetailsModal(id);
            }
        });
    }

    // Category Pill Filters
    if (categoryFiltersContainer) {
        categoryFiltersContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.category-btn');
            if (!btn) return;

            categoryFiltersContainer.querySelectorAll('.category-btn').forEach(b => {
                b.classList.remove('bg-black', 'text-white', 'shadow-sm');
                b.classList.add('bg-white', 'text-gray-600', 'border', 'border-gray-200', 'hover:bg-gray-100');
            });

            btn.classList.remove('bg-white', 'text-gray-600', 'border', 'border-gray-200', 'hover:bg-gray-100');
            btn.classList.add('bg-black', 'text-white', 'shadow-sm');

            state.category = btn.getAttribute('data-category');
            renderCatalog();
        });
    }

    // Search Handlers
    function handleSearchInput(e) {
        state.searchQuery = e.target.value.trim();
        renderCatalog();
    }

    if (desktopSearch) desktopSearch.addEventListener('input', handleSearchInput);
    if (mobileSearch) mobileSearch.addEventListener('input', handleSearchInput);

    // Sorting Handler
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            state.sortBy = e.target.value;
            renderCatalog();
        });
    }

    // Reset Filters
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            state.category = 'all';
            state.searchQuery = '';
            if (desktopSearch) desktopSearch.value = '';
            if (mobileSearch) mobileSearch.value = '';
            
            categoryFiltersContainer.querySelectorAll('.category-btn').forEach(b => {
                if (b.getAttribute('data-category') === 'all') {
                    b.classList.remove('bg-white', 'text-gray-600', 'border', 'border-gray-200', 'hover:bg-gray-100');
                    b.classList.add('bg-black', 'text-white', 'shadow-sm');
                } else {
                    b.classList.remove('bg-black', 'text-white', 'shadow-sm');
                    b.classList.add('bg-white', 'text-gray-600', 'border', 'border-gray-200', 'hover:bg-gray-100');
                }
            });

            renderCatalog();
            window.phToast('Filters reset successfully.', 'info');
        });
    }

    // Cart Drawer Toggles
    if (cartToggleBtn) {
        cartToggleBtn.addEventListener('click', () => {
            renderCart();
            openModal(cartModal, cartDrawerCard);
        });
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => closeModal(cartModal, cartDrawerCard, true));
    }

    if (cartBackdrop) {
        cartBackdrop.addEventListener('click', () => closeModal(cartModal, cartDrawerCard, true));
    }

    if (startShoppingBtn) {
        startShoppingBtn.addEventListener('click', () => closeModal(cartModal, cartDrawerCard, true));
    }

    // Cart Items Delegated Events
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-action]');
            if (!btn) return;
            const action = btn.getAttribute('data-action');
            const id = btn.getAttribute('data-id');

            if (action === 'increase-qty') {
                window.updateItemQuantity(id, 1);
            } else if (action === 'decrease-qty') {
                window.updateItemQuantity(id, -1);
            } else if (action === 'remove-item') {
                window.removeFromCart(id);
            }
        });
    }

    // Product Details Modal Toggles
    if (closeProductModal) {
        closeProductModal.addEventListener('click', () => closeModal(productModal, productModalCard));
    }
    if (productModal) {
        productModal.addEventListener('click', (e) => {
            if (e.target === productModal) closeModal(productModal, productModalCard);
        });
    }

    // Checkout Modal Toggles
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', openCheckoutModal);
    }

    if (closeCheckoutModal) {
        closeCheckoutModal.addEventListener('click', () => closeModal(checkoutModal, checkoutModalCard));
    }
    if (checkoutModal) {
        checkoutModal.addEventListener('click', (e) => {
            if (e.target === checkoutModal) closeModal(checkoutModal, checkoutModalCard);
        });
    }

    // Checkout Form Submission (Simulation)
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate basic inputs
            const name = document.getElementById('shipping-name').value.trim();
            const email = document.getElementById('shipping-email').value.trim();
            const address = document.getElementById('shipping-address').value.trim();
            
            if (!name || !email || !address) {
                window.phToast('Please fill in all required shipping details.', 'error');
                return;
            }

            // Process order
            closeModal(checkoutModal, checkoutModalCard);

            // Clear cart
            state.cart = [];
            persistState();
            renderCart();

            // Open Success Modal
            openModal(successModal, successModalCard);
            window.phToast('Order placed successfully!', 'success');
        });
    }

    // Success Modal Close / Auto Action
});