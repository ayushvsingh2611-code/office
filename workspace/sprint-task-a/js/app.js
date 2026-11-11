/**
 * app.js - Main Application Entry Point, View Navigation, Global Event Listeners
 */

import { getState, setState, loadStoredState, subscribe } from './state.js';
import { seedDatabase, exportDatabaseJSON, importDatabaseJSON } from './storage.js';
import { showToast, closeModal, closeAllModals } from './ui.js';
import * as booksModule from './books.js';
import * as membersModule from './members.js';
import * as circulationModule from './circulation.js';
import * as dashboardModule from './dashboard.js';

// Expose modules globally for inline HTML event triggers
window.booksModule = booksModule;
window.membersModule = membersModule;
window.circulationModule = circulationModule;
window.dashboardModule = dashboardModule;

export const switchView = (viewName) => {
  const views = ['dashboard', 'books', 'members', 'circulation', 'reservations', 'settings'];
  if (!views.includes(viewName)) viewName = 'dashboard';

  // Toggle active section
  views.forEach(v => {
    const section = document.getElementById(`view-${v}`);
    const navLink = document.getElementById(`nav-${v}`);
    if (section) {
      if (v === viewName) section.classList.add('active');
      else section.classList.remove('active');
    }
    if (navLink) {
      if (v === viewName) navLink.classList.add('active');
      else navLink.classList.remove('active');
    }
  });

  setState({ currentView: viewName });

  // Render view data
  switch (viewName) {
    case 'dashboard':
      dashboardModule.renderDashboard();
      break;
    case 'books':
      booksModule.renderBooksView();
      break;
    case 'members':
      membersModule.renderMembersView();
      break;
    case 'circulation':
      circulationModule.renderCirculationView();
      break;
    case 'reservations':
      circulationModule.renderReservationsView();
      break;
    case 'settings':
      loadSettingsIntoView();
      break;
  }
};

const loadSettingsIntoView = () => {
  const settings = getState().settings;
  const nameInput = document.getElementById('settings-library-name');
  const loanDaysInput = document.getElementById('settings-loan-period-days');
  const fineRateInput = document.getElementById('settings-daily-fine-rate');
  const maxBooksInput = document.getElementById('settings-max-books-limit');

  if (nameInput) nameInput.value = settings.libraryName || 'Alexandria Central Library';
  if (loanDaysInput) loanDaysInput.value = settings.defaultLoanPeriodDays || 14;
  if (fineRateInput) fineRateInput.value = settings.dailyFineRate || 0.50;
  if (maxBooksInput) maxBooksInput.value = settings.defaultMaxBooks || 4;
};

const handleSaveSettings = () => {
  const nameInput = document.getElementById('settings-library-name');
  const loanDaysInput = document.getElementById('settings-loan-period-days');
  const fineRateInput = document.getElementById('settings-daily-fine-rate');
  const maxBooksInput = document.getElementById('settings-max-books-limit');

  const libraryName = nameInput ? nameInput.value.trim() : 'Alexandria Central Library';
  const defaultLoanPeriodDays = parseInt(loanDaysInput.value, 10) || 14;
  const dailyFineRate = parseFloat(fineRateInput.value) || 0.50;
  const defaultMaxBooks = parseInt(maxBooksInput.value, 10) || 4;

  setState(prev => ({
    settings: {
      ...prev.settings,
      libraryName,
      defaultLoanPeriodDays,
      dailyFineRate,
      defaultMaxBooks
    }
  }));

  showToast('Settings saved successfully!', 'success');
};

const setupDateTime = () => {
  const el = document.getElementById('header-datetime');
  if (!el) return;

  const update = () => {
    const now = new Date();
    el.innerHTML = `
      <i class="fa-regular fa-calendar-days"></i>
      <span>${now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} &bull; ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
    `;
  };

  update();
  setInterval(update, 30000);
};

const setupThemeToggle = () => {
  const btn = document.getElementById('btn-theme-toggle');
  if (!btn) return;

  const savedTheme = localStorage.getItem('alexandria_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  btn.innerHTML = savedTheme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('alexandria_theme', next);
    btn.innerHTML = next === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    showToast(`Switched to ${next} mode`, 'info');
  });
};

const setupGlobalListeners = () => {
  // Navigation Links
  const navIds = [
    { id: 'nav-dashboard', view: 'dashboard' },
    { id: 'nav-books', view: 'books' },
    { id: 'nav-members', view: 'members' },
    { id: 'nav-circulation', view: 'circulation' },
    { id: 'nav-reservations', view: 'reservations' },
    { id: 'nav-settings', view: 'settings' }
  ];

  navIds.forEach(item => {
    const el = document.getElementById(item.id);
    if (el) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        switchView(item.view);
      });
    }
  });

  // Global Quick Search
  const globalSearch = document.getElementById('quick-search-input');
  if (globalSearch) {
    globalSearch.addEventListener('input', (e) => {
      const q = e.target.value.trim();
      const current = getState().currentView;
      if (current === 'books') {
        booksModule.handleBookSearch(q);
      } else if (current === 'members') {
        membersModule.handleMemberSearch(q);
      } else if (current === 'circulation') {
        circulationModule.handleCirculationSearch(q);
      } else if (current === 'reservations') {
        circulationModule.handleReservationSearch(q);
      } else {
        // If on dashboard or settings, navigate to books
        switchView('books');
        const bSearch = document.getElementById('book-search-input');
        if (bSearch) bSearch.value = q;
        booksModule.handleBookSearch(q);
      }
    });
  }

  // Dashboard Quick Action Buttons
  const btnQB = document.getElementById('btn-quick-borrow');
  if (btnQB) btnQB.onclick = (e) => { e.stopPropagation(); closeAllModals(); circulationModule.openIssueLoanModal(); };

  const btnQAB = document.getElementById('btn-quick-add-book');
  if (btnQAB) btnQAB.onclick = (e) => { e.stopPropagation(); closeAllModals(); booksModule.openAddBookModal(); };

  const btnQAM = document.getElementById('btn-quick-add-member');
  if (btnQAM) btnQAM.onclick = (e) => { e.stopPropagation(); closeAllModals(); membersModule.openAddMemberModal(); };

  // Books Toolbar Events
  const bookSearchInput = document.getElementById('book-search-input');
  if (bookSearchInput) {
    bookSearchInput.addEventListener('input', (e) => booksModule.handleBookSearch(e.target.value));
  }

  const bookGenreFilter = document.getElementById('book-genre-filter');
  if (bookGenreFilter) {
    bookGenreFilter.addEventListener('change', (e) => booksModule.handleGenreFilter(e.target.value));
  }

  const bookStatusFilter = document.getElementById('book-status-filter');
  if (bookStatusFilter) {
    bookStatusFilter.addEventListener('change', (e) => booksModule.handleStatusFilter(e.target.value));
  }

  const bookSortSelect = document.getElementById('book-sort-select');
  if (bookSortSelect) {
    bookSortSelect.addEventListener('change', (e) => booksModule.handleSortChange(e.target.value));
  }

  const btnOpenAddBook = document.getElementById('btn-open-add-book');
  if (btnOpenAddBook) {
    btnOpenAddBook.onclick = (e) => { e.stopPropagation(); closeAllModals(); booksModule.openAddBookModal(); };
  }

  const booksPrevBtn = document.getElementById('books-prev-page-btn');
  if (booksPrevBtn) booksPrevBtn.onclick = () => booksModule.handlePageChange(-1);

  const booksNextBtn = document.getElementById('books-next-page-btn');
  if (booksNextBtn) booksNextBtn.onclick = () => booksModule.handlePageChange(1);

  // Members Toolbar Events
  const memberSearchInput = document.getElementById('member-search-input');
  if (memberSearchInput) {
    memberSearchInput.addEventListener('input', (e) => membersModule.handleMemberSearch(e.target.value));
  }

  const memberStatusFilter = document.getElementById('member-status-filter');
  if (memberStatusFilter) {
    memberStatusFilter.addEventListener('change', (e) => membersModule.handleMemberStatusFilter(e.target.value));
  }

  const memberTypeFilter = document.getElementById('member-type-filter');
  if (memberTypeFilter) {
    memberTypeFilter.addEventListener('change', (e) => membersModule.handleMemberTypeFilter(e.target.value));
  }

  const btnOpenAddMember = document.getElementById('btn-open-add-member');
  if (btnOpenAddMember) {
    btnOpenAddMember.onclick = (e) => { e.stopPropagation(); closeAllModals(); membersModule.openAddMemberModal(); };
  }

  const membersPrevBtn = document.getElementById('members-prev-page-btn');
  if (membersPrevBtn) membersPrevBtn.onclick = () => membersModule.handleMemberPageChange(-1);

  const membersNextBtn = document.getElementById('members-next-page-btn');
  if (membersNextBtn) membersNextBtn.onclick = () => membersModule.handleMemberPageChange(1);

  // Circulation Events
  const circTabLoans = document.getElementById('circulation-tab-loans');
  if (circTabLoans) circTabLoans.onclick = () => circulationModule.switchCirculationTab('active');

  const circTabHistory = document.getElementById('circulation-tab-history');
  if (circTabHistory) circTabHistory.onclick = () => circulationModule.switchCirculationTab('history');

  const circSearchInput = document.getElementById('circulation-search-input');
  if (circSearchInput) {
    circSearchInput.addEventListener('input', (e) => circulationModule.handleCirculationSearch(e.target.value));
  }

  const circStatusFilter = document.getElementById('circulation-status-filter');
  if (circStatusFilter) {
    circStatusFilter.addEventListener('change', (e) => circulationModule.handleCirculationStatusFilter(e.target.value));
  }

  const btnOpenIssueLoan = document.getElementById('btn-open-issue-loan');
  if (btnOpenIssueLoan) btnOpenIssueLoan.onclick = (e) => { e.stopPropagation(); closeAllModals(); circulationModule.openIssueLoanModal(); };

  // Reservations Events
  const resSearchInput = document.getElementById('reservation-search-input');
  if (resSearchInput) {
    resSearchInput.addEventListener('input', (e) => circulationModule.handleReservationSearch(e.target.value));
  }

  const resStatusFilter = document.getElementById('reservation-status-filter');
  if (resStatusFilter) {
    resStatusFilter.addEventListener('change', (e) => circulationModule.handleReservationStatusFilter(e.target.value));
  }

  const btnOpenCreateRes = document.getElementById('btn-open-create-reservation');
  if (btnOpenCreateRes) btnOpenCreateRes.onclick = (e) => { e.stopPropagation(); closeAllModals(); circulationModule.openCreateReservationModal(); };

  // Settings Events
  const btnSaveSettings = document.getElementById('btn-save-settings');
  if (btnSaveSettings) btnSaveSettings.onclick = handleSaveSettings;

  const btnExport = document.getElementById('btn-export-json');
  if (btnExport) btnExport.onclick = () => exportDatabaseJSON();

  const btnTriggerImport = document.getElementById('btn-trigger-import');
  const inputImport = document.getElementById('input-import-json');
  if (btnTriggerImport && inputImport) {
    btnTriggerImport.onclick = () => inputImport.click();
    inputImport.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const ok = importDatabaseJSON(event.target.result);
        if (ok) {
          showToast('Database imported successfully!', 'success');
          switchView('dashboard');
        } else {
          showToast('Import failed. Invalid JSON structure.', 'error');
        }
      };
      reader.readAsText(file);
    };
  }

  const btnResetSeed = document.getElementById('btn-reset-sample-data');
  if (btnResetSeed) {
    btnResetSeed.onclick = () => {
      if (confirm('Are you sure you want to reset all data to default samples?')) {
        seedDatabase();
        showToast('Sample dataset restored successfully.', 'info');
        switchView('dashboard');
      }
    };
  }

  // Modal Cancel/Close buttons
  const bindClose = (btnId, modalId) => {
    const b = document.getElementById(btnId);
    if (b) b.onclick = (e) => { e.stopPropagation(); closeModal(modalId); };
  };

  bindClose('btn-cancel-book', 'modal-book-form');
  bindClose('btn-cancel-book-alt', 'modal-book-form');
  bindClose('btn-cancel-member', 'modal-member-form');
  bindClose('btn-cancel-member-x', 'modal-member-form');
  bindClose('btn-cancel-loan', 'modal-issue-loan');
  bindClose('btn-cancel-loan-x', 'modal-issue-loan');
  bindClose('btn-cancel-return', 'modal-return-loan');
  bindClose('btn-cancel-return-x', 'modal-return-loan');
  bindClose('btn-detail-close', 'modal-book-detail');
  bindClose('btn-detail-close-x', 'modal-book-detail');
  bindClose('btn-cancel-delete', 'modal-confirm-delete');
  bindClose('btn-cancel-delete-x', 'modal-confirm-delete');
  bindClose('btn-cancel-reservation', 'modal-create-reservation');
  bindClose('btn-cancel-reservation-x', 'modal-create-reservation');

  // Form Submits
  const formBook = document.getElementById('form-book');
  if (formBook) formBook.onsubmit = (e) => { e.preventDefault(); booksModule.handleSaveBook(e); };

  const formMember = document.getElementById('form-member');
  if (formMember) formMember.onsubmit = (e) => { e.preventDefault(); membersModule.handleSaveMember(e); };

  const formIssueLoan = document.getElementById('form-issue-loan');
  if (formIssueLoan) formIssueLoan.onsubmit = (e) => { e.preventDefault(); circulationModule.handleIssueLoanSubmit(e); };

  const formRes = document.getElementById('form-reservation');
  if (formRes) formRes.onsubmit = (e) => { e.preventDefault(); circulationModule.handleCreateReservationSubmit(e); };

  // Global ESC key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });
};

export const initApp = () => {
  const loaded = loadStoredState();
  if (!loaded || !getState().books || getState().books.length === 0) {
    seedDatabase();
  }

  setupDateTime();
  setupThemeToggle();
  setupGlobalListeners();

  // Render initial dashboard view
  switchView('dashboard');
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});
