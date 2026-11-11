'use strict';
/**
 * Panda Hive Phase 4 — Live Provider & MCP Verification Script
 *
 * Verifies:
 * 1. Gemini Live Tool Calling with FetchUrl
 * 2. Groq Live Tool Calling with GitStatus
 * 3. Provider Failover with Tool Context Preservation
 * 4. Microsoft Learn Live MCP Discovery and Tool Call
 *
 * IMPORTANT:
 * - Does not print or expose API keys.
 * - Records structured verification results.
 */

const path = require('node:path');
const fs = require('node:fs');
const loadTs = require('../test/load-ts.cjs');

// Load .env
const envFile = path.join(process.cwd(), '.env');
if (fs.existsSync(envFile)) {
  const lines = fs.readFileSync(envFile, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq > 0) {
      const k = trimmed.slice(0, eq).trim();
      const v = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

const {
  executeAgentLlmCallWithTools,
  getGeminiApiKeys,
  getGroqApiKey
} = loadTs('src/main/geminiClient.ts');

const {
  MicrosoftLearnMcpClient
} = loadTs('src/main/mcpClient.ts');

async function runLiveAudit() {
  console.log('=== PANDA HIVE PHASE 4 LIVE VERIFICATION AUDIT ===\n');
  const results = {
    geminiLiveTool: { status: 'NOT TESTED' },
    groqLiveTool: { status: 'NOT TESTED' },
    failoverTool: { status: 'NOT TESTED' },
    mcpLive: { status: 'NOT TESTED' }
  };

  const keys = getGeminiApiKeys();
  const groqKey = getGroqApiKey();
  console.log(`Gemini keys loaded: ${keys.length}`);
  console.log(`Groq key loaded: ${groqKey ? 'YES' : 'NO'}\n`);

  const workspaceDir = path.resolve(__dirname, '..');

  // ───────────────────────────────────────────────────────────────────────────
  // 1. Gemini Live Tool Calling with FetchUrl
  // ───────────────────────────────────────────────────────────────────────────
  console.log('1. Testing Gemini Live Tool Calling (FetchUrl)...');
  try {
    const ctx = {
      agentId: 'sh-franky',
      agentName: 'Franky',
      projectWorkspace: workspaceDir
    };

    const prompt = 'Please use the FetchUrl tool to fetch the text content from "https://httpbin.org/robots.txt" and summarize what user-agents are disallowed.';
    const res = await executeAgentLlmCallWithTools(prompt, 'You are Franky, a skilled engineer. When asked to fetch a URL, invoke FetchUrl.', ctx, {
      preferGroq: false,
      timeoutMs: 30000,
      maxTurns: 3
    });

    console.log(`  Provider: ${res.provider}, Model: ${res.model}`);
    console.log(`  Tool Calls Executed: ${res.toolCallsExecuted.length}`);
    for (const tc of res.toolCallsExecuted) {
      console.log(`    - Tool: ${tc.toolName}, Status: ${tc.error ? 'ERROR: ' + tc.error : 'SUCCESS'}, Summary: ${tc.resultSummary.slice(0, 60)}...`);
    }
    console.log(`  Response preview: ${res.text.slice(0, 100).replace(/\n/g, ' ')}...\n`);

    if (res.provider === 'gemini' && res.toolCallsExecuted.some((tc) => tc.toolName === 'FetchUrl')) {
      results.geminiLiveTool = {
        status: 'VERIFIED',
        provider: res.provider,
        model: res.model,
        toolCalled: 'FetchUrl',
        turnsCount: res.turnsCount,
        hasToolResultInText: res.text.toLowerCase().includes('disallow') || res.text.toLowerCase().includes('robots')
      };
    } else {
      results.geminiLiveTool = {
        status: 'PARTIALLY VERIFIED',
        provider: res.provider,
        model: res.model,
        toolCalls: res.toolCallsExecuted.map((t) => t.toolName)
      };
    }
  } catch (err) {
    console.error('  Gemini Tool Calling Failed:', err.message);
    results.geminiLiveTool = {
      status: 'BLOCKED',
      error: err.message
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 2. Groq Live Tool Calling with GitStatus
  // ───────────────────────────────────────────────────────────────────────────
  console.log('2. Testing Groq Live Tool Calling (GitStatus)...');
  try {
    const ctx = {
      agentId: 'sh-zoro',
      agentName: 'Zoro',
      projectWorkspace: workspaceDir
    };

    const prompt = 'Please inspect our current repository using the GitStatus tool and report what branch we are on and whether working directory is clean.';
    const res = await executeAgentLlmCallWithTools(prompt, 'You are Zoro, First Mate. Always run GitStatus when asked about repo state.', ctx, {
      preferGroq: true,
      timeoutMs: 30000,
      maxTurns: 3
    });

    console.log(`  Provider: ${res.provider}, Model: ${res.model}`);
    console.log(`  Tool Calls Executed: ${res.toolCallsExecuted.length}`);
    for (const tc of res.toolCallsExecuted) {
      console.log(`    - Tool: ${tc.toolName}, Status: ${tc.error ? 'ERROR: ' + tc.error : 'SUCCESS'}, Summary: ${tc.resultSummary.slice(0, 60)}...`);
    }
    console.log(`  Response preview: ${res.text.slice(0, 100).replace(/\n/g, ' ')}...\n`);

    if (res.provider === 'groq' && res.toolCallsExecuted.some((tc) => tc.toolName === 'GitStatus')) {
      results.groqLiveTool = {
        status: 'VERIFIED',
        provider: res.provider,
        model: res.model,
        toolCalled: 'GitStatus',
        turnsCount: res.turnsCount,
        hasBranchInText: res.text.toLowerCase().includes('branch') || res.text.toLowerCase().includes('main')
      };
    } else {
      results.groqLiveTool = {
        status: 'PARTIALLY VERIFIED',
        provider: res.provider,
        model: res.model,
        toolCalls: res.toolCallsExecuted.map((t) => t.toolName)
      };
    }
  } catch (err) {
    console.error('  Groq Tool Calling Failed:', err.message);
    results.groqLiveTool = {
      status: 'BLOCKED',
      error: err.message
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 3. Provider Failover with Context & Tool Call Preservation
  // ───────────────────────────────────────────────────────────────────────────
  console.log('3. Testing Provider Failover with Context Preservation...');
  try {
    const ctx = {
      agentId: 'sh-usopp',
      agentName: 'Usopp',
      projectWorkspace: workspaceDir
    };

    // We simulate Gemini failure by temporarily setting invalid model or invalid key
    const { setGeminiApiKeys } = loadTs('src/main/geminiClient.ts');
    const realGeminiKeys = getGeminiApiKeys();
    setGeminiApiKeys(['INVALID_KEY_FOR_FAILOVER_TEST']);

    try {
      const prompt = 'Please run GitStatus to check repo status, then tell me the branch name.';
      const res = await executeAgentLlmCallWithTools(prompt, 'You are Usopp. Check git status.', ctx, {
        preferGroq: false, // Forces Gemini first, which will fail and trigger Groq failover
        timeoutMs: 30000,
        maxTurns: 3
      });

      console.log(`  Provider: ${res.provider}, Model: ${res.model}, FallbackOccurred: ${res.fallbackOccurred}`);
      console.log(`  Tool Calls: ${res.toolCallsExecuted.length}`);
      console.log(`  Response preview: ${res.text.slice(0, 100).replace(/\n/g, ' ')}...\n`);

      if (res.fallbackOccurred && (res.provider === 'groq' || res.provider === 'grok')) {
        results.failoverTool = {
          status: 'VERIFIED',
          fallbackOccurred: true,
          fallbackProvider: res.provider,
          model: res.model,
          toolCallsExecuted: res.toolCallsExecuted.length
        };
      } else {
        results.failoverTool = {
          status: 'PARTIALLY VERIFIED',
          fallbackOccurred: res.fallbackOccurred,
          provider: res.provider
        };
      }
    } finally {
      // Restore valid Gemini keys
      setGeminiApiKeys(realGeminiKeys);
    }
  } catch (err) {
    console.error('  Failover Test Failed:', err.message);
    results.failoverTool = {
      status: 'BLOCKED',
      error: err.message
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 4. Microsoft Learn Live MCP Verification
  // ───────────────────────────────────────────────────────────────────────────
  console.log('4. Testing Microsoft Learn Live MCP Endpoint...');
  try {
    const liveClient = new MicrosoftLearnMcpClient('https://learn.microsoft.com/api/mcp');
    const discovered = await liveClient.discoverTools(true);
    console.log(`  Discovered Tools: ${discovered.length}`);
    for (const t of discovered) {
      console.log(`    - ${t.name}: ${t.description.slice(0, 60)}...`);
    }

    const endpointStatus = liveClient.getEndpointStatus();
    console.log(`  Endpoint Status: available=${endpointStatus.available}`);

    if (endpointStatus.available) {
      console.log('  Invoking live search tool: microsoft_docs_search ("TypeScript interfaces")...');
      const searchRes = await liveClient.callTool('microsoft_docs_search', { query: 'TypeScript interfaces', top: 2 });
      console.log(`  Search Result Error: ${!!searchRes.isError}`);
      const textOutput = searchRes.content?.[0]?.text || '';
      console.log(`  Output Preview: ${textOutput.slice(0, 120).replace(/\n/g, ' ')}...\n`);

      if (!searchRes.isError && textOutput.length > 50) {
        results.mcpLive = {
          status: 'VERIFIED',
          toolsDiscovered: discovered.length,
          sampleTool: 'microsoft_docs_search',
          resultLength: textOutput.length,
          available: true
        };
      } else {
        results.mcpLive = {
          status: 'PARTIALLY VERIFIED',
          available: true,
          outputLength: textOutput.length
        };
      }
    } else {
      results.mcpLive = {
        status: 'BLOCKED',
        available: false,
        note: 'Endpoint unreachable from current network sandbox; fallback schemas preserved.'
      };
    }
  } catch (err) {
    console.error('  Live MCP Failed:', err.message);
    results.mcpLive = {
      status: 'BLOCKED',
      error: err.message
    };
  }

  console.log('=== LIVE AUDIT RESULTS SUMMARY ===');
  console.log(JSON.stringify(results, null, 2));

  fs.writeFileSync(
    path.join(process.cwd(), 'tools', 'phase4-live-audit-results.json'),
    JSON.stringify(results, null, 2),
    'utf8'
  );
}

runLiveAudit().catch((err) => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});
