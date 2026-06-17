import Link from "next/link";
import { ArrowLeft, Search, Filter, BookOpen, Clock, User, X, ChevronLeft, ChevronRight } from "lucide-react";
import { series } from "@/content/picturebook";
import { getAllStories } from "@/content/picturebook/story-data";

export const metadata = {
  title: "\u6545\u4e8b\u9986 \u00b7 \u96f7\u8fea\u560e\u560e\u7ed8\u672c\u4e16\u754c",
  description: "\u6d4f\u89c8748\u4e2a\u96f7\u8fea\u560e\u560e\u7ed8\u672c\u6545\u4e8b",
};

const PER_PAGE = 30;

function buildUrl(base: string, params: Record<string, string | undefined>) {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") parts.push(`${k}=${encodeURIComponent(v)}`);
  }
  const qs = parts.join("&");
  return qs ? `${base}?${qs}` : base;
}

export default async function StoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ series?: string; q?: string; page?: string }>;
}) {
  const allStories = await getAllStories();
  const sp = await searchParams;
  const activeSeries = sp.series || "all";
  const searchQuery = (sp.q || "").trim();
  const currentPage = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  // Filter by series
  let filteredStories =
    activeSeries === "all"
      ? allStories
      : allStories.filter((s) => s.series === activeSeries);

  // Filter by search query
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredStories = filteredStories.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.series.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q)) ||
        s.chars.some((c) => c.toLowerCase().includes(q))
    );
  }

  // Pagination
  const totalFiltered = filteredStories.length;
  const totalPages = Math.ceil(totalFiltered / PER_PAGE);
  const safePage = Math.min(currentPage, Math.max(1, totalPages));
  const startIdx = (safePage - 1) * PER_PAGE;
  const paginatedStories = filteredStories.slice(startIdx, startIdx + PER_PAGE);
  const showingStart = totalFiltered > 0 ? startIdx + 1 : 0;
  const showingEnd = Math.min(startIdx + PER_PAGE, totalFiltered);

  const urlParams = (overrides: Record<string, string | undefined>) =>
    buildUrl("/picturebook/stories", {
      series: activeSeries !== "all" ? activeSeries : undefined,
      q: searchQuery || undefined,
      page: overrides.page || (safePage > 1 ? String(safePage) : undefined),
      ...overrides,
    });

  const storyEmojis = [
    "📖", "⭐", "💝", "🌸", "🌟",
    "🌈", "🎵", "🌊", "🦋", "🐦",
    "💧", "💬", "🔬", "🌜", "🌺",
    "✨", "💎", "🏳", "💫", "🔥",
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a] pt-20 px-6 pb-16">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <Link
            href="/picturebook"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            返回绘本首页
          </Link>
          <h1 className="text-3xl font-bold text-white">
            <span className="bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
              故事馆
            </span>
          </h1>
          <p className="mt-2 text-gray-400">
            {allStories.length} 个故事，共{" "}
            {allStories.reduce((s, x) => s + x.pages, 0)} 页
          </p>
        </header>

        {/* Search Bar */}
        <div className="glass-card p-4 mb-4">
          <form className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                name="q"
                defaultValue={searchQuery}
                placeholder="搜索故事标题、描述、角色、标签..."
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.07] transition-colors"
              />
              {searchQuery && (
                <Link
                  href={activeSeries === "all" ? "/picturebook/stories" : `/picturebook/stories?series=${encodeURIComponent(activeSeries)}`}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </Link>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-amber-500/20 text-amber-300 rounded-lg text-sm hover:bg-amber-500/30 transition-colors border border-amber-500/30"
            >
              搜索
            </button>
            {searchQuery && (
              <span className="text-xs text-gray-500">
                找到 {totalFiltered} 个结果
              </span>
            )}
          </form>
        </div>

        {/* Series Filter */}
        <div className="glass-card p-4 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">按系列筛选</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/picturebook/stories"
              className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
                activeSeries === "all"
                  ? "bg-pink-500/30 text-pink-200 border border-pink-500/50"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              全部 ({allStories.length})
            </Link>
            {series.map((s) => {
              const count = allStories.filter((x) => x.series === s.name).length;
              if (count === 0) return null;
              return (
                <Link
                  key={s.id}
                  href={`/picturebook/stories?series=${encodeURIComponent(s.name)}`}
                  className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
                    activeSeries === s.name
                      ? "bg-amber-500/30 text-amber-200 border border-amber-500/50"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {s.name} ({count})
                </Link>
              );
            })}
          </div>
        </div>

        {/* Pagination info + Story Grid */}
        {totalFiltered > PER_PAGE && (
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-gray-500">
              第 {showingStart}-{showingEnd} 条，共 {totalFiltered} 个故事
            </span>
            <span className="text-xs text-gray-600">
              第 {safePage}/{totalPages} 页
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedStories.map((story, idx) => (
            <Link
              key={story.id}
              href={`/picturebook/stories/${story.id}`}
              className="glass-card p-5 hover:scale-[1.02] transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl flex-shrink-0">
                  {storyEmojis[idx % storyEmojis.length]}
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold text-white text-sm leading-tight mb-1">
                    {story.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                    {story.desc.substring(0, 60)}
                    {story.desc.length > 60 ? "..." : ""}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-[10px]">
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-gray-400 flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {story.pages}页
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-gray-400">
                      {story.age}
                    </span>
                    {story.chars.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-white/10 text-gray-400 flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {story.chars.slice(0, 2).join(", ")}
                        {story.chars.length > 2 ? "..." : ""}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Page Navigation */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {safePage > 1 ? (
              <Link
                href={urlParams({ page: String(safePage - 1) })}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors text-sm"
              >
                <ChevronLeft className="h-4 w-4" />
                上一页
              </Link>
            ) : (
              <span className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/[0.02] text-gray-700 text-sm cursor-not-allowed">
                <ChevronLeft className="h-4 w-4" />
                上一页
              </span>
            )}

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => {
                const p = i + 1;
                // Show first, last, and pages around current
                if (
                  p === 1 ||
                  p === totalPages ||
                  (p >= safePage - 2 && p <= safePage + 2)
                ) {
                  return (
                    <Link
                      key={p}
                      href={urlParams({ page: p > 1 ? String(p) : undefined })}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors ${
                        p === safePage
                          ? "bg-amber-500/30 text-amber-300 border border-amber-500/50"
                          : "bg-white/5 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      {p}
                    </Link>
                  );
                }
                // Show ellipsis for gaps
                if (p === safePage - 3 || p === safePage + 3) {
                  return (
                    <span key={p} className="w-8 h-8 flex items-center justify-center text-gray-600 text-xs">
                      ···
                    </span>
                  );
                }
                return null;
              })}
            </div>

            {safePage < totalPages ? (
              <Link
                href={urlParams({ page: String(safePage + 1) })}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors text-sm"
              >
                下一页
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <span className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/[0.02] text-gray-700 text-sm cursor-not-allowed">
                下一页
                <ChevronRight className="h-4 w-4" />
              </span>
            )}
          </div>
        )}

        {totalFiltered === 0 && (
          <div className="text-center py-12">
            <span className="text-5xl mb-4 block">📚</span>
            <p className="text-gray-400">该系列暂无故事</p>
          </div>
        )}
      </div>
    </div>
  );
}
