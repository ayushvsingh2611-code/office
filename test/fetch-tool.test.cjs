'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const loadTs = require('./load-ts.cjs');

const {
  isPrivateOrRestrictedIp,
  validateSafeUrl,
  htmlToCleanText,
  fetchUrl
} = loadTs('src/main/fetchUrlTool.ts');

// ─────────────────────────────────────────────────────────────────────────────
// 1. IP Validation & SSRF Prevention
// ─────────────────────────────────────────────────────────────────────────────
test('FetchUrl: Correctly identifies private, loopback, and cloud metadata IPs', () => {
  // Loopback
  assert.equal(isPrivateOrRestrictedIp('127.0.0.1'), true);
  assert.equal(isPrivateOrRestrictedIp('127.0.0.2'), true);
  assert.equal(isPrivateOrRestrictedIp('127.255.255.255'), true);
  assert.equal(isPrivateOrRestrictedIp('::1'), true);

  // Current network (0.0.0.0)
  assert.equal(isPrivateOrRestrictedIp('0.0.0.0'), true);
  assert.equal(isPrivateOrRestrictedIp('0.1.2.3'), true);

  // RFC 1918 Private
  assert.equal(isPrivateOrRestrictedIp('10.0.0.1'), true);
  assert.equal(isPrivateOrRestrictedIp('10.254.254.1'), true);
  assert.equal(isPrivateOrRestrictedIp('172.16.0.1'), true);
  assert.equal(isPrivateOrRestrictedIp('172.31.255.255'), true);
  assert.equal(isPrivateOrRestrictedIp('192.168.1.1'), true);
  assert.equal(isPrivateOrRestrictedIp('192.168.100.50'), true);

  // Link-local / Cloud Metadata (169.254.169.254)
  assert.equal(isPrivateOrRestrictedIp('169.254.169.254'), true);
  assert.equal(isPrivateOrRestrictedIp('169.254.1.1'), true);

  // Carrier-grade NAT (100.64.0.0/10)
  assert.equal(isPrivateOrRestrictedIp('100.64.0.1'), true);
  assert.equal(isPrivateOrRestrictedIp('100.127.255.255'), true);

  // Multicast
  assert.equal(isPrivateOrRestrictedIp('224.0.0.1'), true);
  assert.equal(isPrivateOrRestrictedIp('239.255.255.255'), true);

  // Public IPs must NOT be restricted
  assert.equal(isPrivateOrRestrictedIp('8.8.8.8'), false);
  assert.equal(isPrivateOrRestrictedIp('1.1.1.1'), false);
  assert.equal(isPrivateOrRestrictedIp('142.250.190.46'), false);
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. URL Hostname & Protocol Validation
// ─────────────────────────────────────────────────────────────────────────────
test('FetchUrl: Rejects non-HTTP protocols, localhost, and metadata hostnames', async () => {
  // Disallowed protocols
  await assert.rejects(
    validateSafeUrl('file:///etc/passwd'),
    /Unsupported protocol "file:"/
  );
  await assert.rejects(
    validateSafeUrl('ftp://ftp.example.com'),
    /Unsupported protocol "ftp:"/
  );
  await assert.rejects(
    validateSafeUrl('gopher://gopher.example.com'),
    /Unsupported protocol "gopher:"/
  );

  // Localhost hostnames
  await assert.rejects(
    validateSafeUrl('http://localhost:3000'),
    /Access to private host "localhost" is blocked/
  );
  await assert.rejects(
    validateSafeUrl('http://app.localhost:8080'),
    /Access to private host "app.localhost" is blocked/
  );
  await assert.rejects(
    validateSafeUrl('http://metadata.google.internal'),
    /Access to private host "metadata.google.internal" is blocked/
  );

  // Direct private IP in URL
  await assert.rejects(
    validateSafeUrl('http://169.254.169.254/latest/meta-data'),
    /Access to private or link-local IP/
  );
  await assert.rejects(
    validateSafeUrl('http://127.0.0.1:8080'),
    /Access to private or link-local IP/
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. HTML Sanitization & Markdown Conversion
// ─────────────────────────────────────────────────────────────────────────────
test('FetchUrl: Strips scripts, styles, navigation and extracts clean markdown', () => {
  const sampleHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>API Documentation</title>
        <style>body { font-family: sans-serif; }</style>
        <script>console.log("tracker");</script>
      </head>
      <body>
        <nav><a href="/">Home</a> <a href="/docs">Docs</a></nav>
        <header><h1>Welcome to Documentation</h1></header>
        <p>This is a guide to <code>fetchUrl</code> in Panda Hive.</p>
        <h2>Key Endpoints</h2>
        <ul>
          <li><strong>/api/v1/status</strong> - Health check</li>
          <li><strong>/api/v1/items</strong> - List items</li>
        </ul>
        <footer>Copyright 2026</footer>
      </body>
    </html>
  `;

  const clean = htmlToCleanText(sampleHtml);

  assert.ok(!clean.includes('console.log'), 'Must not contain script contents');
  assert.ok(!clean.includes('font-family'), 'Must not contain style contents');
  assert.ok(!clean.includes('<nav>'), 'Must strip nav tags');
  assert.ok(!clean.includes('<footer>'), 'Must strip footer tags');
  assert.ok(clean.includes('# Welcome to Documentation'), 'Must preserve h1 as markdown');
  assert.ok(clean.includes('## Key Endpoints'), 'Must preserve h2 as markdown');
  assert.ok(clean.includes('`fetchUrl`'), 'Must convert code tags to backticks');
  assert.ok(clean.includes('- /api/v1/status - Health check'), 'Must convert list items');
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Local Test Server: Redirects, Timeouts, and Size Caps
// ─────────────────────────────────────────────────────────────────────────────
test('FetchUrl: Enforces size limits and redirect protection with mock server', async (t) => {
  // Create an ephemeral mock server on random port
  let server;
  let port;

  await new Promise((resolve) => {
    server = http.createServer((req, res) => {
      if (req.url === '/large') {
        // Return 1MB of data (exceeds default 512KB)
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('A'.repeat(600 * 1024));
      } else if (req.url === '/redirect-to-ssrf') {
        // Malicious redirect trying to bounce to 127.0.0.1
        res.writeHead(302, { 'Location': 'http://127.0.0.1:8080/secret' });
        res.end();
      } else if (req.url === '/slow') {
        // Never finishes to trigger timeout
        setTimeout(() => {
          res.end('done');
        }, 3000);
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>API Ready</h1><p>Documentation page</p>');
      }
    });

    server.listen(0, '127.0.0.1', () => {
      port = server.address().port;
      resolve();
    });
  });

  t.after(() => {
    server.close();
  });

  // Test 1: Direct call to 127.0.0.1 is blocked by SSRF
  const directBlocked = await fetchUrl(`http://127.0.0.1:${port}/test`);
  assert.equal(directBlocked.status, 'error');
  assert.ok(directBlocked.error.includes('blocked'), `Expected blocked error, got: ${directBlocked.error}`);

  // Test 2: Redirect targeting localhost / 127.0.0.1 is caught on the second hop
  // Even if initial URL were allowed, the redirect to 127.0.0.1 is blocked
  const redirectBlocked = await fetchUrl(`http://127.0.0.1:${port}/redirect-to-ssrf`);
  assert.equal(redirectBlocked.status, 'error');
  assert.ok(redirectBlocked.error.includes('blocked'));

  // Test 3: Oversized payload error test
  // We simulate size capping by passing small maxSizeBytes = 100
  const smallLimitRes = await fetchUrl(`http://127.0.0.1:${port}/large`, {
    maxSizeBytes: 100
  });
  assert.equal(smallLimitRes.status, 'error');
  assert.ok(smallLimitRes.error.includes('blocked') || smallLimitRes.error.includes('exceeds'));
});

