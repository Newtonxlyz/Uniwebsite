export { default as characters } from "./characters";
export type { Character, Series, Story, StoryPage } from "./types";

const seriesRaw: import("./types").Series[] = [
  {
    "id": "chengyu",
    "name": "成语故事",
    "name_en": "Idiom Stories",
    "count": 600,
    "description": "中国传统成语的趣味故事演绎，让孩子在故事中学习文化底蕴。",
    "color": "text-rose-400",
    "bg": "bg-rose-500/10",
    "priority": 1,
    "image_emoji": "📜"
  },
  {
    "id": "shige",
    "name": "诗歌故事",
    "name_en": "Poetry Stories",
    "count": 252,
    "description": "经典古诗词配上雷迪嘎嘎的全新演绎，国学启蒙轻松有趣。",
    "color": "text-amber-400",
    "bg": "bg-amber-500/10",
    "priority": 1,
    "image_emoji": "🎭"
  },
  {
    "id": "gababa",
    "name": "噶巴巴成长",
    "name_en": "Gababa's Growth",
    "count": 240,
    "description": "小男孩噶巴巴的成长冒险，勇敢、探索、担当。",
    "color": "text-blue-400",
    "bg": "bg-blue-500/10",
    "priority": 1,
    "image_emoji": "🐤"
  },
  {
    "id": "gayaya",
    "name": "噶丫丫成长",
    "name_en": "Gayaya's Growth",
    "count": 240,
    "description": "小白乌鸦噶丫丫的成长故事，温柔、细腻、感动。",
    "color": "text-purple-400",
    "bg": "bg-purple-500/10",
    "priority": 1,
    "image_emoji": "🕊️"
  },
  {
    "id": "emotion",
    "name": "儿童情感引导",
    "name_en": "Emotional Guidance",
    "count": 172,
    "description": "帮助3-10岁孩子认识和管理情绪的必读系列，每本一个主题。",
    "color": "text-pink-400",
    "bg": "bg-pink-500/10",
    "priority": 0,
    "image_emoji": "💝"
  },
  {
    "id": "science",
    "name": "科普系列",
    "name_en": "Science Stories",
    "count": 77,
    "description": "自然科普、科学原理，用故事让知识变得有趣。",
    "color": "text-emerald-400",
    "bg": "bg-emerald-500/10",
    "priority": 2,
    "image_emoji": "🔬"
  },
  {
    "id": "liyu",
    "name": "俚语歇后语",
    "name_en": "Slang & Proverbs",
    "count": 106,
    "description": "趣味俚语和歇后语的绘本演绎，语言学习也可以很快乐。",
    "color": "text-orange-400",
    "bg": "bg-orange-500/10",
    "priority": 2,
    "image_emoji": "💬"
  },
  {
    "id": "mother",
    "name": "思念母亲",
    "name_en": "Missing Mother",
    "count": 53,
    "description": "温暖感人的亲情故事，关于失去与思念。",
    "color": "text-violet-400",
    "bg": "bg-violet-500/10",
    "priority": 2,
    "image_emoji": "💜"
  },
  {
    "id": "origin",
    "name": "雷迪嘎嘎诞生",
    "name_en": "Lady Gaga's Origin",
    "count": 2,
    "description": "雷迪嘎嘎系列的起源故事，一切从这里开始。",
    "color": "text-yellow-400",
    "bg": "bg-yellow-500/10",
    "priority": 0,
    "image_emoji": "🌟"
  },
  {
    "id": "drinking-water",
    "name": "乌鸦喝水系列",
    "name_en": "Crow Drinking Water",
    "count": 16,
    "description": "经典寓言的新编演绎，雷迪嘎嘎版本的乌鸦喝水故事。",
    "color": "text-cyan-400",
    "bg": "bg-cyan-500/10",
    "priority": 0,
    "image_emoji": "💧"
  }
];

export const series = seriesRaw;
