import * as Phaser from "phaser";

export function gfx(scene: Phaser.Scene) {
  return scene.add.graphics();
}

export function makeSunTexture(scene: Phaser.Scene, key = "sun-glow") {
  const size = 360;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return key;

  const cx = size / 2;
  const cy = size / 2;

  const halo = ctx.createRadialGradient(cx, cy, 8, cx, cy, size * 0.5);
  halo.addColorStop(0, "rgba(255, 244, 186, 0.5)");
  halo.addColorStop(0.18, "rgba(255, 214, 92, 0.28)");
  halo.addColorStop(0.4, "rgba(255, 196, 84, 0.1)");
  halo.addColorStop(0.7, "rgba(255, 188, 96, 0.04)");
  halo.addColorStop(1, "rgba(255, 200, 120, 0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, size, size);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 12; i += 1) {
    ctx.rotate(Math.PI / 6);
    const ray = ctx.createLinearGradient(0, -18, 0, -size * 0.38);
    ray.addColorStop(0, "rgba(255, 236, 170, 0.2)");
    ray.addColorStop(1, "rgba(255, 220, 120, 0)");
    ctx.fillStyle = ray;
    ctx.beginPath();
    ctx.moveTo(-2.8, -16);
    ctx.lineTo(0, -size * 0.38);
    ctx.lineTo(2.8, -16);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  const core = ctx.createRadialGradient(cx - 7, cy - 9, 2, cx, cy, 46);
  core.addColorStop(0, "rgba(255, 252, 242, 1)");
  core.addColorStop(0.32, "rgba(255, 230, 130, 1)");
  core.addColorStop(0.68, "rgba(255, 186, 58, 0.95)");
  core.addColorStop(1, "rgba(255, 168, 40, 0)");
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(cx, cy, 48, 0, Math.PI * 2);
  ctx.fill();

  if (scene.textures.exists(key)) scene.textures.remove(key);
  scene.textures.addCanvas(key, canvas);
  return key;
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
