"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, animate, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const SESSION_KEY = "mb-portfolio-intro-seen";

/**
 * Brief, once-per-session intro overlay: monogram + count to 100, then a clean
 * curtain-up exit. Skipped entirely on repeat visits and reduced-motion so it
 * never gets in the way of the content (or the LCP).
 */
export function LoadingScreen() {
  const reduced = usePrefersReducedMotion();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const seen =
      typeof window !== "undefined" &&
      window.sessionStorage.getItem(SESSION_KEY);

    if (seen || reduced) {
      setLoading(false);
      return;
    }

    document.body.style.overflow = "hidden";
    const controls = animate(0, 100, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setProgress(Math.round(v)),
      onComplete: () => {
        window.sessionStorage.setItem(SESSION_KEY, "1");
        setLoading(false);
      },
    });

    return () => {
      controls.stop();
      document.body.style.overflow = "";
    };
  }, [reduced]);

  useEffect(() => {
    if (!loading) document.body.style.overflow = "";
  }, [loading]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex flex-col items-center gap-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="grid h-20 w-20 place-items-center rounded-2xl border border-border bg-card text-2xl font-semibold tracking-tight"
            >
              <span className="text-gradient">MB</span>
            </motion.div>
            <div className="font-mono text-sm text-muted">
              {progress.toString().padStart(3, "0")}
              <span className="text-accent">%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
