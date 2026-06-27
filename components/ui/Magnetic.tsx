"use client";

import { type ReactNode, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsDesktop } from "@/hooks/useMediaQuery";

interface MagneticProps {
  children: ReactNode;
  className?: string;
  /** How strongly the element is pulled toward the cursor (0–1). */
  strength?: number;
}

/**
 * Wraps an element so it gently drifts toward the cursor while hovered, then
 * springs back on leave. No-op on touch devices and when reduced-motion is set.
 */
export function Magnetic({
  children,
  className,
  strength = 0.4,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const isDesktop = useIsDesktop();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 15, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 180, damping: 15, mass: 0.3 });

  const enabled = isDesktop && !reduced;

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = event.clientX - (rect.left + rect.width / 2);
    const relY = event.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={enabled ? { x: springX, y: springY } : undefined}
    >
      {children}
    </motion.div>
  );
}
