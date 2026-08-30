"use client";

import { wedding } from "@/data/wedding";
import Flourish, { CornerOrnaments } from "@/components/ui/Flourish";

export default function OpeningScreen({
  guestName,
  musicOn,
  onToggleMusic,
  onEnter,
}: {
  guestName: string;
  musicOn: boolean;
  onToggleMusic: () => void;
  onEnter: () => void;
}) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center overflow-hidden">
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

      <div className="paper-card relative mx-5 w-full max-w-[420px] rounded-[28px] px-7 py-12 text-center shadow-[0_30px_80px_rgba(80,60,30,0.28)]">
        <CornerOrnaments />
        <p className="animate-fade-up text-[11px] tracking-[0.42em] text-[var(--gold)]">
          THE WEDDING OF
        </p>
        {guestName ? (
          <p className="animate-fade-up mt-5 text-[13px] text-[var(--teal)]" style={{ animationDelay: "0.08s" }}>
            Kepada Yth.
            <br />
            <span className="font-display text-[22px] text-[var(--ink)]">{guestName}</span>
          </p>
        ) : null}
        <h1
          className="font-display animate-fade-up mt-6 text-[52px] leading-[0.95]"
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
        <button
          type="button"
          data-testid="enter-garden"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            onEnter();
          }}
          className="mt-8 min-h-12 rounded-full border border-[var(--gold)]/80 bg-[var(--ink)] px-8 py-3 text-[11px] tracking-[0.28em] text-[var(--ivory)] transition hover:bg-[var(--brown)]"
        >
          ENTER THE GARDEN
        </button>
        <button
          type="button"
          onClick={onToggleMusic}
          className="mt-4 text-[12px] tracking-[0.16em] text-[var(--teal)]"
        >
          {musicOn ? "Musik menyala" : "Musik mati"}
        </button>
      </div>
    </div>
  );
}
