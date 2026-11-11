/**
 * Canvas Learning Management System - Interactive Application Entry Point
 * Implements Priority #1 Pre-loaded Self-Contained Demo Data + Optional Online Enrichment
 */

document.addEventListener('DOMContentLoaded', () => {
  // ─── 1. Rich Self-Contained Demo Data (Priority #1) ───────────────────────────
  const DEFAULT_COURSES = [
    {
      id: 'cs101',
      code: 'CS 101',
      title: 'Full-Stack Web Engineering with React & Node',
      term: 'Fall 2026',
      instructor: 'Prof. Zoro',
      color: '#E11D48',
      enrolled: true,
      grade: 'A (94%)',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=300&fit=crop'
    },
    {
      id: 'cs204',
      code: 'CS 204',
      title: 'Distributed Systems & Cloud Architecture',
      term: 'Fall 2026',
      instructor: 'Prof. Robin',
      color: '#0EA5E9',
      enrolled: true,
      grade: 'A- (91%)',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=300&fit=crop'
    },
    {
      id: 'ds301',
      code: 'DS 301',
      title: 'Advanced Machine Learning & Neural Networks',
      term: 'Fall 2026',
      instructor: 'Dr. Franky',
      color: '#10B981',
      enrolled: true,
      grade: 'B+ (88%)',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=300&fit=crop'
    },
    {
      id: 'ux210',
      code: 'UX 210',
      title: 'Modern UI/UX Design Systems & Micro-Interactions',
      term: 'Fall 2026',
      instructor: 'Nami San',
      color: '#F59E0B',
      enrolled: true,
      grade: 'A+ (98%)',
      image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&h=300&fit=crop'
    }
  ];

  const DEFAULT_TODOS = [
    { id: 1, title: 'Submit Sprint 3: Cloud Microservices', course: 'CS 204', due: 'Tomorrow at 11:59 PM', points: '100 pts' },
    { id: 2, title: 'Peer Review: Design Systems Audit', course: 'UX 210', due: 'Nov 14 at 5:00 PM', points: '25 pts' },
    { id: 3, title: 'Quiz 4: Gradient Descent Optimizers', course: 'DS 301', due: 'Nov 16 at 2:00 PM', points: '50 pts' }
  ];

  const DEFAULT_FEEDBACK = [
    { id: 1, title: 'Project 2 Architecture Review', course: 'CS 101', score: '98/100', comment: 'Exceptional component separation and DOM contract compliance!' },
    { id: 2, title: 'Midterm Research Paper', course: 'DS 301', score: '92/100', comment: 'Solid mathematical proofs and thorough literature review.' }
  ];

  const DEFAULT_COMING_UP = [
    { id: 1, title: 'Live Coding Workshop: High-Velocity Agents', date: 'Tomorrow at 3:00 PM' },
    { id: 2, title: 'Faculty Q&A with Chief Architect', date: 'Friday at 11:00 AM' }
  ];

  // ─── 2. DOM Elements ────────────────────────────────────────────────────────
  const coursesGrid = document.getElementById('courses-grid');
  const todoList = document.getElementById('todo-list');
  const feedbackList = document.getElementById('recent-feedback-list');
  const comingUpList = document.getElementById('coming-up-list');
  const toastNotification = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');

  function showToast(msg) {
    if (!toastNotification || !toastMessage) return;
    toastMessage.textContent = msg;
    toastNotification.classList.remove('toast-hidden');
    toastNotification.classList.add('toast-visible');
    setTimeout(() => {
      toastNotification.classList.remove('toast-visible');
      toastNotification.classList.add('toast-hidden');
    }, 2800);
  }

  // ─── 3. Render Demo Data to DOM (Immediate, Self-Contained) ─────────────────
  function renderCourses(courses) {
    if (!coursesGrid) return;
    coursesGrid.innerHTML = courses.map((c) => `
      <div class="course-card" data-course-id="${c.id}" style="border-top: 4px solid ${c.color};">
        <div class="course-card-header" style="background-image: url('${c.image}'); background-size: cover; background-position: center; height: 130px; position: relative;">
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.7));"></div>
          <span style="position: absolute; bottom: 8px; left: 10px; color: #fff; font-size: 11px; font-weight: bold; background: rgba(0,0,0,0.5); padding: 2px 6px; border-radius: 3px;">${c.code}</span>
        </div>
        <div class="course-card-body" style="padding: 12px;">
          <h3 style="font-size: 14px; margin: 0 0 6px 0; color: #0F172A; line-height: 1.3;">${c.title}</h3>
          <p style="font-size: 11px; color: #64748B; margin: 0 0 8px 0;">Instructor: <strong>${c.instructor}</strong> · ${c.term}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
            <span style="color: #10B981; font-weight: 600;">Grade: ${c.grade}</span>
            <button class="course-enter-btn" style="padding: 4px 8px; font-size: 11px; background: ${c.color}; color: #fff; border: none; border-radius: 3px; cursor: pointer;">View Course</button>
          </div>
        </div>
      </div>
    `).join('');

    coursesGrid.querySelectorAll('.course-enter-btn').forEach((btn, idx) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        showToast(`Navigating to ${courses[idx].title}`);
      });
    });
  }

  function renderTodos(todos) {
    if (!todoList) return;
    todoList.innerHTML = todos.map((t) => `
      <li class="sidebar-item" style="padding: 8px 0; border-bottom: 1px solid #E2E8F0; list-style: none;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div style="font-size: 12px; font-weight: 600; color: #0F172A;">${t.title}</div>
            <div style="font-size: 11px; color: #64748B;">${t.course} · ${t.points}</div>
            <div style="font-size: 10px; color: #E11D48; margin-top: 2px;">Due: ${t.due}</div>
          </div>
          <button class="todo-dismiss-btn" data-todo-id="${t.id}" style="background: none; border: none; color: #94A3B8; cursor: pointer;" title="Dismiss">&times;</button>
        </div>
      </li>
    `).join('');

    todoList.querySelectorAll('.todo-dismiss-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const item = e.target.closest('li');
        item?.remove();
        showToast('Task marked as completed!');
      });
    });
  }

  function renderFeedback(feedbacks) {
    if (!feedbackList) return;
    feedbackList.innerHTML = feedbacks.map((f) => `
      <li class="sidebar-item" style="padding: 8px 0; border-bottom: 1px solid #E2E8F0; list-style: none;">
        <div style="font-size: 12px; font-weight: 600; color: #0F172A;">${f.title}</div>
        <div style="font-size: 11px; color: #64748B;">${f.course} · <strong style="color: #10B981;">Score: ${f.score}</strong></div>
        <div style="font-size: 11px; color: #334155; margin-top: 3px; font-style: italic;">"${f.comment}"</div>
      </li>
    `).join('');
  }

  function renderComingUp(events) {
    if (!comingUpList) return;
    comingUpList.innerHTML = events.map((ev) => `
      <li class="sidebar-item" style="padding: 6px 0; border-bottom: 1px solid #E2E8F0; list-style: none;">
        <div style="font-size: 12px; font-weight: 600; color: #0F172A;">${ev.title}</div>
        <div style="font-size: 11px; color: #0EA5E9;"><i class="fas fa-clock"></i> ${ev.date}</div>
      </li>
    `).join('');
  }

  // Initial render with local mock data (Works on double-click & Live Server!)
  renderCourses(DEFAULT_COURSES);
  renderTodos(DEFAULT_TODOS);
  renderFeedback(DEFAULT_FEEDBACK);
  renderComingUp(DEFAULT_COMING_UP);

  // ─── 4. Navigation tabs handling ───────────────────────────────────────────
  const navItems = document.querySelectorAll('.nav-items-group .nav-item');
  navItems.forEach((btn) => {
    btn.addEventListener('click', () => {
      navItems.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const label = btn.querySelector('.nav-label')?.textContent || 'Page';
      const breadcrumb = document.getElementById('breadcrumb-current');
      if (breadcrumb) breadcrumb.textContent = label;
      showToast(`Switched view to ${label}`);
    });
  });

  // ─── 5. Optional Online Enrichment (Non-blocking fallback) ─────────────────
  if (typeof window !== 'undefined' && window.navigator && window.navigator.onLine) {
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=2')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((onlineItems) => {
        if (Array.isArray(onlineItems) && onlineItems.length > 0) {
          console.log('[Canvas LMS] Online enrichment successful:', onlineItems);
        }
      })
      .catch(() => {
        // Silent fallback: local seed data is already working and complete
      });
  }
});
