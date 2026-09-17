// /learn/gn-crash - GNN+Transformer+物理约束 碰撞仿真降阶课程门户
// 设计对齐 /learn/pinn-crash + /learn/courses hub

import Link from "next/link";
import { Geist_Mono } from "next/font/google";
import { ArrowLeft, BookOpen, GraduationCap, Layers, Brain, BarChart3, Cpu, ArrowUpRight, BookMarked } from "lucide-react";

const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata = {
  title: "GNN 碰撞仿真降阶课程 · Lvyz Web",
  description: "图神经网络 + Transformer + 物理约束 · 7 章 · 35 张闪卡 + 7 章测验 + 期末",
};

const STATIC_BASE = "/courses/gn-crash-guide";

const MODULES = [
  { href: `${STATIC_BASE}/index.html`, icon: BookOpen, title: "课程主页", desc: "7 章进度跟踪 · 章节地图 · 学习仪表盘" },
  { href: `${STATIC_BASE}/flashcards.html`, icon: Brain, title: "闪卡复习", desc: "35 张 SM-2 间隔重复 · 跨 7 章" },
  { href: `${STATIC_BASE}/quizzes.html`, icon: GraduationCap, title: "章节测验 + 期末", desc: "5 种题型 · 70%/80% 通过 · 3 次答题" },
  { href: `${STATIC_BASE}/mistakes.html`, icon: Layers, title: "错题本", desc: "自动收集 · 重做 · 标记掌握" },
];

const CHAPTERS = [
  { num: 1, title: "碰撞仿真与降阶基础", slug: "01-crash-basics", summary: "ROM 思想 · GNN 优势" },
  { num: 2, title: "GNN 核心", slug: "02-gnn-core", summary: "GCN · GAT · GraphSAGE · EPD" },
  { num: 3, title: "Transformer 与长程依赖", slug: "03-transformer", summary: "注意力 · Transolver" },
  { num: 4, title: "物理约束与 PINN", slug: "04-physics-pinn", summary: "PDE 残差 · PhyGNNet" },
  { num: 5, title: "混合架构与前沿", slug: "05-hybrid-frontend", summary: "GNS · MeshGraphNet · 接触建模" },
  { num: 6, title: "工具框架与数据集", slug: "06-tools-datasets", summary: "PyG · DGL · JAX · ΦFlow" },
  { num: 7, title: "实战:弹簧-质点系统", slug: "07-spring-mass", summary: "DOE · 训练 · 可视化" },
];

const STATS = [
  { value: "7", label: "章节", accent: "from-emerald-400 to-cyan-400" },
  { value: "35", label: "闪卡", accent: "from-amber-400 to-orange-400" },
  { value: "56", label: "章节题", accent: "from-violet-400 to-fuchsia-400" },
  { value: "14h", label: "预计", accent: "from-rose-400 to-pink-400" },
];

export default function GnPortalPage() {
  return (
    <div className={`min-h-screen pt-28 px-6 pb-24 ${geistMono.variable}`}>
      <div className="mx-auto max-w-5xl">
        <header className="mb-12">
          <Link
            href="/learn/courses"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            返回课程中心
          </Link>
          <div className="flex items-start gap-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex-shrink-0">
              <Cpu className="h-7 w-7 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <h1 className="text-3xl font-bold text-white">GNN + Transformer + 物理约束</h1>
                <span className="font-mono text-xs text-gray-500 tracking-wider">
                  /learn/gn-crash
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-400">
                图神经网络 + 物理感知 Transformer · 系统掌握 AI 碰撞降阶的完整技术栈
              </p>
            </div>
          </div>
        </header>

        <section className="mb-12 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STATS.map((s) => (
            <div key={s.label} className="glass-card p-4 text-center">
              <div className={`font-mono text-3xl font-bold bg-gradient-to-r ${s.accent} bg-clip-text text-transparent`}>
                {s.value}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </section>

        <section className="mb-12">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">modules</span>
            4 大功能模块
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MODULES.map((m) => {
              const Icon = m.icon;
              return (
                <a
                  key={m.href}
                  href={m.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card group block p-5 hover:-translate-y-0.5 transition-all"
                >
                  <Icon className="h-6 w-6 text-emerald-400 mb-3" />
                  <h3 className="text-base font-semibold text-white mb-1 flex items-center justify-between">
                    {m.title}
                    <ArrowUpRight className="h-3.5 w-3.5 text-gray-500 group-hover:text-emerald-300 transition-colors" />
                  </h3>
                  <p className="text-xs text-gray-400">{m.desc}</p>
                </a>
              );
            })}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BookMarked className="h-5 w-5 text-emerald-400" />
            7 章课程地图
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CHAPTERS.map((c) => (
              <a
                key={c.slug}
                href={`${STATIC_BASE}/chapter-${c.slug}.html`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card group p-4 hover:border-emerald-400/30"
              >
                <div className="flex items-center gap-3">
                  <div className="font-mono inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300 text-sm font-bold">
                    {String(c.num).padStart(2, "0")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-white truncate">
                      第 {c.num} 章 · {c.title}
                    </h3>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-gray-500 mt-0.5 line-clamp-1">
                      {c.summary}
                    </p>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-gray-500 group-hover:text-emerald-300 transition-colors flex-shrink-0" />
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="glass-card p-6 text-sm text-gray-400">
          <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-emerald-400" />
            使用说明
          </h3>
          <ul className="space-y-2 list-disc list-inside">
            <li>点击任意章节/功能 → 在<strong className="text-emerald-400">新窗口</strong>打开</li>
            <li>所有进度、笔记、闪卡评分保存在浏览器 <strong className="text-emerald-400">localStorage</strong>(不联网)</li>
            <li>包含 PyG / DGL / JAX 等工具栈介绍 · 实战章有弹簧-质点系统完整实现路径</li>
            <li>右下角紫色 FAB 可一键返回 主页 / 课程中心 / 当前课程地图</li>
          </ul>
        </section>
      </div>
    </div>
  );
}