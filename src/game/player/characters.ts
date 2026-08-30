export type PlayerCharacterId = "male" | "female";

export interface PlayerCharacter {
  id: PlayerCharacterId;
  label: string;
  subtitle: string;
  hint: string;
  idle: string;
  walk: readonly [string, string];
  jump: string;
  frames: readonly { dest: string; file: string }[];
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
    frames: [
      { dest: "player-female-idle", file: "player-female-idle.png" },
      { dest: "player-female-walk-a", file: "player-female-walk-a.png" },
      { dest: "player-female-walk-b", file: "player-female-walk-b.png" },
      { dest: "player-female-jump", file: "player-female-jump.png" },
    ],
  },
};

export const PLAYER_CHARACTER_LIST = Object.values(PLAYER_CHARACTERS);

export function isPlayerCharacterId(value: unknown): value is PlayerCharacterId {
  return value === "male" || value === "female";
}
