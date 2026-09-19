import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 80],
  },
  poweredByHeader: false,
  // Consistent URLs: no trailing slash (Next default) - the canonical tags match.
  trailingSlash: false,
};

export default nextConfig;
