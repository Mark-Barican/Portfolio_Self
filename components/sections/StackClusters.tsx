"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { EASE, SCRUB, scrubbed } from "@/lib/scroll";
import { useGsap } from "@/hooks/useGsap";
import { TECHNOLOGY_GROUPS } from "@/lib/technologies";
import { TECH_MARKS } from "@/lib/techMarks";

/**
 * The toolkit as six labelled clusters.
 *
 * Deliberately a plain, aligned two-column list. The previous version scattered
 * these across a twelve-column grid on staggered top margins, each drifting at
 * its own scroll speed — which turned six readable groups into a ragged pile
 * with no reading order. Alignment is what fixes it: equal columns, a shared
 * baseline per row, one rule per cluster.
 *
 * **One ScrollTrigger, six clusters.** Each cluster used to own its own trigger
 * firing at `top 85%`, which had a flaw the two-column layout guarantees:
 * clusters sitting side by side share a top edge, so they fired *together*.
 * Half the list arrived in three simultaneous pairs rather than in the order it
 * reads. Driving all six from a single scrubbed timeline over the whole grid
 * fixes the ordering — each cluster owns a slice of the section's travel, so
 * they arrive strictly one after another, in reading order, at a rate the
 * reader controls — and costs one trigger instead of six.
 *
 * Within a cluster the heading leads and its marks pop in behind it on a fast
 * stagger, which is what keeps this section's motion distinct from the wipes in
 * the work index and the deal in the timeline.
 */
export function StackClusters() {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(
    () => {
      const clusters = gsap.utils.toArray<HTMLElement>(
        "[data-cluster]",
        ref.current,
      );
      if (!clusters.length) return;

      const tl = gsap.timeline({
        scrollTrigger: scrubbed({
          trigger: ref.current,
          start: "top 78%",
          end: "bottom 72%",
          scrub: SCRUB.base,
          id: "stack-clusters",
        }),
      });

      // Equal slices, so the sequence is even however many groups there are.
      // The tweens inside a slice overlap it slightly, which stops the list
      // reading as six discrete events with gaps between them.
      const slice = 1 / clusters.length;

      clusters.forEach((cluster, i) => {
        const at = i * slice;

        tl.from(
          cluster.querySelector("[data-cluster-head]"),
          {
            opacity: 0,
            x: -24,
            duration: slice * 0.7,
            ease: EASE.in,
          },
          at,
        ).from(
          cluster.querySelectorAll("[data-cluster-item]"),
          {
            opacity: 0,
            y: 14,
            scale: 0.94,
            duration: slice * 0.5,
            ease: "back.out(2)",
            stagger: { each: slice * 0.05, from: "start" },
          },
          at + slice * 0.3,
        );
      });

    },
    ref,
    [],
  );

  return (
    <div
      ref={ref}
      className="mt-10 grid gap-x-14 gap-y-10 lg:mt-12 lg:grid-cols-2"
    >
      {TECHNOLOGY_GROUPS.map((group, i) => (
        <div
          key={group.title}
          data-cluster
          className="border-t border-cream/15 pt-6"
        >
          <div data-cluster-head>
            <div className="flex items-baseline gap-3">
              <span className="eyebrow text-[0.66rem] text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-2xl text-cream sm:text-[1.6rem]">
                {group.title}
              </h3>
            </div>
            <p className="mt-2 text-base text-cream/55">{group.note}</p>
          </div>

          {/* Marks and names on one flowing line. No cards, no boxes: the
              cluster is held together by the rule above it and the space
              around it, which is what keeps six of these from reading as a
              logo cloud. */}
          <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
            {group.items.map((name) => {
              const Mark = TECH_MARKS[name];
              return (
                <li
                  key={name}
                  data-cluster-item
                  data-link="tech"
                  className="flex items-center gap-2.5 text-cream/60 transition-colors duration-300 hover:text-accent"
                >
                  {Mark && <Mark size={20} aria-hidden className="shrink-0" />}
                  <span className="text-[0.95rem] whitespace-nowrap">
                    {name}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
