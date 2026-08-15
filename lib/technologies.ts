/**
 * The stack, grouped by where each tool lives.
 *
 * Deliberately free of icon imports. The brand marks are attached in the Stack
 * section itself, which is a server component: that keeps ~50 logo paths in the
 * rendered HTML and out of the client bundle entirely, while this module stays
 * importable from anywhere (the screen-reader list, metadata) without dragging
 * react-icons along with it.
 *
 * Groups and membership mirror the skills section of the published site, so the
 * two cannot drift.
 */
export interface TechnologyGroup {
  /** Discipline heading. */
  title: string;
  /** One line on what the group is for. */
  note: string;
  items: readonly string[];
}

export const TECHNOLOGY_GROUPS: readonly TechnologyGroup[] = [
  {
    title: "Languages",
    note: "The foundations I build on.",
    items: [
      "TypeScript",
      "JavaScript",
      "Python",
      "Java",
      "C++",
      "C",
      "PHP",
      "Dart",
      "SQL",
    ],
  },
  {
    title: "Frontend",
    note: "Interfaces that feel fast and intentional.",
    items: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "GSAP",
      "Framer Motion",
      "Three.js",
      "Bootstrap",
      "jQuery",
      "HTML5",
      "CSS3",
    ],
  },
  {
    title: "Backend & APIs",
    note: "Reliable services and clean contracts.",
    items: [
      "Node.js",
      "Laravel",
      "Prisma",
      "REST APIs",
      "GraphQL",
      "JWT Auth",
    ],
  },
  {
    title: "Databases & E-Commerce",
    note: "Where the data lives and the sales happen.",
    items: [
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "SQLite",
      "Firebase",
      "Shopify",
      "Liquid",
      "Hydrogen",
      "Oxygen",
    ],
  },
  {
    title: "Cloud & DevOps",
    note: "Shipping and keeping things online.",
    items: ["Vercel", "Google Cloud", "Cloudflare", "Apache", "Git", "GitHub"],
  },
  {
    title: "Tools & AI",
    note: "Force multipliers in my daily workflow.",
    items: [
      "Claude Code",
      "Codex",
      "n8n",
      "Figma",
      "Unity",
      "Blender",
      "Photoshop",
      "Pandas",
      "NumPy",
      "TensorFlow",
      "Plotly",
    ],
  },
];

/** Every technology, flattened. Derived so it can never fall out of step. */
export const TECHNOLOGY_NAMES: readonly string[] = TECHNOLOGY_GROUPS.flatMap(
  (group) => group.items,
);
