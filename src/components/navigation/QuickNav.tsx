"use client";

import { useState } from "react";
import { wedding } from "@/data/wedding";
import Flourish from "@/components/ui/Flourish";

const ICONS: Record<string, string> = {
  home: "⌂",
  couple: "♡",
  story: "❧",
  mosque: "☽",
  venue: "✦",
  clock: "◷",
  gallery: "▣",
  mail: "✉",
  gift: "❊",
  heart: "♡",
};

export default function QuickNav({
  onNavigate,
  musicOn,
  onToggleMusic,
  onFallback,
}: {
  onNavigate: (id: string) => void;
  musicOn: boolean;
  onToggleMusic: () => void;
  onFallback: () => void;
}) {
  const [open, setOpen] = useState(false);
  const hud =
    "flex h-12 w-12 items-center justify-center rounded-full border border-[var(--gold)]/45 bg-[var(--ivory)]/88 text-base shadow-md backdrop-blur";

  return (
    <div className="absolute right-4 z-20" style={{ top: "calc(16px + env(safe-area-inset-top))" }}>
      <div className="flex gap-2">
        <button type="button" onClick={onToggleMusic} className={hud} aria-label="Musik">
          {musicOn ? "♪" : "∅"}
        </button>
        <button type="button" onClick={() => setOpen((v) => !v)} className={hud} aria-label="Navigasi cepat">
          {open ? "×" : "☰"}
        </button>
      </div>
      {open ? (
        <div className="paper-card mt-3 w-56 rounded-[22px] border border-[var(--gold)]/25 p-4 shadow-xl">
          <p className="font-display text-center text-lg">Our Wedding</p>
          <Flourish className="mx-auto mt-1 h-4 w-28" />
          <div className="mt-3 flex max-h-[50vh] flex-col gap-1 overflow-auto">
            {wedding.world.locations.map((loc) => (
              <button
                key={loc.id}
                type="button"
                className="rounded-xl px-3 py-2 text-left text-sm tracking-wide hover:bg-[var(--gold)]/10"
                onClick={() => {
                  setOpen(false);
                  onNavigate(loc.id);
                }}
              >
                <span className="mr-2 text-[var(--gold)]">{ICONS[loc.navigation.icon] ?? "✦"}</span>
                {loc.navigation.label}
              </button>
            ))}
          </div>
          <button type="button" className="mt-3 w-full text-center text-[11px] tracking-[0.16em] text-[var(--teal)]" onClick={onFallback}>
            VIEW INVITATION
          </button>
        </div>
      ) : null}
    </div>
  );
}
