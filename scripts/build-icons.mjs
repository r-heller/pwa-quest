// One-shot script: rasterizes public/icons/icon.svg into PNG icons
// for the PWA manifest (192, 512, maskable 512).
//
// Usage: node scripts/build-icons.mjs
//
// Sharp is intentionally NOT a project dependency — the generated PNGs are
// committed. Re-run this script and commit the results if the SVG changes.

import { readFileSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const srcSvg = resolve(root, 'public/icons/icon.svg');
const outDir = resolve(root, 'public/icons');

const svg = readFileSync(srcSvg);

async function render(name, size, { padded = false } = {}) {
  const out = resolve(outDir, name);
  await mkdir(outDir, { recursive: true });
  if (padded) {
    // Maskable: keep safe zone — render the icon at ~70% inside the canvas.
    const inner = Math.round(size * 0.72);
    const inset = Math.round((size - inner) / 2);
    const inside = await sharp(svg).resize(inner, inner).png().toBuffer();
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 15, g: 23, b: 42, alpha: 1 },
      },
    })
      .composite([{ input: inside, top: inset, left: inset }])
      .png()
      .toFile(out);
  } else {
    await sharp(svg).resize(size, size).png().toFile(out);
  }
  console.log('wrote', name);
}

await render('icon-192.png', 192);
await render('icon-512.png', 512);
await render('icon-maskable-512.png', 512, { padded: true });
