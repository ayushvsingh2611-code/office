/**
 * Browser preview fallback shim for Panda Hive.
 * Enables running the Panda Hive UI in regular web browsers (Vite dev server)
 * with interactive demo agents and simulated floor activity.
 */
import { useStore, type Agent } from './store/store';
import { DEFAULT_ORG_TRIGGER, DEFAULT_CONTEXT_TRIGGER } from '@shared/triggers';

export function installBrowserShim(): void {
  if (typeof window === 'undefined') return;
  if ((window as any).cth) return; // Running inside Electron, no-op

  console.log('[Panda Hive] Initializing browser preview mock environment with universal Proxy bridge...');

  try {
    window.localStorage.setItem('cth.skipHivePickerOnce', '1');
  } catch { /* noop */ }

  const noop = () => {};
  const noopAsync = async () => ({ ok: true });
  const noopEvent = () => () => {};

  const mockConfig = {
    harnessHome: '/Users/panda/PandaHive',
    onboardingComplete: true,
    godModel: 'gemini-2.5-flash',
    godCwd: '/Users/panda/PandaHive',
    godSystemPrompt: '',
    assistantModel: 'gemini-2.5-flash',
    defaultCommand: 'claude',
    defaultModel: 'claude-3-7-sonnet-20250219',
    registeredRepos: ['/Users/panda/PandaHive'],
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
    appInfo: async () => ({ version: '0.1.0', name: 'Panda Hive' }),
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
    setTheme: async () => {},

    // Realtime & Keys
    realtimeHasOpenAiKey: async () => false,
    realtimeMintToken: async () => '',
    realtimeDrainCompletions: async () => [],
    realtimeSetSessionLive: async () => {},
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
    resolveSessionCwd: async () => '/Users/panda/PandaHive',
    chooseFolder: async () => ({ ok: true, path: '/Users/panda/workspace' }),
    importHireFile: async () => ({ ok: false, error: 'cancelled' }),

    // PTY
    listPtys: async () => [],
    spawnPty: async (opts: any) => ({ ok: true, cwd: opts.cwd || '/Users/panda/workspace' }),
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
      console.log(`[Panda Hive Mock] Dispatched prompt to ${agentId}:`, text);
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
    hiveMemory: async () => ({}),
    listMissions: async () => [],
    telemetrySnapshot: async () => ({ usage: [], spans: {} }),
    memoryStatus: async () => ({}),
    textSearch: async () => [],
    searchMemory: async () => [],
    hiveLog: async () => [],
    hiveMessages: async () => [],
    hiveAgentDirectory: async () => [],
    hiveBoard: async () => [],
    getHome: async () => '/Users/panda/PandaHive',
    rosterReadSync: () => null,
    rosterWrite: noop,
    commandHistoryRecent: async () => [],
    commandHistoryAdd: noopAsync,
    commandHistorySearch: async () => [],

    // Git Mocks
    gitIsRepo: async () => true,
    gitBranch: async () => ({ current: 'main', detached: false }),
    gitStatus: async () => ({ staged: [], unstaged: [], untracked: [] }),
    gitLog: async () => [],
    gitBranches: async () => ({ local: ['main'], remote: [] }),
    gitAheadBehind: async () => ({ ahead: 0, behind: 0, upstream: null })
  };

  (window as any).cth = new Proxy(rawCth, {
    get(target, prop: string) {
      if (prop in target) return target[prop];
      if (typeof prop === 'string') {
        if (prop.startsWith('on')) {
          return () => () => {};
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

  // Seed sample Panda Hive agents if store is empty
  setTimeout(() => {
    const store = useStore.getState();
    if (store.agents.length === 0) {
      const demoAgents: Agent[] = [
        {
          id: 'panda-lead',
          name: 'Bamboo Captain',
          character: 'jim',
          accent: 'mint',
          cwd: '/Users/panda/PandaHive',
          project: 'PandaHive',
          tmuxTarget: 'panda-lead',
          description: 'Harness supervisor and coordinator',
          progress: 0,
          status: 'idle',
          currentStation: 'desk',
          action: 'Monitoring Bamboo Office floor',
          recentAssistantText: 'Welcome to Panda Hive! Connect any AI agent via port 3737.',
          recentTextTs: Date.now()
        },
        {
          id: 'external-agent-1',
          name: 'Python Agent',
          provider: 'external',
          character: 'dwight',
          accent: 'sky',
          cwd: '/Users/panda/PandaHive',
          project: 'PandaHive',
          tmuxTarget: 'ext-agent-1',
          description: 'Connected via HTTP REST API (http://127.0.0.1:3737)',
          progress: 65,
          status: 'working',
          currentStation: 'shelf',
          carrying: 'Read',
          action: 'Fetching LangChain docs from library',
          recentAssistantText: 'Connected via HTTP REST API (http://127.0.0.1:3737)',
          recentTextTs: Date.now()
        },
        {
          id: 'panda-sleepy',
          name: 'Snoozing Panda',
          provider: 'external',
          character: 'stanley',
          accent: 'coral',
          cwd: '/Users/panda/PandaHive',
          project: 'PandaHive',
          tmuxTarget: 'panda-sleepy',
          description: 'API paused to conserve credits',
          progress: 100,
          status: 'idle',
          sleeping: true,
          sleepSince: Date.now() - 360000,
          currentStation: 'desk',
          action: 'Sleeping (zzz 😴) — API paused to save spend',
          recentAssistantText: 'Zzz... 😴 Sleeping soundly.',
          recentTextTs: Date.now()
        }
      ];

      for (const a of demoAgents) {
        store.addAgent(a);
      }
      store.pushFeed('panda-lead', '[Panda Hive] Ready for external agent connections on port 3737.');
      store.pushFeed('external-agent-1', 'Connected via HTTP REST API');
      store.pushFeed('external-agent-1', 'POST /api/agent/external-agent-1/event: shelf -> Read');
      store.pushFeed('panda-sleepy', '[Panda Hive] Auto-sleep activated to conserve tokens.');
      store.select('external-agent-1');
    }
  }, 100);
}
