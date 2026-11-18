const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const PORT = 4178;
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

(async () => {
  await new Promise(r => server.listen(PORT, '127.0.0.1', r));
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 950 } });

  await page.goto(`http://127.0.0.1:${PORT}/`);
  await page.waitForTimeout(3000);

  // Click v0.1.0 to open settings
  await page.click('button:has-text("v0.1.0")');
  await page.waitForTimeout(1500);

  // Print all buttons currently inside the modal
  const modalButtons = await page.$$eval('button', els => els.map(e => ({ text: e.innerText.trim(), visible: e.offsetParent !== null })));
  console.log('MODAL BUTTONS:', modalButtons.filter(b => b.visible));

  // Let's click Prerequisites directly
  const prereqBtn = await page.$('button:text-is("Prerequisites"), button:has-text("Prerequisites")');
  if (prereqBtn) {
    console.log('Found prereqBtn! Clicking...');
    await prereqBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08_settings_prerequisites.png') });
  }

  // Click Agents & Models
  const agentsBtn = await page.$('button:text-is("Agents & Models"), button:has-text("Agents & Models")');
  if (agentsBtn) {
    console.log('Found agentsBtn! Clicking...');
    await agentsBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '09_settings_agents_models.png') });
  }

  // Click Autonomy & Budgets
  const autonomyBtn = await page.$('button:text-is("Autonomy & Budgets"), button:has-text("Autonomy & Budgets")');
  if (autonomyBtn) {
    console.log('Found autonomyBtn! Clicking...');
    await autonomyBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '10_settings_autonomy_budgets.png') });
  }

  // Click Connections
  const connBtn = await page.$('button:text-is("Connections"), button:has-text("Connections")');
  if (connBtn) {
    console.log('Found connBtn! Clicking...');
    await connBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '11_settings_connections.png') });
  }

  // Click Voice
  const voiceBtn = await page.$('button:text-is("Voice"), button:has-text("Voice")');
  if (voiceBtn) {
    console.log('Found voiceBtn! Clicking...');
    await voiceBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '12_settings_voice.png') });
  }

  // Click Memory & Knowledge
  const memBtn = await page.$('button:text-is("Memory & Knowledge"), button:has-text("Memory & Knowledge")');
  if (memBtn) {
    console.log('Found memBtn! Clicking...');
    await memBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '13_settings_memory_knowledge.png') });
  }

  await browser.close();
  server.close();
})();
