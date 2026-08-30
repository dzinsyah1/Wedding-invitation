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
  private idleTime = 0;
  private animState: AnimState = "idle";
  private walkFrame = 0;
  private walkTimer = 0;
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
  interacting = false;

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

    this.setSize(52, 120);
  }

  setCharacter(id: PlayerCharacterId) {
    this.character = PLAYER_CHARACTERS[id];
    this.walkFrame = 0;
    this.walkTimer = 0;
    this.sprite.setTexture(this.character.idle);
    this.sprite.setFlipX(this.facing < 0);
    const src = this.sprite.texture.getSourceImage() as HTMLImageElement;
    this.baseH = src.height || 1024;
    this.fitSprite();
  }

  private fitSprite() {
    const src = this.sprite.texture.getSourceImage() as HTMLImageElement;
    const scale = this.CHAR_H / this.baseH;
    this.sprite.setDisplaySize(src.width * scale, src.height * scale);
  }

  private show(key: string) {
    if (this.sprite.texture.key !== key) {
      this.sprite.setTexture(key);
      this.fitSprite();
    }
  }

  setFacing(dir: number) {
    if (dir === 0) return;
    this.facing = dir > 0 ? 1 : -1;
    this.sprite.setFlipX(this.facing < 0);
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

  jump() {
    if (!this.onGround || this.interacting) return;
    this.onGround = false;
    this.vy = -this.jumpSpeed;
    this.animState = "jump";
  }

  updateMovement(delta: number, input: number, autoTarget: number | null, wantJump = false) {
    const dt = delta / 1000;
    let desired = input;

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

    this.x += this.velocity * dt;

    if (!this.onGround) {
      this.vy += this.gravity * dt;
      this.y += this.vy * dt;
      if (this.y >= this.groundY) {
        this.y = this.groundY;
        this.vy = 0;
        this.onGround = true;
        this.animState = Math.abs(this.velocity) > 18 ? "run" : "idle";
      } else {
        this.animState = "jump";
      }
    }

    this.animate(delta);
  }

  private animate(delta: number) {
    const dt = delta / 1000;

    if (this.animState === "run") {
      this.idleTime += dt;
      this.walkTimer += dt;
      const speed = Phaser.Math.Clamp(Math.abs(this.velocity) / this.maxSpeed, 0.35, 1);
      const frameInterval = Phaser.Math.Linear(0.28, 0.18, speed);
      if (this.walkTimer >= frameInterval) {
        this.walkTimer -= frameInterval;
        this.walkFrame = (this.walkFrame + 1) % this.character.walk.length;
      }
      this.show(this.character.walk[this.walkFrame]);
      this.sprite.y = 2 + Math.sin(this.idleTime * Phaser.Math.PI2 * 4) * 1.5;
      this.shadow.setScale(1, 1);
    } else if (this.animState === "jump") {
      this.show(this.character.jump);
      this.sprite.y = 2;
      this.shadow.setScale(0.7, 0.82);
    } else {
      this.show(this.character.idle);
      this.idleTime += dt;
      this.sprite.y = 2 + Math.sin(this.idleTime * 1.5) * 1.4;
      this.shadow.setScale(1, 1);
    }
  }
}
