"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  percent: number;
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  percent,
  size = "md",
  color = "#6366f1",
  className,
  showLabel = true,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));

  const sizeClasses = {
    sm: "h-1.5 text-xs",
    md: "h-2.5 text-sm",
    lg: "h-4 text-sm",
  };

  const radiusClasses = {
    sm: "rounded-full",
    md: "rounded-full",
    lg: "rounded-full",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "flex-1 overflow-hidden bg-white/10",
          sizeClasses[size],
          radiusClasses[size]
        )}
      >
        <div
          className={cn(
            "h-full transition-all duration-700 ease-out",
            radiusClasses[size]
          )}
          style={{
            width: `${clamped}%`,
            background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          }}
        />
      </div>
      {showLabel && (
        <span className="shrink-0 text-xs font-medium text-gray-400">
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
}
