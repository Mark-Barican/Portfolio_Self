"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectCardCompact } from "@/components/ProjectCardCompact";
import { ProjectModal } from "@/components/ProjectModal";
import { ADDITIONAL_PROJECTS, FEATURED_PROJECTS } from "@/lib/data";
import type { Project } from "@/types";

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="projects" className="relative scroll-mt-24 py-24 sm:py-32">
      <Container>
        <SectionTitle
          index="01"
          eyebrow="Projects"
          title="Selected work."
          description="A few builds I'm proud of — from full-stack platforms to interactive 3D and cinematic brand sites. Click any card for the full story."
        />

        {/* Featured */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {FEATURED_PROJECTS.map((project, i) => (
            <Reveal key={project.id} delay={(i % 2) * 0.1}>
              <ProjectCard project={project} onOpen={setSelected} />
            </Reveal>
          ))}
        </div>

        {/* Additional */}
        {ADDITIONAL_PROJECTS.length > 0 && (
          <div className="mt-16">
            <Reveal>
              <h3 className="mb-6 flex items-center gap-3 text-sm font-medium tracking-[0.2em] text-muted uppercase">
                <span className="h-px w-8 bg-border" />
                More work
              </h3>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {ADDITIONAL_PROJECTS.map((project, i) => (
                <Reveal key={project.id} delay={(i % 2) * 0.08}>
                  <ProjectCardCompact project={project} onOpen={setSelected} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </Container>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
