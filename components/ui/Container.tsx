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
 * Server component: pure layout, no interactivity.
 */
export function Container({
  children,
  className,
  as: Tag = "div",
}: ContainerProps) {
  // `ElementType` is a union wide enough to include void elements like <br>,
  // so TS can resolve `children` to `never`. Rendering through a div-typed
  // alias keeps the runtime element while giving JSX a concrete prop shape.
  const Component = Tag as "div";

  return (
    <Component
      className={cn(
        "mx-auto w-full max-w-6xl px-5 sm:px-8 lg:max-w-[85rem]",
        className,
      )}
    >
      {children}
    </Component>
  );
}
