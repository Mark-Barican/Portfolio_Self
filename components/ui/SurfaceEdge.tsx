"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { EASE, SCRUB, scrubbed } from "@/lib/scroll";
import { useGsap } from "@/hooks/useGsap";

type Surface = "ink" | "cream";

const COLOR: Record<Surface, string> = {
  ink: "#111110",
  cream: "#d5cfbe",
};

interface SurfaceEdgeProps {
  /** The surface of the section *above* this one. */
  from: Surface;
  /**
   * How far the previous surface is carried into this section, in svh.
   *
   * Bigger reads as more of a chapter break. It costs nothing extra: the band
   * is opaque, so its height changes how long the surface persists, not how
   * much blending happens.
   */
  depth?: number;
}

/**
 * Carries the previous section's surface over the top of this one, then wipes
 * it away as the boundary crosses the viewport.
 *
 * A wipe, not a cross-fade: cream at partial alpha over ink resolves through
 * olive-grey, so every intermediate frame of a fade is mud. The band is opaque
 * and scaled away from its top edge, so each pixel is wholly one surface or the
 * other. A short feather on its bottom edge softens the travelling line.
 *
 * Always on the arriving section's top edge, never the leaving one's bottom,
 * or the blend runs backwards. Rests at `scaleY(0)`, so a visitor whose scenes
 * never run gets a correct hard boundary rather than a misplaced slab.
 */
export function SurfaceEdge({ from, depth = 55 }: SurfaceEdgeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(
    () => {
      const el = ref.current;
      if (!el) return;

      // Lifts the band off its resting scale. Inside `useGsap`, so a
      // reduced-motion visitor never reaches it and the band stays collapsed.
      gsap.set(el, { scaleY: 1 });

      gsap.to(el, {
        scaleY: 0,
        ease: EASE.linear,
        scrollTrigger: scrubbed({
          trigger: el.parentElement,
          // Consumed as the boundary crosses the viewport. Finishing at 45%
          // means the new surface is fully established by the time this
          // section's own content reaches reading position.
          start: "top bottom",
          end: "top 45%",
          scrub: SCRUB.tight,
        }),
      });
    },
    ref,
    [from, depth],
  );

  return (
    <div
      ref={ref}
      aria-hidden
      /* Declares the surface this band paints, so fixed chrome can colour
         itself against it. `.layer-decoration` sets `pointer-events: none`,
         which makes the band invisible to `elementsFromPoint`: the probe
         reads it by geometry instead. Its scaled rect shrinks with the wipe,
         so the hand-over lands exactly where the moving edge does. */
      data-surface-layer={from}
      /* Starts 1px above the section. Section boundaries land on fractional
         pixels, so a band flush with the edge blends its colour with the next
         section's and renders a hairline inside the wash. Overlapping moves
         that blend onto same-coloured pixels. Requires the owning section to
         clip horizontally only (`overflow-x-clip`). */
      className="layer-decoration absolute inset-x-0 origin-top scale-y-0"
      style={{
        top: "-1px",
        height: `calc(${depth}svh + 1px)`,
        backgroundColor: COLOR[from],
        // Feathers only the bottom eighth, so the moving edge is soft while
        // the rest of the band stays fully opaque.
        maskImage: "linear-gradient(to bottom, black 0%, black 88%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, black 0%, black 88%, transparent 100%)",
      }}
    />
  );
}
