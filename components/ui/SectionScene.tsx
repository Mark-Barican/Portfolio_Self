"use client";

import { type ReactNode, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { EASE, SCRUB, scrubbed } from "@/lib/scroll";
import { useGsap } from "@/hooks/useGsap";

interface SectionSceneProps {
  children: ReactNode;
  /**
   * Skip the exit. For the last section on the page, where fading out would
   * leave the reader looking at an empty screen at the bottom of the document
   * with nowhere further to go.
   */
  exit?: boolean;
  className?: string;
}

/**
 * Carries a section's content in as it arrives and out as it leaves.
 *
 * **This replaces the page's hard section seams.** Every section paints its own
 * opaque surface and they butt directly against one another, so scrolling used
 * to present each one as a sudden edge: content was at full strength the
 * instant its section entered the viewport and stayed there until the boundary
 * went past, which is what read as a line break between blocks rather than as
 * one continuous piece.
 *
 * The order is the point, and it matches the hero's hand-off:
 *
 *   1. the content leaves first, lifting and fading
 *   2. the surface changes underneath it, once there is nothing on top
 *   3. the next section's content arrives on the new surface
 *
 * Doing it the other way round — changing colour under live copy — is what
 * makes a transition read as a glitch, because for a few frames text sits on a
 * surface it was never coloured for.
 *
 * **One trigger, one timeline, three phases.** The obvious construction is two
 * separate `fromTo`s, one for the entrance and one for the exit, and it does
 * not work: both own `opacity` on the same element, and the exit's `from`
 * state renders immediately and overwrites whatever the entrance had reached.
 * A single timeline spanning the section's whole passage cannot fight itself.
 *
 * The proportions are deliberate. The travel is the section's height plus one
 * viewport, and the middle 64% of it is a hold where nothing is tweened at all,
 * so a section is at full strength for the entire time it is actually being
 * read. Only the first and last ~18% carry the motion, which is the part the
 * reader spends crossing a boundary.
 *
 * `ease: "none"` throughout: the scrub is already the easing, and anything else
 * eases twice and reads as lag.
 */
export function SectionScene({
  children,
  exit = true,
  className,
}: SectionSceneProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(
    () => {
      const el = ref.current;
      if (!el) return;

      const tl = gsap.timeline({
        scrollTrigger: scrubbed({
          trigger: el,
          // The full passage: from the moment the block's top edge appears at
          // the bottom of the screen to the moment its bottom edge leaves the
          // top of it.
          start: "top bottom",
          end: "bottom top",
          scrub: SCRUB.base,
        }),
      });

      tl.fromTo(
        el,
        { opacity: 0, y: 46 },
        { opacity: 1, y: 0, duration: 0.18, ease: EASE.linear },
        0,
      ).to(el, { duration: 0.64 }, 0.18);

      if (exit) {
        tl.to(
          el,
          { opacity: 0, y: -46, duration: 0.18, ease: EASE.linear },
          0.82,
        );
      }
    },
    ref,
    [exit],
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
