// /knowledge-base - TEBS 知识库新版
// 1. Server 端登录 + WikiAccess 白名单（保留老权限机制）
// 2. Server 端读 search-index.json，传给 client KnowledgeBrowser 渲染
// 3. 详情用 /knowledge-base/articles/[slug] 子路由
//    - 79 篇清洗后 html 在 public/knowledge/<slug>.html
//    - 4 个老核心知识卡在 public/wiki/*.html（已并入 search-index.json）
// 4. 不再保留"旧 wiki 入口"区（4 个核心知识卡已并入搜索；网站地图/图表/组件/案例/FAQ 已废弃）

import Link from "next/link";
import { redirect } from "next/navigation";
import { promises as fs } from "fs";
import path from "path";
import { ArrowLeft, Lock, Database } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import KnowledgeBrowser from "@/components/knowledge-browser";

export const metadata = {
  title: "知识库 · Lvyz Web",
  description: "TEBS Occupant Safety Knowledge-Base · 车辆安全 · 约束系统 · 碰撞分析",
};

interface SearchEntry {
  slug: string;
  title: string;
  category: string;
  categoryLabel: string;
  excerpt: string;
  size: number;
  url: string;
}
interface SearchIndex {
  entries: SearchEntry[];
  total: number;
}

async function loadSearchIndex(): Promise<SearchIndex> {
  try {
    const pathToFile = path.join(process.cwd(), "public", "knowledge", "search-index.json");
    const raw = await fs.readFile(pathToFile, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { entries: [], total: 0 };
  }
}

export default async function KnowledgeBasePage() {
  // 1. 登录检查
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login?redirect=/knowledge-base");
  }

  // 2. 白名单检查
  const userEmail = session.user.email?.toLowerCase();
  const whitelist = await prisma.wikiAccess.findUnique({
    where: { email: userEmail },
  });

  // 3. 不在白名单 → 提示无权访问（保留原版）
  if (!whitelist) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="glass-card p-8 max-w-md w-full text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 mb-4">
            <Lock className="h-8 w-8 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">知识库访问受限</h1>
          <p className="text-sm text-gray-400 mb-4">
            知识库目前仅对受邀用户开放。
            <br />
            如需访问，请联系管理员申请白名单。
          </p>
          <div className="text-xs text-gray-500 mb-6">
            当前账号：<span className="text-white/80">{session.user.email}</span>
          </div>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-white/5 text-white/80 text-sm hover:bg-white/10 transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  // 4. 加载搜索索引 + 渲染新版浏览器
  const initialIndex = await loadSearchIndex();

  return (
    <div className="min-h-screen pt-28 px-6 pb-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Database className="h-8 w-8 text-cyan-400" />
            <span className="text-gradient">TEBS 技术知识库</span>
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            约束系统 · 碰撞分析 · 零部件 · C-NCAP / C-IASI · 客户端全文搜索 · 共 {initialIndex.total} 篇（79 篇技术文档 + 4 篇核心知识卡）
          </p>
        </header>

        {/* 新版知识库浏览器（搜索 + 分类 + 列表） */}
        <KnowledgeBrowser initialIndex={initialIndex} />
      </div>
    </div>
  );
}