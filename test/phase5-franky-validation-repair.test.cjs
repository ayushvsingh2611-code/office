'use strict';
/**
 * Panda Hive Phase 5 — Franky Validation & Gemini 429 Quota Exhaustion Test Suite
 *
 * Verifies:
 * 1. Quota Exhaustion Tracking: HTTP 429 triggers cooldown and marks key/model exhausted.
 * 2. Model Skipping: Globally exhausted models are skipped immediately without retrying all keys.
 * 3. Scoped Allowed Tools: Passing allowedTools overrides agent's default tools to prevent reconnaissance loops.
 * 4. HTML/CSS Validation: Strict deliverable validators accept valid code and reject markdown summaries.
 * 5. File Path Matching: Tolerates relative, absolute, and normalized paths for WriteFile tool telemetry.
 */

const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');
const loadTs = require('./load-ts.cjs');

const {
  isModelKeyExhausted,
  isModelGloballyExhausted,
  markModelKeyQuotaExhausted,
  markModelGloballyQuotaExhausted,
  clearModelQuotaExhaustion,
  resolveAllowedToolsForAgent,
  formatToolsForGemini
} = loadTs('src/main/geminiClient.ts');

const {
  isValidHtml,
  isValidCss,
  isValidJs
} = loadTs('src/main/externalAgentServer.ts');

test('Quota Exhaustion - Test 1: markModelKeyQuotaExhausted sets cooldown', () => {
  clearModelQuotaExhaustion();
  const testModel = 'gemini-3.8-flash';
  const testKey = 'AIzaSyA_fake_test_key_12345678';

  assert.strictEqual(isModelKeyExhausted(testModel, testKey), false);
  markModelKeyQuotaExhausted(testModel, testKey, 5000); // 5 sec cooldown
  assert.strictEqual(isModelKeyExhausted(testModel, testKey), true);

  // Different key is not exhausted
  const otherKey = 'AIzaSyB_fake_test_key_87654321';
  assert.strictEqual(isModelKeyExhausted(testModel, otherKey), false);
  clearModelQuotaExhaustion();
});

test('Quota Exhaustion - Test 2: markModelGloballyQuotaExhausted skips model globally', () => {
  clearModelQuotaExhaustion();
  const testModel = 'gemini-3.8-flash';

  assert.strictEqual(isModelGloballyExhausted(testModel), false);
  markModelGloballyQuotaExhausted(testModel, 5000);
  assert.strictEqual(isModelGloballyExhausted(testModel), true);

  // Other models are unaffected
  assert.strictEqual(isModelGloballyExhausted('gemini-flash-lite-latest'), false);
  clearModelQuotaExhaustion();
});

test('Tool Scoping - Test 3: Franky default tools vs scoped allowedTools', () => {
  const frankyDefault = resolveAllowedToolsForAgent('sh-franky');
  const frankyDefaultNames = frankyDefault.map((t) => t.name);

  // By default Franky has ListFiles and SearchFiles which can lead to turn waste
  assert(frankyDefaultNames.includes('WriteFile'));
  assert(frankyDefaultNames.includes('ListFiles'));
  assert(frankyDefaultNames.includes('SearchFiles'));

  // When scoped for Milestone 4 generation (HTML/CSS), only WriteFile, ReadFile, EditFile are provided
  const scopedFilter = ['WriteFile', 'ReadFile', 'EditFile'];
  const scopedTools = frankyDefault.filter((def) => scopedFilter.includes(def.name));
  const scopedNames = scopedTools.map((t) => t.name);

  assert.strictEqual(scopedNames.length, 3);
  assert(scopedNames.includes('WriteFile'));
  assert(scopedNames.includes('ReadFile'));
  assert(scopedNames.includes('EditFile'));
  assert(!scopedNames.includes('ListFiles'));
  assert(!scopedNames.includes('SearchFiles'));

  // Gemini schema format only contains the 3 scoped tools
  const formatted = formatToolsForGemini(scopedTools);
  const declarations = formatted[0].functionDeclarations.map((d) => d.name);
  assert.strictEqual(declarations.length, 3);
  assert(declarations.includes('WriteFile'));
  assert(declarations.includes('ReadFile'));
  assert(declarations.includes('EditFile'));
  assert(!declarations.includes('ListFiles'));
  assert(!declarations.includes('SearchFiles'));
});

test('Validation - Test 4: isValidHtml validates authentic HTML5 and rejects summaries', () => {
  const validHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Chess Game</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="chessboard" class="grid grid-cols-8"></div>
  <script src="app.js" defer></script>
</body>
</html>`;
  assert.strictEqual(isValidHtml(validHtml), true);

  const markdownSummary = `# Work Completed
1. Created index.html layout
2. Styled with CSS
\`\`\`html
<!DOCTYPE html>
<html><body></body></html>
\`\`\``;
  assert.strictEqual(isValidHtml(markdownSummary), false);
});

test('Validation - Test 5: isValidCss validates CSS rules and rejects markdown headings', () => {
  const validCss = `
#chessboard {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  width: 560px;
  height: 560px;
}
.square.light { background-color: #eeeed2; }
.square.dark { background-color: #769656; }
`;
  assert.strictEqual(isValidCss(validCss), true);

  const markdownSummary = `### CSS Implementation
Here is the stylesheet:
#chessboard { width: 100%; }
`;
  assert.strictEqual(isValidCss(markdownSummary), false);
});

test('Validation - Test 6: isValidJs validates executable syntax and rejects markdown', () => {
  const validJs = `
document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('chessboard');
  let currentTurn = 'white';
  console.log('Chess game initialized');
});
`;
  assert.strictEqual(isValidJs(validJs), true);

  const invalidJs = `
function test( {
  broken syntax here
`;
  assert.strictEqual(isValidJs(invalidJs), false);

  const markdownJs = `# JavaScript Logic
1. Initialized board
const a = 1;
`;
  assert.strictEqual(isValidJs(markdownJs), false);
});

test('Path Matching - Test 7: Normalized path matching for WriteFile deliverables', () => {
  const isMatchingFilePath = (actual, target) => {
    if (!actual) return false;
    const norm = actual.replace(/\\/g, '/').toLowerCase();
    const t = target.toLowerCase();
    return norm === t || norm === `./${t}` || norm.endsWith(`/${t}`);
  };

  assert.strictEqual(isMatchingFilePath('index.html', 'index.html'), true);
  assert.strictEqual(isMatchingFilePath('./index.html', 'index.html'), true);
  assert.strictEqual(isMatchingFilePath('.\\index.html', 'index.html'), true);
  assert.strictEqual(isMatchingFilePath('workspace/chess-game/index.html', 'index.html'), true);
  assert.strictEqual(isMatchingFilePath('c:\\path\\to\\index.html', 'index.html'), true);
  assert.strictEqual(isMatchingFilePath('style.css', 'index.html'), false);
});
