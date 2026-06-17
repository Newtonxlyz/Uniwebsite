"use client";

import { useState } from "react";
import { Send, Sparkles, RefreshCw } from "lucide-react";

const DEMO_RESPONSES: Record<string, string> = {
  default:
    "嗨！我是AI小助手🤖 你可以问我：\n\n✨ '画一只...' - 我来描述一幅画\n📖 '讲一个关于...的故事' - 我来讲故事\n💡 '解释...' - 我来解释一个概念\n\n试试看！",
  draw: "让我描述这幅画🎨：\n\n一只可爱的{主题}站在彩虹上，头顶戴着星星做的小帽子，周围飘着棉花糖一样的云朵。色彩是温暖的水彩风格，背景是淡蓝色的天空。\n\n（在真正的AI绘画工具中，我可以把这个描述变成真正的图片哦！）",
  story:
    "📖 从前有一个小机器人叫{主题}，它住在一个全是电脑的房间里。一天，{主题}发现了一个神奇的按钮...按下去之后，房间变成了一个超级游乐场！滑梯是光纤做的，秋千是键盘做的。{主题}开心极了，它邀请所有的小伙伴一起来玩。从那以后，{主题}成了最受欢迎的小机器人！\n\n（这个故事就是用AI生成的——只需要一句话的描述！）",
  explain:
    "💡 让我来解释'{主题}'：\n\n把AI想象成一个超级勤奋的学生👨‍🎓。这个学生不会累，可以同时看几百万本书！看完之后，它能回答所有关于这些书的问题。\n\n但这和人类的思考不太一样——AI更像一个'超级模式识别器'。它不'理解'东西，而是非常擅长找出规律。就像你能认出猫有尖耳朵和胡须一样，AI通过看大量数据来学习这种规律。",
};

const QUICK_PROMPTS = [
  { label: "🎨 画一只...", prefix: "画一只" },
  { label: "📖 讲故事", prefix: "讲一个关于" },
  { label: "💡 解释概念", prefix: "解释" },
];

export default function AIChatDemo() {
  const [mode, setMode] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(DEMO_RESPONSES.default);
  const [history, setHistory] = useState<
    { type: "user" | "ai"; text: string }[]
  >([]);

  const handleQuickPrompt = (prefix: string) => {
    setMode(prefix);
    setInput(prefix);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setHistory((h) => [...h, { type: "user", text: userMsg }]);

    let responseText = DEMO_RESPONSES.default;

    if (userMsg.startsWith("画一只") || userMsg.startsWith("画一个")) {
      const topic = userMsg.replace(/^(画一只|画一个)/, "").trim() || "小猫";
      responseText = DEMO_RESPONSES.draw.replace(/\{主题\}/g, topic);
    } else if (userMsg.startsWith("讲一个关于") || userMsg.startsWith("讲故事")) {
      const topic = userMsg.replace(/^(讲一个关于|讲故事)/, "").trim() || "小AI";
      responseText = DEMO_RESPONSES.story.replace(/\{主题\}/g, topic);
    } else if (userMsg.startsWith("解释")) {
      const topic = userMsg.replace(/^解释/, "").trim() || "人工智能";
      responseText = DEMO_RESPONSES.explain.replace(/\{主题\}/g, topic);
    }

    setResponse(responseText);
    setHistory((h) => [...h, { type: "ai", text: responseText }]);
    setInput("");
  };

  const handleReset = () => {
    setMode(null);
    setInput("");
    setResponse(DEMO_RESPONSES.default);
    setHistory([]);
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span className="text-sm font-medium text-white">AI对话体验</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            模拟演示
          </span>
        </div>
        <button
          onClick={handleReset}
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
          title="重新开始"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Response area */}
      <div className="p-6 min-h-[200px]">
        {history.length > 0 ? (
          <div className="space-y-4">
            {history.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                    msg.type === "user"
                      ? "bg-amber-500/20 text-amber-200 border border-amber-500/30"
                      : "bg-white/5 text-gray-200 border border-white/10"
                  }`}
                >
                  {msg.type === "ai" && (
                    <span className="text-xs text-amber-400 block mb-1">🤖 AI助手</span>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
            {response}
          </div>
        )}
      </div>

      {/* Quick prompts */}
      {history.length === 0 && (
        <div className="px-6 pb-3 flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((qp) => (
            <button
              key={qp.label}
              onClick={() => handleQuickPrompt(qp.prefix)}
              className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors border border-white/5"
            >
              {qp.label}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-6 pb-6 pt-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入你想问AI的话..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-4 py-2.5 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-amber-500/30"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-[10px] text-gray-600">
          ⚡ 提示：这是一个模拟AI对话的演示，帮助孩子理解如何和AI交流
        </p>
      </form>
    </div>
  );
}
