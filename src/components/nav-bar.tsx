"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut as doSignOut } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_ITEMS = [
  { href: "/crashai", label: "crashAI" },
  { href: "/kids-ai", label: "儿童AI" },
  { href: "/picturebook", label: "绘本" },
  { href: "/knowledge-base", label: "知识库" },
  { href: "/blog", label: "博客" },
  { href: "/merchandise", label: "IP周边" },
];

export function NavBar() {
  const { data: session } = useSession();
  const user = session?.user ?? null;
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-white/10 dark:border-white/10 light:border-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
          <Link href="/" className="text-lg font-bold text-gradient mr-2">Lvyz</Link>
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "px-2 py-1.5 sm:px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                    isActive
                      ? "text-white dark:text-white light:text-slate-900 bg-white/10 dark:bg-white/10 light:bg-indigo-100"
                      : "text-gray-300 dark:text-gray-300 light:text-slate-700 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-slate-200/60",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <>
              <span className="text-sm text-gray-300 dark:text-gray-300 light:text-slate-700 hidden sm:inline">
                {user.name}
              </span>
              <button
                onClick={() => doSignOut()}
                className="text-sm text-gray-400 dark:text-gray-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
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
