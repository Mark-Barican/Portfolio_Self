"use client";

import { Fragment, useMemo, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { SCRUB, scrubbed } from "@/lib/scroll";
import { useGsap } from "@/hooks/useGsap";
import { cn } from "@/lib/utils";

interface ScrollTypedTextProps {
  text: string;
  className?: string;
  /** Where in the viewport the typing begins. */
  start?: string;
  /**
   * Where it must be finished.
   *
   * Deliberately well before the section's own end. The requirement is that
   * the sentence is *already complete* by the time the reader is through the
   * block — a reveal still running at the section boundary reads as the page
   * lagging behind the scroll rather than responding to it.
   */
  end?: string;
}

/**
 * Types its text out as the reader scrolls, and untypes it as they scroll back.
 *
 * The progress of the reveal *is* the scroll position — there is no timer
 * anywhere in here, no `setInterval`, no `setTimeout`, and no internal notion
 * of duration at all. The whole thing is one scrubbed tween, so the reader has
 * direct control: stop and it stops mid-word, reverse and it unwrites itself,
 * scrub quickly and it keeps up.
 *
 * **Why characters snap rather than fade.** The tween carries `steps(1)`, which
 * makes each character's own sub-tween jump from hidden to shown at its
 * midpoint instead of easing across it. Without that, a scrubbed stagger leaves
 * a moving band of half-faded glyphs, which reads as a blur wipe rather than as
 * typing. Snapping is what makes it look struck rather than dissolved.
 *
 * **Structure.** Words are `inline-block` and characters live inside them, so a
 * word can never be broken across a line by the split itself; wrapping still
 * happens, but only between words, exactly as it would with plain text.
 *
 * **Accessibility.** The split text is `aria-hidden` and the untouched string
 * is carried alongside it for assistive technology, so a screen reader is
 * handed one clean sentence rather than a few hundred individually announced
 * characters. Under reduced motion the scene never runs, and because the
 * characters rest visible in CSS with GSAP animating *from* hidden, the
 * paragraph is simply there, fully typed.
 *
 * **Cost.** One ScrollTrigger and one tween for the whole paragraph. The
 * per-character elements are static after mount — nothing re-renders, and the
 * only per-frame work is GSAP writing `opacity` on the handful of characters
 * actually crossing their threshold in that frame.
 */
export function ScrollTypedText({
  text,
  className,
  start = "top 78%",
  end = "bottom 72%",
}: ScrollTypedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);

  // Split once. Recomputing this on every render would rebuild every node and
  // strand the tween on elements that are no longer in the document.
  const words = useMemo(() => text.split(" "), [text]);

  useGsap(
    () => {
      const chars = gsap.utils.toArray<HTMLElement>("[data-char]", ref.current);
      if (!chars.length) return;

      gsap.from(chars, {
        opacity: 0,
        // Each character snaps at its own midpoint — see the note above.
        ease: "steps(1)",
        stagger: { each: 1 / chars.length, ease: "none" },
        duration: 0.001,
        scrollTrigger: scrubbed({
          trigger: ref.current,
          start,
          end,
          scrub: SCRUB.tight,
          id: "about-typing",
        }),
      });
    },
    ref,
    [text, start, end],
  );

  return (
    <p ref={ref} className={className}>
      {/* The real sentence, for assistive technology. */}
      <span className="sr-only">{text}</span>

      <span aria-hidden>
        {words.map((word, w) => (
          /* **The space is a sibling of the word, not its last child, and that
             is the whole reason this paragraph renders with spaces at all.**

             It used to sit inside the `inline-block` — the old comment even
             claimed it was outside — and CSS white-space processing drops
             trailing whitespace at the end of a line box. Inside an
             inline-block that is exactly what a trailing space is, so every one
             of them was removed and the paragraph rendered as a single
             unbroken string: "I'mafull-stackdeveloperinQuezonCity…".

             As a text node *between* two inline-blocks it is an ordinary
             inter-element space: it renders, and it is still the only place the
             line is allowed to break. Not typed, because revealing the gaps
             adds nothing visible and doubles the element count. */
          <Fragment key={`${word}-${w}`}>
            <span className={cn("inline-block")}>
              {[...word].map((char, c) => (
                <span key={c} data-char>
                  {char}
                </span>
              ))}
            </span>
            {w < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </p>
  );
}
