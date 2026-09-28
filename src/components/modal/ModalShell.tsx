"use client";

import { useEffect } from "react";
import { CornerOrnaments, FloralBrooch, FloralSprig } from "@/components/ui/Flourish";

// Fixed petal layout (no randomness, so server and client render the same).
const PETALS = [
  { left: "8%", delay: "0s", dur: "9s", size: 9 },
  { left: "26%", delay: "3.2s", dur: "11s", size: 7 },
  { left: "47%", delay: "1.4s", dur: "10s", size: 8 },
  { left: "66%", delay: "5s", dur: "12s", size: 6 },
  { left: "84%", delay: "2.3s", dur: "9.5s", size: 8 },
];

export default function ModalShell({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleClose(event: React.SyntheticEvent) {
    event.preventDefault();
    event.stopPropagation();
    onClose();
  }

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Tutup"
        className="modal-backdrop absolute inset-0 bg-[var(--ink)]/28 backdrop-blur-[8px]"
        onPointerDown={handleClose}
      />
      {/* Wrapper without overflow clipping so the florals can sit on the card's edges. */}
      <div
        className="modal-card-in relative z-10 mb-[max(22px,env(safe-area-inset-bottom))] w-[min(92vw,480px)]"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <FloralBrooch className="modal-brooch pointer-events-none absolute -top-[22px] left-1/2 z-30 h-[46px] w-[124px] -translate-x-1/2 drop-shadow-[0_4px_8px_rgba(80,60,30,0.18)]" />
        <FloralSprig className="modal-sprig-l pointer-events-none absolute -bottom-5 -left-4 z-30 h-[52px] w-[52px] drop-shadow-[0_3px_6px_rgba(80,60,30,0.15)]" />
        <FloralSprig className="modal-sprig-r pointer-events-none absolute -right-4 -bottom-5 z-30 h-[52px] w-[52px] -scale-x-100 drop-shadow-[0_3px_6px_rgba(80,60,30,0.15)]" />

        <div className="paper-card relative flex max-h-[min(84dvh,720px)] flex-col overflow-hidden rounded-[30px] shadow-[0_28px_80px_rgba(60,53,46,0.22)]">
          <CornerOrnaments />
          <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
            {PETALS.map((p) => (
              <span
                key={p.left}
                className="modal-petal"
                style={{ left: p.left, animationDelay: p.delay, animationDuration: p.dur, width: p.size, height: p.size * 1.25 }}
              />
            ))}
          </div>
          <div className="relative z-10 flex shrink-0 items-center justify-between px-6 pt-7 pb-2">
            <h2 className="modal-title font-display text-[28px] leading-none">{title}</h2>
            <button
              type="button"
              onPointerDown={handleClose}
              className="relative z-20 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--gold)]/40 bg-white/40 text-2xl leading-none text-[var(--brown)] transition hover:rotate-90 hover:bg-white/70"
              aria-label="Tutup modal"
            >
              ×
            </button>
          </div>
          <div className="modal-rule mx-6 h-px shrink-0" />
          <div className="modal-body relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pt-5 pb-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
