"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Upload, ChevronLeft, ChevronRight, Loader2, X, Image as ImageIcon, Video, FileText, Tag, CheckCircle2 } from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";
import { PICTUREBOOK_SERIES, PICTUREBOOK_CHARACTERS } from "@/content/picturebook/admin-data";

interface UploadedPage {
  pageNum: number;
  imageUrl: string;
  text: string;
  uploading?: boolean;
  progress?: number;
  file?: File;
}

const SERIES_COLORS: Record<string, string> = {
  "成语故事": "#D4A03D",
  "诗歌故事": "#5BA4CF",
  "噶巴巴成长": "#4A9B7F",
  "噶丫丫成长": "#D4778C",
  "儿童情感引导": "#8B7EC8",
  "科普系列": "#3D9B8F",
  "俚语歇后语": "#E8923A",
  "思念母亲": "#E8A4B8",
  "雷迪嘎嘎诞生": "#5B6BC8",
  "乌鸦喝水系列": "#5BA4CF",
};

export default function PicturebookUploadPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // step 1
  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [series, setSeries] = useState("emotion");
  const [desc, setDesc] = useState("");
  const [age, setAge] = useState("3-8");
  const [time, setTime] = useState(8);
  const [emoji, setEmoji] = useState("🦉");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [characters, setCharacters] = useState<string[]>([]);

  // step 2
  const [pages, setPages] = useState<UploadedPage[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUploading, setVideoUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // step 3
  const [publishStatus, setPublishStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const addFiles = (files: FileList | File[]) => {
    const newFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (newFiles.length === 0) return;
    const startNum = pages.length > 0 ? Math.max(...pages.map((p) => p.pageNum)) + 1 : 1;
    const newPages: UploadedPage[] = newFiles.map((f, i) => ({
      pageNum: startNum + i,
      imageUrl: URL.createObjectURL(f),
      text: "",
      file: f,
    }));
    setPages([...pages, ...newPages]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const removePage = (idx: number) => {
    setPages(pages.filter((_, i) => i !== idx));
  };

  const updatePageText = (idx: number, text: string) => {
    const cp = [...pages];
    cp[idx] = { ...cp[idx], text };
    setPages(cp);
  };

  const movePage = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= pages.length) return;
    const cp = [...pages];
    [cp[idx], cp[target]] = [cp[target], cp[idx]];
    cp.forEach((p, i) => (p.pageNum = i + 1));
    setPages(cp);
  };

  const submit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      // 1. 创建 story
      const seriesName = PICTUREBOOK_SERIES.find((s) => s.id === series)?.name || series;
      const storyRes = await fetch("/api/admin/picturebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          titleEn: titleEn || undefined,
          series: seriesName,
          seriesCategory: series,
          desc: desc || undefined,
          age,
          time,
          pageCount: pages.length,
          emoji,
          tags,
          characters: characters.map((id) => {
            const c = PICTUREBOOK_CHARACTERS.find((x) => x.id === id)!;
            return { id: c.id, name: c.name };
          }),
          status: publishStatus,
        }),
      });
      if (!storyRes.ok) {
        const j = await storyRes.json();
        throw new Error(j.error || "创建失败");
      }
      const story = await storyRes.json();

      // 2. 上传封面
      if (coverFile) {
        const fd = new FormData();
        fd.append("file", coverFile);
        fd.append("kind", "cover");
        await fetch(`/api/admin/picturebook/${story.id}/upload-page`, { method: "POST", body: fd });
      }

      // 3. 上传视频
      if (videoFile) {
        setVideoUploading(true);
        const fd = new FormData();
        fd.append("file", videoFile);
        fd.append("kind", "video");
        await fetch(`/api/admin/picturebook/${story.id}/upload-page`, { method: "POST", body: fd });
        setVideoUploading(false);
      }

      // 4. 逐页上传（顺序保证）
      for (let i = 0; i < pages.length; i++) {
        const p = pages[i];
        if (!p.file) continue;
        const fd = new FormData();
        fd.append("file", p.file);
        fd.append("pageNum", String(p.pageNum));
        if (p.text) fd.append("text", p.text);
        await fetch(`/api/admin/picturebook/${story.id}/upload-page`, { method: "POST", body: fd });
      }

      // 5. 跳到列表
      router.push(`/admin/picturebook/${story.id}/edit?ok=1`);
    } catch (e: any) {
      setError(e.message);
      setSubmitting(false);
    }
  };

  const seriesColor = SERIES_COLORS[PICTUREBOOK_SERIES.find((s) => s.id === series)?.name || ""] || "#D4A03D";
  const canStep1 = title.trim() && series;
  const canStep2 = pages.length > 0;

  return (
    <div className="min-h-screen pt-20 px-6 pb-16" style={{ background: "linear-gradient(180deg, #FFF5F7 0%, #F0F9FF 100%)" }}>
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/picturebook" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4">
          <ChevronLeft className="h-4 w-4" /> 返回绘本管理
        </Link>

        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2" style={{ color: seriesColor }}>
            <BookOpen className="h-7 w-7" />
            上传新绘本
          </h1>
          <p className="text-sm text-gray-500 mt-1">3 步完成：基本信息 → 上传页面 → 发布设置</p>
        </div>

        {/* 步骤指示 */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold",
                  step === s ? "text-white" : step > s ? "text-emerald-500" : "bg-gray-200 text-gray-500"
                )}
                style={step === s ? { background: seriesColor } : step > s ? { background: "#10B98115" } : undefined}
              >
                {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
              </div>
              {s < 3 && <div className={cn("h-0.5 w-12 rounded", step > s ? "bg-emerald-500" : "bg-gray-200")} />}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
            ✗ {error}
          </div>
        )}

        {/* Step 1: 基本信息 */}
        {step === 1 && (
          <div className="bg-white rounded-3xl p-6 shadow space-y-4">
            <h2 className="text-lg font-bold text-gray-800">📋 第 1 步：基本信息</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例如：黑黑的洞穴我不怕"
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">英文标题（可选）</label>
                <input
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="I'm Not Afraid of the Dark Cave"
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">系列 *</label>
                <select
                  value={series}
                  onChange={(e) => setSeries(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none text-sm"
                >
                  {PICTUREBOOK_SERIES.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emoji</label>
                <input
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  maxLength={4}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none text-2xl text-center"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">年龄</label>
                <input
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">阅读时间（分钟）</label>
                <input
                  type="number"
                  value={time}
                  onChange={(e) => setTime(parseInt(e.target.value) || 1)}
                  min={1}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">简介</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none text-sm resize-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">标签</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs" style={{ background: `${seriesColor}20`, color: seriesColor }}>
                      #{t}
                      <button onClick={() => setTags(tags.filter((x) => x !== t))}><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="输入标签后回车"
                    className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none text-sm"
                  />
                  <button onClick={addTag} className="px-4 py-2 rounded-xl text-sm text-white" style={{ background: seriesColor }}>添加</button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">角色（可多选）</label>
                <div className="flex flex-wrap gap-2">
                  {PICTUREBOOK_CHARACTERS.map((c) => {
                    const on = characters.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() =>
                          setCharacters(on ? characters.filter((x) => x !== c.id) : [...characters, c.id])
                        }
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                          on ? "text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                        style={on ? { background: seriesColor } : undefined}
                      >
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => canStep1 && setStep(2)}
                disabled={!canStep1}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-medium disabled:opacity-40"
                style={{ background: seriesColor }}
              >
                下一步：上传页面 <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: 上传页面 */}
        {step === 2 && (
          <div className="bg-white rounded-3xl p-6 shadow space-y-4">
            <h2 className="text-lg font-bold text-gray-800">📸 第 2 步：上传页面</h2>

            {/* 封面 + 视频 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">📕 封面图（可选）</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                  className="w-full text-sm"
                />
                {coverFile && <p className="text-xs text-gray-500 mt-1">✓ {coverFile.name} ({formatBytes(coverFile.size)})</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">🎬 视频（可选，最大 500MB）</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="w-full text-sm"
                />
                {videoFile && <p className="text-xs text-gray-500 mt-1">✓ {videoFile.name} ({formatBytes(videoFile.size)})</p>}
              </div>
            </div>

            {/* 拖拽上传区 */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all",
                dragOver ? "border-amber-500 bg-amber-50" : "border-gray-300 hover:border-amber-400"
              )}
            >
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="font-medium text-gray-700">拖入图片 或 点击选择文件</p>
              <p className="text-xs text-gray-500 mt-1">支持多选，每张最大 10MB（JPG/PNG/WebP）</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => e.target.files && addFiles(e.target.files)}
                className="hidden"
              />
            </div>

            {/* 已上传页 */}
            {pages.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-gray-700">已添加 {pages.length} 页</h3>
                  <button
                    onClick={() => setPages([])}
                    className="text-xs text-red-500 hover:underline"
                  >
                    清空
                  </button>
                </div>
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {pages.map((p, idx) => (
                    <div key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: seriesColor }}>
                            第 {p.pageNum} 页
                          </span>
                          <span className="text-xs text-gray-500">{p.file ? formatBytes(p.file.size) : ""}</span>
                        </div>
                        <textarea
                          value={p.text}
                          onChange={(e) => updatePageText(idx, e.target.value)}
                          rows={2}
                          placeholder="这页的文字（可选）"
                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs resize-none focus:outline-none focus:border-amber-300"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <button onClick={() => movePage(idx, -1)} disabled={idx === 0} className="p-1 text-gray-400 hover:text-amber-500 disabled:opacity-30" title="上移">▲</button>
                        <button onClick={() => movePage(idx, 1)} disabled={idx === pages.length - 1} className="p-1 text-gray-400 hover:text-amber-500 disabled:opacity-30" title="下移">▼</button>
                        <button onClick={() => removePage(idx)} className="p-1 text-red-400 hover:text-red-600" title="删除"><X className="h-3 w-3" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-2">
              <button onClick={() => setStep(1)} className="px-4 py-2.5 rounded-xl bg-gray-100 text-sm">
                <ChevronLeft className="h-4 w-4 inline" /> 上一步
              </button>
              <button
                onClick={() => canStep2 && setStep(3)}
                disabled={!canStep2}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-medium disabled:opacity-40"
                style={{ background: seriesColor }}
              >
                下一步：发布 <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: 发布 */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-6 shadow space-y-4">
            <h2 className="text-lg font-bold text-gray-800">🚀 第 3 步：发布设置</h2>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-amber-400">
                <input type="radio" name="status" checked={publishStatus === "DRAFT"} onChange={() => setPublishStatus("DRAFT")} className="mt-1" />
                <div>
                  <p className="font-medium text-sm">📝 保存为草稿</p>
                  <p className="text-xs text-gray-500 mt-1">稍后再编辑，不会在绘本页面显示</p>
                </div>
              </label>
              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-emerald-400">
                <input type="radio" name="status" checked={publishStatus === "PUBLISHED"} onChange={() => setPublishStatus("PUBLISHED")} className="mt-1" />
                <div>
                  <p className="font-medium text-sm text-emerald-700">✅ 立即发布</p>
                  <p className="text-xs text-gray-500 mt-1">绘本将出现在绘本首页 / 故事馆（其他人可浏览）</p>
                </div>
              </label>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
              ℹ️ 上传过程中请保持页面打开。共 {pages.length} 张图片 + 1 个封面{videoFile ? " + 1 个视频" : ""}。
            </div>

            <div className="flex justify-between pt-2">
              <button onClick={() => setStep(2)} disabled={submitting} className="px-4 py-2.5 rounded-xl bg-gray-100 text-sm">
                <ChevronLeft className="h-4 w-4 inline" /> 上一步
              </button>
              <button
                onClick={submit}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-medium disabled:opacity-50"
                style={{ background: seriesColor }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    上传中...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    完成上传
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
