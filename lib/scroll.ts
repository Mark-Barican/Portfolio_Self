"use client";

import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Shared vocabulary for the page's scroll scenes.
 *
 * This is deliberately thin. `lib/gsap.ts` still owns registration and
 * `useGsap` still owns the React lifecycle (context + revert + reduced-motion
 * bail); nothing here duplicates either. What it does own is the *timing*: the
 * scrub values, easings and viewport thresholds that decide whether two
 * sections feel like one continuous movement or two unrelated animations.
 *
 * Every scene on the page reads its numbers from here, so the whole page can be
 * re-paced from one file rather than by hunting through twenty components for
 * a hard-coded `scrub: 0.5`.
 */

/* -------------------------------------------------------------------------- */
/*  Timing tokens                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Scrub values, in seconds of catch-up lag.
 *
 * `scrub: true` locks an animation to the scrollbar exactly, which exposes
 * every coarse step a mouse wheel produces. A small numeric scrub lets the
 * tween trail the input and smooths those steps out without the motion feeling
 * detached from the gesture.
 *
 *   tight   surface colour and other changes that must not lag behind the
 *           geometry they are covering, or a seam shows.
 *   base    the default for scene choreography.
 *   loose   long parallax drifts, where lag reads as mass.
 */
export const SCRUB = {
  tight: 0.25,
  base: 0.5,
  loose: 0.8,
} as const;

/** Easings, named by role rather than by curve. */
export const EASE = {
  /** Entrances: fast out of the gate, long settle. */
  in: "power3.out",
  /** Exits: slow to leave, then gone. */
  out: "power2.in",
  /** Scrubbed motion. Anything else double-eases against the scroll itself. */
  linear: "none",
  /** Reveals that should feel typeset rather than thrown. */
  editorial: "power2.inOut",
} as const;

/**
 * Where a block should start reacting, as a ScrollTrigger `start` string.
 *
 * `read` fires a little before a block is fully on screen so it has settled by
 * the time it is actually being read. `enter` waits until it is properly in
 * frame, for things that should feel like they arrive rather than pre-empt.
 */
export const START = {
  read: "top 88%",
  enter: "top 75%",
  centre: "top 60%",
} as const;

/* -------------------------------------------------------------------------- */
/*  Breakpoints                                                               */
/* -------------------------------------------------------------------------- */

/**
 * The one place the animation layer's breakpoints are written down.
 *
 * These mirror Tailwind's `lg`, and the `.98` on the max is not a typo: a plain
 * `max-width: 1024px` overlaps `min-width: 1024px` at exactly 1024, so both
 * contexts would run at once and two timelines would fight over the same
 * transforms.
 */
export const MEDIA = {
  desktop: "(min-width: 1024px)",
  handheld: "(max-width: 1023.98px)",
} as const;

/* -------------------------------------------------------------------------- */
/*  Scene helpers                                                             */
/* -------------------------------------------------------------------------- */

interface SceneOptions {
  /**
   * A node, or a selector string. Selector strings are resolved against the
   * `gsap.context` scope the scene is built in, so `"[data-foo]"` cannot reach
   * outside the section that owns it.
   */
  trigger: Element | string | null;
  start?: string;
  end?: string;
  scrub?: number;
  pin?: boolean | Element;
  pinSpacing?: boolean;
  id?: string;
}

/**
 * A scrubbed scene: the animation's progress *is* the scroll position.
 *
 * `invalidateOnRefresh` is on for every scene rather than opted into, because
 * every distance on this page is derived from viewport units. Without it a
 * timeline keeps the pixel values it measured at the width the page loaded at,
 * and a resize leaves elements travelling to positions that no longer exist.
 *
 * `anticipatePin` is applied automatically wherever a scene pins, which lets
 * ScrollTrigger apply the pin a frame early on fast scrolls and removes the
 * one-frame jump you otherwise get at high wheel velocity.
 */
export function scrubbed({
  trigger,
  start = "top top",
  end = "bottom top",
  scrub = SCRUB.base,
  pin = false,
  pinSpacing,
  id,
}: SceneOptions): ScrollTrigger.Vars {
  return {
    trigger: trigger ?? undefined,
    start,
    end,
    scrub,
    pin,
    ...(pin ? { anticipatePin: 1 } : null),
    ...(pinSpacing === undefined ? null : { pinSpacing }),
    invalidateOnRefresh: true,
    id,
  };
}

/**
 * A reveal scene: plays on the way down, plays back out on the way up.
 *
 * Reads as onEnter / onLeave / onEnterBack / onLeaveBack. `onLeave` is
 * deliberately "none" — that fires when a block passes off the top of the
 * screen, where reversing it would burn frames on something nobody can see.
 */
export function revealed({
  trigger,
  start = START.read,
  id,
}: Pick<SceneOptions, "trigger" | "start" | "id">): ScrollTrigger.Vars {
  return {
    trigger: trigger ?? undefined,
    start,
    toggleActions: "play none none reverse",
    invalidateOnRefresh: true,
    id,
  };
}

/* -------------------------------------------------------------------------- */
/*  Refresh coordination                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Recomputes every ScrollTrigger's measurements once the page's own assets
 * have settled.
 *
 * Scenes are built during layout effects, when webfonts may still be swapping
 * and lazily-loaded images have no intrinsic height yet. Both change the
 * document's height *after* the triggers measured it, which leaves starts and
 * ends pointing at the wrong scroll offsets — the usual cause of an animation
 * that fires visibly early or late on a cold load but is correct after a
 * resize.
 *
 * Safe to call more than once: `ScrollTrigger.refresh()` is idempotent, and the
 * returned disposer removes the listeners it added.
 */
export function refreshWhenSettled(): () => void {
  if (typeof window === "undefined") return () => {};

  const refresh = () => ScrollTrigger.refresh();

  // Webfonts: Archivo swapping in changes the height of every display heading.
  document.fonts?.ready.then(refresh).catch(() => {});

  window.addEventListener("load", refresh);
  return () => window.removeEventListener("load", refresh);
}

/**
 * Runs `build` for each matching media query and disposes it on the way out.
 *
 * A thin pass-through over `gsap.matchMedia()` that exists so scenes name their
 * breakpoints from `MEDIA` instead of writing query strings inline, and so the
 * teardown is impossible to forget. The `matchMedia` instance is returned by
 * `gsap.context` cleanup via `useGsap`, so nothing extra is needed to revert it.
 */
export function perViewport(
  builders: Partial<Record<keyof typeof MEDIA, () => void>>,
): gsap.MatchMedia {
  const mm = gsap.matchMedia();
  for (const [key, build] of Object.entries(builders)) {
    if (build) mm.add(MEDIA[key as keyof typeof MEDIA], build);
  }
  return mm;
}
