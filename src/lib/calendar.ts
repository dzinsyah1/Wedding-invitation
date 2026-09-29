export interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  start: Date;
  end: Date;
}

const stamp = (date: Date) =>
  date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");

// RFC 5545 text escaping.
const icsText = (value: string) => value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");

function buildIcs(options: CalendarEvent) {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Dzin Titin Wedding//ID",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${stamp(options.start)}-${options.title.replace(/\W+/g, "").toLowerCase()}@dzin-titin`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(options.start)}`,
    `DTEND:${stamp(options.end)}`,
    `SUMMARY:${icsText(options.title)}`,
    `DESCRIPTION:${icsText(options.description)}`,
    `LOCATION:${icsText(options.location)}`,
    // Reminders: the day before and two hours before.
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsText(options.title)}`,
    "TRIGGER:-P1D",
    "END:VALARM",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsText(options.title)}`,
    "TRIGGER:-PT2H",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcs(options: CalendarEvent) {
  const blob = new Blob([buildIcs(options)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${options.title.replace(/\s+/g, "-").toLowerCase()}.ics`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function googleCalendarUrl(options: CalendarEvent) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: options.title,
    dates: `${stamp(options.start)}/${stamp(options.end)}`,
    details: options.description,
    location: options.location,
    ctz: "Asia/Jakarta",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function isApple() {
  const ua = navigator.userAgent;
  const ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const macSafari = /Macintosh/.test(ua) && /Safari/.test(ua) && !/Chrome|Chromium|Edg|Firefox/.test(ua);
  return ios || macSafari;
}

/**
 * Opens the device's own "add event" screen so the guest only has to tap Save:
 * Apple devices get the native Calendar sheet (.ics), everyone else (Android,
 * Windows, Chrome) gets Google Calendar with the event pre-filled.
 * Returns which route was used.
 */
export function saveToCalendar(options: CalendarEvent): "apple" | "google" {
  if (isApple()) {
    // Navigating (not downloading) makes iOS/macOS Safari show "Add to Calendar".
    window.location.href = `data:text/calendar;charset=utf-8,${encodeURIComponent(buildIcs(options))}`;
    return "apple";
  }
  window.open(googleCalendarUrl(options), "_blank", "noopener");
  return "google";
}

export function eventTimes(id: string) {
  if (id === "akad") {
    return {
      start: new Date("2026-11-21T08:00:00+07:00"),
      end: new Date("2026-11-21T09:30:00+07:00"),
    };
  }
  return {
    // Reception runs "until done"; calendars need an end, so block the afternoon.
    start: new Date("2026-11-21T12:00:00+07:00"),
    end: new Date("2026-11-21T18:00:00+07:00"),
  };
}
