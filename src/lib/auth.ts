// Better Auth 配置 - lvyz.org 全站统一认证
// 替代原有的 JSON 文件认证方案
// 文档：https://www.better-auth.com/docs

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/db";

export const auth = betterAuth({
  // 数据库适配
  database: prismaAdapter(prisma, { provider: "sqlite" }),

  // 邮箱+密码登录
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,  // 部署后可以打开
    minPasswordLength: 8,
    autoSignIn: true,
  },

  // Session 配置
  session: {
    expiresIn: 60 * 60 * 24 * 7,  // 7 天
    updateAge: 60 * 60 * 24,       // 每天刷新
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,              // 5 分钟缓存
    },
  },

  // 用户字段扩展
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        input: false,  // 注册时不可见（只能管理员修改）
      },
      bio: {
        type: "string",
        required: false,
      },
      websiteUrl: {
        type: "string",
        required: false,
      },
      xhsHandle: {
        type: "string",
        required: false,
      },
      biliHandle: {
        type: "string",
        required: false,
      },
    },
  },

  // 高级选项
  advanced: {
    cookiePrefix: "lvyz",
    // 跨子站共享 cookie（*.lvyz.org）
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },

  // 允许的回调 URL（所有子站）
  trustedOrigins: [
    "http://localhost:3000",
    "https://lvyz.org",
    "https://www.lvyz.org",
    "https://crashai.lvyz.org",
    "https://kids-ai.lvyz.org",
    "https://kb.lvyz.org",
    "https://poetry.lvyz.org",
    "https://picturebook.lvyz.org",
  ],

  plugins: [
    nextCookies(),  // Next.js 必需
  ],
});

export type Auth = typeof auth;
