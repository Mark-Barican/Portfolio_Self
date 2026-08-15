"use client";

import { type ReactNode, useRef } from "react";
import { gsap, SCROLL_IN_OUT } from "@/lib/gsap";
import { useGsap } from "@/hooks/useGsap";

/**
 * This section's signature entrance: the photograph is uncovered by a clip
 * travelling up from its foot, and the two drawn corner marks are then drawn on
 * afterwards, each growing out from its own corner.
 *
 * Distinct from every other section on purpose: the work index wipes in from
 * the left, the journey cards are dealt from the right, the stack clusters pop,
 * the capability rules draw across. This one develops like a print.
 *
 * A thin client wrapper so `children` (the image and its caption) stay
 * server-rendered.
 */
export function AboutFigure({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(
    () => {
      gsap
        .timeline({
          scrollTrigger: { trigger: ref.current, start: "top 82%", toggleActions: SCROLL_IN_OUT },
        })
        .from("[data-about-photo]", {
          clipPath: "inset(100% 0 0 0)",
          duration: 1.1,
          ease: "power3.inOut",
        })
        .from(
          "[data-about-mark]",
          {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.12,
          },
          "-=0.35",
        )
        .from(
          "[data-about-caption]",
          { opacity: 0, y: 12, duration: 0.5, ease: "power3.out" },
          "-=0.3",
        );
    },
    ref,
    [],
  );

  return <div ref={ref}>{children}</div>;
}
