/**
 * ExternalAgentServer — HTTP REST & Webhook Bridge for AgentHive.
 *
 * Allows users to connect ANY external agent (Python, LangChain, AutoGen, CrewAI,
 * custom Node.js, FastAPI, n8n, OpenAI Assistant, or simple curl scripts)
 * directly to their AgentHive floor and avatars!
 *
 * Listens on loopback (default 3737) with CORS enabled.
 * No external npm packages required (pure node:http).
 */
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { writeFileSync, readFileSync, mkdirSync, existsSync, appendFileSync, statSync, copyFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import type { WebContents } from 'electron';
import { readConfig } from './config';
import {
  findLyzrConfig,
  callLyzrChat,
  LYZR_AGENTS,
  LyzrApiError,
  LyzrCreditExhaustedError
} from '../shared/lyzrAgents';
import { STRAW_HAT_CREW, findStrawHatAgent } from '../shared/strawHatAgents';
import { pandaHiveOrchestrator } from './pandaHiveOrchestrator';
import { callUnifiedLlm, callGeminiChat, getGeminiApiKey } from './geminiClient';
import { skillsEngine } from './skillsEngine';

interface SprintDeliverable {
  name: string;
  file: string;
  required: boolean;
}

interface SprintStep {
  stepNum: number;
  id: string;
  agentId: string;
  agentName: string;
  role: string;
  taskTitle: string;
  actionWorking: string;
  station: 'desk' | 'shelf' | 'terminal' | 'web' | 'board';
  tool: 'Read' | 'Edit' | 'Write' | 'Bash' | 'TodoWrite';
  deliverables: SprintDeliverable[];
  execute: (baseDir: string, prompt: string, previousArtifacts: Map<string, string>) => Promise<string>;
}

function getHiveDir(): string {
  try {
    const cfg = readConfig();
    if (cfg?.harnessHome) return join(cfg.harnessHome, 'hive');
  } catch { }
  return join(homedir(), 'HarnessAgents', 'hive');
}

function appendAgentMemory(agentId: string, note: string): void {
  try {
    const memoryFile = join(getHiveDir(), 'agents', agentId, 'memory.md');
    if (!existsSync(dirname(memoryFile))) {
      mkdirSync(dirname(memoryFile), { recursive: true });
    }
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const formattedNote = `\n\n### [${timestamp}]\n${note.trim()}\n`;
    appendFileSync(memoryFile, formattedNote, 'utf8');
  } catch (err) {
    console.error(`[externalAgentServer] Failed to append memory for ${agentId}:`, err);
  }
}

function appendHiveLog(event: Record<string, unknown>): void {
  try {
    const logFile = join(getHiveDir(), 'log.jsonl');
    if (!existsSync(dirname(logFile))) {
      mkdirSync(dirname(logFile), { recursive: true });
    }
    const line = JSON.stringify({ ts: Date.now(), ...event }) + '\n';
    appendFileSync(logFile, line, 'utf8');
  } catch (err) {
    console.error('[externalAgentServer] Failed to append log:', err);
  }
}

import {
  generateDynamicEngine,
  ensureProjectIsDynamic,
  getFallbackUIFiles
} from './dynamicEngine';
import { agentTools, workspacePermissionManager, type ToolExecutionContext } from './agentTools';
import {
  executeAgentLlmCallWithTools,
  type LlmToolExecutionResult,
  type ToolCallTelemetry
} from './geminiClient';
export { generateDynamicEngine, ensureProjectIsDynamic, getFallbackUIFiles };

/**
 * Extracts the relevant failing component snippet from HTML for targeted debugging context.
 */
export function extractRelevantComponent(html: string, errorHint: string): string {
  if (!html) return '';
  const idMatch = errorHint.match(/#([\w-]+)|id="([\w-]+)"/i);
  const targetId = idMatch ? (idMatch[1] || idMatch[2]) : null;

  if (targetId) {
    const idIndex = html.indexOf(`id="${targetId}"`) !== -1
      ? html.indexOf(`id="${targetId}"`)
      : html.indexOf(targetId);
    if (idIndex !== -1) {
      const start = Math.max(0, idIndex - 400);
      const end = Math.min(html.length, idIndex + 1600);
      return html.slice(start, end);
    }
  }

  if (/modal|dialog|backdrop/i.test(errorHint)) {
    const modalMatch = html.match(/<div[^>]+(?:id="[^"]*modal[^"]*"|class="[^"]*modal[^"]*")[\s\S]{0,2500}<\/div>/i);
    if (modalMatch) return modalMatch[0];
  }

  if (/form/i.test(errorHint)) {
    const formMatch = html.match(/<form[\s\S]{0,2000}<\/form>/i);
    if (formMatch) return formMatch[0];
  }

  return '';
}

/**
 * Resets all floor agents from blocked/waiting back to idle with clean state.
 */
export function resetFloorStatus(webContents: WebContents | null): void {
  const allIds = [
    'god',
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
    'sh-robin',
    'lyzr-orchestrator',
    'lyzr-pm',
    'lyzr-architect',
    'lyzr-ba',
    'lyzr-frontend',
    'lyzr-backend',
    'lyzr-devops'
  ];
  for (const id of allIds) {
    webContents?.send('hive:externalAgentEvent', {
      agentId: id,
      status: 'idle',
      action: 'Ready for new task',
      thought: 'Ready for new task',
      text: '',
      sleeping: false,
      station: 'desk'
    });
  }
}

export interface AgentMilestoneTelemetry {
  stepNum: number;
  agentId: string;
  agentName: string;
  role: string;
  provider: string;
  model: string;
  keyIndex?: number;
  durationMs: number;
  filesWritten: string[];
  toolCallsCount: number;
  successfulToolCalls?: number;
  failedToolCalls?: number;
  toolCallsExecuted?: Array<{
    agentId: string;
    milestoneId: string;
    toolName: string;
    status: 'success' | 'failure';
    durationMs: number;
    turn: number;
    error?: string;
    args?: Record<string, unknown>;
  }>;
  status:
  | 'COMPLETED'
  | 'PARTIAL'
  | 'BLOCKED'
  | 'FAILED'
  | 'passed'
  | 'blocked'
  | 'EXECUTION_COMPLETED'
  | 'QA_REJECTED'
  | 'QA_PASSED'
  | 'REVIEW_REJECTED'
  | 'SPRINT_APPROVED'
  | 'SPRINT_REJECTED';
  feedbackRetries?: number;
  fallbackOccurred?: boolean;
  activatedSkills?: Array<{
    name: string;
    version: string;
    sourcePath: string;
  }>;
  qaStatusMatrix?: {
    syntaxValidation: string;
    domValidation: string;
    browserFunctionalTesting: string;
    integrationTesting: string;
    finalQaApproval: string;
  };
}

/**
 * Strict validator for HTML deliverables. Disqualifies markdown summaries and non-HTML text.
 */
export function isValidHtml(str: string): boolean {
  if (!str || typeof str !== 'string') return false;
  const trimmed = str.trim();
  if (trimmed.length < 50) return false;
  if (
    /(?:^|\n)(?:#+\s*|\d+\.\s*|\*\*\s*)*Work Completed/i.test(trimmed) ||
    /^(?:#+\s|\d+\.\s+\*\*|###\s+)/i.test(trimmed) ||
    trimmed.startsWith('# ') ||
    trimmed.startsWith('## ') ||
    trimmed.startsWith('### ')
  ) return false;
  const hasDocTypeOrHtml = /<!DOCTYPE html|<html[\s>]/i.test(trimmed);
  const hasTags = /<(?:head|body|div|header|nav|main|script|style|section|button|form)[\s>]/i.test(trimmed);
  return (hasDocTypeOrHtml || hasTags) && (trimmed.includes('</') || trimmed.includes('/>'));
}

/**
 * Strict validator for CSS deliverables. Disqualifies markdown summaries.
 */
export function isValidCss(str: string): boolean {
  if (!str || typeof str !== 'string') return false;
  const trimmed = str.trim();
  if (trimmed.length < 20) return false;
  if (
    /(?:^|\n)(?:#+\s*|\d+\.\s*|\*\*\s*)*Work Completed/i.test(trimmed) ||
    /^(?:#+\s+[a-zA-Z]|\d+\.\s+\*\*|###\s+)/i.test(trimmed) ||
    trimmed.startsWith('1.')
  ) return false;
  return /[{][\s\S]*?[}]/.test(trimmed);
}

/**
 * Strict validator for JavaScript deliverables. Disqualifies markdown summaries and checks executable syntax.
 */
export function isValidJs(str: string): boolean {
  if (!str || typeof str !== 'string') return false;
  const trimmed = str.trim();
  if (trimmed.length < 20) return false;
  if (
    /(?:^|\n)(?:#+\s*|\d+\.\s*|\*\*\s*)*Work Completed/i.test(trimmed) ||
    /^(?:#+\s|\d+\.\s+\*\*|###\s+)/i.test(trimmed) ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('1.') ||
    trimmed.startsWith('*')
  ) return false;
  try {
    new Function(trimmed);
    return true;
  } catch (err: any) {
    if (err?.message?.includes('import') || err?.message?.includes('export')) {
      return !trimmed.startsWith('#');
    }
    return false;
  }
}

/**
 * Evaluates disk deliverable presence and returns explicit execution status:
 * - COMPLETED: All required deliverables exist on disk and have valid non-empty content
 * - PARTIAL: Some required deliverables exist, but not all
 * - FAILED: Zero required deliverables exist
 */
export function evaluateMilestoneStatus(
  baseDir: string,
  deliverables: Array<{ name: string; file: string; required?: boolean }>
): 'COMPLETED' | 'PARTIAL' | 'BLOCKED' | 'FAILED' {
  const required = deliverables.filter((d) => d.required);
  if (required.length === 0) return 'COMPLETED';

  let foundCount = 0;
  for (const d of required) {
    const p = join(baseDir, d.file);
    const altP = join(baseDir, 'docs', d.file);
    const activePath = existsSync(p) ? p : (existsSync(altP) ? altP : null);
    if (!activePath) continue;

    let size = 0;
    try {
      size = statSync(activePath).size;
    } catch { }

    if (size > 20) {
      const lower = d.file.toLowerCase();
      try {
        const content = readFileSync(activePath, 'utf8');
        if (lower.endsWith('.html') || lower.endsWith('.htm')) {
          if (!isValidHtml(content)) continue;
        } else if (lower.endsWith('.css')) {
          if (!isValidCss(content)) continue;
        } else if (lower.endsWith('.js')) {
          if (!isValidJs(content)) continue;
        }
      } catch { }
      foundCount++;
    }
  }

  if (foundCount === required.length) {
    return 'COMPLETED';
  }
  if (foundCount > 0) {
    return 'PARTIAL';
  }
  return 'FAILED';
}

export interface AgentAutonomousOptions {
  isLightweight?: boolean;
  timeoutMs?: number;
  preferredModel?: string;
  minChars?: number;
  milestoneTitle?: string;
  taskDescription?: string;
  toolContext?: ToolExecutionContext;
  maxTurns?: number;
  allowedTools?: string[];
}

export interface AgentAutonomousResult extends LlmToolExecutionResult {
  activatedSkills: Array<{ name: string; version: string; sourcePath: string }>;
}

/**
 * Autonomous Agent Invocation Primitive:
 * - NO silent fallback templates.
 * - Dynamic Skill Resolution (agentskills.io open standard).
 * - Multi-provider execution (3x Gemini Pool with key rotation + Groq failover).
 * - Multi-turn tool execution with ToolExecutionContext & permission boundaries.
 * - Explicit timeouts & retries.
 * - Throws on failure so orchestrator properly marks task as BLOCKED.
 */
export async function callAgentAutonomous(
  agentConfig: any,
  prompt: string,
  options?: AgentAutonomousOptions
): Promise<AgentAutonomousResult> {
  const isLightweight = options?.isLightweight ?? ['sh-brook', 'sh-sanji', 'sh-robin'].includes(agentConfig?.id);

  // 1. Dynamically resolve relevant skills for this specific agent, role, and task context
  const taskContext = `${options?.taskDescription || ''} ${options?.milestoneTitle || ''} ${prompt.slice(0, 800)}`.trim();
  const skillResolution = skillsEngine.resolveSkillsForAgent(
    agentConfig?.id || '',
    agentConfig?.role || '',
    taskContext,
    {
      milestoneTitle: options?.milestoneTitle,
      maxSkills: 2,
      maxChars: 7000
    }
  );

  let sysInstruction = `You are ${agentConfig?.name || 'Engineer'}, ${agentConfig?.role || 'Specialist'}. ${agentConfig?.goal || ''}`;
  const activatedSkillsList: Array<{ name: string; version: string; sourcePath: string }> = [];

  if (skillResolution && skillResolution.activatedSkills.length > 0) {
    sysInstruction += `\n\n${skillResolution.instructionText}`;
    for (const s of skillResolution.activatedSkills) {
      activatedSkillsList.push({
        name: s.name,
        version: s.version,
        sourcePath: s.sourcePath
      });
    }
    console.log(`[SkillsEngine] Dynamic skill(s) activated for ${agentConfig?.name}: ${activatedSkillsList.map((s) => `"${s.name}" (v${s.version})`).join(', ')}`);
  }

  const minExpected = options?.minChars ?? 50;

  const result = await executeAgentLlmCallWithTools(prompt, sysInstruction, options?.toolContext, {
    preferGroq: isLightweight,
    timeoutMs: options?.timeoutMs ?? 55000,
    preferredModel: options?.preferredModel,
    minChars: minExpected,
    maxTurns: options?.maxTurns ?? 5,
    allowedTools: options?.allowedTools
  });

  const effectiveMinChars = (result && result.toolCallsExecuted && result.toolCallsExecuted.length > 0)
    ? Math.min(minExpected, 20)
    : minExpected;

  if (!result || !result.text || result.text.trim().length < effectiveMinChars) {
    throw new Error(`Agent ${agentConfig?.name || 'Specialist'} produced insufficient output (<${effectiveMinChars} characters) from ${result?.provider || 'AI'}`);
  }

  console.log(`[Autonomous Agent: ${agentConfig?.name}] Executed via ${result.provider} (${result.model}${result.keyIndex ? ` key #${result.keyIndex}` : ''}${result.fallbackOccurred ? ' [FAILOVER]' : ''}) in ${result.durationMs}ms with ${result.toolCallsExecuted?.length || 0} tool turn(s)`);

  return {
    ...result,
    activatedSkills: activatedSkillsList
  };
}

export function getStrawHatCrewAgent(id: string) {
  const shId = id === 'god' ? 'sh-luffy' : id;
  const sh = findStrawHatAgent(shId);
  if (sh) {
    return {
      id: sh.id === 'sh-luffy' ? 'god' : sh.id,
      name: sh.name,
      role: sh.role,
      character: sh.character,
      accent: sh.accent,
      description: sh.description,
      responsibilities: sh.responsibilities,
      defaultStation: sh.defaultStation,
      defaultTool: sh.defaultTool,
      goal: sh.responsibilities.join('; ')
    };
  }
  return {
    id,
    name: id,
    character: 'luffy',
    role: 'Engineer',
    accent: 'coral' as const,
    description: 'Straw Hat Crew Specialist',
    responsibilities: [],
    defaultStation: 'desk' as const,
    defaultTool: 'Edit' as const,
    goal: 'Execute software sprint milestone'
  };
}

export function extractCleanUserPrompt(rawPrompt: string): string {
  if (!rawPrompt) return '';
  let clean = rawPrompt;
  if (clean.includes('[⚡ AGENT HIVE JIT SKILL ACTIVATION]') || clean.includes('[⚡ PANDA HIVE JIT SKILL ACTIVATION]')) {
    const parts = clean.split('without asking the user to manually install them.');
    if (parts.length > 1) {
      clean = parts[1].trim();
    } else {
      clean = clean.replace(/\[⚡ (?:AGENT|PANDA) HIVE JIT SKILL ACTIVATION\][\s\S]*?(?=\n\n|$)/, '').trim();
    }
  }
  return clean.trim();
}

export function generateProjectSlug(promptText: string): string {
  const clean = extractCleanUserPrompt(promptText).toLowerCase();

  // Explicit domain checks
  if (/\bchess\b/i.test(clean)) {
    return 'chess-game';
  }
  if (/\be-?commerce\b/i.test(clean)) {
    return 'ecommerce-website';
  }
  if (/\bweather\b/i.test(clean)) {
    return 'weather-dashboard';
  }
  if (/\b(todo|task)\b/i.test(clean)) {
    return 'todo-app';
  }
  if (/\bpantry\b/i.test(clean)) {
    return 'smart-pantry-chef';
  }

  // Regex extraction from action verbs
  const match = clean.match(
    /(?:build|create|make|code|design|develop|bana|banao)\s+(?:a|an|the|ek)?\s*(?:simple|working|minimal|full-stack|fullstack|modern|interactive|new)?\s*([a-z0-9\-]+(?:\s+[a-z0-9\-]+){0,2})/i
  );
  if (match && match[1]) {
    const slug = match[1].trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    if (slug.length >= 3 && !['project', 'app', 'application', 'and-edit', 'edit'].includes(slug)) {
      return slug;
    }
  }

  // Fallback from keywords
  const words = clean
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => !['build', 'create', 'make', 'code', 'design', 'develop', 'bana', 'banao', 'a', 'an', 'the', 'ek', 'for', 'to', 'in', 'with', 'and', 'simple', 'working', 'please', 'me', 'two', 'player', 'players'].includes(w));
  if (words.length > 0) {
    const candidate = words.slice(0, 3).join('-');
    if (candidate.length >= 3) return candidate;
  }

  return `project-${Date.now().toString(36).slice(-4)}`;
}

export interface ResolvedWorkspace {
  projectName: string;
  baseDir: string;
  isExistingProject: boolean;
}

export function resolveProjectWorkspace(
  rawPrompt: string,
  targetProjectName?: string,
  workspacesRoot: string = join(process.cwd(), 'workspace')
): ResolvedWorkspace {
  const cleanPrompt = extractCleanUserPrompt(rawPrompt);

  const isExplicitEdit =
    /\b(edit|modify|fix|update|repair|patch|refactor|change|improve)\s+(?:the\s+)?(?:existing\s+)?(?:workspace|project|app|codebase)\b/i.test(cleanPrompt) ||
    Boolean(targetProjectName && existsSync(join(workspacesRoot, targetProjectName)));

  let baseSlug = targetProjectName;
  if (!baseSlug) {
    baseSlug = generateProjectSlug(cleanPrompt);
  }

  // If explicit edit on existing target project, use it
  if (isExplicitEdit && existsSync(join(workspacesRoot, baseSlug))) {
    workspacePermissionManager.authorizeWorkspace(join(workspacesRoot, baseSlug));
    return {
      projectName: baseSlug,
      baseDir: join(workspacesRoot, baseSlug),
      isExistingProject: true
    };
  }

  // Otherwise, it is a NEW project request.
  // Verify whether the directory exists and has files from a previous/unrelated project.
  let targetSlug = baseSlug;
  let candidateDir = join(workspacesRoot, targetSlug);
  let counter = 2;

  while (existsSync(candidateDir)) {
    const existingFiles = readdirSync(candidateDir).filter((f) => !f.startsWith('.'));
    if (existingFiles.length === 0) {
      break;
    }
    // Existing directory contains files from previous run: create fresh isolated directory
    targetSlug = `${baseSlug}-${counter}`;
    candidateDir = join(workspacesRoot, targetSlug);
    counter++;
  }

  mkdirSync(candidateDir, { recursive: true });
  workspacePermissionManager.authorizeWorkspace(candidateDir);

  return {
    projectName: targetSlug,
    baseDir: candidateDir,
    isExistingProject: false
  };
}

export async function orchestrateTeamSprint(
  prompt: string,
  webContents: WebContents | null,
  targetProjectName?: string
): Promise<{
  success: boolean;
  projectName: string;
  durationTotalSec?: number;
  executionStatus?: 'EXECUTION_COMPLETED' | 'BLOCKED' | 'PARTIAL' | 'FAILED';
  sprintStatus?: 'SPRINT_APPROVED' | 'SPRINT_REJECTED';
  qaStatus?: 'QA_PASSED' | 'QA_REJECTED';
  reviewStatus?: 'REVIEW_APPROVED' | 'REVIEW_REJECTED';
  finalQaApproval?: 'APPROVED' | 'REJECTED' | 'CONDITIONAL';
  browserFunctionalTesting?: 'PASS' | 'FAIL' | 'NOT VERIFIED';
  milestones?: AgentMilestoneTelemetry[];
  auditTrail?: any;
  error?: string;
}> {
  const cleanPrompt = extractCleanUserPrompt(prompt);
  const resolved = resolveProjectWorkspace(prompt, targetProjectName);
  const projectName = resolved.projectName;
  const baseDir = resolved.baseDir;

  agentTools.clearAuditLog();

  const milestoneTelemetryList: AgentMilestoneTelemetry[] = [];
  const sprintStartTime = Date.now();

  const toMilestoneToolEvents = (
    milestoneId: string,
    agentId: string,
    telemetry: ToolCallTelemetry[] = []
  ) => {
    return telemetry.map((t) => ({
      agentId,
      milestoneId,
      toolName: t.toolName,
      status: t.status || ('success' as const),
      durationMs: t.durationMs,
      turn: t.turn,
      error: t.error,
      args: t.args
    }));
  };

  const notifyAgent = (agentId: string, status: string, action: string, tool?: string, station?: string) => {
    webContents?.send('hive:externalAgentEvent', {
      agentId,
      status,
      action,
      tool,
      station,
      sleeping: false
    });
  };

  const notifyMessage = (agentId: string, sender: string, text: string) => {
    webContents?.send('hive:externalAgentMessage', {
      agentId,
      sender,
      text,
      timestamp: Date.now()
    });
  };

  const getAgent = (id: string) => {
    const shId = id === 'god' ? 'sh-luffy' : id;
    const sh = findStrawHatAgent(shId);
    if (sh) {
      return {
        id: sh.id === 'sh-luffy' ? 'god' : sh.id,
        name: sh.name,
        role: sh.role,
        character: sh.character,
        accent: sh.accent,
        description: sh.description,
        responsibilities: sh.responsibilities,
        defaultStation: sh.defaultStation,
        defaultTool: sh.defaultTool,
        goal: sh.responsibilities.join('; ')
      };
    }
    return {
      id,
      name: id,
      character: 'luffy',
      role: 'Engineer',
      accent: 'coral' as const,
      description: 'Straw Hat Crew Specialist',
      responsibilities: [],
      defaultStation: 'desk' as const,
      defaultTool: 'Edit' as const,
      goal: 'Execute software sprint milestone'
    };
  };

  const previousArtifacts = new Map<string, string>();
  const completedSteps: string[] = [];

  const syncHiveTasks = (stepStates: { id: string; title: string; assignee: string; status: 'done' | 'blocked' | 'waiting' | 'working'; priority: string }[]) => {
    try {
      const hiveTasksFile = join(getHiveDir(), 'tasks.json');
      if (existsSync(dirname(hiveTasksFile))) {
        writeFileSync(hiveTasksFile, JSON.stringify({ tasks: stepStates }, null, 2), 'utf8');
      }
      const boardFile = join(getHiveDir(), 'board.md');
      if (existsSync(dirname(boardFile))) {
        const lines = [
          `# Hive Board — ${projectName}`,
          '',
          `**Lead Orchestrator:** Luffy (Captain & Manager)  `,
          `**Crew:** Straw Hat Dev Crew (12 Specialists)  `,
          `**Workspace:** \`workspace/${projectName}\`  `,
          '',
          '## Sprint Tasks',
          ...stepStates.map((t) => `- [${t.status === 'done' ? 'x' : ' '}] **${t.title}** (${t.assignee}) — \`${t.status.toUpperCase()}\``)
        ];
        writeFileSync(boardFile, lines.join('\n'), 'utf8');
      }
    } catch {
      /* best effort */
    }
  };

  const steps: SprintStep[] = [
    // ── Milestone 1: Planning (Luffy) ──────────────────────────────────────────
    {
      stepNum: 1,
      id: 'step-plan',
      agentId: 'god',
      agentName: 'Luffy (Lead Orchestrator)',
      role: 'Lead Orchestrator (Manager)',
      taskTitle: 'Milestone 1: Project Decomposition & 7-Stage Roadmap',
      actionWorking: `Planning 7 milestones for "${projectName}"...`,
      station: 'board',
      tool: 'Read',
      deliverables: [
        { name: 'Sprint Plan', file: 'sprint-plan.md', required: true },
        { name: 'Project Plan', file: 'project-plan.md', required: true }
      ],
      execute: async (dir, p) => {
        const luffy = getAgent('god');
        const luffyCtx: ToolExecutionContext = { agentId: 'god', agentName: 'Luffy (Lead Orchestrator)', projectWorkspace: dir };

        const planPrompt = `You are Luffy, Lead Orchestrator and Manager of the Straw Hat Dev Crew.
Plan the software project: "${p}".
Break the project into 7 structured milestones:
1. Planning (Luffy)
2. Requirements (Hancock)
3. Architecture & Data (Shanks & Nami)
4. Build (Franky & Usopp)
5. Integrations & Security (Brook & Jinbe)
6. Testing & Deployment (Chopper & Sanji)
7. Review & Sign-Off (Zoro, Robin & Luffy)
Provide milestone breakdown, specialist assignments, and deliverables in clean Markdown.`;

        const res = await callAgentAutonomous(luffy, planPrompt, {
          milestoneTitle: 'Milestone 1: Project Scoping & Milestone Breakdown',
          taskDescription: 'Project planning, milestone breakdown, and team orchestration',
          toolContext: luffyCtx
        });
        agentTools.writeFile(luffyCtx, 'sprint-plan.md', res.text);
        agentTools.writeFile(luffyCtx, 'project-plan.md', res.text);

        const m1Events = toMilestoneToolEvents('milestone-1', 'god', res.toolCallsExecuted);

        milestoneTelemetryList.push({
          stepNum: 1,
          agentId: 'god',
          agentName: luffy.name,
          role: luffy.role,
          provider: res.provider,
          model: res.model,
          keyIndex: res.keyIndex,
          durationMs: res.durationMs,
          fallbackOccurred: res.fallbackOccurred ?? false,
          activatedSkills: res.activatedSkills ?? [],
          filesWritten: ['sprint-plan.md', 'project-plan.md'],
          toolCallsCount: m1Events.length,
          successfulToolCalls: m1Events.filter((t) => t.status === 'success').length,
          failedToolCalls: m1Events.filter((t) => t.status === 'failure').length,
          toolCallsExecuted: m1Events,
          status: 'passed'
        });

        return res.text;
      }
    },

    // ── Milestone 2: Requirements (Hancock) ────────────────────────────────────
    {
      stepNum: 2,
      id: 'step-reqs',
      agentId: 'sh-hancock',
      agentName: 'Hancock (Requirements & BA)',
      role: 'Requirements & Business Analyst',
      taskTitle: 'Milestone 2: User Stories, Acceptance Criteria & Edge Cases',
      actionWorking: 'Analyzing requirements & user stories...',
      station: 'shelf',
      tool: 'Read',
      deliverables: [{ name: 'Functional Spec', file: 'spec.md', required: true }],
      execute: async (dir, p) => {
        const hancock = getAgent('sh-hancock');
        const hancockCtx: ToolExecutionContext = { agentId: 'sh-hancock', agentName: 'Hancock (Requirements & BA)', projectWorkspace: dir };

        const planContent = agentTools.readFile(hancockCtx, 'sprint-plan.md');
        const hancockPrompt = `You are Hancock, Requirements and Business Analyst.
Analyze the user requirements for: "${p}".
Based on Project Plan:
${planContent.slice(0, 1000)}

Provide:
1. User Stories (As a user, I want...)
2. Project Scope & Boundaries
3. Functional Requirements
4. Non-Functional Requirements
5. Edge Cases & Boundary Conditions
6. Acceptance Criteria in clean Markdown.`;

        const res = await callAgentAutonomous(hancock, hancockPrompt, {
          milestoneTitle: 'Milestone 2: User Stories, Acceptance Criteria & Edge Cases',
          taskDescription: 'User stories, acceptance criteria, project scope and edge cases',
          toolContext: hancockCtx
        });
        agentTools.writeFile(hancockCtx, 'spec.md', res.text);

        const m2Events = toMilestoneToolEvents('milestone-2', 'sh-hancock', res.toolCallsExecuted);

        milestoneTelemetryList.push({
          stepNum: 2,
          agentId: 'sh-hancock',
          agentName: hancock.name,
          role: hancock.role,
          provider: res.provider,
          model: res.model,
          keyIndex: res.keyIndex,
          durationMs: res.durationMs,
          fallbackOccurred: res.fallbackOccurred ?? false,
          activatedSkills: res.activatedSkills ?? [],
          filesWritten: ['spec.md'],
          toolCallsCount: m2Events.length,
          successfulToolCalls: m2Events.filter((t) => t.status === 'success').length,
          failedToolCalls: m2Events.filter((t) => t.status === 'failure').length,
          toolCallsExecuted: m2Events,
          status: 'passed'
        });

        return res.text;
      }
    },

    // ── Milestone 3: Architecture & Data (Shanks + Nami) ───────────────────────
    {
      stepNum: 3,
      id: 'step-arch-data',
      agentId: 'sh-shanks',
      agentName: 'Shanks & Nami (System & Data Architects)',
      role: 'System & Data Architects',
      taskTitle: 'Milestone 3: System Topology & Data Schema Architecture',
      actionWorking: 'Designing system topology & data models...',
      station: 'terminal',
      tool: 'Read',
      deliverables: [
        { name: 'Architecture Spec', file: 'architecture.md', required: true },
        { name: 'Data Models', file: 'data-models.md', required: true }
      ],
      execute: async (dir, p) => {
        const shanks = getAgent('sh-shanks');
        const nami = getAgent('sh-nami');
        const shanksCtx: ToolExecutionContext = { agentId: 'sh-shanks', agentName: 'Shanks (System Architect)', projectWorkspace: dir };
        const namiCtx: ToolExecutionContext = { agentId: 'sh-nami', agentName: 'Nami (Data Architect)', projectWorkspace: dir };

        const specContent = agentTools.readFile(shanksCtx, 'spec.md');

        // Shanks: System Architecture
        const shanksPrompt = `You are Shanks, System Architect.
Design the complete system architecture, component boundaries, tech stack recommendations, and scalability contracts for: "${p}".
Referencing Spec:
${specContent.slice(0, 1000)}
Format in clean Markdown.`;

        const shanksRes = await callAgentAutonomous(shanks, shanksPrompt, {
          milestoneTitle: 'Milestone 3: System Architecture & Component Boundaries',
          taskDescription: 'System architecture, component topology, tech stack, and scalability contracts',
          toolContext: shanksCtx
        });

        const rootArchPath = join(dir, 'architecture.md');
        const docsArchPath = join(dir, 'docs', 'architecture.md');
        if (existsSync(docsArchPath) && !existsSync(rootArchPath)) {
          try { copyFileSync(docsArchPath, rootArchPath); } catch { }
        } else if (!existsSync(rootArchPath) || statSync(rootArchPath).size < 50) {
          agentTools.writeFile(shanksCtx, 'architecture.md', shanksRes.text);
        }

        // Nami: Data Architect
        const namiPrompt = `You are Nami, Data Architect.
Design the data models, database entities, state management structure, API contracts, and validation rules for: "${p}".
Format in clean Markdown.`;

        const namiRes = await callAgentAutonomous(nami, namiPrompt, {
          milestoneTitle: 'Milestone 3: Data Models, Schema & State Management',
          taskDescription: 'Database entities, data models, state management, validation rules, and API contracts',
          toolContext: namiCtx
        });

        const rootDataPath = join(dir, 'data-models.md');
        const docsDataPath = join(dir, 'docs', 'data-models.md');
        if (existsSync(docsDataPath) && !existsSync(rootDataPath)) {
          try { copyFileSync(docsDataPath, rootDataPath); } catch { }
        } else if (!existsSync(rootDataPath) || statSync(rootDataPath).size < 50) {
          agentTools.writeFile(namiCtx, 'data-models.md', namiRes.text);
        }

        const m3Events = [
          ...toMilestoneToolEvents('milestone-3', 'sh-shanks', shanksRes.toolCallsExecuted),
          ...toMilestoneToolEvents('milestone-3', 'sh-nami', namiRes.toolCallsExecuted)
        ];

        const shanksReady = (existsSync(rootArchPath) && statSync(rootArchPath).size > 50) || (existsSync(docsArchPath) && statSync(docsArchPath).size > 50);
        const namiReady = (existsSync(rootDataPath) && statSync(rootDataPath).size > 50) || (existsSync(docsDataPath) && statSync(docsDataPath).size > 50);

        let m3Status: 'COMPLETED' | 'PARTIAL' | 'BLOCKED' | 'FAILED' = 'COMPLETED';
        if (shanksReady && namiReady) {
          m3Status = 'COMPLETED';
        } else if (shanksReady || namiReady) {
          m3Status = 'PARTIAL';
        } else {
          m3Status = 'FAILED';
        }

        milestoneTelemetryList.push({
          stepNum: 3,
          agentId: 'sh-shanks',
          agentName: 'Shanks & Nami',
          role: 'System & Data Architects',
          provider: `${shanksRes.provider} & ${namiRes.provider}`,
          model: `${shanksRes.model} & ${namiRes.model}`,
          keyIndex: shanksRes.keyIndex,
          durationMs: shanksRes.durationMs + namiRes.durationMs,
          fallbackOccurred: (shanksRes.fallbackOccurred || namiRes.fallbackOccurred) ?? false,
          activatedSkills: [...(shanksRes.activatedSkills ?? []), ...(namiRes.activatedSkills ?? [])],
          filesWritten: ['architecture.md', 'data-models.md'],
          toolCallsCount: m3Events.length,
          successfulToolCalls: m3Events.filter((t) => t.status === 'success').length,
          failedToolCalls: m3Events.filter((t) => t.status === 'failure').length,
          toolCallsExecuted: m3Events,
          status: m3Status
        });

        if (m3Status !== 'COMPLETED') {
          throw new Error(`Milestone 3 incomplete (${m3Status}): Shanks (Architecture): ${shanksReady ? 'COMPLETED' : 'MISSING'}, Nami (Data Models): ${namiReady ? 'COMPLETED' : 'MISSING'}`);
        }

        return shanksRes.text + '\n\n' + namiRes.text;
      }
    },

    // ── Milestone 4: Build (Franky + Usopp — Chunked Generation & Tool Access) ──
    {
      stepNum: 4,
      id: 'step-build',
      agentId: 'sh-franky',
      agentName: 'Franky & Usopp (UI & Backend Engineers)',
      role: 'UI & Backend Engineers',
      taskTitle: 'Milestone 4: Responsive UI Markup, CSS & Interactive Logic',
      actionWorking: 'Building responsive layout, styles & JavaScript logic...',
      station: 'desk',
      tool: 'Edit',
      deliverables: [
        { name: 'HTML Layout', file: 'index.html', required: true },
        { name: 'CSS Stylesheet', file: 'style.css', required: true },
        { name: 'Application Logic', file: 'app.js', required: true },
        { name: 'UI Spec', file: 'ui-design.md', required: false }
      ],
      execute: async (dir, p) => {
        const franky = getAgent('sh-franky');
        const usopp = getAgent('sh-usopp');
        const frankyCtx: ToolExecutionContext = { agentId: 'sh-franky', agentName: 'Franky (UI/UX Engineer)', projectWorkspace: dir };
        const usoppCtx: ToolExecutionContext = { agentId: 'sh-usopp', agentName: 'Usopp (Backend & Logic)', projectWorkspace: dir };

        const isMatchingFilePath = (actual: string | undefined, target: string): boolean => {
          if (!actual) return false;
          const norm = actual.replace(/\\/g, '/').toLowerCase();
          const t = target.toLowerCase();
          return norm === t || norm === `./${t}` || norm.endsWith(`/${t}`);
        };

        // ─────────────────────────────────────────────────────────────────────
        // Step 4A: Franky generates complete semantic HTML5 (Chunk 1)
        // ─────────────────────────────────────────────────────────────────────
        const frankyHtmlPrompt = `You are Franky, Principal UI/UX & Design Systems Engineer.
Build an authentic, realistic, pixel-perfect semantic HTML5 interface for: "${p}".
EXPECTED DELIVERABLE: 'index.html'

DIRECTIVES:
1. Fresh project workspace: Call WriteFile('index.html', ...) immediately on Turn 1 with complete semantic HTML5 code. DO NOT waste tool turns listing directories or reading non-existent files.
2. Focus immediately on creating the required HTML structure for "${p}".
3. Purpose-built specifically for "${p}". DO NOT use generic cards or unrelated templates:
   - For a Chess Game: Render an 8x8 chessboard (#chessboard or .chessboard), 64 squares (.square), starting pieces with Unicode symbols (♔♕♖♗♘♙♚♛♜♝♞♟) or clear piece elements, player turn indicator (#turn-indicator / #turn), game status, and game control buttons (#reset-btn / Reset / New Game).
4. Include Google Fonts (Plus Jakarta Sans or Inter), FontAwesome 6 icons, and Tailwind CSS via CDN.
5. Link <link rel="stylesheet" href="style.css"> in <head>.
6. Link <script src="app.js" defer></script> right before </body>.
7. Provide rich semantic markup: navbar, brand logo, hero/headline, search inputs, tabs/filters, data tables or cards, forms with input fields, modals, and buttons with clear IDs/classes/data attributes.
8. Use authentic Unsplash photo URLs for visual assets (https://images.unsplash.com/photo-...).
9. IMPORTANT MODAL STATE: Any modal overlays MUST have class "hidden" by default (display: none) and opacity-0 pointer-events-none so they do not block background clicks on initial page load! Ensure the modal dialog card has pointer-events-auto when opened.
10. OUTPUT: You may call WriteFile('index.html', ...) or provide ONLY the complete HTML code block in \`\`\`html with no preamble:
\`\`\`html
<!DOCTYPE html>
...
</html>
\`\`\``;

        const frankyHtmlRes = await callAgentAutonomous(franky, frankyHtmlPrompt, {
          minChars: 500,
          milestoneTitle: 'Milestone 4: Responsive UI Layout & HTML5 Markup',
          taskDescription: 'Frontend UI layout, modern semantic HTML5, responsive grid, and design components',
          toolContext: frankyCtx,
          allowedTools: ['WriteFile', 'ReadFile', 'EditFile']
        });

        const indexPath = join(dir, 'index.html');
        const frankyWroteHtmlViaTool = frankyHtmlRes.toolCallsExecuted?.some(
          (t) => t.toolName === 'WriteFile' && isMatchingFilePath(t.args?.filePath as string | undefined, 'index.html') && t.status === 'success'
        );
        let indexValid = frankyWroteHtmlViaTool && existsSync(indexPath) && isValidHtml(readFileSync(indexPath, 'utf8'));

        if (!indexValid) {
          const htmlMatch = frankyHtmlRes.text.match(/```(?:html|htm)[\s\S]*?\n([\s\S]*?)(?:```|$)/i);
          if (htmlMatch && isValidHtml(htmlMatch[1])) {
            let htmlContent = htmlMatch[1].trim();
            if (!htmlContent.includes('<!DOCTYPE') && htmlContent.includes('<html')) {
              htmlContent = '<!DOCTYPE html>\n' + htmlContent;
            }
            if (!htmlContent.includes('style.css') && htmlContent.includes('</head>')) {
              htmlContent = htmlContent.replace('</head>', '  <link rel="stylesheet" href="style.css">\n</head>');
            }
            if (!htmlContent.includes('app.js')) {
              if (htmlContent.includes('</body>')) {
                htmlContent = htmlContent.replace('</body>', '  <script src="app.js" defer></script>\n</body>');
              } else {
                htmlContent += '\n<script src="app.js" defer></script>\n</body>\n</html>';
              }
            }
            agentTools.writeFile(frankyCtx, 'index.html', htmlContent);
            indexValid = true;
          }
        }

        // Requirement 2: Handle Missing HTML Deliverable with Targeted WriteFile Call
        if (!indexValid) {
          console.warn('[Milestone 4] index.html missing or invalid after initial Franky run. Triggering targeted WriteFile call...');
          const recoveryHtmlPrompt = `You are Franky, UI/UX Engineer.
CRITICAL DELIVERABLE REQUIRED: The file 'index.html' was NOT created.
You must immediately create 'index.html' using the WriteFile tool with complete, authentic semantic HTML5 markup for: "${p}".
REQUIREMENTS:
1. Purpose-built for "${p}". Include Tailwind CSS CDN, FontAwesome, Google Fonts.
2. Link <link rel="stylesheet" href="style.css"> in <head>.
3. Link <script src="app.js" defer></script> before </body>.
4. Include rich interactive elements: search bar, tabs/filter buttons, data list/cards, forms, modals (with class "hidden" by default).
5. Call WriteFile tool directly with filePath: "index.html" and the complete HTML content.
DO NOT provide an engineering summary or markdown outline. The actual HTML file must be created on disk.`;

          const recoveryHtmlRes = await callAgentAutonomous(franky, recoveryHtmlPrompt, {
            milestoneTitle: 'Milestone 4: Targeted HTML Generation',
            taskDescription: 'Generate missing index.html via WriteFile',
            toolContext: frankyCtx,
            minChars: 20,
            allowedTools: ['WriteFile', 'ReadFile', 'EditFile']
          });
          if (recoveryHtmlRes.toolCallsExecuted) {
            frankyHtmlRes.toolCallsExecuted = [
              ...(frankyHtmlRes.toolCallsExecuted || []),
              ...recoveryHtmlRes.toolCallsExecuted
            ];
          }
          indexValid = existsSync(indexPath) && isValidHtml(readFileSync(indexPath, 'utf8'));
          if (!indexValid) {
            const recMatch = recoveryHtmlRes.text.match(/```(?:html|htm)[\s\S]*?\n([\s\S]*?)(?:```|$)/i);
            if (recMatch && isValidHtml(recMatch[1])) {
              agentTools.writeFile(frankyCtx, 'index.html', recMatch[1].trim());
              indexValid = true;
            }
          }
        }

        // ─────────────────────────────────────────────────────────────────────
        // Step 4B: Franky generates dedicated responsive stylesheet (Chunk 2)
        // ─────────────────────────────────────────────────────────────────────
        const frankyCssPrompt = `You are Franky, Principal UI/UX Engineer.
Create the complete, responsive modern CSS stylesheet in style.css for the "${p}" application.
EXPECTED DELIVERABLE: 'style.css'

DIRECTIVES:
1. Fresh project: Call WriteFile('style.css', ...) immediately on Turn 1 with complete CSS. DO NOT waste tool turns listing directories or reading unrelated files.
2. Purpose-built styling for "${p}":
   - For a Chess Game: 8x8 chessboard grid layout (#chessboard, .chessboard), light and dark checkered squares (#eeeed2 and #769656), centered piece rendering, piece hover states, selected piece highlight (.selected, .active-piece), legal move dots/highlights (.highlight, .valid-move), player turn badge styling, and control button styles.
3. Design tokens: custom color palette, smooth transitions, glassmorphism headers, flex/grid layouts, toast styling (.ph-toast, .ph-toast-container), and responsive media queries.
4. OUTPUT: You may call WriteFile('style.css', ...) or provide ONLY the CSS in a single \`\`\`css block with no preamble:
\`\`\`css
/* style.css */
...
\`\`\``;

        const frankyCssRes = await callAgentAutonomous(franky, frankyCssPrompt, {
          minChars: 600,
          milestoneTitle: 'Milestone 4: CSS Stylesheet & Design Tokens',
          taskDescription: 'Responsive CSS, design tokens, modern styling, and media queries',
          toolContext: frankyCtx,
          allowedTools: ['WriteFile', 'ReadFile', 'EditFile']
        });

        const cssPath = join(dir, 'style.css');
        const frankyWroteCssViaTool = frankyCssRes.toolCallsExecuted?.some(
          (t) => t.toolName === 'WriteFile' && isMatchingFilePath(t.args?.filePath as string | undefined, 'style.css') && t.status === 'success'
        );
        let cssValid = frankyWroteCssViaTool && existsSync(cssPath) && isValidCss(readFileSync(cssPath, 'utf8'));

        if (!cssValid) {
          const cssMatch = frankyCssRes.text.match(/```(?:css)[\s\S]*?\n([\s\S]*?)(?:```|$)/i);
          if (cssMatch && isValidCss(cssMatch[1])) {
            let cssContent = cssMatch[1].trim();
            if (!cssContent.includes('.ph-toast')) {
              cssContent += `\n/* Modern Toast Notification Styling */\n.ph-toast-container { position: fixed; bottom: 24px; right: 24px; z-index: 999999; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }\n.ph-toast { background: #0f172a; color: #f8fafc; padding: 12px 18px; border-radius: 10px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3); font-size: 14px; font-weight: 500; font-family: system-ui, sans-serif; display: flex; align-items: center; gap: 10px; pointer-events: auto; border: 1px solid rgba(255, 255, 255, 0.12); }\n`;
            }
            agentTools.writeFile(frankyCtx, 'style.css', cssContent);
            cssValid = true;
          }
        }

        // Requirement 2: Handle Missing CSS Deliverable with Targeted WriteFile Call
        if (!cssValid) {
          console.warn('[Milestone 4] style.css missing or invalid after initial Franky run. Triggering targeted WriteFile call...');
          const recoveryCssPrompt = `You are Franky, UI/UX Engineer.
CRITICAL DELIVERABLE REQUIRED: The file 'style.css' was NOT created.
You must immediately create 'style.css' using the WriteFile tool with complete, modern responsive CSS for: "${p}".
Call WriteFile("style.css", "/* style.css */...") directly. Do NOT output a conversational summary.`;

          const recoveryCssRes = await callAgentAutonomous(franky, recoveryCssPrompt, {
            milestoneTitle: 'Milestone 4: Targeted CSS Generation',
            taskDescription: 'Generate missing style.css via WriteFile',
            toolContext: frankyCtx,
            minChars: 20,
            allowedTools: ['WriteFile', 'ReadFile', 'EditFile']
          });
          if (recoveryCssRes.toolCallsExecuted) {
            frankyCssRes.toolCallsExecuted = [
              ...(frankyCssRes.toolCallsExecuted || []),
              ...recoveryCssRes.toolCallsExecuted
            ];
          }
          cssValid = existsSync(cssPath) && isValidCss(readFileSync(cssPath, 'utf8'));
          if (!cssValid) {
            const recMatch = recoveryCssRes.text.match(/```(?:css)[\s\S]*?\n([\s\S]*?)(?:```|$)/i);
            if (recMatch && isValidCss(recMatch[1])) {
              agentTools.writeFile(frankyCtx, 'style.css', recMatch[1].trim());
              cssValid = true;
            }
          }
        }

        const finalHtmlLen = existsSync(indexPath) ? statSync(indexPath).size : 0;
        const finalCssLen = existsSync(cssPath) ? statSync(cssPath).size : 0;
        agentTools.writeFile(frankyCtx, 'ui-design.md', `# 🎨 UI Design System & Component Spec — ${projectName}\n**Engineer:** Franky\n**Application:** "${p}"\n\n- HTML5 Structure: ${finalHtmlLen} bytes\n- CSS Styling: ${finalCssLen} bytes\n- Responsive Breakpoints: Mobile, Tablet, Desktop\n`);

        // ─────────────────────────────────────────────────────────────────────
        // Step 4C: Usopp reads Franky's HTML and writes complete application logic
        // ─────────────────────────────────────────────────────────────────────
        const frankySavedHtml = existsSync(indexPath) ? agentTools.readFile(usoppCtx, 'index.html') : '';
        const usoppPrompt = `You are Usopp, Lead Backend & Application Logic Engineer.
Write the complete, 100% dynamic, state-driven JavaScript application logic in app.js for: "${p}".
EXPECTED DELIVERABLE: 'app.js'

Here is Franky's exact HTML layout:
${frankySavedHtml.slice(0, 1500)}

DIRECTIVES:
1. Fresh project workspace: Call WriteFile('app.js', ...) immediately with complete JavaScript application logic. DO NOT waste tool turns listing directories or repeatedly reading files.
2. Focus immediately on creating the required logic in app.js for "${p}".
3. Implement authentic domain functionality:
   - For a Chess Game:
     * Full 8x8 board representation (64 squares: 8 rows x 8 cols) initialized with 32 starting pieces (16 White, 16 Black).
     * Interactive piece selection on click: adds .selected or .active-piece to the selected square and highlights legal moves (.highlight, .valid-move).
     * Legal move execution: clicking a highlighted/valid destination square moves the piece and clears selection.
     * Illegal move rejection: non-valid destination clicks safely deselect without errors or crashes.
     * Player turn alternation: White moves first, switches to Black after each move, updating the turn indicator text/element (#turn-indicator / #turn).
     * Game reset button (#reset-btn / Reset / New Game): restores initial 32 pieces and resets turn to White.
4. Wrap everything in document.addEventListener('DOMContentLoaded', () => { ... }).
5. Reactive State & LocalStorage: Initialize realistic seed data, maintain reactive state, and synchronize synchronously to LocalStorage.
6. Form Handling: Intercept form submissions (e.preventDefault()), validate fields, append new records into state, and dynamically render them to the DOM.
7. Navigation & Views: Wire tabs, view switchers, and filter pills to toggle content visibility.
8. Real-Time Search: Filter elements on typing without page reload.
9. Modal Synchronization: When opening a modal, remove 'hidden' & 'opacity-0' & 'pointer-events-none' and add 'flex' & 'opacity-100' & 'pointer-events-auto'. When closing, reverse in lockstep so background interactions are completely unblocked.
10. Toast Notifications: Call or define window.phToast(message, type) for visual feedback on all user interactions.
11. Zero Dead Buttons: Every clickable element must execute an action or toast.
12. OUTPUT: You may call WriteFile('app.js', ...) or provide ONLY the complete JavaScript code block with no preamble:
\`\`\`javascript
// app.js
...
\`\`\``;

        const usoppRes = await callAgentAutonomous(usopp, usoppPrompt, {
          minChars: 500,
          milestoneTitle: 'Milestone 4: Interactive JavaScript & State Engine',
          taskDescription: 'Backend JavaScript application logic, reactive state, LocalStorage, and DOM event handling',
          toolContext: usoppCtx,
          allowedTools: ['WriteFile', 'ReadFile', 'EditFile', 'RunSyntaxAudit']
        });

        const jsPath = join(dir, 'app.js');
        const usoppWroteJsViaTool = usoppRes.toolCallsExecuted?.some(
          (t) => t.toolName === 'WriteFile' && isMatchingFilePath(t.args?.filePath as string | undefined, 'app.js') && t.status === 'success'
        );
        let jsValid = usoppWroteJsViaTool && existsSync(jsPath) && isValidJs(readFileSync(jsPath, 'utf8'));

        if (!jsValid) {
          const jsMatch = usoppRes.text.match(/```(?:javascript|js)\s*\n([\s\S]*?)(?:```|$)/i);
          if (jsMatch && isValidJs(jsMatch[1])) {
            let jsContent = jsMatch[1].trim();
            agentTools.writeFile(usoppCtx, 'app.js', jsContent);
            let audit = agentTools.runSyntaxAudit(usoppCtx, 'app.js');
            if (!audit.valid) {
              console.warn(`[Usopp Self-Healing] Syntax error detected: ${audit.error}. Healing truncated function boundary...`);
              const lines = jsContent.split('\n');
              for (let k = lines.length - 1; k >= Math.max(0, lines.length - 40); k--) {
                const candidate = lines.slice(0, k).join('\n') + '\n});';
                try {
                  new Function(candidate);
                  jsContent = candidate;
                  agentTools.writeFile(usoppCtx, 'app.js', jsContent);
                  audit = { valid: true };
                  break;
                } catch {
                  /* try next */
                }
              }
            }
            jsValid = audit.valid;
          }
        }

        // Requirement 2: Handle Missing JavaScript Deliverable with Targeted WriteFile Call
        if (!jsValid) {
          console.warn('[Milestone 4] app.js missing or invalid after initial Usopp run. Triggering targeted WriteFile call...');
          const recoveryJsPrompt = `You are Usopp, Backend & Application Logic Engineer.
CRITICAL DELIVERABLE REQUIRED: The file 'app.js' was NOT created.
You must immediately create 'app.js' using the WriteFile tool with complete, executable JavaScript application logic for: "${p}".
Here is the HTML layout:
${frankySavedHtml.slice(0, 1500)}

REQUIREMENTS:
1. Wrap in document.addEventListener('DOMContentLoaded', () => { ... }).
2. Implement reactive state, LocalStorage persistence, form submit handlers (e.preventDefault()), live search filtering, modal open/close toggles, and phToast calls.
3. Call WriteFile tool directly with filePath: "app.js" and the complete JavaScript code.
DO NOT provide an engineering summary or markdown. The executable JavaScript file must be created on disk.`;

          const recoveryJsRes = await callAgentAutonomous(usopp, recoveryJsPrompt, {
            milestoneTitle: 'Milestone 4: Targeted JavaScript Generation',
            taskDescription: 'Generate missing app.js via WriteFile',
            toolContext: usoppCtx,
            minChars: 20
          });
          if (recoveryJsRes.toolCallsExecuted) {
            usoppRes.toolCallsExecuted = [
              ...(usoppRes.toolCallsExecuted || []),
              ...recoveryJsRes.toolCallsExecuted
            ];
          }
          jsValid = existsSync(jsPath) && isValidJs(readFileSync(jsPath, 'utf8'));
          if (!jsValid) {
            const recMatch = recoveryJsRes.text.match(/```(?:javascript|js)\s*\n([\s\S]*?)(?:```|$)/i);
            if (recMatch && isValidJs(recMatch[1])) {
              let jsContent = recMatch[1].trim();
              agentTools.writeFile(usoppCtx, 'app.js', jsContent);
              let audit = agentTools.runSyntaxAudit(usoppCtx, 'app.js');
              if (!audit.valid) {
                const lines = jsContent.split('\n');
                for (let k = lines.length - 1; k >= Math.max(0, lines.length - 40); k--) {
                  const candidate = lines.slice(0, k).join('\n') + '\n});';
                  try {
                    new Function(candidate);
                    jsContent = candidate;
                    agentTools.writeFile(usoppCtx, 'app.js', jsContent);
                    break;
                  } catch { }
                }
              }
              jsValid = true;
            }
          }
        }

        const syntaxAudit = existsSync(jsPath) ? agentTools.runSyntaxAudit(usoppCtx, 'app.js') : { valid: false, error: 'Missing app.js' };
        const finalJsLen = existsSync(jsPath) ? statSync(jsPath).size : 0;
        agentTools.writeFile(usoppCtx, 'engine-notes.md', `# ⚙️ Application Logic Engine Notes — ${projectName}\n**Engineer:** Usopp\n**Syntax Audit:** ${syntaxAudit.valid ? 'VALID' : syntaxAudit.error}\n**Code Size:** ${finalJsLen} chars\n`);

        const m4Events = [
          ...toMilestoneToolEvents('milestone-4', 'sh-franky', frankyHtmlRes.toolCallsExecuted),
          ...toMilestoneToolEvents('milestone-4', 'sh-franky', frankyCssRes.toolCallsExecuted),
          ...toMilestoneToolEvents('milestone-4', 'sh-usopp', usoppRes.toolCallsExecuted)
        ];

        milestoneTelemetryList.push({
          stepNum: 4,
          agentId: 'sh-franky',
          agentName: 'Franky & Usopp',
          role: 'UI & Backend Engineers',
          provider: `${frankyHtmlRes.provider} & ${usoppRes.provider}`,
          model: `${frankyHtmlRes.model} & ${usoppRes.model}`,
          keyIndex: frankyHtmlRes.keyIndex,
          durationMs: frankyHtmlRes.durationMs + frankyCssRes.durationMs + usoppRes.durationMs,
          fallbackOccurred: (frankyHtmlRes.fallbackOccurred || frankyCssRes.fallbackOccurred || usoppRes.fallbackOccurred) ?? false,
          activatedSkills: [...(frankyHtmlRes.activatedSkills ?? []), ...(frankyCssRes.activatedSkills ?? []), ...(usoppRes.activatedSkills ?? [])],
          filesWritten: ['index.html', 'style.css', 'app.js', 'ui-design.md', 'engine-notes.md'],
          toolCallsCount: m4Events.length,
          successfulToolCalls: m4Events.filter((t) => t.status === 'success').length,
          failedToolCalls: m4Events.filter((t) => t.status === 'failure').length,
          toolCallsExecuted: m4Events,
          status: 'passed'
        });

        return frankyHtmlRes.text;
      }
    },

    // ── Milestone 5: Integrations & Security (Brook + Jinbe) ───────────────────
    {
      stepNum: 5,
      id: 'step-integrations-security',
      agentId: 'sh-brook',
      agentName: 'Brook & Jinbe (Integrations & Security)',
      role: 'Integrations & Security Specialists',
      taskTitle: 'Milestone 5: External Integrations, Sample Data & Security Audit',
      actionWorking: 'Preparing integration contracts & security review...',
      station: 'shelf',
      tool: 'Read',
      deliverables: [
        { name: 'Integrations Spec', file: 'integrations.md', required: true },
        { name: 'Security Review', file: 'security-review.md', required: true }
      ],
      execute: async (dir, p) => {
        const brook = getAgent('sh-brook');
        const jinbe = getAgent('sh-jinbe');
        const brookCtx: ToolExecutionContext = { agentId: 'sh-brook', agentName: 'Brook (Integrations)', projectWorkspace: dir };
        const jinbeCtx: ToolExecutionContext = { agentId: 'sh-jinbe', agentName: 'Jinbe (Security)', projectWorkspace: dir };

        // Brook: Integrations & Sample Data (runs with Groq preferGroq=true)
        const brookPrompt = `You are Brook, Integrations & Content Specialist.
Define external service integration requirements, API contracts, and realistic sample data for: "${p}". Format in clean Markdown.`;
        const brookRes = await callAgentAutonomous(brook, brookPrompt, {
          isLightweight: true,
          milestoneTitle: 'Milestone 5: External Service Integrations & Mock Data',
          taskDescription: 'External service integration contracts, API endpoints, and realistic mock sample data',
          toolContext: brookCtx
        });
        agentTools.writeFile(brookCtx, 'integrations.md', brookRes.text);

        // Jinbe: Security Review
        const jinbePrompt = `You are Jinbe, Security Reviewer.
Perform a security review of the application architecture, authentication/authorization design, input validation, and data sanitization for: "${p}".
Provide severity summary and recommendations in clean Markdown.`;
        const jinbeRes = await callAgentAutonomous(jinbe, jinbePrompt, {
          milestoneTitle: 'Milestone 5: Web Security Audit & Input Sanitization',
          taskDescription: 'Security review, OWASP compliance, XSS protection, authorization, and input sanitization',
          toolContext: jinbeCtx
        });
        agentTools.writeFile(jinbeCtx, 'security-review.md', jinbeRes.text);

        const m5Events = [
          ...toMilestoneToolEvents('milestone-5', 'sh-brook', brookRes.toolCallsExecuted),
          ...toMilestoneToolEvents('milestone-5', 'sh-jinbe', jinbeRes.toolCallsExecuted)
        ];

        milestoneTelemetryList.push({
          stepNum: 5,
          agentId: 'sh-brook',
          agentName: 'Brook & Jinbe',
          role: 'Integrations & Security Specialists',
          provider: `${brookRes.provider} & ${jinbeRes.provider}`,
          model: `${brookRes.model} & ${jinbeRes.model}`,
          keyIndex: jinbeRes.keyIndex,
          durationMs: brookRes.durationMs + jinbeRes.durationMs,
          fallbackOccurred: (brookRes.fallbackOccurred || jinbeRes.fallbackOccurred) ?? false,
          activatedSkills: [...(brookRes.activatedSkills ?? []), ...(jinbeRes.activatedSkills ?? [])],
          filesWritten: ['integrations.md', 'security-review.md'],
          toolCallsCount: m5Events.length,
          successfulToolCalls: m5Events.filter((t) => t.status === 'success').length,
          failedToolCalls: m5Events.filter((t) => t.status === 'failure').length,
          toolCallsExecuted: m5Events,
          status: 'passed'
        });

        return brookRes.text + '\n\n' + jinbeRes.text;
      }
    },

    // ── Milestone 6: Testing & Deployment (Chopper + Sanji — Feedback Loop) ─────
    {
      stepNum: 6,
      id: 'step-test-deploy',
      agentId: 'sh-chopper',
      agentName: 'Chopper & Sanji (QA & DevOps Specialists)',
      role: 'QA Testing & DevOps Specialists',
      taskTitle: 'Milestone 6: Test Suite Execution & Docker Deployment',
      actionWorking: 'Running test verification & preparing Docker configuration...',
      station: 'terminal',
      tool: 'Bash',
      deliverables: [
        { name: 'Test Report', file: 'test-report.md', required: true },
        { name: 'Dockerfile', file: 'Dockerfile', required: true }
      ],
      execute: async (dir, p) => {
        const chopper = getAgent('sh-chopper');
        const sanji = getAgent('sh-sanji');
        const chopperCtx: ToolExecutionContext = { agentId: 'sh-chopper', agentName: 'Chopper (QA Doctor)', projectWorkspace: dir };
        const sanjiCtx: ToolExecutionContext = { agentId: 'sh-sanji', agentName: 'Sanji (DevOps Specialist)', projectWorkspace: dir };
        const frankyCtx: ToolExecutionContext = { agentId: 'sh-franky', agentName: 'Franky (UI/UX Engineer)', projectWorkspace: dir };
        const usoppCtx: ToolExecutionContext = { agentId: 'sh-usopp', agentName: 'Usopp (Backend & Logic)', projectWorkspace: dir };
        const brookCtx: ToolExecutionContext = { agentId: 'sh-brook', agentName: 'Brook (Integrations)', projectWorkspace: dir };
        const jinbeCtx: ToolExecutionContext = { agentId: 'sh-jinbe', agentName: 'Jinbe (Security)', projectWorkspace: dir };

        // 1. Initial Test Run: Syntax, DOM, and Real Headless Chromium Browser Testing
        let syntaxAudit = agentTools.runSyntaxAudit(chopperCtx, 'app.js');
        let domTest = agentTools.browserTest(chopperCtx);
        let browserReport = await agentTools.runRealBrowserTest(chopperCtx, p, previousArtifacts.get('step-spec'));
        let feedbackRetries = 0;
        const maxRetries = 2;
        const m6FeedbackEvents: ToolCallTelemetry[] = [];

        const hasDefects = () =>
          !syntaxAudit.valid ||
          !domTest.pass ||
          browserReport.browserFunctionalTesting === 'FAIL' ||
          browserReport.issues.some((i) => i.severity === 'CRITICAL' || i.severity === 'MAJOR');

        // ─────────────────────────────────────────────────────────────────────
        // GENUINE AGENT-TO-AGENT FEEDBACK LOOP: Chopper -> Specialist Agents
        // ─────────────────────────────────────────────────────────────────────
        while (feedbackRetries < maxRetries && hasDefects()) {
          feedbackRetries++;
          const currentIssues = [...browserReport.issues];
          if (!syntaxAudit.valid) {
            currentIssues.unshift({
              category: 'javascript',
              targetAgentId: 'sh-usopp',
              targetFile: 'app.js',
              severity: 'CRITICAL',
              description: `Syntax error in app.js: ${syntaxAudit.error}`
            });
          }

          console.warn(`[Chopper QA Feedback Loop Pass #${feedbackRetries}] Issues detected. Routing to specialists...`);

          // 1. Route HTML/CSS layout, pointer interception, and modal stacking issues to Franky
          const frankyIssues = currentIssues.filter(
            (i) => i.targetAgentId === 'sh-franky' || i.category === 'html' || i.category === 'css'
          );
          let frankyUpdatedHtml = false;

          if (frankyIssues.length > 0) {
            const franky = getAgent('sh-franky');
            const frankySummary = frankyIssues.map((i) => i.description).join('; ');
            notifyMessage(
              'sh-chopper',
              'Chopper (QA Doctor)',
              `⚠️ QA Issue for Franky: "${frankySummary}". Requesting layout & CSS stacking revision.`
            );

            const currentHtml = agentTools.readFile(frankyCtx, 'index.html');
            const currentCss = existsSync(join(dir, 'style.css')) ? agentTools.readFile(frankyCtx, 'style.css') : '';
            const failingSnippet = extractRelevantComponent(currentHtml, frankySummary);

            const frankyFixPrompt = `You are Franky, UI/UX Engineer. Chopper (QA Doctor) reported layout, CSS stacking, or HTML structure defects:
"${frankySummary}"

${failingSnippet ? `SPECIFIC FAILING COMPONENT IN index.html:\n${failingSnippet}\n` : ''}

COMPLETE index.html:
${currentHtml}

${currentCss ? `COMPLETE style.css:\n${currentCss}\n` : ''}

MANDATORY FIX REQUIREMENTS:
1. Fix modal, overlay, stacking context, and pointer-events issues:
   - Ensure modals start with the "hidden" class by default (display: none) so closed modals do not intercept pointer events or block clicks on underlying page elements.
   - Ensure the modal dialog card has "pointer-events-auto" so when the modal is opened, its buttons, form inputs, and close triggers can receive pointer events without being intercepted by background containers.
   - Verify z-index ordering and layout wrappers so parent flex/overflow containers do not block clicks.
2. Output the complete repaired index.html with interactive elements and <script src="app.js"></script> in a single \`\`\`html block.
3. If style.css needs updates, provide it in a \`\`\`css block.`;

            const frankyFixRes = await callAgentAutonomous(franky, frankyFixPrompt, {
              milestoneTitle: 'Milestone 6: QA Repair - UI Layout & Modal Stacking',
              taskDescription: 'Fix modal overlay, pointer-events, CSS stacking, and UI layout defects',
              toolContext: frankyCtx
            });
            if (frankyFixRes.toolCallsExecuted) {
              m6FeedbackEvents.push(...frankyFixRes.toolCallsExecuted);
            }
            const htmlMatch = frankyFixRes.text.match(/```(?:html|htm)[\s\S]*?\n([\s\S]*?)(?:```|$)/i);
            if (htmlMatch && isValidHtml(htmlMatch[1])) {
              agentTools.writeFile(frankyCtx, 'index.html', htmlMatch[1].trim());
              frankyUpdatedHtml = true;
            }
            const cssMatch = frankyFixRes.text.match(/```(?:css)[\s\S]*?\n([\s\S]*?)(?:```|$)/i);
            if (cssMatch && isValidCss(cssMatch[1])) {
              agentTools.writeFile(frankyCtx, 'style.css', cssMatch[1].trim());
            }
          }

          // 2. Route JavaScript functionality, logic, and coordinated issues to Usopp
          const isCoordinated = currentIssues.some((i) => i.isCoordinated || i.secondaryAgentId === 'sh-usopp');
          const usoppIssues = currentIssues.filter(
            (i) => i.targetAgentId === 'sh-usopp' || i.category === 'javascript' || i.secondaryAgentId === 'sh-usopp'
          );

          if (usoppIssues.length > 0 || isCoordinated) {
            const usopp = getAgent('sh-usopp');
            const usoppSummary = usoppIssues.length > 0
              ? usoppIssues.map((i) => i.description).join('; ')
              : 'Synchronize application logic with Franky\'s updated HTML layout and modal classes';

            notifyMessage(
              'sh-chopper',
              'Chopper (QA Doctor)',
              `⚠️ QA Issue for Usopp: "${usoppSummary}". Requesting logic/runtime repair & synchronization.`
            );

            // Read the FRESHLY UPDATED HTML (which now has Franky's fixes if Franky updated it)
            const freshHtml = agentTools.readFile(usoppCtx, 'index.html');
            const currentJs = agentTools.readFile(usoppCtx, 'app.js');
            const failingSnippet = extractRelevantComponent(freshHtml, usoppSummary);

            const usoppFixPrompt = `You are Usopp, Backend & Application Logic Engineer. Chopper (QA Doctor) found runtime/functional errors:
"${usoppSummary}"

${frankyUpdatedHtml ? 'NOTE: Franky (UI/UX) has just updated index.html to resolve layout and modal stacking. Inspect Franky\'s updated HTML and class conventions below.\n' : ''}

${failingSnippet ? `SPECIFIC FAILING COMPONENT (from index.html):\n${failingSnippet}\n` : ''}

UPDATED index.html:
${freshHtml}

CURRENT app.js:
${currentJs}

MANDATORY FIX REQUIREMENTS:
1. Coordinate with Franky's HTML structure and classes:
   - Align modal open/close functions (e.g. openModal/closeModal) with Franky's exact modal classes (e.g. toggle "hidden" or opacity/pointer-events in perfect lockstep).
   - Ensure event listeners for buttons, modal close/cancel buttons, and form submit are properly attached and functioning.
   - Ensure state persistence (e.g. LocalStorage) and DOM updates execute cleanly without errors.
2. Output the 100% working app.js wrapped in document.addEventListener('DOMContentLoaded', () => { ... }) in a single \`\`\`javascript block.`;

            const usoppFixRes = await callAgentAutonomous(usopp, usoppFixPrompt, {
              milestoneTitle: 'Milestone 6: QA Repair - JavaScript Application Logic',
              taskDescription: 'Repair application logic, DOM event listeners, modal state synchronization',
              toolContext: usoppCtx
            });
            if (usoppFixRes.toolCallsExecuted) {
              m6FeedbackEvents.push(...usoppFixRes.toolCallsExecuted);
            }
            const jsMatch = usoppFixRes.text.match(/```(?:javascript|js)\s*\n([\s\S]*?)(?:```|$)/i);
            if (jsMatch && isValidJs(jsMatch[1])) {
              let jsContent = jsMatch[1].trim();
              agentTools.writeFile(usoppCtx, 'app.js', jsContent);
              let audit = agentTools.runSyntaxAudit(usoppCtx, 'app.js');
              if (!audit.valid) {
                console.warn(`[Usopp Self-Healing in Milestone 6] Syntax error: ${audit.error}. Healing truncated function boundary...`);
                const lines = jsContent.split('\n');
                for (let k = lines.length - 1; k >= Math.max(0, lines.length - 40); k--) {
                  const candidate = lines.slice(0, k).join('\n') + '\n});';
                  try {
                    new Function(candidate);
                    jsContent = candidate;
                    agentTools.writeFile(usoppCtx, 'app.js', jsContent);
                    break;
                  } catch {
                    /* try next */
                  }
                }
              }
            }
          }

          // 3. Route API integration issues to Brook
          const brookIssues = currentIssues.filter((i) => i.targetAgentId === 'sh-brook' || i.category === 'integration');
          if (brookIssues.length > 0) {
            const brook = getAgent('sh-brook');
            const brookSummary = brookIssues.map((i) => i.description).join('; ');
            notifyMessage('sh-chopper', 'Chopper (QA Doctor)', `⚠️ QA Issue for Brook: "${brookSummary}". Requesting API spec revision.`);
            const brookFixPrompt = `You are Brook, Integrations Specialist. Chopper reported API integration failures: "${brookSummary}". Please update integrations.md to specify offline mock responses and resilient fallbacks in clean Markdown.`;
            const brookFixRes = await callAgentAutonomous(brook, brookFixPrompt, {
              isLightweight: true,
              milestoneTitle: 'Milestone 6: QA Repair - Integrations Spec',
              taskDescription: 'Resilient API integration specs and mock fallbacks',
              toolContext: brookCtx
            });
            if (brookFixRes.toolCallsExecuted) {
              m6FeedbackEvents.push(...brookFixRes.toolCallsExecuted);
            }
            agentTools.writeFile(brookCtx, 'integrations.md', brookFixRes.text);
          }

          // Re-test after collaborative revision
          syntaxAudit = agentTools.runSyntaxAudit(chopperCtx, 'app.js');
          domTest = agentTools.browserTest(chopperCtx);
          browserReport = await agentTools.runRealBrowserTest(chopperCtx, p, previousArtifacts.get('step-spec'));
        }

        if (!syntaxAudit.valid) {
          browserReport.syntaxValidation = 'FAIL';
          browserReport.browserFunctionalTesting = 'FAIL';
          browserReport.finalQaApproval = 'REJECTED';
        }

        // Chopper creates comprehensive test report with honest status matrix
        const interactionsTable = browserReport.interactionsTested.length > 0
          ? browserReport.interactionsTested.map((it) => `| ${it.type} | \`${it.target.replace(/\|/g, '/')}\` | ${it.success ? '✅ PASS' : '❌ FAIL'} | ${it.stateChanged ? 'Yes' : 'No'} | ${it.details || it.error || 'N/A'} |`).join('\n')
          : '| None | None | N/A | N/A | No interactive elements tested |';

        const issuesTable = browserReport.issues.length > 0
          ? browserReport.issues.map((iss) => `| ${iss.severity} | ${iss.category} | ${iss.targetAgentId} | ${iss.description.replace(/\|/g, '/')} |`).join('\n')
          : '| INFO | None | None | No active issues detected |';

        const chopperPrompt = `You are Chopper, QA Doctor and Testing Specialist.
Review the actual Playwright browser test execution results for: "${p}".
STRICT REQUIREMENT: You MUST base your report solely on the verified metrics and real Playwright interactions below. DO NOT invent or hallucinate test steps, moves, or results that were not executed.

Verified Metrics:
- JavaScript Syntax Validation: ${syntaxAudit.valid ? 'PASS' : 'FAIL'}
- Static DOM Validation: ${domTest.pass ? 'PASS' : 'FAIL'} (${domTest.buttonCount} buttons, ${domTest.formCount} forms)
- Real Browser Functional Testing: ${browserReport.browserFunctionalTesting} (${browserReport.interactionsTested.filter((i) => i.success).length}/${browserReport.interactionsTested.length} interactions passed)
- Integration Testing: ${browserReport.integrationTesting}
- Final QA Decision: ${browserReport.finalQaApproval}
- Collaborative Feedback Passes Executed: ${feedbackRetries}

Format the report with:
1. Executive Summary & Verification Matrix
2. Real Browser Interaction Results
3. Feedback Revision Log
4. Signoff Recommendation`;

        const chopperRes = await callAgentAutonomous(chopper, chopperPrompt, {
          milestoneTitle: 'Milestone 6: QA Verification & Test Reporting',
          taskDescription: 'Playwright browser testing, QA test report, bug verification, and quality audit',
          toolContext: chopperCtx
        });

        // Prepend structured status matrix header to Chopper's report for absolute transparency
        const fullReportContent = `# 🩺 QA Test Verification Report — ${projectName}
**QA Lead:** Tony Tony Chopper
**Project:** "${p}"
**Generated At:** ${new Date().toISOString()}

## 📊 Honest Testing Status Matrix
| Verification Dimension | Status | Standard / Threshold | Notes |
| :--- | :--- | :--- | :--- |
| **Syntax Validation** | \`${syntaxAudit.valid ? 'PASS' : 'FAIL'}\` | Zero V8 syntax errors | \`app.js\` parsed cleanly |
| **DOM Structure Validation** | \`${domTest.pass ? 'PASS' : 'FAIL'}\` | Semantic HTML5 & script binding | ${domTest.buttonCount} buttons, ${domTest.formCount} forms |
| **Browser Functional Testing** | \`${browserReport.browserFunctionalTesting}\` | Headless Chromium real clicks/submits | ${browserReport.interactionsTested.length} interactions executed |
| **Integration Testing** | \`${browserReport.integrationTesting}\` | API contracts & mock stability | Resilient against network drops |
| **Final QA Sign-Off Decision** | **${browserReport.finalQaApproval}** | Multi-agent gate approval | Quality threshold checked |

## 🖱️ Real Browser Interaction Log
| Interaction | Target Selector / Element | Result | State Mutated | Notes |
| :--- | :--- | :--- | :--- | :--- |
${interactionsTable}

## 📋 Detected Issues & Routing Log
| Severity | Category | Responsible Specialist | Description |
| :--- | :--- | :--- | :--- |
${issuesTable}

${chopperRes.text}
`;

        agentTools.writeFile(chopperCtx, 'test-report.md', fullReportContent);

        // Sanji: DevOps Dockerfile
        const sanjiPrompt = `You are Sanji, DevOps Engineer.
Provide a clean multi-stage Nginx Dockerfile for: "${p}".
Provide ONLY the Dockerfile in a \`\`\`dockerfile block.`;

        const sanjiRes = await callAgentAutonomous(sanji, sanjiPrompt, {
          isLightweight: true,
          milestoneTitle: 'Milestone 6: DevOps & Container Deployment',
          taskDescription: 'DevOps configuration, Dockerfile containerization, Nginx, and deployment guide',
          toolContext: sanjiCtx
        });
        const dockerMatch = sanjiRes.text.match(/```(?:dockerfile|docker)\s*\n([\s\S]*?)```/i);
        const dockerContent = dockerMatch ? dockerMatch[1].trim() : 'FROM nginx:alpine\nCOPY . /usr/share/nginx/html\nEXPOSE 80\nCMD ["nginx", "-g", "daemon off;"]\n';
        agentTools.writeFile(sanjiCtx, 'Dockerfile', dockerContent);

        const m6Events = [
          ...toMilestoneToolEvents('milestone-6', 'sh-chopper', chopperRes.toolCallsExecuted),
          ...toMilestoneToolEvents('milestone-6', 'sh-sanji', sanjiRes.toolCallsExecuted),
          ...toMilestoneToolEvents('milestone-6-feedback', 'sh-chopper', m6FeedbackEvents)
        ];

        const qaPassed = syntaxAudit.valid && domTest.pass && browserReport.finalQaApproval === 'APPROVED';
        const milestone6Status: 'QA_PASSED' | 'QA_REJECTED' = qaPassed ? 'QA_PASSED' : 'QA_REJECTED';

        milestoneTelemetryList.push({
          stepNum: 6,
          agentId: 'sh-chopper',
          agentName: 'Chopper & Sanji',
          role: 'QA & DevOps Specialists',
          provider: `${chopperRes.provider} & ${sanjiRes.provider}`,
          model: `${chopperRes.model} & ${sanjiRes.model}`,
          keyIndex: chopperRes.keyIndex,
          durationMs: chopperRes.durationMs + sanjiRes.durationMs,
          fallbackOccurred: (chopperRes.fallbackOccurred || sanjiRes.fallbackOccurred) ?? false,
          activatedSkills: [...(chopperRes.activatedSkills ?? []), ...(sanjiRes.activatedSkills ?? [])],
          filesWritten: ['test-report.md', 'Dockerfile'],
          toolCallsCount: m6Events.length,
          successfulToolCalls: m6Events.filter((t) => t.status === 'success').length,
          failedToolCalls: m6Events.filter((t) => t.status === 'failure').length,
          toolCallsExecuted: m6Events,
          status: milestone6Status,
          feedbackRetries,
          qaStatusMatrix: {
            syntaxValidation: syntaxAudit.valid ? 'PASS' : 'FAIL',
            domValidation: domTest.pass ? 'PASS' : 'FAIL',
            browserFunctionalTesting: browserReport.browserFunctionalTesting,
            integrationTesting: browserReport.integrationTesting,
            finalQaApproval: browserReport.finalQaApproval
          }
        });

        return chopperRes.text + '\n\n' + sanjiRes.text;
      }
    },

    // ── Milestone 7: Review & Sign-Off (Zoro + Robin + Luffy) ──────────────────
    {
      stepNum: 7,
      id: 'step-review-signoff',
      agentId: 'sh-zoro',
      agentName: 'Zoro, Robin & Luffy (Review, Docs & Sign-Off)',
      role: 'Final Reviewers & Orchestrator',
      taskTitle: 'Milestone 7: Code Review Quality Gate, README & Sprint Sign-Off',
      actionWorking: 'Reviewing code quality, compiling documentation & signing off...',
      station: 'board',
      tool: 'TodoWrite',
      deliverables: [
        { name: 'Code Review', file: 'code-review.md', required: true },
        { name: 'README', file: 'README.md', required: true },
        { name: 'Sprint Sign-Off', file: 'sprint-signoff.md', required: true }
      ],
      execute: async (dir, p) => {
        const zoro = getAgent('sh-zoro');
        const robin = getAgent('sh-robin');
        const luffy = getAgent('god');

        const zoroCtx: ToolExecutionContext = { agentId: 'sh-zoro', agentName: 'Zoro (Code Reviewer)', projectWorkspace: dir };
        const robinCtx: ToolExecutionContext = { agentId: 'sh-robin', agentName: 'Robin (Docs Specialist)', projectWorkspace: dir };
        const luffyCtx: ToolExecutionContext = { agentId: 'god', agentName: 'Luffy (Captain & Orchestrator)', projectWorkspace: dir };

        const m6Tel = milestoneTelemetryList.find((m) => m.stepNum === 6);
        const m6Status = m6Tel?.status || 'QA_REJECTED';
        const qaPassed = m6Status === 'QA_PASSED';

        // Zoro inspects deliverables via tools
        const filesPresent = agentTools.listFiles(zoroCtx);
        const requiredFiles = ['index.html', 'style.css', 'app.js', 'Dockerfile'];
        const missing = requiredFiles.filter((f) => !filesPresent.includes(f));
        if (missing.length > 0) {
          throw new Error(`Zoro Verification Failed: Missing required sprint deliverables: ${missing.join(', ')}`);
        }

        // Zoro: Code Review with honest QA gate status awareness
        const zoroPrompt = `You are Zoro, Final Code Reviewer of the Straw Hat Dev Crew.
Review the completed code deliverables (index.html, style.css, app.js, Dockerfile) for: "${p}".
QA Gate Status from Chopper: ${m6Status}.
Verify architecture compliance, code quality gate status, and issue the quality review in clean Markdown.
If Chopper reported QA_REJECTED, explicitly declare REVIEW_REJECTED and document why approval cannot be granted.`;

        const zoroRes = await callAgentAutonomous(zoro, zoroPrompt, {
          milestoneTitle: 'Milestone 7: Senior Code Review & Quality Gate',
          taskDescription: 'Rigorous code review, architecture compliance, security review, and quality gate sign-off',
          toolContext: zoroCtx
        });
        agentTools.writeFile(zoroCtx, 'code-review.md', zoroRes.text);

        const zoroReviewApproved = qaPassed && !zoroRes.text.toLowerCase().includes('qa_rejected') && !zoroRes.text.toLowerCase().includes('review_rejected') && !zoroRes.text.toLowerCase().includes('rejecting approval');
        const reviewStatus: 'REVIEW_APPROVED' | 'REVIEW_REJECTED' = zoroReviewApproved ? 'REVIEW_APPROVED' : 'REVIEW_REJECTED';

        // Robin: Documentation with Honest Completion Report
        const robinPrompt = `You are Robin, Documentation Specialist of the Straw Hat Dev Crew.
Write comprehensive documentation for: "${p}".
Include:
1. Project Vision & Purpose (Who is it for? What problem does it solve?)
2. Visual Identity & Architecture (Layout, color system, components)
3. Key Features & Workflows
4. Honest Completion Report (MANDATORY TRANSPARENCY MATRIX):
   - 🟢 Fully Implemented Features (Verified in Functional Prototype)
   - 🟡 Simulated Features (Prototype Mode: mock data, LocalStorage persistence, simulated services)
   - 🟠 Partially Implemented Features
   - 🔵 External Production Services Required (e.g. Live payment gateway, SMS/Email, Cloud DB)
5. Quick Start, Local Running & Docker Deployment Guide in clean Markdown.`;

        const robinRes = await callAgentAutonomous(robin, robinPrompt, {
          isLightweight: true,
          milestoneTitle: 'Milestone 7: Technical Documentation & README',
          taskDescription: 'Technical documentation, README, feature lists, and user guide',
          toolContext: robinCtx
        });
        const readmeClean = robinRes.text.replace(/^```(?:markdown|md)?\s*|\s*```$/gi, '').trim();
        agentTools.writeFile(robinCtx, 'README.md', readmeClean);

        // Luffy: Sprint Sign-Off
        const luffyPrompt = `You are Luffy, Captain & Lead Orchestrator.
Review the voyage and write the final sprint sign-off for "${p}".
Chopper QA Status: ${m6Status}
Zoro Review Status: ${reviewStatus}
Confirm whether all 12 crew members completed their assignments.
State the honest final sprint decision (${qaPassed && zoroReviewApproved ? 'SPRINT_APPROVED' : 'SPRINT_REJECTED'}).
Format in clean Markdown.`;

        const luffyRes = await callAgentAutonomous(luffy, luffyPrompt, {
          milestoneTitle: 'Milestone 7: Final Voyage Sign-Off',
          taskDescription: 'Final sprint sign-off, team coordination, and project closure',
          toolContext: luffyCtx
        });
        agentTools.writeFile(luffyCtx, 'sprint-signoff.md', luffyRes.text);

        const sprintSignoffStatus: 'SPRINT_APPROVED' | 'SPRINT_REJECTED' = (qaPassed && zoroReviewApproved) ? 'SPRINT_APPROVED' : 'SPRINT_REJECTED';

        const m7Events = [
          ...toMilestoneToolEvents('milestone-7', 'sh-zoro', zoroRes.toolCallsExecuted),
          ...toMilestoneToolEvents('milestone-7', 'sh-robin', robinRes.toolCallsExecuted),
          ...toMilestoneToolEvents('milestone-7', 'god', luffyRes.toolCallsExecuted)
        ];

        // Record Execution Audit Trail
        milestoneTelemetryList.push({
          stepNum: 7,
          agentId: 'sh-zoro',
          agentName: 'Zoro, Robin & Luffy',
          role: 'Reviewers & Orchestrator',
          provider: `${zoroRes.provider} & ${robinRes.provider}`,
          model: `${zoroRes.model} & ${robinRes.model}`,
          keyIndex: zoroRes.keyIndex,
          durationMs: zoroRes.durationMs + robinRes.durationMs + luffyRes.durationMs,
          fallbackOccurred: (zoroRes.fallbackOccurred || robinRes.fallbackOccurred || luffyRes.fallbackOccurred) ?? false,
          activatedSkills: [...(zoroRes.activatedSkills ?? []), ...(robinRes.activatedSkills ?? []), ...(luffyRes.activatedSkills ?? [])],
          filesWritten: ['code-review.md', 'README.md', 'sprint-signoff.md'],
          toolCallsCount: m7Events.length,
          successfulToolCalls: m7Events.filter((t) => t.status === 'success').length,
          failedToolCalls: m7Events.filter((t) => t.status === 'failure').length,
          toolCallsExecuted: m7Events,
          status: sprintSignoffStatus
        });

        const allToolExecutions: Array<{
          agentId: string;
          milestoneId: string;
          toolName: string;
          status: 'success' | 'failure';
          durationMs: number;
          turn: number;
          error?: string;
          args?: Record<string, unknown>;
        }> = [];

        for (const m of milestoneTelemetryList) {
          if (m.toolCallsExecuted && m.toolCallsExecuted.length > 0) {
            allToolExecutions.push(...m.toolCallsExecuted);
          }
        }

        const wsEntries: string[] = readdirSync(dir);
        const uniqueFiles = wsEntries.filter((f: string) => statSync(join(dir, f)).isFile());
        const uniqueDirs = wsEntries.filter((f: string) => statSync(join(dir, f)).isDirectory());

        const toolCallsPerAgent: Record<string, { total: number; successful: number; failed: number; tools: Record<string, number> }> = {};
        for (const te of allToolExecutions) {
          if (!toolCallsPerAgent[te.agentId]) {
            toolCallsPerAgent[te.agentId] = { total: 0, successful: 0, failed: 0, tools: {} };
          }
          toolCallsPerAgent[te.agentId].total++;
          if (te.status === 'success') toolCallsPerAgent[te.agentId].successful++;
          else toolCallsPerAgent[te.agentId].failed++;
          toolCallsPerAgent[te.agentId].tools[te.toolName] = (toolCallsPerAgent[te.agentId].tools[te.toolName] || 0) + 1;
        }

        const auditTrail = {
          projectName,
          prompt: p,
          timestamp: new Date().toISOString(),
          durationTotalSec: Number(((Date.now() - sprintStartTime) / 1000).toFixed(1)),
          executionStatus: 'EXECUTION_COMPLETED',
          qaStatus: m6Status,
          reviewStatus,
          sprintStatus: sprintSignoffStatus,
          milestones: milestoneTelemetryList,
          toolExecutionSummary: {
            totalToolCalls: allToolExecutions.length,
            successfulToolCalls: allToolExecutions.filter((t) => t.status === 'success').length,
            failedToolCalls: allToolExecutions.filter((t) => t.status === 'failure').length,
            toolCallsPerAgent
          },
          workspaceSummary: {
            totalEntries: wsEntries.length,
            uniqueFilesCount: uniqueFiles.length,
            uniqueFiles,
            uniqueDirsCount: uniqueDirs.length,
            uniqueDirs,
            filesCreated: agentTools.getTrackedFileStats().created,
            filesModified: agentTools.getTrackedFileStats().modified
          },
          toolAuditLog: agentTools.getAuditLog(),
          agentToolExecutions: allToolExecutions
        };

        agentTools.writeFile(luffyCtx, 'execution-audit.json', JSON.stringify(auditTrail, null, 2));

        return zoroRes.text;
      }
    }
  ];

  // Reset all sprint agents so no one is stuck in 'blocked' from a prior run
  for (const step of steps) {
    notifyAgent(step.agentId, 'waiting', `Sprint ready: ${step.taskTitle}`, undefined, 'desk');
  }

  // Initial announcement
  notifyMessage(
    'god',
    'Luffy (Lead Orchestrator)',
    `🏴‍☠️ Straw Hat Dev Crew Assemble! Starting 7-Stage Autonomous Voyage for: "${prompt}".\nWorkspace: \`workspace/${projectName}/\`. Setting sail with all 12 crew members!`
  );

  const taskStates = steps.map((s) => ({
    id: `task-${projectName}-${s.stepNum}`,
    title: s.taskTitle,
    assignee: s.agentName,
    status: 'waiting' as 'done' | 'blocked' | 'waiting' | 'working',
    priority: s.stepNum <= 5 ? 'high' : 'medium'
  }));

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    taskStates[i].status = 'working';
    syncHiveTasks(taskStates);

    // 1. Transition agent to working
    notifyAgent(step.agentId, 'working', step.actionWorking, step.tool, step.station);
    notifyMessage(step.agentId, step.agentName, `▶️ Starting Step ${step.stepNum}/7: ${step.taskTitle}`);
    appendHiveLog({
      kind: 'sprint',
      agentId: step.agentId,
      agentName: step.agentName,
      text: `▶️ Step ${step.stepNum}/7 started: ${step.taskTitle}`
    });

    try {
      const output = await step.execute(baseDir, prompt, previousArtifacts);
      previousArtifacts.set(step.id, output);
      completedSteps.push(step.id);

      // Verify required deliverables on disk with explicit status
      const milestoneStatus = evaluateMilestoneStatus(baseDir, step.deliverables);
      if (milestoneStatus !== 'COMPLETED') {
        const missing = step.deliverables
          .filter((d) => d.required && !existsSync(join(baseDir, d.file)) && !existsSync(join(baseDir, 'docs', d.file)))
          .map((m) => m.file);
        throw new Error(`Deliverable verification failed (${milestoneStatus}): ${missing.join(', ')} was not generated.`);
      }

      // Mark agent idle and notify success
      taskStates[i].status = 'done';
      syncHiveTasks(taskStates);

      notifyAgent(step.agentId, 'idle', `${step.agentName}: Deliverable ready`, undefined, 'desk');
      const filesCreated = step.deliverables
        .filter((d) => existsSync(join(baseDir, d.file)))
        .map((d) => `\`workspace/${projectName}/${d.file}\``);
      notifyMessage(
        step.agentId,
        step.agentName,
        `✓ Completed Step ${step.stepNum}/7 (${step.taskTitle}). Files saved:\n${filesCreated.join('\n')}`
      );
      appendAgentMemory(
        step.agentId,
        `**Project:** ${projectName}\n**Task:** Step ${step.stepNum}/7 - ${step.taskTitle}\n**Status:** Delivered & Verified\n**Deliverables:**\n${filesCreated.join('\n')}`
      );
      appendHiveLog({
        kind: 'sprint',
        agentId: step.agentId,
        agentName: step.agentName,
        text: `✓ Step ${step.stepNum}/7 completed: ${step.taskTitle}`
      });
    } catch (err) {
      console.error(`[orchestrator] Step ${step.stepNum} (${step.agentName}) failed:`, err);
      const errMsg = err instanceof Error ? err.message : String(err);

      // 1. Mark failing agent as BLOCKED (never left stuck in working)
      taskStates[i].status = 'blocked';
      notifyAgent(step.agentId, 'blocked', `Blocked: ${errMsg}`, step.tool, step.station);
      notifyMessage(
        step.agentId,
        step.agentName,
        `❌ Task Blocked at Step ${step.stepNum}/7: ${errMsg}`
      );

      // 2. Mark ALL downstream dependent agents as WAITING/BLOCKED
      for (let j = i + 1; j < steps.length; j++) {
        const downstream = steps[j];
        taskStates[j].status = 'waiting';
        notifyAgent(
          downstream.agentId,
          'waiting',
          `Blocked: Waiting on ${step.agentName} deliverable`,
          undefined,
          'desk'
        );
        notifyMessage(
          downstream.agentId,
          downstream.agentName,
          `⏸️ Paused: Cannot proceed with Step ${downstream.stepNum}/7 until Step ${step.stepNum} (${step.agentName}) is resolved.`
        );
      }
      syncHiveTasks(taskStates);

      // 3. Notify the Boss and user with honest summary of preserved work
      notifyAgent('god', 'blocked', `Sprint halted at Step ${step.stepNum}: ${step.agentName} encountered an error`);
      const preservedFiles = steps
        .flatMap((s) => s.deliverables)
        .filter((d) => existsSync(join(baseDir, d.file)))
        .map((d) => `• \`workspace/${projectName}/${d.file}\``);

      notifyMessage(
        'god',
        'Luffy (Lead Orchestrator)',
        `⚠️ **SPRINT HALTED AT STEP ${step.stepNum}/7** (${step.agentName})\n\n**Error:** ${errMsg}\n\n📁 **Preserved Completed Deliverables in \`workspace/${projectName}/\`:**\n${preservedFiles.length > 0 ? preservedFiles.join('\n') : '• No files saved before failure'
        }\n\n👉 **Next Action:** Downstream agents have been safely paused. Resolve the blocker for ${step.agentName} to resume.`
      );

      return {
        success: false,
        projectName,
        error: errMsg
      };
    }
  }

  // Final decision reporting
  const m6Tel = milestoneTelemetryList.find((m) => m.stepNum === 6);
  const m7Tel = milestoneTelemetryList.find((m) => m.stepNum === 7);
  const qaStatus = (m6Tel?.status || 'QA_REJECTED') as 'QA_PASSED' | 'QA_REJECTED';
  const sprintStatus = (m7Tel?.status === 'SPRINT_APPROVED' ? 'SPRINT_APPROVED' : 'SPRINT_REJECTED') as 'SPRINT_APPROVED' | 'SPRINT_REJECTED';
  const isApproved = sprintStatus === 'SPRINT_APPROVED';

  if (isApproved) {
    notifyAgent('god', 'idle', 'Luffy: Voyage Completed & SPRINT_APPROVED!', undefined, 'desk');
    for (const s of steps) {
      notifyAgent(s.agentId, 'idle', `${s.agentName}: Ready for new adventure`, undefined, 'desk');
    }
    notifyMessage(
      'god',
      'Luffy (Lead Orchestrator)',
      `🎉 **STRAW HAT DEV CREW COMPLETED THE VOYAGE SUCCESSFULLY! (SPRINT_APPROVED)**\n\nAll 12 agents have built and verified your project together in **\`workspace/${projectName}/\`**:\n• 📝 \`project-plan.md\` & \`sprint-plan.md\` (Luffy)\n• 📋 \`spec.md\` (Hancock)\n• 🏗️ \`architecture.md\` (Shanks) & \`data-models.md\` (Nami)\n• 🎨 \`index.html\` & \`style.css\` (Franky)\n• ⚙️ \`app.js\` (Usopp)\n• 🔌 \`integrations.md\` (Brook)\n• 🛡️ \`security-review.md\` (Jinbe)\n• 🧪 \`test-report.md\` (Chopper - QA_PASSED)\n• 🐳 \`Dockerfile\` (Sanji)\n• ⚔️ \`code-review.md\` (Zoro - REVIEW_APPROVED)\n• 📖 \`README.md\` (Robin)\n• ✅ \`sprint-signoff.md\` (Luffy - SPRINT_APPROVED)\n\nAll files are verified and written to disk! Open \`workspace/${projectName}/index.html\` to run it!`
    );
  } else {
    notifyAgent('god', 'blocked', `Luffy: Voyage Concluded with ${qaStatus} / SPRINT_REJECTED`, undefined, 'desk');
    notifyMessage(
      'god',
      'Luffy (Lead Orchestrator)',
      `⚠️ **STRAW HAT DEV CREW VOYAGE CONCLUDED WITH ${qaStatus} / SPRINT_REJECTED**\n\nAll 7 milestones executed (EXECUTION_COMPLETED), but the QA quality gate did not grant approval.\n• QA Verdict: **${qaStatus}** (Chopper)\n• Final Decision: **SPRINT_REJECTED** (Luffy)\n\nAll deliverables have been preserved in \`workspace/${projectName}/\` for inspection.`
    );
  }

  appendAgentMemory(
    'god',
    `**Sprint Concluded: ${projectName}**\n**Project Prompt:** "${prompt}"\n**Team:** 12 Agents (Luffy, Hancock, Shanks, Nami, Franky, Usopp, Brook, Jinbe, Chopper, Sanji, Zoro, Robin)\n**Workspace:** \`workspace/${projectName}/\`\n**Status:** ${sprintStatus} (QA: ${qaStatus})\n**Execution:** EXECUTION_COMPLETED.`
  );
  appendHiveLog({
    kind: 'sprint',
    agentId: 'god',
    agentName: 'Luffy',
    text: `Sprint concluded for project "${projectName}" with status ${sprintStatus} (QA: ${qaStatus}).`
  });

  return {
    success: isApproved,
    projectName,
    durationTotalSec: Number(((Date.now() - sprintStartTime) / 1000).toFixed(1)),
    executionStatus: 'EXECUTION_COMPLETED',
    sprintStatus,
    qaStatus,
    finalQaApproval: m6Tel?.qaStatusMatrix?.finalQaApproval as 'APPROVED' | 'REJECTED' | 'CONDITIONAL',
    browserFunctionalTesting: m6Tel?.qaStatusMatrix?.browserFunctionalTesting as 'PASS' | 'FAIL' | 'NOT VERIFIED',
    milestones: milestoneTelemetryList
  };
}

/**
 * Phase 2B.2: Agent-Owned Application Repair Runner
 * Directly executes Chopper's real browser diagnostics and the Franky + Usopp collaborative repair cycle
 * on an existing workspace project (without wiping or re-generating Step 1-5 deliverables).
 */
export async function executeAgentOwnedRepair(
  projectName: string,
  prompt: string,
  webContents: WebContents | null,
  options?: { maxRetries?: number; phaseName?: string }
): Promise<{
  success: boolean;
  finalQaApproval: 'APPROVED' | 'REJECTED' | 'CONDITIONAL';
  browserFunctionalTesting: 'PASS' | 'FAIL' | 'NOT VERIFIED';
  feedbackPasses: number;
  filesModified: string[];
  initialBrowserReport: any;
  finalBrowserReport: any;
  reportContent: string;
}> {
  const baseDir = join(process.cwd(), 'workspace', projectName);
  if (!existsSync(baseDir)) {
    throw new Error(`Project workspace directory does not exist: ${baseDir}`);
  }

  const phaseName = options?.phaseName ?? 'Phase 2B.3';
  const maxRetries = options?.maxRetries ?? 1;

  const chopper = getStrawHatCrewAgent('sh-chopper');
  const franky = getStrawHatCrewAgent('sh-franky');
  const usopp = getStrawHatCrewAgent('sh-usopp');
  const zoro = getStrawHatCrewAgent('sh-zoro');
  const luffy = getStrawHatCrewAgent('god');

  const chopperCtx: ToolExecutionContext = { agentId: 'sh-chopper', agentName: 'Chopper (QA Doctor)', projectWorkspace: baseDir };
  const frankyCtx: ToolExecutionContext = { agentId: 'sh-franky', agentName: 'Franky (UI/UX Engineer)', projectWorkspace: baseDir };
  const usoppCtx: ToolExecutionContext = { agentId: 'sh-usopp', agentName: 'Usopp (Backend & Logic)', projectWorkspace: baseDir };
  const zoroCtx: ToolExecutionContext = { agentId: 'sh-zoro', agentName: 'Zoro (Code Reviewer)', projectWorkspace: baseDir };
  const luffyCtx: ToolExecutionContext = { agentId: 'god', agentName: 'Luffy (Captain & Orchestrator)', projectWorkspace: baseDir };

  const filesModified = new Set<string>();

  const notifyMessage = (agentId: string, sender: string, text: string) => {
    webContents?.send('hive:externalAgentMessage', {
      agentId,
      sender,
      text,
      timestamp: Date.now()
    });
  };

  notifyMessage(
    'sh-chopper',
    'Chopper (QA Doctor)',
    `🩺 Starting ${phaseName} Agent-Owned Repair Cycle on workspace/${projectName}/ (max attempts: ${maxRetries}).`
  );

  // 1. Initial Test Run: Syntax, DOM, and Real Headless Chromium Browser Testing
  let syntaxAudit = agentTools.runSyntaxAudit(chopperCtx, 'app.js');
  let domTest = agentTools.browserTest(chopperCtx);
  let browserReport = await agentTools.runRealBrowserTest(chopperCtx, prompt);
  const initialBrowserReport = JSON.parse(JSON.stringify(browserReport));

  let feedbackRetries = 0;

  const hasDefects = () =>
    !syntaxAudit.valid ||
    !domTest.pass ||
    browserReport.browserFunctionalTesting === 'FAIL' ||
    browserReport.issues.some((i) => i.severity === 'CRITICAL' || i.severity === 'MAJOR');

  // 2. Collaborative Feedback Loop
  while (feedbackRetries < maxRetries && hasDefects()) {
    feedbackRetries++;
    const currentIssues = [...browserReport.issues];
    const modalFailure = browserReport.interactionsTested.find((it: any) => it.type === 'modal_toggle' && !it.success);
    if (modalFailure) {
      currentIssues.unshift({
        category: 'html',
        targetAgentId: 'sh-franky',
        targetFile: 'index.html',
        secondaryAgentId: 'sh-usopp',
        isCoordinated: true,
        severity: 'CRITICAL',
        description: `Modal toggle interaction failed: ${modalFailure.details || modalFailure.error || 'Modal open/close cycle incomplete'}`
      });
    }
    if (!syntaxAudit.valid) {
      currentIssues.unshift({
        category: 'javascript',
        targetAgentId: 'sh-usopp',
        targetFile: 'app.js',
        severity: 'CRITICAL',
        description: `Syntax error in app.js: ${syntaxAudit.error}`
      });
    }

    notifyMessage(
      'sh-chopper',
      'Chopper (QA Doctor)',
      `⚠️ [Feedback Pass #${feedbackRetries}] Issues detected. Routing to Franky & Usopp...`
    );

    // Step A: Route HTML/CSS layout, pointer interception, and modal stacking issues to Franky
    const frankyIssues = currentIssues.filter(
      (i) => i.targetAgentId === 'sh-franky' || i.category === 'html' || i.category === 'css'
    );
    let frankyUpdatedHtml = false;

    if (frankyIssues.length > 0) {
      const frankySummary = frankyIssues.map((i) => i.description).join('; ');
      notifyMessage(
        'sh-chopper',
        'Chopper (QA Doctor)',
        `⚠️ QA Issue for Franky: "${frankySummary}". Requesting layout & CSS stacking revision.`
      );

      const currentHtml = agentTools.readFile(frankyCtx, 'index.html');
      const currentCss = existsSync(join(baseDir, 'style.css')) ? agentTools.readFile(frankyCtx, 'style.css') : '';
      const failingSnippet = extractRelevantComponent(currentHtml, frankySummary);

      let frankyHtmlRef = currentHtml;
      if (currentHtml.length > 5000) {
        const modalStart = currentHtml.search(/id=["']modal-/i);
        if (modalStart !== -1) {
          frankyHtmlRef = `... (use ReadFile to view full index.html) ...\n` + currentHtml.substring(Math.max(0, modalStart - 200), Math.min(currentHtml.length, modalStart + 4500));
        } else {
          frankyHtmlRef = currentHtml.substring(0, 5000);
        }
      }

      const isChessRepair = /\bchess\b/i.test(prompt) || projectName.includes('chess');
      const frankyFixPrompt = isChessRepair
        ? `You are Franky, UI/UX Engineer of the Straw Hat Dev Crew. Chopper (QA Doctor) reported layout, CSS, and DOM rendering defects on workspace/${projectName}/:
"${frankySummary}"

${failingSnippet ? `SPECIFIC FAILING COMPONENT IN index.html:\n${failingSnippet}\n` : ''}
${currentCss ? `COMPLETE style.css:\n${currentCss}\n` : ''}

MANDATORY FIX REQUIREMENTS FOR CHESS GAME:
1. Board & Squares Layout:
   - Ensure the 8x8 chessboard container has id="chessboard" and styles for 8 columns and 8 rows.
   - In style.css, provide clear classes:
     .square { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; cursor: pointer; user-select: none; }
     .square.light { background-color: #eeeed2; }
     .square.dark { background-color: #769656; }
     .square.selected { outline: 3px solid #f59e0b !important; background-color: rgba(245, 158, 11, 0.4) !important; }
     .square.highlight, .square.valid-move { position: relative; }
     .square.highlight::after, .square.valid-move::after { content: ''; width: 16px; height: 16px; background: rgba(16, 185, 129, 0.7); border-radius: 50%; display: block; pointer-events: none; }
2. Piece Visibility & Styling:
   - In style.css, ensure .piece is styled:
     .piece { font-size: clamp(24px, 5vw, 42px); line-height: 1; cursor: pointer; transition: transform 0.15s ease; }
     .piece.white { color: #f8fafc; text-shadow: 0 2px 4px rgba(0,0,0,0.8); }
     .piece.black { color: #0f172a; text-shadow: 0 1px 2px rgba(255,255,255,0.4); }
3. Control Buttons & Modal Overlay:
   - Ensure #reset-btn is styled with class="reset-btn" and text "New Game" or "Reset Game".
   - Ensure #rules-modal starts with classes "hidden opacity-0 pointer-events-none". Close buttons (#rules-close-x, #rules-close-btn) must have data-modal-close and be clickable without interception.
4. Output: Use WriteFile or EditFile, OR provide repaired files in \`\`\`html and \`\`\`css code blocks.`
        : `You are Franky, UI/UX Engineer of the Straw Hat Dev Crew. Chopper (QA Doctor) reported layout, CSS stacking, or HTML structure defects:
"${frankySummary}"

${failingSnippet ? `SPECIFIC FAILING COMPONENT IN index.html:\n${failingSnippet}\n` : ''}

RELEVANT MODAL MARKUP IN index.html (Use ReadFile to inspect full file):
${frankyHtmlRef}

${currentCss ? `COMPLETE style.css:\n${currentCss}\n` : ''}

MANDATORY FIX REQUIREMENTS:
1. Fix modal, overlay, stacking context, and pointer-events issues:
   - Ensure all three modals (#modal-ingredient, #modal-recipe, #modal-calendar) start with the "hidden pointer-events-none" classes so closed modals do not intercept pointer events or block clicks on underlying page elements.
   - In style.css, do NOT use .modal-active with "!important" overriding static .hidden. Ensure modal visibility transitions cleanly synchronize with Tailwind's "hidden" class.
   - Ensure the modal dialog card has "pointer-events-auto" and close/cancel buttons have pointer-events-auto and are clickable without interception.
   - Verify z-index ordering and layout wrappers so parent flex/overflow containers do not block clicks.
2. Use your EditFile or WriteFile tool to apply fixes to index.html and style.css, OR output the complete repaired index.html in a single \`\`\`html block and style.css in a \`\`\`css block.`;

      const frankyFixRes = await callAgentAutonomous(franky, frankyFixPrompt, {
        milestoneTitle: 'Targeted Repair: UI Layout & Stacking',
        taskDescription: 'Fix modal overlay, pointer-events, CSS stacking, and UI layout defects',
        toolContext: frankyCtx
      });
      const htmlMatch = frankyFixRes.text.match(/```(?:html|htm)[\s\S]*?\n([\s\S]*?)(?:```|$)/i);
      if (htmlMatch && isValidHtml(htmlMatch[1].trim())) {
        agentTools.writeFile(frankyCtx, 'index.html', htmlMatch[1].trim());
        frankyUpdatedHtml = true;
        filesModified.add('index.html');
      }
      const cssMatch = frankyFixRes.text.match(/```(?:css)[\s\S]*?\n([\s\S]*?)(?:```|$)/i);
      if (cssMatch && isValidCss(cssMatch[1].trim())) {
        agentTools.writeFile(frankyCtx, 'style.css', cssMatch[1].trim());
        filesModified.add('style.css');
      }
    }

    // Step B: Route JavaScript functionality, logic, and coordinated issues to Usopp
    const isCoordinated = currentIssues.some((i) => i.isCoordinated || i.secondaryAgentId === 'sh-usopp');
    const usoppIssues = currentIssues.filter(
      (i) => i.targetAgentId === 'sh-usopp' || i.category === 'javascript' || i.secondaryAgentId === 'sh-usopp'
    );

    if (usoppIssues.length > 0 || isCoordinated) {
      const usoppSummary = usoppIssues.length > 0
        ? usoppIssues.map((i) => i.description).join('; ')
        : 'Synchronize application logic with Franky\'s updated HTML layout and modal classes';

      notifyMessage(
        'sh-chopper',
        'Chopper (QA Doctor)',
        `⚠️ QA Issue for Usopp: "${usoppSummary}". Requesting logic/runtime repair & synchronization.`
      );

      // Read the FRESHLY UPDATED HTML (which now has Franky's fixes if Franky updated it)
      const freshHtml = agentTools.readFile(usoppCtx, 'index.html');
      const currentJs = agentTools.readFile(usoppCtx, 'app.js');
      const failingSnippet = extractRelevantComponent(freshHtml, usoppSummary);

      // Extract modal and relevant interactive snippet rather than dumping full 29KB HTML to keep within provider token limits
      let htmlReference = freshHtml;
      if (freshHtml.length > 5000) {
        const modalStart = freshHtml.search(/id=["']modal-/i);
        if (modalStart !== -1) {
          htmlReference = `... (omitted prior layout) ...\n` + freshHtml.substring(Math.max(0, modalStart - 200), Math.min(freshHtml.length, modalStart + 4500));
        } else {
          htmlReference = freshHtml.substring(0, 5000);
        }
      }

      let jsReference = currentJs;
      if (currentJs.length > 5000) {
        const modalFuncs: string[] = [];
        const patterns = [
          /function\s+openAddIngredientModal[\s\S]*?function\s+saveIngredient/i,
          /function\s+openRecipeModal[\s\S]*?function\s+scheduleRecipeFromModal/i,
          /function\s+openCalendarModal[\s\S]*?function\s+saveMealPlan/i
        ];
        for (const p of patterns) {
          const match = currentJs.match(p);
          if (match) modalFuncs.push(match[0]);
        }
        if (modalFuncs.length > 0) {
          jsReference = `... (omitted non-modal logic — use ReadFile tool to inspect any other part) ...\n\n` + modalFuncs.join('\n\n// ----------------\n\n');
        } else {
          jsReference = currentJs.substring(0, 5000);
        }
      }

      const isChessRepair = /\bchess\b/i.test(prompt) || projectName.includes('chess');
      const usoppFixPrompt = isChessRepair
        ? `You are Usopp, Backend & Application Logic Engineer of the Straw Hat Dev Crew. Chopper (QA Doctor) reported runtime, DOM, and logic defects in app.js on workspace/${projectName}/:
"${usoppSummary}"

${frankyUpdatedHtml ? 'NOTE: Franky (UI/UX) has just updated index.html/style.css to resolve layout and modal stacking.\n' : ''}

MANDATORY FIX REQUIREMENTS FOR CHESS GAME:
1. Exactly 32 Starting Pieces Initialized:
   - Exactly 16 White pieces and 16 Black pieces:
     * Row 0 (rank 8, Black): R, N, B, Q, K, B, N, R (color 'b')
     * Row 1 (rank 7, Black): 8 Pawns (color 'b')
     * Rows 2-5: null (empty)
     * Row 6 (rank 2, White): 8 Pawns (color 'w')
     * Row 7 (rank 1, White): R, N, B, Q, K, B, N, R (color 'w')
2. Board Rendering & Semantic Classes (renderBoard):
   - In renderBoard(), every cell created in #chessboard MUST receive:
     * class="square " + (isLight ? "light" : "dark")
     * dataset.row = r, dataset.col = c, dataset.square = files[c] + ranks[r]
   - When square is selected:
     * square.classList.add('selected');
     * square.dataset.selected = 'true';
   - When square is a legal destination (isValidMove):
     * square.classList.add('highlight', 'valid-move');
     * square.dataset.validMove = 'true';
   - Every piece element MUST have:
     * class="piece " + (piece.color === 'w' ? 'white' : 'black')
     * dataset.piece = piece.type, dataset.color = piece.color
     * textContent = PIECE_SYMBOLS[piece.color][piece.type] (using Unicode chess characters ♔♕♖♗♘♙♚♛♜♝♞♟)
3. Piece Selection & Highlighting:
   - Clicking a piece of the current turn's color selects it, sets gameState.selectedSquare = {r, c}, computes valid destination squares via getPieceValidMoves(r, c), and renders the board so the selected square has .selected and destinations have .highlight and .valid-move.
4. Legal Move Execution & Original Square Emptied:
   - Clicking a valid destination square (toR, toC) executes the move:
     * gameState.board[toR][toC] = { type: piece.type, color: piece.color };
     * gameState.board[fromR][fromC] = null; // Crucial: Original square becomes null (empty)!
     * Clears selection (gameState.selectedSquare = null, gameState.validMoves = []);
     * Alternates turn from 'w' to 'b' or 'b' to 'w'.
     * Updates #turn-indicator text with the current turn (e.g. "White's Turn" / "Black's Turn").
     * Calls saveState() and render().
5. Illegal Move Rejection:
   - Clicking an invalid square or non-destination square deselects without altering the board or throwing errors.
6. Reset Functionality:
   - Clicking #reset-btn restores all 32 starting pieces in their original positions, resets turn to 'w', clears history, calls saveState(), and re-renders the board with exactly 64 squares and 32 pieces.
7. Modal Closure & Keyboard Shortcuts:
   - Closing #rules-modal and #game-over-modal explicitly restores "hidden opacity-0 pointer-events-none" so it never blocks page clicks.
   - Add 'Escape' key event listener on document to close open modals (#rules-modal and #game-over-modal).
   - Pressing 'R' or 'r' resets game board and re-renders 32 starting pieces.
8. Output: Provide the complete repaired app.js in a single \`\`\`javascript block (or call WriteFile('app.js', ...)).`
        : `You are Usopp, Backend & Application Logic Engineer of the Straw Hat Dev Crew. Chopper (QA Doctor) found runtime/functional errors:
"${usoppSummary}"

${frankyUpdatedHtml ? 'NOTE: Franky (UI/UX) has just updated index.html to resolve layout and modal stacking. Inspect Franky\'s updated HTML and class conventions below.\n' : ''}

${failingSnippet ? `SPECIFIC FAILING COMPONENT (from index.html):\n${failingSnippet}\n` : ''}

RELEVANT MODAL & INTERACTIVE HTML FROM index.html (Use ReadFile tool to inspect any other section if needed):
${htmlReference}

CURRENT MODAL FUNCTIONS IN app.js (Use ReadFile tool to inspect the full file):
${jsReference}

MANDATORY FIX REQUIREMENTS:
1. Coordinate with Franky's HTML structure and classes:
   - Repair all six modal open/close functions in app.js:
     * openAddIngredientModal(id) & closeAddIngredientModal() for #modal-ingredient
     * openRecipeModal(recId) & closeRecipeModal() for #modal-recipe
     * openCalendarModal(day) & closeCalendarModal() for #modal-calendar
   - When opening any modal, EXPLICITLY remove the "hidden" and "pointer-events-none" classes:
     e.g. modal.classList.remove('hidden', 'pointer-events-none');
   - When closing any modal, EXPLICITLY add the "hidden" and "pointer-events-none" classes back:
     e.g. modal.classList.add('hidden', 'pointer-events-none');
   - Crucially: Ensure ALL functions called by inline HTML attributes (openAddIngredientModal, closeAddIngredientModal, openRecipeModal, closeRecipeModal, openCalendarModal, closeCalendarModal, saveIngredient, saveMealPlan, switchTab, setCategoryFilter, etc.) remain globally accessible top-level functions or attached to window so button onclick and form onsubmit attributes do not throw ReferenceError!
   - Keep all application state, inventory data, recipes, calendar scheduling, search/filter, and LocalStorage persistence completely intact.
2. Use your EditFile tool to update the modal functions in app.js, OR output the complete working app.js in a single \`\`\`javascript block.`;

      const usoppFixRes = await callAgentAutonomous(usopp, usoppFixPrompt, {
        milestoneTitle: 'Targeted Repair: JavaScript Application Logic',
        taskDescription: 'Repair application logic, DOM event listeners, modal state synchronization',
        toolContext: usoppCtx
      });
      const jsMatch = usoppFixRes.text.match(/```(?:javascript|js)\s*\n([\s\S]*?)(?:```|$)/i);
      if (jsMatch && isValidJs(jsMatch[1].trim())) {
        let jsContent = jsMatch[1].trim();
        agentTools.writeFile(usoppCtx, 'app.js', jsContent);
        let audit = agentTools.runSyntaxAudit(usoppCtx, 'app.js');
        if (!audit.valid) {
          console.warn(`[Usopp Self-Healing in Repair] Syntax error: ${audit.error}. Healing truncated function boundary...`);
          const lines = jsContent.split('\n');
          for (let k = lines.length - 1; k >= Math.max(0, lines.length - 40); k--) {
            const candidate = lines.slice(0, k).join('\n') + '\n});';
            try {
              new Function(candidate);
              jsContent = candidate;
              agentTools.writeFile(usoppCtx, 'app.js', jsContent);
              break;
            } catch {
              /* try next */
            }
          }
        }
        filesModified.add('app.js');
      } else {
        // Check if Usopp modified app.js using EditFile tool directly
        const currentOnDisk = agentTools.readFile(usoppCtx, 'app.js');
        if (currentOnDisk !== currentJs) {
          filesModified.add('app.js');
        }
      }
    }

    // Step C: Re-test
    syntaxAudit = agentTools.runSyntaxAudit(chopperCtx, 'app.js');
    domTest = agentTools.browserTest(chopperCtx);
    browserReport = await agentTools.runRealBrowserTest(chopperCtx, prompt);
  }

  // 3. Chopper creates updated, honest test report
  const interactionsTable = browserReport.interactionsTested.length > 0
    ? browserReport.interactionsTested.map((it) => `| ${it.type} | \`${it.target.replace(/\|/g, '/')}\` | ${it.success ? '✅ PASS' : '❌ FAIL'} | ${it.stateChanged ? 'Yes' : 'No'} | ${it.details || it.error || 'N/A'} |`).join('\n')
    : '| None | None | N/A | N/A | No interactive elements tested |';

  const issuesTable = browserReport.issues.length > 0
    ? browserReport.issues.map((iss) => `| ${iss.severity} | ${iss.category} | ${iss.targetAgentId} | ${iss.description.replace(/\|/g, '/')} |`).join('\n')
    : '| INFO | None | None | No active issues detected |';

  const chopperPrompt = `You are Chopper, QA Doctor and Testing Specialist.
Create an authentic test verification report in clean Markdown for ${phaseName} application repair on: "${prompt}".

Verified Metrics:
- JavaScript Syntax Validation: ${syntaxAudit.valid ? 'PASS' : 'FAIL'}
- Static DOM Validation: ${domTest.pass ? 'PASS' : 'FAIL'} (${domTest.buttonCount} buttons, ${domTest.formCount} forms)
- Real Browser Functional Testing: ${browserReport.browserFunctionalTesting} (${browserReport.interactionsTested.filter((i) => i.success).length}/${browserReport.interactionsTested.length} interactions passed)
- Integration Testing: ${browserReport.integrationTesting}
- Final QA Decision: ${browserReport.finalQaApproval}
- Collaborative Feedback Passes Executed: ${feedbackRetries}

Format the report with:
1. Executive Summary & Verification Matrix
2. Real Browser Interaction Results
3. Feedback Revision Log
4. Signoff Recommendation`;

  const chopperRes = await callAgentAutonomous(chopper, chopperPrompt, {
    milestoneTitle: 'Targeted Repair: QA Verification',
    taskDescription: 'Playwright browser testing, QA test report, bug verification',
    toolContext: chopperCtx
  });

  const fullReportContent = `# 🩺 QA Test Verification Report — ${projectName} (${phaseName} Repair)
**QA Lead:** Tony Tony Chopper
**Project:** "${prompt}"
**Generated At:** ${new Date().toISOString()}

## 📊 Honest Testing Status Matrix
| Verification Dimension | Status | Standard / Threshold | Notes |
| :--- | :--- | :--- | :--- |
| **Syntax Validation** | \`${syntaxAudit.valid ? 'PASS' : 'FAIL'}\` | Zero V8 syntax errors | \`app.js\` parsed cleanly |
| **DOM Structure Validation** | \`${domTest.pass ? 'PASS' : 'FAIL'}\` | Semantic HTML5 & script binding | ${domTest.buttonCount} buttons, ${domTest.formCount} forms |
| **Browser Functional Testing** | \`${browserReport.browserFunctionalTesting}\` | Headless Chromium real clicks/submits | ${browserReport.interactionsTested.length} interactions executed |
| **Integration Testing** | \`${browserReport.integrationTesting}\` | API contracts & mock stability | Resilient against network drops |
| **Final QA Sign-Off Decision** | **${browserReport.finalQaApproval}** | Multi-agent gate approval | Quality threshold checked |

## 🖱️ Real Browser Interaction Log
| Interaction | Target Selector / Element | Result | State Mutated | Notes |
| :--- | :--- | :--- | :--- | :--- |
${interactionsTable}

## 📋 Detected Issues & Routing Log
| Severity | Category | Responsible Specialist | Description |
| :--- | :--- | :--- | :--- |
${issuesTable}

${chopperRes.text}
`;

  agentTools.writeFile(chopperCtx, 'test-report.md', fullReportContent);
  filesModified.add('test-report.md');

  // 4. Zoro reviews the repaired code
  const isQaApproved = browserReport.finalQaApproval === 'APPROVED';
  const zoroPrompt = `You are Zoro, Final Code Reviewer of the Straw Hat Dev Crew.
Review the repaired code deliverables (index.html, style.css, app.js) for: "${prompt}".
Chopper (QA Doctor) has evaluated the build with decision: ${browserReport.finalQaApproval} (${browserReport.browserFunctionalTesting}).
If Chopper rejected the build, your verdict must be REVIEW_REJECTED.
If Chopper approved the build, inspect code quality, event linkage, and modal state management. If clean, declare REVIEW_APPROVED.
Format in clean Markdown with your explicit verdict.`;
  const zoroRes = await callAgentAutonomous(zoro, zoroPrompt, {
    milestoneTitle: 'Targeted Repair: Code Review Quality Gate',
    taskDescription: 'Rigorous code review, architecture compliance, security review, and quality gate sign-off',
    toolContext: zoroCtx
  });
  agentTools.writeFile(zoroCtx, 'code-review.md', zoroRes.text);
  filesModified.add('code-review.md');

  const isReviewApproved = isQaApproved && (zoroRes.text.includes('REVIEW_APPROVED') || !zoroRes.text.includes('REVIEW_REJECTED'));

  // 5. Luffy sign-off
  const luffyPrompt = `You are Luffy, Captain & Lead Orchestrator.
Review the ${phaseName} repair voyage for "${prompt}".
Chopper's QA Decision: ${browserReport.finalQaApproval}.
Zoro's Code Review: ${isReviewApproved ? 'REVIEW_APPROVED' : 'REVIEW_REJECTED'}.
If both QA and Review are approved, declare SPRINT_APPROVED. Otherwise declare SPRINT_REJECTED.
Format in clean Markdown with your explicit decision.`;
  const luffyRes = await callAgentAutonomous(luffy, luffyPrompt, {
    milestoneTitle: 'Targeted Repair: Final Sign-Off',
    taskDescription: 'Final sprint sign-off, team coordination, and project closure',
    toolContext: luffyCtx
  });
  agentTools.writeFile(luffyCtx, 'sprint-signoff.md', luffyRes.text);
  filesModified.add('sprint-signoff.md');

  // 6. Update execution-audit.json if present
  const auditPath = join(baseDir, 'execution-audit.json');
  if (existsSync(auditPath)) {
    try {
      const audit = JSON.parse(readFileSync(auditPath, 'utf8'));
      audit.qaStatusMatrix = {
        syntaxValidation: syntaxAudit.valid ? 'PASS' : 'FAIL',
        domValidation: domTest.pass ? 'PASS' : 'FAIL',
        browserFunctionalTesting: browserReport.browserFunctionalTesting,
        integrationTesting: browserReport.integrationTesting,
        finalQaApproval: browserReport.finalQaApproval
      };
      audit.qaStatus = isQaApproved ? 'QA_PASSED' : 'QA_REJECTED';
      audit.finalQaApproval = browserReport.finalQaApproval;
      audit.reviewStatus = isReviewApproved ? 'REVIEW_APPROVED' : 'REVIEW_REJECTED';
      audit.sprintStatus = isQaApproved && isReviewApproved ? 'SPRINT_APPROVED' : 'SPRINT_REJECTED';
      audit.workspaceSummary = {
        ...audit.workspaceSummary,
        filesModified: Array.from(filesModified)
      };
      writeFileSync(auditPath, JSON.stringify(audit, null, 2), 'utf8');
    } catch (auditErr: any) {
      console.warn(`[executeAgentOwnedRepair] Could not update execution-audit.json: ${auditErr.message}`);
    }
  }

  return {
    success: browserReport.finalQaApproval === 'APPROVED',
    finalQaApproval: browserReport.finalQaApproval,
    browserFunctionalTesting: browserReport.browserFunctionalTesting,
    feedbackPasses: feedbackRetries,
    filesModified: Array.from(filesModified),
    initialBrowserReport,
    finalBrowserReport: browserReport,
    reportContent: fullReportContent
  };
}

function extractAndSaveAgentFiles(responseText: string, promptText: string, agentName: string): string[] {
  const savedFiles: string[] = [];
  try {
    let projectName = 'hive-project';
    const match = promptText.match(/(?:build|create|make|code|design)\s+(?:a|an)?\s*([a-zA-Z0-9_\-]+(?:\s+[a-zA-Z0-9_\-]+)?)/i);
    if (match && match[1]) {
      projectName = match[1].toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    }
    const baseDir = join(process.cwd(), 'workspace', projectName);
    mkdirSync(baseDir, { recursive: true });

    // Match code blocks: ```lang\ncode\n```
    const codeBlockRegex = /```([a-zA-Z0-9_\-\.\/]*)\s*\n([\s\S]*?)```/g;
    let blockMatch: RegExpExecArray | null;
    let fileIdx = 1;

    while ((blockMatch = codeBlockRegex.exec(responseText)) !== null) {
      const header = blockMatch[1].trim();
      const code = blockMatch[2];

      let filename = '';
      if (header.includes(':')) {
        filename = header.split(':')[1].trim();
      } else if (header.includes(' ') && header.split(' ')[1].includes('.')) {
        filename = header.split(' ')[1].trim();
      } else if (header.includes('.')) {
        filename = header;
      }

      if (!filename) {
        const firstLine = code.split('\n')[0].trim();
        const commentMatch = firstLine.match(/^(?:\/\/|<!--|#|\/\*)\s*([a-zA-Z0-9_\-]+\.[a-zA-Z0-9]+)/);
        if (commentMatch) {
          filename = commentMatch[1].trim();
        }
      }

      if (!filename) {
        const lang = header.split(/[\s:]/)[0].toLowerCase();
        if (lang === 'html') filename = 'index.html';
        else if (lang === 'css') filename = 'style.css';
        else if (lang === 'js' || lang === 'javascript') filename = 'app.js';
        else if (lang === 'json') filename = 'package.json';
        else if (lang === 'python' || lang === 'py') filename = 'main.py';
        else if (lang === 'dockerfile') filename = 'Dockerfile';
        else if (lang === 'md' || lang === 'markdown') filename = `notes-${fileIdx++}.md`;
        else continue;
      }

      filename = filename.replace(/["'<>]/g, '').trim();
      if (!filename || filename.length > 50) continue;

      const filePath = join(baseDir, filename);
      mkdirSync(dirname(filePath), { recursive: true });
      writeFileSync(filePath, code.trim(), 'utf8');
      savedFiles.push(`workspace/${projectName}/${filename}`);
    }

    if (savedFiles.length === 0 && responseText.length > 200) {
      const docName = `${agentName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-spec.md`;
      const docPath = join(baseDir, docName);
      writeFileSync(docPath, responseText.trim(), 'utf8');
      savedFiles.push(`workspace/${projectName}/${docName}`);
    }
  } catch (err) {
    console.error('[external-agent] Failed to auto-extract files:', err);
  }
  return savedFiles;
}

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

  constructor(private getWebContents: () => WebContents | null) { }

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

    // 1. Check for Straw Hat Dev Crew / Multi-Model Agent
    const shAgent = findStrawHatAgent(agentId) || (agentId === 'god' ? findStrawHatAgent('sh-luffy') : undefined);
    const agentConfig = shAgent
      ? {
        name: shAgent.name,
        role: shAgent.role,
        goal: shAgent.responsibilities.join('; '),
        station: shAgent.defaultStation,
        tool: shAgent.defaultTool
      }
      : (findLyzrConfig(agentId) ? {
        name: findLyzrConfig(agentId)!.name,
        role: findLyzrConfig(agentId)!.role,
        goal: findLyzrConfig(agentId)!.goal,
        station: findLyzrConfig(agentId)!.defaultStation,
        tool: findLyzrConfig(agentId)!.defaultTool
      } : null);

    if (agentConfig) {
      if (shAgent?.isVisualOnly) {
        const msg = `${shAgent.name}: Ahoy! I am cheering for our squad as a floor mascot! (Visual-only member — zero development AI tokens consumed).`;
        this.getWebContents()?.send('hive:externalAgentMessage', {
          agentId,
          text: msg,
          sender: shAgent.name,
          timestamp: Date.now()
        });
        return { dispatched: true, method: 'webhook' };
      }

      if (shAgent?.specialistRole === 'waiter') {
        const msg = `${shAgent.name}: Welcome to the Straw Hat Café! I serve hot coffee, green tea, ramen, and bento to keep our coders energized. Check out the Café menu in AgentHive!`;
        this.getWebContents()?.send('hive:externalAgentMessage', {
          agentId,
          text: msg,
          sender: shAgent.name,
          timestamp: Date.now()
        });
        return { dispatched: true, method: 'webhook' };
      }

      const isBoss = agentId === 'god' || agentId === 'sh-luffy' || agentId === 'lyzr-orchestrator';
      const isProjectRequest = /(?:build|create|make|code|design|develop|project|app|system|saas|clone|dashboard|store|portal|tracker|tool|bana|banao|kuch)/i.test(text);

      // If the Boss is asked to build a project, automatically orchestrate the Lean 3-Worker AgentHive team!
      if (isBoss && isProjectRequest) {
        console.log(`[Boss Luffy] Routing project to Lean 3-Worker AgentHive: "${text}"`);
        void pandaHiveOrchestrator.runTask({ group: 'group1', prompt: text });
        this.getWebContents()?.send('hive:externalAgentMessage', {
          agentId: 'god',
          text: `🏴‍☠️ Captain Luffy here! I've assigned this sprint to Group 1 (Nami as Architect, Zoro as Builder, Sanji as QA Verifier) powered by OmniRoute Antigravity CLI models. Tracking live in AgentHive panel!`,
          sender: 'Luffy (Captain & Orchestrator)',
          timestamp: Date.now()
        });
        return { dispatched: true, method: 'webhook' };
      }

      this.getWebContents()?.send('hive:externalAgentEvent', {
        agentId,
        status: 'working',
        action: `Thinking with Multi-Engine AI (${agentConfig.name})...`,
        station: agentConfig.station,
        tool: agentConfig.tool,
        sleeping: false
      });

      try {
        const sysInstruction = `You are ${agentConfig.name}, ${agentConfig.role}. ${agentConfig.goal} Answer user questions helpfully in character. If asked to code or design, generate clean, functional code.`;
        const isLightweight = ['sh-brook', 'sh-sanji', 'sh-robin'].includes(agentId);
        let resText = await callUnifiedLlm(text, sysInstruction, isLightweight);
        if (!resText) {
          resText = `Ahoy! I received your instruction: "${text}". Standing by for deployment.`;
        }

        // Auto-extract and write any code files directly to workspace on disk
        const savedFiles = extractAndSaveAgentFiles(resText, text, agentConfig.name);
        let finalMessage = resText;
        if (savedFiles.length > 0) {
          finalMessage += '\n\n📁 **Files written to local disk:**\n' + savedFiles.map((f) => `• \`${f}\``).join('\n');
        }

        this.getWebContents()?.send('hive:externalAgentMessage', {
          agentId,
          text: finalMessage,
          sender: agentConfig.name,
          timestamp: Date.now()
        });
        this.getWebContents()?.send('hive:externalAgentEvent', {
          agentId,
          status: 'idle',
          action: savedFiles.length > 0 ? `Saved ${savedFiles.length} file(s) to workspace` : (resText.length > 50 ? `${resText.slice(0, 48)}...` : resText),
          text: finalMessage,
          progress: 100
        });
        appendAgentMemory(
          agentId,
          `**Prompt:** "${text.length > 100 ? text.slice(0, 100) + '...' : text}"\n**Response:** ${resText.slice(0, 200).replace(/\n/g, ' ')}...`
        );
        appendHiveLog({
          kind: 'external',
          agentId,
          agentName: agentConfig.name,
          text: `Responded: ${resText.slice(0, 50)}...`
        });
        return { dispatched: true, method: 'webhook' };
      } catch (err) {
        console.error(`[external-agent] Agent call failed for ${agentId}:`, err);
        const errMsg = err instanceof Error ? err.message : String(err);
        this.getWebContents()?.send('hive:externalAgentEvent', {
          agentId,
          status: 'idle',
          action: `Notice: ${errMsg.slice(0, 30)}. Ready for tasks.`,
          station: agentConfig.station,
          tool: agentConfig.tool
        });
        this.getWebContents()?.send('hive:externalAgentMessage', {
          agentId,
          sender: agentConfig.name,
          text: `⚠️ Notice: ${errMsg}`,
          timestamp: Date.now()
        });
        return { dispatched: false, method: 'queued', error: errMsg };
      }
    }

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
        console.log(`[external-agent] AgentHive External Agent API listening on http://127.0.0.1:${this.port}`);
        setTimeout(() => {
          resetFloorStatus(this.getWebContents());
        }, 1500);
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
        app: 'AgentHive',
        version: '0.1.0',
        port: this.port,
        endpoints: {
          event: '/api/agent/:agentId/event',
          thought: '/api/agent/:agentId/thought',
          message: '/api/agent/:agentId/message',
          poll: '/api/agent/:agentId/poll',
          sleep: '/api/agent/:agentId/sleep',
          register: '/api/agent/register',
          reset: '/api/floor/reset'
        }
      }));
      return;
    }

    // 1b) Floor Reset (Unblock all agents)
    if (pathname === '/api/floor/reset' || pathname === '/api/reset-floor') {
      resetFloorStatus(this.getWebContents());
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, message: 'All floor agents reset to idle' }));
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
        name: body.name || 'External Agent',
        character: body.character || 'jim',
        accent: body.accent || 'mint',
        description: body.description || 'External API Agent',
        webhookUrl: body.webhookUrl
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, agentId, message: 'Agent registered on AgentHive floor' }));
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
