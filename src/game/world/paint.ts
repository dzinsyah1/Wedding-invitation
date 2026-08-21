import * as Phaser from "phaser";

export function gfx(scene: Phaser.Scene) {
  return scene.add.graphics();
}

export function blob(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  w: number,
  h: number,
  color: number,
  alpha = 1
) {
  g.fillStyle(color, alpha);
  g.fillEllipse(x, y, w, h);
}

export function round(
  g: Phaser.GameObjects.Graphics,
  cx: number,
  cy: number,
  w: number,
  h: number,
  r: number,
  color: number,
  alpha = 1
) {
  g.fillStyle(color, alpha);
  g.fillRoundedRect(cx - w / 2, cy - h / 2, w, h, r);
}

export function canopy(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  size: number,
  colors: [number, number, number]
) {
  blob(g, x + 6, y + 10, size * 0.95, size * 0.72, colors[0], 0.95);
  blob(g, x - size * 0.28, y + 4, size * 0.62, size * 0.5, colors[1], 0.92);
  blob(g, x + size * 0.26, y - 2, size * 0.58, size * 0.48, colors[1], 0.9);
  blob(g, x, y - size * 0.18, size * 0.72, size * 0.55, colors[2], 0.88);
  blob(g, x - size * 0.08, y - size * 0.28, size * 0.34, size * 0.22, 0xdde9c8, 0.28);
}

export function flower(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  color: number,
  size = 7
) {
  blob(g, x, y + 2, 3, 8, 0x6a8f5c, 0.9);
  blob(g, x, y, size, size * 0.85, color, 0.95);
  blob(g, x - 1, y - 1, size * 0.35, size * 0.3, 0xfff6d8, 0.55);
}

export function mound(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  w: number,
  h: number,
  base: number,
  shade: number,
  light: number
) {
  blob(g, x, y, w, h, base, 1);
  blob(g, x + w * 0.14, y + h * 0.1, w * 0.72, h * 0.72, shade, 0.28);
  blob(g, x - w * 0.16, y - h * 0.22, w * 0.42, h * 0.32, light, 0.38);
}

export function fluffyCloud(g: Phaser.GameObjects.Graphics, x: number, y: number, size: number) {
  blob(g, x + 10, y + size * 0.22, size * 1.35, size * 0.48, 0x7eabc4, 0.28);
  blob(g, x, y, size * 1.25, size * 0.52, 0xffffff, 0.96);
  blob(g, x + size * 0.38, y - size * 0.12, size * 0.78, size * 0.42, 0xffffff, 0.95);
  blob(g, x - size * 0.34, y - size * 0.06, size * 0.72, size * 0.4, 0xffffff, 0.94);
  blob(g, x + size * 0.08, y - size * 0.22, size * 0.55, size * 0.32, 0xffffff, 0.9);
  blob(g, x - size * 0.08, y - size * 0.16, size * 0.32, size * 0.18, 0xf3fbff, 0.45);
}

export function lantern(scene: Phaser.Scene, x: number, y: number) {
  const wrap = scene.add.container(x, y);
  const glow = scene.add.circle(0, 4, 16, 0xf8e3a0, 0.18);
  const body = scene.add.ellipse(0, 4, 11, 14, 0xf3c97a);
  const cap = scene.add.rectangle(0, -4, 12, 4, 0x8b5e3c);
  const cord = scene.add.rectangle(0, -12, 1.5, 12, 0x8b5e3c, 0.7);
  wrap.add([glow, cord, body, cap]);
  scene.tweens.add({
    targets: [glow, body],
    alpha: { from: 0.55, to: 1 },
    duration: 1600 + Math.random() * 400,
    yoyo: true,
    repeat: -1,
  });
  return wrap;
}

/** Vintage garden lantern on a post — Pixar floral path accent */
export function gardenLantern(
  scene: Phaser.Scene,
  x: number,
  groundY: number,
  reducedMotion = false
) {
  const wrap = scene.add.container(x, groundY);
  const g = gfx(scene);
  g.fillStyle(0x6a5340, 1);
  g.fillRoundedRect(-3, -78, 6, 78, 2);
  g.fillStyle(0x8b6a4a, 1);
  g.fillRoundedRect(-10, -88, 20, 8, 3);
  wrap.add(g);

  const glow = scene.add.circle(0, -102, 28, 0xffe9a8, 0.22);
  const body = scene.add.ellipse(0, -102, 18, 24, 0xf3c97a, 0.95);
  const core = scene.add.ellipse(0, -104, 8, 12, 0xfff6d8, 0.9);
  const cap = scene.add.triangle(0, -118, 0, -8, -14, 6, 14, 6, 0x6a5340);
  wrap.add([glow, body, core, cap]);

  if (!reducedMotion) {
    scene.tweens.add({
      targets: [glow, body, core],
      alpha: { from: 0.55, to: 1 },
      duration: 1400 + Math.random() * 600,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }
  return wrap;
}

/** Cream paper lantern hanging from the canopy — Pixar wedding garden */
export function hangingLantern(
  scene: Phaser.Scene,
  x: number,
  y: number,
  scale = 1,
  reducedMotion = false
) {
  const wrap = scene.add.container(x, y);
  const g = gfx(scene);
  const s = scale;

  g.lineStyle(1.5, 0xc4a878, 0.72);
  g.lineBetween(0, -10 * s, 0, -58 - 18 * s);

  blob(g, 0, 12 * s, 36 * s, 36 * s, 0xffe9b0, 0.16);
  blob(g, 0, 12 * s, 20 * s, 26 * s, 0xfff3d4, 1);
  blob(g, 0, 16 * s, 17 * s, 16 * s, 0xf0c878, 0.38);
  blob(g, -3.5 * s, 6 * s, 8 * s, 10 * s, 0xfffbf2, 0.7);
  blob(g, 0, 2.2 * s, 9 * s, 5 * s, 0xd4a85a, 1);
  blob(g, 0, 24 * s, 7.5 * s, 4 * s, 0xc4964a, 1);
  blob(g, 0, 28 * s, 2.2 * s, 5 * s, 0xe8b84a, 0.9);

  wrap.add(g);

  const glow = scene.add.circle(0, 12 * s, 18 * s, 0xfff2b8, 0.28);
  wrap.addAt(glow, 0);

  if (!reducedMotion) {
    scene.tweens.add({
      targets: glow,
      alpha: { from: 0.18, to: 0.42 },
      scale: { from: 0.92, to: 1.08 },
      duration: 1400 + Math.random() * 700,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
    scene.tweens.add({
      targets: wrap,
      angle: { from: -2.4 * s, to: 2.4 * s },
      duration: 2600 + Math.random() * 900,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }
  return wrap;
}

/** Soft fairy-light string draped above the path */
export function fairyLights(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  reducedMotion = false
) {
  const wrap = scene.add.container(x, y);
  const g = gfx(scene);
  g.lineStyle(1.5, 0xc4a878, 0.35);
  g.beginPath();
  const half = width / 2;
  const steps = 12;
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const lx = -half + t * width;
    const ly = 8 + Math.sin(t * Math.PI) * 20;
    if (i === 0) g.moveTo(lx, ly);
    else g.lineTo(lx, ly);
  }
  g.strokePath();
  wrap.add(g);

  const count = Math.max(5, Math.floor(width / 42));
  for (let i = 0; i < count; i += 1) {
    const t = i / (count - 1);
    const lx = -width / 2 + t * width;
    const ly = 8 + Math.sin(t * Math.PI) * 20;
    const glow = scene.add.circle(lx, ly, 7, 0xfff2b8, 0.35);
    const bead = scene.add.circle(lx, ly, 2.4, 0xfff8dc, 0.95);
    wrap.add([glow, bead]);
    if (!reducedMotion) {
      scene.tweens.add({
        targets: [glow, bead],
        alpha: { from: 0.35, to: 1 },
        duration: 900 + (i % 5) * 180,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
        delay: i * 80,
      });
    }
  }
  return wrap;
}

/** White rose / cream blossom cluster (procedural Pixar-style) */
export function whiteRoseBush(g: Phaser.GameObjects.Graphics, x: number, y: number, scale = 1) {
  mound(g, x, y, 72 * scale, 48 * scale, 0x4e8f38, 0x3e7a30, 0x6db054);
  const blooms: Array<[number, number, number]> = [
    [0, -18, 22],
    [-18, -8, 18],
    [16, -10, 17],
    [-8, -28, 14],
    [10, -26, 13],
    [-22, -20, 12],
    [22, -18, 11],
  ];
  blooms.forEach(([dx, dy, s]) => {
    blob(g, x + dx * scale, y + dy * scale, s * scale, s * 0.88 * scale, 0xfffef8, 0.98);
    blob(g, x + dx * scale - 2, y + dy * scale - 2, s * 0.4 * scale, s * 0.35 * scale, 0xfff6e8, 0.55);
    blob(g, x + dx * scale, y + dy * scale + 1, s * 0.22 * scale, s * 0.2 * scale, 0xf0d8a8, 0.45);
  });
}

/** Romantic floral wedding arch for depth landmarks */
export function floralArch(
  scene: Phaser.Scene,
  x: number,
  groundY: number,
  scale = 1,
  reducedMotion = false
) {
  const wrap = scene.add.container(x, groundY);
  const g = gfx(scene);
  const h = 210 * scale;
  const span = 150 * scale;

  // Pillars of foliage
  whiteRoseBush(g, -span / 2, -20 * scale, 1.15 * scale);
  whiteRoseBush(g, span / 2, -20 * scale, 1.15 * scale);

  // Arch canopy
  for (let i = 0; i <= 10; i += 1) {
    const t = i / 10;
    const ax = -span / 2 + t * span;
    const ay = -h * 0.55 + Math.sin(t * Math.PI) * (-h * 0.42);
    blob(g, ax, ay, 28 * scale, 24 * scale, 0xfffef8, 0.96);
    blob(g, ax - 4, ay - 4, 14 * scale, 12 * scale, 0xfff8ee, 0.5);
    if (i % 2 === 0) blob(g, ax, ay + 8, 18 * scale, 14 * scale, 0x5ea644, 0.75);
  }

  // Soft gold glow behind arch
  blob(g, 0, -h * 0.35, span * 0.7, 50 * scale, 0xffe9a8, 0.18);
  wrap.add(g);

  if (!reducedMotion) {
    scene.tweens.add({
      targets: wrap,
      angle: { from: -0.4, to: 0.4 },
      duration: 3200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }
  return wrap;
}

export function makePetalTexture(scene: Phaser.Scene, key = "petal") {
  const canvas = document.createElement("canvas");
  canvas.width = 20;
  canvas.height = 16;
  const ctx = canvas.getContext("2d");
  if (!ctx) return key;
  ctx.fillStyle = "rgba(255, 250, 245, 0.95)";
  ctx.beginPath();
  ctx.ellipse(10, 8, 8, 5, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 236, 210, 0.55)";
  ctx.beginPath();
  ctx.ellipse(9, 7, 3.5, 2.2, -0.4, 0, Math.PI * 2);
  ctx.fill();
  if (scene.textures.exists(key)) scene.textures.remove(key);
  scene.textures.addCanvas(key, canvas);
  return key;
}
