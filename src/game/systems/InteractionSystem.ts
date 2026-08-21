import * as Phaser from "phaser";
import type { WorldLocation } from "@/types/wedding";
import { GAME_EVENTS, gameEvents } from "@/game/events/gameEvents";
import type { Player } from "@/game/player/Player";

export class InteractionSystem {
  current: WorldLocation | null = null;
  private prompt: Phaser.GameObjects.Container;
  private promptLabel: Phaser.GameObjects.Text;
  private visited = new Set<string>();

  constructor(
    private scene: Phaser.Scene,
    private player: Player,
    private locations: WorldLocation[],
    private isMobile: boolean
  ) {
    this.prompt = scene.add.container(0, 0);
    this.prompt.setDepth(50);
    this.prompt.setVisible(false);

    const bg = scene.add.graphics();
    this.prompt.add(bg);
    this.promptLabel = scene.add.text(0, 0, "", {
      fontFamily: "Nunito, sans-serif",
      fontSize: "15px",
      color: "#1f3a5f",
      fontStyle: "bold",
    });
    this.promptLabel.setOrigin(0.5);
    this.prompt.add(this.promptLabel);
    this.prompt.setSize(240, 40);
    this.prompt.setInteractive(
      new Phaser.Geom.Rectangle(-120, -20, 240, 40),
      Phaser.Geom.Rectangle.Contains
    );
    this.prompt.on("pointerdown", () => this.interact());
  }

  update() {
    const found =
      this.locations.find(
        (loc) => Math.abs(this.player.x - loc.x) < loc.width / 2
      ) ?? null;

    if (found?.id !== this.current?.id) {
      this.current = found;
      if (found) {
        this.show(found);
        if (!this.visited.has(found.id)) {
          this.visited.add(found.id);
          gameEvents.emit(GAME_EVENTS.LOCATION_VISITED, { locationId: found.id });
        }
      } else {
        this.hide();
      }
    }

    if (this.current) {
      const bob = Math.sin(this.scene.time.now / 420) * 5;
      this.prompt.x = this.current.x;
      this.prompt.y = this.player.y - 128 + bob;
    }
  }

  interact() {
    if (!this.current) return;
    this.player.playInteract();
    gameEvents.emit(GAME_EVENTS.OPEN_MODAL, {
      type: this.current.interaction.type,
      locationId: this.current.id,
      eventId: this.current.interaction.eventId,
    });
  }

  private show(loc: WorldLocation) {
    const desktop = `[ E ]  ${loc.interaction.label}`;
    const label = this.isMobile ? `✦  ${loc.interaction.label}` : desktop;
    this.promptLabel.setText(label);
    const width = Math.max(210, label.length * 9 + 36);
    const bg = this.prompt.list[0] as Phaser.GameObjects.Graphics;
    bg.clear();
    bg.fillStyle(0xfffffb, 0.96);
    bg.fillRoundedRect(-width / 2, -18, width, 36, 18);
    bg.lineStyle(2, 0xf0c14a, 0.95);
    bg.strokeRoundedRect(-width / 2, -18, width, 36, 18);
    this.prompt.setVisible(true);
    this.prompt.setAlpha(0);
    this.scene.tweens.add({
      targets: this.prompt,
      alpha: 1,
      duration: 220,
    });
    gameEvents.emit(GAME_EVENTS.SHOW_PROMPT, {
      label: loc.interaction.label,
      locationId: loc.id,
      desktop,
    });
  }

  private hide() {
    this.prompt.setVisible(false);
    gameEvents.emit(GAME_EVENTS.HIDE_PROMPT);
  }
}
