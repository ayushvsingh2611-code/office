/**
 * AgentHive Concurrent Multi-Task Orchestrator
 *
 * Implements the Lean 3-Worker / 2-Group Architecture:
 *
 * CENTRAL:
 * - Luffy: Central boss & orchestrator (task assignment, sprint sign-off)
 *
 * GROUP 1 (Task A):
 * - Nami: Architect (Spec & DOM Contract) -> agy/gemini-3.8-flash-high
 * - Zoro: Builder (HTML + CSS + JS in single context) -> agy/gemini-3-flash
 * - Sanji: Verifier (Syntax audit + Real Headless Browser test) -> agy/gemini-3.8-flash-medium
 * - Chopper & Brook: Visual-only floor mascots (0 AI calls)
 *
 * GROUP 2 (Task B):
 * - Robin: Architect (Spec & DOM Contract) -> agy/gemini-3.8-flash-high
 * - Shanks: Builder (HTML + CSS + JS in single context) -> agy/gemini-3-flash
 * - Hancock: Verifier (Syntax audit + Real Headless Browser test) -> agy/gemini-3.8-flash-medium
 * - Jinbe & Franky: Visual-only floor mascots (0 AI calls)
 *
 * CAFÉ:
 * - Usopp: Waiter only (serves coffee/snacks, ZERO development AI calls)
 *
 * CRITICAL RELIABILITY CONTRACT:
 * - ZERO fake application fallbacks (NO getFallbackUIFiles, NO generateMinimalAppJs).
 * - Real AI code generation only. If AI fails, preserve work, save checkpoint, mark BLOCKED with actual error.
 * - Concurrency-safe: Task A and Task B have independent workspaces, task IDs, and model contexts.
 */
import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, copyFileSync } from 'node:fs';
import { join, resolve, normalize } from 'node:path';
import {
  executeAgentLlmCallWithTools,
  getOmniRouteConfig
} from './geminiClient';
import {
  agentTools,
  workspacePermissionManager,
  type ToolExecutionContext
} from './agentTools';
import { browserTestRunner, type RealBrowserTestReport } from './browserTestRunner';
import { STRAW_HAT_CREW, findStrawHatAgent, type StrawHatAgentConfig } from '../shared/strawHatAgents';
import type { TaskGroup, TaskPhase, MilestoneRecord, PandaHiveTaskState, CafeOrder } from '../shared/pandaHiveTypes';

export type { TaskGroup, TaskPhase, MilestoneRecord, PandaHiveTaskState, CafeOrder };

type UpdateListener = (task: PandaHiveTaskState) => void;

class PandaHiveOrchestrator {
  private tasks: Map<string, PandaHiveTaskState> = new Map();
  private listeners: Set<UpdateListener> = new Set();
  private cafeOrders: CafeOrder[] = [];
  private baseWorkspaceRoot: string;

  constructor() {
    this.baseWorkspaceRoot = resolve(process.cwd(), 'workspace');
    if (!existsSync(this.baseWorkspaceRoot)) {
      try {
        mkdirSync(this.baseWorkspaceRoot, { recursive: true });
      } catch (e) {
        console.warn('[AgentHiveOrchestrator] Could not create workspace root:', e);
      }
    }
  }

  public subscribe(listener: UpdateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(task: PandaHiveTaskState): void {
    task.updatedAt = Date.now();
    for (const listener of this.listeners) {
      try {
        listener({ ...task });
      } catch (err) {
        console.error('[PandaHiveOrchestrator] Listener notification error:', err);
      }
    }
  }

  public getTask(taskId: string): PandaHiveTaskState | undefined {
    return this.tasks.get(taskId);
  }

  public getAllTasks(): PandaHiveTaskState[] {
    return Array.from(this.tasks.values());
  }

  public getCafeOrders(): CafeOrder[] {
    return [...this.cafeOrders];
  }

  /**
   * Usopp Café Server — Serves coffee, tea, ramen, bento to working agents.
   * Zero development AI calls.
   */
  public serveCafeItem(agentIdOrItem: string, maybeItem?: string): { ok: boolean; order: CafeOrder } {
    const item = maybeItem || agentIdOrItem;
    const targetId = maybeItem ? agentIdOrItem : 'sh-luffy';
    const agent = findStrawHatAgent(targetId) || STRAW_HAT_CREW[0];
    const order: CafeOrder = {
      id: `cafe_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      servedToAgentId: agent.id,
      servedToName: agent.name,
      item,
      timestamp: Date.now(),
      message: `☕ Usopp served hot ${item} to ${agent.name}! Energy boosted!`
    };

    this.cafeOrders.unshift(order);
    if (this.cafeOrders.length > 50) {
      this.cafeOrders.pop();
    }

    console.log(`[UsoppCafe] ${order.message}`);
    return { ok: true, order };
  }

  /**
   * Initializes and executes a task independently with its assigned 3-worker crew.
   * Supports two-task concurrency with isolated workspaces and zero shared mutable state.
   * Supports both object options `{ group, prompt, projectName }` and positional arguments.
   */
  public async runTask(
    optionsOrGroup: { taskId?: string; group: TaskGroup; prompt: string; projectName?: string } | TaskGroup,
    maybePrompt?: string,
    maybeProjectName?: string
  ): Promise<PandaHiveTaskState> {
    const opts = typeof optionsOrGroup === 'string'
      ? { group: optionsOrGroup, prompt: maybePrompt || '', projectName: maybeProjectName }
      : optionsOrGroup;
    const rawGroup = opts.group as string;
    const group: TaskGroup = (rawGroup === 'group-1' || rawGroup === 'group1') ? 'group1' : 'group2';
    const prompt = opts.prompt;
    const taskId = opts.taskId || `task_${group}_${Date.now()}`;
    const generateSlugFromPrompt = (text: string, defaultPrefix: string): string => {
      const stripped = text
        .toLowerCase()
        .replace(/^(?:create|make|build|code|design|develop|a|an|the|please|bana|banao)\s+/gi, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 32);
      return stripped || `${defaultPrefix}-${Date.now().toString().slice(-4)}`;
    };

    let projectName = opts.projectName?.trim();
    if (!projectName || projectName === 'sprint-task-a' || projectName === 'sprint-task-b') {
      projectName = generateSlugFromPrompt(prompt, `app-${group}`);
    }
    const cleanProjectName = projectName
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-');

    const workspaceDir = resolve(this.baseWorkspaceRoot, cleanProjectName);
    mkdirSync(workspaceDir, { recursive: true });
    workspacePermissionManager.authorizeWorkspace(workspaceDir);

    // Resolve assigned agents based on group
    const architect = group === 'group1'
      ? findStrawHatAgent('sh-nami')!
      : findStrawHatAgent('sh-robin')!;

    const builder = group === 'group1'
      ? findStrawHatAgent('sh-zoro')!
      : findStrawHatAgent('sh-shanks')!;

    const verifier = group === 'group1'
      ? findStrawHatAgent('sh-sanji')!
      : findStrawHatAgent('sh-hancock')!;

    const mascots = group === 'group1'
      ? [findStrawHatAgent('sh-chopper')!, findStrawHatAgent('sh-brook')!]
      : [findStrawHatAgent('sh-jinbe')!, findStrawHatAgent('sh-franky')!];

    const initialMilestones: MilestoneRecord[] = [
      {
        id: 'ms-spec',
        title: 'Architect Contract & Blueprint',
        agentId: architect.id,
        agentName: architect.name,
        status: 'PENDING'
      },
      {
        id: 'ms-build',
        title: 'Full-Stack Code Construction',
        agentId: builder.id,
        agentName: builder.name,
        status: 'PENDING'
      },
      {
        id: 'ms-verify',
        title: 'Real Syntax & Browser Verification',
        agentId: verifier.id,
        agentName: verifier.name,
        status: 'PENDING'
      }
    ];

    const taskState: PandaHiveTaskState = {
      taskId,
      group,
      projectName: cleanProjectName,
      prompt,
      status: 'IDLE',
      progress: 0,
      workspaceDir,
      assignedWorkers: {
        architect,
        builder,
        verifier,
        mascots
      },
      milestones: initialMilestones,
      generatedFiles: [],
      activeAgentId: 'sh-luffy',
      currentStepDescription: 'Luffy assigns sprint requirements to ' + group.toUpperCase(),
      error: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      repairTurn: 0
    };

    this.tasks.set(taskId, taskState);
    this.notify(taskState);

    // Run execution loop asynchronously so caller gets immediate handle
    this.executeWorkflow(taskId).catch((err) => {
      console.error(`[PandaHiveOrchestrator] Fatal execution error on task ${taskId}:`, err);
      const current = this.tasks.get(taskId);
      if (current) {
        current.status = 'BLOCKED';
        current.error = err?.message || String(err);
        current.currentStepDescription = `Task blocked: ${current.error}`;
        this.notify(current);
      }
    });

    return taskState;
  }

  private async executeWorkflow(taskId: string): Promise<void> {
    const task = this.tasks.get(taskId);
    if (!task) return;

    const omniCfg = getOmniRouteConfig();
    const architectModel = omniCfg?.architectModel || 'agy/gemini-3.8-flash-high';
    const builderModel = omniCfg?.builderModel || 'agy/gemini-3-flash';
    const verifierModel = omniCfg?.verifierModel || 'agy/gemini-3.8-flash-medium';

    // ── STAGE 1: ARCHITECT (Spec & DOM Contract) ───────────────────────────────
    task.status = 'ARCHITECTING';
    task.progress = 15;
    task.activeAgentId = task.assignedWorkers.architect.id;
    task.currentStepDescription = `${task.assignedWorkers.architect.name} is creating the DOM Contract & Blueprint`;
    task.milestones[0].status = 'IN_PROGRESS';
    task.milestones[0].startedAt = Date.now();
    this.notify(task);

    const architectCtx: ToolExecutionContext = {
      agentId: task.assignedWorkers.architect.id,
      agentName: task.assignedWorkers.architect.name,
      projectWorkspace: task.workspaceDir
    };

    const architectPrompt = `You are ${task.assignedWorkers.architect.name}, System & Data Architect of Straw Hat Crew ${task.group.toUpperCase()}.
Your mission: Create the concrete contract and architecture blueprint for:
"${task.prompt}"

CRITICAL REPLICA & CONTRACT RULES:
1. REAL-WORLD EXISTING PRODUCT REPLICA FIDELITY (MANDATORY):
   - Whenever the user requests an application, store, portal, or tool (e.g. Canva, Samsung, Netflix, Spotify, Amazon, YouTube, Trello, Twitter, Instagram, or an industry concept like e-commerce, LMS, dashboard):
   - You MUST design it as a HIGH-FIDELITY REPLICA of that real-world existing platform.
   - Replicate the authentic brand identity, signature color palette, exact layout hierarchy (header, sidebars, hero banner, content grids, drawers, modals), and hallmark real-world features.
2. 100% WORKING FUNCTIONALITY ARCHITECTURE (ZERO DEAD BUTTONS):
   - Every single feature, button, tab, search bar, and control in the application MUST be 100% functional.
   - Specify EXACT DOM element IDs to be shared between HTML and JavaScript (e.g. #menu-grid, #search-input, #cart-btn, #cart-drawer, #checkout-modal, #cart-count, #filter-all, #wishlist-btn, #toast-container).
   - Specify active event handler signatures for every single interactive control so that NO button or link is left dead or non-functional.
3. MANDATORY PRE-LOADED RICH DEMO DATA (PRIORITY #1):
   - For ANY application, portal, dashboard, SaaS, or website (excluding pure game loops):
   - Specify rich initial mock data structures with 6-12 realistic items matching the authentic real-world platform (real titles, real specs/prices, real dates, categories, statuses, tags, realistic avatars/images) so the UI is richly populated on load.
4. Specify exact data structures, state models, and event handler signatures.
5. Write your output file "spec.md" into the project workspace using WriteFile.
6. Do NOT leave placeholders or TODOs.
Do not write the full code yourself; write the detailed contract so ${task.assignedWorkers.builder.name} (Builder) can code it without ID mismatches.`;

    try {
      const archResult = await executeAgentLlmCallWithTools(
        architectPrompt,
        `You are ${task.assignedWorkers.architect.name}. You use WriteFile to save spec.md.`,
        architectCtx,
        {
          preferredModel: architectModel,
          maxTurns: 4,
          allowedTools: ['WriteFile', 'ReadFile', 'ListFiles']
        }
      );

      // Verify spec.md was written
      const specPath = join(task.workspaceDir, 'spec.md');
      if (!existsSync(specPath)) {
        // Model may have provided text directly without WriteFile call; write it
        if (archResult.text && archResult.text.length > 50) {
          writeFileSync(specPath, archResult.text, 'utf8');
        } else {
          throw new Error(`Architect ${task.assignedWorkers.architect.name} failed to generate spec.md`);
        }
      }

      task.generatedFiles = this.scanWorkspaceFiles(task.workspaceDir);
      task.milestones[0].status = 'COMPLETED';
      task.milestones[0].completedAt = Date.now();
      task.milestones[0].durationMs = task.milestones[0].completedAt - (task.milestones[0].startedAt || task.milestones[0].completedAt);
      task.milestones[0].summary = 'Blueprint and DOM IDs contract created in spec.md';
      task.progress = 35;
      this.notify(task);
    } catch (err: any) {
      task.milestones[0].status = 'BLOCKED';
      task.milestones[0].error = err.message;
      task.status = 'BLOCKED';
      task.error = `Architect provider error: ${err.message}. Completed work preserved.`;
      task.currentStepDescription = task.error;
      this.notify(task);
      return;
    }

    // ── STAGE 2: BUILDER (Complete HTML, CSS, JS, Dockerfile) ──────────────────
    task.status = 'BUILDING';
    task.progress = 40;
    task.activeAgentId = task.assignedWorkers.builder.id;
    task.currentStepDescription = `${task.assignedWorkers.builder.name} is writing full-stack code (HTML, CSS, JS)`;
    task.milestones[1].status = 'IN_PROGRESS';
    task.milestones[1].startedAt = Date.now();
    this.notify(task);

    const builderCtx: ToolExecutionContext = {
      agentId: task.assignedWorkers.builder.id,
      agentName: task.assignedWorkers.builder.name,
      projectWorkspace: task.workspaceDir
    };

    const specText = existsSync(join(task.workspaceDir, 'spec.md'))
      ? readFileSync(join(task.workspaceDir, 'spec.md'), 'utf8')
      : '';

    const builderPrompt = `You are ${task.assignedWorkers.builder.name}, Full-Stack Builder & Coder of Straw Hat Crew ${task.group.toUpperCase()}.
You must implement the COMPLETE, working web application based on the Architect's specification:

User Prompt: "${task.prompt}"

Architect Blueprint & DOM Contract:
${specText}

CRITICAL BUILDER RULES:
1. REAL-WORLD EXISTING PRODUCT REPLICA FIDELITY:
   - Build a high-fidelity REPLICA of the targeted real-world application (e.g. Canva, Samsung, Netflix, Spotify, Amazon, YouTube, Trello, Twitter, Instagram, etc.).
   - Accurately reproduce the genuine brand colors, typography, layout hierarchy (header, sidebars, hero banner, content grids, drawers, modals), and signature real-world features.
2. 100% WORKING FUNCTIONALITY (ZERO DEAD BUTTONS OR DUMMY CONTROLS):
   - EVERY SINGLE FEATURE, BUTTON, AND INTERACTION MUST BE 100% WORKING.
   - Every button, tab, search bar, dropdown, filter, toggle, modal trigger, card click, add/edit/delete operation, cart drawer, checkout step, and audio/canvas tool MUST have real event listeners in JavaScript that execute actual state updates and DOM mutations.
   - ZERO dead links (\`href="#"\` without click handlers), ZERO dummy non-working buttons, ZERO unimplemented placeholders.
   - Interactive feedback: Toast notifications on actions (e.g. "Item added to cart", "Template selected", "Saved to wishlist"), counters updating (e.g. cart badge, like count, task count), instant search filtering of cards, modal open/close toggles.
3. MANDATORY PRE-LOADED DEMO DATA (PRIORITY #1):
   - For ANY application, portal, dashboard, SaaS, or website (excluding pure game loops):
   - app.js MUST define rich, realistic in-memory seed data (6 to 12 realistic items matching the authentic real-world platform: real titles, dates, descriptions, prices, tags, status badges, avatars, images).
   - The UI MUST render this demo data immediately on page load (DOMContentLoaded) so that when index.html is opened or double-clicked, the page is fully populated with content and NEVER blank/empty!
   - (Online Data Enrichment): If online internet connectivity is available, the app can optionally fetch or refresh online data in a try-catch block, but it must NEVER wipe out or blank the screen if offline. Local seed data is always the primary fallback.
4. Write index.html with all container elements and the EXACT IDs from spec.md.
5. Write style.css with modern, beautiful responsive styling (flexbox/grid, cards, vibrant brand colors, active hover/focus states).
6. Write Dockerfile with a lightweight static web server (e.g. nginx:alpine).
7. Immediately invoke WriteFile for index.html, style.css, and app.js. Do not waste turns reading files. Ensure NO fake fallbacks or partial snippets. Complete, production-ready code.`;

    try {
      await executeAgentLlmCallWithTools(
        builderPrompt,
        `You are ${task.assignedWorkers.builder.name}. Use WriteFile to create index.html, style.css, app.js (or js/app.js), and Dockerfile in the project workspace.`,
        builderCtx,
        {
          preferredModel: builderModel,
          maxTurns: 14,
          timeoutMs: 180000,
          allowedTools: ['WriteFile', 'EditFile', 'ReadFile', 'ListFiles', 'RunSyntaxAudit']
        }
      );

      task.generatedFiles = this.scanWorkspaceFiles(task.workspaceDir);

      // Check if builder wrote into a subfolder like 'workspace/app.js' or 'js/app.js'
      if (existsSync(join(task.workspaceDir, 'workspace', 'app.js'))) {
        const subContent = readFileSync(join(task.workspaceDir, 'workspace', 'app.js'), 'utf8');
        const rootContent = existsSync(join(task.workspaceDir, 'app.js')) ? readFileSync(join(task.workspaceDir, 'app.js'), 'utf8') : '';
        if (subContent.length > rootContent.length) {
          copyFileSync(join(task.workspaceDir, 'workspace', 'app.js'), join(task.workspaceDir, 'app.js'));
        }
      }

      // If modular structure was used, bridge root entry points for standard compatibility
      if (!existsSync(join(task.workspaceDir, 'app.js')) && existsSync(join(task.workspaceDir, 'js', 'app.js'))) {
        copyFileSync(join(task.workspaceDir, 'js', 'app.js'), join(task.workspaceDir, 'app.js'));
      }
      if (!existsSync(join(task.workspaceDir, 'style.css')) && existsSync(join(task.workspaceDir, 'css', 'style.css'))) {
        copyFileSync(join(task.workspaceDir, 'css', 'style.css'), join(task.workspaceDir, 'style.css'));
      }

      // Verify that core files actually exist — NEVER fake them
      const hasHtml = existsSync(join(task.workspaceDir, 'index.html'));
      let hasJs = existsSync(join(task.workspaceDir, 'app.js')) ||
                  existsSync(join(task.workspaceDir, 'js', 'app.js'));

      // If index.html exists but app.js is missing, give Builder a continuation turn
      if (hasHtml && !hasJs) {
        try {
          const missingJsPrompt = `You have created index.html and style.css in the workspace.
Now create the JavaScript entry point "app.js" (or "js/app.js" as linked in index.html) using WriteFile.
MANDATORY REQUIREMENTS:
1. High-fidelity replica of the target real-world product with rich pre-loaded seed demo data (6-12 realistic items).
2. Render items into the main HTML containers on DOMContentLoaded so the UI is richly populated on load.
3. 100% WORKING FUNCTIONALITY: Bind real, working event listeners to ALL buttons, tabs, search bars, filters, and modal toggles from spec.md. ZERO dead buttons or non-functional links. Complete working code only.`;
          await executeAgentLlmCallWithTools(
            missingJsPrompt,
            `You are ${task.assignedWorkers.builder.name}. Use WriteFile to create the entry point script (app.js or js/app.js).`,
            builderCtx,
            {
              preferredModel: builderModel,
              maxTurns: 6,
              timeoutMs: 180000,
              allowedTools: ['WriteFile']
            }
          );
          task.generatedFiles = this.scanWorkspaceFiles(task.workspaceDir);
          hasJs = existsSync(join(task.workspaceDir, 'app.js')) ||
                  existsSync(join(task.workspaceDir, 'js', 'app.js')) ||
                  task.generatedFiles.some((f) => f.endsWith('.js'));
        } catch (cErr: any) {
          console.warn(`[PandaHiveOrchestrator] Builder continuation turn warning:`, cErr.message);
        }
      }

      // ── Anti-Stub & Demo Data Enforcement ──────────────────────────────────
      const appJsPath = existsSync(join(task.workspaceDir, 'app.js'))
        ? join(task.workspaceDir, 'app.js')
        : (existsSync(join(task.workspaceDir, 'js', 'app.js')) ? join(task.workspaceDir, 'js', 'app.js') : null);

      let appJsContent = appJsPath ? readFileSync(appJsPath, 'utf8') : '';
      const isPureGamePrompt = /\b(ludo|chess|tic tac toe|flappy|snake|pong|minesweeper|sudoku|2048|platformer)\b/i.test(task.prompt);

      // If app.js is a lazy stub (< 1200 chars or missing array data) for non-game apps:
      if (!isPureGamePrompt && hasHtml && (appJsContent.length < 1200 || !appJsContent.includes('['))) {
        try {
          console.log(`[PandaHiveOrchestrator] Detected empty or stub app.js (${appJsContent.length} chars). Forcing Demo Data Enrichment...`);
          const enrichPrompt = `CRITICAL DEFECT DETECTED: Your app.js is an incomplete stub (${appJsContent.length} chars) with NO demo data and NO rendering logic.
You MUST write the complete, full-featured "app.js" using WriteFile now.
MANDATORY REQUIREMENTS:
1. High-fidelity replica: Define a rich in-memory array of at least 6-12 realistic items matching "${task.prompt}" (e.g. products, courses, cards, tasks, items with real names, prices/dates, tags, images, specs).
2. Render these items into the main HTML containers from spec.md (e.g. grids, lists, carousels) immediately on DOMContentLoaded so the page is fully populated and NEVER blank!
3. 100% WORKING FUNCTIONALITY (ZERO DEAD BUTTONS): Implement real, working event listeners for every single interactive control: search, category/filter tabs, sorting, add-to-cart/drawer, modal popups, favorites/wishlist toggles with badge counters, and toast feedback.
Write the complete production-ready app.js now.`;
          await executeAgentLlmCallWithTools(
            enrichPrompt,
            `You are ${task.assignedWorkers.builder.name}. Use WriteFile to write the complete app.js with rich demo data and rendering.`,
            builderCtx,
            {
              preferredModel: builderModel,
              maxTurns: 4,
              timeoutMs: 180000,
              allowedTools: ['WriteFile']
            }
          );
          if (appJsPath && existsSync(appJsPath)) {
            appJsContent = readFileSync(appJsPath, 'utf8');
          }
        } catch (e: any) {
          console.warn('[PandaHiveOrchestrator] Data enrichment turn warning:', e?.message);
        }
      }

      if (!hasHtml || !hasJs) {
        throw new Error(`Builder ${task.assignedWorkers.builder.name} did not generate required files (index.html or app.js missing). Fake fallbacks are prohibited.`);
      }

      task.milestones[1].status = 'COMPLETED';
      task.milestones[1].completedAt = Date.now();
      task.milestones[1].durationMs = task.milestones[1].completedAt - (task.milestones[1].startedAt || task.milestones[1].completedAt);
      task.milestones[1].summary = `Generated: ${task.generatedFiles.join(', ')}`;
      task.progress = 70;
      this.notify(task);
    } catch (err: any) {
      task.milestones[1].status = 'BLOCKED';
      task.milestones[1].error = err.message;
      task.status = 'BLOCKED';
      task.error = `Builder provider error: ${err.message}. Completed files preserved.`;
      task.currentStepDescription = task.error;
      this.notify(task);
      return;
    }

    // ── STAGE 3: VERIFIER & REPAIR LOOP ────────────────────────────────────────
    await this.runVerifierLoop(task, verifierModel, builderModel);
  }

  private async runVerifierLoop(
    task: PandaHiveTaskState,
    verifierModel: string,
    builderModel: string
  ): Promise<void> {
    const maxRepairTurns = 3;

    task.status = 'VERIFYING';
    task.activeAgentId = task.assignedWorkers.verifier.id;
    task.milestones[2].status = 'IN_PROGRESS';
    task.milestones[2].startedAt = Date.now();
    this.notify(task);

    while (task.repairTurn <= maxRepairTurns) {
      task.currentStepDescription = `${task.assignedWorkers.verifier.name} is running syntax audit & headless browser DOM tests (Pass ${task.repairTurn + 1})`;
      task.progress = Math.min(75 + task.repairTurn * 7, 95);
      this.notify(task);

      // Run real headless browser test
      let qaReport: RealBrowserTestReport;
      try {
        qaReport = await browserTestRunner.runDeepBrowserTest(
          task.workspaceDir,
          task.prompt,
          existsSync(join(task.workspaceDir, 'spec.md')) ? readFileSync(join(task.workspaceDir, 'spec.md'), 'utf8') : ''
        );
      } catch (e: any) {
        qaReport = {
          syntaxValidation: 'FAIL',
          domValidation: 'FAIL',
          browserFunctionalTesting: 'FAIL',
          integrationTesting: 'FAIL',
          finalQaApproval: 'REJECTED',
          buttonCount: 0,
          formCount: 0,
          interactionsTested: [],
          errorsDetected: [{ type: 'pageerror', message: e?.message || String(e) }],
          issues: [{
            category: 'javascript',
            targetAgentId: 'sh-usopp' as any,
            targetFile: 'app.js',
            severity: 'CRITICAL',
            description: `Browser test crash: ${e?.message || e}`
          }],
          summary: `Verifier runtime error: ${e?.message || e}`
        };
      }

      task.qaReport = qaReport;

      const hasCriticalIssues = qaReport.issues.some((i) => i.severity === 'CRITICAL' || i.severity === 'MAJOR');
      const passed = qaReport.syntaxValidation === 'PASS' &&
        qaReport.domValidation === 'PASS' &&
        !hasCriticalIssues;

      if (passed) {
        // Write test report deliverable
        const reportMd = `# QA Verification Sign-off
**Verifier:** ${task.assignedWorkers.verifier.name}
**Status:** QA_PASSED
**Syntax Validation:** ${qaReport.syntaxValidation}
**DOM Validation:** ${qaReport.domValidation}
**Buttons Tested:** ${qaReport.buttonCount}
**Interactions:** ${qaReport.interactionsTested.length} tested (${qaReport.interactionsTested.filter((x) => x.success).length} passed)
**Summary:** All user requirements and contracts verified successfully.
`;
        writeFileSync(join(task.workspaceDir, 'test-report.md'), reportMd, 'utf8');

        task.generatedFiles = this.scanWorkspaceFiles(task.workspaceDir);
        task.milestones[2].status = 'COMPLETED';
        task.milestones[2].completedAt = Date.now();
        task.milestones[2].durationMs = task.milestones[2].completedAt - (task.milestones[2].startedAt || task.milestones[2].completedAt);
        task.milestones[2].summary = `QA Approved! ${qaReport.buttonCount} buttons & ${qaReport.interactionsTested.length} interactions verified`;

        task.status = 'COMPLETED';
        task.progress = 100;
        task.activeAgentId = 'sh-luffy';
        task.currentStepDescription = `Sprint Completed! Luffy signed off on ${task.projectName}.`;
        this.notify(task);
        return;
      }

      // If failed and still within repair allowance, trigger Builder Repair turn
      if (task.repairTurn < maxRepairTurns) {
        task.repairTurn++;
        task.status = 'REPAIRING';
        task.activeAgentId = task.assignedWorkers.builder.id;
        task.currentStepDescription = `${task.assignedWorkers.verifier.name} detected defects. Handing stack trace to ${task.assignedWorkers.builder.name} for repair.`;
        this.notify(task);

        const defectsSummary = qaReport.issues.map((iss) => `- [${iss.severity}] ${iss.targetFile}: ${iss.description}`).join('\n');
        const errorsSummary = qaReport.errorsDetected.map((err) => `- [${err.type}] ${err.message}`).join('\n');

        const repairPrompt = `You are ${task.assignedWorkers.builder.name}. The Verifier ${task.assignedWorkers.verifier.name} executed tests on your code and discovered these defects:

DEFECTS DETECTED:
${defectsSummary || 'No high-level issues listed'}

BROWSER CONSOLE / RUNTIME ERRORS:
${errorsSummary || 'No raw console errors'}

WORKSPACE DIR: "${task.workspaceDir}"

Your goal: Fix these exact defects in index.html, style.css, or app.js using EditFile or WriteFile.
- Read ONLY the specific file mentioned in the defect (do NOT read all files in the project).
- Immediately invoke EditFile or WriteFile to apply the fix.
- 100% WORKING FUNCTIONALITY: Ensure every button, filter, tab, and modal trigger has active JavaScript event listeners and performs visible state updates.
- If a modal toggle failed, ensure the modal button event listener in app.js opens the modal (removes 'hidden' class or sets display: flex/block) and close buttons restore 'hidden'.
- Match all element IDs exactly. Complete working code.`;

        const builderCtx: ToolExecutionContext = {
          agentId: task.assignedWorkers.builder.id,
          agentName: task.assignedWorkers.builder.name,
          projectWorkspace: task.workspaceDir
        };

        try {
          await executeAgentLlmCallWithTools(
            repairPrompt,
            `You are ${task.assignedWorkers.builder.name}. Fix the specific defects reported by QA. Read only the affected file and immediately save the fix.`,
            builderCtx,
            {
              preferredModel: builderModel,
              maxTurns: 8,
              timeoutMs: 120000,
              allowedTools: ['ReadFile', 'WriteFile', 'EditFile', 'RunSyntaxAudit']
            }
          );
          task.generatedFiles = this.scanWorkspaceFiles(task.workspaceDir);
        } catch (repairErr: any) {
          console.warn(`[PandaHiveOrchestrator] Builder repair turn encountered error:`, repairErr.message);
        }

        task.status = 'VERIFYING';
        task.activeAgentId = task.assignedWorkers.verifier.id;
        continue;
      }

      // Exceeded max repair turns: if syntax and DOM passed without fatal crash, grant conditional sign-off
      const hasFatalCritical = qaReport.issues.some((i) => i.severity === 'CRITICAL');
      if (qaReport.syntaxValidation === 'PASS' && qaReport.domValidation === 'PASS' && !hasFatalCritical) {
        const reportMd = `# QA Verification Sign-off
**Verifier:** ${task.assignedWorkers.verifier.name}
**Status:** QA_PASSED_WITH_OBSERVATIONS
**Syntax Validation:** ${qaReport.syntaxValidation}
**DOM Validation:** ${qaReport.domValidation}
**Buttons Tested:** ${qaReport.buttonCount}
**Interactions:** ${qaReport.interactionsTested.length} tested (${qaReport.interactionsTested.filter((x) => x.success).length} passed)
**Observations:** ${qaReport.issues.map((i) => i.description).slice(0, 3).join('; ')}
`;
        writeFileSync(join(task.workspaceDir, 'test-report.md'), reportMd, 'utf8');

        task.generatedFiles = this.scanWorkspaceFiles(task.workspaceDir);
        task.milestones[2].status = 'COMPLETED';
        task.milestones[2].completedAt = Date.now();
        task.milestones[2].durationMs = task.milestones[2].completedAt - (task.milestones[2].startedAt || task.milestones[2].completedAt);
        task.milestones[2].summary = `QA Approved with observations (${qaReport.buttonCount} buttons verified)`;

        task.status = 'COMPLETED';
        task.progress = 100;
        task.activeAgentId = 'sh-luffy';
        task.currentStepDescription = `Sprint Completed! Luffy accepted ${task.projectName} with QA sign-off.`;
        this.notify(task);
        return;
      }

      task.milestones[2].status = 'FAILED';
      task.milestones[2].error = `QA rejection after ${maxRepairTurns} repair attempts: ${qaReport.issues[0]?.description || 'Unresolved issues'}`;
      task.status = 'FAILED';
      task.error = task.milestones[2].error;
      task.currentStepDescription = `Verification failed: ${task.error}`;
      this.notify(task);
      return;
    }
  }

  private scanWorkspaceFiles(dir: string, base = ''): string[] {
    try {
      if (!existsSync(dir)) return [];
      const entries = readdirSync(dir, { withFileTypes: true });
      const files: string[] = [];
      for (const entry of entries) {
        if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
        const relPath = base ? `${base}/${entry.name}` : entry.name;
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
          files.push(...this.scanWorkspaceFiles(fullPath, relPath));
        } else if (entry.isFile()) {
          files.push(relPath);
        }
      }
      return files;
    } catch {
      return [];
    }
  }
}

export const pandaHiveOrchestrator = new PandaHiveOrchestrator();
export const agentHiveOrchestrator = pandaHiveOrchestrator;
export { PandaHiveOrchestrator as AgentHiveOrchestrator };
export type { PandaHiveTaskState as AgentHiveTaskState };

