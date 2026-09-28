"use client";

import { useEffect, useMemo, useState } from "react";
import { wedding } from "@/data/wedding";
import { guestLink, tidyGuestName } from "@/lib/guest";
import { Toaster, copyText, showToast } from "@/components/ui/Toast";
import Flourish from "@/components/ui/Flourish";

const DRAFT_KEY = "guest-link-draft";

function messageFor(name: string, link: string) {
  const [akad] = wedding.events;
  return [
    "Assalamu'alaikum Warahmatullahi Wabarakatuh",
    "",
    `Kepada Yth. Bapak/Ibu/Saudara/i *${name}*`,
    "",
    "Tanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk hadir di acara pernikahan kami:",
    "",
    `*${wedding.couple.groom.fullName}*`,
    "&",
    `*${wedding.couple.bride.fullName}*`,
    "",
    `🗓 ${akad.date}`,
    `📍 ${akad.venue}`,
    "",
    "Info lengkap acara dan konfirmasi kehadiran:",
    link,
    "",
    "Merupakan suatu kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.",
    "",
    "Wassalamu'alaikum Warahmatullahi Wabarakatuh",
    `${wedding.names.display}`,
  ].join("\n");
}

/** Internal tool at /tautan: paste guest names, get personal links and WhatsApp messages. */
export default function GuestLinkBuilder() {
  const [text, setText] = useState("");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    try {
      setText(window.localStorage.getItem(DRAFT_KEY) ?? "");
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(DRAFT_KEY, text);
    } catch {
      /* storage unavailable */
    }
  }, [text]);

  const guests = useMemo(() => {
    const seen = new Set<string>();
    return text
      .split("\n")
      .map(tidyGuestName)
      .filter((name) => name && !seen.has(name.toLowerCase()) && seen.add(name.toLowerCase()));
  }, [text]);

  async function copy(value: string, title: string, detail?: string) {
    if (await copyText(value)) showToast(title, detail);
    else showToast("Gagal menyalin", "Silakan salin secara manual");
  }

  const rows = origin ? guests.map((name) => ({ name, link: guestLink(origin, name) })) : [];

  return (
    <main className="h-[100dvh] overflow-y-auto bg-[var(--cream)] px-4 py-8">
      <div className="mx-auto max-w-[640px]">
        <header className="text-center">
          <p className="text-[11px] tracking-[0.4em] text-[#b08a3e] uppercase">Khusus Mempelai</p>
          <h1 className="font-script mt-1 text-[46px] leading-none text-[#4a3d32]">Tautan Tamu</h1>
          <Flourish className="mx-auto mt-2 h-4 w-32" />
          <p className="mx-auto mt-3 max-w-md text-[13.5px] leading-relaxed text-[#6b5339]">
            Tulis satu nama tamu per baris. Setiap tamu mendapat tautan pribadi yang menampilkan namanya di
            undangan, lengkap dengan pesan WhatsApp siap kirim.
          </p>
        </header>

        <label className="paper-card mt-6 block rounded-[22px] p-4 shadow-[0_12px_30px_rgba(80,60,30,0.08)]">
          <span className="text-[12px] font-semibold tracking-[0.12em] text-[#8b6a3c] uppercase">Daftar nama tamu</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder={"Bapak Ahmad & Keluarga\nIbu Siti Rahma\nRina Putri"}
            className="mt-2 w-full resize-y rounded-2xl border border-[#d4af5a]/35 bg-white/80 px-4 py-3 text-[15px] leading-relaxed text-[#3d4a3f] outline-none focus:border-[#c4a35a] focus:ring-2 focus:ring-[#e8b84a]/25"
          />
          <span className="mt-1 block text-right text-[12px] text-[#8b6a3c]">{guests.length} tamu</span>
        </label>

        {rows.length ? (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-semibold tracking-[0.12em] text-[#8b6a3c] uppercase">Tautan pribadi</p>
              <button
                type="button"
                onClick={() => copy(rows.map((r) => `${r.name}\t${r.link}`).join("\n"), "Semua tautan disalin", "Bisa ditempel ke Excel / Sheets")}
                className="rounded-full border border-[#c4a35a]/70 px-4 py-2 text-[12px] text-[#4a3d32] hover:bg-[#f3e6c8]/70"
              >
                Salin semua
              </button>
            </div>
            {rows.map(({ name, link }) => (
              <div key={name} className="paper-card rounded-[20px] p-4 shadow-[0_8px_22px_rgba(80,60,30,0.07)]">
                <p className="font-display text-[20px] font-semibold text-[#3d4a3f]">{name}</p>
                <a href={link} target="_blank" rel="noreferrer" className="mt-0.5 block truncate text-[12.5px] text-[#6a9e8a] underline-offset-2 hover:underline">
                  {link}
                </a>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => copy(link, "Tautan disalin", name)}
                    className="rounded-full bg-[#4f3c29] px-4 py-2 text-[12px] text-[#fff6e8] active:scale-95"
                  >
                    Salin tautan
                  </button>
                  <button
                    type="button"
                    onClick={() => copy(messageFor(name, link), "Pesan undangan disalin", `Untuk ${name}`)}
                    className="rounded-full border border-[#c4a35a]/70 px-4 py-2 text-[12px] text-[#4a3d32] active:scale-95"
                  >
                    Salin pesan
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(messageFor(name, link))}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-[#6a9e8a] px-4 py-2 text-[12px] text-white active:scale-95"
                  >
                    Kirim via WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-center text-[13px] text-[#8b6a3c]">Tautan akan muncul di sini setelah Anda menulis nama tamu.</p>
        )}
      </div>
      <Toaster />
    </main>
  );
}
