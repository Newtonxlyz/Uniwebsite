"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles, Wrench, Mic, Pen, Music, ImageIcon, BookOpen, Volume2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const TOOLS = [
  {
    id: "story",
    name: "AI 故事生成",
    desc: "告诉我你想要什么故事，我帮你写！",
    icon: BookOpen,
    color: "#FF6B9D",
    placeholder: "比如：一只小恐龙在太空冒险",
  },
  {
    id: "draw",
    name: "AI 画画",
    desc: "描述你想要的画面，AI 来画",
    icon: ImageIcon,
    color: "#4ECDC4",
    placeholder: "比如：彩虹色的小猫在云朵上跳舞",
  },
  {
    id: "music",
    name: "AI 音乐",
    desc: "描述你想要的音乐风格",
    icon: Music,
    color: "#A78BFA",
    placeholder: "比如：欢快的钢琴曲，节奏轻快",
  },
  {
    id: "voice",
    name: "AI 语音",
    desc: "把文字变成好听的声音",
    icon: Volume2,
    color: "#FB923C",
    placeholder: "输入你想读出来的文字",
  },
  {
    id: "poem",
    name: "AI 写诗",
    desc: "给一个主题，AI 写一首小诗",
    icon: Pen,
    color: "#FFE66D",
    placeholder: "比如：春天、友谊、我的妈妈",
  },
];

export default function CreatePage() {
  const [activeTool, setActiveTool] = useState(TOOLS[0]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setOutput(null);

    // 本地模拟生成（无 token 消耗）
    await new Promise((r) => setTimeout(r, 1500));

    const templates: Record<string, string> = {
      story: `🌟 你的故事\n\n从前，${input}。\n\n这是一个充满想象的世界。\n让我们一起走进这个奇妙的故事...`,
      draw: `🎨 你的画面\n\n画面描述：${input}\n\n（用 4-3 比例，鲜艳色彩）`,
      music: `🎵 你的音乐\n\n风格：${input}\n\n（轻快节奏，欢快旋律）`,
      voice: `🔊 你的语音\n\n朗读内容：${input}\n\n（童声配音）`,
      poem: `📝 你的诗\n\n主题：${input}\n\n春风吹过田野\n小鸟在枝头歌唱\n${input} 多么美好\n让我们一起拥抱`,
    };
    setOutput(templates[activeTool.id] || "已生成！");
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-16" style={{ background: "linear-gradient(180deg, #FFF5F7 0%, #F0F9FF 100%)" }}>
      <div className="max-w-5xl mx-auto">
        <Link
          href="/kids-ai"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          返回 Kids AI 首页
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs mb-3 bg-white/80 backdrop-blur border-2" style={{ borderColor: "#A78BFA", color: "#A78BFA" }}>
            <Wrench className="h-3 w-3" />
            创意工坊
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: "#A78BFA" }}>
            5 个 AI 创作工具
          </h1>
          <p className="text-sm text-gray-500">
            描述你的想法，AI 帮你创作（本地模拟，无需 token）
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-3 mb-6">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => {
                  setActiveTool(tool);
                  setInput("");
                  setOutput(null);
                }}
                className={cn(
                  "p-4 rounded-2xl text-center transition-all border-2",
                  activeTool.id === tool.id
                    ? "bg-white shadow-lg -translate-y-1"
                    : "bg-white/60 hover:bg-white hover:shadow"
                )}
                style={{ borderColor: activeTool.id === tool.id ? tool.color : "transparent" }}
              >
                <div
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl mb-2"
                  style={{ background: `${tool.color}20`, color: tool.color }}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-gray-800">{tool.name}</h3>
              </button>
            );
          })}
        </div>

        {/* 工作区 */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-2" style={{ color: activeTool.color }}>
            {activeTool.name}
          </h2>
          <p className="text-sm text-gray-500 mb-4">{activeTool.desc}</p>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={activeTool.placeholder}
            rows={4}
            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-pink-300 focus:outline-none text-sm resize-none"
          />

          <button
            onClick={handleGenerate}
            disabled={!input.trim() || loading}
            className="mt-4 w-full py-3 rounded-2xl text-white font-bold shadow-lg disabled:opacity-50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            style={{ background: `linear-gradient(135deg, ${activeTool.color} 0%, #FF6B9D 100%)` }}
          >
            {loading ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                开始创作
              </>
            )}
          </button>

          {output && (
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-yellow-50 to-pink-50 text-sm whitespace-pre-line">
              {output}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
