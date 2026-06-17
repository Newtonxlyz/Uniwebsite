// 文章编辑器（创建 / 编辑共用）
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Save, Send, Upload, X, Plus, Image as ImageIcon, Video, Music, FileText } from "lucide-react";
import { Markdown } from "./markdown";

interface PostData {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  category: "poetry" | "blog" | "tech" | "life" | "industry";
  tags: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  allowComments: boolean;
  embeds: string;
}

interface Props {
  mode: "create" | "edit";
  post?: PostData;
}

export function PostEditor({ mode, post }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<PostData>(post || {
    title: "",
    content: "",
    excerpt: "",
    coverImage: "",
    category: "blog",
    tags: "",
    status: "DRAFT",
    allowComments: true,
    embeds: "",
  });
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [embedUrls, setEmbedUrls] = useState<string[]>(() => {
    if (!post?.embeds) return [];
    try {
      return JSON.parse(post.embeds);
    } catch {
      return post.embeds.split(",").map(s => s.trim()).filter(Boolean);
    }
  });
  const [newEmbed, setNewEmbed] = useState("");

  const update = <K extends keyof PostData>(key: K, value: PostData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (status: "DRAFT" | "PUBLISHED") => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        status,
        embeds: JSON.stringify(embedUrls),
      };
      const url = mode === "create" ? "/api/blog/posts" : `/api/blog/posts/${post!.id}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        alert("保存失败: " + (err.error || res.statusText));
        return;
      }
      const saved = await res.json();
      if (mode === "create" && status === "PUBLISHED") {
        router.push(`/blog/${saved.slug}`);
      } else if (mode === "create") {
        router.push(`/blog/edit/${saved.id}`);
      } else {
        router.push(`/blog/${saved.slug}`);
      }
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("确定要删除这篇文章吗？此操作不可撤销。")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/blog/posts/${post!.id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/blog");
        router.refresh();
      } else {
        const err = await res.json();
        alert("删除失败: " + err.error);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/blog/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        alert("上传失败: " + (err.error || res.statusText));
        return;
      }
      const media = await res.json();
      // 插入到 content 末尾
      const insertText = media.type === "IMAGE"
        ? `\n\n![${media.filename}](${media.url})\n\n`
        : media.type === "VIDEO"
        ? `\n\n<video src="${media.url}" controls style="max-width:100%;border-radius:8px;margin:1rem 0;"></video>\n\n`
        : media.type === "AUDIO"
        ? `\n\n<audio src="${media.url}" controls></audio>\n\n`
        : `\n\n[📎 ${media.filename}](${media.url})\n\n`;
      update("content", data.content + insertText);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const addEmbed = () => {
    if (!newEmbed.trim()) return;
    setEmbedUrls([...embedUrls, newEmbed.trim()]);
    setNewEmbed("");
  };

  const removeEmbed = (i: number) => {
    setEmbedUrls(embedUrls.filter((_, idx) => idx !== i));
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">标题</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="给你的文章起个名字..."
          className="w-full glass-card px-4 py-3 text-2xl font-bold text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        />
      </div>

      {/* 元数据 */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">分类</label>
          <select
            value={data.category}
            onChange={(e) => update("category", e.target.value as any)}
            className="w-full glass-card px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50"
          >
            <option value="poetry">诗韵</option>
            <option value="blog">随笔</option>
            <option value="tech">技术</option>
            <option value="life">生活</option>
            <option value="industry">行业</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">标签（逗号分隔）</label>
          <input
            type="text"
            value={data.tags}
            onChange={(e) => update("tags", e.target.value)}
            placeholder="AI, 转型, 学习心得"
            className="w-full glass-card px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
          />
        </div>
      </div>

      {/* 摘要 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">摘要（可选）</label>
        <textarea
          value={data.excerpt}
          onChange={(e) => update("excerpt", e.target.value)}
          placeholder="一段简短的介绍，会显示在列表页..."
          rows={2}
          className="w-full glass-card px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        />
      </div>

      {/* 封面图 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">封面图 URL（可选）</label>
        <input
          type="url"
          value={data.coverImage}
          onChange={(e) => update("coverImage", e.target.value)}
          placeholder="https://media.lvyz.org/uploads/..."
          className="w-full glass-card px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        />
      </div>

      {/* 编辑器切换 */}
      <div className="flex items-center gap-2 border-b border-white/10">
        <button
          type="button"
          onClick={() => setPreview(false)}
          className={`px-4 py-2 text-sm ${!preview ? "text-amber-300 border-b-2 border-amber-400" : "text-gray-500"}`}
        >
          ✏️ 编写
        </button>
        <button
          type="button"
          onClick={() => setPreview(true)}
          className={`px-4 py-2 text-sm ${preview ? "text-amber-300 border-b-2 border-amber-400" : "text-gray-500"}`}
        >
          👁️ 预览
        </button>
      </div>

      {preview ? (
        <div className="glass-card p-6 min-h-[400px]">
          <h2 className="text-3xl font-bold text-white mb-4">{data.title || "无标题"}</h2>
          <Markdown content={data.content || "_（还没有内容）_"} />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            正文（支持 Markdown）
          </label>
          <textarea
            value={data.content}
            onChange={(e) => update("content", e.target.value)}
            placeholder="开始写作..."
            rows={20}
            className="w-full glass-card px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 font-mono text-sm"
          />
        </div>
      )}

      {/* 媒体上传 */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-3">📎 插入媒体</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,audio/*,.pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm glass-card hover:scale-105 transition-transform disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            {uploading ? "上传中..." : "上传文件"}
          </button>
        </div>
        <p className="text-xs text-gray-500">支持图片、视频、音频、PDF · 最大 100MB</p>
      </div>

      {/* 嵌入链接 */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-3">🔗 嵌入第三方内容</h3>
        <div className="flex gap-2 mb-3">
          <input
            type="url"
            value={newEmbed}
            onChange={(e) => setNewEmbed(e.target.value)}
            placeholder="https://www.xiaohongshu.com/explore/... 或 https://www.bilibili.com/video/BV..."
            className="flex-1 glass-card px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addEmbed())}
          />
          <button
            type="button"
            onClick={addEmbed}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-amber-500/20 text-amber-300 rounded hover:bg-amber-500/30"
          >
            <Plus className="h-4 w-4" /> 添加
          </button>
        </div>
        {embedUrls.length > 0 && (
          <ul className="space-y-1">
            {embedUrls.map((url, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 rounded px-2 py-1">
                <span className="flex-1 truncate">{url}</span>
                <button type="button" onClick={() => removeEmbed(i)} className="text-rose-400 hover:text-rose-300">
                  <X className="h-3 w-3" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 留言开关 */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="allowComments"
          checked={data.allowComments}
          onChange={(e) => update("allowComments", e.target.checked)}
          className="rounded"
        />
        <label htmlFor="allowComments" className="text-sm text-gray-300">
          允许读者留言
        </label>
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-3 sticky bottom-0 bg-[#0a0a1a]/80 backdrop-blur py-4 -mx-4 px-4 border-t border-white/10">
        <button
          type="button"
          onClick={() => handleSave("DRAFT")}
          disabled={saving || !data.title}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "保存中..." : "保存草稿"}
        </button>
        <button
          type="button"
          onClick={() => handleSave("PUBLISHED")}
          disabled={saving || !data.title || !data.content}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {saving ? "发布中..." : "发布"}
        </button>
        {mode === "edit" && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="ml-auto px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300"
          >
            🗑️ 删除
          </button>
        )}
      </div>
    </div>
  );
}
