import * as Phaser from "phaser";
import { palette } from "@/data/theme";
import {
  PLAYER_CHARACTERS,
  type PlayerCharacter,
  type PlayerCharacterId,
} from "@/game/player/characters";

type AnimState = "idle" | "run" | "jump";

export class Player extends Phaser.GameObjects.Container {
  private shadow: Phaser.GameObjects.Ellipse;
  private sprite: Phaser.GameObjects.Image;
  /** Outgoing frame drawn over the new one while it fades, for soft frame swaps. */
  private ghost: Phaser.GameObjects.Image;
  private ghostT = 0;
  private idleTime = 0;
  private animState: AnimState = "idle";
  private walkFrame = 0;
  /** 0..1 progress through the current step; a new frame starts at each foot contact. */
  private stepT = 0;
  private baseScale = 1;
  private squash = 0;
  /** Seconds left in the landing crouch (jump pose held while the squash plays). */
  private landHold = 0;
  private lean = 0;
  private readonly groundY: number;
  private vy = 0;
  private onGround = true;
  private jumpHeld = false;
  private baseH: number;
  private readonly CHAR_H = 118;
  private character: PlayerCharacter = PLAYER_CHARACTERS.male;
  facing = 1;
  velocity = 0;
  private readonly maxSpeed = 215;
  private readonly accel = 640;
  private readonly decel = 720;
  private readonly jumpSpeed = 430;
  private readonly gravity = 1480;
  /** Air control while bouncing: top horizontal speed and how fast input changes it. */
  private readonly airMaxSpeed = 300;
  private readonly airAccel = 360;
  interacting = false;
  /** Carried down from the sky on arrival: hold the airborne pose and sway. */
  floating = false;
  /** Set for one frame when the player touches down after being airborne. */
  justLanded = false;
  /** Horizontal speed locked in by a bounce pad until touchdown. */
  private launchVx: number | null = null;
  private spin = 0;
  private floatT = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, characterId: PlayerCharacterId = "male") {
    super(scene, x, y);
    scene.add.existing(this);
    this.setDepth(20);
    this.groundY = y;
    this.character = PLAYER_CHARACTERS[characterId];

    this.shadow = scene.add.ellipse(0, 4, 48, 12, palette.shadow, 0.28);
    this.add(this.shadow);

    this.sprite = scene.add.image(0, 2, this.character.idle);
    this.sprite.setOrigin(0.5, 1);
    const src = this.sprite.texture.getSourceImage() as HTMLImageElement;
    this.baseH = src.height || 1024;
    this.fitSprite();
    this.add(this.sprite);

    this.ghost = scene.add.image(0, 2, this.character.idle).setOrigin(0.5, 1).setVisible(false);
    this.add(this.ghost);

    this.setSize(52, 120);
  }

  setCharacter(id: PlayerCharacterId) {
    this.character = PLAYER_CHARACTERS[id];
    this.walkFrame = 0;
    this.stepT = 0;
    this.sprite.setTexture(this.character.idle);
    this.sprite.setFlipX(this.facing < 0);
    this.ghost.setVisible(false);
    const src = this.sprite.texture.getSourceImage() as HTMLImageElement;
    this.baseH = src.height || 1024;
    this.fitSprite();
  }

  private fitSprite() {
    const src = this.sprite.texture.getSourceImage() as HTMLImageElement;
    this.baseScale = this.CHAR_H / this.baseH;
    this.sprite.setDisplaySize(src.width * this.baseScale, src.height * this.baseScale);
    this.applyOrigin();
  }

  // Frames are trimmed to their own bounds, so their widths differ. Pin every
  // frame on the head's centre (not the image centre) so the body doesn't
  // jitter sideways when the walk frames swap.
  private applyOrigin() {
    const ax = headAnchorX(this.sprite.texture);
    this.sprite.setOrigin(this.facing < 0 ? 1 - ax : ax, 1);
  }

  private show(key: string, blend = 0) {
    const prev = this.sprite.texture.key;
    if (prev === key) return;
    // Only crossfade stride-to-stride; fading a jump or idle pose over a walk
    // pose shows two different bodies at once.
    const walk: readonly string[] = this.character.walk;
    if (blend > 0 && walk.includes(prev) && walk.includes(key)) {
      this.ghost.setTexture(prev).setVisible(true).setAlpha(1);
      this.ghostT = blend;
    } else {
      this.ghost.setVisible(false);
      this.ghostT = 0;
    }
    this.sprite.setTexture(key);
    this.fitSprite();
  }

  /** Keep the fading ghost glued to the sprite's pose. */
  private syncGhost(dt: number, blend: number) {
    if (!this.ghost.visible) return;
    this.ghostT -= dt;
    if (this.ghostT <= 0 || blend <= 0) {
      this.ghost.setVisible(false);
      return;
    }
    const ax = headAnchorX(this.ghost.texture);
    const src = this.ghost.texture.getSourceImage() as HTMLImageElement;
    const k = this.sprite.scaleY / this.baseScale;
    this.ghost
      .setFlipX(this.facing < 0)
      .setOrigin(this.facing < 0 ? 1 - ax : ax, 1)
      .setDisplaySize(src.width * this.baseScale, src.height * this.baseScale)
      .setScale(this.ghost.scaleX * (this.sprite.scaleX / this.baseScale), this.ghost.scaleY * k)
      .setRotation(this.sprite.rotation)
      .setY(this.sprite.y)
      .setAlpha(Phaser.Math.Easing.Sine.InOut(this.ghostT / blend));
  }

  setFacing(dir: number) {
    if (dir === 0) return;
    const next = dir > 0 ? 1 : -1;
    if (next === this.facing) return;
    this.facing = next;
    this.sprite.setFlipX(this.facing < 0);
    this.applyOrigin();
  }

  playInteract() {
    this.interacting = true;
    this.scene.tweens.add({
      targets: this.sprite,
      y: -8,
      duration: 130,
      yoyo: true,
      onComplete: () => {
        this.interacting = false;
      },
    });
  }

  /** Soft landing after the arrival descent: brief crouch + squash. */
  touchDown() {
    this.floating = false;
    this.y = this.groundY;
    this.vy = 0;
    this.onGround = true;
    this.squash = 1;
    this.landHold = 0.14;
  }

  /** Positive while falling. */
  get verticalSpeed() {
    return this.onGround ? 0 : this.vy;
  }

  get isLaunched() {
    return this.launchVx !== null;
  }

  /** Ballistic launch (bounce pad): lands `dx` away after a jump of peak height `height`. */
  launch(dx: number, height: number) {
    const vy = -Math.sqrt(2 * this.gravity * height);
    const flight = (2 * -vy) / this.gravity;
    this.onGround = false;
    this.vy = vy;
    this.launchVx = dx / flight;
    this.velocity = 0;
    this.spin = 0;
    this.setFacing(Math.sign(dx) || this.facing);
    this.animState = "jump";
  }

  cancelLaunch() {
    this.launchVx = null;
    this.spin = 0;
    if (!this.onGround) {
      this.y = this.groundY;
      this.vy = 0;
      this.onGround = true;
    }
  }

  jump() {
    if (!this.onGround || this.interacting) return;
    this.onGround = false;
    this.vy = -this.jumpSpeed;
    this.animState = "jump";
  }

  updateMovement(delta: number, input: number, autoTarget: number | null, wantJump = false) {
    const dt = delta / 1000;
    let desired = input;
    this.justLanded = false;
    if (this.launchVx !== null) {
      // Mid-bounce: height is fixed, but left/right steers the arc (air control).
      // With no input the momentum carries on to the next stop.
      if (input !== 0) {
        const target = input * this.airMaxSpeed;
        const step = this.airAccel * dt;
        this.launchVx += Phaser.Math.Clamp(target - this.launchVx, -step, step);
        this.setFacing(input);
      }
      desired = 0;
      autoTarget = null;
      wantJump = false;
    }

    if (autoTarget !== null) {
      const diff = autoTarget - this.x;
      desired = Math.abs(diff) < 8 ? 0 : Math.sign(diff);
    }

    if (wantJump && !this.jumpHeld) this.jump();
    this.jumpHeld = wantJump;

    if (desired !== 0) {
      this.velocity = Phaser.Math.Linear(
        this.velocity,
        desired * this.maxSpeed,
        Math.min(1, (this.accel * dt) / this.maxSpeed)
      );
      this.setFacing(desired);
      if (this.onGround) this.animState = "run";
    } else {
      const mag = Math.max(Math.abs(this.velocity) - this.decel * dt, 0);
      this.velocity = Math.sign(this.velocity) * mag;
      if (this.onGround) this.animState = Math.abs(this.velocity) > 18 ? "run" : "idle";
    }

    this.x += (this.launchVx ?? this.velocity) * dt;

    if (!this.onGround) {
      this.vy += this.gravity * dt;
      this.y += this.vy * dt;
      if (this.y >= this.groundY) {
        this.y = this.groundY;
        this.vy = 0;
        this.onGround = true;
        this.squash = 1;
        this.landHold = 0.09;
        this.justLanded = true;
        if (this.launchVx !== null) {
          // Carry a little momentum out of the bounce so the landing flows.
          this.velocity = this.launchVx * 0.25;
          this.launchVx = null;
          this.spin = 0;
          this.landHold = 0.16;
        }
        this.animState = Math.abs(this.velocity) > 18 ? "run" : "idle";
      } else {
        this.animState = "jump";
      }
    }

    this.animate(delta);
  }

  private animate(delta: number) {
    const dt = delta / 1000;
    const speed = Phaser.Math.Clamp(Math.abs(this.velocity) / this.maxSpeed, 0, 1);
    let sx = 1;
    let sy = 1;
    let y = 2;
    let leanTarget = 0;

    if (this.landHold > 0) this.landHold -= dt;
    const landing = this.landHold > 0;

    if (this.floating) {
      this.floatT += dt;
      this.show(this.character.jump);
      this.stepT = 0;
      leanTarget = Math.sin(this.floatT * 1.8) * 0.06;
    } else if (landing) {
      // Stay in the bent-knee jump pose for a beat so touchdown reads as a crouch
      // instead of snapping straight to the standing drawing.
      this.show(this.character.jump);
      this.stepT = 0;
    } else if (this.animState === "run") {
      // Four-beat cycle from three drawings: contact A -> passing -> contact B -> passing.
      // The stride frames are the contact poses; the feet-together idle frame
      // doubles as the passing pose. Frames swap at contact (lowest point of the
      // bob) and at passing (highest), where a pose change reads as motion.
      const gait = this.character.gait;
      const stepDuration = Phaser.Math.Linear(gait.step[0], gait.step[1], speed);
      this.stepT += dt / stepDuration;
      if (this.stepT >= 1) {
        this.stepT -= Math.floor(this.stepT);
        this.walkFrame = (this.walkFrame + 1) % this.character.walk.length;
      }
      const passing = gait.passing && this.stepT >= 0.5 && speed > 0.35;
      this.show(passing ? this.character.idle : this.character.walk[this.walkFrame], gait.blend);
      const rise = Math.sin(Math.PI * this.stepT); // 0 at contact, 1 at passing
      y = 2 - rise * Phaser.Math.Linear(gait.bob[0], gait.bob[1], speed);
      // Weight lands on the contact foot: a touch of squash, then stretch on the way up.
      sy = 1 - (1 - rise) * 0.025 * speed + rise * 0.01;
      sx = 1 + (1 - rise) * 0.02 * speed;
      leanTarget = 0.045 * speed + Math.sin(Math.PI * 2 * this.stepT) * 0.01;
      this.idleTime = 0;
    } else if (this.animState === "jump") {
      this.show(this.character.jump);
      // Stretch while rising fast, relax at the apex, slight stretch falling.
      // Stretch only on the way up; falling stays neutral so the landing squash
      // doesn't follow a sudden stretch.
      const v = Phaser.Math.Clamp(this.vy / this.jumpSpeed, -1, 1);
      const up = Math.max(0, -v);
      sy = 1 + up * 0.05;
      sx = 1 - up * 0.03;
      leanTarget = 0.06;
      this.stepT = 0.5;
    } else {
      this.show(this.character.idle);
      this.idleTime += dt;
      this.stepT = 0;
      const breath = Math.sin(this.idleTime * 2.2);
      sy = 1 + breath * 0.008;
      y = 2;
    }

    // Landing squash decays quickly.
    if (this.squash > 0) {
      this.squash = Math.max(0, this.squash - dt / 0.18);
      const k = Math.sin(this.squash * Math.PI * 0.5);
      sy *= 1 - k * 0.06;
      sx *= 1 + k * 0.045;
    }

    if (this.launchVx !== null) {
      // Tilt with the arc: lean back rising, forward falling.
      leanTarget = Phaser.Math.Clamp(this.vy / 2200, -0.25, 0.3) + 0.05;
      this.spin += dt;
    }
    this.lean = Phaser.Math.Linear(this.lean, leanTarget, Math.min(1, dt * 10));
    this.sprite.rotation = this.lean * this.facing;
    this.sprite.y = y;
    this.sprite.setScale(this.baseScale * sx, this.baseScale * sy);
    this.syncGhost(dt, this.character.gait.blend);

    const air = this.onGround && !this.floating ? 0 : Phaser.Math.Clamp((this.groundY - this.y) / 90, 0, 1);
    this.shadow.setScale(1 - air * 0.35, 1 - air * 0.25);
    this.shadow.setAlpha(this.floating ? 0 : 1 - air * 0.4);
  }
}

const anchorCache = new Map<string, number>();

/** Horizontal centre of the head (median x of opaque pixels in the top band), as a 0..1 origin. */
function headAnchorX(texture: Phaser.Textures.Texture) {
  const cached = anchorCache.get(texture.key);
  if (cached !== undefined) return cached;
  let ax = 0.5;
  try {
    const img = texture.getSourceImage() as HTMLImageElement;
    const w = img.width;
    const h = img.height;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (ctx && w > 0 && h > 0) {
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, w, h).data;
      let top = 0;
      outer: for (; top < h; top++) {
        for (let x = 0; x < w; x++) if (data[(top * w + x) * 4 + 3] > 128) break outer;
      }
      // Face band: skip the very top (hair ornaments) and stop above the shoulders.
      const y0 = top + Math.round(h * 0.06);
      const y1 = top + Math.round(h * 0.26);
      const xs: number[] = [];
      for (let yy = y0; yy < Math.min(h, y1); yy += 2) {
        for (let x = 0; x < w; x++) if (data[(yy * w + x) * 4 + 3] > 128) xs.push(x);
      }
      if (xs.length) {
        xs.sort((a, b) => a - b);
        ax = xs[Math.floor(xs.length / 2)] / w;
      }
    }
  } catch {
    /* tainted or unavailable canvas: fall back to centre */
  }
  anchorCache.set(texture.key, ax);
  return ax;
}
