"use client";

import { wedding } from "@/data/wedding";
import ModalShell from "@/components/modal/ModalShell";
import { AlbumGrid } from "@/components/ui/PhotoAlbum";

export default function GalleryModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell title="Our Memories" onClose={onClose}>
      <p className="text-center text-[13px] leading-relaxed text-[#6b5339]">
        Sepenggal kisah yang kami abadikan, menuju hari bahagia kami.
      </p>
      <AlbumGrid items={wedding.album} className="mt-4" />
      <p className="mt-4 text-center text-[11px] tracking-[0.2em] text-[#8b6a3c] uppercase">
        {wedding.album.length} momen · ketuk untuk memperbesar
      </p>
    </ModalShell>
  );
}
