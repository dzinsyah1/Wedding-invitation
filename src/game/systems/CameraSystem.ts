import * as Phaser from "phaser";
import type { Player } from "@/game/player/Player";
import type { DeviceClass } from "@/game/quality";

export class CameraSystem {
  constructor(
    private scene: Phaser.Scene,
    private player: Player,
    private worldWidth: number,
    private worldHeight: number,
    private reducedMotion: boolean,
    private device: DeviceClass
  ) {
    const cam = scene.cameras.main;
    cam.setBounds(0, 0, worldWidth, worldHeight);
    const lerp = this.reducedMotion ? 1 : this.device === "phone" ? 0.22 : 0.12;
    cam.startFollow(player, true, lerp, 0);
    this.fit();
    scene.scale.on("resize", () => this.fit());
  }

  fit() {
    const cam = this.scene.cameras.main;
    const targetWorldH =
      this.device === "phone" ? Math.min(this.worldHeight, Math.max(this.worldHeight * 0.94, 640)) : this.worldHeight;
    const zoom = cam.height / Math.max(1, targetWorldH);
    cam.setZoom(zoom);
    cam.setFollowOffset(0, this.player.y - this.worldHeight / 2);
    const viewW = cam.width / zoom;
    const deadX =
      this.reducedMotion ? 24 : this.device === "phone" ? Math.min(28, viewW * 0.08) : Math.min(72, viewW * 0.14);
    cam.setDeadzone(deadX, 0);
    cam.centerOn(this.player.x, this.worldHeight / 2);
  }
}
