const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '..', 'images');

async function optimizeAll() {
  const files = fs.readdirSync(IMAGES_DIR);
  let totalSaved = 0;

  // 1. First, handle kapak-fotografi.webp specially (Hero cover image)
  const heroPath = path.join(IMAGES_DIR, 'kapak-fotografi.webp');
  if (fs.existsSync(heroPath)) {
    const heroInputBuffer = fs.readFileSync(heroPath);
    console.log(`Original kapak-fotografi.webp: ${(heroInputBuffer.length / 1024).toFixed(1)} KB`);

    // Mobile version (max width 750)
    const mobileHeroBuffer = await sharp(heroInputBuffer)
      .resize({ width: 750, withoutEnlargement: true })
      .webp({ quality: 78, effort: 6 })
      .toBuffer();
    fs.writeFileSync(path.join(IMAGES_DIR, 'kapak-fotografi-mobile.webp'), mobileHeroBuffer);
    console.log(`Created kapak-fotografi-mobile.webp: ${(mobileHeroBuffer.length / 1024).toFixed(1)} KB`);

    // Desktop version (max width 1440)
    const desktopHeroBuffer = await sharp(heroInputBuffer)
      .resize({ width: 1440, withoutEnlargement: true })
      .webp({ quality: 78, effort: 6 })
      .toBuffer();
    fs.writeFileSync(heroPath, desktopHeroBuffer);
    console.log(`Optimized kapak-fotografi.webp: ${(desktopHeroBuffer.length / 1024).toFixed(1)} KB`);

    totalSaved += (heroInputBuffer.length - desktopHeroBuffer.length);
  }

  // 2. Optimize all other webp images
  for (const file of files) {
    if (!file.endsWith('.webp') || file === 'kapak-fotografi.webp' || file === 'kapak-fotografi-mobile.webp') {
      continue;
    }

    const filePath = path.join(IMAGES_DIR, file);
    const origBuffer = fs.readFileSync(filePath);
    const origSize = origBuffer.length;

    try {
      const meta = await sharp(origBuffer).metadata();
      // Target max width 800 for card/gallery images
      const targetWidth = meta.width > 800 ? 800 : meta.width;

      const optimizedBuffer = await sharp(origBuffer)
        .resize({ width: targetWidth, withoutEnlargement: true })
        .webp({ quality: 78, effort: 6 })
        .toBuffer();

      if (optimizedBuffer.length < origSize) {
        fs.writeFileSync(filePath, optimizedBuffer);
        const saved = origSize - optimizedBuffer.length;
        totalSaved += saved;
        console.log(`Optimized ${file}: ${(origSize / 1024).toFixed(1)} KB -> ${(optimizedBuffer.length / 1024).toFixed(1)} KB (saved ${(saved / 1024).toFixed(1)} KB)`);
      } else {
        console.log(`Skipped ${file}: already optimal`);
      }
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message);
    }
  }

  console.log(`\n========================================`);
  console.log(`TOTAL SAVED: ${(totalSaved / (1024 * 1024)).toFixed(2)} MB (${(totalSaved / 1024).toFixed(1)} KB)`);
  console.log(`========================================`);
}

optimizeAll().catch(console.error);
