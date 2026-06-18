import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Star, Clock, Check, Play, ChevronRight } from "lucide-react";
import chapters from "@/content/kids-ai/chapters.json";
import { ChapterClient } from "./chapter-client";

const CHAR_INFO: Record<string, { name: string; emoji: string; color: string }> = {
  zhi: { name: "小智", emoji: "🤖", color: "#60A5FA" },
  miao: { name: "妙妙", emoji: "🐱", color: "#FF6B9D" },
  bo: { name: "博博", emoji: "🦉", color: "#FB923C" },
};

type Params = Promise<{ id: string }>;

export default async function ChapterPage({ params }: { params: Params }) {
  const { id } = await params;
  const chapter = (chapters as any[]).find((c) => String(c.id) === id);
  if (!chapter) notFound();

  return (
    <div className="min-h-screen pt-20 px-4 pb-16" style={{ background: "linear-gradient(180deg, #FFF5F7 0%, #F0F9FF 100%)" }}>
      <div className="max-w-3xl mx-auto">
        <Link
          href="/kids-ai"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          返回学习地图
        </Link>

        {/* 章节头部 */}
        <div
          className="rounded-3xl p-6 md:p-8 text-white shadow-xl mb-6"
          style={{ background: `linear-gradient(135deg, ${chapter.color} 0%, #FF6B9D 100%)` }}
        >
          <div className="flex items-center gap-2 mb-3 text-sm opacity-90">
            <span className="text-2xl">📖</span>
            第 {chapter.id} 章
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{chapter.title}</h1>
          <p className="text-lg opacity-90 mb-4">{chapter.subtitle}</p>
          <p className="text-sm opacity-80 mb-4">{chapter.description}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/20">
              <Clock className="h-3 w-3" /> {chapter.duration}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/20">
              <Star className="h-3 w-3" /> {chapter.targetAge}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/20">
              🏆 {chapter.badge.name}
            </span>
          </div>
        </div>

        {/* 节点列表（client 端互动） */}
        <ChapterClient
          chapterId={chapter.id}
          chapterTitle={chapter.title}
          nodes={chapter.nodes || []}
          charInfo={CHAR_INFO}
        />
      </div>
    </div>
  );
}
