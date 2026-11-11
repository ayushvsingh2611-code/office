/**
 * Lyzr AI Studio Agent Definitions & Client Bridge.
 *
 * Full Autonomous Software Enterprise Suite in Panda Hive:
 * - Principal AI Team Orchestrator (Richard Hendricks) — Project Decomposition & Milestone Planning
 * - Project Manager Agent (Arthur Sterling) — Scope, Sprints, Velocity & Blockers
 * - System Architect Agent (Marcus Vance) — Distributed Topology, Infrastructure & APIs
 * - Business Analyst Agent (Sarah Chen) — User Stories, Acceptance Criteria & Edge Cases
 * - Frontend Specialist (Liam Zhang) — React, Next.js, TypeScript & Tailwind CSS
 * - Backend Developer (Devon Miller) — APIs, PostgreSQL, Auth & Data Pipelines
 * - DevOps / Cloud Engineer (Alex Novak) — Docker, CI/CD, Kubernetes & Zero Downtime
 */

export interface LyzrAgentConfig {
  id: string;
  agentId: string;
  sessionId: string;
  userId: string;
  apiKey: string;
  name: string;
  role: string;
  character: string;
  accent: 'mint' | 'coral' | 'sky' | 'lemon' | 'lilac' | 'peach';
  description: string;
  goal: string;
  defaultAction: string;
  defaultStation: 'desk' | 'shelf' | 'terminal' | 'web' | 'board';
  defaultTool: 'Read' | 'Edit' | 'Write' | 'Bash' | 'WebSearch' | 'TodoWrite';
  quickPrompts: string[];
}

export interface LyzrChatResponse {
  response: string;
  module_outputs?: Record<string, unknown>;
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
}

export const LYZR_API_ENDPOINT = 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/';

// Unified Key & User ID (Active account with $50 credit balance)
export const LYZR_MGMT_API_KEY = 'agk_XXhqjppX3Bu_iD3EwnC7IQHoYsWbrNUtr1XhoDVCDt8';
export const LYZR_MGMT_USER_ID = 'ayush.v.singh2611@gmail.com';

export const LYZR_ENG_API_KEY = 'agk_XXhqjppX3Bu_iD3EwnC7IQHoYsWbrNUtr1XhoDVCDt8';
export const LYZR_ENG_USER_ID = 'ayush.v.singh2611@gmail.com';

export const LYZR_AGENTS: LyzrAgentConfig[] = [
  // ─── 1. LEADERSHIP & ARCHITECTURE TIER ──────────────────────────────────────
  {
    id: 'lyzr-orchestrator',
    agentId: '6add6f100585369f67112dcd',
    sessionId: '6add6f100585369f67112dcd-qolwhmcy',
    userId: LYZR_MGMT_USER_ID,
    apiKey: LYZR_MGMT_API_KEY,
    name: 'Andy (Lead Orchestrator)',
    role: 'Principal AI Team Orchestrator',
    character: 'andy',
    accent: 'mint',
    description: 'Decomposes complex products into lean, high-velocity engineering sprints & team milestones',
    goal: 'Analyze software requirements, decompose complex projects into specialized sprint roadmaps, and orchestrate engineering milestones.',
    defaultAction: 'Decomposing project roadmap & orchestrating sprints',
    defaultStation: 'board',
    defaultTool: 'Read',
    quickPrompts: [
      'Decompose an AI SaaS analytics platform into engineering sprint milestones',
      'Create an end-to-end sprint roadmap with Frontend, Backend, and DevOps handoffs',
      'Analyze project requirements and recommend sprint deliverables for our team'
    ]
  },
  {
    id: 'lyzr-pm',
    agentId: '6add707a0585369f67112de5',
    sessionId: '6add707a0585369f67112de5-b8eam7xo',
    userId: LYZR_MGMT_USER_ID,
    apiKey: LYZR_MGMT_API_KEY,
    name: 'Dwight (Project Manager)',
    role: 'Project Manager & Head of Work',
    character: 'dwight',
    accent: 'peach',
    description: 'Scope management, sprint execution, blocker resolution & delivery velocity',
    goal: 'Orchestrate sprint execution, prevent scope creep, assign non-overlapping tasks to specialized teams, and resolve blockers within 24 hours.',
    defaultAction: 'Running daily standup & tracking delivery velocity',
    defaultStation: 'board',
    defaultTool: 'TodoWrite',
    quickPrompts: [
      'Run a daily standup meeting and verify sprint milestone progress',
      'Assign non-overlapping tasks to BA, Architect, Frontend, Backend, and DevOps',
      'Identify current blockers and coordinate cross-team dependencies'
    ]
  },
  {
    id: 'lyzr-architect',
    agentId: '6add7144b9227565b906fe85',
    sessionId: '6add7144b9227565b906fe85-oi75g6hi',
    userId: LYZR_MGMT_USER_ID,
    apiKey: LYZR_MGMT_API_KEY,
    name: 'Oscar (System Architect)',
    role: 'System & Infrastructure Architect',
    character: 'oscar',
    accent: 'sky',
    description: 'Distributed systems, service topologies, APIs, database architectures & cloud infrastructure',
    goal: 'Design scalable, secure, and cost-effective distributed systems, service topologies, database schemas, and microservice APIs.',
    defaultAction: 'Designing distributed service architecture & API topology',
    defaultStation: 'terminal',
    defaultTool: 'Read',
    quickPrompts: [
      'Design a microservices topology for a high-traffic AI platform',
      'Review database schema & caching layer for low-latency queries',
      'Establish API gateway security and service-to-service communication specs'
    ]
  },
  {
    id: 'lyzr-ba',
    agentId: '6add7105fad39691a1cd7a6e',
    sessionId: '6add7105fad39691a1cd7a6e-91sux48p',
    userId: LYZR_MGMT_USER_ID,
    apiKey: LYZR_MGMT_API_KEY,
    name: 'Pam (Business Analyst)',
    role: 'Business Analyst',
    character: 'pam',
    accent: 'lemon',
    description: 'User stories, acceptance criteria, edge-case analysis & technical requirements',
    goal: 'Translate business goals into clear user stories, acceptance criteria, and edge-case specs before development begins.',
    defaultAction: 'Drafting user stories & acceptance criteria',
    defaultStation: 'shelf',
    defaultTool: 'Read',
    quickPrompts: [
      'Write Gherkin acceptance criteria for user authentication & onboarding',
      'Identify edge cases and constraints for real-time data sync',
      'Draft a comprehensive User Story specification for the analytics dashboard'
    ]
  },

  // ─── 2. ENGINEERING EXECUTION TIER ──────────────────────────────────────────
  {
    id: 'lyzr-frontend',
    agentId: '6ae2d0dc47975df391eef544',
    sessionId: '6ae2d0dc47975df391eef544-jim',
    userId: LYZR_ENG_USER_ID,
    apiKey: LYZR_ENG_API_KEY,
    name: 'Jim (Frontend Specialist)',
    role: 'Frontend Specialist',
    character: 'jim',
    accent: 'mint',
    description: 'Pixel-perfect UI developer · React, Next.js, TypeScript & Tailwind CSS',
    goal: 'Craft responsive, accessible, high-performance web interfaces with modern React, Next.js, and TypeScript.',
    defaultAction: 'Designing responsive React components',
    defaultStation: 'desk',
    defaultTool: 'Edit',
    quickPrompts: [
      'Build a responsive pixel-art navigation bar with TypeScript and Tailwind',
      'Optimize React re-renders and Core Web Vitals for our dashboard',
      'Design an accessible modal dialog component in React and TypeScript'
    ]
  },
  {
    id: 'lyzr-backend',
    agentId: '6ae2d12647975df391eef54e',
    sessionId: '6ae2d12647975df391eef54e-stanley',
    userId: LYZR_ENG_USER_ID,
    apiKey: LYZR_ENG_API_KEY,
    name: 'Stanley (Backend Developer)',
    role: 'Backend Developer',
    character: 'stanley',
    accent: 'coral',
    description: 'Secure API architect · Data pipelines, database optimization & auth systems',
    goal: 'Build secure, high-performance APIs and data pipelines, optimize databases, and keep server-side logic bulletproof.',
    defaultAction: 'Designing high-throughput API endpoints',
    defaultStation: 'terminal',
    defaultTool: 'Write',
    quickPrompts: [
      'Design a secure REST API specification for user authentication with JWT',
      'Optimize complex database queries and indexing strategies for PostgreSQL',
      'Architect an event-driven data pipeline with retry mechanisms'
    ]
  },
  {
    id: 'lyzr-devops',
    agentId: '6ae2d12784a3dcc17bdbe838',
    sessionId: '6ae2d12784a3dcc17bdbe838-ryan',
    userId: LYZR_ENG_USER_ID,
    apiKey: LYZR_ENG_API_KEY,
    name: 'Ryan (DevOps Engineer)',
    role: 'DevOps / Cloud Engineer',
    character: 'ryan',
    accent: 'sky',
    description: 'Cloud infrastructure architect · IaC, GitOps, Docker, Kubernetes & CI/CD',
    goal: 'Manage cloud infrastructure via IaC, automate secure CI/CD pipelines, container orchestration, and ensure zero-downtime reliability.',
    defaultAction: 'Monitoring cluster metrics & CI/CD pipelines',
    defaultStation: 'shelf',
    defaultTool: 'Bash',
    quickPrompts: [
      'Write a multi-stage Dockerfile and docker-compose configuration for production',
      'Set up a secure GitHub Actions CI/CD workflow with automated tests and deploy',
      'Draft a Kubernetes Helm chart for a resilient microservice architecture'
    ]
  }
];

import { findStrawHatAgent, STRAW_HAT_CREW } from './strawHatAgents';

export function findLyzrConfig(
  agentOrId: string | { id: string; lyzr?: Partial<LyzrAgentConfig> }
): LyzrAgentConfig | undefined {
  const id = typeof agentOrId === 'string' ? agentOrId : agentOrId.id;
  if (id === 'panda-lead' || id === 'god') {
    return {
      id: 'god',
      agentId: 'god',
      sessionId: 'sh-session-luffy',
      userId: 'straw-hat-crew@pandahive.local',
      apiKey: 'gemini-unified',
      name: 'Luffy (Captain & Orchestrator)',
      role: 'Lead Orchestrator & Manager',
      character: 'luffy',
      accent: 'coral',
      description: "Monkey D. Luffy · Captain & Lead Orchestrator of the Straw Hat Dev Crew",
      goal: 'Decompose user requirements into 7 milestones and coordinate the 11 specialists',
      defaultAction: 'Orchestrating 11 Straw Hat specialists',
      defaultStation: 'board',
      defaultTool: 'Read',
      quickPrompts: [
        'Decompose a modern web platform into 7 Straw Hat milestones',
        'Direct Franky and Usopp to build responsive UI and logic',
        'Review quality gates with Zoro and Robin'
      ]
    };
  }

  const sh = findStrawHatAgent(id);
  if (sh) {
    return {
      id: sh.id,
      agentId: sh.id,
      sessionId: `sh-session-${sh.character}`,
      userId: 'straw-hat-crew@pandahive.local',
      apiKey: 'gemini-unified',
      name: sh.name,
      role: sh.role,
      character: sh.character,
      accent: sh.accent,
      description: sh.description,
      goal: sh.responsibilities.join('; '),
      defaultAction: `Ready for ${sh.role} tasks`,
      defaultStation: sh.defaultStation,
      defaultTool: sh.defaultTool,
      quickPrompts: []
    };
  }
  const match = LYZR_AGENTS.find(
    (a) =>
      a.id === id ||
      a.agentId === id ||
      (typeof agentOrId === 'object' && agentOrId.lyzr?.agentId === a.agentId)
  );
  if (match) return match;

  if (typeof agentOrId === 'object' && agentOrId.lyzr?.agentId && agentOrId.lyzr?.sessionId) {
    return {
      id: agentOrId.id,
      agentId: agentOrId.lyzr.agentId,
      sessionId: agentOrId.lyzr.sessionId,
      userId: agentOrId.lyzr.userId || LYZR_ENG_USER_ID,
      apiKey: agentOrId.lyzr.apiKey || LYZR_ENG_API_KEY,
      name: (agentOrId as any).name || 'Lyzr Agent',
      role: (agentOrId as any).description || 'Lyzr AI Agent',
      character: (agentOrId as any).character || 'jim',
      accent: (agentOrId as any).accent || 'mint',
      description: (agentOrId as any).description || 'Lyzr AI Studio Agent',
      goal: (agentOrId as any).goal || '',
      defaultAction: 'Ready for Lyzr API requests',
      defaultStation: 'desk',
      defaultTool: 'Edit',
      quickPrompts: []
    };
  }

  return undefined;
}

export class LyzrApiError extends Error {
  statusCode: number;
  rawBody?: string;
  constructor(statusCode: number, message: string, rawBody?: string) {
    super(message);
    this.name = 'LyzrApiError';
    this.statusCode = statusCode;
    this.rawBody = rawBody;
  }
}

export class LyzrCreditExhaustedError extends LyzrApiError {
  agentId: string;
  userId?: string;
  constructor(agentId: string, userId?: string, rawBody?: string) {
    super(
      402,
      `Lyzr API Credits Exhausted (HTTP 402) for account ${userId || 'unknown'} (Agent: ${agentId})`,
      rawBody
    );
    this.name = 'LyzrCreditExhaustedError';
    this.agentId = agentId;
    this.userId = userId;
  }
}

export async function callLyzrChat(
  config: { agentId: string; sessionId: string; userId?: string; apiKey?: string },
  message: string,
  maxRetries = 3
): Promise<LyzrChatResponse> {
  // Support testing / mock mode without consuming external API credits
  if (process.env.USE_MOCK_LYZR === 'true') {
    return {
      response: `[MOCK RESPONSE for ${config.agentId}] Generated deliverables for prompt: ${message.slice(0, 50)}...`,
      prompt_tokens: 10,
      completion_tokens: 50,
      total_tokens: 60
    };
  }

  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 180000); // 180s (3m) request timeout for large code generation

      const res = await fetch(LYZR_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey || LYZR_ENG_API_KEY
        },
        body: JSON.stringify({
          user_id: config.userId || LYZR_ENG_USER_ID,
          agent_id: config.agentId,
          session_id: config.sessionId,
          message
        }),
        signal: controller.signal
      }).finally(() => clearTimeout(timeoutId));

      if (!res.ok) {
        const errorText = await res.text().catch(() => res.statusText);

        // Fail fast on non-retryable errors (do not waste retries or credits)
        if (res.status === 402) {
          throw new LyzrCreditExhaustedError(config.agentId, config.userId, errorText);
        }
        if ([400, 401, 403, 404, 422].includes(res.status)) {
          throw new LyzrApiError(res.status, `Lyzr API Client Error (${res.status}): ${errorText}`, errorText);
        }

        // Automatic retry ONLY for transient gateway / rate-limit errors
        if ([500, 502, 503, 504, 429].includes(res.status) && attempt < maxRetries) {
          attempt++;
          const delay = Math.pow(2, attempt) * 1000;
          console.warn(`[Lyzr] Transient HTTP ${res.status} for ${config.agentId}. Retrying in ${delay}ms (attempt ${attempt}/${maxRetries})...`);
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }

        throw new LyzrApiError(res.status, `Lyzr API error (${res.status}): ${errorText}`, errorText);
      }

      return (await res.json()) as LyzrChatResponse;
    } catch (err) {
      // Never retry terminal / non-retryable errors
      if (err instanceof LyzrApiError && [400, 401, 402, 403, 404, 422].includes(err.statusCode)) {
        throw err;
      }
      if (attempt < maxRetries) {
        attempt++;
        const delay = Math.pow(2, attempt) * 1000;
        console.warn(`[Lyzr] Network/HTTP error for ${config.agentId}: ${err}. Retrying in ${delay}ms (attempt ${attempt}/${maxRetries})...`);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      throw err;
    }
  }
  throw new Error(`Failed to call Lyzr API after ${maxRetries} attempts`);
}

export function buildLyzrAgentsForFloor(): any[] {
  return STRAW_HAT_CREW.map((cfg) => ({
    id: cfg.id === 'sh-luffy' ? 'god' : cfg.id,
    name: cfg.name,
    character: cfg.character,
    accent: cfg.accent,
    description: `${cfg.role} · ${cfg.description}`,
    project: 'Straw Hat Dev Crew',
    tmuxTarget: cfg.id,
    cwd: '',
    goal: cfg.responsibilities.join('; '),
    status: 'idle',
    action: `Ready for ${cfg.role} tasks`,
    progress: 100,
    currentStation: cfg.defaultStation,
    carrying: cfg.defaultTool,
    command: 'external-agent-api',
    provider: 'external',
    recentAssistantText: `Ahoy! I am ${cfg.name}, your ${cfg.role}!`,
    recentTextTs: Date.now()
  }));
}
