"use client";

import { usePathname } from "next/navigation";
import { SubsiteNav } from "@/components/subsite-nav";
import { getActiveSubsite } from "@/components/nav-bar";

export function SubsiteNavAuto() {
  const pathname = usePathname();
  const active = getActiveSubsite(pathname);
  if (!active) return null;

  // knowledge-base/articles/[slug] 详情页有自己的 header（返回知识库），
  // 不再渲染 SubsiteNav 避免与"返回知识库"按钮重叠
  if (pathname?.startsWith("/knowledge-base/articles/")) {
    return null;
  }

  // 提取 subsite key（href 第一段）
  const subsite = active.href.replace(/^\//, "");
  return <SubsiteNav subsite={subsite} />;
}
