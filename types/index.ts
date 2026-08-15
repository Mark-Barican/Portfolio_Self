import type { IconType } from "react-icons";

/** A single navigation entry mapped to an in-page section id. */
export interface NavItem {
  label: string;
  href: `#${string}`;
  id: string;
}

/** Social / external profile link. */
export interface SocialLink {
  label: string;
  href: string;
  icon: IconType;
  handle?: string;
}

/** Headline statistic rendered as an animated counter in the About section. */
export interface Stat {
  /** Numeric portion that animates from 0 → value. */
  value: number;
  /** Symbol appended after the number, e.g. "+" or "k". */
  suffix?: string;
  label: string;
}

/** Project category used for subtle labelling and filtering. */
export type ProjectCategory =
  | "Full-Stack"
  | "E-Commerce"
  | "Simulation"
  | "Brand Site"
  | "Interactive";

/** A featured or secondary portfolio project. */
export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: ProjectCategory;
  /** Representative icon used as the project thumbnail placeholder. */
  icon: IconType;
  /** Short summary shown on the card. */
  description: string;
  /** Longer narrative shown in the detail modal. */
  overview: string;
  tech: string[];
  features: string[];
  challenges: string[];
  solutions: string[];
  links: {
    repo?: string;
    live?: string;
  };
  /** Marks cards that get the large hero treatment. */
  featured: boolean;
  /** Gradient stops used for the compact card chip + image fallback. */
  accent: [string, string];
  /** Primary screenshot shown on the card and as the modal hero. */
  cover?: string;
  /** Additional screenshots shown in the modal gallery. */
  gallery?: string[];
}

/** A professional certification. */
export interface Certification {
  issuer: string;
  title: string;
  /**
   * Issuer brand mark. Optional because react-icons does not carry every
   * company logo: Simple Icons has dropped some (IBM among them) over
   * trademark policy. Issuers without one use `monogram` in the same tile.
   */
  icon?: IconType;
  /** Typographic fallback shown when no brand icon exists. */
  monogram?: string;
}

/** A chapter in the "My Journey" story timeline. */
export interface JourneyItem {
  /** Short year tag rendered big on the card, e.g. "'21". */
  year: string;
  /** Full year used in the expanded story, e.g. "2021". */
  fullYear: string;
  title: string;
  /** One-two sentence teaser shown on the collapsed card. */
  short: string;
  /** Longer narrative revealed on expand. */
  story: string;
  /** Playful @handle credit, heynesh-style. */
  handle: string;
}

/** A capability row in the "What You Get" section. */
export interface Capability {
  title: string;
  description: string;
  /** Representative tools/tech shown as small tags. */
  tools: string[];
}
