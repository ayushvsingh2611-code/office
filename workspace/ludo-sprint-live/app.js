/**
 * LUDO GRAND MASTER - APP.JS
 * Deterministic State Machine, 15x15 Coordinate System, 3D Dice, Sound FX & Bot AI
 */

// --- 1. TRACK & GRID CONSTANTS (From Section 3 of Spec) ---
const TRACK_COORDINATES = [
  /*  0 - Red Start */  { r: 6, c: 1 },
  /*  1 */              { r: 6, c: 2 },
  /*  2 */              { r: 6, c: 3 },
  /*  3 */              { r: 6, c: 4 },
  /*  4 */              { r: 6, c: 5 },
  /*  5 */              { r: 5, c: 6 },
  /*  6 */              { r: 4, c: 6 },
  /*  7 */              { r: 3, c: 6 },
  /*  8 */              { r: 2, c: 6 },
  /*  9 */              { r: 1, c: 6 },
  /* 10 */              { r: 0, c: 6 },
  /* 11 - Green Gate */ { r: 0, c: 7 },
  /* 12 */              { r: 0, c: 8 },
  /* 13 - Green Start */{ r: 1, c: 8 },
  /* 14 */              { r: 2, c: 8 },
  /* 15 */              { r: 3, c: 8 },
  /* 16 */              { r: 4, c: 8 },
  /* 17 */              { r: 5, c: 8 },
  /* 18 */              { r: 6, c: 9 },
  /* 19 */              { r: 6, c: 10 },
  /* 20 */              { r: 6, c: 11 },
  /* 21 */              { r: 6, c: 12 },
  /* 22 */              { r: 6, c: 13 },
  /* 23 */              { r: 6, c: 14 },
  /* 24 - Yellow Gate*/ { r: 7, c: 14 },
  /* 25 */              { r: 8, c: 14 },
  /* 26 - Yellow Start*/{ r: 8, c: 13 },
  /* 27 */              { r: 8, c: 12 },
  /* 28 */              { r: 8, c: 11 },
  /* 29 */              { r: 8, c: 10 },
  /* 30 */              { r: 8, c: 9 },
  /* 31 */              { r: 9, c: 8 },
  /* 32 */              { r: 10, c: 8 },
  /* 33 */              { r: 11, c: 8 },
  /* 34 */              { r: 12, c: 8 },
  /* 35 */              { r: 13, c: 8 },
  /* 36 */              { r: 14, c: 8 },
  /* 37 - Blue Gate */  { r: 14, c: 7 },
  /* 38 */              { r: 14, c: 6 },
  /* 39 - Blue Start */ { r: 13, c: 6 },
  /* 40 */              { r: 12, c: 6 },
  /* 41 */              { r: 11, c: 6 },
  /* 42 */              { r: 10, c: 6 },
  /* 43 */              { r: 9, c: 6 },
  /* 44 */              { r: 8, c: 5 },
  /* 45 */              { r: 8, c: 4 },
  /* 46 */              { r: 8, c: 3 },
  /* 47 */              { r: 8, c: 2 },
  /* 48 */              { r: 8, c: 1 },
  /* 49 */              { r: 8, c: 0 },
  /* 50 - Red Gate */   { r: 7, c: 0 },
  /* 51 */              { r: 6, c: 0 }
];

const SAFE_INDICES = [0, 8, 13, 21, 26, 34, 39, 47];

const HOME_COLUMNS = {
  red: [
    { r: 7, c: 1 }, { r: 7, c: 2 }, { r: 7, c: 3 }, { r: 7, c: 4 }, { r: 7, c: 5 },
    { r: 7, c: 6 } // Goal
  ],
  green: [
    { r: 1, c: 7 }, { r: 2, c: 7 }, { r: 3, c: 7 }, { r: 4, c: 7 }, { r: 5, c: 7 },
    { r: 6, c: 7 } // Goal
  ],
  yellow: [
    { r: 7, c: 13 }, { r: 7, c: 12 }, { r: 7, c: 11 }, { r: 7, c: 10 }, { r: 7, c: 9 },
    { r: 7, c: 8 } // Goal
  ],
  blue: [
    { r: 13, c: 7 }, { r: 12, c: 7 }, { r: 11, c: 7 }, { r: 10, c: 7 }, { r: 9, c: 7 },
    { r: 8, c: 7 } // Goal
  ]
};

const YARD_COORDINATES = {
  red:    [{ r: 1.5, c: 1.5 }, { r: 1.5, c: 3.5 }, { r: 3.5, c: 1.5 }, { r: 3.5, c: 3.5 }],
  green:  [{ r: 1.5, c: 10.5 }, { r: 1.5, c: 12.5 }, { r: 3.5, c: 10.5 }, { r: 3.5, c: 12.5 }],
  yellow: [{ r: 10.5, c: 10.5 }, { r: 10.5, c: 12.5 }, { r: 12.5, c: 10.5 }, { r: 12.5, c: 12.5 }],
  blue:   [{ r: 10.5, c: 1.5 }, { r: 10.5, c: 3.5 }, { r: 12.5, c: 1.5 }, { r: 12.5, c: 3.5 }]
};

const PLAYER_METADATA = {
  red:    { name: 'Captain Red', startTrackIndex: 0, gateTrackIndex: 50 },
  green:  { name: 'Navigator Green', startTrackIndex: 13, gateTrackIndex: 11 },
  yellow: { name: 'Sniper Yellow', startTrackIndex: 26, gateTrackIndex: 24 },
  blue:   { name: 'Cook Blue', startTrackIndex: 39, gateTrackIndex: 37 }
};

// --- 2. GAME STATE (From Section 4 of Spec) ---
const GameState = {
  players: {},
  turnOrder: ['red', 'green', 'yellow', 'blue'],
  currentTurnIndex: 0,
  currentRollValue: null,
  hasRolled: false,
  consecutiveSixes: 0,
  isRollingAnimation: false,
  isMovingAnimation: false,
  gameStatus: 'SETUP', // 'SETUP' | 'PLAYING' | 'PAUSED' | 'FINISHED'
  winnerOrder: [],
  soundEnabled: true,
  turnTimer: null,
  timeLeft: 15
};

// --- 3. AUDIO ENGINE (Web Audio API) ---
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSound(soundType) {
  if (!GameState.soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  switch (soundType) {
    case 'roll':
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
      break;

    case 'step':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
      break;

    case 'capture':
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.35);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
      break;

    case 'home':
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(880, now + 0.25);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
      break;

    case 'win':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.15); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.3); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.45); // C6
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.7);
      osc.start(now);
      osc.stop(now + 0.7);
      break;

    case 'alert':
      osc.type = 'square';
      osc.frequency.setValueAtTime(220, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
      break;
  }
}

// --- 4. BOARD RENDERING (Grid Cells) ---
function renderBoardTiles() {
  const board = document.getElementById('ludo-board');
  // Clean dynamic path tiles if any exist
  const existingTiles = board.querySelectorAll('.board-tile');
  existingTiles.forEach(t => t.remove());

  // Render Track Tiles (0 - 51)
  TRACK_COORDINATES.forEach((coord, idx) => {
    const tile = document.createElement('div');
    tile.className = 'board-tile track-tile';
    tile.style.gridRow = `${coord.r + 1} / ${coord.r + 2}`;
    tile.style.gridColumn = `${coord.c + 1} / ${coord.c + 2}`;
    tile.style.position = 'absolute';
    tile.style.width = '6.666%';
    tile.style.height = '6.666%';
    tile.style.left = `${(coord.c / 15) * 100}%`;
    tile.style.top = `${(coord.r / 15) * 100}%`;
    tile.style.border = '1px solid #cbd5e1';
    tile.style.boxSizing = 'border-box';
    tile.style.display = 'flex';
    tile.style.justifyContent = 'center';
    tile.style.alignItems = 'center';
    tile.style.fontSize = '0.65rem';
    tile.style.fontWeight = 'bold';
    tile.style.color = '#64748b';

    // Highlight starting tiles & safe spots
    if (idx === 0) {
      tile.style.backgroundColor = 'rgba(239, 68, 68, 0.4)';
      tile.innerHTML = '★';
      tile.style.color = '#ef4444';
    } else if (idx === 13) {
      tile.style.backgroundColor = 'rgba(16, 185, 129, 0.4)';
      tile.innerHTML = '★';
      tile.style.color = '#10b981';
    } else if (idx === 26) {
      tile.style.backgroundColor = 'rgba(245, 158, 11, 0.4)';
      tile.innerHTML = '★';
      tile.style.color = '#f59e0b';
    } else if (idx === 39) {
      tile.style.backgroundColor = 'rgba(59, 130, 246, 0.4)';
      tile.innerHTML = '★';
      tile.style.color = '#3b82f6';
    } else if (SAFE_INDICES.includes(idx)) {
      tile.innerHTML = '🛡️';
      tile.style.fontSize = '0.7rem';
    }

    board.appendChild(tile);
  });

  // Render Home Columns
  ['red', 'green', 'yellow', 'blue'].forEach(color => {
    const colCoords = HOME_COLUMNS[color];
    colCoords.slice(0, 5).forEach((coord) => {
      const tile = document.createElement('div');
      tile.className = `board-tile home-col-tile home-${color}`;
      tile.style.position = 'absolute';
      tile.style.width = '6.666%';
      tile.style.height = '6.666%';
      tile.style.left = `${(coord.c / 15) * 100}%`;
      tile.style.top = `${(coord.r / 15) * 100}%`;
      tile.style.border = '1px solid #cbd5e1';
      tile.style.boxSizing = 'border-box';

      if (color === 'red') tile.style.backgroundColor = 'rgba(239, 68, 68, 0.7)';
      if (color === 'green') tile.style.backgroundColor = 'rgba(16, 185, 129, 0.7)';
      if (color === 'yellow') tile.style.backgroundColor = 'rgba(245, 158, 11, 0.7)';
      if (color === 'blue') tile.style.backgroundColor = 'rgba(59, 130, 246, 0.7)';

      board.appendChild(tile);
    });
  });
}

// --- 5. TOKEN POSITION CALCULATION & RENDERING ---
function getTokenBoardCoords(token) {
  if (token.state === 'yard') {
    return YARD_COORDINATES[token.color][token.id];
  }
  if (token.state === 'goal') {
    // Center intersection
    return HOME_COLUMNS[token.color][5];
  }
  if (token.state === 'home_column') {
    const colStep = token.stepProgress - 51; // 0 to 4
    return HOME_COLUMNS[token.color][colStep];
  }
  if (token.state === 'track') {
    return TRACK_COORDINATES[token.trackIndex];
  }
  return { r: 7, c: 7 };
}

function renderTokenPositions() {
  const allTokens = [];
  Object.values(GameState.players).forEach(p => {
    if (p.isActive) {
      allTokens.push(...p.tokens);
    }
  });

  // Group tokens occupying the same coordinate to offset them cleanly
  const clusters = {};

  allTokens.forEach(t => {
    const coords = getTokenBoardCoords(t);
    const key = `${coords.r.toFixed(1)}_${coords.c.toFixed(1)}`;
    if (!clusters[key]) clusters[key] = [];
    clusters[key].push(t);
  });

  allTokens.forEach(t => {
    const el = document.getElementById(`token-${t.color}-${t.id}`);
    if (!el) return;

    if (!GameState.players[t.color].isActive) {
      el.style.display = 'none';
      return;
    }
    el.style.display = 'flex';

    const coords = getTokenBoardCoords(t);
    const key = `${coords.r.toFixed(1)}_${coords.c.toFixed(1)}`;
    const cluster = clusters[key] || [t];
    const indexInCluster = cluster.indexOf(t);
    const clusterSize = cluster.length;

    let offsetX = 0;
    let offsetY = 0;

    if (clusterSize > 1) {
      // Offset multiple tokens occupying same tile
      const angle = (indexInCluster / clusterSize) * (2 * Math.PI);
      offsetX = Math.cos(angle) * 1.2;
      offsetY = Math.sin(angle) * 1.2;
    }

    // Convert 15x15 cell to percentage
    const leftPct = ((coords.c + 0.5) / 15) * 100;
    const topPct = ((coords.r + 0.5) / 15) * 100;

    el.style.left = `calc(${leftPct}% + ${offsetX}vw)`;
    el.style.top = `calc(${topPct}% + ${offsetY}vw)`;
    el.style.transform = `translate(-50%, -50%)`;
  });
}

// --- 6. SCORE CALCULATION & UI UPDATES ---
function computePlayerScore(player) {
  let score = 0;
  // Tokens in goal * 500
  score += player.tokensHome * 500;
  // Kills * 150
  score += player.kills * 150;
  // Steps * 2
  score += player.totalSteps * 2;
  // Tokens out of yard * 20
  const outOfYard = player.tokens.filter(t => t.state !== 'yard').length;
  score += outOfYard * 20;

  // Rank bonuses
  if (player.rank === 1) score += 1000;
  if (player.rank === 2) score += 500;

  return score;
}

function updateScoreboardUI() {
  ['red', 'green', 'yellow', 'blue'].forEach(color => {
    const p = GameState.players[color];
    const card = document.getElementById(`scorecard-${color}`);
    if (!card) return;

    if (!p || !p.isActive) {
      card.style.opacity = '0.4';
      return;
    }
    card.style.opacity = '1';

    const currentScore = computePlayerScore(p);
    p.score = currentScore;

    const elScore = document.getElementById(`stat-${color}-score`);
    const elHome = document.getElementById(`stat-${color}-home`);
    const elKills = document.getElementById(`stat-${color}-kills`);
    const elSteps = document.getElementById(`stat-${color}-steps`);

    if (elScore) elScore.textContent = currentScore;
    if (elHome) elHome.textContent = `${p.tokensHome}/4`;
    if (elKills) elKills.textContent = p.kills;
    if (elSteps) elSteps.textContent = p.totalSteps;
  });
}

// --- 7. ACTIVITY LOGGING ---
function addLogEntry(message, type = 'move') {
  const logList = document.getElementById('game-log-list');
  if (!logList) return;

  const li = document.createElement('li');
  li.className = `log-item ${type}`;
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  li.textContent = `[${time}] ${message}`;

  logList.prepend(li);

  while (logList.children.length > 50) {
    logList.removeChild(logList.lastChild);
  }
}

// --- 8. TURN TIMER ---
function startTurnTimer() {
  clearInterval(GameState.turnTimer);
  GameState.timeLeft = 15;
  const bar = document.getElementById('turn-timer-progress');
  if (bar) bar.style.width = '100%';

  GameState.turnTimer = setInterval(() => {
    if (GameState.gameStatus !== 'PLAYING') return;

    GameState.timeLeft -= 1;
    if (bar) {
      const pct = (GameState.timeLeft / 15) * 100;
      bar.style.width = `${pct}%`;
    }

    if (GameState.timeLeft <= 0) {
      clearInterval(GameState.turnTimer);
      addLogEntry(`${GameState.players[getActiveColor()].name} ran out of time!`, 'warning');
      playSound('alert');
      nextTurn();
    }
  }, 1000);
}

function stopTurnTimer() {
  clearInterval(GameState.turnTimer);
}

function getActiveColor() {
  return GameState.turnOrder[GameState.currentTurnIndex];
}

// --- 9. MOVE LOGIC & VALIDATION ---
function getValidMoves(playerColor, rollValue) {
  const p = GameState.players[playerColor];
  if (!p || !p.isActive) return [];

  const validTokens = [];

  p.tokens.forEach(token => {
    if (token.state === 'goal') return;

    if (token.state === 'yard') {
      if (rollValue === 6) {
        validTokens.push(token);
      }
    } else {
      // Step progress bounds check (exact roll to goal 56)
      if (token.stepProgress + rollValue <= 56) {
        validTokens.push(token);
      }
    }
  });

  return validTokens;
}

function clearTokenSelectables() {
  const selectable = document.querySelectorAll('.token-selectable');
  selectable.forEach(el => el.classList.remove('token-selectable'));
}

async function executeMove(token, steps) {
  GameState.isMovingAnimation = true;
  stopTurnTimer();
  clearTokenSelectables();

  const player = GameState.players[token.color];

  // Moving out of yard
  if (token.state === 'yard' && steps === 6) {
    token.state = 'track';
    token.stepProgress = 0;
    token.trackIndex = player.startTrackIndex;
    player.totalSteps += 1;
    playSound('step');
    renderTokenPositions();
    updateScoreboardUI();
    addLogEntry(`${player.name} deployed token to start!`, 'move');
    await new Promise(r => setTimeout(r, 300));
  } else {
    // Step by step animation along track/home stretch
    for (let s = 1; s <= steps; s++) {
      token.stepProgress += 1;
      player.totalSteps += 1;

      if (token.stepProgress <= 50) {
        token.state = 'track';
        // Compute circular track index
        token.trackIndex = (player.startTrackIndex + token.stepProgress) % 52;
      } else if (token.stepProgress < 56) {
        token.state = 'home_column';
        token.trackIndex = null;
      } else if (token.stepProgress === 56) {
        token.state = 'goal';
        token.trackIndex = null;
      }

      playSound('step');
      renderTokenPositions();
      updateScoreboardUI();
      await new Promise(r => setTimeout(r, 160));
    }
  }

  let earnedBonusRoll = false;

  // Check Goal Entry
  if (token.state === 'goal') {
    player.tokensHome += 1;
    playSound('home');
    addLogEntry(`🎯 ${player.name}'s token reached the GOAL! (+500 pts)`, 'goal');
    earnedBonusRoll = true;

    // Check if player finished
    if (player.tokensHome === 4 && player.rank === 0) {
      GameState.winnerOrder.push(player.color);
      player.rank = GameState.winnerOrder.length;
      addLogEntry(`🏆 ${player.name} finished in Rank #${player.rank}!`, 'goal');
    }
  }

  // Check Captures on common track
  if (token.state === 'track') {
    const tileIndex = token.trackIndex;
    const isSafeTile = SAFE_INDICES.includes(tileIndex);

    if (!isSafeTile) {
      // Look for opponent tokens on tile
      Object.values(GameState.players).forEach(otherPlayer => {
        if (!otherPlayer.isActive || otherPlayer.color === token.color) return;

        otherPlayer.tokens.forEach(otherToken => {
          if (otherToken.state === 'track' && otherToken.trackIndex === tileIndex) {
            // Knock out!
            otherToken.state = 'yard';
            otherToken.stepProgress = -1;
            otherToken.trackIndex = null;
            player.kills += 1;
            playSound('capture');
            earnedBonusRoll = true;
            addLogEntry(`⚔️ ${player.name} knocked out ${otherPlayer.name}'s token!`, 'kill');
          }
        });
      });
    }
  }

  renderTokenPositions();
  updateScoreboardUI();

  GameState.isMovingAnimation = false;

  // Check Game Over
  if (checkGameOver()) return;

  // Check if player gets a bonus roll:
  // 1. Rolled a 6
  // 2. Captured an opponent
  // 3. Token reached goal
  if (steps === 6 || earnedBonusRoll) {
    GameState.hasRolled = false;
    GameState.currentRollValue = null;
    const diceReadout = document.getElementById('dice-result-value');
    if (diceReadout) diceReadout.textContent = '-';

    const instructions = document.getElementById('turn-instructions');
    if (instructions) instructions.textContent = 'Bonus roll earned! Roll again.';
    addLogEntry(`${player.name} earned an extra roll!`, 'roll');

    startTurnTimer();

    // If bot, trigger roll
    if (player.type === 'bot') {
      setTimeout(handleDiceRoll, 700);
    }
  } else {
    // Next player's turn
    nextTurn();
  }
}

// --- 10. BOT DECISION ENGINE (Heuristic Weighting from Spec Section 5.5) ---
function runBotTurn(validTokens) {
  const activeColor = getActiveColor();
  const player = GameState.players[activeColor];
  const roll = GameState.currentRollValue;

  let bestToken = validTokens[0];
  let highestScore = -Infinity;

  validTokens.forEach(token => {
    let score = 0;
    const targetProgress = (token.state === 'yard') ? 0 : token.stepProgress + roll;

    // 1. Reaching goal
    if (targetProgress === 56) {
      score += 1000;
    }

    // 2. Exiting yard
    if (token.state === 'yard' && roll === 6) {
      score += 500;
    }

    if (targetProgress <= 50 && targetProgress >= 0) {
      const targetTile = (player.startTrackIndex + targetProgress) % 52;
      const isSafe = SAFE_INDICES.includes(targetTile);

      // Safe tile entry
      if (isSafe) score += 300;

      // Knockout check
      if (!isSafe) {
        Object.values(GameState.players).forEach(other => {
          if (other.color === activeColor || !other.isActive) return;
          other.tokens.forEach(ot => {
            if (ot.state === 'track' && ot.trackIndex === targetTile) {
              score += 800; // Capture opponent
            }
          });
        });
      }

      // Escaping danger check (is an opponent 1-6 tiles behind current position?)
      if (token.state === 'track') {
        const curTile = token.trackIndex;
        Object.values(GameState.players).forEach(other => {
          if (other.color === activeColor || !other.isActive) return;
          other.tokens.forEach(ot => {
            if (ot.state === 'track') {
              const dist = (curTile - ot.trackIndex + 52) % 52;
              if (dist >= 1 && dist <= 6) {
                score += 250;
              }
            }
          });
        });
      }
    }

    // Distance toward goal
    score += targetProgress * 5;

    if (score > highestScore) {
      highestScore = score;
      bestToken = token;
    }
  });

  setTimeout(() => {
    executeMove(bestToken, roll);
  }, 600);
}

// --- 11. DICE ROLLING ---
function handleDiceRoll() {
  if (GameState.hasRolled || GameState.isRollingAnimation || GameState.isMovingAnimation) return;
  if (GameState.gameStatus !== 'PLAYING') return;

  const activeColor = getActiveColor();
  const player = GameState.players[activeColor];

  GameState.isRollingAnimation = true;
  stopTurnTimer();

  const diceCube = document.getElementById('dice-cube');
  const btnRoll = document.getElementById('btn-roll-dice');
  if (btnRoll) btnRoll.disabled = true;

  playSound('roll');

  // Random spin classes
  const rollValue = Math.floor(Math.random() * 6) + 1;
  GameState.currentRollValue = rollValue;
  GameState.hasRolled = true;

  // Add tumble animation
  if (diceCube) {
    diceCube.className = '';
    void diceCube.offsetWidth; // trigger reflow
    diceCube.classList.add(`show-${rollValue}`);
  }

  setTimeout(() => {
    GameState.isRollingAnimation = false;
    if (btnRoll) btnRoll.disabled = false;

    const diceReadout = document.getElementById('dice-result-value');
    if (diceReadout) diceReadout.textContent = rollValue;

    addLogEntry(`${player.name} rolled a ${rollValue}!`, 'roll');

    // Rule 5.1: 6s handling
    if (rollValue === 6) {
      GameState.consecutiveSixes += 1;
      player.totalSteps += 5; // roll bonus
      updateScoreboardUI();

      if (GameState.consecutiveSixes === 3) {
        addLogEntry(`⚠️ Three consecutive 6s! ${player.name} forfeits turn!`, 'warning');
        playSound('alert');
        GameState.consecutiveSixes = 0;
        setTimeout(nextTurn, 1000);
        return;
      }
    } else {
      GameState.consecutiveSixes = 0;
    }

    // Evaluate possible moves
    const validMoves = getValidMoves(activeColor, rollValue);

    if (validMoves.length === 0) {
      const instructions = document.getElementById('turn-instructions');
      if (instructions) instructions.textContent = 'No valid moves available!';
      addLogEntry(`${player.name} has no valid moves.`, 'warning');
      setTimeout(nextTurn, 1000);
      return;
    }

    // Valid moves exist
    if (player.type === 'bot') {
      const instructions = document.getElementById('turn-instructions');
      if (instructions) instructions.textContent = `${player.name} (Bot) is calculating move...`;
      runBotTurn(validMoves);
    } else {
      // Human turn
      if (validMoves.length === 1) {
        // Auto-move single valid token
        const singleToken = validMoves[0];
        const el = document.getElementById(`token-${singleToken.color}-${singleToken.id}`);
        if (el) el.classList.add('token-selectable');

        const instructions = document.getElementById('turn-instructions');
        if (instructions) instructions.textContent = 'Auto-moving eligible token...';

        setTimeout(() => {
          executeMove(singleToken, rollValue);
        }, 400);
      } else {
        // Multiple choices: highlight and await click
        validMoves.forEach(token => {
          const el = document.getElementById(`token-${token.color}-${token.id}`);
          if (el) el.classList.add('token-selectable');
        });

        const instructions = document.getElementById('turn-instructions');
        if (instructions) instructions.textContent = 'Select a glowing token to move!';
        startTurnTimer();
      }
    }
  }, 800);
}

// --- 12. TOKEN CLICK HANDLER ---
function onTokenClicked(event) {
  if (GameState.isMovingAnimation || GameState.isRollingAnimation) return;
  if (!GameState.hasRolled || !GameState.currentRollValue) return;

  const target = event.currentTarget;
  const color = target.getAttribute('data-color');
  const index = parseInt(target.getAttribute('data-index'), 10);
  const activeColor = getActiveColor();

  if (color !== activeColor) return;
  if (!target.classList.contains('token-selectable')) return;

  const player = GameState.players[color];
  const token = player.tokens[index];

  executeMove(token, GameState.currentRollValue);
}

// --- 13. TURN CYCLE ---
function nextTurn() {
  clearTokenSelectables();
  stopTurnTimer();

  GameState.hasRolled = false;
  GameState.currentRollValue = null;

  const diceReadout = document.getElementById('dice-result-value');
  if (diceReadout) diceReadout.textContent = '-';

  // Find next active player who hasn't finished all 4 tokens
  let attempts = 0;
  do {
    GameState.currentTurnIndex = (GameState.currentTurnIndex + 1) % GameState.turnOrder.length;
    attempts++;
  } while (
    attempts < 8 &&
    (!GameState.players[getActiveColor()].isActive || GameState.players[getActiveColor()].tokensHome === 4)
  );

  GameState.consecutiveSixes = 0;

  const activeColor = getActiveColor();
  const player = GameState.players[activeColor];

  // Update UI badge & name
  const badge = document.getElementById('current-turn-badge');
  if (badge) {
    badge.className = `badge-${activeColor}`;
  }

  const nameEl = document.getElementById('current-player-name');
  if (nameEl) {
    nameEl.textContent = `${player.name}'s Turn (${player.type.toUpperCase()})`;
  }

  const instructions = document.getElementById('turn-instructions');
  if (instructions) {
    instructions.textContent = player.type === 'human'
      ? 'Roll the dice to make your move!'
      : `${player.name} is preparing to roll...`;
  }

  startTurnTimer();

  // If Bot, roll after delay
  if (player.type === 'bot' && GameState.gameStatus === 'PLAYING') {
    setTimeout(handleDiceRoll, 800);
  }
}

// --- 14. GAME OVER CHECK & MODALS ---
function checkGameOver() {
  const activePlayers = Object.values(GameState.players).filter(p => p.isActive);
  const unfinishedPlayers = activePlayers.filter(p => p.tokensHome < 4);

  // If only 1 or 0 unfinished players remain
  if (unfinishedPlayers.length <= 1 && activePlayers.length > 1) {
    GameState.gameStatus = 'FINISHED';
    stopTurnTimer();

    // Assign final rank to remaining player
    if (unfinishedPlayers.length === 1) {
      const remaining = unfinishedPlayers[0];
      if (remaining.rank === 0) {
        GameState.winnerOrder.push(remaining.color);
        remaining.rank = GameState.winnerOrder.length;
      }
    }

    updateScoreboardUI();
    playSound('win');
    showWinnerModal();
    return true;
  }
  return false;
}

function showWinnerModal() {
  const winnerModal = document.getElementById('winner-modal');
  if (!winnerModal) return;

  const winnerColor = GameState.winnerOrder[0] || 'red';
  const winner = GameState.players[winnerColor];

  const winnerName = document.getElementById('winner-name');
  if (winnerName) {
    winnerName.textContent = `🏆 ${winner.name} Won!`;
    winnerName.style.color = `var(--${winnerColor})`;
  }

  const podium = document.getElementById('winner-podium');
  if (podium) {
    podium.innerHTML = '';
    GameState.winnerOrder.forEach((color, idx) => {
      const p = GameState.players[color];
      const div = document.createElement('div');
      div.className = 'podium-item';
      div.innerHTML = `<strong>#${idx + 1}</strong>: ${p.name} <br> <span style="color: var(--yellow)">${p.score} pts</span>`;
      podium.appendChild(div);
    });
  }

  const table = document.getElementById('winner-final-stats');
  if (table) {
    table.innerHTML = `
      <tr>
        <th>Rank</th>
        <th>Player</th>
        <th>Score</th>
        <th>Goals</th>
        <th>Kills</th>
        <th>Steps</th>
      </tr>
    `;
    GameState.winnerOrder.forEach((color, idx) => {
      const p = GameState.players[color];
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>#${idx + 1}</td>
        <td style="color: var(--${color}); font-weight: bold;">${p.name}</td>
        <td>${p.score}</td>
        <td>${p.tokensHome}/4</td>
        <td>${p.kills}</td>
        <td>${p.totalSteps}</td>
      `;
      table.appendChild(tr);
    });
  }

  winnerModal.classList.add('active');
}

// --- 15. INITIALIZATION & MATCH CREATION ---
function startNewMatch(config) {
  // config: { playerCount: number, playerTypes: { red, green, yellow, blue } }
  GameState.winnerOrder = [];
  GameState.consecutiveSixes = 0;
  GameState.currentRollValue = null;
  GameState.hasRolled = false;
  GameState.isRollingAnimation = false;
  GameState.isMovingAnimation = false;

  const colors = ['red', 'green', 'yellow', 'blue'];
  let activeColors = [];

  if (config.playerCount === 2) {
    activeColors = ['red', 'yellow'];
  } else if (config.playerCount === 3) {
    activeColors = ['red', 'green', 'yellow'];
  } else {
    activeColors = ['red', 'green', 'yellow', 'blue'];
  }

  colors.forEach(c => {
    const isActive = activeColors.includes(c);
    const tokens = [];
    for (let i = 0; i < 4; i++) {
      tokens.push({
        id: i,
        color: c,
        state: 'yard',
        stepProgress: -1,
        trackIndex: null
      });
    }

    GameState.players[c] = {
      color: c,
      name: PLAYER_METADATA[c].name,
      type: config.playerTypes[c] || 'human',
      isActive: isActive,
      tokens: tokens,
      startTrackIndex: PLAYER_METADATA[c].startTrackIndex,
      gateTrackIndex: PLAYER_METADATA[c].gateTrackIndex,
      score: 0,
      kills: 0,
      tokensHome: 0,
      totalSteps: 0,
      rank: 0
    };
  });

  GameState.turnOrder = activeColors;
  GameState.currentTurnIndex = 0;
  GameState.gameStatus = 'PLAYING';

  renderBoardTiles();
  renderTokenPositions();
  updateScoreboardUI();

  // Reset dice readout
  const readout = document.getElementById('dice-result-value');
  if (readout) readout.textContent = '-';

  addLogEntry(`New Match started with ${config.playerCount} players!`, 'move');

  const firstColor = getActiveColor();
  const firstPlayer = GameState.players[firstColor];

  const badge = document.getElementById('current-turn-badge');
  if (badge) badge.className = `badge-${firstColor}`;

  const nameEl = document.getElementById('current-player-name');
  if (nameEl) nameEl.textContent = `${firstPlayer.name}'s Turn (${firstPlayer.type.toUpperCase()})`;

  const instructions = document.getElementById('turn-instructions');
  if (instructions) instructions.textContent = 'Roll the dice to start!';

  startTurnTimer();

  if (firstPlayer.type === 'bot') {
    setTimeout(handleDiceRoll, 1000);
  }
}

function initGame() {
  // Attach Token Clicks
  const tokenEls = document.querySelectorAll('.ludo-token');
  tokenEls.forEach(el => {
    el.addEventListener('click', onTokenClicked);
  });

  // Roll Button
  const btnRoll = document.getElementById('btn-roll-dice');
  if (btnRoll) {
    btnRoll.addEventListener('click', handleDiceRoll);
  }

  // Sound Toggle
  const btnSound = document.getElementById('btn-sound-toggle');
  if (btnSound) {
    btnSound.addEventListener('click', () => {
      GameState.soundEnabled = !GameState.soundEnabled;
      btnSound.textContent = GameState.soundEnabled ? '🔊 Audio' : '🔇 Muted';
      btnSound.style.opacity = GameState.soundEnabled ? '1' : '0.6';
    });
  }

  // Rules Modal
  const btnRules = document.getElementById('btn-rules-toggle');
  const rulesModal = document.getElementById('rules-modal');
  const btnCloseRules = document.getElementById('btn-close-rules');
  if (btnRules && rulesModal) {
    btnRules.addEventListener('click', () => rulesModal.classList.add('active'));
  }
  if (btnCloseRules && rulesModal) {
    btnCloseRules.addEventListener('click', () => rulesModal.classList.remove('active'));
  }

  // Setup Modal Triggers
  const setupModal = document.getElementById('setup-modal');
  const btnNewGame = document.getElementById('btn-new-game-modal');
  const btnStartGame = document.getElementById('btn-start-game');
  const btnReset = document.getElementById('btn-reset-game');

  if (btnNewGame && setupModal) {
    btnNewGame.addEventListener('click', () => setupModal.classList.add('active'));
  }

  if (btnStartGame && setupModal) {
    btnStartGame.addEventListener('click', () => {
      getAudioContext(); // user interaction unlocked
      const count = parseInt(document.getElementById('setup-player-count').value, 10);
      const types = {
        red: document.getElementById('p-red-type').value,
        green: document.getElementById('p-green-type').value,
        yellow: document.getElementById('p-yellow-type').value,
        blue: document.getElementById('p-blue-type').value
      };
      setupModal.classList.remove('active');
      startNewMatch({ playerCount: count, playerTypes: types });
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      const activeColors = Object.values(GameState.players).filter(p => p.isActive).length || 4;
      const types = {};
      ['red', 'green', 'yellow', 'blue'].forEach(c => {
        types[c] = GameState.players[c] ? GameState.players[c].type : 'human';
      });
      startNewMatch({ playerCount: activeColors, playerTypes: types });
    });
  }

  // Winner Modal Handlers
  const winnerModal = document.getElementById('winner-modal');
  const btnWinnerPlayAgain = document.getElementById('btn-winner-play-again');
  const btnWinnerClose = document.getElementById('btn-winner-close');

  if (btnWinnerPlayAgain && winnerModal) {
    btnWinnerPlayAgain.addEventListener('click', () => {
      winnerModal.classList.remove('active');
      if (setupModal) setupModal.classList.add('active');
    });
  }

  if (btnWinnerClose && winnerModal) {
    btnWinnerClose.addEventListener('click', () => {
      winnerModal.classList.remove('active');
    });
  }

  // Clear Log
  const btnClearLog = document.getElementById('btn-clear-log');
  if (btnClearLog) {
    btnClearLog.addEventListener('click', () => {
      const logList = document.getElementById('game-log-list');
      if (logList) logList.innerHTML = '';
    });
  }

  // Pre-render tiles
  renderBoardTiles();
}

// Start application on load
window.addEventListener('DOMContentLoaded', initGame);
