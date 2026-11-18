const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const PORT = 4173;
const RENDERER_DIR = path.resolve(__dirname, '../out/renderer');
const SCREENSHOTS_DIR = path.resolve(__dirname, '../docs/screenshots');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.tmj': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function createStaticServer() {
  return http.createServer((req, res) => {
    let reqPath = decodeURIComponent(req.url.split('?')[0]);
    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

    let filePath = path.join(RENDERER_DIR, reqPath);

    // If file doesn't exist, fallback to index.html (SPA)
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(RENDERER_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    try {
      const content = fs.readFileSync(filePath);
      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    } catch (e) {
      res.writeHead(404);
      res.end('File not found');
    }
  });
}

async function run() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  const server = createStaticServer();
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
  console.log(`AgentHive preview server listening on http://127.0.0.1:${PORT}`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--enable-webgl', '--use-gl=swiftshader']
  });

  const context = await browser.newContext({
    viewport: { width: 1600, height: 950 }
  });

  const page = await context.newPage();

  try {
    console.log('Navigating to AgentHive UI...');
    await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' });

    // Wait for splash animation / canvas to render
    await page.waitForTimeout(4000);

    // 1. Office Floor Main Canvas
    console.log('Capturing: 01_office_floor_main.png');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_office_floor_main.png') });

    // Helper to find and click element by text or selector
    const clickIfVisible = async (selectorOrText) => {
      try {
        let el;
        if (selectorOrText.startsWith('#') || selectorOrText.startsWith('.') || selectorOrText.startsWith('[')) {
          el = await page.$(selectorOrText);
        } else {
          el = await page.$(`button:has-text("${selectorOrText}"), span:has-text("${selectorOrText}"), div:has-text("${selectorOrText}")`);
        }
        if (el && await el.isVisible()) {
          await el.click();
          await page.waitForTimeout(1000);
          return true;
        }
      } catch (err) {
        // ignore
      }
      return false;
    };

    // 2. Open Dual Sprint & Café Panel
    console.log('Looking for Dual Sprint / Straw Hat Panel...');
    const sprintFound = await clickIfVisible('Dual Sprint') || await clickIfVisible('AgentHive') || await clickIfVisible('⚡ Dual Sprint');
    if (sprintFound) {
      console.log('Capturing: 02_dual_sprint_cafe.png');
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_dual_sprint_cafe.png') });
    }

    // 3. Open Skills Tab
    console.log('Looking for Skills tab...');
    const skillsFound = await clickIfVisible('Skills') || await clickIfVisible('Catalog');
    if (skillsFound) {
      console.log('Capturing: 04_skills_catalog.png');
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_skills_catalog.png') });
    }

    // 4. Open Settings Modal
    console.log('Looking for Settings button...');
    const settingsFound = await clickIfVisible('Settings') || await clickIfVisible('⚙') || await clickIfVisible('[aria-label*="Settings"]');
    if (settingsFound) {
      await page.waitForTimeout(1200);
      console.log('Capturing: 05_settings_general.png');
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_settings_general.png') });

      // Click Prerequisites
      if (await clickIfVisible('Prerequisites')) {
        await page.waitForTimeout(1000);
        console.log('Capturing: 06_settings_prerequisites.png');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06_settings_prerequisites.png') });
      }

      // Click Agents & Models
      if (await clickIfVisible('Agents & Models')) {
        await page.waitForTimeout(1000);
        console.log('Capturing: 07_settings_agents_models.png');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07_settings_agents_models.png') });
      }

      // Click Autonomy & Budgets
      if (await clickIfVisible('Autonomy & Budgets')) {
        await page.waitForTimeout(1000);
        console.log('Capturing: 08_settings_autonomy_budgets.png');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08_settings_autonomy_budgets.png') });
      }

      // Click Connections
      if (await clickIfVisible('Connections')) {
        await page.waitForTimeout(1000);
        console.log('Capturing: 09_settings_connections.png');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '09_settings_connections.png') });
      }

      // Click Voice
      if (await clickIfVisible('Voice')) {
        await page.waitForTimeout(1000);
        console.log('Capturing: 10_settings_voice.png');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '10_settings_voice.png') });
      }

      // Close Settings
      await clickIfVisible('close') || await clickIfVisible('Close');
      await page.waitForTimeout(800);
    }

    // 5. Open External Agent Panel or click an Agent (e.g. Sanji / Zoro / Nami)
    console.log('Looking for Agent or External API panel...');
    const agentFound = await clickIfVisible('Sanji') || await clickIfVisible('Zoro') || await clickIfVisible('Luffy') || await clickIfVisible('External Agent');
    if (agentFound) {
      await page.waitForTimeout(1200);
      console.log('Capturing: 03_external_agent_panel.png');
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_external_agent_panel.png') });
    }

    // 6. Look for Kanban / Tasks
    console.log('Looking for Kanban / Tasks...');
    if (await clickIfVisible('Tasks') || await clickIfVisible('Kanban') || await clickIfVisible('Board')) {
      await page.waitForTimeout(1000);
      console.log('Capturing: 11_tasks_kanban.png');
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '11_tasks_kanban.png') });
    }

    // 7. Look for IDE / Files
    console.log('Looking for IDE / Files...');
    if (await clickIfVisible('IDE') || await clickIfVisible('Files') || await clickIfVisible('Code')) {
      await page.waitForTimeout(1000);
      console.log('Capturing: 12_ide_file_editor.png');
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '12_ide_file_editor.png') });
    }

    // 8. Capture Live Generated Apps from workspace
    console.log('Capturing live generated demo applications...');
    const carRacePath = path.resolve(__dirname, '../workspace/car-race/index.html');
    if (fs.existsSync(carRacePath)) {
      await page.goto(`file://${carRacePath}`);
      await page.waitForTimeout(1500);
      console.log('Capturing: 13_live_generated_carrace.png');
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '13_live_generated_carrace.png') });
    }

    const clothManiaPath = path.resolve(__dirname, '../workspace/cloth-mania/index.html');
    if (fs.existsSync(clothManiaPath)) {
      await page.goto(`file://${clothManiaPath}`);
      await page.waitForTimeout(1500);
      console.log('Capturing: 14_live_generated_clothmania.png');
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '14_live_generated_clothmania.png') });
    }

    const cryptoPath = path.resolve(__dirname, '../workspace/crypto/index.html');
    if (fs.existsSync(cryptoPath)) {
      await page.goto(`file://${cryptoPath}`);
      await page.waitForTimeout(1500);
      console.log('Capturing: 15_live_generated_crypto.png');
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '15_live_generated_crypto.png') });
    }

    console.log('All screenshots captured successfully!');
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
    server.close();
  }
}

run().catch(console.error);
