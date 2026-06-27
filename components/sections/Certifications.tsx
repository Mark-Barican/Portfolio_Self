import { LuBadgeCheck } from "react-icons/lu";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { CERTIFICATIONS } from "@/lib/data";

export function Certifications() {
  return (
    <section className="relative scroll-mt-24 py-24 sm:py-32">
      <Container>
        <SectionTitle
          index="05"
          eyebrow="Certifications"
          title="Credentials & continued learning."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CERTIFICATIONS.map((cert, i) => {
            const Icon = cert.icon;
            return (
              <Reveal key={`${cert.issuer}-${cert.title}`} delay={i * 0.07}>
                <div className="group flex h-full flex-col gap-4 rounded-2xl border border-border bg-card/40 p-6 transition-colors hover:border-accent/30">
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-white/[0.03] text-foreground/80 transition-colors group-hover:text-accent">
                      <Icon size={20} />
                    </span>
                    <LuBadgeCheck
                      size={18}
                      className="text-muted/50 transition-colors group-hover:text-accent"
                    />
                  </div>
                  <div>
                    <p className="text-xs tracking-[0.18em] text-accent-hover uppercase">
                      {cert.issuer}
                    </p>
                    <p className="mt-1 leading-snug font-medium">
                      {cert.title}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
