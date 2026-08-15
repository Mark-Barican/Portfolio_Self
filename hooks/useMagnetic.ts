"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/gsap";

/** How far an element is allowed to lean toward the pointer, in px. */
const PULL = 6;

/**
 * Gives every `[data-magnetic]` inside `scope` a slight lean toward the
 * pointer, released when it leaves.
 *
 * Scoped and delegated rather than a hook per element. Two listeners are bound
 * on the container in the capture phase and the work is dispatched from there,
 * so a row of eight social buttons costs two listeners rather than sixteen, and
 * adding another button costs nothing.
 *
 * The lean is intentionally small: six pixels, which is felt rather than seen.
 * The point is that a control acknowledges the pointer before it is clicked,
 * not that it chases it around; anything larger reads as a toy and starts
 * fighting the element's own hover treatment for attention.
 *
 * Cost per moving frame is one `quickTo` call per axis on a single element.
 * `quickTo` reuses one tween instead of allocating a new one per event, and
 * nothing here touches React state, so a magnetic hover never renders.
 *
 * Desktop pointers only. A touch device has no hover to lean into: the first
 * contact is already the tap, and reduced-motion visitors opt out entirely.
 */
export function useMagnetic(scope: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    if (prefersReducedMotion()) return;
    // Coarse pointers and anything without hover get nothing.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    // One pair of setters per element, created on first contact and reused for
    // the life of the component.
    const setters = new WeakMap<
      HTMLElement,
      { x: (v: number) => void; y: (v: number) => void }
    >();

    const setterFor = (el: HTMLElement) => {
      let pair = setters.get(el);
      if (!pair) {
        pair = {
          x: gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" }),
          y: gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" }),
        };
        setters.set(el, pair);
      }
      return pair;
    };

    const onMove = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-magnetic]",
      );
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const { x, y } = setterFor(target);
      // Offset from the element's centre, normalised to its own size, so a
      // large control and a small one lean by the same amount rather than in
      // proportion to how big they happen to be.
      x(((event.clientX - (rect.left + rect.width / 2)) / rect.width) * PULL * 2);
      y(((event.clientY - (rect.top + rect.height / 2)) / rect.height) * PULL * 2);
    };

    const onOut = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-magnetic]",
      );
      if (!target) return;
      // `pointerout` fires when moving between an element and its own children.
      // Only release when the pointer has actually left the magnetic element.
      const next = event.relatedTarget as Node | null;
      if (next && target.contains(next)) return;

      const { x, y } = setterFor(target);
      x(0);
      y(0);
    };

    root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerout", onOut, { passive: true });
    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerout", onOut);
      // Kill anything mid-flight, and put every element back where it started.
      root
        .querySelectorAll<HTMLElement>("[data-magnetic]")
        .forEach((el) => gsap.killTweensOf(el));
    };
  }, [scope]);
}
