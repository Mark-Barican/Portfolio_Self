"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGsap } from "@/hooks/useGsap";
import { useOverDarkSurface } from "@/hooks/useOverDarkSurface";
import { cn } from "@/lib/utils";

/**
 * Thin bar pinned to the top of the viewport that tracks reading progress.
 * Inverts over ink sections, matching the wordmark and cursor — the probe sits
 * a couple of pixels down, which is where the bar itself is drawn.
 *
 * Driven by a single scrubbed ScrollTrigger over the whole document. `scaleX`
 * on a `origin-left` bar is a composited transform, so this costs nothing per
 * frame beyond the compositor.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const overDark = useOverDarkSurface(2);

  useGsap(() => {
    gsap.fromTo(
      ref.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          /* Measured against the scroller itself, not against an element.
           *
           * This used to be `trigger: document.documentElement` with
           * `end: "bottom bottom"`, which is short by exactly the length of
           * every pin on the page. A pin inserts its spacer inside `body`, so
           * the window's maximum scroll grows while the measurement this took
           * does not — with the Stack's 810px pin that left the bar reaching
           * 100% at 9987px on a page that scrolls to 10797px, so the last
           * 7.5% was read against a bar that had already finished. An explicit
           * `ScrollTrigger.refresh()` did not correct it, because the value
           * was wrong at every refresh rather than merely stale.
           *
           * `end: "max"` is the fix, and it has to be the keyword rather than
           * a measurement. Reading `ScrollTrigger.maxScroll(window)` from an
           * `end` function looks equivalent and is not: refresh reverts every
           * pin to measure natural positions before re-applying it, so a
           * function evaluated during that window sees the document *without*
           * pin spacing and returns the same short 9987. The keyword is
           * resolved against the final scroll range once refresh has settled,
           * which is the only value that accounts for pins. */
          start: 0,
          end: "max",
          scrub: 0.3,
          invalidateOnRefresh: true,
        },
      },
    );
  }, ref);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        /* Above the header, not below it.
         *
         * At z-60 this sat under the header's reading scrim (the header is
         * z-80, and the scrim is one of its children), so the blur and wash
         * meant to soften the page behind the nav were softening the progress
         * bar as well — the one element up here that is supposed to stay a
         * crisp hairline.
         *
         * 90 clears the header while staying under the overlay band at 100,
         * which is where the modal, the mobile menu and the toast live. Those
         * still cover it, which is correct: reading progress is irrelevant
         * while a dialog is open. It is 2px tall against the header's 16px of
         * top padding, so sitting above the nav costs it no legibility. */
        "fixed inset-x-0 top-0 z-[90] h-[2px] origin-left scale-x-0 transition-colors duration-300",
        overDark ? "bg-cream" : "bg-ink",
      )}
    />
  );
}
