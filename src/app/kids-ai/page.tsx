"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Sparkles, Star, Map, Trophy, Wrench, MessageCircle, Heart,
  ChevronRight, Award, BookOpen, Play, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { kidsLessons } from "@/content/kids-ai/lessons";
import chapters from "@/content/kids-ai/chapters.json";

// 童趣鲜艳配色
const C = {
  primary: "#FF6B9D",   // 桃粉
  secondary: "#4ECDC4", // 薄荷青
  accent: "#FFE66D",    // 暖黄
  purple: "#A78BFA",    // 紫罗兰
  blue: "#60A5FA",      // 天蓝
  green: "#34D399",     // 翠绿
  orange: "#FB923C",    // 橘色
  red: "#F87171",       // 暖红
};

// 3 个角色（小智/妙妙/博博）
const CHARACTERS = [
  { id: "zhi", name: "小智", emoji: "🤖", role: "AI 老师", color: C.blue, desc: "住在电脑里的小机器人，知道很多 AI 的事" },
  { id: "miao", name: "妙妙", emoji: "🐱", role: "探索队长", color: C.primary, desc: "最喜欢探索新奇的东西" },
  { id: "bo", name: "博博", emoji: "🦉", role: "知识管家", color: C.orange, desc: "学完每章帮你总结" },
];

const FEATURES = [
  { icon: Map, title: "10 章课程", desc: "从认识 AI 到创意工坊", color: C.primary },
  { icon: MessageCircle, title: "6 个互动游戏", desc: "找 AI、分类、接龙、指令魔法", color: C.secondary },
  { icon: Wrench, title: "5 个本地 AI 工具", desc: "写作/画画/音乐/讲故事/语音", color: C.accent },
  { icon: Trophy, title: "成就系统", desc: "徽章、进度、作品集", color: C.purple },
];

export default function KidsAIHome() {
  return (
    <div className="min-h-screen pt-16" style={{ background: `linear-gradient(180deg, #FFF5F7 0%, #F0F9FF 100%)` }}>
      {/* HERO 区 — 童趣鲜艳 */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {/* 浮动装饰 */}
          <div className="absolute top-20 left-8 text-6xl animate-float opacity-60" style={{ animationDelay: "0s" }}>⭐</div>
          <div className="absolute top-32 right-12 text-5xl animate-float opacity-60" style={{ animationDelay: "1s" }}>🚀</div>
          <div className="absolute top-60 left-1/4 text-4xl animate-float opacity-50" style={{ animationDelay: "2s" }}>✨</div>
          <div className="absolute bottom-20 right-1/3 text-5xl animate-float opacity-50" style={{ animationDelay: "0.5s" }}>🎨</div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs mb-4 bg-white/80 backdrop-blur border-2" style={{ borderColor: C.primary, color: C.primary }}>
            <Sparkles className="h-3 w-3" />
            适合 6-12 岁 · 零基础起步
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ color: C.primary, fontFamily: "Microsoft YaHei, sans-serif" }}>
            AI 启蒙学堂
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-2" style={{ color: C.secondary }}>
            和小智一起，探索 AI 的奇妙世界！
          </p>
          <p className="text-base mb-8 max-w-2xl mx-auto text-gray-600">
            10 章互动课程 + 6 个趣味游戏 + 5 个 AI 创作工具，
            玩着学 AI，理解 AI，成为 AI 小达人！
          </p>

          {/* 三个角色卡片 */}
          <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto mb-8">
            {CHARACTERS.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl p-4 shadow-lg border-2 hover:scale-105 transition-transform"
                style={{ borderColor: c.color }}
              >
                <div className="text-5xl mb-2">{c.emoji}</div>
                <h3 className="text-base font-bold" style={{ color: c.color }}>
                  {c.name}
                </h3>
                <p className="text-xs text-gray-500">{c.role}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/kids-ai/map"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-white font-bold shadow-lg hover:scale-105 transition-all"
              style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.purple} 100%)` }}
            >
              <Map className="h-4 w-4" />
              开始学习
            </Link>
            <Link
              href="/kids-ai/create"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white font-bold shadow-lg hover:scale-105 transition-all border-2"
              style={{ borderColor: C.secondary, color: C.secondary }}
            >
              <Wrench className="h-4 w-4" />
              创意工坊
            </Link>
            <Link
              href="/kids-ai/achievements"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white font-bold shadow-lg hover:scale-105 transition-all border-2"
              style={{ borderColor: C.accent, color: "#F59E0B" }}
            >
              <Trophy className="h-4 w-4" />
              成就
            </Link>
          </div>
        </div>
      </section>

      {/* 4 大特色 */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-5 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl mb-3"
                  style={{ background: `${f.color}20`, color: f.color }}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold mb-1 text-gray-800">{f.title}</h3>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 10 章课程地图 */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2" style={{ color: C.primary }}>
            🗺️ 学习地图
          </h2>
          <p className="text-sm text-gray-500">
            10 章循序渐进，每章 15-20 分钟
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(chapters as any[]).slice(0, 10).map((chapter: any, i: number) => (
            <Link
              key={chapter.id}
              href={`/kids-ai/chapter/${chapter.id}`}
              className="group bg-white rounded-2xl p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border-2 border-transparent hover:border-pink-200"
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold"
                  style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.secondary} 100%)` }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-800 truncate">
                    {chapter.title}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {chapter.subtitle}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className="inline-block text-xs px-2 py-1 rounded-full text-white"
                    style={{ background: C.secondary }}
                  >
                    {chapter.duration || "15-20分钟"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6 个互动游戏 */}
      <section className="py-12" style={{ background: `linear-gradient(135deg, ${C.accent}20 0%, ${C.primary}10 100%)` }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: C.purple }}>
              🎮 6 个互动游戏
            </h2>
            <p className="text-sm text-gray-500">
              玩着学 AI，越玩越聪明
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: "找 AI 小工具", icon: "🔍", color: C.blue, desc: "在房间里找 AI 朋友" },
              { name: "水果分类", icon: "🍎", color: C.green, desc: "教 AI 认识水果" },
              { name: "AI vs 人类", icon: "🤔", color: C.primary, desc: "猜猜谁画的" },
              { name: "指令魔法", icon: "✨", color: C.purple, desc: "给 AI 下指令" },
              { name: "故事接龙", icon: "📖", color: C.orange, desc: "和 AI 一起编故事" },
              { name: "教 AI 认动物", icon: "🐱", color: C.red, desc: "训练 AI 模型" },
            ].map((game, i) => (
              <div
                key={game.name}
                className="bg-white rounded-2xl p-5 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
              >
                <div className="text-5xl mb-3">{game.icon}</div>
                <h3 className="text-base font-bold mb-1 text-gray-800">{game.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{game.desc}</p>
                <span
                  className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full text-white"
                  style={{ background: game.color }}
                >
                  <Play className="h-3 w-3" />
                  开始玩
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 创意工坊入口 */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div
          className="rounded-3xl p-8 md:p-12 text-white text-center"
          style={{ background: `linear-gradient(135deg, ${C.purple} 0%, ${C.primary} 100%)` }}
        >
          <Wrench className="h-12 w-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            创意工坊
          </h2>
          <p className="text-lg mb-6 opacity-90">
            5 个 AI 工具：写作、画画、音乐、讲故事、语音
          </p>
          <Link
            href="/kids-ai/create"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white font-bold hover:scale-105 transition-all"
            style={{ color: C.purple }}
          >
            <Sparkles className="h-4 w-4" />
            开始创作
          </Link>
        </div>
      </section>

      {/* 家长信任栏 */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <div className="text-center mb-6">
            <Heart className="h-8 w-8 mx-auto mb-2" style={{ color: C.primary }} />
            <h2 className="text-2xl font-bold text-gray-800">家长放心</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">🛡️</div>
              <h3 className="font-bold text-gray-800 mb-1">内容安全</h3>
              <p className="text-sm text-gray-500">全年龄审核，无广告，无不良内容</p>
            </div>
            <div>
              <div className="text-3xl mb-2">📚</div>
              <h3 className="font-bold text-gray-800 mb-1">教育价值</h3>
              <p className="text-sm text-gray-500">与课标对齐，培养计算思维与创造力</p>
            </div>
            <div>
              <div className="text-3xl mb-2">👀</div>
              <h3 className="font-bold text-gray-800 mb-1">家长面板</h3>
              <p className="text-sm text-gray-500">查看学习进度、时长、内容</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
