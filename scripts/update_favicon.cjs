const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');

const SOURCE_IMAGE_PATH = 'C:/Users/USER/.gemini/antigravity/brain/2c3a13c2-8a21-4da7-a105-cdf8291a047f/.user_uploaded/media_1792485084674_9a8b58e8.png';
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

function buildIco(images) {
  // images = [{ width, height, buf }]
  const headerSize = 6;
  const dirEntrySize = 16;
  const totalHeaderSize = headerSize + dirEntrySize * images.length;

  let currentOffset = totalHeaderSize;
  const headerBuf = Buffer.alloc(totalHeaderSize);

  headerBuf.writeUInt16LE(0, 0); // reserved = 0
  headerBuf.writeUInt16LE(1, 2); // type = 1 (ICO)
  headerBuf.writeUInt16LE(images.length, 4); // count

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const entryOffset = headerSize + i * dirEntrySize;
    headerBuf.writeUInt8(img.width >= 256 ? 0 : img.width, entryOffset);
    headerBuf.writeUInt8(img.height >= 256 ? 0 : img.height, entryOffset + 1);
    headerBuf.writeUInt8(0, entryOffset + 2); // color count = 0
    headerBuf.writeUInt8(0, entryOffset + 3); // reserved = 0
    headerBuf.writeUInt16LE(1, entryOffset + 4); // color planes = 1
    headerBuf.writeUInt16LE(32, entryOffset + 6); // bits per pixel = 32
    headerBuf.writeUInt32LE(img.buf.length, entryOffset + 8); // image size
    headerBuf.writeUInt32LE(currentOffset, entryOffset + 12); // image offset

    currentOffset += img.buf.length;
  }

  return Buffer.concat([headerBuf, ...images.map(img => img.buf)]);
}

async function main() {
  console.log('🔄 Reading source image from:', SOURCE_IMAGE_PATH);
  if (!fs.existsSync(SOURCE_IMAGE_PATH)) {
    throw new Error('Source image not found: ' + SOURCE_IMAGE_PATH);
  }

  const { data, info } = await sharp(SOURCE_IMAGE_PATH).raw().toBuffer({ resolveWithObject: true });
  const width = info.width;
  const height = info.height;
  const outBuf = Buffer.alloc(width * height * 4);
  const cx = (width - 1) / 2;
  const cy = (height - 1) / 2;
  const r = (Math.min(width, height) - 1) / 2;

  // Apply smooth anti-aliased circular alpha mask outside metallic ring
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const d = Math.hypot(x - cx, y - cy);

      outBuf[idx] = data[idx];
      outBuf[idx + 1] = data[idx + 1];
      outBuf[idx + 2] = data[idx + 2];

      if (d <= r - 0.5) {
        outBuf[idx + 3] = 255;
      } else if (d >= r + 0.5) {
        outBuf[idx + 3] = 0;
      } else {
        const factor = (r + 0.5 - d);
        outBuf[idx + 3] = Math.round(255 * Math.max(0, Math.min(1, factor)));
      }
    }
  }

  const baseImage = sharp(outBuf, { raw: { width, height, channels: 4 } });

  console.log('✨ Resizing icons to all required device & browser dimensions (Lanczos3)...');
  const [b16, b32, b48, b180, b192, b512] = await Promise.all([
    baseImage.clone().resize(16, 16, { kernel: sharp.kernel.lanczos3 }).png({ compressionLevel: 9 }).toBuffer(),
    baseImage.clone().resize(32, 32, { kernel: sharp.kernel.lanczos3 }).png({ compressionLevel: 9 }).toBuffer(),
    baseImage.clone().resize(48, 48, { kernel: sharp.kernel.lanczos3 }).png({ compressionLevel: 9 }).toBuffer(),
    baseImage.clone().resize(180, 180, { kernel: sharp.kernel.lanczos3 }).png({ compressionLevel: 9 }).toBuffer(),
    baseImage.clone().resize(192, 192, { kernel: sharp.kernel.lanczos3 }).png({ compressionLevel: 9 }).toBuffer(),
    baseImage.clone().resize(512, 512, { kernel: sharp.kernel.lanczos3 }).png({ compressionLevel: 9 }).toBuffer(),
  ]);

  const icoBuf = buildIco([
    { width: 16, height: 16, buf: b16 },
    { width: 32, height: 32, buf: b32 },
    { width: 48, height: 48, buf: b48 }
  ]);

  const filesToWrite = [
    { name: 'favicon-16x16.png', buf: b16 },
    { name: 'favicon-32x32.png', buf: b32 },
    { name: 'favicon.png', buf: b32 },
    { name: 'favicon-48x48.png', buf: b48 },
    { name: 'apple-touch-icon.png', buf: b180 },
    { name: 'android-chrome-192x192.png', buf: b192 },
    { name: 'android-chrome-512x512.png', buf: b512 },
    { name: 'favicon.ico', buf: icoBuf },
  ];

  const targetDirs = [ROOT_DIR, PUBLIC_DIR];

  for (const dir of targetDirs) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    for (const file of filesToWrite) {
      const destPath = path.join(dir, file.name);
      fs.writeFileSync(destPath, file.buf);
      const hash = crypto.createHash('sha256').update(file.buf).digest('hex').substring(0, 12);
      console.log(`  ✅ Wrote ${path.relative(ROOT_DIR, destPath)} (${file.buf.length} bytes, sha256: ${hash})`);
    }
  }

  console.log('\n🎉 All favicon and mobile app icons updated successfully in root and public/!');
}

main().catch(err => {
  console.error('❌ Failed to update favicons:', err);
  process.exit(1);
});
