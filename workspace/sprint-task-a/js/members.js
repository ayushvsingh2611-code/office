/**
 * members.js - Member management CRUD, search, status toggles, and detail views
 */

import { getState, setState, addActivity } from './state.js';
import { openModal, closeModal, escapeHtml, showToast, formatCurrency, formatDate } from './ui.js';

let memberToDeleteId = null;

export const renderMembersView = () => {
  const state = getState();
  const { search, status, type, page, limit } = state.filters.members;

  // 1. Filter
  let filtered = state.members.filter(m => {
    const matchesSearch = !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = status === 'all' || m.status === status;
    const matchesType = type === 'all' || m.type === type;

    return matchesSearch && matchesStatus && matchesType;
  });

  // 2. Paginate
  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / limit) || 1;
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const startIndex = (currentPage - 1) * limit;
  const paginatedMembers = filtered.slice(startIndex, startIndex + limit);

  // Update indicators
  const summaryEl = document.getElementById('members-count-summary');
  if (summaryEl) {
    summaryEl.textContent = `Showing ${paginatedMembers.length} of ${totalCount} members`;
  }

  const pageIndicator = document.getElementById('members-page-indicator');
  if (pageIndicator) {
    pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
  }

  const prevBtn = document.getElementById('members-prev-page-btn');
  const nextBtn = document.getElementById('members-next-page-btn');
  if (prevBtn) prevBtn.disabled = currentPage <= 1;
  if (nextBtn) nextBtn.disabled = currentPage >= totalPages;

  // Render Table Rows
  const tbody = document.getElementById('members-table-body');
  if (!tbody) return;

  if (paginatedMembers.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-muted" style="padding: 32px;">
          No members found matching the specified filters.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = paginatedMembers.map(m => {
    let statusBadgeClass = 'badge-secondary';
    if (m.status === 'active') statusBadgeClass = 'badge-success';
    else if (m.status === 'suspended') statusBadgeClass = 'badge-danger';
    else if (m.status === 'expired') statusBadgeClass = 'badge-warning';

    return `
      <tr data-id="${m.id}">
        <td>
          <strong>${escapeHtml(m.name)}</strong>
          <div style="font-size: 11px; color: var(--text-muted);">${escapeHtml(m.email)} &bull; ${escapeHtml(m.phone || 'No phone')}</div>
        </td>
        <td>
          <span class="badge badge-info">${escapeHtml(m.type.toUpperCase())}</span>
        </td>
        <td>
          <span class="badge ${statusBadgeClass}">${escapeHtml(m.status.toUpperCase())}</span>
        </td>
        <td>
          <strong>${m.currentBorrowedCount}</strong> / ${m.maxBooksLimit || 4}
        </td>
        <td>
          <span class="${m.outstandingFines > 0 ? 'text-danger font-bold' : 'text-muted'}">
            ${formatCurrency(m.outstandingFines)}
          </span>
        </td>
        <td>
          ${formatDate(m.joinedDate)}
        </td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button class="btn btn-outline btn-sm" onclick="window.membersModule.openEditMemberModal('${m.id}')" title="Edit Member">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn btn-outline btn-sm" onclick="window.membersModule.toggleMemberStatus('${m.id}')" title="Toggle Active/Suspended">
              <i class="fa-solid fa-power-off"></i>
            </button>
            <button class="btn btn-danger-outline btn-sm" onclick="window.membersModule.confirmDeleteMember('${m.id}')" title="Delete Member">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
};

export const handleMemberSearch = (query) => {
  setState(prev => ({
    filters: {
      ...prev.filters,
      members: { ...prev.filters.members, search: query, page: 1 }
    }
  }));
  renderMembersView();
};

export const handleMemberStatusFilter = (status) => {
  setState(prev => ({
    filters: {
      ...prev.filters,
      members: { ...prev.filters.members, status, page: 1 }
    }
  }));
  renderMembersView();
};

export const handleMemberTypeFilter = (type) => {
  setState(prev => ({
    filters: {
      ...prev.filters,
      members: { ...prev.filters.members, type, page: 1 }
    }
  }));
  renderMembersView();
};

export const handleMemberPageChange = (delta) => {
  const { page } = getState().filters.members;
  setState(prev => ({
    filters: {
      ...prev.filters,
      members: { ...prev.filters.members, page: Math.max(1, page + delta) }
    }
  }));
  renderMembersView();
};

export const openAddMemberModal = () => {
  const form = document.getElementById('form-member');
  if (form) form.reset();

  document.getElementById('modal-member-title').textContent = 'Add New Member';
  document.getElementById('member-id-hidden').value = '';
  document.getElementById('member-input-max-books').value = '4';
  openModal('modal-member-form');
};

export const openEditMemberModal = (memberId) => {
  const member = getState().members.find(m => m.id === memberId);
  if (!member) return;

  document.getElementById('modal-member-title').textContent = 'Edit Member';
  document.getElementById('member-id-hidden').value = member.id;
  document.getElementById('member-input-name').value = member.name;
  document.getElementById('member-input-email').value = member.email;
  document.getElementById('member-input-phone').value = member.phone || '';
  document.getElementById('member-input-type').value = member.type;
  document.getElementById('member-input-status').value = member.status;
  document.getElementById('member-input-max-books').value = member.maxBooksLimit || 4;

  openModal('modal-member-form');
};

export const handleSaveMember = (e) => {
  if (e) e.preventDefault();

  const id = document.getElementById('member-id-hidden').value;
  const name = document.getElementById('member-input-name').value.trim();
  const email = document.getElementById('member-input-email').value.trim();
  const phone = document.getElementById('member-input-phone').value.trim();
  const type = document.getElementById('member-input-type').value;
  const status = document.getElementById('member-input-status').value;
  const maxBooksLimit = parseInt(document.getElementById('member-input-max-books').value, 10) || 4;

  if (!name || !email) {
    showToast('Name and email are required.', 'warning');
    return false;
  }

  const { members } = getState();

  // Validate unique email
  const existingEmail = members.find(m => m.email.toLowerCase() === email.toLowerCase() && m.id !== id);
  if (existingEmail) {
    showToast('A member with this email address already exists.', 'error');
    return false;
  }

  if (id) {
    // Edit member
    const updatedMembers = members.map(m => {
      if (m.id === id) {
        return {
          ...m,
          name,
          email,
          phone,
          type,
          status,
          maxBooksLimit
        };
      }
      return m;
    });

    setState({ members: updatedMembers });
    addActivity('add_member', `Updated member account: ${name}`);
    showToast(`Member "${name}" successfully updated.`, 'success');
  } else {
    // New member
    const newMember = {
      id: 'm-' + Math.random().toString(36.25).substr(2, 7),
      name,
      email,
      phone,
      type,
      status,
      maxBooksLimit,
      currentBorrowedCount: 0,
      outstandingFines: 0.00,
      joinedDate: new Date().toISOString()
    };

    setState({ members: [newMember, ...members] });
    addActivity('add_member', `Registered new member: ${name} (${type})`);
    showToast(`New member "${name}" registered successfully.`, 'success');
  }

  closeModal('modal-member-form');
  renderMembersView();
  return true;
};

export const toggleMemberStatus = (memberId) => {
  const { members } = getState();
  const member = members.find(m => m.id === memberId);
  if (!member) return;

  const nextStatus = member.status === 'active' ? 'suspended' : 'active';
  const updatedMembers = members.map(m => m.id === memberId ? { ...m, status: nextStatus } : m);

  setState({ members: updatedMembers });
  showToast(`Member ${member.name} status updated to: ${nextStatus.toUpperCase()}`, 'info');
  renderMembersView();
};

export const confirmDeleteMember = (memberId) => {
  const { members } = getState();
  const member = members.find(m => m.id === memberId);
  if (!member) return;

  if (member.currentBorrowedCount > 0) {
    showToast(`Cannot delete member with ${member.currentBorrowedCount} active borrowed books!`, 'error');
    return;
  }

  if (member.outstandingFines > 0) {
    showToast(`Cannot delete member with unpaid fines: ${formatCurrency(member.outstandingFines)}`, 'error');
    return;
  }

  memberToDeleteId = memberId;
  document.getElementById('confirm-delete-title').textContent = 'Delete Member?';
  document.getElementById('confirm-delete-message').textContent = `Are you sure you want to delete member profile "${member.name}"?`;

  const confirmBtn = document.getElementById('btn-confirm-delete');
  confirmBtn.onclick = () => {
    handleDeleteMemberConfirmed();
  };

  openModal('modal-confirm-delete');
};

const handleDeleteMemberConfirmed = () => {
  if (!memberToDeleteId) return;
  const { members } = getState();
  const member = members.find(m => m.id === memberToDeleteId);

  const updatedMembers = members.filter(m => m.id !== memberToDeleteId);
  setState({ members: updatedMembers });

  if (member) {
    showToast(`Member "${member.name}" was removed.`, 'info');
  }

  closeModal('modal-confirm-delete');
  memberToDeleteId = null;
  renderMembersView();
};
