// /api/crashai/progress/[slug] - 单课程进度操作
// POST   { status?, studyMinutes?, notes? }   → upsert
// DELETE                                              → 重置为 NOT_STARTED

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { slug } = await params;
  const body = await req.json().catch(() => ({}));
  const { status, studyMinutes, notes } = body as {
    status?: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
    studyMinutes?: number;
    notes?: string;
  };

  // 找到现有记录（如果有）
  const existing = await prisma.crashAIProgress.findUnique({
    where: {
      userId_lessonSlug: {
        userId: session.user.id,
        lessonSlug: slug,
      },
    },
  });

  // 计算新值
  const newStatus = status ?? existing?.status ?? "NOT_STARTED";
  const newStudyMinutes =
    (existing?.studyMinutes ?? 0) + (studyMinutes ?? 0);
  const newNotes = notes !== undefined ? notes : existing?.notes;

  // 时间戳
  const now = new Date();
  const startedAt =
    newStatus !== "NOT_STARTED" && !existing?.startedAt
      ? now
      : existing?.startedAt;
  const completedAt =
    newStatus === "COMPLETED"
      ? existing?.completedAt ?? now
      : newStatus !== "COMPLETED"
      ? null
      : existing?.completedAt;

  const progress = await prisma.crashAIProgress.upsert({
    where: {
      userId_lessonSlug: {
        userId: session.user.id,
        lessonSlug: slug,
      },
    },
    create: {
      userId: session.user.id,
      lessonSlug: slug,
      status: newStatus,
      notes: newNotes ?? null,
      studyMinutes: newStudyMinutes,
      startedAt,
      completedAt,
    },
    update: {
      status: newStatus,
      notes: newNotes ?? null,
      studyMinutes: newStudyMinutes,
      startedAt,
      completedAt,
      updatedAt: now,
    },
  });

  return NextResponse.json({ progress });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const { slug } = await params;
  await prisma.crashAIProgress.deleteMany({
    where: {
      userId: session.user.id,
      lessonSlug: slug,
    },
  });
  return NextResponse.json({ ok: true });
}
