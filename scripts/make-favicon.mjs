// Renders the "D & T" monogram favicon (cream disc, gold rings, sage leaves)
// into the icon files Next.js picks up from src/app.
//
//   node scripts/make-favicon.mjs
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APP = path.join(ROOT, "src/app");

const svg = (withLeaves) => `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="bg" cx="42%" cy="36%" r="70%">
      <stop offset="0" stop-color="#fffdf6"/>
      <stop offset="0.65" stop-color="#fbeed3"/>
      <stop offset="1" stop-color="#efd9a8"/>
    </radialGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f6dfa6"/>
      <stop offset="0.5" stop-color="#c49a45"/>
      <stop offset="1" stop-color="#e8c77a"/>
    </linearGradient>
  </defs>
  <circle cx="256" cy="256" r="248" fill="url(#bg)"/>
  <circle cx="256" cy="256" r="236" fill="none" stroke="url(#gold)" stroke-width="14"/>
  <circle cx="256" cy="256" r="212" fill="none" stroke="#c49a45" stroke-opacity="0.55" stroke-width="3"/>
  ${
    withLeaves
      ? `<g fill="#8fa387">
    <path d="M256 430c-30-6-58-24-74-50 30 2 58 20 74 50z"/>
    <path d="M256 430c30-6 58-24 74-50-30 2-58 20-74 50z"/>
  </g>
  <circle cx="256" cy="430" r="11" fill="#e8a9b2" stroke="#c98890" stroke-width="3"/>`
      : ""
  }
  <text x="150" y="${withLeaves ? 318 : 332}" font-family="Didot, 'Bodoni 72', Georgia, serif" font-size="${withLeaves ? 230 : 262}" fill="#3d4a3f" text-anchor="middle">D</text>
  <text x="362" y="${withLeaves ? 318 : 332}" font-family="Didot, 'Bodoni 72', Georgia, serif" font-size="${withLeaves ? 230 : 262}" fill="#3d4a3f" text-anchor="middle">T</text>
  <text x="256" y="${withLeaves ? 296 : 306}" font-family="Georgia, serif" font-style="italic" font-size="${withLeaves ? 110 : 120}" fill="#c98890" text-anchor="middle">&amp;</text>
</svg>`;

// Detailed version for larger icons, simplified (no leaves, bigger letters) for tiny tabs.
await sharp(Buffer.from(svg(true))).resize(512, 512).png().toFile(path.join(APP, "icon.png"));
await sharp(Buffer.from(svg(true)))
  .resize(180, 180)
  .flatten({ background: "#fff8ee" })
  .png()
  .toFile(path.join(APP, "apple-icon.png"));

// favicon.ico with 16/32/48px PNG frames (ICO container around PNG data).
const sizes = [16, 32, 48];
const frames = await Promise.all(sizes.map((s) => sharp(Buffer.from(svg(false))).resize(s, s).png().toBuffer()));
const header = Buffer.alloc(6 + 16 * frames.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(frames.length, 4);
let offset = header.length;
frames.forEach((buf, i) => {
  const e = 6 + i * 16;
  header.writeUInt8(sizes[i], e);
  header.writeUInt8(sizes[i], e + 1);
  header.writeUInt8(0, e + 2);
  header.writeUInt8(0, e + 3);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(buf.length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += buf.length;
});
await writeFile(path.join(APP, "favicon.ico"), Buffer.concat([header, ...frames]));
console.log("icon.png, apple-icon.png, favicon.ico written to src/app");
