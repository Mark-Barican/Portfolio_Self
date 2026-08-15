import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

interface SectionHeadingProps {
  /** Big display title; pass line breaks with <br /> for stacked lines. */
  title: ReactNode;
  /** Optional supporting paragraph. */
  children?: ReactNode;
  className?: string;
  /** Invert colors for use on ink sections. */
  inverted?: boolean;
  /**
   * Whether the heading brings its own entrance.
   *
   * Defaults to true, which wraps it in the page's standard `Reveal`. Pass
   * `false` when the surrounding section runs a scroll-linked scene that
   * already animates this heading — two systems writing `opacity` and `y` on
   * the same element fight, and the losing one leaves it stranded part-way.
   */
  reveal?: boolean;
}

/**
 * Editorial section opener: a huge expanded-caps title with an optional lede.
 * Sizing comes from `.display-section`, which is viewport-driven so the title
 * never overflows on narrow screens.
 */
export function SectionHeading({
  title,
  children,
  className,
  inverted = false,
  reveal = true,
}: SectionHeadingProps) {
  const content = (
    <>
      <h2
        className={cn(
          "font-display display-section text-balance",
          inverted ? "text-cream" : "text-ink",
        )}
      >
        {title}
      </h2>
      {children && (
        <div
          className={cn(
            "max-w-xl text-lg leading-relaxed text-pretty sm:text-xl",
            inverted ? "text-cream/80" : "text-muted",
          )}
        >
          {children}
        </div>
      )}
    </>
  );

  const layout = cn("flex flex-col gap-5", className);

  if (!reveal) return <div className={layout}>{content}</div>;

  return (
    <Reveal className={layout} distance={32}>
      {content}
    </Reveal>
  );
}
