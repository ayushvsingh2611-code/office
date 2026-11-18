const { _electron: electron } = require('playwright');
const path = require('path');
const fs = require('fs');

async function capture() {
  const screenshotDir = path.resolve(__dirname, '../docs/screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  console.log('Launching AgentHive with Playwright Electron...');
  const appPath = path.resolve(__dirname, '..');
  
  const electronApp = await electron.launch({
    args: [path.join(appPath, 'out/main/index.js')],
    env: {
      ...process.env,
      NODE_ENV: 'production'
    }
  });

  try {
    const window = await electronApp.firstWindow();
    await window.setViewportSize({ width: 1440, height: 900 });
    console.log('Main window loaded. Waiting for network and rendering...');
    await window.waitForTimeout(4000);

    // 1. Office Floor Overview
    console.log('Capturing 01_office_floor_overview.png...');
    await window.screenshot({ path: path.join(screenshotDir, '01_office_floor_overview.png') });

    // Look for panels and tabs
    // Check available buttons/tabs on screen
    const buttons = await window.$$eval('button', els => els.map(e => ({ text: e.innerText.trim(), id: e.id, class: e.className })));
    console.log('Found buttons:', buttons.slice(0, 25));

    // Try clicking Dual Sprint / Agent Hive button if available
    const dualSprintBtn = await window.$('button:has-text("Dual Sprint"), button:has-text("AgentHive"), button:has-text("⚡"), button:has-text("Sprint")');
    if (dualSprintBtn) {
      console.log('Clicking Dual Sprint button...');
      await dualSprintBtn.click();
      await window.waitForTimeout(1500);
      await window.screenshot({ path: path.join(screenshotDir, '02_dual_sprint_panel.png') });
    }

    // Try clicking Skills tab if available
    const skillsTab = await window.$('button:has-text("Skills"), button:has-text("Catalog")');
    if (skillsTab) {
      console.log('Clicking Skills tab...');
      await skillsTab.click();
      await window.waitForTimeout(1500);
      await window.screenshot({ path: path.join(screenshotDir, '04_skills_catalog_panel.png') });
    }

    // Try opening Settings
    const settingsBtn = await window.$('button[aria-label*="Settings"], button:has-text("Settings"), button:has-text("⚙")');
    if (settingsBtn) {
      console.log('Opening Settings Modal...');
      await settingsBtn.click();
      await window.waitForTimeout(1500);
      await window.screenshot({ path: path.join(screenshotDir, '05_settings_general.png') });

      // Click Prerequisites tab in Settings
      const prereqBtn = await window.$('button:has-text("Prerequisites")');
      if (prereqBtn) {
        await prereqBtn.click();
        await window.waitForTimeout(1200);
        await window.screenshot({ path: path.join(screenshotDir, '06_settings_prerequisites.png') });
      }

      // Click Autonomy & Budgets tab in Settings
      const autonomyBtn = await window.$('button:has-text("Autonomy & Budgets")');
      if (autonomyBtn) {
        await autonomyBtn.click();
        await window.waitForTimeout(1200);
        await window.screenshot({ path: path.join(screenshotDir, '07_settings_autonomy_budgets.png') });
      }

      // Click Connections tab in Settings
      const connectionsBtn = await window.$('button:has-text("Connections")');
      if (connectionsBtn) {
        await connectionsBtn.click();
        await window.waitForTimeout(1200);
        await window.screenshot({ path: path.join(screenshotDir, '08_settings_connections.png') });
      }

      // Click Voice tab in Settings
      const voiceBtn = await window.$('button:has-text("Voice")');
      if (voiceBtn) {
        await voiceBtn.click();
        await window.waitForTimeout(1200);
        await window.screenshot({ path: path.join(screenshotDir, '09_settings_voice.png') });
      }

      // Close Settings Modal
      const closeBtn = await window.$('button:has-text("close"), button:has-text("Close")');
      if (closeBtn) await closeBtn.click();
      await window.waitForTimeout(800);
    }

    // Try clicking an Agent desk / avatar to open External Agent Panel
    console.log('Attempting to capture External Agent Panel...');
    // We can evaluate clicking on agent or selecting an agent from roster
    const agentCard = await window.$('[data-agent-id], button:has-text("Sanji"), button:has-text("Zoro"), button:has-text("Luffy")');
    if (agentCard) {
      await agentCard.click();
      await window.waitForTimeout(1500);
      await window.screenshot({ path: path.join(screenshotDir, '03_external_agent_panel.png') });
    }

    console.log('All primary AgentHive screenshots captured successfully!');
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await electronApp.close();
  }
}

capture().catch(console.error);
