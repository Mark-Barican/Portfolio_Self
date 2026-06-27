import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  /** Two-digit section index, e.g. "01". */
  index?: string;
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/**
 * Consistent section heading: numbered eyebrow, large title and optional lede.
 * Composes the client `Reveal` wrapper but stays a server component itself.
 */
export function SectionTitle({
  index,
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <Reveal>
        <div className="flex items-center gap-3 text-sm font-medium text-accent">
          {index && (
            <span className="font-mono text-xs text-muted">{index}</span>
          )}
          <span className="h-px w-8 bg-accent/50" aria-hidden />
          <span className="tracking-[0.2em] uppercase">{eyebrow}</span>
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl">
          {title}
        </h2>
      </Reveal>

      {description && (
        <Reveal delay={0.12}>
          <p
            className={cn(
              "max-w-2xl text-base leading-relaxed text-pretty text-muted sm:text-lg",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
