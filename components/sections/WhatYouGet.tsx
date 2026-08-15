"use client";

import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionScene } from "@/components/ui/SectionScene";
import { TextReveal } from "@/components/ui/cascade-text";
import { CAPABILITIES } from "@/lib/data";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { EASE, SCRUB, scrubbed } from "@/lib/scroll";
import { useGsap } from "@/hooks/useGsap";

/**
 * What You Get — the five capabilities as editorial statements on ink.
 *
 * No icons, no cards, no tag pills: a number, a title at display size, one
 * sentence, and the tools set as a single hairline-separated line. Typography
 * and the space between rows do the work a feature grid would ask boxes to do.
 *
 * The section's motion is a three-part system, and the parts are deliberately
 * given different jobs:
 *
 *  - **Arrival** is the rule. Each row's hairline draws itself across from the
 *    left before anything in that row appears, so the list reads as being ruled
 *    up and then filled in. Scrubbed, so it is the scroll doing the drawing.
 *
 *  - **Prominence** is a class, not a tween. While a row occupies the reading
 *    band its number and tool line come up to full strength and the row lifts
 *    a few pixels; leaving the band settles it back. Driven by `toggleClass`
 *    rather than a scrubbed tween because it only changes twice per row —
 *    running five scrubbed opacity tweens per frame to express a boolean would
 *    be work for nothing, and CSS transitions the change for free.
 *
 * There is no longer a layer of oversized type behind the rows. It used to
 * cross-fade the current capability's title in at 13vw as ground, and what
 * reached the screen was "FULL-STACK" and "AI-ACCELER" cut off mid-word and
 * drawn straight through the rows they were naming — the copy had to be read
 * *through* its own title. The rows are the design; they do not need a
 * restatement of themselves behind them. The section's identity now sits in the
 * gutter marginal instead.
 *
 * The titles keep the cascading character reveal on hover: every character
 * carries a copy of itself one em below, and hovering slides the whole string
 * on a per-character delay so the word rolls over into the accent.
 */
export function WhatYouGet() {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-cap-row]", ref.current);

      rows.forEach((row, i) => {
        gsap
          .timeline({
            scrollTrigger: scrubbed({
              trigger: row,
              start: "top 90%",
              end: "top 62%",
              scrub: SCRUB.base,
            }),
          })
          // The rule is the entrance: it draws across before anything appears.
          .from(row, { "--rule-scale": 0, duration: 0.7, ease: EASE.editorial })
          .from(
            row.querySelectorAll("[data-cap-part]"),
            {
              opacity: 0,
              // Alternating sides, so five rows read as a set page rather than
              // as five identical rises. The system is shared; the direction
              // is what varies.
              x: i % 2 === 0 ? -22 : 22,
              duration: 0.6,
              ease: EASE.in,
              stagger: 0.08,
            },
            "-=0.4",
          );

        // Prominence. Its own trigger because it spans the row's whole time in
        // the reading band, which is a different range from the entrance.
        ScrollTrigger.create({
          trigger: row,
          start: "top 68%",
          end: "bottom 42%",
          invalidateOnRefresh: true,
          toggleClass: { targets: row, className: "cap-row--live" },
        });
      });
    },
    ref,
    [],
  );

  return (
    <section
      id="capabilities"
      data-surface="dark"
      className="relative isolate overflow-x-clip bg-ink-surface py-16 sm:py-20"
    >
      <SectionScene>
      <Container className="layer-content relative">
        <SectionHeading
          inverted
          title={
            <>
              What
              <br />
              You Get
            </>
          }
        >
          Five things every project gets, whatever the size.
        </SectionHeading>

        <div ref={ref} data-cap-list className="mt-10">
          {CAPABILITIES.map((capability) => (
            /* No index column. The rows were a two-column grid purely to hold
               a `01`–`05` gutter; with the numbers gone the grid had one child,
               so it is a plain block and the copy starts at the section's own
               left margin rather than indented past an empty column. */
            <div
              key={capability.title}
              data-cap-row
              className="cap-row relative py-6"
            >
              <div className="min-w-0">
                {/* The title is the hover surface, and `TextReveal` gives it
                    0.4em of horizontal padding so the cascade has room. That
                    padding must be cancelled or the heading sits indented
                    against the copy beneath it.

                    The cancelling margin belongs on the title, not on a
                    wrapper. `em` resolves against the element's *own*
                    font-size, and the wrapper inherits body size while the
                    title is set at `min(6vw, 3.6rem)` — so the same `-0.4em`
                    written on the wrapper pulled 29px where the padding it was
                    meant to cancel is 23px, leaving the heading hanging 6px
                    left of its own description. On the title the two values are
                    computed from one font-size and cancel exactly. */}
                <div data-cap-part>
                  <TextReveal
                    as="h3"
                    text={capability.title}
                    /* Sized so the longest single word, "AI-Accelerated",
                       still fits the row at 320px. The title itself is free
                       to wrap; only a word cannot. */
                    fontSize="min(6vw, 3.6rem)"
                    className="font-display text-cream"
                    style={{ marginLeft: "-0.4em" }}
                    staggerDelay={18}
                    duration={280}
                  />
                </div>
                <p
                  data-cap-part
                  className="mt-3 max-w-xl text-base leading-relaxed text-cream/70 sm:text-lg"
                >
                  {capability.description}
                </p>
                <p
                  data-cap-part
                  className="cap-row__tools mt-4 text-[0.82rem] tracking-wide text-cream/40"
                >
                  {capability.tools.join("  ·  ")}
                </p>
              </div>
            </div>
          ))}
          <div aria-hidden className="border-t border-cream/15" />
        </div>
      </Container>
      </SectionScene>
    </section>
  );
}
