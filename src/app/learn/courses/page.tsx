// /learn/courses - 课程中心
// 设计原则(来自 frontend-design):
//   - 延续 lvyz 品牌(玻璃拟物深色),不引入 cream/serif 默认风格
//   - 数字用 Geist Mono 编码尺寸信息量(6 / 7 / 24 章节)
//   - 每张课程卡用一致的卡片骨架,只改主题色 + 图标
//   - "5 步闭环"作为教学哲学的视觉签名(所有课程共用)
//   - Hover 卡片轻微 scale + 阴影加深

import Link from "next/link";
import { Geist_Mono } from "next/font/google";
import { ArrowLeft, BookOpen, GraduationCap, Brain, FileText, BarChart3, Atom, Cpu, ArrowUpRight } from "lucide-react";
import { CourseProgressHub } from "@/components/course-progress-hub";

const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata = {
  title: "课程中心 · Lvyz Web",
  description: "AI + 汽车安全 系统课程 · 学会并能讲解 · 课程地图 · 闪卡 · 章节测验 · 错题本 · 学习报告",
};

const COURSES = [
  {
    slug: "pinn-crash",
    title: "AI+DOE+PINN 仿真降阶",
    subtitle: "物理信息神经网络 · 实验设计 · 汽车碰撞降阶",
    chapters: 6,
    flashcards: 35,
    duration: "12h",
    level: "进阶",
    tags: ["PINN", "DOE", "碰撞"],
    color: "from-purple-500/30 to-pink-500/30",
    accent: "from-purple-400 to-pink-400",
    iconName: "atom",
  },
  {
    slug: "gn-crash",
    title: "GNN + Transformer + 物理约束",
    subtitle: "图神经网络 + 物理感知 Transformer · 碰撞降阶",
    chapters: 7,
    flashcards: 35,
    duration: "14h",
    level: "进阶",
    tags: ["GNN", "Transformer", "物理约束"],
    color: "from-emerald-500/30 to-cyan-500/30",
    accent: "from-emerald-400 to-cyan-400",
    iconName: "cpu",
  },
  {
    slug: "crashai",
    title: "crashAI · AI 转行作战图",
    subtitle: "24 主题 · 1500+ 闪卡 · 4 路径实操",
    chapters: 24,
    flashcards: 1500,
    duration: "60h+",
    level: "入门 → 转行",
    tags: ["AI 基础", "学习路径", "闪卡"],
    color: "from-indigo-500/30 to-violet-500/30",
    accent: "from-indigo-400 to-violet-400",
    iconName: "graduation",
  },
];

// 5 步学习闭环(教学哲学的视觉签名 - 所有课程共用)
const LEARN_LOOP = [
  { n: "01", icon: BookOpen, title: "课程地图", desc: "总览章节结构 · 标记已会 / 在学 / 未学" },
  { n: "02", icon: FileText, title: "逐章精读", desc: "正文 + 笔记 + 关键概念标注" },
  { n: "03", icon: Brain, title: "闪卡复盘", desc: "SM-2 间隔重复 · AI 安排复习节奏" },
  { n: "04", icon: GraduationCap, title: "章节测验", desc: "70% 通过 · 错题自动入错题本" },
  { n: "05", icon: BarChart3, title: "讲解就绪", desc: "导出讲解模板 · 3 分钟能复述" },
];

export default function CoursesHubPage() {
  return (
    <div className={`min-h-screen pt-28 px-6 pb-24 ${geistMono.variable}`}>
      <div className="mx-auto max-w-6xl">
        {/* Header — 主标识 (signature thesis) */}
        <header className="mb-14">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            返回 Lvyz 主页
          </Link>
          <div className="flex items-start gap-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex-shrink-0">
              <GraduationCap className="h-7 w-7 text-violet-400" />
            </div>
            <div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <h1 className="text-3xl font-bold text-white">课程中心</h1>
                <span className="font-mono text-xs text-gray-500 tracking-wider">
                  /learn/courses
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-400">
                汽车安全 + AI 系统课程 · 围绕
                <span className="text-violet-400 font-medium">"学会并能讲解"</span>
                的 5 步闭环
              </p>
            </div>
          </div>
        </header>

        {/* 我的学习进度(读 localStorage) */}
        <CourseProgressHub courses={COURSES} />

        {/* 3 门课程卡片 - 视觉统一,只换主题色 + 图标 */}
        <section className="mb-16">
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-violet-400" />
            当前开放课程
            <span className="font-mono text-xs text-gray-500 ml-auto">{COURSES.length} 门</span>
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {COURSES.map((c) => {
              const Icon = c.iconName === "atom" ? Atom : c.iconName === "cpu" ? Cpu : GraduationCap;
              return (
                <div
                  key={c.slug}
                  className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${c.color} hover:border-white/30 transition-all hover:-translate-y-0.5 hover:shadow-2xl`}
                >
                  {/* 角落光晕 */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />

                  <div className="relative p-6">
                    {/* Header:图标 + 等级 */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-black/30 backdrop-blur">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-white/70 px-2 py-1 rounded bg-black/20">
                        {c.level}
                      </span>
                    </div>

                    {/* 标题 */}
                    <h3 className="text-base font-bold text-white mb-1 leading-snug">{c.title}</h3>
                    <p className="text-xs text-white/60 mb-5 line-clamp-2 leading-relaxed">{c.subtitle}</p>

                    {/* 数字(用 mono 编码信息量) */}
                    <div className="grid grid-cols-3 gap-2 mb-5">
                      <div className="rounded-lg bg-black/30 backdrop-blur px-2 py-2.5 text-center">
                        <div className={`font-mono text-xl font-bold bg-gradient-to-r ${c.accent} bg-clip-text text-transparent`}>
                          {c.chapters}
                        </div>
                        <div className="font-mono text-[10px] uppercase tracking-wider text-white/50 mt-0.5">
                          章节
                        </div>
                      </div>
                      <div className="rounded-lg bg-black/30 backdrop-blur px-2 py-2.5 text-center">
                        <div className={`font-mono text-xl font-bold bg-gradient-to-r ${c.accent} bg-clip-text text-transparent`}>
                          {c.flashcards >= 1000
                            ? `${(c.flashcards / 1000).toFixed(1)}k`
                            : c.flashcards}
                        </div>
                        <div className="font-mono text-[10px] uppercase tracking-wider text-white/50 mt-0.5">
                          闪卡
                        </div>
                      </div>
                      <div className="rounded-lg bg-black/30 backdrop-blur px-2 py-2.5 text-center">
                        <div className={`font-mono text-xl font-bold bg-gradient-to-r ${c.accent} bg-clip-text text-transparent`}>
                          {c.duration}
                        </div>
                        <div className="font-mono text-[10px] uppercase tracking-wider text-white/50 mt-0.5">
                          预计
                        </div>
                      </div>
                    </div>

                    {/* 标签 */}
                    <div className="flex flex-wrap gap-1 mb-5">
                      {c.tags.map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/25 text-white/60"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="flex gap-2">
                      <Link
                        href={`/learn/${c.slug}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
                      >
                        课程地图
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={
                          c.slug === "pinn-crash" ? "/courses/pinn-crash-reduction/index.html" :
                          c.slug === "gn-crash" ? "/courses/gn-crash-guide/index.html" :
                          "/crashai"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-black/30 text-white text-sm hover:bg-black/50 transition-colors backdrop-blur"
                        title="进入课程内容"
                      >
                        开始 →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5 步学习闭环(签名) */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-orange-400" />
            "学会并能讲解" 5 步闭环
          </h2>
          <div className="glass-card p-6">
            <div className="grid gap-5 sm:grid-cols-5">
              {LEARN_LOOP.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-violet-400">
                        {step.n}
                      </span>
                      <Icon className="h-4 w-4 text-violet-400" />
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1">{step.title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                    {idx < LEARN_LOOP.length - 1 && (
                      <div className="hidden sm:block absolute top-3 -right-3 w-3 h-px bg-gradient-to-r from-violet-500/40 to-transparent" />
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-6 leading-relaxed border-t border-white/5 pt-4">
              <strong className="text-white/80 font-mono text-[10px] uppercase tracking-wider">why</strong>
              <span className="ml-2">
                单向输入(只读)不够,必须经过 <span className="text-violet-400">测验</span>(提取)和
                <span className="text-violet-400"> 讲解</span>(输出)才能真正掌握。每个环节都对应课程里的具体功能。
              </span>
            </p>
          </div>
        </section>

        {/* 使用提示 */}
        <section className="glass-card p-6 text-sm text-gray-400">
          <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-violet-400">usage</span>
            使用提示
          </h3>
          <ul className="space-y-2 list-disc list-inside">
            <li>所有进度、笔记、闪卡评分保存在浏览器 <strong className="text-violet-400">localStorage</strong>(不联网)</li>
            <li>双击课程 HTML 也可独立打开(纯静态,无后端依赖)</li>
            <li>建议每个章节:精读 + 笔记 + 测验 + 复习闪卡 + 导出讲解模板</li>
            <li>章节测验 <strong className="text-violet-400">70% 通过</strong> · 期末 <strong className="text-violet-400">80% 通过</strong> · 每测验最多 3 次</li>
            <li>右下角紫色 FAB 浮窗,在任何课程页面都能一键回到主页 / 课程中心 / 当前课程</li>
          </ul>
        </section>
      </div>
    </div>
  );
}