"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Reactively reports whether the user has asked the OS to reduce motion.
 * Used to gate JS-driven Framer Motion animations (CSS animations are handled
 * by the media query in globals.css).
 */
export function usePrefersReducedMotion(): boolean {
  // Default to `true` (no motion) so the very first paint is calm; corrected
  // on mount once we can read the actual preference.
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    setReduced(mql.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
