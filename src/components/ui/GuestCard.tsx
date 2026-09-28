"use client";

/**
 * Personal "Kepada Yth." name plate for the guest from ?to=.
 * `tone="light"` sits on cream paper, `tone="glass"` on photos/busy scenes.
 */
export default function GuestCard({
  name,
  label = "Kepada Yth.",
  note,
  tone = "light",
  size = "md",
  className = "",
}: {
  name: string;
  label?: string;
  note?: string;
  tone?: "light" | "glass";
  size?: "sm" | "md";
  className?: string;
}) {
  const glass = tone === "glass";
  return (
    <div
      className={`guest-card relative mx-auto w-full max-w-[320px] overflow-hidden rounded-[20px] px-5 text-center ${size === "sm" ? "pt-2.5 pb-3" : "pt-3.5 pb-4"} ${
        glass ? "guest-card-glass" : "guest-card-light"
      } ${className}`}
    >
      <span className="guest-card-shine pointer-events-none absolute inset-0" aria-hidden="true" />
      <p className={`text-[10px] font-semibold tracking-[0.34em] uppercase ${glass ? "text-[#f6dfa6]" : "text-[#b08a3e]"}`}>
        {label}
      </p>
      <p className={`font-script mt-1 leading-[1.1] break-words ${size === "sm" ? "text-[28px]" : "text-[34px]"} ${glass ? "text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]" : "text-[#4a3d32]"}`}>
        {name}
      </p>
      <div className={`mx-auto mt-1.5 h-px w-20 ${glass ? "bg-[linear-gradient(90deg,transparent,#f6dfa6,transparent)]" : "bg-[linear-gradient(90deg,transparent,#c4a35a,transparent)]"}`} />
      {note ? (
        <p className={`mt-2 text-[11.5px] leading-snug ${glass ? "text-[#fff6e4]/90" : "text-[#8b6a3c]"}`}>{note}</p>
      ) : null}
    </div>
  );
}
