"use client";

import { wedding } from "@/data/wedding";
import ModalShell from "@/components/modal/ModalShell";

function PersonCard({
  photo,
  title,
  fullName,
  nickname,
  parents,
}: {
  photo: string;
  title: string;
  fullName: string;
  nickname: string;
  parents: string;
}) {
  return (
    <article className="rounded-[22px] border border-[var(--gold)]/30 bg-[var(--ivory)]/70 p-4 text-center">
      <div className="mx-auto w-fit rounded-[18px] border border-[var(--gold)]/40 p-1.5">
        <img
          src={photo}
          alt={fullName}
          className="h-40 w-32 rounded-[14px] object-cover"
        />
      </div>
      <p className="mt-3 text-[10px] tracking-[0.28em] text-[var(--gold)]">{title}</p>
      <h3 className="font-display mt-1 text-2xl">{fullName}</h3>
      <p className="font-script text-lg text-[var(--rose)]">{nickname}</p>
      <p className="mt-2 text-xs leading-5 text-[var(--teal)]">{parents}</p>
    </article>
  );
}

export default function CoupleModal({ onClose }: { onClose: () => void }) {
  const { groom, bride } = wedding.couple;
  return (
    <ModalShell title="Kenali Kami" onClose={onClose}>
      <div className="grid gap-4 sm:grid-cols-2">
        <PersonCard {...groom} />
        <PersonCard {...bride} />
      </div>
    </ModalShell>
  );
}
