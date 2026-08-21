export default function Flourish({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 180 18"
      fill="none"
      aria-hidden="true"
    >
      <path d="M8 9h52" stroke="#C2A36A" strokeWidth="1" />
      <path d="M120 9h52" stroke="#C2A36A" strokeWidth="1" />
      <path
        d="M72 9c6-8 14-8 18 0 4-8 12-8 18 0"
        stroke="#D7A8A4"
        strokeWidth="1.2"
        fill="none"
      />
      <circle cx="90" cy="9" r="2.2" fill="#C2A36A" />
    </svg>
  );
}

export function CornerOrnaments() {
  const corner = (extra: string) => (
    <svg viewBox="0 0 48 48" className={`absolute h-10 w-10 text-[var(--gold)] ${extra}`} fill="none">
      <path d="M8 40c0-18 14-32 32-32" stroke="currentColor" strokeWidth="1.2" />
      <path d="M16 40c0-12 10-22 24-22" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
      <circle cx="40" cy="8" r="1.6" fill="currentColor" />
    </svg>
  );

  return (
    <>
      {corner("left-3 top-3")}
      {corner("right-3 top-3 scale-x-[-1]")}
      {corner("left-3 bottom-3 scale-y-[-1]")}
      {corner("right-3 bottom-3 scale-[-1]")}
    </>
  );
}
