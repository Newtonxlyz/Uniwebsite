// Cloudflare R2 存储适配层（S3 兼容）
// 用于：图片、视频、音频、文档等多媒体上传
// 配置：R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL

import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "lvyz-media";
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "https://media.lvyz.org";

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  // 不在初始化时抛错，方便开发环境（不接 R2）
  console.warn("[R2] Missing environment variables - uploads will fail");
}

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || "",
    secretAccessKey: R2_SECRET_ACCESS_KEY || "",
  },
});

export type MediaType = "image" | "video" | "audio" | "document";

const TYPE_MIME: Record<string, MediaType> = {
  // 图片
  "image/jpeg": "image",
  "image/png": "image",
  "image/gif": "image",
  "image/webp": "image",
  "image/svg+xml": "image",
  // 视频
  "video/mp4": "video",
  "video/webm": "video",
  "video/quicktime": "video",
  "video/x-msvideo": "video",
  // 音频
  "audio/mpeg": "audio",
  "audio/mp3": "audio",
  "audio/wav": "audio",
  "audio/ogg": "audio",
  "audio/x-m4a": "audio",
  "audio/mp4": "audio",
  // 文档
  "application/pdf": "document",
  "application/msword": "document",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "document",
  "text/plain": "document",
  "text/markdown": "document",
};

export function getMediaType(mimeType: string): MediaType {
  return TYPE_MIME[mimeType] || "document";
}

// ────────────────────────────────────────────
// 上传文件
// ────────────────────────────────────────────
export interface UploadResult {
  key: string;
  url: string;
  size: number;
  mimeType: string;
  type: MediaType;
}

export async function uploadFile(
  file: Buffer,
  originalName: string,
  mimeType: string,
  userId: string
): Promise<UploadResult> {
  // 1. 构造 key: 用户隔离 + 日期 + 随机
  const ext = originalName.split(".").pop() || "bin";
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const random = Math.random().toString(36).slice(2, 10);
  const key = `uploads/${userId.slice(0, 8)}/${year}/${month}/${Date.now()}-${random}.${ext}`;

  // 2. 上传到 R2
  await r2.send(new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: mimeType,
    CacheControl: "public, max-age=31536000, immutable",
  }));

  return {
    key,
    url: `${R2_PUBLIC_URL}/${key}`,
    size: file.length,
    mimeType,
    type: getMediaType(mimeType),
  };
}

// ────────────────────────────────────────────
// 删除文件
// ────────────────────────────────────────────
export async function deleteFile(key: string): Promise<void> {
  await r2.send(new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  }));
}

// ────────────────────────────────────────────
// 生成预签名 URL（用于私密文件）
// ────────────────────────────────────────────
export async function getPresignedUrl(key: string, expiresIn = 3600): Promise<string> {
  return getSignedUrl(
    r2,
    new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    }),
    { expiresIn }
  );
}
