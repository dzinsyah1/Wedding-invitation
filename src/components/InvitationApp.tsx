"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { GAME_EVENTS, gameEvents, type OpenModalPayload, type PromptPayload } from "@/game/events/gameEvents";
import { useInvitationStore } from "@/store/invitationStore";
import { track } from "@/lib/analytics";
import { readGuestName } from "@/lib/guest";
import type { PlayerCharacterId } from "@/game/player/characters";
import LoadingScreen from "@/components/opening/LoadingScreen";
import OpeningScreen from "@/components/opening/OpeningScreen";
import PortalTransition, { PORTAL_COVER_MS, type PortalOrigin } from "@/components/opening/PortalTransition";
import CharacterSelectScreen from "@/components/opening/CharacterSelectScreen";
import MovementControls from "@/components/controls/MovementControls";
import QuickNav from "@/components/navigation/QuickNav";
import InteractionHint from "@/components/game/InteractionHint";
import PlayHud from "@/components/game/PlayHud";
import FullInvitation from "@/components/invitation/FullInvitation";
import { Toaster } from "@/components/ui/Toast";
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
  const [portal, setPortal] = useState<PortalOrigin | null>(null);
  const [landed, setLanded] = useState(false);
  const endPortal = useCallback(() => setPortal(null), []);
  // Where "Kembali" returns to from the full invitation page.
  const [invitationFrom, setInvitationFrom] = useState<"opening" | "playing">("opening");

  useEffect(() => {
    track("invitation_opened");
    const guest = readGuestName(window.location.search);
    if (guest) store.setGuestName(guest);
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
    const offLanded = gameEvents.on(GAME_EVENTS.PLAYER_LANDED, () => {
      setLanded(true);
      window.setTimeout(() => useInvitationStore.getState().setInstructionVisible(false), 3600);
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
      offLanded();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function closeModal() {
    store.closeModal();
    gameEvents.emit(GAME_EVENTS.MODAL_STATE, false);
  }

  function openCharacterSelect(origin: PortalOrigin) {
    if (portal) return;
    // Music starts here: this click is the user gesture browsers require for playback.
    if (store.musicOn) gameEvents.emit(GAME_EVENTS.TOGGLE_MUSIC, true);
    track("portal_entered");
    setPortal(origin);
    // Swap scenes while the screen is flooded with light.
    window.setTimeout(() => store.setPhase("select"), store.reducedMotion ? 300 : PORTAL_COVER_MS);
  }

  function enterWorld(character: PlayerCharacterId) {
    store.setSelectedCharacter(character);
    store.setPhase("playing");
    // Hide prompts during the arrival descent; the intro hint shows after touchdown.
    store.setInstructionVisible(true);
    gameEvents.emit(GAME_EVENTS.ENTER_WORLD, { character });
    track("game_started", { character });
    if (store.musicOn) gameEvents.emit(GAME_EVENTS.TOGGLE_MUSIC, true);
  }

  function openInvitation(from: "opening" | "playing") {
    setInvitationFrom(from);
    store.setPhase("invitation");
    gameEvents.emit(GAME_EVENTS.OVERLAY_STATE, true);
    if (store.musicOn) gameEvents.emit(GAME_EVENTS.TOGGLE_MUSIC, true);
  }

  function closeInvitation(to: "opening" | "select" | "playing") {
    store.setPhase(to);
    gameEvents.emit(GAME_EVENTS.OVERLAY_STATE, false);
  }

  function toggleMusic() {
    const next = !store.musicOn;
    store.setMusicOn(next);
    if (store.phase !== "opening" && store.phase !== "loading") gameEvents.emit(GAME_EVENTS.TOGGLE_MUSIC, next);
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
          onEnter={openCharacterSelect}
          leaving={Boolean(portal)}
          onViewInvitation={() => openInvitation("opening")}
        />
      ) : null}

      {store.phase === "select" ? (
        <CharacterSelectScreen
          guestName={store.guestName}
          reducedMotion={store.reducedMotion}
          musicOn={store.musicOn}
          onToggleMusic={toggleMusic}
          onBack={() => store.setPhase("opening")}
          onConfirm={enterWorld}
        />
      ) : null}

      {store.phase === "playing" ? (
        <>
          <QuickNav
            musicOn={store.musicOn}
            onToggleMusic={toggleMusic}
            onTeleport={(id) => {
              gameEvents.emit(GAME_EVENTS.TELEPORT_TO, { locationId: id });
              track("teleport", { locationId: id });
            }}
            currentId={store.prompt?.locationId}
            tipReady={!store.instructionVisible}
            onFallback={() => openInvitation("playing")}
          />
          <MovementControls
            disabled={Boolean(store.modal)}
            actionLabel={store.instructionVisible ? null : store.prompt?.label}
            onAction={() => gameEvents.emit(GAME_EVENTS.INTERACT)}
            onDir={(dir) => gameEvents.emit(GAME_EVENTS.MOVE, dir)}
            onJump={(down) => gameEvents.emit(GAME_EVENTS.JUMP, down)}
          />
          {store.instructionVisible && landed ? (
            <div className="pointer-events-none absolute top-[18%] left-1/2 z-20 -translate-x-1/2">
              <div className="hint-bubble rounded-[22px] px-6 py-3 text-center">
                <p className="font-script text-[24px] leading-none text-[#4a3d32]">
                  Jelajahi taman kami
                </p>
                <p className="mt-1.5 font-display text-[9px] tracking-[0.34em] text-[#c4a35a] uppercase">
                  Dekati tempat bercahaya, lalu buka
                </p>
              </div>
            </div>
          ) : null}
          <InteractionHint />
          <PlayHud hidden={!landed || Boolean(store.modal)} quiet={store.instructionVisible} onOpenInvitation={() => openInvitation("playing")} />
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

      {store.phase === "invitation" ? (
        <FullInvitation
          guestName={store.guestName}
          musicOn={store.musicOn}
          onToggleMusic={toggleMusic}
          onBack={() => closeInvitation(invitationFrom)}
          backLabel={invitationFrom === "playing" ? "Kembali ke taman" : "Kembali"}
          onExplore={() => closeInvitation(invitationFrom === "playing" ? "playing" : "select")}
        />
      ) : null}

      {store.phase === "fallback" ? (
        <FullInvitation guestName={store.guestName} musicOn={store.musicOn} onToggleMusic={toggleMusic} />
      ) : null}
      {portal ? <PortalTransition origin={portal} reducedMotion={store.reducedMotion} onDone={endPortal} /> : null}
      <Toaster />
    </main>
  );
}
