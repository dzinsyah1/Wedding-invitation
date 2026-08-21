"use client";

import { useEffect, useMemo, useState } from "react";
import { wedding } from "@/data/wedding";
import ModalShell from "@/components/modal/ModalShell";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function CountdownModal({ onClose }: { onClose: () => void }) {
  const target = useMemo(() => new Date(wedding.countdown.targetDate).getTime(), []);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const diff = target - now;
  const start = new Date(wedding.countdown.targetDate);
  const sameDay =
    new Date().toDateString() ===
    new Date(start.toLocaleString("en-US", { timeZone: wedding.countdown.timezone })).toDateString();

  if (diff <= 0) {
    return (
      <ModalShell title="Our Big Day" onClose={onClose}>
        <p className="py-6 text-center font-display text-3xl">
          {sameDay ? "TODAY IS THE DAY ❤️" : "Thank you for celebrating our special day with us."}
        </p>
      </ModalShell>
    );
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  const cells = [
    [pad(days), "DAYS"],
    [pad(hours), "HOURS"],
    [pad(minutes), "MINUTES"],
    [pad(seconds), "SECONDS"],
  ];

  return (
    <ModalShell title="Our Big Day" onClose={onClose}>
      <div className="grid grid-cols-4 gap-2 text-center">
        {cells.map(([value, label]) => (
          <div key={label} className="rounded-2xl bg-white/60 py-4">
            <p className="font-display text-3xl">{value}</p>
            <p className="mt-1 text-[10px] tracking-[0.2em] text-[var(--teal)]">{label}</p>
          </div>
        ))}
      </div>
    </ModalShell>
  );
}
