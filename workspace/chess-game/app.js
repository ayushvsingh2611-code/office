// ==========================================
// GRANDMASTER CHESS - TWO PLAYER ARENA
// app.js - Complete State-Driven Game Logic
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // --- AUDIO SYSTEM (Web Audio API for zero dependency sound effects) ---
    const SoundManager = {
        enabled: true,
        ctx: null,
        init() {
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) {
                    this.ctx = new AudioContext();
                }
            } catch (e) {
                console.warn('Web Audio API not supported', e);
            }
        },
        playMove() {
            if (!this.enabled || !this.ctx) return;
            this.tone(440, 0.08, 'sine');
        },
        playCapture() {
            if (!this.enabled || !this.ctx) return;
            this.tone(220, 0.12, 'triangle');
            setTimeout(() => this.tone(330, 0.1, 'sine'), 60);
        },
        playCheck() {
            if (!this.enabled || !this.ctx) return;
            this.tone(587.33, 0.15, 'sawtooth');
            setTimeout(() => this.tone(880, 0.2, 'sawtooth'), 100);
        },
        playVictory() {
            if (!this.enabled || !this.ctx) return;
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq, idx) => {
                setTimeout(() => this.tone(freq, 0.2, 'triangle'), idx * 150);
            });
        },
        tone(freq, duration, type = 'sine') {
            try {
                if (this.ctx.state === 'suspended') {
                    this.ctx.resume();
                }
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
                gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + duration);
            } catch (e) {
                // Ignore audio restriction errors
            }
        }
    };
    SoundManager.init();

    // --- TOAST NOTIFICATION SYSTEM ---
    window.phToast = function(message, type = 'info') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        const bgColors = {
            info: 'bg-slate-900 border-blue-500/40 text-blue-300',
            success: 'bg-slate-900 border-emerald-500/40 text-emerald-300',
            warning: 'bg-slate-900 border-amber-500/40 text-amber-300',
            error: 'bg-slate-900 border-red-500/40 text-red-300'
        };
        const icons = {
            info: 'fa-circle-info text-blue-400',
            success: 'fa-circle-check text-emerald-400',
            warning: 'fa-triangle-exclamation text-amber-400',
            error: 'fa-circle-xmark text-red-400'
        };

        toast.className = `pointer-events-auto flex items-center space-x-3 px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all duration-300 transform translate-y-4 opacity-0 ${bgColors[type] || bgColors.info}`;
        toast.innerHTML = `
            <i class="fa-solid ${icons[type] || icons.info} text-lg"></i>
            <span class="text-sm font-medium text-slate-200">${message}</span>
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

    // --- CHESS PIECE UNICODE MAPPING ---
    const PIECE_SYMBOLS = {
        w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
        b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }
    };

    const PIECE_NAMES = {
        k: 'King', q: 'Queen', r: 'Rook', b: 'Bishop', n: 'Knight', p: 'Pawn'
    };

    const PIECE_VALUES = {
        p: 1, n: 3, b: 3, r: 5, q: 9, k: 0
    };

    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    // --- APPLICATION STATE & LOCALSTORAGE ---
    const STORAGE_KEY = 'grandmaster_chess_state_v1';

    let gameState = {
        board: [],
        turn: 'w',
        selectedSquare: null,
        validMoves: [],
        moveHistory: [],
        capturedWhite: [],
        capturedBlack: [],
        moveCount: 0,
        isGameOver: false,
        soundEnabled: true,
        whiteTime: 600,
        blackTime: 600
    };

    function loadState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed && parsed.board && Array.isArray(parsed.board) && parsed.board.length === 8) {
                    gameState = { ...gameState, ...parsed };
                    return;
                }
            }
            initNewGameBoard();
        } catch (e) {
            console.error('Failed to load state', e);
            initNewGameBoard();
        }
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
        } catch (e) {
            console.error('Failed to save state', e);
        }
    }

    function initNewGameBoard() {
        const board = Array(8).fill(null).map(() => Array(8).fill(null));
        const backRank = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
        
        for (let c = 0; c < 8; c++) {
            board[0][c] = { type: backRank[c], color: 'b' };
            board[1][c] = { type: 'p', color: 'b' };
        }

        for (let c = 0; c < 8; c++) {
            board[6][c] = { type: 'p', color: 'w' };
            board[7][c] = { type: backRank[c], color: 'w' };
        }

        gameState = {
            board,
            turn: 'w',
            selectedSquare: null,
            validMoves: [],
            moveHistory: [],
            capturedWhite: [],
            capturedBlack: [],
            moveCount: 0,
            isGameOver: false,
            soundEnabled: SoundManager.enabled,
            whiteTime: 600,
            blackTime: 600
        };
        saveState();
    }

    // --- CHESS RULE VALIDATION ENGINE ---
    function getPieceValidMoves(r, c, boardState = gameState.board) {
        const piece = boardState[r][c];
        if (!piece) return [];

        const moves = [];
        const color = piece.color;
        const type = piece.type;

        const addMove = (tr, tc) => {
            if (tr >= 0 && tr < 8 && tc >= 0 && tc < 8) {
                const target = boardState[tr][tc];
                if (!target) {
                    moves.push({ r: tr, c: tc });
                    return true;
                } else {
                    if (target.color !== color) {
                        moves.push({ r: tr, c: tc });
                    }
                    return false;
                }
            }
            return false;
        };

        if (type === 'p') {
            const dir = color === 'w' ? -1 : 1;
            const startRow = color === 'w' ? 6 : 1;
            const fr = r + dir;
            if (fr >= 0 && fr < 8 && !boardState[fr][c]) {
                moves.push({ r: fr, c });
                const sfr = r + (dir * 2);
                if (r === startRow && !boardState[sfr][c]) {
                    moves.push({ r: sfr, c });
                }
            }
            [c - 1, c + 1].forEach(cc => {
                if (fr >= 0 && fr < 8 && cc >= 0 && cc < 8) {
                    const target = boardState[fr][cc];
                    if (target && target.color !== color) {
                        moves.push({ r: fr, c: cc });
                    }
                }
            });
        } else if (type === 'r') {
            [[1,0], [-1,0], [0,1], [0,-1]].forEach(([dr, dc]) => {
                let step = 1;
                while (addMove(r + dr * step, c + dc * step)) { step++; }
            });
        } else if (type === 'b') {
            [[1,1], [1,-1], [-1,1], [-1,-1]].forEach(([dr, dc]) => {
                let step = 1;
                while (addMove(r + dr * step, c + dc * step)) { step++; }
            });
        } else if (type === 'q') {
            [[1,0], [-1,0], [0,1], [0,-1], [1,1], [1,-1], [-1,1], [-1,-1]].forEach(([dr, dc]) => {
                let step = 1;
                while (addMove(r + dr * step, c + dc * step)) { step++; }
            });
        } else if (type === 'k') {
            [[1,0], [-1,0], [0,1], [0,-1], [1,1], [1,-1], [-1,1], [-1,-1]].forEach(([dr, dc]) => {
                const tr = r + dr;
                const tc = c + dc;
                if (tr >= 0 && tr < 8 && tc >= 0 && tc < 8) {
                    const target = boardState[tr][tc];
                    if (!target || target.color !== color) {
                        moves.push({ r: tr, c: tc });
                    }
                }
            });
        } else if (type === 'n') {
            [
                [-2, -1], [-2, 1], [-1, -2], [-1, 2],
                [1, -2], [1, 2], [2, -1], [2, 1]
            ].forEach(([dr, dc]) => {
                const tr = r + dr;
                const tc = c + dc;
                if (tr >= 0 && tr < 8 && tc >= 0 && tc < 8) {
                    const target = boardState[tr][tc];
                    if (!target || target.color !== color) {
                        moves.push({ r: tr, c: tc });
                    }
                }
            });
        }

        return moves;
    }

    // --- RENDER ENGINE ---
    function render() {
        renderBoard();
        renderInfo();
    }

    function renderBoard() {
        const boardEl = document.getElementById('chessboard');
        if (!boardEl) return;
        boardEl.innerHTML = '';

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const square = document.createElement('div');
                const isLight = (r + c) % 2 === 0;
                const piece = gameState.board[r][c];
                
                const isSelected = gameState.selectedSquare && gameState.selectedSquare.r === r && gameState.selectedSquare.c === c;
                const isValidMove = gameState.validMoves.some(m => m.r === r && m.c === c);

                let squareClasses = `square ${isLight ? 'light' : 'dark'} relative flex items-center justify-center cursor-pointer transition-colors duration-150 select-none`;
                if (isSelected) {
                    squareClasses += ' selected';
                    square.dataset.selected = 'true';
                }
                if (isValidMove) {
                    squareClasses += ' highlight valid-move';
                    square.dataset.validMove = 'true';
                }

                square.className = squareClasses;
                square.dataset.row = r;
                square.dataset.col = c;
                square.dataset.square = files[c] + ranks[r];
                square.style.pointerEvents = 'auto';

                if (piece) {
                    const pieceSpan = document.createElement('span');
                    const colorClass = piece.color === 'w' ? 'white' : 'black';
                    const textClass = piece.color === 'w' ? 'text-amber-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' : 'text-slate-950 drop-shadow-[0_1px_2px_rgba(255,255,255,0.4)]';
                    
                    pieceSpan.className = `piece ${colorClass} text-3xl sm:text-4xl md:text-5xl font-bold transition-transform hover:scale-110 ${textClass}`;
                    pieceSpan.dataset.piece = piece.type;
                    pieceSpan.dataset.color = piece.color;
                    pieceSpan.textContent = PIECE_SYMBOLS[piece.color][piece.type];
                    square.appendChild(pieceSpan);
                }

                if (isValidMove) {
                    const indicator = document.createElement('div');
                    if (piece) {
                        indicator.className = 'absolute inset-0 border-4 border-red-500/80 rounded-lg animate-pulse pointer-events-none';
                    } else {
                        indicator.className = 'absolute w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50 animate-pulse pointer-events-none';
                    }
                    square.appendChild(indicator);
                }

                square.addEventListener('click', (e) => {
                    e.stopPropagation();
                    handleSquareClick(r, c);
                });

                boardEl.appendChild(square);
            }
        }
    }

    function renderInfo() {
        const turnIndicator = document.getElementById('turn-indicator');
        const whiteCard = document.getElementById('player-white-card');
        const blackCard = document.getElementById('player-black-card');

        if (turnIndicator) {
            if (gameState.turn === 'w') {
                turnIndicator.className = 'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1.5';
                turnIndicator.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span> White's Turn`;
                if (whiteCard) whiteCard.className = 'bg-slate-950/90 rounded-2xl p-4 border border-amber-500/50 shadow-xl transition-all ring-2 ring-amber-500/50';
                if (blackCard) blackCard.className = 'bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-xl transition-all opacity-80';
            } else {
                turnIndicator.className = 'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5';
                turnIndicator.innerHTML = `<span class="w-2 h-2 rounded-full bg-slate-400 animate-pulse"></span> Black's Turn`;
                if (whiteCard) whiteCard.className = 'bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-xl transition-all opacity-80';
                if (blackCard) blackCard.className = 'bg-slate-950/90 rounded-2xl p-4 border border-slate-700 shadow-xl transition-all ring-2 ring-slate-600/50';
            }
        }

        const moveCountBadge = document.getElementById('move-count-badge');
        if (moveCountBadge) moveCountBadge.textContent = Math.ceil(gameState.moveHistory.length / 2);

        const historyList = document.getElementById('move-history-list');
        if (historyList) {
            if (gameState.moveHistory.length === 0) {
                historyList.innerHTML = `<div class="text-slate-500 italic text-center py-8">Moves will appear here...</div>`;
            } else {
                historyList.innerHTML = '';
                for (let i = 0; i < gameState.moveHistory.length; i += 2) {
                    const moveNum = Math.floor(i / 2) + 1;
                    const whiteMove = gameState.moveHistory[i] || '';
                    const blackMove = gameState.moveHistory[i + 1] || '';
                    
                    const rowDiv = document.createElement('div');
                    rowDiv.className = 'flex justify-between py-1 px-2 rounded hover:bg-slate-800/60 font-mono text-xs';
                    rowDiv.innerHTML = `
                        <span class="text-slate-500 w-8">${moveNum}.</span>
                        <span class="text-amber-300 flex-1">${whiteMove}</span>
                        <span class="text-slate-300 flex-1">${blackMove}</span>
                    `;
                    historyList.appendChild(rowDiv);
                }
                historyList.scrollTop = historyList.scrollHeight;
            }
        }

        renderCaptures('white', gameState.capturedWhite);
        renderCaptures('black', gameState.capturedBlack);

        const soundIcon = document.getElementById('sound-icon');
        if (soundIcon) {
            soundIcon.className = gameState.soundEnabled ? 'fa-solid fa-volume-high text-emerald-400' : 'fa-solid fa-volume-xmark text-slate-500';
        }
    }

    function renderCaptures(playerColor, capturedArray) {
        const containerId = playerColor === 'white' ? 'white-captured' : 'black-captured';
        const scoreId = playerColor === 'white' ? 'white-score' : 'black-score';
        const container = document.getElementById(containerId);
        const scoreEl = document.getElementById(scoreId);

        if (container) {
            if (capturedArray.length === 0) {
                container.innerHTML = `<span class="text-xs text-slate-600 italic">No captures yet</span>`;
            } else {
                container.innerHTML = '';
                capturedArray.forEach(p => {
                    const span = document.createElement('span');
                    span.className = 'text-sm sm:text-base font-bold text-slate-300';
                    span.textContent = PIECE_SYMBOLS[p.color][p.type];
                    container.appendChild(span);
                });
            }
        }

        if (scoreEl) {
            const sum = capturedArray.reduce((acc, p) => acc + (PIECE_VALUES[p.type] || 0), 0);
            scoreEl.textContent = sum > 0 ? `+${sum}` : '+0';
        }
    }

    // --- INTERACTION LOGIC ---
    function handleSquareClick(r, c) {
        if (gameState.isGameOver) return;

        const clickedPiece = gameState.board[r][c];
        const isSelectedSquare = gameState.selectedSquare && gameState.selectedSquare.r === r && gameState.selectedSquare.c === c;
        const isValidMove = gameState.validMoves.some(m => m.r === r && m.c === c);

        if (isSelectedSquare) {
            gameState.selectedSquare = null;
            gameState.validMoves = [];
            render();
            return;
        }

        if (isValidMove && gameState.selectedSquare) {
            executeMove(gameState.selectedSquare.r, gameState.selectedSquare.c, r, c);
            return;
        }

        if (clickedPiece && clickedPiece.color === gameState.turn) {
            gameState.selectedSquare = { r, c };
            gameState.validMoves = getPieceValidMoves(r, c);
            render();
            return;
        }

        if (gameState.selectedSquare) {
            gameState.selectedSquare = null;
            gameState.validMoves = [];
            render();
        }
    }

    function executeMove(fromR, fromC, toR, toC) {
        const piece = gameState.board[fromR][fromC];
        const targetPiece = gameState.board[toR][toC];

        const moveNotation = `${files[fromC]}${ranks[fromR]} → ${files[toC]}${ranks[toR]}`;

        if (targetPiece) {
            if (targetPiece.color === 'w') {
                gameState.capturedWhite.push(targetPiece);
            } else {
                gameState.capturedBlack.push(targetPiece);
            }
            SoundManager.playCapture();
            window.phToast(`Captured ${PIECE_NAMES[targetPiece.type]}!`, 'success');
        } else {
            SoundManager.playMove();
        }

        let pieceType = piece.type;
        if (pieceType === 'p' && (toR === 0 || toR === 7)) {
            pieceType = 'q';
            window.phToast('Pawn promoted to Queen!', 'success');
        }

        gameState.board[toR][toC] = { type: pieceType, color: piece.color };
        gameState.board[fromR][fromC] = null;

        gameState.moveHistory.push(moveNotation);
        gameState.moveCount++;

        if (targetPiece && targetPiece.type === 'k') {
            triggerGameOver(piece.color);
            return;
        }

        gameState.turn = gameState.turn === 'w' ? 'b' : 'w';
        gameState.selectedSquare = null;
        gameState.validMoves = [];

        saveState();
        render();
    }

    function triggerGameOver(winningColor) {
        gameState.isGameOver = true;
        SoundManager.playVictory();
        saveState();
        render();

        const modal = document.getElementById('game-over-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalMsg = document.getElementById('modal-message');

        if (modal && modalTitle && modalMsg) {
            const winnerName = winningColor === 'w' ? 'White Player' : 'Black Player';
            modalTitle.textContent = `${winnerName} Wins!`;
            modalMsg.textContent = `${winnerName} has triumphed in ${Math.ceil(gameState.moveHistory.length / 2)} moves.`;
            
            modal.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
            modal.classList.add('flex', 'opacity-100', 'pointer-events-auto');
        }
    }

    // --- EVENT LISTENERS & MODAL BINDINGS ---
    function initEventListeners() {
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                initNewGameBoard();
                render();
                window.phToast('Started a new chess match!', 'info');
            });
        }

        const resignBtn = document.getElementById('resign-btn');
        if (resignBtn) {
            resignBtn.addEventListener('click', () => {
                if (gameState.isGameOver) return;
                const winner = gameState.turn === 'w' ? 'Black' : 'White';
                const loser = gameState.turn === 'w' ? 'White' : 'Black';
                window.phToast(`${loser} resigned. ${winner} wins!`, 'warning');
                triggerGameOver(gameState.turn === 'w' ? 'b' : 'w');
            });
        }

        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle) {
            soundToggle.addEventListener('click', () => {
                gameState.soundEnabled = !gameState.soundEnabled;
                SoundManager.enabled = gameState.soundEnabled;
                saveState();
                render();
                window.phToast(`Sound effects ${gameState.soundEnabled ? 'enabled' : 'disabled'}`, 'info');
            });
        }

        const clearHistoryBtn = document.getElementById('clear-history');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => {
                gameState.moveHistory = [];
                saveState();
                render();
                window.phToast('Move history cleared', 'info');
            });
        }

        const historyBtn = document.getElementById('history-btn');
        if (historyBtn) {
            historyBtn.addEventListener('click', () => {
                const historyList = document.getElementById('move-history-list');
                if (historyList) {
                    historyList.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        const rulesBtn = document.getElementById('rules-btn');
        const rulesModal = document.getElementById('rules-modal');
        const rulesCloseX = document.getElementById('rules-close-x');
        const rulesCloseBtn = document.getElementById('rules-close-btn');

        if (rulesBtn && rulesModal) {
            rulesBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                rulesModal.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
                rulesModal.classList.add('flex', 'opacity-100', 'pointer-events-auto');
            });
        }
        [rulesCloseX, rulesCloseBtn].forEach(el => {
            if (el && rulesModal) {
                el.addEventListener('click', (e) => {
                    e.stopPropagation();
                    rulesModal.classList.add('hidden', 'opacity-0', 'pointer-events-none');
                    rulesModal.classList.remove('flex', 'opacity-100', 'pointer-events-auto');
                });
            }
        });

        if (rulesModal) {
            rulesModal.addEventListener('click', (e) => {
                if (e.target === rulesModal) {
                    rulesModal.classList.add('hidden', 'opacity-0', 'pointer-events-none');
                    rulesModal.classList.remove('flex', 'opacity-100', 'pointer-events-auto');
                }
            });
        }

        const modalRematch = document.getElementById('modal-rematch-btn');
        const modalClose = document.getElementById('modal-close-btn');
        const gameOverModal = document.getElementById('game-over-modal');

        if (modalRematch && gameOverModal) {
            modalRematch.addEventListener('click', (e) => {
                e.stopPropagation();
                gameOverModal.classList.add('hidden', 'opacity-0', 'pointer-events-none');
                gameOverModal.classList.remove('flex', 'opacity-100', 'pointer-events-auto');
                initNewGameBoard();
                render();
                window.phToast('Rematch started!', 'success');
            });
        }
        if (modalClose && gameOverModal) {
            modalClose.addEventListener('click', (e) => {
                e.stopPropagation();
                gameOverModal.classList.add('hidden', 'opacity-0', 'pointer-events-none');
                gameOverModal.classList.remove('flex', 'opacity-100', 'pointer-events-auto');
            });
        }
        if (gameOverModal) {
            gameOverModal.addEventListener('click', (e) => {
                if (e.target === gameOverModal) {
                    gameOverModal.classList.add('hidden', 'opacity-0', 'pointer-events-none');
                    gameOverModal.classList.remove('flex', 'opacity-100', 'pointer-events-auto');
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (rulesModal) {
                    rulesModal.classList.add('hidden', 'opacity-0', 'pointer-events-none');
                    rulesModal.classList.remove('flex', 'opacity-100', 'pointer-events-auto');
                }
                if (gameOverModal) {
                    gameOverModal.classList.add('hidden', 'opacity-0', 'pointer-events-none');
                    gameOverModal.classList.remove('flex', 'opacity-100', 'pointer-events-auto');
                }
            }
            if (e.key === 'r' || e.key === 'R') {
                if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;
                initNewGameBoard();
                render();
                window.phToast('Game reset via keyboard shortcut', 'info');
            }
        });
    }

    loadState();
    initEventListeners();
    render();
});