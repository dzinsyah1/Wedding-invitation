"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { GAME_EVENTS, gameEvents, type OpenModalPayload, type PromptPayload } from "@/game/events/gameEvents";
import { useInvitationStore } from "@/store/invitationStore";
import { track } from "@/lib/analytics";
import LoadingScreen from "@/components/opening/LoadingScreen";
import OpeningScreen from "@/components/opening/OpeningScreen";
import MovementControls from "@/components/controls/MovementControls";
import QuickNav from "@/components/navigation/QuickNav";
import InteractionHint from "@/components/game/InteractionHint";
import FallbackInvitation from "@/components/fallback/FallbackInvitation";
import WelcomeModal from "@/components/wedding/WelcomeModal";
import CoupleModal from "@/components/wedding/CoupleModal";
import StoryModal from "@/components/wedding/StoryModal";
import EventModal from "@/components/wedding/EventModal";
import CountdownModal from "@/components/wedding/CountdownModal";
import GalleryModal from "@/components/wedding/GalleryModal";
import RsvpModal from "@/components/wedding/RsvpModal";
import GiftModal from "@/components/wedding/GiftModal";
import ThanksModal from "@/components/wedding/ThanksModal";

const GameCanvas = dynamic(() => import("@/components/game/GameCanvas"), { ssr: false });

export default function InvitationApp() {
  const store = useInvitationStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    track("invitation_opened");
    const params = new URLSearchParams(window.location.search);
    const to = params.get("to");
    if (to) store.setGuestName(to);
    store.setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    const offProgress = gameEvents.on(GAME_EVENTS.LOAD_PROGRESS, (payload) => {
      const progress = (payload as { progress?: number })?.progress ?? 0;
      store.setProgress(progress);
    });
    const offReady = gameEvents.on(GAME_EVENTS.GAME_READY, () => {
      setReady(true);
      store.setProgress(1);
      const phase = useInvitationStore.getState().phase;
      if (phase === "loading" || phase === "fallback") store.setPhase("opening");
    });
    const offError = gameEvents.on(GAME_EVENTS.GAME_ERROR, () => store.setPhase("fallback"));
    const offPrompt = gameEvents.on(GAME_EVENTS.SHOW_PROMPT, (payload) => {
      store.setPrompt(payload as PromptPayload);
    });
    const offHide = gameEvents.on(GAME_EVENTS.HIDE_PROMPT, () => store.setPrompt(null));
    const offModal = gameEvents.on(GAME_EVENTS.OPEN_MODAL, (payload) => {
      const data = payload as OpenModalPayload;
      store.openModal(data.type, data.eventId);
      gameEvents.emit(GAME_EVENTS.MODAL_STATE, true);
      track(`${data.type}_opened`);
    });
    const offVisit = gameEvents.on(GAME_EVENTS.LOCATION_VISITED, (payload) => {
      const id = (payload as { locationId?: string })?.locationId;
      if (id) track("location_visited", { locationId: id });
    });

    return () => {
      offProgress();
      offReady();
      offError();
      offPrompt();
      offHide();
      offModal();
      offVisit();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function closeModal() {
    store.closeModal();
    gameEvents.emit(GAME_EVENTS.MODAL_STATE, false);
  }

  function enterWorld() {
    store.setPhase("playing");
    store.setInstructionVisible(true);
    gameEvents.emit(GAME_EVENTS.ENTER_WORLD);
    track("game_started");
    if (store.musicOn) gameEvents.emit(GAME_EVENTS.TOGGLE_MUSIC, true);
    window.setTimeout(() => store.setInstructionVisible(false), 3600);
  }

  function toggleMusic() {
    const next = !store.musicOn;
    store.setMusicOn(next);
    if (store.phase === "playing") gameEvents.emit(GAME_EVENTS.TOGGLE_MUSIC, next);
    if (next) track("music_started");
  }

  const showWorld = store.phase !== "fallback";

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-[var(--cream)]">
      <GameCanvas reducedMotion={store.reducedMotion} />
      {showWorld ? (
        <div className="pointer-events-none absolute inset-0 z-[5] shadow-[inset_0_0_160px_rgba(20,50,90,0.28)]" />
      ) : null}

      {store.phase === "loading" ? <LoadingScreen progress={store.progress} /> : null}

      {store.phase === "opening" ? (
        <OpeningScreen
          guestName={store.guestName}
          musicOn={store.musicOn}
          onToggleMusic={toggleMusic}
          onEnter={enterWorld}
        />
      ) : null}

      {store.phase === "playing" ? (
        <>
          <QuickNav
            musicOn={store.musicOn}
            onToggleMusic={toggleMusic}
            onNavigate={(id) => gameEvents.emit(GAME_EVENTS.NAVIGATE_TO, { locationId: id })}
            onFallback={() => store.setPhase("fallback")}
          />
          <MovementControls
            disabled={Boolean(store.modal)}
            onDir={(dir) => gameEvents.emit(GAME_EVENTS.MOVE, dir)}
            onJump={(down) => gameEvents.emit(GAME_EVENTS.JUMP, down)}
          />
          {store.instructionVisible ? (
            <div className="pointer-events-none absolute top-[18%] left-1/2 z-20 -translate-x-1/2">
              <div className="hint-bubble rounded-[22px] px-6 py-3 text-center">
                <p className="font-script text-[24px] leading-none text-[#4a3d32]">
                  Jelajahi taman kami
                </p>
                <p className="mt-1.5 font-display text-[9px] tracking-[0.34em] text-[#c4a35a] uppercase">
                  Ketuk tokoh & tempat
                </p>
              </div>
            </div>
          ) : null}
          <InteractionHint />
        </>
      ) : null}

      {store.modal === "welcome" ? <WelcomeModal onClose={closeModal} /> : null}
      {store.modal === "couple" ? <CoupleModal onClose={closeModal} /> : null}
      {store.modal === "story" ? <StoryModal onClose={closeModal} /> : null}
      {store.modal === "event" ? <EventModal eventId={store.modalEventId} onClose={closeModal} /> : null}
      {store.modal === "countdown" ? <CountdownModal onClose={closeModal} /> : null}
      {store.modal === "gallery" ? <GalleryModal onClose={closeModal} /> : null}
      {store.modal === "rsvp" ? <RsvpModal onClose={closeModal} /> : null}
      {store.modal === "gift" ? <GiftModal onClose={closeModal} /> : null}
      {store.modal === "thanks" ? <ThanksModal onClose={closeModal} /> : null}

      {store.phase === "fallback" ? (
        <FallbackInvitation
          guestName={store.guestName}
          onBack={ready ? () => store.setPhase("playing") : undefined}
        />
      ) : null}
    </main>
  );
}
