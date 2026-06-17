// Better Auth API Route
// Next.js 16 App Router 捕获所有 /api/auth/* 请求
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
