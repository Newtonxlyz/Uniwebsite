import Link from "next/link";
import { ArrowLeft, Users, BookOpen, Sparkles } from "lucide-react";
import { characters, series } from "@/content/picturebook";

export const metadata = {
  title: "雷迪嘎嘎绘本世界 · Lvyz",
  description: "1840个雷迪嘎嘎系列绘本故事，水墨×低多边形独特画风，3-10岁儿童亲子共读",
};

export default function PictureBookPage() {
  const topSeries = series.filter(s => s.priority === 0);
  const restSeries = series.filter(s => s.priority >= 1);
  const featuredCharacters = characters.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 glass-nav px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Lvyz</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/picturebook/characters" className="text-sm text-gray-400 hover:text-white transition-colors">角色屋</Link>
            <Link href="/picturebook/stories" className="text-sm text-gray-400 hover:text-white transition-colors">故事馆</Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 text-center relative">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <span className="text-7xl inline-block animate-bounce-slow">🐦‍⬛</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
                雷迪嘎嘎绘本世界
              </span>
            </h1>
            <p className="text-2xl text-gray-400 mb-3 italic">
              "一只乌鸦的千个故事"
            </p>
            <p className="text-gray-500 mb-10 max-w-xl mx-auto">
              水墨×低多边形独特画风 · 1840个故事 · 3-10岁亲子共读
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/picturebook/stories" className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300">
                开始阅读
              </Link>
              <Link href="/picturebook/characters" className="px-8 py-3 rounded-full border border-white/20 text-white/80 hover:bg-white/5 transition-all duration-300">
                认识角色
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Stories - Phase 0 */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="h-6 w-6 text-amber-400" />
              <h2 className="text-2xl font-bold text-white">精选上线故事</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 乌鸦喝水系列 */}
              {["本领", "智慧", "友情", "创新"].map((title, i) => (
                <Link key={i}
                  href={`/picturebook/stories/drinking-water-${i + 1}`}
                  className="glass-card p-6 group hover:border-pink-500/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">💧</span>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-pink-400 transition-colors">
                        乌鸦喝水 · {title}
                      </h3>
                      <p className="text-xs text-gray-500">20页 · 亲子共读</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    经典寓言新编，雷迪嘎嘎版本的乌鸦喝水故事。{title}的冒险从这里开始。
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300">已上线</span>
                    <span className="text-xs text-gray-500">#乌鸦喝水系列</span>
                  </div>
                </Link>
              ))}

              {/* 黑黑的洞穴我不怕 */}
              <Link href="/picturebook/stories/dark-cave"
                className="glass-card p-6 group hover:border-pink-500/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">💝</span>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-pink-400 transition-colors">
                      黑黑的洞穴我不怕
                    </h3>
                    <p className="text-xs text-gray-500">20页 · 情感引导 · 3-8岁</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2">
                  噶丫丫害怕黑暗的洞穴，雷迪嘎嘎如何帮助她克服恐惧？一个关于勇气的温暖故事。
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">即将上线</span>
                  <span className="text-xs text-gray-500">#情感引导系列</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Character Wall */}
        <section className="py-16 px-6 bg-white/[0.02]">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Users className="h-6 w-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">角色屋</h2>
              <Link href="/picturebook/characters" className="ml-auto text-sm text-gray-400 hover:text-white transition-colors">
                查看全部 →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredCharacters.map((char) => (
                <Link key={char.id}
                  href={`/picturebook/characters/${char.id}`}
                  className="glass-card p-4 text-center group hover:border-white/30 transition-all duration-300"
                >
                  <div className="text-4xl mb-2">{char.emoji}</div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors truncate">
                    {char.name}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">{char.species}</p>
                  <p className="text-xs text-gray-600 mt-1">{char.storyCount}个故事</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Series Grid */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="h-6 w-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">故事馆</h2>
              <Link href="/picturebook/stories" className="ml-auto text-sm text-gray-400 hover:text-white transition-colors">
                浏览全部 →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topSeries.map((s) => (
                <Link key={s.id}
                  href={`/picturebook/stories?series=${s.id}`}
                  className="glass-card p-5 group hover:border-white/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{s.image_emoji}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold truncate ${s.color} group-hover:brightness-110`}>
                        {s.name}
                      </h3>
                      <p className="text-xs text-gray-500">{s.count}个故事</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">{s.description}</p>
                </Link>
              ))}
            </div>

            <details className="mt-6">
              <summary className="text-sm text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">
                还有 {restSeries.length} 个系列
              </summary>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {restSeries.map((s) => (
                  <Link key={s.id}
                    href={`/picturebook/stories?series=${s.id}`}
                    className="glass-card p-4 group hover:border-white/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{s.image_emoji}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold text-sm truncate ${s.color}`}>
                          {s.name}
                        </h3>
                        <p className="text-xs text-gray-500">{s.count}个故事</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </details>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 px-6 border-t border-white/5 text-center">
          <p className="text-sm text-gray-600">
            🐦 雷迪嘎嘎绘本世界 · 一只乌鸦的千个故事
          </p>
          <p className="text-xs text-gray-700 mt-2">
            水墨×低多边形 独特画风 · 面向3-10岁儿童
          </p>
        </footer>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
