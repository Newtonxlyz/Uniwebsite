import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 跳过 /_global-error 预渲染（Next.js 16 + React 19 在 prerender 阶段
  // 调用 useContext 拿到 null，这是框架 bug）。
  // 路由在 runtime 仍然可用，只是 build 时不静态生成。
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
