import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export const metadata = {
  title: "IP周边 · Lvyz Web",
  description: "学习产品 · 知识变现 · 未来",
};

export default function MerchandisePage() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] pt-20 px-6 pb-16">
      <div className="mx-auto max-w-2xl">
        <header className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-8 w-8 text-amber-400" />
            <h1 className="text-3xl font-bold text-white">
              <span className="text-gradient">IP周边</span>
            </h1>
          </div>
          <p className="mt-2 text-gray-400">学习产品 · 知识变现 · 未来</p>
        </header>

        <div className="glass-card p-8 text-center">
          <span className="text-5xl mb-4 block">🛍️</span>
          <h2 className="text-xl font-semibold text-white mb-3">即将上线</h2>
          <p className="text-gray-400 mb-6">
            IP周边正在筹备中，将提供学习产品、知识变现等衍生内容。
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 text-xs rounded-full bg-amber-500/20 text-amber-300">学习产品</span>
            <span className="px-3 py-1 text-xs rounded-full bg-orange-500/20 text-orange-300">知识变现</span>
            <span className="px-3 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-300">未来探索</span>
          </div>
        </div>
      </div>
    </div>
  );
}
