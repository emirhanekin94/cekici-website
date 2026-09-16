const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const heroPath = path.join(__dirname, '..', 'images', 'kapak-fotografi.webp');
const mobilePath = path.join(__dirname, '..', 'images', 'kapak-fotografi-mobile.webp');

async function processHero() {
  const inputBuffer = fs.readFileSync(heroPath);

  // Mobile version (700px, quality 72, effort 6) -> ~42 KB
  const mobileBuffer = await sharp(inputBuffer)
    .resize({ width: 700, withoutEnlargement: true })
    .webp({ quality: 72, effort: 6 })
    .toBuffer();
  fs.writeFileSync(mobilePath, mobileBuffer);
  console.log(`Mobile hero written: ${(mobileBuffer.length / 1024).toFixed(1)} KB`);

  // Desktop version (1280px, quality 74, effort 6) -> ~98 KB
  const desktopBuffer = await sharp(inputBuffer)
    .resize({ width: 1280, withoutEnlargement: true })
    .webp({ quality: 74, effort: 6 })
    .toBuffer();
  fs.writeFileSync(heroPath, desktopBuffer);
  console.log(`Desktop hero written: ${(desktopBuffer.length / 1024).toFixed(1)} KB`);
}

processHero().catch(console.error);
