"use client";

import { useEffect, useRef } from "react";
import { useTouchUI } from "@/lib/useTouchUI";

function Arrow({ dir }: { dir: "left" | "right" | "up" }) {
  const rotate = dir === "left" ? "rotate-180" : dir === "up" ? "-rotate-90" : "";
  return (
    <svg
      viewBox="0 0 48 48"
      className={`pointer-events-none h-7 w-7 ${rotate}`}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14 24h18.5"
        stroke="#C4A35A"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M26 15.5c4.2 4 7.6 6.4 8.8 8.5-1.2 2.1-4.6 4.5-8.8 8.5"
        stroke="#8B6A3C"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26 18.2c3.2 3.2 5.8 5.1 6.6 5.8-0.8.7-3.4 2.6-6.6 5.8"
        stroke="#E8B84A"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.9"
      />
      <circle cx="12.5" cy="24" r="1.4" fill="#E8B84A" />
    </svg>
  );
}

export default function MovementControls({
  disabled,
  actionLabel,
  onDir,
  onJump,
  onAction,
}: {
  disabled?: boolean;
  actionLabel?: string | null;
  onDir: (dir: number) => void;
  onJump: (down: boolean) => void;
  onAction: () => void;
}) {
  const show = useTouchUI();
  const onDirRef = useRef(onDir);
  const onJumpRef = useRef(onJump);
  const holding = useRef(false);
  onDirRef.current = onDir;
  onJumpRef.current = onJump;

  useEffect(() => {
    const stop = () => {
      if (!holding.current) return;
      holding.current = false;
      onDirRef.current(0);
      onJumpRef.current(false);
    };
    const opts: AddEventListenerOptions = { capture: true };
    document.addEventListener("pointerup", stop, opts);
    document.addEventListener("pointercancel", stop, opts);
    document.addEventListener("touchend", stop, opts);
    document.addEventListener("touchcancel", stop, opts);
    window.addEventListener("blur", stop);
    return () => {
      document.removeEventListener("pointerup", stop, opts);
      document.removeEventListener("pointercancel", stop, opts);
      document.removeEventListener("touchend", stop, opts);
      document.removeEventListener("touchcancel", stop, opts);
      window.removeEventListener("blur", stop);
    };
  }, []);

  useEffect(() => {
    if (!disabled) return;
    holding.current = false;
    onDir(0);
    onJump(false);
  }, [disabled, onDir, onJump]);

  if (!show) return null;

  const startDir = (dir: number) => (event: React.PointerEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    holding.current = true;
    onDir(dir);
  };

  const btn =
    "control-btn pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full disabled:opacity-40";

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between px-5"
      style={{ paddingBottom: "calc(18px + env(safe-area-inset-bottom))" }}
    >
      <button
        type="button"
        aria-label="Jalan ke kiri"
        disabled={disabled}
        className={btn}
        onPointerDown={startDir(-1)}
        onContextMenu={(event) => event.preventDefault()}
      >
        <Arrow dir="left" />
      </button>
      {actionLabel && !disabled ? (
        // Near an object the jump button turns into the one primary action.
        <button
          key={actionLabel}
          type="button"
          aria-label={`Buka ${actionLabel}`}
          className="action-btn hint-pop pointer-events-auto flex h-[3.85rem] max-w-[46vw] min-w-[128px] flex-col items-center justify-center rounded-full px-5 active:scale-95"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={onAction}
        >
          <span className="flex items-center gap-1.5 text-[13px] font-semibold tracking-[0.12em] uppercase">
            <span className="text-[#e8b84a]" aria-hidden="true">✦</span>
            Buka
          </span>
          <span className="max-w-full truncate text-[10.5px] text-[#f6dfa6]/90">
            {/^buka\b/i.test(actionLabel) ? actionLabel.replace(/^buka\s*/i, "") : actionLabel}
          </span>
        </button>
      ) : (
      <button
        type="button"
        aria-label="Loncat"
        disabled={disabled}
        className={`${btn} h-[3.85rem] w-[3.85rem]`}
        onPointerDown={(event) => {
          event.stopPropagation();
          holding.current = true;
          onJump(true);
        }}
        onContextMenu={(event) => event.preventDefault()}
      >
        <Arrow dir="up" />
      </button>
      )}
      <button
        type="button"
        aria-label="Jalan ke kanan"
        disabled={disabled}
        className={btn}
        onPointerDown={startDir(1)}
        onContextMenu={(event) => event.preventDefault()}
      >
        <Arrow dir="right" />
      </button>
    </div>
  );
}
