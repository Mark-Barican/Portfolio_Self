"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { SITE } from "@/lib/constants";

/** How long the counter takes to reach 100. */
const COUNT_MS = 1500;
/** Matches the `loader-out` keyframes; the curtain is fully gone by then. */
const CURTAIN_MS = 2900;
/**
 * Offset applied when restoring a deep link.
 *
 * Zero, matching the page's `scroll-padding-top`: sections are anchored with
 * their top edge at the top of the viewport and clear the fixed header with
 * their own top padding. This used to be 88 to duplicate the old scroll
 * padding, which would now land a deep link 88px short of where clicking the
 * same link in the nav puts it.
 */
const HEADER_OFFSET = 0;

/**
 * Intro curtain: the brand mark centred on ink with a percentage counting up
 * to 100 beneath it, then the whole panel wipes upward to reveal the page.
 *
 * Rendered on the server rather than mounted from an effect, so a refresh
 * shows it in the very first paint instead of flashing the page first. Because
 * of that the wipe is a CSS animation, not JS — the overlay has to clear
 * itself even if the bundle never executes. React only drives the number and
 * then unmounts the (already off-screen) panel.
 */
export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      setDone(true);
      return;
    }

    const push = (id: number) => timers.current.push(id);
    document.body.style.overflow = "hidden";

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / COUNT_MS, 1);
      // easeOutExpo so the count sprints then settles
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setProgress(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Fail-safe: the number still lands on 100 if rAF is throttled.
    push(window.setTimeout(() => setProgress(100), COUNT_MS + 150));

    push(
      window.setTimeout(() => {
        setDone(true);
        document.body.style.overflow = "";
        // Re-apply any deep link (e.g. arriving at /#work from the 404 page):
        // the scroll lock swallows the browser's own hash jump on load.
        // Positioned explicitly rather than via scrollIntoView so the offset
        // clears the fixed header.
        const id = window.location.hash.slice(1);
        const target = id ? document.getElementById(id) : null;
        if (target) {
          const top =
            target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
          window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
        }
      }, CURTAIN_MS),
    );

    return () => {
      cancelAnimationFrame(raf);
      timers.current.forEach(clearTimeout);
      timers.current = [];
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div
      aria-hidden
      className="animate-loader-out fixed inset-0 z-[300] flex flex-col items-center justify-center gap-10 bg-ink-surface px-6"
    >
      <Logo
        title={null}
        className="animate-rise w-[min(62vw,20rem)] text-cream"
      />

      <div className="w-[min(62vw,20rem)]">
        {/* Progress rule */}
        <div className="relative h-px w-full bg-cream/25">
          <span
            className="absolute inset-y-0 left-0 bg-accent"
            style={{ width: `${progress}%`, transition: "width 120ms linear" }}
          />
        </div>

        <div className="mt-4 flex items-baseline justify-between gap-4">
          <span className="eyebrow text-cream/55">{SITE.role}</span>
          <span className="font-display text-2xl text-cream tabular-nums">
            {progress}
          </span>
        </div>
      </div>
    </div>
  );
}
