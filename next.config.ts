import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // Optional: Disable image optimization if you are using next/image
  // images: { unoptimized: true },

  // NOTE: If you are deploying to https://Anushka1901.github.io/karnam/ 
  // you MUST add the basePath and assetPrefix to match your repository name:
  // basePath: '/karnam',
  // assetPrefix: '/karnam/',
};

export default nextConfig;
