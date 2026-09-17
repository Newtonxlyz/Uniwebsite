"use client";

// 学习浮窗导航 — 进入 /learn/* 路由后始终显示
// 3 个入口:返回主页 / 返回板块层级(课程中心) / 当前课程地图
// 设计:右下角悬浮,FAB 模式(点主按钮展开 3 子按钮)

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, Layers, BookOpen, X, ChevronUp } from "lucide-react";

export function LearnFloatingNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => { setOpen(false); }, [pathname]);

  // 只在 /learn/* 路由下显示(主站门户页)
  if (!mounted) return null;
  const isLearnPage = pathname?.startsWith("/learn");
  if (!isLearnPage) return null;

  // 当前课程(从 pathname 推断): /learn/pinn-crash → pinn-crash
  const currentCourseSlug = pathname?.match(/^\/learn\/([^/]+)/)?.[1];
  const isHub = pathname === "/learn/courses" || !currentCourseSlug || currentCourseSlug === "courses";
  const currentCourseLabel = currentCourseSlug && !isHub ? currentCourseSlug.toUpperCase() : null;

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      {/* 展开菜单 */}
      {open && (
        <div className="absolute bottom-16 right-0 w-72 glass-card p-2 rounded-2xl border border-white/10 shadow-2xl">
          <div className="text-xs text-gray-400 px-3 py-2 font-medium">
            {isHub ? "课程中心导航" : `课程 · ${currentCourseLabel}`}
          </div>

          {/* 返回主页 */}
          <Link
            href="/"
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
          >
            <Home className="h-4 w-4 mt-0.5 text-cyan-400 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-sm font-medium">返回 Lvyz 主页</div>
              <div className="text-xs text-gray-500 mt-0.5">lvyz.org 首页 · 品牌 · BGM</div>
            </div>
          </Link>

          {/* 板块层级:课程中心 hub */}
          <Link
            href="/learn/courses"
            className={`flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors ${
              isHub ? "bg-violet-500/15 text-white" : "text-gray-300 hover:text-white"
            }`}
          >
            <Layers className={`h-4 w-4 mt-0.5 flex-shrink-0 ${isHub ? "text-violet-400" : "text-gray-400"}`} />
            <div className="min-w-0">
              <div className="text-sm font-medium">课程中心</div>
              <div className="text-xs text-gray-500 mt-0.5">板块层级 · 所有课程</div>
            </div>
          </Link>

          {/* 当前课程地图 */}
          {!isHub && (
            <Link
              href={`/courses/${currentCourseSlug === "pinn-crash" ? "pinn-crash-reduction" : "gn-crash-guide"}/index.html`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
            >
              <BookOpen className="h-4 w-4 mt-0.5 text-emerald-400 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-medium">{currentCourseLabel} 课程地图</div>
                <div className="text-xs text-gray-500 mt-0.5">学习进度 · 闪卡 · 笔记 · 报告</div>
              </div>
            </Link>
          )}

          <div className="border-t border-white/10 mt-2 pt-2 px-3 py-2 text-[10px] text-gray-500 leading-relaxed">
            所有进度保存在浏览器 localStorage,跨设备请用报告页 JSON 导入导出。
          </div>
        </div>
      )}

      {/* 主按钮 (FAB) */}
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center justify-center w-14 h-14 rounded-full transition-all shadow-lg ${
          open
            ? "bg-rose-500 hover:bg-rose-600 rotate-45"
            : "bg-gradient-to-br from-violet-500 to-fuchsia-600 hover:from-violet-400 hover:to-fuchsia-500"
        }`}
        aria-label={open ? "关闭学习导航" : "打开学习导航"}
      >
        {open ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <div className="relative">
            <Layers className="h-6 w-6 text-white" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-orange-400 border-2 border-violet-500" />
          </div>
        )}
      </button>

      {!open && (
        <div className="absolute bottom-16 right-0 mb-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs text-white/90 whitespace-nowrap pointer-events-none opacity-80">
          学习导航
        </div>
      )}
    </div>
  );
}