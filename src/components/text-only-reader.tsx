"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Pause, Volume2 } from "lucide-react";

interface TextPage {
  page: number;
  body: string;
}

export default function TextOnlyReader({
  title,
  pages,
}: {
  title: string;
  pages: TextPage[];
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const totalPages = pages.length;

  // Load TTS preference
  useEffect(() => {
    const saved = localStorage.getItem("tts-enabled");
    if (saved === "true") setTtsEnabled(true);
  }, []);

  // Find Chinese voice
  const getChineseVoice = useCallback(() => {
    const voices = speechSynthesis.getVoices();
    // Priority: Microsoft Chinese > Google Chinese > any zh voice
    const ms = voices.find((v) => v.lang.startsWith("zh") && v.name.includes("Microsoft"));
    if (ms) return ms;
    const google = voices.find((v) => v.lang.startsWith("zh") && v.name.includes("Google"));
    if (google) return google;
    const any = voices.find((v) => v.lang.startsWith("zh"));
    return any || voices[0];
  }, []);

  // Speak current page
  const speakPage = useCallback(() => {
    if (!ttsEnabled) return;
    speechSynthesis.cancel();
    const voice = getChineseVoice();
    if (!voice) return;

    const text = pages[currentPage]?.body || "";
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      // Auto-advance
      if (currentPage < totalPages - 1) {
        setCurrentPage((p) => p + 1);
      }
    };
    utterance.onerror = () => setIsSpeaking(false);
    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [currentPage, totalPages, ttsEnabled, getChineseVoice]);

  // Auto-speak after page change when TTS is on
  useEffect(() => {
    if (ttsEnabled && isSpeaking) {
      // Wait a tick for voices to be ready, then speak
      const t = setTimeout(speakPage, 100);
      return () => clearTimeout(t);
    }
  }, [currentPage, ttsEnabled]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setCurrentPage((p) => Math.max(0, p - 1));
      if (e.key === "ArrowRight") setCurrentPage((p) => Math.min(totalPages - 1, p + 1));
      if (e.key === " ") {
        e.preventDefault();
        if (isSpeaking) {
          speechSynthesis.cancel();
          setIsSpeaking(false);
        } else {
          speakPage();
        }
      }
      if (e.key === "t" || e.key === "T") {
        setTtsEnabled((v) => {
          const next = !v;
          localStorage.setItem("tts-enabled", String(next));
          return next;
        });
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isSpeaking, speakPage, totalPages]);

  // Load voices
  useEffect(() => {
    speechSynthesis.getVoices();
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
  }, []);

  const toggleTTS = () => {
    setTtsEnabled((v) => {
      const next = !v;
      localStorage.setItem("tts-enabled", String(next));
      if (!next) {
        speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      return next;
    });
  };

  const page = pages[currentPage];
  if (!page) return null;
  const progress = ((currentPage + 1) / totalPages) * 100;

  return (
    <div className="glass-card overflow-hidden">
      {/* Title bar */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-sm font-medium text-white truncate">
            {title}
          </span>
          <span className="text-xs text-gray-500 flex-shrink-0">
            第 {page.page} / {totalPages} 页
          </span>
        </div>
        <button
          onClick={toggleTTS}
          className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
            ttsEnabled
              ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
              : "bg-white/5 text-gray-500 hover:bg-white/10"
          }`}
          title={ttsEnabled ? "关闭语音 (T)" : "开启语音 (T)"}
        >
          <Volume2 className="h-4 w-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Page content */}
      <div className="p-8 min-h-[400px] flex flex-col">
        <div className="flex-1">
          {/* Page number badge */}
          <div className="text-xs text-gray-500 mb-6 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
              {page.page}
            </span>
            <span>-</span>
          </div>

          {/* Page text */}
          <div className="text-gray-200 leading-loose text-base md:text-lg whitespace-pre-line">
            {page.body}
          </div>

          {/* TTS active indicator */}
          {isSpeaking && (
            <div className="mt-6 flex items-center gap-2 text-amber-400 text-xs">
              <span className="flex gap-0.5">
                {[1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="w-1 h-4 bg-amber-400 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </span>
              正在朗读...
            </div>
          )}
        </div>

        {/* Page dots */}
        <div className="flex items-center justify-center gap-1.5 mt-6 flex-wrap">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentPage
                  ? "bg-amber-400 w-4"
                  : "bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`跳转到第 ${i + 1} 页`}
            />
          ))}
        </div>
      </div>

      {/* Navigation bar */}
      <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
        <button
          onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
          disabled={currentPage === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
        >
          <ChevronLeft className="h-4 w-4" />
          上一页
        </button>

        <div className="flex items-center gap-3">
          {/* TTS play/pause */}
          {ttsEnabled && (
            <button
              onClick={() => {
                if (isSpeaking) {
                  speechSynthesis.cancel();
                  setIsSpeaking(false);
                } else {
                  speakPage();
                }
              }}
              className="p-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors"
            >
              {isSpeaking ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </button>
          )}

          <span className="text-xs text-gray-500">
            {currentPage + 1} / {totalPages}
          </span>
        </div>

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={currentPage >= totalPages - 1}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
        >
          下一页
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
