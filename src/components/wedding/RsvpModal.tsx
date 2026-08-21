"use client";

import { useState } from "react";
import ModalShell from "@/components/modal/ModalShell";
import { track } from "@/lib/analytics";

export default function RsvpModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<"yes" | "no" | "maybe">("yes");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, attendance, guests, message }),
      });
      if (!res.ok) throw new Error("fail");
      track("rsvp_submitted");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <ModalShell title="RSVP" onClose={onClose}>
      {status === "done" ? (
        <p className="py-8 text-center font-display text-2xl">
          Thank you for confirming your attendance ❤️
        </p>
      ) : (
        <form className="space-y-4" onSubmit={submit}>
          <label className="block text-sm">
            Nama
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-black/10 bg-white/80 px-3 py-3"
            />
          </label>
          <fieldset className="text-sm">
            <legend className="mb-2">Kehadiran</legend>
            {[
              ["yes", "Akan hadir"],
              ["no", "Tidak dapat hadir"],
              ["maybe", "Masih belum pasti"],
            ].map(([value, label]) => (
              <label key={value} className="mb-1 flex items-center gap-2">
                <input
                  type="radio"
                  name="attendance"
                  checked={attendance === value}
                  onChange={() => setAttendance(value as typeof attendance)}
                />
                {label}
              </label>
            ))}
          </fieldset>
          <div className="flex items-center justify-between text-sm">
            <span>Jumlah tamu</span>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setGuests((v) => Math.max(1, v - 1))} className="h-10 w-10 rounded-full bg-black/5">
                -
              </button>
              <span>{guests}</span>
              <button type="button" onClick={() => setGuests((v) => Math.min(8, v + 1))} className="h-10 w-10 rounded-full bg-black/5">
                +
              </button>
            </div>
          </div>
          <label className="block text-sm">
            Pesan
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 min-h-20 w-full rounded-xl border border-black/10 bg-white/80 px-3 py-3"
            />
          </label>
          {status === "error" ? <p className="text-sm text-red-700">Gagal mengirim. Coba lagi.</p> : null}
          <button
            type="submit"
            disabled={status === "saving"}
            className="w-full rounded-full bg-[var(--ink)] py-3 text-sm tracking-[0.2em] text-[var(--ivory)]"
          >
            {status === "saving" ? "MENGIRIM..." : "KIRIM RSVP"}
          </button>
        </form>
      )}
    </ModalShell>
  );
}
