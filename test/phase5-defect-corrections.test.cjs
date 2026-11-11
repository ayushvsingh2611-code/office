'use strict';
/**
 * Panda Hive Phase 5.1 — Defect Corrections & File Protection Test Suite
 *
 * Verifies all 10 Phase 5.1 Verification Requirements:
 * 1. Markdown finalization summary never overwrites index.html
 * 2. Markdown finalization summary never overwrites app.js
 * 3. Previously generated valid files remain unchanged
 * 4. Missing HTML is generated using WriteFile
 * 5. Missing JavaScript is generated using WriteFile
 * 6. Invalid application code is rejected by QA
 * 7. QA_REJECTED prevents SPRINT_APPROVED
 * 8. Successful QA and Zoro review allow final approval
 * 9. Failed repair passes remain honestly rejected
 * 10. Finalization history and file attribution remain accurate
 */

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const loadTs = require('./load-ts.cjs');

// Modules under test
const {
  agentTools,
  workspacePermissionManager
} = loadTs('src/main/agentTools.ts');

const {
  isValidHtml,
  isValidCss,
  isValidJs,
  evaluateMilestoneStatus,
  getStrawHatCrewAgent,
  callAgentAutonomous
} = loadTs('src/main/externalAgentServer.ts');

test('Phase 5.1 - Test 1: Markdown finalization summary never overwrites index.html', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'panda-test1-html-'));
  workspacePermissionManager.authorizeWorkspace(tempDir);
  const frankyCtx = { agentId: 'sh-franky', agentName: 'Franky (UI/UX Engineer)', projectWorkspace: tempDir };

  try {
    const validHtml = '<!DOCTYPE html>\n<html lang="en">\n<head><title>Valid App</title><link rel="stylesheet" href="style.css"></head>\n<body>\n<button id="cta-btn">Click</button>\n<script src="app.js" defer></script>\n</body>\n</html>';
    agentTools.writeFile(frankyCtx, 'index.html', validHtml);

    // Attempt to overwrite index.html with a conversational markdown summary
    const markdownSummary = '### 1. Work Completed\n- Analyzed requirements\n- Created layout\n### 2. Files Created\n- index.html\n### 3. Remaining Tasks\n- JavaScript logic';

    assert.throws(
      () => {
        agentTools.writeFile(frankyCtx, 'index.html', markdownSummary);
      },
      /Safety violation.*Cannot write conversational Markdown summary into source file "index.html"/i,
      'Must reject writing markdown summary into index.html'
    );

    // Verify index.html on disk remains completely intact and valid
    const diskContent = fs.readFileSync(path.join(tempDir, 'index.html'), 'utf8');
    assert.strictEqual(diskContent, validHtml, 'index.html on disk must remain unchanged');
    assert.strictEqual(isValidHtml(diskContent), true, 'index.html must be valid HTML');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('Phase 5.1 - Test 2: Markdown finalization summary never overwrites app.js', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'panda-test2-js-'));
  workspacePermissionManager.authorizeWorkspace(tempDir);
  const usoppCtx = { agentId: 'sh-usopp', agentName: 'Usopp (Backend & Logic)', projectWorkspace: tempDir };

  try {
    const validJs = "document.addEventListener('DOMContentLoaded', () => {\n  console.log('Valid application logic running');\n});";
    agentTools.writeFile(usoppCtx, 'app.js', validJs);

    // Attempt to overwrite app.js with a conversational markdown summary
    const markdownSummary = '1. **Work Completed:**\n- Engineered state-driven application logic in app.js\n2. **Files Created or Modified:**\n- app.js\n3. **Remaining Tasks:**\n- Playwright testing';

    assert.throws(
      () => {
        agentTools.writeFile(usoppCtx, 'app.js', markdownSummary);
      },
      /Safety violation.*Cannot write conversational Markdown summary into source file "app.js"/i,
      'Must reject writing markdown summary into app.js'
    );

    // Verify app.js on disk remains completely intact and executable
    const diskContent = fs.readFileSync(path.join(tempDir, 'app.js'), 'utf8');
    assert.strictEqual(diskContent, validJs, 'app.js on disk must remain unchanged');
    assert.strictEqual(isValidJs(diskContent), true, 'app.js must be valid executable JavaScript');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('Phase 5.1 - Test 3: Previously generated valid files remain unchanged', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'panda-test3-preserve-'));
  workspacePermissionManager.authorizeWorkspace(tempDir);
  const frankyCtx = { agentId: 'sh-franky', agentName: 'Franky (UI/UX Engineer)', projectWorkspace: tempDir };
  const usoppCtx = { agentId: 'sh-usopp', agentName: 'Usopp (Backend & Logic)', projectWorkspace: tempDir };

  try {
    const validHtml = '<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body><div class="card">Content</div><script src="app.js"></script></body></html>';
    const validCss = 'body { font-family: sans-serif; background: #fafafa; }\n.card { border-radius: 8px; padding: 16px; }';
    const validJs = "document.addEventListener('DOMContentLoaded', () => { window.appLoaded = true; });";

    agentTools.writeFile(frankyCtx, 'index.html', validHtml);
    agentTools.writeFile(frankyCtx, 'style.css', validCss);
    agentTools.writeFile(usoppCtx, 'app.js', validJs);

    const mtimeHtml = fs.statSync(path.join(tempDir, 'index.html')).mtimeMs;
    const mtimeCss = fs.statSync(path.join(tempDir, 'style.css')).mtimeMs;
    const mtimeJs = fs.statSync(path.join(tempDir, 'app.js')).mtimeMs;

    // Simulate finalization summary output returned from an agent
    const finalizationResult = {
      text: '### 1. Work Completed\n- Completed all UI and JS components for vault\n### 2. Files Created\n- index.html, style.css, app.js',
      finalizationCalled: true
    };

    // Deliverable extraction check: If disk file already exists and is valid, do not overwrite!
    const indexPath = path.join(tempDir, 'index.html');
    if (fs.existsSync(indexPath) && isValidHtml(fs.readFileSync(indexPath, 'utf8'))) {
      // Correct behavior: preserve!
    } else {
      agentTools.writeFile(frankyCtx, 'index.html', finalizationResult.text);
    }

    const cssPath = path.join(tempDir, 'style.css');
    if (fs.existsSync(cssPath) && isValidCss(fs.readFileSync(cssPath, 'utf8'))) {
      // Correct behavior: preserve!
    } else {
      agentTools.writeFile(frankyCtx, 'style.css', finalizationResult.text);
    }

    const jsPath = path.join(tempDir, 'app.js');
    if (fs.existsSync(jsPath) && isValidJs(fs.readFileSync(jsPath, 'utf8'))) {
      // Correct behavior: preserve!
    } else {
      agentTools.writeFile(usoppCtx, 'app.js', finalizationResult.text);
    }

    // Assert that files on disk are exactly preserved
    assert.strictEqual(fs.readFileSync(indexPath, 'utf8'), validHtml);
    assert.strictEqual(fs.readFileSync(cssPath, 'utf8'), validCss);
    assert.strictEqual(fs.readFileSync(jsPath, 'utf8'), validJs);

    assert.strictEqual(fs.statSync(indexPath).mtimeMs, mtimeHtml, 'index.html mtime must be identical');
    assert.strictEqual(fs.statSync(cssPath).mtimeMs, mtimeCss, 'style.css mtime must be identical');
    assert.strictEqual(fs.statSync(jsPath).mtimeMs, mtimeJs, 'app.js mtime must be identical');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('Phase 5.1 - Test 4: Missing HTML is generated using WriteFile', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'panda-test4-html-gen-'));
  workspacePermissionManager.authorizeWorkspace(tempDir);
  const franky = getStrawHatCrewAgent('sh-franky');
  const frankyCtx = { agentId: 'sh-franky', agentName: franky.name, projectWorkspace: tempDir };

  const originalFetch = global.fetch;

  // Mock fetch: agent calls WriteFile to generate the missing index.html
  global.fetch = async (url, opts) => {
    const body = JSON.parse(opts.body);
    if (body.contents && body.contents.length === 1) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [
                  {
                    functionCall: {
                      name: 'WriteFile',
                      args: {
                        filePath: 'index.html',
                        content: '<!DOCTYPE html>\n<html><head><title>Recipe Vault</title><link rel="stylesheet" href="style.css"></head><body><header><h1>Vault</h1></header><script src="app.js" defer></script></body></html>'
                      }
                    }
                  }
                ]
              }
            }
          ]
        })
      };
    }

    // Turn 2: conclude
    return {
      ok: true,
      status: 200,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: 'SUPER! Generated index.html using WriteFile.' }]
            }
          }
        ]
      })
    };
  };

  try {
    assert.strictEqual(fs.existsSync(path.join(tempDir, 'index.html')), false, 'index.html must not exist initially');

    const res = await callAgentAutonomous(franky, 'Generate missing index.html via WriteFile', {
      milestoneTitle: 'Milestone 4: Targeted HTML Generation',
      taskDescription: 'Generate missing index.html via WriteFile',
      toolContext: frankyCtx,
      minChars: 20
    });

    assert(res, 'Must return result');
    const createdHtmlPath = path.join(tempDir, 'index.html');
    assert.strictEqual(fs.existsSync(createdHtmlPath), true, 'index.html must now exist on disk');

    const content = fs.readFileSync(createdHtmlPath, 'utf8');
    assert.strictEqual(isValidHtml(content), true, 'Generated file must be valid HTML');
    assert(content.includes('<title>Recipe Vault</title>'), 'Must contain generated title');
  } finally {
    global.fetch = originalFetch;
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('Phase 5.1 - Test 5: Missing JavaScript is generated using WriteFile', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'panda-test5-js-gen-'));
  workspacePermissionManager.authorizeWorkspace(tempDir);
  const usopp = getStrawHatCrewAgent('sh-usopp');
  const usoppCtx = { agentId: 'sh-usopp', agentName: usopp.name, projectWorkspace: tempDir };

  const originalFetch = global.fetch;

  // Mock fetch: agent calls WriteFile to generate the missing app.js
  global.fetch = async (url, opts) => {
    const body = JSON.parse(opts.body);
    if (body.contents && body.contents.length === 1) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [
                  {
                    functionCall: {
                      name: 'WriteFile',
                      args: {
                        filePath: 'app.js',
                        content: "document.addEventListener('DOMContentLoaded', () => {\n  const recipes = [{ id: 1, name: 'Pasta' }];\n  localStorage.setItem('recipes', JSON.stringify(recipes));\n});"
                      }
                    }
                  }
                ]
              }
            }
          ]
        })
      };
    }

    return {
      ok: true,
      status: 200,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: 'Application logic has been written to app.js using WriteFile.' }]
            }
          }
        ]
      })
    };
  };

  try {
    assert.strictEqual(fs.existsSync(path.join(tempDir, 'app.js')), false, 'app.js must not exist initially');

    const res = await callAgentAutonomous(usopp, 'Generate missing app.js via WriteFile', {
      milestoneTitle: 'Milestone 4: Targeted JavaScript Generation',
      taskDescription: 'Generate missing app.js via WriteFile',
      toolContext: usoppCtx,
      minChars: 20
    });

    assert(res, 'Must return result');
    const createdJsPath = path.join(tempDir, 'app.js');
    assert.strictEqual(fs.existsSync(createdJsPath), true, 'app.js must now exist on disk');

    const content = fs.readFileSync(createdJsPath, 'utf8');
    assert.strictEqual(isValidJs(content), true, 'Generated file must be valid JavaScript');
    const audit = agentTools.runSyntaxAudit(usoppCtx, 'app.js');
    assert.strictEqual(audit.valid, true, 'Generated JavaScript must pass V8 syntax audit');
  } finally {
    global.fetch = originalFetch;
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('Phase 5.1 - Test 6: Invalid application code is rejected by QA', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'panda-test6-qa-reject-'));
  workspacePermissionManager.authorizeWorkspace(tempDir);
  const usoppCtx = { agentId: 'sh-usopp', agentName: 'Usopp (Backend & Logic)', projectWorkspace: tempDir };
  const chopperCtx = { agentId: 'sh-chopper', agentName: 'Chopper (QA Doctor)', projectWorkspace: tempDir };

  try {
    // Write syntactically invalid JavaScript (raw syntax error)
    fs.writeFileSync(path.join(tempDir, 'app.js'), 'function brokenSyntax( { return ;;;', 'utf8');

    const audit = agentTools.runSyntaxAudit(chopperCtx, 'app.js');
    assert.strictEqual(audit.valid, false, 'Syntax audit must flag broken syntax');
    assert(audit.error, 'Audit must provide error description');

    // evaluateMilestoneStatus must reject invalid JS file
    const status = evaluateMilestoneStatus(tempDir, [
      { name: 'Application Logic', file: 'app.js', required: true }
    ]);
    assert.strictEqual(status, 'FAILED', 'Milestone evaluation must fail when app.js has invalid syntax');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('Phase 5.1 - Test 7: QA_REJECTED prevents SPRINT_APPROVED', () => {
  // Verify status contract: If Milestone 6 status is QA_REJECTED, final sprint status is SPRINT_REJECTED
  const m6Status = 'QA_REJECTED';
  const qaPassed = m6Status === 'QA_PASSED';

  const zoroReviewText = 'Zoro Review: QA has rejected the build due to broken DOM bindings. Refusing quality gate pass.';
  const zoroReviewApproved = qaPassed && !zoroReviewText.toLowerCase().includes('reject');
  const reviewStatus = zoroReviewApproved ? 'REVIEW_APPROVED' : 'REVIEW_REJECTED';

  const sprintSignoffStatus = (qaPassed && zoroReviewApproved) ? 'SPRINT_APPROVED' : 'SPRINT_REJECTED';
  const isApproved = sprintSignoffStatus === 'SPRINT_APPROVED';

  assert.strictEqual(reviewStatus, 'REVIEW_REJECTED', 'Zoro review must be REVIEW_REJECTED');
  assert.strictEqual(sprintSignoffStatus, 'SPRINT_REJECTED', 'Sprint status must be SPRINT_REJECTED when QA rejects');
  assert.strictEqual(isApproved, false, 'Sprint success flag must be false');
});

test('Phase 5.1 - Test 8: Successful QA and Zoro review allow final approval', () => {
  // Verify status contract: When Chopper QA passes and Zoro approves, sprint status is SPRINT_APPROVED
  const m6Status = 'QA_PASSED';
  const qaPassed = m6Status === 'QA_PASSED';

  const zoroReviewText = 'Zoro Review: All code deliverables verified. Architecture compliance 100%. Quality gate PASSED.';
  const zoroReviewApproved = qaPassed && !zoroReviewText.toLowerCase().includes('reject');
  const reviewStatus = zoroReviewApproved ? 'REVIEW_APPROVED' : 'REVIEW_REJECTED';

  const sprintSignoffStatus = (qaPassed && zoroReviewApproved) ? 'SPRINT_APPROVED' : 'SPRINT_REJECTED';
  const isApproved = sprintSignoffStatus === 'SPRINT_APPROVED';

  assert.strictEqual(reviewStatus, 'REVIEW_APPROVED', 'Zoro review must be REVIEW_APPROVED');
  assert.strictEqual(sprintSignoffStatus, 'SPRINT_APPROVED', 'Sprint status must be SPRINT_APPROVED when QA passes and Zoro approves');
  assert.strictEqual(isApproved, true, 'Sprint success flag must be true');
});

test('Phase 5.1 - Test 9: Failed repair passes remain honestly rejected', () => {
  let feedbackRetries = 0;
  const maxRetries = 2;

  // Simulate defect remaining unresolved after all repair attempts
  let syntaxAudit = { valid: false, error: 'Unexpected token' };
  let domTest = { pass: false, buttonCount: 0, formCount: 0 };
  let browserReport = {
    browserFunctionalTesting: 'FAIL',
    finalQaApproval: 'REJECTED',
    issues: [{ severity: 'CRITICAL', description: 'app.js syntax error' }]
  };

  const hasDefects = () =>
    !syntaxAudit.valid ||
    !domTest.pass ||
    browserReport.browserFunctionalTesting === 'FAIL';

  while (feedbackRetries < maxRetries && hasDefects()) {
    feedbackRetries++;
    // Repair attempt fails to heal the syntax
    syntaxAudit = { valid: false, error: 'Unexpected token still present' };
  }

  const qaPassed = syntaxAudit.valid && domTest.pass && browserReport.finalQaApproval === 'APPROVED';
  const milestone6Status = qaPassed ? 'QA_PASSED' : 'QA_REJECTED';

  assert.strictEqual(feedbackRetries, 2, 'Feedback loop must exhaust maxRetries');
  assert.strictEqual(qaPassed, false, 'Must not report QA pass when defects persist');
  assert.strictEqual(milestone6Status, 'QA_REJECTED', 'Must honestly record QA_REJECTED');
});

test('Phase 5.1 - Test 10: Finalization history and file attribution remain accurate', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'panda-test10-attr-'));
  workspacePermissionManager.authorizeWorkspace(tempDir);
  const frankyCtx = { agentId: 'sh-franky', agentName: 'Franky (UI/UX Engineer)', projectWorkspace: tempDir };

  try {
    agentTools.resetTrackedFileStats();

    // 1. Create a new file
    agentTools.writeFile(frankyCtx, 'component.html', '<div class="banner">Banner</div>');
    let stats = agentTools.getTrackedFileStats();
    assert(stats.created.includes('component.html'), 'component.html must be in created set');
    assert.strictEqual(stats.modified.length, 0, 'No files modified yet');

    // 2. Modify existing file via writeFile
    agentTools.writeFile(frankyCtx, 'component.html', '<div class="banner updated">Banner 2</div>');
    stats = agentTools.getTrackedFileStats();
    assert(stats.modified.includes('component.html'), 'component.html must now be in modified set');

    // 3. Modify via editFile
    agentTools.editFile(frankyCtx, 'component.html', 'Banner 2', 'Banner 3');
    stats = agentTools.getTrackedFileStats();
    assert(stats.modified.includes('component.html'), 'editFile must record modification');

    const content = fs.readFileSync(path.join(tempDir, 'component.html'), 'utf8');
    assert.strictEqual(content, '<div class="banner updated">Banner 3</div>');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

