"use client";

import { useEffect, useState } from "react";
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

const TIP_KEY = "teleport-tip-seen";

function PortalIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M12 2.5l1.6 4.3 4.4 1.7-4.4 1.7L12 14.5l-1.6-4.3L6 8.5l4.4-1.7L12 2.5z" fill="#E8B84A" />
      <path d="M18.5 13.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2z" fill="#E8B84A" opacity="0.8" />
      <ellipse cx="9" cy="19" rx="6" ry="1.8" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export default function QuickNav({
  onTeleport,
  currentId,
  tipReady,
  musicOn,
  onToggleMusic,
  onFallback,
}: {
  onTeleport: (id: string) => void;
  currentId?: string;
  tipReady: boolean;
  musicOn: boolean;
  onToggleMusic: () => void;
  onFallback: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [tip, setTip] = useState(false);

  // One-time nudge so guests discover teleport right after the intro instruction fades.
  useEffect(() => {
    if (!tipReady) return;
    let seen = false;
    try {
      seen = window.localStorage.getItem(TIP_KEY) === "1";
    } catch {
      /* storage unavailable */
    }
    if (seen) return;
    const show = window.setTimeout(() => setTip(true), 600);
    const hide = window.setTimeout(() => setTip(false), 7600);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [tipReady]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function markTipSeen() {
    setTip(false);
    try {
      window.localStorage.setItem(TIP_KEY, "1");
    } catch {
      /* storage unavailable */
    }
  }

  function toggle() {
    markTipSeen();
    setOpen((v) => !v);
  }

  const hud =
    "flex h-12 items-center justify-center rounded-full border border-[var(--gold)]/45 bg-[var(--ivory)]/88 text-base shadow-md backdrop-blur";

  return (
    <>
      <div className="absolute right-4 z-30" style={{ top: "calc(16px + env(safe-area-inset-top))" }}>
        <div className="flex gap-2">
          <button type="button" onClick={onToggleMusic} className={`${hud} w-12`} aria-label="Musik">
            {musicOn ? "♪" : "∅"}
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-label="Teleport ke lokasi"
            className={`${hud} teleport-btn gap-2 pr-4 pl-3 font-display text-[11px] font-semibold tracking-[0.18em] text-[#4a3d32] uppercase ${
              open ? "teleport-btn-on" : ""
            }`}
          >
            {open ? <span className="w-5 text-lg leading-none">×</span> : <PortalIcon className="h-5 w-5 text-[#8b6a3c]" />}
            Teleport
          </button>
        </div>

        {tip && !open ? (
          <button
            type="button"
            onClick={toggle}
            className="hint-bubble hint-pop absolute top-[60px] right-0 w-[220px] rounded-[18px] px-4 py-3 text-left"
          >
            <span className="teleport-tip-tail" />
            <p className="font-script text-[20px] leading-none text-[#4a3d32]">Mau langsung ke tujuan?</p>
            <p className="mt-1.5 text-[12px] leading-snug text-[#6b5339]">
              Pakai <b>Teleport</b> untuk langsung ke Akad, Resepsi, atau RSVP tanpa berjalan.
            </p>
          </button>
        ) : null}

        {/* Desktop: dropdown card under the button */}
        {open ? (
          <div className="paper-card hint-pop mt-3 hidden w-[340px] rounded-[24px] border border-[var(--gold)]/25 p-5 shadow-xl sm:block">
            <Panel currentId={currentId} onPick={(id) => { setOpen(false); onTeleport(id); }} onFallback={onFallback} />
          </div>
        ) : null}
      </div>

      {/* Mobile: bottom sheet within thumb reach */}
      {open ? (
        <div className="absolute inset-0 z-40 sm:hidden">
          <button
            type="button"
            aria-label="Tutup"
            className="absolute inset-0 bg-[#3c2e20]/30 backdrop-blur-[2px] animate-[fadeUp_0.2s_ease]"
            onClick={() => setOpen(false)}
          />
          <div
            className="paper-card teleport-sheet absolute inset-x-0 bottom-0 rounded-t-[28px] px-5 pt-3 shadow-[0_-20px_60px_rgba(60,45,30,0.25)]"
            style={{ paddingBottom: "calc(18px + env(safe-area-inset-bottom))" }}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#c4a35a]/50" />
            <Panel currentId={currentId} onPick={(id) => { setOpen(false); onTeleport(id); }} onFallback={onFallback} />
          </div>
        </div>
      ) : null}
    </>
  );
}

function Panel({
  currentId,
  onPick,
  onFallback,
}: {
  currentId?: string;
  onPick: (id: string) => void;
  onFallback: () => void;
}) {
  return (
    <>
      <p className="font-script text-center text-[28px] leading-none text-[#4a3d32]">Mau ke mana?</p>
      <Flourish className="mx-auto mt-1.5 h-4 w-28" />
      <p className="mt-1 text-center text-[12px] text-[#8b6a3c]">Pilih tujuan, kamu langsung diteleport ke sana</p>
      <div className="mt-4 grid max-h-[52vh] grid-cols-2 gap-2 overflow-auto pb-1">
        {wedding.world.locations.map((loc, index) => {
          const here = loc.id === currentId;
          return (
            <button
              key={loc.id}
              type="button"
              onClick={() => onPick(loc.id)}
              className={`teleport-card group relative flex items-center gap-2.5 rounded-2xl px-2.5 py-2.5 text-left transition active:scale-[0.97] ${
                here ? "teleport-card-here" : ""
              }`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff8ea] text-[16px] text-[#c4a35a] shadow-[inset_0_0_0_1px_rgba(212,175,90,0.45)] transition group-hover:scale-110">
                {ICONS[loc.navigation.icon] ?? "✦"}
              </span>
              <span className="min-w-0">
                <span className="block font-display text-[10px] tracking-[0.18em] text-[#c4a35a]">
                  {here ? "● Kamu di sini" : String(index + 1).padStart(2, "0")}
                </span>
                <span className="block truncate text-[13px] font-medium text-[#4a3d32]">{loc.navigation.label}</span>
              </span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className="mt-3 w-full text-center text-[11px] tracking-[0.16em] text-[var(--teal)]"
        onClick={onFallback}
      >
        LIHAT UNDANGAN LENGKAP
      </button>
    </>
  );
}
