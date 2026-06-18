import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, Star, Clock, Users, Heart, Tag, Volume2, Headphones, Type, Globe } from "lucide-react";
import { characters } from "@/content/picturebook";
import { getStoryById } from "@/content/picturebook/story-data";
import StoryReader from "@/components/story-reader";
import TextOnlyReader from "@/components/text-only-reader";

export const dynamic = "force-dynamic";

// R2 CDN 基础 URL
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "https://media.lvyz.org";

function getReaderPages(story: any) {
  if (!story.image_dir) return [];
  const textArr = story.text || [];
  const totalPages = story.pages || textArr.length || 1;

  // 优先用 page-level image（如 dark-cave 的绝对路径 /picturebook/stories/dark-cave/page_NN.png）
  if (textArr.length > 0) {
    return textArr.map((t: any, i: number) => {
      // dark-cave 风格：从 textArr 顺序映射 1-indexed 图片
      const idx = i + 1;
      const absPath = (t as any).image || `${R2_PUBLIC_URL}/picturebook/${story.image_dir}/page_${String(idx).padStart(2, "0")}.svg`;
      const finalSrc = absPath.startsWith("http") || absPath.startsWith("/")
        ? absPath
        : `${R2_PUBLIC_URL}${absPath.startsWith("/") ? "" : "/"}${absPath}`;
      return {
        page_number: t.page,
        text: t.body,
        image: finalSrc,
      };
    });
  }

  return Array.from({ length: totalPages }, (_, i) => ({
    page_number: i + 1,
    text: `第 ${i + 1} 页 · 内容待补充`,
    image: `${R2_PUBLIC_URL}/picturebook/${story.image_dir}/page_${String(i + 1).padStart(2, "0")}.svg`,
  }));
}

// 系列专属色（与 stories 页一致）
const SERIES_COLORS: Record<string, string> = {
  "成语故事": "#D4A03D",
  "诗歌故事": "#5BA4CF",
  "噶巴巴成长": "#4A9B7F",
  "噶丫丫成长": "#D4778C",
  "儿童情感引导": "#8B7EC8",
  "科普系列": "#3D9B8F",
  "俚语歇后语": "#E8923A",
  "思念母亲": "#E8A4B8",
  "起源故事": "#5B6BC8",
};

const PAPER = "#FAF8F5";
const INK = "#2A2420";

type Params = Promise<{ slug: string }>;

export default async function StoryDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const story = await getStoryById(slug);
  if (!story) notFound();

  const hasIllustrations = story.illustrated && story.image_dir;
  const readerPages = hasIllustrations ? getReaderPages(story) : [];
  const hasText = story.text && story.text.length > 0;

  const seriesColor = SERIES_COLORS[story.series] || "#D4A03D";

  const storyChars = story.chars
    .map((name: string) => {
      const ch = characters.find((x) => x.name === name);
      return ch ? { name, id: ch.id, slug: ch.id } : { name, id: "", slug: "" };
    })
    .filter((c: any) => c.id);

  return (
    <div className="min-h-screen pt-16" style={{ background: PAPER }}>
      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${seriesColor}15 0%, ${PAPER} 50%, ${seriesColor}08 100%)`,
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-10">
          <Link
            href="/picturebook"
            className="inline-flex items-center gap-2 text-sm mb-4 transition-colors"
            style={{ color: INK }}
          >
            <ArrowLeft className="h-4 w-4" />
            返回绘本首页
          </Link>

          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="flex items-start gap-5">
              <div
                className="flex-shrink-0 w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${seriesColor} 0%, ${seriesColor}80 100%)`,
                }}
              >
                {story.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span
                    className="text-xs px-3 py-1 rounded-full text-white font-medium"
                    style={{ background: seriesColor }}
                  >
                    {story.series}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                    {story.age}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                    {story.pages}页 / {story.time}分钟
                  </span>
                  <span
                    className={`text-xs px-3 py-1 rounded-full text-white ${
                      hasIllustrations ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  >
                    {hasIllustrations ? "已上线" : "即将上线"}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: INK }}>
                  {story.title}
                </h1>
                <p className="text-base" style={{ color: "#57534E" }}>
                  {story.desc}
                </p>
              </div>
            </div>

            {/* 角色 + 标签 */}
            {(storyChars.length > 0 || story.tags.length > 0) && (
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                {storyChars.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 mt-1 flex-shrink-0" style={{ color: seriesColor }} />
                    <div className="flex flex-wrap gap-2">
                      {storyChars.map((c: any) => (
                        <Link
                          key={c.id}
                          href={`/picturebook/characters/${c.slug}`}
                          className="text-sm px-3 py-1 rounded-full text-white font-medium hover:scale-105 transition-transform"
                          style={{ background: seriesColor }}
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {story.tags.length > 0 && (
                  <div className="flex items-start gap-2 flex-wrap">
                    <Tag className="h-4 w-4 mt-1 flex-shrink-0" style={{ color: "#A8A29E" }} />
                    {story.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "#F5F5F4", color: "#57534E" }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 阅读器 / 故事文本 */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        {hasIllustrations && readerPages.length > 0 ? (
          <div className="mb-8">
            <h2
              className="text-xl font-semibold mb-6 flex items-center gap-2"
              style={{ color: INK }}
            >
              <span>📖</span> 互动阅读器
            </h2>
            <StoryReader title={story.title} pages={readerPages} />
          </div>
        ) : hasText ? (
          <div className="mb-8">
            <h2
              className="text-xl font-semibold mb-6 flex items-center gap-2"
              style={{ color: INK }}
            >
              <span>📖</span> 故事文本
            </h2>
            <TextOnlyReader title={story.title} pages={story.text} />
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center shadow-md mb-8">
            <div className="text-6xl mb-4 animate-float">🎨</div>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: INK }}>
              绘图制作中
            </h2>
            <p className="text-sm max-w-md mx-auto" style={{ color: "#7A6F65" }}>
              这个故事的插图正在画师们的工作台上待完成。敬请期待！
            </p>
          </div>
        )}

        {/* 阅读模式 */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: INK }}>
            <Volume2 className="h-4 w-4" style={{ color: seriesColor }} />
            阅读模式
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: "📖", name: "绘本模式", status: hasIllustrations ? "已上线" : "即将上线", Icon: BookOpen },
              { icon: "🔊", name: "有声模式", status: hasText ? "已上线" : "即将上线", Icon: Volume2 },
              { icon: "📝", name: "跟读模式", status: hasText ? "已上线" : "即将上线", Icon: Type },
              { icon: "🌐", name: "多语言", status: "即将上线", Icon: Globe },
            ].map((item) => {
              const Icon = item.Icon;
              return (
                <div
                  key={item.name}
                  className="p-4 rounded-xl text-center transition-all hover:scale-105"
                  style={{
                    background: item.status === "已上线" ? `${seriesColor}15` : "#F5F5F4",
                    border: item.status === "已上线" ? `1px solid ${seriesColor}40` : "1px solid #E5E7EB",
                  }}
                >
                  <Icon
                    className="h-5 w-5 mx-auto mb-2"
                    style={{ color: item.status === "已上线" ? seriesColor : "#A8A29E" }}
                  />
                  <p className="text-sm font-medium" style={{ color: INK }}>
                    {item.name}
                  </p>
                  <span
                    className="text-xs block mt-1"
                    style={{ color: item.status === "已上线" ? "#059669" : "#F59E0B" }}
                  >
                    {item.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 底部导航 */}
        <div className="flex justify-between items-center">
          <Link
            href="/picturebook/stories"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium shadow hover:scale-105 transition-all"
            style={{ background: "white", color: INK, border: `1px solid ${INK}20` }}
          >
            <ChevronLeft className="h-4 w-4" />
            返回故事馆
          </Link>
          <Link
            href="/picturebook"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white shadow hover:scale-105 transition-all"
            style={{ background: `linear-gradient(135deg, ${seriesColor} 0%, ${seriesColor}80 100%)` }}
          >
            <BookOpen className="h-4 w-4" />
            绘本首页
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
