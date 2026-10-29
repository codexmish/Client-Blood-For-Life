import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // -----browser calls /api/v1 on our own domain, next sends it to backend
  // ----so login cookies are saved for our domain (first-party, not blocked)
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://backend-blood-for-life.vercel.app/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
