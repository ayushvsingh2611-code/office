'use strict';
const test = require('node:test');
const assert = require('node:assert');
const loadTs = require('./load-ts.cjs');

const {
  MicrosoftLearnMcpClient,
  MICROSOFT_LEARN_FALLBACK_TOOLS
} = loadTs('src/main/mcpClient.ts');

test('McpClient: Fallback tools list is well-formed', () => {
  assert.ok(Array.isArray(MICROSOFT_LEARN_FALLBACK_TOOLS));
  assert.strictEqual(MICROSOFT_LEARN_FALLBACK_TOOLS.length, 3);
  const names = MICROSOFT_LEARN_FALLBACK_TOOLS.map((t) => t.name);
  assert.ok(names.includes('microsoft_docs_search'));
  assert.ok(names.includes('microsoft_docs_fetch'));
  assert.ok(names.includes('microsoft_code_sample_search'));

  for (const t of MICROSOFT_LEARN_FALLBACK_TOOLS) {
    assert.ok(t.name);
    assert.ok(t.description);
    assert.ok(t.inputSchema);
    assert.strictEqual(t.inputSchema.type, 'object');
  }
});

test('McpClient: Gracefully falls back to standard tools when endpoint is unavailable', async () => {
  const client = new MicrosoftLearnMcpClient('http://192.0.2.1:59999/unreachable'); // TEST-NET unreachable
  const tools = await client.discoverTools(true);
  assert.ok(Array.isArray(tools));
  assert.strictEqual(tools.length, 3);
  assert.strictEqual(tools[0].name, 'microsoft_docs_search');

  const result = await client.callTool('microsoft_docs_search', { query: 'test' });
  assert.ok(result.isError);
  assert.ok(result.content[0].text.includes('Failed to execute tool'));
});

test('McpClient: Parses SSE streamable response and JSON-RPC payloads', () => {
  const client = new MicrosoftLearnMcpClient();

  // Test SSE event: message\ndata: ...
  const ssePayload = [
    'event: message',
    'data: {"jsonrpc":"2.0","id":"disc_1","result":{"tools":[{"name":"microsoft_docs_search","description":"Search docs","inputSchema":{"type":"object"}}]}}',
    ''
  ].join('\n');

  const parsedSse = client.parseRpcResponse(ssePayload);
  assert.strictEqual(parsedSse.jsonrpc, '2.0');
  assert.strictEqual(parsedSse.id, 'disc_1');
  assert.strictEqual(parsedSse.result.tools[0].name, 'microsoft_docs_search');

  // Test standard JSON-RPC
  const jsonPayload = JSON.stringify({
    jsonrpc: '2.0',
    id: 'call_1',
    result: {
      content: [{ type: 'text', text: 'Documentation content here' }]
    }
  });

  const parsedJson = client.parseRpcResponse(jsonPayload);
  assert.strictEqual(parsedJson.result.content[0].text, 'Documentation content here');

  // Test malformed payload error
  assert.throws(() => {
    client.parseRpcResponse('not-valid-json-or-sse');
  }, /Unable to parse MCP response/);
});
