import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Allow remote placeholder/screenshot sources if added later.
    // TODO: Replace with your own asset domains when real project images exist.
    remotePatterns: [],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // NOTE: framer-motion must NOT be listed here. Next's barrel-import
    // optimizer rewrites its imports in a way that breaks the internal
    // rAF frame-loop singleton — motion components then render at their
    // `initial` state but never animate (counters freeze, content stays
    // invisible at opacity:0). react-icons is the canonical safe case.
    optimizePackageImports: ["react-icons"],
  },
};

export default nextConfig;
