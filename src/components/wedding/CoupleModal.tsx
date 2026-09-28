"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { wedding } from "@/data/wedding";
import ModalShell from "@/components/modal/ModalShell";
import Flourish from "@/components/ui/Flourish";
import type { Person } from "@/types/wedding";

// Photo paths contain spaces ("photo-profile/...").
const photoOf = (person: Person) => encodeURI(person.portrait ?? person.photo);

// "Putra dari Alm. Bapak X & Ibu Y" -> intro line + the two parents on their own lines.
function splitParents(parents: string) {
  const match = parents.match(/^(Putr[ai] dari)\s+(.*)$/);
  const intro = match?.[1] ?? "";
  const names = (match?.[2] ?? parents).split(/\s*&\s*/);
  return { intro, names };
}

function PersonCard({
  person,
  role,
  side,
  onZoom,
}: {
  person: Person;
  role: string;
  side: "l" | "r";
  onZoom: () => void;
}) {
  const { intro, names } = splitParents(person.parents);
  return (
    <article className={`couple-card couple-in couple-in-${side} flex items-center gap-4 rounded-[24px] p-3.5 sm:flex-col sm:gap-0 sm:p-5 sm:text-center`}>
      <button
        type="button"
        onClick={onZoom}
        aria-label={`Perbesar foto ${person.nickname}`}
        className="group relative shrink-0"
      >
        <span className="couple-frame absolute -inset-[5px] rounded-t-[999px] rounded-b-[18px] border border-[#d4af5a]/60" />
        <span className="relative block h-[132px] w-[100px] overflow-hidden rounded-t-[999px] rounded-b-[14px] bg-[#efe3cc] shadow-[0_12px_26px_rgba(80,60,30,0.18)] sm:h-[190px] sm:w-[146px]">
          <img
            src={photoOf(person)}
            alt={person.fullName}
            className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
          />
        </span>
      </button>

      <div className="min-w-0 flex-1 sm:mt-5">
        <p className="text-[10px] font-semibold tracking-[0.28em] text-[#c4a35a] uppercase">{role}</p>
        <p className="font-script mt-0.5 text-[34px] leading-[1.05] text-[#4a3d32]">{person.nickname}</p>
        <h3 className="font-display text-[17px] leading-snug font-semibold text-[#3d4a3f] sm:text-[20px]">
          {person.fullName}
        </h3>
        <div className="mt-2 border-t border-[#d4af5a]/30 pt-2 text-[12px] leading-[1.5] text-[#6a9e8a]">
          {intro ? <p className="text-[#8b6a3c]">{intro}</p> : null}
          {names.map((name) => (
            <p key={name}>{name}</p>
          ))}
        </div>
      </div>
    </article>
  );
}

// Portalled to <body>: inside the modal card (which animates `transform`), a
// fixed overlay would be clipped to the card instead of covering the screen.
function PhotoZoom({ person, onClose }: { person: Person; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-label={`Foto ${person.nickname}`}
      className="photo-zoom fixed inset-0 z-[80] flex flex-col items-center justify-center px-6 pt-[max(24px,env(safe-area-inset-top))] pb-[max(24px,env(safe-area-inset-bottom))]"
      onPointerDown={(event) => {
        event.stopPropagation();
        onClose();
      }}
    >
      <button
        type="button"
        aria-label="Tutup foto"
        className="absolute top-[max(16px,env(safe-area-inset-top))] right-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-2xl leading-none text-white backdrop-blur"
      >
        ×
      </button>
      <div className="photo-zoom-frame relative min-h-0 w-full max-w-[380px] shrink rounded-t-[999px] rounded-b-[28px] p-2">
        <img
          src={photoOf(person)}
          alt={person.fullName}
          className="block max-h-[62dvh] w-full rounded-t-[999px] rounded-b-[22px] object-cover object-top"
        />
      </div>
      <p className="font-script mt-5 text-[40px] leading-none text-[#f6dfa6]">{person.nickname}</p>
      <p className="font-display mt-1 text-[18px] text-white/90">{person.fullName}</p>
      <p className="mt-6 text-[10px] tracking-[0.3em] text-white/45 uppercase">Ketuk di mana saja untuk menutup</p>
    </div>,
    document.body
  );
}

export default function CoupleModal({ onClose }: { onClose: () => void }) {
  const { groom, bride } = wedding.couple;
  const [zoom, setZoom] = useState<Person | null>(null);

  return (
    <ModalShell title="Kenali Kami" onClose={onClose}>
      <p className="text-center text-[13px] leading-relaxed text-[#6b5339]">
        Dengan memohon rahmat dan ridho Allah SWT, kami yang berbahagia
      </p>

      <div className="relative mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4">
        <PersonCard person={groom} role="Mempelai Pria" side="l" onZoom={() => setZoom(groom)} />
        <span
          aria-hidden="true"
          className="couple-amp font-script pointer-events-none z-10 mx-auto -my-5 flex h-11 w-11 items-center justify-center rounded-full border border-[#d4af5a]/50 bg-[#fffaf0] pt-1 text-[26px] leading-none text-[#d49aa0] shadow-[0_6px_16px_rgba(80,60,30,0.12)] sm:absolute sm:top-[118px] sm:left-[calc(50%-22px)] sm:m-0"
        >
          &amp;
        </span>
        <PersonCard person={bride} role="Mempelai Wanita" side="r" onZoom={() => setZoom(bride)} />
      </div>

      <Flourish className="mx-auto mt-5 h-4 w-28" />
      <p className="mt-2 text-center text-[12px] text-[#8b6a3c]">Ketuk foto untuk memperbesar</p>

      {zoom ? <PhotoZoom person={zoom} onClose={() => setZoom(null)} /> : null}
    </ModalShell>
  );
}
