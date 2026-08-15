"use client";

import { type ReactNode, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGsap } from "@/hooks/useGsap";

interface ParallaxYProps {
  children: ReactNode;
  className?: string;
  /**
   * Total vertical travel in px across the pass. Positive lags behind the
   * scroll (reads as further away); negative runs ahead of it (reads nearer).
   */
  distance?: number;
}

/**
 * Drifts its children vertically as they cross the viewport, scrubbed by
 * scroll position rather than fired once on entry.
 *
 * Depth comes from giving neighbouring elements different `distance` values:
 * the further back a layer is meant to sit, the more it should lag. Scrolling
 * back up plays it in reverse, because the position *is* the scroll offset.
 *
 * `scrub: 0.6` rather than `true`: the tween trails the scrollbar by just over
 * half a second, which smooths out the coarse steps a mouse wheel produces
 * without the movement feeling detached from the input.
 */
export function ParallaxY({
  children,
  className,
  distance = 60,
}: ParallaxYProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(
    () => {
      const el = ref.current;
      if (!el) return;

      gsap.fromTo(
        el,
        { y: distance },
        {
          y: -distance,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
            // Transform-only, so the compositor can handle it without the
            // main thread recalculating layout on every frame.
            invalidateOnRefresh: true,
          },
        },
      );
    },
    ref,
    [distance],
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
