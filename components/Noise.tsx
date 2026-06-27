/**
 * Fixed, non-interactive film-grain overlay. Sits above the background layers
 * but below content to add subtle texture. Server component.
 */
export function Noise() {
  return (
    <div
      aria-hidden
      className="noise pointer-events-none fixed inset-0 z-[1] opacity-[0.035] mix-blend-soft-light"
    />
  );
}
