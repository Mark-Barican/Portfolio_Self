import { LuArrowUp } from "react-icons/lu";
import { Container } from "@/components/ui/Container";
import { BUILT_WITH, SOCIAL_LINKS } from "@/lib/data";
import { NAV_SECTIONS, SITE } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border py-14">
      <Container>
        <div className="flex flex-col gap-10">
          {/* Top row */}
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
            <div className="max-w-sm">
              <a
                href="#home"
                className="inline-flex items-center gap-2 text-sm font-semibold"
              >
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card">
                  <span className="text-gradient">MB</span>
                </span>
                Mark Barican
              </a>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {SITE.role} based in {SITE.location}. Building premium web
                experiences, end to end.
              </p>
            </div>

            <nav
              aria-label="Footer"
              className="grid grid-cols-2 gap-x-12 gap-y-2"
            >
              {NAV_SECTIONS.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Bottom row */}
          <div className="flex flex-col items-start justify-between gap-6 border-t border-border pt-8 sm:flex-row sm:items-center">
            <p className="text-xs text-muted">
              © {year} {SITE.name}. All rights reserved.
            </p>

            <div className="flex items-center gap-2 text-xs text-muted">
              <span>Built with</span>
              {BUILT_WITH.map((tech) => {
                const Icon = tech.icon;
                return (
                  <span
                    key={tech.name}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white/[0.02] px-2 py-1"
                  >
                    <Icon size={13} />
                    {tech.name}
                  </span>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted transition-colors hover:border-accent/40 hover:text-accent"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
              <a
                href="#home"
                aria-label="Back to top"
                className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted transition-colors hover:border-accent/40 hover:text-accent"
              >
                <LuArrowUp size={16} />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
