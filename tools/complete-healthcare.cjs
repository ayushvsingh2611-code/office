'use strict';
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

async function completeHealthcare() {
  console.log('🩺 Resuming Milestone 6 & 7 QA & Sign-Off for workspace/healthcare-management/ ...');
  const prompt = 'build Healthcare Management System with patient dashboard, doctor directory, appointment booking simulation, patient records using demo data, search and filtering, responsive UI, interactive modals, and LocalStorage persistence';
  const mockWebContents = {
    send: (channel, data) => {
      if (channel === 'hive:externalAgentMessage') {
        const preview = (data.text || '').replace(/\n+/g, ' ').slice(0, 140);
        console.log(`  💬 [${data.sender || data.agentId}]: ${preview}...`);
      }
    }
  };

  const startTime = Date.now();
  const res = await executeAgentOwnedRepair('healthcare-management', prompt, mockWebContents, { maxRetries: 2, phaseName: 'Phase 3' });
  const durationTotalSec = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`Finished in ${durationTotalSec}s. QA Approval: ${res.finalQaApproval}, Functional: ${res.browserFunctionalTesting}`);

  // Update tools/phase3-results.json
  const resultsPath = path.join(process.cwd(), 'tools', 'phase3-results.json');
  let currentResults = { timestamp: new Date().toISOString(), results: [] };
  if (fs.existsSync(resultsPath)) {
    try { currentResults = JSON.parse(fs.readFileSync(resultsPath, 'utf8')); } catch {}
  }

  const baseDir = path.join(process.cwd(), 'workspace', 'healthcare-management');
  const filesPresent = fs.existsSync(baseDir) ? fs.readdirSync(baseDir) : [];

  const projRecord = {
    projectId: 1,
    title: 'Healthcare Management System',
    projectName: 'healthcare-management',
    durationTotalSec,
    success: res.success,
    finalQaApproval: res.finalQaApproval,
    browserFunctionalTesting: res.browserFunctionalTesting,
    filesPresent,
    feedbackPasses: res.feedbackPasses
  };

  currentResults.results = currentResults.results.filter(r => r.projectId !== 1);
  currentResults.results.unshift(projRecord);
  fs.writeFileSync(resultsPath, JSON.stringify(currentResults, null, 2), 'utf8');
}

completeHealthcare().catch(console.error);

