const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const PORT = 4180;
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

  // Click .cth-settings-btn to open settings
  await page.click('.cth-settings-btn');
  await page.waitForTimeout(1500);

  // Take screenshot of General
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07_settings_general.png') });
  console.log('Saved 07_settings_general.png');

  // Find all buttons on the left sidebar of settings
  const navTabs = ['Prerequisites', 'Agents & Models', 'Autonomy & Budgets', 'Connections', 'Voice', 'Memory & Knowledge'];
  const fileNames = {
    'Prerequisites': '08_settings_prerequisites.png',
    'Agents & Models': '09_settings_agents_models.png',
    'Autonomy & Budgets': '10_settings_autonomy_budgets.png',
    'Connections': '11_settings_connections.png',
    'Voice': '12_settings_voice.png',
    'Memory & Knowledge': '13_settings_memory_knowledge.png'
  };

  for (const tab of navTabs) {
    console.log(`Clicking ${tab}...`);
    // Click the button whose text matches tab
    const clicked = await page.evaluate((tabName) => {
      const btns = Array.from(document.querySelectorAll('button'));
      const target = btns.find(b => b.innerText.trim() === tabName);
      if (target) {
        target.click();
        return true;
      }
      return false;
    }, tab);

    console.log(`Clicked ${tab}: ${clicked}`);
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, fileNames[tab]) });
    console.log(`Saved ${fileNames[tab]}`);
  }

  await browser.close();
  server.close();
})();
