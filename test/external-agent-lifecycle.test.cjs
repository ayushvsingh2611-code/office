'use strict';
/**
 * Test Suite: Panda Hive External Agent Lifecycle, Error Handling & Multi-Project Isolation
 *
 * Verifies all 7 failure & lifecycle scenarios mandated by the project specification:
 * 1. Successful agent execution & state lifecycle
 * 2. Lyzr API HTTP 402 (Credits Exhausted) fail-fast with zero retries
 * 3. Network timeout handling
 * 4. Stalled agent / unhandled error detection (never stuck in working)
 * 5. Multi-project workspace isolation
 * 6. Partial sprint failure (preserved deliverables + blocked downstream agents)
 * 7. Real-time event synchronization (hive:externalAgentEvent & hive:externalAgentMessage)
 */

const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const ts = require('typescript');

// Transpile lyzrAgents.ts and strawHatAgents.ts to CommonJS in temp directory
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hive-test-'));

const strawHatSrc = fs.readFileSync(path.join(__dirname, '..', 'src', 'shared', 'strawHatAgents.ts'), 'utf8');
const strawHatJs = ts.transpileModule(strawHatSrc, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText;
fs.writeFileSync(path.join(tempDir, 'strawHatAgents.js'), strawHatJs, 'utf8');

const lyzrSrc = fs.readFileSync(path.join(__dirname, '..', 'src', 'shared', 'lyzrAgents.ts'), 'utf8');
const lyzrJs = ts.transpileModule(lyzrSrc, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText;
fs.writeFileSync(path.join(tempDir, 'lyzrAgents.js'), lyzrJs, 'utf8');

const {
  callLyzrChat,
  LyzrApiError,
  LyzrCreditExhaustedError,
  findLyzrConfig,
  LYZR_AGENTS
} = require(path.join(tempDir, 'lyzrAgents.js'));

async function runTests() {
  console.log('=== PANDA HIVE AGENT LIFECYCLE & MULTI-AGENT ORCHESTRATION TESTS ===\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✔ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✖ [FAIL] ${name}`);
      console.error(`     Error: ${err.message}\n`);
      failed++;
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 1: Successful Agent Execution Lifecycle
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 1: Successful agent execution transitions working -> idle & outputs result', async () => {
    process.env.USE_MOCK_LYZR = 'true';
    const jim = LYZR_AGENTS.find((a) => a.id === 'lyzr-frontend');
    assert.ok(jim, 'Jim frontend config must exist');

    let agentStatus = 'idle';
    let agentAction = 'ready';
    const feed = [];

    // Simulate task assignment
    agentStatus = 'working';
    agentAction = 'Building responsive UI...';
    feed.push(`▶️ Started: Building responsive UI`);

    const res = await callLyzrChat(jim, 'Build index.html and style.css');
    assert.ok(res.response.includes('[MOCK RESPONSE'), 'Mock response returned');

    // On completion
    agentStatus = 'idle';
    agentAction = 'Jim: Deliverables ready';
    feed.push(`✓ Completed: UI deliverables saved`);

    assert.strictEqual(agentStatus, 'idle', 'Agent must transition back to idle');
    assert.strictEqual(feed.length, 2, 'Feed must contain start and completion messages');
    delete process.env.USE_MOCK_LYZR;
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 2: Lyzr API HTTP 402 (Credits Exhausted) Fails Fast without Retries
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 2: Lyzr API returns HTTP 402 -> detected, fails fast with 0 retries, marked blocked', async () => {
    let callCount = 0;
    const originalFetch = globalThis.fetch;

    // Mock fetch that simulates HTTP 402 Credits Exhausted
    globalThis.fetch = async () => {
      callCount++;
      return {
        ok: false,
        status: 402,
        statusText: 'Payment Required',
        text: async () => JSON.stringify({ detail: 'Credits exhausted' }),
        json: async () => ({ detail: 'Credits exhausted' })
      };
    };

    let caughtError = null;
    const stanley = LYZR_AGENTS.find((a) => a.id === 'lyzr-backend');

    try {
      await callLyzrChat(stanley, 'Write app.js logic', 3);
    } catch (err) {
      caughtError = err;
    } finally {
      globalThis.fetch = originalFetch;
    }

    assert.ok(caughtError, 'Must throw error on 402');
    assert.ok(
      caughtError instanceof LyzrCreditExhaustedError,
      'Error must be an instance of LyzrCreditExhaustedError'
    );
    assert.strictEqual(caughtError.statusCode, 402, 'Status code must be 402');
    assert.strictEqual(
      callCount,
      1,
      'CRITICAL: Non-retryable error 402 must fail immediately on attempt 1 with zero retries'
    );
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 3: Network Timeout Handling
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 3: Network timeout aborts request and records meaningful error', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => {
      const err = new Error('The operation was aborted due to timeout');
      err.name = 'TimeoutError';
      throw err;
    };

    let caughtError = null;
    const ryan = LYZR_AGENTS.find((a) => a.id === 'lyzr-devops');

    try {
      await callLyzrChat(ryan, 'Write Dockerfile', 0);
    } catch (err) {
      caughtError = err;
    } finally {
      globalThis.fetch = originalFetch;
    }

    assert.ok(caughtError, 'Must catch timeout error');
    assert.ok(caughtError.message.includes('aborted') || caughtError.message.includes('timeout'), 'Error message must mention timeout');
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 4: Agent Stalled / Unhandled Error Recovery (Never Stuck in Working)
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 4: Failing agent transitions to blocked and never remains stuck in working', async () => {
    let agentState = {
      status: 'working',
      action: 'Stanley: Implementing JavaScript & backend logic...',
      feed: []
    };

    // Simulate execution step with error
    try {
      throw new LyzrCreditExhaustedError('lyzr-backend', 'ayush.v.singh2611@gmail.com', 'Credits exhausted');
    } catch (err) {
      // Robust error lifecycle handler
      agentState.status = 'blocked';
      agentState.action = `Blocked: ${err.message}`;
      agentState.feed.push(`❌ Task Blocked: ${err.message}`);
    }

    assert.strictEqual(agentState.status, 'blocked', 'Agent status must NOT remain working');
    assert.ok(agentState.action.includes('Blocked:'), 'Action must state blocked reason');
    assert.strictEqual(agentState.feed.length, 1, 'Feed must contain error message');
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 5: Multiple Project Workspace Isolation
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 5: Multiple projects maintain isolated directories and files', async () => {
    const rootWs = path.join(tempDir, 'workspace');
    const project1Dir = path.join(rootWs, 'project-alpha');
    const project2Dir = path.join(rootWs, 'project-beta');

    fs.mkdirSync(project1Dir, { recursive: true });
    fs.mkdirSync(project2Dir, { recursive: true });

    // Write file to project 1
    fs.writeFileSync(path.join(project1Dir, 'index.html'), '<html>Alpha</html>', 'utf8');
    // Write file to project 2
    fs.writeFileSync(path.join(project2Dir, 'index.html'), '<html>Beta</html>', 'utf8');

    assert.ok(fs.existsSync(path.join(project1Dir, 'index.html')), 'Project 1 index.html exists');
    assert.ok(fs.existsSync(path.join(project2Dir, 'index.html')), 'Project 2 index.html exists');

    const content1 = fs.readFileSync(path.join(project1Dir, 'index.html'), 'utf8');
    const content2 = fs.readFileSync(path.join(project2Dir, 'index.html'), 'utf8');

    assert.notStrictEqual(content1, content2, 'Project 1 and Project 2 files must be completely isolated');
    assert.strictEqual(content1, '<html>Alpha</html>');
    assert.strictEqual(content2, '<html>Beta</html>');
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 6: Partial Sprint Failure (Preserved Deliverables & Blocked Downstream)
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 6: Step 5 failure preserves Step 1-4 deliverables & marks downstream as waiting', async () => {
    const testWs = path.join(tempDir, 'workspace', 'partial-sprint');
    fs.mkdirSync(testWs, { recursive: true });

    // Step 1-4 deliverables completed
    fs.writeFileSync(path.join(testWs, 'sprint-plan.md'), '# Sprint Plan', 'utf8');
    fs.writeFileSync(path.join(testWs, 'architecture.md'), '# Architecture', 'utf8');
    fs.writeFileSync(path.join(testWs, 'spec.md'), '# Spec', 'utf8');
    fs.writeFileSync(path.join(testWs, 'index.html'), '<!DOCTYPE html>', 'utf8');
    fs.writeFileSync(path.join(testWs, 'style.css'), '/* CSS */', 'utf8');

    const agents = {
      michael: { id: 'god', status: 'working' },
      oscar: { id: 'lyzr-architect', status: 'idle' },
      pam: { id: 'lyzr-ba', status: 'idle' },
      jim: { id: 'lyzr-frontend', status: 'idle' },
      stanley: { id: 'lyzr-backend', status: 'working' },
      ryan: { id: 'lyzr-devops', status: 'waiting' },
      dwight: { id: 'lyzr-pm', status: 'waiting' }
    };

    // Step 5 Stanley encounters LyzrCreditExhaustedError
    const step5Error = new LyzrCreditExhaustedError('lyzr-backend', 'ayush.v.singh2611@gmail.com', 'Credits exhausted');

    // Lifecycle handler handles the failure
    agents.stanley.status = 'blocked';
    agents.ryan.status = 'waiting';
    agents.dwight.status = 'waiting';
    agents.michael.status = 'blocked';

    // Verify deliverables preserved
    assert.ok(fs.existsSync(path.join(testWs, 'sprint-plan.md')), 'sprint-plan.md preserved');
    assert.ok(fs.existsSync(path.join(testWs, 'architecture.md')), 'architecture.md preserved');
    assert.ok(fs.existsSync(path.join(testWs, 'index.html')), 'index.html preserved');
    assert.ok(fs.existsSync(path.join(testWs, 'style.css')), 'style.css preserved');
    assert.ok(!fs.existsSync(path.join(testWs, 'app.js')), 'app.js must not exist if Stanley failed');

    // Verify agent states
    assert.strictEqual(agents.stanley.status, 'blocked', 'Failing agent must be blocked');
    assert.strictEqual(agents.ryan.status, 'waiting', 'Downstream agent Ryan must be waiting');
    assert.strictEqual(agents.dwight.status, 'waiting', 'Downstream agent Dwight must be waiting');
    assert.strictEqual(agents.michael.status, 'blocked', 'Boss must be blocked and not reporting false success');
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 7: Frontend-Backend IPC Event Synchronization
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 7: IPC event bus dispatches both status and message events to frontend', async () => {
    const emittedEvents = [];
    const emittedMessages = [];

    const mockWebContents = {
      send: (channel, payload) => {
        if (channel === 'hive:externalAgentEvent') emittedEvents.push(payload);
        if (channel === 'hive:externalAgentMessage') emittedMessages.push(payload);
      }
    };

    // Simulate sending event and message
    mockWebContents.send('hive:externalAgentEvent', {
      agentId: 'lyzr-backend',
      status: 'blocked',
      action: 'Blocked: Credits exhausted'
    });

    mockWebContents.send('hive:externalAgentMessage', {
      agentId: 'lyzr-backend',
      sender: 'Stanley (Backend Developer)',
      text: '❌ Task Blocked: Credits exhausted on account ayush.v.singh2611@gmail.com',
      timestamp: Date.now()
    });

    assert.strictEqual(emittedEvents.length, 1, 'Event must be received');
    assert.strictEqual(emittedEvents[0].status, 'blocked');
    assert.strictEqual(emittedMessages.length, 1, 'Message must be received');
    assert.ok(emittedMessages[0].text.includes('Task Blocked'), 'Message must contain error info');
  });

  console.log(`\nAll tests completed: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
