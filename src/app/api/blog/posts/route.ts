// POST /api/blog/posts - 创建文章
// GET /api/blog/posts - 列出已发布文章（公开）
import { NextRequest, NextResponse } from "next/server";
import { listPublishedPosts, createPost } from "@/lib/posts";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  coverImage: z.string().url().optional(),
  category: z.enum(["poetry", "blog", "tech", "life", "industry"]).optional(),
  tags: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  allowComments: z.boolean().optional(),
  embeds: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("q") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

  try {
    const data = await listPublishedPosts({ category, search, page, pageSize });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
    }
    const post = await createPost(parsed.data);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    const msg = (error as Error).message;
    const status = msg === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
