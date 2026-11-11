'use strict';
/**
 * Autonomous Fresh Chess Game Sprint Runner
 * Executes a completely fresh sprint through Panda Hive with the 12 Straw Hat Crew agents.
 */
require('dotenv').config();
const path = require('node:path');
const fs = require('node:fs');
const loadTs = require('../test/load-ts.cjs');

const { orchestrateTeamSprint } = loadTs('src/main/externalAgentServer.ts');

async function main() {
  console.log('================================================================');
  console.log('🚀 STARTING FRESH AUTONOMOUS CHESS GAME SPRINT VIA PANDA HIVE');
  console.log('================================================================');

  const prompt = 'create a simple working chess game for two player';
  const startTime = Date.now();

  try {
    const result = await orchestrateTeamSprint(prompt, null);

    console.log('\n================================================================');
    console.log('🏁 SPRINT EXECUTION FINISHED');
    console.log('================================================================');
    console.log('Project Name:            ', result.projectName);
    console.log('Success:                 ', result.success);
    console.log('Execution Status:        ', result.executionStatus);
    console.log('Sprint Status:           ', result.sprintStatus);
    console.log('QA Status:               ', result.qaStatus);
    console.log('Final QA Approval:       ', result.finalQaApproval);
    console.log('Browser Functional:      ', result.browserFunctionalTesting);
    console.log('Duration Total:          ', `${result.durationTotalSec}s`);

    const workspaceDir = path.join(process.cwd(), 'workspace', result.projectName);
    if (fs.existsSync(workspaceDir)) {
      const files = fs.readdirSync(workspaceDir);
      console.log(`\nFiles Generated in workspace/${result.projectName} (${files.length} files):`);
      for (const f of files) {
        const sz = fs.statSync(path.join(workspaceDir, f)).size;
        console.log(`  - ${f} (${sz} bytes)`);
      }
    }

    if (result.milestones) {
      console.log('\nMilestone Summary:');
      for (const m of result.milestones) {
        console.log(`  Step ${m.stepNum} (${m.agentName}): ${m.status} | ${m.toolCallsCount} tool calls | Provider: ${m.provider} (${m.model}) | Duration: ${m.durationMs}ms`);
      }
    }

    // Write sprint summary json
    const summaryPath = path.join(process.cwd(), 'workspace', result.projectName, 'sprint-result.json');
    fs.writeFileSync(summaryPath, JSON.stringify(result, null, 2), 'utf8');
    console.log(`\nSprint result saved to: ${summaryPath}`);

    process.exit(result.success ? 0 : 1);
  } catch (err) {
    console.error('\n❌ Sprint Execution Failed with Exception:', err);
    process.exit(1);
  }
}

main();

