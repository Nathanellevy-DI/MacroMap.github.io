import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // For user pages (username.github.io), no basePath needed
  // For project pages, use: basePath: "/repo-name"
  images: {
    unoptimized: true,
  },
  turbopack: {},
};

export default nextConfig;
