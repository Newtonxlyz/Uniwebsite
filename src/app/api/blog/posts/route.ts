// /api/blog/posts - 文章 CRUD
// GET: 列出我可见的文章（公开：已发布；登录者：自己的全部 + 公开的）
// POST: 创建文章
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { slugify as baseSlugify } from "@/lib/utils";

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const mine = url.searchParams.get("mine") === "true";

  let where: any = {};
  if (mine && session) {
    // 自己的：全部；他人：只已发布
    where = {
      OR: [
        { authorId: session.user.id },
        { status: "PUBLISHED" },
      ],
    };
  } else {
    where = { status: "PUBLISHED" };
  }
  if (status) {
    // 限定状态必须有自己的（避免外人看到草稿）
    if (!session) return NextResponse.json({ error: "未登录" }, { status: 401 });
    where = { authorId: session.user.id, status };
  }

  const posts = await prisma.post.findMany({
    where,
    select: {
      id: true, slug: true, title: true, excerpt: true, coverImage: true,
      category: true, tags: true, status: true, viewCount: true,
      publishedAt: true, createdAt: true, updatedAt: true,
      author: { select: { id: true, name: true, image: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const body = await req.json();
  const {
    title,
    content = "",
    excerpt = "",
    coverImage = "",
    category = "blog",
    tags = "",
    status = "DRAFT",
    allowComments = true,
    embeds = "[]",
  } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: "标题必填" }, { status: 400 });
  }

  // 唯一 slug
  let baseSlug = baseSlugify(title) || `post-${Date.now()}`;
  let slug = baseSlug;
  let n = 1;
  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${n++}`;
  }

  const post = await prisma.post.create({
    data: {
      slug,
      title: title.trim(),
      content,
      excerpt: excerpt || null,
      coverImage: coverImage || null,
      category,
      tags: tags || null,
      status,
      allowComments,
      embeds,
      authorId: session.user.id,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  });

  return NextResponse.json(post);
}
