'use strict';
const fs = require('fs');
const path = require('path');
const uiFile = path.join(process.cwd(), 'workspace', 'online-learning', 'ui-design.md');
if (!fs.existsSync(uiFile)) {
  console.log('ui-design.md not found');
  process.exit(1);
}
const frankyRes = fs.readFileSync(uiFile, 'utf8');

const htmlMatch = frankyRes.match(/```(?:html|htm)[\s\S]*?\n([\s\S]*?)(?:```|$)/i);
let htmlContent = htmlMatch ? htmlMatch[1].trim() : '';

if (!htmlContent && (frankyRes.includes('<!DOCTYPE') || frankyRes.includes('<html'))) {
  const docMatch = frankyRes.match(/(<!DOCTYPE[\s\S]*?)(?:<\/html>|$)/i);
  if (docMatch) htmlContent = docMatch[1].trim();
}

if (htmlContent && !htmlContent.includes('</html>')) {
  if (!htmlContent.includes('app.js')) {
    htmlContent += '\n  <script src="app.js" defer></script>';
  }
  htmlContent += '\n</body>\n</html>';
}

console.log('Extracted HTML size:', htmlContent.length);
console.log('Contains NexusAcademy:', htmlContent.includes('NexusAcademy'));
console.log('Contains Explore Catalog:', htmlContent.includes('Explore Catalog'));

const target = path.join(process.cwd(), 'workspace', 'online-learning', 'index.html');
fs.writeFileSync(target, htmlContent, 'utf8');
console.log('Successfully written Franky NexusAcademy HTML to:', target);

