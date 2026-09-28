import * as Phaser from "phaser";
import type { WorldConfig, WorldLocation } from "@/types/wedding";
import type { Player } from "@/game/player/Player";
import { GAME_EVENTS, gameEvents } from "@/game/events/gameEvents";
import { textureKey } from "@/game/world/env";

const HEART = "play-heart";
const SPARK = "play-spark";
const PAD_TEX = "play-bounce-flower";

/** Peak height of a bounce, in world px (a normal jump peaks at ~62px). */
const BOUNCE_HEIGHT = 300;
/** Height of the blossom's landing disc above the path, and how close counts. */
const PAD_TOP = 47;
const PAD_REACH = 46;
const PAD_SCALE = 0.6;

type ChimeKind = "bounce" | "catch" | "release" | "all";
type DoveState = "perch" | "hover" | "carried" | "free";

interface Pad {
  x: number;
  /** Where a bounce lands, left / right of the pad. */
  toLeft: number;
  toRight: number;
  flower: Phaser.GameObjects.Image;
}

interface WildDove {
  sprite: Phaser.GameObjects.Image;
  glow: Phaser.GameObjects.Ellipse | null;
  state: DoveState;
  homeY: number;
  bob: number;
}

/**
 * Playful extras between the invitation stops:
 * - Bounce blossoms: a giant flower on a coiled spring stem. Land on it and
 *   you're flung high in an arc toward the next stop (steerable mid-air).
 * - Doves to catch and release: some perch along the path, some hover high up
 *   where only a bounce reaches. Touch one and it rides on your head; release
 *   it and it flies off carrying a prayer for the couple. Releasing them all
 *   sends a whole flock across the sky.
 */
export class PlaySystem {
  private pads: Pad[] = [];
  private doves: WildDove[] = [];
  private carried: WildDove | null = null;
  private released = 0;
  private padHintShown = false;
  private prevY = 0;
  private reduced: boolean;
  private flyA: string;
  private flyB: string;
  private idle: string;
  private flapT = 0;

  constructor(
    private scene: Phaser.Scene,
    private world: WorldConfig,
    private player: Player,
    private onChime: (kind: ChimeKind) => void
  ) {
    this.reduced = Boolean(scene.game.registry.get("reducedMotion"));
    this.flyA = textureKey(scene, "pixar-dove-fly-a");
    this.flyB = textureKey(scene, "pixar-dove-fly-b");
    this.idle = textureKey(scene, "pixar-dove-idle");
    this.ensureTextures();
    this.build(world.locations.filter((l) => l.enabled));
    this.prevY = player.y;
  }

  /** Publish the dove count (call once the HUD is on screen). */
  emitCount() {
    gameEvents.emit(GAME_EVENTS.DOVES, {
      released: this.released,
      total: this.doves.length,
      carrying: Boolean(this.carried),
    });
  }

  private get dovesAvailable() {
    return this.scene.textures.exists(this.idle) && this.scene.textures.exists(this.flyA);
  }

  // ---------------------------------------------------------------- textures

  private ensureTextures() {
    const { scene } = this;
    if (!scene.textures.exists(HEART)) {
      const g = scene.make.graphics({ x: 0, y: 0 }, false);
      const heart = (cx: number, cy: number, r: number, color: number, alpha = 1) => {
        g.fillStyle(color, alpha);
        g.fillCircle(cx - r * 0.5, cy - r * 0.2, r * 0.56);
        g.fillCircle(cx + r * 0.5, cy - r * 0.2, r * 0.56);
        g.fillTriangle(cx - r * 1.02, cy - r * 0.02, cx + r * 1.02, cy - r * 0.02, cx, cy + r * 1.05);
      };
      heart(16, 15, 11, 0xc98890);
      heart(16, 14.5, 9.5, 0xf2a7b1);
      g.fillStyle(0xffffff, 0.7);
      g.fillEllipse(12, 11, 4, 3);
      g.generateTexture(HEART, 32, 32);
      g.destroy();
    }
    if (!scene.textures.exists(SPARK)) {
      const g = scene.make.graphics({ x: 0, y: 0 }, false);
      for (let r = 6; r > 0; r--) {
        g.fillStyle(0xffffff, 0.1 + (1 - r / 6) * 0.5);
        g.fillCircle(6, 6, r);
      }
      g.generateTexture(SPARK, 12, 12);
      g.destroy();
    }
    if (!scene.textures.exists(PAD_TEX)) this.paintBounceFlower();
  }

  /**
   * Hand-painted (canvas gradients) giant blossom opening upward on a coiled
   * vine spring: the spring says "bouncy", the wide gold disc says "land here".
   */
  private paintBounceFlower() {
    const W = 220;
    const H = 190;
    const tex = this.scene.textures.createCanvas(PAD_TEX, W, H);
    if (!tex) return;
    const ctx = tex.getContext();
    const cx = 110;
    const cy = 110;
    const baseY = 186;

    // Leaves at the foot of the stem.
    const leaf = (dir: number) => {
      ctx.save();
      ctx.translate(cx, baseY - 2);
      ctx.scale(dir, 1);
      const g = ctx.createLinearGradient(0, 0, 46, -20);
      g.addColorStop(0, "#5f8752");
      g.addColorStop(1, "#9dbb87");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(22, -26, 50, -16);
      ctx.quadraticCurveTo(26, 4, 0, 0);
      ctx.fill();
      ctx.strokeStyle = "rgba(60,90,50,0.55)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(2, -1);
      ctx.quadraticCurveTo(24, -12, 46, -15);
      ctx.stroke();
      ctx.restore();
    };
    leaf(-1);
    leaf(1);

    // Coiled vine spring: back half of each coil darker, drawn first.
    const coils = 3.5;
    const amp = 13;
    const top = cy + 10;
    const pt = (t: number) => ({
      x: cx + Math.sin(t * coils * Math.PI * 2) * amp,
      y: baseY - t * (baseY - top),
      front: Math.cos(t * coils * Math.PI * 2) > 0,
    });
    const steps = 160;
    for (const pass of [false, true]) {
      ctx.lineCap = "round";
      ctx.lineWidth = pass ? 7 : 6;
      ctx.strokeStyle = pass ? "#83aa6d" : "#4d6e42";
      for (let i = 0; i < steps; i++) {
        const a = pt(i / steps);
        const b = pt((i + 1) / steps);
        if (a.front !== pass) continue;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      if (pass) {
        // Highlight along the front of the coil.
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(220,240,200,0.7)";
        for (let i = 0; i < steps; i++) {
          const a = pt(i / steps);
          const b = pt((i + 1) / steps);
          if (!a.front) continue;
          ctx.beginPath();
          ctx.moveTo(a.x - 1.5, a.y - 1);
          ctx.lineTo(b.x - 1.5, b.y - 1);
          ctx.stroke();
        }
      }
    }

    const SQUASH = 0.4;
    const petal = (ang: number, len: number, wid: number, inner: string, outer: string, edge: string) => {
      const dx = Math.cos(ang);
      const dy = Math.sin(ang) * SQUASH;
      const px = -Math.sin(ang);
      const py = Math.cos(ang) * SQUASH;
      const tip = { x: cx + dx * len, y: cy + dy * len };
      const mid = { x: cx + dx * len * 0.55, y: cy + dy * len * 0.55 };
      const grad = ctx.createRadialGradient(cx, cy, 6, cx, cy, len);
      grad.addColorStop(0, inner);
      grad.addColorStop(1, outer);
      ctx.fillStyle = grad;
      ctx.strokeStyle = edge;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.quadraticCurveTo(mid.x + px * wid, mid.y + py * wid, tip.x, tip.y);
      ctx.quadraticCurveTo(mid.x - px * wid, mid.y - py * wid, cx, cy);
      ctx.fill();
      ctx.stroke();
      // Soft vein
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx + dx * len * 0.25, cy + dy * len * 0.25);
      ctx.lineTo(cx + dx * len * 0.8, cy + dy * len * 0.8);
      ctx.stroke();
    };

    // Back ring of petals (upper half on screen).
    for (let i = 0; i <= 8; i++) {
      const a = Math.PI + (i / 8) * Math.PI;
      petal(a, 96, 26, "#f1b3bd", "#fde8ec", "#e0a0aa");
    }
    // Landing disc: wide golden centre.
    const disc = ctx.createRadialGradient(cx - 8, cy - 5, 2, cx, cy, 42);
    disc.addColorStop(0, "#fff4d2");
    disc.addColorStop(0.5, "#f1cf78");
    disc.addColorStop(1, "#c89a3c");
    ctx.fillStyle = disc;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 42, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(160,110,40,0.6)";
    ctx.lineWidth = 1;
    ctx.stroke();
    // Stamen dots around the disc.
    ctx.fillStyle = "#b07d2e";
    for (let i = 0; i < 18; i++) {
      const t = (i / 18) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(t) * 32, cy + Math.sin(t) * 11, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    // Front petals: shorter so the disc stays visible.
    for (let i = 0; i <= 5; i++) {
      const a = 0.35 + (i / 5) * (Math.PI - 0.7);
      petal(a, 70, 24, "#f4bec7", "#fbdfe4", "#dc97a2");
    }
    tex.refresh();
  }

  // ------------------------------------------------------------------- build

  private build(locs: WorldLocation[]) {
    const groundY = this.world.groundY;
    const perchGaps = new Set([0, 2, 4, 6]);
    const hoverGaps = new Set([1, 5, 8]);
    for (let i = 0; i < locs.length - 1; i++) {
      const a = locs[i];
      const b = locs[i + 1];
      // Pad sits in the gap between the two stops.
      const padX = (a.x + a.width / 2 + (b.x - b.width / 2)) / 2;
      this.pads.push(this.makePad(padX, groundY, a.x, b.x));

      if (!this.dovesAvailable) continue;
      if (perchGaps.has(i)) this.addDove((a.x + padX) / 2 + 26, groundY, "perch");
      // High in the air on the bounce arc toward the next stop.
      if (hoverGaps.has(i)) this.addDove((padX + b.x) / 2, groundY - BOUNCE_HEIGHT - 26, "hover");
    }
  }

  private makePad(x: number, groundY: number, toLeft: number, toRight: number): Pad {
    const { scene } = this;
    const glow = scene.add
      .ellipse(x, groundY + 4, 130, 26, 0xfff1c9, 0.5)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(18);
    scene.add.ellipse(x, groundY + 5, 84, 12, 0x3d2f1e, 0.2).setDepth(18);

    const flower = scene.add.image(x, groundY + 4, PAD_TEX).setOrigin(0.5, 1).setScale(PAD_SCALE).setDepth(19);

    // Tiny golden motes rising from the disc: "jump here".
    const motes = scene.add.particles(x, groundY - PAD_TOP, SPARK, {
      emitZone: { type: "random", source: new Phaser.Geom.Rectangle(-24, -4, 48, 8) } as Phaser.Types.GameObjects.Particles.EmitZoneData,
      speedY: { min: -40, max: -22 },
      speedX: { min: -6, max: 6 },
      lifespan: 1400,
      scale: { start: 0.55, end: 0 },
      alpha: { start: 0.9, end: 0 },
      tint: [0xfff1c9, 0xe8b84a],
      frequency: this.reduced ? -1 : 280,
      blendMode: Phaser.BlendModes.ADD,
    });
    motes.setDepth(19);

    if (!this.reduced) {
      scene.tweens.add({ targets: glow, alpha: { from: 0.3, to: 0.7 }, duration: 1600, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
      this.idleSway(flower);
    }
    return { x, toLeft, toRight, flower };
  }

  private idleSway(flower: Phaser.GameObjects.Image) {
    this.scene.tweens.add({
      targets: flower,
      scaleY: PAD_SCALE * 0.96,
      scaleX: PAD_SCALE * 1.02,
      angle: { from: -1.5, to: 1.5 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  private addDove(x: number, y: number, state: "perch" | "hover") {
    const { scene } = this;
    const sprite = scene.add
      .image(x, y, state === "perch" ? this.idle : this.flyA)
      .setOrigin(0.5, 1)
      .setDepth(state === "perch" ? 19 : 18)
      .setFlipX(x % 2 > 1);
    sprite.setDisplaySize(40, 40);
    let glow: Phaser.GameObjects.Ellipse | null = null;
    if (state === "perch") {
      glow = scene.add.ellipse(x, y + 2, 46, 10, 0xfff1c9, 0.55).setBlendMode(Phaser.BlendModes.ADD).setDepth(18);
      if (!this.reduced) scene.tweens.add({ targets: glow, alpha: { from: 0.25, to: 0.7 }, duration: 1200, yoyo: true, repeat: -1 });
    }
    this.doves.push({ sprite, glow, state, homeY: y, bob: Math.random() * Math.PI * 2 });
  }

  // ------------------------------------------------------------------ update

  update(delta = 16) {
    const p = this.player;
    const dt = delta / 1000;

    // First time near a pad: a one-off tip in the UI.
    if (!this.padHintShown && this.pads.some((pad) => Math.abs(p.x - pad.x) < 140)) {
      this.padHintShown = true;
      gameEvents.emit(GAME_EVENTS.PAD_NEAR);
    }

    if (!p.isLaunched) {
      const topY = this.world.groundY - PAD_TOP;
      // Falling onto the blossom's disc from a jump…
      const crossedTop = p.verticalSpeed > 0 && this.prevY < topY && p.y >= topY;
      // …or landing on the path right at its foot.
      if (crossedTop || p.justLanded) {
        const pad = this.pads.find((pd) => Math.abs(p.x - pd.x) < PAD_REACH);
        if (pad) this.bounce(pad);
      }
    }
    this.prevY = p.y;

    this.updateDoves(dt);
  }

  private updateDoves(dt: number) {
    if (!this.doves.length) return;
    const p = this.player;
    this.flapT += dt;
    const flapKey = Math.floor(this.flapT / 0.14) % 2 ? this.flyB : this.flyA;

    for (const d of this.doves) {
      d.bob += dt * 2.6;
      if (d.state === "hover") {
        d.sprite.setTexture(flapKey).setDisplaySize(40, 40);
        d.sprite.y = d.homeY + Math.sin(d.bob) * 6;
      } else if (d.state === "perch" && !this.reduced) {
        // Occasional little hop.
        d.sprite.y = d.homeY - Math.max(0, Math.sin(d.bob * 0.7)) ** 12 * 10;
      } else if (d.state === "carried") {
        // Riding on the guest's head, facing where they walk.
        d.sprite.setFlipX(p.facing < 0);
        d.sprite.x = p.x - p.facing * 3;
        d.sprite.y = p.y - 112 + Math.sin(d.bob * 2) * 1.2;
      }

      if (!this.carried && (d.state === "perch" || d.state === "hover")) {
        const near = Math.abs(p.x - d.sprite.x) < 34 && d.sprite.y > p.y - 140 && d.sprite.y < p.y + 10;
        if (near) this.catchDove(d);
      }
    }
  }

  // ------------------------------------------------------------------ bounce

  private bounce(pad: Pad) {
    const p = this.player;
    const target = p.facing >= 0 ? pad.toRight : pad.toLeft;
    p.x = pad.x;
    p.launch(target - pad.x, BOUNCE_HEIGHT);
    this.onChime("bounce");
    gameEvents.emit(GAME_EVENTS.PAD_BOUNCE);

    const { scene } = this;
    // Spring compresses, then boings back.
    scene.tweens.killTweensOf(pad.flower);
    pad.flower.setAngle(0).setScale(PAD_SCALE * 1.14, PAD_SCALE * 0.58);
    scene.tweens.add({
      targets: pad.flower,
      scaleX: PAD_SCALE,
      scaleY: PAD_SCALE,
      duration: 650,
      ease: "Elastic.easeOut",
      onComplete: () => {
        if (!this.reduced) this.idleSway(pad.flower);
      },
    });
    this.burst(pad.x, this.world.groundY - PAD_TOP, 0xfbe0e3, 14, 150);

    // A short sparkle trail while airborne.
    const trail = scene.add.particles(0, 0, SPARK, {
      follow: p,
      followOffset: { x: 0, y: -50 },
      lifespan: 600,
      speed: { min: 5, max: 30 },
      scale: { start: 0.9, end: 0 },
      alpha: { start: 0.9, end: 0 },
      tint: [0xfff1c9, 0xf6c6d0, 0xe8b84a],
      frequency: 30,
      blendMode: Phaser.BlendModes.ADD,
    });
    trail.setDepth(21);
    const watch = scene.time.addEvent({
      delay: 50,
      loop: true,
      callback: () => {
        if (p.isLaunched) return;
        watch.remove();
        trail.stop();
        scene.time.delayedCall(700, () => trail.destroy());
      },
    });
  }

  // ------------------------------------------------------------------- doves

  private catchDove(d: WildDove) {
    const { scene } = this;
    d.state = "carried";
    this.carried = d;
    d.sprite.setTexture(this.idle).setDisplaySize(34, 34).setDepth(21);
    if (d.glow) {
      scene.tweens.killTweensOf(d.glow);
      scene.tweens.add({ targets: d.glow, alpha: 0, duration: 300, onComplete: () => d.glow?.destroy() });
      d.glow = null;
    }
    this.burst(d.sprite.x, d.sprite.y - 20, 0xffffff, 10, 90);
    this.onChime("catch");
    this.emitCount();
    gameEvents.emit(GAME_EVENTS.DOVE_CAUGHT);
  }

  /** Let the carried dove fly away, trailing little hearts (a prayer for the couple). */
  releaseDove() {
    const d = this.carried;
    if (!d) return;
    this.carried = null;
    d.state = "free";
    this.released += 1;
    const { scene } = this;
    const dir = this.player.facing || 1;
    const startX = d.sprite.x;
    const startY = d.sprite.y;

    const trail = scene.add.particles(0, 0, HEART, {
      follow: d.sprite,
      followOffset: { x: 0, y: -14 },
      lifespan: 1100,
      speedY: { min: 10, max: 40 },
      speedX: { min: -20, max: 20 },
      scale: { start: 0.7, end: 0 },
      alpha: { start: 1, end: 0 },
      frequency: 110,
    });
    trail.setDepth(20);

    const flight = { t: 0 };
    d.sprite.setFlipX(dir < 0);
    scene.tweens.add({
      targets: flight,
      t: 1,
      duration: 2600,
      ease: "Sine.easeIn",
      onUpdate: () => {
        const t = flight.t;
        d.sprite.setTexture(Math.floor(t * 40) % 2 ? this.flyB : this.flyA).setDisplaySize(40 + t * 8, 40 + t * 8);
        d.sprite.x = startX + dir * t * 320 + Math.sin(t * Math.PI * 3) * 18;
        d.sprite.y = startY - t * 540;
        d.sprite.setAlpha(1 - Math.max(0, t - 0.75) * 4);
      },
      onComplete: () => {
        trail.stop();
        scene.time.delayedCall(1200, () => trail.destroy());
        d.sprite.destroy();
      },
    });
    this.burst(startX, startY - 20, 0xf6c6d0, 14, 140);

    const all = this.released === this.doves.length;
    this.onChime(all ? "all" : "release");
    this.emitCount();
    if (all) scene.time.delayedCall(700, () => this.celebrate());
  }

  /** Finale: a flock of doves sweeps across the sky with a shower of hearts. */
  private celebrate() {
    const { scene } = this;
    const view = scene.cameras.main.worldView;
    for (let i = 0; i < 9; i++) {
      const row = Math.abs(i - 4);
      const bird = scene.add
        .image(view.x - 80 - row * 46, view.y + 90 + row * 22, this.flyA)
        .setOrigin(0.5, 1)
        .setDepth(40);
      bird.setDisplaySize(38, 38);
      let f = 0;
      scene.tweens.add({
        targets: bird,
        x: view.right + 160 + (4 - row) * 40,
        y: bird.y - 60,
        duration: 3800,
        delay: i * 40,
        ease: "Sine.easeInOut",
        onUpdate: () => {
          f += 1;
          bird.setTexture(Math.floor(f / 6) % 2 ? this.flyB : this.flyA).setDisplaySize(38, 38);
        },
        onComplete: () => bird.destroy(),
      });
    }
    const rain = scene.add.particles(0, 0, HEART, {
      x: { min: view.x, max: view.right },
      y: view.y - 20,
      lifespan: 3200,
      speedY: { min: 80, max: 150 },
      speedX: { min: -25, max: 25 },
      rotate: { min: -30, max: 30 },
      scale: { min: 0.6, max: 1.1 },
      alpha: { start: 1, end: 0.2 },
      quantity: 1,
      frequency: 90,
    });
    rain.setDepth(40);
    scene.time.delayedCall(2400, () => rain.stop());
    scene.time.delayedCall(6000, () => rain.destroy());
  }

  private burst(x: number, y: number, tint: number, count: number, speed: number) {
    const e = this.scene.add.particles(x, y, SPARK, {
      speed: { min: speed * 0.4, max: speed },
      angle: { min: 0, max: 360 },
      lifespan: 650,
      scale: { start: 1, end: 0 },
      alpha: { start: 1, end: 0 },
      tint: [tint, 0xfff1c9, 0xe8b84a],
      blendMode: Phaser.BlendModes.ADD,
      emitting: false,
    });
    e.setDepth(22);
    e.explode(count);
    this.scene.time.delayedCall(800, () => e.destroy());
  }
}
