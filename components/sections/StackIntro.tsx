"use client";

import { type ReactNode, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { EASE, SCRUB, scrubbed } from "@/lib/scroll";
import { useGsap } from "@/hooks/useGsap";

/**
 * Reveals the Stack section's opening, scrubbed against the reader's approach.
 *
 * A thin client wrapper for the same reason `StackChoreography` is one: it
 * drives the animation through selectors, so the heading it moves stays
 * server-rendered inside `children`.
 *
 * The title arrives *after* the surface has changed under it, not with it. That
 * ordering is the whole point of this boundary — the cream has to finish and
 * the ink has to establish before the new chapter's name appears, or the two
 * events blur into one and the section change stops registering. The wash above
 * is consumed by `top 25%`; this starts at `top 55%`, so the type is arriving
 * into a surface that has already turned.
 */
export function StackIntro({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(
    () => {
      gsap
        .timeline({
          scrollTrigger: scrubbed({
            trigger: ref.current,
            start: "top 55%",
            end: "top 15%",
            scrub: SCRUB.base,
            id: "stack-intro",
          }),
        })
        // Drawn up from behind its own baseline rather than faded in, which is
        // this section's counterpart to Journey's downward wipe: the page's two
        // chapter openings mirror each other.
        .from("[data-stack-title]", {
          clipPath: "inset(100% 0 0 0)",
          y: -36,
          duration: 0.55,
          ease: EASE.editorial,
        })
        .from(
          "[data-stack-lede]",
          { opacity: 0, y: 20, duration: 0.4, ease: EASE.in },
          0.3,
        );
    },
    ref,
    [],
  );

  return <div ref={ref}>{children}</div>;
}
