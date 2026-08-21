import * as Phaser from "phaser";
import { GAME_EVENTS, gameEvents } from "@/game/events/gameEvents";
import { chromaAndCrop, type ChromaKind } from "@/game/world/chroma";

const CHROMA: Array<[string, string, "blue" | "warm", ChromaKind]> = [
  ["raw-house", "/images/pixar/pixar-house.png?v=garden4", "blue", "cutout"],
  ["raw-mosque", "/images/pixar/pixar-mosque.png?v=garden4", "blue", "cutout"],
  ["raw-venue", "/images/pixar/pixar-venue.png?v=garden4", "blue", "cutout"],
  ["raw-couple", "/images/pixar/pixar-couple.png?v=garden4", "blue", "frame"],
  ["raw-couple-blink", "/images/pixar/pixar-couple-blink.png?v=garden4", "blue", "frame"],
  ["raw-couple-wave", "/images/pixar/pixar-couple-wave.png?v=garden4", "blue", "frame"],
  ["raw-clock", "/images/pixar/pixar-clock.png?v=garden4", "blue", "cutout"],
  ["raw-mailbox", "/images/pixar/pixar-mailbox.png?v=garden4", "blue", "cutout"],
  ["raw-gift", "/images/pixar/pixar-gift.png?v=garden4", "blue", "cutout"],
  ["raw-tree", "/images/pixar/pixar-tree.png", "blue", "plant"],
  ["raw-story", "/images/pixar/pixar-story.png?v=garden4", "blue", "cutout"],
  ["raw-gallery", "/images/pixar/pixar-gallery.png?v=garden4", "blue", "cutout"],
  ["raw-player", "/images/pixar/pixar-player.png", "blue", "cutout"],
  ["raw-finale", "/images/pixar/pixar-finale.png?v=garden4", "blue", "cutout"],
  ["raw-mountains", "/images/pixar/pixar-mountains.png", "blue", "cutout"],
  ["raw-hills", "/images/pixar/pixar-hills.png", "blue", "cutout"],
  ["raw-hill", "/images/pixar/pixar-hill.png?v=1", "blue", "cutout"],
  ["raw-hill-b", "/images/pixar/pixar-hill-b.png?v=1", "blue", "cutout"],
  ["raw-hill-far", "/images/pixar/pixar-hill-far.png?v=1", "blue", "cutout"],
  ["raw-desa-far", "/images/pixar/pixar-desa-far.png?v=1", "blue", "cutout"],
  ["raw-desa-hill", "/images/pixar/pixar-desa-hill.png?v=1", "blue", "cutout"],
  ["raw-desa-flowers", "/images/pixar/pixar-desa-flowers.png?v=1", "blue", "cutout"],
  ["raw-coconut", "/images/pixar/pixar-coconut.png?v=1", "blue", "plant"],
  ["raw-wildflowers", "/images/pixar/pixar-wildflowers.png?v=1", "blue", "plant"],
  ["raw-rumah", "/images/pixar/pixar-rumah.png?v=1", "blue", "plant"],
  ["raw-rumah-kelapa", "/images/pixar/pixar-rumah-kelapa.png?v=1", "blue", "plant"],
  ["raw-grove", "/images/pixar/pixar-grove.png?v=1", "blue", "plant"],
  ["raw-flower-grove", "/images/pixar/pixar-flower-grove.png?v=1", "blue", "plant"],
  ["raw-river", "/images/pixar/pixar-river.png?v=1", "blue", "plant"],
  ["raw-kerbau-a", "/images/pixar/pixar-kerbau-a.png?v=1", "blue", "plant"],
  ["raw-kerbau-b", "/images/pixar/pixar-kerbau-b.png?v=1", "blue", "plant"],
  ["raw-itik", "/images/pixar/pixar-itik.png?v=1", "blue", "plant"],
  ["raw-ayam", "/images/pixar/pixar-ayam.png?v=1", "blue", "plant"],
  ["raw-kambing", "/images/pixar/pixar-kambing.png?v=1", "blue", "plant"],
  ["raw-grass", "/images/pixar/pixar-grass.png?v=1", "blue", "cutout"],
  ["raw-grass-bank", "/images/pixar/pixar-grass-bank.png?v=1", "blue", "plant"],
  ["raw-cloud", "/images/pixar/pixar-cloud.png", "blue", "cutout"],
  ["raw-bird", "/images/pixar/pixar-bird.png", "blue", "cutout"],
  ["raw-dove-fly-a", "/images/pixar/pixar-dove-fly-a.png?v=1", "blue", "cutout"],
  ["raw-dove-fly-b", "/images/pixar/pixar-dove-fly-b.png?v=1", "blue", "cutout"],
  ["raw-dove-idle", "/images/pixar/pixar-dove-idle.png?v=1", "blue", "cutout"],
  ["raw-flowers", "/images/pixar/pixar-flowers.png", "blue", "plant"],
  ["raw-butterfly", "/images/pixar/pixar-butterfly.png", "blue", "cutout"],
  ["raw-bush", "/images/pixar/pixar-bush.png", "blue", "plant"],
  ["raw-fg-flowers", "/images/pixar/pixar-fg-flowers.png?v=1", "blue", "plant"],
  ["raw-white-roses", "/images/pixar/pixar-white-roses.png?v=garden1", "blue", "cutout"],
  ["raw-rose-hedge", "/images/pixar/pixar-rose-hedge.png?v=garden1", "blue", "cutout"],
  ["raw-rose-arch", "/images/pixar/pixar-rose-arch.png?v=garden1", "blue", "cutout"],
  ["raw-fg-roses", "/images/pixar/pixar-fg-roses.png?v=garden1", "blue", "cutout"],
  ["raw-garden-lantern", "/images/pixar/pixar-garden-lantern.png?v=garden1", "blue", "cutout"],
  ["raw-blossom-canopy", "/images/pixar/pixar-blossom-canopy.png?v=garden1", "blue", "cutout"],
  ["raw-rose-bank", "/images/pixar/pixar-rose-bank.png?v=garden1", "blue", "cutout"],
  ["raw-rose-cluster", "/images/pixar/pixar-rose-cluster.png?v=garden1", "blue", "cutout"],
  ["raw-rose-wall", "/images/pixar/pixar-rose-wall.png?v=garden2", "blue", "cutout"],
  ["raw-rose-bed", "/images/pixar/pixar-rose-bed.png?v=garden2", "blue", "cutout"],
  ["raw-stone-path", "/images/pixar/pixar-stone-path.png?v=garden2", "blue", "cutout"],
  ["raw-mixed-wall", "/images/pixar/pixar-mixed-wall.png?v=garden3", "blue", "cutout"],
  ["raw-mixed-cluster", "/images/pixar/pixar-mixed-cluster.png?v=garden3", "blue", "cutout"],
  ["raw-tall-blooms", "/images/pixar/pixar-tall-blooms.png?v=garden3", "blue", "cutout"],
  ["raw-low-blooms", "/images/pixar/pixar-low-blooms.png?v=garden3", "blue", "cutout"],
  ["raw-mixed-bed", "/images/pixar/pixar-mixed-bed.png?v=garden3", "blue", "cutout"],
  ["raw-leaf-wall", "/images/pixar/pixar-leaf-wall.png?v=garden5", "blue", "cutout"],
  ["raw-garden-tree", "/images/pixar/pixar-garden-tree.png?v=garden5", "blue", "cutout"],
  ["raw-leaf-shrub", "/images/pixar/pixar-leaf-shrub.png?v=garden5", "blue", "cutout"],
  ["raw-leaf-bed", "/images/pixar/pixar-leaf-bed.png?v=garden5", "blue", "cutout"],
  ["raw-treeline", "/images/pixar/pixar-treeline.png?v=garden6", "warm", "cutout"],
  ["raw-garden-clouds", "/images/pixar/pixar-garden-clouds.png?v=garden6", "blue", "cutout"],
  ["raw-hang-vines", "/images/pixar/pixar-hang-vines.png?v=garden6", "warm", "cutout"],
];

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.load.on("progress", (value: number) => {
      gameEvents.emit(GAME_EVENTS.LOAD_PROGRESS, { progress: value * 0.75 });
    });
    CHROMA.forEach(([key, path]) => this.load.image(key, path));
    this.load.image("pixar-ground", "/images/pixar/pixar-ground.png");
    this.load.image("raw-player-idle", "/images/player-idle.png?v=7");
    this.load.image("raw-player-walk-a", "/images/player-walk-a.png?v=7");
    this.load.image("raw-player-walk-b", "/images/player-walk-b.png?v=7");
    this.load.image("raw-player-jump", "/images/player-jump.png?v=7");
  }

  create() {
    const jobs: Array<() => void> = CHROMA.map(([raw, , mode, kind]) => () => {
      const dest = raw.replace("raw-", "pixar-");
      try {
        chromaAndCrop(this, raw, dest, mode, kind);
      } catch {
        /* sprites fall back to raw- keys */
      }
    });

    const playerFrames = [
      "raw-player-idle",
      "raw-player-walk-a",
      "raw-player-walk-b",
      "raw-player-jump",
    ];
    playerFrames.forEach((raw) => {
      jobs.push(() => {
        const dest = raw.replace("raw-", "");
        try {
          chromaAndCrop(this, raw, dest, "blue", "cyan");
        } catch {
          /* fall back */
        }
        if (!this.textures.exists(dest) && this.textures.exists(raw)) {
          const img = this.textures.get(raw).getSourceImage() as HTMLImageElement;
          this.textures.addImage(dest, img);
        }
      });
    });

    let index = 0;
    const runBatch = () => {
      const end = Math.min(index + 4, jobs.length);
      while (index < end) {
        jobs[index]();
        index += 1;
      }
      gameEvents.emit(GAME_EVENTS.LOAD_PROGRESS, {
        progress: 0.75 + (index / jobs.length) * 0.24,
      });
      if (index < jobs.length) {
        this.time.delayedCall(0, runBatch);
        return;
      }

      const petal = this.add.graphics();
      petal.fillStyle(0xfff6ee, 0.95);
      petal.fillEllipse(8, 8, 11, 6);
      petal.fillStyle(0xffe8c8, 0.5);
      petal.fillEllipse(7, 7, 4, 2.5);
      petal.generateTexture("petal", 16, 16);
      petal.destroy();

      gameEvents.emit(GAME_EVENTS.LOAD_PROGRESS, { progress: 1 });
      this.time.delayedCall(180, () => this.scene.start("WeddingWorldScene"));
    };

    runBatch();
  }
}
