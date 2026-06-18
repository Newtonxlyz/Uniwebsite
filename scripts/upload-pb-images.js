// 批量上传绘本原版资源到 R2
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync, readdirSync, existsSync, statSync } from "fs";
import { join, basename, extname } from "path";

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

const MIME = {
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
  ".webp": "image/webp", ".svg": "image/svg+xml", ".aac": "audio/aac",
  ".mp3": "audio/mpeg", ".mp4": "video/mp4",
};

async function uploadDir(localDir, r2Prefix) {
  const files = readdirSync(localDir);
  let count = 0;
  for (const f of files) {
    const localPath = join(localDir, f);
    const stat = statSync(localPath);
    if (!stat.isFile()) continue;
    const ext = extname(f).toLowerCase();
    const mime = MIME[ext] || "application/octet-stream";
    const key = `${r2Prefix}/${basename(f)}`;
    const body = readFileSync(localPath);
    await r2.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: mime,
      CacheControl: "public, max-age=31536000, immutable",
    }));
    const sizeMB = (stat.size / 1024 / 1024).toFixed(2);
    console.log(`  ✓ ${f} (${sizeMB}MB) → ${PUBLIC_URL}/${key}`);
    count++;
  }
  return count;
}

async function main() {
  // 1. 绘本原版资源
  const pbImages = "D:\\LvyzWeb\\picturebook-tools\\images";
  if (existsSync(pbImages)) {
    console.log("上传绘本原版图片到 R2 picturebook-source/ ...");
    await uploadDir(pbImages, "picturebook-source");
  }

  console.log("\n✓ 全部完成");
}

main().catch((e) => { console.error("错误:", e.message); process.exit(1); });
