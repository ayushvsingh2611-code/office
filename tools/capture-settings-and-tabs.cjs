const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const PORT = 4177;
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
  '.svg': 'image/svg+xml'
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

async function captureTabs() {
  await new Promise(r => server.listen(PORT, '127.0.0.1', r));
  const browser = await chromium.launch({ headless: true, args: ['--enable-webgl', '--use-gl=swiftshader'] });
  const page = await browser.newPage({ viewport: { width: 1600, height: 950 } });

  // 1. Capture Settings Tabs
  console.log('Capturing Settings Tabs...');
  await page.goto(`http://127.0.0.1:${PORT}/`);
  await page.waitForTimeout(3000);

  // Click v0.1.0 to open settings
  await page.click('button:has-text("v0.1.0")');
  await page.waitForTimeout(1500);

  const sections = [
    { name: 'Prerequisites', file: '08_settings_prerequisites.png' },
    { name: 'Agents & Models', file: '09_settings_agents_models.png' },
    { name: 'Autonomy & Budgets', file: '10_settings_autonomy_budgets.png' },
    { name: 'Connections', file: '11_settings_connections.png' },
    { name: 'Voice', file: '12_settings_voice.png' },
    { name: 'Memory & Knowledge', file: '13_settings_memory_knowledge.png' },
    { name: 'General', file: '07_settings_general.png' }
  ];

  for (const s of sections) {
    console.log(`Clicking Settings -> ${s.name}...`);
    const btn = page.locator(`button:has-text("${s.name}")`).first();
    if (await btn.isVisible()) {
      await btn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, s.file) });
      console.log(`Saved: ${s.file}`);
    }
  }

  // Close Settings
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);

  // 2. Capture Skills tab
  console.log('Clicking Skills...');
  const skillsBtn = page.locator('button:has-text("skills")').first();
  if (await skillsBtn.isVisible()) {
    await skillsBtn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_skills_catalog.png') });
    console.log('Saved: 04_skills_catalog.png');
  }

  // 3. Capture Tasks tab
  console.log('Clicking Tasks...');
  const tasksBtn = page.locator('button:has-text("tasks")').first();
  if (await tasksBtn.isVisible()) {
    await tasksBtn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_tasks_kanban.png') });
    console.log('Saved: 05_tasks_kanban.png');
  }

  // 4. Capture Triggers tab
  console.log('Clicking Triggers...');
  const triggersBtn = page.locator('button:has-text("triggers")').first();
  if (await triggersBtn.isVisible()) {
    await triggersBtn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05b_triggers_panel.png') });
    console.log('Saved: 05b_triggers_panel.png');
  }

  // 5. Capture IDE
  console.log('Clicking IDE...');
  const ideBtn = page.locator('button:has-text("IDE")').first();
  if (await ideBtn.isVisible()) {
    await ideBtn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06_ide_file_editor.png') });
    console.log('Saved: 06_ide_file_editor.png');
  }

  console.log('Done capturing tabs!');
  await browser.close();
  server.close();
}

captureTabs().catch(console.error);
