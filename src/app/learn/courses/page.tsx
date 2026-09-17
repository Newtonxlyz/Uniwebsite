// /learn/courses - 顶级课程中心
// 与 WIKI / BLOG 平级,展示 PINN + GNN 两门课程
// 设计哲学:"学会并能讲解" — 每个课程围绕 课程地图 → 学习 → 闪卡 → 测验 → 错题 → 笔记 → 报告 闭环

import Link from "next/link";
import { ArrowLeft, BookOpen, GraduationCap, Layers, Brain, Sparkles, Atom, Cpu, Flame, FileText, BarChart3 } from "lucide-react";
import { CourseProgressHub } from "@/components/course-progress-hub";

export const metadata = {
  title: "课程中心 · Lvyz Web",
  description: "AI+汽车安全系统课程 · 学会并能讲解 · 课程地图 · 闪卡 · 章节测验 · 错题本 · 学习报告",
};

// 课程元数据(与各课程主页对齐)
const COURSES = [
  {
    slug: "pinn-crash",
    title: "AI+DOE+PINN 仿真降阶",
    subtitle: "物理信息神经网络 · 实验设计 · 汽车碰撞降阶",
    chapters: 6,
    flashcards: 35,
    quizzes: 60,
    finalQuizzes: 15,
    duration: "12 小时",
    level: "进阶",
    tags: ["PINN", "DOE", "碰撞仿真", "降阶"],
    color: "from-purple-500/30 to-pink-500/30",
    accent: "purple",
    icon: Atom,
  },
  {
    slug: "gn-crash",
    title: "GNN + Transformer + 物理约束",
    subtitle: "图神经网络 + 物理感知 Transformer · 碰撞降阶",
    chapters: 7,
    flashcards: 35,
    quizzes: 56,
    finalQuizzes: 13,
    duration: "14 小时",
    level: "进阶",
    tags: ["GNN", "Transformer", "PINN", "工具"],
    color: "from-emerald-500/30 to-cyan-500/30",
    accent: "emerald",
    icon: Cpu,
  },
];

// 5 步学习方法论 (为什么"学会并能讲解"必须这套闭环)
const LEARN_LOOP = [
  { icon: BookOpen, title: "课程地图", desc: "总览章节结构 · 标记已会 / 在学 / 未学状态" },
  { icon: FileText, title: "逐章精读", desc: "正文 + 笔记 + 关键概念标注" },
  { icon: Brain, title: "闪卡复盘", desc: "SM-2 间隔重复,AI 自动安排复习节奏" },
  { icon: GraduationCap, title: "章节测验", desc: "70% 通过 · 错题自动入错题本" },
  { icon: BarChart3, title: "讲解就绪", desc: "每章末导出讲解模板,3 分钟能复述" },
];

export default function CoursesHubPage() {
  return (
    <div className="min-h-screen pt-28 px-6 pb-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
          <div className="flex items-start gap-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex-shrink-0">
              <GraduationCap className="h-7 w-7 text-violet-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                <span className="text-gradient">课程中心</span>
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                汽车安全 + AI 系统课程 · 围绕<span className="text-violet-400 font-medium">"学会并能讲解"</span> 的 5 步学习闭环
              </p>
              <p className="mt-2 text-xs text-gray-500">
                课程地图 · 闪卡 SM-2 · 章节测验 · 错题本 · 学习报告 · 讲解模板
              </p>
            </div>
          </div>
        </header>

        {/* 我的学习进度(客户端组件,从 localStorage 读) */}
        <CourseProgressHub courses={COURSES} />

        {/* 课程卡片网格 */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-violet-400" />
            当前开放课程
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {COURSES.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.slug}
                  className={`glass-card overflow-hidden p-6 bg-gradient-to-br ${c.color}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                      {c.level}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{c.title}</h3>
                  <p className="text-xs text-white/70 mb-4">{c.subtitle}</p>

                  <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
                    <div className="rounded-lg bg-black/20 p-2 text-center">
                      <div className="text-white font-semibold text-base">{c.chapters}</div>
                      <div className="text-white/60">章节</div>
                    </div>
                    <div className="rounded-lg bg-black/20 p-2 text-center">
                      <div className="text-white font-semibold text-base">{c.flashcards}</div>
                      <div className="text-white/60">闪卡</div>
                    </div>
                    <div className="rounded-lg bg-black/20 p-2 text-center">
                      <div className="text-white font-semibold text-base">{c.quizzes + c.finalQuizzes}</div>
                      <div className="text-white/60">题</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-5">
                    {c.tags.map((t) => (
                      <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/learn/${c.slug}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
                    >
                      <BookOpen className="h-4 w-4" />
                      课程地图
                    </Link>
                    <Link
                      href={`/courses/${c.slug === 'pinn-crash' ? 'pinn-crash-reduction' : 'gn-crash-guide'}/index.html`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
                    >
                      开始学习 →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5 步学习闭环 */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-400" />
            "学会并能讲解"5 步闭环
          </h2>
          <div className="glass-card p-6">
            <div className="grid gap-4 sm:grid-cols-5">
              {LEARN_LOOP.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-violet-300 text-xs font-bold">
                        {idx + 1}
                      </span>
                      <Icon className="h-4 w-4 text-violet-400" />
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1">{step.title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                    {idx < LEARN_LOOP.length - 1 && (
                      <div className="hidden sm:block absolute top-3 -right-2 w-4 h-px bg-gradient-to-r from-violet-500/50 to-transparent" />
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-5 leading-relaxed">
              <strong className="text-white/80">核心逻辑</strong>:
              单向输入(只读)不够,必须经过 <span className="text-violet-400">测验</span>(提取)和
              <span className="text-violet-400"> 讲解</span>(输出)才能真正掌握。每个环节都对应课程里的具体功能。
            </p>
          </div>
        </section>

        {/* 使用提示 */}
        <section className="glass-card p-6 text-sm text-gray-400">
          <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-400" />
            使用提示
          </h3>
          <ul className="space-y-2 list-disc list-inside">
            <li>所有进度、笔记、闪卡评分保存在浏览器 <strong className="text-violet-400">localStorage</strong>(不联网)</li>
            <li>双击课程 HTML 也可独立打开(纯静态,无后端依赖)</li>
            <li>建议每个章节:精读 + 笔记 + 测验 + 复习闪卡 + 导出讲解模板</li>
            <li>章节测验 <strong className="text-violet-400">70% 通过</strong> · 期末 <strong className="text-violet-400">80% 通过</strong> · 每测验最多 3 次</li>
          </ul>
        </section>
      </div>
    </div>
  );
}