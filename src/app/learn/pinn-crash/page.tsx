// /learn/pinn-crash - AI+DOE+PINN 仿真降阶课程门户
// 跳转逻辑：因为课程是客户端 localStorage 静态资源，不适合 SSR 集成。
// 门户页只显示课程介绍 + 入口（直接打开静态资源）。

import Link from "next/link";
import { ArrowLeft, BookOpen, GraduationCap, Layers, FileText, Brain, Sparkles } from "lucide-react";

export const metadata = {
  title: "AI+DOE+PINN 仿真降阶课程 · Lvyz Web",
  description: "物理信息神经网络 + 实验设计 + 碰撞仿真降阶 · 6 章 · 闪卡 + 章节测验 + 期末考试",
};

const STATIC_BASE = "/courses/pinn-crash-reduction";

const FEATURES = [
  {
    href: `${STATIC_BASE}/index.html`,
    icon: BookOpen,
    title: "课程主页",
    desc: "6 章进度跟踪 · 章节地图 · 学习仪表盘",
    color: "from-cyan-500/20 to-blue-500/20",
  },
  {
    href: `${STATIC_BASE}/flashcards.html`,
    icon: Brain,
    title: "闪卡复习",
    desc: "35 张 SM-2 间隔重复卡片 · 4 档评分",
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
  { num: 1, title: "AI+DOE+PINN 技术原理", slug: "01-tech-foundations" },
  { num: 2, title: "学术前沿与代表性工作", slug: "02-research-progress" },
  { num: 3, title: "多尺度建模与跨域融合", slug: "03-multiscale" },
  { num: 4, title: "工具链与开源框架", slug: "04-tools-frameworks" },
  { num: 5, title: "工程实践与产业落地", slug: "05-engineering-practice" },
  { num: 6, title: "入门路径与学习建议", slug: "06-getting-started" },
];

export default function PinnPortalPage() {
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
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex-shrink-0">
              <FileText className="h-7 w-7 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                <span className="text-gradient">AI+DOE+PINN</span> 仿真降阶课程
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                物理信息神经网络 + 实验设计 + 汽车碰撞降阶 · 工程师视角完整技术链路
              </p>
              <p className="mt-2 text-xs text-gray-500">
                6 章 · 35 张闪卡 · 60 道章节测验 + 期末综合 · 客户端 localStorage 离线学习
              </p>
            </div>
          </div>
        </header>

        <section className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
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
            <BookOpen className="h-5 w-5 text-purple-400" />
            6 章课程
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
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 font-bold text-sm flex-shrink-0">
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
                        className="hover:text-purple-300"
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
            <li>点击任意章节/功能 → 在<strong className="text-purple-400">新窗口</strong>打开（侧栏独立，不丢失 lvyz.org 状态）</li>
            <li>所有进度、笔记、闪卡评分、错题保存在浏览器 <strong className="text-purple-400">localStorage</strong>（不联网）</li>
            <li>SM-2 算法自动安排闪卡复习节奏（Again/Hard/Good/Easy 四档）</li>
            <li>章节测验通过 70% / 期末 80% · 每测验最多 3 次答题</li>
            <li>课程页面支持纯静态（双击 file:// 也能用）</li>
          </ul>
        </section>
      </div>
    </div>
  );
}