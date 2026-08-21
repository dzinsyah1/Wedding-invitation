"use client";

import { useEffect, useRef } from "react";
import { GAME_EVENTS, gameEvents } from "@/game/events/gameEvents";
import { detectQuality } from "@/game/quality";

export default function GameCanvas({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parent = ref.current;
    if (!parent) return;
    let destroyed = false;
    let game: { destroy: (removeCanvas: boolean) => void } | null = null;

    (async () => {
      try {
        const { createWeddingGame } = await import("@/game/Game");
        if (destroyed || !ref.current) return;
        const isMobile = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
        game = createWeddingGame({
          parent: ref.current,
          reducedMotion,
          isMobile,
          quality: detectQuality(reducedMotion),
        });
      } catch (error) {
        console.error("Wedding game failed to start", error);
        gameEvents.emit(GAME_EVENTS.GAME_ERROR);
      }
    })();

    return () => {
      destroyed = true;
      game?.destroy(true);
    };
  }, [reducedMotion]);

  return <div ref={ref} className="absolute inset-0 h-full w-full" />;
}
