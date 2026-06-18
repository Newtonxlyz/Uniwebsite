import Link from "next/link";
import { ArrowLeft, Map, Clock, Star, ChevronRight } from "lucide-react";
import chapters from "@/content/kids-ai/chapters.json";

export const metadata = {
  title: "学习地图 · Kids AI 学堂",
};

export default function MapPage() {
  return (
    <div className="min-h-screen pt-20 px-4 pb-16" style={{ background: "linear-gradient(180deg, #FFF5F7 0%, #F0F9FF 100%)" }}>
      <div className="max-w-4xl mx-auto">
        <Link
          href="/kids-ai"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          返回 Kids AI 首页
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs mb-3 bg-white/80 backdrop-blur border-2" style={{ borderColor: "#4ECDC4", color: "#4ECDC4" }}>
            <Map className="h-3 w-3" />
            学习地图
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: "#FF6B9D" }}>
            10 章完整学习路径
          </h1>
          <p className="text-sm text-gray-500">
            从认识 AI 到创意工坊，循序渐进
          </p>
        </div>

        <div className="space-y-4">
          {(chapters as any[]).map((chapter, i) => (
            <Link
              key={chapter.id}
              href={`/kids-ai/chapter/${chapter.id}`}
              className="group block bg-white rounded-2xl p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border-2 border-transparent hover:border-pink-200"
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl"
                  style={{ background: `linear-gradient(135deg, ${chapter.color} 0%, #FF6B9D 100%)` }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    {chapter.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{chapter.subtitle}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      <Clock className="h-3 w-3" /> {chapter.duration}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      <Star className="h-3 w-3" /> {chapter.targetAge}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white" style={{ background: chapter.color }}>
                      🏆 {chapter.badge?.name}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-pink-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
