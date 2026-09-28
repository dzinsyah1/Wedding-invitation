"use client";

import { useEffect } from "react";

export interface PortalOrigin {
  x: number;
  y: number;
}

/** Moment the screen is fully covered by light; swap the scene underneath then. */
export const PORTAL_COVER_MS = 900;
const PORTAL_TOTAL_MS = 1900;

// Fixed particle layout (no randomness so it renders the same every time).
const SPARKS = Array.from({ length: 28 }, (_, i) => ({
  angle: (360 / 28) * i + (i % 3) * 7,
  dist: 180 + ((i * 53) % 220),
  size: 3 + (i % 4) * 1.5,
  delay: (i % 7) * 40,
}));

/**
 * "Gate of light": a golden glow blooms out of the clicked button, rays spin up,
 * sparks fly outward, the screen floods with warm light, then it clears to
 * reveal the next scene.
 */
export default function PortalTransition({
  origin,
  reducedMotion,
  onDone,
}: {
  origin: PortalOrigin;
  reducedMotion: boolean;
  onDone: () => void;
}) {
  useEffect(() => {
    const id = window.setTimeout(onDone, reducedMotion ? 700 : PORTAL_TOTAL_MS);
    return () => window.clearTimeout(id);
  }, [onDone, reducedMotion]);

  const at = { left: origin.x, top: origin.y } as const;

  if (reducedMotion) {
    return <div className="portal-flash-soft fixed inset-0 z-[60]" aria-hidden="true" />;
  }

  return (
    <div className="pointer-events-auto fixed inset-0 z-[60] overflow-hidden" aria-hidden="true">
      <div className="portal-dim absolute inset-0" />
      <div className="portal-rays absolute" style={at} />
      <div className="portal-glow absolute" style={at} />
      <div className="portal-ring absolute" style={at} />
      <div className="portal-ring portal-ring-2 absolute" style={at} />
      {SPARKS.map((s, i) => (
        <span
          key={i}
          className="portal-spark absolute"
          style={
            {
              ...at,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}ms`,
              "--a": `${s.angle}deg`,
              "--d": `${s.dist}px`,
            } as React.CSSProperties
          }
        />
      ))}
      <div className="portal-flash absolute inset-0" />
    </div>
  );
}
