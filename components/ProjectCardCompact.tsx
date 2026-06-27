"use client";

import { motion } from "framer-motion";
import { LuArrowUpRight } from "react-icons/lu";
import type { Project } from "@/types";

interface ProjectCardCompactProps {
  project: Project;
  onOpen: (project: Project) => void;
}

/** Condensed row-style card for the secondary "more work" grid. */
export function ProjectCardCompact({
  project,
  onOpen,
}: ProjectCardCompactProps) {
  const Icon = project.icon;
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(project)}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      data-cursor="hover"
      className="group flex w-full items-center gap-4 rounded-2xl border border-border bg-card/40 p-4 text-left transition-colors hover:border-accent/30 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
    >
      {/* Accent icon chip */}
      <span
        aria-hidden
        className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/10 text-white"
        style={{
          backgroundImage: `linear-gradient(135deg, ${project.accent[0]}, ${project.accent[1]})`,
        }}
      >
        <Icon size={20} />
      </span>

      <div className="min-w-0 flex-1">
        <h4 className="truncate font-medium tracking-tight">{project.title}</h4>
        <p className="truncate text-sm text-muted">{project.tagline}</p>
      </div>

      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border text-muted transition-all duration-300 group-hover:border-accent/40 group-hover:text-accent">
        <LuArrowUpRight size={16} />
      </span>
    </motion.button>
  );
}
