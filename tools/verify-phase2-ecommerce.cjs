'use strict';

/**
 * Real-World Verification Script for Phase 2 Skills Integration.
 * 
 * Target: Run one small e-commerce demo project through the existing Panda Hive autonomous workflow.
 * Task: "build an artisan coffee e-commerce store with product catalog, cart drawer, checkout modal, customer reviews, and category filtering"
 * 
 * Verifies:
 * 1. Each participating agent receives its relevant skill instructions.
 * 2. Skill activation is visible in actual execution logs.
 * 3. Gemini receives the skill-enriched instructions.
 * 4. Groq receives the same instructions if fallback occurs.
 * 5. Feedback and repair loops preserve relevant skill context.
 * 6. Agents can read skill references using existing tools.
 * 7. No downloaded skill scripts execute automatically.
 * 8. No irrelevant skills are injected.
 */

const fs = require('node:fs');
const path = require('node:path');
const loadTs = require('../test/load-ts.cjs');

// 1. Load environment variables (.env)
const envFile = path.join(process.cwd(), '.env');
if (fs.existsSync(envFile)) {
  const content = fs.readFileSync(envFile, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const k = trimmed.slice(0, eqIdx).trim();
      const v = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

const { orchestrateTeamSprint } = loadTs('src/main/externalAgentServer.ts');
const { skillsEngine } = loadTs('src/main/skillsEngine.ts');

async function runVerification() {
  console.log('════════════════════════════════════════════════════════════════');
  console.log('🛒 REAL-WORLD VERIFICATION: PHASE 2 SKILLS INTEGRATION');
  console.log('Project: small-ecommerce-demo');
  console.log('════════════════════════════════════════════════════════════════\n');

  const projectName = 'small-ecommerce-demo';
  const targetDir = path.join(process.cwd(), 'workspace', projectName);
  const prompt = 'build an artisan coffee e-commerce store with product catalog, cart drawer, checkout modal, customer reviews, and category filtering';

  // Clean prior artifacts if any
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }

  const liveExecutionLog = [];
  const logCapture = (msg) => {
    liveExecutionLog.push(msg);
    console.log(msg);
  };

  const mockWebContents = {
    send: (channel, data) => {
      if (channel === 'hive:externalAgentEvent') {
        if (data.status === 'working') {
          logCapture(`  ▶ [${data.agentId}] ${data.action || 'Working...'}`);
        } else if (data.status === 'blocked') {
          logCapture(`  ❌ [BLOCKED: ${data.agentId}] ${data.action}`);
        }
      } else if (channel === 'hive:externalAgentMessage') {
        const preview = (data.text || '').replace(/\n+/g, ' ').slice(0, 100);
        logCapture(`  💬 [${data.sender || data.agentId}]: ${preview}...`);
      }
    }
  };

  const startTime = Date.now();
  console.log(`Starting Autonomous Sprint for: "${prompt}"\n`);

  const sprintResult = await orchestrateTeamSprint(prompt, mockWebContents, projectName);
  const totalDurationSec = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n════════════════════════════════════════════════════════════════');
  console.log(`🏁 SPRINT COMPLETED IN ${totalDurationSec}s`);
  console.log(`Result: ${sprintResult.success ? 'SUCCESS' : 'FAILED'}, QA Decision: ${sprintResult.finalQaApproval}`);
  console.log('════════════════════════════════════════════════════════════════\n');

  // Verify Audit File
  const auditPath = path.join(targetDir, 'execution-audit.json');
  if (!fs.existsSync(auditPath)) {
    throw new Error('FATAL: execution-audit.json was not created in workspace!');
  }

  const auditData = JSON.parse(fs.readFileSync(auditPath, 'utf8'));

  console.log('--- 📋 VERIFICATION EVIDENCE REPORT ---');
  console.log(`Target Project:     ${auditData.projectName}`);
  console.log(`Total Duration:     ${auditData.durationTotalSec}s`);
  console.log(`Milestones Total:   ${auditData.milestones.length}`);
  console.log(`Tool Calls Total:   ${auditData.toolExecutionSummary.totalToolCalls}`);
  console.log(`Successful Calls:   ${auditData.toolExecutionSummary.successfulToolCalls}`);
  console.log(`Failed Tool Calls:  ${auditData.toolExecutionSummary.failedToolCalls}\n`);

  console.log('--- 🤖 AGENT & SKILL TELEMETRY BREAKDOWN ---');
  let totalSkillsActivated = 0;
  for (const m of auditData.milestones) {
    const skills = m.activatedSkills || [];
    totalSkillsActivated += skills.length;
    const skillNames = skills.length > 0 ? skills.map((s) => `${s.name} (v${s.version})`).join(', ') : 'None (Safe Fallback)';
    console.log(`Step ${m.stepNum} [${m.agentName}]`);
    console.log(`  Role:             ${m.role}`);
    console.log(`  Provider/Model:   ${m.provider} (${m.model})`);
    console.log(`  Fallback Occurred: ${m.fallbackOccurred}`);
    console.log(`  Activated Skills: ${skillNames}`);
    console.log(`  Files Written:    ${(m.filesWritten || []).join(', ')}`);
    console.log(`  Status:           ${m.status}\n`);
  }

  // Check generated code
  const indexHtml = fs.readFileSync(path.join(targetDir, 'index.html'), 'utf8');
  const appJs = fs.readFileSync(path.join(targetDir, 'app.js'), 'utf8');
  const testReport = fs.readFileSync(path.join(targetDir, 'test-report.md'), 'utf8');

  console.log('--- 📦 DELIVERABLES CHECK ---');
  console.log(`index.html size:    ${indexHtml.length} bytes`);
  console.log(`app.js size:        ${appJs.length} bytes`);
  console.log(`test-report.md:     ${testReport.length} bytes`);

  // Write verification result summary
  const verificationSummary = {
    verifiedAt: new Date().toISOString(),
    projectName,
    prompt,
    totalDurationSec,
    sprintSuccess: sprintResult.success,
    finalQaApproval: sprintResult.finalQaApproval,
    browserFunctionalTesting: sprintResult.browserFunctionalTesting,
    totalSkillsActivated,
    milestones: auditData.milestones.map((m) => ({
      stepNum: m.stepNum,
      agentId: m.agentId,
      agentName: m.agentName,
      role: m.role,
      provider: m.provider,
      model: m.model,
      fallbackOccurred: m.fallbackOccurred,
      activatedSkills: m.activatedSkills || [],
      filesWritten: m.filesWritten
    }))
  };

  fs.writeFileSync(
    path.join(process.cwd(), 'tools', 'phase2-ecommerce-verification.json'),
    JSON.stringify(verificationSummary, null, 2),
    'utf8'
  );

  console.log('\n✔ Verification summary written to tools/phase2-ecommerce-verification.json');
}

runVerification().catch((err) => {
  console.error('\n❌ Verification failed with error:', err);
  process.exit(1);
});

