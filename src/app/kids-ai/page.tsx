import { Sparkles, Brain, Palette, Shield, ArrowRight, Star, Lightbulb } from "lucide-react";
import Link from "next/link";
import { kidsLessons } from "@/content/kids-ai/lessons";
import LessonCard from "./components/lesson-card";
import AIChatDemo from "./components/ai-chat-demo";

export const metadata = {
  title: "儿童AI学堂 · LvyzWeb",
  description: "为5-12岁儿童打造的AI启蒙学习乐园",
};

export default function KidsAIPage() {
  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* Hero Section */}
      <section className="relative pt-28 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute top-1/2 -left-40 h-80 w-80 rounded-full bg-cyan-500/8 blur-3xl" />
          <div className="absolute -bottom-20 right-1/3 h-60 w-60 rounded-full bg-purple-500/8 blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs mb-6">
            <Sparkles className="h-3 w-3" />
            适合 5-12 岁儿童
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              AI 启蒙学堂
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            用有趣的方式学习人工智能。我们通过故事、游戏和动手实验，
            <br />
            让孩子理解AI如何工作，学会与AI做朋友。
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#lessons"
              className="glass-card inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white hover:scale-105 transition-all"
            >
              <Brain className="h-4 w-4 text-emerald-400" />
              开始学习
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#demo"
              className="glass-card inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-400 hover:text-white hover:scale-105 transition-all"
            >
              <Lightbulb className="h-4 w-4 text-amber-400" />
              动手试试
            </a>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: "🤖",
              title: "AI启蒙",
              desc: "用孩子的语言解释AI原理",
              color: "border-emerald-500/30 text-emerald-400",
            },
            {
              icon: "🎨",
              title: "创意工坊",
              desc: "和AI一起创作故事与画作",
              color: "border-purple-500/30 text-purple-400",
            },
            {
              icon: "🏆",
              title: "成就系统",
              desc: "收集徽章，解锁新技能",
              color: "border-amber-500/30 text-amber-400",
            },
          ].map((f) => (
            <div
              key={f.title}
              className={`glass-card p-6 text-center border ${f.color} border-opacity-30`}
            >
              <span className="text-4xl block mb-3">{f.icon}</span>
              <h3 className="text-white font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lessons Section */}
      <section id="lessons" className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                AI知识小课堂
              </span>
            </h2>
            <p className="text-gray-500 text-sm">
              {kidsLessons.length} 节课，每节课5-10分钟
            </p>
          </div>

          <div className="space-y-4">
            {kidsLessons.map((lesson, idx) => (
              <LessonCard key={lesson.id} lesson={lesson} defaultOpen={idx === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section id="demo" className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              <span className="bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
                动手试试
              </span>
            </h2>
            <p className="text-gray-500 text-sm">
              体验AI的神奇魔力——和AI一起创作
            </p>
          </div>
          <AIChatDemo />
        </div>
      </section>

      {/* Achievement Preview */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">成就徽章</h2>
            <p className="text-gray-500 text-sm">完成课程，收集徽章</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { emoji: "🌟", name: "初识AI", desc: "完成第一课" },
              { emoji: "🧠", name: "学习达人", desc: "完成3节课" },
              { emoji: "🎨", name: "创意之星", desc: "完成AI绘画" },
              { emoji: "💬", name: "提示词高手", desc: "写出精彩提示词" },
            ].map((badge) => (
              <div
                key={badge.name}
                className="glass-card p-5 text-center opacity-60 hover:opacity-100 transition-opacity"
              >
                <span className="text-3xl block mb-2">{badge.emoji}</span>
                <p className="text-white text-sm font-medium">{badge.name}</p>
                <p className="text-xs text-gray-500 mt-1">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 pb-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-card p-10">
            <Star className="h-10 w-10 text-amber-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-3">准备好开始AI冒险了吗？</h2>
            <p className="text-gray-400 text-sm mb-6">
              每天5分钟，让孩子成为AI时代的小达人
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/picturebook"
                className="glass-card inline-flex items-center gap-2 px-5 py-2.5 text-sm text-white hover:scale-105 transition-all"
              >
                绘本故事
              </Link>
              <Link
                href="/crashai"
                className="glass-card inline-flex items-center gap-2 px-5 py-2.5 text-sm text-gray-400 hover:text-white hover:scale-105 transition-all"
              >
                进阶课程
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
