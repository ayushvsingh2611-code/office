/**
 * Bean & Brew | Premium Coffee Roastery - app.js
 * Usopp (Café Waiter) - Office Café Waiter & Logic Engineer
 * 100% dynamic, state-driven JavaScript application logic with LocalStorage persistence,
 * cart management, instant buy, search, category filtering, checkout modals, and toast notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. DATA SEEDING & INITIAL STATE
    // ---------------------------------------------------------
    const INITIAL_PRODUCTS = [
        {
            id: 'p1',
            name: 'Ethiopian Yirgacheffe',
            category: 'coffee',
            price: 18.50,
            rating: 4.9,
            reviews: 128,
            image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
            description: 'Light roast with vibrant floral notes, bergamot aroma, and a delicate citrus finish.',
            tags: ['Single Origin', 'Light Roast', 'Organic']
        },
        {
            id: 'p2',
            name: 'Colombian Supremo',
            category: 'coffee',
            price: 16.00,
            rating: 4.8,
            reviews: 95,
            image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80',
            description: 'Medium roast featuring rich caramel sweetness, milk chocolate body, and balanced acidity.',
            tags: ['Best Seller', 'Medium Roast', 'Smooth']
        },
        {
            id: 'p3',
            name: 'Sumatra Mandheling',
            category: 'coffee',
            price: 19.00,
            rating: 4.7,
            reviews: 82,
            image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=600&q=80',
            description: 'Dark roast with earthy herbal notes, low acidity, and a heavy syrupy body.',
            tags: ['Dark Roast', 'Bold', 'Low Acidity']
        },
        {
            id: 'p4',
            name: 'Costa Rican Tarrazu',
            category: 'coffee',
            price: 17.50,
            rating: 4.9,
            reviews: 110,
            image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=600&q=80',
            description: 'Bright honeyed sweetness with crisp green apple notes and clean cocoa finish.',
            tags: ['Estate Grown', 'Medium Roast']
        },
        {
            id: 'p5',
            name: 'Artisan Butter Croissant',
            category: 'bakery',
            price: 4.50,
            rating: 4.9,
            reviews: 215,
            image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
            description: 'Flaky, buttery pastry baked fresh every morning by our master pastry chefs.',
            tags: ['Freshly Baked', 'Vegetarian']
        },
        {
            id: 'p6',
            name: 'Matcha Green Tea Latte',
            category: 'tea',
            price: 6.50,
            rating: 4.6,
            reviews: 74,
            image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80',
            description: 'Ceremonial grade Japanese green tea whisked with velvety steamed oat milk.',
            tags: ['Superfood', 'Dairy-Free Option']
        },
        {
            id: 'p7',
            name: 'Avocado Sourdough Toast',
            category: 'bakery',
            price: 9.00,
            rating: 4.8,
            reviews: 143,
            image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?auto=format&fit=crop&w=600&q=80',
            description: 'Toasted artisan sourdough topped with smashed avocado, chili flakes, and microgreens.',
            tags: ['Healthy', 'Vegan Option']
        },
        {
            id: 'p8',
            name: 'Cold Brew Nitro Draft',
            category: 'coffee',
            price: 5.50,
            rating: 4.9,
            reviews: 188,
            image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
            description: 'Steeped for 24 hours and infused with nitrogen for a cascading, creamy stout-like texture.',
            tags: ['Iced', 'Nitro', 'Refreshing']
        }
    ];

    let appState = {
        products: INITIAL_PRODUCTS,
        cart: [], // [{ productId, quantity }]
        currentCategory: 'all',
        searchQuery: '',
        activeProductModal: null, // product object for quick view
        checkoutOrder: null // last completed order summary
    };

    // Load state from localStorage if available
    try {
        const savedCart = localStorage.getItem('bean_brew_cart');
        if (savedCart) {
            appState.cart = JSON.parse(savedCart);
        }
    } catch (e) {
        console.error('Could not load cart from localStorage', e);
    }

    const saveState = () => {
        try {
            localStorage.setItem('bean_brew_cart', JSON.stringify(appState.cart));
        } catch (e) {
            console.error('Could not save cart to localStorage', e);
        }
    };

    // ---------------------------------------------------------
    // 2. TOAST NOTIFICATION SYSTEM
    // ---------------------------------------------------------
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
            success: 'bg-stone-900 text-white border-amber-600',
            error: 'bg-red-900 text-white border-red-500',
            info: 'bg-amber-800 text-white border-amber-500'
        };

        toast.className = `pointer-events-auto px-4 py-3 rounded-xl shadow-xl border-l-4 flex items-center gap-3 transform translate-y-2 opacity-0 transition-all duration-300 ${bgColors[type] || bgColors.success}`;
        
        let icon = 'fa-circle-check text-amber-500';
        if (type === 'error') icon = 'fa-triangle-exclamation text-red-400';
        if (type === 'info') icon = 'fa-circle-info text-amber-300';

        toast.innerHTML = `
            <i class="fa-solid ${icon} text-lg"></i>
            <span class="text-sm font-medium">${message}</span>
        `;

        container.appendChild(toast);

        // Trigger transition
        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-2', 'opacity-0');
        });

        setTimeout(() => {
            toast.classList.add('translate-y-2', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // ---------------------------------------------------------
    // 3. DOM RENDERING ENGINE
    // ---------------------------------------------------------
    const renderProducts = () => {
        const grid = document.getElementById('products-grid');
        if (!grid) return;

        const filtered = appState.products.filter(p => {
            const matchesCat = appState.currentCategory === 'all' || p.category === appState.currentCategory;
            const matchesSearch = p.name.toLowerCase().includes(appState.searchQuery.toLowerCase()) ||
                                  p.description.toLowerCase().includes(appState.searchQuery.toLowerCase()) ||
                                  p.tags.some(t => t.toLowerCase().includes(appState.searchQuery.toLowerCase()));
            return matchesCat && matchesSearch;
        });

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full py-16 text-center">
                    <div class="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-500 text-2xl">
                        <i class="fa-solid fa-mug-hot"></i>
                    </div>
                    <h3 class="text-lg font-bold text-stone-800 mb-1">No brews found</h3>
                    <p class="text-stone-500 text-sm">Try adjusting your search or category filter.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(p => `
            <div class="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition group flex flex-col">
                <div class="relative h-56 overflow-hidden bg-stone-100 cursor-pointer product-card-img" data-id="${p.id}">
                    <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                    <div class="absolute top-3 left-3 flex flex-wrap gap-1">
                        ${p.tags.slice(0, 2).map(tag => `<span class="bg-white/90 backdrop-blur text-stone-800 text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm">${tag}</span>`).join('')}
                    </div>
                    <div class="absolute bottom-3 right-3 bg-stone-900/80 backdrop-blur text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                        $${p.price.toFixed(2)}
                    </div>
                </div>
                <div class="p-5 flex flex-col flex-grow">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-xs uppercase tracking-wider text-amber-700 font-bold">${p.category}</span>
                        <div class="flex items-center gap-1 text-xs text-stone-600 font-semibold">
                            <i class="fa-solid fa-star text-amber-500"></i>
                            <span>${p.rating}</span>
                            <span class="text-stone-400">(${p.reviews})</span>
                        </div>
                    </div>
                    <h3 class="font-bold text-lg text-stone-900 mb-2 cursor-pointer hover:text-amber-700 transition product-card-title" data-id="${p.id}">${p.name}</h3>
                    <p class="text-stone-600 text-xs line-clamp-2 mb-4 leading-relaxed">${p.description}</p>
                    
                    <div class="mt-auto pt-4 border-t border-stone-100 flex items-center gap-2">
                        <button class="flex-1 bg-stone-900 hover:bg-amber-800 text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 add-to-cart-btn shadow-sm" data-id="${p.id}">
                            <i class="fa-solid fa-cart-plus"></i> Add to Cart
                        </button>
                        <button class="bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold py-2.5 px-4 rounded-xl transition buy-now-btn" data-id="${p.id}">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Re-bind click handlers for dynamically created product cards
        document.querySelectorAll('.product-card-img, .product-card-title').forEach(el => {
            el.addEventListener('click', () => {
                const id = el.getAttribute('data-id');
                openProductModal(id);
            });
        });

        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                addToCart(id, 1);
            });
        });

        document.querySelectorAll('.buy-now-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                buyNow(id);
            });
        });
    };

    const updateCartCount = () => {
        const badge = document.getElementById('cart-count');
        if (!badge) return;
        const totalItems = appState.cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
        if (totalItems > 0) {
            badge.classList.remove('scale-0');
        } else {
            badge.classList.add('scale-0');
        }
    };

    const renderCartModalContent = () => {
        const itemsContainer = document.getElementById('cart-items-container');
        const footerContainer = document.getElementById('cart-footer');
        const emptyState = document.getElementById('cart-empty-state');
        if (!itemsContainer) return;

        if (appState.cart.length === 0) {
            emptyState.classList.remove('hidden');
            itemsContainer.innerHTML = '';
            if (footerContainer) footerContainer.classList.add('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        if (footerContainer) footerContainer.classList.remove('hidden');

        let subtotal = 0;
        itemsContainer.innerHTML = appState.cart.map(cartItem => {
            const product = appState.products.find(p => p.id === cartItem.productId);
            if (!product) return '';
            const itemTotal = product.price * cartItem.quantity;
            subtotal += itemTotal;

            return `
                <div class="flex items-center gap-4 bg-stone-50 p-3 rounded-2xl border border-stone-200/60">
                    <img src="${product.image}" alt="${product.name}" class="w-16 h-16 object-cover rounded-xl flex-shrink-0 bg-white">
                    <div class="flex-grow">
                        <h4 class="font-bold text-sm text-stone-900">${product.name}</h4>
                        <p class="text-amber-800 text-xs font-semibold">$${product.price.toFixed(2)} each</p>
                        <div class="flex items-center gap-3 mt-2">
                            <div class="flex items-center border border-stone-300 bg-white rounded-lg overflow-hidden">
                                <button class="px-2 py-1 text-stone-600 hover:bg-stone-100 transition decrease-qty" data-id="${product.id}">
                                    <i class="fa-solid fa-minus text-[10px]"></i>
                                </button>
                                <span class="px-3 text-xs font-bold text-stone-800">${cartItem.quantity}</span>
                                <button class="px-2 py-1 text-stone-600 hover:bg-stone-100 transition increase-qty" data-id="${product.id}">
                                    <i class="fa-solid fa-plus text-[10px]"></i>
                                </button>
                            </div>
                            <button class="text-red-500 hover:text-red-700 text-xs font-semibold transition remove-cart-item" data-id="${product.id}">
                                <i class="fa-solid fa-trash-can"></i> Remove
                            </button>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="font-bold text-sm text-stone-900">$${itemTotal.toFixed(2)}</span>
                    </div>
                </div>
            `;
        }).join('');

        // Calculate totals
        const tax = subtotal * 0.08;
        const shipping = subtotal > 35 ? 0 : 4.99;
        const total = subtotal + tax + shipping;

        document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('cart-tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('cart-shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
        document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;

        // Bind cart item controls
        itemsContainer.querySelectorAll('.increase-qty').forEach(btn => {
            btn.addEventListener('click', () => {
                updateItemQuantity(btn.getAttribute('data-id'), 1);
            });
        });

        itemsContainer.querySelectorAll('.decrease-qty').forEach(btn => {
            btn.addEventListener('click', () => {
                updateItemQuantity(btn.getAttribute('data-id'), -1);
            });
        });

        itemsContainer.querySelectorAll('.remove-cart-item').forEach(btn => {
            btn.addEventListener('click', () => {
                removeFromCart(btn.getAttribute('data-id'));
            });
        });
    };

    // ---------------------------------------------------------
    // 4. CART & ORDER ACTIONS
    // ---------------------------------------------------------
    const addToCart = (productId, qty = 1) => {
        const product = appState.products.find(p => p.id === productId);
        if (!product) return;

        const existingIndex = appState.cart.findIndex(item => item.productId === productId);
        if (existingIndex > -1) {
            appState.cart[existingIndex].quantity += qty;
        } else {
            appState.cart.push({ productId, quantity: qty });
        }

        saveState();
        updateCartCount();
        phToast(`Added ${product.name} to your cart!`, 'success');
    };

    const updateItemQuantity = (productId, delta) => {
        const index = appState.cart.findIndex(item => item.productId === productId);
        if (index > -1) {
            appState.cart[index].quantity += delta;
            if (appState.cart[index].quantity <= 0) {
                appState.cart.splice(index, 1);
                phToast('Item removed from cart', 'info');
            } else {
                phToast('Cart updated', 'info');
            }
            saveState();
            updateCartCount();
            renderCartModalContent();
        }
    };

    const removeFromCart = (productId) => {
        const index = appState.cart.findIndex(item => item.productId === productId);
        if (index > -1) {
            appState.cart.splice(index, 1);
            saveState();
            updateCartCount();
            renderCartModalContent();
            phToast('Item removed from cart', 'info');
        }
    };

    const buyNow = (productId) => {
        addToCart(productId, 1);
        openCartModal();
    };

    // ---------------------------------------------------------
    // 5. MODAL SYNCHRONIZATION LOCKSTEP PROTOCOL
    // ---------------------------------------------------------
    const openModal = (modalEl) => {
        if (!modalEl) return;
        modalEl.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
        modalEl.classList.add('flex', 'opacity-100', 'pointer-events-auto');
        document.body.classList.add('overflow-hidden');
    };

    const closeModal = (modalEl) => {
        if (!modalEl) return;
        modalEl.classList.remove('flex', 'opacity-100', 'pointer-events-auto');
        modalEl.classList.add('hidden', 'opacity-0', 'pointer-events-none');
        document.body.classList.remove('overflow-hidden');
    };

    const openCartModal = () => {
        renderCartModalContent();
        openModal(document.getElementById('cart-modal'));
    };

    const closeCartModal = () => {
        closeModal(document.getElementById('cart-modal'));
    };

    const openCheckoutModal = () => {
        if (appState.cart.length === 0) {
            phToast('Your cart is empty!', 'error');
            return;
        }
        closeCartModal();
        
        // Populate checkout summary
        let subtotal = 0;
        appState.cart.forEach(item => {
            const prod = appState.products.find(p => p.id === item.productId);
            if (prod) subtotal += prod.price * item.quantity;
        });
        const tax = subtotal * 0.08;
        const shipping = subtotal > 35 ? 0 : 4.99;
        const total = subtotal + tax + shipping;

        const summaryContainer = document.getElementById('checkout-items-summary');
        if (summaryContainer) {
            summaryContainer.innerHTML = appState.cart.map(item => {
                const prod = appState.products.find(p => p.id === item.productId);
                if (!prod) return '';
                return `
                    <div class="flex justify-between items-center text-xs text-stone-600">
                        <span>${prod.name} x ${item.quantity}</span>
                        <span class="font-bold text-stone-900">$${(prod.price * item.quantity).toFixed(2)}</span>
                    </div>
                `;
            }).join('');
        }

        document.getElementById('checkout-final-total').textContent = `$${total.toFixed(2)}`;
        openModal(document.getElementById('checkout-modal'));
    };

    const closeCheckoutModal = () => {
        closeModal(document.getElementById('checkout-modal'));
    };

    const openProductModal = (productId) => {
        const product = appState.products.find(p => p.id === productId);
        if (!product) return;
        appState.activeProductModal = product;

        const modal = document.getElementById('product-modal');
        document.getElementById('modal-prod-img').src = product.image;
        document.getElementById('modal-prod-category').textContent = product.category;
        document.getElementById('modal-prod-name').textContent = product.name;
        document.getElementById('modal-prod-price').textContent = `$${product.price.toFixed(2)}`;
        document.getElementById('modal-prod-rating').textContent = `${product.rating} (${product.reviews} reviews)`;
        document.getElementById('modal-prod-desc').textContent = product.description;

        const tagsContainer = document.getElementById('modal-prod-tags');
        if (tagsContainer) {
            tagsContainer.innerHTML = product.tags.map(t => `<span class="bg-amber-100 text-amber-900 text-xs font-semibold px-3 py-1 rounded-full">${t}</span>`).join('');
        }

        // Reset qty input
        const qtyInput = document.getElementById('modal-prod-qty');
        if (qtyInput) qtyInput.value = 1;

        openModal(modal);
    };

    const closeProductModal = () => {
        closeModal(document.getElementById('product-modal'));
        appState.activeProductModal = null;
    };

    const openSuccessModal = (orderData) => {
        closeCheckoutModal();
        appState.checkoutOrder = orderData;

        document.getElementById('success-order-id').textContent = orderData.orderId;
        document.getElementById('success-customer-name').textContent = orderData.fullName;
        document.getElementById('success-customer-email').textContent = orderData.email;
        document.getElementById('success-customer-address').textContent = orderData.address;
        document.getElementById('success-order-total').textContent = `$${orderData.total.toFixed(2)}`;

        const itemsList = document.getElementById('success-order-items');
        if (itemsList) {
            itemsList.innerHTML = orderData.items.map(item => `
                <div class="flex justify-between text-stone-700">
                    <span>${item.productName} (x${item.quantity})</span>
                    <span class="font-semibold">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('');
        }

        openModal(document.getElementById('success-modal'));
    };

    const closeSuccessModal = () => {
        closeModal(document.getElementById('success-modal'));
        // Clear cart after successful checkout
        appState.cart = [];
        saveState();
        updateCartCount();
        renderProducts();
    };

    // ---------------------------------------------------------
    // 6. EVENT BINDINGS & INITIALIZATION
    // ---------------------------------------------------------
    const initApp = () => {
        // Render initial products
        renderProducts();
        updateCartCount();

        // Navbar Cart Button
        const cartBtn = document.getElementById('cart-button');
        if (cartBtn) {
            cartBtn.addEventListener('click', openCartModal);
        }

        // Category Filter Pills
        document.querySelectorAll('.filter-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                document.querySelectorAll('.filter-pill').forEach(p => {
                    p.classList.remove('bg-stone-900', 'text-white', 'shadow-md');
                    p.classList.add('bg-stone-100', 'text-stone-700', 'hover:bg-stone-200');
                });
                pill.classList.remove('bg-stone-100', 'text-stone-700', 'hover:bg-stone-200');
                pill.classList.add('bg-stone-900', 'text-white', 'shadow-md');

                appState.currentCategory = pill.getAttribute('data-category');
                renderProducts();
            });
        });

        // Real-time Search Input
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                appState.searchQuery = e.target.value.trim();
                renderProducts();
            });
        }

        // Modal Close Buttons & Backdrops
        const bindModalClose = (closeBtnId, modalId) => {
            const btn = document.getElementById(closeBtnId);
            const modal = document.getElementById(modalId);
            if (btn && modal) {
                btn.addEventListener('click', () => closeModal(modal));
            }
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) closeModal(modal);
                });
            }
        };

        bindModalClose('close-cart-modal', 'cart-modal');
        bindModalClose('close-cart-footer', 'cart-modal');
        bindModalClose('close-product-modal', 'product-modal');
        bindModalClose('close-checkout-modal', 'checkout-modal');
        bindModalClose('close-success-modal', 'success-modal');

        // Proceed to Checkout Button in Cart
        const proceedCheckoutBtn = document.getElementById('proceed-checkout-btn');
        if (proceedCheckoutBtn) {
            proceedCheckoutBtn.addEventListener('click', openCheckoutModal);
        }

        // Product Modal Quantity Controls
        const modalQtyMinus = document.getElementById('modal-qty-minus');
        const modalQtyPlus = document.getElementById('modal-qty-plus');
        const modalQtyInput = document.getElementById('modal-prod-qty');

        if (modalQtyMinus && modalQtyInput) {
            modalQtyMinus.addEventListener('click', () => {
                let current = parseInt(modalQtyInput.value) || 1;
                if (current > 1) modalQtyInput.value = current - 1;
            });
        }

        if (modalQtyPlus && modalQtyInput) {
            modalQtyPlus.addEventListener('click', () => {
                let current = parseInt(modalQtyInput.value) || 1;
                modalQtyInput.value = current + 1;
            });
        }

        // Product Modal Add to Cart
        const modalAddToCartBtn = document.getElementById('modal-add-to-cart');
        if (modalAddToCartBtn) {
            modalAddToCartBtn.addEventListener('click', () => {
                if (!appState.activeProductModal) return;
                const qty = parseInt(modalQtyInput ? modalQtyInput.value : 1) || 1;
                addToCart(appState.activeProductModal.id, qty);
                closeProductModal();
            });
        }

        // Product Modal Buy Now
        const modalBuyNowBtn = document.getElementById('modal-buy-now');
        if (modalBuyNowBtn) {
            modalBuyNowBtn.addEventListener('click', () => {
                if (!appState.activeProductModal) return;
                const qty = parseInt(modalQtyInput ? modalQtyInput.value : 1) || 1;
                addToCart(appState.activeProductModal.id, qty);
                closeProductModal();
                openCartModal();
            });
        }

        // Checkout Form Submission
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const fullName = document.getElementById('checkout-name').value.trim();
                const email = document.getElementById('checkout-email').value.trim();
                const phone = document.getElementById('checkout-phone').value.trim();
                const address = document.getElementById('checkout-address').value.trim();
                const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'card';

                if (!fullName || !email || !address) {
                    phToast('Please fill in all required checkout fields.', 'error');
                    return;
                }

                let subtotal = 0;
                const orderItems = appState.cart.map(item => {
                    const prod = appState.products.find(p => p.id === item.productId);
                    if (!prod) return null;
                    subtotal += prod.price * item.quantity;
                    return {
                        productId: prod.id,
                        productName: prod.name,
                        price: prod.price,
                        quantity: item.quantity
                    };
                }).filter(Boolean);

                const tax = subtotal * 0.08;
                const shipping = subtotal > 35 ? 0 : 4.99;
                const total = subtotal + tax + shipping;

                const orderData = {
                    orderId: 'BB-' + Math.floor(100000 + Math.random() * 900000),
                    fullName,
                    email,
                    phone,
                    address,
                    paymentMethod,
                    items: orderItems,
                    total,
                    createdAt: new Date().toISOString()
                };

                phToast('Order placed successfully!', 'success');
                openSuccessModal(orderData);
            });
        }

        // Done button on success modal
        const successDoneBtn = document.getElementById('success-done-btn');
        if (successDoneBtn) {
            successDoneBtn.addEventListener('click', closeSuccessModal);
        }

        // Newsletter form intercept
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const emailInput = newsletterForm.querySelector('input[type="email"]');
                if (emailInput && emailInput.value.trim()) {
                    phToast('Thank you for subscribing! Use code BREW10 for 10% off.', 'success');
                    emailInput.value = '';
                }
            });
        }
    };

    // Run initialization
    initApp();
});
