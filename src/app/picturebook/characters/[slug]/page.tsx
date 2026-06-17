import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { notFound } from "next/navigation";
import { characters, series } from "@/content/picturebook";
import type { Character } from "@/content/picturebook/types";

export function generateStaticParams() {
  return characters.map((c) => ({ slug: c.id }));
}

export default async function CharacterDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const char = characters.find((c) => c.id === slug);
  if (!char) notFound();

  const relatedSeries = series.filter(s => {
    const charNames = [char.name, char.name_en];
    return charNames.some(n => s.description.includes(n) || s.name.includes(char.name.slice(0, 2)));
  });

  return (
    <div className="min-h-screen bg-[#0a0a1a] pt-20 px-6 pb-16">
      <div className="max-w-4xl mx-auto">
        <Link href="/picturebook/characters" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          返回角色屋
        </Link>

        {/* Character Hero Card */}
        <div className={`glass-card p-8 mb-8 relative overflow-hidden`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${char.color} opacity-5`} />
          <div className="relative flex flex-col md:flex-row items-start gap-8">
            <div className={`text-8xl rounded-2xl p-6 bg-gradient-to-br ${char.color} shadow-2xl`}>
              {char.emoji}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-1">{char.name}</h1>
              <p className="text-lg text-gray-400 mb-3">{char.name_en}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-sm px-3 py-1 rounded-full bg-white/10 text-gray-300">{char.species}</span>
                <span className="text-sm px-3 py-1 rounded-full bg-white/10 text-gray-300">{char.species_en}</span>
                <span className="text-sm px-3 py-1 rounded-full bg-pink-500/20 text-pink-300">{char.role}</span>
              </div>
              <p className="text-gray-400 leading-relaxed">{char.description}</p>
            </div>
          </div>
        </div>

        {/* Personality */}
        <div className="glass-card p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">性格特点</h2>
          <p className="text-gray-400 leading-relaxed">{char.personality}</p>
        </div>

        {/* Key Features */}
        <div className="glass-card p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">标志性特征</h2>
          <p className="text-gray-400 leading-relaxed">{char.key_features}</p>
        </div>

        {/* Related Series */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">相关系列</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedSeries.length > 0 ? relatedSeries.slice(0, 4).map((s) => (
              <Link key={s.id}
                href={`/picturebook/stories?series=${s.id}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <span className="text-2xl">{s.image_emoji}</span>
                <div>
                  <p className="text-sm font-medium text-white">{s.name}</p>
                  <p className="text-xs text-gray-500">{s.count}个故事</p>
                </div>
              </Link>
            )) : (
              <p className="text-sm text-gray-500">角色出现在多个系列的故事中</p>
            )}
          </div>
          <div className="mt-6">
            <Link href={`/picturebook/stories?characters=${char.id}`}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              阅读 {char.name} 的故事
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
