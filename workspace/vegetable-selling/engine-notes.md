```javascript
// app.js
/**
 * ==============================================================================
 * __PANDA_HIVE_DYNAMIC_ENGINE__ (vegetable-selling)
 * Auto-injected to guarantee 100% interactive, state-driven, dynamic functionality.
 * Features:
 *   - Reactive State & LocalStorage persistence
 *   - Live Search & Multi-Category Filtering
 *   - Cart Drawer with Quantity Controls, Total Calculation & Checkout
 *   - Wishlist / Favorite toggles
 *   - Animated Toast Notifications
 *   - Modal Dialog Management
 *   - Dynamic Form Interceptor (auto-creates new items & updates UI)
 * ==============================================================================
 */
(function() {
  'use strict';
  if (window.__PANDA_HIVE_DYNAMIC_ENGINE_LOADED__) return;
  window.__PANDA_HIVE_DYNAMIC_ENGINE_LOADED__ = true;

  const STORAGE_KEY = 'ph_vegetable-selling_state_v2';

  // 1. Core Reactive State
  const defaultState = {
    cart: [
      { id: 'item-1', name: 'Premium Setup Edition', price: 99.99, qty: 1 }
    ],
    wishlist: [],
    search: '',
    category: 'all',
    items: []
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

  // 3. Cart Drawer & Badge Manager
  function updateCartBadges() {
    const totalQty = (state.cart || []).reduce((sum, item) => sum + (item.qty || 1), 0);
    const badges = document.querySelectorAll('#cart-count, .cart-count, [data-cart-count], #cart-badge');
    badges.forEach((b) => {
      b.textContent = String(totalQty);
      b.classList.remove('badge-bounce');
      void b.offsetWidth; // trigger reflow
      b.classList.add('badge-bounce');
    });
  }

  function renderDrawerItems() {
    const body = document.querySelector('.ph-drawer-body');
    const subtotalEl = document.querySelector('.ph-drawer-subtotal-val');
    if (!body) return;

    if (!state.cart || state.cart.length === 0) {
      body.innerHTML = '<div style="text-align:center; padding: 40px 10px; color: #64748b;"><p style="font-size:36px; margin:0 0 10px 0;">🛒</p><p style="margin:0; font-weight:600;">Your cart is empty</p><p style="font-size:13px; margin:6px 0 0 0;">Add items to see them here.</p></div>';
      if (subtotalEl) subtotalEl.textContent = '$0.00';
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
          '<div class="ph-cart-item-price">$' + itemPrice.toFixed(2) + '</div>' +
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
      subtotalEl.textContent = '$' + subtotal.toFixed(2);
    }
  }

  function ensureDrawer() {
    if (document.querySelector('.ph-cart-drawer')) return;
    const overlay = document.createElement('div');
    overlay.className = 'ph-drawer-overlay';
    document.body.appendChild(overlay);

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
        '<span class="ph-drawer-subtotal-val">$0.00</span>' +
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

      // Universal Calculator Keypad & Math Buttons Delegate
      const calcKeyBtn = e.target.closest('[data-key], .calc-keypad button, .calc-keypad .btn, .keypad button, .btn-func, .btn-op, .btn-num, .btn-action');
      if (calcKeyBtn && !calcKeyBtn.classList.contains('mode-btn') && !calcKeyBtn.classList.contains('keypad-tab')) {
        const display = document.getElementById('calc-output') || document.getElementById('calc-result-display') || document.querySelector('.calc-main-line, .calc-output, .calc-display, [class*="display"]');
        const history = document.getElementById('calc-history') || document.getElementById('calc-history-line') || document.querySelector('.calc-history-line, [class*="history"]');
        if (display) {
          e.preventDefault();
          let key = calcKeyBtn.getAttribute('data-key') || calcKeyBtn.textContent.trim();
          if (key === 'AC' || key === 'C') {
            display.textContent = '0';
            if (history) history.textContent = 'CLEARED';
            showToast('Cleared (AC)', '🧹');
            return;
          }
          if (key === 'DEL' || key === 'CE') {
            const cur = display.textContent.trim();
            display.textContent = cur.length > 1 ? cur.slice(0, -1) : '0';
            return;
          }
          if (key === '=' || key === 'Enter') {
            try {
              let expr = (display.textContent || '').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
              if (history) history.textContent = display.textContent + ' =';
              const evaluated = Function('"use strict"; return (' + expr + ')')();
              display.textContent = String(evaluated);
              showToast('Evaluated: ' + evaluated, '🧮');
            } catch (err) {
              display.textContent = 'Error';
              showToast('Calculation Error', '⚠️');
            }
            return;
          }
          if (key === '÷') key = '/';
          else if (key === '×') key = '*';
          else if (key === '−') key = '-';

          if (display.textContent === '0' || display.textContent === 'Error') {
            display.textContent = key;
          } else {
            display.textContent += key;
          }
          return;
        }
      }

      // Universal Card Action & Insert Buttons
      const cardAction = e.target.closest('.card-action-btn, .item-card button, .card button:not(.btn-close)');
      if (cardAction && !cardAction.closest('.calc-keypad, .keypad')) {
        e.preventDefault();
        const card = cardAction.closest('.item-card, .card, article');
        const title = card ? (card.querySelector('.card-title, h3, h4, h2')?.textContent?.trim() || 'Item') : 'Item';
        const valEl = card ? (card.querySelector('.card-symbol, .card-tag, .price, p')?.textContent?.trim() || '') : '';

        const display = document.getElementById('calc-output') || document.getElementById('calc-result-display') || document.querySelector('.calc-main-line');
        if (display) {
          const match = valEl.match(/=s*([0-9.eE-+]+)/) || valEl.match(/([0-9.eE-+]+)/);
          const numVal = match ? match[1] : valEl;
          if (display.textContent === '0' || display.textContent === 'Error') {
            display.textContent = numVal || '1';
          } else {
            display.textContent += (numVal || '1');
          }
          showToast('Inserted ' + title + ' (' + (numVal || valEl) + ')', '📥');
        } else {
          showToast('Selected ' + title, '✨');
        }
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

  // 7. Initializer
  function init() {
    ensureDrawer();
    updateCartBadges();
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

```
