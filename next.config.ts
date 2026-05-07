import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: '/karnam',
  assetPrefix: '/karnam/',
};

export default nextConfig;
