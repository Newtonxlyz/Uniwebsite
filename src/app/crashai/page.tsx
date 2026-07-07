// crashai 学习地图 - 显示真实用户进度
// - 已登录：从 DB 拉所有 progress + 课程状态
// - 未登录：显示"登录后跟踪进度"提示

import { loadLessons as getLessons } from "@/lib/server-data";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CheckCircle, PlayCircle, Circle, BookOpen } from "lucide-react";
import { ProgressProvider, ProgressDashboard } from "@/components/crashai-progress";

export const dynamic = "force-dynamic";

export default async function CrashAIDashboard() {
  const lessons = await getLessons();
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user ?? null;

  // 拉当前用户的所有 crashai 进度
  const progressList = user
    ? await prisma.crashAIProgress.findMany({
        where: { userId: user.id },
      })
    : [];

  // progressMap: { [slug]: { status, notes, studyMinutes } }
  const progressMap: Record<
    string,
    {
      status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
      notes: string | null;
      studyMinutes: number;
      startedAt: Date | null;
      completedAt: Date | null;
    }
  > = {};
  for (const p of progressList) {
    progressMap[p.lessonSlug] = {
      status: p.status as any,
      notes: p.notes,
      studyMinutes: p.studyMinutes,
      startedAt: p.startedAt,
      completedAt: p.completedAt,
    };
  }

  // 4 phases
  const phases = [
    {
      name: "Phase A",
      title: "基础夯实",
      desc: "数学 + Python + 核心概念",
      lessons: lessons.filter((l: any) => l.phase === "A"),
    },
    {
      name: "Phase B",
      title: "LLM 全栈",
      desc: "Transformer + 训练 + 评估",
      lessons: lessons.filter((l: any) => l.phase === "B"),
    },
    {
      name: "Phase C",
      title: "应用部署",
      desc: "Agent + RAG + 产品化",
      lessons: lessons.filter((l: any) => l.phase === "C"),
    },
    {
      name: "Phase D",
      title: "安全领域专项",
      desc: "汽车安全 AI · 4 大训练路径",
      lessons: lessons.filter((l: any) => l.phase === "D"),
    },
  ];

  const totalLessons = lessons.length;
  const completed = progressList.filter((p) => p.status === "COMPLETED").length;
  const inProgress = progressList.filter((p) => p.status === "IN_PROGRESS").length;
  const totalMinutes = progressList.reduce((s, p) => s + p.studyMinutes, 0);

  return (
    <div className="min-h-screen pt-28 px-6 pb-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="text-gradient">crashAI</span> 学习地图
          </h1>
          <p className="text-gray-400">
            24 主题 · 从数学基础到 LLM 部署 · 完整 AI 转行知识体系
          </p>
        </header>

        {/* 顶部操作 + 真实进度 */}
        <div className="mb-8 flex flex-wrap gap-3 items-center">
          <Link
            href="/crashai/cards"
            className="glass-card px-5 py-2 text-sm font-medium text-white hover:scale-105 transition-all"
          >
            🃏 记忆卡片
          </Link>
          <Link
            href="/crashai/safety-training"
            className="glass-card px-5 py-2 text-sm font-medium text-white hover:scale-105 transition-all"
            style={{
              background:
                "linear-gradient(135deg, rgba(167,139,250,0.25) 0%, rgba(245,158,11,0.15) 100%)",
              borderColor: "rgba(167,139,250,0.4)",
            }}
          >
            🧠 安全领域训练 4 大路径 →
          </Link>

          {/* 进度条（仅登录用户显示真实数据） */}
          {user ? (
            <ProgressProvider initialMap={progressMap}>
              <div className="glass-card px-5 py-2 text-sm flex items-center gap-3 flex-1 min-w-[280px]">
                <BookOpen className="h-4 w-4 text-cyan-400" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">
                      {completed}/{totalLessons} 已完成
                      {inProgress > 0 && (
                        <span className="text-gray-400 ml-2">
                          · {inProgress} 学习中
                        </span>
                      )}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {totalMinutes} 分钟
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all"
                      style={{ width: `${(completed / totalLessons) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </ProgressProvider>
          ) : (
            <Link
              href="/login?redirect=/crashai"
              className="glass-card px-5 py-2 text-sm text-amber-300 hover:scale-105 transition-all border border-amber-500/30"
            >
              🔒 登录后跟踪学习进度
            </Link>
          )}
        </div>

        {/* 4 phases - 课程卡片 */}
        {phases.map((phase) => (
          <section key={phase.name} className="mb-12">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white">
                {phase.name} · {phase.title}
              </h2>
              <p className="text-sm text-gray-500">{phase.desc}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {phase.lessons.map((lesson: any) => {
                const status = progressMap[lesson.slug]?.status ?? "NOT_STARTED";
                return (
                  <Link
                    key={lesson.slug}
                    href={`/crashai/${lesson.slug}`}
                    className={cn(
                      "glass-card group p-5 relative overflow-hidden transition-all hover:scale-[1.02]",
                      status === "COMPLETED" &&
                        "border-emerald-500/30 bg-emerald-500/5",
                      status === "IN_PROGRESS" &&
                        "border-cyan-500/30 bg-cyan-500/5"
                    )}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                          {lesson.order + 1}
                        </span>
                        {status === "COMPLETED" ? (
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                        ) : status === "IN_PROGRESS" ? (
                          <PlayCircle className="h-4 w-4 text-cyan-400" />
                        ) : (
                          <Circle className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-white mb-1">
                        {lesson.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {lesson.description}
                      </p>
                      {status === "COMPLETED" && (
                        <div className="mt-2 text-[10px] text-emerald-400/80">
                          ✓ 已完成
                        </div>
                      )}
                      {status === "IN_PROGRESS" && (
                        <div className="mt-2 text-[10px] text-cyan-400/80">
                          ● 学习中
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
