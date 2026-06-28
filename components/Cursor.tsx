"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsDesktop } from "@/hooks/useMediaQuery";

/**
 * Tasteful custom cursor: an accent ring that springs after the pointer, plus a
 * precise dot. The native cursor is kept for accessibility. Renders nothing on
 * touch devices or when reduced-motion is preferred.
 */
export function Cursor() {
  const reduced = usePrefersReducedMotion();
  const isDesktop = useIsDesktop();
  const enabled = isDesktop && !reduced;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 28, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 350, damping: 28, mass: 0.4 });

  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    // Hide the native (white) cursor while the custom ring is active.
    document.documentElement.classList.add("cursor-none");

    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
      const interactive = (event.target as HTMLElement)?.closest(
        "a, button, [data-cursor='hover'], input, textarea",
      );
      setHovering(Boolean(interactive));
    };
    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("cursor-none");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] hidden lg:block"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <motion.div
        className="absolute rounded-full border-2 border-accent"
        style={{ left: ringX, top: ringY, x: "-50%", y: "-50%" }}
        animate={{
          width: hovering ? 56 : 32,
          height: hovering ? 56 : 32,
          opacity: hovering ? 1 : 0.85,
        }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
      />
      <motion.div
        className="absolute h-1.5 w-1.5 rounded-full bg-accent"
        style={{ left: x, top: y, x: "-50%", y: "-50%" }}
      />
    </div>
  );
}
