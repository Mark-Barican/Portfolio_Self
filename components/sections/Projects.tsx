"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { LuArrowUpRight } from "react-icons/lu";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionScene } from "@/components/ui/SectionScene";
import { ProjectRow } from "@/components/projects/ProjectRow";
import { ProjectModal } from "@/components/ProjectModal";
import { PROJECTS } from "@/lib/data";
import type { Project } from "@/types";
import { gsap } from "@/lib/gsap";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** Max tilt (deg) the cover reaches at full pointer speed. */
const MAX_TILT = 9;

/**
 * Built to Perform: the work as a numbered editorial index.
 *
 * One interaction carries the section: hovering a row lifts its title, brings
 * its metadata up to full strength, and floats that project's cover after the
 * cursor. The preview is owned here rather than per row, so there is exactly
 * one of them on the page and one set of tweens driving it, however many rows
 * exist.
 *
 * The cover leans into the direction of travel. Tilt is derived from pointer
 * velocity and eased back to level when movement stops, which is what stops it
 * reading as a sticker following the mouse.
 *
 * Touch and reduced-motion never see it. Those visitors get a real thumbnail
 * inside each row instead, which is the same information without asking for a
 * hover the device cannot perform.
 */
export function Projects() {
  const [active, setActive] = useState<Project | null>(null);
  const [hovered, setHovered] = useState<Project | null>(null);

  const isDesktop = useIsDesktop();
  const reduced = usePrefersReducedMotion();
  const preview = isDesktop && !reduced;

  const listRef = useRef<HTMLOListElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const moveRef = useRef<((event: React.MouseEvent) => void) | null>(null);

  // Position and tilt. Set up once and reused for the life of the section.
  useEffect(() => {
    const el = previewRef.current;
    if (!preview || !el) return;

    gsap.set(el, { autoAlpha: 0, scale: 0.88 });

    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
    const rotTo = gsap.quickTo(el, "rotation", { duration: 0.6, ease: "power3" });

    let lastX = 0;
    let settle = 0;

    moveRef.current = (event: React.MouseEvent) => {
      const rect = listRef.current?.getBoundingClientRect();
      if (!rect) return;
      xTo(event.clientX - rect.left);
      yTo(event.clientY - rect.top);

      // Velocity, not position: how fast the pointer is moving decides the
      // lean, so the cover trails the gesture instead of tracking the cursor.
      const dx = event.clientX - lastX;
      lastX = event.clientX;
      rotTo(gsap.utils.clamp(-MAX_TILT, MAX_TILT, dx * 0.6));

      // Level off once the pointer stops, or the cover stays cocked.
      window.clearTimeout(settle);
      settle = window.setTimeout(() => rotTo(0), 140);
    };

    return () => {
      moveRef.current = null;
      window.clearTimeout(settle);
      gsap.killTweensOf(el);
    };
  }, [preview]);

  // Fade the cover in and out as rows are entered and left.
  useEffect(() => {
    const el = previewRef.current;
    if (!preview || !el) return;
    gsap.to(el, {
      autoAlpha: hovered?.cover ? 1 : 0,
      scale: hovered?.cover ? 1 : 0.88,
      duration: 0.3,
      ease: "power3.out",
    });
  }, [hovered, preview]);

  return (
    <section
      id="work"
      /* Paints its own cream rather than letting the body's show through. A
         transparent section is one stacking-context change away from a gap at
         its boundary, and this one sits directly under the hero's hand-off. */
      className="relative isolate overflow-x-clip bg-background py-16 sm:py-20"
    >
      <SectionScene>
      <Container className="layer-content relative">
        <SectionHeading
          title={
            <>
              Built to
              <br />
              Perform
            </>
          }
        >
          {PROJECTS.length} builds from the last five years. Every one shipped.
        </SectionHeading>

        <ol
          ref={listRef}
          onMouseMove={preview ? (e) => moveRef.current?.(e) : undefined}
          onMouseLeave={() => setHovered(null)}
          className="relative mt-10"
        >
          {PROJECTS.map((project, i) => (
            <ProjectRow
              key={project.id}
              project={project}
              index={i}
              onOpen={() => setActive(project)}
              onHover={() => setHovered(project)}
            />
          ))}
          {/* Closes the last row's rule so the index reads as a bounded table
              rather than trailing off. */}
          <li aria-hidden className="border-t-2 border-ink" />

          {preview && (
            <div
              ref={previewRef}
              aria-hidden
              className="layer-interactive pointer-events-none invisible absolute top-0 left-0 hidden opacity-0 lg:block"
            >
              <div className="relative -mt-28 ml-10 aspect-[16/10] w-[24rem] overflow-hidden rounded-xl border-2 border-ink bg-ink shadow-lifted">
                {hovered?.cover && (
                  <Image
                    src={hovered.cover}
                    alt=""
                    fill
                    /* Deliberately double the 24rem box. `sizes` normally
                       states the rendered width and lets the browser pick the
                       variant, which on a 1x display means a 384px-wide file
                       for a screenshot that was 1884px wide: a 5x downscale
                       baked in by the encoder at quality 75. Asking for 768
                       hands the browser the detail and lets *it* do the
                       downsampling, which is what makes the interface type in
                       these covers survive at this size. */
                    sizes="768px"
                    quality={95}
                    className="object-cover object-top"
                  />
                )}
              </div>
            </div>
          )}
        </ol>

        {/* The index is a summary; the repositories are the evidence. */}
        <p className="mt-8 flex items-center gap-3 text-muted">
          <span className="eyebrow">Every build is open source</span>
          <a
            href="https://github.com/Mark-Barican"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="eyebrow group inline-flex items-center gap-1.5 py-2.5 text-ink underline decoration-accent decoration-2 underline-offset-4"
          >
            GitHub
            <LuArrowUpRight
              size={14}
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </p>
      </Container>
      </SectionScene>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
