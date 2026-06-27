import { LuGraduationCap, LuMapPin, LuQuote } from "react-icons/lu";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Badge } from "@/components/ui/Badge";
import { EDUCATION, LANGUAGES, STATS, SUMMARY } from "@/lib/data";
import { SITE } from "@/lib/constants";

export function About() {
  return (
    <section id="about" className="relative scroll-mt-24 py-24 sm:py-32">
      <Container>
        <SectionTitle
          index="04"
          eyebrow="About"
          title="A developer who ships, end to end."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Profile placeholder */}
          <Reveal className="lg:col-span-5" direction="right">
            {/* TODO: Replace this placeholder with a real portrait —
                drop the image in /public and swap in next/image. */}
            <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-card">
              <div
                className="absolute inset-0 opacity-90"
                style={{
                  background:
                    "radial-gradient(120% 90% at 20% 10%, rgba(254,127,45,0.30), transparent 55%), radial-gradient(120% 90% at 90% 100%, rgba(53,81,99,0.45), transparent 55%)",
                }}
              />
              <div className="grid-pattern absolute inset-0 opacity-40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <span className="text-gradient text-7xl font-semibold tracking-tight">
                  MB
                </span>
                <span className="font-mono text-xs tracking-[0.25em] text-muted uppercase">
                  Mark Barican
                </span>
              </div>
              <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between rounded-xl border border-border bg-background/60 px-4 py-3 backdrop-blur">
                <span className="flex items-center gap-2 text-sm text-muted">
                  <LuMapPin size={15} className="text-accent" />
                  {SITE.location}
                </span>
                <span className="text-xs font-medium text-accent-hover">
                  CS @ CIIT
                </span>
              </div>
            </div>
          </Reveal>

          {/* Summary + stats */}
          <div className="flex flex-col gap-10 lg:col-span-7">
            <Reveal>
              <div className="relative rounded-3xl border border-border bg-card/40 p-7 sm:p-9">
                <LuQuote
                  className="absolute -top-3 left-7 text-accent/40"
                  size={34}
                />
                <p className="text-lg leading-relaxed text-pretty text-foreground/80 sm:text-xl">
                  {SUMMARY}
                </p>
              </div>
            </Reveal>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {STATS.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 0.08}>
                  <div className="h-full rounded-2xl border border-border bg-card/40 p-5 transition-colors hover:border-accent/30">
                    <div className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                      <AnimatedCounter
                        value={stat.value}
                        suffix={stat.suffix}
                      />
                    </div>
                    <div className="mt-1 text-sm text-muted">{stat.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Education + languages */}
            <Reveal>
              <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card/40 p-6">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-white/[0.03] text-accent">
                    <LuGraduationCap size={18} />
                  </span>
                  <div>
                    <p className="font-medium">{EDUCATION.degree}</p>
                    <p className="text-sm text-muted">
                      {EDUCATION.school} · {EDUCATION.location}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted">Languages:</span>
                  {LANGUAGES.map((lang) => (
                    <Badge key={lang.name}>
                      {lang.name}
                      <span className="text-muted/70">· {lang.level}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
