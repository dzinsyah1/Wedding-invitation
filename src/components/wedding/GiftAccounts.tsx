"use client";

import { useState } from "react";
import { wedding } from "@/data/wedding";
import { track } from "@/lib/analytics";
import { copyText, showToast } from "@/components/ui/Toast";

/** "3660439586" -> "3660 4395 86" style groups of four, easier to read aloud and check. */
export const groupDigits = (n: string) => n.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");

export default function GiftAccounts({ compact = false }: { compact?: boolean }) {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(key: string, text: string, title: string, detail: string) {
    if (!(await copyText(text))) {
      showToast("Gagal menyalin", "Silakan salin secara manual");
      return;
    }
    setCopied(key);
    showToast(title, detail);
    track("gift_copied", { key });
    window.setTimeout(() => setCopied((c) => (c === key ? null : c)), 2000);
  }

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      {wedding.gift.banks.map((acc) => {
        const done = copied === acc.number;
        return (
          <div key={acc.number} className="inv-bank-card relative overflow-hidden rounded-[22px] p-5 text-left">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-[26px] leading-none font-bold tracking-wide text-[#4a3d32]">{acc.bank}</p>
                {acc.owner ? (
                  <p className="mt-1.5 text-[10px] font-semibold tracking-[0.24em] text-[#c4a35a] uppercase">{acc.owner}</p>
                ) : null}
              </div>
              <span className="h-7 w-10 shrink-0 rounded-md bg-[linear-gradient(135deg,#f3d98f,#c9a24e)] shadow-inner" aria-hidden="true" />
            </div>

            <p className="mt-5 text-[10px] tracking-[0.2em] text-[#8b6a3c] uppercase">No. Rekening</p>
            <p className="mt-0.5 text-[24px] font-semibold tracking-[0.1em] text-[#3d4a3f] tabular-nums">{groupDigits(acc.number)}</p>

            <div className="mt-3 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] tracking-[0.2em] text-[#8b6a3c] uppercase">Atas Nama</p>
                <p className="truncate text-[14px] font-medium text-[#4a3d32]">{acc.holder}</p>
              </div>
              <button
                type="button"
                onClick={() => copy(acc.number, acc.number, "Nomor rekening disalin", `${acc.bank} · ${groupDigits(acc.number)} · a.n. ${acc.holder}`)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-[12px] font-medium transition active:scale-95 ${
                  done ? "bg-[#6a9e8a] text-white" : "bg-[#4f3c29] text-[#fff6e8] hover:bg-[#6b5339]"
                }`}
              >
                {done ? "Tersalin ✓" : "Salin No. Rek"}
              </button>
            </div>
          </div>
        );
      })}

      {wedding.gift.address ? (
        <div className="paper-card rounded-[22px] p-5 text-center">
          <p className="text-[11px] tracking-[0.3em] text-[#c4a35a] uppercase">Kirim Kado</p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-[#3d4a3f]">{wedding.gift.address}</p>
          <button
            type="button"
            onClick={() => copy("address", wedding.gift.address ?? "", "Alamat disalin", "Siap ditempel di aplikasi kurir")}
            className={`mt-4 rounded-full border px-5 py-2.5 text-[12px] tracking-[0.08em] transition active:scale-95 ${
              copied === "address"
                ? "border-[#6a9e8a] bg-[#6a9e8a] text-white"
                : "border-[#c4a35a]/70 bg-white/50 text-[#4a3d32] hover:bg-[#f3e6c8]/80"
            }`}
          >
            {copied === "address" ? "Tersalin ✓" : "Salin Alamat"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
