'use strict';
/**
 * Targeted Autonomous Chess Game Repair Pass Runner
 * Coordinates Franky, Usopp, Chopper, Zoro, and Luffy on workspace/chess-game/
 */
require('dotenv').config();
const path = require('node:path');
const fs = require('node:fs');
const loadTs = require('../test/load-ts.cjs');

const { executeAgentOwnedRepair } = loadTs('src/main/externalAgentServer.ts');

async function main() {
  console.log('================================================================');
  console.log('🛠️ STARTING FOCUSED AUTONOMOUS CHESS REPAIR PASS');
  console.log('================================================================');

  const projectName = 'chess-game';
  const prompt = 'create a simple working chess game for two player';
  const startTime = Date.now();

  try {
    const result = await executeAgentOwnedRepair(projectName, prompt, null, {
      maxRetries: 2,
      phaseName: 'Phase 5.2 Focused Chess Repair'
    });

    console.log('\n================================================================');
    console.log('🏁 CHESS REPAIR PASS COMPLETED');
    console.log('================================================================');
    console.log('Success:                  ', result.success);
    console.log('Final QA Approval:        ', result.finalQaApproval);
    console.log('Browser Functional:       ', result.browserFunctionalTesting);
    console.log('Feedback Passes Executed: ', result.feedbackPasses);
    console.log('Files Modified:           ', result.filesModified);
    console.log('Total Duration:           ', `${((Date.now() - startTime) / 1000).toFixed(1)}s`);

    // Verify workspace files
    const workspaceDir = path.join(process.cwd(), 'workspace', projectName);
    if (fs.existsSync(workspaceDir)) {
      const files = fs.readdirSync(workspaceDir);
      console.log(`\nWorkspace Files (${files.length} files):`);
      for (const f of files) {
        const sz = fs.statSync(path.join(workspaceDir, f)).size;
        console.log(`  - ${f} (${sz} bytes)`);
      }
    }

    process.exit(result.success ? 0 : 1);
  } catch (err) {
    console.error('\n❌ Repair pass failed with error:', err);
    process.exit(1);
  }
}

main();

