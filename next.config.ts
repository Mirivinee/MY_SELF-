import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CLAUDE.md is our own hand-authored project spec; don't let `next dev` append to it.
  agentRules: false,
};

export default nextConfig;
