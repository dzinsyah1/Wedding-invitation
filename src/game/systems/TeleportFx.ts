import * as Phaser from "phaser";
import type { Player } from "@/game/player/Player";

const SPARK = "tp-spark";
const BEAM = "tp-beam";
const SPARK_TINTS = [0xffe8a8, 0xfff8e8, 0xe8b84a, 0xf6c6d0];

// Light-beam teleport: the player stretches into a pillar of light, the camera
// flashes to the destination, and the player condenses back out of a new pillar.
export class TeleportFx {
  constructor(
    private scene: Phaser.Scene,
    private worldHeight: number,
    private reduced: boolean
  ) {
    this.ensureTexture();
  }

  private ensureTexture() {
    if (this.scene.textures.exists(SPARK)) return;
    const g = this.scene.make.graphics({ x: 0, y: 0 }, false);
    for (let r = 8; r > 0; r--) {
      g.fillStyle(0xffffff, 0.08 + (1 - r / 8) * 0.5);
      g.fillCircle(8, 8, r);
    }
    g.generateTexture(SPARK, 16, 16);
    g.destroy();

    if (this.scene.textures.exists(BEAM)) return;
    // Soft vertical beam: bright centre fading to the sides and toward the top.
    const w = 64;
    const h = 256;
    const tex = this.scene.textures.createCanvas(BEAM, w, h);
    if (!tex) return;
    const ctx = tex.getContext();
    const across = ctx.createLinearGradient(0, 0, w, 0);
    across.addColorStop(0, "rgba(255,255,255,0)");
    across.addColorStop(0.5, "rgba(255,255,255,1)");
    across.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = across;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "destination-in";
    const up = ctx.createLinearGradient(0, 0, 0, h);
    up.addColorStop(0, "rgba(0,0,0,0)");
    up.addColorStop(0.45, "rgba(0,0,0,0.85)");
    up.addColorStop(1, "rgba(0,0,0,1)");
    ctx.fillStyle = up;
    ctx.fillRect(0, 0, w, h);
    tex.refresh();
  }

  play(player: Player, targetX: number, onDone: () => void) {
    const cam = this.scene.cameras.main;

    const jump = () => {
      player.x = targetX;
      player.velocity = 0;
      cam.centerOn(targetX, this.worldHeight / 2);
    };

    if (this.reduced) {
      cam.fadeOut(160, 255, 246, 226);
      cam.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        jump();
        cam.fadeIn(220, 255, 246, 226);
        onDone();
      });
      return;
    }

    // Depart
    this.pillar(player.x, player.y);
    this.sparks(player.x, player.y);
    this.scene.tweens.add({
      targets: player,
      scaleX: 0.12,
      scaleY: 1.55,
      alpha: 0,
      delay: 140,
      duration: 360,
      ease: "Back.easeIn",
      onComplete: () => {
        cam.fadeOut(170, 255, 246, 226);
        cam.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
          jump();
          cam.fadeIn(280, 255, 246, 226);
          this.arrive(player, onDone);
        });
      },
    });
  }

  private arrive(player: Player, onDone: () => void) {
    this.pillar(player.x, player.y);
    this.sparks(player.x, player.y);
    this.ring(player.x, player.y);
    this.scene.tweens.add({
      targets: player,
      scaleX: 1,
      scaleY: 1,
      alpha: 1,
      delay: 160,
      duration: 420,
      ease: "Back.easeOut",
      onComplete: () => {
        // Small landing squash
        this.scene.tweens.add({
          targets: player,
          scaleX: 1.08,
          scaleY: 0.93,
          duration: 90,
          yoyo: true,
          onComplete: onDone,
        });
      },
    });
  }

  private pillar(x: number, y: number) {
    const beam = (width: number, tint: number, alpha: number, depth: number) => {
      const img = this.scene.add
        .image(x, y + 8, BEAM)
        .setOrigin(0.5, 1)
        .setTint(tint)
        .setAlpha(alpha)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(depth)
        .setDisplaySize(width, 380);
      const full = img.scaleX;
      img.scaleX = 0;
      return { img, full };
    };
    const glow = beam(150, 0xffd98a, 0.75, 19);
    const core = beam(46, 0xffffff, 0.9, 21);
    [glow, core].forEach(({ img, full }) =>
      this.scene.tweens.add({
        targets: img,
        scaleX: full,
        duration: 200,
        ease: "Sine.easeOut",
        hold: 220,
        yoyo: true,
        onComplete: () => img.destroy(),
      })
    );
  }

  /** Golden ring + rising sparks on the ground, e.g. for a landing. */
  burst(x: number, y: number) {
    this.ring(x, y);
    this.sparks(x, y);
  }

  private ring(x: number, y: number) {
    const ring = this.scene.add
      .ellipse(x, y + 4, 44, 12)
      .setStrokeStyle(3, 0xe8b84a, 0.95)
      .setDepth(19);
    this.scene.tweens.add({
      targets: ring,
      scaleX: 3.2,
      scaleY: 3.2,
      alpha: 0,
      duration: 700,
      ease: "Cubic.easeOut",
      onComplete: () => ring.destroy(),
    });
  }

  private sparks(x: number, y: number) {
    const emitter = this.scene.add.particles(x, y, SPARK, {
      speed: { min: 30, max: 110 },
      angle: { min: 235, max: 305 },
      lifespan: { min: 600, max: 1000 },
      scale: { start: 0.9, end: 0 },
      alpha: { start: 1, end: 0 },
      tint: SPARK_TINTS,
      gravityY: -80,
      frequency: 16,
      blendMode: Phaser.BlendModes.ADD,
      emitZone: {
        type: "random",
        source: new Phaser.Geom.Rectangle(-28, -110, 56, 110),
      } as Phaser.Types.GameObjects.Particles.EmitZoneData,
    });
    emitter.setDepth(22);
    this.scene.time.delayedCall(420, () => emitter.stop());
    this.scene.time.delayedCall(1600, () => emitter.destroy());
  }
}
