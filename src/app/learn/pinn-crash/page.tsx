// /learn/pinn-crash - AI+DOE+PINN 仿真降阶课程门户
// 设计对齐 /learn/courses hub:font-mono 数字、玻璃拟物卡片、5 步闭环思想

import Link from "next/link";
import { Geist_Mono } from "next/font/google";
import { ArrowLeft, BookOpen, GraduationCap, Layers, Brain, BarChart3, Atom, ArrowUpRight, BookMarked } from "lucide-react";

const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata = {
  title: "AI+DOE+PINN 仿真降阶课程 · Lvyz Web",
  description: "物理信息神经网络 + 实验设计 + 碰撞仿真降阶 · 6 章 · 闪卡 + 章节测验 + 期末考试",
};

const STATIC_BASE = "/courses/pinn-crash-reduction";

const MODULES = [
  { href: `${STATIC_BASE}/index.html`, icon: BookOpen, title: "课程主页", desc: "6 章进度跟踪 · 章节地图 · 学习仪表盘" },
  { href: `${STATIC_BASE}/flashcards.html`, icon: Brain, title: "闪卡复习", desc: "35 张 SM-2 间隔重复 · 4 档评分" },
  { href: `${STATIC_BASE}/quizzes.html`, icon: GraduationCap, title: "章节测验 + 期末", desc: "5 种题型 · 70%/80% 通过 · 3 次答题" },
  { href: `${STATIC_BASE}/mistakes.html`, icon: Layers, title: "错题本", desc: "自动收集 · 重做 · 标记掌握" },
];

const CHAPTERS = [
  { num: 1, title: "AI+DOE+PINN 技术原理", slug: "01-tech-foundations", summary: "三段式技术链路 · PINN 损失 · DOE 采样" },
  { num: 2, title: "学术前沿与代表性工作", slug: "02-research-progress", summary: "Luminary SHIFT · MeshGraphNet · Transolver" },
  { num: 3, title: "多尺度建模与跨域融合", slug: "03-multiscale", summary: "HOMS-PINN · PRNN · 微-介-宏观协同" },
  { num: 4, title: "工具链与开源框架", slug: "04-tools-frameworks", summary: "DeepXDE · PhysicsNeMo · PyG · DGL" },
  { num: 5, title: "工程实践与产业落地", slug: "05-engineering-practice", summary: "4 阶段路线 · 风险 · 成功案例" },
  { num: 6, title: "入门路径与学习建议", slug: "06-getting-started", summary: "硬件 · 学习路径 · 7 步实践" },
];

const STATS = [
  { value: "6", label: "章节", accent: "from-purple-400 to-pink-400" },
  { value: "35", label: "闪卡", accent: "from-amber-400 to-orange-400" },
  { value: "60", label: "章节题", accent: "from-emerald-400 to-cyan-400" },
  { value: "12h", label: "预计", accent: "from-violet-400 to-fuchsia-400" },
];

export default function PinnPortalPage() {
  return (
    <div className={`min-h-screen pt-28 px-6 pb-24 ${geistMono.variable}`}>
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-12">
          <Link
            href="/learn/courses"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            返回课程中心
          </Link>
          <div className="flex items-start gap-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex-shrink-0">
              <Atom className="h-7 w-7 text-purple-400" />
            </div>
            <div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <h1 className="text-3xl font-bold text-white">AI+DOE+PINN 仿真降阶</h1>
                <span className="font-mono text-xs text-gray-500 tracking-wider">
                  /learn/pinn-crash
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-400">
                物理信息神经网络 + 实验设计 + 汽车碰撞降阶 · 工程师视角完整技术链路
              </p>
            </div>
          </div>
        </header>

        {/* 数字统计 - mono 编码 */}
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

        {/* 4 大功能模块 */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-purple-400">modules</span>
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
                  <Icon className="h-6 w-6 text-purple-400 mb-3" />
                  <h3 className="text-base font-semibold text-white mb-1 flex items-center justify-between">
                    {m.title}
                    <ArrowUpRight className="h-3.5 w-3.5 text-gray-500 group-hover:text-purple-300 transition-colors" />
                  </h3>
                  <p className="text-xs text-gray-400">{m.desc}</p>
                </a>
              );
            })}
          </div>
        </section>

        {/* 6 章节课程地图 */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BookMarked className="h-5 w-5 text-purple-400" />
            6 章课程地图
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CHAPTERS.map((c) => (
              <a
                key={c.slug}
                href={`${STATIC_BASE}/chapter-${c.slug}.html`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card group p-4 hover:border-purple-400/30"
              >
                <div className="flex items-center gap-3">
                  <div className="font-mono inline-flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/15 text-purple-300 text-sm font-bold">
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
                  <ArrowUpRight className="h-3.5 w-3.5 text-gray-500 group-hover:text-purple-300 transition-colors flex-shrink-0" />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 课程提醒 */}
        <section className="glass-card p-6 text-sm text-gray-400">
          <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-purple-400" />
            使用说明
          </h3>
          <ul className="space-y-2 list-disc list-inside">
            <li>点击任意章节/功能 → 在<strong className="text-purple-400">新窗口</strong>打开(侧栏独立,不丢失 lvyz.org 状态)</li>
            <li>所有进度、笔记、闪卡评分保存在浏览器 <strong className="text-purple-400">localStorage</strong>(不联网)</li>
            <li>建议每个章节:精读 → 测验 → 闪卡复盘 → 导出讲解模板</li>
            <li>右下角紫色 FAB 可一键返回 主页 / 课程中心 / 当前课程地图</li>
          </ul>
        </section>
      </div>
    </div>
  );
}