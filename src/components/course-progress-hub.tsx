"use client";

// 课程中心进度卡片 - 客户端组件,从 localStorage 读
// 显示每门课的总进度(完成章节数 + 总章节数 + 累计分钟 + 连续学习 + 闪卡掌握度)

import Link from "next/link";
import { useEffect, useState } from "react";
import { Flame, Clock, Layers, Brain, ArrowRight } from "lucide-react";

type Course = {
  slug: string;
  title: string;
  chapters: number;
  flashcards: number;
  color: string;
  accent: string;
  icon: React.ComponentType<{ className?: string }>;
};

type Progress = {
  completedChapters: number;
  totalSeconds: number;
  streak: number;
  masteredFlashcards: number;
  totalFlashcards: number;
};

export function CourseProgressHub({ courses }: { courses: Course[] }) {
  const [progressMap, setProgressMap] = useState<Record<string, Progress | null>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const map: Record<string, Progress | null> = {};
    for (const c of courses) {
      try {
        const raw = localStorage.getItem(`course_progress_${c.slug}`);
        const flashRaw = localStorage.getItem(`course_flashcards_${c.slug}`);
        const prog = raw ? JSON.parse(raw) : null;
        const flash = flashRaw ? JSON.parse(flashRaw) : null;
        const completed = prog?.chapters
            ? Object.values(prog.chapters).filter((s: any) => s.status === "completed").length
            : 0;
        const mastered = flash?.cards
            ? Object.values(flash.cards).filter((c: any) => c.mastered).length
            : 0;
        map[c.slug] = {
          completedChapters: completed,
          totalSeconds: prog?.totalSeconds || 0,
          streak: prog?.streak || 0,
          masteredFlashcards: mastered,
          totalFlashcards: c.flashcards,
        };
      } catch {
        map[c.slug] = null;
      }
    }
    setProgressMap(map);
  }, []);

  if (!mounted) {
    return (
      <section className="mb-12">
        <div className="glass-card p-6 text-sm text-gray-400">加载中…</div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Flame className="h-5 w-5 text-orange-400" />
        我的学习进度
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {courses.map((c) => {
          const Icon = c.icon;
          const p = progressMap[c.slug];
          const completedPct = p ? Math.round((p.completedChapters / c.chapters) * 100) : 0;
          const flashPct = p && p.totalFlashcards
              ? Math.round((p.masteredFlashcards / p.totalFlashcards) * 100)
              : 0;
          return (
            <div key={c.slug} className={`glass-card p-5 bg-gradient-to-br ${c.color}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-white" />
                  <h3 className="text-base font-semibold text-white">{c.title}</h3>
                </div>
                <Link
                  href={`/learn/${c.slug}`}
                  className="text-xs text-white/70 hover:text-white inline-flex items-center gap-1"
                >
                  详情
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="space-y-2.5">
                {/* 章节进度 */}
                <div>
                  <div className="flex justify-between text-xs text-white/80 mb-1">
                    <span className="inline-flex items-center gap-1">
                      <Layers className="h-3 w-3" />
                      章节
                    </span>
                    <span>
                      {p?.completedChapters ?? 0} / {c.chapters}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-black/30 overflow-hidden">
                    <div
                      className="h-full bg-white/80 rounded-full transition-all"
                      style={{ width: `${completedPct}%` }}
                    />
                  </div>
                </div>

                {/* 闪卡掌握度 */}
                <div>
                  <div className="flex justify-between text-xs text-white/80 mb-1">
                    <span className="inline-flex items-center gap-1">
                      <Brain className="h-3 w-3" />
                      闪卡
                    </span>
                    <span>
                      {p?.masteredFlashcards ?? 0} / {c.flashcards} ({flashPct}%)
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-black/30 overflow-hidden">
                    <div
                      className="h-full bg-amber-300/80 rounded-full transition-all"
                      style={{ width: `${flashPct}%` }}
                    />
                  </div>
                </div>

                {/* 累计时长 + 连续 */}
                <div className="flex gap-4 text-xs text-white/70 pt-1">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {Math.round((p?.totalSeconds ?? 0) / 60)} 分钟
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Flame className="h-3 w-3 text-orange-300" />
                    {p?.streak ?? 0} 天连续
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}