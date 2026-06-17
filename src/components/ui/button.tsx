import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "default",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none",
        variant === "default" && "bg-indigo-600 text-white hover:bg-indigo-700",
        variant === "outline" && "border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10",
        variant === "ghost" && "text-gray-400 hover:text-white hover:bg-white/5",
        size === "sm" && "h-8 px-3 text-xs",
        size === "md" && "h-10 px-4 text-sm",
        size === "lg" && "h-12 px-6 text-base",
        className
      )}
      {...props}
    />
  );
}
