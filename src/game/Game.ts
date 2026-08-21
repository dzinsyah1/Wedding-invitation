import * as Phaser from "phaser";
import { BootScene } from "@/game/scenes/BootScene";
import { PreloadScene } from "@/game/scenes/PreloadScene";
import { WeddingWorldScene } from "@/game/scenes/WeddingWorldScene";
import { detectQuality, qualitySettings, type DeviceClass, type QualityTier } from "@/game/quality";

export interface CreateGameOptions {
  parent: HTMLElement;
  reducedMotion: boolean;
  isMobile: boolean;
  device: DeviceClass;
  quality?: QualityTier;
}

export function createWeddingGame(options: CreateGameOptions) {
  const tier = options.quality ?? detectQuality(options.reducedMotion);
  const settings = qualitySettings(tier);
  const width = options.parent.clientWidth || window.innerWidth;
  const height = options.parent.clientHeight || window.innerHeight;

  const config: Phaser.Types.Core.GameConfig = {
    type: settings.canvasRenderer ? Phaser.CANVAS : Phaser.AUTO,
    parent: options.parent,
    backgroundColor: "#3aa0d8",
    fps: {
      target: settings.fps,
      min: 20,
    },
    scale: {
      mode: Phaser.Scale.RESIZE,
      width,
      height,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      autoRound: false,
    },
    render: {
      antialias: true,
      antialiasGL: true,
      roundPixels: false,
      pixelArt: false,
      mipmapFilter: "LINEAR",
      powerPreference: settings.tier === "low" ? "low-power" : "high-performance",
    },
    input: {
      windowEvents: false,
      keyboard: true,
    },
    audio: { noAudio: true },
    scene: [BootScene, PreloadScene, WeddingWorldScene],
    banner: false,
  };

  let game: Phaser.Game;
  try {
    game = new Phaser.Game(config);
  } catch {
    game = new Phaser.Game({ ...config, type: Phaser.CANVAS });
  }

  game.registry.set("reducedMotion", options.reducedMotion);
  game.registry.set("isMobile", options.isMobile);
  game.registry.set("device", options.device);
  game.registry.set("qualityTier", tier);
  game.registry.set("quality", settings);
  return game;
}
