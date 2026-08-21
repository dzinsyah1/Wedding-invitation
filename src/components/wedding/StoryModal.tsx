"use client";

import { useState } from "react";
import { wedding } from "@/data/wedding";
import ModalShell from "@/components/modal/ModalShell";

export default function StoryModal({ onClose }: { onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const chapter = wedding.story[index];

  return (
    <ModalShell title="Our Story" onClose={onClose}>
      <div className="text-center">
        <p className="animate-fade-up tracking-[0.3em] text-[var(--gold)]">{chapter.year}</p>
        <h3 className="font-display animate-fade-up mt-2 text-3xl" style={{ animationDelay: "0.08s" }}>
          {chapter.title}
        </h3>
        {chapter.image ? (
          <img
            src={chapter.image}
            alt={chapter.title}
            className="h-44 w-full rounded-[16px] object-cover"
            style={{ animationDelay: "0.14s" }}
          />
        ) : null}
        <p className="animate-fade-up mt-4 text-sm leading-7" style={{ animationDelay: "0.22s" }}>
          {chapter.description}
        </p>
        <div className="mt-5 flex items-center justify-between">
          <button
            type="button"
            className="rounded-full px-4 py-2 text-sm disabled:opacity-30"
            disabled={index === 0}
            onClick={() => setIndex((v) => v - 1)}
          >
            ←
          </button>
          <div className="flex gap-1.5">
            {wedding.story.map((item, i) => (
              <span
                key={item.id}
                className={`h-2 w-2 rounded-full ${i === index ? "bg-[var(--gold)]" : "bg-black/15"}`}
              />
            ))}
          </div>
          <button
            type="button"
            className="rounded-full px-4 py-2 text-sm disabled:opacity-30"
            disabled={index === wedding.story.length - 1}
            onClick={() => setIndex((v) => v + 1)}
          >
            →
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
