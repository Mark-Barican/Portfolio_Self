import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SurfaceEdge } from "@/components/ui/SurfaceEdge";
import { StackIntro } from "@/components/sections/StackIntro";
import { StackStage } from "@/components/sections/StackStage";
import { StackClusters } from "@/components/sections/StackClusters";

/**
 * The Stack: the full toolkit on the ink surface, in two halves that do
 * different jobs.
 *
 * `StackStage` is the floating card composition: cream cards at three depths,
 * tilted and overlapping, pinned and flown in on scroll. `StackClusters` under
 * it is the part that actually has to be *read*, so it is a plain, aligned
 * two-column list rather than another piece of composition.
 *
 * That split is deliberate and was not always the case. The clusters used to be
 * scattered across a twelve-column grid on staggered top margins and different
 * scroll speeds, which read as clutter: six headings at six different heights
 * with ragged columns and no clear reading order. Expressiveness belongs in the
 * stage; the index below it should be boring and legible.
 *
 * The stage used to be a WebGL flythrough: three, fiber and drei behind a lazy
 * boundary, rasterising each logo onto a canvas texture at runtime. The cards
 * look the same and are now real DOM. That drops ~600 kB of runtime, puts the
 * names back in the document where a crawler can read them, and keeps the depth
 * (it was only ever transforms and opacity doing that work).
 *
 * This is the page's second chapter break, and the one boundary besides the
 * hero where the surface changes under a reader who is mid-flow. It gets the
 * `full` surface edge: the cream is carried most of a screen into this section
 * and cleared slowly, so Built to Perform reads as *finishing* rather than as
 * simply ending, and the ink is established before the Stack title arrives.
 */
export function Stack() {
  return (
    <section
      id="stack"
      data-surface="dark"
      /* Horizontal clip only, so the surface band can cover the fractional
         seam at this section's top edge. See `SurfaceEdge`. */
      className="relative isolate overflow-x-clip bg-ink-surface py-16 sm:py-20"
    >
      {/* Carries the work index's cream over this section's top edge, then
          wipes it away. Opaque, so the boundary is never a blend: see the
          note in `SurfaceEdge` about why a cross-fade produced the grey slab
          that used to appear under Valentine's 2026. */}
      <SurfaceEdge from="cream" depth={70} />

      <Container className="layer-content relative">
        <StackIntro>
          {/* Centred, unlike every other section opener on the page, and that
              is the point: this is the one chapter whose content below it is a
              symmetrical composition rather than a left-aligned list, so a
              left-aligned title sat off-axis from everything it introduced.
              `items-center` centres the lede's own `max-w-xl` box as a flex
              item; `text-center` handles the type inside it. */}
          <SectionHeading
            inverted
            reveal={false}
            className="items-center text-center"
            title={
              <span data-stack-title className="block">
                The
                <br />
                Stack
              </span>
            }
          >
            <span data-stack-lede className="block">
              What I reach for to design, build, ship and keep things running.
            </span>
          </SectionHeading>
        </StackIntro>
      </Container>

      {/* Full-bleed, so cards can sit past the container edge and be cropped by
          the section rather than stopping politely at the gutter. */}
      <div className="mt-10 hidden px-5 sm:px-8 lg:block">
        <StackStage />
      </div>

      <Container className="layer-content relative">
        <StackClusters />
      </Container>
    </section>
  );
}
