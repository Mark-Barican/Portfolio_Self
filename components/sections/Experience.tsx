"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { LuChevronDown, LuMapPin } from "react-icons/lu";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { EXPERIENCE } from "@/lib/data";
import type { ExperienceItem } from "@/types";
import { cn } from "@/lib/utils";

function TimelineEntry({
  item,
  index,
  defaultOpen,
}: {
  item: ExperienceItem;
  index: number;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `exp-panel-${item.id}`;
  const Icon = item.icon;

  return (
    <Reveal as="li" delay={index * 0.05} className="relative pl-12 sm:pl-16">
      {/* Node — company icon placeholder */}
      <span className="absolute top-1.5 left-0 ml-[1px] grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full border border-border bg-card text-accent">
        <Icon size={16} />
      </span>

      <div
        className={cn(
          "overflow-hidden rounded-2xl border bg-card/40 transition-colors",
          open ? "border-accent/30" : "border-border hover:border-white/15",
        )}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-start justify-between gap-4 p-5 text-left sm:p-6"
        >
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h3 className="text-base font-semibold tracking-tight sm:text-lg">
                {item.role}
              </h3>
            </div>
            <p className="text-sm text-accent-hover">
              {item.company}
              {item.type && <span className="text-muted"> · {item.type}</span>}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
              <span className="font-mono">{item.period}</span>
              {item.location && (
                <span className="inline-flex items-center gap-1">
                  <LuMapPin size={12} />
                  {item.location}
                </span>
              )}
            </div>
          </div>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="mt-1 shrink-0 text-muted"
          >
            <LuChevronDown size={20} />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={panelId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <div className="border-t border-border px-5 pt-5 pb-6 sm:px-6">
                <ul className="flex flex-col gap-3">
                  {item.highlights.map((highlight, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      <span className="leading-relaxed">{highlight}</span>
                    </li>
                  ))}
                </ul>
                {item.stack && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-border bg-white/[0.02] px-2.5 py-1 text-xs text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 60%"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section id="experience" className="relative scroll-mt-24 py-24 sm:py-32">
      <Container>
        <SectionTitle
          index="02"
          eyebrow="Experience"
          title="Where I've shipped real work."
          description="From solo freelance engagements to e-commerce teams and game studios — a track record of owning delivery."
        />

        <div ref={ref} className="relative mt-14">
          {/* Static rail */}
          <div className="absolute top-0 bottom-0 left-0 w-px translate-x-[1px] bg-border" />
          {/* Animated progress rail */}
          <motion.div
            style={{ scaleY }}
            className="absolute top-0 bottom-0 left-0 w-px origin-top translate-x-[1px] bg-gradient-to-b from-accent to-accent-hover"
          />

          <ul className="flex flex-col gap-6">
            {EXPERIENCE.map((item, i) => (
              <TimelineEntry
                key={item.id}
                item={item}
                index={i}
                defaultOpen={i === 0}
              />
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
