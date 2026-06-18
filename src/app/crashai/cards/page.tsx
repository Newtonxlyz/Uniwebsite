"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  RotateCcw, Settings, Flame, BarChart3, Brain, Star, Trophy, Calendar,
  TrendingUp, Zap, BookOpen, ChevronRight,
} from "lucide-react";

interface CardReview {
  cardId: string;
  // SM-2 算法字段
  easeFactor: number;      // EF，初始 2.5
  interval: number;        // 当前间隔（天）
  repetitions: number;     // 连续正确次数
  // ANKI 状态机
  state: "new" | "learning" | "review" | "relearning";
  // 时间戳
  dueDate: string;
  lastReviewed: string | null;
  // 统计
  totalReviews: number;
  correctReviews: number;
}

interface CardStats {
  totalReviewed: number;
  streak: number;
  lastStudyDate: string;
  retention: number;
  // 累计
  totalCorrect: number;
  totalAttempts: number;
  longestStreak: number;
}

const defaultSettings = {
  dailyNewLimit: 20,
  dailyReviewLimit: 100,
  order: "mixed" as "mixed" | "new-first" | "review-first",
};

// 状态徽章
const STATE_LABELS: Record<CardReview["state"], { name: string; color: string; bg: string }> = {
  new: { name: "新卡", color: "#60A5FA", bg: "#60A5FA15" },
  learning: { name: "学习中", color: "#F59E0B", bg: "#F59E0B15" },
  review: { name: "复习", color: "#34D399", bg: "#34D39915" },
  relearning: { name: "重学", color: "#EF4444", bg: "#EF444415" },
};

// SM-2 艾宾浩斯算法
function sm2(
  review: CardReview,
  quality: number // 0=Again, 1=Hard, 2=Good, 3=Easy
): CardReview {
  let { easeFactor, interval, repetitions, totalReviews, correctReviews } = review;
  totalReviews += 1;
  if (quality >= 2) correctReviews += 1;

  let newState: CardReview["state"] = review.state;
  let newInterval: number;
  let newRepetitions: number = repetitions;

  if (quality === 0) {
    // Again - 重置间隔，relearning 状态
    newState = "relearning";
    newInterval = 0;
    newRepetitions = 0;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  } else if (quality === 1) {
    // Hard - 保持状态，间隔缩短
    newState = "learning";
    newInterval = Math.max(1, Math.round(interval * 1.2));
    easeFactor = Math.max(1.3, easeFactor - 0.15);
  } else if (quality === 2) {
    // Good
    if (review.state === "new" || review.state === "learning") {
      newState = "learning";
      newInterval = 1;
      newRepetitions = 1;
    } else {
      newState = "review";
      newRepetitions = repetitions + 1;
      if (newRepetitions === 1) newInterval = 1;
      else if (newRepetitions === 2) newInterval = 6;
      else newInterval = Math.round(interval * easeFactor);
    }
  } else {
    // Easy
    if (review.state === "new" || review.state === "learning") {
      newState = "review";
      newInterval = 4;
      newRepetitions = 1;
    } else {
      newState = "review";
      newRepetitions = repetitions + 1;
      newInterval = Math.round(interval * easeFactor * 1.3);
    }
    easeFactor = easeFactor + 0.15;
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + newInterval);

  return {
    ...review,
    easeFactor: Math.round(easeFactor * 100) / 100,
    interval: newInterval,
    repetitions: newRepetitions,
    state: newState,
    dueDate: dueDate.toISOString(),
    lastReviewed: new Date().toISOString(),
    totalReviews,
    correctReviews,
  };
}

export default function CardsPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [queue, setQueue] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviews, setReviews] = useState<Record<string, CardReview>>({});
  const [stats, setStats] = useState<CardStats>({
    totalReviewed: 0, streak: 0, lastStudyDate: "",
    retention: 0, totalCorrect: 0, totalAttempts: 0, longestStreak: 0,
  });
  const [todayNew, setTodayNew] = useState(0);
  const [todayReview, setTodayReview] = useState(0);
  const [settings, setSettings] = useState(defaultSettings);
  const [showSettings, setShowSettings] = useState(false);
  const [finished, setFinished] = useState(false);
  const [showStats, setShowStats] = useState(true);

  // 加载
  useEffect(() => {
    const loadData = async () => {
      const res = await fetch("/api/crashai/cards");
      const allCards = res.ok ? await res.json() : [];
      setCards(allCards);

      const savedReviews = JSON.parse(localStorage.getItem("crashai_card_reviews") || "{}");
      setReviews(savedReviews);

      const savedStats = JSON.parse(localStorage.getItem("crashai_stats") || "{}");
      setStats({
        totalReviewed: 0, streak: 0, lastStudyDate: "",
        retention: 0, totalCorrect: 0, totalAttempts: 0, longestStreak: 0,
        ...savedStats,
      });

      const savedSettings = JSON.parse(localStorage.getItem("crashai_anki_settings") || "{}");
      setSettings({ ...defaultSettings, ...savedSettings });

      const today = new Date().toDateString();
      const savedTodayNew = JSON.parse(localStorage.getItem("crashai_today_new") || "[]");
      const savedTodayReview = JSON.parse(localStorage.getItem("crashai_today_review") || "[]");
      const lastDate = localStorage.getItem("crashai_last_study_date");

      if (lastDate !== today) {
        localStorage.setItem("crashai_today_new", JSON.stringify([]));
        localStorage.setItem("crashai_today_review", JSON.stringify([]));
        localStorage.setItem("crashai_last_study_date", today);
        if (lastDate) {
          const last = new Date(lastDate);
          const todayDate = new Date(today);
          const diff = Math.floor((todayDate.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
          if (diff === 1) {
            const newStreak = (savedStats.streak || 0) + 1;
            const newLongest = Math.max(newStreak, savedStats.longestStreak || 0);
            const s = { ...savedStats, streak: newStreak, longestStreak: newLongest };
            setStats(s);
            localStorage.setItem("crashai_stats", JSON.stringify(s));
          } else if (diff > 1) {
            const s = { ...savedStats, streak: 0 };
            setStats(s);
            localStorage.setItem("crashai_stats", JSON.stringify(s));
          }
        }
      }

      setTodayNew(savedTodayNew.length);
      setTodayReview(savedTodayReview.length);

      buildQueue(allCards, savedReviews, savedTodayNew, savedTodayReview);
    };
    loadData();
  }, []);

  const buildQueue = (allCards: any[], savedReviews: Record<string, CardReview>, todayNewIds: string[], todayReviewIds: string[]) => {
    const now = new Date();

    // 优先级 1: 逾期复习卡
    const dueCards = allCards.filter((card) => {
      const r = savedReviews[card.id];
      if (!r) return false;
      return new Date(r.dueDate) <= now && !todayReviewIds.includes(card.id);
    });

    // 优先级 2: 新卡
    const newCards = allCards.filter((card) => {
      return !savedReviews[card.id] && !todayNewIds.includes(card.id);
    });

    let q: any[] = [];
    if (settings.order === "new-first") {
      q = [...newCards, ...dueCards];
    } else if (settings.order === "review-first") {
      q = [...dueCards, ...newCards];
    } else {
      q = [...newCards, ...dueCards].sort(() => Math.random() - 0.5);
    }

    // 限制每日
    q = q.slice(0, settings.dailyNewLimit + settings.dailyReviewLimit);

    setQueue(q);
    if (q.length === 0) setFinished(true);
  };

  const handleAnswer = (quality: number) => {
    if (!queue[currentIndex]) return;
    const card = queue[currentIndex];
    const oldReview = reviews[card.id] || {
      cardId: card.id,
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      state: "new" as const,
      dueDate: new Date().toISOString(),
      lastReviewed: null,
      totalReviews: 0,
      correctReviews: 0,
    };

    const newReview = sm2(oldReview, quality);
    const newReviews = { ...reviews, [card.id]: newReview };
    setReviews(newReviews);
    localStorage.setItem("crashai_card_reviews", JSON.stringify(newReviews));

    // 累计统计
    const newStats = {
      ...stats,
      totalAttempts: (stats.totalAttempts || 0) + 1,
      totalCorrect: (stats.totalCorrect || 0) + (quality >= 2 ? 1 : 0),
      totalReviewed: (stats.totalReviewed || 0) + 1,
      lastStudyDate: new Date().toDateString(),
      retention: Math.round(
        ((stats.totalCorrect || 0) + (quality >= 2 ? 1 : 0)) /
        ((stats.totalAttempts || 0) + 1) * 100
      ),
    };
    setStats(newStats);
    localStorage.setItem("crashai_stats", JSON.stringify(newStats));

    // 今日新/复习
    if (oldReview.state === "new") {
      const todayNewIds = JSON.parse(localStorage.getItem("crashai_today_new") || "[]");
      todayNewIds.push(card.id);
      localStorage.setItem("crashai_today_new", JSON.stringify(todayNewIds));
      setTodayNew(todayNewIds.length);
    } else {
      const todayReviewIds = JSON.parse(localStorage.getItem("crashai_today_review") || "[]");
      todayReviewIds.push(card.id);
      localStorage.setItem("crashai_today_review", JSON.stringify(todayReviewIds));
      setTodayReview(todayReviewIds.length);
    }

    setFlipped(false);
    if (currentIndex + 1 < queue.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFinished(true);
    }
  };

  const resetProgress = () => {
    if (!confirm("确认重置所有闪卡进度？此操作不可撤销。")) return;
    localStorage.removeItem("crashai_card_reviews");
    localStorage.removeItem("crashai_stats");
    localStorage.removeItem("crashai_today_new");
    localStorage.removeItem("crashai_today_review");
    localStorage.removeItem("crashai_last_study_date");
    setReviews({});
    setStats({ totalReviewed: 0, streak: 0, lastStudyDate: "", retention: 0, totalCorrect: 0, totalAttempts: 0, longestStreak: 0 });
    setTodayNew(0);
    setTodayReview(0);
    setFinished(false);
    setCurrentIndex(0);
    setFlipped(false);
    buildQueue(cards, {}, [], []);
  };

  const saveSettings = () => {
    localStorage.setItem("crashai_anki_settings", JSON.stringify(settings));
    setShowSettings(false);
  };

  // 计算熟练度
  const mastery = cards.length > 0
    ? Math.round(Object.values(reviews).filter((r) => r.state === "review" && r.repetitions >= 2).length / cards.length * 100)
    : 0;

  if (finished) {
    return (
      <div className="min-h-screen pt-24 px-6 flex flex-col items-center justify-center" style={{ background: "linear-gradient(180deg, #FFF5F7 0%, #F0F9FF 100%)" }}>
        <div className="glass-card-strong p-8 text-center max-w-md">
          <Trophy className="h-16 w-16 text-amber-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">🎉 今日完成！</h2>
          <p className="text-sm mb-2" style={{ color: "#94A3B8" }}>
            新学 <span className="font-bold text-cyan-400">{todayNew}</span> 张 · 复习{" "}
            <span className="font-bold text-emerald-400">{todayReview}</span> 张
          </p>
          <p className="text-xs mb-6" style={{ color: "#64748B" }}>
            总进度 {stats.totalReviewed} 张 · 保留率 {stats.retention}%
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={resetProgress}
              className="glass-card px-4 py-2 text-sm flex items-center gap-1"
              style={{ color: "#94A3B8" }}
            >
              <RotateCcw className="h-4 w-4" /> 重置
            </button>
            <button
              onClick={() => {
                setFinished(false);
                setCurrentIndex(0);
                setFlipped(false);
                buildQueue(cards, reviews, [], []);
              }}
              className="glass-card px-4 py-2 text-sm"
              style={{ color: "#A78BFA" }}
            >
              再来一轮
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = queue[currentIndex];
  if (!currentCard) {
    return (
      <div className="min-h-screen pt-24 px-6 flex flex-col items-center justify-center">
        <div className="glass-card p-8 text-center">
          <Brain className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">没有可学习的卡片</h2>
          <p className="text-sm" style={{ color: "#94A3B8" }}>所有卡片已学完，明天再来吧！</p>
        </div>
      </div>
    );
  }

  const currentReview = reviews[currentCard.id];
  const currentState = currentReview?.state || "new";
  const stateInfo = STATE_LABELS[currentState];

  return (
    <div className="min-h-screen pt-20 px-6 pb-16">
      <div className="mx-auto max-w-2xl">
        {/* 统计仪表盘 */}
        {showStats && (
          <div className="glass-card-strong p-5 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400 flex items-center justify-center gap-1">
                  <Flame className="h-5 w-5" />
                  {stats.streak || 0}
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: "#A8A29E" }}>连续天数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400 flex items-center justify-center gap-1">
                  <Brain className="h-5 w-5" />
                  {stats.totalReviewed}
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: "#A8A29E" }}>总复习</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400 flex items-center justify-center gap-1">
                  <TrendingUp className="h-5 w-5" />
                  {stats.retention}%
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: "#A8A29E" }}>保留率</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 flex items-center justify-center gap-1">
                  <Trophy className="h-5 w-5" />
                  {mastery}%
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: "#A8A29E" }}>熟练度</div>
              </div>
            </div>
            {/* 进度条 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs" style={{ color: "#94A3B8" }}>
                <span>今日新学 {todayNew}/{settings.dailyNewLimit}</span>
                <span>今日复习 {todayReview}/{settings.dailyReviewLimit}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden flex" style={{ background: "#1F2937" }}>
                <div
                  className="h-full transition-all"
                  style={{ background: "#06B6D4", width: `${Math.min(todayNew / settings.dailyNewLimit * 100, 100)}%` }}
                />
                <div
                  className="h-full transition-all"
                  style={{ background: "#10B981", width: `${Math.min(todayReview / settings.dailyReviewLimit * 100, 100)}%` }}
                />
              </div>
            </div>
            {stats.longestStreak > 0 && (
              <p className="text-[10px] text-center mt-2" style={{ color: "#64748B" }}>
                🏆 最长连续 {stats.longestStreak} 天
              </p>
            )}
          </div>
        )}

        {/* 顶部控制 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 text-sm" style={{ color: "#94A3B8" }}>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: stateInfo.bg, color: stateInfo.color }}>
              {stateInfo.name}
            </span>
            {currentReview && currentReview.interval > 0 && (
              <span className="inline-flex items-center gap-1 text-xs" style={{ color: "#94A3B8" }}>
                <Calendar className="h-3 w-3" /> 间隔 {currentReview.interval}天
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowStats(!showStats)}
              className="p-2 rounded-lg"
              style={{ color: "#94A3B8" }}
              title="统计"
            >
              <BarChart3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg"
              style={{ color: "#94A3B8" }}
              title="设置"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 设置 */}
        {showSettings && (
          <div className="glass-card p-4 mb-4">
            <h3 className="text-sm font-semibold text-white mb-3">每日设置</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: "#94A3B8" }}>每日新卡</span>
                <input
                  type="number"
                  value={settings.dailyNewLimit}
                  onChange={(e) => setSettings({ ...settings, dailyNewLimit: parseInt(e.target.value) || 1 })}
                  className="w-20 px-2 py-1 rounded text-sm"
                  style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: "#94A3B8" }}>每日复习</span>
                <input
                  type="number"
                  value={settings.dailyReviewLimit}
                  onChange={(e) => setSettings({ ...settings, dailyReviewLimit: parseInt(e.target.value) || 1 })}
                  className="w-20 px-2 py-1 rounded text-sm"
                  style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: "#94A3B8" }}>学习顺序</span>
                <select
                  value={settings.order}
                  onChange={(e) => setSettings({ ...settings, order: e.target.value as any })}
                  className="px-2 py-1 rounded text-sm"
                  style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
                >
                  <option value="mixed">混合</option>
                  <option value="new-first">新卡优先</option>
                  <option value="review-first">复习优先</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={saveSettings}
                  className="px-3 py-1.5 rounded text-sm text-white"
                  style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
                >
                  保存设置
                </button>
                <button
                  onClick={resetProgress}
                  className="px-3 py-1.5 rounded text-sm"
                  style={{ background: "rgba(239,68,68,0.2)", color: "#FCA5A5" }}
                >
                  重置全部
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 闪卡 */}
        <div className="relative perspective-1000 mb-6">
          <div
            onClick={() => setFlipped(!flipped)}
            className="glass-card-strong cursor-pointer min-h-[320px] flex items-center justify-center p-8 transition-all"
            style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)", transformStyle: "preserve-3d" }}
          >
            <div className={cn("text-center w-full", flipped ? "hidden" : "block")}>
              <div className="flex items-center justify-center gap-2 mb-4">
                {currentCard.category && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "#60A5FA20", color: "#93C5FD" }}
                  >
                    {currentCard.category}
                  </span>
                )}
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)", color: "#94A3B8" }}>
                  难度 {currentCard.difficulty || 1}
                </span>
                {currentReview && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: stateInfo.bg, color: stateInfo.color }}>
                    {stateInfo.name}
                  </span>
                )}
              </div>
              <p className="text-xl text-white leading-relaxed whitespace-pre-line">
                {currentCard.question || currentCard.front}
              </p>
              <p className="text-xs mt-6" style={{ color: "#64748B" }}>点击翻转查看答案</p>
            </div>
            <div
              className={cn("text-center w-full", flipped ? "block" : "hidden")}
              style={{ transform: "rotateY(180deg)" }}
            >
              <div className="text-sm mb-3" style={{ color: "#94A3B8" }}>答案</div>
              <div
                className="text-base text-white leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: currentCard.answer || currentCard.back || "" }}
              />
            </div>
          </div>
        </div>

        {/* 评分按钮 */}
        {flipped ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => handleAnswer(0)}
              className="glass-card p-4 text-center hover:scale-105 transition-all"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}
            >
              <div className="text-sm font-medium" style={{ color: "#FCA5A5" }}>😣 Again</div>
              <div className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>{'<'} 1分钟</div>
            </button>
            <button
              onClick={() => handleAnswer(1)}
              className="glass-card p-4 text-center hover:scale-105 transition-all"
              style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)" }}
            >
              <div className="text-sm font-medium" style={{ color: "#FCD34D" }}>🤔 Hard</div>
              <div className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>{'<'} 6分钟</div>
            </button>
            <button
              onClick={() => handleAnswer(2)}
              className="glass-card p-4 text-center hover:scale-105 transition-all"
              style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)" }}
            >
              <div className="text-sm font-medium" style={{ color: "#6EE7B7" }}>👍 Good</div>
              <div className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>{'<'} 10分钟</div>
            </button>
            <button
              onClick={() => handleAnswer(3)}
              className="glass-card p-4 text-center hover:scale-105 transition-all"
              style={{ background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.3)" }}
            >
              <div className="text-sm font-medium" style={{ color: "#93C5FD" }}>✨ Easy</div>
              <div className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>{'<'} 4天</div>
            </button>
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={() => setFlipped(true)}
              className="glass-card-strong px-8 py-3 text-sm text-white font-medium"
            >
              <Zap className="h-4 w-4 inline mr-1" />
              显示答案
            </button>
          </div>
        )}

        {/* 进度 */}
        <div className="mt-6 text-center text-xs" style={{ color: "#64748B" }}>
          {currentIndex + 1} / {queue.length} · 剩余 {queue.length - currentIndex - 1} 张
        </div>
      </div>
    </div>
  );
}
