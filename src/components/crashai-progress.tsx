// progress-client.tsx - crashai 课程进度 client 组件
// 提供 context + 详情页底部"标记状态"按钮 + 笔记 + 学习时长

"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  CheckCircle,
  PlayCircle,
  Circle,
  Loader2,
  Save,
  Trash2,
  Clock,
  StickyNote,
  Lock,
} from "lucide-react";
import Link from "next/link";

export type CrashAIStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export interface ProgressEntry {
  lessonSlug: string;
  status: CrashAIStatus;
  notes: string | null;
  studyMinutes: number;
  startedAt: string | null;
  completedAt: string | null;
}

interface ProgressState {
  [slug: string]: ProgressEntry;
}

interface ProgressContextValue {
  get: (slug: string) => ProgressEntry | undefined;
  set: (slug: string, entry: ProgressEntry) => void;
  refresh: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

// ─────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────
export function ProgressProvider({
  initialMap,
  children,
}: {
  initialMap: ProgressState;
  children: React.ReactNode;
}) {
  const [map, setMap] = useState<ProgressState>(initialMap);

  const get = useCallback((slug: string) => map[slug], [map]);
  const set = useCallback((slug: string, entry: ProgressEntry) => {
    setMap((prev) => ({ ...prev, [slug]: entry }));
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/crashai/progress", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      const next: ProgressState = {};
      for (const p of data.progress as any[]) {
        next[p.lessonSlug] = {
          lessonSlug: p.lessonSlug,
          status: p.status,
          notes: p.notes,
          studyMinutes: p.studyMinutes,
          startedAt: p.startedAt,
          completedAt: p.completedAt,
        };
      }
      setMap(next);
    } catch (e) {
      console.error("Progress refresh failed:", e);
    }
  }, []);

  return (
    <ProgressContext.Provider value={{ get, set, refresh }}>
      {children}
    </ProgressContext.Provider>
  );
}

function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    return {
      get: () => undefined,
      set: () => {},
      refresh: async () => {},
    };
  }
  return ctx;
}

// ─────────────────────────────────────────────────
// Dashboard: 客户端可更新版本（首页用，目前用不到 set，留接口）
// ─────────────────────────────────────────────────
export function ProgressDashboard({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// ─────────────────────────────────────────────────
// 详情页底部"标记状态"卡片
// 包含：状态切换按钮 + 笔记 textarea + 学习时长 + 已登录检查
// ─────────────────────────────────────────────────
export function LessonProgressBar({ slug }: { slug: string }) {
  const { get, set, refresh } = useProgress();
  const entry = get(slug);
  const [pending, setPending] = useState(false);
  const [notes, setNotes] = useState(entry?.notes ?? "");
  const [studyMinutes, setStudyMinutes] = useState<number>(
    entry?.studyMinutes ?? 0
  );
  const [savedNote, setSavedNote] = useState(false);

  useEffect(() => {
    if (entry) {
      setNotes(entry.notes ?? "");
      setStudyMinutes(entry.studyMinutes);
    }
  }, [entry?.notes, entry?.studyMinutes]);

  const status: CrashAIStatus = entry?.status ?? "NOT_STARTED";

  async function updateStatus(newStatus: CrashAIStatus) {
    if (pending) return;
    setPending(true);
    try {
      const res = await fetch(`/api/crashai/progress/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        set(slug, {
          lessonSlug: slug,
          status: data.progress.status,
          notes: data.progress.notes,
          studyMinutes: data.progress.studyMinutes,
          startedAt: data.progress.startedAt,
          completedAt: data.progress.completedAt,
        });
        await refresh();
      }
    } catch (e) {
      console.error("Status update failed:", e);
    } finally {
      setPending(false);
    }
  }

  async function saveNotes() {
    if (pending) return;
    setPending(true);
    setSavedNote(false);
    try {
      const res = await fetch(`/api/crashai/progress/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      if (res.ok) {
        const data = await res.json();
        set(slug, {
          lessonSlug: slug,
          status: data.progress.status,
          notes: data.progress.notes,
          studyMinutes: data.progress.studyMinutes,
          startedAt: data.progress.startedAt,
          completedAt: data.progress.completedAt,
        });
        setSavedNote(true);
        setTimeout(() => setSavedNote(false), 2000);
        await refresh();
      }
    } catch (e) {
      console.error("Notes save failed:", e);
    } finally {
      setPending(false);
    }
  }

  async function addStudyMinutes(min: number) {
    if (pending || min <= 0) return;
    setPending(true);
    try {
      const res = await fetch(`/api/crashai/progress/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studyMinutes: min }),
      });
      if (res.ok) {
        const data = await res.json();
        set(slug, {
          lessonSlug: slug,
          status: data.progress.status,
          notes: data.progress.notes,
          studyMinutes: data.progress.studyMinutes,
          startedAt: data.progress.startedAt,
          completedAt: data.progress.completedAt,
        });
        setStudyMinutes(data.progress.studyMinutes);
        await refresh();
      }
    } catch (e) {
      console.error("Study minutes update failed:", e);
    } finally {
      setPending(false);
    }
  }

  async function reset() {
    if (!confirm("确认重置此课程的学习状态？笔记将一并删除。")) return;
    setPending(true);
    try {
      const res = await fetch(`/api/crashai/progress/${slug}`, {
        method: "DELETE",
      });
      if (res.ok) {
        set(slug, {
          lessonSlug: slug,
          status: "NOT_STARTED",
          notes: null,
          studyMinutes: 0,
          startedAt: null,
          completedAt: null,
        });
        setNotes("");
        setStudyMinutes(0);
        await refresh();
      }
    } catch (e) {
      console.error("Reset failed:", e);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="glass-card p-6 my-8 space-y-5">
      <div className="flex items-center gap-2">
        <h3 className="text-base font-semibold text-white">学习进度</h3>
        {pending && <Loader2 className="h-4 w-4 text-cyan-400 animate-spin" />}
      </div>

      {/* 状态按钮（3 个大按钮） */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => updateStatus("NOT_STARTED")}
          disabled={pending}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border transition-all ${
            status === "NOT_STARTED"
              ? "bg-white/10 border-white/30 text-white"
              : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Circle className="h-4 w-4" />
          未学
        </button>
        <button
          onClick={() => updateStatus("IN_PROGRESS")}
          disabled={pending}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border transition-all ${
            status === "IN_PROGRESS"
              ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-200"
              : "bg-white/5 border-white/10 text-gray-400 hover:bg-cyan-500/10 hover:text-cyan-300"
          }`}
        >
          <PlayCircle className="h-4 w-4" />
          学习中
        </button>
        <button
          onClick={() => updateStatus("COMPLETED")}
          disabled={pending}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border transition-all ${
            status === "COMPLETED"
              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-200"
              : "bg-white/5 border-white/10 text-gray-400 hover:bg-emerald-500/10 hover:text-emerald-300"
          }`}
        >
          <CheckCircle className="h-4 w-4" />
          已完成
        </button>
      </div>

      {/* 学习时长 */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-xs text-gray-400">
            学习时长: <span className="text-white font-medium">{studyMinutes}</span> 分钟
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[+15, +30, +60].map((m) => (
            <button
              key={m}
              onClick={() => addStudyMinutes(m)}
              disabled={pending}
              className="text-xs px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
            >
              +{m} 分钟
            </button>
          ))}
        </div>
      </div>

      {/* 笔记 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <StickyNote className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-xs text-gray-400">个人笔记</span>
          </div>
          {savedNote && (
            <span className="text-[10px] text-emerald-400">✓ 已保存</span>
          )}
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="记下本节重点、疑问、灵感..."
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/40 resize-y"
        />
        <button
          onClick={saveNotes}
          disabled={pending}
          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-cyan-500/20 hover:bg-cyan-500/30 text-xs text-cyan-200 border border-cyan-500/30 transition-colors"
        >
          <Save className="h-3 w-3" />
          保存笔记
        </button>
      </div>

      {/* 时间戳 + 重置 */}
      <div className="flex items-center justify-between text-[10px] text-gray-500 pt-2 border-t border-white/5">
        <div className="space-y-0.5">
          {entry?.startedAt && (
            <div>开始: {new Date(entry.startedAt).toLocaleString("zh-CN")}</div>
          )}
          {entry?.completedAt && (
            <div>完成: {new Date(entry.completedAt).toLocaleString("zh-CN")}</div>
          )}
        </div>
        {entry && entry.status !== "NOT_STARTED" && (
          <button
            onClick={reset}
            disabled={pending}
            className="inline-flex items-center gap-1 text-red-400/70 hover:text-red-400"
          >
            <Trash2 className="h-3 w-3" />
            重置
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
// 未登录提示（详情页用）
// ─────────────────────────────────────────────────
export function LoginRequiredPrompt({ redirect = "/crashai" }: { redirect?: string }) {
  return (
    <div className="glass-card p-6 my-8 flex items-center gap-4">
      <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
        <Lock className="h-5 w-5 text-amber-400" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-white font-medium">登录后跟踪学习进度</p>
        <p className="text-xs text-gray-400 mt-0.5">
          记录每节课的学习状态、笔记、时长
        </p>
      </div>
      <Link
        href={`/login?redirect=${redirect}`}
        className="px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-sm text-amber-200 border border-amber-500/30 transition-colors"
      >
        登录
      </Link>
    </div>
  );
}
