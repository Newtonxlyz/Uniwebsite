import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 允许 next/image 加载 R2 图片（含 SVG）
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "media.lvyz.org" },
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
