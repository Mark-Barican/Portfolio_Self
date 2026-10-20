"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { LuArrowLeft, LuArrowRight, LuX } from "react-icons/lu";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";
import type { Screenshot } from "@/types";

interface ScreenshotViewerProps {
  shots: Screenshot[];
  open: boolean;
  onClose: () => void;
}

/** The round control the journey cards already use, in the card's colours. */
const CONTROL =
  "grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-ink transition-transform hover:scale-105";

/**
 * A screenshot viewer for the journey cards: the trail shows a card's shots in
 * passing, this shows them whole.
 *
 * Built on the same lines as `ProjectModal`, for the same reasons: portalled to
 * `body` so no section's stacking context can rank it under the header,
 * mounted until its exit has played, Esc to close and the page locked behind
 * it. It sits at z-160, over the trail's own layer (z-150), so a frame still
 * fading out from the click that opened it cannot paint across the dialog.
 *
 * Every shot is mounted at once and cross-faded rather than swapped, so
 * stepping to the next one never waits on a load.
 */
export function ScreenshotViewer({ shots, open, onClose }: ScreenshotViewerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduced = usePrefersReducedMotion();

  // Lags `open` by one exit animation, so the dialog never animates out empty.
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  // No `body` to portal into on the server; see `ProjectModal`.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    setIndex(0);
    setVisible(true);
  }, [open]);

  useEffect(() => {
    if (!visible) return;
    const root = rootRef.current;
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!root || !panel || !backdrop) return;

    const d = reduced ? 0 : 1;
    const tl = gsap.timeline();

    if (open) {
      // Focused here rather than with the key handling, which runs on the
      // render that flips `open`, one before the dialog exists. Shown with a
      // plain `set` first, not on the timeline: that only applies on the next
      // tick, and a `visibility: hidden` element cannot take focus.
      gsap.set(root, { autoAlpha: 1 });
      closeRef.current?.focus();
      tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.25 * d }, 0)
        .fromTo(
          panel,
          { y: 40, opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, duration: 0.45 * d, ease: "power3.out" },
          0,
        );
    } else {
      tl.to(
        panel,
        { y: 30, opacity: 0, scale: 0.98, duration: 0.25 * d, ease: "power2.in" },
        0,
      )
        .to(backdrop, { opacity: 0, duration: 0.25 * d }, 0)
        .set(root, { autoAlpha: 0 })
        .call(() => setVisible(false));
    }

    return () => {
      tl.kill();
    };
  }, [open, visible, reduced]);

  const count = shots.length;
  const step = useCallback(
    (by: number) => setIndex((i) => (i + by + count) % count),
    [count],
  );

  // Esc and the arrow keys, the page locked behind it, and focus handed back
  // to whatever opened it once it closes.
  useEffect(() => {
    if (!open) return;
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      opener?.focus({ preventScroll: true });
    };
  }, [open, onClose, step]);

  if (!visible || !mounted) return null;

  const current = shots[index];

  return createPortal(
    <div
      ref={rootRef}
      className="invisible fixed inset-0 z-[160] flex items-center justify-center p-4 opacity-0 sm:p-8"
    >
      <button
        ref={backdropRef}
        type="button"
        aria-label="Close screenshots"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-md"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Screenshots"
        className="relative z-10 w-full max-w-6xl"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          data-cursor="hover"
          className={cn(
            CONTROL,
            "absolute -top-4 -right-2 z-20 bg-accent text-ink sm:-top-5 sm:-right-5",
          )}
        >
          <LuX size={20} />
        </button>

        <figure>
          <div className="relative aspect-[2/1] overflow-hidden rounded-2xl border-2 border-ink bg-card">
            {shots.map((shot, i) => (
              <Image
                key={shot.src}
                src={shot.src}
                alt={shot.caption}
                fill
                sizes="(max-width: 1200px) 100vw, 1152px"
                quality={90}
                aria-hidden={i !== index}
                className={cn(
                  "object-cover object-top transition-opacity duration-500",
                  i === index ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
          </div>

          {/* Caption and controls share a row from `sm`. On a phone the two
              cannot fit side by side, so the controls take a row of their
              own, counter left and arrows right, rather than squeezing the
              caption and the counter onto two lines each. */}
          <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
            <span className="eyebrow text-cream">{current?.caption}</span>

            <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-start">
              <span className="eyebrow whitespace-nowrap text-cream/60 tabular-nums">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(count).padStart(2, "0")}
              </span>
              {count > 1 && (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous screenshot"
                    data-cursor="hover"
                    className={cn(CONTROL, "bg-card text-ink")}
                  >
                    <LuArrowLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next screenshot"
                    data-cursor="hover"
                    className={cn(CONTROL, "bg-card text-ink")}
                  >
                    <LuArrowRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </figcaption>
        </figure>
      </div>
    </div>,
    document.body,
  );
}
