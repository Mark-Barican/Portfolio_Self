"use client";

import { useEffect, useState } from "react";

/**
 * Subscribes to a CSS media query and returns whether it currently matches.
 * SSR-safe: returns `false` until mounted to avoid hydration mismatches.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** Convenience: true when the viewport is at or above the `lg` breakpoint. */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px) and (pointer: fine)");
}
