/**
 * ==========================================================
 * Alexandria LMS - Reservations & Waitlist Module
 * Straw Hat Crew GROUP 1
 * ==========================================================
 */

import { getState, setState, addActivity } from './state.js';
import { openModal, closeModal, showToast } from './ui.js';

export function renderReservationsView() {
  const st = getState();
  const f = st.filters.reservations;

  let result = [...st.reservations];

  if (f.search) {
    const q = f.search.toLowerCase();
    result = result.filter(r =>
      (r.bookTitle && r.bookTitle.toLowerCase().includes(q)) ||
      (r.memberName && r.memberName.toLowerCase().includes(q))
    );
  }

  if (f.status && f.status !== 'all') {
    result = result.filter(r => r.status === f.status);
  }

  const countSummary = document.getElementById('reservations-count-summary');
  if (countSummary) {
    countSummary.textContent = `Showing ${result.length} of ${st.reservations.length} reservations`;
  }

  const tbody = document.getElementById('reservations-table-body');
  if (!tbody) return;

  if (result.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-muted" style="padding: 30px;">
          <i class="fa-solid fa-bookmark" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
          No reservation requests found.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = result.map(r => {
    let statusBadge = '<span class="badge badge-warning">Pending</span>';
    if (r.status === 'fulfilled') statusBadge = '<span class="badge badge-success">Fulfilled</span>';
    if (r.status === 'cancelled') statusBadge = '<span class="badge badge-secondary">Cancelled</span>';

    return `
      <tr data-reservation-id="${r.id}">
        <td><strong>${escapeHtml(r.id)}</strong></td>
        <td>
          <div style="font-weight: 600;">${escapeHtml(r.bookTitle)}</div>
          <div class="text-muted" style="font-size: 11px;">Book ID: ${escapeHtml(r.bookId)}</div>
        </td>
        <td>
          <div style="font-weight: 600;">${escapeHtml(r.memberName)}</div>
          <div class="text-muted" style="font-size: 11px;">Member ID: ${escapeHtml(r.memberId)}</div>
        </td>
        <td>${escapeHtml(r.reservedDate ? r.reservedDate.slice(0, 10) : 'N/A')}</td>
        <td><strong>#${r.queuePosition || 1}</strong> in queue</td>
        <td>${statusBadge}</td>
        <td>
          ${r.status === 'pending' ? `
            <button class="btn btn-outline btn-sm text-danger" data-action="cancel-res" data-id="${r.id}" title="Cancel Reservation">
              <i class="fa-solid fa-xmark"></i> Cancel
            </button>
          ` : `
            <span class="text-muted small-text"><i class="fa-solid fa-check"></i> Processed</span>
          `}
        </td>
      </tr>
    `;
  }).join('');

  tbody.querySelectorAll('[data-action="cancel-res"]').forEach(btn => {
    btn.addEventListener('click', () => {
      cancelReservation(btn.dataset.id);
    });
  });
}

export function handleReservationSearch(query) {
  const st = getState();
  setState({
    filters: { ...st.filters, reservations: { ...st.filters.reservations, search: query } }
  });
  renderReservationsView();
}

export function handleReservationStatusFilter(status) {
  const st = getState();
  setState({
    filters: { ...st.filters, reservations: { ...st.filters.reservations, status } }
  });
  renderReservationsView();
}

export function openCreateReservationModal(preselectedBookId) {
  const st = getState();
  const memberSelect = document.getElementById('reservation-select-member');
  const bookSelect = document.getElementById('reservation-select-book');

  memberSelect.innerHTML = '<option value="">-- Choose Member --</option>' +
    st.members.map(m => `
      <option value="${m.id}" ${m.status !== 'active' ? 'disabled' : ''}>
        ${escapeHtml(m.name)} (${m.type}) - ${m.status !== 'active' ? '[' + m.status.toUpperCase() + ']' : 'Active'}
      </option>
    `).join('');

  bookSelect.innerHTML = '<option value="">-- Choose Book --</option>' +
    st.books.map(b => `
      <option value="${b.id}" ${b.id === preselectedBookId ? 'selected' : ''}>
        ${escapeHtml(b.title)} (${b.availableCopies} available)
      </option>
    `).join('');

  openModal('modal-create-reservation');
}

export function handleCreateReservation() {
  const memberId = document.getElementById('reservation-select-member').value;
  const bookId = document.getElementById('reservation-select-book').value;

  if (!memberId || !bookId) {
    showToast('Please select both a member and a book.', 'error');
    return;
  }

  const st = getState();
  const member = st.members.find(m => m.id === memberId);
  const book = st.books.find(b => b.id === bookId);

  if (!member || !book) {
    showToast('Invalid member or book selection.', 'error');
    return;
  }

  // Check duplicate active reservation
  const alreadyReserved = st.reservations.some(r => r.bookId === bookId && r.memberId === memberId && r.status === 'pending');
  if (alreadyReserved) {
    showToast(`${member.name} already has a pending reservation for this book.`, 'error');
    return;
  }

  // Calculate queue position
  const pendingForBook = st.reservations.filter(r => r.bookId === bookId && r.status === 'pending');
  const queuePos = pendingForBook.length + 1;

  const newRes = {
    id: 'r-' + Math.random().toString(36.25).substr(2, 8),
    bookId: book.id,
    bookTitle: book.title,
    memberId: member.id,
    memberName: member.name,
    reservedDate: new Date().toISOString(),
    status: 'pending',
    queuePosition: queuePos
  };

  setState({
    reservations: [newRes, ...st.reservations]
  });

  addActivity('reserve', `${member.name} placed hold on "${book.title}" (Queue #${queuePos})`);
  showToast(`Reservation successfully placed for ${member.name}! Position #${queuePos}`, 'success');

  closeModal('modal-create-reservation');
  renderReservationsView();
}

function cancelReservation(reservationId) {
  const st = getState();
  const res = st.reservations.find(r => r.id === reservationId);
  if (!res) return;

  const updatedReservations = st.reservations.map(r => r.id === reservationId ? { ...r, status: 'cancelled' } : r);
  setState({ reservations: updatedReservations });
  addActivity('cancel_reserve', `Cancelled reservation for "${res.bookTitle}" by ${res.memberName}`);
  showToast('Reservation cancelled.', 'info');
  renderReservationsView();
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
