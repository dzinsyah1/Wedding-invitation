import * as Phaser from "phaser";
import type { WorldConfig } from "@/types/wedding";
import { textureKey } from "@/game/world/env";

export class AmbientSystem {
  private birdTimer = 0;
  private leafTimer = 0;
  private fireflies: Phaser.GameObjects.Arc[] = [];

  constructor(
    private scene: Phaser.Scene,
    private world: WorldConfig,
    private reducedMotion: boolean
  ) {
    if (reducedMotion) return;
    this.spawnButterflies();
    this.createPetals();
  }

  update(delta: number, playerX: number) {
    if (this.reducedMotion) return;
    this.birdTimer += delta;
    this.leafTimer += delta;
    if (this.birdTimer > 7000 + Math.random() * 4000) {
      this.spawnBird(playerX);
      this.birdTimer = 0;
    }
    if (this.leafTimer > 5000) {
      this.spawnLeaf(playerX);
      this.leafTimer = 0;
    }
    this.updateFireflies(playerX);
  }

  private spawnBird(playerX: number) {
    const key = textureKey(this.scene, "pixar-bird");
    if (!this.scene.textures.exists(key)) return;
    const fromLeft = Math.random() > 0.5;
    const y = 70 + Math.random() * 90;
    const bird = this.scene.add.image(fromLeft ? playerX - 460 : playerX + 460, y, key);
    bird.setDisplaySize(54, 54);
    bird.setFlipX(!fromLeft);
    bird.setDepth(-11);
    this.scene.tweens.add({
      targets: bird,
      x: fromLeft ? playerX + 560 : playerX - 560,
      y: y + 18,
      angle: { from: -8, to: 8 },
      duration: 7200,
      onComplete: () => bird.destroy(),
    });
  }

  private spawnButterflies() {
    const key = textureKey(this.scene, "pixar-butterfly");
    if (!this.scene.textures.exists(key)) return;
    const spots = this.world.locations.filter((loc) => loc.id === "story" || loc.id === "couple" || loc.id === "home");
    spots.forEach((spot, s) => {
      for (let i = 0; i < 2; i += 1) {
        const bug = this.scene.add.image(spot.x - 20 + i * 28, this.world.groundY - 90, key);
        bug.setDisplaySize(28, 28);
        bug.setDepth(12);
        this.scene.tweens.add({
          targets: bug,
          x: spot.x + 36 + i * 18 + s * 8,
          y: this.world.groundY - 128 - i * 10,
          angle: { from: -20, to: 20 },
          duration: 2000 + i * 350,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });
      }
    });
  }

  private createPetals() {
    if (!this.scene.textures.exists("petal")) return;
    const emitter = this.scene.add.particles(0, 40, "petal", {
      x: { min: 0, max: this.world.width },
      lifespan: 9000,
      speedY: { min: 16, max: 34 },
      speedX: { min: -18, max: 8 },
      scale: { start: 0.6, end: 0.2 },
      rotate: { min: 0, max: 360 },
      frequency: 900,
      quantity: 1,
      alpha: { start: 0.7, end: 0.1 },
    });
    emitter.setDepth(15);
    emitter.setScrollFactor(0.85);
  }

  private spawnLeaf(playerX: number) {
    const leaf = this.scene.add.ellipse(playerX + Math.random() * 200 - 100, 40, 8, 4, 0x6f945c, 0.8);
    leaf.setDepth(14);
    this.scene.tweens.add({
      targets: leaf,
      y: this.world.groundY - 10,
      x: leaf.x + 80,
      angle: 180,
      duration: 6000,
      onComplete: () => leaf.destroy(),
    });
  }

  private updateFireflies(playerX: number) {
    const finale = this.world.locations.find((loc) => loc.id === "thanks");
    if (!finale || Math.abs(playerX - finale.x) > 700) return;
    if (this.fireflies.length === 0) {
      for (let i = 0; i < 8; i += 1) {
        const fly = this.scene.add.circle(
          finale.x + Math.random() * 180 - 90,
          this.world.groundY - 40 - Math.random() * 160,
          2.4,
          0xf6e3a1,
          0.9
        );
        fly.setDepth(16);
        this.fireflies.push(fly);
        this.scene.tweens.add({
          targets: fly,
          alpha: { from: 0.2, to: 1 },
          y: fly.y - 16,
          duration: 1400 + i * 120,
          yoyo: true,
          repeat: -1,
        });
      }
    }
  }
}
