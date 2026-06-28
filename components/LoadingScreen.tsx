"use client";

import { useEffect, useState } from "react";
import CountUp from "@/components/reactbits/CountUp";

const SESSION_KEY = "mb-portfolio-intro-seen";
/** How long the count runs before the curtain lifts. */
const COUNT_DURATION = 1.4;
/** Curtain-up slide duration. */
const EXIT_MS = 700;

/**
 * Brief, once-per-session intro overlay: monogram + a React Bits <CountUp />
 * sweeping 0 → 100, then a clean curtain-up exit. Skipped on repeat visits and
 * reduced-motion so it never blocks the content (or the LCP).
 *
 * Both the dismissal and the unmount are driven by timers (and the curtain by a
 * plain CSS transform transition) — never by an animation-completion callback.
 * So the overlay is guaranteed to clear and can never trap the page, even if the
 * animation runtime stalls.
 */
export function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Read the real values once, synchronously, on mount — avoids the
    // first-paint flip that a reactive reduced-motion hook introduces.
    const seen = window.sessionStorage.getItem(SESSION_KEY);
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (seen || prefersReduced) {
      setLoading(false);
      return;
    }

    document.body.style.overflow = "hidden";

    const startExit = window.setTimeout(
      () => {
        window.sessionStorage.setItem(SESSION_KEY, "1");
        setExiting(true);
        document.body.style.overflow = "";
      },
      COUNT_DURATION * 1000 + 250,
    );

    const unmount = window.setTimeout(
      () => setLoading(false),
      COUNT_DURATION * 1000 + 250 + EXIT_MS,
    );

    return () => {
      window.clearTimeout(startExit);
      window.clearTimeout(unmount);
      document.body.style.overflow = "";
    };
  }, []);

  if (!loading) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-transform ease-[cubic-bezier(0.76,0,0.24,1)]"
      style={{
        transitionDuration: `${EXIT_MS}ms`,
        transform: exiting ? "translateY(-100%)" : "translateY(0)",
      }}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="grid h-20 w-20 animate-float place-items-center rounded-2xl border border-border bg-card text-2xl font-semibold tracking-tight">
          <span className="text-gradient">MB</span>
        </div>
        <div className="font-mono text-sm text-muted">
          <CountUp
            to={100}
            from={0}
            duration={COUNT_DURATION}
            className="tabular-nums"
          />
          <span className="text-accent">%</span>
        </div>
      </div>
    </div>
  );
}
