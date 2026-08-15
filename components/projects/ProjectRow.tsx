"use client";

import { useRef } from "react";
import Image from "next/image";
import { LuArrowUpRight } from "react-icons/lu";
import { gsap } from "@/lib/gsap";
import { EASE, SCRUB, scrubbed } from "@/lib/scroll";
import { useGsap } from "@/hooks/useGsap";
import type { Project } from "@/types";

interface ProjectRowProps {
  project: Project;
  index: number;
  onOpen: () => void;
  onHover: () => void;
}

/**
 * One line of the work index: number, title, description, category and stack,
 * with the whole row as a single control that opens the case study.
 *
 * Everything that reacts to hover is a `group-hover` transition on a
 * composited property. There is no state in here at all, so hovering a row
 * does not re-render the list around it.
 *
 * The row is a `<button>` rather than a div with a click handler, which is
 * what makes it reachable by keyboard and announced as a control. Its hover
 * treatment is duplicated on `group-focus-visible` so a keyboard visitor sees
 * exactly what a mouse visitor sees.
 */
export function ProjectRow({
  project,
  index,
  onOpen,
  onHover,
}: ProjectRowProps) {
  const ref = useRef<HTMLLIElement>(null);

  /**
   * This section's signature: rows are typeset in behind a clip rather than
   * faded up, so the index reads as being *set* line by line.
   *
   * Scrubbed against each row's own approach rather than fired on entry, which
   * is what ties the list to the scroll instead of to a timer. The range is
   * short and finishes well above centre, so a row is fully set by the time it
   * is in reading position: a scrub that ran to the middle of the viewport
   * would leave the reader looking at a half-drawn row.
   *
   * The variation is in the axis, not in the idea. Every row wipes behind a
   * clip; alternating rows wipe from the left and from the right, and each
   * carries a small counter-shift on the same side, so the index alternates
   * like a set page rather than marching. Consistent system, varied execution.
   *
   * `clipPath` is composited on its own layer and does not invalidate layout,
   * so the wipe costs the same as a transform.
   */
  useGsap(
    () => {
      const fromRight = index % 2 === 1;

      gsap.from(ref.current, {
        clipPath: fromRight ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)",
        x: fromRight ? 28 : -28,
        opacity: 0,
        ease: EASE.in,
        scrollTrigger: scrubbed({
          trigger: ref.current,
          start: "top 92%",
          end: "top 64%",
          scrub: SCRUB.base,
        }),
      });
    },
    ref,
    [index],
  );

  return (
    <li ref={ref}>
      <button
        type="button"
        onClick={onOpen}
        onMouseEnter={onHover}
        data-cursor="view"
        data-link="project"
        aria-haspopup="dialog"
        className="group relative grid w-full grid-cols-[auto_1fr] items-start gap-x-5 gap-y-3 border-t-2 border-ink py-5 text-left sm:grid-cols-[3.5rem_1fr_auto] sm:items-center sm:gap-x-8 sm:px-2"
      >
        {/* Accent wash. A layer rather than a background colour on the row, so
            it can grow from the left edge instead of switching on, and so the
            yellow stays a highlight passing under the type rather than the
            row's new colour. */}
        <span
          aria-hidden
          className="absolute inset-0 origin-left scale-x-0 bg-accent/45 transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
        />

        <span className="eyebrow relative pt-1 text-faint transition-colors duration-300 group-hover:text-ink group-focus-visible:text-ink sm:pt-0">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="relative min-w-0">
          {/* ------------------------------------------------------------ */}
          {/*  Classification.                                              */}
          {/*                                                               */}
          {/*  The project's kind, set in the page's spaced caps above the  */}
          {/*  title. It used to carry a short accent rule and repeat the   */}
          {/*  row's index as `01 / FULL-STACK`; both are gone. The rule was */}
          {/*  a second piece of yellow competing with the hover wash for   */}
          {/*  the same few pixels, and the number was already sitting in    */}
          {/*  the row's own left column, so printing it twice on one line  */}
          {/*  said nothing the eye had not just read.                       */}
          {/* ------------------------------------------------------------ */}
          <span className="mb-2.5 block">
            <span className="eyebrow text-[0.6rem] text-faint transition-colors duration-300 group-hover:text-ink/75 group-focus-visible:text-ink/75">
              {project.category}
            </span>
          </span>

          {/* Title shifts a few px into the row on hover. Transform only. */}
          <span className="font-display block text-[min(7vw,4rem)] text-ink transition-transform duration-500 ease-out group-hover:translate-x-2 group-focus-visible:translate-x-2">
            {project.title}
          </span>

          <span className="mt-1.5 block max-w-xl text-base leading-relaxed text-muted transition-colors duration-300 group-hover:text-ink/80 group-focus-visible:text-ink/80 sm:text-lg">
            {project.description}
          </span>

          {/* Stack, as one hairline-separated line rather than a row of tags.
              The category no longer appears here: it has moved up into the
              classification above the title, so this line is purely the
              technical detail. Held back at rest and brought up on hover,
              which is the row "gaining depth" without moving anything. */}
          <span className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-faint transition-colors duration-300 group-hover:text-ink/70 group-focus-visible:text-ink/70">
            <span className="text-[0.8rem] tracking-wide">
              {project.tech.join(" · ")}
            </span>
          </span>

          {/* Touch devices never get the cursor-following preview, so the
              cover is shown inline here instead. Hidden from `sm` up, where
              the pointer preview takes over. */}
          {project.cover && (
            <span className="relative mt-4 block aspect-[16/9] w-full overflow-hidden rounded-xl border-2 border-ink sm:hidden">
              <Image
                src={project.cover}
                alt=""
                fill
                loading="lazy"
                sizes="(max-width: 640px) 92vw, 0px"
                className="object-cover object-top"
              />
            </span>
          )}
        </span>

        <span className="relative hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-ink text-ink transition-all duration-300 group-hover:rotate-45 group-hover:bg-ink group-hover:text-cream group-focus-visible:rotate-45 group-focus-visible:bg-ink group-focus-visible:text-cream sm:flex">
          <LuArrowUpRight size={20} aria-hidden />
        </span>
      </button>
    </li>
  );
}
