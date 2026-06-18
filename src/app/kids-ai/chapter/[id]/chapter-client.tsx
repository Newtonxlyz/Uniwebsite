"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles, Star, ChevronRight, ChevronLeft, BookOpen, Gamepad2,
  Pencil, Trophy, CheckCircle2, X, Play,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CharInfo = { name: string; emoji: string; color: string };

type Dialog = { type: "dialog"; character?: string; text: string };
type Text = { type: "text"; text: string };
type Quiz = { type: "quiz"; question: string; options: string[]; correctAnswer: number; explanation: string };
type Interactive = { type: "interactive"; text: string };

type Content = Dialog | Text | Quiz | Interactive;

const TYPE_LABEL: Record<string, { name: string; icon: any; color: string }> = {
  knowledge: { name: "知识", icon: BookOpen, color: "#60A5FA" },
  interactive: { name: "互动", icon: Gamepad2, color: "#A78BFA" },
  game: { name: "游戏", icon: Gamepad2, color: "#FB923C" },
  create: { name: "创作", icon: Pencil, color: "#34D399" },
  summary: { name: "总结", icon: Trophy, color: "#FFE66D" },
};

export function ChapterClient({
  chapterId,
  chapterTitle,
  nodes,
  charInfo,
}: {
  chapterId: number;
  chapterTitle: string;
  nodes: any[];
  charInfo: Record<string, CharInfo>;
}) {
  const [currentNode, setCurrentNode] = useState(0);
  const [completedNodes, setCompletedNodes] = useState<number[]>([]);
  const [quizResult, setQuizResult] = useState<{ correct: boolean; idx: number } | null>(null);

  // 读 localStorage 进度
  useEffect(() => {
    const saved = localStorage.getItem(`kids-ai-chapter-${chapterId}-progress`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCompletedNodes(parsed.completed || []);
      } catch {}
    }
  }, [chapterId]);

  // 保存进度
  const saveProgress = (completed: number[]) => {
    localStorage.setItem(
      `kids-ai-chapter-${chapterId}-progress`,
      JSON.stringify({ completed, updatedAt: new Date().toISOString() })
    );
  };

  const node = nodes[currentNode];
  if (!node) {
    return <div className="text-center text-gray-500">本章无内容</div>;
  }

  const typeInfo = TYPE_LABEL[node.type] || TYPE_LABEL.knowledge;
  const TypeIcon = typeInfo.icon;
  const isCompleted = completedNodes.includes(currentNode);
  const allCompleted = nodes.every((_, i) => completedNodes.includes(i));

  const markComplete = () => {
    if (!isCompleted) {
      const next = [...completedNodes, currentNode];
      setCompletedNodes(next);
      saveProgress(next);
    }
  };

  const goNext = () => {
    if (currentNode < nodes.length - 1) {
      markComplete();
      setCurrentNode(currentNode + 1);
      setQuizResult(null);
    } else {
      markComplete();
    }
  };

  const goPrev = () => {
    if (currentNode > 0) {
      setCurrentNode(currentNode - 1);
      setQuizResult(null);
    }
  };

  return (
    <div>
      {/* 节点卡片 */}
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
        <div className="flex items-center gap-2 mb-4">
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white"
            style={{ background: typeInfo.color }}
          >
            <TypeIcon className="h-3 w-3" />
            {typeInfo.name}
          </span>
          <h2 className="text-lg font-bold text-gray-800">{node.title}</h2>
          {isCompleted && (
            <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
          )}
        </div>

        <div className="space-y-4">
          {(node.content || []).map((c: Content, i: number) => {
            if (c.type === "dialog") {
              const ch = c.character ? charInfo[c.character] : null;
              return (
                <div key={i} className="flex items-start gap-3">
                  {ch && (
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl"
                      style={{ background: `${ch.color}30`, border: `2px solid ${ch.color}` }}
                    >
                      {ch.emoji}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {ch && (
                      <div className="text-xs font-bold mb-1" style={{ color: ch.color }}>
                        {ch.name}
                      </div>
                    )}
                    <div className="bg-gray-50 rounded-2xl rounded-tl-sm p-3 text-sm text-gray-800">
                      {c.text}
                    </div>
                  </div>
                </div>
              );
            }
            if (c.type === "text") {
              return (
                <div
                  key={i}
                  className="bg-blue-50 rounded-2xl p-4 text-sm text-gray-800 whitespace-pre-line"
                >
                  {c.text}
                </div>
              );
            }
            if (c.type === "quiz") {
              return (
                <div key={i} className="bg-yellow-50 rounded-2xl p-4">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    {c.question}
                  </h3>
                  <div className="space-y-2">
                    {c.options.map((opt, oi) => {
                      const isCorrect = oi === c.correctAnswer;
                      const wasClicked = quizResult !== null;
                      const showCorrect = wasClicked && isCorrect;
                      const showWrong = wasClicked && quizResult?.idx === oi && !isCorrect;
                      return (
                        <button
                          key={oi}
                          onClick={() => setQuizResult({ correct: isCorrect, idx: oi })}
                          className={cn(
                            "w-full text-left p-3 rounded-xl border-2 transition-all text-sm",
                            !wasClicked && "bg-white border-gray-200 hover:border-pink-300 hover:bg-pink-50",
                            showCorrect && "bg-green-50 border-green-400 text-green-800",
                            showWrong && "bg-red-50 border-red-400 text-red-800"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-500">
                              {String.fromCharCode(65 + oi)}.
                            </span>
                            <span className="flex-1">{opt}</span>
                            {showCorrect && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                            {showWrong && <X className="h-4 w-4 text-red-500" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {quizResult && (
                    <div
                      className={cn(
                        "mt-3 p-3 rounded-xl text-sm",
                        quizResult.correct
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      )}
                    >
                      {quizResult.correct ? "✓ 答对了！" : "✗ 再想想哦"}
                      {c.explanation && (
                        <div className="mt-1 text-xs opacity-80">{c.explanation}</div>
                      )}
                    </div>
                  )}
                </div>
              );
            }
            if (c.type === "interactive") {
              return (
                <div
                  key={i}
                  className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 text-center"
                >
                  <Gamepad2 className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <p className="text-sm text-gray-700">
                    🎮 互动游戏：{c.text}
                  </p>
                  <button className="mt-2 inline-flex items-center gap-1 px-4 py-2 rounded-full bg-white text-sm font-medium hover:scale-105 transition-transform shadow">
                    <Play className="h-3 w-3" />
                    开始玩
                  </button>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>

      {/* 进度 + 导航 */}
      <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>进度 {currentNode + 1} / {nodes.length}</span>
          <span>{completedNodes.length} / {nodes.length} 已完成</span>
        </div>
        <div className="flex gap-1">
          {nodes.map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 h-2 rounded-full",
                i < currentNode
                  ? "bg-green-400"
                  : i === currentNode
                  ? "bg-pink-400"
                  : "bg-gray-200"
              )}
            />
          ))}
        </div>
      </div>

      {/* 上一/下一 */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={goPrev}
          disabled={currentNode === 0}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-gray-700 font-medium shadow disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
          上一节
        </button>
        <button
          onClick={goNext}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-white font-medium shadow hover:scale-105 transition-all"
          style={{ background: "linear-gradient(135deg, #FF6B9D 0%, #A78BFA 100%)" }}
        >
          {currentNode === nodes.length - 1 ? "完成本章" : "下一节"}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* 完成提示 */}
      {allCompleted && (
        <div
          className="mt-6 rounded-2xl p-6 text-center text-white shadow-lg"
          style={{ background: "linear-gradient(135deg, #34D399 0%, #60A5FA 100%)" }}
        >
          <Trophy className="h-12 w-12 mx-auto mb-3" />
          <h2 className="text-2xl font-bold mb-2">🎉 恭喜完成本章！</h2>
          <p className="opacity-90 mb-4">你获得了「{node.title}」徽章！</p>
          <Link
            href="/kids-ai"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white font-bold hover:scale-105 transition-all"
            style={{ color: "#34D399" }}
          >
            返回学习地图
          </Link>
        </div>
      )}
    </div>
  );
}
