"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  radius: number;
  pulse: number;
}

/* -------------------------------------------------------------------------- */
/*  Palette — the page's own tokens, as canvas needs them.                     */
/*                                                                            */
/*  Hard-coded rather than read from CSS custom properties on every frame: a   */
/*  `getComputedStyle` call per paint is exactly the kind of forced style      */
/*  recalculation this file is otherwise careful to avoid. If the theme tokens */
/*  in globals.css move, these move with them.                                */
/* -------------------------------------------------------------------------- */
const INK_SURFACE = "#111110";
/** `--color-cream`, as an rgb triple so alpha can vary per node. */
const CREAM = "235, 234, 218";
/** `--color-accent`, used only where the cursor is. */
const ACCENT = "255, 255, 35";

/** Spring stiffness pulling a node back to its anchor. */
const SPRING_K = 18;
/** Velocity retained per frame. Below 1, or the mesh never settles. */
const DAMPING = 0.82;

/* -------------------------------------------------------------------------- */
/*  Accent brightness.                                                        */
/*                                                                            */
/*  `--color-accent` is #ffff23, which is about as luminous as a colour gets   */
/*  and was chosen for small marks on cream — a button, a rule, one caret.     */
/*  Several hundred points of it at near-full alpha on near-black is a very    */
/*  different proposition: the mesh stopped reading as ground and started      */
/*  reading as the brightest thing in the hero, competing with the headline it */
/*  sits behind.                                                              */
/*                                                                            */
/*  Two changes hold it back. The peak is roughly half what it was, and it is  */
/*  now reached only directly under the cursor rather than everywhere inside   */
/*  the 200px radius — the alpha ramps from the resting cream value at the     */
/*  edge of the field up to the peak at the centre. The lit area is the same;  */
/*  the amount of light coming off it is far less, and it falls off instead of */
/*  ending at a hard circle.                                                  */
/* -------------------------------------------------------------------------- */
/** Node alpha at rest, and the floor the accent ramp starts from. */
const REST_ALPHA = 0.22;
/** Node alpha directly under the cursor. Was 0.9. */
const PEAK_ALPHA = 0.5;
/** Opacity of the expanding ring on nodes nearest the pointer. Was 0.32. */
const RING_ALPHA = 0.16;

/**
 * Which pointer types may push the mesh around.
 *
 * A mouse is tracked on movement alone, because hovering is something it can
 * do. Everything else is tracked only while it is pressed — see `onMove`.
 *
 * To restrict this to a stylus and leave finger input alone, drop `"touch"`
 * from this set. That is the whole change: the gesture handling below already
 * treats pen and touch identically, and `touch-action` stays correct either
 * way because a pen scrolls a page the same way a finger does.
 */
const DRAG_POINTERS = new Set(["touch", "pen"]);

interface ConstellationGridProps {
  className?: string;
}

/**
 * An interactive mesh of points that the cursor pushes through, drawn on a
 * canvas and used as the hero's ground.
 *
 * Adapted from the supplied `ConstellationGrid`. The physics are the original's
 * — a spring-mass-damper per node, with cursor proximity applying an impulse
 * scaled by pointer speed — and the following is what changed and why.
 *
 * **It is a background, not a page.** The original rendered a full-height
 * section with its own headline, sized itself to `window`, and painted a
 * slate-950 ground with a sky-cyan accent. Here it renders one canvas, measures
 * the element it is placed in, and paints the site's ink surface with cream
 * nodes and the accent reserved for the few nodes under the pointer. Nothing in
 * it competes with the hero's own type.
 *
 * **Connections are found by grid index, not by distance sweep.** This is the
 * one change that matters for performance. The original compared every node
 * against every other node each frame: at its 55px spacing a 1440x900 viewport
 * holds ~460 nodes, which is ~105,000 pair tests per frame, all to draw edges
 * that can only ever be a few pixels long. Because the nodes *are* a grid, each
 * one's possible partners are known — the neighbour to the right, the one
 * below, and the two diagonals — so the same mesh costs four tests per node,
 * about 1,800 a frame. Two orders of magnitude less work for an identical
 * picture.
 *
 * **It stops when it cannot be seen.** An IntersectionObserver cancels the
 * frame loop once the hero scrolls away, so the rest of the page is never
 * animating a canvas nobody is looking at.
 *
 * **Reduced motion gets one static paint.** The mesh is drawn once, at rest,
 * with no loop and no pointer listener. The ground still reads as a grid; it
 * simply does not move.
 *
 * **Touch gets a coarser mesh and no interaction.** There is no pointer to
 * follow, and a phone should not be running a spring simulation over several
 * hundred nodes to display a texture.
 *
 * The original's hex coordinate readouts are deliberately not here. They are a
 * `fillText` per near node per frame, which is the most expensive drawing call
 * in the loop, and monospace hex labels belong to a different design language
 * than the rest of this page.
 */
export function ConstellationGrid({ className }: ConstellationGridProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    // `alpha: false` lets the compositor skip per-pixel blending. The canvas is
    // the bottom layer of an opaque section, so it has nothing to show through
    // to and paints its own ground every frame anyway.
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    /* Every input drives the mesh, not just a mouse.
     *
     * The gate used to be `(pointer: fine)`, which meant a tablet or phone got
     * the animated grid but could never push it — the inputs those devices
     * actually have were the ones excluded. What differs now is *when* a
     * pointer counts, not whether it does: a mouse is tracked whenever it
     * moves, while pen and touch are tracked only between `pointerdown` and
     * `pointerup`. Without that distinction a single tap would leave the field
     * parked wherever the finger last was, a permanent bright patch on the
     * grid with nothing left to move it.
     *
     * Reduced motion remains the one case with no interaction at all, because
     * there is no frame loop running to show a response. */
    const interactive = !reduced;

    let width = 0;
    let height = 0;
    let rows = 0;
    let cols = 0;
    let nodes: Node[] = [];
    let frame = 0;
    let running = false;
    let last = 0;

    const mouse = {
      x: -9999,
      y: -9999,
      prevX: -9999,
      prevY: -9999,
      radius: 200,
    };

    /* -- Layout ---------------------------------------------------------- */

    const layout = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));

      // Capped at 2: beyond that the extra pixels are invisible and the fill
      // rate is not.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      // `setTransform`, not `scale`: this runs again on every resize, and
      // `scale` compounds onto the previous matrix instead of replacing it.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Coarser on small screens: fewer nodes, and the mesh still reads.
      const spacing = width < 640 ? 78 : 58;
      cols = Math.ceil(width / spacing) + 1;
      rows = Math.ceil(height / spacing) + 1;

      nodes = new Array(cols * rows);
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;
          nodes[i * rows + j] = {
            x,
            y,
            vx: 0,
            vy: 0,
            baseX: x,
            baseY: y,
            radius: Math.random() * 1.1 + 1,
            pulse: Math.random() * Math.PI * 2,
          };
        }
      }
      maxConn = spacing * 1.36;
      maxConnSq = maxConn * maxConn;
    };

    let maxConn = 79;
    let maxConnSq = maxConn * maxConn;

    /* -- Drawing --------------------------------------------------------- */

    const draw = () => {
      ctx.fillStyle = INK_SURFACE;
      ctx.fillRect(0, 0, width, height);

      /* Edges. Only the four neighbours that have not already been paired
         from the other side: right, below, and both diagonals. */
      ctx.lineWidth = 0.7;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const n = nodes[i * rows + j];
          if (!n) continue;

          for (let k = 0; k < 4; k++) {
            const ni = i + (k === 1 ? 0 : 1);
            const nj = j + (k === 0 ? 0 : k === 3 ? -1 : 1);
            if (ni >= cols || nj < 0 || nj >= rows) continue;

            const m = nodes[ni * rows + nj];
            if (!m) continue;

            const dx = n.x - m.x;
            const dy = n.y - m.y;
            const distSq = dx * dx + dy * dy;
            if (distSq >= maxConnSq) continue;

            const alpha = (1 - Math.sqrt(distSq) / maxConn) * 0.16;
            ctx.strokeStyle = `rgba(${CREAM}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }
      }

      /* Points. */
      for (let idx = 0; idx < nodes.length; idx++) {
        const n = nodes[idx];
        if (!n) continue;

        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const near = dist < mouse.radius;
        // 0 at the edge of the field, 1 directly under the cursor.
        const prox = near ? 1 - dist / mouse.radius : 0;

        // Starting the ramp at the resting alpha means a node crossing into
        // the field does not step in brightness; it only begins to climb.
        const alpha = near
          ? REST_ALPHA + prox * (PEAK_ALPHA - REST_ALPHA)
          : REST_ALPHA + Math.sin(n.pulse) * 0.08;
        ctx.fillStyle = near
          ? `rgba(${ACCENT}, ${alpha})`
          : `rgba(${CREAM}, ${alpha})`;

        // Size is tapered on the same curve. A dot that doubles the moment it
        // enters the field reads as brightness even when the alpha has not
        // changed, which is half of why the old hard cutoff was so loud.
        const r = near
          ? n.radius * (1 + prox)
          : n.radius + Math.sin(n.pulse) * 0.3;
        ctx.beginPath();
        ctx.arc(n.x, n.y, Math.max(0.5, r), 0, Math.PI * 2);
        ctx.fill();

        // A single expanding ring on the handful of nodes directly under the
        // pointer. Bounded to <90px so this is a few arcs, not hundreds.
        if (dist < 90) {
          const ring = ((n.pulse * 18) % 28) + 4;
          ctx.strokeStyle = `rgba(${ACCENT}, ${(1 - ring / 32) * RING_ALPHA})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(n.x, n.y, ring, 0, Math.PI * 2);
          ctx.stroke();
          ctx.lineWidth = 0.7;
        }
      }
    };

    /* -- Simulation ------------------------------------------------------ */

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const mvx = (mouse.x - mouse.prevX) / (dt * 1000 || 1);
      const mvy = (mouse.y - mouse.prevY) / (dt * 1000 || 1);
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      const speed = Math.sqrt(mvx * mvx + mvy * mvy);

      for (let idx = 0; idx < nodes.length; idx++) {
        const n = nodes[idx];
        if (!n) continue;
        n.pulse += dt * 3;

        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 0) {
          const power = 1 - dist / mouse.radius;
          const force = power * (1400 + speed * 140);
          n.vx -= (dx / dist) * force * dt;
          n.vy -= (dy / dist) * force * dt;
        }

        n.vx += (n.baseX - n.x) * SPRING_K * dt;
        n.vy += (n.baseY - n.y) * SPRING_K * dt;
        n.vx *= DAMPING;
        n.vy *= DAMPING;
        n.x += n.vx * dt * 60;
        n.y += n.vy * dt * 60;
      }

      draw();
      frame = requestAnimationFrame(step);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(step);
    };

    const stop = () => {
      running = false;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    /* -- Wiring ---------------------------------------------------------- */

    /** True while a pen or finger is pressed. Irrelevant to a mouse. */
    let dragging = false;

    const track = (event: PointerEvent) => {
      // Client coordinates are viewport-relative; the canvas is not. Offsetting
      // by the host's own rect is what keeps the repulsion under the pointer
      // once the hero has been scrolled or parallaxed.
      const rect = host.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const release = () => {
      dragging = false;
      // Moved far off-canvas rather than frozen in place: every node is then
      // outside the radius and the springs carry them home on their own, which
      // is the same settle a mouse gets when it leaves the window.
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && !dragging) return;
      track(event);
    };

    const onDown = (event: PointerEvent) => {
      if (!DRAG_POINTERS.has(event.pointerType)) return;
      dragging = true;
      track(event);
    };

    // `pointercancel` matters as much as `pointerup`: it is what the browser
    // sends when it claims a gesture for scrolling, and without it a finger
    // that turns into a page scroll would leave `dragging` true indefinitely.
    const onUp = (event: PointerEvent) => {
      if (!DRAG_POINTERS.has(event.pointerType)) return;
      release();
    };

    const onLeave = () => release();

    layout();
    draw();

    const resize = new ResizeObserver(() => {
      layout();
      if (!running) draw();
    });
    resize.observe(host);

    // Nothing below the fold needs a frame loop.
    const visibility = new IntersectionObserver(
      ([entry]) => (entry?.isIntersecting ? start() : stop()),
      { rootMargin: "120px" },
    );
    visibility.observe(host);

    if (interactive) {
      // `pointerdown` on the canvas host, so only a gesture that *starts* on
      // the hero drives the mesh. Move and release on the window, so a drag
      // that wanders off the hero still tracks and still ends.
      //
      // All passive, and nothing here calls `preventDefault` — the page has to
      // stay scrollable from anywhere in the hero, which on a phone is most of
      // the first screen.
      host.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerup", onUp, { passive: true });
      window.addEventListener("pointercancel", onUp, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }

    return () => {
      stop();
      resize.disconnect();
      visibility.disconnect();
      if (interactive) {
        host.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        document.removeEventListener("pointerleave", onLeave);
      }
    };
  }, []);

  return (
    /* `touch-pan-y` is what makes a pen or finger work here at all.
     *
     * At the default `touch-action` the browser treats any movement as a
     * possible scroll: it fires `pointercancel` the instant it commits to one
     * and sends no further `pointermove`, so the mesh would twitch briefly and
     * go dead. `pan-y` splits the gesture space explicitly — vertical drags
     * stay the browser's, so the page scrolls exactly as before, while
     * horizontal and diagonal movement is never claimed and keeps delivering
     * events to the canvas.
     *
     * So on a tablet: drag up and down to read, move across to push the grid.
     * Neither gesture needs discovering and neither blocks the other. Nothing
     * calls `preventDefault`, so scrolling cannot be broken by this even where
     * a browser reads the hint differently. */
    <div ref={hostRef} className={`touch-pan-y ${className ?? ""}`} aria-hidden>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}

export default ConstellationGrid;
