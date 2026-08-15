"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { contrastInkAt } from "@/lib/surface";

type CursorMode = "default" | "hover" | "drag" | "view";

/** Base ring diameter in px. Every other size is a scale of this. */
const RING = 28;

/**
 * Scale per mode, so the morph is a composited transform, never a resize.
 *
 * `hover` is deliberately held under 2×. The ring's job over a link is to
 * acknowledge it, while the link's own sweep (see the link interaction system
 * in globals.css) is what actually does the highlighting — so a ring that grew
 * much past this would be covering the very thing it is pointing at. The badge
 * modes are larger because they have to fit a word inside them.
 */
const SCALE: Record<CursorMode, number> = {
  default: 1,
  hover: 1.85,
  drag: 2.6,
  view: 2.6,
};

/**
 * The faint wash carried inside the ring while it is over something
 * interactive.
 *
 * A hollow ring reads as a pointer; a filled one reads as a *state*. This is
 * what makes hovering feel like the cursor has latched onto a target rather
 * than merely grown, and it is kept low enough that type stays legible
 * straight through it.
 *
 * Written out per surface rather than derived with `color-mix()`: GSAP's colour
 * parser tweens rgb/rgba/hex, and handing it a `color-mix()` string gives it
 * something it cannot interpolate between. These are the same two values
 * `contrastInkAt` resolves to, at 14%.
 */
const WASH: Record<string, string> = {
  "#0a0a0a": "rgba(10, 10, 10, 0.14)",
  "#ebeada": "rgba(235, 234, 218, 0.14)",
};

const CLEAR = "rgba(0, 0, 0, 0)";

/**
 * Editorial custom cursor: a ring that trails the pointer and morphs into a
 * labelled badge over annotated zones (`data-cursor="drag" | "view"`).
 *
 * Its colour is derived from whatever is actually beneath it. The hit-test
 * stack is walked for the first opaque background and its luminance decides
 * ink or cream, so the ring stays visible crossing an ink button or the yellow
 * CTA, not just over section backgrounds.
 *
 * Two performance choices worth keeping:
 *
 *  - Position comes from `gsap.quickTo`, which reuses one tween per axis rather
 *    than allocating a new one per pointer event. Movement never touches React.
 *  - The morph is a `scale` on a fixed-size ring, not an animated width and
 *    height. Scaling is composited; resizing would invalidate layout on every
 *    frame of every hover. The label is a sibling, so it is not scaled with it.
 *
 * Renders nothing on touch devices or when reduced motion is preferred.
 */
export function Cursor() {
  const reduced = usePrefersReducedMotion();
  const isDesktop = useIsDesktop();
  const enabled = isDesktop && !reduced;

  const followRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<CursorMode>("default");
  const [tint, setTint] = useState("#0a0a0a");
  const badge = mode === "drag" || mode === "view";

  useEffect(() => {
    if (!enabled) return;
    const follow = followRef.current;
    const dot = dotRef.current;
    if (!follow || !dot) return;

    document.documentElement.classList.add("cursor-none");
    gsap.set([follow, dot], { xPercent: -50, yPercent: -50 });

    const followX = gsap.quickTo(follow, "x", { duration: 0.4, ease: "power3" });
    const followY = gsap.quickTo(follow, "y", { duration: 0.4, ease: "power3" });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "none" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "none" });

    let frame = 0;
    let lastX = 0;
    let lastY = 0;
    let shown = false;

    // Hit-testing and reading computed styles both force layout, so this runs
    // at most once per frame rather than on every pointermove event.
    const probe = () => {
      frame = 0;
      // The overlay is pointer-events:none, so this reads the page beneath it.
      const target = document.elementFromPoint(lastX, lastY);
      const label = target?.closest<HTMLElement>("[data-cursor]")?.dataset
        .cursor;

      if (label === "drag" || label === "view") setMode(label);
      else if (
        label === "hover" ||
        target?.closest("a, button, input, textarea, [role='button']")
      ) {
        setMode("hover");
      } else setMode("default");

      setTint(contrastInkAt(lastX, lastY));
    };

    const move = (event: PointerEvent) => {
      lastX = event.clientX;
      lastY = event.clientY;
      followX(lastX);
      followY(lastY);
      dotX(lastX);
      dotY(lastY);
      if (!shown) {
        shown = true;
        gsap.to([follow, dot], { autoAlpha: 1, duration: 0.2 });
      }
      if (!frame) frame = requestAnimationFrame(probe);
    };

    const leave = () => {
      shown = false;
      gsap.to([follow, dot], { autoAlpha: 0, duration: 0.2 });
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      if (frame) cancelAnimationFrame(frame);
      gsap.killTweensOf([follow, dot]);
      document.documentElement.classList.remove("cursor-none");
    };
  }, [enabled]);

  // Mode and tint change rarely, so they are fine to drive from React. Tweened
  // rather than set, so the ring morphs instead of snapping.
  useEffect(() => {
    if (!enabled) return;
    gsap.to(ringRef.current, {
      scale: SCALE[mode],
      borderColor: badge ? "#0a0a0a" : tint,
      // The wash is the surface's own contrast colour at low alpha, so it
      // stays visible on ink and on cream without being specified twice.
      backgroundColor: badge
        ? "#ffff23"
        : mode === "hover"
          ? (WASH[tint] ?? CLEAR)
          : CLEAR,
      duration: 0.35,
      ease: "power3.out",
    });
    gsap.to(labelRef.current, {
      autoAlpha: badge ? 1 : 0,
      duration: 0.2,
    });
    gsap.to(dotRef.current, {
      backgroundColor: tint,
      autoAlpha: badge ? 0 : 1,
      duration: 0.25,
    });
  }, [mode, tint, badge, enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[200] hidden lg:block"
    >
      {/* Follower: carries the position. Ring and label ride inside it, so the
          ring's scale never touches the label's type size. */}
      <div
        ref={followRef}
        className="invisible absolute top-0 left-0 opacity-0"
      >
        <div
          ref={ringRef}
          style={{ width: RING, height: RING }}
          className="rounded-full border-2"
        />
        <span
          ref={labelRef}
          className="eyebrow invisible absolute inset-0 flex items-center justify-center text-[0.6rem] font-bold whitespace-nowrap text-ink opacity-0"
        >
          {mode === "drag" ? "Drag" : "View"}
        </span>
      </div>

      <div
        ref={dotRef}
        className="invisible absolute top-0 left-0 h-1.5 w-1.5 rounded-full opacity-0"
      />
    </div>
  );
}
