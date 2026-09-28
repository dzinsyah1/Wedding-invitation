"use client";

import { useState } from "react";
import { wedding } from "@/data/wedding";
import { track } from "@/lib/analytics";

type Attendance = "yes" | "no" | "maybe";

const OPTIONS: Array<[Attendance, string]> = [
  ["yes", "Hadir"],
  ["no", "Tidak hadir"],
  ["maybe", "Belum pasti"],
];

export default function RsvpForm({ defaultName = "" }: { defaultName?: string }) {
  const [name, setName] = useState(defaultName);
  const [attendance, setAttendance] = useState<Attendance>("yes");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const maxGuests = wedding.rsvp.maxGuests;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, attendance, guests: attendance === "no" ? 0 : guests, message, invitee: defaultName }),
      });
      if (!res.ok) throw new Error("fail");
      track("rsvp_submitted");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="py-6 text-center">
        <p className="font-script text-[34px] leading-none text-[#4a3d32]">Terima kasih</p>
        <p className="mt-3 text-sm leading-relaxed text-[#6b5339]">
          {attendance === "no"
            ? "Konfirmasi Anda sudah kami terima. Doa Anda sangat berarti bagi kami."
            : "Konfirmasi kehadiran Anda sudah kami terima. Sampai jumpa di hari bahagia kami ♡"}
        </p>
      </div>
    );
  }

  const field =
    "mt-1.5 w-full rounded-2xl border border-[#d4af5a]/35 bg-white/75 px-4 py-3 text-[15px] text-[#3d4a3f] outline-none transition focus:border-[#c4a35a] focus:bg-white focus:ring-2 focus:ring-[#e8b84a]/25";

  return (
    <form className="space-y-5 text-left" onSubmit={submit}>
      <label className="block text-[13px] font-semibold text-[#6b5339]">
        Nama
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama lengkap Anda"
          autoComplete="name"
          className={field}
        />
      </label>

      <fieldset>
        <legend className="text-[13px] font-semibold text-[#6b5339]">Konfirmasi kehadiran</legend>
        <div className="mt-1.5 grid grid-cols-3 gap-2">
          {OPTIONS.map(([value, label]) => (
            <label
              key={value}
              className={`flex cursor-pointer items-center justify-center rounded-2xl border px-2 py-3 text-center text-[13px] transition ${
                attendance === value
                  ? "border-[#4f3c29] bg-[#4f3c29] text-[#fff6e8] shadow-md"
                  : "border-[#d4af5a]/35 bg-white/70 text-[#4a3d32] hover:border-[#c4a35a]"
              }`}
            >
              <input
                type="radio"
                name="attendance"
                className="sr-only"
                checked={attendance === value}
                onChange={() => setAttendance(value)}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {attendance !== "no" ? (
        <div className="flex items-center justify-between rounded-2xl border border-[#d4af5a]/35 bg-white/70 px-4 py-2.5">
          <span className="text-[13px] font-semibold text-[#6b5339]">Jumlah tamu</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Kurangi tamu"
              onClick={() => setGuests((v) => Math.max(1, v - 1))}
              className="h-9 w-9 rounded-full border border-[#d4af5a]/50 text-lg text-[#6b5339] disabled:opacity-40"
              disabled={guests <= 1}
            >
              −
            </button>
            <span className="w-5 text-center text-lg font-semibold text-[#3d4a3f] tabular-nums">{guests}</span>
            <button
              type="button"
              aria-label="Tambah tamu"
              onClick={() => setGuests((v) => Math.min(maxGuests, v + 1))}
              className="h-9 w-9 rounded-full border border-[#d4af5a]/50 text-lg text-[#6b5339] disabled:opacity-40"
              disabled={guests >= maxGuests}
            >
              +
            </button>
          </div>
        </div>
      ) : null}

      <label className="block text-[13px] font-semibold text-[#6b5339]">
        Ucapan & doa
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tulis ucapan dan doa untuk kedua mempelai"
          maxLength={500}
          className={`${field} min-h-24 resize-none`}
        />
      </label>

      {status === "error" ? (
        <p className="text-center text-sm text-[#a2453d]">Gagal mengirim. Periksa koneksi lalu coba lagi.</p>
      ) : null}

      <button
        type="submit"
        disabled={status === "saving"}
        className="w-full rounded-full bg-[var(--ink)] py-3.5 text-[12px] tracking-[0.24em] text-[var(--ivory)] shadow-[0_10px_24px_rgba(40,50,40,0.22)] transition hover:bg-[var(--brown)] disabled:opacity-60"
      >
        {status === "saving" ? "MENGIRIM…" : "KIRIM KONFIRMASI"}
      </button>
    </form>
  );
}
