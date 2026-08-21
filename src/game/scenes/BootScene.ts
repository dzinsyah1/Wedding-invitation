import * as Phaser from "phaser";
import { GAME_EVENTS, gameEvents } from "@/game/events/gameEvents";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  create() {
    gameEvents.emit(GAME_EVENTS.LOAD_PROGRESS, { progress: 0.08 });
    this.scene.start("PreloadScene");
  }
}
