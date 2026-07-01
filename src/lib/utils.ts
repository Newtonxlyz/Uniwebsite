import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 把任意字符串转成 url-safe slug（中文 → pinyin 略，简化为 hash 后缀）
export function slugify(input: string): string {
  if (!input) return "";
  // 先做基本转换：去除前后空白、转小写
  let s = String(input).trim().toLowerCase();
  // 中文转拼音略过，用 hash 短码保唯一
  // ASCII 部分正常 slugify
  s = s
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9\-\u4e00-\u9fa5]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (!s) {
    // 全中文/全特殊字符时，给一个 6 位随机后缀
    s = `story-${Math.random().toString(36).slice(2, 8)}`;
  }
  return s;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + " MB";
  return (bytes / 1024 / 1024 / 1024).toFixed(2) + " GB";
}
