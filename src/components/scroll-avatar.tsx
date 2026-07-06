// ScrollAvatar - 滚动后固定在 nav 下方的迷你卡片
// 滚动 hero 区域时淡入：cartoon 小头像 + horizontal logo + 名字

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ScrollAvatar() {
  const [visible, setVisible] = useState(false);
  const [isLight, setIsLight] = useState(false);

  // 监听滚动：hero 离开视口后显示
  useEffect(() => {
    const handler = () => {
      // hero 顶部大约 600px 高度，滚过 400px 后显示
      setVisible(window.scrollY > 400);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // 主题检测
  useEffect(() => {
    const check = () => {
      setIsLight(document.documentElement.classList.contains("light"));
    };
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  return (
    <div
      className={`fixed top-16 left-0 right-0 z-30 pointer-events-none transition-all duration-300 ease-out ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-3"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="pointer-events-auto inline-flex flex-col items-center gap-1.5 glass-nav px-3 py-2 rounded-b-xl border border-t-0 border-white/10">
          {/* 卡通小头像 */}
          <div className="relative h-12 w-12 rounded-full overflow-hidden ring-2 ring-cyan-500/40">
            <img
              src="/cartoon-avatar.png"
              alt="吕元卓"
              className="h-full w-full object-cover"
            />
          </div>

          {/* 名字 + 头衔 */}
          <Link
            href="#about"
            className="text-xs font-semibold text-white hover:text-cyan-300 transition-colors"
          >
            吕元卓
          </Link>

          {/* Horizontal Logo（主题切换） */}
          <img
            src={isLight ? "/logo-horizontal-light.svg" : "/logo-horizontal-dark.svg"}
            alt="Lvyz"
            className="h-4 w-auto"
          />
        </div>
      </div>
    </div>
  );
}
