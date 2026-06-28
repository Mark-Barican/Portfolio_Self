"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  /** Animation duration in seconds. */
  duration?: number;
  className?: string;
}

/**
 * Counts up from 0 → `value` the first time it scrolls into view, using native
 * requestAnimationFrame + IntersectionObserver (no JS animation runtime). A
 * fail-safe timeout snaps to the final value if rAF can't run, and
 * reduced-motion renders the final value immediately — so the number is never
 * stuck at 0.
 */
export function AnimatedCounter({
  value,
  suffix = "",
  duration = 1.8,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    let rafId = 0;
    let failSafe = 0;
    let started = false;

    const run = () => {
      if (started) return;
      started = true;

      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / (duration * 1000), 1);
        // easeOutExpo for a snappy finish
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        setDisplay(Math.round(eased * value));
        if (t < 1) rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);

      // Guarantee the final value even if rAF is throttled/paused.
      failSafe = window.setTimeout(
        () => setDisplay(value),
        duration * 1000 + 120,
      );
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          run();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(el);

    // Absolute backstop: if the observer is never delivered (e.g. throttled in
    // a background tab), the number still resolves to its final value rather
    // than sitting at 0.
    const backstop = window.setTimeout(() => setDisplay(value), 3500);

    return () => {
      io.disconnect();
      cancelAnimationFrame(rafId);
      window.clearTimeout(failSafe);
      window.clearTimeout(backstop);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}
