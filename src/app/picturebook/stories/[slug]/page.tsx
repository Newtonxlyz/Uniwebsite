import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, Users, Layers } from "lucide-react";
import { characters } from "@/content/picturebook";
import { getStoryById } from "@/content/picturebook/story-data";
import StoryReader from "@/components/story-reader";
import TextOnlyReader from "@/components/text-only-reader";

export const dynamic = "force-dynamic";

function getReaderPages(story: {
  text?: { page: number; body: string }[];
  image_dir?: string | null;
}) {
  if (!story.text || !story.image_dir) return [];
  return story.text.map((t) => ({
    page_number: t.page,
    text: t.body,
    image: `/picturebook/stories/${story.image_dir}/page_${String(t.page).padStart(2, "0")}.png`,
  }));
}

type Params = Promise<{ slug: string }>;

export default async function StoryDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const story = await getStoryById(slug);
  if (!story) notFound();

  const hasIllustrations = story.illustrated && story.image_dir;
  const readerPages = hasIllustrations ? getReaderPages(story) : [];
  const hasText = story.text && story.text.length > 0;

  // Match characters to their profile links
  const storyChars = story.chars
    .map((name) => {
      const ch = characters.find((x) => x.name === name);
      return ch ? { name, id: ch.id, slug: ch.id } : { name, id: "", slug: "" };
    })
    .filter((c) => c.id);

  return (
    <div className="min-h-screen bg-[#0a0a1a] pt-20 px-6 pb-16">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/picturebook"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          返回绘本首页
        </Link>

        {/* Story Header */}
        <div className="glass-card p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="text-6xl">{story.emoji}</div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {story.title}
              </h1>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-sm px-3 py-1 rounded-full bg-amber-500/20 text-amber-300">
                  {story.series}
                </span>
                <span className="text-sm px-3 py-1 rounded-full bg-white/10 text-gray-300">
                  {story.age}
                </span>
                <span className="text-sm px-3 py-1 rounded-full bg-white/10 text-gray-300">
                  {story.pages}页 / {story.time}分钟
                </span>
                <span
                  className={`text-sm px-3 py-1 rounded-full ${
                    hasIllustrations
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-amber-500/20 text-amber-300"
                  }`}
                >
                  {hasIllustrations ? "\u5df2\u4e0a\u7ebf" : "\u5373\u5c06\u4e0a\u7ebf"}
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed">{story.desc}</p>
            </div>
          </div>

          {/* Characters */}
          {storyChars.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap gap-2">
              {storyChars.map((c) => (
                <Link
                  key={c.id}
                  href={`/picturebook/characters/${c.slug}`}
                  className="text-sm px-3 py-1 rounded-full bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}

          {/* Tags */}
          {story.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {story.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-500"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content: Illustrated Reader, Text-Only Reader, or Coming Soon */}
        {hasIllustrations && readerPages.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <span>📖</span> 互动阅读器
            </h2>
            <StoryReader title={story.title} pages={readerPages} />
          </div>
        ) : hasText ? (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <span>📖</span> 故事文本
            </h2>
            <TextOnlyReader title={story.title} pages={story.text!} />
          </div>
        ) : (
          <div className="glass-card p-16 text-center mb-8">
            <div className="text-6xl mb-6 animate-float">🎨</div>
            <h2 className="text-2xl font-semibold text-white mb-3">
              绘图制作中
            </h2>
            <p className="text-gray-400 max-w-md mx-auto">
              这个故事的插图正在画师们的工作台上待完成。敬请期待！
            </p>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="text-center">
                <span className="text-2xl block mb-1">{story.pages}</span>
                页插图
              </div>
              <div className="text-center">
                <span className="text-2xl block mb-1">{story.chars.length}</span>
                个角色
              </div>
              <div className="text-center">
                <span className="text-2xl block mb-1">{story.series}</span>
                系列
              </div>
            </div>
          </div>
        )}

        {/* Reading Modes */}
        <div className="glass-card p-6 mb-8">
          <h3 className="text-sm font-medium text-gray-300 mb-4">
            \u9605\u8bfb\u6a21\u5f0f
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(
              [
                ["\u{1F4D6}", "\u7ed8\u672c\u6a21\u5f0f", hasIllustrations ? "\u5df2\u4e0a\u7ebf" : "\u5373\u5c06\u4e0a\u7ebf"],
                ["\u{1F50A}", "\u6709\u58f0\u6a21\u5f0f", hasText ? "\u5df2\u4e0a\u7ebf" : "\u5373\u5c06\u4e0a\u7ebf"],
                ["\u{1F4DD}", "\u8ddf\u8bfb\u6a21\u5f0f", hasText ? "\u5df2\u4e0a\u7ebf" : "\u5373\u5c06\u4e0a\u7ebf"],
                ["\u{1F310}", "\u591a\u8bed\u8a00", "\u5373\u5c06\u4e0a\u7ebf"],
              ] as const
            ).map((item) => {
              const icon = item[0];
              const name = item[1];
              const status = item[2];
              return (
                <div
                  key={name}
                  className="p-4 rounded-xl bg-white/5 text-center"
                >
                  <span className="text-3xl block mb-2">{icon}</span>
                  <p className="text-sm font-medium text-white">{name}</p>
                  <span
                    className={`text-xs block mt-1 ${
                      status === "\u5df2\u4e0a\u7ebf"
                        ? "text-emerald-400"
                        : "text-amber-400"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Link
            href="/picturebook/stories"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            返回故事馆
          </Link>
          <Link
            href="/picturebook"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            绘本首页
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
