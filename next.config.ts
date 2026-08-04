import type { NextConfig } from "next";

const repo = "wengji-banqiao-intel";
const basePath = process.env.BASE_PATH === "0" ? "" : process.env.BASE_PATH || `/${repo}`;

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
};

export default nextConfig;
