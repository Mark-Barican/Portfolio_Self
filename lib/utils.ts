/**
 * Lightweight className combiner. Filters falsy values so we can write
 * conditional classes without pulling in a dependency.
 *
 * @example cn("px-4", isActive && "text-accent", undefined) // "px-4 text-accent"
 */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
