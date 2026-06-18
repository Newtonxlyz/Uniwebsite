import Link from "next/link";
import { ArrowLeft, Heart, Shield, BookOpen, Users, Sparkles, Mail } from "lucide-react";

export const metadata = {
  title: "关于 Kids AI · Lvyz Web",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 px-4 pb-16" style={{ background: "linear-gradient(180deg, #FFF5F7 0%, #F0F9FF 100%)" }}>
      <div className="max-w-3xl mx-auto">
        <Link
          href="/kids-ai"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          返回 Kids AI 首页
        </Link>

        <div className="text-center mb-8">
          <Sparkles className="h-12 w-12 mx-auto mb-3" style={{ color: "#FF6B9D" }} />
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: "#FF6B9D" }}>
            关于 Kids AI 学堂
          </h1>
          <p className="text-sm text-gray-500">
            为 6-12 岁孩子打造的 AI 启蒙乐园
          </p>
        </div>

        {/* 使命 */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-4">
          <h2 className="text-xl font-bold mb-3 text-gray-800 flex items-center gap-2">
            <Heart className="h-5 w-5" style={{ color: "#FF6B9D" }} />
            我们的使命
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            在 AI 时代，每个孩子都应该了解 AI，而不仅仅是使用 AI。
            Kids AI 学堂通过 10 章互动课程 + 6 个趣味游戏 + 5 个创作工具，
            让孩子在玩中理解 AI、爱上 AI，培养面向未来的核心素养。
          </p>
        </div>

        {/* 设计原则 */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-4">
          <h2 className="text-xl font-bold mb-3 text-gray-800 flex items-center gap-2">
            <BookOpen className="h-5 w-5" style={{ color: "#4ECDC4" }} />
            设计原则
          </h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• <b>游戏化学习</b>：每个概念都通过互动游戏呈现，枯燥的概念变成有趣挑战</li>
            <li>• <b>故事化引导</b>：用 3 个 IP 角色（小智/妙妙/博博）陪伴孩子探索</li>
            <li>• <b>本地 AI 优先</b>：核心功能用本地模拟实现，不依赖云端，保护隐私</li>
            <li>• <b>家长可控</b>：所有内容经过审核，无广告、无付费陷阱</li>
          </ul>
        </div>

        {/* 内容体系 */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-4">
          <h2 className="text-xl font-bold mb-3 text-gray-800 flex items-center gap-2">
            <Users className="h-5 w-5" style={{ color: "#A78BFA" }} />
            内容体系
          </h2>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl p-3" style={{ background: "#FF6B9D15" }}>
              <div className="text-2xl font-bold" style={{ color: "#FF6B9D" }}>10</div>
              <div className="text-xs text-gray-500">章课程</div>
            </div>
            <div className="rounded-xl p-3" style={{ background: "#4ECDC415" }}>
              <div className="text-2xl font-bold" style={{ color: "#4ECDC4" }}>6</div>
              <div className="text-xs text-gray-500">个互动游戏</div>
            </div>
            <div className="rounded-xl p-3" style={{ background: "#A78BFA15" }}>
              <div className="text-2xl font-bold" style={{ color: "#A78BFA" }}>5</div>
              <div className="text-xs text-gray-500">个 AI 工具</div>
            </div>
          </div>
        </div>

        {/* 政策引用 */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-4">
          <h2 className="text-xl font-bold mb-3 text-gray-800 flex items-center gap-2">
            <Shield className="h-5 w-5" style={{ color: "#FB923C" }} />
            内容政策
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            所有课程内容均参考：
            <br />• 义务教育信息科技课程标准（2022 版）
            <br />• 儿童网络保护条例
            <br />• 内容审核遵循"积极、友善、启发"三原则
          </p>
        </div>

        {/* 联系 */}
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-6 text-center">
          <Mail className="h-8 w-8 mx-auto mb-2" style={{ color: "#FF6B9D" }} />
          <p className="text-sm text-gray-700 mb-1">有建议或反馈？</p>
          <a
            href="mailto:lvyuanzhuo@hotmail.com"
            className="text-sm font-bold"
            style={{ color: "#FF6B9D" }}
          >
            lvyuanzhuo@hotmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
