import { SITE } from "@/lib/constants";

interface LogoProps {
  className?: string;
  /**
   * Accessible name. Pass null for decorative use where an adjacent element
   * already names the mark.
   */
  title?: string | null;
}

/**
 * The Barican monogram, inlined so it can inherit `currentColor`, that is what
 * lets the header flip it between ink and cream over light and dark sections.
 * Size it with a height utility (`h-8 w-auto`); the viewBox handles the rest.
 */
export function Logo({ className, title = SITE.name }: LogoProps) {
  return (
    <svg
      viewBox="0 0 250 160"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={className}
      {...(title
        ? { role: "img", "aria-label": title }
        : { "aria-hidden": true, focusable: false })}
    >
      <path d="M30 140V20H50V140H30Z" />
      <path d="M50 20L100 140H80L30 20H50Z" />
      <path d="M130 20L80 140H100L150 20H130Z" />
      <path d="M175 20C194.33 20 210 35.67 210 55C210 62.5669 207.598 69.5721 203.516 75.2969C213.414 81.4799 220 92.4696 220 105C220 124.33 204.33 140 185 140H120L128.343 120H185C193.284 120 200 113.284 200 105C200 96.7157 193.284 90 185 90H140.817L149.158 70H175C183.284 70 190 63.2843 190 55C190 46.7157 183.284 40 175 40H140V20H175Z" />
    </svg>
  );
}
