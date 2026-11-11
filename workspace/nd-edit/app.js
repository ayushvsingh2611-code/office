// app.js - Usopp Backend Application Logic & Reactive State Engine
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. TOAST NOTIFICATION ENGINE ---
    window.phToast = function(message, type = 'success') {
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl font-sans text-xs transition-all duration-300 transform translate-y-4 opacity-0 ${
            type === 'success' ? 'bg-hive-card border-brand-500/40 text-slate-100' :
            type === 'error' ? 'bg-hive-card border-red-500/40 text-slate-100' :
            'bg-hive-card border-hive-border text-slate-200'
        }`;

        const iconClass = type === 'success' ? 'fa-solid fa-circle-check text-brand-400' :
                          type === 'error' ? 'fa-solid fa-triangle-exclamation text-red-400' :
                          'fa-solid fa-circle-info text-blue-400';

        toast.innerHTML = `
            <i class="${iconClass} text-sm"></i>
            <span class="font-medium">${message}</span>
        `;

        container.appendChild(toast);
        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-4', 'opacity-0');
        });

        setTimeout(() => {
            toast.classList.add('translate-y-4', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    };

    // --- 2. REACTIVE STATE & LOCALSTORAGE ENGINE ---
    const STORAGE_KEY = 'panda_hive_stream_state_v1';

    const defaultState = {
        streams: [
            { id: '1', title: 'Claude API Architecture & Advanced Prompt Caching', category: 'ai', viewers: 4250, host: 'Anthropic Dev Guild', hostAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80', thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80', tag: '#CLAUDE-API' },
            { id: '2', title: 'Frontend-Slides: Zero-Dependency Single File Presentation Workshop', category: 'design', viewers: 2810, host: 'Creative UI Design Lab', hostAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80', tag: '#FRONTEND-SLIDES' },
            { id: '3', title: 'DOCX Skill Automation: Programmatic Word Document Editing', category: 'dev', viewers: 1940, host: 'Document Engineering', hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80', tag: '#DOCX-SKILL' }
        ],
        slides: [
            { title: 'Zero-Dependency Frontend Slides', body: 'Built with pure HTML5, Tailwind CSS, and embedded JavaScript controllers. Instant visual storytelling without heavy framework bloat.', style: 'Cyberpunk Emerald' },
            { title: 'Anthropic Claude API & Prompt Caching', body: 'Maximize context window efficiency and minimize latency with prompt caching guidelines for production applications.', style: 'Neural Clean' },
            { title: 'DOCX Document Skill Automation', body: 'Programmatically create and edit Microsoft Word documents with rich formatting, comments, and tracked changes.', style: 'Enterprise Slate' }
        ],
        currentSlideIndex: 0,
        activeTab: 'streamTab',
        activeFilter: 'all',
        sortBy: 'viewers'
    };

    let appState = (() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : defaultState;
        } catch (e) {
            console.error('Failed to load state from localStorage', e);
            return defaultState;
        }
    })();

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
        } catch (e) {
            console.error('Failed to save state to localStorage', e);
        }
    }

    // --- 3. MODAL MANAGEMENT ENGINE ---
    function openModal(modalEl) {
        if (!modalEl) return;
        modalEl.classList.remove('hidden');
        modalEl.classList.remove('opacity-0', 'pointer-events-none');
        modalEl.classList.add('flex', 'opacity-100', 'pointer-events-auto');
        const card = modalEl.querySelector('div[class*="transform"]') || modalEl.querySelector('div[class*="bg-hive-card"]');
        if (card) {
            card.classList.remove('scale-95');
            card.classList.add('scale-100');
        }
    }

    function closeModal(modalEl) {
        if (!modalEl) return;
        const card = modalEl.querySelector('div[class*="transform"]') || modalEl.querySelector('div[class*="bg-hive-card"]');
        if (card) {
            card.classList.remove('scale-100');
            card.classList.add('scale-95');
        }
        modalEl.classList.remove('opacity-100', 'pointer-events-auto');
        modalEl.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => {
            modalEl.classList.remove('flex');
            modalEl.classList.add('hidden');
        }, 300);
    }

    // Ensure modals start fully hidden with pointer-events-none so they never block background clicks on load
    const uploadModal = document.getElementById('uploadModal');
    const playerModal = document.getElementById('playerModal');
    [uploadModal, playerModal].forEach(modal => {
        if (modal) {
            modal.classList.add('hidden', 'opacity-0', 'pointer-events-none');
            modal.classList.remove('flex', 'opacity-100', 'pointer-events-auto');
        }
    });

    // --- 4. NAVIGATION & TAB SWITCHING ---
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-target');
            if (!targetId) return;
            appState.activeTab = targetId;
            saveState();

            navTabs.forEach(t => {
                t.classList.remove('active', 'bg-brand-500/20', 'text-brand-400');
                t.classList.add('text-slate-400', 'hover:text-white', 'hover:bg-white/5');
            });
            tab.classList.add('active', 'bg-brand-500/20', 'text-brand-400');
            tab.classList.remove('text-slate-400', 'hover:text-white', 'hover:bg-white/5');

            tabContents.forEach(content => {
                if (content.id === targetId) {
                    content.classList.remove('hidden');
                } else {
                    content.classList.add('hidden');
                }
            });

            window.phToast(`Switched to view: ${tab.textContent.trim()}`, 'info');
        });
    });

    // --- 5. STREAM GRID RENDERING & FILTERING ---
    const streamGrid = document.getElementById('streamGrid');
    const streamFilters = document.querySelectorAll('.stream-filter');
    const streamSortSelect = document.getElementById('streamSortSelect');
    const globalSearchInput = document.getElementById('globalSearchInput');

    function attachStreamCardListeners() {
        document.querySelectorAll('.join-stream-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const streamId = e.currentTarget.getAttribute('data-id');
                const stream = appState.streams.find(s => s.id === streamId);
                window.phToast(`Connected to stream: "${stream ? stream.title : 'Live Broadcast'}"`, 'success');
                if (playerModal) openModal(playerModal);
            });
        });
    }

    function renderStreams() {
        if (!streamGrid) return;
        let filtered = appState.streams.filter(stream => {
            const matchesFilter = appState.activeFilter === 'all' || stream.category === appState.activeFilter;
            const query = (globalSearchInput ? globalSearchInput.value : '').toLowerCase();
            const matchesSearch = !query || stream.title.toLowerCase().includes(query) || stream.host.toLowerCase().includes(query) || stream.tag.toLowerCase().includes(query);
            return matchesFilter && matchesSearch;
        });

        // Sorting
        filtered.sort((a, b) => {
            if (appState.sortBy === 'viewers') return b.viewers - a.viewers;
            if (appState.sortBy === 'recent') return b.id.localeCompare(a.id);
            if (appState.sortBy === 'bitrate') return b.title.length - a.title.length;
            return 0;
        });

        if (filtered.length === 0) {
            streamGrid.innerHTML = `
                <div class="col-span-full py-12 text-center text-slate-400 flex flex-col items-center gap-3 bg-hive-card border border-hive-border rounded-2xl">
                    <i class="fa-solid fa-satellite-dish text-3xl text-brand-500 animate-pulse"></i>
                    <p class="font-semibold text-slate-200">No active streams found matching your criteria.</p>
                    <p class="text-xs text-slate-500">Try adjusting your search query or filter tags.</p>
                </div>
            `;
            return;
        }

        streamGrid.innerHTML = filtered.map(stream => `
            <div class="stream-card bg-hive-card border border-hive-border rounded-2xl overflow-hidden hover:border-brand-500/50 transition group flex flex-col" data-category="${stream.category}" data-viewers="${stream.viewers}">
                <div class="relative aspect-video overflow-hidden">
                    <img src="${stream.thumbnail}" alt="Stream Thumbnail" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                    <span class="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">LIVE</span>
                    <span class="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs font-mono px-2 py-1 rounded flex items-center gap-1.5">
                        <i class="fa-solid fa-users text-[10px] text-brand-400"></i> ${stream.viewers.toLocaleString()}
                    </span>
                </div>
                <div class="p-4 flex flex-col flex-1 justify-between gap-4">
                    <div class="flex items-start gap-3">
                        <img src="${stream.hostAvatar}" alt="Host" class="w-10 h-10 rounded-xl object-cover border border-hive-border">
                        <div>
                            <h3 class="font-bold text-slate-100 group-hover:text-brand-400 transition text-sm">${stream.title}</h3>
                            <p class="text-xs text-slate-400 mt-0.5">${stream.host}</p>
                        </div>
                    </div>
                    <div class="flex items-center justify-between border-t border-hive-border pt-3 text-xs text-slate-400">
                        <span class="font-mono text-brand-400">${stream.tag}</span>
                        <button class="join-stream-btn bg-brand-500/10 hover:bg-brand-500 text-brand-400 hover:text-white px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer" data-id="${stream.id}">Watch Stream</button>
                    </div>
                </div>
            </div>
        `).join('');

        attachStreamCardListeners();
    }

    streamFilters.forEach(filterBtn => {
        filterBtn.addEventListener('click', () => {
            streamFilters.forEach(b => {
                b.classList.remove('bg-brand-500', 'text-white');
                b.classList.add('bg-hive-card', 'text-slate-400');
            });
            filterBtn.classList.remove('bg-hive-card', 'text-slate-400');
            filterBtn.classList.add('bg-brand-500', 'text-white');

            appState.activeFilter = filterBtn.getAttribute('data-filter');
            saveState();
            renderStreams();
        });
    });

    if (streamSortSelect) {
        streamSortSelect.addEventListener('change', (e) => {
            appState.sortBy = e.target.value;
            saveState();
            renderStreams();
            window.phToast(`Sorted streams by: ${e.target.options[e.target.selectedIndex].text}`, 'info');
        });
    }

    if (globalSearchInput) {
        globalSearchInput.addEventListener('input', () => {
            renderStreams();
        });
    }

    // --- 6. FORM SUBMISSION & MODAL MANAGEMENT ---
    const openUploadModalBtn = document.getElementById('openUploadModalBtn');
    const closeUploadModalBtn = document.getElementById('closeUploadModalBtn');
    const cancelUploadBtn = document.getElementById('cancelUploadBtn');
    const submitStreamBtn = document.getElementById('submitStreamBtn');

    if (openUploadModalBtn && uploadModal) {
        openUploadModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(uploadModal);
        });
    }

    if (closeUploadModalBtn && uploadModal) {
        closeUploadModalBtn.addEventListener('click', () => closeModal(uploadModal));
    }

    if (cancelUploadBtn && uploadModal) {
        cancelUploadBtn.addEventListener('click', () => closeModal(uploadModal));
    }

    // Close modals on background backdrop click
    [uploadModal, playerModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal(modal);
            });
        }
    });

    if (submitStreamBtn) {
        submitStreamBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const titleInput = document.getElementById('newStreamTitle');
            const categorySelect = document.getElementById('newStreamCategory');

            const title = titleInput ? titleInput.value.trim() : '';
            const category = categorySelect ? categorySelect.value : 'ai';

            if (!title) {
                window.phToast('Please enter a valid stream title.', 'error');
                if (titleInput) titleInput.focus();
                return;
            }

            const newStream = {
                id: Date.now().toString(),
                title: title,
                category: category,
                viewers: Math.floor(Math.random() * 3000) + 500,
                host: 'JIT Command Operator',
                hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
                thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
                tag: '#JIT-LIVE'
            };

            appState.streams.unshift(newStream);
            saveState();
            renderStreams();
            if (uploadModal) closeModal(uploadModal);
            if (titleInput) titleInput.value = '';
            window.phToast('New broadcast successfully initiated and added to Hive!', 'success');
        });
    }

    // --- 7. SLIDES & CANVAS (HTML5 CANVAS PRESENTATION) ---
    const prevSlideBtn = document.getElementById('prevSlideBtn');
    const nextSlideBtn = document.getElementById('nextSlideBtn');
    const slideIndicator = document.getElementById('slideIndicator');
    const slidesCanvas = document.getElementById('slidesCanvas');

    function renderCanvasSlide() {
        if (!slidesCanvas) return;
        const ctx = slidesCanvas.getContext('2d');
        const slide = appState.slides[appState.currentSlideIndex];

        // Background
        ctx.fillStyle = '#0a0f0d';
        ctx.fillRect(0, 0, slidesCanvas.width, slidesCanvas.height);

        // Header accent bar
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(80, 80, 12, 60);

        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(slide.title, 110, 125);

        // Style badge
        ctx.fillStyle = '#121a15';
        ctx.strokeStyle = '#1e2922';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(80, 170, 200, 36, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 14px "JetBrains Mono", monospace';
        ctx.fillText(`Theme: ${slide.style}`, 96, 194);

        // Body text (wrapped)
        ctx.fillStyle = '#94a3b8';
        ctx.font = '20px "Plus Jakarta Sans", sans-serif';
        const words = slide.body.split(' ');
        let line = '';
        let y = 250;
        const maxWidth = 800;

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, 80, y);
                line = words[n] + ' ';
                y += 32;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, 80, y);

        // Footer indicator
        ctx.fillStyle = '#10b981';
        ctx.font = '14px "JetBrains Mono", monospace';
        ctx.fillText(`PandaStream Canvas Engine — Slide ${appState.currentSlideIndex + 1} of ${appState.slides.length}`, 80, 480);
    }

    function updateSlideDisplay() {
        renderCanvasSlide();
        if (slideIndicator) slideIndicator.textContent = `Slide ${appState.currentSlideIndex + 1} / ${appState.slides.length}`;
    }

    if (prevSlideBtn) {
        prevSlideBtn.addEventListener('click', () => {
            appState.currentSlideIndex = (appState.currentSlideIndex - 1 + appState.slides.length) % appState.slides.length;
            updateSlideDisplay();
            window.phToast(`Navigated to Slide ${appState.currentSlideIndex + 1}`, 'info');
        });
    }

    if (nextSlideBtn) {
        nextSlideBtn.addEventListener('click', () => {
            appState.currentSlideIndex = (appState.currentSlideIndex + 1) % appState.slides.length;
            updateSlideDisplay();
            window.phToast(`Navigated to Slide ${appState.currentSlideIndex + 1}`, 'info');
        });
    }

    document.addEventListener('keydown', (e) => {
        if (appState.activeTab === 'slidesTab') {
            if (e.key === 'ArrowLeft' && prevSlideBtn) prevSlideBtn.click();
            if (e.key === 'ArrowRight' && nextSlideBtn) nextSlideBtn.click();
        }
    });

    // --- 8. CLAUDE API & DOCX JIT GENERATOR ---
    const sendApiBtn = document.getElementById('sendApiBtn');
    const generateDocxBtn = document.getElementById('generateDocxBtn');
    const apiPromptInput = document.getElementById('apiPromptInput');
    const apiOutputBox = document.getElementById('apiOutputBox');

    if (sendApiBtn) {
        sendApiBtn.addEventListener('click', () => {
            const prompt = apiPromptInput ? apiPromptInput.value.trim() : '';
            if (apiOutputBox) {
                apiOutputBox.innerHTML = `// Sending request to Claude API v2.4...\n// Prompt: "${prompt || 'Default JIT Synthesis'}"\n\n[SUCCESS 200 OK] Response:\n{\n  "status": "success",\n  "model": "claude-3-5-sonnet-20241022",\n  "tokens_used": 142,\n  "inference_time_ms": 284,\n  "result": "JIT skill compiled successfully with active caching and zero latency overhead."\n}`;
            }
            window.phToast('Claude API inference executed successfully!', 'success');
        });
    }

    if (generateDocxBtn) {
        generateDocxBtn.addEventListener('click', () => {
            if (apiOutputBox) {
                apiOutputBox.innerHTML = `// Initializing DOCX Generator Skill...\n// Document: "PandaStream_JIT_Report.docx"\n\n[DOCX 200 OK] Generated successfully:\n- Headings & Paragraph Styles applied\n- Tracked Changes & Comments embedded\n- File ready for direct download (blob:application/vnd.openxmlformats-officedocument.wordprocessingml.document)`;
            }
            window.phToast('DOCX document generated & ready for export!', 'success');
        });
    }

    // --- 9. HERO & EXTRA CONTROLS ---
    const heroPlayBtn = document.getElementById('heroPlayBtn');
    const heroPipBtn = document.getElementById('heroPipBtn');
    const systemLogsBtn = document.getElementById('systemLogsBtn');
    const userMenuBtn = document.getElementById('userMenuBtn');

    if (heroPlayBtn) {
        heroPlayBtn.addEventListener('click', () => {
            window.phToast('Launching 4K 60FPS Neural Stream Player...', 'success');
            if (playerModal) openModal(playerModal);
        });
    }

    if (heroPipBtn) {
        heroPipBtn.addEventListener('click', () => {
            window.phToast('Picture-in-Picture mode activated successfully.', 'info');
        });
    }

    if (systemLogsBtn) {
        systemLogsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.phToast('JIT Protocol: DOCX, FRONTEND-SLIDES, CLAUDE-API loaded on demand.', 'info');
        });
    }

    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', () => {
            window.phToast('User Profile: Commander Usopp (JIT Lead Backend Engineer)', 'info');
        });
    }

    // Initial render & state sync
    renderStreams();
    updateSlideDisplay();

    console.log('[⚡ PANDA HIVE JIT ENGINE INITIALIZED]: All backend logic, state persistence, and event handlers active.');
});
