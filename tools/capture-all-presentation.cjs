const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const PORT = 4176;
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
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  let filePath = path.join(RENDERER_DIR, reqPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(RENDERER_DIR, 'index.html');
  }
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  try {
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': contentType, 'Access-Control-Allow-Origin': '*' });
    res.end(content);
  } catch (e) {
    res.writeHead(404);
    res.end('404');
  }
});

async function captureAll() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  await new Promise(r => server.listen(PORT, '127.0.0.1', r));
  console.log(`Server listening on http://127.0.0.1:${PORT}`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--enable-webgl', '--use-gl=swiftshader']
  });

  const context = await browser.newContext({
    viewport: { width: 1600, height: 950 }
  });

  const page = await context.newPage();

  console.log('Loading AgentHive...');
  await page.goto(`http://127.0.0.1:${PORT}/`);
  await page.waitForTimeout(4000);

  // 1. Office Floor Main Canvas
  console.log('1. Capturing Office Floor Canvas...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_office_floor_main.png') });

  // 2. Dual Sprint & Café Panel
  console.log('2. Opening Dual Sprint & Café...');
  const dualSprintBtn = await page.locator('button', { hasText: 'Dual Sprint' }).first();
  if (await dualSprintBtn.isVisible()) {
    await dualSprintBtn.click();
    await page.waitForTimeout(1500);
    console.log('Capturing: 02_dual_sprint_cafe.png');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_dual_sprint_cafe.png') });

    // Close Dual Sprint by clicking the close button '✕'
    const closeBtn = await page.locator('button', { hasText: '✕' }).first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(1000);
  }

  // 3. Sanji (Group 1 - Verifier) External Agent Panel
  console.log('3. Opening Sanji External Agent Panel...');
  const sanjiCard = await page.locator('button', { hasText: 'SANJI (GROUP 1 - VERIFIER)' }).first();
  if (await sanjiCard.isVisible()) {
    await sanjiCard.click();
    await page.waitForTimeout(1500);
    console.log('Capturing: 03_external_agent_sanji.png');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_external_agent_sanji.png') });
  }

  // 4. Skills Catalog Tab
  console.log('4. Opening Skills Catalog...');
  const skillsTab = await page.locator('button', { hasText: 'skills' }).first();
  if (await skillsTab.isVisible()) {
    await skillsTab.click();
    await page.waitForTimeout(1500);
    console.log('Capturing: 04_skills_catalog.png');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_skills_catalog.png') });
  }

  // 5. Tasks Kanban Board
  console.log('5. Opening Tasks Kanban Board...');
  const tasksTab = await page.locator('button', { hasText: 'tasks' }).first();
  if (await tasksTab.isVisible()) {
    await tasksTab.click();
    await page.waitForTimeout(1500);
    console.log('Capturing: 05_tasks_kanban.png');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_tasks_kanban.png') });
  }

  // 6. IDE / Project File Tree
  console.log('6. Opening IDE Workspace...');
  const ideBtn = await page.locator('button', { hasText: 'IDE' }).first();
  if (await ideBtn.isVisible()) {
    await ideBtn.click();
    await page.waitForTimeout(1500);
    console.log('Capturing: 06_ide_file_editor.png');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06_ide_file_editor.png') });
    // toggle back
    await ideBtn.click();
    await page.waitForTimeout(800);
  }

  // 7. Settings Modal
  console.log('7. Opening Settings Modal via v0.1.0 button...');
  const settingsBtn = await page.locator('button', { hasText: 'v0.1.0' }).first();
  if (await settingsBtn.isVisible()) {
    await settingsBtn.click();
    await page.waitForTimeout(1500);
    console.log('Capturing: 07_settings_general.png');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07_settings_general.png') });

    // Prerequisites Tab
    console.log('7a. Settings -> Prerequisites...');
    const prereqTab = await page.locator('button', { hasText: 'Prerequisites' }).first();
    if (await prereqTab.isVisible()) {
      await prereqTab.click();
      await page.waitForTimeout(1200);
      console.log('Capturing: 08_settings_prerequisites.png');
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08_settings_prerequisites.png') });
    }

    // Agents & Models Tab
    console.log('7b. Settings -> Agents & Models...');
    const agentsTab = await page.locator('button', { hasText: 'Agents & Models' }).first();
    if (await agentsTab.isVisible()) {
      await agentsTab.click();
      await page.waitForTimeout(1200);
      console.log('Capturing: 09_settings_agents_models.png');
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '09_settings_agents_models.png') });
    }

    // Autonomy & Budgets Tab
    console.log('7c. Settings -> Autonomy & Budgets...');
    const autonomyTab = await page.locator('button', { hasText: 'Autonomy & Budgets' }).first();
    if (await autonomyTab.isVisible()) {
      await autonomyTab.click();
      await page.waitForTimeout(1200);
      console.log('Capturing: 10_settings_autonomy_budgets.png');
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '10_settings_autonomy_budgets.png') });
    }

    // Connections Tab
    console.log('7d. Settings -> Connections...');
    const connectionsTab = await page.locator('button', { hasText: 'Connections' }).first();
    if (await connectionsTab.isVisible()) {
      await connectionsTab.click();
      await page.waitForTimeout(1200);
      console.log('Capturing: 11_settings_connections.png');
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '11_settings_connections.png') });
    }

    // Voice Tab
    console.log('7e. Settings -> Voice...');
    const voiceTab = await page.locator('button', { hasText: 'Voice' }).first();
    if (await voiceTab.isVisible()) {
      await voiceTab.click();
      await page.waitForTimeout(1200);
      console.log('Capturing: 12_settings_voice.png');
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '12_settings_voice.png') });
    }

    // Memory & Knowledge Tab
    console.log('7f. Settings -> Memory & Knowledge...');
    const memTab = await page.locator('button', { hasText: 'Memory & Knowledge' }).first();
    if (await memTab.isVisible()) {
      await memTab.click();
      await page.waitForTimeout(1200);
      console.log('Capturing: 13_settings_memory_knowledge.png');
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '13_settings_memory_knowledge.png') });
    }

    // Close Settings
    const closeBtn = await page.locator('button', { hasText: 'close' }).first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(800);
  }

  // 8. Capture Live Generated Apps from Workspace
  console.log('8. Capturing live generated apps from workspace...');
  const carRacePath = path.resolve(__dirname, '../workspace/car-race/index.html');
  if (fs.existsSync(carRacePath)) {
    await page.goto(`file://${carRacePath}`);
    await page.waitForTimeout(1500);
    console.log('Capturing: 14_live_generated_carrace.png');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '14_live_generated_carrace.png') });
  }

  const clothManiaPath = path.resolve(__dirname, '../workspace/cloth-mania/index.html');
  if (fs.existsSync(clothManiaPath)) {
    await page.goto(`file://${clothManiaPath}`);
    await page.waitForTimeout(1500);
    console.log('Capturing: 15_live_generated_clothmania.png');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '15_live_generated_clothmania.png') });
  }

  const cryptoPath = path.resolve(__dirname, '../workspace/crypto/index.html');
  if (fs.existsSync(cryptoPath)) {
    await page.goto(`file://${cryptoPath}`);
    await page.waitForTimeout(1500);
    console.log('Capturing: 16_live_generated_crypto.png');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '16_live_generated_crypto.png') });
  }

  console.log('SUCCESS! All 16 presentation screenshots captured.');
  await browser.close();
  server.close();
}

captureAll().catch(console.error);
