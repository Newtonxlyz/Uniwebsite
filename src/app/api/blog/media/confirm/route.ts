// /api/blog/media/confirm - 浏览器直传 R2 后写 Media 表
// POST body: { key, publicUrl, filename, mimeType, size, postId?, role? }

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

function getMediaType(mime: string): "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT" {
  if (mime.startsWith("image/")) return "IMAGE";
  if (mime.startsWith("video/")) return "VIDEO";
  if (mime.startsWith("audio/")) return "AUDIO";
  return "DOCUMENT";
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const { key, publicUrl, filename, mimeType, size, postId, role = "CONTENT" } = await req.json();

  if (!key || !publicUrl || !filename || !mimeType) {
    return NextResponse.json({ error: "key/publicUrl/filename/mimeType 必填" }, { status: 400 });
  }

  // 写 Media 表
  const media = await prisma.media.create({
    data: {
      filename,
      mimeType,
      size: size || 0,
      type: getMediaType(mimeType),
      key,
      url: publicUrl,
      uploaderId: session.user.id,
    },
  });

  // 如果指定了 postId，关联到 Post
  if (postId) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return NextResponse.json({ error: "文章不存在" }, { status: 404 });

    // 权限
    if (post.authorId !== session.user.id) {
      const user = await prisma.user.findUnique({ where: { id: session.user.id } });
      if (!user || !["EDITOR", "ADMIN", "SUPERADMIN"].includes(user.role)) {
        return NextResponse.json({ error: "无权限" }, { status: 403 });
      }
    }

    // 已存在则跳过
    const existing = await prisma.postMedia.findFirst({
      where: { postId, mediaId: media.id },
    });
    if (!existing) {
      const count = await prisma.postMedia.count({ where: { postId } });
      await prisma.postMedia.create({
        data: { postId, mediaId: media.id, role, order: count },
      });
    }
  }

  return NextResponse.json(media);
}
