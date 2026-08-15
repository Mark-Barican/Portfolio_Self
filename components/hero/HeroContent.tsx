import { LuArrowDown, LuArrowRight } from "react-icons/lu";
import { BlurText } from "@/components/ui/BlurText";
import { SITE } from "@/lib/constants";

/**
 * The hero's readable layers: the label, the statement, the supporting line and
 * the two ways in.
 *
 * Type moves least of anything in the composition. That is the point: with the
 * ground, the atmosphere and the figure all travelling at their own speeds,
 * holding the words nearly still is what makes the rest read as depth rather
 * than as a page that slides.
 *
 * A server component. Each block carries `data-hero-in` so the mount timeline
 * in `Hero` can stagger them, and the column carries `data-hero="copy"` for the
 * scrubbed exit. Only `BlurText` on the name is a client island.
 */
export function HeroContent() {
  return (
    <div
      data-hero="copy"
      className="layer-content relative flex max-w-[38rem] flex-col lg:col-span-7 lg:max-w-none"
    >
      <p
        data-hero-in
        className="eyebrow flex items-center gap-3 text-cream/55"
      >
        Software Engineer · Web Development
      </p>

      {/* Set in sentence case, and the one heading on the page that is. Every
          section title is ALL CAPS in the poster face, but that face is
          expanded to 125%: at the length of a spoken sentence it would either
          wrap to five lines or have to be sized down until it stopped reading
          as a headline. `.display-lede` is the same family and weight with the
          width axis eased back and the caps dropped, so this still belongs to
          the poster, at speaking volume. */}
      <h1 data-hero-in className="display-lede mt-6 text-cream sm:mt-7">
        {/* The name gets the letter-wise blur-in on its own. It is the one
            piece of the hero worth animating character by character;
            everything else rises as a block. */}
        <span className="block">
          Hi, I&apos;m{" "}
          <BlurText text="Mark" startDelay={0.5} className="text-accent" />.
        </span>
        <span className="mt-2 block text-cream/90">
          I build fast, scalable <span className="lede-underline">web</span>{" "}
          experiences.
        </span>
      </h1>

      {/* One line, not three. The long version restated the headline above it
          and then listed qualities, which is the part a reader skips. */}
      <p
        data-hero-in
        className="mt-7 max-w-[30rem] text-base leading-relaxed text-pretty text-cream/65 sm:mt-8 sm:text-lg"
      >
        Full-stack developer in {SITE.location}. I design, build and ship web
        applications end to end.
      </p>

      <div
        data-hero-in
        className="layer-interactive relative mt-9 flex w-full flex-col items-stretch gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:items-center"
      >
        {/* ------------------------------------------------------------ */}
        {/*  The two ways in.                                             */}
        {/*                                                               */}
        {/*  Squared, not `rounded-full`. A yellow pill is the single most */}
        {/*  templated object a portfolio hero can carry, and it was the   */}
        {/*  one element here that belonged to a different design system   */}
        {/*  than the rest of the page: every other control on this site   */}
        {/*  is built from spaced caps, a thin rule and an arrow. These    */}
        {/*  now are too, so the accent still marks the primary action     */}
        {/*  without the shape announcing itself.                          */}
        {/*                                                               */}
        {/*  The label sits left and the arrow right, rather than the pair */}
        {/*  being centred. On a phone the buttons are full width, so the  */}
        {/*  arrow lands on the right edge and the two read as rows; on a  */}
        {/*  desktop they size to their content and read as buttons.       */}
        {/* ------------------------------------------------------------ */}
        <a
          href="#work"
          data-link="cta"
          data-magnetic
          className="group inline-flex items-center justify-between gap-8 bg-accent px-6 py-4 text-ink transition-transform duration-300 hover:-translate-y-0.5 sm:px-7"
        >
          <span className="text-[0.82rem] font-bold tracking-[0.14em] uppercase">
            View My Work
          </span>
          <LuArrowRight
            size={17}
            aria-hidden
            className="shrink-0 transition-transform duration-300 group-hover:translate-x-1.5"
          />
        </a>
        <a
          href="#about"
          className="group inline-flex items-center justify-between gap-8 border border-cream/30 px-6 py-4 text-cream transition-colors duration-300 hover:border-cream/70 sm:px-7"
        >
          <span className="text-[0.82rem] font-bold tracking-[0.14em] uppercase">
            About Me
          </span>
          <LuArrowDown
            size={17}
            aria-hidden
            className="shrink-0 text-cream/60 transition-transform duration-300 group-hover:translate-y-1"
          />
        </a>
      </div>

      {/* Foreground detail: the scroll cue, held to the bottom of the column on
          desktop where the composition has room for it. */}
      <div
        data-hero-in
        aria-hidden
        className="mt-12 hidden items-center gap-3 text-cream/40 lg:flex"
      >
        <LuArrowDown size={15} className="shrink-0" />
        <span className="eyebrow text-[0.68rem]">Scroll</span>
      </div>
    </div>
  );
}
