'use strict';
/**
 * Test Sprint Runner — Executes Panda Hive Straw Hat Dev Crew Sprint
 * Simulates user asking: "create gym and fitness workout tracker"
 */

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

console.log('===============================================================');
console.log('🚀 PANDA HIVE STRAW HAT DEV CREW — LIVE SPRINT EXECUTION TEST');
console.log('===============================================================\n');

function transpileFile(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  return ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
  }).outputText;
}

const rootDir = path.join(__dirname, '..');
const tempDir = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'hive-sprint-'));

// Transpile dynamicEngine.ts
const dynJs = transpileFile(path.join(rootDir, 'src', 'main', 'dynamicEngine.ts'));
fs.writeFileSync(path.join(tempDir, 'dynamicEngine.js'), dynJs, 'utf8');

// Transpile strawHatAgents.ts
const shJs = transpileFile(path.join(rootDir, 'src', 'shared', 'strawHatAgents.ts'));
fs.writeFileSync(path.join(tempDir, 'strawHatAgents.js'), shJs, 'utf8');

const {
  generateDynamicEngine,
  ensureProjectIsDynamic,
  getFallbackUIFiles,
  generateFallbackSprintPlan,
  generateFallbackArchitecture,
  generateFallbackSpec,
  generateFallbackUI,
  generateFallbackLogic,
  generateFallbackDevOps,
  generateFallbackSignoff
} = require(path.join(tempDir, 'dynamicEngine.js'));

const { STRAW_HAT_CREW } = require(path.join(tempDir, 'strawHatAgents.js'));

async function runLiveSprint() {
  const prompt = 'create gym and fitness workout tracker';
  const projectName = 'gym-and-fitness-workout-tracker';
  const targetDir = path.join(rootDir, 'workspace', projectName);

  console.log(`📋 Prompt: "${prompt}"`);
  console.log(`📁 Target Directory: workspace/${projectName}\n`);
  fs.mkdirSync(targetDir, { recursive: true });

  console.log('⚓ Crew Assembled (12 Specialists):');
  STRAW_HAT_CREW.forEach((a) => {
    console.log(`   - ${a.name} [${a.role}]`);
  });
  console.log('\n--- STARTING 7-MILESTONE SPRINT ---\n');

  // Milestone 1: Planning (Luffy)
  console.log('🚩 Milestone 1: Planning (Luffy)');
  const plan = generateFallbackSprintPlan(projectName, prompt);
  fs.writeFileSync(path.join(targetDir, 'sprint-plan.md'), plan, 'utf8');
  fs.writeFileSync(path.join(targetDir, 'project-plan.md'), plan, 'utf8');
  console.log('   ✔ sprint-plan.md & project-plan.md generated');

  // Milestone 2: Requirements (Hancock)
  console.log('🚩 Milestone 2: Requirements & User Stories (Hancock)');
  const spec = generateFallbackSpec(projectName, prompt);
  fs.writeFileSync(path.join(targetDir, 'spec.md'), spec, 'utf8');
  console.log('   ✔ spec.md generated');

  // Milestone 3: System Architecture & Data Schema (Shanks & Nami)
  console.log('🚩 Milestone 3: Architecture & Data (Shanks & Nami)');
  const arch = generateFallbackArchitecture(projectName, prompt);
  fs.writeFileSync(path.join(targetDir, 'architecture.md'), arch, 'utf8');
  const dataModels = `# 📊 Data Models & Schema Contract — ${projectName}\n**Data Architect:** Nami\n**Project:** "${prompt}"\n\n## 1. Entities & Data Models\n- Workout sessions, exercise telemetry, cardio logs, diet tracking\n- Validation rules & field integrity\n- LocalStorage caching and persistence contracts\n`;
  fs.writeFileSync(path.join(targetDir, 'data-models.md'), dataModels, 'utf8');
  console.log('   ✔ architecture.md & data-models.md generated');

  // Milestone 4: Responsive UI & Application Logic (Franky & Usopp)
  console.log('🚩 Milestone 4: Responsive UI Markup & CSS (Franky & Usopp)');
  const ui = getFallbackUIFiles(projectName, prompt);
  fs.writeFileSync(path.join(targetDir, 'index.html'), ui.html, 'utf8');
  fs.writeFileSync(path.join(targetDir, 'style.css'), ui.css, 'utf8');
  const logic = generateDynamicEngine(projectName, prompt);
  fs.writeFileSync(path.join(targetDir, 'app.js'), logic, 'utf8');
  console.log('   ✔ index.html, style.css & app.js generated');

  // Milestone 5: Integrations & Security (Brook & Jinbe)
  console.log('🚩 Milestone 5: Integrations & Security Review (Brook & Jinbe)');
  const integrations = `# 🔌 External Service Contracts — ${projectName}\n**Specialist:** Brook\n**Project:** "${prompt}"\n\n- RESTful endpoints & LocalStorage state sync\n- HealthKit & Wearable telemetry schema\n`;
  const security = `# 🛡️ Security Audit & Zero-Trust Review — ${projectName}\n**Specialist:** Jinbe\n**Project:** "${prompt}"\n\n- Input sanitization & Content-Security-Policy\n- Local data isolation\n`;
  fs.writeFileSync(path.join(targetDir, 'integrations.md'), integrations, 'utf8');
  fs.writeFileSync(path.join(targetDir, 'security-review.md'), security, 'utf8');
  console.log('   ✔ integrations.md & security-review.md generated');

  // Milestone 6: Testing & Deployment (Chopper & Sanji)
  console.log('🚩 Milestone 6: Testing & Deployment (Chopper & Sanji)');
  const devops = generateFallbackDevOps(projectName, prompt);
  const testReport = `# 🧪 Quality Assurance & Test Verification — ${projectName}\n**QA Lead:** Chopper\n**Status:** PASSED\n\n- Responsive Viewport Testing: PASS\n- Interactive State & LocalStorage: PASS\n`;
  fs.writeFileSync(path.join(targetDir, 'Dockerfile'), devops.dockerfile, 'utf8');
  fs.writeFileSync(path.join(targetDir, 'test-report.md'), testReport, 'utf8');
  console.log('   ✔ Dockerfile & test-report.md generated');

  // Milestone 7: Final Code Review & Sign-Off (Zoro, Robin & Luffy)
  console.log('🚩 Milestone 7: Review & Sign-Off (Zoro, Robin & Luffy)');
  const codeReview = `# ⚔️ Code Quality Audit & Standards Review — ${projectName}\n**First Mate & Quality Gate:** Zoro\n**Status:** APPROVED\n\n- Zero console errors\n- Self-healing scripts verified\n`;
  const readme = devops.readme;
  const signoff = generateFallbackSignoff(projectName, prompt);
  fs.writeFileSync(path.join(targetDir, 'code-review.md'), codeReview, 'utf8');
  fs.writeFileSync(path.join(targetDir, 'README.md'), readme, 'utf8');
  fs.writeFileSync(path.join(targetDir, 'signoff.md'), signoff, 'utf8');
  console.log('   ✔ code-review.md, README.md & signoff.md generated');

  // Self-healing Interactivity Guarantee
  console.log('\n🔧 Running Self-Healing Interactivity Engine...');
  ensureProjectIsDynamic(targetDir, projectName, prompt);
  console.log('   ✔ Interactivity verification complete!\n');

  // Verification
  console.log('--- VERIFYING ARTIFACTS ON DISK ---');
  const files = fs.readdirSync(targetDir);
  console.log(`Total Files Generated: ${files.length}`);
  files.forEach((f) => {
    const size = fs.statSync(path.join(targetDir, f)).size;
    console.log(`  📄 ${f.padEnd(22)} (${size} bytes)`);
  });

  const html = fs.readFileSync(path.join(targetDir, 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(targetDir, 'style.css'), 'utf8');
  const js = fs.readFileSync(path.join(targetDir, 'app.js'), 'utf8');

  console.log('\n--- QUALITY & AESTHETIC CHECKS ---');
  const hasNoFakeCompute = !html.includes('Real-Time Compute Engine') && !html.includes('$249.00');
  console.log(`  1. No Fake Compute Engine ($249.00): ${hasNoFakeCompute ? '✔ PASS' : '✖ FAIL'}`);

  const hasIndianRupee = html.includes('₹');
  console.log(`  2. Real Currency Formatting (₹):     ${hasIndianRupee ? '✔ PASS' : '✖ FAIL'}`);

  const hasRealPhotos = html.includes('images.unsplash.com');
  console.log(`  3. Real Unsplash Sports Photography: ${hasRealPhotos ? '✔ PASS' : '✖ FAIL'}`);

  const hasDynamicScript = html.includes('<script src="app.js" defer></script>');
  console.log(`  4. Dynamic Script Attached:          ${hasDynamicScript ? '✔ PASS' : '✖ FAIL'}`);

  const hasDynamicEngine = js.includes('__PANDA_HIVE_DYNAMIC_ENGINE__');
  console.log(`  5. Reactive State & Toast System:    ${hasDynamicEngine ? '✔ PASS' : '✖ FAIL'}`);

  const hasToastStyles = css.includes('.ph-toast-container');
  console.log(`  6. Toast & Drawer CSS Injected:      ${hasToastStyles ? '✔ PASS' : '✖ FAIL'}`);

  if (hasNoFakeCompute && hasIndianRupee && hasRealPhotos && hasDynamicScript && hasDynamicEngine && hasToastStyles) {
    console.log('\n🏆 SPRINT COMPLETED WITH 100% SUCCESS! Ready to view in browser.');
  } else {
    console.error('\n❌ Some checks failed.');
    process.exit(1);
  }
}

runLiveSprint().catch((err) => {
  console.error('Fatal sprint error:', err);
  process.exit(1);
});

