/** Query params accepted for the guest name, e.g. ?to=Budi%20Santoso */
const PARAMS = ["to", "kepada", "untuk", "guest"];
const MAX_LENGTH = 60;

/**
 * Reads the guest's name from the URL and tidies it for display:
 * decodes `+`/`_` as spaces, strips markup and stray symbols, collapses
 * whitespace, caps the length, and title-cases names typed all lower/upper case.
 */
export function readGuestName(search: string): string {
  const params = new URLSearchParams(search);
  const raw = PARAMS.map((key) => params.get(key)).find((v) => v && v.trim()) ?? "";
  return tidyGuestName(raw);
}

export function tidyGuestName(raw: string): string {
  let name = raw
    .replace(/[+_]/g, " ")
    .replace(/<[^>]*>/g, "")
    // Letters (any script), digits, spaces and common name punctuation only.
    .replace(/[^\p{L}\p{M}\p{N} .,'&()/-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_LENGTH)
    .trim();
  if (name && (name === name.toLowerCase() || name === name.toUpperCase())) {
    name = name.toLowerCase().replace(/(^|[\s(/-])(\p{L})/gu, (_, sep: string, ch: string) => sep + ch.toUpperCase());
  }
  return name;
}

/** Shareable invitation link for one guest. */
export function guestLink(origin: string, name: string): string {
  const url = new URL(origin);
  url.search = "";
  url.hash = "";
  const clean = tidyGuestName(name);
  if (clean) url.searchParams.set("to", clean);
  return url.toString();
}
