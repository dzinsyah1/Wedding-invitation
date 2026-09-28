"use client";

import { useEffect, useRef, useState } from "react";
import { GAME_EVENTS, gameEvents, type PromptPayload, type PromptPosPayload } from "@/game/events/gameEvents";
import { useInvitationStore } from "@/store/invitationStore";
import { useTouchUI } from "@/lib/useTouchUI";

const LEARNED_KEY = "hint-learned";

function readLearned() {
  try {
    return window.localStorage.getItem(LEARNED_KEY) === "1";
  } catch {
    return false;
  }
}

export default function InteractionHint() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const prompt = useInvitationStore((s) => s.prompt);
  const modal = useInvitationStore((s) => s.modal);
  const instructionVisible = useInvitationStore((s) => s.instructionVisible);
  const visible = Boolean(prompt) && !modal && !instructionVisible;
  // On touch screens the primary "Buka" button lives in the control bar, so the
  // in-world marker is just a quiet, still-tappable name tag.
  const touch = useTouchUI();
  // Until the guest has opened something once, the hint pulses and shows a pointing hand.
  const [learned, setLearned] = useState(true);

  useEffect(() => {
    setLearned(readLearned());
  }, []);

  useEffect(() => {
    const apply = (x: number, y: number) => {
      const el = wrapRef.current;
      if (!el || !Number.isFinite(x) || !Number.isFinite(y)) return;
      // Keep the bubble (plus the pointing hand) inside the screen near the edges.
      const half = el.offsetWidth / 2 + 12;
      const maxX = (el.offsetParent?.clientWidth ?? window.innerWidth) - half - 12;
      el.style.left = `${Math.max(half, Math.min(maxX, x))}px`;
      el.style.top = `${y}px`;
    };
    const offPos = gameEvents.on(GAME_EVENTS.PROMPT_POS, (payload) => {
      const data = payload as PromptPosPayload;
      apply(data.x, data.y);
    });
    const offShow = gameEvents.on(GAME_EVENTS.SHOW_PROMPT, (payload) => {
      const data = payload as PromptPayload;
      if (data.screenX != null && data.screenY != null) apply(data.screenX, data.screenY);
    });
    const offModal = gameEvents.on(GAME_EVENTS.OPEN_MODAL, () => {
      setLearned(true);
      try {
        window.localStorage.setItem(LEARNED_KEY, "1");
      } catch {
        /* storage unavailable */
      }
    });
    return () => {
      offPos();
      offShow();
      offModal();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`absolute left-0 top-0 z-20 -translate-x-1/2 -translate-y-full transition-opacity duration-200 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {/* key re-mounts the bubble per location so the pop-in replays on arrival */}
      {touch ? (
        <button
          key={prompt?.locationId ?? "none"}
          type="button"
          aria-label={prompt ? `${prompt.label}, buka` : undefined}
          onClick={() => gameEvents.emit(GAME_EVENTS.INTERACT)}
          className="hint-tag hint-pop relative flex items-center gap-2 rounded-full py-1.5 pr-4 pl-3 active:scale-95"
        >
          <span className="hint-tag-dot" aria-hidden="true" />
          <span className="font-script text-[20px] leading-none whitespace-nowrap text-[#4a3d32]">{prompt?.label ?? ""}</span>
          <span className="hint-bubble-tail" />
        </button>
      ) : (
      <button
        key={prompt?.locationId ?? "none"}
        type="button"
        aria-label={prompt ? `${prompt.label}, buka` : undefined}
        onClick={() => gameEvents.emit(GAME_EVENTS.INTERACT)}
        className={`hint-bubble hint-pop group relative block min-w-[180px] cursor-pointer rounded-[22px] px-5 pt-3 pb-2 text-center transition-transform hover:scale-[1.04] active:scale-95 ${
          learned ? "" : "hint-pulse"
        }`}
      >
        <p className="font-script text-[26px] leading-none text-[#4a3d32]">{prompt?.label ?? ""}</p>
        <span className="hint-cta mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-display text-[11px] font-semibold tracking-[0.14em] whitespace-nowrap uppercase">
          Klik atau tekan
          <kbd className="hint-key">E</kbd>
        </span>
        <span className="hint-bubble-tail" />
        {!learned ? (
          <span className="hint-hand pointer-events-none absolute -right-5 -bottom-5 text-[#5b4631]" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="h-8 w-8 -rotate-[20deg] drop-shadow" fill="#fffaf0">
              <path
                d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10m0-.5a1.5 1.5 0 0 1 3 0v1m0-.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-.6a5 5 0 0 1-3.9-1.9l-2.9-3.7a1.5 1.5 0 0 1 2.3-1.9L9 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        ) : null}
      </button>
      )}
    </div>
  );
}
