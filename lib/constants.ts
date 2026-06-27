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
    "Full-stack developer with 5+ years shipping production web apps with Next.js, React, TypeScript, Node.js and PostgreSQL — from e-commerce and 3D web to full-stack systems.",
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
  resume: "/Mark_Barican_Resume.pdf",
} as const;

/** In-page navigation, also used for active-section detection. */
export const NAV_SECTIONS = [
  { label: "Home", href: "#home", id: "home" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "About", href: "#about", id: "about" },
  { label: "Contact", href: "#contact", id: "contact" },
] as const;
