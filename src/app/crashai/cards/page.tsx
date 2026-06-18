"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { RotateCcw, Settings, Flame, BarChart3, Brain } from "lucide-react";

interface CardReview {
  cardId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  dueDate: string;
  lastReviewed: string | null;
}

interface CardStats {
  totalReviewed: number;
  streak: number;
  lastStudyDate: string;
  retention: number;
}

const defaultSettings = {
  dailyNewLimit: 20,
  dailyReviewLimit: 100,
  order: "mixed" as "mixed" | "new-first" | "review-first",
};

export default function CardsPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [queue, setQueue] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviews, setReviews] = useState<Record<string, CardReview>>({});
  const [stats, setStats] = useState<CardStats>({ totalReviewed: 0, streak: 0, lastStudyDate: "", retention: 0 });
  const [todayNew, setTodayNew] = useState(0);
  const [todayReview, setTodayReview] = useState(0);
  const [settings, setSettings] = useState(defaultSettings);
  const [showSettings, setShowSettings] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      // 通过 API 拿数据，避免 client bundle 拖入 fs
      const res = await fetch("/api/crashai/cards");
      const allCards = res.ok ? await res.json() : [];
      setCards(allCards);

      const savedReviews = JSON.parse(localStorage.getItem("crashai_card_reviews") || "{}");
      setReviews(savedReviews);

      const savedStats = JSON.parse(localStorage.getItem("crashai_stats") || "{}");
      setStats(savedStats);

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
            const s = { ...savedStats, streak: (savedStats.streak || 0) + 1 };
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
    const today = new Date().toDateString();
    const now = new Date();

    const dueCards = allCards.filter((card) => {
      const review = savedReviews[card.id];
      if (!review) return false;
      const dueDate = new Date(review.dueDate);
      return dueDate <= now && !todayReviewIds.includes(card.id);
    }).slice(0, settings.dailyReviewLimit - todayReviewIds.length);

    const newCards = allCards.filter((card) => {
      return !savedReviews[card.id] && !todayNewIds.includes(card.id);
    }).slice(0, settings.dailyNewLimit - todayNewIds.length);

    let q: any[] = [];
    if (settings.order === "new-first") {
      q = [...newCards, ...dueCards];
    } else if (settings.order === "review-first") {
      q = [...dueCards, ...newCards];
    } else {
      q = shuffleArray([...newCards, ...dueCards]);
    }

    setQueue(q);
    if (q.length === 0) setFinished(true);
  };

  const shuffleArray = (array: any[]) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const handleAnswer = (rating: number) => {
    if (!queue[currentIndex]) return;

    const card = queue[currentIndex];
    const quality = rating === 1 ? 0 : rating === 2 ? 1 : rating === 3 ? 3 : 5;

    let review = reviews[card.id] || {
      cardId: card.id,
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      dueDate: new Date().toISOString(),
      lastReviewed: null,
    };

    let newInterval = review.interval;
    let newRepetitions = review.repetitions;
    let newEaseFactor = review.easeFactor;

    if (quality < 3) {
      newInterval = 0;
      newRepetitions = 0;
    } else {
      newRepetitions = review.repetitions + 1;
      if (newRepetitions === 1) {
        newInterval = 1;
      } else if (newRepetitions === 2) {
        newInterval = 6;
      } else {
        newInterval = Math.round(review.interval * review.easeFactor);
      }
      newEaseFactor = Math.max(1.3, review.easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + newInterval);

    const updatedReview = {
      cardId: card.id,
      easeFactor: newEaseFactor,
      interval: newInterval,
      repetitions: newRepetitions,
      dueDate: dueDate.toISOString(),
      lastReviewed: new Date().toISOString(),
    };

    const newReviews = { ...reviews, [card.id]: updatedReview };
    setReviews(newReviews);
    localStorage.setItem("crashai_card_reviews", JSON.stringify(newReviews));

    const newStats = {
      ...stats,
      totalReviewed: (stats.totalReviewed || 0) + 1,
      lastStudyDate: new Date().toDateString(),
    };
    setStats(newStats);
    localStorage.setItem("crashai_stats", JSON.stringify(newStats));

    const today = new Date().toDateString();
    if (!review.lastReviewed) {
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
    localStorage.removeItem("crashai_card_reviews");
    localStorage.removeItem("crashai_stats");
    localStorage.removeItem("crashai_today_new");
    localStorage.removeItem("crashai_today_review");
    localStorage.removeItem("crashai_last_study_date");
    setReviews({});
    setStats({ totalReviewed: 0, streak: 0, lastStudyDate: "", retention: 0 });
    setTodayNew(0);
    setTodayReview(0);
    setCurrentIndex(0);
    setFlipped(false);
    setFinished(false);
    buildQueue(cards, {}, [], []);
  };

  const saveSettings = () => {
    localStorage.setItem("crashai_anki_settings", JSON.stringify(settings));
    setShowSettings(false);
  };

  if (finished) {
    return (
      <div className="min-h-screen pt-24 px-6 flex flex-col items-center justify-center">
        <div className="glass-card p-8 text-center">
          <Brain className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">今日完成！🎉</h2>
          <p className="text-gray-400 mb-6">新学 {todayNew} 张 · 复习 {todayReview} 张 · 总进度 {stats.totalReviewed} 张</p>
          <div className="flex gap-3">
            <button onClick={resetProgress} className="glass-card px-4 py-2 text-sm text-gray-300 hover:text-white">
              <RotateCcw className="h-4 w-4 inline mr-1" /> 重置
            </button>
            <button onClick={() => { setFinished(false); setCurrentIndex(0); setFlipped(false); }} className="glass-card px-4 py-2 text-sm text-indigo-300 hover:text-white">
              继续学习
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
          <h2 className="text-2xl font-bold text-white mb-2">今日完成！🎉</h2>
          <p className="text-gray-400">所有卡片已学完，明天再来吧！</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-6 pb-16">
      <div className="mx-auto max-w-2xl">
        {/* Stats bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-gray-400">
              <Flame className="h-4 w-4 text-orange-400" /> 连续 {stats.streak} 天
            </div>
            <div className="text-gray-500">新学 {todayNew}/{settings.dailyNewLimit}</div>
            <div className="text-gray-500">复习 {todayReview}/{settings.dailyReviewLimit}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowSettings(!showSettings)} className="p-2 text-gray-400 hover:text-white">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        {showSettings && (
          <div className="glass-card p-4 mb-6">
            <h3 className="text-sm font-semibold text-white mb-3">设置</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">每日新卡</span>
                <input type="number" value={settings.dailyNewLimit} onChange={(e) => setSettings({ ...settings, dailyNewLimit: parseInt(e.target.value) || 1 })} className="w-20 bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">每日复习</span>
                <input type="number" value={settings.dailyReviewLimit} onChange={(e) => setSettings({ ...settings, dailyReviewLimit: parseInt(e.target.value) || 1 })} className="w-20 bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">学习顺序</span>
                <select value={settings.order} onChange={(e) => setSettings({ ...settings, order: e.target.value as any })} className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white">
                  <option value="mixed">混合</option>
                  <option value="new-first">新卡优先</option>
                  <option value="review-first">复习优先</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={saveSettings} className="px-3 py-1 bg-indigo-500 rounded text-sm text-white">保存</button>
                <button onClick={resetProgress} className="px-3 py-1 bg-red-500/20 rounded text-sm text-red-300">重置全部进度</button>
              </div>
            </div>
          </div>
        )}

        {/* Card */}
        <div className="relative perspective-1000 mb-8">
          <div
            onClick={() => setFlipped(!flipped)}
            className={cn(
              "glass-card-strong cursor-pointer min-h-[300px] flex items-center justify-center p-8 transition-all duration-500",
              flipped ? "" : ""
            )}
            style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)", transformStyle: "preserve-3d" }}
          >
            <div
              className={cn(
                "text-center w-full",
                flipped ? "hidden" : "block"
              )}
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                  {currentCard.category || "通用"}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400">
                  难度 {currentCard.difficulty || 1}
                </span>
              </div>
              <p className="text-xl text-white leading-relaxed whitespace-pre-line">{currentCard.question || currentCard.front}</p>
              <p className="text-xs text-gray-500 mt-6">点击翻转查看答案</p>
            </div>
            <div
              className={cn(
                "text-center w-full",
                flipped ? "block" : "hidden"
              )}
              style={{ transform: "rotateY(180deg)" }}
            >
              <div className="text-sm text-gray-400 mb-2">答案</div>
              <div
                className="text-base text-white leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: currentCard.answer || currentCard.back || "" }}
              />
            </div>
          </div>
        </div>

        {/* Answer buttons */}
        {flipped && (
          <div className="grid grid-cols-4 gap-3">
            <button onClick={() => handleAnswer(1)} className="glass-card p-3 text-center hover:bg-red-500/20 transition-all">
              <div className="text-sm font-medium text-red-400">Again</div>
              <div className="text-xs text-gray-500">{'<'} 1min</div>
            </button>
            <button onClick={() => handleAnswer(2)} className="glass-card p-3 text-center hover:bg-orange-500/20 transition-all">
              <div className="text-sm font-medium text-orange-400">Hard</div>
              <div className="text-xs text-gray-500">{'<'} 6min</div>
            </button>
            <button onClick={() => handleAnswer(3)} className="glass-card p-3 text-center hover:bg-green-500/20 transition-all">
              <div className="text-sm font-medium text-green-400">Good</div>
              <div className="text-xs text-gray-500">{'<'} 10min</div>
            </button>
            <button onClick={() => handleAnswer(4)} className="glass-card p-3 text-center hover:bg-blue-500/20 transition-all">
              <div className="text-sm font-medium text-blue-400">Easy</div>
              <div className="text-xs text-gray-500">{'<'} 4d</div>
            </button>
          </div>
        )}

        {!flipped && (
          <div className="text-center">
            <button onClick={() => setFlipped(true)} className="glass-card px-6 py-2 text-sm text-white">
              显示答案
            </button>
          </div>
        )}

        <div className="mt-6 text-center text-xs text-gray-500">
          {currentIndex + 1} / {queue.length} · 剩余 {queue.length - currentIndex - 1} 张
        </div>
      </div>
    </div>
  );
}
