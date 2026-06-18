"use client";

import Link from "next/link";
import { ArrowLeft, Play, Sparkles, Trophy } from "lucide-react";

const C = {
  primary: "#FF6B9D",
  secondary: "#4ECDC4",
  yellow: "#FFE66D",
  purple: "#A78BFA",
  orange: "#FB923C",
  blue: "#60A5FA",
  green: "#10B981",
  red: "#EF4444",
};

const GAMES = [
  { slug: "find-ai", name: "找 AI 小工具", icon: "🔍", color: C.blue, desc: "在房间里找出 6 个 AI 朋友", time: "3 分钟" },
  { slug: "fruit-sort", name: "水果分类", icon: "🍎", color: C.green, desc: "教 AI 认识水果，分到正确的篮子", time: "5 分钟" },
  { slug: "ai-vs-human", name: "AI vs 人类", icon: "🤔", color: C.primary, desc: "猜猜这幅画是 AI 还是人类画的", time: "2 分钟" },
  { slug: "magic-command", name: "指令魔法", icon: "✨", color: C.purple, desc: "用准确指令让 AI 小助手做对事", time: "4 分钟" },
  { slug: "story-chain", name: "故事接龙", icon: "📖", color: C.orange, desc: "和妙妙一起写一段奇幻故事", time: "5 分钟" },
  { slug: "train-ai", name: "教 AI 认动物", icon: "🐱", color: C.red, desc: "教 AI 认识 8 种小动物", time: "5 分钟" },
];

export default function GamesListPage() {
  return (
    <div className="min-h-screen pt-20 px-6 pb-16" style={{ background: "linear-gradient(180deg, #FFF5F7 0%, #F0F9FF 100%)" }}>
      <div className="max-w-5xl mx-auto">
        <Link href="/kids-ai" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6">
          <ArrowLeft className="h-4 w-4" /> 返回 Kids AI 首页
        </Link>

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs mb-3 bg-white/80 border-2" style={{ borderColor: C.purple, color: C.purple }}>
            <Trophy className="h-3 w-3" /> 6 个趣味游戏
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: C.purple }}>
            🎮 玩着学 AI
          </h1>
          <p className="text-sm text-gray-500">点开任意一个游戏开始玩（无 token 消耗）</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {GAMES.map((game) => (
            <Link
              key={game.slug}
              href={`/kids-ai/games/${game.slug}`}
              className="bg-white rounded-2xl p-5 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="text-5xl mb-3">{game.icon}</div>
              <h3 className="text-base font-bold mb-1 text-gray-800">{game.name}</h3>
              <p className="text-xs text-gray-500 mb-3">{game.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{game.time}</span>
                <span
                  className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full text-white"
                  style={{ background: game.color }}
                >
                  <Play className="h-3 w-3" /> 开始玩
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
