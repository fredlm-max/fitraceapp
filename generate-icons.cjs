const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// The SVG content (scaled for each size)
function makeSVG(size) {
  const r = size;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.35;
  const ringWidth = size * 0.06;
  const fontSize = size * 0.26;
  const dotRadius = size * 0.06;
  const dotX = cx + radius * Math.cos(-Math.PI / 4);
  const dotY = cy + radius * Math.sin(-Math.PI / 4);
  const arcStartX = cx;
  const arcStartY = cy - radius;
  const arcEndAngle = -Math.PI * 0.9; // nearly full circle
  const arcEndX = cx + radius * Math.cos(arcEndAngle);
  const arcEndY = cy + radius * Math.sin(arcEndAngle);
  const cornerRadius = size * 0.22;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${cornerRadius}" fill="#080808"/>
  <circle cx="${cx}" cy="${cy}" r="${radius}" fill="rgba(232,255,71,0.1)"/>
  <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="${ringWidth}"/>
  <path d="M ${arcStartX} ${arcStartY} A ${radius} ${radius} 0 1 1 ${arcEndX} ${arcEndY}" fill="none" stroke="#e8ff47" stroke-width="${ringWidth}" stroke-linecap="round"/>
  <text x="${cx}" y="${cy + fontSize * 0.1}" text-anchor="middle" dominant-baseline="middle"
    font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="${fontSize}" fill="#e8ff47"
    letter-spacing="${fontSize * 0.05}">FR</text>
  <circle cx="${dotX}" cy="${dotY}" r="${dotRadius}" fill="#39ff80"/>
</svg>`;
}

const sizes = [72, 96, 128, 144, 152, 180, 192, 512];
const iconsDir = path.join(__dirname, 'public', 'icons');

async function run() {
  for (const size of sizes) {
    const svgBuffer = Buffer.from(makeSVG(size));
    const outPath = path.join(iconsDir, `icon-${size}.png`);
    await sharp(svgBuffer).png().toFile(outPath);
    console.log(`✓ icon-${size}.png`);
  }
  console.log('Done!');
}

run().catch(console.error);
