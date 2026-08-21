import * as Phaser from "phaser";
import { BootScene } from "@/game/scenes/BootScene";
import { PreloadScene } from "@/game/scenes/PreloadScene";
import { WeddingWorldScene } from "@/game/scenes/WeddingWorldScene";

export interface CreateGameOptions {
  parent: HTMLElement;
  reducedMotion: boolean;
  isMobile: boolean;
}

export function createWeddingGame(options: CreateGameOptions) {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: options.parent,
    backgroundColor: "#3aa0d8",
    scale: {
      mode: Phaser.Scale.RESIZE,
      width: options.parent.clientWidth || window.innerWidth,
      height: options.parent.clientHeight || window.innerHeight,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    render: {
      antialias: true,
      roundPixels: false,
      pixelArt: false,
    },
    audio: { noAudio: true },
    scene: [BootScene, PreloadScene, WeddingWorldScene],
    banner: false,
  });

  game.registry.set("reducedMotion", options.reducedMotion);
  game.registry.set("isMobile", options.isMobile);
  return game;
}
