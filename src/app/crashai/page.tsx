import { loadLessons as getLessons } from "@/lib/server-data";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BookOpen, Lock, CheckCircle, PlayCircle } from "lucide-react";

export default async function CrashAIDashboard() {
  const lessons = await getLessons();

  const phases = [
    { name: "Phase A", title: "基础夯实", desc: "数学 + Python + 核心概念", lessons: lessons.filter((l: any) => l.phase === "A") },
    { name: "Phase B", title: "LLM 全栈", desc: "Transformer + 训练 + 评估", lessons: lessons.filter((l: any) => l.phase === "B") },
    { name: "Phase C", title: "应用部署", desc: "Agent + RAG + 产品化", lessons: lessons.filter((l: any) => l.phase === "C") },
  ];

  return (
    <div className="min-h-screen pt-20 px-6 pb-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="text-gradient">crashAI</span> 学习地图
          </h1>
          <p className="text-gray-400">24 主题 · 从数学基础到 LLM 部署 · 完整 AI 转行知识体系</p>
        </header>

        <div className="mb-8 flex gap-4">
          <Link href="/crashai/cards" className="glass-card px-5 py-2 text-sm font-medium text-white hover:scale-105 transition-all">
            🃏 记忆卡片
          </Link>
          <div className="glass-card px-5 py-2 text-sm text-gray-400">
            📊 总进度: 0/24 课程
          </div>
        </div>

        {phases.map((phase) => (
          <section key={phase.name} className="mb-12">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white">{phase.name} · {phase.title}</h2>
              <p className="text-sm text-gray-500">{phase.desc}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {phase.lessons.map((lesson: any) => (
                <Link
                  key={lesson.slug}
                  href={`/crashai/${lesson.slug}`}
                  className={cn("glass-card group p-5 relative overflow-hidden")}
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                        {lesson.order + 1}
                      </span>
                      <PlayCircle className="h-4 w-4 text-gray-500 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <h3 className="text-base font-semibold text-white mb-1">{lesson.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{lesson.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
