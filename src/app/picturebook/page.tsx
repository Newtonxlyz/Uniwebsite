"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight, BookOpen, Sparkles, Star, Heart, Users,
  ChevronRight, Play, Lock, Unlock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// 雷迪嘎嘎绘本世界 — 配色系统（鲜艳版）
// 主色：墨黑（深褐黑）+ 琥珀金 + 竹青 + 桃粉 + 紫藤 + 樱花粉
const COLORS = {
  ink: "#2A2420",
  paper: "#FAF8F5",
  amber: "#D4A03D",
  bamboo: "#4A9B7F",
  rose: "#D4778C",
  wisteria: "#8B7EC8",
  cherry: "#E8A4B8",
  orange: "#E8923A",
  teal: "#3D9B8F",
  indigo: "#5B6BC8",
};

const R2 = "https://media.lvyz.org/picturebook-source";

const SERIES = [
  { id: "idiom", name: "成语故事", icon: "📜", color: COLORS.amber, count: 600 },
  { id: "poetry", name: "诗歌故事", icon: "🌸", color: "#5BA4CF", count: 252 },
  { id: "grow-boy", name: "噶巴巴成长", icon: "🧒", color: COLORS.bamboo, count: 320 },
  { id: "grow-girl", name: "噶丫丫成长", icon: "👧", color: COLORS.rose, count: 180 },
  { id: "emotion", name: "儿童情感引导", icon: "💗", color: COLORS.wisteria, count: 120 },
  { id: "science", name: "科普系列", icon: "🔬", color: COLORS.teal, count: 95 },
  { id: "idiom-story", name: "俚语歇后语", icon: "💬", color: COLORS.orange, count: 78 },
  { id: "mother", name: "思念母亲", icon: "🌺", color: COLORS.cherry, count: 45 },
  { id: "origin", name: "起源故事", icon: "✨", color: COLORS.indigo, count: 50 },
];

const STORIES = [
  {
    id: "dark-cave",
    title: "黑黑的洞穴我不怕",
    titleEn: "The Dark Cave I'm Not Afraid",
    series: "儿童情感引导",
    cover: `${R2}/book-cave.jpg`,
    age: "3-8岁",
    duration: "8分钟",
    rating: 4.9,
    isFree: true,
    status: "已上线",
  },
  {
    id: "crow-water-1",
    title: "乌鸦喝水 · 本领",
    titleEn: "The Crow Drinks · Skill",
    series: "噶巴巴成长",
    cover: `${R2}/book-crow1.jpg`,
    age: "5-8岁",
    duration: "6分钟",
    rating: 4.8,
    isFree: true,
    status: "已上线",
  },
  {
    id: "crow-water-2",
    title: "乌鸦喝水 · 智慧",
    titleEn: "The Crow Drinks · Wisdom",
    series: "噶巴巴成长",
    cover: `${R2}/book-crow2.jpg`,
    age: "5-8岁",
    duration: "6分钟",
    rating: 4.7,
    isFree: true,
    status: "已上线",
  },
  {
    id: "crow-water-3",
    title: "乌鸦喝水 · 友情",
    titleEn: "The Crow Drinks · Friendship",
    series: "噶巴巴成长",
    cover: `${R2}/book-crow3.jpg`,
    age: "5-8岁",
    duration: "6分钟",
    rating: 4.8,
    isFree: false,
    status: "已上线",
  },
  {
    id: "crow-water-4",
    title: "乌鸦喝水 · 创新",
    titleEn: "The Crow Drinks · Innovation",
    series: "噶巴巴成长",
    cover: `${R2}/book-crow4.jpg`,
    age: "5-8岁",
    duration: "6分钟",
    rating: 4.6,
    isFree: false,
    status: "已上线",
  },
];

const CHARACTERS = [
  { id: "ladigaga", name: "雷迪嘎嘎", species: "乌鸦爸爸", emoji: "🐦‍⬛", color: COLORS.ink },
  { id: "gababa", name: "噶巴巴", species: "小乌鸦", emoji: "🧒", color: COLORS.bamboo },
  { id: "gayaya", name: "噶丫丫", species: "白乌鸦", emoji: "👧", color: COLORS.rose },
  { id: "gugu", name: "真咕咕", species: "猫头鹰", emoji: "🦉", color: COLORS.indigo },
  { id: "youyou", name: "白攸白", species: "白兔", emoji: "🐰", color: COLORS.cherry },
  { id: "chengguang", name: "晨光", species: "乌鸦妈妈", emoji: "🦢", color: COLORS.wisteria },
];

const STATS = [
  { value: "1,840+", label: "故事" },
  { value: "12", label: "IP角色" },
  { value: "5", label: "已上线" },
  { value: "9", label: "系列" },
];

export default function PictureBookHome() {
  return (
    <div className="min-h-screen pt-16">
      {/* HERO 区 - 鲜艳配色 */}
      <section className="relative overflow-hidden">
        {/* 背景渐变 + 浮动装饰 */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${COLORS.paper} 0%, #FEF3C7 35%, #FCE7F3 70%, #E0E7FF 100%)`,
            }}
          />
          <div className="absolute top-20 left-10 text-6xl animate-float opacity-30">🌸</div>
          <div className="absolute top-40 right-20 text-5xl animate-float opacity-30" style={{ animationDelay: "1s" }}>📖</div>
          <div className="absolute bottom-20 left-1/4 text-4xl animate-float opacity-30" style={{ animationDelay: "2s" }}>✨</div>
          <div className="absolute top-1/2 right-1/4 text-5xl animate-float opacity-30" style={{ animationDelay: "0.5s" }}>🐦‍⬛</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
          {/* 左：文字 */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs mb-6"
              style={{ background: "rgba(212, 124, 140, 0.15)", color: COLORS.rose, border: `1px solid ${COLORS.rose}40` }}
            >
              <Sparkles className="h-3 w-3" />
              水墨 × 低多边形 · 独特画风
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ color: COLORS.ink, fontFamily: "Microsoft YaHei, sans-serif" }}>
              雷迪嘎嘎
              <span className="ml-2 text-gradient">绘本世界</span>
            </h1>
            <p className="text-lg md:text-xl mb-2" style={{ color: COLORS.amber, fontWeight: 600 }}>
              一只乌鸦的千个故事
            </p>
            <p className="text-base mb-8 max-w-lg" style={{ color: "#57534E" }}>
              专为 3-10 岁儿童打造的沉浸式绘本体验。1,840 个故事，12 个 IP 角色，9 大系列，
              在水墨与几何的独特美学中陪伴孩子成长。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/picturebook/stories"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium shadow-lg hover:scale-105 transition-all"
                style={{ background: `linear-gradient(135deg, ${COLORS.amber} 0%, ${COLORS.orange} 100%)` }}
              >
                <BookOpen className="h-4 w-4" />
                进入故事馆
              </Link>
              <Link
                href="/picturebook/characters"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium hover:scale-105 transition-all"
                style={{ background: "white", color: COLORS.ink, border: `2px solid ${COLORS.ink}20` }}
              >
                <Users className="h-4 w-4" />
                认识角色
              </Link>
            </div>
            <p className="mt-6 text-xs" style={{ color: "#A8A29E" }}>
              已有 <span className="font-semibold" style={{ color: COLORS.amber }}>5</span> 本绘本上线 · 全部免费试读
            </p>
          </div>

          {/* 右：Hero 图 */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${R2}/hero-ladigaga.jpg`}
                alt="雷迪嘎嘎"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            {/* 浮动小气泡 */}
            <div
              className="absolute -top-4 -left-4 px-3 py-2 rounded-2xl text-sm font-bold shadow-lg animate-float"
              style={{ background: COLORS.amber, color: "white" }}
            >
              1840+ 故事
            </div>
            <div
              className="absolute -bottom-4 -right-4 px-3 py-2 rounded-2xl text-sm font-bold shadow-lg animate-float"
              style={{ background: COLORS.bamboo, color: "white", animationDelay: "1s" }}
            >
              12 IP 角色
            </div>
          </div>
        </div>
      </section>

      {/* 数据统计栏 */}
      <section style={{ background: COLORS.ink }} className="py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-1" style={{ color: COLORS.amber }}>
                {s.value}
              </div>
              <div className="text-sm text-white/70">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 9 大系列 */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold" style={{ color: COLORS.ink }}>
              🎨 9 大主题系列
            </h2>
            <p className="text-sm mt-1" style={{ color: "#7A6F65" }}>
              按主题、年龄、情绪多维分类
            </p>
          </div>
          <Link
            href="/picturebook/stories"
            className="hidden md:inline-flex items-center gap-1 text-sm hover:gap-2 transition-all"
            style={{ color: COLORS.amber }}
          >
            查看全部 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {SERIES.map((s) => (
            <Link
              key={s.id}
              href={`/picturebook/stories?series=${encodeURIComponent(s.name)}`}
              className="group relative overflow-hidden rounded-2xl p-6 transition-all hover:scale-[1.03] hover:shadow-xl"
              style={{
                background: "white",
                border: `1px solid ${s.color}30`,
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ background: s.color }}
              />
              <div className="text-4xl mb-3">{s.icon}</div>
              <h3 className="text-lg font-bold mb-1" style={{ color: COLORS.ink }}>
                {s.name}
              </h3>
              <p className="text-xs flex items-center gap-2" style={{ color: "#7A6F65" }}>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{ background: `${s.color}20`, color: s.color }}
                >
                  {s.count} 个故事
                </span>
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 最新绘本 - 封面墙 */}
      <section style={{ background: "rgba(250, 248, 245, 0.5)" }} className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold" style={{ color: COLORS.ink }}>
                📚 已上线绘本
              </h2>
              <p className="text-sm mt-1" style={{ color: "#7A6F65" }}>
                5 本成品绘本 · 全部免费试读
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {STORIES.map((story) => (
              <Link
                key={story.id}
                href={`/picturebook/stories/${story.id}`}
                className="group"
              >
                <div
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg group-hover:scale-105 group-hover:shadow-2xl transition-all"
                  style={{ background: "white" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={story.cover}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium text-white"
                      style={{ background: story.isFree ? COLORS.bamboo : COLORS.amber }}
                    >
                      {story.isFree ? "免费" : "会员"}
                    </span>
                  </div>
                </div>
                <h4
                  className="mt-2 text-sm font-semibold line-clamp-1"
                  style={{ color: COLORS.ink }}
                >
                  {story.title}
                </h4>
                <p className="text-xs flex items-center gap-1" style={{ color: "#7A6F65" }}>
                  <Star className="h-3 w-3" style={{ color: COLORS.amber, fill: COLORS.amber }} />
                  {story.rating} · {story.duration}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 角色快览 */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold" style={{ color: COLORS.ink }}>
            🐦 角色宇宙
          </h2>
          <p className="text-sm mt-1" style={{ color: "#7A6F65" }}>
            12 个 IP 角色，陪伴式成长
          </p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {CHARACTERS.map((c) => (
            <Link
              key={c.id}
              href={`/picturebook/characters/${c.id}`}
              className="text-center group"
            >
              <div
                className="aspect-square rounded-full mx-auto mb-2 flex items-center justify-center text-5xl transition-transform group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${c.color}30 0%, ${c.color}10 100%)`,
                  border: `3px solid ${c.color}60`,
                }}
              >
                {c.emoji}
              </div>
              <h4 className="text-sm font-bold" style={{ color: COLORS.ink }}>
                {c.name}
              </h4>
              <p className="text-xs" style={{ color: "#7A6F65" }}>
                {c.species}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 阅读模式介绍 */}
      <section style={{ background: COLORS.ink }} className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10 text-white">
            ✨ 3 种阅读模式
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl p-6 text-center" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="text-5xl mb-4">📖</div>
              <h3 className="text-xl font-bold text-white mb-2">绘本模式</h3>
              <p className="text-sm text-white/70">
                沉浸式翻页阅读，4:3 高清插图，支持左右滑动/键盘翻页
              </p>
            </div>
            <div className="rounded-2xl p-6 text-center" style={{ background: "rgba(212,160,61,0.15)", border: `1px solid ${COLORS.amber}40` }}>
              <div className="text-5xl mb-4">🔊</div>
              <h3 className="text-xl font-bold text-white mb-2">有声模式</h3>
              <p className="text-sm text-white/70">
                智能朗读，童声配音，跟读模式帮孩子学讲话
              </p>
            </div>
            <div className="rounded-2xl p-6 text-center" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="text-5xl mb-4">🎮</div>
              <h3 className="text-xl font-bold text-white mb-2">互动模式</h3>
              <p className="text-sm text-white/70">
                点击角色触发反馈，参与故事情节，理解更深
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 转化区 */}
      <section
        className="py-16"
        style={{
          background: `linear-gradient(135deg, ${COLORS.amber} 0%, ${COLORS.orange} 50%, ${COLORS.rose} 100%)`,
        }}
      >
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            开启雷迪嘎嘎的阅读之旅
          </h2>
          <p className="text-white/90 mb-8">
            1,840 个故事，9 大系列，全年龄免费试读
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/picturebook/stories"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white font-bold hover:scale-105 transition-all"
              style={{ color: COLORS.amber }}
            >
              <BookOpen className="h-4 w-4" />
              立即开始
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold border-2 border-white text-white hover:bg-white/10 transition-all"
            >
              <Heart className="h-4 w-4" />
              注册收藏
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-6 py-8 text-center bg-white">
        <p className="text-xs" style={{ color: "#A8A29E" }}>
          © 2026 雷迪嘎嘎绘本世界 · 水墨×低多边形 · 一只乌鸦的千个故事
        </p>
      </footer>
    </div>
  );
}
