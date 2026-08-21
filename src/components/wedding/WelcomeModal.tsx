"use client";

import { wedding } from "@/data/wedding";
import ModalShell from "@/components/modal/ModalShell";
import Flourish from "@/components/ui/Flourish";

export default function WelcomeModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell title="Undangan" onClose={onClose}>
      <div className="text-center">
        <p className="font-script text-2xl text-[var(--gold)]">{wedding.welcome.bismillah}</p>
        <p className="mt-3 text-sm text-[var(--teal)]">{wedding.welcome.greeting}</p>
        <h3 className="font-display mt-5 text-3xl">{wedding.names.display}</h3>
        <p className="mt-1 tracking-[0.28em] text-[var(--brown)]">{wedding.dateDisplay.replaceAll(".", " · ")}</p>
        <Flourish className="mx-auto mt-4 h-5 w-32" />
        <p className="mt-4 text-sm leading-7">{wedding.welcome.message}</p>
        <p className="mt-4 text-sm italic text-[var(--sage)]">{wedding.welcome.doa}</p>
      </div>
    </ModalShell>
  );
}
