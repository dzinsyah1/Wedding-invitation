"use client";

import { useCallback, useEffect, useState } from "react";
import Flourish from "@/components/ui/Flourish";
import type { Wish } from "@/types/wedding";

const PAGE = 5;
const LONG_MESSAGE = 160;

type Status = "loading" | "ready" | "error";

/** Loads the guest book and lets a fresh RSVP be shown at the top right away. */
export function useWishes() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/rsvp");
      const data = (await res.json()) as { ok?: boolean; wishes?: Wish[] };
      if (!res.ok || !data.ok) throw new Error("fail");
      setWishes(data.wishes ?? []);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = useCallback((wish: Wish) => setWishes((prev) => [wish, ...prev]), []);

  return { wishes, status, reload: load, add };
}

// Avatar tints cycle through the garden palette, picked per name so a guest keeps their colour.
const TINTS = [
  "from-[#f7d9a0] to-[#e8b84a] text-[#6b4a1e]",
  "from-[#cfe6c4] to-[#7cb86a] text-[#2f5a2a]",
  "from-[#fbe0e2] to-[#f2c4c8] text-[#8a4650]",
  "from-[#cfe3da] to-[#6a9e8a] text-[#24493d]",
];

const BADGE: Record<string, string> = {
  hadir: "border-[#7cb86a]/45 bg-[#7cb86a]/14 text-[#3f7034]",
  "tidak hadir": "border-[#d99aa1]/55 bg-[#f2c4c8]/35 text-[#94464f]",
  "belum pasti": "border-[#e8b84a]/50 bg-[#e8b84a]/16 text-[#8b6a3c]",
};

function tintFor(name: string) {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return TINTS[Math.abs(hash) % TINTS.length];
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "♡";
}

const dateFormat = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
});

function formatTime(iso: string) {
  const date = new Date(iso);
  return iso && !Number.isNaN(date.getTime()) ? dateFormat.format(date) : "";
}

export default function WishList({
  wishes,
  status,
  onRetry,
}: {
  wishes: Wish[];
  status: Status;
  onRetry: () => void;
}) {
  const [shown, setShown] = useState(PAGE);
  const visible = wishes.slice(0, shown);
  const remaining = wishes.length - visible.length;

  return (
    <div>
      <div className="text-center">
        <p className="text-[11px] tracking-[0.36em] text-[#c4a35a] uppercase">Buku Tamu</p>
        <h3 className="font-script mt-1 text-[36px] leading-none text-[#4a3d32]">Ucapan &amp; Doa</h3>
        <Flourish className="mx-auto mt-2 h-3.5 w-28" />
        {status === "ready" && wishes.length > 0 ? (
          <p className="mt-2 text-[12px] text-[#8b6a3c]">
            <span className="font-semibold tabular-nums">{wishes.length}</span> doa tulus untuk kedua mempelai
          </p>
        ) : null}
      </div>

      <div className="mt-5" aria-live="polite" aria-busy={status === "loading"}>
        {status === "loading" && wishes.length === 0 ? (
          <ul className="space-y-3" aria-label="Memuat ucapan">
            {[0, 1, 2].map((i) => (
              <li key={i} className="wish-card flex animate-pulse gap-3 rounded-2xl p-3.5">
                <div className="h-10 w-10 shrink-0 rounded-full bg-[#f0e2c6]" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3 w-1/2 rounded-full bg-[#f0e2c6]" />
                  <div className="h-2.5 w-1/3 rounded-full bg-[#f5ead6]" />
                  <div className="h-2.5 w-11/12 rounded-full bg-[#f5ead6]" />
                </div>
              </li>
            ))}
          </ul>
        ) : status === "error" && wishes.length === 0 ? (
          <div className="py-4 text-center text-[13px] text-[#6b5339]">
            <p>Ucapan belum dapat dimuat.</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 rounded-full border border-[#d4af5a]/50 px-4 py-1.5 text-[12px] text-[#8b6a3c] transition hover:bg-white/70"
            >
              Coba lagi
            </button>
          </div>
        ) : wishes.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-2xl text-[#e3a9ae]" aria-hidden="true">
              ❀
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-[#6b5339]">
              Belum ada ucapan. Jadilah yang pertama
              <br />
              mengirimkan doa untuk kami ♡
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {visible.map((wish, i) => (
              <WishItem key={`${wish.time}-${wish.name}-${i}`} wish={wish} />
            ))}
          </ul>
        )}

        {remaining > 0 ? (
          <button
            type="button"
            onClick={() => setShown((n) => n + PAGE * 2)}
            className="mx-auto mt-5 flex items-center gap-2 rounded-full border border-[#d4af5a]/50 bg-white/60 px-5 py-2 text-[12px] tracking-[0.08em] text-[#8b6a3c] shadow-[0_6px_16px_rgba(80,60,30,0.08)] transition hover:bg-white"
          >
            Lihat ucapan lainnya
            <span className="rounded-full bg-[#f3e6c8] px-2 py-0.5 text-[11px] font-semibold tabular-nums">{remaining}</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}

function WishItem({ wish }: { wish: Wish }) {
  const [expanded, setExpanded] = useState(false);
  const long = wish.message.length > LONG_MESSAGE;
  const badge = BADGE[wish.attendance.toLowerCase()];
  const time = formatTime(wish.time);

  return (
    <li className="wish-card wish-in flex gap-3 rounded-2xl p-3.5">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-display text-[15px] font-semibold ring-2 ring-white shadow-[0_0_0_1px_rgba(212,175,90,0.45),0_4px_10px_rgba(80,60,30,0.12)] ${tintFor(wish.name)}`}
        aria-hidden="true"
      >
        {initials(wish.name)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate pt-0.5 text-[14px] font-semibold text-[#4a3d32]">{wish.name}</p>
          {badge ? (
            <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10.5px] font-medium ${badge}`}>
              {wish.attendance}
            </span>
          ) : null}
        </div>
        {time ? <p className="mt-0.5 text-[11px] text-[#a08a6a]">{time}</p> : null}
        <p
          className={`mt-1.5 text-[13.5px] leading-relaxed whitespace-pre-line break-words text-[#5d4a36] ${
            long && !expanded ? "line-clamp-4" : ""
          }`}
        >
          {wish.message}
        </p>
        {long ? (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-1 text-[12px] font-medium text-[#b08a45] hover:underline"
          >
            {expanded ? "Tutup" : "Selengkapnya"}
          </button>
        ) : null}
      </div>
    </li>
  );
}
