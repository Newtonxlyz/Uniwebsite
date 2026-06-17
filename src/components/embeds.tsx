// 嵌入内容渲染器（小红书 / B站 / YouTube / MP4）
import Link from "next/link";
import { ExternalLink, Music, Video, FileText } from "lucide-react";
import type { EmbedInfo } from "@/lib/embeds";

export function EmbedList({ embeds }: { embeds: EmbedInfo[] }) {
  return (
    <div className="space-y-4">
      {embeds.map((embed, i) => (
        <EmbedCard key={i} embed={embed} />
      ))}
    </div>
  );
}

function EmbedCard({ embed }: { embed: EmbedInfo }) {
  // B站 - 官方 player iframe
  if (embed.platform === "bilibili" && embed.embedUrl?.includes("player.bilibili.com")) {
    return (
      <div className="glass-card overflow-hidden">
        <iframe
          src={embed.embedUrl}
          scrolling="no"
          frameBorder="0"
          allowFullScreen
          className="w-full aspect-video"
          title={`B站视频 ${embed.originalUrl}`}
        />
        <div className="px-3 py-2 text-xs text-gray-500 truncate">{embed.originalUrl}</div>
      </div>
    );
  }

  // YouTube
  if (embed.platform === "youtube" && embed.embedUrl) {
    return (
      <div className="glass-card overflow-hidden">
        <iframe
          src={embed.embedUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full aspect-video"
          title={`YouTube ${embed.originalUrl}`}
        />
        <div className="px-3 py-2 text-xs text-gray-500 truncate">{embed.originalUrl}</div>
      </div>
    );
  }

  // MP4 直链
  if (embed.platform === "mp4" && embed.embedUrl) {
    return (
      <div className="glass-card overflow-hidden">
        <video
          src={embed.embedUrl}
          controls
          className="w-full max-h-[600px]"
        />
        <div className="px-3 py-2 text-xs text-gray-500 truncate">{embed.originalUrl}</div>
      </div>
    );
  }

  // 小红书 - 无官方嵌入，显示外链卡片
  if (embed.platform === "xhs") {
    return (
      <Link
        href={embed.originalUrl}
        target="_blank"
        rel="noopener"
        className="glass-card flex items-center gap-3 p-4 hover:scale-[1.01] transition-transform"
      >
        <div className="h-10 w-10 rounded bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white text-xl">
          📕
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">小红书内容</p>
          <p className="text-xs text-gray-500 truncate">{embed.originalUrl}</p>
          <p className="text-xs text-amber-300 mt-1">点击跳转查看 →</p>
        </div>
        <ExternalLink className="h-4 w-4 text-gray-500" />
      </Link>
    );
  }

  // 默认 iframe
  if (embed.platform === "iframe" && embed.embedUrl) {
    return (
      <div className="glass-card overflow-hidden">
        <iframe
          src={embed.embedUrl}
          className="w-full h-[400px]"
          title={`嵌入 ${embed.originalUrl}`}
        />
        <div className="px-3 py-2 text-xs text-gray-500 truncate">{embed.originalUrl}</div>
      </div>
    );
  }

  // 兜底：显示为链接
  return (
    <Link
      href={embed.originalUrl}
      target="_blank"
      rel="noopener"
      className="glass-card flex items-center gap-3 p-4 hover:scale-[1.01] transition-transform"
    >
      <ExternalLink className="h-5 w-5 text-amber-400" />
      <span className="text-sm text-gray-300 truncate flex-1">{embed.originalUrl}</span>
    </Link>
  );
}
