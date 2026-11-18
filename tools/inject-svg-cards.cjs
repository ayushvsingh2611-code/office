const fs = require('fs');

function makeSvgBase64(title, color1, color2, iconPath, label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240">
      <defs>
        <radialGradient id="bgGrad_${title}" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="${color1}" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#101416" stop-opacity="1"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bgGrad_${title})"/>
      <circle cx="200" cy="110" r="64" fill="#181E22" stroke="${color1}" stroke-width="3"/>
      <circle cx="200" cy="110" r="48" fill="#2A1A0E"/>
      ${iconPath}
      <rect x="90" y="188" width="220" height="26" rx="13" fill="#121619" stroke="${color2}" stroke-width="1.5"/>
      <text x="200" y="206" font-family="sans-serif" font-size="11" font-weight="700" fill="${color2}" text-anchor="middle" letter-spacing="1">${label}</text>
    </svg>`;
  return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
}

const icons = {
  rasengan: `<circle cx="200" cy="110" r="30" fill="none" stroke="#00E5FF" stroke-width="3" stroke-dasharray="4,4"/><circle cx="200" cy="110" r="16" fill="#00E5FF" opacity="0.7"/><circle cx="200" cy="110" r="6" fill="#fff"/>`,
  amaterasu: `<path d="M185 125 Q200 80 215 125 Q200 135 185 125 Z" fill="#E74C3C"/><path d="M192 120 Q200 95 208 120 Z" fill="#FF6B00"/>`,
  matcha: `<circle cx="200" cy="110" r="38" fill="#27AE60"/><path d="M180 110 Q200 90 220 110" stroke="#A9DFBF" stroke-width="4" fill="none"/>`,
  hokage: `<polygon points="200,80 207,98 226,98 211,109 217,127 200,116 183,127 189,109 174,98 193,98" fill="#F59E0B"/>`,
  chidori: `<path d="M195 78 L208 102 L198 106 L210 138 L188 112 L198 108 Z" fill="#00E5FF"/>`,
  peach: `<circle cx="192" cy="112" r="20" fill="#FADBD8"/><circle cx="208" cy="112" r="20" fill="#FADBD8"/><circle cx="200" cy="118" r="16" fill="#F1948A"/>`,
  lavender: `<ellipse cx="200" cy="110" rx="28" ry="36" fill="#BB8FCE"/><circle cx="200" cy="110" r="18" fill="#F5EEF8"/>`,
  dango: `<circle cx="176" cy="110" r="14" fill="#E74C3C"/><circle cx="200" cy="110" r="14" fill="#FDFEFE"/><circle cx="224" cy="110" r="14" fill="#27AE60"/><line x1="155" y1="110" x2="245" y2="110" stroke="#F5B041" stroke-width="4"/>`
};

let appJs = fs.readFileSync('workspace/coffe-with-hinata/app.js', 'utf8');

const replacements = [
  { id: 'shinobi-1', title: 'rasengan', b64: makeSvgBase64('rasengan', '#00E5FF', '#00E5FF', icons.rasengan, 'WIND RELEASE • NITRO') },
  { id: 'shinobi-2', title: 'amaterasu', b64: makeSvgBase64('amaterasu', '#FF6B00', '#E74C3C', icons.amaterasu, 'FIRE RELEASE • ROAST') },
  { id: 'shinobi-3', title: 'matcha', b64: makeSvgBase64('matcha', '#2ECC71', '#2ECC71', icons.matcha, 'SENJUTSU • UJI MATCHA') },
  { id: 'shinobi-4', title: 'hokage', b64: makeSvgBase64('hokage', '#F59E0B', '#F59E0B', icons.hokage, 'LEAF GOLD • CINNAMON') },
  { id: 'shinobi-5', title: 'chidori', b64: makeSvgBase64('chidori', '#00E5FF', '#F1C40F', icons.chidori, 'LIGHTNING • TONIC') },
  { id: 'shinobi-6', title: 'peach', b64: makeSvgBase64('peach', '#E84393', '#FADBD8', icons.peach, 'GENTLE FIST • BLOSSOM') },
  { id: 'shinobi-7', title: 'lavender', b64: makeSvgBase64('lavender', '#9B59B6', '#BB8FCE', icons.lavender, 'WATER RELEASE • HONEY') },
  { id: 'shinobi-8', title: 'dango', b64: makeSvgBase64('dango', '#E67E22', '#2ECC71', icons.dango, 'RAMEN SHOP • DANGO') }
];

replacements.forEach(r => {
  const reg = new RegExp(`id: '${r.id}'[\\s\\S]*?image: '[^']+'`);
  appJs = appJs.replace(reg, (match) => {
    return match.replace(/image: '[^']+'/, `image: '${r.b64}'`);
  });
});

fs.writeFileSync('workspace/coffe-with-hinata/app.js', appJs);
console.log('Successfully injected Base64 SVG artworks into app.js!');
