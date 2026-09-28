"use client";

import { useEffect, useState } from "react";

/**
 * True when the on-screen touch controls are shown: a touch device, or a
 * narrow window. Shared so the in-world hint and the control bar always agree.
 */
export function useTouchUI() {
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    const sync = () =>
      setTouch(
        window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0 || window.innerWidth < 768
      );
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  return touch;
}
