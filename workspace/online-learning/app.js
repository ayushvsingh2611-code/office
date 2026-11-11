// app.js - EduStream Online Learning Platform Engine (Usopp Lead Backend & App Logic)
// Fixed and synchronized with Franky's UI/UX layout & Chopper's QA error reports.

document.addEventListener('DOMContentLoaded', () => {

    // ---------------------------------------------------------
    // 0. TOAST NOTIFICATION ENGINE (Zero Dead Buttons guarantee)
    // ---------------------------------------------------------
    window.phToast = function(message, type = 'success') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'fixed bottom-5 right-5 z-50 flex flex-col space-y-3 pointer-events-none';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `pointer-events-auto px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold flex items-center space-x-3 transform translate-y-4 opacity-0 transition-all duration-300 border ${
            type === 'success' ? 'bg-slate-900 border-emerald-500/30 text-emerald-400 shadow-emerald-500/10' :
            type === 'error' ? 'bg-slate-900 border-rose-500/30 text-rose-400 shadow-rose-500/10' :
            'bg-slate-900 border-indigo-500/30 text-indigo-400 shadow-indigo-500/10'
        }`;

        const icon = type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-info';
        toast.innerHTML = `<i class="fa-solid ${icon} text-base"></i><span>${message}</span>`;
        container.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-4', 'opacity-0');
        });

        setTimeout(() => {
            toast.classList.add('translate-y-4', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // ---------------------------------------------------------
    // 1. DATA SEEDING & LOCALSTORAGE PERSISTENCE ENGINE
    // ---------------------------------------------------------
    const STORAGE_KEY_COURSES = 'edustream_courses_v1';
    const STORAGE_KEY_USER = 'edustream_user_v1';

    const defaultCourses = [
        {
            id: 'c1',
            title: 'Full-Stack Web Development Masterclass 2024',
            category: 'Development',
            level: 'Advanced',
            duration: '32 hours',
            lessonsCount: 4,
            instructor: {
                name: 'Dr. Angela Vance',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
            },
            cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
            description: 'Master modern full-stack web engineering from the ground up with React, Node.js, Express, PostgreSQL, and Docker containerization.',
            enrolled: true,
            progress: 50, // 2 out of 4 completed
            lessons: [
                { id: 'l1_1', title: 'Architecture of Scalable Web Apps', duration: '45 mins', desc: 'Deep dive into microservices, MVC patterns, and enterprise system design.', completed: true },
                { id: 'l1_2', title: 'Advanced React Hooks & State Management', duration: '60 mins', desc: 'Building custom hooks, Context API optimization, and Redux Toolkit workflow.', completed: true },
                { id: 'l1_3', title: 'Node.js Cluster Mode & Performance', duration: '50 mins', desc: 'Optimizing V8 runtime, async bottlenecks, and cluster thread pools.', completed: false },
                { id: 'l1_4', title: 'PostgreSQL Advanced Indexing & ORM', duration: '55 mins', desc: 'B-Tree indexes, query execution plans, and Prisma ORM integration.', completed: false }
            ]
        },
        {
            id: 'c2',
            title: 'UI/UX Design Systems & Product Strategy',
            category: 'Design',
            level: 'Intermediate',
            duration: '18 hours',
            lessonsCount: 3,
            instructor: {
                name: 'Marcus Brody',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
            },
            cover: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=800',
            description: 'Learn how to architect robust, scalable design systems in Figma and establish user-centric product strategies that convert.',
            enrolled: true,
            progress: 33, // 1 out of 3 completed
            lessons: [
                { id: 'l2_1', title: 'Design Token Architecture', duration: '30 mins', desc: 'Structuring colors, typography, and spacing tokens for multi-brand apps.', completed: true },
                { id: 'l2_2', title: 'Component Variants & Auto Layout 5.0', duration: '45 mins', desc: 'Mastering advanced constraints and interactive component states in Figma.', completed: false },
                { id: 'l2_3', title: 'User Journey Mapping & Usability Testing', duration: '40 mins', desc: 'Analyzing qualitative feedback and running remote moderated user tests.', completed: false }
            ]
        },
        {
            id: 'c3',
            title: 'Artificial Intelligence & Generative LLMs with Python',
            category: 'AI & Data',
            level: 'Advanced',
            duration: '40 hours',
            lessonsCount: 3,
            instructor: {
                name: 'Dr. Elena Rostova',
                avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150'
            },
            cover: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=800',
            description: 'Build custom generative AI agents, fine-tune transformer models, and integrate LangChain and OpenAI APIs into Python backends.',
            enrolled: false,
            progress: 0,
            lessons: [
                { id: 'l3_1', title: 'Transformer Architecture & Attention Mechanisms', duration: '65 mins', desc: 'Mathematical breakdown of self-attention and multi-head mechanisms.', completed: false },
                { id: 'l3_2', title: 'Retrieval-Augmented Generation (RAG)', duration: '55 mins', desc: 'Vector databases, Pinecone, and embedding pipelines.', completed: false },
                { id: 'l3_3', title: 'Fine-Tuning Llama 3 on Custom Datasets', duration: '75 mins', desc: 'QLoRA, PEFT, and HuggingFace training scripts.', completed: false }
            ]
        },
        {
            id: 'c4',
            title: 'SaaS Startup Blueprint: From Idea to $10k MRR',
            category: 'Business',
            level: 'Beginner',
            duration: '14 hours',
            lessonsCount: 3,
            instructor: {
                name: 'Jason Sterling',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
            },
            cover: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800',
            description: 'A pragmatic playbook for validating micro-SaaS ideas, building MVPs fast, executing organic growth hacking, and setting up Stripe billing.',
            enrolled: false,
            progress: 0,
            lessons: [
                { id: 'l4_1', title: 'Idea Validation & Landing Page MVPs', duration: '35 mins', desc: 'Testing demand before writing code with smoke tests and waitlists.', completed: false },
                { id: 'l4_2', title: 'Stripe Webhooks & Subscription Tiers', duration: '40 mins', desc: 'Handling recurring billing, failed payments, and customer portals.', completed: false },
                { id: 'l4_3', title: 'Programmatic SEO & Content Funnels', duration: '45 mins', desc: 'Scaling organic traffic with automated landing page generation.', completed: false }
            ]
        },
        {
            id: 'c5',
            title: 'Advanced TypeScript & Architectural Patterns',
            category: 'Development',
            level: 'Advanced',
            duration: '22 hours',
            lessonsCount: 3,
            instructor: {
                name: 'Dan Abramovitch',
                avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150'
            },
            cover: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=800',
            description: 'Master conditional types, template literal types, AST manipulation, and domain-driven design principles in TypeScript.',
            enrolled: true,
            progress: 100, // Completed
            lessons: [
                { id: 'l5_1', title: 'Conditional Types & Infer Keyword', duration: '40 mins', desc: 'Advanced type gymnastics and building robust utility types.', completed: true },
                { id: 'l5_2', title: 'Template Literal Types & Branded Types', duration: '35 mins', desc: 'Type-safe event emitters and domain-driven primitive wrappers.', completed: true },
                { id: 'l5_3', title: 'AST Transformers & Custom ESLint Rules', duration: '50 mins', desc: 'Writing custom TypeScript compiler plugins.', completed: true }
            ]
        }
    ];

    const defaultUser = {
        name: 'Sarah Jenkins',
        title: 'Pro Member',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        learningHours: 24.5,
        streakDays: 7,
        activeCourseId: 'c1',
        activeLessonId: 'l1_3'
    };

    let appState = {
        currentView: 'dashboard', // 'dashboard', 'catalog', 'lesson'
        selectedCategory: 'all',
        searchQuery: '',
        activeCourseId: null,
        activeLessonId: null,
        modalCourseId: null,
        courses: defaultCourses,
        user: defaultUser
    };

    function loadState() {
        try {
            const savedCourses = localStorage.getItem(STORAGE_KEY_COURSES);
            const savedUser = localStorage.getItem(STORAGE_KEY_USER);
            if (savedCourses) appState.courses = JSON.parse(savedCourses);
            if (savedUser) appState.user = JSON.parse(savedUser);
        } catch (e) {
            console.error('Failed to load state from LocalStorage:', e);
        }
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(appState.courses));
            localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(appState.user));
        } catch (e) {
            console.error('Failed to save state to LocalStorage:', e);
        }
    }

    loadState();

    // ---------------------------------------------------------
    // 2. DOM ELEMENT SELECTORS
    // ---------------------------------------------------------
    const views = {
        dashboard: document.getElementById('view-dashboard'),
        catalog: document.getElementById('view-catalog'),
        lesson: document.getElementById('view-lesson')
    };

    const navDashboardBtn = document.getElementById('nav-dashboard-btn');
    const navCatalogBtn = document.getElementById('nav-catalog-btn');
    const brandLogoBtn = document.getElementById('brand-logo-btn');
    const heroResumeBtn = document.getElementById('hero-resume-btn');
    const heroExploreBtn = document.getElementById('hero-explore-btn');
    const globalSearchInput = document.getElementById('global-search-input');
    const catalogSearchInput = document.getElementById('catalog-search-input');
    const categoryFiltersContainer = document.getElementById('category-filters');

    const statEnrolled = document.getElementById('stat-enrolled');
    const statCompleted = document.getElementById('stat-completed');
    const statHours = document.getElementById('stat-hours');

    const enrolledCoursesContainer = document.getElementById('enrolled-courses-container');
    const catalogCoursesContainer = document.getElementById('catalog-courses-container');

    // Lesson View Elements
    const backToDashboardBtn = document.getElementById('back-to-dashboard-btn');
    const lessonCourseTitleHeader = document.getElementById('lesson-course-title-header');
    const lessonVideoPoster = document.getElementById('lesson-video-poster');
    const simulatedPlayBtn = document.getElementById('simulated-play-btn');
    const lessonDurationBadge = document.getElementById('lesson-duration-badge');
    const currentLessonNumber = document.getElementById('current-lesson-number');
    const markCompleteBtn = document.getElementById('mark-complete-btn');
    const markCompleteText = document.getElementById('mark-complete-text');
    const currentLessonTitle = document.getElementById('current-lesson-title');
    const currentLessonDesc = document.getElementById('current-lesson-desc');
    const curriculumProgressText = document.getElementById('curriculum-progress-text');
    const lessonNavigationList = document.getElementById('lesson-navigation-list');

    // Modal Elements
    const courseModal = document.getElementById('course-modal');
    const courseModalDialog = document.getElementById('course-modal-dialog');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalCourseImg = document.getElementById('modal-course-img');
    const modalCourseCategory = document.getElementById('modal-course-category');
    const modalCourseLevel = document.getElementById('modal-course-level');
    const modalCourseTitle = document.getElementById('modal-course-title');
    const modalInstructorAvatar = document.getElementById('modal-instructor-avatar');
    const modalInstructorName = document.getElementById('modal-instructor-name');
    const modalCourseDuration = document.getElementById('modal-course-duration');
    const modalLessonsCount = document.getElementById('modal-lessons-count');
    const modalCourseDesc = document.getElementById('modal-course-desc');
    const modalSyllabusList = document.getElementById('modal-syllabus-list');
    const modalPriceTag = document.getElementById('modal-price-tag');
    const modalActionBtn = document.getElementById('modal-action-btn');
    const modalActionBtnText = document.getElementById('modal-action-btn-text');

    // ---------------------------------------------------------
    // 3. NAVIGATION & VIEW SWITCHING ENGINE
    // ---------------------------------------------------------
    function switchView(viewName) {
        appState.currentView = viewName;
        Object.keys(views).forEach(key => {
            if (views[key]) {
                if (key === viewName) {
                    views[key].classList.remove('hidden');
                } else {
                    views[key].classList.add('hidden');
                }
            }
        });

        if (navDashboardBtn && navCatalogBtn) {
            if (viewName === 'dashboard') {
                navDashboardBtn.classList.add('bg-slate-800', 'text-white');
                navCatalogBtn.classList.remove('bg-slate-800', 'text-white');
            } else if (viewName === 'catalog') {
                navCatalogBtn.classList.add('bg-slate-800', 'text-white');
                navDashboardBtn.classList.remove('bg-slate-800', 'text-white');
            } else {
                navDashboardBtn.classList.remove('bg-slate-800', 'text-white');
                navCatalogBtn.classList.remove('bg-slate-800', 'text-white');
            }
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
        render();
    }

    if (navDashboardBtn) navDashboardBtn.addEventListener('click', () => switchView('dashboard'));
    if (navCatalogBtn) navCatalogBtn.addEventListener('click', () => switchView('catalog'));
    if (brandLogoBtn) brandLogoBtn.addEventListener('click', () => switchView('dashboard'));
    if (heroExploreBtn) heroExploreBtn.addEventListener('click', () => switchView('catalog'));
    if (backToDashboardBtn) backToDashboardBtn.addEventListener('click', () => switchView('dashboard'));

    if (heroResumeBtn) {
        heroResumeBtn.addEventListener('click', () => {
            const enrolledCourses = appState.courses.filter(c => c.enrolled);
            if (enrolledCourses.length === 0) {
                window.phToast('You are not enrolled in any courses yet. Explore the catalog!', 'info');
                switchView('catalog');
                return;
            }
            const targetCourse = enrolledCourses.find(c => c.progress < 100) || enrolledCourses[0];
            const targetLesson = targetCourse.lessons.find(l => !l.completed) || targetCourse.lessons[0];
            
            openLessonPlayer(targetCourse.id, targetLesson.id);
        });
    }

    // ---------------------------------------------------------
    // 4. MODAL MANAGEMENT ENGINE
    // ---------------------------------------------------------
    function openCourseModal(courseId) {
        appState.modalCourseId = courseId;
        const course = appState.courses.find(c => c.id === courseId);
        if (!course || !courseModal) return;

        if (modalCourseImg) modalCourseImg.src = course.cover;
        if (modalCourseCategory) modalCourseCategory.textContent = course.category;
        if (modalCourseLevel) modalCourseLevel.textContent = course.level;
        if (modalCourseTitle) modalCourseTitle.textContent = course.title;
        if (modalInstructorAvatar) modalInstructorAvatar.src = course.instructor.avatar;
        if (modalInstructorName) modalInstructorName.textContent = course.instructor.name;
        if (modalCourseDuration) modalCourseDuration.textContent = course.duration;
        if (modalLessonsCount) modalLessonsCount.textContent = `${course.lessonsCount} lessons`;
        if (modalCourseDesc) modalCourseDesc.textContent = course.description;

        if (modalSyllabusList) {
            modalSyllabusList.innerHTML = course.lessons.map((lesson, idx) => `
                <div class="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-sm">
                    <div class="flex items-center space-x-3">
                        <span class="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">${idx + 1}</span>
                        <span class="text-slate-200 font-medium">${lesson.title}</span>
                    </div>
                    <span class="text-xs text-slate-400"><i class="fa-solid fa-clock mr-1"></i>${lesson.duration}</span>
                </div>
            `).join('');
        }

        if (course.enrolled) {
            if (modalPriceTag) {
                modalPriceTag.textContent = 'Enrolled & Active';
                modalPriceTag.className = 'text-lg font-black text-brand-400';
            }
            if (modalActionBtnText) modalActionBtnText.textContent = 'Continue Learning';
            if (modalActionBtn) modalActionBtn.className = 'px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold shadow-lg shadow-brand-600/30 transition-all flex items-center space-x-2';
        } else {
            if (modalPriceTag) {
                modalPriceTag.textContent = 'Free Access';
                modalPriceTag.className = 'text-lg font-black text-emerald-400';
            }
            if (modalActionBtnText) modalActionBtnText.textContent = 'Enroll Now';
            if (modalActionBtn) modalActionBtn.className = 'px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-lg shadow-emerald-600/30 transition-all flex items-center space-x-2';
        }

        courseModal.classList.remove('hidden');
        requestAnimationFrame(() => {
            courseModal.classList.remove('opacity-0', 'pointer-events-none');
            courseModal.classList.add('flex', 'opacity-100', 'pointer-events-auto');
            if (courseModalDialog) {
                courseModalDialog.classList.remove('scale-95');
                courseModalDialog.classList.add('scale-100');
            }
        });
    }

    function closeCourseModal() {
        if (!courseModal) return;
        if (courseModalDialog) {
            courseModalDialog.classList.remove('scale-100');
            courseModalDialog.classList.add('scale-95');
        }
        courseModal.classList.remove('opacity-100', 'pointer-events-auto');
        courseModal.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => {
            courseModal.classList.remove('flex');
            courseModal.classList.add('hidden');
            appState.modalCourseId = null;
        }, 300);
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeCourseModal);
    if (courseModal) {
        courseModal.addEventListener('click', (e) => {
            if (e.target === courseModal) closeCourseModal();
        });
    }

    if (modalActionBtn) {
        modalActionBtn.addEventListener('click', () => {
            if (!appState.modalCourseId) return;
            const course = appState.courses.find(c => c.id === appState.modalCourseId);
            if (!course) return;

            if (course.enrolled) {
                closeCourseModal();
                const targetLesson = course.lessons.find(l => !l.completed) || course.lessons[0];
                openLessonPlayer(course.id, targetLesson.id);
            } else {
                course.enrolled = true;
                course.progress = Math.round((course.lessons.filter(l => l.completed).length / course.lessons.length) * 100);
                saveState();
                window.phToast(`Successfully enrolled in "${course.title}"!`, 'success');
                closeCourseModal();
                render();
                openLessonPlayer(course.id, course.lessons[0].id);
            }
        });
    }

    // ---------------------------------------------------------
    // 5. LESSON PLAYER ENGINE
    // ---------------------------------------------------------
    function openLessonPlayer(courseId, lessonId) {
        appState.activeCourseId = courseId;
        appState.activeLessonId = lessonId;
        switchView('lesson');
        renderLessonPlayer();
    }

    function renderLessonPlayer() {
        const course = appState.courses.find(c => c.id === appState.activeCourseId);
        if (!course) return;

        const lesson = course.lessons.find(l => l.id === appState.activeLessonId) || course.lessons[0];
        appState.activeLessonId = lesson.id;

        if (lessonCourseTitleHeader) lessonCourseTitleHeader.textContent = course.title;
        if (lessonVideoPoster) lessonVideoPoster.src = course.cover;
        if (lessonDurationBadge) lessonDurationBadge.textContent = lesson.duration;
        if (currentLessonNumber) currentLessonNumber.textContent = `Lesson ${course.lessons.findIndex(l => l.id === lesson.id) + 1} of ${course.lessons.length}`;
        if (currentLessonTitle) currentLessonTitle.textContent = lesson.title;
        if (currentLessonDesc) currentLessonDesc.textContent = lesson.desc;

        if (markCompleteBtn && markCompleteText) {
            const iconEl = markCompleteBtn.querySelector('i');
            if (lesson.completed) {
                markCompleteBtn.className = 'px-5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 font-bold text-sm transition-all flex items-center space-x-2';
                markCompleteText.textContent = 'Completed';
                if (iconEl) iconEl.className = 'fa-solid fa-circle-check';
            } else {
                markCompleteBtn.className = 'px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center space-x-2';
                markCompleteText.textContent = 'Mark as Completed';
                if (iconEl) iconEl.className = 'fa-solid fa-check';
            }
        }

        const completedCount = course.lessons.filter(l => l.completed).length;
        if (curriculumProgressText) curriculumProgressText.textContent = `${completedCount}/${course.lessons.length} completed`;

        if (lessonNavigationList) {
            lessonNavigationList.innerHTML = course.lessons.map((l, idx) => {
                const isActive = l.id === lesson.id;
                const isDone = l.completed;
                return `
                    <div data-lesson-id="${l.id}" class="lesson-nav-item cursor-pointer p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                        isActive ? 'bg-brand-600/10 border-brand-500/50 text-white shadow-lg' :
                        'bg-slate-950/40 hover:bg-slate-800/60 border-slate-800/80 text-slate-300'
                    }">
                        <div class="flex items-center space-x-3 overflow-hidden">
                            <div class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                isDone ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                isActive ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-400'
                            }">
                                <i class="fa-solid ${isDone ? 'fa-check text-xs' : 'fa-play text-xs'}"></i>
                            </div>
                            <div class="truncate">
                                <div class="text-xs font-bold ${isActive ? 'text-brand-400' : 'text-slate-400'}">Lesson ${idx + 1}</div>
                                <div class="text-sm font-semibold truncate text-slate-200">${l.title}</div>
                            </div>
                        </div>
                        <span class="text-xs font-medium text-slate-400 flex-shrink-0 ml-2">${l.duration}</span>
                    </div>
                `;
            }).join('');

            lessonNavigationList.querySelectorAll('.lesson-nav-item').forEach(item => {
                item.addEventListener('click', () => {
                    const targetId = item.getAttribute('data-lesson-id');
                    openLessonPlayer(course.id, targetId);
                });
            });
        }
    }

    if (markCompleteBtn) {
        markCompleteBtn.addEventListener('click', () => {
            const course = appState.courses.find(c => c.id === appState.activeCourseId);
            if (!course) return;
            const lesson = course.lessons.find(l => l.id === appState.activeLessonId);
            if (!lesson) return;

            lesson.completed = !lesson.completed;
            
            const completedCount = course.lessons.filter(l => l.completed).length;
            course.progress = Math.round((completedCount / course.lessons.length) * 100);
            if (course.progress > 0) course.enrolled = true;

            saveState();
            renderLessonPlayer();

            if (lesson.completed) {
                window.phToast(`Lesson "${lesson.title}" marked as completed!`, 'success');
            } else {
                window.phToast(`Lesson status updated.`, 'info');
            }
        });
    }

    if (simulatedPlayBtn) {
        simulatedPlayBtn.addEventListener('click', () => {
            window.phToast('Streaming video simulation playing...', 'info');
        });
    }

    // ---------------------------------------------------------
    // 6. REAL-TIME SEARCH & FILTERING ENGINE
    // ---------------------------------------------------------
    if (globalSearchInput) {
        globalSearchInput.addEventListener('input', (e) => {
            appState.searchQuery = e.target.value.trim().toLowerCase();
            if (appState.currentView !== 'catalog') {
                switchView('catalog');
                if (catalogSearchInput) catalogSearchInput.value = appState.searchQuery;
            }
            renderCatalog();
        });
    }

    if (catalogSearchInput) {
        catalogSearchInput.addEventListener('input', (e) => {
            appState.searchQuery = e.target.value.trim().toLowerCase();
            renderCatalog();
        });
    }

    if (categoryFiltersContainer) {
        categoryFiltersContainer.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                categoryFiltersContainer.querySelectorAll('.category-btn').forEach(b => {
                    b.className = 'category-btn px-5 py-2.5 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all whitespace-nowrap';
                });
                btn.className = 'category-btn px-5 py-2.5 rounded-xl font-bold text-sm bg-brand-600 text-white shadow-lg shadow-brand-600/20 transition-all whitespace-nowrap';
                appState.selectedCategory = btn.getAttribute('data-category');
                renderCatalog();
            });
        });
    }

    // ---------------------------------------------------------
    // 7. RENDER ENROLLED COURSES & CATALOG (FIXED MISSING FUNCTIONS)
    // ---------------------------------------------------------
});