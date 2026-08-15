"use client";

import { type ElementType, useMemo, useRef } from "react";
import { gsap, SCROLL_IN_OUT } from "@/lib/gsap";
import { useGsap } from "@/hooks/useGsap";
import { cn } from "@/lib/utils";

interface MaskedLinesProps {
  text: string;
  as?: ElementType;
  className?: string;
  /** Seconds between successive lines. */
  stagger?: number;
  /** Scroll position that starts the reveal, in ScrollTrigger syntax. */
  start?: string;
}

/**
 * Reveals a paragraph line by line, each line wiping up from behind its own
 * mask as it scrolls into view.
 *
 * The technique is adapted from the 21st.dev masked text reveal: split to
 * words, let the browser wrap them naturally, then group the words into lines
 * by comparing their `offsetTop`, and give each resulting line an
 * `overflow: hidden` mask to slide out from. Grouping after layout is what
 * makes it survive re-wrapping: the lines are whatever the browser actually
 * produced at this width, not a guess baked in at author time.
 *
 * Two things differ from the original. It runs on GSAP rather than a second
 * animation runtime, and it does its measuring on the real rendered words
 * instead of a hidden duplicate of the paragraph, so there is one copy of the
 * text in the DOM rather than two.
 *
 * The words are `aria-hidden` and the full string is exposed through
 * `aria-label`, so a screen reader gets the sentence and not a word list.
 */
export function MaskedLines({
  text,
  as: Tag = "p",
  className,
  stagger = 0.08,
  start = "top 85%",
}: MaskedLinesProps) {
  const ref = useRef<HTMLElement>(null);
  const words = useMemo(() => text.split(" ").filter(Boolean), [text]);

  useGsap(
    () => {
      const root = ref.current;
      if (!root) return;

      const build = () => {
        // Clear any masks from a previous pass before re-measuring.
        root.querySelectorAll("[data-line]").forEach((line) => {
          const parent = line.parentNode;
          if (!parent) return;
          while (line.firstChild) parent.insertBefore(line.firstChild, line);
          line.remove();
        });

        const wordEls = gsap.utils.toArray<HTMLElement>("[data-word]", root);
        if (wordEls.length === 0) return;

        // Group by vertical position: a word that sits lower than the previous
        // one has wrapped, and therefore starts a new line.
        const lines: HTMLElement[][] = [];
        let current: HTMLElement[] = [];
        let lastTop = -Infinity;

        for (const word of wordEls) {
          const top = word.offsetTop;
          if (lastTop !== -Infinity && top > lastTop + 1) {
            lines.push(current);
            current = [];
          }
          current.push(word);
          lastTop = top;
        }
        if (current.length) lines.push(current);

        // Wrap each line in its own mask, in place.
        const masks = lines.map((line) => {
          const mask = document.createElement("span");
          mask.dataset.line = "";
          mask.style.display = "block";
          mask.style.overflow = "hidden";
          line[0]?.parentNode?.insertBefore(mask, line[0]);
          line.forEach((word) => mask.appendChild(word));
          return mask;
        });

        gsap.from(
          masks.map((mask) => mask.children),
          {
            yPercent: 115,
            duration: 0.9,
            ease: "power3.out",
            stagger,
            scrollTrigger: { trigger: root, start, toggleActions: SCROLL_IN_OUT },
          },
        );
      };

      // Wait for the webfont: line breaks measured against the fallback face
      // would group the wrong words together.
      if (document.fonts?.status === "loaded") build();
      else document.fonts?.ready.then(build).catch(build);
    },
    ref,
    [text, stagger, start],
  );

  return (
    <Tag ref={ref} className={cn("block", className)} aria-label={text}>
      <span aria-hidden>
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            data-word
            className="inline-block will-change-transform"
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    </Tag>
  );
}
