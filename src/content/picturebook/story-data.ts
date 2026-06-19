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
  const mergedMain = [...main];
  const extraFiles = ["story-dark-cave.json"];
  for (const fname of extraFiles) {
    try {
      const p = path.join(process.cwd(), "src", "content", "picturebook", fname);
      const r = await fs.readFile(p, "utf-8");
      const data = JSON.parse(r);
      const idx = mergedMain.findIndex((s) => s.id === data.id);
      if (idx >= 0) {
        // 主 stories.json 已有同 id：用 extra 覆盖 text/image/image_dir
        mergedMain[idx] = mergeExtra(data, mergedMain[idx]);
      } else {
        extras.push(loadExtraStory(data));
      }
    } catch {
      // 文件不存在则跳过
    }
  }

  cachedStories = [...mergedMain, ...extras];
  return cachedStories;
}

// 用 extra JSON 覆盖主 stories.json 同 id 的记录（填充真实 text/image）
function mergeExtra(extra: any, mainStory: StoryEntry): StoryEntry {
  const pages = (extra.pages || []).filter((p: any) => p.page_number > 0);
  return {
    ...mainStory,
    title: extra.title || mainStory.title,
    desc: extra.description || mainStory.desc,
    age: extra.age_range || mainStory.age,
    time: extra.reading_time || mainStory.time,
    chars: mainStory.chars?.length ? mainStory.chars : Object.keys({ 雷迪嘎嘎: 1, 噶巴巴: 1, 噶丫丫: 1 }),
    text: pages.map((p: any) => ({
      page: p.page_number,
      body: stripMarkdown(p.text || ""),
      image: p.image,
    })) as any,
    illustrated: pages.some((p: any) => p.image && p.image.length > 0),
    image_dir: `stories/${extra.id}`, // 强制 stories/ 前缀对齐 R2
  };
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
