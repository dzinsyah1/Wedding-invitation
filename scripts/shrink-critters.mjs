// Birds, butterflies and doves are drawn at ~26-60px but their cutouts are
// ~700px / 0.5-0.9MB each. These small copies (max 200px) are what the game
// loads, so phones can show the critters too.
//
//   node scripts/shrink-critters.mjs
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CUT = path.join(ROOT, "public/images/pixar/cut");
const FILES = ["pixar-bird", "pixar-butterfly", "pixar-dove-fly-a", "pixar-dove-fly-b", "pixar-dove-idle"];

for (const name of FILES) {
  const out = path.join(CUT, `${name}-sm.png`);
  const info = await sharp(path.join(CUT, `${name}.png`))
    .resize({ width: 200, height: 200, fit: "inside", withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toFile(out);
  console.log(`${name}-sm.png ${info.width}x${info.height} ${(info.size / 1024).toFixed(1)}KB`);
}
