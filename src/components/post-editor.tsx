// 文章编辑器（创建 / 编辑共用）
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Save, Send, Upload, X, Plus, Image as ImageIcon, Video, Music, FileText, Loader2 } from "lucide-react";
import { Markdown } from "./markdown";
import { formatBytes } from "@/lib/utils";

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

type UploadKind = "image" | "audio" | "video" | "pdf";

// 预签名直传 R2（绕过 Vercel 4.5MB body 限制）
async function uploadMedia(
  file: File,
  kind: UploadKind
): Promise<{ url: string; type: "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT"; filename: string }> {
  // 1. 拿预签名 URL
  const presignRes = await fetch("/api/blog/media/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    }),
  });
  if (!presignRes.ok) {
    const j = await presignRes.json().catch(() => ({}));
    throw new Error(`预签名失败: ${j.error || presignRes.status}`);
  }
  const { uploadUrl, publicUrl } = await presignRes.json();

  // 2. 浏览器 PUT 到 R2
  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!putRes.ok) throw new Error(`R2 上传失败: ${putRes.status}`);

  // 3. 写 Media 表
  const confirmRes = await fetch("/api/blog/media/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key: publicUrl.replace("https://media.lvyz.org/", ""),
      publicUrl,
      filename: file.name,
      mimeType: file.type,
      size: file.size,
    }),
  });
  if (!confirmRes.ok) {
    const j = await confirmRes.json().catch(() => ({}));
    throw new Error(`写库失败: ${j.error || confirmRes.status}`);
  }
  const media = await confirmRes.json();
  return { url: media.url, type: media.type, filename: media.filename };
}

// 生成插入正文的 markdown/HTML
function mediaToMarkdown(url: string, type: string, filename: string): string {
  if (type === "IMAGE") return `\n\n![${filename}](${url})\n\n`;
  if (type === "VIDEO")
    return `\n\n<video src="${url}" controls style="max-width:100%;border-radius:12px;margin:1rem 0;box-shadow:0 4px 12px rgba(0,0,0,0.2);"></video>\n\n`;
  if (type === "AUDIO")
    return `\n\n<audio src="${url}" controls style="width:100%;margin:1rem 0;"></audio>\n\n**🎵 ${filename}**\n\n`;
  return `\n\n[📎 ${filename}](${url})\n\n`;
}

export function PostEditor({ mode, post }: Props) {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
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
  const [uploadingKind, setUploadingKind] = useState<UploadKind | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
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

  // 媒体上传通用处理
  const handleMediaUpload = async (kind: UploadKind, file: File) => {
    setUploadError(null);
    setUploadingKind(kind);
    try {
      const media = await uploadMedia(file, kind);
      const insertText = mediaToMarkdown(media.url, media.type, media.filename);
      update("content", data.content + insertText);
    } catch (e: any) {
      setUploadError(e.message);
    } finally {
      setUploadingKind(null);
    }
  };

  // 封面图上传
  const handleCoverUpload = async (file: File) => {
    setUploadError(null);
    setUploadingCover(true);
    try {
      const media = await uploadMedia(file, "image");
      update("coverImage", media.url);
    } catch (e: any) {
      setUploadError(e.message);
    } finally {
      setUploadingCover(false);
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
        <label className="block text-sm font-medium text-gray-300 mb-2">封面图（可选）</label>
        {data.coverImage ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.coverImage} alt="封面" className="w-full max-h-64 object-cover rounded-lg" />
            <button
              type="button"
              onClick={() => update("coverImage", "")}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => coverInputRef.current?.click()}
            className="glass-card p-6 border-2 border-dashed border-white/10 hover:border-amber-400/50 cursor-pointer flex flex-col items-center justify-center min-h-[120px] transition-colors"
          >
            {uploadingCover ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin text-amber-400 mb-2" />
                <p className="text-sm text-gray-400">上传中...</p>
              </>
            ) : (
              <>
                <ImageIcon className="h-8 w-8 text-gray-500 mb-2" />
                <p className="text-sm text-gray-400">点击上传封面图（最大 10MB）</p>
              </>
            )}
          </div>
        )}
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleCoverUpload(e.target.files[0])}
          className="hidden"
        />
        <p className="text-xs text-gray-500 mt-1">或粘贴 URL：</p>
        <input
          type="url"
          value={data.coverImage}
          onChange={(e) => update("coverImage", e.target.value)}
          placeholder="https://media.lvyz.org/..."
          className="w-full mt-1 glass-card px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 text-sm"
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
        <h3 className="text-sm font-medium text-gray-300 mb-3">📎 插入媒体（点击插入到正文末尾）</h3>
        {uploadError && (
          <p className="text-xs text-red-400 mb-2">✗ {uploadError}</p>
        )}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleMediaUpload("image", e.target.files[0])}
            className="hidden"
          />
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            onChange={(e) => e.target.files?.[0] && handleMediaUpload("audio", e.target.files[0])}
            className="hidden"
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            onChange={(e) => e.target.files?.[0] && handleMediaUpload("video", e.target.files[0])}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            disabled={!!uploadingKind}
            className="flex flex-col items-center gap-1.5 px-3 py-3 text-sm glass-card hover:scale-105 transition-transform disabled:opacity-50"
            style={{ background: "rgba(96,165,250,0.1)" }}
          >
            {uploadingKind === "image" ? (
              <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
            ) : (
              <ImageIcon className="h-5 w-5 text-blue-400" />
            )}
            <span className="text-xs">🖼️ 图片</span>
            <span className="text-[10px] text-gray-500">10MB</span>
          </button>
          <button
            type="button"
            onClick={() => audioInputRef.current?.click()}
            disabled={!!uploadingKind}
            className="flex flex-col items-center gap-1.5 px-3 py-3 text-sm glass-card hover:scale-105 transition-transform disabled:opacity-50"
            style={{ background: "rgba(167,139,250,0.1)" }}
          >
            {uploadingKind === "audio" ? (
              <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
            ) : (
              <Music className="h-5 w-5 text-purple-400" />
            )}
            <span className="text-xs">🎵 音频</span>
            <span className="text-[10px] text-gray-500">50MB</span>
          </button>
          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            disabled={!!uploadingKind}
            className="flex flex-col items-center gap-1.5 px-3 py-3 text-sm glass-card hover:scale-105 transition-transform disabled:opacity-50"
            style={{ background: "rgba(251,146,60,0.1)" }}
          >
            {uploadingKind === "video" ? (
              <Loader2 className="h-5 w-5 animate-spin text-orange-400" />
            ) : (
              <Video className="h-5 w-5 text-orange-400" />
            )}
            <span className="text-xs">🎬 视频</span>
            <span className="text-[10px] text-gray-500">500MB</span>
          </button>
        </div>
        <p className="text-xs text-gray-500">上传后会自动插入到正文末尾</p>
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
