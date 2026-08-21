import * as Phaser from "phaser";
import { gfx, round } from "@/game/world/paint";
import { palette } from "@/data/theme";

export function makeSign(scene: Phaser.Scene, text: string, x: number, y: number) {
  const wrap = scene.add.container(x, y);
  const g = gfx(scene);
  const w = Math.max(128, text.length * 8.4 + 36);
  round(g, 0, 0, w, 34, 17, 0xfffffb, 0.94);
  g.lineStyle(2, 0xffe08a, 0.95);
  g.strokeRoundedRect(-w / 2, -17, w, 34, 17);
  wrap.add(g);
  const label = scene.add.text(0, 0, text, {
    fontFamily: "Nunito, sans-serif",
    fontSize: "15px",
    color: "#3d4a3f",
    fontStyle: "bold",
  });
  label.setOrigin(0.5);
  wrap.add(label);
  return wrap;
}

export function placeProp(
  scene: Phaser.Scene,
  key: string,
  x: number,
  groundY: number,
  height: number,
  sign?: string,
  signLift = 18
) {
  const wrap = scene.add.container(x, groundY);
  const textureKey = scene.textures.exists(key)
    ? key
    : key.replace("pixar-", "raw-");
  if (!scene.textures.exists(textureKey)) {
    const missing = scene.add.ellipse(0, -height / 2, height * 0.6, height, 0x7cbc6a, 0.5);
    wrap.add(missing);
    return wrap;
  }

  const img = scene.add.image(0, 6, textureKey);
  img.setOrigin(0.5, 1);
  const displayW = (img.width / img.height) * height;
  img.setDisplaySize(displayW, height);

  const shadow = scene.add.ellipse(0, 10, displayW * 0.4, 12, palette.shadow, 0.16);
  wrap.add(shadow);
  wrap.add(img);

  if (sign) {
    wrap.add(makeSign(scene, sign, 0, -height + signLift + 10));
  }
  return wrap;
}

export function placeLandmark(
  scene: Phaser.Scene,
  key: string,
  x: number,
  groundY: number,
  height: number,
  sign?: string,
  signLift = 18
) {
  const wrap = scene.add.container(x, groundY);
  const textureKey = scene.textures.exists(key)
    ? key
    : key.replace("pixar-", "raw-");
  if (!scene.textures.exists(textureKey)) {
    return placeProp(scene, key, x, groundY, height, sign, signLift);
  }

  const img = scene.add.image(0, 8, textureKey);
  img.setOrigin(0.5, 1);
  const displayW = (img.width / img.height) * height;
  img.setDisplaySize(displayW, height);

  const shadow = scene.add.ellipse(0, 10, displayW * 0.4, 14, palette.shadow, 0.14);
  wrap.add(shadow);
  wrap.add(img);

  if (sign) {
    wrap.add(makeSign(scene, sign, 0, -height + signLift + 8));
  }
  return wrap;
}

export function createTree(
  scene: Phaser.Scene,
  x: number,
  groundY: number,
  _variant: "round" | "tall" | "bloom" = "round",
  scale = 1
) {
  return placeProp(scene, "pixar-tree", x, groundY, 210 * scale);
}

export const createHouse = (s: Phaser.Scene, x: number, y: number) =>
  placeLandmark(s, "pixar-house", x, y, 268);

function animateCouple(scene: Phaser.Scene, img: Phaser.GameObjects.Image) {
  if (scene.game.registry.get("reducedMotion")) return;

  const idle = scene.textures.exists("pixar-couple") ? "pixar-couple" : "raw-couple";
  const blink = scene.textures.exists("pixar-couple-blink")
    ? "pixar-couple-blink"
    : scene.textures.exists("raw-couple-blink")
      ? "raw-couple-blink"
      : idle;
  const wave = scene.textures.exists("pixar-couple-wave")
    ? "pixar-couple-wave"
    : scene.textures.exists("raw-couple-wave")
      ? "raw-couple-wave"
      : idle;

  let waving = false;
  const show = (key: string) => {
    if (!img.active || !scene.textures.exists(key)) return;
    const w = img.displayWidth;
    const h = img.displayHeight;
    img.setTexture(key);
    img.setDisplaySize(w, h);
  };

  const blinkOnce = () => {
    if (!img.active || waving) return;
    show(blink);
    scene.time.delayedCall(130, () => {
      if (!waving) show(idle);
    });
  };

  const loopBlink = () => {
    if (!img.active) return;
    scene.time.delayedCall(2400 + Math.random() * 1600, () => {
      blinkOnce();
      if (Math.random() > 0.7) scene.time.delayedCall(260, blinkOnce);
      loopBlink();
    });
  };

  const loopWave = () => {
    if (!img.active) return;
    scene.time.delayedCall(5200 + Math.random() * 2200, () => {
      if (!img.active) return;
      waving = true;
      show(wave);
      scene.time.delayedCall(1200, () => {
        waving = false;
        show(idle);
        loopWave();
      });
    });
  };

  scene.tweens.add({
    targets: img,
    y: img.y - 4,
    duration: 2600,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut",
  });

  loopBlink();
  loopWave();
}

export function createCouple(s: Phaser.Scene, x: number, y: number) {
  const wrap = placeLandmark(s, "pixar-couple", x, y, 240);
  const img = wrap.list.find((child) => child instanceof Phaser.GameObjects.Image) as
    | Phaser.GameObjects.Image
    | undefined;
  if (img) animateCouple(s, img);
  return wrap;
}
export const createStoryGarden = (s: Phaser.Scene, x: number, y: number) =>
  placeLandmark(s, "pixar-story", x, y, 250);
export const createMosque = (s: Phaser.Scene, x: number, y: number) =>
  placeLandmark(s, "pixar-mosque", x, y, 300);
export const createVenue = (s: Phaser.Scene, x: number, y: number) =>
  placeLandmark(s, "pixar-venue", x, y, 270);
export const createClockTower = (s: Phaser.Scene, x: number, y: number) =>
  placeProp(s, "pixar-clock", x, y, 250);
export const createGalleryWall = (s: Phaser.Scene, x: number, y: number) =>
  placeProp(s, "pixar-gallery", x, y, 220);
export const createMailbox = (s: Phaser.Scene, x: number, y: number) =>
  placeProp(s, "pixar-mailbox", x, y, 200);
export const createGift = (s: Phaser.Scene, x: number, y: number) =>
  placeProp(s, "pixar-gift", x, y, 150);
export const createFinale = (s: Phaser.Scene, x: number, y: number) =>
  placeProp(s, "pixar-finale", x, y, 320);
