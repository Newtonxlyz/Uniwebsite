// POST /api/blog/posts/[id]/comments - 添加留言
// GET  /api/blog/posts/[id]/comments - 列出留言
import { NextRequest, NextResponse } from "next/server";
import { addComment, deleteComment } from "@/lib/posts";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  content: z.string().min(1).max(2000),
  parentId: z.string().optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const comments = await prisma.comment.findMany({
    where: { postId: id, status: "VISIBLE" },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, image: true } },
    },
  });
  return NextResponse.json({ items: comments, total: comments.length });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
    }
    const comment = await addComment({
      postId: id,
      content: parsed.data.content,
      parentId: parsed.data.parentId,
    });
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    const msg = (error as Error).message;
    const status = msg === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const commentId = searchParams.get("commentId");
  if (!commentId) {
    return NextResponse.json({ error: "commentId required" }, { status: 400 });
  }
  try {
    await deleteComment(commentId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const msg = (error as Error).message;
    const status = msg === "Unauthorized" ? 401 : msg === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
