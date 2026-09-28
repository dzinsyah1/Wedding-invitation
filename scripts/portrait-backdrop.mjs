// Replaces the solid blue studio background of the couple's profile photos
// with a soft, blurred garden backdrop that matches the invitation theme.
// Originals in public/photo-profile are left untouched.
//
//   node scripts/portrait-backdrop.mjs
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(ROOT, "public/photo-profile");
const BACKDROP = path.join(ROOT, "public/images/garden-hero.png");

const PHOTOS = [
  { src: "photo_2026-09-28 12.14.28.jpeg", out: "groom-garden.jpg" },
  { src: "photo_2026-09-28 12.14.26.jpeg", out: "bride-garden.jpg" },
];

// "Blueness" = B - max(R, G). Skin, hair and white/beige clothing score
// <= ~15; the studio blue scores its own (measured) value, and a pixel on the
// silhouette edge is a mix of the two. The camera's sharpening left a thin
// darker ring around the subject; eroding the matte by a pixel drops it.
const SUBJECT_BLUE = 15;
const ERODE_PX = 1;

/** Grey-scale erosion (min filter) with a square radius. */
function erode(src, width, height, radius) {
  const tmp = Buffer.alloc(src.length);
  const dst = Buffer.alloc(src.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let m = 255;
      for (let d = -radius; d <= radius; d++) {
        const xx = Math.min(width - 1, Math.max(0, x + d));
        m = Math.min(m, src[y * width + xx]);
      }
      tmp[y * width + x] = m;
    }
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let m = 255;
      for (let d = -radius; d <= radius; d++) {
        const yy = Math.min(height - 1, Math.max(0, y + d));
        m = Math.min(m, tmp[yy * width + x]);
      }
      dst[y * width + x] = m;
    }
  }
  return dst;
}

/** Average studio-blue colour from the top corners. */
function keyColour(data, width) {
  const acc = [0, 0, 0];
  let n = 0;
  for (let y = 4; y < 60; y += 4) {
    for (const x of [4, 20, 40, width - 41, width - 21, width - 5]) {
      const i = (y * width + x) * 3;
      acc[0] += data[i];
      acc[1] += data[i + 1];
      acc[2] += data[i + 2];
      n++;
    }
  }
  return acc.map((v) => v / n);
}

async function backdrop(width, height) {
  // Blurred garden, lifted toward cream so the subject stays the focus.
  const garden = await sharp(BACKDROP)
    .resize(width, height, { fit: "cover", position: "centre" })
    .blur(16)
    .modulate({ brightness: 1.06, saturation: 0.85 })
    .toBuffer();
  const veil = Buffer.from(
    `<svg width="${width}" height="${height}">
      <defs>
        <radialGradient id="glow" cx="50%" cy="38%" r="65%">
          <stop offset="0%" stop-color="#fff8ea" stop-opacity="0.55"/>
          <stop offset="60%" stop-color="#fbeed3" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#8a6a3c" stop-opacity="0.28"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#glow)"/>
    </svg>`
  );
  const flat = await sharp(garden).composite([{ input: veil }]).png().toBuffer();
  return sharp(flat).removeAlpha().raw().toBuffer();
}

for (const photo of PHOTOS) {
  const { data, info } = await sharp(path.join(DIR, photo.src))
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const bg = await backdrop(width, height);

  const key = keyColour(data, width);
  const keyBlue = key[2] - Math.max(key[0], key[1]);

  // Coverage matte from blueness, lightly softened so the edge isn't jagged.
  const matte = Buffer.alloc(width * height);
  for (let i = 0, p = 0; p < matte.length; p++, i += 3) {
    const blue = data[i + 2] - Math.max(data[i], data[i + 1]);
    const a = (keyBlue - blue) / (keyBlue - SUBJECT_BLUE);
    matte[p] = Math.round(255 * Math.min(1, Math.max(0, a)));
  }
  const soft = await sharp(erode(matte, width, height, ERODE_PX), { raw: { width, height, channels: 1 } }).blur(0.7).extractChannel(0).raw().toBuffer();
  if (soft.length !== width * height || bg.length !== width * height * 3 || data.length !== width * height * 3) {
    throw new Error(`unexpected buffer sizes for ${photo.src}`);
  }

  const out = Buffer.alloc(width * height * 3);
  for (let i = 0, p = 0; p < soft.length; p++, i += 3) {
    const a = soft[p] / 255;
    for (let c = 0; c < 3; c++) {
      let v = data[i + c];
      if (a < 1) {
        // Unmix: recover the subject colour behind the blue, then lay it on the garden.
        const fg = a > 0.02 ? (v - (1 - a) * key[c]) / a : bg[i + c];
        v = Math.min(255, Math.max(0, fg)) * a + bg[i + c] * (1 - a);
      }
      out[i + c] = v;
    }
    // Remove any leftover blue cast (studio light spill, imperfect unmix on the rim).
    const cap = Math.max(out[i], out[i + 1]) + 8;
    if (out[i + 2] > cap) out[i + 2] = a >= 1 ? cap : cap * a + bg[i + 2] * (1 - a);
  }

  await sharp(out, { raw: { width, height, channels: 3 } })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(DIR, photo.out));
  console.log(`${photo.out} ${width}x${height}`);
}
