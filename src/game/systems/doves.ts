import * as Phaser from "phaser";
import type { WorldConfig } from "@/types/wedding";
import { textureKey } from "@/game/world/env";

type DoveState = "soar" | "descend" | "landed" | "takeoff";

function keyOf(scene: Phaser.Scene, name: string) {
  return textureKey(scene, name);
}

class Dove {
  private sprite: Phaser.GameObjects.Image;
  private state: DoveState = "soar";
  private vx: number;
  private flapT = 0;
  private frame = 0;
  private wait = 1500 + Math.random() * 4000;
  private bob = Math.random() * Math.PI * 2;
  private hopT = 0;
  private fromX = 0;
  private fromY = 0;
  private toX = 0;
  private toY = 0;
  private t = 0;
  private dur = 1;
  private readonly size = 44;
  private flyA: string;
  private flyB: string;
  private idle: string;

  constructor(
    private scene: Phaser.Scene,
    private world: WorldConfig,
    x: number
  ) {
    this.flyA = keyOf(scene, "pixar-dove-fly-a");
    this.flyB = keyOf(scene, "pixar-dove-fly-b");
    this.idle = keyOf(scene, "pixar-dove-idle");
    const startKey = scene.textures.exists(this.flyA) ? this.flyA : keyOf(scene, "pixar-bird");
    this.sprite = scene.add.image(x, 70 + Math.random() * 90, startKey);
    this.sprite.setOrigin(0.5, 1);
    this.sprite.setDisplaySize(this.size, this.size);
    this.sprite.setDepth(16);
    this.vx = (Math.random() > 0.5 ? 1 : -1) * Phaser.Math.Between(42, 78);
    this.sprite.setFlipX(this.vx < 0);
  }

  update(delta: number, playerX: number) {
    if (!this.sprite.active) return;
    const dt = delta / 1000;
    this.bob += dt * 2.4;

    if (this.state === "soar") this.soar(dt, playerX);
    else if (this.state === "descend") this.glide(dt, false);
    else if (this.state === "landed") this.perch(dt, playerX);
    else this.glide(dt, true);

    this.flap(dt);
  }

  private soar(dt: number, playerX: number) {
    this.sprite.x += this.vx * dt;
    this.sprite.y += Math.sin(this.bob) * 18 * dt;
    this.sprite.y = Phaser.Math.Clamp(this.sprite.y, 58, 210);
    this.sprite.angle = Math.sin(this.bob * 1.4) * 6 + Phaser.Math.Clamp(this.vx * 0.02, -8, 8);
    this.sprite.setFlipX(this.vx < 0);
    this.sprite.setDepth(16);

    if (this.sprite.x < 60 || this.sprite.x > this.world.width - 60) {
      this.vx *= -1;
      this.sprite.x = Phaser.Math.Clamp(this.sprite.x, 60, this.world.width - 60);
    }

    if (Math.random() < dt * 0.35) {
      this.vx += Phaser.Math.Between(-18, 18);
      this.vx = Phaser.Math.Clamp(this.vx, -86, 86);
      if (Math.abs(this.vx) < 28) this.vx = 36 * Math.sign(this.vx || 1);
    }

    this.wait -= dt * 1000;
    if (this.wait <= 0 && Math.abs(this.sprite.x - playerX) < 520) {
      const landX = this.pickLandX(playerX);
      if (landX != null) this.beginArc("descend", landX, this.world.groundY + 2, 1.35 + Math.random() * 0.7);
    }
  }

  private perch(dt: number, playerX: number) {
    this.sprite.angle = 0;
    this.sprite.setDepth(18);
    this.hopT += dt;
    if (this.hopT > 0.9 + Math.random()) {
      this.hopT = 0;
      if (Math.random() > 0.45) {
        this.scene.tweens.add({
          targets: this.sprite,
          y: this.world.groundY - 7,
          duration: 120,
          yoyo: true,
        });
      } else {
        this.sprite.setFlipX(!this.sprite.flipX);
      }
    }

    this.wait -= dt * 1000;
    const spooked = Math.abs(this.sprite.x - playerX) < 88;
    if (this.wait <= 0 || spooked) {
      const dir = spooked ? Math.sign(this.sprite.x - playerX) || (Math.random() > 0.5 ? 1 : -1) : this.vx >= 0 ? 1 : -1;
      this.vx = dir * Phaser.Math.Between(70, 110);
      this.beginArc(
        "takeoff",
        this.sprite.x + dir * Phaser.Math.Between(160, 280),
        70 + Math.random() * 80,
        0.9 + Math.random() * 0.45
      );
    }
  }

  private glide(dt: number, takingOff: boolean) {
    this.t = Math.min(1, this.t + dt / this.dur);
    const t = this.t;
    const easeX = takingOff ? Phaser.Math.Easing.Cubic.Out(t) : Phaser.Math.Easing.Sine.InOut(t);
    const easeY = takingOff ? Phaser.Math.Easing.Cubic.Out(t) : Phaser.Math.Easing.Quadratic.In(t);
    const arc = Math.sin(t * Math.PI) * (takingOff ? -26 : 22);
    this.sprite.x = Phaser.Math.Linear(this.fromX, this.toX, easeX);
    this.sprite.y = Phaser.Math.Linear(this.fromY, this.toY, easeY) + arc;
    const dy = this.toY - this.fromY;
    this.sprite.angle = Phaser.Math.Clamp(dy * 0.04 + Math.sin(t * 8) * 4, -18, 16);
    this.sprite.setFlipX(this.toX < this.fromX);
    this.sprite.setDepth(takingOff ? 17 : 16);

    if (t >= 1) {
      if (takingOff) {
        this.state = "soar";
        this.wait = 3500 + Math.random() * 5000;
        this.sprite.y = this.toY;
      } else {
        this.state = "landed";
        this.wait = 2200 + Math.random() * 3800;
        this.hopT = 0;
        this.sprite.y = this.world.groundY + 2;
        this.sprite.angle = 0;
        if (this.scene.textures.exists(this.idle)) this.sprite.setTexture(this.idle);
        this.sprite.setDisplaySize(this.size, this.size);
      }
    }
  }

  private beginArc(state: "descend" | "takeoff", x: number, y: number, dur: number) {
    this.state = state;
    this.fromX = this.sprite.x;
    this.fromY = this.sprite.y;
    this.toX = Phaser.Math.Clamp(x, 80, this.world.width - 80);
    this.toY = y;
    this.t = 0;
    this.dur = dur;
  }

  private pickLandX(playerX: number) {
    for (let i = 0; i < 6; i += 1) {
      const x = playerX + Phaser.Math.Between(70, 340) * (Math.random() > 0.35 ? 1 : -1);
      const blocked = this.world.locations.some((loc) => Math.abs(loc.x - x) < loc.width * 0.28);
      if (!blocked && x > 90 && x < this.world.width - 90) return x;
    }
    return null;
  }

  private flap(dt: number) {
    if (this.state === "landed") return;
    const rate = this.state === "takeoff" ? 0.07 : 0.11;
    this.flapT += dt;
    if (this.flapT < rate) return;
    this.flapT = 0;
    this.frame = 1 - this.frame;
    const tex = this.frame === 0 ? this.flyA : this.flyB;
    if (this.scene.textures.exists(tex)) {
      this.sprite.setTexture(tex);
      this.sprite.setDisplaySize(this.size, this.size);
    }
  }
}

export class DoveFlock {
  private doves: Dove[] = [];

  constructor(scene: Phaser.Scene, world: WorldConfig) {
    const fly = textureKey(scene, "pixar-dove-fly-a");
    if (!scene.textures.exists(fly) && !scene.textures.exists(textureKey(scene, "pixar-bird"))) return;
    const start = world.playerStart.x;
    this.doves = [
      new Dove(scene, world, start + 180),
      new Dove(scene, world, start - 90),
      new Dove(scene, world, start + 420),
    ];
  }

  update(delta: number, playerX: number) {
    this.doves.forEach((dove) => dove.update(delta, playerX));
  }
}
