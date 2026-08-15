"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** Travel (px) past which a pointer gesture counts as a drag, not a click. */
const DRAG_THRESHOLD = 4;

/**
 * How far a throw carries, as a multiplier on the release velocity (px/ms).
 *
 * Tuned against the card width: a comfortable flick should carry roughly one
 * card and a half, not the whole track. Raising this makes the timeline feel
 * slippery and overshoots the card the reader was aiming at.
 */
const THROW = 220;

/** Release speeds below this (px/ms) are a release, not a throw. */
const THROW_FLOOR = 0.12;

/** Longest a throw is allowed to coast for, in seconds. */
const MAX_GLIDE = 1.1;

/**
 * Adds click-and-drag panning, with inertia, to a natively scrolling element.
 *
 * The element keeps doing the scrolling; this only translates a held mouse into
 * `scrollLeft`, so focus, keyboard and touch momentum share one source of truth.
 *
 * Mouse only: touch and pen already pan natively, and hijacking them on a
 * horizontal track inside a vertically scrolling page risks swallowing the page
 * scroll. Velocity is sampled from the last few milliseconds rather than
 * averaged, so a fast flick throws and an eased stop does not. A gesture that
 * moved is swallowed on the way up, so releasing over a card does not open it.
 */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let dragging = false;
    let moved = false;
    let startX = 0;
    let startScroll = 0;

    // Last sample, for the release velocity.
    let lastX = 0;
    let lastT = 0;
    let velocity = 0;

    /** Kills any coasting glide. Called before anything else takes the track. */
    const stopGlide = () => gsap.killTweensOf(el);

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      stopGlide();
      dragging = true;
      moved = false;
      startX = event.clientX;
      startScroll = el.scrollLeft;
      lastX = event.clientX;
      lastT = event.timeStamp;
      velocity = 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = event.clientX - startX;
      if (Math.abs(dx) > DRAG_THRESHOLD) moved = true;
      el.scrollLeft = startScroll - dx;

      // Instantaneous velocity, smoothed just enough that a single jittery
      // sample cannot decide the throw. `timeStamp` rather than
      // `performance.now()` so this is the browser's own event clock.
      const dt = event.timeStamp - lastT;
      if (dt > 0) {
        const sample = (event.clientX - lastX) / dt;
        velocity = velocity * 0.7 + sample * 0.3;
        lastX = event.clientX;
        lastT = event.timeStamp;
      }
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;

      // A gesture that ended paused is a placement, not a throw: if the last
      // sample is stale the pointer was already stationary before release.
      if (event.timeStamp - lastT > 90) velocity = 0;
      if (Math.abs(velocity) < THROW_FLOOR) return;

      const limit = el.scrollWidth - el.clientWidth;
      const target = gsap.utils.clamp(
        0,
        limit,
        el.scrollLeft - velocity * THROW,
      );
      const distance = Math.abs(target - el.scrollLeft);
      if (distance < 1) return;

      gsap.to(el, {
        scrollLeft: target,
        // Longer throws coast longer, up to a ceiling. A fixed duration makes
        // short flicks feel sluggish and long ones feel abrupt.
        duration: Math.min(MAX_GLIDE, 0.28 + distance / 900),
        ease: "power2.out",
        overwrite: true,
      });
    };

    // Capture phase: the click has to be stopped before it reaches the card.
    // `moved` is cleared here rather than on pointerup, because this fires
    // after it and is the last thing that needs to read the flag.
    const onClickCapture = (event: MouseEvent) => {
      if (!moved) return;
      event.preventDefault();
      event.stopPropagation();
      moved = false;
    };

    // Any other way of moving the track wins over a glide in progress, so a
    // wheel nudge or a touch never fights a tween for `scrollLeft`.
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("wheel", stopGlide, { passive: true });
    el.addEventListener("touchstart", stopGlide, { passive: true });
    // On window, so a drag that leaves the track still tracks and still ends.
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp);
    el.addEventListener("click", onClickCapture, true);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("wheel", stopGlide);
      el.removeEventListener("touchstart", stopGlide);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("click", onClickCapture, true);
      gsap.killTweensOf(el);
    };
  }, []);

  return ref;
}
