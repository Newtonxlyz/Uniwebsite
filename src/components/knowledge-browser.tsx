"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Script from "next/script";
import { ArrowLeft, Database, Search, FileText, Folder, X, ExternalLink } from "lucide-react";

interface Entry {
  slug: string;
  title: string;
  category: string;
  categoryLabel: string;
  excerpt: string;
  size: number;
  url: string;
}

interface SearchIndex {
  entries: Entry[];
  total: number;
}

interface FuseResult<T> {
  item: T;
  score?: number;
}

interface LegacyLink {
  title: string;
  desc?: string;
  href: string;
  category: string;
  icon?: "core" | "site-map" | "other";
}

declare global {
  interface Window {
    Fuse?: any;
  }
}

export default function KnowledgeBrowser({
  initialIndex,
  legacyLinks = [],
}: {
  initialIndex?: SearchIndex;
  legacyLinks?: LegacyLink[];
}) {
  const [index, setIndex] = useState<SearchIndex | null>(initialIndex || null);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [fuseReady, setFuseReady] = useState(false);

  // 如果没传 initialIndex，从 /knowledge/search-index.json 拉
  useEffect(() => {
    if (initialIndex) return;
    fetch("/knowledge/search-index.json")
      .then((r) => r.json())
      .then((d) => setIndex(d))
      .catch((e) => console.error("Failed to load search index:", e));
  }, [initialIndex]);

  // Mark Fuse ready
  useEffect(() => {
    if (typeof window !== "undefined" && window.Fuse) {
      setFuseReady(true);
    }
  }, []);

  const fuse = useMemo(() => {
    if (!index || !window.Fuse) return null;
    return new window.Fuse(index.entries, {
      keys: [
        { name: "title", weight: 0.35 },
        { name: "excerpt", weight: 0.5 },
        { name: "categoryLabel", weight: 0.15 },
      ],
      threshold: 0.45,
      ignoreLocation: true,
      includeScore: true,
      minMatchCharLength: 2,
    });
  }, [index, fuseReady]);

  const categories = useMemo(() => {
    if (!index) return [];
    const map = new Map<string, { key: string; label: string; count: number }>();
    for (const e of index.entries) {
      const existing = map.get(e.category);
      if (existing) existing.count++;
      else map.set(e.category, { key: e.category, label: e.categoryLabel, count: 1 });
    }
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label, "zh"));
  }, [index]);

  const filtered = useMemo(() => {
    if (!index) return [];
    let result: Entry[] = index.entries;
    if (activeCat) {
      result = result.filter((e) => e.category === activeCat);
    }
    if (query) {
      const q = query.toLowerCase();

      // Step 1: Fuse fuzzy search
      const fuseResults = fuse ? (fuse.search(query) as FuseResult<Entry>[]) : [];
      const fuseItems = fuseResults.map((r) => r.item);

      // Step 2: Substring fallback
      const substringResults = index.entries.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.excerpt.toLowerCase().includes(q) ||
          e.categoryLabel.toLowerCase().includes(q)
      );

      // Combine: Fuse results first, then substring-only
      const seen = new Set(fuseItems.map((e) => e.slug));
      const onlySubstring = substringResults.filter((e) => !seen.has(e.slug));
      result = [...fuseItems, ...onlySubstring];

      if (activeCat) {
        result = result.filter((e) => e.category === activeCat);
      }
    }
    return result;
  }, [index, query, activeCat, fuse]);

  if (!index) {
    return (
      <div className="min-h-screen pt-20 px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-gray-400">加载索引中...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.min.js"
        strategy="afterInteractive"
        onLoad={() => setFuseReady(true)}
      />
      <div className="min-h-screen pt-4 px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* 旧 wiki 跳转入口 */}
          {legacyLinks.length > 0 && (
            <section className="glass-card p-4 mb-4">
              <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                <Database className="h-4 w-4" />
                旧 wiki 入口（保留跳转）
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {legacyLinks.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs text-gray-300 hover:text-white"
                  >
                    <ExternalLink className="h-3 w-3 flex-shrink-0 text-cyan-400" />
                    <span className="truncate">{l.title}</span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* 搜索框 */}
          <div className="glass-card p-4 mb-4 sticky top-16 z-10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索文章（标题 / 内容 / 类别）..."
                className="flex-1 bg-transparent text-white placeholder:text-gray-500 outline-none text-base"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {/* 分类 chips */}
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={() => setActiveCat(null)}
                className={`text-xs px-3 py-1 rounded-full transition-colors ${
                  activeCat === null
                    ? "bg-cyan-500 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                全部 ({index.total})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCat(cat.key)}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${
                    activeCat === cat.key
                      ? "bg-cyan-500 text-white"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              ))}
            </div>
          </div>

          {/* 计数 */}
          <div className="text-xs text-gray-500 mb-4">
            {query || activeCat
              ? `找到 ${filtered.length} 篇${query ? `包含 "${query}"` : ""}${activeCat ? `（${categories.find((c) => c.key === activeCat)?.label}）` : ""}`
              : `共 ${index.total} 篇 · 按类别浏览`}
          </div>

          {/* 文章列表 */}
          {filtered.length === 0 ? (
            <div className="glass-card p-8 text-center text-gray-400">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>没有匹配的文章</p>
              <p className="text-xs mt-2">试试其他关键词或清除筛选</p>
            </div>
          ) : query || activeCat ? (
            <FlatView entries={filtered} query={query} />
          ) : (
            <GroupedView categories={categories} entries={index.entries} />
          )}
        </div>
      </div>
    </>
  );
}

function highlightMatch(text: string, query: string) {
  if (!query || !text) return text;
  const parts: React.ReactNode[] = [];
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  let lastIndex = 0;
  let i = lowerText.indexOf(lowerQuery, lastIndex);
  let key = 0;
  while (i !== -1) {
    if (i > lastIndex) {
      parts.push(text.substring(lastIndex, i));
    }
    parts.push(
      <mark
        key={key++}
        className="bg-yellow-400/30 text-yellow-200 px-0.5 rounded"
      >
        {text.substring(i, i + query.length)}
      </mark>
    );
    lastIndex = i + query.length;
    i = lowerText.indexOf(lowerQuery, lastIndex);
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  return parts;
}

function FlatView({ entries, query }: { entries: Entry[]; query: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {entries.map((a) => (
        <Link
          key={a.slug}
          href={`/knowledge-base/articles/${a.slug}`}
          className="glass-card p-4 hover:scale-[1.02] transition-all group"
        >
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors line-clamp-2 mb-1">
                {highlightMatch(a.title, query)}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <Folder className="h-3 w-3" />
                <span>{a.categoryLabel}</span>
                <span>·</span>
                <span>{(a.size / 1024).toFixed(1)} KB</span>
              </div>
              <p className="text-xs text-gray-400 line-clamp-3">
                {highlightMatch(a.excerpt, query)}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

interface CategoryInfo {
  key: string;
  label: string;
  count: number;
}

function GroupedView({ categories, entries }: { categories: CategoryInfo[]; entries: Entry[] }) {
  return (
    <>
      {categories.map((cat) => {
        const catEntries = entries.filter((e) => e.category === cat.key);
        if (catEntries.length === 0) return null;
        return (
          <section key={cat.key} className="mb-8">
            <h2 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
              <Folder className="h-4 w-4" />
              {cat.label}
              <span className="text-xs text-gray-500">({catEntries.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {catEntries.map((a) => (
                <Link
                  key={a.slug}
                  href={`/knowledge-base/articles/${a.slug}`}
                  className="glass-card p-4 hover:scale-[1.02] transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors line-clamp-2 mb-1">
                        {a.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{(a.size / 1024).toFixed(1)} KB</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}