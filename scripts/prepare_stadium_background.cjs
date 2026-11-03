/**
 * scripts/prepare_stadium_background.cjs
 * Prepares optimized stadium background image for the DeepPredictBet login experience.
 */

const sharp = require('sharp');
const fs = require('fs');

async function prepare() {
  console.log('Processing stadium background assets...');

  // 1. Base image metadata
  const baseImg = sharp('assets/auth-stadium-reference.jpg');
  const meta = await baseImg.metadata();
  console.log(`Original dimensions: ${meta.width}x${meta.height}`);

  // 2. Create clean stadium background:
  // In the area where the login card was mocked up (left: 485, top: 85, width: 440, height: 460),
  // we composite a dark navy glass/stadium atmospheric overlay so that no static text shows through.
  // We use an SVG rectangle with smooth radial gradient matching the stadium atmosphere.
  const overlaySvg = Buffer.from(`
    <svg width="${meta.width}" height="${meta.height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="stadiumGlow" cx="65%" cy="40%" r="55%">
          <stop offset="0%" stop-color="#071126" stop-opacity="0.96" />
          <stop offset="60%" stop-color="#050c1c" stop-opacity="0.94" />
          <stop offset="85%" stop-color="#020612" stop-opacity="0.90" />
          <stop offset="100%" stop-color="#01040a" stop-opacity="0.0" />
        </radialGradient>
        <linearGradient id="edgeBlend" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#020612" stop-opacity="0.0" />
          <stop offset="8%" stop-color="#050d20" stop-opacity="0.92" />
          <stop offset="92%" stop-color="#050d20" stop-opacity="0.92" />
          <stop offset="100%" stop-color="#020612" stop-opacity="0.0" />
        </linearGradient>
      </defs>
      <!-- Subtle atmospheric mask over the login card mockup area -->
      <rect x="475" y="70" width="465" height="485" rx="30" fill="url(#stadiumGlow)" />
      <rect x="475" y="70" width="465" height="485" rx="30" fill="url(#edgeBlend)" opacity="0.6" />
    </svg>
  `);

  await sharp('assets/auth-stadium-reference.jpg')
    .composite([
      { input: overlaySvg, top: 0, left: 0 }
    ])
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile('assets/auth-stadium-bg.jpg');

  await sharp('assets/auth-stadium-bg.jpg')
    .webp({ quality: 85 })
    .toFile('assets/auth-stadium-bg.webp');

  // Copy to public/assets/
  fs.copyFileSync('assets/auth-stadium-bg.jpg', 'public/assets/auth-stadium-bg.jpg');
  fs.copyFileSync('assets/auth-stadium-bg.webp', 'public/assets/auth-stadium-bg.webp');
  fs.copyFileSync('assets/auth-stadium-reference.jpg', 'public/assets/auth-stadium-reference.jpg');

  console.log('✅ Created assets/auth-stadium-bg.jpg and .webp successfully!');
}

prepare().catch(err => {
  console.error('Failed to prepare background:', err);
  process.exit(1);
});
