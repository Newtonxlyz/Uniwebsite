// /blog/[slug] - 文章详情页（含留言 + 嵌入内容）
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, incrementViewCount } from "@/lib/posts";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { ArrowLeft, Calendar, Eye, MessageCircle, User as UserIcon } from "lucide-react";
import { Markdown } from "@/components/markdown";
import { CommentSection } from "@/components/comment-section";
import { EmbedList } from "@/components/embeds";
import { parseEmbeds } from "@/lib/embeds";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not found" };
  return {
    title: `${post.title} · lvyz.org/blog`,
    description: post.excerpt || post.title,
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "PUBLISHED") notFound();

  // 增加浏览数
  await incrementViewCount(post.id);

  // 当前用户
  const session = await auth.api.getSession({ headers: await headers() });
  const currentUser = session?.user;
  const isAuthor = currentUser?.id === post.authorId;
  const canEdit = isAuthor || ["ADMIN", "SUPERADMIN", "EDITOR"].includes((currentUser as { role?: string })?.role || "");

  // 解析嵌入内容
  let embeds: ReturnType<typeof parseEmbeds> = [];
  if (post.embeds) {
    try {
      const urls = JSON.parse(post.embeds) as string[];
      embeds = parseEmbeds(urls);
    } catch {
      // 旧格式（逗号分隔）
      embeds = parseEmbeds(post.embeds.split(","));
    }
  }

  return (
    <div className="min-h-screen pt-24 px-6 pb-16">
      <article className="mx-auto max-w-3xl">
        {/* 返回 */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          返回列表
        </Link>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <UserIcon className="h-4 w-4" />
              {post.author.name}
            </span>
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {format(new Date(post.publishedAt), "yyyy年M月d日", { locale: zhCN })}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              {post.viewCount + 1} 次浏览
            </span>
            <span className="flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4" />
              {post.comments.length} 条留言
            </span>
            {canEdit && (
              <Link
                href={`/blog/edit/${post.id}`}
                className="ml-auto px-3 py-1 text-xs rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors"
              >
                ✏️ 编辑
              </Link>
            )}
          </div>
        </header>

        {/* 封面图 */}
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="mb-8 w-full rounded-lg"
          />
        )}

        {/* 正文 */}
        <div className="prose prose-invert prose-amber max-w-none">
          <Markdown content={post.content} />
        </div>

        {/* 嵌入（小红书/B站等） */}
        {embeds.length > 0 && (
          <section className="mt-10 space-y-6">
            <h2 className="text-xl font-bold text-white">📎 关联内容</h2>
            <EmbedList embeds={embeds} />
          </section>
        )}

        {/* 标签 */}
        {post.tags && (
          <div className="mt-8 flex flex-wrap gap-2 border-t border-white/10 pt-6">
            {(post.tags || "").split(",").filter(Boolean).map((tag) => (
              <Link
                key={tag}
                href={`/blog?q=${encodeURIComponent(tag.trim())}`}
                className="px-3 py-1 text-xs rounded-full bg-white/5 text-gray-400 hover:bg-white/10"
              >
                #{tag.trim()}
              </Link>
            ))}
          </div>
        )}

        {/* 留言 */}
        {post.allowComments && (
          <section className="mt-12 border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              💬 留言 ({post.comments.length})
            </h2>
            <CommentSection
              postId={post.id}
              initialComments={post.comments}
              currentUser={currentUser ? { id: currentUser.id, name: currentUser.name, image: currentUser.image } : null}
            />
          </section>
        )}
      </article>
    </div>
  );
}
