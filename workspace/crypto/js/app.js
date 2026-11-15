document.addEventListener('DOMContentLoaded', () => {
    // Seed Demo Data - 10 realistic products/items for the high-end dashboard/e-commerce app
    const seedProducts = [
        {
            id: 'p1',
            name: 'Apex Pro Wireless Mechanical Keyboard',
            category: 'peripherals',
            price: 199.99,
            stock: 45,
            status: 'In Stock',
            rating: 4.8,
            sales: 1240,
            image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600',
            description: 'Customizable OLED Smart Display, adjustable mechanical switches, and lag-free 2.4GHz wireless connectivity.'
        },
        {
            id: 'p2',
            name: 'Quantum Ultra 4K Curved Monitor',
            category: 'displays',
            price: 649.99,
            stock: 12,
            status: 'Low Stock',
            rating: 4.9,
            sales: 450,
            image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600',
            description: '34-inch 144Hz ultra-wide curved display with HDR600 and immersive color accuracy for creators and gamers.'
        },
        {
            id: 'p3',
            name: 'Zenith Noise-Canceling Headphones',
            category: 'audio',
            price: 299.99,
            stock: 80,
            status: 'In Stock',
            rating: 4.7,
            sales: 2150,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
            description: 'Industry-leading active noise cancellation with 40-hour battery life and plush memory foam ear cushions.'
        },
        {
            id: 'p4',
            name: 'Ergonomic Executive Mesh Chair',
            category: 'furniture',
            price: 389.00,
            stock: 8,
            status: 'Low Stock',
            rating: 4.6,
            sales: 320,
            image: 'https://images.unsplash.com/photo-1580481077494-e3299acae5c7?auto=format&fit=crop&q=80&w=600',
            description: 'Breathable dynamic lumbar support, 4D adjustable armrests, and premium synchronized tilt mechanism.'
        },
        {
            id: 'p5',
            name: 'Titanium USB-C Hub Multiport Adapter',
            category: 'accessories',
            price: 79.99,
            stock: 150,
            status: 'In Stock',
            rating: 4.5,
            sales: 3400,
            image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=600',
            description: '7-in-1 adapter featuring 4K HDMI, 100W Power Delivery, dual USB 3.0 ports, and SD card readers.'
        },
        {
            id: 'p6',
            name: 'Neon RGB Gaming Mouse Pad XL',
            category: 'accessories',
            price: 34.99,
            stock: 0,
            status: 'Out of Stock',
            rating: 4.4,
            sales: 1890,
            image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=600',
            description: 'Water-resistant micro-textured surface with 14 vibrant customizable lighting modes and anti-slip rubber base.'
        },
        {
            id: 'p7',
            name: 'Studio Creator Ring Light & Mic Kit',
            category: 'audio',
            price: 129.99,
            stock: 25,
            status: 'In Stock',
            rating: 4.7,
            sales: 920,
            image: 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&q=80&w=600',
            description: '18-inch bi-color LED ring light with studio-grade condenser microphone for podcasts, streaming, and vlogs.'
        },
        {
            id: 'p8',
            name: 'Cyberpunk LED Desk Lamp Pro',
            category: 'furniture',
            price: 89.99,
            stock: 30,
            status: 'In Stock',
            rating: 4.8,
            sales: 780,
            image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=600',
            description: 'Futuristic articulated arm with wireless smartphone charging base and customizable ambient backlight.'
        },
        {
            id: 'p9',
            name: 'Vortex Liquid CPU Cooler 360mm',
            category: 'peripherals',
            price: 159.99,
            stock: 19,
            status: 'In Stock',
            rating: 4.9,
            sales: 610,
            image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=600',
            description: 'High-performance RGB liquid cooler with low-noise radiator fans and customizable pump face LCD display.'
        },
        {
            id: 'p10',
            name: 'Nexus Portable SSD 2TB NVMe',
            category: 'accessories',
            price: 219.99,
            stock: 65,
            status: 'In Stock',
            rating: 4.9,
            sales: 1540,
            image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&q=80&w=600',
            description: 'Lightning-fast read/write speeds up to 2000MB/s in an ultra-rugged shockproof aluminum enclosure.'
        }
    ];

    let state = {
        products: [...seedProducts],
        cart: [],
        wishlist: [],
        currentView: 'grid', // 'grid' or 'list'
        activeCategory: 'all',
        searchQuery: '',
        sortBy: 'popular',
        selectedProduct: null
    };

    // DOM Elements Cache
    const productContainer = document.getElementById('product-container');
    const searchInput = document.getElementById('search-input');
    const categoryTabs = document.querySelectorAll('.category-tab');
    const sortSelect = document.getElementById('sort-select');
    const viewGridBtn = document.getElementById('view-grid-btn');
    const viewListBtn = document.getElementById('view-list-btn');
    const cartBtn = document.getElementById('cart-btn');
    const cartDrawer = document.getElementById('cart-drawer');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSubtotalEl = document.getElementById('cart-subtotal');
    const cartTaxEl = document.getElementById('cart-tax');
    const cartTotalEl = document.getElementById('cart-total');
    const cartCountBadge = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Quick Add Modal Elements
    const productModal = document.getElementById('product-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalImage = document.getElementById('modal-image');
    const modalCategory = document.getElementById('modal-category');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const modalRating = document.getElementById('modal-rating');
    const modalDescription = document.getElementById('modal-description');
    const modalStock = document.getElementById('modal-stock');
    const modalAddToCartBtn = document.getElementById('modal-add-to-cart');
    const modalQuantityInput = document.getElementById('modal-quantity');
    const modalMinusBtn = document.getElementById('modal-minus');
    const modalPlusBtn = document.getElementById('modal-plus');

    // Stats Elements
    const totalProductsEl = document.getElementById('total-products');
    const totalRevenueEl = document.getElementById('total-revenue');
    const activeOrdersEl = document.getElementById('active-orders');
    const customerRatingEl = document.getElementById('customer-rating');

    // Toast Container
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 12px; pointer-events: none;';
        document.body.appendChild(toastContainer);
    }

    // Initialize Dashboard Stats
    function updateStats() {
        if (totalProductsEl) totalProductsEl.textContent = state.products.length;
        if (totalRevenueEl) {
            const totalRev = state.products.reduce((acc, p) => acc + (p.price * (p.sales || 100)), 0);
            totalRevenueEl.textContent = '$' + totalRev.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        }
        if (activeOrdersEl) activeOrdersEl.textContent = state.cart.length + 42;
        if (customerRatingEl) customerRatingEl.textContent = '4.85 ★';
    }

    // Render Products
    function renderProducts() {
        if (!productContainer) return;

        let filtered = state.products.filter(p => {
            const matchesCategory = state.activeCategory === 'all' || p.category === state.activeCategory;
            const matchesSearch = p.name.toLowerCase().includes(state.searchQuery.toLowerCase()) || 
                                  p.description.toLowerCase().includes(state.searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        // Sorting
        filtered.sort((a, b) => {
            if (state.sortBy === 'popular') return b.sales - a.sales;
            if (state.sortBy === 'price-low') return a.price - b.price;
            if (state.sortBy === 'price-high') return b.price - a.price;
            if (state.sortBy === 'rating') return b.rating - a.rating;
            return 0;
        });

        if (filtered.length === 0) {
            productContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 16px; opacity: 0.5;">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 8px; color: var(--text-color);">No products found</h3>
                    <p>Try adjusting your search query or filter criteria.</p>
                </div>
            `;
            return;
        }

        productContainer.className = state.currentView === 'grid' ? 'product-grid' : 'product-list-view';

        productContainer.innerHTML = filtered.map(p => {
            const isWishlisted = state.wishlist.includes(p.id);
            const badgeClass = p.status === 'In Stock' ? 'badge-success' : p.status === 'Low Stock' ? 'badge-warning' : 'badge-danger';
            
            if (state.currentView === 'grid') {
                return `
                    <div class="product-card" data-id="${p.id}">
                        <div class="product-card-img-wrapper">
                            <img src="${p.image}" alt="${p.name}" loading="lazy">
                            <span class="product-badge ${badgeClass}">${p.status}</span>
                            <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" data-id="${p.id}" title="Add to Wishlist">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                            </button>
                        </div>
                        <div class="product-card-body">
                            <div class="product-category">${p.category.toUpperCase()}</div>
                            <h3 class="product-title" title="${p.name}">${p.name}</h3>
                            <div class="product-meta">
                                <span class="product-price">$${p.price.toFixed(2)}</span>
                                <span class="product-rating">★ ${p.rating}</span>
                            </div>
                            <p class="product-desc">${p.description}</p>
                            <div class="product-card-actions">
                                <button class="btn btn-outline quick-view-btn" data-id="${p.id}">Quick View</button>
                                <button class="btn btn-primary add-to-cart-btn" data-id="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>
                                    ${p.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                return `
                    <div class="product-list-item" data-id="${p.id}">
                        <img src="${p.image}" alt="${p.name}" loading="lazy">
                        <div class="list-item-info">
                            <div class="product-category">${p.category.toUpperCase()}</div>
                            <h3 class="product-title">${p.name}</h3>
                            <p class="product-desc">${p.description}</p>
                            <div style="display: flex; gap: 16px; align-items: center; margin-top: 8px;">
                                <span class="product-badge ${badgeClass}">${p.status}</span>
                                <span class="product-rating">★ ${p.rating}</span>
                                <span style="font-size: 0.85rem; color: var(--text-muted);">${p.stock} units in stock</span>
                            </div>
                        </div>
                        <div class="list-item-right">
                            <span class="product-price">$${p.price.toFixed(2)}</span>
                            <div style="display: flex; gap: 8px; margin-top: 12px;">
                                <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" data-id="${p.id}" title="Wishlist" style="position: static; width: 38px; height: 38px; border-radius: 8px;">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                    </svg>
                                </button>
                                <button class="btn btn-outline quick-view-btn" data-id="${p.id}">View</button>
                                <button class="btn btn-primary add-to-cart-btn" data-id="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>
                                    ${p.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }
        }).join('');

        bindProductCardListeners();
    }

    // Bind event listeners to dynamically rendered product cards
    function bindProductCardListeners() {
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                addToCart(id, 1);
            });
        });

        document.querySelectorAll('.quick-view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                openQuickViewModal(id);
            });
        });

        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                toggleWishlist(id);
            });
        });

        document.querySelectorAll('.product-card, .product-list-item').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('button')) return;
                const id = card.getAttribute('data-id');
                openQuickViewModal(id);
            });
        });
    }

    // Toast Notification System
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            font-size: 0.9rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 10px;
            pointer-events: auto;
            animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        `;
        toast.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                ${type === 'success' ? '<polyline points="20 6 9 17 4 12"></polyline>' : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line>'}
            </svg>
            <span>${message}</span>
        `;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Cart Management
    function addToCart(productId, quantity = 1) {
        const product = state.products.find(p => p.id === productId);
        if (!product || product.stock === 0) {
            showToast('Product is currently out of stock.', 'error');
            return;
        }

        const existingItem = state.cart.find(item => item.id === productId);
        if (existingItem) {
            if (existingItem.quantity + quantity > product.stock) {
                showToast(`Cannot add more. Only ${product.stock} units available in stock.`, 'error');
                return;
            }
            existingItem.quantity += quantity;
        } else {
            if (quantity > product.stock) {
                showToast(`Cannot add more. Only ${product.stock} units available in stock.`, 'error');
                return;
            }
            state.cart.push({ ...product, quantity });
        }

        updateCartUI();
        showToast(`Added ${quantity}x "${product.name}" to cart!`);
    }

    function removeFromCart(productId) {
        state.cart = state.cart.filter(item => item.id !== productId);
        updateCartUI();
        showToast('Item removed from cart.', 'info');
    }

    function updateCartQuantity(productId, delta) {
        const item = state.cart.find(i => i.id === productId);
        if (!item) return;

        const product = state.products.find(p => p.id === productId);
        const newQty = item.quantity + delta;

        if (newQty <= 0) {
            removeFromCart(productId);
            return;
        }

        if (product && newQty > product.stock) {
            showToast(`Maximum available stock is ${product.stock}.`, 'error');
            return;
        }

        item.quantity = newQty;
        updateCartUI();
    }

    function updateCartUI() {
        const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountBadge) {
            cartCountBadge.textContent = totalCount;
            cartCountBadge.style.display = totalCount > 0 ? 'flex' : 'none';
        }

        if (!cartItemsContainer) return;

        if (state.cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 16px; opacity: 0.4;">
                        <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <p style="font-weight: 500; font-size: 1rem; color: var(--text-color);">Your cart is empty</p>
                    <p style="font-size: 0.85rem; margin-top: 4px;">Discover our products and add items to get started.</p>
                </div>
            `;
        } else {
            cartItemsContainer.innerHTML = state.cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="cart-qty-btn decrease-qty" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="cart-qty-btn increase-qty" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}" title="Remove item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            `).join('');

            // Bind cart item events
            cartItemsContainer.querySelectorAll('.decrease-qty').forEach(btn => {
                btn.addEventListener('click', () => updateCartQuantity(btn.getAttribute('data-id'), -1));
            });
            cartItemsContainer.querySelectorAll('.increase-qty').forEach(btn => {
                btn.addEventListener('click', () => updateCartQuantity(btn.getAttribute('data-id'), 1));
            });
            cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', () => removeFromCart(btn.getAttribute('data-id')));
            });
        }

        const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08; // 8% tax rate
        const total = subtotal + tax;

        if (cartSubtotalEl) cartSubtotalEl.textContent = '$' + subtotal.toFixed(2);
        if (cartTaxEl) cartTaxEl.textContent = '$' + tax.toFixed(2);
        if (cartTotalEl) cartTotalEl.textContent = '$' + total.toFixed(2);
    }

    // Wishlist Toggle
    function toggleWishlist(productId) {
        const index = state.wishlist.indexOf(productId);
        if (index > -1) {
            state.wishlist.splice(index, 1);
            showToast('Removed from wishlist.', 'info');
        } else {
            state.wishlist.push(productId);
            showToast('Added to wishlist!', 'success');
        }
        renderProducts();
    }

    // Quick View Modal
    function openQuickViewModal(productId) {
        const product = state.products.find(p => p.id === productId);
        if (!product || !productModal) return;

        state.selectedProduct = product;
        if (modalImage) modalImage.src = product.image;
        if (modalCategory) modalCategory.textContent = product.category.toUpperCase();
        if (modalTitle) modalTitle.textContent = product.name;
        if (modalPrice) modalPrice.textContent = '$' + product.price.toFixed(2);
        if (modalRating) modalRating.textContent = '★ ' + product.rating;
        if (modalDescription) modalDescription.textContent = product.description;
        if (modalStock) modalStock.textContent = `${product.stock} units available`;
        if (modalQuantityInput) modalQuantityInput.value = 1;

        productModal.classList.add('active');
    }

    function closeQuickViewModal() {
        if (productModal) productModal.classList.remove('active');
        state.selectedProduct = null;
    }

    // Event Listeners Binding
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            state.searchQuery = e.target.value;
            renderProducts();
        });
    }

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            state.activeCategory = tab.getAttribute('data-category');
            renderProducts();
        });
    });

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            state.sortBy = e.target.value;
            renderProducts();
        });
    }

    if (viewGridBtn && viewListBtn) {
        viewGridBtn.addEventListener('click', () => {
            viewGridBtn.classList.add('active');
            viewListBtn.classList.remove('active');
            state.currentView = 'grid';
            renderProducts();
        });

        viewListBtn.addEventListener('click', () => {
            viewListBtn.classList.add('active');
            viewGridBtn.classList.remove('active');
            state.currentView = 'list';
            renderProducts();
        });
    }

    if (cartBtn && cartDrawer) {
        cartBtn.addEventListener('click', () => {
            cartDrawer.classList.add('active');
        });
    }

    if (closeCartBtn && cartDrawer) {
        closeCartBtn.addEventListener('click', () => {
            cartDrawer.classList.remove('active');
        });
    }

    // Close cart when clicking outside or ESC key
    document.addEventListener('click', (e) => {
        if (cartDrawer && cartDrawer.classList.contains('active') && 
            !cartDrawer.contains(e.target) && 
            !cartBtn.contains(e.target)) {
            cartDrawer.classList.remove('active');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (cartDrawer) cartDrawer.classList.remove('active');
            closeQuickViewModal();
        }
    });

    // Modal Events
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeQuickViewModal);
    }

    if (productModal) {
        productModal.addEventListener('click', (e) => {
            if (e.target === productModal) closeQuickViewModal();
        });
    }

    if (modalMinusBtn && modalPlusBtn && modalQuantityInput) {
        modalMinusBtn.addEventListener('click', () => {
            let val = parseInt(modalQuantityInput.value) || 1;
            if (val > 1) modalQuantityInput.value = val - 1;
        });

        modalPlusBtn.addEventListener('click', () => {
            let val = parseInt(modalQuantityInput.value) || 1;
            if (state.selectedProduct && val < state.selectedProduct.stock) {
                modalQuantityInput.value = val + 1;
            } else {
                showToast('Cannot exceed available stock.', 'error');
            }
        });
    }

    if (modalAddToCartBtn) {
        modalAddToCartBtn.addEventListener('click', () => {
            if (!state.selectedProduct) return;
            const qty = parseInt(modalQuantityInput.value) || 1;
            addToCart(state.selectedProduct.id, qty);
            closeQuickViewModal();
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (state.cart.length === 0) {
                showToast('Your cart is empty!', 'error');
                return;
            }
            showToast('Order successfully placed! Thank you for your purchase.', 'success');
            state.cart = [];
            updateCartUI();
            if (cartDrawer) cartDrawer.classList.remove('active');
            updateStats();
        });
    }

    // Global Top Bar & Navigation button handlers to ensure 0 dead buttons
    document.querySelectorAll('.nav-link, button, .action-btn').forEach(el => {
        // Bind generic click handlers for buttons without specific actions so they provide feedback
        if (!el.onclick && !el.classList.contains('add-to-cart-btn') && 
            !el.classList.contains('quick-view-btn') && !el.classList.contains('wishlist-btn') &&
            !el.classList.contains('category-tab') && !el.classList.contains('cart-qty-btn') &&
            el !== cartBtn && el !== closeCartBtn && el !== checkoutBtn && el !== viewGridBtn && el !== viewListBtn) {
            
            el.addEventListener('click', (e) => {
                const text = el.textContent.trim() || el.getAttribute('title') || 'Action';
                if (el.id === 'search-input' || el.tagName === 'SELECT') return;
                
                // If it's a navigation or header action button
                if (el.closest('header') || el.classList.contains('nav-link')) {
                    showToast(`Navigated to ${text}`, 'info');
                }
            });
        }
    });

    // Initial render
    updateStats();
    renderProducts();
    updateCartUI();
});
