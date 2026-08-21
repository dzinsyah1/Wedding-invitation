import * as Phaser from "phaser";
import type { Player } from "@/game/player/Player";

export class CameraSystem {
  constructor(
    private scene: Phaser.Scene,
    private player: Player,
    private worldWidth: number,
    private worldHeight: number,
    private reducedMotion: boolean,
    private isMobile: boolean
  ) {
    const cam = scene.cameras.main;
    cam.setBounds(0, 0, worldWidth, worldHeight);
    const lerp = this.reducedMotion ? 1 : this.isMobile ? 0.22 : 0.12;
    cam.startFollow(player, true, lerp, lerp);
    cam.setFollowOffset(0, this.isMobile ? 28 : 36);
    this.fit();
    scene.scale.on("resize", () => this.fit());
  }

  fit() {
    const cam = this.scene.cameras.main;
    const visible = Math.min(this.worldHeight * (this.isMobile ? 0.82 : 0.78), 560);
    const zoom = Math.max(cam.height / visible, 0.92);
    cam.setZoom(zoom);
    const viewW = cam.width / zoom;
    const deadX = this.reducedMotion ? 24 : this.isMobile ? Math.min(28, viewW * 0.08) : Math.min(72, viewW * 0.14);
    cam.setDeadzone(deadX, this.isMobile ? 36 : 56);
    cam.centerOn(this.player.x, this.player.y - (this.isMobile ? 36 : 48));
  }
}
