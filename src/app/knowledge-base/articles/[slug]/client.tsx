"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";

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

export default function KnowledgeArticleClient({ slug }: { slug: string }) {
  const router = useRouter();
  const [state, setState] = useState<"loading" | "notfound" | "ready" | "error">("loading");
  const [entry, setEntry] = useState<Entry | null>(null);
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    async function load() {
      try {
        const idxRes = await fetch("/knowledge/search-index.json", { cache: "no-store" });
        if (!idxRes.ok) throw new Error(`index HTTP ${idxRes.status}`);
        const idx: SearchIndex = await idxRes.json();
        if (cancelled) return;
        const e = idx.entries.find((x) => x.slug === slug);
        if (!e) {
          setState("notfound");
          return;
        }
        setEntry(e);

        // e.url 形如 /knowledge/<slug> 或 /wiki/<file>，fetch 时补 .html
        const fetchUrl = e.url.endsWith(".html") ? e.url : e.url + ".html";
        const htmlRes = await fetch(fetchUrl, { cache: "no-store" });
        if (!htmlRes.ok) throw new Error(`html HTTP ${htmlRes.status} (${fetchUrl})`);
        const text = await htmlRes.text();
        if (cancelled) return;
        setHtml(text);
        setState("ready");
      } catch (err) {
        console.error("Article load error:", err);
        if (!cancelled) setState("error");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (state === "loading") {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        加载文章中...
      </div>
    );
  }

  if (state === "notfound") {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <p>文章不存在：{slug}</p>
          <Link href="/knowledge-base" className="text-cyan-400 mt-2 inline-block hover:underline">
            ← 返回知识库
          </Link>
        </div>
      </div>
    );
  }

  if (state === "error" || !entry) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <p>加载失败</p>
          <button
            onClick={() => router.refresh()}
            className="text-cyan-400 mt-2 hover:underline"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 flex flex-col" style={{ height: "100vh" }}>
      <header className="glass-nav border-b border-white/10 px-6 py-3 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Link
              href="/knowledge-base"
              className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              返回知识库
            </Link>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-white truncate">{entry.title}</h1>
              <div className="text-xs text-gray-500 truncate">
                {entry.categoryLabel} · {(entry.size / 1024).toFixed(1)} KB
              </div>
            </div>
          </div>
          <a
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <FileText className="h-3 w-3" />
            原始 HTML
          </a>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        {html ? (
          <iframe
            srcDoc={html}
            className="w-full h-full bg-white"
            sandbox="allow-same-origin allow-scripts"
            title={entry.title}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            加载内容中...
          </div>
        )}
      </div>
    </div>
  );
}
