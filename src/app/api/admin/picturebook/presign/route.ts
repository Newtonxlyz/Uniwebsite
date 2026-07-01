// 生成 R2 预签名 URL：浏览器拿到 URL 后直传 R2，绕过 Vercel 4.5MB body 限制
// POST /api/admin/picturebook/presign
//   body: { storyId, fileName, fileType, kind: "page" | "cover" | "video", pageNum? }
//   returns: { uploadUrl, publicUrl, key }

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const ALLOWED_ROLES = ["EDITOR", "ADMIN", "SUPERADMIN"];
const MAX_IMAGE = 10 * 1024 * 1024;       // 10MB
const MAX_VIDEO = 500 * 1024 * 1024;      // 500MB

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "未登录", status: 401 };
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !ALLOWED_ROLES.includes(user.role)) return { error: "无权限", status: 403 };
  return { session, user };
}

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

const PUBLIC_URL = process.env.R2_PUBLIC_URL || "https://media.lvyz.org";
const BUCKET = process.env.R2_BUCKET_NAME || "lvyzorg";

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await req.json();
  const { storyId, fileName, fileType, kind = "page", pageNum: pageNumInput, fileSize } = body;

  if (!storyId || !fileName || !fileType) {
    return NextResponse.json({ error: "storyId/fileName/fileType 必填" }, { status: 400 });
  }

  // 大小预校验（防止 0 字节或超大）
  if (fileSize) {
    if (fileType.startsWith("image/") && fileSize > MAX_IMAGE) {
      return NextResponse.json({ error: `图片超过 ${MAX_IMAGE / 1024 / 1024}MB` }, { status: 400 });
    }
    if (fileType.startsWith("video/") && fileSize > MAX_VIDEO) {
      return NextResponse.json({ error: `视频超过 ${MAX_VIDEO / 1024 / 1024}MB` }, { status: 400 });
    }
  }

  const story = await prisma.picturebookStory.findUnique({ where: { id: storyId } });
  if (!story) return NextResponse.json({ error: "绘本不存在" }, { status: 404 });

  // 推导 key
  const ext = (fileName.split(".").pop() || "bin").toLowerCase();
  let key: string;
  let resolvedPageNum: number | null = null;

  if (kind === "cover") {
    key = `picturebook/${story.series}/${story.slug}/cover.${ext}`;
  } else if (kind === "video") {
    key = `picturebook/${story.series}/${story.slug}/video.${ext}`;
  } else {
    let pageNum = pageNumInput ? parseInt(String(pageNumInput)) : NaN;
    if (!pageNum || pageNum < 1) {
      const total = await prisma.picturebookPage.count({ where: { storyId } });
      pageNum = total + 1;
    }
    resolvedPageNum = pageNum;
    key = `picturebook/${story.series}/${story.slug}/page_${String(pageNum).padStart(2, "0")}.${ext}`;
  }

  // 预签名 PUT URL（10 分钟有效）
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
    pageNum: resolvedPageNum,
  });
}
