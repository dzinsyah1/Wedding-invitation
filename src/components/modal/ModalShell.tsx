"use client";

import { useEffect } from "react";
import { CornerOrnaments } from "@/components/ui/Flourish";

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
        className="absolute inset-0 bg-[var(--ink)]/28 backdrop-blur-[8px]"
        onPointerDown={handleClose}
      />
      <div
        className="paper-card relative z-10 mb-[max(12px,env(safe-area-inset-bottom))] max-h-[78vh] w-[min(92vw,480px)] overflow-hidden rounded-[30px] shadow-[0_28px_80px_rgba(60,53,46,0.22)] animate-[fadeUp_0.28s_ease]"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <CornerOrnaments />
        <div className="relative z-10 flex items-center justify-between px-6 pb-2 pt-6">
          <h2 className="font-display text-[28px] leading-none">{title}</h2>
          <button
            type="button"
            onPointerDown={handleClose}
            className="relative z-20 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--gold)]/40 text-2xl leading-none text-[var(--brown)]"
            aria-label="Tutup modal"
          >
            ×
          </button>
        </div>
        <div className="mx-6 h-px bg-[linear-gradient(90deg,transparent,var(--gold),transparent)]" />
        <div className="relative overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
