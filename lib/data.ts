import {
  SiTypescript,
  SiJavascript,
  SiPython,
  SiCplusplus,
  SiC,
  SiPhp,
  SiDart,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiFramer,
  SiThreedotjs,
  SiBootstrap,
  SiJquery,
  SiHtml5,
  SiCss,
  SiNodedotjs,
  SiLaravel,
  SiPrisma,
  SiGraphql,
  SiJsonwebtokens,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiSqlite,
  SiFirebase,
  SiShopify,
  SiVercel,
  SiGooglecloud,
  SiCloudflare,
  SiCisco,
  SiAlibabacloud,
  SiApache,
  SiGit,
  SiGithub,
  SiClaude,
  SiOpenai,
  SiN8N,
  SiFigma,
  SiUnity,
  SiBlender,
  SiPandas,
  SiNumpy,
  SiTensorflow,
  SiPlotly,
} from "react-icons/si";
import {
  FaJava,
  FaLinkedinIn,
  FaGithub,
  FaArrowUpRightFromSquare,
} from "react-icons/fa6";
import {
  LuDatabase,
  LuServer,
  LuDroplet,
  LuContainer,
  LuCloud,
  LuMail,
  LuShieldCheck,
  LuNetwork,
  LuLandmark,
  LuBike,
  LuDices,
  LuClapperboard,
  LuWrench,
  LuHeart,
  LuCode,
  LuSparkles,
  LuFlower2,
  LuGamepad2,
} from "react-icons/lu";
import { DiPhotoshop } from "react-icons/di";
import type { IconType } from "react-icons";
import type {
  Certification,
  ExperienceItem,
  Project,
  SkillCategory,
  SocialLink,
  Stat,
} from "@/types";
import { LINKS, SITE } from "@/lib/constants";

/* -------------------------------------------------------------------------- */
/*  About — summary + headline stats                                          */
/* -------------------------------------------------------------------------- */

export const SUMMARY =
  "Full-stack developer with 5+ years building and shipping production web applications across freelance and contract work. Fluent in the modern web stack — Next.js, React, TypeScript, Node.js, and PostgreSQL — with hands-on experience in e-commerce (Shopify/Liquid), full-stack systems, and interactive 3D web. I own projects end to end: requirements, architecture, client communication, and deployment.";

export const STATS: Stat[] = [
  { value: 5, suffix: "+", label: "Years Experience" },
  { value: 4, suffix: "+", label: "Client Projects" },
  { value: 5000, suffix: "+", label: "Users Reached" },
  { value: 100, suffix: "", label: "Lighthouse Peaks" },
];

/* -------------------------------------------------------------------------- */
/*  Skills — grouped by discipline                                            */
/* -------------------------------------------------------------------------- */

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Languages",
    description: "The foundations I build on.",
    skills: [
      { name: "TypeScript", icon: SiTypescript },
      { name: "JavaScript", icon: SiJavascript },
      { name: "Python", icon: SiPython },
      { name: "Java", icon: FaJava },
      { name: "C++", icon: SiCplusplus },
      { name: "C", icon: SiC },
      { name: "PHP", icon: SiPhp },
      { name: "Dart", icon: SiDart },
      { name: "SQL", icon: LuDatabase },
    ],
  },
  {
    title: "Frontend",
    description: "Interfaces that feel fast and intentional.",
    skills: [
      { name: "React", icon: SiReact },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "Tailwind CSS", icon: SiTailwindcss },
      { name: "Framer Motion", icon: SiFramer },
      { name: "Three.js", icon: SiThreedotjs },
      { name: "Bootstrap", icon: SiBootstrap },
      { name: "jQuery", icon: SiJquery },
      { name: "HTML5", icon: SiHtml5 },
      { name: "CSS3", icon: SiCss },
    ],
  },
  {
    title: "Backend & APIs",
    description: "Reliable services and clean contracts.",
    skills: [
      { name: "Node.js", icon: SiNodedotjs },
      { name: "Laravel", icon: SiLaravel },
      { name: "Prisma", icon: SiPrisma },
      { name: "REST APIs", icon: LuServer },
      { name: "GraphQL", icon: SiGraphql },
      { name: "JWT Auth", icon: SiJsonwebtokens },
    ],
  },
  {
    title: "Databases & E-Commerce",
    description: "Where the data lives and the sales happen.",
    skills: [
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "MySQL", icon: SiMysql },
      { name: "MongoDB", icon: SiMongodb },
      { name: "SQLite", icon: SiSqlite },
      { name: "Firebase", icon: SiFirebase },
      { name: "Shopify", icon: SiShopify },
      { name: "Liquid", icon: LuDroplet },
      { name: "Hydrogen", icon: LuContainer },
      { name: "Oxygen", icon: LuCloud },
    ],
  },
  {
    title: "Cloud & DevOps",
    description: "Shipping and keeping things online.",
    skills: [
      { name: "Vercel", icon: SiVercel },
      { name: "Google Cloud", icon: SiGooglecloud },
      { name: "Cloudflare", icon: SiCloudflare },
      { name: "Apache", icon: SiApache },
      { name: "Git", icon: SiGit },
      { name: "GitHub", icon: SiGithub },
    ],
  },
  {
    title: "Tools & AI",
    description: "Force multipliers in my daily workflow.",
    skills: [
      { name: "Claude Code", icon: SiClaude },
      { name: "Codex", icon: SiOpenai },
      { name: "n8n", icon: SiN8N },
      { name: "Figma", icon: SiFigma },
      { name: "Unity", icon: SiUnity },
      { name: "Blender", icon: SiBlender },
      { name: "Photoshop", icon: DiPhotoshop },
      { name: "Pandas", icon: SiPandas },
      { name: "NumPy", icon: SiNumpy },
      { name: "TensorFlow", icon: SiTensorflow },
      { name: "Plotly", icon: SiPlotly },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Experience timeline                                                       */
/* -------------------------------------------------------------------------- */

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: "freelance",
    role: "Freelance Software Engineer / Full-Stack Developer",
    company: "Self-Employed",
    icon: LuCode,
    type: "Freelance",
    period: "Mar 2021 — Present",
    stack: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "MySQL"],
    highlights: [
      "Delivered 4 end-to-end client engagements — custom websites and web-based systems — owning scope from requirements to deployment.",
      "Built production web apps with Next.js, React, TypeScript and Node.js on PostgreSQL/MySQL, managing client requirements and timelines directly.",
    ],
  },
  {
    id: "rise",
    role: "E-Commerce Developer",
    company: "Rise Beauty & Wellness Corp",
    icon: LuSparkles,
    type: "Contract",
    period: "May — Jul 2025",
    stack: ["E-Commerce", "Responsive UI", "Storefront"],
    highlights: [
      "Developed and deployed a responsive e-commerce website for a skincare brand, building product catalog pages and customer-facing storefront UI.",
    ],
  },
  {
    id: "boxed-blossoms",
    role: "Frontend Developer",
    company: "Boxed Blossoms",
    icon: LuFlower2,
    type: "Remote",
    location: "Makati, PH",
    period: "Nov 2024 — Feb 2025",
    stack: ["Shopify", "Hydrogen", "Oxygen", "GraphQL", "Liquid"],
    highlights: [
      "Revamped the company's full Shopify storefront within a 3-developer team led by a project manager; the site launched and remains live in production.",
      "Architected the initial build on Shopify Hydrogen with Oxygen deployment and GraphQL, then re-platformed to Shopify themes and Liquid to meet delivery timelines.",
      "Drove timeline and requirement decisions with transparent client communication; customized storefront design and functionality via Liquid, Shopify apps and Photoshop.",
    ],
  },
  {
    id: "definite-studios",
    role: "Game Development Apprentice",
    company: "Definite Studios",
    icon: LuGamepad2,
    location: "Quezon City, PH",
    period: "2021",
    stack: ["Unity", "C#", "Game Physics", "Photoshop"],
    highlights: [
      "Built 2D platformer, side-scroller and 3D shooter prototypes in Unity, implementing core game mechanics and physics.",
      "Produced game-ready assets in Photoshop.",
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Projects — featured + additional                                          */
/* -------------------------------------------------------------------------- */

export const PROJECTS: Project[] = [
  {
    id: "loanlink",
    title: "LoanLink",
    tagline: "Full-Stack Loan Management System",
    category: "Full-Stack",
    icon: LuLandmark,
    description:
      "A production loan platform with multi-role authentication, repayment scheduling, payment processing and a live analytics dashboard.",
    overview:
      "LoanLink is an end-to-end loan management system that models the full lifecycle of a loan — from origination to repayment — behind a role-aware interface. Admins, managers and staff each see a workflow scoped to their permissions, backed by a live analytics dashboard. The project was nominated for the Inabel Awards for design and experience innovation.",
    tech: ["Next.js 15", "React 19", "PostgreSQL", "Tailwind CSS", "JWT"],
    features: [
      "Multi-role authentication across Admin / Manager / Staff tiers",
      "Repayment scheduling and payment processing",
      "Live analytics dashboard",
      "JWT-based role access control isolating each workflow",
    ],
    challenges: [
      "Three permission tiers needed to share one codebase without leaking data or actions across roles.",
      "Financial data and repayment schedules had to stay accurate and auditable.",
    ],
    solutions: [
      "Implemented JWT-based role access control that isolates routes, data and actions per tier.",
      "Centralised repayment logic and surfaced it through a live analytics dashboard for transparency.",
    ],
    links: {
      repo: "https://github.com/Mark-Barican/LoanLink_Finals",
      live: "https://loan-link-finals.vercel.app",
    },
    featured: true,
    accent: ["#8b5cf6", "#2563eb"],
    cover: "/LoanLink_images/LoanLink_Hero_image.png",
    gallery: [
      "/LoanLink_images/admin-dashboard.png",
      "/LoanLink_images/companies.png",
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
      "A multi-page storefront with an interactive Three.js / WebGL viewer for real-time 3D product rotation, zoom and inspection. (Client demo.)",
    overview:
      "Vintage Rider Manila is a full e-commerce storefront built around an immersive product experience. Beyond the usual catalog, cart and accounts, each product can be inspected in 3D — rotated, zoomed and examined in real time through a WebGL viewer. Built as a client demo.",
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
      "A simulation engine modeling soft/hard pity, spark guarantees and banner rules — validated against official rates and adopted by 5,000+ users.",
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
      "A high-end, cinematic single-page brand site with animated section transitions — scoring 94–100 Performance, 100 SEO, 100 Best Practices, 96 Accessibility.",
    overview:
      "Recraft is a cinematic single-page brand site designed and built for impact. Animated section transitions and a responsive, content-driven layout carry the brand story, while staying ruthlessly fast — it scored 94–100 Performance, 100 SEO, 100 Best Practices and 96 Accessibility in Lighthouse. Built as a client demo.",
    tech: ["Next.js", "TypeScript", "CSS"],
    features: [
      "Cinematic single-page narrative with animated section transitions",
      "Responsive, content-driven layout",
      "Lighthouse 94–100 Performance",
      "100 SEO · 100 Best Practices · 96 Accessibility",
    ],
    challenges: [
      "Heavy cinematic motion usually comes at the cost of performance and accessibility.",
      "The layout had to stay content-driven and responsive across devices.",
    ],
    solutions: [
      "Tuned animations and assets to keep Lighthouse Performance in the 94–100 range.",
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
    id: "weride",
    title: "WeRide",
    tagline: "Parts Catalog & Lead-Gen Storefront",
    category: "E-Commerce",
    icon: LuWrench,
    description:
      "A parts catalog and lead-generation storefront tuned for search and speed — Lighthouse 100 SEO and 91 mobile performance.",
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
      "A playful interactive Three.js experience exploring real-time 3D scenes and motion on the web.",
    overview:
      "Valentine's 2026 is an interactive Three.js experience — a small, expressive playground for real-time 3D scenes and web motion, built to push the interactive and creative side of frontend development.",
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

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured);
export const ADDITIONAL_PROJECTS = PROJECTS.filter((p) => !p.featured);

/* -------------------------------------------------------------------------- */
/*  Education + certifications                                                 */
/* -------------------------------------------------------------------------- */

export const EDUCATION = {
  degree: "BS in Computer Science",
  school: "CIIT College of Innovation and Integrated Technology",
  location: "Manila, PH",
} as const;

export const CERTIFICATIONS: Certification[] = [
  { issuer: "Cisco", title: "Introduction to Networks", icon: LuNetwork },
  { issuer: "Cisco", title: "Introduction to Cybersecurity", icon: SiCisco },
  { issuer: "IBM", title: "Cybersecurity Fundamentals", icon: LuShieldCheck },
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

/** Tech badges credited in the footer. */
export const BUILT_WITH: { name: string; icon: IconType }[] = [
  { name: "Next.js", icon: SiNextdotjs },
  { name: "Framer Motion", icon: SiFramer },
  { name: "Vercel", icon: SiVercel },
];

export const EXTERNAL_LINK_ICON = FaArrowUpRightFromSquare;
