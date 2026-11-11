/* LudoCraft Pro — Interactive Game Engine & UI Script */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎲 LudoCraft Pro Interactive Engine initialized.');

    // Modal Control Functions (Global Scope)
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.add('modal-active');
            }, 10);
        }
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('modal-active');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        }
    };

    // Close modals on backdrop click
    document.querySelectorAll('.fixed.inset-0').forEach(modalBg => {
        modalBg.addEventListener('click', (e) => {
            if (e.target === modalBg) {
                closeModal(modalBg.id);
            }
        });
    });

    // Preset Loader Simulation
    window.loadPreset = function(presetName) {
        const gameNameInput = document.getElementById('game-name');
        if (gameNameInput) {
            gameNameInput.value = presetName + ' Championship';
        }
        
        // Visual feedback toast
        showToast(`Loaded preset: "${presetName}" successfully!`);
        
        // Scroll to creator section
        document.getElementById('creator-section').scrollIntoView({ behavior: 'smooth' });
    };

    window.saveGamePreset = function() {
        const gameName = document.getElementById('game-name').value || 'Custom Ludo Arena';
        showToast(`Preset "${gameName}" saved to your personal library!`);
    };

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-6 right-6 z-50 bg-yellow-500 text-slate-950 px-5 py-3 rounded-2xl font-extrabold text-sm shadow-2xl flex items-center space-x-2 transform translate-y-10 opacity-0 transition-all duration-300';
        toast.innerHTML = `<i class="fa-solid fa-circle-check"></i><span>${message}</span>`;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.remove('translate-y-10', 'opacity-0');
        }, 50);

        setTimeout(() => {
            toast.classList.add('translate-y-10', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Interactive Dice Roll Simulator
    const rollBtns = [document.getElementById('roll-btn'), document.getElementById('modal-roll-btn'), document.getElementById('dice-box'), document.getElementById('modal-dice-display')];
    const diceResult = document.getElementById('dice-result');
    const turnIndicator = document.getElementById('turn-indicator');
    const gameStatusText = document.getElementById('game-status-text');
    const modalBoardStatus = document.getElementById('modal-board-status');
    const gameLog = document.getElementById('game-log');

    const players = [
        { name: "Red's Turn", color: "text-red-400", dot: "bg-red-500" },
        { name: "Green's Turn", color: "text-green-400", dot: "bg-green-500" },
        { name: "Yellow's Turn", color: "text-yellow-400", dot: "bg-yellow-500" },
        { name: "Blue's Turn", color: "text-blue-400", dot: "bg-blue-500" }
    ];
    let currentPlayerIndex = 0;

    function rollDice() {
        const roll = Math.floor(Math.random() * 6) + 1;
        
        // Update UI displays
        if (diceResult) diceResult.textContent = `Rolled: ${roll} 🎲`;
        
        // Rotate turn
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        const activePlayer = players[currentPlayerIndex];

        if (turnIndicator) {
            turnIndicator.innerHTML = `<span class="w-2.5 h-2.5 rounded-full ${activePlayer.dot} inline-block"></span><span class="${activePlayer.color}">${activePlayer.name}</span>`;
        }
        if (modalBoardStatus) {
            modalBoardStatus.textContent = activePlayer.name.toUpperCase();
            modalBoardStatus.className = `font-display font-black text-3xl mb-2 ${activePlayer.color}`;
        }
        if (gameStatusText) {
            gameStatusText.textContent = `Active (${activePlayer.name})`;
        }

        // Add to log
        if (gameLog) {
            const timeStr = new Date().toLocaleTimeString();
            const logItem = document.createElement('div');
            logItem.className = 'text-slate-300';
            logItem.innerHTML = `<span class="text-slate-500">[${timeStr}]</span> Rolled <strong class="text-yellow-400">${roll}</strong>. ${activePlayer.name}.`;
            gameLog.prepend(logItem);
        }

        showToast(`Rolled a ${roll}! Token moved.`);
    }

    rollBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', rollDice);
        }
    });

    // Reset Game button
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            currentPlayerIndex = 0;
            if (diceResult) diceResult.textContent = 'Click Dice to Roll';
            if (gameStatusText) gameStatusText.textContent = 'Game Reset. Ready.';
            showToast('Ludo board reset to starting positions.');
        });
    }

    // Dynamic Summary Updater
    const playerCountSelect = document.getElementById('player-count');
    const rulePresetSelect = document.getElementById('rule-preset');
    const tokenCountSelect = document.getElementById('token-count');

    const summaryPlayers = document.getElementById('summary-players');
    const summaryRule = document.getElementById('summary-rule');
    const summaryTokens = document.getElementById('summary-tokens');

    if (playerCountSelect && summaryPlayers) {
        playerCountSelect.addEventListener('change', (e) => {
            summaryPlayers.textContent = e.target.value + ' Players';
        });
    }

    if (rulePresetSelect && summaryRule) {
        rulePresetSelect.addEventListener('change', (e) => {
            summaryRule.textContent = e.options[e.selectedIndex].text;
        });
    }

    if (tokenCountSelect && summaryTokens) {
        tokenCountSelect.addEventListener('change', (e) => {
            summaryTokens.textContent = e.target.value + ' Tokens';
        });
    }

    // Form Submit Handler
    const creatorForm = document.getElementById('ludo-creator-form');
    if (creatorForm) {
        creatorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const gameTitle = document.getElementById('game-name').value || 'Custom Ludo Match';
            showToast(`"${gameTitle}" created successfully! Launching arena...`);
            setTimeout(() => {
                openModal('preview-modal');
            }, 800);
        });
    }
});
