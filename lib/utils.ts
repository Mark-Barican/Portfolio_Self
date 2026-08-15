/**
 * Lightweight className combiner. Filters falsy values so we can write
 * conditional classes without pulling in a dependency.
 *
 * @example cn("px-4", isActive && "text-accent", undefined) // "px-4 text-accent"
 */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Coalesces bursts of scroll/resize events into at most one `callback` per
 * animation frame, so layout reads happen once per paint instead of per event.
 *
 * Falls back to a timer while the document is hidden: browsers suspend
 * requestAnimationFrame in background tabs, which would otherwise leave the
 * callback un-run until the tab is focused again.
 */
export function createFrameScheduler(callback: () => void) {
  let frame = 0;
  let timer = 0;

  const run = () => {
    // Whichever of the two scheduled this, retire both so the other cannot
    // fire a duplicate call for the same burst.
    if (frame) cancelAnimationFrame(frame);
    if (timer) clearTimeout(timer);
    frame = 0;
    timer = 0;
    callback();
  };

  const schedule = () => {
    if (typeof document !== "undefined" && document.hidden) {
      if (!timer) timer = window.setTimeout(run, 100);
      return;
    }
    if (!frame) frame = requestAnimationFrame(run);

    /* Safety net for frames that never arrive.
     *
     * `document.hidden` covers a backgrounded tab, but it is not the only way
     * to stop getting frames: an embedded or occluded view can keep the
     * document "visible" while the compositor produces nothing, and then the
     * rAF above never fires and the callback is stranded until the view is
     * shown again. For the chrome's surface probe that means the wordmark
     * holds whatever colour it had when frames stopped.
     *
     * This is not a second animation loop, it is a one-shot timer per
     * scheduled callback, cancelled by `run` the instant a real frame lands,
     * so in the normal case it costs one `clearTimeout` and never executes. */
    if (!timer) timer = window.setTimeout(run, 250);
  };

  const cancel = () => {
    if (frame) cancelAnimationFrame(frame);
    if (timer) clearTimeout(timer);
    frame = 0;
    timer = 0;
  };

  return { schedule, cancel };
}
