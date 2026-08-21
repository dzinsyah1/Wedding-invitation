"use client";

import { wedding } from "@/data/wedding";
import ModalShell from "@/components/modal/ModalShell";

export default function ThanksModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell title="Thank You" onClose={onClose}>
      <div className="py-4 text-center">
        <p className="font-display text-2xl">Thank you for being part of our special day.</p>
        <p className="font-script mt-6 text-3xl text-[var(--rose)]">With love,</p>
        <p className="font-display mt-2 text-3xl">{wedding.names.display} ❤️</p>
      </div>
    </ModalShell>
  );
}
