// 绘本详情 / 更新 / 删除
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { deleteFile, r2 } from "@/lib/storage";
import { S3Client } from "@aws-sdk/client-s3";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";

const ALLOWED_ROLES = ["EDITOR", "ADMIN", "SUPERADMIN"];

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "未登录", status: 401 };
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !ALLOWED_ROLES.includes(user.role)) return { error: "无权限", status: 403 };
  return { session, user };
}

// GET 单本
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const story = await prisma.picturebookStory.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: {
      pages: { orderBy: { pageNum: "asc" } },
      characters: true,
      uploader: { select: { id: true, name: true, email: true } },
    },
  });
  if (!story) return NextResponse.json({ error: "绘本不存在" }, { status: 404 });
  return NextResponse.json(story);
}

// PATCH 更新
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const body = await req.json();
  const existing = await prisma.picturebookStory.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "绘本不存在" }, { status: 404 });

  const {
    title,
    titleEn,
    series,
    seriesCategory,
    desc,
    age,
    time,
    pageCount,
    emoji,
    cover,
    videoUrl,
    tags,
    status,
    characters,
  } = body;

  // 角色：先全删后插
  if (Array.isArray(characters)) {
    await prisma.picturebookCharacter.deleteMany({ where: { storyId: id } });
  }

  const updateData: any = {};
  if (title !== undefined) updateData.title = title;
  if (titleEn !== undefined) updateData.titleEn = titleEn;
  if (series !== undefined) updateData.series = series;
  if (seriesCategory !== undefined) updateData.seriesCategory = seriesCategory;
  if (desc !== undefined) updateData.desc = desc;
  if (age !== undefined) updateData.age = age;
  if (time !== undefined) updateData.time = time;
  if (pageCount !== undefined) updateData.pageCount = pageCount;
  if (emoji !== undefined) updateData.emoji = emoji;
  if (cover !== undefined) updateData.cover = cover;
  if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
  if (tags !== undefined) updateData.tags = tags;
  if (status !== undefined) {
    updateData.status = status;
    if (status === "PUBLISHED" && !existing.publishedAt) updateData.publishedAt = new Date();
    if (status === "ARCHIVED") updateData.publishedAt = null;
  }
  if (Array.isArray(characters)) {
    updateData.characters = {
      create: characters.map((c: any) => ({ charId: c.id || c.charId, name: c.name })),
    };
  }

  const story = await prisma.picturebookStory.update({
    where: { id },
    data: updateData,
    include: { pages: true, characters: true },
  });

  return NextResponse.json(story);
}

// DELETE 删除（连 R2 文件）
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const story = await prisma.picturebookStory.findUnique({
    where: { id },
    include: { pages: true },
  });
  if (!story) return NextResponse.json({ error: "绘本不存在" }, { status: 404 });

  // 删 R2 文件
  const keys: string[] = [];
  if (story.cover) {
    const k = story.cover.split("/").slice(-4).join("/");
    if (k) keys.push(k);
  }
  if (story.videoUrl) {
    const k = story.videoUrl.split("/").slice(-4).join("/");
    if (k) keys.push(k);
  }
  for (const p of story.pages) {
    const k = p.imageUrl.split("/").slice(-4).join("/");
    if (k) keys.push(k);
  }
  if (keys.length > 0) {
    try {
      await r2.send(new DeleteObjectsCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Delete: { Objects: keys.map((k) => ({ Key: k })) },
      }));
    } catch (e) {
      console.warn("[delete] R2 batch delete failed:", e);
    }
  }

  // 删 DB 记录（cascade 会删 pages + characters）
  await prisma.picturebookStory.delete({ where: { id } });

  return NextResponse.json({ ok: true, deletedKeys: keys.length });
}
