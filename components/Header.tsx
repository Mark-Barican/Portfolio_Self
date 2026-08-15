"use client";

import { useEffect, useRef, useState } from "react";
import { LuArrowUpRight } from "react-icons/lu";
import { NAV_SECTIONS, SITE } from "@/lib/constants";
import { Logo } from "@/components/Logo";
import { gsap } from "@/lib/gsap";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useOverDarkSurface } from "@/hooks/useOverDarkSurface";
import { cn } from "@/lib/utils";

const SECTION_IDS = NAV_SECTIONS.map((s) => s.id);

/** Y offset (px) of the header's midline, used for the light/dark test. */
const HEADER_MIDLINE = 34;

/**
 * Fixed editorial header: wordmark left, pill nav centre (desktop), "Let's
 * Talk" CTA right. On mobile the pill collapses into a hamburger that opens a
 * full-screen ink overlay. The wordmark and hamburger invert over ink sections.
 *
 * The active-item pill is one element that slides between links rather than a
 * background on each of them, so changing section reads as a single movement
 * instead of a cross-fade.
 *
 * The mobile overlay stays mounted and is hidden with `autoAlpha`, which sets
 * `visibility: hidden`. That takes it out of the tab order and the
 * accessibility tree without needing to coordinate an exit animation against
 * unmounting.
 */
export function Header() {
  const active = useActiveSection(SECTION_IDS);
  const [open, setOpen] = useState(false);
  const overDark = useOverDarkSurface(HEADER_MIDLINE);

  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // The open overlay is itself an ink surface sitting under the header.
  const light = overDark || open;

  // Slide the pill to the active link. `width` is tweened rather than scaled
  // because the labels differ in length; it is one small element changing only
  // when the reader crosses a section boundary, so the layout cost is trivial.
  useEffect(() => {
    const nav = navRef.current;
    const pill = pillRef.current;
    if (!nav || !pill) return;

    const target = nav.querySelector<HTMLElement>(`[data-nav="${active}"]`);
    if (!target) {
      gsap.to(pill, { autoAlpha: 0, duration: 0.2 });
      return;
    }
    gsap.to(pill, {
      x: target.offsetLeft,
      width: target.offsetWidth,
      autoAlpha: 1,
      duration: 0.45,
      ease: "power3.out",
    });
  }, [active]);

  // Open/close the overlay and stagger its links.
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const links = overlay.querySelectorAll("[data-mobile-link]");
    const tl = gsap.timeline();

    if (open) {
      tl.set(overlay, { autoAlpha: 1 })
        .fromTo(overlay, { yPercent: -3 }, { yPercent: 0, duration: 0.35 })
        .fromTo(
          links,
          { opacity: 0, x: -18 },
          { opacity: 1, x: 0, duration: 0.4, stagger: 0.05 },
          0.05,
        );
    } else {
      tl.to(overlay, { autoAlpha: 0, duration: 0.25 });
    }
    return () => {
      tl.kill();
    };
  }, [open]);

  // Lock body scroll while the overlay menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape for keyboard users.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[80]">
        <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a
            href="#home"
            className={cn(
              "transition-colors duration-300",
              light ? "text-cream" : "text-ink",
            )}
            aria-label={`${SITE.shortName}, back to top`}
          >
            <Logo title={null} className="h-8 w-auto sm:h-9" />
          </a>

          <nav
            ref={navRef}
            aria-label="Primary"
            className="pointer-events-auto relative hidden items-center gap-1 rounded-full border border-border bg-card/85 p-1.5 backdrop-blur-md lg:flex"
          >
            <span
              ref={pillRef}
              aria-hidden
              className="invisible absolute top-1.5 left-0 bottom-1.5 w-0 rounded-full bg-ink opacity-0"
            />
            {NAV_SECTIONS.map((section) => {
              const isActive = active === section.id;
              return (
                <a
                  key={section.id}
                  href={section.href}
                  data-nav={section.id}
                  aria-current={isActive ? "true" : undefined}
                  data-link="nav"
                  className={cn(
                    "eyebrow relative rounded-full px-4 py-2 transition-colors duration-300",
                    isActive ? "text-cream" : "text-ink/75",
                  )}
                >
                  <span className="link-label">{section.label}</span>
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/* ------------------------------------------------------------ */}
            {/*  Contact CTA.                                                 */}
            {/*                                                               */}
            {/*  Set as type on an accent rule rather than as a filled pill.   */}
            {/*  A yellow rounded-full button in the corner of every screen is */}
            {/*  the single most templated element a portfolio can carry, and  */}
            {/*  it was competing with the hero's own primary button for the   */}
            {/*  same colour and the same job. As a marked-up word it still    */}
            {/*  reads as the one thing to press, without pretending to be a   */}
            {/*  product's sign-up.                                            */}
            {/*                                                               */}
            {/*  The rule is the always-on part; hover thickens it and moves   */}
            {/*  the arrow, so the affordance never depends on hover alone.    */}
            {/* ------------------------------------------------------------ */}
            <a
              href="#contact"
              data-magnetic
              className={cn(
                "group hidden items-center gap-2 pb-1 sm:inline-flex",
                "eyebrow relative font-bold transition-colors duration-300",
                light ? "text-cream" : "text-ink",
              )}
            >
              Let&apos;s Talk
              <LuArrowUpRight
                size={15}
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-accent transition-transform duration-300 group-hover:scale-y-[2] group-focus-visible:scale-y-[2]"
              />
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className={cn(
                "flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border backdrop-blur-md transition-colors lg:hidden",
                light
                  ? "border-cream/40 bg-cream/10"
                  : "border-border bg-card/85",
              )}
            >
              <span
                className={cn(
                  "h-0.5 w-5 transition-all duration-300",
                  light ? "bg-cream" : "bg-ink",
                  open && "translate-y-1 rotate-45",
                )}
              />
              <span
                className={cn(
                  "h-0.5 w-5 transition-all duration-300",
                  light ? "bg-cream" : "bg-ink",
                  open && "-translate-y-1 -rotate-45",
                )}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu. Always mounted; `autoAlpha` hides it. */}
      <div
        ref={overlayRef}
        data-surface="dark"
        className="invisible fixed inset-0 z-[75] flex flex-col overflow-y-auto bg-ink-surface px-6 pt-28 pb-10 opacity-0 lg:hidden"
      >
        <nav aria-label="Mobile" className="flex flex-col gap-1">
          {NAV_SECTIONS.map((section, i) => (
            <a
              key={section.id}
              href={section.href}
              data-mobile-link
              onClick={() => setOpen(false)}
              className="group flex items-baseline gap-4 border-b border-cream/15 py-4"
            >
              <span className="eyebrow text-cream/55">0{i + 1}</span>
              <span className="font-display text-[min(11vw,2.75rem)] text-cream transition-colors group-hover:text-accent">
                {section.label}
              </span>
            </a>
          ))}
        </nav>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-10">
          <span className="eyebrow text-cream/60">{SITE.location}</span>
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="eyebrow rounded-full bg-accent px-5 py-3 font-bold text-ink"
          >
            Let&apos;s Talk
          </a>
        </div>
      </div>
    </>
  );
}
