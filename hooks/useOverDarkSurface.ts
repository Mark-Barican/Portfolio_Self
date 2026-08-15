"use client";

import { useEffect, useState } from "react";
import { createFrameScheduler } from "@/lib/utils";
import { isDarkSurfaceAt } from "@/lib/surface";

/**
 * Tracks whether fixed chrome at `probeY` px down the viewport is currently
 * sitting on a dark surface, so it can flip to the light palette. Shared by the
 * header wordmark and the scroll progress bar.
 *
 * **It samples the painted surface, not the section list.** This used to walk
 * `[data-surface="dark"]` elements and test whether `probeY` fell inside one of
 * their rects, which is cheaper but answers a subtly different question: what
 * section is here, rather than what colour is here. Those two diverge at
 * precisely the moments this hook exists to handle: the page's four surface
 * transitions. Through the whole of the hero's cream hand-off the hero is still
 * a `data-surface="dark"` element, so the wordmark stayed cream against
 * cream until the section boundary itself went past, well after the background
 * had changed under it. The same lag applied at every `SurfaceEdge`.
 *
 * Hit-testing the stack at the probe point and reading the first effectively
 * opaque background gets the transitions right for free, because the washes and
 * wipes *are* elements in that stack. One mechanism now covers all four
 * boundaries, and there is no second system for a timeline to fight with.
 *
 * Costs one `elementsFromPoint` and a few style reads per animation frame,
 * coalesced by `createFrameScheduler` and only while scrolling: the same
 * budget the custom cursor already runs on.
 */
export function useOverDarkSurface(probeY: number): boolean {
  const [overDark, setOverDark] = useState(false);

  useEffect(() => {
    // Probed at the horizontal centre: the chrome that uses this sits at both
    // edges, and the centre is the one column guaranteed to be the section's
    // own surface rather than a card or a button sitting on top of it.
    // `surfacesOnly`: this asks which *section surface* is under the probe,
    // not which object. Without it, content that happens to cross the header
    // line, the Stack's cream tech cards, for one, flips the wordmark on a
    // section whose surface never changed.
    const check = () =>
      setOverDark(
        isDarkSurfaceAt(window.innerWidth / 2, probeY, { surfacesOnly: true }),
      );

    const { schedule, cancel } = createFrameScheduler(check);

    check();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancel();
    };
  }, [probeY]);

  return overDark;
}
