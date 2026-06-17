"use client";

import { useState } from "react";
import { ChevronDown, Brain, Lightbulb, Play } from "lucide-react";
import type { KidsLesson } from "@/content/kids-ai/lessons";

export default function LessonCard({
  lesson,
  defaultOpen = false,
}: {
  lesson: KidsLesson;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [showActivity, setShowActivity] = useState(false);

  return (
    <div className="glass-card overflow-hidden transition-all">
      {/* Header - always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex items-center gap-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-3xl flex-shrink-0">{lesson.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-semibold text-sm md:text-base">
              {lesson.title}
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0">
              {lesson.age}
            </span>
          </div>
          <p className="text-xs text-gray-500 line-clamp-2">{lesson.summary}</p>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expandable content */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 pb-5 space-y-4">
          {/* Concept */}
          <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/10">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">核心概念</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              {lesson.concept}
            </p>
          </div>

          {/* Example */}
          <div className="bg-cyan-500/5 rounded-xl p-4 border border-cyan-500/10">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-medium text-cyan-400">生动例子</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
              {lesson.example}
            </p>
          </div>

          {/* Activity */}
          <div>
            <button
              onClick={() => setShowActivity(!showActivity)}
              className="flex items-center gap-2 text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors"
            >
              <Play className="h-3 w-3" />
              {showActivity ? "隐藏小挑战" : "小挑战 🎯"}
            </button>
            {showActivity && (
              <div className="mt-2 bg-amber-500/5 rounded-xl p-4 border border-amber-500/10">
                <p className="text-sm text-gray-300 leading-relaxed">
                  {lesson.activity}
                </p>
              </div>
            )}
          </div>

          {/* Vocabulary */}
          <div className="flex flex-wrap gap-2">
            {lesson.vocab.map((v) => (
              <span
                key={v.word}
                className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10"
                title={v.meaning}
              >
                📝 {v.word}: {v.meaning}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
