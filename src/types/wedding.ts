export type InteractionType =
  | "welcome"
  | "couple"
  | "story"
  | "event"
  | "countdown"
  | "gallery"
  | "rsvp"
  | "gift"
  | "thanks";

export interface Person {
  fullName: string;
  nickname: string;
  photo: string;
  /** Real photo shown in the full (non-game) invitation. */
  portrait?: string;
  parents: string;
  title: string;
}

export interface EventData {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  mapUrl: string;
  /** Exact map pin; used for the embedded map instead of a text search. */
  coords?: { lat: number; lng: number };
  notes?: string;
  dressCode?: string;
}

export interface StoryChapter {
  id: string;
  /** Optional date label; chapters without one show their number. */
  year?: string;
  title: string;
  description: string;
  image?: string;
  /** CSS object-position for the photo crop, e.g. "50% 40%". */
  focus?: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  caption: string;
}

export interface BankAccount {
  bank: string;
  /** Digits only; displayed grouped, copied as-is. */
  number: string;
  holder: string;
  /** Whose account it is, e.g. "Mempelai Pria". */
  owner?: string;
}

export interface EWallet {
  name: string;
  number: string;
  holder: string;
}

export interface GiftData {
  message: string;
  banks: BankAccount[];
  ewallets?: EWallet[];
  address?: string;
}

export interface RSVPConfig {
  enabled: boolean;
  maxGuests: number;
}

export interface MusicConfig {
  title: string;
  enabledByDefault: boolean;
}

export interface CountdownData {
  targetDate: string;
  timezone: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  colors: {
    cream: string;
    sage: string;
    teal: string;
    brown: string;
    gold: string;
    ivory: string;
    rose: string;
    ink: string;
  };
}

export interface WorldLocation {
  id: string;
  enabled: boolean;
  x: number;
  width: number;
  promptLift: number;
  interaction: {
    label: string;
    type: InteractionType;
    eventId?: string;
  };
  navigation: {
    icon: string;
    label: string;
  };
}

export interface ScriptureQuote {
  arabic: string;
  translation: string;
  source: string;
}

export interface ParallaxConfig {
  clouds: number;
  mountains: number;
  hills: number;
  buildings: number;
  player: number;
  foreground: number;
}

export interface AmbientConfig {
  birds: boolean;
  butterflies: boolean;
  leaves: boolean;
  fireflies: boolean;
}

export interface WorldConfig {
  width: number;
  height: number;
  groundY: number;
  playerStart: { x: number; y: number };
  parallax: ParallaxConfig;
  ambient: AmbientConfig;
  locations: WorldLocation[];
}

export interface WeddingData {
  slug: string;
  names: {
    display: string;
    groom: string;
    bride: string;
  };
  dateDisplay: string;
  tagline: string;
  welcome: {
    bismillah: string;
    greeting: string;
    message: string;
    doa: string;
  };
  couple: {
    groom: Person;
    bride: Person;
  };
  events: EventData[];
  story: StoryChapter[];
  gallery: GalleryItem[];
  /** Real photos for the full invitation page. */
  album: GalleryItem[];
  quran: ScriptureQuote;
  prayer: ScriptureQuote;
  closing: {
    message: string;
    salam: string;
  };
  countdown: CountdownData;
  rsvp: RSVPConfig;
  gift: GiftData;
  music: MusicConfig;
  world: WorldConfig;
  theme: ThemeConfig;
}

export interface RSVPPayload {
  name: string;
  attendance: "yes" | "no" | "maybe";
  guests: number;
  message: string;
}
