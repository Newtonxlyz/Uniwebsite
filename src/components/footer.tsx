"use client";

import { ExternalLink, Mail, Globe } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="glass-nav mt-16 border-t border-white/10 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="text-xl font-bold text-gradient">
              lvyz
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              车辆安全 × AI应用工程师
            </p>
            <p className="text-sm text-gray-600">
              不断学习 · 持续进化
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">导航</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/crashai" className="text-sm text-gray-500 hover:text-white transition-colors">
                  AI学习
                </Link>
              </li>
              <li>
                <Link href="/kids-ai" className="text-sm text-gray-500 hover:text-white transition-colors">
                  儿童学堂
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">联系方式</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <Mail className="h-4 w-4" />
                lvyuanzhuo@hotmail.com
              </li>
              <li className="text-sm text-gray-500">
                +86-150-4306-8993
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-gray-600">
            © 2026 吕元卓 · 西安交通大学 · 一汽-大众
          </p>
        </div>
      </div>
    </footer>
  );
}
