/**
 * AI Decision Making Module for Ludo
 */

import { getState } from './state.js';
import { executeMove, validateLegalMoves } from './game.js';

/**
 * Executes AI move decision after strategic heuristic evaluation
 * @param {string} playerColor 
 * @param {number} diceVal 
 */
export const makeAIMove = (playerColor, diceVal) => {
  const state = getState();
  if (state.status !== 'playing' || state.currentTurnColor !== playerColor) return;

  const legalTokenIds = validateLegalMoves(playerColor, diceVal);
  if (legalTokenIds.length === 0) return;

  // Heuristic evaluation for AI move selection:
  // 1. Prioritize capturing opponent tokens if possible
  // 2. Prioritize moving token into goal / home stretch
  // 3. Prioritize moving out of base if 6 is rolled
  // 4. Prioritize advancing furthest token or random valid move

  let chosenTokenId = legalTokenIds[0];
  const player = state.players[playerColor];

  // Check capture opportunities
  for (const tid of legalTokenIds) {
    const token = player.tokens[tid];
    let simulatedSteps = token.stepsTraveled + diceVal;
    if (token.state === 'base' && diceVal === 6) simulatedSteps = 0;

    if (token.state === 'track' || (token.state === 'base' && diceVal === 6)) {
      // Calculate target track index
      const startOffsets = { red: 0, green: 13, yellow: 26, blue: 39 };
      const absoluteIdx = token.state === 'base' ? startOffsets[playerColor] : (token.position + diceVal) % 52;
      
      // Check if any opponent is on that absolute track index
      for (const [opColor, opPlayer] of Object.entries(state.players)) {
        if (opColor === playerColor || opPlayer.isEliminated) continue;
        const isSafe = [0, 8, 13, 21, 26, 34, 39, 47].includes(absoluteIdx);
        if (!isSafe) {
          const hasOpToken = opPlayer.tokens.some(t => t.state === 'track' && t.position === absoluteIdx);
          if (hasOpToken) {
            chosenTokenId = tid;
            break;
          }
        }
      }
    }
  }

  // If no capture, prefer entering home / goal or moving out of base
  if (chosenTokenId === legalTokenIds[0]) {
    const baseMoves = legalTokenIds.filter(tid => player.tokens[tid].state === 'base');
    const homeMoves = legalTokenIds.filter(tid => player.tokens[tid].state === 'home' || player.tokens[tid].stepsTraveled > 50);

    if (homeMoves.length > 0) {
      chosenTokenId = homeMoves[0];
    } else if (baseMoves.length > 0 && diceVal === 6) {
      chosenTokenId = baseMoves[0];
    } else {
      // Pick the token furthest along
      let maxSteps = -1;
      legalTokenIds.forEach(tid => {
        const t = player.tokens[tid];
        if (t.stepsTraveled > maxSteps) {
          maxSteps = t.stepsTraveled;
          chosenTokenId = tid;
        }
      });
    }
  }

  // Execute move after slight human-like delay
  setTimeout(() => {
    executeMove(playerColor, chosenTokenId, diceVal);
  }, 600);
};
