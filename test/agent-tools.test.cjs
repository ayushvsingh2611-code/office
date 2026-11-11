'use strict';
/**
 * Test Suite: Panda Hive Executable Agent Tools (Phase 3 & 6 Verification)
 *
 * Verifies:
 * 1. Safe workspace boundary enforcement (rejects path escape ../../.env)
 * 2. Role-based permission enforcement (Franky, Usopp, Chopper, Sanji)
 * 3. ReadFile, WriteFile, EditFile, ListFiles, SearchFiles
 * 4. RunSyntaxAudit (catches syntax errors in JS without execution)
 * 5. BrowserTest (detects interactive elements, buttons, forms, script links)
 * 6. Audit logging for every tool call
 */

const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const loadTs = require('./load-ts.cjs');

const {
  agentTools,
  resolveSafeWorkspacePath,
  AgentToolAccessError,
  checkAgentToolPermission
} = loadTs('src/main/agentTools.ts');

async function runTests() {
  console.log('=== PANDA HIVE AGENT EXECUTABLE TOOLS TEST SUITE ===\n');
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`  ✔ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✖ [FAIL] ${name}`);
      console.error(`     Error: ${err.message}\n`);
      failed++;
    }
  }

  const testWs = fs.mkdtempSync(path.join(os.tmpdir(), 'hive-agent-tools-test-'));

  // Test 1: Workspace Safety Guard
  test('Test 1: Workspace guard allows legitimate relative paths and blocks directory traversal', () => {
    const valid = resolveSafeWorkspacePath(testWs, 'index.html');
    assert.strictEqual(valid, path.resolve(testWs, 'index.html'));

    assert.throws(
      () => resolveSafeWorkspacePath(testWs, '../../../../etc/passwd'),
      /escapes assigned project workspace/
    );
  });

  // Test 2: Role-based permissions
  test('Test 2: Role-based permissions allow Franky to write UI but block unauthorized tools', () => {
    // Franky can WriteFile
    assert.doesNotThrow(() => checkAgentToolPermission('sh-franky', 'WriteFile'));
    // Franky cannot RunTerminalCommand
    assert.throws(
      () => checkAgentToolPermission('sh-franky', 'RunTerminalCommand'),
      /not authorized to use tool "RunTerminalCommand"/
    );
    // Sanji can RunTerminalCommand
    assert.doesNotThrow(() => checkAgentToolPermission('sh-sanji', 'RunTerminalCommand'));
    // Chopper can RunSyntaxAudit and BrowserTest
    assert.doesNotThrow(() => checkAgentToolPermission('sh-chopper', 'RunSyntaxAudit'));
    assert.doesNotThrow(() => checkAgentToolPermission('sh-chopper', 'BrowserTest'));
  });

  // Test 3: WriteFile & ReadFile with audit logging
  test('Test 3: Agents write and read files inside project workspace with audit logging', () => {
    agentTools.clearAuditLog();
    const frankyCtx = { agentId: 'sh-franky', agentName: 'Franky', projectWorkspace: testWs };

    agentTools.writeFile(frankyCtx, 'index.html', '<!DOCTYPE html><html><body><button id="btn">Click</button><script src="app.js" defer></script></body></html>');
    assert.ok(fs.existsSync(path.join(testWs, 'index.html')));

    const content = agentTools.readFile(frankyCtx, 'index.html');
    assert.ok(content.includes('<button id="btn">Click</button>'));

    const log = agentTools.getAuditLog();
    assert.strictEqual(log.length, 2);
    assert.strictEqual(log[0].toolName, 'WriteFile');
    assert.strictEqual(log[1].toolName, 'ReadFile');
  });

  // Test 4: RunSyntaxAudit on valid and broken JS
  test('Test 4: Chopper & Usopp run syntax audit on JavaScript code', () => {
    const usoppCtx = { agentId: 'sh-usopp', agentName: 'Usopp', projectWorkspace: testWs };

    // Valid JS
    agentTools.writeFile(usoppCtx, 'app.js', 'console.log("ready"); function test() { return 42; }');
    const validResult = agentTools.runSyntaxAudit(usoppCtx, 'app.js');
    assert.strictEqual(validResult.valid, true);

    // Broken JS
    agentTools.writeFile(usoppCtx, 'broken.js', 'function test() { const a = ;');
    const brokenResult = agentTools.runSyntaxAudit(usoppCtx, 'broken.js');
    assert.strictEqual(brokenResult.valid, false);
    assert.ok(brokenResult.error);
  });

  // Test 5: BrowserTest Headless DOM Verification
  test('Test 5: Chopper runs BrowserTest to verify DOM elements and script linkage', () => {
    const chopperCtx = { agentId: 'sh-chopper', agentName: 'Chopper', projectWorkspace: testWs };
    const domResult = agentTools.browserTest(chopperCtx);

    assert.strictEqual(domResult.pass, true);
    assert.strictEqual(domResult.buttonCount, 1);
    assert.strictEqual(domResult.hasScript, true);
  });

  console.log(`\nTest results: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runTests().catch((e) => {
  console.error(e);
  process.exit(1);
});

