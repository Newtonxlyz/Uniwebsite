import Link from "next/link";
import { ArrowLeft, Database, ExternalLink } from "lucide-react";

export const metadata = {
  title: "知识库 · Lvyz Web",
  description: "车辆安全 · 约束系统 · 碰撞分析 · C-NCAP/C-IASI 知识库",
};

export default function KnowledgeBasePage() {
  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* 顶部导航条 */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a1a]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-cyan-400" />
            <h1 className="text-lg font-semibold text-white">
              <span className="text-gradient">知识库</span>
            </h1>
            <span className="text-xs text-gray-500 hidden sm:inline">
              车辆安全 · 约束系统 · 碰撞分析
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              返回首页
            </Link>
            <a
              href="/wiki/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              新窗口打开
            </a>
          </div>
        </div>
      </header>

      {/* iframe 嵌入 wiki 知识库 */}
      <iframe
        src="/wiki/index.html"
        title="Lvyz 知识库"
        className="w-full border-0"
        style={{ height: "calc(100vh - 57px)" }}
      />
    </div>
  );
}
