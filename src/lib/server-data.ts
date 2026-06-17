// 临时 stub - 老的 crashai / lesson-content 用的数据加载层
// 后续会把 crashai 完整迁移到 Prisma + Blog 体系
// 现在返回空数据，避免 page crash

import "server-only";
import { promises as fs } from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "src", "content");

async function readJsonSafe<T = unknown>(filename: string, fallback: T): Promise<T> {
  try {
    const data = await fs.readFile(path.join(CONTENT_DIR, filename), "utf-8");
    return JSON.parse(data);
  } catch {
    return fallback;
  }
}

export async function getLessons() {
  return readJsonSafe<any[]>("lessons.json", []);
}

export async function getCards() {
  return readJsonSafe<any[]>("cards.json", []);
}

export async function getLessonBySlug(slug: string) {
  const lessons = await getLessons();
  return lessons.find((l: { slug: string }) => l.slug === slug) || null;
}

export async function getCardsByLessonSlug(slug: string) {
  const cards = await getCards();
  return cards.filter((c: { lessonSlug: string }) => c.lessonSlug === slug);
}

// 兼容旧 server-data API
export async function checkPermission(userId: string, site: string, action: string): Promise<boolean> {
  // 临时：所有登录用户都有权限
  return Boolean(userId);
}

export async function isSiteAccessible(site: string, userId: string): Promise<boolean> {
  return Boolean(userId);
}

// 兼容旧 API
export const loadLessons = getLessons;
export const loadCards = getCards;

export type Site = "crashai" | "kids-ai" | "knowledge-base" | "picturebook" | "blog" | "merchandise";
export type Role = "GUEST" | "USER" | "SUBSCRIBER" | "EDITOR" | "ADMIN" | "SUPERADMIN";

// Lesson/Section 类型（lesson-content 用）
export type SectionType =
  | "text" | "code" | "math" | "diagram" | "callout"
  | "formula" | "table" | "example" | "exercise" | "comparison";

export interface Section {
  title: string;
  content: string;
  note?: string;
  type?: SectionType;
  code?: string;
  language?: string;
  answer?: string;
  // 表格/对比数据
  headers?: string[];
  rows?: string[][];
  left?: { title: string; items: string[] };
  right?: { title: string; items: string[] };
}
export interface Lesson {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: number;
  phase: string;
  order: number;
  sections: Section[];
}
