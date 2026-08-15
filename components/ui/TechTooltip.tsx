"use client";

import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { IconType } from "react-icons";

/** Gap between the trigger and the tooltip, in px. */
const OFFSET = 12;
/** Keep-out margin from the viewport edges, in px. */
const EDGE = 8;

interface Placement {
  x: number;
  y: number;
  /** Which side of the trigger it ended up on, for the entrance direction. */
  below: boolean;
}

/**
 * A technology mark with a custom tooltip naming it and what it does here.
 *
 * **Rendered in a portal, deliberately.** The marks sit in the closing
 * section's colophon row, and every ancestor of that row, the section itself,
 * carries `overflow: clip` so oversized decoration can be cropped. A tooltip
 * positioned inside that subtree is cropped by the same rule, which is the
 * usual reason a popover appears to be cut in half. Portalling to `body` takes
 * it out of that containing block entirely, so no ancestor's overflow, stacking
 * context or transform can reach it.
 *
 * **Position is measured, not guessed.** On open it reads the trigger's rect
 * and places itself above, flipping below when there is not enough room, then
 * clamps horizontally so it can never cross a viewport edge. Because it is
 * fixed-positioned from a measured rect it also cannot cover its own trigger,
 * and it is offset far enough not to sit on the neighbouring marks.
 *
 * **Touch.** The mark is a real `<button>` and the tooltip opens on focus as
 * well as hover, so it is reachable by keyboard and by tap rather than being
 * hover-only information. The name is also on the button's accessible label
 * regardless, so nothing here is available *only* through the tooltip.
 */
export function TechTooltip({
  name,
  role,
  icon: Icon,
}: {
  name: string;
  role: string;
  icon: IconType;
}) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const [place, setPlace] = useState<Placement | null>(null);

  const open = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const r = trigger.getBoundingClientRect();

    // Measured on the first open from the rendered tooltip when available, and
    // otherwise from a conservative estimate: the clamp below makes an
    // imperfect first frame safe rather than off-screen.
    const tip = tipRef.current?.getBoundingClientRect();
    const w = tip?.width ?? 190;
    const h = tip?.height ?? 62;

    const below = r.top - h - OFFSET < EDGE;
    const y = below ? r.bottom + OFFSET : r.top - h - OFFSET;

    const centred = r.left + r.width / 2 - w / 2;
    const x = Math.min(
      Math.max(centred, EDGE),
      Math.max(EDGE, window.innerWidth - w - EDGE),
    );

    setPlace({ x, y, below });
  }, []);

  const close = useCallback(() => setPlace(null), []);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        // The tooltip repeats and expands on this label rather than being the
        // only place the information exists.
        aria-label={`${name}: ${role}`}
        onPointerEnter={open}
        onPointerLeave={close}
        onFocus={open}
        onBlur={close}
        onClick={() => (place ? close() : open())}
        className="grid h-9 w-9 place-items-center rounded-md text-cream/45 transition-colors duration-300 hover:text-cream focus-visible:text-cream"
      >
        <Icon size={18} aria-hidden />
      </button>

      {place !== null &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={tipRef}
            role="tooltip"
            style={{ left: place.x, top: place.y }}
            className={`pointer-events-none fixed z-[300] w-max max-w-[14rem] rounded-lg border border-cream/20 bg-ink-surface px-3.5 py-2.5 shadow-lifted ${
              place.below ? "animate-tip-down" : "animate-tip-up"
            }`}
          >
            <p className="text-[0.82rem] leading-tight font-semibold text-cream">
              {name}
            </p>
            <p className="mt-0.5 text-[0.72rem] leading-tight text-cream/55">
              {role}
            </p>
          </div>,
          document.body,
        )}
    </>
  );
}
