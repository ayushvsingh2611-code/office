/**
 * Agent Skills Engine for Panda Hive
 * Implementation of the Open Agent Skills Specification (https://agentskills.io/)
 *
 * Core Capabilities:
 * - Provider-Agnostic: Identical operation with Google Gemini (3-key pool) and Groq Cloud.
 * - Standard Compliance: Reads SKILL.md with YAML frontmatter + scripts/ + references/ + assets/.
 * - Reliable Parsing: Uses js-yaml for robust schema parsing, multi-line blocks, arrays, and scalars.
 * - Precedence-Based Discovery: Scans ./skills, ./.agents/skills, ./resources/skills, and user directories.
 * - Progressive Disclosure: Injects core instructions into agent context; manifests reference files
 *   so agents can read them on-demand via ReadFile instead of flooding prompt context.
 * - Security Scanning: Audits skill files for path traversal, dangerous commands, secret harvesting,
 *   and strictly forbids automatic execution of skill scripts.
 * - Safe Fallback: If no skill matches, returns graceful null/empty allowing agents to proceed normally.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, basename, dirname, relative, normalize, sep } from 'node:path';
import { homedir } from 'node:os';
import * as yaml from 'js-yaml';

export interface SkillMetadata {
  name: string;
  description: string;
  version?: string;
  license?: string;
  author?: string;
  tags?: string[];
  allowedTools?: string[];
  compatibility?: string[];
  [key: string]: unknown;
}

export interface SkillFileEntry {
  name: string;
  relativePath: string;
  absolutePath: string;
  sizeBytes: number;
  extension: string;
}

export interface SkillSecurityReport {
  isSafe: boolean;
  warnings: string[];
  inspectedFilesCount: number;
}

export interface AgentSkill {
  id: string;
  name: string;
  description: string;
  version: string;
  license: string;
  tags: string[];
  allowedTools: string[];
  sourcePath: string;
  scope: 'workspace' | 'agents' | 'bundled' | 'user';
  instructions: string;
  references: SkillFileEntry[];
  scripts: SkillFileEntry[];
  assets: SkillFileEntry[];
  securityReport: SkillSecurityReport;
}

export interface SkillMatchScore {
  skill: AgentSkill;
  score: number;
  matchReasons: string[];
}

export interface ActivatedSkillRecord {
  id: string;
  name: string;
  version: string;
  sourcePath: string;
  scope: string;
}

export interface SkillPromptPayload {
  skillId: string;
  skillName: string;
  version: string;
  source: string;
  instructionText: string;
  referenceManifest: string;
  summaryNote: string;
}

export interface AggregatedSkillPayload {
  activatedSkills: ActivatedSkillRecord[];
  instructionText: string;
  referenceManifest: string;
  summaryNote: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Security Scanner for Agent Skills
// ─────────────────────────────────────────────────────────────────────────────

const SUSPICIOUS_COMMAND_PATTERNS = [
  /rm\s+-rf\s+[\/~]/i,
  /format\s+[a-z]:/i,
  /del\s+\/[fsq]\s+[a-z]:/i,
  /curl\s+.*\|\s*(?:bash|sh|powershell)/i,
  /wget\s+.*\|\s*(?:bash|sh|powershell)/i,
  /powershell\s+-enc/i,
  /process\.env\.(?:GEMINI|GROQ|OPENAI|ANTHROPIC|API_KEY|SECRET)/i,
  /\.\.[\/\\]\.\.[\/\\]\.\.[\/\\]/ // deep directory traversal attempt
];

/**
 * Inspects a skill folder for unsafe commands, token harvesting, and path traversal.
 */
export function auditSkillSecurity(skillDir: string): SkillSecurityReport {
  const warnings: string[] = [];
  let filesInspected = 0;

  function scanFolder(currentDir: string, depth = 0) {
    if (depth > 5) return;
    if (!existsSync(currentDir)) return;

    const entries = readdirSync(currentDir);
    for (const entry of entries) {
      const fullPath = join(currentDir, entry);
      const relPath = relative(skillDir, fullPath);

      // Verify no symlink / path traversal escaping skillDir
      const resolved = resolve(fullPath);
      if (!resolved.startsWith(resolve(skillDir))) {
        warnings.push(`Path traversal detected: "${relPath}" resolves outside skill directory`);
        continue;
      }

      let stat;
      try {
        stat = statSync(fullPath);
      } catch {
        continue;
      }

      if (stat.isDirectory()) {
        scanFolder(fullPath, depth + 1);
      } else if (stat.isFile()) {
        filesInspected++;
        // Limit file inspection size to 512KB per file for security scan
        if (stat.size > 512 * 1024) {
          warnings.push(`File "${relPath}" exceeds inspection limit (${Math.round(stat.size / 1024)} KB)`);
          continue;
        }

        try {
          const content = readFileSync(fullPath, 'utf8');
          for (const pattern of SUSPICIOUS_COMMAND_PATTERNS) {
            if (pattern.test(content)) {
              warnings.push(`Suspicious pattern detected in "${relPath}": ${pattern.toString()}`);
            }
          }
        } catch {
          // Binary files or read errors
        }
      }
    }
  }

  scanFolder(skillDir);

  return {
    isSafe: warnings.length === 0,
    warnings,
    inspectedFilesCount: filesInspected
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. YAML Frontmatter Parser
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parses frontmatter and markdown body according to agentskills.io standard.
 * Uses js-yaml for robust handling of multi-line descriptions, arrays, and scalars.
 */
export function parseSkillMarkdown(rawMarkdown: string): {
  metadata: SkillMetadata;
  body: string;
  error?: string;
} {
  const defaultMeta: SkillMetadata = {
    name: 'unnamed-skill',
    description: ''
  };

  if (!rawMarkdown || typeof rawMarkdown !== 'string') {
    return { metadata: defaultMeta, body: '', error: 'Empty markdown content' };
  }

  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(rawMarkdown);
  if (!match) {
    // If no frontmatter, treat entire file as body with inferred name from title
    const titleMatch = /^#\s+(.+)$/m.exec(rawMarkdown);
    const inferredName = titleMatch ? titleMatch[1].trim() : 'custom-skill';
    return {
      metadata: {
        name: inferredName,
        description: ''
      },
      body: rawMarkdown.trim()
    };
  }

  const rawYaml = match[1];
  const body = match[2] ? match[2].trim() : '';

  try {
    const parsed = yaml.load(rawYaml) as Record<string, unknown>;
    if (!parsed || typeof parsed !== 'object') {
      return { metadata: defaultMeta, body, error: 'YAML frontmatter did not parse into an object' };
    }

    const name = String(parsed.name || parsed.id || 'unnamed-skill').trim();
    let description = '';
    if (parsed.description) {
      description = String(parsed.description).trim().replace(/\s+/g, ' ');
    }

    const version = parsed.version ? String(parsed.version).trim() : '1.0.0';
    const license = parsed.license ? String(parsed.license).trim() : 'MIT';
    const author = parsed.author ? String(parsed.author).trim() : undefined;

    // Normalize tags
    let tags: string[] = [];
    if (Array.isArray(parsed.tags)) {
      tags = parsed.tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean);
    } else if (typeof parsed.tags === 'string') {
      tags = parsed.tags.split(/[,\s]+/).map((t) => t.trim().toLowerCase()).filter(Boolean);
    }

    // Normalize allowed-tools (agentskills.io optional tool constraint)
    let allowedTools: string[] = [];
    const toolsField = parsed['allowed-tools'] || parsed.allowedTools || parsed.tools;
    if (Array.isArray(toolsField)) {
      allowedTools = toolsField.map((t) => String(t).trim()).filter(Boolean);
    } else if (typeof toolsField === 'string') {
      allowedTools = toolsField.split(/[,\s]+/).map((t) => t.trim()).filter(Boolean);
    }

    const metadata: SkillMetadata = {
      ...parsed,
      name,
      description,
      version,
      license,
      author,
      tags,
      allowedTools
    };

    return { metadata, body };
  } catch (err: any) {
    return {
      metadata: defaultMeta,
      body,
      error: `YAML frontmatter parse error: ${err.message}`
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Skills Discovery Engine
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Scans a skill folder for references/, scripts/, and assets/ subdirectories.
 */
function scanSkillSubdirectory(skillDir: string, subfolderName: 'references' | 'scripts' | 'assets'): SkillFileEntry[] {
  const targetDir = join(skillDir, subfolderName);
  const results: SkillFileEntry[] = [];
  if (!existsSync(targetDir) || !statSync(targetDir).isDirectory()) {
    return results;
  }

  function walk(current: string) {
    const entries = readdirSync(current);
    for (const entry of entries) {
      const fullPath = join(current, entry);
      let st;
      try {
        st = statSync(fullPath);
      } catch {
        continue;
      }
      if (st.isDirectory()) {
        walk(fullPath);
      } else if (st.isFile()) {
        const ext = entry.includes('.') ? entry.split('.').pop()!.toLowerCase() : '';
        results.push({
          name: entry,
          relativePath: relative(skillDir, fullPath).replace(/\\/g, '/'),
          absolutePath: fullPath,
          sizeBytes: st.size,
          extension: ext
        });
      }
    }
  }

  walk(targetDir);
  return results.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Discover all valid Agent Skills across the standard search hierarchy.
 * Precedence Order (highest wins on ID collision):
 * 1. Project skills: <workspaceRoot>/skills
 * 2. Agent skills: <workspaceRoot>/.agents/skills (e.g. gravitas, stitch)
 * 3. App bundled skills: <workspaceRoot>/resources/skills
 * 4. User global skills: ~/.agents/skills or ~/.claude/skills
 */
export function discoverSkills(customRoots?: string[]): AgentSkill[] {
  const root = process.cwd();
  const searchRoots: Array<{ dir: string; scope: AgentSkill['scope'] }> = [];

  // 1. Explicit / Project skills
  searchRoots.push({ dir: join(root, 'skills'), scope: 'workspace' });

  // 2. Existing .agents/skills (Where stitch and gravitas reside)
  searchRoots.push({ dir: join(root, '.agents', 'skills'), scope: 'agents' });

  // 3. Bundled resources/skills
  searchRoots.push({ dir: join(root, 'resources', 'skills'), scope: 'bundled' });

  // 4. Custom roots if provided
  if (customRoots) {
    for (const cr of customRoots) {
      if (cr && existsSync(cr)) {
        searchRoots.push({ dir: cr, scope: 'user' });
      }
    }
  }

  // 5. User home skills
  const home = homedir();
  if (home) {
    const userAgentsSkills = join(home, '.agents', 'skills');
    if (existsSync(userAgentsSkills)) {
      searchRoots.push({ dir: userAgentsSkills, scope: 'user' });
    }
  }

  const discoveredMap = new Map<string, AgentSkill>();

  for (const { dir, scope } of searchRoots) {
    if (!existsSync(dir)) continue;
    let entries: string[] = [];
    try {
      entries = readdirSync(dir);
    } catch {
      continue;
    }

    for (const entry of entries) {
      const skillFolder = join(dir, entry);
      let isDir = false;
      try {
        isDir = statSync(skillFolder).isDirectory();
      } catch {
        continue;
      }
      if (!isDir) continue;

      // Locate SKILL.md (case-insensitive)
      let skillMdPath = join(skillFolder, 'SKILL.md');
      if (!existsSync(skillMdPath)) {
        skillMdPath = join(skillFolder, 'skill.md');
      }
      if (!existsSync(skillMdPath)) continue;

      try {
        const rawContent = readFileSync(skillMdPath, 'utf8');
        const { metadata, body } = parseSkillMarkdown(rawContent);

        const skillId = (metadata.name || entry).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
        // If already discovered in a higher-precedence scope, preserve higher precedence
        if (discoveredMap.has(skillId)) continue;

        const references = scanSkillSubdirectory(skillFolder, 'references');
        const scripts = scanSkillSubdirectory(skillFolder, 'scripts');
        const assets = scanSkillSubdirectory(skillFolder, 'assets');
        const securityReport = auditSkillSecurity(skillFolder);

        discoveredMap.set(skillId, {
          id: skillId,
          name: metadata.name || entry,
          description: metadata.description || '',
          version: metadata.version || '1.0.0',
          license: metadata.license || 'MIT',
          tags: metadata.tags || [],
          allowedTools: metadata.allowedTools || [],
          sourcePath: skillFolder,
          scope,
          instructions: body,
          references,
          scripts,
          assets,
          securityReport
        });
      } catch (err) {
        console.warn(`[SkillsEngine] Failed to parse skill in ${skillFolder}:`, err);
      }
    }
  }

  return Array.from(discoveredMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Skills Matcher & Selector for All 12 Agents
// ─────────────────────────────────────────────────────────────────────────────

export const AGENT_ROLE_SKILL_AFFINITIES: Record<string, string[]> = {
  // 1. Luffy (Lead Orchestrator & Manager)
  'god': ['agile', 'sprint', 'decomposition', 'orchestration', 'planning', 'project-plan', 'gravitas'],
  'sh-luffy': ['agile', 'sprint', 'decomposition', 'orchestration', 'planning', 'project-plan', 'gravitas'],

  // 2. Hancock (Requirements & BA)
  'sh-hancock': ['requirements', 'spec', 'user-story', 'acceptance-criteria', 'scope', 'business-analysis', 'specifications'],

  // 3. Shanks (System Architect)
  'sh-shanks': ['architecture', 'topology', 'system-design', 'contracts', 'mermaid', 'diagrams', 'system-architecture', 'composition', 'vercel-composition-patterns'],

  // 4. Nami (Data Architect)
  'sh-nami': ['data', 'models', 'database', 'schema', 'entity', 'state-management', 'validation', 'data-models'],

  // 5. Franky (UI Engineer)
  'sh-franky': ['stitch', 'ui', 'css', 'html', 'tailwind', 'layout', 'responsive', 'frontend', 'components', 'styles', 'web-design', 'accessibility', 'typography', 'wcag', 'web-design-guidelines', 'composition', 'vercel-composition-patterns', 'vercel-react-best-practices'],

  // 6. Usopp (Backend Engineer)
  'sh-usopp': ['backend', 'javascript', 'state', 'reactive', 'localstorage', 'crud', 'events', 'logic', 'dom-manipulation', 'debugging', 'troubleshooting', 'root-cause', 'systematic-debugging', 'react-best-practices', 'vercel-react-best-practices'],

  // 7. Brook (Integrations & Content)
  'sh-brook': ['integrations', 'api', 'mock', 'sample-data', 'payload', 'services', 'fetch', 'json-data'],

  // 8. Jinbe (Security Reviewer)
  'sh-jinbe': ['security', 'audit', 'owasp', 'sanitization', 'xss', 'auth', 'protection', 'vulnerability'],

  // 9. Chopper (Testing & Bug Fixing / QA Doctor)
  'sh-chopper': ['testing', 'qa', 'playwright', 'dom', 'browser', 'e2e', 'bugs', 'verification', 'audit', 'test-runner', 'debugging', 'root-cause', 'systematic-debugging', 'tdd', 'test-driven-development', 'unit-testing'],

  // 10. Sanji (DevOps Engineer)
  'sh-sanji': ['devops', 'docker', 'dockerfile', 'deployment', 'container', 'nginx', 'build', 'ci-cd'],

  // 11. Zoro (Final Code Reviewer)
  'sh-zoro': ['gravitas', 'review', 'code-review', 'quality-gate', 'clean-code', 'linting', 'verification', 'audit', 'tdd', 'test-driven-development', 'regression'],

  // 12. Robin (Documentation Specialist)
  'sh-robin': ['documentation', 'readme', 'user-guide', 'technical-writing', 'markdown', 'handbook', 'docs']
};

/**
 * Calculates a matching relevance score for a skill against an agent role and task description.
 */
export function matchSkills(
  skills: AgentSkill[],
  agentId: string,
  agentRole: string,
  taskDescription: string,
  milestoneTitle?: string
): SkillMatchScore[] {
  const scored: SkillMatchScore[] = [];
  const normalizedAgentId = agentId.toLowerCase();
  const affinities = AGENT_ROLE_SKILL_AFFINITIES[normalizedAgentId] || [];
  const taskText = `${taskDescription} ${milestoneTitle || ''}`.toLowerCase();
  const roleText = agentRole.toLowerCase();

  for (const skill of skills) {
    let score = 0;
    const reasons: string[] = [];

    const skillId = skill.id.toLowerCase();
    const skillName = skill.name.toLowerCase();
    const skillDesc = skill.description.toLowerCase();
    const skillTags = skill.tags.map((t) => t.toLowerCase());

    // Framework-specific gating:
    // vercel-react-best-practices activates ONLY when the project/task actually involves React
    if (skillId === 'vercel-react-best-practices') {
      const isReactContext = /\b(react|jsx|tsx|next|nextjs|useeffect|usestate|hooks)\b/i.test(taskText);
      if (!isReactContext) {
        continue;
      }
    }

    // vercel-composition-patterns activates ONLY when relevant to component architecture / framework
    if (skillId === 'vercel-composition-patterns') {
      const isComponentContext = /\b(component|composition|compound|patterns|render|slots|variant|react|vue)\b/i.test(taskText);
      if (!isComponentContext) {
        continue;
      }
    }

    // 1. Evaluate Task Relevance (Task MUST be related to skill)
    let taskRelevanceScore = 0;

    // A. Direct name/id match in task description
    if (taskText.includes(skillName) || taskText.includes(skillId)) {
      taskRelevanceScore += 30;
      reasons.push(`Task prompt explicitly mentions "${skill.name}"`);
    }

    // B. Skill tag matches in task description
    for (const tag of skillTags) {
      if (taskText.includes(tag)) {
        taskRelevanceScore += 12;
        reasons.push(`Task prompt matches skill tag "${tag}"`);
      }
    }

    // C. Overlap between agent affinity present in task and skill
    for (const aff of affinities) {
      if (taskText.includes(aff) && (skillTags.includes(aff) || skillId.includes(aff) || skillDesc.includes(aff))) {
        taskRelevanceScore += 15;
        reasons.push(`Task description matches affinity "${aff}"`);
      }
    }

    // If task has zero relevance to this skill, discard it (guarantees no irrelevant skills are loaded)
    if (taskRelevanceScore === 0) {
      continue;
    }

    score += taskRelevanceScore;

    // 2. Direct role specialty match
    for (const aff of affinities) {
      if (skillId === aff || skillName === aff) {
        score += 25;
        reasons.push(`Direct role specialty match ("${aff}")`);
      } else if (skillTags.includes(aff)) {
        score += 10;
        reasons.push(`Role tag affinity ("${aff}")`);
      } else if (skillDesc.includes(aff)) {
        score += 6;
        reasons.push(`Skill description matches role specialty ("${aff}")`);
      }
    }

    // 3. Role text matches skill description
    if (skillDesc.includes(roleText)) {
      score += 10;
      reasons.push(`Skill aligns with role "${agentRole}"`);
    }

    // Minimum confidence threshold (>= 15) ensures irrelevant skills are discarded
    if (score >= 15) {
      scored.push({
        skill,
        score,
        matchReasons: reasons
      });
    }
  }

  // Sort descending by relevance score
  return scored.sort((a, b) => b.score - a.score);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Skills Loader with Progressive Disclosure
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Formats a loaded skill for injection into an agent's prompt or system context.
 * Implements Progressive Disclosure:
 * - Injects the complete instructions from SKILL.md.
 * - Does NOT blindly dump reference file contents into the prompt.
 * - Provides an indexed manifest of available references so the agent can read them
 *   on-demand with ReadFile if needed.
 */
export function getSkillPromptPayload(skill: AgentSkill): SkillPromptPayload {
  let refSection = '';
  if (skill.references.length > 0) {
    refSection = '\n\n### 📚 Available Reference Materials (Read on-demand via ReadFile):\n' +
      skill.references
        .map((r) => `- \`${r.relativePath}\` (${Math.round(r.sizeBytes / 1024 * 10) / 10} KB)`)
        .join('\n');
  }

  let scriptsSection = '';
  if (skill.scripts.length > 0) {
    scriptsSection = '\n\n### ⚙️ Available Skill Scripts (Reference only — do not auto-run):\n' +
      skill.scripts
        .map((s) => `- \`${s.relativePath}\` (${s.extension.toUpperCase()} script)`)
        .join('\n');
  }

  const instructionText = `
═══════════════════════════════════════════════════════════════════════════
🎯 ACTIVE AGENT SKILL: ${skill.name.toUpperCase()} (v${skill.version})
Standard: Open Agent Skills Specification (agentskills.io)
Source: ${skill.sourcePath}
License: ${skill.license}
═══════════════════════════════════════════════════════════════════════════

${skill.instructions}${refSection}${scriptsSection}
═══════════════════════════════════════════════════════════════════════════
`.trim();

  return {
    skillId: skill.id,
    skillName: skill.name,
    version: skill.version,
    source: skill.sourcePath,
    instructionText,
    referenceManifest: refSection.trim(),
    summaryNote: `Activated skill "${skill.name}" (v${skill.version})`
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Unified Skills Engine Singleton
// ─────────────────────────────────────────────────────────────────────────────

export class PandaHiveSkillsEngine {
  private cachedSkills: AgentSkill[] | null = null;
  private lastScanTimestamp = 0;
  private readonly CACHE_TTL_MS = 10000; // 10s local cache

  /**
   * Discovers and retrieves all registered skills.
   */
  getSkills(forceRefresh = false): AgentSkill[] {
    const now = Date.now();
    if (!this.cachedSkills || forceRefresh || now - this.lastScanTimestamp > this.CACHE_TTL_MS) {
      this.cachedSkills = discoverSkills();
      this.lastScanTimestamp = now;
    }
    return this.cachedSkills;
  }

  /**
   * Retrieves a specific skill by its ID or name.
   */
  getSkill(idOrName: string): AgentSkill | undefined {
    const norm = idOrName.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    return this.getSkills().find((s) => s.id === norm || s.name.toLowerCase() === idOrName.toLowerCase());
  }

  /**
   * Resolves the top relevant skill for a specific agent and task.
   * Returns null if no skill achieves the required relevance threshold,
   * guaranteeing agents fall back safely to normal instructions.
   */
  resolveSkillForAgent(
    agentId: string,
    agentRole: string,
    taskDescription: string,
    milestoneTitle?: string
  ): SkillPromptPayload | null {
    const res = this.resolveSkillsForAgent(agentId, agentRole, taskDescription, {
      milestoneTitle,
      maxSkills: 1
    });
    if (!res || res.activatedSkills.length === 0) return null;

    const primary = res.activatedSkills[0];
    return {
      skillId: primary.id,
      skillName: primary.name,
      version: primary.version,
      source: primary.sourcePath,
      instructionText: res.instructionText,
      referenceManifest: res.referenceManifest,
      summaryNote: res.summaryNote
    };
  }

  /**
   * Multi-skill resolution supporting configurable context budget.
   */
  resolveSkillsForAgent(
    agentId: string,
    agentRole: string,
    taskDescription: string,
    options?: {
      milestoneTitle?: string;
      maxSkills?: number;
      maxChars?: number;
    }
  ): AggregatedSkillPayload | null {
    const allSkills = this.getSkills();
    if (allSkills.length === 0) return null;

    const maxSkills = options?.maxSkills ?? 2;
    const maxChars = options?.maxChars ?? 8000;

    const matches = matchSkills(allSkills, agentId, agentRole, taskDescription, options?.milestoneTitle);
    if (matches.length === 0) return null;

    const selectedMatches = matches.slice(0, maxSkills);
    const activatedRecords: ActivatedSkillRecord[] = [];
    const instructionBlocks: string[] = [];
    const referenceBlocks: string[] = [];
    let currentLength = 0;

    for (const match of selectedMatches) {
      const payload = getSkillPromptPayload(match.skill);
      if (currentLength + payload.instructionText.length > maxChars && instructionBlocks.length > 0) {
        // Stop if adding this entire skill would exceed context budget
        break;
      }
      let text = payload.instructionText;
      if (currentLength + text.length > maxChars) {
        const remaining = maxChars - currentLength;
        if (remaining > 300) {
          text = text.slice(0, remaining - 70).trim() + `\n\n[...Skill truncated to fit context budget of ${maxChars} chars...]`;
        } else {
          break;
        }
      }
      currentLength += text.length;
      activatedRecords.push({
        id: match.skill.id,
        name: match.skill.name,
        version: match.skill.version,
        sourcePath: match.skill.sourcePath,
        scope: match.skill.scope
      });
      instructionBlocks.push(text);
      if (payload.referenceManifest && currentLength < maxChars) {
        referenceBlocks.push(payload.referenceManifest);
      }
    }

    if (activatedRecords.length === 0) return null;

    return {
      activatedSkills: activatedRecords,
      instructionText: instructionBlocks.join('\n\n'),
      referenceManifest: referenceBlocks.join('\n\n'),
      summaryNote: `Activated ${activatedRecords.length} skill(s): ${activatedRecords.map((s) => `"${s.name}" (v${s.version})`).join(', ')}`
    };
  }
}

export const skillsEngine = new PandaHiveSkillsEngine();
export { PandaHiveSkillsEngine as AgentHiveSkillsEngine };
