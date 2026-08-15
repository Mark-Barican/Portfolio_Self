/**
 * Works out how light or dark the thing under a point is, so fixed chrome
 * (the cursor, the progress bar, the wordmark) can pick a contrasting colour.
 */

const CREAM = "#ebeada";
const INK = "#0a0a0a";

/** Parsed `rgb()` / `rgba()` value. */
interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

/* -------------------------------------------------------------------------- */
/*  Colour parsing                                                            */
/* -------------------------------------------------------------------------- */

/**
 * 1×1 scratch canvas used to resolve colour formats a regex cannot read.
 *
 * `willReadFrequently` keeps the surface in CPU memory, which is what makes
 * the `getImageData` below cheap rather than a GPU readback stall.
 */
const canvas =
  typeof document === "undefined" ? null : document.createElement("canvas");
const ctx = canvas?.getContext("2d", { willReadFrequently: true }) ?? null;

/**
 * Parsed colours, keyed by the exact computed string.
 *
 * The page draws from a fixed palette, so this saturates within the first
 * frame or two of scrolling and every later probe is a map lookup. Without it
 * the rasterising branch would run several times per frame.
 */
const colorCache = new Map<string, Rgba | null>();

function computeColor(value: string): Rgba | null {
  // Fast path. Most computed backgrounds on the page are already `rgb()` or
  // `rgba()`, and this avoids touching the canvas for them entirely.
  const match = value.match(
    /rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.%]+))?/i,
  );
  if (match) {
    const [, r, g, b, a] = match;
    let alpha = 1;
    if (a !== undefined) {
      alpha = a.endsWith("%") ? parseFloat(a) / 100 : parseFloat(a);
    }
    return { r: Number(r), g: Number(g), b: Number(b), a: alpha };
  }

  /* Everything else, by rasterising one pixel.
   *
   * **Tailwind v4 emits `oklab()` for every opacity-modified colour**, so
   * `bg-card/85` on the nav and `bg-accent/45` on a project row arrive here,
   * and the regex above returns nothing for them. The old implementation was
   * that regex alone, so it treated all of them as unparseable and skipped
   * them as though they were transparent.
   *
   * Reading `fillStyle` back does not help: the canvas accepts `oklab()` and
   * returns the *same* `oklab()` string rather than normalising it, so the
   * round trip is a no-op. Painting the colour and sampling the pixel is what
   * actually resolves it: verified against the nav, which rasterises to
   * [235, 234, 217] at alpha 0.851, exactly the cream it is authored as.
   *
   * An invalid colour leaves `fillStyle` untouched; seeding it transparent
   * first means such a value paints nothing and reports alpha 0, which every
   * caller already treats as "see through this". */
  if (!ctx) return null;
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = "rgba(0, 0, 0, 0)";
  ctx.fillStyle = value;
  ctx.fillRect(0, 0, 1, 1);

  const [r = 0, g = 0, b = 0, a = 0] = ctx.getImageData(0, 0, 1, 1).data;
  return { r, g, b, a: a / 255 };
}

function parseColor(value: string): Rgba | null {
  if (!value) return null;
  const cached = colorCache.get(value);
  if (cached !== undefined) return cached;
  const parsed = computeColor(value);
  colorCache.set(value, parsed);
  return parsed;
}

/** WCAG relative luminance, 0 (black) to 1 (white). */
function relativeLuminance({ r, g, b }: Rgba): number {
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/**
 * Returns true when the surface under (x, y) is dark enough that light chrome
 * reads better on it.
 *
 * Walks the hit-test stack and takes the first element painting a effectively
 * opaque background, so it picks up components (an ink button, the yellow CTA)
 * and not just section backgrounds. Elements can opt out of the guess with
 * `data-cursor-surface="dark" | "light"`: needed for images, whose pixels are
 * not readable from CSS.
 */
export function isDarkSurfaceAt(
  x: number,
  y: number,
  { surfacesOnly = false }: { surfacesOnly?: boolean } = {},
): boolean {
  if (typeof document === "undefined") return false;

  /* -- The page's four surface transitions, checked first. ------------------
   *
   * **`elementsFromPoint` cannot see any of them, and that was the bug.**
   *
   * Hit-testing skips anything with `pointer-events: none`, and every layer
   * that performs a surface change on this page has exactly that: the hero's
   * cream hand-off wash sets it inline, and all three `SurfaceEdge` bands
   * inherit it from `.layer-decoration`. So the walk below went straight past
   * the thing actually painting the screen and reported the *section's* own
   * colour instead. Measured: at the end of the hero exit, with the wash at
   * full opacity and the viewport entirely cream, the probe still answered
   * "dark", so the wordmark stayed cream on cream until the section boundary
   * itself went by, which is the exact lag this module was written to remove.
   *
   * These layers are therefore consulted explicitly, by geometry rather than
   * by hit-testing. They are marked `data-surface-layer` at the four call
   * sites, so this is a handful of rect reads, not a document scan, and it
   * stays correct *through* a transition rather than only at its ends: the
   * layer's own effective opacity is what decides whether it has taken the
   * screen, so the crossover happens at the halfway point of the paint it is
   * reading. Nothing here has to agree with a timeline, because it is
   * measuring the result the timeline produced.
   *
   * Later layers win, matching paint order for the overlapping case. */
  const layers = document.querySelectorAll<HTMLElement>("[data-surface-layer]");
  for (let i = layers.length - 1; i >= 0; i--) {
    const layer = layers[i];
    if (!layer) continue;
    const tone = layer.dataset.surfaceLayer;
    if (tone !== "ink" && tone !== "cream") continue;

    const rect = layer.getBoundingClientRect();
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      continue;
    }

    const style = getComputedStyle(layer);
    if (style.visibility === "hidden" || style.display === "none") continue;

    // Same effective-alpha test as below: these are scrubbed from 0, so the
    // handover lands halfway through the wash rather than the moment it exists.
    const color = parseColor(style.backgroundColor);
    const effective = (color?.a ?? 1) * Number(style.opacity || 1);
    if (effective >= 0.5) return tone === "ink";
  }

  const stack = document.elementsFromPoint(x, y);

  /* Section surfaces only, for chrome that sits at a fixed point.
   *
   * The walk below deliberately reads *whatever* is under the point, which is
   * what the cursor wants: crossing an ink button or the yellow CTA should
   * recolour the ring. Fixed chrome wants the opposite. The header probes one
   * spot near the top of the screen, and any content that happens to pass
   * under it is not the surface it is sitting on.
   *
   * Measured: the Stack's stage places cream tech cards at 43%, 46% and 56%
   * of the width, so scrolling that section drove four spurious light/dark
   * flips at the header line on a section that is uniformly dark. Resolving
   * each hit to its owning section instead answers "which surface am I over"
   * rather than "what object is here", which is the question being asked. */
  if (surfacesOnly) {
    for (const el of stack) {
      const declared = (el as HTMLElement).dataset?.cursorSurface;
      if (declared === "dark") return true;
      if (declared === "light") return false;

      const section = el.closest?.<HTMLElement>("[data-surface], section");
      if (!section) continue;
      if (section.dataset.surface === "dark") return true;

      const color = parseColor(getComputedStyle(section).backgroundColor);
      if (!color || color.a < 0.5) continue;
      return relativeLuminance(color) < 0.4;
    }
    return false;
  }

  for (const el of stack) {
    const declared = (el as HTMLElement).dataset?.cursorSurface;
    if (declared === "dark") return true;
    if (declared === "light") return false;

    const style = getComputedStyle(el);
    const color = parseColor(style.backgroundColor);
    if (!color) continue;

    /* Effective alpha, not the declared one.
     *
     * `backgroundColor` reports the authored colour and takes no account of
     * the element's own `opacity`, so a layer painted `bg-background` at
     * opacity 0.05 reports as fully opaque cream. That matters here because
     * the page's surface transitions are exactly that: an opaque colour on a
     * layer whose opacity is being scrubbed. Reading the declared alpha made
     * the header flip the instant a wash existed at all, rather than when it
     * had actually taken the screen.
     *
     * Folding `opacity` in puts the crossover at the halfway point of the
     * transition, which is where a reader would say the surface changed. */
    const effective = color.a * Number(style.opacity || 1);

    // Ignore transparent and near-transparent layers: they let whatever is
    // behind them show through, so they are not what is being sat on.
    if (effective >= 0.5) {
      return relativeLuminance(color) < 0.4;
    }
  }

  return false;
}

/** Foreground colour that contrasts with the surface under a point. */
export function contrastInkAt(x: number, y: number): string {
  return isDarkSurfaceAt(x, y) ? CREAM : INK;
}
