"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsDesktop } from "@/hooks/useMediaQuery";

/**
 * The site-wide ambient background: a masked animated grid, soft radial
 * gradients, floating glow orbs and a cursor-reactive glow. Fixed behind all
 * content and fully decorative.
 */
export function AnimatedBackground() {
  const reduced = usePrefersReducedMotion();
  const isDesktop = useIsDesktop();
  const interactive = isDesktop && !reduced;

  // Cursor-following glow (normalised 0–1 → percentage strings).
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.2);
  const glowX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const glowY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const left = useTransform(glowX, (v) => `${v * 100}%`);
  const top = useTransform(glowY, (v) => `${v * 100}%`);

  useEffect(() => {
    if (!interactive) return;
    const onMove = (event: PointerEvent) => {
      mouseX.set(event.clientX / window.innerWidth);
      mouseY.set(event.clientY / window.innerHeight);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [interactive, mouseX, mouseY]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Base wash */}
      <div className="absolute inset-0 bg-background" />

      {/* Soft radial gradients — purple accent up top, blue in the corners */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_-10%,rgba(139,92,246,0.16),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(45%_45%_at_100%_100%,rgba(37,99,235,0.30),transparent_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_0%_60%,rgba(37,99,235,0.20),transparent_60%)]" />

      {/* Masked grid (static) */}
      <div
        className="grid-pattern absolute inset-0"
        style={{
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, black 35%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, black 35%, transparent 80%)",
        }}
      />

      {/* Slow pulsing ambient lights (purple + blue) */}
      <div
        className={`absolute top-1/4 -left-20 h-72 w-72 rounded-full bg-accent/25 blur-[120px] ${
          reduced ? "opacity-40" : "animate-pulse-glow"
        }`}
      />
      <div
        className={`absolute top-1/2 right-0 h-80 w-80 rounded-full bg-teal/35 blur-[140px] ${
          reduced ? "opacity-40" : "animate-pulse-glow-slow"
        }`}
      />
      <div
        className={`absolute bottom-8 left-1/3 h-64 w-64 rounded-full bg-accent/20 blur-[130px] ${
          reduced ? "opacity-30" : "animate-pulse-glow-slower"
        }`}
      />

      {/* Cursor-reactive glow */}
      {interactive && (
        <motion.div
          className="absolute h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.14),transparent_60%)] blur-2xl"
          style={{ left, top }}
        />
      )}

      {/* Bottom fade into the page background */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
