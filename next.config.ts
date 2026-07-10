import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 允许 next/image 加载 R2 图片（含 SVG）
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "media.lvyz.org" },
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
    ],
  },
  // 知识库 HTML 不进 serverless bundle（83 篇 ~30MB），让 Vercel 走静态资源直读
  // 否则 articles/[slug] server function > 250MB 限制
  // NLFEA 学习平台 ~11MB（PDF 关键页面 + 嵌入图），同样不打包
  outputFileTracingExcludes: {
    "**": [
      "./public/knowledge/**",
      "./public/wiki/**",
      "./public/nlfea-course/**",
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
