"use client";

import { wedding } from "@/data/wedding";
import ModalShell from "@/components/modal/ModalShell";

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    /* ignore */
  }
}

export default function GiftModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell title="Wedding Gift" onClose={onClose}>
      <p className="text-center text-sm italic">{wedding.gift.message}</p>
      <div className="mt-4 space-y-3">
        {wedding.gift.banks.map((bank) => (
          <div key={bank.number} className="rounded-2xl bg-white/60 p-3">
            <p className="text-xs tracking-[0.2em] text-[var(--gold)]">{bank.bank}</p>
            <p className="font-display text-xl">{bank.number}</p>
            <p className="text-sm">{bank.holder}</p>
            <button type="button" className="mt-2 text-xs text-[var(--teal)]" onClick={() => copy(bank.number)}>
              Salin nomor
            </button>
          </div>
        ))}
        {wedding.gift.ewallets.map((wallet) => (
          <div key={wallet.number} className="rounded-2xl bg-white/60 p-3">
            <p className="text-xs tracking-[0.2em] text-[var(--gold)]">{wallet.name}</p>
            <p className="font-display text-xl">{wallet.number}</p>
            <p className="text-sm">{wallet.holder}</p>
            <button type="button" className="mt-2 text-xs text-[var(--teal)]" onClick={() => copy(wallet.number)}>
              Salin nomor
            </button>
          </div>
        ))}
        {wedding.gift.address ? (
          <div className="rounded-2xl bg-white/60 p-3">
            <p className="text-xs tracking-[0.2em] text-[var(--gold)]">Alamat kado</p>
            <p className="mt-1 text-sm">{wedding.gift.address}</p>
            <button
              type="button"
              className="mt-2 text-xs text-[var(--teal)]"
              onClick={() => copy(wedding.gift.address || "")}
            >
              Salin alamat
            </button>
          </div>
        ) : null}
      </div>
    </ModalShell>
  );
}
