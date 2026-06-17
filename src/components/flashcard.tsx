"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { RotateCcw, Eye, EyeOff } from "lucide-react";

interface FlashcardProps {
  front: string;
  back: string;
  type: string;
  onAnswer: (quality: number) => void;
}

const typeColors: Record<string, string> = {
  "概念": "bg-blue-500/20 text-blue-400",
  "公式": "bg-amber-500/20 text-amber-400",
  "对比": "bg-purple-500/20 text-purple-400",
  "应用": "bg-emerald-500/20 text-emerald-400",
  "代码": "bg-cyan-500/20 text-cyan-400",
};

export function Flashcard({ front, back, type, onAnswer }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped((prev) => !prev);
  };

  const handleAnswer = (quality: number) => {
    setFlipped(false);
    onAnswer(quality);
  };

  const badgeClass = typeColors[type] || "bg-gray-500/20 text-gray-400";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-lg" style={{ perspective: "1000px" }}>
        <div
          className={cn(
            "glass-card-strong relative w-full min-h-[240px] cursor-pointer transition-transform duration-500",
            "flex flex-col items-center justify-center p-8 text-center"
          )}
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
          onClick={handleFlip}
        >
          {/* Front */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center p-8",
              flipped ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className={cn("mb-4 px-3 py-1 rounded-full text-xs font-medium", badgeClass)}>
              {type}
            </span>
            <p className="text-lg font-medium text-white whitespace-pre-wrap">{front}</p>
            <p className="mt-4 text-xs text-gray-500">点击翻转查看答案</p>
          </div>

          {/* Back */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center p-8",
              flipped ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <span className={cn("mb-4 px-3 py-1 rounded-full text-xs font-medium", badgeClass)}>
              {type}
            </span>
            <p className="text-base text-gray-200 whitespace-pre-wrap">{back}</p>
          </div>
        </div>
      </div>

      {flipped && (
        <div className="flex flex-wrap gap-2 justify-center animate-fade-in">
          <button
            onClick={() => handleAnswer(0)}
            className="glass-card px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:border-red-400/30 transition-all"
          >
            重来 (Again)
          </button>
          <button
            onClick={() => handleAnswer(3)}
            className="glass-card px-4 py-2 text-sm text-amber-400 hover:bg-amber-500/10 hover:border-amber-400/30 transition-all"
          >
            困难 (Hard)
          </button>
          <button
            onClick={() => handleAnswer(4)}
            className="glass-card px-4 py-2 text-sm text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400/30 transition-all"
          >
            良好 (Good)
          </button>
          <button
            onClick={() => handleAnswer(5)}
            className="glass-card px-4 py-2 text-sm text-blue-400 hover:bg-blue-500/10 hover:border-blue-400/30 transition-all"
          >
            简单 (Easy)
          </button>
        </div>
      )}
    </div>
  );
}
