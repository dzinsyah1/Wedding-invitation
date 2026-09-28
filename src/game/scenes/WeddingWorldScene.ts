import * as Phaser from "phaser";
import { wedding } from "@/data/wedding";
import { GAME_EVENTS, gameEvents } from "@/game/events/gameEvents";
import { Player } from "@/game/player/Player";
import { isPlayerCharacterId } from "@/game/player/characters";
import { WorldBuilder } from "@/game/world/WorldBuilder";
import { CameraSystem } from "@/game/systems/CameraSystem";
import { InteractionSystem } from "@/game/systems/InteractionSystem";
import { AmbientSystem } from "@/game/systems/AmbientSystem";
import { LightingSystem } from "@/game/systems/LightingSystem";
import { AudioSystem } from "@/game/systems/AudioSystem";
import { TeleportFx } from "@/game/systems/TeleportFx";
import { ArrivalFx } from "@/game/systems/ArrivalFx";
import { PlaySystem } from "@/game/systems/PlaySystem";
import { qualitySettings, type DeviceClass, type QualitySettings } from "@/game/quality";
import type { WorldLocation } from "@/types/wedding";

export class WeddingWorldScene extends Phaser.Scene {
  private player!: Player;
  private interaction!: InteractionSystem;
  private ambient!: AmbientSystem;
  private lighting: LightingSystem | null = null;
  private audio = new AudioSystem();
  private inputDir = 0;
  private autoTarget: number | null = null;
  private playing = false;
  private teleporting = false;
  private teleportFx!: TeleportFx;
  private arrivalFx!: ArrivalFx;
  private play!: PlaySystem;
  private reduced = false;
  private modalOpen = false;
  private overlayOpen = false;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyA?: Phaser.Input.Keyboard.Key;
  private keyD?: Phaser.Input.Keyboard.Key;
  private keyE?: Phaser.Input.Keyboard.Key;
  private keyEnter?: Phaser.Input.Keyboard.Key;
  private keyW?: Phaser.Input.Keyboard.Key;
  private keySpace?: Phaser.Input.Keyboard.Key;
  private jumpHeld = false;
  private isMobile = false;
  private unsubs: Array<() => void> = [];

  constructor() {
    super("WeddingWorldScene");
  }

  create() {
    const world = wedding.world;
    const reduced = Boolean(this.game.registry.get("reducedMotion"));
    const isMobile = Boolean(this.game.registry.get("isMobile"));
    const device = (this.game.registry.get("device") as DeviceClass) || (isMobile ? "phone" : "desktop");
    const settings =
      (this.game.registry.get("quality") as QualitySettings) ?? qualitySettings("medium");
    this.isMobile = isMobile;

    new WorldBuilder(this, world, reduced).build();

    this.player = new Player(this, world.playerStart.x, world.playerStart.y);
    this.player.setAlpha(0);

    this.input.enabled = false;

    new CameraSystem(this, this.player, world.width, world.height, reduced, device);
    this.interaction = new InteractionSystem(this, this.player, world.locations, isMobile);
    this.ambient = new AmbientSystem(this, world, reduced);
    this.teleportFx = new TeleportFx(this, world.height, reduced);
    this.arrivalFx = new ArrivalFx(this, this.teleportFx);
    this.play = new PlaySystem(this, world, this.player, (kind) => {
      if (kind === "bounce") this.audio.bounce();
      else if (kind === "catch") this.audio.catchDove();
      else this.audio.releaseDove();
    });
    this.reduced = reduced;
    this.lighting = settings.lighting
      ? new LightingSystem(this, this.player, world.width, world.height)
      : null;

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keyA = this.input.keyboard.addKey("A");
      this.keyD = this.input.keyboard.addKey("D");
      this.keyE = this.input.keyboard.addKey("E");
      this.keyEnter = this.input.keyboard.addKey("ENTER");
      // Event-based so even a very quick tap is never missed between frames.
      this.input.keyboard.on("keydown-R", () => {
        if (this.playing && !this.modalOpen && !this.overlayOpen) this.play.toggleDove();
      });
      this.keyW = this.input.keyboard.addKey("W");
      this.keySpace = this.input.keyboard.addKey("SPACE");
    }

    this.unsubs.push(
      gameEvents.on(GAME_EVENTS.ENTER_WORLD, (payload) => {
        const character = (payload as { character?: unknown } | undefined)?.character;
        this.player.setCharacter(isPlayerCharacterId(character) ? character : "male");
        this.enterWorld();
      }),
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
      gameEvents.on(GAME_EVENTS.RELEASE_DOVE, () => this.play.releaseDove()),
      gameEvents.on(GAME_EVENTS.TELEPORT_TO, (payload) => {
        const id = (payload as { locationId?: string })?.locationId;
        const loc = world.locations.find((item) => item.id === id);
        if (loc) this.teleportTo(loc);
      }),
      gameEvents.on(GAME_EVENTS.TOGGLE_MUSIC, async (on) => {
        if (on) await this.audio.startMusic();
        else this.audio.stopMusic();
      }),
      gameEvents.on(GAME_EVENTS.MODAL_STATE, (open) => {
        this.modalOpen = Boolean(open);
        this.audio.setDucked(Boolean(open));
        this.setKeyCapture(!open);
        if (open) {
          this.inputDir = 0;
          this.jumpHeld = false;
          this.input.enabled = false;
        } else {
          this.interaction.lock(700);
          this.time.delayedCall(80, () => {
            if (!this.modalOpen) this.input.enabled = true;
          });
        }
      }),
      // Full-page invitation shown on top of the world: pause the game and release the keyboard.
      gameEvents.on(GAME_EVENTS.OVERLAY_STATE, (open) => {
        this.overlayOpen = Boolean(open);
        this.inputDir = 0;
        this.jumpHeld = false;
        this.setKeyCapture(!open);
        if (!open) this.interaction.lock(500);
      })
    );

    this.input.on("pointerup", () => {
      if (!this.isMobile) return;
      this.inputDir = 0;
      this.jumpHeld = false;
    });
    this.input.on("pointerupoutside", () => {
      if (!this.isMobile) return;
      this.inputDir = 0;
      this.jumpHeld = false;
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.cleanup());
    // Dev-only handle for poking the scene from the browser console / tests.
    if (process.env.NODE_ENV !== "production") {
      (window as Window & { __weddingScene?: Phaser.Scene }).__weddingScene = this;
    }
    gameEvents.emit(GAME_EVENTS.LOAD_PROGRESS, { progress: 1 });
    gameEvents.emit(GAME_EVENTS.GAME_READY);
  }

  // Phaser calls preventDefault on captured keys (space, arrows) window-wide,
  // which would block typing them into RSVP fields while a form is open.
  private setKeyCapture(on: boolean) {
    const keyboard = this.input.keyboard;
    if (!keyboard) return;
    if (on) {
      keyboard.enableGlobalCapture();
    } else {
      keyboard.disableGlobalCapture();
      keyboard.resetKeys();
    }
  }

  private enterWorld() {
    if (this.reduced) {
      this.playing = true;
      this.interaction.lock(700);
      this.tweens.add({ targets: this.player, alpha: 1, duration: 500 });
      this.time.delayedCall(550, () => {
        this.input.enabled = true;
      });
      gameEvents.emit(GAME_EVENTS.PLAYER_LANDED);
      this.play.emitState();
      return;
    }

    // The guest is carried down from the sky; controls unlock on touchdown.
    this.playing = false;
    this.interaction.setSuspended(true);
    this.audio.chime();
    this.arrivalFx.play(this.player, () => {
      this.playing = true;
      this.interaction.setSuspended(false);
      this.interaction.lock(400);
      this.input.enabled = true;
      gameEvents.emit(GAME_EVENTS.PLAYER_LANDED);
      this.play.emitState();
    });
  }

  private teleportTo(loc: WorldLocation) {
    if (!this.playing || this.teleporting || this.modalOpen) return;
    this.autoTarget = null;
    this.inputDir = 0;
    // Already standing there: skip the effect and open it straight away.
    if (Math.abs(this.player.x - loc.x) < 60) {
      this.interaction.interact(loc);
      return;
    }
    this.player.cancelLaunch();
    this.teleporting = true;
    this.interaction.setSuspended(true);
    this.audio.chime();
    this.player.setFacing(loc.x > this.player.x ? 1 : -1);
    this.teleportFx.play(this.player, loc.x, () => {
      this.teleporting = false;
      this.interaction.setSuspended(false);
      // Brief beat so the guest sees where they landed before the info opens.
      this.time.delayedCall(380, () => {
        if (!this.modalOpen && !this.teleporting) this.interaction.interact(loc);
      });
    });
  }

  update(_time: number, delta: number) {
    if (!this.player) return;
    this.ambient.update(delta, this.player.x);
    this.lighting?.update();
    if (!this.playing || this.modalOpen || this.overlayOpen || this.teleporting) {
      this.player.updateMovement(delta, 0, null, false);
      this.interaction.update();
      return;
    }

    let dir = this.inputDir;
    if (this.cursors) {
      if (this.cursors.left.isDown || this.keyA?.isDown) dir = -1;
      else if (this.cursors.right.isDown || this.keyD?.isDown) dir = 1;
    }
    if (
      (this.keyE && Phaser.Input.Keyboard.JustDown(this.keyE)) ||
      (this.keyEnter && Phaser.Input.Keyboard.JustDown(this.keyEnter))
    ) {
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
    this.play.update(delta);

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
