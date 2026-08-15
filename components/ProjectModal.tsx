"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  LuX,
  LuGithub,
  LuExternalLink,
  LuCircleCheck,
  LuTriangleAlert,
  LuSparkles,
} from "react-icons/lu";
import { ProjectThumb } from "@/components/ProjectThumb";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

function ListBlock({
  title,
  icon,
  items,
  tone,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  tone: "challenge" | "solution";
}) {
  return (
    <div className="rounded-2xl border border-border bg-ink/[0.04] p-5">
      <h4 className="flex items-center gap-2 text-sm font-semibold">
        <span
          className={tone === "solution" ? "text-ink" : "text-foreground/60"}
        >
          {icon}
        </span>
        {title}
      </h4>
      <ul className="mt-3 flex flex-col gap-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2.5 text-sm text-muted">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink/30" />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLButtonElement>(null);
  const reduced = usePrefersReducedMotion();

  /**
   * The project still being shown, which lags `project` by one exit animation.
   *
   * Without it the content would vanish the instant `project` went null and the
   * dialog would animate out empty. This keeps the last one mounted until the
   * closing tween finishes.
   */
  const [visible, setVisible] = useState<Project | null>(null);

  /* `document.body` does not exist during the server render, so the portal
     cannot be created until after mount. Gating on this rather than on
     `typeof document` keeps the first client render identical to the server's
     and avoids a hydration mismatch. */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (project) setVisible(project);
  }, [project]);

  useEffect(() => {
    if (!visible) return;
    const root = rootRef.current;
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!root || !panel || !backdrop) return;

    const d = reduced ? 0 : 1;
    const tl = gsap.timeline();

    if (project) {
      tl.set(root, { autoAlpha: 1 })
        .fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.25 * d }, 0)
        .fromTo(
          panel,
          { y: 40, opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, duration: 0.45 * d, ease: "power3.out" },
          0,
        );
    } else {
      tl.to(
        panel,
        { y: 30, opacity: 0, scale: 0.98, duration: 0.25 * d, ease: "power2.in" },
        0,
      )
        .to(backdrop, { opacity: 0, duration: 0.25 * d }, 0)
        .set(root, { autoAlpha: 0 })
        // Unmount only once the exit has actually played.
        .call(() => setVisible(null));
    }

    return () => {
      tl.kill();
    };
  }, [project, visible, reduced]);

  // Esc to close + body scroll lock while open.
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  if (!visible || !mounted) return null;

  const p = visible;

  /* Portalled to `document.body`, and it has to be.
   *
   * **A `z-index` only ranks a box against its siblings in the same stacking
   * context, and this dialog was born inside two of them.** `main#content` is
   * `position: relative; z-index: 10`, and `section#work` is `isolate`. So the
   * `z-[90]` below was never competing with the header at all — it ranked the
   * panel *within* the work section, which ranks within `main`'s single z-10
   * layer, and the header is a sibling of `main` at z-80. 80 beats 10, so the
   * navigation painted straight over an open case study every time, which is
   * the fault in the Valentine's screenshot: crisp header, dimmed dialog.
   *
   * No z-index on the dialog could have fixed that. Escaping to `body` is what
   * puts it in the same stacking context as the header, and only then does the
   * overlay band mean what it says. */
  return createPortal(
    <div
      ref={rootRef}
      className="invisible fixed inset-0 z-[100] flex items-end justify-center p-0 opacity-0 sm:items-center sm:p-6"
    >
      {/* Backdrop */}
      <button
        ref={backdropRef}
        type="button"
        aria-label="Close project details"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-md"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border-2 border-ink bg-surface sm:rounded-3xl"
      >
            {/* Close */}
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 z-20 grid h-10 w-10 place-items-center rounded-full border border-border bg-background/60 text-muted backdrop-blur transition-colors hover:text-foreground"
            >
              <LuX size={18} />
            </button>

            <div className="overflow-y-auto">
              {/* Gallery hero */}
              {/* The cover, unobstructed. The cream gradient that used to sit
                  over it was blending the screenshot into the panel and taking
                  the bottom third of every image with it. */}
              <div className="relative aspect-[16/9] w-full">
                <ProjectThumb project={p} size="lg" />
              </div>

              <div className="flex flex-col gap-7 p-6 sm:p-8">
                {/* Title */}
                <div>
                  <h3
                    id="project-modal-title"
                    className="text-2xl font-semibold tracking-tight sm:text-3xl"
                  >
                    {p.title}
                  </h3>
                  <p className="eyebrow mt-2 text-muted">{p.tagline}</p>
                </div>

                {/* Overview */}
                <p className="leading-relaxed text-pretty text-foreground/80">
                  {p.overview}
                </p>

                {/* Gallery — real screenshots (omitted for single-image projects) */}
                {p.gallery && p.gallery.length > 0 && (
                  <div
                    className={cn(
                      "grid gap-3",
                      p.gallery.length >= 3
                        ? "sm:grid-cols-3"
                        : "sm:grid-cols-2",
                    )}
                  >
                    {p.gallery.map((src, i) => (
                      <div
                        key={src}
                        className="relative aspect-video overflow-hidden rounded-xl border border-border bg-surface"
                      >
                        <Image
                          src={src}
                          alt={`${p.title} screenshot ${i + 1}`}
                          fill
                          sizes="(max-width: 640px) 100vw, 240px"
                          className="object-cover object-top"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Features */}
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold">
                    <LuSparkles size={16} className="text-ink" />
                    Key Features
                  </h4>
                  <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {p.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex gap-2.5 rounded-xl border border-border bg-ink/[0.04] p-3 text-sm text-muted"
                      >
                        <LuCircleCheck
                          size={16}
                          className="mt-0.5 shrink-0 text-ink"
                        />
                        <span className="leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Challenges + Solutions */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <ListBlock
                    title="Challenges"
                    tone="challenge"
                    icon={<LuTriangleAlert size={16} />}
                    items={p.challenges}
                  />
                  <ListBlock
                    title="Solutions"
                    tone="solution"
                    icon={<LuCircleCheck size={16} />}
                    items={p.solutions}
                  />
                </div>

                {/* Tech */}
                <div>
                  <h4 className="text-sm font-semibold">Tech Stack</h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-border bg-ink/[0.04] px-3 py-1.5 text-xs text-foreground/80"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                {(p.links.live || p.links.repo) && (
                  <div className="flex flex-wrap gap-3 border-t border-border pt-6">
                    {p.links.live && (
                      <Button
                        href={p.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LuExternalLink size={16} /> Live Demo
                      </Button>
                    )}
                    {p.links.repo && (
                      <Button
                        href={p.links.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="secondary"
                      >
                        <LuGithub size={16} /> View Code
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
      </div>
    </div>,
    document.body,
  );
}
