"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuArrowUp } from "react-icons/lu";
import { Logo } from "@/components/Logo";
import { TechTooltip } from "@/components/ui/TechTooltip";
import { BUILT_WITH, SOCIAL_LINKS } from "@/lib/data";
import { LEGAL_LINKS, NAV_SECTIONS, SITE } from "@/lib/constants";
import { useMagnetic } from "@/hooks/useMagnetic";

/**
 * The page's closing band: wordmark, section nav, socials, credit and colophon.
 *
 * Lifted out of `Contact` so the legal pages can end the same way the home page
 * does. It keeps its `data-foot-*` hooks, which the contact section's scrubbed
 * scene still animates when the footer is rendered inside it; on a route with
 * no such scene the elements simply sit at rest.
 *
 * Section links resolve against the current route. On the home page they are
 * bare hashes so the browser scrolls; anywhere else they are prefixed with `/`
 * so they navigate home and then scroll.
 */
export function Footer() {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const year = new Date().getFullYear();

  // Owns the magnetic hover for the social discs and the back-to-top control,
  // which are the only `data-magnetic` targets in this band.
  useMagnetic(ref);

  const onHome = pathname === "/";
  const to = (hash: string) => (onHome ? hash : `/${hash}`);

  return (
    <div ref={ref} data-contact-foot className="mt-16 sm:mt-20">
      <div data-foot-rule aria-hidden className="h-px w-full bg-cream/20" />

      <div className="flex flex-col justify-between gap-10 pt-10 lg:flex-row lg:items-start">
        <div data-foot-part className="max-w-sm">
          <a
            href={to("#home")}
            className="inline-block text-cream"
            aria-label={`${SITE.shortName}, back to top`}
          >
            <Logo title={null} className="h-10 w-auto" />
          </a>
          <p className="mt-4 text-base leading-relaxed text-cream/60">
            {SITE.role} based in {SITE.location}. Building web experiences that
            look and work exactly how you imagined, end to end.
          </p>
        </div>

        {/* `py-2` on each link rather than gap between them: spaced-caps type
            is only ~17px tall, under any reasonable touch target. */}
        <nav
          data-foot-part
          aria-label="Footer"
          className="grid grid-cols-2 gap-x-8 sm:gap-x-14"
        >
          {NAV_SECTIONS.map((item) => (
            <a
              key={item.id}
              href={to(item.href)}
              data-link="nav"
              className="eyebrow py-2 text-cream/60 transition-colors duration-300 hover:text-cream"
            >
              <span className="link-label">{item.label}</span>
            </a>
          ))}
        </nav>

        <div data-foot-part className="flex flex-wrap items-center gap-3">
          {SOCIAL_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={link.label}
                data-link="social"
                data-magnetic
                className="grid h-11 w-11 place-items-center rounded-full border border-cream/25 text-cream/70 transition-colors hover:border-accent hover:text-accent"
              >
                <Icon size={17} aria-hidden />
              </a>
            );
          })}
          <a
            href={to("#home")}
            aria-label="Back to top"
            data-cursor="hover"
            data-magnetic
            className="grid h-11 w-11 place-items-center rounded-full bg-accent text-ink"
          >
            <LuArrowUp size={17} aria-hidden />
          </a>
        </div>
      </div>

      <div
        data-foot-part
        className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-cream/12 pt-5 sm:flex-row sm:items-center"
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <p className="eyebrow text-cream/50">
            © {year} {SITE.name}. All rights reserved.
          </p>

          <nav
            aria-label="Legal"
            className="flex flex-wrap items-center gap-x-6"
          >
            {LEGAL_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-link="nav"
                aria-current={pathname === item.href ? "page" : undefined}
                className="eyebrow py-1 text-cream/50 transition-colors duration-300 hover:text-cream aria-[current=page]:text-cream"
              >
                <span className="link-label">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Marks only, each with a tooltip naming it and the job it does. */}
        <ul className="flex flex-wrap items-center gap-x-1 gap-y-2">
          <li aria-hidden className="eyebrow mr-3 text-cream/35">
            Built with
          </li>
          {BUILT_WITH.map((tech) => (
            <li key={tech.name}>
              <TechTooltip name={tech.name} role={tech.role} icon={tech.icon} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
