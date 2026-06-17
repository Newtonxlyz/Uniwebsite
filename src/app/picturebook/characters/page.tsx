import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { characters } from "@/content/picturebook";

export const metadata = {
  title: "角色屋 · 雷迪嘎嘎绘本世界",
  description: "认识雷迪嘎嘎绘本世界里的12个角色",
};

export default function CharactersPage() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] pt-20 px-6 pb-16">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <Link href="/picturebook" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            返回绘本首页
          </Link>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span>🎭</span>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              角色屋
            </span>
          </h1>
          <p className="mt-2 text-gray-400">认识雷迪嘎嘎和他的朋友们</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((char) => (
            <Link key={char.id}
              href={`/picturebook/characters/${char.id}`}
              className="glass-card p-6 group hover:border-white/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className={`text-5xl rounded-xl p-3 bg-gradient-to-br ${char.color} shadow-lg`}>
                  {char.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                    {char.name}
                  </h2>
                  <p className="text-sm text-gray-400">{char.name_en}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                      {char.species}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                      {char.storyCount}个故事
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">{char.role}</p>
              <p className="text-sm text-gray-400 mt-2 line-clamp-2">{char.description}</p>
              <div className="mt-3 text-xs text-gray-500">
                <span className="font-medium text-gray-400">特征：</span>
                {char.key_features}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
