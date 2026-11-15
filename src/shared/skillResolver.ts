/**
 * Smart On-Demand Skill Resolver for AgentHive
 *
 * Enables agents to dynamically discover, load, and execute any of the 252+
 * skills on-demand from prompt intent, with ZERO manual download steps required.
 */

export interface SkillMatch {
  name: string;
  category: string;
  owner: string;
  url: string;
  description: string;
  relevanceScore: number;
}

export const COMMON_ALIASES: Record<string, string[]> = {
  docx: ['word', 'doc', 'docx', 'document', 'report', 'msword'],
  pdf: ['pdf', 'extract pdf', 'read pdf', 'pdf table'],
  pptx: ['powerpoint', 'presentation', 'slides', 'deck', 'pitch deck', 'pptx'],
  xlsx: ['excel', 'spreadsheet', 'sheets', 'xlsx', 'csv analysis'],
  'frontend-design': ['ui', 'ux', 'frontend', 'design', 'layout', 'css', 'style', 'aesthetic', 'dashboard', 'modern ui', 'interface'],
  'web-game-engine': ['game', 'game loop', 'arcade', 'ludo', 'chess', 'racing', 'car race', 'pong', 'snake', 'flappy', 'canvas game', '2d game'],
  'canvas-design': ['canvas', 'p5', 'generative', 'particle', 'particles', 'chart', 'graph', 'visual simulation', 'drawing'],
  'api-client-patterns': ['api', 'fetch', 'network', 'offline', 'seed data', 'http', 'rest api', 'live data'],
  'algorithmic-art': ['generative art', 'math art', 'creative coding', 'p5.js', 'simulation'],
  'web-design-guidelines': ['accessibility', 'wcag', 'interaction', 'best practices', 'responsive'],
  'code-review': ['code review', 'audit', 'refactor', 'review', 'standards'],
  'performance-optimization': ['perf', 'performance', 'slow', 'fps', 'optimization', 'memory leak', 'bundle size'],
  'aws-skills': ['aws', 's3', 'lambda', 'cloud', 'dynamodb', 'ec2', 'cloudformation'],
  'docker-suite': ['docker', 'container', 'dockerfile', 'compose', 'docker-compose'],
  'github-actions': ['github', 'actions', 'ci/cd', 'pipeline', 'workflow', 'pr review'],
  'playwright-e2e': ['e2e', 'playwright', 'browser automation', 'scrape', 'integration test', 'headless'],
  'postgres-admin': ['postgres', 'postgresql', 'sql', 'database query', 'migration'],
  'sqlite-query': ['sqlite', 'db file', 'sqlite3'],
  'security-hardening': ['security', 'vulnerability', 'audit', 'secret leak', 'cve', 'xss', 'injection', 'owasp'],
  'mermaid-diagrams': ['mermaid', 'diagram', 'flowchart', 'architecture chart', 'sequence diagram'],
  'slack-thread-reply': ['slack', 'channel', 'slack reply', 'post to slack'],
  'frontend-slides': ['web slides', 'html presentation', 'revealjs']
};

export const CORE_CATALOG_SKILLS: Array<{ name: string; category: string; owner: string; url: string; description: string }> = [
  {
    name: 'frontend-design',
    category: 'Creative & Design',
    owner: 'anthropics',
    url: 'https://github.com/anthropics/skills/tree/main/skills/frontend-design',
    description: 'Official Anthropic guidance for distinctive, intentional visual design, typography, color palettes, and avoiding generic templated defaults'
  },
  {
    name: 'web-game-engine',
    category: 'Development & Code Tools',
    owner: 'awesome-agent-skills',
    url: 'https://github.com/obra/awesome-cursorrules',
    description: '2D HTML5 Canvas game engine architecture, requestAnimationFrame game loops, collision detection, keyboard/touch input, and Web Audio API sounds'
  },
  {
    name: 'canvas-design',
    category: 'Creative & Design',
    owner: 'anthropics',
    url: 'https://github.com/anthropics/skills/tree/main/skills/canvas-design',
    description: 'Interactive visual rendering on HTML5 Canvas, mathematical generative art, particle systems, charts, graphs, and export to PNG'
  },
  {
    name: 'api-client-patterns',
    category: 'Development & Code Tools',
    owner: 'awesome-agent-skills',
    url: 'https://github.com/obra/awesome-cursorrules',
    description: 'Robust client-side network patterns: zero-blank local seed data, background async refresh, 5-second timeouts, and LocalStorage cache'
  },
  {
    name: 'algorithmic-art',
    category: 'Creative & Design',
    owner: 'anthropics',
    url: 'https://github.com/anthropics/skills/tree/main/skills/algorithmic-art',
    description: 'Create generative visual art, mathematical simulations, and creative visual systems using p5.js and Canvas'
  },
  {
    name: 'web-design-guidelines',
    category: 'Creative & Design',
    owner: 'vercel-labs',
    url: 'https://github.com/vercel-labs',
    description: 'Official Vercel skill that reviews UI code against Web Interface Guidelines for accessibility, interaction, and UX best practices'
  },
  {
    name: 'color-expert',
    category: 'Creative & Design',
    owner: 'meodai',
    url: 'https://github.com/meodai',
    description: 'Color science and accessibility expertise covering APCA/WCAG, palette systems, and color-space decisions'
  },
  {
    name: 'performance-optimization',
    category: 'Development & Code Tools',
    owner: 'addyosmani',
    url: 'https://github.com/addyosmani',
    description: 'Diagnose and improve runtime, render, and bundle performance with systematic profiling and zero-lag DOM updates'
  },
  {
    name: 'browser-testing-with-devtools',
    category: 'Development & Code Tools',
    owner: 'addyosmani',
    url: 'https://github.com/addyosmani',
    description: 'Test and debug in real browsers via Chrome DevTools MCP: DOM, console errors, network, and performance'
  },
  {
    name: 'security-hardening',
    category: 'Security & Testing',
    owner: 'imnotstealthy',
    url: 'https://github.com/imnotstealthy',
    description: 'Portable defensive security workflow covering secure design and review, OWASP, input sanitation, and hardening'
  },
  {
    name: 'docx',
    category: 'Document Skills',
    owner: 'anthropics',
    url: 'https://github.com/anthropics/skills/tree/main/skills/docx',
    description: 'Create and edit Microsoft Word documents with formatting, comments, and tracked changes'
  },
  {
    name: 'pdf',
    category: 'Document Skills',
    owner: 'anthropics',
    url: 'https://github.com/anthropics/skills/tree/main/skills/pdf',
    description: 'Extract content from PDFs, split/merge documents, or create new ones'
  },
  {
    name: 'pptx',
    category: 'Document Skills',
    owner: 'anthropics',
    url: 'https://github.com/anthropics/skills/tree/main/skills/pptx',
    description: 'Generate and edit PowerPoint presentations'
  },
  {
    name: 'xlsx',
    category: 'Document Skills',
    owner: 'anthropics',
    url: 'https://github.com/anthropics/skills/tree/main/skills/xlsx',
    description: 'Manipulate Excel files, formulas, tables, and charts'
  }
];

/**
 * Dynamically resolves matching skills from a user's natural language prompt.
 */
export function resolveSkillsForPrompt(
  prompt: string,
  catalog: Array<{ name: string; category: string; owner: string; url: string; description: string }> = CORE_CATALOG_SKILLS
): SkillMatch[] {
  if (!prompt || !prompt.trim() || !catalog || catalog.length === 0) return [];

  const lowerPrompt = prompt.toLowerCase();
  const words = lowerPrompt.split(/\s+/).filter((w) => w.length > 2);
  const matches: SkillMatch[] = [];

  for (const skill of catalog) {
    const sName = skill.name.toLowerCase();
    const sDesc = skill.description.toLowerCase();
    let score = 0;

    // Direct name match in prompt
    if (lowerPrompt.includes(sName)) {
      score += 10;
    }

    // Check alias triggers
    const aliases = COMMON_ALIASES[sName] || [];
    for (const alias of aliases) {
      if (lowerPrompt.includes(alias)) {
        score += 8;
        break;
      }
    }

    // Word matching against skill description
    for (const w of words) {
      if (sDesc.includes(w)) {
        score += 2;
      }
    }

    if (score >= 4) {
      matches.push({
        ...skill,
        relevanceScore: score
      });
    }
  }

  // Sort by highest relevance and take top 3
  return matches.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 3);
}

/**
 * Formats a prompt with just-in-time on-demand skill execution directives.
 * Tells the agent exactly which skill to adopt and where to get its patterns.
 */
export function formatPromptWithOnDemandSkills(
  originalPrompt: string,
  matchedSkills: SkillMatch[]
): { prompt: string; resolvedSkills: string[] } {
  if (!matchedSkills || matchedSkills.length === 0) {
    return { prompt: originalPrompt, resolvedSkills: [] };
  }

  const skillNames = matchedSkills.map((m) => m.name);
  const directives = matchedSkills
    .map(
      (m) =>
        `- ⚡ ${m.name.toUpperCase()} (${m.owner}/${m.category}): ${m.description} [Ref: ${m.url}]`
    )
    .join('\n');

  const banner = [
    `────────────────────────────────────────────────────────────────────────`,
    `⚡ SMART ON-DEMAND SKILLS ACTIVATED:`,
    `The following domain skill(s) have been auto-resolved for this task:`,
    directives,
    `DIRECTIVE: Adopt the architecture standards, patterns, and best practices from these activated skills.`,
    `────────────────────────────────────────────────────────────────────────`
  ].join('\n');

  return {
    prompt: `${banner}\n\n${originalPrompt}`,
    resolvedSkills: skillNames
  };
}

/**
 * Convenience helper to generate a JIT skills directive block for any prompt.
 */
export function autoResolveSkillsDirective(prompt: string): string {
  const matches = resolveSkillsForPrompt(prompt);
  if (matches.length === 0) return '';
  const directives = matches
    .map(
      (m) =>
        `- ⚡ ${m.name.toUpperCase()} (${m.owner}/${m.category}): ${m.description}`
    )
    .join('\n');

  return `
────────────────────────────────────────────────────────────────────────
⚡ SMART ON-DEMAND SKILLS ACTIVATED:
${directives}
Adopt the patterns, styling, and robust error-handling standards of these skills.
────────────────────────────────────────────────────────────────────────`;
}
