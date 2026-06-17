// 把绘本第一故事的 20 张 PNG 上传到 R2
// 用法：node scripts/upload-dark-cave.js
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";

// 手动解析 .env
if (existsSync(".env")) {
  const envContent = readFileSync(".env", "utf-8");
  for (const line of envContent.split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*"?([^"]*)"?/);
    if (m) process.env[m[1]] = m[2];
  }
}

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "lvyzorg";
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "https://media.lvyz.org";

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error("R2 env missing");
  process.exit(1);
}

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const STORY_DIR = "D:\\儿童绘本计划\\雷迪嘎嘎系列\\绘本\\儿童情感引导系列\\001_儿童情感引导_001_黑黑的洞穴我不怕";
const PREFIX = "picturebook/dark-cave";

async function uploadFile(filePath, key) {
  const body = readFileSync(filePath);
  const contentType = "image/png";
  await r2.send(new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable",
  }));
  return `${R2_PUBLIC_URL}/${key}`;
}

async function main() {
  const files = readdirSync(STORY_DIR).filter(f => /^page_\d+\.png$/i.test(f)).sort();
  console.log(`找到 ${files.length} 张 PNG`);

  for (const f of files) {
    const localPath = join(STORY_DIR, f);
    const key = `${PREFIX}/${f}`;
    const sizeMB = (readFileSync(localPath).length / 1024 / 1024).toFixed(2);
    process.stdout.write(`  上传 ${f} (${sizeMB}MB)... `);
    const url = await uploadFile(localPath, key);
    console.log("✓", url);
  }

  console.log("\n✓ 全部上传完成");
}

main().catch((e) => { console.error("错误:", e.message); process.exit(1); });
