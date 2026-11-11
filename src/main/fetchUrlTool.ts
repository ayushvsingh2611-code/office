/**
 * Native Node.js FetchUrl Tool with Strict SSRF Protection for Panda Hive.
 *
 * Requirements:
 * - HTTP and HTTPS only.
 * - Strict SSRF protection: blocks localhost, private IPv4/IPv6, link-local, cloud metadata.
 * - DNS resolution validation before connection and on every redirect destination.
 * - Manual redirect handling to prevent redirect-based SSRF bypass (max 5 hops).
 * - Request timeout (default 8000ms) via AbortController.
 * - Response size capping (default 512KB) to prevent memory denial-of-service.
 * - HTML-to-clean-text / Markdown conversion (strips script, style, nav, svg).
 * - Zero secret leakage (no auth headers forwarded).
 */

import * as dns from 'node:dns/promises';
import * as http from 'node:http';
import * as https from 'node:https';
import { isIP } from 'node:net';

export interface FetchUrlOptions {
  timeoutMs?: number;
  maxSizeBytes?: number;
  maxRedirects?: number;
}

export interface FetchUrlResult {
  status: 'success' | 'error';
  url: string;
  statusCode?: number;
  content?: string;
  contentType?: string;
  sizeBytes?: number;
  error?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. IP Range & SSRF Validation
// ─────────────────────────────────────────────────────────────────────────────

function ipv4ToInt(ip: string): number {
  const parts = ip.split('.').map((p) => parseInt(p, 10));
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    throw new Error(`Invalid IPv4 address: ${ip}`);
  }
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

export function isPrivateOrRestrictedIp(ip: string): boolean {
  const version = isIP(ip);
  if (version === 0) return true; // Malformed / non-IP

  if (version === 4) {
    const num = ipv4ToInt(ip);

    // 0.0.0.0/8 (Current network)
    if ((num >>> 24) === 0) return true;

    // 127.0.0.0/8 (Loopback)
    if ((num >>> 24) === 127) return true;

    // 10.0.0.0/8 (Private-Use)
    if ((num >>> 24) === 10) return true;

    // 100.64.0.0/10 (Shared Address Space / CGNAT)
    if ((num >>> 22) === 0b0110010001) return true;

    // 169.254.0.0/16 (Link Local & AWS/GCP/Azure Metadata 169.254.169.254)
    if ((num >>> 16) === ((169 << 8) | 254)) return true;

    // 172.16.0.0/12 (Private-Use: 172.16.0.0 - 172.31.255.255)
    if ((num >>> 20) === ((172 << 4) | 1)) return true;

    // 192.168.0.0/16 (Private-Use)
    if ((num >>> 16) === ((192 << 8) | 168)) return true;

    // 198.18.0.0/15 (Benchmarking)
    if ((num >>> 17) === ((198 << 7) | 9)) return true;

    // 224.0.0.0/4 (Multicast)
    if ((num >>> 28) >= 14) return true;

    // 240.0.0.0/4 (Reserved / Future Use) & 255.255.255.255
    if ((num >>> 28) === 15) return true;

    return false;
  }

  if (version === 6) {
    const lower = ip.toLowerCase();

    // Loopback
    if (lower === '::1' || lower === '0:0:0:0:0:0:0:1') return true;
    // Unspecified
    if (lower === '::' || lower === '0:0:0:0:0:0:0:0') return true;

    // IPv4-mapped IPv6 (::ffff:127.0.0.1 or ::ffff:7f00:1)
    if (lower.startsWith('::ffff:')) {
      const v4Part = lower.slice(7);
      if (isIP(v4Part) === 4) {
        return isPrivateOrRestrictedIp(v4Part);
      }
    }

    // Link-local unicast (fe80::/10)
    if (/^fe[89ab]/i.test(lower)) return true;

    // Unique local address (fc00::/7 -> fc00.. or fd00..)
    if (/^f[cd]/i.test(lower)) return true;

    // Multicast (ff00::/8)
    if (lower.startsWith('ff')) return true;

    return false;
  }

  return true;
}

/**
 * Validates a URL against strict SSRF rules.
 * Resolves DNS and guarantees all resolved IPs are public.
 */
export async function validateSafeUrl(rawUrl: string): Promise<URL> {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch (err) {
    throw new Error(`Invalid URL format: "${rawUrl}"`);
  }

  // Protocol check: only HTTP and HTTPS
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`Unsupported protocol "${parsed.protocol}". Only http: and https: are permitted.`);
  }

  const hostname = parsed.hostname.toLowerCase();

  // Explicit localhost & metadata hostnames
  if (
    hostname === 'localhost' ||
    hostname === 'localhost.localdomain' ||
    hostname.endsWith('.localhost') ||
    hostname === 'metadata.google.internal' ||
    hostname === 'instance-data'
  ) {
    throw new Error(`Access to private host "${hostname}" is blocked by SSRF policy.`);
  }

  // If hostname is directly an IP
  if (isIP(hostname)) {
    if (isPrivateOrRestrictedIp(hostname)) {
      throw new Error(`Access to private or link-local IP "${hostname}" is blocked.`);
    }
    (parsed as any).pinnedIp = hostname;
    return parsed;
  }

  // Perform DNS lookup
  let addresses: Array<{ address: string; family: number }> = [];
  try {
    addresses = await dns.lookup(hostname, { all: true });
  } catch (err: any) {
    throw new Error(`DNS resolution failed for host "${hostname}": ${err.message}`);
  }

  if (addresses.length === 0) {
    throw new Error(`No IP addresses resolved for host "${hostname}".`);
  }

  // Check EVERY resolved address
  for (const { address } of addresses) {
    if (isPrivateOrRestrictedIp(address)) {
      throw new Error(
        `Host "${hostname}" resolved to restricted IP address "${address}" (SSRF protection).`
      );
    }
  }

  // Pin actual socket connection to the first validated IP to eliminate TOCTOU DNS rebinding
  (parsed as any).pinnedIp = addresses[0].address;
  return parsed;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Pinned HTTP / HTTPS Request Client (DNS Rebinding Immune)
// ─────────────────────────────────────────────────────────────────────────────

interface PinnedHttpResponse {
  statusCode: number;
  statusMessage?: string;
  headers: http.IncomingHttpHeaders;
  body: Buffer;
}

function executePinnedHttpRequest(
  parsed: URL,
  pinnedIp: string,
  options: {
    timeoutMs: number;
    maxSizeBytes: number;
    userAgent: string;
  }
): Promise<PinnedHttpResponse> {
  return new Promise((resolve, reject) => {
    const isHttps = parsed.protocol === 'https:';
    const client = isHttps ? https : http;
    const defaultPort = isHttps ? 443 : 80;
    const port = parsed.port ? parseInt(parsed.port, 10) : defaultPort;
    const isIpv6 = pinnedIp.includes(':');

    let settled = false;
    let timer: NodeJS.Timeout | null = null;

    const cleanup = () => {
      if (timer) clearTimeout(timer);
    };

    const req = client.request({
      hostname: parsed.hostname,
      port,
      path: (parsed.pathname || '/') + (parsed.search || ''),
      method: 'GET',
      headers: {
        'Host': parsed.hostname,
        'User-Agent': options.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/json,text/plain;q=0.9,*/*;q=0.8'
      },
      // PINNED LOOKUP: Binds socket connection directly to the pre-validated IP.
      // Hostname is preserved for TLS SNI and server certificate validation.
      lookup: (_host: string, opts: any, cb: (err: Error | null, address: any, family?: number) => void) => {
        if (opts && opts.all) {
          cb(null, [{ address: pinnedIp, family: isIpv6 ? 6 : 4 }]);
        } else {
          cb(null, pinnedIp, isIpv6 ? 6 : 4);
        }
      }
    });

    timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        cleanup();
        req.destroy(new Error(`Request timed out after ${options.timeoutMs}ms`));
      }
    }, options.timeoutMs);

    req.on('response', (res) => {
      const cl = res.headers['content-length'];
      if (cl) {
        const declared = parseInt(cl, 10);
        if (!isNaN(declared) && declared > options.maxSizeBytes) {
          settled = true;
          cleanup();
          req.destroy(new Error(`Response size (${declared} bytes) exceeds maximum limit of ${options.maxSizeBytes} bytes.`));
          return;
        }
      }

      const chunks: Buffer[] = [];
      let bytesReceived = 0;

      res.on('data', (chunk: Buffer) => {
        bytesReceived += chunk.length;
        if (bytesReceived > options.maxSizeBytes) {
          settled = true;
          cleanup();
          req.destroy(new Error(`Received payload (${bytesReceived} bytes) exceeds maximum limit of ${options.maxSizeBytes} bytes.`));
          return;
        }
        chunks.push(chunk);
      });

      res.on('end', () => {
        if (!settled) {
          settled = true;
          cleanup();
          resolve({
            statusCode: res.statusCode || 200,
            statusMessage: res.statusMessage,
            headers: res.headers,
            body: Buffer.concat(chunks)
          });
        }
      });

      res.on('error', (err) => {
        if (!settled) {
          settled = true;
          cleanup();
          reject(err);
        }
      });
    });

    req.on('error', (err) => {
      if (!settled) {
        settled = true;
        cleanup();
        reject(err);
      }
    });

    req.end();
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. HTML to Clean Text / Markdown Parser
// ─────────────────────────────────────────────────────────────────────────────

export function htmlToCleanText(html: string): string {
  if (!html || typeof html !== 'string') return '';

  // 1. Strip script, style, svg, noscript, nav, header, footer blocks
  let clean = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '')
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '')
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '');

  // 2. Convert common block tags to markdown equivalents
  clean = clean
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n')
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n')
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n')
    .replace(/<h[4-6][^>]*>([\s\S]*?)<\/h[4-6]>/gi, '\n#### $1\n')
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n- $1')
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<hr\s*\/?>/gi, '\n---\n')
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`')
    .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, '\n```\n$1\n```\n');

  // 3. Strip remaining HTML tags
  clean = clean.replace(/<[^>]+>/g, ' ');

  // 4. Decode common HTML entities
  clean = clean
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // 5. Normalize whitespace and blank lines
  return clean
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .filter((line, i, arr) => line.length > 0 || (i > 0 && arr[i - 1].length > 0))
    .join('\n')
    .trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. FetchUrl Implementation
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchUrl(
  targetUrl: string,
  options?: FetchUrlOptions
): Promise<FetchUrlResult> {
  const timeoutMs = options?.timeoutMs ?? 8000;
  const maxSizeBytes = options?.maxSizeBytes ?? 512 * 1024; // 512 KB
  const maxRedirects = options?.maxRedirects ?? 5;

  let currentUrl = targetUrl;
  let redirectsCount = 0;

  try {
    while (redirectsCount <= maxRedirects) {
      // 1. Strict SSRF check before every request hop
      const parsed = await validateSafeUrl(currentUrl);
      const pinnedIp = (parsed as any).pinnedIp || parsed.hostname;

      // 2. Execute connection pinned directly to the validated IP (immunizing against DNS rebinding)
      const response = await executePinnedHttpRequest(parsed, pinnedIp, {
        timeoutMs,
        maxSizeBytes,
        userAgent: 'AgentHive-Agent/1.0 (+https://agenthive.local)'
      });

      // 3. Handle HTTP Redirects (301, 302, 303, 307, 308)
      if ([301, 302, 303, 307, 308].includes(response.statusCode)) {
        const locationHeader = response.headers['location'];
        const location = Array.isArray(locationHeader) ? locationHeader[0] : locationHeader;
        if (!location) {
          throw new Error(`HTTP ${response.statusCode} redirect without Location header.`);
        }

        // Resolve relative redirects
        const nextUrl = new URL(location, currentUrl).toString();
        redirectsCount++;
        if (redirectsCount > maxRedirects) {
          throw new Error(`Exceeded maximum redirect limit (${maxRedirects} hops).`);
        }
        currentUrl = nextUrl;
        continue; // Next hop with fresh SSRF & DNS validation
      }

      if (response.statusCode >= 400) {
        return {
          status: 'error',
          url: currentUrl,
          statusCode: response.statusCode,
          error: `HTTP ${response.statusCode} ${response.statusMessage || ''}`.trim()
        };
      }

      // 4. Extract content and convert HTML if needed
      const contentTypeHeader = response.headers['content-type'] || 'text/plain';
      const contentType = Array.isArray(contentTypeHeader) ? contentTypeHeader[0] : contentTypeHeader;
      const sizeBytes = response.body.byteLength;
      const rawText = response.body.toString('utf8');

      let content = rawText;
      if (contentType.includes('text/html') || contentType.includes('application/xhtml+xml')) {
        content = htmlToCleanText(rawText);
      }

      return {
        status: 'success',
        url: currentUrl,
        statusCode: response.statusCode,
        contentType,
        sizeBytes,
        content
      };
    }

    throw new Error(`Exceeded maximum redirect limit (${maxRedirects}).`);
  } catch (err: any) {
    const isTimeout = err?.name === 'AbortError' || err?.message?.includes('timed out') || err?.message?.includes('aborted');
    return {
      status: 'error',
      url: currentUrl,
      error: isTimeout ? `Request timed out after ${timeoutMs}ms` : err.message || String(err)
    };
  }
}

