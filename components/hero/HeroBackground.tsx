import { ConstellationGrid } from "@/components/ui/constellation-grid";

/**
 * The hero's three atmospheric layers, sitting under everything else.
 *
 * Every layer is built from gradients: no image request, no canvas, no
 * particles. Nothing here animates itself. Each layer is tagged `data-hero` for
 * the scrubbed timeline in `Hero`, and carries `data-depth-*` for the pointer
 * parallax, which writes to the inner element so the two never contend for the
 * same transform.
 *
 * A server component. It is pure markup, so none of it ships as client JS.
 *
 * `aria-hidden` and `pointer-events: none` (via `.layer-base`) throughout: this
 * is lighting, and nothing here is content or clickable.
 */
export function HeroBackground() {
  return (
    <div aria-hidden className="layer-base absolute inset-0 overflow-clip">
      {/* Ground: an interactive mesh the cursor pushes through, and still the
          slowest-moving layer so it barely lags the page.

          It replaces the CSS `.hero-grid` gradient that used to sit here. The
          canvas paints its own ink, so it is opaque: everything below in this
          file (atmosphere, key light, vignette, closing edge) still layers over
          it exactly as before. Kept inside the same `data-hero="grid"` and
          `data-depth-*` wrappers, so the scrubbed exit timeline and the pointer
          parallax continue to drive it without knowing what it is. */}
      <div data-hero="grid" className="absolute inset-0">
        <div data-depth-x="14" data-depth-y="10" className="absolute inset-0">
          <ConstellationGrid className="absolute inset-0" />
        </div>
      </div>

      {/* Cool fill on the type side. Counter-drifts the key light. */}
      <div data-hero="atmosphere" className="absolute inset-0">
        <div data-depth-x="34" data-depth-y="22" className="absolute inset-0">
          <div
            className="animate-glow-drift-alt absolute top-[-14%] left-[-16%] h-[64vh] w-[64vh] rounded-full blur-[110px]"
            style={{
              background:
                "radial-gradient(circle, rgba(235,234,218,0.085) 0%, transparent 68%)",
            }}
          />
        </div>
      </div>

      {/* The warm key light behind the figure, breathing. Travels furthest,
          which is what sells the depth. */}
      <div data-hero="key" className="absolute inset-0">
        <div data-depth-x="58" data-depth-y="38" className="absolute inset-0">
          {/* Blur radius is held at 100px rather than scaled with the box: a
              blurred surface costs roughly its area, and a full-width haze at
              this radius is the one thing in the hero that could actually cost
              frames on an integrated GPU. */}
          <div
            className="animate-glow-drift absolute top-[4%] right-[-18%] h-[76vh] w-[76vh] rounded-full blur-[100px] sm:right-[-8%] lg:right-[6%]"
            style={{
              background:
                "radial-gradient(circle, rgba(224,168,74,0.32) 0%, rgba(224,168,74,0.12) 42%, transparent 70%)",
            }}
          />
        </div>
      </div>

      {/* Vignette: deliberately static. With every other layer drifting, one
          fixed element is what the eye reads the movement against. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 105% 85% at 50% 40%, transparent 42%, rgba(6,6,6,0.74) 100%)",
        }}
      />

      {/* Closing edge: hands off to the section below without a gradient seam
          sitting in open space. */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-ink-surface" />
    </div>
  );
}
