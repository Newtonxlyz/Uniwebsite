import { loadLessons } from "@/lib/server-data";
import { notFound } from "next/navigation";
import { LessonContent } from "@/components/lesson-content";

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

  return <LessonContent lesson={lesson} prevLesson={prevLesson} nextLesson={nextLesson} />;
}
