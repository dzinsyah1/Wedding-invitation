import * as Phaser from "phaser";
import type { Player } from "@/game/player/Player";
import type { TeleportFx } from "@/game/systems/TeleportFx";
import { textureKey } from "@/game/world/env";

const PETAL = "arrival-petal";
const DESCEND_MS = 3000;
const START_ABOVE = 560;

/**
 * Entrance scene: a pair of doves gently carries the guest down from the sky
 * (the doves hold the raised hands of the jump pose), petals drift around them,
 * a glowing ring marks the landing spot, and on touchdown the doves fly off.
 * Falls back to the same descent without doves when their art isn't loaded.
 */
export class ArrivalFx {
  constructor(
    private scene: Phaser.Scene,
    private fx: TeleportFx
  ) {
    this.ensurePetal();
  }

  private ensurePetal() {
    if (this.scene.textures.exists(PETAL)) return;
    const g = this.scene.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(0xf6c6d0, 1);
    g.fillEllipse(6, 4, 12, 7);
    g.fillStyle(0xfbe3e7, 1);
    g.fillEllipse(5, 3, 6, 3);
    g.generateTexture(PETAL, 12, 8);
    g.destroy();
  }

  play(player: Player, onLanded: () => void) {
    const scene = this.scene;
    const groundY = player.y;
    const x = player.x;

    player.floating = true;
    player.setAlpha(1);
    player.y = groundY - START_ABOVE;

    const marker = this.landingMarker(x, groundY);
    const petals = this.petals(player);
    const doves = this.doves(player);

    // Slow, floaty descent that eases into the ground; a gentle side-to-side drift.
    const drift = { t: 0 };
    scene.tweens.add({
      targets: drift,
      t: 1,
      duration: DESCEND_MS,
      ease: "Linear",
      onUpdate: () => {
        const e = Phaser.Math.Easing.Sine.Out(drift.t);
        player.y = groundY - START_ABOVE * (1 - e);
        player.x = x + Math.sin(drift.t * Math.PI * 2.2) * 14 * (1 - drift.t);
        doves?.follow();
      },
      onComplete: () => {
        player.x = x;
        player.touchDown();
        this.fx.burst(x, groundY);
        scene.cameras.main.shake(140, 0.0025);
        marker.release();
        petals.stop();
        doves?.release();
        scene.time.delayedCall(260, onLanded);
      },
    });
  }

  /** Pulsing gold ring on the ground where the guest will land. */
  private landingMarker(x: number, y: number) {
    const scene = this.scene;
    const ring = scene.add.ellipse(x, y + 4, 70, 18).setStrokeStyle(2, 0xe8b84a, 0.9).setDepth(19).setAlpha(0);
    const glow = scene.add.ellipse(x, y + 4, 90, 24, 0xfff1c9, 0.35).setDepth(18).setAlpha(0).setBlendMode(Phaser.BlendModes.ADD);
    scene.tweens.add({ targets: [ring, glow], alpha: 1, duration: 600 });
    const pulse = scene.tweens.add({ targets: ring, scaleX: 1.25, scaleY: 1.25, duration: 900, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    return {
      release: () => {
        pulse.stop();
        scene.tweens.add({
          targets: [ring, glow],
          alpha: 0,
          scaleX: 1.8,
          scaleY: 1.8,
          duration: 500,
          onComplete: () => {
            ring.destroy();
            glow.destroy();
          },
        });
      },
    };
  }

  /** Petals drifting down around the descending guest. */
  private petals(player: Player) {
    const emitter = this.scene.add.particles(0, 0, PETAL, {
      follow: player,
      followOffset: { x: 0, y: -90 },
      emitZone: { type: "random", source: new Phaser.Geom.Rectangle(-110, -60, 220, 60) } as Phaser.Types.GameObjects.Particles.EmitZoneData,
      speedY: { min: 30, max: 70 },
      speedX: { min: -25, max: 25 },
      rotate: { min: 0, max: 360 },
      scale: { min: 0.7, max: 1.2 },
      alpha: { start: 0.95, end: 0 },
      lifespan: 2200,
      frequency: 90,
    });
    emitter.setDepth(21);
    return {
      stop: () => {
        emitter.stop();
        this.scene.time.delayedCall(2400, () => emitter.destroy());
      },
    };
  }

  private doves(player: Player) {
    const scene = this.scene;
    const flyA = textureKey(scene, "pixar-dove-fly-a");
    const flyB = textureKey(scene, "pixar-dove-fly-b");
    if (!scene.textures.exists(flyA) || !scene.textures.exists(flyB)) return null;

    const size = 46;
    // Hands of the raised-arms pose sit roughly at these offsets from the feet.
    const grips = [
      { dx: -32, dy: -72, flip: false },
      { dx: 32, dy: -72, flip: true },
    ];
    const birds = grips.map((g) =>
      scene.add.image(0, 0, flyA).setOrigin(0.5, 0.75).setDisplaySize(size, size).setFlipX(g.flip).setDepth(22)
    );

    let frame = 0;
    const flap = scene.time.addEvent({
      delay: 140,
      loop: true,
      callback: () => {
        frame ^= 1;
        birds.forEach((b) => {
          if (b.active) b.setTexture(frame ? flyB : flyA).setDisplaySize(size, size);
        });
      },
    });

    const follow = () =>
      birds.forEach((b, i) => {
        const g = grips[i];
        b.setPosition(player.x + g.dx, player.y + g.dy - (frame ? 3 : 0));
        b.setAngle(g.flip ? 8 : -8);
      });
    follow();

    return {
      follow,
      release: () => {
        // Let go and fly off up and away in opposite directions.
        birds.forEach((b, i) => {
          const dir = i === 0 ? -1 : 1;
          b.setFlipX(dir > 0);
          scene.tweens.add({
            targets: b,
            x: b.x + dir * 420,
            y: b.y - 360,
            angle: dir * -18,
            alpha: 0,
            duration: 1800,
            ease: "Sine.easeIn",
            onComplete: () => {
              if (i === 0) flap.remove();
              b.destroy();
            },
          });
        });
      },
    };
  }
}
