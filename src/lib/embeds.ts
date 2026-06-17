// 第三方平台嵌入解析（小红书 / B站 / 微信公众号 / YouTube）
// 把 URL 转换成可嵌入的 iframe / 官方组件

export interface EmbedInfo {
  platform: "xhs" | "bilibili" | "youtube" | "wechat" | "mp4" | "iframe" | "unknown";
  // iframe URL
  embedUrl?: string;
  // 缩略图
  thumbnailUrl?: string;
  // 标题（部分平台可解析）
  title?: string;
  // 原始 URL
  originalUrl: string;
  // 错误信息（解析失败时）
  error?: string;
}

const XHS_RE = /https?:\/\/(?:www\.)?xiaohongshu\.com\/(?:explore|discovery\/item|note)\/([a-zA-Z0-9]+)/;
const BILI_RE = /https?:\/\/(?:www\.)?bilibili\.com\/video\/([A-Za-z0-9]+)/;
const BILI_SHORT_RE = /https?:\/\/b23\.tv\/([A-Za-z0-9]+)/;
const YT_RE = /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]+)/;

export function parseEmbed(url: string): EmbedInfo {
  const originalUrl = url.trim();
  if (!originalUrl) {
    return { platform: "unknown", originalUrl, error: "Empty URL" };
  }

  // 小红书 - 用 web iframe 嵌入
  const xhsMatch = originalUrl.match(XHS_RE);
  if (xhsMatch) {
    // 小红书无官方 iframe，用外链
    return {
      platform: "xhs",
      embedUrl: `https://www.xiaohongshu.com/explore/${xhsMatch[1]}?xsec_token=&xsec_source=pc_search`,
      originalUrl,
      error: "小红书无官方嵌入，请使用外链卡片",
    };
  }

  // B站 - 用官方 player iframe
  const biliMatch = originalUrl.match(BILI_RE);
  if (biliMatch) {
    const bvid = biliMatch[1].startsWith("BV") ? biliMatch[1] : biliMatch[1];
    return {
      platform: "bilibili",
      embedUrl: `//player.bilibili.com/player.html?bvid=${bvid}&autoplay=0`,
      originalUrl,
      thumbnailUrl: `//i0.hdslb.com/bfs/archive/${bvid}.jpg`,
    };
  }

  // B站短链 - 标记为需要展开
  const biliShortMatch = originalUrl.match(BILI_SHORT_RE);
  if (biliShortMatch) {
    return {
      platform: "bilibili",
      embedUrl: originalUrl,  // 短链需要展开才能嵌入
      originalUrl,
      error: "B站短链需要展开为完整 URL",
    };
  }

  // YouTube
  const ytMatch = originalUrl.match(YT_RE);
  if (ytMatch) {
    return {
      platform: "youtube",
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`,
      originalUrl,
      thumbnailUrl: `https://i.ytimg.com/vi/${ytMatch[1]}/hqdefault.jpg`,
    };
  }

  // MP4 直链
  if (/\.mp4(\?|$)/i.test(originalUrl)) {
    return {
      platform: "mp4",
      embedUrl: originalUrl,
      originalUrl,
    };
  }

  // 默认 iframe
  return {
    platform: "iframe",
    embedUrl: originalUrl,
    originalUrl,
  };
}

// 解析一批 embed URLs
export function parseEmbeds(urls: string[]): EmbedInfo[] {
  return urls.filter(Boolean).map(parseEmbed);
}
