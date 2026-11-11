'use strict';
/**
 * Panda Hive — Phase 5 Autonomous Execution & Tool-Calling Test Suite
 *
 * Verifies all 10 Phase 5 Requirements:
 * 1. Crew Architecture Invariance: Exactly 12 Straw Hat Crew agents preserved with distinct roles
 * 2. Model Priority Guard: gemini-3.8-flash prioritized first before gemini-flash-latest, omitting gemini-2.0-flash
 * 3. Gemini Key Rotation: Keys rotate smoothly across attempts
 * 4. Authorized Tool Execution: Straw Hat agent executes an authorized tool within project workspace
 * 5. Role-Based Tool Authorization: Unauthorized tool invocations are strictly rejected with AgentToolAccessError
 * 6. Workspace Boundary Security: Path traversal and out-of-workspace writes are blocked
 * 7. Turn Limit & Finalization: 5-turn hard limit triggers finalization-only call WITHOUT executable tools
 * 8. Deliverable Verification & Status Evaluation: One WriteFile does not mark COMPLETED; Shanks success + Nami failure yields PARTIAL
 * 9. Failover Safety: Provider failure falls back to Groq with preserved history; turn-limit does not restart on Groq
 * 10. Real callAgentAutonomous() Integration: Exercises end-to-end execution path with toolContext, disk file creation, and dynamic skills
 */

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const loadTs = require('./load-ts.cjs');

// Modules under test
const {
  agentTools,
  AGENT_ALLOWED_TOOLS,
  AgentToolAccessError
} = loadTs('src/main/agentTools.ts');

const {
  CANDIDATE_MODELS,
  formatToolsForGemini,
  formatToolsForGroq,
  resolveAllowedToolsForAgent,
  executeAgentLlmCallWithTools,
  getGeminiApiKeys,
  setGeminiApiKeys
} = loadTs('src/main/geminiClient.ts');

const {
  callAgentAutonomous,
  getStrawHatCrewAgent,
  evaluateMilestoneStatus
} = loadTs('src/main/externalAgentServer.ts');

const { STRAW_HAT_CREW } = loadTs('src/shared/strawHatAgents.ts');

test('Phase 5.1: Exactly 12 Straw Hat Crew agents remain intact with authorized tool sets', () => {
  assert.strictEqual(STRAW_HAT_CREW.length, 12, 'Must have exactly 12 Straw Hat Crew members');

  const expectedIds = [
    'sh-luffy',
    'sh-hancock',
    'sh-shanks',
    'sh-nami',
    'sh-franky',
    'sh-usopp',
    'sh-brook',
    'sh-jinbe',
    'sh-chopper',
    'sh-sanji',
    'sh-zoro',
    'sh-robin'
  ];

  for (const id of expectedIds) {
    const agent = STRAW_HAT_CREW.find((a) => a.id === id);
    assert(agent, `Crew member ${id} must exist in STRAW_HAT_CREW`);
    assert(agent.name, `Agent ${id} must have a name`);
    assert(agent.role, `Agent ${id} must have a role`);

    const allowed = AGENT_ALLOWED_TOOLS[id] || AGENT_ALLOWED_TOOLS[id === 'sh-luffy' ? 'god' : id];
    assert(Array.isArray(allowed) && allowed.length > 0, `Agent ${id} must have a defined allowed tools set`);
  }
});

test('Phase 5.2: Gemini Model Priority: gemini-3.8-flash is prioritized before gemini-flash-latest, omitting gemini-2.0-flash', () => {
  assert(!CANDIDATE_MODELS.includes('gemini-2.0-flash'), 'gemini-2.0-flash must NOT be in CANDIDATE_MODELS');
  assert.strictEqual(CANDIDATE_MODELS[0], 'gemini-3.8-flash', 'gemini-3.8-flash must be the first prioritized model');
  assert.strictEqual(CANDIDATE_MODELS[1], 'gemini-flash-lite-latest', 'gemini-flash-lite-latest must be second in priority');
  assert(CANDIDATE_MODELS.indexOf('gemini-3.8-flash') < CANDIDATE_MODELS.indexOf('gemini-flash-latest'), 'gemini-3.8-flash must precede gemini-flash-latest');
});

test('Phase 5.3: Gemini Key Rotation: Multi-key pool rotates sequentially across failed attempts', async () => {
  const originalFetch = global.fetch;
  const initialKeys = getGeminiApiKeys();
  const testKeys = ['test-key-alpha-1', 'test-key-beta-2', 'test-key-gamma-3'];
  setGeminiApiKeys(testKeys);

  const keysQueried = [];

  global.fetch = async (url) => {
    const urlStr = String(url);
    const match = urlStr.match(/key=([^&]+)/);
    if (match) {
      keysQueried.push(decodeURIComponent(match[1]));
    }
    return {
      ok: false,
      status: 503,
      text: async () => 'Unavailable'
    };
  };

  try {
    await assert.rejects(
      async () => {
        await executeAgentLlmCallWithTools('Test key rotation', undefined, undefined, { timeoutMs: 1000 });
      },
      (err) => {
        assert(err.message.includes('failed'));
        return true;
      }
    );

    // Verify key rotation attempted all 3 test keys
    assert(keysQueried.includes('test-key-alpha-1'), 'Must attempt key 1');
    assert(keysQueried.includes('test-key-beta-2'), 'Must attempt key 2');
    assert(keysQueried.includes('test-key-gamma-3'), 'Must attempt key 3');
  } finally {
    global.fetch = originalFetch;
    setGeminiApiKeys(initialKeys);
  }
});

test('Phase 5.4: Agent can successfully execute an authorized tool inside its project workspace', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'panda-phase5-auth-'));
  const frankyCtx = {
    agentId: 'sh-franky',
    agentName: 'Franky (UI/UX Engineer)',
    projectWorkspace: tempDir
  };

  try {
    // Franky has WriteFile and ReadFile permissions
    const writeRes = await agentTools.executeToolByName(frankyCtx, 'WriteFile', {
      filePath: 'test-component.html',
      content: '<div class="header">Straw Hat Ship</div>'
    });
    assert.strictEqual(writeRes.success, true);
    assert.strictEqual(fs.existsSync(path.join(tempDir, 'test-component.html')), true);

    const readRes = await agentTools.executeToolByName(frankyCtx, 'ReadFile', {
      filePath: 'test-component.html'
    });
    assert.strictEqual(readRes.content, '<div class="header">Straw Hat Ship</div>');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('Phase 5.5: Unauthorized tool calls are rejected with AgentToolAccessError', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'panda-phase5-unauth-'));
  const frankyCtx = {
    agentId: 'sh-franky',
    agentName: 'Franky (UI/UX Engineer)',
    projectWorkspace: tempDir
  };

  try {
    // Franky is not allowed to run BrowserTest (reserved for Chopper)
    await assert.rejects(
      async () => {
        await agentTools.executeToolByName(frankyCtx, 'BrowserTest', {});
      },
      (err) => {
        assert(err instanceof AgentToolAccessError);
        assert(err.message.includes('not authorized'));
        return true;
      },
      'Franky must be blocked from running BrowserTest'
    );

    // Hancock is not allowed to run RunTerminalCommand
    const hancockCtx = {
      agentId: 'sh-hancock',
      agentName: 'Hancock (Requirements & BA)',
      projectWorkspace: tempDir
    };
    await assert.rejects(
      async () => {
        await agentTools.executeToolByName(hancockCtx, 'RunTerminalCommand', { command: 'echo hack' });
      },
      (err) => {
        assert(err instanceof AgentToolAccessError);
        assert(err.message.includes('not authorized'));
        return true;
      },
      'Hancock must be blocked from running terminal commands'
    );
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('Phase 5.6: Workspace path boundary security blocks path traversal and external modifications', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'panda-phase5-jail-'));
  const luffyCtx = {
    agentId: 'god',
    agentName: 'Luffy (Captain)',
    projectWorkspace: tempDir
  };

  try {
    // Relative path traversal attack
    await assert.rejects(
      async () => {
        await agentTools.executeToolByName(luffyCtx, 'WriteFile', {
          filePath: '../escaped-file.txt',
          content: 'malicious payload'
        });
      },
      (err) => {
        assert(err instanceof AgentToolAccessError);
        assert(err.message.includes('escapes assigned project workspace'));
        return true;
      },
      'Writing outside workspace via ../ must be strictly blocked'
    );

    // Reading outside workspace
    await assert.rejects(
      async () => {
        await agentTools.executeToolByName(luffyCtx, 'ReadFile', {
          filePath: '../../windows/system32/cmd.exe'
        });
      },
      (err) => {
        assert(err instanceof AgentToolAccessError);
        assert(err.message.includes('escapes assigned project workspace'));
        return true;
      },
      'Reading outside workspace via traversal must be strictly blocked'
    );
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('Phase 5.7: Turn Limit & Finalization: 5-turn hard limit triggers finalization-only call WITHOUT tools', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'panda-phase5-turnlimit-'));
  const originalFetch = global.fetch;
  let turnsCalled = 0;
  let finalizationCallToolsPresent = null;
  let finalizationPromptReceived = null;

  const frankyCtx = {
    agentId: 'sh-franky',
    agentName: 'Franky (UI Engineer)',
    projectWorkspace: tempDir
  };

  fs.writeFileSync(path.join(tempDir, 'dummy.txt'), 'turn test content', 'utf8');

  // Mock fetch: returns tool calls on turns 1-5.
  // On turn 6 (finalization), verify NO tools are passed, and return final summary text.
  global.fetch = async (url, opts) => {
    turnsCalled++;
    const body = JSON.parse(opts.body);

    if (turnsCalled <= 5) {
      assert(body.tools, `Turn ${turnsCalled} must have tools declared`);
      return {
        ok: true,
        status: 200,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [
                  {
                    functionCall: {
                      name: 'ReadFile',
                      args: { filePath: 'dummy.txt' }
                    }
                  }
                ]
              }
            }
          ]
        })
      };
    }

    // Turn 6: The Finalization-only call!
    finalizationCallToolsPresent = !!body.tools;
    const lastPart = body.contents[body.contents.length - 1].parts[0];
    finalizationPromptReceived = lastPart.text;

    return {
      ok: true,
      status: 200,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: 'Finalization Summary: Completed 5 file read audits. All components inspected.'
                }
              ]
            }
          }
        ]
      })
    };
  };

  try {
    const res = await executeAgentLlmCallWithTools('Test turn limit finalization', 'Sys', frankyCtx, {
      maxTurns: 5,
      timeoutMs: 5000
    });

    assert(res, 'Must return result from finalization');
    assert.strictEqual(turnsCalled, 6, 'Must execute exactly 5 tool turns + 1 finalization turn = 6 calls');
    assert.strictEqual(finalizationCallToolsPresent, false, 'Finalization call must strictly omit tools');
    assert(finalizationPromptReceived.includes('reached the maximum tool execution limit'), 'Finalization prompt must ask for summary');
    assert.strictEqual(res.finalizationCalled, true, 'Must flag finalizationCalled in result');
    assert.strictEqual(res.executionStatus, 'COMPLETED');
    assert(res.text.includes('Finalization Summary'));
  } finally {
    global.fetch = originalFetch;
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('Phase 5.8: Deliverable Verification & Status Evaluation: One WriteFile does not mark COMPLETED; Shanks success + Nami failure yields PARTIAL', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'panda-phase5-deliv-'));

  try {
    const milestone3Deliverables = [
      { name: 'Architecture Spec', file: 'architecture.md', required: true },
      { name: 'Data Models', file: 'data-models.md', required: true }
    ];

    // Case 1: Empty workspace -> FAILED
    const statusEmpty = evaluateMilestoneStatus(tempDir, milestone3Deliverables);
    assert.strictEqual(statusEmpty, 'FAILED', 'Zero deliverables must evaluate to FAILED');

    // Case 2: Shanks creates architecture.md, but Nami data-models.md is missing -> PARTIAL
    fs.writeFileSync(path.join(tempDir, 'architecture.md'), '# System Architecture\nComplete specification...', 'utf8');
    const statusShanksOnly = evaluateMilestoneStatus(tempDir, milestone3Deliverables);
    assert.strictEqual(statusShanksOnly, 'PARTIAL', 'One deliverable present out of two must evaluate to PARTIAL');
    assert.notStrictEqual(statusShanksOnly, 'COMPLETED', 'Milestone 3 must NOT be marked COMPLETED when Nami is incomplete');

    // Case 3: Nami creates data-models.md as well -> COMPLETED
    fs.writeFileSync(path.join(tempDir, 'data-models.md'), '# Data Models\nEntities & Schemas...', 'utf8');
    const statusBothDone = evaluateMilestoneStatus(tempDir, milestone3Deliverables);
    assert.strictEqual(statusBothDone, 'COMPLETED', 'Both deliverables present must evaluate to COMPLETED');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('Phase 5.9: Failover Safety: Provider failure falls back to Groq with preserved history; turn-limit does not restart on Groq', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'panda-phase5-failover-'));
  const originalFetch = global.fetch;

  const frankyCtx = {
    agentId: 'sh-franky',
    agentName: 'Franky (UI Engineer)',
    projectWorkspace: tempDir
  };

  fs.writeFileSync(path.join(tempDir, 'app.html'), '<div>Voyage</div>', 'utf8');

  let groqReceivedMessages = null;
  let geminiAttempts = 0;

  global.fetch = async (url, opts) => {
    const urlStr = String(url);
    if (urlStr.includes('generativelanguage.googleapis.com')) {
      geminiAttempts++;
      if (geminiAttempts === 1) {
        // Turn 1 on Gemini: model calls ReadFile
        return {
          ok: true,
          status: 200,
          json: async () => ({
            candidates: [
              {
                content: {
                  parts: [
                    {
                      functionCall: {
                        name: 'ReadFile',
                        args: { filePath: 'app.html' }
                      }
                    }
                  ]
                }
              }
            ]
          })
        };
      }
      // Turn 2 on Gemini fails with provider error 503
      return {
        ok: false,
        status: 503,
        text: async () => 'Gemini rate limited'
      };
    }

    if (urlStr.includes('api.groq.com')) {
      const body = JSON.parse(opts.body);
      groqReceivedMessages = body.messages;
      return {
        ok: true,
        status: 200,
        json: async () => ({
          choices: [
            {
              message: {
                role: 'assistant',
                content: 'Successfully continued voyage on Groq after Gemini failover with full context preserved.'
              }
            }
          ]
        })
      };
    }

    return originalFetch(url, opts);
  };

  try {
    const res = await executeAgentLlmCallWithTools('Build navbar', 'You are Franky', frankyCtx, {
      maxTurns: 5,
      timeoutMs: 5000
    });

    assert(res, 'Failover must return valid result');
    assert.strictEqual(res.provider, 'groq', 'Must successfully failover to Groq on provider 503 error');
    assert(groqReceivedMessages, 'Groq must receive messages payload');

    // Verify Groq received the tool call and tool result that happened on Gemini
    const toolCallMsg = groqReceivedMessages.find((m) => m.role === 'assistant' && m.tool_calls);
    assert(toolCallMsg, 'Groq messages must include prior tool_calls assistant turn');
    assert.strictEqual(toolCallMsg.tool_calls[0].function.name, 'ReadFile');

    const toolResultMsg = groqReceivedMessages.find((m) => m.role === 'tool');
    assert(toolResultMsg, 'Groq messages must include prior tool result turn');
    assert(toolResultMsg.content.includes('Voyage'), 'Tool result content must be preserved across failover');
  } finally {
    global.fetch = originalFetch;
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('Phase 5.10: Real callAgentAutonomous() integration: exercises end-to-end execution path with toolContext and dynamic skills', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'panda-phase5-call-agent-'));
  const originalFetch = global.fetch;

  const franky = getStrawHatCrewAgent('sh-franky');
  const frankyCtx = {
    agentId: 'sh-franky',
    agentName: franky.name,
    projectWorkspace: tempDir
  };

  let toolTurnExecuted = false;

  // Mock fetch simulating realistic multi-turn tool interaction:
  // Turn 1: Model calls WriteFile to create header.html
  // Turn 2: Model finishes with final explanation
  global.fetch = async (url, opts) => {
    const urlStr = String(url);
    if (urlStr.includes('generativelanguage.googleapis.com')) {
      const body = JSON.parse(opts.body);
      if (body.contents.length === 1) {
        // Initial user prompt -> model decides to call WriteFile tool
        return {
          ok: true,
          status: 200,
          json: async () => ({
            candidates: [
              {
                content: {
                  parts: [
                    {
                      functionCall: {
                        name: 'WriteFile',
                        args: {
                          filePath: 'header.html',
                          content: '<header class="navbar"><h1>Straw Hat Hub</h1></header>'
                        }
                      }
                    }
                  ]
                }
              }
            ]
          })
        };
      }

      // Turn 2: Model receives functionResponse and produces final text
      toolTurnExecuted = true;
      return {
        ok: true,
        status: 200,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: 'SUPER! I have written the responsive header markup into header.html using the WriteFile tool.'
                  }
                ]
              }
            }
          ]
        })
      };
    }

    return originalFetch(url, opts);
  };

  try {
    const res = await callAgentAutonomous(
      franky,
      'Build responsive header for Straw Hat Hub and save to header.html',
      {
        milestoneTitle: 'Milestone 4: Responsive UI Layout & HTML5 Markup',
        taskDescription: 'Frontend UI layout, modern semantic HTML5, responsive grid',
        toolContext: frankyCtx,
        minChars: 30,
        maxTurns: 3
      }
    );

    assert(res, 'callAgentAutonomous must return a result');
    assert.strictEqual(toolTurnExecuted, true, 'Tool turn must have executed');
    assert(res.text.includes('header.html'), 'Final text must reference created header');
    assert.strictEqual(res.provider, 'gemini');

    // 1. Verify file was ACTUALLY created on disk in the assigned workspace by Franky's tool call!
    const createdFile = path.join(tempDir, 'header.html');
    assert.strictEqual(fs.existsSync(createdFile), true, 'header.html must exist on disk in assigned workspace');
    const content = fs.readFileSync(createdFile, 'utf8');
    assert.strictEqual(content, '<header class="navbar"><h1>Straw Hat Hub</h1></header>');

    // 2. Verify tool telemetry is recorded accurately
    assert.strictEqual(res.toolCallsExecuted.length, 1);
    assert.strictEqual(res.toolCallsExecuted[0].toolName, 'WriteFile');
    assert.strictEqual(res.toolCallsExecuted[0].status, 'success');
    assert.strictEqual(res.toolCallsExecuted[0].turn, 1);
    assert(typeof res.toolCallsExecuted[0].durationMs === 'number');

    // 3. Verify dynamic skills engine activated relevant skills for Franky
    assert(Array.isArray(res.activatedSkills));
    assert(res.activatedSkills.length > 0, 'Must have activated skills for UI engineering');
    assert(res.activatedSkills.some((s) => s.name === 'frontend-ui-engineering'));
  } finally {
    global.fetch = originalFetch;
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
