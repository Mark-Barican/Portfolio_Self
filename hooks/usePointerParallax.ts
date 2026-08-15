"use client";

import { useEffect, type RefObject } from "react";
import { gsap, isDesktopViewport, prefersReducedMotion } from "@/lib/gsap";

/**
 * Moves every `[data-depth-x]` / `[data-depth-y]` element inside `scope` in
 * response to the pointer, each by its own amount.
 *
 * Depth lives in the markup: an element declaring `data-depth-x="58"` travels
 * 58px across the full width of the window, one declaring `-18` travels the
 * same distance the other way and reads as nearer the viewer. That is the whole
 * depth hierarchy, and it is legible where the layers are written rather than
 * buried in here.
 *
 * `gsap.quickTo` gives one reusable tween per element per axis. Pointer events
 * only feed it a number; GSAP owns the frame loop and the easing, so there is
 * no rAF loop of our own to start, throttle or leak, and React never re-renders
 * on pointer movement.
 *
 * Deliberately applied to the *inner* element of each layer. The section's
 * scrubbed scroll timeline animates the outer one, so the two compose instead
 * of overwriting each other's transform.
 *
 * Disabled for reduced motion and below `lg`. Coarse pointers send a single
 * synthetic move on tap, which would shove the composition sideways and leave
 * it there.
 */
export function usePointerParallax<T extends HTMLElement>(
  scope: RefObject<T | null>,
) {
  useEffect(() => {
    const root = scope.current;
    if (!root || prefersReducedMotion() || !isDesktopViewport()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const layers = gsap.utils
      .toArray<HTMLElement>("[data-depth-x], [data-depth-y]", root)
      .map((el) => ({
        x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3" }),
        y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3" }),
        depthX: Number(el.dataset.depthX ?? 0),
        depthY: Number(el.dataset.depthY ?? 0),
        el,
      }));

    if (layers.length === 0) return;

    // Measured against the viewport, not the section: the hero is taller than
    // the screen on short laptops, and a rect-relative reading would make the
    // effect depend on how far the page happens to be scrolled.
    const onMove = (event: PointerEvent) => {
      const px = event.clientX / window.innerWidth - 0.5;
      const py = event.clientY / window.innerHeight - 0.5;
      for (const layer of layers) {
        layer.x(px * layer.depthX);
        layer.y(py * layer.depthY);
      }
    };

    // Returning to centre on exit stops the composition being left skewed
    // while the pointer sits outside the window.
    const onLeave = () => {
      for (const layer of layers) {
        layer.x(0);
        layer.y(0);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      for (const layer of layers) gsap.killTweensOf(layer.el);
    };
  }, [scope]);
}
