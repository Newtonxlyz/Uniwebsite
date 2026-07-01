// 浏览器直传 R2 后，调用此 API 写入 DB
// POST /api/admin/picturebook/confirm-upload
//   body: { storyId, key, publicUrl, kind, pageNum, text?, size? }

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const ALLOWED_ROLES = ["EDITOR", "ADMIN", "SUPERADMIN"];

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "未登录", status: 401 };
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !ALLOWED_ROLES.includes(user.role)) return { error: "无权限", status: 403 };
  return { session, user };
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { storyId, publicUrl, kind = "page", pageNum, text, size } = await req.json();
  if (!storyId || !publicUrl) {
    return NextResponse.json({ error: "storyId/publicUrl 必填" }, { status: 400 });
  }

  if (kind === "cover") {
    await prisma.picturebookStory.update({ where: { id: storyId }, data: { cover: publicUrl } });
    return NextResponse.json({ kind: "cover", url: publicUrl });
  }
  if (kind === "video") {
    await prisma.picturebookStory.update({ where: { id: storyId }, data: { videoUrl: publicUrl } });
    return NextResponse.json({ kind: "video", url: publicUrl });
  }

  if (!pageNum) {
    return NextResponse.json({ error: "pageNum 必填" }, { status: 400 });
  }

  const page = await prisma.picturebookPage.upsert({
    where: { storyId_pageNum: { storyId, pageNum } },
    create: { storyId, pageNum, imageUrl: publicUrl, text: text || null, size: size || null },
    update: { imageUrl: publicUrl, text: text || null, size: size || null },
  });

  const total = await prisma.picturebookPage.count({ where: { storyId } });
  await prisma.picturebookStory.update({ where: { id: storyId }, data: { pageCount: total } });

  return NextResponse.json({ kind: "page", page, total });
}
