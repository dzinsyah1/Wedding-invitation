"use client";

import { wedding } from "@/data/wedding";
import Flourish from "@/components/ui/Flourish";

export default function LoadingScreen({ progress }: { progress: number }) {
  const pct = Math.round(progress * 100);
  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[var(--cream)] text-[var(--ink)]">
      <p className="font-script text-4xl text-[var(--gold)]">✦</p>
      <h1 className="font-display mt-4 text-[34px] tracking-wide">Menyiapkan taman</h1>
      <p className="mt-2 text-sm tracking-[0.18em] text-[var(--teal)]">
        {wedding.names.display}
      </p>
      <Flourish className="mt-5 h-5 w-36" />
      <div className="mt-10 h-1.5 w-52 overflow-hidden rounded-full bg-[var(--ink)]/10">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,var(--sage),var(--gold))] transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-3 text-[11px] tracking-[0.32em] text-[var(--brown)]">{pct}%</p>
    </div>
  );
}
