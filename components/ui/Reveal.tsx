"use client";

import { type ElementType, type ReactNode, useRef } from "react";
import { gsap, SCROLL_IN_OUT } from "@/lib/gsap";
import { useGsap } from "@/hooks/useGsap";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in seconds. */
  delay?: number;
  /** Travel distance in px for the slide-in. */
  distance?: number;
  /** Adds a blur-in for a cinematic feel. */
  blur?: boolean;
  as?: ElementType;
}

/**
 * Scroll-reveal wrapper: eases its children up into place the first time they
 * enter the viewport.
 *
 * The element is fully visible in CSS and GSAP animates *from* a hidden start
 * state, set before the first paint. That ordering is deliberate — content can
 * never be stranded invisible by a script that failed to run, a reduced-motion
 * preference, or a ScrollTrigger that never fired. The worst case is that the
 * animation is skipped and the content is simply there.
 *
 * The reveal is reversible. `SCROLL_IN_OUT` plays it on the way down and plays
 * it back out when the reader scrolls up past it, so the motion always follows
 * the direction of travel rather than firing once and staying put.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 24,
  blur = true,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGsap(
    () => {
      const el = ref.current;
      if (!el) return;

      gsap.from(el, {
        opacity: 0,
        y: distance,
        filter: blur ? "blur(8px)" : "none",
        duration: 0.85,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          // Fire a little before the block is fully on screen, so it is
          // settled by the time it is actually being read.
          start: "top 88%",
          toggleActions: SCROLL_IN_OUT,
        },
      });
    },
    ref,
    [delay, distance, blur],
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
