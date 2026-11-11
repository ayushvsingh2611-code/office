'use strict';
const fs = require('fs');
const path = require('path');
const engineFile = path.join(process.cwd(), 'workspace', 'online-learning', 'engine-notes.md');
if (!fs.existsSync(engineFile)) {
  console.log('engine-notes.md not found');
  process.exit(1);
}
const usoppRes = fs.readFileSync(engineFile, 'utf8');

const jsMatch = usoppRes.match(/```(?:javascript|js)\s*\n([\s\S]*?)(?:```|$)/i);
let jsContent = jsMatch ? jsMatch[1].trim() : '';

console.log('Extracted JS size:', jsContent.length);
console.log('Contains switchView:', jsContent.includes('switchView') || jsContent.includes('catalog'));

if (jsContent.length > 100) {
  const target = path.join(process.cwd(), 'workspace', 'online-learning', 'app.js');
  fs.writeFileSync(target, jsContent, 'utf8');
  console.log('Successfully written Usopp NexusAcademy JS to:', target);
}

