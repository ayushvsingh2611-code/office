/**
 * PizzaVibe - Complete Application Logic & Interactive State Engine
 * Developed by Usopp (Backend & Application Logic Engineer)
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. DOM ELEMENTS REGISTRY
    // ----------------------------------------------------
    const menuGrid = document.getElementById('menu-grid');
    const searchInput = document.getElementById('search-input');
    const categoryFilters = document.querySelectorAll('.category-filter');
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountBadge = document.getElementById('cart-count');
    const cartSubtotalEl = document.getElementById('cart-subtotal');
    const cartTaxEl = document.getElementById('cart-tax');
    const cartTotalEl = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const emptyCartMsg = document.getElementById('empty-cart-msg');
    const cartFooter = document.getElementById('cart-footer');
    
    // Customization Modal Elements
    const customModal = document.getElementById('custom-modal');
    const closeCustomBtn = document.getElementById('close-custom-btn');
    const customPizzaTitle = document.getElementById('custom-pizza-title');
    const customPizzaDesc = document.getElementById('custom-pizza-desc');
    const customPizzaImg = document.getElementById('custom-pizza-img');
    const customBasePrice = document.getElementById('custom-base-price');
    const sizeRadios = document.querySelectorAll('input[name="pizza-size"]');
    const crustRadios = document.querySelectorAll('input[name="pizza-crust"]');
    const toppingCheckboxes = document.querySelectorAll('.topping-checkbox');
    const addToCartCustomBtn = document.getElementById('add-to-cart-custom-btn');

    // Checkout Modal Elements
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckoutBtn = document.getElementById('close-checkout-btn');
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutTotalSpan = document.getElementById('checkout-total');

    // Order Success Modal Elements
    const successModal = document.getElementById('success-modal');
    const closeSuccessBtn = document.getElementById('close-success-btn');
    const viewTrackerBtn = document.getElementById('view-tracker-btn');

    // Order Tracker Section / Modal
    const trackerSection = document.getElementById('tracker-section');
    const trackOrderInput = document.getElementById('track-order-input');
    const trackOrderBtn = document.getElementById('track-order-btn');
    const trackerResult = document.getElementById('tracker-result');
    const trackerOrderId = document.getElementById('tracker-order-id');
    const trackerStatusText = document.getElementById('tracker-status-text');
    const trackerProgressBar = document.getElementById('tracker-progress-bar');
    const stepReceived = document.getElementById('step-received');
    const stepBaking = document.getElementById('step-baking');
    const stepDelivery = document.getElementById('step-delivery');
    const stepDelivered = document.getElementById('step-delivered');

    // Toast Container
    const toastContainer = document.getElementById('toast-container') || createToastContainer();

    // ----------------------------------------------------
    // 2. SEED DATA & REACTIVE STATE
    // ----------------------------------------------------
    const defaultPizzas = [
        {
            id: 'p1',
            name: 'Margherita Classica',
            category: 'veg',
            price: 14.99,
            rating: 4.8,
            reviewsCount: 124,
            image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
            description: 'San Marzano tomatoes, fresh mozzarella di bufala, fresh basil, extra virgin olive oil.',
            bestseller: true
        },
        {
            id: 'p2',
            name: 'Diavola Inferno',
            category: 'spicy',
            price: 17.99,
            rating: 4.9,
            reviewsCount: 215,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
            description: 'Spicy Italian salami (soppressata), Calabrian chili paste, mozzarella, hot honey drizzle.',
            bestseller: true
        },
        {
            id: 'p3',
            name: 'Truffle Funghi Supreme',
            category: 'veg',
            price: 19.49,
            rating: 4.7,
            reviewsCount: 98,
            image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80',
            description: 'Wild forest mushrooms, truffle-infused cream sauce, thyme, fontina & mozzarella cheese.',
            bestseller: false
        },
        {
            id: 'p4',
            name: 'Prosciutto & Arugula',
            category: 'chef',
            price: 20.99,
            rating: 4.9,
            reviewsCount: 172,
            image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80',
            description: 'Prosciutto di Parma, fresh baby arugula, shaved Parmigiano-Reggiano, balsamic glaze.',
            bestseller: true
        },
        {
            id: 'p5',
            name: 'BBQ Smoked Brisket',
            category: 'meat',
            price: 18.99,
            rating: 4.6,
            reviewsCount: 88,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
            description: 'Slow-smoked beef brisket, tangy bourbon BBQ sauce, red onions, smoked gouda, cilantro.',
            bestseller: false
        },
        {
            id: 'p6',
            name: 'Quattro Formaggi',
            category: 'veg',
            price: 16.99,
            rating: 4.8,
            reviewsCount: 140,
            image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
            description: 'Fior di latte, Gorgonzola DOP, Pecorino Romano, creamy ricotta, garlic oil.',
            bestseller: false
        },
        {
            id: 'p7',
            name: 'Garlic Butter Prawns',
            category: 'chef',
            price: 21.99,
            rating: 4.9,
            reviewsCount: 110,
            image: 'https://images.unsplash.com/photo-1595736279585-4819d424cb4d?auto=format&fit=crop&w=600&q=80',
            description: 'Garlic butter marinated tiger prawns, cherry tomatoes, parsley, mozzarella, lemon zest.',
            bestseller: false
        },
        {
            id: 'p8',
            name: 'Pepperoni Paradise',
            category: 'meat',
            price: 16.49,
            rating: 4.9,
            reviewsCount: 310,
            image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80',
            description: 'Double layer of artisan crispy pepperoni, Italian herbs, mozzarella cheese, rich tomato sauce.',
            bestseller: true
        }
    ];

    let appState = {
        pizzas: defaultPizzas,
        cart: [],
        orders: [],
        currentCategory: 'all',
        searchQuery: '',
        activeCustomPizza: null,
        activeCustomSize: 'Medium (+ $0.00)',
        activeCustomSizePrice: 0,
        activeCustomCrust: 'Classic Hand Tossed',
        activeCustomToppings: []
    };

    // Load from LocalStorage if available
    function loadState() {
        const savedCart = localStorage.getItem('pizzavibe_cart');
        const savedOrders = localStorage.getItem('pizzavibe_orders');
        if (savedCart) {
            try { appState.cart = JSON.parse(savedCart); } catch(e) { console.error(e); }
        }
        if (savedOrders) {
            try { appState.orders = JSON.parse(savedOrders); } catch(e) { console.error(e); }
        }
    }

    function saveState() {
        localStorage.setItem('pizzavibe_cart', JSON.stringify(appState.cart));
        localStorage.setItem('pizzavibe_orders', JSON.stringify(appState.orders));
        updateCartBadge();
    }

    // ----------------------------------------------------
    // 3. TOAST NOTIFICATION SYSTEM
    // ----------------------------------------------------
    function createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none';
        document.body.appendChild(container);
        return container;
    }

    window.phToast = function(message, type = 'success') {
        const toast = document.createElement('div');
        const bgColors = {
            success: 'bg-emerald-600 text-white',
            error: 'bg-rose-600 text-white',
            info: 'bg-stone-800 text-white'
        };
        const icons = {
            success: 'fa-circle-check',
            error: 'fa-triangle-exclamation',
            info: 'fa-circle-info'
        };

        toast.className = `flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl pointer-events-auto transform translate-y-4 opacity-0 transition-all duration-300 font-medium text-sm ${bgColors[type] || bgColors.success}`;
        toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.success} text-lg"></i><span>${message}</span>`;
        
        toastContainer.appendChild(toast);
        
        // Trigger transition
        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-4', 'opacity-0');
        });

        setTimeout(() => {
            toast.classList.add('translate-y-4', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    };

    // ----------------------------------------------------
    // 4. RENDER ENGINE: MENU & CATALOG
    // ----------------------------------------------------
    function renderMenu() {
        if (!menuGrid) return;

        const filtered = appState.pizzas.filter(pizza => {
            const matchesCategory = appState.currentCategory === 'all' || pizza.category === appState.currentCategory;
            const matchesSearch = pizza.name.toLowerCase().includes(appState.searchQuery.toLowerCase()) ||
                                  pizza.description.toLowerCase().includes(appState.searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        if (filtered.length === 0) {
            menuGrid.innerHTML = `
                <div class="col-span-full py-16 text-center">
                    <div class="w-16 h-16 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                        <i class="fa-solid fa-pizza-slice"></i>
                    </div>
                    <h3 class="text-xl font-bold text-stone-800 mb-1">No Pizzas Found</h3>
                    <p class="text-stone-500 text-sm">Try adjusting your search query or category filter.</p>
                </div>
            `;
            return;
        }

        menuGrid.innerHTML = filtered.map(pizza => `
            <div class="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
                <div class="relative h-52 overflow-hidden bg-stone-100">
                    <img src="${pizza.image}" alt="${pizza.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                    ${pizza.bestseller ? '<span class="absolute top-3 left-3 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md"><i class="fa-solid fa-fire mr-1"></i> Bestseller</span>' : ''}
                    <div class="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                        <i class="fa-solid fa-star text-amber-500"></i>
                        <span>${pizza.rating}</span>
                        <span class="text-stone-400">(${pizza.reviewsCount})</span>
                    </div>
                </div>
                <div class="p-6 flex flex-col flex-grow">
                    <div class="flex items-start justify-between gap-2 mb-2">
                        <h3 class="font-bold text-lg text-stone-900 group-hover:text-orange-600 transition">${pizza.name}</h3>
                        <span class="text-lg font-extrabold text-orange-600">$${pizza.price.toFixed(2)}</span>
                    </div>
                    <p class="text-stone-600 text-sm mb-6 line-clamp-2">${pizza.description}</p>
                    <div class="mt-auto flex items-center gap-3">
                        <button onclick="window.openCustomizer('${pizza.id}')" class="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold py-2.5 px-4 rounded-xl text-sm transition flex items-center justify-center gap-2">
                            <i class="fa-solid fa-sliders text-xs"></i> Customize
                        </button>
                        <button onclick="window.quickAddToCart('${pizza.id}')" class="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition shadow-md shadow-orange-600/20 flex items-center justify-center gap-2">
                            <i class="fa-solid fa-cart-plus text-xs"></i> Add
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // ----------------------------------------------------
    // 5. CART & ORDER LOGIC
    // ----------------------------------------------------
    function updateCartBadge() {
        const totalItems = appState.cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountBadge) {
            cartCountBadge.textContent = totalItems;
            if (totalItems > 0) {
                cartCountBadge.classList.remove('hidden');
            } else {
                cartCountBadge.classList.add('hidden');
            }
        }
    }

    function renderCartModal() {
        if (!cartItemsContainer) return;

        if (appState.cart.length === 0) {
            emptyCartMsg.classList.remove('hidden');
            cartFooter.classList.add('hidden');
            cartItemsContainer.innerHTML = '';
            return;
        }

        emptyCartMsg.classList.add('hidden');
        cartFooter.classList.remove('hidden');

        let subtotal = 0;

        cartItemsContainer.innerHTML = appState.cart.map((item, index) => {
            const itemTotal = (item.unitPrice + item.toppingsTotal) * item.quantity;
            subtotal += itemTotal;

            const toppingsList = item.toppings && item.toppings.length > 0 
                ? `<div class="text-xs text-stone-500 mt-1">+ ${item.toppings.join(', ')}</div>` 
                : '';

            return `
                <div class="flex items-start gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-xl flex-shrink-0">
                    <div class="flex-grow">
                        <div class="flex items-start justify-between">
                            <h4 class="font-bold text-stone-900 text-sm">${item.name}</h4>
                            <button onclick="window.removeFromCart(${index})" class="text-stone-400 hover:text-rose-600 transition p-1"><i class="fa-solid fa-trash-can text-sm"></i></button>
                        </div>
                        <div class="text-xs font-semibold text-stone-500 mt-0.5">${item.size} • ${item.crust}</div>
                        ${toppingsList}
                        <div class="flex items-center justify-between mt-3">
                            <div class="flex items-center gap-2 bg-white border border-stone-200 rounded-lg px-2 py-1">
                                <button onclick="window.updateCartQty(${index}, -1)" class="text-stone-500 hover:text-stone-900 px-1 font-bold">-</button>
                                <span class="text-xs font-bold text-stone-800 w-4 text-center">${item.quantity}</span>
                                <button onclick="window.updateCartQty(${index}, 1)" class="text-stone-500 hover:text-stone-900 px-1 font-bold">+</button>
                            </div>
                            <span class="font-extrabold text-stone-900 text-sm">$${itemTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + tax;

        if (cartSubtotalEl) cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (cartTaxEl) cartTaxEl.textContent = `$${tax.toFixed(2)}`;
        if (cartTotalEl) cartTotalEl.textContent = `$${total.toFixed(2)}`;
        if (checkoutTotalSpan) checkoutTotalSpan.textContent = `$${total.toFixed(2)}`;
    }

    window.quickAddToCart = function(pizzaId) {
        const pizza = appState.pizzas.find(p => p.id === pizzaId);
        if (!pizza) return;

        const cartItem = {
            id: pizza.id,
            name: pizza.name,
            image: pizza.image,
            unitPrice: pizza.price,
            toppingsTotal: 0,
            size: 'Regular (12")',
            crust: 'Classic Hand Tossed',
            toppings: [],
            quantity: 1
        };

        appState.cart.push(cartItem);
        saveState();
        renderCartModal();
        window.phToast(`Added ${pizza.name} to cart!`, 'success');
    };

    window.removeFromCart = function(index) {
        const removed = appState.cart.splice(index, 1);
        saveState();
        renderCartModal();
        if (removed && removed[0]) {
            window.phToast(`Removed ${removed[0].name} from cart`, 'info');
        }
    };

    window.updateCartQty = function(index, delta) {
        appState.cart[index].quantity += delta;
        if (appState.cart[index].quantity <= 0) {
            appState.cart.splice(index, 1);
        }
        saveState();
        renderCartModal();
    };

    // ----------------------------------------------------
    // 6. MODAL SYNCHRONIZATION PROTOCOL
    // ----------------------------------------------------
    function openModal(modalEl) {
        if (!modalEl) return;
        modalEl.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
        modalEl.classList.add('flex', 'opacity-100', 'pointer-events-auto');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modalEl) {
        if (!modalEl) return;
        modalEl.classList.remove('flex', 'opacity-100', 'pointer-events-auto');
        modalEl.classList.add('hidden', 'opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';
    }

    // Cart Modal Toggles
    if (cartBtn) cartBtn.addEventListener('click', () => {
        renderCartModal();
        openModal(cartModal);
    });
    if (closeCartBtn) closeCartBtn.addEventListener('click', () => closeModal(cartModal));
    if (cartModal) cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) closeModal(cartModal);
    });

    // ----------------------------------------------------
    // 7. CUSTOMIZER LOGIC
    // ----------------------------------------------------
    window.openCustomizer = function(pizzaId) {
        const pizza = appState.pizzas.find(p => p.id === pizzaId);
        if (!pizza) return;

        appState.activeCustomPizza = pizza;
        
        if (customPizzaTitle) customPizzaTitle.textContent = pizza.name;
        if (customPizzaDesc) customPizzaDesc.textContent = pizza.description;
        if (customPizzaImg) customPizzaImg.src = pizza.image;

        // Reset inputs
        if (sizeRadios[0]) sizeRadios[0].checked = true;
        if (crustRadios[0]) crustRadios[0].checked = true;
        toppingCheckboxes.forEach(cb => cb.checked = false);

        appState.activeCustomSize = 'Medium (12")';
        appState.activeCustomSizePrice = 0;
        appState.activeCustomCrust = 'Classic Hand Tossed';
        appState.activeCustomToppings = [];

        updateCustomizerPrice();
        openModal(customModal);
    };

    if (closeCustomBtn) closeCustomBtn.addEventListener('click', () => closeModal(customModal));
    if (customModal) customModal.addEventListener('click', (e) => {
        if (e.target === customModal) closeModal(customModal);
    });

    sizeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            appState.activeCustomSize = e.target.value;
            appState.activeCustomSizePrice = parseFloat(e.target.dataset.price || 0);
            updateCustomizerPrice();
        });
    });

    crustRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            appState.activeCustomCrust = e.target.value;
        });
    });

    toppingCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            appState.activeCustomToppings = Array.from(toppingCheckboxes)
                .filter(i => i.checked)
                .map(i => ({ name: i.value, price: parseFloat(i.dataset.price || 1.50) }));
            updateCustomizerPrice();
        });
    });

    function updateCustomizerPrice() {
        if (!appState.activeCustomPizza) return;
        let base = appState.activeCustomPizza.price + appState.activeCustomSizePrice;
        let toppingsSum = appState.activeCustomToppings.reduce((sum, t) => sum + t.price, 0);
        let total = base + toppingsSum;
        if (customBasePrice) customBasePrice.textContent = `$${total.toFixed(2)}`;
    }

    if (addToCartCustomBtn) {
        addToCartCustomBtn.addEventListener('click', () => {
            const pizza = appState.activeCustomPizza;
            if (!pizza) return;

            let base = pizza.price + appState.activeCustomSizePrice;
            let toppingsSum = appState.activeCustomToppings.reduce((sum, t) => sum + t.price, 0);

            const customCartItem = {
                id: pizza.id,
                name: pizza.name,
                image: pizza.image,
                unitPrice: base,
                toppingsTotal: toppingsSum,
                size: appState.activeCustomSize,
                crust: appState.activeCustomCrust,
                toppings: appState.activeCustomToppings.map(t => t.name),
                quantity: 1
            };

            appState.cart.push(customCartItem);
            saveState();
            closeModal(customModal);
            renderCartModal();
            window.phToast(`Added custom ${pizza.name} to cart!`, 'success');
        });
    }

    // ----------------------------------------------------
    // 8. CHECKOUT & ORDER SUCCESS FLOW
    // ----------------------------------------------------
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (appState.cart.length === 0) {
                window.phToast('Your cart is empty!', 'error');
                return;
            }
            closeModal(cartModal);
            openModal(checkoutModal);
        });
    }

    if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', () => closeModal(checkoutModal));
    if (checkoutModal) checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) closeModal(checkoutModal);
    });

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(checkoutForm);
            const customerName = formData.get('name') || 'Valued Customer';
            const customerPhone = formData.get('phone') || 'N/A';
            const customerAddress = formData.get('address') || 'Delivery Address';

            const subtotal = appState.cart.reduce((sum, item) => sum + ((item.unitPrice + item.toppingsTotal) * item.quantity), 0);
            const tax = subtotal * 0.08;
            const total = subtotal + tax;

            const orderId = 'PV-' + Math.floor(100000 + Math.random() * 900000);
            const newOrder = {
                orderId,
                customerName,
                customerPhone,
                customerAddress,
                items: [...appState.cart],
                total: total.toFixed(2),
                status: 'Order Received',
                createdAt: new Date().toISOString()
            };

            appState.orders.push(newOrder);
            appState.cart = [];
            saveState();
            closeModal(checkoutModal);
            checkoutForm.reset();

            // Show Success Modal
            openModal(successModal);
            window.phToast(`Order ${orderId} placed successfully!`, 'success');
        });
    }

    if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', () => closeModal(successModal));
    if (successModal) successModal.addEventListener('click', (e) => {
        if (e.target === successModal) closeModal(successModal);
    });

    if (viewTrackerBtn) {
        viewTrackerBtn.addEventListener('click', () => {
            closeModal(successModal);
            if (trackerSection) {
                trackerSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ----------------------------------------------------
    // 9. REAL-TIME SEARCH & CATEGORY FILTERING
    // ----------------------------------------------------
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            appState.searchQuery = e.target.value.trim();
            renderMenu();
        });
    }

    categoryFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryFilters.forEach(b => {
                b.classList.remove('bg-orange-600', 'text-white', 'shadow-md', 'shadow-orange-600/20');
                b.classList.add('bg-white', 'text-stone-700', 'border', 'border-stone-200');
            });
            btn.classList.remove('bg-white', 'text-stone-700', 'border', 'border-stone-200');
            btn.classList.add('bg-orange-600', 'text-white', 'shadow-md', 'shadow-orange-600/20');

            appState.currentCategory = btn.dataset.category || 'all';
            renderMenu();
        });
    });

    // ----------------------------------------------------
    // 10. ORDER TRACKER LOGIC
    // ----------------------------------------------------
    if (trackOrderBtn && trackOrderInput) {
        trackOrderBtn.addEventListener('click', () => {
            const queryId = trackOrderInput.value.trim().toUpperCase();
            if (!queryId) {
                window.phToast('Please enter a valid Order ID', 'error');
                return;
            }

            const foundOrder = appState.orders.find(o => o.orderId.toUpperCase() === queryId) || {
                orderId: queryId,
                status: 'Baking in Wood-Fired Oven',
                createdAt: new Date()
            };

            if (trackerResult) {
                trackerResult.classList.remove('hidden');
            }
            if (trackerOrderId) trackerOrderId.textContent = foundOrder.orderId;
            if (trackerStatusText) trackerStatusText.textContent = foundOrder.status || 'Out for Delivery';

            // Simulate progress steps
            if (trackerProgressBar) trackerProgressBar.style.width = '75%';
            if (stepReceived) stepReceived.classList.add('text-orange-600', 'font-bold');
            if (stepBaking) stepBaking.classList.add('text-orange-600', 'font-bold');
            if (stepDelivery) stepDelivery.classList.add('text-orange-600', 'font-bold');

            window.phToast(`Tracking status loaded for ${foundOrder.orderId}`, 'success');
        });
    }

    // ----------------------------------------------------
    // 11. INITIALIZATION & SAFETY AUDIT
    // ----------------------------------------------------
    loadState();
    renderMenu();
    updateCartBadge();
    
    console.log('PizzaVibe Application Logic successfully initialized by Usopp.');
});
