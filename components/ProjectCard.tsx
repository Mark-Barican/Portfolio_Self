"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
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
      className="relative z-20 inline-flex items-center gap-1.5 rounded-lg border border-border bg-white/[0.03] px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent/40 hover:text-foreground"
    >
      {children}
    </a>
  );
}

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(240px circle at ${mouseX}px ${mouseY}px, rgba(254,127,45,0.12), transparent 75%)`;

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <motion.article
      onMouseMove={handleMove}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card/40 transition-colors hover:border-white/15"
    >
      {/* Cursor spotlight */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlight }}
      />

      {/* Full-card accessible trigger */}
      <button
        type="button"
        onClick={() => onOpen(project)}
        aria-label={`Open details for ${project.title}`}
        className="absolute inset-0 z-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        data-cursor="hover"
      />

      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]">
          <ProjectThumb project={project} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
      </div>

      {/* Body */}
      <div className="pointer-events-none relative z-20 flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold tracking-tight">
              {project.title}
            </h3>
            <p className="mt-0.5 text-sm text-accent-hover">
              {project.tagline}
            </p>
          </div>
          <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border bg-white/[0.03] text-muted transition-all duration-300 group-hover:rotate-12 group-hover:border-accent/40 group-hover:text-accent">
            <LuArrowUpRight size={18} />
          </span>
        </div>

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
    </motion.article>
  );
}
