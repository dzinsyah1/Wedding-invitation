"use client";

import { useEffect, useRef, useState } from "react";
import { wedding } from "@/data/wedding";
import ModalShell from "@/components/modal/ModalShell";

const pad = (n: number) => String(n).padStart(2, "0");

export default function StoryModal({ onClose }: { onClose: () => void }) {
  const chapters = wedding.story;
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const last = chapters.length - 1;

  // Native horizontal scroll-snap does the swiping; this keeps the index in sync.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const i = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
        setIndex(Math.min(last, Math.max(0, i)));
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [last]);

  function go(i: number) {
    const track = trackRef.current;
    if (!track) return;
    const target = Math.min(last, Math.max(0, i));
    track.scrollTo({ left: target * track.clientWidth, behavior: "smooth" });
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(index + 1);
      else if (e.key === "ArrowLeft") go(index - 1);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <ModalShell title="Our Story" onClose={onClose}>
      <div
        ref={trackRef}
        className="story-track -mx-6 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none]"
        aria-roledescription="carousel"
        aria-label="Kisah kami"
      >
        {chapters.map((chapter, i) => (
          <article
            key={chapter.id}
            className="w-full shrink-0 snap-center px-6 pb-1"
            aria-roledescription="slide"
            aria-label={`${i + 1} dari ${chapters.length}: ${chapter.title}`}
          >
            <div className="story-slide flex h-full flex-col overflow-hidden rounded-[24px] bg-[#fffaf0]">
              <div className="relative h-[clamp(170px,28dvh,300px)] shrink-0 overflow-hidden bg-[#2b2118]">
                {chapter.image ? (
                  <img
                    src={encodeURI(chapter.image)}
                    alt=""
                    loading={i === 0 ? "eager" : "lazy"}
                    style={{ objectPosition: chapter.focus ?? "50% 35%" }}
                    className={`story-photo absolute inset-0 h-full w-full object-cover ${i === index ? "is-active" : ""}`}
                  />
                ) : null}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(30,22,14,0)_70%,rgba(255,250,240,0.35)_100%)]" />
                <span className="absolute top-3 right-3 rounded-full bg-black/30 px-3 py-1 font-display text-[12px] tracking-[0.2em] text-[#fff6e8] backdrop-blur-sm">
                  {pad(i + 1)} / {pad(chapters.length)}
                </span>
              </div>
              <div className={`story-copy flex-1 px-5 pt-4 pb-5 text-center ${i === index ? "is-active" : ""}`}>
                <p className="text-[10px] font-semibold tracking-[0.34em] text-[#c4a35a] uppercase">
                  {chapter.year ?? `Bab ${pad(i + 1)}`}
                </p>
                <h3 className="font-script mt-1 text-[38px] leading-none text-[#4a3d32]">{chapter.title}</h3>
                <div className="mx-auto mt-2 h-px w-16 bg-[linear-gradient(90deg,transparent,#c4a35a,transparent)]" />
                <p className="mt-3 text-center text-[13px] leading-[1.7] text-[#4a3d32] sm:text-[13.5px]">
                  {chapter.description}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Sticky so the controls stay in reach even when a long chapter scrolls. */}
      <div className="sticky -bottom-10 z-10 -mx-6 mt-2 -mb-6 flex items-center justify-between gap-3 bg-[linear-gradient(180deg,rgba(255,248,236,0)_0%,#fff7ea_30%)] px-6 pt-4 pb-4">
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label="Kisah sebelumnya"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#d4af5a]/50 text-[#6b5339] transition disabled:opacity-25"
        >
          <svg viewBox="0 0 40 12" className="h-3 w-6 rotate-180" fill="none" aria-hidden="true">
            <path d="M1 6h36M31 1l6 5-6 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex items-center gap-2" role="tablist" aria-label="Pilih bab">
          {chapters.map((chapter, i) => (
            <button
              key={chapter.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={chapter.title}
              onClick={() => go(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-[#c4a35a]" : "w-2 bg-[#c4a35a]/30 hover:bg-[#c4a35a]/60"}`}
            />
          ))}
        </div>

        {index < last ? (
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Kisah berikutnya"
            className="story-next flex h-11 shrink-0 items-center gap-2 rounded-full bg-[#4f3c29] pr-4 pl-5 text-[11px] tracking-[0.18em] text-[#fff6e8] uppercase transition active:scale-95"
          >
            Lanjut
            <svg viewBox="0 0 40 12" className="h-3 w-7" fill="none" aria-hidden="true">
              <path d="M1 6h36M31 1l6 5-6 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 shrink-0 items-center rounded-full border border-[#c4a35a]/70 px-5 text-[11px] tracking-[0.18em] text-[#4a3d32] uppercase transition active:scale-95"
          >
            Selesai ♡
          </button>
        )}
      </div>
          </ModalShell>
  );
}
