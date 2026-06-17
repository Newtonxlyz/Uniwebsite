"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";

type SearchablePage = {
  title: string;
  desc: string;
  href: string;
  category: string;
};

export function WikiSearch({ pages }: { pages: SearchablePage[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return pages
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.desc.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query, pages]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索知识库内容（标题、描述、分类）..."
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.07] transition-colors"
        />
      </div>

      {/* 搜索结果下拉 */}
      {query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-card p-2 z-10 max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <div className="text-center py-6 text-sm text-gray-500">
              没有找到匹配 "{query}" 的内容
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((r) => (
                <a
                  key={r.href}
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-white/90 group-hover:text-white font-medium truncate">
                        {r.title}
                      </div>
                      {r.desc && (
                        <div className="text-xs text-gray-500 truncate mt-0.5">
                          {r.desc}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 flex-shrink-0">
                      {r.category}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
