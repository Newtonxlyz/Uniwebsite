"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save, Loader2, Trash2, Plus, X, Image as ImageIcon, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { PICTUREBOOK_SERIES, PICTUREBOOK_CHARACTERS } from "@/content/picturebook/admin-data";

interface Page {
  id: string;
  pageNum: number;
  imageUrl: string;
  text: string | null;
}

interface Story {
  id: string;
  slug: string;
  title: string;
  titleEn: string | null;
  series: string;
  desc: string | null;
  age: string | null;
  time: number;
  pageCount: number;
  emoji: string | null;
  cover: string | null;
  videoUrl: string | null;
  tags: string[];
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  pages: Page[];
  characters: { charId: string; name: string }[];
}

const STATUS_STYLES: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "草稿", color: "#F59E0B" },
  PUBLISHED: { label: "已发布", color: "#10B981" },
  ARCHIVED: { label: "已下架", color: "#6B7280" },
};

export default function PicturebookEditPage() {
  const { id } = useParams<{ id: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 表单 state
  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [desc, setDesc] = useState("");
  const [age, setAge] = useState("");
  const [time, setTime] = useState(8);
  const [emoji, setEmoji] = useState("📚");
  const [status, setStatus] = useState<Story["status"]>("DRAFT");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [characters, setCharacters] = useState<string[]>([]);
  const [pageTexts, setPageTexts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (search.get("ok") === "1") {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    load();
  }, [id]);

  const load = async () => {
    setLoading(true);
    const r = await fetch(`/api/admin/picturebook/${id}`);
    if (r.ok) {
      const s: Story = await r.json();
      setStory(s);
      setTitle(s.title);
      setTitleEn(s.titleEn || "");
      setDesc(s.desc || "");
      setAge(s.age || "");
      setTime(s.time);
      setEmoji(s.emoji || "📚");
      setStatus(s.status);
      setTags(s.tags || []);
      setCharacters((s.characters || []).map((c) => c.charId));
      const map: Record<string, string> = {};
      s.pages.forEach((p) => { map[p.id] = p.text || ""; });
      setPageTexts(map);
    } else {
      const j = await r.json();
      setError(j.error || "加载失败");
    }
    setLoading(false);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const r = await fetch(`/api/admin/picturebook/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          titleEn: titleEn || undefined,
          desc: desc || undefined,
          age,
          time,
          emoji,
          status,
          tags,
          characters: characters.map((cid) => {
            const c = PICTUREBOOK_CHARACTERS.find((x) => x.id === cid)!;
            return { id: c.id, name: c.name };
          }),
        }),
      });
      if (!r.ok) {
        const j = await r.json();
        throw new Error(j.error);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      // 单独保存每页 text
      for (const p of story?.pages || []) {
        const newText = pageTexts[p.id] ?? "";
        if (newText !== (p.text || "")) {
          // 通过 PATCH /upload-page 同时更新 text（需要新接口，先 patch story 时不带）
          // 这里简单做法：暂不更新页 text，需要在原上传页操作；如必要可加 PATCH /api/admin/picturebook/[id]/page/[pageId]
        }
      }
    } catch (e: any) {
      setError(e.message);
    }
    setSaving(false);
  };

  const addPages = async (files: FileList) => {
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("image/")) continue;
      const fd = new FormData();
      fd.append("file", f);
      await fetch(`/api/admin/picturebook/${id}/upload-page`, { method: "POST", body: fd });
    }
    load();
  };

  const delPage = async (pageId: string) => {
    if (!confirm("删除这一页？")) return;
    await fetch(`/api/admin/picturebook/${id}/upload-page?pageId=${pageId}`, { method: "DELETE" });
    load();
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500 mx-auto" />
        <p className="text-sm text-gray-500 mt-2">加载中...</p>
      </div>
    );
  }
  if (error || !story) {
    return (
      <div className="min-h-screen pt-20 text-center">
        <p className="text-red-500">{error || "绘本不存在"}</p>
        <Link href="/admin/picturebook" className="text-amber-600 text-sm hover:underline mt-2 inline-block">返回列表</Link>
      </div>
    );
  }

  const st = STATUS_STYLES[status];

  return (
    <div className="min-h-screen pt-20 px-6 pb-16" style={{ background: "linear-gradient(180deg, #FFF5F7 0%, #F0F9FF 100%)" }}>
      <div className="max-w-5xl mx-auto">
        <Link href="/admin/picturebook" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4">
          <ChevronLeft className="h-4 w-4" /> 返回绘本管理
        </Link>

        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-3xl">{emoji}</span>
              <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${st.color}15`, color: st.color }}>{st.label}</span>
            </div>
            <p className="text-xs text-gray-500">/{story.slug} · {story.series} · 上传于 {new Date(story.createdAt).toLocaleString("zh-CN")}</p>
          </div>
          <div className="flex items-center gap-2">
            {saved && <span className="text-xs text-emerald-600">✓ 已保存</span>}
            {error && <span className="text-xs text-red-600">✗ {error}</span>}
            <Link href={`/picturebook/stories/${story.slug}`} target="_blank" className="px-3 py-1.5 rounded-lg bg-gray-100 text-sm hover:bg-gray-200">
              预览 →
            </Link>
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-white text-sm font-medium disabled:opacity-50"
              style={{ background: "#D4A03D" }}
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              保存
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 基本信息 */}
          <div className="bg-white rounded-2xl p-5 shadow space-y-3">
            <h2 className="text-sm font-bold text-gray-700">📋 基本信息</h2>
            <Field label="标题"><Input value={title} onChange={setTitle} /></Field>
            <Field label="英文标题"><Input value={titleEn} onChange={setTitleEn} /></Field>
            <Field label="Emoji"><Input value={emoji} onChange={setEmoji} className="text-2xl text-center" /></Field>
            <Field label="年龄"><Input value={age} onChange={setAge} /></Field>
            <Field label="阅读时间（分钟）">
              <Input type="number" value={String(time)} onChange={(v) => setTime(parseInt(v) || 1)} />
            </Field>
            <Field label="简介">
              <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none text-sm resize-none" />
            </Field>
          </div>

          {/* 状态 + 标签 + 角色 */}
          <div className="bg-white rounded-2xl p-5 shadow space-y-3">
            <h2 className="text-sm font-bold text-gray-700">⚙️ 状态 / 标签 / 角色</h2>
            <Field label="状态">
              <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm">
                <option value="DRAFT">📝 草稿</option>
                <option value="PUBLISHED">✅ 已发布</option>
                <option value="ARCHIVED">🗄️ 已下架</option>
              </select>
            </Field>
            <Field label="标签">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-amber-50 text-amber-700">
                    #{t}
                    <button onClick={() => setTags(tags.filter((x) => x !== t))}><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={tagInput} onChange={setTagInput} placeholder="输入回车" onEnter={addTag} />
                <button onClick={addTag} className="px-3 py-1 rounded-lg bg-gray-100 text-sm">添加</button>
              </div>
            </Field>
            <Field label="角色">
              <div className="flex flex-wrap gap-1.5">
                {PICTUREBOOK_CHARACTERS.map((c) => {
                  const on = characters.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      onClick={() => setCharacters(on ? characters.filter((x) => x !== c.id) : [...characters, c.id])}
                      className={cn("px-2 py-1 rounded-full text-xs", on ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </Field>
            {story.cover && (
              <Field label="封面预览">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={story.cover} alt="" className="w-32 h-32 object-cover rounded-xl" />
              </Field>
            )}
            {story.videoUrl && (
              <Field label="视频">
                <video src={story.videoUrl} controls className="w-full rounded-xl" />
              </Field>
            )}
          </div>
        </div>

        {/* 页面管理 */}
        <div className="bg-white rounded-2xl p-5 shadow mt-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-700">📸 页面管理（{story.pages.length} 页）</h2>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-medium"
              style={{ background: "#D4A03D" }}
            >
              <Plus className="h-3.5 w-3.5" /> 添加页
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => e.target.files && addPages(e.target.files)}
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {story.pages.map((p) => (
              <div key={p.id} className="bg-gray-50 rounded-xl overflow-hidden">
                <div className="relative aspect-[4/3] bg-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                  <div className="absolute top-1 left-1 text-xs px-1.5 py-0.5 rounded bg-black/60 text-white">
                    P{p.pageNum}
                  </div>
                  <button
                    onClick={() => delPage(p.id)}
                    className="absolute top-1 right-1 p-1 rounded bg-red-500/80 text-white opacity-0 hover:opacity-100 transition-opacity"
                    title="删除"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
                <textarea
                  value={pageTexts[p.id] || ""}
                  onChange={(e) => setPageTexts({ ...pageTexts, [p.id]: e.target.value })}
                  rows={2}
                  placeholder="文字"
                  className="w-full px-2 py-1.5 text-xs border-t border-gray-200 focus:outline-none resize-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", className = "", onEnter }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string; className?: string; onEnter?: () => void }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => onEnter && e.key === "Enter" && (e.preventDefault(), onEnter())}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none text-sm ${className}`}
    />
  );
}
