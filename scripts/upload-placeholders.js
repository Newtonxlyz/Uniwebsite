// 生成 20 张 SVG 占位插图 + 上传 R2
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

// 手动解析 .env
if (existsSync(".env")) {
  const envContent = readFileSync(".env", "utf-8");
  for (const line of envContent.split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*"?([^"]*)"?/);
    if (m) process.env[m[1]] = m[2];
  }
}

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME || "lvyzorg";
const PUBLIC_URL = process.env.R2_PUBLIC_URL || "https://media.lvyz.org";
const PREFIX = "picturebook/dark-cave";

// 20 页场景描述（从 prompts.md 提取）
const SCENES = [
  { title: "夕阳下", desc: "树洞里两小只读图画书", emoji: "🌅", color: "#FCD34D" },
  { title: "狂风来", desc: "蜡烛熄灭了", emoji: "🌪️", color: "#94A3B8" },
  { title: "漆黑一片", desc: "只有两双发光的眼睛", emoji: "🌑", color: "#1E293B" },
  { title: "丫丫的呼唤", desc: "轻柔的梳理羽毛声", emoji: "🪶", color: "#7DD3FC" },
  { title: "触到妹妹", desc: "黑暗中的连接", emoji: "💞", color: "#F472B6" },
  { title: "翅膀发抖", desc: "丫丫说看不见", emoji: "😢", color: "#A78BFA" },
  { title: "巴巴的勇气", desc: "握住妹妹的翅膀", emoji: "💪", color: "#FBBF24" },
  { title: "一起听", desc: "外面的风雨声", emoji: "🌧️", color: "#60A5FA" },
  { title: "想起萤火虫", desc: "夏夜的小光点", emoji: "✨", color: "#34D399" },
  { title: "看到彼此", desc: "眼中的微光", emoji: "👀", color: "#F87171" },
  { title: "讲爸爸的故事", desc: "他曾经说过的话", emoji: "👨‍👧‍👦", color: "#FCA5A5" },
  { title: "温暖的回忆", desc: "爸爸的拥抱", emoji: "🤗", color: "#FB923C" },
  { title: "雨声变音乐", desc: "嘀嗒嘀嗒", emoji: "🎵", color: "#A78BFA" },
  { title: "一起唱歌", desc: "乌鸦小调", emoji: "🎶", color: "#EC4899" },
  { title: "风雨停了", desc: "月光照进树洞", emoji: "🌙", color: "#818CF8" },
  { title: "爸爸回来了", desc: "带着萤火虫", emoji: "🪲", color: "#FACC15" },
  { title: "亮起来的家", desc: "温暖的烛光", emoji: "🕯️", color: "#F59E0B" },
  { title: "爸爸的夸奖", desc: "你们真勇敢", emoji: "👏", color: "#34D399" },
  { title: "夜深了", desc: "两小只依偎", emoji: "😴", color: "#6366F1" },
  { title: "甜甜的梦", desc: "黑黑的不再可怕", emoji: "💤", color: "#A78BFA" },
];

function makeSVG(page, scene) {
  const w = 1024;
  const h = 768;
  // 径向渐变 + 大 emoji + 标题 + 描述 + 页码
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <radialGradient id="g" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="${scene.color}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#0F172A" stop-opacity="1"/>
    </radialGradient>
    <linearGradient id="frame" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FBBF24" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#F472B6" stop-opacity="0.6"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect x="20" y="20" width="${w - 40}" height="${h - 40}" fill="none" stroke="url(#frame)" stroke-width="4" rx="20"/>
  <text x="50%" y="35%" text-anchor="middle" font-size="240" font-family="Segoe UI Emoji, Apple Color Emoji, sans-serif">${scene.emoji}</text>
  <text x="50%" y="65%" text-anchor="middle" font-size="56" font-weight="bold" fill="#F8FAFC" font-family="Microsoft YaHei, sans-serif">${scene.title}</text>
  <text x="50%" y="75%" text-anchor="middle" font-size="32" fill="#94A3B8" font-family="Microsoft YaHei, sans-serif">${scene.desc}</text>
  <text x="50%" y="92%" text-anchor="middle" font-size="28" fill="#64748B" font-family="Microsoft YaHei, sans-serif">第 ${page} / 20 页</text>
  <text x="50%" y="96%" text-anchor="middle" font-size="18" fill="#475569" font-family="Microsoft YaHei, sans-serif">黑黑的洞穴我不怕 · 占位插图（待替换）</text>
</svg>`;
}

async function uploadSVG(content, key) {
  await r2.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: content,
    ContentType: "image/svg+xml",
    CacheControl: "public, max-age=31536000, immutable",
  }));
  return `${PUBLIC_URL}/${key}`;
}

async function main() {
  console.log("生成 20 张 SVG 占位插图 + 上传 R2");
  for (let i = 0; i < SCENES.length; i++) {
    const page = i + 1;
    const scene = SCENES[i];
    const svg = makeSVG(page, scene);
    const key = `${PREFIX}/page_${String(page).padStart(2, "0")}.svg`;
    const url = await uploadSVG(svg, key);
    console.log(`  ✓ page_${String(page).padStart(2, "0")}.svg (${(svg.length / 1024).toFixed(1)}KB) → ${url}`);
  }
  console.log("\n✓ 全部上传完成");
}

main().catch((e) => { console.error("错误:", e.message); process.exit(1); });
