/**
 * Smart On-Demand Skill Resolver for Panda Hive.
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

const COMMON_ALIASES: Record<string, string[]> = {
  docx: ['word', 'doc', 'docx', 'document', 'report', 'msword'],
  pdf: ['pdf', 'extract pdf', 'read pdf', 'pdf table'],
  pptx: ['powerpoint', 'presentation', 'slides', 'deck', 'pitch deck', 'pptx'],
  xlsx: ['excel', 'spreadsheet', 'sheets', 'xlsx', 'csv analysis'],
  'aws-cli': ['aws', 's3', 'lambda', 'cloud', 'dynamodb', 'ec2', 'cloudformation'],
  'docker-suite': ['docker', 'container', 'dockerfile', 'compose', 'docker-compose'],
  'github-actions': ['github', 'actions', 'ci/cd', 'pipeline', 'workflow', 'pr review'],
  'python-ruff': ['python format', 'ruff', 'black', 'pep8', 'flake8', 'typecheck python'],
  'vitest-runner': ['test', 'unit test', 'vitest', 'jest', 'coverage', 'testing'],
  'playwright-e2e': ['e2e', 'playwright', 'browser automation', 'scrape', 'integration test'],
  'postgres-admin': ['postgres', 'postgresql', 'sql', 'database query', 'migration'],
  'sqlite-query': ['sqlite', 'db file', 'sqlite3'],
  'security-audit': ['security', 'vulnerability', 'audit', 'secret leak', 'cve'],
  'mermaid-diagrams': ['mermaid', 'diagram', 'flowchart', 'architecture chart', 'sequence diagram'],
  'slack-thread-reply': ['slack', 'channel', 'slack reply', 'post to slack'],
  'frontend-slides': ['web slides', 'html presentation', 'revealjs']
};

/**
 * Dynamically resolves matching skills from a user's natural language prompt.
 */
export function resolveSkillsForPrompt(
  prompt: string,
  catalog: Array<{ name: string; category: string; owner: string; url: string; description: string }>
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
        `- ${m.name.toUpperCase()} (${m.owner}/${m.category}): ${m.description} [Ref: ${m.url}]`
    )
    .join('\n');

  const banner = [
    `[⚡ PANDA HIVE JIT SKILL ACTIVATION]`,
    `The following skill(s) were resolved on-demand for this task:`,
    directives,
    `Execute this task following the domain patterns and best practices for the resolved skills without asking the user to manually install them.\n`
  ].join('\n');

  return {
    prompt: `${banner}\n${originalPrompt}`,
    resolvedSkills: skillNames
  };
}
