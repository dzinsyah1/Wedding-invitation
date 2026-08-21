import * as Phaser from "phaser";
import { wedding } from "@/data/wedding";
import { GAME_EVENTS, gameEvents } from "@/game/events/gameEvents";
import { Player } from "@/game/player/Player";
import { WorldBuilder } from "@/game/world/WorldBuilder";
import { CameraSystem } from "@/game/systems/CameraSystem";
import { InteractionSystem } from "@/game/systems/InteractionSystem";
import { AmbientSystem } from "@/game/systems/AmbientSystem";
import { LightingSystem } from "@/game/systems/LightingSystem";
import { AudioSystem } from "@/game/systems/AudioSystem";

export class WeddingWorldScene extends Phaser.Scene {
  private player!: Player;
  private interaction!: InteractionSystem;
  private ambient!: AmbientSystem;
  private lighting!: LightingSystem;
  private audio = new AudioSystem();
  private inputDir = 0;
  private autoTarget: number | null = null;
  private playing = false;
  private modalOpen = false;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyA?: Phaser.Input.Keyboard.Key;
  private keyD?: Phaser.Input.Keyboard.Key;
  private keyE?: Phaser.Input.Keyboard.Key;
  private keyW?: Phaser.Input.Keyboard.Key;
  private keySpace?: Phaser.Input.Keyboard.Key;
  private jumpHeld = false;
  private unsubs: Array<() => void> = [];

  constructor() {
    super("WeddingWorldScene");
  }

  create() {
    const world = wedding.world;
    const reduced = Boolean(this.game.registry.get("reducedMotion"));
    const isMobile = Boolean(this.game.registry.get("isMobile"));

    new WorldBuilder(this, world, reduced).build();

    this.player = new Player(this, world.playerStart.x, world.playerStart.y);
    this.player.setAlpha(0);

    new CameraSystem(this, this.player, world.width, world.height, reduced);
    this.interaction = new InteractionSystem(this, this.player, world.locations, isMobile);
    this.ambient = new AmbientSystem(this, world, reduced);
    this.lighting = new LightingSystem(this, this.player, world.width, world.height);

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keyA = this.input.keyboard.addKey("A");
      this.keyD = this.input.keyboard.addKey("D");
      this.keyE = this.input.keyboard.addKey("E");
      this.keyW = this.input.keyboard.addKey("W");
      this.keySpace = this.input.keyboard.addKey("SPACE");
    }

    this.unsubs.push(
      gameEvents.on(GAME_EVENTS.ENTER_WORLD, () => this.enterWorld()),
      gameEvents.on(GAME_EVENTS.MOVE, (dir) => {
        this.inputDir = typeof dir === "number" ? dir : 0;
      }),
      gameEvents.on(GAME_EVENTS.JUMP, (down) => {
        this.jumpHeld = Boolean(down);
      }),
      gameEvents.on(GAME_EVENTS.INTERACT, () => this.interaction.interact()),
      gameEvents.on(GAME_EVENTS.NAVIGATE_TO, (payload) => {
        const id = (payload as { locationId?: string })?.locationId;
        const loc = world.locations.find((item) => item.id === id);
        if (!loc) return;
        this.autoTarget = loc.x;
        this.playing = true;
      }),
      gameEvents.on(GAME_EVENTS.TOGGLE_MUSIC, async (on) => {
        if (on) await this.audio.startMusic();
        else this.audio.stopMusic();
      }),
      gameEvents.on(GAME_EVENTS.MODAL_STATE, (open) => {
        this.modalOpen = Boolean(open);
        this.audio.setDucked(Boolean(open));
        if (open) {
          this.inputDir = 0;
          this.jumpHeld = false;
        }
      })
    );

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.cleanup());
    gameEvents.emit(GAME_EVENTS.LOAD_PROGRESS, { progress: 1 });
    gameEvents.emit(GAME_EVENTS.GAME_READY);
  }

  private enterWorld() {
    this.playing = true;
    this.tweens.add({
      targets: this.player,
      alpha: 1,
      duration: 500,
    });
    this.cameras.main.zoomTo(this.cameras.main.zoom * 1.04, 700);
    this.time.delayedCall(720, () => {
      this.cameras.main.zoomTo(this.cameras.main.zoom / 1.04, 900);
    });
  }

  update(_time: number, delta: number) {
    if (!this.player) return;
    this.ambient.update(delta, this.player.x);
    this.lighting.update();
    if (!this.playing || this.modalOpen) {
      this.player.updateMovement(delta, 0, null, false);
      this.interaction.update();
      return;
    }

    let dir = this.inputDir;
    if (this.cursors) {
      if (this.cursors.left.isDown || this.keyA?.isDown) dir = -1;
      else if (this.cursors.right.isDown || this.keyD?.isDown) dir = 1;
    }
    if (this.keyE && Phaser.Input.Keyboard.JustDown(this.keyE)) {
      this.interaction.interact();
    }
    const wantJump =
      this.jumpHeld ||
      Boolean(this.cursors?.up.isDown) ||
      Boolean(this.keyW?.isDown) ||
      Boolean(this.keySpace?.isDown);

    this.player.updateMovement(delta, dir, this.autoTarget, wantJump);
    const minX = 80;
    const maxX = wedding.world.width - 80;
    this.player.x = Phaser.Math.Clamp(this.player.x, minX, maxX);

    if (this.autoTarget !== null && Math.abs(this.player.x - this.autoTarget) < 10) {
      this.autoTarget = null;
      this.player.velocity = 0;
    }

    this.interaction.update();
  }

  private cleanup() {
    this.unsubs.forEach((fn) => fn());
    this.audio.stopMusic();
  }
}
