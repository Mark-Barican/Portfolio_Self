import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** Render as a different element (e.g. "section", "header"). Defaults to div. */
  as?: ElementType;
}

/**
 * Centered, max-width content wrapper with consistent responsive padding.
 * Server component — pure layout, no interactivity.
 */
export function Container({
  children,
  className,
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>
      {children}
    </Tag>
  );
}
