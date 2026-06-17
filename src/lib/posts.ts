// lvyz-platform 业务逻辑（Server-only）
import { prisma } from "./db";
import { auth } from "./auth";
import { headers } from "next/headers";

// ────────────────────────────────────────────
// 工具函数
// ────────────────────────────────────────────
export function slugify(title: string): string {
  // 1. 转小写，去空白
  // 2. 移除中文 + 标点（保留 ASCII a-z, 0-9, -, _）
  // 3. 如果 slug 为空，用时间戳兜底
  const base = title
    .toLowerCase()
    .trim()
    // 移除中文字符（CJK 范围）
    .replace(/[\u4e00-\u9fa5\u3400-\u4dbf\uff00-\uffef]/g, "")
    // 保留 a-z, 0-9, -, _
    .replace(/[^a-z0-9\-_\s]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return base || `post-${Date.now()}`;
}

async function ensureUniqueSlug(base: string): Promise<string> {
  let slug = base;
  let n = 1;
  while (await prisma.post.findUnique({ where: { slug } })) {
    n += 1;
    slug = `${base}-${n}`;
  }
  return slug;
}

// ────────────────────────────────────────────
// Session 工具（通过 Better Auth API）
// ────────────────────────────────────────────
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  role: string;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await (auth as any).api.getSession({ headers: await headers() });
    if (!session?.user) return null;
    // 从 DB 拿最新 role
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
      role: dbUser?.role || (session.user as { role?: string }).role || "USER",
    };
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (!["ADMIN", "SUPERADMIN", "EDITOR"].includes(user.role)) {
    throw new Error("Forbidden");
  }
  return user;
}

function isAdminRole(role: string): boolean {
  return ["ADMIN", "SUPERADMIN", "EDITOR"].includes(role);
}

// ────────────────────────────────────────────
// 文章 CRUD
// ────────────────────────────────────────────
export type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type PostCategory = "poetry" | "blog" | "tech" | "life" | "industry";

export interface PostInput {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  category?: PostCategory;
  tags?: string;
  status?: PostStatus;
  allowComments?: boolean;
  embeds?: string;
}

export async function listPublishedPosts(opts?: {
  category?: string;
  page?: number;
  pageSize?: number;
  search?: string;
}) {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 10;
  const where = {
    status: "PUBLISHED" as const,
    ...(opts?.category ? { category: opts.category } : {}),
    ...(opts?.search
      ? {
          OR: [
            { title: { contains: opts.search } },
            { excerpt: { contains: opts.search } },
            { content: { contains: opts.search } },
          ],
        }
      : {}),
  };
  const [items, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      include: {
        author: { select: { id: true, name: true, image: true } },
        _count: { select: { comments: true } },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.post.count({ where }),
  ]);
  return { items, total, page, pageSize, pageCount: Math.ceil(total / pageSize) };
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true, image: true, bio: true } },
      comments: {
        where: { status: "VISIBLE", parentId: null },
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, name: true, image: true } },
          replies: {
            where: { status: "VISIBLE" },
            orderBy: { createdAt: "asc" },
            include: {
              author: { select: { id: true, name: true, image: true } },
            },
          },
        },
      },
      media: {
        include: { media: true },
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function getPostById(id: string) {
  return prisma.post.findUnique({
    where: { id },
    include: { media: { include: { media: true } } },
  });
}

export async function createPost(input: PostInput) {
  const user = await requireUser();
  const slug = await ensureUniqueSlug(slugify(input.title));
  return prisma.post.create({
    data: {
      slug,
      title: input.title,
      content: input.content,
      excerpt: input.excerpt,
      coverImage: input.coverImage,
      category: input.category || "blog",
      tags: input.tags,
      status: input.status || "DRAFT",
      allowComments: input.allowComments ?? true,
      embeds: input.embeds,
      authorId: user.id,
      publishedAt: input.status === "PUBLISHED" ? new Date() : null,
    },
  });
}

export async function updatePost(id: string, input: Partial<PostInput>) {
  const user = await requireUser();
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new Error("Post not found");
  if (post.authorId !== user.id && !isAdminRole(user.role)) {
    throw new Error("Forbidden");
  }
  const publishedAt =
    input.status === "PUBLISHED" && post.status !== "PUBLISHED"
      ? new Date()
      : input.status && input.status !== "PUBLISHED"
      ? post.publishedAt
      : post.publishedAt;

  return prisma.post.update({
    where: { id },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.content !== undefined && { content: input.content }),
      ...(input.excerpt !== undefined && { excerpt: input.excerpt }),
      ...(input.coverImage !== undefined && { coverImage: input.coverImage }),
      ...(input.category !== undefined && { category: input.category }),
      ...(input.tags !== undefined && { tags: input.tags }),
      ...(input.status !== undefined && { status: input.status }),
      ...(input.allowComments !== undefined && { allowComments: input.allowComments }),
      ...(input.embeds !== undefined && { embeds: input.embeds }),
      ...(publishedAt !== undefined && { publishedAt }),
    },
  });
}

export async function deletePost(id: string) {
  const user = await requireUser();
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new Error("Post not found");
  if (post.authorId !== user.id && !isAdminRole(user.role)) {
    throw new Error("Forbidden");
  }
  await prisma.post.delete({ where: { id } });
}

export async function incrementViewCount(id: string) {
  await prisma.post.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  }).catch(() => null);
}

// ────────────────────────────────────────────
// 留言 CRUD
// ────────────────────────────────────────────
export async function addComment(input: {
  postId: string;
  content: string;
  parentId?: string;
}) {
  const user = await requireUser();
  return prisma.comment.create({
    data: {
      postId: input.postId,
      authorId: user.id,
      content: input.content,
      parentId: input.parentId,
    },
    include: {
      author: { select: { id: true, name: true, image: true } },
    },
  });
}

export async function deleteComment(id: string) {
  const user = await requireUser();
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) throw new Error("Comment not found");
  if (comment.authorId !== user.id && !isAdminRole(user.role)) {
    throw new Error("Forbidden");
  }
  await prisma.comment.update({
    where: { id },
    data: { status: "DELETED" },
  });
}
