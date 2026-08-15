import type { IconType } from "react-icons";
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
  SiGsap,
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
  SiPlotly,
  SiTensorflow,
} from "react-icons/si";
import { FaJava } from "react-icons/fa6";
import { DiPhotoshop } from "react-icons/di";
import { LuDatabase, LuServer, LuDroplet, LuContainer, LuCloud } from "react-icons/lu";

/**
 * Brand marks keyed by technology name, kept apart from `lib/technologies.ts`
 * so the name list stays free of icon imports.
 *
 * Import this only from server components. Doing so renders ~50 logo paths
 * straight into the HTML and ships none of them as client JavaScript.
 *
 * A handful of entries have no brand mark to use: Simple Icons carries no logo
 * for a query language, an architectural style or a Shopify runtime, so those
 * fall back to a neutral glyph that describes the category instead. Anything
 * missing from this map renders as a name with no mark rather than breaking.
 */
export const TECH_MARKS: Record<string, IconType> = {
  // Languages
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  Python: SiPython,
  Java: FaJava,
  "C++": SiCplusplus,
  C: SiC,
  PHP: SiPhp,
  Dart: SiDart,
  SQL: LuDatabase,

  // Frontend
  React: SiReact,
  "Next.js": SiNextdotjs,
  "Tailwind CSS": SiTailwindcss,
  GSAP: SiGsap,
  "Framer Motion": SiFramer,
  "Three.js": SiThreedotjs,
  Bootstrap: SiBootstrap,
  jQuery: SiJquery,
  HTML5: SiHtml5,
  CSS3: SiCss,

  // Backend & APIs
  "Node.js": SiNodedotjs,
  Laravel: SiLaravel,
  Prisma: SiPrisma,
  "REST APIs": LuServer,
  GraphQL: SiGraphql,
  "JWT Auth": SiJsonwebtokens,

  // Databases & E-Commerce
  PostgreSQL: SiPostgresql,
  MySQL: SiMysql,
  MongoDB: SiMongodb,
  SQLite: SiSqlite,
  Firebase: SiFirebase,
  Shopify: SiShopify,
  Liquid: LuDroplet,
  Hydrogen: LuContainer,
  Oxygen: LuCloud,

  // Cloud & DevOps
  Vercel: SiVercel,
  "Google Cloud": SiGooglecloud,
  Cloudflare: SiCloudflare,
  Apache: SiApache,
  Git: SiGit,
  GitHub: SiGithub,

  // Tools & AI
  "Claude Code": SiClaude,
  Codex: SiOpenai,
  n8n: SiN8N,
  Figma: SiFigma,
  Unity: SiUnity,
  Blender: SiBlender,
  Photoshop: DiPhotoshop,
  Pandas: SiPandas,
  NumPy: SiNumpy,
  TensorFlow: SiTensorflow,
  Plotly: SiPlotly,
};
