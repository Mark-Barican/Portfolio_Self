import type { Metadata } from "next";
import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";
import { NAV_SECTIONS, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/**
 * Custom 404: an oversized outlined "404" in the display face, a short
 * explanation, and shortcuts back into the page's real sections.
 */
export default function NotFound() {
  return (
    <section className="flex min-h-svh flex-col justify-center overflow-hidden py-28">
      <div className="mx-auto w-full max-w-[90rem] px-5 sm:px-8">
        <span className="eyebrow text-muted">Error 404</span>

        <h1 className="font-display display-hero mt-4 text-ink">
          <span className="block animate-rise">Page</span>
          <span
            className="block animate-rise text-outline"
            style={{ animationDelay: "0.1s" }}
          >
            Not Found
          </span>
        </h1>

        <div className="mt-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-lg text-xl leading-relaxed text-pretty text-muted">
            This one drifted off into the void. Everything that does exist lives
            on the home page.
          </p>

          <Link
            href="/"
            className="group inline-flex w-fit items-center gap-2 rounded-full bg-ink px-7 py-4 text-base font-medium text-cream transition-transform hover:-translate-y-0.5"
          >
            <LuArrowLeft
              size={17}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Back to home
          </Link>
        </div>

        {/* Section shortcuts. Plain anchors, not <Link>: a full navigation
            lets the browser resolve the hash itself, which is reliable across
            a route change in a way client-side hash routing is not. */}
        <nav aria-label="Site sections" className="mt-16">
          <ul className="flex flex-wrap gap-2">
            {NAV_SECTIONS.filter((s) => s.id !== "home").map((section) => (
              <li key={section.id}>
                <a
                  href={`/${section.href}`}
                  className="eyebrow inline-flex rounded-full border-2 border-ink px-4 py-2.5 text-ink transition-colors hover:bg-accent"
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="eyebrow mt-16 text-faint">
          {SITE.name} · {SITE.location}
        </p>
      </div>
    </section>
  );
}
