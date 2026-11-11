/**
 * ==========================================================
 * Alexandria LMS - Application Entry Point & Module Orchestrator
 * Straw Hat Crew GROUP 1
 * ==========================================================\n */

import { getState, setState, subscribe, createInitialState, addActivity } from './state.js';
import { seedStorageIfEmpty, exportJsonBackup, importJsonBackup } from './storage.js';
import {
  renderBooksView,
  handleBookSearch,
  handleGenreFilter,
  handleStatusFilter,
  handleSortChange,
  openAddBookModal,
  handleSaveBook
} from './books.js';
import {
  renderMembersView,
  handleMemberSearch,
  handleMemberStatusFilter,
  handleMemberTypeFilter,
  openAddMemberModal,
  handleSaveMember
} from './members.js';
import {
  renderCirculationView,
  handleCirculationSearch,
  handleCirculationStatusFilter,
  openIssueLoanModal,
  handleIssueLoan,
  handleConfirmReturn,
  handleRenewLoan
} from './circulation.js';
import {
  renderReservationsView,
  handleReservationSearch,
  handleReservationStatusFilter,
  openCreateReservationModal,
  handleCreateReservation
} from './reservations.js';
import { renderDashboard } from './dashboard.js';
import { showToast, openModal, closeModal, closeAllModals } from './ui.js';

/* ==========================================================\n   1. INITIALIZATION & ROUTING\n   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  seedStorageIfEmpty();
  initApp();
  setupGlobalListeners();
});

export function initApp() {
  // Initialize theme from stored settings
  const st = getState();
  applyTheme(st.settings.theme);

  // Initial render of current view
  switchView(st.currentView);
  startLiveClock();
}

export function switchView(viewName) {
  setState({ currentView: viewName });

  // Update sidebar active class
  document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
    if (link.dataset.view === viewName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Toggle view sections
  document.querySelectorAll('.view-section').forEach(sec => {
    sec.classList.remove('active');
  });

  const activeSec = document.getElementById(`view-${viewName}`);
  if (activeSec) {
    activeSec.classList.add('active');
  }

  // Render view-specific content
  switch (viewName) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'books':
      renderBooksView();
      break;
    case 'members':
      renderMembersView();
      break;
    case 'circulation':
      renderCirculationView();
      break;
    case 'reservations':
      renderReservationsView();
      break;
    case 'settings':
      renderSettingsView();
      break;
    default:
      renderDashboard();
  }
}

/* ==========================================================\n   2. GLOBAL EVENT LISTENERS\n   ========================================================== */
function setupGlobalListeners() {
  // Sidebar navigation links
  document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const view = link.dataset.view;
      if (view) switchView(view);
    });
  });

  // Global Quick Search (Top Bar)
  const quickSearch = document.getElementById('quick-search-input');
  if (quickSearch) {
    quickSearch.addEventListener('input', (e) => {
      const q = e.target.value.trim();
      const curView = getState().currentView;
      if (curView === 'books') {
        const bookSearch = document.getElementById('book-search-input');
        if (bookSearch) {
          bookSearch.value = q;
          handleBookSearch(q);
        }
      } else if (curView === 'members') {
        const memSearch = document.getElementById('member-search-input');
        if (memSearch) {
          memSearch.value = q;
          handleMemberSearch(q);
        }
      } else if (curView === 'circulation') {
        const circSearch = document.getElementById('circulation-search-input');
        if (circSearch) {
          circSearch.value = q;
          handleCirculationSearch(q);
        }
      } else {
        // Default to books catalog if on dashboard/settings
        if (q.length > 0) {
          switchView('books');
          const bookSearch = document.getElementById('book-search-input');
          if (bookSearch) {
            bookSearch.value = q;
            handleBookSearch(q);
          }
        }
      }
    });
  }

  // Keyboard shortcut '/' to focus global search, ESC to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      if (quickSearch) quickSearch.focus();
    }
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // Theme Toggle Button
  const themeBtn = document.getElementById('btn-theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }

  // Modal Close Buttons (delegated or direct)
  document.querySelectorAll('.modal-close-btn, [data-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const modalId = btn.getAttribute('data-modal') || btn.closest('.modal-backdrop')?.id;
      if (modalId) closeModal(modalId);
    });
  });

  // Backdrop click to close
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop.id);
      }
    });
  });

  // Dashboard Quick Action Buttons
  const btnQuickBorrow = document.getElementById('btn-quick-borrow');
  if (btnQuickBorrow) btnQuickBorrow.addEventListener('click', (e) => {
    e.stopPropagation();
    openIssueLoanModal();
  });

  const btnQuickAddBook = document.getElementById('btn-quick-add-book');
  if (btnQuickAddBook) btnQuickAddBook.addEventListener('click', (e) => {
    e.stopPropagation();
    switchView('books');
    openAddBookModal();
  });

  const btnQuickAddMember = document.getElementById('btn-quick-add-member');
  if (btnQuickAddMember) btnQuickAddMember.addEventListener('click', (e) => {
    e.stopPropagation();
    switchView('members');
    openAddMemberModal();
  });

  // ================= BOOKS VIEW LISTENERS =================
  const bookSearchInput = document.getElementById('book-search-input');
  if (bookSearchInput) bookSearchInput.addEventListener('input', (e) => handleBookSearch(e.target.value));

  const bookGenreFilter = document.getElementById('book-genre-filter');
  if (bookGenreFilter) bookGenreFilter.addEventListener('change', (e) => handleGenreFilter(e.target.value));

  const bookStatusFilter = document.getElementById('book-status-filter');
  if (bookStatusFilter) bookStatusFilter.addEventListener('change', (e) => handleStatusFilter(e.target.value));

  const bookSortSelect = document.getElementById('book-sort-select');
  if (bookSortSelect) bookSortSelect.addEventListener('change', (e) => handleSortChange(e.target.value));

  const btnOpenAddBook = document.getElementById('btn-open-add-book');
  if (btnOpenAddBook) btnOpenAddBook.addEventListener('click', (e) => {
    e.stopPropagation();
    openAddBookModal();
  });

  const formBook = document.getElementById('form-book');
  if (formBook) {
    formBook.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSaveBook();
    });
  }

  // ================= MEMBERS VIEW LISTENERS =================
  const memberSearchInput = document.getElementById('member-search-input');
  if (memberSearchInput) memberSearchInput.addEventListener('input', (e) => handleMemberSearch(e.target.value));

  const memberStatusFilter = document.getElementById('member-status-filter');
  if (memberStatusFilter) memberStatusFilter.addEventListener('change', (e) => handleMemberStatusFilter(e.target.value));

  const memberTypeFilter = document.getElementById('member-type-filter');
  if (memberTypeFilter) memberTypeFilter.addEventListener('change', (e) => handleMemberTypeFilter(e.target.value));

  const btnOpenAddMember = document.getElementById('btn-open-add-member');
  if (btnOpenAddMember) btnOpenAddMember.addEventListener('click', (e) => {
    e.stopPropagation();
    openAddMemberModal();
  });

  const formMember = document.getElementById('form-member');
  if (formMember) {
    formMember.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSaveMember();
    });
  }

  // ================= CIRCULATION VIEW LISTENERS =================
  const btnOpenIssueLoan = document.getElementById('btn-open-issue-loan');
  if (btnOpenIssueLoan) btnOpenIssueLoan.addEventListener('click', (e) => {
    e.stopPropagation();
    openIssueLoanModal();
  });

  const circSearchInput = document.getElementById('circulation-search-input');
  if (circSearchInput) circSearchInput.addEventListener('input', (e) => handleCirculationSearch(e.target.value));

  const circStatusFilter = document.getElementById('circulation-status-filter');
  if (circStatusFilter) circStatusFilter.addEventListener('change', (e) => handleCirculationStatusFilter(e.target.value));

  const formIssueLoan = document.getElementById('form-issue-loan');
  if (formIssueLoan) {
    formIssueLoan.addEventListener('submit', (e) => {
      e.preventDefault();
      handleIssueLoan();
    });
  }

  const btnConfirmReturn = document.getElementById('btn-confirm-return');
  if (btnConfirmReturn) {
    btnConfirmReturn.addEventListener('click', (e) => {
      e.stopPropagation();
      const loanId = document.getElementById('return-loan-id-hidden').value;
      const waiveFine = document.getElementById('return-fine-waive-checkbox').checked;
      handleConfirmReturn(loanId, waiveFine);
    });
  }

  const btnConfirmRenew = document.getElementById('btn-confirm-renew');
  if (btnConfirmRenew) {
    btnConfirmRenew.addEventListener('click', (e) => {
      e.stopPropagation();
      const loanId = document.getElementById('return-loan-id-hidden').value;
      handleRenewLoan(loanId);
    });
  }

  // ================= RESERVATIONS VIEW LISTENERS =================
  const btnOpenCreateReservation = document.getElementById('btn-open-create-reservation');
  if (btnOpenCreateReservation) btnOpenCreateReservation.addEventListener('click', (e) => {
    e.stopPropagation();
    openCreateReservationModal();
  });

  const resSearchInput = document.getElementById('reservation-search-input');
  if (resSearchInput) resSearchInput.addEventListener('input', (e) => handleReservationSearch(e.target.value));

  const resStatusFilter = document.getElementById('reservation-status-filter');
  if (resStatusFilter) resStatusFilter.addEventListener('change', (e) => handleReservationStatusFilter(e.target.value));

  const formCreateReservation = document.getElementById('form-create-reservation');
  if (formCreateReservation) {
    formCreateReservation.addEventListener('submit', (e) => {
      e.preventDefault();
      handleCreateReservation();
    });
  }

  // ================= SETTINGS VIEW LISTENERS =================
  const btnSaveSettings = document.getElementById('btn-save-settings');
  if (btnSaveSettings) {
    btnSaveSettings.addEventListener('click', (e) => {
      e.stopPropagation();
      handleSaveSettings();
    });
  }

  const btnExportJson = document.getElementById('btn-export-json');
  if (btnExportJson) btnExportJson.addEventListener('click', (e) => {
    e.stopPropagation();
    exportJsonBackup();
  });

  const btnTriggerImport = document.getElementById('btn-trigger-import');
  const inputImportJson = document.getElementById('input-import-json');
  if (btnTriggerImport && inputImportJson) {
    btnTriggerImport.addEventListener('click', (e) => {
      e.stopPropagation();
      inputImportJson.click();
    });
    inputImportJson.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        importJsonBackup(e.target.files[0]);
      }
    });
  }

  const btnResetSample = document.getElementById('btn-reset-sample-data');
  if (btnResetSample) {
    btnResetSample.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm('Are you sure you want to wipe current data and restore Straw Hat Crew seed dataset?')) {
        localStorage.clear();
        seedStorageIfEmpty();
        window.location.reload();
      }
    });
  }
}

/* ==========================================================\n   3. SETTINGS VIEW RENDERING & HANDLERS\n   ========================================================== */
function renderSettingsView() {
  const st = getState();
  const s = st.settings;

  setValueSafe('settings-library-name', s.libraryName);
  setValueSafe('settings-loan-period-days', s.defaultLoanPeriodDays);
  setValueSafe('settings-daily-fine-rate', s.dailyFineRate);
  setValueSafe('settings-max-books-limit', s.defaultMaxBooks);
}

function handleSaveSettings() {
  const libName = document.getElementById('settings-library-name').value.trim();
  const loanDays = parseInt(document.getElementById('settings-loan-period-days').value, 10);
  const fineRate = parseFloat(document.getElementById('settings-daily-fine-rate').value);
  const maxBooks = parseInt(document.getElementById('settings-max-books-limit').value, 10);

  if (!libName || isNaN(loanDays) || isNaN(fineRate) || isNaN(maxBooks)) {
    showToast('Please fill out all settings fields with valid values.', 'error');
    return;
  }

  const st = getState();
  setState({
    settings: {
      ...st.settings,
      libraryName: libName,
      defaultLoanPeriodDays: loanDays,
      dailyFineRate: fineRate,
      defaultMaxBooks: maxBooks
    }
  });

  addActivity('settings', 'Updated system operational parameters');
  showToast('Settings successfully updated and saved!', 'success');
}

/* ==========================================================\n   4. THEME & UTILITIES\n   ========================================================== */
function toggleTheme() {
  const st = getState();
  const newTheme = st.settings.theme === 'light' ? 'dark' : 'light';
  setState({
    settings: { ...st.settings, theme: newTheme }
  });
  applyTheme(newTheme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const themeBtn = document.getElementById('btn-theme-toggle');
  if (themeBtn) {
    themeBtn.innerHTML = theme === 'dark' ? '<i class=\"fa-solid fa-sun\"></i>' : '<i class=\"fa-solid fa-moon\"></i>';
  }
}

function startLiveClock() {
  const clockEl = document.getElementById('clock-text');
  if (!clockEl) return;

  const updateClock = () => {
    const now = new Date();
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    clockEl.textContent = now.toLocaleDateString('en-US', options);
  };
  updateClock();
  setInterval(updateClock, 1000);
}

function setValueSafe(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}
