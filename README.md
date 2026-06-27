# Mark Barican — Portfolio

A premium, dark, cinematic personal portfolio for **Mark Luis F. Barican**, Full-Stack Developer. Built to feel expensive: glassmorphism where it earns its place, subtle borders, tasteful motion, and a strict, single-palette design system.

## Palette

Black canvas, deep-teal surfaces, warm-orange accent, soft off-white text — all
defined once as CSS tokens in `app/globals.css` (`@theme`).

| Token      | Value     |
| ---------- | --------- |
| Background | `#000000` |
| Teal (2nd) | `#233D4D` |
| Accent     | `#FE7F2D` |
| Text       | `#EAECF0` |

## Tech Stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript** (strict, `noUncheckedIndexedAccess`)
- **Tailwind CSS v4** (CSS-first `@theme` tokens)
- **Framer Motion** + **GSAP** (GSAP drives the StaggeredMenu)
- **React Bits** components — `GlassIcons` (skills) and `StaggeredMenu` (nav),
  ported to TypeScript and re-themed in `components/reactbits/`
- **React Icons** (Simple Icons / Lucide / Font Awesome)
- **Resend** for the contact form (`app/api/contact`)
- **Geist** font (sans + mono)
- **ESLint** + **Prettier** (with Tailwind class sorting)
- Vercel-ready (zero config)

## Getting Started

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build (also type-checks + lints)
npm run start      # serve the production build
npm run lint       # eslint
npm run format     # prettier --write
```

## Project Structure

```
app/
  layout.tsx          # root layout: fonts, metadata, JSON-LD, global chrome
  page.tsx            # composes the section modules
  globals.css         # design tokens (@theme), base layer, components, keyframes
  not-found.tsx       # custom 404
  api/contact/route.ts# Resend-backed contact form endpoint (POST)
  sitemap.ts          # /sitemap.xml
  robots.ts           # /robots.txt
  icon.tsx            # generated favicon (next/og)
  apple-icon.tsx      # generated apple touch icon
  opengraph-image.tsx # generated OG share image
  twitter-image.tsx   # generated Twitter share image
components/
  ui/                 # primitives: Button, Badge, Container, SectionTitle,
                      #   Reveal, Magnetic, AnimatedCounter
  sections/           # Hero, Projects, Experience, Skills, About,
                      #   Certifications, Contact
  reactbits/          # GlassIcons + StaggeredMenu (React Bits, TS + themed CSS)
  Menu, Footer, ScrollProgress, Cursor, Noise, AnimatedBackground,
  LoadingScreen, ProjectCard, ProjectCardCompact, ProjectModal, ProjectThumb
hooks/                # useActiveSection, useMediaQuery, usePrefersReducedMotion
lib/                  # data.ts (resume content), constants.ts, utils.ts, og.tsx
types/                # shared TypeScript interfaces
public/               # logo.svg, resume PDF (+ your images go here)
```

All resume content lives in **`lib/data.ts`** — it is the single source of truth.
Site-level config (URL, email, links, nav) lives in **`lib/constants.ts`**.

## Replacing Placeholders

Search for `TODO` comments. The main items:

- **Project screenshots** — `components/ProjectThumb.tsx` and the gallery tiles in
  `components/ProjectModal.tsx` render elegant generated placeholders. Drop real
  images in `public/projects/<id>.png` and swap in `next/image`.
- **Portrait** — `components/sections/About.tsx` has a monogram placeholder.
- **Resume** — `public/Mark_Barican_Resume.pdf` is wired to the download button.
- **Production URL** — set `NEXT_PUBLIC_SITE_URL` on Vercel (used by metadata,
  canonical URL, sitemap, robots, and structured data).

## Contact form (Resend)

The contact form posts to `app/api/contact/route.ts`, which sends the message
with [Resend](https://resend.com). Configure via env vars (see `.env.example`):

```bash
RESEND_API_KEY=re_xxx          # from resend.com/api-keys
CONTACT_TO_EMAIL=you@email.com # inbox that receives submissions
```

`.env.local` is gitignored — **never commit your API key**. The route validates
input, includes a honeypot for bots, and HTML-escapes user content. It currently
sends `from: onboarding@resend.dev` (works without a verified domain, but only
delivers to the account owner's email). To send from your own address and to any
recipient, verify a domain in Resend and update the `from` in the route.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. On [vercel.com/new](https://vercel.com/new), import the repo. Vercel
   auto-detects Next.js — no build settings needed.
3. Add environment variables (Project → Settings → Environment Variables):
   `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`.
4. Deploy. Subsequent pushes deploy automatically.

## Accessibility & Performance

- Reduced-motion is respected globally (CSS media query + a JS hook gating
  Framer Motion).
- Keyboard-accessible: skip link, focus-visible rings, `aria-expanded` on
  disclosures, dialog semantics + Esc-to-close on the project modal.
- Fully static output, lazy/optional effects, system-preference theming.
- SEO: Metadata API, OpenGraph + Twitter cards, sitemap, robots, and
  `Person` structured data.
