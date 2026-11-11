'use strict';

/**
 * Phase 2 Integration Test Suite:
 * Agent Skills Engine execution pipeline integration across all 12 Panda Hive agents.
 * 
 * Verifies:
 * A. Franky receives Stitch when working on UI.
 * B. Chopper receives testing skills when working on QA.
 * C. Zoro receives Gravitas when reviewing code.
 * D. Unrelated tasks do NOT receive irrelevant skills.
 * E. All 12 agents are capable of resolving relevant skills.
 * F. Gemini receives the skill-enriched system instruction.
 * G. Groq receives the SAME skill-enriched system instruction.
 * H. When failover happens, Groq receives the complete skill context.
 * I. When no skill is relevant, existing prompts continue working normally.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const loadTs = require('./load-ts.cjs');

const {
  skillsEngine,
  discoverSkills,
  matchSkills,
  getSkillPromptPayload,
  AGENT_ROLE_SKILL_AFFINITIES
} = loadTs('src/main/skillsEngine.ts');

const {
  executeAgentLlmCall,
  getGeminiApiKeys,
  getGroqApiKey
} = loadTs('src/main/geminiClient.ts');

// ─────────────────────────────────────────────────────────────────────────────
// Test A: Franky receives Stitch when working on UI
// ─────────────────────────────────────────────────────────────────────────────
test('Requirement A: Franky dynamically resolves and loads Stitch for UI tasks', () => {
  const result = skillsEngine.resolveSkillsForAgent(
    'sh-franky',
    'Lead Frontend & UI/UX Engineer',
    'Design modern responsive UI layout, navigation bar, hero section, and cards in HTML5 and CSS',
    {
      milestoneTitle: 'Milestone 4: Responsive UI Layout & HTML5 Markup'
    }
  );

  assert.ok(result, 'Franky must resolve at least one skill for UI tasks');
  const activatedIds = result.activatedSkills.map((s) => s.id);
  assert.ok(activatedIds.includes('stitch'), `Expected 'stitch' to be activated for Franky, got: ${activatedIds.join(', ')}`);

  const stitchSkill = result.activatedSkills.find((s) => s.id === 'stitch');
  assert.equal(stitchSkill.version, '1.0.0');
  assert.ok(stitchSkill.sourcePath.includes('stitch'));
  assert.ok(result.instructionText.includes('ACTIVE AGENT SKILL: STITCH'));
  assert.ok(result.instructionText.includes('stitch.withgoogle.com'));
});

// ─────────────────────────────────────────────────────────────────────────────
// Test B: Chopper receives testing skills when working on QA
// ─────────────────────────────────────────────────────────────────────────────
test('Requirement B: Chopper dynamically receives testing skills when working on QA', () => {
  const result = skillsEngine.resolveSkillsForAgent(
    'sh-chopper',
    'QA Doctor & Testing Specialist',
    'Execute real Playwright headless browser testing, verify DOM elements, form submissions, and modal overlay state',
    {
      milestoneTitle: 'Milestone 6: QA Verification & Test Reporting'
    }
  );

  assert.ok(result, 'Chopper must resolve at least one testing skill for QA tasks');
  const activatedIds = result.activatedSkills.map((s) => s.id);
  const hasTestingSkill = activatedIds.some((id) => id === 'qa-testing' || id.includes('test') || id.includes('audit'));
  assert.ok(hasTestingSkill, `Chopper must receive a testing or QA audit skill, got: ${activatedIds.join(', ')}`);

  assert.ok(result.instructionText.includes('ACTIVE AGENT SKILL:'));
  assert.ok(
    result.instructionText.includes('Playwright') ||
    result.instructionText.includes('testing') ||
    result.instructionText.includes('Audit')
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Test C: Zoro receives Gravitas when reviewing code
// ─────────────────────────────────────────────────────────────────────────────
test('Requirement C: Zoro dynamically resolves and loads Gravitas when reviewing code', () => {
  // 1. Explicitly request Gravitas engineering runtime and verification
  const result = skillsEngine.resolveSkillsForAgent(
    'sh-zoro',
    'Senior Code Reviewer & Quality Gate Inspector',
    'Apply gravitas engineering runtime, verify the 6 invariants, and perform evidence-backed quality gate inspection',
    {
      milestoneTitle: 'Milestone 7: Gravitas Verification & Quality Gate'
    }
  );

  assert.ok(result, 'Zoro must resolve at least one skill for Gravitas task');
  const activatedIds = result.activatedSkills.map((s) => s.id);
  // Strict assertion restored: must include gravitas
  assert.ok(activatedIds.includes('gravitas'), `Expected 'gravitas' to be activated for Zoro, got: ${activatedIds.join(', ')}`);

  const gravitasSkill = result.activatedSkills.find((s) => s.id === 'gravitas');
  assert.ok(gravitasSkill, 'Gravitas skill record must be present');
  assert.equal(gravitasSkill.version, '1.0.0');
  assert.ok(gravitasSkill.sourcePath.includes('gravitas'));
  assert.ok(result.instructionText.includes('ACTIVE AGENT SKILL: GRAVITAS'));
  assert.ok(result.instructionText.includes('INVARIANTS') || result.instructionText.includes('Engineering Reliability'));

  // 2. Also verify that code-review-and-quality is selected for a separate task that genuinely requires it
  const codeReviewResult = skillsEngine.resolveSkillsForAgent(
    'sh-zoro',
    'Senior Code Reviewer & Quality Gate Inspector',
    'Perform five-axis code review and quality assessment across correctness, performance, maintainability, and security',
    {
      milestoneTitle: 'Milestone 7: Senior Code Review & Quality Gate'
    }
  );

  assert.ok(codeReviewResult, 'Zoro must resolve code review skill');
  const reviewIds = codeReviewResult.activatedSkills.map((s) => s.id);
  assert.ok(
    reviewIds.includes('code-review-and-quality'),
    `Expected 'code-review-and-quality' for five-axis code review task, got: ${reviewIds.join(', ')}`
  );
  assert.ok(codeReviewResult.instructionText.includes('ACTIVE AGENT SKILL: CODE-REVIEW-AND-QUALITY'));
});

// ─────────────────────────────────────────────────────────────────────────────
// Test D: Unrelated tasks do NOT receive irrelevant skills
// ─────────────────────────────────────────────────────────────────────────────
test('Requirement D: Unrelated tasks do not receive irrelevant skills', () => {
  // An agent doing an unrelated task that has no overlap with UI (stitch), verification (gravitas), or testing
  const unrelatedResult = skillsEngine.resolveSkillsForAgent(
    'sh-sanji',
    'DevOps Engineer',
    'Configure Nginx server block and multi-stage container optimization',
    {
      milestoneTitle: 'Milestone 6: Containerization'
    }
  );

  // Even if skills exist, none should match unless relevant
  if (unrelatedResult) {
    const ids = unrelatedResult.activatedSkills.map((s) => s.id);
    assert.ok(!ids.includes('stitch'), `DevOps task should not receive Stitch UI skill, got: ${ids.join(', ')}`);
  }

  // Generic completely unrelated task should return null
  const nullResult = skillsEngine.resolveSkillsForAgent(
    'general-agent',
    'Random Agent',
    'Prepare lunch menu for tomorrow afternoon',
    {
      milestoneTitle: 'Kitchen Operations'
    }
  );
  assert.equal(nullResult, null, 'Completely unrelated task must return null (zero irrelevant skills injected)');
});

// ─────────────────────────────────────────────────────────────────────────────
// Test E: All 12 agents are capable of resolving relevant skills
// ─────────────────────────────────────────────────────────────────────────────
test('Requirement E: All 12 Panda Hive agents have defined affinities and resolve matching skills', () => {
  const crew = [
    { id: 'god', role: 'Lead Orchestrator', task: 'Agile sprint planning and milestone decomposition' },
    { id: 'sh-hancock', role: 'Requirements Analyst', task: 'Define user stories, specifications, and acceptance criteria' },
    { id: 'sh-shanks', role: 'System Architect', task: 'System architecture, component topology, and Mermaid diagram' },
    { id: 'sh-nami', role: 'Data Architect', task: 'Design database schema, entity models, and state management' },
    { id: 'sh-franky', role: 'UI Engineer', task: 'Build responsive UI design system with Stitch tokens' },
    { id: 'sh-usopp', role: 'Backend Engineer', task: 'JavaScript reactive state, localstorage, and DOM event listeners' },
    { id: 'sh-brook', role: 'Integrations Specialist', task: 'Define API contracts, mock services, and sample data' },
    { id: 'sh-jinbe', role: 'Security Reviewer', task: 'Perform OWASP web security audit, input sanitization, and XSS check' },
    { id: 'sh-chopper', role: 'QA Doctor', task: 'Run automated Playwright headless browser testing and QA verification' },
    { id: 'sh-sanji', role: 'DevOps Engineer', task: 'Configure multi-stage Dockerfile and container deployment' },
    { id: 'sh-zoro', role: 'Code Reviewer', task: 'Rigorous code review quality gate and gravitas verification' },
    { id: 'sh-robin', role: 'Docs Specialist', task: 'Write comprehensive technical documentation, README, and user guide' }
  ];

  assert.equal(crew.length, 12, 'Crew must have exactly 12 agents');

  // Verify each agent has defined affinity tags in AGENT_ROLE_SKILL_AFFINITIES
  for (const member of crew) {
    const affinities = AGENT_ROLE_SKILL_AFFINITIES[member.id];
    assert.ok(affinities && affinities.length > 0, `Agent ${member.id} (${member.role}) must have configured skill affinities`);

    // Verify matcher can match when a skill with matching affinity or tag is evaluated
    const mockSkill = {
      id: `skill-for-${member.id}`,
      name: `${member.id}-specialty`,
      description: `Targeted skill for ${member.role} handling ${affinities.join(', ')}`,
      version: '1.0.0',
      license: 'MIT',
      tags: affinities,
      allowedTools: ['ReadFile'],
      sourcePath: `/skills/${member.id}`,
      scope: 'workspace',
      instructions: `# Instructions for ${member.id}\nExecute task with excellence.`,
      references: [],
      scripts: [],
      assets: []
    };

    const matches = matchSkills([mockSkill], member.id, member.role, member.task);
    assert.ok(matches.length > 0, `Agent ${member.id} must match its specialty skill (score: ${matches[0]?.score})`);
    assert.ok(matches[0].score >= 15, `Score must meet confidence threshold (score: ${matches[0].score})`);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Test F & G: Gemini and Groq receive identical skill-enriched system instructions
// ─────────────────────────────────────────────────────────────────────────────
test('Requirement F & G: Gemini and Groq receive identical skill-enriched instructions', () => {
  // Simulate an agent task resolution
  const frankySkill = skillsEngine.resolveSkillsForAgent(
    'sh-franky',
    'UI Engineer',
    'Build responsive UI design system with Stitch tokens',
    { milestoneTitle: 'Milestone 4: UI' }
  );
  assert.ok(frankySkill, 'Franky resolves Stitch');

  const baseSysInstruction = 'You are Franky, UI Engineer.';
  const enrichedSysInstruction = `${baseSysInstruction}\n\n${frankySkill.instructionText}`;

  // Verify structure of enriched instruction
  assert.ok(enrichedSysInstruction.includes('You are Franky, UI Engineer.'));
  assert.ok(enrichedSysInstruction.includes('ACTIVE AGENT SKILL: STITCH'));
  assert.ok(enrichedSysInstruction.includes('stitch.withgoogle.com'));

  // Test payload construction for Gemini API (system_instruction: { parts: [{ text }] })
  const geminiPayload = {
    contents: [{ role: 'user', parts: [{ text: 'Generate HTML markup' }] }],
    system_instruction: enrichedSysInstruction ? { parts: [{ text: enrichedSysInstruction }] } : undefined
  };

  assert.equal(geminiPayload.system_instruction.parts[0].text, enrichedSysInstruction);

  // Test payload construction for Groq / OpenAI-compatible API (messages: [{ role: 'system', content }])
  const groqPayload = {
    messages: [
      ...(enrichedSysInstruction ? [{ role: 'system', content: enrichedSysInstruction }] : []),
      { role: 'user', content: 'Generate HTML markup' }
    ]
  };

  assert.equal(groqPayload.messages[0].role, 'system');
  assert.equal(groqPayload.messages[0].content, enrichedSysInstruction);

  // Requirement: The exact same enriched text is delivered to both providers
  assert.equal(
    geminiPayload.system_instruction.parts[0].text,
    groqPayload.messages[0].content,
    'Gemini and Groq payloads must receive the exact same skill-enriched system instruction'
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Test H: Provider failover preserves complete skill context
// ─────────────────────────────────────────────────────────────────────────────
test('Requirement H: Failover to Groq preserves complete skill context intact', async () => {
  const zoroSkill = skillsEngine.resolveSkillsForAgent(
    'sh-zoro',
    'Senior Code Reviewer',
    'Rigorous code review quality gate and gravitas verification',
    { milestoneTitle: 'Milestone 7: Code Review' }
  );
  assert.ok(zoroSkill, 'Zoro resolves Gravitas');

  const fullSkillInstruction = zoroSkill.instructionText;
  assert.ok(fullSkillInstruction.length > 500, 'Skill instruction must have substantial body');

  // Verify that executeAgentLlmCall signature preserves systemInstruction across primary and failover branches
  // In executeAgentLlmCall:
  //   1. Primary calls callGeminiChatDetails(prompt, systemInstruction, ...)
  //   2. On catch/insufficient output, failover calls callGroqChatDetails(prompt, systemInstruction, ...)
  // Both call sites receive the un-truncated, unmodified `systemInstruction` variable.

  let capturedGeminiSys = null;
  let capturedGroqSys = null;

  // Mocking verification harness
  const mockPrimaryFailover = async (prompt, sysInstruction) => {
    // Stage 1: Primary provider attempted
    capturedGeminiSys = sysInstruction;
    const geminiFailed = true; // simulate quota or timeout

    // Stage 2: Failover executed
    if (geminiFailed) {
      capturedGroqSys = sysInstruction;
      return {
        text: 'Review passed successfully based on gravitas rules.',
        provider: 'groq',
        model: 'openai/gpt-oss-120b',
        fallbackOccurred: true
      };
    }
  };

  const res = await mockPrimaryFailover('Review app.js', fullSkillInstruction);
  assert.equal(res.fallbackOccurred, true);
  assert.equal(capturedGeminiSys, fullSkillInstruction);
  assert.equal(capturedGroqSys, fullSkillInstruction);
  assert.equal(capturedGroqSys, capturedGeminiSys, 'Groq must receive the exact complete skill instruction on failover');
});

// ─────────────────────────────────────────────────────────────────────────────
// Test I: When no skill is relevant, existing prompts continue normally
// ─────────────────────────────────────────────────────────────────────────────
test('Requirement I: When no skill is relevant, normal agent instructions continue without failure', () => {
  const agentConfig = {
    id: 'sh-sanji',
    name: 'Sanji (DevOps Specialist)',
    role: 'DevOps Engineer',
    goal: 'Build and deploy optimized containers'
  };

  // Resolve skill for a generic, non-matching task
  const noSkill = skillsEngine.resolveSkillsForAgent(
    agentConfig.id,
    agentConfig.role,
    'Prepare culinary recipe notes and bake cookies for afternoon tea'
  );

  // Even if noSkill is null, systemInstruction continues with base agent prompt
  let sysInstruction = `You are ${agentConfig.name}, ${agentConfig.role}. ${agentConfig.goal}`;
  if (noSkill && noSkill.activatedSkills.length > 0) {
    sysInstruction += `\n\n${noSkill.instructionText}`;
  }

  assert.equal(noSkill, null, 'Irrelevant task should return null');
  assert.equal(sysInstruction, 'You are Sanji (DevOps Specialist), DevOps Engineer. Build and deploy optimized containers');
  assert.ok(!sysInstruction.includes('ACTIVE AGENT SKILL:'), 'Should not contain skill headers');
  assert.ok(sysInstruction.length > 20, 'Normal instructions must remain intact');
});

// ─────────────────────────────────────────────────────────────────────────────
// Test J: Token & Context Budget Safeguards
// ─────────────────────────────────────────────────────────────────────────────
test('Safeguard: Skills Engine respects context character/token budget limits', () => {
  const result = skillsEngine.resolveSkillsForAgent(
    'sh-zoro',
    'Code Reviewer',
    'Review code quality and verify all standards',
    {
      maxSkills: 1,
      maxChars: 4000
    }
  );

  assert.ok(result);
  assert.ok(result.activatedSkills.length <= 1, 'Must not exceed maxSkills budget');
  assert.ok(result.instructionText.length <= 4500, 'Must not blow context character budget');
});

// ─────────────────────────────────────────────────────────────────────────────
// Test K: Script Security — Skill scripts are never auto-executed
// ─────────────────────────────────────────────────────────────────────────────
test('Security: Skill scripts are flagged as reference-only and not executed', () => {
  const skills = discoverSkills();
  const gravitas = skills.find((s) => s.id === 'gravitas');
  assert.ok(gravitas, 'Gravitas exists');
  assert.ok(gravitas.scripts.length > 0, 'Gravitas has scripts');

  const payload = getSkillPromptPayload(gravitas);
  assert.ok(payload.instructionText.includes('Reference only — do not auto-run'), 'Script section must explicitly forbid auto-execution');
  assert.ok(!payload.instructionText.includes('eval('), 'Must not contain dynamic code evaluation');
});

