/**
 * circulation.js - Issue loans, returns, renewals, late fines calculation, and reservations waitlist
 */

import { getState, setState, addActivity } from './state.js';
import { openModal, closeModal, escapeHtml, showToast, formatCurrency, formatDate } from './ui.js';

let currentReturnLoanId = null;

export const calculateOverdueFine = (loan, dailyRate) => {
  if (loan.status === 'returned' && loan.returnDate) {
    const returnTime = new Date(loan.returnDate).getTime();
    const dueTime = new Date(loan.dueDate).getTime();
    if (returnTime > dueTime) {
      const days = Math.ceil((returnTime - dueTime) / (1000 * 60 * 60 * 24));
      return { daysOverdue: days, fine: days * dailyRate };
    }
    return { daysOverdue: 0, fine: 0 };
  }

  const now = new Date();
  const due = new Date(loan.dueDate + 'T23:59:59');
  if (now > due) {
    const diffTime = now.getTime() - due.getTime();
    const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    return { daysOverdue: days, fine: days * dailyRate };
  }
  return { daysOverdue: 0, fine: 0 };
};

export const renderCirculationView = () => {
  const state = getState();
  const { search, status, tab } = state.filters.circulation;
  const dailyRate = state.settings.dailyFineRate || 0.50;

  // 1. Sync & compute overdue status dynamically
  const updatedLoans = state.loans.map(loan => {
    if (loan.status !== 'returned') {
      const { daysOverdue, fine } = calculateOverdueFine(loan, dailyRate);
      const isOverdue = daysOverdue > 0;
      return {
        ...loan,
        status: isOverdue ? 'overdue' : 'active',
        fineAmount: isOverdue ? fine : 0
      };
    }
    return loan;
  });

  // Filter based on tab (active vs history)
  let filtered = updatedLoans.filter(l => {
    if (tab === 'history') {
      return l.status === 'returned';
    } else {
      return l.status !== 'returned';
    }
  });

  // Filter based on status dropdown
  if (status !== 'all') {
    if (status === 'on-time') {
      filtered = filtered.filter(l => l.status === 'active');
    } else if (status === 'overdue') {
      filtered = filtered.filter(l => l.status === 'overdue');
    } else if (status === 'returned') {
      filtered = filtered.filter(l => l.status === 'returned');
    }
  }

  // Filter based on search query
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(l => 
      l.id.toLowerCase().includes(q) ||
      l.bookTitle.toLowerCase().includes(q) ||
      l.memberName.toLowerCase().includes(q)
    );
  }

  // Summary
  const countEl = document.getElementById('circulation-count-summary');
  if (countEl) {
    if (tab === 'history') {
      countEl.textContent = `Total ${filtered.length} returned loan records`;
    } else {
      const overdueCount = filtered.filter(l => l.status === 'overdue').length;
      countEl.textContent = `Active Loans: ${filtered.length} (Overdue: ${overdueCount})`;
    }
  }

  // Render Table
  const tbody = document.getElementById('loans-table-body');
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-muted" style="padding: 32px;">
          No loan records found for this view.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(l => {
    let statusBadge = '';
    if (l.status === 'returned') {
      statusBadge = `<span class="badge badge-secondary">RETURNED</span>`;
    } else if (l.status === 'overdue') {
      statusBadge = `<span class="badge badge-danger">OVERDUE (${formatCurrency(l.fineAmount)})</span>`;
    } else {
      statusBadge = `<span class="badge badge-success">ON TIME</span>`;
    }

    return `
      <tr data-id="${l.id}">
        <td><code>${escapeHtml(l.id)}</code></td>
        <td><strong>${escapeHtml(l.bookTitle)}</strong></td>
        <td>${escapeHtml(l.memberName)}</td>
        <td>${formatDate(l.issueDate)}</td>
        <td>
          <span style="${l.status === 'overdue' ? 'color: var(--danger-color); font-weight: 600;' : ''}">
            ${formatDate(l.dueDate)}
          </span>
          ${l.renewalCount > 0 ? `<span style="font-size: 10px; color: var(--text-muted); display: block;">Renewed: ${l.renewalCount}x</span>` : ''}
        </td>
        <td>${statusBadge}</td>
        <td>
          ${l.status !== 'returned' ? `
            <button class="btn btn-outline btn-sm" onclick="window.circulationModule.openReturnModal('${l.id}')">
              <i class="fa-solid fa-arrow-rotate-left"></i> Return / Renew
            </button>
          ` : `
            <span class="text-muted" style="font-size: 12px;">Returned ${formatDate(l.returnDate)}</span>
          `}
        </td>
      </tr>
    `;
  }).join('');
};

export const handleCirculationSearch = (query) => {
  setState(prev => ({
    filters: {
      ...prev.filters,
      circulation: { ...prev.filters.circulation, search: query }
    }
  }));
  renderCirculationView();
};

export const handleCirculationStatusFilter = (status) => {
  setState(prev => ({
    filters: {
      ...prev.filters,
      circulation: { ...prev.filters.circulation, status }
    }
  }));
  renderCirculationView();
};

export const switchCirculationTab = (tabName) => {
  setState(prev => ({
    filters: {
      ...prev.filters,
      circulation: { ...prev.filters.circulation, tab: tabName }
    }
  }));

  const tabLoans = document.getElementById('circulation-tab-loans');
  const tabHistory = document.getElementById('circulation-tab-history');

  if (tabLoans && tabHistory) {
    if (tabName === 'history') {
      tabLoans.classList.remove('active');
      tabHistory.classList.add('active');
    } else {
      tabLoans.classList.add('active');
      tabHistory.classList.remove('active');
    }
  }

  renderCirculationView();
};

export const openIssueLoanModal = (preselectedBookId) => {
  const state = getState();
  const memberSelect = document.getElementById('loan-select-member');
  const bookSelect = document.getElementById('loan-select-book');
  const issueDateInput = document.getElementById('loan-input-issue-date');
  const dueDateInput = document.getElementById('loan-input-due-date');

  // Populate Members
  memberSelect.innerHTML = '<option value="">-- Choose Member --</option>' + 
    state.members.map(m => {
      const isEligible = m.status === 'active' && m.currentBorrowedCount < (m.maxBooksLimit || 4);
      return `<option value="${m.id}" ${!isEligible ? 'disabled' : ''}>
        ${escapeHtml(m.name)} (${m.type}) - ${m.currentBorrowedCount}/${m.maxBooksLimit || 4} borrowed ${!isEligible ? `[${m.status.toUpperCase()}]` : ''}
      </option>`;
    }).join('');

  // Populate Books
  bookSelect.innerHTML = '<option value="">-- Choose Book --</option>' + 
    state.books.map(b => {
      const hasCopies = b.availableCopies > 0;
      return `<option value="${b.id}" ${b.id === preselectedBookId ? 'selected' : ''} ${!hasCopies ? 'disabled' : ''}>
        ${escapeHtml(b.title)} (${b.availableCopies} available)
      </option>`;
    }).join('');

  // Dates setup
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const loanDays = state.settings.defaultLoanPeriodDays || 14;
  const dueDate = new Date();
  dueDate.setDate(today.getDate() + loanDays);
  const dueStr = dueDate.toISOString().split('T')[0];

  issueDateInput.value = todayStr;
  dueDateInput.value = dueStr;

  // Listeners for previews
  const updateMemberPreview = () => {
    const memId = memberSelect.value;
    const mem = state.members.find(m => m.id === memId);
    const box = document.getElementById('loan-member-stats-preview');
    if (!mem) {
      box.textContent = "Select a member to view active loans and borrowing eligibility.";
      return;
    }
    const eligible = mem.status === 'active' && mem.currentBorrowedCount < (mem.maxBooksLimit || 4);
    box.innerHTML = `
      <div><strong>Status:</strong> <span class="badge ${mem.status === 'active' ? 'badge-success' : 'badge-danger'}">${mem.status.toUpperCase()}</span></div>
      <div><strong>Current Loans:</strong> ${mem.currentBorrowedCount} / Max ${mem.maxBooksLimit || 4} books</div>
      <div><strong>Outstanding Fines:</strong> ${formatCurrency(mem.outstandingFines)}</div>
      ${!eligible ? `<div class="text-danger mt-1"><strong>Cannot borrow:</strong> Member limit reached or account suspended/expired.</div>` : ''}
    `;
  };

  const updateBookPreview = () => {
    const bId = bookSelect.value;
    const b = state.books.find(x => x.id === bId);
    const box = document.getElementById('loan-book-copies-preview');
    if (!b) {
      box.textContent = "Select a book to check available shelf copies.";
      return;
    }
    box.innerHTML = `
      <div><strong>Available Copies:</strong> ${b.availableCopies} of ${b.totalCopies}</div>
      <div><strong>Shelf Location:</strong> ${escapeHtml(b.shelfLocation || 'N/A')}</div>
      ${b.availableCopies === 0 ? `<div class="text-danger mt-1">Cannot issue: No copies available. Place a reservation instead.</div>` : ''}
    `;
  };

  memberSelect.onchange = updateMemberPreview;
  bookSelect.onchange = updateBookPreview;

  updateMemberPreview();
  updateBookPreview();

  openModal('modal-issue-loan');
};

export const handleIssueLoanSubmit = (e) => {
  if (e) e.preventDefault();

  const state = getState();
  const memberId = document.getElementById('loan-select-member').value;
  const bookId = document.getElementById('loan-select-book').value;
  const issueDate = document.getElementById('loan-input-issue-date').value;
  const dueDate = document.getElementById('loan-input-due-date').value;

  if (!memberId || !bookId || !issueDate || !dueDate) {
    showToast('Please select both a valid member and book, and valid dates.', 'warning');
    return;
  }

  const member = state.members.find(m => m.id === memberId);
  const book = state.books.find(b => b.id === bookId);

  if (!member || !book) {
    showToast('Member or Book not found.', 'error');
    return;
  }

  if (member.status !== 'active') {
    showToast(`Member is ${member.status}. Cannot issue loan.`, 'error');
    return;
  }

  if (member.currentBorrowedCount >= (member.maxBooksLimit || 4)) {
    showToast(`Member has reached maximum loan limit (${member.maxBooksLimit}).`, 'error');
    return;
  }

  if (book.availableCopies <= 0) {
    showToast(`No copies available for "${book.title}".`, 'error');
    return;
  }

  // Create new Loan
  const newLoan = {
    id: 'l-' + Math.random().toString(36.25).substr(2, 7),
    bookId: book.id,
    bookTitle: book.title,
    memberId: member.id,
    memberName: member.name,
    issueDate,
    dueDate,
    returnDate: null,
    status: 'active',
    renewalCount: 0,
    fineAmount: 0.0,
    finePaid: false
  };

  // Update book and member
  const updatedBooks = state.books.map(b => b.id === book.id ? { ...b, availableCopies: b.availableCopies - 1 } : b);
  const updatedMembers = state.members.map(m => m.id === member.id ? { ...m, currentBorrowedCount: m.currentBorrowedCount + 1 } : m);
  const updatedLoans = [newLoan, ...state.loans];

  setState({
    books: updatedBooks,
    members: updatedMembers,
    loans: updatedLoans
  });

  addActivity('issue', `${member.name} borrowed "${book.title}"`);
  showToast(`Loan issued: "${book.title}" to ${member.name}`, 'success');

  closeModal('modal-issue-loan');
  renderCirculationView();
};

export const openReturnModal = (loanId) => {
  const state = getState();
  const loan = state.loans.find(l => l.id === loanId);
  if (!loan) return;

  currentReturnLoanId = loanId;
  const { daysOverdue, fine } = calculateOverdueFine(loan, state.settings.dailyFineRate || 0.50);

  document.getElementById('return-loan-id-hidden').value = loan.id;
  document.getElementById('return-book-title-display').textContent = loan.bookTitle;
  document.getElementById('return-member-name-display').textContent = loan.memberName;
  document.getElementById('return-due-date-display').textContent = formatDate(loan.dueDate);
  
  const overdueEl = document.getElementById('return-overdue-days-display');
  const fineEl = document.getElementById('return-fine-amount-display');
  const waiveCheck = document.getElementById('return-fine-waive-checkbox');

  if (daysOverdue > 0) {
    overdueEl.textContent = `${daysOverdue} day(s) overdue`;
    fineEl.textContent = formatCurrency(fine);
    waiveCheck.checked = false;
    document.getElementById('fine-waive-container').style.display = 'block';
  } else {
    overdueEl.textContent = 'None (On Time)';
    overdueEl.classList.remove('text-danger');
    overdueEl.classList.add('text-success');
    fineEl.textContent = '$0.00';
    document.getElementById('fine-waive-container').style.display = 'none';
  }

  // Hook button handlers
  const confirmReturnBtn = document.getElementById('btn-confirm-return');
  confirmReturnBtn.onclick = () => handleConfirmReturn();

  const confirmRenewBtn = document.getElementById('btn-confirm-renew');
  confirmRenewBtn.onclick = () => handleConfirmRenew();

  openModal('modal-return-loan');
};

const handleConfirmReturn = () => {
  if (!currentReturnLoanId) return;

  const state = getState();
  const loan = state.loans.find(l => l.id === currentReturnLoanId);
  if (!loan) return;

  const waiveFine = document.getElementById('return-fine-waive-checkbox').checked;
  const { fine } = calculateOverdueFine(loan, state.settings.dailyFineRate || 0.50);

  const returnDate = new Date().toISOString();

  // Update Loan
  const updatedLoans = state.loans.map(l => {
    if (l.id === currentReturnLoanId) {
      return {
        ...l,
        returnDate,
        status: 'returned',
        fineAmount: waiveFine ? 0 : fine,
        finePaid: waiveFine || fine === 0
      };
    }
    return l;
  });

  // Update Book: increment availableCopies (capped at totalCopies)
  const updatedBooks = state.books.map(b => {
    if (b.id === loan.bookId) {
      return { ...b, availableCopies: Math.min(b.totalCopies, b.availableCopies + 1) };
    }
    return b;
  });

  // Update Member: decrement currentBorrowedCount, increment fine if not waived
  const updatedMembers = state.members.map(m => {
    if (m.id === loan.memberId) {
      const fineToAdd = (!waiveFine && fine > 0) ? fine : 0;
      return {
        ...m,
        currentBorrowedCount: Math.max(0, m.currentBorrowedCount - 1),
        outstandingFines: m.outstandingFines + fineToAdd
      };
    }
    return m;
  });

  setState({
    loans: updatedLoans,
    books: updatedBooks,
    members: updatedMembers
  });

  addActivity('return', `${loan.memberName} returned "${loan.bookTitle}"`);
  showToast(`Book "${loan.bookTitle}" marked as returned!`, 'success');

  // Check Reservations Queue
  checkReservationsForReturnedBook(loan.bookId, loan.bookTitle);

  closeModal('modal-return-loan');
  currentReturnLoanId = null;
  renderCirculationView();
};

const handleConfirmRenew = () => {
  if (!currentReturnLoanId) return;

  const state = getState();
  const loan = state.loans.find(l => l.id === currentReturnLoanId);
  if (!loan) return;

  // Validation: cannot renew if already overdue
  const { daysOverdue } = calculateOverdueFine(loan, state.settings.dailyFineRate || 0.50);
  if (daysOverdue > 0) {
    showToast('Cannot renew overdue loan. Please return and settle unpaid fines.', 'error');
    return;
  }

  // Validation: cannot renew if someone is waiting on reservations
  const pendingReservations = state.reservations.filter(r => r.bookId === loan.bookId && r.status === 'pending');
  if (pendingReservations.length > 0) {
    showToast('Cannot renew: Other patrons are waiting in queue for this book!', 'warning');
    return;
  }

  const currentDue = new Date(loan.dueDate);
  const loanDays = state.settings.defaultLoanPeriodDays || 14;
  currentDue.setDate(currentDue.getDate() + loanDays);
  const newDueDate = currentDue.toISOString().split('T')[0];

  const updatedLoans = state.loans.map(l => {
    if (l.id === currentReturnLoanId) {
      return {
        ...l,
        dueDate: newDueDate,
        renewalCount: (l.renewalCount || 0) + 1
      };
    }
    return l;
  });

  setState({ loans: updatedLoans });
  addActivity('renew', `Loan renewed for "${loan.bookTitle}" to ${newDueDate}`);
  showToast(`Loan extended to ${newDueDate}`, 'success');

  closeModal('modal-return-loan');
  currentReturnLoanId = null;
  renderCirculationView();
};

const checkReservationsForReturnedBook = (bookId, bookTitle) => {
  const state = getState();
  const pending = state.reservations
    .filter(r => r.bookId === bookId && r.status === 'pending')
    .sort((a, b) => a.queuePosition - b.queuePosition);

  if (pending.length > 0) {
    const nextInQueue = pending[0];
    showToast(`Reservation notification: "${bookTitle}" is now ready for ${nextInQueue.memberName}!`, 'info');
    addActivity('reserve', `Waitlist notification: "${bookTitle}" available for ${nextInQueue.memberName}`);
  }
};

/* ==============================================================
   RESERVATIONS MODULE
============================================================== */

export const renderReservationsView = () => {
  const state = getState();
  const { search, status } = state.filters.reservations;

  let filtered = state.reservations.filter(r => {
    const matchesSearch = !search ||
      r.bookTitle.toLowerCase().includes(search.toLowerCase()) ||
      r.memberName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = status === 'all' || r.status === status;
    return matchesSearch && matchesStatus;
  });

  filtered.sort((a, b) => a.queuePosition - b.queuePosition);

  const countEl = document.getElementById('reservations-count-summary');
  if (countEl) {
    const pendingCount = filtered.filter(r => r.status === 'pending').length;
    countEl.textContent = `Total active reservations: ${pendingCount}`;
  }

  const tbody = document.getElementById('reservations-table-body');
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-muted" style="padding: 32px;">
          No reservations found.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(r => {
    let badgeClass = 'badge-warning';
    if (r.status === 'fulfilled') badgeClass = 'badge-success';
    if (r.status === 'cancelled') badgeClass = 'badge-secondary';

    return `
      <tr data-id="${r.id}">
        <td><strong style="font-size: 14px;">#${r.queuePosition}</strong></td>
        <td><strong>${escapeHtml(r.bookTitle)}</strong></td>
        <td>${escapeHtml(r.memberName)}</td>
        <td>${formatDate(r.reservedDate)}</td>
        <td><span class="badge ${badgeClass}">${escapeHtml(r.status.toUpperCase())}</span></td>
        <td>
          ${r.status === 'pending' ? `
            <button class="btn btn-primary btn-sm" onclick="window.circulationModule.fulfillReservation('${r.id}')" title="Issue to member">
              <i class="fa-solid fa-check"></i> Fulfill
            </button>
            <button class="btn btn-outline btn-sm" onclick="window.circulationModule.cancelReservation('${r.id}')" title="Cancel reservation">
              <i class="fa-solid fa-ban"></i> Cancel
            </button>
          ` : `
            <span class="text-muted" style="font-size: 12px;">Archived</span>
          `}
        </td>
      </tr>
    `;
  }).join('');
};

export const handleReservationSearch = (query) => {
  setState(prev => ({
    filters: {
      ...prev.filters,
      reservations: { ...prev.filters.reservations, search: query }
    }
  }));
  renderReservationsView();
};

export const handleReservationStatusFilter = (status) => {
  setState(prev => ({
    filters: {
      ...prev.filters,
      reservations: { ...prev.filters.reservations, status }
    }
  }));
  renderReservationsView();
};

export const openCreateReservationModal = (preselectedBookId) => {
  const state = getState();
  const memberSelect = document.getElementById('reservation-select-member');
  const bookSelect = document.getElementById('reservation-select-book');

  memberSelect.innerHTML = '<option value="">-- Choose Member --</option>' + 
    state.members.map(m => `<option value="${m.id}">${escapeHtml(m.name)} (${m.email})</option>`).join('');

  bookSelect.innerHTML = '<option value="">-- Choose Book --</option>' + 
    state.books.map(b => `<option value="${b.id}" ${b.id === preselectedBookId ? 'selected' : ''}>${escapeHtml(b.title)}</option>`).join('');

  openModal('modal-create-reservation');
};

export const handleCreateReservationSubmit = (e) => {
  if (e) e.preventDefault();

  const state = getState();
  const memberId = document.getElementById('reservation-select-member').value;
  const bookId = document.getElementById('reservation-select-book').value;

  if (!memberId || !bookId) {
    showToast('Please select both a member and a book.', 'warning');
    return;
  }

  const member = state.members.find(m => m.id === memberId);
  const book = state.books.find(b => b.id === bookId);

  // Check if member already reserved this book
  const existing = state.reservations.find(r => r.memberId === memberId && r.bookId === bookId && r.status === 'pending');
  if (existing) {
    showToast('This member is already on the waitlist for this book.', 'warning');
    return;
  }

  // Calculate queue position
  const existingQueue = state.reservations.filter(r => r.bookId === bookId && r.status === 'pending');
  const queuePosition = existingQueue.length + 1;

  const newReservation = {
    id: 'r-' + Math.random().toString(36.25).substr(2, 7),
    bookId: book.id,
    bookTitle: book.title,
    memberId: member.id,
    memberName: member.name,
    reservedDate: new Date().toISOString(),
    status: 'pending',
    queuePosition
  };

  setState({
    reservations: [...state.reservations, newReservation]
  });

  addActivity('reserve', `${member.name} joined waitlist for "${book.title}" (#${queuePosition})`);
  showToast(`Added to waitlist for "${book.title}" (Position #${queuePosition})`, 'success');

  closeModal('modal-create-reservation');
  renderReservationsView();
};

export const fulfillReservation = (reservationId) => {
  const state = getState();
  const reservation = state.reservations.find(r => r.id === reservationId);
  if (!reservation) return;

  const book = state.books.find(b => b.id === reservation.bookId);
  if (book && book.availableCopies <= 0) {
    showToast(`Cannot fulfill: No copies of "${book.title}" available on shelf right now.`, 'warning');
    return;
  }

  // Mark fulfilled
  const updatedReservations = state.reservations.map(r => {
    if (r.id === reservationId) return { ...r, status: 'fulfilled' };
    return r;
  });

  setState({ reservations: updatedReservations });
  addActivity('reserve', `Waitlist fulfilled for ${reservation.memberName} on "${reservation.bookTitle}"`);
  showToast(`Reservation fulfilled! Proceeding to issue loan...`, 'success');

  renderReservationsView();
  openIssueLoanModal(reservation.bookId);
};

export const cancelReservation = (reservationId) => {
  const state = getState();
  const reservation = state.reservations.find(r => r.id === reservationId);
  if (!reservation) return;

  const updatedReservations = state.reservations.map(r => {
    if (r.id === reservationId) return { ...r, status: 'cancelled' };
    return r;
  });

  // Re-adjust queue positions for remaining pending
  const bookId = reservation.bookId;
  let pos = 1;
  const resequenced = updatedReservations.map(r => {
    if (r.bookId === bookId && r.status === 'pending') {
      return { ...r, queuePosition: pos++ };
    }
    return r;
  });

  setState({ reservations: resequenced });
  showToast(`Reservation cancelled for "${reservation.bookTitle}".`, 'info');
  renderReservationsView();
};
