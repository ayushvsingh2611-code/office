'use strict';
/**
 * Panda Hive Phase 5 — Live Runtime Sprint Verification Script
 *
 * Runs a genuine end-to-end sprint for "smart-recipe-vault" with live configured APIs:
 * - Luffy: Milestone 1 (Project Scoping & Decomposition)
 * - Hancock: Milestone 2 (User Stories, Specs & Acceptance Criteria)
 * - Shanks & Nami: Milestone 3 (System Architecture & Data Models)
 * - Franky & Usopp: Milestone 4 (HTML5 UI Layout, CSS & Interactive State Logic in app.js)
 * - Brook & Jinbe: Milestone 5 (External Integrations & Security Audit)
 * - Chopper & Sanji: Milestone 6 (Playwright Headless Browser Testing & Dockerfile)
 * - Zoro, Robin & Luffy: Milestone 7 (Code Review Quality Gate, README & Final Sign-Off)
 *
 * Records:
 * - Provider and model for every milestone
 * - Actual tool execution telemetry
 * - Playwright QA browser interaction results
 * - Defect routing and feedback passes if any
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
const { agentTools, workspacePermissionManager } = loadTs('src/main/agentTools.ts');
const { getGeminiApiKeys, getGrokApiKey } = loadTs('src/main/geminiClient.ts');

async function runLiveSprintVerification() {
  console.log('================================================================');
  console.log('🚢 PANDA HIVE PHASE 5 RUNTIME VERIFICATION SPRINT');
  console.log('================================================================\n');

  const geminiKeys = getGeminiApiKeys();
  const groqKey = getGrokApiKey();
  console.log(`Active Gemini API Keys configured: ${geminiKeys.length}`);
  console.log(`Active Groq/xAI API Key configured: ${groqKey ? 'YES' : 'NO'}\n`);

  const projectName = process.argv[2] || 'smart-pantry-chef';
  const prompt = process.argv[3] || 'build smart-pantry-chef with ingredients inventory tracker, recipe suggestions based on available pantry items, dietary preference filters, and meal prep calendar scheduling modal';
  const targetDir = path.join(process.cwd(), 'workspace', projectName);

  // Authorize workspace
  workspacePermissionManager.authorizeWorkspace(targetDir);

  // Clean any prior run of this specific test project
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }

  const agentEvents = [];
  const agentMessages = [];

  const mockWebContents = {
    send: (channel, data) => {
      if (channel === 'hive:externalAgentEvent') {
        agentEvents.push({ ...data, ts: Date.now() });
        if (data.status === 'working') {
          console.log(`  ▶ [${data.agentId}] ${data.action || 'Working...'}`);
        } else if (data.status === 'blocked') {
          console.error(`  ❌ [BLOCKED: ${data.agentId}] ${data.action}`);
        }
      } else if (channel === 'hive:externalAgentMessage') {
        agentMessages.push({ ...data, ts: Date.now() });
        const preview = (data.text || '').replace(/\n+/g, ' ').slice(0, 100);
        console.log(`  💬 [${data.sender || data.agentId}]: ${preview}...`);
      }
    }
  };

  console.log(`Voyage Target: "${projectName}"`);
  console.log(`Sprint Prompt: "${prompt}"\n`);
  const startTime = Date.now();

  try {
    const sprintResult = await orchestrateTeamSprint(prompt, mockWebContents, projectName);
    const totalDurationSec = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log(`\n================================================================`);
    console.log(`🎉 SPRINT COMPLETED IN ${totalDurationSec}s!`);
    console.log(`================================================================\n`);

    // Verify files on disk
    if (!fs.existsSync(targetDir)) {
      throw new Error(`Target directory "${targetDir}" was not created on disk.`);
    }

    const allEntries = fs.readdirSync(targetDir);
    const filesOnDisk = allEntries.filter(f => fs.statSync(path.join(targetDir, f)).isFile());
    const dirsOnDisk = allEntries.filter(f => fs.statSync(path.join(targetDir, f)).isDirectory());
    console.log(`Files created on disk in workspace/${projectName} (${filesOnDisk.length} unique files, ${dirsOnDisk.length} directories):`);
    for (const f of filesOnDisk) {
      const stats = fs.statSync(path.join(targetDir, f));
      console.log(`  - [FILE] ${f.padEnd(23)} (${stats.size} bytes)`);
    }
    for (const d of dirsOnDisk) {
      console.log(`  - [DIR]  ${d.padEnd(23)}`);
    }

    // Inspect execution audit
    const auditPath = path.join(targetDir, 'execution-audit.json');
    let auditData = null;
    if (fs.existsSync(auditPath)) {
      auditData = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
    }

    // Verify key deliverables
    const hasIndexHtml = fs.existsSync(path.join(targetDir, 'index.html'));
    const hasStyleCss = fs.existsSync(path.join(targetDir, 'style.css'));
    const hasAppJs = fs.existsSync(path.join(targetDir, 'app.js'));
    const hasTestReport = fs.existsSync(path.join(targetDir, 'test-report.md'));
    const hasCodeReview = fs.existsSync(path.join(targetDir, 'code-review.md'));
    const hasReadme = fs.existsSync(path.join(targetDir, 'README.md'));
    const hasDockerfile = fs.existsSync(path.join(targetDir, 'Dockerfile'));

    console.log('\nDeliverable Integrity Verification:');
    console.log(`  index.html:     ${hasIndexHtml ? 'EXISTS' : 'MISSING'}`);
    console.log(`  style.css:      ${hasStyleCss ? 'EXISTS' : 'MISSING'}`);
    console.log(`  app.js:         ${hasAppJs ? 'EXISTS' : 'MISSING'}`);
    console.log(`  test-report.md: ${hasTestReport ? 'EXISTS' : 'MISSING'}`);
    console.log(`  code-review.md: ${hasCodeReview ? 'EXISTS' : 'MISSING'}`);
    console.log(`  README.md:      ${hasReadme ? 'EXISTS' : 'MISSING'}`);
    console.log(`  Dockerfile:     ${hasDockerfile ? 'EXISTS' : 'MISSING'}`);

    const verificationPayload = {
      timestamp: new Date().toISOString(),
      projectName,
      prompt,
      totalDurationSec: parseFloat(totalDurationSec),
      success: sprintResult.success,
      executionStatus: sprintResult.executionStatus,
      sprintStatus: sprintResult.sprintStatus,
      qaStatus: sprintResult.qaStatus,
      finalQaApproval: sprintResult.finalQaApproval,
      uniqueFilesCount: filesOnDisk.length,
      filesCreated: filesOnDisk,
      directoriesCreated: dirsOnDisk,
      auditSummary: auditData ? {
        toolExecutionSummary: auditData.toolExecutionSummary,
        workspaceSummary: auditData.workspaceSummary,
        milestones: auditData.milestones.map(m => ({
          stepNum: m.stepNum,
          agentId: m.agentId,
          agentName: m.agentName,
          role: m.role,
          provider: m.provider,
          model: m.model,
          durationMs: m.durationMs,
          fallbackOccurred: m.fallbackOccurred,
          filesWritten: m.filesWritten,
          successfulToolCalls: m.successfulToolCalls,
          failedToolCalls: m.failedToolCalls,
          status: m.status,
          qaStatusMatrix: m.qaStatusMatrix,
          feedbackRetries: m.feedbackRetries
        }))
      } : null,
      agentToolExecutions: auditData ? auditData.agentToolExecutions : []
    };

    const outReportPath = path.join(process.cwd(), 'tools', 'phase5-runtime-verification-report.json');
    fs.writeFileSync(outReportPath, JSON.stringify(verificationPayload, null, 2), 'utf8');
    console.log(`\nDetailed runtime verification report saved to: ${outReportPath}`);

  } catch (err) {
    console.error('\n❌ Sprint execution failed:', err);
    process.exit(1);
  }
}

runLiveSprintVerification();

