"use client";

import { gsap } from "@/lib/gsap";
import { EASE } from "@/lib/scroll";

/**
 * The hero's exit choreography, normalised to a 0→1 duration so the positions
 * below read as a storyboard.
 *
 * Sequenced, not simultaneous: the reading layer leaves and the ground drifts,
 * BARICAN arrives in the space the copy vacated and holds, then the cream comes
 * up behind it. Phase 3 deliberately overlaps the name's exit and runs to 1.
 * Running the phases strictly end to end left empty frames to scroll through.
 *
 * @param depth  scales the throw. 1 on desktop, less on handhelds.
 * @param shift  the surname's travel as a percentage of its own width.
 */
export function heroExit(depth: number, shift: number): gsap.core.Timeline {
  const tl = gsap.timeline();

  /* -- Phase 1: the words go, the ground opens up ------------------------- */

  tl.to(
    "[data-hero='copy']",
    { y: -60 * depth, autoAlpha: 0, duration: 0.34, ease: EASE.out },
    0,
  )
    // The three ground planes run the full length at their own rates. Linear,
    // because they are already being eased by the scrub itself.
    .to(
      "[data-hero='grid']",
      { y: 70 * depth, opacity: 0.3, duration: 1, ease: EASE.linear },
      0,
    )
    .to(
      "[data-hero='atmosphere']",
      { y: 120 * depth, opacity: 0.35, duration: 1, ease: EASE.linear },
      0,
    )
    .to(
      "[data-hero='key']",
      { y: 200 * depth, opacity: 0.25, duration: 1, ease: EASE.linear },
      0,
    )
    .to(
      "[data-hero='marks']",
      {
        y: -110 * depth,
        rotate: 2.5,
        autoAlpha: 0,
        duration: 0.5,
        ease: EASE.linear,
      },
      0,
    )

    /* -- Phase 2: the name arrives, holds, and clears ---------------------- */

    // The shift targets the <span>, not its wrapper. `xPercent` is a percentage
    // of the animated element's own width, and the wrapper is only as wide as
    // the figure's column (~715px) while the word itself is ~1265px. Driving
    // the wrapper moved it barely two thirds of the distance and the name
    // stayed cropped.
    .to(
      "[data-hero='word'] span",
      { xPercent: shift, duration: 0.32, ease: "power2.out" },
      0.08,
    )
    .to(
      "[data-hero='word']",
      { y: 30 * depth, duration: 0.32, ease: "power2.out" },
      0.08,
    )

    /* The figure leaves *before* the name arrives, not alongside it.
     *
     * It used to start at 0.26 and run for 0.32, so it was not clear until
     * 0.58, while the surname finishes travelling into place at 0.40. For
     * those eighteen hundredths the name is centred behind a portrait that is
     * still most of the way opaque, which is exactly when it is supposed to be
     * the only thing on screen. The reader never gets a clean look at it.
     *
     * Starting at 0.04 and running for 0.30 clears the figure by 0.34, a beat
     * ahead of the name settling. The order now reads: the copy goes, the
     * figure goes, and the name arrives into an empty frame. */
    .to(
      "[data-hero='figure']",
      {
        y: 60 * depth,
        scale: 1.07,
        autoAlpha: 0,
        duration: 0.3,
        ease: EASE.out,
      },
      0.04,
    )

    // 0.40 → 0.52 is a hold. Nothing is tweened across it on purpose: the name
    // has to be *arrived* and legible, not still travelling when it starts to
    // leave.

    // 0.52 → 0.74  and then it goes, lifted and faded rather than dissolved in
    // place, so it reads as leaving rather than as being covered by whatever
    // comes next.
    .to(
      "[data-hero='word']",
      {
        y: -70 * depth,
        autoAlpha: 0,
        duration: 0.22,
        ease: "power2.in",
      },
      0.52,
    )

    /* -- Phase 3: cream takes the screen ----------------------------------- */

    // Starts at 0.64, which is two thirds of the way through the name's exit.
    // That overlap is what removes the empty dark frame this sequence used to
    // have; the name is far enough gone by then that the order still reads.
    //
    // Runs to 1, so the surface is complete exactly as the pin releases and
    // there is no held tail to scroll through.
    .to(
      "[data-hero='handoff']",
      { opacity: 1, duration: 0.36, ease: EASE.editorial },
      0.64,
    );

  return tl;
}
