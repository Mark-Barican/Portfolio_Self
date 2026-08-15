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

/* Palette, matching the theme tokens in globals.css. Hard-coded rather than
   read from CSS per frame, which would force a style recalculation. */
const INK_SURFACE = "#111110";
const CREAM = "235, 234, 218";
const ACCENT = "255, 255, 35";

const SPRING_K = 18;
const DAMPING = 0.82;

/** Node alpha at rest, and the floor the accent ramp starts from. */
const REST_ALPHA = 0.22;
/** Node alpha directly under the pointer. */
const PEAK_ALPHA = 0.5;
const RING_ALPHA = 0.16;

/**
 * Pointer types that push the mesh while pressed. A mouse is tracked on
 * movement alone and is handled separately. Drop `"touch"` to make this
 * stylus-only.
 */
const DRAG_POINTERS = new Set(["touch", "pen"]);

interface ConstellationGridProps {
  className?: string;
}

/**
 * An interactive mesh of points the pointer pushes through, used as the hero's
 * ground. Adapted from the supplied `ConstellationGrid`: same spring physics,
 * but it renders only a canvas sized to its container, paints in the site's
 * palette, and connects nodes by grid index rather than testing every pair
 * (~1,800 checks a frame instead of ~97,000 at 1440x900).
 *
 * Pauses when scrolled out of view. Reduced motion gets one static paint and no
 * interaction. Touch gets a coarser mesh.
 */
export function ConstellationGrid({ className }: ConstellationGridProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    // `alpha: false` skips per-pixel blending; the canvas paints its own ground.
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    const interactive = !reduced;

    let width = 0;
    let height = 0;
    let rows = 0;
    let cols = 0;
    let nodes: Node[] = [];
    let frame = 0;
    let running = false;
    let last = 0;
    let maxConn = 79;
    let maxConnSq = maxConn * maxConn;

    const mouse = { x: -9999, y: -9999, prevX: -9999, prevY: -9999, radius: 200 };

    const layout = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      // `setTransform`, not `scale`: this reruns on resize and must not compound.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

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

    const draw = () => {
      ctx.fillStyle = INK_SURFACE;
      ctx.fillRect(0, 0, width, height);

      // Only the four neighbours not already paired from the other side.
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

      for (let idx = 0; idx < nodes.length; idx++) {
        const n = nodes[idx];
        if (!n) continue;

        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const near = dist < mouse.radius;
        const prox = near ? 1 - dist / mouse.radius : 0;

        // Ramped from the resting alpha, so entering the field is not a step.
        const alpha = near
          ? REST_ALPHA + prox * (PEAK_ALPHA - REST_ALPHA)
          : REST_ALPHA + Math.sin(n.pulse) * 0.08;
        ctx.fillStyle = near
          ? `rgba(${ACCENT}, ${alpha})`
          : `rgba(${CREAM}, ${alpha})`;

        const r = near
          ? n.radius * (1 + prox)
          : n.radius + Math.sin(n.pulse) * 0.3;
        ctx.beginPath();
        ctx.arc(n.x, n.y, Math.max(0.5, r), 0, Math.PI * 2);
        ctx.fill();

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
          const force = (1 - dist / mouse.radius) * (1400 + speed * 140);
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

    /** True while a pen or finger is pressed. Irrelevant to a mouse. */
    let dragging = false;

    // Client coordinates are viewport-relative; the canvas is not.
    const track = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    // Moved off-canvas rather than frozen, so the springs carry nodes home.
    const release = () => {
      dragging = false;
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

    // `pointercancel` is what fires when the browser claims a gesture for a
    // scroll; without it `dragging` would stay true indefinitely.
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

    const visibility = new IntersectionObserver(
      ([entry]) => (entry?.isIntersecting ? start() : stop()),
      { rootMargin: "120px" },
    );
    visibility.observe(host);

    if (interactive) {
      // Press on the host so only a gesture starting on the hero counts; move
      // and release on the window so a drag leaving the hero still ends. All
      // passive: nothing here may block scrolling.
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
    /* `touch-pan-y` keeps vertical drags as browser scrolls while leaving
       sideways movement to the canvas. Without it the browser cancels the
       pointer stream as soon as it commits to a scroll. */
    <div ref={hostRef} className={`touch-pan-y ${className ?? ""}`} aria-hidden>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}

export default ConstellationGrid;
