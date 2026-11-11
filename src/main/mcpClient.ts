/**
 * Panda Hive Microsoft Learn MCP Client
 *
 * Implements an HTTP/SSE Streamable client for Microsoft Learn's Model Context Protocol endpoint:
 * https://learn.microsoft.com/api/mcp
 *
 * Capabilities:
 * - Dynamic discovery of tools via JSON-RPC 2.0 `tools/list`
 * - Execution of tools via JSON-RPC 2.0 `tools/call`
 * - In-memory caching of tool schemas to avoid redundant network round-trips
 * - Zero authentication requirement (public Microsoft Learn endpoint)
 * - Built-in fallback schema declarations and graceful offline handling
 */

export interface McpToolProperty {
  type: string;
  description?: string;
  enum?: string[];
  items?: Record<string, any>;
}

export interface McpToolInputSchema {
  type: 'object';
  properties?: Record<string, McpToolProperty>;
  required?: string[];
}

export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: McpToolInputSchema;
}

export interface McpToolCallResult {
  content: Array<{
    type: string;
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
  isError?: boolean;
}

/** Standard fallback tools when endpoint is offline or running in sandboxed network */
export const MICROSOFT_LEARN_FALLBACK_TOOLS: McpToolDefinition[] = [
  {
    name: 'microsoft_docs_search',
    description: 'Search official Microsoft Learn documentation, guides, and API references.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query for Microsoft documentation (e.g. "TypeScript interfaces", "Playwright test runner")'
        },
        top: {
          type: 'number',
          description: 'Maximum number of results to return (default 5)'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'microsoft_docs_fetch',
    description: 'Fetch the full content of a Microsoft Learn documentation article by its URL or relative path.',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'Full URL or path of the Microsoft Learn article to fetch'
        }
      },
      required: ['url']
    }
  },
  {
    name: 'microsoft_code_sample_search',
    description: 'Search official Microsoft and Azure code samples by topic, language, or product.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Keywords describing code samples to find'
        },
        language: {
          type: 'string',
          description: 'Programming language filter (e.g. "typescript", "csharp", "python")'
        }
      },
      required: ['query']
    }
  }
];

export class MicrosoftLearnMcpClient {
  private endpointUrl: string;
  private cachedTools: McpToolDefinition[] | null = null;
  private cacheTimestamp: number = 0;
  private cacheTtlMs: number = 60 * 60 * 1000; // 1 hour TTL
  private isEndpointAvailable: boolean = true;

  constructor(endpointUrl = 'https://learn.microsoft.com/api/mcp') {
    this.endpointUrl = endpointUrl;
  }

  /**
   * Helper to parse SSE (Server-Sent Events) or standard JSON payloads from MCP server.
   */
  parseRpcResponse(bodyText: string): any {
    const trimmed = bodyText.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      return JSON.parse(trimmed);
    }

    // SSE format: event: message\ndata: {...}
    const lines = trimmed.split(/\r?\n/);
    for (const line of lines) {
      if (line.startsWith('data:')) {
        const jsonStr = line.slice(5).trim();
        if (jsonStr) {
          return JSON.parse(jsonStr);
        }
      }
    }

    throw new Error(`Unable to parse MCP response as JSON or SSE stream: ${trimmed.slice(0, 160)}`);
  }

  /**
   * Dynamically discovers available tools from the Microsoft Learn MCP endpoint.
   * Caches results in memory and falls back to standard definitions on failure.
   */
  async discoverTools(forceRefresh = false): Promise<McpToolDefinition[]> {
    const now = Date.now();
    if (!forceRefresh && this.cachedTools && now - this.cacheTimestamp < this.cacheTtlMs) {
      return this.cachedTools;
    }

    try {
      const res = await fetch(this.endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream'
        },
        signal: AbortSignal.timeout(8000),
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: `disc_${Date.now()}`,
          method: 'tools/list',
          params: {}
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} from MCP endpoint: ${await res.text().catch(() => '')}`);
      }

      const rawText = await res.text();
      const parsed = this.parseRpcResponse(rawText);

      if (parsed?.result?.tools && Array.isArray(parsed.result.tools)) {
        const tools: McpToolDefinition[] = parsed.result.tools.map((t: any) => ({
          name: t.name,
          description: t.description || '',
          inputSchema: t.inputSchema || { type: 'object', properties: {} }
        }));
        this.cachedTools = tools;
        this.cacheTimestamp = now;
        this.isEndpointAvailable = true;
        return tools;
      }

      throw new Error('MCP tools/list result did not contain valid tools array');
    } catch {
      this.isEndpointAvailable = false;
      // Use fallback tools when endpoint cannot be reached
      this.cachedTools = MICROSOFT_LEARN_FALLBACK_TOOLS;
      this.cacheTimestamp = now;
      return this.cachedTools;
    }
  }

  /**
   * Invokes an MCP tool on the Microsoft Learn endpoint.
   */
  async callTool(name: string, args: Record<string, unknown> = {}): Promise<McpToolCallResult> {
    try {
      const res = await fetch(this.endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream'
        },
        signal: AbortSignal.timeout(15000),
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: `call_${Date.now()}`,
          method: 'tools/call',
          params: {
            name,
            arguments: args
          }
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${await res.text().catch(() => '')}`);
      }

      const rawText = await res.text();
      const parsed = this.parseRpcResponse(rawText);

      if (parsed?.error) {
        return {
          content: [{ type: 'text', text: `MCP Error [${parsed.error.code}]: ${parsed.error.message}` }],
          isError: true
        };
      }

      if (parsed?.result?.content) {
        return parsed.result as McpToolCallResult;
      }

      return {
        content: [{ type: 'text', text: JSON.stringify(parsed?.result || parsed) }]
      };
    } catch (err: any) {
      return {
        content: [
          {
            type: 'text',
            text: `[MicrosoftLearnMcpClient Error] Failed to execute tool "${name}": ${err.message}`
          }
        ],
        isError: true
      };
    }
  }

  getEndpointStatus(): { url: string; cached: boolean; toolCount: number; available: boolean } {
    return {
      url: this.endpointUrl,
      cached: this.cachedTools !== null,
      toolCount: this.cachedTools ? this.cachedTools.length : 0,
      available: this.isEndpointAvailable
    };
  }
}

export const microsoftLearnMcpClient = new MicrosoftLearnMcpClient();
