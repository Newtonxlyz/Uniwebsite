// AboutSection - 首页"关于我"板块
// 数据来自 D:\LvyzWeb\cv-web\resume.md

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  Globe2,
  Code2,
  Award,
  Mail,
  ExternalLink,
  Sparkles,
  Cpu,
  Heart,
  ChevronDown,
} from "lucide-react";

interface TimelineEntry {
  period: string;
  title: string;
  company: string;
  location?: string;
  highlights: string[];
  tag?: "current" | "milestone";
}

const TIMELINE: TimelineEntry[] = [
  {
    period: "2022.12 — 至今",
    title: "车辆安全领域项目负责人",
    company: "AUDI NEV CN · 奥迪一汽新能源汽车",
    location: "长春",
    highlights: [
      "PPE 平台未来车型安全战略制定与开发流程定义",
      "正面约束系统功能开发：配置定义 + 点火策略优化",
      "CNCAP 技术委员会会员",
    ],
    tag: "current",
  },
  {
    period: "2019.10 — 2022.08",
    title: "首届长期驻奥迪团队领队",
    company: "一汽-大众（驻德国奥迪）",
    location: "Ingolstadt, Germany",
    highlights: [
      "一汽-大众车辆安全在德国奥迪的出入口",
      "10+ 奥迪项目的协调 / 沟通 / 推进战略",
      "驻德团队生活 / 工作条件协调",
    ],
    tag: "milestone",
  },
  {
    period: "2018.11 — 2019.9",
    title: "奥迪车辆安全项目经理",
    company: "一汽-大众",
    highlights: [
      "管理 AUDI 中小型 / 中大型 / 新能源车型项目",
      "消费者实验评估与工作分工",
    ],
  },
  {
    period: "2017.01 — 2018.10",
    title: "仿真项目经理 / 仿真工程师",
    company: "一汽-大众",
    highlights: [
      "车辆安全领域首位同奥迪深化合作项目负责人",
      "仿真能力白皮书 > 100 页",
      "奥迪项目分工 / 费用谈判：总额 > 6 千万欧元",
    ],
    tag: "milestone",
  },
  {
    period: "2016.09 — 2016.12",
    title: "首届驻德国大众团队车辆安全方向负责人",
    company: "Volkswagen AG · 德国大众",
    location: "Wolfsburg, Germany",
    highlights: [
      "两款 SUV 开发项目的前期管理与移交",
      "掌握正碰 / 侧碰 / 约束系统 / 刚度 / 流体仿真",
    ],
    tag: "milestone",
  },
  {
    period: "2013.01 — 2016.08",
    title: "仿真工程师 → 高级仿真",
    company: "一汽-大众",
    highlights: [
      "多款 SUV 正碰 / 后碰 / 侧碰 / 座椅结构仿真",
      "首款全自主开发 HUT，侧碰结构达 CNCAP 2018 五星",
      "首次进驻德国大众专业组内部",
    ],
  },
  {
    period: "2010.09 — 2012.07",
    title: "航天工程 硕士",
    company: "西安交通大学 · 航天航空学院",
    location: "985 / 211",
    highlights: ["结构力学 + 仿真基础", "硬核工科背景"],
  },
];

const STATS = [
  { value: "14+", label: "年车辆安全经验", icon: Briefcase },
  { value: "2", label: "次长期驻德（奥迪/大众）", icon: Globe2 },
  { value: "€60M+", label: "项目谈判金额", icon: Sparkles },
  { value: "3", label: "种工作语言（中文/英/德）", icon: Award },
];

const LANGUAGES = [
  { lang: "中文", level: "母语", desc: "工作语言 · 精通" },
  { lang: "英语", level: "B2.2", desc: "商务工作语言" },
  { lang: "德语", level: "B2.2", desc: "驻德工作语言（自学）" },
];

const SKILLS = [
  { label: "碰撞仿真（ANSA / Animator / Pamcrash）", icon: Cpu },
  { label: "约束系统匹配（安全带 / 气囊 / 标定）", icon: Sparkles },
  { label: "CNCAP / C-IASI 规程跟踪与目标制定", icon: Award },
  { label: "项目管理（>10 个奥迪车型并行）", icon: Briefcase },
  { label: "跨文化协作（中德桥梁）", icon: Globe2 },
  { label: "HTML / CSS / JavaScript · AI 应用", icon: Code2 },
];

const HOBBIES = [
  { label: "平面设计", icon: "🎨" },
  { label: "网页设计", icon: "💻" },
  { label: "歌唱", icon: "🎤" },
  { label: "篮球（曾经的热爱）", icon: "🏀" },
];

// 头像旁的"亮点"小标签
const HEADLINE_TAGS = [
  "奥迪 NEV 安全负责人",
  "10+ 奥迪车型项目管理",
  "首届驻德团队领队",
  "CNCAP 委员会会员",
];

export default function AboutSection() {
  // 职业经历折叠：默认全部收起，第一个（最新）展开
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);
  // 滚动时大照片缩小（cartoon 小头像浮层在 nav 下方独立显示）
  const [scrolled, setScrolled] = useState(false);

  // 让 timeline 滚动时有渐进动画
  useEffect(() => {
    const handler = () => {
      // 简易视口检测：展开时间线
      const items = document.querySelectorAll("[data-timeline-item]");
      items.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          el.classList.add("opacity-100", "translate-y-0");
          el.classList.remove("opacity-0", "translate-y-4");
        }
      });
    };
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // 滚动后大照片缩小 + 轻微变灰（过渡到 cartoon 风格）
  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 300);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-16">
      {/* Section header */}
      <div className="mb-12 text-center">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-cyan-400">
          About Me
        </p>
        <h2 className="mb-3 text-3xl sm:text-4xl font-bold text-white">
          认识<span className="text-gradient">我</span>
        </h2>
        <p className="text-sm text-gray-400 max-w-xl mx-auto">
          14 年车辆安全经验 · 西安交大航天工程 · 中德双语 · AI 转型中
        </p>
      </div>

      {/* 头部：照片 + 名字 + 数据 */}
      <div className="grid md:grid-cols-[220px_1fr] gap-8 mb-12">
        {/* 照片 */}
        <div className="flex justify-center md:justify-start">
          <div
            className={`relative transition-all duration-500 ease-out ${
              scrolled
                ? "w-[80px] h-[104px] opacity-60"
                : "w-[200px] h-[260px] opacity-100"
            }`}
          >
            <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-indigo-500/30 blur-md" />
            <img
              src="/photo.jpg"
              alt="吕元卓 LV YUANZHUO"
              className="relative w-full h-full rounded-2xl object-cover ring-1 ring-white/20"
            />
          </div>
        </div>

        {/* 文字 + 数据 + tag */}
        <div>
          <h3 className="text-2xl font-bold text-white">
            吕元卓{" "}
            <span className="text-base text-gray-400 font-normal">/ LV YUANZHUO</span>
          </h3>
          <p className="mt-1 text-sm text-cyan-300 font-medium">
            车辆安全领域专家 · Vehicle Safety Expert · Fahrzeugsicherheit Experte
          </p>

          <ul className="mt-4 space-y-1.5 text-sm text-gray-200 leading-relaxed">
            <li className="flex gap-2">
              <span className="text-cyan-400 flex-shrink-0">·</span>
              <span>14 年深耕车辆安全，从一汽-大众到奥迪一汽新能源（NEV）</span>
            </li>
            <li className="flex gap-2">
              <span className="text-cyan-400 flex-shrink-0">·</span>
              <span>多次长期驻德国奥迪与大众总部，资深中德桥梁</span>
            </li>
            <li className="flex gap-2">
              <span className="text-cyan-400 flex-shrink-0">·</span>
              <span>是一汽-大众首届驻德团队领队、首届同奥迪深化合作负责人</span>
            </li>
            <li className="flex gap-2">
              <span className="text-cyan-400 flex-shrink-0">·</span>
              <span>热爱仿真，深耕约束系统与碰撞分析</span>
            </li>
          </ul>

          <div className="mt-4 flex flex-wrap gap-2">
            {HEADLINE_TAGS.map((t) => (
              <span
                key={t}
                className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-500/30"
              >
                {t}
              </span>
            ))}
          </div>

          {/* 关键数据 */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="glass-card p-3 text-center hover:scale-105 transition-transform"
                >
                  <Icon className="h-4 w-4 text-cyan-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-white">{s.value}</div>
                  <div className="text-[10px] text-gray-500 leading-tight mt-0.5">
                    {s.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 联系 */}
          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href="mailto:Lvyuanzhuo@hotmail.com"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 hover:text-white transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              Lvyuanzhuo@hotmail.com
            </a>
            <a
              href="https://lvyz.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 hover:text-white transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              lvyz.org
            </a>
          </div>
        </div>
      </div>

      {/* 教育 + 语言 */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* 教育 */}
        <div className="glass-card p-5">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
            <GraduationCap className="h-4 w-4 text-cyan-400" />
            教育背景 / Education
          </h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="text-[10px] text-gray-500 mt-1 w-20 flex-shrink-0">
                2010–2012
              </div>
              <div>
                <div className="text-sm text-white font-medium">航天工程 · 硕士</div>
                <div className="text-xs text-gray-400">西安交通大学 · 航天航空学院</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-[10px] text-gray-500 mt-1 w-20 flex-shrink-0">
                2006–2010
              </div>
              <div>
                <div className="text-sm text-white font-medium">工程力学 · 学士</div>
                <div className="text-xs text-gray-400">西安交通大学 · 航天航空学院</div>
              </div>
            </div>
          </div>
          <p className="mt-3 text-[10px] text-cyan-400/80">985 / 211 · 硬核工科背景</p>
        </div>

        {/* 语言 */}
        <div className="glass-card p-5">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
            <Globe2 className="h-4 w-4 text-cyan-400" />
            语言能力 / Languages
          </h4>
          <div className="space-y-3">
            {LANGUAGES.map((l) => (
              <div key={l.lang} className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-white font-medium">{l.lang}</div>
                  <div className="text-xs text-gray-400">{l.desc}</div>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    l.lang === "中文"
                      ? "bg-amber-500/20 text-amber-300"
                      : "bg-cyan-500/20 text-cyan-300"
                  }`}
                >
                  {l.level}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-cyan-400/80">
            双语流利 · 长期驻德工作 · 中德桥梁
          </p>
        </div>
      </div>

      {/* 职业 Timeline — 默认折叠，点击展开 */}
      <div className="mb-12">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-white mb-6">
          <Briefcase className="h-4 w-4 text-cyan-400" />
          职业经历 / Career
          <span className="text-xs text-gray-500 font-normal">（按时间倒序 · 点击展开）</span>
        </h4>
        <div className="relative">
          {/* 时间线左侧线 */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-cyan-500/60 via-indigo-500/30 to-transparent" />
          <div className="space-y-3">
            {TIMELINE.map((t, idx) => {
              const isOpen = expandedIdx === idx;
              // 不同 tag 用不同色块
              const tagStyles = (() => {
                if (t.tag === "current") {
                  return {
                    border: "border-cyan-500/40",
                    bg: "bg-cyan-500/5",
                    dot: "bg-cyan-400 ring-cyan-400/30 animate-pulse",
                    accent: "text-cyan-300",
                    tag: "bg-cyan-500/20 text-cyan-300",
                  };
                }
                if (t.tag === "milestone") {
                  return {
                    border: "border-amber-500/40",
                    bg: "bg-amber-500/5",
                    dot: "bg-amber-400 ring-amber-400/30",
                    accent: "text-amber-300",
                    tag: "bg-amber-500/20 text-amber-300",
                  };
                }
                return {
                  border: "border-indigo-500/30",
                  bg: "bg-indigo-500/5",
                  dot: "bg-indigo-400/60 ring-indigo-400/20",
                  accent: "text-indigo-300",
                  tag: "bg-indigo-500/15 text-indigo-300",
                };
              })();

              return (
                <div
                  key={idx}
                  data-timeline-item
                  className="relative pl-8 opacity-0 translate-y-4 transition-all duration-500"
                >
                  {/* 圆点 */}
                  <div
                    className={`absolute left-0 top-3 w-3.5 h-3.5 rounded-full ring-2 ${tagStyles.dot}`}
                  />
                  <div
                    className={`rounded-xl border ${tagStyles.border} ${tagStyles.bg} overflow-hidden transition-all`}
                  >
                    {/* Header — 整行可点击 */}
                    <button
                      onClick={() => setExpandedIdx(isOpen ? null : idx)}
                      className="w-full flex items-start gap-3 p-4 text-left hover:bg-white/5 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-2 mb-1">
                          <span className="text-[10px] text-gray-500 font-mono">
                            {t.period}
                          </span>
                          {t.tag === "current" && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${tagStyles.tag}`}>
                              Current
                            </span>
                          )}
                          {t.tag === "milestone" && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${tagStyles.tag}`}>
                              首创 / 里程碑
                            </span>
                          )}
                        </div>
                        <h5 className="text-sm font-semibold text-white">{t.title}</h5>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {t.company}
                          {t.location && (
                            <span className="text-gray-500"> · {t.location}</span>
                          )}
                        </p>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 flex-shrink-0 mt-1 text-gray-400 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* 折叠内容 — 高度过渡 */}
                    <div
                      className={`grid transition-all duration-200 ease-out ${
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <ul className="px-4 pb-4 space-y-1.5 border-t border-white/5 pt-3">
                          {t.highlights.map((h, i) => (
                            <li
                              key={i}
                              className="text-xs text-gray-200 leading-relaxed flex gap-1.5"
                            >
                              <span className={`${tagStyles.accent} flex-shrink-0`}>·</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 核心能力 */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            核心能力 / Core Competencies
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SKILLS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Icon className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
                  <span className="text-xs text-gray-200">{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 兴趣爱好 */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
            <Heart className="h-4 w-4 text-cyan-400" />
            兴趣爱好 / Hobbies
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {HOBBIES.map((h) => (
              <div
                key={h.label}
                className="flex items-center gap-2 px-3 py-3 rounded-lg bg-white/5"
              >
                <span className="text-2xl">{h.icon}</span>
                <span className="text-xs text-gray-200">{h.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
            <p className="text-xs text-gray-300 leading-relaxed">
              <span className="text-indigo-300 font-semibold">当前聚焦</span>：
              从车辆安全专家向{" "}
              <span className="text-amber-300 font-medium">AI 应用工程师</span> 转型——
              LLM 基础、Agent、RAG、AI 工具产品化。
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <div className="inline-flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/knowledge-base"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-sm text-cyan-200 transition-colors"
          >
            📚 查看技术知识库
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-colors"
          >
            ✍️ 读我的博客
          </Link>
          <a
            href="mailto:Lvyuanzhuo@hotmail.com"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-colors"
          >
            <Mail className="h-3.5 w-3.5" />
            联系合作
          </a>
        </div>
      </div>
    </section>
  );
}
