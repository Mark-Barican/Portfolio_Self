"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LuCheck,
  LuCopy,
  LuDownload,
  LuLoaderCircle,
  LuSend,
} from "react-icons/lu";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Magnetic } from "@/components/ui/Magnetic";
import { SOCIAL_LINKS } from "@/lib/data";
import { LINKS, SITE } from "@/lib/constants";

type Status = "idle" | "submitting" | "success" | "error";

function CopyEmailButton() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be unavailable (e.g. insecure context) — fail silently.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      data-cursor="hover"
      className="group inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-4 py-2 text-sm text-muted transition-colors hover:border-accent/40 hover:text-foreground"
      aria-label={copied ? "Email copied" : "Copy email address"}
    >
      {copied ? (
        <LuCheck size={15} className="text-accent" />
      ) : (
        <LuCopy size={15} />
      )}
      <span className="font-mono">{copied ? "Copied!" : SITE.email}</span>
    </button>
  );
}

const inputClasses =
  "w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted/60 transition-colors focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/30";

function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
      company: String(formData.get("company") ?? ""), // honeypot
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error ?? "Something went wrong.");
      }
      setStatus("success");
      event.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-accent/30 bg-accent/[0.06] p-8 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-accent/15 text-accent">
          <LuCheck size={22} />
        </span>
        <p className="text-lg font-medium">Message sent!</p>
        <p className="text-sm text-muted">
          Thanks for reaching out — I&apos;ll get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-1 text-sm text-accent-hover hover:underline"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-xs font-medium text-muted">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Jane Doe"
            className={inputClasses}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-medium text-muted">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="jane@company.com"
            className={inputClasses}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-xs font-medium text-muted">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="Tell me about your project…"
          className={`${inputClasses} resize-none`}
        />
      </div>

      {/* Honeypot — hidden from users, catches bots. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="sr-only"
      />

      {status === "error" && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        data-cursor="hover"
        className="group mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-black shadow-[0_8px_30px_-8px_rgba(254,127,45,0.65)] transition-all duration-300 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "submitting" ? (
          <>
            <LuLoaderCircle size={17} className="animate-spin" />
            Sending…
          </>
        ) : (
          <>
            Send message
            <LuSend
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </>
        )}
      </button>
    </form>
  );
}

export function Contact() {
  return (
    <section id="contact" className="relative scroll-mt-24 py-24 sm:py-32">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card/40 px-6 py-14 sm:px-10 sm:py-16">
            {/* Ambient glow */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(60% 60% at 50% 0%, rgba(254,127,45,0.18), transparent 70%)",
              }}
            />

            <div className="relative grid gap-10 lg:grid-cols-2 lg:gap-14">
              {/* Left: pitch */}
              <div className="flex flex-col gap-6">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-white/[0.03] px-3 py-1.5 text-xs text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Open to work & collaborations
                </span>

                <h2 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                  Let&apos;s build something{" "}
                  <span className="text-gradient">premium</span>.
                </h2>

                <p className="max-w-md leading-relaxed text-pretty text-muted">
                  Have a product in mind or a build that needs an owner from
                  requirements to deployment? Send a note — or reach me
                  directly.
                </p>

                <CopyEmailButton />

                <div className="mt-2 flex flex-wrap items-center gap-3">
                  {SOCIAL_LINKS.map((link) => {
                    const Icon = link.icon;
                    return (
                      <motion.a
                        key={link.label}
                        href={link.href}
                        target={
                          link.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel="noopener noreferrer"
                        whileHover={{ y: -3 }}
                        data-cursor="hover"
                        className="flex items-center gap-2 rounded-xl border border-border bg-white/[0.03] px-4 py-2.5 text-sm text-muted transition-colors hover:border-accent/40 hover:text-foreground"
                      >
                        <Icon size={17} />
                        {link.label}
                      </motion.a>
                    );
                  })}
                  <Magnetic>
                    <a
                      href={LINKS.resume}
                      download
                      data-cursor="hover"
                      className="flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-4 py-2.5 text-sm text-accent-hover transition-colors hover:bg-accent/15"
                    >
                      <LuDownload size={17} />
                      Resume
                    </a>
                  </Magnetic>
                </div>
              </div>

              {/* Right: form */}
              <div className="rounded-2xl border border-border bg-background/40 p-6 sm:p-7">
                <ContactForm />
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
