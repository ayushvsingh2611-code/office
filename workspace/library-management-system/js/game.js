/**
 * Core Game Logic, Rule Enforcement, Movement Validation, Captures
 */

import { getState, setState } from './state.js';
import { renderBoard, renderTokens } from './board.js';
import { rollDice, renderDice } from './dice.js';
import { playSound } from './audio.js';
import { makeAIMove } from './ai.js';

const START_OFFSETS = { red: 0, green: 13, yellow: 26, blue: 39 };

/**
 * Initializes a new game with user configuration
 * @param {Object} config 
 */
export const initGame = (config) => {
  const { playerCount, playerConfigs } = config;
  const allColors = ['red', 'green', 'yellow', 'blue'];
  const activeColors = allColors.slice(0, playerCount);

  const players = {};
  activeColors.forEach(color => {
    players[color] = {
      color,
      name: playerConfigs[color].name || `${color.charAt(0).toUpperCase() + color.slice(1)} Player`,
      type: playerConfigs[color].type || 'human',
      isEliminated: false,
      rank: 0,
      tokens: [0, 1, 2, 3].map(id => ({
        id,
        color,
        state: 'base',
        position: -1,
        stepsTraveled: -1
      }))
    };
  });

  setState({
    status: 'playing',
    activePlayerColors: activeColors,
    currentTurnColor: activeColors[0],
    diceValue: null,
    hasRolled: false,
    hasMoved: false,
    consecutiveSixes: 0,
    players,
    winner: null,
    moveHistory: []
  });

  renderBoard('ludo-board');
  renderTokens(getState());
  updateHUD();

  // If first player is AI, trigger AI roll
  checkAITurn();
};

export const updateHUD = () => {
  const state = getState();
  const indicator = document.getElementById('current-turn-indicator');
  const display = document.getElementById('current-turn-display');

  if (indicator && display) {
    indicator.className = `turn-badge ${state.currentTurnColor}`;
    const playerName = state.players[state.currentTurnColor]?.name || state.currentTurnColor;
    display.textContent = `${playerName}'s Turn ${state.hasRolled && !state.hasMoved ? '(Select Token)' : ''}`;
  }

  renderDice(state.diceValue);
  renderTokens(state);
  highlightMovableTokens();
};

export const highlightMovableTokens = () => {
  document.querySelectorAll('.token').forEach(el => el.classList.remove('movable'));
  const state = getState();
  if (!state.hasRolled || state.hasMoved || state.diceValue === null) return;

  const legalTokenIds = validateLegalMoves(state.currentTurnColor, state.diceValue);
  legalTokenIds.forEach(tid => {
    const tokenEl = document.querySelector(`.token[data-player-id="${state.currentTurnColor}"][data-token-id="${tid}"]`);
    if (tokenEl) tokenEl.classList.add('movable');
  });
};

/**
 * Validates which token IDs can legally move for the current player & dice value
 * @param {string} playerColor 
 * @param {number} diceVal 
 * @returns {number[]}
 */
export const validateLegalMoves = (playerColor, diceVal) => {
  const state = getState();
  const player = state.players[playerColor];
  const legalIds = [];

  player.tokens.forEach(token => {
    if (token.state === 'goal') return;

    if (token.state === 'base') {
      if (diceVal === 6) {
        legalIds.push(token.id);
      }
    } else if (token.state === 'track') {
      const newSteps = token.stepsTraveled + diceVal;
      if (newSteps <= 56) {
        legalIds.push(token.id);
      }
    } else if (token.state === 'home') {
      const newHomePos = token.position + diceVal;
      if (newHomePos <= 5) {
        legalIds.push(token.id);
      }
    }
  });

  return legalIds;
};

export const handleDiceRollClick = async () => {
  const state = getState();
  if (state.status !== 'playing' || state.hasRolled) return;

  // Check if current player is human
  const currentPlayer = state.players[state.currentTurnColor];
  if (currentPlayer.type === 'ai') return;

  playSound('roll');
  const diceVal = await rollDice();

  setState({ diceValue: diceVal, hasRolled: true });

  const legalMoves = validateLegalMoves(state.currentTurnColor, diceVal);

  if (legalMoves.length === 0) {
    showToast(`No legal moves for ${currentPlayer.name}!`);
    setTimeout(() => {
      advanceTurn();
    }, 1200);
  } else {
    updateHUD();
  }
};

export const handleTokenClick = (color, tokenId) => {
  const state = getState();
  if (state.status !== 'playing' || !state.hasRolled || state.hasMoved) return;
  if (state.currentTurnColor !== color) return;

  const currentPlayer = state.players[color];
  if (currentPlayer.type === 'ai') return;

  const legalMoves = validateLegalMoves(color, state.diceValue);
  if (!legalMoves.includes(tokenId)) {
    showToast('Invalid move for this token!');
    return;
  }

  executeMove(color, tokenId, state.diceValue);
};

/**
 * Executes token movement, captures, and turn progression
 * @param {string} playerColor 
 * @param {number} tokenId 
 * @param {number} diceVal 
 */
export const executeMove = (playerColor, tokenId, diceVal) => {
  const state = getState();
  const player = state.players[playerColor];
  const token = player.tokens[tokenId];

  // Save current state to history for undo
  const historySnapshot = JSON.parse(JSON.stringify(state));

  let captured = false;
  let reachedGoal = false;

  // Clone players structure for immutability update
  const updatedPlayers = JSON.parse(JSON.stringify(state.players));
  const targetPlayer = updatedPlayers[playerColor];
  const targetToken = targetPlayer.tokens[tokenId];

  if (targetToken.state === 'base' && diceVal === 6) {
    // Exit base onto starting track
    targetToken.state = 'track';
    targetToken.position = START_OFFSETS[playerColor];
    targetToken.stepsTraveled = 0;
    playSound('move');
  } else if (targetToken.state === 'track') {
    const newSteps = targetToken.stepsTraveled + diceVal;
    if (newSteps === 56) {
      targetToken.state = 'goal';
      targetToken.position = -1;
      targetToken.stepsTraveled = 56;
      reachedGoal = true;
      playSound('safe');
    } else if (newSteps > 50) {
      // Enter home stretch
      targetToken.state = 'home';
      targetToken.position = newSteps - 51;
      targetToken.stepsTraveled = newSteps;
      playSound('move');
    } else {
      targetToken.state = 'track';
      targetToken.position = (targetToken.position + diceVal) % 52;
      targetToken.stepsTraveled = newSteps;
      playSound('move');

      // Check for captures
      const absolutePos = targetToken.position;
      const isSafe = [0, 8, 13, 21, 26, 34, 39, 47].includes(absolutePos);

      if (!isSafe) {
        for (const [opColor, opPlayer] of Object.entries(updatedPlayers)) {
          if (opColor === playerColor || opPlayer.isEliminated) continue;
          opPlayer.tokens.forEach(opTok => {
            if (opTok.state === 'track' && opTok.position === absolutePos) {
              // Capture opponent token back to base
              opTok.state = 'base';
              opTok.position = -1;
              opTok.stepsTraveled = -1;
              captured = true;
            }
          });
        }
      }
      if (captured) playSound('capture');
    }
  } else if (targetToken.state === 'home') {
    const newHomePos = targetToken.position + diceVal;
    if (newHomePos === 5) {
      targetToken.state = 'goal';
      targetToken.position = -1;
      targetToken.stepsTraveled = 56;
      reachedGoal = true;
      playSound('safe');
    } else if (newHomePos < 5) {
      targetToken.position = newHomePos;
      targetToken.stepsTraveled += diceVal;
      playSound('move');
    }
  }

  // Check win condition for player
  const allInGoal = targetPlayer.tokens.every(t => t.state === 'goal');
  let winner = state.winner;

  if (allInGoal && !winner) {
    winner = playerColor;
    playSound('win');
    showWinModal(playerColor);
  }

  // Consecutive sixes rule: 3 consecutive sixes forfeit turn
  let consecutiveSixes = state.consecutiveSixes;
  if (diceVal === 6) {
    consecutiveSixes++;
  } else {
    consecutiveSixes = 0;
  }

  if (consecutiveSixes >= 3) {
    showToast('Three consecutive 6s! Turn forfeited.');
    consecutiveSixes = 0;
  }

  setState({
    players: updatedPlayers,
    hasMoved: true,
    consecutiveSixes,
    winner,
    moveHistory: [...state.moveHistory, historySnapshot]
  });

  if (captured) showToast('Captured opponent token!');
  if (reachedGoal) showToast('Token reached goal! 🎉');

  // Determine next turn: extra turn if rolling 6 (and under 3 consecutive sixes) and not won
  setTimeout(() => {
    if (winner) return;

    if (diceVal === 6 && consecutiveSixes > 0 && consecutiveSixes < 3) {
      showToast(`${player.name} rolled a 6 and gets an extra turn!`);
      setState({ diceValue: null, hasRolled: false, hasMoved: false });
      updateHUD();
      checkAITurn();
    } else {
      advanceTurn();
    }
  }, 600);
};

export const advanceTurn = () => {
  const state = getState();
  if (state.winner) return;

  const activeColors = state.activePlayerColors;
  const currentIndex = activeColors.indexOf(state.currentTurnColor);
  const nextIndex = (currentIndex + 1) % activeColors.length;
  const nextColor = activeColors[nextIndex];

  setState({
    currentTurnColor: nextColor,
    diceValue: null,
    hasRolled: false,
    hasMoved: false,
    consecutiveSixes: 0
  });

  updateHUD();
  checkAITurn();
};

export const checkAITurn = () => {
  const state = getState();
  if (state.status !== 'playing' || state.winner) return;

  const currentPlayer = state.players[state.currentTurnColor];
  if (currentPlayer && currentPlayer.type === 'ai' && !state.hasRolled) {
    setTimeout(async () => {
      playSound('roll');
      const diceVal = await rollDice();
      setState({ diceValue: diceVal, hasRolled: true });
      updateHUD();
      makeAIMove(state.currentTurnColor, diceVal);
    }, 800);
  }
};

export const undoLastMove = () => {
  const state = getState();
  if (state.moveHistory.length === 0 || state.hasMoved === false) {
    showToast('Cannot undo at this moment.');
    return;
  }

  const lastSnapshot = state.moveHistory[state.moveHistory.length - 1];
  const newHistory = state.moveHistory.slice(0, -1);

  setState({
    players: lastSnapshot.players,
    currentTurnColor: lastSnapshot.currentTurnColor,
    diceValue: lastSnapshot.diceValue,
    hasRolled: lastSnapshot.hasRolled,
    hasMoved: lastSnapshot.hasMoved,
    consecutiveSixes: lastSnapshot.consecutiveSixes,
    moveHistory: newHistory
  });

  updateHUD();
  showToast('Last move undone.');
};

export const showToast = (message) => {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2500);
};

export const showWinModal = (winnerColor) => {
  const modal = document.getElementById('win-modal');
  const msg = document.getElementById('win-message');
  const state = getState();
  if (modal && msg) {
    const winnerName = state.players[winnerColor]?.name || winnerColor;
    msg.textContent = `🎉 ${winnerName} Wins! 🎉`;
    modal.classList.add('active');
    setState({ status: 'ended' });
  }
};
