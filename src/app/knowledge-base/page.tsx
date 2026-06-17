import Link from "next/link";
import { ArrowLeft, Database } from "lucide-react";

export const metadata = {
  title: "知识库 · Lvyz Web",
  description: "Dify RAG · 车辆安全 · 技术文档",
};

export default function KnowledgeBasePage() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] pt-20 px-6 pb-16">
      <div className="mx-auto max-w-2xl">
        <header className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
          <div className="flex items-center gap-3">
            <Database className="h-8 w-8 text-cyan-400" />
            <h1 className="text-3xl font-bold text-white">
              <span className="text-gradient">知识库</span>
            </h1>
          </div>
          <p className="mt-2 text-gray-400">Dify RAG · 车辆安全 · 技术文档</p>
        </header>

        <div className="glass-card p-8 text-center">
          <span className="text-5xl mb-4 block">📚</span>
          <h2 className="text-xl font-semibold text-white mb-3">即将上线</h2>
          <p className="text-gray-400 mb-6">
            知识库正在构建中，基于 Dify RAG 提供车辆安全与技术文档的智能检索。
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300">Dify RAG</span>
            <span className="px-3 py-1 text-xs rounded-full bg-cyan-500/20 text-cyan-300">车辆安全</span>
            <span className="px-3 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300">技术文档</span>
          </div>
        </div>
      </div>
    </div>
  );
}
