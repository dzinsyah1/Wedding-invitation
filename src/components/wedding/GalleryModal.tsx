"use client";

import { useState } from "react";
import { wedding } from "@/data/wedding";
import ModalShell from "@/components/modal/ModalShell";

export default function GalleryModal({ onClose }: { onClose: () => void }) {
  const [active, setActive] = useState<number | null>(null);
  const item = active !== null ? wedding.gallery[active] : null;

  return (
    <ModalShell title="Our Memories" onClose={onClose}>
      <div className="grid grid-cols-2 gap-3">
        {wedding.gallery.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            className="animate-fade-up overflow-hidden rounded-2xl"
            style={{ animationDelay: `${index * 0.08}s` }}
            onClick={() => setActive(index)}
          >
            <img src={photo.src} alt={photo.caption} loading="lazy" className="h-28 w-full object-cover" />
          </button>
        ))}
      </div>
      {item ? (
        <div className="absolute inset-0 z-10 flex flex-col bg-black/80">
          <img src={item.src} alt={item.caption} className="h-full w-full object-contain" />
          <p className="absolute bottom-16 inset-x-4 text-center text-sm text-white">{item.caption}</p>
          <div className="absolute bottom-4 inset-x-4 flex justify-between text-white">
            <button type="button" onClick={() => setActive((v) => Math.max(0, (v ?? 0) - 1))}>
              ←
            </button>
            <button type="button" onClick={() => setActive(null)}>
              Tutup
            </button>
            <button
              type="button"
              onClick={() => setActive((v) => Math.min(wedding.gallery.length - 1, (v ?? 0) + 1))}
            >
              →
            </button>
          </div>
        </div>
      ) : null}
    </ModalShell>
  );
}
