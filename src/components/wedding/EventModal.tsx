"use client";

import { wedding } from "@/data/wedding";
import ModalShell from "@/components/modal/ModalShell";
import { eventTimes, saveToCalendar } from "@/lib/calendar";
import { track } from "@/lib/analytics";

// "Sabtu, 21 November 2026" -> { weekday: "Sabtu", day: "21", month: "November", year: "2026" }
function splitDate(date: string) {
  const [weekday = "", rest = ""] = date.split(",").map((s) => s.trim());
  const [day = "", month = "", year = ""] = rest.split(/\s+/);
  return { weekday, day, month, year };
}

export default function EventModal({ eventId, onClose }: { eventId?: string; onClose: () => void }) {
  const event = wedding.events.find((item) => item.id === eventId) ?? wedding.events[0];
  const times = eventTimes(event.id);
  const { weekday, day, month, year } = splitDate(event.date);
  const query = event.coords
    ? `${event.coords.lat},${event.coords.lng}`
    : encodeURIComponent(`${event.venue}, ${event.address}`);

  function saveCalendar() {
    const via = saveToCalendar({
      title: `${event.title} — ${wedding.names.display}`,
      description: [event.notes, `Petunjuk arah: ${event.mapUrl}`].filter(Boolean).join("\n\n"),
      location: `${event.venue}, ${event.address}`,
      start: times.start,
      end: times.end,
    });
    track("calendar_saved", { eventId: event.id, via });
  }

  return (
    <ModalShell title={event.title} onClose={onClose}>
      {/* Date plate: the one detail guests must not miss. */}
      <div className="event-date relative overflow-hidden rounded-[22px] px-4 py-4 text-center">
        <span className="event-date-shine pointer-events-none absolute inset-0" aria-hidden="true" />
        <p className="text-[11px] font-semibold tracking-[0.34em] text-[#f6dfa6] uppercase">Save the Date</p>
        <div className="mt-2 flex items-center justify-center gap-4 text-[#fff8ea]">
          <span className="w-[72px] text-right text-[13px] tracking-[0.16em] uppercase">{weekday}</span>
          <span className="font-display border-x border-[#f6dfa6]/50 px-4 text-[52px] leading-none font-semibold">{day}</span>
          <span className="w-[72px] text-left text-[12px] leading-tight tracking-[0.06em] uppercase">
            {month}
            <br />
            {year}
          </span>
        </div>
        <p className="mx-auto mt-3 inline-flex items-center gap-2 rounded-full bg-[#fff8ea] px-4 py-1.5 text-[14px] font-semibold text-[#4f3c29]">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#c4a35a]" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
            <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          {event.time}
        </p>
      </div>

      <div className="mt-5 text-center">
        <p className="text-[10px] font-semibold tracking-[0.3em] text-[#c4a35a] uppercase">Lokasi</p>
        <p className="font-display mt-1 text-[21px] font-semibold text-[#3d4a3f]">{event.venue}</p>
        <p className="mt-1 text-[13px] leading-relaxed text-[#6a9e8a]">{event.address}</p>
      </div>

      <div className="mt-4 overflow-hidden rounded-[20px] shadow-[0_10px_26px_rgba(80,60,30,0.14)] ring-1 ring-[#d4af5a]/45">
        <iframe
          title={`Peta lokasi ${event.title}`}
          src={`https://maps.google.com/maps?q=${query}&z=17&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-48 w-full border-0 grayscale-[30%] sepia-[18%] sm:h-56"
        />
      </div>

      {event.dressCode || event.notes ? (
        <div className="mt-4 space-y-1 text-center text-[12.5px] text-[#6b5339]">
          {event.dressCode ? <p>Dress code: {event.dressCode}</p> : null}
          {event.notes ? <p className="italic">{event.notes}</p> : null}
        </div>
      ) : null}

      <div className="mt-5 grid grid-cols-2 gap-2">
        <a
          href={event.mapUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => track("map_opened", { eventId: event.id })}
          className="flex items-center justify-center rounded-full bg-[var(--ink)] py-3 text-[13px] text-[var(--ivory)] transition hover:bg-[var(--brown)]"
        >
          Petunjuk Arah
        </a>
        <button
          type="button"
          onClick={saveCalendar}
          className="rounded-full border border-[var(--gold)] py-3 text-[13px] text-[#4a3d32] transition hover:bg-[#f3e6c8]/70"
        >
          Simpan Tanggal
        </button>
      </div>
    </ModalShell>
  );
}
