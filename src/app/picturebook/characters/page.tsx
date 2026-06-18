import Link from "next/link";
import { ArrowLeft, Users, Star, Sparkles } from "lucide-react";
import { characters } from "@/content/picturebook";

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
};

const R2 = "https://media.lvyz.org/picturebook-source";

const CHAR_IMG: Record<string, string> = {
  "lady-gaga": `${R2}/hero-ladigaga.jpg`,
  "gababa": `${R2}/char-gababa.png`,
  "gayaya": `${R2}/char-gayaya.png`,
  "gugu": `${R2}/char-gugu.png`,
  "youyou": `${R2}/char-youyou.png`,
};

const SPECIES_COLORS: Record<string, string> = {
  "乌鸦": C.ink,
  "白乌鸦": C.rose,
  "猫头鹰": C.indigo,
  "白兔": C.cherry,
};

export const metadata = {
  title: "角色屋 · 雷迪嘎嘎绘本世界",
  description: "认识雷迪嘎嘎和他的朋友们",
};

export default function CharactersPage() {
  return (
    <div className="min-h-screen pt-16" style={{ background: `linear-gradient(180deg, ${C.paper} 0%, #FCE7F3 100%)` }}>
      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${C.wisteria}30 0%, ${C.rose}30 100%)` }}
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
          <div className="flex items-center gap-3 mb-2">
            <span className="text-5xl">🐦‍⬛</span>
            <h1 className="text-3xl md:text-5xl font-bold" style={{ color: C.ink }}>
              角色屋
            </h1>
          </div>
          <p className="text-sm md:text-base" style={{ color: "#57534E" }}>
            认识 <span className="font-bold" style={{ color: C.wisteria }}>{characters.length}</span> 个角色 ·
            陪伴式成长 · 完整 IP 宇宙
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-16">
        {/* 角色网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((char) => {
            const color = SPECIES_COLORS[char.species] || C.amber;
            const img = CHAR_IMG[char.id];
            return (
              <Link
                key={char.id}
                href={`/picturebook/characters/${char.id}`}
                className="group block bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all"
              >
                {/* 顶部色块 */}
                <div
                  className="h-32 relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)` }}
                >
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={img}
                      alt={char.name}
                      className="absolute right-2 bottom-0 h-32 w-auto object-contain group-hover:scale-110 transition-transform"
                    />
                  ) : (
                    <div className="absolute right-4 bottom-0 text-7xl">
                      {char.emoji}
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/90 font-bold" style={{ color }}>
                      {char.role}
                    </span>
                  </div>
                </div>

                {/* 内容 */}
                <div className="p-5">
                  <h2 className="text-xl font-bold mb-1" style={{ color: C.ink }}>
                    {char.name}
                  </h2>
                  <p className="text-xs mb-2" style={{ color: "#7A6F65" }}>
                    {char.name_en}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: `${color}15`, color: color }}
                    >
                      {char.species}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full bg-gray-100"
                      style={{ color: "#7A6F65" }}
                    >
                      {char.storyCount}个故事
                    </span>
                  </div>
                  <p className="text-sm line-clamp-2 mb-3" style={{ color: "#57534E" }}>
                    {char.description}
                  </p>
                  <div
                    className="text-xs p-2 rounded-xl border-l-4"
                    style={{ background: `${C.amber}08`, color: "#7A6F65", borderColor: C.amber }}
                  >
                    <span className="font-medium" style={{ color: C.amber }}>特征：</span>
                    {char.key_features}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
