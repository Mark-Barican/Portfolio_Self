import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

import { LoadingScreen } from "@/components/LoadingScreen";
import { ScrollProgress } from "@/components/ScrollProgress";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Noise } from "@/components/Noise";
import { Cursor } from "@/components/Cursor";
import { Menu } from "@/components/Menu";
import { Footer } from "@/components/Footer";
import { LINKS, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.shortName} — ${SITE.role}`,
    template: `%s — ${SITE.shortName}`,
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  applicationName: `${SITE.shortName} Portfolio`,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: `${SITE.shortName} — Portfolio`,
    title: `${SITE.shortName} — ${SITE.role}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.shortName} — ${SITE.role}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/** Person structured data for rich search results. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  alternateName: SITE.shortName,
  jobTitle: SITE.role,
  email: SITE.email,
  url: SITE.url,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Quezon City",
    addressCountry: "PH",
  },
  sameAs: [LINKS.github, LINKS.linkedin],
  knowsAbout: [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "PostgreSQL",
    "Shopify",
    "Three.js",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="relative min-h-screen antialiased">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />

        {/* Decorative, fixed background layers */}
        <AnimatedBackground />
        <Noise />

        {/* Chrome */}
        <LoadingScreen />
        <ScrollProgress />
        <Cursor />
        <Menu />

        {/* Skip link for keyboard users */}
        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[110] focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:text-sm"
        >
          Skip to content
        </a>

        <main id="content" className="relative z-10">
          {children}
        </main>

        <div className="relative z-10">
          <Footer />
        </div>
      </body>
    </html>
  );
}
