// 绘本列表 / 创建草稿 / 更新 / 删除
// 鉴权：EDITOR / ADMIN / SUPERADMIN
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { slugify } from "@/lib/utils";

const ALLOWED_ROLES = ["EDITOR", "ADMIN", "SUPERADMIN"];

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "未登录", status: 401 };
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !ALLOWED_ROLES.includes(user.role)) return { error: "无权限", status: 403 };
  return { session, user };
}

// GET: 列出绘本（可按 status/uploadedBy 过滤）
export async function GET(req: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const onlyMine = url.searchParams.get("onlyMine") === "true";
  const series = url.searchParams.get("series");
  const search = url.searchParams.get("search");

  const where: any = {};
  if (status) where.status = status;
  if (series) where.series = series;
  if (onlyMine) where.uploadedBy = auth.user.id;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
      { desc: { contains: search, mode: "insensitive" } },
    ];
  }

  const stories = await prisma.picturebookStory.findMany({
    where,
    include: {
      _count: { select: { pages: true, characters: true } },
      uploader: { select: { id: true, name: true, email: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(stories);
}

// POST: 创建新绘本（仅元数据，pages 走 /upload-pages）
export async function POST(req: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await req.json();
  const {
    title,
    titleEn,
    series,
    seriesCategory,
    desc,
    age,
    time = 8,
    pageCount = 0,
    emoji,
    cover,
    videoUrl,
    tags = [],
    characters = [],
    status = "DRAFT",
  } = body;

  if (!title || !series) {
    return NextResponse.json({ error: "title / series 必填" }, { status: 400 });
  }

  // 生成唯一 slug
  let baseSlug = slugify(title) || `story-${Date.now()}`;
  let slug = baseSlug;
  let n = 1;
  while (await prisma.picturebookStory.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${n++}`;
  }

  const story = await prisma.picturebookStory.create({
    data: {
      slug,
      title,
      titleEn: titleEn || null,
      series,
      seriesCategory: seriesCategory || null,
      desc: desc || null,
      age: age || null,
      time,
      pageCount,
      emoji: emoji || null,
      cover: cover || null,
      videoUrl: videoUrl || null,
      tags,
      status: status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
      uploadedBy: auth.user.id,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
      characters: {
        create: characters.map((c: any) => ({
          charId: c.id || c.charId,
          name: c.name,
        })),
      },
    },
    include: { characters: true, _count: { select: { pages: true } } },
  });

  return NextResponse.json(story);
}
