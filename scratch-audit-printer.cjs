'use strict';
const fs = require('fs');

const audit = JSON.parse(fs.readFileSync('workspace/flashcard-study-hub/execution-audit.json', 'utf8'));

console.log('=== PANDA HIVE LIVE SPRINT: 12 AGENTS EXECUTION AUDIT ===\n');
for (const m of (audit.milestones || [])) {
  console.log('--------------------------------------------------');
  console.log('Step ' + m.stepNum + ': ' + m.agentName + ' (' + m.agentId + ')');
  console.log('  Role: ' + m.role);
  console.log('  Provider & Model: ' + m.provider + ' (' + m.model + (m.keyIndex ? ' key #' + m.keyIndex : '') + ')');
  console.log('  Duration: ' + m.durationMs + 'ms');
  console.log('  Tools Executed (' + m.toolCallsCount + '): ' + (m.toolCallsExecuted || []).map(t => t.toolName).join(', '));
  console.log('  Files Written: ' + (m.filesWritten || []).join(', '));
  console.log('  Status: ' + m.status);
}

console.log('\n=== CHOPPER QA REPORT SUMMARY ===');
const testReport = fs.readFileSync('workspace/flashcard-study-hub/test-report.md', 'utf8');
console.log(testReport.slice(0, 1200));

console.log('\n=== ZORO CODE REVIEW SUMMARY ===');
const codeReview = fs.readFileSync('workspace/flashcard-study-hub/code-review.md', 'utf8');
console.log(codeReview.slice(0, 800));

console.log('\n=== LUFFY SPRINT SIGNOFF ===');
const signoff = fs.readFileSync('workspace/flashcard-study-hub/sprint-signoff.md', 'utf8');
console.log(signoff.slice(0, 800));

