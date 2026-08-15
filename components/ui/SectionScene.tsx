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
 * Carries a section's content in as it arrives and out as it leaves, so the
 * opaque sections do not butt together as hard seams.
 *
 * One trigger and one timeline: two separate `fromTo`s would both own
 * `opacity` on the same element and the exit's start state would overwrite the
 * entrance. The middle 64% is a hold, so a section is at full strength for the
 * whole time it is being read. `ease: "none"` throughout, since the scrub is
 * already the easing.
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
