/**
 * Panda Hive Executable Agent Tools
 *
 * Provides real, permission-controlled, workspace-jailed tools for the 12 Straw Hat AI Agents.
 *
 * Native Tools:
 * - ReadFile: Read content from assigned project directory
 * - WriteFile: Write code or documentation to assigned project directory
 * - EditFile: Perform contiguous target/replacement edits
 * - ListFiles: List files in the project workspace
 * - SearchFiles: Search for regex or text across workspace files
 * - RunSyntaxAudit: Parse JavaScript syntax without executing to verify validity
 * - RunTerminalCommand: Safe, restricted command runner (no env exposure, timeout-bounded)
 * - BrowserTest: Headless DOM validation of HTML/CSS/JS bindings
 * - FetchUrl: SSRF-protected safe HTTP/HTTPS fetcher for public web documentation
 * - GitStatus: Workspace-jailed git repository status inspection
 * - GitDiff: Bounded, workspace-jailed git diff inspection
 * - CallMcpTool: Streamable MCP tool execution (e.g. Microsoft Learn documentation tools)
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync, mkdirSync, renameSync } from 'node:fs';
import { resolve, relative, normalize, join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { execSync } from 'node:child_process';
import { browserTestRunner, type RealBrowserTestReport } from './browserTestRunner';
import { fetchUrl as runFetchUrl, type FetchUrlResult } from './fetchUrlTool';
import { getGitStatus, getGitDiff, type GitStatusResult, type GitDiffResult, type GitDiffOptions } from './gitTools';
import { microsoftLearnMcpClient, type McpToolDefinition, type McpToolCallResult } from './mcpClient';

export interface ToolExecutionContext {
  agentId: string;
  agentName: string;
  projectWorkspace: string;
}

export interface ToolExecutionRecord {
  timestamp: number;
  agentId: string;
  agentName: string;
  toolName: string;
  args: Record<string, unknown>;
  status: 'success' | 'failure';
  resultSummary: string;
  error?: string;
}

export class AgentToolAccessError extends Error {
  constructor(message: string) {
    super(`[AgentToolAccessError] ${message}`);
    this.name = 'AgentToolAccessError';
  }
}

// ─── Persistent Workspace Permission Manager ─────────────────────────────────

export class WorkspacePermissionManager {
  private authorizedWorkspaces: Set<string> = new Set();
  private storageFilePath: string;

  constructor(customStoragePath?: string) {
    if (customStoragePath) {
      this.storageFilePath = customStoragePath;
    } else if (process.env.AGENTHIVE_PERMISSIONS_PATH || process.env.PANDA_PERMISSIONS_PATH) {
      this.storageFilePath = (process.env.AGENTHIVE_PERMISSIONS_PATH || process.env.PANDA_PERMISSIONS_PATH)!;
    } else {
      // Store in current workspace directory for sandbox-safe, cross-session persistence
      const defaultAgentHivePath = join(process.cwd(), '.agenthive-permissions.json');
      const legacyPandaPath = join(process.cwd(), '.panda-permissions.json');
      this.storageFilePath = existsSync(defaultAgentHivePath) ? defaultAgentHivePath : (existsSync(legacyPandaPath) ? legacyPandaPath : defaultAgentHivePath);
    }
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    try {
      if (existsSync(this.storageFilePath)) {
        const raw = readFileSync(this.storageFilePath, 'utf8');
        const parsed = JSON.parse(raw);
        const list = Array.isArray(parsed) ? parsed : (parsed?.workspaces || []);
        if (Array.isArray(list)) {
          for (const item of list) {
            if (typeof item === 'string' && item.trim()) {
              this.authorizedWorkspaces.add(normalize(resolve(item.trim())));
            }
          }
        }
      }
    } catch (err: any) {
      console.warn('[WorkspacePermissionManager] Failed to load permissions from disk:', err?.message || err);
    }
  }

  private saveToDisk(): void {
    try {
      const dir = dirname(this.storageFilePath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      const payload = JSON.stringify({
        version: 1,
        updatedAt: Date.now(),
        workspaces: Array.from(this.authorizedWorkspaces)
      }, null, 2);

      // Secure atomic write: write to temp file then renameSync
      const tempPath = `${this.storageFilePath}.tmp.${Date.now()}`;
      writeFileSync(tempPath, payload, 'utf8');
      renameSync(tempPath, this.storageFilePath);
    } catch (err: any) {
      console.warn('[WorkspacePermissionManager] Failed to save permissions to disk:', err?.message || err);
    }
  }

  authorizeWorkspace(workspaceDir: string): void {
    const normalized = normalize(resolve(workspaceDir));
    this.authorizedWorkspaces.add(normalized);
    this.saveToDisk();
  }

  isWorkspaceAuthorized(workspaceDir: string): boolean {
    const normalized = normalize(resolve(workspaceDir));
    for (const auth of this.authorizedWorkspaces) {
      if (normalized === auth || normalized.startsWith(auth)) {
        return true;
      }
    }
    return false;
  }

  revokeWorkspace(workspaceDir: string): void {
    const normalized = normalize(resolve(workspaceDir));
    this.authorizedWorkspaces.delete(normalized);
    this.saveToDisk();
  }

  getAuthorizedWorkspaces(): string[] {
    return Array.from(this.authorizedWorkspaces);
  }

  clear(): void {
    this.authorizedWorkspaces.clear();
    this.saveToDisk();
  }

  reload(): void {
    this.authorizedWorkspaces.clear();
    this.loadFromDisk();
  }

  getStorageFilePath(): string {
    return this.storageFilePath;
  }
}

export const workspacePermissionManager = new WorkspacePermissionManager();

// ─── Workspace Path Safety Guard ─────────────────────────────────────────────

export function resolveSafeWorkspacePath(workspaceDir: string, relativePath: string): string {
  const normalizedWs = normalize(resolve(workspaceDir));
  // Strip leading slashes/backslashes so paths like "/spec.md" remain relative to workspaceDir on Windows
  const cleanRelative = (relativePath || '').replace(/^[\/\\]+/, '');
  const targetPath = normalize(resolve(workspaceDir, cleanRelative));

  if (!targetPath.startsWith(normalizedWs)) {
    throw new AgentToolAccessError(
      `Permission denied: Path "${relativePath}" escapes assigned project workspace "${workspaceDir}"`
    );
  }

  return targetPath;
}

// ─── Role-Based Tool Permissions ─────────────────────────────────────────────

export const AGENT_ALLOWED_TOOLS: Record<string, string[]> = {
  // Luffy (Captain & Manager): Planning, Orchestration, Review, Sign-off
  'god': ['ReadFile', 'WriteFile', 'EditFile', 'ListFiles', 'SearchFiles', 'FetchUrl', 'GitStatus', 'GitDiff', 'CallMcpTool'],
  'sh-luffy': ['ReadFile', 'WriteFile', 'EditFile', 'ListFiles', 'SearchFiles', 'FetchUrl', 'GitStatus', 'GitDiff', 'CallMcpTool'],

  // Hancock (Requirements & Product Analyst): User stories, Specs
  'sh-hancock': ['ReadFile', 'WriteFile', 'EditFile', 'ListFiles', 'CallMcpTool'],

  // Shanks (System Architect): Architecture specs, System topology
  'sh-shanks': ['ReadFile', 'WriteFile', 'EditFile', 'ListFiles', 'FetchUrl', 'GitStatus', 'GitDiff', 'CallMcpTool'],

  // Nami (Data Architect): Data schemas, Entity models, State contracts
  'sh-nami': ['ReadFile', 'WriteFile', 'EditFile', 'ListFiles', 'CallMcpTool'],

  // Franky (UI/UX & Design Systems Engineer): HTML layout, CSS stylesheets, UI assets
  'sh-franky': ['ReadFile', 'WriteFile', 'EditFile', 'ListFiles', 'SearchFiles', 'FetchUrl', 'GitStatus', 'GitDiff', 'CallMcpTool'],

  // Usopp (Backend & Application Logic): Interactive JavaScript, State logic
  'sh-usopp': ['ReadFile', 'WriteFile', 'EditFile', 'ListFiles', 'SearchFiles', 'RunSyntaxAudit', 'FetchUrl', 'GitStatus', 'GitDiff', 'CallMcpTool'],

  // Brook (Integrations & Content): External API contracts, Sample data
  'sh-brook': ['ReadFile', 'WriteFile', 'EditFile', 'ListFiles', 'FetchUrl', 'CallMcpTool'],

  // Jinbe (Security Specialist): Security reviews, Input validation audits
  'sh-jinbe': ['ReadFile', 'WriteFile', 'EditFile', 'ListFiles', 'SearchFiles', 'FetchUrl', 'CallMcpTool'],

  // Chopper (QA Doctor & Test Engineer): Test execution, DOM validation, Syntax audits
  'sh-chopper': ['ReadFile', 'ListFiles', 'SearchFiles', 'RunSyntaxAudit', 'BrowserTest', 'RunTests', 'WriteFile', 'FetchUrl', 'GitStatus', 'GitDiff', 'CallMcpTool'],

  // Sanji (DevOps Specialist): Dockerfile, Container builds, Deployment config
  'sh-sanji': ['ReadFile', 'WriteFile', 'EditFile', 'ListFiles', 'RunTerminalCommand', 'GitStatus', 'GitDiff', 'CallMcpTool'],

  // Zoro (First Mate & Quality Gate): Strict code review, Linting audits
  'sh-zoro': ['ReadFile', 'ListFiles', 'SearchFiles', 'RunSyntaxAudit', 'WriteFile', 'FetchUrl', 'GitStatus', 'GitDiff', 'CallMcpTool'],

  // Robin (Archeologist & Historian): Comprehensive documentation & README
  'sh-robin': ['ReadFile', 'WriteFile', 'EditFile', 'ListFiles', 'FetchUrl', 'CallMcpTool']
};

export function checkAgentToolPermission(agentId: string, toolName: string): void {
  const allowed = AGENT_ALLOWED_TOOLS[agentId] || ['ReadFile', 'ListFiles'];
  if (!allowed.includes(toolName)) {
    throw new AgentToolAccessError(
      `Agent "${agentId}" is not authorized to use tool "${toolName}". Allowed tools: ${allowed.join(', ')}`
    );
  }
}

// ─── Canonical Tool Schemas for Gemini / Groq Tool Calling ───────────────────

export interface NativeToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export const PANDA_HIVE_TOOL_DEFINITIONS: Record<string, NativeToolDefinition> = {
  ReadFile: {
    name: 'ReadFile',
    description: 'Read the contents of a file within the assigned project workspace.',
    parameters: {
      type: 'object',
      properties: {
        filePath: { type: 'string', description: 'Relative path of the file to read' }
      },
      required: ['filePath']
    }
  },
  WriteFile: {
    name: 'WriteFile',
    description: 'Write content to a file in the workspace (creates parent directories if needed).',
    parameters: {
      type: 'object',
      properties: {
        filePath: { type: 'string', description: 'Relative path of the file to write' },
        content: { type: 'string', description: 'Complete content to write' }
      },
      required: ['filePath', 'content']
    }
  },
  EditFile: {
    name: 'EditFile',
    description: 'Replace a contiguous target string in a file with new content.',
    parameters: {
      type: 'object',
      properties: {
        filePath: { type: 'string', description: 'Relative path of the file to edit' },
        target: { type: 'string', description: 'Exact text segment to replace' },
        replacement: { type: 'string', description: 'New text segment to insert' }
      },
      required: ['filePath', 'target', 'replacement']
    }
  },
  ListFiles: {
    name: 'ListFiles',
    description: 'List files and directories inside the workspace.',
    parameters: {
      type: 'object',
      properties: {
        relDir: { type: 'string', description: 'Relative directory path to list (defaults to ".")' }
      }
    }
  },
  SearchFiles: {
    name: 'SearchFiles',
    description: 'Search for text matches across all text files in the workspace.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Substring or text query to search' }
      },
      required: ['query']
    }
  },
  RunSyntaxAudit: {
    name: 'RunSyntaxAudit',
    description: 'Parse JavaScript file syntax without executing to ensure validity.',
    parameters: {
      type: 'object',
      properties: {
        filePath: { type: 'string', description: 'Relative path of JavaScript file to parse' }
      },
      required: ['filePath']
    }
  },
  BrowserTest: {
    name: 'BrowserTest',
    description: 'Execute headless browser DOM and interaction validation against the project application.',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  FetchUrl: {
    name: 'FetchUrl',
    description: 'Safely fetch external web documentation, specifications, or public APIs with SSRF protection.',
    parameters: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'Public HTTP or HTTPS URL to retrieve' },
        maxBytes: { type: 'number', description: 'Maximum response byte limit (default 512KB)' }
      },
      required: ['url']
    }
  },
  GitStatus: {
    name: 'GitStatus',
    description: 'Inspect the git repository status (branch, tracking, staged, unstaged, untracked files).',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  GitDiff: {
    name: 'GitDiff',
    description: 'Inspect bounded git diff (unstaged or staged) within the workspace repository.',
    parameters: {
      type: 'object',
      properties: {
        staged: { type: 'boolean', description: 'Whether to show staged diff (--staged)' },
        path: { type: 'string', description: 'Optional relative path to filter diff' }
      }
    }
  },
  CallMcpTool: {
    name: 'CallMcpTool',
    description: 'Execute an MCP tool (e.g. Microsoft Learn documentation search or article fetch).',
    parameters: {
      type: 'object',
      properties: {
        toolName: { type: 'string', description: 'Name of the MCP tool to call' },
        args: { type: 'object', description: 'Arguments object for the MCP tool' }
      },
      required: ['toolName']
    }
  }
};

// ─── Concrete Tool Implementations ───────────────────────────────────────────

export class PandaHiveAgentTools {
  private auditLog: ToolExecutionRecord[] = [];
  private filesCreated = new Set<string>();
  private filesModified = new Set<string>();

  getAuditLog(): ToolExecutionRecord[] {
    return [...this.auditLog];
  }

  clearAuditLog(): void {
    this.auditLog = [];
  }

  getTrackedFileStats(): { created: string[]; modified: string[] } {
    return {
      created: Array.from(this.filesCreated),
      modified: Array.from(this.filesModified)
    };
  }

  resetTrackedFileStats(): void {
    this.filesCreated.clear();
    this.filesModified.clear();
  }

  // 1. ReadFile
  readFile(ctx: ToolExecutionContext, filePath: string): string {
    checkAgentToolPermission(ctx.agentId, 'ReadFile');
    const safePath = resolveSafeWorkspacePath(ctx.projectWorkspace, filePath);
    try {
      if (!existsSync(safePath)) {
        throw new Error(`File not found: ${filePath}`);
      }
      const content = readFileSync(safePath, 'utf8');
      this.recordSuccess(ctx, 'ReadFile', { filePath }, `Read ${content.length} chars from ${filePath}`);
      return content;
    } catch (err: any) {
      this.recordFailure(ctx, 'ReadFile', { filePath }, err.message);
      throw err;
    }
  }

  // 2. WriteFile
  writeFile(ctx: ToolExecutionContext, filePath: string, content: string): void {
    checkAgentToolPermission(ctx.agentId, 'WriteFile');
    const safePath = resolveSafeWorkspacePath(ctx.projectWorkspace, filePath);
    try {
      const lower = filePath.toLowerCase();
      // Safety guard: Never allow conversational markdown summaries to overwrite code files (.html, .css, .js, .json)
      if (lower.endsWith('.html') || lower.endsWith('.htm') || lower.endsWith('.css') || lower.endsWith('.js') || lower.endsWith('.json')) {
        const trimmed = (content || '').trim();
        if (
          /(?:^|\n)(?:#+\s*|\d+\.\s*|\*\*\s*)*Work Completed/i.test(trimmed) ||
          /^(?:#+\s|\d+\.\s+\*\*|###\s+)/i.test(trimmed) ||
          trimmed.startsWith('# ') ||
          trimmed.startsWith('## ') ||
          trimmed.startsWith('### ')
        ) {
          throw new Error(`Safety violation: Cannot write conversational Markdown summary into source file "${filePath}"`);
        }
      }

      const isNew = !existsSync(safePath);
      const dir = resolve(safePath, '..');
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
      writeFileSync(safePath, content, 'utf8');
      if (isNew) {
        this.filesCreated.add(filePath);
      } else {
        this.filesModified.add(filePath);
      }
      this.recordSuccess(ctx, 'WriteFile', { filePath, length: content.length, isNew }, `Wrote ${content.length} chars to ${filePath}`);
    } catch (err: any) {
      this.recordFailure(ctx, 'WriteFile', { filePath }, err.message);
      throw err;
    }
  }

  // 3. EditFile
  editFile(ctx: ToolExecutionContext, filePath: string, target: string, replacement: string): void {
    checkAgentToolPermission(ctx.agentId, 'EditFile');
    const safePath = resolveSafeWorkspacePath(ctx.projectWorkspace, filePath);
    try {
      if (!existsSync(safePath)) {
        throw new Error(`File not found: ${filePath}`);
      }
      const existing = readFileSync(safePath, 'utf8');
      if (!existing.includes(target)) {
        throw new Error(`Target string not found in ${filePath}`);
      }
      const updated = existing.replace(target, replacement);
      writeFileSync(safePath, updated, 'utf8');
      this.filesModified.add(filePath);
      this.recordSuccess(ctx, 'EditFile', { filePath }, `Replaced target in ${filePath}`);
    } catch (err: any) {
      this.recordFailure(ctx, 'EditFile', { filePath }, err.message);
      throw err;
    }
  }

  // 4. ListFiles
  listFiles(ctx: ToolExecutionContext, relDir = '.'): string[] {
    checkAgentToolPermission(ctx.agentId, 'ListFiles');
    const safePath = resolveSafeWorkspacePath(ctx.projectWorkspace, relDir);
    try {
      if (!existsSync(safePath)) return [];
      const entries = readdirSync(safePath);
      this.recordSuccess(ctx, 'ListFiles', { relDir }, `Found ${entries.length} items`);
      return entries;
    } catch (err: any) {
      this.recordFailure(ctx, 'ListFiles', { relDir }, err.message);
      throw err;
    }
  }

  // 5. SearchFiles
  searchFiles(ctx: ToolExecutionContext, query: string): { file: string; line: number; match: string }[] {
    checkAgentToolPermission(ctx.agentId, 'SearchFiles');
    const safeWs = resolve(ctx.projectWorkspace);
    const results: { file: string; line: number; match: string }[] = [];
    try {
      const files = readdirSync(safeWs).filter((f) => statSync(join(safeWs, f)).isFile());
      for (const f of files) {
        const content = readFileSync(join(safeWs, f), 'utf8');
        const lines = content.split('\n');
        lines.forEach((l, idx) => {
          if (l.toLowerCase().includes(query.toLowerCase())) {
            results.push({ file: f, line: idx + 1, match: l.trim().slice(0, 120) });
          }
        });
      }
      this.recordSuccess(ctx, 'SearchFiles', { query }, `Found ${results.length} matches`);
      return results;
    } catch (err: any) {
      this.recordFailure(ctx, 'SearchFiles', { query }, err.message);
      throw err;
    }
  }

  // 6. RunSyntaxAudit (for Chopper & Usopp)
  runSyntaxAudit(ctx: ToolExecutionContext, filePath: string): { valid: boolean; error?: string } {
    checkAgentToolPermission(ctx.agentId, 'RunSyntaxAudit');
    const safePath = resolveSafeWorkspacePath(ctx.projectWorkspace, filePath);
    try {
      if (!existsSync(safePath)) {
        throw new Error(`File not found: ${filePath}`);
      }
      const code = readFileSync(safePath, 'utf8');
      new Function(code);
      this.recordSuccess(ctx, 'RunSyntaxAudit', { filePath }, 'Syntax VALID');
      return { valid: true };
    } catch (syntaxErr: any) {
      this.recordFailure(ctx, 'RunSyntaxAudit', { filePath }, syntaxErr.message);
      return { valid: false, error: syntaxErr.message };
    }
  }

  // 7. BrowserTest (Headless DOM Verification)
  browserTest(ctx: ToolExecutionContext): { pass: boolean; buttonCount: number; formCount: number; hasScript: boolean; issues: string[] } {
    checkAgentToolPermission(ctx.agentId, 'BrowserTest');
    const htmlPath = resolveSafeWorkspacePath(ctx.projectWorkspace, 'index.html');
    const jsPath = resolveSafeWorkspacePath(ctx.projectWorkspace, 'app.js');
    const issues: string[] = [];

    if (!existsSync(htmlPath)) {
      issues.push('Missing index.html');
    }
    if (!existsSync(jsPath)) {
      issues.push('Missing app.js');
    }

    let buttonCount = 0;
    let formCount = 0;
    let hasScript = false;

    if (existsSync(htmlPath)) {
      const html = readFileSync(htmlPath, 'utf8');
      buttonCount = (html.match(/<button[\s>]/gi) || []).length;
      formCount = (html.match(/<form[\s>]/gi) || []).length;
      hasScript = html.includes('app.js');

      if (!hasScript) issues.push('index.html does not link app.js');
      if (buttonCount === 0) issues.push('No interactive <button> elements found');
    }

    if (existsSync(jsPath)) {
      const js = readFileSync(jsPath, 'utf8');
      try {
        new Function(js);
      } catch (e: any) {
        issues.push(`app.js syntax error: ${e.message}`);
      }
    }

    const pass = issues.length === 0;
    this.recordSuccess(ctx, 'BrowserTest', {}, pass ? 'DOM validation passed' : `Issues: ${issues.join('; ')}`);
    return { pass, buttonCount, formCount, hasScript, issues };
  }

  // 7B. RealBrowserFunctionalTest (Full Playwright Headless Chromium Execution)
  async runRealBrowserTest(
    ctx: ToolExecutionContext,
    userPrompt?: string,
    specContent?: string
  ): Promise<RealBrowserTestReport> {
    checkAgentToolPermission(ctx.agentId, 'BrowserTest');
    try {
      const report = await browserTestRunner.runDeepBrowserTest(
        ctx.projectWorkspace,
        userPrompt,
        specContent
      );
      this.recordSuccess(
        ctx,
        'BrowserTest',
        { mode: 'playwright-headless' },
        `Tested ${report.interactionsTested.length} interactions, ${report.errorsDetected.length} errors, Decision: ${report.finalQaApproval}`
      );
      return report;
    } catch (err: any) {
      this.recordFailure(ctx, 'BrowserTest', { mode: 'playwright-headless' }, err.message);
      throw err;
    }
  }

  // 8. RunTerminalCommand (Sanji DevOps - Safe sandbox only)
  runTerminalCommand(ctx: ToolExecutionContext, command: string): string {
    checkAgentToolPermission(ctx.agentId, 'RunTerminalCommand');
    // Block command injection or environment tampering
    const sanitizedCmd = command.trim();
    const disallowedPatterns = [
      /curl\s+.*api/i,
      /wget/i,
      /cat\s+.*\.env/i,
      /type\s+.*\.env/i,
      /rm\s+-rf\s+\//i,
      /format\s+[a-z]:/i,
      /powershell\s+-enc/i,
      /process\.env/i
    ];

    for (const pat of disallowedPatterns) {
      if (pat.test(sanitizedCmd)) {
        throw new AgentToolAccessError(`Command rejected by security policy: "${sanitizedCmd}"`);
      }
    }

    try {
      const out = execSync(sanitizedCmd, {
        cwd: ctx.projectWorkspace,
        timeout: 30000,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe']
      });
      this.recordSuccess(ctx, 'RunTerminalCommand', { command: sanitizedCmd }, `Command finished with output`);
      return out;
    } catch (err: any) {
      this.recordFailure(ctx, 'RunTerminalCommand', { command: sanitizedCmd }, err.message);
      throw err;
    }
  }

  // 9. FetchUrl (SSRF-Protected Native Fetch Tool)
  async fetchUrl(
    ctx: ToolExecutionContext,
    urlStr: string,
    options?: { maxBytes?: number; timeoutMs?: number }
  ): Promise<FetchUrlResult> {
    checkAgentToolPermission(ctx.agentId, 'FetchUrl');
    try {
      const res = await runFetchUrl(urlStr, {
        maxSizeBytes: options?.maxBytes,
        timeoutMs: options?.timeoutMs
      });
      if (res.status === 'success' && res.content !== undefined) {
        this.recordSuccess(ctx, 'FetchUrl', { url: urlStr }, `Fetched ${res.content.length} chars (HTTP ${res.statusCode})`);
      } else {
        this.recordFailure(ctx, 'FetchUrl', { url: urlStr }, res.error || 'Fetch failed');
      }
      return res;
    } catch (err: any) {
      this.recordFailure(ctx, 'FetchUrl', { url: urlStr }, err.message);
      throw err;
    }
  }

  // 10. GitStatus (Native Workspace-Jailed Git Status)
  gitStatus(ctx: ToolExecutionContext): GitStatusResult {
    checkAgentToolPermission(ctx.agentId, 'GitStatus');
    try {
      const status = getGitStatus(ctx.projectWorkspace);
      this.recordSuccess(
        ctx,
        'GitStatus',
        {},
        status.isGitRepo
          ? `Branch: ${status.branch || 'unknown'}, Staged: ${status.staged.length}, Unstaged: ${status.unstaged.length}, Clean: ${status.clean}`
          : `Not a git repository: ${status.error}`
      );
      return status;
    } catch (err: any) {
      this.recordFailure(ctx, 'GitStatus', {}, err.message);
      throw err;
    }
  }

  // 11. GitDiff (Native Workspace-Jailed Git Diff with Bounded Output)
  gitDiff(ctx: ToolExecutionContext, options: GitDiffOptions = {}): GitDiffResult {
    checkAgentToolPermission(ctx.agentId, 'GitDiff');
    try {
      const diff = getGitDiff(ctx.projectWorkspace, options);
      this.recordSuccess(
        ctx,
        'GitDiff',
        options as Record<string, unknown>,
        diff.isGitRepo
          ? `Diff length: ${diff.diff.length} chars, Truncated: ${diff.truncated}`
          : `Diff unavailable: ${diff.error}`
      );
      return diff;
    } catch (err: any) {
      this.recordFailure(ctx, 'GitDiff', options as Record<string, unknown>, err.message);
      throw err;
    }
  }

  // 12. CallMcpTool (Execute MCP Tools such as Microsoft Learn)
  async callMcpTool(
    ctx: ToolExecutionContext,
    toolName: string,
    args: Record<string, unknown> = {}
  ): Promise<McpToolCallResult> {
    checkAgentToolPermission(ctx.agentId, 'CallMcpTool');
    try {
      const result = await microsoftLearnMcpClient.callTool(toolName, args);
      const summary = result.content?.[0]?.text?.slice(0, 100) || (result.isError ? 'MCP Call Failed' : 'MCP Call Succeeded');
      if (result.isError) {
        this.recordFailure(ctx, 'CallMcpTool', { toolName, args }, summary);
      } else {
        this.recordSuccess(ctx, 'CallMcpTool', { toolName, args }, summary);
      }
      return result;
    } catch (err: any) {
      this.recordFailure(ctx, 'CallMcpTool', { toolName, args }, err.message);
      throw err;
    }
  }

  // Dispatcher for LLM tool invocation
  async executeToolByName(
    ctx: ToolExecutionContext,
    toolName: string,
    args: Record<string, any>
  ): Promise<any> {
    const targetFilePath = args.filePath || args.path;
    switch (toolName) {
      case 'ReadFile':
        return { content: this.readFile(ctx, targetFilePath) };
      case 'WriteFile':
        this.writeFile(ctx, targetFilePath, args.content);
        return { success: true, filePath: targetFilePath };
      case 'EditFile':
        this.editFile(ctx, targetFilePath, args.target, args.replacement);
        return { success: true, filePath: targetFilePath };
      case 'ListFiles':
        return { files: this.listFiles(ctx, args.relDir || '.') };
      case 'SearchFiles':
        return { matches: this.searchFiles(ctx, args.query) };
      case 'RunSyntaxAudit':
        return this.runSyntaxAudit(ctx, targetFilePath);
      case 'BrowserTest':
        return this.browserTest(ctx);
      case 'FetchUrl':
        return await this.fetchUrl(ctx, args.url, { maxBytes: args.maxBytes });
      case 'GitStatus':
        return this.gitStatus(ctx);
      case 'GitDiff':
        return this.gitDiff(ctx, { staged: args.staged, path: args.path });
      case 'CallMcpTool':
        return await this.callMcpTool(ctx, args.toolName, args.args || {});
      case 'RunTerminalCommand':
        return { output: this.runTerminalCommand(ctx, args.command) };
      default:
        // Check if tool is a direct MCP tool name (e.g. microsoft_docs_search)
        if (toolName.startsWith('microsoft_')) {
          checkAgentToolPermission(ctx.agentId, 'CallMcpTool');
          return await this.callMcpTool(ctx, toolName, args);
        }
        throw new AgentToolAccessError(`Unknown or unsupported tool: "${toolName}"`);
    }
  }

  private recordSuccess(ctx: ToolExecutionContext, toolName: string, args: Record<string, unknown>, summary: string): void {
    this.auditLog.push({
      timestamp: Date.now(),
      agentId: ctx.agentId,
      agentName: ctx.agentName,
      toolName,
      args,
      status: 'success',
      resultSummary: summary
    });
  }

  private recordFailure(ctx: ToolExecutionContext, toolName: string, args: Record<string, unknown>, error: string): void {
    this.auditLog.push({
      timestamp: Date.now(),
      agentId: ctx.agentId,
      agentName: ctx.agentName,
      toolName,
      args,
      status: 'failure',
      resultSummary: 'Failed',
      error
    });
  }
}

export const agentTools = new PandaHiveAgentTools();
export const AGENT_HIVE_TOOL_DEFINITIONS = PANDA_HIVE_TOOL_DEFINITIONS;
export { PandaHiveAgentTools as AgentHiveAgentTools };
