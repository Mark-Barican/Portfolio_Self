"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { ImageTrail } from "@/components/ui/ImageTrail";
import { KeepHyphens } from "@/components/ui/KeepHyphens";
import { ScreenshotViewer } from "@/components/ui/ScreenshotViewer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionScene } from "@/components/ui/SectionScene";
import { CURRENT_YEAR, JOURNEY } from "@/lib/data";
import type { JourneyItem } from "@/types";
import { gsap } from "@/lib/gsap";
import { EASE, perViewport, SCRUB, scrubbed } from "@/lib/scroll";
import { useGsap } from "@/hooks/useGsap";
import { useDragScroll } from "@/hooks/useDragScroll";
import { createFrameScheduler } from "@/lib/utils";
import { cn } from "@/lib/utils";

/** "5 years ago" / "now" caption under the @handle. */
function timeAgo(fullYear: string): string {
  const diff = CURRENT_YEAR - Number(fullYear);
  if (diff <= 0) return "now";
  return diff === 1 ? "1 year ago" : `${diff} years ago`;
}

/**
 * Fewest frames a card's image trail is dealt from. Each frame is one DOM node
 * that gets reused as the trail cycles, so two screenshots on their own could
 * never put more than two on screen at once. Sized to the slowed trail: each
 * frame is on screen for about 1.6s, and too few would be pulled back to the
 * cursor before they had finished fading.
 */
const TRAIL_FRAMES = 10;

/**
 * The hover treatment for a card that does something when pressed: it
 * straightens off its tilt and lifts onto a hard shadow, so it reads as
 * something to press rather than to read. Mirrored on keyboard focus of the
 * card's action. The tilt lives on the article and the deal-in drives the
 * wrapper, so the two never fight over the same transform.
 */
const ACTION_CARD =
  "group isolate transition-[rotate,translate,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:rotate-0 hover:shadow-[6px_6px_0_var(--color-ink)] has-[>:focus-visible]:-translate-y-1 has-[>:focus-visible]:rotate-0 has-[>:focus-visible]:shadow-[6px_6px_0_var(--color-ink)]";

/** The card's action, stretched invisibly over the whole of it. */
const ACTION_SURFACE = "absolute inset-0 z-10 rounded-2xl";

/**
 * One chapter.
 *
 * Sized as a large timeline object rather than a card in a row: at ~28rem wide
 * and ~38rem tall on a desktop it is close to twice the surface area it used to
 * carry, which is what lets the year read at display size, the story sit at a
 * comfortable measure without a scrollbar, and the whole thing be a
 * grab-and-throw target rather than something to be aimed at.
 */
function JourneyCard({ item, index }: { item: JourneyItem; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const [viewing, setViewing] = useState(false);
  // Stable, so the viewer's key handling is not rebound on every render.
  const closeViewer = useCallback(() => setViewing(false), []);

  // Memoised so expanding the card does not tear the trail down and rebuild it.
  const trail = useMemo(() => {
    const sources = item.trail?.map((shot) => shot.src);
    if (!sources?.length) return null;
    const rounds = Math.ceil(TRAIL_FRAMES / sources.length);
    return Array.from({ length: rounds }, () => sources).flat();
  }, [item.trail]);

  // The copy has already been swapped by React when this runs, so it animates
  // the incoming text in. Skipped on first mount: there is nothing to exchange
  // yet, and fading the teaser in here would fight the card's own reveal.
  const mounted = useRef(false);
  useEffect(() => {
    gsap.to(iconRef.current, {
      rotate: expanded ? 45 : 0,
      duration: 0.35,
      ease: "power3.out",
    });
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    gsap.fromTo(
      copyRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
    );
  }, [expanded]);

  return (
    <div data-journey-card className="shrink-0">
      <article
        ref={cardRef}
        className={cn(
          "relative flex h-[30rem] w-[min(84vw,22rem)] flex-col rounded-2xl border-2 border-ink bg-card p-7 select-none sm:h-[34rem] sm:w-[25rem] sm:p-8 lg:h-[38rem] lg:w-[28rem]",
          index % 2 === 1 ? "rotate-1" : "-rotate-1",
          (item.href || trail) && ACTION_CARD,
        )}
      >
        {/* The whole card is the action, without a written link or button:
            the custom cursor names it on hover ("Visit" or "View"). Stretched
            over the card rather than wrapping it, since the expand button
            inside cannot be nested in another control; the button and the
            expanded story are lifted above it. The click that ends a drag is
            already swallowed by `useDragScroll`, so throwing the track and
            letting go over a card never fires it. */}
        {(item.href || trail) && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 origin-bottom scale-y-0 rounded-[14px] bg-accent/45 transition-transform duration-500 ease-out group-hover:scale-y-100 group-has-[>:focus-visible]:scale-y-100"
          />
        )}
        {item.href ? (
          // Not draggable, or the browser's own link drag would take the
          // pointer away from the track's drag-scroll.
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            draggable={false}
            data-cursor="visit"
            aria-label={`Visit ${new URL(item.href).hostname} (opens in a new tab)`}
            className={ACTION_SURFACE}
          />
        ) : trail ? (
          <button
            type="button"
            onClick={() => setViewing(true)}
            aria-haspopup="dialog"
            aria-label="View screenshots"
            data-cursor="view"
            className={ACTION_SURFACE}
          />
        ) : null}

        <div className="flex items-start justify-between gap-4">
          <span className="font-display text-7xl leading-none text-ink lg:text-8xl">
            {item.year}
          </span>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label={expanded ? "Show less" : "Read more"}
            data-cursor="hover"
            className={cn(
              "relative z-20 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-ink transition-colors",
              expanded ? "bg-ink text-cream" : "bg-accent text-ink",
            )}
          >
            {/* Wrapped rather than given the ref directly: react-icons render
                plain function components and do not forward one. */}
            <span ref={iconRef} className="flex">
              <LuPlus size={21} />
            </span>
          </button>
        </div>

        <h3 className="font-display mt-5 text-[1.75rem] text-ink sm:text-[2rem] lg:text-[2.25rem]">
          <KeepHyphens text={item.title} />
        </h3>

        {/* Short teaser to full story. Cross-faded on the same element rather
            than swapped between two: the card is a fixed height, so there is
            nothing to animate open, only the copy inside to exchange. */}
        <div
          className={cn(
            "relative mt-4 grow overflow-hidden",
            // Over the card link while expanded, so the story still scrolls.
            expanded && "z-20",
          )}
        >
          <p
            ref={copyRef}
            className={cn(
              "leading-relaxed text-pretty",
              expanded
                ? "h-full overflow-y-auto pr-1 text-base text-ink/85 sm:text-lg"
                : "text-lg text-muted sm:text-xl",
            )}
          >
            {expanded ? item.story : item.short}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between border-t-2 border-ink/10 pt-5">
          <span className="eyebrow text-ink">{item.handle}</span>
          <span className="eyebrow text-faint">{timeAgo(item.fullYear)}</span>
        </div>
      </article>

      {item.trail && trail && (
        <>
          <ImageTrail
            targetRef={cardRef}
            items={trail}
            // The screenshots are 2:1 pages; a square frame would crop most of
            // each one away.
            size={280}
            aspectRatio={2}
            radius={12}
            // Half speed and a longer stride than the original, so each shot
            // stays long enough to register as a page and not a flicker.
            pace={2}
            threshold={100}
            appearScale={0}
            zoom={2.4}
            flash={0.6}
          />
          <ScreenshotViewer
            shots={item.trail}
            open={viewing}
            onClose={closeViewer}
          />
        </>
      )}
    </div>
  );
}

/**
 * "My Journey": the story timeline as a horizontal track of tilted cards.
 *
 * Three separate motion systems, kept apart so none of them owns the same
 * property twice:
 *
 *  1. The section's arrival, scrubbed by page scroll. The heading is drawn back
 *     behind its own mask, then the cards are dealt in one after another. It is
 *     scroll-linked rather than fired on entry, so the timeline literally
 *     builds itself as the reader travels through the section and unbuilds
 *     itself on the way back up.
 *  2. The drag, which owns `scrollLeft` (see `useDragScroll`).
 *  3. The progress rail, which only ever *reads* `scrollLeft`.
 *
 * The track is a real scroll container, not a transform-driven carousel. It
 * used to be the latter inside an `overflow-hidden` box, which had two faults:
 *
 *  1. `overflow-hidden` still creates a *programmatically* scrollable box. The
 *     moment anything inside it took focus: a Tab, or a click on a card's
 *     expand button: the browser scrolled it to bring that element into view,
 *     jumping straight to the end of the timeline and leaving '21 off-screen.
 *     Worse, that scrollLeft was invisible to the transform, so the two then
 *     disagreed about where the track was.
 *  2. Drag is a mouse gesture. Nothing in the track was reachable by keyboard.
 *
 * Native scrolling fixes both: focus brings a card into view *correctly*, the
 * keyboard can walk the timeline, touch gets real momentum, and there is only
 * one source of truth for the position. Page scrollbars are hidden globally, so
 * it looks the same. `useDragScroll` puts click-and-drag, with inertia, back
 * for mouse users.
 *
 * The section paints its own `bg-background` rather than letting the body show
 * through, and carries no `SurfaceEdge`: the hero above hands off to cream from
 * its own side. See the hand-off note in `Hero` for why having both was what
 * put a dark band across this boundary.
 */
export function Journey() {
  const viewportRef = useDragScroll<HTMLDivElement>();
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);

  /* ---------------------------------------------------------------------- */
  /*  Progress rail: reads the track, never drives it.                      */
  /* ---------------------------------------------------------------------- */
  useEffect(() => {
    const track = viewportRef.current;
    const rail = railRef.current;
    if (!track || !rail) return;

    const update = () => {
      const limit = track.scrollWidth - track.clientWidth;
      // A track that does not overflow has no progress to report; leaving the
      // rail full rather than dividing by zero is the honest state.
      const progress = limit > 0 ? track.scrollLeft / limit : 1;
      // `scaleX` on a full-width rule: composited, and never a layout write on
      // a scroll handler.
      rail.style.transform = `scaleX(${0.08 + progress * 0.92})`;
    };

    const { schedule, cancel } = createFrameScheduler(update);

    update();
    track.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      track.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancel();
    };
  }, [viewportRef]);

  /* ---------------------------------------------------------------------- */
  /*  Arrival: scrubbed against the section's own progress.                 */
  /* ---------------------------------------------------------------------- */
  useGsap(
    () => {
      /**
       * **The heading is not animated, on purpose.**
       *
       * It used to be wiped up from behind a clip as the section arrived, and
       * that was wrong for this particular heading. This is the section the
       * hero hands off to: the reader has just watched the surface turn cream,
       * and what should be waiting on the other side of that is the next
       * section, already there. Animating the title in made it a separate
       * object that climbed up out of the bottom of an empty cream screen a
       * beat later: the page appearing to build itself rather than the reader
       * arriving somewhere.
       *
       * So "My Journey" is simply in the document, at rest, at the top of its
       * section. The only thing this scene animates is the timeline *content*,
       * which is a reveal of something the reader is travelling toward rather
       * than of the section they are already in.
       */
      /**
       * The deal-in travel is set per viewport, and that is a fix rather than a
       * refinement.
       *
       * The cards arrive from the right, and 110px of travel is a fraction of a
       * desktop screen. On a 412px phone the card is already 354px wide and
       * sits 16px from the left edge, leaving a 42px gutter, so the same 110px
       * throw starts each card 68px *past* the right edge of the screen. It is
       * a transform, so it never widens the document or creates a scrollbar,
       * but for the whole of the reveal the reader watches the card slide in
       * from off-screen and clip against the viewport edge, which is what reads
       * as the timeline overflowing on a phone.
       *
       * 28px on handheld is a little more than the resting gutter: the card
       * still arrives from the right and still reads as being dealt, and it
       * never leaves the screen to do it.
       */
      const arrival = (travel: number, tilt: number) =>
        gsap
          .timeline({
            scrollTrigger: scrubbed({
              trigger: "[data-journey-track]",
              start: "top 85%",
              end: "top 35%",
              scrub: SCRUB.base,
              id: "journey",
            }),
          })
          // The cards are *dealt*: each arrives from the right, rotating down
          // onto the resting tilt its own class already describes. GSAP drives
          // the wrapper, the tilt lives on the article inside it, so the two
          // transforms compose and no card can land on the wrong angle.
          //
          // Horizontal, not vertical: the track is a horizontal object, so
          // cards arriving from the right read as the timeline extending rather
          // than as another block rising into place.
          .from("[data-journey-card]", {
            opacity: 0,
            x: travel,
            rotate: tilt,
            transformOrigin: "bottom center",
            duration: 0.5,
            ease: EASE.in,
            stagger: 0.12,
          })
          .from(
            "[data-journey-rail]",
            { opacity: 0, duration: 0.3, ease: EASE.in },
            0.4,
          );

      perViewport({
        desktop: () => arrival(110, 7),
        // Shorter throw and a shallower angle: a 7° rotation on a card that
        // nearly fills the screen swings its top corner off the edge on its
        // own, independently of the travel.
        handheld: () => arrival(28, 3),
      });
    },
    sectionRef,
    [],
  );

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="relative isolate overflow-x-clip bg-background py-16 sm:py-20"
    >
      <SectionScene>
      <div className="mx-auto w-full max-w-[90rem] px-5 sm:px-8">
        {/* `reveal={false}`: at rest, in flow, no entrance. See the scene. */}
        <SectionHeading
          reveal={false}
          title={
            <>
              My
              <br />
              Journey
            </>
          }
        />
      </div>

      {/* Full-bleed scrolling track, so cards run off the right edge. */}
      <div
        ref={viewportRef}
        data-journey-track
        data-cursor="drag"
        role="group"
        aria-label="Career timeline, scroll horizontally"
        className="mt-10 overflow-x-auto overscroll-x-contain"
      >
        <div className="flex w-max cursor-grab items-stretch gap-6 px-5 py-4 active:cursor-grabbing sm:gap-8 sm:px-8">
          {JOURNEY.map((item, i) => (
            <JourneyCard key={item.fullYear} item={item} index={i} />
          ))}

          <div className="flex w-[min(50vw,16rem)] shrink-0 items-center justify-center">
            <a
              href="#contact"
              data-cursor="hover"
              className="font-display flex h-40 w-40 rotate-3 items-center justify-center rounded-full border-2 border-ink bg-accent text-center text-lg text-ink transition-transform hover:scale-105"
            >
              Be part
              <br />
              of it →
            </a>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------- */}
      {/*  Position rail.                                                 */}
      {/*                                                                 */}
      {/*  The one piece of chrome that makes the drag legible: without   */}
      {/*  it a horizontally scrolling track on a hidden scrollbar gives  */}
      {/*  no indication that there is anything past the right edge, or   */}
      {/*  how far through it you are. Decorative: the track itself      */}
      {/*  already carries the accessible name and is keyboard-scrollable */}
      {/* , so it is hidden from assistive tech.                         */}
      {/* -------------------------------------------------------------- */}
      <div
        data-journey-rail
        aria-hidden
        className="mx-auto mt-10 w-full max-w-[90rem] px-5 sm:px-8"
      >
        <div className="flex items-center gap-5">
          <span className="eyebrow shrink-0 text-[0.66rem] text-faint">
            Drag
          </span>
          <span className="relative h-px grow bg-ink/15">
            <span
              ref={railRef}
              className="absolute inset-0 origin-left bg-ink"
              style={{ transform: "scaleX(0.08)" }}
            />
          </span>
          <span className="eyebrow shrink-0 text-[0.66rem] text-faint">
            {JOURNEY.length} chapters
          </span>
        </div>
      </div>
      </SectionScene>
    </section>
  );
}
