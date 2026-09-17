// /learn/crashai - crashAI 课程门户
// 设计对齐 /learn/pinn-crash + /learn/gn-crash

import Link from "next/link";
import { Geist_Mono } from "next/font/google";
import { ArrowLeft, BookOpen, GraduationCap, Layers, Brain, BarChart3, GraduationCap as Cap, ArrowUpRight, BookMarked, FlaskConical } from "lucide-react";

const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata = {
  title: "crashAI · AI 转行作战图 · Lvyz Web",
  description: "24 主题 · 1500+ 闪卡 · SM-2 间隔重复 · 4 路径实操训练",
};

const MODULES = [
  { href: "/crashai", icon: BookOpen, title: "课程主页", desc: "24 主题地图 · 学习仪表盘 · 路径选择" },
  { href: "/crashai/cards", icon: Brain, title: "闪卡中心", desc: "1500+ 闪卡 · SM-2 间隔重复" },
  { href: "/crashai/safety-training", icon: FlaskConical, title: "路径训练", desc: "4 路径实操 · 阶段闯关" },
  { href: "/blog?tag=crashai", icon: Layers, title: "相关博客", desc: "学习心得 · 案例复盘" },
];

const TOPICS = [
  { num: 1, group: "AI 基础", title: "机器学习入门", desc: "监督/无监督 · 损失函数 · 评估指标" },
  { num: 4, group: "AI 基础", title: "深度学习核心", desc: "神经网络 · 反向传播 · 优化器" },
  { num: 8, group: "AI 基础", title: "Transformer 与 LLM", desc: "注意力机制 · 预训练 · 微调" },
  { num: 12, group: "AI 应用", title: "AI 工具栈实战", desc: "Prompt · RAG · Agent · 多模态" },
  { num: 16, group: "AI 应用", title: "AI 与产业结合", desc: "汽车安全 · 仿真降阶 · 数据闭环" },
  { num: 20, group: "路径训练", title: "AI 转行 4 路径", desc: "工程师 · 研究员 · 产品经理 · 创业者" },
  { num: 24, group: "路径训练", title: "实战项目闭环", desc: "端到端项目 · 简历包装 · 面试" },
];

const STATS = [
  { value: "24", label: "主题", accent: "from-indigo-400 to-violet-400" },
  { value: "1500+", label: "闪卡", accent: "from-amber-400 to-orange-400" },
  { value: "4", label: "路径", accent: "from-emerald-400 to-cyan-400" },
  { value: "60h+", label: "预计", accent: "from-rose-400 to-pink-400" },
];

export default function CrashaiPortalPage() {
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
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex-shrink-0">
              <Cap className="h-7 w-7 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <h1 className="text-3xl font-bold text-white">crashAI · AI 转行作战图</h1>
                <span className="font-mono text-xs text-gray-500 tracking-wider">
                  /crashai
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-400">
                工程师视角的 AI 系统学习路径 · 闪卡 + 路径实操 + 阶段闯关
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
            <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-400">modules</span>
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
                  <Icon className="h-6 w-6 text-indigo-400 mb-3" />
                  <h3 className="text-base font-semibold text-white mb-1 flex items-center justify-between">
                    {m.title}
                    <ArrowUpRight className="h-3.5 w-3.5 text-gray-500 group-hover:text-indigo-300 transition-colors" />
                  </h3>
                  <p className="text-xs text-gray-400">{m.desc}</p>
                </a>
              );
            })}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BookMarked className="h-5 w-5 text-indigo-400" />
            24 主题预览(精选)
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TOPICS.map((t) => (
              <a
                key={t.num}
                href="/crashai"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card group p-4 hover:border-indigo-400/30"
              >
                <div className="flex items-center gap-3">
                  <div className="font-mono inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300 text-sm font-bold">
                    {String(t.num).padStart(2, "0")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {t.group} · {t.title}
                    </h3>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-gray-500 mt-0.5 line-clamp-1">
                      {t.desc}
                    </p>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-gray-500 group-hover:text-indigo-300 transition-colors flex-shrink-0" />
                </div>
              </a>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link
              href="/crashai"
              className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              查看全部 24 主题 →
            </Link>
          </div>
        </section>

        <section className="glass-card p-6 text-sm text-gray-400">
          <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-indigo-400" />
            使用说明
          </h3>
          <ul className="space-y-2 list-disc list-inside">
            <li>crashAI 是 lvyz <strong className="text-indigo-400">最早</strong>的 AI 学习系统(2024 起 · SM-2 算法 · 进度跟踪)</li>
            <li>数据存储:Prisma 数据库(账号绑定) + localStorage(本地缓存)</li>
            <li>建议先用<strong className="text-indigo-400">路径训练</strong>选一条方向,再逐主题深入</li>
            <li>右下角紫色 FAB 可一键返回 主页 / 课程中心</li>
          </ul>
        </section>
      </div>
    </div>
  );
}