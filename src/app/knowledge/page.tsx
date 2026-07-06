// /knowledge - 旧版知识库路由（保留作 fallback，新版用 /knowledge-base）
import { promises as fs } from "fs";
import path from "path";
import KnowledgeBrowser from "@/components/knowledge-browser";

export const dynamic = "force-dynamic";

interface SearchIndex {
  entries: any[];
  total: number;
}

async function loadSearchIndex(): Promise<SearchIndex> {
  try {
    const filePath = path.join(process.cwd(), "public", "knowledge", "search-index.json");
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { entries: [], total: 0 };
  }
}

export default async function KnowledgePage() {
  const initialIndex = await loadSearchIndex();
  return (
    <div className="min-h-screen pt-20 px-6 pb-16">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            📚 TEBS 技术知识库
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            共 {initialIndex.total} 篇技术文档
            {" · "}
            <a href="/knowledge-base" className="text-cyan-400 hover:text-cyan-300">新版（带登录+白名单）→</a>
          </p>
        </header>
        <KnowledgeBrowser initialIndex={initialIndex} />
      </div>
    </div>
  );
}