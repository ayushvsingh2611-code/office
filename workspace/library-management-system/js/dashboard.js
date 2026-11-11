/**
 * dashboard.js - Statistics calculation, KPIs, recent activity feed, analytics charts
 */

import { getState } from './state.js';
import { escapeHtml, formatCurrency } from './ui.js';
import { calculateOverdueFine } from './circulation.js';

export const computeMetrics = (state) => {
  const totalBooks = state.books.length;
  const availableCopies = state.books.reduce((acc, b) => acc + (b.availableCopies || 0), 0);
  
  const dailyRate = state.settings.dailyFineRate || 0.50;
  let activeLoans = 0;
  let overdueLoans = 0;
  let totalFines = state.members.reduce((acc, m) => acc + (m.outstandingFines || 0), 0);

  state.loans.forEach(loan => {
    if (loan.status !== 'returned') {
      activeLoans++;
      const { daysOverdue, fine } = calculateOverdueFine(loan, dailyRate);
      if (daysOverdue > 0) {
        overdueLoans++;
        totalFines += fine;
      }
    }
  });

  const totalMembers = state.members.length;

  return {
    totalBooks,
    availableCopies,
    activeLoans,
    overdueLoans,
    totalMembers,
    totalFines
  };
};

export const renderDashboard = () => {
  const state = getState();
  const metrics = computeMetrics(state);

  // Update KPI counters
  const setEl = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  setEl('kpi-total-books', metrics.totalBooks);
  setEl('kpi-available-copies', metrics.availableCopies);
  setEl('kpi-active-loans', metrics.activeLoans);
  setEl('kpi-overdue-loans', metrics.overdueLoans);
  setEl('kpi-total-members', metrics.totalMembers);
  setEl('kpi-total-fines', formatCurrency(metrics.totalFines));

  // Render Charts & Activity
  renderCharts(state);
  renderActivityFeed(state.activities);
};

export const renderCharts = (state) => {
  const container = document.getElementById('chart-category-distribution');
  if (!container) return;

  // Group books by genre
  const genreCounts = {};
  state.books.forEach(b => {
    genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1;
  });

  const totalBooks = state.books.length || 1;
  const genres = Object.keys(genreCounts).sort((a, b) => genreCounts[b] - genreCounts[a]);

  if (genres.length === 0) {
    container.innerHTML = `<p class="text-muted">No books in catalog.</p>`;
    return;
  }

  container.innerHTML = genres.map(genre => {
    const count = genreCounts[genre];
    const percentage = Math.round((count / totalBooks) * 100);
    return `
      <div class="chart-bar-row">
        <div class="chart-bar-meta">
          <span>${escapeHtml(genre)}</span>
          <span class="text-muted">${count} books (${percentage}%)</span>
        </div>
        <div class="chart-bar-track">
          <div class="chart-bar-fill" style="width: ${percentage}%"></div>
        </div>
      </div>
    `;
  }).join('');
};

export const renderActivityFeed = (activities = []) => {
  const listEl = document.getElementById('recent-activity-list');
  if (!listEl) return;

  if (activities.length === 0) {
    listEl.innerHTML = `<p class="text-muted text-center py-4">No recent library activity.</p>`;
    return;
  }

  listEl.innerHTML = activities.slice(0, 8).map(act => {
    let iconClass = 'fa-bolt';
    if (act.type === 'issue') iconClass = 'fa-hand-holding-hand';
    if (act.type === 'return') iconClass = 'fa-circle-check';
    if (act.type === 'renew') iconClass = 'fa-clock-rotate-left';
    if (act.type === 'reserve') iconClass = 'fa-bookmark';
    if (act.type === 'add_book') iconClass = 'fa-book';
    if (act.type === 'add_member') iconClass = 'fa-user-plus';

    const timeAgo = getTimeAgo(new Date(act.timestamp));

    return `
      <div class="activity-item">
        <div class="activity-icon">
          <i class="fa-solid ${iconClass}"></i>
        </div>
        <div class="activity-content">
          <div class="activity-text">${escapeHtml(act.description)}</div>
          <span class="activity-time">${timeAgo}</span>
        </div>
      </div>
    `;
  }).join('');
};

const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};
