// /learn/gn-crash - GNN+Transformer+物理约束 碰撞仿真降阶课程门户
// 跳转逻辑：因为课程是客户端 localStorage 静态资源，不适合 SSR 集成。

import Link from "next/link";
import { ArrowLeft, BookOpen, GraduationCap, Layers, FileText, Brain, Sparkles } from "lucide-react";

export const metadata = {
  title: "GNN 碰撞仿真降阶课程 · Lvyz Web",
  description: "图神经网络 + Transformer + 物理约束 · 7 章 · 35 张闪卡 + 7 章测验 + 期末",
};

const STATIC_BASE = "/courses/gn-crash-guide";

const FEATURES = [
  {
    href: `${STATIC_BASE}/index.html`,
    icon: BookOpen,
    title: "课程主页",
    desc: "7 章进度跟踪 · 章节地图 · 学习仪表盘",
    color: "from-emerald-500/20 to-cyan-500/20",
  },
  {
    href: `${STATIC_BASE}/flashcards.html`,
    icon: Brain,
    title: "闪卡复习",
    desc: "35 张 SM-2 间隔重复卡片 · 跨 7 章",
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    href: `${STATIC_BASE}/quizzes.html`,
    icon: GraduationCap,
    title: "章节测验 + 期末",
    desc: "5 种题型 · 70%/80% 通过 · 3 次答题",
    color: "from-amber-500/20 to-orange-500/20",
  },
  {
    href: `${STATIC_BASE}/mistakes.html`,
    icon: Layers,
    title: "错题本",
    desc: "自动收集错题 · 重做 · 标记掌握",
    color: "from-emerald-500/20 to-green-500/20",
  },
];

const CHAPTERS = [
  { num: 1, title: "碰撞仿真与降阶基础", slug: "01-crash-basics" },
  { num: 2, title: "GNN 核心（GCN/GAT/GraphSAGE）", slug: "02-gnn-core" },
  { num: 3, title: "Transformer 与长程依赖", slug: "03-transformer" },
  { num: 4, title: "物理约束与 PINN", slug: "04-physics-pinn" },
  { num: 5, title: "混合架构与前沿方法", slug: "05-hybrid-frontend" },
  { num: 6, title: "工具框架与数据集", slug: "06-tools-datasets" },
  { num: 7, title: "实战：弹簧-质点系统", slug: "07-spring-mass" },
];

export default function GnPortalPage() {
  return (
    <div className="min-h-screen pt-28 px-6 pb-16">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
          <div className="flex items-start gap-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex-shrink-0">
              <FileText className="h-7 w-7 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                <span className="text-gradient">GNN + Transformer + 物理约束</span> 碰撞仿真降阶
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                从图神经网络到物理感知 Transformer · 系统掌握 AI 碰撞降阶的完整技术栈
              </p>
              <p className="mt-2 text-xs text-gray-500">
                7 章 · 35 张闪卡 · 56 道章节测验 + 13 道期末综合 · 客户端 localStorage 离线学习
              </p>
            </div>
          </div>
        </header>

        <section className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            4 大功能模块
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <a
                  key={f.href}
                  href={f.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`glass-card group block p-5 bg-gradient-to-br ${f.color}`}
                >
                  <Icon className="h-6 w-6 text-white mb-3" />
                  <h3 className="text-base font-semibold text-white mb-1">{f.title}</h3>
                  <p className="text-xs text-gray-400">{f.desc}</p>
                </a>
              );
            })}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-400" />
            7 章课程
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CHAPTERS.map((c) => (
              <a
                key={c.slug}
                href={`${STATIC_BASE}/chapter-${c.slug}.html`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card group p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-sm flex-shrink-0">
                    Ch{c.num}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-white truncate">
                      第 {c.num} 章 · {c.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      <a
                        href={`${STATIC_BASE}/quiz-${c.slug}.html`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-emerald-300"
                      >
                        章节测验 →
                      </a>
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="glass-card p-6 text-sm text-gray-400">
          <h3 className="text-base font-semibold text-white mb-3">使用说明</h3>
          <ul className="space-y-2 list-disc list-inside">
            <li>点击任意章节/功能 → 在<strong className="text-emerald-400">新窗口</strong>打开</li>
            <li>所有进度、笔记、闪卡评分、错题保存在浏览器 <strong className="text-emerald-400">localStorage</strong>（不联网）</li>
            <li>SM-2 算法自动安排闪卡复习节奏</li>
            <li>章节测验通过 70% / 期末 80% · 每测验最多 3 次答题</li>
            <li>包含 PyG / DGL / JAX 等工具栈介绍,实战章有弹簧-质点系统完整实现路径</li>
          </ul>
        </section>
      </div>
    </div>
  );
}