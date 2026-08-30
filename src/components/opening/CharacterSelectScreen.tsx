"use client";

import { useEffect, useState } from "react";
import {
  PLAYER_CHARACTER_LIST,
  PLAYER_CHARACTERS,
  type PlayerCharacter,
  type PlayerCharacterId,
} from "@/game/player/characters";
import { cutPlayerUrl } from "@/game/quality";

export default function CharacterSelectScreen({
  reducedMotion,
  musicOn,
  onToggleMusic,
  onBack,
  onConfirm,
}: {
  reducedMotion: boolean;
  musicOn: boolean;
  onToggleMusic: () => void;
  onBack: () => void;
  onConfirm: (character: PlayerCharacterId) => void;
}) {
  const [focused, setFocused] = useState<PlayerCharacterId>("male");
  const [hovered, setHovered] = useState<PlayerCharacterId | null>(null);
  const active = hovered ?? focused;
  const current = PLAYER_CHARACTERS[focused];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
        event.preventDefault();
        setFocused("male");
        setHovered(null);
      } else if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
        event.preventDefault();
        setFocused("female");
        setHovered(null);
      } else if (event.key === "Enter") {
        event.preventDefault();
        onConfirm(focused);
      } else if (event.key === "Escape") {
        event.preventDefault();
        onBack();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focused, onBack, onConfirm]);

  return (
    <div className="absolute inset-0 z-30 flex flex-col overflow-y-auto overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(40,28,16,0.18)_0%,rgba(40,28,16,0.62)_100%)]" />

      <div className="relative z-10 flex min-h-full flex-col items-center justify-between px-4 py-[max(16px,env(safe-area-inset-top))] pb-[max(16px,env(safe-area-inset-bottom))]">
        <header className="animate-fade-up mt-2 text-center">
          <div className="hint-bubble inline-flex flex-col items-center rounded-[22px] px-6 py-3">
            <p className="text-[10px] tracking-[0.42em] text-[var(--gold)]">CHARACTER SELECT</p>
            <h1 className="font-display mt-1 text-[32px] leading-none text-[var(--ink)] sm:text-[40px]">
              Pilih Tamu
            </h1>
            <p className="font-script mt-1 text-[22px] text-[var(--rose)]">Siapa yang menjelajahi taman?</p>
          </div>
        </header>

        <div
          role="listbox"
          aria-label="Pilih karakter"
          className="grid w-full max-w-[640px] grid-cols-2 gap-2 sm:gap-8"
        >
          {PLAYER_CHARACTER_LIST.map((character) => (
            <CharacterPod
              key={character.id}
              character={character}
              selected={focused === character.id}
              previewing={active === character.id}
              reducedMotion={reducedMotion}
              onHover={(value) => setHovered(value ? character.id : null)}
              onSelect={() => setFocused(character.id)}
              onConfirm={() => onConfirm(character.id)}
            />
          ))}
        </div>

        <footer className="mb-2 flex w-full max-w-[420px] flex-col items-center">
          <p className="mb-3 text-[12px] tracking-[0.12em] text-[#fff6e4]/90">{current.hint}</p>
          <button
            type="button"
            data-testid="enter-world"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              onConfirm(focused);
            }}
            className="min-h-12 w-full max-w-[280px] rounded-full border border-[var(--gold)]/80 bg-[var(--ink)] px-8 py-3 text-[11px] tracking-[0.28em] text-[var(--ivory)] shadow-[0_16px_40px_rgba(40,28,16,0.35)] transition hover:bg-[var(--brown)]"
          >
            MASUK KE TAMAN
          </button>
          <p className="mt-3 hidden text-[11px] tracking-[0.16em] text-[#fff6e4]/75 sm:block">
            ← → untuk memilih · Enter atau dobel-klik untuk masuk
          </p>
          <p className="mt-3 text-[11px] tracking-[0.16em] text-[#fff6e4]/75 sm:hidden">
            Ketuk karakter, lalu masuk ke taman
          </p>
          <div className="mt-3 flex items-center justify-center gap-5">
            <button
              type="button"
              onClick={onBack}
              className="text-[12px] tracking-[0.16em] text-[#ffe9b0]"
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={onToggleMusic}
              className="text-[12px] tracking-[0.16em] text-[#ffe9b0]"
            >
              {musicOn ? "Musik menyala" : "Musik mati"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

function CharacterPod({
  character,
  selected,
  previewing,
  reducedMotion,
  onHover,
  onSelect,
  onConfirm,
}: {
  character: PlayerCharacter;
  selected: boolean;
  previewing: boolean;
  reducedMotion: boolean;
  onHover: (inside: boolean) => void;
  onSelect: () => void;
  onConfirm: () => void;
}) {
  const [walkIndex, setWalkIndex] = useState(0);
  const [intro, setIntro] = useState(selected);

  useEffect(() => {
    if (!selected || reducedMotion) {
      setIntro(false);
      return;
    }
    setIntro(true);
    const timeout = window.setTimeout(() => setIntro(false), 420);
    return () => window.clearTimeout(timeout);
  }, [selected, reducedMotion]);

  useEffect(() => {
    if (!previewing || reducedMotion || intro) {
      setWalkIndex(0);
      return;
    }
    const id = window.setInterval(() => {
      setWalkIndex((value) => (value + 1) % character.walk.length);
    }, 220);
    return () => window.clearInterval(id);
  }, [previewing, reducedMotion, intro, character.walk.length]);

  const frame = intro
    ? character.jump
    : previewing && !reducedMotion
      ? character.walk[walkIndex]
      : character.idle;

  return (
    <button
      type="button"
      role="option"
      data-testid={`character-${character.id}`}
      aria-selected={selected}
      aria-label={`${character.label}, ${character.subtitle}`}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      onDoubleClick={(event) => {
        event.stopPropagation();
        onConfirm();
      }}
      className="group relative flex flex-col items-center bg-transparent"
    >
      <div className="relative flex h-[210px] w-full items-end justify-center sm:h-[300px]">
        <div className={`char-ring ${selected ? "char-ring-on" : ""}`} />
        <div
          className={`char-spotlight absolute bottom-8 left-1/2 h-36 w-36 -translate-x-1/2 rounded-full sm:h-44 sm:w-44 ${
            selected ? "opacity-100" : "opacity-40"
          }`}
        />
        <div
          className={`relative z-[1] origin-bottom transition-transform duration-300 ${
            selected ? "scale-110" : "scale-95 opacity-80 group-hover:scale-100 group-hover:opacity-100"
          }`}
        >
          <img
            src={cutPlayerUrl(`${frame}.png`)}
            alt=""
            draggable={false}
            className={`h-[200px] w-auto max-w-none object-contain drop-shadow-[0_18px_18px_rgba(40,28,16,0.35)] sm:h-[290px] ${
              previewing && !reducedMotion ? "" : "char-bob"
            }`}
          />
        </div>
        <div className={`char-pedestal absolute bottom-2 left-1/2 -translate-x-1/2 ${selected ? "char-pedestal-on" : ""}`} />
      </div>

      <div className={`char-plate mt-1 ${selected ? "char-plate-on" : ""}`}>
        {selected ? <span className="char-ready">READY</span> : null}
        <p className="font-display text-[22px] leading-none text-[var(--ink)] sm:text-[26px]">{character.label}</p>
        <p className="mt-1 text-[10px] tracking-[0.28em] text-[var(--gold)] uppercase">{character.subtitle}</p>
      </div>
    </button>
  );
}
