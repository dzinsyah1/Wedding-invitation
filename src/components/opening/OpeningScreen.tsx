"use client";

import { wedding } from "@/data/wedding";
import Flourish, { CornerOrnaments } from "@/components/ui/Flourish";
import GuestCard from "@/components/ui/GuestCard";

export default function OpeningScreen({
  guestName,
  musicOn,
  onToggleMusic,
  onEnter,
  leaving = false,
  onViewInvitation,
}: {
  guestName: string;
  musicOn: boolean;
  onToggleMusic: () => void;
  onEnter: (origin: { x: number; y: number }) => void;
  leaving?: boolean;
  onViewInvitation: () => void;
}) {
  return (
    <div className="absolute inset-0 z-30 overflow-x-hidden overflow-y-auto">
      {/* Pixar flower garden hero backdrop */}
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/garden-hero.png)" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,244,220,0.22)_0%,rgba(90,70,40,0.45)_100%)]" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-80">
        <div className="animate-drift absolute -left-6 top-16 h-3 w-3 rounded-full bg-[#fff8f0]/70 blur-[1px]" />
        <div className="animate-floaty absolute left-[18%] top-28 h-2.5 w-2.5 rounded-full bg-[#fffef8]/80" />
        <div className="animate-drift absolute right-[22%] top-20 h-2 w-2 rounded-full bg-[#ffe9b0]/70" />
        <div className="animate-floaty absolute right-[12%] top-40 h-3 w-3 rounded-full bg-white/60 blur-[0.5px]" />
        <div className="animate-drift absolute left-[40%] top-14 h-2 w-2 rounded-full bg-[#fff2b8]/75" />
      </div>

      <div className="relative flex min-h-full items-center justify-center px-5 py-6">
      <div className={`paper-card relative w-full max-w-[420px] rounded-[28px] px-7 ${guestName ? "py-9" : "py-12"} text-center shadow-[0_30px_80px_rgba(80,60,30,0.28)] ${leaving ? "opening-leave" : ""}`}>
        <CornerOrnaments />
        <p className="animate-fade-up text-[11px] tracking-[0.42em] text-[var(--gold)]">
          THE WEDDING OF
        </p>
        <h1
          className={`font-display animate-fade-up mt-6 leading-[0.95] ${guestName ? "text-[44px] sm:text-[52px]" : "text-[52px]"}`}
          style={{ animationDelay: "0.16s" }}
        >
          {wedding.names.groom}
          <span className="font-script mx-3 block text-[34px] text-[var(--rose)]">&</span>
          {wedding.names.bride}
        </h1>
        <Flourish className="mx-auto mt-5 h-5 w-40 animate-fade-up" />
        <p
          className="animate-fade-up mt-4 text-[13px] tracking-[0.38em] text-[var(--brown)]"
          style={{ animationDelay: "0.28s" }}
        >
          {wedding.dateDisplay.replaceAll(".", " · ")}
        </p>
        <p
          className="font-script animate-fade-up mt-3 text-[26px] text-[var(--sage)]"
          style={{ animationDelay: "0.36s" }}
        >
          {wedding.tagline}
        </p>
        {guestName ? (
          <GuestCard name={guestName} label="Teruntuk Yth." size="sm" className="animate-fade-up mt-5" />
        ) : null}
        <div className={`animate-fade-up flex flex-col items-center gap-3 ${guestName ? "mt-6" : "mt-8"}`} style={{ animationDelay: "0.42s" }}>
          <button
            type="button"
            data-testid="enter-garden"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              const r = event.currentTarget.getBoundingClientRect();
              onEnter({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
            }}
            className="min-h-12 w-full max-w-[280px] rounded-full border border-[var(--gold)]/80 bg-[var(--ink)] px-8 py-3 text-[11px] tracking-[0.28em] text-[var(--ivory)] shadow-[0_12px_28px_rgba(40,50,40,0.25)] transition hover:bg-[var(--brown)]"
          >
            ✦ JELAJAHI TAMAN
          </button>
          <button
            type="button"
            data-testid="view-invitation"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              onViewInvitation();
            }}
            className="min-h-12 w-full max-w-[280px] rounded-full border border-[var(--gold)]/80 bg-white/60 px-8 py-3 text-[11px] tracking-[0.28em] text-[var(--ink)] transition hover:bg-[#f3e6c8]/80"
          >
            LIHAT UNDANGAN LENGKAP
          </button>
          <p className="text-[11.5px] text-[#8b6a3c]">Jelajahi taman interaktif, atau baca undangan langsung</p>
          <button
            type="button"
            onClick={onToggleMusic}
            className="mt-1 text-[12px] tracking-[0.16em] text-[var(--teal)]"
          >
            {musicOn ? "♪ Musik menyala" : "∅ Musik mati"}
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
