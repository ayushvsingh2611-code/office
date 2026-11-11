// app.js — Roast & Ritual Artisan Coffee Co.
// Complete, production-grade frontend logic engine with Cart Drawer, Filtering, Checkout & Reviews

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial State & Seed Data with LocalStorage Persistence
  const STORAGE_KEYS = {
    CART: 'roast_ritual_cart_v2',
    REVIEWS: 'roast_ritual_reviews_v2'
  };

  // 8 Curated Artisan Coffees
  const PRODUCTS = [
    {
      id: 'rr-ethiopia',
      name: 'Ethiopian Yirgacheffe G1',
      category: 'Single Origin',
      roast: 'Light',
      origin: 'Yirgacheffe, Gedeb District',
      altitude: '2,050m - 2,200m',
      flavorNotes: ['Wild Blueberry', 'Bergamot', 'Jasmine Honey'],
      description: 'Delicate and tea-like with intoxicating floral aromatics and vibrant heirloom berry sweetness. Ideal for Chemex and V60.',
      basePrice: 19.50,
      baseWeight: 250,
      rating: 4.95,
      reviewCount: 38,
      imageUrl: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'rr-guatemala',
      name: 'Guatemala Antigua Reserve',
      category: 'Single Origin',
      roast: 'Medium',
      origin: 'Antigua Valley, Volcán de Fuego',
      altitude: '1,650m - 1,800m',
      flavorNotes: ['Dark Cocoa', 'Candied Orange', 'Caramelized Pecan'],
      description: 'Grown in mineral-rich volcanic ash. Well-balanced medium body with velvety bittersweet chocolate and citrus brightness.',
      basePrice: 18.00,
      baseWeight: 250,
      rating: 4.88,
      reviewCount: 29,
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'rr-sumatra',
      name: 'Sumatra Mandheling Triple-Pick',
      category: 'Single Origin',
      roast: 'Dark',
      origin: 'Lake Toba, North Sumatra',
      altitude: '1,400m - 1,550m',
      flavorNotes: ['Pipe Tobacco', 'Black Molasses', 'Cedar', 'Dark Plum'],
      description: 'Wet-hulled (Giling Basah) artisan preparation yielding deep earthy intensity, ultra-low acidity, and syrupy body.',
      basePrice: 18.50,
      baseWeight: 250,
      rating: 4.82,
      reviewCount: 24,
      imageUrl: 'https://images.unsplash.com/photo-1559525839-8f8ec320b9c3?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'rr-geisha',
      name: 'Colombia Huila Pink Bourbon',
      category: 'Single Origin',
      roast: 'Light',
      origin: 'San Adolfo, Huila',
      altitude: '1,900m',
      flavorNotes: ['Pink Guava', 'Peach Nectar', 'White Florals'],
      description: 'Rare mutation micro-lot. Explosive tropical vibrancy, champagne effervescence, and silky honey mouthfeel.',
      basePrice: 24.00,
      baseWeight: 250,
      rating: 4.98,
      reviewCount: 42,
      imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'rr-velvet-espresso',
      name: 'Midnight Velvet Espresso',
      category: 'Espresso',
      roast: 'Espresso',
      origin: 'Brazil Sul de Minas & Ethiopia Sidama',
      altitude: '1,200m - 1,900m',
      flavorNotes: ['Dark Chocolate Truffle', 'Toasted Hazelnut', 'Crema Sweetness'],
      description: 'Engineered for thick, golden tiger-stripe crema and velvety milk drinks. Full-throttle sweetness without harsh bitterness.',
      basePrice: 17.50,
      baseWeight: 250,
      rating: 4.91,
      reviewCount: 56,
      imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'rr-alchemy-blend',
      name: 'Solstice Alchemy Blend',
      category: 'Artisan Blends',
      roast: 'Medium',
      origin: 'Costa Rica Tarrazú & Kenya Nyeri',
      altitude: '1,700m - 2,000m',
      flavorNotes: ['Red Currant', 'Toffee Crisp', 'Meyer Lemon'],
      description: 'Our award-winning house breakfast blend harmonizing East African lively acidity with Central American caramelized body.',
      basePrice: 17.00,
      baseWeight: 250,
      rating: 4.86,
      reviewCount: 33,
      imageUrl: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'rr-dark-roast',
      name: 'Obsidian Smokehouse Roast',
      category: 'Artisan Blends',
      roast: 'Dark',
      origin: 'Guatemala & Papua New Guinea',
      altitude: '1,500m - 1,800m',
      flavorNotes: ['Smoky Vanilla', '85% Cocoa', 'Roasted Walnut'],
      description: 'Bold, comforting French roast style. Roaster smoke captured elegantly with zero charred ash notes. Incredible with cream.',
      basePrice: 17.50,
      baseWeight: 250,
      rating: 4.79,
      reviewCount: 19,
      imageUrl: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'rr-mountain-decaf',
      name: 'Chiapas Mountain Water Decaf',
      category: 'Decaf',
      roast: 'Medium',
      origin: 'Chiapas, Mexico',
      altitude: '1,400m - 1,600m',
      flavorNotes: ['Milk Chocolate', 'Graham Cracker', 'Red Apple'],
      description: '100% chemical-free Mountain Water Process preserving the rich origin nuances while removing 99.9% of caffeine.',
      basePrice: 18.50,
      baseWeight: 250,
      rating: 4.84,
      reviewCount: 22,
      imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800&auto=format&fit=crop'
    }
  ];

  // Seed Reviews
  const INITIAL_REVIEWS = [
    {
      id: 'rev-1',
      productId: 'rr-ethiopia',
      productName: 'Ethiopian Yirgacheffe G1',
      author: 'Marcus Vance',
      badge: 'Verified Pour-Over Devotee',
      rating: 5,
      title: 'Unbelievable floral and blueberry extraction!',
      comment: 'Ground at 18 clicks on the Comandante, brewed with 18g to 290g water on a V60. The aroma literally filled my entire home with honeysuckle and fresh blueberries. One of the cleanest Ethiopian lots I have ever had.',
      date: '2 days ago'
    },
    {
      id: 'rev-2',
      productId: 'rr-velvet-espresso',
      productName: 'Midnight Velvet Espresso',
      author: 'Clara Jenkins',
      badge: 'Certified Barista',
      rating: 5,
      title: 'Remarkable tiger stripes & syrupy mouthfeel',
      comment: 'Dialed in at 18g in, 38g out in 28 seconds on my La Marzocco Micra. Cuts through oat milk like liquid chocolate hazelnut fudge. Customers keep asking what beans we are using!',
      date: '4 days ago'
    },
    {
      id: 'rev-3',
      productId: 'rr-geisha',
      productName: 'Colombia Huila Pink Bourbon',
      author: 'Julian Thorne',
      badge: 'SCA Member',
      rating: 5,
      title: 'Pink guava juice in a cup. A masterpiece.',
      comment: 'I usually only buy Geishas for competition season, but this Pink Bourbon lot surprised me with its balance and sweetness. The aftertaste lingers for 15+ minutes.',
      date: '1 week ago'
    }
  ];

  // Weight multipliers for 250g, 500g, 1kg
  const WEIGHT_OPTIONS = [
    { label: '250g (Standard)', weight: 250, multiplier: 1.0 },
    { label: '500g (Double)', weight: 500, multiplier: 1.85 },
    { label: '1kg (Roaster Bulk)', weight: 1000, multiplier: 3.4 }
  ];

  const GRIND_OPTIONS = [
    'Whole Bean (Recommended)',
    'Espresso (Fine)',
    'Pour Over / V60 (Medium-Fine)',
    'Drip Coffee Maker (Medium)',
    'French Press (Coarse)',
    'Cold Brew (Extra Coarse)'
  ];

  // Application State
  const state = {
    products: PRODUCTS,
    cart: loadCart(),
    reviews: loadReviews(),
    filters: {
      category: 'all',
      roast: 'all',
      search: '',
      sort: 'featured'
    },
    promo: {
      applied: false,
      code: '',
      rate: 0.10 // 10%
    },
    shippingMethod: 'standard'
  };

  // Helper Functions: LocalStorage
  function loadCart() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(state.cart));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  function loadReviews() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  }

  function saveReviews() {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(state.reviews));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  // DOM Elements
  const elements = {
    // Header
    cartToggleBtn: document.getElementById('cart-toggle-btn'),
    cartBadge: document.getElementById('cart-badge'),
    heroCartBtn: document.getElementById('hero-cart-btn'),

    // Catalog & Filters
    productsGrid: document.getElementById('products-grid'),
    catalogEmptyState: document.getElementById('catalog-empty-state'),
    resetFiltersBtn: document.getElementById('reset-filters-btn'),
    categoryChips: document.getElementById('category-chips'),
    catalogSearch: document.getElementById('catalog-search'),
    filterRoast: document.getElementById('filter-roast'),
    filterSort: document.getElementById('filter-sort'),
    visibleCount: document.getElementById('visible-count'),

    // Cart Drawer
    cartOverlay: document.getElementById('cart-overlay'),
    cartDrawer: document.getElementById('cart-drawer'),
    closeCartBtn: document.getElementById('close-cart-btn'),
    drawerBody: document.getElementById('drawer-body'),
    drawerItemCount: document.getElementById('drawer-item-count'),
    shippingProgressBar: document.getElementById('shipping-progress-bar'),
    freeShippingText: document.getElementById('free-shipping-text'),
    promoInput: document.getElementById('promo-input'),
    applyPromoBtn: document.getElementById('apply-promo-btn'),
    promoNotice: document.getElementById('promo-notice'),
    cartSubtotal: document.getElementById('cart-subtotal'),
    cartShippingEst: document.getElementById('cart-shipping-est'),
    discountRow: document.getElementById('discount-row'),
    cartDiscount: document.getElementById('cart-discount'),
    cartTotalPrice: document.getElementById('cart-total-price'),
    checkoutBtn: document.getElementById('checkout-btn'),
    clearCartBtn: document.getElementById('clear-cart-btn'),

    // Checkout Modal
    checkoutModalBackdrop: document.getElementById('checkout-modal-backdrop'),
    closeCheckoutBtn: document.getElementById('close-checkout-btn'),
    checkoutForm: document.getElementById('checkout-form'),
    checkoutItemCount: document.getElementById('checkout-item-count'),
    checkoutSubtotal: document.getElementById('checkout-subtotal'),
    checkoutShipping: document.getElementById('checkout-shipping'),
    checkoutGrandTotal: document.getElementById('checkout-grand-total'),
    submitOrderBtn: document.getElementById('submit-order-btn'),
    submitOrderText: document.getElementById('submit-order-text'),

    // Confirmation Modal
    confirmationModalBackdrop: document.getElementById('confirmation-modal-backdrop'),
    closeConfirmationBtn: document.getElementById('close-confirmation-btn'),
    confirmOrderId: document.getElementById('confirm-order-id'),
    confirmRecipient: document.getElementById('confirm-recipient'),
    confirmShippingMethod: document.getElementById('confirm-shipping-method'),
    confirmTotalAmount: document.getElementById('confirm-total-amount'),

    // Reviews Section & Modal
    reviewsHighlightGrid: document.getElementById('reviews-highlight-grid'),
    writeReviewGeneralBtn: document.getElementById('write-review-general-btn'),
    reviewsModalBackdrop: document.getElementById('reviews-modal-backdrop'),
    closeReviewsModalBtn: document.getElementById('close-reviews-modal-btn'),
    newReviewForm: document.getElementById('new-review-form'),
    reviewProductSelect: document.getElementById('review-product-select'),
    starPicker: document.getElementById('star-picker'),
    modalReviewsList: document.getElementById('modal-reviews-list'),

    // Toast Container
    toastContainer: document.getElementById('toast-container')
  };

  // Toast Notification System
  function showToast(message, icon = 'fa-check-circle') {
    if (!elements.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'ph-toast';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Format Currency
  function formatMoney(amount) {
    return '$' + Number(amount).toFixed(2);
  }

  // 2. Product Catalog Rendering
  function renderCatalog() {
    if (!elements.productsGrid) return;

    let filtered = state.products.filter(p => {
      // Category filter
      if (state.filters.category !== 'all' && p.category !== state.filters.category) {
        return false;
      }
      // Roast filter
      if (state.filters.roast !== 'all' && p.roast !== state.filters.roast) {
        return false;
      }
      // Search filter (name, origin, flavor notes)
      if (state.filters.search.trim() !== '') {
        const query = state.filters.search.toLowerCase();
        const inName = p.name.toLowerCase().includes(query);
        const inOrigin = p.origin.toLowerCase().includes(query);
        const inNotes = p.flavorNotes.some(note => note.toLowerCase().includes(query));
        const inRoast = p.roast.toLowerCase().includes(query);
        if (!inName && !inOrigin && !inNotes && !inRoast) return false;
      }
      return true;
    });

    // Sorting
    if (state.filters.sort === 'price-asc') {
      filtered.sort((a, b) => a.basePrice - b.basePrice);
    } else if (state.filters.sort === 'price-desc') {
      filtered.sort((a, b) => b.basePrice - a.basePrice);
    } else if (state.filters.sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    // Update count display
    if (elements.visibleCount) {
      elements.visibleCount.textContent = filtered.length;
    }

    if (filtered.length === 0) {
      elements.productsGrid.innerHTML = '';
      elements.catalogEmptyState?.classList.remove('hidden');
      return;
    }

    elements.catalogEmptyState?.classList.add('hidden');

    elements.productsGrid.innerHTML = filtered.map(product => {
      // Determine roast badge styling class
      const roastClass = `roast-${product.roast.toLowerCase()}`;
      
      return `
        <article class="product-card" data-product-id="${product.id}">
          <div class="card-img-wrap">
            <img src="${product.imageUrl}" alt="${product.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop'">
            <span class="roast-badge ${roastClass}">${product.roast} Roast</span>
          </div>

          <div class="card-body">
            <span class="origin-tag"><i class="fa-solid fa-location-dot mr-1"></i> ${product.origin}</span>
            <h3 class="product-name">${product.name}</h3>
            
            <div class="reviews-trigger" onclick="window.openReviewsForProduct('${product.id}')">
              <span class="stars-rating">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star-half-stroke"></i>
              </span>
              <span class="font-bold ml-1">${product.rating}</span>
              <span class="text-xs text-[var(--text-dim)]">(${product.reviewCount} notes)</span>
            </div>

            <p class="product-desc">${product.description}</p>

            <div class="flavor-notes-row">
              ${product.flavorNotes.map(n => `<span class="flavor-pill"><i class="fa-solid fa-seedling text-[10px] mr-1 text-[var(--accent-amber)]"></i>${n}</span>`).join('')}
            </div>

            <div class="variant-selectors">
              <div class="selector-field">
                <label for="weight-${product.id}">Bag Weight</label>
                <select id="weight-${product.id}" class="custom-select w-full text-xs weight-select" data-product-id="${product.id}">
                  ${WEIGHT_OPTIONS.map(opt => `<option value="${opt.weight}">${opt.label}</option>`).join('')}
                </select>
              </div>

              <div class="selector-field">
                <label for="grind-${product.id}">Grind Profile</label>
                <select id="grind-${product.id}" class="custom-select w-full text-xs grind-select" data-product-id="${product.id}">
                  ${GRIND_OPTIONS.map(g => `<option value="${g}">${g.split(' ')[0]}</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="card-footer">
              <div class="price-block">
                <span class="price-label">Price / bag</span>
                <span class="price-value" id="price-display-${product.id}">${formatMoney(product.basePrice)}</span>
              </div>
              <button class="btn-add-cart add-to-cart-btn" data-product-id="${product.id}" aria-label="Add ${product.name} to bag">
                <i class="fa-solid fa-plus"></i>
                <span>Add to Bag</span>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach dynamic listeners for weight change to recalculate price preview
    document.querySelectorAll('.weight-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const prodId = e.target.getAttribute('data-product-id');
        const prod = state.products.find(p => p.id === prodId);
        if (!prod) return;
        const chosenWeight = parseInt(e.target.value, 10);
        const opt = WEIGHT_OPTIONS.find(o => o.weight === chosenWeight) || WEIGHT_OPTIONS[0];
        const price = prod.basePrice * opt.multiplier;
        const display = document.getElementById(`price-display-${prodId}`);
        if (display) display.textContent = formatMoney(price);
      });
    });

    // Attach Add to Bag listeners
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const prodId = btn.getAttribute('data-product-id');
        addToCart(prodId);
      });
    });
  }

  // 3. Cart Logic & Calculation
  function addToCart(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    const weightSelect = document.getElementById(`weight-${productId}`);
    const grindSelect = document.getElementById(`grind-${productId}`);

    const chosenWeight = weightSelect ? parseInt(weightSelect.value, 10) : 250;
    const chosenGrind = grindSelect ? grindSelect.value : 'Whole Bean';

    const weightOpt = WEIGHT_OPTIONS.find(o => o.weight === chosenWeight) || WEIGHT_OPTIONS[0];
    const unitPrice = product.basePrice * weightOpt.multiplier;

    // Check if duplicate variant already in cart
    const existingIndex = state.cart.findIndex(item => 
      item.productId === productId && 
      item.weight === chosenWeight && 
      item.grind === chosenGrind
    );

    if (existingIndex > -1) {
      state.cart[existingIndex].quantity += 1;
    } else {
      state.cart.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: product.id,
        name: product.name,
        roast: product.roast,
        weight: chosenWeight,
        grind: chosenGrind,
        price: unitPrice,
        quantity: 1,
        imageUrl: product.imageUrl
      });
    }

    saveCart();
    renderCart();
    openCart();
    showToast(`Added ${product.name} (${chosenWeight}g) to roastery bag!`, 'fa-bag-shopping');
  }

  function updateQuantity(itemId, delta) {
    const item = state.cart.find(i => i.id === itemId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    saveCart();
    renderCart();
  }

  function removeFromCart(itemId) {
    const item = state.cart.find(i => i.id === itemId);
    state.cart = state.cart.filter(i => i.id !== itemId);
    saveCart();
    renderCart();
    if (item) {
      showToast(`Removed ${item.name} from bag`, 'fa-trash');
    }
  }

  function clearCart() {
    if (state.cart.length === 0) return;
    state.cart = [];
    saveCart();
    renderCart();
    showToast('Your roastery bag is now empty', 'fa-rotate-left');
  }

  function calculateCartTotals() {
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);

    // Free shipping threshold: $45
    const freeShippingThreshold = 45.00;
    let shipping = 0;
    if (subtotal > 0) {
      if (state.shippingMethod === 'express') {
        shipping = 9.99;
      } else {
        shipping = subtotal >= freeShippingThreshold ? 0 : 4.99;
      }
    }

    // Discount
    let discount = 0;
    if (state.promo.applied && subtotal > 0) {
      discount = subtotal * state.promo.rate;
    }

    const total = Math.max(0, subtotal - discount + shipping);

    return {
      subtotal,
      totalItems,
      shipping,
      discount,
      total,
      remainingForFreeShipping: Math.max(0, freeShippingThreshold - subtotal)
    };
  }

  function renderCart() {
    const totals = calculateCartTotals();

    // Update Header Badges
    if (elements.cartBadge) {
      elements.cartBadge.textContent = totals.totalItems;
      elements.cartBadge.style.display = totals.totalItems > 0 ? 'inline-block' : 'none';
    }

    if (elements.drawerItemCount) {
      elements.drawerItemCount.textContent = `(${totals.totalItems} item${totals.totalItems === 1 ? '' : 's'})`;
    }

    // Free shipping progress bar
    if (elements.shippingProgressBar && elements.freeShippingText) {
      if (totals.subtotal >= 45) {
        elements.shippingProgressBar.style.width = '100%';
        elements.shippingProgressBar.style.background = '#22c55e';
        elements.freeShippingText.innerHTML = '<span class="text-emerald-400 font-bold"><i class="fa-solid fa-circle-check mr-1"></i> You unlocked Free Roaster Shipping!</span>';
      } else {
        const pct = Math.min(100, (totals.subtotal / 45) * 100);
        elements.shippingProgressBar.style.width = `${pct}%`;
        elements.shippingProgressBar.style.background = 'linear-gradient(90deg, var(--accent-rust), var(--accent-amber))';
        elements.freeShippingText.innerHTML = `Add <strong class="text-[var(--accent-amber)]">${formatMoney(totals.remainingForFreeShipping)}</strong> more for Free Shipping!`;
      }
    }

    // Render Items or Empty State
    if (!elements.drawerBody) return;

    if (state.cart.length === 0) {
      elements.drawerBody.innerHTML = `
        <div class="cart-empty-state">
          <i class="fa-solid fa-bag-shopping cart-empty-icon"></i>
          <h4 class="text-base font-bold text-[var(--text-main)] mb-1">Your Roastery Bag is Empty</h4>
          <p class="text-xs text-[var(--text-muted)] mb-5">Explore our single origin micro-lots and roasted-to-order blends to begin your brew.</p>
          <a href="#catalog" class="btn-primary text-xs" onclick="closeCart()">
            <i class="fa-solid fa-mug-hot"></i> Explore Coffees
          </a>
        </div>
      `;
    } else {
      elements.drawerBody.innerHTML = state.cart.map(item => `
        <div class="cart-item">
          <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop'">
          <div class="cart-item-details">
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-meta">${item.weight}g · ${item.grind.split(' ')[0]} · ${item.roast} Roast</div>
            <div class="cart-item-actions">
              <div class="qty-stepper">
                <button class="qty-btn" onclick="window.updateCartQty('${item.id}', -1)" aria-label="Decrease quantity">
                  <i class="fa-solid fa-minus text-[10px]"></i>
                </button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn" onclick="window.updateCartQty('${item.id}', 1)" aria-label="Increase quantity">
                  <i class="fa-solid fa-plus text-[10px]"></i>
                </button>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-sm font-bold text-[var(--accent-cream)] font-mono">${formatMoney(item.price * item.quantity)}</span>
                <button class="remove-item-btn" onclick="window.removeCartItem('${item.id}')" aria-label="Remove item">
                  <i class="fa-regular fa-trash-can"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }

    // Update Totals
    if (elements.cartSubtotal) elements.cartSubtotal.textContent = formatMoney(totals.subtotal);
    if (elements.cartShippingEst) {
      elements.cartShippingEst.textContent = totals.shipping === 0 ? 'FREE' : formatMoney(totals.shipping);
      if (totals.shipping === 0) elements.cartShippingEst.className = 'text-emerald-400 font-bold';
      else elements.cartShippingEst.className = 'text-[var(--text-main)]';
    }

    if (elements.discountRow && elements.cartDiscount) {
      if (state.promo.applied && totals.discount > 0) {
        elements.discountRow.style.display = 'flex';
        elements.cartDiscount.textContent = `-${formatMoney(totals.discount)}`;
      } else {
        elements.discountRow.style.display = 'none';
      }
    }

    if (elements.cartTotalPrice) elements.cartTotalPrice.textContent = formatMoney(totals.total);
    if (elements.checkoutBtn) {
      elements.checkoutBtn.disabled = state.cart.length === 0;
      elements.checkoutBtn.style.opacity = state.cart.length === 0 ? '0.5' : '1';
      elements.checkoutBtn.style.cursor = state.cart.length === 0 ? 'not-allowed' : 'pointer';
    }
  }

  // Cart Drawer open/close
  function openCart() {
    elements.cartOverlay?.classList.add('open');
    elements.cartDrawer?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    elements.cartOverlay?.classList.remove('open');
    elements.cartDrawer?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // 4. Checkout Modal Flow
  function openCheckout() {
    if (state.cart.length === 0) return;
    closeCart();

    const totals = calculateCartTotals();
    if (elements.checkoutItemCount) elements.checkoutItemCount.textContent = `${totals.totalItems} bag(s)`;
    if (elements.checkoutSubtotal) elements.checkoutSubtotal.textContent = formatMoney(totals.subtotal);
    if (elements.checkoutShipping) elements.checkoutShipping.textContent = totals.shipping === 0 ? 'FREE' : formatMoney(totals.shipping);
    if (elements.checkoutGrandTotal) elements.checkoutGrandTotal.textContent = formatMoney(totals.total);

    elements.checkoutModalBackdrop?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCheckout() {
    elements.checkoutModalBackdrop?.classList.remove('open');
    document.body.style.overflow = '';
  }

  function handleOrderSubmit(e) {
    e.preventDefault();

    const nameInput = document.getElementById('ship-name');
    const recipientName = nameInput ? nameInput.value : 'Coffee Connoisseur';
    const totals = calculateCartTotals();
    const orderId = '#RR-' + Math.floor(10000 + Math.random() * 90000);

    // Show simulated loading state
    if (elements.submitOrderBtn && elements.submitOrderText) {
      elements.submitOrderBtn.disabled = true;
      elements.submitOrderText.textContent = 'Processing Payment Token...';
    }

    setTimeout(() => {
      // Restore button
      if (elements.submitOrderBtn && elements.submitOrderText) {
        elements.submitOrderBtn.disabled = false;
        elements.submitOrderText.textContent = 'Authorize & Place Order';
      }

      // Close Checkout Modal
      closeCheckout();

      // Clear Cart
      state.cart = [];
      saveCart();
      renderCart();

      // Show Confirmation Modal
      if (elements.confirmOrderId) elements.confirmOrderId.textContent = orderId;
      if (elements.confirmRecipient) elements.confirmRecipient.textContent = recipientName;
      if (elements.confirmShippingMethod) elements.confirmShippingMethod.textContent = state.shippingMethod === 'express' ? 'Express Roaster Air (1-2 days)' : 'Standard Roaster Post (3-5 days)';
      if (elements.confirmTotalAmount) elements.confirmTotalAmount.textContent = formatMoney(totals.total);

      elements.confirmationModalBackdrop?.classList.add('open');
      document.body.style.overflow = 'hidden';
      showToast(`Order ${orderId} confirmed! Roast queued.`, 'fa-circle-check');
    }, 1200);
  }

  function closeConfirmation() {
    elements.confirmationModalBackdrop?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // 5. Customer Reviews System
  function renderReviewsHighlights() {
    if (!elements.reviewsHighlightGrid) return;

    elements.reviewsHighlightGrid.innerHTML = state.reviews.slice(0, 3).map(rev => `
      <div class="review-card">
        <div class="review-header">
          <div>
            <div class="reviewer-name">
              <span>${rev.author}</span>
              <span class="verified-badge"><i class="fa-solid fa-check mr-1"></i>${rev.badge || 'Verified Buyer'}</span>
            </div>
            <div class="text-[11px] text-[var(--accent-amber)] font-medium mt-0.5">
              <i class="fa-solid fa-mug-hot mr-1"></i>${rev.productName}
            </div>
          </div>
          <div class="stars-rating">
            ${Array.from({ length: rev.rating }).map(() => '<i class="fa-solid fa-star"></i>').join('')}
          </div>
        </div>
        <h4 class="text-sm font-bold text-[var(--text-main)] mb-1.5">${rev.title}</h4>
        <p class="text-xs text-[var(--text-muted)] leading-relaxed">${rev.comment}</p>
        <span class="text-[10px] text-[var(--text-dim)] block mt-3">${rev.date}</span>
      </div>
    `).join('');
  }

  function openReviewsModal(targetProductId = null) {
    if (!elements.reviewsModalBackdrop) return;

    // Populate coffee selector in the review form
    if (elements.reviewProductSelect) {
      elements.reviewProductSelect.innerHTML = state.products.map(p => `
        <option value="${p.id}" ${p.id === targetProductId ? 'selected' : ''}>${p.name} (${p.roast} Roast)</option>
      `).join('');
    }

    // Populate existing reviews in the modal list
    renderModalReviewsList(targetProductId);

    elements.reviewsModalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function renderModalReviewsList(targetProductId) {
    if (!elements.modalReviewsList) return;

    const relevant = targetProductId 
      ? state.reviews.filter(r => r.productId === targetProductId)
      : state.reviews;

    if (relevant.length === 0) {
      elements.modalReviewsList.innerHTML = `
        <p class="text-xs text-[var(--text-dim)] text-center py-4">No cupping notes yet for this coffee. Be the first to share your notes!</p>
      `;
      return;
    }

    elements.modalReviewsList.innerHTML = relevant.map(r => `
      <div class="p-3 bg-[rgba(255,255,255,0.03)] border border-[var(--border-color)] rounded-lg text-xs">
        <div class="flex justify-between items-center mb-1">
          <strong class="text-[var(--text-main)]">${r.author}</strong>
          <span class="text-[#f59e0b]">${'★'.repeat(r.rating)}</span>
        </div>
        <div class="font-semibold text-[var(--accent-amber)] text-[11px] mb-1">${r.title}</div>
        <p class="text-[var(--text-muted)]">${r.comment}</p>
      </div>
    `).join('');
  }

  function closeReviewsModal() {
    elements.reviewsModalBackdrop?.classList.remove('open');
    document.body.style.overflow = '';
  }

  function handleNewReviewSubmit(e) {
    e.preventDefault();
    const prodId = elements.reviewProductSelect.value;
    const prod = state.products.find(p => p.id === prodId);
    const author = document.getElementById('review-author').value.trim();
    const title = document.getElementById('review-title').value.trim();
    const comment = document.getElementById('review-comment').value.trim();
    const rating = parseInt(elements.starPicker.getAttribute('data-rating') || '5', 10);

    const newRev = {
      id: `rev-${Date.now()}`,
      productId: prodId,
      productName: prod ? prod.name : 'Single Origin',
      author: author || 'Specialty Sipper',
      badge: 'Verified Taster',
      rating: rating,
      title: title,
      comment: comment,
      date: 'Just now'
    };

    state.reviews.unshift(newRev);
    if (prod) {
      prod.reviewCount += 1;
    }

    saveReviews();
    renderReviewsHighlights();
    renderModalReviewsList(prodId);
    renderCatalog();

    elements.newReviewForm.reset();
    showToast('Your cupping review was published!', 'fa-star');
  }

  // 6. Global Window Bindings for Inline HTML Handlers
  window.updateCartQty = (id, delta) => updateQuantity(id, delta);
  window.removeCartItem = (id) => removeFromCart(id);
  window.openReviewsForProduct = (prodId) => openReviewsModal(prodId);
  window.filterCategory = (cat) => {
    state.filters.category = cat;
    document.querySelectorAll('.chip-btn').forEach(btn => {
      if (btn.getAttribute('data-category') === cat) btn.classList.add('active');
      else btn.classList.remove('active');
    });
    renderCatalog();
  };
  window.showToast = showToast;

  // 7. Event Listeners Wire-Up
  // Cart open/close triggers
  elements.cartToggleBtn?.addEventListener('click', openCart);
  elements.heroCartBtn?.addEventListener('click', openCart);
  elements.closeCartBtn?.addEventListener('click', closeCart);
  elements.cartOverlay?.addEventListener('click', closeCart);
  elements.clearCartBtn?.addEventListener('click', clearCart);

  // Category chip clicks
  elements.categoryChips?.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip-btn');
    if (!chip) return;
    document.querySelectorAll('.chip-btn').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    state.filters.category = chip.getAttribute('data-category') || 'all';
    renderCatalog();
  });

  // Search input
  elements.catalogSearch?.addEventListener('input', (e) => {
    state.filters.search = e.target.value;
    renderCatalog();
  });

  // Roast dropdown filter
  elements.filterRoast?.addEventListener('change', (e) => {
    state.filters.roast = e.target.value;
    renderCatalog();
  });

  // Sort dropdown filter
  elements.filterSort?.addEventListener('change', (e) => {
    state.filters.sort = e.target.value;
    renderCatalog();
  });

  // Reset filters
  elements.resetFiltersBtn?.addEventListener('click', () => {
    state.filters = { category: 'all', roast: 'all', search: '', sort: 'featured' };
    if (elements.catalogSearch) elements.catalogSearch.value = '';
    if (elements.filterRoast) elements.filterRoast.value = 'all';
    if (elements.filterSort) elements.filterSort.value = 'featured';
    document.querySelectorAll('.chip-btn').forEach(c => {
      if (c.getAttribute('data-category') === 'all') c.classList.add('active');
      else c.classList.remove('active');
    });
    renderCatalog();
  });

  // Promo code
  elements.applyPromoBtn?.addEventListener('click', () => {
    const code = elements.promoInput?.value.trim().toUpperCase();
    if (code === 'BEAN10') {
      state.promo.applied = true;
      state.promo.code = 'BEAN10';
      if (elements.promoNotice) {
        elements.promoNotice.textContent = '🎉 10% Bean Discount Applied!';
        elements.promoNotice.classList.remove('hidden');
      }
      renderCart();
      showToast('Promo BEAN10 applied: 10% off!', 'fa-tag');
    } else {
      showToast('Invalid promo code. Try BEAN10', 'fa-circle-exclamation');
    }
  });

  // Shipping selection in checkout
  document.querySelectorAll('input[name="shipping-speed"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      state.shippingMethod = e.target.value;
      const totals = calculateCartTotals();
      if (elements.checkoutShipping) elements.checkoutShipping.textContent = totals.shipping === 0 ? 'FREE' : formatMoney(totals.shipping);
      if (elements.checkoutGrandTotal) elements.checkoutGrandTotal.textContent = formatMoney(totals.total);
    });
  });

  // Checkout modal triggers
  elements.checkoutBtn?.addEventListener('click', openCheckout);
  elements.closeCheckoutBtn?.addEventListener('click', closeCheckout);
  elements.checkoutModalBackdrop?.addEventListener('click', (e) => {
    if (e.target === elements.checkoutModalBackdrop) closeCheckout();
  });
  elements.checkoutForm?.addEventListener('submit', handleOrderSubmit);

  // Confirmation modal triggers
  elements.closeConfirmationBtn?.addEventListener('click', closeConfirmation);
  elements.confirmationModalBackdrop?.addEventListener('click', (e) => {
    if (e.target === elements.confirmationModalBackdrop) closeConfirmation();
  });

  // Reviews modal triggers
  elements.writeReviewGeneralBtn?.addEventListener('click', () => openReviewsModal());
  elements.closeReviewsModalBtn?.addEventListener('click', closeReviewsModal);
  elements.reviewsModalBackdrop?.addEventListener('click', (e) => {
    if (e.target === elements.reviewsModalBackdrop) closeReviewsModal();
  });
  elements.newReviewForm?.addEventListener('submit', handleNewReviewSubmit);

  // Interactive 5-star rating picker
  if (elements.starPicker) {
    const stars = elements.starPicker.querySelectorAll('i');
    stars.forEach(star => {
      star.addEventListener('click', () => {
        const val = parseInt(star.getAttribute('data-value'), 10);
        elements.starPicker.setAttribute('data-rating', val);
        stars.forEach(s => {
          const sVal = parseInt(s.getAttribute('data-value'), 10);
          if (sVal <= val) s.classList.add('active');
          else s.classList.remove('active');
        });
      });
    });
  }

  // Keyboard navigation: Escape key closes active modals / drawers
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCart();
      closeCheckout();
      closeConfirmation();
      closeReviewsModal();
    }
  });

  // 8. Initial Renders
  renderCatalog();
  renderCart();
  renderReviewsHighlights();
});
