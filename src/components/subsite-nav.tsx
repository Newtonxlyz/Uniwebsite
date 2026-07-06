"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PlusCircle,
  FileText,
  ListTree,
  Upload,
  Users,
  Brain,
  Cpu,
  Sparkles,
  BookOpen,
  Library,
  ShoppingBag,
  Gamepad2,
  GraduationCap,
  TrendingUp,
  Award,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

interface SubsiteAction {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

const ADMIN_ROLES = ["ADMIN", "SUPERADMIN"];
const PICTUREBOOK_ADMIN = ["ADMIN", "SUPERADMIN", "EDITOR"];

export function SubsiteNav({ subsite }: { subsite: string }) {
  const { data: session } = useSession();
  const user = session?.user ?? null;
  const isAdmin = !!(user && ADMIN_ROLES.includes((user as { role?: string }).role || ""));
  const canManagePicturebook = !!(
    user && PICTUREBOOK_ADMIN.includes((user as { role?: string }).role || "")
  );
  const pathname = usePathname();

  // 子站专属动作（按用户要求：仅 Blog 写文章 / 我的文章；其他子站按功能定义）
  const actions: SubsiteAction[] = (() => {
    switch (subsite) {
      case "blog":
        return [
          { href: "/blog/new", label: "写新文章", icon: PlusCircle, description: "发布新博客" },
          { href: "/blog", label: "我的文章", icon: FileText, description: "查看博客列表" },
        ];
      case "picturebook":
        return [
          { href: "/picturebook/stories", label: "故事", icon: BookOpen, description: "绘本故事" },
          { href: "/picturebook/characters", label: "角色", icon: Users, description: "绘本角色" },
        ];
      case "crashai":
        return [
          { href: "/crashai", label: "课程", icon: GraduationCap, description: "AI 训练课程" },
          { href: "/crashai/safety-training", label: "路径训练", icon: TrendingUp, description: "4 路径实操" },
          { href: "/crashai/cards", label: "闪卡", icon: Brain, description: "概念速记" },
        ];
      case "kids-ai":
        return [
          { href: "/kids-ai", label: "首页", icon: Sparkles, description: "儿童 AI 入口" },
          { href: "/kids-ai/chapters", label: "章节", icon: ListTree, description: "AI 课程章节" },
          { href: "/kids-ai/games", label: "互动游戏", icon: Gamepad2, description: "本地大模型游戏" },
          { href: "/kids-ai/achievements", label: "成就", icon: Award, description: "学习成就" },
        ];
      case "knowledge-base":
        return [
          { href: "/knowledge-base", label: "搜索", icon: Library, description: "83 篇技术文档" },
        ];
      case "merchandise":
        return [
          { href: "/merchandise", label: "商品", icon: ShoppingBag, description: "Lvyz 周边" },
        ];
      default:
        return [];
    }
  })();

  // 子站专属管理（仅 admin 在 picturebook 子站看到）
  const adminActions: SubsiteAction[] = [];
  if (subsite === "picturebook" && canManagePicturebook) {
    adminActions.push(
      { href: "/admin/picturebook", label: "绘本管理", icon: Upload, description: "上传/编辑绘本" }
    );
  }

  if (actions.length === 0 && adminActions.length === 0) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-30 glass-nav border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center gap-1 sm:gap-2 h-12 overflow-x-auto scrollbar-hide">
          {actions.map((a) => {
            const Icon = a.icon;
            const isActive = pathname === a.href;
            return (
              <Link
                key={a.href}
                href={a.href}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-300"
                    : "text-gray-300 dark:text-gray-300 light:text-slate-700 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-slate-200/60"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {a.label}
              </Link>
            );
          })}

          {adminActions.length > 0 && (
            <>
              <div className="h-5 w-px bg-white/10 mx-1 flex-shrink-0" />
              {adminActions.map((a) => {
                const Icon = a.icon;
                const isActive = pathname === a.href;
                return (
                  <Link
                    key={a.href}
                    href={a.href}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? "bg-amber-500/20 text-amber-300"
                        : "text-amber-300/80 hover:text-amber-200 hover:bg-amber-500/10"
                    }`}
                    title={a.description}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {a.label}
                    <span className="hidden sm:inline text-[10px] px-1 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      ADMIN
                    </span>
                  </Link>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
