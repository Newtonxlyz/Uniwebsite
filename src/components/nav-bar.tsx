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
} from "lucide-react";
import { useSession, signOut as doSignOut } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/theme-toggle";

// ─────────────────────────────────────────────────
// 6 个子站配置
// ─────────────────────────────────────────────────
const SUBSITES = [
  { href: "/crashai", label: "crashAI", short: "crashAI", icon: Cpu, desc: "AI 模型训练 · 路径学习" },
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
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 移动端 drawer
  const [mobileOpen, setMobileOpen] = useState(false);

  // 头像下拉
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // 路径变化关闭 drawer
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  function openSubsite() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setSubsiteOpen(true);
  }
  function scheduleCloseSubsite() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setSubsiteOpen(false), 150);
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
                className="flex items-center gap-1 text-lg font-bold text-gradient"
                aria-label="Lvyz 主页菜单"
              >
                Lvyz
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
              <div className="text-xl font-bold text-gradient">Lvyz</div>
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
