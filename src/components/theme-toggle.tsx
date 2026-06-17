"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 读 localStorage
    const stored = localStorage.getItem("lvyz-theme") as Theme | null;
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
    localStorage.setItem("lvyz-theme", theme);
  }, [theme, mounted]);

  if (!mounted) {
    return (
      <button
        aria-label="切换主题"
        className="glass-card flex h-9 w-9 items-center justify-center rounded-full text-white/80 hover:scale-105"
      >
        <Sun className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="切换主题"
      title={theme === "dark" ? "切换到日间" : "切换到夜间"}
      className="glass-card flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-all hover:scale-105"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
