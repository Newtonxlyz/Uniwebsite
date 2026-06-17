import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Database, Search, FileText, Box, BookOpen, Wrench, Lightbulb, Search as SearchIcon, Lock } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { WikiSearch } from "@/components/wiki-search";

export const metadata = {
  title: "知识库 · Lvyz Web",
  description: "TEBS Occupant Safety Knowledge-Base · 车辆安全 · 约束系统 · 碰撞分析",
};

// 知识库分类（按用户要求从 index.html 中筛选：删 3 个 href=# 的空卡 + 删邮箱链接）
const CATEGORIES = [
  {
    slug: "section4",
    title: "正碰约束系统基础知识 V1.0",
    desc: "所有关于正碰约束系统你应该熟悉和了解的",
    icon: BookOpen,
    color: "from-green-500 to-emerald-500",
    href: "/wiki/RHS-knowledgebase-section4.html",
  },
  {
    slug: "crash-basic",
    title: "碰撞基础知识",
    desc: "作为一名碰撞试验工程师你应该了解的基础知识",
    icon: Box,
    color: "from-blue-500 to-cyan-500",
    href: "/wiki/Crash_Basic.html",
  },
  {
    slug: "material",
    title: "材料基础知识",
    desc: "这里你会对工作中碰到的材料有比较全面的了解",
    icon: Wrench,
    color: "from-indigo-500 to-purple-500",
    href: "/wiki/Material.html",
  },
  {
    slug: "competenz",
    title: "能力重点(3/6 finished @Yuanzhuo)",
    desc: "目前和未来你所需要强化和发展的能力项目：假人 / ISO-CODE / 点火时间&OLC / 儿童保护 / THOR假人初探 / 罚分项",
    icon: Lightbulb,
    color: "from-purple-500 to-pink-500",
    href: "/wiki/Competenz_lift.html",
  },
];

const MINDMAP_LINKS = [
  { label: "网站地图-Mindmap", href: "/wiki/RHS-MindMap.html", desc: "思维导图" },
  { label: "网站地图-ExcelLook", href: "/wiki/RHS约束系统匹配知识库.html", desc: "表格索引" },
];

const EXTRA_LINKS = [
  { label: "图表", href: "/wiki/charts.html", icon: FileText },
  { label: "组件", href: "/wiki/components.html", icon: Box },
  { label: "案例展示", href: "/wiki/showcase.html", icon: BookOpen },
  { label: "FAQ", href: "/wiki/faqs.html", icon: FileText },
];

// 用于搜索的页面元数据
const SEARCHABLE_PAGES = [
  ...CATEGORIES.map((c) => ({ title: c.title, desc: c.desc, href: c.href, category: "核心知识" })),
  ...EXTRA_LINKS.map((e) => ({ title: e.label, desc: "", href: e.href, category: "其他" })),
  { title: "RHS-MindMap 网站地图", desc: "思维导图", href: "/wiki/RHS-MindMap.html", category: "网站地图" },
  { title: "RHS约束系统匹配知识库 ExcelLook", desc: "表格索引", href: "/wiki/RHS约束系统匹配知识库.html", category: "网站地图" },
];

export default async function KnowledgeBasePage() {
  // 1. 登录检查
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login?redirect=/knowledge-base");
  }

  // 2. 白名单检查
  const userEmail = session.user.email?.toLowerCase();
  const whitelist = await prisma.wikiAccess.findUnique({
    where: { email: userEmail },
  });

  // 3. 如果不在白名单 → 提示无权访问
  if (!whitelist) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="glass-card p-8 max-w-md w-full text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 mb-4">
            <Lock className="h-8 w-8 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">知识库访问受限</h1>
          <p className="text-sm text-gray-400 mb-4">
            知识库目前仅对受邀用户开放。
            <br />
            如需访问，请联系管理员申请白名单。
          </p>
          <div className="text-xs text-gray-500 mb-6">
            当前账号：<span className="text-white/80">{session.user.email}</span>
          </div>
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg bg-white/5 text-white/80 text-sm hover:bg-white/10 transition-colors"
            >
              返回首页
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-6 pb-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Database className="h-8 w-8 text-cyan-400" />
            <span className="text-gradient">TEBS 知识库</span>
          </h1>
          <p className="mt-2 text-gray-400">
            约束系统 · 碰撞分析 · 材料 · C-NCAP / C-IASI · 在线知识体系
          </p>
        </header>

        {/* 搜索栏 */}
        <div className="glass-card p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Search className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">快速搜索</span>
          </div>
          <WikiSearch pages={SEARCHABLE_PAGES} />
        </div>

        {/* 网站地图区（Mindmap + ExcelLook） */}
        <section className="mb-10">
          <h2 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
            <SearchIcon className="h-4 w-4" />
            网站地图
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MINDMAP_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-5 hover:scale-[1.02] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-pink-500">
                    <Database className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-pink-400 transition-colors">
                      {link.label}
                    </h3>
                    <p className="text-xs text-gray-500">{link.desc}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 核心知识分类 */}
        <section className="mb-10">
          <h2 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            核心知识模块
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <a
                  key={cat.slug}
                  href={cat.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card p-6 hover:scale-[1.02] transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${cat.color} flex-shrink-0`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-white text-base leading-tight mb-1 group-hover:text-pink-400 transition-colors">
                        {cat.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-3">
                        {cat.desc}
                      </p>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* 其他资源 */}
        <section className="mb-10">
          <h2 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            其他资源
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {EXTRA_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card p-4 hover:scale-[1.02] transition-all group"
                >
                  <Icon className="h-5 w-5 text-cyan-400 mb-2" />
                  <div className="text-sm text-white/80 group-hover:text-white transition-colors">
                    {link.label}
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* 资源下载区 */}
        <section className="mb-10">
          <h2 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            资源下载
          </h2>
          <div className="glass-card p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <a
                href="/wiki/assets/files/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <FileText className="h-4 w-4" />
                公司内部文档（V01 系列）
              </a>
              <a
                href="/wiki/assets/codeformat/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <FileText className="h-4 w-4" />
                ISO 标准文档
              </a>
              <a
                href="/wiki/Mindmap/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <FileText className="h-4 w-4" />
                Mindmap / XMind 源文件
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
