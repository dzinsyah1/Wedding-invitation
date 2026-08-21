import * as Phaser from "phaser";
import type { WorldLocation } from "@/types/wedding";
import { GAME_EVENTS, gameEvents } from "@/game/events/gameEvents";
import type { Player } from "@/game/player/Player";

export class InteractionSystem {
  current: WorldLocation | null = null;
  private visited = new Set<string>();
  private modalOpen = false;
  private hovered: WorldLocation | null = null;
  private markers = new Map<string, Phaser.GameObjects.Container>();
  private reduced: boolean;
  private lockedUntil = 0;

  constructor(
    private scene: Phaser.Scene,
    private player: Player,
    private locations: WorldLocation[],
    private isMobile: boolean
  ) {
    this.reduced = Boolean(scene.game.registry.get("reducedMotion"));
    this.locations.forEach((loc) => this.attachHotspot(loc));

    gameEvents.on(GAME_EVENTS.MODAL_STATE, (open) => {
      this.modalOpen = Boolean(open);
      this.hovered = null;
      if (open) {
        this.refreshHint();
        return;
      }
      this.scene.time.delayedCall(40, () => {
        this.refreshHint();
        if (this.current && !this.modalOpen) this.emitPos(this.current);
      });
    });
  }

  update() {
    const found =
      this.locations.find((loc) => Math.abs(this.player.x - loc.x) < this.reach(loc)) ?? null;

    if (found?.id !== this.current?.id) {
      this.current = found;
      if (found && !this.visited.has(found.id)) {
        this.visited.add(found.id);
        gameEvents.emit(GAME_EVENTS.LOCATION_VISITED, { locationId: found.id });
      }
      this.refreshHint();
    }

    const loc = this.modalOpen ? null : (this.hovered ?? this.current);
    if (loc) this.emitPos(loc);
  }

  private reach(loc: WorldLocation) {
    return Math.min(this.isMobile ? 78 : 96, loc.width * 0.22);
  }

  lock(ms: number) {
    this.lockedUntil = this.scene.time.now + ms;
  }

  interact(loc?: WorldLocation) {
    const target = loc ?? this.hovered ?? this.current;
    if (!target || this.modalOpen || this.scene.time.now < this.lockedUntil) return;
    this.player.playInteract();
    gameEvents.emit(GAME_EVENTS.OPEN_MODAL, {
      type: target.interaction.type,
      locationId: target.id,
      eventId: target.interaction.eventId,
    });
  }

  private attachHotspot(loc: WorldLocation) {
    const groundY = this.player.y;
    const hitW = Math.min(this.isMobile ? 140 : 180, loc.width * 0.42);
    const hitH = loc.promptLift * 0.55;
    const zone = this.scene.add.zone(loc.x, groundY - hitH * 0.48, hitW, hitH);
    zone.setInteractive({ useHandCursor: true });
    zone.setDepth(45);
    zone.on("pointerover", () => {
      this.hovered = loc;
      this.refreshHint();
    });
    zone.on("pointerout", () => {
      if (this.hovered?.id === loc.id) this.hovered = null;
      this.refreshHint();
    });
    zone.on("pointerdown", () => this.interact(loc));

    this.markers.set(loc.id, this.makeMarker(loc, groundY));
  }

  private makeMarker(loc: WorldLocation, groundY: number) {
    const wrap = this.scene.add.container(loc.x, groundY - loc.promptLift * 0.8);
    wrap.setDepth(46);
    wrap.setAlpha(this.isMobile ? 0.42 : 0.32);

    const g = this.scene.add.graphics();
    const dots = [
      { x: 0, y: 0, r: 2.4 },
      { x: -11, y: 7, r: 1.35 },
      { x: 12, y: 5, r: 1.5 },
    ];
    dots.forEach((d) => {
      g.fillStyle(0xfff8e8, 0.95);
      g.fillCircle(d.x, d.y, d.r);
      g.fillStyle(0xe8b84a, 0.7);
      g.fillCircle(d.x, d.y, d.r * 0.42);
    });
    wrap.add(g);

    if (!this.reduced) {
      this.scene.tweens.add({
        targets: wrap,
        y: wrap.y - 7,
        duration: 1600,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }
    return wrap;
  }

  private refreshHint() {
    const loc = this.modalOpen ? null : (this.hovered ?? this.current);
    this.markers.forEach((marker, id) => {
      const active = loc?.id === id;
      marker.setVisible(!active);
    });
    this.setHint(loc);
  }

  private emitPos(loc: WorldLocation) {
    const pos = this.screenPos(loc);
    gameEvents.emit(GAME_EVENTS.PROMPT_POS, { x: pos.x, y: pos.y });
  }

  private screenPos(loc: WorldLocation) {
    const cam = this.scene.cameras.main;
    const canvas = this.scene.game.canvas;
    const canvasRect = canvas.getBoundingClientRect();
    const root = canvas.closest("main") ?? canvas.parentElement;
    const rootRect = root?.getBoundingClientRect() ?? canvasRect;
    const lift = this.isMobile ? Math.min(loc.promptLift * 0.82, 220) : loc.promptLift;
    const bob = this.reduced ? 0 : Math.sin(this.scene.time.now / 460) * 3;
    const worldY = this.player.y - lift + bob;
    const sx = (loc.x - cam.midPoint.x) * cam.zoom + cam.centerX;
    const sy = (worldY - cam.midPoint.y) * cam.zoom + cam.centerY;
    const scaleX = canvasRect.width / Math.max(1, this.scene.scale.width);
    const scaleY = canvasRect.height / Math.max(1, this.scene.scale.height);
    const x = canvasRect.left - rootRect.left + sx * scaleX;
    const y = canvasRect.top - rootRect.top + sy * scaleY;
    return { x, y, screenX: x, screenY: y };
  }

  private setHint(loc: WorldLocation | null) {
    if (!loc) {
      gameEvents.emit(GAME_EVENTS.HIDE_PROMPT);
      return;
    }
    gameEvents.emit(GAME_EVENTS.SHOW_PROMPT, {
      label: loc.interaction.label,
      locationId: loc.id,
      desktop: loc.interaction.label,
      ...this.screenPos(loc),
    });
  }
}
