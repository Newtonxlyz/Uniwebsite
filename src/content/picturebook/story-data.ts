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

export async function getAllStories(): Promise<StoryEntry[]> {
  if (cachedStories) return cachedStories;
  
  const filePath = path.join(process.cwd(), "src", "content", "picturebook", "stories.json");
  const raw = await fs.readFile(filePath, "utf-8");
  cachedStories = JSON.parse(raw) as StoryEntry[];
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
