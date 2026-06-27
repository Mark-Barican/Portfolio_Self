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

      {/* Soft radial gradients — warm accent up top, cool teal in the corner */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_-10%,rgba(254,127,45,0.14),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(45%_45%_at_100%_100%,rgba(35,61,77,0.35),transparent_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_0%_60%,rgba(35,61,77,0.22),transparent_60%)]" />

      {/* Masked animated grid */}
      <div
        className={`grid-pattern absolute inset-0 ${reduced ? "" : "animate-grid"}`}
        style={{
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, black 35%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, black 35%, transparent 80%)",
        }}
      />

      {/* Floating glow orbs */}
      <div
        className={`absolute top-1/4 -left-20 h-72 w-72 rounded-full bg-accent/15 blur-[120px] ${
          reduced ? "" : "animate-float"
        }`}
      />
      <div
        className={`absolute top-1/2 right-0 h-80 w-80 rounded-full bg-teal/25 blur-[140px] ${
          reduced ? "" : "animate-float-slow"
        }`}
      />

      {/* Cursor-reactive glow */}
      {interactive && (
        <motion.div
          className="absolute h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(254,127,45,0.12),transparent_60%)] blur-2xl"
          style={{ left, top }}
        />
      )}

      {/* Bottom fade into the page background */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
