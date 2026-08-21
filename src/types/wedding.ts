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
  notes?: string;
  dressCode?: string;
}

export interface StoryChapter {
  id: string;
  year: string;
  title: string;
  description: string;
  image?: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  caption: string;
}

export interface BankAccount {
  bank: string;
  number: string;
  holder: string;
}

export interface EWallet {
  name: string;
  number: string;
  holder: string;
}

export interface GiftData {
  message: string;
  banks: BankAccount[];
  ewallets: EWallet[];
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
