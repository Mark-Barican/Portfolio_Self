"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which section is currently in view using IntersectionObserver, so the
 * navbar can highlight the active link. Returns the id of the section closest
 * to the top of the viewport.
 *
 * @param sectionIds Ordered list of section element ids to observe.
 */
export function useActiveSection(sectionIds: readonly string[]): string {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? "");

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    // Track intersection ratios and pick the most-visible section.
    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.intersectionRatio);
        }

        let best = activeId;
        let bestRatio = 0;
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        if (bestRatio > 0) setActiveId(best);
      },
      {
        // Bias detection toward the upper-middle of the viewport.
        rootMargin: "-45% 0px -45% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // `activeId` intentionally omitted: we only re-bind when the ids change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIds]);

  return activeId;
}
