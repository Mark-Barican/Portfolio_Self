"use client";

import { useEffect, useRef, useState } from "react";
import { LuCheck } from "react-icons/lu";

interface ToastProps {
  title?: string;
  /** Body text, revealed with a typewriter effect. */
  message: string;
  /** How long the toast lingers (ms) after it finishes typing. */
  duration?: number;
  /** Called once the exit animation has finished so the parent can unmount it. */
  onClose: () => void;
}

const TYPE_MS = 22; // per character
const ENTER_DELAY = 280; // let it slide in before typing
const EXIT_MS = 520; // slide-off duration

/**
 * Bottom-right notification pill. Slides in, types its message like a
 * typewriter, lingers for `duration`, then scoots off the right edge and calls
 * `onClose`. All timing is driven by plain timers so it always tears down.
 */
export function Toast({
  title = "Message sent",
  message,
  duration = 5000,
  onClose,
}: ToastProps) {
  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [typed, setTyped] = useState("");
  const [reduced, setReduced] = useState(false);
  const timers = useRef<number[]>([]);
  // Keep the latest onClose without making it a lifecycle dependency — the
  // parent re-renders (e.g. its cooldown countdown) must not restart the toast.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const isReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setReduced(isReduced);

    const push = (id: number) => timers.current.push(id);
    // Use a timer (not rAF) to trigger the slide-in so it can't get stuck
    // off-screen if rAF is throttled in a background tab.
    push(window.setTimeout(() => setEntered(true), 20));

    let typingMs = 0;
    if (isReduced) {
      setTyped(message);
    } else {
      typingMs = ENTER_DELAY + message.length * TYPE_MS;
      for (let i = 1; i <= message.length; i++) {
        push(
          window.setTimeout(
            () => setTyped(message.slice(0, i)),
            ENTER_DELAY + i * TYPE_MS,
          ),
        );
      }
    }

    push(window.setTimeout(() => setExiting(true), typingMs + duration));
    push(
      window.setTimeout(
        () => onCloseRef.current(),
        typingMs + duration + EXIT_MS,
      ),
    );

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [message, duration]);

  const totalMs = ENTER_DELAY + message.length * TYPE_MS + duration;
  const offscreen = !entered || exiting;

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[120] flex max-w-full justify-end sm:right-6 sm:bottom-6">
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-auto relative w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-accent/30 bg-card/90 p-4 shadow-elevated backdrop-blur-xl"
        style={{
          transform: offscreen ? "translateX(130%)" : "translateX(0)",
          opacity: offscreen ? 0 : 1,
          transition: `transform ${EXIT_MS}ms cubic-bezier(0.22,1,0.36,1), opacity 360ms ease`,
        }}
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
            <LuCheck size={17} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{title}</p>
            <p className="mt-0.5 text-sm leading-relaxed text-muted">
              {typed}
              {!reduced && typed.length < message.length && (
                <span className="ml-px inline-block h-4 w-[2px] translate-y-[3px] animate-pulse bg-accent align-middle" />
              )}
            </p>
          </div>
        </div>

        {/* Lifetime bar */}
        <span
          aria-hidden
          className="absolute bottom-0 left-0 h-[3px] w-full origin-left bg-gradient-to-r from-accent to-teal-light"
          style={
            reduced
              ? undefined
              : { animation: `toast-bar ${totalMs}ms linear forwards` }
          }
        />
      </div>
    </div>
  );
}
