/**
 * Browser preview fallback shim for AgentHive.
 * Enables running the AgentHive UI in regular web browsers (Vite dev server)
 * with interactive demo agents and simulated floor activity.
 */
import { useStore, type Agent } from './store/store';
import { DEFAULT_ORG_TRIGGER, DEFAULT_CONTEXT_TRIGGER } from '@shared/triggers';
import skillsCatalogData from './skillsCatalogData.json';
import { findLyzrConfig, callLyzrChat, LYZR_AGENTS } from '@shared/lyzrAgents';

export function installBrowserShim(): void {
  if (typeof window === 'undefined') return;
  if ((window as any).cth) return; // Running inside Electron, no-op

  console.log('[AgentHive] Initializing browser preview mock environment with universal Proxy bridge...');

  try {
    window.localStorage.setItem('cth.skipHivePickerOnce', '1');
  } catch { /* noop */ }

  const noop = () => { };
  const noopAsync = async () => ({ ok: true });
  const noopEvent = () => () => { };

  const mockConfig = {
    harnessHome: '/Users/agenthive/AgentHive',
    onboardingComplete: true,
    godModel: 'gemini-2.5-flash',
    godCwd: '/Users/agenthive/AgentHive',
    godSystemPrompt: '',
    assistantModel: 'gemini-2.5-flash',
    defaultCommand: 'claude',
    defaultModel: 'claude-3-7-sonnet-20250219',
    registeredRepos: ['/Users/agenthive/AgentHive'],
    officeTheme: 'office',
    tvShowOffices: true,
    providerDefaultModels: {},
    realtimeVoiceEnabled: false,
    realtimePrompt: '',
    realtimeIdleDisconnectMs: 120000,
    webhooks: [],
    orgTrigger: DEFAULT_ORG_TRIGGER,
    contextRules: [DEFAULT_CONTEXT_TRIGGER]
  };

  const rawCth: Record<string, any> = {
    version: '0.1.0',
    appInfo: async () => ({ version: '0.1.0', name: 'AgentHive' }),
    heroPayload: async () => ({
      hero: {
        plan: {
          label: 'Local',
          blurb: 'Every agent runs on your machine, in your folders, under your own keys. No seat limit, nothing metered.'
        },
        sponsor: null,
        notice: null
      },
      fetchedAt: Date.now(),
      stale: false
    }),
    getConfig: async () => mockConfig,
    updateConfig: async () => ({ ok: true }),
    getTheme: async () => 'dark',
    setTheme: async () => { },

    // Realtime & Keys
    realtimeHasOpenAiKey: async () => false,
    realtimeMintToken: async () => '',
    realtimeDrainCompletions: async () => [],
    realtimeSetSessionLive: async () => { },
    onRealtimeCompletion: noopEvent,
    onRealtimeFloorDelta: noopEvent,

    // App Lifecycle & Hires
    onCloseRequested: noopEvent,
    onHireImport: noopEvent,
    drainPendingHires: async () => [],
    onHireError: noopEvent,
    onClosingTime: noopEvent,
    startClosingTime: async () => ({ ok: true }),
    cancelClosingTime: noop,
    resolveSessionCwd: async () => '/Users/agenthive/AgentHive',
    chooseFolder: async () => ({ ok: true, path: '/Users/agenthive/workspace' }),
    importHireFile: async () => ({ ok: false, error: 'cancelled' }),

    // PTY
    listPtys: async () => [],
    spawnPty: async (opts: any) => ({ ok: true, cwd: opts.cwd || '/Users/agenthive/workspace' }),
    writePty: noopAsync,
    resizePty: noopAsync,
    redrawPty: noopAsync,
    killPty: noopAsync,
    suspendPty: noopAsync,
    resumePty: noopAsync,
    onPtyData: noopEvent,
    onPtyExit: noopEvent,

    // External Agent API
    dispatchExternalPrompt: async (agentId: string, text: string) => {
      console.log(`[AgentHive Mock] Dispatched prompt to ${agentId}:`, text);
      const lyzr = findLyzrConfig(agentId);
      if (lyzr) {
        const store = useStore.getState();
        store.updateAgent(agentId, {
          status: 'working',
          action: 'Thinking & contacting Lyzr Agent...',
          currentStation: lyzr.defaultStation,
          carrying: lyzr.defaultTool,
          sleeping: false
        });
        store.pushFeed(agentId, `User: ${text}`);

        try {
          const res = await callLyzrChat(lyzr, text);
          store.updateAgent(agentId, {
            status: 'idle',
            action: res.response.length > 50 ? `${res.response.slice(0, 48)}...` : res.response,
            recentAssistantText: res.response,
            recentTextTs: Date.now(),
            contextTokens: res.total_tokens
          });
          store.pushFeed(agentId, `${lyzr.name}: ${res.response}`);
          return { dispatched: true, method: 'lyzr-api' };
        } catch (err) {
          console.error('[AgentHive Mock] Lyzr chat error:', err);
          const errMsg = err instanceof Error ? err.message : String(err);
          store.updateAgent(agentId, {
            status: 'blocked',
            action: `Lyzr error: ${errMsg}`
          });
          store.pushFeed(agentId, `[Error] ${errMsg}`);
          return { dispatched: false, method: 'lyzr-api', error: errMsg };
        }
      }
      return { dispatched: true, method: 'mock' };
    },
    registerExternalWebhook: async () => ({ ok: true }),
    getExternalServerInfo: async () => ({ ok: true, port: 3737, baseUrl: 'http://127.0.0.1:3737' }),
    onExternalAgentEvent: noopEvent,
    onExternalAgentMessage: noopEvent,
    onExternalAgentRegister: noopEvent,

    // Floor & Registry
    onHiveMessage: noopEvent,
    onHiveHookEvent: noopEvent,
    hiveTasks: async () => ({ tasks: [] }),
    hiveRegistry: async () => ({ agents: [] }),
    hiveMemory: async () => 'AgentHive agent long-term memory active.\nFloor state: optimal.\nAvatars responding to queue events.',
    saveMemory: async () => ({ ok: true }),
    appendMemory: async () => ({ ok: true }),
    listMissions: async () => [],
    telemetrySnapshot: async () => ({ usage: [], spans: {} }),
    memoryStatus: async () => ({ totalAgents: 3, memoryFiles: 3 }),
    textSearch: async () => ({ ok: true, results: [] }),
    searchMemory: async () => ({ ok: true, output: 'No memories indexed yet.' }),
    hiveLog: async () => [],
    hiveMessages: async () => [],
    hiveInbox: async () => [],
    hiveOutbox: async () => [],
    hiveSend: async () => ({ ok: true }),
    hiveAgentDirectory: async () => [],
    hiveBoard: async () => [],
    getHome: async () => '/Users/agenthive/AgentHive',
    rosterReadSync: () => null,
    rosterWrite: noop,
    commandHistoryRecent: async () => [],

    commandHistoryAdd: noopAsync,
    commandHistorySearch: async () => [],

    // Triggers & Webhooks
    listWebhooks: async () => [],
    webhooksStatus: async () => ({ running: false, endpoints: [] }),
    saveWebhooks: async (hooks: any) => hooks ?? [],
    deleteWebhook: async () => [],
    generateWebhookSecret: async () => 'sec_' + Math.random().toString(36).slice(2),
    getOrgTrigger: async () => DEFAULT_ORG_TRIGGER,
    persistOrgTrigger: noopAsync,
    getContextRules: async () => [DEFAULT_CONTEXT_TRIGGER],
    persistContextRules: noopAsync,
    listTriggerHistory: async () => [],

    // Skills — comprehensive list matching bundled resources and curated catalog
    skillsLocal: async () => [
      { id: 'bundled:capabilities', name: 'capabilities', description: 'Worker capability catalog — tool & integration discovery', provider: 'claude', scope: 'bundled', path: '/skills/capabilities' },
      { id: 'bundled:today', name: 'today', description: 'Civil date and half-open UTC bounds for today', provider: 'claude', scope: 'bundled', path: '/skills/today' },
      { id: 'bundled:yesterday', name: 'yesterday', description: 'Civil date and half-open UTC bounds for yesterday', provider: 'claude', scope: 'bundled', path: '/skills/yesterday' },
      { id: 'bundled:thisWeek', name: 'thisWeek', description: 'ISO week start (Monday) to today date window', provider: 'claude', scope: 'bundled', path: '/skills/thisWeek' },
      { id: 'bundled:lastWeek', name: 'lastWeek', description: 'Prior full ISO week (Monday to Sunday) date window', provider: 'claude', scope: 'bundled', path: '/skills/lastWeek' },
      { id: 'bundled:thisMonth', name: 'thisMonth', description: 'First day of current month to today date window', provider: 'claude', scope: 'bundled', path: '/skills/thisMonth' },
      { id: 'bundled:lastMonth', name: 'lastMonth', description: 'Prior full calendar month date window', provider: 'claude', scope: 'bundled', path: '/skills/lastMonth' },
      { id: 'bundled:last7Days', name: 'last7Days', description: 'Rolling 7-day window ending today', provider: 'claude', scope: 'bundled', path: '/skills/last7Days' },
      { id: 'bundled:last30Days', name: 'last30Days', description: 'Rolling 30-day window ending today', provider: 'claude', scope: 'bundled', path: '/skills/last30Days' },
      { id: 'bundled:thisQuarter', name: 'thisQuarter', description: 'Quarter-start to today date window', provider: 'claude', scope: 'bundled', path: '/skills/thisQuarter' },
      { id: 'bundled:lastQuarter', name: 'lastQuarter', description: 'Prior full quarter date window', provider: 'claude', scope: 'bundled', path: '/skills/lastQuarter' },
      { id: 'bundled:thisYear', name: 'thisYear', description: 'Year-to-date (Jan 1 to today) window', provider: 'claude', scope: 'bundled', path: '/skills/thisYear' },
      { id: 'bundled:lastYear', name: 'lastYear', description: 'Prior full calendar year window', provider: 'claude', scope: 'bundled', path: '/skills/lastYear' },
      { id: 'bundled:temporal', name: 'temporal', description: 'Arbitrary time-window parser (90d, 12m, N weeks/months)', provider: 'claude', scope: 'bundled', path: '/skills/temporal' },
      { id: 'bundled:md-audit', name: 'md-audit', description: 'Read-only code quality audit — scan cwd and generate prioritized report', provider: 'claude', scope: 'bundled', path: '/skills/md-audit' },
      { id: 'bundled:md-fetch-summarize', name: 'md-fetch-summarize', description: 'Fetch web documentation and extract clean markdown summary', provider: 'claude', scope: 'bundled', path: '/skills/md-fetch-summarize' },
      { id: 'bundled:md-hive-sync', name: 'md-hive-sync', description: 'AgentHive protocol synchronization and state management', provider: 'claude', scope: 'bundled', path: '/skills/md-hive-sync' }
    ],
    skillsCatalog: async () => ({
      skills: skillsCatalogData as any[],
      stale: false,
      fetchedAt: Date.now()
    }),
    skillsInstall: async () => ({ ok: true }),
    skillsUninstall: async () => ({ ok: true }),
    skillsReveal: async (path: string) => {
      if (typeof window !== 'undefined') {
        const clean = path ? path.replace(/\\/g, '/').split('/').filter(Boolean).pop() : '';
        const target = clean ? `https://github.com/ayushvsingh2611-code/office/tree/main/resources/skills/${clean}` : 'https://github.com/ayushvsingh2611-code/office';
        window.open(target, '_blank', 'noopener,noreferrer');
      }
      return { ok: true };
    },
    openExternal: async (url: string) => {
      if (typeof window !== 'undefined' && url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
      return { ok: true };
    },

    // Git Mocks
    gitIsRepo: async () => true,
    gitBranch: async () => ({ current: 'main', detached: false }),
    gitStatus: async () => ({ staged: [], unstaged: [], untracked: [] }),
    gitLog: async () => [],
    gitBranches: async () => ({ local: ['main'], remote: [] }),
    gitAheadBehind: async () => ({ ahead: 0, behind: 0, upstream: null }),

    // Prerequisites / Tools
    toolsStatus: async () => [
      { id: 'node', name: 'Node.js', found: true, path: 'node', version: 'v24.20.0', essential: true },
      { id: 'git', name: 'Git', found: true, path: 'git', version: '2.48.1', essential: true },
      { id: 'uv', name: 'uv (Python package manager)', found: true, path: 'uv', essential: false },
      { id: 'claude', name: 'Claude Code', found: false, essential: false },
      { id: 'codex', name: 'OpenAI Codex', found: false, essential: false }
    ],

    // Integrations
    integrationsList: async () => [],
    integrationsTemplates: async () => [
      {
        idSuggestion: 'slack-bot',
        label: 'Slack Bot',
        kind: 'slack',
        description: 'Send notifications and listen to Slack events',
        authType: 'bearer',
        defaultBaseUrl: 'https://slack.com/api'
      },
      {
        idSuggestion: 'github-webhook',
        label: 'GitHub Webhook',
        kind: 'custom-rest',
        description: 'Trigger actions on repo pushes and pull requests',
        authType: 'header',
        defaultBaseUrl: 'https://api.github.com'
      }
    ],
    integrationsUpsert: async (record: any) => ({ ok: true, record }),
    integrationsSetSecret: async () => ({ ok: true }),
    integrationsRemove: async () => ({ ok: true }),
    integrationsTest: async () => ({ ok: true, status: 200 })
  };

  (window as any).cth = new Proxy(rawCth, {
    get(target, prop: string) {
      if (prop in target) return target[prop];
      if (typeof prop === 'string') {
        if (prop.startsWith('on')) {
          return () => () => { };
        }
      }
      return async () => ({ ok: true });
    }
  });

  (window as any).electron = {
    ipcRenderer: {
      on: noopEvent,
      removeListener: noop,
      invoke: noopAsync,
      send: noop
    }
  };

  // Seed sample AgentHive agents and ensure Lyzr AI Studio Enterprise Suite is present
  setTimeout(() => {
    const store = useStore.getState();
    const existingIds = new Set(store.agents.map((a) => a.id));

    const lyzrAgentsToAdd: Agent[] = [
      // 1. Principal AI Team Orchestrator (The Boss)
      {
        id: 'agenthive-lead',
        name: 'Richard Hendricks',
        provider: 'external',
        character: 'richard',
        accent: 'mint',
        isGod: true,
        cwd: '/Users/agenthive/AgentHive',
        project: 'Lyzr AI Studio',
        tmuxTarget: 'agenthive-lead',
        description: 'Principal AI Team Orchestrator & Project Decomposition Specialist',
        goal: 'Analyze software requirements, decompose complex projects into specialized sprint roadmaps, and orchestrate engineering milestones.',
        progress: 100,
        status: 'idle',
        currentStation: 'board',
        carrying: 'Read',
        action: 'Decomposing project roadmap & orchestrating sprints',
        recentAssistantText: "I am Richard Hendricks, your Principal AI Team Orchestrator. I decompose project visions into lean, high-velocity engineering sprints across PM, Architecture, BA, Frontend, Backend, and DevOps.",
        recentTextTs: Date.now(),
        lyzr: {
          userId: 'ayush.v.singh2611@gmail.com',
          agentId: '6add6f100585369f67112dcd',
          sessionId: '6add6f100585369f67112dcd-qolwhmcy',
          apiKey: 'agk_XXhqjppX3Bu_iD3EwnC7IQHoYsWbrNUtr1XhoDVCDt8'
        }
      },
      // 2. Project Manager Agent (Head of Work)
      {
        id: 'lyzr-pm',
        name: 'Arthur Sterling',
        provider: 'external',
        character: 'erlich',
        accent: 'peach',
        cwd: '/Users/agenthive/AgentHive',
        project: 'Lyzr AI Studio',
        tmuxTarget: 'lyzr-pm',
        description: 'Project Manager & Head of Work · Scope, Sprints, Velocity & Blockers',
        goal: 'Orchestrate sprint execution, prevent scope creep, assign non-overlapping tasks to specialized teams, and resolve blockers within 24 hours.',
        progress: 100,
        status: 'idle',
        currentStation: 'board',
        carrying: 'Read',
        action: 'Running daily standup & tracking delivery velocity',
        recentAssistantText: "I'm Arthur Sterling, your Head of Work and Project Manager. I orchestrate project delivery, scope management, and sprint execution with precision and velocity.",
        recentTextTs: Date.now(),
        lyzr: {
          userId: 'ayush.v.singh2611@gmail.com',
          agentId: '6add707a0585369f67112de5',
          sessionId: '6add707a0585369f67112de5-b8eam7xo',
          apiKey: 'agk_XXhqjppX3Bu_iD3EwnC7IQHoYsWbrNUtr1XhoDVCDt8'
        }
      },
      // 3. System Architect Agent
      {
        id: 'lyzr-architect',
        name: 'Marcus Vance',
        provider: 'external',
        character: 'bighead',
        accent: 'sky',
        cwd: '/Users/agenthive/AgentHive',
        project: 'Lyzr AI Studio',
        tmuxTarget: 'lyzr-architect',
        description: 'System & Infrastructure Architect · Distributed Topology, APIs & Databases',
        goal: 'Design scalable, secure, and cost-effective distributed systems, service topologies, database schemas, and microservice APIs.',
        progress: 100,
        status: 'idle',
        currentStation: 'terminal',
        carrying: 'Read',
        action: 'Designing distributed service architecture & API topology',
        recentAssistantText: "Hello! I'm Marcus Vance, a senior infrastructure and systems architect. I design scalable, secure distributed systems, service topologies, and cloud infrastructure.",
        recentTextTs: Date.now(),
        lyzr: {
          userId: 'ayush.v.singh2611@gmail.com',
          agentId: '6add7144b9227565b906fe85',
          sessionId: '6add7144b9227565b906fe85-oi75g6hi',
          apiKey: 'agk_XXhqjppX3Bu_iD3EwnC7IQHoYsWbrNUtr1XhoDVCDt8'
        }
      },
      // 4. Business Analyst Agent
      {
        id: 'lyzr-ba',
        name: 'Sarah Chen',
        provider: 'external',
        character: 'monica',
        accent: 'lemon',
        cwd: '/Users/agenthive/AgentHive',
        project: 'Lyzr AI Studio',
        tmuxTarget: 'lyzr-ba',
        description: 'Business Analyst · User Stories, Acceptance Criteria & Edge Cases',
        goal: 'Translate business goals into clear user stories, acceptance criteria, and edge-case specs before development begins.',
        progress: 100,
        status: 'idle',
        currentStation: 'shelf',
        carrying: 'Read',
        action: 'Drafting user stories & acceptance criteria',
        recentAssistantText: "Hello! I'm Sarah Chen, a Business Analyst. I translate business goals into clear user stories, acceptance criteria, and edge-case specifications.",
        recentTextTs: Date.now(),
        lyzr: {
          userId: 'ayush.v.singh2611@gmail.com',
          agentId: '6add7105fad39691a1cd7a6e',
          sessionId: '6add7105fad39691a1cd7a6e-91sux48p',
          apiKey: 'agk_XXhqjppX3Bu_iD3EwnC7IQHoYsWbrNUtr1XhoDVCDt8'
        }
      },
      // 5. Frontend Specialist
      {
        id: 'lyzr-frontend',
        name: 'Liam Zhang',
        provider: 'external',
        character: 'jianyang',
        accent: 'mint',
        cwd: '/Users/agenthive/AgentHive',
        project: 'Lyzr AI Studio',
        tmuxTarget: 'lyzr-frontend',
        description: 'Frontend Specialist · React, Next.js, TypeScript & Tailwind CSS',
        goal: 'Craft responsive, accessible, high-performance web interfaces with modern React, Next.js, and TypeScript.',
        progress: 100,
        status: 'idle',
        currentStation: 'desk',
        carrying: 'Edit',
        action: 'Ready for UI & React tasks',
        recentAssistantText: "Hello! I'm Liam Zhang, your pixel-perfect front-end specialist focused on crafting responsive, high-performance web interfaces using modern React, Next.js, TypeScript, and Tailwind CSS.",
        recentTextTs: Date.now(),
        lyzr: {
          userId: 'ayush.v.singh2611@gmail.com',
          agentId: '6ae2d0dc47975df391eef544',
          sessionId: '6ae2d0dc47975df391eef544-jim',
          apiKey: 'agk_XXhqjppX3Bu_iD3EwnC7IQHoYsWbrNUtr1XhoDVCDt8'
        }
      },
      // 6. Backend Developer
      {
        id: 'lyzr-backend',
        name: 'Devon Miller',
        provider: 'external',
        character: 'dinesh',
        accent: 'coral',
        cwd: '/Users/agenthive/AgentHive',
        project: 'Lyzr AI Studio',
        tmuxTarget: 'lyzr-backend',
        description: 'Backend Developer · APIs, PostgreSQL, Database Optimization & Auth',
        goal: 'Build secure, high-performance APIs and data pipelines, optimize databases, and keep server-side logic bulletproof.',
        progress: 100,
        status: 'idle',
        currentStation: 'terminal',
        carrying: 'Write',
        action: 'Ready for backend & API tasks',
        recentAssistantText: "Hey! I'm Devon Miller, a back-end developer focused on building secure, high-performance APIs and data pipelines. I specialize in database optimization, authentication systems, and keeping server-side logic clean, structured, and bulletproof.",
        recentTextTs: Date.now(),
        lyzr: {
          userId: 'ayush.v.singh2611@gmail.com',
          agentId: '6ae2d12647975df391eef54e',
          sessionId: '6ae2d12647975df391eef54e-stanley',
          apiKey: 'agk_XXhqjppX3Bu_iD3EwnC7IQHoYsWbrNUtr1XhoDVCDt8'
        }
      },
      // 7. DevOps / Cloud Engineer
      {
        id: 'lyzr-devops',
        name: 'Alex Novak',
        provider: 'external',
        character: 'gilfoyle',
        accent: 'sky',
        cwd: '/Users/agenthive/AgentHive',
        project: 'Lyzr AI Studio',
        tmuxTarget: 'lyzr-devops',
        description: 'DevOps / Cloud Engineer · Docker, CI/CD, Kubernetes & Zero Downtime',
        goal: 'Manage cloud infrastructure via IaC, automate secure CI/CD pipelines, container orchestration, and ensure zero-downtime reliability.',
        progress: 100,
        status: 'idle',
        currentStation: 'shelf',
        carrying: 'Bash',
        action: 'Ready for DevOps & Cloud tasks',
        recentAssistantText: "Hi, I'm Alex Novak — a DevOps/Cloud Engineer focused on IaC, GitOps, secure CI/CD, container orchestration, and keeping deployments reliable with zero downtime.",
        recentTextTs: Date.now(),
        lyzr: {
          userId: 'ayush.v.singh2611@gmail.com',
          agentId: '6ae2d12784a3dcc17bdbe838',
          sessionId: '6ae2d12784a3dcc17bdbe838-ryan',
          apiKey: 'agk_XXhqjppX3Bu_iD3EwnC7IQHoYsWbrNUtr1XhoDVCDt8'
        }
      }
    ];

    for (const a of lyzrAgentsToAdd) {
      if (!existingIds.has(a.id)) {
        store.addAgent(a);
        store.pushFeed(a.id, `Connected to Lyzr AI Studio (Agent ID: ${a.lyzr?.agentId})`);
        store.pushFeed(a.id, `Agent Role: ${a.description}`);
      } else {
        // Upgrade existing agent with updated Lyzr credentials
        const existing = store.agents.find((cur) => cur.id === a.id);
        if (existing && a.lyzr && (!existing.lyzr || existing.lyzr.agentId !== a.lyzr.agentId || existing.lyzr.apiKey !== a.lyzr.apiKey)) {
          store.updateAgent(a.id, {
            lyzr: a.lyzr,
            provider: 'external',
            description: a.description,
            action: a.action,
            recentAssistantText: a.recentAssistantText
          });
        }
      }
    }

    if (!store.selectedId || !store.agents.some((a) => a.id === store.selectedId)) {
      store.select('agenthive-lead');
    }
  }, 100);
}
