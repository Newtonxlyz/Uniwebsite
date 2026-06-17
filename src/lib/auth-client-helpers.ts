// 兼容旧的 useSession 导出
"use client";
import { createAuthClient } from "better-auth/react";

// 创建单例 client
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"),
});

// 重新导出 React hook
export const useSession = authClient.useSession;
export const signIn = authClient.signIn;
export const signOut = authClient.signOut;
export const signUp = authClient.signUp;
