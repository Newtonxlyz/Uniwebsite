"use client";

import { cn } from "@/lib/utils";
import { Lock, CheckCircle, BookOpen } from "lucide-react";
import Link from "next/link";
import { ProgressBar } from "./progress-bar";

export interface LessonCardProps {
  title: string;
  description: string;
  slug: string;
  progress: number;
  category: string;
  icon?: React.ReactNode;
  status?: "locked" | "unlocked" | "complete";
  order?: number;
}

export function LessonCard({
  title,
  description,
  slug,
  progress,
  category,
  icon,
  status = "unlocked",
  order,
}: LessonCardProps) {
  const isLocked = status === "locked";
  const isComplete = status === "complete";

  const statusIcon = isLocked ? (
    <Lock className="h-4 w-4 text-gray-500" />
  ) : isComplete ? (
    <CheckCircle className="h-4 w-4 text-emerald-400" />
  ) : (
    <BookOpen className="h-4 w-4 text-indigo-400" />
  );

  const cardContent = (
    <div
      className={cn(
        "glass-card group relative p-5",
        isLocked && "opacity-60 cursor-not-allowed"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon || "📚"}</span>
          <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
            {category}
          </span>
        </div>
        {statusIcon}
      </div>

      <h3 className="text-base font-semibold text-white mb-1 group-hover:text-gradient transition-all">
        {title}
      </h3>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{description}</p>

      {order !== undefined && (
        <div className="text-xs text-gray-600 mb-3">第 {order} 课</div>
      )}

      <ProgressBar
        percent={progress}
        size="sm"
        color={isComplete ? "#10b981" : "#6366f1"}
        showLabel={progress > 0}
      />
    </div>
  );

  if (isLocked) {
    return <div className="block">{cardContent}</div>;
  }

  return (
    <Link href={`/crashai/${slug}`} className="block">
      {cardContent}
    </Link>
  );
}
