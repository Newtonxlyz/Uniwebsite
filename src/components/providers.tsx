"use client";

// lvyz-platform 全局 Providers
// 目前不包裹 AuthProvider（Better Auth client 自己管理 session）
// 后续如需添加：ThemeProvider, QueryClient 等

export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
