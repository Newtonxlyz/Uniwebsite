import { loadLessons } from "@/lib/server-data";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { LessonContent } from "@/components/lesson-content";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function LessonPage({ params }: PageProps) {
  const { slug } = await params;
  const lessons = await loadLessons();
  const lesson = lessons.find((l: any) => l.slug === slug);

  if (!lesson) {
    notFound();
  }

  const prevLesson = lessons.find((l: any) => l.order === lesson.order - 1) || null;
  const nextLesson = lessons.find((l: any) => l.order === lesson.order + 1) || null;

  // 拉当前用户本课进度（已登录才有）
  const session = await auth.api.getSession({ headers: await headers() });
  const progress = session
    ? await prisma.crashAIProgress.findUnique({
        where: {
          userId_lessonSlug: {
            userId: session.user.id,
            lessonSlug: slug,
          },
        },
      })
    : null;

  const initialProgress = progress
    ? {
        lessonSlug: progress.lessonSlug,
        status: progress.status as
          | "NOT_STARTED"
          | "IN_PROGRESS"
          | "COMPLETED",
        notes: progress.notes,
        studyMinutes: progress.studyMinutes,
        startedAt: progress.startedAt?.toISOString() ?? null,
        completedAt: progress.completedAt?.toISOString() ?? null,
      }
    : undefined;

  return (
    <LessonContent
      lesson={lesson}
      prevLesson={prevLesson}
      nextLesson={nextLesson}
      isLoggedIn={!!session}
      initialProgress={initialProgress}
    />
  );
}
