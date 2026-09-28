import type { ChromaKind } from "@/game/world/chroma";
import { PLAYER_CHARACTER_LIST } from "@/game/player/characters";

export type QualityTier = "high" | "medium" | "low";

export type ChromaAsset = {
  key: string;
  file: string;
  mode: "blue" | "warm";
  kind: ChromaKind;
  minTier: QualityTier;
};

const RANK: Record<QualityTier, number> = { low: 0, medium: 1, high: 2 };

export function tierAtLeast(current: QualityTier, min: QualityTier) {
  return RANK[current] >= RANK[min];
}

/** Only textures the garden actually draws — village leftovers stay off the network. */
export const CHROMA_ASSETS: ChromaAsset[] = [
  { key: "house", file: "pixar-house.png", mode: "blue", kind: "cutout", minTier: "low" },
  { key: "mosque", file: "pixar-mosque.png", mode: "blue", kind: "cutout", minTier: "low" },
  { key: "venue", file: "pixar-venue.png", mode: "blue", kind: "cutout", minTier: "low" },
  { key: "couple", file: "pixar-couple.png", mode: "blue", kind: "frame", minTier: "low" },
  { key: "clock", file: "pixar-clock.png", mode: "blue", kind: "cutout", minTier: "low" },
  { key: "mailbox", file: "pixar-mailbox.png", mode: "blue", kind: "cutout", minTier: "low" },
  { key: "gift", file: "pixar-gift.png", mode: "blue", kind: "cutout", minTier: "low" },
  { key: "story", file: "pixar-story.png", mode: "blue", kind: "cutout", minTier: "low" },
  { key: "gallery", file: "pixar-gallery.png", mode: "blue", kind: "cutout", minTier: "low" },
  { key: "finale", file: "pixar-finale-clean.png", mode: "blue", kind: "cutout", minTier: "low" },
  { key: "leaf-wall", file: "pixar-leaf-wall.png", mode: "blue", kind: "cutout", minTier: "low" },
  { key: "garden-tree", file: "pixar-garden-tree.png", mode: "blue", kind: "cutout", minTier: "low" },
  { key: "mixed-cluster", file: "pixar-mixed-cluster.png", mode: "blue", kind: "cutout", minTier: "low" },
  { key: "white-roses", file: "pixar-white-roses.png", mode: "blue", kind: "cutout", minTier: "low" },
  { key: "garden-lantern", file: "pixar-garden-lantern.png", mode: "blue", kind: "cutout", minTier: "low" },
  { key: "bush", file: "pixar-bush.png", mode: "blue", kind: "plant", minTier: "low" },
  { key: "couple-blink", file: "pixar-couple-blink.png", mode: "blue", kind: "frame", minTier: "medium" },
  { key: "couple-wave", file: "pixar-couple-wave.png", mode: "blue", kind: "frame", minTier: "medium" },
  { key: "treeline", file: "pixar-treeline.png", mode: "warm", kind: "cutout", minTier: "medium" },
  { key: "garden-clouds", file: "pixar-garden-clouds.png", mode: "blue", kind: "cutout", minTier: "medium" },
  { key: "leaf-shrub", file: "pixar-leaf-shrub.png", mode: "blue", kind: "cutout", minTier: "medium" },
  { key: "tall-blooms", file: "pixar-tall-blooms.png", mode: "blue", kind: "cutout", minTier: "medium" },
  { key: "low-blooms", file: "pixar-low-blooms.png", mode: "blue", kind: "cutout", minTier: "medium" },
  { key: "rose-arch", file: "pixar-rose-arch.png", mode: "blue", kind: "cutout", minTier: "medium" },
  { key: "hang-vines", file: "pixar-hang-vines.png", mode: "warm", kind: "cutout", minTier: "medium" },
  { key: "blossom-canopy", file: "pixar-blossom-canopy.png", mode: "blue", kind: "cutout", minTier: "medium" },
  { key: "bird", file: "pixar-bird-sm.png", mode: "blue", kind: "cutout", minTier: "medium" },
  { key: "butterfly", file: "pixar-butterfly-sm.png", mode: "blue", kind: "cutout", minTier: "medium" },
  { key: "dove-fly-a", file: "pixar-dove-fly-a-sm.png", mode: "blue", kind: "cutout", minTier: "medium" },
  { key: "dove-fly-b", file: "pixar-dove-fly-b-sm.png", mode: "blue", kind: "cutout", minTier: "medium" },
  { key: "dove-idle", file: "pixar-dove-idle-sm.png", mode: "blue", kind: "cutout", minTier: "medium" },
];

export const PLAYER_FRAMES = PLAYER_CHARACTER_LIST.flatMap((character) =>
  character.frames.map((frame) => ({
    raw: `raw-${frame.dest}`,
    dest: frame.dest,
    file: frame.file,
  }))
);

export type DeviceClass = "phone" | "tablet" | "desktop";

export function detectDevice(): DeviceClass {
  if (typeof window === "undefined") return "desktop";
  const ua = navigator.userAgent;
  const ipad =
    /iPad/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const minSide = Math.min(window.innerWidth, window.innerHeight);
  const maxSide = Math.max(window.innerWidth, window.innerHeight);
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (ipad || (coarse && minSide >= 600 && maxSide >= 900)) return "tablet";
  if (coarse || window.innerWidth < 768 || /Android|iPhone|iPod/i.test(ua)) return "phone";
  return "desktop";
}

export function detectQuality(reducedMotion = false): QualityTier {
  if (typeof window === "undefined") return "medium";
  if (reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "low";
  }

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  const connection = nav.connection;
  if (connection?.saveData) return "low";
  if (connection?.effectiveType === "2g" || connection?.effectiveType === "slow-2g") return "low";

  const device = detectDevice();
  const memory = nav.deviceMemory;

  if (device === "tablet") return memory !== undefined && memory <= 2 ? "medium" : "high";
  if (memory !== undefined && memory <= 2) return "low";
  if (device === "phone") return "medium";
  if (memory !== undefined && memory <= 4) return "medium";
  return "high";
}

export function qualitySettings(tier: QualityTier) {
  return {
    tier,
    fps: tier === "low" ? 30 : 60,
    antialias: true,
    canvasRenderer: false,
    overlap: tier === "low" ? 0.12 : tier === "medium" ? 0.2 : 0.28,
    scatterMul: tier === "low" ? 1.85 : tier === "medium" ? 1.35 : 1,
    sway: tier === "high",
    canopy: tier !== "low",
    distantGarden: tier !== "low",
    lanterns: tier !== "low",
    fairyLights: tier === "high",
    arches: tier !== "low",
    flowerScatter: tier !== "low",
    foregroundMix: tier !== "low",
    clouds: tier !== "low",
    petals: tier !== "low",
    butterflies: tier !== "low",
    doves: tier !== "low",
    birds: tier !== "low",
    lighting: tier !== "low",
    groundDetail: tier === "high",
  };
}

export type QualitySettings = ReturnType<typeof qualitySettings>;

export function cutAssetUrl(file: string) {
  return `/images/pixar/cut/${file}?v=opt3`;
}

export function cutPlayerUrl(file: string) {
  return `/images/cut/${file}?v=char6`;
}
