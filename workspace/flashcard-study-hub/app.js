/**
 * BrainVault - Flashcard Study Hub Application Engine
 * Handles Deck Management, 3D Flip Card Study Mode, Mock Quiz Evaluation, and LocalStorage Persistence.
 */

// Initial Seed Data for Demo & First Run
const SAMPLE_DECKS = [
    {
        id: "deck-1",
        title: "JavaScript & Modern ES6+",
        category: "Computer Science",
        description: "Core concepts, closures, promises, async/await, and event loop mechanics.",
        createdAt: Date.now() - 86400000 * 3,
        cards: [
            { id: "c1", front: "What is a Closure in JavaScript?", back: "A closure is the combination of a function bundled together with references to its surrounding state (lexical environment)." },
            { id: "c2", front: "What is the Event Loop?", back: "The Event Loop monitors the Call Stack and Task Queue to execute asynchronous callbacks when stack is empty." },
            { id: "c3", front: "Difference between `let`, `const`, and `var`?", back: "`var` is function-scoped and hoisted. `let` and `const` are block-scoped and temporal dead zone (TDZ) aware." },
            { id: "c4", front: "What does `Promise.all()` do?", back: "Takes an iterable of promises and returns a single Promise that resolves when all input promises resolve." },
            { id: "c5", front: "What is Event Delegation?", back: "A technique of delegating event listeners to a parent element using event bubbling instead of binding to individual children." }
        ]
    },
    {
        id: "deck-2",
        title: "Spanish Vocabulary — Essentials",
        category: "Languages",
        description: "High-frequency conversational phrases, greetings, and travel vocabulary.",
        createdAt: Date.now() - 86400000 * 2,
        cards: [
            { id: "c6", front: "How do you say 'Where is the library?' in Spanish?", back: "¿Dónde está la biblioteca?" },
            { id: "c7", front: "What does 'Mucho gusto' mean?", back: "Nice to meet you." },
            { id: "c8", front: "Translate: 'I would like a coffee, please.'", back: "Me gustaría un café, por favor." },
            { id: "c9", front: "What is 'Buenos días' in English?", back: "Good morning." }
        ]
    },
    {
        id: "deck-3",
        title: "Cell Biology & Genetics",
        category: "Science & Math",
        description: "Organelles, DNA replication, mitosis vs meiosis, and metabolic pathways.",
        createdAt: Date.now() - 86400000 * 1,
        cards: [
            { id: "c10", front: "What is the main function of Mitochondria?", back: "Generates most of the chemical energy (ATP) needed to power the cell's biochemical reactions." },
            { id: "c11", front: "What are the four nitrogenous bases in DNA?", back: "Adenine (A), Thymine (T), Cytosine (C), and Guanine (G)." },
            { id: "c12", front: "Difference between Mitosis and Meiosis?", back: "Mitosis produces 2 identical diploid daughter cells; Meiosis produces 4 genetically unique haploid gametes." }
        ]
    }
];

// App State Management
class BrainVaultApp {
    constructor() {
        this.decks = [];
        this.activeCategory = "all";
        this.searchQuery = "";
        this.sortMode = "recent";
        
        // Active Study State
        this.currentStudyDeck = null;
        this.studyIndex = 0;
        this.isFlipped = false;

        // Active Quiz State
        this.currentQuizDeck = null;
        this.quizQuestions = [];
        this.quizIndex = 0;
        this.quizScore = 0;
        this.userQuizAnswers = [];
        this.quizTimer = null;

        // Active Editing Deck Pointer
        this.editingDeckId = null;

        this.init();
    }

    init() {
        this.loadDecks();
        this.bindEvents();
        this.renderDecks();
    }

    // LocalStorage Data Management
    loadDecks() {
        const stored = localStorage.getItem("brainvault_decks");
        if (stored) {
            try {
                this.decks = JSON.parse(stored);
            } catch (e) {
                console.error("Failed to parse LocalStorage data", e);
                this.decks = SAMPLE_DECKS;
                this.saveDecks();
            }
        } else {
            this.decks = SAMPLE_DECKS;
            this.saveDecks();
        }
    }

    saveDecks() {
        localStorage.setItem("brainvault_decks", JSON.stringify(this.decks));
    }

    // Event Binding
    bindEvents() {
        // Navigation & Views
        document.getElementById("nav-brand-home").addEventListener("click", () => this.switchView("dashboard-view"));
        document.getElementById("back-to-dashboard").addEventListener("click", () => this.switchView("dashboard-view"));
        document.getElementById("detail-back-dash").addEventListener("click", () => this.switchView("dashboard-view"));
        document.getElementById("exit-quiz-btn").addEventListener("click", () => this.switchView("dashboard-view"));
        document.getElementById("return-dash-from-results").addEventListener("click", () => this.switchView("dashboard-view"));

        // Header Action Buttons
        document.getElementById("new-deck-btn-header").addEventListener("click", () => openNewDeckModal());
        document.getElementById("hero-create-deck-btn").addEventListener("click", () => openNewDeckModal());
        document.getElementById("hero-quick-study-btn").addEventListener("click", () => this.startQuickStudy());
        document.getElementById("load-samples-btn")?.addEventListener("click", () => {
            this.decks = SAMPLE_DECKS;
            this.saveDecks();
            this.renderDecks();
            showToast("Sample decks loaded successfully!");
        });

        // Search & Filter
        const searchInput = document.getElementById("site-search");
        searchInput.addEventListener("input", (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.renderDecks();
        });

        const categoryBar = document.getElementById("category-filter-bar");
        categoryBar.addEventListener("click", (e) => {
            if (e.target.classList.contains("category-pill")) {
                document.querySelectorAll(".category-pill").forEach(btn => {
                    btn.classList.remove("bg-brand-600", "text-white");
                    btn.classList.add("bg-slate-800", "text-slate-300");
                });
                e.target.classList.remove("bg-slate-800", "text-slate-300");
                e.target.classList.add("bg-brand-600", "text-white");

                this.activeCategory = e.target.getAttribute("data-category");
                this.renderDecks();
            }
        });

        document.getElementById("sort-decks-select").addEventListener("change", (e) => {
            this.sortMode = e.target.value;
            this.renderDecks();
        });

        // Study Mode Controls
        const flashcardContainer = document.getElementById("flashcard-container");
        flashcardContainer.addEventListener("click", () => this.toggleFlipCard());

        document.addEventListener("keydown", (e) => {
            const studyView = document.getElementById("study-view");
            if (!studyView.classList.contains("hidden")) {
                if (e.code === "Space") {
                    e.preventDefault();
                    this.toggleFlipCard();
                } else if (e.code === "ArrowRight") {
                    this.nextStudyCard();
                }
            }
        });

        document.getElementById("study-actions").addEventListener("click", (e) => {
            const btn = e.target.closest(".confidence-btn");
            if (btn) {
                const rating = btn.getAttribute("data-rating");
                this.handleConfidenceRating(rating);
            }
        });

        document.getElementById("shuffle-study-btn").addEventListener("click", () => this.shuffleCurrentDeckCards());
        document.getElementById("start-quiz-from-study-btn").addEventListener("click", () => {
            if (this.currentStudyDeck) this.startQuiz(this.currentStudyDeck.id);
        });

        // Quiz Controls
        document.getElementById("quiz-next-btn").addEventListener("click", () => this.handleQuizNext());
        document.getElementById("retake-quiz-btn").addEventListener("click", () => {
            if (this.currentQuizDeck) this.startQuiz(this.currentQuizDeck.id);
        });

        // Deck Detail Quick Actions
        document.getElementById("detail-study-btn").addEventListener("click", () => {
            if (this.editingDeckId) this.startStudy(this.editingDeckId);
        });
        document.getElementById("detail-quiz-btn").addEventListener("click", () => {
            if (this.editingDeckId) this.startQuiz(this.editingDeckId);
        });

        // Forms Submissions
        document.getElementById("deck-form").addEventListener("submit", (e) => this.handleDeckFormSubmit(e));
        document.getElementById("card-form").addEventListener("submit", (e) => this.handleCardFormSubmit(e));

        // Backup & Restore Controls
        document.getElementById("export-import-btn").addEventListener("click", () => openIoModal());
        document.getElementById("download-backup-btn").addEventListener("click", () => this.exportBackup());
        document.getElementById("import-file-input").addEventListener("change", (e) => this.importBackup(e));
    }

    // Navigation Switcher
    switchView(viewId) {
        ["dashboard-view", "study-view", "quiz-view", "quiz-results-view", "deck-detail-view"].forEach(id => {
            const el = document.getElementById(id);
            if (id === viewId) {
                el.classList.remove("hidden");
                el.classList.add("flex");
            } else {
                el.classList.add("hidden");
                el.classList.remove("flex");
            }
        });

        if (viewId === "dashboard-view") {
            this.renderDecks();
        }
    }

    // Render Dashboard Decks
    renderDecks() {
        const grid = document.getElementById("decks-grid");
        const emptyState = document.getElementById("empty-decks-state");
        grid.innerHTML = "";

        let filtered = this.decks.filter(deck => {
            const matchesCat = this.activeCategory === "all" || deck.category === this.activeCategory;
            const matchesSearch = deck.title.toLowerCase().includes(this.searchQuery) || 
                                  deck.description.toLowerCase().includes(this.searchQuery);
            return matchesCat && matchesSearch;
        });

        // Sort decks
        if (this.sortMode === "alpha") {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        } else if (this.sortMode === "cards") {
            filtered.sort((a, b) => b.cards.length - a.cards.length);
        } else {
            filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        }

        document.getElementById("deck-count-label").innerText = `${filtered.length} deck${filtered.length === 1 ? '' : 's'}`;

        if (filtered.length === 0) {
            emptyState.classList.remove("hidden");
            grid.classList.add("hidden");
            return;
        }

        emptyState.classList.add("hidden");
        grid.classList.remove("hidden");

        filtered.forEach(deck => {
            const cardEl = document.createElement("div");
            cardEl.className = "bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-3xl p-6 transition flex flex-col justify-between group shadow-soft hover:shadow-xl hover:border-slate-600";
            cardEl.innerHTML = `
                <div>
                    <div class="flex items-center justify-between mb-3">
                        <span class="px-2.5 py-1 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold rounded-full">${deck.category}</span>
                        <div class="relative group/menu">
                            <button class="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition">
                                <i class="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                            <div class="absolute right-0 top-6 w-36 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-1 hidden group-hover/menu:block z-20">
                                <button onclick="app.openDeckDetail('${deck.id}')" class="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 flex items-center space-x-2">
                                    <i class="fa-solid fa-pen text-slate-400"></i>
                                    <span>Manage Cards</span>
                                </button>
                                <button onclick="app.editDeck('${deck.id}')" class="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 flex items-center space-x-2">
                                    <i class="fa-solid fa-gear text-slate-400"></i>
                                    <span>Edit Info</span>
                                </button>
                                <button onclick="app.deleteDeck('${deck.id}')" class="w-full text-left px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center space-x-2">
                                    <i class="fa-solid fa-trash"></i>
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-2 group-hover:text-brand-400 transition">${deck.title}</h3>
                    <p class="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">${deck.description || 'No description provided.'}</p>
                </div>
                <div class="pt-4 border-t border-slate-700/60 flex items-center justify-between">
                    <span class="text-xs font-mono text-slate-400">
                        <i class="fa-solid fa-clone mr-1"></i> ${deck.cards.length} cards
                    </span>
                    <div class="flex items-center space-x-2">
                        <button onclick="app.startQuiz('${deck.id}')" title="Take Quiz" class="p-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/30 rounded-xl text-xs font-semibold transition">
                            <i class="fa-solid fa-graduation-cap"></i>
                        </button>
                        <button onclick="app.startStudy('${deck.id}')" class="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold transition shadow-md shadow-brand-600/20 flex items-center space-x-1.5">
                            <i class="fa-solid fa-play"></i>
                            <span>Study</span>
                        </button>
                    </div>
                </div>
            `;
            grid.appendChild(cardEl);
        });
    }

    // ==========================================
    // STUDY MODE (FLIP CARD ENGINE)
    // ==========================================
    startQuickStudy() {
        if (this.decks.length === 0) {
            showToast("No decks available to study!");
            return;
        }
        const firstWithCards = this.decks.find(d => d.cards.length > 0) || this.decks[0];
        this.startStudy(firstWithCards.id);
    }

    startStudy(deckId) {
        const deck = this.decks.find(d => d.id === deckId);
        if (!deck || deck.cards.length === 0) {
            showToast("Add cards to this deck before studying!");
            this.openDeckDetail(deckId);
            return;
        }

        this.currentStudyDeck = JSON.parse(JSON.stringify(deck));
        this.studyIndex = 0;
        this.isFlipped = false;

        document.getElementById("study-deck-title").innerText = this.currentStudyDeck.title;
        this.switchView("study-view");
        this.renderStudyCard();
    }

    renderStudyCard() {
        const deck = this.currentStudyDeck;
        const card = deck.cards[this.studyIndex];
        const inner = document.getElementById("flashcard-inner");

        // Reset flip animation
        this.isFlipped = false;
        inner.classList.remove("is-flipped");

        // Set card data
        document.getElementById("study-progress-indicator").innerText = `Card ${this.studyIndex + 1} of ${deck.cards.length}`;
        document.getElementById("study-card-id").innerText = `#${this.studyIndex + 1}`;
        document.getElementById("study-card-front").innerText = card.front;
        document.getElementById("study-card-back").innerText = card.back;

        // Progress bar percentage
        const pct = ((this.studyIndex + 1) / deck.cards.length) * 100;
        document.getElementById("study-progress-bar").style.width = `${pct}%`;
    }

    toggleFlipCard() {
        const inner = document.getElementById("flashcard-inner");
        this.isFlipped = !this.isFlipped;
        if (this.isFlipped) {
            inner.classList.add("is-flipped");
        } else {
            inner.classList.remove("is-flipped");
        }
    }

    handleConfidenceRating(rating) {
        if (rating === "again") {
            // Push card to the end of array for review
            const currentCard = this.currentStudyDeck.cards[this.studyIndex];
            this.currentStudyDeck.cards.push(currentCard);
            showToast("Card scheduled for review soon.");
        } else {
            showToast(`Marked as ${rating}!`);
        }
        this.nextStudyCard();
    }

    nextStudyCard() {
        if (this.studyIndex < this.currentStudyDeck.cards.length - 1) {
            this.studyIndex++;
            this.renderStudyCard();
        } else {
            showToast("You completed this study session! Great job.");
            this.switchView("dashboard-view");
        }
    }

    shuffleCurrentDeckCards() {
        if (!this.currentStudyDeck || this.currentStudyDeck.cards.length <= 1) return;
        this.currentStudyDeck.cards.sort(() => Math.random() - 0.5);
        this.studyIndex = 0;
        this.renderStudyCard();
        showToast("Deck shuffled!");
    }

    // ==========================================
    // MOCK QUIZ EVALUATION ENGINE
    // ==========================================
    startQuiz(deckId) {
        const deck = this.decks.find(d => d.id === deckId);
        if (!deck || deck.cards.length === 0) {
            showToast("Deck has no cards for a quiz!");
            return;
        }

        this.currentQuizDeck = deck;
        this.quizIndex = 0;
        this.quizScore = 0;
        this.userQuizAnswers = [];

        // Build multiple choice questions dynamically using answers from other cards
        const allBacks = deck.cards.map(c => c.back);
        
        this.quizQuestions = deck.cards.map(card => {
            const wrongOptions = allBacks.filter(b => b !== card.back).sort(() => Math.random() - 0.5).slice(0, 3);
            
            // If not enough wrong options from same deck, provide generic options
            while (wrongOptions.length < 3) {
                wrongOptions.push(`Alternative answer ${wrongOptions.length + 1}`);
            }

            const options = [...wrongOptions, card.back].sort(() => Math.random() - 0.5);
            return {
                cardId: card.id,
                question: card.front,
                correctAnswer: card.back,
                options: options
            };
        });

        document.getElementById("quiz-deck-title").innerText = `Quiz: ${deck.title}`;
        this.switchView("quiz-view");
        this.renderQuizQuestion();
    }

    renderQuizQuestion() {
        const q = this.quizQuestions[this.quizIndex];
        document.getElementById("quiz-progress-text").innerText = `Question ${this.quizIndex + 1} of ${this.quizQuestions.length}`;
        document.getElementById("quiz-question").innerText = q.question;

        const optionsContainer = document.getElementById("quiz-options");
        optionsContainer.innerHTML = "";

        q.options.forEach((option, idx) => {
            const btn = document.createElement("button");
            btn.className = "quiz-opt-btn w-full text-left p-4 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-2xl transition flex items-start space-x-3 text-sm text-slate-200";
            btn.innerHTML = `
                <span class="w-6 h-6 rounded-lg bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">${String.fromCharCode(65 + idx)}</span>
                <span class="flex-1">${option}</span>
            `;
            btn.addEventListener("click", () => {
                document.querySelectorAll(".quiz-opt-btn").forEach(b => b.classList.remove("border-indigo-500", "bg-indigo-500/10"));
                btn.classList.add("border-indigo-500", "bg-indigo-500/10");
                this.userQuizAnswers[this.quizIndex] = option;
            });

            // Pre-select if already chosen
            if (this.userQuizAnswers[this.quizIndex] === option) {
                btn.classList.add("border-indigo-500", "bg-indigo-500/10");
            }

            optionsContainer.appendChild(btn);
        });

        // Prev button disable state
        const prevBtn = document.getElementById("quiz-prev-btn");
        if (this.quizIndex === 0) {
            prevBtn.disabled = true;
            prevBtn.classList.add("opacity-50", "cursor-not-allowed");
        } else {
            prevBtn.disabled = false;
            prevBtn.classList.remove("opacity-50", "cursor-not-allowed");
            prevBtn.onclick = () => {
                this.quizIndex--;
                this.renderQuizQuestion();
            };
        }
    }

    handleQuizNext() {
        if (!this.userQuizAnswers[this.quizIndex]) {
            showToast("Please select an answer to proceed.");
            return;
        }

        if (this.quizIndex < this.quizQuestions.length - 1) {
            this.quizIndex++;
            this.renderQuizQuestion();
        } else {
            this.evaluateQuiz();
        }
    }

    evaluateQuiz() {
        let correctCount = 0;
        const reviewList = document.getElementById("quiz-review-list");
        reviewList.innerHTML = "";

        this.quizQuestions.forEach((q, idx) => {
            const userAns = this.userQuizAnswers[idx];
            const isCorrect = userAns === q.correctAnswer;
            if (isCorrect) correctCount++;

            const revEl = document.createElement("div");
            revEl.className = `p-3.5 rounded-xl border text-xs ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'}`;
            revEl.innerHTML = `
                <p class="font-bold mb-1">${idx + 1}. ${q.question}</p>
                <p class="text-slate-400">Your Answer: <span class="${isCorrect ? 'text-emerald-400 font-semibold' : 'text-rose-400 line-through'}">${userAns}</span></p>
                ${!isCorrect ? `<p class="text-emerald-400 font-semibold mt-0.5">Correct Answer: ${q.correctAnswer}</p>` : ''}
            `;
            reviewList.appendChild(revEl);
        });

        const total = this.quizQuestions.length;
        const percent = Math.round((correctCount / total) * 100);

        document.getElementById("result-score-percent").innerText = `${percent}%`;
        document.getElementById("result-correct-count").innerText = `${correctCount} / ${total}`;

        let mastery = "Beginner";
        if (percent >= 90) mastery = "Master";
        else if (percent >= 70) mastery = "Advanced";
        else if (percent >= 50) mastery = "Intermediate";

        document.getElementById("result-mastery-badge").innerText = mastery;

        this.switchView("quiz-results-view");
    }

    // ==========================================
    // DECK & CARD EDITING DETAILED MANAGER
    // ==========================================
    openDeckDetail(deckId) {
        this.editingDeckId = deckId;
        const deck = this.decks.find(d => d.id === deckId);
        if (!deck) return;

        document.getElementById("detail-deck-category").innerText = deck.category;
        document.getElementById("detail-deck-title").innerText = deck.title;
        document.getElementById("detail-deck-desc").innerText = deck.description || "No description provided.";
        document.getElementById("detail-card-count").innerText = deck.cards.length;

        this.renderDeckCardsList(deck);
        this.switchView("deck-detail-view");
    }

    renderDeckCardsList(deck) {
        const container = document.getElementById("deck-cards-list");
        container.innerHTML = "";

        if (deck.cards.length === 0) {
            container.innerHTML = `<p class="text-xs text-slate-500 italic py-4 text-center">No cards added yet. Click 'Add New Card' to create one!</p>`;
            return;
        }

        deck.cards.forEach((c, idx) => {
            const cardRow = document.createElement("div");
            cardRow.className = "bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex items-center justify-between gap-4";
            cardRow.innerHTML = `
                <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Front (Question)</span>
                        <p class="text-sm font-semibold text-white mt-0.5">${c.front}</p>
                    </div>
                    <div>
                        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Back (Answer)</span>
                        <p class="text-sm text-slate-300 mt-0.5">${c.back}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-2 shrink-0">
                    <button onclick="app.editCard('${deck.id}', '${c.id}')" class="p-2 text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-xl transition">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button onclick="app.deleteCard('${deck.id}', '${c.id}')" class="p-2 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            container.appendChild(cardRow);
        });
    }

    handleDeckFormSubmit(e) {
        e.preventDefault();
        const id = document.getElementById("edit-deck-id").value;
        const title = document.getElementById("deck-title-input").value.trim();
        const category = document.getElementById("deck-category-input").value;
        const description = document.getElementById("deck-desc-input").value.trim();

        if (id) {
            // Edit existing deck
            const deck = this.decks.find(d => d.id === id);
            if (deck) {
                deck.title = title;
                deck.category = category;
                deck.description = description;
            }
            showToast("Deck updated successfully!");
        } else {
            // Create new deck
            const newDeck = {
                id: "deck-" + Date.now(),
                title: title,
                category: category,
                description: description,
                createdAt: Date.now(),
                cards: []
            };
            this.decks.unshift(newDeck);
            showToast("New deck created!");
        }

        this.saveDecks();
        closeDeckModal();
        this.renderDecks();
    }

    editDeck(deckId) {
        const deck = this.decks.find(d => d.id === deckId);
        if (!deck) return;

        document.getElementById("edit-deck-id").value = deck.id;
        document.getElementById("deck-title-input").value = deck.title;
        document.getElementById("deck-category-input").value = deck.category;
        document.getElementById("deck-desc-input").value = deck.description || "";
        document.getElementById("deck-modal-title").innerText = "Edit Deck Settings";

        openDeckModal();
    }

    deleteDeck(deckId) {
        if (confirm("Are you sure you want to delete this deck and all its flashcards?")) {
            this.decks = this.decks.filter(d => d.id !== deckId);
            this.saveDecks();
            this.renderDecks();
            showToast("Deck deleted.");
        }
    }

    handleCardFormSubmit(e) {
        e.preventDefault();
        const cardId = document.getElementById("edit-card-id").value;
        const front = document.getElementById("card-front-input").value.trim();
        const back = document.getElementById("card-back-input").value.trim();

        const deck = this.decks.find(d => d.id === this.editingDeckId);
        if (!deck) return;

        if (cardId) {
            // Update existing card
            const card = deck.cards.find(c => c.id === cardId);
            if (card) {
                card.front = front;
                card.back = back;
            }
            showToast("Card updated!");
        } else {
            // Add new card
            deck.cards.push({
                id: "card-" + Date.now(),
                front: front,
                back: back
            });
            showToast("New flashcard added!");
        }

        this.saveDecks();
        closeCardModal();
        this.openDeckDetail(this.editingDeckId);
    }

    editCard(deckId, cardId) {
        const deck = this.decks.find(d => d.id === deckId);
        if (!deck) return;
        const card = deck.cards.find(c => c.id === cardId);
        if (!card) return;

        this.editingDeckId = deckId;
        document.getElementById("edit-card-id").value = card.id;
        document.getElementById("card-front-input").value = card.front;
        document.getElementById("card-back-input").value = card.back;
        document.getElementById("card-modal-title").innerText = "Edit Flashcard";

        openCardModal();
    }

    deleteCard(deckId, cardId) {
        const deck = this.decks.find(d => d.id === deckId);
        if (!deck) return;

        deck.cards = deck.cards.filter(c => c.id !== cardId);
        this.saveDecks();
        this.openDeckDetail(deckId);
        showToast("Card removed.");
    }

    // Export & Import Backup JSON
    exportBackup() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.decks, null, 2));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", `BrainVault_Backup_${new Date().toISOString().slice(0,10)}.json`);
        document.body.appendChild(dlAnchorElem);
        dlAnchorElem.click();
        dlAnchorElem.remove();
        showToast("Backup exported successfully!");
    }

    importBackup(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target.result);
                if (Array.isArray(importedData)) {
                    this.decks = importedData;
                    this.saveDecks();
                    this.renderDecks();
                    closeIoModal();
                    showToast("Data imported successfully!");
                } else {
                    showToast("Invalid JSON file structure.");
                }
            } catch (err) {
                showToast("Error parsing backup JSON file.");
            }
        };
        reader.readAsText(file);
    }
}

// Global Modal Helpers
function openNewDeckModal() {
    document.getElementById("edit-deck-id").value = "";
    document.getElementById("deck-title-input").value = "";
    document.getElementById("deck-desc-input").value = "";
    document.getElementById("deck-modal-title").innerText = "Create New Deck";
    openDeckModal();
}

function openDeckModal() {
    const modal = document.getElementById("deck-modal");
    modal.classList.remove("hidden", "opacity-0", "pointer-events-none");
    modal.classList.add("modal-active");
}

function closeDeckModal() {
    const modal = document.getElementById("deck-modal");
    modal.classList.add("hidden", "opacity-0", "pointer-events-none");
    modal.classList.remove("modal-active");
}

function openAddCardModal() {
    document.getElementById("edit-card-id").value = "";
    document.getElementById("card-front-input").value = "";
    document.getElementById("card-back-input").value = "";
    document.getElementById("card-modal-title").innerText = "Add New Flashcard";
    openCardModal();
}

function openCardModal() {
    const modal = document.getElementById("card-modal");
    modal.classList.remove("hidden", "opacity-0", "pointer-events-none");
    modal.classList.add("modal-active");
}

function closeCardModal() {
    const modal = document.getElementById("card-modal");
    modal.classList.add("hidden", "opacity-0", "pointer-events-none");
    modal.classList.remove("modal-active");
}

function openIoModal() {
    const modal = document.getElementById("io-modal");
    modal.classList.remove("hidden", "opacity-0", "pointer-events-none");
    modal.classList.add("modal-active");
}

function closeIoModal() {
    const modal = document.getElementById("io-modal");
    modal.classList.add("hidden", "opacity-0", "pointer-events-none");
    modal.classList.remove("modal-active");
}

// Toast Notifications Helper
function showToast(message) {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = "bg-slate-800 text-slate-100 border border-slate-700 px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold flex items-center space-x-2 transition-all duration-300 transform translate-y-2 pointer-events-auto";
    toast.innerHTML = `
        <i class="fa-solid fa-circle-check text-brand-400 text-sm"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("opacity-0", "translate-y-4");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Initialize Application Instance
let app;
document.addEventListener("DOMContentLoaded", () => {
    app = new BrainVaultApp();
});
