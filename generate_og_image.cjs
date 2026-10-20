const sharp = require('sharp');
const fs = require('fs');

async function createOgImage() {
  const width = 1200;
  const height = 630;

  // Background SVG with ambient brand glows and typography
  const bgSvg = Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stop-color="#0f1933" />
          <stop offset="55%" stop-color="#070b16" />
          <stop offset="100%" stop-color="#03050a" />
        </radialGradient>
        <radialGradient id="glowGreen" cx="24%" cy="42%" r="30%">
          <stop offset="0%" stop-color="rgba(16, 185, 129, 0.22)" />
          <stop offset="100%" stop-color="rgba(16, 185, 129, 0)" />
        </radialGradient>
        <radialGradient id="glowCyan" cx="50%" cy="42%" r="36%">
          <stop offset="0%" stop-color="rgba(56, 189, 248, 0.28)" />
          <stop offset="100%" stop-color="rgba(56, 189, 248, 0)" />
        </radialGradient>
        <radialGradient id="glowRed" cx="76%" cy="42%" r="30%">
          <stop offset="0%" stop-color="rgba(239, 68, 68, 0.22)" />
          <stop offset="100%" stop-color="rgba(239, 68, 68, 0)" />
        </radialGradient>
        <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgba(16, 185, 129, 0.6)" />
          <stop offset="50%" stop-color="rgba(56, 189, 248, 0.7)" />
          <stop offset="100%" stop-color="rgba(239, 68, 68, 0.6)" />
        </linearGradient>
      </defs>

      <!-- Base Canvas -->
      <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

      <!-- Ambient Glows matching Green / Cyan / Red tricolor brand identity -->
      <circle cx="300" cy="265" r="280" fill="url(#glowGreen)" />
      <circle cx="600" cy="265" r="320" fill="url(#glowCyan)" />
      <circle cx="900" cy="265" r="280" fill="url(#glowRed)" />

      <!-- High-Tech Grid Accent Lines -->
      <line x1="80" y1="46" x2="1120" y2="46" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1" />
      <line x1="80" y1="584" x2="1120" y2="584" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1" />

      <!-- Outer Card Border -->
      <rect x="14" y="14" width="1172" height="602" rx="28" fill="none" stroke="url(#borderGrad)" stroke-width="1.8" opacity="0.65" />

      <!-- Subtitle Tagline (Safe Zone centered: x=300 to 900) -->
      <text x="600" y="375" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="21" font-weight="800" fill="#f1f5f9" letter-spacing="1.8">
        AI FOOTBALL PREDICTIONS  •  BET SLIP AUDITS  •  ODDS CONVERTER
      </text>

      <!-- Secondary Capabilities Description -->
      <text x="600" y="415" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="15" font-weight="500" fill="#94a3b8" letter-spacing="0.4">
        Algorithmic match probabilities, deep bet ticket audits, and predictive football analytics.
      </text>

      <!-- Bottom Status Pill (Width: 600px -> fits squarely in center 630px zone) -->
      <g transform="translate(600, 495)">
        <rect x="-300" y="-24" width="600" height="48" rx="24" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(56, 189, 248, 0.35)" stroke-width="1.2" />
        <text x="0" y="6" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="14.5" font-weight="600" fill="#cbd5e1" letter-spacing="0.5">
          ⚡ <tspan fill="#38bdf8" font-weight="800">DEEP LEARNING</tspan>  •  <tspan fill="#34d399" font-weight="800">BET DOCTOR</tspan>  •  <tspan fill="#f8fafc" font-weight="700">deeppredictbet.com</tspan>
        </text>
      </g>
    </svg>
  `);

  // Extract the cropped 3D logo content (844 x 189) from assets/logo-3d.png
  // Resize to 570 x 128 (fits cleanly within 600px square crop with 15px margin on both sides)
  const logoTargetW = 570;
  const logoTargetH = Math.round(logoTargetW * (189 / 844)); // 128
  const logoCrop = await sharp('assets/logo-3d.png')
    .extract({ left: 93, top: 4, width: 844, height: 189 })
    .resize(logoTargetW, logoTargetH, { kernel: 'lanczos3' })
    .toBuffer();

  // Load the circular 512x512 app icon and resize to 96x96
  const iconTargetSize = 96;
  const icon = await sharp('public/android-chrome-512x512.png')
    .resize(iconTargetSize, iconTargetSize, { kernel: 'lanczos3' })
    .toBuffer();

  // Composite the final social preview image
  const finalImage = await sharp(bgSvg)
    .composite([
      {
        input: icon,
        left: Math.round((width - iconTargetSize) / 2),
        top: 65
      },
      {
        input: logoCrop,
        left: Math.round((width - logoTargetW) / 2),
        top: 185
      }
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();

  // Write to assets/ and public/assets/
  const outPaths = [
    'assets/og-image.png',
    'public/assets/og-image.png'
  ];

  outPaths.forEach(p => {
    fs.writeFileSync(p, finalImage);
    const stat = fs.statSync(p);
    console.log(`Saved ${p}: ${stat.size} bytes`);
  });

  const meta = await sharp(finalImage).metadata();
  console.log('Final OG Image Metadata:', {
    width: meta.width,
    height: meta.height,
    format: meta.format,
    channels: meta.channels,
    aspectRatio: (meta.width / meta.height).toFixed(3)
  });
}

createOgImage().catch(err => {
  console.error('Error creating OG image:', err);
  process.exit(1);
});
