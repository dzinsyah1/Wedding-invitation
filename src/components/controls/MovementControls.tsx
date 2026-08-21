"use client";

export default function MovementControls({
  disabled,
  onDir,
  onJump,
}: {
  disabled?: boolean;
  onDir: (dir: number) => void;
  onJump: (down: boolean) => void;
}) {
  const bind = (dir: number) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      onDir(dir);
    },
    onPointerUp: () => onDir(0),
    onPointerCancel: () => onDir(0),
    onPointerLeave: () => onDir(0),
  });

  const btn =
    "pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full border border-[var(--gold)]/50 bg-[var(--ivory)]/88 text-xl text-[var(--ink)] shadow-[0_8px_24px_rgba(60,53,46,0.14)] backdrop-blur-sm disabled:opacity-40";

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between px-5"
      style={{ paddingBottom: "calc(18px + env(safe-area-inset-bottom))" }}
    >
      <button type="button" aria-label="Jalan ke kiri" disabled={disabled} className={btn} {...bind(-1)}>
        ‹
      </button>
      <button
        type="button"
        aria-label="Loncat"
        disabled={disabled}
        className={`${btn} h-[4.25rem] w-[4.25rem] text-lg`}
        onPointerDown={(e) => {
          e.preventDefault();
          onJump(true);
        }}
        onPointerUp={() => onJump(false)}
        onPointerCancel={() => onJump(false)}
        onPointerLeave={() => onJump(false)}
      >
        ↑
      </button>
      <button type="button" aria-label="Jalan ke kanan" disabled={disabled} className={btn} {...bind(1)}>
        ›
      </button>
    </div>
  );
}
