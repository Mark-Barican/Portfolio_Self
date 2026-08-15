import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionScene } from "@/components/ui/SectionScene";
import { Reveal } from "@/components/ui/Reveal";
import { ParallaxY } from "@/components/ui/ParallaxY";
import { SurfaceEdge } from "@/components/ui/SurfaceEdge";
import { ScrollTypedText } from "@/components/ui/ScrollTypedText";
import { AboutFigure } from "@/components/sections/AboutFigure";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import {
  CERTIFICATIONS,
  EDUCATION,
  LANGUAGES,
  STATS,
  SUMMARY,
} from "@/lib/data";
import { SITE } from "@/lib/constants";

/**
 * Behind the Work: the person, as a layered composition rather than a photo
 * beside a paragraph.
 *
 * The figure runs the full height of a five-column slot and is deliberately
 * lifted above the text column's top edge, so the two blocks interlock instead
 * of sitting in matching boxes. The summary is set as a pull quote, the
 * figures as hairline-separated numbers, and the credentials as a plain list.
 * Nothing here is a rounded card.
 *
 * Every value is the same one the published site carries: five years, four
 * client engagements, the 5,000+ figure the simulator actually reached, and
 * the Lighthouse peak two of the builds actually scored.
 */
export function About() {
  return (
    <section
      id="about"
      /* Explicit cream, for the same reason as the work index: every section on
         the page paints its own surface so no boundary depends on the body. */
      /* Horizontal clip only, so the surface band can cover the fractional
         seam at this section's top edge. See `SurfaceEdge`. */
      className="relative isolate overflow-x-clip bg-background py-16 sm:py-20"
    >
      {/* Carries the capabilities section's ink over this one's top edge. */}
      <SurfaceEdge from="ink" depth={60} />

      <SectionScene>
      <Container className="layer-content relative">
        <SectionHeading
          title={
            <>
              Behind
              <br />
              the Work
            </>
          }
        />

        <div className="mt-10 grid gap-x-12 gap-y-10 lg:mt-12 lg:grid-cols-12">
          {/* ---------------------------------------------------------------- */}
          {/*  The figure.                                                      */}
          {/*                                                                   */}
          {/*  It used to be pulled up with `-mt-24` *and* given a negative      */}
          {/*  parallax distance, so it entered ~140px above its slot and cut    */}
          {/*  across the bottom of "THE WORK". Both are gone: the figure now    */}
          {/*  starts below the heading, and the drift is positive, which means  */}
          {/*  it approaches from below and only reaches -36px at the very end   */}
          {/*  of the pass, well clear of the type.                              */}
          {/*                                                                   */}
          {/*  The interlock comes from the text column being offset down        */}
          {/*  instead, which is a stacking order that cannot collide.           */}
          {/* ---------------------------------------------------------------- */}
          <ParallaxY distance={36} className="lg:col-span-5">
            <AboutFigure>
              <figure className="relative">
                <div
                  data-about-photo
                  className="relative aspect-[3/4] w-full overflow-hidden"
                >
                  <Image
                    src="/About-Photo.jpg"
                    alt={`Portrait of ${SITE.shortName}`}
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 92vw, 38vw"
                    className="object-cover object-center"
                  />
                </div>

                {/* Two drawn marks, offset off the image's corners. Absolute
                    and inert, so they can cross the edge without affecting
                    layout or intercepting anything. */}
                <span
                  aria-hidden
                  data-about-mark
                  className="layer-decoration absolute -top-3 -left-3 h-16 w-16 origin-top-left border-t-2 border-l-2 border-ink"
                />
                <span
                  aria-hidden
                  data-about-mark
                  className="layer-decoration absolute -right-3 -bottom-3 h-16 w-16 origin-bottom-right border-r-2 border-b-2 border-accent"
                />

                <figcaption
                  data-about-caption
                  className="eyebrow mt-4 flex items-center gap-3 text-faint"
                >
                  {SITE.location}
                </figcaption>
              </figure>
            </AboutFigure>
          </ParallaxY>

          {/* ---------------------------------------------------------------- */}
          {/*  Summary, figures and credentials.                               */}
          {/* ---------------------------------------------------------------- */}
          <div className="flex flex-col gap-9 lg:col-span-7 lg:pt-16">
            {/* The summary types itself out against the reader's scroll, and
                untypes on the way back up. The one place on the page where the
                text itself is the animation rather than the block it sits in.
                Replaces the line-by-line mask reveal, which played on entry and
                was over before the reader had settled. */}
            <ScrollTypedText
              text={SUMMARY}
              className="text-2xl leading-snug text-pretty text-ink sm:text-[2rem]"
            />

            {/* Figures as a rule-separated row, not a grid of boxes. */}
            <Reveal delay={0.06}>
              <dl className="grid grid-cols-2 gap-y-8 border-t-2 border-ink pt-8 sm:grid-cols-4 sm:gap-y-0">
                {STATS.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={
                      i > 0
                        ? "flex flex-col-reverse gap-1.5 border-ink/15 sm:border-l sm:pl-6"
                        : "flex flex-col-reverse gap-1.5"
                    }
                  >
                    <dt className="eyebrow text-[0.68rem] text-muted">
                      {stat.label}
                    </dt>
                    {/* Normal-width sans: the 125%-expanded display face is
                        too wide for cells this narrow. */}
                    <dd className="text-4xl font-bold tracking-tight text-ink tabular-nums">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            {/* Credentials, as a plain definition-style list. */}
            <Reveal delay={0.1}>
              <div className="flex flex-col gap-8 border-t-2 border-ink pt-8">
                <div className="grid gap-2 sm:grid-cols-[10rem_1fr] sm:gap-6">
                  <h3 className="eyebrow text-muted">Education</h3>
                  <div>
                    <p className="text-lg font-semibold text-ink">
                      {EDUCATION.degree}
                    </p>
                    <p className="text-base text-muted">
                      {EDUCATION.school} · {EDUCATION.location}
                    </p>
                  </div>
                </div>

                {/* ---------------------------------------------------------- */}
                {/*  Certifications.                                            */}
                {/*                                                             */}
                {/*  Was a bulleted list with a 16px mark in a 24px gutter and   */}
                {/*  the issuer trailing the title on the same line, which put   */}
                {/*  four credentials at body size in a column and made the      */}
                {/*  marks too small to identify. Now each is its own row with   */}
                {/*  the mark given a real 44px plate, the title at reading      */}
                {/*  weight and the issuer set beneath it as its own line.       */}
                {/*                                                             */}
                {/*  Rows rather than a card grid: these are credentials, not    */}
                {/*  products, and boxing them would give four short strings     */}
                {/*  more visual weight than the work above them. The hover      */}
                {/*  brings the plate and the rule up a step, which is enough    */}
                {/*  to make the row feel handled without it becoming a target.  */}
                {/* ---------------------------------------------------------- */}
                <div className="grid gap-4 border-t border-ink/15 pt-8 sm:grid-cols-[10rem_1fr] sm:gap-6">
                  <h3 className="eyebrow text-muted">Certifications</h3>
                  <ul className="flex flex-col">
                    {CERTIFICATIONS.map((cert) => {
                      const Icon = cert.icon;
                      return (
                        <li
                          key={`${cert.issuer}-${cert.title}`}
                          className="group flex items-center gap-4 border-b border-ink/10 py-3.5 last:border-b-0"
                        >
                          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-ink/15 bg-card text-ink/75 transition-colors duration-300 group-hover:border-ink group-hover:text-ink">
                            {Icon ? (
                              <Icon size={22} aria-hidden />
                            ) : (
                              <span
                                className="text-[0.7rem] font-bold tracking-tight"
                                aria-hidden
                              >
                                {cert.monogram}
                              </span>
                            )}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[0.98rem] leading-snug font-medium text-ink">
                              {cert.title}
                            </span>
                            <span className="eyebrow mt-0.5 block text-[0.6rem] text-faint">
                              {cert.issuer}
                            </span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="grid gap-2 border-t border-ink/15 pt-8 sm:grid-cols-[10rem_1fr] sm:gap-6">
                  <h3 className="eyebrow text-muted">Languages</h3>
                  <p className="text-ink">
                    {LANGUAGES.map((lang) => `${lang.name} (${lang.level})`).join(
                      " · ",
                    )}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
      </SectionScene>
    </section>
  );
}
