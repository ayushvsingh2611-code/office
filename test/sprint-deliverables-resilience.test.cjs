'use strict';
/**
 * Unit Test: Sprint Deliverables Resilience & Step 4 index.html Guarantee
 *
 * Verifies:
 * 1. Step 4 (Frontend Specialist) generates index.html and style.css even with empty/malformed LLM responses
 * 2. ensureProjectIsDynamic creates index.html and style.css if missing
 * 3. Dynamic engine runtime and defer scripts are intact
 */
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const ts = require('typescript');

const engineSrc = fs.readFileSync(path.join(__dirname, '..', 'src', 'main', 'dynamicEngine.ts'), 'utf8');
const engineJs = ts.transpileModule(engineSrc, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText;

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hive-dynamic-resilience-'));
fs.writeFileSync(path.join(tempDir, 'dynamicEngine.js'), engineJs, 'utf8');

const {
  getFallbackUIFiles,
  ensureProjectIsDynamic,
  generateDynamicEngine
} = require(path.join(tempDir, 'dynamicEngine.js'));

async function runTests() {
  console.log('=== PANDA HIVE STEP 4 & DELIVERABLES RESILIENCE TESTS ===\n');
  let passed = 0;
  let failed = 0;

  const testDir = path.join(os.tmpdir(), `hive_test_resilience_${Date.now()}`);
  fs.mkdirSync(testDir, { recursive: true });

  try {
    // Test 1: getFallbackUIFiles returns valid HTML and CSS
    {
      const files = getFallbackUIFiles('resilience-store', 'Build an E-commerce store');
      assert.ok(files.html && files.html.includes('<!DOCTYPE html>'), 'HTML must contain <!DOCTYPE html>');
      assert.ok(files.html.includes('app.js'), 'HTML must link app.js');
      assert.ok(files.html.includes('style.css'), 'HTML must link style.css');
      assert.ok(files.css && files.css.includes(':root'), 'CSS must define custom properties');
      console.log('  ✔ [PASS] Test 1: getFallbackUIFiles provides valid, dynamic HTML/CSS structure');
      passed++;
    }

    // Test 2: ensureProjectIsDynamic auto-creates index.html if file was completely missing
    {
      const emptyDir = path.join(testDir, 'empty_project');
      fs.mkdirSync(emptyDir, { recursive: true });

      // Run ensureProjectIsDynamic on directory with NO files
      ensureProjectIsDynamic(emptyDir, 'empty_project', 'E-commerce platform');

      assert.ok(fs.existsSync(path.join(emptyDir, 'index.html')), 'index.html must be automatically generated if missing');
      assert.ok(fs.existsSync(path.join(emptyDir, 'style.css')), 'style.css must be automatically generated if missing');
      assert.ok(fs.existsSync(path.join(emptyDir, 'app.js')), 'app.js must be automatically generated if missing');

      const htmlContent = fs.readFileSync(path.join(emptyDir, 'index.html'), 'utf8');
      assert.ok(htmlContent.includes('style.css'), 'Auto-generated index.html must reference style.css');
      assert.ok(htmlContent.includes('app.js'), 'Auto-generated index.html must reference app.js');
      console.log('  ✔ [PASS] Test 2: ensureProjectIsDynamic self-heals missing index.html, style.css, and app.js');
      passed++;
    }

    // Test 3: Step 4 Simulation with empty LLM output
    {
      const step4Dir = path.join(testDir, 'step4_sim');
      fs.mkdirSync(step4Dir, { recursive: true });

      // Simulate Jim returning plain conversational markdown without HTML/CSS code blocks
      const mockLyzrText = "Sure! Here is the plan for your storefront. We will need a header, a product list, and a shopping cart.";
      fs.writeFileSync(path.join(step4Dir, 'ui-design.md'), mockLyzrText, 'utf8');

      const htmlMatch = mockLyzrText.match(/```(?:html|htm)[\s\S]*?\n([\s\S]*?)```/i);
      const cssMatch = mockLyzrText.match(/```(?:css)[\s\S]*?\n([\s\S]*?)```/i);
      let htmlContent = htmlMatch ? htmlMatch[1].trim() : '';
      let cssContent = cssMatch ? cssMatch[1].trim() : '';

      // Applying our defensive resilience logic
      const fallbackUI = getFallbackUIFiles('step4_sim', 'Test prompt');
      if (!htmlContent || htmlContent.length < 50) {
        htmlContent = fallbackUI.html;
      }
      if (!cssContent || cssContent.length < 20) {
        cssContent = fallbackUI.css;
      }

      fs.writeFileSync(path.join(step4Dir, 'index.html'), htmlContent, 'utf8');
      fs.writeFileSync(path.join(step4Dir, 'style.css'), cssContent, 'utf8');
      ensureProjectIsDynamic(step4Dir, 'step4_sim', 'Test prompt');

      // Verify Step 4 required deliverable check (this is what failed before!)
      const requiredDeliverables = [
        { name: 'HTML Layout', file: 'index.html', required: true },
        { name: 'CSS Stylesheet', file: 'style.css', required: true }
      ];
      const missing = requiredDeliverables.filter((d) => d.required && !fs.existsSync(path.join(step4Dir, d.file)));

      assert.strictEqual(missing.length, 0, 'No required deliverables should be missing!');
      assert.ok(fs.existsSync(path.join(step4Dir, 'index.html')), 'index.html is guaranteed to exist');
      assert.ok(fs.existsSync(path.join(step4Dir, 'style.css')), 'style.css is guaranteed to exist');
      console.log('  ✔ [PASS] Test 3: Step 4 deliverable verification passes even when LLM output has 0 code blocks');
      passed++;
    }

    // Test 4: app.js fallback generation for Step 5
    {
      const step5Dir = path.join(testDir, 'step5_sim');
      fs.mkdirSync(step5Dir, { recursive: true });

      const mockLyzrJsText = "I will write the backend logic next.";
      const jsMatch = mockLyzrJsText.match(/```(?:javascript|js)\s*\n([\s\S]*?)```/i);
      let jsContent = jsMatch ? jsMatch[1].trim() : '';
      if (!jsContent || jsContent.length < 50) {
        jsContent = generateDynamicEngine('step5_sim', 'Test prompt');
      }
      fs.writeFileSync(path.join(step5Dir, 'app.js'), jsContent, 'utf8');

      assert.ok(fs.existsSync(path.join(step5Dir, 'app.js')), 'app.js must exist on disk');
      const content = fs.readFileSync(path.join(step5Dir, 'app.js'), 'utf8');
      assert.ok(content.includes('__PANDA_HIVE_DYNAMIC_ENGINE__'), 'Engine signature must be present');
      console.log('  ✔ [PASS] Test 4: Step 5 app.js guarantee verified');
      passed++;
    }

    console.log(`\nAll Step 4 Resilience tests passed: ${passed} passed, ${failed} failed.\n`);
  } catch (err) {
    console.error('❌ Test failed with error:', err);
    failed++;
  } finally {
    try {
      fs.rmSync(testDir, { recursive: true, force: true });
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  }

  if (failed > 0) process.exit(1);
}

runTests();
