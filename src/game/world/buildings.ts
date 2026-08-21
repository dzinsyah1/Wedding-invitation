import * as Phaser from "phaser";
import { blob, gfx, round } from "@/game/world/paint";
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
    color: "#2b4a6f",
    fontStyle: "bold",
  });
  label.setOrigin(0.5);
  wrap.add(label);
  return wrap;
}

function plantSkirt(scene: Phaser.Scene, width: number, front: boolean) {
  const g = gfx(scene);
  const y = front ? 16 : 11;
  const w = width;
  blob(g, 0, y, w * (front ? 0.72 : 0.95), front ? 18 : 28, palette.grass, front ? 0.92 : 0.96);
  blob(g, -w * 0.22, y + 2, w * 0.42, 16, palette.grassDark, 0.78);
  blob(g, w * 0.2, y + 1, w * 0.38, 15, palette.grassLight, 0.7);
  blob(g, -w * 0.08, y + 3, 36, 12, palette.hillFront, 0.55);
  return g;
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

  const img = scene.add.image(0, 0, textureKey);
  img.setOrigin(0.5, 1);
  const displayW = (img.width / img.height) * height;
  img.setDisplaySize(displayW, height);
  img.y = 18;

  const shadow = scene.add.ellipse(0, 12, displayW * 0.62, 20, palette.shadow, 0.22);
  wrap.add(shadow);
  wrap.add(plantSkirt(scene, displayW, false));
  wrap.add(img);
  wrap.add(plantSkirt(scene, displayW * 0.82, true));

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

  const skirt = gfx(scene);
  blob(skirt, 0, 12, displayW * 0.48, 14, palette.grass, 0.7);
  blob(skirt, -displayW * 0.14, 13, 38, 11, palette.grassDark, 0.45);
  blob(skirt, displayW * 0.12, 13, 34, 10, palette.grassLight, 0.42);
  wrap.add(skirt);

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
  placeLandmark(s, "pixar-house", x, y, 300, "Welcome Home");

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
  const wrap = placeLandmark(s, "pixar-couple", x, y, 280, "Meet The Couple", 22);
  const img = wrap.list.find((child) => child instanceof Phaser.GameObjects.Image) as
    | Phaser.GameObjects.Image
    | undefined;
  if (img) animateCouple(s, img);
  return wrap;
}
export const createStoryGarden = (s: Phaser.Scene, x: number, y: number) =>
  placeProp(s, "pixar-story", x, y, 320, "Our Story");
export const createMosque = (s: Phaser.Scene, x: number, y: number) =>
  placeLandmark(s, "pixar-mosque", x, y, 340, "Akad Nikah", 14);
export const createVenue = (s: Phaser.Scene, x: number, y: number) =>
  placeLandmark(s, "pixar-venue", x, y, 280, "Wedding Reception", 16);
export const createClockTower = (s: Phaser.Scene, x: number, y: number) =>
  placeProp(s, "pixar-clock", x, y, 360, "The Big Day");
export const createGalleryWall = (s: Phaser.Scene, x: number, y: number) =>
  placeProp(s, "pixar-gallery", x, y, 250, "Our Memories");
export const createMailbox = (s: Phaser.Scene, x: number, y: number) =>
  placeProp(s, "pixar-mailbox", x, y, 230, "RSVP Here");
export const createGift = (s: Phaser.Scene, x: number, y: number) =>
  placeProp(s, "pixar-gift", x, y, 220, "Wedding Gift");
export const createFinale = (s: Phaser.Scene, x: number, y: number) =>
  placeProp(s, "pixar-finale", x, y, 380);
