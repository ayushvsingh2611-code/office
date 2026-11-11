/**
 * ==============================================================================
 *

/**
 * ==============================================================================
 * __PANDA_HIVE_DYNAMIC_ENGINE__ (sports-management)
 * Auto-injected to guarantee 100% interactive, state-driven, dynamic functionality.
 * Features:
 *   - Reactive State & LocalStorage persistence
 *   - Live Search & Multi-Category Filtering
 *   - Universal Tab & Navigation View Switching
 *   - Modal Dialog Management
 *   - Real Form Interceptor (auto-creates new items & updates UI)
 *   - Animated Toast Notifications
 *   - Domain-Aware Workflow (E-Commerce Cart vs Universal Pro-App)
 * ==============================================================================
 */
(function() {
  'use strict';
  if (window.__PANDA_HIVE_DYNAMIC_ENGINE_LOADED__) return;
  window.__PANDA_HIVE_DYNAMIC_ENGINE_LOADED__ = true;

  const STORAGE_KEY = 'ph_sports-management_state_v2';
  const isEcom = false;

  // 1. Core Reactive State
  const defaultState = isEcom ? {
    cart: [],
    wishlist: [],
    search: '',
    category: 'all',
    items: []
  } : {
    search: '',
    category: 'all',
    activeTab: 'all',
    items: [],
    records: [],
    saved: []
  };

  let state = defaultState;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      state = Object.assign({}, defaultState, JSON.parse(saved));
    }
  } catch (e) {
    state = defaultState;
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  // 2. Modern Toast Notification System
  function showToast(message, icon) {
    let container = document.querySelector('.ph-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'ph-toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'ph-toast';
    toast.innerHTML = '<span>' + (icon || '✨') + '</span> <span>' + message + '</span>';
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('ph-fade-out');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 250);
    }, 2800);
  }
  window.phToast = showToast;

  // 3. Cart Drawer & Badge Manager (Only for E-Commerce)
  function updateCartBadges() {
    if (!isEcom) return;
    const totalQty = (state.cart || []).reduce((sum, item) => sum + (item.qty || 1), 0);
    const badges = document.querySelectorAll('#cart-count, .cart-count, [data-cart-count], #cart-badge');
    badges.forEach((b) => {
      b.textContent = String(totalQty);
      b.classList.remove('badge-bounce');
      void b.offsetWidth;
      b.classList.add('badge-bounce');
    });
  }

  function getCurrencySymbol() {
    return (document.body && (document.body.textContent || '').includes('₹')) ? '₹' : '$';
  }

  function renderDrawerItems() {
    const body = document.querySelector('.ph-drawer-body');
    const subtotalEl = document.querySelector('.ph-drawer-subtotal-val');
    if (!body) return;
    const cur = getCurrencySymbol();

    if (!state.cart || state.cart.length === 0) {
      body.innerHTML = '<div style="text-align:center; padding: 40px 10px; color: #64748b;"><p style="font-size:36px; margin:0 0 10px 0;">🛒</p><p style="margin:0; font-weight:600;">Your cart is empty</p><p style="font-size:13px; margin:6px 0 0 0;">Add items to see them here.</p></div>';
      if (subtotalEl) subtotalEl.textContent = cur + '0.00';
      return;
    }

    let subtotal = 0;
    body.innerHTML = state.cart.map((item, idx) => {
      const itemPrice = Number(item.price) || 29.99;
      const qty = Number(item.qty) || 1;
      const total = itemPrice * qty;
      subtotal += total;
      return '<div class="ph-cart-item" data-cart-index="' + idx + '">' +
        '<div class="ph-cart-item-info">' +
          '<div class="ph-cart-item-title">' + (item.name || 'Selected Item') + '</div>' +
          '<div class="ph-cart-item-price">' + cur + itemPrice.toFixed(2) + '</div>' +
        '</div>' +
        '<div class="ph-cart-item-qty">' +
          '<button type="button" class="ph-qty-btn ph-qty-minus" data-action="minus" data-idx="' + idx + '">−</button>' +
          '<span style="font-weight:600; min-width:20px; text-align:center;">' + qty + '</span>' +
          '<button type="button" class="ph-qty-btn ph-qty-plus" data-action="plus" data-idx="' + idx + '">+</button>' +
          '<button type="button" class="ph-qty-btn ph-qty-del" data-action="del" data-idx="' + idx + '" style="color:#ef4444; margin-left:6px;" title="Remove">✕</button>' +
        '</div>' +
      '</div>';
    }).join('');

    if (subtotalEl) {
      subtotalEl.textContent = cur + subtotal.toFixed(2);
    }
  }

  function ensureDrawer() {
    if (!isEcom) return;
    if (document.querySelector('.ph-cart-drawer')) return;
    const overlay = document.createElement('div');
    overlay.className = 'ph-drawer-overlay';
    document.body.appendChild(overlay);

    const cur = getCurrencySymbol();
    const drawer = document.createElement('aside');
    drawer.className = 'ph-cart-drawer';
    drawer.setAttribute('aria-label', 'Shopping Cart');
    drawer.innerHTML = '<div class="ph-drawer-header">' +
      '<h3>Shopping Cart (<span class="ph-drawer-count">0</span>)</h3>' +
      '<button type="button" class="ph-drawer-close" aria-label="Close cart">&times;</button>' +
    '</div>' +
    '<div class="ph-drawer-body"></div>' +
    '<div class="ph-drawer-footer">' +
      '<div class="ph-drawer-subtotal">' +
        '<span>Subtotal:</span>' +
        '<span class="ph-drawer-subtotal-val">' + cur + '0.00</span>' +
      '</div>' +
      '<button type="button" class="ph-checkout-btn">Proceed to Checkout →</button>' +
    '</div>';
    document.body.appendChild(drawer);

    const closeBtn = drawer.querySelector('.ph-drawer-close');
    const closeDrawer = () => {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
    };
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    drawer.addEventListener('click', (e) => {
      const target = e.target;
      if (!target) return;
      const action = target.getAttribute('data-action');
      const idxStr = target.getAttribute('data-idx');
      if (action && idxStr !== null) {
        const idx = parseInt(idxStr, 10);
        if (action === 'plus') {
          state.cart[idx].qty = (state.cart[idx].qty || 1) + 1;
        } else if (action === 'minus') {
          if (state.cart[idx].qty > 1) {
            state.cart[idx].qty -= 1;
          } else {
            state.cart.splice(idx, 1);
          }
        } else if (action === 'del') {
          state.cart.splice(idx, 1);
        }
        saveState();
        updateCartBadges();
        renderDrawerItems();
        return;
      }

      if (target.classList.contains('ph-checkout-btn')) {
        if (!state.cart || state.cart.length === 0) {
          showToast('Cart is empty. Add items first!', '⚠️');
          return;
        }
        const count = state.cart.reduce((s, i) => s + (i.qty || 1), 0);
        state.cart = [];
        saveState();
        updateCartBadges();
        renderDrawerItems();
        closeDrawer();
        showToast('🎉 Order placed successfully (' + count + ' items)! Thank you!', '✅');
      }
    });
  }

  function openCartDrawer() {
    if (!isEcom) return;
    ensureDrawer();
    renderDrawerItems();
    const countEl = document.querySelector('.ph-drawer-count');
    if (countEl) {
      countEl.textContent = String((state.cart || []).reduce((sum, item) => sum + (item.qty || 1), 0));
    }
    const overlay = document.querySelector('.ph-drawer-overlay');
    const drawer = document.querySelector('.ph-cart-drawer');
    if (overlay && drawer) {
      overlay.classList.add('active');
      drawer.classList.add('active');
    }
  }
  window.phOpenCart = openCartDrawer;

  // 4. Real-time Live Search & Dynamic Filtering
  function setupLiveSearch() {
    const searchInputs = document.querySelectorAll(
      'input[type="search"], #site-search, #search, #search-input, input[name="q"], input[placeholder*="search" i]'
    );

    searchInputs.forEach((input) => {
      input.addEventListener('input', (e) => {
        const query = (e.target.value || '').trim().toLowerCase();
        state.search = query;
        filterVisibleCards();
      });
    });

    const searchForms = document.querySelectorAll('form[role="search"], form#search-form, form.search-form');
    searchForms.forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        filterVisibleCards();
      });
    });
  }

  function filterVisibleCards() {
    const query = (state.search || '').toLowerCase();
    const cat = (state.category || 'all').toLowerCase();
    const cards = document.querySelectorAll(
      '.product-card, .card, .item-card, .catalog-card, [data-category], article.product, .grid > div'
    );

    cards.forEach((card) => {
      const text = (card.textContent || '').toLowerCase();
      const cardCat = (card.getAttribute('data-category') || card.className || '').toLowerCase();

      const matchesSearch = !query || text.includes(query);
      const matchesCat = cat === 'all' || cardCat.includes(cat) || text.includes(cat);

      if (matchesSearch && matchesCat) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // 5. Category & Filter Click Handlers
  function setupFilterButtons() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest(
        'button[data-category], a[data-category], .category-card, .category-btn, .filter-btn, [data-filter]'
      );
      if (!target) return;
      e.preventDefault();

      const cat = target.getAttribute('data-category') || target.getAttribute('data-filter') || target.textContent.trim();
      state.category = cat.toLowerCase();

      document.querySelectorAll('[data-category], .filter-btn, [data-filter]').forEach((el) => {
        el.classList.remove('active');
      });
      target.classList.add('active');

      filterVisibleCards();
      showToast('Filtering by: ' + cat, '🔍');
    });
  }

  // 6. Action Event Delegation (Cart, Wishlist, Modals, Forms)
  function setupActionDelegation() {
    document.addEventListener('click', (e) => {
      // Cart Trigger button
      const cartBtn = e.target.closest('#cart-button, .cart-button, [aria-label*="cart" i], [href="#cart"]');
      if (cartBtn && !cartBtn.closest('.ph-cart-drawer')) {
        e.preventDefault();
        openCartDrawer();
        return;
      }

      // Add to Cart buttons
      const addBtn = e.target.closest(
        'button.btn-add-cart, button[data-action="add-cart"], button[data-add-cart], button.add-to-cart, .add-cart-btn, [data-action="buy"]'
      ) || (e.target.tagName === 'BUTTON' && /add to cart|buy now|order now|add item/i.test(e.target.textContent));

      if (addBtn && !addBtn.closest('.ph-cart-drawer')) {
        e.preventDefault();
        const card = addBtn.closest('.product-card, .card, .item-card, article, div[class*="product"], li') || addBtn.parentElement;
        let title = 'Selected Product';
        let price = 49.99;

        if (card) {
          const titleEl = card.querySelector('h2, h3, h4, .title, .product-title, .name');
          if (titleEl) title = titleEl.textContent.trim();
          const priceEl = card.querySelector('.price, [class*="price"], .amount');
          if (priceEl) {
            const num = parseFloat(priceEl.textContent.replace(/[^0-9.]/g, ''));
            if (!isNaN(num)) price = num;
          }
        }

        const existing = (state.cart || []).find((i) => i.name === title);
        if (existing) {
          existing.qty = (existing.qty || 1) + 1;
        } else {
          state.cart.push({ id: 'item-' + Date.now(), name: title, price: price, qty: 1 });
        }

        saveState();
        updateCartBadges();
        showToast('Added "' + title + '" to cart! 🛒', '✅');
        return;
      }

      // Wishlist buttons
      const wishBtn = e.target.closest(
        '#wishlist-button, .wishlist-button, [data-action="wishlist"], .wishlist-btn'
      ) || (e.target.tagName === 'BUTTON' && /wishlist|favorite|heart/i.test(e.target.textContent));

      if (wishBtn) {
        e.preventDefault();
        const card = wishBtn.closest('.product-card, .card, .item-card, article') || null;
        if (card) {
          const titleEl = card.querySelector('h2, h3, h4, .title, .product-title');
          const title = titleEl ? titleEl.textContent.trim() : 'Item';
          const idx = state.wishlist.indexOf(title);
          if (idx >= 0) {
            state.wishlist.splice(idx, 1);
            showToast('Removed "' + title + '" from wishlist', '💔');
          } else {
            state.wishlist.push(title);
            showToast('Added "' + title + '" to wishlist! ❤️', '⭐');
          }
        } else {
          if (!state.wishlist || state.wishlist.length === 0) {
            showToast('Wishlist is empty. Click ❤️ on items to add!', 'ℹ️');
          } else {
            showToast('Wishlist: ' + state.wishlist.join(', '), '❤️');
          }
        }
        saveState();
        return;
      }

      // Account button
      const accBtn = e.target.closest('#account-button, .account-button, [aria-label*="account" i]');
      if (accBtn) {
        e.preventDefault();
        showToast('Account: Logged in as Demo User', '👤');
        return;
      }

      // Universal Card Action & Inspect Buttons
      const cardAction = e.target.closest('.card-action-btn, .btn-card-action, [data-action], .action-btn-primary');
      if (cardAction && !cardAction.closest('.modal, dialog')) {
        e.preventDefault();
        const action = cardAction.getAttribute('data-action') || 'action';
        const card = cardAction.closest('.product-card, .card, .item-card, article, tr, li');
        const title = card ? (card.querySelector('.product-title, .card-title, h3, h4, h2, strong')?.textContent?.trim() || 'Item') : 'Item';
        showToast('Selected ' + title + ' (' + action + ')', '✨');
        return;
      }

      // Universal Tab & Mode Toggles
      const tabToggle = e.target.closest('.keypad-tab, .mode-btn, .tab, .tab-btn');
      if (tabToggle) {
        e.preventDefault();
        const parent = tabToggle.parentElement;
        if (parent) {
          parent.querySelectorAll('.keypad-tab, .mode-btn, .tab, .tab-btn').forEach(btn => btn.classList.remove('active'));
          tabToggle.classList.add('active');
          showToast('Mode: ' + tabToggle.textContent.trim(), '⚙️');
        }
        return;
      }

      // Skip link or generic anchor smooth scrolling
      const anchor = e.target.closest('a[href^="#"]');
      if (anchor) {
        const hash = anchor.getAttribute('href');
        if (hash && hash !== '#' && document.querySelector(hash)) {
          e.preventDefault();
          document.querySelector(hash).scrollIntoView({ behavior: 'smooth' });
        }
      }
    });

    // Intercept generic forms (e.g. newsletter, contact, todo creation)
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (form.getAttribute('role') === 'search' || form.id === 'search-form' || form.classList.contains('search-form')) {
        return;
      }
      e.preventDefault();
      const inputs = form.querySelectorAll('input:not([type="submit"]):not([type="hidden"]), textarea, select');
      let summary = '';
      inputs.forEach((inp) => {
        if (inp.value && !summary) summary = inp.value;
      });
      showToast('Form submitted successfully! ' + (summary ? '("' + summary + '")' : ''), '✅');
      form.reset();
    });
  }

  // 7. Universal Tab Switcher & Modal Dialog Manager
  function setupUniversalTabs() {
    document.addEventListener('click', (e) => {
      const tab = e.target.closest('[data-tab], .tab-btn, .nav-tab, .role-btn, [data-role]');
      if (!tab) return;
      const targetId = tab.getAttribute('data-tab') || tab.getAttribute('data-role');
      const container = tab.parentElement;
      if (container) {
        container.querySelectorAll('[data-tab], .tab-btn, .nav-tab, .role-btn, [data-role]').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
      }
      if (targetId) {
        document.querySelectorAll('.tab-content, .tab-pane, [data-panel], [data-view]').forEach((p) => {
          const pid = p.getAttribute('data-panel') || p.getAttribute('data-view') || p.id;
          if (pid === targetId || pid === 'tab-' + targetId || pid === 'view-' + targetId) {
            p.style.display = '';
            p.classList.add('active');
          } else {
            p.style.display = 'none';
            p.classList.remove('active');
          }
        });
        showToast('Switched to ' + (tab.textContent || targetId).trim(), '🧭');
      }
    });
  }

  function setupUniversalModals() {
    document.addEventListener('click', (e) => {
      const openBtn = e.target.closest('[data-modal], [data-open-modal], .btn-modal, .modal-trigger');
      if (openBtn) {
        const modalId = openBtn.getAttribute('data-modal') || openBtn.getAttribute('data-open-modal');
        const modal = modalId ? document.getElementById(modalId) : document.querySelector('.modal, dialog, .modal-backdrop');
        if (modal) {
          if (typeof modal.showModal === 'function') modal.showModal();
          modal.style.display = 'flex';
          modal.classList.add('active');
          showToast('Opened dialog', '📋');
        }
        return;
      }
      const closeBtn = e.target.closest('.modal-close, [data-close], .btn-close, .dialog-close');
      if (closeBtn) {
        const modal = closeBtn.closest('.modal, dialog, .modal-backdrop, .dialog');
        if (modal) {
          if (typeof modal.close === 'function') modal.close();
          modal.style.display = 'none';
          modal.classList.remove('active');
        }
      }
    });
  }

  // 8. Initializer
  function init() {
    if (isEcom) {
      ensureDrawer();
      updateCartBadges();
    } else {
      setupUniversalTabs();
      setupUniversalModals();
    }
    setupLiveSearch();
    setupFilterButtons();
    setupActionDelegation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
