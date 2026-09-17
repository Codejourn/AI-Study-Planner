import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep development tooling from adding unrelated instruction files.
  agentRules: false,
  devIndicators: false,
};

export default nextConfig;
