"use client";

import Link from "next/link";
import { ArrowLeft, Trophy, Award, Lock, Star, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import chapters from "@/content/kids-ai/chapters.json";

const ALL_BADGES = (chapters as any[]).map((c) => ({
  id: c.id,
  name: c.badge.name,
  desc: c.badge.description,
  chapterTitle: c.title,
  color: c.color,
  icon: c.badge.icon,
}));

export default function AchievementsPage() {
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    const all: number[] = [];
    for (let i = 1; i <= 10; i++) {
      const saved = localStorage.getItem(`kids-ai-chapter-${i}-progress`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.completed?.length > 0) all.push(i);
        } catch {}
      }
    }
    setCompleted(all);
  }, []);

  const percent = Math.round((completed.length / ALL_BADGES.length) * 100);

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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs mb-3 bg-white/80 backdrop-blur border-2" style={{ borderColor: "#FFE66D", color: "#F59E0B" }}>
            <Trophy className="h-3 w-3" />
            成就系统
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: "#F59E0B" }}>
            你的徽章收藏
          </h1>
          <p className="text-sm text-gray-500">
            完成章节解锁徽章
          </p>
        </div>

        {/* 进度环 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 text-center">
          <div className="relative inline-block">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="56" stroke="#E5E7EB" strokeWidth="10" fill="none" />
              <circle
                cx="64" cy="64" r="56"
                stroke="url(#grad)"
                strokeWidth="10"
                fill="none"
                strokeDasharray={`${(percent / 100) * 352} 352`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FF6B9D" />
                  <stop offset="100%" stopColor="#A78BFA" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-gray-800">{percent}%</div>
              <div className="text-xs text-gray-500">{completed.length}/{ALL_BADGES.length}</div>
            </div>
          </div>
        </div>

        {/* 徽章网格 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {ALL_BADGES.map((badge) => {
            const isCompleted = completed.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={cn(
                  "rounded-2xl p-5 text-center transition-all",
                  isCompleted
                    ? "bg-white shadow-md"
                    : "bg-gray-100 opacity-50"
                )}
                style={isCompleted ? { borderTop: `4px solid ${badge.color}` } : {}}
              >
                {isCompleted ? (
                  <Trophy className="h-10 w-10 mx-auto mb-2" style={{ color: badge.color }} />
                ) : (
                  <Lock className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                )}
                <h3 className="text-sm font-bold text-gray-800 mb-1">{badge.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{badge.desc}</p>
                <Link
                  href={`/kids-ai/chapter/${badge.id}`}
                  className={cn(
                    "inline-flex items-center gap-1 text-xs",
                    isCompleted ? "text-pink-500 hover:underline" : "text-gray-400"
                  )}
                >
                  {isCompleted ? "已完成" : `第${badge.id}章: ${badge.chapterTitle}`}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
