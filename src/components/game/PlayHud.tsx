"use client";

import { useEffect, useRef, useState } from "react";
import { GAME_EVENTS, gameEvents } from "@/game/events/gameEvents";
import { showToast } from "@/components/ui/Toast";
import { useTouchUI } from "@/lib/useTouchUI";
import { track } from "@/lib/analytics";

type Doves = { carrying: boolean };
type Tip = "pad" | "dove" | null;

// Survives the HUD unmounting (e.g. while the full invitation is open) so the
// count is right again on return; the game only re-sends it on change.
let lastDoves: Doves = { carrying: false };

function EnvelopeIcon() {
  return (
    <svg viewBox="0 0 28 22" className="h-[18px] w-[23px]" fill="none" aria-hidden="true">
      <rect x="1.5" y="2" width="25" height="18" rx="2.5" fill="#fffaf0" stroke="#8b6a3c" strokeWidth="1.4" />
      <path d="M2.5 3.5 14 12.5l11.5-9" stroke="#8b6a3c" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="14" cy="12.5" r="3.6" fill="#c98890" stroke="#a86c74" strokeWidth="0.8" />
      <path d="M12.6 12.4c.5-1 2.3-1 2.8 0-.5.9-2.3.9-2.8 0z" fill="#f6dfa6" />
    </svg>
  );
}

function DoveIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M3 13.5c2.6.4 4.6-.3 6-2.2L11.6 7c.9-1.4 2.7-1.9 4.1-1 .5.3.9.7 1.2 1.2l2.6.4-2 1.4c.1 3.6-1.9 6.9-5.3 8.2-1.8.7-3.9.7-5.8 0L3 13.5z"
        fill="#fffdf7"
        stroke="#8b6a3c"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M9.5 11.5c1.6 1.8 4 2.3 6.2 1.3" stroke="#c4a35a" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="15.4" cy="7.4" r="0.8" fill="#4a3d32" />
    </svg>
  );
}

/** Top-left HUD: invitation button, dove counter / release button, one-time tips. */
export default function PlayHud({
  hidden,
  quiet = false,
  onOpenInvitation,
}: {
  hidden: boolean;
  /** Hold tips back (e.g. while the intro instruction is on screen). */
  quiet?: boolean;
  onOpenInvitation: () => void;
}) {
  const [doves, setDoves] = useState<Doves>(lastDoves);
  const [tip, setTip] = useState<Tip>(null);
  const [pending, setPending] = useState<Tip>(null);
  const seen = useRef({ pad: false, dove: false });
  const touch = useTouchUI();

  useEffect(() => {
    const showTip = (kind: Exclude<Tip, null>) => {
      if (seen.current[kind]) return;
      seen.current[kind] = true;
      setPending(kind);
    };

    const offDoves = gameEvents.on(GAME_EVENTS.DOVES, (payload) => {
      const data = payload as Doves;
      if (lastDoves.carrying && !data.carrying) {
        track("dove_released");
        showToast("Merpati telah terbang ♡", "Membawa doa terbaik untuk kedua mempelai");
      }
      lastDoves = data;
      setDoves(data);
    });
    const offCaught = gameEvents.on(GAME_EVENTS.DOVE_CAUGHT, () => showTip("dove"));
    const offNear = gameEvents.on(GAME_EVENTS.PAD_NEAR, () => showTip("pad"));
    const offBounce = gameEvents.on(GAME_EVENTS.PAD_BOUNCE, () => {
      if (!seen.current.pad) track("first_bounce");
      seen.current.pad = true;
      setTip((t) => (t === "pad" ? null : t));
      setPending((t) => (t === "pad" ? null : t));
    });
    return () => {
      offDoves();
      offCaught();
      offNear();
      offBounce();
    };
  }, []);

  // Show a queued tip once nothing else is on screen; it closes itself after 3s.
  useEffect(() => {
    if (!pending || quiet) return;
    setTip(pending);
    setPending(null);
  }, [pending, quiet]);
  useEffect(() => {
    if (!tip) return;
    const id = window.setTimeout(() => setTip(null), 3000);
    return () => window.clearTimeout(id);
  }, [tip]);

  if (hidden) return null;

  function release() {
    gameEvents.emit(GAME_EVENTS.RELEASE_DOVE);
    setTip((t) => (t === "dove" ? null : t));
  }

  return (
    <>
      <div
        className="pointer-events-none absolute left-4 z-20 flex flex-col items-start gap-2 sm:flex-row sm:items-center"
        style={{ top: "calc(16px + env(safe-area-inset-top))" }}
      >
        <button
          type="button"
          onClick={onOpenInvitation}
          aria-label="Buka undangan lengkap"
          className="invite-btn pointer-events-auto flex h-12 items-center gap-2 rounded-full pr-4 pl-3 transition active:scale-95"
        >
          <EnvelopeIcon />
          <span className="font-display text-[11px] font-semibold tracking-[0.18em] text-[#4a3d32] uppercase">
            Undangan
          </span>
        </button>

        {doves.carrying ? (
          <button
            type="button"
            onClick={release}
            className="release-btn hint-pop pointer-events-auto flex h-12 items-center gap-2 rounded-full pr-4 pl-3 active:scale-95"
          >
            <DoveIcon />
            <span className="text-[12px] font-semibold tracking-[0.1em] text-[#fff6e8] uppercase">Lepaskan</span>
            {!touch ? <kbd className="hint-key ml-0.5">R</kbd> : null}
          </button>
        ) : null}
      </div>

      {tip ? (
        <div
          className="absolute left-1/2 z-20 w-max max-w-[92vw] -translate-x-1/2"
          style={touch ? { top: "calc(140px + env(safe-area-inset-top))" } : { bottom: "calc(40px + env(safe-area-inset-bottom))" }}
        >
          <div className="hint-bubble hint-pop relative rounded-[18px] py-2 pr-11 pl-4 text-center sm:py-2.5 sm:pl-5">
            {tip === "pad" ? (
              <>
                <p className="font-script text-[22px] leading-none text-[#4a3d32]">Bunga Pantul ✦</p>
                <p className="mt-1 text-[11.5px] leading-snug text-[#6b5339] sm:text-[12px]">
                  {touch ? "Tekan tombol lompat" : "Tekan spasi / ↑"} di atas bunga untuk melambung tinggi
                </p>
              </>
            ) : (
              <>
                <p className="font-script text-[22px] leading-none text-[#4a3d32]">Merpati hinggap ♡</p>
                <p className="mt-1 text-[11.5px] leading-snug text-[#6b5339] sm:text-[12px]">
                  Tekan <b>Lepaskan</b>{touch ? "" : " / R"} untuk menerbangkan doa bagi mempelai
                </p>
              </>
            )}
            <button
              type="button"
              aria-label="Tutup petunjuk"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => setTip(null)}
              className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#d4af5a]/45 text-[16px] leading-none text-[#8b6a3c] hover:bg-[#f3e6c8]/70"
            >
              ×
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
