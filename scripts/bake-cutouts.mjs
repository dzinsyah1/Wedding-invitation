import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const ASSETS = [
  { file: "pixar-house.png", mode: "blue", kind: "cutout" },
  { file: "pixar-mosque.png", mode: "blue", kind: "cutout" },
  { file: "pixar-venue.png", mode: "blue", kind: "cutout" },
  { file: "pixar-couple.png", mode: "blue", kind: "frame" },
  { file: "pixar-clock.png", mode: "blue", kind: "cutout" },
  { file: "pixar-mailbox.png", mode: "blue", kind: "cutout" },
  { file: "pixar-gift.png", mode: "blue", kind: "cutout" },
  { file: "pixar-story.png", mode: "blue", kind: "cutout" },
  { file: "pixar-gallery.png", mode: "blue", kind: "cutout" },
  { file: "pixar-finale.png", mode: "blue", kind: "cutout" },
  { file: "pixar-leaf-wall.png", mode: "blue", kind: "cutout" },
  { file: "pixar-garden-tree.png", mode: "blue", kind: "cutout" },
  { file: "pixar-mixed-cluster.png", mode: "blue", kind: "cutout" },
  { file: "pixar-white-roses.png", mode: "blue", kind: "cutout" },
  { file: "pixar-garden-lantern.png", mode: "blue", kind: "cutout" },
  { file: "pixar-bush.png", mode: "blue", kind: "plant" },
  { file: "pixar-couple-blink.png", mode: "blue", kind: "frame" },
  { file: "pixar-couple-wave.png", mode: "blue", kind: "frame" },
  { file: "pixar-treeline.png", mode: "warm", kind: "cutout" },
  { file: "pixar-garden-clouds.png", mode: "blue", kind: "cutout" },
  { file: "pixar-leaf-shrub.png", mode: "blue", kind: "cutout" },
  { file: "pixar-tall-blooms.png", mode: "blue", kind: "cutout" },
  { file: "pixar-low-blooms.png", mode: "blue", kind: "cutout" },
  { file: "pixar-rose-arch.png", mode: "blue", kind: "cutout" },
  { file: "pixar-hang-vines.png", mode: "warm", kind: "cutout" },
  { file: "pixar-blossom-canopy.png", mode: "blue", kind: "cutout" },
  { file: "pixar-bird.png", mode: "blue", kind: "cutout" },
  { file: "pixar-butterfly.png", mode: "blue", kind: "cutout" },
  { file: "pixar-dove-fly-a.png", mode: "blue", kind: "cutout" },
  { file: "pixar-dove-fly-b.png", mode: "blue", kind: "cutout" },
  { file: "pixar-dove-idle.png", mode: "blue", kind: "cutout" },
];

const PLAYERS = [
  "player-idle.png",
  "player-walk-a.png",
  "player-walk-b.png",
  "player-jump.png",
  "player-female-idle.png",
  "player-female-walk-a.png",
  "player-female-walk-b.png",
  "player-female-jump.png",
];

const PHOTOS = [
  { src: "groom-portrait.png", dest: "groom-portrait.jpg", size: 900, quality: 78 },
  { src: "bride-portrait.png", dest: "bride-portrait.jpg", size: 900, quality: 78 },
  { src: "gallery-meeting.png", dest: "gallery-meeting.jpg", size: 1000, quality: 76 },
  { src: "gallery-closer.png", dest: "gallery-closer.jpg", size: 1000, quality: 76 },
  { src: "gallery-proposal.png", dest: "gallery-proposal.jpg", size: 1000, quality: 76 },
  { src: "gallery-wedding.png", dest: "gallery-wedding.jpg", size: 1000, quality: 76 },
  { src: "og-image.png", dest: "og-image.jpg", size: 1200, quality: 80 },
];

function isBlueSky(r, g, b) {
  const bright = (r + g + b) / 3;
  return b > 160 && g > 140 && r < 215 && b - r > 26 && g - r > 6 && bright > 138;
}

function isCyanKey(r, g, b) {
  return g > 180 && b > 180 && r < 110 && g - r > 80 && b - r > 80;
}

function isMagentaKey(r, g, b) {
  return r > 160 && b > 160 && g < 130 && r - g > 50 && b - g > 50;
}

function isWarmSky(r, g, b) {
  const bright = (r + g + b) / 3;
  const peach = r > 205 && g > 165 && b < 205 && r - b > 40 && g - b > 18 && bright > 170;
  const warmBlue = r > 175 && g > 135 && b < 200 && r > b + 8 && bright > 165 && b < 190;
  return peach || warmBlue;
}

function almostSky(r, g, b) {
  const bright = (r + g + b) / 3;
  return b > 145 && g > 125 && r < 230 && b >= r && bright > 125 && b - r > 12;
}

function sampleCornerKey(px, w, h) {
  const idx = [0, (w - 1) * 4, (h - 1) * w * 4, ((h - 1) * w + (w - 1)) * 4];
  let r = 0;
  let g = 0;
  let b = 0;
  idx.forEach((i) => {
    r += px[i];
    g += px[i + 1];
    b += px[i + 2];
  });
  return { r: r / 4, g: g / 4, b: b / 4 };
}

function nearKey(r, g, b, key, thresh) {
  return Math.abs(r - key.r) + Math.abs(g - key.g) + Math.abs(b - key.b) < thresh;
}

function punchKey(px, w, h) {
  const key = sampleCornerKey(px, w, h);
  for (let i = 0; i < px.length; i += 4) {
    const r = px[i];
    const g = px[i + 1];
    const b = px[i + 2];
    if (isMagentaKey(r, g, b) || isCyanKey(r, g, b) || isBlueSky(r, g, b) || nearKey(r, g, b, key, 90)) {
      px[i + 3] = 0;
      continue;
    }
    const dist = Math.abs(r - key.r) + Math.abs(g - key.g) + Math.abs(b - key.b);
    if (dist < 140) px[i + 3] = Math.round(px[i + 3] * ((dist - 90) / 50));
  }
}

function plantIntoGround(px, w, h) {
  for (let y = 0; y < h; y += 1) {
    const ny = y / h;
    for (let x = 0; x < w; x += 1) {
      const i = (y * w + x) * 4;
      if (px[i + 3] < 8) continue;
      const nx = (x / w - 0.5) * 2;
      const r = px[i];
      const g = px[i + 1];
      const b = px[i + 2];
      let fade = 1;
      if (ny > 0.7) fade *= 1 - Math.pow((ny - 0.7) / 0.3, 1.35) * 0.9;
      if (ny > 0.52) fade *= 1 - Math.pow(Math.abs(nx), 1.4) * ((ny - 0.52) / 0.48) * 0.92;
      const grassy = ny > 0.58 && g > r + 6 && g > b && g > 68;
      const dirt = ny > 0.6 && r > 88 && g > 68 && b < 130 && r > b + 16 && Math.abs(r - g) < 55;
      if (grassy || dirt) fade *= 1 - Math.pow((ny - 0.58) / 0.42, 0.9) * 0.88;
      px[i + 3] = Math.max(0, Math.round(px[i + 3] * fade));
    }
  }
}

function softenEdges(px, w, h) {
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const i = (y * w + x) * 4;
      if (px[i + 3] < 8) continue;
      if (!almostSky(px[i], px[i + 1], px[i + 2])) continue;
      px[i + 2] = Math.min(px[i + 2], px[i + 1] + 6);
      px[i + 3] = Math.round(px[i + 3] * 0.28);
    }
  }
}

function cropBounds(px, w, h, pad, padBottom) {
  let minX = w;
  let minY = h;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      if (px[(y * w + x) * 4 + 3] <= 12) continue;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  if (maxX <= minX || maxY <= minY) return { minX: 0, minY: 0, cw: w, ch: h };
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(w - 1, maxX + pad);
  maxY = Math.min(h - 1, maxY + padBottom);
  return { minX, minY, cw: Math.max(8, maxX - minX), ch: Math.max(8, maxY - minY) };
}

function extract(px, w, minX, minY, cw, ch) {
  const out = Buffer.alloc(cw * ch * 4);
  for (let y = 0; y < ch; y += 1) {
    const src = ((minY + y) * w + minX) * 4;
    px.copy(out, y * cw * 4, src, src + cw * 4);
  }
  return out;
}

async function firstExisting(paths) {
  const { access } = await import("node:fs/promises");
  for (const file of paths) {
    try {
      await access(file);
      return file;
    } catch {
      /* next */
    }
  }
  return null;
}

async function bakeSprite(srcPath, destPath, { mode, kind, maxSize }) {
  const { data, info } = await sharp(srcPath)
    .resize({ width: maxSize, height: maxSize, fit: "inside", withoutEnlargement: true })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const px = Buffer.from(data);
  const test = mode === "warm" ? isWarmSky : isBlueSky;

  if (kind === "cyan") punchKey(px, w, h);
  else {
    for (let i = 0; i < px.length; i += 4) {
      if (test(px[i], px[i + 1], px[i + 2])) px[i + 3] = 0;
    }
    softenEdges(px, w, h);
  }
  if (kind === "plant") plantIntoGround(px, w, h);

  let out = px;
  let ow = w;
  let oh = h;
  if (kind !== "frame") {
    const pad = kind === "cyan" ? 2 : 6;
    const box = cropBounds(px, w, h, pad, kind === "cyan" ? 0 : pad);
    out = extract(px, w, box.minX, box.minY, box.cw, box.ch);
    ow = box.cw;
    oh = box.ch;
  }

  await sharp(out, { raw: { width: ow, height: oh, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(destPath);
}

async function bakePhoto(srcPath, destPath, size, quality) {
  await sharp(srcPath)
    .resize({ width: size, height: size, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true })
    .toFile(destPath);
}

async function main() {
  const pixarOut = path.join(ROOT, "public/images/pixar/cut");
  const playerOut = path.join(ROOT, "public/images/cut");
  const photoOut = path.join(ROOT, "public/images");
  await mkdir(pixarOut, { recursive: true });
  await mkdir(playerOut, { recursive: true });

  for (const asset of ASSETS) {
    const src = await firstExisting([
      path.join(ROOT, "assets/pixar-source", asset.file),
      path.join(ROOT, "public/images/pixar", asset.file),
    ]);
    if (!src) {
      console.warn("skip missing", asset.file);
      continue;
    }
    const dest = path.join(pixarOut, asset.file);
    await bakeSprite(src, dest, { mode: asset.mode, kind: asset.kind, maxSize: 768 });
    console.log("cut", asset.file);
  }

  for (const file of PLAYERS) {
    const src = await firstExisting([
      path.join(ROOT, "assets/player-source", file),
      path.join(ROOT, "public/images", file),
      path.join(ROOT, "public/images/sm", file),
    ]);
    if (!src) {
      console.warn("skip missing", file);
      continue;
    }
    await bakeSprite(src, path.join(playerOut, file), { mode: "blue", kind: "cyan", maxSize: 512 });
    console.log("cut", file);
  }

  for (const photo of PHOTOS) {
    const src = await firstExisting([
      path.join(ROOT, "assets/photos-source", photo.src),
      path.join(ROOT, "public/images", photo.src),
    ]);
    if (!src) {
      console.warn("skip missing", photo.src);
      continue;
    }
    await bakePhoto(src, path.join(photoOut, photo.dest), photo.size, photo.quality);
    console.log("jpg", photo.dest);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
