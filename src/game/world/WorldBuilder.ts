import * as Phaser from "phaser";
import type { WorldConfig } from "@/types/wedding";
import {
  createClockTower,
  createCouple,
  createFinale,
  createGalleryWall,
  createGift,
  createHouse,
  createMailbox,
  createMosque,
  createStoryGarden,
  createVenue,
} from "@/game/world/buildings";
import { blob, fairyLights, gfx, hangingLantern } from "@/game/world/paint";
import { scatter, tileMix, tileStrip, textureKey } from "@/game/world/env";
import { palette } from "@/data/theme";
import { qualitySettings, type QualitySettings } from "@/game/quality";

export class WorldBuilder {
  private quality: QualitySettings;

  constructor(
    private scene: Phaser.Scene,
    private world: WorldConfig,
    private reducedMotion: boolean
  ) {
    this.quality = (scene.game.registry.get("quality") as QualitySettings) ?? qualitySettings("medium");
  }

  build() {
    this.createSky();
    this.createDistantGarden();
    this.createFlowerBeds();
    this.createGround();
    this.createPathAccents();
    this.createLocations();
    this.createCanopy();
    this.createHangingLanterns();
    this.createForeground();
  }

  private createSky() {
    const cam = this.scene.cameras.main;
    const w = Math.max(cam.width, 1600);
    const h = Math.max(cam.height, this.world.height);
    const sky = gfx(this.scene);
    sky.fillGradientStyle(0xe8bf88, 0xf0cc96, 0xfff3dc, 0xf7ddb4, 1);
    sky.fillRect(-w, -h, w * 4, h * 3);
    blob(sky, w * 0.35, 180, 900, 260, 0xffebc4, 0.2);
    blob(sky, w * 0.75, 220, 420, 160, 0xf3d2a0, 0.14);
    sky.setScrollFactor(0);
    sky.setDepth(-30);

    if (this.quality.clouds) {
      tileStrip(this.scene, "pixar-garden-clouds", {
        y: 168,
        height: 70,
        worldWidth: this.world.width,
        scroll: this.world.parallax.clouds,
        depth: -24,
        overlap: this.quality.overlap * 0.4,
        start: 40,
        jitterY: 28,
        heightJitter: 18,
        flip: true,
        alpha: 0.55,
      });
    }

    const mist = gfx(this.scene);
    mist.fillStyle(0xfff1d6, 0.18);
    mist.fillEllipse(w * 0.45, this.world.groundY - 200, w * 1.5, 120);
    mist.setScrollFactor(0.1);
    mist.setDepth(-19);
  }

  private createDistantGarden() {
    if (!this.quality.distantGarden) return;
    const { width, groundY, parallax } = this.world;
    const scroll = parallax.mountains * 0.7;

    tileStrip(this.scene, "pixar-treeline", {
      y: groundY - 8,
      height: 248,
      worldWidth: width,
      scroll,
      depth: -18,
      overlap: this.quality.overlap,
      start: -100,
      jitterY: 10,
      heightJitter: 22,
      flip: true,
      alpha: 0.88,
    });

    scatter(this.scene, ["pixar-garden-tree"], {
      y: groundY - 14,
      height: 150,
      worldWidth: width,
      step: Math.round(280 * this.quality.scatterMul),
      scroll: parallax.hills,
      depth: -13,
      jitterX: 36,
      heightJitter: 32,
      flip: true,
      alpha: 0.78,
      tint: 0xf0e6d0,
      start: 20,
    }).forEach((tree, i) => this.sway(tree, 0.14 + (i % 3) * 0.04));

    tileStrip(this.scene, "pixar-leaf-wall", {
      y: groundY - 4,
      height: 70,
      worldWidth: width,
      scroll: parallax.hills,
      depth: -11,
      overlap: this.quality.overlap,
      start: -50,
      jitterY: 6,
      heightJitter: 12,
      flip: true,
      alpha: 0.9,
    }).forEach((wall, i) => this.sway(wall, 0.16 + (i % 3) * 0.04));
  }

  private createFlowerBeds() {
    const { width, groundY } = this.world;

    scatter(this.scene, ["pixar-garden-tree"], {
      y: groundY - 2,
      height: 168,
      worldWidth: width,
      step: Math.round(280 * this.quality.scatterMul),
      scroll: 1,
      depth: 3,
      jitterX: 50,
      heightJitter: 36,
      flip: true,
      start: 180,
    }).forEach((tree, i) => {
      if (this.world.locations.some((loc) => Math.abs(loc.x - tree.x) < 150)) {
        tree.setVisible(false);
      }
      this.sway(tree, 0.28 + (i % 2) * 0.06);
    });

    tileStrip(this.scene, "pixar-leaf-wall", {
      y: groundY,
      height: 72,
      worldWidth: width,
      scroll: 1,
      depth: 4,
      overlap: this.quality.overlap,
      start: -40,
      jitterY: 6,
      heightJitter: 18,
      flip: true,
    }).forEach((wall, i) => this.sway(wall, 0.22 + (i % 2) * 0.05));

    if (!this.quality.flowerScatter) return;

    scatter(this.scene, ["pixar-leaf-shrub", "pixar-bush"], {
      y: groundY + 2,
      height: 54,
      worldWidth: width,
      step: Math.round(200 * this.quality.scatterMul),
      scroll: 1,
      depth: 5,
      jitterX: 36,
      heightJitter: 20,
      flip: true,
      start: 70,
    }).forEach((shrub, i) => {
      if (this.world.locations.some((loc) => Math.abs(loc.x - shrub.x) < 90)) {
        shrub.setVisible(false);
      }
      this.sway(shrub, 0.35 + (i % 3) * 0.08);
    });

    scatter(this.scene, ["pixar-mixed-cluster", "pixar-white-roses"], {
      y: groundY + 2,
      height: 48,
      worldWidth: width,
      step: Math.round(260 * this.quality.scatterMul),
      scroll: 1,
      depth: 5,
      jitterX: 40,
      heightJitter: 16,
      flip: true,
      start: 120,
    }).forEach((cluster, i) => {
      if (this.world.locations.some((loc) => Math.abs(loc.x - cluster.x) < 100)) {
        cluster.setVisible(false);
      }
      this.sway(cluster, 0.42 + (i % 3) * 0.08);
    });

    scatter(this.scene, ["pixar-tall-blooms"], {
      y: groundY - 2,
      height: 88,
      worldWidth: width,
      step: Math.round(380 * this.quality.scatterMul),
      scroll: 1,
      depth: 5,
      jitterX: 48,
      heightJitter: 24,
      flip: true,
      start: 240,
    }).forEach((tall, i) => {
      if (this.world.locations.some((loc) => Math.abs(loc.x - tall.x) < 110)) {
        tall.setVisible(false);
      }
      this.sway(tall, 0.5 + (i % 2) * 0.1);
    });
  }

  private createGround() {
    const { width, height, groundY } = this.world;

    const floor = gfx(this.scene);
    floor.setDepth(1);
    floor.fillStyle(0xc4b093, 1);
    floor.fillRect(-280, groundY + 36, width + 560, height - groundY + 80);
    blob(floor, width / 2, groundY + 52, width + 200, 34, 0xb7a488, 0.45);

    const path = gfx(this.scene);
    path.setDepth(7);
    path.fillStyle(0xc4b093, 1);
    path.fillRoundedRect(-280, groundY - 4, width + 560, 46, 8);
    path.fillStyle(0xb59a78, 0.35);
    path.fillRect(-280, groundY + 38, width + 560, 10);
    path.fillStyle(0xe7d9c2, 0.55);
    path.fillRect(-280, groundY + 2, width + 560, 14);

    const stoneStep = this.quality.groundDetail ? 26 : 52;
    for (let x = -30; x < width + 40; x += stoneStep) {
      const ox = x + ((x * 17) % 8) - 4;
      const stoneW = 22 + (x % 11);
      blob(path, ox, groundY + 16, stoneW, 11, 0xb39a7c, 0.38);
      blob(path, ox + 9, groundY + 22, 14, 7, 0xd8c7ad, 0.32);
      blob(path, ox - 6, groundY + 8, 10, 5, 0xeee3d2, 0.22);
      if (x % 52 === 0) blob(path, ox + 5, groundY + 12, 7, 3.5, 0xfff6ee, 0.45);
      if (x % 78 === 0) blob(path, ox + 14, groundY + 26, 6, 3, 0xf2c4c8, 0.28);
    }
  }

  private createPathAccents() {
    const { groundY } = this.world;
    const lanternKey = textureKey(this.scene, "pixar-garden-lantern");
    const archKey = textureKey(this.scene, "pixar-rose-arch");

    if (this.quality.lanterns) {
      this.world.locations.forEach((loc, i) => {
        const next = this.world.locations[i + 1];
        if (!next || !this.scene.textures.exists(lanternKey)) return;
        const x = loc.x + (next.x - loc.x) * (i % 2 === 0 ? 0.4 : 0.6);
        const lamp = this.scene.add.image(x, groundY + 6, lanternKey);
        lamp.setOrigin(0.5, 1);
        lamp.setDisplaySize(34, 86);
        lamp.setDepth(9);
        if (!this.reducedMotion && this.quality.sway) {
          this.scene.tweens.add({
            targets: lamp,
            alpha: { from: 0.86, to: 1 },
            duration: 1500 + Math.random() * 400,
            yoyo: true,
            repeat: -1,
          });
        }
      });
    }

    this.world.locations.forEach((loc, i) => {
      if (!this.quality.arches) return;
      if (i % 3 !== 1) return;
      const next = this.world.locations[i + 1];
      if (!next || !this.scene.textures.exists(archKey)) return;
      const x = (loc.x + next.x) / 2;
      if (this.world.locations.some((other) => Math.abs(other.x - x) < 150)) return;
      const arch = this.scene.add.image(x, groundY - 2, archKey);
      arch.setOrigin(0.5, 1);
      arch.setDisplaySize(132, 184);
      arch.setDepth(5);
      this.sway(arch, 0.22);
    });
  }

  private createLocations() {
    const { groundY } = this.world;
    const builders: Record<
      string,
      (s: Phaser.Scene, x: number, y: number) => Phaser.GameObjects.Container
    > = {
      home: createHouse,
      couple: createCouple,
      story: createStoryGarden,
      akad: createMosque,
      reception: createVenue,
      countdown: createClockTower,
      gallery: createGalleryWall,
      rsvp: createMailbox,
      gift: createGift,
      thanks: createFinale,
    };

    this.world.locations.forEach((loc) => {
      const builder = builders[loc.id];
      if (!builder) return;
      builder(this.scene, loc.x, groundY).setDepth(10);

      if (
        this.quality.fairyLights &&
        (loc.id === "home" || loc.id === "reception" || loc.id === "story")
      ) {
        const lights = fairyLights(this.scene, loc.x, groundY - 204, 230, this.reducedMotion);
        lights.setDepth(11);
        lights.setAlpha(0.75);
      }
    });
  }

  private createCanopy() {
    if (!this.quality.canopy) return;
    const { width, parallax } = this.world;
    const scroll = Math.min(1.08, parallax.foreground);

    tileStrip(this.scene, "pixar-hang-vines", {
      y: -8,
      originY: 0,
      height: 230,
      worldWidth: width,
      scroll,
      depth: 37,
      overlap: this.quality.overlap,
      start: -70,
      jitterY: 12,
      heightJitter: 28,
      flip: true,
      alpha: 0.92,
    }).forEach((vine, i) => this.sway(vine, 0.22 + (i % 2) * 0.06));

    tileStrip(this.scene, "pixar-blossom-canopy", {
      y: -16,
      originY: 0,
      height: 150,
      worldWidth: width,
      scroll,
      depth: 38,
      overlap: this.quality.overlap,
      start: 80,
      jitterY: 16,
      heightJitter: 18,
      flip: true,
      alpha: 0.82,
    }).forEach((branch, i) => this.sway(branch, 0.24 + (i % 2) * 0.07));
  }

  private createHangingLanterns() {
    if (!this.quality.lanterns) return;
    this.world.locations.forEach((loc, i) => {
      const next = this.world.locations[i + 1];
      if (!next) return;
      const gap = next.x - loc.x;
      const cluster = [
        { t: 0.34, y: 108, s: 1.05 },
        { t: 0.52, y: 148, s: 0.78 },
        { t: 0.68, y: 118, s: 0.62 },
      ];
      cluster.forEach((item, n) => {
        if (n === 2 && gap < 420) return;
        const lamp = hangingLantern(
          this.scene,
          loc.x + gap * item.t,
          item.y,
          item.s,
          this.reducedMotion
        );
        lamp.setDepth(14);
        lamp.setScrollFactor(1);
      });
    });

    [
      { id: "couple", dx: -78, y: 96, s: 0.7 },
      { id: "story", dx: 86, y: 102, s: 0.66 },
      { id: "thanks", dx: -70, y: 92, s: 0.8 },
    ].forEach((spot) => {
      const loc = this.world.locations.find((item) => item.id === spot.id);
      if (!loc) return;
      const lamp = hangingLantern(this.scene, loc.x + spot.dx, spot.y, spot.s, this.reducedMotion);
      lamp.setDepth(14);
      lamp.setScrollFactor(1);
    });
  }

  private createForeground() {
    const { width, height, groundY, parallax } = this.world;
    const scroll = parallax.player;
    const pathBottom = groundY + 40;
    const bedH = Math.max(92, height - pathBottom);

    tileStrip(this.scene, "pixar-leaf-wall", {
      y: height,
      height: bedH,
      worldWidth: width,
      scroll,
      depth: 40,
      overlap: this.quality.overlap + 0.08,
      start: -70,
      jitterY: 6,
      heightJitter: 10,
      flip: true,
    }).forEach((wall, i) => this.sway(wall, 0.1 + (i % 3) * 0.03));

    if (!this.quality.foregroundMix) return;

    tileMix(this.scene, ["pixar-mixed-cluster", "pixar-white-roses", "pixar-low-blooms", "pixar-leaf-shrub"], {
      y: height - 2,
      height: bedH - 16,
      worldWidth: width,
      scroll,
      depth: 41,
      overlap: this.quality.overlap,
      start: -20,
      jitterY: 8,
      heightJitter: 12,
      flip: true,
    }).forEach((cluster, i) => this.sway(cluster, 0.16 + (i % 3) * 0.04));
  }

  private sway(target: Phaser.GameObjects.GameObject, amount: number) {
    if (this.reducedMotion || !this.quality.sway) return;
    this.scene.tweens.add({
      targets: target,
      angle: { from: -amount, to: amount },
      duration: 2800 + Math.random() * 900,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }
}
