# Mark Barican — Portfolio

An editorial, poster-style personal portfolio for **Mark Luis F. Barican**, Full-Stack Developer. Warm bone canvas, black ink, electric-yellow accent, oversized expanded-caps typography, marquee strips, a draggable story timeline, and a numbered work index — all on a strict, single-palette design system.

## Palette

Bone canvas, black ink, electric-yellow accent — all defined once as CSS tokens
in `app/globals.css` (`@theme`).

| Token      | Value     |
| ---------- | --------- |
| Background | `#d5cfbe` |
| Card       | `#ebeada` |
| Ink (text) | `#0a0a0a` |
| Accent     | `#ffff23` |
| Green      | `#60d574` |

## Tech Stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript** (strict, `noUncheckedIndexedAccess`)
- **Tailwind CSS v4** (CSS-first `@theme` tokens)
- **Framer Motion** (draggable timeline, cursor, marquee reveals, modal)
- **React Icons** (Simple Icons / Lucide / Font Awesome)
- **Resend** for the contact form (`app/api/contact`)
- **Archivo** variable font, the only family on the page: the width axis drives
  the expanded display headlines, regular widths carry body copy and the
  spaced-caps `.eyebrow` labels
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
  ui/                 # primitives: Button, Container, SectionHeading, Marquee,
                      #   Reveal, Magnetic, AnimatedCounter, Toast
  sections/           # Hero, Journey, Projects, WhatYouGet, About, Contact
  Header, Footer, ScrollProgress, Cursor, Noise, LoadingScreen,
  ProjectModal, ProjectThumb
hooks/                # useActiveSection, useMediaQuery, usePrefersReducedMotion
lib/                  # data.ts (resume content), constants.ts, utils.ts, og.tsx
types/                # shared TypeScript interfaces
public/               # logo.svg, resume PDF (+ your images go here)
```

All resume content lives in **`lib/data.ts`** — it is the single source of truth.
Site-level config (URL, email, links, nav) lives in **`lib/constants.ts`**.

## Content

- **Resume content** — `lib/data.ts` (projects, journey chapters, capabilities,
  experience, certifications, stats).
- **Portraits** — `public/Hero-Portrait.png` (the hero cutout; must keep its
  transparent background, since the headline passes behind the silhouette) and
  `public/About-Photo.jpg` (about polaroid).
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

## Conventions worth knowing

- **Dark sections** carry `data-surface="dark"`. The custom cursor hit-tests
  for it, and the header uses it to flip the wordmark to the light palette.
  Any new ink-coloured section must set it.
- **Display type** is sized in viewport units with no rem floor
  (`.display-hero`, `.display-section`), so the longest unbreakable word always
  fits. Widening a headline means re-checking those multipliers.
- `mix-blend-difference` is deliberately *not* used for the cursor or wordmark:
  their own `z-index` creates a stacking context, leaving no page backdrop to
  blend against.

## Accessibility & Performance

- Reduced-motion is respected globally (CSS media query + a JS hook gating
  Framer Motion).
- Keyboard-accessible: skip link, focus-visible rings, `aria-expanded` on
  disclosures, dialog semantics + Esc-to-close on the project modal.
- Fully static output, lazy/optional effects, system-preference theming.
- SEO: Metadata API, OpenGraph + Twitter cards, sitemap, robots, and
  `Person` structured data.
