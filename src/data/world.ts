import type { WorldConfig, WorldLocation } from "@/types/wedding";

const LOCATION_SPACING = 720;
const START_X = 420;
const END_PADDING = 980;

const locationBlueprint: Omit<WorldLocation, "x">[] = [
  {
    id: "home",
    enabled: true,
    width: 420,
    interaction: { label: "Buka Undangan", type: "welcome" },
    navigation: { icon: "home", label: "Home" },
  },
  {
    id: "couple",
    enabled: true,
    width: 380,
    interaction: { label: "Kenali Kami", type: "couple" },
    navigation: { icon: "couple", label: "Couple" },
  },
  {
    id: "story",
    enabled: true,
    width: 380,
    interaction: { label: "Baca Kisah Kami", type: "story" },
    navigation: { icon: "story", label: "Our Story" },
  },
  {
    id: "akad",
    enabled: true,
    width: 420,
    interaction: {
      label: "Lihat Detail Akad",
      type: "event",
      eventId: "akad",
    },
    navigation: { icon: "mosque", label: "Akad" },
  },
  {
    id: "reception",
    enabled: true,
    width: 420,
    interaction: {
      label: "Lihat Detail Resepsi",
      type: "event",
      eventId: "reception",
    },
    navigation: { icon: "venue", label: "Reception" },
  },
  {
    id: "countdown",
    enabled: true,
    width: 360,
    interaction: { label: "Hitung Hari Bahagia", type: "countdown" },
    navigation: { icon: "clock", label: "Countdown" },
  },
  {
    id: "gallery",
    enabled: true,
    width: 400,
    interaction: { label: "Lihat Kenangan", type: "gallery" },
    navigation: { icon: "gallery", label: "Gallery" },
  },
  {
    id: "rsvp",
    enabled: true,
    width: 320,
    interaction: { label: "Konfirmasi Kehadiran", type: "rsvp" },
    navigation: { icon: "mail", label: "RSVP" },
  },
  {
    id: "gift",
    enabled: true,
    width: 320,
    interaction: { label: "Wedding Gift", type: "gift" },
    navigation: { icon: "gift", label: "Wedding Gift" },
  },
  {
    id: "thanks",
    enabled: true,
    width: 480,
    interaction: { label: "Pesan Terakhir", type: "thanks" },
    navigation: { icon: "heart", label: "Thank You" },
  },
];

export function buildWorldConfig(): WorldConfig {
  const enabled = locationBlueprint.filter((item) => item.enabled);
  const locations: WorldLocation[] = enabled.map((item, index) => ({
    ...item,
    x: START_X + index * LOCATION_SPACING,
  }));

  const last = locations[locations.length - 1];
  const width = (last ? last.x + last.width / 2 : START_X) + END_PADDING;
  const height = 720;
  const groundY = 562;

  return {
    width,
    height,
    groundY,
    playerStart: { x: locations[0]?.x ?? START_X, y: groundY },
    parallax: {
      clouds: 0.1,
      mountains: 0.25,
      hills: 0.45,
      buildings: 0.7,
      player: 1,
      foreground: 1.15,
    },
    ambient: {
      birds: true,
      butterflies: true,
      leaves: true,
      fireflies: true,
    },
    locations,
  };
}

export const world = buildWorldConfig();
