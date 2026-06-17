// POST /api/blog/upload - 上传媒体到 R2
import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/posts";
import { uploadFile } from "@/lib/storage";
import { prisma } from "@/lib/db";

const MAX_SIZE = 100 * 1024 * 1024;  // 100MB

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: `File too large (max ${MAX_SIZE / 1024 / 1024}MB)` }, { status: 413 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadFile(buffer, file.name, file.type, user.id);

    // 入库
    const media = await prisma.media.create({
      data: {
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        type: result.type.toUpperCase() as "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT",
        key: result.key,
        url: result.url,
        uploaderId: user.id,
      },
    });
    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    const msg = (error as Error).message;
    const status = msg === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
