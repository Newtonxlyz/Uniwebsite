// /knowledge-base/articles/[slug] - 知识库文章详情
// iframe 加载 public/knowledge/<slug>.html（保留 pandoc 样式 + 自适应高度）

import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { promises as fs } from "fs";
import path from "path";
import { ArrowLeft, FileText } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

interface Entry {
  slug: string;
  title: string;
  category: string;
  categoryLabel: string;
  excerpt: string;
  size: number;
  url: string;
}
interface SearchIndex {
  entries: Entry[];
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

async function loadArticleHtml(slug: string): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), "public", "knowledge", `${slug}.html`);
    return await fs.readFile(filePath, "utf-8");
  } catch {
    return "";
  }
}

export default async function KnowledgeArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // 1. 登录 + 白名单
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login?redirect=/knowledge-base");
  }
  const userEmail = session.user.email?.toLowerCase();
  const whitelist = await prisma.wikiAccess.findUnique({ where: { email: userEmail } });
  if (!whitelist) {
    redirect("/knowledge-base");
  }

  // 2. 查 slug
  const { slug } = await params;
  const index = await loadSearchIndex();
  const entry = index.entries.find((e) => e.slug === slug);
  if (!entry) {
    notFound();
  }

  // 3. 读 HTML
  const html = await loadArticleHtml(slug);

  // 4. 渲染
  return (
    <div className="min-h-screen pt-16 flex flex-col" style={{ height: "100vh" }}>
      {/* 顶栏 */}
      <header className="glass-nav border-b border-white/10 px-6 py-3 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Link
              href="/knowledge-base"
              className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              返回知识库
            </Link>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-white truncate">{entry.title}</h1>
              <div className="text-xs text-gray-500 truncate">
                {entry.categoryLabel} · {(entry.size / 1024).toFixed(1)} KB
              </div>
            </div>
          </div>
          <a
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <FileText className="h-3 w-3" />
            原始 HTML
          </a>
        </div>
      </header>

      {/* iframe 内容（pandoc 自带样式 + 1400px 宽度已嵌入 html 内） */}
      <div className="flex-1 overflow-hidden">
        {html ? (
          <iframe
            srcDoc={html}
            className="w-full h-full bg-white"
            sandbox="allow-same-origin allow-scripts"
            title={entry.title}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            文章 HTML 不存在：{slug}
          </div>
        )}
      </div>
    </div>
  );
}