// 提取 KidsAI chapters.ts 为 JSON 给 Next.js 用
import { readFileSync, writeFileSync } from "fs";

async function main() {
  console.log("使用 tsx 加载...");
  // file:// URL Windows 路径
  const url = "file:///D:/KidAILearning/website/src/data/chapters.ts";
  const mod = await import(url);
  const chapters = mod.chapters;

  const jsonPath = "D:\\LvyzWeb\\platform\\src\\content\\kids-ai\\chapters.json";
  writeFileSync(jsonPath, JSON.stringify(chapters, null, 2), "utf-8");
  console.log(`✓ 提取 ${chapters.length} 章到 ${jsonPath}`);
  console.log(`  - 文件大小: ${(JSON.stringify(chapters).length / 1024).toFixed(1)}KB`);
}

main().catch((e) => { console.error("错误:", e); process.exit(1); });

