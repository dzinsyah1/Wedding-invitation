import * as Phaser from "phaser";
import type { Player } from "@/game/player/Player";

export class CameraSystem {
  constructor(
    private scene: Phaser.Scene,
    private player: Player,
    private worldWidth: number,
    private worldHeight: number,
    private reducedMotion: boolean
  ) {
    const cam = scene.cameras.main;
    cam.setBounds(0, 0, worldWidth, worldHeight);
    cam.startFollow(player, true, reducedMotion ? 1 : 0.08, reducedMotion ? 1 : 0.1);
    cam.setDeadzone(reducedMotion ? 40 : 150, 140);
    cam.setFollowOffset(0, -64);
    this.fit();
    scene.scale.on("resize", () => this.fit());
  }

  fit() {
    const cam = this.scene.cameras.main;
    const zoom = Math.max(cam.height / this.worldHeight, 0.72);
    cam.setZoom(zoom);
    cam.centerOn(this.player.x, this.worldHeight * 0.58);
  }
}
