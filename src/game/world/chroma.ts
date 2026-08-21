import * as Phaser from "phaser";

export type ChromaKind = "cutout" | "plant" | "frame" | "cyan";

function isBlueSky(r: number, g: number, b: number) {
  const bright = (r + g + b) / 3;
  return b > 160 && g > 140 && r < 215 && b - r > 26 && g - r > 6 && bright > 138;
}

function isCyanKey(r: number, g: number, b: number) {
  return g > 180 && b > 180 && r < 110 && g - r > 80 && b - r > 80;
}

function isMagentaKey(r: number, g: number, b: number) {
  return r > 160 && b > 160 && g < 130 && r - g > 50 && b - g > 50;
}

function sampleCornerKey(px: Uint8ClampedArray, w: number, h: number) {
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

function nearKey(r: number, g: number, b: number, key: { r: number; g: number; b: number }, thresh: number) {
  return Math.abs(r - key.r) + Math.abs(g - key.g) + Math.abs(b - key.b) < thresh;
}

function punchKey(px: Uint8ClampedArray, w: number, h: number) {
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
    if (dist < 140) {
      px[i + 3] = Math.round(px[i + 3] * ((dist - 90) / 50));
    }
  }
}

function isWarmSky(r: number, g: number, b: number) {
  const bright = (r + g + b) / 3;
  const peach = r > 205 && g > 165 && b < 205 && r - b > 40 && g - b > 18 && bright > 170;
  const warmBlue = r > 175 && g > 135 && b < 200 && r > b + 8 && bright > 165 && b < 190;
  return peach || warmBlue;
}

function almostSky(r: number, g: number, b: number) {
  const bright = (r + g + b) / 3;
  return b > 145 && g > 125 && r < 230 && b >= r && bright > 125 && b - r > 12;
}

function plantIntoGround(px: Uint8ClampedArray, w: number, h: number) {
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

      if (ny > 0.7) {
        const down = (ny - 0.7) / 0.3;
        fade *= 1 - Math.pow(down, 1.35) * 0.9;
      }

      if (ny > 0.52) {
        const down = (ny - 0.52) / 0.48;
        fade *= 1 - Math.pow(Math.abs(nx), 1.4) * down * 0.92;
      }

      const grassy = ny > 0.58 && g > r + 6 && g > b && g > 68;
      const dirt = ny > 0.6 && r > 88 && g > 68 && b < 130 && r > b + 16 && Math.abs(r - g) < 55;
      if (grassy || dirt) {
        const down = (ny - 0.58) / 0.42;
        fade *= 1 - Math.pow(down, 0.9) * 0.88;
      }

      px[i + 3] = Math.max(0, Math.round(px[i + 3] * fade));
    }
  }
}

function softenEdges(px: Uint8ClampedArray, w: number, h: number) {
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

export function chromaAndCrop(
  scene: Phaser.Scene,
  sourceKey: string,
  destKey: string,
  mode: "blue" | "warm" = "blue",
  kind: ChromaKind = "cutout"
) {
  try {
    if (!scene.textures.exists(sourceKey)) return sourceKey;
    const src = scene.textures.get(sourceKey).getSourceImage() as HTMLImageElement;
    const w = src.width;
    const h = src.height;
    if (!w || !h) return sourceKey;

    const scratch = document.createElement("canvas");
    scratch.width = w;
    scratch.height = h;
    const ctx = scratch.getContext("2d", { willReadFrequently: true });
    if (!ctx) return sourceKey;
    ctx.drawImage(src, 0, 0);
    const data = ctx.getImageData(0, 0, w, h);
    const px = data.data;
    const test = mode === "warm" ? isWarmSky : isBlueSky;

    if (kind === "cyan") {
      punchKey(px, w, h);
    } else {
      for (let i = 0; i < px.length; i += 4) {
        if (test(px[i], px[i + 1], px[i + 2])) px[i + 3] = 0;
      }
      softenEdges(px, w, h);
    }
    if (kind === "plant") plantIntoGround(px, w, h);

    let minX = w;
    let minY = h;
    let maxX = 0;
    let maxY = 0;
    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        const a = px[(y * w + x) * 4 + 3];
        if (a > 12) {
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (maxX <= minX || maxY <= minY) return sourceKey;

    ctx.putImageData(data, 0, 0);

    if (kind === "frame") {
      if (scene.textures.exists(destKey)) scene.textures.remove(destKey);
      scene.textures.addCanvas(destKey, scratch);
      return destKey;
    }
    const pad = kind === "cyan" ? 2 : 6;
    const padBottom = kind === "cyan" ? 0 : pad;
    minX = Math.max(0, minX - pad);
    minY = Math.max(0, minY - pad);
    maxX = Math.min(w - 1, maxX + pad);
    maxY = Math.min(h - 1, maxY + padBottom);
    const cw = Math.max(8, maxX - minX);
    const ch = Math.max(8, maxY - minY);
    const cut = document.createElement("canvas");
    cut.width = cw;
    cut.height = ch;
    const cutCtx = cut.getContext("2d");
    if (!cutCtx) return sourceKey;
    cutCtx.drawImage(scratch, minX, minY, cw, ch, 0, 0, cw, ch);
    if (scene.textures.exists(destKey)) scene.textures.remove(destKey);
    scene.textures.addCanvas(destKey, cut);
    return destKey;
  } catch {
    return sourceKey;
  }
}
