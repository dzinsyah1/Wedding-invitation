export type PlayerCharacterId = "male" | "female";

export interface PlayerCharacter {
  id: PlayerCharacterId;
  label: string;
  subtitle: string;
  hint: string;
  idle: string;
  walk: readonly [string, string];
  jump: string;
  gait: Gait;
  frames: readonly { dest: string; file: string }[];
}

export interface Gait {
  /** Use the feet-together idle drawing as the passing pose between strides. */
  passing: boolean;
  /** Seconds to crossfade between walk drawings (0 = hard swap). */
  blend: number;
  /** Step duration at slow and full speed, in seconds. */
  step: readonly [number, number];
  /** Vertical bob at slow and full speed, in pixels. */
  bob: readonly [number, number];
}

export const PLAYER_CHARACTERS: Record<PlayerCharacterId, PlayerCharacter> = {
  male: {
    id: "male",
    label: "Pria",
    subtitle: "Blangkon",
    hint: "Tamu berbeskap",
    idle: "player-idle",
    walk: ["player-walk-a", "player-walk-b"],
    jump: "player-jump",
    gait: { passing: true, blend: 0, step: [0.36, 0.26], bob: [1.2, 2.6] },
    frames: [
      { dest: "player-idle", file: "player-idle.png" },
      { dest: "player-walk-a", file: "player-walk-a.png" },
      { dest: "player-walk-b", file: "player-walk-b.png" },
      { dest: "player-jump", file: "player-jump.png" },
    ],
  },
  female: {
    id: "female",
    label: "Wanita",
    subtitle: "Kebaya",
    hint: "Tamu berkebaya",
    idle: "player-female-idle",
    walk: ["player-female-walk-a", "player-female-walk-b"],
    jump: "player-female-jump",
    // Her idle drawing differs from the strides (frontal body, arms down), so it
    // can't double as a passing pose; instead the two strides crossfade, which
    // reads as a smooth arm swing. Shorter, softer steps suit kebaya + jarik.
    gait: { passing: false, blend: 0.13, step: [0.32, 0.25], bob: [0.8, 1.7] },
    frames: [
      // *-fix files carry the walk head so the face and hair pins match every frame
      // (see scripts/fix-female-head.mjs).
      { dest: "player-female-idle", file: "player-female-idle-fix.png" },
      { dest: "player-female-walk-a", file: "player-female-walk-a.png" },
      { dest: "player-female-walk-b", file: "player-female-walk-b.png" },
      { dest: "player-female-jump", file: "player-female-jump-fix.png" },
    ],
  },
};

export const PLAYER_CHARACTER_LIST = Object.values(PLAYER_CHARACTERS);

export function isPlayerCharacterId(value: unknown): value is PlayerCharacterId {
  return value === "male" || value === "female";
}
