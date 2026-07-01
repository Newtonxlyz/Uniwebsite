// 上传绘本单页图片 / 视频 / zip
// POST /api/admin/picturebook/[id]/upload-page
//   body: { pageNum, file } 或 { pageNum, url }  // 支持本地 file 或已上传到 R2 的 url
// DELETE /api/admin/picturebook/[id]/upload-page?pageId=xxx  // 删单页

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const ALLOWED_ROLES = ["EDITOR", "ADMIN", "SUPERADMIN"];
const MAX_IMAGE = 10 * 1024 * 1024;       // 10MB
const MAX_VIDEO = 500 * 1024 * 1024;      // 500MB

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "未登录", status: 401 };
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !ALLOWED_ROLES.includes(user.role)) return { error: "无权限", status: 403 };
  return { session, user };
}

function getR2() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

const PUBLIC_URL = process.env.R2_PUBLIC_URL || "https://media.lvyz.org";
const BUCKET = process.env.R2_BUCKET_NAME || "lvyzorg";

// POST 上传单页（multipart/form-data）
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const story = await prisma.picturebookStory.findUnique({ where: { id } });
  if (!story) return NextResponse.json({ error: "绘本不存在" }, { status: 404 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const pageNumStr = formData.get("pageNum") as string | null;
  const text = (formData.get("text") as string | null) || null;
  const kind = (formData.get("kind") as string | null) || "page"; // page | cover | video

  if (!file) return NextResponse.json({ error: "file 必填" }, { status: 400 });

  // 类型 + 大小校验
  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  if (isImage && file.size > MAX_IMAGE) {
    return NextResponse.json({ error: `图片超过 ${MAX_IMAGE / 1024 / 1024}MB` }, { status: 400 });
  }
  if (isVideo && file.size > MAX_VIDEO) {
    return NextResponse.json({ error: `视频超过 ${MAX_VIDEO / 1024 / 1024}MB` }, { status: 400 });
  }
  if (!isImage && !isVideo) {
    return NextResponse.json({ error: "仅支持 image/* 或 video/*" }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const r2 = getR2();
  const buf = Buffer.from(await file.arrayBuffer());

  // 不同 kind 不同 key
  let key: string;
  if (kind === "cover") {
    key = `picturebook/${story.series}/${story.slug}/cover.${ext}`;
  } else if (kind === "video") {
    key = `picturebook/${story.series}/${story.slug}/video.${ext}`;
  } else {
    const pageNum = pageNumStr ? parseInt(pageNumStr) : (await prisma.picturebookPage.count({ where: { storyId: id } })) + 1;
    if (!pageNum || pageNum < 1) return NextResponse.json({ error: "pageNum 无效" }, { status: 400 });
    key = `picturebook/${story.series}/${story.slug}/page_${String(pageNum).padStart(2, "0")}.${ext}`;
  }

  await r2.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buf,
    ContentType: file.type,
    CacheControl: "public, max-age=31536000, immutable",
  }));

  const url = `${PUBLIC_URL}/${key}`;

  // 入库
  if (kind === "cover") {
    await prisma.picturebookStory.update({ where: { id }, data: { cover: url } });
    return NextResponse.json({ kind: "cover", url, key, size: buf.length });
  }
  if (kind === "video") {
    await prisma.picturebookStory.update({ where: { id }, data: { videoUrl: url } });
    return NextResponse.json({ kind: "video", url, key, size: buf.length });
  }

  // 普通 page
  const pageNum = parseInt(pageNumStr || "0") || (await prisma.picturebookPage.count({ where: { storyId: id } })) + 1;
  const page = await prisma.picturebookPage.upsert({
    where: { storyId_pageNum: { storyId: id, pageNum } },
    create: { storyId: id, pageNum, imageUrl: url, text, size: buf.length },
    update: { imageUrl: url, text, size: buf.length },
  });

  // 更新 pageCount
  const total = await prisma.picturebookPage.count({ where: { storyId: id } });
  await prisma.picturebookStory.update({ where: { id }, data: { pageCount: total } });

  return NextResponse.json({ kind: "page", page, url, key, size: buf.length });
}

// DELETE 删单页
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const url = new URL(req.url);
  const pageId = url.searchParams.get("pageId");
  if (!pageId) return NextResponse.json({ error: "pageId 必填" }, { status: 400 });

  const page = await prisma.picturebookPage.findUnique({ where: { id: pageId } });
  if (!page || page.storyId !== id) return NextResponse.json({ error: "页面不存在" }, { status: 404 });

  // 删 R2
  const key = page.imageUrl.replace(PUBLIC_URL + "/", "");
  try {
    const r2 = getR2();
    await r2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
  } catch (e) {
    console.warn("[delete page] R2 fail:", e);
  }
  await prisma.picturebookPage.delete({ where: { id: pageId } });

  // 重排 pageNum + 更新 pageCount
  const remain = await prisma.picturebookPage.findMany({ where: { storyId: id }, orderBy: { pageNum: "asc" } });
  for (let i = 0; i < remain.length; i++) {
    if (remain[i].pageNum !== i + 1) {
      await prisma.picturebookPage.update({ where: { id: remain[i].id }, data: { pageNum: i + 1 } });
    }
  }
  await prisma.picturebookStory.update({ where: { id }, data: { pageCount: remain.length } });

  return NextResponse.json({ ok: true, pageCount: remain.length });
}
