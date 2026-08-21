import * as Phaser from "phaser";
import { GAME_EVENTS, gameEvents } from "@/game/events/gameEvents";
import { chromaAndCrop, type ChromaKind } from "@/game/world/chroma";

const CHROMA: Array<[string, string, "blue" | "warm", ChromaKind]> = [
  ["raw-house", "/images/pixar/pixar-house.png?v=2", "blue", "cutout"],
  ["raw-mosque", "/images/pixar/pixar-mosque.png?v=4", "blue", "cutout"],
  ["raw-venue", "/images/pixar/pixar-venue.png?v=4", "blue", "cutout"],
  ["raw-couple", "/images/pixar/pixar-couple.png?v=anim1", "blue", "frame"],
  ["raw-couple-blink", "/images/pixar/pixar-couple-blink.png?v=anim1", "blue", "frame"],
  ["raw-couple-wave", "/images/pixar/pixar-couple-wave.png?v=anim1", "blue", "frame"],
  ["raw-clock", "/images/pixar/pixar-clock.png?v=2", "blue", "plant"],
  ["raw-mailbox", "/images/pixar/pixar-mailbox.png", "blue", "plant"],
  ["raw-gift", "/images/pixar/pixar-gift.png", "blue", "plant"],
  ["raw-tree", "/images/pixar/pixar-tree.png", "blue", "plant"],
  ["raw-story", "/images/pixar/pixar-story.png", "blue", "plant"],
  ["raw-gallery", "/images/pixar/pixar-gallery.png?v=2", "blue", "plant"],
  ["raw-player", "/images/pixar/pixar-player.png", "blue", "cutout"],
  ["raw-finale", "/images/pixar/pixar-finale.png", "warm", "plant"],
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
  ["raw-flowers", "/images/pixar/pixar-flowers.png", "blue", "plant"],
  ["raw-butterfly", "/images/pixar/pixar-butterfly.png", "blue", "cutout"],
  ["raw-bush", "/images/pixar/pixar-bush.png", "blue", "plant"],
  ["raw-fg-flowers", "/images/pixar/pixar-fg-flowers.png?v=1", "blue", "plant"],
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
    CHROMA.forEach(([raw, , mode, kind]) => {
      const dest = raw.replace("raw-", "pixar-");
      try {
        chromaAndCrop(this, raw, dest, mode, kind);
      } catch {
        /* sprites fall back to raw- keys */
      }
    });

    // Chroma key player sprites (cyan background)
    const playerFrames = [
      "raw-player-idle",
      "raw-player-walk-a",
      "raw-player-walk-b",
      "raw-player-jump",
    ];
    playerFrames.forEach((raw) => {
      const dest = raw.replace("raw-", "");
      try {
        chromaAndCrop(this, raw, dest, "blue", "cyan");
      } catch { /* fall back */ }
      if (!this.textures.exists(dest) && this.textures.exists(raw)) {
        const img = this.textures.get(raw).getSourceImage() as HTMLImageElement;
        this.textures.addImage(dest, img);
      }
    });

    const petal = this.add.graphics();
    petal.fillStyle(0xffb7c5, 0.9);
    petal.fillEllipse(8, 8, 10, 6);
    petal.generateTexture("petal", 16, 16);
    petal.destroy();

    gameEvents.emit(GAME_EVENTS.LOAD_PROGRESS, { progress: 1 });
    this.time.delayedCall(180, () => this.scene.start("WeddingWorldScene"));
  }
}
