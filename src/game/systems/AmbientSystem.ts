import * as Phaser from "phaser";
import type { WorldConfig } from "@/types/wedding";
import { textureKey } from "@/game/world/env";
import { DoveFlock } from "@/game/systems/doves";
import { qualitySettings, type QualitySettings } from "@/game/quality";

export class AmbientSystem {
  private birdTimer = 0;
  private petalBurstTimer = 0;
  private fireflies: Phaser.GameObjects.Arc[] = [];
  private pathFairies: Phaser.GameObjects.Arc[] = [];
  private doves: DoveFlock | null = null;
  private quality: QualitySettings;

  constructor(
    private scene: Phaser.Scene,
    private world: WorldConfig,
    private reducedMotion: boolean
  ) {
    this.quality = (scene.game.registry.get("quality") as QualitySettings) ?? qualitySettings("medium");
    if (reducedMotion) return;
    if (this.quality.butterflies) this.spawnButterflies();
    if (this.quality.petals) this.createPetals();
    if (this.quality.tier === "high") this.createPathFairyMotes();
    if (this.quality.doves) this.doves = new DoveFlock(scene, world);
  }

  update(delta: number, playerX: number) {
    if (this.reducedMotion) return;
    if (this.quality.birds) {
      this.birdTimer += delta;
      if (this.birdTimer > 8000 + Math.random() * 5000) {
        this.spawnBird(playerX);
        this.birdTimer = 0;
      }
    }
    if (this.quality.petals) {
      this.petalBurstTimer += delta;
      if (this.petalBurstTimer > 2800) {
        this.spawnPetalBurst(playerX);
        this.petalBurstTimer = 0;
      }
    }
    if (this.quality.tier === "high") this.updateFireflies(playerX);
    this.doves?.update(delta, playerX);
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
    const spots = this.world.locations.filter(
      (loc) => loc.id === "story" || loc.id === "couple" || loc.id === "home" || loc.id === "reception"
    );
    spots.forEach((spot, s) => {
      const count = this.quality.tier === "high" ? 3 : 1;
      for (let i = 0; i < count; i += 1) {
        const bug = this.scene.add.image(spot.x - 24 + i * 22, this.world.groundY - 90, key);
        bug.setDisplaySize(26, 26);
        bug.setDepth(12);
        this.scene.tweens.add({
          targets: bug,
          x: spot.x + 40 + i * 16 + s * 8,
          y: this.world.groundY - 130 - i * 12,
          angle: { from: -22, to: 22 },
          duration: 1800 + i * 320,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });
      }
    });
  }

  private createPetals() {
    if (!this.scene.textures.exists("petal")) return;
    const emitter = this.scene.add.particles(0, 20, "petal", {
      x: { min: 0, max: this.world.width },
      lifespan: 10000,
      speedY: { min: 12, max: 32 },
      speedX: { min: -22, max: 10 },
      scale: { start: 0.75, end: 0.2 },
      rotate: { min: 0, max: 360 },
      frequency: this.quality.tier === "high" ? 420 : 900,
      quantity: 1,
      alpha: { start: 0.85, end: 0.05 },
    });
    emitter.setDepth(15);
    emitter.setScrollFactor(0.85);
  }

  private spawnPetalBurst(playerX: number) {
    if (!this.scene.textures.exists("petal")) return;
    for (let i = 0; i < (this.quality.tier === "high" ? 4 : 2); i += 1) {
      const petal = this.scene.add.image(
        playerX + Math.random() * 160 - 40,
        30 + Math.random() * 40,
        "petal"
      );
      petal.setDepth(14);
      petal.setScale(0.7 + Math.random() * 0.5);
      petal.setAlpha(0.9);
      this.scene.tweens.add({
        targets: petal,
        y: this.world.groundY + 4,
        x: petal.x + 40 + Math.random() * 80,
        angle: 220,
        alpha: 0.1,
        duration: 4800 + Math.random() * 1200,
        onComplete: () => petal.destroy(),
      });
    }
  }

  private createPathFairyMotes() {
    for (let x = 200; x < this.world.width; x += 220) {
      if (this.world.locations.some((loc) => Math.abs(loc.x - x) < 60)) continue;
      const mote = this.scene.add.circle(
        x,
        this.world.groundY - 50 - Math.random() * 100,
        1.8 + Math.random(),
        0xfff2b8,
        0.75
      );
      mote.setDepth(13);
      this.pathFairies.push(mote);
      this.scene.tweens.add({
        targets: mote,
        alpha: { from: 0.15, to: 0.95 },
        y: mote.y - 12,
        duration: 1600 + Math.random() * 1200,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }
  }

  private updateFireflies(playerX: number) {
    const finale = this.world.locations.find((loc) => loc.id === "thanks");
    if (!finale || Math.abs(playerX - finale.x) > 700) return;
    if (this.fireflies.length === 0) {
      for (let i = 0; i < 12; i += 1) {
        const fly = this.scene.add.circle(
          finale.x + Math.random() * 200 - 100,
          this.world.groundY - 40 - Math.random() * 180,
          2.2,
          0xfff2b8,
          0.9
        );
        fly.setDepth(16);
        this.fireflies.push(fly);
        this.scene.tweens.add({
          targets: fly,
          alpha: { from: 0.2, to: 1 },
          y: fly.y - 18,
          duration: 1200 + i * 100,
          yoyo: true,
          repeat: -1,
        });
      }
    }
  }
}
