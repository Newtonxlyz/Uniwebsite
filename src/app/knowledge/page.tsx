"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Script from "next/script";
import { ArrowLeft, Database, Search, FileText, Folder, X } from "lucide-react";

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

declare global {
  interface Window {
    Fuse?: any;
  }
}

export default function KnowledgeBrowser() {
  const [index, setIndex] = useState<SearchIndex | null>(null);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [fuseReady, setFuseReady] = useState(false);

  // Load search index
  useEffect(() => {
    fetch("/knowledge/search-index.json")
      .then((r) => r.json())
      .then((d) => setIndex(d))
      .catch((e) => console.error("Failed to load search index:", e));
  }, []);

  // Mark Fuse as ready when window.Fuse is available
  useEffect(() => {
    if (typeof window !== "undefined" && window.Fuse) {
      setFuseReady(true);
    }
  }, []);

  const fuse = useMemo(() => {
    if (!index || !window.Fuse) return null;
    return new window.Fuse(index.entries, {
      keys: [
        { name: "title", weight: 0.5 },
        { name: "excerpt", weight: 0.3 },
        { name: "categoryLabel", weight: 0.2 },
      ],
      threshold: 0.4,
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
    if (query && fuse) {
      const searchResults = fuse.search(query) as FuseResult<Entry>[];
      // Apply category filter on top of fuse results
      const slugs = new Set(searchResults.map((r) => r.item.slug));
      result = result.filter((e) => slugs.has(e.slug));
      // Preserve fuse ranking
      const rank = new Map(searchResults.map((r, i) => [r.item.slug, i]));
      result.sort((a, b) => (rank.get(a.slug) ?? 0) - (rank.get(b.slug) ?? 0));
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
      <div className="min-h-screen pt-20 px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-3"
            >
              <ArrowLeft className="h-4 w-4" />
              返回首页
            </Link>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Database className="h-8 w-8 text-cyan-400" />
              <span className="text-gradient">TEBS 技术知识库</span>
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              约束系统 · 碰撞分析 · 零部件 · C-NCAP / C-IASI · 共 {index.total} 篇技术文档 / {categories.length} 个类别
            </p>
          </header>

          {/* Search box */}
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
            {/* Category chips */}
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

          {/* Result count */}
          <div className="text-xs text-gray-500 mb-3">
            {query || activeCat
              ? `找到 ${filtered.length} 篇${query ? `包含 "${query}"` : ""}${activeCat ? `（${categories.find((c) => c.key === activeCat)?.label}）` : ""}`
              : `共 ${index.total} 篇`}
          </div>

          {/* Article list */}
          {filtered.length === 0 ? (
            <div className="glass-card p-8 text-center text-gray-400">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>没有匹配的文章</p>
              <p className="text-xs mt-2">试试其他关键词或清除筛选</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((a) => (
                <Link
                  key={a.slug}
                  href={a.url}
                  className="glass-card p-4 hover:scale-[1.02] transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                          {highlightMatch(a.title, query)}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <Folder className="h-3 w-3" />
                        <span>{a.categoryLabel}</span>
                        <span>·</span>
                        <span>{(a.size / 1024).toFixed(1)} KB</span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2">
                        {highlightMatch(a.excerpt, query)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
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