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
    <svg
      viewBox="0 0 48 48"
      className={`pointer-events-none absolute h-10 w-10 text-[var(--gold)] ${extra}`}
      fill="none"
      aria-hidden="true"
    >
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

/** Rose cluster with leaves, sits centred on a card's top edge like a brooch. */
export function FloralBrooch({ className = "" }: { className?: string }) {
  const petals = [0, 72, 144, 216, 288];
  return (
    <svg viewBox="0 0 140 52" className={className} fill="none" aria-hidden="true">
      {/* leaves */}
      <path d="M62 28C46 18 30 18 14 26c15 6 32 8 48 2z" fill="#8FA387" />
      <path d="M62 28C46 21 32 21 18 26" stroke="#6E8A66" strokeWidth="0.8" />
      <path d="M78 28c16-10 32-10 48-2-15 6-32 8-48 2z" fill="#8FA387" />
      <path d="M78 28c14-7 28-7 42-2" stroke="#6E8A66" strokeWidth="0.8" />
      <path d="M58 32c-10 8-22 12-34 12 8-9 20-13 34-12z" fill="#A9BCA1" />
      <path d="M82 32c10 8 22 12 34 12-8-9-20-13-34-12z" fill="#A9BCA1" />
      {/* gold tendrils */}
      <path d="M40 22c-8-10-2-18 6-16" stroke="#C4A35A" strokeWidth="1" strokeLinecap="round" />
      <path d="M100 22c8-10 2-18-6-16" stroke="#C4A35A" strokeWidth="1" strokeLinecap="round" />
      {/* buds */}
      <circle cx="44" cy="36" r="4.5" fill="#F2C4C8" />
      <circle cx="44" cy="36" r="2" fill="#D49AA0" />
      <circle cx="96" cy="36" r="4.5" fill="#F2C4C8" />
      <circle cx="96" cy="36" r="2" fill="#D49AA0" />
      {/* main rose */}
      <g transform="translate(70 27)">
        {petals.map((deg) => (
          <ellipse key={deg} cx="0" cy="-9" rx="7.5" ry="10" fill="#F6D2D5" stroke="#E5B0B5" strokeWidth="0.6" transform={`rotate(${deg})`} />
        ))}
        <circle r="8" fill="#EDB5BB" />
        <path d="M-4 1c0-5 8-5 8 0s-6 5-6 1 3-3 4-1" stroke="#C98890" strokeWidth="1" strokeLinecap="round" />
        <circle r="1.6" cx="0" cy="0" fill="#E8B84A" />
      </g>
    </svg>
  );
}

/** Leafy sprig with two small blossoms for card corners. */
export function FloralSprig({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 72" className={className} fill="none" aria-hidden="true">
      <path d="M6 66C18 50 30 34 58 12" stroke="#C4A35A" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M18 52c-9-3-13-10-12-17 8 2 12 9 12 17z" fill="#8FA387" />
      <path d="M18 52c7-6 15-6 20-2-6 5-14 6-20 2z" fill="#A9BCA1" />
      <path d="M32 36c-7-5-8-13-5-19 7 4 8 12 5 19z" fill="#8FA387" />
      <path d="M32 36c8-3 15 0 18 5-7 3-14 1-18-5z" fill="#A9BCA1" />
      <path d="M46 22c-4-6-3-12 1-16 5 5 4 11-1 16z" fill="#8FA387" />
      <g transform="translate(58 12)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse key={deg} cx="0" cy="-4.2" rx="3.4" ry="4.6" fill="#F6D2D5" transform={`rotate(${deg})`} />
        ))}
        <circle r="2.2" fill="#E8B84A" />
      </g>
      <g transform="translate(12 38)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse key={deg} cx="0" cy="-3" rx="2.4" ry="3.3" fill="#FFF6E8" stroke="#E8D8C0" strokeWidth="0.4" transform={`rotate(${deg})`} />
        ))}
        <circle r="1.4" fill="#E8B84A" />
      </g>
    </svg>
  );
}
