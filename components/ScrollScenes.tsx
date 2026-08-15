"use client";

import { useEffect } from "react";
import { refreshWhenSettled } from "@/lib/scroll";

/**
 * Recomputes every scroll scene's measurements once the page's assets settle.
 *
 * Renders nothing. It exists because scenes are built during layout effects,
 * at a moment when the document's height is not yet final: Archivo is still
 * swapping in (and it sets every display heading on the page, so its metrics
 * move a lot of pixels), and lazily-loaded images below the fold have no
 * intrinsic height reserved yet.
 *
 * Both land *after* the ScrollTriggers measured the page, which leaves every
 * start and end pointing at a scroll offset that has since moved. That is the
 * usual cause of a scene that fires visibly early or late on a cold load but is
 * perfectly placed again after a resize: the resize is what triggers the
 * refresh that should have happened at load.
 *
 * Mounted once from the root layout, so this costs one listener for the whole
 * page rather than one per scene.
 */
export function ScrollScenes() {
  useEffect(refreshWhenSettled, []);
  return null;
}
