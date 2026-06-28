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
          alt={`${project.title} — ${project.tagline}`}
          fill
          sizes={size === "lg" ? "(max-width: 768px) 100vw, 768px" : "(max-width: 1024px) 100vw, 50vw"}
          className="object-cover object-top"
        />
        {/* Legibility wash + category badge */}
        <div className="absolute inset-0 bg-gradient-to-t from-card/70 via-transparent to-transparent" />
        <span className="absolute top-4 left-4 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[0.7rem] font-medium tracking-wide text-white/85 backdrop-blur">
          {project.category}
        </span>
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
      <div className="grid-pattern absolute inset-0 opacity-40" />

      {/* Oversized watermark icon */}
      <Icon
        aria-hidden
        size={size === "lg" ? 280 : 180}
        className="absolute -right-6 -bottom-8 text-foreground/[0.06]"
      />

      {/* Sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.06]" />

      {/* Icon badge + title */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
        <span
          className={cn(
            "grid place-items-center rounded-2xl border border-white/15 bg-white/[0.06] text-foreground shadow-lg backdrop-blur",
            size === "lg" ? "h-20 w-20" : "h-14 w-14",
          )}
        >
          <Icon size={size === "lg" ? 36 : 26} aria-hidden />
        </span>
        <span
          className={cn(
            "font-semibold tracking-tight text-foreground/90",
            size === "lg" ? "text-4xl sm:text-5xl" : "text-2xl",
          )}
        >
          {project.title}
        </span>
        {size === "lg" && (
          <span className="max-w-md text-sm text-pretty text-foreground/60">
            {project.tagline}
          </span>
        )}
      </div>

      <span className="absolute top-4 left-4 rounded-full border border-white/15 bg-black/30 px-2.5 py-1 text-[0.7rem] font-medium tracking-wide text-white/80 backdrop-blur">
        {project.category}
      </span>
    </div>
  );
}
