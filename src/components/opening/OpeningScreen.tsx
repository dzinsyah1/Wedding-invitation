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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(216,241,251,0.18)_0%,rgba(31,58,95,0.28)_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="animate-drift absolute -left-8 top-10 h-28 w-52 rounded-full bg-white/45 blur-md" />
        <div className="animate-drift absolute right-0 top-24 h-20 w-36 rounded-full bg-white/35 blur-md" />
      </div>

      <div className="paper-card relative mx-5 w-full max-w-[420px] rounded-[32px] px-7 py-12 text-center shadow-[0_30px_80px_rgba(60,53,46,0.16)]">
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
          onClick={onEnter}
          className="mt-8 min-h-12 rounded-full border border-[var(--gold)]/80 bg-[var(--ink)] px-8 py-3 text-[11px] tracking-[0.28em] text-[var(--ivory)] transition hover:bg-[var(--brown)]"
        >
          ENTER OUR WORLD
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
