'use client';

import { useState, useCallback } from 'react';
import { NotePanel, NoteSummary } from '@/components/section-note';
import { ChevronLeft, ChevronDown, ChevronUp, BookOpen, Clock, FileText, FunctionSquare, ListOrdered, Table, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import type { Section, Lesson } from '@/types';

const typeIcons: Record<string, React.ReactNode> = {
  text: <FileText size={16} className="text-blue-400" />,
  code: <FunctionSquare size={16} className="text-purple-400" />,
  formula: <FunctionSquare size={16} className="text-pink-400" />,
  table: <Table size={16} className="text-cyan-400" />,
  example: <BookOpen size={16} className="text-amber-400" />,
  exercise: <Clock size={16} className="text-emerald-400" />,
  comparison: <ListOrdered size={16} className="text-indigo-400" />,
};

const typeLabels: Record<string, string> = {
  text: '知识',
  code: '代码',
  formula: '公式',
  table: '表格',
  example: '实例',
  exercise: '练习',
  comparison: '对比',
};

const typeStyles: Record<string, string> = {
  text: 'border-blue-500/20 bg-blue-500/5',
  code: 'border-purple-500/20 bg-purple-500/5',
  formula: 'border-pink-500/20 bg-pink-500/5',
  table: 'border-cyan-500/20 bg-cyan-500/5',
  example: 'border-amber-500/20 bg-amber-500/5',
  exercise: 'border-emerald-500/20 bg-emerald-500/5',
  comparison: 'border-indigo-500/20 bg-indigo-500/5',
};

interface SectionCardProps {
  section: Section;
  index: number;
  lessonSlug: string;
  lessonTitle: string;
}

function SectionCard({ section, index, lessonSlug, lessonTitle }: SectionCardProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className={`glass-card overflow-hidden ${typeStyles[section.type as string] || 'border-white/10'}`}>
      {/* Section header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 transition"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <span className="flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full bg-white/5 text-white/60">
            {typeIcons[section.type as string] || <Lightbulb size={14} />}
            {typeLabels[section.type as string] || section.type}
          </span>
          <h3 className="text-base font-semibold text-white/90">
            {section.title}
          </h3>
        </div>
        <NotePanel
          lessonSlug={lessonSlug}
          sectionIndex={index}
          sectionTitle={section.title}
        />
      </div>

      {/* Section content */}
      {expanded && (
        <div className="px-5 py-4">
          {section.type === 'text' && section.content && (
            <div
              className="prose prose-invert prose-sm max-w-none text-white/80"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          )}
          {section.type === 'code' && section.code && (
            <div className="relative">
              <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto text-sm text-gray-300 font-mono border border-white/10">
                <code>{section.code}</code>
              </pre>
            </div>
          )}
          {section.type === 'formula' && section.content && (
            <div className="bg-black/30 rounded-lg p-4 border border-white/10">
              <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                {section.content}
              </pre>
            </div>
          )}
          {section.type === 'table' && section.content && (
            <div
              className="prose prose-invert prose-sm max-w-none text-white/80"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          )}
          {section.type === 'example' && section.content && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-400">实例</span>
              </div>
              <div
                className="prose prose-invert prose-sm max-w-none text-white/80"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </div>
          )}
          {section.type === 'exercise' && section.content && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">练习</span>
              </div>
              <div
                className="prose prose-invert prose-sm max-w-none text-white/80 mb-4"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
              {section.answer && (
                <details>
                  <summary className="text-sm text-emerald-400 cursor-pointer hover:text-emerald-300 select-none">
                    查看答案
                  </summary>
                  <div
                    className="mt-3 prose prose-invert prose-sm max-w-none text-white/80"
                    dangerouslySetInnerHTML={{ __html: section.answer }}
                  />
                </details>
              )}
            </div>
          )}
          {section.type === 'comparison' && section.content && (
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <ListOrdered className="h-4 w-4 text-indigo-400" />
                <span className="text-sm font-medium text-indigo-400">对比</span>
              </div>
              <div
                className="prose prose-invert prose-sm max-w-none text-white/80"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface LessonContentProps {
  lesson: Lesson;
  prevLesson: Lesson | null;
  nextLesson: Lesson | null;
}

export function LessonContent({ lesson, prevLesson, nextLesson }: LessonContentProps) {
  return (
    <div className="min-h-screen pt-20 px-6 pb-16">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/crashai"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ChevronLeft className="h-4 w-4" />
            返回学习地图
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
              {lesson.category}
            </span>
            <span className="text-xs text-gray-500">
              Phase {lesson.phase} · 第 {lesson.order + 1} 课
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{lesson.title}</h1>
          <p className="text-sm text-gray-400">{lesson.description}</p>
        </div>

        {/* Note Summary */}
        <NoteSummary lessonSlug={lesson.slug} />

        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-6 text-sm text-white/40">
          <span>{lesson.sections?.length || 0} 个章节</span>
          <span className="text-white/20">·</span>
          <span>按类别展开/折叠</span>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {lesson.sections?.map((section, idx) => (
            <SectionCard
              key={idx}
              section={section}
              index={idx}
              lessonSlug={lesson.slug}
              lessonTitle={lesson.title}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between">
          {prevLesson ? (
            <Link
              href={`/crashai/${prevLesson.slug}`}
              className="glass-card px-5 py-3 text-sm text-white hover:scale-105 transition-all"
            >
              ← {prevLesson.title}
            </Link>
          ) : (
            <div />
          )}
          {nextLesson ? (
            <Link
              href={`/crashai/${nextLesson.slug}`}
              className="glass-card px-5 py-3 text-sm text-white hover:scale-105 transition-all bg-indigo-600/20 border-indigo-500/30"
            >
              {nextLesson.title} →
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
