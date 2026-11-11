'use strict';
/**
 * Phase 2B: Autonomous Multi-Agent Sprint Acceptance Test Runner
 *
 * Project: Modern Responsive Task Management Web Application
 * Orchestrator: Luffy & Panda Hive 12 AI Agents
 * System Engineer: Antigravity (Inspection & Verification only — ZERO manual code writing)
 */

const fs = require('node:fs');
const path = require('node:path');
const loadTs = require('../test/load-ts.cjs');

// Load environment variables (.env)
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
const { agentTools } = loadTs('src/main/agentTools.ts');

async function runAcceptanceSprint() {
  console.log('========================================================================');
  console.log('🚀 PHASE 2B: AUTONOMOUS MULTI-AGENT SPRINT ACCEPTANCE TEST');
  console.log('Task: Modern Responsive Task Management Web Application');
  console.log('Crew: All 12 Straw Hat AI Agents (Luffy, Hancock, Shanks, Nami, Franky,');
  console.log('      Usopp, Brook, Jinbe, Chopper, Sanji, Zoro, Robin)');
  console.log('========================================================================\n');

  const prompt = [
    'build task-manager web application with user dashboard, create edit delete tasks,',
    'status pending in-progress completed, priority management, search and filtering,',
    'task statistics, responsive sidebar navigation, modal task creation, and LocalStorage persistence'
  ].join(' ');

  const expectedDir = path.join(process.cwd(), 'workspace', 'task-manager-web');

  // Clean prior run directory if exists
  if (fs.existsSync(expectedDir)) {
    fs.rmSync(expectedDir, { recursive: true, force: true });
  }

  const events = [];
  const mockWebContents = {
    send: (channel, data) => {
      events.push({ channel, data, ts: Date.now() });
      if (channel === 'hive:externalAgentEvent') {
        if (data.status === 'working') {
          console.log(`  ▶ [${data.agentId}] ${data.action || 'Working...'}`);
        } else if (data.status === 'blocked') {
          console.error(`  ❌ [BLOCKED: ${data.agentId}] ${data.action}`);
        }
      } else if (channel === 'hive:externalAgentMessage') {
        const preview = (data.text || '').replace(/\n+/g, ' ').slice(0, 110);
        console.log(`  💬 [${data.sender || data.agentId}]: ${preview}...`);
      }
    }
  };

  console.log(`Starting autonomous execution pipeline for: "${prompt}"\n`);
  const startTime = Date.now();

  try {
    await orchestrateTeamSprint(prompt, mockWebContents);
    const totalDurationSec = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log(`\n========================================================================`);
    console.log(`🎉 SPRINT COMPLETE IN ${totalDurationSec} SECONDS!`);
    console.log(`========================================================================\n`);

    if (!fs.existsSync(expectedDir)) {
      throw new Error(`Project directory "${expectedDir}" was not created!`);
    }

    const files = fs.readdirSync(expectedDir);
    console.log(`📁 Total Deliverables on Disk: ${files.length}`);
    console.log(`   Files: ${files.join(', ')}\n`);

    // Verify audit log
    const auditPath = path.join(expectedDir, 'execution-audit.json');
    if (!fs.existsSync(auditPath)) {
      throw new Error('execution-audit.json was not generated!');
    }

    const auditData = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
    console.log('--- 📊 EXECUTION AUDIT SUMMARY ---');
    console.log(`Project Name:        ${auditData.projectName}`);
    console.log(`Total Duration:      ${auditData.durationTotalSec}s`);
    console.log(`Milestones Passed:   ${auditData.milestones.length}/7`);
    console.log(`Total Tool Calls:    ${auditData.toolExecutionSummary.totalToolCalls}`);
    console.log(`Successful Calls:    ${auditData.toolExecutionSummary.successfulToolCalls}`);
    console.log(`Failed Tool Calls:   ${auditData.toolExecutionSummary.failedToolCalls}`);

    console.log('\n--- 👥 AGENT-BY-AGENT MILESTONE TELEMETRY ---');
    for (const m of auditData.milestones) {
      console.log(`Step ${m.stepNum}: ${m.agentName.padEnd(28)} | Provider: ${m.provider.padEnd(18)} | Model: ${m.model.padEnd(28)} | Duration: ${m.durationMs}ms`);
      if (m.qaStatusMatrix) {
        console.log(`   QA Decision: ${m.qaStatusMatrix.finalQaApproval} | Browser Functional: ${m.qaStatusMatrix.browserFunctionalTesting} | Retries: ${m.feedbackRetries ?? 0}`);
      }
    }

    // Inspect QA test report
    const testReportPath = path.join(expectedDir, 'test-report.md');
    if (fs.existsSync(testReportPath)) {
      const reportText = fs.readFileSync(testReportPath, 'utf8');
      console.log('\n--- 🩺 CHOPPER TEST REPORT EXCERPT ---');
      const lines = reportText.split('\n').slice(0, 30);
      console.log(lines.join('\n'));
    }

    // Output JSON result file for report generation
    const summaryResult = {
      success: true,
      projectName: auditData.projectName,
      totalDurationSec,
      filesGenerated: files,
      milestones: auditData.milestones,
      toolSummary: auditData.toolExecutionSummary,
      auditRecordsCount: auditData.toolAuditLog ? auditData.toolAuditLog.length : 0
    };

    fs.writeFileSync(
      path.join(process.cwd(), 'tools', 'phase2b-acceptance-result.json'),
      JSON.stringify(summaryResult, null, 2),
      'utf8'
    );

    console.log('\nPhase 2B sprint completed and recorded to tools/phase2b-acceptance-result.json');
  } catch (err) {
    console.error('\n❌ Sprint execution failed:', err);
    process.exit(1);
  }
}

runAcceptanceSprint().catch((e) => {
  console.error('Fatal runner error:', e);
  process.exit(1);
});
