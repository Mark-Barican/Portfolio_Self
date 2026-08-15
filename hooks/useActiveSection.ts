"use client";

import { useEffect, useState } from "react";
import { createFrameScheduler } from "@/lib/utils";

/** Fraction down the viewport used as the "you are here" probe line. */
const PROBE = 0.3;

/**
 * Tracks which section is currently in view so the navbar can highlight it.
 *
 * Works by testing which section's box straddles a probe line ~30% down the
 * viewport, rather than comparing IntersectionObserver ratios: with sections
 * of very different heights, the tallest one wins the ratio comparison even
 * when it is barely on screen, which left the nav highlighting the wrong item.
 *
 * @param sectionIds Ordered list of section element ids to observe.
 */
export function useActiveSection(sectionIds: readonly string[]): string {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? "");

  useEffect(() => {
    const compute = () => {
      const probeY = window.innerHeight * PROBE;
      let current = sectionIds[0] ?? "";

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= probeY && bottom > probeY) {
          current = id;
          break;
        }
      }

      // The last section is often shorter than the probe offset, so it would
      // never straddle the line — pin it once the page is scrolled to the end.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 8;
      if (atBottom) current = sectionIds[sectionIds.length - 1] ?? current;

      setActiveId((prev) => (prev === current ? prev : current));
    };

    const { schedule, cancel } = createFrameScheduler(compute);

    compute();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancel();
    };
  }, [sectionIds]);

  return activeId;
}
