"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  Home,
  Menu,
  X,
  Shield,
  LogOut,
  User as UserIcon,
  Cpu,
  Sparkles,
  BookOpen,
  Brain,
  ShoppingBag,
  Library,
  Atom,
  GraduationCap,
  FlaskConical,
} from "lucide-react";
import { useSession, signOut as doSignOut } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/theme-toggle";

// ─────────────────────────────────────────────────
// 6 个子站配置(课程统一进 /learn/courses 顶级板块,crashAI 也是课程)
// ─────────────────────────────────────────────────
const SUBSITES = [
  { href: "/learn/courses", label: "课程中心", short: "课程", icon: GraduationCap, desc: "AI+汽车安全 · 3 门系统课程" },
  { href: "/kids-ai", label: "儿童 AI", short: "KidsAI", icon: Sparkles, desc: "儿童本地大模型互动" },
  { href: "/picturebook", label: "绘本", short: "绘本", icon: BookOpen, desc: "原创情感引导绘本" },
  { href: "/knowledge-base", label: "知识库", short: "知识库", icon: Library, desc: "TEBS 车辆安全技术库" },
  { href: "/blog", label: "博客", short: "博客", icon: Brain, desc: "AI 工具 · 汽车安全思考" },
  { href: "/merchandise", label: "IP 周边", short: "周边", icon: ShoppingBag, desc: "Lvyz 周边商城" },
];

function getActiveSubsite(pathname: string | null) {
  if (!pathname) return null;
  return SUBSITES.find((s) => pathname === s.href || pathname.startsWith(s.href + "/")) ?? null;
}

export { getActiveSubsite };

// ─────────────────────────────────────────────────
// 课程中心 · 概览卡(hub hover 时显示 3 门课)
// ─────────────────────────────────────────────────
const COURSE_OVERVIEW = [
  {
    href: "/learn/pinn-crash",
    label: "AI+DOE+PINN 仿真降阶",
    short: "PINN",
    chapters: 6,
    flashcards: 35,
    color: "from-purple-500/30 to-pink-500/30",
    icon: Atom,
  },
  {
    href: "/learn/gn-crash",
    label: "GNN + Transformer + 物理约束",
    short: "GNN",
    chapters: 7,
    flashcards: 35,
    color: "from-emerald-500/30 to-cyan-500/30",
    icon: Cpu,
  },
  {
    href: "/crashai",
    label: "crashAI · AI 转行作战图",
    short: "crashAI",
    chapters: 24,
    flashcards: 1500,
    color: "from-indigo-500/30 to-violet-500/30",
    icon: GraduationCap,
  },
];

// ─────────────────────────────────────────────────
// 每个子站的 hover 下拉导航 actions
// 格式:{ subsiteHrefPrefix: [{ href, label, icon, description }, ...] }
// ─────────────────────────────────────────────────
type SubsiteAction = { href: string; label: string; icon: React.ComponentType<{ className?: string }>; description: string };

const SUBSITE_ACTIONS: Record<string, SubsiteAction[]> = {
  "/kids-ai": [
    { href: "/kids-ai", label: "首页", icon: Sparkles, description: "儿童 AI 入口" },
    { href: "/kids-ai/chapters", label: "章节", icon: BookOpen, description: "AI 课程章节" },
    { href: "/kids-ai/games", label: "互动游戏", icon: FlaskConical, description: "本地大模型游戏" },
    { href: "/kids-ai/achievements", label: "成就", icon: GraduationCap, description: "学习成就" },
  ],
  "/picturebook": [
    { href: "/picturebook/stories", label: "故事", icon: BookOpen, description: "绘本故事" },
    { href: "/picturebook/characters", label: "角色", icon: UserIcon, description: "绘本角色" },
  ],
  "/knowledge-base": [
    { href: "/knowledge-base", label: "搜索", icon: Library, description: "83 篇技术文档" },
  ],
  "/learn/pinn-crash": [
    { href: "/learn/pinn-crash", label: "课程地图", icon: BookOpen, description: "PINN 6 章课程" },
    { href: "/courses/pinn-crash-reduction/flashcards.html", label: "闪卡", icon: Brain, description: "35 张闪卡 SM-2" },
    { href: "/courses/pinn-crash-reduction/quizzes.html", label: "测验", icon: GraduationCap, description: "60 题 + 期末" },
  ],
  "/learn/gn-crash": [
    { href: "/learn/gn-crash", label: "课程地图", icon: BookOpen, description: "GNN 7 章课程" },
    { href: "/courses/gn-crash-guide/flashcards.html", label: "闪卡", icon: Brain, description: "35 张闪卡 SM-2" },
    { href: "/courses/gn-crash-guide/quizzes.html", label: "测验", icon: GraduationCap, description: "56 题 + 期末" },
    { href: "/courses/gn-crash-guide/original.html", label: "原始指南", icon: BookOpen, description: "源 HTML 一比一复刻" },
  ],
  "/blog": [
    { href: "/blog/new", label: "写新文章", icon: BookOpen, description: "发布新博客" },
    { href: "/blog", label: "我的文章", icon: Brain, description: "查看博客列表" },
  ],
  "/merchandise": [
    { href: "/merchandise", label: "商品", icon: ShoppingBag, description: "Lvyz 周边" },
  ],
};

// ─────────────────────────────────────────────────
// 主题感知 Logo（dark 用深色 SVG，light 用浅色 SVG）
// ─────────────────────────────────────────────────
function ThemeLogo() {
  const [isLight, setIsLight] = useState(false);
  useEffect(() => {
    const check = () => {
      setIsLight(document.documentElement.classList.contains("light"));
    };
    check();
    // 监听 theme 切换（ThemeToggle 改 html class）
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return (
    <img
      src={isLight ? "/logo-light.svg" : "/logo-dark.svg"}
      alt="Lvyz"
      className="h-7 w-7"
    />
  );
}

const ADMIN_ROLES = ["ADMIN", "SUPERADMIN"];

// ─────────────────────────────────────────────────
// 主 NavBar
// ─────────────────────────────────────────────────
export function NavBar() {
  const { data: session } = useSession();
  const user = session?.user ?? null;
  const isAdmin = !!(user && ADMIN_ROLES.includes((user as { role?: string }).role || ""));
  const pathname = usePathname();
  const activeSubsite = getActiveSubsite(pathname);
  const isHome = pathname === "/";

  // hover 下拉
  const [subsiteOpen, setSubsiteOpen] = useState(false);
  const [hoveredSubsite, setHoveredSubsite] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 移动端 drawer
  const [mobileOpen, setMobileOpen] = useState(false);

  // 头像下拉
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // 路径变化关闭 drawer
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setHoveredSubsite(null);
    setSubsiteOpen(false);
  }, [pathname]);

  function openSubsite() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setSubsiteOpen(true);
  }
  function scheduleCloseSubsite() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setSubsiteOpen(false), 150);
  }
  function openSubsiteBar(slug: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setHoveredSubsite(slug);
  }
  function scheduleCloseSubsiteBar() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setHoveredSubsite(null), 150);
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-white/10 dark:border-white/10 light:border-slate-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* 左侧：Lvyz + hover 下拉 + 返回首页 */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Lvyz + hover 下拉 */}
            <div
              className="relative"
              onMouseEnter={openSubsite}
              onMouseLeave={scheduleCloseSubsite}
            >
              <button
                className="flex items-center gap-2 text-lg font-bold"
                aria-label="Lvyz 主页菜单"
              >
                <ThemeLogo />
                <span className="text-gradient">Lvyz</span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform ${
                    subsiteOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Hover 下拉面板 */}
              {subsiteOpen && (
                <div
                  className="absolute left-0 top-full pt-2 w-[480px] z-50"
                  onMouseEnter={openSubsite}
                  onMouseLeave={scheduleCloseSubsite}
                >
                  <div className="glass-card p-3 rounded-xl border border-white/10 shadow-2xl">
                    <div className="text-xs text-gray-500 px-3 py-2 font-medium">
                      切换子站
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {SUBSITES.map((s) => {
                        const Icon = s.icon;
                        const isActive = activeSubsite?.href === s.href;
                        return (
                          <Link
                            key={s.href}
                            href={s.href}
                            className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                              isActive
                                ? "bg-cyan-500/15 text-white"
                                : "hover:bg-white/5 text-gray-300 hover:text-white"
                            }`}
                          >
                            <Icon
                              className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                                isActive ? "text-cyan-400" : "text-gray-400"
                              }`}
                            />
                            <div className="min-w-0">
                              <div className="text-sm font-medium">{s.label}</div>
                              <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                {s.desc}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 返回首页（仅在子站显示） */}
            {!isHome && (
              <Link
                href="/"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-300 dark:text-gray-300 light:text-slate-700 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-slate-200/60 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">返回首页</span>
              </Link>
            )}

            {/* 水平子站导航条 · 每个按钮 hover 弹出该子站的 list */}
            <nav className="hidden md:flex items-center gap-1 ml-2 pl-3 border-l border-white/10">
              {SUBSITES.map((s) => {
                const Icon = s.icon;
                const isActive = activeSubsite?.href === s.href;
                const isHovered = hoveredSubsite === s.href;
                const actions = SUBSITE_ACTIONS[s.href] || [];
                return (
                  <div
                    key={s.href}
                    className="relative"
                    onMouseEnter={() => openSubsiteBar(s.href)}
                    onMouseLeave={scheduleCloseSubsiteBar}
                  >
                    <Link
                      href={s.href}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive || isHovered
                          ? "bg-cyan-500/15 text-white"
                          : "text-gray-300 dark:text-gray-300 light:text-slate-700 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-slate-200/60"
                      }`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${isActive || isHovered ? "text-cyan-400" : "text-gray-400"}`} />
                      <span className="hidden lg:inline">{s.short}</span>
                    </Link>

                    {/* Hover 弹下拉 list */}
                    {isHovered && (
                      <div className="absolute left-0 top-full pt-2 z-50">
                        {s.href === "/learn/courses" ? (
                          // 课程中心:3 张课程概览卡(横向)
                          <div
                            className="glass-card p-3 rounded-xl border border-white/10 shadow-2xl w-[520px]"
                            onMouseEnter={() => openSubsiteBar(s.href)}
                            onMouseLeave={scheduleCloseSubsiteBar}
                          >
                            <div className="text-xs text-gray-500 px-2 py-1.5 font-medium flex items-center justify-between">
                              <span className="inline-flex items-center gap-2">
                                <GraduationCap className="h-3.5 w-3.5 text-violet-400" />
                                课程中心 · {COURSE_OVERVIEW.length} 门课
                              </span>
                              <Link href={s.href} className="text-violet-400 hover:text-violet-300">
                                全部 →
                              </Link>
                            </div>
                            <div className="grid gap-2">
                              {COURSE_OVERVIEW.map((c) => {
                                const CIcon = c.icon;
                                return (
                                  <Link
                                    key={c.href}
                                    href={c.href}
                                    className={`flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br ${c.color} hover:scale-[1.02] transition-transform`}
                                  >
                                    <CIcon className="h-5 w-5 text-white flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                      <div className="text-sm font-semibold text-white truncate">{c.label}</div>
                                      <div className="text-xs text-white/70 mt-0.5">
                                        {c.chapters} 章节 · {c.flashcards}+ 闪卡
                                      </div>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        ) : actions.length > 0 && (
                          <div
                            className="glass-card p-2 rounded-xl border border-white/10 shadow-2xl w-[280px]"
                            onMouseEnter={() => openSubsiteBar(s.href)}
                            onMouseLeave={scheduleCloseSubsiteBar}
                          >
                            <div className="text-xs text-gray-500 px-3 py-2 font-medium flex items-center gap-2">
                              <Icon className="h-3.5 w-3.5 text-cyan-400" />
                              {s.label}
                            </div>
                            <div className="flex flex-col gap-0.5">
                              {actions.map((a) => {
                                const AIcon = a.icon;
                                return (
                                  <Link
                                    key={a.href}
                                    href={a.href}
                                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
                                  >
                                    <AIcon className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
                                    <div className="min-w-0">
                                      <div className="text-sm font-medium">{a.label}</div>
                                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{a.description}</div>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* 当前子站标签（仅在子站显示） */}
            {activeSubsite && (
              <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 text-xs text-gray-400">
                <span className="text-gray-500">/</span>
                <span className="text-cyan-400 font-medium">{activeSubsite.short}</span>
              </div>
            )}
          </div>

          {/* 右侧：ThemeToggle + 头像/登录 */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  aria-label="用户菜单"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "avatar"}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">
                      {(user.name || user.email || "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:inline text-sm text-gray-300 dark:text-gray-300 light:text-slate-700">
                    {user.name}
                  </span>
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 z-50 glass-card p-2 rounded-xl border border-white/10 shadow-2xl">
                      <div className="px-3 py-2 text-xs text-gray-500 border-b border-white/10 mb-1">
                        {user.email}
                      </div>

                      <Link
                        href="/blog/new"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-gray-300 hover:text-white transition-colors"
                      >
                        <UserIcon className="h-4 w-4" />
                        写新文章
                      </Link>

                      {isAdmin && (
                        <>
                          <div className="px-3 pt-2 pb-1 text-xs text-gray-500 uppercase tracking-wider">
                            管理
                          </div>
                          <Link
                            href="/admin/site-access"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-amber-300 hover:text-amber-200 transition-colors"
                          >
                            <Shield className="h-4 w-4" />
                            用户与子站权限
                          </Link>
                          <Link
                            href="/admin/picturebook"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-amber-300 hover:text-amber-200 transition-colors"
                          >
                            <BookOpen className="h-4 w-4" />
                            绘本管理
                          </Link>
                        </>
                      )}

                      <div className="border-t border-white/10 mt-1 pt-1">
                        <button
                          onClick={() => doSignOut()}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-gray-300 hover:text-white transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          退出登录
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-all"
              >
                登录
              </Link>
            )}

            {/* 移动端汉堡按钮 */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="打开菜单"
            >
              <Menu className="h-5 w-5 text-gray-300" />
            </button>
          </div>
        </div>
      </nav>

      {/* 移动端 drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-[80%] max-w-sm glass-nav border-l border-white/10 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <ThemeLogo />
                <span className="text-xl font-bold text-gradient">Lvyz</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg hover:bg-white/5"
                aria-label="关闭菜单"
              >
                <X className="h-5 w-5 text-gray-300" />
              </button>
            </div>

            <div className="text-xs text-gray-500 mb-2 font-medium">子站导航</div>
            <div className="flex flex-col gap-1 mb-4">
              {SUBSITES.map((s) => {
                const Icon = s.icon;
                const isActive = activeSubsite?.href === s.href;
                return (
                  <Link
                    key={s.href}
                    href={s.href}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-cyan-500/15 text-white"
                        : "text-gray-300 hover:bg-white/5"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${isActive ? "text-cyan-400" : "text-gray-400"}`}
                    />
                    <span className="text-sm font-medium">{s.label}</span>
                  </Link>
                );
              })}
            </div>

            {!isHome && (
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-300 hover:bg-white/5 transition-colors"
              >
                <Home className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium">返回首页</span>
              </Link>
            )}

            {isAdmin && (
              <>
                <div className="text-xs text-gray-500 mt-4 mb-2 font-medium uppercase tracking-wider">
                  管理
                </div>
                <Link
                  href="/admin/site-access"
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-amber-300 hover:bg-white/5"
                >
                  <Shield className="h-5 w-5" />
                  <span className="text-sm">用户与子站权限</span>
                </Link>
                <Link
                  href="/admin/picturebook"
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-amber-300 hover:bg-white/5"
                >
                  <BookOpen className="h-5 w-5" />
                  <span className="text-sm">绘本管理</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
