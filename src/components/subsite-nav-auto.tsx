"use client";

import { usePathname } from "next/navigation";
import { SubsiteNav } from "@/components/subsite-nav";
import { getActiveSubsite } from "@/components/nav-bar";

export function SubsiteNavAuto() {
  const pathname = usePathname();
  const active = getActiveSubsite(pathname);
  if (!active) return null;
  // 提取 subsite key（href 第一段）
  const subsite = active.href.replace(/^\//, "");
  return <SubsiteNav subsite={subsite} />;
}
