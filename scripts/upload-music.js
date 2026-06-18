// 上传"也乡愁"背景音乐 + 用户素材中的图片
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync, existsSync, statSync } from "fs";

// 手动解析 .env
if (existsSync(".env")) {
  for (const line of readFileSync(".env", "utf-8").split("\n")) {
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

async function uploadFile(localPath, key, contentType) {
  const body = readFileSync(localPath);
  await r2.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable",
  }));
  const sizeMB = (statSync(localPath).size / 1024 / 1024).toFixed(2);
  return { url: `${PUBLIC_URL}/${key}`, sizeMB };
}

async function main() {
  // 1. 也乡愁背景音乐
  const music = "D:\\XHS\\2026KW16\\也乡愁 (1).aac";
  if (existsSync(music)) {
    const r = await uploadFile(music, "music/ye-xiang-chou.aac", "audio/aac");
    console.log(`✓ 音乐 ${r.sizeMB}MB → ${r.url}`);
  } else {
    console.log("✗ 音乐文件不存在:", music);
  }
}

main().catch((e) => { console.error("错误:", e.message); process.exit(1); });
