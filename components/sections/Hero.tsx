"use client";

import { useRef } from "react";
import { HeroBackground } from "@/components/hero/HeroBackground";
import { HeroContent } from "@/components/hero/HeroContent";
import { HeroPortrait } from "@/components/hero/HeroPortrait";
import { gsap } from "@/lib/gsap";
import { useGsap } from "@/hooks/useGsap";
import { usePointerParallax } from "@/hooks/usePointerParallax";
import { heroExit } from "@/lib/scenes/hero";
import { perViewport, SCRUB, scrubbed } from "@/lib/scroll";

/**
 * Hero: the page's one ink-surface opening, built as a stack of layers rather
 * than a two-column grid.
 *
 * Depth order, back to front:
 *
 *   base         ground, key light, atmosphere, grid        HeroBackground
 *   decoration   oversized surname, drawn frame marks       HeroPortrait
 *   content      the figure, then the statement over it     HeroPortrait / HeroContent
 *   interactive  buttons, and the metadata rail at the foot HeroContent / here
 *
 * Three motion systems, kept strictly apart so none of them fight over an
 * element's transform:
 *
 *   1. A mount timeline that rises the copy in once.
 *   2. A pinned, scrubbed timeline. From `lg` the section holds still against
 *      the viewport for just over one screen of scrolling while its layers pull
 *      apart at their own speeds. Below `lg` the same movement plays without
 *      the pin and at a shorter throw, because pinning a screen that is already
 *      mostly figure just delays the content.
 *   3. Pointer parallax, on the inner `data-depth-*` elements, so it composes
 *      with (2) rather than overwriting it.
 *
 * `isolate` pins every layer to this section's stacking context, so nothing
 * decorative can escape upward over the fixed header. `overflow-clip` (not
 * `hidden`) contains the bleeding figure and the oversized backdrop word
 * without creating a scroll container.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  usePointerParallax(sectionRef);

  useGsap(
    () => {
      // ---- Mount: the copy rises in once, before any scrolling. ----------
      gsap.from("[data-hero-in]", {
        opacity: 0,
        y: 22,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.09,
        delay: 0.1,
      });

      // ---- Scroll: the composition separates. -----------------------------
      //
      // The choreography itself lives in `lib/scenes/hero.ts`. All that is
      // decided here is how far it throws and how long it is held for, which is
      // the only part that differs between a desktop and a phone.
      /**
       * The hero is **not pinned**, at any width, and that is the fix for the
       * gap that used to sit between it and Journey.
       *
       * Pinning seems like the obvious way to hold the composition still while
       * it rearranges, and it is what this section used to do. The problem is
       * what `pinSpacing` costs at the far end. A pin inserts a spacer of the
       * pin's own length, and when the pin releases the section is parked at
       * the *bottom* of that spacer, so the reader still has a full viewport
       * of hero to scroll past before the next section's top reaches the top of
       * the screen. By that point the hand-off wash has run to completion and
       * the hero is uniformly cream, so that viewport is a blank cream screen.
       * Played back it is a dead beat with nothing in it, and no amount of
       * retiming the timeline removes it, because it is the spacer, not the
       * timeline.
       *
       * Running the same choreography across the hero's natural exit instead
       * costs exactly one viewport of scroll, spends all of it on motion, and
       * leaves Journey's top arriving at the top of the screen the moment the
       * hero has left. Document flow does the work the spacer was doing badly.
       */
      const scene = (depth: number, shift: number) =>
        gsap
          .timeline({
            scrollTrigger: scrubbed({
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: SCRUB.base,
              id: "hero",
            }),
          })
          .add(heroExit(depth, shift));

      perViewport({
        /* -45% of the word's own width.
         *
         * Measured, not guessed: "Barican" renders 1265px wide starting at
         * x=691 on a 1440 viewport, so 517px of it (41%) sits past the right
         * edge. 45 clears that and still leaves the leading B on screen. The
         * figure holds from 1024 to 1920 because the type size and the column
         * it sits in are both viewport-relative, so the ratio does not move. */
        desktop: () => scene(1, -45),

        /* Two thirds of the throw, and **no horizontal shift at all**.
         *
         * The crop is a desktop device: there the surname is deliberately
         * larger than its column and slides left so the reader discovers the
         * rest of it. Below `lg` the word already fits the screen, so the same
         * gesture has nothing to reveal: all -10% did was carry the leading
         * "B" off the left edge and leave the word cut at both ends, which is
         * a crop that reads as a layout fault rather than as an intention.
         *
         * At 0 the word stays centred for the whole exit and simply drifts
         * vertically with the rest of the ground. */
        handheld: () => scene(0.62, 0),
      });
    },
    sectionRef,
    [],
  );

  return (
    <section
      ref={sectionRef}
      id="home"
      data-surface="dark"
      className="relative isolate flex min-h-svh flex-col overflow-clip bg-ink-surface pt-28 pb-8 sm:pt-32"
    >
      <HeroBackground />

      {/* Hand-off wash.
       *
       * The exact cream of the section below, painted over the whole hero and
       * brought up only *after* the surname has left: see `heroExit`. It
       * finishes at 0.88 of the pin and then sits still, so the last eighth of
       * the hold is a settled cream screen rather than a colour still arriving.
       *
       * This is the page's only ink→cream mechanism at this boundary, and that
       * is deliberate. Journey used to also carry a `SurfaceEdge from="ink"`,
       * which painted a 160px ink gradient across its own top edge and faded it
       * out as that edge crossed the viewport. Two mechanisms, pointing
       * opposite ways: the hero dissolved to cream, and then the first thing
       * the reader met was ink being reintroduced at the top of the cream
       * section: the dark band that used to slide up out of the fold here.
       * The wash below is sufficient on its own, so the band is gone.
       *
       * Scrubbed with the rest of the timeline, so scrolling back up wipes it
       * away again. Inert and invisible to assistive tech. */}
      <div
        data-hero="handoff"
        /* Declares the cream it paints to the chrome's surface probe. It is
           `pointer-events-none`, so `elementsFromPoint` cannot see it and the
           header would otherwise stay light against a fully cream screen,
           see the note in `lib/surface.ts`. */
        data-surface-layer="cream"
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 bg-background opacity-0"
      />

      <div className="relative mx-auto flex w-full max-w-[90rem] flex-1 flex-col px-5 sm:px-8">
        <div className="relative grid flex-1 items-center gap-y-10 lg:grid-cols-12 lg:gap-y-0">
          <HeroContent />
        </div>

        {/* Sibling of the grid rather than a cell in it. From lg the figure is
            lifted out of the flow against this column, which is the full height
            of the section between its padding: anchored to the grid row
            instead, it had less height to sit in than it was tall, and the top
            of the head was cropped on any viewport under ~900px. */}
        <HeroPortrait />

      </div>
    </section>
  );
}
