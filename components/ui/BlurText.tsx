"use client";

import { type CSSProperties, useMemo, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGsap } from "@/hooks/useGsap";
import { cn } from "@/lib/utils";

interface BlurTextProps {
  text: string;
  /** Stagger between segments, in seconds. */
  stagger?: number;
  animateBy?: "words" | "letters";
  /** Delay before the first segment starts, in seconds. */
  startDelay?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Letter- or word-wise blur-in, played on mount.
 *
 * The whole string stays in the accessibility tree as one label: the split
 * pieces are `aria-hidden` and a visually hidden copy carries the real text.
 * Without that, a screen reader would announce "M A R K" one character at a
 * time.
 *
 * Animates on mount rather than on scroll because its only use is above the
 * fold, where waiting to intersect would just delay it.
 */
export function BlurText({
  text,
  stagger = 0.055,
  animateBy = "letters",
  startDelay = 0,
  className,
  style,
}: BlurTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  const segments = useMemo(
    () => (animateBy === "words" ? text.split(" ") : Array.from(text)),
    [text, animateBy],
  );

  useGsap(
    () => {
      gsap.from(".blur-text-piece", {
        opacity: 0,
        y: "0.35em",
        filter: "blur(10px)",
        duration: 0.7,
        ease: "power3.out",
        stagger,
        delay: startDelay,
      });
    },
    ref,
    [text, animateBy, stagger, startDelay],
  );

  return (
    <span ref={ref} className={cn("inline-block", className)} style={style}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {segments.map((segment, i) => (
          <span
            key={`${segment}-${i}`}
            className="blur-text-piece inline-block whitespace-pre"
          >
            {animateBy === "words" && i < segments.length - 1
              ? `${segment} `
              : segment}
          </span>
        ))}
      </span>
    </span>
  );
}
