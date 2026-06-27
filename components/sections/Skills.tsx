"use client";

import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import GlassIcons from "@/components/reactbits/GlassIcons";
import { SKILL_CATEGORIES } from "@/lib/data";

/** Each category gets a theme-harmonious glass colour (orange + teal family). */
const CATEGORY_COLORS = [
  "orange",
  "teal",
  "amber",
  "steel",
  "sand",
  "deep",
] as const;

export function Skills() {
  return (
    <section id="skills" className="relative scroll-mt-24 py-24 sm:py-32">
      <Container>
        <SectionTitle
          index="03"
          eyebrow="Skills"
          title="A modern toolkit, used in production."
          description="Grouped by where they live in the stack — hover any logo to see what it is. The tools I reach for to design, build, ship and maintain real products."
        />

        <div className="mt-14 flex flex-col gap-6">
          {SKILL_CATEGORIES.map((category, i) => (
            <Reveal key={category.title} delay={(i % 2) * 0.06}>
              <div className="rounded-3xl border border-border bg-card/40 p-6 transition-colors hover:border-white/15 sm:p-8">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {category.title}
                  </h3>
                  <p className="text-sm text-muted">{category.description}</p>
                </div>

                <GlassIcons
                  items={category.skills.map((skill) => {
                    const Icon = skill.icon;
                    return {
                      icon: <Icon aria-hidden />,
                      color:
                        CATEGORY_COLORS[i % CATEGORY_COLORS.length] ?? "orange",
                      label: skill.name,
                    };
                  })}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
