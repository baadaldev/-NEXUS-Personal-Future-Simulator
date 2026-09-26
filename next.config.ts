import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS || false;
const repo = "-NEXUS-Personal-Future-Simulator";

const nextConfig: NextConfig = {
  output: isGithubActions ? "export" : undefined,
  basePath: isGithubActions ? `/${repo}` : undefined,
  assetPrefix: isGithubActions ? `/${repo}/` : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
