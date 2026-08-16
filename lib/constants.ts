/**
 * Central, framework-agnostic site configuration.
 * Everything that is "about the site" (not the resume content) lives here so it
 * can be reused by metadata, structured data, the sitemap, and UI alike.
 */

export const SITE = {
  name: "Mark Luis F. Barican",
  shortName: "Mark Barican",
  role: "Full-Stack Developer",
  /** Public production URL. Override with NEXT_PUBLIC_SITE_URL on Vercel. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://mark-barican.vercel.app",
  locale: "en_US",
  location: "Quezon City, Philippines",
  email: "business.markbarican@gmail.com",
  description:
    "Full-stack developer with 5+ years shipping production web apps with Next.js, React, TypeScript, Node.js and PostgreSQL, from e-commerce and 3D web to full-stack systems.",
  keywords: [
    "Mark Barican",
    "Full-Stack Developer",
    "Next.js Developer",
    "React Developer",
    "TypeScript",
    "Web Developer Philippines",
    "Shopify Developer",
    "Three.js",
  ],
} as const;

export const LINKS = {
  email: `mailto:${SITE.email}`,
  github: "https://github.com/Mark-Barican",
  linkedin: "https://linkedin.com/in/mark-barican",
  /** Drop the real PDF into /public to enable the download button. */
  resume: "/Mark_Barican_Software_Web_Developer_Resume.pdf",
} as const;

/** Footer links that are pages rather than sections of the home page. */
export const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
] as const;

/**
 * Shown at the top of both legal pages. One constant so the two can never
 * disagree about when they were last revised. Update it when the wording
 * changes, not on every deploy.
 */
export const LEGAL_UPDATED = "15 August 2026";

/** In-page navigation, also used for active-section detection. */
export const NAV_SECTIONS = [
  { label: "Home", href: "#home", id: "home" },
  { label: "Journey", href: "#journey", id: "journey" },
  { label: "Work", href: "#work", id: "work" },
  { label: "Stack", href: "#stack", id: "stack" },
  { label: "What You Get", href: "#capabilities", id: "capabilities" },
  { label: "About", href: "#about", id: "about" },
  { label: "Contact", href: "#contact", id: "contact" },
] as const;
