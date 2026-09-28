// The "Pesan Terakhir" arch (pixar-finale) was cut out with its cream stage
// floor still attached, which shows as a hard rectangle on the garden path.
// This trims that floor to a soft oval stage and feathers the side edges.
//
//   node scripts/fix-finale-floor.mjs
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CUT = path.join(ROOT, "public/images/pixar/cut");
const SRC = path.join(CUT, "pixar-finale.png");
const OUT = path.join(CUT, "pixar-finale-clean.png");

const FLOOR = [226, 183, 153]; // measured stage-floor colour
const BAND_TOP = 585; // floor starts around here (source is 511x743)
const NEAR = 16; // colour distance treated as pure floor
const FAR = 34; // colour distance treated as subject

const smooth = (t) => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
};

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;

// Keep the floor only inside a soft oval (a round stage under the couple),
// so it reads as part of the scene instead of a pasted rectangle.
const stage = { cx: 255, cy: 668, rx: 215, ry: 58 };
// The source was cropped through the flower bushes; fade the side edges.
const EDGE_FADE = 26;

for (let y = 0; y < H; y++) {
  const bandIn = y < BAND_TOP ? 0 : smooth((y - BAND_TOP) / 12);
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    const a = data[i + 3];
    if (a === 0) continue;
    let alpha = a;

    if (bandIn > 0) {
      const d = Math.hypot(data[i] - FLOOR[0], data[i + 1] - FLOOR[1], data[i + 2] - FLOOR[2]);
      const floorness = 1 - smooth((d - NEAR) / (FAR - NEAR));
      const e = Math.sqrt(((x - stage.cx) / stage.rx) ** 2 + ((y - stage.cy) / stage.ry) ** 2);
      const inStage = 1 - smooth((e - 0.8) / 0.35);
      alpha *= 1 - bandIn * floorness * (1 - inStage);
    }

    const edge = Math.min(x, W - 1 - x);
    if (edge < EDGE_FADE) alpha *= smooth(edge / EDGE_FADE);

    data[i + 3] = Math.round(alpha);
  }
}

// Trim now-empty rows at the bottom so the prop's baseline sits on the path.
let bottom = H - 1;
outer: for (; bottom > 0; bottom--) {
  for (let x = 0; x < W; x++) if (data[(bottom * W + x) * 4 + 3] > 24) break outer;
}
await sharp(data, { raw: { width: W, height: H, channels: 4 } })
  .extract({ left: 0, top: 0, width: W, height: bottom + 1 })
  .png({ compressionLevel: 9 })
  .toFile(OUT);
console.log(`pixar-finale-clean.png ${W}x${bottom + 1}`);
