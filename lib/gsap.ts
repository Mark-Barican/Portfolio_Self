"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * The single place GSAP is configured.
 *
 * Everything animated on this site goes through here, and ScrollTrigger is the
 * only plugin registered. ScrollSmoother ships in the same package and is
 * deliberately left out: it replaces native scrolling with a transformed
 * proxy, which fights the browser's own scroll anchoring and costs more than
 * the smoothing is worth on a page this length.
 *
 * `registerPlugin` is idempotent, and this module is evaluated once per bundle
 * regardless of how many components import it, so no guard is needed beyond
 * keeping it off the server.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.config({
    // Mobile browsers fire a resize every time the URL bar collapses. Without
    // this, every ScrollTrigger recalculates mid-scroll and the page stutters.
    ignoreMobileResize: true,
  });

  // Default to transform-only, GPU-friendly easing everywhere.
  gsap.defaults({ ease: "power2.out", duration: 0.8 });
}

export { gsap, ScrollTrigger };

/**
 * The page's standard scroll behaviour for entrance animations.
 *
 * Reads as onEnter / onLeave / onEnterBack / onLeaveBack. Content plays in when
 * it arrives and plays back *out* when the reader scrolls up past it, so the
 * motion always follows the direction of travel rather than firing once and
 * staying put. Scrolling down again replays it.
 *
 * `onLeave` is deliberately "none": that fires when a block passes off the top
 * of the screen, where reversing it would burn frames on something nobody can
 * see.
 */
export const SCROLL_IN_OUT = "play none none reverse";

/** True when the visitor has asked the OS to reduce motion. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Pinning and pointer parallax are desktop-only affordances. */
export function isDesktopViewport(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 1024px)").matches
  );
}
