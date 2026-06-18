"use client";

import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Database,
  PenLine,
  ShoppingBag,
  Volume2,
  VolumeX,
  ChevronDown,
  Play,
  Pause,
} from "lucide-react";

const sites = [
  {
    href: "/crashai",
    label: "AI学习",
    desc: "24主题 · 1500+卡片 · AI转行作战图",
    icon: "🎓",
    color: "from-indigo-500/20 to-purple-500/20",
  },
  {
    href: "/kids-ai",
    label: "儿童学堂",
    desc: "AI启蒙 · 创意工坊 · 成就系统",
    icon: "🧒",
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    href: "/picturebook",
    label: "绘本",
    desc: "雷迪嘎嘎系列 · 1840个故事",
    icon: "📖",
    lucideIcon: BookOpen,
    color: "from-pink-500/20 to-rose-500/20",
  },
  {
    href: "/knowledge-base",
    label: "知识库",
    desc: "Dify RAG · 车辆安全 · 技术文档",
    icon: "📚",
    lucideIcon: Database,
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    href: "/blog",
    label: "博客",
    desc: "技术笔记 · 学习心得 · 行业观点",
    icon: "✍️",
    lucideIcon: PenLine,
    color: "from-orange-500/20 to-yellow-500/20",
  },
  {
    href: "/merchandise",
    label: "IP周边",
    desc: "学习产品 · 知识变现 · 未来",
    icon: "🛍️",
    lucideIcon: ShoppingBag,
    color: "from-amber-500/20 to-orange-500/20",
  },
];

// 《也乡愁》 —— 吕元卓 (按段分组)
const POEM_TITLE = "也乡愁";
const POEM_SECTIONS = [
  ["故乡啊故乡", "不想回头望", "少不经事", "未曾理会", "久久伫立的爹娘", "和那一握尘土的芬芳"],
  ["故乡啊故乡", "经不住回想", "岁月荣枯", "牵挂离肠", "桀骜偷偷的消弭", "而惆怅却悄悄的膨胀"],
  ["故乡啊故乡", "默默的徜徉", "人生苦短", "光阴难长", "多了些鲜嫩的声线", "却少了些旧识的面庞"],
  ["故乡啊故乡", "不要回头望", "人老珠黄", "眉酸泪烫", "怕冲散了精致的容妆", "还是留下了伤心的模样"],
  ["故乡啊故乡", "已无法回望", "明日不在", "今时已殇", "听不见无助的叹息", "停不下羸弱的心房"],
  ["故乡啊故乡", "请你", "把我相忘"],
];
const SECTION_INTERVAL = 3000; // 3 秒一段

// 背景音乐 URL
const BGM_URL = "https://media.lvyz.org/music/ye-xiang-chou.aac";
const BGM_KEY = "lvyz-home-bgm-muted";

export default function HomePage() {
  const session = useSession();
  const user = session.data?.user ?? null;
  const [bgmMuted, setBgmMuted] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 自动播放背景音乐（首次点击页面后开始）
  useEffect(() => {
    const savedMuted = localStorage.getItem(BGM_KEY);
    if (savedMuted !== null) setBgmMuted(savedMuted === "true");

    if (!audioRef.current) {
      audioRef.current = new Audio(BGM_URL);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.35;
    }

    const startAudio = () => {
      if (audioRef.current && !bgmMuted) {
        audioRef.current.play().catch(() => {});
      }
      document.removeEventListener("click", startAudio);
      document.removeEventListener("keydown", startAudio);
    };
    document.addEventListener("click", startAudio, { once: true });
    document.addEventListener("keydown", startAudio, { once: true });

    return () => {
      document.removeEventListener("click", startAudio);
      document.removeEventListener("keydown", startAudio);
      if (audioRef.current) audioRef.current.pause();
    };
  }, [bgmMuted]);

  // 诗段自动滚动：3 秒一段
  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(() => {
      setActiveSection((s) => (s + 1) % POEM_SECTIONS.length);
    }, SECTION_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused]);

  const toggleBgm = () => {
    const newMuted = !bgmMuted;
    setBgmMuted(newMuted);
    localStorage.setItem(BGM_KEY, String(newMuted));
    if (audioRef.current) {
      if (newMuted) audioRef.current.pause();
      else audioRef.current.play().catch(() => {});
    }
  };

  const currentLines = POEM_SECTIONS[activeSection];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section — 诗体滚动 */}
      <section className="relative flex flex-col items-center justify-center px-6 py-12 text-center min-h-[40vh]">
        {/* 装饰光斑 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-pink-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-amber-500/5 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-2xl w-full">
          <h1 className="mb-8 text-2xl font-bold text-white">
            <span className="text-gradient">{POEM_TITLE}</span>
          </h1>

          {/* 诗段（每 3 秒切换） */}
          <div className="min-h-[200px] flex items-center justify-center">
            <div
              key={activeSection}
              className="animate-fade-in space-y-2 text-gray-200"
            >
              {currentLines.map((line, i) => (
                <p
                  key={i}
                  className="text-xl sm:text-2xl leading-relaxed"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* 段指示器 + 控制 */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              aria-label={isPaused ? "继续滚动" : "暂停滚动"}
            >
              {isPaused ? (
                <Play className="h-3.5 w-3.5" />
              ) : (
                <Pause className="h-3.5 w-3.5" />
              )}
            </button>
            <div className="flex gap-1.5">
              {POEM_SECTIONS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveSection(i);
                    setIsPaused(true);
                  }}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === activeSection
                      ? "w-6 bg-amber-400"
                      : "w-1.5 bg-white/20 hover:bg-white/40"
                  )}
                  aria-label={`第 ${i + 1} 段`}
                />
              ))}
            </div>
            <button
              onClick={() => setActiveSection((s) => (s + 1) % POEM_SECTIONS.length)}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              aria-label="下一段"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* 背景音乐控制 */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
            <button
              onClick={toggleBgm}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              {bgmMuted ? (
                <>
                  <VolumeX className="h-3.5 w-3.5" />
                  音乐已关
                </>
              ) : (
                <>
                  <Volume2 className="h-3.5 w-3.5 animate-pulse" />
                  音乐播放中
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Site Cards — 缩小板块 */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="mb-6 text-center text-lg font-bold text-white">
          🗺️ <span className="text-gradient">站点导航</span>
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => {
            const LucideIcon = site.lucideIcon;
            return (
              <Link
                key={site.label}
                href={site.href}
                className={cn(
                  "glass-card animate-fade-in group relative overflow-hidden p-4 transition-transform hover:scale-105",
                )}
              >
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100",
                    site.color,
                  )}
                />
                <div className="relative z-10 flex items-center gap-3">
                  {LucideIcon ? (
                    <LucideIcon className="h-6 w-6 text-white/80 flex-shrink-0" />
                  ) : (
                    <span className="text-2xl flex-shrink-0">{site.icon}</span>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {site.label}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">{site.desc}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-6 text-center">
        <p className="text-xs text-gray-600">
          不断学习 · 持续进化
        </p>
      </footer>
    </div>
  );
}
