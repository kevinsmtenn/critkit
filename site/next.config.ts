import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // critkit ships pre-built ESM in dist/ — no transpile needed.
  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
  },
}

export default nextConfig
