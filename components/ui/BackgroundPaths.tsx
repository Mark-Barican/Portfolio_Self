"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * A single fan of flowing SVG paths. Adapted from the shadcn "Background Paths"
 * component — re-themed to the site palette (warm accent + deep teal) and used
 * purely as a decorative layer behind the hero. Stroke colour is inherited from
 * the wrapping element's `currentColor`, so callers tint it with `text-*`.
 */
function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 696 316"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      <title>Background Paths</title>
      {paths.map((path) => (
        <motion.path
          key={path.id}
          d={path.d}
          stroke="currentColor"
          strokeWidth={path.width}
          strokeOpacity={0.06 + path.id * 0.02}
          initial={{ pathLength: 0.3, opacity: 0.6 }}
          animate={{
            pathLength: 1,
            opacity: [0.2, 0.45, 0.2],
            pathOffset: [0, 1, 0],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}
    </svg>
  );
}

/**
 * Decorative animated background for the hero section. Two opposing fans of
 * paths — one warm-accent, one teal — drift continuously behind the content.
 * Fully decorative and non-interactive.
 */
export function BackgroundPaths({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      // Soft-fade the whole fan toward the edges so it never reads as a hard
      // rectangular block — the section blends smoothly into the page.
      style={{
        maskImage:
          "radial-gradient(120% 100% at 50% 30%, #000 35%, transparent 85%)",
        WebkitMaskImage:
          "radial-gradient(120% 100% at 50% 30%, #000 35%, transparent 85%)",
      }}
    >
      <div className="absolute inset-0 text-accent">
        <FloatingPaths position={1} />
      </div>
      <div className="absolute inset-0 text-teal-light">
        <FloatingPaths position={-1} />
      </div>
    </div>
  );
}
