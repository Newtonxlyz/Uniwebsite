"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn, signUp } from "@/lib/auth-client-helpers";

function RegisterPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !name || !password || !confirmPassword) {
      setError("请填写所有字段");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("邮箱格式不正确");
      return;
    }
    if (password.length < 8) {
      setError("密码长度至少为 8 位");
      return;
    }
    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    setLoading(true);
    try {
      const result = await signUp.email({ email, password, name });
      if (result.error) {
        setError(result.error.message || "注册失败");
        setLoading(false);
        return;
      }
      // 自动登录
      const loginResult = await signIn.email({ email, password });
      if (!loginResult.error) {
        router.push(redirect);
        router.refresh();
      } else {
        setError("注册成功，但自动登录失败，请手动登录");
        setLoading(false);
      }
    } catch (e) {
      setError((e as Error).message || "注册失败");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="glass-card-strong p-8">
          <h1 className="text-2xl font-bold text-white text-center mb-2">注册</h1>
          <p className="text-sm text-gray-500 text-center mb-6">创建你的 Lvyz 账号</p>

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
              <label className="block text-sm text-gray-400 mb-1">姓名</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                placeholder="你的名字"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">确认密码</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? "注册中..." : "注册"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            已有账号？{" "}
            <Link href={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-indigo-400 hover:text-indigo-300">
              登录
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">加载中…</div>}>
      <RegisterPageInner />
    </Suspense>
  );
}
