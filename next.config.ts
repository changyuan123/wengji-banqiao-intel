import type { NextConfig } from "next";

const repo = "wengji-banqiao-intel";
const isGhPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: isGhPages ? `/${repo}` : "",
  assetPrefix: isGhPages ? `/${repo}/` : undefined,
};

export default nextConfig;
