import type { Metadata } from "next";
import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="flex min-h-[100svh] items-center">
      <Container className="flex flex-col items-center gap-6 text-center">
        <p className="font-mono text-sm tracking-[0.3em] text-accent uppercase">
          Error 404
        </p>
        <h1 className="text-7xl font-semibold tracking-tight sm:text-9xl">
          <span className="text-gradient">404</span>
        </h1>
        <p className="max-w-md text-pretty text-muted">
          This page drifted off into the void. Let&apos;s get you back to
          something solid.
        </p>
        <Link
          href="/"
          className="group inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-black transition-colors hover:bg-accent-hover"
        >
          <LuArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          Back to home
        </Link>
      </Container>
    </section>
  );
}
