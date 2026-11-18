const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const PORT = 4179;
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

async function captureSettingsTabs() {
  await new Promise(r => server.listen(PORT, '127.0.0.1', r));
  const browser = await chromium.launch({ headless: true, args: ['--enable-webgl', '--use-gl=swiftshader'] });
  const page = await browser.newPage({ viewport: { width: 1600, height: 950 } });

  await page.goto(`http://127.0.0.1:${PORT}/`);
  await page.waitForTimeout(3000);

  const sections = [
    { section: 'General', file: '07_settings_general.png' },
    { section: 'Prerequisites', file: '08_settings_prerequisites.png' },
    { section: 'Agents & Models', file: '09_settings_agents_models.png' },
    { section: 'Autonomy & Budgets', file: '10_settings_autonomy_budgets.png' },
    { section: 'Connections', file: '11_settings_connections.png' },
    { section: 'Voice', file: '12_settings_voice.png' },
    { section: 'Memory & Knowledge', file: '13_settings_memory_knowledge.png' }
  ];

  for (const s of sections) {
    console.log(`Opening Settings -> ${s.section}...`);
    await page.evaluate((sec) => {
      window.dispatchEvent(new CustomEvent('cth:open-settings', { detail: { section: sec } }));
    }, s.section);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, s.file) });
    console.log(`Captured: ${s.file}`);
  }

  console.log('All Settings tabs captured cleanly!');
  await browser.close();
  server.close();
}

captureSettingsTabs().catch(console.error);
