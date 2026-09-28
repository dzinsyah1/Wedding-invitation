export function downloadIcs(options: {
  title: string;
  description: string;
  location: string;
  start: Date;
  end: Date;
}) {
  const stamp = (date: Date) =>
    date
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Dzin Titin Wedding//ID",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(options.start)}`,
    `DTEND:${stamp(options.end)}`,
    `SUMMARY:${options.title}`,
    `DESCRIPTION:${options.description}`,
    `LOCATION:${options.location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${options.title.replace(/\s+/g, "-").toLowerCase()}.ics`;
  link.click();
  URL.revokeObjectURL(url);
}

export function eventTimes(id: string) {
  if (id === "akad") {
    return {
      start: new Date("2026-11-21T09:00:00+07:00"),
      end: new Date("2026-11-21T10:30:00+07:00"),
    };
  }
  return {
    start: new Date("2026-11-21T11:00:00+07:00"),
    end: new Date("2026-11-21T14:00:00+07:00"),
  };
}
