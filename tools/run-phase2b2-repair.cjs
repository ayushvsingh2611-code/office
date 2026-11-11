'use strict';
/**
 * Phase 2B.2: Agent-Owned Application Repair Runner
 *
 * Target: workspace/task-manager-web/
 * Agents executing repairs: Franky (UI/UX HTML/CSS), Usopp (JavaScript logic),
 * Chopper (Playwright QA Doctor), Zoro (Code Review), Luffy (Sign-off).
 * External System Engineer (Antigravity): ZERO manual code writing.
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

const { executeAgentOwnedRepair } = loadTs('src/main/externalAgentServer.ts');

async function runRepair() {
  console.log('========================================================================');
  console.log('🩺 PHASE 2B.2: AGENT-OWNED APPLICATION REPAIR');
  console.log('Target: workspace/task-manager-web/');
  console.log('Agents: Franky (HTML/CSS), Usopp (JS), Chopper (Playwright QA)');
  console.log('System Engineer: Antigravity (Zero manual code edits)');
  console.log('========================================================================\n');

  const projectName = 'task-manager-web';
  const prompt = [
    'build task-manager web application with user dashboard, create edit delete tasks,',
    'status pending in-progress completed, priority management, search and filtering,',
    'task statistics, responsive sidebar navigation, modal task creation, and LocalStorage persistence'
  ].join(' ');

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
        const preview = (data.text || '').replace(/\n+/g, ' ').slice(0, 120);
        console.log(`  💬 [${data.sender || data.agentId}]: ${preview}...`);
      }
    }
  };

  const startTime = Date.now();
  try {
    const repairResult = await executeAgentOwnedRepair(projectName, prompt, mockWebContents);
    const durationTotalSec = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log('\n========================================================================');
    console.log(`🏁 REPAIR CYCLE COMPLETED IN ${durationTotalSec}s!`);
    console.log(`QA Decision:            ${repairResult.finalQaApproval}`);
    console.log(`Browser Functional:     ${repairResult.browserFunctionalTesting}`);
    console.log(`Feedback Passes:        ${repairResult.feedbackPasses}`);
    console.log(`Files Modified by Agents: ${repairResult.filesModified.join(', ')}`);
    console.log('========================================================================\n');

    // Save summary result
    const outPath = path.join(process.cwd(), 'tools', 'phase2b2-repair-result.json');
    fs.writeFileSync(
      outPath,
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          durationTotalSec,
          ...repairResult
        },
        null,
        2
      )
    );
    console.log(`Summary saved to ${outPath}`);

  } catch (err) {
    console.error('\n❌ Repair runner failed with error:', err);
    process.exit(1);
  }
}

runRepair().catch((err) => {
  console.error('Fatal crash:', err);
  process.exit(1);
});

