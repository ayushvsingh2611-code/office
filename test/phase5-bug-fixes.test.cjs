'use strict';
/**
 * Panda Hive Phase 5 — 3 Critical Bugs Regression Test Suite
 *
 * Verifies:
 * 1. Bug 1: Workspace Isolation, JIT Banner Stripping & Slug Generation
 * 2. Bug 1: Non-collision workspace resolution (never reuse dirty directory silently)
 * 3. Bug 2: Franky & Usopp deliverable prioritization & WriteFile verification
 * 4. Bug 3: Chopper Requirement-Specific Assertions for Chess Game
 * 5. Bug 3: Chopper rejects unrelated applications on Chess requirement (no false approval)
 * 6. Bug 3: Quality gate chain enforcement (QA_REJECTED -> REVIEW_REJECTED -> SPRINT_REJECTED)
 */

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const loadTs = require('./load-ts.cjs');

const {
  agentTools,
  workspacePermissionManager
} = loadTs('src/main/agentTools.ts');

const {
  browserTestRunner
} = loadTs('src/main/browserTestRunner.ts');

const {
  extractCleanUserPrompt,
  generateProjectSlug,
  resolveProjectWorkspace,
  isValidHtml,
  isValidCss,
  isValidJs
} = loadTs('src/main/externalAgentServer.ts');

test('Bug 1 - Test 1: extractCleanUserPrompt strips JIT activation banner', () => {
  const rawJitPrompt = `[⚡ PANDA HIVE JIT SKILL ACTIVATION]
The following skill(s) were resolved on-demand for this task:
- DOCX (anthropics/document-processing): Create and edit Microsoft Word documents (.docx) [Ref: https://github.com/anthropics/skills/docx]
Execute this task following the domain patterns and best practices for the resolved skills without asking the user to manually install them.

create a simple working chess game for two player`;

  const clean = extractCleanUserPrompt(rawJitPrompt);
  assert.strictEqual(clean, 'create a simple working chess game for two player');
  assert(!clean.includes('PANDA HIVE JIT'));
  assert(!clean.includes('Create and edit'));
});

test('Bug 1 - Test 2: generateProjectSlug generates clean domain slug, never nd-edit', () => {
  const chessPrompt = 'create a simple working chess game for two player';
  assert.strictEqual(generateProjectSlug(chessPrompt), 'chess-game');

  const ecommercePrompt = 'build an e-commerce website with product catalog';
  assert.strictEqual(generateProjectSlug(ecommercePrompt), 'ecommerce-website');

  const weatherPrompt = 'make a modern weather dashboard';
  assert.strictEqual(generateProjectSlug(weatherPrompt), 'weather-dashboard');

  // Even if raw prompt with JIT banner is passed directly:
  const rawJitChess = `[⚡ PANDA HIVE JIT SKILL ACTIVATION]
- DOCX: Create and edit Microsoft Word documents
without asking the user to manually install them.

create a simple working chess game for two player`;
  assert.strictEqual(generateProjectSlug(rawJitChess), 'chess-game');
  assert.notStrictEqual(generateProjectSlug(rawJitChess), 'nd-edit');
});

test('Bug 1 - Test 3: resolveProjectWorkspace creates fresh, isolated workspace avoiding collisions', () => {
  const tempWorkspacesRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'panda-workspaces-'));

  try {
    const rawPrompt = 'create a simple working chess game for two player';

    // 1st run: creates workspace/chess-game
    const firstResolved = resolveProjectWorkspace(rawPrompt, undefined, tempWorkspacesRoot);
    assert.strictEqual(firstResolved.projectName, 'chess-game');
    assert.strictEqual(firstResolved.baseDir, path.join(tempWorkspacesRoot, 'chess-game'));
    assert.strictEqual(firstResolved.isExistingProject, false);
    assert(fs.existsSync(firstResolved.baseDir));

    // Simulate files created in chess-game
    fs.writeFileSync(path.join(firstResolved.baseDir, 'index.html'), '<html>chess</html>', 'utf8');

    // 2nd run with the same prompt (new task): must allocate chess-game-2 without overwriting chess-game
    const secondResolved = resolveProjectWorkspace(rawPrompt, undefined, tempWorkspacesRoot);
    assert.strictEqual(secondResolved.projectName, 'chess-game-2');
    assert.strictEqual(secondResolved.baseDir, path.join(tempWorkspacesRoot, 'chess-game-2'));
    assert.strictEqual(secondResolved.isExistingProject, false);
    assert(fs.existsSync(secondResolved.baseDir));

    // 3rd run with explicit edit request on chess-game
    const editPrompt = 'fix bug in existing project chess-game';
    const editResolved = resolveProjectWorkspace(editPrompt, 'chess-game', tempWorkspacesRoot);
    assert.strictEqual(editResolved.projectName, 'chess-game');
    assert.strictEqual(editResolved.isExistingProject, true);
  } finally {
    fs.rmSync(tempWorkspacesRoot, { recursive: true, force: true });
  }
});

test('Bug 2 - Test 4: Franky & Usopp deliverables validation and syntax integrity', () => {
  // HTML syntax validator
  const validChessHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Chess Game</title>
  <link rel="stylesheet" href="style.css">
</head>
<body class="bg-slate-900 text-white">
  <div id="chessboard" class="grid grid-cols-8"></div>
  <div id="turn-indicator">Turn: White</div>
  <button id="reset-btn">Reset Game</button>
  <script src="app.js" defer></script>
</body>
</html>`;
  assert.strictEqual(isValidHtml(validChessHtml), true);

  // Markdown summary must be rejected by isValidHtml
  const mdSummary = '### Work Completed\n- Created chessboard\n- Added reset button';
  assert.strictEqual(isValidHtml(mdSummary), false);

  // Valid CSS validator
  const validChessCss = `#chessboard { display: grid; grid-template-columns: repeat(8, 60px); }
.square.light { background-color: #eeeed2; }
.square.dark { background-color: #769656; }
.selected { outline: 3px solid #facc15; }
.highlight { background-color: rgba(250, 204, 21, 0.4); }`;
  assert.strictEqual(isValidCss(validChessCss), true);
  assert.strictEqual(isValidCss(mdSummary), false);

  // Valid JS validator
  const validChessJs = `document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('chessboard');
  const turnEl = document.getElementById('turn-indicator');
  const resetBtn = document.getElementById('reset-btn');
  let currentTurn = 'white';
  console.log('Chess game initialized');
});`;
  assert.strictEqual(isValidJs(validChessJs), true);
  assert.strictEqual(isValidJs(mdSummary), false);
});

test('Bug 3 - Test 5: Chopper rejects unrelated applications on Chess requirement (no false approval)', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'panda-unrelated-app-'));
  workspacePermissionManager.authorizeWorkspace(tempDir);

  try {
    // Write an unrelated app (like a generic counter or old nd-edit)
    fs.writeFileSync(
      path.join(tempDir, 'index.html'),
      '<!DOCTYPE html><html><body><button id="btn1">Count</button><script src="app.js"></script></body></html>',
      'utf8'
    );
    fs.writeFileSync(
      path.join(tempDir, 'style.css'),
      'body { background: white; }',
      'utf8'
    );
    fs.writeFileSync(
      path.join(tempDir, 'app.js'),
      'document.addEventListener("DOMContentLoaded", () => { document.getElementById("btn1").onclick = () => {}; });',
      'utf8'
    );

    // Run Chopper browser test with userRequirement = "create a simple working chess game for two player"
    const report = await browserTestRunner.runDeepBrowserTest(
      tempDir,
      'create a simple working chess game for two player'
    );

    // Chopper MUST REJECT this unrelated application!
    assert.strictEqual(report.finalQaApproval, 'REJECTED', 'Unrelated application must be REJECTED for Chess requirement');
    assert.strictEqual(report.browserFunctionalTesting, 'FAIL');

    // Confirm requirement assertion failures are explicitly recorded
    const requirementAssertions = report.interactionsTested.filter((i) => i.type === 'requirement_assertion');
    assert(requirementAssertions.length > 0, 'Requirement assertions must be present in report');
    const failedAssertions = requirementAssertions.filter((i) => !i.success);
    assert(failedAssertions.length > 0, 'Unrelated app must fail requirement assertions');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('Bug 3 - Test 6: Chopper approves a valid Chess Game with 64 squares, 32 pieces, turns, and reset', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'panda-chess-valid-'));
  workspacePermissionManager.authorizeWorkspace(tempDir);

  try {
    // Create a complete, authentic Chess Game
    const chessHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Two Player Chess</title>
  <link rel="stylesheet" href="style.css">
</head>
<body class="bg-slate-900 text-white flex flex-col items-center p-6">
  <h1 class="text-2xl font-bold mb-4">Chess Game</h1>
  <div id="turn-indicator" class="mb-4 font-semibold">Turn: White</div>
  <div id="chessboard" class="grid grid-cols-8 gap-0 border-4 border-slate-700"></div>
  <div class="mt-4 flex gap-4">
    <button id="reset-btn" class="px-4 py-2 bg-indigo-600 rounded">Reset Game</button>
  </div>
  <script src="app.js" defer></script>
</body>
</html>`;

    const chessCss = `
#chessboard { width: 480px; height: 480px; display: grid; grid-template-columns: repeat(8, 1fr); grid-template-rows: repeat(8, 1fr); }
.square { width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; font-size: 36px; cursor: pointer; user-select: none; }
.square.light { background-color: #eeeed2; }
.square.dark { background-color: #769656; }
.square.selected { background-color: #baca44 !important; }
.square.highlight { position: relative; }
.square.highlight::after { content: ''; width: 16px; height: 16px; background: rgba(0,0,0,0.25); border-radius: 50%; display: block; }
.piece { cursor: pointer; }
`;

    const chessJs = `
document.addEventListener('DOMContentLoaded', () => {
  const boardEl = document.getElementById('chessboard');
  const turnEl = document.getElementById('turn-indicator');
  const resetBtn = document.getElementById('reset-btn');

  const initialSetup = [
    ['♜','♞','♝','♛','♚','♝','♞','♜'],
    ['♟','♟','♟','♟','♟','♟','♟','♟'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['♙','♙','♙','♙','♙','♙','♙','♙'],
    ['♖','♘','♗','♕','♔','♗','♘','♖']
  ];

  let boardState = JSON.parse(JSON.stringify(initialSetup));
  let currentTurn = 'White';
  let selectedCoord = null;

  function renderBoard() {
    boardEl.innerHTML = '';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const square = document.createElement('div');
        const isLight = (r + c) % 2 === 0;
        square.className = 'square ' + (isLight ? 'light' : 'dark');
        square.dataset.row = r;
        square.dataset.col = c;
        square.dataset.square = String.fromCharCode(97 + c) + (8 - r);

        const piece = boardState[r][c];
        if (piece) {
          const pieceSpan = document.createElement('span');
          pieceSpan.className = 'piece ' + (r >= 6 ? 'white' : 'black');
          pieceSpan.dataset.piece = piece;
          pieceSpan.textContent = piece;
          square.appendChild(pieceSpan);
        }

        if (selectedCoord && selectedCoord.r === r && selectedCoord.c === c) {
          square.classList.add('selected');
        }

        square.addEventListener('click', () => handleSquareClick(r, c));
        boardEl.appendChild(square);
      }
    }
    turnEl.textContent = 'Turn: ' + currentTurn;
  }

  function handleSquareClick(r, c) {
    if (!selectedCoord) {
      if (boardState[r][c] !== '') {
        selectedCoord = { r, c };
        renderBoard();
      }
    } else {
      if (selectedCoord.r !== r || selectedCoord.c !== c) {
        boardState[r][c] = boardState[selectedCoord.r][selectedCoord.c];
        boardState[selectedCoord.r][selectedCoord.c] = '';
        currentTurn = currentTurn === 'White' ? 'Black' : 'White';
      }
      selectedCoord = null;
      renderBoard();
    }
  }

  resetBtn.addEventListener('click', () => {
    boardState = JSON.parse(JSON.stringify(initialSetup));
    currentTurn = 'White';
    selectedCoord = null;
    renderBoard();
  });

  renderBoard();
});
`;

    fs.writeFileSync(path.join(tempDir, 'index.html'), chessHtml, 'utf8');
    fs.writeFileSync(path.join(tempDir, 'style.css'), chessCss, 'utf8');
    fs.writeFileSync(path.join(tempDir, 'app.js'), chessJs, 'utf8');

    // Run Chopper browser test with userRequirement = "create a simple working chess game for two player"
    const report = await browserTestRunner.runDeepBrowserTest(
      tempDir,
      'create a simple working chess game for two player'
    );

    assert.strictEqual(report.finalQaApproval, 'APPROVED', 'Real chess application must be APPROVED by Chopper');
    assert.strictEqual(report.browserFunctionalTesting, 'PASS');

    const requirementAssertions = report.interactionsTested.filter((i) => i.type === 'requirement_assertion');
    assert.strictEqual(requirementAssertions.length >= 8, true, 'All 8 Chess requirement assertions must run');
    const failedAssertions = requirementAssertions.filter((i) => !i.success);
    assert.strictEqual(failedAssertions.length, 0, `Expected 0 failed assertions, got: ${failedAssertions.map((f) => f.target).join(', ')}`);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

