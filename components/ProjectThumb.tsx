import Image from "next/image";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

interface ProjectThumbProps {
  project: Pick<
    Project,
    "title" | "category" | "accent" | "tagline" | "icon" | "cover"
  >;
  className?: string;
  /** Larger treatment for hero cards and the modal header. */
  size?: "sm" | "lg";
}

/**
 * Project thumbnail. Renders the real cover screenshot when one exists,
 * otherwise falls back to an elegant generated placeholder (themed gradient +
 * watermark icon + title).
 */
export function ProjectThumb({
  project,
  className,
  size = "sm",
}: ProjectThumbProps) {
  const [from, to] = project.accent;
  const Icon = project.icon;

  if (project.cover) {
    return (
      <div
        className={cn("relative h-full w-full overflow-hidden", className)}
        style={{ backgroundColor: "#070b16" }}
      >
        <Image
          src={project.cover}
          alt={`${project.title} · ${project.tagline}`}
          fill
          sizes={
            size === "lg"
              ? "(max-width: 768px) 100vw, 1536px"
              : "(max-width: 1024px) 100vw, 50vw"
          }
          /* Covers are UI screenshots: dense small text shown at a heavy
             downscale. Next's default 75 is tuned for photographs, where the
             smearing it trades away is invisible; on 11px interface type it
             reads as a blurred card. */
          quality={95}
          className="object-cover object-top"
        />
        {/* Nothing is layered over the screenshot.
         *
         * This carried a black gradient wash and a glass category pill in the
         * top-left corner. The pill existed to label the cover and the wash
         * existed to make the pill legible, so between them they dimmed and
         * covered part of every screenshot to display a word the row already
         * prints as `01 / Interactive` directly above the title. The cover is
         * the evidence; the label was obscuring the thing it described. */}
      </div>
    );
  }

  return (
    <div
      className={cn("relative h-full w-full overflow-hidden", className)}
      style={{
        backgroundColor: "#07100f",
        backgroundImage: `radial-gradient(120% 120% at 15% 10%, ${from}38, transparent 55%), radial-gradient(120% 120% at 90% 100%, ${to}55, transparent 60%)`,
      }}
    >
      {/* Oversized watermark icon */}
      <Icon
        aria-hidden
        size={size === "lg" ? 280 : 180}
        className="absolute -right-6 -bottom-8 text-white/[0.06]"
      />

      {/* Sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.06]" />

      {/* Icon badge + title */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
        <span
          className={cn(
            "grid place-items-center rounded-2xl border border-white/15 bg-white/[0.06] text-white shadow-lg backdrop-blur",
            size === "lg" ? "h-20 w-20" : "h-14 w-14",
          )}
        >
          <Icon size={size === "lg" ? 36 : 26} aria-hidden />
        </span>
        <span
          className={cn(
            "font-semibold tracking-tight text-white/90",
            size === "lg" ? "text-4xl sm:text-5xl" : "text-2xl",
          )}
        >
          {project.title}
        </span>
        {size === "lg" && (
          <span className="max-w-md text-sm text-pretty text-white/60">
            {project.tagline}
          </span>
        )}
      </div>

    </div>
  );
}
