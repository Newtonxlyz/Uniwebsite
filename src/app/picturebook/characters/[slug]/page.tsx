import Link from "next/link";
import { ArrowLeft, BookOpen, Star, Quote, MapPin, Heart } from "lucide-react";
import { notFound } from "next/navigation";
import { characters, series } from "@/content/picturebook";
import type { Character } from "@/content/picturebook/types";

const R2 = "https://media.lvyz.org/picturebook-source";

const CHAR_IMG: Record<string, string> = {
  "lady-gaga": `${R2}/hero-ladigaga.jpg`,
  "gababa": `${R2}/char-gababa.png`,
  "gayaya": `${R2}/char-gayaya.png`,
  "gugu": `${R2}/char-gugu.png`,
  "youyou": `${R2}/char-youyou.png`,
};

const SPECIES_COLORS: Record<string, string> = {
  "乌鸦": "#2A2420",
  "白乌鸦": "#D4778C",
  "猫头鹰": "#5B6BC8",
  "白兔": "#E8A4B8",
};

const PAPER = "#FAF8F5";
const INK = "#2A2420";

// 性格标签提取（逗号/顿号分割）
function parseFeatures(s: string): string[] {
  return s.split(/[,，、;；]/).map((s) => s.trim()).filter(Boolean);
}

export function generateStaticParams() {
  return characters.map((c) => ({ slug: c.id }));
}

export default async function CharacterDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const char = characters.find((c) => c.id === slug);
  if (!char) notFound();

  const color = SPECIES_COLORS[char.species] || "#D4A03D";
  const img = CHAR_IMG[char.id];
  const features = parseFeatures(char.key_features);
  const personalityTraits = parseFeatures(char.personality);

  const relatedSeries = series.filter((s) => {
    const charNames = [char.name, char.name_en];
    return charNames.some(
      (n) => s.description.includes(n) || s.name.includes(char.name.slice(0, 2))
    );
  });

  return (
    <div className="min-h-screen pt-16" style={{ background: PAPER }}>
      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${color}25 0%, ${PAPER} 50%, ${color}15 100%)`,
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-10">
          <Link
            href="/picturebook/characters"
            className="inline-flex items-center gap-2 text-sm mb-4 transition-colors"
            style={{ color: INK }}
          >
            <ArrowLeft className="h-4 w-4" />
            返回角色屋
          </Link>

          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
            {/* 顶部色块 + 立绘 */}
            <div
              className="h-40 relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}90 100%)` }}
            >
              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img}
                  alt={char.name}
                  className="absolute right-4 bottom-0 h-44 w-auto object-contain drop-shadow-2xl"
                />
              ) : (
                <div className="absolute right-6 bottom-0 text-9xl">{char.emoji}</div>
              )}
              <div className="absolute top-4 left-4">
                <span className="text-xs px-3 py-1 rounded-full bg-white/90 font-bold" style={{ color }}>
                  {char.role}
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-1" style={{ color: INK }}>
                {char.name}
              </h1>
              <p className="text-base mb-4" style={{ color: "#7A6F65" }}>
                {char.name_en}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className="text-xs px-3 py-1 rounded-full text-white font-medium"
                  style={{ background: color }}
                >
                  {char.species}
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100" style={{ color: "#57534E" }}>
                  {char.species_en}
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100" style={{ color: "#57534E" }}>
                  出现在 {char.storyCount} 个故事
                </span>
              </div>
              <p className="text-base leading-relaxed" style={{ color: "#57534E" }}>
                {char.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 详情内容 */}
      <div className="max-w-5xl mx-auto px-6 pb-16 space-y-6">
        {/* 性格特点 */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: INK }}>
            <Heart className="h-5 w-5" style={{ color }} />
            性格特点
          </h2>
          <div className="flex flex-wrap gap-2">
            {personalityTraits.length > 0 ? (
              personalityTraits.map((trait, i) => (
                <span
                  key={i}
                  className="text-sm px-3 py-1.5 rounded-full font-medium"
                  style={{ background: `${color}15`, color }}
                >
                  {trait}
                </span>
              ))
            ) : (
              <p className="text-sm" style={{ color: "#7A6F65" }}>{char.personality}</p>
            )}
          </div>
        </div>

        {/* 标志性特征 */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: INK }}>
            <Star className="h-5 w-5" style={{ color }} />
            标志性特征
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {features.length > 0 ? (
              features.map((feat, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl text-sm text-center"
                  style={{ background: `${color}08`, color: INK }}
                >
                  {feat}
                </div>
              ))
            ) : (
              <p className="text-sm col-span-3" style={{ color: "#7A6F65" }}>
                {char.key_features}
              </p>
            )}
          </div>
        </div>

        {/* 经典语录 */}
        {char.quote && (
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: INK }}>
              <Quote className="h-5 w-5" style={{ color }} />
              经典语录
            </h2>
            <blockquote
              className="p-4 rounded-xl italic text-base"
              style={{
                background: `${color}08`,
                borderLeft: `4px solid ${color}`,
                color: INK,
              }}
            >
              "{char.quote}"
            </blockquote>
            <p className="text-xs mt-2" style={{ color: "#7A6F65" }}>
              —— {char.name}
            </p>
          </div>
        )}

        {/* 相关系列 */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5" style={{ color }} />
            <h2 className="text-xl font-semibold" style={{ color: INK }}>
              相关系列
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedSeries.length > 0 ? (
              relatedSeries.slice(0, 4).map((s) => (
                <Link
                  key={s.id}
                  href={`/picturebook/stories?series=${s.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-105"
                  style={{ background: `${color}08`, border: `1px solid ${color}20` }}
                >
                  <span className="text-2xl">{s.image_emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: INK }}>
                      {s.name}
                    </p>
                    <p className="text-xs" style={{ color: "#7A6F65" }}>
                      {s.count} 个故事
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm col-span-2" style={{ color: "#7A6F65" }}>
                角色出现在多个系列的故事中
              </p>
            )}
          </div>
          <div className="mt-6 text-center">
            <Link
              href={`/picturebook/stories?characters=${char.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium shadow-lg hover:scale-105 transition-all"
              style={{
                background: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)`,
              }}
            >
              <MapPin className="h-4 w-4" />
              阅读 {char.name} 的故事
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
