"use client";

import Link from "next/link";
import { useSession, signOut as doSignOut } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/theme-toggle";

export function NavBar() {
  const { data: session } = useSession();
  const user = session?.user ?? null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-white/5 dark:border-white/5 light:border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/" className="text-lg font-bold text-gradient">Lvyz</Link>
          <Link href="/crashai" className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors">crashAI</Link>
          <Link href="/kids-ai" className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors">儿童AI</Link>
          <Link href="/picturebook" className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors hidden sm:block">绘本</Link>
          <Link href="/knowledge-base" className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors hidden md:block">知识库</Link>
          <Link href="/blog" className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors hidden md:block">博客</Link>
          <Link href="/merchandise" className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors hidden lg:block">IP周边</Link>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <>
              <span className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-700">{user.name}</span>
              <button
                onClick={() => doSignOut()}
                className="text-sm text-gray-500 dark:text-gray-500 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
              >
                退出
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-all"
            >
              登录
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
