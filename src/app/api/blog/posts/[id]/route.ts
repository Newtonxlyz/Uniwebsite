// /api/blog/posts/[id] - 文章单条
// GET / PATCH / DELETE
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { S3Client, DeleteObjectsCommand } from "@aws-sdk/client-s3";

const ALLOWED_ROLES = ["EDITOR", "ADMIN", "SUPERADMIN"];

async function getActor() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "未登录", status: 401 };
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return { error: "用户不存在", status: 404 };
  return { user };
}

function isAdminOrEditor(role: string | undefined) {
  return role && ALLOWED_ROLES.includes(role);
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: {
      author: { select: { id: true, name: true, image: true } },
    },
  });
  if (!post) return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await getActor();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "文章不存在" }, { status: 404 });

  // 权限：作者本人或 ADMIN/EDITOR
  const isAuthor = existing.authorId === auth.user.id;
  if (!isAuthor && !isAdminOrEditor(auth.user.role)) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const body = await req.json();
  const updateData: any = {};
  for (const k of ["title", "content", "excerpt", "coverImage", "category", "tags", "status", "allowComments", "embeds"]) {
    if (body[k] !== undefined) updateData[k] = body[k];
  }
  if (body.excerpt === "") updateData.excerpt = null;
  if (body.coverImage === "") updateData.coverImage = null;

  // 状态变更时更新 publishedAt
  if (body.status === "PUBLISHED" && existing.status !== "PUBLISHED") {
    updateData.publishedAt = new Date();
  }
  if (body.status === "DRAFT" || body.status === "ARCHIVED") {
    // 保持 publishedAt 不变（草稿也有发布过的）
  }

  const post = await prisma.post.update({ where: { id }, data: updateData });
  return NextResponse.json(post);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await getActor();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "文章不存在" }, { status: 404 });

  const isAuthor = existing.authorId === auth.user.id;
  if (!isAuthor && !isAdminOrEditor(auth.user.role)) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  // 删关联的 Media
  const postMedia = await prisma.postMedia.findMany({
    where: { postId: id },
    include: { media: true },
  });
  const keys = postMedia.map((pm) => pm.media.key).filter(Boolean);

  if (keys.length > 0) {
    try {
      const r2 = new S3Client({
        region: "auto",
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID!,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
        },
      });
      await r2.send(new DeleteObjectsCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Delete: { Objects: keys.map((k) => ({ Key: k })) },
      }));
    } catch (e) {
      console.warn("[delete post] R2 fail:", e);
    }
  }

  // 删 PostMedia + Media 记录
  const mediaIds = postMedia.map((pm) => pm.mediaId);
  await prisma.postMedia.deleteMany({ where: { postId: id } });
  if (mediaIds.length > 0) {
    await prisma.media.deleteMany({ where: { id: { in: mediaIds } } });
  }

  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ ok: true, deletedMedia: mediaIds.length });
}
