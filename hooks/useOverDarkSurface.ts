"use client";

import { useEffect, useState } from "react";
import { isDarkSurfaceAt } from "@/lib/surface";
import { SCRUB } from "@/lib/scroll";

/**
 * How long the probe keeps sampling after the last scroll event, in ms.
 *
 * The surfaces under the chrome are scrubbed, so they go on moving after the
 * scroll itself has stopped: a `SurfaceEdge` wipe or a section's scene is
 * still catching up for as long as its scrub lags. Sampling only on scroll
 * events left the wordmark on whatever it read at the last one, and stopping
 * just short of a boundary that was the surface the wipe was about to remove:
 * a cream wordmark left on cream. The window covers the slowest scrub with
 * room to spare.
 */
const SETTLE_MS = SCRUB.base * 1000 + 400;

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
 * only while scrolling and for `SETTLE_MS` after: the same budget the custom
 * cursor already runs on. React drops the update when the answer has not
 * changed, so the frames in between cost no renders.
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

    let frame = 0;
    let until = 0;
    const loop = () => {
      check();
      frame = performance.now() < until ? requestAnimationFrame(loop) : 0;
    };
    // Every scroll extends the window; one loop runs however many arrive.
    const wake = () => {
      until = performance.now() + SETTLE_MS;
      if (!frame) frame = requestAnimationFrame(loop);
    };

    check();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    return () => {
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [probeY]);

  return overDark;
}
