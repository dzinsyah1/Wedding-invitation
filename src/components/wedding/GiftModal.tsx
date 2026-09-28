"use client";

import { wedding } from "@/data/wedding";
import ModalShell from "@/components/modal/ModalShell";
import GiftAccounts from "@/components/wedding/GiftAccounts";

export default function GiftModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell title="Wedding Gift" onClose={onClose}>
      <p className="text-center text-[13px] leading-relaxed text-[#6b5339]">
        {wedding.gift.message} Namun jika Anda ingin memberikan tanda kasih, dapat melalui:
      </p>
      <div className="mt-4">
        <GiftAccounts compact />
      </div>
    </ModalShell>
  );
}
