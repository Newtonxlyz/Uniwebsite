"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  ChevronLeft, ChevronRight, Volume2, VolumeX, BookOpen,
  Play, Pause, SkipForward, SkipBack
} from "lucide-react";

interface Page {
  page_number: number;
  text: string;
  image?: string;
  image_url?: string;
}

interface StoryReaderProps {
  title: string;
  pages: Page[];
}

const TTS_STORAGE_KEY = "picturebook_tts_enabled";
const AUTO_NEXT_DELAY = 800; // ms delay before auto-advancing after narration ends

export default function StoryReader({ title, pages }: StoryReaderProps) {
  // Skip non-content pages
  const contentPages = pages.filter(p => p.page_number > 0 && !p.text.startsWith('#'));
  const [currentPage, setCurrentPage] = useState(0);
  const [showText, setShowText] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [ttsVoices, setTtsVoices] = useState<SpeechSynthesisVoice[]>([]);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const autoNextTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const page = contentPages[currentPage];
  const total = contentPages.length;
  const hasPrev = currentPage > 0;
  const hasNext = currentPage < total - 1;
  const pageImage = page?.image || page?.image_url || "";

  // Init speech synthesis and load TTS preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
      const saved = localStorage.getItem(TTS_STORAGE_KEY);
      if (saved !== null) setTtsEnabled(saved === "true");

      // Load voices (some browsers load async)
      const loadVoices = () => {
        const voices = synthRef.current?.getVoices() || [];
        setTtsVoices(voices);
      };
      loadVoices();
      if (synthRef.current) {
        synthRef.current.onvoiceschanged = loadVoices;
      }
    }
    return () => {
      if (synthRef.current) synthRef.current.cancel();
      if (autoNextTimerRef.current) clearTimeout(autoNextTimerRef.current);
    };
  }, []);

  // Find best Chinese voice
  const findChineseVoice = useCallback((): SpeechSynthesisVoice | undefined => {
    // Prefer specific voices in order
    const preferredNames = [
      "Microsoft Yaoyao - Chinese (Simplified, PRC)",
      "Microsoft Huihui - Chinese (Simplified, PRC)",
      "Microsoft Kangkang - Chinese (Simplified, PRC)",
      "Google 普通话（中国大陆）",
      "Google 粤語（香港）",
    ];
    for (const name of preferredNames) {
      const found = ttsVoices.find(v => v.name === name);
      if (found) return found;
    }
    // Fallback: any Chinese voice
    const zhVoice = ttsVoices.find(v =>
      v.lang.startsWith("zh") || v.lang.startsWith("cmn")
    );
    return zhVoice;
  }, [ttsVoices]);

  const speakPage = useCallback((pageIndex: number) => {
    if (!synthRef.current || !ttsEnabled) return;
    const p = contentPages[pageIndex];
    if (!p || !p.text.trim()) return;

    synthRef.current.cancel();
    if (autoNextTimerRef.current) {
      clearTimeout(autoNextTimerRef.current);
      autoNextTimerRef.current = null;
    }

    const utterance = new SpeechSynthesisUtterance(p.text);
    utterance.lang = "zh-CN";
    utterance.rate = 0.9;    // Slightly slower for children
    utterance.pitch = 1.1;   // Slightly higher, warmer

    const zhVoice = findChineseVoice();
    if (zhVoice) utterance.voice = zhVoice;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      // Auto-advance to next page
      if (pageIndex < total - 1) {
        autoNextTimerRef.current = setTimeout(() => {
          setCurrentPage(pageIndex + 1);
          // Auto-start next page narration
          setTimeout(() => speakPage(pageIndex + 1), 300);
        }, AUTO_NEXT_DELAY);
      }
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      if (e.error !== "interrupted" && e.error !== "canceled") {
        setIsPlaying(false);
        setIsPaused(false);
      }
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  }, [ttsEnabled, contentPages, total, findChineseVoice]);

  const toggleTTS = useCallback(() => {
    const newVal = !ttsEnabled;
    setTtsEnabled(newVal);
    localStorage.setItem(TTS_STORAGE_KEY, String(newVal));
    if (!newVal && synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      if (autoNextTimerRef.current) {
        clearTimeout(autoNextTimerRef.current);
        autoNextTimerRef.current = null;
      }
    }
  }, [ttsEnabled]);

  const togglePlayPause = useCallback(() => {
    if (!synthRef.current || !ttsEnabled) return;

    if (isPlaying && !isPaused) {
      // Pause
      synthRef.current.pause();
    } else if (isPlaying && isPaused) {
      // Resume
      synthRef.current.resume();
    } else {
      // Start playing from current page
      speakPage(currentPage);
    }
  }, [isPlaying, isPaused, ttsEnabled, currentPage, speakPage]);

  const stopPlayback = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    if (autoNextTimerRef.current) {
      clearTimeout(autoNextTimerRef.current);
      autoNextTimerRef.current = null;
    }
  }, []);

  // Stop TTS when changing pages manually
  const handlePageChange = useCallback((newIndex: number) => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    if (autoNextTimerRef.current) {
      clearTimeout(autoNextTimerRef.current);
      autoNextTimerRef.current = null;
    }
    setCurrentPage(newIndex);
  }, []);

  const goPrev = useCallback(() => {
    if (hasPrev) handlePageChange(currentPage - 1);
  }, [hasPrev, currentPage, handlePageChange]);

  const goNext = useCallback(() => {
    if (hasNext) handlePageChange(currentPage + 1);
  }, [hasNext, currentPage, handlePageChange]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "ArrowRight") goNext();
    if (e.key === " " || e.key === "Space") {
      e.preventDefault();
      togglePlayPause();
    }
  }, [goPrev, goNext, togglePlayPause]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  if (!page) return null;

  return (
    <div
      className="relative w-full max-w-2xl mx-auto"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Page Number + Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <BookOpen className="h-4 w-4" />
          <span>第 {page.page_number} 页 / 共 {total} 页</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Voice Controls */}
          {ttsEnabled && (
            <div className="flex items-center gap-1 mr-1">
              <button
                onClick={togglePlayPause}
                className={`p-2 rounded-lg transition-all ${
                  isPlaying
                    ? "bg-pink-500/30 text-pink-300 animate-pulse"
                    : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white"
                }`}
                aria-label={isPlaying ? (isPaused ? "继续播放" : "暂停") : "朗读本页"}
                title={isPlaying ? (isPaused ? "继续播放" : "暂停") : "朗读本页"}
              >
                {isPlaying && !isPaused ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </button>
              {isPlaying && (
                <button
                  onClick={stopPlayback}
                  className="p-2 rounded-lg bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white transition-all"
                  aria-label="停止播放"
                  title="停止播放"
                >
                  <SkipForward className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
          <button
            onClick={toggleTTS}
            className={`p-2 rounded-lg transition-all ${
              ttsEnabled
                ? "bg-pink-500/20 text-pink-300 hover:bg-pink-500/30"
                : "bg-white/10 text-gray-500 hover:bg-white/20"
            }`}
            aria-label={ttsEnabled ? "关闭有声朗读" : "开启有声朗读"}
            title={ttsEnabled ? "有声朗读已开启" : "有声朗读已关闭"}
          >
            {ttsEnabled ? (
              isPlaying ? (
                <Volume2 className="h-4 w-4 animate-pulse" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => setShowText(!showText)}
            className="text-xs px-3 py-1.5 rounded-full bg-white/10 text-gray-400 hover:bg-white/20 transition-colors"
          >
            {showText ? "隐藏文字" : "显示文字"}
          </button>
        </div>
      </div>

      {/* TTS Status Bar */}
      {isPlaying && (
        <div className="flex items-center gap-2 mb-3 px-4 py-2 rounded-xl bg-pink-500/10 border border-pink-500/20">
          <div className="flex gap-0.5">
            <span className="w-1 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay:"0ms"}} />
            <span className="w-1 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay:"100ms"}} />
            <span className="w-1 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay:"200ms"}} />
          </div>
          <span className="text-xs text-pink-300">
            {isPaused ? "已暂停" : "正在朗读..."}
            {ttsVoices.length === 0 && " (加载语音中...)"}
          </span>
          {!isPaused && (
            <span className="text-[10px] text-pink-400/60 ml-auto">按 空格键 暂停/继续</span>
          )}
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white/5 border border-white/10 mb-4">
        {pageImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pageImage}
            alt={`${title} - 第${page.page_number}页`}
            className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${isPlaying ? "opacity-90" : "opacity-100"}`}
            loading={currentPage < 3 ? "eager" : "lazy"}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-30">🎨</span>
          </div>
        )}

        {/* Left/Right Click Zones */}
        {hasPrev && (
          <button
            onClick={goPrev}
            className="absolute left-0 top-0 bottom-0 w-1/3 cursor-w opacity-0 hover:opacity-100 transition-opacity group"
            aria-label="上一页"
          >
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center group-hover:bg-black/70 transition-colors">
              <ChevronLeft className="h-6 w-6 text-white" />
            </div>
          </button>
        )}
        {hasNext && (
          <button
            onClick={goNext}
            className="absolute right-0 top-0 bottom-0 w-1/3 cursor-e opacity-0 hover:opacity-100 transition-opacity group"
            aria-label="下一页"
          >
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center group-hover:bg-black/70 transition-colors">
              <ChevronRight className="h-6 w-6 text-white" />
            </div>
          </button>
        )}
      </div>

      {/* Story Text */}
      {showText && (
        <div className={`glass-card p-6 mb-6 transition-colors duration-300 ${isPlaying ? "border-pink-500/20" : ""}`}>
          <p className="text-lg leading-relaxed text-gray-200 whitespace-pre-line">
            {page.text}
          </p>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={goPrev}
          disabled={!hasPrev}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all ${
            hasPrev
              ? "bg-white/10 text-white hover:bg-white/20"
              : "bg-white/5 text-gray-600 cursor-not-allowed"
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="text-sm">上一页</span>
        </button>

        {/* Page Progress */}
        <div className="flex items-center gap-1.5">
          {contentPages.map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentPage
                  ? "bg-pink-400 w-4"
                  : i < currentPage
                  ? "bg-white/30"
                  : "bg-white/10 hover:bg-white/20"
              }`}
              aria-label={`第 ${i + 1} 页`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          disabled={!hasNext}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all ${
            hasNext
              ? "bg-white/10 text-white hover:bg-white/20"
              : "bg-white/5 text-gray-600 cursor-not-allowed"
          }`}
        >
          <span className="text-sm">下一页</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="text-center text-xs text-gray-600 mt-4">
        键盘 ← → 翻页 · 空格键朗读/暂停 · 点击图片左右区域翻页
      </p>
    </div>
  );
}
