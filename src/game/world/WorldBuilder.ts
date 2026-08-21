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
  createTree,
  createVenue,
} from "@/game/world/buildings";
import { blob, gfx, makeSunTexture } from "@/game/world/paint";
import { scatter, sprinkle, textureKey } from "@/game/world/env";

export class WorldBuilder {
  constructor(
    private scene: Phaser.Scene,
    private world: WorldConfig,
    private reducedMotion: boolean
  ) {}

  build() {
    this.createSky();
    this.createSun();
    this.createClouds();
    this.createMountains();
    this.createHills();
    this.createGround();
    this.createDecor();
    this.createLocations();
    this.createForeground();
  }

  private createSky() {
    const cam = this.scene.cameras.main;
    const sky = gfx(this.scene);
    const w = Math.max(cam.width, 1600);
    const h = Math.max(cam.height, this.world.height);
    sky.fillGradientStyle(0x3aa0d8, 0x3aa0d8, 0xc8eefc, 0x86d2f0, 1);
    sky.fillRect(-w, -h, w * 4, h * 3);
    blob(sky, 188, 140, 420, 170, 0xffe7b0, 0.18);
    sky.setScrollFactor(0);
    sky.setDepth(-30);
  }

  private createSun() {
    const key = makeSunTexture(this.scene);
    const sun = this.scene.add.image(188, 126, key);
    sun.setDisplaySize(268, 268);
    sun.setScrollFactor(0.04);
    sun.setDepth(-28);
    sun.setAlpha(0.96);
  }

  private createClouds() {
    const { width, parallax } = this.world;
    scatter(this.scene, ["pixar-cloud"], {
      y: 96,
      height: 72,
      worldWidth: width,
      step: 420,
      scroll: parallax.clouds,
      depth: -22,
      jitterX: 80,
      jitterY: 28,
      heightJitter: 36,
      flip: true,
      start: 40,
    });
  }

  private createMountains() {
    const { width, groundY, parallax } = this.world;
    const scroll = parallax.mountains * 0.55;
    const land = gfx(this.scene);
    land.setScrollFactor(scroll);
    land.setDepth(-19);
    blob(land, width / 2, groundY - 36, width + 700, 70, 0x8ec86a, 1);
    blob(land, width / 2, groundY - 18, width + 700, 48, 0x9ad46e, 0.7);

    scatter(this.scene, ["pixar-grove", "pixar-coconut"], {
      y: groundY - 30,
      height: 118,
      worldWidth: width,
      step: 200,
      scroll,
      depth: -18,
      jitterX: 22,
      heightJitter: 20,
      flip: true,
      alpha: 0.92,
      start: -60,
    });

    scatter(this.scene, ["pixar-wildflowers", "pixar-flowers", "pixar-fg-flowers"], {
      y: groundY - 36,
      height: 38,
      worldWidth: width,
      step: 88,
      scroll,
      depth: -18,
      jitterX: 22,
      jitterY: 6,
      heightJitter: 12,
      flip: true,
      alpha: 0.92,
      start: 10,
    });

    scatter(this.scene, ["pixar-flower-grove", "pixar-fg-flowers"], {
      y: groundY - 34,
      height: 58,
      worldWidth: width,
      step: 150,
      scroll,
      depth: -18,
      jitterX: 20,
      heightJitter: 14,
      flip: true,
      alpha: 0.9,
      start: 70,
    });

    scatter(this.scene, ["pixar-sawah-flat"], {
      y: groundY - 28,
      height: 72,
      worldWidth: width,
      step: 300,
      scroll,
      depth: -17,
      jitterX: 16,
      heightJitter: 8,
      flip: true,
      alpha: 0.9,
      start: -80,
    });

    const haze = gfx(this.scene);
    haze.setScrollFactor(scroll);
    haze.setDepth(-16);
    blob(haze, width / 2, groundY - 78, width + 500, 36, 0xc8e8f8, 0.16);
  }

  private createHills() {
    const { width, groundY, parallax } = this.world;
    const land = gfx(this.scene);
    land.setScrollFactor(parallax.hills);
    land.setDepth(-10);
    blob(land, width / 2, groundY + 18, width + 600, 86, 0x62a848, 1);
    blob(land, width / 2, groundY - 6, width + 500, 36, 0x74b858, 0.9);

    scatter(this.scene, ["pixar-grove", "pixar-coconut"], {
      y: groundY + 2,
      height: 108,
      worldWidth: width,
      step: 620,
      scroll: parallax.hills,
      depth: -9,
      jitterX: 24,
      heightJitter: 16,
      flip: true,
      start: -50,
    });

    scatter(this.scene, ["pixar-sawah-flat"], {
      y: groundY + 8,
      height: 78,
      worldWidth: width,
      step: 260,
      scroll: parallax.hills,
      depth: -8,
      jitterX: 20,
      heightJitter: 10,
      flip: true,
      start: -60,
    });

    scatter(this.scene, ["pixar-river"], {
      y: groundY + 2,
      height: 44,
      worldWidth: width,
      step: 560,
      scroll: parallax.hills,
      depth: -8,
      jitterX: 36,
      heightJitter: 6,
      flip: true,
      start: 200,
    });

    scatter(this.scene, ["pixar-rumah", "pixar-rumah-kelapa"], {
      y: groundY + 2,
      height: 96,
      worldWidth: width,
      step: 480,
      scroll: parallax.hills,
      depth: -8,
      jitterX: 50,
      heightJitter: 14,
      flip: true,
      start: 40,
    }).forEach((house) => {
      if (this.world.locations.some((loc) => Math.abs(loc.x - house.x) < 160)) {
        house.setVisible(false);
      }
    });

    scatter(this.scene, ["pixar-coconut"], {
      y: groundY + 4,
      height: 128,
      worldWidth: width,
      step: 780,
      scroll: parallax.hills,
      depth: -8,
      jitterX: 44,
      heightJitter: 20,
      flip: true,
      start: 220,
    }).forEach((tree) => this.sway(tree, 0.4));

    scatter(this.scene, ["pixar-wildflowers"], {
      y: groundY + 4,
      height: 24,
      worldWidth: width,
      step: 560,
      scroll: parallax.hills,
      depth: -7,
      jitterX: 48,
      heightJitter: 6,
      flip: true,
      start: 220,
    }).forEach((flowers, i) => this.sway(flowers, 0.8 + (i % 3) * 0.12));

    this.placeWildlife();
  }

  private placeWildlife() {
    const { width, groundY, parallax } = this.world;
    const a = textureKey(this.scene, "pixar-kerbau-a");
    const b = textureKey(this.scene, "pixar-kerbau-b");
    const duckKey = textureKey(this.scene, "pixar-itik");

    const spots = [320, 700, 1180, 1580, 1980, 2380, 2780, 3180].filter((x) => x < width - 80);
    spots.forEach((x, i) => {
      if (this.world.locations.some((loc) => Math.abs(loc.x - x) < 160)) return;
      if (!this.scene.textures.exists(a)) return;
      const kerbau = this.scene.add.image(x, groundY - 6, a);
      kerbau.setOrigin(0.5, 1);
      kerbau.setDisplaySize(118, 62);
      kerbau.setScrollFactor(parallax.hills);
      kerbau.setDepth(-7);
      this.animateKerbau(kerbau, a, this.scene.textures.exists(b) ? b : a, x - 70, x + 90, i);
    });

    [420, 920, 1420, 1920, 2420, 2920].forEach((x, i) => {
      if (!this.scene.textures.exists(duckKey) || x > width) return;
      if (this.world.locations.some((loc) => Math.abs(loc.x - x) < 120)) return;
      const ducks = this.scene.add.image(x, groundY + 2, duckKey);
      ducks.setOrigin(0.5, 1);
      ducks.setDisplaySize(48, 36);
      ducks.setScrollFactor(parallax.hills);
      ducks.setDepth(-7);
      if (i % 2) ducks.setFlipX(true);
      if (this.reducedMotion) return;
      this.scene.tweens.add({
        targets: ducks,
        x: x + 28,
        duration: 3200 + i * 400,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
        onYoyo: () => ducks.setFlipX(!ducks.flipX),
        onRepeat: () => ducks.setFlipX(!ducks.flipX),
      });
    });

    const ayamKey = textureKey(this.scene, "pixar-ayam");
    const goatKey = textureKey(this.scene, "pixar-kambing");

    [260, 860, 1340, 1860, 2540, 3100].forEach((x, i) => {
      if (!this.scene.textures.exists(ayamKey) || x > width) return;
      if (this.world.locations.some((loc) => Math.abs(loc.x - x) < 100)) return;
      const ayam = this.scene.add.image(x, groundY + 4, ayamKey);
      ayam.setOrigin(0.5, 1);
      ayam.setDisplaySize(46, 38);
      ayam.setScrollFactor(1);
      ayam.setDepth(5);
      if (i % 2) ayam.setFlipX(true);
      if (this.reducedMotion) return;
      this.scene.tweens.add({
        targets: ayam,
        y: groundY + 2,
        duration: 280 + (i % 3) * 40,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
      this.scene.tweens.add({
        targets: ayam,
        x: x + 22,
        duration: 4200 + i * 250,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
        onYoyo: () => ayam.setFlipX(!ayam.flipX),
        onRepeat: () => ayam.setFlipX(!ayam.flipX),
      });
    });

    [640, 1240, 2040, 2680].forEach((x, i) => {
      if (!this.scene.textures.exists(goatKey) || x > width) return;
      if (this.world.locations.some((loc) => Math.abs(loc.x - x) < 130)) return;
      const goat = this.scene.add.image(x, groundY + 2, goatKey);
      goat.setOrigin(0.5, 1);
      goat.setDisplaySize(52, 46);
      goat.setScrollFactor(parallax.hills);
      goat.setDepth(-7);
      if (i % 2) goat.setFlipX(true);
      if (this.reducedMotion) return;
      this.scene.tweens.add({
        targets: goat,
        x: x + 36,
        duration: 6400 + i * 500,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
        onYoyo: () => goat.setFlipX(!goat.flipX),
        onRepeat: () => goat.setFlipX(!goat.flipX),
      });
    });
  }

  private animateKerbau(
    img: Phaser.GameObjects.Image,
    frameA: string,
    frameB: string,
    from: number,
    to: number,
    delay: number
  ) {
    if (this.reducedMotion) return;
    let step = 0;
    const w = img.displayWidth;
    const h = img.displayHeight;
    this.scene.time.addEvent({
      delay: 240,
      loop: true,
      callback: () => {
        if (!img.active) return;
        step = 1 - step;
        img.setTexture(step ? frameB : frameA);
        img.setDisplaySize(w, h);
      },
    });
    img.setX(from);
    this.scene.tweens.add({
      targets: img,
      x: to,
      duration: 11000 + delay * 800,
      yoyo: true,
      repeat: -1,
      ease: "Linear",
      delay: delay * 400,
      onYoyo: () => img.setFlipX(true),
      onRepeat: () => img.setFlipX(false),
    });
  }

  private createGround() {
    const { width, height, groundY } = this.world;
    const soil = gfx(this.scene);
    soil.setDepth(1);
    soil.fillStyle(0x4e8f38, 1);
    soil.fillRect(-240, groundY + 8, width + 480, height - groundY);
    blob(soil, width / 2, groundY + 18, width + 200, 42, 0x5ea644, 1);

    scatter(this.scene, ["pixar-grass-bank"], {
      y: groundY + 46,
      height: 72,
      worldWidth: width,
      step: 150,
      scroll: 1,
      depth: 1,
      jitterX: 18,
      heightJitter: 10,
      flip: true,
      start: -40,
    });

    const path = gfx(this.scene);
    path.setDepth(2);
    path.fillStyle(0xe6d0a4, 0.96);
    path.fillRect(-240, groundY + 6, width + 480, 28);
    path.fillStyle(0xf4e4c0, 0.45);
    path.fillRect(-240, groundY + 12, width + 480, 12);
    for (let x = 0; x < width; x += 36) {
      blob(path, x, groundY + 20, 26, 8, 0xd4bc8c, 0.2);
      blob(path, x + 14, groundY + 24, 10, 4, 0xc4a878, 0.16);
    }

    scatter(this.scene, ["pixar-grass-bank"], {
      y: groundY + 12,
      height: 24,
      worldWidth: width,
      step: 220,
      scroll: 1,
      depth: 3,
      jitterX: 24,
      heightJitter: 6,
      flip: true,
      start: 10,
    });

    scatter(this.scene, ["pixar-grass"], {
      y: groundY + 9,
      height: 22,
      worldWidth: width,
      step: 240,
      scroll: 1,
      depth: 3,
      jitterX: 28,
      jitterY: 3,
      heightJitter: 6,
      flip: true,
      start: 32,
    }).forEach((tuft, i) => {
      if (i % 2 === 0) this.sway(tuft, 1.1);
    });
  }

  private createDecor() {
    const { width, groundY } = this.world;
    for (let x = 140; x < width; x += 920) {
      if (this.world.locations.some((loc) => Math.abs(loc.x - x) < 280)) continue;
      const tree = createTree(this.scene, x, groundY, "round", 0.58 + ((x / 80) % 3) * 0.08);
      tree.setDepth(6);
      this.sway(tree, 0.8);
    }

    sprinkle(this.scene, "pixar-flowers", {
      y: groundY + 6,
      height: 52,
      worldWidth: width,
      step: 540,
      scroll: 1,
      depth: 7,
      jitterX: 36,
      jitterY: 6,
      flip: true,
      start: 80,
    }).forEach((flower, i) => {
      this.sway(flower, 1.4 + (i % 3) * 0.3);
    });

    sprinkle(this.scene, "pixar-wildflowers", {
      y: groundY + 8,
      height: 42,
      worldWidth: width,
      step: 720,
      scroll: 1,
      depth: 6,
      jitterX: 40,
      jitterY: 5,
      flip: true,
      start: 280,
    }).forEach((flower, i) => {
      if (this.world.locations.some((loc) => Math.abs(loc.x - flower.x) < 90)) {
        flower.setVisible(false);
      }
      this.sway(flower, 1.3 + (i % 2) * 0.25);
    });

    sprinkle(this.scene, "pixar-bush", {
      y: groundY + 8,
      height: 78,
      worldWidth: width,
      step: 900,
      scroll: 1,
      depth: 7,
      jitterX: 50,
      flip: true,
      start: 180,
    }).forEach((bush) => {
      if (this.world.locations.some((loc) => Math.abs(loc.x - bush.x) < 48)) {
        bush.setVisible(false);
      }
      this.sway(bush, 1.1);
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
      const obj = builder(this.scene, loc.x, groundY);
      obj.setDepth(8);
      this.groundProp(loc.x, groundY);
    });
  }

  private groundProp(x: number, groundY: number) {
    const flowerKey = textureKey(this.scene, "pixar-flowers");
    [-72, 78].forEach((dx, i) => {
      if (!this.scene.textures.exists(flowerKey)) return;
      const flower = this.scene.add.image(x + dx, groundY + 10, flowerKey);
      flower.setOrigin(0.5, 1);
      flower.setDisplaySize(46 + (i % 2) * 10, 44 + (i % 2) * 8);
      flower.setDepth(9);
      if (i % 2 === 1) flower.setFlipX(true);
      this.sway(flower, 1.2 + i * 0.15);
    });
  }

  private createForeground() {
    const { width, height, parallax } = this.world;
    scatter(this.scene, ["pixar-fg-flowers", "pixar-flowers", "pixar-wildflowers"], {
      y: height + 10,
      height: 96,
      worldWidth: width,
      step: 340,
      scroll: parallax.foreground,
      depth: 40,
      jitterX: 28,
      heightJitter: 18,
      flip: true,
      alpha: 0.96,
    }).forEach((flower, i) => this.sway(flower, 0.7 + (i % 3) * 0.15));
  }

  private sway(target: Phaser.GameObjects.GameObject, amount: number) {
    if (this.reducedMotion) return;
    this.scene.tweens.add({
      targets: target,
      angle: { from: -amount, to: amount },
      duration: 2600 + Math.random() * 900,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }
}
