import Image from "next/image";
import { SITE } from "@/lib/constants";

/**
 * The hero's figure, as a three-layer composition rather than an image in a
 * column: the surname set oversized behind it, a pair of drawn marks framing
 * it, and the portrait itself on top.
 *
 * Each layer is tagged for the scrubbed timeline in `Hero`, which moves them at
 * different speeds so scrolling opens the group up instead of sliding it as one
 * block. `data-depth-*` feeds the pointer parallax on the inner element.
 *
 * Only lifted out of the flow from `lg`, where there is a column beside the
 * statement to lift it into. Below that it stays a normal grid child sitting
 * after the copy, because an absolutely positioned figure on a single-column
 * layout does not overlap the words artfully, it covers them.
 *
 * A server component: the figure has no interactivity of its own, so the only
 * client code involved is the timeline that moves it.
 */
export function HeroPortrait() {
  return (
    <div className="pointer-events-none relative flex flex-col items-center lg:absolute lg:inset-y-0 lg:right-0 lg:w-[52%]">
      {/* ------------------------------------------------------------------ */}
      {/*  Backdrop: the surname, oversized, cropped by the section edge.    */}
      {/* ------------------------------------------------------------------ */}
      <div
        aria-hidden
        data-hero="word"
        className="layer-decoration absolute inset-0 flex items-center justify-center lg:justify-start"
      >
        <div data-depth-x="26" data-depth-y="16">
          {/* Two different jobs at two sizes.

              From `lg` the word is deliberately wider than its column and is
              cropped by the section's `overflow-clip`, which is what stops it
              reading as a label and lets it read as ground.

              Below `lg` it has to *fit*. "Barican" measures about 5.2em in this
              face, so 16vw puts it at roughly 83% of the viewport: centred,
              whole, with a real margin either side at every handheld width
              (312px inside 375, 640px inside 768). 18vw left only 25px of
              clearance at 768, which the exit's drift was enough to eat. */}
          <span className="font-display text-outline-cream block text-[16vw] leading-none whitespace-nowrap opacity-35 lg:text-[15vw] lg:opacity-55">
            Barican
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/*  Drawn marks. Two hairlines and one accent bar, sized off the       */}
      {/*  figure so they read as a frame rather than free-floating trim.     */}
      {/* ------------------------------------------------------------------ */}
      <div
        aria-hidden
        data-hero="marks"
        className="layer-decoration absolute inset-0 hidden lg:block"
      >
        <div
          data-depth-x="-46"
          data-depth-y="-28"
          className="absolute inset-0"
        >
          <span className="absolute top-[22%] left-[6%] h-24 w-px bg-cream/25" />
          <span className="absolute top-[22%] left-[6%] h-px w-24 bg-cream/25" />
          <span className="absolute right-[8%] bottom-[26%] h-16 w-[3px] bg-accent" />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/*  The figure.                                                        */}
      {/* ------------------------------------------------------------------ */}
      <div
        data-hero="figure"
        data-cursor-surface="dark"
        className="layer-content relative flex origin-bottom items-end lg:h-full lg:justify-end"
      >
        <div data-depth-x="-18" data-depth-y="-12">
          {/* Sized by height rather than width: the figure is what decides
              whether the hero clears one screen, so it is pinned to the
              viewport and the 716:1024 ratio sets its width from there. The lg
              height is set against the shortest viewport the layout is expected
              to hold, so the head is never cropped.

              The source is shot on near-black with its own glow, so it needs no
              cut-out, only its straight edges dissolved into the section. The
              mask fades all four, hardest at the foot where the crop is. */}
          <div
            className="relative aspect-[716/1024] h-[52svh] max-h-[26rem] w-auto sm:h-[58svh] sm:max-h-[32rem] lg:h-[72svh] lg:max-h-[42rem]"
            style={{
              maskImage:
                "radial-gradient(ellipse 76% 64% at 50% 42%, black 54%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 76% 64% at 50% 42%, black 54%, transparent 100%)",
            }}
          >
            <Image
              src="/Hero-Portrait.png"
              alt={`${SITE.name}, ${SITE.role}`}
              fill
              priority
              /* Widths follow from the height caps via the 716:1024 ratio:
                 ~70vw on phones, ~350px through the tablet range, ~470px at the
                 largest. Quoting the painted box rather than the column keeps
                 next/image from fetching a source two steps larger than
                 anything ever rendered. */
              sizes="(max-width: 640px) 70vw, (max-width: 1024px) 350px, 470px"
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
