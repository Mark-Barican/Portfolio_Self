import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  /** Subtle accent tint vs. neutral glass. */
  variant?: "neutral" | "accent";
}

/**
 * Small pill used for tech tags, section eyebrows and status chips.
 * Server component.
 */
export function Badge({
  children,
  className,
  variant = "neutral",
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium tracking-wide",
        variant === "neutral" && "border-border bg-white/[0.03] text-muted",
        variant === "accent" &&
          "border-accent/30 bg-accent/10 text-accent-hover",
        className,
      )}
    >
      {children}
    </span>
  );
}
