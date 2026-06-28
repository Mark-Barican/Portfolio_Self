"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

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
      return `translate3d(0, ${distance}px, 0)`;
    case "down":
      return `translate3d(0, -${distance}px, 0)`;
    case "left":
      return `translate3d(${distance}px, 0, 0)`;
    case "right":
      return `translate3d(-${distance}px, 0, 0)`;
    default:
      return "translate3d(0, 0, 0)";
  }
};

const EASE = "cubic-bezier(0.21, 0.47, 0.32, 0.98)";

/**
 * Scroll-reveal wrapper: slides and (optionally) un-blurs its children into
 * view as they enter the viewport, driven by IntersectionObserver + CSS.
 *
 * Deliberately does NOT use a JS animation runtime: opacity is applied
 * *instantly* (never transitioned), so content can never be trapped invisible
 * by a stalled animation — only the slide/blur transition. A fail-safe timeout
 * reveals the content even if the observer never fires, and reduced-motion
 * renders everything statically.
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
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  const [reduced, setReduced] = useState(false);
  const Tag = as as "div";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            if (once) io.disconnect();
          } else if (!once) {
            setShown(false);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
    );
    io.observe(el);

    // Fail-safe: if the observer never reports (odd layouts, zero-height
    // ancestors, etc.), reveal anyway so content is never stuck hidden.
    const failSafe = window.setTimeout(() => setShown(true), 1400);

    return () => {
      io.disconnect();
      window.clearTimeout(failSafe);
    };
  }, [once]);

  const style: CSSProperties = {
    opacity: shown ? 1 : 0,
    transform: shown ? "translate3d(0, 0, 0)" : offset(direction, distance),
    filter: shown || !blur ? "blur(0px)" : "blur(8px)",
    // Note: opacity is intentionally absent from the transition list.
    transition: reduced
      ? "none"
      : `transform 0.7s ${EASE} ${delay}s, filter 0.7s ${EASE} ${delay}s`,
    willChange: "transform, filter",
  };

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      style={style}
    >
      {children}
    </Tag>
  );
}
