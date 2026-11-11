/**
 * Panda Hive Real Browser Functional Testing & Chopper QA Feedback Loop Verification Suite
 *
 * Verifies:
 * 1. Playwright Headless Chromium launches and tests real DOM events (clicks, forms, search, modals, tabs).
 * 2. Successful interaction detection and DOM state mutation verification.
 * 3. Detection of runtime JavaScript crashes (uncaught pageerror) and console errors.
 * 4. Issue categorization and targeted routing (Franky for HTML/CSS, Usopp for JS, Brook for API, Sanji for Docker).
 * 5. Honest Status Matrix (PASS / FAIL / NOT VERIFIED / APPROVED / REJECTED / CONDITIONAL).
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const loadTs = require('./load-ts.cjs');

const { browserTestRunner } = loadTs('src/main/browserTestRunner.ts');
const { agentTools } = loadTs('src/main/agentTools.ts');
const { extractRelevantComponent } = loadTs('src/main/externalAgentServer.ts');

const testFixtureRoot = path.resolve(__dirname, 'fixtures');

async function setupFixtures() {
  if (!fs.existsSync(testFixtureRoot)) {
    fs.mkdirSync(testFixtureRoot, { recursive: true });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Fixture 1: Healthy Production-Ready Application
  // ───────────────────────────────────────────────────────────────────────────
  const healthyDir = path.join(testFixtureRoot, 'healthy-app');
  if (!fs.existsSync(healthyDir)) fs.mkdirSync(healthyDir, { recursive: true });

  fs.writeFileSync(
    path.join(healthyDir, 'style.css'),
    `
    body { font-family: sans-serif; background: #0f172a; color: #fff; margin: 0; padding: 20px; }
    .hidden { display: none !important; }
    .active { background: #3b82f6; }
    .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; }
    .modal-box { background: #1e293b; padding: 20px; border-radius: 8px; }
    .toast { position: fixed; bottom: 20px; right: 20px; background: #10b981; padding: 10px 20px; border-radius: 6px; }
  `
  );

  fs.writeFileSync(
    path.join(healthyDir, 'index.html'),
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Healthy Clinic Portal</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1>Healthy Clinic Portal</h1>
    <nav>
      <a href="#overview" class="nav-item active" id="tab-overview">Overview</a>
      <a href="#patients" class="nav-item" id="tab-patients">Patients</a>
    </nav>
  </header>

  <main>
    <section id="controls">
      <input type="search" id="search-input" placeholder="Search patients..." />
      <button id="btn-toggle-modal" data-modal-target="#new-patient-modal">New Patient</button>
      <button id="btn-counter">Visits: <span id="count">0</span></button>
    </section>

    <div id="new-patient-modal" class="modal hidden" role="dialog">
      <div class="modal-box">
        <h3>Add Patient</h3>
        <button id="btn-close-modal" class="close" data-modal-close>Close</button>
      </div>
    </div>

    <form id="booking-form">
      <input type="text" id="patient-name" placeholder="Patient Name" required />
      <input type="email" id="patient-email" placeholder="Email Address" required />
      <input type="number" id="patient-age" placeholder="Age" required />
      <button type="submit" id="btn-submit">Register</button>
    </form>

    <ul id="patient-list">
      <li class="patient-item">John Doe (Cardiology)</li>
      <li class="patient-item">Jane Smith (Neurology)</li>
    </ul>

    <div id="toast-container"></div>
  </main>

  <script src="app.js"></script>
</body>
</html>`
  );

  fs.writeFileSync(
    path.join(healthyDir, 'app.js'),
    `document.addEventListener('DOMContentLoaded', () => {
  let count = 0;
  const countEl = document.getElementById('count');
  const btnCounter = document.getElementById('btn-counter');
  const btnToggleModal = document.getElementById('btn-toggle-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const modal = document.getElementById('new-patient-modal');
  const form = document.getElementById('booking-form');
  const searchInput = document.getElementById('search-input');
  const patientList = document.getElementById('patient-list');
  const toastContainer = document.getElementById('toast-container');

  // Counter Click
  if (btnCounter) {
    btnCounter.addEventListener('click', () => {
      count++;
      countEl.textContent = count;
      showToast('Counter incremented');
    });
  }

  // Modal Open / Close
  if (btnToggleModal && modal) {
    btnToggleModal.addEventListener('click', () => {
      modal.classList.remove('hidden');
    });
  }
  if (btnCloseModal && modal) {
    btnCloseModal.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }

  // Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('patient-name').value;
      const li = document.createElement('li');
      li.className = 'patient-item';
      li.textContent = name + ' (Registered)';
      patientList.appendChild(li);
      showToast('Patient registered!');
    });
  }

  // Search Filter
  if (searchInput && patientList) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const items = patientList.querySelectorAll('.patient-item');
      items.forEach((item) => {
        item.style.display = item.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }

  function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    toastContainer.appendChild(t);
    setTimeout(() => t.remove(), 2000);
  }
});`
  );

  // ───────────────────────────────────────────────────────────────────────────
  // Fixture 2: Deliberately Broken Application (Runtime Crash on Click)
  // ───────────────────────────────────────────────────────────────────────────
  const brokenDir = path.join(testFixtureRoot, 'broken-app');
  if (!fs.existsSync(brokenDir)) fs.mkdirSync(brokenDir, { recursive: true });

  fs.writeFileSync(
    path.join(brokenDir, 'index.html'),
    `<!DOCTYPE html>
<html>
<head><title>Broken App</title></head>
<body>
  <button id="btn-crash">Trigger Crash</button>
  <script src="app.js"></script>
</body>
</html>`
  );

  fs.writeFileSync(
    path.join(brokenDir, 'app.js'),
    `document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-crash').addEventListener('click', () => {
    // Deliberate runtime crash: calling non-existent function
    undefinedFunctionThatDoesNotExistAndThrows();
  });
});`
  );

  // ───────────────────────────────────────────────────────────────────────────
  // Fixture 3: Deliberately Broken DOM Structure (Missing app.js linkage)
  // ───────────────────────────────────────────────────────────────────────────
  const missingScriptDir = path.join(testFixtureRoot, 'missing-script-app');
  if (!fs.existsSync(missingScriptDir)) fs.mkdirSync(missingScriptDir, { recursive: true });

  fs.writeFileSync(
    path.join(missingScriptDir, 'index.html'),
    `<!DOCTYPE html>
<html>
<head><title>Missing Script</title></head>
<body>
  <button>Orphan Button</button>
  <!-- Missing script tag -->
</body>
</html>`
  );
  fs.writeFileSync(path.join(missingScriptDir, 'app.js'), `console.log("Unlinked script");`);
}

async function runAllTests() {
  console.log('=== REAL BROWSER FUNCTIONAL TESTING & QA FEEDBACK SUITE ===\n');
  await setupFixtures();

  const healthyDir = path.join(testFixtureRoot, 'healthy-app');
  const brokenDir = path.join(testFixtureRoot, 'broken-app');
  const missingScriptDir = path.join(testFixtureRoot, 'missing-script-app');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✔ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✖ [FAIL] ${name}`);
      console.error(`    Error: ${err.message}`);
      failed++;
    }
  }

  // ─── Test 1: Real Browser Functional Test on Healthy App ───────────────────
  await test('Test 1: Healthy application passes full browser functional testing with Playwright', async () => {
    const report = await browserTestRunner.runDeepBrowserTest(healthyDir);

    assert.strictEqual(report.syntaxValidation, 'PASS', 'Syntax should be PASS');
    assert.strictEqual(report.domValidation, 'PASS', 'DOM should be PASS');
    assert.strictEqual(report.browserFunctionalTesting, 'PASS', 'Browser functional should be PASS');
    assert.strictEqual(report.finalQaApproval, 'APPROVED', 'Decision should be APPROVED');
    assert.ok(report.buttonCount >= 3, `Expected at least 3 buttons, got ${report.buttonCount}`);
    assert.ok(report.formCount >= 1, `Expected at least 1 form, got ${report.formCount}`);
    assert.strictEqual(report.errorsDetected.length, 0, 'Should detect 0 runtime errors');

    // Verify interaction records
    const clickInteractions = report.interactionsTested.filter((i) => i.type === 'click');
    assert.ok(clickInteractions.length > 0, 'Should test button clicks');
    const formInteractions = report.interactionsTested.filter((i) => i.type === 'form_submit');
    assert.ok(formInteractions.length > 0, 'Should test form submission');
    assert.ok(formInteractions[0].success, 'Form submission should succeed');
    assert.strictEqual(formInteractions[0].stateChanged, true, 'Form submission should mutate DOM state');

    console.log(`     Metrics: ${report.interactionsTested.length} interactions tested, ${clickInteractions.length} clicks, ${formInteractions.length} forms.`);
  });

  // ─── Test 2: Runtime Crash Detection and Routing to Usopp ─────────────────
  await test('Test 2: BrowserTest catches uncaught JavaScript crash and routes to Usopp', async () => {
    const report = await browserTestRunner.runDeepBrowserTest(brokenDir);

    assert.strictEqual(report.syntaxValidation, 'PASS', 'Static syntax of broken-app is valid JS');
    assert.strictEqual(report.browserFunctionalTesting, 'FAIL', 'Browser functional test must FAIL on crash');
    assert.strictEqual(report.finalQaApproval, 'REJECTED', 'Decision must be REJECTED');
    assert.ok(report.errorsDetected.length > 0, 'Must capture uncaught runtime exception');

    const runtimeError = report.errorsDetected[0];
    assert.strictEqual(runtimeError.type, 'pageerror');
    assert.ok(runtimeError.message.includes('undefinedFunctionThatDoesNotExistAndThrows'));

    // Verify Chopper routed issue to Usopp
    const usoppIssues = report.issues.filter((i) => i.targetAgentId === 'sh-usopp' && i.category === 'javascript');
    assert.ok(usoppIssues.length > 0, 'Issue must be routed to sh-usopp');
    assert.strictEqual(usoppIssues[0].targetFile, 'app.js');
    console.log(`     Caught crash: "${runtimeError.message}" -> Successfully routed to ${usoppIssues[0].targetAgentId}`);
  });

  // ─── Test 3: Structural HTML Defect Detection and Routing to Franky ────────
  await test('Test 3: BrowserTest catches missing script linkage and routes to Franky', async () => {
    const report = await browserTestRunner.runDeepBrowserTest(missingScriptDir);

    assert.strictEqual(report.domValidation, 'FAIL', 'DOM validation must fail when script is unlinked');
    assert.strictEqual(report.finalQaApproval, 'REJECTED', 'Must reject application with missing script linkage');

    const frankyIssues = report.issues.filter((i) => i.targetAgentId === 'sh-franky' && i.category === 'html');
    assert.ok(frankyIssues.length > 0, 'Issue must be routed to sh-franky');
    assert.strictEqual(frankyIssues[0].targetFile, 'index.html');
    assert.ok(frankyIssues[0].description.includes('app.js'));
    console.log(`     Detected DOM issue: "${frankyIssues[0].description}" -> Successfully routed to ${frankyIssues[0].targetAgentId}`);
  });

  // ─── Test 4: Agent Tools Integration via Chopper Permission Gate ──────────
  await test('Test 4: Chopper executes runRealBrowserTest via agentTools with audit record', async () => {
    const chopperCtx = { agentId: 'sh-chopper', agentName: 'Chopper (QA Doctor)', projectWorkspace: healthyDir };

    agentTools.clearAuditLog();
    const result = await agentTools.runRealBrowserTest(chopperCtx);

    assert.strictEqual(result.finalQaApproval, 'APPROVED');
    const auditLogs = agentTools.getAuditLog();
    assert.ok(auditLogs.length > 0, 'Must record audit log');
    assert.strictEqual(auditLogs[0].toolName, 'BrowserTest');
    assert.strictEqual(auditLogs[0].agentId, 'sh-chopper');
    assert.strictEqual(auditLogs[0].status, 'success');
    console.log(`     Audit summary: Tool "${auditLogs[0].toolName}" by "${auditLogs[0].agentName}" recorded successfully.`);
  });

  // ─── Test 5: Classification of Pointer Interception & Modal Stacking Failures ───
  await test('Test 5: Pointer interception and modal stacking errors classify as CSS and route to Franky with Usopp coordination', async () => {
    const errorMsg = 'locator.click: Timeout 2000ms exceeded. subtree intercepts pointer events';
    const classification = browserTestRunner.classifyInteractionFailure('click', 'Button: ""', errorMsg);

    assert.strictEqual(classification.category, 'css', 'Pointer interception must be classified as css');
    assert.strictEqual(classification.targetAgentId, 'sh-franky', 'Must target sh-franky as primary agent');
    assert.strictEqual(classification.targetFile, 'index.html', 'Must target index.html');
    assert.strictEqual(classification.secondaryAgentId, 'sh-usopp', 'Must assign sh-usopp as secondary agent');
    assert.strictEqual(classification.isCoordinated, true, 'Must flag as coordinated issue');
    console.log(`     Pointer interception classified -> target: ${classification.targetAgentId}, coordinated: ${classification.isCoordinated}`);
  });

  // ─── Test 6: Classification of JavaScript Logic & Event Failures ─────────────
  await test('Test 6: Pure JavaScript runtime failures route to Usopp', async () => {
    const errorMsg = 'TypeError: Cannot read property "map" of undefined';
    const classification = browserTestRunner.classifyInteractionFailure('click', 'Filter Button', errorMsg);

    assert.strictEqual(classification.category, 'javascript', 'Pure JS error must be classified as javascript');
    assert.strictEqual(classification.targetAgentId, 'sh-usopp', 'Must target sh-usopp');
    assert.strictEqual(classification.targetFile, 'app.js', 'Must target app.js');
    console.log(`     Pure JS error classified -> target: ${classification.targetAgentId}, file: ${classification.targetFile}`);
  });

  // ─── Test 7: Component Extraction without Truncation ─────────────────────────
  await test('Test 7: Component extractor extracts targeted modal/form snippet from deep HTML', async () => {
    const bigHtml = `
      <!DOCTYPE html><html><body>
      <header>Top nav</header>
      <main>${'<div>Content filler</div>'.repeat(300)}</main>
      <div id="task-modal" class="modal hidden">
        <div class="card">
          <button id="close-modal-btn">Close</button>
          <form id="task-form"><input id="title" /><button type="submit">Save</button></form>
        </div>
      </div>
      </body></html>
    `;
    const extractedModal = extractRelevantComponent(bigHtml, 'Button click failed for close-modal-btn');
    assert.ok(extractedModal.includes('id="close-modal-btn"'), 'Must extract section with close-modal-btn');
    assert.ok(extractedModal.includes('id="task-modal"'), 'Must include enclosing modal context');

    const extractedForm = extractRelevantComponent(bigHtml, 'Form #1 submission error: form timeout');
    assert.ok(extractedForm.includes('id="task-form"'), 'Must extract form section');
    console.log(`     Component extractor successfully extracted ${extractedModal.length} chars of modal context.`);
  });

  // ─── Clean up fixtures ────────────────────────────────────────────────────
  try {
    fs.rmSync(testFixtureRoot, { recursive: true, force: true });
  } catch {}

  console.log(`\nQA Feedback Loop & Browser Functional Results: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runAllTests().catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
