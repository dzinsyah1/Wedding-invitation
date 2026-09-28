"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { wedding } from "@/data/wedding";
import { downloadIcs, eventTimes } from "@/lib/calendar";
import { track } from "@/lib/analytics";
import Flourish, { CornerOrnaments } from "@/components/ui/Flourish";
import RsvpForm from "@/components/wedding/RsvpForm";
import GuestCard from "@/components/ui/GuestCard";
import GiftAccounts from "@/components/wedding/GiftAccounts";
import { AlbumGrid } from "@/components/ui/PhotoAlbum";
import type { EventData, Person } from "@/types/wedding";

const NAV = [
  { id: "mempelai", icon: "♡", label: "Mempelai" },
  { id: "acara", icon: "✦", label: "Acara" },
  { id: "galeri", icon: "▣", label: "Galeri" },
  { id: "rsvp", icon: "✉", label: "RSVP" },
  { id: "hadiah", icon: "❊", label: "Hadiah" },
];

// Photo paths contain spaces ("photo album/...").
const asset = (src: string) => encodeURI(src);

const family = (parents: string) => parents.replace(/^Putr[ai] dari /, "Keluarga ");

export default function FullInvitation({
  guestName,
  musicOn,
  onToggleMusic,
  onBack,
  backLabel = "Kembali",
  onExplore,
}: {
  guestName: string;
  musicOn: boolean;
  onToggleMusic: () => void;
  onBack?: () => void;
  backLabel?: string;
  onExplore?: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    track("full_invitation_opened");
  }, []);

  // Reveal-on-scroll and scrollspy for the bottom nav.
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const reveal = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            reveal.unobserve(entry.target);
          }
        }),
      { root, threshold: 0.12 }
    );
    root.querySelectorAll(".reveal").forEach((el) => reveal.observe(el));

    const spy = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        }),
      { root, rootMargin: "-45% 0px -50% 0px" }
    );
    root.querySelectorAll("section[id]").forEach((el) => spy.observe(el));
    return () => {
      reveal.disconnect();
      spy.disconnect();
    };
  }, []);

  function jump(id: string) {
    const root = scrollRef.current;
    const el = root?.querySelector<HTMLElement>(`#${id}`);
    if (!root || !el) return;
    root.scrollTo({ top: el.offsetTop - 8, behavior: "smooth" });
  }

  const navVisible = active !== "" && active !== "cover";

  return (
    <div className="absolute inset-0 z-50 flex bg-[var(--cream)]">
      {/* Desktop: fixed hero on the left, invitation scrolls on the right */}
      <aside className="relative hidden flex-1 overflow-hidden lg:block">
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/garden-hero.png)" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(46,34,18,0.5)_0%,rgba(46,34,18,0.7)_100%)]" />
        <div className="relative flex h-full flex-col items-center justify-center px-10 text-center text-[#fff8ee]">
          <p className="text-[12px] tracking-[0.45em] text-[#f6dfa6]">THE WEDDING OF</p>
          <h2 className="font-display mt-6 text-[76px] leading-[0.95] drop-shadow-[0_4px_18px_rgba(40,28,10,0.45)]">
            {wedding.names.groom}
            <span className="font-script block text-[52px] text-[#f6d6d8]">&</span>
            {wedding.names.bride}
          </h2>
          <p className="mt-8 text-[14px] tracking-[0.42em]">{wedding.dateDisplay.replaceAll(".", " · ")}</p>
          <p className="font-script mt-4 text-[32px] text-[#f6dfa6]">{wedding.tagline}</p>
        </div>
      </aside>

      <div className="relative h-full w-full lg:w-[500px] lg:shrink-0 lg:shadow-[-20px_0_60px_rgba(60,45,30,0.18)]">
        {/* Top bar */}
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pb-5 transition-colors duration-300 ${
            navVisible ? "bg-[linear-gradient(180deg,#fff8ee_55%,rgba(255,248,238,0))]" : ""
          }`}
          style={{ paddingTop: "calc(14px + env(safe-area-inset-top))" }}
        >
          {onBack ? (
            <button type="button" onClick={onBack} className="inv-chip pointer-events-auto">
              ← {backLabel}
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onToggleMusic}
            aria-label={musicOn ? "Matikan musik" : "Nyalakan musik"}
            className={`inv-chip pointer-events-auto h-10 w-10 justify-center p-0 text-base ${musicOn ? "border-[#c4a35a] text-[#8b6a3c]" : "opacity-70"}`}
          >
            {musicOn ? "♪" : "∅"}
          </button>
        </div>

        <div ref={scrollRef} className="h-full overflow-y-auto overscroll-contain scroll-smooth">
          <Cover guestName={guestName} onNext={() => jump("salam")} />
          <Salam />
          <Couple />
          <Countdown />
          <Events />
          <Story />
          <Gallery />
          <section id="rsvp" className="inv-section">
            <Heading eyebrow="RSVP" title="Konfirmasi Kehadiran" />
            <p className="reveal mx-auto mt-4 max-w-sm text-center text-[14px] leading-relaxed text-[#6b5339]">
              Mohon konfirmasi kehadiran Anda agar kami dapat mempersiapkan jamuan dengan baik.
            </p>
            <div className="reveal paper-card mt-6 rounded-[26px] p-5 shadow-[0_18px_40px_rgba(80,60,30,0.1)]">
              <RsvpForm defaultName={guestName} />
            </div>
          </section>
          <Gift />
          <Prayer />
          <Closing guestName={guestName} onExplore={onExplore} />
          <div className="h-16" />
        </div>

        {/* Bottom section nav, appears after the cover */}
        <nav
          aria-label="Bagian undangan"
          className={`absolute inset-x-3 z-20 transition-all duration-300 ${
            navVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
          }`}
          style={{ bottom: "calc(12px + env(safe-area-inset-bottom))" }}
        >
          <div className="mx-auto flex max-w-[440px] justify-between rounded-full border border-[#d4af5a]/40 bg-[#fffaf0]/92 p-1.5 shadow-[0_12px_32px_rgba(70,50,25,0.18)] backdrop-blur-md">
            {NAV.map((item) => {
              const on = active === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => jump(item.id)}
                  aria-current={on ? "true" : undefined}
                  className={`flex flex-1 flex-col items-center rounded-full py-1.5 transition ${
                    on ? "bg-[#4f3c29] text-[#fff6e8]" : "text-[#6b5339] hover:bg-[#f3e6c8]/60"
                  }`}
                >
                  <span className={`text-[15px] leading-none ${on ? "text-[#e8b84a]" : "text-[#c4a35a]"}`}>{item.icon}</span>
                  <span className="mt-1 text-[10px] tracking-[0.06em]">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

    </div>
  );
}

function Heading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="reveal text-center">
      <p className="text-[11px] tracking-[0.4em] text-[#c4a35a] uppercase">{eyebrow}</p>
      <h2 className="font-script mt-2 text-[44px] leading-none text-[#4a3d32]">{title}</h2>
      <Flourish className="mx-auto mt-3 h-4 w-32" />
    </div>
  );
}

function Cover({ guestName, onNext }: { guestName: string; onNext: () => void }) {
  return (
    <section id="cover" className="relative flex min-h-[100dvh] flex-col items-center justify-end overflow-hidden px-6 pb-14 text-center">
      <div
        className="absolute inset-0 scale-110 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/garden-hero.png)" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,248,238,0.05)_0%,rgba(255,248,238,0.55)_45%,rgba(255,248,238,0.96)_72%,var(--cream)_100%)]" />
      <div className="relative">
        <p className="animate-fade-up text-[11px] tracking-[0.42em] text-[#b08a3e]">THE WEDDING OF</p>
        <h1 className="font-display animate-fade-up mt-4 text-[54px] leading-[0.95] text-[#3d4a3f]" style={{ animationDelay: "0.1s" }}>
          {wedding.names.groom}
          <span className="font-script block text-[38px] text-[#d49aa0]">&</span>
          {wedding.names.bride}
        </h1>
        <Flourish className="mx-auto mt-5 h-5 w-40" />
        <p className="mt-4 text-[13px] tracking-[0.38em] text-[var(--brown)]">{wedding.dateDisplay.replaceAll(".", " · ")}</p>
        <div className="animate-fade-up mt-8" style={{ animationDelay: "0.25s" }}>
          <GuestCard
            name={guestName || "Bapak/Ibu/Saudara/i"}
            label="Kepada Yth."
            note="Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir di hari bahagia kami."
          />
        </div>
        <button type="button" onClick={onNext} className="mt-8 inline-flex flex-col items-center text-[11px] tracking-[0.3em] text-[#8b6a3c]">
          GULIR KE BAWAH
          <span className="animate-floaty mt-2 text-lg leading-none">⌄</span>
        </button>
      </div>
    </section>
  );
}

function Salam() {
  return (
    <section id="salam" className="inv-section text-center">
      <p className="reveal font-arabic text-[30px] leading-relaxed text-[#4a3d32]">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
      <p className="reveal mt-4 font-display text-[20px] italic text-[#4a3d32]">{wedding.welcome.greeting}</p>
      <p className="reveal mx-auto mt-4 max-w-sm text-[14px] leading-relaxed text-[#6b5339]">{wedding.welcome.message}</p>

      <figure className="reveal paper-card relative mt-10 rounded-[26px] px-6 py-8 shadow-[0_18px_40px_rgba(80,60,30,0.08)]">
        <CornerOrnaments />
        <p className="font-arabic text-[24px] leading-[2.1] text-[#3d4a3f]">{wedding.quran.arabic}</p>
        <blockquote className="mt-5 text-[13.5px] leading-relaxed text-[#6b5339] italic">
          “{wedding.quran.translation}”
        </blockquote>
        <figcaption className="mt-4 text-[11px] font-semibold tracking-[0.3em] text-[#c4a35a] uppercase">
          {wedding.quran.source}
        </figcaption>
      </figure>
    </section>
  );
}

function PersonCard({ person, role }: { person: Person; role: string }) {
  return (
    <div className="reveal text-center">
      <div className="relative mx-auto w-[190px]">
        <div className="absolute -inset-2.5 rounded-t-[120px] rounded-b-[26px] border border-[#d4af5a]/60" />
        <div className="relative h-[250px] overflow-hidden rounded-t-[110px] rounded-b-[20px] bg-[#efe3cc] shadow-[0_18px_40px_rgba(80,60,30,0.18)]">
          <img
            src={asset(person.portrait ?? person.photo)}
            alt={person.fullName}
            loading="lazy"
            className="h-full w-full object-cover object-top"
          />
        </div>
      </div>
      <p className="mt-6 text-[11px] tracking-[0.34em] text-[#c4a35a] uppercase">{role}</p>
      <h3 className="font-script mt-1 text-[40px] leading-none text-[#4a3d32]">{person.nickname}</h3>
      <p className="font-display mt-2 text-[22px] font-semibold text-[#3d4a3f]">{person.fullName}</p>
      <p className="mx-auto mt-2 max-w-[260px] text-[13px] leading-relaxed text-[#6a9e8a]">{person.parents}</p>
    </div>
  );
}

function Couple() {
  return (
    <section id="mempelai" className="inv-section inv-section-alt">
      <Heading eyebrow="Bride & Groom" title="Mempelai" />
      <div className="mt-10 space-y-6">
        <PersonCard person={wedding.couple.groom} role="Mempelai Pria" />
        <p className="reveal font-script text-center text-[56px] leading-none text-[#d49aa0]">&</p>
        <PersonCard person={wedding.couple.bride} role="Mempelai Wanita" />
      </div>
    </section>
  );
}

function Countdown() {
  const target = useMemo(() => new Date(wedding.countdown.targetDate).getTime(), []);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const diff = now === null ? 0 : Math.max(0, target - now);
  const cells = [
    [Math.floor(diff / 86400000), "Hari"],
    [Math.floor((diff % 86400000) / 3600000), "Jam"],
    [Math.floor((diff % 3600000) / 60000), "Menit"],
    [Math.floor((diff % 60000) / 1000), "Detik"],
  ] as const;
  const first = wedding.events[0];

  return (
    <section id="countdown" className="inv-section text-center">
      <Heading eyebrow="Save the Date" title="Menuju Hari Bahagia" />
      <p className="reveal mt-4 font-display text-[22px] text-[#3d4a3f]">{first.date}</p>
      <div className="reveal mt-6">
      {now !== null && target - now <= 0 ? (
        <p className="paper-card rounded-2xl px-5 py-6 font-display text-[20px] leading-snug text-[#6b5339]">
          {now - target < 86400000
            ? "Alhamdulillah, hari bahagia kami telah tiba ♡"
            : "Alhamdulillah, acara telah berlangsung. Terima kasih atas doa dan restu Anda ♡"}
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-2.5">
          {cells.map(([value, label]) => (
            <div key={label} className="paper-card rounded-2xl py-4 shadow-[0_10px_24px_rgba(80,60,30,0.08)]">
              <p className="font-display text-[32px] leading-none text-[#3d4a3f] tabular-nums">
                {now === null ? "--" : String(value).padStart(2, "0")}
              </p>
              <p className="mt-1.5 text-[10px] tracking-[0.2em] text-[#c4a35a] uppercase">{label}</p>
            </div>
          ))}
        </div>
      )}
      </div>
      <button type="button" onClick={() => saveCalendar(first)} className="inv-btn-ghost reveal mt-6">
        Simpan ke Kalender
      </button>
    </section>
  );
}

function saveCalendar(event: EventData) {
  const times = eventTimes(event.id);
  downloadIcs({
    title: `${event.title} — ${wedding.names.display}`,
    description: event.notes || event.title,
    location: `${event.venue}, ${event.address}`,
    start: times.start,
    end: times.end,
  });
  track("calendar_saved", { eventId: event.id });
}

function EventCard({ event }: { event: EventData }) {
  const query = event.coords
    ? `${event.coords.lat},${event.coords.lng}`
    : encodeURIComponent(`${event.venue}, ${event.address}`);
  return (
    <article className="reveal paper-card overflow-hidden rounded-[28px] shadow-[0_20px_44px_rgba(80,60,30,0.1)]">
      <div className="px-6 pt-7 pb-5 text-center">
        <p className="text-[11px] tracking-[0.34em] text-[#c4a35a] uppercase">{event.id === "akad" ? "Akad" : "Resepsi"}</p>
        <h3 className="font-script mt-1 text-[38px] leading-none text-[#4a3d32]">{event.title}</h3>
        <div className="mx-auto mt-5 grid max-w-[320px] grid-cols-2 divide-x divide-[#d4af5a]/40 rounded-2xl border border-[#d4af5a]/35 bg-white/55 py-3">
          <div className="px-2">
            <p className="text-[10px] tracking-[0.2em] text-[#8b6a3c] uppercase">Tanggal</p>
            <p className="mt-1 text-[13px] font-semibold text-[#3d4a3f]">{event.date}</p>
          </div>
          <div className="px-2">
            <p className="text-[10px] tracking-[0.2em] text-[#8b6a3c] uppercase">Waktu</p>
            <p className="mt-1 text-[13px] font-semibold text-[#3d4a3f]">{event.time}</p>
          </div>
        </div>
        <p className="font-display mt-5 text-[22px] font-semibold text-[#3d4a3f]">{event.venue}</p>
        <p className="mt-1 text-[13px] leading-relaxed text-[#6b5339]">{event.address}</p>
        {event.dressCode ? (
          <p className="mt-4 inline-block rounded-full bg-[#f3e6c8]/70 px-3 py-1 text-[12px] text-[#6b5339]">
            Dress code: {event.dressCode}
          </p>
        ) : null}
        {event.notes ? <p className="mt-3 text-[12.5px] text-[#6a9e8a] italic">{event.notes}</p> : null}
      </div>
      <iframe
        title={`Peta lokasi ${event.venue}`}
        src={`https://maps.google.com/maps?q=${query}&z=17&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-52 w-full border-y border-[#d4af5a]/30 grayscale-[35%] sepia-[20%]"
      />
      <div className="grid grid-cols-2 gap-2 p-4">
        <a
          href={event.mapUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => track("map_opened", { eventId: event.id })}
          className="flex items-center justify-center rounded-full bg-[var(--ink)] py-3 text-center text-[12px] tracking-[0.08em] whitespace-nowrap text-[var(--ivory)] transition hover:bg-[var(--brown)]"
        >
          Petunjuk Arah
        </a>
        <button type="button" onClick={() => saveCalendar(event)} className="inv-btn-ghost px-3 tracking-[0.08em] whitespace-nowrap">
          Simpan Tanggal
        </button>
      </div>
    </article>
  );
}

function Events() {
  return (
    <section id="acara" className="inv-section inv-section-alt">
      <Heading eyebrow="Wedding Event" title="Rangkaian Acara" />
      <div className="mt-8 space-y-6">
        {wedding.events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}

function Story() {
  return (
    <section id="kisah" className="inv-section">
      <Heading eyebrow="Love Story" title="Kisah Kami" />
      <ol className="relative mt-8 ml-3 border-l border-[#d4af5a]/50">
        {wedding.story.map((chapter, i) => (
          <li key={chapter.id} className="reveal relative pb-10 pl-7 last:pb-0">
            <span className="absolute top-1 -left-[7px] h-3.5 w-3.5 rounded-full border-2 border-[#fff8ee] bg-[#c4a35a] shadow" />
            <p className="text-[11px] font-semibold tracking-[0.3em] text-[#c4a35a] uppercase">
              {chapter.year ?? `Bab ${String(i + 1).padStart(2, "0")}`}
            </p>
            {chapter.image ? (
              <img
                src={encodeURI(chapter.image)}
                alt={chapter.title}
                loading="lazy"
                style={{ objectPosition: chapter.focus ?? "50% 40%" }}
                className="mt-3 aspect-[4/3] w-full rounded-[18px] object-cover shadow-[0_12px_28px_rgba(80,60,30,0.14)] ring-1 ring-[#d4af5a]/40"
              />
            ) : null}
            <h3 className="font-script mt-3 text-[34px] leading-none text-[#4a3d32]">{chapter.title}</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-[#6b5339]">{chapter.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Gallery() {
  return (
    <section id="galeri" className="inv-section inv-section-alt">
      <Heading eyebrow="Gallery" title="Momen Kami" />
      <AlbumGrid items={wedding.album} className="reveal mt-8" />
    </section>
  );
}

function Gift() {
  return (
    <section id="hadiah" className="inv-section inv-section-alt">
      <Heading eyebrow="Wedding Gift" title="Tanda Kasih" />
      <p className="reveal mx-auto mt-4 max-w-sm text-center text-[14px] leading-relaxed text-[#6b5339]">
        {wedding.gift.message} Namun jika Anda ingin memberikan tanda kasih, dapat melalui:
      </p>
      <div className="reveal mt-6">
        <GiftAccounts />
      </div>
    </section>
  );
}

function Prayer() {
  return (
    <section id="doa" className="inv-section text-center">
      <Heading eyebrow="Doa untuk Mempelai" title="Doa & Harapan" />
      <p className="reveal font-arabic mt-8 text-[26px] leading-[2] text-[#3d4a3f]">{wedding.prayer.arabic}</p>
      <p className="reveal mx-auto mt-4 max-w-sm text-[13.5px] leading-relaxed text-[#6b5339] italic">“{wedding.prayer.translation}”</p>
      <p className="reveal mt-3 text-[11px] font-semibold tracking-[0.3em] text-[#c4a35a] uppercase">{wedding.prayer.source}</p>
      <p className="reveal mx-auto mt-8 max-w-sm text-[14px] leading-relaxed text-[#6b5339]">{wedding.welcome.doa}</p>
    </section>
  );
}

function Closing({ guestName, onExplore }: { guestName: string; onExplore?: () => void }) {
  const photo = wedding.album[wedding.album.length - 1];
  return (
    <section id="penutup" className="inv-section inv-section-alt text-center">
      {photo ? (
        <div className="reveal relative mx-auto w-[220px]">
          <div className="absolute -inset-2.5 rounded-t-[140px] rounded-b-[26px] border border-[#d4af5a]/60" />
          <img src={asset(photo.src)} alt="Kedua mempelai" loading="lazy" className="relative h-[290px] w-full rounded-t-[130px] rounded-b-[20px] object-cover shadow-[0_18px_40px_rgba(80,60,30,0.18)]" />
        </div>
      ) : null}
      <p className="reveal mx-auto mt-10 max-w-sm text-[14px] leading-relaxed text-[#6b5339]">{wedding.closing.message}</p>
      {guestName ? (
        <p className="reveal mx-auto mt-5 max-w-sm text-[14px] leading-relaxed text-[#6b5339]">
          Kehadiran <span className="font-semibold text-[#4a3d32]">{guestName}</span> akan melengkapi kebahagiaan kami.
        </p>
      ) : null}
      <p className="reveal mt-5 font-display text-[19px] italic text-[#4a3d32]">{wedding.closing.salam}</p>
      <p className="reveal mt-8 text-[11px] tracking-[0.34em] text-[#c4a35a] uppercase">Kami yang berbahagia</p>
      <p className="reveal font-script mt-2 text-[46px] leading-none text-[#4a3d32]">{wedding.names.display}</p>
      <div className="reveal mt-4 space-y-1 text-[13px] text-[#6a9e8a]">
        <p>{family(wedding.couple.groom.parents)}</p>
        <p>{family(wedding.couple.bride.parents)}</p>
      </div>
      {onExplore ? (
        <div className="reveal mt-10 rounded-[24px] border border-[#d4af5a]/40 bg-white/50 px-5 py-6">
          <p className="font-script text-[28px] leading-none text-[#4a3d32]">Ingin pengalaman berbeda?</p>
          <p className="mt-2 text-[13px] text-[#6b5339]">Jelajahi undangan ini sebagai taman interaktif.</p>
          <button
            type="button"
            onClick={onExplore}
            className="mt-4 rounded-full bg-[var(--ink)] px-7 py-3 text-[11px] tracking-[0.26em] text-[var(--ivory)] transition hover:bg-[var(--brown)]"
          >
            JELAJAHI TAMAN
          </button>
        </div>
      ) : null}
      <Flourish className="mx-auto mt-10 h-4 w-32" />
    </section>
  );
}
