"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { GalleryItem } from "@/types/wedding";

// Photo paths contain spaces ("photo album/...").
const src = (item: GalleryItem) => encodeURI(item.src);

// Masonry tile shapes, cycled so neighbouring columns never line up.
const SHAPES = ["aspect-[3/4]", "aspect-[4/5]", "aspect-[2/3]", "aspect-[4/5]", "aspect-[3/4]", "aspect-[5/6]"];

/**
 * Hero photo on top, the rest in a two-column masonry. Tapping any photo opens
 * a full-screen lightbox with swipe, arrows and a thumbnail strip.
 */
export function AlbumGrid({ items, className = "" }: { items: GalleryItem[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const [hero, ...rest] = items;
  if (!hero) return null;

  return (
    <div className={className}>
      <AlbumTile item={hero} index={0} onOpen={setOpen} className="aspect-[4/5] w-full" objectPosition="50% 62%" />
      <div className="mt-2.5 columns-2 gap-2.5">
        {rest.map((item, i) => (
          <AlbumTile
            key={item.id}
            item={item}
            index={i + 1}
            onOpen={setOpen}
            className={`mb-2.5 w-full break-inside-avoid ${SHAPES[i % SHAPES.length]}`}
          />
        ))}
      </div>
      {open !== null ? <PhotoLightbox items={items} index={open} onChange={setOpen} onClose={() => setOpen(null)} /> : null}
    </div>
  );
}

function AlbumTile({
  item,
  index,
  onOpen,
  className,
  objectPosition = "50% 25%",
}: {
  item: GalleryItem;
  index: number;
  onOpen: (index: number) => void;
  className: string;
  objectPosition?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`Buka foto ${index + 1}`}
      className={`album-tile group relative block overflow-hidden rounded-[18px] bg-[#efe3cc] ${className}`}
      style={{ animationDelay: `${0.05 * Math.min(index, 8) + 0.25}s` }}
    >
      <img
        src={src(item)}
        alt={item.caption || `Foto ${index + 1}`}
        loading="lazy"
        decoding="async"
        style={{ objectPosition }}
        className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
      />
      <span className="pointer-events-none absolute inset-[5px] rounded-[14px] border border-white/55" />
      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(40,28,14,0.28))] opacity-0 transition duration-300 group-hover:opacity-100" />
    </button>
  );
}

export function PhotoLightbox({
  items,
  index,
  onChange,
  onClose,
}: {
  items: GalleryItem[];
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
}) {
  const touchX = useRef<number | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const count = items.length;
  const prev = () => onChange((index - 1 + count) % count);
  const next = () => onChange((index + 1) % count);

  // Capture phase + stopPropagation so Esc closes only the lightbox, not the modal under it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else return;
      e.stopPropagation();
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  });

  useEffect(() => {
    stripRef.current
      ?.querySelector<HTMLElement>(`[data-i="${index}"]`)
      ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index]);

  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  return createPortal(
    <div
      role="dialog"
      aria-label={`Foto ${index + 1} dari ${count}`}
      className="photo-zoom fixed inset-0 z-[80] flex flex-col"
      onPointerDown={stop}
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
      }}
    >
      <div
        className="flex shrink-0 items-center justify-between px-4"
        style={{ paddingTop: "max(14px, env(safe-area-inset-top))" }}
      >
        <p className="font-display text-[15px] tracking-[0.3em] text-[#f6dfa6]">
          {String(index + 1).padStart(2, "0")} <span className="text-white/40">/ {String(count).padStart(2, "0")}</span>
        </p>
        <button
          type="button"
          aria-label="Tutup"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-2xl leading-none text-white backdrop-blur"
        >
          ×
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 py-3">
        <img
          key={index}
          src={src(items[index])}
          alt={items[index].caption || `Foto ${index + 1}`}
          onClick={stop}
          className="lightbox-img max-h-full max-w-full rounded-[18px] object-contain shadow-[0_30px_80px_rgba(0,0,0,0.5)] ring-1 ring-[#f6dfa6]/40"
        />
        <button
          type="button"
          aria-label="Foto sebelumnya"
          onClick={(e) => {
            stop(e);
            prev();
          }}
          className="absolute left-2 flex h-11 w-11 items-center justify-center rounded-full bg-black/25 text-2xl text-white backdrop-blur sm:left-6"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Foto berikutnya"
          onClick={(e) => {
            stop(e);
            next();
          }}
          className="absolute right-2 flex h-11 w-11 items-center justify-center rounded-full bg-black/25 text-2xl text-white backdrop-blur sm:right-6"
        >
          ›
        </button>
      </div>

      <div
        ref={stripRef}
        onClick={stop}
        className="flex shrink-0 gap-2 overflow-x-auto px-4 [scrollbar-width:none]"
        style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
      >
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            data-i={i}
            aria-label={`Lihat foto ${i + 1}`}
            onClick={() => onChange(i)}
            className={`h-16 w-12 shrink-0 overflow-hidden rounded-[10px] transition ${
              i === index ? "opacity-100 ring-2 ring-[#f6dfa6]" : "opacity-45 hover:opacity-80"
            }`}
          >
            <img src={src(item)} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
}
