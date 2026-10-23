const sharp = require('sharp');
const fs = require('fs');

async function createOgImage() {
  const width = 1200;
  const height = 630;

  // Background SVG with ambient brand glows, tech lines, and typography
  // Designed with a Universal Mobile-Safe Zone:
  // All critical branding, emblem, 3D wordmark, and text are strictly contained within
  // the central 500px safe zone (x = 350 to 850, y = 60 to 470).
  // This guarantees:
  // - 100% full uncropped display on X / Twitter & Telegram Desktop (1200 x 630 landscape, 1.91:1)
  // - 100% full uncropped display on Telegram Mobile 4:3 cards (840 x 630)
  // - 100% full uncropped display on Telegram Mobile 1:1 square thumbnails (630 x 630) with >90px safe margins
  const bgSvg = Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stop-color="#0f1933" />
          <stop offset="55%" stop-color="#070b16" />
          <stop offset="100%" stop-color="#03050a" />
        </radialGradient>
        <radialGradient id="glowGreen" cx="35%" cy="38%" r="28%">
          <stop offset="0%" stop-color="rgba(16, 185, 129, 0.22)" />
          <stop offset="100%" stop-color="rgba(16, 185, 129, 0)" />
        </radialGradient>
        <radialGradient id="glowCyan" cx="50%" cy="38%" r="32%">
          <stop offset="0%" stop-color="rgba(56, 189, 248, 0.28)" />
          <stop offset="100%" stop-color="rgba(56, 189, 248, 0)" />
        </radialGradient>
        <radialGradient id="glowRed" cx="65%" cy="38%" r="28%">
          <stop offset="0%" stop-color="rgba(239, 68, 68, 0.22)" />
          <stop offset="100%" stop-color="rgba(239, 68, 68, 0)" />
        </radialGradient>
        <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgba(16, 185, 129, 0.55)" />
          <stop offset="50%" stop-color="rgba(56, 189, 248, 0.65)" />
          <stop offset="100%" stop-color="rgba(239, 68, 68, 0.55)" />
        </linearGradient>
      </defs>

      <!-- Base Canvas -->
      <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

      <!-- Ambient Glows matching Green / Cyan / Red tricolor brand identity -->
      <circle cx="420" cy="240" r="240" fill="url(#glowGreen)" />
      <circle cx="600" cy="240" r="270" fill="url(#glowCyan)" />
      <circle cx="780" cy="240" r="240" fill="url(#glowRed)" />

      <!-- High-Tech Grid Accent Lines -->
      <line x1="80" y1="46" x2="1120" y2="46" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1" />
      <line x1="80" y1="584" x2="1120" y2="584" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1" />

      <!-- Outer Card Border -->
      <rect x="14" y="14" width="1172" height="602" rx="28" fill="none" stroke="url(#borderGrad)" stroke-width="1.8" opacity="0.65" />

      <!-- Tagline Line 1 (Width ~420px, strictly inside x=350 to 850) -->
      <text x="600" y="322" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="19" font-weight="800" fill="#f1f5f9" letter-spacing="1.2">
        AI FOOTBALL PREDICTIONS &amp; BET AUDITS
      </text>

      <!-- Tagline Line 2 (Width ~430px, strictly inside x=350 to 850) -->
      <text x="600" y="358" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="14.5" font-weight="500" fill="#94a3b8" letter-spacing="0.4">
        Bet Doctor Scoring  •  Code Converter  •  Odds Analytics
      </text>

      <!-- Bottom Status Pill (Width: 440px -> x=380 to 820, strictly inside 630px square) -->
      <g transform="translate(600, 436)">
        <rect x="-220" y="-22" width="440" height="44" rx="22" fill="rgba(15, 23, 42, 0.88)" stroke="rgba(56, 189, 248, 0.35)" stroke-width="1.2" />
        <text x="0" y="5.5" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="13" font-weight="600" fill="#cbd5e1" letter-spacing="0.4">
          ⚡ <tspan fill="#38bdf8" font-weight="800">DEEP LEARNING</tspan>  •  <tspan fill="#34d399" font-weight="800">BET DOCTOR</tspan>  •  <tspan fill="#f8fafc" font-weight="700">deeppredictbet.com</tspan>
        </text>
      </g>
    </svg>
  `);

  // Trim transparent edges from assets/logo-3d.png to get raw 810 x 161 artwork
  const logoTargetW = 450;
  const logoTargetH = Math.round(logoTargetW * (161 / 810)); // 89
  const logoArtwork = await sharp('assets/logo-3d.png')
    .trim()
    .resize(logoTargetW, logoTargetH, { kernel: 'lanczos3' })
    .toBuffer();

  // Load the circular 512x512 app icon and resize to 84x84
  const iconTargetSize = 84;
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
        input: logoArtwork,
        left: Math.round((width - logoTargetW) / 2),
        top: 175
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
  console.log('Final Mobile-Safe OG Image Metadata:', {
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
