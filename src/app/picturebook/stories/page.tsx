import Link from "next/link";
import { ArrowLeft, Search, Filter, BookOpen, Clock, User, X, ChevronLeft, ChevronRight, Star, Sparkles, Heart } from "lucide-react";
import { series } from "@/content/picturebook";
import { getAllStories } from "@/content/picturebook/story-data";

// 绘本设计文档：鲜艳配色
const C = {
  ink: "#2A2420",
  paper: "#FAF8F5",
  amber: "#D4A03D",
  bamboo: "#4A9B7F",
  rose: "#D4778C",
  wisteria: "#8B7EC8",
  cherry: "#E8A4B8",
  orange: "#E8923A",
  teal: "#3D9B8F",
  indigo: "#5B6BC8",
  gold: "#F59E0B",
  red: "#EF4444",
};

const R2 = "https://media.lvyz.org/picturebook-source";

export const metadata = {
  title: "故事馆 · 雷迪嘎嘎绘本世界",
};

// 故事封面映射（用 R2 原版图）
const COVERS: Record<string, string> = {
  "dark-cave": `${R2}/book-cave.jpg`,
  "crow-water-1": `${R2}/book-crow1.jpg`,
  "crow-water-2": `${R2}/book-crow2.jpg`,
  "crow-water-3": `${R2}/book-crow3.jpg`,
  "crow-water-4": `${R2}/book-crow4.jpg`,
  "crow-water-5": `${R2}/book-emotion-1.jpg`,
  "crow-water-6": `${R2}/book-emotion-2.jpg`,
};

const PER_PAGE = 30;

function getCover(story: any): string {
  if (COVERS[story.id]) return COVERS[story.id];
  // fallback
  return `${R2}/book-crow1.jpg`;
}

function getSeriesColor(seriesName: string): string {
  const colorMap: Record<string, string> = {
    "成语故事": C.amber,
    "诗歌故事": "#5BA4CF",
    "噶巴巴成长": C.bamboo,
    "噶丫丫成长": C.rose,
    "儿童情感引导": C.wisteria,
    "科普系列": C.teal,
    "俚语歇后语": C.orange,
    "思念母亲": C.cherry,
    "起源故事": C.indigo,
  };
  return colorMap[seriesName] || C.amber;
}

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

  // Filter
  let filteredStories =
    activeSeries === "all"
      ? allStories
      : allStories.filter((s) => s.series === activeSeries);

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredStories = filteredStories.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.series.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q) ||
        s.tags.some((t: string) => t.toLowerCase().includes(q)) ||
        s.chars.some((c: string) => c.toLowerCase().includes(q))
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

  const featuredStories = paginatedStories.slice(0, 5);
  const normalStories = paginatedStories.slice(5);

  return (
    <div className="min-h-screen pt-16" style={{ background: C.paper }}>
      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${C.paper} 0%, #FEF3C7 50%, #FCE7F3 100%)` }}
      >
        <div className="max-w-6xl mx-auto px-6 py-12">
          <Link
            href="/picturebook"
            className="inline-flex items-center gap-2 text-sm mb-3"
            style={{ color: C.ink }}
          >
            <ArrowLeft className="h-4 w-4" />
            返回绘本首页
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-2" style={{ color: C.ink }}>
            📚 故事馆
          </h1>
          <p className="text-sm md:text-base" style={{ color: "#57534E" }}>
            共 <span className="font-bold" style={{ color: C.amber }}>{allStories.length}</span> 个故事 ·{" "}
            <span className="font-bold" style={{ color: C.bamboo }}>{series.length}</span> 大系列
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-16">
        {/* 搜索栏 */}
        <div className="bg-white rounded-2xl p-4 shadow-md -mt-6 mb-6 relative z-10">
          <form className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: C.amber }} />
              <input
                type="text"
                name="q"
                defaultValue={searchQuery}
                placeholder="搜索故事标题、角色、标签..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm focus:outline-none transition-colors"
                style={{ background: `${C.amber}10`, border: `1px solid ${C.amber}30` }}
              />
              {searchQuery && (
                <Link
                  href={activeSeries === "all" ? "/picturebook/stories" : `/picturebook/stories?series=${encodeURIComponent(activeSeries)}`}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </Link>
              )}
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-white font-medium text-sm shadow hover:scale-105 transition-transform"
              style={{ background: `linear-gradient(135deg, ${C.amber} 0%, ${C.orange} 100%)` }}
            >
              搜索
            </button>
          </form>
        </div>

        {/* 系列筛选 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4" style={{ color: C.ink }} />
            <span className="text-sm font-medium" style={{ color: C.ink }}>
              按系列筛选
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/picturebook/stories"
              className={`text-sm px-3 py-1.5 rounded-full transition-all border-2 ${
                activeSeries === "all" ? "shadow-md" : "border-transparent hover:bg-gray-50"
              }`}
              style={
                activeSeries === "all"
                  ? { background: C.amber, color: "white", borderColor: C.amber }
                  : { background: `${C.amber}15`, color: C.amber }
              }
            >
              全部 ({allStories.length})
            </Link>
            {series.map((s) => {
              const count = allStories.filter((x) => x.series === s.name).length;
              if (count === 0) return null;
              const color = getSeriesColor(s.name);
              return (
                <Link
                  key={s.id}
                  href={`/picturebook/stories?series=${encodeURIComponent(s.name)}`}
                  className={`text-sm px-3 py-1.5 rounded-full transition-all border-2 ${
                    activeSeries === s.name ? "shadow-md" : "border-transparent hover:bg-gray-50"
                  }`}
                  style={
                    activeSeries === s.name
                      ? { background: color, color: "white", borderColor: color }
                      : { background: `${color}15`, color: color }
                  }
                >
                  {s.name} ({count})
                </Link>
              );
            })}
          </div>
        </div>

        {/* 进度信息 */}
        {totalFiltered > PER_PAGE && (
          <div className="flex items-center justify-between mb-4 text-xs" style={{ color: "#7A6F65" }}>
            <span>第 {showingStart}-{showingEnd} 条，共 {totalFiltered} 个故事</span>
            <span>第 {safePage}/{totalPages} 页</span>
          </div>
        )}

        {/* 精选故事 */}
        {featuredStories.length > 0 && searchQuery === "" && activeSeries === "all" && safePage === 1 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: C.ink }}>
              <Sparkles className="h-5 w-5" style={{ color: C.amber }} />
              精选上线
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {featuredStories.map((story) => {
                const color = getSeriesColor(story.series);
                return (
                  <Link
                    key={story.id}
                    href={`/picturebook/stories/${story.id}`}
                    className="group"
                  >
                    <div
                      className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg group-hover:scale-105 group-hover:shadow-2xl transition-all"
                      style={{ background: color }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getCover(story)}
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow"
                          style={{ background: color }}
                        >
                          {story.series}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-gray-800 shadow">
                          {story.status === "已上线" ? "免费" : story.status}
                        </span>
                      </div>
                    </div>
                    <h3 className="mt-2 text-sm font-bold line-clamp-1" style={{ color: C.ink }}>
                      {story.title}
                    </h3>
                    <p className="text-xs flex items-center gap-2" style={{ color: "#7A6F65" }}>
                      <Star className="h-3 w-3" style={{ color: C.amber, fill: C.amber }} />
                      <span>{story.age}</span> · <Clock className="h-3 w-3" /> <span>{story.time}分钟</span>
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* 故事网格 */}
        {paginatedStories.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <span className="text-6xl mb-4 block">📖</span>
            <p className="text-base mb-2" style={{ color: C.ink }}>
              暂无匹配的故事
            </p>
            <p className="text-sm" style={{ color: "#7A6F65" }}>
              {searchQuery ? `没有找到 "${searchQuery}" 相关内容` : "该系列的故事正在制作中"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(searchQuery || activeSeries !== "all" || safePage > 1 ? paginatedStories : normalStories).map((story) => {
              const color = getSeriesColor(story.series);
              return (
                <Link
                  key={story.id}
                  href={`/picturebook/stories/${story.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <div
                    className="relative aspect-[3/4] overflow-hidden"
                    style={{ background: color }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getCover(story)}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                    <div className="absolute top-2 left-2">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                        style={{ background: color }}
                      >
                        {story.series}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold line-clamp-1 mb-1" style={{ color: C.ink }}>
                      {story.title}
                    </h3>
                    <p className="text-xs line-clamp-2 mb-2" style={{ color: "#7A6F65" }}>
                      {story.desc}
                    </p>
                    <div className="flex items-center gap-2 text-[10px]" style={{ color: "#A8A29E" }}>
                      <span className="inline-flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {story.chars.slice(0, 2).join("、")}
                        {story.chars.length > 2 ? "..." : ""}
                      </span>
                      <span>·</span>
                      <span>{story.pages}页</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* 翻页 */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {safePage > 1 ? (
              <Link
                href={urlParams({ page: String(safePage - 1) })}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium shadow hover:scale-105 transition-all"
                style={{ background: "white", color: C.ink, border: `1px solid ${C.ink}20` }}
              >
                <ChevronLeft className="h-4 w-4" />
                上一页
              </Link>
            ) : (
              <span
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-sm cursor-not-allowed"
                style={{ background: "white", color: "#A8A29E" }}
              >
                <ChevronLeft className="h-4 w-4" />
                上一页
              </span>
            )}

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => {
                const p = i + 1;
                if (
                  p === 1 ||
                  p === totalPages ||
                  (p >= safePage - 2 && p <= safePage + 2)
                ) {
                  return (
                    <Link
                      key={p}
                      href={urlParams({ page: p > 1 ? String(p) : undefined })}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                        p === safePage ? "shadow-md" : "hover:scale-105"
                      }`}
                      style={
                        p === safePage
                          ? { background: C.amber, color: "white" }
                          : { background: "white", color: C.ink }
                      }
                    >
                      {p}
                    </Link>
                  );
                }
                if (p === safePage - 3 || p === safePage + 3) {
                  return (
                    <span key={p} className="w-9 h-9 flex items-center justify-center" style={{ color: "#A8A29E" }}>
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
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium shadow hover:scale-105 transition-all"
                style={{ background: "white", color: C.ink, border: `1px solid ${C.ink}20` }}
              >
                下一页
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <span
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-sm cursor-not-allowed"
                style={{ background: "white", color: "#A8A29E" }}
              >
                下一页
                <ChevronRight className="h-4 w-4" />
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
