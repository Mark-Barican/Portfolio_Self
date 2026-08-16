import type { ReactNode } from "react";
import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";
import { Container } from "@/components/ui/Container";
import { Footer } from "@/components/Footer";
import { SITE } from "@/lib/constants";

export interface Clause {
  heading: string;
  body: ReactNode;
}

interface LegalPageProps {
  eyebrow: string;
  /** Display title. Pass `<br />` for the stacked two-line setting. */
  title: ReactNode;
  /** Human-readable date, e.g. "15 August 2026". */
  updated: string;
  /** One paragraph under the title, before the clauses. */
  intro: string;
  clauses: Clause[];
}

/** `01 Scope` becomes `01-scope`, so each clause is linkable. */
const slug = (index: number, heading: string) =>
  `${String(index + 1).padStart(2, "0")}-${heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;

/**
 * Shared shell for the privacy and terms pages.
 *
 * Set on the ink surface rather than bone, so the document runs continuously
 * into the footer beneath it with no seam, and the fixed header resolves to its
 * light palette on its own.
 *
 * The clauses are passed as data rather than children because the page needs
 * them twice: once as the index in the left column and once as the document
 * itself. The index is `position: sticky`, so on a desktop it stays with the
 * reader through a long document; below `lg` it collapses to a plain list above
 * the text.
 *
 * All prose carries `data-selectable`. The site sets `user-select: none` for
 * the poster feel, which is wrong for a document someone may need to quote.
 */
export function LegalPage({
  eyebrow,
  title,
  updated,
  intro,
  clauses,
}: LegalPageProps) {
  return (
    <section
      data-surface="dark"
      className="relative isolate overflow-x-clip bg-ink-surface pt-28 pb-10 sm:pt-32"
    >
      <Container className="layer-content relative">
        {/* Masthead */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
          <span className="eyebrow text-accent">{eyebrow}</span>
          <span className="eyebrow text-cream/40">Updated {updated}</span>
        </div>

        <h1 className="font-display display-section mt-5 text-balance text-cream">
          {title}
        </h1>

        <p
          data-selectable
          className="mt-8 max-w-2xl border-t border-cream/15 pt-8 text-lg leading-relaxed text-pretty text-cream/70 sm:text-xl"
        >
          {intro}
        </p>

        {/* Index + document */}
        <div className="mt-14 grid gap-x-16 gap-y-10 lg:mt-16 lg:grid-cols-[14rem_1fr]">
          <nav aria-label="Contents" className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow text-cream/35">Contents</p>
            <ol className="mt-4 flex flex-col gap-2.5">
              {clauses.map((clause, i) => (
                <li key={clause.heading}>
                  <a
                    href={`#${slug(i, clause.heading)}`}
                    className="group flex items-baseline gap-3 text-sm text-cream/55 transition-colors duration-300 hover:text-cream"
                  >
                    <span className="eyebrow text-[0.6rem] text-cream/30 transition-colors duration-300 group-hover:text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="leading-snug">{clause.heading}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="min-w-0">
            {clauses.map((clause, i) => (
              <section
                key={clause.heading}
                id={slug(i, clause.heading)}
                className="scroll-mt-28 border-t border-cream/12 py-9 first:border-t-0 first:pt-0"
              >
                <div className="flex items-baseline gap-4">
                  <span className="eyebrow text-[0.66rem] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-display text-2xl text-cream sm:text-[1.7rem]">
                    {clause.heading}
                  </h2>
                </div>

                <div
                  data-selectable
                  className="mt-4 flex max-w-2xl flex-col gap-4 text-base leading-relaxed text-pretty text-cream/65 sm:text-lg"
                >
                  {clause.body}
                </div>
              </section>
            ))}

            <div className="flex flex-col gap-6 border-t border-cream/15 pt-9 sm:flex-row sm:items-center sm:justify-between">
              <p data-selectable className="text-base text-cream/65">
                Questions about this page? Write to{" "}
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-cream underline decoration-accent decoration-2 underline-offset-4"
                >
                  {SITE.email}
                </a>
                .
              </p>

              <Link
                href="/"
                className="group inline-flex w-fit items-center gap-2.5 bg-accent px-6 py-4 text-ink transition-transform duration-300 hover:-translate-y-0.5"
              >
                <LuArrowLeft
                  size={17}
                  aria-hidden
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                />
                <span className="text-[0.82rem] font-bold tracking-[0.14em] uppercase">
                  Back to site
                </span>
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </Container>
    </section>
  );
}
