"use client";

import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Database,
  PenLine,
  ShoppingBag,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

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

const profileSections = [] as const;

export default function HomePage() {
  const session = useSession();
  const user = session.data?.user ?? null;

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-pink-500/10 blur-3xl" />
        </div>

        {/* Avatar */}
        <div className="glass-card mb-8 h-32 w-32 rounded-full p-1">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 text-4xl">
            🐂
          </div>
        </div>

        <h1 className="mb-2 text-4xl font-bold tracking-tight text-white">
          吕元卓 · <span className="text-gradient">LYUANZHUO</span>
        </h1>
        <p className="mb-6 max-w-xl text-lg text-gray-400">
          车辆安全 × AI应用工程师 · 14年专业经验
        </p>
        <p className="mb-8 max-w-2xl text-sm text-gray-500 italic">
          "正在从传统工程向AI转型，目标百万年薪"
        </p>

        <div className="flex gap-4">
          <button className="glass-card rounded-full px-6 py-2 text-sm font-medium text-white transition-all hover:scale-105">
            📄 下载简历
          </button>
          <button className="glass-card rounded-full px-6 py-2 text-sm font-medium text-gray-300 transition-all hover:scale-105">
            📧 联系我
          </button>
          <div className="absolute right-6 top-6">
            <ThemeToggle />
          </div>
        </div>
      </section>

      {/* Site Cards */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          🗺️ <span className="text-gradient">站点导航</span>
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => {
            const LucideIcon = site.lucideIcon;
            return (
              <Link
                key={site.label}
                href={site.href}
                className={cn(
                  "glass-card animate-fade-in group relative overflow-hidden p-6 transition-transform hover:scale-105",
                )}
              >
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100",
                    site.color,
                  )}
                />
                <div className="relative z-10">
                  {LucideIcon ? (
                    <LucideIcon className="mb-4 h-8 w-8 text-white/80" />
                  ) : (
                    <span className="mb-4 block text-3xl">{site.icon}</span>
                  )}
                  <h3 className="mb-1 text-lg font-semibold text-white">
                    {site.label}
                  </h3>
                  <p className="text-sm text-gray-500">{site.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 text-center">
        <p className="mb-2 text-sm text-gray-500">
          © 2026 吕元卓 · lvyuanzhuo@hotmail.com
        </p>
        <p className="text-xs text-gray-600">
          +86-150-4306-8993 | 不断学习 · 持续进化
        </p>
      </footer>
    </div>
  );
}
