'use strict';
/**
 * Panda Hive — Phase 4 Verification Test Suite
 *
 * Covers:
 * 1. Phase 4A: 5 Curated Skills Verification & Framework Gating
 * 2. Phase 4B: Native Fetch Tool SSRF Protection & HTML Parsing
 * 3. Phase 4C: Native Git Tools (Status, Diff, Path-Jailing)
 * 4. Phase 4D: Microsoft Learn MCP Client Discovery & SSE Parsing
 * 5. Phase 4E: Gemini & Groq Tool Schema Generation & Multi-Turn Dispatch
 * 6. Phase 4 Security: Persistent Workspace Permission Manager
 */

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { execFileSync } = require('node:child_process');
const loadTs = require('./load-ts.cjs');

// Modules to verify
const { skillsEngine } = loadTs('src/main/skillsEngine.ts');
const {
  isPrivateOrRestrictedIp,
  validateSafeUrl,
  htmlToCleanText
} = loadTs('src/main/fetchUrlTool.ts');
const {
  isGitRepository,
  getGitStatus,
  getGitDiff
} = loadTs('src/main/gitTools.ts');
const {
  microsoftLearnMcpClient,
  MICROSOFT_LEARN_FALLBACK_TOOLS,
  MicrosoftLearnMcpClient
} = loadTs('src/main/mcpClient.ts');
const {
  agentTools,
  workspacePermissionManager,
  AGENT_ALLOWED_TOOLS,
  PANDA_HIVE_TOOL_DEFINITIONS
} = loadTs('src/main/agentTools.ts');
const {
  formatToolsForGemini,
  formatToolsForGroq,
  resolveAllowedToolsForAgent
} = loadTs('src/main/geminiClient.ts');

// ─────────────────────────────────────────────────────────────────────────────
// 1. Phase 4A: Curated Skills Verification & Framework Gating
// ─────────────────────────────────────────────────────────────────────────────

test('Phase 4A: All 5 curated Phase 4 skills exist on disk with valid MIT metadata', () => {
  const expectedSkills = [
    { dir: 'web-design-guidelines', author: 'Vercel Labs', license: 'MIT' },
    { dir: 'systematic-debugging', author: 'Jesse Vincent', license: 'MIT' },
    { dir: 'vercel-react-best-practices', author: 'Vercel Labs', license: 'MIT' },
    { dir: 'vercel-composition-patterns', author: 'Vercel Labs', license: 'MIT' },
    { dir: 'test-driven-development', author: 'Jesse Vincent', license: 'MIT' }
  ];

  for (const s of expectedSkills) {
    const skillPath = path.join(process.cwd(), 'skills', s.dir, 'SKILL.md');
    assert.ok(fs.existsSync(skillPath), `Skill file must exist: ${skillPath}`);
    const content = fs.readFileSync(skillPath, 'utf8');
    assert.ok(content.includes(`license: ${s.license}`), `Must declare MIT license: ${s.dir}`);
    assert.ok(content.includes(`author: ${s.author}`), `Must declare correct author: ${s.dir}`);
    assert.ok(content.includes('notice: skills/NOTICE.md'), `Must reference NOTICE.md: ${s.dir}`);
  }

  // Verify skills/NOTICE.md includes both Vercel and Jesse Vincent notices
  const noticePath = path.join(process.cwd(), 'skills', 'NOTICE.md');
  assert.ok(fs.existsSync(noticePath));
  const noticeContent = fs.readFileSync(noticePath, 'utf8');
  assert.ok(noticeContent.includes('Vercel, Inc.'));
  assert.ok(noticeContent.includes('Jesse Vincent'));
});

test('Phase 4A: React framework gating activates React skills only when relevant', () => {
  // Test Non-React task for Franky
  const nonReactRes = skillsEngine.resolveSkillsForAgent(
    'sh-franky',
    'UI Engineer',
    'build pure vanilla HTML/CSS layout with responsive flexbox and semantic tags',
    { maxSkills: 4 }
  );
  const nonReactIds = nonReactRes.activatedSkills.map((s) => s.id);
  assert.ok(!nonReactIds.includes('vercel-react-best-practices'), 'Must not activate React skill on vanilla HTML/CSS');

  // Test React task for Franky
  const reactRes = skillsEngine.resolveSkillsForAgent(
    'sh-franky',
    'UI Engineer',
    'create React JSX components using hooks, state management, and modern React best practices',
    { maxSkills: 4 }
  );
  const reactIds = reactRes.activatedSkills.map((s) => s.id);
  assert.ok(reactIds.includes('vercel-react-best-practices'), 'Must activate React best practices on React task');
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Phase 4B: Native Fetch Tool SSRF Protection & HTML Parsing
// ─────────────────────────────────────────────────────────────────────────────

test('Phase 4B: SSRF guard strictly blocks internal, cloud metadata, and private IP ranges', () => {
  const blockedIps = [
    '127.0.0.1',
    '127.1.2.3',
    '10.0.0.1',
    '10.254.0.1',
    '172.16.0.1',
    '172.31.255.255',
    '192.168.0.1',
    '192.168.1.254',
    '169.254.169.254', // AWS/GCP/Azure instance metadata
    '169.254.1.1',
    '0.0.0.0',
    '::1',
    'fe80::1',
    'fc00::1'
  ];

  for (const ip of blockedIps) {
    assert.strictEqual(isPrivateOrRestrictedIp(ip), true, `IP ${ip} must be identified as restricted`);
  }

  // Public IPs must be allowed
  const publicIps = ['8.8.8.8', '1.1.1.1', '20.112.52.29'];
  for (const ip of publicIps) {
    assert.strictEqual(isPrivateOrRestrictedIp(ip), false, `IP ${ip} must be allowed as public`);
  }
});

test('Phase 4B: HTML to markdown extractor cleanly strips tags, scripts, and navigation', () => {
  const html = `
    <html>
      <head><script>alert('xss');</script><style>body { color: red; }</style></head>
      <body>
        <nav><a href="#home">Home</a></nav>
        <h1>API Documentation</h1>
        <p>This is a test of the <code>markdown</code> converter.</p>
        <ul>
          <li>Point 1</li>
          <li>Point 2</li>
        </ul>
        <footer>Copyright 2026</footer>
      </body>
    </html>
  `;
  const clean = htmlToCleanText(html);
  assert.ok(!clean.includes('alert'), 'Must strip script tags');
  assert.ok(!clean.includes('body {'), 'Must strip style tags');
  assert.ok(!clean.includes('<nav>'), 'Must strip nav tags');
  assert.ok(clean.includes('# API Documentation'), 'Must format h1 header');
  assert.ok(clean.includes('`markdown`'), 'Must format code tags');
  assert.ok(clean.includes('- Point 1'), 'Must format list items');
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Phase 4C: Native Git Tools (Status, Diff, Path-Jailing)
// ─────────────────────────────────────────────────────────────────────────────

test('Phase 4C: GitStatus and GitDiff run within workspace and enforce path-jailing', () => {
  const currentWs = path.resolve(__dirname, '..');
  const status = getGitStatus(currentWs);
  assert.strictEqual(status.isGitRepo, true);
  assert.ok(status.branch, 'Branch must be detected');

  // Verify non-git directory returns clean object without throwing
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hive-p4-git-'));
  try {
    const nonGitStatus = getGitStatus(tmpDir);
    assert.strictEqual(nonGitStatus.isGitRepo, false);
    assert.ok(nonGitStatus.error && nonGitStatus.error.includes('not a git repository'));

    // Verify path traversal rejection
    assert.throws(() => {
      getGitDiff(currentWs, { path: '../../escaped.txt' });
    }, /Permission denied/);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Phase 4D: Microsoft Learn MCP Client Discovery & SSE Parsing
// ─────────────────────────────────────────────────────────────────────────────

test('Phase 4D: Microsoft Learn MCP Client discovers tools and parses SSE streamable events', async () => {
  assert.ok(Array.isArray(MICROSOFT_LEARN_FALLBACK_TOOLS));
  assert.strictEqual(MICROSOFT_LEARN_FALLBACK_TOOLS.length, 3);

  const client = new MicrosoftLearnMcpClient();

  // Test SSE event line parsing
  const mockSse = [
    'event: message',
    'data: {"jsonrpc":"2.0","id":"test_1","result":{"tools":[{"name":"microsoft_docs_search","description":"Search docs","inputSchema":{"type":"object"}}]}}'
  ].join('\n');

  const parsed = client.parseRpcResponse(mockSse);
  assert.strictEqual(parsed.result.tools[0].name, 'microsoft_docs_search');
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. Phase 4E: Tool Schemas, Agent Permissions, and Dispatcher
// ─────────────────────────────────────────────────────────────────────────────

test('Phase 4E: Formats tool definitions for Gemini uppercase types and Groq functions', () => {
  const tools = resolveAllowedToolsForAgent('sh-franky');
  assert.ok(tools.length > 0);

  // Gemini formatting check
  const geminiTools = formatToolsForGemini(tools);
  assert.strictEqual(geminiTools.length, 1);
  assert.ok(Array.isArray(geminiTools[0].functionDeclarations));
  for (const fn of geminiTools[0].functionDeclarations) {
    assert.ok(fn.name);
    assert.ok(fn.description);
    assert.strictEqual(fn.parameters.type, 'OBJECT');
  }

  // Groq formatting check
  const groqTools = formatToolsForGroq(tools);
  assert.ok(Array.isArray(groqTools));
  for (const t of groqTools) {
    assert.strictEqual(t.type, 'function');
    assert.ok(t.function.name);
    assert.ok(t.function.parameters);
  }
});

test('Phase 4E: Agent role permissions grant advanced tools to appropriate crew members', () => {
  // Luffy (Captain)
  assert.ok(AGENT_ALLOWED_TOOLS['sh-luffy'].includes('GitStatus'));
  assert.ok(AGENT_ALLOWED_TOOLS['sh-luffy'].includes('GitDiff'));
  assert.ok(AGENT_ALLOWED_TOOLS['sh-luffy'].includes('FetchUrl'));

  // Franky (Frontend)
  assert.ok(AGENT_ALLOWED_TOOLS['sh-franky'].includes('FetchUrl'));
  assert.ok(AGENT_ALLOWED_TOOLS['sh-franky'].includes('CallMcpTool'));

  // Zoro (Code Review)
  assert.ok(AGENT_ALLOWED_TOOLS['sh-zoro'].includes('GitStatus'));
  assert.ok(AGENT_ALLOWED_TOOLS['sh-zoro'].includes('GitDiff'));

  // Chopper (QA)
  assert.ok(AGENT_ALLOWED_TOOLS['sh-chopper'].includes('BrowserTest'));
  assert.ok(AGENT_ALLOWED_TOOLS['sh-chopper'].includes('RunSyntaxAudit'));

  // Sanji (DevOps)
  assert.ok(AGENT_ALLOWED_TOOLS['sh-sanji'].includes('RunTerminalCommand'));
  assert.ok(AGENT_ALLOWED_TOOLS['sh-sanji'].includes('GitStatus'));
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. Security: Persistent Workspace Permission Manager
// ─────────────────────────────────────────────────────────────────────────────

test('Phase 4 Security: Persistent Workspace Permission Manager remembers authorized directories', () => {
  const testDir = path.join(os.tmpdir(), 'panda-authorized-ws');
  assert.strictEqual(workspacePermissionManager.isWorkspaceAuthorized(testDir), false);

  workspacePermissionManager.authorizeWorkspace(testDir);
  assert.strictEqual(workspacePermissionManager.isWorkspaceAuthorized(testDir), true);
  assert.strictEqual(workspacePermissionManager.isWorkspaceAuthorized(path.join(testDir, 'src')), true);

  workspacePermissionManager.revokeWorkspace(testDir);
  assert.strictEqual(workspacePermissionManager.isWorkspaceAuthorized(testDir), false);
});

