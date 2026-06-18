// 列出/管理 site access（管理员用）
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "未登录" }, { status: 401 });

  // 只有 SUPERADMIN/ADMIN 能列出
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !["ADMIN", "SUPERADMIN"].includes(user.role)) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const url = new URL(req.url);
  const email = url.searchParams.get("email");

  if (email) {
    // 查单个用户的全部子站权限
    const target = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!target) return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    const accesses = await prisma.siteAccess.findMany({
      where: { userId: target.id },
      orderBy: { site: "asc" },
    });
    return NextResponse.json({ user: target, accesses });
  }

  // 列出所有用户的权限
  const accesses = await prisma.siteAccess.findMany({
    include: { user: { select: { id: true, email: true, name: true, role: true } } },
    orderBy: [{ site: "asc" }, { user: { email: "asc" } }],
  });
  return NextResponse.json(accesses);
}

// 授权某个用户对某个子站
export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const actor = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!actor || !["ADMIN", "SUPERADMIN"].includes(actor.role)) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const { email, site, level, note } = await req.json();
  if (!email || !site || !level) {
    return NextResponse.json({ error: "email/site/level 必填" }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!target) return NextResponse.json({ error: "用户不存在" }, { status: 404 });

  const access = await prisma.siteAccess.upsert({
    where: { userId_site: { userId: target.id, site } },
    update: { level, note },
    create: { userId: target.id, site, level, note },
  });

  return NextResponse.json(access);
}

// 撤销权限
export async function DELETE(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const actor = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!actor || !["ADMIN", "SUPERADMIN"].includes(actor.role)) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const { email, site } = await req.json();
  const target = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!target) return NextResponse.json({ error: "用户不存在" }, { status: 404 });

  await prisma.siteAccess.deleteMany({
    where: { userId: target.id, site },
  });
  return NextResponse.json({ ok: true });
}
