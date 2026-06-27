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
    optimizePackageImports: ["react-icons", "framer-motion"],
  },
};

export default nextConfig;
