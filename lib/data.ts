import {
  SiNextdotjs,
  SiGsap,
  SiVercel,
  SiCisco,
  SiAlibabacloud,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiResend,
} from "react-icons/si";
import { FaLinkedinIn, FaGithub } from "react-icons/fa6";
import {
  LuMail,
  LuLandmark,
  LuBike,
  LuDices,
  LuClapperboard,
  LuWrench,
  LuHeart,
  LuUtensilsCrossed,
} from "react-icons/lu";
import type { IconType } from "react-icons";
import type {
  Capability,
  Certification,
  JourneyItem,
  Project,
  SocialLink,
  Stat,
} from "@/types";
import { LINKS, SITE } from "@/lib/constants";

/* -------------------------------------------------------------------------- */
/*  About: summary + headline stats                                          */
/* -------------------------------------------------------------------------- */

/**
 * The About introduction.
 *
 * Deliberately two short sentences. The previous version listed the stack in
 * the middle of it, which turned a personal introduction into a résumé line and
 * made it long enough that the typing reveal it drives outlasted the reader's
 * patience. The stack already has a whole section to itself.
 */
export const SUMMARY =
  "I'm a full-stack developer in Quezon City. I take products from the first conversation through to live deployment, and I own every part in between.";

export const STATS: Stat[] = [
  { value: 5, suffix: "+", label: "Years Experience" },
  { value: 4, suffix: "+", label: "Client Projects" },
  { value: 5000, suffix: "+", label: "Users Reached" },
  { value: 100, suffix: "", label: "Lighthouse Peaks" },
];


/* -------------------------------------------------------------------------- */
/*  Journey: the story timeline, built from the experience above             */
/* -------------------------------------------------------------------------- */

export const JOURNEY: JourneyItem[] = [
  {
    year: "'21",
    fullYear: "2021",
    title: "Where it started",
    short:
      "A game studio apprenticeship. Unity, C#, and the moment code became something you could feel.",
    story:
      "At Definite Studios I built 2D platformers, side-scrollers and a 3D shooter prototype in Unity: mechanics, physics, even the Photoshop assets. Games taught me software isn't just logic, it's experience. That same year I took my first freelance job, and I've been shipping for clients ever since.",
    handle: "@definitestudios",
  },
  {
    year: "'22",
    fullYear: "2022",
    title: "Going full-stack",
    short:
      "Client work pulled me out of tutorials and into real production problems.",
    story:
      "Freelance projects meant auth, databases, deployments and clients with deadlines. Next.js and TypeScript became home base, PostgreSQL and Node the engine room. Computer Science at CIIT by day, client work by night.",
    handle: "@ciit",
  },
  {
    year: "'24",
    fullYear: "2024",
    title: "First production storefront",
    short:
      "A 3-dev team, a full Shopify storefront revamp. It launched, and it's still live.",
    story:
      "At Boxed Blossoms I architected the initial build on Shopify Hydrogen with Oxygen and GraphQL, then made the hard call to re-platform to themes and Liquid to hit the deadline. Real team, real client, real launch. The storefront is still in production today.",
    handle: "@boxedblossoms",
  },
  {
    year: "'25",
    fullYear: "2025",
    title: "Shipping season",
    short:
      "A skincare storefront, an award-nominated loan platform, and a simulator that found 5,000+ users.",
    story:
      "Delivered a responsive e-commerce site for Rise Beauty & Wellness. Built LoanLink, a full loan management system nominated for the Inabel Awards. And a probability engine I made for fun, the Endfield Gacha Simulator, quietly grew past 5,000 users. Everything compounding at once.",
    handle: "@rise",
  },
  {
    year: "'26",
    fullYear: "2026",
    title: "The journey continues",
    short:
      "Interactive 3D, AI-accelerated workflows, and whatever ships next. Open to work.",
    story:
      "Now I'm folding Three.js and WebGL into client work, running Claude Code and n8n in my daily loop, and looking for the next thing worth building. Five years in, still obsessed.",
    handle: "@mark",
  },
];

/* -------------------------------------------------------------------------- */
/*  Capabilities: the "What You Get" rows (condensed from the skills)        */
/* -------------------------------------------------------------------------- */

export const CAPABILITIES: Capability[] = [
  {
    title: "Full-Stack Development",
    description:
      "Requirements to deployment, owned by one person. No handoffs, no gaps.",
    tools: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL"],
  },
  {
    title: "E-Commerce & Shopify",
    description:
      "Storefronts that sell. Shopify themes, Liquid, and headless Hydrogen builds.",
    tools: ["Shopify", "Liquid", "Hydrogen", "GraphQL"],
  },
  {
    title: "Interactive 3D & Motion",
    description:
      "Three.js product viewers and motion that communicates instead of decorating.",
    tools: ["Three.js", "WebGL", "Framer Motion", "GSAP"],
  },
  {
    title: "Performance & SEO",
    description:
      "Lighthouse peaks of 100. Speed and search built in, not bolted on after.",
    tools: ["Lighthouse 100", "Technical SEO", "Core Web Vitals"],
  },
  {
    title: "AI-Accelerated Workflow",
    description:
      "Claude Code, Codex and n8n in the daily loop. Faster iterations, same standards.",
    tools: ["Claude Code", "Codex", "n8n"],
  },
];

/* -------------------------------------------------------------------------- */
/*  Projects: featured + additional                                          */
/* -------------------------------------------------------------------------- */

export const PROJECTS: Project[] = [
  {
    id: "loanlink",
    title: "LoanLink",
    tagline: "Full-Stack Loan Management System",
    category: "Full-Stack",
    icon: LuLandmark,
    description:
      "A production loan platform with role-based access, repayment scheduling and live analytics. Nominated for the Inabel Awards.",
    overview:
      "LoanLink is an end-to-end loan management system that models the full lifecycle of a loan, from origination to repayment, behind a role-aware interface. Admins, managers and staff each see a workflow scoped to their permissions, backed by a live analytics dashboard. The project was nominated for the Inabel Awards for design and experience innovation.",
    tech: ["Next.js 15", "React 19", "PostgreSQL", "Tailwind CSS", "Chart.js"],
    features: [
      "Multi-role authentication across Admin / Manager / Staff tiers",
      "Repayment schedules with overdue tracking and payment recording",
      "Live portfolio dashboard: lent, collected, outstanding and overdue",
      "Collections and borrower reporting charted over a rolling 12 months",
    ],
    challenges: [
      "Three permission tiers needed to share one codebase without leaking data or actions across roles.",
      "Philippine add-on interest had to reconcile to the centavo across every schedule, payment and report.",
    ],
    solutions: [
      "Authorised every API route by role, so each tier only reaches the records and actions it owns.",
      "Centralised the add-on interest maths on fixed two-decimal money and surfaced the result through one live dashboard.",
    ],
    links: {
      repo: "https://github.com/Mark-Barican/LoanLink_Finals",
      live: "https://loan-link-finals.vercel.app",
    },
    featured: true,
    accent: ["#16a34a", "#14532d"],
    cover: "/LoanLink_images/admin-dashboard.png",
    gallery: [
      "/LoanLink_images/sign-in.png",
      "/LoanLink_images/repayments.png",
      "/LoanLink_images/reports.png",
    ],
  },
  {
    id: "vintage-rider-manila",
    title: "Vintage Rider Manila",
    tagline: "E-Commerce Storefront with 3D Product Viewer",
    category: "E-Commerce",
    icon: LuBike,
    description:
      "A storefront where every product can be rotated and inspected in real-time 3D. Client demo.",
    overview:
      "Vintage Rider Manila is a full e-commerce storefront built around an immersive product experience. Beyond the usual catalog, cart and accounts, each product can be inspected in 3D: rotated, zoomed and examined in real time through a WebGL viewer. Built as a client demo.",
    tech: ["Next.js", "TypeScript", "Three.js", "WebGL"],
    features: [
      "Multi-page storefront with product catalog and category filtering",
      "Persistent cart state across the session",
      "User accounts and authentication",
      "Interactive Three.js / WebGL 3D product viewer",
    ],
    challenges: [
      "Real-time 3D inspection had to feel smooth without tanking page performance.",
      "Cart and auth state needed to persist across a multi-page journey.",
    ],
    solutions: [
      "Integrated a focused Three.js / WebGL viewer for real-time rotation, zoom and inspection.",
      "Built persistent cart and account state across the full storefront flow.",
    ],
    links: {
      repo: "https://github.com/Mark-Barican/VRM_demo",
      live: "https://vrm-demo-umber.vercel.app",
    },
    featured: true,
    accent: ["#3b82f6", "#1e3a8a"],
    cover: "/VRM_images/VRM_hero_image.png",
    gallery: [
      "/VRM_images/helmet.png",
      "/VRM_images/page.png",
      "/VRM_images/shop.png",
    ],
  },
  {
    id: "endfield-gacha-simulator",
    title: "Endfield Gacha Simulator",
    tagline: "Probability Simulation Engine",
    category: "Simulation",
    icon: LuDices,
    description:
      "A probability engine matching the game's real pity and spark rules. Used by 5,000+ people.",
    overview:
      "Endfield Gacha Simulator is a probability engine that reproduces a gacha system's real mechanics: soft and hard pity thresholds, spark guarantees and banner-specific rules. Outcomes are validated against officially published rates so simulations stay accurate and reproducible. The tool has been adopted by 5,000+ users.",
    tech: ["Next.js", "TypeScript", "Python"],
    features: [
      "Models soft / hard pity thresholds",
      "Spark guarantees and banner-specific rules",
      "Validated against official published rates",
      "Accurate, reproducible pull simulations at scale",
    ],
    challenges: [
      "Probability output had to match official published rates exactly to be trusted.",
      "Results needed to stay reproducible for thousands of concurrent users.",
    ],
    solutions: [
      "Modeled pity, spark and banner rules explicitly and validated them against published rates.",
      "Built a deterministic, reproducible simulation core adopted by 5,000+ users.",
    ],
    links: {
      repo: "https://github.com/Mark-Barican/Endfield-gacha-simulator",
      live: "https://endfield-gacha-simulator.vercel.app",
    },
    featured: true,
    accent: ["#a78bfa", "#6366f1"],
    cover: "/Endfield_images/Endfield_hero_image.png",
  },
  {
    id: "recraft",
    title: "Recraft",
    tagline: "Cinematic Brand & Marketing Site",
    category: "Brand Site",
    icon: LuClapperboard,
    description:
      "A cinematic single-page brand site that still scores 100 SEO and near-perfect performance.",
    overview:
      "Recraft is a cinematic single-page brand site designed and built for impact. Animated section transitions and a responsive, content-driven layout carry the brand story, while staying ruthlessly fast: it scored 94-100 Performance, 100 SEO, 100 Best Practices and 96 Accessibility in Lighthouse. Built as a client demo.",
    tech: ["Next.js", "TypeScript", "CSS"],
    features: [
      "Cinematic single-page narrative with animated section transitions",
      "Responsive, content-driven layout",
      "Lighthouse 94-100 Performance",
      "100 SEO Â· 100 Best Practices Â· 96 Accessibility",
    ],
    challenges: [
      "Heavy cinematic motion usually comes at the cost of performance and accessibility.",
      "The layout had to stay content-driven and responsive across devices.",
    ],
    solutions: [
      "Tuned animations and assets to keep Lighthouse Performance in the 94-100 range.",
      "Kept SEO, Best Practices and Accessibility near-perfect alongside the visuals.",
    ],
    links: {
      repo: "https://github.com/Mark-Barican/recraft.bar",
      live: "https://recraft-bar.vercel.app",
    },
    featured: true,
    accent: ["#8b5cf6", "#1e3a8a"],
    cover: "/Recraft_images/Recraft_hero_image.png",
    gallery: ["/Recraft_images/img1.png", "/Recraft_images/img2.png"],
  },
  {
    id: "tora",
    title: "TORA",
    tagline: "Restaurant Brand & Menu Site",
    category: "Brand Site",
    icon: LuUtensilsCrossed,
    description:
      "A dark, photography-led site for a modern Japanese restaurant in BGC. Client demo.",
    overview:
      "TORA by Tiger is a single-page brand site for a modern Japanese restaurant concept in Bonifacio Global City. A dark, editorial art direction carries the chef's story, signature dishes, a fully sectioned menu, and visit and reservation details, with photography doing the heavy lifting. Built as a client demo.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    features: [
      "Chef story, signatures and a fully sectioned menu",
      "Dark, photography-led editorial art direction",
      "Reservation and visit details with clear calls to action",
      "Smooth anchor navigation across a single-page layout",
    ],
    challenges: [
      "A long single-page menu had to stay scannable and easy to navigate.",
      "The moody, image-heavy look could not come at the cost of performance.",
    ],
    solutions: [
      "Split the menu into anchored sections with persistent navigation.",
      "Served every photo through next/image with tuned sizes and quality.",
    ],
    links: {
      repo: "https://github.com/Mark-Barican/Tora_demo",
      live: "https://tora-demo.vercel.app",
    },
    featured: true,
    accent: ["#c2410c", "#450a0a"],
    cover: "/Tora_images/Tora_hero_image.png",
    gallery: ["/Tora_images/chef.jpg", "/Tora_images/dish.jpg"],
  },
  {
    id: "weride",
    title: "WeRide",
    tagline: "Parts Catalog & Lead-Gen Storefront",
    category: "E-Commerce",
    icon: LuWrench,
    description:
      "A parts catalog built to rank and convert. Lighthouse 100 SEO, 91 on mobile.",
    overview:
      "WeRide is a parts catalog and lead-generation storefront, built to rank and convert. It pairs a browsable catalog with lead capture and was tuned for search and mobile speed, landing a perfect 100 SEO score and 91 mobile performance in Lighthouse.",
    tech: ["Next.js", "TypeScript", "SEO"],
    features: [
      "Browsable parts catalog",
      "Lead-generation focused storefront",
      "Lighthouse 100 SEO",
      "91 mobile performance",
    ],
    challenges: [
      "The catalog had to be highly discoverable in search.",
      "Mobile performance needed to stay high with rich content.",
    ],
    solutions: [
      "Optimised metadata and structure for a perfect 100 SEO score.",
      "Tuned the mobile build to a 91 performance score.",
    ],
    links: {
      repo: "https://github.com/Mark-Barican/weride_demo",
      live: "https://weride-demo-site.vercel.app",
    },
    featured: false,
    accent: ["#60a5fa", "#2563eb"],
    cover: "/Weride_images/weride_hero_image.png",
    gallery: [
      "/Weride_images/about.png",
      "/Weride_images/browse.png",
      "/Weride_images/parts.png",
    ],
  },
  {
    id: "valentines-2026",
    title: "Valentine's 2026",
    tagline: "Three.js Interactive Experience",
    category: "Interactive",
    icon: LuHeart,
    description:
      "A playful Three.js experiment in real-time 3D scenes and web motion.",
    overview:
      "Valentine's 2026 is an interactive Three.js experience: a small, expressive playground for real-time 3D scenes and web motion, built to push the interactive and creative side of frontend development.",
    tech: ["Three.js", "WebGL", "JavaScript"],
    features: [
      "Real-time 3D scene rendering",
      "Interactive motion and camera",
      "Creative, experiential frontend",
    ],
    challenges: [
      "Real-time 3D needs to stay smooth in the browser.",
      "Interaction had to feel responsive and expressive.",
    ],
    solutions: [
      "Used Three.js / WebGL for performant real-time rendering.",
      "Layered interaction and motion for an expressive feel.",
    ],
    links: {
      repo: "https://github.com/Mark-Barican/Valentines_2026",
      live: "https://valentines-2026-phi.vercel.app",
    },
    featured: false,
    accent: ["#a78bfa", "#7c3aed"],
    cover: "/Valentines_images/Valentines_hero_image.png",
  },
];


/* -------------------------------------------------------------------------- */
/*  Derived figures: the hero's numbers, computed from the data above         */
/* -------------------------------------------------------------------------- */

/**
 * Single source for "what year is it" across the site, so the journey captions
 * and the hero's experience figure can never drift apart.
 */
export const CURRENT_YEAR = 2026;

/** Earliest year in the timeline: where the count of years building starts. */
const FIRST_YEAR = Math.min(...JOURNEY.map((chapter) => Number(chapter.fullYear)));

/**
 * Years spent building, measured from the first chapter of the journey rather
 * than typed in. Framed as "building", not "professional experience": the
 * timeline documents an apprenticeship and freelance work from 2021, which
 * supports the former and not the latter.
 */
export const YEARS_BUILDING = CURRENT_YEAR - FIRST_YEAR;

/**
 * Every distinct technology named by a project above, ordered by how many
 * projects use it. Version suffixes are folded in ("Next.js 15" → "Next.js")
 * so the same tool is not counted twice.
 *
 * Derived rather than hand-listed on purpose: the hero cannot advertise a
 * technology unless a project in this file actually ships it, and the count
 * cannot drift as projects are added or removed.
 */
export const PROJECT_TECHNOLOGIES: string[] = (() => {
  const counts = new Map<string, { uses: number; firstSeen: number }>();

  PROJECTS.forEach((project) => {
    project.tech.forEach((raw) => {
      // Drop a trailing major version: "React 19" and "React" are one tool.
      const name = raw.replace(/\s+\d[\d.]*$/, "");
      const entry = counts.get(name);
      if (entry) entry.uses += 1;
      else counts.set(name, { uses: 1, firstSeen: counts.size });
    });
  });

  return [...counts.entries()]
    .sort(
      ([, a], [, b]) => b.uses - a.uses || a.firstSeen - b.firstSeen,
    )
    .map(([name]) => name);
})();

/**
 * The three hero figures. Every value is computed, so none of them can be
 * inflated by editing a string: change the projects or the journey and these
 * follow.
 */
export const HERO_STATS: Stat[] = [
  { value: PROJECTS.length, label: "Projects" },
  { value: YEARS_BUILDING, suffix: "+", label: "Years Building" },
  { value: PROJECT_TECHNOLOGIES.length, label: "Technologies" },
];

/* -------------------------------------------------------------------------- */
/*  Education + certifications                                                 */
/* -------------------------------------------------------------------------- */

export const EDUCATION = {
  degree: "BS in Computer Science",
  school: "CIIT College of Innovation and Integrated Technology",
  location: "Manila, PH",
} as const;

export const CERTIFICATIONS: Certification[] = [
  { issuer: "Cisco", title: "Introduction to Networks", icon: SiCisco },
  { issuer: "Cisco", title: "Introduction to Cybersecurity", icon: SiCisco },
  { issuer: "IBM", title: "Cybersecurity Fundamentals", monogram: "IBM" },
  { issuer: "Alibaba Cloud", title: "AI Journey", icon: SiAlibabacloud },
];

export const LANGUAGES = [
  { name: "Filipino", level: "Native" },
  { name: "English", level: "Professional" },
] as const;

/* -------------------------------------------------------------------------- */
/*  Social / contact links                                                    */
/* -------------------------------------------------------------------------- */

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "Email",
    href: LINKS.email,
    icon: LuMail,
    handle: SITE.email,
  },
  {
    label: "GitHub",
    href: LINKS.github,
    icon: FaGithub,
    handle: "Mark-Barican",
  },
  {
    label: "LinkedIn",
    href: LINKS.linkedin,
    icon: FaLinkedinIn,
    handle: "mark-barican",
  },
];

/**
 * What this site itself runs on, for the ticker under the hero and the
 * footer credit.
 *
 * Scoped to the portfolio's own stack rather than everything Mark works with:
 * every entry here is a real dependency in package.json or the platform it is
 * deployed on, so the strip is a statement about this build and not a list of
 * logos. The wider toolkit is the Stack section's job.
 *
 * Resend is in the list because it is what actually delivers the contact form
 * (see app/api/contact/route.ts), not as decoration.
 */
export const BUILT_WITH: { name: string; role: string; icon: IconType }[] = [
  { name: "Next.js", role: "App Router & rendering", icon: SiNextdotjs },
  { name: "React", role: "UI library", icon: SiReact },
  { name: "TypeScript", role: "Type safety", icon: SiTypescript },
  { name: "Tailwind CSS", role: "Styling system", icon: SiTailwindcss },
  { name: "GSAP", role: "Scroll choreography", icon: SiGsap },
  { name: "Node.js", role: "Server runtime", icon: SiNodedotjs },
  { name: "Resend", role: "Contact delivery", icon: SiResend },
  { name: "Vercel", role: "Hosting & CI", icon: SiVercel },
];

