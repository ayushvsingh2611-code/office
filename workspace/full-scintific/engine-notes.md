```javascript
// app.js
/**
 * SUPER-CALC PRO | Advanced Scientific Calculator Engine
 * Architect & Engineer: Usopp (Backend & Application Logic Engineer)
 * 
 * Logic Capabilities:
 * - Reactive State Engine with LocalStorage Persistence
 * - Robust Math Parser & Evaluator (DEG/RAD/GRAD, Hyperbolics, Trigonometry, Factorials, Roots)
 * - Live Search Engine for Constants, Scientific Functions & Physics Formulas
 * - Cart / Saved Sheet Operations (Add, Multiplier/Quantity, Edit Notes, Dynamic Badge)
 * - Toast Notification Feedback System
 * - History & Memory Registers Management (M+, M-, MR, MC, MS)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================
  // 1. KNOWLEDGE BASE: CONSTANTS & FORMULAS
  // ==========================================
  const KNOWLEDGE_BASE = [
    // Scientific & Physics Constants
    { id: 'c', name: 'Speed of Light in Vacuum', symbol: 'c', val: '299792458', unit: 'm/s', category: 'physics', desc: 'Exact speed of electromagnetic radiation in vacuum.' },
    { id: 'h', name: 'Planck Constant', symbol: 'h', val: '6.62607015e-34', unit: 'J s', category: 'physics', desc: 'Fundamental constant of quantum mechanics.' },
    { id: 'hbar', name: 'Reduced Planck Constant', symbol: 'ħ', val: '1.054571817e-34', unit: 'J s', category: 'physics', desc: 'Dirac constant (h / 2π).' },
    { id: 'G', name: 'Gravitational Constant', symbol: 'G', val: '6.67430e-11', unit: 'm³/(kg s²)', category: 'physics', desc: 'Newtonian constant of gravitation.' },
    { id: 'NA', name: 'Avogadro Constant', symbol: 'N_A', val: '6.02214076e23', unit: 'mol⁻¹', category: 'chemistry', desc: 'Number of constituent particles per mole.' },
    { id: 'kB', name: 'Boltzmann Constant', symbol: 'k_B', val: '1.380649e-23', unit: 'J/K', category: 'physics', desc: 'Relates thermal energy to temperature.' },
    { id: 'me', name: 'Electron Mass', symbol: 'm_e', val: '9.1093837015e-31', unit: 'kg', category: 'physics', desc: 'Rest mass of an electron.' },
    { id: 'qe', name: 'Elementary Charge', symbol: 'e_charge', val: '1.602176634e-19', unit: 'C', category: 'physics', desc: 'Electric charge carried by a single proton.' },
    { id: 'eps0', name: 'Vacuum Permittivity', symbol: 'ε_0', val: '8.8541878128e-12', unit: 'F/m', category: 'physics', desc: 'Electric constant of free space.' },
    { id: 'mu0', name: 'Vacuum Permeability', symbol: 'μ_0', val: '1.25663706212e-6', unit: 'N/A²', category: 'physics', desc: 'Magnetic constant of free space.' },
    
    // Mathematical Constants
    { id: 'pi', name: 'Pi (Archimedes Constant)', symbol: 'π', val: '3.141592653589793', unit: 'rad', category: 'math', desc: 'Ratio of a circle\'s circumference to its diameter.' },
    { id: 'e_num', name: 'Euler\'s Number', symbol: 'e', val: '2.718281828459045', unit: '', category: 'math', desc: 'Base of the natural logarithm.' },
    { id: 'phi', name: 'Golden Ratio', symbol: 'ϕ', val: '1.618033988749895', unit: '', category: 'math', desc: '(1 + √5) / 2 ratio of aesthetic proportion.' },
    
    // Standard Math Functions
    { id: 'f_sin', name: 'Sine Function', symbol: 'sin(x)', val: 'sin(', unit: 'func', category: 'functions', desc: 'Trigonometric sine of angle x.' },
    { id: 'f_cos', name: 'Cosine Function', symbol: 'cos(x)', val: 'cos(', unit: 'func', category: 'functions', desc: 'Trigonometric cosine of angle x.' },
    { id: 'f_tan', name: 'Tangent Function', symbol: 'tan(x)', val: 'tan(', unit: 'func', category: 'functions', desc: 'Trigonometric tangent of angle x.' },
    { id: 'f_log', name: 'Logarithm Base 10', symbol: 'log(x)', val: 'log(', unit: 'func', category: 'functions', desc: 'Common logarithm of x.' },
    { id: 'f_ln', name: 'Natural Logarithm', symbol: 'ln(x)', val: 'ln(', unit: 'func', category: 'functions', desc: 'Logarithm base e of x.' },
    { id: 'f_sqrt', name: 'Square Root', symbol: 'sqrt(x)', val: 'sqrt(', unit: 'func', category: 'functions', desc: 'Principal square root of x.' },

    // Formulas
    { id: 'form_einstein', name: 'Mass-Energy Equivalence', symbol: 'E = m * c^2', val: 'm * 299792458^2', unit: 'J', category: 'formulas', desc: 'Einstein mass-energy equivalence equation.' },
    { id: 'form_grav', name: 'Gravitational Force', symbol: 'F = G*m1*m2/r^2', val: '6.6743e-11 * (m1 * m2) / (r^2)', unit: 'N', category: 'formulas', desc: 'Newtonian gravitational force formula.' },
    { id: 'form_circle_area', name: 'Circle Area', symbol: 'A = π * r^2', val: '3.14159265359 * r^2', unit: 'm²', category: 'formulas', desc: 'Total surface area of a circle with radius r.' }
  ];

  // ==========================================
  // 2. REACTIVE APP STATE STORAGE
  // ==========================================
  const STORAGE_KEY = 'SUPER_CALC_PRO_STATE_V2';

  const defaultState = {
    angleMode: 'DEG', // 'DEG' | 'RAD' | 'GRAD'
    fixPrecision: 4,  // Number of decimal places or -1 for auto
    expression: '',
    currentResult: '0',
    lastAnswer: '0',
    memoryRegister: 0,
    history: [],
    savedSheet: [
      { id: 'init-1', name: 'Speed of Light', symbol: 'c', value: '299792458', quantity: 1, note: 'Fundamental velocity', timestamp: Date.now() - 10000 },
      { id: 'init-2', name: 'Planck Constant', symbol: 'h', value: '6.62607015e-34', quantity: 1, note: 'Quantum of action', timestamp: Date.now() - 8000 },
      { id: 'init-3', name: 'Circle Area Formula', symbol: 'A = π * r^2', value: '3.14159265359 * r^2', quantity: 1, note: 'Geometry equation', timestamp: Date.now() - 6000 },
      { id: 'init-4', name: 'Golden Ratio', symbol: 'ϕ', value: '1.61803398875', quantity: 1, note: 'Divine proportion', timestamp: Date.now() - 4000 }
    ],
    searchQuery: '',
    activeFilter: 'all'
  };

  let AppState = loadState();

  function loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultState, ...parsed };
      }
    } catch (err) {
      console.warn('Failed to load state from localStorage:', err);
    }
    return { ...defaultState };
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(AppState));
    } catch (err) {
      console.error('Failed to save state to localStorage:', err);
    }
  }

  // ==========================================
  // 3. UI ELEMENT INJECTION & DOM BINDINGS
  // ==========================================
  // Dynamic structure verification and component fallback injection
  injectMissingUIComponents();

  const DOM = {
    searchInput: document.getElementById('search-input'),
    cartBtn: document.getElementById('cart-button'),
    cartCountBadge: document.getElementById('cart-count'),
    historyLine: document.getElementById('calc-history-line'),
    expressionDisplay: document.getElementById('calc-expression-display'),
    resultDisplay: document.getElementById('calc-result-display'),
    modeBtns: document.querySelectorAll('.mode-btn'),
    fixIndicator: document.getElementById('fix-indicator'),
    memIndicator: document.getElementById('mem-indicator'),
    searchPopup: document.getElementById('search-results-popup'),
    savedSheetModal: document.getElementById('saved-sheet-modal'),
    savedSheetList: document.getElementById('saved-sheet-list'),
    closeSheetBtn: document.getElementById('close-sheet-btn'),
    clearSheetBtn: document.getElementById('clear-sheet-btn'),
    toastContainer: document.getElementById('toast-container'),
    historyDrawerBtn: document.getElementById('history-toggle-btn'),
    historyModal: document.getElementById('history-modal'),
    historyList: document.getElementById('history-list'),
    clearHistoryBtn: document.getElementById('clear-history-btn')
  };

  // ==========================================
  // 4. SCIENTIFIC MATH EVALUATOR ENGINE
  // ==========================================
  const MathEngine = {
    /**
     * Converts angle to Radians based on selected mode
     */
    toRad(val, mode) {
      if (mode === 'DEG') return val * (Math.PI / 180);
      if (mode === 'GRAD') return val * (Math.PI / 200);
      return val; // RAD
    },

    /**
     * Converts Radians to target angle mode
     */
    fromRad(val, mode) {
      if (mode === 'DEG') return val * (180 / Math.PI);
      if (mode === 'GRAD') return val * (200 / Math.PI);
      return val; // RAD
    },

    /**
     * Factorial function handling integer inputs
     */
    factorial(n) {
      if (n < 0) return NaN;
      if (n === 0 || n === 1) return 1;
      if (n > 170) return Infinity;
      if (!Number.isInteger(n)) {
        // Gamma function approximation for non-integers
        return MathEngine.gamma(n + 1);
      }
      let res = 1;
      for (let i = 2; i <= n; i++) res *= i;
      return res;
    },

    /**
     * Lanczos approximation for Gamma Function
     */
    gamma(z) {
      const g = 7;
      const p = [
        0.99999999999980993, 676.5203681218851, -1259.139216722289,
        771.32342877765313, -176.61502916214059, 12.507343278686905,
        -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
      ];
      if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * MathEngine.gamma(1 - z));
      z -= 1;
      let x = p[0];
      for (let i = 1; i < g + 2; i++) x += p[i] / (z + i);
      let t = z + g + 0.5;
      return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
    },

    /**
     * Parse and evaluate input expression safely
     */
    evaluate(rawExpr, mode = 'DEG') {
      if (!rawExpr || !rawExpr.trim()) return 0;

      let expr = rawExpr;

      // Replace unicode mathematical symbols
      expr = expr.replace(/×/g, '*')
                 .replace(/÷/g, '/')
                 .replace(/−/g, '-')
                 .replace(/π/g, 'Math.PI')
                 .replace(/ϕ/g, '1.618033988749895')
                 .replace(/ Ans /g, ` (${AppState.lastAnswer}) `);

      // Handle Constants mapped in expression
      expr = expr.replace(/\b(c|h|G|NA|kB)\b/g, (match) => {
        const item = KNOWLEDGE_BASE.find(k => k.id === match || k.symbol === match);
        return item ? `(${item.val})` : match;
      });

      // Handle Factorials (e.g. 5! -> MathEngine.factorial(5))
      expr = expr.replace(/(\d+(\.\d+)?|\([^\(\)]+\))!/g, (match, p1) => {
        return `MathEngine.factorial(${p1})`;
      });

      // Handle Percentage (e.g. 50% -> (50/100))
      expr = expr.replace(/(\d+(\.\d+)?)\%/g, '($1/100)');

      // Handle Power ^ operator -> **
      expr = expr.replace(/\^/g, '**');

      // Trigonometric Functions wrapper accounting for DEG/RAD/GRAD
      const trigContext = {
        sin: (x) => Math.sin(MathEngine.toRad(x, mode)),
        cos: (x) => Math.cos(MathEngine.toRad(x, mode)),
        tan: (x) => Math.tan(MathEngine.toRad(x, mode)),
        asin: (x) => MathEngine.fromRad(Math.asin(x), mode),
        acos: (x) => MathEngine.fromRad(Math.acos(x), mode),
        atan: (x) => MathEngine.fromRad(Math.atan(x), mode),
        sinh: Math.sinh,
        cosh: Math.cosh,
        tanh: Math.tanh,
        asinh: Math.asinh,
        acosh: Math.acosh,
        atanh: Math.atanh,
        log: Math.log10,
        ln: Math.log,
        sqrt: Math.sqrt,
        cbrt: Math.cbrt,
        abs: Math.abs,
        exp: Math.exp,
        fact: MathEngine.factorial,
        MathEngine: MathEngine
      };

      // Safely construct sandboxed Function runner
      try {
        const keys = Object.keys(trigContext);
        const values = Object.values(trigContext);
        const evalFunc = new Function(...keys, `return (${expr});`);
        const result = evalFunc(...values);

        if (typeof result === 'number') {
          if (isNaN(result)) throw new Error('Math Error: NaN result');
          if (!isFinite(result)) throw new Error('Division by zero or overflow');
          return result;
        }
        return result;
      } catch (err) {
        throw new Error(err.message || 'Syntax Error');
      }
    },

    /**
     * Formats evaluated number based on precision rules
     */
    formatResult(num, precision = 4) {
      if (typeof num !== 'number') return String(num);
      if (isNaN(num)) return 'Error: Invalid Input';
      if (!isFinite(num)) return 'Error: Infinity';

      // Very small or large numbers use scientific notation automatically
      const absVal = Math.abs(num);
      if ((absVal > 0 && absVal < 1e-6) || absVal >= 1e12) {
        return num.toExponential(precision);
      }

      if (precision === -1) {
        // Auto precision: remove trailing zeros
        return parseFloat(num.toFixed(10)).toString();
      }

      // Check if integer
      if (Number.isInteger(num)) {
        return num.toString();
      }

      return num.toFixed(precision).replace(/\.?0+$/, '');
    }
  };

  // ==========================================
  // 5. TOAST NOTIFICATION SYSTEM
  // ==========================================
  function showToast(message, type = 'info', duration = 3000) {
    if (!DOM.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
      success: '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>',
      error: '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
      info: '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
    };

    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-message">${escapeHTML(message)}</span>
      <button class="toast-close">&times;</button>
    `;

    DOM.toastContainer.appendChild(toast);

    // Dynamic animation entrance
    requestAnimationFrame(() => toast.classList.add('show'));

    const removeToast = () => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    };

    toast.querySelector('.toast-close').addEventListener('click', removeToast);
    setTimeout(removeToast, duration);
  }

  // ==========================================
  // 6. REACTIVE STATE INTERACTIVE RENDERERS
  // ==========================================

  function renderCalculatorDisplay() {
    if (DOM.expressionDisplay) {
      DOM.expressionDisplay.textContent = AppState.expression || '0';
    }

    if (DOM.resultDisplay) {
      DOM.resultDisplay.textContent = AppState.currentResult || '0';
    }

    if (DOM.historyLine) {
      const lastHist = AppState.history[0];
      DOM.historyLine.textContent = lastHist 
        ? `${lastHist.expression} = ${lastHist.result}` 
        : `MODE: ${AppState.angleMode} | FIX: ${AppState.fixPrecision}`;
    }

    // Update Mode Buttons Active State
    if (DOM.modeBtns) {
      DOM.modeBtns.forEach(btn => {
        const mode = btn.textContent.trim();
        if (mode === AppState.angleMode) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    // Update Status Indicators
    if (DOM.fixIndicator) {
      DOM.fixIndicator.textContent = `FIX: ${AppState.fixPrecision}`;
    }

    if (DOM.memIndicator) {
      if (AppState.memoryRegister !== 0) {
        DOM.memIndicator.textContent = `M: ${MathEngine.formatResult(AppState.memoryRegister, 2)}`;
        DOM.memIndicator.classList.add('active');
      } else {
        DOM.memIndicator.textContent = `M: OFF`;
        DOM.memIndicator.classList.remove('active');
      }
    }
  }

  function renderSavedSheet() {
    // Update Badge Counter Dynamically
    const totalCount = AppState.savedSheet.reduce((sum, item) => sum + (item.quantity || 1), 0);
    if (DOM.cartCountBadge) {
      DOM.cartCountBadge.textContent = totalCount;
      DOM.cartCountBadge.style.display = totalCount > 0 ? 'inline-flex' : 'none';
    }

    if (!DOM.savedSheetList) return;

    if (AppState.savedSheet.length === 0) {
      DOM.savedSheetList.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" stroke-width="1.5" fill="none">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
          <p>No saved formulas or constants in your sheet.</p>
          <span class="subtext">Search functions above or save calculator snapshots!</span>
        </div>
      `;
      return;
    }

    DOM.savedSheetList.innerHTML = AppState.savedSheet.map(item => `
      <div class="sheet-item" data-id="${item.id}">
        <div class="sheet-item-header">
          <div class="sheet-item-info">
            <h4 class="sheet-item-title">${escapeHTML(item.name)}</h4>
            <span class="sheet-item-symbol">${escapeHTML(item.symbol || '')}</span>
          </div>
          <span class="sheet-item-val">${escapeHTML(item.value)}</span>
        </div>

        <div class="sheet-item-note-row">
          <input type="text" class="sheet-note-input" value="${escapeHTML(item.note || '')}" placeholder="Add a note or context..." data-id="${item.id}">
        </div>

        <div class="sheet-item-actions">
          <div class="quantity-control">
            <button class="qty-btn qty-minus" data-id="${item.id}" aria-label="Decrease quantity">-</button>
            <span class="qty-val">${item.quantity || 1}</span>
            <button class="qty-btn qty-plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
          </div>

          <div class="btn-group">
            <button class="action-btn inject-btn" data-id="${item.id}" title="Inject value/symbol into calculator">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
              Use
            </button>
            <button class="action-btn remove-btn" data-id="${item.id}" title="Remove item">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function renderSearchResults() {
    if (!DOM.searchPopup) return;

    const query = (AppState.searchQuery || '').trim().toLowerCase();

    if (!query) {
      DOM.searchPopup.classList.remove('open');
      return;
    }

    const filtered = KNOWLEDGE_BASE.filter(item => {
      const matchName = item.name.toLowerCase().includes(query);
      const matchSymbol = item.symbol.toLowerCase().includes(query);
      const matchCategory = item.category.toLowerCase().includes(query);
      const matchDesc = (item.desc || '').toLowerCase().includes(query);
      return matchName || matchSymbol || matchCategory || matchDesc;
    });

    DOM.searchPopup.classList.add('open');

    if (filtered.length === 0) {
      DOM.searchPopup.innerHTML = `
        <div class="search-no-results">
          <p>No constants or formulas found matching "<strong>${escapeHTML(query)}</strong>"</p>
        </div>
      `;
      return;
    }

    DOM.searchPopup.innerHTML = filtered.map(item => `
      <div class="search-result-row" data-id="${item.id}">
        <div class="result-main">
          <span class="result-badge badge-${item.category}">${item.category.toUpperCase()}</span>
          <div class="result-details">
            <span class="result-title">${escapeHTML(item.name)}</span>
            <span class="result-symbol">${escapeHTML(item.symbol)} = ${escapeHTML(item.val)} ${escapeHTML(item.unit)}</span>
          </div>
        </div>
        <div class="result-actions">
          <button class="search-act-btn inject-search-btn" data-val="${escapeHTML(item.val)}" title="Insert to calculation">
            Insert
          </button>
          <button class="search-act-btn save-search-btn" data-id="${item.id}" title="Save to Sheet">
            + Sheet
          </button>
        </div>
      </div>
    `).join('');
  }

  function renderHistoryModal() {
    if (!DOM.historyList) return;

    if (AppState.history.length === 0) {
      DOM.historyList.innerHTML = `<div class="empty-state"><p>No calculation history recorded yet.</p></div>`;
      return;
    }

    DOM.historyList.innerHTML = AppState.history.map((item, idx) => `
      <div class="history-item" data-index="${idx}">
        <div class="hist-expr">${escapeHTML(item.expression)}</div>
        <div class="hist-res">= ${escapeHTML(item.result)}</div>
        <div class="hist-time">${new Date(item.timestamp).toLocaleTimeString()}</div>
      </div>
    `).join('');
  }

  // ==========================================
  // 7. CALCULATOR ACTIONS & KEYPAD CONTROLLER
  // ==========================================
  function handleCalcInput(input) {
    switch (input) {
      case 'AC':
        AppState.expression = '';
        AppState.currentResult = '0';
        showToast('Calculator Cleared', 'info');
        break;

      case 'DEL':
      case 'BACKSPACE':
        AppState.expression = AppState.expression.slice(0, -1);
        calculateLiveResult();
        break;

      case '=':
      case 'ENTER':
        executeCalculation();
        break;

      case 'ANS':
        insertToken(` Ans `);
        break;

      case 'MC':
        AppState.memoryRegister = 0;
        showToast('Memory Cleared (MC)', 'info');
        break;

      case 'MR':
        insertToken(AppState.memoryRegister.toString());
        showToast(`Memory Recalled: ${AppState.memoryRegister}`, 'success');
        break;

      case 'M+':
        try {
          const val = MathEngine.evaluate(AppState.expression || AppState.currentResult, AppState.angleMode);
          AppState.memoryRegister += val;
          showToast(`Added to Memory: ${MathEngine.formatResult(val, 2)}`, 'success');
        } catch (err) {
          showToast(`Memory Error: ${err.message}`, 'error');
        }
        break;

      case 'M-':
        try {
          const val = MathEngine.evaluate(AppState.expression || AppState.currentResult, AppState.angleMode);
          AppState.memoryRegister -= val;
          showToast(`Subtracted from Memory: ${MathEngine.formatResult(val, 2)}`, 'success');
        } catch (err) {
          showToast(`Memory Error: ${err.message}`, 'error');
        }
        break;

      case 'MS':
        try {
          const val = MathEngine.evaluate(AppState.expression || AppState.currentResult, AppState.angleMode);
          AppState.memoryRegister = val;
          showToast(`Stored in Memory: ${MathEngine.formatResult(val, 2)}`, 'success');
        } catch (err) {
          showToast(`Memory Error: ${err.message}`, 'error');
        }
        break;

      case 'SAVE_RESULT':
        saveCurrentResultToSheet();
        break;

      default:
        insertToken(input);
        break;
    }

    saveState();
    renderCalculatorDisplay();
  }

  function insertToken(token) {
    // Smart token formatting
    const funcs = ['sin(', 'cos(', 'tan(', 'asin(', 'acos(', 'atan(', 'sinh(', 'cosh(', 'tanh(', 'log(', 'ln(', 'sqrt(', 'cbrt(', 'abs('];
    
    if (funcs.includes(token)) {
      AppState.expression += token;
    } else {
      AppState.expression += token;
    }

    calculateLiveResult();
  }

  function calculateLiveResult() {
    if (!AppState.expression.trim()) {
      AppState.currentResult = '0';
      return;
    }

    try {
      const res = MathEngine.evaluate(AppState.expression, AppState.angleMode);
      AppState.currentResult = MathEngine.formatResult(res, AppState.fixPrecision);
    } catch (err) {
      // Live error non-intrusive preview
      AppState.currentResult = '...';
    }
  }

  function executeCalculation() {
    if (!AppState.expression.trim()) return;

    try {
      const rawRes = MathEngine.evaluate(AppState.expression, AppState.angleMode);
      const formatted = MathEngine.formatResult(rawRes, AppState.fixPrecision);

      AppState.lastAnswer = formatted;
      AppState.currentResult = formatted;

      // Add to history log
      AppState.history.unshift({
        id: 'hist_' + Date.now(),
        expression: AppState.expression,
        result: formatted,
        timestamp: Date.now()
      });

      // Limit history to 30 items
      if (AppState.history.length > 30) AppState.history.pop();

      showToast(`Calculated: ${formatted}`, 'success');
    } catch (err) {
      AppState.currentResult = 'Error';
      showToast(err.message || 'Evaluation Error', 'error');
    }
  }

  function saveCurrentResultToSheet() {
    if (!AppState.currentResult || AppState.currentResult === '0' || AppState.currentResult === 'Error') {
      showToast('No valid result to save!', 'error');
      return;
    }

    const newItem = {
      id: 'custom_' + Date.now(),
      name: `Calc Result (${AppState.expression || 'Val'})`,
      symbol: AppState.expression || 'Result',
      value: AppState.currentResult,
      quantity: 1,
      note: `Saved from calculator at ${new Date().toLocaleTimeString()}`,
      timestamp: Date.now()
    };

    AppState.savedSheet.unshift(newItem);
    saveState();
    renderSavedSheet();
    showToast('Result saved to Sheet!', 'success');
  }

  // ==========================================
  // 8. SAVED SHEET CART OPERATIONS
  // ==========================================
  function addKnowledgeItemToSheet(itemId) {
    const item = KNOWLEDGE_BASE.find(k => k.id === itemId);
    if (!item) return;

    // Check if item already exists in saved sheet
    const existingIndex = AppState.savedSheet.findIndex(s => s.symbol === item.symbol || s.name === item.name);

    if (existingIndex > -1) {
      AppState.savedSheet[existingIndex].quantity = (AppState.savedSheet[existingIndex].quantity || 1) + 1;
      showToast(`Updated quantity for "${item.name}" (${AppState.savedSheet[existingIndex].quantity})`, 'info');
    } else {
      AppState.savedSheet.unshift({
        id: 'sheet_' + Date.now(),
        name: item.name,
        symbol: item.symbol,
        value: item.val,
        quantity: 1,
        note: item.desc || '',
        timestamp: Date.now()
      });
      showToast(`Added "${item.name}" to Saved Sheet`, 'success');
    }

    saveState();
    renderSavedSheet();
  }

  function updateSheetQuantity(id, change) {
    const item = AppState.savedSheet.find(s => s.id === id);
    if (!item) return;

    item.quantity = (item.quantity || 1) + change;
    if (item.quantity <= 0) {
      removeSheetItem(id);
      return;
    }

    saveState();
    renderSavedSheet();
  }

  function removeSheetItem(id) {
    const item = AppState.savedSheet.find(s => s.id === id);
    AppState.savedSheet = AppState.savedSheet.filter(s => s.id !== id);
    saveState();
    renderSavedSheet();
    if (item) showToast(`Removed "${item.name}" from sheet`, 'info');
  }

  function updateSheetNote(id, noteText) {
    const item = AppState.savedSheet.find(s => s.id === id);
    if (item) {
      item.note = noteText;
      saveState();
    }
  }

  // ==========================================
  // 9. EVENT LISTENERS & DOM DELEGATION
  // ==========================================

  // Keypad & Calculator Buttons Delegate
  document.addEventListener('click', (e) => {
    // Handle Calculator Keypad Button clicks
    const keyBtn = e.target.closest('[data-key]');
    if (keyBtn) {
      const keyVal = keyBtn.getAttribute('data-key');
      handleCalcInput(keyVal);
      return;
    }

    // Handle Angle Mode Buttons
    const modeBtn = e.target.closest('.mode-btn');
    if (modeBtn) {
      const newMode = modeBtn.textContent.trim();
      if (['DEG', 'RAD', 'GRAD'].includes(newMode)) {
        AppState.angleMode = newMode;
        saveState();
        renderCalculatorDisplay();
        calculateLiveResult();
        showToast(`Angle Mode: ${newMode}`, 'info');
      }
      return;
    }

    // Handle Fix Precision Indicator Toggle
    const fixInd = e.target.closest('#fix-indicator');
    if (fixInd) {
      const precisions = [2, 4, 6, 8, -1];
      const nextIdx = (precisions.indexOf(AppState.fixPrecision) + 1) % precisions.length;
      AppState.fixPrecision = precisions[nextIdx];
      saveState();
      renderCalculatorDisplay();
      calculateLiveResult();
      showToast(`Precision set to ${AppState.fixPrecision === -1 ? 'AUTO' : AppState.fixPrecision + ' decimals'}`, 'info');
      return;
    }

    // Saved Sheet Quantity Plus / Minus
    const qtyPlus = e.target.closest('.qty-plus');
    if (qtyPlus) {
      updateSheetQuantity(qtyPlus.getAttribute('data-id'), 1);
      return;
    }

    const qtyMinus = e.target.closest('.qty-minus');
    if (qtyMinus) {
      updateSheetQuantity(qtyMinus.getAttribute('data-id'), -1);
      return;
    }

    // Saved Sheet Remove Item
    const removeBtn = e.target.closest('.remove-btn');
    if (removeBtn) {
      removeSheetItem(removeBtn.getAttribute('data-id'));
      return;
    }

    // Saved Sheet Inject Item to Calculator
    const injectBtn = e.target.closest('.inject-btn');
    if (injectBtn) {
      const item = AppState.savedSheet.find(s => s.id === injectBtn.getAttribute('data-id'));
      if (item) {
        insertToken(item.value);
        showToast(`Injected "${item.name}" into calculation`, 'success');
        if (DOM.savedSheetModal) DOM.savedSheetModal.classList.remove('open');
      }
      return;
    }

    // Search Popup Actions
    const injectSearchBtn = e.target.closest('.inject-search-btn');
    if (injectSearchBtn) {
      const val = injectSearchBtn.getAttribute('data-val');
      insertToken(val);
      showToast('Inserted value to calculator', 'success');
      if (DOM.searchPopup) DOM.searchPopup.classList.remove('open');
      if (DOM.searchInput) DOM.searchInput.value = '';
      AppState.searchQuery = '';
      return;
    }

    const saveSearchBtn = e.target.closest('.save-search-btn');
    if (saveSearchBtn) {
      const id = saveSearchBtn.getAttribute('data-id');
      addKnowledgeItemToSheet(id);
      if (DOM.searchPopup) DOM.searchPopup.classList.remove('open');
      if (DOM.searchInput) DOM.searchInput.value = '';
      AppState.searchQuery = '';
      return;
    }

    // Close search dropdown on outside click
    if (DOM.searchPopup && !e.target.closest('.search-box') && !e.target.closest('#search-results-popup')) {
      DOM.searchPopup.classList.remove('open');
    }
  });

  // Saved Sheet Note Input Change Delegate
  if (DOM.savedSheetList) {
    DOM.savedSheetList.addEventListener('input', (e) => {
      if (e.target.classList.contains('sheet-note-input')) {
        const id = e.target.getAttribute('data-id');
        updateSheetNote(id, e.target.value);
      }
    });
  }

  // Live Search Input Handler
  if (DOM.searchInput) {
    DOM.searchInput.addEventListener('input', (e) => {
      AppState.searchQuery = e.target.value;
      renderSearchResults();
    });

    DOM.searchInput.addEventListener('focus', () => {
      if (AppState.searchQuery.trim()) {
        renderSearchResults();
      }
    });
  }

  // Modal Triggers & Controls
  if (DOM.cartBtn) {
    DOM.cartBtn.addEventListener('click', () => {
      if (DOM.savedSheetModal) {
        renderSavedSheet();
        DOM.savedSheetModal.classList.add('open');
      }
    });
  }

  if (DOM.closeSheetBtn) {
    DOM.closeSheetBtn.addEventListener('click', () => {
      if (DOM.savedSheetModal) DOM.savedSheetModal.classList.remove('open');
    });
  }

  if (DOM.clearSheetBtn) {
    DOM.clearSheetBtn.addEventListener('click', () => {
      if (AppState.savedSheet.length === 0) return;
      if (confirm('Are you sure you want to clear all items in your Saved Sheet?')) {
        AppState.savedSheet = [];
        saveState();
        renderSavedSheet();
        showToast('Saved Sheet cleared', 'info');
      }
    });
  }

  if (DOM.historyDrawerBtn) {
    DOM.historyDrawerBtn.addEventListener('click', () => {
      if (DOM.historyModal) {
        renderHistoryModal();
        DOM.historyModal.classList.add('open');
      }
    });
  }

  if (DOM.clearHistoryBtn) {
    DOM.clearHistoryBtn.addEventListener('click', () => {
      AppState.history = [];
      saveState();
      renderHistoryModal();
      renderCalculatorDisplay();
      showToast('Calculation History cleared', 'info');
    });
  }

  // History Item Click to Restore Expression
  if (DOM.historyList) {
    DOM.historyList.addEventListener('click', (e) => {
      const histItem = e.target.closest('.history-item');
      if (histItem) {
        const idx = parseInt(histItem.getAttribute('data-index'), 10);
        const record = AppState.history[idx];
        if (record) {
          AppState.expression = record.expression;
          AppState.currentResult = record.result;
          renderCalculatorDisplay();
          if (DOM.historyModal) DOM.historyModal.classList.remove('open');
          showToast('Restored calculation from history', 'success');
        }
      }
    });
  }

  // Physical Keyboard Bindings
  document.addEventListener('keydown', (e) => {
    // Ignore keypresses inside inputs
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    const key = e.key;

    if (key >= '0' && key <= '9') insertToken(key);
    else if (key === '.') insertToken('.');
    else if (key === '+') insertToken('+');
    else if (key === '-') insertToken('-');
    else if (key === '*') insertToken('*');
    else if (key === '/') insertToken('/');
    else if (key === '^') insertToken('^');
    else if (key === '(') insertToken('(');
    else if (key === ')') insertToken(')');
    else if (key === '!') insertToken('!');
    else if (key === '%') insertToken('%');
    else if (key === 'Enter' || key === '=') {
      e.preventDefault();
      handleCalcInput('=');
    } else if (key === 'Backspace') {
      handleCalcInput('DEL');
    } else if (key === 'Escape') {
      if (DOM.savedSheetModal) DOM.savedSheetModal.classList.remove('open');
      if (DOM.historyModal) DOM.historyModal.classList.remove('open');
      if (DOM.searchPopup) DOM.searchPopup.classList.remove('open');
    }

    renderCalculatorDisplay();
  });

  // ==========================================
  // 10. DOM INJECTION FALLBACK HELPER
  // ==========================================
  function injectMissingUIComponents() {
    // 1. Ensure Toast Container exists
    if (!document.getElementById('toast-container')) {
      const toastDiv = document.createElement('div');
      toastDiv.id = 'toast-container';
      toastDiv.className = 'toast-container';
      document.body.appendChild(toastDiv);
    }

    // 2. Ensure Display elements exist inside calculator card
    const calcCard = document.querySelector('.calculator-card');
    if (calcCard) {
      let calcDisplay = calcCard.querySelector('.calc-display');
      if (!calcDisplay) {
        calcDisplay = document.createElement('div');
        calcDisplay.className = 'calc-display';
        calcCard.appendChild(calcDisplay);
      }

      if (!document.getElementById('calc-history-line')) {
        const hLine = document.createElement('div');
        hLine.id = 'calc-history-line';
        hLine.className = 'calc-history-line';
        calcDisplay.appendChild(hLine);
      }

      if (!document.getElementById('calc-expression-display')) {
        const exprLine = document.createElement('div');
        exprLine.id = 'calc-expression-display';
        exprLine.className = 'calc-expression-display';
        exprLine.textContent = '0';
        calcDisplay.appendChild(exprLine);
      }

      if (!document.getElementById('calc-result-display')) {
        const resLine = document.createElement('div');
        resLine.id = 'calc-result-display';
        resLine.className = 'calc-result-display';
        resLine.textContent = '0';
        calcDisplay.appendChild(resLine);
      }

      // 3. Inject Scientific Keypad if not present in HTML
      if (!calcCard.querySelector('.calc-keypad')) {
        const keypad = document.createElement('div');
        keypad.className = 'calc-keypad';
        keypad.innerHTML = `
          <!-- Scientific Function Rows -->
          <div class="keypad-row">
            <button class="key-btn func" data-key="sin(">sin</button>
            <button class="key-btn func" data-key="cos(">cos</button>
            <button class="key-btn func" data-key="tan(">tan</button>
            <button class="key-btn func" data-key="asin(">asin</button>
            <button class="key-btn func" data-key="acos(">acos</button>
            <button class="key-btn func" data-key="atan(">atan</button>
          </div>
          <div class="keypad-row">
            <button class="key-btn func" data-key="log(">log</button>
            <button class="key-btn func" data-key="ln(">ln</button>
            <button class="key-btn func" data-key="sqrt(">√</button>
            <button class="key-btn func" data-key="^">x^y</button>
            <button class="key-btn func" data-key="!">x!</button>
            <button class="key-btn func" data-key="%">%</button>
          </div>
          <div class="keypad-row">
            <button class="key-btn memory" data-key="MC">MC</button>
            <button class="key-btn memory" data-key="MR">MR</button>
            <button class="key-btn memory" data-key="M+">M+</button>
            <button class="key-btn memory" data-key="M-">M-</button>
            <button class="key-btn memory" data-key="MS">MS</button>
            <button class="key-btn special" id="history-toggle-btn" title="View History">HIST</button>
          </div>
          <div class="keypad-row">
            <button class="key-btn const" data-key="π">π</button>
            <button class="key-btn const" data-key="e">e</button>
            <button class="key-btn" data-key="(">(</button>
            <button class="key-btn" data-key=")">)</button>
            <button class="key-btn danger" data-key="DEL">DEL</button>
            <button class="key-btn danger" data-key="AC">AC</button>
          </div>
          <!-- Numeric Grid & Operators -->
          <div class="keypad-main-grid">
            <button class="key-btn num" data-key="7">7</button>
            <button class="key-btn num" data-key="8">8</button>
            <button class="key-btn num" data-key="9">9</button>
            <button class="key-btn op" data-key="/">÷</button>

            <button class="key-btn num" data-key="4">4</button>
            <button class="key-btn num" data-key="5">5</button>
            <button class="key-btn num" data-key="6">6</button>
            <button class="key-btn op" data-key="*">×</button>

            <button class="key-btn num" data-key="1">1</button>
            <button class="key-btn num" data-key="2">2</button>
            <button class="key-btn num" data-key="3">3</button>
            <button class="key-btn op" data-key="-">−</button>

            <button class="key-btn num" data-key="0">0</button>
            <button class="key-btn num" data-key=".">.</button>
            <button class="key-btn num" data-key="ANS">Ans</button>
            <button class="key-btn op" data-key="+">+</button>
          </div>
          <div class="keypad-row action-row">
            <button class="key-btn save-res-btn" data-key="SAVE_RESULT">💾 Save Result to Sheet</button>
            <button class="key-btn equals-btn" data-key="=">=</button>
          </div>
        `;
        calcCard.appendChild(keypad);
      }
    }

    // 4. Inject Search Popup overlay wrapper
    const searchBox = document.querySelector('.search-box');
    if (searchBox && !document.getElementById('search-results-popup')) {
      const popup = document.createElement('div');
      popup.id = 'search-results-popup';
      popup.className = 'search-results-popup';
      searchBox.appendChild(popup);
    }

    // 5. Inject Saved Sheet Drawer Modal
    if (!document.getElementById('saved-sheet-modal')) {
      const modal = document.createElement('div');
      modal.id = 'saved-sheet-modal';
      modal.className = 'app-modal';
      modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-card">
          <div class="modal-header">
            <h3>Saved Sheet & Formula Vault</h3>
            <button id="close-sheet-btn" class="close-btn">&times;</button>
          </div>
          <div id="saved-sheet-list" class="saved-sheet-list"></div>
          <div class="modal-footer">
            <button id="clear-sheet-btn" class="btn-secondary">Clear All Sheet</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    // 6. Inject Calculation History Modal
    if (!document.getElementById('history-modal')) {
      const histModal = document.createElement('div');
      histModal.id = 'history-modal';
      histModal.className = 'app-modal';
      histModal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-card">
          <div class="modal-header">
            <h3>Calculation Log History</h3>
            <button onclick="document.getElementById('history-modal').classList.remove('open')" class="close-btn">&times;</button>
          </div>
          <div id="history-list" class="history-list"></div>
          <div class="modal-footer">
            <button id="clear-history-btn" class="btn-secondary">Clear History Log</button>
          </div>
        </div>
      `;
      document.body.appendChild(histModal);
    }
  }

  // Helper utility to prevent XSS in dynamic templates
  function escapeHTML(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // ==========================================
  // 11. INITIAL APP RENDER INITIALIZATION
  // ==========================================
  renderCalculatorDisplay();
  renderSavedSheet();
  showToast('SUPER-CALC PRO Engine Ready', 'success');

});
```