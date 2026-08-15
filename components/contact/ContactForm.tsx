"use client";

import { useEffect, useState } from "react";
import { LuSend } from "react-icons/lu";
import { Toast } from "@/components/ui/Toast";

/** Min. gap between two sends from this browser (client-side contingency). */
const COOLDOWN_MS = 60_000;
const LAST_SENT_KEY = "mb-contact-last-sent";
const TOAST_MESSAGE =
  "Thanks for reaching out. Your message just landed in my inbox, and I'll get back to you within a day or two.";

type Status = "idle" | "submitting" | "error";

/**
 * Which surface the form is drawn on.
 *
 * The form now closes the page on ink rather than sitting mid-page on cream,
 * and every one of its resting colours was picked against bone. Rather than
 * dropping opacity on a wrapper, which would take the placeholder text below
 * a readable contrast ratio along with everything else: each tone names its
 * own values, so both are legible on their own ground.
 */
type Tone = "light" | "dark";

/**
 * Field styling. Underlined rather than boxed, so the form reads as part of
 * the page instead of a widget dropped onto it.
 *
 * The underline is 2px at rest and switches to the accent on focus, which is
 * an additional cue on top of the global focus ring rather than a replacement
 * for it: colour alone is never the only thing marking the focused field.
 */
const FIELD: Record<Tone, string> = {
  light:
    "border-ink/25 text-ink placeholder:text-faint focus:border-accent",
  dark: "border-cream/25 text-cream placeholder:text-cream/40 focus:border-accent",
};

const LABEL: Record<Tone, string> = {
  light: "text-muted",
  dark: "text-cream/55",
};

const SUBMIT: Record<Tone, string> = {
  light: "bg-ink text-cream",
  dark: "bg-accent text-ink",
};

/** Error copy has to clear 4.5:1 on its own surface, not just look red. */
const ERROR: Record<Tone, string> = {
  light: "text-red-800",
  dark: "text-red-300",
};

const fieldBase =
  "w-full border-0 border-b-2 bg-transparent px-0 py-3 text-lg transition-colors focus:outline-offset-4";

const labelBase = "eyebrow";

/**
 * The contact form.
 *
 * Posts to the existing `/api/contact` route, which is what talks to Resend.
 * The key never reaches the browser: this sends JSON to our own origin, the
 * route reads `RESEND_API_KEY` server-side and sends from there.
 *
 * Three guards against duplicate or junk submissions, all preserved from the
 * original implementation:
 *
 *   - the submit button is disabled while a request is in flight
 *   - a 60s per-browser cooldown, persisted so a reload does not clear it
 *   - a honeypot field that real users never see or fill
 *
 * The server enforces its own rate limit as well; this is the polite layer.
 */
export function ContactForm({ tone = "light" }: { tone?: Tone }) {
  const fieldClasses = `${fieldBase} ${FIELD[tone]}`;
  const labelClasses = `${labelBase} ${LABEL[tone]}`;

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const [toastSeq, setToastSeq] = useState(0);
  const [toastOpen, setToastOpen] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [now, setNow] = useState(0);

  // Restore any persisted cooldown from a previous send in this browser.
  useEffect(() => {
    const last = Number(localStorage.getItem(LAST_SENT_KEY) || 0);
    setNow(Date.now());
    if (last) setCooldownUntil(last + COOLDOWN_MS);
  }, []);

  // Tick a 1s countdown while cooling down.
  useEffect(() => {
    if (cooldownUntil <= Date.now()) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [cooldownUntil]);

  const cooldownLeft = Math.max(0, Math.ceil((cooldownUntil - now) / 1000));
  const onCooldown = now > 0 && cooldownLeft > 0;
  const submitting = status === "submitting";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Capture the form node now: `event.currentTarget` is nulled after the
    // first `await`, which would otherwise throw on `.reset()`.
    const form = event.currentTarget;

    if (onCooldown) {
      setStatus("error");
      setError(`Please wait ${cooldownLeft}s before sending another message.`);
      return;
    }

    setStatus("submitting");
    setError("");

    const formData = new FormData(form);
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
      form.reset();
      const ts = Date.now();
      localStorage.setItem(LAST_SENT_KEY, String(ts));
      setCooldownUntil(ts + COOLDOWN_MS);
      setNow(ts);
      setStatus("idle");
      setToastSeq((s) => s + 1);
      setToastOpen(true);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <>
      {/* `data-form-tone` is what the autofill rules in globals.css hang off:
          the browser paints its own background over an autofilled field, and
          overriding it needs to know which surface the field is sitting on. */}
      <form
        onSubmit={handleSubmit}
        data-form-tone={tone}
        className="flex flex-col gap-8 text-left"
      >
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className={labelClasses}>
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Jane Doe"
              className={fieldClasses}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className={labelClasses}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="jane@company.com"
              className={fieldClasses}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="message" className={labelClasses}>
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            placeholder="Tell me about your project"
            className={`${fieldClasses} resize-none`}
          />
        </div>

        {/* Honeypot. Hidden from users, catches bots. `sr-only` rather than
            display:none on purpose: a hidden field is skipped by some bots,
            while this one is present, focusable only out of band, and never
            announced thanks to aria-hidden. */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="sr-only"
        />

        {/* `role="alert"` on a live region that is always in the tree, so the
            message is announced when it appears rather than being missed. */}
        <p
          role="alert"
          aria-live="assertive"
          className={
            status === "error"
              ? `text-sm font-medium ${ERROR[tone]}`
              : "sr-only"
          }
        >
          {status === "error" ? error : ""}
        </p>

        <button
          type="submit"
          disabled={submitting || onCooldown}
          data-cursor="hover"
          className={`group inline-flex h-14 items-center justify-center gap-2.5 self-start overflow-hidden rounded-full px-8 text-base font-medium transition-[transform,opacity] duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.97] active:duration-75 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ${SUBMIT[tone]}`}
        >
          {submitting ? (
            <>
              <LuSend
                size={16}
                aria-hidden
                className="animate-[plane-launch_0.7s_ease-in-out_infinite]"
              />
              Sending
            </>
          ) : onCooldown ? (
            <>Please wait {cooldownLeft}s</>
          ) : (
            <>
              Send message
              <LuSend
                size={16}
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </>
          )}
        </button>
      </form>

      {toastOpen && (
        <Toast
          key={toastSeq}
          title="Message sent"
          message={TOAST_MESSAGE}
          onClose={() => setToastOpen(false)}
        />
      )}
    </>
  );
}
