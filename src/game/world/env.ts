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
    if (options.tint) img.setTint(options.tint);
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
    if (options.tint) img.setTint(options.tint);
    if (options.flip && i % 2 === 1) img.setFlipX(true);
    sprites.push(img);
  }
  return sprites;
}
