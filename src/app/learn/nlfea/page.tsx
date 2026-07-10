// /learn/nlfea - NLFEA 非线性有限元学习平台门户
// 跳转逻辑：因为 NLFEA 平台是 11MB 静态资源 + 客户端 localStorage，
// 不适合 SSR 集成。门户页只显示课程介绍 + 入口（直接打开静态资源）。

import Link from "next/link";
import { ArrowLeft, BookOpen, GraduationCap, Layers, FileText, Brain, Sparkles } from "lucide-react";

export const metadata = {
  title: "NLFEA 学习平台 · Lvyz Web",
  description: "非线性有限元分析导论（Nam-Ho Kim, Springer 2025）· 6 章 49 节 · 闪卡 + 考试",
};

const STATIC_BASE = "/nlfea-course";

const FEATURES = [
  {
    href: `${STATIC_BASE}/index.html`,
    icon: BookOpen,
    title: "课程地图",
    desc: "6 章 49 节 · 进度跟踪 · 笔记 · 闪卡 46 张",
    color: "from-cyan-500/20 to-blue-500/20",
  },
  {
    href: `${STATIC_BASE}/flashcards.html`,
    icon: Brain,
    title: "闪卡复习",
    desc: "46 张闪卡 · 4 档评分 · 间隔重复",
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    href: `${STATIC_BASE}/exam.html`,
    icon: GraduationCap,
    title: "综合考试",
    desc: "20 道选择题 · 90 分及格 · 错题解析",
    color: "from-amber-500/20 to-orange-500/20",
  },
  {
    href: `${STATIC_BASE}/review.html`,
    icon: Layers,
    title: "学习回顾",
    desc: "全部笔记 + 进度统计 + JSON 备份",
    color: "from-emerald-500/20 to-green-500/20",
  },
];

const CHAPTERS = [
  { num: 1, title: "连续介质力学与线性有限元", pages: "PDF p1–86", slug: "ch1" },
  { num: 2, title: "非线性有限元分析过程", pages: "PDF p87–150", slug: "ch2" },
  { num: 3, title: "几何非线性与大变形分析", pages: "PDF p151–250", slug: "ch3" },
  { num: 4, title: "弹塑性材料有限元分析", pages: "PDF p251–372", slug: "ch4" },
  { num: 5, title: "接触问题有限元分析", pages: "PDF p373–448", slug: "ch5" },
  { num: 6, title: "时变问题的有限元分析", pages: "PDF p449–488", slug: "ch6" },
];

export default function NlfeaPortalPage() {
  return (
    <div className="min-h-screen pt-28 px-6 pb-16">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
          <div className="flex items-start gap-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 flex-shrink-0">
              <FileText className="h-7 w-7 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                <span className="text-gradient">NLFEA</span> 学习平台
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                Introduction to Nonlinear Finite Element Analysis · Nam-Ho Kim (Springer, 2025)
              </p>
              <p className="mt-2 text-xs text-gray-500">
                6 章 49 节 · 60 张 PDF 关键页面 · 46 张闪卡 · 20 道考题 · 11.4 MB 离线资源
              </p>
            </div>
          </div>
        </header>

        {/* 4 个功能入口 */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-400" />
            4 大功能
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

        {/* 6 章课程卡片 */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-cyan-400" />
            6 章课程
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CHAPTERS.map((c) => (
              <a
                key={c.slug}
                href={`${STATIC_BASE}/lesson/${c.slug}.html`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card group p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-sm flex-shrink-0">
                    Ch{c.num}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-white truncate">
                      第 {c.num} 章 · {c.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{c.pages}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 使用说明 */}
        <section className="glass-card p-6 text-sm text-gray-400">
          <h3 className="text-base font-semibold text-white mb-3">使用说明</h3>
          <ul className="space-y-2 list-disc list-inside">
            <li>点击任意章节/功能 → 在<strong className="text-cyan-400">新窗口</strong>打开（侧栏独立，不丢失 lvyz.org 状态）</li>
            <li>所有进度、笔记、闪卡评分保存在浏览器 <strong className="text-cyan-400">localStorage</strong>（不联网）</li>
            <li>建议定期用「学习回顾」页导出 JSON 备份</li>
            <li>首次访问若空白，请检查浏览器是否允许跨域资源（Vercel CDN 默认允许）</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
