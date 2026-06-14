import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    webpackMemoryOptimizations: true,
  },
  // Limit static generation concurrency to reduce memory pressure
  staticPageGenerationTimeout: 120,
};

export default nextConfig;
