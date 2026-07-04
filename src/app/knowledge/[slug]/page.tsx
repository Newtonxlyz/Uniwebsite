import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

export default async function KnowledgeArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const htmlUrl = `/knowledge/${slug}.html`;

  return (
    <div className="min-h-screen pt-20 px-4 pb-4">
      <div className="w-full">
        {/* 顶部工具栏 */}
        <div className="flex items-center justify-between mb-3 max-w-[1600px] mx-auto px-2">
          <Link
            href="/knowledge"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            返回列表
          </Link>
          <a
            href={htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            在新窗口打开
          </a>
        </div>

        {/* iframe 渲染完整 pandoc 输出的 html */}
        <iframe
          src={htmlUrl}
          className="w-full bg-white rounded-lg shadow-lg"
          style={{
            width: "100%",
            height: "calc(100vh - 110px)",
            minHeight: "600px",
            border: "none",
            display: "block",
          }}
          title={slug}
        />
      </div>
    </div>
  );
}
