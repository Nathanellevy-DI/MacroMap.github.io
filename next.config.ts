import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/MacroMap.github.io" : "",
  assetPrefix: isProd ? "/MacroMap.github.io" : "",
  images: {
    unoptimized: true,
  },
  turbopack: {},
};

export default nextConfig;
