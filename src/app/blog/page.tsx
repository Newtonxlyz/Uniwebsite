// /blog - 博客首页（文章列表）
import Link from "next/link";
import { listPublishedPosts } from "@/lib/posts";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ArrowLeft, PenLine, Calendar, Eye, MessageCircle, Tag } from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

export const metadata = {
  title: "博客 · lvyz.org",
  description: "技术笔记 · 学习心得 · 行业观点 · 诗与远方",
};

const CATEGORIES = [
  { key: "", label: "全部", color: "" },
  { key: "poetry", label: "诗韵", color: "from-amber-500/30 to-pink-500/30" },
  { key: "blog", label: "随笔", color: "from-blue-500/30 to-cyan-500/30" },
  { key: "tech", label: "技术", color: "from-emerald-500/30 to-teal-500/30" },
  { key: "life", label: "生活", color: "from-rose-500/30 to-orange-500/30" },
  { key: "industry", label: "行业", color: "from-violet-500/30 to-purple-500/30" },
];

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const category = sp.category || undefined;
  const page = parseInt(sp.page || "1", 10);
  const search = sp.q || undefined;

  const { items, total, pageCount } = await listPublishedPosts({ category, page, search });

  // 检查当前用户
  const session = await auth.api.getSession({ headers: await headers() });
  const isLoggedIn = !!session?.user;

  return (
    <div className="min-h-screen pt-24 px-6 pb-16">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <header className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PenLine className="h-8 w-8 text-amber-400" />
              <h1 className="text-4xl font-bold text-white">
                <span className="text-gradient">博客</span>
              </h1>
            </div>
            {isLoggedIn && (
              <Link
                href="/blog/new"
                className="glass-card px-4 py-2 text-sm font-medium text-white hover:scale-105 transition-transform"
              >
                ✍️ 写文章
              </Link>
            )}
          </div>
          <p className="mt-3 text-gray-400">技术笔记 · 学习心得 · 行业观点 · 诗与远方</p>
        </header>

        {/* 搜索框 */}
        <form action="/blog" method="get" className="mb-6">
          {category && <input type="hidden" name="category" value={category} />}
          <input
            type="text"
            name="q"
            defaultValue={search || ""}
            placeholder="搜索文章..."
            className="w-full glass-card px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
          />
        </form>

        {/* 分类筛选 */}
        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = (cat.key || "") === (category || "");
            return (
              <Link
                key={cat.key || "all"}
                href={cat.key ? `/blog?category=${cat.key}` : "/blog"}
                className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500/30 to-pink-500/30 text-white border border-amber-400/50"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>

        {/* 文章列表 */}
        {items.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <span className="text-5xl mb-4 block">✍️</span>
            <h2 className="text-xl font-semibold text-white mb-3">还没有文章</h2>
            <p className="text-gray-400 mb-6">
              {search
                ? `没有找到关于 "${search}" 的文章`
                : "博客板块刚开张，第一篇文章还没出现"}
            </p>
            {isLoggedIn && (
              <Link
                href="/blog/new"
                className="inline-block glass-card px-6 py-2 text-sm font-medium text-white hover:scale-105 transition-transform"
              >
                来写第一篇
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {items.map((post) => {
              const tagList = (post.tags || "").split(",").filter(Boolean);
              const catInfo = CATEGORIES.find((c) => c.key === post.category);
              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="glass-card block p-6 hover:scale-[1.01] transition-transform"
                >
                  {post.coverImage && (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="mb-4 w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  <div className="mb-3 flex items-center gap-3 text-xs text-gray-500">
                    {catInfo && (
                      <span className="px-2 py-0.5 rounded bg-gradient-to-r from-amber-500/20 to-pink-500/20 text-amber-300">
                        {catInfo.label}
                      </span>
                    )}
                    {post.publishedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(post.publishedAt), "yyyy-MM-dd", { locale: zhCN })}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.viewCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {post._count.comments}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2 hover:text-amber-300 transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-400 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                  )}
                  {tagList.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag className="h-3 w-3 text-gray-500" />
                      {tagList.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-gray-500 px-2 py-0.5 bg-white/5 rounded"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-3 text-xs text-gray-500">
                    by {post.author.name}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* 分页 */}
        {pageCount > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            {page > 1 && (
              <Link
                href={`/blog?${new URLSearchParams({ ...(category ? { category } : {}), page: String(page - 1) }).toString()}`}
                className="glass-card px-4 py-2 text-sm text-white"
              >
                ← 上一页
              </Link>
            )}
            <span className="text-sm text-gray-500">
              第 {page} / {pageCount} 页 · 共 {total} 篇
            </span>
            {page < pageCount && (
              <Link
                href={`/blog?${new URLSearchParams({ ...(category ? { category } : {}), page: String(page + 1) }).toString()}`}
                className="glass-card px-4 py-2 text-sm text-white"
              >
                下一页 →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
