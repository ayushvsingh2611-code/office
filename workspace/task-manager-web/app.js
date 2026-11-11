document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. STATE & LOCALSTORAGE PERSISTENCE ENGINE
    // ---------------------------------------------------------
    const STORAGE_KEY = 'taskflow_pro_db_v2';

    const defaultTasks = [
        {
            id: 'task-1',
            title: 'Design new landing page wireframes',
            description: 'Create high-fidelity wireframes for the upcoming marketing campaign using Figma.',
            status: 'in-progress',
            priority: 'high',
            category: 'Design',
            dueDate: '2025-10-15',
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
            id: 'task-2',
            title: 'Refactor backend database queries',
            description: 'Optimize Postgres indexing for user lookup tables to reduce API latency below 50ms.',
            status: 'pending',
            priority: 'high',
            category: 'Engineering',
            dueDate: '2025-10-12',
            createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
        },
        {
            id: 'task-3',
            title: 'Q3 Financial Audit & Expense Report',
            description: 'Review cloud infrastructure costs and SaaS subscriptions with the finance department.',
            status: 'completed',
            priority: 'medium',
            category: 'Finance',
            dueDate: '2025-10-08',
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
        },
        {
            id: 'task-4',
            title: 'Prepare product launch sync deck',
            description: 'Compile slides highlighting release features, QA signoffs, and deployment rollback plans.',
            status: 'pending',
            priority: 'low',
            category: 'Product',
            dueDate: '2025-10-20',
            createdAt: new Date().toISOString()
        }
    ];

    let appState = {
        tasks: [],
        filter: {
            status: 'all', 
            priority: 'all', 
            search: ''
        },
        sortBy: 'newest',
        currentEditingId: null
    };

    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                appState.tasks = JSON.parse(raw);
            } else {
                appState.tasks = defaultTasks;
                saveState();
            }
        } catch (err) {
            console.error('Error loading state from LocalStorage:', err);
            appState.tasks = defaultTasks;
        }
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(appState.tasks));
        } catch (err) {
            console.error('Error saving state to LocalStorage:', err);
        }
    }

    loadState();

    // ---------------------------------------------------------
    // 2. DOM ELEMENTS & CACHING (Synced with Franky's index.html)
    // ---------------------------------------------------------
    const tasksGrid = document.getElementById('tasks-grid');
    const emptyState = document.getElementById('empty-state');
    const taskModal = document.getElementById('task-modal');
    const taskForm = document.getElementById('task-form');
    const modalTitle = document.getElementById('modal-title');
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelModalBtn = document.getElementById('cancel-modal-btn');
    const globalSearch = document.getElementById('global-search');
    const filterPriority = document.getElementById('filter-priority');
    const sortBySelect = document.getElementById('sort-by');
    const taskCountLabel = document.getElementById('task-count-label');
    const clearStorageBtn = document.getElementById('clear-storage-btn');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');

    // Stats counter elements
    const statTotal = document.getElementById('stat-total');
    const statPending = document.getElementById('stat-pending');
    const statInProgress = document.getElementById('stat-in-progress');
    const statCompleted = document.getElementById('stat-completed');

    // Filter status tabs
    const filterTabs = document.querySelectorAll('.filter-tab');

    // ---------------------------------------------------------
    // 3. UI RENDERING & REACTIVE ENGINE
    // ---------------------------------------------------------
    function render() {
        renderStats();
        renderTasks();
    }

    function renderStats() {
        const tasks = appState.tasks;
        const total = tasks.length;
        const pending = tasks.filter(t => t.status === 'pending').length;
        const inProgress = tasks.filter(t => t.status === 'in-progress').length;
        const completed = tasks.filter(t => t.status === 'completed').length;

        if (statTotal) statTotal.textContent = total;
        if (statPending) statPending.textContent = pending;
        if (statInProgress) statInProgress.textContent = inProgress;
        if (statCompleted) statCompleted.textContent = completed;
    }

    function renderTasks() {
        if (!tasksGrid) return;

        // Apply filters
        let filtered = appState.tasks.filter(task => {
            const matchesStatus = appState.filter.status === 'all' || task.status === appState.filter.status;
            const matchesPriority = appState.filter.priority === 'all' || task.priority === appState.filter.priority;
            const matchesSearch = appState.filter.search === '' || 
                task.title.toLowerCase().includes(appState.filter.search.toLowerCase()) || 
                (task.description && task.description.toLowerCase().includes(appState.filter.search.toLowerCase()));

            return matchesStatus && matchesPriority && matchesSearch;
        });

        // Apply Sorting
        filtered.sort((a, b) => {
            if (appState.sortBy === 'newest') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (appState.sortBy === 'oldest') {
                return new Date(a.createdAt) - new Date(b.createdAt);
            } else if (appState.sortBy === 'priority') {
                const weight = { high: 3, medium: 2, low: 1 };
                return (weight[b.priority] || 0) - (weight[a.priority] || 0);
            } else if (appState.sortBy === 'dueDate') {
                return new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31');
            }
            return 0;
        });

        if (taskCountLabel) {
            taskCountLabel.textContent = `Showing ${filtered.length} task${filtered.length === 1 ? '' : 's'}`;
        }

        if (filtered.length === 0) {
            tasksGrid.innerHTML = '';
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        }

        if (emptyState) emptyState.classList.add('hidden');

        tasksGrid.innerHTML = filtered.map(task => {
            const isCompleted = task.status === 'completed';
            const priorityColors = {
                high: 'bg-red-500/10 text-red-400 border-red-500/20',
                medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                low: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
            };

            const statusColors = {
                completed: 'bg-green-500/10 text-green-400 border-green-500/20',
                'in-progress': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
                pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            };

            return `
                <div class="group relative bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 p-5 rounded-2xl transition-all duration-200 flex flex-col justify-between shadow-lg shadow-black/20">
                    <div>
                        <div class="flex items-start justify-between gap-3 mb-3">
                            <span class="px-2.5 py-1 rounded-lg text-xs font-semibold border uppercase ${priorityColors[task.priority] || priorityColors.medium}">
                                ${escapeHtml(task.priority)}
                            </span>
                            <div class="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                <button type="button" onclick="window.editTask('${task.id}')" class="p-1.5 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors" title="Edit Task">
                                    <i class="fa-solid fa-pen text-xs"></i>
                                </button>
                                <button type="button" onclick="window.deleteTask('${task.id}')" class="p-1.5 text-slate-400 hover:text-red-400 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors" title="Delete Task">
                                    <i class="fa-solid fa-trash text-xs"></i>
                                </button>
                            </div>
                        </div>

                        <h3 class="font-semibold text-white text-base mb-1.5 line-clamp-1 ${isCompleted ? 'line-through text-slate-400' : ''}">${escapeHtml(task.title)}</h3>
                        <p class="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">${escapeHtml(task.description || 'No description provided.')}</p>
                    </div>

                    <div class="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                        ${task.dueDate ? `<span class="flex items-center gap-1.5"><i class="fa-regular fa-calendar text-slate-500"></i> ${escapeHtml(task.dueDate)}</span>` : '<span></span>'}
                        <button type="button" onclick="window.toggleTaskStatus('${task.id}')" class="px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors capitalize ${statusColors[task.status] || statusColors.pending}">
                            ${escapeHtml(task.status.replace('-', ' '))}
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ---------------------------------------------------------
    // 4. MODAL & FORM CONTROLLER (Fixed visibility & hidden classes)
    // ---------------------------------------------------------
    function openModal(taskId = null) {
        if (!taskModal) return;
        appState.currentEditingId = taskId;
        
        const titleInput = document.getElementById('task-title');
        const descInput = document.getElementById('task-description');
        const statusSelect = document.getElementById('task-status');
        const prioritySelect = document.getElementById('task-priority');
        const dueDateInput = document.getElementById('task-due-date');

        if (taskId) {
            if (modalTitle) modalTitle.textContent = 'Edit Task';
            const task = appState.tasks.find(t => t.id === taskId);
            if (task) {
                if (titleInput) titleInput.value = task.title || '';
                if (descInput) descInput.value = task.description || '';
                if (statusSelect) statusSelect.value = task.status || 'pending';
                if (prioritySelect) prioritySelect.value = task.priority || 'medium';
                if (dueDateInput) dueDateInput.value = task.dueDate || '';
            }
        } else {
            if (modalTitle) modalTitle.textContent = 'Create New Task';
            if (taskForm) taskForm.reset();
            if (dueDateInput) {
                dueDateInput.value = new Date().toISOString().split('T')[0];
            }
        }

        // Align with Franky's modal classes: remove 'hidden' & opacity-0/pointer-events-none, add flex & opacity-100/pointer-events-auto
        taskModal.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
        taskModal.classList.add('flex', 'opacity-100', 'pointer-events-auto');
        
        const modalContent = taskModal.querySelector('div.bg-slate-900');
        if (modalContent) {
            modalContent.classList.remove('scale-95');
            modalContent.classList.add('scale-100');
        }
    }

    function closeModal() {
        if (!taskModal) return;
        
        const modalContent = taskModal.querySelector('div.bg-slate-900');
        if (modalContent) {
            modalContent.classList.remove('scale-100');
            modalContent.classList.add('scale-95');
        }

        taskModal.classList.remove('opacity-100', 'pointer-events-auto');
        taskModal.classList.add('opacity-0', 'pointer-events-none');
        
        // Hide completely after transition duration to avoid pointer event interception
        setTimeout(() => {
            if (taskModal.classList.contains('opacity-0')) {
                taskModal.classList.remove('flex');
                taskModal.classList.add('hidden');
            }
        }, 300);

        appState.currentEditingId = null;
        if (taskForm) taskForm.reset();
    }

    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => openModal(null));
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (cancelModalBtn) {
        cancelModalBtn.addEventListener('click', closeModal);
    }

    if (taskModal) {
        taskModal.addEventListener('click', (e) => {
            if (e.target === taskModal) {
                closeModal();
            }
        });
    }

    // Handle Form Submission
    if (taskForm) {
        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const titleInput = document.getElementById('task-title');
            const descInput = document.getElementById('task-description');
            const statusSelect = document.getElementById('task-status');
            const prioritySelect = document.getElementById('task-priority');
            const dueDateInput = document.getElementById('task-due-date');

            const taskData = {
                title: titleInput ? titleInput.value.trim() : '',
                description: descInput ? descInput.value.trim() : '',
                status: statusSelect ? statusSelect.value : 'pending',
                priority: prioritySelect ? prioritySelect.value : 'medium',
                dueDate: dueDateInput ? dueDateInput.value : new Date().toISOString().split('T')[0]
            };

            if (!taskData.title) {
                alert('Task title is required!');
                if (titleInput) titleInput.focus();
                return;
            }

            if (appState.currentEditingId) {
                appState.tasks = appState.tasks.map(t => {
                    if (t.id === appState.currentEditingId) {
                        return { ...t, ...taskData };
                    }
                    return t;
                });
            } else {
                const newTask = {
                    id: 'task-' + Date.now(),
                    ...taskData,
                    createdAt: new Date().toISOString()
                };
                appState.tasks.unshift(newTask);
            }

            saveState();
            render();
            closeModal();
        });
    }

    // ---------------------------------------------------------
    // 5. GLOBAL ACTIONS & EVENT HANDLERS
    // ---------------------------------------------------------
    window.editTask = function(id) {
        openModal(id);
    };

    window.deleteTask = function(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            appState.tasks = appState.tasks.filter(t => t.id !== id);
            saveState();
            render();
        }
    };

    window.toggleTaskStatus = function(id) {
        const task = appState.tasks.find(t => t.id === id);
        if (task) {
            const statuses = ['pending', 'in-progress', 'completed'];
            const currentIndex = statuses.indexOf(task.status);
            const nextIndex = (currentIndex + 1) % statuses.length;
            task.status = statuses[nextIndex];
            saveState();
            render();
        }
    };

    // ---------------------------------------------------------
    // 6. FILTERS, TABS & SEARCH EVENT LISTENERS
    // ---------------------------------------------------------
    if (globalSearch) {
        globalSearch.addEventListener('input', (e) => {
            appState.filter.search = e.target.value.trim();
            renderTasks();
        });
    }

    filterTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            filterTabs.forEach(t => {
                t.classList.remove('bg-green-500', 'text-slate-950');
                t.classList.add('text-slate-400', 'hover:text-white');
            });
            const btn = e.currentTarget;
            btn.classList.remove('text-slate-400', 'hover:text-white');
            btn.classList.add('bg-green-500', 'text-slate-950');

            appState.filter.status = btn.getAttribute('data-filter-status') || 'all';
            renderTasks();
        });
    });

    if (filterPriority) {
        filterPriority.addEventListener('change', (e) => {
            appState.filter.priority = e.target.value;
            renderTasks();
        });
    }

    if (sortBySelect) {
        sortBySelect.addEventListener('change', (e) => {
            appState.sortBy = e.target.value;
            renderTasks();
        });
    }

    if (clearStorageBtn) {
        clearStorageBtn.addEventListener('click', () => {
            if (confirm('Reset all tasks to default state?')) {
                localStorage.removeItem(STORAGE_KEY);
                loadState();
                render();
            }
        });
    }

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
        });
    }

    // Utility sanitizer function
    function escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    // Initial render call
    render();
});