"use client";

import { wedding } from "@/data/wedding";
import { downloadIcs, eventTimes } from "@/lib/calendar";

export default function FallbackInvitation({
  guestName,
  onBack,
}: {
  guestName: string;
  onBack?: () => void;
}) {
  return (
    <div className="absolute inset-0 z-50 overflow-y-auto bg-[var(--cream)] px-5 py-8">
      <div className="mx-auto max-w-lg pb-16 text-center">
        {onBack ? (
          <button type="button" className="mb-6 text-sm text-[var(--teal)]" onClick={onBack}>
            ← Kembali ke dunia
          </button>
        ) : null}
        <p className="text-sm tracking-[0.3em] text-[var(--gold)]">THE WEDDING OF</p>
        {guestName ? (
          <p className="mt-4 text-sm">
            Kepada Yth. <strong>{guestName}</strong>
          </p>
        ) : null}
        <h1 className="font-display mt-4 text-5xl">{wedding.names.display}</h1>
        <p className="mt-2 tracking-[0.25em]">{wedding.dateDisplay}</p>
        <p className="mt-6 text-sm leading-7">{wedding.welcome.message}</p>

        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          {[wedding.couple.groom, wedding.couple.bride].map((person) => (
            <article key={person.fullName} className="paper-card rounded-2xl p-4">
              <img src={person.photo} alt={person.fullName} className="mx-auto h-40 w-32 rounded-2xl object-cover" />
              <h2 className="font-display mt-3 text-2xl">{person.fullName}</h2>
              <p className="text-xs text-[var(--teal)]">{person.parents}</p>
            </article>
          ))}
        </section>

        {wedding.events.map((event) => {
          const times = eventTimes(event.id);
          return (
            <section key={event.id} className="paper-card mt-6 rounded-2xl p-5">
              <h2 className="font-display text-2xl">{event.title}</h2>
              <p className="mt-2">{event.date}</p>
              <p>{event.time}</p>
              <p className="mt-2 text-sm">
                {event.venue}
                <br />
                {event.address}
              </p>
              <div className="mt-3 flex justify-center gap-3 text-sm">
                <a href={event.mapUrl} target="_blank" rel="noreferrer" className="underline">
                  Lihat Lokasi
                </a>
                <button
                  type="button"
                  className="underline"
                  onClick={() =>
                    downloadIcs({
                      title: event.title,
                      description: event.notes || event.title,
                      location: event.address,
                      start: times.start,
                      end: times.end,
                    })
                  }
                >
                  Kalender
                </button>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
