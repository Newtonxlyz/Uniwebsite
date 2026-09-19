// /api/courses/state - 课程学习数据云端同步（KV 文档模型）
// GET:  拉取当前用户某门课（或全部课）的学习文档
// POST: 批量 upsert / 删除（LWW：客户端 ts 大者胜，防乱序重试覆盖新数据）
//
// 客户端契约（public/courses/_shared/course-cloud.js）：
//   - key   = 完整 localStorage key（course_<courseId>_xxx）
//   - value = 学习文档整体 JSON
//   - ts    = 客户端 Date.now()，冲突比较依据
//   - deleted = true 表示墓碑（客户端删除了该 key）
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// 单文档体积上限：进度/闪卡元数据都很小，1MB 足够且防滥用
const MAX_VALUE_BYTES = 1024 * 1024;
const MAX_ENTRIES_PER_PUSH = 200;

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const url = new URL(req.url);
  const courseId = url.searchParams.get("courseId"); // 缺省 = 全部课程

  const entries = await prisma.courseKv.findMany({
    where: { userId: session.user.id, ...(courseId ? { courseId } : {}) },
    select: { courseId: true, key: true, value: true, ts: true },
  });

  // BigInt 不能直接 JSON 序列化,转成 number(毫秒时间戳在 double 精度内)
  return NextResponse.json({
    entries: entries.map((e) => ({ courseId: e.courseId, key: e.key, value: e.value, ts: Number(e.ts) })),
  });
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const body = await req.json();
  const courseId = String(body?.courseId || "");
  const entries: any[] = Array.isArray(body?.entries) ? body.entries : [];

  if (!courseId) return NextResponse.json({ error: "缺少 courseId" }, { status: 400 });
  if (entries.length === 0) return NextResponse.json({ ok: true, applied: 0 });
  if (entries.length > MAX_ENTRIES_PER_PUSH) {
    return NextResponse.json({ error: `单批最多 ${MAX_ENTRIES_PER_PUSH} 条` }, { status: 400 });
  }

  let applied = 0;
  for (const e of entries) {
    const key = String(e?.key || "");
    const ts = BigInt(Math.trunc(Number(e?.ts) || 0));
    // key 必须属于该课程且在本系统命名空间内，防止越课写
    if (!key.startsWith("course_") || !key.includes(courseId)) continue;

    if (e?.deleted) {
      // 墓碑删除：仅当本地 ts 更新（同 LWW 语义）
      await prisma.courseKv.deleteMany({
        where: { userId: session.user.id, courseId, key, ts: { lt: ts } },
      });
      applied++;
      continue;
    }

    if (JSON.stringify(e.value ?? null).length > MAX_VALUE_BYTES) continue;

    // LWW：仅当已有记录 ts 更旧才更新；不存在则创建（并发 create 冲突 = 已有更新值，忽略）
    const updated = await prisma.courseKv.updateMany({
      where: { userId: session.user.id, courseId, key, ts: { lt: ts } },
      data: { value: e.value ?? null, ts },
    });
    if (updated.count === 0) {
      try {
        await prisma.courseKv.create({
          data: { userId: session.user.id, courseId, key, value: e.value ?? null, ts },
        });
      } catch {
        // P2002：并发创建或已有同 key 记录（其 ts >= 本批次），LWW 语义下丢弃本次
      }
    }
    applied++;
  }

  return NextResponse.json({ ok: true, applied });
}
