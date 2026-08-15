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
   * Bigger reads as more of a chapter break. It costs nothing extra — the band
   * is opaque, so its height changes how long the surface persists, not how
   * much blending happens.
   */
  depth?: number;
}

/**
 * Carries the previous section's surface over the top of this one, then wipes
 * it away as the boundary crosses the viewport.
 *
 * **This is a wipe, not a cross-fade, and that is the whole point.**
 *
 * It used to fade a translucent band of the previous colour from opacity 1 to
 * 0. That is the obvious way to do it and it cannot be made to work here,
 * because of what the two colours are: bone (#d5cfbe) at partial alpha over
 * ink (#111110) resolves through olive-grey. Every intermediate frame of a
 * cream↔ink cross-fade is mud. At a 160px band that reads as a slightly dirty
 * seam; carried over most of a screen it becomes the grey-olive slab that used
 * to sit under the last of the work index while Valentine's 2026 was still on
 * screen, which is what made the Stack look like it was arriving early.
 *
 * So the band here is **fully opaque** and is removed by scaling it away from
 * its top edge. At every frame each pixel is either wholly the old surface or
 * wholly the new one, and the line between them travels up the screen. There
 * is no blend, so there is no grey — at any band height.
 *
 * A short feather is masked onto the band's bottom edge so the travelling line
 * is soft rather than a hard rule. It is a fraction of the band, not a gradient
 * across the whole of it, so it never covers enough area to read as a colour in
 * its own right.
 *
 * Always the top edge of the arriving section, never the bottom of the leaving
 * one. Painting the next colour at the bottom of a section runs the blend
 * backwards: it would show the new surface first and then reveal the old one
 * underneath as you scrolled toward it.
 *
 * Rests at `scaleY(0)` — invisible — so that a visitor whose scenes never run
 * (reduced motion, or a failed bundle) gets a correct hard boundary between two
 * properly painted sections rather than a slab of the wrong colour parked over
 * this one's heading.
 *
 * Inert throughout: `pointer-events: none` via `.layer-decoration`, and
 * `aria-hidden` because it is a colour, not content.
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
         which makes the band invisible to `elementsFromPoint` — the probe
         reads it by geometry instead. Its scaled rect shrinks with the wipe,
         so the hand-over lands exactly where the moving edge does. */
      data-surface-layer={from}
      /* **Starts one pixel *above* the section, not at its top edge.**
       *
       * Section boundaries on this page land on fractional pixels — the
       * About/Contact seam sits at y = 10464.953 — because every section's
       * height is the sum of its content's line boxes, and those are not
       * integers. A band whose top edge coincides exactly with that boundary
       * is rasterised by blending its own colour with whatever is behind it,
       * which is the *next* section's surface. Cream over ink at 95% coverage
       * produces one row of dark grey, with cream above it and cream below it:
       * a hairline floating in the middle of the wash, which is precisely the
       * line that appears above the contact section.
       *
       * Overlapping the section above by a pixel moves that blended row onto a
       * boundary where both sides are the same colour — the band's cream over
       * the previous section's cream — so there is nothing left to see. The
       * extra pixel is added to the height as well, so the bottom edge and the
       * feather below it do not move.
       *
       * This requires the owning section to clip horizontally only; see the
       * note on `overflow-x-clip` at the three call sites. */
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
