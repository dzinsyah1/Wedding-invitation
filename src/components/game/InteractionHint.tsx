"use client";

import { useEffect, useRef } from "react";
import { GAME_EVENTS, gameEvents, type PromptPayload, type PromptPosPayload } from "@/game/events/gameEvents";
import { useInvitationStore } from "@/store/invitationStore";

export default function InteractionHint() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const prompt = useInvitationStore((s) => s.prompt);
  const modal = useInvitationStore((s) => s.modal);
  const instructionVisible = useInvitationStore((s) => s.instructionVisible);
  const visible = Boolean(prompt) && !modal && !instructionVisible;

  useEffect(() => {
    const apply = (x: number, y: number) => {
      if (!wrapRef.current || !Number.isFinite(x) || !Number.isFinite(y)) return;
      wrapRef.current.style.left = `${x}px`;
      wrapRef.current.style.top = `${y}px`;
    };
    const offPos = gameEvents.on(GAME_EVENTS.PROMPT_POS, (payload) => {
      const data = payload as PromptPosPayload;
      apply(data.x, data.y);
    });
    const offShow = gameEvents.on(GAME_EVENTS.SHOW_PROMPT, (payload) => {
      const data = payload as PromptPayload;
      if (data.screenX != null && data.screenY != null) apply(data.screenX, data.screenY);
    });
    return () => {
      offPos();
      offShow();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`absolute left-0 top-0 z-20 -translate-x-1/2 -translate-y-full transition-opacity duration-200 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <button
        type="button"
        onClick={() => gameEvents.emit(GAME_EVENTS.INTERACT)}
        className="hint-bubble relative block min-w-[148px] rounded-[20px] px-4 py-2 text-center sm:min-w-[168px] sm:rounded-[22px] sm:px-5 sm:py-2.5"
      >
        <p className="font-script text-[20px] leading-none text-[#4a3d32] sm:text-[25px]">
          {prompt?.label ?? ""}
        </p>
        <p className="mt-1 font-display text-[8px] tracking-[0.34em] text-[#c4a35a] uppercase sm:mt-1.5 sm:text-[9px]">
          Ketuk
        </p>
        <span className="hint-bubble-tail" />
      </button>
    </div>
  );
}
