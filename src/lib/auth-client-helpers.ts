// 兼容旧的 useSession 导出
"use client";
import { createAuthClient } from "better-auth/react";

// 创建单例 client — 强制同源（避免 www.lvyz.org / lvyz.org 跨域 fetch 失败）
function getBaseURL() {
  // 浏览器端：永远用 window.location.origin（保证同源）
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  // SSR：用环境变量或兜底
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});

// 重新导出 React hook
export const useSession = authClient.useSession;
export const signIn = authClient.signIn;
export const signOut = authClient.signOut;
export const signUp = authClient.signUp;
