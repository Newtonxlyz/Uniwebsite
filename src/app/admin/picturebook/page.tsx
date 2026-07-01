"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Plus, Edit, Trash2, Search, Loader2, Eye, EyeOff, Archive } from "lucide-react";
import { cn } from "@/lib/utils";

interface Story {
  id: string;
  slug: string;
  title: string;
  series: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  pageCount: number;
  cover: string | null;
  emoji: string | null;
  createdAt: string;
  updatedAt: string;
  _count: { pages: number; characters: number };
  uploader: { name: string; email: string };
}

const STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  DRAFT: { label: "草稿", bg: "#F59E0B15", color: "#F59E0B" },
  PUBLISHED: { label: "已发布", bg: "#10B98115", color: "#10B981" },
  ARCHIVED: { label: "已下架", bg: "#6B728015", color: "#6B7280" },
};

export default function PicturebookAdminListPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "DRAFT" | "PUBLISHED" | "ARCHIVED">("ALL");
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter !== "ALL") params.set("status", filter);
    if (search) params.set("search", search);
    const r = await fetch(`/api/admin/picturebook?${params}`);
    if (r.ok) setStories(await r.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  const del = async (id: string, title: string) => {
    if (!confirm(`确认删除「${title}」？\n所有图片/视频也会从 R2 删除，此操作不可撤销。`)) return;
    const r = await fetch(`/api/admin/picturebook/${id}`, { method: "DELETE" });
    if (r.ok) {
      alert("已删除");
      load();
    } else {
      const j = await r.json();
      alert("删除失败：" + j.error);
    }
  };

  const setStatus = async (id: string, status: string) => {
    const r = await fetch(`/api/admin/picturebook/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (r.ok) load();
  };

  return (
    <div className="min-h-screen pt-20 px-6 pb-16" style={{ background: "linear-gradient(180deg, #FFF5F7 0%, #F0F9FF 100%)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2" style={{ color: "#D4A03D" }}>
              <BookOpen className="h-7 w-7" />
              绘本管理
            </h1>
            <p className="text-sm text-gray-500 mt-1">上传 / 编辑 / 下架绘本</p>
          </div>
          <Link
            href="/admin/picturebook/upload"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium shadow hover:scale-105 transition-all"
            style={{ background: "linear-gradient(135deg, #D4A03D 0%, #E8A4B8 100%)" }}
          >
            <Plus className="h-4 w-4" />
            上传新绘本
          </Link>
        </div>

        {/* 过滤器 */}
        <div className="bg-white rounded-2xl p-4 shadow mb-4 flex flex-wrap items-center gap-3">
          <div className="flex gap-1">
            {[
              { k: "ALL", label: "全部" },
              { k: "DRAFT", label: "草稿" },
              { k: "PUBLISHED", label: "已发布" },
              { k: "ARCHIVED", label: "已下架" },
            ].map((f) => (
              <button
                key={f.k}
                onClick={() => setFilter(f.k as any)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  filter === f.k ? "text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
                style={filter === f.k ? { background: "#D4A03D" } : undefined}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
            <Search className="h-3.5 w-3.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
              placeholder="搜索标题/描述..."
              className="bg-transparent flex-1 text-sm focus:outline-none"
            />
          </div>
          <button onClick={load} className="px-3 py-1.5 rounded-lg bg-gray-100 text-sm hover:bg-gray-200">
            搜索
          </button>
        </div>

        {/* 列表 */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500 mx-auto" />
            <p className="text-sm text-gray-500 mt-2">加载中...</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">还没有绘本</p>
            <Link href="/admin/picturebook/upload" className="text-amber-600 text-sm hover:underline mt-2 inline-block">
              上传第一本 →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stories.map((s) => {
              const st = STATUS_STYLES[s.status];
              return (
                <div key={s.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all">
                  {/* 封面 */}
                  <div className="relative h-40 bg-gradient-to-br from-amber-50 to-pink-50 flex items-center justify-center">
                    {s.cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.cover} alt={s.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-6xl">{s.emoji || "📚"}</div>
                    )}
                    <div
                      className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: st.bg, color: st.color }}
                    >
                      {st.label}
                    </div>
                  </div>

                  {/* 信息 */}
                  <div className="p-4">
                    <h3 className="font-bold text-base truncate" title={s.title}>{s.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {s.series} · {s._count.pages} 页 · 上传于 {new Date(s.createdAt).toLocaleDateString("zh-CN")}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 truncate">by {s.uploader.name}</p>

                    {/* 操作 */}
                    <div className="flex items-center gap-1.5 mt-3">
                      <Link
                        href={`/admin/picturebook/${s.id}/edit`}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs bg-amber-50 text-amber-700 hover:bg-amber-100"
                      >
                        <Edit className="h-3 w-3" /> 编辑
                      </Link>
                      {s.status !== "PUBLISHED" ? (
                        <button
                          onClick={() => setStatus(s.id, "PUBLISHED")}
                          className="px-2 py-1.5 rounded-lg text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          title="发布"
                        >
                          <Eye className="h-3 w-3" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setStatus(s.id, "ARCHIVED")}
                          className="px-2 py-1.5 rounded-lg text-xs bg-gray-100 text-gray-600 hover:bg-gray-200"
                          title="下架"
                        >
                          <Archive className="h-3 w-3" />
                        </button>
                      )}
                      <button
                        onClick={() => del(s.id, s.title)}
                        className="px-2 py-1.5 rounded-lg text-xs bg-red-50 text-red-600 hover:bg-red-100"
                        title="删除"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
