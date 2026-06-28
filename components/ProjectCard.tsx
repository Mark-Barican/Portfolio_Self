"use client";

import { useRef } from "react";
import { LuArrowUpRight, LuGithub, LuExternalLink } from "react-icons/lu";
import { ProjectThumb } from "@/components/ProjectThumb";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
}

/** External link pill that stops propagation so it works above the card button. */
function LinkPill({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onClick={(e) => e.stopPropagation()}
      className="relative z-20 inline-flex items-center gap-1.5 rounded-lg border border-border bg-white/[0.03] px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent/40 hover:text-foreground active:scale-95"
    >
      {children}
    </a>
  );
}

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const ref = useRef<HTMLElement>(null);

  // Cursor-driven 3D tilt + spotlight, written to CSS variables (no JS runtime).
  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    el.style.setProperty("--rx", `${(0.5 - py) * 7}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * 9}deg`);
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div className="group [perspective:1400px]">
      <article
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{
          transform: "rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))",
        }}
        className="relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card/40 transition-[transform,border-color,box-shadow] duration-200 ease-out will-change-transform group-hover:border-accent/30 group-hover:shadow-[0_30px_90px_-45px_rgba(139,92,246,0.55)]"
      >
        {/* Cursor spotlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(320px circle at var(--mx,50%) var(--my,0%), rgba(139,92,246,0.16), transparent 70%)",
          }}
        />

        {/* Full-card accessible trigger */}
        <button
          type="button"
          onClick={() => onOpen(project)}
          aria-label={`Open details for ${project.title}`}
          className="absolute inset-0 z-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          data-cursor="hover"
        />

        {/* Image with overlaid title (visual only — clicks fall through to the
            full-card button below) */}
        <div className="pointer-events-none relative aspect-[16/11] overflow-hidden">
          <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.06]">
            <ProjectThumb project={project} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />

          {/* Arrow chip */}
          <span className="absolute top-4 right-4 z-20 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-black/40 text-white/80 backdrop-blur transition-all duration-300 group-hover:rotate-12 group-hover:border-accent/50 group-hover:bg-accent group-hover:text-black">
            <LuArrowUpRight size={18} />
          </span>

          {/* Title overlay */}
          <div className="absolute inset-x-0 bottom-0 z-20 p-5">
            <h3 className="text-xl font-semibold tracking-tight text-foreground">
              {project.title}
            </h3>
            <p className="mt-0.5 text-sm text-accent-hover">{project.tagline}</p>
          </div>
        </div>

        {/* Body */}
        <div className="pointer-events-none relative z-20 flex flex-1 flex-col gap-4 p-6 pt-5">
          <p className="text-sm leading-relaxed text-pretty text-muted">
            {project.description}
          </p>

          {/* Tech */}
          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            {project.tech.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-border bg-white/[0.02] px-2 py-1 text-[0.7rem] text-muted"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Links — pointer events re-enabled */}
          {(project.links.repo || project.links.live) && (
            <div className="pointer-events-auto flex flex-wrap gap-2 pt-1">
              {project.links.live && (
                <LinkPill
                  href={project.links.live}
                  label={`Open live demo of ${project.title}`}
                >
                  <LuExternalLink size={13} /> Live
                </LinkPill>
              )}
              {project.links.repo && (
                <LinkPill
                  href={project.links.repo}
                  label={`Open GitHub repo for ${project.title}`}
                >
                  <LuGithub size={13} /> Code
                </LinkPill>
              )}
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
