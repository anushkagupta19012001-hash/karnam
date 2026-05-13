import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Enable static export
  output: 'export',

  // 2. Disable Next.js image optimization (requires Node server)
  images: { unoptimized: true },

  // 3. Set the basePath and assetPrefix to match your repository name
  basePath: '/karnam',
  assetPrefix: '/karnam/',
};

export default nextConfig;
