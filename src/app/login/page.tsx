"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client-helpers";

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn.email({ email, password });
      if (!result.error) {
        router.push(redirect);
        router.refresh();
      } else {
        setError(result.error.message || "登录失败");
      }
    } catch (e) {
      setError((e as Error).message || "登录失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="glass-card-strong p-8">
          <h1 className="text-2xl font-bold text-white text-center mb-2">登录</h1>
          <p className="text-sm text-gray-500 text-center mb-6">欢迎回到 Lvyz 平台</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2.5 text-sm font-medium transition-all disabled:opacity-50"
            >
              {loading ? "登录中..." : "登录"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            还没有账号？{" "}
            <Link href={`/register?redirect=${encodeURIComponent(redirect)}`} className="text-indigo-400 hover:text-indigo-300">
              注册
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">加载中…</div>}>
      <LoginPageInner />
    </Suspense>
  );
}
