// /api/crashai/progress - 列表当前用户所有 crashai 课进度
// GET /api/crashai/progress → { progress: [{ lessonSlug, status, notes, studyMinutes, startedAt, completedAt }] }

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const progress = await prisma.crashAIProgress.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ progress });
}
