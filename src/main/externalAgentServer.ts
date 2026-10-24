/**
 * ExternalAgentServer — HTTP REST & Webhook Bridge for Panda Hive.
 *
 * Allows users to connect ANY external agent (Python, LangChain, AutoGen, CrewAI,
 * custom Node.js, FastAPI, n8n, OpenAI Assistant, or simple curl scripts)
 * directly to their Panda Hive floor and avatars!
 *
 * Listens on loopback (default 3737) with CORS enabled.
 * No external npm packages required (pure node:http).
 */
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import type { WebContents } from 'electron';

export interface ExternalEventPayload {
  status?: 'idle' | 'working' | 'thinking' | 'blocked' | 'success' | 'sleeping';
  action?: string;
  station?: 'shelf' | 'terminal' | 'web' | 'board' | 'mailbox' | 'mcp' | 'desk';
  tool?: 'Read' | 'Edit' | 'Write' | 'Bash' | 'WebFetch' | 'WebSearch' | 'Grep' | 'Glob' | 'TodoWrite' | 'MCP';
  thought?: string;
  text?: string;
  progress?: number;
  sleeping?: boolean;
}

export interface ExternalPromptMessage {
  id: string;
  agentId: string;
  text: string;
  timestamp: number;
}

export class ExternalAgentServer {
  private server: Server | null = null;
  private port = 3737;
  /** Queue of user prompts destined for external agents that poll instead of using webhooks */
  private pendingPrompts = new Map<string, ExternalPromptMessage[]>();
  /** Registered external webhook URLs: agentId -> callbackUrl */
  private webhookUrls = new Map<string, string>();

  constructor(private getWebContents: () => WebContents | null) {}

  public getPort(): number {
    return this.port;
  }

  public registerWebhook(agentId: string, url: string): void {
    if (url && url.trim()) {
      this.webhookUrls.set(agentId, url.trim());
    } else {
      this.webhookUrls.delete(agentId);
    }
  }

  public getWebhook(agentId: string): string | undefined {
    return this.webhookUrls.get(agentId);
  }

  /**
   * Queue a user prompt to an external agent.
   * If the agent has a webhookUrl, dispatch an HTTP POST immediately.
   * Otherwise keep it in the poll queue for the agent to fetch via GET /poll.
   */
  public async dispatchPromptToAgent(agentId: string, text: string): Promise<{ dispatched: boolean; method: 'webhook' | 'queued'; error?: string }> {
    const msg: ExternalPromptMessage = {
      id: `ext-msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      agentId,
      text,
      timestamp: Date.now()
    };

    const webhook = this.webhookUrls.get(agentId);
    if (webhook) {
      try {
        const payload = JSON.stringify({
          agentId,
          message: text,
          prompt: text,
          timestamp: msg.timestamp,
          replyUrl: `http://127.0.0.1:${this.port}/api/agent/${agentId}/event`
        });

        const res = await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          signal: AbortSignal.timeout(10000)
        });

        return { dispatched: res.ok, method: 'webhook' };
      } catch (err) {
        console.warn(`[external-agent] webhook dispatch failed for ${agentId}:`, err);
        // Fallback: also queue it in memory
        const q = this.pendingPrompts.get(agentId) ?? [];
        q.push(msg);
        this.pendingPrompts.set(agentId, q);
        return { dispatched: false, method: 'queued', error: err instanceof Error ? err.message : String(err) };
      }
    }

    // No webhook configured — queue for polling
    const q = this.pendingPrompts.get(agentId) ?? [];
    q.push(msg);
    this.pendingPrompts.set(agentId, q);
    return { dispatched: true, method: 'queued' };
  }

  public start(preferredPort = 3737): Promise<number> {
    return new Promise((resolve) => {
      this.port = preferredPort;

      this.server = createServer(async (req, res) => {
        // CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');

        if (req.method === 'OPTIONS') {
          res.writeHead(204);
          res.end();
          return;
        }

        try {
          await this.handleRequest(req, res);
        } catch (err) {
          console.error('[external-agent] request handler error:', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: err instanceof Error ? err.message : String(err) }));
        }
      });

      this.server.on('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') {
          console.warn(`[external-agent] port ${this.port} in use, trying ${this.port + 1}`);
          this.port += 1;
          this.server?.listen(this.port, '127.0.0.1');
        } else {
          console.error('[external-agent] server error:', err);
        }
      });

      this.server.listen(this.port, '127.0.0.1', () => {
        console.log(`[external-agent] Panda Hive External Agent API listening on http://127.0.0.1:${this.port}`);
        resolve(this.port);
      });
    });
  }

  public stop(): void {
    if (this.server) {
      try { this.server.close(); } catch { /* noop */ }
      this.server = null;
    }
  }

  private async parseJsonBody(req: IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', chunk => {
        body += chunk;
        if (body.length > 5 * 1024 * 1024) { // 5MB cap
          reject(new Error('Body too large'));
        }
      });
      req.on('end', () => {
        if (!body.trim()) { resolve({}); return; }
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error('Invalid JSON'));
        }
      });
      req.on('error', reject);
    });
  }

  private async handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const url = new URL(req.url ?? '/', `http://127.0.0.1:${this.port}`);
    const pathname = url.pathname;

    // 1) Health Check
    if (pathname === '/' || pathname === '/api/health' || pathname === '/api/status') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        ok: true,
        app: 'Panda Hive',
        version: '0.1.0',
        port: this.port,
        endpoints: {
          event: '/api/agent/:agentId/event',
          thought: '/api/agent/:agentId/thought',
          message: '/api/agent/:agentId/message',
          poll: '/api/agent/:agentId/poll',
          sleep: '/api/agent/:agentId/sleep',
          register: '/api/agent/register'
        }
      }));
      return;
    }

    // 2) Agent Registration
    if (pathname === '/api/agent/register' && req.method === 'POST') {
      const body = await this.parseJsonBody(req);
      const agentId = body.id || `ext-${Date.now()}`;
      if (body.webhookUrl) {
        this.registerWebhook(agentId, body.webhookUrl);
      }
      this.getWebContents()?.send('hive:externalAgentRegister', {
        id: agentId,
        name: body.name || 'External Panda',
        character: body.character || 'jim',
        accent: body.accent || 'mint',
        description: body.description || 'External API Agent',
        webhookUrl: body.webhookUrl
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, agentId, message: 'Agent registered on Panda Hive floor' }));
      return;
    }

    // Match /api/agent/:agentId/...
    const match = pathname.match(/^\/api\/agent\/([^/]+)(\/(.*))?$/);
    if (!match) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: 'Route not found' }));
      return;
    }

    const agentId = decodeURIComponent(match[1]);
    const action = match[3] || 'event';

    // 3) Event / Status Update (Avatar animation & state)
    if (action === 'event' || action === 'status') {
      if (req.method === 'POST') {
        const body: ExternalEventPayload = await this.parseJsonBody(req);

        // Forward to renderer to update store and floor avatars
        this.getWebContents()?.send('hive:externalAgentEvent', {
          agentId,
          status: body.status,
          action: body.action || body.thought,
          station: body.station,
          tool: body.tool,
          thought: body.thought,
          text: body.text,
          progress: body.progress,
          sleeping: body.sleeping
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, agentId, updated: body }));
        return;
      }
    }

    // 4) Quick Thought Bubble
    if (action === 'thought' && req.method === 'POST') {
      const body = await this.parseJsonBody(req);
      const thoughtText = typeof body === 'string' ? body : (body.thought || body.text || '');

      this.getWebContents()?.send('hive:externalAgentEvent', {
        agentId,
        thought: thoughtText,
        action: thoughtText,
        station: body.station,
        tool: body.tool
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, agentId, thought: thoughtText }));
      return;
    }

    // 5) Assistant Message / Reply
    if ((action === 'message' || action === 'reply') && req.method === 'POST') {
      const body = await this.parseJsonBody(req);
      const text = body.text || body.message || body.reply || '';

      this.getWebContents()?.send('hive:externalAgentMessage', {
        agentId,
        text,
        sender: body.sender || 'assistant',
        timestamp: Date.now()
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, agentId, textLength: text.length }));
      return;
    }

    // 6) Sleep / Wake
    if (action === 'sleep' && req.method === 'POST') {
      const body = await this.parseJsonBody(req);
      const sleeping = body.sleeping !== undefined ? !!body.sleeping : (body.sleep !== undefined ? !!body.sleep : true);

      this.getWebContents()?.send('hive:externalAgentEvent', {
        agentId,
        sleeping,
        status: sleeping ? 'idle' : 'working',
        action: sleeping ? 'sleeping zzz' : 'awake'
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, agentId, sleeping }));
      return;
    }

    // 7) Poll pending prompts from user
    if (action === 'poll' && req.method === 'GET') {
      const q = this.pendingPrompts.get(agentId) ?? [];
      this.pendingPrompts.set(agentId, []); // drain queue on poll
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, agentId, count: q.length, messages: q }));
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: `Unknown action: ${action}` }));
  }
}
