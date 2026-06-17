import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] pt-20 px-6 pb-16 flex items-center justify-center">
      <div className="text-center">
        <span className="text-6xl block mb-4">🔍</span>
        <h2 className="text-2xl font-bold text-white mb-2">页面未找到</h2>
        <p className="text-gray-400 mb-6">抱歉，这个绘本页面还没有上线</p>
        <Link
          href="/picturebook"
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-pink-500/25 transition-all"
        >
          返回绘本首页
        </Link>
      </div>
    </div>
  );
}
