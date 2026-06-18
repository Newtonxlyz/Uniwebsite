"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, CheckCircle2, XCircle, Sparkles, Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const C = {
  primary: "#FF6B9D",
  secondary: "#4ECDC4",
  yellow: "#FFE66D",
  purple: "#A78BFA",
  orange: "#FB923C",
  blue: "#60A5FA",
  green: "#10B981",
  red: "#EF4444",
};

const GAME_META: Record<string, { name: string; icon: string; color: string }> = {
  "find-ai": { name: "找 AI 小工具", icon: "🔍", color: C.blue },
  "fruit-sort": { name: "水果分类", icon: "🍎", color: C.green },
  "ai-vs-human": { name: "AI vs 人类", icon: "🤔", color: C.primary },
  "magic-command": { name: "指令魔法", icon: "✨", color: C.purple },
  "story-chain": { name: "故事接龙", icon: "📖", color: C.orange },
  "train-ai": { name: "教 AI 认动物", icon: "🐱", color: C.red },
};

// ===== 游戏 1: 找 AI 小工具 =====
function FindAIGame() {
  const ITEMS = [
    { id: 1, name: "小爱音箱", icon: "🔊", isAI: true, x: 12, y: 18 },
    { id: 2, name: "积木玩具", icon: "🧱", isAI: false, x: 75, y: 15 },
    { id: 3, name: "扫地机器人", icon: "🤖", isAI: true, x: 30, y: 60 },
    { id: 4, name: "铅笔盒", icon: "✏️", isAI: false, x: 80, y: 70 },
    { id: 5, name: "智能手表", icon: "⌚", isAI: true, x: 55, y: 25 },
    { id: 6, name: "画册", icon: "📔", isAI: false, x: 18, y: 80 },
    { id: 7, name: "翻译笔", icon: "📝", isAI: true, x: 65, y: 50 },
    { id: 8, name: "毛绒熊", icon: "🧸", isAI: false, x: 40, y: 88 },
    { id: 9, name: "学习平板", icon: "📱", isAI: true, x: 22, y: 45 },
    { id: 10, name: "水杯", icon: "🥤", isAI: false, x: 50, y: 75 },
    { id: 11, name: "智能台灯", icon: "💡", isAI: true, x: 88, y: 38 },
    { id: 12, name: "弹珠", icon: "🔮", isAI: false, x: 8, y: 60 },
  ];
  const [found, setFound] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const totalAI = ITEMS.filter((i) => i.isAI).length;

  const click = (it: typeof ITEMS[0]) => {
    if (found.includes(it.id)) return;
    if (it.isAI) {
      setFound([...found, it.id]);
      setScore(score + 10);
    } else {
      setMisses(misses + 1);
    }
  };

  const done = found.length === totalAI;
  const accuracy = misses + found.length > 0 ? Math.round(found.length / (misses + found.length) * 100) : 100;

  return (
    <div className="space-y-4">
      <div className="glass-card p-3 flex items-center justify-between text-sm">
        <span>找到 <b className="text-cyan-500">{found.length}</b>/{totalAI} 个 AI 小工具</span>
        <span>得分 <b className="text-pink-500">{score}</b> · 误点 {misses}</span>
      </div>
      <div className="relative bg-gradient-to-br from-yellow-50 to-pink-50 rounded-2xl p-4" style={{ height: 480 }}>
        {ITEMS.map((it) => (
          <button
            key={it.id}
            onClick={() => click(it)}
            disabled={found.includes(it.id)}
            className={cn(
              "absolute w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-2xl transition-all",
              found.includes(it.id)
                ? "bg-green-100 ring-2 ring-green-400 scale-110"
                : "bg-white/80 hover:scale-110 shadow"
            )}
            style={{ left: `${it.x}%`, top: `${it.y}%`, transform: "translate(-50%,-50%)" }}
          >
            {it.icon}
            {found.includes(it.id) && <CheckCircle2 className="h-4 w-4 absolute -top-1 -right-1 text-green-500 bg-white rounded-full" />}
          </button>
        ))}
      </div>
      {done && (
        <div className="glass-card p-4 text-center">
          <Sparkles className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <p className="font-bold text-lg">完成！</p>
          <p className="text-sm text-gray-500">准确率 {accuracy}% · 得分 {score}</p>
        </div>
      )}
    </div>
  );
}

// ===== 游戏 2: 水果分类 =====
function FruitSortGame() {
  const FRUITS = [
    { name: "苹果", icon: "🍎", category: "红色" },
    { name: "香蕉", icon: "🍌", category: "黄色" },
    { name: "橙子", icon: "🍊", category: "橙色" },
    { name: "葡萄", icon: "🍇", category: "紫色" },
    { name: "草莓", icon: "🍓", category: "红色" },
    { name: "柠檬", icon: "🍋", category: "黄色" },
    { name: "西瓜", icon: "🍉", category: "红色" },
    { name: "蓝莓", icon: "🫐", category: "蓝色" },
    { name: "桃", icon: "🍑", category: "粉色" },
    { name: "菠萝", icon: "🍍", icon2: "", category: "黄色" },
  ];
  const BUCKETS = [
    { name: "红色", color: "#EF4444" },
    { name: "黄色", color: "#FBBF24" },
    { name: "橙色", color: "#FB923C" },
    { name: "紫色", color: "#A78BFA" },
    { name: "粉色", color: "#EC4899" },
    { name: "蓝色", color: "#60A5FA" },
  ];
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"good" | "bad" | null>(null);

  const drop = (bucket: string) => {
    const correct = FRUITS[current].category === bucket;
    setFeedback(correct ? "good" : "bad");
    if (correct) setScore(score + 10);
    setTimeout(() => {
      setFeedback(null);
      if (current + 1 < FRUITS.length) setCurrent(current + 1);
      else setCurrent(FRUITS.length);
    }, 800);
  };

  const done = current >= FRUITS.length;

  return (
    <div className="space-y-4">
      {!done ? (
        <>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">这个水果属于哪个颜色？</p>
            <div className="inline-flex flex-col items-center bg-white rounded-3xl px-8 py-6 shadow-lg">
              <div className="text-7xl mb-2">{FRUITS[current].icon}</div>
              <p className="font-bold text-xl">{FRUITS[current].name}</p>
            </div>
            {feedback && (
              <div className={cn("mt-3 text-lg font-bold", feedback === "good" ? "text-green-500" : "text-red-500")}>
                {feedback === "good" ? "✓ 答对了！" : "✗ 错啦！"}
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {BUCKETS.map((b) => (
              <button
                key={b.name}
                onClick={() => drop(b.name)}
                className="rounded-2xl p-4 text-white font-bold shadow-md hover:scale-105 transition-all"
                style={{ background: b.color }}
              >
                {b.name}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="glass-card p-6 text-center">
          <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold mb-2">水果分类完成！</p>
          <p className="text-gray-500">得分：{score}/{FRUITS.length * 10}</p>
        </div>
      )}
      <p className="text-center text-xs text-gray-400">第 {Math.min(current + 1, FRUITS.length)}/{FRUITS.length} 题</p>
    </div>
  );
}

// ===== 游戏 3: AI vs 人类 =====
function AIvsHumanGame() {
  const PAIRS = [
    { id: 1, art: "👨‍🎨", answer: "human", fact: "人类画师用手绘" },
    { id: 2, art: "🤖", answer: "ai", fact: "AI 通过学习 100 万张图生成" },
    { id: 3, art: "👩‍🎨", answer: "human", fact: "人类画师 3 小时完成" },
    { id: 4, art: "🎨", answer: "ai", fact: "AI 只需 30 秒生成 4 张" },
    { id: 5, art: "👨‍🎓", answer: "human", fact: "学生手工作业" },
    { id: 6, art: "✨", answer: "ai", fact: "AI 风格化处理" },
  ];
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [reveal, setReveal] = useState(false);

  const guess = (g: "ai" | "human") => {
    if (reveal) return;
    setReveal(true);
    if (g === PAIRS[idx].answer) setScore(score + 10);
    setTimeout(() => {
      setReveal(false);
      if (idx + 1 < PAIRS.length) setIdx(idx + 1);
      else setIdx(PAIRS.length);
    }, 2000);
  };

  const done = idx >= PAIRS.length;

  return (
    <div className="space-y-4">
      {!done ? (
        <>
          <p className="text-center text-sm text-gray-500">这幅画是 AI 还是人类画的？</p>
          <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
            <div className="text-9xl">{PAIRS[idx].art}</div>
            {reveal && (
              <p className="mt-4 text-lg font-bold" style={{ color: PAIRS[idx].answer === "ai" ? C.purple : C.primary }}>
                {PAIRS[idx].answer === "ai" ? "🤖 AI 画的" : "👤 人类画的"}
                <br />
                <span className="text-sm text-gray-500">{PAIRS[idx].fact}</span>
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => guess("human")}
              disabled={reveal}
              className="rounded-2xl p-4 text-white font-bold shadow-md hover:scale-105 transition-all disabled:opacity-50"
              style={{ background: C.primary }}
            >
              👤 人类画的
            </button>
            <button
              onClick={() => guess("ai")}
              disabled={reveal}
              className="rounded-2xl p-4 text-white font-bold shadow-md hover:scale-105 transition-all disabled:opacity-50"
              style={{ background: C.purple }}
            >
              🤖 AI 画的
            </button>
          </div>
        </>
      ) : (
        <div className="glass-card p-6 text-center">
          <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold mb-2">猜猜乐完成！</p>
          <p className="text-gray-500">得分：{score}/{PAIRS.length * 10}</p>
          <p className="text-xs text-gray-400 mt-2">AI 越来越像人类，人类也越来越像 AI 😄</p>
        </div>
      )}
      <p className="text-center text-xs text-gray-400">第 {Math.min(idx + 1, PAIRS.length)}/{PAIRS.length} 题</p>
    </div>
  );
}

// ===== 游戏 4: 指令魔法 =====
function MagicCommandGame() {
  const SCENES = [
    {
      goal: "让 AI 画一只粉色小猫",
      bad: "画猫",
      good: "画一只粉色的小猫，背景是花园，圆圆的眼睛，戴蝴蝶结",
      why: "具体细节 = 更好的结果",
    },
    {
      goal: "让 AI 写一封道歉信",
      bad: "写道歉信",
      good: "给最好的朋友写一封真诚的道歉信，因为我没去他的生日派对，要 100 字，语气温暖",
      why: "背景 + 字数 + 语气 = 完整指令",
    },
    {
      goal: "让 AI 推荐一本书",
      bad: "推荐书",
      good: "我 8 岁，喜欢冒险故事，讨厌恐怖，请推荐一本适合我的书，告诉我为什么推荐",
      why: "年龄 + 喜好 + 原因 = 个性化",
    },
    {
      goal: "让 AI 解释火山",
      bad: "什么是火山",
      good: "用 5 岁孩子能懂的话解释什么是火山，举个例子，加点比喻",
      why: "受众 + 例子 + 比喻 = 易懂",
    },
  ];
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<"bad" | "good" | null>(null);
  const [score, setScore] = useState(0);

  const choose = (k: "bad" | "good") => {
    setPicked(k);
    if (k === "good") setScore(score + 10);
    setTimeout(() => {
      setPicked(null);
      if (idx + 1 < SCENES.length) setIdx(idx + 1);
      else setIdx(SCENES.length);
    }, 2500);
  };

  const done = idx >= SCENES.length;

  return (
    <div className="space-y-4">
      {!done ? (
        <>
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-500">任务</p>
            <p className="font-bold text-lg">📌 {SCENES[idx].goal}</p>
          </div>
          <p className="text-center text-sm text-gray-500">选一个更好的指令：</p>
          <button
            onClick={() => choose("bad")}
            disabled={!!picked}
            className={cn(
              "w-full p-4 rounded-2xl text-left transition-all",
              picked === "bad" ? "bg-red-100 ring-2 ring-red-400" : "bg-white hover:bg-red-50 border-2 border-gray-200"
            )}
          >
            <div className="text-xs text-gray-400 mb-1">指令 A</div>
            <div className="text-sm">{SCENES[idx].bad}</div>
          </button>
          <button
            onClick={() => choose("good")}
            disabled={!!picked}
            className={cn(
              "w-full p-4 rounded-2xl text-left transition-all",
              picked === "good" ? "bg-green-100 ring-2 ring-green-400" : "bg-white hover:bg-green-50 border-2 border-gray-200"
            )}
          >
            <div className="text-xs text-gray-400 mb-1">指令 B</div>
            <div className="text-sm">{SCENES[idx].good}</div>
          </button>
          {picked && (
            <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-4 text-center">
              <p className="text-sm">💡 {SCENES[idx].why}</p>
            </div>
          )}
        </>
      ) : (
        <div className="glass-card p-6 text-center">
          <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold mb-2">指令魔法师！</p>
          <p className="text-gray-500">得分：{score}/{SCENES.length * 10}</p>
        </div>
      )}
      <p className="text-center text-xs text-gray-400">第 {Math.min(idx + 1, SCENES.length)}/{SCENES.length} 轮</p>
    </div>
  );
}

// ===== 游戏 5: 故事接龙 =====
function StoryChainGame() {
  const STARTERS = [
    "在一个彩虹色的森林里，小兔子发现了一只会说话的石头...",
    "外星人小朋友第一次来到地球，他发现了一个奇怪的盒子...",
    "魔法学校开学第一天，小巫师们的扫帚全部飞走了...",
    "海底城市里，小海豚收到一封来自深海的求救信...",
  ];
  const PROMPTS = [
    "然后发生了什么呢？",
    "接下来谁会出现？",
    "小主人公会怎么做？",
    "故事会怎么结束？",
  ];
  const [starter] = useState(STARTERS[Math.floor(Math.random() * STARTERS.length)]);
  const [lines, setLines] = useState<string[]>([starter]);
  const [input, setInput] = useState("");
  const [prompt] = useState(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  const [finished, setFinished] = useState(false);

  const add = () => {
    if (!input.trim()) return;
    const aiResponse = `🤖 妙妙说：${input.includes("？") || input.includes("?") ? "这是个有趣的问题！" : "我接着写——"}${input}之后，故事变得更加精彩了...`;
    setLines([...lines, `👦 你：${input}`, aiResponse]);
    setInput("");
  };

  const end = () => {
    setLines([...lines, "📖 故事结局：从此，他们过上了幸福快乐的生活！"]);
    setFinished(true);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 max-h-96 overflow-y-auto space-y-2">
        {lines.map((l, i) => (
          <div
            key={i}
            className={cn("p-3 rounded-xl text-sm", l.startsWith("👦") ? "bg-pink-50" : l.startsWith("🤖") ? "bg-cyan-50" : l.startsWith("📖") ? "bg-yellow-50 text-center font-bold" : "bg-purple-50")}
          >
            {l}
          </div>
        ))}
      </div>
      {!finished ? (
        <>
          <div className="bg-purple-50 rounded-xl p-3 text-sm text-purple-700">
            💡 {prompt}
          </div>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              placeholder="接着写..."
              className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-pink-300 focus:outline-none text-sm"
            />
            <button
              onClick={add}
              disabled={!input.trim()}
              className="px-4 py-2 rounded-xl text-white font-bold disabled:opacity-50"
              style={{ background: C.primary }}
            >
              接着写
            </button>
            <button
              onClick={end}
              className="px-4 py-2 rounded-xl text-white font-bold"
              style={{ background: C.orange }}
            >
              结局
            </button>
          </div>
        </>
      ) : (
        <div className="text-center text-sm text-gray-500">🎉 故事写完啦！</div>
      )}
    </div>
  );
}

// ===== 游戏 6: 教 AI 认动物 =====
function TrainAIGame() {
  const ANIMALS = [
    { name: "猫", icon: "🐱", hint: "喵喵叫，会爬树" },
    { name: "狗", icon: "🐶", hint: "汪汪叫，忠诚" },
    { name: "鸟", icon: "🐦", hint: "会飞，叽叽喳喳" },
    { name: "鱼", icon: "🐟", hint: "生活在水里" },
    { name: "兔", icon: "🐰", hint: "长耳朵，爱吃胡萝卜" },
    { name: "马", icon: "🐴", hint: "跑得快，能拉车" },
    { name: "牛", icon: "🐮", hint: "产奶，吃草" },
    { name: "羊", icon: "🐑", hint: "产毛，温顺" },
  ];
  const OPTIONS = ["🐱", "🐶", "🐦", "🐟", "🐰", "🐴", "🐮", "🐑"];
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [train, setTrain] = useState<{ right: number; wrong: number }[]>([]);
  const [feedback, setFeedback] = useState<"good" | "bad" | null>(null);

  const current = ANIMALS[idx];

  const pick = (emoji: string) => {
    const correct = emoji === current.icon;
    setFeedback(correct ? "good" : "bad");
    if (correct) setScore(score + 10);
    setTrain([...train, { right: correct ? 1 : 0, wrong: correct ? 0 : 1 }]);

    setTimeout(() => {
      setFeedback(null);
      if (idx + 1 < ANIMALS.length) setIdx(idx + 1);
      else setIdx(ANIMALS.length);
    }, 1200);
  };

  const done = idx >= ANIMALS.length;
  const trained = train.length;
  const accuracy = trained > 0 ? Math.round((train.reduce((s, t) => s + t.right, 0) / trained) * 100) : 100;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 flex items-center justify-between text-sm">
        <span>已训练 <b className="text-pink-500">{trained}</b>/{ANIMALS.length} 只动物</span>
        <span>准确率 <b className="text-cyan-500">{accuracy}%</b></span>
      </div>
      {!done ? (
        <>
          <div className="bg-gradient-to-br from-yellow-50 to-pink-50 rounded-2xl p-6 text-center">
            <p className="text-xs text-gray-500 mb-2">提示：</p>
            <p className="text-lg font-bold mb-1">{current.hint}</p>
            <p className="text-sm text-gray-500">这是哪种动物？</p>
            {feedback && (
              <p className={cn("mt-3 text-lg font-bold", feedback === "good" ? "text-green-500" : "text-red-500")}>
                {feedback === "good" ? `✓ 是 ${current.name}！` : `✗ 错啦！正确是 ${current.name}`}
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {OPTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => pick(emoji)}
                disabled={!!feedback}
                className="aspect-square rounded-2xl bg-white hover:bg-pink-50 shadow-md hover:scale-105 transition-all flex items-center justify-center text-5xl disabled:opacity-50"
              >
                {emoji}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="glass-card p-6 text-center">
          <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold mb-2">AI 已毕业！</p>
          <p className="text-gray-500">训练 {ANIMALS.length} 只动物 · 准确率 {accuracy}%</p>
          <p className="text-xs text-gray-400 mt-2">你刚刚"训练"了一个 AI 模型 🎉</p>
        </div>
      )}
    </div>
  );
}

const Trophy = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

export default function GamePage({ params }: { params: { slug: string } }) {
  const meta = GAME_META[params.slug];
  if (!meta) {
    return (
      <div className="min-h-screen pt-20 px-6 text-center">
        <p>未找到游戏</p>
        <Link href="/kids-ai/games" className="text-pink-500 underline">返回游戏列表</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-6 pb-16" style={{ background: "linear-gradient(180deg, #FFF5F7 0%, #F0F9FF 100%)" }}>
      <div className="max-w-3xl mx-auto">
        <Link href="/kids-ai/games" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6">
          <ArrowLeft className="h-4 w-4" /> 返回游戏列表
        </Link>
        <div className="text-center mb-6">
          <div className="text-6xl mb-2">{meta.icon}</div>
          <h1 className="text-3xl font-bold" style={{ color: meta.color }}>{meta.name}</h1>
        </div>
        <div className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-xl">
          {params.slug === "find-ai" && <FindAIGame />}
          {params.slug === "fruit-sort" && <FruitSortGame />}
          {params.slug === "ai-vs-human" && <AIvsHumanGame />}
          {params.slug === "magic-command" && <MagicCommandGame />}
          {params.slug === "story-chain" && <StoryChainGame />}
          {params.slug === "train-ai" && <TrainAIGame />}
        </div>
      </div>
    </div>
  );
}
