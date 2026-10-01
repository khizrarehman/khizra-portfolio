import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Substack post covers (src/content/journal.ts) are served through
    // Next's optimizer: resized to the width they're shown at and
    // re-encoded, instead of shipping multi-megabyte camera originals.
    remotePatterns: [{ protocol: "https", hostname: "substackcdn.com", pathname: "/image/fetch/**" }],
    formats: ["image/avif", "image/webp"],
    qualities: [75],
  },
  allowedDevOrigins: [
    "*.trycloudflare.com",
    "*.loca.lt",
  ],
};

export default nextConfig;
