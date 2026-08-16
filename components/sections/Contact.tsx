"use client";

import { useRef, useState } from "react";
import { LuArrowUpRight, LuCheck, LuCopy, LuDownload } from "react-icons/lu";
import { ContactForm } from "@/components/contact/ContactForm";
import { SurfaceEdge } from "@/components/ui/SurfaceEdge";
import { SectionScene } from "@/components/ui/SectionScene";
import { Footer } from "@/components/Footer";
import { SOCIAL_LINKS } from "@/lib/data";
import { LINKS, SITE } from "@/lib/constants";
import { gsap } from "@/lib/gsap";
import { EASE, SCRUB, scrubbed } from "@/lib/scroll";
import { useGsap } from "@/hooks/useGsap";

/**
 * The email, as the section's primary control rather than a line of text with
 * a copy icon beside it.
 *
 * It is a full-width row at display size, because the single most likely thing
 * a visitor wants from the bottom of this page is the address. Clicking copies;
 * the label swaps to confirm and swaps back. The accent sweeps across behind
 * the address on hover rather than recolouring it, so the address itself never
 * changes colour and stays readable at every point in the transition.
 */
function EmailCallToAction() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be unavailable (e.g. insecure context): fail silently.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      data-cursor="hover"
      data-link="contact"
      aria-label={copied ? "Email copied" : `Copy email address, ${SITE.email}`}
      className="group relative block w-full border-y border-cream/15 py-5 text-left sm:py-6"
    >
      {/* The sweep. A layer under the type rather than a background on the
          button, so it can grow from the left edge and pass *beneath* the
          address instead of becoming the row's new colour. */}
      <span
        aria-hidden
        className="absolute inset-0 origin-left scale-x-0 bg-accent/15 transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />

      <span className="relative flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
        <span className="min-w-0">
          <span className="eyebrow block text-cream/45">
            {copied ? "Copied to clipboard" : "Write to me directly"}
          </span>
          {/* Selectable, unlike the rest of the page. If the clipboard write
              above fails there has to be a way to get the address by hand,
              see the note in `globals.css`. */}
          <span
            data-selectable
            className="mt-2 block truncate text-[clamp(1.35rem,4.4vw,2.75rem)] leading-tight font-semibold tracking-tight text-cream"
          >
            {SITE.email}
          </span>
        </span>

        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 border-cream/30 text-cream transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-ink group-focus-visible:border-accent group-focus-visible:bg-accent group-focus-visible:text-ink">
          {copied ? (
            <LuCheck size={20} aria-hidden />
          ) : (
            <LuCopy size={19} aria-hidden />
          )}
        </span>
      </span>
    </button>
  );
}

/** One direct link: GitHub, LinkedIn, the résumé. */
function DirectLink({
  href,
  label,
  handle,
  icon: Icon,
  download = false,
}: {
  href: string;
  label: string;
  handle: string;
  icon: React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
  download?: boolean;
}) {
  const external = href.startsWith("http");

  return (
    <a
      href={href}
      {...(download ? { download: true } : null)}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : null)}
      data-cursor="hover"
      data-link="social"
      className="group flex items-center justify-between gap-6 border-b border-cream/12 py-3.5"
    >
      <span className="flex min-w-0 items-center gap-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-cream/20 text-cream/70 transition-colors duration-300 group-hover:border-accent group-hover:text-accent">
          <Icon size={17} aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="block text-base font-medium text-cream">
            {label}
          </span>
          <span className="block truncate text-sm text-cream/45">{handle}</span>
        </span>
      </span>

      {/* Slides out and up on hover: the "social" interaction in the page's
          link system. Transform only. */}
      <LuArrowUpRight
        size={18}
        aria-hidden
        className="shrink-0 text-cream/40 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent"
      />
    </a>
  );
}

/**
 * The final destination: contact and footer as one dark section rather than
 * two stacked ones.
 *
 * They used to be genuinely separate: a cream `Contact` section inside `main`,
 * and an ink `Footer` rendered after it from the root layout, with a surface
 * change between them. That meant the page ended twice: a closing statement,
 * then a second closing block in a different colour, and the last thing a
 * reader met was a colophon rather than a way to get in touch.
 *
 * Now there is one ink surface from the About boundary to the bottom of the
 * document, and it is ordered by what a visitor at the end of a portfolio
 * actually wants: the address first at display size, then the direct links and
 * the form, and only then the navigation, the credit and the year. The footer
 * material is still all there; it is just no longer a separate destination.
 *
 * The composition is asymmetric on purpose: the statement runs to the left
 * edge of the measure, the form is offset down and right, so the two read as
 * one spread rather than as two halves of a split.
 *
 * There is no oversized `BARICAN` at the foot any more. It was there to bookend
 * the hero, and as a device that was fine, but it added most of a screen of
 * decoration *below* the last useful thing on the page, so the reader's reward
 * for finishing the contact form was another screen of scrolling to reach the
 * bottom. The name is already in the wordmark directly above the colophon.
 *
 * The vertical rhythm throughout is tighter than the rest of the page for the
 * same reason: this section has to read as one closing spread, not as a third
 * act. Every gap here is a step down from its equivalent in the sections above.
 */
export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useGsap(
    () => {
      // The closing statement, scrubbed against the reader's approach.
      gsap
        .timeline({
          scrollTrigger: scrubbed({
            trigger: "[data-contact-head]",
            start: "top 82%",
            end: "top 40%",
            scrub: SCRUB.base,
            id: "contact-intro",
          }),
        })
        .from("[data-contact-line]", {
          yPercent: 108,
          duration: 0.6,
          ease: EASE.editorial,
          stagger: 0.12,
        })
        .from(
          "[data-contact-lede]",
          { opacity: 0, y: 22, duration: 0.4, ease: EASE.in },
          0.35,
        );

      // The email row and the two columns under it, in reading order.
      gsap
        .timeline({
          scrollTrigger: scrubbed({
            trigger: "[data-contact-body]",
            start: "top 88%",
            end: "top 45%",
            scrub: SCRUB.base,
            id: "contact-body",
          }),
        })
        .from("[data-contact-cta]", {
          opacity: 0,
          y: 26,
          duration: 0.5,
          ease: EASE.in,
        })
        .from(
          "[data-contact-col]",
          {
            opacity: 0,
            y: 30,
            duration: 0.5,
            ease: EASE.in,
          },
          0.25,
        );

      /* The form reveals against its own position rather than the left
         column's. Sharing the staggered tween keyed to `[data-contact-body]`
         meant arriving from the nav left it at `opacity: 0`, showing a
         contact section with no visible way to make contact. */
      gsap.from("[data-contact-form]", {
        opacity: 0,
        y: 30,
        ease: EASE.in,
        scrollTrigger: scrubbed({
          trigger: "[data-contact-form]",
          start: "top 95%",
          end: "top 62%",
          scrub: SCRUB.base,
          id: "contact-form",
        }),
      });

      // The footer band. Its own scene, because it sits a screen further down
      // and should not be tied to the statement's range.
      gsap
        .timeline({
          scrollTrigger: scrubbed({
            trigger: "[data-contact-foot]",
            start: "top 94%",
            end: "top 62%",
            scrub: SCRUB.base,
            id: "contact-foot",
          }),
        })
        .from("[data-foot-rule]", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.5,
          ease: EASE.editorial,
        })
        .from(
          "[data-foot-part]",
          {
            opacity: 0,
            y: 16,
            duration: 0.45,
            ease: EASE.in,
            stagger: 0.08,
          },
          0.2,
        );
    },
    sectionRef,
    [],
  );

  return (
    <section
      ref={sectionRef}
      id="contact"
      data-surface="dark"
      /* `overflow-x-clip`, not `overflow-clip`: the clip exists to stop wide
         decoration widening the document, which is a horizontal concern.
         Clipping vertically as well is what stopped `SurfaceEdge` covering the
         fractional-pixel seam at this section's top edge: see the note there. */
      /* No `scroll-mt`, like every other section: the page anchors sections to
         the top of the viewport and lets each one's own top padding clear the
         header. `pt-24` here is deeper than the `py-20` the others use because
         this section has the most to fit on one screen. See `scroll-padding-top`
         in globals.css. */
      className="relative isolate overflow-x-clip bg-ink-surface pt-20 pb-8 sm:pt-24"
    >
      {/* The page's last surface change: cream above, ink from here down. */}
      <SurfaceEdge from="cream" depth={70} />

      {/* `exit={false}`: this is the page's last section. Fading it out on the
          way past would spend the bottom of the document on an empty screen
          the reader cannot scroll beyond. */}
      <SectionScene exit={false}>
      <div className="relative mx-auto w-full max-w-[90rem] px-5 sm:px-8">
        {/* ---------------------------------------------------------------- */}
        {/*  Statement                                                        */}
        {/* ---------------------------------------------------------------- */}
        {/* ---------------------------------------------------------------- */}
        {/*  Status rail.                                                     */}
        {/*                                                                   */}
        {/*  Availability as a line of running head, not as a pill with a     */}
        {/*  pulsing dot. The dot-and-capsule "Open to work" badge is the      */}
        {/*  most recognisable stock component in this genre, and it reads as  */}
        {/*  a template even when the information is true. Set as spaced caps  */}
        {/*  on a rule it carries exactly the same fact in the page's own      */}
        {/*  editorial voice.                                                  */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex items-baseline justify-between gap-6 border-b border-cream/15 pb-4">
          <p className="eyebrow text-cream/55">
            Available for work · {new Date().getFullYear()}
          </p>
          <p className="eyebrow hidden text-cream/40 sm:block">
            {SITE.location}
          </p>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/*  One spread, two columns.                                         */}
        {/*                                                                   */}
        {/*  The statement, the address and the direct links run down the      */}
        {/*  left; the form sits beside them on the right, starting at the     */}
        {/*  same top edge. It used to be stacked: statement, then address    */}
        {/*  full-width, then links and form side by side underneath, which   */}
        {/*  read correctly but ran to nearly two screens, so the closing      */}
        {/*  section had a second half the reader had to go and find.          */}
        {/*                                                                   */}
        {/*  Setting them alongside each other puts the whole contact          */}
        {/*  experience, and the top of the colophon, in one view.             */}
        {/* ---------------------------------------------------------------- */}
        <div className="mt-6 grid gap-x-14 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div data-contact-head>
              <h2 className="font-display text-cream text-[min(9vw,5.5rem)] leading-[0.92] tracking-[-0.02em] uppercase">
                {/* Each line masked by its own overflow box, so the type is
                    drawn up from behind a hard edge rather than faded in. */}
                <span className="block overflow-hidden">
                  <span data-contact-line className="block">
                    Let&apos;s
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span data-contact-line className="text-outline-cream block">
                    Talk
                  </span>
                </span>
              </h2>

              <p
                data-contact-lede
                className="mt-6 max-w-lg text-lg leading-relaxed text-pretty text-cream/70 sm:text-xl"
              >
                Got a build that needs an owner from first conversation to
                launch? Send a note.
              </p>
            </div>

            <div data-contact-body className="mt-7">
              <div data-contact-cta>
                <EmailCallToAction />
              </div>

              <div data-contact-col className="mt-6">
                <h3 className="eyebrow text-cream/45">Elsewhere</h3>
                <div className="mt-4">
                {SOCIAL_LINKS.filter((link) => link.label !== "Email").map(
                  (link) => (
                    <DirectLink
                      key={link.label}
                      href={link.href}
                      label={link.label}
                      handle={link.handle ?? ""}
                      icon={link.icon}
                    />
                  ),
                )}
                  <DirectLink
                    href={LINKS.resume}
                    label="Résumé"
                    handle="PDF download"
                    icon={LuDownload}
                    download
                  />
                </div>
              </div>
            </div>
          </div>

          {/* The form, beside the statement rather than under it. Offset down
              a little from lg so the two columns interlock instead of sitting
              level, which is the same asymmetry the About spread uses. */}
          <div
            data-contact-form
            className="lg:col-span-5 lg:col-start-8 lg:pt-6"
          >
            <h3 className="eyebrow text-cream/45">Send a message</h3>
            <div className="mt-6">
              <ContactForm tone="dark" />
            </div>
          </div>
        </div>

        <Footer />

      </div>
      </SectionScene>

    </section>
  );
}
