const fs = require('fs');

function makeSvgBase64(title, color1, color2, iconPath, label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240">
      <defs>
        <radialGradient id="bgGrad_${title}" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="${color1}" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#101416" stop-opacity="1"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bgGrad_${title})"/>
      <circle cx="200" cy="110" r="64" fill="#181E22" stroke="${color1}" stroke-width="3"/>
      <circle cx="200" cy="110" r="48" fill="#2A1A0E"/>
      ${iconPath}
      <rect x="90" y="188" width="220" height="26" rx="13" fill="#121619" stroke="${color2}" stroke-width="1.5"/>
      <text x="200" y="206" font-family="sans-serif" font-size="11" font-weight="700" fill="${color2}" text-anchor="middle" letter-spacing="1">${label}</text>
    </svg>`;
  return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
}

const icons = {
  rasengan: `<circle cx="200" cy="110" r="30" fill="none" stroke="#00E5FF" stroke-width="3" stroke-dasharray="4,4"/><circle cx="200" cy="110" r="16" fill="#00E5FF" opacity="0.7"/><circle cx="200" cy="110" r="6" fill="#fff"/>`,
  amaterasu: `<path d="M185 125 Q200 80 215 125 Q200 135 185 125 Z" fill="#E74C3C"/><path d="M192 120 Q200 95 208 120 Z" fill="#FF6B00"/>`,
  matcha: `<circle cx="200" cy="110" r="38" fill="#27AE60"/><path d="M180 110 Q200 90 220 110" stroke="#A9DFBF" stroke-width="4" fill="none"/>`,
  hokage: `<polygon points="200,80 207,98 226,98 211,109 217,127 200,116 183,127 189,109 174,98 193,98" fill="#F59E0B"/>`,
  chidori: `<path d="M195 78 L208 102 L198 106 L210 138 L188 112 L198 108 Z" fill="#00E5FF"/>`,
  peach: `<circle cx="192" cy="112" r="20" fill="#FADBD8"/><circle cx="208" cy="112" r="20" fill="#FADBD8"/><circle cx="200" cy="118" r="16" fill="#F1948A"/>`,
  lavender: `<ellipse cx="200" cy="110" rx="28" ry="36" fill="#BB8FCE"/><circle cx="200" cy="110" r="18" fill="#F5EEF8"/>`,
  dango: `<circle cx="176" cy="110" r="14" fill="#E74C3C"/><circle cx="200" cy="110" r="14" fill="#FDFEFE"/><circle cx="224" cy="110" r="14" fill="#27AE60"/><line x1="155" y1="110" x2="245" y2="110" stroke="#F5B041" stroke-width="4"/>`
};

const items = [
  {
    id: 'shinobi-1',
    title: 'Rasengan Azure Nitro Cold Brew',
    category: 'rasengan-brew',
    price: 6.80,
    ryo: 540,
    rating: 4.9,
    chakra: 'Wind Release',
    image: makeSvgBase64('rasengan', '#00E5FF', '#00E5FF', icons.rasengan, 'WIND RELEASE • NITRO'),
    synopsis: '18-hour slow-extracted Ethiopian Yirgacheffe infused with nitrogen micro-bubbles and natural blue spirulina.',
    genres: [{ name: 'Nitro Cold Brew' }, { name: 'Wind Release' }]
  },
  {
    id: 'shinobi-2',
    title: 'Uchiha Amaterasu Dark Roast',
    category: 'uchiha-dark',
    price: 5.50,
    ryo: 440,
    rating: 5.0,
    chakra: 'Fire Release',
    image: makeSvgBase64('amaterasu', '#FF6B00', '#E74C3C', icons.amaterasu, 'FIRE RELEASE • ROAST'),
    synopsis: 'Intense Sumatra Mandheling triple-roasted with smoked dark chocolate, ancho chili warmth, and molasses finish.',
    genres: [{ name: 'Single Origin' }, { name: 'Fire Release' }]
  },
  {
    id: 'shinobi-3',
    title: 'Sage Mode Ceremonial Uji Matcha',
    category: 'sage-matcha',
    price: 7.20,
    ryo: 580,
    rating: 4.9,
    chakra: 'Senjutsu',
    image: makeSvgBase64('matcha', '#2ECC71', '#2ECC71', icons.matcha, 'SENJUTSU • UJI MATCHA'),
    synopsis: 'First-harvest stone-ground ceremonial matcha from Kyoto, whisked with sweet oat milk and Himalayan salt.',
    genres: [{ name: 'Ceremonial Matcha' }, { name: 'Senjutsu' }]
  },
  {
    id: 'shinobi-4',
    title: 'Hokage Monument Cinnamon Latte',
    category: 'hokage-roast',
    price: 6.20,
    ryo: 500,
    rating: 4.8,
    chakra: 'Earth Release',
    image: makeSvgBase64('hokage', '#F59E0B', '#F59E0B', icons.hokage, 'LEAF GOLD • CINNAMON'),
    synopsis: 'Velvety espresso with Ceylon cinnamon bark, steamed Hokkaido jersey milk, and dusted with 24K leaf gold.',
    genres: [{ name: 'Artisan Latte' }, { name: 'Earth Release' }]
  },
  {
    id: 'shinobi-5',
    title: 'Chidori Electric Espresso Tonic',
    category: 'uchiha-dark',
    price: 5.90,
    ryo: 470,
    rating: 4.7,
    chakra: 'Lightning Release',
    image: makeSvgBase64('chidori', '#00E5FF', '#F1C40F', icons.chidori, 'LIGHTNING • TONIC'),
    synopsis: 'Sparkling artisanal tonic layered over double shot washed Colombian espresso with candied yuzu peel.',
    genres: [{ name: 'Espresso Tonic' }, { name: 'Lightning' }]
  },
  {
    id: 'shinobi-6',
    title: 'Byakugan White Peach Blossom Tea',
    category: 'sage-matcha',
    price: 5.00,
    ryo: 400,
    rating: 4.9,
    chakra: 'Pure Chakra',
    image: makeSvgBase64('peach', '#E84393', '#FADBD8', icons.peach, 'GENTLE FIST • BLOSSOM'),
    synopsis: 'Delicate Fujian silver needle white tea scented with organic white peach and dried jasmine petals.',
    genres: [{ name: 'Rare Blossom' }, { name: 'Gentle Fist' }]
  },
  {
    id: 'shinobi-7',
    title: 'Hinata Lavender Honey Drip',
    category: 'rasengan-brew',
    price: 6.50,
    ryo: 520,
    rating: 5.0,
    chakra: 'Water Release',
    image: makeSvgBase64('lavender', '#9B59B6', '#BB8FCE', icons.lavender, 'WATER RELEASE • HONEY'),
    synopsis: 'Gentle hand-dripped Gesha coffee with wild Konoha lavender reduction and mountain clover raw honey.',
    genres: [{ name: 'Pourover' }, { name: 'Water Release' }]
  },
  {
    id: 'shinobi-8',
    title: 'Teuchi Mitarashi Dango Trio',
    category: 'shinobi-pastry',
    price: 4.50,
    ryo: 360,
    rating: 4.9,
    chakra: 'Village Favorite',
    image: makeSvgBase64('dango', '#E67E22', '#2ECC71', icons.dango, 'RAMEN SHOP • DANGO'),
    synopsis: 'Three skewers of chewy grilled rice flour dumplings glazed with sweet soy sauce glaze and toasted sesame.',
    genres: [{ name: 'Authentic Pastry' }, { name: 'Ramen Companion' }]
  }
];

const template = `/**
 * ICHIRAKU ROASTERY & TEA HAVEN (一楽 焙煎所)
 * Master Client-Side Engine: Dynamic Catalog, Jutsu Lab, Cart & Modals
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. LOCAL SEED SPECIALTY MENU DATA (Zero-blank UI guarantee with Base64 vectors)
    const localSeedCoffee = ${JSON.stringify(items, null, 4)};

    // 2. STATE MANAGEMENT
    const state = {
        items: [...localSeedCoffee],
        filteredItems: [...localSeedCoffee],
        cart: [],
        wishlist: [],
        searchQuery: '',
        activeCategory: 'all',
        sortBy: 'recommended',
        audioEnabled: true,
        audioCtx: null
    };

    // 3. CORE DOM SELECTORS
    const catalogGrid = document.getElementById('menu-grid') || document.getElementById('catalog-grid');
    const searchInput = document.getElementById('menu-search-input') || document.getElementById('search-input');
    const searchClearBtn = document.getElementById('menu-search-clear');
    const categoryTabs = document.querySelectorAll('.filter-pill, .category-tab, [data-category]');
    const sortSelect = document.getElementById('menu-sort-select') || document.getElementById('sort-select');
    const itemsCountEl = document.getElementById('menu-items-count');
    const emptyStateEl = document.getElementById('menu-empty-state');
    const resetFiltersBtn = document.getElementById('btn-reset-filters');
    
    // Cart & Drawers
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartToggleBtn = document.getElementById('cart-btn') || document.getElementById('cart-toggle-btn');
    const closeCartBtn = document.getElementById('cart-close-btn') || document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items-container') || document.getElementById('cart-items');
    const cartCountBadge = document.getElementById('cart-count');
    const cartTotalBadge = document.getElementById('cart-total-badge');
    const cartSubtotalRyo = document.getElementById('cart-subtotal-ryo');
    const cartChakraTax = document.getElementById('cart-chakra-tax');
    const cartFinalTotalRyo = document.getElementById('cart-final-total-ryo');
    const cartFinalTotalUsd = document.getElementById('cart-final-total-usd');
    const cartCheckoutBtn = document.getElementById('cart-checkout-btn') || document.getElementById('checkout-btn');
    const cartClearBtn = document.getElementById('cart-clear-btn');
    const cartEmptyMsg = document.getElementById('cart-empty-msg');
    
    // Modals
    const quickViewModal = document.getElementById('quick-view-modal');
    const quickViewCloseBtn = document.getElementById('quick-view-close-btn');
    const wishlistModal = document.getElementById('wishlist-modal');
    const wishlistCloseBtn = document.getElementById('wishlist-close-btn');
    const wishlistBtn = document.getElementById('wishlist-btn');
    const wishlistItemsContainer = document.getElementById('wishlist-items-container');
    const wishlistCountBadge = document.getElementById('wishlist-count');
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutCloseBtn = document.getElementById('checkout-close-btn');
    const checkoutForm = document.getElementById('checkout-form');

    // Web Audio Sound Engine
    function playChakraSound(type = 'chime') {
        if (!state.audioEnabled) return;
        try {
            if (!state.audioCtx) {
                state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            const ctx = state.audioCtx;
            if (ctx.state === 'suspended') {
                ctx.resume();
            }
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            if (type === 'chime') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(587.33, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
                gain.gain.setValueAtTime(0.12, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
                osc.start();
                osc.stop(ctx.currentTime + 0.35);
            } else if (type === 'jutsu') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(440, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.25);
                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
                osc.start();
                osc.stop(ctx.currentTime + 0.4);
            }
        } catch { /* Audio not supported */ }
    }

    // 4. RENDERING FUNCTIONS
    function renderCatalog() {
        if (!catalogGrid) return;

        if (itemsCountEl) {
            itemsCountEl.textContent = \`Showing \${state.filteredItems.length} shinobi creations\`;
        }

        if (state.filteredItems.length === 0) {
            catalogGrid.innerHTML = '';
            if (emptyStateEl) emptyStateEl.style.display = 'block';
            return;
        }

        if (emptyStateEl) emptyStateEl.style.display = 'none';

        catalogGrid.innerHTML = state.filteredItems.map(item => {
            const isWishlisted = state.wishlist.some(w => w.id === item.id);
            const priceUsd = \`$\${item.price.toFixed(2)}\`;
            const priceRyo = \`\${item.ryo || Math.round(item.price * 80)} Ryo\`;
            const genresHtml = item.genres ? item.genres.map(g => \`<span class="badge-genre">\${g.name}</span>\`).join('') : '';

            return \`
                <div class="anime-card" data-id="\${item.id}">
                    <div class="card-image-wrapper">
                        <img src="\${item.image}" alt="\${item.title}" loading="lazy">
                        <div class="card-badges">
                            <span class="rating-badge"><i class="fa-solid fa-star"></i> \${item.rating}</span>
                            <span class="episodes-badge"><i class="fa-solid fa-bolt"></i> \${item.chakra || 'Konoha'}</span>
                        </div>
                        <button class="wishlist-btn \${isWishlisted ? 'active' : ''}" data-id="\${item.id}" title="Save to Favorites">
                            <i class="\${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                        </button>
                    </div>
                    <div class="card-content">
                        <div class="genres-row">\${genresHtml}</div>
                        <h3 class="card-title">\${item.title}</h3>
                        <p class="card-synopsis">\${item.synopsis}</p>
                        <div class="card-footer">
                            <div>
                                <span class="card-price">\${priceRyo}</span>
                                <span style="font-size: 0.8rem; color: #94A3B8; margin-left: 4px;">(\${priceUsd})</span>
                            </div>
                            <div class="card-actions">
                                <button class="btn-icon view-details-btn" data-id="\${item.id}" title="Quick Scroll View"><i class="fa-solid fa-eye"></i></button>
                                <button class="btn btn-primary btn-sm add-to-cart-btn" data-id="\${item.id}"><i class="fa-solid fa-cart-plus"></i> Order</button>
                            </div>
                        </div>
                    </div>
                </div>
            \`;
        }).join('');

        attachCardListeners();
    }

    function attachCardListeners() {
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                addToCart(id);
            });
        });

        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                toggleWishlist(id);
            });
        });

        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                openQuickView(id);
            });
        });
    }

    // 5. FILTER & SEARCH
    function applyFiltersAndSort() {
        let result = [...state.items];

        if (state.searchQuery.trim() !== '') {
            const q = state.searchQuery.toLowerCase();
            result = result.filter(item =>
                item.title.toLowerCase().includes(q) ||
                (item.synopsis && item.synopsis.toLowerCase().includes(q)) ||
                (item.chakra && item.chakra.toLowerCase().includes(q))
            );
        }

        if (state.activeCategory !== 'all') {
            result = result.filter(item => item.category === state.activeCategory);
        }

        if (state.sortBy === 'price-asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (state.sortBy === 'price-desc') {
            result.sort((a, b) => b.price - a.price);
        } else if (state.sortBy === 'rating-desc') {
            result.sort((a, b) => b.rating - a.rating);
        }

        state.filteredItems = result;
        renderCatalog();
    }

    // 6. CART MANAGEMENT
    function addToCart(id, customItem = null) {
        let item = customItem;
        if (!item) {
            item = state.items.find(i => i.id === id);
        }
        if (!item) return;

        const existing = state.cart.find(c => c.id === item.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            state.cart.push({ ...item, quantity: 1, ryo: item.ryo || Math.round(item.price * 80) });
        }

        playChakraSound('jutsu');
        updateCartUI();
        showToast(\`Sealed "\${item.title}" into your order! 🍜\`, 'success');
    }

    function removeFromCart(id) {
        state.cart = state.cart.filter(c => c.id !== id);
        updateCartUI();
        showToast('Scroll removed from cart.', 'info');
    }

    function updateCartQuantity(id, delta) {
        const item = state.cart.find(c => c.id === id);
        if (!item) return;
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCartUI();
        }
    }

    function updateCartUI() {
        const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
        const subtotalRyo = state.cart.reduce((sum, item) => sum + (item.ryo * item.quantity), 0);
        const taxRyo = Math.round(subtotalRyo * 0.05);
        const finalRyo = subtotalRyo + taxRyo;
        const finalUsd = (finalRyo / 80).toFixed(2);

        if (cartCountBadge) {
            cartCountBadge.textContent = totalCount;
            cartCountBadge.style.display = totalCount > 0 ? 'flex' : 'none';
        }
        if (cartTotalBadge) {
            cartTotalBadge.textContent = \`\${subtotalRyo} Ryo\`;
        }
        if (cartSubtotalRyo) cartSubtotalRyo.textContent = \`\${subtotalRyo} Ryo\`;
        if (cartChakraTax) cartChakraTax.textContent = \`\${taxRyo} Ryo\`;
        if (cartFinalTotalRyo) cartFinalTotalRyo.textContent = \`\${finalRyo} Ryo\`;
        if (cartFinalTotalUsd) cartFinalTotalUsd.textContent = \`($\${finalUsd} USD)\`;

        if (cartItemsContainer) {
            if (state.cart.length === 0) {
                cartItemsContainer.innerHTML = '';
                if (cartEmptyMsg) cartEmptyMsg.style.display = 'block';
            } else {
                if (cartEmptyMsg) cartEmptyMsg.style.display = 'none';
                cartItemsContainer.innerHTML = state.cart.map(item => \`
                    <div style="display: flex; gap: 14px; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08);">
                        <img src="\${item.image}" alt="\${item.title}" style="width: 54px; height: 54px; object-fit: cover; border-radius: 8px;">
                        <div style="flex: 1;">
                            <h4 style="font-size: 0.9rem; font-weight: 600; color: #fff;">\${item.title}</h4>
                            <div style="color: #FF6B00; font-weight: 700; font-size: 0.85rem;">\${item.ryo * item.quantity} Ryo</div>
                            <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                                <button class="qty-btn" data-action="decrease" data-id="\${item.id}" style="width: 22px; height: 22px; background: #222A30; color: #fff; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1);">-</button>
                                <span style="font-size: 0.85rem; font-weight: 700; color: #fff;">\${item.quantity}</span>
                                <button class="qty-btn" data-action="increase" data-id="\${item.id}" style="width: 22px; height: 22px; background: #222A30; color: #fff; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1);">+</button>
                            </div>
                        </div>
                        <button class="remove-cart-btn" data-id="\${item.id}" style="background: none; color: #94A3B8; font-size: 1rem;" title="Remove"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                \`).join('');

                cartItemsContainer.querySelectorAll('.qty-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = btn.getAttribute('data-id');
                        const action = btn.getAttribute('data-action');
                        updateCartQuantity(id, action === 'increase' ? 1 : -1);
                    });
                });

                cartItemsContainer.querySelectorAll('.remove-cart-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = btn.getAttribute('data-id');
                        removeFromCart(id);
                    });
                });
            }
        }
    }

    function toggleWishlist(id) {
        const item = state.items.find(i => i.id === id);
        if (!item) return;

        const idx = state.wishlist.findIndex(w => w.id === id);
        if (idx > -1) {
            state.wishlist.splice(idx, 1);
            showToast(\`Removed "\${item.title}" from favorites.\`, 'info');
        } else {
            state.wishlist.push(item);
            showToast(\`Added "\${item.title}" to favorite scrolls! ❤️\`, 'success');
        }

        if (wishlistCountBadge) {
            wishlistCountBadge.textContent = state.wishlist.length;
        }

        renderCatalog();
        updateWishlistModalUI();
    }

    function updateWishlistModalUI() {
        if (!wishlistItemsContainer) return;
        if (state.wishlist.length === 0) {
            wishlistItemsContainer.innerHTML = '<p style="text-align: center; color: #94A3B8; padding: 20px;">No favorite shinobi brews saved yet.</p>';
            return;
        }
        wishlistItemsContainer.innerHTML = state.wishlist.map(item => \`
            <div style="display: flex; gap: 14px; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08);">
                <img src="\${item.image}" alt="\${item.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
                <div style="flex: 1;">
                    <h4 style="font-size: 0.9rem; color: #fff;">\${item.title}</h4>
                    <span style="color: #FF6B00; font-weight: 700; font-size: 0.85rem;">\${item.ryo || 450} Ryo</span>
                </div>
                <button class="btn btn-primary btn-sm" onclick="document.dispatchEvent(new CustomEvent('add-wishlist-cart', { detail: '\${item.id}' }))">Order</button>
            </div>
        \`).join('');
    }

    document.addEventListener('add-wishlist-cart', (e) => {
        addToCart(e.detail);
        if (wishlistModal) wishlistModal.classList.add('hidden');
    });

    // 7. QUICK VIEW MODAL
    function openQuickView(id) {
        const item = state.items.find(i => i.id === id);
        if (!item || !quickViewModal) return;

        const imgEl = document.getElementById('quick-view-image');
        const titleEl = document.getElementById('quick-view-title');
        const descEl = document.getElementById('quick-view-desc');
        const ryoEl = document.getElementById('quick-view-price-ryo');
        const usdEl = document.getElementById('quick-view-price-usd');
        const addBtn = document.getElementById('quick-view-add-btn');

        if (imgEl) imgEl.src = item.image;
        if (titleEl) titleEl.textContent = item.title;
        if (descEl) descEl.textContent = item.synopsis;
        if (ryoEl) ryoEl.textContent = \`\${item.ryo || Math.round(item.price * 80)} Ryo\`;
        if (usdEl) usdEl.textContent = \`($\${item.price.toFixed(2)} USD)\`;

        if (addBtn) {
            addBtn.onclick = () => {
                addToCart(item.id);
                quickViewModal.classList.add('hidden');
            };
        }

        quickViewModal.classList.remove('hidden');
    }

    // 8. TOAST NOTIFICATIONS
    function showToast(message, type = 'success') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.style.cssText = \`
            background: #1A2024;
            color: #fff;
            border-left: 4px solid \${type === 'success' ? '#FF6B00' : '#00E5FF'};
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.5);
            font-weight: 600;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 10px;
        \`;
        toast.innerHTML = \`<i class="fa-solid fa-scroll" style="color: #FF6B00;"></i> \${message}\`;
        container.appendChild(toast);

        setTimeout(() => toast.remove(), 3200);
    }

    // 9. REVIEWS POPULATION
    function populateReviews() {
        const carousel = document.getElementById('reviews-carousel');
        if (!carousel) return;
        const reviews = [
            {
                name: 'Kakashi Hatake (Sixth Hokage)',
                rank: 'Elite Jonin',
                rating: 5,
                comment: 'The Uchiha Dark Roast gives me the razor-sharp focus needed when reading Make-Out Paradise while training Team 7.',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
            },
            {
                name: 'Hinata Hyuga (Uzumaki)',
                rank: 'Chunin Master',
                rating: 5,
                comment: 'I love ordering the Lavender Honey Drip for Naruto-kun after long Hokage council meetings. It warms the heart.',
                avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
            },
            {
                name: 'Naruto Uzumaki (Seventh Hokage)',
                rank: 'Hokage',
                rating: 5,
                comment: 'Dattebayo! Pair the Rasengan Azure Cold Brew with Teuchi\\'s Mitarashi Dango and you\\'re ready to take on the Otsutsuki!',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
            }
        ];

        carousel.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;';
        carousel.innerHTML = reviews.map(r => \`
            <div style="background: #1A2024; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 24px;">
                <div style="display: flex; gap: 14px; align-items: center; margin-bottom: 14px;">
                    <img src="\${r.avatar}" alt="\${r.name}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid #FF6B00;">
                    <div>
                        <h4 style="color: #fff; font-size: 0.95rem; font-weight: 700;">\${r.name}</h4>
                        <span style="color: #F59E0B; font-size: 0.8rem;">\${r.rank}</span>
                    </div>
                </div>
                <p style="color: #94A3B8; font-size: 0.9rem; line-height: 1.5; font-style: italic;">"\${r.comment}"</p>
                <div style="color: #F59E0B; font-size: 0.85rem; margin-top: 12px;"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
            </div>
        \`).join('');
    }

    // 10. JUTSU BREW LAB CALCULATOR
    function setupJutsuLab() {
        const baseInputs = document.querySelectorAll('input[name="brew-base"]');
        const milkInputs = document.querySelectorAll('input[name="brew-milk"]');
        const infusionInputs = document.querySelectorAll('.infusion-checkbox');
        const toppingSelect = document.getElementById('brew-topping-select');
        const calculatedPriceEl = document.getElementById('brew-calculated-price');
        const calculatedUsdEl = document.getElementById('brew-calculated-usd');
        const addLabBtn = document.getElementById('brew-add-to-cart-btn');

        function recalcLab() {
            let totalRyo = 0;
            let title = 'Custom Shinobi Jutsu';

            baseInputs.forEach(input => {
                if (input.checked) {
                    totalRyo += parseInt(input.getAttribute('data-price') || 380, 10);
                    title = input.getAttribute('data-name') || title;
                }
            });

            milkInputs.forEach(input => {
                if (input.checked) {
                    totalRyo += parseInt(input.getAttribute('data-price') || 0, 10);
                }
            });

            infusionInputs.forEach(input => {
                if (input.checked) {
                    totalRyo += parseInt(input.getAttribute('data-price') || 0, 10);
                }
            });

            if (toppingSelect) {
                const opt = toppingSelect.options[toppingSelect.selectedIndex];
                if (opt) totalRyo += parseInt(opt.getAttribute('data-price') || 0, 10);
            }

            if (calculatedPriceEl) calculatedPriceEl.textContent = \`\${totalRyo} Ryo\`;
            if (calculatedUsdEl) calculatedUsdEl.textContent = \`($\${(totalRyo / 80).toFixed(2)} USD)\`;

            return { totalRyo, title };
        }

        baseInputs.forEach(i => i.addEventListener('change', recalcLab));
        milkInputs.forEach(i => i.addEventListener('change', recalcLab));
        infusionInputs.forEach(i => i.addEventListener('change', recalcLab));
        if (toppingSelect) toppingSelect.addEventListener('change', recalcLab);

        if (addLabBtn) {
            addLabBtn.addEventListener('click', () => {
                const { totalRyo, title } = recalcLab();
                addToCart('custom-jutsu-' + Date.now(), {
                    id: 'custom-jutsu-' + Date.now(),
                    title: \`Lab Formulation: \${title}\`,
                    price: totalRyo / 80,
                    ryo: totalRyo,
                    image: makeSvgBase64('custom', '#FF6B00', '#00E5FF', icons.rasengan, 'CUSTOM JUTSU')
                });
            });
        }
    }

    // 11. EVENT LISTENERS
    function setupEventListeners() {
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                state.searchQuery = e.target.value;
                applyFiltersAndSort();
            });
        }

        if (searchClearBtn) {
            searchClearBtn.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                state.searchQuery = '';
                applyFiltersAndSort();
            });
        }

        categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                categoryTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                state.activeCategory = tab.getAttribute('data-category') || 'all';
                applyFiltersAndSort();
            });
        });

        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                state.sortBy = e.target.value;
                applyFiltersAndSort();
            });
        }

        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                state.searchQuery = '';
                state.activeCategory = 'all';
                categoryTabs.forEach(t => t.classList.remove('active'));
                const allTab = document.querySelector('[data-category="all"]');
                if (allTab) allTab.classList.add('active');
                applyFiltersAndSort();
            });
        }

        if (cartToggleBtn && cartDrawer) {
            cartToggleBtn.addEventListener('click', () => {
                cartDrawer.classList.add('open');
                if (cartOverlay) cartOverlay.classList.add('active');
            });
        }

        if (closeCartBtn && cartDrawer) {
            closeCartBtn.addEventListener('click', () => {
                cartDrawer.classList.remove('open');
                if (cartOverlay) cartOverlay.classList.remove('active');
            });
        }

        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => {
                if (cartDrawer) cartDrawer.classList.remove('open');
                cartOverlay.classList.remove('active');
            });
        }

        if (cartClearBtn) {
            cartClearBtn.addEventListener('click', () => {
                state.cart = [];
                updateCartUI();
                showToast('Order cleared.', 'info');
            });
        }

        if (cartCheckoutBtn) {
            cartCheckoutBtn.addEventListener('click', () => {
                if (state.cart.length === 0) {
                    showToast('Order is empty! Add brews first.', 'error');
                    return;
                }
                if (cartDrawer) cartDrawer.classList.remove('open');
                if (cartOverlay) cartOverlay.classList.remove('active');
                if (checkoutModal) checkoutModal.classList.remove('hidden');
            });
        }

        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                showToast('Dattebayo! Summoning Hawk dispatched to your sector! 🦅📦', 'success');
                state.cart = [];
                updateCartUI();
                if (checkoutModal) checkoutModal.classList.add('hidden');
            });
        }

        if (quickViewCloseBtn && quickViewModal) {
            quickViewCloseBtn.addEventListener('click', () => quickViewModal.classList.add('hidden'));
        }
        if (wishlistBtn && wishlistModal) {
            wishlistBtn.addEventListener('click', () => {
                updateWishlistModalUI();
                wishlistModal.classList.remove('hidden');
            });
        }
        if (wishlistCloseBtn && wishlistModal) {
            wishlistCloseBtn.addEventListener('click', () => wishlistModal.classList.add('hidden'));
        }
        if (checkoutCloseBtn && checkoutModal) {
            checkoutCloseBtn.addEventListener('click', () => checkoutModal.classList.add('hidden'));
        }

        const gaugeBtn = document.getElementById('chakra-gauge-btn');
        const gaugeFill = document.getElementById('chakra-gauge-fill');
        const gaugeLabel = document.getElementById('chakra-gauge-value');
        if (gaugeBtn && gaugeFill) {
            gaugeBtn.addEventListener('click', () => {
                playChakraSound('jutsu');
                gaugeFill.style.width = '100%';
                if (gaugeLabel) gaugeLabel.textContent = 'Chakra Level: 100% - Maximum Sage Aroma Infused! (Bergamot & Volcanic Cocoa)';
                showToast('Charged maximum Sage Chakra into the espresso roasters! 🔥', 'success');
            });
        }

        const audioBtn = document.getElementById('chakra-audio-toggle');
        const audioLabel = document.getElementById('audio-status-label');
        if (audioBtn) {
            audioBtn.addEventListener('click', () => {
                state.audioEnabled = !state.audioEnabled;
                if (audioLabel) audioLabel.textContent = state.audioEnabled ? 'Sound: ON' : 'Sound: OFF';
                showToast(\`Shinobi Audio Effects: \${state.audioEnabled ? 'Enabled 🔊' : 'Muted 🔇'}\`, 'info');
            });
        }

        const couponPill = document.getElementById('coupon-promo-pill');
        if (couponPill) {
            couponPill.addEventListener('click', () => {
                navigator.clipboard?.writeText('DATTEBAYO');
                showToast('Copied coupon "DATTEBAYO" for 20% Off! 🍜', 'success');
            });
        }

        const heroCtaMenu = document.getElementById('hero-cta-menu');
        if (heroCtaMenu) {
            heroCtaMenu.addEventListener('click', () => {
                document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
            });
        }
        const heroCtaCustom = document.getElementById('hero-cta-custom');
        if (heroCtaCustom) {
            heroCtaCustom.addEventListener('click', () => {
                document.getElementById('brew-lab-section')?.scrollIntoView({ behavior: 'smooth' });
            });
        }
    }

    // 12. BOOTSTRAP
    renderCatalog();
    populateReviews();
    setupJutsuLab();
    setupEventListeners();
    updateCartUI();
});
`;

fs.writeFileSync('workspace/coffe-with-hinata/app.js', template);
console.log('Completely regenerated app.js with clean Base64 vectors!');
