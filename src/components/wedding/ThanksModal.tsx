"use client";

import { wedding } from "@/data/wedding";
import ModalShell from "@/components/modal/ModalShell";
import Flourish from "@/components/ui/Flourish";
import { useInvitationStore } from "@/store/invitationStore";

const family = (parents: string) => parents.replace(/^Putr[ai] dari /, "Keluarga ");

export default function ThanksModal({ onClose }: { onClose: () => void }) {
  const guestName = useInvitationStore((s) => s.guestName);
  const { prayer, closing, couple, names } = wedding;

  return (
    <ModalShell title="Pesan Terakhir" onClose={onClose}>
      {/* Prayer for the couple: the heart of this closing message. */}
      <figure className="prayer-card relative overflow-hidden rounded-[24px] px-5 pt-5 pb-5 text-center">
        <span className="prayer-shine pointer-events-none absolute inset-0" aria-hidden="true" />
        <p className="text-[10px] font-semibold tracking-[0.34em] text-[#f6dfa6] uppercase">Doa untuk Mempelai</p>
        <p className="font-arabic mt-3 text-[26px] leading-[1.9] text-[#fff8ea] [text-wrap:balance] sm:text-[28px]">{prayer.arabic}</p>
        <div className="mx-auto my-3 h-px w-20 bg-[linear-gradient(90deg,transparent,#f6dfa6,transparent)]" />
        <blockquote className="text-[13px] leading-relaxed text-[#fff1d6]/95 italic">“{prayer.translation}”</blockquote>
        <figcaption className="mt-3 text-[10px] font-semibold tracking-[0.26em] text-[#f6dfa6]/85 uppercase">
          {prayer.source}
        </figcaption>
      </figure>

      <div className="mt-6 text-center">
        <p className="text-[13.5px] leading-relaxed text-[#6b5339]">{closing.message}</p>
        {guestName ? (
          <p className="mt-3 text-[13.5px] leading-relaxed text-[#6b5339]">
            Kehadiran <span className="font-semibold text-[#4a3d32]">{guestName}</span> akan melengkapi kebahagiaan kami.
          </p>
        ) : null}
        <p className="font-display mt-4 text-[17px] text-[#4a3d32] italic">{closing.salam}</p>
      </div>

      <div className="mt-6 text-center">
        <Flourish className="mx-auto h-4 w-28" />
        <p className="mt-3 text-[10px] font-semibold tracking-[0.34em] text-[#c4a35a] uppercase">Kami yang berbahagia</p>
        <p className="font-script mt-1 text-[40px] leading-none text-[#4a3d32]">{names.display}</p>
        <div className="mt-3 space-y-0.5 text-[12.5px] text-[#6a9e8a]">
          <p>{family(couple.groom.parents)}</p>
          <p>{family(couple.bride.parents)}</p>
        </div>
      </div>
    </ModalShell>
  );
}
