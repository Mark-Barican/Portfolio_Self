"use client";

import React, {
  useMemo,
  useState,
  type ElementType,
  type CSSProperties,
} from "react";

export interface TextRevealProps {
  text: string;
  as?: ElementType;
  href?: string;
  target?: string;
  className?: string;
  style?: CSSProperties;
  fontSize?: string;
  staggerDelay?: number;
  duration?: number;
  easing?: string;
  color?: string;
  hoverColor?: string;
  direction?: "up" | "down";
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * Cascading per-character hover reveal.
 *
 * Each character carries a copy of itself one em above or below, drawn with
 * `text-shadow`. On hover every character slides by exactly that distance, so
 * the copy takes the original's place. Staggering the transition delay across
 * the string is what makes it cascade rather than flip as a block.
 *
 * Three adaptations from the original for this codebase:
 *
 *  - `hoverColor` defaults to the brand accent rather than the demo's green.
 *  - The cursor is only `pointer` when this actually renders a link. As a
 *    heading it stays `default`, so it does not advertise a click that does
 *    nothing.
 *  - **It wraps.** The original masks the entire string in one `inline-flex`,
 *    which cannot break: a heading like "AI-Accelerated Workflow" then runs as
 *    a single unbreakable line and is clipped by its own row on anything under
 *    ~1400px. Here each *word* gets its own mask and the words sit in normal
 *    inline flow, so the line breaks where it should while every character
 *    still slides behind a clip. The stagger index runs across the whole
 *    string, not per word, so the cascade still reads as one sweep.
 *
 * The visible characters are `aria-hidden` and the accessible name comes from
 * `aria-label`, so assistive tech reads the word rather than spelling it out.
 */
const TextReveal = React.memo(function TextReveal({
  text,
  as: Component = "a",
  href,
  target,
  className = "",
  style,
  fontSize = "3rem",
  staggerDelay = 25,
  duration = 250,
  easing = "ease-in-out",
  color = "inherit",
  hoverColor = "#ffff23",
  direction = "up",
  onClick,
}: TextRevealProps) {
  const [hovered, setHovered] = useState(false);
  const isLink = Component === "a";

  /**
   * Split to words, then each word to graphemes.
   *
   * Grapheme segmentation, so an emoji or a combining mark counts as one
   * character instead of being split into halves that animate apart. The
   * word grouping is what allows the heading to wrap; `offset` carries the
   * running character index so the stagger is continuous across the string.
   */
  const words = useMemo(() => {
    const toGraphemes = (value: string) => {
      if (typeof Intl !== "undefined" && Intl.Segmenter) {
        const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
        return Array.from(segmenter.segment(value), (s) => s.segment);
      }
      return [...value];
    };

    let offset = 0;
    return text.split(" ").map((word) => {
      const chars = toGraphemes(word);
      const entry = { chars, offset };
      // +1 for the space that follows, so the gap is felt in the timing.
      offset += chars.length + 1;
      return entry;
    });
  }, [text]);

  const sign = direction === "up" ? 1 : -1;

  const rootProps: Record<string, unknown> = {
    // No `overflow-hidden` here: the masks are per word now, and clipping at
    // the root would cut off every line but the first.
    className:
      `inline-block relative no-underline font-extrabold uppercase tracking-tight select-none ${
        isLink ? "cursor-pointer" : "cursor-default"
      } ${className}`.trim(),
    style: {
      fontSize,
      /* Only ever write a colour when there is one to write.
       *
       * The original always emitted `color`, which meant the default of
       * "inherit" went out as an inline declaration — and an inline
       * `color: inherit` beats any class. A caller styling this with
       * `text-cream` got near-black inherited from <body> instead, which on an
       * ink section is invisible. Omitting it lets the class through; hover
       * still wins because that is a real value. */
      ...(hovered
        ? { color: hoverColor }
        : color !== "inherit"
          ? { color }
          : {}),
      transition: "color 0.35s ease",
      padding: "0.15em 0.4em",
      lineHeight: 1,
      ...style,
    },
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    // Keyboard users get the same reveal, since focus can land here when this
    // renders as a link.
    onFocus: () => setHovered(true),
    onBlur: () => setHovered(false),
    onClick,
    "aria-label": text,
  };

  if (isLink) {
    rootProps.href = href ?? "#";
    if (target) rootProps.target = target;
    if (target === "_blank") rootProps.rel = "noopener noreferrer";
  }

  return (
    <Component {...rootProps}>
      <span aria-hidden="true">
        {words.map((word, w) => (
          <span key={w}>
            {/* One mask per word. `align-bottom` keeps the masked boxes on a
                shared baseline once the heading wraps to two lines. */}
            <span
              className="relative inline-flex overflow-hidden align-bottom"
              style={{ height: "1em" }}
            >
              {word.chars.map((char, i) => (
                <span
                  key={i}
                  className="relative inline-block will-change-transform"
                  style={{
                    textShadow: `0 ${sign}em currentColor`,
                    transition: `transform ${duration}ms ${easing}`,
                    transitionDelay: `${(word.offset + i) * staggerDelay}ms`,
                    transform: hovered
                      ? `translateY(${-sign}em)`
                      : "translateY(0)",
                  }}
                >
                  {char}
                </span>
              ))}
            </span>
            {/* A real space between the masks, so the line can break here. */}
            {w < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </Component>
  );
});

TextReveal.displayName = "TextReveal";
export { TextReveal };
