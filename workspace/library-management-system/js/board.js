/**
 * Ludo Board Module - Track definitions, coordinate maps, grid rendering
 */

// 52 Step Main Circuit Track Coordinates mapping index (0-51) to {x, y}
const MAIN_TRACK_COORDS = [
  {x: 1, y: 6},  {x: 2, y: 6},  {x: 3, y: 6},  {x: 4, y: 6},  {x: 5, y: 6}, // Red approach
  {x: 6, y: 5},  {x: 6, y: 4},  {x: 6, y: 3},  {x: 6, y: 2},  {x: 6, y: 1},  {x: 6, y: 0},
  {x: 7, y: 0},
  {x: 8, y: 0},  {x: 8, y: 1},  {x: 8, y: 2},  {x: 8, y: 3},  {x: 8, y: 4},  {x: 8, y: 5}, // Green start & approach
  {x: 9, y: 6},  {x: 10, y: 6}, {x: 11, y: 6}, {x: 12, y: 6}, {x: 13, y: 6}, {x: 14, y: 6},
  {x: 14, y: 7},
  {x: 14, y: 8}, {x: 13, y: 8}, {x: 12, y: 8}, {x: 11, y: 8}, {x: 10, y: 8}, {x: 9, y: 8}, // Yellow start & approach
  {x: 8, y: 9},  {x: 8, y: 10}, {x: 8, y: 11}, {x: 8, y: 12}, {x: 8, y: 13}, {x: 8, y: 14},
  {x: 7, y: 14},
  {x: 6, y: 14}, {x: 6, y: 13}, {x: 6, y: 12}, {x: 6, y: 11}, {x: 6, y: 10}, {x: 6, y: 9}, // Blue start & approach
  {x: 5, y: 8},  {x: 4, y: 8},  {x: 3, y: 8},  {x: 2, y: 8},  {x: 1, y: 8},  {x: 0, y: 8},
  {x: 0, y: 7},
  {x: 0, y: 6}
];

// Home stretch coordinates for each color (0 to 5 steps before goal)
const HOME_STRETCH_COORDS = {
  red: [
    {x: 1, y: 7}, {x: 2, y: 7}, {x: 3, y: 7}, {x: 4, y: 7}, {x: 5, y: 7}, {x: 6, y: 7}
  ],
  green: [
    {x: 7, y: 1}, {x: 7, y: 2}, {x: 7, y: 3}, {x: 7, y: 4}, {x: 7, y: 5}, {x: 7, y: 6}
  ],
  yellow: [
    {x: 13, y: 7}, {x: 12, y: 7}, {x: 11, y: 7}, {x: 10, y: 7}, {x: 9, y: 7}, {x: 8, y: 7}
  ],
  blue: [
    {x: 7, y: 13}, {x: 7, y: 12}, {x: 7, y: 11}, {x: 7, y: 10}, {x: 7, y: 9}, {x: 7, y: 8}
  ]
};

// Base slot relative offsets for 4 tokens inside each player's base
const BASE_SLOTS = {
  red: [
    {x: 1.5, y: 1.5}, {x: 3.5, y: 1.5}, {x: 1.5, y: 3.5}, {x: 3.5, y: 3.5}
  ],
  green: [
    {x: 10.5, y: 1.5}, {x: 12.5, y: 1.5}, {x: 10.5, y: 3.5}, {x: 12.5, y: 3.5}
  ],
  yellow: [
    {x: 10.5, y: 10.5}, {x: 12.5, y: 10.5}, {x: 10.5, y: 12.5}, {x: 12.5, y: 12.5}
  ],
  blue: [
    {x: 1.5, y: 10.5}, {x: 3.5, y: 10.5}, {x: 1.5, y: 12.5}, {x: 3.5, y: 12.5}
  ]
};

const SAFE_INDICES = [0, 8, 13, 21, 26, 34, 39, 47];

/**
 * Renders the 15x15 Ludo board grid inside the container
 * @param {string} containerId 
 */
export const renderBoard = (containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  let html = '';
  for (let y = 0; y < 15; y++) {
    for (let x = 0; x < 15; x++) {
      let cellType = 'path';
      let zone = '';
      let trackIndex = -1;
      let homeIndex = -1;

      // Determine zones & types
      if (x < 6 && y < 6) {
        zone = 'red';
        cellType = (x === 1 && y === 1) || (x === 4 && y === 1) || (x === 1 && y === 4) || (x === 4 && y === 4) ? 'base' : 'base';
      } else if (x > 8 && y < 6) {
        zone = 'green';
        cellType = 'base';
      } else if (x > 8 && y > 8) {
        zone = 'yellow';
        cellType = 'base';
      } else if (x < 6 && y > 8) {
        zone = 'blue';
        cellType = 'base';
      } else if (x >= 6 && x <= 8 && y >= 6 && y <= 8) {
        cellType = 'goal';
      } else {
        // Check main track or home stretch
        const trackIdx = MAIN_TRACK_COORDS.findIndex(c => c.x === x && c.y === y);
        if (trackIdx !== -1) {
          trackIndex = trackIdx;
          cellType = SAFE_INDICES.includes(trackIdx) ? 'safe' : 'path';
        } else {
          // Check home stretches
          for (const [color, coords] of Object.entries(HOME_STRETCH_COORDS)) {
            const hIdx = coords.findIndex(c => c.x === x && c.y === y);
            if (hIdx !== -1) {
              zone = color;
              homeIndex = hIdx;
              cellType = 'home';
              break;
            }
          }
        }
      }

      let content = '';
      if (cellType === 'safe') content = '⭐';

      html += `<div class="cell" data-x="${x}" data-y="${y}" ${trackIndex !== -1 ? `data-track-index="${trackIndex}"` : ''} ${homeIndex !== -1 ? `data-home-index="${homeIndex}"` : ''} ${zone ? `data-zone="${zone}"` : ''} data-type="${cellType}">${content}</div>`;
    }
  }

  container.innerHTML = html;
};

/**
 * Calculates grid coordinates {x, y} for a token given its state and position
 * @param {string} color 
 * @param {Object} token 
 */
export const getTokenCoordinates = (color, token) => {
  if (token.state === 'base') {
    return BASE_SLOTS[color][token.id];
  } else if (token.state === 'track') {
    return MAIN_TRACK_COORDS[token.position];
  } else if (token.state === 'home') {
    return HOME_STRETCH_COORDS[color][token.position];
  } else if (token.state === 'goal') {
    // Center goal coordinates vary slightly around (7,7)
    const offsets = [{x: 6.8, y: 7}, {x: 7.2, y: 7}, {x: 7, y: 6.8}, {x: 7, y: 7.2}];
    return offsets[token.id];
  }
  return {x: 7, y: 7};
};

/**
 * Updates DOM token placements on the board based on current game state
 * @param {Object} state 
 */
export const renderTokens = (state) => {
  // Remove existing tokens from board
  document.querySelectorAll('.token').forEach(el => el.remove());

  const board = document.getElementById('ludo-board');
  if (!board) return;

  // Group tokens by coordinates to handle stacking offset
  const posMap = {};

  for (const [color, player] of Object.entries(state.players)) {
    if (player.isEliminated) continue;
    player.tokens.forEach(token => {
      const coords = getTokenCoordinates(color, token);
      const key = `${Math.round(coords.x * 10)}_${Math.round(coords.y * 10)}`;
      if (!posMap[key]) posMap[key] = [];
      posMap[key].push({ color, token });
    });
  }

  for (const [key, items] of Object.entries(posMap)) {
    items.forEach((item, idx) => {
      const { color, token } = item;
      const coords = getTokenCoordinates(color, token);

      // Find target cell or create absolute positioned element over board
      const tokenEl = document.createElement('div');
      tokenEl.className = 'token';
      tokenEl.dataset.playerId = color;
      tokenEl.dataset.tokenId = token.id;
      tokenEl.dataset.state = token.state;
      tokenEl.innerHTML = `<span>${token.id + 1}</span>`;

      // Calculate pixel or percentage positioning on board grid (15x15)
      let left = (coords.x / 15) * 100;
      let top = (coords.y / 15) * 100;

      // Apply slight offset if multiple tokens share the same exact cell
      if (items.length > 1 && token.state !== 'base') {
        const angle = (idx / items.length) * 2 * Math.PI;
        left += Math.cos(angle) * 1.5;
        top += Math.sin(angle) * 1.5;
      }

      tokenEl.style.left = `${left}%`;
      tokenEl.style.top = `${top}%`;
      tokenEl.style.width = `${(1 / 15) * 90}%`;
      tokenEl.style.height = `${(1 / 15) * 90}%`;

      // Check if movable for current player
      if (state.status === 'playing' && state.hasRolled && !state.hasMoved && state.currentTurnColor === color) {
        // Will be highlighted by game logic / UI updater if valid
      }

      board.appendChild(tokenEl);
    });
  }
};

export { MAIN_TRACK_COORDS, HOME_STRETCH_COORDS, SAFE_INDICES };
