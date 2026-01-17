import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/MacroMap.github.io",
  images: {
    unoptimized: true,
  },
  turbopack: {},
};

export default nextConfig;
