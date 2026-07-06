// /knowledge-base/articles/[slug] - 知识库文章详情
// 1. server 端登录 + WikiAccess 白名单 check（redirect 不在白名单）
// 2. server 不读 public/（Vercel function 读不到），只渲染 client
// 3. client 拉 search-index + 拉 HTML（Vercel Edge 静态资源）

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import KnowledgeArticleClient from "./client";

export const dynamic = "force-dynamic";

export default async function KnowledgeArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login?redirect=/knowledge-base");
  }
  const userEmail = session.user.email?.toLowerCase();
  const whitelist = await prisma.wikiAccess.findUnique({ where: { email: userEmail } });
  if (!whitelist) {
    redirect("/knowledge-base");
  }

  const { slug } = await params;
  return <KnowledgeArticleClient slug={slug} />;
}
