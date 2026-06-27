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

/** A grouped collection of related skills. */
export interface SkillCategory {
  title: string;
  description: string;
  skills: Skill[];
}

/** An individual technology / tool. */
export interface Skill {
  name: string;
  icon: IconType;
}

/** A role in the experience timeline. */
export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  /** Representative icon used as the company "logo" placeholder. */
  icon: IconType;
  type?: string;
  location?: string;
  period: string;
  /** Bullet-point achievements, surfaced when the entry is expanded. */
  highlights: string[];
  /** Key technologies used in the role. */
  stack?: string[];
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
  /** Tailwind gradient stops used to render the elegant image placeholder. */
  accent: [string, string];
}

/** A professional certification. */
export interface Certification {
  issuer: string;
  title: string;
  icon: IconType;
}
