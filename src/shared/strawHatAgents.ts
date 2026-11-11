/**
 * Straw Hat Dev Crew — Full 12-Agent Autonomous Engineering Suite
 *
 * 1 Manager (Luffy) + 11 Specialists:
 * 1. LUFFY (Lead Orchestrator / Manager)
 * 2. HANCOCK (Requirements & Business Analyst)
 * 3. SHANKS (System Architect)
 * 4. NAMI (Data Architect)
 * 5. FRANKY (UI Engineer)
 * 6. USOPP (Backend Engineer)
 * 7. BROOK (Integrations & Content Specialist)
 * 8. JINBE (Security Reviewer)
 * 9. CHOPPER (Testing & Bug Fixing Engineer)
 * 10. SANJI (DevOps Engineer)
 * 11. ZORO (Final Code Reviewer)
 * 12. ROBIN (Documentation Specialist)
 */

export interface StrawHatAgentConfig {
  id: string;
  name: string;
  role: string;
  character: string;
  accent: 'coral' | 'mint' | 'sky' | 'lemon' | 'lilac' | 'peach';
  description: string;
  responsibilities: string[];
  deliverableNames: string[];
  defaultStation: 'desk' | 'shelf' | 'terminal' | 'web' | 'board';
  defaultTool: 'Read' | 'Edit' | 'Write' | 'Bash' | 'WebSearch' | 'TodoWrite';
  group: 'central' | 'group1' | 'group2' | 'cafe';
  isAiWorker: boolean;
  isVisualOnly: boolean;
  specialistRole?: 'orchestrator' | 'architect' | 'builder' | 'verifier' | 'waiter';
}

export const STRAW_HAT_CREW: StrawHatAgentConfig[] = [
  // ── Central Orchestrator ──
  {
    id: 'sh-luffy',
    name: 'Luffy (Captain & Orchestrator)',
    role: 'Central Boss & Lead Orchestrator',
    character: 'luffy',
    accent: 'coral',
    description: 'Central boss who decomposes user requirements and assigns tasks to Group 1 (Task A) or Group 2 (Task B).',
    responsibilities: [
      'Project requirements receive karke Task A ya Task B mein assign karega',
      'Group 1 aur Group 2 ke parallel workflows coordinate karega',
      'Final verification gates check karke project sign-off karega'
    ],
    deliverableNames: ['sprint-plan.md', 'sprint-signoff.md'],
    defaultStation: 'board',
    defaultTool: 'Read',
    group: 'central',
    isAiWorker: true,
    isVisualOnly: false,
    specialistRole: 'orchestrator'
  },

  // ── Group 1: Task A Squad ──
  {
    id: 'sh-nami',
    name: 'Nami (Group 1 - Architect)',
    role: 'System & Data Architect (Group 1)',
    character: 'nami',
    accent: 'lemon',
    description: 'Group 1 Architect: Designs the concrete blueprint, DOM IDs contract, and data schema for Task A.',
    responsibilities: [
      'Task A requirements analyze karke exact DOM IDs aur schema define karegi',
      'HTML aur JS components ke contract design karegi',
      'Zoro (Builder) ke liye concrete implementation blueprint banayegi'
    ],
    deliverableNames: ['architecture.md', 'data-models.md', 'spec.md'],
    defaultStation: 'board',
    defaultTool: 'Write',
    group: 'group1',
    isAiWorker: true,
    isVisualOnly: false,
    specialistRole: 'architect'
  },
  {
    id: 'sh-zoro',
    name: 'Zoro (Group 1 - Builder)',
    role: 'Full-Stack Builder & Coder (Group 1)',
    character: 'zoro',
    accent: 'mint',
    description: 'Group 1 Builder: Writes complete HTML, CSS, JavaScript, and Dockerfile for Task A based on Nami’s contract.',
    responsibilities: [
      'Nami ke blueprint ke hisaab se complete index.html, style.css aur app.js likhega',
      'Single-builder context ensure karega taaki HTML aur JS IDs hamesha match karein',
      'Sanji ke QA feedback ko parse karke targeted bug fixes karega'
    ],
    deliverableNames: ['index.html', 'style.css', 'app.js', 'Dockerfile'],
    defaultStation: 'desk',
    defaultTool: 'Edit',
    group: 'group1',
    isAiWorker: true,
    isVisualOnly: false,
    specialistRole: 'builder'
  },
  {
    id: 'sh-sanji',
    name: 'Sanji (Group 1 - Verifier)',
    role: 'QA & Browser Verifier (Group 1)',
    character: 'sanji',
    accent: 'lemon',
    description: 'Group 1 Verifier: Runs syntax checks, Playwright headless browser tests, and reports actual defects.',
    responsibilities: [
      'V8 syntax audit aur real Playwright browser clicks run karega',
      'Agar test fail ho, to exact stack trace aur error log Zoro (Builder) ko dega',
      '100% verified hone par Task A QA_PASSED approval dega'
    ],
    deliverableNames: ['test-report.md', 'code-review.md'],
    defaultStation: 'terminal',
    defaultTool: 'Bash',
    group: 'group1',
    isAiWorker: true,
    isVisualOnly: false,
    specialistRole: 'verifier'
  },
  {
    id: 'sh-chopper',
    name: 'Chopper (Group 1 Mascot)',
    role: 'Visual-Only Floor Mascot (Group 1)',
    character: 'chopper',
    accent: 'peach',
    description: 'Visual mascot cheering on Group 1 floor operations. Zero development AI tokens consumed.',
    responsibilities: [
      'Office floor par visual animations aur cheer provide karega',
      'Zero development AI calls consume karega'
    ],
    deliverableNames: [],
    defaultStation: 'terminal',
    defaultTool: 'TodoWrite',
    group: 'group1',
    isAiWorker: false,
    isVisualOnly: true
  },
  {
    id: 'sh-brook',
    name: 'Brook (Group 1 Mascot)',
    role: 'Visual-Only Floor Mascot (Group 1)',
    character: 'brook',
    accent: 'lilac',
    description: 'Visual mascot playing music and cheering on Group 1. Zero development AI tokens consumed.',
    responsibilities: [
      'Office floor par visual presence aur entertainment provide karega',
      'Zero development AI calls consume karega'
    ],
    deliverableNames: [],
    defaultStation: 'shelf',
    defaultTool: 'Read',
    group: 'group1',
    isAiWorker: false,
    isVisualOnly: true
  },

  // ── Group 2: Task B Squad ──
  {
    id: 'sh-robin',
    name: 'Robin (Group 2 - Architect)',
    role: 'System & Data Architect (Group 2)',
    character: 'robin',
    accent: 'lilac',
    description: 'Group 2 Architect: Designs the concrete blueprint, DOM IDs contract, and data schema for Task B.',
    responsibilities: [
      'Task B requirements analyze karke exact DOM IDs aur schema define karegi',
      'Component boundaries aur data flow contract design karegi',
      'Shanks (Builder) ke liye concrete blueprint banayegi'
    ],
    deliverableNames: ['architecture.md', 'data-models.md', 'spec.md'],
    defaultStation: 'shelf',
    defaultTool: 'Read',
    group: 'group2',
    isAiWorker: true,
    isVisualOnly: false,
    specialistRole: 'architect'
  },
  {
    id: 'sh-shanks',
    name: 'Shanks (Group 2 - Builder)',
    role: 'Full-Stack Builder & Coder (Group 2)',
    character: 'shanks',
    accent: 'coral',
    description: 'Group 2 Builder: Writes complete HTML, CSS, JavaScript, and Dockerfile for Task B based on Robin’s contract.',
    responsibilities: [
      'Robin ke blueprint ke hisaab se complete index.html, style.css aur app.js likhega',
      'Single-builder context ensure karega taaki HTML aur JS IDs hamesha match karein',
      'Hancock ke QA feedback ko parse karke targeted bug fixes karega'
    ],
    deliverableNames: ['index.html', 'style.css', 'app.js', 'Dockerfile'],
    defaultStation: 'terminal',
    defaultTool: 'Write',
    group: 'group2',
    isAiWorker: true,
    isVisualOnly: false,
    specialistRole: 'builder'
  },
  {
    id: 'sh-hancock',
    name: 'Hancock (Group 2 - Verifier)',
    role: 'QA & Browser Verifier (Group 2)',
    character: 'hancock',
    accent: 'peach',
    description: 'Group 2 Verifier: Runs syntax checks, Playwright headless browser tests, and reports actual defects.',
    responsibilities: [
      'V8 syntax audit aur real Playwright browser clicks run karegi',
      'Agar test fail ho, to exact stack trace aur error log Shanks (Builder) ko degi',
      '100% verified hone par Task B QA_PASSED approval degi'
    ],
    deliverableNames: ['test-report.md', 'code-review.md'],
    defaultStation: 'shelf',
    defaultTool: 'Read',
    group: 'group2',
    isAiWorker: true,
    isVisualOnly: false,
    specialistRole: 'verifier'
  },
  {
    id: 'sh-jinbe',
    name: 'Jinbe (Group 2 Mascot)',
    role: 'Visual-Only Floor Mascot (Group 2)',
    character: 'jinbe',
    accent: 'sky',
    description: 'Visual guardian of Group 2. Zero development AI tokens consumed.',
    responsibilities: [
      'Office floor par visual presence aur security patrol animation provide karega',
      'Zero development AI calls consume karega'
    ],
    deliverableNames: [],
    defaultStation: 'terminal',
    defaultTool: 'Read',
    group: 'group2',
    isAiWorker: false,
    isVisualOnly: true
  },
  {
    id: 'sh-franky',
    name: 'Franky (Group 2 Mascot)',
    role: 'Visual-Only Floor Mascot (Group 2)',
    character: 'franky',
    accent: 'sky',
    description: 'SUPER visual mascot energizing Group 2. Zero development AI tokens consumed.',
    responsibilities: [
      'Office floor par SUPER animations provide karega',
      'Zero development AI calls consume karega'
    ],
    deliverableNames: [],
    defaultStation: 'desk',
    defaultTool: 'Edit',
    group: 'group2',
    isAiWorker: false,
    isVisualOnly: true
  },

  // ── Office Café ──
  {
    id: 'sh-usopp',
    name: 'Usopp (Café Waiter)',
    role: 'Office Café Waiter',
    character: 'usopp',
    accent: 'mint',
    description: 'Office café waiter: Serves coffee, tea, and snacks to agents. Never makes development AI calls or touches project files.',
    responsibilities: [
      'Office café menu maintain karega',
      'Working agents ko coffee aur snacks serve karega',
      'Zero development code ya API calls make karega'
    ],
    deliverableNames: ['cafe-menu.json'],
    defaultStation: 'terminal',
    defaultTool: 'Write',
    group: 'cafe',
    isAiWorker: false,
    isVisualOnly: false,
    specialistRole: 'waiter'
  }
];

export function findStrawHatAgent(idOrName: string): StrawHatAgentConfig | undefined {
  const norm = idOrName.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (norm === 'god' || norm === 'luffy' || norm === 'shluffy' || norm === 'agentlead' || norm === 'pandalead') {
    return STRAW_HAT_CREW.find((a) => a.id === 'sh-luffy');
  }
  return STRAW_HAT_CREW.find(
    (a) => a.id.toLowerCase().replace(/[^a-z0-9]/g, '') === norm ||
           a.character.toLowerCase() === norm ||
           a.name.toLowerCase().includes(norm)
  );
}

