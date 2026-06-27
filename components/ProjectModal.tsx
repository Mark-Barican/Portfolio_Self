"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
    <div className="rounded-2xl border border-border bg-white/[0.02] p-5">
      <h4 className="flex items-center gap-2 text-sm font-semibold">
        <span
          className={tone === "solution" ? "text-accent" : "text-foreground/60"}
        >
          {icon}
        </span>
        {title}
      </h4>
      <ul className="mt-3 flex flex-col gap-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2.5 text-sm text-muted">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/30" />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

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

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close project details"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-md"
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-border bg-surface sm:rounded-3xl"
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
              <div className="relative aspect-[16/9] w-full">
                <ProjectThumb project={project} size="lg" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
              </div>

              <div className="flex flex-col gap-7 p-6 sm:p-8">
                {/* Title */}
                <div>
                  <h3
                    id="project-modal-title"
                    className="text-2xl font-semibold tracking-tight sm:text-3xl"
                  >
                    {project.title}
                  </h3>
                  <p className="mt-1 text-accent-hover">{project.tagline}</p>
                </div>

                {/* Overview */}
                <p className="leading-relaxed text-pretty text-foreground/80">
                  {project.overview}
                </p>

                {/* Gallery placeholders */}
                {/* TODO: Swap these tiles for real screenshots in /public/projects. */}
                <div className="grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((n) => (
                    <div
                      key={n}
                      className="relative aspect-video overflow-hidden rounded-xl border border-border"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${project.accent[0]}22, ${project.accent[1]}44)`,
                      }}
                    >
                      <div className="grid-pattern absolute inset-0 opacity-30" />
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold">
                    <LuSparkles size={16} className="text-accent" />
                    Key Features
                  </h4>
                  <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {project.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex gap-2.5 rounded-xl border border-border bg-white/[0.02] p-3 text-sm text-muted"
                      >
                        <LuCircleCheck
                          size={16}
                          className="mt-0.5 shrink-0 text-accent"
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
                    items={project.challenges}
                  />
                  <ListBlock
                    title="Solutions"
                    tone="solution"
                    icon={<LuCircleCheck size={16} />}
                    items={project.solutions}
                  />
                </div>

                {/* Tech */}
                <div>
                  <h4 className="text-sm font-semibold">Tech Stack</h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-border bg-white/[0.02] px-3 py-1.5 text-xs text-foreground/80"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                {(project.links.live || project.links.repo) && (
                  <div className="flex flex-wrap gap-3 border-t border-border pt-6">
                    {project.links.live && (
                      <Button
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LuExternalLink size={16} /> Live Demo
                      </Button>
                    )}
                    {project.links.repo && (
                      <Button
                        href={project.links.repo}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
