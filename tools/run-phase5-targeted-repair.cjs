'use strict';
/**
 * Phase 5.1: Targeted Multi-Agent Repair Pass Runner
 *
 * Target: workspace/smart-pantry-chef/
 * Agents executing repairs:
 * - Franky (UI/UX Engineer — HTML & CSS)
 * - Usopp (Backend Engineer — JavaScript logic)
 * - Chopper (QA Doctor — Playwright real browser testing)
 * - Zoro (Code Reviewer — Quality gate signoff)
 * - Luffy (Captain & Orchestrator — Final signoff)
 *
 * Antigravity: ZERO manual code writing.
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

async function runTargetedRepair() {
  console.log('========================================================================');
  console.log('🎯 PANDA HIVE PHASE 5.1: TARGETED MULTI-AGENT REPAIR PASS');
  console.log('Target: workspace/smart-pantry-chef/');
  console.log('Agents: Franky (HTML/CSS), Usopp (JS), Chopper (Playwright QA), Zoro, Luffy');
  console.log('System Engineer: Antigravity (Zero manual code edits)');
  console.log('========================================================================\n');

  const projectName = 'smart-pantry-chef';
  const prompt = 'build smart-pantry-chef with ingredients inventory tracker, recipe suggestions based on available pantry items, dietary preference filters, and meal prep calendar scheduling modal';

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
        const preview = (data.text || '').replace(/\n+/g, ' ').slice(0, 140);
        console.log(`  💬 [${data.sender || data.agentId}]: ${preview}...`);
      }
    }
  };

  const startTime = Date.now();
  try {
    const repairResult = await executeAgentOwnedRepair(
      projectName,
      prompt,
      mockWebContents,
      { maxRetries: 2, phaseName: 'Phase 5.1' }
    );
    const durationTotalSec = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log('\n========================================================================');
    console.log(`🏁 PHASE 5.1 REPAIR PASS COMPLETED IN ${durationTotalSec}s!`);
    console.log(`Final QA Decision:        ${repairResult.finalQaApproval}`);
    console.log(`Browser Functional:       ${repairResult.browserFunctionalTesting}`);
    console.log(`Feedback Passes:          ${repairResult.feedbackPasses}`);
    console.log(`Files Modified by Agents: ${repairResult.filesModified.join(', ')}`);
    console.log('========================================================================\n');

    const outPath = path.join(process.cwd(), 'tools', 'phase5-1-repair-result.json');
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
    console.error('\n❌ Phase 5.1 repair runner failed with error:', err);
    process.exit(1);
  }
}

runTargetedRepair().catch((err) => {
  console.error('Fatal crash:', err);
  process.exit(1);
});

