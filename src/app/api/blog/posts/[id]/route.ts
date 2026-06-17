// GET  /api/blog/posts/[id] - 获取单篇文章（公开只读已发布，作者可读自己草稿）
// PATCH /api/blog/posts/[id] - 更新
// DELETE /api/blog/posts/[id] - 删除
import { NextRequest, NextResponse } from "next/server";
import { getPostById, getPostBySlug, updatePost, deletePost, incrementViewCount } from "@/lib/posts";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  coverImage: z.string().url().optional(),
  category: z.enum(["poetry", "blog", "tech", "life", "industry"]).optional(),
  tags: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  allowComments: z.boolean().optional(),
  embeds: z.string().optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const increment = searchParams.get("view") === "1";

  // id 可以是 slug 或 cuid
  const post = id.length > 20
    ? await getPostById(id)
    : await getPostBySlug(id);

  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (increment && post.status === "PUBLISHED") {
    await incrementViewCount(post.id);
  }
  return NextResponse.json(post);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
    }
    const post = await updatePost(id, parsed.data);
    return NextResponse.json(post);
  } catch (error) {
    const msg = (error as Error).message;
    const status = msg === "Unauthorized" ? 401 : msg === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await deletePost(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const msg = (error as Error).message;
    const status = msg === "Unauthorized" ? 401 : msg === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
