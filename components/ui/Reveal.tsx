"use client";

import { type ReactNode, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Direction = "up" | "down" | "left" | "right" | "none";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in seconds. */
  delay?: number;
  /** Travel distance in px for the slide-in. */
  distance?: number;
  direction?: Direction;
  /** Adds a blur-in for a cinematic feel. */
  blur?: boolean;
  /** Re-run the animation every time it enters the viewport. */
  once?: boolean;
  as?: "div" | "li" | "span" | "section";
}

const offset = (direction: Direction, distance: number) => {
  switch (direction) {
    case "up":
      return { x: 0, y: distance };
    case "down":
      return { x: 0, y: -distance };
    case "left":
      return { x: distance, y: 0 };
    case "right":
      return { x: -distance, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
};

/**
 * Scroll-reveal wrapper: fades, slides and optionally blurs its children into
 * view. Honours reduced-motion by rendering children statically.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 24,
  direction = "up",
  blur = true,
  once = true,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-12% 0px -12% 0px" });
  const reduced = usePrefersReducedMotion();
  // The runtime element follows `as`; we coerce the type to one concrete motion
  // component so the shared props/ref stay simply typed.
  const MotionTag = motion[as] as typeof motion.div;

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const { x, y } = offset(direction, distance);

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial={{ opacity: 0, x, y, filter: blur ? "blur(10px)" : "blur(0px)" }}
      animate={
        inView
          ? { opacity: 1, x: 0, y: 0, filter: "blur(0px)" }
          : { opacity: 0, x, y, filter: blur ? "blur(10px)" : "blur(0px)" }
      }
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </MotionTag>
  );
}
