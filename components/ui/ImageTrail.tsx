"use client";

import { type RefObject, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface TrailConfig {
  pace: number;
  threshold: number;
  lifetime: number;
  appearScale: number;
  zoom: number;
  flash: number;
  exitScale: number;
  drift: number;
  rotation: number;
  sizeVariance: number;
  alignToMotion: boolean;
  stack: number;
  tilt: number;
}

interface TrailImage {
  el: HTMLElement;
  inner: HTMLElement;
}

interface ImageTrailProps extends Partial<TrailConfig> {
  /** The element whose hover drives the trail. */
  targetRef: RefObject<HTMLElement | null>;
  /** Image URLs shown in the trail, in order. */
  items: string[];
  /** Width of each image in px, or any CSS length. */
  size?: number | string;
  /** Width divided by height for each image. */
  aspectRatio?: number;
  /** Corner radius of the images. */
  radius?: number | string;
  className?: string;
  /**
   * Multiplies every duration in the trail, the hold included. 1 is the
   * original timing; 2 plays each image in, holds it and fades it out at half
   * the speed.
   */
  pace?: number;
}

const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

const toCssLength = (value: number | string) =>
  typeof value === "number" ? `${value}px` : value;

function createTrail(
  target: HTMLElement,
  layer: HTMLElement,
  config: RefObject<TrailConfig>,
) {
  const images: TrailImage[] = Array.from(
    layer.querySelectorAll<HTMLElement>("[data-trail-image]"),
  ).map((el) => ({ el, inner: el.firstElementChild as HTMLElement }));
  const total = images.length;
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mouse = { x: 0, y: 0 };
  const last = { x: 0, y: 0 };
  const cache = { x: 0, y: 0 };
  const visible: TrailImage[] = [];
  let started = false;
  let raf = 0;
  let index = -1;
  let zIndex = 1;
  let active = 0;
  let lastAngle = 0;
  let destroyed = false;

  const settle = () => {
    active = Math.max(0, active - 1);
    if (!active && !visible.length) zIndex = 1;
  };

  const retire = (img: TrailImage) => {
    const cfg = config.current;
    gsap.to(img.el, {
      duration: 0.4 * cfg.pace,
      ease: "power4",
      opacity: 0,
      scale: cfg.exitScale,
      onComplete: () => {
        if (!active && !visible.length) zIndex = 1;
      },
    });
  };

  const spawn = () => {
    const cfg = config.current;
    if (!total) return;
    index = (index + 1) % total;
    const img = images[index];
    if (!img) return;
    const width = img.el.offsetWidth;
    const height = img.el.offsetHeight;
    const dx = mouse.x - last.x;
    const dy = mouse.y - last.y;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    let fromAngle = gsap.utils.random(-cfg.rotation, cfg.rotation);
    let toAngle = fromAngle * 0.4;
    if (cfg.alignToMotion) {
      fromAngle = lastAngle;
      toAngle = angle;
      while (toAngle - fromAngle > 180) toAngle -= 360;
      while (toAngle - fromAngle < -180) toAngle += 360;
      lastAngle = toAngle;
    }
    const scale = 1 + gsap.utils.random(-0.5, 0.6) * cfg.sizeVariance;
    // Tilt leans toward whichever edge of the target the cursor is nearest.
    const box = target.getBoundingClientRect();
    const tiltX = box.height
      ? -((mouse.y - (box.top + box.height / 2)) / (box.height / 2)) * cfg.tilt
      : 0;
    const tiltY = box.width
      ? ((mouse.x - (box.left + box.width / 2)) / (box.width / 2)) * cfg.tilt
      : 0;
    const drift = cfg.drift > 0;
    const slide = drift ? 0.6 * cfg.drift : 0;

    ++zIndex;
    ++active;
    gsap.killTweensOf(img.el);
    gsap.killTweensOf(img.inner);
    const visibleIndex = visible.indexOf(img);
    if (visibleIndex >= 0) visible.splice(visibleIndex, 1);

    const timeline = gsap.timeline({ onComplete: settle });
    timeline.fromTo(
      img.el,
      {
        opacity: 1,
        scale: cfg.appearScale * scale,
        zIndex,
        x: cache.x - width / 2,
        y: cache.y - height / 2,
        rotation: fromAngle,
        rotationX: tiltX * 0.5,
        rotationY: tiltY * 0.5,
      },
      {
        duration: (drift ? 0.9 : 0.4) * cfg.pace,
        ease: drift ? "power2" : "power1",
        scale,
        x: mouse.x - width / 2 + dx * slide,
        y: mouse.y - height / 2 + dy * slide,
        rotation: toAngle,
        rotationX: tiltX,
        rotationY: tiltY,
      },
      0,
    );
    if (cfg.zoom !== 1 || cfg.flash > 0) {
      timeline.fromTo(
        img.inner,
        { scale: cfg.zoom, filter: `brightness(${1 + cfg.flash * 1.5})` },
        {
          duration: 0.5 * cfg.pace,
          ease: "power1",
          scale: 1,
          filter: "brightness(1)",
        },
        0,
      );
    }

    if (cfg.stack > 0) {
      visible.push(img);
      const keep = Math.max(1, Math.min(Math.round(cfg.stack), total - 1));
      while (visible.length > keep) {
        const old = visible.shift();
        if (old) retire(old);
      }
      return;
    }

    timeline.to(
      img.el,
      {
        duration: 0.4 * cfg.pace,
        ease: drift ? "expo" : "power3",
        opacity: 0,
        scale: cfg.exitScale * scale,
      },
      cfg.lifetime * cfg.pace,
    );
    if (drift) {
      timeline.to(
        img.el,
        {
          duration: 1.5 * cfg.pace,
          ease: "power4",
          x: `+=${dx * cfg.drift * 1.2}`,
          y: `+=${dy * cfg.drift * 1.2}`,
        },
        cfg.lifetime * cfg.pace,
      );
    }
  };

  const loop = () => {
    raf = 0;
    if (destroyed) return;
    const cfg = config.current;
    cache.x = lerp(cache.x, mouse.x, 0.1);
    cache.y = lerp(cache.y, mouse.y, 0.1);
    if (
      !query.matches &&
      Math.hypot(mouse.x - last.x, mouse.y - last.y) > cfg.threshold
    ) {
      spawn();
      last.x = mouse.x;
      last.y = mouse.y;
    }
    if (Math.abs(cache.x - mouse.x) > 0.5 || Math.abs(cache.y - mouse.y) > 0.5) {
      raf = requestAnimationFrame(loop);
    }
  };

  const onMove = (event: PointerEvent) => {
    // Hover is a mouse gesture: a finger swiping the timeline is a scroll.
    if (event.pointerType !== "mouse") return;
    // A held button is the track being dragged, not a hover. Forgetting the
    // position means the first move after release re-seeds the trail rather
    // than flinging an image across everything the drag covered.
    if (event.buttons) {
      started = false;
      return;
    }
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    if (!started) {
      started = true;
      cache.x = last.x = mouse.x;
      cache.y = last.y = mouse.y;
    }
    if (!raf) raf = requestAnimationFrame(loop);
  };

  // Same reason as the drag: re-entering from another side starts fresh.
  const onLeave = () => {
    started = false;
  };

  target.addEventListener("pointermove", onMove, { passive: true });
  target.addEventListener("pointerleave", onLeave);

  return () => {
    destroyed = true;
    if (raf) cancelAnimationFrame(raf);
    target.removeEventListener("pointermove", onMove);
    target.removeEventListener("pointerleave", onLeave);
    images.forEach((img) => {
      gsap.killTweensOf(img.el);
      gsap.killTweensOf(img.inner);
    });
  };
}

/**
 * A trail of images that spawn along the cursor as it moves over `targetRef`.
 * Ported from React Bits' `<ImageTrail />`.
 *
 * Two departures from the original, both for hosting it on a timeline card:
 *
 *  - **The images live in a portal, fixed to the viewport.** The cards sit in a
 *    horizontally scrolling track, and `overflow-x: auto` forces `overflow-y`
 *    to auto as well, so a trail rendered inside a card is clipped at the
 *    track's edges and, worse, grows its scrollable area into a vertical
 *    scroll. The section is also transformed by its scroll scene. Fixed
 *    positioning on `body` is out of reach of all three, and lets the trail
 *    work in plain `clientX` / `clientY`.
 *  - **It listens on a separate target.** The original listens on its own
 *    container, which has to cover the content to hear the pointer and so
 *    blocks every button beneath it. Here the layer never takes a pointer
 *    event, and the card underneath stays fully interactive.
 *
 * Mouse only, and silent under reduced motion.
 */
export function ImageTrail({
  targetRef,
  items,
  size = 190,
  aspectRatio = 1.1,
  radius = 15,
  threshold = 80,
  lifetime = 0.4,
  appearScale = 1,
  zoom = 1,
  flash = 0,
  exitScale = 0.2,
  drift = 0,
  rotation = 0,
  sizeVariance = 0,
  alignToMotion = false,
  stack = 0,
  tilt = 0,
  pace = 1,
  className,
}: ImageTrailProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Read on every frame of the trail, so prop changes apply without tearing it
  // down and rebuilding it.
  const config = useRef<TrailConfig>(null!);
  config.current = {
    pace,
    threshold,
    lifetime,
    appearScale,
    zoom,
    flash,
    exitScale,
    drift,
    rotation,
    sizeVariance,
    alignToMotion,
    stack,
    tilt,
  };

  // There is no `body` to portal into on the server.
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const target = targetRef.current;
    const layer = layerRef.current;
    if (!mounted || !target || !layer) return;
    return createTrail(target, layer, config);
  }, [mounted, targetRef, items]);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={layerRef}
      aria-hidden
      className={cn("pointer-events-none fixed inset-0 z-[150]", className)}
      style={{ perspective: tilt ? "1000px" : undefined }}
    >
      {items.map((url, i) => (
        <div
          key={i}
          data-trail-image=""
          className="absolute top-0 left-0 overflow-hidden border-2 border-ink bg-card opacity-0 will-change-[transform,filter]"
          style={{
            width: toCssLength(size),
            aspectRatio: String(aspectRatio),
            borderRadius: toCssLength(radius),
          }}
        >
          {/* Overscanned by 10px a side, so the zoom-in never shows an edge. */}
          <div
            className="absolute -inset-2.5 bg-cover bg-center"
            style={{ backgroundImage: `url(${url})` }}
          />
        </div>
      ))}
    </div>,
    document.body,
  );
}
