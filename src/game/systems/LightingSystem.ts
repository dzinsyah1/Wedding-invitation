import * as Phaser from "phaser";
import type { Player } from "@/game/player/Player";
import { palette } from "@/data/theme";

export class LightingSystem {
  private overlay: Phaser.GameObjects.Rectangle;

  constructor(
    scene: Phaser.Scene,
    private player: Player,
    private worldWidth: number,
    worldHeight: number
  ) {
    this.overlay = scene.add.rectangle(
      0,
      0,
      3000,
      worldHeight,
      palette.sunsetMid,
      0
    );
    this.overlay.setOrigin(0, 0);
    this.overlay.setScrollFactor(0);
    this.overlay.setDepth(35);
    this.overlay.setBlendMode(Phaser.BlendModes.MULTIPLY);
  }

  update() {
    const t = Phaser.Math.Clamp((this.player.x - this.worldWidth * 0.55) / (this.worldWidth * 0.4), 0, 1);
    // Soft honey-gold wash toward the finale arch
    this.overlay.setFillStyle(0xf0c090, 0.04 + t * 0.22);
  }
}
