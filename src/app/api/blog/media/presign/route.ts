// /api/blog/media/presign - 预签名直传 R2
// 浏览器 PUT 到 R2（绕过 Vercel 4.5MB body 限制）
// 返回 R2 PUT URL + publicUrl

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const MAX_IMAGE = 10 * 1024 * 1024;    // 10MB
const MAX_AUDIO = 50 * 1024 * 1024;    // 50MB
const MAX_VIDEO = 500 * 1024 * 1024;   // 500MB

function getR2() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

function getMediaType(mime: string): "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT" {
  if (mime.startsWith("image/")) return "IMAGE";
  if (mime.startsWith("video/")) return "VIDEO";
  if (mime.startsWith("audio/")) return "AUDIO";
  return "DOCUMENT";
}

const PUBLIC_URL = process.env.R2_PUBLIC_URL || "https://media.lvyz.org";
const BUCKET = process.env.R2_BUCKET_NAME || "lvyzorg";

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const body = await req.json();
  const { fileName, fileType, fileSize, role = "CONTENT" } = body;

  if (!fileName || !fileType) {
    return NextResponse.json({ error: "fileName/fileType 必填" }, { status: 400 });
  }

  // 大小校验
  if (fileSize) {
    if (fileType.startsWith("image/") && fileSize > MAX_IMAGE) {
      return NextResponse.json({ error: `图片超过 ${MAX_IMAGE / 1024 / 1024}MB` }, { status: 400 });
    }
    if (fileType.startsWith("audio/") && fileSize > MAX_AUDIO) {
      return NextResponse.json({ error: `音频超过 ${MAX_AUDIO / 1024 / 1024}MB` }, { status: 400 });
    }
    if (fileType.startsWith("video/") && fileSize > MAX_VIDEO) {
      return NextResponse.json({ error: `视频超过 ${MAX_VIDEO / 1024 / 1024}MB` }, { status: 400 });
    }
  }

  // R2 key: blog/{userId}/{yyyy}/{mm}/{random}-{filename}
  const userId = session.user.id;
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 10);
  // 清理文件名（保留扩展名）
  const dotIdx = fileName.lastIndexOf(".");
  const ext = dotIdx >= 0 ? fileName.slice(dotIdx + 1).toLowerCase() : "bin";
  const baseName = dotIdx >= 0 ? fileName.slice(0, dotIdx) : fileName;
  const safeBase = baseName.replace(/[^a-zA-Z0-9\-_]/g, "-").slice(0, 30) || "file";
  const key = `blog/${userId.slice(0, 8)}/${yyyy}/${mm}/${Date.now()}-${rand}-${safeBase}.${ext}`;

  // 预签名 PUT（10 分钟）
  const r2 = getR2();
  const uploadUrl = await getSignedUrl(
    r2,
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: fileType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
    { expiresIn: 600 }
  );

  return NextResponse.json({
    uploadUrl,
    publicUrl: `${PUBLIC_URL}/${key}`,
    key,
    role,
  });
}
