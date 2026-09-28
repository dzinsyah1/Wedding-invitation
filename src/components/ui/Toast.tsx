"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const EVENT = "app-toast";

interface ToastPayload {
  title: string;
  detail?: string;
}

/** Show a short confirmation toast from anywhere (e.g. after copying). */
export function showToast(title: string, detail?: string) {
  window.dispatchEvent(new CustomEvent<ToastPayload>(EVENT, { detail: { title, detail } }));
}

/** Copies text, with a fallback for browsers/contexts without the Clipboard API. */
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

/** Mount once near the app root. Rendered into <body> so it sits above every modal. */
export function Toaster() {
  const [toast, setToast] = useState<(ToastPayload & { id: number }) | null>(null);
  const [mounted, setMounted] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    const onToast = (e: Event) => {
      const payload = (e as CustomEvent<ToastPayload>).detail;
      setToast({ ...payload, id: Date.now() });
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setToast(null), 2600);
    };
    window.addEventListener(EVENT, onToast);
    return () => {
      window.removeEventListener(EVENT, onToast);
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  if (!mounted) return null;
  return createPortal(
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 z-[95] flex justify-center px-4"
      style={{ top: "max(18px, env(safe-area-inset-top))" }}
    >
      {toast ? (
        <div
          key={toast.id}
          role="status"
          className="toast-in flex max-w-[360px] items-center gap-3 rounded-2xl border border-[#d4af5a]/50 bg-[#fffaf0]/95 py-3 pr-5 pl-3 shadow-[0_16px_40px_rgba(60,45,25,0.22)] backdrop-blur-md"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6a9e8a] text-white shadow-[0_4px_10px_rgba(106,158,138,0.4)]">
            <svg viewBox="0 0 24 24" className="toast-check h-5 w-5" fill="none" aria-hidden="true">
              <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block text-[14px] font-semibold text-[#3d4a3f]">{toast.title}</span>
            {toast.detail ? <span className="block truncate text-[12px] text-[#8b6a3c]">{toast.detail}</span> : null}
          </span>
        </div>
      ) : null}
    </div>,
    document.body
  );
}
