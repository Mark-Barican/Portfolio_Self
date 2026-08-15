"use client";

import { type ReactNode, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { perViewport, SCRUB, scrubbed } from "@/lib/scroll";
import { useGsap } from "@/hooks/useGsap";

/**
 * Pins the stack stage and flies its cards in while it is held.
 *
 * A thin client wrapper on purpose: it drives the animation through selectors,
 * so the ~11 cards it moves stay server-rendered inside `children` and none of
 * their brand marks reach the client bundle.
 *
 * The three planes arrive at different rates and from different distances,
 * which is what reads as depth. The tween targets each card's positioning
 * wrapper, while the designed tilt sits on the card inside it, so GSAP never
 * takes ownership of the resting angle: the two transforms compose and a card
 * always lands on exactly the angle the layout asked for.
 *
 * Desktop only. The stage is `hidden` below `lg`, and pinning a section on a
 * phone to play an animation the visitor cannot see would just add dead scroll.
 */
export function StackChoreography({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(
    () => {
      /* Built through `perViewport` / `scrubbed` like every other scene.
       *
       * This was the one place still writing a raw `gsap.matchMedia()` with
       * the breakpoint typed inline and its own ScrollTrigger literal, which
       * meant the page's only pin was also the only scene not reading its
       * numbers from `lib/scroll.ts`. `scrubbed` supplies the same
       * `anticipatePin` and `invalidateOnRefresh` this had spelled out, and
       * `MEDIA.desktop` is the same query, so the behaviour is unchanged —
       * it is now re-pacing from the same file as everything else, and the
       * trigger has an id so it can be found in a ScrollTrigger dump. */
      perViewport({
        desktop: () => {
          const tl = gsap.timeline({
            scrollTrigger: scrubbed({
              trigger: ref.current,
              // Settle the stage near the middle of the viewport before
              // holding it, so the heading above has already been read.
              start: "center center",
              end: "+=90%",
              scrub: SCRUB.base,
              pin: true,
              id: "stack-stage",
            }),
          });

          tl.from(
            "[data-plane='far'] [data-card]",
            {
              y: 130,
              rotation: "-=14",
              scale: 0.82,
              autoAlpha: 0,
              stagger: 0.05,
              ease: "power2.out",
            },
            0,
          )
            .from(
              "[data-plane='mid'] [data-card]",
              {
                y: 190,
                rotation: "+=11",
                scale: 0.86,
                autoAlpha: 0,
                stagger: 0.06,
                ease: "power2.out",
              },
              0.06,
            )
            .from(
              "[data-plane='near'] [data-card]",
              {
                y: 260,
                rotation: "-=9",
                scale: 0.9,
                autoAlpha: 0,
                stagger: 0.07,
                ease: "power2.out",
              },
              0.12,
            );
        },
      });
    },
    ref,
    [],
  );

  return <div ref={ref}>{children}</div>;
}
