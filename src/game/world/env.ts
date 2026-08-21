import * as Phaser from "phaser";

export function textureKey(scene: Phaser.Scene, key: string) {
  if (scene.textures.exists(key)) return key;
  const raw = key.replace("pixar-", "raw-");
  return scene.textures.exists(raw) ? raw : key;
}

export function sprinkle(
  scene: Phaser.Scene,
  key: string,
  options: {
    y: number;
    originY?: number;
    height: number;
    worldWidth: number;
    step: number;
    scroll: number;
    depth: number;
    start?: number;
    jitterX?: number;
    jitterY?: number;
    flip?: boolean;
    alpha?: number;
    tint?: number;
  }
) {
  const tex = textureKey(scene, key);
  if (!scene.textures.exists(tex)) return [];
  const frame = scene.textures.get(tex).get();
  const aspect = frame.width / Math.max(1, frame.height);
  const width = options.height * aspect;
  const sprites: Phaser.GameObjects.Image[] = [];
  const start = options.start ?? -width / 2;
  for (let x = start, i = 0; x < options.worldWidth + width; x += options.step, i += 1) {
    const img = scene.add.image(
      x + (options.jitterX ? ((i * 47) % options.jitterX) - options.jitterX / 2 : 0),
      options.y + (options.jitterY ? ((i * 31) % options.jitterY) - options.jitterY / 2 : 0),
      tex
    );
    img.setOrigin(0.5, options.originY ?? 1);
    img.setDisplaySize(width, options.height);
    img.setScrollFactor(options.scroll);
    img.setDepth(options.depth);
    if (options.alpha !== undefined) img.setAlpha(options.alpha);
    if (options.tint !== undefined) img.setTint(options.tint);
    if (options.flip && i % 2 === 1) img.setFlipX(true);
    sprites.push(img);
  }
  return sprites;
}

export function scatter(
  scene: Phaser.Scene,
  keys: string[],
  options: {
    y: number;
    originY?: number;
    height: number;
    worldWidth: number;
    step: number;
    scroll: number;
    depth: number;
    start?: number;
    jitterX?: number;
    jitterY?: number;
    heightJitter?: number;
    flip?: boolean;
    alpha?: number;
    tint?: number;
  }
) {
  const sprites: Phaser.GameObjects.Image[] = [];
  const resolved = keys.map((key) => textureKey(scene, key)).filter((key) => scene.textures.exists(key));
  if (!resolved.length) return sprites;

  const start = options.start ?? -80;
  for (let x = start, i = 0; x < options.worldWidth + 120; x += options.step, i += 1) {
    const tex = resolved[i % resolved.length];
    const frame = scene.textures.get(tex).get();
    const aspect = frame.width / Math.max(1, frame.height);
    const h =
      options.height +
      (options.heightJitter ? ((i * 37) % options.heightJitter) - options.heightJitter / 2 : 0);
    const img = scene.add.image(
      x + (options.jitterX ? ((i * 47) % options.jitterX) - options.jitterX / 2 : 0),
      options.y + (options.jitterY ? ((i * 31) % options.jitterY) - options.jitterY / 2 : 0),
      tex
    );
    img.setOrigin(0.5, options.originY ?? 1);
    img.setDisplaySize(Math.max(24, h * aspect), Math.max(20, h));
    img.setScrollFactor(options.scroll);
    img.setDepth(options.depth);
    if (options.alpha !== undefined) img.setAlpha(options.alpha);
    if (options.tint !== undefined) img.setTint(options.tint);
    if (options.flip && i % 2 === 1) img.setFlipX(true);
    sprites.push(img);
  }
  return sprites;
}

/** Overlapping strip so tiles read as one continuous bed/wall, not stickers. */
export function tileStrip(
  scene: Phaser.Scene,
  key: string,
  options: {
    y: number;
    originY?: number;
    height: number;
    worldWidth: number;
    scroll: number;
    depth: number;
    overlap?: number;
    start?: number;
    jitterY?: number;
    heightJitter?: number;
    flip?: boolean;
    alpha?: number;
    tint?: number;
  }
) {
  const tex = textureKey(scene, key);
  if (!scene.textures.exists(tex)) return [];
  const frame = scene.textures.get(tex).get();
  const aspect = frame.width / Math.max(1, frame.height);
  const sprites: Phaser.GameObjects.Image[] = [];
  const overlap = Phaser.Math.Clamp(options.overlap ?? 0.42, 0.15, 0.7);
  let x = options.start ?? -40;
  let i = 0;
  while (x < options.worldWidth + 80) {
    const h =
      options.height +
      (options.heightJitter ? ((i * 37) % options.heightJitter) - options.heightJitter / 2 : 0);
    const w = Math.max(40, h * aspect);
    const img = scene.add.image(
      x,
      options.y + (options.jitterY ? ((i * 31) % options.jitterY) - options.jitterY / 2 : 0),
      tex
    );
    img.setOrigin(0.5, options.originY ?? 1);
    img.setDisplaySize(w, Math.max(24, h));
    img.setScrollFactor(options.scroll);
    img.setDepth(options.depth);
    if (options.alpha !== undefined) img.setAlpha(options.alpha);
    if (options.tint !== undefined) img.setTint(options.tint);
    if (options.flip && i % 2 === 1) img.setFlipX(true);
    sprites.push(img);
    x += w * (1 - overlap);
    i += 1;
  }
  return sprites;
}

export function tileMix(
  scene: Phaser.Scene,
  keys: string[],
  options: {
    y: number;
    originY?: number;
    height: number;
    worldWidth: number;
    scroll: number;
    depth: number;
    overlap?: number;
    start?: number;
    jitterY?: number;
    heightJitter?: number;
    flip?: boolean;
    alpha?: number;
  }
) {
  const sprites: Phaser.GameObjects.Image[] = [];
  const resolved = keys.map((key) => textureKey(scene, key)).filter((key) => scene.textures.exists(key));
  if (!resolved.length) return sprites;
  const overlap = Phaser.Math.Clamp(options.overlap ?? 0.38, 0.12, 0.7);
  let x = options.start ?? -40;
  let i = 0;
  while (x < options.worldWidth + 80) {
    const tex = resolved[i % resolved.length];
    const frame = scene.textures.get(tex).get();
    const aspect = frame.width / Math.max(1, frame.height);
    const h =
      options.height +
      (options.heightJitter ? ((i * 41) % options.heightJitter) - options.heightJitter / 2 : 0);
    const w = Math.max(36, h * aspect);
    const img = scene.add.image(
      x,
      options.y + (options.jitterY ? ((i * 29) % options.jitterY) - options.jitterY / 2 : 0),
      tex
    );
    img.setOrigin(0.5, options.originY ?? 1);
    img.setDisplaySize(w, Math.max(22, h));
    img.setScrollFactor(options.scroll);
    img.setDepth(options.depth);
    if (options.alpha !== undefined) img.setAlpha(options.alpha);
    if (options.flip && i % 2 === 1) img.setFlipX(true);
    sprites.push(img);
    x += w * (1 - overlap);
    i += 1;
  }
  return sprites;
}

/** Bake one continuous foreground ribbon so tiles don't read as stickers. */
export function bakeRibbon(
  scene: Phaser.Scene,
  key: string,
  destKey: string,
  worldWidth: number,
  height: number
) {
  const tex = textureKey(scene, key);
  if (!scene.textures.exists(tex)) return "";
  const src = scene.textures.get(tex).getSourceImage() as HTMLImageElement | HTMLCanvasElement;
  const sw = (src as HTMLImageElement).width;
  const sh = (src as HTMLImageElement).height;
  if (!sw || !sh) return "";

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(64, Math.ceil(worldWidth + 240));
  canvas.height = Math.max(32, Math.ceil(height));
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const drawW = height * (sw / sh);
  const step = drawW * 0.48;
  for (let x = -drawW * 0.2, i = 0; x < canvas.width; x += step, i += 1) {
    ctx.save();
    if (i % 2 === 1) {
      ctx.translate(x + drawW, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(src, 0, 0, drawW, height);
    } else {
      ctx.drawImage(src, x, 0, drawW, height);
    }
    ctx.restore();
  }

  if (scene.textures.exists(destKey)) scene.textures.remove(destKey);
  scene.textures.addCanvas(destKey, canvas);
  return destKey;
}
