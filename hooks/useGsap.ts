"use client";

import {
  useEffect,
  useLayoutEffect,
  type DependencyList,
  type RefObject,
} from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * `useLayoutEffect` on the client, `useEffect` on the server.
 *
 * The layout timing is the point: it runs before the browser paints, so a
 * `gsap.from()` can set an element's start state without that state ever being
 * visible. Using `useEffect` would let one frame of the finished layout paint
 * first, which reads as a flash.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Runs GSAP setup inside a scoped `gsap.context`, and reverts it on unmount.
 *
 * The context is what makes this safe in React: every tween, timeline and
 * ScrollTrigger created inside `setup` is recorded, and `ctx.revert()` kills
 * all of them *and* restores the inline styles they wrote. Nothing leaks
 * between Fast Refresh passes or route changes.
 *
 * Passing a `scope` ref confines `gsap.utils.toArray` / selector strings inside
 * `setup` to that subtree, so a selector like `".card"` cannot reach across the
 * page and grab another section's markup.
 *
 * Reduced motion is handled by not running at all. Every component here is
 * written so its CSS already describes the finished state and GSAP only
 * animates *from* a start state, so skipping setup leaves content correctly
 * visible and in place, rather than stranded at opacity 0.
 */
export function useGsap(
  setup: (context: gsap.Context) => void,
  scope?: RefObject<Element | null>,
  deps: DependencyList = [],
) {
  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(setup, scope?.current ?? undefined);
    return () => ctx.revert();
    // `setup` is intentionally not a dependency: it is re-created every render,
    // and including it would tear down and rebuild every ScrollTrigger on the
    // page on each one. Callers list what actually matters in `deps`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
