// Gives every female frame the same head: the walk-b head is pasted (scaled and
// chin-aligned) over the idle and jump frames, whose original art has a
// different head size and hair ornaments.
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CUT = path.join(ROOT, "public/images/cut");

const HEAD_SRC = "player-female-walk-b.png";
const HEAD_CHIN = { x: 120, y: 140 }; // chin in the head source frame
// Head mask ends just below the chin; behind the face it runs lower so the
// hair bun keeps its rounded bottom instead of a flat cut.
const HEAD_CUT_Y = 142;
const BUN_CUT_Y = 152;
const BUN_MAX_X = 96;
const cutY = (x) => (x < BUN_MAX_X ? BUN_CUT_Y : HEAD_CUT_Y);

const TARGETS = [
  { src: "player-female-idle.png", out: "player-female-idle-fix.png", scale: 1.0, chin: { x: 125, y: 148 }, eraseAboveY: 144 },
  // Around the chin the jump art's jaw sits a little lower, so clear a few more rows there.
  { src: "player-female-jump.png", out: "player-female-jump-fix.png", scale: 1.0, chin: { x: 140, y: 172 }, eraseAboveY: 166, jaw: { x0: 154, x1: 190, y: 174 } },
];

async function raw(file) {
  const { data, info } = await sharp(path.join(CUT, file)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
}

const head = await raw(HEAD_SRC);
// Head layer: rows above the cut line, feathered over 4px.
const headLayer = Buffer.from(head.data);
for (let y = 0; y < head.h; y++) {
  for (let x = 0; x < head.w; x++) {
    const c = cutY(x);
    const fade = y < c - 4 ? 1 : y >= c ? 0 : (c - y) / 4;
    headLayer[(y * head.w + x) * 4 + 3] *= fade;
  }
}

// Crop the head layer to its opaque bounds so scaling/compositing stays small.
let minX = head.w, maxX = -1, minY = head.h, maxY = -1;
for (let y = 0; y < BUN_CUT_Y; y++) {
  for (let x = 0; x < head.w; x++) {
    if (headLayer[(y * head.w + x) * 4 + 3] > 0) {
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }
  }
}
const hw = maxX - minX + 1;
const hh = maxY - minY + 1;
const headCrop = await sharp(headLayer, { raw: { width: head.w, height: head.h, channels: 4 } })
  .extract({ left: minX, top: minY, width: hw, height: hh })
  .raw()
  .toBuffer();

for (const t of TARGETS) {
  const base = await raw(t.src);
  // Remove the original head (everything above the neck line; arms start lower).
  for (let y = 0; y < Math.min(base.h, t.eraseAboveY); y++) {
    for (let x = 0; x < base.w; x++) base.data[(y * base.w + x) * 4 + 3] = 0;
  }
  if (t.jaw) {
    for (let y = t.eraseAboveY; y < t.jaw.y; y++) {
      for (let x = t.jaw.x0; x < Math.min(base.w, t.jaw.x1); x++) base.data[(y * base.w + x) * 4 + 3] = 0;
    }
  }
  const scaledW = Math.round(hw * t.scale);
  const scaledH = Math.round(hh * t.scale);
  const scaled = await sharp(headCrop, { raw: { width: hw, height: hh, channels: 4 } })
    .resize(scaledW, scaledH)
    .raw()
    .toBuffer();
  const left = Math.round(t.chin.x - (HEAD_CHIN.x - minX) * t.scale);
  const top = Math.round(t.chin.y - (HEAD_CHIN.y - minY) * t.scale);
  // The pasted head may poke past the canvas edge; pad so nothing is clipped.
  const padL = Math.max(0, -left);
  const padT = Math.max(0, -top);
  const padR = Math.max(0, left + scaledW - base.w);
  const W = base.w + padL + padR;
  const H = base.h + padT;
  await sharp(base.data, { raw: { width: base.w, height: base.h, channels: 4 } })
    .extend({ left: padL, top: padT, right: padR, bottom: 0, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .composite([{ input: scaled, raw: { width: scaledW, height: scaledH, channels: 4 }, left: left + padL, top: top + padT }])
    .png()
    .toFile(path.join(CUT, t.out));
  console.log(`${t.out} ${W}x${H}`);
}
