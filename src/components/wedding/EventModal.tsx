"use client";

import { wedding } from "@/data/wedding";
import ModalShell from "@/components/modal/ModalShell";
import { downloadIcs, eventTimes } from "@/lib/calendar";

export default function EventModal({ eventId, onClose }: { eventId?: string; onClose: () => void }) {
  const event = wedding.events.find((item) => item.id === eventId) ?? wedding.events[0];
  const times = eventTimes(event.id);

  return (
    <ModalShell title={event.title} onClose={onClose}>
      <div className="space-y-3 text-center">
        <p className="font-display text-xl">{event.date}</p>
        <p className="text-[var(--brown)]">{event.time}</p>
        <div className="ornament mx-auto h-5 w-24" />
        <p className="font-medium">{event.venue}</p>
        <p className="text-sm text-[var(--teal)]">{event.address}</p>
        {event.dressCode ? <p className="text-sm">Dress code: {event.dressCode}</p> : null}
        {event.notes ? <p className="text-sm italic">{event.notes}</p> : null}
        <div className="flex flex-col gap-2 pt-2">
          <a
            href={event.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[var(--ink)] px-4 py-3 text-sm text-[var(--ivory)]"
          >
            Lihat Lokasi
          </a>
          <button
            type="button"
            className="rounded-full border border-[var(--gold)] px-4 py-3 text-sm"
            onClick={() =>
              downloadIcs({
                title: `${event.title} — ${wedding.names.display}`,
                description: event.notes || event.title,
                location: `${event.venue}, ${event.address}`,
                start: times.start,
                end: times.end,
              })
            }
          >
            Tambahkan ke Kalender
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
