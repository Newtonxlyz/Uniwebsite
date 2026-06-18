"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Plus, Trash2, Save, User, Mail } from "lucide-react";

type SiteAccess = {
  id: string;
  userId: string;
  site: string;
  level: "NONE" | "READ" | "COMMENT" | "EDIT" | "ADMIN";
  note?: string;
  user: { id: string; email: string; name: string; role: string };
};

const SITES = ["crashai", "kids-ai", "picturebook", "blog", "knowledge-base", "merchandise"];
const LEVELS: SiteAccess["level"][] = ["NONE", "READ", "COMMENT", "EDIT", "ADMIN"];

const LEVEL_COLORS: Record<string, string> = {
  NONE: "#A8A29E",
  READ: "#60A5FA",
  COMMENT: "#34D399",
  EDIT: "#F59E0B",
  ADMIN: "#EF4444",
};

export default function SiteAccessPage() {
  const [accesses, setAccesses] = useState<SiteAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newSite, setNewSite] = useState("crashai");
  const [newLevel, setNewLevel] = useState<SiteAccess["level"]>("READ");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/site-access");
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setAccesses(data);
      setError(null);
    } catch (e: any) {
      setError(e.message || "加载失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!newEmail) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/site-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, site: newSite, level: newLevel }),
      });
      if (!res.ok) throw new Error(await res.text());
      setNewEmail("");
      await load();
    } catch (e: any) {
      alert(e.message || "添加失败");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (email: string, site: string) => {
    if (!confirm(`撤销 ${email} 对 ${site} 的权限？`)) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/site-access", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, site }),
      });
      if (!res.ok) throw new Error(await res.text());
      await load();
    } catch (e: any) {
      alert(e.message || "删除失败");
    } finally {
      setSaving(false);
    }
  };

  const handleChangeLevel = async (a: SiteAccess, newLevel: SiteAccess["level"]) => {
    if (newLevel === a.level) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/site-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: a.user.email, site: a.site, level: newLevel }),
      });
      if (!res.ok) throw new Error(await res.text());
      await load();
    } catch (e: any) {
      alert(e.message || "更新失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-6 pb-16" style={{ background: "#FAF8F5" }}>
      <div className="max-w-5xl mx-auto">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          返回管理后台
        </Link>

        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-indigo-500" />
            子站权限管理
          </h1>
          <p className="text-sm text-gray-600">
            全站统一账号 + 按子站粒度授权。SUPERADMIN / ADMIN 可管理。
          </p>
        </div>

        {/* 添加权限 */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Plus className="h-5 w-5 text-emerald-500" />
            授权新用户
          </h2>
          <div className="grid md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <label className="text-xs text-gray-500 mb-1 block">用户邮箱</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">子站</label>
              <select
                value={newSite}
                onChange={(e) => setNewSite(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-indigo-500"
              >
                {SITES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">权限等级</label>
              <select
                value={newLevel}
                onChange={(e) => setNewLevel(e.target.value as SiteAccess["level"])}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-indigo-500"
              >
                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={!newEmail || saving}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-lg text-white font-medium disabled:opacity-50 hover:scale-105 transition-all"
            style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
          >
            <Save className="h-4 w-4" />
            {saving ? "保存中..." : "授权"}
          </button>
        </div>

        {/* 权限列表 */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <User className="h-5 w-5 text-cyan-500" />
            当前权限 ({accesses.length})
          </h2>
          {loading ? (
            <p className="text-sm text-gray-500">加载中...</p>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : accesses.length === 0 ? (
            <p className="text-sm text-gray-500">还没有任何授权。注册用户 + 上方授权后会出现。</p>
          ) : (
            <div className="space-y-2">
              {accesses.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-indigo-200 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Mail className="h-3.5 w-3.5 text-gray-400" />
                      {a.user.email}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {a.user.name} · 角色 {a.user.role}
                    </div>
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded-md font-mono"
                    style={{ background: `${LEVEL_COLORS[a.level]}20`, color: LEVEL_COLORS[a.level] }}
                  >
                    {a.site}
                  </span>
                  <select
                    value={a.level}
                    onChange={(e) => handleChangeLevel(a, e.target.value as SiteAccess["level"])}
                    disabled={saving}
                    className="text-xs px-2 py-1 rounded-md border border-gray-200 focus:outline-none focus:border-indigo-500"
                  >
                    {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <button
                    onClick={() => handleDelete(a.user.email, a.site)}
                    disabled={saving}
                    className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="撤销权限"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 权限说明 */}
        <div className="mt-6 bg-blue-50 rounded-2xl p-5 text-sm">
          <h3 className="font-semibold mb-2 text-blue-900">权限等级说明</h3>
          <ul className="space-y-1 text-blue-800 text-xs">
            <li><b>NONE</b>：无权访问（默认）</li>
            <li><b>READ</b>：只读（看内容、订阅、评论）</li>
            <li><b>COMMENT</b>：读+评论（参与讨论）</li>
            <li><b>EDIT</b>：写（发布内容、上传、修改自己内容）</li>
            <li><b>ADMIN</b>：子站管理员（管理所有内容）</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
