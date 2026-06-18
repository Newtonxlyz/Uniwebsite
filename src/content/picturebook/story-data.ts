import "server-only";
import { promises as fs } from "fs";
import path from "path";

export interface StoryText {
  page: number;
  body: string;
}

export interface StoryEntry {
  id: string;
  title: string;
  emoji: string;
  series: string;
  series_category: string;
  desc: string;
  pages: number;
  age: string;
  time: number;
  status: string;
  chars: string[];
  tags: string[];
  text?: StoryText[];
  illustrated: boolean;
  image_dir?: string;
  source: string;
}

let cachedStories: StoryEntry[] | null = null;

function loadExtraStory(extra: any): StoryEntry {
  // 将 story-dark-cave.json 的扁平 pages 转成主 schema
  const pages = (extra.pages || []).filter((p: any) => p.page_number > 0);
  // 角色名 → slug 映射（character.json 暂无 id 字段，先用英文别名 slug）
  const charSlug: Record<string, string> = {
    "雷迪嘎嘎": "lady-gaga",
    "噶巴巴": "gababa",
    "噶丫丫": "gayaya",
  };
  return {
    id: extra.id,
    title: extra.title,
    emoji: "🦉",
    series: "儿童情感引导",
    series_category: extra.series_id || "emotion",
    desc: extra.description || extra.desc || "",
    pages: pages.length,
    age: extra.age_range || "3-8",
    time: extra.reading_time || 8,
    status: "published",
    chars: Object.keys(charSlug), // 用此三角色
    tags: ["怕黑", "兄妹情", "情感引导"],
    text: pages.map((p: any) => ({
      page: p.page_number,
      body: stripMarkdown(p.text || ""),
      image: p.image,
    })) as any,
    illustrated: pages.some((p: any) => p.image && p.image.length > 0),
    image_dir: `stories/${extra.id}`,
    source: "extra",
  };
}

function stripMarkdown(s: string): string {
  return s
    .replace(/^#+\s*/gm, "")          // 去掉 # ## ### 标题
    .replace(/^---+\s*$/gm, "")        // 去掉 --- 分隔
    .replace(/\*\*(.+?)\*\*/g, "$1")   // **粗体** → 粗体
    .replace(/\*(.+?)\*/g, "$1")       // *斜体* → 斜体
    .trim();
}

export async function getAllStories(): Promise<StoryEntry[]> {
  if (cachedStories) return cachedStories;
  
  const filePath = path.join(process.cwd(), "src", "content", "picturebook", "stories.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const main = JSON.parse(raw) as StoryEntry[];

  // 合并额外的单文件故事（如 story-dark-cave.json）
  const extras: StoryEntry[] = [];
  const extraFiles = ["story-dark-cave.json"];
  for (const fname of extraFiles) {
    try {
      const p = path.join(process.cwd(), "src", "content", "picturebook", fname);
      const r = await fs.readFile(p, "utf-8");
      const data = JSON.parse(r);
      // 避免重复
      if (!main.find((s) => s.id === data.id)) {
        extras.push(loadExtraStory(data));
      }
    } catch {
      // 文件不存在则跳过
    }
  }

  cachedStories = [...main, ...extras];
  return cachedStories;
}

export async function getStoryById(id: string): Promise<StoryEntry | null> {
  const stories = await getAllStories();
  return stories.find((s) => s.id === id) || null;
}

export async function getStoriesBySeries(seriesName: string): Promise<StoryEntry[]> {
  const stories = await getAllStories();
  return stories.filter((s) => s.series === seriesName);
}

export async function getStoriesByCharacter(charName: string): Promise<StoryEntry[]> {
  const stories = await getAllStories();
  return stories.filter((s) => s.chars.includes(charName));
}

export async function searchStories(query: string): Promise<StoryEntry[]> {
  const stories = await getAllStories();
  const q = query.toLowerCase();
  return stories.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.series.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q))
  );
}
