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
 * The element does the scrolling; this only translates a held mouse into
 * `scrollLeft`. That matters — a transform-based carousel keeps its own idea of
 * the position, which then disagrees with the scroll the browser performs when
 * something inside takes focus. Here there is one source of truth, so focus,
 * keyboard, touch momentum and the drag gesture can never fall out of sync.
 *
 * Mouse only. Touch and pen already pan natively with real momentum, and
 * hijacking them would replace a good native gesture with a worse synthetic
 * one — and, on a horizontal track inside a vertically scrolling page, would
 * risk swallowing the vertical scroll. Leaving touch alone is what keeps the
 * page scrollable through the timeline on a phone.
 *
 * The inertia is the one synthetic part, and it exists because a mouse has no
 * equivalent: releasing a held drag on a real surface keeps moving, and without
 * this the track stops dead the instant the button comes up. Velocity is
 * sampled from the last few milliseconds of the gesture rather than averaged
 * across it, so a flick that ends fast throws far and a drag that is eased to a
 * halt before release does not throw at all.
 *
 * Boundaries need no clamping of their own: the target is clamped to the
 * track's own scroll range before the glide starts, so nothing can be thrown
 * past either end.
 *
 * A gesture that moved is swallowed on the way back up, so releasing a drag
 * over a card does not also open it.
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
