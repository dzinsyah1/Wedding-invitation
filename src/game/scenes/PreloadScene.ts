import * as Phaser from "phaser";
import { GAME_EVENTS, gameEvents } from "@/game/events/gameEvents";
import {
  CHROMA_ASSETS,
  PLAYER_FRAMES,
  cutAssetUrl,
  cutPlayerUrl,
  tierAtLeast,
  type QualityTier,
} from "@/game/quality";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    const tier = (this.game.registry.get("qualityTier") as QualityTier) || "medium";
    this.load.maxParallelDownloads = 4;
    this.load.on("progress", (value: number) => {
      gameEvents.emit(GAME_EVENTS.LOAD_PROGRESS, { progress: value });
    });
    this.load.on("loaderror", (file: { key?: string }) => {
      console.warn("Failed to load", file?.key);
    });

    CHROMA_ASSETS.filter((asset) => tierAtLeast(tier, asset.minTier)).forEach((asset) => {
      this.load.image(`pixar-${asset.key}`, cutAssetUrl(asset.file));
    });
    PLAYER_FRAMES.forEach((frame) => {
      this.load.image(frame.dest, cutPlayerUrl(frame.file));
    });
  }

  create() {
    const petal = this.add.graphics();
    petal.fillStyle(0xfff6ee, 0.95);
    petal.fillEllipse(8, 8, 11, 6);
    petal.fillStyle(0xffe8c8, 0.5);
    petal.fillEllipse(7, 7, 4, 2.5);
    petal.generateTexture("petal", 16, 16);
    petal.destroy();

    gameEvents.emit(GAME_EVENTS.LOAD_PROGRESS, { progress: 1 });
    this.time.delayedCall(40, () => this.scene.start("WeddingWorldScene"));
  }
}
