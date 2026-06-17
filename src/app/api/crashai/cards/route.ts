// /api/crashai/cards - 返回所有学习卡片
// 这个 route 在 server 端跑，可以安全 import server-data（用 fs）
import { NextResponse } from "next/server";
import { getCards } from "@/lib/server-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cards = await getCards();
    return NextResponse.json(cards);
  } catch (e) {
    console.error("[api/crashai/cards] error:", e);
    return NextResponse.json([], { status: 200 });
  }
}
